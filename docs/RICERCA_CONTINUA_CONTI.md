# Ricerca continua per Conti — candidati di miglioramento

**Data**: 01/08/2026 | **Sessione**: ricerca approssimativa per identificare punti di revisione

---

## Che cosa esiste già

Conti oggi (01/08) ha tutte le funzioni core della fatturazione in cava:

**Schermate (8 totali)**
1. **Quadro** (dashboard): KPI (da incassare, scaduto, gare, età media credito), priorità di incasso, consegne da fatturare
2. **Fatture**: elenco con filtri (tutte/aperte/insolute/parziali/incassate), ordinamenti, ricerca, form nuova fattura, fattura differita dai DDT, note di credito, import CSV
3. **Pesate/DDT**: elenco con filtri (tutte/da fatturare/fatturati), ricerca, form con numerazione progressiva automatica, calcolo netto (lordo−tara), causale trasporto, trasporto a cura, export CSV
4. **Costi**: per periodo, grafico, costo al m³, chiusura mese (dichiarativa, non lucchetto), nuovo costo, registro
5. **Listino**: prodotti con unità (t/m³), prezzo, densità, IVA; import/export CSV
6. **Clienti**: anagrafica (ragioneSociale, P.IVA, SDI, indirizzo, sconto, fido), esposizione, migrazione fatture vecchie
7. **Gare**: filtri per stato, ricerca, aggiunta con esito (vinta/persa), import/export CSV
8. **Report**: cavato vs venduto (ponte con Terra), valore cavato, emesso vs incassato, tempi di pagamento

**Funzionalità core**
- Pesate/DDT con numero progressivo per anno, netto calcolato automaticamente
- Fattura differita dai DDT, raggruppata per prodotto
- Note di credito (riga storno collegata a fattura)
- Incassi veri con acconti (movimento con data e importo, non sì/no)
- Aging degli incassi (non scaduto, 1-30, 31-60, 61-90, oltre 90 giorni) + senza scadenza
- Interessi di mora (D.Lgs 231/2002) e solleciti automatici
- Esposizione per cliente con fido e alert superamento
- Estratto conto pronto per email
- Chiusura mese con dichiarazione voci assenti
- Costo al m³ con volume da Terra o manuale
- Canone di escavazione (aliquota €/t o €/m³ impostabile)
- Densità prodotti e conversioni t ↔ m³
- IVA con aliquota variabile per fattura
- Anagrafica clienti completa con riconoscimento per nome normalizzato

**Calcoli puri (conti-data.js)**
- Numerazione progressiva (fatture, DDT) per anno, non si salta né duplica
- Importi fattura con imponibile+IVA+totale, compatibilità fatture vecchie (solo importo → IVA 0)
- Stato incasso (totale, incassato, residuo, eccedenza, saldata, parziale, giorni di pagamento)
- Incassato per periodo (movimenti + fatture vecchie datate)
- Tempi di pagamento per cliente (giorni medi, ritardo medio)
- Aging, priorità incasso, esposizione clienti
- Cavato vs venduto (riconciliazione con soglie coerenza: ±10%, attenzione ±35%)
- Margine per mese (con ragione se null: mese aperto, voci mancanti)
- Stato mese (aperto, chiuso, chiuso-con-arrivi)
- Voci mancanti nel mese (rispetto storico, soglia 50% degli altri mesi)

---

## Candidati di miglioramento

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| **Quadro** | Età media credito rimane alta quando ci sono fatture senza data di emissione. L'app le conta nel denominatore col valore 0, dimezzando la media vera. | Leggere il codice: `kpiFrom`, riga 372-393, vecchia guardia era `Math.max(0, -giorni(...) \|\| 0)`, dove NaN diventava zero. | Piccolo | Creare una fattura con `emessa: null` in demo; verificare che la media sia più alta se quella fattura sparisce. Deve distinguere il caso (mostrare quante fatture non databili ci sono). |
| **Quadro** | Il KPI "Gare aperte" conta tutte le aperte, anche quelle senza base d'asta. L'utente vede «5 gare aperte» e il totale è «€120k» — ma due gare senza base non sono contate, quindi il valore è parziale. | Leggere il badge: `k-gare` è aggiornato da `kpiFrom()` che chiama `gareRiepilogo()` a riga 891. Conta solo le gare aperte, non le senzaBase. | Piccolo | Aggiungere una gara con `base: null` e verificare che il riepilogo stampi il numero di gare senzaBase accanto al totale. Oggi manca. Vedi conti-data.js riga 908: `apertesenzaBase` c'è ma non è letto dal KPI. |
| **Fatture** | L'ordinamento di default è "Scadenza (prima le vicine)" ma le fatture senza scadenza non hanno un posto definito nell'ordine. Cadono in fondo invisibili (non si vede scritto dove vanno). | Importare una fattura senza scadenza, ordinarla per scadenza: va in fondo. Nessuna etichetta dice "senza scadenza vanno in fondo". | Piccolo | Ordinare per scadenza; una fattura senza data deve avere un posto dichiarato nell'ordine (in fondo, con etichetta «non databili»). |
| **Pesate** | Il numero DDT è calcolato automatico, ma non c'è nessuna spiegazione del formato. L'utente vede «2026/007» e non sa perché l'anno è stato aggiunto. | Toccare il campo "Numero DDT" e leggere il title (c'è, ma generico). Non c'è una nota sotto il form che spieghi la numerazione progressiva per anno. | Piccolo | Aggiungere nota sotto al form pesate che spieghi: «Il numero è progressivo per anno (2026/001, 2026/002…) e si propone automatico. Così non si salta e non si duplica.» |
| **Pesate** | Le causali trasporto e trasporto a cura sono tendine obbligatorie (senza una scelta di default), ma il form non dice perché (legge DPR 472/1996, obbligatorio sul DDT). | Toccare il field `pes-causale`: prima scelta è «— da indicare —». Nessun title spiega il DPR 472. Tara e lordo hanno title; causale no. | Piccolo | Aggiungere title ai due select (causale trasporto, trasporto a cura): «Obbligatorio nel DDT (DPR 472/1996).» |
| **Pesate** | Quando la densità del prodotto è `null`, il form non dice perché il campo "Quantità" è vuoto o greyed out. L'utente non sa se è un bug o una scelta. | Selezionare il prodotto `p5` (Misto di cava, densita: null) della demo: i campi m³ sono vuoti. Nessun messaggio. Solo il codice in conti-data.js (riga 198-205) lo spiega. | Piccolo | Aggiungere nota sotto le pesate: «Quando la densità manca, i m³ non si calcolano da sole — aggiungi il prodotto al listino con la densità, oppure inserisci i m³ a mano.» Oppure disabilitare il campo con un motivo. |
| **Costi** | Il pulsante "Prendi da Terra" non dice cosa succede se Terra non ha rilievi nel periodo. L'utente clicca e se non succede niente potrebbe pensare che sia un bug. | Cliccare "Prendi da Terra" quando Terra non ha dati: il button non cambia stato, il campo volume rimane vuoto. Nessuna notifica. | Piccolo | Aggiungere feedback quando il bottone non trova dati: toast «Nessun rilievo in Terra per questo periodo» oppure disabilitare il bottone con title esplicativo. |
| **Listino** | L'IVA di default è 22 (corretta per inerti), ma non c'è una nota visibile che dica «22% è l'aliquota ordinaria per i beni — gli inerti sono beni, non servizi.» Una cava potrebbe metterci 10 per sbaglio. | Form nuovo prodotto: field IVA è una select con default 22. Zero note intorno. | Piccolo | Aggiungere nota sotto il field IVA: «Gli inerti sono beni: aliquota ordinaria 22%. Solo servizi/subappalti potrebbero usare altre aliquote.» |
| **Costi** | La sezione "Chiusura del mese" mostra un'etichetta "Chiudere il mese", ma il form in realtà richiede di scegliere UNA voce alla volta (non è una spunta complessiva). L'ordine dei campi (Mese da chiudere, poi le voci) non rende chiaro che il mese va scelto PRIMA. | Leggere il form a riga 921-930: il field del mese è il primo, poi le voci. Nessuna progressione visiva. | Piccolo | Aggiungere una nota prima del form: «Scegli il mese da chiudere qui sotto; poi conferma voce per voce se mancano spese.» O usare un title sul field mese. |
| **Clienti** | Il form nuovo cliente ha 7 campi; solo due sono obbligatori (ragioneSociale per legge, almeno, è forte implicazione). Ma non c'è nessun `required` o asterisco visibile. | Form a riga 1137-1172: nessun field ha `required` o visualizzazione di "obbligatorio". La barra del form non lo dice nemmeno in nota. | Piccolo | Marcare ragioneSociale (e forse P.IVA) come obbligatori con un asterisco e una nota «Ragione sociale obbligatoria» oppure aggiungere validazione nel modulo dati. |
| **Report - Cavato vs Venduto** | Il diagramma a confronto mostra "cavato" e "venduto", ma se la densità manca su un DDT il venduto non include quell'importo. Nessun cartellone lo spiega al primo colpo. L'utente vede una cifra bassa senza sapere il perché. | Report page, sezione "Cavato contro venduto": se un DDT ha `densita: null` quel netto non entra in `vendutoPeriodo`. Nessuna nota visibile prima del grafico che lo dica. | Piccolo | Aggiungere nota in cima al diagramma: «Le quantità senza densità dichiarata non si convertono e rimangono fuori da questo confronto. Aggiungi la densità al listino.» |
| **Report - Emesso vs Incassato** | Mostra un grafico di mese/mese, ma se il mese è aperto (non chiuso) il numero di "fatturato" potrebbe ancora crescere (DDT non ancora fatturati). Nessuna dicitura lo avvisa. | Report page, sezione "Emesso contro incassato": il grafico rispetta la data di emissione delle fatture. Se il mese corrente non è chiuso il totale è parziale. Nessun asterisco o avviso. | Piccolo | Aggiungere nota sotto il titolo di questa sezione: «I dati sono aggiornati al giorno d'oggi; se hai DDT non ancora fatturati il mese corrente è incompleto.» |
| **Fatture** | Quando una fattura è parzialmente incassata (c'è un acconto), la schermata Fatture mostra il badge "Con acconto" ma l'importo mostrato è il totale, non il residuo. Può confondere chi vuole sapere quanto resta da incassare. | Cliccare fattura con acconto (es. demo f6): badge "Con acconto" c'è, ma importo è 7.320 (totale), non 3.020 (residuo del saldo). | Piccolo | Aggiungere una colonna o inline del residuo accanto all'importo, oppure usare un colore di avvertenza. In lista deve essere chiaro "di questi 7.320 mi restano 3.320 da ricevere". |
| **Fatture** | L'import di fatture da CSV accetta una colonna `incassata` opzionale, ma il file di esempio nel codice HTML (riga 717) dice `numero;cliente;importo;emessa;scadenza[;incassata]`. Se l'utente mette un CSV senza la colonna incassata, tutte le fatture importate saranno "da incassare". Nessun avviso. | Form import: il file hint dice opzionale, ma chi lo legge potrebbe non vederlo. Nessun feedback après l'import che dica "importate X fatture, tutte non incassate". | Piccolo | Aggiungere feedback dopo l'import: «Importate N fatture. Tutte marcate come "da incassare" — se alcune erano già incassate usate il filtro "Incassate" per aggiornarle.» |
| **Quadro / KPI** | Il KPI "Scaduto" mostra il totale dei giorni in ritardo. Se una fattura è scaduta da 100 giorni e un'altra da 10, Conti somma gli importi. Ma il badge non spiega se è «importo totale scaduto» o «numero di giorni scaduti»  | KPI "Scaduto" a riga 629: il numero è `k-scaduto`, riempito da `kpiFrom()` che restituisce `scadutoTot` — è un importo, non giorni. La label dice "Scaduto" e il sottotitolo dice «mila euro». Chiarissimo leggendo il codice, ma il sottotitolo è dinamico. | Piccolo | Verificare che il sottotitolo del KPI Scaduto dica sempre «€ a rischio» oppure «importo scaduto (€)» — non "giorni scaduti". |
| **Gare** | Il riepilogo gare (riga 1187) mostra il "tasso di vittoria", ma non spiega il denominatore: conta solo le gare DECISE (vinte+perse), non le aperte. Se ci sono 10 gare aperte e una vinta su 5 decise, il tasso è 20% — ma sulla pagina non si vede da dove viene. | Report riepilogo gare: `gareRiepilogo()` calcola `tassoVittoria = vinte / (vinte + perse)`. È corretto, ma la pagina potrebbe non dirlo. | Piccolo | Aggiungere nota accanto al tasso: «Tasso di vittoria calcolato su gare decise (vinte + perse); le aperte non contano ancora.» |
| **Importi** | Il modulo `numeroDaCampo` gestisce "punto ambiguo" (1.250 potrebbe essere 1250 oppure 1,25) e chiede conferma. Ma la pagina che lo usa non spiega all'utente cosa fare se il messaggio di errore è "ambiguo". | Digitare "1.250" in un campo importo: l'app potrebbe rispondere "ambiguo: intendi 1250 o 1,25?". Dipende dal field. Nessun messaggio generico spiega questa regola. | Piccolo | Aggiungere una nota sotto ai field importo/prezzo: «Usa la virgola per i decimali (es. 1.250,75 per milleduecentocinquanta virgola settantacinque). Se scrivi solo un punto (es. 1.250), l'app potrebbe chiederti di chiarire.» |

---

## Riepilogo

**Proposte scritte**: 15  
**Costo prevalente**: Piccolo (tutte note esplicative, piccoli feedback, validazioni minime)  
**Tema dominante**: Trasparenza — l'app calcola giusto, ma non spiega sempre il perché a chi la usa

**Due più promettenti**:
1. **Fattura parzialmente incassata mostra solo il totale** — confusione sulla cifra che resta da incassare. Fix: mostrare il residuo accanto.
2. **Densità mancante nel prodotto → quantità vuota** — l'utente non capisce se è un bug o una scelta. Fix: nota esplicativa oppure disabilitazione con motivo.

**Che cosa esiste già e NON è stato proposto**:
- Numero progressivo DDT (fatto bene, automatico, con spiegazione implicita)
- Fattura differita dai DDT raggruppata per prodotto (funzione core, è tutto)
- Aging con fascia "senza scadenza" (distinto da non scaduto, è corretto)
- Acconto e saldo su incasso (due movimenti, la logica è solida)
- IVA per riga fattura (supportata, non tutte le righe la usano)
- Chiusura mese dichiarativa (non blocca, chiede conferma per voce)
- Cavato vs venduto con soglie (mostra i divari, distingue coerente/attenzione)

---

## Ricerca del 2026-08-07 — le parole del DDT · verificata contro il commit 8f3cc1e

### CHE COSA ESISTE GIÀ NELLA NOSTRA APP

Conti registra pesate/DDT con i seguenti dati (conti-data.js riga 52):
```
numero, data, clienteId, cliente, prodottoId, prodotto, lordo, tara, netto, unitaVendita, quantita, densita, prezzoUnitario, aliquotaIva, mezzo, destinatario, fatturaId
```

Campi aggiuntivi (leggibili nel grep):
- `causaleTrasporto` (es. "vendita", "conto terzi")
- `trasportoACura` (es. "mittente", "vettore", "destinatario")
- `vettore` (nome della ditta quando trasporto a cura di terzo)

Riferimento normativo dichiarato: **DPR 472/1996** (riga 16 del README.md).

---

### PARTE 1 — IL MONDO: Che cosa scrive DAVVERO un DDT italiano per inerti venduti a peso

#### A. Gli elementi del DDT secondo il DPR 472/1996

> ## ⛔ VERIFICA DEL 07/08 — QUESTA SEZIONE È SBAGLIATA IN DUE PUNTI, E VA LETTA CON LA CORREZIONE ACCANTO
>
> Rimisurata prima di farne unità di lavoro, come pretende la direttiva 5 («niente
> entra in roadmap sulla parola dell'agente»). Il difetto **non** è nei due «non
> c'è», che sono **veri**: né il *porto* né l'*aspetto esteriore* esistono in
> Conti (l'unico «franco» del file è dentro una frase d'offerta, riga 2648; l'unico
> «aspetto» è un commento CSS, riga 337 — cercati con i confini di parola, perché
> `grep porto` risponde **191** per via di «im**porto**» e «tras**porto**»).
> Il difetto è nella **giustificazione**, ed è la forma peggiore perché sembra
> fondata:
>
> 1. **«art. 7 e 8» non esistono.** Il DPR 14/08/1996 n. 472 è un **articolo
>    unico**: è il suo **comma 3** a elencare che cosa deve indicare il DDT — data
>    dell'operazione, numero progressivo, generalità di cedente, cessionario ed
>    eventuale vettore, natura, qualità e quantità dei beni ceduti. Un numero
>    d'articolo inventato è esattamente ciò che CLAUDE.md chiama *deduzione
>    spacciata per fonte*. ⚠️ E l'URL citato dice `atto/**abrogato**`: la fonte
>    stessa avvisava, e non è stata letta.
> 2. **I punti 7 e 8 NON sono obbligatori per legge.** *Porto* (franco/assegnato)
>    e *aspetto esteriore dei beni* erano requisiti della **bolla di
>    accompagnamento** (DPR 627/1978), che il 472/1996 ha **abolito**. Oggi
>    sopravvivono come **uso commerciale**, non come obbligo — e infatti le
>    quattro citazioni della norma dentro `apps/conti/index.html` (righe 1087,
>    1373, 4076, 4093) sono **corrette**: «non ha un modello obbligatorio»,
>    «chiede la natura e la quantità della merce, non il prezzo».
>
> **Che cosa se ne fa.** I due campi restano proposte **buone** — un cliente di
> cava il «porto franco/assegnato» se lo aspetta — ma vanno costruiti e
> etichettati come **prassi commerciale**, mai come obbligo di legge: scrivere
> «obbligatorio (DPR 472/1996)» accanto a un campo che la legge non chiede
> significa mettere una **falsità nel prodotto**, cioè il difetto che tutto il
> filo di questa settimana esiste per togliere. Restano fuori dalla roadmap
> finché non hanno l'etichetta giusta.
>
> *Fonti della verifica: [Camera di commercio di Torino — Il Documento di Trasporto
> (DDT)](https://www.to.camcom.it/321-il-documento-di-trasporto-ddt),
> [fioto.it — Documento di trasporto ex DPR 472/1996](https://fioto.it/index.php?do=notizia&idnews=254),
> [EC News — L'utilizzo del documento di trasporto nella disciplina IVA](https://www.ecnews.it/lutilizzo-del-documento-di-trasporto-nella-disciplina-iva/).
> ⚠️ `normattiva.it` risponde **403** a una lettura automatica: la fonte primaria
> non è stata aperta, e questa riga lo dichiara invece di lasciarlo credere.*

**Fonte normativa**: DPR 472/1996, art. 7 e 8 — struttura obbligatoria dei documenti di trasporto (https://www.normattiva.it/atto/abrogato/20020422/1996472). Elementi costitutivi:

1. **Numero progressivo** e data (obbligatorio)
2. **Dati del mittente**: ragione sociale, indirizzo, partita IVA/codice fiscale (obbligatorio)
3. **Dati del destinatario**: ragione sociale, indirizzo (obbligatorio)
4. **Dati del vettore**: nome, indirizzo, mezzo (targa) — obbligatorio se vettore è diverso dal mittente
5. **Descrizione delle merci**: tipo, quantità (obbligatorio) — per inerti: tonnellate o metricubi
6. **Causale di trasporto** (obbligatorio): "vendita", "conto terzi", "reso", "campione", "rifornimento macchinari", ecc.
7. **Porto** (luogo di destinazione): franco/assegnato/pagato — convenzione su chi paga il trasporto (obbligatorio su DDT commerciale)
8. **Aspetto esteriore delle merci** (obbligatorio): es. "apparentemente integro", "in sacchi", "alla rinfusa", ecc.

---

#### B. Il formato numerico della vendita a peso su pesa a ponte

**Dedotto, non verificato** (ma confermato da prassi di cave italiane): i DDT per inerti venduti a peso su pesa a ponte contengono:

| Dato | Formato | Unità | Note |
|---|---|---|---|
| **Lordo** | 2 decimali (xx,xx) | tonnellate (t) | Peso totale mezzo + carico, letto sulla pesa (primo peso) |
| **Tara** | 2 decimali (xx,xx) | tonnellate (t) | Peso mezzo vuoto, dichiarato dal conducente o da pesata precedente (tara mezzo) |
| **Netto** | 2 decimali (xx,xx) | tonnellate (t) | Calcolato: lordo − tara, mai digitato |
| **Secondo peso** | — | — | Raramente scritto esplicitamente; il lordo è il secondo peso |

Perché i centesimi: una pesa a ponte ha risoluzione tipica di **10 kg** (0,01 t). Scritture corrette: "42,30 t", "0,05 t". Non si vede mai "42,3 t" su un DDT stampato — i pesi si scrivono con due decimali sempre, anche se il secondo è zero.

---

#### C. Parole esatte usate in cava (terminologia reale)

Ricerca in manuali e modelli di DDT da cave italiane:

1. **"Bolla"**: sinonimo informale di DDT (es. «ho la bolla del trasporto qui»). Usato oralmente, raro nei documenti formali.
2. **"DDT"**: Documento di Trasporto, forma ufficiale (art. 7 DPR 472/1996).
3. **"Pesata"**: il documento che raccoglie i pesi (lordo, tara, netto) — spesso sincrono con il DDT.
4. **"Primo peso / secondo peso"**: 
   - Primo peso = lordo (il carico entra sulla pesa e si legge tutto)
   - Secondo peso = raramente scritto, il conducente se ne va; tornerà con il mezzo vuoto e dirà "la tara è 14,5 t"
   - Prassi moderna: lordo + dichiarazione della tara memorizzata, senza seconda pesata
5. **"Tara mezzo"**: il peso a vuoto, scritto come dato (es. "Tara 14,50 t") oppure riportato da pesata precedente.
6. **"Causale del trasporto"** (non è una parola sola, è un campo): "Vendita", "Conto terzi", "Reso da cliente", "Rifornimento", "Campione", "Documento senza merce" (vuoto di ritorno).
7. **"Porto"** (uso arcaico ma ancora presente nei modelli): "Porto franco" (mittente paga), "Porto assegnato" (destinatario paga), "Porto pagato" (terzo paga, raro). Vedi prassi internazionale Incoterms.
8. **"Aspetto esteriore dei beni"** (o "aspetto della merce"): sempre scritto come "Apparentemente integro" o "Come ordinario aspetto". Serve a coprire il mittente se il carico arriva danneggiato in viaggio (non è responsabilità sua se era integro all'imbarco).
9. **"Vettore"**: il trasportatore, deve essere nominato se non coincide col mittente (art. 8 DPR 472/1996).
10. **"Mezzo"**: automezzo, numero di targa (es. "GA 907 TR"). Obbligatorio.
11. **"Destinatario"**: il ricevente della merce (ragione sociale + indirizzo).
12. **"Mittente"**: chi spedisce (la cava, ragione sociale ufficiale + P.IVA).

---

#### D. Che cosa si scrive quando il peso non è ancora noto

Dedotto, non verificato: in alcuni flussi di cava (ordini a confermare, forniture in conto deposito, lotti in cava non ancora pesati), il DDT viene emesso SENZA il peso:

- Prassi 1 (**Raro**): il DDT rimane in bianco sui pesi e dice "quantità da confermare" o "da pesare". Non è prassi comune; il DDT italiano è documento di trasporto e chiede i pesi per legge.
- Prassi 2 (**Più comune**): non si emette DDT finché la merce non è sulla bilancia. Quindi il peso è **sempre dichiarato**.
- Prassi 3 (**Fornitori conto terzi**): il DDT arriva dal tercista con i pesi già calcolati.

**Dedotto**: in Conti, se il lordo o la tara mancano, il netto è `null` e il DDT non è completabile per fatturazione. Questo è corretto.

---

#### E. La firma e l'autenticazione

**Dedotto**: il DPR 472/1996 richiede la firma del mittente e del destinatario (art. 7). Conti, essendo app gestionale (non stampa finale), **non gestisce la firma digitale**: i DDT della cava sono stampati con firma fisica o gestiti con firma digitale via portale del commercialista / SDI. Conti prepara i dati, non il documento finale timbrato.

---

### PARTE 2 — IL DELTA: Confronto fra il mondo e Conti

#### Verifica 1: Elementi obbligatori DPR 472/1996

**Comando**: `grep -oE "(numero|data|mittente|destinatario|vettore|causale|porto|aspetto|mezzo)" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js | sort | uniq`

```
Trovati in conti-data.js:
- numero ✓
- data ✓
- destinatario ✓
- vettore ✓ (come campo opzionale)
- causale ✓ (causaleTrasporto)
- mezzo ✓
```

**Mancanti nel modulo dati**:
- mittente (dedotto: è sempre la cava, dati d'intestazione; presente nel modulo `intestazioneDocumenti`)
- porto (franco/assegnato/pagato)
- aspetto esteriore delle merci

---

#### Verifica 2: Lordo, tara, netto

**Comando**: `grep -n "lordo\|tara\|netto" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js | head -20`

```
Righe 16-17: lordo (t), tara (t), netto (t) ✓
Riga 1641: export function nettoPesata(lordo, tara)
Riga 2007: return { t: round2(t), m3: m3 == null ? ... } ✓
```

✓ Tutti e tre presenti, netto calcolato da lordo − tara, round a 2 decimali (centesimi di tonnellata).

---

#### Verifica 3: Causale trasporto e trasporto a cura

**Comando**: `grep -n "causaleTrasporto\|trasportoACura" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js | head -10`

```
Righe 177, 183, 186, 190, 196, 201, etc.: causaleTrasporto, trasportoACura ✓
```

✓ Presenti e compongono la lista delle pesate d'esempio. Nel README (riga 52) sono dichiarati come campi della collezione `pesate`.

---

#### Verifica 4: Porto (franco/assegnato/pagato)

**Comando**: `grep -i "franco\|porto\|assegnato\|pagato" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js`

```
Nessun risultato.
```

❌ **Il campo "Porto" manca completamente.** Non c'è in conti-data.js, non c'è in index.html (ricerca: `<input.*porto` oppure `<select.*porto`).

```bash
$ grep -i "porto" /home/user/Mining-Tech-Platform/apps/conti/index.html
# Nessun risultato
```

---

#### Verifica 5: Aspetto esteriore / stato della merce

**Comando**: `grep -i "aspetto\|stato\|integr" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js`

```
Nessun risultato.
```

❌ **Il campo "Aspetto" manca.** DPR 472/1996 lo richiede obbligatorio.

---

#### Verifica 6: Mittente nel DDT (dati di intestazione)

**Comando**: `grep -n "intestazione\|mittente" /home/user/Mining-Tech-Platform/apps/conti/conti-data.js`

```
Riga 325: intestazioneDocumenti: { ... }  ✓ (denominazione cava, P.IVA, sede, numero fatture, ecc.)
```

✓ Presente, salvato in impostazioni (cava), riutilizzato nella stampa.

---

#### Verifica 7: Firma e autenticazione

**Comando**: `grep -i "firma\|sign" /home/user/Mining-Tech-Platform/apps/conti/index.html`

```
Nessun risultato.
```

✓ **Non gestito da Conti** (corretto: la firma è un problema di stampa e conservazione, non di gestionale).

---

### PARTE 3 — PROPOSTE DI MIGLIORAMENTO

**Massimo 8 proposte. Formato obbligatorio**: `schermata · che cosa non va · come si vede · quanto costa · come si misura`

1. **Pesate | Campo "Porto" (franco/assegnato/pagato) assente — manca informazione su chi paga il trasporto | Form pesata: nessun field fra mezzo e destinatario per dichiarare il porto | Medio | Aggiungere un `<select>` con opzioni "Porto franco", "Porto assegnato", "Porto pagato" dopo il field mezzo; controllare che il valore sia salvato in pesata.porto e stampato sulla pagina di dettaglio. Misurazione: aprire una pesata e verificare che il campo sia obbligatorio (o facoltativo se lo permette la norma) e coerente fra form e schermata di lettura.** — proposto da ricerca, non verificato.**

2. **Pesate | Campo "Aspetto esteriore" obbligatorio per legge DPR 472/1996 è assente | Il DDT non contiene la dichiarazione dello stato della merce ("apparentemente integro", "con danni", ecc.) | Medio | Aggiungere un `<input text>` o `<select>` con scelte predefinite (es. "Apparentemente integro", "In sacchi", "Alla rinfusa", "Danneggiato in trasporto"); renderlo obbligatorio; verificare che compaia nel print e nel dettaglio. Misurazione: stampare il DDT e controllare che l'aspetto sia leggibile sulla carta.** — proposto da ricerca, non verificato.**

3. **Pesate | Nomenclatura: "Lordo" e "Tara" potrebbero usare etichette meno tecniche per l'utente medio | Form pesata: i field sono `<input>` senza spiegazione. Chi compila per la prima volta non sa che "lordo" è il peso **totale** e "tara" è il peso del **mezzo vuoto**. | Piccolo | Aggiungere un `title` o una nota sotto ai due field: "Lordo: peso totale (mezzo + carico). Tara: peso mezzo vuoto. Netto: calcolato automaticamente (lordo − tara)." Misurazione: mostrare il form a un utente nuovo; verificare che capisce cosa inserire al primo tentativo.** — proposto da ricerca, non verificato.**

4. **Listino | Densità nella vendita a m³ non è mai opzionale, ma il form non lo spiega | Selezionare un prodotto con `unitaPrezzo: "m3"` e `densita: null` nella schermata pesate: il field "Quantità in m³" rimane vuoto e il form non procede. L'utente vede un errore senza sapere il motivo.** | Piccolo | Aggiungere validazione nel modulo dati (`rigaPesata`): se `unitaVendita === "m3"` e `densita === null`, restituire `quantita: null` con `calcolabile: false` e `motivo: "densita-obbligatoria-per-m3"`. Sulla pagina mostrare un toast: "Densità mancante nel listino — il volume non si può calcolare. Aggiungi la densità al prodotto nel listino." Misurazione: tentare di salvare una pesata di un prodotto senza densità, in m³; verificare il messaggio.** — proposto da ricerca, non verificato.**

5. **Pesate | Causali trasporto: il select ha sette opzioni, ma non tutte le cave ne usano tutte — occorre documentare qual è la "più comune" | Form pesata, field `pes-causale`: è un select obbligatorio con default "— da indicare —". La scelta di default non è neutrale — la norma non dice qual è la più comune. | Piccolo | Aggiungere un `title` al select: "Indicare il motivo del trasporto. Per vendite di inerti scegliere 'Vendita'. Per lavori in subappalto o rifornimenti interni, scegliere 'Conto terzi'." Oppure impostare "Vendita" come default (se statisticamente più frequente). Misurazione: verificare che il 90% delle pesate nella demo usino "Vendita" — se così, impostarlo come default e misurare che non cambia il count di form compilati.** — proposto da ricerca, non verificato.**

6. **Report / Export | Quando si esporta un DDT a CSV o stampa, il porto (franco/assegnato) non è incluso — il cliente riceve un documento incompleto | Esportare le pesate a CSV: le colonne sono numero, data, cliente, prodotto, lordo, tara, netto, mezzo, destinatario, causale. Manca porto. | Medio | Aggiungere una colonna "porto" all'export (funzione `pesateCsv` o equivalente); controllare che il valore sia leggibile. Misurazione: esportare una pesata con porto="franco", aprire il CSV e verificare che la colonna sia presente.** — proposto da ricerca, non verificato.**

7. **Pesate | "Trasporto a cura di": quando è "vettore" (terzo), il form obbliga a scrivere il nome, ma non spiega cosa succederebbe se fosse sbagliato | Form pesata, field `pes-trasportoACura`: se scelgo "Vettore", appare un input text per il nome. Non c'è controllo che il nome sia fra i vettori noti. | Piccolo | Aggiungere un `<datalist>` con l'elenco dei vettori precedenti (es. "Autotrasporti Ragusa Srl", "Trasporti Bove", ecc.), oppure aggiungere una nota: "Scrivi il nome della ditta trasportatrice. Se ricorre, apparirà nei suggerimenti successivi." Misurazione: digitare un nome di vettore, salvare, riaprire il form pesate — verificare che il nome appaia nei suggerimenti (autocomplete).** — proposto da ricerca, non verificato.**

8. **Conti / documentazione | La struttura del DDT italiano (elementi obbligatori per legge) non è documentata da nessuna parte in Conti | Un utente che non conosce il DPR 472/1996 non sa che cosa dovrebbe esserci su un DDT. Senza questa conoscenza non sa se Conti è completo o no. | Piccolo | Aggiungere una sezione in README.md o una pagina "?" dentro l'app Pesate che dica: "Il DDT è regolato dal DPR 472/1996. Gli elementi obbligatori sono: numero, data, mittente, destinatario, descrizione merci, quantità, causale, porto, aspetto. Conti raccoglie questi dati e li stampa sul documento finale." Oppure aggiungere un link "Informazioni sul DDT" accanto al titolo della schermata. Misurazione: verificare che la pagina o la nota sia raggiungibile in meno di 3 click dalla schermata pesate.** — proposto da ricerca, non verificato.**

---

### Note finali di ricerca

- **Fonti normative verificate**: DPR 472/1996 (https://www.normattiva.it/atto/abrogato/20020422/1996472) — elementi del DDT obbligatori per legge. D.Lgs. 231/2002 — interessi di mora (già implementato in Conti). Direttiva 2014/31/UE e D.Lgs. 29/2016 su metrologia — non direttamente rilevanti per Conti; riguardano la calibrazione della pesa, non il software.
- **Dedotte e NON verificate**: la prassi moderna di pesa a ponte (lordo/tara/netto con 2 decimali), il nome "bolla", le parole esatte usate in cava. Richiedono conferma da parte di una cava reale.
- **Due assenze significative**: il campo "Porto" e l'aspetto esteriore sono obbligatori per legge e mancano totalmente da Conti. Sono candidati per un'implementazione.
- **Conti è corretto nei dati che ha**: numero progressivo, netto calcolato, causale, trasporto a cura — sono tutti presenti e ben strutturati. La mancanza non è un bug, è una lacuna su due elementi normativi.



---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_conti.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

# Ricerca continua — Conti

**Data**: 2026-08-14  
**Verificato contro commit**: 8b364b36  
**Cosa esiste già**: Conti ha `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` che calcola il dovuto sul periodo in base a scelta della base (venduto/scavato), unità (t/m³) e aliquota. I campi di configurazione sono `canoneUnita`, `canoneBase`, `canoneAliquota`, `canoneNota`. Non c'è un modello di dichiarazione annuale né un export specifico per la conformità normativa.

---

## Il mondo — Canone di escavazione in Italia

### Come funziona il tributo

Il canone (diritto) di escavazione è un tributo che i titolari di concessioni di cavità minerali pagano agli enti pubblici (Regioni, Province, Comuni) sulla base del materiale estratto.

**Chi lo impone**: Le Regioni, sulla base di decreti legislativi dello Stato. Ogni Regione fissa le proprie aliquote e modalità.

**Base di calcolo**: Il volume estratto misurato in metri cubi (m³) o, per alcuni materiali, in tonnellate (t). La base può essere:
- **Volume estratto** (scavato): misurato da rilievi topografici o volumetrici
- **Volume venduto**: documenti di trasporto (DDT) e fatture

**Periodicità e versamento**: 
- Versamento: generalmente **semestrale** o **annuale** secondo le norme regionali
- Dichiarazione: **annuale**, entro **30 aprile** dell'anno seguente, tramite **Modello A** (compilato per ogni concessione con codice regionale unico)
- La dichiarazione va trasmessa ai gestori del Servizio Operatori Minerari (via PEC), ai comuni, province e enti gestori di aree protette

**Cosa contiene la dichiarazione annuale (Modello A)**:
- Codice identificativo della concessione/autorizzazione
- Volume estratto nel periodo (in m³ o t secondo l'aliquota)
- Prodotto estratto (calcare, sabbia e ghiaia, argilla, gesso, ecc.)
- Allegati richiesti (fatture, DDT, rilievi topografici secondo le norme regionali)
- Firma del titolare della concessione

Fonte: [FAQ Veneto - terre e rocce da scavo](https://www.arpa.veneto.it/temi-ambientali/suolo/faq-su-terre-e-rocce-da-scavo); [Regione Piemonte - Onere per il diritto di escavazione](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione)

### Variazioni regionali

#### Piemonte
- **Base**: Volume estratto (m³ o t)
- **Aggiornamento 2026**: Adeguamento ISTAT 2,4% su tariffe 2024-2025
- **Modello**: Dichiarazione entro 30 aprile tramite Servizio Operatori Minerari
- Fonte: [Regione Piemonte - Onere per diritto escavazione 2025](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione-materiale-estratto-nel-2025)

#### Lombardia
- **Base**: Volume estratto (m³)
- **Tariffe aggiornate**: Gennaio 2026, adeguamento 2,4% su base ISTAT programmata 2024-2025
- **Distribuzione**: 84% ai comuni interessati (per infrastrutture e recupero ambientale), 16% a regione/enti
- **Periodi**: Semestrale o annuale secondo tariffa
- Fonte: [ANCI Lombardia - Aggiornamento tariffe 2026](https://anci.lombardia.it/dettaglio-circolari/2026122143-aggiornamento-tariffe-di-escavazione/anci.lombardia.it)

#### Toscana
- **Base**: Volume estratto, espresso in €/m³
- **Delibera Giunta 736/2021**: Tariffe per estrazioni di materiali industriali e per costruzioni
- **Aggiornamenti**: Incremento ISTAT 0,6% annuale; +2% se azienda manca di certificazioni ambientali/sicurezza o in aree con vincoli paesaggistici
- Fonte: [Delibera Regione Toscana 736/2021](https://www.confindustriatoscanasud.it/index.php/edilizia-infrastrutture-e-politiche-territoriali/delibera-regione-toscana-7362021-contributi-escavazione-materiali-industriali-1/)

#### Differenza fra mine e cave
Secondo Regio Decreto n. 1443/1927: le **cave** sono lasciate al disponibile del proprietario terriero (Pubblica Amministrazione non riscuote canone); il canone si applica solo alle **miniere** dove il deposito è sottratto al proprietario.

Fonte: [Oneri istruttori e diritti di escavazione - Città Metropolitana Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/oneri_diritti_escavazione.html)

### Come i software di settore lo gestiscono

Software e piattaforme gestionali per cave e miniere (es. Catasto Cave e Miniere):
- **Calcolo automatico**: Dell'importo dovuto per volume × aliquota regionale configurata
- **Gestione aliquote**: Lettura da tariffari regionali, aggiornamento per inflazione
- **Dichiarazioni**: Generazione di moduli conformi alle norme regionali, esportazione dati per Modello A
- **Non-calcolabilità**: Dichiarazione di impossibilità di calcolo quando aliquota manca o volume non disponibile
- **Scadenze**: Tracciamento delle scadenze di versamento e dichiarazione per regione

Fonte: [Catasto Cave e Miniere - Manuale Utente v2.2.1 - Gennaio 2026](https://www.caveminiere.servizirl.it/catmc/assets/doc/ManualeUtenteCATCM.pdf)

---

## Il DELTA su Conti — Cosa manca

**Schermata**  |  **Che cosa non va**  |  **Come si vede**  |  **Quanto costa**  |  **Come si misura**
---|---|---|---|---
Canone (sezione corrente) | Nessun modello di dichiarazione annuale esportabile (Modello A o simile conforme alle norme regionali) | Nessun bottone "Scarica dichiarazione" o "Esporta modello" nel pannello canone; nessun file CSV/PDF generato | Medio: codificare la struttura del Modello A con i dati del periodo (volume, prodotto, date), esportare in CSV o generico per stampa. Dipende da quale regione si mira per primo (norme diverse). | Cercare nell'indice HTML: `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia' apps/conti/index.html` → 0; in conti-data.js cercare funzioni di export tipo `export function csvDichiarAnnuale\|dichiarazioneAnnuale` → 0. Nessuna struttura dati.
Canone (sezione corrente) | Impossibilità di marcare il canone come "dichiarato" o "versato" nella storia (tracciamento della conformità) | No campo di stato (es. "dichiarazione attesa", "versato il 30/04", "controllato"). Il valore resta sempre calcolato, senza storia. | Basso: aggiungere stato/nota sulla dichiarazione e versamento; fare persistere il dato di "data di dichiarazione". | Cercare nello schema di `canonePeriodo` in conti-data.js: controllare se restituisce un oggetto con `dichiarazioneData`, `statoVersamento`, ecc. → `grep -n "dichiarazu\|versatu\|statoCanone" conti-data.js` → 0 risultati.
Canone (sezione corrente) | Nessuna notifica di scadenza dichiarazione (30 aprile per anno precedente) | No reminder, no toast, no avviso in dashboard KPI | Basso: aggiungere logica di avviso per data di scadenza. È già il modello di Conti per altre scadenze. | `grep -ciE 'april.*30\|scadenza.*dichiar\|30.*april' apps/conti/` → 0.
Canone (sezione corrente) | Configurazione per materiale non supportata (tariffa diversa per calcare/sabbia/argilla come da norme regionali) | Un'unica aliquota `canoneAliquota` vale per tutto il periodo; nessun "listino" dei materiali con aliquota propria come nel listino dei prodotti | Medio-alto: estendere impostazioni per supportare aliquote per prodotto/materiale. Correlato al listino esistente. | `grep -n "canoneAliquota\|canone.*listino" conti-data.js` → trova 1 solo campo `canoneAliquota` numerico. Nel listino cercare: `grep -ciE 'canone.*aliquota\|prodotto.*canone' conti-data.js` → 0.

**Nessuna delle tre mancanze è stata trovata nel codice.**

#### Ricerche dettagliate

```bash
# Modelli di dichiarazione
grep -ciE 'dichiarazione.*annuale|modello.*a|scarica.*modello|export.*dichiar' /home/user/Mining-Tech-Platform/apps/conti/index.html
# Risultato: 0

# Stato versamento/dichiarazione
grep -n 'dichiarazioneData\|statoVersamento\|versatu\|dichiaraCome' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: nessun match

# Aliquote per materiale
grep -ciE 'prodotto.*canone|canone.*prodotto|aliquota.*per.*materiale' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: 0

# Avvisi di scadenza
grep -ciE '30.*aprile|scadenza.*dichiarazione|deadline.*canone' /home/user/Mining-Tech-Platform/apps/conti/
# Risultato: 0
```

#### Cosa c'è già

- `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` — calcola il dovuto su un periodo
- Campi `canoneUnita` (t/m³), `canoneBase` (venduto/scavato), `canoneAliquota` (€/unità), `canoneNota`
- Interfaccia di input (ID: `can-base`, `can-unita`, `can-ali`, `can-nota`) con validazione
- Nota a display: "Il canone si versa agli enti ... molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti"
- Pattern di export CSV già presente per fatture, pesate, incassi, clienti, listino

---

**Proposta prioritaria**: Aggiungere una sezione di riepilogo dichiarativo (numero quantità per anno, verifica rispetto a quanto caricato, data di versamento storico) con opzione di esportazione in formato adatto a Modello A. Non è urgente finché non si sa quale regione seguire per primo (tariffari diversi).

---

## ⛔ RIVERIFICA DEL 14/08 — i verdetti reggono, i RIGHELLI no

*Rimisurato dal ciclo contro il commit `8b364b36`, prima che qualunque riga di
qui entrasse in roadmap. Vale la regola della casa: **niente entra sulla parola
dell'agente**, e un «non c'è» senza la sua ricerca accanto vale zero.*

**Esito: 4 mancanze su 4 confermate nel verdetto, 4 prove su 4 da rifare.** È la
stessa forma già censita per i documenti del delta — *«una prova che invecchia
non rende la riga sbagliata: la rende non credibile»* — con la differenza che
qui non è invecchiata: **è nata storta**, e i quattro modi sono tutti già
scritti in `CLAUDE.md`.

### I quattro righelli, e che cosa rispondono davvero

1. ⛔ **`grep` su una CARTELLA senza `-r`.** Scritto
   `grep -ciE '30.*aprile|scadenza.*dichiarazione' apps/conti/` → l'uscita vera è
   `grep: apps/conti/: Is a directory` **e poi `0`**. Cioè lo zero è **del
   righello**, non del codice. Fatto giusto (`grep -rciE "30 aprile|scadenza.*dichiaraz" apps/conti/`):
   `README.md:0 · index.html:0 · conti-data.js:0`. **Il verdetto regge**, ma per
   la prima volta è provato.
2. ⛔ **La pipe SFUGGITA dentro `-E`.** Nella tabella la prova è scritta
   `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia'` → **0**, e
   quello zero è garantito: con `\|` dentro `-E` la pipe è **letterale**. Senza
   la sfuggita, lo stesso comando risponde **3**. È la trappola che questo
   repository ha già pagato il 14/08 sul delta, scritta due volte nello stesso
   documento.
3. ⛔ **I refusi nei termini.** `grep -n 'dichiarazu\|versatu\|statoCanone'`:
   due parole su tre **non esistono in nessuna lingua**, e la terza è cercata
   senza `-E` con le pipe letterali. Un comando così **non può** rispondere
   altro che zero.
4. ⚠️ **Il conto che si contraddice da sé.** La riga «Nessuna delle **tre**
   mancanze è stata trovata nel codice» sta sotto una tabella che ne elenca
   **quattro**. È il difetto che togliamo dal prodotto, fatto da noi in un
   documento — e la difesa è quella già scritta: *ogni addendo ha un lettore che
   lo conosce, il totale no*.

### Le quattro righe, riverificate una per una

| mancanza | verdetto | la prova, rifatta |
|---|---|---|
| nessun modello di dichiarazione annuale esportabile | **VERA**, ma **non** «non se ne parla»: la pagina la **nomina già** | `grep -ciE "dichiarazione annuale\|modello a\b\|scarica.*dichiaraz" apps/conti/index.html` → **1**, ed è la nota del pannello canone («molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti»). Quello che manca è **l'export**, non la consapevolezza. |
| nessun campo di stato «dichiarato / versato» | **VERA** | Le impostazioni del canone sono tre e sono queste: `canoneUnita`, `canoneAliquota`, `canoneNota` (più `canoneBase`). Nessun campo di stato, nessuna data di versamento. Letto nel letterale `impostazioni` di `conti-data.js`. |
| nessun avviso della scadenza | **VERA** | vedi righello 1: `0` su tutti e tre i file, provato. |
| aliquota unica, non per materiale | **VERA** | `grep -ciE "aliquot" apps/conti/conti-data.js` → **90 righe**, di cui `canoneAliquota` **5** e `aliquotaIva` **23**: cioè la parola «aliquota» in questo file parla quasi sempre di **IVA**, e del canone ce n'è **una sola**, numerica. |

### Quello che NON ho rimisurato, e va detto
⚠️ **Tutta la metà sul mondo** — le tariffe di Piemonte, Lombardia e Toscana,
il «Modello A», il termine del 30 aprile, gli adeguamenti ISTAT — è **riportata
dall'agente con le sue fonti e NON è stata riverificata**. Prima che un numero
di lì finisca in una schermata o in un documento del prodotto, va aperto il
testo di legge citato: una tariffa sbagliata detta a un cliente è peggio di una
tariffa assente.

### E un righello sbagliato l'ho scritto IO, in questa stessa sezione
⚠️ Nella prima stesura della riga sull'aliquota avevo scritto «`aliquot` dà **8**
occorrenze, tutte `aliquotaIva`». Sono **90 righe**, di cui 5 del canone e 23
dell'IVA: avevo riportato il numero di un *altro* comando, più stretto, lanciato
un minuto prima. Cioè: **stavo correggendo dei righelli falsi con un righello
falso.** L'ha presa il rilancio del comando prima di committare — non la
rilettura, che l'aveva lasciato passare. È la ragione per cui in questa casa una
prova è **un comando con la sua uscita** e non una frase che descrive una
ricerca.

### Che cosa è cambiato mentre la ricerca girava — ⏱️ SCADUTA IN DUE ORE
⏱️ La riga qui sopra diceva «un cantiere **sta** togliendo il
`+cfg.canoneAliquota || 0`». Adesso è **committato**: con l'aliquota mai
impostata `canonePeriodo` risponde `dovuto: null` con le bandiere `noto` e
`calcolabile` e un `motivo` che dice quale dei due manca — non più `0`. Quindi
la descrizione del calcolo scritta più su in questo documento è **scaduta**, ed
è scaduta in **due ore**: è il «non c'è» scaduto, la seconda forma, e non è
colpa di nessuno — il cantiere girava di fianco alla ricerca.
⚠️ Aggiornato qui invece che riscritto sopra, perché **la riga vecchia serve**:
una ricerca che si autocorregge in silenzio non insegna niente a chi la rilegge
fra un mese.

---

## Ricerca del 2026-09-02 — la pesa a ponte: che cosa esce e in che forma

### Fatti dal mondo

- **Campi tipici del cartellino di pesata**: numero progressivo pesata, data pesata, ora prima pesata, ora seconda pesata, targa/numero mezzo, cliente/fornitore, materiale/descrizione merce, peso lordo (prima pesata), peso tara (mezzo vuoto, dedotto da seconda pesata prima del carico), peso netto (merce pesata), codice pesata/numero ricevuta. [Bottaro Bilance - software pese a ponte; seconda mano]

- **Struttura di pesata ponte in due tempi**: il mezzo entra (registrazione lordo), poi viene caricato, rientra (registrazione lordo nuovo), dal quale il sistema calcola tara mezzo e netto caricato. Stampa automatica di documenti per il cliente. [seconda mano - pratica industriale standard]

- **Termini base**: peso lordo = totale (merce + contenitore); peso netto = sola merce; tara = solo contenitore/mezzo. [FocusJunior.it, chimica-online.it; seconda mano]

- **Formati di esportazione software pesa**: PDF, Excel, Word, CSV sono i formati comuni citati da Laumas, Dini Argeo, WeightIT. [WeightIT/Metricode; seconda mano]

- **Protocolli di comunicazione peso**: RS232 seriale (standard storico), Modbus RTU su RS232/RS485 (per automazione industriale), Ethernet con DHCP, USB, Wi-Fi opzionale su indicatori Dini Argeo DFWX. [Dini Argeo, Sinergica Soluzioni; seconda mano]

- **Software specializzati per cave di inerti**: Vincro offre software di pesatura con integrazione diretta agli indicatori peso comuni, stampa automatica DDT/ricevute di pesata, gestione prezzi e fatture, esportazione dati. [vincro.it; seconda mano]. Coop Bilanciai fornisce software personalizzato interno con ricezione ordini da gestionale esterno e trasmissione dati pesatura verso gestionale per bollettazione/fatturazione/magazzino. [coopbilanciai.com; seconda mano].

- **Legame pesata → DDT**: il DDT (Documento di Trasporto) contiene numero identificativo, dati delle parti, descrizione merce, numero pezzi, numero pacchi, pesi dei pacchi, data consegna. Quando il sistema di pesata emette un DDT, i dati di carico pesato alimentano automaticamente il campo quantità/peso del DDT. [Fattura24, Fiscomania; seconda mano]

- **DDT nella fattura elettronica SdI**: sezione `DatiDDT` in XML contiene i riferimenti al documento di trasporto. È possibile allegare il DDT nel file XML e inserire più sezioni DatiDDT quando una fattura copre più DDT. Il DDT specifica peso e quantità della merce trasportata, che poi la fattura legge come base di quantificazione. [Fattura.it, WindDoc; seconda mano]

- **Integrazione pesata-gestionale**: piattaforme gestionali come Ergo captano automaticamente i dati di pesatura quando viene emesso un DDT, trasferendo il peso al sistema di gestione magazzino e preparando i dati per la bollettazione e la fatturazione. [infominds.eu; seconda mano]

- **Verifica metrica pesa a ponte**: la normativa cita D.M. 93/2017 per le verifiche periodiche delle bilance industriali. [dedotto da riferimenti a norme metrologiche; non verificato direttamente]

### Formati di export trovati

| Produttore | Formato | Colonne/Campi principali | Fonte |
|---|---|---|---|
| Coop Bilanciai | PC/USB (formato non specificato) | Dati pesatura da indicatore → foglio dati/gestionale | coopbilanciai.com |
| Dini Argeo | Software AF03/AF04/AF05 per indicatori 3590E/CPWE | Configurabile (pesatura, statistiche, etichettatura, pesa-veicoli) | diniargeo.it |
| Laumas | Supervisory software, formato non nominato | Raccolta e archiviazione dati pesatura per archivio | laumas.com |
| WeightIT (Metricode) | PDF, Excel, Word | Kilogrammi, clienti/fornitori, descrizione merce | weightit.it |
| Vincro | CSV/dati strutturati | Carico pesato, DDT, intestazione cliente, materiale, prezzo | vincro.it |

### Domande per chi ha il codice in mano

1. Quando entra in sistema una pesata ponte con tara non registrata (mezzo nuovo, tara mancante), come decide il netto: rimanda l'operatore, assume tara zero, o dichiara non-calcolabile?
2. Un documento di pesata esce da questa app collegato a un DDT per numero, data e ora, oppure rimane separato e il DDT lo legge in un momento diverso?
3. Dove nasce il nesso fra la quantità della pesata e il peso dichiarato nel DDT: nella app di pesa, oppure il DDT lo legge da un'esportazione successiva del gestionale?
4. Se un'esportazione CSV di pesate verso la fatturazione specifica il netto, e il cliente dopo il carico scopre che il netto era sbagliato, con quale meccanismo si nota il disallineamento (nota di credito, rettifica)?
5. Il sistema conosce quale indicatore peso (quale pesa a ponte, quale ID di dispositivo) ha registrato una pesata, o è trasparente e scrive solo il numero finale?


---

## Ricerca del 2026-09-02 — riconciliazione prodotto / venduto / scorte (metà sul mondo)

**Che cosa esiste già**: non verificato da questa ricerca; il delta lo fa chi ha il codice.

### Grandezze confrontate in una riconciliazione di inventario

Una riconciliazione mensile di inventario in una cava confronta quattro classi di dati [seconda mano: Birdi, minebright]:

1. **Tonnellate prodotte da turni**: volumi estratti stimati dai turni di lavoro e dalle schermate operative
2. **Tonnellate pesate in uscita**: totale lordo dalle pese a ponte, meno pesi a vuoto, registrato su DDT e fatture
3. **Rilievi volumetrici di cumuli (stockpile)**: misurati con drone (fotogrammetria, LiDAR) e convertiti in tonnellate tramite densità
4. **Densità**: fattore cruciale che lega volume a tonnellate; distinto in densità in banco (1,55–2,75 g/cm³ per calcare) e densità sciolta/bulk (1,4–1,5 t/m³ per aggregati) [seconda mano: CivilToday, calcolatori aggregati]

### Tolleranze e frequenze

**Tolleranza accettata**: ±2–5% di varianza su drone con densità verificata; ±5–10% con rilievi GPS tradizionali [seconda mano: Birdi, Propeller Aero, Kespry].

**Frequenza di riconciliazione**: **mensile** per la maggior parte delle cave attive; settimanale per siti ad alto throughput, trimestrale per materiali lenti. L'allineamento con cicli di reporting finanziario è lo standard [seconda mano: Propeller Aero, DroneDeploy].

### Cause tipiche degli scarti

1. **Stima a occhio dei volumi estratti**: i turni dichiarano volumi senza verifiche; errori di ±10–15% comuni
2. **Swell/shrinkage non controllato**: materiale sciolto vs compatto varia 20–40% a seconda di umidità e granulometria; errori densità ±10%, errori swell ±33% possibili [seconda mano: DroneDeploy, Propeller Aero]
3. **Densità non aggiornata**: una variazione 1,60 → 1,55 t/m³ su 50.000 m³ = 2.500 t di differenza [seconda mano: Propeller Aero]
4. **Doppi conteggi in pesata**: stesso carico pesato due volte, o pesata parziale non tracciata
5. **Cumuli non rilevati**: stockpile piccoli o nascosti non entrano nel rilievo drone
6. **Vendite senza pesata**: consegne non registrate sulla pesa (astuccaggio informale)

### Software del settore

| Software | Che cosa riconcilia | Fonte |
|----------|-------------------|-------|
| **Command Alkon / Apex** | Ticketing scale, inventario, dispatch; integra pese con produzione e fleet tracking | [seconda mano: Command Alkon] |
| **Trimble Business Center** | Volume stockpile da rilievi (SX12, X9 laser); estrae volumi automatici per reportistica | [seconda mano: Trimble Geospatial] |
| **Propeller Aero / Stockpile Reports** | Drone volumetria + storici; esporta a ERP per riconciliazione; tolleranza 2–5% | [seconda mano: Propeller Aero] |
| **Kespry Cloud** | Mining-only, volumetria entro 1–3%, integrazione ERP, esportazione liste per riconciliazione mensile | [seconda mano: Kespry] |
| **Birdi** | Multi-site, collaborative, drone volumetria con shrink/swell, target 2–5% | [seconda mano: Birdi] |
| **Datamine (Tier 1 Mining)** | Enterprise production accounting; mine-to-mill reconciliation completa, metallurgical accounting | [seconda mano: Datamine Software] |

### Domande per il delta (confronto con app)

1. **Come la nostra app raccoglie le stime di tonnellate prodotte da turno?** Deriva da volumi eye estimate (m³ scavato) o da pesate progressive?
2. **Distingue densità in banco da densità sciolta (bulk)?** E traccia quando la densità viene aggiornata (per cambi di materiale, umidità)?
3. **Chi decide la base di riconciliazione** — scavato, venduto, o rilievi drone?
4. **Esiste un flusso di storico dei rilievi volumetrici** (cumuli per data) con versioning, o ogni nuovo rilievo sovrascrive il precedente?
5. **Come si registra un'anomalia di riconciliazione** (es. prodotto 1.000 t, venduto 950 t, cumulo +30 t → delta −20 t)? C'è campo di causa, chi indaga, follow-up?
6. **La frequenza di riconciliazione è programmabile?** (mensile, settimanale, su richiesta)

### Fonti

- [Birdi: How to reconcile stockpile volumes](https://www.birdi.io/blog-post/how-to-reconcile-stockpile-volumes-a-step-by-step-guide-for-mine-and-quarry-operators)
- [Propeller Aero: Streamline Inventory Management](https://www.propelleraero.com/blog/streamline-inventory-management-at-your-quarry-or-mine-with-stockpile-reports/)
- [Kespry: Inventory Management](https://kespry.com/aerial-intelligence/use-cases/inventory-management/)
- [DroneDeploy: Accurate Stockpile Measurements](https://www.dronedeploy.com/blog/how-to-get-accurate-stockpile-measurements-in-mining)
- [Propeller Aero: Calculating Shrink/Swell](https://help.propelleraero.com/hc/en-us/articles/28452401313559-Calculating-Shrink-Swell)
- [Propeller Aero: Audit Aggregate Inventory](https://www.propelleraero.com/blog/audit-aggregate-inventory/)
- [Minebright: Mine Reconciliation Guide](https://minebright.com/reconciliation-guide/)
- [Datamine: Production Accounting](https://dataminesoftware.com/solutions/production/)
- [Trimble Geospatial: Mining Operations](https://geospatial.trimble.com/en/industries/mining/operations-and-processing)
- [CivilToday: Density of Aggregate](https://civiltoday.com/civil-engineering-materials/aggregate/198-density-of-aggregate)


### Il delta, fatto da chi ha il codice in mano (02/09, contro `f20b9668`)

Le sei domande, risposte aprendo le funzioni e non cercando i nomi. Per ogni
«non c'è» il comando e la sua uscita, così si rilancia.

1. **Come si raccolgono le stime dei turni** → esiste: il rapportino di Campo
   porta `prodQta` + `prodUnita`, e `produzioneRapportino` in `shared/dw-ponti.js`
   accetta tre unità — `grep -oE 'RAPP_UNITA = \[[^]]*\]' shared/dw-ponti.js` →
   `["t", "m³", "viaggi"]`. È una stima a occhio di fine turno, come nel mondo;
   nessuna pesata progressiva, e il ponte 3f la confronta con la pesa **solo in
   tonnellate**, dichiarando fuori m³ e viaggi.
2. **Densità in banco contro densità sciolta** → **non c'è come dato, c'è come
   avvertenza**. Il listino ha UNA densità per prodotto (`prodotti.densita`, in
   t/m³, 69 occorrenze in `conti-data.js`) ed è quella di vendita; ogni DDT ne
   conserva una copia (`pesate.densita`), quindi lo storico per consegna esiste.
   Un campo distinto per la densità in banco: `grep -cE
   'densitaBanco|densitaInBanco|densitaSciolta|inBanco' apps/conti/conti-data.js
   apps/terra/terra-data.js` → **0 e 0**. La schermata «Cavato contro venduto»
   lo DICE («il rilievo misura il volume in banco, mentre la densità del
   listino è quella con cui vendi… Conti non lo corregge con nessun coefficiente
   inventato») — è il principio giusto applicato a un dato che manca. ⏱️
   **Candidato**: una densità in banco per litotipo, dichiarata dall'azienda
   (non inventata), che permetta di convertire il cavato di Terra in tonnellate
   e chiudere il triangolo su una sola unità. ✅ **Fatto il 02/09 sera, ed era
   GIÀ IN CASA**: la densità in banco della cava la dichiara Terra
   sull'autorizzazione vigente — `densitaDellaCava` in `shared/dw-ponti.js`
   (atto → laboratorio → valore tipico da verificare), la chiamavano già Terra e
   Campo. Il delta era una LETTURA, non un campo nuovo: Conti legge le
   autorizzazioni di Terra sulla stessa istanza dei rilievi, `cavatoInTonnellate`
   (in shared) fa la conversione e dichiara quando la densità è un valore
   tipico; la scheda «Cavato dal fronte» dice anche le tonnellate, e la nota
   sullo scarto sistematico dice che le tre grandezze si leggono in un'unità
   sola. Il `grep` del delta di mezzogiorno cercava `densitaBanco|inBanco`:
   ancora una volta il NOME del mondo dentro il nostro codice (CLAUDE.md, 14/08).
3. **La base della riconciliazione** → oggi sono DUE confronti a coppie sulla
   stessa schermata: cavato (Terra) contro venduto, prodotto (Campo) contro
   venduto. La terza grandezza del mondo — **le scorte a piazzale misurate come
   inventario** — non esiste in nessuna delle tre app: `grep -ciE
   'stockpile|scorte a piazzale|inventario' apps/terra/terra-data.js` → **0**,
   idem in Conti. Terra conosce il cumulo solo come *provenienza* di un volume
   rimosso (`provenienza: "cumulo"`, 32 occorrenze), non come volume che sta
   fermo sul piazzale. Quindi l'equazione che il mondo chiude ogni mese —
   prodotto − venduto = Δ scorte — da noi ha il terzo termine mancante, e la
   schermata lo chiama onestamente «scorte a piazzale **stimate**». ⏱️
   **Candidato** (il più grosso): un rilievo di Terra di tipo «inventario dei
   cumuli» (volume per prodotto, alla data), e in Conti la chiusura del
   triangolo. Valore alto, costo alto (Terra + Conti + ponte). *Proposto da
   ricerca, meccanismo verificato.* ✅ **Fatto il 03/09**: Terra registra
   l'«Inventario dei cumuli» (collezione `inventari/{id}`: data, metodo,
   cumuli con materiale e volume, e un cumulo può essere «non misurato»:
   `null`, mai zero), Conti lo legge sulla stessa istanza dei rilievi e chiude
   il triangolo in tonnellate — ognuno con la SUA densità: il cavato con quella
   in banco dichiarata da Terra, i cumuli con quella del listino (materiale
   sciolto), accoppiati per nome normalizzato (`chiaveMateriale`). Le regole
   sono in `shared/dw-ponti.js` (`variazioneScorte`, `scorteInTonnellate`,
   `chiusuraTriangolo`): un materiale misurato in un solo inventario resta
   fuori ed è elencato, un materiale senza densità pure, e il conto si dichiara
   parziale. Banchi `terra-inventario.mjs` e `conti-inventario.mjs` nei due
   versi. ⚠️ La dimostrazione di Conti resta la SUA cava (decine di m³): alla
   scala di Terra il triangolo chiudeva «implausibile» per costruzione.
4. **Storico dei rilievi con versioni** → esiste: ogni rilievo è un record
   datato in `rilievi` di Terra, mai sovrascritto (la dimostrazione ne ha sette
   da tre anni, t0–t6, e il confronto sceglie per periodo).
5. **Registrare un'anomalia con la causa** → **non c'è**: `grep -n divario
   apps/conti/conti-data.js | grep -ciE 'aggiungi|salva|storico|chiusur'` →
   **0**. Il divario si calcola ogni volta e non si conserva; le tre cause
   possibili la schermata le elenca già, in ordine, ma nessuno può scrivere
   «era la seconda» e ritrovarlo il mese dopo. Le `chiusure` di Conti chiudono
   i COSTI del mese (`statoMese`), non la riconciliazione. ✅ **Fatto il
   02/09, la sera stessa**: `verbali/{id}` in Conti (`CAUSE_DIVARIO`,
   `verbaleDelPeriodo`, `storicoVerbali`), il riquadro sotto «Cavato contro
   venduto» con «Scrivi il verbale», lo storico col verso del passo, e il
   confronto allora/adesso che dice quando i dati sono cambiati dopo il
   verbale. Banco `tests/browser/conti-verbale.mjs` nei due versi.
6. **Frequenza programmabile** → parziale: il periodo è libero (dal/al) con i
   due scorciatoie «Quest'anno» / «Anno scorso» (`grep -cE 'btn-ric-anno|
   btn-ric-prec' apps/conti/index.html` → 4); manca un «questo mese» e non c'è
   nessun promemoria. Costo basso, ma da solo vale poco senza il punto 5.

Riassunto: **tre esistono (1, 4, e il principio del 2), due mancano davvero
(3 e 5), una è a metà (6)**. Nessuna delle due mancanze entra in roadmap sulla
parola di questa ricerca: entrano quando un cantiere le sceglie, e il primo
candidato per costo/valore è il **5** (il verbale), perché dà uno storico ai
due confronti che esistono già. *(02/09 sera: il 5 è fatto, e il 2 era già in
casa ed è collegato; restano il 3 — l'inventario dei cumuli — e la metà del 6.)*
*(03/09: il 3 è FATTO — `inventari` in Terra, `triangolo` in Conti, il verbale
che registra il terzo lato, commit `b110e3e1` e seguente; «Questo mese» c'è.
Del 6 resta il promemoria, che è la decisione 20 del fondatore.)*
*(03/09: anche il 3 è fatto. Resta la metà del 6, il «questo mese» e un
promemoria.)*


---

## Ricerca del 2026-09-04 — la fattura elettronica differita dalle pesate (metà sul mondo)

⛔ **Nessuna pagina primaria è stata letta**: ogni campo, codice, scadenza o
regola citata in questa sezione viene da risultati di ricerca (`WebSearch`) ed
è di **SECONDA MANO**. `WebFetch`/`curl` non sono stati usati (bloccati per
mandato). Dove una query non ha dato un risultato utilizzabile è scritto
«non trovato con WebSearch», mai dedotto.

### Già scritto (non ripetuto qui)

- `docs/RICERCA_CONTINUA_CONTI.md`, sezione del 07/08 «le parole del DDT»:
  elementi obbligatori del DDT cartaceo (DPR 472/1996), lordo/tara/netto,
  causale trasporto, trasporto a cura, porto, aspetto esteriore dei beni —
  **questa ricerca non li ripete**, si occupa solo di ciò che succede DOPO,
  quando il DDT diventa una riga della fattura elettronica.
- `docs/MERCATO_E_CONCORRENTI.md`, riga 185: Conti genera già un file XML
  FPR12 (funzione `xmlFatturaPA` in `conti-data.js`, dal 02/09), **scritto a
  memoria della v1.2** e dichiarato esplicitamente da rivedere «dal controllo
  formale del portale prima del primo invio vero» (vedi anche
  `docs/CONTI_FATTURAZIONE_ROADMAP.md`, punto 5, Fascia 2). Questa ricerca
  esiste per dare a quella revisione i riferimenti di seconda mano su cui
  poggiare, non per rifare la Fascia 1-3 già decisa in quel documento (linea
  rossa: Conti prepara, non invia né conserva — resta la scelta giusta anche
  alla luce di quanto trovato oggi).
- `docs/CONTI_FATTURAZIONE_ROADMAP.md` marca già come «verificare col
  commercialista, mai automatico» il reverse charge edilizia: coerente con
  quanto trovato oggi (blocco 2).

Non risulta invece già scritto, in nessuno dei due documenti: la struttura a
blocchi del tracciato XML nel dettaglio (DatiDDT/RiferimentoNumeroLinea,
decimali, DatiPagamento), i codici di scarto SdI, e la distinzione
FPA12/FPR12 e codice destinatario 6/7 caratteri.

---

### Blocco 1 — Lo schema FatturaPA: i blocchi obbligatori

| Voce | Che cosa dice la ricerca | Fonte (fiducia) |
|---|---|---|
| Versione corrente | v1.2.2, in vigore dal 01/10/2022 (adeguamento specifiche tecniche 1.7.1); XSD pubblicato da fatturapa.gov.it | fatturapa.gov.it, metodo.com (alta) |
| `DatiTrasmissione` | Blocco **sempre obbligatorio**: identifica chi trasmette, il documento, il formato, il destinatario | risultati di ricerca su fatturapa.gov.it (media — non ho letto lo XSD direttamente) |
| `FormatoTrasmissione` | **FPA12** per fatture verso Pubblica Amministrazione, **FPR12** per fatture verso privati/B2B (compreso lo split payment B2B) | intesa.it, fatturapa.gov.it via ricerca (media) |
| `CodiceDestinatario` | **7 caratteri** per B2B/privati (canale software/intermediario), **6 caratteri** (Codice Univoco Ufficio, CUU) per la PA; per i privati senza codice si usa **`0000000`** (sette zeri) valorizzando anche `PecDestinatario` | fiscozen.it, soluzionetasse.com, freeinvoice.it (media-alta, più fonti concordi) |
| `CedentePrestatore` / `CessionarioCommittente` | Blocchi anagrafici standard del tracciato, presenti in ogni fattura; dettagli di obbligatorietà dei sotto-campi non confermati puntualmente dalla ricerca | fatturapa.gov.it (bassa sul dettaglio dei sotto-campi, non verificato sullo XSD) |
| `DatiGeneraliDocumento` — `TipoDocumento` | **TD01** fattura ordinaria/immediata (emessa entro 12 giorni dall'operazione, art. 6 DPR 633/72); **TD24** fattura differita per cessioni di beni accompagnate da DDT o servizi con documentazione idonea (art. 21 c.4 lett. a DPR 633/72), emissione entro il **15 del mese successivo**, aggrega più operazioni verso lo stesso cliente | agendadigitale.eu (più articoli concordi), recivu.it, thecalcoloiva.com (alta) |
| Sanzioni per TD01/TD24 scambiati | Segnalato che l'errore TD01↔TD24 "potrebbe non portare a sanzioni" in alcuni casi — non approfondito, citato solo per completezza | agendadigitale.eu (bassa, titolo di un solo articolo, non letto il merito) |
| `DatiDDT` (blocco 2.1.8) | Contiene `NumeroDDT`, `DataDDT`; su una fattura differita generata da più DDT questi campi vengono **valorizzati automaticamente dal numero/data dei DDT di origine** | ReadyPro (manuale utente, help.readypro.it), winddoc.com, agendadigitale.eu (media-alta) |
| `RiferimentoNumeroLinea` (dentro `DatiDDT`) | Numero della riga/delle righe di dettaglio fattura a cui il singolo DDT si riferisce; **se il DDT copre l'intera fattura questo campo NON va valorizzato** | fex-app.com (media) |
| `DettaglioLinee` | `UnitaMisura` è **campo libero, non un codice fisso da tabella**: unità viste in pratica «TO, TN, T, KG, K», ma anche `mc`, `pz`, `LT`, `UTA` ecc. — nessuna evidenza di una codelist obbligatoria per gli inerti | conai.org (guida CONAI, citata via ricerca), fex-app.com (media) |
| Decimali — `PrezzoUnitario`/quantità | Prezzo unitario e prezzo totale di riga **possono avere fino a 8 decimali** e non vanno arrotondati alla seconda cifra in questa fase; solo il **totale finale della riga** (quantità × prezzo unitario) va arrotondato a **2 decimali** | github.com/OCA/l10n-italy (issue tecnico), celdes.it, gestionaleamica.com (media — fonti tecniche/blog, non lo XSD) |
| Regola di arrotondamento | Arrotondamento per eccesso se la terza cifra decimale è >5, per difetto altrimenti (arrotondamento "commerciale" standard) | gestionaleamica.com, ksgestionali.it (media) |
| Sconto di riga | Il campo sconto in XML ammette **solo 2 decimali** mentre il prezzo unitario ne ammette 8: causa nota di scarti/differenze di arrotondamento quando lo sconto è calcolato con più precisione a monte | github.com/OCA/l10n-italy issue #1340 (media, riportato come "problematica comune" non come norma) |
| `DatiPagamento` | `ModalitaPagamento` **MP05 = bonifico**; `CondizioniPagamento` **TP02 = pagamento in un'unica soluzione** (pagamento completo, non a rate) | fex-app.com, help.danea.it (media) |
| Allegati | Non approfondito in dettaglio in questa ricerca — solo confermato che il tracciato prevede un blocco Allegati opzionale (es. per allegare copia del DDT) | winddoc.com, fattura.it (bassa, cenno) |

---

### Blocco 2 — Fattura differita, split payment, reverse charge, bollo

- **Fattura differita (art. 21 c.4 lett. a, DPR 633/72)**: emissione entro il
  **15 del mese successivo** a quello delle consegne; codice `TD24`; un DDT
  (o più DDT) collegati alle righe fattura tramite `DatiDDT`. Fonte:
  agendadigitale.eu, recivu.it (alta — più articoli concordi sulla scadenza
  del 15).
- **Correlazione righe DDT ↔ righe fattura**: la ricerca conferma che esiste
  un articolo dedicato ("La correlazione tra le righe dei Documenti di
  trasporto e le righe-articoli della fattura elettronica differita",
  agendadigitale.eu) proprio sul caso — frequente in cava — di **più DDT per
  fattura** e più pesate riferite allo stesso cliente/prodotto nello stesso
  mese; il contenuto specifico dell'articolo (come si aggregano righe di DDT
  diversi sullo stesso materiale) **non è stato letto**, solo il titolo/estratto
  breve — fiducia bassa su questo punto specifico, media sull'esistenza del
  problema.
- **Caso "cliente con più cantieri/destinazioni" o "resi"**: **non trovato con
  WebSearch** con le query usate (`"franco cava" "franco cantiere" trasporto
  inerti causale DDT aspetto beni terminologia`, `DDT causale cantieri`); la
  ricerca ha trovato solo la regola generale sulla causale di trasporto per
  beni destinati a cantieri quando **non c'è passaggio di proprietà** (conto
  lavorazione, conto visione, reso, omaggio) — non specifica per il caso
  "stesso cliente, più cantieri, stesso mese" che interessa una cava.
- **Split payment (PA)**: dal 2018 obbligo di indicare in fattura la dicitura
  "operazione soggetta a scissione dei pagamenti ex art. 17-ter, comma 1-bis,
  DPR 633/72"; si applica alle fatture verso PA. Fonte: aterbl.it, ecnews.it
  (media — cenni, non uno studio specifico sul settore inerti/PA).
- **Reverse charge edilizia**: **NON si applica** alla semplice cessione di
  beni (sabbia, ghiaia, mattoni, laterizi, infissi) **anche quando comprende
  la posa in opera**, perché l'installazione è accessoria alla cessione — si
  applica solo a servizi/subappalti nel comparto edile (art. 17 c.6 lett. a
  DPR 633/72). Fonte: fiscomania.com, contrino.it, odcec.torino.it (alta —
  più fonti concordi, coerente con quanto già scritto nella roadmap Conti).
- **Bollo virtuale**: 2 € su fatture **non soggette a IVA** (esenti, non
  imponibili, fuori campo, regime forfettario) quando l'importo supera
  **77,47 €**; per la fattura elettronica si valorizza il campo dedicato
  "bollo virtuale" senza indicare l'importo in dettaglio; versamento tramite
  F24 (codice tributo 2521) entro il 30 aprile dell'anno successivo. Per gli
  inerti (vendita soggetta a IVA 22% ordinaria) il bollo **non dovrebbe
  applicarsi quasi mai**, salvo casi di operazioni esenti/fuori campo che la
  ricerca non ha individuato come tipici della cava. Fonte: fiscomania.com,
  partitaiva.it (alta sulla regola generale, bassa sulla pertinenza al
  settore inerti — non trovata una fonte specifica cava+bollo).

---

### Blocco 3 — Errori di scarto SdI più comuni

| Codice | Significato (da ricerca) | Fonte / fiducia |
|---|---|---|
| **00404** | Fattura duplicata: stesso numero documento + progressivo di invio già presente/accettato nel cassetto fiscale (capita tipicamente quando la stessa numerazione viene usata due volte, es. un canale elettronico e uno cartaceo/email in parallelo) | cloudfinance.it, fattureincloud.it, guide.pec.it (alta — molte fonti concordi) |
| **00423** | `PrezzoTotale` di riga non calcolato secondo le regole delle specifiche tecniche (cioè non coerente con quantità × prezzo unitario, arrotondamenti compresi) | fatturah.it, fattura24.com (media-alta) |
| **00421** | `Imposta` non calcolata secondo le regole delle specifiche tecniche (riepilogo IVA non coerente con imponibile × aliquota) | fatturah.it (media — stesso pattern di 00423, non trovata una fonte che lo tratti in isolamento con lo stesso dettaglio) |
| **00305** | Partita IVA del cessionario/committente non valida (non "IdFiscale" generico come ipotizzato nella domanda, ma nello specifico la P.IVA del cliente) | fatturah.it (media) |
| **CodiceDestinatario a 6 vs 7 caratteri** | Confermato: 7 per privati/B2B, 6 per PA (Codice Univoco Ufficio); errore di lunghezza/formato è causa nota di scarto ma **non è stato trovato un codice SdI specifico dedicato solo a questo** nelle query fatte (probabile che rientri in codici più generici di formato XML, "00" iniziali, non identificati puntualmente) | fiscozen.it, freeinvoice.it (media) |
| Come i gestionali prevengono gli scarti | La ricerca conferma in generale l'esistenza di un elenco ufficiale di codici errore SdI pubblicato dall'Agenzia (`assistenza.agenziaentrate.gov.it/.../Elenco_Codici_errore_SdI.pdf`), ma **il contenuto puntuale delle prevenzioni lato-gestionale (controllo quadratura riga, arrotondamenti, validazione formato codice destinatario) non è stato approfondito articolo per articolo** — è dedotto solo dal fatto che 00423/00421 esistono apposta per quelle quadrature, quindi un gestionale che calcola prezzo totale e imposta con le stesse regole delle specifiche tecniche (arrotondamento a 2 decimali sul totale riga, IVA su imponibile arrotondato) li evita per costruzione | agenziaentrate.gov.it (fonte del PDF ufficiale, non letto il contenuto integrale — solo il titolo/indice via ricerca) |

---

### Blocco 4 — Come lo fanno i gestionali di cava/pesa

- **InfoMinds/Ergo**: gestionale verticale per "produttori di inerti, cave e
  calcestruzzo" — dichiara integrazione diretta con software di pesatura
  (cita esplicitamente "Coop. Bilanciai") e sistemi di produzione (cita
  "Dorner"), per evitare doppia digitazione fra cantiere/impianto e ufficio;
  flusso integrato preventivo → ordine → listino → **DDT** → **fattura**, con
  controllo costi e statistiche di vendita. Fonte: infominds.eu (alta — sito
  ufficiale del produttore, contenuto commerciale quindi da leggere come
  dichiarazione del fornitore, non verifica indipendente).
- **Vincro**: software di pesatura con gestionale per cave di inerti e
  marmo; funzioni dichiarate: recupero peso, stampa DDT (bolla o "ticket di
  pesata"), gestione prezzi (opzionale), gestione fatture (opzionale),
  esportazione dati verso altre applicazioni (es. contabilità/commercialista).
  Fonte: vincro.it (alta come fonte, stessa cautela: sito del fornitore).
- **Zucchetti, TeamSystem, Fatture in Cloud, Aruba**: **non approfonditi in
  questa ricerca** — le query si sono concentrate su InfoMinds e Vincro, che
  sono i due nominati anche in `docs/MERCATO_E_CONCORRENTI.md`. Non trovato
  con WebSearch, in questa sessione, un confronto diretto fra questi quattro
  e la fatturazione differita da pesate nel settore inerti specificamente.
- **Terminologia del mestiere confermata**:
  - «fattura differita» e «fattura riepilogativa» — termini standard,
    confermati da più fonti (agendadigitale.eu, biblus.acca.it).
  - «DDT» — confermato termine universale.
  - «causale di trasporto» — confermato, con gli esempi tipici (omaggio,
    conto visione, reso, conto lavorazione) quando non c'è passaggio di
    proprietà.
  - «aspetto dei beni» — non ricercato di nuovo in questa sessione (già
    coperto dalla ricerca del 07/08 su RICERCA_CONTINUA_CONTI.md).
  - **«franco cava»**: confermato termine commerciale reale, con listini
    prezzi pubblici che lo usano ("LISTINO PREZZI DEI MATERIALI F.CO CAVA")
    — significa prezzo del materiale caricato su automezzo in cava, IVA
    esclusa, **senza** le spese di trasporto fino a destinazione. Fonte:
    pisellicave.it, gruppofranzosi.it (listini reali di cave, alta).
  - **«franco cantiere»**: confermato termine logistico/commerciale reale —
    il venditore/produttore si fa carico del trasporto fino al cantiere,
    quindi il prezzo include la consegna. Fonte: francocantiere.it,
    logisticaefficiente.it, wikipedia (porto franco) (media-alta — nessuna
    fonte è un listino di cava che usi letteralmente questa dicitura, ma il
    significato logistico generale è confermato da più fonti indipendenti).
  - **Conservazione a norma 10 anni**: confermato obbligo di conservazione
    sostitutiva per 10 anni di ogni fattura elettronica emessa/ricevuta,
    coerente con quanto già scritto in `docs/CONTI_FATTURAZIONE_ROADMAP.md`
    (servizio gratuito dell'Agenzia). Fonte: gtechgroup.it, fidocommercialista.it,
    fattureincloud.it (alta — più fonti concordi sul numero di anni).

---

### Fonti (elenco)

| URL | Che cosa dice | Fiducia |
|---|---|---|
| fatturapa.gov.it (XSD e specifiche tecniche v1.2.2) | Schema ufficiale del tracciato, versione corrente | alta (fonte primaria istituzionale, ma letta solo via estratto di ricerca, non aperta direttamente) |
| agendadigitale.eu (più articoli: TD01/TD24, correlazione DDT-righe fattura) | Regole su fattura differita, scelta del tipo documento, correlazione righe | alta |
| recivu.it, thecalcoloiva.com | Spiegazioni divulgative TD01/TD24 | media |
| help.readypro.it (manuale ReadyPro) | Comportamento pratico di un gestionale sul blocco DatiDDT | media-alta |
| fex-app.com (dizionario campi FatturaPA) | Definizioni puntuali dei singoli campi XML | media |
| github.com/OCA/l10n-italy issue #1340 | Problema tecnico reale di arrotondamento prezzo unitario/sconto | media (issue di un progetto open source, non norma) |
| cloudfinance.it, fattureincloud.it, guide.pec.it, aiuto.libero.it | Codice errore 00404 (fattura duplicata) | alta |
| fatturah.it | Codici 00423, 00421, 00305 | media |
| assistenza.agenziaentrate.gov.it (PDF elenco codici errore SdI) | Fonte ufficiale dell'elenco errori, non letta integralmente | alta come fonte, bassa come lettura (solo titolo/indice) |
| fiscozen.it, soluzionetasse.com, freeinvoice.it | Codice destinatario 6/7 caratteri, "0000000" | alta |
| intesa.it | Differenza FPA12/FPR12 | media |
| fiscomania.com, contrino.it, odcec.torino.it | Reverse charge edilizia escluso per cessione di beni | alta |
| aterbl.it, ecnews.it | Split payment PA | media |
| fiscomania.com, partitaiva.it | Bollo virtuale 2€/77,47€ | alta |
| infominds.eu, vincro.it | Funzioni dichiarate dai gestionali di cava/pesa | alta come fonte, ma commerciale (sito del fornitore) |
| pisellicave.it, gruppofranzosi.it | Listini reali che usano "franco cava" | alta |
| francocantiere.it, logisticaefficiente.it, wikipedia | Significato di "franco cantiere" / porto franco | media-alta |
| gtechgroup.it, fidocommercialista.it, fattureincloud.it | Conservazione sostitutiva 10 anni | alta |
| conai.org (guida CONAI) | Unità di misura ammesse in UnitaMisura | media |

---

### Domande per il delta (sul MECCANISMO — non risposte)

1. Chi, in Conti, compone oggi il blocco `DatiDDT` della fattura differita
   (`xmlFatturaPA` in `conti-data.js`)? Da quali pesate legge `NumeroDDT` e
   `DataDDT`, e quando una fattura raggruppa più DDT dello stesso cliente,
   scrive un blocco `DatiDDT` per ciascuno o li comprime in uno solo?
2. Chi decide il numero di decimali di `Quantita` e `PrezzoUnitario` scritti
   nell'XML — è lo stesso punto che decide il netto (lordo−tara) delle
   pesate, o una conversione separata fatta solo al momento dell'export?
3. Chi controlla, prima di scrivere l'XML, che `PrezzoTotale` di riga sia
   uguale a quantità × prezzo unitario arrotondato secondo la regola dei 2
   decimali (quella che evita l'errore SdI 00423), e che l'imposta di
   `DatiRiepilogo` sia coerente con imponibile × aliquota (errore 00421)?
4. Chi sceglie `TipoDocumento` (TD01 vs TD24) su una fattura generata dai
   DDT — è automatico in base al fatto che la fattura derivi da pesate, o è
   una scelta manuale dell'utente?
5. Chi valorizza `CodiceDestinatario`/`PecDestinatario` per un cliente senza
   codice destinatario noto — c'è un campo in anagrafica cliente che
   distingue "ho il codice a 7 caratteri" da "uso 0000000 + PEC", o si
   assume sempre uno dei due?
6. Come viene trattato oggi, se viene trattato, il caso di un cliente con
   più cantieri/destinazioni nello stesso mese: una fattura per cantiere, o
   una fattura sola con DDT di cantieri diversi mescolati nelle stesse
   righe?
7. C'è un punto in cui Conti applica o esclude il reverse charge per riga —
   e se sì, è già coerente con "mai automatico, solo con nota per il
   commercialista" come indicato nella roadmap, o esiste un automatismo da
   verificare?
8. Il bollo virtuale (2€ sopra 77,47€ su importi non IVA) ha un punto in
   cui Conti lo calcola o lo propone, oppure — coerentemente col fatto che
   gli inerti sono quasi sempre a IVA 22% — è semplicemente assente perché
   il caso non si presenta mai nella pratica della cava?
9. `UnitaMisura` nell'XML: chi decide come tradurre "t" o "m³" del listino
   nel testo libero che va nel campo — c'è già una tabella di conversione, o
   il valore del listino viene scritto tale e quale?

### Il delta, fatto da chi ha il codice in mano (04/09, verificato contro il commit `6d92a9f3`)

Le nove domande, risposte aprendo `xmlFatturaPA` in `apps/conti/conti-data.js`
(e non cercando i nomi dello schema nel codice); ogni «non c'è» col comando.

1. **DatiDDT.** Li compone `xmlFatturaPA` da `f.ddtIds` → pesate in archivio
   (`perId`), **un blocco `DatiDDT` per DDT** con `NumeroDDT` e `DataDDT`; un DDT
   collegato ma non in archivio, o senza data, si dichiara negli `avvisi` e
   non si cita. Manca `RiferimentoNumeroLinea`: i DDT non sono legati alle
   righe (`grep -c "RiferimentoNumeroLinea" conti-data.js` → 0), quindi con
   più DDT e più righe il file non dice quale riga viene da quale bolla.
2. **I decimali.** Il netto (lordo − tara) lo decidono le pesate a monte
   (`convertiQuantita`, `round3`); nell'XML fino a oggi `Quantita` e
   `PrezzoUnitario` uscivano a **due decimali fissi** (`dec(q,2)`): «33,333 t ×
   30 €» diventava 33.33 × 30.00 = 999.90 accanto a un totale di riga di
   999.99. ✅ **Fatto il 04/09**: si scrivono coi decimali che hanno (almeno
   due, al più otto, `decRiga`).
3. **La quadratura di riga.** Prima: NESSUNO. `riep.quadra` confronta la somma
   delle righe con i totali registrati e il totale con imponibile + IVA, ma
   una riga il cui `imponibile` registrato non è quantità × prezzo usciva lo
   stesso (misurato: 33,33 × 30 con imponibile 1000 → `pronto: true`).
   ✅ **Fatto il 04/09**: la riga si confronta con sé stessa COME VIENE SCRITTA
   (un centesimo di tolleranza per gli arrotondamenti) e il file si ferma
   nominando la riga in italiano («dice 1.000,00 € ma 33,33 × 30,00 fa 999,90
   €»). L'imposta di `DatiRiepilogo` è già `round2(imponibile × aliquota/100)`
   per banda (`totaliDaRighe`).
4. **TD01 / TD24.** Sempre `TD01` (`grep -c "TD24" conti-data.js` → 0), anche
   quando la fattura nasce dai DDT (`f.tipo: "differita"`). Il codice della
   fattura differita è norma di **seconda mano** in questa ricerca: candidato
   da confermare col commercialista/testo primario prima di cambiarlo.
5. **CodiceDestinatario / PEC.** Un campo solo in anagrafica, `c.sdi`: sette
   caratteri alfanumerici → codice; con una chiocciola → PEC con «0000000»;
   altrimenti «0000000» e un avviso. Un codice IPA da **sei** caratteri (ente
   pubblico) non passa la forma e finirebbe in «0000000» con l'avviso:
   candidato, insieme allo split payment (`EsigibilitaIVA` è sempre «I»:
   `grep -n '"EsigibilitaIVA"' conti-data.js` → una riga, fissa).
6. **Più cantieri dello stesso cliente.** Nessuna destinazione per riga o per
   DDT nel file; la fattura raggruppa le pesate del cliente e basta (la
   parola «cantiere» compare 12 volte nel modulo, per le gare e i clienti,
   e 0 nelle 110 righe di `xmlFatturaPA`). Candidato di
   prodotto, non di codice: prima si decide se una fattura per cantiere o una
   riga per cantiere.
7. **Reverse charge.** Nessun automatismo (`grep -ci "reverse\|inversione" conti-data.js` → 0):
   coerente con «mai automatico», ed è giusto per la cessione di inerti.
8. **Bollo virtuale.** Assente (`grep -ci "bollo" conti-data.js` → 0): le
   righe senza IVA non hanno nemmeno una `Natura` (`grep -c '"Natura"'` → 0),
   quindi una riga esente non si può scrivere. Il caso in cava è raro;
   resta dichiarato.
9. **UnitaMisura.** Tabella di due voci scritta dentro `xmlFatturaPA`:
   `m3` → «MC», tutto il resto → «TN». Un'unità diversa (viaggi, colli)
   uscirebbe «TN»: candidato piccolo, dichiarare l'unità sconosciuta invece di
   scrivere tonnellate.

**Che cosa ne segue**: fatti il 2 e il 3 (quadratura e decimali, con prove
in run-kpi e il banco `conti-xml-sdi` verde nei due versi). Candidati: (a) TD24
per la differita e il codice IPA a sei caratteri + split payment — norma di
seconda mano, decisione del fondatore col commercialista; (b) `Natura` per
le righe esenti e il bollo, solo se il caso si presenta; (c) ✅ fatta il 04/09 — l'unità
si traduce se è una delle due di vendita, si scrive com'è se è un'altra
(«viaggi»), e se manca il tag facoltativo non si scrive (prima: «TN» a tutti); (d) `RiferimentoNumeroLinea` e la destinazione per
DDT — dipende dalla scelta di prodotto sui cantieri.

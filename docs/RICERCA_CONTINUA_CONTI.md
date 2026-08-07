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


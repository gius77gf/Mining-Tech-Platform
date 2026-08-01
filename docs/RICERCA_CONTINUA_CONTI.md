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

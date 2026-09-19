# Checkpoint — 2026-09-16T02:43:28Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
925ef62b

## Cosa completato
- **Corretto il difetto collaterale reale** trovato dal decimo giro di
  ricerca su Conti (tema 3, sconto cassa): `esitoMovimento` leggeva SEMPRE
  un pagamento più basso dell'aperto come "è un acconto, resta aperta per
  la differenza" — anche quando lo scostamento era in realtà lo sconto
  cassa legittimamente trattenuto dal cliente. Quella differenza finiva
  nell'aging, maturava mora e riceveva un sollecito su un debito che, per
  accordo, non esisteva più.
- `apps/conti/conti-data.js`: nuova funzione pura `scontoCassaMaturato
  (fattura, dataIncasso)` — legge `fattura.scontoCassa: {pct, giorniEntro}`
  (opzionale), confronta i giorni fra emissione e incasso, restituisce
  l'importo maturato solo entro il termine. `calcolabile:false` dichiara
  DUE casi diversi separatamente (nessuno sconto previsto / sconto previsto
  ma fuori termine), mai un `false` muto.
- `esitoMovimento`: quando lo scostamento coincide (tolleranza di **1
  centesimo**, dichiarata esplicitamente come arrotondamento e non come
  tolleranza commerciale) con lo sconto maturato, il grado sale da
  "probabile" a "certo" e il messaggio indica di registrare anche una nota
  di credito con la causale **già esistente** "sconto previsto dal
  contratto" — riusa il meccanismo `stornoDi`/`apertoDi` già in produzione
  (una nota riduce l'aperto) invece di inventare un nuovo stato "saldata
  per sconto". Non tocca `prodottoPerCliente` né l'importo della fattura,
  coerente con la prassi citata (lo sconto cassa è un fatto amministrativo
  successivo, non una riduzione di prezzo in fattura).
- Test in `run-kpi.mjs`: la funzione pura (matura entro termine, non matura
  fuori termine, nessuno sconto previsto, date mancanti/invertite — tutte
  con la ragione dichiarata) e il flusso completo su `abbinaMovimenti`
  (grado certo col messaggio giusto quando matura; torna "probabile"/
  acconto fuori termine; un pagamento davvero parziale che non coincide col
  2% resta un acconto anche entro il termine — non basta "essere entro i
  giorni", deve coincidere l'importo).
- Controprova: disattivato il controllo del termine, la prova sul
  comportamento fuori-termine cade come atteso; ripristinato da backup,
  `diff -q` conferma l'identità byte per byte.
- `run-kpi.mjs`: 3054/0. `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`:
  34/0. `funzioni-mai-usate.mjs`: 4/0 (nessuna funzione orfana). Due
  browser test esistenti sulla riconciliazione (`conti-frasi-da-uno.mjs`,
  `conti-documenti-che-escono.mjs`): 0 KO — nessuna regressione, perché la
  demo non ha fatture con `scontoCassa` (il comportamento su tutti i dati
  esistenti resta identico). `numeri-nei-documenti.mjs`: 43/0. Giro isolato
  (rilanciato due volte, la seconda dopo la correzione di copertura):
  **4016** asserzioni, 40/40 comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3052→3054,
  somma nove suite 3.546→3.548, giro completo 4014→4016, copertura sei
  app 1023/1023→1024/1024.
- Commit `925ef62b`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Con questa unità sono chiuse tre delle
quattro proposte del decimo giro di ricerca su Conti (concentrazione
portafoglio, sconto cassa) e una di Scudo/undicesimo giro (ICAM). Restano
aperte: piani di rientro/dilazioni e storico dei solleciti (Conti); i temi
1/2/4 di Flotta (componenti a vita propria, manutenzione su condizione,
curva di costo/vita economica) e il tema 5 (costo per tonnellata, che
richiede prima una decisione su un ponte Flotta↔Terra); rischio chimico,
denuncia INAIL, anagrafica attrezzature, notifiche automatiche (Scudo).

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Tema 3 di Flotta (componenti a vita propria — pneumatici/cingoli/GET):
   riusa lo schema di `azzeramentiDelMezzo`/`spezzaLetture` già scritto,
   costo stimato medio.
2. Storico dei solleciti in Conti (`fattura.solleciti: [{livello, data,
   canale}]`, bottone "segna come inviato" accanto a "Stampa sollecito"):
   costo piccolo, nessun invio automatico.
3. Rotazione ricerca continua: tutte e sei le app hanno avuto un giro nelle
   ultime 24 ore — al prossimo blocco si può ripartire da un secondo
   passaggio più approfondito, o dai temi ancora aperti nei documenti
   `RICERCA_CONTINUA_*` di ciascuna app.
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.

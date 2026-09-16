# Checkpoint — 2026-09-16T02:11:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0aad8bef

## Cosa completato
- Implementato il **tema 5 della ricerca continua su Scudo (ICAM)**:
  `BARRIERE_MANCATE` + `barriereRicorrenti` in `apps/scudo/scudo-data.js` —
  sorella di `causeRicorrenti`, stessa guardia di leggibilità
  (`troppoPochiPerTendenza`, chiamata e non ricopiata), sulla dimensione
  «che cosa avrebbe dovuto fermare l'evento» invece di «che cosa l'ha
  causato». Non tocca `validaAnalisi` né `CAUSE_ANALISI`: un'analisi può
  nominare più barriere insieme o nessuna.
- UI completa in `apps/scudo/index.html`: sezione "3 · Le barriere che
  avrebbero dovuto fermarlo (facoltativo)" nella modale di analisi, con
  chip a **multi-select** (a differenza della causa, che è singola) —
  stesso pattern di `CAUSE_ANALISI`; pannello "Le barriere che mancano più
  spesso" nella pagina, sorella del pannello "Perché succedono" esistente,
  con lo stesso grafico a barre condizionato alla leggibilità.
- Demo arricchita: `an1` (l'analisi dell'evento i1) aveva già nel suo
  "perché" — «la fascia di rispetto a valle non era delimitata» — senza un
  campo strutturato per dirlo. Ora `barriereMancate: ["delimitazione"]`
  rende quel caso vero visibile.
- Test in `run-kpi.mjs` (funzione pura, con casi: barriera nominata vs
  assente, array vuoto che non conta, più barriere per la stessa analisi,
  analisi orfana che non gonfia il conto). Nuovo file browser permanente
  `tests/browser/scudo-barriere-icam.mjs`.
  ⚠️ **Lezione di metodo incontrata scrivendo la controprova**: la prima
  stesura verificava solo la **classe CSS** del chip (`.active`), che
  resta corretta anche col difetto iniettato (l'array che si sostituisce
  invece di accumularsi non tocca il toggle visivo del bottone) — quindi
  la controprova NON cadeva, cioè non provava niente. Corretta per
  misurare il **dato salvato e riletto** (chiude la modale, la riapre,
  legge i chip attivi dal record vero), non lo stato transitorio del
  form: è la stessa famiglia di «il rosso di una controprova è il verde
  del banco» già scritta in CLAUDE.md, in una veste nuova (qui non era il
  registro a mentire, era il **livello sbagliato** da misurare).
- Controprova su due livelli (funzione pura, collegamento chip→array
  nella pagina): entrambe cadono come atteso col difetto iniettato;
  ripristinato da backup, `diff -q` conferma l'identità byte per byte.
- Registrato in `tests/browser/tutti.mjs` (normale + controprova).
- `run-kpi.mjs`: 3052/0. `run-stile.mjs`: 330/0. `sintassi-pagine.mjs`:
  34/0. `funzioni-mai-usate.mjs`: 4/0. `numeri-nei-documenti.mjs`: 43/0.
  Giro isolato: **4014** asserzioni, 40/40 comandi a posto, 0 caduti.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi 3051→3052,
  somma nove suite 3.545→3.546, giro completo 4012→4014, copertura sei
  app 1021/1021→1023/1023, banchi browser 293→295 (127 file distinti).
- Commit `0aad8bef`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Tutte e sei le app hanno avuto almeno un
giro di ricerca continua in questa sessione, e il tema più pronto della
ricerca Scudo (ICAM) è ora implementato e verificato.

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Il difetto collaterale reale in Conti (`esitoMovimento` confonde un
   pagamento scontato legittimo con un acconto parziale, dal decimo giro
   di ricerca su Conti) — merita un'unità a sé, tocca la riconciliazione
   bancaria esistente.
2. Tema 3 di Flotta (componenti a vita propria — pneumatici/cingoli/GET):
   riusa lo schema di `azzeramentiDelMezzo`/`spezzaLetture` già scritto.
3. Rotazione ricerca continua: tutte le sei app hanno avuto un giro oggi
   o ieri — al prossimo blocco si può ripartire dal secondo passaggio più
   approfondito su una di esse, o dai temi ancora aperti nei documenti
   `RICERCA_CONTINUA_*` di ciascuna.
4. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.

# Checkpoint — 2026-09-15T21:06:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6a5707e7

## Cosa è stato completato
Riverifica del 15/09 su `docs/RICERCA_CONTINUA_PAROLE.md` (documento
invecchiato dal 04/09, come ASSENZA il giorno prima): un agente ha
riletto le 10 proposte tracciate nelle sezioni "V" dei Blocchi 2-3
contro il codice attuale (grep diretti, non fidandosi della prosa).
Esito: 7 ancora vere, 3 già risolte da un commit successivo
(`400ab48f`, 14/08) non ricollegato al documento, 0 false in origine.

Tradotta in codice la proposta 4 (Blocco 2): tutti e 21 i lettori
`scarti*Csv` numeravano `nRiga` sulla posizione nell'elenco già
ripulito da righe vuote e intestazione, non sulla riga fisica del
file — riscontrato identico in tutti e 21, confermato col grep prima
di scrivere codice.

- `shared/deepwork-id-client/dw-shell.js`: nuova
  `righeCsvNumerate(text, primaColonna)`. Numera PRIMA di scartare: il
  numero è la posizione fisica 1-based, e si saltano solo le righe
  davvero vuote e l'intestazione (lo stesso insieme che ogni lettore
  toglieva già) — quindi `lette`/`entrano`/`vuote` restano gli stessi
  conteggi di prima, cambia solo il numero che finisce nel messaggio
  all'utente.
- Migrati i primi due lettori: `apps/terra/terra-data.js`
  (`scartiFrontiCsv`, `scartiRilieviCsv`) — prima fetta scelta perché
  Terra era il file appena toccato nell'unità precedente. Gli altri
  diciannove (Campo 2, Conti 6, Flotta 3, Scudo 4, Sentinella 3)
  restano da migrare, a piccoli lotti, per non rischiare un'unica
  modifica larga su 21 corpi con varianti ciascuno (alcuni usano
  `tutte` invece di `righe`, `scartiPesateCsv` ha un `senzaPeso` in
  più: vanno letti uno per uno prima di editarli).
- Corretto un difetto scoperto mentre si verificava questa unità:
  `apps/deepwork-id/tests/numeri-nei-documenti.mjs` leggeva la
  copertura dei moduli condivisi con una regex ancorata a fine riga
  che non ammetteva il testo `(il fondo era N: alzalo)` — appeso da
  `copertura-funzioni.mjs` quando un modulo supera il proprio minimo
  storico. `dw-shell.js` è salito da 61/61 a 62/62 in questa stessa
  unità (per `righeCsvNumerate`), il che ha fatto sparire la sua riga
  dal censimento (`perModulo.length` sceso da 5 a 4) e fatto cadere
  il controllo — un difetto che sarebbe rimasto silenzioso ogni volta
  che un modulo condiviso migliora, cioè esattamente il caso buono.

## Verifica
- `run-kpi.mjs`: 3035 passati, 0 falliti (include il test dedicato B10
  con righe vuote e righe CSV a celle vuote intercalate — copre
  esattamente il caso che il censimento generico NOVE/QUATTRO/B5-bis
  non tocca, perché le sue fixture non hanno righe vuote prima della
  rotta).
- `run-helpers.mjs`: 82 passati, 0 falliti (7 nuovi test su
  `righeCsvNumerate`, incluso uno che riproduce esplicitamente il
  vecchio conteggio sbagliato e verifica che sia diverso dal nuovo).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/0 (nessuna pagina
  toccata). `copertura-funzioni.mjs`: 0 funzioni scoperte, 1018/1018,
  `dw-shell.js` 62/62. `funzioni-mai-usate.mjs`: 0 da collegare.
- Controprova (×2, `cp`+`diff -q`): (1) reintrodotto il vecchio
  conteggio (posizione nell'elenco filtrato) dentro `scartiRilieviCsv`
  → il test esistente e il nuovo B10 cadono; (2) stessa cosa dentro
  `righeCsvNumerate` stessa → i 7 test dedicati in run-helpers.mjs
  cadono (4 su 7). Ripristinato, byte-identico in entrambi i casi.
- Giro completo su worktree isolata, RIPETUTO due volte: la prima
  volta con 1 caduto (`numeri-nei-documenti.mjs`, per il difetto della
  regex appena scoperto — non un problema del codice di prodotto), la
  seconda — dopo aver corretto la regex e rifatto la worktree da zero
  — con **40 comandi a posto, 0 caduti**.

## Stato roadmap
`docs/RICERCA_CONTINUA_PAROLE.md` resta con 6 proposte ancora aperte
(1, 2, 3, 5, 6, 10 — tutte toccano una scelta di prodotto/norma/misura
preliminare, dichiarata dal documento stesso) più il residuo della
proposta 9 (vocabolario delle ragioni fuori standard, non ancora
guardato) e 18 dei 21 lettori ancora da migrare a `righeCsvNumerate`.

## Prossimo passo atomico
Migrare il secondo lotto di `scarti*Csv` a `righeCsvNumerate` — Scudo e
Sentinella sono un buon secondo lotto perché già toccati oggi
(`scartiInfortuniCsv`, `scartiMonitoraggiCsv` hanno esattamente la
stessa forma appena migrata in Terra). Prima di ogni corpo: leggerlo
per intero (non assumere che sia identico — `scartiLavoratoriCsv`,
`scartiScadenzeCsv`, `scartiAzioniCsv` di Scudo e i quattro di
Sentinella vanno letti uno a uno), sostituire solo le righe di
scaffolding (`const righe = ...` + `let nRiga = 0`), aggiornare
l'import da `dw-shell.js`, verificare che le etichette "riga N" nei
test NOVE/QUATTRO/B5-bis esistenti si spostino in modo prevedibile (di
solito +1 per ogni riga fra intestazione e la rotta) e correggerle con
lo stesso ragionamento fatto qui per Terra — mai indovinare il nuovo
numero, calcolarlo contando le righe fisiche della fixture.

## Blocchi
Nessuno.

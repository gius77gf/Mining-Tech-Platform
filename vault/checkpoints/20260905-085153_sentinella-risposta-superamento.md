# Checkpoint — 2026-09-05T08:51:53Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a5b18734 — Sentinella: il report dice che cosa si è fatto dopo un superamento — le azioni correttive lette da Scudo

## Completato
- (c) `rispostaSuperamento` + `FRASI_RISPOSTA`; `reportConformita` riceve
  `azioni` (`null` = non leggibile ≠ nessuna); la scheda del punto in
  superamento scrive «Azioni correttive: …». run-kpi +2 (2650/0); banco del
  report 25/0 con la dichiarazione «non misurato» se nessun punto è in
  superamento; giro `node` sulla copia verde, 3.562 asserzioni; documenti
  3.131 / 823; fondo sentinella 154.

## Prossimo passo atomico
Il ciclo delle 03:47Z ha chiuso dodici unità di prodotto e tre di documenti.
Della ricerca Sentinella restano (e) il foglio della singola volata con la
misura (costo medio: dati della volata + evento per asse + strumento e
taratura, senza la frase «vale come verbale» finché la fonte primaria non è
letta) e la data di trasmissione del report (decisione del fondatore: «il
report si segna come trasmesso?»). Prossima unità consigliata, (e): in
`apps/sentinella/index.html` cercare come si stampa il report
(`btn-rep-stampa` → `window.print()` sul `#rep-doc` con `@media print`) e
costruire allo stesso modo un foglio per la singola volata (bottone sulla riga
del registro, `data-foglio-vol`), composto da una funzione pura nel modulo
`fogliaVolata(v, monitoraggi, tarature, oggi)` → sezioni {volata, misura
(PPV per asse / risultante / frequenza / aria da `campiEvento` della lettura
collegata via `ppvPuntoId`+`ppvData`), strumento e taratura
(`taratureDelReport`), comunicazione (`descriviComunicazione`)} — ogni
sezione con «non registrato» dove manca, mai «—». Prove in run-kpi, banco
nuovo `sentinella-foglio-volata` registrato in `tutti.mjs` (i documenti
contano 245 esecuzioni da 102 banchi: aggiornarli).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi, «il report si segna come trasmesso?».

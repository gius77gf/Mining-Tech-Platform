# Checkpoint — 2026-09-10T23:23:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6c5f925b

## Completato
Unità 57 — quinta fetta di B3: `ondaDaCsv`, `tempiDetonazione`,
`sommaRitardata` in `genesi-data.js` (G23). Due identiche (0 divergenze su
12.096 + 20.000 casi), la terza corretta di proposito: il lettore dell'onda
leggeva male i decimali all'italiana («0,5;1,23» → tempo 0, ampiezza 5).
run-kpi 2823, genesi-data 88/88, 167 funzioni nella pagina.

## Imparato
- Un trasloco «identico» può portare fuori una copia debole: `_sigParse` era
  un lettore di CSV scritto in casa, e la regola di shared/ (`leggiCsv`) l'ha
  smascherato solo quando si è confrontato il comportamento sui file
  all'italiana, non sui file che escono da Genesi stessa (col punto).
- `+null` fa 0 anche in `tempiDetonazione`: misurato scrivendo la prova, non
  deciso. Dichiarato nella prova e in roadmap invece di corretto di nascosto
  dentro un trasloco.

## Prossimo passo atomico
Leggere il registro del giro filtrato del browser (`scratchpad/giri/
giro-browser-20260910-2157.log`, `leggi-giro.mjs`) se è finito. Poi la
sesta fetta di B3 dalla lista `genesi-estraibili.mjs --elenco`: candidati
`crestZ` (quota della cresta dal profilo importato, legge `P.profilo`),
`_spazTipico` e `_distSpezzata` (geometria della maglia da `D2`) — con la
stessa prova parola per parola contro HEAD. Oppure chiudere il candidato
del ritardo vuoto in `tempiDetonazione` (decidere: `null`/`""` → `null`).

## Blocchi
Nessuno.

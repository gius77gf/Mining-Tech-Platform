# Checkpoint — 2026-09-10T23:41:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
92f33a0f

## Completato
Unità 58 — sesta fetta di B3: `quotaCresta`, `distanzaDaSpezzata`,
`spaziaturaTipica`, `tempoInPunto`, `passoIsocrone` + `ISO_PASSI` in
`genesi-data.js` (G24), identiche (0 divergenze su 20.000 casi ciascuna).
run-kpi 2829, genesi-data 94/94, 165 funzioni nella pagina.

## Imparato
- Un confronto parola per parola che dichiara migliaia di divergenze su una
  funzione copiata identica accusa lo script, non il codice: i due lati
  ricevevano ingressi casuali diversi. Prima di credere a un numero grosso si
  guarda che il righello passi LO STESSO caso ai due lati.
- Un commento di legame incollato al posto di una funzione, dopo un commento
  già chiuso, resta fuori da ogni `/* */` e rompe la pagina: `sintassi-pagine`
  costa tre secondi e va lanciata prima di ogni commit che tocca una pagina.

## Prossimo passo atomico
Leggere il registro del giro filtrato del browser (`scratchpad/giri/
giro-browser-20260910-2157.log`, `leggi-giro.mjs`) se è finito. Poi la
settima fetta di B3 dalla lista `genesi-estraibili.mjs --elenco` — restano
per mestiere `_fileDiFori` (le file dalla faccia verso l'interno),
`_cmpNum/_cmpKg/_cmpEur/_cmpCm/_cmpPf/_cmpFly` (il confronto A/B, sei
funzioncine con lo stesso corpo), `pfNominale`, `innTaglioOk` — con la
stessa prova parola per parola contro HEAD. In alternativa chiudere il
candidato del ritardo vuoto in `tempiDetonazione` (G23).

## Blocchi
Nessuno.

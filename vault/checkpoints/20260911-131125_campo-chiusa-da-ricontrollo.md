# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ea8d82ae

## Completato
Unità 95 — Campo: `chiusaDa` sulla lista di controllo, proposto dal
sorvegliante nominato in Scudo (`sorveglianteDiTurno`, `nominaAttiva` in
`shared/`), senza nome non si chiude; il ricontrollo dei fronti dopo il
maltempo (`VOCE_RICONTROLLO`, `vociChecklist(meteo)`) che compare solo col
meteo avverso e conta nello stato, nella chiusura, nel rapporto e nella
consegna. Chiusa la voce della ricerca dell'11/09. run-kpi 2898, totale
3.379, copertura campo 147, scudo 216, dw-ponti 88. Screenshot a 430 px guardati.

## Imparato
- Il nome si chiede PRIMA della conferma «chiudo lo stesso»: la prima stesura
  lo chiedeva dopo, e la sonda l'ha preso — confermare e poi essere respinti
  è il difetto che si vede solo premendo i bottoni in ordine.
- Una voce condizionale in coda a una lista fissa tiene gli indici stabili:
  «9» è il ricontrollo anche il giorno dopo, quando il meteo non si passa più
  (`voceDiIndice`), e chi legge gli esiti salvati non deve rifare il conto.

## Prossimo passo atomico
Leggere il giro del browser su `faf5e271` (`scratchpad/giri/ultimo-log.txt`,
`leggi-giro.mjs`) quando `ultimo-exit.txt` compare, e chiudere i KO veri.
Poi la ricerca a rotazione del secondo giro su Sentinella («che cosa chiede
l'ARPA o il Comune dopo un reclamo per le vibrazioni: la relazione, la
misura, i limiti UNI 9916 / DIN 4150 — il mondo via WebSearch, delta dal
meccanismo») oppure su Genesi («che cosa chiede la Prefettura/Questura per
l'uso degli esplosivi: licenza, registro, fochino»). In coda, dichiarato: la
colonna `tolleranzaPct` nel CSV dei rilievi di Terra.

## Blocchi
Nessuno.

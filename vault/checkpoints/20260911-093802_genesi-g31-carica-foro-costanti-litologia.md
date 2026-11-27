# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
696a154e

## Completato
Unità 84 — Genesi G31 (B3, tredicesima fetta): `caricaLineare`,
`caricaForoDaGeometria` (guardia G17 dentro), `costantiPpvLitologia`;
`deriveCharge` e il ramo litologico di `ppvSite` sono legami. Confronto
vecchio/nuovo 6.000 + 12 casi, 0 diversi. run-kpi 2881, genesi-data 127/127.
Censimento: 151 / 23 / 47 / 55.

## Imparato
- Una regex sul sorgente della pagina era la difesa giusta finché la funzione
  voleva il DOM: appena il conto esce, la prova deve CHIAMARLO — tenere la
  regex sarebbe stato sorvegliare un testo che non decide più niente.
- La carica lineare era scritta due volte (pagina e modulo) senza che nessuna
  suite lo vedesse: le copie di una formula si trovano col grep della formula
  (`Math.PI*De*De`), non con quello del nome.

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 09:13Z su `184781db`
(`scratchpad/giri/giro-browser-20260911-0913.log`, `leggi-giro.mjs`) quando
`ultimo-exit.txt` compare, e chiudere i KO veri. Poi: la ricerca a rotazione
del secondo giro (Conti: «che cosa contiene la contabilità di cava che un
commercialista chiede» — mondo via WebSearch, delta dal meccanismo), oppure la
quattordicesima fetta B3 fra le funzioni a 3-5 variabili (`genesi-estraibili
--elenco` non le elenca: si cercano nel sorgente con `grep -n "^function"` e
il conto delle variabili del modulo che leggono), oppure il ripiego `rho :
0.82` dentro `confinamentoColletto` (candidato: la stessa densità che
`caricaForoDaGeometria` rifiuta di inventare, qui viene inventata — da
misurare che cosa mostra la pagina con `innesco-nonel` scelto).

## Blocchi
Nessuno.

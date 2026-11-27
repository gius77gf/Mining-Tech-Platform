# Checkpoint — 2026-09-05T20:33:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
32f286ea — Sentinella: il banco del browser sulle condizioni meteo

## Completato
`tests/browser/sentinella-meteo-import.mjs` (46 prove, 320 e 390 px, cinque
tappe: file, anteprima, archivio, «Registra» a mano con la striscia, report),
registrato in `tutti.mjs`; controprova con tre difetti per file, 3/3 rimessi,
30 caduti. Pin 249 esecuzioni / 104 file. Giro `node` sulla copia: 40 comandi
a posto. Voce in roadmap.

## Stato roadmap
Voce `[x]` «SENTINELLA — il banco del browser sulle condizioni meteo…».

## Prossimo passo atomico
Le tre unità di stasera hanno lasciato UNA cosa dichiarata e non fatta: nel
documento dei concorrenti di Sentinella la riga «Direzione + velocità vento»
dice che sulle POLVERI «sottovento» non si giudica perché manca la posizione
della sorgente rispetto al ricettore. Prima di costruire qualcosa, MISURARE
se il dato esiste già: `grep -n "azimut\|bearing\|direzione" apps/sentinella/
sentinella-data.js` e la scheda del ricettore (`TIPI_RICETTORE`, `distanza`)
— se il ricettore ha solo la distanza, la domanda è al fondatore («la
direzione della casa rispetto alla cava, la mettiamo?») e va scritta in
`DECISIONI_WEEKEND.md` come decisione aperta, NON costruita.
Se invece è chiusa: passare a un'altra app. Candidato successivo per costo
e valore: Conti, «Gestione magazzino / giacenze prodotto» — ma PRIMA leggere
`docs/CONCORRENTI_CONTI.md` riga per riga e i checkpoint del 03/09 (gli
inventari dei cumuli di Terra, decisione 12a): la giacenza esiste già in
Terra, e la riga di Conti potrebbe essere un ponte, non un magazzino nuovo.
La regola: «chi calcola la giacenza oggi?» prima di qualunque grep.

## Blocchi
Nessuno.

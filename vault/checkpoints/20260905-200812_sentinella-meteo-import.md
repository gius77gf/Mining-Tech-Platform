# Checkpoint — 2026-09-05T20:08:12Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7828f53d — Sentinella: le condizioni meteo entrano anche dal file dello strumento

## Completato
`proponiColonneMeteo`, `direzioneVento`, `pioggiaDaCella`, `preparaLetture`
con le cinque condizioni e `meteoNonLetti`, `unisciLetture` che le tiene;
pagina con il terzo blocco di tendine, proposta, mappa, riga dell'anteprima.
run-kpi +5 (2733), copertura Sentinella 167/167 (fondo 167), pin 3.214 /
2733 / 904. `sentinella-evento-import` 56 ok + controprova. Giro `node`
sulla copia: 40 comandi a posto. Candidato di `RICERCA_CONTINUA_SENTINELLA`
chiuso con il rimando; voce in roadmap. Scatto guardato.

## Stato roadmap
Voce `[x]` «SENTINELLA — le condizioni meteo entrano anche dal file…».

## Prossimo passo atomico
Le tre unità di Sentinella di stasera hanno un banco del browser che le
copre a metà: `sentinella-evento-import` prova il file del sismografo (e ora
sa che NON propone colonne meteo), ma nessun banco incolla un file CON le
colonne meteo e guarda l'anteprima, l'archivio e il report. Scrivere
`tests/browser/sentinella-meteo-import.mjs` sul modello di
`sentinella-evento-import.mjs` (stessa forma: `--porta=`, `--controprova`,
`dice(...)`, denominatore stampato): (1) incollare il file a nove colonne su
`r1` e pretendere le proposte 4/5/6/7/8 e «Evento» non presa; (2) l'anteprima
con «vento 7,5 m/s da SO…», «non letta: vento» e due tag «fuori condizioni»;
(3) importare e pretendere le tre righe in archivio con i suggerimenti;
(4) il report dell'anno con «letture fuori condizioni» nella scheda del
punto; (5) a mano, «Registra» con vento 7,5 e la striscia che avvisa — e la
striscia che C'È (il difetto `letture` di oggi rimesso in controprova deve
farla sparire). Controprova: tre iniezioni sul modulo (`modo: "parola"` →
`"dentro"` che fa prendere «Evento»; `...campiCondizioni(l)` tolto da
`unisciLetture`; `let letture = []` rimesso dentro la callback), registrate
in `tutti.mjs` e lette da `iniezioni-fresche`. Poi la solita chiusura.

## Blocchi
Nessuno.

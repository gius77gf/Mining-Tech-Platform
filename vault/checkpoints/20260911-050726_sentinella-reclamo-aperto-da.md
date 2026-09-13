# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3302d0a7

## Completato
Unità 73 — Sentinella: `apertoDaGiorni`, `tempoRispostaReclamo`,
`riepilogoReclami(reclami, oggi)` col più vecchio aperto e la risposta media
solo sui chiusi con la data; la pagina scrive `chiusoIl` alla chiusura.
run-kpi 2859, copertura 948/948. Le due voci della ricerca sull'11/09 sono
chiuse lo stesso giorno.

## Imparato
- Una media si dichiara col suo denominatore: «risposta in 1 giorno in media
  (su un reclamo chiuso con la data)» — i chiusi senza data restano fuori e
  la frase lo dice, invece di contare zero.

## Prossimo passo atomico
Leggere il giro del browser lanciato alle 04:26Z su `1fa39d0c`
(`scratchpad/giri/`, `leggi-giro.mjs`) quando `ultimo-exit.txt` compare, e
chiudere i KO veri. Poi l'undicesima tranche B3 su Genesi
(`node apps/deepwork-id/tests/genesi-estraibili.mjs` dice quali funzioni),
oppure la ricerca a rotazione sull'app successiva (Terra).

## Blocchi
Nessuno.

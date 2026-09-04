# Checkpoint — 2026-09-04T23:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6118fced

## Completato
- Ricerca a rotazione su Terra (metà sul mondo, WebSearch, seconda mano):
  la garanzia finanziaria e la chiusura del lotto — importi unitari
  regionali, svincolo per lotto su verbale, comunicazione di fine lavori e
  sopralluogo; delta dal meccanismo con comandi e uscite; tre candidati
  dichiarativi in roadmap (indice aggiornato).
- Il primo candidato fatto: `collaudoChiestoIl` sul lotto, `attesaCollaudo`
  (chiesto il … / recuperato da N giorni senza richiesta / non si sa da
  quanto), badge e frase nella riga, campo nel modulo, `lo2` con la data.
  run-kpi 2585 → 2590; scatti a 320/390 guardati; giro node sulla copia 38/0.
- Documenti: prove 3.071, asserzioni 3.499, copertura 812/812.

## Prossimo passo atomico
Terra, candidato (2) della stessa ricerca: la «quota di garanzia» per lotto
scritta dall'utente (campo nel modulo del lotto, `garanziaEuro` facoltativo)
e in Piano, nel cartellone del divario (`cardDivario`, `lot-divario`), una
riga «garanzia ancora vincolata su N lotti non collaudati: X € · liberabile
dopo il collaudo di …» con «non dichiarata» dove il lotto non la porta —
funzione pura `garanziaVincolata(lotti)` che dichiara `senzaQuota` come
`divarioRecupero` dichiara `senzaMq`; niente importi regionali, niente
percentuali di svincolo. Provarla in scratchpad prima; run-kpi; scatto del
cartellone a 320. In alternativa, se il tempo è poco: Sentinella (c), che
richiede prima che il punto ricordi il preset scelto (`sogliaPreset`), perché
oggi il preset riempie solo `soglia` e `unita` e la banda non è scritta da
nessuna parte.

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.

# Checkpoint — 2026-07-20T17:46:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
910c58c

## Completato
Punto 4 (test): estratta urgenzaOre(orePreviste, oreAttuali) pura in
flotta-data.js (urgenza tagliandi a ore motore), usata da index.html (la
ricerca del mezzo resta inline, poi delega). 2 test sui confini: 0h=scaduto
(+N h), 50h=warn, 51h=ok, oreAttuali assenti=0. run-kpi 56/56; Playwright:
FLOTTA MAN OK. Suite 156→158; job CI aggiornato.

## Stato roadmap
Funzioni pure di logica estese e testate su Flotta (urgenza date+ore) e
Campo (ponte Genesi completo). Suite 158. Coerenza UI completa.

## Prossimo passo atomico
Merge PR flotta-urgenzaore (dopo CI verde; job "...(158)"), riparti branch
da main. Prossimo: cercare altra logica inline non testata da estrarre, o
una micro-coerenza/UX, o una revisione. Ormai molto saturo: scegliere solo
se aggiunge valore reale. Candidati: (a) sentinella statoMisura è già
testata; (b) verificare se ci sono altri calcoli inline nelle app (es.
volFronte in Terra, o il DSO già fatto); (c) revisione di coerenza.
Verificare, commit+checkpoint+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore.

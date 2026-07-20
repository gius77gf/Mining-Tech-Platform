# Checkpoint — 2026-07-20T16:21:23Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
86413f9

## Completato
Sentinella UX: Invio-per-inviare (enterSubmit) su form adempimento/sensore/
misura. Playwright: SENTINELLA ENTER-SUBMIT OK.

## Stato roadmap
enterSubmit ora su 5 app. Resta solo TERRA per completare il giro.

## Prossimo passo atomico
Merge PR sentinella-invio (dopo CI verde), riparti branch da main.
Prossimo: enterSubmit su TERRA (ultima). Campi/pulsanti: fro-nome/fro-banco/
fro-quota→btn-fro, new-ril-data/new-ril-vol→btn-add-ril (il select
new-ril-fronte non serve). Aggiungere accanto al clearErr, syntax-check,
Playwright, commit+checkpoint+PR. Con Terra il pattern enterSubmit è
completo su tutte le 6 app (come clearErr). Poi valutare la prossima
seconda iterazione (focus automatico primo campo dopo azione? oppure
punto 5 sicurezza core). Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

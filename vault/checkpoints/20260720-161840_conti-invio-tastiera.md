# Checkpoint — 2026-07-20T16:18:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fd91e68

## Completato
Conti UX: Invio-per-inviare (enterSubmit) su form gara (gar-*→btn-gar) e
fattura (ft-*→btn-ft). Playwright: CONTI ENTER-SUBMIT OK.

## Stato roadmap
enterSubmit ora su Scudo + Campo + Flotta + Conti. Restano Sentinella e
Terra.

## Prossimo passo atomico
Merge PR conti-invio (dopo CI verde), riparti branch da main. Prossimo:
enterSubmit su SENTINELLA. Campi/pulsanti: ade-titolo/ade-ente/ade-data→
btn-ade, sen-nome/sen-unita/sen-soglia→btn-sen, mis-valore→btn-mis
(evitare i select mis-sensore). Aggiungere accanto al clearErr,
syntax-check, Playwright, commit+checkpoint+PR. Poi Terra (fro-nome/
fro-banco/fro-quota→btn-fro, new-ril-data/new-ril-vol→btn-add-ril) per
completare il giro su tutte le 6 app. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

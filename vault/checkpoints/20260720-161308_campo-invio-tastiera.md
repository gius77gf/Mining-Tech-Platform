# Checkpoint — 2026-07-20T16:13:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
dd77e42

## Completato
Campo UX: Invio-per-inviare (enterSubmit) su att-titolo/att-dett→btn-att
e new-rap-titolo→btn-add-rap. Playwright: CAMPO ENTER-SUBMIT OK.

## Stato roadmap
enterSubmit ora su Scudo + Campo. Restano Flotta, Conti, Sentinella, Terra.

## Prossimo passo atomico
Merge PR campo-invio (dopo CI verde), riparti branch da main. Prossimo:
estendere enterSubmit a FLOTTA. Campi/pulsanti: cos-voce/cos-importo/
cos-nota→btn-cos, mez-nome/mez-area/mez-ore→btn-mez, ore-nuove→btn-ore,
man-titolo/man-ore→btn-man (evitare i select come ore-mezzo/man-mezzo).
Aggiungere il blocco enterSubmit accanto al clearErr in fondo al modulo,
syntax-check, Playwright, commit+checkpoint+PR. Poi Conti, Sentinella,
Terra. Continuare a piccole unità fino a esaurimento crediti.

## Blocchi
Nessuno.

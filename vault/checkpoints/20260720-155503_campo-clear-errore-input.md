# Checkpoint — 2026-07-20T15:55:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4788aa2

## Completato
Campo UX: esteso il recupero errore validazione (clearErr su input) a
att-titolo→att-esito e new-rap-titolo (solo bordo). Playwright OK.

## Stato roadmap
Pattern clearErr ora su Scudo + Campo. Da estendere a Flotta, Conti,
Sentinella, Terra.

## Prossimo passo atomico
Merge PR campo-clear-errore (dopo CI verde), riparti branch da main.
Prossimo: estendere clearErr a FLOTTA. Campi/esito da agganciare (dai
gestori validati): mez-nome→ore-esito, ore-nuove→ore-esito,
cos-voce/cos-importo→cos-esito, man-titolo/man-data/man-ore→ore-esito.
Verificare i nomi esatti degli esito nel file prima di scrivere.
Aggiungere il blocco clearErr in fondo al modulo, syntax-check,
Playwright (errore poi input → bordo+messaggio spariscono),
commit+checkpoint+PR. Poi Conti, Sentinella, Terra allo stesso modo.
Continuare a piccole unità fino a esaurimento crediti.

## Blocchi
Nessuno.

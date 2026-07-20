# Checkpoint — 2026-07-20T15:52:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a392be7

## Completato
Scudo UX: recupero errore di validazione. Appena l'utente corregge un
campo (evento input), il bordo rosso e il messaggio di esito di quel form
vengono rimossi (helper clearErr su new-nome→import-esito, doc-titolo→
doc-esito, new-scad-desc/new-scad-data→scad-esito). Completa la
validazione con feedback aggiunta in precedenza. Playwright: ERROR-CLEAR
OK (dopo errore nome vuoto, digitando un carattere bordo+messaggio
spariscono).

## Stato roadmap
Ciclo molto produttivo: ~20 unità (UX trasversale, 2 XSS, parser puro,
suite test 113→148, ora recupero errore validazione). Tutte mergiate via
PR con CI verde.

## Prossimo passo atomico
Merge PR scudo-clear-errore (dopo CI verde), riparti branch da main.
Prossimo: estendere lo stesso pattern di recupero errore (clearErr su
input) alle ALTRE app con validazione a feedback — Campo (att-titolo→
att-esito, new-rap-titolo), Flotta (mez-nome, cos-voce/cos-importo,
man-titolo, ore-nuove), Conti (ft-*, gar-*), Sentinella (sen-*, ade-*,
mis-*), Terra (fro-nome, new-ril-*). Fare UNA app per unità, con verifica
Playwright, commit+checkpoint+PR. Continuare a piccole unità fino a
esaurimento crediti.

## Blocchi
Nessuno.

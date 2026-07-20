# Checkpoint — 2026-07-20T16:10:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fc07b27

## Completato
Scudo UX: Invio-per-inviare nei form (helper enterSubmit). Invio in un
campo attiva il pulsante del form: lavoratore (new-nome/new-ruolo→
btn-add-pers), scadenza (new-scad-desc/new-scad-data→btn-add-scad),
documento (doc-titolo/doc-meta→btn-doc). Playwright: ENTER-SUBMIT OK
(Invio pieno aggiunge+pulisce; Invio vuoto mostra validazione).

## Stato roadmap
Nuova seconda iterazione UX avviata: Invio-per-inviare. Da estendere a
Campo, Flotta, Conti, Sentinella, Terra (come già fatto per clearErr).

## Prossimo passo atomico
Merge PR scudo-invio (dopo CI verde), riparti branch da main. Prossimo:
estendere enterSubmit a CAMPO. Form/campi (verificare nomi + pulsanti nel
file): attività (att-titolo/att-dett→btn-att), rapportino (new-rap-titolo
→btn-add-rap). Aggiungere il blocco enterSubmit accanto al clearErr in
fondo al modulo, syntax-check, Playwright (Invio pieno aggiunge, Invio
vuoto valida), commit+checkpoint+PR. Poi Flotta, Conti, Sentinella, Terra
allo stesso modo. NB: non mettere Enter sui campi <select> (non serve).
Continuare a piccole unità fino a esaurimento crediti.

## Blocchi
Nessuno.

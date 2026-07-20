# Checkpoint — 2026-07-20T15:09:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ecca5f2

## Completato
Stati vuoti mancanti su 3 liste (verificato: erano le UNICHE senza
fallback dopo un censimento di tutte le liste delle 6 app):
- Sentinella reg-list → "Nessuna voce nel registro."
- Terra fro-list → "Nessun fronte registrato: aggiungine uno qui sotto."
- Terra pia-list → "Nessuna voce di piano registrata."
Sintassi OK. Playwright: reg-list con registri=[] rende esattamente
il messaggio di stato vuoto (EMPTY STATE OK). Le altre due usano
idioma identico già provato.

## Stato roadmap
Seconda iterazione UX: coperti tap-KPI (tutte le app) e ora stati
vuoti (tutte le liste ora hanno un fallback). PR in corso.

## Prossimo passo atomico
Merge PR stati-vuoti (dopo CI verde), riparti branch da main.
Prossimo candidato seconda-iterazione: validazioni form con feedback.
Censire i form "Nuovo/Aggiungi" delle app e verificare che rifiutino
input vuoti/invalidi con un messaggio nell'elemento .note esito
(es. #att-esito in Campo). Scegliere UNA app, verificare che il form
gestisca il caso "campo obbligatorio mancante", aggiungere il
controllo dove assente, testare con Playwright, commit+checkpoint+PR.

## Blocchi
Nessuno.

# Checkpoint — 2026-07-23T12:15:00Z

## Tipo
unit-complete (modifica in-place, app 3: Terra fronti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/terra/index.html)

## Completato
Modifica in-place dei **fronti** in Terra: ✎ accanto al badge di stato → popola il
form "Nuovo fronte", "Salva modifica" via `db.aggiorna` su nome/banco/quota,
lasciando intatti dettaglio/avanzamento/stato e i rilievi collegati. Il controllo
nome-duplicato esclude il fronte in modifica. Ri-tocco ✎ = annulla.

## Verifica
Syntax OK. Screenshot Playwright (demo): ✎ su "Fronte Nord" → form popolato
(nome/banco/quota 340), pulsante "Salva modifica"; quota 340→999 salvata IN PLACE
(conteggio 3→3, lista mostra "Quota 999m"), pulsante torna "Aggiungi"; zero errori.

## Prossimo passo atomico
Estendere la modifica in-place: **Flotta mezzi** (nome/area), poi Scudo lavoratori
(nome/ruolo), Campo attività (titolo/dettaglio). Una per unità, con screenshot.

## Blocchi
Nessuno (pura UX + aggiorna).

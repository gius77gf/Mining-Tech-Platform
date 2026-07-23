# Checkpoint — 2026-07-23T12:00:00Z

## Tipo
unit-complete (modifica in-place, app 2: Sentinella sensori)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/sentinella/index.html)

## Completato
Modifica in-place dei **sensori** in Sentinella (alto valore: prima, per correggere
una soglia mal digitata si doveva cancellare e ricreare il sensore, PERDENDO lo
storico delle misure). Ora ✎ accanto alla ✕: popola il form "Nuovo sensore",
"Salva modifica" via `db.aggiorna` che tocca solo nome/unità/soglia e **lascia
intatti valore e letture** (lo storico). Ri-tocco ✎ = annulla. Pura UX + aggiorna.

## Verifica
Syntax OK. Screenshot Playwright (demo): ✎ → form popolato (Vibrazioni V2, soglia 5),
pulsante "Salva modifica"; soglia 5→8 salvata IN PLACE (conteggio 5→5, lista mostra
"soglia 8"), pulsante torna "Aggiungi"; zero errori console.

## Prossimo passo atomico
Estendere la modifica in-place: **Terra fronti** (nome/banco/quota), poi Flotta mezzi
(nome/area), Scudo lavoratori (nome/ruolo), Campo attività (titolo/dettaglio). Una per
unità, con screenshot.

## Blocchi
Nessuno (pura UX + aggiorna).

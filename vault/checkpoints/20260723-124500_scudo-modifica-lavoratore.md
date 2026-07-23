# Checkpoint — 2026-07-23T12:45:00Z

## Tipo
unit-complete (modifica in-place, app 5: Scudo lavoratori)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/scudo/index.html)

## Completato
Modifica in-place dei **lavoratori** in Scudo: ✎ accanto alla ✕ → popola il form
"Aggiungi", "Salva modifica" via `db.aggiorna` su nome/ruolo, lasciando intatti
idoneità, stato attivo e scadenze collegate. Ri-tocco ✎ = annulla.

## Verifica
Syntax OK. Screenshot Playwright (demo): ✎ su "Anna Neri" → form popolato
(nome/ruolo Impiegata), pulsante "Salva modifica"; ruolo → "Capocantiere" salvato IN
PLACE (conteggio 7→7, lista lo mostra), pulsante torna "Aggiungi"; zero errori.

## Prossimo passo atomico
Ultima della serie modifica in-place: **Campo attività** (titolo/dettaglio). Poi la
serie CRUD-modifica è completa su tutte le entità principali; si prosegue con altre
seconde iterazioni / test / rotazione (never-stop).

## Blocchi
Nessuno (pura UX + aggiorna).

# Checkpoint — 2026-07-23T12:30:00Z

## Tipo
unit-complete (modifica in-place, app 4: Flotta mezzi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/flotta/index.html)

## Completato
Modifica in-place dei **mezzi** in Flotta: ✎ accanto al badge → popola il form
"Nuovo mezzo", "Salva modifica" via `db.aggiorna` su nome/area/ore, lasciando intatti
stato e manutenzioni collegate. Ri-tocco ✎ = annulla. Bonus: corretto il controllo
nome-duplicato (ora confronta i prefissi «nome — modello» su entrambi i lati, prima
confrontava il prefisso esistente col nome intero) + esclude il mezzo in modifica.

## Verifica
Syntax OK. Screenshot Playwright (demo): ✎ su "Dumper D3 — CAT 745" → form popolato
(nome/area/ore 9105), pulsante "Salva modifica"; ore 9105→9999 salvate IN PLACE
(conteggio 6→6, lista mostra "9.999 h"), pulsante torna "Aggiungi"; zero errori.

## Prossimo passo atomico
Ultime due della serie modifica in-place: **Scudo lavoratori** (nome/ruolo), poi
Campo attività (titolo/dettaglio). Una per unità, con screenshot.

## Blocchi
Nessuno (pura UX + aggiorna).

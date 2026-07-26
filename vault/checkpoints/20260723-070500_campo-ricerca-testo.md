# Checkpoint — 2026-07-23T07:05:00Z

## Tipo
unit-complete (ricerca testo nelle liste, app 3/5: Campo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/campo/index.html)

## Completato
Ricerca testuale nella lista **attività** di Campo: `#att-cerca` filtra per
**titolo o dettaglio**, si compone con filtro stato + ordinamento. Stato vuoto
dedicato. Solo UX. NB: verificato in git che la "ricerca live su tutte le app"
del riepilogo storico era un OVERCLAIM — solo Scudo l'aveva davvero; ora la sto
aggiungendo per davvero, onestamente.

## Verifica
Syntax OK. Screenshot (demo): "fronte" con filtro "Tutte" → 2 attività; assente →
stato vuoto; zero errori console.

## Prossimo passo atomico
Ricerca testuale: **Sentinella** (monitoraggi: sito/sensore), poi Terra (rilievi:
titolo/fronte). Poi altre seconde iterazioni (validazioni form / stati vuoti).

## Blocchi
Nessuno (pura UX).

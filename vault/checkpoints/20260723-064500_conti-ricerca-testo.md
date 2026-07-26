# Checkpoint — 2026-07-23T06:45:00Z

## Tipo
unit-complete (seconda iterazione UX — ricerca testo nelle liste, app 1/5: Conti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/conti/index.html)

## Completato
Fallback #1 (seconde iterazioni app): oggi solo Scudo aveva una ricerca testuale
(sul personale). Le altre 5 verticali hanno filtri per categoria e ordinamento, ma
NON la ricerca libera — utile quando le righe sono tante. Aggiunta a **Conti**
(fatture): campo `#fat-cerca` (type=search) che filtra per **cliente o numero**,
componendosi con il filtro di categoria e l'ordinamento già presenti. Stesso pattern
di Scudo (coerenza). Stato vuoto dedicato ("Nessuna fattura trovata per «…»", con
`esc()`). Nessuna modifica al modello dati (pura UX) → nessun gate del fondatore.

## Verifica
- Syntax inline OK. Screenshot Playwright (dati demo): ricerca "edilcave" con filtro
  "Tutte" → 2 fatture Edilcave; ricerca inesistente → messaggio di stato vuoto;
  zero errori console. Il box è coerente con lo stile deepwork (placeholder 🔍).

## Prossimo passo atomico
Estendere la ricerca testuale alle altre liste (never-stop, una app per unità):
**Flotta** (mezzi: nome/targa), poi Campo (attività/squadra), Sentinella (monitoraggi/
sensore), Terra (rilievi/fronte). Stesso pattern, verifica con screenshot ciascuna.

## Blocchi
Nessuno per questa serie (pura UX). Restano gated: passo 3 drone (dato reale),
azione-correttiva Scudo / ordine-lavoro Flotta (modello dati), #321 estetica.

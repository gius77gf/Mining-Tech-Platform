# Checkpoint — 2026-07-21T16:05:00Z

## Tipo
unit-complete (hardening — chiude nota review data-layer)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — guardia demo aggiorna/rimuovi su collezione nuova)

## Completato
Chiusa la nota #1 della revisione del data-layer: in modalità demo/tour
`aggiorna`/`rimuovi` assumevano la collezione già presente in `mem` e
lanciavano ("Cannot read properties of undefined") su una collezione mai
seminata — comportamento asimmetrico rispetto al live (che la gestisce). Ora
tutte e 6 le app usano la guardia `mem[n] || (mem[n] = [])` / `(mem[n] || [])`.
Confermato empiricamente in Node: prima lanciava, ora no.
- `apps/*/*-data.js` (6 file): guardia su demo `aggiorna` e `rimuovi`.
- `run-demo.mjs`: +1 test che istanzia la VERA api demo (l'import SDK fallisce in
  Node → demo) e verifica: fallback a demo, CRUD round-trip in memoria, e che
  `aggiorna`/`rimuovi` su una collezione nuova NON lanciano. È la prima
  copertura della api demo (prima si testava solo la forma dei dati DEMO).
  Demo 6→7; CI 279→280.
Verifica: demo 7/0, KPI 160/0, helpers 22/0. Nessun cambto su percorsi
raggiungibili (solo `|| []` aggiunto).

## Stato roadmap
6 app verticali robuste; entrambe le note della review data-layer chiuse
(fronteId demo #257, guardia demo qui). Suite 280.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

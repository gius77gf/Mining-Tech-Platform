# Checkpoint — 2026-07-21T07:28:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta export situazione CSV)

## Completato
Flotta — **export situazione in CSV** (era l'UNICA delle 6 app verticali
senza esportazione: aveva solo l'import telemetria). Ora parità con le altre.
- index.html: pulsante "Esporta situazione (CSV)" accanto all'import; il CSV
  raccoglie mezzi (ore + area), manutenzioni pianificate e ricambi con
  evidenza di quelli SOTTO SCORTA. Colonne: tipo;nome;stato;dettaglio.
  Usa gli helper già testati `csvCell` e `sottoScorta` (nessuna logica nuova
  non testata: è un wrapper UI, come l'export di Terra/Conti).
Verifica: syntax OK; export end-to-end in Playwright (6 mezzi, 3 manutenzioni,
4 ricambi; sotto-scorta segnati correttamente). CI resta 220 (nessun helper
nuovo).

## Stato roadmap
6 app verticali con feature + import CSV (Campo/Flotta/Conti/Terra) + ora
export CSV su tutte e 6 (parità) + test sicurezza + schede vault + doc
STATO_PRODOTTO per il fondatore.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX, estensione suite emulatore (SDK/Functions/Bootstrap),
o nuove schede di ricerca/programmi nel vault.

## Blocchi
Login live / gestione errori scritture: decisione fondatore. SdI / telematics
live / ciclo chiuso / Genesi motore / soglie di legge: gated, de-rischiati.

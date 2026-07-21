# Checkpoint — 2026-07-21T20:05:00Z

## Tipo
unit-complete (feature — Conti, completa la parità import)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti import gare da CSV)

## Completato
Ultimo tassello della parità import: si possono importare le gare d'appalto da
CSV.
- `conti-data.js`: `parseGareCsv(text)` pura e testabile. Colonne
  titolo;base;scadenza;stato. base via numIt; stato aperta|vinta|persa (default
  aperta).
- `index.html` (pagina Gare): bottone "Importa gare (CSV)" con dedup per titolo.
- `run-kpi.mjs`: +1 test (colonne, base all'italiana, stato ignoto→aperta,
  scarto righe senza titolo). KPI 171→172; CI 304→305.
- `ONBOARDING_DATI.md`: sezione "Conti — 2) gare d'appalto" + riga riepilogo.
Verifica: KPI 172/0, syntax OK; Playwright — import 2 righe (1 nuova, 1 dup del
demo) → 4→5, "1 aggiunte, 1 già presenti (saltate)"; nessun errore.

## MILESTONE: parità import COMPLETA
Ogni app verticale ora importa TUTTE le sue entità base da CSV:
- Scudo: anagrafica, scadenzario, infortuni
- Campo: squadre, piano volata
- Flotta: parco mezzi, telemetria
- Conti: fatture, gare
- Sentinella: sensori, adempimenti, registro volate
- Terra: fronti, rilievi
Suite 305. Onboarding di una cava interamente caricabile da file.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI variando tipo di
lavoro (UX/stati vuoti/validazioni, test emulatore casi limite, revisione).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

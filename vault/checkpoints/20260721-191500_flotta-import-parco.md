# Checkpoint — 2026-07-21T19:15:00Z

## Tipo
unit-complete (feature — Flotta, parità import)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta import del parco mezzi da CSV)

## Completato
Colmata una lacuna di onboarding: Flotta importava solo la telemetria (ore), non
il PARCO iniziale. Ora si può caricare la flotta intera da CSV.
- `flotta-data.js`: `parseMezziCsv(text)` pura e testabile. Colonne
  nome;area;ore;stato. Tiene le righe con nome; ore via numIt; stato tra
  operativo|fermo|verifica (default operativo, così il badge non si rompe).
- `index.html` (pagina Mezzi): bottone "Importa parco (CSV)" con dedup per nome
  (i mezzi già presenti vengono saltati).
- `run-kpi.mjs`: +1 test (colonne, stato ignoto→operativo, scarto righe senza
  nome). KPI 167→168; CI 300→301.
- `ONBOARDING_DATI.md`: nuova sezione "Flotta — 1) parco mezzi" + riga nel
  riepilogo.
Verifica: KPI 168/0, syntax OK; Playwright — import di 3 righe (2 nuovi + 1
duplicato) → parco 6→8, "2 aggiunti, 1 già presenti (saltati)"; nessun errore.

## Stato roadmap
6 app; smoke test regressione 6/6 pulito dopo i 31 PR. Suite 301.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

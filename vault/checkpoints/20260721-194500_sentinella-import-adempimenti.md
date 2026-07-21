# Checkpoint — 2026-07-21T19:45:00Z

## Tipo
unit-complete (feature — Sentinella, parità import)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella import adempimenti da CSV)

## Completato
Import parità Sentinella completa: si possono importare le scadenze ambientali
(adempimenti) da CSV — la lista che dà il consulente (AUA/AIA/ARPA…).
- `sentinella-data.js`: `parseAdempimentiCsv(text)` pura e testabile. Colonne
  titolo;ente;scadenza. Tiene le righe con titolo e scadenza ISO; ente vuoto→"—".
- `index.html` (pagina Adempimenti): bottone "Importa scadenze (CSV)" con dedup
  per titolo+scadenza.
- `run-kpi.mjs`: +1 test. KPI 169→170; CI 302→303.
- `ONBOARDING_DATI.md`: sezione "Sentinella — 2) scadenze ambientali" + riga
  riepilogo.
Verifica: KPI 170/0, syntax OK; Playwright — import 3 righe (1 nuova, 1 dup del
demo, 1 data errata scartata) → 3→4, "1 aggiunte, 1 già presenti (saltate)";
nessun errore.

## Stato roadmap
Parità import: Sentinella completa (sensori+adempimenti+volate); Flotta
(parco+telemetria); Terra (fronti+rilievi); Scudo (anagrafica+scadenzario+
infortuni); Conti (fatture); Campo (piano volata). Suite 303.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI (restano import di
minore priorità: Campo squadre, Conti gare; poi altre rifiniture/UX/test).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

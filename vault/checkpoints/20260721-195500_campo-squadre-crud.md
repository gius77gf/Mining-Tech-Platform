# Checkpoint — 2026-07-21T19:55:00Z

## Tipo
unit-complete (feature — Campo, CRUD mancante + import)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo: aggiungi e importa squadre)

## Completato
Colmata una lacuna CRUD reale: la pagina Squadre di Campo NON aveva un modo per
aggiungere una squadra (solo toggle stato). Ora c'è il form + l'import CSV.
- `campo-data.js`: `parseSquadreCsv(text)` pura e testabile. Colonne
  nome;persone;area;stato. persone via numIt (intero ≥0); stato operativa|ferma
  (default operativa).
- `index.html` (pagina Squadre): form "Nuova squadra" (nome/persone/area) +
  bottone "Importa squadre (CSV)", entrambi con dedup per nome.
- `run-kpi.mjs`: +1 test. CI 303→304 (KPI 170→171).
- `ONBOARDING_DATI.md`: sezione "Campo — 1) squadre di cantiere" + riga
  riepilogo.
Verifica: KPI 171/0, syntax OK; Playwright — form aggiunge (3→4); import CSV
(4→5, 1 dup saltata); nessun errore.

## Stato roadmap
Parità import completa su tutte le app (Campo squadre era anche un CRUD gap).
Resta Conti gare (import minore). Suite 304.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI (Conti gare import;
poi variare: UX/test/revisione).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

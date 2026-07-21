# Checkpoint — 2026-07-21T08:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella import sensori CSV)

## Completato
Sentinella — **import sensori/centraline da CSV**. Era l'ULTIMA app verticale
senza import: ora tutte e 6 hanno import+export CSV (parità completa).
- sentinella-data.js: `parseMonitoraggiCsv(text)` (nome;tipo;valore;soglia;
  unita[;nota]; virgola decimale; scarta righe senza nome o con soglia ≤ 0,
  che servono per calcolare conforme/attenzione/superamento). Pura e testabile.
- index.html: pulsante "Importa sensori (CSV)" nella pagina Monitoraggi; salta
  i nomi già presenti; crea i sensori con soglia e ultimo valore.
- run-kpi.mjs: +2 test. KPI 113→115; totale CI 226→228.
- docs/ONBOARDING_DATI.md: aggiornata la sezione Sentinella (prima "nessun
  import") e la tabella riepilogo.
Verifica: KPI 115/0, syntax OK, import end-to-end in Playwright (2 aggiunti,
1 duplicato saltato; lista 5→7; nuovo sensore presente).

## Stato roadmap
TUTTE e 6 le app verticali con import+export CSV (parità piena) + suite test
228 senza flaky + 4 doc fondatore (STATO_PRODOTTO, DECISIONI_WEEKEND,
PIANO_GO_LIVE, ONBOARDING_DATI) + schede vault.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX, casi limite nelle suite, o nuove schede di ricerca.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

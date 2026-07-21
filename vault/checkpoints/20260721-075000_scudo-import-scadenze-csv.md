# Checkpoint — 2026-07-21T07:50:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo import scadenze CSV)

## Completato
Scudo — **import scadenze da CSV** (onboarding). Chiude un buco che il PIANO_
GO_LIVE aveva fatto emergere: avevo consigliato Scudo come app pilota, ma
Scudo era l'unica app verticale senza import dello **scadenzario** (aveva solo
l'import dell'anagrafica lavoratori). Ora un cliente HSE può caricare in blocco
visite mediche/corsi/patentini con le date.
- scudo-data.js: `parseScadenzeCsv(text)` (lavoratore;tipo;descrizione;
  scadenza; header opzionale; AZIENDA/vuoto → aziendale; scarta date non ISO;
  tipo assente → "Altro"). Pura e testabile.
- index.html: pulsante "Importa scadenze (CSV)" nella pagina Scadenze; associa
  il lavoratore per nome all'anagrafica, altrimenti scadenza aziendale.
- run-kpi.mjs: +2 test (parsing + CRLF/vuoto). KPI 111→113; totale CI 224→226.
Verifica: KPI 113/0, syntax OK, import end-to-end in Playwright (3 aggiunte,
1 senza lavoratore; lista 5→8; Mario Rossi correttamente associato).

## Stato roadmap
6 app verticali con import CSV su TUTTE (Scudo ora completa) + export su tutte
+ suite test 226 irrobustite + 3 doc fondatore (STATO_PRODOTTO, DECISIONI_
WEEKEND, PIANO_GO_LIVE) + schede vault.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
seconde iterazioni UX, casi limite nelle suite emulatore, o nuove schede.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

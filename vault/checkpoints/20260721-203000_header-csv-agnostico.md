# Checkpoint — 2026-07-21T20:30:00Z

## Tipo
unit-complete (hardening cross-app + test — riconoscimento header CSV)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — isIntestazione, header CSV indipendente dal delimitatore)

## Bug trovato e corretto
Tutti i parser CSV toglievano la riga d'intestazione solo se separata da `;`
(`/^colonna\s*;/i`), ma `parseCsvLine` rileva anche VIRGOLA e TAB. Un file a
virgole (default CSV internazionale) CON intestazione avrebbe iniettato una
riga-fantasma "header" (es. una gara intitolata "titolo"). Presente in tutte e
6 le app (13 punti di import).

## Fix
- `shared/deepwork-id-client/dw-shell.js`: nuovo helper puro `isIntestazione(row,
  primaColonna)` — riconosce l'header per `;`, TAB o virgola; case-insensitive;
  keyword "escapata" per sicurezza.
- 13 call site in campo/conti/flotta/scudo/sentinella/terra: sostituito il
  regex inline con `isIntestazione(r, "colonna")` + import aggiornato.
- `run-helpers.mjs`: +7 test (i 3 delimitatori, case/spazi, riga dati, keyword
  senza separatore, keyword vuota). Helper 35→42; CI 305→312.

Verifica: node --check su dw-shell + 6 data.js OK; helpers 42/0, demo 7/0,
KPI 172/0; test funzionale reale: `parseGareCsv` con header a virgole ora
scarta l'intestazione (2 righe, nessuna gara "titolo").

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: altre verifiche di
robustezza import (BOM UTF-8 iniziale? righe con soli separatori?), oppure
revisione di main, oppure nuova unità UX con screenshot.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

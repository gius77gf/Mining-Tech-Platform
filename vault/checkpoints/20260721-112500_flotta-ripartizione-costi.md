# Checkpoint — 2026-07-21T11:25:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta ripartizione costi)

## Completato
Flotta — **ripartizione dei costi per voce**: dove va la spesa della flotta a
colpo d'occhio (carburante vs ricambi vs noleggi…), con incidenza %.
- flotta-data.js: `ripartizioneCosti(costi)` → {totale, voci:[{voce, importo,
  pct}]} accorpando le voci con lo stesso nome, dal più pesante; ignora importi
  ≤ 0. Pura e testabile.
- index.html: riga "Totale … — voce X% · …" in cima alla pagina Costi.
- run-kpi.mjs: +2 test. KPI 132→134; totale CI 251→253.
Verifica: KPI 134/0, syntax OK, Playwright ("Totale €12.750 — Carburante 66% ·
Ricambi e officina 25% · Noleggi esterni 9%", nessun errore).

## Stato roadmap
GIRO DI SECONDE ITERAZIONI COMPLETO su tutte e 6 le app: Scudo preset HSE,
Conti previsione incassi, Terra andamento volumi, Campo avanzamento giornata,
Sentinella carica max, Flotta ripartizione costi. + 4 review adversarial (11
bug + hardening) + doc fondatore. Suite 253.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Pivot: nuove ricerche/programmi
(founder chiede esplicitamente), o estensione suite emulatore, o terze
iterazioni mirate. SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

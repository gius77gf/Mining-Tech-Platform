# Checkpoint — 2026-07-21T11:05:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo avanzamento giornata)

## Completato
Campo — **avanzamento della giornata**: quante attività sono concluse sul
totale, con ripartizione per stato (in corso/pianificate/anomalie). Dà al
preposto un "quanto manca" a colpo d'occhio.
- campo-data.js: `avanzamentoGiornata(attivita)` → {totale, concluse, inCorso,
  pianificate, anomalie, pct}. Pura e testabile.
- index.html: nota "Avanzamento" in cima al Quadro (sopra "Oggi in cava").
- run-kpi.mjs: +2 test. KPI 128→130; totale CI 247→249.
Verifica: KPI 130/0, syntax OK, Playwright ("1/5 concluse (20%) · 2 in corso ·
1 pianificate · 1 anomalie", nessun errore).

## Stato roadmap
6 app verticali robuste, tutte le superfici in review adversarial (11 bug +
hardening), + rifiniture (Scudo preset HSE, Conti previsione, Terra andamento,
Campo avanzamento) + doc fondatore + suite 249.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI: altre
seconde iterazioni (es. Flotta/Sentinella rifiniture), nuove ricerche/programmi.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

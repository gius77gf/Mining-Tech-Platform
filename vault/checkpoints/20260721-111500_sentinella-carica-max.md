# Checkpoint — 2026-07-21T11:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella carica massima per ritardo)

## Completato
Sentinella — **carica massima per ritardo** (inverso della distanza scalata):
in progettazione volata, da una SD obiettivo di sicurezza e dalla distanza a un
ricettore, dice la carica MAX per ritardo da non superare — W=(R/SD)².
- sentinella-data.js: `caricaMax(distanzaM, sdObiettivo)`. Pura e testabile.
- index.html: campo "SD obiettivo" nel widget distanza scalata; riga risultato
  "Per restare sopra SD X: max Y kg per ritardo a Z m".
- run-kpi.mjs: +2 test (inverso coerente con scaledDistance; dati non validi).
  KPI 130→132; totale CI 249→251.
Verifica: KPI 132/0, syntax OK, Playwright ("max 25 kg per ritardo a 100 m" con
SD 20, nessun errore).

## Stato roadmap
6 app verticali robuste, tutte in review adversarial (11 bug + hardening),
seconde iterazioni su Scudo/Conti/Terra/Campo/Sentinella + doc fondatore +
suite 251.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Completare il giro di seconde
iterazioni con Flotta; poi nuove ricerche/programmi o altri approfondimenti.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

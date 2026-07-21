# Checkpoint — 2026-07-21T12:35:00Z

## Tipo
unit-complete (ricerca + feature)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti interessi di mora 231/2002)

## Completato
Ricerca→feature per Conti (crediti). `vault/RICERCA_INTERESSI_MORA.md`: D.Lgs
231/2002 sulle transazioni commerciali B2B — interessi di mora automatici
(dal giorno dopo la scadenza, senza messa in mora) al tasso BCE + 8 punti
(1° sem 2026 = 10,15%, GU 15/2026) + €40 forfettari art. 6. Feature:
- conti-data.js: `interessiMora(importo, giorniRitardo, tasso=10.15)` +
  costanti TASSO_MORA_DEFAULT/SPESE_RECUPERO_231. Pura e testabile.
- index.html: sulle fatture insolute la lista mostra "mora ~€X" (tooltip col
  tasso e le €40 spese, "da confermare col commercialista").
- run-kpi.mjs: +2 test. KPI 138→140; totale CI 257→259.
Verifica: KPI 140/0, syntax OK, Playwright (Edilcave insoluta 13gg → "mora ~€66"
= 18300×10,15%×13/365; nessun errore). Framing onesto (tasso di riferimento).

## Stato roadmap
6 app robuste, 6 review adversarial, seconde/terze iterazioni, 3 ricerche→
feature (HSE→Scudo, accuratezza→Terra, mora→Conti), doc fondatore. Suite 259.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

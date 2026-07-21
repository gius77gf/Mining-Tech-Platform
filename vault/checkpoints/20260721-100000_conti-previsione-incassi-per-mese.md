# Checkpoint — 2026-07-21T10:00:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti previsione incassi per mese)

## Completato
Conti — **previsione incassi per mese** (liquidità attesa nel tempo, non solo
un totale a finestra).
- conti-data.js: `incassoPerMese(fatture, mesi=6, oggi)` — raggruppa le fatture
  non incassate e non scadute per mese-calendario (yyyy-mm) nei prossimi N mesi;
  le già scadute vanno in un bucket "scadute" a parte (da sollecitare, non
  entrate future). Ora locale, usa il conteggio giorni già corretto. Pura.
- index.html: sezione "Previsione incassi (prossimi mesi)" nel Report, coi mesi
  in italiano e una nota sulle escluse-scadute.
- run-kpi.mjs: +2 test. KPI 124→126; totale CI 241→243.
Verifica: KPI 126/0, syntax OK, Playwright (6 righe mese; lug €9.750, ago
€14.000 dai dati demo; nessun errore di pagina).

## Stato roadmap
6 app verticali robuste + 3 review adversarial (9 bug reali corretti) + Conti
con previsione incassi + Scudo preset HSE + suite 243 + doc fondatore.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI: altre
seconde iterazioni (es. export del report Conti che includa la previsione), o
altre voci HSE, o nuove review/ricerche.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

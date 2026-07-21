# Checkpoint — 2026-07-21T09:30:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo SCADENZE_PRESET HSE)

## Completato
Scudo — **adempimenti HSE preimpostati** nello scadenzario (passo 1 del backlog
della ricerca RICERCA_HSE_SCADENZE_CAVA.md). Stesso pattern di SOGLIE_PRESET di
Sentinella.
- scudo-data.js: `SCADENZE_PRESET` (14 voci, categoria persona/azienda:
  sorveglianza sanitaria, formazioni+aggiornamenti, preposto/dirigente, primo
  soccorso, antincendio, RLS, patentini attrezzature, fochino; DSS, DVR,
  verifiche attrezzature, riunione sicurezza) + `presetScadenza(chiave)` con
  `daVerificare` sempre true. Doppio binario 81/2008 + 624/96 (DSS).
- index.html: menu "Adempimento tipico di cava…" (raggruppato persona/azienda)
  che prepara descrizione e tipo; la DATA la mette l'utente (periodicità da
  confermare con RSPP/medico competente — nota di avviso).
- run-kpi.mjs: +2 test. KPI 122→124; totale CI 235→237.
Verifica: KPI 124/0, syntax OK, Playwright (15 opzioni, "sorv-sanitaria"
prefilla descrizione + tipo "Visita medica" + nota visibile, nessun errore).

## Stato roadmap
6 app verticali con import+export CSV robusto + conteggi giorni corretti +
Scudo con preset HSE (backlog ricerca avviato) + suite 237 + doc fondatore.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
altre voci del backlog HSE (filtro persona/azienda nello scadenzario; soglia
lunga 60/90gg), o seconde iterazioni UX su altre app, o nuove ricerche.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

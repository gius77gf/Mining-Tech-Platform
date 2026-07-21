# Checkpoint — 2026-07-21T06:21:34Z

## Tipo
unit-complete (epica M)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo copertura formazione)

## Completato
Scudo — **matrice di copertura formazione per tipo** (voce ricerca:
matrice competenze con gap/scadenze). Nuova vista sui dati esistenti.
- scudo-data.js: `coperturaFormazione(scadenze)` → per ogni tipo (visite,
  corsi, DPI, patentini…) conteggi regolari/in-scadenza/scadute + totale,
  ordinati dalla situazione peggiore. Pura e testabile.
- index.html: sezione "Copertura formazione (per tipo)" in cima alla pagina
  Scadenze, con badge dominante per gravità.
- run-kpi.mjs: +2 test. Suite KPI 98→100 (traguardo 100 KPI); CI 208→210.
Verifica: KPI 100/0, syntax OK, screenshot (Corso/Visita medica scadute,
DPI/Formazione in scadenza, Patente regolare). Coerente shell.

## Stato roadmap
Epiche M fatte stanotte: Flotta ricambi+work order; Campo rapportino+consegna;
Scudo copertura formazione. Restano: Conti solleciti a livelli; e
ponti/integrazioni (gated). Rifiniture varie sempre possibili.

## REGOLA FONDATORE: NON FERMARSI MAI (ribadita 21/07). Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere: Conti — solleciti
a livelli (helper `livelloSollecito` dalle fasce di ritardo → 1°/2°/ultimo
sollecito) mostrato sulle fatture insolute. Continuare SENZA FERMARSI.

## Blocchi
Ciclo chiuso e integrazioni: gated (fondatore). Genesi frammentazione:
gated (motore fisico) — formule pronte nel vault.

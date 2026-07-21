# Checkpoint — 2026-07-21T06:24:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti solleciti a livelli)

## Completato
Conti — **solleciti a livelli** sulle fatture insolute (voce ricerca:
gestione crediti/solleciti).
- conti-data.js: `livelloSollecito(giorniRitardo)` → nessuno / 1° sollecito
  (≤15 gg) / 2° sollecito (≤45) / ultimo avviso (>45), con classe colore.
  Pura e testabile.
- index.html: sulla lista fatture, per le insolute compare il livello di
  sollecito accanto alla scadenza.
- run-kpi.mjs: +1 test (fasce + confini). Suite KPI 100→101; CI 210→211.
Verifica: KPI 101/0, syntax OK, verificato in Playwright (Edilcave scaduta
~13 gg → "1° sollecito"; incassate/non scadute nessun sollecito). Coerente.

## Stato roadmap
Epiche M e voci di valore in-app in larga parte coperte su TUTTE le 6 app
verticali + varie rifiniture. Suite CI a 211. Restano soprattutto i
ponti/integrazioni (gated fondatore) e seconde iterazioni.

## REGOLA FONDATORE: NON FERMARSI MAI (ribadita 21/07). Proseguo a oltranza:
finito il grosso del programmato, si continua con rifiniture, seconde
iterazioni, ricerche di secondo passaggio e nuovi programmi.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Poiché le voci "grosse"
in-app sono coperte, passare a: (a) seconde iterazioni/rifiniture UX per
app, oppure (b) ricerche di secondo passaggio che de-rischiano altre voci,
oppure (c) estendere le suite test emulatore (casi limite). Continuare
SENZA FERMARSI.

## Blocchi
Ciclo chiuso e integrazioni: gated (fondatore). Genesi frammentazione:
gated (motore fisico) — formule pronte nel vault.

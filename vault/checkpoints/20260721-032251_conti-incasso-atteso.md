# Checkpoint — 2026-07-21T03:22:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Conti incasso atteso)

## Completato
Conti — **incasso atteso nei prossimi 30 giorni** (cassa in entrata
prevista, complementare all'aging che guarda al ritardo passato).
- conti-data.js: `incassoAtteso(fatture, giorniAvanti=30, oggi)` →
  { conto, importo } delle fatture aperte in scadenza da oggi a oggi+N.
- index.html: riga nel Report "Incasso atteso (prossimi 30 gg): €X · N
  fatture".
- run-kpi.mjs: +2 test (finestra con confini; vuoto). Suite KPI 92→94;
  totale CI 202→204.
Verifica: KPI 94/0, syntax OK, report renderizza "€23.750 · 3 fatture"
(demo). Coerente shell.

## Stato roadmap
~16 unità in-app isolate completate (research + feature + rifiniture +
revisione). Le voci isolate a basso rischio si stanno esaurendo. Restano
epiche M (Scudo matrice competenze, Campo rapportino turno, Flotta work
order, Conti solleciti a livelli) e ponti/integrazioni (gated fondatore).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Valutare l'avvio di una
EPICA M spezzata in sotto-unità (proposta: Flotta work order — nuova
collezione ordini di lavoro che consuma ricambi) OPPURE continuare con
rifiniture. Continuare fino a esaurimento crediti.

## Blocchi
Ciclo chiuso e integrazioni: gated (decisione fondatore). Genesi
frammentazione: gated (motore fisico).

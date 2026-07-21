# Checkpoint — 2026-07-21T03:33:21Z

## Tipo
unit-complete (epica M — prima parte)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta magazzino ricambi)

## Completato
Flotta — **magazzino ricambi** con soglia di riordino (voce M della
ricerca: il 34% dei ritardi di riparazione nasce dai ricambi mancanti).
Prima EPICA M realizzata (nuova collezione + form + gestione).
- flotta-data.js: nuova collezione `ricambi` ({nome, giacenza, sogliaMin})
  in DEMO + wiring nell'api (live e demo); helper `sottoScorta(ricambi)`
  → ricambi con giacenza ≤ soglia, ordinati per gravità, con `mancano`.
- index.html: sezione "Magazzino ricambi" nella pagina Manutenzioni con
  alert "N sotto scorta — da riordinare: …", lista con badge sotto-scorta/
  ok, carico (+1)/scarico (−1, mai < 0)/rimozione, e form di aggiunta.
- run-kpi.mjs: +2 test (sottoScorta ordine/gravità/confine =soglia; vuoto).
  Suite KPI 94→96; totale CI 204→206. Demo integrity 6/6 (nuova collezione
  non rompe nulla).
Verifica: KPI 96/0, demo 6/0, syntax OK, screenshot (3 sotto scorta,
lista+form completi). Coerente shell.

## Stato roadmap
~18 unità + questa M. Restano epiche M (Flotta work order che consuma
questi ricambi; Campo rapportino turno; Scudo matrice competenze; Conti
solleciti a livelli) e i ponti/integrazioni (gated). I due item gated
in-app (ciclo chiuso, Genesi frammentazione) sono DE-RISCHIATI con schede
tecniche nel vault, pronti alla decisione del fondatore.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Naturale seguito: Flotta —
ordini di lavoro (work order) che scaricano i ricambi dal magazzino
(collega manutenzione↔ricambi↔costi). Oppure altra epica M. Continuare
fino a esaurimento crediti.

## Blocchi
Ciclo chiuso e integrazioni: gated (fondatore). Genesi frammentazione:
gated (motore fisico) — ma formule pronte nel vault.

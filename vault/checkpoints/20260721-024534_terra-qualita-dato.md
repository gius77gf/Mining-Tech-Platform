# Checkpoint — 2026-07-21T02:45:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Terra qualità dato)

## Completato
NONA UNITÀ del backlog "subito/S" (Roadmap di Visione):
Terra — **qualità del dato sui rilievi** (rende il volume difendibile).
- terra-data.js: `qualitaRilievo(r)` → stringa "metodo · GSD N cm"
  (vuota se non si sa nulla). DEMO r1 arricchito (RTK+GCP, GSD 2).
- index.html: nel form "Nuovo rilievo" un menu Metodo (RTK/PPK/RTK+GCP/
  GCP/senza GCP) e un campo GSD (cm), salvati sul rilievo; nella lista la
  qualità appare nella riga del rilievo.
- run-kpi.mjs: +1 test (composizione metodo+GSD e casi vuoti).
  Suite KPI 79→80; totale CI 189→190.
Verifica: KPI 80/0, demo 6/0, helpers 22/0, syntax OK, screenshot
(rilievo 15/07 → "RTK+GCP · GSD 2 cm"; form con Metodo+GSD). Coerente shell.

## Stato roadmap
Backlog Visione "subito/S": 9 unità completate stanotte, una per app +
extra (Sentinella soglie+SD, Conti aging+gare, Scudo idoneità, Terra
valore+qualità, Campo causali, Flotta previsione). Restano voci M/gated:
Genesi 2° modello frammentazione (motore fisico, cautela), registro
volate completo (nuova collezione), e tutte le epiche M/L della Visione.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Le voci "subito/S" più
semplici sono esaurite: passare alle epiche M della Visione (es. Scudo
scadenzario unificato con alert multi-soglia; Flotta work order + ricambi;
Campo rapportino di turno) OPPURE seconde iterazioni/rifiniture. Scegliere
una voce isolata e a basso rischio. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi frammentazione resta l'unica gated di fatto (motore fisico).

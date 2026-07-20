# Checkpoint — 2026-07-20T15:46:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8cf3b99

## Completato
Test business-logic: flotta.kpiFrom carburante isola il filtro /carburante/i
(sottostringa + case-insensitive, somma multipla, esclusione voci non
pertinenti). run-kpi locale: 45 passati, 0 falliti. Totale 146→147.

## Stato roadmap
Suite 113→147 in questo ciclo. Copertura funzioni pure molto ampia.

## Prossimo passo atomico
Merge PR test-flotta-carburante (dopo CI verde; job "...(147)"), riparti
branch da main. Prossimo candidato test: conti.kpiFrom inScadenza —
verificare che conti solo le fatture NON incassate con scadenza entro 10
giorni (una incassata con scadenza vicina NON deve contare; una non
incassata scaduta o entro 10gg conta). Oppure passare a un asse diverso:
estendere run-demo.mjs o run-helpers.mjs con un caso non coperto. In
alternativa, se la copertura test sembra satura, tornare al punto 1 (UX)
e cercare un'altra seconda iterazione non ancora fatta su una app.
Continuare a piccole unità fino a esaurimento crediti.

## Blocchi
Nessuno.

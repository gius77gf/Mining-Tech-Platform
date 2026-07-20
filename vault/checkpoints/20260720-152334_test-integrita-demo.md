# Checkpoint — 2026-07-20T15:23:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3d26237

## Completato
Test integrità dati demo: ogni kpiFrom eseguito sui PROPRI dati DEMO
(vetrina del tour) deve dare KPI tutti numeri finiti o null previsto,
mai NaN/undefined. Helper finitoOnull + kpiTuttoFinito. Intercetta
modifiche ai dati di esempio che sbagliano nome campo/tipo.
run-kpi.mjs in locale: 38 passati, 0 falliti.
Suite KPI 32→38, totale 134→140; job CI aggiornato.

## Stato roadmap
Punto 4 (test) molto solido ora: confini funzioni stato, input vuoti
kpiFrom, integrità dati demo. Suite 113→140 in tre unità.

## Prossimo passo atomico
Merge PR integrità-demo (dopo CI verde; job "...(140)"), riparti branch
da main. La copertura test delle funzioni pure è ora ampia. Passare al
punto 5 della lista "roadmap non finita": REVISIONE QUALITÀ/SICUREZZA
di ciò che è su main. Unità concreta: rileggere le liste HTML toccate
oggi (terra fro/pia, sentinella reg, scudo pers/scad, campo) e
verificare che ogni interpolazione di campo utente passi da esc()
(anti-XSS) — in particolare i .meta/.name delle nuove voci. Se tutto
già escapato, documentare l'esito in docs/AUDIT_SICUREZZA.md come punto
verificato. Scegliere UNA app, verificare, commit+checkpoint+PR.

## Blocchi
Nessuno.

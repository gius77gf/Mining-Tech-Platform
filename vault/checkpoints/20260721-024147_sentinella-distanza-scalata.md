# Checkpoint — 2026-07-21T02:41:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Sentinella)

## Completato
OTTAVA UNITÀ del backlog "subito/S" (Roadmap di Visione):
Sentinella — **distanza scalata delle volate** (SD = R/√W).
- sentinella-data.js: `scaledDistance(distanzaM, caricaKg)` → R/√W
  (null se dati non validi; niente divisione per zero/NaN).
- index.html: mini-calcolatore "Distanza scalata (volate)" nella pagina
  Monitoraggi con input carica per ritardo (kg) e distanza (m); mostra
  dal vivo l'SD con nota interpretativa.
- run-kpi.mjs: +2 test (SD corretto, dati non validi=null).
  Suite KPI 77→79; totale CI 187→189.
Verifica: KPI 79/0, syntax OK, screenshot (300 m / 100 kg → SD 30).
Coerente shell. È il primo mattone della correlazione vibrazione↔volata.

## Stato roadmap
Backlog Visione "subito/S": 8 unità completate (Sentinella soglie, Conti
aging, Scudo idoneità, Terra valore, Campo causali, Flotta previsione,
Conti gare, Sentinella distanza scalata). Restano: Terra report qualità
dato (S, isolata); Genesi frammentazione (gated, motore fisico); registro
volate completo (M, nuova collezione).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere: Terra — scheda
"qualità del dato" sui rilievi (metodo RTK/PPK, GCP sì/no, GSD, data)
mostrata nella lista, per rendere il volume difendibile in audit. Taglia
S, additiva al form/lista rilievi. Riferimento in [[Potenziale — Terra]].
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

# Checkpoint — 2026-07-21T02:38:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Conti gare)

## Completato
SETTIMA UNITÀ del backlog "subito/S" (Roadmap di Visione), presa la
voce 8 (Conti gare) al posto della voce 7 (Genesi frammentazione):
Genesi tocca il MOTORE FISICO — il fondatore ha detto di non toccarlo —
quindi rimandata; scelta una voce isolata e sicura.
Conti — **riepilogo gare d'appalto** (esito e tasso di vittoria).
- conti-data.js: `gareRiepilogo(gare)` → aperte/vinte/perse, base d'asta
  per stato, tasso di vittoria sulle sole gare DECISE (null se nessuna
  decisa, niente divisione per zero).
- index.html: riga di riepilogo in cima alla pagina Gare (aperte + base,
  vinte + valore, perse, tasso di vittoria %).
- run-kpi.mjs: +2 test (conteggi/valori/tasso, nessuna decisa=null).
  Suite KPI 75→77; totale CI 185→187.
Verifica: KPI 77/0, syntax OK, screenshot (demo: 2 aperte €460k, 1 vinta
€85k, 1 persa, tasso 50%). Coerente shell.

## Stato roadmap
Backlog Visione "subito/S": 7 unità completate (Sentinella soglie, Conti
aging, Scudo idoneità, Terra valore, Campo causali, Flotta previsione,
Conti gare). Restano voci isolate: Sentinella registro volate, Terra
report qualità dato. Genesi frammentazione = da fare CON cautela sul
motore (valutare col fondatore).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere: Sentinella —
registro volate (data/ora, carica per ritardo, distanza) collegabile
alle letture di vibrazione, taglia S, isolata. Riferimento in
[[Potenziale — Sentinella]]. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi frammentazione: gated di fatto (motore fisico, cautela
fondatore).

# Checkpoint — 2026-07-21T02:15:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Conti)

## Completato
SECONDA VOCE DEL BACKLOG "subito/S" (Roadmap di Visione):
Conti — **aging incassi** (crediti aperti per fascia di ritardo).
- conti-data.js: export `agingIncassi(fatture, oggi)` → fasce
  nonScaduto / 1-30 / 31-60 / 61-90 / oltre90 (conto + importo) +
  `scadutoTot`. Esclude le incassate; g=0 (scadenza oggi) = non scaduto.
- index.html: sezione "Aging incassi" nel Report con badge per fascia
  (warn 1-60, danger 61+) e nota "Totale scaduto da sollecitare".
- run-kpi.mjs: +3 test (fasce+importi, vuoto no-crash, confine g=0).
  Suite KPI 62→65; totale CI 172→175 (job name aggiornato).
Verifica: KPI 65/0, syntax OK, screenshot Report (demo: €18.300 in
1-30 gg, totale scaduto corretto) — coerente con lo stile shell.

## Stato roadmap
Backlog Visione: fatte 2 voci su 10 "subito/S" (Sentinella soglie,
Conti aging). Prossime pronte: Scudo idoneità sanitaria, Terra m³→valore,
Campo causali fermo, Flotta scadenzario predittivo leggero, ecc.

## Prossimo passo atomico
Aprire PR di questa unità; dopo merge, RESTART da origin/main e prendere
la voce 3: Scudo — giudizio di idoneità sanitaria strutturato (idoneo/
idoneo con prescrizioni/non idoneo + limitazioni + data prossima visita),
taglia S. Riferimento in [[Potenziale — Scudo]] (art. 41). Continuare
fino a esaurimento crediti.

## Blocchi
Nessuno.

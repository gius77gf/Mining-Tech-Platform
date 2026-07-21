# Checkpoint — 2026-07-21T02:10:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Sentinella)

## Completato
PRIMA VOCE DEL BACKLOG "subito/S" della Roadmap di Visione:
Sentinella — **libreria di soglie normative preimpostate**.
- sentinella-data.js: export `SOGLIE_PRESET` (10 voci: DIN 4150-3
  fondazione+piano alto, USBM RI8507, airblast USBM RI8485 133 dB,
  PM10 UE 50/40/20) + helper `presetSoglia(chiave)` (daVerificare
  sempre true). Rumore NON preimpostato (dipende dalla classe
  acustica: fisso sarebbe fuorviante).
- index.html: nel form "Nuovo sensore" una tendina di preset
  (optgroup per tipo) che riempie unità+soglia e mostra fonte +
  avviso "valore di riferimento, verifica sulla norma/prescrizioni".
  Reset del preset dopo l'aggiunta.
- run-kpi.mjs: +5 test (valori, null-safety, chiavi uniche, campi
  validi, valori DIN corretti). Suite KPI 57→62; totale CI 167→172,
  job name aggiornato.
Valori dalla nota "Soglie normative — riferimento per Sentinella"
(ecosistema-vault), preparata nel secondo passaggio di ricerca (DIN
4150-3 banda-per-banda confermata da fonti concordanti).
Verifica: KPI 62/0, syntax OK, screenshot preset DIN 4150-3 (unità
mm/s, soglia 5, avviso mostrato) — coerente con lo stile shell.

## Stato roadmap
Backlog Visione avviato dal punto 1. Resta il resto delle 10 voci
"subito/S" + epiche M/L. Nessun dato sensibile del fondatore toccato.

## Prossimo passo atomico
Aprire PR di questa unità verso main; dopo merge, RESTART da
origin/main e prendere la voce 2 del backlog: Conti — dashboard DSO +
aging incassi (taglia S). La formula DSO è già in [[Potenziale — Conti]].
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

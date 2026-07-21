# Checkpoint — 2026-07-21T02:24:50Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Terra)

## Completato
QUARTA VOCE DEL BACKLOG "subito/S" (Roadmap di Visione):
Terra — **conversione m³ → tonnellate → valore** (ponte alla contabilità).
- terra-data.js: `valoreMateriale(volumeM3, densita, prezzoTon)` →
  { tonnellate, valore } (input non validi = 0, niente NaN).
- index.html: pannello "Valore del materiale estratto" nella pagina
  Rilievi con input densità (t/m³, default 1,6) e prezzo (€/t, default
  12); mostra dal vivo "Estratto <anno>: X m³ → Y t → € Z". Ricalcolo
  all'input.
- run-kpi.mjs: +2 test (conversione, input non validi). Suite KPI 68→70;
  totale CI 178→180.
Verifica: KPI 70/0, syntax OK, screenshot (79.400 m³ → 127.040 t →
€ 1.524.480 a 12€/t; ricalcolo a 15€/t). Coerente con lo stile shell.

## Stato roadmap
Backlog Visione: 4 voci su 10 "subito/S" fatte (Sentinella soglie, Conti
aging, Scudo idoneità, Terra valore). Prossime: Campo causali fermo,
Flotta scadenzario predittivo leggero, Genesi 2° modello frammentazione,
Conti modulo gare, Sentinella registro volate, Terra report qualità dato.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere la voce 5:
Campo — causali di fermo standardizzate (base per OEE/disponibilità),
taglia S. Riferimento in [[Potenziale — Campo]]. Continuare fino a
esaurimento crediti.

## Blocchi
Nessuno. Possibile rifinitura: fattore shrink/swell e densità/prezzo per
materiale (oggi valori unici impostati a mano).

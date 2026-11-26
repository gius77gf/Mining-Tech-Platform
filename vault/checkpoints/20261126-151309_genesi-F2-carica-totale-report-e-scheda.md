# Checkpoint — 2026-11-26T15:13:09Z

## Tipo
unit-complete (calcolo + copertura con controprova)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1a427e53 (chore(vault): i sei chiamanti della carica totale letti uno per uno…)

## Cosa è stato completato — F2, secondo pezzo
- Modulo: `scartoCaricheProprie(holes, kg)` (somma di carica propria −
  carica del progetto; 0 se nessuna; null se la carica del progetto non si
  legge); `caricaTotale(nf, kg, scarto)` con terzo argomento facoltativo
  (assente/0/illeggibile → `nf × kg` alla cifra, provato con `Object.is` su
  16 combinazioni × 6 forme di «niente»); `costoVolata` passa `o.scartoKg`.
- Pagina: il REPORT (`_cR`) e il CSV della scheda volata (`_cKCsv`) passano
  `scartoKg:scartoCaricheProprie(D2.holes, D2.kg)` — i due chiamanti dove
  `nf` sono i fori disegnati e non c'è un verso inverso.
- Un'iniezione di `genesi-csv-fori-disegnati.mjs` citava alla lettera la
  riga cambiata: l'ha preso `iniezioni-fresche` (742 su 743) PRIMA del
  commit; riagganciata, banco 4/0 e controprova che cade ancora.
- Banco `genesi-foro-per-foro.mjs`: 15 → 17 (legge «Carica totale (kg)» dal
  CSV premendo il bottone vero: 12 × 58 − 23 − 58 = 615; senza cariche
  proprie 696); controprova: 4 KO, 3 iniezioni su 3 applicate per file.
- `run-kpi.mjs` 3236 → 3237.

## Numeri propagati
3.734 → **3.735**; `genesi-data.js` 184 → **185**, condivisi 357 → **358**;
giro `node` scritto **4332** per somma (+1 prova, nessun file nuovo).

## Prossimi passi
- **Prossimo passo atomico**: i quattro chiamanti rimasti, nell'ordine del
  checkpoint «chiamanti letti» (20261126, stesso giorno): (a) la scheda
  validatori (~7747: capire che cos'è `Q` e calcolare lo scarto rispetto a
  quello); (b) il registro per Sentinella (~5132: verificare da dove viene
  `nf`); (c) `syncKgTot` e il suo verso inverso — prima il disegno in
  scratchpad (i fori con carica propria restano fermi, il totale scritto si
  distribuisce sugli altri; casi limite: tutti con carica propria, totale
  minore della somma delle proprie), e se non è ovvio va in
  docs/DECISIONI_WEEKEND.md; (d) `computeKPI`, che conta sulla GRIGLIA.
- Poi il consumo specifico e i metri perforati per foro; poi F3.

## Blocchi
Nessuno.

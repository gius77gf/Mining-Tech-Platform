# Checkpoint — 2026-11-26T16:32:25Z

## Tipo
unit-complete — ciclo automatico del 26/11.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0d99ada7 (fix(genesi): la maglia non si rigenera più a ogni parametro toccato; il campo "Esplosivo totale" regge nei due versi)

## Le verifiche che il commit precedente aveva lasciato in corso — ESITO
- Giro `node` su 0d99ada7: **43 comandi su 43, 4334 asserzioni** (letto dal
  giro tutto verde, uguale ai documenti).
- Passata di TUTTI i banchi di Genesi nel browser sull'albero di lavoro
  (55 file: `genesi-*.mjs` e `ponte-genesi-*.mjs`): **54 verdi, 1 a uscita
  1** — `genesi-campi-assenti.mjs`, «NON MISURATI (2): la spalla…». Rifatto
  IDENTICO sul commit 9b2d642b (worktree, prima della modifica): stessi 2 non
  misurati, 55 passati su 64 attesi. Non è una regressione: è lo stato che il
  banco stesso dichiara e spiega nel suo commento (dal G37 il progetto senza
  spalla non disegna righe; lo scenario «la spalla sparisce DOPO che i fori
  esistono» è una domanda aperta scritta lì). Nessun banco contava sulla
  rigenerazione della maglia.
- `genesi-maglia-assente.mjs` (iniezione riagganciata): 16/0, controprova
  7 ok + 9 KO, 1 iniezione su 1.
- La compattazione pianificata: `/compact` è arrivato come TESTO alle
  15:50Z, non come comando → attività «Compattazione ogni 3 ore»
  DISATTIVATA (non cancellata), fondatore avvisato.

## Cosa è stato completato in questa unità
`computeKPI` (scheda dei numeri principali): conta sulla GRIGLIA di progetto.
Lo scarto delle cariche proprie si aggiunge solo quando i fori in pianta sono
tanti quanti la griglia (`measureGeom2D(D2).n===nf`); con un foro in più o
in meno resta il nominale, com'è sempre stato, e la carica vera la dicono le
altre superfici. Ponte di debug: `kpiQtot`. Banco 32 → 35 (controprova 16
KO, 6 iniezioni su 6). **Tutti e sei i chiamanti di `caricaTotale` sono ora
coerenti.** Nessun numero tracciato cambia.

## Prossimi passi
- **Prossimo passo atomico — F2, il consumo specifico.** Cercare TUTTI i
  punti che lo calcolano (`grep -n "consumoSpecifico(" apps/genesi/*.{html,js}`):
  oggi è `consumoSpecifico(D2.kg, volumeForo(B,S,prof))`, cioè di UN foro
  tipo. Con cariche proprie quello di volata è carica totale VERA / volume
  totale: capire per ogni punto se mostra «il foro tipo» o «la volata», e
  per il piano di carico (colonna pf per foro) usare la carica di QUEL foro.
  Stessa disciplina: neutralità alla cifra, banco, controprova.
- Poi i metri perforati con profondità per foro; poi F3 (il comando).

## Blocchi
Nessuno.

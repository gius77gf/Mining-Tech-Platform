# Checkpoint — 2026-11-26T15:06:21Z

## Tipo
lettura del codice per il passo successivo (nessun codice scritto): completa
il disegno del checkpoint precedente con ciò che i chiamanti dicono davvero.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
840fa28d (chore(vault): F2 (MIC) confermata dal giro (43/43, 4331) e disegno della carica totale per foro)

## Che cosa ho letto, chiamante per chiamante (genesi.html)
| dove | da dove viene `nf` | la carica | si può aggiungere lo scarto dei fori disegnati? |
|---|---|---|---|
| `computeKPI`, ~3498 | `foriDiProgetto(D2.perRow, D2.file)` — la GRIGLIA | `D2.kg` | ⛔ no alla cieca: la griglia non sono i fori disegnati |
| CSV scheda volata, ~3669 | `_gCsv.n` (fori disegnati, `misuraGeom2D`) | `D2.kg` | sì |
| report, ~4079 | `g.n` (fori disegnati) | `D2.kg` | sì |
| registro per Sentinella, ~5132 | `nf` (da rileggere: il commento parla di `k.nf`) | `D2.kg` o null | da verificare |
| scheda validatori, ~7747 | `g.n||0` (fori disegnati) | `Q`, non `D2.kg` (da rileggere che cosa sia Q) | sì, ma lo scarto va calcolato rispetto a Q |
| `syncKgTot`, ~8128 | `measureGeom2D(D2).n` (fori disegnati) | `D2.kg` | sì — MA vedi sotto |

## ⚠️ Il punto che il disegno precedente non aveva visto: `dKgTot` è a DUE VERSI
Il campo «Esplosivo totale (kg)» non è solo una lettura: chi ci scrive un
totale fa ricalcolare la carica per foro (gestore `change` subito sotto
`syncKgTot`: `tot` diviso per il numero dei fori). Con cariche proprie
l'inverso non è più «totale / fori»: se si mostrasse il totale vero
(n × kg + scarto) e si lasciasse l'inverso com'è, scrivere T darebbe
kg = T/n e il campo rileggerebbe un totale DIVERSO da T — la pagina che si
smentisce da sola.
La forma coerente (da provare in scratchpad, e da dichiarare a schermo): i
fori con una carica propria restano fermi, e il totale scritto si
distribuisce sugli altri — `kg = (T − Σ cariche proprie) / (fori senza
carica propria)`. Casi da decidere PRIMA di scrivere: tutti i fori hanno
una carica propria (non c'è niente da distribuire: il campo lo dice, non
divide per zero); T minore della somma delle cariche proprie (carica
negativa: si rifiuta col motivo).
⚠️ È una scelta di comportamento: se letta nel codice non risulta ovvia,
va in docs/DECISIONI_WEEKEND.md prima di implementarla.

## Prossimi passi
- **Prossimo passo atomico**: nel modulo, `scartoCaricheProprie(holes, kg)`
  e `caricaTotale(nf, kg, scarto)` con le prove di neutralità; primo
  consumatore il REPORT (~4079) e il CSV della scheda volata (~3669), dove
  `nf` sono i fori disegnati e non c'è un verso inverso. `syncKgTot` e
  `computeKPI` per ultimi, dopo aver deciso i due punti qui sopra.
- F3 (il comando per l'utente) resta DOPO che tutti e sei i chiamanti sono
  coerenti.

## Blocchi
Nessuno.

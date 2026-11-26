# Checkpoint — 2026-11-26T16:44:20Z

## Tipo
unit-complete — ciclo automatico del 26/11.

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
586e0d71 (feat(genesi): foro per foro, F2 — la scheda dei numeri principali segue le cariche vere…)
Giro `node` su quel commit: 43 comandi su 43, **4334** asserzioni.

## Cosa è stato completato
`energiaSuMaglia` (genesi-data.js): il volume servito e il consumo specifico
di ogni foro (`h.volLoc`, `h.pfLoc`) usano la profondità e la carica di QUEL
foro quando ne ha (`valoreProprioDiForo`), altrimenti quelle della volata —
stesse variabili e stessa formula, quindi identico a prima senza valori
propri. Ne seguono, senza altre modifiche: le colonne «volume servito» e
«pf» del piano di carico, e la mappa a colori del consumo nel Progetto.
- `run-kpi` 3239 → 3240 (carica doppia → consumo doppio e volume fermo;
  profondità dimezzata → volume dimezzato; foro scarico → consumo 0, numero
  vero; null/vuoto non sono valori propri; gli altri fori identici).
- Banco `genesi-foro-per-foro.mjs` 35 → 39 (legge le colonne per NOME dal
  CSV premuto; il ricalcolo si fa ripartire ritoccando il borraggio, come
  farebbe l'utente); controprova 18 KO, 7 iniezioni su 7.

## Numeri propagati
3.737 → **3.738**; giro `node` scritto **4335** per somma.

## ⚠️ Che cosa NON è stato toccato, e perché va deciso dal fondatore
Tre punti prendono UNA carica per tutta la volata e sono MODELLO, non conto:
- la frammentazione (`fragSenzaConto`/Kuz-Ram in genesi-data.js ~1906: usa
  `o.kg` e il consumo specifico del foro tipo);
- la simulazione 3D (genesi.html ~1908: `P.kg`) e il cumulo (~6335);
- il consumo specifico «di progetto» (`pfDiProgetto`, genesi-data.js ~1880).
Con cariche diverse per foro, che numero ricevono? La media dei fori? Il
foro tipo del progetto, dichiarando che la previsione è per quello? È una
scelta sul significato di una PREVISIONE: va in docs/DECISIONI_WEEKEND.md
(sezione 33 da scrivere), non implementata di iniziativa. Fino ad allora
quei tre restano sulla carica del progetto.

## Prossimi passi
- **Prossimo passo atomico**: (1) scrivere la sezione 33 di
  docs/DECISIONI_WEEKEND.md con la domanda qui sopra, in parole semplici, con
  le strade e una raccomandazione; (2) i metri perforati con profondità per
  foro: `metriPerforati(nf, prof, sub)` e i suoi chiamanti (stessa forma
  della carica totale: uno scarto delle profondità proprie, e gli stessi
  sei punti da guardare uno per uno).
- Poi F3: il comando «a questi fori: carica / profondità / borraggio» sulla
  selezione multipla, con l'input letto da `numIt`.

## Blocchi
Nessuno.

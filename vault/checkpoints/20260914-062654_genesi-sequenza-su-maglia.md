# Checkpoint — 2026-09-14T06:26:54Z

## Tipo
unit-complete (cantiere B3 — ottava e ULTIMA volta sullo stesso falso positivo; chiude il gruppo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`computeSeq2D` estratta in `genesi-data.js`** (blocco G42,
`sequenzaSuMaglia`), stessa esatta causa già diagnosticata per
`innescoSuMaglia`/G39, `reliefSuMaglia`/G40, `energiaSuMaglia`/G41: il
censimento statico marcava la funzione «più di dieci variabili del
modulo» per un falso positivo dell'euristica sull'indentazione. Letta a
mano: la dipendenza vera è `D2.holes`, `D2.ritardo`, `D2.ritardoFila`,
`D2.S`, `D2.dir`, `D2.sequenza` (`h.tMano` è una proprietà per foro, non
un campo di `D2`).

**Con questa unità si chiude l'intero gruppo diagnosticato in una sessione
precedente**: tutte e quattro le funzioni (`computeInnesco2D`,
`computeRelief2D`, `computeEnergia2D`, `computeSeq2D`) sono ora pure in
`genesi-data.js`.

**Scelta architetturale dichiarata, non presa di default** (segnalata come
punto da decidere nel checkpoint precedente): `sequenzaSuMaglia` fa SOLO il
calcolo (`tCalc`/`tDet`/`seq` per ogni foro, `lastDet` come valore di
ritorno). NON chiama `reliefSuMaglia`/`energiaSuMaglia`/`innescoSuMaglia`
al proprio interno, anche se ormai sono tutte pure e nello stesso modulo:
comporle è una decisione di ORCHESTRAZIONE (in che ordine si ricalcola la
pagina dopo un cambio di sequenza), non di calcolo, e resta nel wrapper di
pagina — lo stesso principio per cui `shared/dw-ponti.js` tiene la logica
FRA le app senza duplicarla, applicato qui alla logica FRA le fasi del
progetto. Il trasloco resta "parola per parola" sul calcolo, non un
rifacimento a metà.

Il legame nella pagina: `function computeSeq2D(){ D2.lastDet =
sequenzaSuMaglia(D2.holes, D2.ritardo, D2.ritardoFila, D2.S, D2.dir,
D2.sequenza); if(!D2.holes.length) return; computeRelief2D();
computeEnergia2D(); computeInnesco2D(); }` — riproduce esattamente il
comportamento originale (guardia su holes vuoti che salta la chiamata
delle altre tre, mantenuta con lo stesso ordine).

**Verificato, in ordine crescente di rigore**:
1. Confronto diretto contro una copia della vecchia forma inline su 5 casi
   (incluso un solo foro e due fori sovrapposti) **× 8 varianti** (le 4
   sequenze `diagonale`/`vcut`/`box`/`riga` incrociate coi 2 versi `sx`/
   `dx`) — **byte per byte identici**, più il valore di ritorno `lastDet`
   confrontato separatamente.
   ⚠️ **Nota di metodo**: la prima stesura delle varianti (4 combinazioni
   scelte a mano) NON esercitava il percorso `cd` con `dir='dx'` insieme a
   una sequenza che lo usa (`diagonale`/`riga`) — un'iniezione del difetto
   storico (ignorare `dir` nel calcolo di `cd`) è passata inosservata al
   primo tentativo. Corretto allargando le varianti al prodotto cartesiano
   completo (4 sequenze × 2 direzioni = 8), che ha preso l'iniezione al
   primo colpo. È la stessa lezione già scritta in CLAUDE.md — *"una prova
   che non sa fallire non dimostra niente"* — applicata mentre si scriveva
   la prova, non dopo.
2. `run-kpi.mjs`: 3 nuove prove. 2957 → **2960**, 0 falliti.
3. **Difetto iniettato a mano e ripristinato verificando il file identico
   byte per byte**: `cd=(dir==='sx'?(h.mx-minMx):(maxMx-h.mx))/Snom`
   sostituito con `cd=(h.mx-minMx)/Snom` (ignora `dir`) — la prova cade
   correttamente sulle combinazioni `dir='dx'` con `diagonale`/`riga`.
4. `copertura-funzioni.mjs`: `genesi-data.js` 149/149 → **150/150**.
5. **Verifica nel browser vero** (Playwright, volata con 15 fori reali,
   cambio di sequenza da `diagonale` a `vcut` tramite il vero select
   `#dSeq`): `tDet`/`seq` ricalcolati (i due stati sono diversi), il foro
   più centrale ottiene `seq=0` col V-cut (converge dal centro, come da
   formula), `lastDet` positivo, relief/energia/innesco tutti ricalcolati
   di conseguenza, **zero errori di pagina** — screenshot in
   `scratchpad/screenshot-sequenza/`.
6. Giro completo su `git worktree` isolata, **due passate** per la
   convergenza del totale asserzioni sui documenti: **40/40 comandi, 0
   caduti** su entrambe, seconda passata con `numeri-nei-documenti.mjs`
   43/43 e i quattro documenti allineati.

**Corretto a cascata nei quattro documenti sorvegliati**:
- `docs/DEVELOPMENT.md`: 3.438→**3.441** prove, `2957`→**2960** nell'addendo
  `run-kpi`, moduli condivisi 313/313→**314/314**, `genesi-data.js`
  149/149→**150/150**, bucket "una o due" 52→**53** / "più di dieci"
  38→**37**, «60 su 147»→**61 su 147**, giro completo 3.897→**3.900**.
- `docs/STATO_PRODOTTO.md`: stessa cascata, «G41»→**G42**, «energiaSuMaglia»
  →**sequenzaSuMaglia**, `2957`→**2960**, giro completo 3.897→**3.900**.
- `docs/DECISIONI_WEEKEND.md`: «3.438, dopo `energiaSuMaglia` — G41»→
  **«3.441, dopo `sequenzaSuMaglia` — G42»**.
- `vault/ROADMAP_SETTIMANA.md`: stessa cascata (2957→2960, 3.438→3.441,
  «G41»→«G42»), **e la nota di scomposizione di G7 aggiornata**: la
  barriera «la sequenza vive nella pagina, non nel modulo dati» è ora
  dichiarata caduta, con riferimento alle quattro funzioni estratte.

## Stato roadmap

**Il gruppo diagnosticato (G39-G42) è chiuso.** La barriera che il
documento di scomposizione di G7 (l'ottimizzatore di volata) segnalava —
"la sequenza vive nella pagina, quindi un ottimizzatore vero con MIC/PPV
richiederebbe un cantiere a sé o una terza copia della logica" — è caduta:
`sequenzaSuMaglia` e `innescoSuMaglia` sono ora funzioni pure riusabili
direttamente da un ottimizzatore che iteri su B/S e voglia anche calcolare
MIC/PPV, non solo carica/frammentazione.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Con la barriera di G7 caduta, la **seconda fetta** dell'ottimizzatore di
volata (dopo la prima, `curvaBurdenCarica`/G38, già in produzione) può
ora includere MIC/PPV nel confronto: per ogni burden candidato, ricalcolare
non solo la carica (`caricaDaX50Target`, già fatto) ma anche una sequenza
di prova (`sequenzaSuMaglia`) e la sua rete di innesco
(`innescoSuMaglia`), per stimare come cambierebbe la MIC — e quindi la
PPV al recettore — al variare del burden. Questo è un cantiere di prodotto
vero e proprio (decisioni di UX: quale sequenza usare nel confronto? la
stessa di oggi, o provarne più d'una?) e va scoperto leggendo
`docs/RICERCA_CONTINUA_GENESI.md` (sezione 14/09) e la nota di
scomposizione in `vault/ROADMAP_SETTIMANA.md` prima di scrivere codice,
non assunto.

In alternativa (o in parallelo, aprendo un secondo cantiere come richiede
la direttiva sui cantieri paralleli), si può proseguire con altri
candidati di estrazione dal censimento (`genesi-estraibili.mjs`, bucket
"una o due": 53 funzioni, di cui molte già estratte in sessioni precedenti
— verificare quali restano) o con la ricerca continua già raccolta.

Nessuno stop volontario: si prosegue subito.

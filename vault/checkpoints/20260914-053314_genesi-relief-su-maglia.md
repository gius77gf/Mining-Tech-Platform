# Checkpoint — 2026-09-14T05:33:14Z

## Tipo
unit-complete (cantiere B3 — sesta volta sullo stesso falso positivo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`computeRelief2D` estratta in `genesi-data.js`** (blocco G40,
`reliefSuMaglia`), stessa esatta causa già diagnosticata per
`innescoSuMaglia`/G39 nel checkpoint precedente: `genesi-estraibili.mjs`
marcava la funzione «più di dieci variabili del modulo» per l'incrocio fra
un nome interno (`seq`, `col`, `box`, `riga`, `fronte`…) e un `const`
omonimo dichiarato altrove nel file a bassa indentazione — l'euristica del
censimento è dichiaratamente prudente per lo scopo per cui è nata (stimare
quanto lavoro c'è), non per classificare una funzione specifica. Letta a
mano: la dipendenza vera di `computeRelief2D` era una sola, `D2`.

**Trasloco parola per parola, entrata identica**: nessuna riga di logica
cambiata. Firma nuova: `reliefSuMaglia(H, S, B, dtMin)` — `dtMin` sostituisce
la chiamata interna a `scatterMs()`, che resta un wrapper di pagina di una
riga perché legge tre campi di `D2` (`ritardo`, `lastDet`, `innesco`) non
altrimenti usati da questa funzione. Il legame nella pagina resta una riga
sola: `function computeRelief2D(){ reliefSuMaglia(D2.holes, D2.S, D2.B,
scatterMs()); }`.

**Verificato, in ordine crescente di rigore**:
1. Confronto diretto contro una copia della vecchia forma inline (scritta a
   mano da `HEAD`, non a memoria) su 5 casi — inclusi i due casi limite già
   insegnati da questo repository: un solo foro, e due fori a distanza zero
   — **byte per byte identici** (confrontati con `eq`, non su un
   sottoinsieme di campi).
2. `run-kpi.mjs`: 4 nuove prove (identità con la vecchia forma su 5 casi,
   niente-fori non solleva errori, censimento della pagina). 2951 → **2954**,
   0 falliti.
3. **Difetto iniettato a mano e ripristinato verificando il file identico
   byte per byte** (`diff -q`): sostituito il criterio "vince il rapporto
   minimo" con "vince il vicino più vicino" (la stessa famiglia di difetto
   storico di `innescoSuMaglia`) — la prova cade correttamente.
4. `copertura-funzioni.mjs`: `genesi-data.js` 147/147 → **148/148**.
5. **Verifica nel browser vero** (Playwright, `?go=design`, layer "Relief"
   acceso, bottone `dlRel`): la rete disegnata è identica a prima, **zero
   errori di pagina** — screenshot in `scratchpad/screenshot-relief/`.
6. Giro completo su `git worktree` isolata, **due passate** per far
   convergere il totale delle asserzioni sui documenti (il "difetto delle
   due passate" già documentato: la prima worktree misura prima che i
   documenti siano corretti, la seconda dopo): **40/40 comandi, 0 caduti**
   su entrambe le passate, e la seconda con i quattro documenti allineati
   (`numeri-nei-documenti.mjs` 43/43).

**Corretto a cascata nei quattro documenti sorvegliati**:
- `docs/DEVELOPMENT.md`: 3.432→**3.435** prove, `2951`→**2954** nell'addendo
  `run-kpi`, moduli condivisi 311/311→**312/312**, `genesi-data.js`
  147/147→**148/148**, bucket 6-10 (20→**19**) / 1-2 (50→**51**), «58 su
  147»→**59 su 148** (con nota datata sulla ragione dello scarto), giro
  completo 3.891→**3.894**.
- `docs/STATO_PRODOTTO.md`: stessa cascata, «G39»→**G40**, `2951`→**2954**,
  giro completo 3.891→**3.894**.
- `docs/DECISIONI_WEEKEND.md`: «3.432, dopo `innescoSuMaglia` — G39»→
  **«3.435, dopo `reliefSuMaglia` — G40»**.
- `vault/ROADMAP_SETTIMANA.md`: stessa cascata (2951→2954, 3.432→3.435,
  «G39»→«G40»).

**Il "due passate" quirk si è ripresentato esattamente come documentato**:
la prima passata worktree (fatta con i documenti ancora al vecchio 3.891)
ha stampato «3894 asserzioni» e segnalato lo scarto coi documenti (⛔ I
DOCUMENTI DICHIARANO UN ALTRO NUMERO); corretto il 3.891→3.894 nei due
documenti che lo dichiarano, la seconda passata ha chiuso pulita con «e i 2
documenti che lo dichiarano dicono lo stesso numero».

## Stato roadmap

B3 avanza di un'altra fetta. Restano candidati diretti dallo stesso gruppo,
già letti a mano in una sessione precedente (dipendenza vera: solo `D2`):
`computeEnergia2D`, `computeSeq2D`.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

1. Estrarre `computeEnergia2D` (la più grande e rischiosa del gruppo:
   doppio ciclo annidato per fila/foro, coinvolge `fileDeiFori`,
   `distanzaDaSpezzata`, `consumoSpecifico` — tutte già pure in
   `genesi-data.js`). Un dettaglio già individuato leggendo il sorgente
   (righe 5470-5506 di `genesi.html`): la funzione chiama `interpFronte(mx)`,
   un wrapper di pagina che legge `D2.profilo` e delega a `interpProf`
   (già pura, `genesi-data.js` riga 1227) — nella forma estratta va
   sostituita con una chiamata diretta a `interpProf(profilo, mx)`,
   passando `D2.profilo` come parametro esplicito invece del wrapper di
   pagina. Dipendenze vere identificate: `D2.holes`, `D2.prof`, `D2.S`,
   `D2.kg`, `D2.profilo`.
2. Infine `computeSeq2D`, che chiama `computeRelief2D()`,
   `computeEnergia2D()` e `computeInnesco2D()` al suo interno — da estrarre
   per ultima, quando le tre sorelle sono già pure, mantenendo lo stesso
   ordine di chiamata nel wrapper di pagina risultante (non necessariamente
   dentro la funzione pura stessa: va deciso se `sequenzaSuMaglia` deve
   comporre le altre tre o se il wrapper di pagina continua a farlo dopo).
   A quel punto l'intera catena vive in `genesi-data.js` e la nota di
   scomposizione di G7 (`vault/ROADMAP_SETTIMANA.md`) va aggiornata per dire
   che la barriera "la sequenza vive nella pagina, non nel modulo dati" è
   caduta.

Nessuno stop volontario: si prosegue subito.

# Checkpoint — 2026-09-14T05:59:16Z

## Tipo
unit-complete (cantiere B3 — settima volta sullo stesso falso positivo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`computeEnergia2D` estratta in `genesi-data.js`** (blocco G41,
`energiaSuMaglia`), stessa esatta causa già diagnosticata per
`innescoSuMaglia`/G39 e `reliefSuMaglia`/G40: `genesi-estraibili.mjs`
marcava la funzione «più di dieci variabili del modulo» per l'incrocio fra
parole interne (`file`, `faccia`, `davanti`, `ord`…) e `const` omonimi
dichiarati altrove nel file a bassa indentazione. Letta a mano: la
dipendenza vera è `D2.holes`, `D2.prof`, `D2.S`, `D2.kg` e `D2.profilo`.

**Trasloco parola per parola, con un dettaglio in più rispetto a G39/G40**:
`computeEnergia2D` chiamava `interpFronte(mx)`, un wrapper di pagina di una
riga che legge `D2.profilo` e delega a `interpProf` (già pura,
`genesi-data.js`). Nella forma estratta è diventata la chiamata diretta
`interpProf(profilo, mx)`, con `profilo` come parametro esplicito. Il
legame nella pagina resta una riga sola: `function computeEnergia2D(){
energiaSuMaglia(D2.holes, D2.prof, D2.S, D2.kg, D2.profilo); }`.

**Verificato, in ordine crescente di rigore**:
1. Confronto diretto contro una copia della vecchia forma inline su 5 casi
   — inclusi i due casi limite: un solo foro, e due fori a `mx`/`my`
   identici. La "vecchia" riusa gli stessi aiuti già puri (`fileDeiFori`,
   `distanzaDaSpezzata`, `consumoSpecifico`, `interpProf`) perché quello da
   verificare è la trascrizione dell'ORCHESTRAZIONE, non quegli aiuti (già
   verificati altrove) — **byte per byte identici**.
2. `run-kpi.mjs`: 3 nuove prove. 2954 → **2957**, 0 falliti. Due census test
   preesistenti aggiornati (`fileDeiFori(` e `distanzaDaSpezzata(`: 2
   chiamanti nella pagina → **1**, perché energia 2D è salita nel modulo).
3. **Difetto iniettato a mano e ripristinato verificando il file identico
   byte per byte**: sostituito il volume reale per foro (`vol = b*s*Hb`) con
   un volume nominale costante (`Snom*Snom*Hb`) nel calcolo del consumo
   specifico — la stessa famiglia del difetto storico G14 documentato nel
   commento della funzione stessa (usare un volume nominale invece di
   quello reale). La prova cade correttamente (pfLoc diverso su ogni foro
   con geometria non uniforme).
4. `copertura-funzioni.mjs`: `genesi-data.js` 148/148 → **149/149**.
5. **Verifica nel browser vero** (Playwright, volata con 18 fori reali,
   layer "Energia" acceso via `dlEne`): tutti i 18 fori con `pfLoc`
   popolato, il tooltip mostra «riferimento 0,55 kg/m³ di progetto»
   coerente col valore nominale atteso (58 kg / (3×3,5×10) = 0,552),
   **zero errori di pagina** — screenshot in `scratchpad/screenshot-energia/`.
6. Giro completo su `git worktree` isolata, **due passate** per la
   convergenza del totale asserzioni sui documenti (il "due passate"
   quirk già documentato: la prima worktree misura prima che i documenti
   siano corretti al nuovo totale, la seconda dopo): **40/40 comandi, 0
   caduti** su entrambe, seconda passata con `numeri-nei-documenti.mjs`
   43/43 e i quattro documenti allineati.

**Corretto a cascata nei quattro documenti sorvegliati**:
- `docs/DEVELOPMENT.md`: 3.435→**3.438** prove, `2954`→**2957** nell'addendo
  `run-kpi`, moduli condivisi 312/312→**313/313**, `genesi-data.js`
  148/148→**149/149**, bucket "una o due" 51→**52** / "più di dieci"
  39→**38**, «59 su 147»→**60 su 147**, giro completo 3.894→**3.897**.
- `docs/STATO_PRODOTTO.md`: stessa cascata, «G40»→**G41**, «reliefSuMaglia»
  →**energiaSuMaglia**, `2954`→**2957**, giro completo 3.894→**3.897**.
- `docs/DECISIONI_WEEKEND.md`: «3.435, dopo `reliefSuMaglia` — G40»→
  **«3.438, dopo `energiaSuMaglia` — G41»**.
- `vault/ROADMAP_SETTIMANA.md`: stessa cascata (2954→2957, 3.435→3.438,
  «G40»→«G41»).

## Stato roadmap

Con questa unità **tre delle quattro funzioni del gruppo diagnosticato
nella sessione precedente sono pure in `genesi-data.js`**:
`innescoSuMaglia` (G39), `reliefSuMaglia` (G40), `energiaSuMaglia` (G41).
Resta solo `computeSeq2D`.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Estrarre `computeSeq2D` (letta a mano in una sessione precedente:
dipendenza vera solo `D2` — `D2.holes`, `D2.ritardo`, `D2.ritardoFila`,
`D2.S`, `D2.sequenza`, `D2.dir`, più `h.tMano` che è una proprietà per foro
non un campo di `D2`). Attenzione particolare: `computeSeq2D` chiama al suo
interno `computeRelief2D()`, `computeEnergia2D()` e `computeInnesco2D()`
(righe 5420-5422 di `genesi.html`) DOPO aver calcolato `tDet`/`seq` per
ogni foro — un dettaglio architetturale da decidere: se la nuova funzione
pura `sequenzaSuMaglia` deve comporre anche le altre tre (chiamando
`reliefSuMaglia`/`energiaSuMaglia`/`innescoSuMaglia` al suo interno, dato
che ora sono tutte pure e nello stesso modulo) o se il wrapper di pagina
`computeSeq2D` continua a orchestrare la sequenza di chiamate come oggi.
La prima opzione è più pulita (un solo punto che decide l'ordine) ma
cambia la forma della funzione pura rispetto al trasloco "parola per
parola" usato finora per G39/G40/G41 — va scelta con cura, non di default.
Una volta estratta, l'intera catena vive in `genesi-data.js` e la nota di
scomposizione di G7 in `vault/ROADMAP_SETTIMANA.md` va aggiornata per dire
che la barriera "la sequenza vive nella pagina, non nel modulo dati" è
caduta.

Nessuno stop volontario: si prosegue subito.

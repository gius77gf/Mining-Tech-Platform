# Checkpoint — 2026-09-14T06:53:07Z

## Tipo
unit-complete (cantiere B3 — nuova estrazione, non un falso positivo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`genMaglia2D` — solo il calcolo delle coordinate estratto in
`genesi-data.js`** (blocco G43, `generaMaglia`). A differenza delle quattro
unità precedenti (G39-G42), **questa NON è un falso positivo del
censimento**: `genMaglia2D` cade davvero nel bucket "11+" perché la sua
funzione vera è mutare `D2` (assegna `D2.holes`/`D2.sel`/`D2.selPrev`/
`D2.bf`/`D2.magliaAssente`, avvisa con un toast se rigenerando perde
ritardi messi a mano, e orchestra `computeSeq2D`) — non calcolare. Solo il
nucleo di calcolo (righe × colonne, sfalsamento a file alterne) è uscito
come funzione pura `generaMaglia(B, S, nFile, perRow, bf, stagger)`,
riusando `idForoMaglia` (già pura). Il resto (guardia su B/S assenti,
mutazione di `D2`, il toast, l'orchestrazione della sequenza) resta nel
wrapper di pagina — stessa distinzione calcolo/orchestrazione già
dichiarata per G42.

**Perché conta per G7**: la stessa griglia serve a un futuro ottimizzatore
che vuole provare un burden diverso SENZA toccare il progetto disegnato a
schermo — prerequisito diretto per includere MIC/PPV nel confronto
burden (ora possibile anche grazie a `sequenzaSuMaglia`/`innescoSuMaglia`,
estratte in questo stesso blocco di lavoro).

**Verificato, in ordine crescente di rigore**:
1. Confronto diretto contro una copia della vecchia forma inline su 6 casi
   (con e senza sfalsamento, una sola fila, zero file, un solo foro per
   fila) — **byte per byte identici**.
2. `run-kpi.mjs`: 3 nuove prove. 2960 → **2963**, 0 falliti.
3. **Difetto iniettato a mano e ripristinato verificando il file identico
   byte per byte**: `off` forzato a `0` (ignora lo sfalsamento) — la prova
   cade correttamente sui casi con `stagger=true` e più di una fila.
4. `copertura-funzioni.mjs`: `genesi-data.js` 150/150 → **151/151**.
5. **Verifica nel browser vero** (Playwright, volata 2×4 fori con
   sfalsamento, cambio di "fori per fila" da 4 a 3 tramite il vero campo
   `#dN`): la maglia iniziale combacia esattamente con le coordinate
   attese (sfalsamento di S/2 sulla seconda fila), la rigenerazione dopo
   il cambio produce 6 fori con coordinate coerenti, **zero errori di
   pagina**.
6. Giro completo su `git worktree` isolata, **due passate** per la
   convergenza del totale asserzioni sui documenti: **40/40 comandi, 0
   caduti** su entrambe, seconda passata con `numeri-nei-documenti.mjs`
   43/43 e i quattro documenti allineati.

**Corretto a cascata nei quattro documenti sorvegliati**:
- `docs/DEVELOPMENT.md`: 3.441→**3.444** prove, `2960`→**2963** nell'addendo
  `run-kpi`, moduli condivisi 314/314→**315/315**, `genesi-data.js`
  150/150→**151/151**, giro completo 3.900→**3.903**.
- `docs/STATO_PRODOTTO.md`: stessa cascata, «G42»→**G43**,
  «sequenzaSuMaglia»→**generaMaglia**, `2960`→**2963**, giro completo
  3.900→**3.903**.
- `docs/DECISIONI_WEEKEND.md`: «3.441, dopo `sequenzaSuMaglia` — G42»→
  **«3.444, dopo `generaMaglia` — G43»**.
- `vault/ROADMAP_SETTIMANA.md`: stessa cascata (2960→2963, 3.441→3.444,
  «G42»→«G43»).
- ⚠️ **Non toccata la tabella dei bucket** (`genesi-estraibili.mjs`): il
  wrapper `genMaglia2D` continua a leggere/scrivere abbastanza campi di
  `D2` da restare genuinamente nel bucket "11+" (verificato rilanciando
  lo strumento: 53/15/19/37 invariati, 61 su 147 invariato) — a differenza
  di G39-G42, questa estrazione non sposta la funzione fra i bucket.

## Stato roadmap

Nota anche nel canarino (`vault/ULTIMO_CICLO.md`, aggiornato in questo
blocco per una nuova accensione della routine ricevuta mentre l'unità era
in verifica — non un riavvio, lavoro proseguito).

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

Con `sequenzaSuMaglia`, `innescoSuMaglia` e `generaMaglia` tutte pure,
gli ingredienti per la **seconda fetta di G7** (MIC/PPV nel confronto
burden) ci sono tutti: per ogni burden candidato nello sweep di
`curvaBurdenCarica`, si potrebbe generare una griglia di prova
(`generaMaglia`), sequenziarla con le impostazioni correnti
(`sequenzaSuMaglia`), calcolare la MIC (`micFinestra`, già pura) e
stimare la PPV al recettore (`ppvDaSd`/`esitoPpv`, già pure) per ogni
candidato. Questo è un cantiere di PRODOTTO (non solo trasloco) e va
scomposto prima di scrivere codice, leggendo
`docs/RICERCA_CONTINUA_GENESI.md` (sezione 14/09) per le decisioni di UX
aperte (quale sequenza usare nel confronto? mostrare un fronte di Pareto
o un vincolo singolo?).

In alternativa, si può proseguire il censimento `genesi-estraibili.mjs`
per verificare se restano candidati genuini non ancora estratti nei
bucket "1-2" o "3-5" (la maggior parte dei rimanenti risultano già
wrapper minimi verificati in sessioni precedenti, o funzioni che toccano
DOM/canvas/audio e restano nella pagina per costruzione).

Nessuno stop volontario: si prosegue subito.

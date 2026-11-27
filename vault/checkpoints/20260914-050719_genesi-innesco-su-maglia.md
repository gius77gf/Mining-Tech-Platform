# Checkpoint — 2026-09-14T05:07:19Z

## Tipo
unit-complete (cantiere B3 — quinta volta sullo stesso falso positivo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

**`computeInnesco2D` estratta in `genesi-data.js`** (blocco G39,
`innescoSuMaglia`), dopo aver scoperto — leggendo il codice sorgente della
funzione, non fidandosi del censimento — che era marcata «più di dieci
variabili del modulo» per un falso positivo, la **quinta volta** che questa
esatta famiglia di difetto si presenta su questo file (dopo le unità 121,
122, 124 e la correzione di `genMaglia2D`/G37 di oggi stesso).

**La causa, verificata precisamente** (non solo "è un falso positivo",
ma PERCHÉ): `genesi-estraibili.mjs` colleziona come «variabili del
modulo» ogni `let/const/var` dichiarato a indentazione ≤4 spazi OVUNQUE
nel file — un'euristica dichiarata e accettata dal suo stesso commento
("sbaglia nel verso prudente"). Ma la regex che riconosce le dichiarazioni
locali DENTRO una funzione (`localiDi`) cattura solo il PRIMO nome dopo
`const`/`let`/`var`, perdendo i dichiaratori successivi in una lista
separata da virgole (`const nRow=x, centerRow=y, seq=z` — solo `nRow`
entra nell'insieme dei "locali"). Quindi `seq` (e altrove `col`, `box`,
`riga`, tutte parole che compaiono ANCHE come stringhe letterali dentro
`computeSeq2D`) restano fuori dall'insieme dei locali della funzione, e se
la STESSA parola è il primo dichiaratore di un `const` a bassa indentazione
in una funzione COMPLETAMENTE DIVERSA altrove nel file, viene contata come
"variabile del modulo letta da questa funzione" — un incrocio casuale fra
il nome di un `const` locale altrove e una parola dentro la funzione
guardata. **La dipendenza vera di `computeInnesco2D` era una sola: `D2`.**
Non ho corretto lo strumento (fuori perimetro di questa unità, e il suo
stesso commento accetta esplicitamente questo margine di errore per lo
scopo per cui è nato — stimare quanto lavoro c'è, non decidere funzione per
funzione); ho verificato a mano la funzione specifica, come già fatto
quattro volte prima su questo stesso file.

**Trasloco parola per parola, entrata identica**: nessuna riga di logica
cambiata, solo la firma (da zero argomenti che leggono `D2` a tre parametri
espliciti `H, S, B`). Il legame nella pagina resta una riga sola,
esattamente come `_spazTipico`/`isoPasso`/`reliefCls`.

**Verificato, in ordine crescente di rigore**:
1. Confronto diretto contro una copia della vecchia forma inline (scritta
   a mano da HEAD, non a memoria) su 5 casi — inclusi i due casi limite che
   la famiglia "copia debole"/"iniezione fresca" di questo repository ha
   già insegnato a cercare: un solo foro, e due fori a distanza zero — **byte
   per byte identici** (confrontati con `eq`, non con un sottoinsieme di
   campi).
2. `run-kpi.mjs`: 3 nuove prove (identità con la vecchia forma su 5 casi,
   niente-fori non solleva errori, censimento della pagina). 2948 → **2951**,
   0 falliti.
3. **Difetto iniettato a mano e ripristinato verificando il file identico
   byte per byte** (`diff -q`): sostituito il criterio "vince il ritardo più
   piccolo" con "vince il foro più vicino" (il difetto storico di questa
   stessa funzione, quello che il commento originale del 09/08 avverte di
   non ripetere) — la prova cade correttamente (1 KO).
4. `copertura-funzioni.mjs`: `genesi-data.js` 146/146 → **147/147**.
5. **Verifica nel browser vero** (Playwright, `?go=design`, layer "Innesco"
   acceso): 12 fori, ognuno collegato al precedente con 42 ms di ritardo
   (`innFrom`/`innDt` coerenti), **zero errori di pagina**, la rete si
   disegna esattamente come prima — screenshot in
   `scratchpad/screenshot-innesco/`.
6. Giro completo su `git worktree` isolata: **40/40 comandi, 0 caduti** (due
   passate per far convergere il totale delle asserzioni sui documenti).

**Corretto a cascata**: la tabella dei bucket di `genesi-estraibili`
(6-10: 21→20, 1-2: 49→50, il totale estraibile 57→58 su 147 — spiegato con
la data e la ragione, non solo cambiato), il conto dei moduli condivisi
(310/310→311/311), `genesi-data.js` (146/146→147/147), il totale delle nove
suite `node` (3.429→3.432) e il totale del giro completo (3.888→3.891) in
tutti e quattro i documenti sorvegliati.

## Stato roadmap

B3 avanza di un'altra fetta. Restano candidati diretti, con la stessa
identica firma di falso positivo da verificare a mano prima di toccarli:
`computeSeq2D`, `computeRelief2D`, `computeEnergia2D` — lette a mano in
questa stessa sessione (non solo sospettate): la loro dipendenza vera è
anch'essa solo `D2`, verificato leggendo il corpo di ciascuna. Sono più
grandi di `computeInnesco2D` (in particolare `computeEnergia2D`, con un
doppio ciclo annidato) e `computeSeq2D` chiama le altre tre, quindi
un'estrazione completa del gruppo va fatta con lo stesso rigore — una alla
volta, non tutte insieme — per non ripetere la trappola di "farla a metà"
su un gruppo di funzioni che si richiamano a vicenda.
⚠️ **Importante per chi continua**: questo sblocca (in parte) la
scomposizione di G7 scritta oggi stesso — la nota diceva "la sequenza vive
nella pagina, non nel modulo dati" come ragione per cui un ottimizzatore
vero (con vibrazione) è un cantiere grande. Con `computeSeq2D` e le sue tre
sorelle estratte, quella barriera cade. Non ancora fatto: solo `computeInnesco2D`
di quel gruppo è uscita finora.

## Blocchi e limiti noti

Nessuno nuovo.

## Prossimo passo atomico

1. Estrarre `computeRelief2D` (dipendenza vera: solo `D2`, verificato a
   mano), con lo stesso rigore di verifica di questa unità (confronto
   byte-per-byte con la vecchia forma, iniezione del difetto, screenshot
   del layer "Relief").
2. Poi `computeEnergia2D` (la più grande e rischiosa: doppio ciclo,
   coinvolge `fileDeiFori`, `interpFronte`, `distanzaDaSpezzata`,
   `consumoSpecifico` — tutte già pure — verificare che nessuna di queste
   dipenda a sua volta da `D2` oltre ai parametri già identificati).
3. Infine `computeSeq2D`, che chiama le altre tre: a quel punto l'intera
   catena vive in `genesi-data.js`, e la nota di scomposizione di G7 va
   aggiornata per dire che la barriera è caduta.

Nessuno stop volontario: si prosegue subito.

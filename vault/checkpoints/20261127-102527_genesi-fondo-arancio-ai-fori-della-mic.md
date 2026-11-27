# Checkpoint — Genesi: sulla pianta del report il fondo arancio ai fori che arrivano alla MIC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): sulla pianta del report il
fondo arancio…»). Dei precedenti: `0bc3efe8` (cariche nel tempo) e
`78c2e0e7` (il CSV dice chi forma la MIC) — vedi sotto «Verifiche» per lo
stato dei loro giri di conferma.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `_indiciNellaMic` (interna) e, in
  `piantaPerFoglio`, fondo `#ffd9b8` e voce di legenda. Conto delle
  funzioni provate invariato (227).
- `run-kpi` 3271 → 3272; `genesi-foglio-pianta.mjs` 84 → 87 controlli,
  controprova 21 → 23 difetti.
- Scatto del foglio guardato (760 px): cinque coppie colorate a cavallo
  delle due file, le stesse cinque barre arancio del diagramma.

## Trovato strada facendo
- La modifica ha aggiunto `i` in testa all'oggetto di ogni foro, e
  l'iniezione 3 del banco (il fronte modellato) non combaciava più. Sulla
  copia avevo girato solo il passaggio sano, quindi non l'ho visto;
  `iniezioni-fresche` l'ha detto prima del commit. Riancorata sul pezzo più
  corto che sia unico.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4538.
- Sull'albero vero: `genesi-foglio-pianta` 87/87 e controprova «✔» (23
  difetti su 23, ognuno sul suo controllo); foglio-in-cava 55/55,
  maglia-assente 40/40, report-misfire 7/7, numeri-tranquilli 39/39.
- `0bc3efe8` (cariche nel tempo): giro `node` sulla copia del committato 47
  comandi a posto, 4537. ⚠️ Il giro dei 56 banchi su quella copia era a 32 su
  56, tutti a uscita 0, quando questo file è stato scritto
  (`scratchpad/giro48-banchi.txt`): va letto fino in fondo.
- ⚠️ `78c2e0e7` (il CSV dice chi forma la MIC) NON ha ancora un giro di
  conferma sul committato: lo copre il prossimo, che parte dopo questo push
  (i commit si impilano: il giro sull'ultimo li contiene tutti).
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.774 prove senza rete (3272 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4538 su 47 comandi · condivisi 401 su 401 · `genesi-data.js` 227/227 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
**Sulla tela (schermo), un bottone «MIC» che cerchia i fori dei gruppi che
arrivano alla MIC** — il limite dichiarato in questa unità. Niente è ancora
scritto. Piano:
1. Modulo: esportare `foriNellaMic(holes, kg)` (gli indici, in ordine) sopra
   `_indiciNellaMic`, con la sua prova; `piantaPerFoglio` continua a usare
   la stessa.
2. Pagina: bottone `dlMic` accanto a `dlIso`/`dlRel`/`dlEne`/`dlInn`
   (classe `dl-tog`, stesso schema: stato in `D2`, `syncLayerUI`,
   `drawDesign2D`), spento alla nascita; in `drawDesign2D`, dopo i fori, un
   anello arancio attorno a quelli di `foriNellaMic(D2.holes, D2.kg)`;
   quando non c'è niente da cerchiare lo dice (la frase di
   `micDaMostrare().chi`). Guardare PRIMA come `D2.iso` viene salvato e
   riaperto, e fare uguale.
3. Misurare a 320 px che la riga dei bottoni degli strati non mandi niente
   fuori schermo (`genesi-colonna-progetto.mjs` lo controlla).
4. Banco: in `genesi-pianta-schermo.mjs` (il registro degli `arc`), gli
   anelli stanno sui fori che la tabella a schermo dà entro 8 ms; controprova.
⚠️ È un comando nuovo sullo schermo, additivo e spento alla nascita: va
detto nella roadmap come tale.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.

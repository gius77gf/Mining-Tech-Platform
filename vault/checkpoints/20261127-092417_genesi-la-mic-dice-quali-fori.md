# Checkpoint — Genesi: la MIC dice quali fori la formano, e quando

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): la MIC dice quali fori la
formano, e quando»). Il precedente, `b5a7d010` (il report con la pianta e la
tabella dei fori), è confermato dal giro `node` su una copia del committato:
47 comandi a posto, 4535 asserzioni, numeri dei documenti compresi.
⚠️ Il giro dei 56 banchi di Genesi su quella copia era ANCORA IN CORSO quando
questo file è stato scritto (`scratchpad/giro46-banchi.txt`): va letto.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `_finestreDiCarica` (interna), `micFinestra`
  che ne prende il massimo, `finestraDellaMic`, `fraseFinestraMic`,
  `FINESTRA_MIC_MS`. 222 → 225 provate.
- `apps/genesi/genesi.html`: `micDaMostrare().chi`; la frase in coda ai tre
  «perché» della riga MIC e sotto il numero sul foglio.
- `run-kpi` 3269 → 3270; `genesi-foglio-pianta.mjs` 68 → 73 controlli,
  controprova 11 → 16 difetti.
- ⛔ Il numero della MIC non è cambiato: identità con `Object.is` su 4000
  volate a caso contro la forma di prima. Nessuna formula, nessuna soglia.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4536.
- Sull'albero vero: `genesi-foglio-pianta` 73/73 e controprova «✔» (16
  difetti su 16, ognuno sul suo controllo); `genesi-recettore-assente`
  19/19 e controprova col rosso voluto (15 iniezioni su 15) (cita in un'iniezione la
  riga della scheda a cui la frase è stata accodata: l'iniezione è intatta,
  `iniezioni-fresche` 876 su 876); foglio-in-cava 55/55, numeri-tranquilli
  39/39, maglia-assente 40/40, report-misfire 7/7, campi-assenti 64/64.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.772 prove senza rete (3270 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4536 su 47 comandi · condivisi 399 su 399 · `genesi-data.js` 225/225 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
**Sul foglio, il disegno «Cariche nel tempo»**: una barra per ogni istante
in cui parte un foro, alta quanto i chili che partono negli 8 ms da lì; in
arancio le finestre che arrivano alla MIC. Già provato su una copia in
`scratchpad/tempi/` (`modulo.txt`, `patch_modulo.py`, `patch_pagina.py`,
`patch_banco.py`, `kpi-blocco.txt`: 14 asserzioni, 10 controprove tutte
viste). Mancano: il banco fatto girare sulla copia (82 controlli attesi) e
la sua controprova (20 difetti), lo scatto del foglio GUARDATO a 430 e 1280,
i numeri nei documenti, la voce di roadmap. Se lo scratchpad è sparito:
1. Modulo: `caricheNelTempo(holes, kg)` (una voce per istante distinto, in
   ordine, da `_finestreDiCarica`; `null` dove la MIC non si conta) e
   `diagrammaTempiPerFoglio(holes, kg, {larghezza})` (SVG: barre alte
   `kg / mic`, zero si disegna zero, larghe fra 1,5 e 12 px; riga
   tratteggiata e numero della MIC; tacche tonde, al più sette; «ms» 17 px
   oltre l'asse; stringa vuota se la MIC non si conta o è zero).
2. Pagina: `_rLarga` (la larghezza una volta sola, per pianta e diagramma);
   «Cariche nel tempo» dopo «Carica & sequenza». ⚠️ L'iniezione 7 del banco
   cita la riga della larghezza: va riancorata su `_rLarga`.
3. Banco: `svg.pianta` contato a parte da `svg.tempi`; un controllo in più
   in `comuni`, tre nella sezione MIC, quattro difetti in più.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.

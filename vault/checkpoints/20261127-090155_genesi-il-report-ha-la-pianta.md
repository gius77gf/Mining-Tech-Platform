# Checkpoint — Genesi: il report stampabile ha il disegno della pianta e la tabella di tutti i fori

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il report stampabile ha il
disegno della pianta…»). Il precedente, `6be2a673` (la pianta si
ingrandisce), è confermato dal giro `node` su una copia del committato (47
comandi a posto, 4533 asserzioni) e dal giro completo dei 55 banchi di
Genesi sulla stessa copia: 55 su 55 a uscita 0.

## Misurato prima di toccare
Aprendo il report: «img 0, canvas 0, svg 0». Solo testo: la maglia come due
numeri, la sequenza come una parola, nessun foro per nome.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `piantaPerFoglio(d, {larghezza})` (SVG per
  la carta) e `tabellaForiPerFoglio(holes, progetto)` (tabella HTML dai
  valori di `tabellaFori`). 220 → 222 funzioni provate.
- `apps/genesi/genesi.html`, `btn-report`: «Pianta della volata» in cima,
  «Tabella dei fori» prima della firma; larghezza del disegno = finestra −
  32 (fra 320 e 680); stile `table.tf` e riquadro `.tfs`.
- Il foglio stampa il progetto, non la vista (ingrandimento e strati
  nascosti non entrano).
- `run-kpi` 3268 → 3269 (30 asserzioni, 12 difetti rimessi uno per volta).
- Banco nuovo `genesi-foglio-pianta.mjs` (porta 8703), in `tutti.mjs` con la
  sua controprova: 68 controlli, 11 difetti ognuno sul suo controllo.

## Trovato strada facendo
- La voce di legenda per i fori fitti era lunga 91 caratteri e usciva dal
  disegno sul telefono: l'ha vista il banco prima della consegna.
- A corpo pieno la tabella chiede 474 px: a 430 la pagina scorreva di lato.
- Due regole di stampa che avevo scritto (`overflow:visible` in stampa,
  `thead` dichiarato) non cambiavano niente alla misura (180 fori: 5 pagine,
  4 intestazioni, 180 righe con e senza): tolte.
- La prova sull'ordine della tabella passava anche ordinando per posizione:
  i dati avevano l'ordine di sparo uguale a quello lungo la fila. Corretti i
  dati, non la prova.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, **4535**
  (non 4534 come avevo scritto per somma: «import esistenti» conta anche il
  file nuovo). Documenti corretti DOPO il giro: il controllo dei numeri va
  riletto nel giro sul committato.
- Sull'albero vero: `genesi-foglio-pianta` 68/68 e controprova «✔» (11/11);
  `genesi-foglio-in-cava` controprova 13 difetti su 13; i banchi che
  già leggevano il report — foglio-in-cava 55/55, report-misfire 7/7,
  numeri-tranquilli 39/39, maglia-assente 40/40, foro-per-foro 214/214,
  campi-assenti 64/64.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.771 prove senza rete (3269 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4535 su 47 comandi · condivisi 396 su 396 · `genesi-data.js` 222/222 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
**La MIC dice quali fori la formano, e quando.** Già provato su una copia in
`scratchpad/mic/` (`patch_modulo.py`, `patch_pagina.py`, `patch_banco.py`,
`kpi-blocco.txt`, `patch_doc.py`, `patch_roadmap.py`): identità del numero
su 4000 volate a caso, 19 asserzioni con 11 controprove, banco 73/73. Manca
la controprova del banco (16 difetti) e l'applicazione all'albero vero. Se
lo scratchpad è sparito:
1. Modulo: `_finestreDiCarica(H, kg)` (interna: per ogni istante, fori e
   chili della finestra di 8 ms, con l'aritmetica di `micFinestra` parola
   per parola), `micFinestra` che ne prende il massimo, `finestraDellaMic`
   → `{kg, da, a, fori (numeri seq+1), altre, daSoli, senzaTempo}`,
   `fraseFinestraMic`, `FINESTRA_MIC_MS = 8`.
2. Pagina: `micDaMostrare().chi`; la frase in coda ai tre «perché» della
   riga MIC (⚠️ DOPO l'apice di chiusura: `genesi-recettore-assente.mjs`
   cita quella stringa intera in un'iniezione) e sotto il numero sul foglio.
3. Banco: sezione «la MIC» in `genesi-foglio-pianta.mjs` (5 controlli, 5
   difetti in più).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.

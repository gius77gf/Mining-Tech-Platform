# Checkpoint — Genesi: la pianta si ingrandisce e si sposta (pizzico, due dita, tre bottoni)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): la pianta si ingrandisce e
si sposta…»). Il precedente, `b6c74973` (i tocchi sulla pianta), è confermato
dal giro `node` (47 comandi, 4532 asserzioni) e dal giro completo dei 55
banchi di Genesi su una copia del committato: 55 su 55 a uscita 0.

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `VISTA_ZOOM_MAX` (6) e quattro funzioni pure —
  `vistaLimitata`, `vistaApplica`, `vistaZoomAttorno`, `gestoDueDita`.
- `apps/genesi/genesi.html`: la vista (`d2Vista`, non salvata col progetto,
  torna «adatta» aprendo una volata); `drawDesign2D` passa da `vistaApplica`
  e ritaglia il contenuto, con le scritte di cornice fuori dal ritaglio;
  pizzico (ingrandisce attorno al punto fra le dita) e due dita (spostano);
  un dito sul vuoto sposta la vista quando è ingrandita; Ctrl+rotella; tre
  bottoni sotto la tela («−», percentuale, «+», «Adatta»).
- ⚠️ Trovato prima di consegnare: un foro finito sotto la cornice, cioè
  ritagliato e invisibile, si faceva ancora prendere. Adesso un tocco sulla
  cornice a pianta ingrandita sposta soltanto la vista (`d2FuoriVista`).
- `run-kpi` 3267 → 3268; `genesi-pianta-schermo.mjs` 129 → 143 controlli
  (sezione «la vista»), controprova dei dettagli 7 → 10 difetti, ognuno da
  solo fa cadere il suo controllo.
- `docs/RICERCA_CONTINUA_GENESI.md`: la ricerca sui gesti di zoom (metà sul
  mondo, fonti marcate) annotata come usata.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4533.
- Sull'albero vero: `genesi-pianta-schermo` 143/143, controprova «✔» (1/1) e
  controprova dei dettagli «✔» (10/10); i 16 banchi che toccano la pianta o
  la colonna del progetto tutti a uscita 0 (foro-per-foro 214/214,
  colonna-progetto 71/71, maglia-assente 40/40, campi-assenti 64/64, …);
  controprova di colonna-progetto col rosso voluto (22/22 iniezioni).
- ⚠️ NON rigirati su questo stato: gli altri 38 banchi di Genesi. Il giro
  completo sul committato parte dopo il push.

## Numeri dichiarati nei documenti
3.770 prove senza rete (3268 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4533 su 47 comandi · condivisi 394 su 394 · `genesi-data.js` 220/220 · pagina
162 funzioni (57 estraibili; tabella 25/48/20/22/47) · 469 esecuzioni nel
browser da 215 file.

## Prossimo passo atomico
**Il report ha la pianta e la tabella di tutti i fori.** Misurato: il foglio
era solo testo («img 0, canvas 0, svg 0»). Tutto è già provato in scratchpad
su una copia (`scratchpad/report/`: `modulo.txt`, `patch_modulo.py`,
`patch_pagina.py`, `genesi-foglio-pianta.mjs`; banco 68/68, controprova 11
difetti su 11 ognuno sul suo controllo). Se lo scratchpad è sparito:
1. Modulo: `piantaPerFoglio(d, {larghezza})` → SVG per la carta (fronte col
   profilo, piede, tratti, un cerchio per foro col numero d'ordine di sparo,
   ritardo sotto il foro se il passo è ≥ 26 px, bordo spesso ai fori con
   valori suoi, segmento di scala tondo, freccia «sequenza di sparo»,
   legenda a capo con `righeDiVoci`; numeri solo se il raggio è ≥ 6,2 px;
   stringa vuota senza fori) e `tabellaForiPerFoglio(holes, progetto)` →
   tabella HTML da `tabellaFori` (valori propri in grassetto, «0 (scarico)»,
   «non noto», «non assegnato», dentro un riquadro `.tfs`).
2. Pagina, `btn-report`: pianta in cima («Pianta della volata»), tabella
   dopo la stima economica; larghezza del disegno = finestra − 32, fra 320 e
   680; stile `table.tf`, `.tfs{overflow-x:auto}`, stretta sotto i 560 px.
3. Prove in `run-kpi`, banco nuovo `genesi-foglio-pianta.mjs` (porta 8703)
   registrato in `tutti.mjs` con la sua controprova; numeri nei 4 documenti.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.

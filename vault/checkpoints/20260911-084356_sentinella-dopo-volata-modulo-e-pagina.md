# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
97e558f9

## Completato
Unità 82 — Sentinella, il dopo-volata nel modulo: `dopoVolata`,
`statoDopoVolata` (non-applicabile / non-registrato / regolare / anomalie),
`campiDopoVolata`, `riepilogoDopoVolata`, sezione «Dopo la volata» in
`fogliaVolata`, sei colonne in coda al CSV del registro (andata e ritorno
con la prova sul testo), dimostrazione (b1/b5 regolari, b2 con una mancata
esplosione gestita, b4 non registrata). run-kpi 2877, copertura 183/183.
E la pagina: modale dal bottone ✓ della riga (errore in cima), badge del
verdetto, riga sua per il dopo-volata, conto sopra il registro, invito nella
conferma. Scatti guardati a 430 px.

## Imparato
- Il verdetto va scritto PRIMA della pagina, e le assenze passano da `manca`:
  così la scheda per l'ente le elenca invece di leggerle come «nessuna
  anomalia» — il principio del fondatore applicato allo sparo.
- Sei colonne in coda a un CSV toccano quattro prove che fissavano la coda
  o il conto delle sezioni: rese più giuste (l'intestazione derivata in
  `shared/` compresa), non più permissive.
- Due cose viste SOLO nello scatto: il rientro in coda ai numeri finiva
  nella riga tagliata (testo morto), e l'avviso d'errore in fondo a una
  modale di sei campi stava sotto la piega (854 px su 605). Un `page.click`
  su «Registra» prende il bottone della pagina, non quello della modale: si
  mira a `#modal-foot .mbtn.primary`.

## Prossimo passo atomico
Unità 83, il ponte verso Scudo: in `sentinella-data.js`
`bozzaAzioneMancataEsplosione(v, opts)` sullo stampo di `bozzaAzioneReclamo`
(origineTipo nuovo, es. `ORIGINE_DOPO_VOLATA = "dopo-volata"`, origineNota
con le anomalie di `statoDopoVolata`), in `scudo-data.js` `ORIGINI_AMBIENTE`
allargato e `etichettaAmbiente` che sa dirlo; nella pagina di Sentinella,
dopo una registrazione con anomalie, la scelta «apri un'azione in Scudo»
come per i reclami (`bozzaAzioneReclamo` alle righe ~2711/2751); prove in
run-kpi (identità dell'origine fra le due app, come `scudo.ORIGINI_CAMPO`),
scatto. Poi il banco `sentinella-foglio-volata.mjs` va riletto (b2 ha il
dopo-volata registrato: le «due voci» restano due). Nel frattempo leggere il
giro del browser su `506d2b66` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.

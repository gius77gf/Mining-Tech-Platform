# Checkpoint — Genesi: il piano fori DXF disegna anche il piede dei fori inclinati

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il piano fori DXF disegna
anche il piede…»). Il precedente, `82c283ca` (la gittata sul foro tipo,
dichiarata), è confermato dal giro `node` completo: 43 comandi a posto,
4419 asserzioni.

## Che cosa è stato fatto
- `dxfPianoFori(fori, diamMm, profilo, progetto)`: quarto argomento
  facoltativo. Per ogni foro con `scostamentoPiedeForo > 0`, una linea
  boccaforo→piede sul livello `PIEDI`, verso la faccia (y più piccola).
  Senza progetto, a fori verticali o senza lunghezza/inclinazione note non
  esce niente di nuovo: il file è byte per byte quello di prima.
- Pagina: `btn-piano-dxf` passa `D2`; il messaggio dice quanti piedi sono
  usciti; il suggerimento del bottone li nomina.
- Prove: `run-kpi.mjs` 3256 → 3257 (controprova 5 su 5: valori del progetto
  per tutti, verso sbagliato, piede ai fori verticali, livello sbagliato,
  piede senza inclinazione nota); banco `genesi-foro-per-foro.mjs`
  186 → 190, 63 iniezioni tutte sul bersaglio; rigirati
  `genesi-dxf-import` e `genesi-documenti-che-escono`.
- Numeri: 3.757 prove senza rete; giro `node` 4420 (per somma: 4419 + 1).

## Stato roadmap
Aperte per Genesi: `il confronto A/B (CSV e schermo) non dice i fori con
valori loro` (la prossima), `il piede che esce dalla faccia` (in attesa
della decisione 35). In attesa del fondatore: decisione 33 (⚠️ con la
gittata in cima), 28, 34, 35.

## Prossimo passo atomico — il confronto A/B dice i fori con valori loro
1. SOLA LETTURA: `cmpSave(slot)` in `apps/genesi/genesi.html` (cerca
   `function cmpSave`): che cosa mette in `kpi` e in `design` dello scatto;
   e i due posti che lo mostrano (`cmpExport` → CSV, e il pannello a
   schermo: cerca `['Gittata flyrock', _cmpFly(A.kpi)`).
2. Nello scatto: `kpi.foriPropri = contaValoriPropri(D2.holes).fori` e
   `kpi.flyTipo = foriFuoriDalForoTipo(D2.holes, CAMPI_DELLA_GITTATA).fori`
   (numeri, non frasi: lo scatto è un dato).
3. CSV e schermo: riga «Fori con valori propri» (A e B); accanto alla
   gittata, se `flyTipo > 0`, «foro tipo». ⛔ Uno scatto salvato PRIMA non
   ha i due campi: cella VUOTA / «non noto», mai zero (l'assenza di un dato
   non è un dato favorevole) — provarlo con uno scatto finto in
   `localStorage` (`genesiCmpA`), come fa già `genesi-foglio-in-cava.mjs`.
4. Prove: banco (il CSV dal bottone vero e il pannello), `iniezioni-fresche`
   dal codice d'uscita; se serve una funzione pura nel modulo, `run-kpi`.

## Blocchi
Nessuno tecnico.

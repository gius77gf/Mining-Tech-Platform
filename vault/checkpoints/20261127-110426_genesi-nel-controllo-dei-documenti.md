# Checkpoint — Genesi entra nel controllo automatico dei documenti

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («test(genesi): Genesi entra nel controllo
automatico dei documenti»). Dei precedenti: `fedf355f` (fondo arancio;
contiene `78c2e0e7`) è confermato dal giro `node` (47 comandi, 4538) e dal
giro completo dei 56 banchi di Genesi su una copia del committato, 56 su 56
a uscita 0 — compreso `genesi-selezione-multipla` (14/14), che nel giro
prima non era stato misurato per una mia porta occupata.
⚠️ `baa549f9` (il bottone «MIC» sulla tela) NON ha ancora il giro di
conferma sul committato: parte dopo questo push, su questo commit.

## Che cosa è stato fatto
- `apps/deepwork-id/tests/documenti-dimostrazione.mjs`: blocco GENESI — i
  pezzi puri del foglio (pianta a 680 e 358 px, tabella dei fori, cariche nel
  tempo, frase della MIC, storico della riconciliazione) in cinque vesti;
  plurali cercati più «fori», «gruppi», «istanti»; controprova dello scanner
  da 6 a 7. **169 documenti, 27 di Genesi.**
- Nessun file di prodotto toccato. Numeri dichiarati invariati.

## Trovato strada facendo
- La controprova sul prodotto (tre plurali rimessi sbagliati nel modulo) ne
  vedeva due su tre: «Altri 1 gruppi» passava, perché in nessuna veste gli
  altri gruppi erano esattamente uno. Aggiunto il caso.
- La prima fixture di `csvRiconciliazione` aveva i campi indovinati:
  sollevava. La forma vera è `{ ts, nome, prev:{…}, real:{…} }`.

## Verifiche (lette dai registri)
- `documenti-dimostrazione`: 5 passati, 0 falliti, 169 su 169; controprova
  «✔» (2 prove cadute, 7 sporchi, 7 singolari).
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4539.

## Numeri dichiarati nei documenti
Invariati: 3.775 prove senza rete · giro 4539 su 47 comandi · condivisi 402
su 402 · `genesi-data.js` 228/228 · pagina 162 funzioni · 471 esecuzioni nel
browser da 216 file.

## Prossimo passo atomico
**Il CSV della legge di sito lo compone il modulo (fetta di B3).** Già
provato su una copia in `scratchpad/sito/` (`patch.py`, `patch_test.py` con
`kpi-blocco.txt`, `patch_doc.py`): identità carattere per carattere con la
riga della pagina su tre casi, `run-kpi` 3274 sulla copia, quattro difetti
rimessi uno per volta tutti visti, `documenti-dimostrazione` a 170. Manca
l'applicazione all'albero vero e la verifica: giro `node`, poi
`genesi-numeri-tranquilli` (preme «sitoExport» e legge il file) e
`genesi-documenti-che-escono`, con le loro controprove. Se lo scratchpad è
sparito:
1. Modulo: `csvLeggeDiSito(punti)` prima di `sitoFit` — filtro
   `p&&p.d>0&&p.w>0&&p.ppv>0`, stringa vuota se non resta niente,
   intestazione `data;riferimento;distanza_m;carica_per_ritardo_kg;ppv_mms;distanza_scalata;origine`,
   celle `[ts, nome, d, w, ppv, (d/√w).toFixed(2), fonte].map(csvCell)`; i
   due commenti storici della pagina salgono con lei.
2. Pagina (`sitoExport`): `const csv=csvLeggeDiSito(sitoStore().punti);
   if(!csv){ toast('Nessun referto da esportare'); return; }`; import.
3. `run-kpi`: prova nuova; la prova «i tre file chiamano DAVVERO csvCell»
   riancorata sul modulo (`p.fonte||''].map(csvCell).join(';')`).
4. Numeri: run-kpi 3274, 3.776, giro 4540, modulo 229, condivisi 403.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.

# Checkpoint — 2026-11-26T16:55:25Z

## Tipo
unit-complete — ciclo automatico del 26/11. **F2 chiusa per i conti.**

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
07ea640b (docs(genesi): decisione 33 — con cariche diverse per foro, quale carica usano frammentazione e simulazione 3D)
Giro `node` sullo stato di 8c3803fc + decisione 33: 43 comandi su 43,
**4335** asserzioni.

## Cosa è stato completato
- `scartoProfonditaProprie(holes, prof)` e quarto argomento facoltativo di
  `metriPerforati(nf, prof, sub, scarto)` (assente/0/illeggibile → conto di
  prima alla cifra: 180 combinazioni con `Object.is`). Quattro chiamanti:
  scheda dei numeri (solo se i fori in pianta sono quanti la griglia, stessa
  regola delle cariche), CSV della scheda volata, report, scheda dei costi.
- Riagganciata di nuovo l'iniezione di `genesi-csv-fori-disegnati.mjs`
  (stessa riga, presa da `iniezioni-fresche` prima del commit); banco 4/0 e
  controprova che cade.
- Banco `genesi-foro-per-foro.mjs` 39 → 42; controprova 19 KO, 8 iniezioni
  su 8. `run-kpi` 3240 → 3241.
- Decisione 33 scritta e committata (07ea640b).

## Stato del cantiere foro per foro
F1 ✅ · F2 ✅ (MIC, carica totale in sei punti, campo «Esplosivo totale» nei
due versi, volume e consumo specifico per foro, metri perforati) · maglia
che non si rigenera più a ogni parametro ✅. Aperta la decisione 33 (le tre
PREVISIONI che prendono una carica sola).

## Numeri propagati
3.738 → **3.739**; `genesi-data.js` 187 → **188**, condivisi 360 → **361**;
giro `node` scritto **4336** per somma.

## Prossimi passi
- **Prossimo passo atomico — F3, il comando per l'utente.** PRIMA leggere
  com'è fatta la selezione multipla (G49: `D2.selMulti`, i bottoni
  `dtRifletti`/«senza id» che compaiono con la selezione, `syncTrattoUI` o
  l'equivalente per i fori) e il pannello del singolo foro selezionato.
  Forma prevista: con uno o più fori selezionati compaiono tre campi
  (carica kg, profondità m, borraggio m) + «Applica ai selezionati» +
  «Torna ai valori del progetto»; input letto con `numIt`/`guardiaDecimale`
  come gli altri campi decimali (regola di stile: niente type=number);
  d2PushUndo prima di scrivere; dopo: computeSeq2D + ridisegno. Sulla pianta
  un foro con valori suoi deve DISTINGUERSI (un segno, non solo il colore).
  Avviso della strada 1 della decisione 33 accanto alle previsioni quando
  `fori con valori propri > 0`. Struttura e stile IDENTICI al core
  (CLAUDE.md), screenshot guardati a 430 e 320 px.
- Poi F4 (tabella dei fori), F5 (XML, DXF, 3D per foro), F6.

## Blocchi
Nessuno. Decisione 33 in attesa del fondatore (non blocca F3: esce con
l'avviso della strada 1).

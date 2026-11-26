# Checkpoint — 2026-11-26T18:29:51Z — F5a, il piano d'innesco XML foro per foro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è b9703f2f, F4; giro node su
b9703f2f confermato: 43/43, 4340)

## Completato — Genesi, foro per foro, F5a
- **Misurato prima** (in node, la funzione è pura): un foro con 0 kg, 8,5 m e
  1,5 m di borraggio usciva nel piano d'innesco XML con 58 kg, 10 m e 2,2 m —
  `xmlPianoInnesco` scriveva `p.prof / p.kg / p.stem` dentro ogni `<Hole>`.
- **Scrittore** (`apps/genesi/genesi-data.js`): ogni `<Hole>` usa
  `valoreDiForo(h, campo, p)`; con almeno un foro diverso il file dichiara in
  `PlanData` `DesignDepth`, `DesignCharge`, `DesignStemming` e
  `HolesWithOwnValues`. Senza valori per foro: identico byte per byte
  (provato su copia del modulo prima di toccare il prodotto).
- **Lettore** (`genesi.html`, gestore di `fileXmlIn`): con i `Design` il
  progetto viene da lì e NON dal primo foro; i valori per foro si riportano
  sulla maglia rigenerata per posizione con la nuova
  `valoriPerForoDaPiano(foriFile, holes, progetto)` → `{fori, riportati,
  nonRiportati, scartati}`; il messaggio dice quanti fori hanno valori loro e
  quanti valori non sono stati riportati. `_dentroLimitiForo` è la domanda sui
  limiti, una sola per il comando da tastiera e per il file riletto.
- **Prove**: run-kpi 3245 → 3247 (due difetti rimessi nel modulo → due prove
  cadute; ripristino da copia, `diff -q` identico). Banco
  `browser/genesi-foro-per-foro.mjs` 97 → 110, col bottone vero e
  `setInputFiles` sul lettore vero; controprova 26 iniezioni su 26.
- **La controprova ha corretto due volte la PROVA, non il prodotto**:
  1. il lettore veniva provato col file appena scritto dallo scrittore: col
     difetto dello scrittore rimesso, il difetto del lettore spariva. Ora il
     file per il lettore è costruito a mano dal piano liscio;
  2. il foro diverso valeva 0 kg, e il lettore difettoso leggeva «5» (il
     minimo del campo) — che nella passata di controprova è proprio la carica
     del progetto. Ora vale 123 kg.
- DXF dei fori (`dxfPianoFori`): porta posizione e diametro, niente da fare.

## Numeri scritti nei documenti
3.745 prove senza rete (run-kpi 3247); giro node 4342 su 43 comandi (per
somma: +2; da confermare); condivisi 369/369, `genesi-data.js` 196/196;
funzioni nella pagina 148 (invariate).

## Stato roadmap
F1 ✅ · F2 ✅ · F3 ✅ · F4 ✅ · F5a ✅ · F5b e F6 aperte. Decisione 33 in attesa.

## Prossimo passo atomico — F5b, il `.volata.json`
In `genesi.html`, nella funzione che esporta la volata dal 3D (cercare
`a.download = 'Volata_'`): ogni foro esce con `kg:P.kg`. I fori di `SIM.fori`
portano `id` del progetto 2D quando la scena viene da lì. Passo:
1. MISURARE nel browser: dare a un foro del 2D 35 kg e 8,5 m, premere
   «simula» (il passaggio 2D → 3D: cercare `function simulaVolata2D`), poi il
   bottone che esporta il `.volata.json`, e leggere `fori[].kg` e
   `fori[].prof` del foro con quell'id;
2. correggere agganciando per id: `kg: valoreDiForo(D2holePerId[f.id], 'kg',
   {kg:P.kg})`, e per `prof` il valore proprio del foro quando c'è (oggi
   `f.prof` viene dalle altezze misurate dal piede: se c'è una profondità
   propria, vince quella? — decidere guardando che cosa significa `f.prof` in
   `buildSim`, e scriverlo);
3. neutralità: senza valori per foro il JSON esce identico;
4. sezione 11 nel banco, con controprova.
NON toccare che cosa usa la simulazione 3D (decisione 33).

## Blocchi
Nessuno. In attesa del fondatore: decisione 33; canarino su main (serve una PR).

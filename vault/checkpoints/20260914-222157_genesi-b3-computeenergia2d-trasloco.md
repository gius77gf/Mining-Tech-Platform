# Checkpoint — 2026-09-14T22:21:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9888ebfc

## Cosa è stato completato

Quarta fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`) e `reliefCls` (`154a5334`): estratta `computeEnergia2D(D2)`
da `apps/genesi/genesi.html` a `apps/genesi/genesi-data.js`.

`computeEnergia2D` componeva solo `energiaSuMaglia`, già pura nel
modulo dal blocco G41 (14/09): nessun calcolo nuovo, solo il primo
parametro `D2` esplicito. Unico punto di chiamata (dentro
`computeSeq2D`) aggiornato a `computeEnergia2D(D2)`.

**Differenza dalle tre estrazioni precedenti**: la funzione era
`void` (mutava `D2.holes` in place tramite `energiaSuMaglia`) con UN
SOLO punto di chiamata, quindi non c'era ragione di lasciare un
wrapper di una riga come per `reliefCls`/`pfNominale`/`pieDev` — esce
DEL TUTTO dalla pagina. Effetto: il totale delle funzioni nella
pagina scende di uno (152→151) invece di restare fermo.

Verifica standard rispettata:
- Cercato "computeEnergia2D" in `run-kpi.mjs` PRIMA di spostarla:
  trovate DUE prove da correggere — quella che pinnava il testo
  sorgente esatto del legame G41, e un'assertion nel test del G42
  (`sequenzaSuMaglia`) che cercava `computeEnergia2D();` a zero
  argomenti dentro l'orchestrazione di `computeSeq2D`. Entrambe
  corrette per leggere la nuova forma, non cancellate.
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (scambio `S`/`prof` nella composizione — grandezze fisiche diverse,
  quindi non commutativo, a differenza dello scambio B/S che era
  stato invisibile su `pieDev`): iniettato in una copia di
  `genesi-data.js`, il test è caduto come atteso, ripristinato
  subito dopo.
- Fondo di copertura di `genesi-data.js` alzato 156→157.
- Nessuno spostamento di bucket reale: misurato confrontando
  `genesi-estraibili.mjs --elenco` prima/dopo in una worktree su
  HEAD. L'unico effetto è che `computeSeq2D` perde
  `computeEnergia2D` dal proprio elenco "chiama" (non è più una
  funzione della pagina, è un import).
- Cascata documenti: 3.456 prove (nove suite: run-kpi 2975 + 328 +
  75 + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.921 asserzioni,
  `genesi-data.js` 157/157, condivisi 321/321, Genesi 151 funzioni
  nella pagina / 64 estraibili.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-energia2d`): 40 comandi a
  posto, 0 caduti, 3.921 asserzioni — combaciava già al primo giro,
  nessuna seconda passata necessaria (seconda volta di fila, dopo
  `reliefCls`, che il numero previsto è risultato esatto).

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
56). Con quattro unità completate nello stesso schema, il cantiere sta
rallentando: i candidati più semplici (un solo punto di chiamata,
nessuna dipendenza da un'altra funzione non ancora estratta) si stanno
esaurendo. Candidati da valutare, in ordine di rischio crescente:
- `computeRelief2D` (riga 5515 in genesi.html): un solo punto di
  chiamata, ma dipende da `scatterMs()` — un altro "legame" non ancora
  estratto (2 punti di chiamata: qui e in un punto isolato). Da
  valutare se estrarre insieme o in sequenza.
- `isoPasso`: 2 punti di chiamata, nessuna dipendenza da altri legami.
- `_snapXY`: 6 punti di chiamata dentro gli event handler del mouse
  2D, righe dense (alcune con `_snapXY(...)` ripetuto più volte per
  riga) — nessuna prova pinnata trovata finora (verificare comunque
  col grep), ma il cambio di firma su 6 punti in righe dense è più
  rischioso di un singolo call site.
- `d2HitTest`/`d2HitTestPt`: dipendono entrambe da `activeProf`, altra
  funzione del bucket "1-2" con prova pinnata — da estrarre insieme o
  prima `activeProf` da sola.
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`) — costo più
  alto, da fare come unità a sé quando gli altri candidati più semplici
  sono esauriti.

Se il prossimo candidato richiede più cautela di quanto renda
conveniente una singola unità, passare al fallback generico della
roadmap: il prossimo ponte della mappa ecosistema, o una passata in
profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.

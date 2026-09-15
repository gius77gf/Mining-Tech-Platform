# Checkpoint — 2026-09-14T22:33:02Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a3b76fce

## Cosa è stato completato

Quinta fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`), `reliefCls` (`154a5334`) e `computeEnergia2D`
(`9888ebfc`): estratta `isoPasso(D2)` da `apps/genesi/genesi.html` a
`apps/genesi/genesi-data.js`.

`isoPasso` componeva solo `passoIsocrone`, già pura nel modulo dal
blocco G24 (10/09). Come `computeEnergia2D`, esce DEL TUTTO dalla
pagina invece di lasciare un wrapper: aveva due punti di chiamata (il
disegno delle isocrone e il testo del toast attivazione/disattivazione)
ma nessuna ragione di restare un legame — entrambi i chiamanti hanno
già `D2` in chiaro nel proprio scope. Aggiornati entrambi a
`isoPasso(D2)`.

Verifica standard rispettata:
- Cercato "isoPasso" in `run-kpi.mjs` PRIMA di spostarla: trovata una
  prova che pinnava il testo sorgente esatto del vecchio legame dentro
  un test più ampio (G24, che pinna insieme `crestZ` e `_spazTipico` —
  quelli restano intatti, non toccati da questa unità). Corretta per
  leggere la nuova forma, non cancellata.
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (scambio `isoStep`/`lastDet` nella composizione — non commutativo):
  iniettato in una copia di `genesi-data.js`, il test è caduto come
  atteso, ripristinato subito dopo.
- Fondo di copertura di `genesi-data.js` alzato 157→158.
- Nessuno spostamento di bucket per altre funzioni: misurato
  confrontando `genesi-estraibili.mjs --elenco` prima/dopo in una
  worktree su HEAD.
- Cascata documenti: 3.457 prove (nove suite: run-kpi 2976 + 328 + 75
  + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.922 asserzioni,
  `genesi-data.js` 158/158, condivisi 322/322, Genesi 150 funzioni
  nella pagina / 63 estraibili.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-isopasso`): 40 comandi a
  posto, 0 caduti, 3.922 asserzioni — combaciava già al primo giro,
  terza volta di fila che il numero previsto (+1 rispetto all'unità
  precedente) risulta esatto.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
55). Cinque unità completate nello stesso schema (`pfNominale`,
`pieDev`, `reliefCls`, `computeEnergia2D`, `isoPasso`): i candidati a
un solo punto di chiamata senza dipendenze da altri legami non ancora
estratti si stanno esaurendo. Prossimi da valutare, con grep PRIMA di
toccarli:
- `computeRelief2D`: un solo punto di chiamata, ma dipende da
  `scatterMs()` — un altro "legame" non ancora estratto. Verificare se
  conviene estrarre `scatterMs` insieme o prima.
- `_snapXY`: 6 punti di chiamata dentro gli event handler del mouse
  2D, righe dense — nessuna prova pinnata trovata finora nei controlli
  precedenti, ma il cambio di firma su 6 punti in righe dense è più
  rischioso di un singolo call site: da fare con attenzione.
- `d2HitTest`/`d2HitTestPt`: dipendono entrambe da `activeProf`, altra
  funzione del bucket "1-2" con prova pinnata.
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`).

Se il prossimo candidato richiede più cautela di quanto renda
conveniente una singola unità (dipendenze incrociate, cascata di prove
pinnate su più funzioni), passare al fallback generico della roadmap:
il prossimo ponte della mappa ecosistema, o una passata in profondità
su un'altra app.

Nessuno stop volontario: si prosegue subito.

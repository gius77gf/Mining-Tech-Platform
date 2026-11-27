# Checkpoint — 2026-09-14T22:08:58Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
154a5334

## Cosa è stato completato

Terza fetta del cantiere B3 ("Genesi continua a uscire dalla pagina"),
dopo `pfNominale` (`c45452b5`) e `pieDev` (`be1d62be`): estratta
`reliefCls(D2, r)` da `apps/genesi/genesi.html` a
`apps/genesi/genesi-data.js`, stesso schema — cambio di firma, `D2`
come primo parametro esplicito invece di letto dalla chiusura della
pagina.

`reliefCls` componeva solo `classeRelief`, già pura nel modulo dal
blocco G26 (10/09): nessun calcolo nuovo. Due punti di chiamata nella
pagina aggiornati (`drawDesign2D`, `renderInspector`).

**Nota di metodo, la prima volta che capita in questo cantiere**:
`reliefCls` portava un commento esplicito — «qui resta il legame con
la finestra scelta a schermo» (G26, 10/09) — che sembrava una
decisione già presa di NON toccarla oltre. Verificato leggendo il
commit di `pfNominale` che questo stesso cantiere aveva già
riconosciuto e continuato consapevolmente lo stesso schema per «ogni
legame di una riga di questa fascia»: il commento descriveva
l'architettura del momento (il conto vero già fuori dalla pagina), non
un divieto a finire l'estrazione del wrapper stesso più avanti.
Procedendo su questa lettura, ma **lasciando per ora intatti** gli
altri "legami" con PIÙ di un punto di chiamata o con chiamanti che
hanno già una prova pinnata sul proprio testo esatto (`isoPasso`,
`innTaglioOk`, `selRoccia`, `selEsplosivo`, `selInnesco`,
`computeEnergia2D`, `measureGeom2D`) — costerebbero più di un'unità
per la cascata di prove pinnate su altre funzioni che li chiamano
(`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`...).

Verifica standard rispettata:
- Cercato "reliefCls" in `run-kpi.mjs` PRIMA di spostarla: trovata una
  prova che pinnava il testo sorgente esatto della vecchia definizione
  (G26) — corretta per leggere la nuova forma, non cancellata.
- Nuova prova dedicata (`⛔ Genesi · reliefCls (B3, trasloco con cambio
  di firma)`), verificata contro un difetto iniettato reale (scambio
  `relLo`/`relHi` nella composizione — non commutativo, a differenza
  dello scambio B/S che era stato invisibile su `pieDev`): iniettato
  in una copia di `genesi-data.js`, il test è caduto come atteso,
  ripristinato subito dopo.
- Fondo di copertura di `genesi-data.js` alzato 155→156
  (`copertura-funzioni.mjs`).
- Nessuno spostamento di bucket per i due chiamanti: misurato
  confrontando `genesi-estraibili.mjs --elenco` prima/dopo in una
  worktree su HEAD (`git stash`/`pop` sui 4 file toccati). Solo
  `reliefCls` stessa esce dal censimento (153→152 funzioni nella
  pagina, bucket "1-2" 58→57, estraibili 66→65).
- Cascata documenti: `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md` allineati
  a 3.455 prove (nove suite: run-kpi 2974 + 328 + 75 + 32 + 9 + 8 + 7
  + 3 + 19), giro completo 3.920 asserzioni.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (un mismatch preso
  e corretto sulla tabella del cantiere Genesi in DEVELOPMENT.md prima
  del giro isolato).
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-reliefcls`): 40 comandi a
  posto, 0 caduti, 3.920 asserzioni — **combaciava già al primo giro**,
  nessuna seconda passata necessaria (prima volta in questo cantiere
  che non serve la correzione a due passate).

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti" e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`).

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
57). Candidati semplici non ancora tentati, senza il commento "resta
come legame" e con un solo punto di chiamata (verificare comunque
`grep` in `run-kpi.mjs` PRIMA di toccarli):
- `_snapXY(v)` (riga 6124 in genesi.html): 6 punti di chiamata dentro
  gli event handler del mouse 2D — più punti di `reliefCls`, valutare
  con attenzione la densità delle righe (`_snapXY(...)` compare più
  volte per riga in alcuni punti).
- `d2HitTest`/`d2HitTestPt`: dipendono da `activeProf`, altra funzione
  del bucket "1-2" con prova pinnata — considerare se estrarle in
  un'unica unità o in sequenza (prima `activeProf`, poi le due che la
  chiamano).
- `computeEnergia2D`/`computeRelief2D`/`isoPasso`: hanno il commento
  "resta come legame" ma UN SOLO punto di chiamata ciascuno (verificare
  col grep prima) — se confermato, stesso rischio/costo di `reliefCls`.

Se i candidati restanti richiedono più cautela (dipendenze incrociate,
cascata di prove pinnate su più funzioni), passare al fallback generico
della roadmap: il prossimo ponte della mappa ecosistema, o una passata
in profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.

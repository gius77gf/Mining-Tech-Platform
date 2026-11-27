# Checkpoint — 2026-09-14T23:26:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d482c544

## Cosa è stato completato

Ottava fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`), `reliefCls` (`154a5334`), `computeEnergia2D`
(`9888ebfc`), `isoPasso` (`a3b76fce`), `scatterMs`/`computeRelief2D`
(`a846d6eb`) e `_spazTipico`/`innTaglioOk` (`24f9c47c`): estratte
`activeProf(D2)`, `d2HitTest(D2, px, py)` e `d2HitTestPt(D2, px, py)`
da `apps/genesi/genesi.html` a `apps/genesi/genesi-data.js`.

Tre funzioni accoppiate: `d2HitTest`/`d2HitTestPt` compongono
`puntoTela`/`indicePiuVicino` (già pure), e `d2HitTestPt` compone anche
`activeProf` — non potevano cambiare firma separatamente.
**`activeProf` è la prima fetta di B3 senza una funzione pura
preesistente da comporre**: calcola direttamente da `D2.tool`, pura di
suo. `d2HitTest` sostituisce `interpFronte(mx)` (wrapper di pagina che
resta, sedici altri punti di chiamata) con `interpProf(D2.profilo, mx)`
diretto, come già fatto per G41. Nessuna delle tre lascia un wrapper:
sei punti di chiamata in tutto.

Verifica standard rispettata:
- Cercato tutti e tre i nomi in `run-kpi.mjs` PRIMA di spostarli: due
  prove pinnavano il testo sorgente esatto dei vecchi legami — corrette
  per leggere la nuova forma.
- Nuova prova dedicata per le tre, verificata contro difetti iniettati
  reali. Per `d2HitTestPt` **il primo tentativo di test era cieco al
  difetto** (usava `tool:'fronte'`, che coincide con `D2.profilo` come
  il difetto stesso — sostituire `activeProf(D2)` con `D2.profilo`
  diretto non cambiava nulla): corretto usando `tool:'piede'` per
  distinguere davvero i due elenchi.
- Fondo di copertura di `genesi-data.js` alzato 162→165.
- Effetto collaterale nel censimento, non un bucket-shift: `d2Move`
  mostra `computeSeq2D` nel proprio elenco "chiama" dove prima non
  compariva — quella chiamata è nel suo corpo da sempre (riga non
  toccata da questa unità), il censimento la vedeva mascherata mentre
  elencava `activeProf`. Margine noto dello strumento.
- Cascata documenti: 3.461 prove (nove suite: run-kpi 2980 + 328 + 75
  + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.926 asserzioni,
  `genesi-data.js` 165/165, condivisi 329/329, Genesi 143 funzioni
  nella pagina / 57 estraibili (bucket "1-2" 49).
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (un mismatch preso
  e corretto sulla riga "Riferimenti" di `vault/ROADMAP_SETTIMANA.md`,
  rimasta indietro dopo un riavvio del processo worker a metà unità).
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-activeprof`): 40 comandi a
  posto, 0 caduti, 3.926 asserzioni — combaciava già al primo giro,
  sesta volta di fila.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
49). Otto unità completate: i candidati semplici e indipendenti sono
ormai esauriti. Prossimi da valutare, con grep PRIMA di toccarli:
- `_snapXY`: 6 punti di chiamata dentro gli event handler del mouse
  2D, righe dense (alcune con `_snapXY(...)` ripetuto più volte per
  riga). Nessuna prova pinnata trovata nei controlli precedenti, ma è
  il candidato più rischioso rimasto per densità di punti di chiamata:
  verificare con attenzione ogni riga toccata, magari con uno script
  python per le sostituzioni multiple come già fatto per scatterMs.
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`) — costo più
  alto, da fare come unità a sé con particolare attenzione alle prove
  pinnate su quei chiamanti (potrebbero pinnare l'intero corpo che
  contiene la chiamata a zero argomenti).

Se il prossimo candidato richiede più cautela di quanto renda
conveniente una singola unità, passare al fallback generico della
roadmap: il prossimo ponte della mappa ecosistema, o una passata in
profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.

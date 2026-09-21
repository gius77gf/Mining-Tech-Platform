# Checkpoint — 2026-09-14T22:49:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a846d6eb

## Cosa è stato completato

Sesta fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`), `reliefCls` (`154a5334`), `computeEnergia2D`
(`9888ebfc`) e `isoPasso` (`a3b76fce`): estratte insieme
`scatterMs(D2)` e `computeRelief2D(D2)` da `apps/genesi/genesi.html` a
`apps/genesi/genesi-data.js`.

**Prima unità accoppiata di B3**: `computeRelief2D` chiamava
`scatterMs` internamente, quindi non si poteva cambiare la firma
dell'una senza l'altra nella stessa unità (uno stato intermedio con
`scatterMs(D2)` ma `computeRelief2D` ancora a zero argomenti avrebbe
rotto la pagina). Entrambe componevano solo funzioni già pure
(`scatterInnesco`, `reliefSuMaglia` dal blocco G40): nessun calcolo
nuovo. Escono DEL TUTTO dalla pagina, senza lasciare wrapper — tre
punti di chiamata in tutto (il relief dentro `computeSeq2D`, un testo
diagnostico e un badge di brillabilità per lo scatter), tutti
aggiornati a passare `D2`.

Verifica standard rispettata:
- Cercato entrambi i nomi in `run-kpi.mjs` PRIMA di spostarli: due
  prove pinnavano il testo sorgente esatto dei vecchi legami —
  corrette per leggere la nuova forma. Aggiornato anche il conteggio
  delle chiamate dirette a `scatterInnesco` nella pagina (3→2: la
  terza ora passa per `scatterMs` nel modulo) e l'orchestrazione a
  zero argomenti di `computeRelief2D` dentro il test di G42
  (`sequenzaSuMaglia`).
- Nuova prova dedicata per entrambe, verificata contro difetti
  iniettati reali: per `scatterMs`, l'inversione `Th`/`tmx` nella
  formula (non commutativa); per `computeRelief2D`, l'omissione della
  composizione con `scatterMs` (sostituendola con `D2.ritardo` grezzo)
  — **lo scambio S/B era stato provato per primo e scartato**: in
  `reliefSuMaglia` sono usati sempre dentro un `Math.max`, quindi
  scambiarli è un difetto invisibile, stessa famiglia del B/S di
  `pieDev`.
- Fondo di copertura di `genesi-data.js` alzato 158→160 (le due
  funzioni insieme).
- Effetto collaterale reale: `computeSeq2D` perde `computeRelief2D`
  dal proprio elenco "chiama" (stessa famiglia di `computeEnergia2D`).
  `scatterMs` usciva anche dal bucket "3-5" del censimento, dove
  viveva per un falso positivo del tokenizzatore (un commento vicino
  con parole corte lette come variabili del modulo) — misurato
  confrontando `genesi-estraibili.mjs --elenco` prima/dopo.
- Cascata documenti: 3.458 prove (nove suite: run-kpi 2977 + 328 + 75
  + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.923 asserzioni,
  `genesi-data.js` 160/160, condivisi 324/324, Genesi 148 funzioni
  nella pagina / 62 estraibili (bucket "1-2" 54, bucket "3-5" 14).
- Un mismatch preso e corretto sulla frase-somma di STATO_PRODOTTO.md
  (la regex `RE_ADDENDI` di `numeri-nei-documenti.mjs` richiede un
  trattino seguito da uno spazio letterale prima del primo addendo:
  un a-capo messo subito dopo il trattino rompe il match anche se il
  testo sembra leggibile).
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-scattermsrelief`): 40
  comandi a posto, 0 caduti, 3.923 asserzioni — combaciava già al
  primo giro, quarta volta di fila.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
54). Sei unità completate (cinque singole, una accoppiata): i
candidati semplici (un solo punto di chiamata, nessuna dipendenza)
sono ormai esauriti. Prossimi da valutare, con grep PRIMA di toccarli:
- `_snapXY`: 6 punti di chiamata dentro gli event handler del mouse
  2D, righe dense (alcune con `_snapXY(...)` ripetuto più volte per
  riga). Nessuna prova pinnata trovata nei controlli precedenti, ma il
  cambio di firma su 6 punti in righe dense è il candidato più
  rischioso rimasto: verificare con attenzione ogni riga toccata.
- `d2HitTest`/`d2HitTestPt`: dipendono entrambe da `activeProf`, altra
  funzione del bucket "1-2" con prova pinnata — probabile altra unità
  accoppiata (come scatterMs/computeRelief2D), da fare insieme o in
  sequenza partendo da `activeProf`.
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`) — costo più
  alto, da fare come unità a sé quando gli altri candidati sono
  esauriti.
- `innTaglioOk`, `_spazTipico`: restano gli ultimi due "legami di una
  riga" del blocco G24/G25, ciascuno con 1-2 punti di chiamata — buoni
  candidati per la prossima unità semplice.

Se il prossimo candidato richiede più cautela di quanto renda
conveniente una singola unità, passare al fallback generico della
roadmap: il prossimo ponte della mappa ecosistema, o una passata in
profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.

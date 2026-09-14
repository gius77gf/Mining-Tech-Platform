# Checkpoint — 2026-09-14T23:41:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
35309706

## Cosa è stato completato

Nona fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`), `reliefCls` (`154a5334`), `computeEnergia2D`
(`9888ebfc`), `isoPasso` (`a3b76fce`), `scatterMs`/`computeRelief2D`
(`a846d6eb`), `_spazTipico`/`innTaglioOk` (`24f9c47c`) e
`activeProf`/`d2HitTest`/`d2HitTestPt` (`d482c544`): estratta
`_snapXY(D2, v)` da `apps/genesi/genesi.html` a
`apps/genesi/genesi-data.js`.

`_snapXY` era l'ultimo legame di una riga rimasto nel blocco G34
(l'aggancio opzionale alla griglia dell'editor 2D): componeva solo
`snapAGriglia`, già pura. Dieci punti di chiamata nella pagina, tutti
dentro gli event handler del mouse dell'editor 2D, tutti aggiornati a
passare `D2` con una sostituzione globale sicura. Nessun wrapper
lasciato.

Verifica standard rispettata:
- Cercato "_snapXY" in `run-kpi.mjs` PRIMA di spostarla: nessuna prova
  pinnava il vecchio testo sorgente, ma il commento d'intestazione del
  blocco di test dedicato era diventato stale (diceva che
  `snapAGriglia` era "la sola parte... che node può testare") —
  corretto.
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (inversione della condizione `D2.snap`): iniettato in una copia di
  `genesi-data.js`, il test è caduto come atteso, ripristinato subito
  dopo.
- Fondo di copertura di `genesi-data.js` alzato 165→166.
- Effetto collaterale nel censimento, stesso margine già visto su
  `activeProf`: `d2Move` guadagna `renderInspector` nel proprio elenco
  "chiama" (chiamata presente nel suo corpo da sempre, prima mascherata
  da `_snapXY`) — bucket "3-5" invariato, misurato confrontando
  `genesi-estraibili.mjs --elenco` prima/dopo.
- Cascata documenti: 3.462 prove (nove suite: run-kpi 2981 + 328 + 75
  + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.927 asserzioni,
  `genesi-data.js` 166/166, condivisi 330/330, Genesi 142 funzioni
  nella pagina / 56 estraibili (bucket "1-2" 48).
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-snapxy`): 40 comandi a
  posto, 0 caduti, 3.927 asserzioni — combaciava già al primo giro,
  settima volta di fila.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
48). Nove unità completate: tutti i candidati semplici (un solo
chiamante o pochi, nessuna dipendenza da altri legami non ancora
estratti) sono ormai esauriti. Il prossimo candidato reale è più
costoso:
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`) — quando si
  cambia la firma di queste tre, ANCHE i chiamanti pinnati con il testo
  sorgente esatto (che include `selEsplosivo()`/`selRoccia()`/
  `selInnesco()` a zero argomenti dentro il proprio corpo) smettono di
  combaciare: serve aggiornare quei pinned test insieme, non solo i
  tre G-cantieri di `selRoccia`/`selEsplosivo`/`selInnesco` stessi.
  Prima di procedere: `grep -n "selRoccia\|selEsplosivo\|selInnesco"`
  su `run-kpi.mjs` per mappare TUTTI i test coinvolti, non solo quelli
  con "selRoccia è..." nel titolo.

Con il bucket "1-2" ormai composto solo da candidati a costo più alto,
valutare seriamente il fallback generico della roadmap dopo questa
prossima unità (o al posto suo, se la mappatura dei pinned test rivela
un costo sproporzionato per una singola unità): il prossimo ponte
della mappa ecosistema in `docs/MAPPA_ECOSISTEMA.md`, o una passata in
profondità su un'altra app verticale.

Nessuno stop volontario: si prosegue subito.

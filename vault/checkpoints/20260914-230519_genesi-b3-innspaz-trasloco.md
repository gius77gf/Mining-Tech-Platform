# Checkpoint — 2026-09-14T23:05:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
24f9c47c

## Cosa è stato completato

Settima fetta del cantiere B3, dopo `pfNominale` (`c45452b5`), `pieDev`
(`be1d62be`), `reliefCls` (`154a5334`), `computeEnergia2D`
(`9888ebfc`), `isoPasso` (`a3b76fce`) e `scatterMs`/`computeRelief2D`
(`a846d6eb`): estratte `_spazTipico(D2, H)` e `innTaglioOk(D2, dt)` da
`apps/genesi/genesi.html` a `apps/genesi/genesi-data.js`.

Due funzioni indipendenti nella stessa unità — non accoppiate come
`scatterMs`/`computeRelief2D`, erano semplicemente gli ultimi due
"legami di una riga" rimasti nei blocchi G24 e G25. Componevano solo
`spaziaturaTipica`/`taglioRealizzabile`, già pure. Nessuna delle due
lascia un wrapper: tre punti di chiamata in tutto, tutti aggiornati a
passare `D2`.

Verifica standard rispettata:
- Cercato entrambi i nomi in `run-kpi.mjs` PRIMA di spostarli: due
  prove pinnavano il testo sorgente esatto dei vecchi legami — corrette
  per leggere la nuova forma.
- Nuova prova dedicata per entrambe, verificata contro difetti
  iniettati reali. Per `innTaglioOk`: scambio innesco/dt negli
  argomenti (non commutativo). Per `_spazTipico`: **il primo tentativo
  (scambio S/B) è stato provato e SCARTATO** — nel ripiego sono sempre
  dentro un `Math.max`, quindi scambiarli è invisibile, stessa
  famiglia del B/S di `pieDev`; il difetto vero usato è l'omissione di
  uno dei due argomenti dal `Math.max`.
- Fondo di copertura di `genesi-data.js` alzato 160→162.
- Nessuno spostamento di bucket per altre funzioni (i due chiamanti di
  `innTaglioOk` erano già nel bucket "11+" e non ne escono), misurato
  confrontando `genesi-estraibili.mjs --elenco` prima/dopo.
- Cascata documenti: 3.460 prove (nove suite: run-kpi 2979 + 328 + 75
  + 32 + 9 + 8 + 7 + 3 + 19), giro completo 3.925 asserzioni,
  `genesi-data.js` 162/162, condivisi 326/326, Genesi 146 funzioni
  nella pagina / 60 estraibili (bucket "1-2" 52).
- Un mismatch preso e corretto: il primo tentativo di aggiornare la
  frase-somma di STATO_PRODOTTO.md non era andato a buon fine (la
  stringa di ricerca del replace non combaciava più col testo dopo una
  correzione precedente nella stessa sessione) — trovato da
  `numeri-nei-documenti.mjs`, corretto rileggendo il file prima di
  editare.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`wt-b3-innspaz`): 40 comandi a
  posto, 0 caduti, 3.925 asserzioni — combaciava già al primo giro,
  quinta volta di fila.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` (sezione "Riferimenti") e tabella del
cantiere di Genesi in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Continuare B3 col prossimo candidato dal bucket "1-2 variabili" di
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` (restano
52). Sette unità completate (sei singole/indipendenti, una accoppiata):
i candidati semplici senza dipendenze e con pochi punti di chiamata
sono ormai quasi esauriti. Prossimi da valutare, con grep PRIMA di
toccarli:
- `_snapXY`: 6 punti di chiamata dentro gli event handler del mouse
  2D, righe dense (alcune con `_snapXY(...)` ripetuto più volte per
  riga). Nessuna prova pinnata trovata nei controlli precedenti, ma è
  il candidato più rischioso rimasto per densità di punti di chiamata:
  verificare con attenzione ogni riga.
- `d2HitTest`/`d2HitTestPt`: dipendono entrambe da `activeProf`, altra
  funzione del bucket "1-2" con prova pinnata — probabile unità
  accoppiata a tre (come `activeProf` + le due che la chiamano), o in
  sequenza partendo da `activeProf` da sola.
- `selRoccia`/`selEsplosivo`/`selInnesco`: PIÙ punti di chiamata
  ciascuna, alcuni dentro funzioni già pinnate da altri G-cantieri
  (`deriveCharge`, `rockFactorA`, `ppvSite`, `fileDeiFori`) — costo più
  alto, candidato per quando gli altri sono esauriti.

Se il prossimo candidato richiede più cautela di quanto renda
conveniente una singola unità, passare al fallback generico della
roadmap: il prossimo ponte della mappa ecosistema, o una passata in
profondità su un'altra app.

Nessuno stop volontario: si prosegue subito.

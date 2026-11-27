# Checkpoint — 2026-09-19T08:28:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b9d93414 — feat(genesi): input relativo/polare per le coordinate esatte (G51)

## Cosa è stato completato
Quinto cantiere Genesi del pivot: il pezzo a basso costo isolato nella
Decisione #43 (input relativo/polare per i campi esatti di G47a),
esplicitamente NON bloccato dai blocchi riusabili (quelli grandi,
filati al fondatore poco prima in questo stesso ciclo).

- [x] `coordinataRelativa(testo, rif)` in genesi-data.js: `@dx;dy`
      (cartesiano) e `@distanza<angolo` (polare, gradi), applicati a
      ENTRAMBE le coordinate del foro attivo, col riferimento che è lo
      stesso `D2.selPrev` già tracciato da G34quinquies/G47a.
- [x] **Scoperta di prototipo che ha cambiato la sintassi annunciata
      nella Decisione #43**: la virgola come separatore (`@dx,dy`,
      come nella nota scritta) collide con la virgola decimale
      italiana che ogni altro campo dell'app accetta — verificato in
      scratchpad PRIMA di scrivere nel modulo (19 asserzioni), come
      vuole CLAUDE.md. Il separatore scelto è «;».
- [x] I campi `#diX`/`#diY` intercettano l'input relativo prima
      dell'assoluto di G47a; la guardia sulla spalla (>=0.3 m) si
      applica anche al risultato relativo.
- [x] Banco browser `genesi-input-relativo.mjs`, con una controprova
      che spezza il mirroring di `my` (scrivere in un campo solo
      smette di spostare anche l'altro — un mezzo spostamento
      silenzioso, il tipo di svista più facile su questo gesto).
- [x] Propagati i numeri derivati in tutti e quattro i documenti
      tracciati: prove 3197→3204 (totale 3.695→3.702), copertura
      genesi-data.js 174/174→175/175 (fondo alzato 168→175), copertura
      condivisa 347/347→348/348, banchi browser 437→439 esecuzioni, 198→199
      file distinti.

## Verifica prima del commit
`run-kpi.mjs`: 3204/3204. `copertura-funzioni.mjs`: 0 senza prova (o
sotto il fondo), genesi-data.js 175/175. `sintassi-pagine.mjs`: 34/34.
`numeri-nei-documenti.mjs`: 43/43. `suite-collegate.mjs`: 3/3 (199 file
di banco, 439 esecuzioni). `sonda-vuoto.mjs`: 15/15. Banco
`genesi-input-relativo.mjs`: 8/8 normale, controprova 8 passati/1 KO
voluto (iniezione trovata 1/1).

## Stato roadmap
Bilancio del pivot su Genesi finora: quattro capacità CAD reali
implementate e provate (G48 snap a oggetti, G49 selezione multipla,
G50 rifletti la selezione, G51 input relativo/polare) e una lacuna
grande filata come Decisione #43 per il fondatore (blocchi/simboli
riusabili). La sezione 4 del censimento CAD è ora chiusa: o costruita,
o filata.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo
  del browser (`giro-completo-19-0745.log` nello scratchpad, PID 6815)
  con `leggi-giro.mjs` (sezione 0 per prima) — ancora in corso
  all'ultimo controllo (era sul blocco `contrasto`, il più lento).
  Copre per la prima volta i quattro banchi G48/G49/G50/G51 appena
  aggiunti.
- Con la sezione 4 della ricerca CAD chiusa, valutare se restano altri
  fronti aperti su Genesi da questa o da ricerche precedenti (QA
  deep-pass, altre sezioni della ricerca competitor) prima di lanciare
  nuova ricerca in background — mantenendo il pattern ≥3 fronti dentro
  Genesi richiesto dalla direttiva del fondatore.
- Continuare a verificare ogni pezzo di ricerca contro il codice PRIMA
  di implementare, come per G48/G49/G50/G51.

## Blocchi
Nessuno.

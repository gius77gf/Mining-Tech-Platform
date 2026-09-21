# Checkpoint — 2026-09-19T06:13:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
da2a05f8 — docs(genesi): recupera la ricerca concorrenti persa per collisione di scrittura

## Cosa è stato completato
Investigata e risolta la collisione di scrittura fra i due agenti Haiku
dispatchati in parallelo sulla direttiva del fondatore ("solo Genesi,
ricerca su concorrenza e su come renderlo un CAD"), entrambi puntati su
`docs/RICERCA_GENESI_CAD.md` (file nuovo).

- [x] Letto per intero il file risultante: conteneva SOLO il censimento
      "capacità CAD fondamentali" (329 righe, sezioni coerenti col
      report dell'agente `a77fb4d86b4f9957d`). Nessuna traccia della
      ricerca sui concorrenti (`a9b83edb15f76d8a6`).
- [x] Verificata la causa nella trascrizione grezza dell'agente: **due
      `Write`** (sovrascrittura intera, non append) sullo stesso file
      nuovo, in parallelo — il secondo a scrivere ha cancellato il
      primo. Nessun comando git di scrittura da parte degli agenti
      (rispettato il vincolo).
- [x] Recuperato il contenuto perso leggendo la chiamata `Write`
      dell'agente `a9b83edb15f76d8a6` nella sua cronologia persistita
      (mai davvero perso, solo non scritto su disco): censimento di 8
      concorrenti diretti/indiretti (Deswik.Blast, Maptek BlastLogic,
      Orica SHOTPlus/BlastIQ, JKSimBlast, O-Pitblast, Datamine Studio,
      Hexagon Vulcan, Surpac), tutti prodotti reali e verificabili,
      fonti marcate "[di seconda mano]" (WebSearch, non WebFetch, come
      da regola del file).
- [x] Riattaccato in coda al file con una nota di continuità che
      dichiara la collisione e stabilisce quale sezione è di
      riferimento per cosa: il censimento riga-per-riga di Genesi
      (verificato con grep e numeri di riga) resta la fonte per il
      delta prodotto; il censimento concorrenti resta la fonte per il
      mondo esterno. Il "delta" superficiale che l'agente dei
      concorrenti aveva scritto (dichiarato lui stesso "non ancora
      analisi profonda") è stato mantenuto solo come traccia, non come
      verdetto.
- [x] Corretto in `vault/ROADMAP_SETTIMANA.md` un numero scritto a
      mente e sbagliato per eccesso: "quattro agenti Haiku" dispatchati
      sul file, in realtà **due** — verificato rileggendo l'elenco dei
      file di task in `/tmp/.../tasks/` filtrati per data. Aggiunta la
      lezione: su un file NUOVO condiviso da più agenti paralleli,
      "append-only" da solo non basta a evitare la collisione — o si
      dispatcha in sequenza, o si scrivono file separati da unire dopo.

## Verifica prima del commit
`numeri-nei-documenti.mjs`: 43/43 (431 banchi, invariato — il nuovo file
non è ancora nell'elenco `BROWSER` sorvegliato, e va bene così: non
dichiara numeri di prodotto, solo di ricerca). `sonda-vuoto.mjs`: 15/15,
nessuna riga nuova rispetto a prima (13 punti "da guardare" preesistenti,
0 veri).

## Stato roadmap
La direttiva del fondatore (solo Genesi) resta in vigore. Il file di
ricerca CAD è ora completo con entrambi gli angoli richiesti
(fondamenta CAD + concorrenza). Restano da chiudere i tre cantieri
pre-direttiva già in volo (QA Flotta `a372e9a0632e13de9`, UX Flotta
`ae2e145b7f346de61` — quest'ultimo ancora in corso secondo l'ultima
notifica) prima di dedicare il 100% a Genesi.

## Prossimi passi
- **Prossimo passo atomico**: leggere e verificare indipendentemente il
  report QA Flotta (`a372e9a0632e13de9`, 4 findings, il #1 su
  `vitaComponenti` di costo Medio legato a un modulo non ancora
  costruito) contro il codice attuale di Flotta; decidere se un fix è
  abbastanza piccolo da chiudere in questa stessa unità o va solo
  documentato, dato il vincolo "nessun nuovo lavoro su Flotta" (i
  findings già pagati vanno comunque processati, non i nuovi).
- Attendere/processare il report UX Flotta (`ae2e145b7f346de61`) allo
  stesso modo appena arriva.
- Poi: pivot completo su Genesi. Leggere `apps/genesi/genesi.html` e
  `apps/genesi/genesi-data.js` per verificare indipendentemente i due
  censimenti appena recuperati, e tradurre i punti verificati in unità
  concrete (es. snap a oggetti, export DXF) o in una decisione per
  `docs/DECISIONI_WEEKEND.md` se il costo/la scelta architetturale lo
  richiede.
- Continuare a leggere l'esito del giro completo del browser
  (`giro-completo-19-0552.log`, PID 23083) con `leggi-giro.mjs` quando
  utile, sezione 0 per prima.

## Blocchi
Nessuno.

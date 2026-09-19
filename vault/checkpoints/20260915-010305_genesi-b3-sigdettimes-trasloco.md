# Checkpoint — 2026-09-15T01:03:05Z

## Tipo
unit-complete (+ una lezione di igiene sui commit, pagata due volte)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
da00eb6a (pushato in questa unità)

## Cosa è stato completato

Estratta `_sigDetTimes()` da `apps/genesi/genesi.html`: componeva SOLO
`tempiDetonazione(D2)`, già esattamente la forma che `genesi-data.js`
espone dal blocco G23 (10/09) — un alias senza logica propria, come
`sitoStore`. Nessuna funzione nuova nel modulo: i suoi due chiamanti
(la modale del PPV composito, il nome del file esportato) chiamano
`tempiDetonazione(D2)` direttamente.

Verifica standard rispettata:
- Cercato "_sigDetTimes" in `run-kpi.mjs` PRIMA di toccare nulla: due
  pinned test, corretti entrambi (uno contava letteralmente
  `_sigDetTimes()`, diventato un conto su `function _sigDetTimes` +
  `tempiDetonazione(D2)`; l'altro pinnava il testo esatto del legame).
- Primo tentativo dell'assestamento contava male: il mio stesso
  commento nella pagina ripeteva la stringa `tempiDetonazione(D2)` due
  volte, e la prova la contava insieme ai due punti di chiamata veri
  (5 invece di 2). Riscritto il commento per non ripetere il pattern
  esatto — è la stessa lezione già scritta in questo file su
  `computeInnesco2D` una settimana fa, applicata a me stesso mentre la
  seguivo.
- Nessun fondo di copertura da alzare: non è stata aggiunta nessuna
  funzione a `genesi-data.js`, solo tolta una dalla pagina.
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: 141→140 funzioni, bucket "1-2"
  47→46, estraibili 55→54. Nessun effetto collaterale su altre funzioni.
- Cascata documenti: solo `docs/DEVELOPMENT.md` aveva numeri da
  correggere (il conto delle prove non cambia, `run-kpi` resta 2982).
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`/tmp/wt-b3-sigdet`, lanciato
  con `run_in_background: true`, tracciato dall'harness): **40 comandi
  a posto, 0 caduti**, 3.928 asserzioni — stesso numero già corretto
  nei documenti per l'unità precedente, nessuna nuova divergenza.

## ⚠️ La stessa svista, due volte di fila, nello stesso ciclo

Il commit precedente (`da00eb6a`, nominalmente "solo un checkpoint")
contiene **anche** questa unità di codice (`_sigDetTimes`), per lo
stesso motivo per cui il commit prima ancora (`3d602346`, nominalmente
"solo canarino") conteneva l'unità `computeInnesco2D`: avevo fatto
`git add -A` per preparare la worktree di verifica, e poi
`git commit -F <file>` **senza pathspec** — che committa TUTTO l'indice,
non solo l'ultimo file aggiunto. Il contenuto era corretto in entrambi
i casi (verificato prima e dopo), quindi nessun danno al codice: il
danno è solo nell'etichetta del commit, che promette meno di quello
che contiene.

La regola pratica, da applicare da qui in avanti senza eccezioni:
**`git status --short` (o `git diff --cached --stat`) subito PRIMA di
ogni `git commit -F`**, per vedere esattamente cosa sta per entrare —
non fidarsi di ricordare che cosa si è aggiunto due passi prima.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Prossimo candidato dal lotto del 14/09 da riverificare (non assumere
che "resta come legame" sia definitivo — verificarlo, misurando i
punti di chiamata prima di decidere):
- `mdlProfSnap` (3 punti di chiamata, compone `P` E `D2.piede`
  insieme — leggermente più complesso di un legame a una sola
  variabile, ma con un solo stato "vero" da passare visto che i tre
  chiamanti sono tutti nella stessa famiglia undo/redo del modello 3D);
- poi `crestZ` (7 punti di chiamata, usa `P` non `D2` — sparsi su più
  funzioni non correlate, probabilmente il più costoso dei piccoli).

⛔ **NON toccare `computeMIC` senza rileggere per intero** il test
"i sette lettori della pagina non ridisegnano il numero tranquillo"
(`run-kpi.mjs`, cerca "computeMIC() compare 2 volte"): lì il legame a
zero argomenti è deliberato e sorvegliato contro un difetto di
sicurezza già chiuso (`Math.max(1, null)` su una MIC non calcolabile).
È l'opposto di `reliefCls`/`computeInnesco2D`/`_sigDetTimes`.

Restano deferred per il costo misurato: `interpFronte` (16 punti di
chiamata) e il gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46
punti di chiamata, 10 pinned test in 5 blocchi indipendenti).

Nessuno stop volontario: si prosegue subito con `mdlProfSnap`.

# Checkpoint — 2026-09-15T01:16:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2e5a8fc7 (pushato)

## Cosa è stato completato

Estratta `mdlProfSnap()` da `apps/genesi/genesi.html`: componeva SOLO
`scattoProfili(P.profilo, D2.piede)`, già pura dal blocco G30 (11/09).
Nessuna funzione nuova nel modulo. I suoi tre chiamanti (`mdlPushUndo`,
`mdlUndo`, `mdlRedo` — la famiglia undo/redo del modello 3D) chiamano
`scattoProfili` direttamente.

Verifica standard rispettata:
- Cercato "mdlProfSnap" in `run-kpi.mjs` PRIMA di toccare nulla: un
  pinned test (G30), corretto (contava il testo esatto del legame;
  ora conta che il legame sia sparito e che i tre chiamanti passino
  `P.profilo, D2.piede`).
- `run-kpi.mjs`: 2982 passati, 0 falliti (nessuna prova nuova: era un
  puro alias, non c'era logica da testare oltre a `scattoProfili`
  stessa, già ampiamente provata).
- Nessun fondo di copertura da alzare (nessuna funzione aggiunta).
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: **effetto collaterale reale, non
  solo un margine dello strumento** — i tre chiamanti leggevano solo
  `mdlUndoStack` (`P`/`D2` restavano mascherati dentro la chiamata a
  `mdlProfSnap()`); inlineata la composizione nei loro corpi, `P` e
  `D2` diventano letture dirette e tutti e tre salgono dal bucket
  "1-2" al "3-5". Risultato: 140→139 funzioni, "1-2" 46→42 (non 46→45:
  −1 per la funzione tolta, −3 per i tre chiamanti che salgono di
  scaglione), "3-5" 14→17 (+3, esattamente i tre chiamanti), estraibili
  54→50, "il resto" 86→89.
- Cascata documenti: solo `docs/DEVELOPMENT.md` aveva numeri da
  correggere (tabella, frase "N su M", "N funzioni", "restanti N").
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`/tmp/wt-b3-mdlprofsnap`, lanciato
  con `run_in_background: true` e atteso con `TaskOutput(block: true)`
  invece di `nohup`/`ps` a mano — vedi nota sotto): **40 comandi a
  posto, 0 caduti**, 3.928 asserzioni, nessuna nuova divergenza nei
  documenti.

## Nota di metodo: come si è evitata la terza ripetizione della stessa svista

Le due unità precedenti (`computeInnesco2D`, `_sigDetTimes`) sono
finite per sbaglio nello stesso commit di un file non correlato
(`git commit -F` senza pathspec, con l'indice sporco di un `git add -A`
precedente). Per questa unità, PRIMA di ogni `git commit -F`, è stato
eseguito `git status --short` e verificato che l'elenco combaciasse
esattamente con l'intenzione — confermato due volte (dopo lo stage,
dopo la rimozione della worktree). Nessuna sorpresa nel commit finale
(3 file, quelli attesi).

Nota anche sul metodo di attesa: il primo giro isolato di questo ciclo
era stato lanciato con `nohup ... & disown` fuori dal tracciamento
dell'harness, ed è morto a metà senza errore visibile (probabile
riavvio del contenitore fra un fuoco della routine e l'altro). Da
questa unità in poi: `Bash(..., run_in_background: true)` +
`TaskOutput(block: true)`, che sopravvive e notifica correttamente.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Prossimo candidato dal lotto del 14/09 da riverificare (misurare i
punti di chiamata prima di decidere, non fidarsi dell'etichetta
"legame" da sola):
- `crestZ` (7 punti di chiamata, usa `P` non `D2`, sparsi su funzioni
  non correlate fra loro — verificare se qualcuno dei 7 chiamanti NON
  ha `P` in scope banalmente, come invece è sempre stato vero finora).

⛔ **NON toccare `computeMIC`** senza rileggere per intero il test "i
sette lettori della pagina non ridisegnano il numero tranquillo"
(`run-kpi.mjs`, cerca "computeMIC() compare 2 volte"): lì il legame a
zero argomenti è deliberato e sorvegliato contro un difetto di
sicurezza già chiuso. È l'opposto dei casi appena chiusi.

Restano deferred per il costo misurato: `interpFronte` (16 punti di
chiamata) e il gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46
punti di chiamata, 10 pinned test in 5 blocchi indipendenti).

Nessuno stop volontario: si prosegue subito con `crestZ`.

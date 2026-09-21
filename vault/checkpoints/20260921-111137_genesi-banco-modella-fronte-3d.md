# Checkpoint — 2026-09-21T11:11:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
919d5469 (test(genesi): copertura browser per play/pausa/scrub della timeline)

## Cosa è stato completato
Proseguito il metodo "verifica dal vivo" col candidato indicato dal
checkpoint precedente: la scena 3D stessa, non solo la sua timeline.
Trovato che `genesi-struttura.mjs` censisce solo l'ESISTENZA nel DOM di
`mdlQuote`/`mdlTools`/`mdlR`/`mdlUndo`/`mdlRedo`/`mdlReset` (riga 167),
ma **nessun banco fa mai un trascinamento vero** sulla modellazione 3D
del fronte (`#btnModella`/`mdlDrag`/raycasting sulle maniglie
cresta/piede, genesi.html ~2968-3132) — a differenza dell'editor 2D
(`genesi-tratti.mjs`, `genesi-d2-undo.mjs`), che è testato a fondo.

Per rendere il trascinamento misurabile da Playwright (le maniglie sono
sfere Three.js raycastate, non elementi DOM: serve la proiezione
3D→schermo) ho aggiunto al ponte di debug `window.__genesi`
(genesi.html, blocco "hook di debug ... inerte in produzione", riga
8332) quattro voci minime, tutte di sola lettura salvo un helper di
proiezione senza effetti collaterali: `modella`, `mdlUndoLen`,
`mdlRedoLen`, `mdlHandleScreenPos(i, tipo)`. Stesso pattern già in uso
per `seek`/`look`/`setParam`/`d2UndoLen` — non una scorciatoia nuova.

Comportamento misurato PRIMA di scrivere le asserzioni (in scratchpad,
non a memoria, come richiesto): il raggio d'influenza di default (20%)
è largo abbastanza da spostare TUTTE le 9 maniglie con una gaussiana
simmetrica attorno a quella trascinata, clampata a [-6,10]; il "tocco
senza spostamento" (mdlUp, riga ~3101) non sporca la cronologia; Annulla/
Ripristina tornano esattamente ai valori di prima/dopo, alla cifra
(confrontati con `JSON.stringify`, non con una tolleranza).

Nuovo file: `apps/deepwork-id/tests/browser/genesi-modella-fronte-3d.mjs`
(13/0). Nessun `DIFETTI`/`--controprova`: nessun difetto storico da
riprodurre, stessa scelta dichiarata di `genesi-timeline-play-scrub.mjs`
nell'unità precedente.

Registrato in `tutti.mjs`. `porte-banchi.mjs`: 3/0, 184 banchi con un
server (183→184).

## Numeri propagati (misurati, non dedotti)
- Banchi del browser: 456 → **457** (4 documenti tracciati).
- File di banco distinti: 208 → **209** (`vault/ROADMAP_SETTIMANA.md`).
- Asserzioni del giro `node`: 4285 → **4286** (`docs/DEVELOPMENT.md`,
  `docs/STATO_PRODOTTO.md`) — il banco nuovo è del BROWSER, dichiarato
  esplicitamente come non incluso in questo totale.
- **Nota sul "+1" apparentemente misterioso incontrato committando**:
  un giro intermedio (prima di scrivere questo checkpoint) ha mostrato
  "1559 checkpoint" contro i 1558 file su disco — non un difetto,
  è `date-checkpoint.mjs` che conta ogni percorso mai entrato nella
  storia di git (comprese le rinomine di sessione), non i file
  correnti: un checkpoint rinominato con `git mv` in questo blocco
  conta due volte (vecchio nome + nuovo nome), per costruzione
  (documentato in CLAUDE.md — è la difesa contro chi userebbe `git mv`
  per far tacere l'eccezione). Verificato leggendo l'output di
  `date-checkpoint.mjs` direttamente, non dedotto.

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-modella-fronte-3d.mjs`:
  13 passati, 0 falliti.
- `node apps/deepwork-id/tests/porte-banchi.mjs`: 3/0, 184 banchi.
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`: da rilanciare
  DOPO aver scritto questo checkpoint (il conteggio dei banchi non
  dipende da lui, ma la disciplina è rilanciare comunque prima del
  giro finale).
- `node apps/deepwork-id/tests/giro-node.mjs`: da rilanciare come ultimo
  passo, sulla copia comprendente questo checkpoint, per il numero
  finale da propagare (regola: mai propagare un numero letto da un giro
  lanciato PRIMA dell'ultimo file scritto).

## Stato roadmap
Blocco proseguito. Mandato del fondatore invariato: solo Genesi, massimo
sforzo.

## Prossimi passi
- **Prossimo passo atomico**: col metodo "azioni utente senza copertura
  browser" ormai steso su design 2D, export, timeline e modellazione 3D
  del fronte, il prossimo candidato naturale è il resto dei controlli
  camera/interazione 3D non ancora guardati con questo metodo — i
  bottoni camera (`[data-cam]`, "Da terra 50 m"/"Drone"/"Laterale"/
  "Libera") e l'interazione di selezione del singolo foro
  (`holeInfoShow`/click su un foro, righe ~2927-2946) — oppure tornare a
  un secondo passaggio su `docs/GENESI_ROADMAP_COMPETITOR.md`/
  `docs/RICERCA_CONTINUA_GENESI.md` se quell'area risultasse già priva
  di bersagli (come già successo per qualità/look in questo blocco).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.

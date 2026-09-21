# Checkpoint — 2026-09-21T12:18:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b0f146c5 (fix(genesi): il popup del foro selezionato restava orfano spegnendo i raggi-X)

## Cosa è stato completato
Ultimo candidato del metodo "verifica dal vivo" sulla scena 3D indicato
dal checkpoint precedente: il cursore di trasparenza del fronte in
vista Raggi-X (`#xrOp`, genesi.html ~2922-2924), zero copertura prima
(`grep -rl 'xrOp' apps/deepwork-id/tests/browser/*.mjs` → 0 risultati).

Comportamento particolare misurato dal vivo prima di scrivere le
asserzioni: muovere il cursore attiva DA SOLO il layer "Raggi-X
progetto" se non era già attivo (comportamento diverso dalla checkbox,
che l'utente deve spuntare esplicitamente) — anche se il layer era
stato appena spento con la checkbox. Nessun difetto trovato: `xrayOp`
e l'opacità reale del materiale (`ghostWall.material.opacity`)
seguono il cursore in modo lineare e coerente su tutto l'intervallo
(min 4% → 0,04, max 85% → 0,85).

Nuovo file: `apps/deepwork-id/tests/browser/genesi-trasparenza-xray.mjs`
(7/0). Nessun `DIFETTI`/`--controprova`: nessun difetto storico da
riprodurre, stessa scelta dichiarata delle unità precedenti su questa
scena (timeline, modellazione 3D, camere).

Aggiunti al ponte di debug `window.__genesi`: `xrayOp`, `ghostOpacity`
(sola lettura).

Registrato in `tutti.mjs`. `porte-banchi.mjs`: 3/0, 187 banchi.

## Numeri propagati (misurati, non dedotti)
- Banchi del browser: 460 → **461**.
- File di banco distinti: 211 → **212**.
- Asserzioni del giro `node`: da confermare col giro finale dopo
  questo checkpoint (questa unità non tocca moduli dati, solo
  genesi.html/docs/vault, ma si rilancia comunque per disciplina).

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-trasparenza-xray.mjs`:
  7 passati, 0 falliti.
- `node apps/deepwork-id/tests/porte-banchi.mjs`: 3/0, 187 banchi.
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`: 43/0, 461
  banchi contati.
- `node apps/deepwork-id/tests/giro-node.mjs`: da rilanciare come
  ultimo passo.

## Stato roadmap
**Il metodo "azioni utente senza copertura browser" sulla scena 3D di
Genesi è ora esaurito**: timeline (play/pausa/scrub), modellazione 3D
del fronte (trascinamento cresta/piede), i quattro bottoni camera,
selezione di un foro in vista Raggi-X (con un difetto vero corretto),
cursore di trasparenza — tutti coperti in questo blocco, partendo da
zero banchi su ciascuno. Qualità/look e i layer del Progetto 2D erano
già stati controllati e risultati privi di bersaglio (nessun controllo
utente reale, o già ben difesi).

## Prossimi passi
- **Prossimo passo atomico**: con la scena 3D e la timeline esaurite,
  il prossimo blocco dovrebbe tornare a un secondo passaggio su
  `docs/GENESI_ROADMAP_COMPETITOR.md`/`docs/RICERCA_CONTINUA_GENESI.md`
  (entrambi già ampiamente esaminati in blocchi precedenti, ma non
  esauriti quanto la scena 3D) — oppure applicare lo stesso metodo
  "bottoni/interazioni senza banco" all'editor 2D del fronte
  (`apps/genesi/genesi.html`, schermata Progetto), che ha già una
  buona copertura (`genesi-tratti.mjs`, `genesi-d2-undo.mjs`,
  `genesi-snap-estremo.mjs`, `genesi-selezione-multipla.mjs`,
  `genesi-rifletti-selezione.mjs`, `genesi-ruota-scala-tratti.mjs`) ma
  non è stato ricensito con lo stesso metodo sistematico usato qui per
  il 3D.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.

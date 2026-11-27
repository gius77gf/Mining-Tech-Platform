# Checkpoint — 2026-09-21T12:06:34Z

## Tipo
unit-complete (fix + copertura, con controprova)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6fa2a4e2 (test(genesi): copertura browser per i bottoni camera, trovato difetto reale (decisione 31))

## Cosa è stato completato
Proseguito il metodo "verifica dal vivo" sul prossimo candidato: la
selezione di un foro nella vista Raggi-X (`holeInfoShow`/`holeInfoHide`,
click reale sulla scena 3D con raycasting, genesi.html ~2929-2951), zero
copertura funzionale — l'unico banco che la nomina
(`genesi-timing-nominale.mjs`) chiama `holeInfoShow(...)` direttamente,
mai un clic vero.

**Trovato e CORRETTO un difetto reale**, misurato dal vivo prima di
leggere il codice: selezionato un foro (con "Raggi-X progetto" attivo),
spegnendo quel layer da checkbox il popup del foro **restava aperto**
— `holeSel` continuava a puntare a un cilindro ormai invisibile
(`xrayGroup.visible=false`), con l'emissive ancora alzata. Causa: il
loop che monta l'`onchange` di tutti i layer (genesi.html:2919-2921)
non sapeva nulla del foro selezionato — le sue uniche eccezioni erano
`lQuote`→`quotaApplica` e `lAudio`→i booms.

A differenza delle tre unità precedenti (timeline, modellazione 3D,
camere — copertura senza correzione), qui la correzione era **ovvia e
meccanica**, non una scelta di prodotto: nessuno sceglierebbe
deliberatamente di lasciare un popup aperto su un oggetto invisibile.
Aggiunta una riga: `if(id==='lXray' && !layers.lXray) holeInfoHide();`
— la stessa funzione già usata dal bottone ✕ e dal cambio di
selezione, non una nuova.

Nuovo file: `apps/deepwork-id/tests/browser/genesi-selezione-foro-3d.mjs`
(10/0, controprova 9 ok + 1 KO sull'asserzione causale + verifica
dell'iniezione = 10/1). Copre anche: guard quando i raggi-X sono
spenti (clic non fa nulla), selezione corretta del foro cliccato,
cambio di selezione fra due fori, chiusura col bottone ✕.

Aggiunti al ponte di debug `window.__genesi`: `holeScreenPos(i)`
(proiezione 3D→schermo di un cilindro raggi-X, stesso pattern di
`mdlHandleScreenPos`), `holeSel` (indice del foro selezionato o null).

Registrato in `tutti.mjs` (banco + controprova). `porte-banchi.mjs`:
3/0, 186 banchi.

## Numeri propagati (misurati, non dedotti)
- Banchi del browser: 458 → **460** (banco + controprova).
- File di banco distinti: 210 → **211**.
- Asserzioni del giro `node`: 4287 → **4288** (da confermare col giro
  finale dopo questo checkpoint).

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-selezione-foro-3d.mjs`:
  10 passati, 0 falliti.
- `node apps/deepwork-id/tests/browser/genesi-selezione-foro-3d.mjs
  --controprova`: 9 passati, 1 fallito — esattamente e solo
  l'asserzione causale ("il popup si chiude"), più la verifica che
  l'iniezione ha colpito (1/1).
- `node apps/deepwork-id/tests/porte-banchi.mjs`: 3/0, 186 banchi.
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`: 43/0, 460
  banchi contati.
- `node apps/deepwork-id/tests/giro-node.mjs`: da rilanciare come
  ultimo passo, sulla copia comprendente questo checkpoint.

## Stato roadmap
Blocco proseguito. Mandato del fondatore invariato: solo Genesi, massimo
sforzo.

## Prossimi passi
- **Prossimo passo atomico**: con play/scrub, modellazione 3D del
  fronte, camere e selezione del foro ora coperti, il metodo
  "bottoni/interazioni senza banco" sulla scena 3D è vicino
  all'esaurimento — resta da guardare il cursore di trasparenza
  `#xrOp` (righe 2922-2924, che forza `lXray=true` quando mosso: mai
  testato) e il tasto ⌨ "Modella" via `#btnModella`/`mdlTools` già
  coperto. Se anche `#xrOp` risultasse privo di bersagli, tornare a un
  secondo passaggio su `docs/GENESI_ROADMAP_COMPETITOR.md`/
  `docs/RICERCA_CONTINUA_GENESI.md`.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.

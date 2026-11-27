# Checkpoint — 2026-09-15T01:28:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
871e2038 (pushato)

## Cosa è stato completato

Estratta `crestZ(x)` da `apps/genesi/genesi.html`: componeva SOLO
`quotaCresta(P.profilo, x)`, già pura dal blocco G24 (10/09). Nessuna
funzione nuova nel modulo. I sei chiamanti — sparsi su funzioni non
correlate fra loro (`buildSim`, la scheda dei fori; `mdlQuoteShow`,
`mdlBuild` ×2, la sincronizzazione 3D del modello; l'esportazione del
piede) — chiamano `quotaCresta(P.profilo, x)` direttamente. Sostituzione
fatta con uno script Python di replace globale (`crestZ(` →
`quotaCresta(P.profilo, `), sicuro perché la sottostringa non compare
in nessun altro contesto — confermato con `grep -c` prima e dopo.

Verifica standard rispettata:
- Cercato "crestZ" in `run-kpi.mjs` PRIMA di toccare nulla: un pinned
  test (G24), corretto (contava il testo esatto del legame; ora conta
  che sia sparito e che i sei chiamanti passino `P.profilo`).
- `run-kpi.mjs`: 2982 passati, 0 falliti (nessuna prova nuova: era un
  alias senza logica propria oltre a `quotaCresta`, già ampiamente
  provata).
- Nessun fondo di copertura da alzare.
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: 139→138 funzioni, "1-2" 42→41,
  estraibili 50→49. **A differenza di `mdlProfSnap`, nessuno
  spostamento di bucket per altre funzioni**: i sei chiamanti
  (`buildSim`, `mdlQuoteShow`, `mdlBuild`) leggono già molte altre
  variabili di modulo (sono in buckets "6-10"/"11+" da prima), quindi
  aggiungere `P` alla loro lista di letture dirette non li fa
  attraversare nessun confine di scaglione. Confermato leggendo
  l'elenco delle funzioni enclosing, non dedotto per somiglianza col
  caso precedente.
- Cascata documenti: solo `docs/DEVELOPMENT.md`.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata (`/tmp/wt-b3-crestz`,
  `run_in_background: true` + `TaskOutput(block: true)`): **40 comandi
  a posto, 0 caduti**, 3.928 asserzioni, nessuna nuova divergenza.

## Disciplina sui commit, confermata per la seconda volta di fila senza incidenti

`git status --short` eseguito PRIMA di ogni `git commit -F` (dopo lo
stage, e di nuovo dopo la rimozione della worktree): in entrambi i
controlli l'elenco combaciava esattamente con l'intenzione. Il commit
finale contiene i 3 file attesi, non di più.

## Stato roadmap

B3 in corso. Storia append-only aggiornata in `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Con `computeInnesco2D`, `_sigDetTimes`, `mdlProfSnap` e `crestZ` tutti
chiusi, il bucket "1-2" (41 funzioni) resta composto quasi
interamente da funzioni che SCRIVONO NEL DOM o toccano l'AMBIENTE del
browser (già escluse dal conto "estraibili" per costruzione — vedi
l'intestazione di `genesi-estraibili.mjs`), più:

⛔ **`computeMIC` — NON toccare** senza rileggere per intero il test
"i sette lettori della pagina non ridisegnano il numero tranquillo"
(`run-kpi.mjs`, cerca "computeMIC() compare 2 volte"): legame
deliberato e sorvegliato contro un difetto di sicurezza già chiuso
(`Math.max(1, null)` su una MIC non calcolabile). Diverso da tutti i
casi appena chiusi.

Prima di aprire un altro candidato, vale la pena rilanciare
`node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco` e leggere
per intero la nuova lista dei 41 rimasti nel bucket "1-2", uno per
uno, con la stessa domanda fatta finora: *questo è un legame non
ancora finito, o una decisione di architettura reale (DOM/ambiente/
sicurezza)?* — invece di continuare a lavorare sulla memoria della
lista precedente, che a ogni unità si è dimostrata diversa da quello
che sembrava all'inizio.

Restano deferred per il costo misurato: `interpFronte` (16 punti di
chiamata) e il gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46
punti di chiamata, 10 pinned test in 5 blocchi indipendenti).

Nessuno stop volontario: si prosegue subito, rileggendo l'elenco
fresco prima di scegliere il prossimo candidato.

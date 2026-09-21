# Checkpoint — 2026-09-18T12:34:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a041b0fc — fix(campo): CLASSE_HSE non copriva lo stato «senza-scadenze» di idoneitaOperatore

## Cosa è stato completato
Dal deep-pass QA su Campo (agente afaef6de7ffb174b4): `CLASSE_HSE` mancava
la chiave `"senza-scadenze"` (operatore collegato a Scudo, ma nessun
documento registrato) — la stessa svista della correzione dell'ottavo stato
di poche ore prima, ripresentata sul nono. La card cadeva sul ripiego
`"st-ok"` verde, indistinguibile da "regolare". Corretto; nuovo test che
deriva l'elenco atteso da `ESITI_TURNO` invece di elencarlo a mano.

## Verifica
Giro completo su worktree isolata (ricreata dall'HEAD corrente, copiando
solo `apps/campo/index.html` e riapplicando a mano la modifica a
`run-kpi.mjs` — vedi la lezione del checkpoint precedente): **41/41, 0
caduti**. KPI 3150→3151. 9-suite sum: **3.647**. Asserzioni totali del
giro: **4149**. `numeri-nei-documenti.mjs` verificato su quattro documenti.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Accessibilità toast** (Genesi CSS err/success/warn, role/aria-live su
   core/Genesi/admin) — worktree `/tmp/wt-toast-a11y` STALE (creata prima
   di Scudo/Conti/Campo): va ricreata dall'HEAD corrente copiando SOLO i
   file di prodotto (`index.html`, `apps/deepwork-id/admin.html`,
   `apps/genesi/genesi.html`) e riapplicando a mano le due modifiche a
   `run-kpi.mjs` (già scritte, contenuto noto: il test dei nove toast e
   quello del CSS di Genesi), non copiare il file di test per intero.
2. **Sentinella — misureDelGiornoPerReclamo/rispostaReclamo**
   (`/tmp/wt-sentinella-reclamo`, ricreata correttamente): fix verificato
   con `run-kpi.mjs` da solo (3149/0). **Manca ancora il giro completo.**
3. La trappola del focus nella modale (`shared/dw-app-ui.js`) — non ancora
   iniziata.
4. Conti — listener accumulato su `#modal-foot` (index.html:6165) — non
   ancora affrontato.

## Prossimo passo atomico
Lanciare il giro completo su `/tmp/wt-sentinella-reclamo` (da solo, non in
parallelo con altri — vedi la nota sul falso rosso di `server-orfani.mjs`
già misurata). Propagare i numeri, commit, push, checkpoint. Poi ricreare
`/tmp/wt-toast-a11y` dall'HEAD corrente e ripetere lo stesso percorso.
Continuare "mai fermarsi".

## Blocchi
Nessuno.

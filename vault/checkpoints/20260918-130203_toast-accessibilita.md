# Checkpoint — 2026-09-18T13:02:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
99b36df0 — fix(shared): accessibilità del toast su core/Genesi/admin

## Cosa è stato completato
Dal deep-pass QA su shared/dw-app-ui.js (agente a2cd701aa80f1f010, da
prima di questa serie di unità): due difetti di accessibilità del toast.
1. `role="status" aria-live="polite"` mancava su core/Genesi/admin (le
   altre sei app lo avevano già).
2. Genesi chiama già `toast(m,"err")` su un errore vero, ma il suo CSS
   locale non aveva regole `.err`/`.success`/`.warn` (a differenza di
   `shared/dw-app-ui.css`) — usciva col toast neutro.
Corretti entrambi; due nuovi test con controprova.

## Verifica
Giro completo su worktree isolata (ricreata dall'HEAD corrente, copiando
solo i tre file di prodotto — `index.html`, `admin.html`, `genesi.html` —
e riapplicando a mano le due modifiche a `run-kpi.mjs`): **41/41, 0
caduti**. KPI 3151→3153. 9-suite sum: **3.649**. Asserzioni totali del
giro: **4151**.

## Nota di metodo — sulla scrittura del banco browser di Terra (unità in
corso, non ancora committata)
Scrivendo `terra-valore-calendario-impossibile.mjs` (vedi coda di lavoro)
il banco falliva mostrando il valore BUGGATO anche con il fix applicato.
Causa: il banco legge `process.env.DW_RADICE || "/home/user/Mining-Tech-Platform"`
per sapere quale albero servire — e lanciandolo a mano, senza passare
`DW_RADICE`, serviva l'albero PRINCIPALE (che non ha ancora il fix), non
la worktree isolata dove il fix vive. `tutti.mjs`/`giro-node.mjs` impostano
quella variabile quando orchestrano i banchi su una copia; lanciando un
banco a mano per verificarlo in isolamento, va impostata a mano:
`DW_RADICE=<worktree> node apps/deepwork-id/tests/browser/<banco>.mjs`.
Costato un'ora di debug (confrontando due script quasi identici riga per
riga) prima di trovare la vera causa — la stessa famiglia della regola già
scritta in CLAUDE.md sul contrassegno di porta, in una veste nuova: qui non
era la porta a essere di qualcun altro, era la RADICE servita.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Terra — renderValore usava rilievoUsabile invece di
   rilievoUsabileConData** (`/tmp/wt-terra-rendervalore`): fix scritto,
   nuovo banco browser `terra-valore-calendario-impossibile.mjs` scritto e
   verificato mirato con controprova (usando `DW_RADICE` correttamente,
   vedi sopra — questo È il "banco mirato sulla superficie toccata" che
   CLAUDE.md pretende sempre; il giro COMPLETO del browser, ore, si lancia
   una volta per blocco, non per unità). **Manca ancora il giro `node`
   senza emulatori** (`giro-node.mjs`, secondi) su questa worktree — quello
   sì va lanciato per ogni unità.
2. **Flotta — csvGiriMacchina scriveva le ore col punto inglese**
   (`/tmp/wt-flotta-csvgiri`): fix scritto e verificato con `run-kpi.mjs`
   e controprova (3151/0, nessun nuovo `test()`). **Manca ancora il giro
   completo.**
3. La trappola del focus nella modale (`shared/dw-app-ui.js`) — non ancora
   iniziata.
4. Conti — listener accumulato su `#modal-foot` — non ancora affrontato.
5. Nuovi agenti di deep-pass QA da lanciare per mantenere ≥3 cantieri (gli
   ultimi due, su Terra e Flotta, hanno già fruttato i difetti sopra).

## Prossimo passo atomico
Lanciare `node apps/deepwork-id/tests/giro-node.mjs` (da solo) su
`/tmp/wt-terra-rendervalore`. Propagare i numeri, commit, push, checkpoint.
Poi lo stesso su `/tmp/wt-flotta-csvgiri`. Poi dispatchare 2 nuovi agenti
QA in background. Poi la trappola del focus e il listener di Conti.
Continuare "mai fermarsi".

## Blocchi
Nessuno.

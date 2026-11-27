# Checkpoint — 2026-09-18T13:15:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bc109da4 — fix(terra): renderValore usava rilievoUsabile invece di rilievoUsabileConData

## Cosa è stato completato
Dal deep-pass QA su Terra (agente aedd8b1d2a5f43422): `renderValore` (il
riquadro "Valore del materiale estratto") usava `rilievoUsabile` invece di
`rilievoUsabileConData` — la stessa copia debole già chiusa il 17/09 in
`proiezioneAnnua`/`varianzaLottoAnno`/`anniConVolumi`, rimasta in un quarto
punto di consumo. Un rilievo a calendario impossibile gonfiava il valore
del materiale di oltre 13 volte, mentre la Denuncia restava corretta.
Corretto; nuovo banco browser dedicato con controprova.

## Verifica
Giro completo (senza emulatori) su worktree isolata: **41/41, 0 caduti**.
KPI invariato a 3153 (fix in pagina, non in modulo). 9-suite sum invariato
a **3.649**. Asserzioni totali del giro: **4152**.

## Lezione di metodo (nuova)
Scrivendo il banco browser, lanciarlo a mano SENZA impostare `DW_RADICE`
lo fa servire dall'albero PRINCIPALE (default del banco), non dalla
worktree isolata dove vive il fix — il banco sembrava dire che il difetto
non era corretto, mentre lo era. Comando corretto per verificare un banco
a mano contro una worktree: `DW_RADICE=<worktree> node
apps/deepwork-id/tests/browser/<banco>.mjs`. Vedi il checkpoint precedente
per il dettaglio.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Flotta — csvGiriMacchina scriveva le ore col punto inglese**
   (`/tmp/wt-flotta-csvgiri`, già ricreata dall'HEAD corrente, fix e test
   verificati con `run-kpi.mjs` + controprova, 3153/0). **Manca il giro
   completo** su questa worktree.
2. La trappola del focus nella modale (`shared/dw-app-ui.js`) — non ancora
   iniziata.
3. Conti — listener accumulato su `#modal-foot` — non ancora affrontato.
4. Nuovi agenti di deep-pass QA da lanciare per mantenere ≥3 cantieri
   paralleli.

## Prossimo passo atomico
Lanciare `node apps/deepwork-id/tests/giro-node.mjs` (da solo) su
`/tmp/wt-flotta-csvgiri`, propagare i numeri se serve, commit+push+
checkpoint. Poi dispatchare 2 nuovi agenti QA in background su superfici
non ancora battute con un angolo fresco in questa sessione (es. Scudo o
Conti con un angolo diverso da quelli già chiusi, o Genesi). Poi la
trappola del focus e il listener di Conti. Continuare "mai fermarsi".

## Blocchi
Nessuno.

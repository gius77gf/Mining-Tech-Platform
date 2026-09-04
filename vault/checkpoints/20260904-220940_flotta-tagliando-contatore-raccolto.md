# Checkpoint — 2026-09-04T22:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c47f20bf

## Completato
- Flotta: il tagliando a ore sa su quale contatore è scritto (`scrittaIl`,
  `contatoreDelTagliando`, `urgenzaTagliando`, `propostaRiscrittura`,
  bottone «Riscrivi sul contatore nuovo» nell'ordine). Raccolto dalla patch
  del cantiere morto due volte per i crediti: applicata su una copia,
  provata in scratchpad, 13 prove nuove con tre controprove, banco
  `flotta-contatore` 42 → 72/0 con terza iniezione, giro node 38/0.
- Due difetti che la patch aveva e che si sono visti solo misurando: il
  bottone senza gestore, l'icona gigante nel riquadro a 320 px.
- Documenti: prove 3.056, asserzioni 3.483, copertura 805/805; roadmap,
  ricerca Flotta (coda della (b) chiusa), LEGGIMI dei cantieri sospesi; la
  patch di Flotta tolta.

## Prossimo passo atomico
La stessa cosa per Sentinella: `git worktree add` da HEAD, `git apply
vault/cantieri-sospesi/20260904-sentinella-lettura-colonne.patch`, leggere
il diff (mappa colonne in `preparaLetture`: PPV per asse, risultante,
frequenza, sovrapressione), provare in scratchpad le funzioni nuove, scrivere
le prove in `run-kpi.mjs` PRIMA del riepilogo (sincrone), controprova col
difetto rimesso, banco sulla pagina a 320/390 con scatti GUARDATI (l'icona
gigante di Flotta si è vista solo così), giro node sulla copia, numeri dei
documenti, commit, patch tolta e LEGGIMI aggiornato. Poi la ricerca a
rotazione (Scudo o Terra, seconda tornata) e Genesi (a) solo con (b).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.

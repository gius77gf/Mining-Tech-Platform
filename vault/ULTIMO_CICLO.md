# Ultimo ciclo

- **Timestamp (UTC, letto da `date -u`)**: 2026-09-17T19:07:29Z
- **Commit di partenza**: decf1c9c (fix(core): nome cliente hardcoded su ogni PDF, e numeri in notazione inglese sulle schede mezzo)
- **Ripresa da**: vault/checkpoints/20260917-182641_conti-scudo-sentinella-chiusi.md
- **Cosa sto per fare**: sto chiudendo il secondo round della passata in
  profondità (dopo Conti/Scudo/Sentinella, ora Genesi e il core). Già chiusi
  in questo blocco: nome cliente hardcoded ("Cofa Mineraria") su cinque PDF
  del core più la formattazione numerica delle schede mezzo (committati); un
  difetto reale su Genesi — l'import di un `.volata.json` leggeva la
  geometria del file (spalla/interasse/diametro) e non la scriveva mai,
  lasciando la maglia precedente in memoria — è corretto, verificato dal
  vivo (due repro indipendenti) e in fase di verifica finale sulla worktree
  isolata (`node apps/deepwork-id/tests/giro-node.mjs` in corso). Appena
  verde: commit, checkpoint, push, poi si prosegue con la roadmap (§1/§6 di
  `docs/MAPPA_ECOSISTEMA.md` per una sovrapposizione nuova, o la passata in
  profondità sulle app restanti).

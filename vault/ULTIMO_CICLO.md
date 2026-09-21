# Ultimo ciclo

- **Quando**: 2026-09-21T03:51:56Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 3ee7d87a (canarino: ciclo automatico vivo, 2026-09-21T03:48:16Z)
- **Cosa sto per fare**: audit del calcolo economico (`costoVolata`,
  margine): già consolidato in un punto unico, null-vs-zero corretto su
  ogni addendo, i 4 punti che lo chiamano hanno un `nf` diverso per
  ragioni già documentate e incrociate. Verificato dal vivo: la scheda
  mostra "Totale volata €2.412" e "Margine €11.426 (€13.838 ricavo)" —
  l'aritmetica torna esattamente sullo schermo vero. Nessun difetto
  trovato. Checkpoint:
  `vault/checkpoints/20260921-035156_genesi-audit-costoVolata-margine.md`.
  Con questa, ~9 aree core di Genesi controllate di fila senza trovare
  nulla: il rendimento dell'audit manuale a caso è sceso molto.
- **Prossimo passo atomico**: cambiare metodo — (a) leggere per intero
  UNI 9916/ISEE guidelines invece dei soli riassunti WebSearch, o (b)
  verificare se `tests/simulatore/cava-sintetica.mjs` copre Genesi e
  usarlo per uno stress-test su tanti casi invece di scelti a mano.

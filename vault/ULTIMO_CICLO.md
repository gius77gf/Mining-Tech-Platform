# Ultimo ciclo

- **Quando**: 2026-09-21T09:59:24Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 0830700f (docs(genesi): PIANO_3D.md riflette
  lo stato vero, verificato sul codice)
- **Cosa sto per fare**: trovato un secondo buco di copertura reale
  (import del piano di innesco XML, `btn-innesco-xml-in`/`fileXmlIn`):
  nessun banco lo copriva, e il codice racconta un difetto vero già
  corretto a mano il 07/08 (l'innesco tornava sempre "Nonel" dopo un
  reimport). Scritto `apps/deepwork-id/tests/browser/genesi-innesco-
  xml-roundtrip.mjs`, verificato 6/0 e controprova corretta. Riletto
  `docs/GENESI_ROADMAP_COMPETITOR.md` per intero: già a posto, nessuna
  correzione necessaria. Propagato 455 esecuzioni/207 file/4283
  asserzioni nei documenti tracciati. Checkpoint:
  `vault/checkpoints/20260921-095924_genesi-banco-innesco-xml-roundtrip.md`.
- **Prossimo passo atomico**: verificare l'esito del `giro-node.mjs`
  lanciato in background (task bs48njy5t), poi continuare a cercare
  bottoni di export/import Genesi senza banco con lo stesso metodo.
  Mandato del fondatore invariato: solo Genesi, massimo sforzo.

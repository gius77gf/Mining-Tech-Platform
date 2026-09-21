# Ultimo ciclo

- **Quando**: 2026-09-21T10:47:08Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 7169086a (chore(vault): bilancio del blocco,
  giro-node pulito (41/41, 0 caduti, 4284 asserzioni))
- **Cosa sto per fare**: scritto un nuovo banco browser su Genesi per la
  timeline dello sparo (`#play`/`#track`/`[data-spd]`, zero copertura
  prima), 13/0, senza `DIFETTI`/`--controprova` (nessun bug storico da
  riprodurre, scelta dichiarata nel file). Controllato anche
  qualità/look: non sono controlli utente reali, nessun banco da
  scrivere lì. Propagati banchi 455→456, file distinti 207→208,
  asserzioni 4284→4285 nei quattro documenti tracciati. Checkpoint:
  `vault/checkpoints/20260921-104708_genesi-banco-timeline-play-scrub.md`.
  Stato misurato: giro-node.mjs 41/41, 0 caduti, 4285 asserzioni,
  documenti coerenti.
- **Prossimo passo atomico**: col metodo "bottoni/funzioni senza banco"
  esaurito su design 2D/export/timeline, guardare i livelli/layer del
  pannello 3D (`lMuck`/`lFly`/`lXray`/`lQuote`/`lAudio`, `xrOp`) per un
  difetto di RENDERING, oppure un secondo passaggio su
  `docs/GENESI_ROADMAP_COMPETITOR.md`/`docs/RICERCA_CONTINUA_GENESI.md`.
  Mandato del fondatore invariato: solo Genesi, massimo sforzo.

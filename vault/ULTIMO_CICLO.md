# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T11:48:16Z
- **Commit di partenza**: d0deb7e9
- **Cosa sto per fare**: tre unità dai deep-pass QA di questo blocco sono già
  scritte e verificate in worktree isolate, in attesa solo del giro pulito
  finale prima di commit+push: Conti (apertoDi non propagato a
  prioritaIncasso/agingIncassi/incassoPerMese/kpiFrom, /tmp/wt-conti-apertodi),
  accessibilità toast (Genesi CSS err/success/warn, role/aria-live su
  core/Genesi/admin, /tmp/wt-toast-a11y), Campo (CLASSE_HSE senza la chiave
  "senza-scadenze", /tmp/wt-campo-hse). Appena arrivato un quarto difetto
  verificato da un agente su Sentinella: `misureDelGiornoPerReclamo` calcola
  il punto "peggiore" su TUTTI i punti della stessa grandezza invece di dare
  priorità al punto del ricettore del reclamo — la lettera di risposta può
  concludere "sotto soglia" basandosi su uno strumento diverso, con un'altra
  soglia, mentre quello del ricettore non ha letture quel giorno. Da
  implementare in una nuova worktree. Dopo: la trappola del focus nella
  modale (shared/dw-app-ui.js, unità a parte, più rischiosa) e il listener
  accumulato su #modal-foot in Conti.

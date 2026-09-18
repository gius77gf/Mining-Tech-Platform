# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T11:43:17Z
- **Commit di partenza**: ea307d32
- **Cosa sto per fare**: chiudere in unità separate i difetti trovati dai
  deep-pass QA lanciati in questa sessione (quarto giro su Scudo — già
  chiuso in ea307d32 — e un nuovo giro su Conti). In corso: Conti (quattro
  funzioni — prioritaIncasso, agingIncassi, incassoPerMese, kpiFrom — che
  non escludevano una fattura stornata per intero da nota di credito dal
  conteggio urgenza/rischio), fix già scritto e verificato in worktree
  isolata (/tmp/wt-conti-apertodi), in attesa di un giro pulito senza
  contesa di CPU per scrivere il numero vero di asserzioni nei documenti
  prima di committare. In parallelo: accessibilità toast (Genesi CSS
  err/success/warn assente, role="status" aria-live="polite" mancante su
  core/Genesi/admin), fix scritto e verificato in worktree isolata
  (/tmp/wt-toast-a11y), giro in corso. Due agenti di deep-pass QA in
  background su Sentinella e Campo (angolo nuovo), per mantenere ≥3
  cantieri paralleli. Dopo: la trappola del focus nella modale
  (shared/dw-app-ui.js, tocca tutte le 8 superfici — unità a parte, più
  rischiosa) e il listener accumulato su #modal-foot in Conti.

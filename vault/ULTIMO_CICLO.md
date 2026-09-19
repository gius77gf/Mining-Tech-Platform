# Ultimo ciclo

- **Quando**: 2026-09-19T16:48:49Z (letta da `date -u`, non predetta)
- **Commit di partenza**: aa61fc18 (chore(genesi): checkpoint verifica
  diretta export CSV/DXF/XML — zero difetti)
- **Cosa sto per fare**: dalla verifica diretta sugli export di Genesi
  (drag+Canc su un foro, poi CSV/DXF/XML), ho trovato un difetto vero
  (G56c): `relief=null` in `reliefSuMaglia` nascondeva due cause diverse
  dietro lo stesso messaggio tranquillo «primo della sua zona» — il vero
  primo foro e un vicino già sparato ma oltre la distanza di adiacenza
  (un foro mancante nella maglia). Corretto in tre superfici (ispettore,
  pallino sulla pianta, riepilogo del Validatore), con test nuovi in
  run-kpi.mjs e verifica visiva diretta prima/dopo. En passant: trovato e
  corretto un mio stesso checkpoint datato 2 minuti avanti (quinta volta
  della stessa causa, aggiunta a SCUSATI in date-checkpoint.mjs) e due
  numeri invecchiati nei documenti (asserzioni del giro completo, 4263→
  4265). Giro `node` completo lanciato DUE VOLTE sullo stato finale:
  41/41 comandi a posto, 0 caduti. Checkpoint:
  `vault/checkpoints/20260919-164849_genesi-g56c-relief-fuori-fascia.md`.
  **Prossimo passo atomico**: investigare il KO pre-esistente (non mio,
  verificato con `git stash` che c'è già su HEAD) in
  `apps/deepwork-id/tests/browser/genesi-frasi-limite.mjs` — «il CSV che
  esce dall'azienda ha la colonna della base» — leggendo
  `_riconRiassuntoCampo`/`csvRiconciliazione` in genesi-data.js prima di
  decidere se il difetto è nel prodotto o nel banco invecchiato.

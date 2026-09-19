# Ultimo ciclo

- **Quando**: 2026-09-19T17:33:03Z (letta da `date -u`, non predetta)
- **Commit di partenza**: e0de3d46 (fix(test): genesi-frasi-limite,
  l'asserzione sulla colonna della base era invecchiata)
- **Cosa sto per fare**: seguendo il mio stesso prossimo-passo del
  checkpoint G56c, ho controllato `innescoSuMaglia` per lo stesso
  difetto (vicino più vicino entro una distanza massima) e l'ho trovato:
  `innFrom=-1` diceva sia "primo della volata" sia "nessun raccordo
  raggiunge questo foro" — stessa causa di G56c, in un posto più
  pericoloso (un foro senza raccordo non si accende). Corretto con
  `h.innFuoriFascia` e il riepilogo "Rete di innesco" del Validatore
  aggiornato per contarlo a parte. Verificato dal vivo con Playwright
  (prima/dopo) e con un nuovo test in run-kpi.mjs. Giro `node` completo
  lanciato DUE VOLTE: 41/41, 0 caduti, asserzioni 4266 (propagate nei 4
  documenti). `tutti.mjs --solo=genesi` lanciato ma non ancora concluso
  al momento del commit (contenitore sotto carico) — la modifica non
  tocca disegno/canvas, solo dati e Validatore, verificata a mano.
  Checkpoint:
  `vault/checkpoints/20260919-173303_genesi-g56d-innesco-fuori-fascia.md`.
  **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` al prossimo ciclo (se mostra KO nuovi non attesi,
  investigare prima di procedere); valutare se `energiaSuMaglia`
  condivide la stessa forma di difetto (probabilmente no — non usa un
  predecessore nel tempo — da confermare leggendo il codice prima di
  spendere una verifica dal vivo).

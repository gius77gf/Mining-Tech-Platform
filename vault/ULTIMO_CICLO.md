# Ultimo ciclo

- **Quando**: 2026-09-19T19:20:29Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 97e45f76 (feat(genesi): G57, ruota tratti
  attorno al loro centroide comune)
- **Cosa sto per fare**: implementata la terza trasformazione CAD —
  G58, "Scala tratti" (`trattiScalati`), per il caso reale di un
  rilievo DXF disegnato in millimetri (Genesi lavora sempre in metri).
  Due difetti trovati e corretti PRIMA del commit, con la verifica dal
  vivo: (1) la prima stesura copiava il pivot-al-centroide di G57, ma
  un errore di unità sbaglia anche il centroide — misurato con
  Playwright che un DXF a 10.000 mm scalato di 0,001 restava a ~7500
  invece di ~10; corretto a scala-dall'origine; (2) il valore di
  default (0,001) faceva scattare l'euristica "migliaia o decimale?"
  di `gvv`, che tornava NaN sul valore di default del bottone stesso —
  corretto leggendo con `numIt` (anche per l'angolo di G57, stessa
  vulnerabilità). 7 test nuovi in run-kpi.mjs (3227/0). Giro node
  completo 41/41, asserzioni 4279 (corretto anche un placeholder
  lasciato per errore in STATO_PRODOTTO.md che rendeva quel documento
  invisibile al controllo numeri-nei-documenti.mjs). tutti.mjs
  --solo=genesi lanciato ma non concluso al momento del commit —
  verificato a mano più a fondo del batch generico. Checkpoint:
  `vault/checkpoints/20260919-192029_genesi-g58-scala-tratti.md`.
  **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` al prossimo ciclo; poi valutare se «Blocchi/simboli
  riusabili» (ultima trasformazione CAD del censimento) ha un caso
  d'uso reale prima di costruirlo.

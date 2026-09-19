# Ultimo ciclo

- **Quando**: 2026-09-19T17:01:09Z (letta da `date -u`, non predetta)
- **Commit di partenza**: b6ba5215 (fix(genesi): G56c, relief=null
  distingue primo della zona da vicino fuori distanza di adiacenza)
- **Cosa sto per fare**: chiuso il KO pre-esistente in
  `genesi-frasi-limite.mjs` («il CSV che esce dall'azienda ha la colonna
  della base») — non era un difetto del prodotto: l'asserzione
  pretendeva `ppv_prev_base` come ultima colonna, ma `campo_misfire`
  (G52) si è aggiunta dopo di lei per la convenzione append-only già
  dichiarata nel modulo. Corretta l'asserzione per verificare
  l'esistenza della colonna, non la sua posizione. Verificato che il
  banco sappia ancora fallire (`--controprova` invariata). Giro `node`
  completo 41/41, 0 caduti. Checkpoint:
  `vault/checkpoints/20260919-170109_genesi-frasi-limite-colonna-base.md`.
  **Prossimo passo atomico**: continuare la verifica diretta con
  scenari asimmetrici (foro tolto) su altre funzioni foro-per-foro di
  Genesi con la stessa forma di `reliefSuMaglia` prima di G56c —
  `innescoSuMaglia` e `energiaSuMaglia` — per vedere se condividono lo
  stesso difetto (null per due cause diverse dietro lo stesso messaggio).

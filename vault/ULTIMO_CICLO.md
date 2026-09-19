# Ultimo ciclo

- **Quando**: 2026-09-19T17:43:55Z (letta da `date -u`, non predetta)
- **Commit di partenza**: e932501c (fix(genesi): G56d, innFrom=-1
  distingue primo della volata da foro senza raccordo)
- **Cosa sto per fare**: seconda iterazione su G56d — il foro senza
  raccordo era corretto nei dati e nel Validatore ma invisibile sulla
  pianta (`drawInnesco2D` disegna solo le linee, mai l'assenza di una
  linea). Aggiunto un anello rosso pieno, sempre acceso col livello
  Innesco attivo, attorno a ogni foro `innFuoriFascia`. Verificato con
  uno screenshot Playwright reale (maglia con due fori tolti, l'anello
  appare esattamente sul foro isolato). Giro `node` completo 41/41, 0
  caduti. Il batch browser Genesi (lanciato sul commit precedente) è
  tornato pulito: 74 a posto, 21 da guardare, nessun KO nuovo.
  Checkpoint: `vault/checkpoints/20260919-174355_genesi-g56d-anello-canvas.md`.
  **Prossimo passo atomico**: `energiaSuMaglia` letta e confermata NON
  condividere il difetto di G56c/G56d (geometria locale per fila, non
  un vicino-più-vicino-nel-tempo) — pista chiusa. Cercare il prossimo
  filone su Genesi: seconda iterazione di un'altra funzione già
  consegnata, oppure una nuova verifica diretta su un'area non ancora
  toccata (burden vero/`distanzaDaSpezzata`, pannello 3D raggi-X).

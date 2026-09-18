# Ultimo ciclo

- **Timestamp (UTC, da `date -u`)**: 2026-09-18T21:46:05Z
- **Commit di partenza**: 128b2375
- **Cosa sto per fare**: chiuso il terzo giro di deep-pass QA (Sentinella,
  Conti, Deepwork ID) più un'unità di ricerca continua su Campo — vedi
  vault/checkpoints/20260918-214605_terzo-giro-qa-e-ricerca-chiuso.md e
  la sezione dedicata in vault/ROADMAP_SETTIMANA.md. Backlog QA noto
  esaurito su tutte e sei le app più Deepwork ID.
  ⚠️ Il giro completo di convergenza (worktree `/tmp/wt-final-block2`,
  PID 688, partito alle 20:01:20Z su commit c50d652d) è ancora vivo
  quasi due ore dopo: il ramo è avanzato di **10 commit** sulle
  superfici misurate. Le sue verifiche VISIVE (contrasto, fuori-schermo)
  restano valide — nessun fix di oggi ha toccato CSS/layout, solo
  guardie JS sui bottoni — ma i suoi numeri di convergenza documenti NON
  vanno propagati senza rilanciare `numeri-nei-documenti.mjs` fresco
  sull'HEAD vero.
  Prossimo passo atomico: quando il giro arriva in fondo (o va spento
  per età), rilanciare `numeri-nei-documenti.mjs` sull'HEAD corrente e
  propagare solo quei numeri; poi aprire un nuovo giro di ricerca
  continua o deep-pass QA a rotazione (Genesi/Campo hanno avuto solo
  passate leggere oggi; Conti e Deepwork ID non hanno ancora avuto una
  ricerca continua). Se il backlog resta esaurito, proseguire con la
  lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md.

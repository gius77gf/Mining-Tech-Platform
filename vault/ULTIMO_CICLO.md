# Ultimo ciclo

- **Quando**: 2026-09-18T23:59:33Z (letta da `date -u`, non predetta)
- **Commit di partenza**: a75b7df8 (chore(vault): checkpoint e roadmap — settimo giro, KO stantio Terra chiuso)
- **Cosa sto per fare**: quattro cantieri in parallelo appena dispatchati
  (direttiva 26/07, ≥3 cantieri): QA deep-pass su Deepwork ID (mai avuto
  un giro dedicato oggi), seconda QA su Sentinella (area diversa dal fix
  già chiuso oggi su `superamentiAperti`/`kpiFrom`), seconda QA su Campo
  (area diversa dal fix già chiuso oggi su `vociChecklistSalvata`), e
  ricerca continua su Scudo (scadenze formazione/idoneità vs best
  practice EHS). In attesa dei loro report per verificare-e-implementare.
  Nel frattempo, il giro di convergenza lungo (PID 688, partito
  20:01:20Z su commit c50d652d) è ancora vivo: il branch è avanzato di
  21+ commit sulle superfici misurate. L'unico KO vero che aveva
  segnalato finora (Terra, sequenza del progetto) è stato riverificato
  contro il codice attuale e chiuso: era un refuso della regola di test
  (`il 80%` invece di `l'80%`), non un difetto di prodotto (`0e2a18a6`).
  **Prossimo passo atomico**: quando i quattro agenti riportano,
  verificare ogni finding contro il codice attuale prima di
  implementare (niente entra sulla parola dell'agente), correggere,
  testare, committare app per app, checkpoint e roadmap aggiornati.
  Se il giro lungo arriva in fondo o va giudicato troppo vecchio,
  rilanciare `numeri-nei-documenti.mjs` fresco sull'HEAD corrente prima
  di propagare qualunque numero. Se il backlog resta esaurito dopo
  questo giro, proseguire con la lista "SE LA ROADMAP SEMBRA FINITA" di
  CLAUDE.md (nuova sovrapposizione in docs/MAPPA_ECOSISTEMA.md, seconda
  iterazione UX/estetica con screenshot, ecc.).

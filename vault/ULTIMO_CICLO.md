# Ultimo ciclo

- **Quando**: 2026-09-19T03:50:43Z (letta da `date -u`, non predetta)
- **Commit di partenza**: fdff0d3b (chore: checkpoint tredicesimo giro — Sentinella, Flotta, Conti)
- **Cosa sto per fare**: tre cantieri appena dispatchati in parallelo
  (direttiva 26/07): QA su Campo (checklist di sicurezza pre-attività,
  collegamento attività→documenti che escono), ricerca continua su Scudo
  (ciclo di vita delle azioni correttive: verifica di efficacia, escalation
  su scadenza — angolo diverso dalla decisione 40/formazione già trovate
  oggi), e seconda iterazione UX/estetica su Sentinella (mai iterata
  visivamente in questa sessione). In attesa dei loro report per
  verificare-e-implementare. In parallelo gira in background il giro
  completo del browser (`tutti.mjs`) su una worktree del commit `aade8904`.
  **Prossimo passo atomico**: verificare ogni finding contro il codice
  attuale prima di implementare (niente entra sulla parola dell'agente),
  correggere, testare, committare app per app, checkpoint e roadmap
  aggiornati. Leggere l'esito del giro completo del browser quando finisce
  (`leggi-giro.mjs`, log in scratchpad `giro-completo-19-0316.log`),
  guardando prima la sezione 0 (di quanti commit il branch è avanzato
  rispetto al commit misurato) prima di fidarsi di eventuali KO. Se il
  backlog resta esaurito dopo questo giro, proseguire con la lista "SE LA
  ROADMAP SEMBRA FINITA" di CLAUDE.md.

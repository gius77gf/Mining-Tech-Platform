# Ultimo ciclo

- **Quando**: 2026-09-19T07:16:28Z (letta da `date -u`, non predetta)
- **Commit di partenza**: verrà creato al prossimo commit (checkpoint +
  nota roadmap non ancora committati al momento di scrivere questo file)
- **Cosa sto per fare**: chiuso il secondo blocco di cantieri Genesi (QA +
  ricerca). Prossimo: verificare riga per riga la ricerca appena aggiunta
  a docs/RICERCA_GENESI_CAD.md, poi implementare la selezione multipla
  (window/crossing) come prossima unità CAD.
  **Prossimo passo atomico**: aprire `apps/genesi/genesi.html` e
  `apps/genesi/genesi-data.js`, verificare la sezione "SELEZIONE
  MULTIPLA" della ricerca contro `d2Down`/`D2.sel`/`D2.holes`, e
  implementare una prima fetta piccola (es. selezione a rettangolo sui
  soli fori, con solo "elimina i selezionati" come prima azione batch,
  prima di pensare a rotate/scale/mirror). Aprire in parallelo un
  secondo fronte (input relativo/polare, isolato e ben scoperto).

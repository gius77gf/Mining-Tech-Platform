# Ultimo ciclo

- **Quando**: 2026-09-19T16:01:45Z (letta da `date -u`, non predetta)
- **Commit di partenza**: 0736043b (canarino: giro completo troncato e
  stale, passo a verifiche dirette sugli export di Genesi)
- **Cosa sto per fare**: ho premuto io stesso (Playwright, server locale
  con contrassegno pid, chiuso a fine verifica) i tre bottoni di export di
  Genesi non ancora ispezionati con gli occhi — CSV Piano di carico, DXF
  Piano fori, XML innesco — su una maglia di default, una a tre file e con
  un tentativo di svuotare la carica di progetto. Zero difetti trovati:
  i file sono coerenti fra loro e col toast, nessuna cella `null`/`NaN`,
  e il tentativo di rendere illeggibile la carica ha solo confermato che
  `guardiaVuoto` (genesi.html:7982) impedisce al campo di restare vuoto —
  una difesa che regge, non un buco. Checkpoint scritto:
  `vault/checkpoints/20260919-160145_verifica-diretta-export-genesi.md`.
  **Prossimo passo atomico**: ripetere la stessa verifica diretta su uno
  scenario ASIMMETRICO — rimuovere 2-3 fori a mano dal Progetto 2D (drag +
  Canc o Ctrl+Z parziale) e riesportare CSV/DXF/XML, cercando buchi negli
  id_foro o ritardi non ricalcolati sui fori rimasti. In alternativa,
  proseguire con una seconda iterazione di costruzione su una funzione
  Genesi già consegnata (mandato "solo Genesi" del fondatore resta attivo).

# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f681845c

## Completato
Unità 94 — ricerca a rotazione, secondo giro, Campo: «il sorvegliante di
turno e la visita dei fronti». Metà sul mondo (D.P.R. 128, registro MSHA
56.18002, gestionali), delta dal meccanismo contro `df41a83c` con i comandi
rilanciati. Una voce aperta in due pezzi piccoli (il nome di chi ha
controllato i fronti, proposto dal sorvegliante nominato in Scudo; il
ricontrollo dopo il maltempo, solo col meteo avverso), una dichiarata
(«tutti usciti», sotterraneo), tre a posto. Solo documenti.

## Imparato
- Il registro del mondo comincia dal NOME di chi ha guardato, e la nostra
  lista di controllo ha data, turno, squadra, ora e nessun chi: un controllo
  senza autore è una spunta. Il sorvegliante per turno è nominato in Scudo,
  quindi il pezzo che manca è un ponte, non un campo di testo.
- «Dopo la volata» in Campo dà zero ed è giusto: il ricontrollo vive dove si
  registra la volata (Sentinella, unità 82). Un «non c'è» va cercato anche
  nelle app vicine prima di dichiararlo.

## Prossimo passo atomico
Unità 95, Campo, la voce aperta: (1) `chiusaDa` nella collezione `checklist`
(`db.aggiungi("checklist", {…})` e l'aggiornamento per voce nella pagina), il
nome proposto dal sorvegliante nominato in Scudo letto col ponte già usato
per i documenti dei lavoratori (`nominaAttiva`/`NOMINE_RUOLI` chiave
`sorvegliante` — verificare come Campo legge Scudo oggi, `ponteScudo`), campo
di testo a mano se non c'è, stampato in `rapportoGiornata` e in
`testoConsegnaTurno` accanto all'ora; (2) voce condizionale di ricontrollo
in `CHECKLIST_INIZIO` o accanto (`vociChecklist(turno)` che aggiunge «Fronti
e cigli ricontrollati dopo la pioggia forte o il disgelo» quando il meteo del
turno è in `METEO_AVVERSO`), `statoChecklist` che la conta, prove in
`run-kpi` (prima in scratchpad), screenshot a 430 px. Poi leggere il giro
del browser su `faf5e271` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.

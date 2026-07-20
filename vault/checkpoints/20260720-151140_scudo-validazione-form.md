# Checkpoint — 2026-07-20T15:11:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
49d7f51

## Completato
Scudo: feedback di validazione sui due form che finora ignoravano in
silenzio l'invio a campi vuoti (erano gli ULTIMI dell'ecosistema senza
feedback, verificato con censimento di tutti i btn-* delle 6 app):
- btn-add-pers: bordo rosso su #new-nome + "Serve il nome del
  lavoratore." in #import-esito; conferma su successo.
- btn-add-scad: bordo rosso su descrizione/data mancanti + "Servono la
  descrizione e la data di scadenza." in nuovo #scad-esito; conferma su
  successo.
Sintassi OK. Playwright: ALL PASS (vuoto→rosso+messaggio, pieno→
bordo pulito+conferma "Mario Rossi").

## Stato roadmap
Seconda iterazione UX ora copre: tap-KPI (tutte le app), stati vuoti
(tutte le liste), validazione form con feedback (tutti i form). PR in
corso.

## Prossimo passo atomico
Merge PR scudo-validazione (dopo CI verde), riparti branch da main.
Prossimo candidato seconda-iterazione: ordinamento coerente delle liste.
Verificare che ogni lista principale abbia un ordinamento sensato e
stabile (per data/urgenza/stato) invece dell'ordine di inserimento.
Candidati da ispezionare: liste che fanno .map senza .sort a monte
(es. squ-list, gar-list già ordinate?; cos-list costi per data?).
Scegliere UNA lista senza ordinamento utile, aggiungere .sort,
verificare con Playwright, commit+checkpoint+PR.

## Blocchi
Nessuno.

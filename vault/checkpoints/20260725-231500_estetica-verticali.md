# Checkpoint — 2026-07-25T23:15:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — estetica Deepwork sulle verticali,
prima passata strutturale)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
Le firme visive del core Deepwork (estratte da index.html: ombre dei tile,
sollevamento al passaggio, scivolamento delle righe elenco, gloss e
pressione fisica dei bottoni, anello di fuoco sugli input, barra-indicatore
della navigazione) sono state portate nei DUE fogli condivisi, quindi valgono
per TUTTE e 6 le app insieme:
- `shared/deepwork-style.css`: .dw-btn con ombra calda + hover + :active
  (firma .btn-main del core), .dw-input:focus con anello sull'accento
  dell'app (firma .finput:focus), .dw-card con ombra e transizione.
- `shared/dw-app-shell.css`: header con profondità, KPI = tile del core
  (ombra, hover -3px, bordo acceso sull'accento), righe .item = .sitem del
  core (ombra, translateX(3px) al passaggio), voce di navigazione attiva con
  barra-indicatore sfumata nel colore dell'app.
- **Fix colore**: il banner tour era VIOLA FISSO (colore di Scudo) su tutte
  le app → ora usa l'accento dell'app (color-mix).
- **Sentinella riconoscibile**: accento da grigio "sistema" a **blu ambiente**
  (#1971c2/#74c0fc) — tema, manifest e icona PWA aggiornati. Ora: Campo
  arancio, Conti teal, Flotta azzurro-acciaio, Scudo viola, Sentinella blu,
  Terra verde (come chiesto).
Verificato: 6/6 app caricate senza errori, screenshot per ognuna.

## Nota onesta
Questa è la prima passata (le firme di interazione e profondità). Il
"100%" del core comprende anche struttura topbar/avatari/tab interni: si
porta avanti app per app insieme alla differenziazione funzionale (Scudo
per primo), senza stravolgere l'HTML di tutte in un colpo solo.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Scudo (differenziazione, richiesta esplicita): ricerca normativa D.Lgs
81/08 (documenti obbligatori: POS, DVR, consegna DPI, sorveglianza
sanitaria) → poi anagrafica cantieri + allegati documentali (foto/scansioni
in localStorage/IndexedDB o predisposti per storage live) legati a
cantiere/lavoratore.

# Checkpoint — 2026-07-25T22:30:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — G1 home centro di comando)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
La home di Genesi non è più «spoglia»: sotto le card 2D/3D ora c'è la
griglia del centro di comando, nello stesso linguaggio visivo dell'app:
1. **🗂 Le tue volate** — storico locale (max 50): salva la volata attuale
   (anche dal 2D col bottone «Salva nello storico»), Apri (ricarica il
   progetto completo nel 2D), Duplica, Elimina; sintesi per voce (fori, kg,
   X50) e contatore.
2. **🛸 Drone & rilievi 3D** — storico delle lavorazioni del visore nuvola
   (nome file, punti, volume stimato, data): il visore ora registra ogni
   caricamento e aggiorna il volume del ritaglio; link diretto al visore.
3. **🔗 Ponte Deepwork** — import/export della volata in `.volata.json`
   (formato già compatibile col core) + apertura di Deepwork. Collegamento
   nei due sensi via file: il ponte LIVE via Firestore arriverà col login
   reale (Deepwork ID), dichiarato onestamente.
Home ora scorrevole; stato salvato in localStorage con escape XSS (_rEsc)
su ogni testo. Verificato in browser: salva → 1 in lista, Apri → 2D col
progetto, storico drone visibile, zero errori JS. Screenshot salvati.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Verticali (direttiva 25/07): copiare al 100% l'estetica del core Deepwork
su shared/deepwork-style.css + dw-app-shell.css, colori personalizzati per
app (Terra verde, ecc.); iniziare mostrando una app (Scudo) per conferma
visiva, poi propagare. In parallelo: ricerca normativa D.Lgs 81/08 per il
nuovo Scudo (dipendenti/cantieri/documenti).

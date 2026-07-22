# Checkpoint — 2026-07-22T08:30:00Z

## Tipo
unit-complete (Genesi — report volata stampabile/PDF, gap vs competitor #2/3)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi report stampabile)

## Completato
Seconda lacuna fattibile in browser dal confronto competitor: **report volata
formattato e stampabile** (→ PDF con la stampa del browser). Ce l'hanno tutti
(es. Austin "Global Blast Report"); Genesi aveva solo export CSV/XML grezzi.
- `apps/genesi/genesi.html`:
  - Bottone "🖨 Report volata (stampa / PDF)" nel Progetto 2D.
  - Handler: raccoglie geometria, carica & sequenza, roccia, previsioni
    (frammentazione x20/x50/x80, PPV/limite+normativa, flyrock, sgomberi 2×/4×)
    e stima economica (dai prezzi utente), apre una finestra con un documento
    HTML pulito e chiama la stampa (→ Salva come PDF).
  - ONESTÀ: sezione previsioni etichettata "(PREVISTO — non misura)" + disclaimer
    a piè di pagina (modelli empirici Kuz-Ram/Swebrec/scaled-distance = stime da
    verificare sul campo; economia = ordine di grandezza).
  - Testo utente escapato (`_rEsc`); i valori sono numeri/etichette da catalogo.

Verifica: syntax CI OK; Playwright — il click apre la finestra report, 5 sezioni
presenti (Geometria/Carica/Roccia/Previsioni/Stima economica), niente errori;
screenshot: layout pulito e professionale. Corretto un bug visto nello
screenshot (tag `<b>` letterali nell'etichetta "Costo totale" → l'etichetta è
escapata: rimosso il markup, il valore resta in grassetto).

## Prossimo passo atomico
Terza e ultima lacuna fattibile: **decking** (cariche multiple nello stesso foro
separate da borraggio/aria) — più complessa (tocca il modello carica/colonna e
la vista raggi-X 3D). Da fare con cautela e onestà.

## Blocchi
Funzioni ⛔ della matrice: hardware/backend/dati/ML → non in browser, documentate.
#321 unico branch.

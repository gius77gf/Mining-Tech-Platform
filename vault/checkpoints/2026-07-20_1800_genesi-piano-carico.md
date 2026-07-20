# Checkpoint — 2026-07-20 — Piano di carico CSV da Genesi (parte 1/2)

## Task completato
Ponte Genesi↔Campo, parte 1: pulsante "Esporta piano di carico (CSV
per il fochino)" sotto la Scheda volata del Progetto 2D. Colonne:
foro;x_m;fila_m;prof_m;carica_prog_kg;borraggio_prog_m;ritardo_ms,
fori ordinati per tempo di sparo. Verificato con download reale
(18 fori demo). Zero errori console.

## Prossimo passo atomico — parte 2/2 in Campo
In apps/campo: nuova sezione "Piano di carico" (nuovo tab o dentro
Rapportini): import del CSV genesi_piano_carico.csv (stesso parsing
robusto dell'import CSV di Scudo: split ;, salto header), lista fori
con carica progettata; per ogni foro il fochino registra la carica
REALE (input kg) → badge verde se |reale-progettata| ≤10%, ambra
≤25%, rosso oltre; riepilogo scostamento totale kg e %. Dati salvati
via db.aggiungi("pianocarico", ...) nel data layer di Campo (demo in
memoria come sempre). Verifica Playwright con CSV di prova. Poi PR
verso main delle due parti. SEMPRE fino a esaurimento crediti (mai
chiudere il blocco volontariamente).

# Checkpoint — 2026-07-21 — Analisi import fori→volata (fatto)

## Task completato
Analisi di design per il rimandato M del censimento: i fori delle
volate sono in vista PIANTA, i marker della ricostruzione in vista
FRONTALE → solo la x è trasferibile direttamente. Proposta
documentata nel censimento: import come PRIMA FILA (x dal marker,
y=burden default, nota di provenienza), pattern dell'import MWD.
L'implementazione è pronta per un ciclo dedicato con contesto fresco.

## Prossimo passo atomico
Il ciclo programmato riprende da qui: candidata principale =
implementare l'import fori→volata come da proposta (core, riga
~5699 come riferimento pattern), con verifica funzionale Playwright
sull'editor volate. Al SERALE: PRIMA la revisione COMPLETA della
giornata (PR #33-#76+). MAI fermarsi volontariamente.

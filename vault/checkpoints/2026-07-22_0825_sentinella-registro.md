# Checkpoint — 2026-07-22 — Sentinella registro correggibile (fatto)

## Task completato
Seconda iterazione, app Sentinella. Due migliorie sul blocco Registri:
1. Un registro segnato "aggiornato" per errore non era correggibile
   (solo gli in-attesa erano toccabili). Ora il tocco fa un toggle
   BIDIREZIONALE in-attesa <-> aggiornato.
2. La marcatura sovrascriveva la nota originale del registro con
   "aggiornato oggi" (perdita di dato). Ora il toggle cambia SOLO lo
   stato, conservando la nota (lo stato è già nel badge).

Verifica: sintassi OK; test Playwright — "Formulari trasporto" in-attesa
-> aggiornato -> in-attesa, nota "3 in attesa di quarta copia"
CONSERVATA, nessun errore di pagina; screenshot della sezione Registri
(design system intatto).

## Commit
- 68a4b06  Sentinella: registro correggibile + nota non sovrascritta

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima 2a iterazione: Campo (verificare
correzioni/CRUD mancanti) o Terra, stesso criterio, con screenshot.
MAI fermarsi.

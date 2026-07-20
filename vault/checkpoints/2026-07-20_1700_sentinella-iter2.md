# Checkpoint — 2026-07-20 — Sentinella iterazione 2 (fatto)

## Task completato
Seconde iterazioni, app 5/6 (Sentinella): chip filtro sensori per
stato con stati vuoti, validazione form misura con feedback (BUG
FIX: il valore 0 era rifiutato in silenzio da `!valore` — ora è una
lettura valida), messaggio di successo che riporta lo stato
calcolato ("0.1 mm/s → Conforme"). Verifica Playwright: filtri
5/1/3, messaggi corretti, zero errori console.

## Prossimo passo atomico
Terra iterazione 2 (ultima app): filtro rilievi elaborati/
pianificati, conferma su sospensione fronte, stati vuoti, feedback
form nuovo rilievo (data futura → pianificato?). Poi PR cumulativa
delle 6 iterazioni verso main. Fino a esaurimento crediti.

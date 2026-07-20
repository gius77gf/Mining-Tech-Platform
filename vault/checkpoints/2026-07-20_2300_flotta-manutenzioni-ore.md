# Checkpoint — 2026-07-20 — Flotta: manutenzioni a ore motore (fatto)

## Task completato
Campo opzionale "ore previste" sulla nuova manutenzione: l'urgenza si
calcola dal contatore ore del mezzo (oltre → "SCADUTA (+N h)" rossa,
entro 50h → "tra N h" ambra) — è la pratica reale dei tagliandi in
cava. Flusso a data invariato; urgenza() tollera date mancanti; le
allerte del quadro includono le scadenze a ore (tetto 4 invariato).
Verifica: tagliando a 5900h su mezzo a 5870h → "tra 30 h". Zero
errori.

## Prossimo passo atomico
PR verso main e merge. Il prossimo ciclo programmato (06:40 UTC)
riprende da qui. Idee in coda: pagina INDICE di Genesi con le tre
righe nuove della scheda (flyrock inverso, KCO, loading rule)
documentate; terzo giro app. Al ciclo SERALE: PRIMA la revisione
completa (PR #33-#52). MAI fermarsi volontariamente.

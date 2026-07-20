# Checkpoint — 2026-07-21 — Audit robustezza errori live (fatto)

## Task completato
Completata la revisione di completezza XSS con lo scan su app e pagine
ID: risultano PULITE su tutti i contesti (elemento, textarea,
attributi) — i residui erano solo nel core, già corretti (#112).
Sweep XSS della piattaforma verificato completo.

Durante il review ho rilevato una robustezza (non un buco di
sicurezza): i gestori delle app scrivono con `await db.xxx()` senza
try/catch; in LIVE un errore Firestore fallirebbe in silenzio.
Tracciato in AUDIT_SICUREZZA.md punto 12 e in ROADMAP "In attesa del
fondatore" punto 5: il MODO di mostrare l'errore (toast/messaggio) è
una scelta di STILE, quindi va confermata dal fondatore prima di
implementarla — NON introdotta d'iniziativa (regola STILE vincolante).

## Commit
- e720def  Audit: traccia la gestione errori delle scritture live

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.

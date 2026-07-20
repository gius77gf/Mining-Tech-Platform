# Checkpoint — 2026-07-20 — Scudo: tipo scadenza nel form (fatto)

## Task completato
Incoerenza reale corretta: il form scadenze salvava sempre tipo
"Altro", quindi il KPI "corsi/formazione" non contava mai le nuove
scadenze. Aggiunto selettore tipo (Visita medica/Corso/Formazione/
DPI/Patente/Altro). Verifica Playwright: aggiunta di un "Corso" →
KPI 2→3. Zero errori.

## Stato CI
Job "Firestore rules + SDK + Functions tests (48)" VERDE in CI sulla
PR #46 — l'intera suite (26+12+10) gira anche sui runner GitHub.

## Prossimo passo atomico
PR verso main di questo fix + eventuali prossime unità nel giro
(struttura Orica Italia per il terzo passaggio ricerca; oppure terze
iterazioni altre app: Conti nota di incasso con data, Terra volumi
per fronte). Ciclo serale ~21:40: PRIMA la revisione completa della
giornata. MAI fermarsi volontariamente.

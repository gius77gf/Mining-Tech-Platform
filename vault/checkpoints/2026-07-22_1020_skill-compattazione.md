# Checkpoint — 2026-07-22 — Skill: compattazione periodica (fatto)

## Task completato
Su richiesta del fondatore (22/07): aggiornata la skill weekly-kickoff
(.claude/skills/weekly-kickoff/SKILL.md) con la regola di
COMPATTAZIONE PERIODICA della conversazione (~ogni 15 min di lavoro,
circa ogni 3-5 unità) per non consumare troppi token. Compattare SOLO
a un confine di unità pulito (commit+push+checkpoint fatti); il
checkpoint per-unità (task + hash commit + prossimo passo atomico
preciso) rende la ripresa senza perdite (si riparte dal checkpoint,
non dalla chat). Regola aggiunta sia al corpo della skill sia al testo
del prompt della routine automatica (per i futuri /weekly-kickoff).

## Nota operativa (routine attiva)
La routine automatica attiva è weekly-build-mining-tech-2026-07-19
(cron 40 1,6,11,16,21 * * 1-5 = 5h dall'inizio, fire in questa
sessione persistente). Il suo prompt è congelato alla creazione, quindi
NON contiene ancora la regola. Non ri-armata di iniziativa per non
rischiare di alterare la schedule 5h del fondatore; si può ri-armare
preservando esattamente cron + persistent_session_id su sua conferma.

## Commit
- f3dc397  Skill: compattazione periodica della conversazione (~ogni 15 min)

## Prossimo passo atomico
Push + PR + merge a CI verde. Poi RIPRENDERE la 2a iterazione app dove
interrotto: estendere il tap-KPI del quadro a Flotta/Sentinella/Terra/
Campo (dove i KPI mappano a una lista), ognuno verificato in Playwright.
MAI fermarsi.

# Checkpoint — 2026-07-21 — README aggiornato (fatto)

## Task completato
Il README del monorepo era rimasto a "38 test automatici (26 regole +
12 SDK)" e non citava il nuovo runbook di attivazione. Aggiornato:
- conteggio test 38 → 97, con la descrizione delle categorie (helper
  di sicurezza, KPI delle app, regole, flusso SDK, guardrail delle
  Cloud Functions, percorso di bootstrap live);
- aggiunto `apps/deepwork-id/ATTIVAZIONE_LIVE.md` (runbook tecnico
  go-live) all'elenco dei documenti chiave.
Il resto del README (elenco app, struttura repo) è già attuale.

## Commit
- 452bdc4  README: aggiornato conteggio test (97) e link al runbook live

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.

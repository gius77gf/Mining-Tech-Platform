# Checkpoint — 2026-07-21T23:15:00Z

## Tipo
unit-complete (isolamento core Fase 1 — indirezione data-layer)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — core: dcol()/ddoc() + flag MULTI_TENANT)

## Completato (Task 3 / Fase 1)
Introdotta l'indirezione del data-layer del cuore:
- Nuovi helper `dcol(col)` / `ddoc(col,id)` (subito dopo l'init di `db`): un
  SOLO punto costruisce i percorsi Firestore.
- TUTTI i 39 accessi (21 `collection(db,…)` + 18 `doc(db,…)`) instradati su
  `dcol`/`ddoc` con sostituzione meccanica verificata; i percorsi grezzi
  restano SOLO dentro i due helper. `writeBatch`/`enableIndexedDbPersistence`
  intatti.
- Flag `MULTI_TENANT=false`: con flag spento i percorsi sono IDENTICI a oggi
  (globali) → comportamento invariato in produzione. La modalità org-scoped
  (`organizations/{org}/core/…`) è preparata ma NON attiva (si accende solo con
  auth server-side + migrazione, Fasi 3-4).

Verifica: `node --check` del modulo OK; residui `collection(db,`/`doc(db,`
solo nei 2 helper; Playwright boot → login renderizzato, body invariato
(59314 char), zero errori JS. Merge sicuro nonostante l'auto-deploy: è una
trasformazione a identità.

## Prossimo passo atomico
Fase 2 (Task 4): portare le regole Firestore del cuore nel repo (oggi solo in
console) e prepararne la versione org-scoped + test. Poi Fasi 3-4 (auth +
migrazione) gated.

## Blocchi
Fase 3 (auth Firebase/claim) e Fase 4 (migrazione + attivazione flag): gated.

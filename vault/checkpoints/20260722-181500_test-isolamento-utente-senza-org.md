# Checkpoint — 2026-07-22T18:15:00Z

## Tipo
unit-complete (fallback #4 — test casi limite; priorità #1 isolamento)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test isolamento utente senza org)

## Completato
Difesa in profondità sull'isolamento multi-tenant (priorità #1 del fondatore per
la rivendita a concorrenti). La suite copriva già anonimo, tour e concorrente
(membro di un'altra org), ma NON il principale realistico "utente appena iscritto,
autenticato ma senza nessuna organizzazione" (orgs={}) — lo stato subito dopo la
registrazione, prima di entrare in un'org (invito) o crearne una (Cloud Function).
- `apps/deepwork-id/tests/run.mjs`: nuovo contesto `newbie` (orgs={}) + 6 test che
  verificano il diniego di lettura/scrittura/elenco su dati app, dati del cuore,
  entitlements e membri di un'org.
- `.github/workflows/ci.yml`: conteggio test nel nome del job 322 → 328.

Verifica: emulatore Firestore (`--only firestore`), suite run.mjs = **58 passati,
0 falliti** (era 52); i 6 nuovi test passano. È difesa in profondità su
isolamento già solido — un futuro refactoring delle regole che trattasse male
l'utente-senza-org verrebbe ora colto dai test.

## Prossimo passo atomico
Aprire PR. Poi proseguire con altri casi limite ai test o revisione qualità.
Restano gated (conferma fondatore): geometria Genesi (P1.1/P1.2), Firebase
(core Fasi 3-4), dati default, mitigazione password, stile errori scritture live.

## Blocchi
Vedi DECISIONI_WEEKEND.md. Motore fisico Genesi e core in produzione: non
toccare senza indicazione. Dati sensibili/password: non toccare senza conferma.

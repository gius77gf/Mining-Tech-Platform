# Checkpoint — 2026-07-21T23:00:00Z

## Tipo
unit-complete (design/audit — isolamento multi-tenant del CORE)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — docs/ISOLAMENTO_CORE.md + audit)

## Contesto
Il fondatore (21/07) ha autorizzato ESPLICITAMENTE l'isolamento multi-tenant
del cuore ("un domani l'app dovrà essere rivenduta a più aziende"). Non è più
gated a livello di decisione; resta gated l'ATTIVAZIONE (migrazione dati/auth
in produzione).

## Completato
- **Audit del data-layer del cuore** (Task 1): scritture centralizzate in 4
  helper (fbSet/fbUpdate/fbDelete/fbAdd), letture in un unico blocco di
  caricamento, seed in seedDB; ~18 collezioni globali (users, rapportini,
  volate, cave, clienti, personale, mezzi*, deposito_*, messaggi, promemoria,
  sismogrammi, config, auditLog). SCOPERTA CHIAVE: nessuna autenticazione
  server-side (login = verifyPassword lato client, niente Firebase Auth/custom
  claim) → l'isolamento VERO richiede prima l'identità autenticata + regole
  server. Regole Firestore del cuore NON nel repo (solo console).
- **Design doc** (Task 2): docs/ISOLAMENTO_CORE.md — stato reale onesto, le due
  barriere (path org-scoped + auth/regole server), piano a fasi con "sicuro
  subito vs gated", raccomandazione di allineare il cuore a Deepwork ID.

## Prossimo passo atomico
Fase 1 (Task 3): introdurre helper dcol()/ddoc() e instradarvi TUTTO il
data-layer del cuore, dietro flag MULTI_TENANT=false (comportamento IDENTICO a
oggi → merge sicuro nonostante l'auto-deploy). Verifica: node --check + boot.

## Blocchi
Fase 3 (auth Firebase + claim) e Fase 4 (migrazione dati + attivazione flag):
gated, toccano produzione/infra → conferma del fondatore, come
MITIGAZIONE_PASSWORD.

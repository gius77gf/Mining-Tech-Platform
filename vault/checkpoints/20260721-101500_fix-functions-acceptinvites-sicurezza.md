# Checkpoint — 2026-07-21T10:15:00Z

## Tipo
unit-complete (bugfix di SICUREZZA da review adversarial)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — fix sicurezza acceptInvites)

## Completato
Quarta review adversarial, sulle Cloud Functions (i guardrail di
autorizzazione dietro il multi-tenant). Il resto del modello è confermato
SOLIDO (autorizzazione per-org, owner-gestisce-owner, ultimo owner protetto,
rebuildClaims solo membership attive, expiry inviti senza off-by-one). Trovati
e corretti DUE bug ALTI in `acceptInvites`:
1. **Invite hijacking (email non verificata)**: acceptInvites controllava solo
   che esistesse `auth.token.email`, non `email_verified`. Chi registra un
   indirizzo che non possiede (email_verified=false) poteva riscattare gli
   inviti a quell'email ed entrare in un'org altrui → violazione isolamento.
   Fix: richiesto `email_verified === true`.
2. **`.set()` sovrascriveva una membership esistente → org senza owner**: un
   admin che invita l'unico owner come "member" lo declassava al login
   successivo, lasciando l'org senza owner (aggira la protezione ultimo owner).
   Fix: se già membro, NON sovrascrivere il ruolo (consuma solo l'invito).
+ difesa in profondità: ruolo dell'invito limitato ad admin/member; email
  normalizzata con trim().toLowerCase() (come inviteMember).
- run-fns.mjs: 3 test inviti aggiornati a email VERIFICATA (necessario col fix)
  + 2 nuovi test (anti-hijack email non verificata; owner non declassato).
  Functions 18→20; totale CI 243→245.
Verifica: suite completa sotto emulatori 245/0 (Helper 22 · KPI 126 · Demo 6 ·
Rules 44 · SDK 19 · Functions 20 · Bootstrap 8). L'emulatore Auth propaga
correttamente email_verified nel token.

## Stato roadmap
6 app verticali robuste + 4 review adversarial (11 bug reali corretti, di cui
2 di sicurezza ALTI) + suite 245 + doc fondatore + backlog HSE avviato.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Riprendere il Terra trendVolumi
(in stash: terra-trend-wip) e completarlo con UI+test; poi altre unità. SENZA
FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

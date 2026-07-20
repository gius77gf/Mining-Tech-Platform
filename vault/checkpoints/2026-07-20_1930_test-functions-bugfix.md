# Checkpoint — 2026-07-20 — Test Cloud Functions + BUG di produzione corretto ★

## Task completato
- tests/run-fns.mjs: 10 test dei guardrail D4 contro emulatori
  Auth+Firestore+Functions, TUTTI VERDI (member non cambia ruoli,
  owner-only per gli owner, ultimo owner intoccabile su declassa/
  rimuovi, revoca invito una sola volta, createOrganization → owner).
- BUG VERO TROVATO DAI TEST: admin.firestore.FieldValue era
  undefined a runtime (firebase-admin moderno) → createOrganization,
  inviteMember e acceptInvites sarebbero CRASHATE IN PRODUZIONE al
  primo uso. Corretto con import modulare (FieldValue/Timestamp da
  firebase-admin/firestore). Questo da solo vale la giornata.
- Suite totale ora 48 (26 rules + 12 SDK + 10 functions) in npm test;
  CI aggiornata (installa deps functions, job rinominato).
- Nota ambiente: in sandbox la CLI va lanciata senza variabili proxy
  (env -u HTTPS_PROXY...) per registrare il trigger; in CI non serve.

## Prossimo passo atomico
PR verso main e merge; verificare al giro dopo l'esito CI del job
rinominato (48). Poi: approfondimento secondo-passaggio ricerca
(prezzi/Italia) o terze iterazioni app. MAI fermarsi volontariamente.

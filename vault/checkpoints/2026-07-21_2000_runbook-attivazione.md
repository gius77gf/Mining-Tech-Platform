# Checkpoint — 2026-07-21 — Runbook attivazione live (fatto)

## Task completato
Creato apps/deepwork-id/ATTIVAZIONE_LIVE.md: runbook tecnico (per
Claude) con i passi ESATTI per portare l'ecosistema live quando il
fondatore incolla il blocco firebaseConfig, eseguibile anche da una
sessione futura senza questo contesto:
1. Inserire i 3 valori reali in FIREBASE_CONFIG (shared/deepwork-id-
   client/index.js ~riga 35: apiKey/authDomain/projectId; gli altri
   campi non servono).
2. Deploy rules: `firebase deploy --only firestore:rules --project <id>`
   da apps/deepwork-id/.
3. Registrazione del fondatore (crea l'uid in Auth).
4. bootstrap-owner.mjs con chiave di servizio (org + owner + 8
   entitlement, gratis; chiave mai committata).
5. Verifica live (niente banner demo, dati persistono) + controprova
   isolamento con un secondo account.
Chiarito un punto che avrebbe potuto trarre in inganno: il tour delle 6
app verticali usa dati demo IN MEMORIA (*-data.js), NON org_demo su
Firestore → nessun seeding di org_demo necessario.
GUIDA_FIREBASE.md (lato fondatore) collegata al runbook.

## Verifiche fatte durante l'analisi (nessuna modifica necessaria)
- Rules: un membro PUÒ leggere gli entitlement (riga 79), il client NON
  può scriverli (write:false) → coerente col bootstrap via Admin SDK.
- Copertura test entitlement già completa in run-sdk.mjs (hasEntitlement
  vero/scaduto, listEntitlements, multi-org).

## Commit
- 7c35732  Runbook tecnico di attivazione live (ATTIVAZIONE_LIVE.md)

## Prossimo passo atomico
Push (force-with-lease) + PR + merge a CI verde. Poi continuare fino a
esaurimento; ciclo SERALE (~21:40 UTC) = revisione COMPLETA prima di
nuovi task. MAI fermarsi volontariamente.

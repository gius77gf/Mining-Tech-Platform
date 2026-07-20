# Checkpoint — 2026-07-21 — Indici Firestore per Functions (fatto)

## Task completato
Rischio latente (stessa classe del bug FieldValue: verde in test, rosso
in prod): le Cloud Functions usano query che gli EMULATORI non
verificano ma la produzione può richiedere come indici compositi:
- rebuildClaims: `collectionGroup("members").where(uid).where(status)`
- acceptInvites: `invites.where(email).where(status)`
- countActiveOwners: `members.where(role).where(status)`
Mancava `firestore.indexes.json`. Creato con l'indice collectionGroup
members (uid+status) — il caso più tipico che richiede indice esplicito
— e collegato in firebase.json (`"indexes": "firestore.indexes.json"`).

Riguarda SOLO il percorso Blaze/Functions (differito dal fondatore):
per il go-live GRATUITO col bootstrap NON serve (le app leggono con
query semplici, il bootstrap scrive i claim direttamente senza
rebuildClaims). Documentato in ATTIVAZIONE_LIVE.md (passo indici) e in
AUDIT_SICUREZZA.md punto 11.

Verifica: JSON validi; emulatori partono con la nuova config e la suite
gira (bootstrap 5/5). Gli indici non alterano i test (emulatori non li
applicano).

## Commit
- 2351331  Firestore: indici per le query Functions (pronti per Blaze)

## Prossimo passo atomico
Push (branch pulito da main) + PR + merge a CI verde. Continuare fino a
esaurimento. MAI fermarsi volontariamente.

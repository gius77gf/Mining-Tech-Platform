# Checkpoint — 2026-07-21 — Test bootstrap-owner (fatto)

## Task completato
Reso testabile e testato lo script scripts/bootstrap-owner.mjs (il
percorso "vai in live GRATIS" del weekend, senza Cloud Functions/Blaze),
che finora era solo syntax-checked.
- Refactor: logica estratta in `bootstrapOwner(auth, db, email,
  orgName, FieldValue)` che ritorna l'orgId; import di firebase-admin
  resi LAZY nel solo blocco CLI (guardato da import.meta.url) e
  FieldValue passato come parametro → il modulo è importabile dai test
  (che stanno in tests/) senza doverlo risolvere da scripts/.
- Nuovo tests/run-bootstrap.mjs (5 test sugli emulatori Auth+Firestore):
  verifica che il bootstrap crei l'org coi metadati attesi, il membro
  OWNER attivo, il claim orgs:{orgId:'owner'}, tutti e 8 gli entitlement
  attivi (tier full, chiavi = APP_IDS) e rifiuti un'email non registrata
  con messaggio chiaro.
- Agganciato alla catena npm test; job CI 78 → 83.

Verifica: suite completa eseguita in locale sugli emulatori → 83/83
verdi (22 helper + 26 rules + 15 SDK + 15 functions + 5 bootstrap).

## Nota operativa (lezione)
Il branch va SEMPRE ripartito da origin/main dopo ogni merge: costruire
sopra i commit originali di una PR già squash-mergiata crea un conflitto
e GitHub NON lancia la CI su una PR in conflitto (era la causa della CI
mancante su #102, poi risolta con rebase).

## Commit
- 8a003d9  Test: bootstrap-owner end-to-end sugli emulatori

## Prossimo passo atomico
Push (branch pulito da main) + PR + merge a CI verde. Continuare fino a
esaurimento. MAI fermarsi volontariamente.

# Checkpoint — 2026-07-22 — Test rules creazione inviti (fatto)

## Task completato
Revisione di correttezza dell'SDK (spina dorsale multi-tenant):
verificato che i metodi di login ricaricano i claim, redeemInvites
forza il refresh del token dopo l'accettazione e switchOrg controlla
la membership → SDK corretto, nessun bug.

Colmata una lacuna nelle regole: le create su /invites erano coperte
solo in lettura. Aggiunti 3 test a run.mjs: un membro semplice e il
concorrente NON possono CREARE un invito con una scrittura Firestore
diretta (escalation bypassando la Cloud Function), mentre un
owner/admin puo (come la Function, che le regole permettono).

Suite 106 → 109 (rules 26 → 29), verde in locale sugli emulatori.
Job CI a 109.

## Commit
- 9673aa1  Test rules: creazione inviti — no escalation da scrittura diretta

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.

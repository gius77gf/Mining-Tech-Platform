# Checkpoint — 2026-07-21 — Test anti-escalation inviti (fatto)

## Task completato
Colmata una lacuna nei test dei guardrail delle Cloud Functions: il
caso NEGATIVO di inviteMember/revokeInvite non era coperto (solo il
positivo "owner invita"). Aggiunto a run-fns.mjs un test in cui un
semplice MEMBER (non owner/admin) riceve permission-denied sia creando
un invito sia revocandone uno esistente → prevenzione dell'escalation
di privilegi lato inviti.

Nota: l'esecuzione della SUITE COMPLETA ha catturato un problema di
isolamento (il mio test lasciava il client loggato come member,
rompendo il test successivo che assume 'boss'): risolto ripristinando
il login owner a fine test. Conferma del valore di girare tutta la
catena, non solo il file modificato.

Suite 103 → 104 (Functions 15 → 16), verde in locale sugli emulatori.
Job CI a 104.

## Commit
- a0f597a  Test: un member non puo invitare ne revocare (anti-escalation)

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.

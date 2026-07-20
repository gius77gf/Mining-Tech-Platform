# Checkpoint — 2026-07-21 — Test isolamento inviti (fatto)

## Task completato
Colmata l'ultima lacuna dei guardrail Functions in negativo:
acceptInvites filtra gli inviti per email del chiamante, ma non era
testato che un utente con email DIVERSA non possa riscattare l'invito
altrui. Aggiunto a run-fns.mjs: un utente "estraneo" chiama
redeemInvites mentre esiste un invito per "vittima@studio.it" →
nessuna membership creata e l'invito resta 'pending' (intatto).
Nessun dirottamento di inviti tra utenti.

Suite 104 → 105 (Functions 16 → 17), verde in locale sugli emulatori.
Job CI a 105.

## Commit
- f3df388  Test: isolamento inviti — non riscattabili da un'email diversa

## Prossimo passo atomico
Push + PR + merge a CI verde. Continuare fino a esaurimento. MAI
fermarsi volontariamente.

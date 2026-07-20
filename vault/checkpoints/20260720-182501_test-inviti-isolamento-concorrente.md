# Checkpoint — 2026-07-20T18:25:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
399a6a5

## Completato
SICUREZZA: il concorrente non cancella né manomette gli inviti di orgA
(difesa contro il dirottamento di un invito per entrare in un'org altrui).
Emulatore: run.mjs 41 passati (era 39). Totale 165→167; job CI aggiornato.
COPERTURA CRUD ISOLAMENTO ORA COMPLETA su tutte le collezioni: dati app
(r/l/w/d cross-org + annidati + deny default), org (metadati owner-only,
no create/delete client), entitlement (no write/delete client), membri
(no write/delete client, no auto-promozione), inviti (create admin-only,
no tampering/delete da membro/concorrente), profili (solo il proprio).

## Stato roadmap
Regole Firestore: isolamento multi-tenant testato in modo esaustivo (41
test su run.mjs). Suite 167. Questo era il vein di valore più alto trovato
oggi (sicurezza = requisito #1). Ora sostanzialmente saturo anche questo.

## Prossimo passo atomico
Merge PR test-inviti-isolamento (dopo CI verde; RESTART da origin/main
prima della prossima unità). Le regole sono ora coperte in modo molto
completo. Prossimo: se emerge un gap reale in run-sdk/run-fns/run-bootstrap
(SDK/Functions), coprirlo con emulatore; altrimenti la copertura è ottima.
Le voci ad alto valore rimaste richiedono il fondatore
(docs/DECISIONI_WEEKEND.md). Continuare con valore reale, evitare churn,
fino a esaurimento crediti.

## Blocchi
Nessuno. Voci gated per il fondatore.

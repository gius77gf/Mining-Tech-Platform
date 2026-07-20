# Checkpoint — 2026-07-20T18:12:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1342b05

## Completato
SICUREZZA (isolamento multi-tenant, requisito #1): aggiunti 2 test sulle
regole Firestore per la CANCELLAZIONE cross-org — un membro di orgA non può
deleteDoc i dati del concorrente orgB, e viceversa. Prima erano coperti
read/list/write cross-org ma NON delete. Verificato con emulatore
(firebase 15.24 + Java presenti): run.mjs 35 passati (era 33), 0 falliti.
Totale suite 159→161; job CI aggiornato.

## Stato roadmap
Isolamento tra organizzazioni concorrenti ora testato su tutte le
operazioni (read/list/write/delete). Suite 161. Main verificato sano
(review consolidata precedente).

## Prossimo passo atomico
Merge PR test-isolamento-delete (dopo CI verde; job "...(161)"), riparti
branch da main. Prossimo: cercare altri buchi reali nelle suite emulatore
(run.mjs/run-sdk/run-fns/run-bootstrap) sulla sicurezza/isolamento — es.
delete cross-org su altri path (entitlements, membri, inviti già coperti
in scrittura; verificare delete); o casi limite SDK/Functions non coperti.
L'emulatore è disponibile: eseguire localmente prima di pushare. Scegliere
UN gap reale, aggiungere il test, verificare con emulatore,
commit+checkpoint+PR. Questo è lavoro di valore reale (sicurezza), non
churn. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Le voci gated restano per il fondatore (docs/DECISIONI_WEEKEND.md).

# Checkpoint — 2026-07-20T18:22:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d230441

## Completato
SICUREZZA: completata la copertura CRUD delle regole su entitlement e
membri — la CANCELLAZIONE dal client è vietata (entitlement: no auto-
sblocco abbonamento; membri: solo Function removeMember con guardrail
ultimo-owner). Prima solo setDoc testato. Emulatore: run.mjs 39 passati
(era 37). Totale 163→165; job CI aggiornato.

## Stato roadmap
Regole Firestore: copertura CRUD completa su app-data (r/l/w/d cross-org),
profondità annidata, deny default, entitlement/membri (delete). Suite 165.
Isolamento multi-tenant molto solido.

## Prossimo passo atomico
Merge PR test-delete-entitlement-membri (dopo CI verde; RESTART da
origin/main prima della prossima unità), poi valutare gli ULTIMI gap
regole: delete di un invito da parte del concorrente (creazione/modifica
già testate; delete invito da admin è permessa, da non-admin no —
verificare un test "concorrente non cancella invito di orgA"); oppure
passare a run-sdk/run-fns per casi non coperti. Emulatore disponibile:
eseguire sempre localmente. Valore reale (sicurezza). Se le regole sono
sature, la copertura è ottima e si può tornare a cercare valore altrove o
attendere sblocchi del fondatore. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Voci gated per il fondatore (docs/DECISIONI_WEEKEND.md).

# Checkpoint — 2026-07-20T18:18:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
116af93

## Completato
SICUREZZA (isolamento): 2 test sui bordi — dato annidato in profondità del
concorrente protetto dal wildcard ricorsivo {document=**}; sottocollezione
non prevista della propria org negata dal deny di default. Verificato con
emulatore: run.mjs 37 passati (era 35). Totale 161→163; job CI aggiornato.
NB: corretta anche l'igiene di branch (PR #181 aveva saltato il restart da
main dopo il merge #180 → GHA non partiva; ricostruito il branch pulito da
origin/main e cherry-pick, CI poi verde). Lezione ribadita: SEMPRE restart
da origin/main dopo ogni merge.

## Stato roadmap
Isolamento multi-tenant testato su read/list/write/delete cross-org +
profondità annidata + deny di default. Suite 163. Sicurezza molto solida.

## Prossimo passo atomico
Merge PR test-isolamento-annidato (dopo CI verde; job "...(163)"; RESTART
da origin/main PRIMA di iniziare la prossima unità), poi continuare a
cercare gap reali nelle suite emulatore. Candidati: (a) delete cross-org su
entitlements/members (scrittura già negata a tutti dal client; verificare
delete); (b) casi SDK/Functions non coperti (run-sdk/run-fns); (c) tour
user che tenta scritture su org reale (già parziale). Eseguire sempre
l'emulatore localmente prima di pushare. Valore reale (sicurezza), non
churn. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Voci gated per il fondatore (docs/DECISIONI_WEEKEND.md).

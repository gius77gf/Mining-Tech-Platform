# Checkpoint — 2026-07-20T15:13:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2d91a96

## Completato
Sentinella reg-list: ordinamento per azione — le voci "in attesa"
compaiono prima delle "aggiornato". Era l'unica lista dell'ecosistema
senza un ordinamento utile (le altre di Sentinella ordinano già sensori
per criticità e adempimenti per scadenza; le altre app hanno sort per
data/stato). Costi Flotta e nota registri non hanno campo data, quindi
niente sort per data lì. Sintassi OK. Playwright: badge order
["In attesa","Aggiornato","Aggiornato"] → ORDER OK.

## Stato roadmap
Seconda iterazione UX ampia: tap-KPI (tutte), stati vuoti (tutte le
liste), validazione form con feedback (tutti i form), ordinamento
azione-prima (registro Sentinella). PR in corso.

## Prossimo passo atomico
Merge PR registro-ordine (dopo CI verde), riparti branch da main.
La seconda-iterazione UX "trasversale" è ora ben coperta. Prossimo
candidato: passare al punto 4 della lista "roadmap non finita" —
TEST AGGIUNTIVI sulle suite emulatore. Candidato concreto: aggiungere
a run-kpi.mjs (o creare run-ui-logic) test unitari sulle funzioni pure
kpiFrom/statoMisura/urgenza/giorni delle app che le esportano
(sentinella-data, flotta-data, terra-data, conti-data), verificando i
calcoli KPI su input noti. Ispezionare quali kpiFrom sono esportate e
già coperte, scegliere UNA funzione non testata, scrivere il test,
agganciarlo alla chain in tests/package.json, eseguire la suite
emulatore, commit+checkpoint+PR.

## Blocchi
Nessuno.

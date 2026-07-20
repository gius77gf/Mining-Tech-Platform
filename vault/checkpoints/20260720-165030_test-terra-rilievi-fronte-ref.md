# Checkpoint — 2026-07-20T16:50:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
594e0bf

## Completato
Test integrità referenziale dati demo: terra rilievi→fronte (fronteId
punta a un fronte esistente, null ammesso), come già scudo scadenze→
lavoratore. Assertion aggiunta al test terra esistente in run-demo.mjs
(conteggio test invariato, niente bump CI). run-demo verde 6/6.
NB verificato anche: CSV export di tutte le app già protetti da csvCell
(free-text), flotta senza export; gar-list Conti già ordinata per
scadenza; demo refs scudo/terra puliti.

## Stato roadmap
Suite ~151. Copertura funzioni pure + integrità demo molto forte.
UX trasversale esaustiva. Sicurezza: 2 XSS + 1 bug DSO + verifica export.

## Prossimo passo atomico
Merge PR test-terra-ref (dopo CI verde), riparti branch da main.
La copertura test/UX/robustezza è satura sulle app verticali. Prossimo:
valutare estensione integrità referenziale demo alle altre app dove
esistono riferimenti (es. flotta manutenzioni.mezzo → nome mezzo? campo
rapportini.squadra → nome squadra? sono per NOME non id: verificare se ha
senso un controllo; altrimenti lasciare). In alternativa cambiare asse
(sicurezza core o una nuova UX minore). Scegliere UNA cosa piccola,
verificare, commit+checkpoint+PR. Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

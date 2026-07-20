# Checkpoint — 2026-07-20T17:50:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c81b448

## Completato
Punto 4 (test): estratta volumeFronte(rilievi, fronteId) pura in
terra-data.js (m³ estratti per fronte = somma rilievi elaborati con volume
di quel fronte), usata da index.html. 1 test: esclude pianificati/volumi
assenti/altri fronti; vuoto=0. run-kpi 57/57; Playwright TERRA FRO OK.
Suite 158→159; job CI aggiornato. Prima: smoke-test completo delle 6 app
(tutte pulite, nessun errore console/page) — nessuna regressione dai molti
cambi di oggi.

## Stato roadmap
Logica di business delle app verticali ampiamente estratta e testata.
Suite 159. Smoke test 6 app pulito. Coerenza UI, filtri, ponte Genesi,
sicurezza: tutti solidi.

## Prossimo passo atomico
Merge PR terra-volumefronte (dopo CI verde; job "...(159)"), riparti branch
da main. La copertura è ora molto profonda. Prossimo: valutare se resta
logica inline non banale da estrarre/testare (la maggior parte è ormai
coperta o triviale: formatter, lookup); in alternativa una micro-coerenza
UI o una revisione mirata. Scegliere SOLO se aggiunge valore reale (evitare
churn), verificare, commit+checkpoint+PR. Continuare fino a esaurimento
crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore
(docs/DECISIONI_WEEKEND.md).

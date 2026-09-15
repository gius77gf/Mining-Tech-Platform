# Ultimo ciclo — canarino

## Quando
2026-09-15T15:59:48Z (letto da `date -u`, non predetto)

## Commit di partenza
3a236d98 — chore(vault): checkpoint QA visiva Scudo + fix etichetta gravità

## Cosa sto per fare
Chiudere l'unità in corso (già verificata con `run-kpi`/`run-stile`/
`numeri-nei-documenti.mjs`, giro isolato su worktree in corso in
background): la barra in basso di Sentinella dice ora «Scadenze» invece
di «Adempimenti» (i bersagli di tocco a 320px erano sotto i 44px richiesti,
ora sopra — misurato con Playwright, non stimato), più la cascata dei
quattro documenti dei conteggi aggiornata di conseguenza. Appena il giro
isolato conferma, commit + push + checkpoint di questa unità.

Poi, per la regola del fondatore (mai fermarsi finché i crediti non sono
esauriti): riverificare di persona (non sulla parola dell'agente) la
ricerca appena tornata da un agente in background su Sentinella —
attribuzione delle modifiche (chi ha cambiato una soglia, non solo
quando) — prima di considerarla azionabile, poi proseguire col ciclo
normale (nuova ricerca in background su un'altra app, seconda iterazione
UX di un'app diversa, o il prossimo cantiere che emerge dalla roadmap).

Working tree al momento del canarino: sette file modificati e non ancora
committati, tutti dell'unità Sentinella in chiusura (nessun lavoro perso,
nessuna sovrapposizione con altri cantieri).

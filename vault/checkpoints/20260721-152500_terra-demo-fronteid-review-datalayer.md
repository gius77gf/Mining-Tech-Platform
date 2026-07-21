# Checkpoint — 2026-07-21T15:25:00Z

## Tipo
unit-complete (review data-layer + fix vetrina Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra demo fronteId + esito review data-layer)

## Completato
**Revisione adversarial del data-layer** (6 *-data.js + SDK) su isolamento
multi-tenant, doc ref, parser CSV, parità demo/live: **PULITA sugli assi
critici**. Isolamento: OGNI accesso Firestore passa da `id.orgCollection(...)`
(nessun path a mano, nessuna query cross-org); doc ref di update/delete
corretti; parser CSV corretti (ordine colonne + numIt sui numerici); api demo
e live simmetriche; demo clona lo stato per-chiamata (nessun leak). Nessun
finding critico/alto.
Due note minori (non bug live):
1. `aggiorna`/`rimuovi` demo assumono la collezione già presente in DEMO —
   attualmente irraggiungibile (tutti i chiamanti puntano a collezioni
   seminate). RIMANDATO come hardening difensivo a bassa priorità
   (`mem[name] || (mem[name] = [])`).
2. `volumeFronte` filtra su `fronteId`, assente dai rilievi DEMO → in demo/tour
   i m³ per fronte erano 0. **CORRETTO ORA**: aggiunto `fronteId` ai rilievi
   demo (r1,r3→f1; r2,r4→f2), così la vetrina mostra "estratti 41k/39k m³" per
   Fronte Nord/Est. Aggiunta un'asserzione in run-demo che blinda la vetrina.
Verifica: run-demo 6/0, KPI 154/0, Playwright (Terra/Fronti: Nord 41k, Est 39k,
Sud senza rilievi; nessun errore). CI invariata (273; asserzione dentro un test
esistente, non un nuovo test).

## Stato roadmap
6 app verticali con incremento in sessione. Data-layer verificato solido
(isolamento OK). Suite 273.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI (eventuale hardening
difensivo demo, o nuova rifinitura/ricerca).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

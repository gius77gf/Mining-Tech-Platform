# Checkpoint — 2026-07-21T15:55:00Z

## Tipo
unit-complete (test aggiuntivi + QA smoke, fallback #4)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test di confine sugli helper della sessione)

## Completato
Rafforzata la rete di sicurezza sui rami non ancora coperti degli helper nuovi
di questa sessione. `run-kpi.mjs`: +5 test di confine:
- `proiezioneAnnua`: soglie di stato ok (<90%) e warn (90–100%) a metà anno.
- `prioritaOperative`: manutenzione a ore su un mezzo assente → ignorata (no
  crash).
- `coperturaRapportini`: rapportino di una squadra sconosciuta non falsa il
  conteggio.
- `estrattoContoCliente`: cliente con sole fatture NON scadute → documento
  senza riga mora, con "non ancora scaduta".
- `prioritaConformita`: misura esattamente al 90% della soglia → attenzione.
KPI 155→160; CI 274→279, tutti verdi.

**QA smoke test** (Playwright, tutte le 6 app × tutte le pagine): 6/6 pulite,
nessun errore console/page dopo i 14 PR della sessione → nessuna regressione.

## Stato roadmap
6 app verticali con incrementi; suite 279; smoke test regressione pulito;
data-layer verificato (isolamento OK).

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

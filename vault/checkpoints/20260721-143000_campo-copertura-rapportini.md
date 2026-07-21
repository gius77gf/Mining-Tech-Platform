# Checkpoint — 2026-07-21T14:30:00Z

## Tipo
unit-complete (feature — Campo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo copertura rapportini di turno)

## Completato
Campo mostrava i rapportini ma non "chi ancora non ha consegnato" prima del
cambio turno (handover). Aggiunto un controllo di completezza.
- `campo-data.js`: `coperturaRapportini(squadre, rapportini)` pura e testabile.
  Dice quali squadre hanno un rapportino "inviato" e quali mancano (match per
  prefisso del nome squadra). Ritorna { coperte, totale, pct, mancanti }.
- `index.html`: riga `rap-cop` sopra la lista rapportini: "Rapportini di turno:
  X/Y squadre — manca <squadra>" (badge ok se tutte hanno consegnato, warn se
  ne mancano; nomi mancanti escapati).
- `run-kpi.mjs`: +2 test (2/3 con bozza che non conta e mancante corretto;
  vuoto = pct null). KPI 150→152; CI 269→271.
Verifica: KPI 152/0, syntax module OK, Playwright (Campo/Rapportini: "2/3
squadre — manca Squadra C — Impianto"; nessun errore).

## Stato roadmap
TUTTE e 6 le app verticali hanno ricevuto un incremento analitico/di prodotto
in questa sessione (Conti sollecito+estratto, Scudo promemoria, Flotta priorità,
Terra proiezione, Campo copertura rapportini) + fix di revisione. Suite 271.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI —
possibile: aggiornare STATO_PRODOTTO con le nuove funzioni di questa sessione,
o una nuova revisione/ricerca.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

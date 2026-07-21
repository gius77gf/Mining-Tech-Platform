# Checkpoint — 2026-07-21T09:15:00Z

## Tipo
unit-complete (bugfix da review adversarial)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — fix off-by-one nel conteggio dei giorni + mese locale Terra)

## Completato
Seconda review adversarial (sui CALCOLI, non i parser) → DUE bug reali,
riproducibili, invisibili ai test (che passavano sempre un `oggi` a mezzanotte):
1. **Off-by-one sistemico (ALTA)**: la data target era normalizzata a
   mezzanotte ma `oggi` di default è `new Date()` con l'ora corrente →
   `Math.floor` dava un giorno IN MENO dal mezzogiorno in poi. In LIVE (ora
   reale): una scadenza di OGGI risultava "scaduta" tutto il giorno, "scade
   oggi" era codice morto, una fattura in scadenza oggi spariva da
   incassoAtteso ma finiva negli scaduti dell'aging, le finestre a 30 gg
   slittavano. Colpiva Scudo, Flotta, Conti, Sentinella.
   Fix: nuovo helper condiviso `giorniTra` in dw-shell che normalizza ENTRAMBE
   le date a mezzanotte locale e usa round (robusto ai cambi ora legale).
   Applicato in conti.giorni, sentinella.giorni, scudo.statoScadenza+
   livelloScadenza, flotta.urgenza (le funzioni a valle passano da queste).
2. **Terra mese/anno in UTC (MEDIA)**: kpiFrom usava toISOString (UTC) mentre
   le date dei rilievi sono stringhe locali → nelle prime ore dopo mezzanotte
   del 1° del mese, volumiMese = 0. Fix: getFullYear/getMonth locali.
Corretti; +3 test che FALLISCONO sul codice vecchio (verificato: old giorni
oggi-pomeriggio = -1) e passano ora. KPI 119→122; totale CI 232→235.
La review ha anche CONFERMATO corretti aging/DSO, statoMisura, scaledDistance,
valoreMateriale, scartoPct, pianoRiepilogo, ecc. (nessun altro bug).

## Stato roadmap
6 app verticali con import+export CSV robusto e conteggi giorni corretti in
LIVE + suite 235 + doc fondatore + ricerca HSE.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Poi: implementare SCADENZE_PRESET
in Scudo (backlog HSE), o altre rifiniture/ricerche. SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

# Checkpoint — 2026-07-21T06:11:52Z

## Tipo
unit-complete (epica M — seconda parte)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta ordini di lavoro che consumano ricambi)

## Completato
Flotta — **ordini di lavoro che scaricano i ricambi** (collega
manutenzione ↔ magazzino ↔ costi). Completa l'epica del work order.
- flotta-data.js: helper `scaricoGiacenza(giacenza, qta=1)` → nuova
  giacenza mai sotto zero. Pura e testabile.
- index.html: nel form "Nuova manutenzione" un select ricambio
  (facoltativo); la manutenzione mostra "· usa <ricambio>"; alla chiusura
  (✓) il ricambio scelto viene scaricato di 1 dal magazzino (con conferma
  che lo dice), poi la manutenzione è tolta.
- run-kpi.mjs: +1 test (scaricoGiacenza, mai sotto zero). Suite KPI 96→97;
  totale CI 206→207.
Verifica: KPI 97/0, syntax OK, screenshot + flusso end-to-end in Playwright
(creato ordine con Filtro olio giac 6 → chiuso → giacenza 5). Coerente shell.

## Stato roadmap
Epica "work order + ricambi" COMPLETA (magazzino #204 + consumo qui).
Restano epiche M: Campo rapportino turno strutturato; Scudo matrice
competenze; Conti solleciti a livelli. E i ponti/integrazioni (gated
fondatore) — de-rischiati nel vault.

## REGOLA RIBADITA DAL FONDATORE (21/07, notte)
"NON fermarti MAI, solo se sei costretto. Se finisci il programmato, vai
avanti con ricerche e nuovi programmi." → nessuna pausa volontaria, nessun
"punto stabile" come motivo di stop; il punto stabile serve solo alla
sicurezza dell'interruzione forzata. Proseguire a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere la prossima epica
M: Campo — rapportino di turno strutturato (nuova forma di rapportino con
eventi/produzione/anomalie/handover), spezzata in sotto-unità. Continuare
SENZA FERMARSI.

## Blocchi
Ciclo chiuso e integrazioni: gated (fondatore). Genesi frammentazione:
gated (motore fisico) — formule pronte nel vault.

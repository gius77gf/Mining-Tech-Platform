# Checkpoint — 2026-07-20T15:43:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f1d6c11

## Completato
Test business-logic: terra.kpiFrom avanzamento annuo ignora i rilievi di
altri anni. Il test esistente usava solo rilievi 2026; aggiunto un caso
con un rilievo 2025 (9000 m³) che NON deve contare: avanzamento resta 25%
(3000/12000) invece di 100%. Verifica anche volumiMese=0 fuori mese.
run-kpi locale: 44 passati, 0 falliti. Totale 145→146.

## Stato roadmap
Suite 113→146 in questo ciclo. Coperti: UX trasversale (tap-KPI, stati
vuoti, validazioni, ordinamento, conferme delete), sicurezza (2 XSS +
parser CSV puro), test funzioni pure (confini, input vuoti, integrità
demo, logica regolari Scudo, avanzamento annuo Terra).

## Prossimo passo atomico
Merge PR test-terra-avanzamento (dopo CI verde; job "...(146)"), riparti
branch da main. Prossimo candidato test: flotta.kpiFrom carburante —
verificare che sommi SOLO le voci di costo con "carburante" nel nome
(case-insensitive) e ignori le altre; e tagliandi30 conti solo le
manutenzioni entro 30 giorni. Oppure conti.kpiFrom inScadenza (fatture
non incassate con scadenza <=10 giorni). Scegliere UNA funzione, UN
percorso non isolato, test, run-kpi, commit+checkpoint+PR. Il lavoro non
finisce: continuare a piccole unità fino a esaurimento crediti.

## Blocchi
Nessuno.

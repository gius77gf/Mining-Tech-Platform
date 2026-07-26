# Checkpoint — 2026-07-24T12:00:00Z

## Tipo
unit-complete (POC drone — volume robusto al rumore del drone consumer)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — pointcloud.js + run-pointcloud.mjs + ci.yml)

## Completato
Robustezza del volume in vista del dato REALE del weekend: la base del volume era
z-minimo assoluto → un singolo punto spurio sotto il piano (rumore tipico dei droni
consumer senza RTK) avrebbe gonfiato il volume di (errore × area). Ora la base è il
**2° percentile delle quote** (campione deterministico a passo fisso) con clamp a
zero per cella. Test dedicato: prisma noto + punto a z=−50 → il volume resta ~160 m³
e la base resta ~0 (con la base=minimo sarebbe esploso). 23 test pointcloud, CI 361.

## Verifica
23/23 verdi; syntax modulo OK. Il POC usa la stessa funzione (nessun altro cambio).

## Prossimo passo atomico
Stasera (~21:40): REVISIONE del giorno + CHIUSURA SETTIMANA. Prima, se resta tempo
nel ciclo: ritentare il pin degli esponenti McKenzie / range k (fonti 403 ieri).

## Blocchi
Gates invariati (punto 9, estetica, drone, #321, salvataggio volume in Terra).

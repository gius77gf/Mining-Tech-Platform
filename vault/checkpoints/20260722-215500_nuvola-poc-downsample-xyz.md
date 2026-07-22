# Checkpoint — 2026-07-22T21:55:00Z

## Tipo
unit-complete (POC nuvola — fix downsample XYZ, robustezza per nuvole grandi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — downsample XYZ)

## Completato
Proseguendo la revisione serale, pensando al test del weekend del fondatore con
una nuvola ODM REALE (spesso milioni di punti): trovato che `parseXYZ` NON
applicava il downsample (solo `parsePLY` lo faceva). Un XYZ grande avrebbe
caricato tutti i punti → browser lento/a rischio.
- `apps/genesi/nuvola-poc.html`: `parseXYZ` ora, se i punti superano il cap
  (700k), fa il downsample (1 punto ogni N) come già il PLY, e mostra "di N".

Verifica: syntax OK; Playwright con una nuvola XYZ da **1.500.000 punti (26,5
MB)** → scesa a 500.000 (di 1.500.000, 1/3), caricata in ~3,8s, nessun errore.
Coerente ora col comportamento del PLY.

## Prossimo passo atomico
Revisione serale completa e pulita (con questo fix incluso). Proseguo coi fallback:
seconde iterazioni app verificate / test / rotazione ricerca. Passo 3 drone
(aggancio fronte→motore volata) gated sul test weekend del fondatore.

## Blocchi
Passo 3 drone: gated sul fondatore. #321 estetica: gated. #321 unico branch.

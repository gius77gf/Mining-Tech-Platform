# Checkpoint — 2026-07-23T01:45:00Z

## Tipo
unit-complete (Genesi — parser nuvola/mesh estratti in modulo + test CI)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — pointcloud.js + test)

## Completato
Fallback genuino (never-stop): blindare i parser del visualizzatore drone (che
IERI ho corretto per 3 bug in revisione serale) con test in CI, e renderli
riusabili per il passo 3.
- **`apps/genesi/pointcloud.js`** (nuovo modulo): estratti `parseXYZ`, `parsePLY`
  (ascii+binario), `preShiftOBJ` come funzioni PURE esportate (no DOM: solo
  TextDecoder/DataView → girano anche in Node). Contengono i 3 fix serali
  (downsample XYZ, robustezza PLY, pre-shift OBJ per precisione UTM). `maxpts`
  parametrizzabile per i test.
- **`apps/genesi/nuvola-poc.html`**: ora importa da `./pointcloud.js` invece delle
  definizioni inline (rimosse). Verificato che il POC funziona ancora (import
  risolve nel browser, PLY e mesh caricano, nessun errore).
- **`apps/deepwork-id/tests/run-pointcloud.mjs`** (nuovo): 11 test — parseXYZ
  (base/colore/junk/downsample), parsePLY (ascii/binario/downsample/errori),
  preShiftOBJ (origine/vn-vt-f intatte/senza vertici). Tutti verdi.
- **CI**: `package.json` test script aggiunge `run-pointcloud.mjs`; `ci.yml`
  aggiunge il syntax-check di `pointcloud.js` e aggiorna l'etichetta 329 → 340.

Verifica: syntax OK (modulo + POC); test puri verdi (helpers 43, kpi 174,
pointcloud 11, demo 7); ci.yml YAML valido; smoke browser POC ok.

## Prossimo passo atomico
Passo 3 drone (aggancio fronte→motore volata di genesi.html) gated sul test
weekend del fondatore col dato reale; ora il parser è pronto e testato per
riusarlo. Nel frattempo fallback: seconde iterazioni app / test / rotazione ricerca.

## Blocchi
Passo 3 drone: gated sul fondatore. #321 estetica: gated. #321 unico branch.

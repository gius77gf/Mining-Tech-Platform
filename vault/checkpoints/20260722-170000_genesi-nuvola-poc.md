# Checkpoint — 2026-07-22T17:00:00Z

## Tipo
unit-complete (Genesi — POC visualizzatore nuvola di punti, direzione drone del fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — POC nuvola di punti)

## Completato
Primo pezzo CONCRETO della direzione prioritaria del fondatore (drone→nuvola→
volata): un **visualizzatore di nuvola di punti** che risponde alla sua domanda di
fattibilità CON CODICE FUNZIONANTE, e che può provare subito con la sua nuvola del
DJI. File AUTONOMO, non tocca il genesi.html principale (branch in revisione).
- `apps/genesi/nuvola-poc.html`: pagina self-contained che riusa il Three.js già
  vendorizzato di Genesi (offline, nessun CDN/spesa). Carica (file o drag-drop) una
  nuvola in **PLY (ascii E binario little/big endian)** o **XYZ/TXT**, la
  **downsampla** se troppo densa (cap 700k punti), la centra (gestisce coordinate
  georeferenziate enormi), la colora (dal drone se ci sono i colori, altrimenti per
  quota), con OrbitControls (ruota/zoom/sposta) e pannello info (punti, colori,
  dimensioni reali, diagonale). Stile ambra Genesi. Nota ONESTA sulla scala
  approssimativa da drone consumer.

Verifica: syntax check inline OK; Playwright con nuvole sintetiche — XYZ (1000),
PLY ascii (500), PLY binario (400) caricate tutte, punti e dimensioni corrette,
nessun errore; screenshot: la nuvola si vede in 3D, pannello coerente.

## Prossimo passo atomico
Su riscontro del fondatore (che formato gli dà il suo WebODM, se il POC gli carica
la nuvola reale): passo 2 — ritaglio/orientamento del fronte dalla nuvola ed
estrazione del profilo → aggancio alla simulazione volata di Genesi. Poi il ponte
Terra→Genesi. Fino ad allora, gated sul suo test/scelta.

## Blocchi
Il passo 2 (fronte dalla nuvola) aspetta il test del fondatore col suo file reale.
LAZ compresso: serve laz-perf (rimandato). #321 unico branch.

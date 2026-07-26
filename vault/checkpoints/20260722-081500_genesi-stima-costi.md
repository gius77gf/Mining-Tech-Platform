# Checkpoint — 2026-07-22T08:15:00Z

## Tipo
unit-complete (Genesi — stima costi/economia volata, gap vs competitor #1/3)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi stima costi)

## Completato
Prima delle 3 lacune fattibili in browser dal confronto competitor
(`docs/GENESI_VS_COMPETITOR_MATRICE.md`): **stima costi/economia della volata**
(ce l'hanno JKSimBlast, O-Pitblast, Hexagon MinePlan; Genesi aveva solo costo
RELATIVO sugli esplosivi). Prezzi unitari inseriti dall'utente → conti.
- `apps/genesi/genesi.html`:
  - D2: campi `cPerf` (€/m perforazione), `cExpl` (€/kg esplosivo), `cInnesco`
    (€/foro), `valMat` (€/t valore materiale, opz.).
  - UI: sezione accordion "Costi & resa (stima)" nel Progetto 2D (stile coerente
    dc-sec), letta in `applyDesign`, sincronizzata in `syncDesignInputs`,
    agganciata al listener change.
  - `renderScheda2D`: blocco "💶 Stima economica" con metri perforati, kg
    esplosivo, n° inneschi, costo totale, costo €/m³ e €/t; se dato il valore
    materiale, margine (ricavo − costo) colorato. Volume = fori·B·S·H, tonnellate
    = volume·densità roccia (dalla scheda roccia).
  - Etichetta ONESTA: "prezzi tuoi · ordine di grandezza" (no manodopera/
    ammortamenti/oneri) — non un preventivo.

Verifica: syntax CI OK; math in Node (costi/volume/tonnellate/margine coerenti,
cM3=cTot/vol, cT=cM3/densità); Playwright — la scheda mostra "Stima economica" e
"Totale volata €3.881", nessun errore; screenshot: sezione coerente col resto.

## Prossimo passo atomico
Seconda lacuna: **decking** (cariche multiple nello stesso foro separate da
borraggio/aria) — geometria+carica, ricalcolo carica totale/PF. Poi terza:
**report volata stampabile (PDF via stampa browser)**.

## Blocchi
Le funzioni ⛔ della matrice (fotogrammetria/MWD/boretrack/frammentazione
misurata/movimento banco/detonatori/AI) richiedono hardware/backend/dati/ML:
NON fattibili in browser, documentate per decisione fondatore. #321 unico branch.

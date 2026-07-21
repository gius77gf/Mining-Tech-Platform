# Checkpoint — 2026-07-22T02:15:00Z

## Tipo
unit-complete (Genesi P1.3 — export piano di innesco XML IREDES-like)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi export piano di innesco)

## Completato
Fallback #2 / direttiva fondatore #2 (raggiungere il livello dei competitor su
Genesi). Implementata la P1.3 della roadmap competitor in versione onesta:
- `apps/genesi/genesi.html`: nuovo pulsante `#btn-innesco-xml` nel Progetto 2D
  ("Esporta piano di innesco (XML IREDES-like)"); helper `_xmlEsc()` (escape
  &<>"'); handler che genera un XML `BlastPlan`:
  - `<PlanData>`: maglia B/S, diametro, esplosivo, innesco (id+nome), sequenza,
    ritardo foro/fila, ultima detonazione, MIC (max carica in 8 ms).
  - `<Holes>`: un `<Hole>` per foro (id, seq) con posizione x/y, profondità,
    carica, borraggio, ritardo della sequenza; fori ordinati per tempo.
  Prima di esportare rigenera la maglia se vuota (`genMaglia2D`) e ricalcola i
  tempi (`computeSeq2D`).
È una BOZZA di interscambio in stile IREDES, NON conformità certificata: lo
dichiara un commento nell'XML e il titolo del pulsante. Chiude il gap "export
verso detonatori elettronici / software terzi" dei competitor (O-Pitblast,
ShotPlus) lato browser, senza toccare il motore fisico.

Verifica: syntax inline Genesi OK (stesso check della CI); Playwright (WebGL
swiftshader) — click sul pulsante → XML catturato (18 fori), header con
maglia 4.50×3.50, diametro 89, MIC 50 kg, ultima detonazione 425 ms; apostrofo
di "tubo d'urto" correttamente escapato in `d&apos;urto`; DOMParser =
WELL_FORMED (nessun parsererror); nessun errore di pagina. Screenshot del
pulsante catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, valutare P1.2 (import boretrack) o tornare alle seconde
iterazioni UX (stati vuoti/validazioni) e test aggiuntivi. Burden-reale P1.1
resta RIMANDATO (segno geometrico da chiarire col fondatore).

## Blocchi
Burden-reale Genesi (P1.1): conferma geometria del fronte. Motore fisico: non
toccare. Core Fasi 3-4: gated (auth Firebase). Dati default sensibili +
mitigazione password: non toccare senza conferma.

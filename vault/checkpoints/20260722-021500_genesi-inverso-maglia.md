# Checkpoint — 2026-07-22T02:15:00Z

## Tipo
unit-complete (Genesi punto 1/6 — calcolo inverso maglia da pezzatura-obiettivo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi inverso maglia)

## Completato
Punto previsto #1 (con via libera esplicito del fondatore "completa tutti i
punti"): dato un x50 OBIETTIVO, Genesi propone burden e spaziatura invertendo
la Kuznetsov (x50 = A·pf^-0.8·kg^(1/6)·(115/RWS)^(19/30)).
- `apps/genesi/genesi.html`: espone A/RWS/kg/prof/sbRatio in `frag`; funzioni
  `_inverseMesh(x50)` e `_invUpdate()`; UI `#invtool` nel pannello params (input
  x50 obiettivo → "B×S · PF") con guardia di realismo e AVVERTENZA in evidenza
  (proposta di partenza, verifica col fronte, non sostituisce il fochino).
  Aggiornata anche al rigenerare la volata. Nessun tocco al modello diretto.

Verifica: syntax OK; ROUND-TRIP in Node con rock factor realistici (A=3/7/11):
ogni x50 obiettivo torna a se stesso e maglie/PF realistiche (es. A=7, x50=35 →
B 3.15×S 3.62, PF 0.34 → ricalcolo 35.0 cm). La UI (HUD 3D) non è renderizzabile
headless: si vede nel deploy-preview.

## Prossimo passo atomico
Punto #2: import IREDES (round-trip col piano esportato #311). Poi #3 fini JKMRC
sulla curva, #4 pezzatura-da-foto (watershed), #5 viewer point-cloud, #6 ML
(documentare che serve un modello pre-addestrato).

## Blocchi
#321 estetica: attende il fondatore. Motore fisico diretto: non toccare (qui
solo inverso + avvertenze). Tutto in #321 (branch unico).

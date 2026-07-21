# Checkpoint — 2026-07-22T20:00:00Z

## Tipo
unit-complete (deep-research competitor open-source → sintesi per Genesi · direttiva fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — doc emulazione open-source Genesi)

## Completato
Eseguita la deep-research richiesta ("su quali fonti open source si basano i
competitor, emula in stile Genesi") e sintetizzata in un documento onesto e
prioritizzato: `docs/GENESI_OPENSOURCE_EMULAZIONE.md`.
- 108 agenti, 25 fonti verificate 3-0. Findings principali (per impatto/
  fattibilità in un'app browser senza backend):
  1. Modelli frammentazione (Kuz-Ram/KCO/Swebrec/JKMRC) = JS puro; Genesi li ha
     già, incrementi = curva+fini e calcolo inverso maglia-da-pezzatura (⚠️
     quest'ultimo è consiglio operativo → gated su conferma fondatore, safety).
  2. Rendering point-cloud/mesh nel browser: Potree (BSD-2, su Three.js come
     Genesi), deck.gl Tile3DLayer, copc.js+laz-perf (WASM). Lavoro medio.
  3. Frammentazione da immagine ML (SAM/MaskRCNN/ResNet50) — inferenza browser
     ONNX/TF.js, training offline; versione leggera = watershed OpenCV.js.
  4. IREDES/WITSML: schema XML aperto (Genesi ha export bozza #311).
  5. Fotogrammetria SfM: open ma server/desktop, NON browser (consumare output).
  6. Vibrazioni Devine/USBM: formule scalari (Genesi le ha).
- Doc onesto: passi, non parità; caveats (equazioni da riconfermare sul
  full-text, metriche ML da singoli studi, licenze da verificare); nota che due
  agenti hanno tentato accessi rete anomali → usato solo il contenuto tecnico.

## Prossimo passo atomico
Attendere la scelta del fondatore su: (a) direzione estetica #321; (b) quale
emulazione partire per prima (proposta d'ordine nel doc: sicuro subito = curva
Swebrec+fini / watershed base; con conferma = calcolo inverso maglia; medio =
viewer point-cloud). Nei tempi morti: deep-research a rotazione sulle altre app
(ora prevista dalla skill).

## Blocchi
#321 (estetica) aspetta il giudizio del fondatore. Calcolo inverso maglia e
altri "consigli operativi" Genesi: gated (safety). Motore fisico: non toccare.

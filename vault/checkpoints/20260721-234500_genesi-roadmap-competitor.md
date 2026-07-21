# Checkpoint — 2026-07-21T23:45:00Z

## Tipo
unit-complete (ricerca — Genesi vs competitor + roadmap feature)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — docs/GENESI_ROADMAP_COMPETITOR.md)

## Contesto
Direttiva del fondatore (21/07): riprendere la ricerca su Genesi + rivali per
raggiungere il loro livello. Il workflow deep-research è fallito per un limite
tecnico dell'ambiente (StructuredOutput dei sotto-agenti) → ho fatto la ricerca
MANUALMENTE con WebSearch (7 query mirate sui fronti chiave), verificando cosa
Genesi ha già (grep del codice).

## Completato
`docs/GENESI_ROADMAP_COMPETITOR.md`: confronto con Orica/Maptek/Maxam/Strayos/
O-Pitblast. CORREZIONE IMPORTANTE: una prima grep bacata (`\|` in regex estesa)
mi aveva fatto credere che Genesi non avesse le vibrazioni; rileggendo il codice
Genesi HA GIÀ previsione vibrazioni (PPV Devine/USBM, MIC 8ms, scaled distance,
soglie), airblast dB, detonatori elettronici/elettrici, deviazione fronte/piede.
I gap VERI (verificati) sono il "chiudere il cerchio col dato reale":
- **P0 (browser)**: P0.1 **riconciliazione previsto-vs-reale** (gap #1, come
  Maptek BlastLogic), P0.2 **signature-hole** (superposizione d'onda da
  sismogramma reale, affianca il Devine già presente).
- **P1 (browser)**: burden reale per foro dal 3D, import deviazione fori
  (boretrack), export detonatori/IREDES.
- **P2 (backend/dati)**: frammentazione da immagine muckpile, ML (XGBoost).
Distingue client vs backend; con fonti; non tocca il motore fisico.

## Prossimo passo atomico
Aprire PR (correzione doc). Il primo passo implementativo consigliato è
**P0.1 riconciliazione previsto-vs-reale** in Genesi (le vibrazioni ci sono
già). Poi, per direttiva del fondatore, alzare la qualità delle altre app.

## Blocchi
Motore fisico di Genesi: non toccare senza conferma. Backend (P2): fase
successiva. Isolamento core Fasi 3-4: gated.

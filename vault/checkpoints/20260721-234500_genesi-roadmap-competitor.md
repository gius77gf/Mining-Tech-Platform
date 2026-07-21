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
`docs/GENESI_ROADMAP_COMPETITOR.md`: confronto con Orica (ShotPlus/BlastIQ/AVM/
FRAGTrack), Maptek BlastLogic, Maxam RIOBLAST, Strayos, O-Pitblast; analisi dei
GAP reali di Genesi (verificati nel codice: mancano previsione vibrazioni/PPV,
signature-hole, validazione frammentazione da immagine, riconciliazione,
airblast, boretrack, IREDES) e roadmap prioritizzata:
- **P0 (browser, alto impatto)**: previsione vibrazioni scaled-distance/PPV
  (USBM), airblast dB, timing/finestra sicurezza.
- **P1 (browser, più lavoro)**: signature-hole (superposizione d'onda),
  riconciliazione previsto-vs-reale, burden reale dal 3D del fronte.
- **P2 (backend/dati)**: frammentazione da immagine muckpile, ML (XGBoost),
  boretrack, export IREDES/detonatori.
Distingue client-side vs backend; con fonti. Rispetta il vincolo "non toccare
il motore fisico".

## Prossimo passo atomico
Aprire PR. Il primo passo implementativo consigliato è **P0.1 previsione
vibrazioni (PPV, scaled distance)** in Genesi — matematica, lato browser,
riusando i coefficienti di Sentinella per coerenza. Poi, per direttiva del
fondatore, alzare la qualità delle altre app.

## Blocchi
Motore fisico di Genesi: non toccare senza conferma. Backend (P2): fase
successiva. Isolamento core Fasi 3-4: gated.

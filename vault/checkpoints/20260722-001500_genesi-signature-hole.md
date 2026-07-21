# Checkpoint — 2026-07-22T00:15:00Z

## Tipo
unit-complete (feature Genesi — P0.2 signature-hole)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi: signature-hole)

## Completato
Seconda feature della roadmap Genesi (P0.2), verso il livello dei rivali. Nuovo
pannello "〰️ Signature-hole (vibrazioni da onda reale)":
- Importa la registrazione di un FORO SINGOLO (CSV tempo_ms;ampiezza) e la
  SOMMA ritardata secondo i tempi di detonazione della volata (da D2.holes se
  editati, altrimenti sintetizzati da perRow/file/ritardo/ritardoFila) →
  PPV COMPOSITO previsto. È il metodo dei big (Orica AVM), più preciso della
  sola legge di Devine perché usa l'onda reale del sito.
- Mostra: PPV foro singolo (picco onda), PPV composito, amplificazione, limite
  di norma (SUPERATO in rosso), confronto con la stima Devine; sparkline SVG
  del composito; export CSV del composito.
- Tutto lato browser; NON tocca il motore fisico.

Verifica: node --check OK; Playwright — onda sintetica (241 campioni, 18 fori)
→ singolo 9,23 → composito 12,39 mm/s (×1,34 dalla superposizione dei ritardi),
sparkline resa, nessun pageerror. Screenshot catturato.

## Prossimo passo atomico
Aprire PR (deploy Genesi). Roadmap: P1 (burden reale dal 3D, boretrack, export
IREDES/detonatori). Poi qualità delle altre app (sequenza fondatore).

## Blocchi
Motore fisico Genesi: non toccare. P2 (immagine/ML): backend. Core Fasi 3-4:
gated.

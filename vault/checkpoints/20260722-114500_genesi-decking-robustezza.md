# Checkpoint — 2026-07-22T11:45:00Z

## Tipo
unit-complete (Genesi — fix robustezza decking: foro troppo corto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — fix decking foro corto)

## Completato
Revisione di robustezza (never-stop, fallback #5) del codice appena scritto
questa sessione. Trovato e corretto un caso limite REALE nel decking: con un
foro poco profondo e borraggio di testa alto (raggiungibile dalla UI: H=6 m,
borraggio=6 m, 3 deck), la zona carica diventa quasi nulla e il "borraggio tra
deck" risultava NEGATIVO (−0,3 m) nel diagramma — dato fuorviante.
- `apps/genesi/genesi.html`: nel blocco decking della scheda, se la zona carica
  `_Lc` è minore del minimo sensato (`N·0,4 + (N−1)·0,3` m), ora mostra un
  AVVISO onesto ("Decking N deck: foro troppo corto…, riduci deck/borraggio o
  aumenta profondità") invece del diagramma; nel ramo normale il borraggio
  intermedio è comunque clampato a ≥0,2 m. Nessun gap negativo possibile.

Verifica: syntax CI OK; logica in Node (normale invariato gap 1.0/deck 3.23;
casi limite → warn=true, niente gap negativo); Playwright — H6/stem6/3deck mostra
l'avviso "troppo corto", H13/stem2.5/3deck mostra il diagramma, nessun errore.

## Prossimo passo atomico
Continuare la revisione di robustezza delle altre 2 funzioni nuove (stima
costi: già guardata da divisioni per zero; report: popup bloccato → toast, testo
utente escapato). Poi: rotazione ricerca su un'altra app (Conti/Flotta/Campo/
Terra) o altri casi limite. Aggiornare la roadmap con la sessione competitor.

## Blocchi
Funzioni ⛔ della matrice competitor: hardware/backend/dati/ML, gated. #321 branch unico.

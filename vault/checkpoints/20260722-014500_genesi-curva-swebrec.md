# Checkpoint — 2026-07-22T01:45:00Z

## Tipo
unit-complete (Genesi — overlay KCO/Swebrec sulla curva granulometrica)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi curva Swebrec overlay)

## Completato
Completata la curva granulometrica con il SECONDO modello, come raccomanda la
deep-research (mostrare Swebrec accanto a Kuz-Ram): ora la curva % passante
mostra ENTRAMBE le curve.
- `apps/genesi/genesi.html`: `_fragCurveSVG(fr, sw)` disegna anche la curva
  KCO/Swebrec P(x)=1/(1+[ln(xmax/x)/ln(xmax/x50)]^b) tratteggiata, con legenda
  (Kuz-Ram pieno / KCO-Swebrec tratteggiato). I parametri xmax/b sono calcolati
  con la STESSA formula della scheda (_blk da D2.frat, xmax, b) → onesto, non
  stimato. La coda grossolana Swebrec è più realistica del Rosin-Rammler.
Nessun tocco alla fisica (usa i valori/formule già presenti; è visualizzazione).

Verifica: syntax inline OK; Node — 2 path (Kuz-Ram + Swebrec), Swebrec monotona
0→1, legenda presente; reso visivo con screenshot (le due curve divergono nella
coda grossolana, come atteso).

## Prossimo passo atomico
#321 resta aperta per il giudizio estetico del fondatore (contiene: estetica,
curva granulometrica [ora a 2 modelli], skill-ricerca, doc-emulazione). Ricerca
Scudo in background (fallback Agent WebSearch): alla fine → doc di sintesi.
Prossime emulazioni sicure: pezzatura-da-foto watershed (più grande).

## Blocchi
#321 estetica: attende il fondatore. Calcolo inverso maglia: gated (safety).
Motore fisico: non toccare. Branch stacking: offerto split al fondatore.

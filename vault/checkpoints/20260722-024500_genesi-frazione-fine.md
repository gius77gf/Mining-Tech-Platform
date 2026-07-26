# Checkpoint — 2026-07-22T02:45:00Z

## Tipo
unit-complete (Genesi punto 3/6 — frazione fine <2.5cm dai due modelli)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi frazione fine)

## Completato
Punto previsto #3 (JKMRC / "fini"): sotto il fragchip Genesi ora mostra la
FRAZIONE FINE (% passante sotto 2.5 cm) calcolata da ENTRAMBI i modelli già
presenti — Kuz-Ram (Rosin-Rammler `1-exp(-(soglia/xc)^n)`) e KCO/Swebrec
`1/(1+[ln(xmax/soglia)/ln(xmax/x50)]^b)`. Riusa i parametri già calcolati
(fr.xc, fr.n, _swXmax, _swB, fr.x50): nessun tocco alla fisica, è lettura.
- `apps/genesi/genesi.html`: nel render del fragchip, riga "Fini <2.5 cm:
  X% Kuz-Ram · Y% Swebrec".

Onestà del dato: Swebrec mostra PIÙ fini di Kuz-Ram (nel campione 10% vs 2%),
che è proprio il punto noto in letteratura (Kuz-Ram sottostima la coda fine,
per questo esiste il KCO/Swebrec). Utile all'utente per capire la resa fine
senza dare un consiglio operativo.

Verifica: syntax inline OK (check python della CI); logica in Node — entrambe
le % in [0,100]; Swebrec ≥ Kuz-Ram sui fini; una volata più fine (x50 minore)
mostra più fini (11% vs 2%). Coerente.

## Prossimo passo atomico
Restano i punti "pesanti": #4 pezzatura-da-foto (watershed / OpenCV.js), #5
viewer point-cloud (Potree/deck.gl), #6 ML frammentazione (serve modello
pre-addestrato → documentare). Valutare la base watershed (più leggera) come
prossimo, oppure sintetizzare la ricerca Scudo (Agent WebSearch) in doc.

## Blocchi
#321 estetica: attende il giudizio del fondatore (promessa). Motore fisico
diretto: non toccare. Tutto sul branch unico #321.

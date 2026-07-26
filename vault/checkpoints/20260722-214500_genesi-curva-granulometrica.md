# Checkpoint — 2026-07-22T21:45:00Z

## Tipo
unit-complete (Genesi — curva granulometrica · emulazione sicura da deep-research · ciclo serale)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Genesi curva granulometrica)

## Completato
Ciclo serale (21:42 UTC): partito dalla REVISIONE del lavoro del giorno →
verificato che le modifiche estetiche di #321 non regrediscono la home (stili
globali `.btn`/input non la toccano); modale migliorato; XSS core corretta;
test isolamento verdi; YAML CI valido. Revisione PULITA.

Poi, prima emulazione "sicura subito" dalla deep-research
(GENESI_OPENSOURCE_EMULAZIONE.md, punto 1): **curva granulometrica cumulata**.
Genesi aveva la matematica Kuz-Ram (xc, n, x20/x50/x80) ma mostrava solo i
NUMERI. Aggiunta la CURVA % passante vs dimensione:
- `apps/genesi/genesi.html`: funzione `_fragCurveSVG(fr)` che disegna in SVG la
  curva Rosin-Rammler P(x)=1-exp(-(x/xc)^n) dai valori GIÀ calcolati (nessun
  tocco alla fisica, nessun consiglio operativo), con griglia 20/50/80% e i
  punti x20/x50/x80 marcati, in stile ambra Genesi; agganciata al `fragchip`.
Emula il grafico granulometrico dei competitor lato browser, onestamente
(è visualizzazione del previsto Kuz-Ram, non una misura).

Verifica: syntax inline OK; logica in Node (path presente, 3 punti, curva
monotona crescente = forma Rosin-Rammler corretta); reso visivo con screenshot.

## Prossimo passo atomico
Mantenere #321 aperta per il giudizio estetico del fondatore (promessa). La
curva si aggiunge al branch (PR #321 ora ha 4 unità: estetica, skill-ricerca,
doc-emulazione, curva) — offerto al fondatore di separarle. Prossime emulazioni
sicure: overlay Swebrec sulla curva (serve xmax/b dalla scheda); base pezzatura
da foto watershed/OpenCV.js. Con conferma fondatore: calcolo inverso maglia.

## Blocchi
#321 estetica aspetta il fondatore. Calcolo inverso maglia e consigli operativi:
gated (safety). Motore fisico: non toccare. Branch stacking: offerto split.

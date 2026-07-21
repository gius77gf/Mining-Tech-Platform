# Checkpoint — 2026-07-21T12:05:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra classe accuratezza + banda volume)

## Completato
Terra — **classe di accuratezza e banda di incertezza** del volume (passo 1–2
del backlog di RICERCA_ACCURATEZZA_RILIEVI.md): rende i volumi da drone onesti
e difendibili invece di spacciarli per esatti.
- terra-data.js: `classeAccuratezza(rilievo)` (survey-grade / indicativo / n.d.
  da metodo+GSD, con tolleranza tipica ±2% / ±8%) e `bandaVolume(volumeM3,
  tolleranzaPct)` → {volume, banda, min, max}. Pure e testabili.
- index.html: badge di classe (Survey-grade/Indicativo) accanto allo stato del
  rilievo + volume mostrato come "19.400 m³ ± 388". Tooltip "da confermare coi
  checkpoint".
- run-kpi.mjs: +2 test. KPI 134→136; totale CI 253→255.
Verifica: KPI 136/0, syntax OK, Playwright (r1 RTK+GCP GSD2 → "19.400 m³ ± 388"
+ badge Survey-grade; pianificato senza badge; nessun errore).

## Stato roadmap
6 app robuste, cruscotti coerenti, review complete, seconde iterazioni complete,
2 ricerche→feature (HSE→Scudo preset, accuratezza→Terra classe/banda) + doc
fondatore. Suite 255.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI: altre
ricerche→feature, o rifiniture, o estensione test.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

# Checkpoint — 2026-07-21T15:40:00Z

## Tipo
unit-complete (ricerca → feature — Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra libreria densità di riferimento)

## Completato
Ricerca→feature: `vault/RICERCA_DENSITA_MATERIALI.md` (densità in situ tipiche
per litotipo, fonti concordanti Geostru / Testo Unico Sicurezza, framing onesto
"da confermare col laboratorio"). Feature:
- `terra-data.js`: `DENSITA_PRESET` (10 litotipi: calcare compatto/tenero,
  dolomia, basalto, granito, arenaria, marmo, gesso, argilla, sabbia-ghiaia) +
  `presetDensita(chiave)` che ritorna il preset con `daVerificare: true` (o
  null). Stesso schema di SOGLIE_PRESET/presetSoglia di Sentinella.
- `index.html`: menù "Materiale" accanto al campo densità nel calcolo del
  valore; scelto un litotipo riempie la densità col valore tipico e mostra una
  nota con la fonte e "da confermare col laboratorio". Se l'utente modifica la
  densità a mano, il menù torna neutro.
- `run-kpi.mjs`: +1 test (presetDensita valore+daVerificare, null su chiave
  ignota, range/uniche su tutti i preset). KPI 154→155; CI 273→274.
Verifica: KPI 155/0, syntax module OK, Playwright (Terra/Valore: basalto →
densità 2.9, nota con fonte, valore ricalcolato 79.400 m³ → 230.260 t →
€ 2.763.120; nessun errore).

## Stato roadmap
6 app verticali con incrementi; Terra ora ha la libreria densità (numeri di
valore più affidabili). Suite 274. Data-layer verificato solido.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

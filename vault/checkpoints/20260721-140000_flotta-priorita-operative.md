# Checkpoint — 2026-07-21T14:00:00Z

## Tipo
unit-complete (feature + fix di copertura — Flotta)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Flotta priorità operative del giorno)

## Completato
La dashboard di Flotta ("Attenzione") univa già mezzi non-operativi +
manutenzioni urgenti, ma con logica INLINE non testata, cap silenzioso a 4 e
SENZA i ricambi sotto scorta (un pezzo a zero non compariva: gap reale).
- `flotta-data.js`: `prioritaOperative(mezzi, manutenzioni, ricambi, oggi)`
  pura e testabile. Unisce (1) manutenzioni urgenti a data E a ore motore
  (confronto col contatore del mezzo), (2) ricambi sotto scorta (esaurito =
  danger), (3) mezzi fermi/in verifica. Ogni voce {gravita, categoria, titolo,
  dettaglio, badge}, ordinata danger-first. Riusa urgenza/urgenzaOre/sottoScorta.
- `index.html`: la dashboard ora rende `prioritaOperative` (con esc su titolo/
  dettaglio/badge), niente cap silenzioso, ricambi inclusi. Ripristinato il
  piccolo helper locale `urgDi` per i badge della lista Manutenzioni.
- `run-kpi.mjs`: +2 test (mix manutenzione a ore + ricambio esaurito + mezzo
  fermo, ordine danger-first e conteggi; lista vuota se tutto ok). KPI 146→148;
  CI 265→267.
Verifica: KPI 148/0, syntax module OK, Playwright — la dashboard mostra
"Denti benna ESAURITO" e "Dumper D3 FERMO" (danger) in cima, poi i warn;
nessun errore app. I ricambi ora compaiono (prima assenti).

## Stato roadmap
6 app robuste, revisione UI pulita, dashboard Flotta ora completa e testabile.
Suite 267.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

# Checkpoint — 2026-07-21T13:10:00Z

## Tipo
unit-complete (feature — Scudo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo promemoria scadenze pronto)

## Completato
Stesso schema del sollecito di Conti (#247), applicato alla sicurezza: dal
badge di scadenza al TESTO pronto da inviare al lavoratore.
- `scudo-data.js`: `testoPromemoria(scadenza, lavoratore, oggi)` pura e
  testabile. Genera il promemoria/convocazione (email/SMS) per la scadenza
  scaduta o in scadenza di un lavoratore (visita medica, corso, patentino…),
  con data e giorni di ritardo/anticipo. null se regolare, senza lavoratore o
  senza data. Formattatore data puro (dataIt).
- `index.html`: bottone "✉ Promemoria" solo sulle scadenze non-regolari di un
  lavoratore; al click copia il testo negli appunti (clipboard API + fallback)
  e lo conferma in import-esito.
- `run-kpi.mjs`: +2 test (contenuto scaduta "19 giorni fa" + in scadenza "tra
  20 giorni"; null nei casi regolare/senza nome/senza data). KPI 142→144;
  CI 261→263.
Verifica: KPI 144/0, syntax module OK, Playwright (Scudo/Scadenze: 4 bottoni
sulle non-regolari con lavoratore, clipboard = promemoria completo, nessun
errore app).

## Stato roadmap
6 app robuste. Follow-up "testo pronto da inviare" ora su Conti (sollecito) e
Scudo (promemoria). Suite 263. Isolamento multi-tenant solido.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI
(altre rifiniture prodotto / ricerche→feature / test / revisione).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

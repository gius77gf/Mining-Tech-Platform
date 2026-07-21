# Checkpoint — 2026-07-21T13:30:00Z

## Tipo
unit-complete (feature — Conti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti estratto conto cliente)

## Completato
Completa il flusso crediti al livello CLIENTE (dopo il sollecito per singola
fattura, #247): estratto conto di tutte le fatture aperte di un cliente.
- `conti-data.js`: `estrattoContoCliente(cliente, fatture, oggi, tasso)` pura e
  testabile. Testo pronto (email/PEC) con l'elenco delle fatture aperte del
  cliente (importo, scadenza, ritardo, mora per fattura) e i totali: aperto,
  scaduto, interessi di mora 231/2002, spese €40 × fatture scadute, totale
  dovuto. null se il cliente non ha fatture aperte o nome vuoto. Data
  dell'estratto da componenti LOCALI (niente off-by-one UTC). Riusa
  euroIt/dataIt/interessiMora già presenti.
- `index.html`: bottone "✉ Estratto" su ogni riga dell'esposizione per cliente
  (lookup per indice, non per nome → niente injection nell'attributo); al click
  copia il testo (clipboard API + fallback) e conferma in mode-note.
- `run-kpi.mjs`: +2 test (contenuto con totali/mora/§40 e filtri cliente/
  incassata; null nei casi cliente inesistente/nome vuoto/solo incassate).
  KPI 144→146; CI 263→265.
Verifica: KPI 146/0, syntax module OK, Playwright (Conti/Report: 4 bottoni
esposizione, clipboard = estratto Edilcave con "Totale dovuto € 18.406,16",
nessun errore app).

## Stato roadmap
6 app robuste. Flusso crediti Conti ora a 3 livelli: aging/esposizione (vista),
sollecito per fattura (#247), estratto conto per cliente (questo). Suite 265.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI —
valutare un giro di revisione qualità/sicurezza sulle UI recenti (fallback #5)
o nuove rifiniture in altre app.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

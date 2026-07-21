# Checkpoint — 2026-07-21T16:15:00Z

## Tipo
unit-complete (feature — Terra, chiude nota #2 review data-layer lato live)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — import rilievi CSV con colonna fronte)

## Completato
La review del data-layer aveva notato che i rilievi importati da CSV non
potevano essere associati a un fronte (fronteId sempre null), quindi non
contavano nel volume per fronte. Aggiunta la colonna facoltativa `fronte`.
- `terra-data.js`: `parseRilieviCsv` legge una 5ª colonna facoltativa `fronte`
  (nome). Riportata SOLO se presente → le righe a 4 colonne restano identiche
  (retrocompatibile, nessun test rotto). Colonne: data;volumeM3[;metodo;gsd;
  fronte].
- `index.html`: l'import risolve il nome fronte → fronteId (match sul nome,
  come Scudo per i lavoratori); i fronti non riconosciuti restano non assegnati
  e vengono contati nel messaggio di esito.
- `run-kpi.mjs`: +1 test (colonna fronte estratta se presente; assente = nessuna
  chiave). KPI 160→161; CI 280→281.
Verifica: KPI 161/0, syntax module OK, Playwright (upload CSV: 2 rilievi, "1 con
fronte non riconosciuto"; Fronte Nord 41k → 46k m³ dopo l'import del rilievo da
5000 m³; nessun errore).

## Stato roadmap
6 app verticali robuste; entrambe le note della review data-layer chiuse (demo
guard #260, import fronte qui). Suite 281. Review shared (dw-shell + SDK) in
corso.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; poi trattare gli esiti della review shared (fix eventuali).
Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

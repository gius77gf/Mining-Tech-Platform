# Checkpoint — 2026-07-21T18:45:00Z

## Tipo
unit-complete (feature — Sentinella, completamento; suite arriva a 300)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella registro volate / brogliaccio di brillamento)

## Completato
Nuova capacità per Sentinella: **registro delle volate** (brogliaccio di
brillamento), un log degli eventi di volata utile agli enti — con la distanza
scalata calcolata per ogni volata.
- `sentinella-data.js`: nuova collezione `volate` (sotto apps/sentinella/,
  coperta dalla regola generica orgCollection — nessun gate). Helper puri
  `riepilogoVolate(volate, oggi)` (totale, questo mese, kg del mese, ultima
  data, contestazioni) e `parseVolateCsv(text)` (import, numerici via numIt,
  esito default regolare). API live+demo estese; 2 volate demo.
- `index.html` (pagina Registri): sezione "Registro volate" con riepilogo,
  lista (fori/kg/max per ritardo/SD per volata via scaledDistance, badge
  esito, rimozione), form di registrazione, import/export CSV (csvCell su
  fronte/note). Campi utente escapati.
- `run-kpi.mjs`: +3 test (riepilogoVolate conteggi/kg mese/contestazioni; vuoto;
  parseVolateCsv). `run-demo.mjs`: integrità DEMO.volate. KPI 164→167; CI
  297→300.
Verifica: KPI 167/0, demo 7/0, syntax OK; Playwright — riepilogo "2 volate,
890 kg"; SD 75.4 per la prima (=320/√18); import di una volata con contestazione
→ "3 · 1.390 kg · 1 CON CONTESTAZIONE"; nessun errore.

## Stato roadmap
6 app verticali; Sentinella ora ha il registro volate (log + SD + import/export).
Suite 300. Audit sicurezza completo.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie ESATTE: gated. (Il
registro è un LOG, non una soglia di legge: non gated.)

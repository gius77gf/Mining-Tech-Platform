# Checkpoint — 2026-07-21T15:00:00Z

## Tipo
unit-complete (feature + fix severità — Sentinella)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella priorità di conformità)

## Completato
La dashboard "Allerte" di Sentinella univa già misure non conformi +
adempimenti entro 30 gg, ma INLINE (non testato), con cap silenzioso a 4 e —
bug reale — un adempimento SCADUTO mostrato come "warn" (badge giallo con
giorni negativi), sottostimando un termine di legge mancato.
- `sentinella-data.js`: `prioritaConformita(monitoraggi, adempimenti, oggi)`
  pura e testabile. Superamento=danger, attenzione=warn; adempimento scaduto=
  DANGER ("scaduto da N gg"), in scadenza entro 30 gg=warn. Ordina danger-first.
  Data adempimenti formattata GG/MM/AAAA (dataIt puro).
- `index.html`: la dashboard ora rende `prioritaConformita` (esc su titolo/
  dettaglio/badge), niente cap silenzioso.
- `run-kpi.mjs`: +2 test (mix superamento + attenzione + adempimento scaduto=
  danger + in scadenza; vuoto se tutto conforme). KPI 152→154; CI 271→273.
Verifica: KPI 154/0, syntax module OK, Playwright (Sentinella dashboard:
Superamento V2 danger in cima, poi warn; nessun errore). Il path "scaduto=
danger" è coperto dai test (demo senza adempimenti scaduti).

## Stato roadmap
TUTTE e 6 le app verticali con incremento in questa sessione (ora anche
Sentinella). Suite 273.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

# Checkpoint — 2026-07-21T08:55:00Z

## Tipo
unit-complete (bugfix da review adversarial)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — fix import CSV: virgolette + numeri all'italiana)

## Completato
Una review adversarial (subagent) sui parser CSV ha trovato DUE bug reali,
confermati con test a runtime. Corretti entrambi:
1. **`split(";")` ingenuo** in tutti e 6 i parser: un campo che contiene `;`
   (es. cliente "Rossi; & Figli") spostava le colonne e faceva SCARTARE la
   riga in silenzio — anche per i CSV esportati dall'app stessa (l'export
   mette le virgolette con csvCell, ma l'import le ignorava). Fix: uso di
   `parseCsvLine` (già presente in dw-shell, gestisce le virgolette) al posto
   di `split(";")` in tutti e 6 i parser (conti/terra/sentinella/flotta/
   campo/scudo).
2. **Numeri all'italiana**: "18.300,50" → NaN → riga scartata; "19.400"
   (punto migliaia) → 19.4 (sotto-conteggio 1000× in Terra). Fix: nuovo
   helper condiviso `numIt` in dw-shell (l'ultimo separatore è il decimale;
   punto isolato resta decimale). Applicato ai campi numerici dei parser.
Refutati (nessun problema): BOM (trim toglie U+FEFF), CSV-injection in export
(già protetta da csvCell), header non riconosciuto (scartato dai filtri).
- run-kpi.mjs: +4 test (numIt + round-trip con `;` per conti/sentinella/terra).
  KPI 115→119; totale CI 228→232.
- docs/ONBOARDING_DATI.md: nota su numeri italiani e testo con `;` tra virgolette.
Verifica: KPI 119/0, syntax OK su tutti i moduli, import end-to-end in browser
(Conti: cliente "Rossi; & Figli" + importo 18.300,50 importati correttamente,
nessun errore di caricamento del modulo con il nuovo import statico di dw-shell).

## Stato roadmap
6 app verticali con import+export CSV ROBUSTO (virgolette + numeri IT) + suite
232 senza flaky + doc fondatore indicizzati.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI:
altre rifiniture, casi limite, o nuove schede.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

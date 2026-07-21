# Checkpoint — 2026-07-21T12:55:00Z

## Tipo
unit-complete (feature — Conti, completa la mora)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti testo del sollecito pronto)

## Completato
Naturale completamento degli interessi di mora (#245): dal NUMERO al TESTO.
- `conti-data.js`: `testoSollecito(fattura, oggi, tasso)` pura e testabile.
  Genera la lettera di sollecito pronta (email/PEC) con estremi fattura,
  giorni di ritardo, interessi di mora 231/2002, €40 art. 6 e TOTALE dovuto.
  null se la fattura non è scaduta o dati non validi. Formattatori interni
  puri (euroIt/dataIt) → test deterministici senza ICU. La nota "da confermare
  col commercialista" resta nell'UI, non nella lettera al cliente.
- `index.html`: bottone "✉ Sollecito" solo sulle fatture insolute (ritardo>0);
  al click copia il testo negli appunti (clipboard API + fallback textarea/
  prompt) e lo comunica in mode-note.
- `run-kpi.mjs`: +2 test (contenuto lettera con mora €66,16 e totale €18.406,16;
  null nei casi non scaduta/importo0/senza scadenza). KPI 140→142; CI 259→261.
Verifica: KPI 142/0, syntax module OK, Playwright (Conti/Fatture: bottone solo
sull'insoluta Edilcave, clipboard = lettera completa "Oggetto: sollecito…",
nessun errore app).

## Stato roadmap
6 app robuste, seconde/terze iterazioni, 3 ricerche→feature + questo follow-up.
Suite 261. Isolamento multi-tenant verificato solido.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI con
nuove unità (rifiniture prodotto / ricerche→feature / test).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

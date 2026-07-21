# Checkpoint — 2026-07-21T19:35:00Z

## Tipo
unit-complete (feature — Terra, parità import; completa il flusso onboarding)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Terra import fronti da CSV)

## Completato
Completato l'onboarding di Terra: si possono importare i FRONTI di scavo da CSV,
così poi i rilievi importati (#261, che si collegano al fronte per nome) trovano
i fronti già presenti.
- `terra-data.js`: `parseFrontiCsv(text)` pura e testabile. Colonne
  nome;banco;quota;stato. Tiene le righe con nome; quota via numIt; stato
  attivo|sospeso (default attivo).
- `index.html` (pagina Fronti): bottone "Importa fronti (CSV)" con dedup per
  nome.
- `run-kpi.mjs`: +1 test (colonne, stato ignoto→attivo, scarto righe senza
  nome). KPI 168→169; CI 301→302.
- `ONBOARDING_DATI.md`: sezione "Terra — 1) fronti di scavo" + riga riepilogo;
  nota di caricare prima i fronti poi i rilievi.
Verifica: KPI 169/0, syntax OK; Playwright — import 3 righe (2 nuovi + 1 dup) →
fronti 3→5, "2 aggiunti, 1 già presenti (saltati)"; nessun errore.

## Stato roadmap
6 app; parità import estesa (Flotta parco, Terra fronti); Terra onboarding
completo (fronti+rilievi collegati). Suite 302.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

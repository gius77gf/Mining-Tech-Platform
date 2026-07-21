# Checkpoint — 2026-07-21T06:36:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti import fatture CSV)

## Completato
Conti — **import fatture da CSV** (onboarding: caricare le fatture esistenti
invece di riscriverle a mano).
- conti-data.js: `parseFattureCsv(text)` (numero;cliente;importo;emessa;
  scadenza[;incassata]; virgola decimale; incassata da si/true/1; scarta le
  righe senza numero/cliente/importo valido). Pura e testabile.
- index.html: pulsante "Importa fatture (CSV)" nella pagina Fatture; salta i
  numeri già presenti (no duplicati).
- run-kpi.mjs: +2 test. Suite KPI 103→105; totale CI 216→218.
Verifica: KPI 105/0, syntax OK, import end-to-end in Playwright (1 aggiunta,
1 duplicato saltato; 5→6 fatture). Coerente shell.

## Stato roadmap
Molto ampio: 6 app verticali con feature + epiche M + rifiniture + import
CSV (Flotta telemetria, Conti fatture) + test sicurezza + 4 schede di
secondo passaggio (Swebrec, SdI, telematics + closed loop). Suite CI 218.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Continuare con: altri import/
export utili, seconde iterazioni UX, o estendere le suite emulatore (SDK/
Functions/Bootstrap con casi limite), o nuove schede di ricerca. SENZA
FERMARSI.

## Blocchi
Trasmissione SdI / connettore telematics live / ciclo chiuso / Genesi
motore: gated (fondatore/backend). De-rischiati nel vault.

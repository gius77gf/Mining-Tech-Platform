# Checkpoint — 2026-07-21T12:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti esposizione per cliente)

## Completato
Conti — **esposizione per cliente** (chi chiamare per primo): totale delle
fatture non incassate per cliente, dal più esposto, con quanto è già scaduto.
L'esposizione concentrata è il rischio di credito vero.
- conti-data.js: `esposizioneClienti(fatture, oggi)` → lista {cliente, totale,
  scaduto, conto} ordinata per totale. Pura e testabile.
- index.html: sezione "Esposizione per cliente" nel Report, badge giallo se c'è
  scaduto.
- run-kpi.mjs: +2 test. KPI 136→138; totale CI 255→257.
Verifica: KPI 138/0, syntax OK, Playwright (Edilcave €18.300 scaduto in cima,
poi Stradesud/Comune/Calcestruzzi; nessun errore).

## Stato roadmap
6 app robuste, cruscotti coerenti, review complete, seconde+terze iterazioni,
2 ricerche→feature, doc fondatore. Suite 257.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Proseguire SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

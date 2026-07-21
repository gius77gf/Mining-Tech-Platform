# Checkpoint — 2026-07-21T11:35:00Z

## Tipo
unit-complete (bugfix UI)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Campo fix etichetta KPI)

## Completato
Campo — corretto un **mismatch etichetta/valore** nel Quadro: il KPI era
etichettato "Mezzi in campo" ma mostrava k.inCorso (attività in corso), e
Campo non traccia i mezzi (quelli sono in Flotta). Etichetta corretta in
"Attività in corso" + reso cliccabile (data-goto=att, data-filtro=in-corso)
come gli altri KPI. Nessun cambio di logica (kn[1]=k.inCorso era già giusto).
Verifica: Playwright ("Attività in corso=2", navigazione a page-att ok, nessun
errore). CI invariata 253.

## Stato roadmap
6 app verticali robuste, review complete, seconde iterazioni complete, +
piccolo fix di coerenza UI su Campo. Suite 253. Isolamento verificato+testato.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Pivot a ricerche/programmi
(founder chiede esplicitamente) o altre rifiniture di coerenza. SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

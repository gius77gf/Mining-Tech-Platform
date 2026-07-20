# Checkpoint — 2026-07-20T15:20:21Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bde2460

## Completato
Test input vuoti su kpiFrom di tutte e 6 le app: liste vuote → output
zeri/null sensato, senza crash (verificato prima con uno script: nessuna
divisione per zero su DSO Conti / avanzamento Terra, nessuna riduzione o
accesso su array vuoto). Protegge le organizzazioni "al giorno zero".
Eseguito run-kpi.mjs in locale: 32 passati, 0 falliti.
Suite KPI 26→32, totale 128→134; aggiornato nome job CI.

## Stato roadmap
Punto 4 (test aggiuntivi) ben avviato: confini delle funzioni di stato
+ input vuoti dei kpiFrom. Suite salita 113→134 in due unità.

## Prossimo passo atomico
Merge PR test-input-vuoti (dopo CI verde; job ora "...(134)"), riparti
branch da main. Prossimo candidato: continuare punto 4 con un test di
COERENZA sui data layer demo — verificare che ogni DEMO delle 6 app
rispetti lo schema atteso dai rispettivi kpiFrom (campi presenti e tipi),
così un refactor dei dati di esempio che rompe un KPI viene preso subito.
In alternativa passare al punto 5 (revisione qualità/sicurezza di main):
rileggere una delle app per XSS residui nei nuovi template aggiunti
oggi (i data-goto/handler sono statici, ma verificare gli esc() sui
campi utente nelle liste toccate). Scegliere UNA cosa, unità piccola,
commit+checkpoint+PR.

## Blocchi
Nessuno.

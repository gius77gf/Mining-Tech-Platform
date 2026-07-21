# Checkpoint — 2026-07-21T02:53:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Scudo livelloScadenza)

## Completato
PRIMA rifinitura verso l'epica "scadenzario con alert multi-soglia":
Scudo — **etichette di scadenza a fasce fini** nel scadenzario.
- scudo-data.js: `livelloScadenza(dataISO, oggi)` → { cls, label, giorni }
  con fasce ispirate ai promemoria 60/30/15/7/1 gg: rosso se scaduta o
  entro 7 gg, giallo entro 30, verde oltre; "scade oggi", "scaduta da N
  gg", "tra N gg". Additiva: NON tocca statoScadenza (che alimenta i KPI).
- index.html: nella lista Scadenze la meta mostra l'etichetta parlante
  accanto alla data (oltre al badge grezzo).
- run-kpi.mjs: +2 test (fasce/etichette con oggi fisso; senza data=null).
  Suite KPI 80→82; totale CI 190→192.
Verifica: KPI 82/0, syntax OK, screenshot (demo: "scaduta da 20 gg",
"tra 18 gg", "tra 42 gg"). Coerente shell.

## Stato roadmap
Backlog Visione: 9 unità "subito/S" + questa rifinitura. Restano le
epiche M/L vere (scadenzario con NOTIFICHE multi-soglia, KPI OEE, work
order+ricambi, rapportino turno, report margine, integrazioni) e il
"ciclo chiuso". Genesi frammentazione gated (motore fisico).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Prossima unità isolata a
basso rischio (a scelta): Flotta — costo/ora per mezzo (helper
`costoOrarioMezzo` dai costi già presenti) OPPURE seconda iterazione UX.
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.

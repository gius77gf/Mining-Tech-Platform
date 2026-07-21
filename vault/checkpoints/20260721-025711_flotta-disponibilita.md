# Checkpoint — 2026-07-21T02:57:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Flotta disponibilità)

## Completato
Flotta — **KPI disponibilità flotta** (% mezzi operativi), metrica "di
testa" citata nella ricerca (world-class ~92-94%).
- flotta-data.js: `disponibilitaFlotta(mezzi)` → { pct, operativi,
  totale } (pct null se nessun mezzo).
- index.html: riga "Disponibilità flotta: X% (Y su Z) · riferimento
  world-class ~92-94%" in cima al Parco mezzi.
- run-kpi.mjs: +2 test (percentuale; vuoto=null). Suite KPI 82→84;
  totale CI 192→194.
Verifica: KPI 84/0, syntax OK, screenshot (demo 67%, 4 su 6). Coerente shell.

## Stato roadmap
Serie molto ampia di unità isolate completata stanotte (research pivot +
~11 feature/rifiniture, una+ per app). Le voci "subito/S" e le rifiniture
a basso rischio sono in larga parte esaurite. Restano le EPICHE M/L vere
(scadenzari con NOTIFICHE multi-soglia, KPI OEE/turno, work order+ricambi,
rapportino turno+handover, report margine, SdI/pesa/telematics/centraline)
e il "ciclo chiuso" — richiedono più design e vanno spezzate con cura.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Valutare se iniziare una
EPICA M (es. Campo: rapportino di turno digitale — nuova collezione
rapportini strutturati) spezzandola in sotto-unità, OPPURE una revisione
consolidata di qualità/sicurezza del lavoro di stanotte (fallback punto 5).
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi frammentazione gated (motore fisico).

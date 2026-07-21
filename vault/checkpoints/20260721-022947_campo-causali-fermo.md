# Checkpoint — 2026-07-21T02:29:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Campo)

## Completato
QUINTA VOCE DEL BACKLOG "subito/S" (Roadmap di Visione):
Campo — **causali di fermo standardizzate** (base per OEE/disponibilità).
- campo-data.js: export `CAUSALI_FERMO` (9 voci tipiche: guasto,
  mancanza materiale, attesa mezzo, intasamento impianto, meteo,
  manutenzione programmata, cambio turno, sicurezza, altro) +
  `riepilogoFermi(attivita)` (conta le anomalie per causale, ordinate
  per frequenza; causale ignota/assente → "Altro").
- index.html: sulle attività in stato "anomalia" un menu causale che
  salva alla scelta (senza cambiare lo stato); sotto la lista un
  riepilogo "Fermi per causale".
- run-kpi.mjs: +3 test (conteggio+ordine, vuoto, lista causali).
  Suite KPI 70→73; totale CI 180→183.
Verifica: KPI 73/0, syntax OK, screenshot (frantoio in anomalia con
causale "Intasamento impianto" → riepilogo aggiornato). Coerente shell.

## Stato roadmap
Backlog Visione: 5 voci su 10 "subito/S" fatte (Sentinella soglie, Conti
aging, Scudo idoneità, Terra valore, Campo causali). Prossime: Flotta
scadenzario predittivo leggero, Genesi 2° modello frammentazione, Conti
modulo gare, Sentinella registro volate, Terra report qualità dato.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere la voce 6:
Flotta — scadenzario di manutenzione "predittivo leggero" (proietta le
ore/giorno recenti per stimare quando servirà la prossima manutenzione a
ore motore), taglia S. Riferimento in [[Potenziale — Flotta]]. Continuare
fino a esaurimento crediti.

## Blocchi
Nessuno. Le causali standardizzate abilitano il futuro calcolo di
disponibilità/OEE per turno (epica M).

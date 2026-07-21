# Checkpoint — 2026-07-21T02:21:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Scudo)

## Completato
TERZA VOCE DEL BACKLOG "subito/S" (Roadmap di Visione):
Scudo — **giudizio di idoneità sanitaria** (D.Lgs 81/2008 art. 41).
- scudo-data.js: `idoneitaLabel(stato)` (idoneo→ok, prescrizioni→warn,
  non-idoneo→danger, n.d.→neutro), `idoneitaSuccessivo(stato)` (ciclo
  per il tap), `idoneitaCriticita(lavoratori)` (attivi non-idonei o con
  prescrizioni). L'esito è sul lavoratore; la DATA prossima visita resta
  nella scadenza "Visita medica" già esistente.
- index.html: badge idoneità sulla scheda lavoratore, tap per cambiare
  esito; le urgenze del quadro mostrano PRIMA le idoneità critiche
  (non idoneo / con prescrizioni), poi le scadenze.
- run-kpi.mjs: +3 test (label, ciclo, criticità). Suite KPI 65→68;
  totale CI 175→178.
Verifica: KPI 68/0, syntax OK, screenshot quadro (Anna Neri NON IDONEO,
Franco Riva con prescrizioni in cima alle urgenze) + lista personale.

## Stato roadmap
Backlog Visione: 3 voci su 10 "subito/S" fatte (Sentinella soglie,
Conti aging, Scudo idoneità). Prossime: Terra m³→valore, Campo causali
fermo, Flotta scadenzario predittivo leggero, ecc.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main e prendere la voce 4:
Terra — conversione m³ → tonnellate → valore (densità + fattore
shrink/swell per materiale), taglia S. Riferimento in [[Potenziale — Terra]].
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Possibile rifinitura futura: limitazioni testuali sull'idoneità
"con prescrizioni" (oggi si registra l'esito, non il dettaglio limiti).

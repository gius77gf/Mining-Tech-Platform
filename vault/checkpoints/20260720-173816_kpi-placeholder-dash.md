# Checkpoint — 2026-07-20T17:38:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1b439fe

## Completato
Coerenza/onestà UI: uniformati i segnaposto dei KPI a "—" su scudo, campo,
flotta, conti, sentinella (Terra lo faceva già). Prima mostravano numeri
finti (€42k, 11, 18%...) che in live lampeggiano prima dei dati reali. Ora
"in caricamento" onesto; refresh() riempie i valori al load. Syntax OK su
tutte e 5; Playwright: KPI popolati con valori reali dopo il load
(scudo 2/2/3/2, flotta 4/2/3/€8.4k, conti €42k/2/2/21gg).

## Stato roadmap
Tutte le 6 app ora coerenti su segnaposto KPI "—". Ciclo: filtro Flotta +
KPI→filtro, ponte Genesi (math estratta+testata+riepilogo colorato),
coerenza etichetta DSO Conti, segnaposto KPI. Suite 154.

## Prossimo passo atomico
Merge PR kpi-placeholder (dopo CI verde), riparti branch da main. Prossimo:
continuare punto 1/4/5 con UNA unità di valore reale. Candidati: (a) test
su una funzione pura non ancora coperta; (b) un'altra micro-coerenza UI
verificata; (c) revisione di un'area non ancora ripassata. Evitare churn:
scegliere solo se aggiunge valore reale, verificare, commit+checkpoint+PR.
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore
(docs/DECISIONI_WEEKEND.md).

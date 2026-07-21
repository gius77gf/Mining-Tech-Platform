# Checkpoint — 2026-07-21T03:26:12Z

## Tipo
unit-complete (rifinitura)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Scudo export idoneità)

## Completato
Scudo — l'**export CSV** del personale ora include la colonna
**idoneità** sanitaria (idoneo / con prescrizioni / non idoneo / n.d.),
utile al consulente del lavoro e in audit. Solo UI (usa idoneitaLabel +
csvCell già testati): nessun nuovo test, CI resta a 204.
Verifica: syntax OK; export catturato in Playwright → intestazione
"nome;ruolo;telefono;idoneita;scadenza;data;stato" e valori corretti.

## Stato roadmap
~17 unità completate stanotte (research + feature + rifiniture +
revisione). Le voci isolate a basso rischio sono in larga parte esaurite;
le prossime di valore reale sono EPICHE M (nuove collezioni/flussi) o
GATED sul fondatore (ciclo chiuso, integrazioni, motore Genesi).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Valutare l'avvio di una
EPICA M spezzata in sotto-unità (es. Flotta work order, o Campo rapportino
turno strutturato) OPPURE seconde iterazioni/ricerca. Continuare fino a
esaurimento crediti.

## Blocchi
Ciclo chiuso e integrazioni: gated (decisione fondatore). Genesi
frammentazione: gated (motore fisico).

# Checkpoint — 2026-07-21T21:00:00Z

## Tipo
unit-complete (robustezza — idempotenza degli import "ad append" rimasti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — dedup import volate/rilievi/scadenze)

## Completato
Audit di TUTTI gli import: quelli "ad append" senza dedup raddoppiavano al
doppio click. Dopo infortuni (#284), erano rimasti tre casi; ora coperti:
- Sentinella VOLATE (registro regolatorio): firma data|fronte|nFori|kgTotali.
- Terra RILIEVI (rilievi drone): firma data|fronteId|volumeM3.
- Scudo SCADENZE (idoneità/certificati): firma lavoratoreId|tipo|dataScadenza.
Tutti scartano i doppioni sia contro i dati esistenti sia dentro lo stesso
file, con feedback allineato agli altri import ("N aggiunti, M già presenti
(saltati)").

Il piano-carico di Campo NON è un gap: SOSTITUISCE il set di lavoro (non
appende) e logga un evento di import a parte — comportamento voluto.

Verifica (Playwright, doppio import identico):
- Sentinella 2→3→3 · Terra 5→6→6 · Scudo 5→6→6, sempre "0 aggiunti, 1 già
  presenti (saltati)" al secondo, nessun errore.
Nessun nuovo test unitario (logica UI inline); CI resta 312.

## MILESTONE: tutti gli import ora idempotenti
Nessun import può più raddoppiare silenziosamente un archivio per un doppio
click — importante per i registri sensibili (HSE, volate, scadenze).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: nuova unità UX/test
o approfondimento (es. verificare che ONBOARDING_DATI.md documenti l'ordine
colonne di OGNI import in modo coerente col parser).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.

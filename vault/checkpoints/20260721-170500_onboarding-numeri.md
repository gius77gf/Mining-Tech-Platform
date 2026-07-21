# Checkpoint — 2026-07-21T17:05:00Z

## Tipo
unit-complete (doc fondatore — segue #262)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — ONBOARDING_DATI: numeri più permissivi)

## Completato
Dopo il fix di `numIt` (#262, che ora legge anche `1.234.567` / `1,234,567`
senza scartare la riga), aggiornata la guida `docs/ONBOARDING_DATI.md`: i numeri
si possono scrivere in formato italiano o inglese, con o senza separatore delle
migliaia; l'ultimo separatore è il decimale. Tolta la raccomandazione (ora
superflua) di evitare il separatore delle migliaia. Solo documentazione.

## Stato
6 app verticali; 3 review (UI, data-layer, shared) chiuse; isolamento solido;
fix condivisi dei parser CSV/numeri. Review del core index.html in corso.
Suite 294.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; poi trattare gli esiti della review del core. Proseguire.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

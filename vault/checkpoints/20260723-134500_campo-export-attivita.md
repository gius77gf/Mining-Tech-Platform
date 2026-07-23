# Checkpoint — 2026-07-23T13:45:00Z

## Tipo
unit-complete (CRUD/portabilità — export CSV lista attività, Campo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/campo/index.html)

## Completato
Censimento export CSV delle liste principali: 5 app su 6 esportavano già la lista
principale (Conti fatture, Flotta mezzi, Scudo lavoratori+scadenze, Sentinella
monitoraggi, Terra fronti+rilievi). L'UNICA mancante era **Campo attività**.
Aggiunto "Esporta attività (CSV)" — colonne titolo;dettaglio;stato;causale, ordinato
per criticità, con `csvCell` (anti CSV-injection, coerente con le altre app). Utile
come registro/archivio della giornata e per l'handover di turno. Portabilità dati =
coerente con la filosofia "indipendenza / niente lock-in" del fondatore.

## Verifica
Syntax OK. Screenshot/download Playwright (demo): click esporta → CSV scaricato con
header corretto, 5 righe dati, contiene le attività demo, messaggio "Esportate 5
attività (CSV)."; zero errori console. Con questa, tutte e 6 le verticali esportano
la lista principale.

## Prossimo passo atomico
Never-stop: le liste principali hanno ora ricerca+conteggio+filtri+ordinamento+
modifica+conferme+validazioni+export CSV, coerenti su tutte e 6. Prossimo: rotazione
(test/ricerca) o iterazione su liste SECONDARIE, evitando churn.

## Blocchi
Nessuno (pura UX). Gated: passo 3 drone (dato reale), #321 estetica.

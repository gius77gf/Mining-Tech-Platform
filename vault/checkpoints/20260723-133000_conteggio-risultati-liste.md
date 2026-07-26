# Checkpoint — 2026-07-23T13:30:00Z

## Tipo
unit-complete (seconda iterazione UX — conteggio risultati nelle liste, 6 app)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — 6 app: conti/flotta/campo/sentinella/terra/scudo)

## Completato
Completa la ricerca aggiunta prima: un **conteggio risultati** sotto ogni lista
principale, così l'utente sa quante righe sta vedendo (feedback quando cerca/filtra).
Mostra "N <entità>" e, quando c'è un filtro o una ricerca attiva, "N · su TOT".
Conteggio dai nodi realmente resi (`.item`), nessun refactor della catena di filtri.
- Conti fatture, Flotta mezzi, Campo attività, Sentinella sensori, Terra rilievi:
  nuovo elemento `#*-count`. Scudo personale: potenziato il contatore esistente
  (`pers-count`) per mostrare "visti su totale" quando si cerca.

## Verifica
Syntax OK (6 app). Screenshot Playwright (demo): Conti "5 fatture" → cerca
"edilcave" → "2 fatture · su 5"; Terra "5 rilievi" → "ortofoto" → "4 rilievi · su 5";
zero errori console.

## Prossimo passo atomico
Never-stop: altra seconda iterazione UX o rotazione (test/ricerca). Le liste hanno
ora ricerca + conteggio + filtri + ordinamento + modifica in-place + conferme +
validazioni: coerenti su tutte e 6. Evitare churn su ciò che è maturo.

## Blocchi
Nessuno (pura UX). Gated: passo 3 drone (dato reale), #321 estetica.

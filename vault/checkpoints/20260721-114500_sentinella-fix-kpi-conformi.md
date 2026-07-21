# Checkpoint — 2026-07-21T11:45:00Z

## Tipo
unit-complete (bugfix UI, da sweep di coerenza cruscotti)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Sentinella fix KPI "Campionamenti mese")

## Completato
Sweep di coerenza sui cruscotti di tutte le 6 app (etichetta KPI vs valore
mostrato). Trovato 1 altro mismatch oltre a Campo: Sentinella — il 4° KPI era
"Campionamenti mese" ma mostrava MON.length (numero di sensori, DUPLICATO del
1° KPI "Monitoraggi attivi"), non i campionamenti. Corretto in **"Conformi"**
legato a `riepilogoConformita(MON).conformi` (helper già testato): metrica
distinta, sempre significativa, cliccabile (filtro conformi). Gli altri 4
cruscotti (Scudo/Flotta/Conti/Terra) verificati COERENTI.
Verifica: syntax OK, Playwright (Monitoraggi 5 · Superamenti 1 · Adempimenti 1
· Conformi 3, nessun errore). CI invariata 253.

## Stato roadmap
6 app verticali robuste; cruscotti coerenti (2 mismatch etichetta/valore
corretti: Campo, Sentinella); review complete; seconde iterazioni complete;
doc fondatore; suite 253.

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Pivot: ricerche/programmi
(founder chiede), o estensione test, o altre rifiniture. SENZA FERMARSI.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.

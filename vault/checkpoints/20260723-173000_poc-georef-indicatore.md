# Checkpoint — 2026-07-23T17:30:00Z

## Tipo
unit-complete (drone POC — indicatore coordinate georeferenziate / metri reali)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/genesi/nuvola-poc.html)

## Completato
Miglioramento drone non-speculativo per la prova del weekend: il visore ora dice se
la nuvola caricata è **georeferenziata (UTM → metri reali)** oppure a **coordinate
relative (scala approssimata)**, deducendolo dalla grandezza delle coordinate
(est/nord UTM sono sui 100.000-1.000.000). Aggiunta la riga "Coordinate" nell'info e
l'unità corretta ("m" / "metri") su dimensioni e ritaglio. Così il fondatore capisce
SUBITO se il suo export ODM ha scala reale (→ la simulazione darà misure vere) o no.
Nessuna ipotesi sulla forma: solo lettura della magnitudine delle coordinate.

## Verifica
Syntax OK. Smoke browser (LAS UTM offset ~512000/5043000): info mostra "Coordinate:
georeferenziate (UTM) → metri reali", dimensioni "12.0 × 4.0 × 9.5 m", ritaglio
"(metri) · 500 punti"; zero errori console.

## Prossimo passo atomico
Never-stop: rotazione fallback. Il visore è ora ancora più chiaro per la prova del
weekend (formati LAS/PLY/XYZ/OBJ, conteggio ritaglio, indicazione metri/relativo).
Passo 3 resta gated sul dato reale.

## Blocchi
Passo 3 drone: gated sul dato reale. #321 estetica: gated.

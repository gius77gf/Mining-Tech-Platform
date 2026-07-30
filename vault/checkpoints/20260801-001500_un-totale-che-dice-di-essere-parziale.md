# Checkpoint — un totale che dice di essere parziale

- **Tipo**: due unità di completamento (il messaggio d'import, le schermate)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Il pezzo che mancava alla correzione di prima

Togliere lo zero di comodo dalla base d'asta era metà del lavoro. La base vuota
ora resta vuota e il totale la salta — ma **se l'app non lo dice**, il titolare
guarda «quanto vale quello per cui stiamo correndo», vede un numero più piccolo
del vero e non ha modo di sapere perché. Il difetto cambia forma, non sparisce.

Chiuso in due passi:

1. **Il messaggio d'importazione** conta le gare entrate senza base e ne scrive
   la conseguenza: *«non entrano nel totale del valore in gara»*. È la stessa
   forma già usata per i prodotti senza densità e per i ricambi senza soglia.
2. **Le tre schermate dove quel numero si vede**: la pastiglia del quadro
   («… a base d'asta (2 senza base)»), la riga del riepilogo gare, e il totale
   di pagina — che usava `|| 0` e quindi **cancellava la differenza fra «zero» e
   «non c'è» prima ancora che si potesse dirla**.

Il messaggio d'import da solo non bastava: dura pochi secondi, una volta sola.
Chi apre l'app il giorno dopo non c'era.

## La regola che ne esce

**Un totale che esclude qualcosa deve dire di escluderlo, e deve dirlo dove il
totale si legge** — non solo nel momento in cui i dati entrano. Vale per tutti
i numeri che sommano: il valore in gara, ma anche l'esplosivo di una volata, i
volumi di un periodo, le ore di una macchina.

## Verifica

**KPI 431**, **Stile 149**, **662** prove senza rete in tutto. Le tre pagine
toccate (Conti, Campo, Flotta) montano i gestori e non danno eccezioni JS.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro definitivo** e — questa è la parte da non
saltare — **rilanciarlo pulito**: durante la corsa ho continuato a correggere
(le ore motore, la base d'asta, le persone, le tendine), quindi anche questo
giro legge file diversi fra il primo banco e l'ultimo. Il prossimo va lanciato
e poi lasciato in pace fino al riepilogo, senza toccare né le pagine né lo
stile: solo documenti.

## Bloccanti

- Nessuno.

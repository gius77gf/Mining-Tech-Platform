# Checkpoint — le voci di costo, in un posto solo

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.396 → **1.400**

Primo pezzo del **registro costi esteso**, e il pezzo che non si può sbagliare:
la **classificazione**, in `shared/dw-ponti.js`.

## Perché lì e non in Conti

La regola è vincolante e ha un prezzo già pagato: una classificazione scritta
due volte **diverge alla prima aggiunta**, e allora i costi di Flotta e quelli
di Conti smettono di sommarsi — senza che nessun controllo se ne accorga, perché
ognuna delle due resta coerente **con sé stessa**.

Le due app la **ri-esportano**. Il test pretende l'**identità**
(`conti.VOCI_COSTO === ponti.VOCI_COSTO`), non il comportamento: due copie uguali
oggi divergono domani senza che nessuno lo veda. `nomi-doppi` è passato da 23 a
**26 nomi guardati**, da 14 a **16 alias**, e continua a dire *0 da sistemare* —
cioè ha riconosciuto la forma giusta.

## Il censimento era da correggere, e la correzione regge

Diceva «registro costi: si parte da zero». **Non è vero**, misurato il 03/08: un
registro costi **esiste già in Flotta**. Quello che manca non è il registro — è
che copre solo il **mezzo**. Personale, energia, esplosivo, canone e ripristino
non hanno posto, e sono le voci senza le quali «quanto costa un metro cubo» non
si può scrivere.

Per questo ogni voce porta `daMezzo`: dice quali Flotta **già registra**, così
chi somma non conta il gasolio due volte. Le tre marcate sono carburante,
manutenzione e noleggi; il personale è marcato **no**, ed è la voce che a Flotta
manca per definizione.

## ⛔ E una voce sconosciuta non diventa «generali»

Sarebbe la solita assenza travestita: il costo entrerebbe nei totali sotto
un'etichetta **che nessuno ha scelto**, e sparirebbe dalla ripartizione per
gruppo — che è esattamente quella che serve a capire **dove** si spende. Si
dichiara `non-classificata`, e chi somma decide.

## Prossimo passo atomico

1. il **registro** vero in Conti: la collezione dei costi con la voce, e il
   totale per gruppo che tiene conto di `daMezzo`;
2. poi **costo per metro cubo**, che è la domanda per cui tutto questo esiste.

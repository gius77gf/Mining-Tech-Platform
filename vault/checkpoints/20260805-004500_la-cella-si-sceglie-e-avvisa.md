# Checkpoint — la cella si sceglie, e avvisa quando è troppo fine

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

Seconda metà dell'**unità 5**: il lato cella si cambia. «Automatica (dal
ritaglio)» resta il valore di serie — chi non tocca niente ha esattamente il
conto di prima — e il record dice **come** è stata scelta (`cellaAutomatica`),
perché una scelta ha un autore e nel verbale è una differenza che conta.

La preoccupazione scritta nel checkpoint di prima — «due volumi per lo stesso
ritaglio» — **non esiste**: il record veniva già riscritto a ogni spostamento dei
cursori, quindi porta sempre l'**ultima** risposta. La cella è un cursore come
gli altri.

Misurato sul cono di prova: automatica **1.362 m³**, 0,25 m → **527**, 2 m →
**1.633**.

## ⛔ E quel 527 ha aperto un difetto che la scheda non aveva

Il volume **crolla del 63%**, non scende di qualche punto. Ragione: il metodo
somma **solo le celle che contengono punti**, e la mia nuvola è campionata a
40 cm — con la griglia a 25 cm gran parte delle celle resta **vuota** e il volume
manca dei pezzi.

Fino a un minuto fa il software la cella la sceglieva da sé e nel range non ci
finiva mai; **dandola in mano all'utente ho aperto la porta**. E senza avviso
quel numero più basso si legge come «più preciso» — la griglia fine *sembra* più
accurata.

Adesso, quando l'area coperta è molto minore dell'impronta del ritaglio:

> ⚠ *griglia più fitta dei punti: molte celle sono vuote e il volume risulta più
> basso del vero — usa una cella più grossa*

Misurato: compare a 0,25 m, **tace** a 0,49 m e a 2 m.

*È la stessa lezione di stamattina, di nuovo: una funzione nuova non si misura
solo su quello che aggiunge, ma su tutto quello che adesso può diventare falso.*

## Prossimo passo atomico

1. una **prova** che blindi l'avviso (oggi è verificato a mano su tre valori);
2. la nota di credito nell'**export per il commercialista**;
3. giro completo a **33 esecuzioni** a lavoro sul codice fermo.

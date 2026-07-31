# Checkpoint — il registro costi: i totali, e i due denominatori che mancano

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.400 → **1.406** · copertura **435/435**

`riepilogoCosti(costi, dal, al)` e `costoPerMetroCubo(costi, volumeM3, dal, al)`.

## Tre cose che il totale non nasconde

1. **una voce sconosciuta si conta a parte** — `non-classificata` è un gruppo
   visibile, non un rifugio. Se finisse in «generali», il costo entrerebbe nei
   totali sotto un'etichetta che nessuno ha scelto e sparirebbe dalla
   ripartizione, che è quella che serve a capire **dove** si spende;
2. **le voci senza data non spariscono da un periodo**: si contano a parte.
   Escluderle e tacere farebbe risultare il mese **più economico** di quello che
   è — un totale tranquillo ottenuto lasciando fuori ciò che non si sapeva dove
   mettere;
3. **il costo al metro cubo non si calcola senza i metri cubi.** È la stessa
   forma degli indici infortunistici, ed è la **sesta** volta oggi che il
   principio morde: il denominatore è il dato che manca più spesso, e qui il
   travestimento sarebbe un costo unitario **basso**, cioè la notizia che chi
   guarda vuole leggere. Il totale dei costi però resta disponibile: non
   dipende dal volume.

## ⚠️ E una trappola del linguaggio, non del prodotto

`export … from` **ri-esporta ma non lega il nome** nel modulo che lo scrive: è un
passaggio, non un import. `riepilogoCosti` usa `gruppoDiVoce`, e con il solo
`export … from` il modulo **si carica** e muore alla **prima chiamata** —
`ReferenceError`, nessun errore di sintassi, nessun avviso. Trovato facendo
girare la funzione appena scritta invece di darla per buona.

## Le controprove

Quattro difetti rimessi, quattro cadute: la voce sconosciuta in «generali» (2
prove), le voci senza data che spariscono, il costo al metro cubo che si calcola
comunque, il periodo che non taglia più (2 prove).

## Prossimo passo atomico

1. la **schermata** del registro costi in Conti: la collezione, il modulo di
   inserimento con le dieci voci, e il riepilogo per gruppo;
2. il **ponte col volume di Terra**, così il costo al metro cubo prende il
   denominatore da dove già esiste invece di chiederlo a mano.

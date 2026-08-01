# La chiusura del mese: la schermata

**Data:** 01/08/2026 · **App:** Conti
**Unità precedente:** `20260801-004500_la-chiusura-del-mese-lo-strato-dati.md`

## Cosa è stato fatto

La chiusura del mese si usa dalla scheda **Costi**: la collezione `chiusure`
(viva e in dimostrazione), il cartellone del margine, l'elenco delle conferme e
la riapertura.

Il comportamento, in ordine di quello che si vede:

- **Prima della chiusura** il margine è un **trattino**, con accanto i costi
  già inseriti e la ragione per cui non si calcola — e la ragione **nomina la
  voce che manca**, non dice genericamente «mese aperto».
- **L'elenco delle conferme**: una riga per ogni voce che in questa cava
  compare di solito e in quel mese no, con scritto *in quanti mesi su quanti*
  compare. Spuntarla vuol dire «questo mese non c'è, ed è giusto» — che è una
  **risposta**, e la differenza fra una chiusura e una spunta.
- **La finestra di conferma dice cosa resta senza risposta** e ripete che
  chiudere **non blocca niente**.
- **Dopo la chiusura** il margine c'è, con ricavi e costi accanto, e una nota
  che dichiara che i ricavi sono **per competenza** e non gli incassi.
- **Se arrivano voci dopo**, il mese non torna aperto ma lo dice, con quanto è
  arrivato: chi ha letto il numero di allora deve sapere che non è più quello.
- **Riapri** toglie solo la dichiarazione, e la finestra lo scrive: nessun
  costo viene toccato.

## ⚠️ Stavo per inventare una classe che nessun foglio definisce

Avevo scritto `<label class="dw-check">` per le caselle. **`.dw-check` non
esiste in nessun foglio**: sarebbe stata una casella disegnata a metà e un
bersaglio di tocco grande quanto il quadratino — ed è esattamente la regola 8
di `run-stile.mjs`, che però guarda le classi con l'aria di uno stato
(`.note.avviso`) e questa le sarebbe sfuggita.

L'idioma giusto **c'era già** in Conti, nella fattura differita: la **riga
intera** è un `<label class="item tap">` con dentro `.dw-chk`, e la riga si
accende quando è spuntata. Bersaglio grande, e coerente col resto dell'app.
È la stessa lezione del `.mrec` usato in Scudo dove non esisteva: **si guarda
come l'app lo fa già, non come sarebbe comodo scriverlo.**

## Verifica

Giro completo sulla pagina viva, con `TZ=Europe/Rome`:
margine `—` prima della chiusura → finestra con i due bottoni giusti → dopo la
chiusura **€ 13.421,00** e «Mese dichiarato chiuso il 01/08/2026 · Riapri».
Nessun errore in pagina. Scatto guardato.

Suite: `run-kpi` 1063, `run-stile` 268, sonda del vuoto 7/7,
`registro-costi.mjs` **40 su 40**, numeri nei documenti 15/15.

## ⚠️ Quello che la dimostrazione NON mostra, e va detto

Con i costi d'esempio di oggi **l'elenco delle conferme resta vuoto**, e si
legge «tutte le voci che questa cava usa di solito ci sono anche in luglio».
È la risposta **giusta** per quei dati — ma vuol dire che chi apre la
dimostrazione non vede mai la parte che dà valore alla funzione.

La ragione, misurata: i dodici costi d'esempio sono quasi tutti **uno per
mese** (carburante e personale solo a febbraio, esplosivo solo a marzo…),
quindi nessuna voce arriva alla soglia di «abituale» — metà degli altri mesi.
Una cava vera ha costi **ricorrenti**: personale ed energia ogni mese, il
canone ogni semestre.

Non è un difetto del codice: è la dimostrazione che è più povera della realtà,
e per giunta nel punto in cui il prodotto è più forte.

## Prossimo passo atomico

**Rendere ricorrenti i costi d'esempio** — personale e carburante ogni mese da
febbraio a luglio, energia bimestrale — così la dimostrazione somiglia a una
cava vera *e* l'elenco delle conferme mostra qualcosa.

⚠️ E va fatto sapendo cosa muove: `registro-costi.mjs` asserisce numeri presi
da quei dati (il totale **€ 1.702,00**, i totali per gruppo, la voce fuori
intervallo da **€ 148,00**). Vanno ricalcolati **dai dati nuovi**, non
aggiustati finché il banco torna verde — che sarebbe il modo di far dire alla
prova quello che fa comodo.

Poi, con le funzioni già provate in banco: i **lotti di Terra** (13 prove) e
l'**analisi della causa** in Scudo (12 prove).

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

---

## Aggiornamento — la dimostrazione ora mostra la funzione *(01/08, stessa sera)*

I costi d'esempio sono diventati **ricorrenti**, come in una cava vera:
personale e carburante ogni mese da febbraio a luglio, energia bimestrale,
esplosivo sulle volate, canone semestrale. Restano i tre casi che insegnano
qualcosa: la voce **fuori elenco**, quella **senza data**, e le voci che
**Flotta registra già**.

Effetto: a luglio manca l'**energia**, che negli altri mesi c'è tre volte su
cinque — quindi la chiusura ha finalmente una domanda da fare, e la si vede.

Tutti i numeri sono stati **ricalcolati dai dati**, non aggiustati: totale
anno **€ 1.334,00**, costo **7,49 €/m³** su 178 m³, due voci fuori
dall'intervallo dei rilievi per **€ 81,00**.

⚠️ E il banco è stato **slegato dai letterali**: confrontava il totale con
«1702 + 1250,50», cioè col totale del giorno in cui era stato scritto. Bastava
migliorare la dimostrazione — una cosa che serviva al prodotto — e la prova
sarebbe caduta accusando un difetto inesistente. È lo stesso invecchiamento
della data nella sonda del vuoto, trovato oggi. Ora il totale di prima si
**legge dallo schermo** e si controlla il **delta**.

⚠️ E un difetto di testo, che è la **seconda volta in questa stessa schermata**:
`plur` scrive anche il numero, e veniva fuori «in luglio 2026 **1** manca una
voce». `plur` serve a contare, non a scegliere fra due frasi — e la tentazione
torna ogni volta che una frase ha singolare e plurale.

`registro-costi.mjs` **40 su 40**, controprova 10 cadute su 4 iniezioni; tutte
le suite `node` verdi.

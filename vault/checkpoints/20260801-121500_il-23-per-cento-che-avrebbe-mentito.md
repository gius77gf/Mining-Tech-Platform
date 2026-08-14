# Il 23% che avrebbe mentito

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/stati-sorvegliati.mjs` (nuova misura)
**Unità precedente:** `20260801-114500_il-fascicolo-sotto-guardia.md`

## Il debito, pagato in un altro modo

Il censimento delle sei app era dichiarato due volte e non fatto: un tentativo
l'ho invalidato io modificando una pagina mentre girava, l'altro l'ho fermato
perché dopo mezz'ora non aveva ancora scritto una riga. La strada era sbagliata:
per sapere **quali frasi un'app sa dire** non serve aprirla — quelle frasi
stanno nel suo sorgente. È un confronto fra due testi, e si fa in `node` in un
secondo.

## ⛔ E il numero che ne usciva era da buttare

La prima versione stampava: **«23% del principio sorvegliato sullo schermo»**.
Un titolo, una percentuale, sei righe per app. Sembrava il risultato che
cercavo da tre unità.

Poi ho guardato una riga che non tornava: **Sentinella risultava scoperta su
«mai misurato»**, e il banco quello stato lo guarda — è uno dei primi che ci ho
messo. Il motivo del banco però dice `/nessuna misura registrata/i`, cioè **le
parole che il prodotto usa davvero**, non la forma generica del vocabolario.

Da lì il difetto del metodo: quel 23% misurava la **sovrapposizione di
lessico** fra il mio elenco di frasi e i motivi del banco, non la copertura
degli stati. Due testi non possono dire se due frasi **diverse** parlano dello
stesso stato. Il numero era sbagliato **in basso**, cioè nella direzione che fa
sembrare il lavoro più necessario di quanto sia — ma la direzione non c'entra:
in un documento sarebbe stato un numero **gonfiato**, e la direttiva 5 del
fondatore lo vieta senza distinzioni.

Tolto. Non «aggiustato con una nota a piè di pagina»: **tolto**, perché una
percentuale in cima a un output la si ricorda anche quando la nota dice di non
fidarsene. Al suo posto resta quello che quei due testi possono davvero dire.

## Che cosa dice adesso

Un **elenco di candidati**: dove il prodotto dice «non lo so» e nessun motivo
del banco nomina quel punto — ordinati per quante app li dicono, perché una
frase che dicono in sei e non guarda nessuno è il posto dove il prossimo difetto
passerà inosservato.

```
6 app · «non lo so»          5 app · «non calcolabile»
6 app · «non si sa»          4 app · «non registrato»
```

Con l'avvertenza stampata **sopra** l'elenco, non sotto: un motivo del banco può
guardare uno stato con altre parole, quindi sono candidati **da guardare a
mano**, non una condanna.

## Perché è una misura e non una prova

Come `copertura-funzioni.mjs`: stampa e non fallisce mai. Una soglia qui sarebbe
una soglia su un valore che cresce da sé — basta aggiungere una frase al codice
— ed è esattamente il caso che `CLAUDE.md` racconta a proposito dei fondi
scritti su valori monotòni.

## Verifica

`suite-collegate` **3/0, 45 file** (era 44): la misura è dichiarata col
marcatore, quindi non è orfana. Misura lanciata: 56 occorrenze di frase nelle
sei app, 13 nominate anche dal banco, 15 frasi in classifica.

## Prossimo passo atomico

Prendere le **prime due voci della classifica** — «non lo so» e «non si sa»,
che dicono tutte e sei le app — e guardarle una per una: per ognuna, decidere se
è già coperta dal banco con altre parole, se è un testo esplicativo (come la
nota dell'appello di Campo, che stanotte aveva già ingannato una sonda) o se è
uno stato vero che nessuno sorveglia. È lavoro a mano e va fatto a mano: è
proprio la parte che i due testi non possono decidere.

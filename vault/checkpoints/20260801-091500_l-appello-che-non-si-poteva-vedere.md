# L'appello che non si poteva vedere

**Data:** 01/08/2026 · **Area:** `apps/campo/campo-data.js` (dimostrazione) + il banco
**Unità precedente:** `20260801-085000_il-banco-arriva-al-documento-fiscale.md`

## Il censimento, fatto invece che immaginato

Il passo era: «quali stati *non misurato* sanno dire Campo, Flotta e Sentinella,
e quali di quelli non compaiono in dimostrazione». Misurato con una sonda che
apre le tre app, visita **tutte** le sezioni e cerca dodici frasi tipiche fra
gli elementi **visibili**:

| app | compare | non compare |
|---|---|---|
| Sentinella | «mai misurato» *(nessuna misura registrata)* | le altre undici |
| Flotta | «senza data» *(un noleggio nel registro costi)* | le altre undici |
| Campo | «non lo so» — **ma solo dentro una nota esplicativa** | le altre undici |

Sentinella e Flotta erano a posto. **Campo no**, e il modo in cui non lo era è
istruttivo: la frase c'era, quindi una ricerca a testo avrebbe detto «trovata».
Solo che stava nel paragrafo che *spiega* l'appello, non in una riga che lo
**fa**.

## ⛔ `presenze: []`

La dimostrazione di Campo non aveva **nessuna** presenza. Con l'elenco vuoto
l'appello mostra tutti da spuntare — e quello si legge come **«la funzione non è
mai stata usata»**, non come «di queste persone non si sa niente».

Il caso per cui l'appello esiste è il **terzo**: quello *parziale*, dove qualcuno
è stato visto e qualcuno no. È il principio del fondatore nella sua forma più
netta, quella scritta in `CLAUDE.md`: *«non lo so» non è «non c'è», perché se
suona l'allarme contare assente chi nessuno ha spuntato vuol dire non andarlo a
cercare.* Ed era invisibile nell'app da cui quella frase è nata.

## I tre turni, i tre stati

- **Mattina** — parziale: 2 presenti, 1 assente, **1 ancora da spuntare**;
- **Pomeriggio** — completo: 3 presenti, 1 assente, «appello completo»;
- **Notte** — vuoto: «appello non ancora cominciato · 4 ancora da spuntare».

Le date sono relative (`GIORNI_FA(0)`), quindi la dimostrazione non invecchia; e
siccome il turno mostrato dipende dall'**ora**, coprirli tutti e tre è anche il
modo di essere sicuri che qualcosa si veda sempre.

Il cartellone scriveva già «1 ancora da spuntare», «appello completo», «appello
non ancora cominciato»: **tre frasi giuste che non aveva mai letto nessuno.**

## ⚠️ E la prova che portava il nome di un caso e ne provava un altro

Il banco cercava `/ancora da spuntare/` per il caso **parziale**. Svuotando le
presenze — la controprova — quella riga **passava lo stesso**, perché l'appello
vuoto dice «4 ancora da spuntare». Cioè una prova col nome del caso parziale che
in realtà provava «il cartellone esiste».

È il **caso 1** della tassonomia di `CLAUDE.md`: i dati della prova fanno
coincidere la risposta giusta con quella sbagliata. Corretti i **dati della
prova**, non il codice: il parziale si riconosce perché **qualcuno è stato
spuntato** — c'è un assente *e* c'è ancora qualcuno da spuntare. Adesso, con le
presenze svuotate, cadono **tutt'e due** le righe di Campo.

Senza la controprova quella riga sarebbe rimasta lì per sempre, verde.

## Il banco

Da **21 a 24 prove**, da 9 a **13 stati**, da tre a **quattro app**. Due cose
imparate estendendolo:

1. `prima` sapeva cliccare un bottone per testo, ma il turno di Campo è una
   **tendina**: aggiunto `{ seleziona, valore }`;
2. l'appello non è né una riga né una nota — è il **cartellone** `.board`, che è
   proprio il posto dove un numero tranquillo si vedrebbe. L'elenco dei
   selettori del banco è anche una **dichiarazione di dove ha guardato**, quindi
   l'allargamento è scritto con la sua ragione.

## Verifica

`stati-non-misurati` **24/0** (13 stati, 4 app); controprova incorporata cade;
controprova per regressione (`presenze: []`, −1.008 caratteri) fa cadere
entrambe le righe di Campo. Ripristinato e verificato `diff` identico.
Suite: kpi 1117/0, demo 8/0, stile 271/0, sonda-vuoto 7/0.
Scatto guardato del cartellone nei tre turni.

## Prossimo passo atomico

Restano **Flotta** e **Sentinella**: il censimento dice che uno stato per una lo
mostrano, quindi lì il lavoro non è aggiungere dati alla dimostrazione ma
**mettere quei due casi nel banco** — «senza data» sul registro costi di Flotta
e «mai misurato» sul programma di Sentinella — così tutte e sei le app sono
coperte. Poi il banco sarà da rileggere una volta sola per chiedersi la domanda
che conta: *quali stati «non misurato» esistono nei moduli e non sono in
nessuna delle sei liste?*

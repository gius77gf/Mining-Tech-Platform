# Checkpoint — vetrina, terza iterazione: «e io da dove comincio?»

- **Tipo**: ricerca depositata + l'unità che ne è uscita
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `39c2a8e`

## La ricerca, prima della scelta

`docs/RICERCA_VETRINA_202607.md`. Sette raccomandazioni verificate una per una
contro la nostra pagina — e **cinque erano già rispettate**: raggruppamento per
caso d'uso (le quattro famiglie sono la versione da cava del «per caso d'uso» di
Notion), risultato prima della funzione, un bottone dominante, una colonna sul
telefono, la sezione dei ponti prima della griglia.

Sta scritto anche questo, ed è la parte che di solito manca alle ricerche: **la
tentazione è trovare per forza qualcosa da cambiare.** Cinque su sette erano a
posto perché le scelte erano state prese con una ragione, non per copiatura.

## I due difetti veri

**1. Nessuna gerarchia.** Nove schede della stessa misura: chi guarda non sa da
dove cominciare, e nove prodotti ugualmente importanti diventano nove prodotti di
cui nessuno è importante.

Ma la gerarchia **va guadagnata, non inventata**. Ingrandire la scheda di Genesi
perché è la più bella sarebbe un capriccio, e direbbe il contrario della nostra
tesi — gli strumenti sono pari, il valore è che si parlano. Perciò non si toccano
le misure: si smista per **problema**. Quattro frasi che una persona di cava
riconosce come sue («domani ho un'ispezione e devo trovare i documenti»), ognuna
che porta dove serve.

**2. Nessuna prova esterna, e non si inventa.** I riferimenti chiedono che ogni
affermazione di risultato sia appoggiata a un cliente con un nome. Oggi non
possiamo, e **fingere di poterlo** sarebbe il modo più veloce di bruciare la
fiducia che si sta cercando di costruire. Quello che abbiamo di vero: le
anteprime sono schermate del prodotto che funziona, non disegni. Quando ci sarà
il primo cliente, quella è la prima cosa da aggiungere — con nome e cognome.

## Quello che si è scelto di NON prendere

La **griglia a scomparti asimmetrica**, che pure è il modello prevalente nel
2026: renderebbe la pagina più moderna e la storia più confusa. Se un giorno una
delle app diventasse il prodotto di punta e le altre il contorno, allora quella
griglia sarà lo strumento giusto — non prima.

E il consiglio di **togliere i collegamenti in cima**: vale per una pagina di
conversione pubblicitaria, dove l'unico scopo è il modulo. La nostra è anche la
porta di casa dell'ecosistema. Adottarlo ci farebbe peggio, non meglio.

## Il difetto trovato guardando, non leggendo

La prima versione aveva il testo nudo dentro l'`<a>`, che è un contenitore flex:
**ogni pezzo di testo sciolto diventa un elemento a sé**, e «Devo sapere | quanto
materiale mi resta | e per quanti anni» usciva spezzato in tre colonne coi vuoti
in mezzo. Leggendo il codice sembrava una riga. È la terza volta oggi che il
flex fa una cosa che il codice non lascia immaginare (le altre due: il `gap`
della pastiglia e lo spazio normale mangiato a inizio riga).

## Prossimo passo atomico

La quarta famiglia della vetrina, **«La base»**, contiene il core e Deepwork ID:
sono le due schede che un cliente capisce meno, e le loro anteprime sono le due
più povere. Vale un passaggio dedicato ai testi di quelle due, con lo stesso
metro delle altre sette: cosa cambia per chi le usa, non cosa sono.

## Bloccanti

- Nessuno.

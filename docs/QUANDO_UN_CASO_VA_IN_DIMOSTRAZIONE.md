# Quando un caso va nella dimostrazione, e quando no

*Scritto il 01/08/2026, dopo sei unità di fila che hanno dovuto rispondere alla
stessa domanda e ci sono arrivate una alla volta. Qui la regola sta in un posto
solo, con **i casi già decisi e la loro ragione**: serve a impedire che la
prossima unità rifaccia la strada — o, peggio, che ridecida al contrario.*

Il problema nasce dal principio del fondatore — **l'assenza di un dato non è un
dato favorevole** — e dal banco che lo sorveglia sulle pagine vive
(`apps/deepwork-id/tests/browser/stati-non-misurati.mjs`). Il banco pretende che
gli stati «non è stato misurato» **si vedano davvero**. Ma per vedersi devono
esistere: e da lì la domanda, ogni volta uguale — *questo caso lo metto nei dati
d'esempio?*

## Le tre risposte, in ordine di preferenza

### 1. ASSENZA → sì, sta nei dati d'esempio

Un dato che manca è **uno stato che il prodotto sa raccontare**, e mostrarlo in
dimostrazione è un pregio, non una macchia. È la stessa distinzione che
`run-demo.mjs` fa fra il dato **assente** (ammesso) e quello **corrotto**
(vietato: `2026-13-45`, `"abc"` in un campo numerico).

Esempi già in dimostrazione: un lotto senza fronte, un anno senza rilievi di
scavo, una fattura senza scadenza, una fattura incassata senza data d'incasso,
un DPI valido con l'addestramento mai registrato, un rapportino consegnato senza
il giorno, una volata senza la distanza del ricettore.

⚠️ **Due volte questa regola ha trovato una suite che la impediva**: `run-demo`
pretendeva che ogni fattura avesse la scadenza, e che ogni volata avesse tutti i
numeri — cioè la dimostrazione **non poteva contenere** proprio il caso per cui
la difesa era stata costruita. Due app, due autori, stesso difetto: se una prova
d'integrità pretende che un campo ci sia sempre, va riletta chiedendosi se sta
vietando un'assenza invece di una corruzione.

### 2. CONTRADDIZIONE → no, si raggiunge digitando

Quando i dati ci sono **tutti e due** e non tornano fra loro, non è uno stato
della cava: è **lo sbaglio di chi compila**. Metterlo nei dati d'esempio vuol
dire mettere in vetrina un'azienda che tiene male i conti.

Si raggiunge invece **facendo il gesto che lo crea**: il banco accetta un elenco
di passi (`{scrivi}`, `{seleziona}`, `{tocca}`, click a testo) apposta per
questo.

Caso deciso: **la disponibilità del turno in Campo**, quando i minuti di fermo
superano la durata dichiarata. Si raggiunge dichiarando mezz'ora di turno su un
turno che ha già 55 minuti di fermo.

### 3. ASSENZA CHE SMONTA IL RESTO → si raggiunge digitando anche lei

Eccezione alla prima riga, e va verificata col criterio:

> **un caso da dimostrare deve poter mancare senza portarsi via il resto.**

Se togliere il dato dalla dimostrazione **cancella anche altri numeri**, il caso
è *strutturale*, non additivo, e nei dati d'esempio non ci va — anche se è
un'assenza. Se il gesto che lo crea è realistico, si digita; se non lo è, si
**dichiara il rifiuto con la ragione** e non ci si torna.

Caso deciso: **il volume concesso dall'atto in Terra**. Toglierlo all'unico
titolo porta via la percentuale del concesso, il cumulato letto in proporzione,
il residuo e la soglia di guardia — quattro numeri. Ma il gesto è vero (il
cliente nuovo che non ha ancora trascritto l'atto), quindi il banco lo digita.

## I rifiuti già motivati — non si ridiscutono senza una ragione nuova

| caso | perché no |
|---|---|
| **Terra · residuo del volume concesso** | strutturale: il residuo è calcolato, e per farlo mancare bisogna togliere il concesso, cioè smontare la sezione |
| **Sentinella · superamento con valore senza data** | in dimostrazione **non c'è nessun superamento**, e aggiungerne uno cambierebbe il verdetto del report da «Conforme» a non conforme: è il titolo del documento, non un dettaglio |
| **le occorrenze «ripiego di campo»** (comune non indicato, ruolo non indicato, senza data d'emissione, …) | non stanno accanto a un numero di cui cambiano la lettura: si dichiarano e non finiscono nel banco |

## Il criterio per decidere se un caso merita una riga del banco

Non tutte le frasi che dicono «non lo so» sono uguali. Quella che conta sta
**accanto a un numero di cui cambia la lettura**: un totale, una media, una
percentuale, una copertura, una casella di un documento che esce dall'app.

- ✅ «Incassato (totale registrato) 25.320 € · **1 fattura incassata senza
  data**» — il totale dichiara quello che non ha saputo collocare;
- ✅ «Rapportini consegnati da 2/3 squadre **(1 rapportino ancora senza data)**»
  — senza l'avviso la riga potrebbe dire «tutte a posto»;
- ❌ «comune non indicato» in una riga di anagrafica — sostituisce un campo
  vuoto e basta.

Il banco che cresce di prove che non difendono niente è un banco che costa
tempo a ogni giro e non protegge di più.

## Il censimento delle frasi rimaste — letto una volta, dichiarato qui

*Fatto il 01/08 leggendo **50 occorrenze** nel testo che l'utente vede
(commenti esclusi, un file per volta) delle sei frasi ancora in classifica:
«non si sa», «non indicato», «non indicata», «non registrato», «non
registrata», «non lo sappiamo». Serve a chiudere la lista: senza, ogni ciclo
riapre le stesse righe e ci mette mezz'ora per riscoprire che sono ripieghi.*

**Già sorvegliate dal banco** (a volte con altre parole): Scudo «di N non si sa
niente», «senza mansione non si sa quali corsi», «Stato non indicato»,
«addestramento non registrato» · Flotta «non si sa quando», «Quando cadrà non
si sa» · Conti «non si sa entro quando», «non si sa, e finché è così»,
«causale non indicata», «incassata, data non registrata» · Terra «non
indicato» del volume concesso, «non si sa quali rilievi lo riguardano» · Campo
«non lo sappiamo» dell'appello.

**Ripieghi di campo — dichiarati, non sorvegliati.** Sostituiscono un campo
vuoto in una riga di dettaglio e non cambiano la lettura di nessun numero:

| app | occorrenze |
|---|---|
| Scudo | ruolo, comune, sito, luogo «non indicato»; la nota d'archivio «stato non registrato» |
| Campo | «Fronte non indicato» (voce di tendina, ×2), ruolo (×2), area, «- non registrato» in un export |
| Flotta | costo orario, prezzo, «Motivo non indicato»; «Pezzo non registrato in magazzino» (suggerimento di un campo) |
| Conti | «(voce non indicata)», la data di un costo, il toast d'errore «Incasso non registrato», il messaggio di validazione «non si sa quanti m³» |
| Terra | «fronte non più in elenco», «Tipo di elaborato non indicato» |
| Conti | ⚠️ «così **non si sa**lta» è un **falso positivo** del confine di parola, già corretto: non c'entra col principio |

**Stati veri ancora scoperti** — la lista di lavoro vera, corta:

1. **Scudo · «Formazione non registrata»** — pastiglia rossa nella matrice
   delle nomine. È uno stato di sicurezza, non un ripiego;
2. **Sentinella · «distanza non indicata»** sul ricettore — la distanza governa
   la lettura del livello misurato;
3. **Sentinella · «norma non indicata sul progetto»** — un limite di progetto
   senza la norma da cui è preso.

## Dove guardare per scegliere il prossimo

`node apps/deepwork-id/tests/stati-sorvegliati.mjs` elenca le frasi che il
prodotto dice e che nessun banco nomina, **app per app**. ⚠️ È una **misura,
non una prova**: non fallisce mai, e l'elenco è di **candidati da guardare a
mano** — un motivo del banco può sorvegliare lo stesso stato con altre parole.

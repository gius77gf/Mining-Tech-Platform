# Le pagine affiancate: sembrano la stessa famiglia?

*E8 della roadmap. La direttiva del fondatore (27/07) dice che le app devono
copiare la **struttura** del core «pelo per pelo» e distinguersi **solo per il
colore**. Questo documento non è un'opinione su come sono venute: è la misura
di che cosa hanno in comune davvero, presa aprendo le sei pagine alla stessa
larghezza e mettendole una accanto all'altra.*

## Come si rifà

```
python3 -m http.server 8931
node apps/deepwork-id/tests/browser/famiglia-strutture.mjs 8931
node apps/deepwork-id/tests/browser/famiglia-strutture.mjs 8931 --controprova
```

⛔ **E FINO ALL'09/08 QUESTA RIGA MANDAVA NELLO SCRATCHPAD** (`node
…/scratchpad/<tuo>/famiglia.mjs 420`), cioè a una misura che alla sessione dopo
**non esiste** — lo stesso difetto della prova della verifica periodica di
Scudo. Adesso la misura è un banco registrato in `tutti.mjs`, con la sua
controprova, e gira in ogni giro del browser: **20 asserzioni, 6 superfici
misurate su 6, 0 dichiarate non misurate**.
⚠️ Il banco pinza **solo ciò che questo documento ha misurato identico**. Le
etichette della barra in basso NON ci sono di proposito — la tabella qui sotto
spiega perché un corpo unico non è raggiungibile — e restano a
`barra-etichette.mjs`, che chiede «la parola sta nella sua colonna?».
⚠️ Il **foglio a contatto** (`famiglia.png`) resta una cosa da guardare a mano:
i numeri dicono se una barra è alta uguale, non se la pagina *sembra* della
stessa famiglia. Il banco copre i numeri; l'occhio no, e non finge di farlo.

Produce `famiglia.png` — la prima fascia di ogni pagina, sette strisce
affiancate — **e va guardata**, perché i numeri dicono se una barra è alta
uguale, non se la pagina sembra della stessa famiglia.

## Quello che è già identico

| misura | valore |
|---|---|
| altezza della barra alta (`.top`) | **62 px** in tutte e sei |
| altezza del titolo di sezione (`.sec`) | **19 px** in tutte e sei |
| carattere del titolo di sezione | **11,5 px / 2,5 px di spaziatura** in tutte e sei |
| banner della modalità dimostrazione | stessa forma, stesso testo, stesso posto |
| griglia dei KPI | due colonne, stesso passo |

Guardando il foglio a contatto, le sei si leggono **come una famiglia**: stessa
barra alta col titolo e il sottotitolo, stessi due bottoni tondi in alto a
destra, stesso banner, stesso titolo di sezione col pallino, stesse schede.
Quello che cambia è la tinta — che è esattamente quello che deve cambiare.

E cambia anche il **primo blocco**, ed è giusto che cambi: Campo apre con il
quadro della giornata, Scudo con «segnala un near-miss», Terra con la vita
della cava. Non è incoerenza: è la prima cosa che serve a chi apre quell'app.

## Quello che NON è identico, e va deciso

### 1. L'etichetta della barra in basso è scritta a tre misure diverse

| app | voci nella barra | etichetta a 390 px | a 360 px |
|---|---|---|---|
| flotta | 6 | **9 px** | 9 px |
| campo | 5 | 8,5 px | 8 px |
| scudo | 6 | 8,5 px | 8 px |
| sentinella | 6 | 8,5 px | 8 px |
| terra | 6 | 8,5 px | 8 px |
| conti | 8 | **8 px** | 7,5 px |

Il core scrive **9 px / 700** (`.bn span`), e la prima ipotesi era che le app si
fossero allontanate dal riferimento per pigrizia. **La misura dice il
contrario.** Rimessa l'etichetta a 9 px e misurata la larghezza del testo contro
quella della sua colonna:

| app | a 390 px | a 360 px |
|---|---|---|
| campo | ci stanno tutte | ci stanno tutte |
| flotta | ci stanno tutte | ci stanno tutte |
| terra | ci stanno tutte | **«Denuncia» esce** (54 su 57) |
| conti | ci stanno tutte | **«Quadro» e «Fatture» escono** |
| scudo | **«Personale» e «Documenti» escono** (61 su 63, 59 su 62) | idem |
| sentinella | **«Monitoraggi», «Programma», «Adempimenti» escono** | **cinque su sei escono** |

Cioè: **9 px non è raggiungibile per tutte.** Le parole di Scudo e Sentinella
sono più lunghe, e a parità di colonne (sei) non entrano. Il rimpicciolimento
non è una svista: è l'unica cosa che si poteva fare.

⛔ **E allora il difetto non è il numero, è il modo.** Oggi la stessa decisione
è presa **sei volte a mano**, con forme diverse — `font-size` in una regola,
`letter-spacing` in un'altra, `padding` in una terza, e due dentro una
`@media (max-width:359px)`. Nessuna delle sei porta scritto **perché** quel
numero, e niente si accorge se domani una voce nuova con una parola più lunga
smette di entrare. È lo stesso difetto della barra andata a capo (regola 19) e
della manina che promette: una decisione giusta, presa a occhio e non
sorvegliata.

**Che cosa farne** — non uniformare i numeri, che sarebbe sbagliato.

## ⛔ E cercando il controllo giusto è saltato fuori un punto cieco vero

*(01/08, dopo cinque versioni dello stesso banco. Vale la pena raccontarle,
perché l'errore era sempre lo stesso.)*

Il controllo che volevo scrivere era «l'etichetta esce dalla sua colonna?», e la
risposta era sempre **no**. Le prime quattro versioni sbagliavano il come:

| versione | come chiedeva | perché era sbagliata |
|---|---|---|
| 1 | larghezza da un `Range`, righe = altezza ÷ corpo | «TUTTE vanno a capo» (5 su 5, 6 su 6, 8 su 8): l'altezza porta con sé l'interlinea |
| 2 | `Range.getClientRects().length` | «sei voci di Sentinella vanno a capo» — **lo scatto della barra le mostra su una riga sola** |
| 3 | `white-space:nowrap` sul «figlio che non è l'icona» | quel figlio **non esiste**: l'etichetta è un *nodo di testo*, e il ripiego misurava il bottone intero, icona compresa |
| 4 | avvolto il nodo di testo, confrontato con la colonna | 0 fuori posto **e la controprova incapace di fallire** |

La quarta ha dato la risposta vera, misurando *perché* non riusciva a fallire:
gonfiando l'etichetta **la colonna cresce con lei** (48 → 56 px). Quindi
l'etichetta non può essere tagliata: la domanda era mal posta dall'inizio.

**Quello che cede è la barra.** Con l'etichetta a 11 px, Sentinella si ritrova
**431 px di contenuto in 344 px di barra** — e siccome `.nav` ha
`overflow:hidden`, le ultime voci spariscono **in silenzio**. La pagina resta
larga 360, quindi `fuori-schermo` non se ne accorge; la regola 19 conta le
colonne ma non le misura. **Nessuno guardava qui.**

Il banco `browser/barra-etichette.mjs` adesso pone l'unica domanda che il
browser sa rispondere senza ambiguità — *il contenuto della barra sta dentro la
barra?* — e la controprova lo vede fallire.

📌 Resta vero, e non è un difetto: i numeri restano sei, decisi a mano, perché
dipendono dalle **parole di ogni app**. Non erano sorvegliati; adesso lo sono.

### 2. L'altezza della barra: conti 53 px, le altre 58

Conseguenza del punto 1 (etichetta più piccola, `padding` più stretto scritto a
mano). Se la misura dell'etichetta diventa una regola sola, questa si allinea
da sé.

### 3. Genesi non è nella famiglia, e va dichiarato

`genesi.html` non ha `.top`, non ha `.sec`, non ha barra in basso: è un portone
con il marchio grande e due schede. È una scelta — Genesi è l'unica app che si
apre su uno strumento e non su un elenco — ma **oggi non è scritta da nessuna
parte**, e chi confronta le sette pagine la legge come una divergenza.
Da decidere: o rientra nella struttura, o la differenza si dichiara qui con la
ragione. È l'item E7 della roadmap.

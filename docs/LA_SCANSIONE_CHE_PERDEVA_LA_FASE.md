# La scansione che perdeva la fase

*Trovato il 03/08, per caso, mentre nasceva un'altra regola. È il difetto più
grave incontrato finora in un CONTROLLO — non nel prodotto — perché per
settimane ha risposto «nessuna violazione» senza guardare.*

## Che cos'è la «fase»

`run-stile.mjs` non capisce il JavaScript: lo **scorre**, carattere per
carattere, segnando ogni posizione come *codice*, *commento* o *dentro una
stringa*. Serve a non confondere una cosa scritta con una cosa fatta: un
`prompt(` dentro le virgolette è testo, fuori è una chiamata vietata.

Quella scansione ha uno stato: «adesso sono dentro una stringa» / «adesso no».
Se sbaglia **una volta** ad aprire o chiudere, tutto quello che viene dopo è
invertito: il codice vero viene preso per testo e il testo per codice. È la
**fase**, ed è il tipo di errore che non fa rumore — nessuna eccezione, nessun
test rosso, solo controlli che smettono di guardare.

## I due difetti, indipendenti fra loro

### 1. La pagina letta come se fosse tutta JavaScript

Il file veniva scorso dal **primo carattere**, `<!DOCTYPE html>` compreso. Ma
una pagina non è un programma: il programma sta dentro i `<script>`, e tutto il
resto è markup e **testo che l'utente legge**.

Il testo è in italiano. E in italiano c'è un apostrofo ogni due parole —
«l'ecosistema», «un'altra», «dell'accento». Ognuno apriva una stringa che
correva fino all'apostrofo successivo.

| superficie | apostrofi nel testo fuori dai tag |
|---|---|
| core (radice) | 131 |
| Genesi | 124 |
| Sentinella | 102 |
| Scudo | 97 |
| … | … |
| Deepwork ID · profilo | 7 |

Con un numero **pari** non succede niente di visibile. Con uno **dispari** la
fase si inverte, e resta invertita per il resto del file.

### 2. Lo slash giudicato dall'ultimo carattere invece che dalla parola

In JavaScript `/` è due cose diverse: una divisione (`larghezza / 2`) e
l'inizio di un'espressione regolare (`/[a-z]/`). La scansione le distingueva
guardando l'**ultimo carattere** prima dello slash: se era `(`, `=`, `,`… era
una regex.

In Genesi c'è scritto davvero questo:

```js
return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
```

L'ultimo carattere prima dello slash è la **`n` di `return`**. Non è nell'elenco
→ divisione → la scansione entra nel contenuto della regex come se fosse
codice → e la **virgoletta lì dentro** apre una stringa fantasma, lunga 1.500
caratteri.

## Quanto era grande il buco, misurato

Il metro è semplice e non si presta a discussioni: una `function` dichiarata a
**colonna zero** è codice, sempre. Se la scansione la chiama «stringa», ha perso
la fase.

| | dichiarazioni | fuori fase |
|---|---|---|
| Genesi | 195 | **115** |
| core | 304 | 0 |
| tutte le altre superfici e i moduli | 435 | 0 |

**115 su 195 in Genesi**: tratti da decine di migliaia di caratteri in cui la
regola 1 — niente `alert`/`confirm`/`prompt`, la direttiva sullo stile — non
guardava niente e rispondeva lo stesso «nessuna violazione».

E il dettaglio che vale più di tutti: **il core ne usciva pulito per caso.** 131
apostrofi (dispari) e 39 virgolette (dispari) nel suo testo: due inversioni che
si annullavano a vicenda. Bastava una frase in più nel markup per accecare una
regola su una pagina intera, e nessuno se ne sarebbe accorto.

Un secondo segno c'era, e non l'aveva letto nessuno: la controprova a tappeto
della regola 1 elencava le superfici in cui iniettava il difetto, e **Genesi non
c'era**. Non perché fosse esclusa: perché la scansione, andata fuori fase, non
trovava più nessun punto di ri-sincronizzazione da cui iniettare. Il controllo
diceva quanti soggetti aveva guardato — la difesa scritta in `CLAUDE.md` — ma
l'elenco lo leggeva solo chi ci faceva caso.

## La correzione

1. **In una pagina, il JavaScript sta solo dove sta.** Dentro i `<script>` e
   dentro gli attributi `on*` — che sono **253**, di cui 202 nel solo core:
   buttarli via per semplificare sarebbe stato barattare un buco con un altro.
   Tutto il resto (testo, tag, CSS dentro `<style>`, gli altri attributi) non è
   codice, e un apostrofo lì dentro non apre più niente.
   Ogni blocco ha il **suo** stato: un template aperto in uno non prosegue nel
   successivo.
2. **Prima dello slash si legge la parola intera**, non l'ultima lettera. Dopo
   `return`, `typeof`, `case`, `in`, `of`, `throw`, `yield`, `await`… ci sta
   un'espressione, quindi lo slash è una regex. Dopo un nome qualunque
   (`larghezza`) è una divisione.

Una trappola già prevista: in Campo un modello di stampa contiene
`<script>window.print()</` + `script>`, spezzato apposta perché il browser non
chiuda il blocco lì. Sta **dentro** il modulo, quindi la scansione del markup
non lo incontra mai.

## Come si sa che la correzione conta

La misura è diventata una **prova permanente** dentro la suite:

> `✓ la scansione non perde la fase: 7.485 dichiarazioni in 22 file, nessuna presa per stringa`

E la controprova rimette i due difetti nella scansione vera, uno alla volta,
stampando quanti caratteri ha cambiato:

```
✓ (1) la pagina letta come se fosse tutta JavaScript
    iniezione: -9 caratteri  ·  801 dichiarazioni perse
✓ (2) lo slash giudicato dall'ultimo carattere invece che dalla parola
    iniezione: -37 caratteri  ·  54 dichiarazioni perse
```

### E la prova ha dovuto essere corretta due volte, per la solita ragione

La prima stesura contava solo le dichiarazioni a **colonna zero**: 934 ancore,
che sembravano tante. Ma il codice delle sei app sta tutto **indentato** dentro
un blocco, quindi quelle sei pagine — le superfici che contano di più —
davano **zero ancore**: la prova non le guardava affatto. Contando anche le
righe indentate le ancore diventano **7.485**, e nessun file resta fuori (ora
la prova lo pretende: se un file non dà nessuna ancora, cade).

La seconda correzione è più piccola e altrettanto istruttiva: si pretende «non
è il contenuto di una stringa», non «è codice». In `dw-grafici.js`
l'intestazione contiene l'esempio d'uso `const g = dwGrafici.linea(…)` dentro
un commento — e un pezzo di codice mostrato in un commento **è** un commento.
La prima versione lo accusava a torto.

Nello stesso passaggio è entrato nell'elenco dei moduli
`shared/dw-app-ui.js`, nato il giorno prima: **nessuna regola lo guardava**, ed
è il file che tutte e sei le app caricano.

### La controprova a tappeto, rimessa in bolla

La correzione ha reso visibile un difetto della controprova stessa. I suoi
punti d'iniezione erano quelli in cui si chiude un **template** — la forma che
mandava fuori fase la scansione vecchia. Ma Genesi i template quasi non li usa:
scrive per concatenazione, e ne dava **24** contro i **120** di Terra, che è un
terzo della sua misura. **La superficie più grande era la meno provata**, e la
ragione era il modo di scrivere di chi l'aveva scritta, non il rischio.

Adesso vale per tutte e tre le virgolette: i punti di ri-sincronizzazione sono
**20.566**. Provarli tutti costa una ri-scansione del file per ognuno — la
suite passerebbe da un minuto a più di due — quindi se ne provano **120 per
superficie**, presi a **passo regolare** su tutta la lunghezza, e il numero
saltato **si stampa**:

```
✓ controprova a tappeto su Genesi: 228 dialoghi su 3409 punti (uno ogni 15), tutti trovati
✓ controprova a tappeto su Deepwork ID · profilo: 55 dialoghi, cioè TUTTI i punti, tutti trovati
     (1.211 iniezioni provate, prese a passo regolare su 20.566 punti)
```

Il passo regolare conta più della quantità: un difetto di fase non è un punto
isolato, è un **tratto** — se la scansione si perde, si perde per migliaia di
caratteri, e un colpo ogni quindici punti ci cade dentro lo stesso.

Il tetto è scelto **misurando**: con 120 la suite gira in **49 secondi**, cioè
meno dei **51** che ci metteva prima di tutto questo lavoro. Nel frattempo la
controprova è passata da **dieci superfici a dodici** — la vetrina e la pagina
d'accesso prima non davano nessun punto e restavano fuori in silenzio.

## La lezione, che non è sui tokenizzatori

`CLAUDE.md` la raccoglieva già in due forme — *«una prova che non sa fallire non
dimostra niente»* e *«il controllo che non guarda dove crede»*. Questa ne
aggiunge una terza, che è la più scomoda:

> **Uno strumento condiviso da tutti i controlli non è controllato da nessuno.**
> Ogni regola aveva la sua controprova e ognuna passava. Ma tutte e sedici
> stavano in piedi sulla stessa scansione, e per quella non c'era nessuna prova:
> era l'unica cosa del file di cui nessuno chiedeva conto.

Adesso ce n'è una, ed è l'unico controllo del file che verifica **lo strumento**
invece di una regola.

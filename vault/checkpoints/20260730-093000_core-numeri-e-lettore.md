# Checkpoint — 30/07/2026 09:30 UTC

## Task completato
**S10 — il core sui numeri scritti a mano, chiuso.** In tre passaggi, e ogni
passaggio ha fatto vedere quanto il precedente non stava guardando.

| Commit | Cosa |
|---|---|
| `e7a6bcd` | i 32 campi decimali con lo step frazionario (+ `a-mh`, un campo che non veniva mai letto) |
| `30e2b2e` | **altri 34** campi decimali che la regola non vedeva |
| `71fc0a7` | **chi li legge**: via il lettore che di un numero illeggibile fa zero |

## Il filo: la regola guardava una firma sola su due
Ieri ho scritto in `run-stile.mjs` che un campo decimale non è mai
`type="number"`, e ho riconosciuto i campi decimali dallo **step frazionario**.
La regola passava. Nella stessa schermata ce n'erano **34** che si dichiaravano
decimali nell'altro modo possibile — `type="number" inputmode="decimal"`, senza
step — e su quelli lo step assente vale 1, quindi il browser oltre a scartare la
virgola **rifiuta i decimali**. Fra loro: il diametro del foro, la spalla e
l'interasse del calcolatore di carica, i quattro parametri di Kuz-Ram, e le
percentuali di frammentazione, dove `step="1"` vietava perfino 12,5 su una
percentuale che si dichiarava decimale.

Non li ho trovati rileggendo la regola: li ho trovati mentre guardavo **come
vengono letti** i campi che avevo appena convertito, e in quell'elenco sono
comparsi dei `type="number"` che secondo la regola non potevano esserci.

## Il difetto peggiore del giro: zero non è «non lo so»
17 campi decimali del core si leggevano con `parseNum0`, che di ciò che non
capisce fa **zero**. Non è un dettaglio tecnico: zero è **una misura**, e
sbagliata, e finisce dentro somme e medie senza lasciare traccia. Un costo di
riparazione a zero, le ore di lavoro di una macchina a zero, i litri di gasolio
della giornata a zero. Il caso peggiore era `dep-new`, che **sovrascrive** una
giacenza di magazzino: un numero illeggibile la azzerava.

Adesso ci sono tre letture per tre bisogni diversi, ed è la distinzione che
conta:
- `numDetto(id, cosa)` — il dato serve: se non si legge lo **dice**, nominandolo,
  e restituisce null perché chi chiama si fermi;
- `numDaCampo(id)` — il dato è facoltativo: null, non un numero sbagliato. Il
  diametro di perforazione resta «non indicato», che è la verità;
- `leggiCampo(id)` — l'esito completo, per distinguere **vuoto** da **non si
  capisce**: non sono la stessa cosa e non meritano la stessa risposta.

E una **guardia sola sul documento**: quando si lascia un campo dichiarato
decimale, se il numero non si legge lo dice subito e segna la casella. Il posto
giusto per accorgersene è il campo, dove chi compila può ancora correggere — non
il salvataggio, dove il numero è già dentro un totale. Vale anche per i campi
creati dentro una modale, perché l'ascoltatore è uno e sta sul documento.

## Due cose imparate, che valgono oltre questo task
**1. Un conteggio inchiodato in un test scambia il progresso per una
regressione.** Avevo scritto `ok(n === 53)` per dire «i campi interi non sono
stati toccati». Quando si è scoperto che 34 di quei 53 erano decimali travestiti,
il test ha accusato la correzione. Ora guarda la **natura** dei campi — ogni
campo rimasto `type=number` deve essere un intero — che è ciò che la regola dice
davvero.

**2. Non si indovina la grammatica.** Il nome del dato nel messaggio viene
dall'etichetta accanto al campo (così se cambia l'etichetta cambia il
messaggio). Ci mettevo anche l'articolo, ricavandolo dalla prima lettera: su
«Ore lavoro» veniva «l'ore lavoro». In italiano il genere di un nome non si
ricava dalla lettera iniziale, e un plurale femminile da uno maschile non si
distinguono affatto. Una frase sgrammaticata in un messaggio d'errore fa dubitare
del programma proprio quando bisogna credere a quello che dice: meglio una frase
asciutta che una sbagliata. Dove il messaggio **blocca** un salvataggio il nome è
scritto a mano, e allora l'articolo c'è ed è giusto.

E la dodicesima volta che una mia prova ha accusato il codice sbagliando io: la
prova sui 34 campi teneva nel `PRIMA` il **percorso** del file invece del
contenuto, quindi digitava in **zero** campi e diceva «passata». Ora ha una
guardia che si rifiuta di passare se l'insieme da provare è vuoto.

## Coerenza fin nei dettagli
Tre punti dove l'app scriveva un numero **dentro** un campo con `toFixed`, cioè
col punto inglese: la calibrazione della scala della foto (da cui esce ogni
misura presa dall'immagine), la sua gemella per l'altezza, e l'H banco proposto.
Più tre default (`umc-k` «0.9», `bk-re` «1.2», `bk-rr` «2.6»). Con `type=number`
il punto era obbligato dal browser; da campi di testo è un esempio scorretto
sotto gli occhi di chi compila, mentre nella stessa schermata gli altri numeri
hanno la virgola. L'app deve scrivere nella convenzione che poi pretende di
leggere.

Il **service worker** precacha il modulo condiviso (cache a v5): il core lo
importa come modulo, quindi senza quel file **non parte** — esattamente come per
l'SDK di Firebase, che era già precachato per la stessa ragione.

## Stato
Suite: **52 stile** (erano 40), **270 KPI**, 7 demo, 43 helper, 23 pointcloud,
9 manifest. Tutte verdi.
Verifiche di questo giro, eseguite nel browser vero contro il **markup vero**
estratto dal file: 33 campi su 33 tengono «3,5» in locale en-US e it-IT, con la
controprova che mostra il vecchio tag trasformarlo in «35» e dichiararlo valido;
33 asserzioni sul lettore («1.250» litri fa comparire le due letture senza
indovinare, «mille euro» nel costo non diventa 0 €, 12,5% ora si legge, «2,4,5»
viene rifiutato dove `parseFloat` ne faceva 2,4, un campo vuoto non fa scattare
niente); e la conferma che il modulo condiviso si carica dal percorso che il core
usa, servito dalla radice.

## Prossimo passo atomico
**Ponte P2, Campo → Terra: l'ultimo ponte che manca.** La produzione del turno
di Campo alimenta i volumi per fronte di Terra senza reinserimento a mano.

Da decidere con la stessa regola degli altri quattro ponti — *qual è il modo di
sbagliare peggiore del problema che risolve* — e qui si vede già: Campo misura
in **tonnellate** o in viaggi, Terra ragiona in **metri cubi**. Serve la
**densità**, ed è lo stesso nodo del ponte Terra ↔ Conti, dove la scelta è stata
**non convertire e non stimare** dove la densità manca, dirlo e tenere quelle
tonnellate fuori dal conto. Conviene riusare quella strada, non inventarne una
seconda: due ponti che trattano la stessa mancanza in due modi diversi sono un
difetto che nascerebbe già scritto.

Da guardare prima di cominciare: `apps/campo/campo-data.js` (com'è fatta la
produzione di turno) e `apps/terra/terra-data.js` (com'entrano i volumi per
fronte), più il ponte Terra ↔ Conti come precedente.

⚠️ Resta aperto e **dichiarato**: `parseNum` nel core non passa dalla convenzione
condivisa. Legge i dati che **non** arrivano da un campo — documenti Firestore,
celle di CSV delle **macchine**, stringhe interne — e per un file di macchina
«1.250» è 1,25 ed è **giusto**. Prima di irrigidirlo va misurato cosa gli arriva
davvero: fra le 145 letture ci sono `cells[colMap.x]` di un rilievo, e la
**notazione scientifica** (`1.5e3`) che `numeroScritto` non accetta e
`parseFloat` sì. Irrigidire senza quella misura regredirebbe un import.

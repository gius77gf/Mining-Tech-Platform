# Cinque cantieri, e il giro di andata e ritorno che non si chiudeva

**Data:** 01/08/2026 · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Partenza del ciclo:** `04692c3` (canarino)
**Unità precedente:** `20260801-221000_il-non-ce-scaduto.md`

## Il lavoro dei cantieri

Cinque aperti in parallelo su app diverse — la regola del primo moltiplicatore,
applicata. Tre rientrati (**Genesi**, **Sentinella**, **Terra**), due ancora al
lavoro (**Conti**, **Campo**). Prove da **1308 a 1383**, copertura **574/574**,
nessuna funzione scoperta.

**Genesi esce dalla pagina.** Dodici export in `apps/genesi/genesi-data.js`, e
non sono i dodici più facili: sono **una storia sola**, quella che decide se una
volata si può sparare — il referto del sismografo, la legge del sito, il limite
di norma, l'aria che parte con la roccia. Le funzioni dentro `genesi.html`
scendono da 186 a **174**.

**Sentinella — la catena di custodia.** Ogni misura porta se è entrata da file
(con nome del file e momento) o a mano; quella di cui non si sa nulla è
**«provenienza non dichiarata»**, non «a mano». Il cantiere ha **misurato** che
non è la stessa idea di `origineDi` di Terra — `sentinella.provenienzaMisura
=== terra.origineDi` risponde `false`, e i due vocabolari non si sovrappongono:
Terra descrive **come è stato calcolato** un volume, Sentinella **per che strada
è entrato** un numero che l'app non calcola. Quindi niente alias in `shared/`,
e la divergenza è dichiarata.

**Terra — il banco da sempre**, e qui la parte che vale è il ragionamento:
alla domanda «la somma di anni con dei buchi è un tetto o un minimo» la risposta
non è stata *scelta*, è stata **dedotta**. Un anno cieco non può aver tolto
volume negativo, quindi la somma dei soli anni misurati non può mai stare sopra
il vero: è un **minimo**, e lo schermo scrive «**almeno** 62.700 m³». La
**quota %** invece è `null`, perché il denominatore contiene anni in cui sono
stati misurati *altri* banchi — non è né tetto né minimo, non è niente.

## ⛔ Il difetto trovato da me, e la sua forma

Un CSV **scritto da noi e riletto da noi** non tornava identico. Sette valori,
quattro rotti; il caso che morde è il più banale: un numero **negativo** esce
dal nostro export come `'-12,5` — l'apostrofo che `csvCell` mette contro la
CSV-injection — e rientra come `NaN`. Un dato che c'era, perso nel giro di casa
nostra.

La forma conta più del caso: **la prova di andata e ritorno c'era**, scritta
quando `parseCsvLine` era l'unico lettore. Il 01/08 è arrivato `leggiCsv`, che
legge il file intero — serviva, perché le banche scrivono la causale su più
righe fra virgolette e un bonifico da 12.300 € spariva — e ha ereditato **il
mestiere ma non le difese**. È il difetto da cercare ogni volta che una funzione
nuova prende il posto di una vecchia.

Tre correzioni in `shared/`: l'innesco di formula è **una** costante che
`csvCell` mette e i due lettori tolgono; `parseCsvLine` guardava **un**
carattere dopo l'apostrofo e quindi non ripuliva «\t=cmd» e « =cmd» (che
`csvCell` neutralizza di proposito — per OWASP pure TAB e CR fanno da innesco);
e `numIt` non trasforma più un non-numero in un numero enorme (`+"Infinity"`
faceva `Infinity`, e da lì ogni confronto con una soglia è vero).

E la quarta copia della convenzione sui numeri, in Genesi, è sparita. Misurando
prima: le due letture rispondevano **diverso su tre file su sette**, e una
differenza era un difetto vero — «1 234,5», le migliaia scritte con lo spazio,
diventava **1**.

## Errori miei, in questo blocco

1. ⛔ **Un `git stash` con cinque cantieri che scrivono.** Serviva a misurare la
   pagina di Genesi a `HEAD`; ha funzionato e ha ripristinato tutto, ma se un
   agente avesse scritto nella finestra il ripristino poteva rompersi. Con
   cantieri aperti si isola con una **worktree**, mai toccando l'albero vivo.
2. **La conta ha detto «3 → 0» e la sostituzione era storpiata.** Un `node -e`
   dentro apici singoli si è mangiato le virgolette e ha lasciato
   `grezzo=== ? null`: errore di sintassi, pagina morta. È la regola già scritta
   — *la conta da sola mente* — e la difesa è confrontare la copia, non contare.
   L'ha preso il banco del browser, non io.
3. **CI rossa: quattro prove aggiunte e non dichiarate** nei documenti. La
   regola che stavo applicando tutta la sera agli altri, commessa da me su un
   numero che esiste apposta per non essere contato a memoria.
4. **`INNESCO_FORMULA` esportata senza prova** — l'ha trovata il cantiere di
   Sentinella, non io: `copertura-funzioni` è rossa su una funzione scoperta in
   `shared/`. Resa privata: la usano tre funzioni dello stesso file.

## Verifica

Sulla **copia di ciò che si committa** (worktree + `git diff --cached |
git apply`, perché due cantieri stanno ancora scrivendo): `run-kpi` **1383/0**,
`run-stile` 282/0, `run-helpers` 53/0, `run-demo` 8/0, `run-pointcloud` 26/0,
copertura **11 soggetti, 0 funzioni scoperte**, `nomi-doppi` 0 da sistemare,
`sonda-vuoto` 7/0, `numeri-nei-documenti` **19/0**, `documenti-invecchiati`
13/0, `suite-collegate` 3/0 su 55 file.
Nel browser: `genesi-struttura` **18/18** dopo la migrazione — quel banco guida
l'app, e un import rotto l'avrebbe uccisa (e infatti l'ha fatto, una volta).

## Prossimo passo atomico

Raccogliere **Conti** (preventivo e conferma d'ordine) e **Campo** (gli orari
veri del turno) quando chiudono, verificarli sulla copia e committare.

Poi i tre difetti che il cantiere di Genesi ha trovato **e non ha blindato**,
in ordine di pericolo: `ppvLimit` su una frequenza non numerica restituisce la
fascia **più permissiva** di ogni norma — è un numero tranquillo sul valore che
decide se una volata si spara. Oggi non è raggiungibile dalla pagina, e la
difesa sta a un'altra riga: va spostata dentro la funzione.

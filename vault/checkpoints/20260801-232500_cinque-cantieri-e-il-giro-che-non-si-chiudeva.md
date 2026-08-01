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

---

## Aggiunta: la soglia che non si inventa più (stessa sera)

Il primo dei tre difetti che il cantiere di Genesi aveva **trovato e non
blindato**, chiuso subito perché è quello che sta sul valore peggiore.

`ppvLimit(norma, f)` decide la soglia di vibrazione al recettore — il numero
che dice **se una volata si può sparare**. Con una frequenza non numerica
cadeva nell'ultimo ramo di ogni `switch` e restituiva la fascia **più
permissiva** di ogni norma: 50,8 invece di 12,7 (USBM vecchio), 20 invece di
15 (DIN residenziale), e così per tutte e cinque.

⚠️ **Nessuna soglia è cambiata** — le curve USBM/DIN sono bloccate senza
conferma del fondatore, e il prototipo l'ha provato prima: 5 norme × 7
frequenze vere, **35 risposte identiche**. Cambia solo che cosa succede quando
la frequenza non c'è: `null`, e chi chiama lo dice.

⛔ **La prima versione della guardia era sbagliata, e l'ha bocciata il
prototipo**: `Number.isFinite(+f)` da sola lascia passare `null` e `""`, perché
`+null` fa **zero** — che avrebbe dato 0 Hz, cioè la fascia più severa. Sempre
un numero inventato, solo nella direzione che non spaventa. È la mezz'ora che
la regola «si prova in scratchpad prima di scrivere nel modulo» esiste per far
guadagnare.

I tre punti che la chiamano sono stati guardati uno per uno: la scheda dei
validatori (dove `_ppv/_lim` sarebbe diventato `NaN`, e `NaN < 0.6` è falso →
sarebbe finito su **rosso** per il motivo sbagliato), il diagramma (dove
`Math.log10(null)` fa `-Infinity` e schiaccia tutta la scala **senza errori**),
e il riepilogo.

**Controprova**: 3 difetti rimessi, 3 prove cadute; il terzo — una soglia
cambiata di **un decimale**, `12.7 → 12.8` — cambia **zero caratteri** e fa
cadere la prova giusta: il caso in cui la conta dei caratteri da sola avrebbe
mentito.

**Lo scatto**, e non era ovvio prendere il caso: la strada per cui una
frequenza illeggibile arriva davvero è una **volata salvata** — il form la
stringe fra 2 e 120, ma `apri` fa `Object.assign(D2, design)` senza stringere
niente (`genesi.html:3764`). La sonda semina quella volata in `localStorage`
prima del `goto`. Nella riga: pallino ambra, «6,4 mm/s», e «**Non si può dire
se è sotto soglia**: la frequenza del recettore non è un numero leggibile…».
Nessun verde, nessun numero inventato.
⚠️ E la sonda ha sbagliato **due volte** prima di dire il vero: cercava `.scr`
per provare di aver navigato (la schermata la dichiara il **body**, con
`scr-design`) e ha fotografato il pannello dei parametri invece della riga che
questa unità cambia.

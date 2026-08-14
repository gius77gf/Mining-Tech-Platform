# La taratura che il report non sapeva

**01/08/2026** · misure e decisioni dietro `apps/sentinella` T2b
(`coperturaTaratura`, `statoTaraturaStrumento`, `taratureDelReport`)

## Il difetto, detto in una riga

Il report di conformità di Sentinella è un documento che va all'ente, e dice
**«Conforme»** sulla base di numeri che li ha scritti uno strumento. Se quello
strumento non era tarato, il numero non è **riferibile** — e il prodotto non
sapeva nemmeno la domanda.

È il principio del fondatore in un punto nuovo, e col suo segno di sempre: un
giudizio **tranquillo** dove non è stato misurato niente. Solo che qui il non
misurato non è una lettura mancante: è **la provenienza di tutte le letture**.

## Perché è una mancanza vera e non una raffinatezza

Il confronto coi concorrenti la dava come assente, e la verifica riga per riga
l'ha confermata:

> «Storico tarature strumenti — grep su `calibr`, `taratur`, `manutenzione`,
> `strumento.*data`: zero. La menzione di `PPV_STRUMENTO` è il tipo di
> **fonte** del dato, non uno storico.»

E il motivo per cui conta lo dice il mestiere, non il software: davanti a una
contestazione, la prima cosa che un ente chiede su una misura non è il numero,
è **con che cosa l'hai preso e quando era tarato**. Un report che non lo sa non
è un report più leggero: è un report che non regge la domanda per cui esiste.

## ⛔ La decisione che cambia tutto: quale domanda si fa

La strada facile era tenere **una data di scadenza** per strumento e
semaforarla. Sarebbe stata sbagliata, e in un modo che non si vede:

> «È tarato **oggi**?» non è «era tarato **quel giorno**?»

Una lettura di marzo **non è coperta** dal certificato emesso ad aprile, e non
lo diventa perché oggi lo strumento è in regola. Un semaforo su «oggi» avrebbe
detto verde su un report fatto di letture scoperte — cioè avrebbe **prodotto**
la rassicurazione falsa che l'unità doveva togliere.

Da qui la forma: si tiene lo **storico** dei certificati, ognuno con
`[data, scadenza]`, e una lettura è coperta se **cade dentro uno di quegli
intervalli**.

## ⛔ E «non coperta» sono due cose, non una

Distinguerle è il secondo pezzo di mestiere, e va nella direzione opposta alla
prima:

| stato | che cosa vuol dire | come si dice |
|---|---|---|
| `coperta` | esiste un certificato che comprende quel giorno | niente da segnalare |
| `scoperta` | la lettura cade **dopo** l'inizio dello storico ma in nessun intervallo: certificato scaduto, o **buco fra due tarature** | è un problema vero, e va detto |
| `prima-dello-storico` | la lettura **precede** la prima taratura registrata | lo strumento poteva benissimo essere tarato: qui non risulta |
| `non-dichiarata` | nessun certificato leggibile per quello strumento | non si sa, e il documento lo scrive |

Schiacciare `prima-dello-storico` su `scoperta` sarebbe stato **accusare chi
compila di una cosa non misurata**: l'errore opposto a quello che l'unità
corregge, e altrettanto disonesto. Chi carica oggi il certificato in corso non
ha «tenuto uno strumento fuori taratura per due anni»: ha semplicemente un
archivio che comincia da lì.

## ⛔ La dichiarazione sta ACCANTO all'esito, non dentro

Sono due domande diverse:

- **«le letture hanno superato la soglia?»** → è un giudizio di conformità, e
  poggia su valori di sicurezza;
- **«di chi erano quelle letture?»** → è la riferibilità, e poggia su un dato
  amministrativo.

Mescolarle vorrebbe dire far cambiare un giudizio di conformità per un
certificato scaduto — sbagliato in **tutt'e due i versi**: dichiarare non
conforme una cava che ha rispettato i limiti, o lasciar credere che un
certificato in regola dica qualcosa sui livelli misurati. Restano affiancate, e
il documento le dice tutt'e due. Una prova lo blinda: **aggiungere un
certificato non muove l'esito**.

## Le date, e il 30 febbraio

Si leggono con `dataISOEsiste` e non con `Date.parse`. Il motivo è già scritto
nell'ecosistema e vale qui identico: `Date.parse("2026-02-30")` non è `NaN`, fa
**scivolare** la data al 2 marzo. Una taratura scritta male avrebbe allungato
una copertura di due giorni **in silenzio**. Un certificato con date illeggibili
— o con la scadenza prima della taratura — viene **scartato**, e quante ne sono
state scartate si vede (`scartate`), invece di sparire.

## Che cosa si vede, e dove

- **nella riga del punto di misura**: un badge **solo quando la taratura non è
  a posto** (`scaduta`, `in scadenza`, `senza data`, `non dichiarata`). Un
  secondo badge verde su ogni riga sarebbe rumore; e siccome il caso brutto
  parla, **il silenzio adesso vuol dire qualcosa**;
- **nella sezione «Taratura degli strumenti»**: lo storico dei certificati, e
  soprattutto il conto che dà senso alla sezione — *delle N letture di questo
  strumento, quante risultano coperte*. Senza quel conto l'elenco dei
  certificati sarebbe burocrazia;
- **nel report**: una dichiarazione con le parole scelte per chi la legge in un
  ufficio, e i tre numeri sotto.

⚠️ Una cosa **non** è andata nella riga del punto: la data di validità di una
taratura in regola. La riga di dettaglio è tagliata a due righe, quindi sarebbe
stata **testo morto**. Misurato con lo scatto, non dedotto.

## Lo stato di oggi non è una funzione nuova

`statoTaraturaStrumento` chiede a **`statoScadenzaHSE`** di `shared/dw-ponti.js`
— la stessa funzione che dice lo stato di una visita medica in Scudo e di un
documento in Campo. Una scadenza è una scadenza: la regola che serve a più app
non si riscrive, ed è il difetto costato una giornata intera con la convenzione
sui numeri. Qui si aggiunge **solo** il caso che quella funzione non può
conoscere: nessun certificato registrato.

## La dimostrazione contiene il caso brutto, di proposito

`run-demo` pretende dati **integri**, non dati **senza stati**. Quindi nella
demo il punto V2 ha due certificati con un **buco** in mezzo (il vecchio scade
il 30/06, il nuovo parte dal 10/07) e una lettura il 06/07 che ci cade dentro.
Sul report dei dodici mesi: **8 coperte, 1 scoperta, 10 senza taratura, su 19**.

Togliere quel buco avrebbe voluto dire costruire una difesa e poi non mostrarla
mai — la stessa ragione per cui la demo contiene una fattura senza scadenza.

## Che cosa resta aperto

1. **Nessun avviso quando una taratura sta per scadere.** Lo stato si vede
   entrando nella sezione; non entra nelle allerte del Quadro. Va deciso se ci
   deve entrare, perché il Quadro è già denso.
2. **L'import dei certificati da CSV** non c'è: si battono a mano. Una cava con
   otto strumenti li ricopia otto volte l'anno.
3. **Il ponte con Scudo**: una taratura scaduta è, di fatto, una scadenza HSE.
   Oggi le due cose vivono separate. Non è una svista, è una decisione da
   prendere: se ci va, ci va con l'origine dichiarata, come già fa
   `ponteScudo` per i superamenti.

# I fogli stampati e la domanda che nessuno faceva a Scudo — 08/08

Verificato contro il commit `53427a3`, poi **corretto** un'ora dopo: la prima
stesura di questa pagina conteneva un «non c'è» **falso**, e la correzione è la
parte che vale di più.

## Da dove nasce la domanda

In due ore, l'08/08, la domanda *«dove questa app compone qualcosa che ESCE,
chi decide i suoi numeri?»* ha dato **due difetti veri**: il volume in bianco
che usciva `0` dal CSV dei rilievi di Terra e **rientrava** come misura, e la
data di consegna dei DPI di Scudo che sul verbale firmato si leggeva «—», cioè
«non serve». Tutt'e due nel posto che CLAUDE.md indica per primo, e tutt'e due
invisibili al censimento statico: si vedono **premendo il bottone e leggendo il
foglio**.

Domanda ovvia: **e gli altri fogli?**

## ⛔ La prima risposta era sbagliata, e va letta prima del resto

Questa pagina diceva, in tabella:

> | Verbale di consegna dei DPI | scudo | **nessun banco** |
> | Cartella del lavoratore | scudo | **nessun banco** |
> | Rapporto di turno | campo | **nessun banco** |

**Due righe su tre erano false.** Avevo cercato dentro `stampe-fs.mjs` e
concluso «non c'è» per tutto il resto — la stessa mossa che la direttiva 5
vieta agli agenti di ricerca, fatta da chi quella regola l'aveva appena
applicata a due cantieri.

Un `grep` di tre secondi la smentiva:

    grep -rln "btn-dpi-verb\|btn-cartella" apps/deepwork-id/tests/browser/*.mjs
      scudo-documenti.mjs  ·  scudo-numeri-tranquilli.mjs
      stati-non-misurati.mjs  ·  stampe-fs.mjs

    grep -n "campo-foglio-turno" apps/deepwork-id/tests/browser/tutti.mjs
      → tre passate: normale, --controprova, --live

Cioè: il rapporto di turno di **Campo ha un banco tutto suo** (che apre la
finestra nuova, legge il foglio in `@media print` e scarica anche la consegna
`.txt`), e i due fogli di **Scudo venivano premuti da tre banchi**.

## La risposta vera, più stretta e ancora utile

I due fogli di Scudo venivano premuti — ma per **altre domande**: i documenti,
i numeri tranquilli, gli stati non misurati. **Nessuno chiedeva loro la domanda
di `stampe-fs`**: *questo foglio dichiara di essere fatto di dati d'esempio, e
dice che cosa comporta?*

E il file lo diceva di sé, in una riga che raccontava una storia invece di
essere un elenco:

> *«…Scudo resta fuori da questo banco.»*

Rimasta lì **cinque giorni**. Intanto, sui due fogli meno guardati, il 03/08
usciva la scadenza stampata come una qualunque e l'08/08 la data di consegna
che si leggeva «non serve».

**Chiuso l'08/08**: Scudo è dentro `stampe-fs.mjs` con i suoi due fogli, nei
**due versi** — `--controprova` (spenta la decisione `avvisoEsempio`, 4 KO) e
`--live` (sui dati veri i fogli escono **puliti**: marchiare «DATI DI ESEMPIO»
il fascicolo personale di un lavoratore vero sarebbe il danno più grosso che
questo banco possa causare).
Banco: **58 → 73** prove; controprova 26 KO con **0 iniezioni mancate**;
`--live` 50 su 50.

⚠️ **Resta fuori Genesi**, con la ragione già misurata (non ha una modalità
dimostrazione), e **nient'altro**: le sei app verticali sono coperte.

## ⛔ E l'elenco dei bottoni di stampa non si deriva dal sorgente

Due misure per saperlo, scritte perché nessuno le rifaccia. La tecnica che
funziona per gli export CSV — cercare `download = "…"` e risalire al
`$("btn-…").onclick` che la contiene — qui **non regge**, perché
`window.print()` non sta quasi mai dentro un gestore:

1. **risalendo al gestore più vicino**: 6 bottoni censiti su sei app, **1
   foglio uscito su ~8**. Pescava `#btn-dpi` invece di `#btn-dpi-verb`;
2. **inseguendo la catena a tre anelli** (`window.print()` → la funzione che lo
   contiene → chi la chiama → l'`onclick`): **peggio**, 3 bottoni e sempre 1
   foglio. In `stampaVerbale`, prima di `window.print()`, c'è
   `const fine = () => {…}`: il riconoscitore aggancia **`fine`**.

Conclusione misurata: o si scopre a **runtime**, o si tiene l'elenco a mano
**con le superfici dichiarate**, così un'app fuori elenco si vede invece di
sparire. La seconda è quella che regge, ed è quella che questa giornata ha
rafforzato.

## I trattini di Sentinella, giudicati — e sono due su otto

Il primo conto, «10», comprendeva due cifre del riquadro **fuori** dal
documento. Dentro `#rep-doc` sono **otto**, ed erano da **giudicare**, non da
contare: un «—» su un campo facoltativo va bene, su un dato che il foglio
esiste per portare no.

| quanti | dove | verdetto |
|---|---|---|
| **6** | colonna «Ora» delle letture | **giusti.** Il prodotto dichiara l'ora **facoltativa** fin dall'import (`Ora (facoltativa)`): un'assenza prevista, non una mancanza |
| **1** | cella **SD** della tabella delle volate | ⛔ **difetto** |
| **1** | **superamenti** di un punto senza soglia | ⛔ **difetto** |

**La cella SD smentiva il paragrafo sopra di sé.** Quel paragrafo dice, a
parole: *«Le caselle marcate "non dichiarato" non sono zeri: sono valori che
nessuno ha registrato, e senza di essi la distanza scalata (SD) non si
calcola»*. E poi la cella SD scriveva **«—»**, in mezzo a una colonna di
numeri, dove si legge «niente da segnalare». Tutte le altre celle della riga
passano da `cellaVolata`, che marca «non dichiarato»: questa era **l'unica
rimasta con la copia debole**, ed è quella che dipende da tutte le altre.

**I superamenti senza soglia**: «letture 6 · massimo 42,1 · media 22,0 ·
superamenti **—**». La ragione c'è ed è scritta bene — il riquadro
`senza-soglia` — ma sta **dopo**, e questa riga la si legge per prima. Il
commento del codice diceva già che «superamenti: 0» sarebbe stato una cifra
tranquilla ricavata dal nulla: il rimedio scelto allora era **un trattino**,
cioè la stessa cifra tranquilla in un altro vestito.

Adesso scrivono «non calcolabile» e «non calcolabili: nessuna soglia», e il
banco lo sorveglia con una riga che porta il **denominatore**: *«nessun
trattino fuori dalla colonna Ora»* + *«6 trattini nella colonna Ora,
facoltativa dichiarata all'import»*. Controprova: rimessi tutt'e due i
trattini, 4 trattini fuori posto e il banco cade.


## E i trattini di Scudo, misurati subito dopo

Stessa domanda, stessi due fogli appena entrati nel banco. Il **verbale** ne
aveva **cinque**, tutti nella colonna **«Modello»**; la **cartella** zero.

Su un foglio che il lavoratore firma, «Modello: —» si legge *«questo
dispositivo non ha un modello»*, mentre la verità è che **nessuno l'ha
registrato** — e l'art. 77 chiede che il DPI consegnato sia **identificabile**.
Adesso scrive «non registrato», la stessa parola delle due colonne accanto,
corrette lo stesso giorno.

⚠️ **La colonna «Taglia» resta col trattino, ed è voluto**: «unica» esiste
davvero come risposta, quindi una taglia vuota su un dispositivo a taglia unica
non è una mancanza. Sono **due domande diverse** e vanno scritte diverse —
l'eccezione sta nel banco **per nome**, non in una regola larga che le confonde.

## ⛔ E una chiave doppia in un oggetto letterale non fa rumore

Costata mezz'ora lo stesso giorno. Le due iniezioni di Scudo erano scritte come
**due voci** `"apps/scudo/index.html"` dentro lo stesso oggetto `DIFETTI`: la
seconda **cancella** la prima, senza un errore da leggere. Effetto: la
controprova rispondeva **«ok»** proprio sulla riga dei trattini mentre le altre
cadevano, e il riepilogo diceva «2 difetti rimessi, **0 iniezioni mancate**» —
cioè tutti i segnali di una controprova sana.
Il segno che l'ha smascherata: **la riga che doveva cadere non cadeva**, e
nient'altro. Unite in una chiave sola: 3 difetti rimessi, 5 KO, e la riga
stampa le colonne colpevoli (`["Modello" ×5]`).


## Gli altri tre fogli: misurati, giudizio preliminare

La riga dei trattini è ora una funzione sola (`TRATTINI`, con l'elenco
**dichiarato** delle colonne in cui il vuoto è una risposta) e su Flotta e
Conti gira come **misura**, non ancora come regola — perché il giudizio è
foglio per foglio, e l'08/08 la stessa forma ha dato **verdetti opposti**:
«Ora» in Sentinella è giusta, «Modello» in Scudo era un difetto.

| foglio | trattini | dove | giudizio preliminare |
|---|---|---|---|
| Flotta · libretto macchina | 15 → **10 in «Quota» + 5 fuori tabella** | vedi sotto | ✅ i 10 sono **il principio applicato**; i 5 restano da localizzare |
| Conti · preventivo | 2 | **«Sconto»** | **giusti**: «nessuno sconto» è uno stato vero, non un dato mancante |
| Conti · DDT | 0 | — | pulito |
| Conti · fattura | 2 | **«Quantità»**, **«Prezzo unitario»** | **da guardare**: sono sulla riga unica delle fatture registrate a **importo unico**, dove il dettaglio non esiste per scelta — ma la riga non lo dice, ed è la stessa forma dei «superamenti —» di Sentinella |
| Terra · denuncia | non misurato | — | apre una **finestra nuova**: vuole il ramo che raccoglie il popup |

⚠️ **Nessuno di questi è stato corretto**, e la ragione è la regola di casa: un
numero riportato si rimisura prima di scriverlo altrove, e un trattino si
**giudica**, non si conta. Le due righe «da guardare» sono **candidati**.


## ⛔ I 15 «Quota» di Flotta erano il principio applicato, non un difetto

Guardati uno per uno, e il verdetto si ribalta. La colonna «Quota» di quel
grafico è **spenta di proposito** (`quota: false`), e il commento accanto porta
la misura che l'ha fatta spegnere:

> *una giornata all'83% si dichiarava «quota 12,8%» sul totale di 650, e la
> giornata a 0 mezzi operativi «quota 0,0%» — cioè il numero più tranquillo che
> questa schermata sappia dire proprio sul giorno in cui la cava era ferma.*

Sommare percentuali non ha senso, quindi la quota sul totale **non esiste**: il
«—» lì è l'app che si **rifiuta** di scrivere un numero comodo. È il principio
del fondatore nella sua forma migliore, e accusarlo sarebbe stato mandare a
rovinare una cosa sana.

⚠️ **E il righello era largo**: la misura di Flotta guardava `body` in
`@media print`, cioè **tutta la pagina**, non il foglio. Dichiarando «Quota»
come colonna ammessa, i quindici si dividono: **10 sono in «Quota»** (giusti) e
**5 stanno fuori da qualunque tabella** — quelli il banco non sa ancora dire
dove siano, e finché non lo dice **non si giudicano**. Prima di trasformare
quella misura in regola va ristretto il selettore al contenitore del foglio: se
no accusa lo schermo credendo di guardare la stampa.

**Bilancio dei trattini all'08/08**: Sentinella 6 giusti + 2 **corretti**;
Scudo 5 **corretti**, 0 restanti; Flotta 10 **giusti** + 5 **non ancora
localizzati**; Conti 2 giusti (sconto), 0 sul DDT, **2 candidati** (fattura a
importo unico); Terra **non misurata** (apre una finestra nuova).

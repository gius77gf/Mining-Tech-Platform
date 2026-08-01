# Campo, Flotta, e il cantiere di Genesi che diventa un numero

**Data:** 01/08/2026 · **Tipo:** tre unità · **Branch:**
`claude/scheduled-tasks-remote-control-bk4ap6`
**Commit:** `486dd58`, `ccff0c3` · **Partenza del ciclo:** `806ec54` (canarino)
**Unità precedente:** `20260801-185831_il-lettore-di-csv-e-il-bonifico-che-spariva.md`

## Che cosa è stato completato

**1. Il cantiere di Genesi ha smesso di essere una frase.** I documenti dicevano
da giorni che le 192 funzioni di Genesi stanno dentro `genesi.html` e che
tirarne fuori un modulo «è un cantiere intero». Vero, e inutile: una frase non
dice da dove si comincia. La domanda giusta non era «quante sono», era **quante
dipendono da uno stato condiviso** — perché una funzione che legge una variabile
del modulo, per portarla fuori, va richiamata da capo in ogni punto che la usa.

| variabili del modulo che legge | funzioni |
|---|---|
| nessuna — si porta fuori com'è | **46** |
| una o due | **64** |
| da tre a cinque | 27 |
| da sei a dieci | 31 |
| più di dieci — lì è un rifacimento | 24 |

**110 su 192** si estraggono senza toccare l'architettura; la parte dura sono
**55** funzioni. La misura vive in `tests/genesi-estraibili.mjs` — non in uno
scratchpad — perché lo strumento **ha sbagliato una volta prima di rispondere
bene**: contava come variabili globali anche i parametri delle funzioni freccia,
e concludeva «non si estrae niente», che è falso. Nei test si corregge; in uno
scratchpad si riscrive sbagliato da capo.

**2. Campo — il riposo fra due turni.** **3. Flotta — la pagella del parco**
(costo orario × disponibilità). Cantieri paralleli, rientrati e verificati.

## ⛔ Come sono stati committati, e perché conta

Il terzo cantiere (Scudo — appaltatori e DUVRI, art. 26 D.Lgs 81/08) era ancora
al lavoro: sul disco aveva **cinque funzioni senza prova**. È rimasto **fuori**
dal commit.

Non è una precauzione teorica, è la regola nata un'ora fa da una CI rossa: *la
verifica vale per lo stato **che si committa***. Con cantieri aperti l'unico modo
di rispettarla è costruire il contenuto **da `HEAD`**, metterlo nell'indice con
`hash-object -w` + `update-index --cacheinfo` senza toccare il working tree, e
misurare **la copia**. È quello che è stato fatto, e la copia è verde.

## Due errori miei, e tutt'e due presi da un controllo

1. **Il commento di un file di misura contraddiceva la sua uscita**: riportava i
   numeri di una versione precedente dello strumento (37 e 72 invece di 46 e
   64). È il difetto che `numeri-nei-documenti.mjs` esiste per prendere nei
   documenti — e in un file di misura vale doppio.
2. **`DEVELOPMENT.md` finito a zero byte**: una sostituzione scritta con la
   lettura **annidata dentro l'apertura in scrittura**, che tronca il file prima
   di leggerlo. Ripristinato da git e rifatto in due passi. Stessa famiglia
   dello script che «non fallisce» ma non ha fatto niente: l'unica difesa è
   **guardare il risultato**, che qui era un `wc -c` a zero.

E una pulizia: i **contrassegni col pid** che i banchi lasciano nella cartella
servita ora sono in `.gitignore`. Un `git add .` distratto li porterebbe dentro,
e un file di tre byte nella radice è il genere di cosa che nessuno nota finché
non dà fastidio.

## Verifica

Sulla copia di ciò che si committa: `run-kpi` **1282/0**, `run-stile` 275/0,
`run-demo` 8/0, copertura **525/525** e 9 soggetti a posto, `sonda-vuoto` 7/0,
`nomi-doppi` 0 da sistemare, `numeri-nei-documenti` 17/0, `suite-collegate` 3/0
su 54 file. Documenti riallineati a **1.649 prove**.

## Prossimo passo atomico

Raccogliere il cantiere di **Scudo** (appaltatori e DUVRI) quando chiude:
verificare che le sue cinque funzioni abbiano le prove, alzare il fondo di
`scudo`, guardare gli screenshot, e committare misurando la copia.

Poi, dalla misura di Genesi appena fatta, il primo passo del cantiere vero:
portare fuori in `apps/genesi/genesi-data.js` le **46 funzioni che non leggono
nessuna variabile del modulo**, con le loro prove. È il primo pezzo di prodotto
che oggi ha zero prove pure, e adesso si sa esattamente quanto è grande.

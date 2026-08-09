# Sviluppo — come si lavora su questo repository

*Aggiornato il 31/07/2026. La versione precedente era ferma alla primissima
fase («v1.0 Field Operations Platform», «localStorage per persistenza dati») e
descriveva un prodotto che non esiste più: chi la leggeva si faceva un'idea
sbagliata di tutto — di dove stanno i dati, di quante superfici ci sono, di
cosa è già coperto da prove.*

## Cos'è, in due righe

Un monorepo di applicazioni web **senza framework e senza build**: HTML, CSS e
JavaScript a moduli, aperti direttamente dal browser. I dati stanno su
**Firestore**, isolati per organizzazione; senza login le app mostrano una
**demo** con dati finti, così si possono aprire e far vedere senza configurare
niente.

## Le superfici

| Dove | Cos'è |
|---|---|
| `index.html` (radice) | il **core** Deepwork: un monolite di ~8.000 righe, PWA |
| `apps/index.html` | la **vetrina** dell'ecosistema |
| `apps/<nome>/` | le sei app verticali: `campo`, `conti`, `flotta`, `scudo`, `sentinella`, `terra` |
| `apps/genesi/` | il simulatore di volata |
| `apps/deepwork-id/` | accesso, abbonamenti, isolamento (la «Fase 0») |
| `shared/` | stile vincolante + SDK identità + motore grafici + convenzioni comuni |

Ogni app verticale è fatta di due file: `index.html` (la pagina) e
`<nome>-data.js` (le **funzioni pure**: calcoli, letture CSV, riepiloghi). La
divisione non è estetica — è quello che rende le app **provabili senza
browser**.

## Aprire il progetto in locale

```sh
python3 -m http.server 8823        # dalla radice del repo
# poi: http://127.0.0.1:8823/apps/       (la vetrina)
#      http://127.0.0.1:8823/apps/conti/ (una app)
```

⚠️ **Il core (`/index.html`) non si apre in locale, e non è colpa del login.**
Tutto il suo programma sta in un `<script type="module">` che importa Firebase
da `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano i
segnaposto («Funzione nav non ancora pronta»). Per aprirlo davvero si monta
`apps/deepwork-id/tests/browser/finto-firebase.mjs` **prima** di navigare.

## Le prove

**2.431 prove girano senza rete e senza browser**, con `node` (contate lanciandole, non a memoria — al 09/08: 1979 + 318 + 75 + 32 + 9 + 8 + 7 + 3):

> ⚠️ **E quel numero conta SETTE suite, non tutto quello che gira.** Rimisurato
> l'08/08 **a sera** sommando le righe «Risultato …» di un giro intero: il giro
> `node` completo esegue **2.663** asserzioni, perché ne lancia altre **tredici**
> (sonda del vuoto 15, limite del giro 9, numeri nei documenti 26, orologio del
> vault 3, documenti invecchiati 15, sintassi delle pagine 34, import esistenti
> 153, nomi liberi 24, classi orfane 2 + 6, funzioni mai usate 4, porte dei banchi 3,
> suite collegate 3 = **297**).
> ⚠️ *E l'elenco NON conta le due controprove nate l'08/08 —* `iniezioni fresche`
> *e* `server orfani` *— che stampano un verdetto invece di un totale: girano nel
> giro (che è passato da 28 a **32** comandi) ma non hanno una riga «Risultato»
> da sommare. È l'etichetta più larga del suo numero, presa mentre la si
> scriveva: qui il numero è stretto e la frase lo dichiara.*
> ⚠️ *Questa nota era ferma al 07/08 e diceva 2.474 e «il numero da citare resta
> 2.251» mentre il titolo sopra diceva già 2.310: il controllo sorveglia il
> **totale**, non la prosa che lo spiega. È la quarta forma di invecchiamento
> raccolta in `CLAUDE.md`.*
> **Il numero da citare resta 2.431**, e la ragione è che le altre dieci contano
> **file, non prove**: `import esistenti` fa un'asserzione per file e `classi
> orfane` una per pagina, quindi il loro totale si muove ogni volta che nasce un
> file — un numero che cresce senza che nessuno abbia scritto una prova è un
> numero che non vuol dire niente. Le sei suite contano **casi**, e per questo
> sono quelle sorvegliate da `numeri-nei-documenti.mjs`.

E **724 funzioni pure su 724** sono chiamate per nome da quelle prove: tutte e
sei le app al 100%. Non è «provate bene» — è «non ce n'è nessuna che nessuno ha
ancora guardato», che è il minimo e finora non c'era.

⚠️ **Quel 724 conta le sei app, non i moduli condivisi**, e la riga di riepilogo
lo dice («in 6 app»). I condivisi si contano a parte — **142 su 142** in cinque
moduli: `dw-shell.js` **46/46**, `dw-ponti.js` **46/46**, `genesi-data.js`
**37/37**, `genesi-formato.js` **8/8**, `pointcloud.js` **5/5**. Vanno guardati
con più attenzione delle app, non con meno: una funzione sbagliata lì sbaglia in
sei posti insieme.
⚠️ *Questi cinque numeri erano fermi a «593 · 23/23 · 31/31 · 5/5», cioè a un
perimetro di tre moduli: il verdetto («tutti al 100%») reggeva, la prova no. È
la terza forma di invecchiamento raccolta in `CLAUDE.md` — una prova che marcisce
non rende la riga sbagliata, la rende non credibile. Il controllo sorveglia il
totale delle app, non questa scomposizione: rimisurati a mano l'08/08 con*
`node apps/deepwork-id/tests/copertura-funzioni.mjs`.

⛔ **E il 100% vale per il perimetro misurato, non per tutto il prodotto.**
Le sei app hanno la loro logica in `apps/<nome>/<nome>-data.js`, che `node`
importa. **Genesi no**: le sue **192 funzioni** stanno dentro
`apps/genesi/genesi.html`, e da lì non si importano — di Genesi entra nel conto
solo `pointcloud.js`. Non è una svista da correggere in una riga — ma dal
01/08 «è un cantiere intero» ha smesso di essere una frase ed è diventato un
**numero**, perché una frase non dice da dove si comincia né quanto si è
avanzati. `node apps/deepwork-id/tests/genesi-estraibili.mjs` misura quante
funzioni si possono portare fuori **senza cambiargli la firma**:

| variabili del modulo che legge | funzioni |
|---|---|
| nessuna — si porta fuori com'è | **46** |
| una o due | **64** |
| da tre a cinque | 27 |
| da sei a dieci | 31 |
| più di dieci — lì è un rifacimento | 24 |

Cioè **110 su 192 si estraggono senza rifare il modo in cui Genesi tiene il suo
stato**, e la parte davvero dura sono 55 funzioni. La domanda giusta non era
«quante sono», era «quante dipendono da uno stato condiviso»: una funzione che
legge una variabile del modulo non è una funzione pura scritta nel posto
sbagliato, è una funzione che va richiamata da capo in ogni punto che la usa (tirarne fuori
un modulo dati resta un cantiere intero), ma il numero non deve poter essere letto
per più di quello che è: dal 01/08 lo dichiara il censimento stesso, in fondo
alla sua uscita, e il conto lo **misura** invece di scriverlo a mano. Lo conta
`copertura-funzioni.mjs`, e questo numero lo verifica `numeri-nei-documenti.mjs`:
era già finito sbagliato due volte perché scritto a memoria.

```sh
node apps/deepwork-id/tests/run-kpi.mjs        # i calcoli delle sei app + i lettori CSV
node apps/deepwork-id/tests/run-stile.mjs      # le regole di stile vincolanti, rese verificabili
node apps/deepwork-id/tests/run-helpers.mjs    # numeri, unità, soldi, CSV condivisi
node apps/deepwork-id/tests/run-pointcloud.mjs # lettura nuvole di punti
node apps/deepwork-id/tests/run-manifest.mjs   # i manifest delle PWA
node apps/deepwork-id/tests/run-demo.mjs       # i dati della demo

# ⚠️ E POI, SEMPRE, con l'orologio del cliente. Questo contenitore è a
# Greenwich; le cave sono in Italia. Il 31/07 tre punti del prodotto
# sbagliavano il giorno OGNI GIORNO, e in UTC erano tutti verdi.
node apps/deepwork-id/tests/orologio-cliente.mjs   # le suite sensibili alla data, in TZ=Europe/Rome

# I numeri scritti QUI SOPRA e nei documenti del fondatore sono quelli veri?
# Il 31/07 tre conteggi erano invecchiati senza che nessuno se ne accorgesse:
# un numero in un documento non fallisce, sta lì.
node apps/deepwork-id/tests/numeri-nei-documenti.mjs

# Quante funzioni delle app sono davvero PROVATE? Per due giorni questo numero
# è stato contato a mano, e due volte è finito sbagliato in un documento.
# Stampa quante funzioni ha GUARDATO, e ha un FONDO per app: se scende, cade.
node apps/deepwork-id/tests/copertura-funzioni.mjs
node apps/deepwork-id/tests/copertura-funzioni.mjs --elenco   # dice anche QUALI mancano

# Lo stesso nome esportato da due app: è un alias o una copia? La regola del
# `shared/` era scritta in CLAUDE.md, cioè affidata alla memoria — e in un
# giorno solo ne sono uscite cinque violazioni. Qui o le due cose sono lo
# STESSO oggetto, o la differenza va DICHIARATA con la ragione.
# Guarda DUE coppie, e la seconda è arrivata dopo: app contro app, e app
# contro `shared/` — che è quella più facile da sbagliare, e per due giorni
# non la guardava nessuno. Stampa quanti confronti ha fatto.
node apps/deepwork-id/tests/nomi-doppi.mjs
```

**125 con l'emulatore Firestore** (**75** regole di sicurezza, 19 SDK, 21
funzioni, 8 primo avvio) — servono `firebase-tools` e Java. ⚠️ Tre addendi su
quattro sono stati **rimisurati l'08/08 lanciandoli**; le 21 sulle funzioni no,
per la ragione scritta qui sotto. Il vecchio **106** portava un **58** sulle
regole di sicurezza che era fermo da tempo:

```sh
cd apps/deepwork-id && firebase emulators:exec --project demo-deepwork "cd tests && npm test"
```

⚠️ **Nel contenitore di sviluppo quel comando non parte**, e la ragione non è
un difetto nostro: l'emulatore delle **funzioni** chiede la rete e la politica
del contenitore la nega. Quello che gira — misurato l'08/08 — è la parte che
conta di più, la **barriera multi-tenant**:

```sh
node apps/deepwork-id/tests/giro-sicurezza.mjs   # 104 prove: 75 regole, 19 SDK, 10 primo avvio
```

Un comando solo, che alza l'emulatore da sé e **dichiara in fondo quello che
non ha potuto guardare** — le **21** prove sulle funzioni, verificabili solo in
CI. Se `firebase` o `java` non rispondono si ferma dicendolo (uscita 2) invece
di stampare «0 caduti», che sarebbe il verde più falso che ci sia.

**167 esecuzioni che aprono davvero le pagine** in Chromium — banchi distinti,
ognuno seguito dalla sua **controprova** (Chromium è già installato in
`/opt/pw-browsers/chromium`, **non** si lancia `playwright install`):

```sh
node apps/deepwork-id/tests/browser/tutti.mjs
```

### La regola che vale più del numero di prove

**Una prova che non sa fallire non dimostra niente** — e, dal 01/08, anche:
**una controprova va misurata nella sua COPERTURA, non solo nel suo esito.**

Il caso che l'ha insegnato: la regola che vieta i dialoghi del browser aveva la
sua controprova, e passava. Ma iniettava il difetto in **tre superfici a un
punto ciascuna**. Rimettendolo in tutti i punti dove la scansione era in
difficoltà, **764 iniezioni su 1030 non venivano viste**: la regola era cieca su
gran parte del codice, core compreso, mentre rispondeva «a posto».

Quindi, quando si scrive un controllo nuovo:

1. si rimette il difetto **nei file veri**, non su tre righe inventate — su tre
   righe inventate funzionava benissimo anche quella cieca;
2. lo si rimette **dove il codice è difficile** (dentro i template, dopo le
   stringhe), non in fondo al file, che è il posto più facile;
3. si **stampa quanti soggetti si sono guardati davvero** (`9 superfici`,
   `1030 iniezioni`, `84 tendine misurate`). Un numero che non torna si vede;
   uno «zero violazioni» ottenuto su zero soggetti no;
4. se il controllo ha un elenco di soggetti attesi, lo si **asserisce**: è così
   che è saltata fuori una settima superficie di cui non sapevamo.

Gli aiuti per farlo esistono già in `run-stile.mjs`: `controprovaSuiVeri(...)`
per i difetti che si **aggiungono**, e il blocco della regola 12 come esempio
per quelli che si **tolgono** (lì il difetto è l'assenza di una difesa).

Il dettaglio di ogni banco sta in `apps/deepwork-id/tests/browser/LEGGIMI.md`.

### Due cose da sapere prima di aggiungere una prova

1. **Va inserita PRIMA del blocco di riepilogo finale**, che chiude con
   `process.exit`: appesa in coda non viene mai eseguita, e il totale resta
   fermo senza che niente lo segnali.
2. **Si controlla che il totale sia SALITO**, non solo che i falliti siano
   zero: un file di prova inerte dice «0 falliti» esattamente come uno che
   funziona.

E ogni controllo nuovo va **provato contro il difetto**: si rimette il difetto
e si pretende che il controllo fallisca. Le ragioni, con i casi veri in cui è
servito, stanno in `CLAUDE.md`.

## Credenziali di prova

**Non sono elencate qui.** Nel core esistono utenti storici con password in
chiaro nel sorgente: è un problema noto e tracciato in
`docs/AUDIT_SICUREZZA.md`, con la mitigazione già scritta e **non attivata** in
`docs/MITIGAZIONE_PASSWORD.md` (aspetta una decisione del fondatore). Copiarle
in un secondo documento aumenta la superficie senza aggiungere niente: chi
sviluppa le trova nel core, chi legge questo file deve sapere che **esistono e
vanno sistemate**, non quali sono.

## Le regole che non sono opinioni

Stanno in `CLAUDE.md` e valgono per chiunque tocchi il codice: lo **stile**
identico al core con la palette propria di ogni app, l'**isolamento
multi-tenant** che passa sempre dall'SDK, e la regola che una **logica usata da
due app vive in `shared/`** e si chiama, non si ricopia. `run-stile.mjs` ne
rende **diciannove** verificabili in automatico.

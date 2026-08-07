# Le prove che hanno bisogno di un browser

Le suite in `apps/deepwork-id/tests/*.mjs` girano con `node`, senza rete e senza
browser: sono la difesa di tutti i giorni, e lì va messo tutto ciò che si può
provare come funzione pura. Qui dentro sta il resto: le cose che si vedono
**solo** aprendo la pagina e usandola — un campo che non si raggiunge, un
messaggio che non compare, un numero che il browser trasforma mentre lo si
scrive.

Non girano in CI (servono Chromium e un server statico). Girano a mano, e il
loro posto è **qui e non nello scratchpad**: una difesa che vive in una cartella
temporanea, alla sessione dopo non esiste — è già successo.

## Come si lanciano

```sh
# dalla radice del repo: un server statico qualunque
python3 -m http.server 8823 &

# tutte le superfici
node apps/deepwork-id/tests/browser/interi-superfici.mjs 8823

# una sola
node apps/deepwork-id/tests/browser/interi-superfici.mjs 8823 --solo=terra

# LA CONTROPROVA: la stessa pagina con la guardia smontata. Deve FALLIRE.
node apps/deepwork-id/tests/browser/interi-superfici.mjs 8823 --senza-guardia
```

Chromium è già installato (`/opt/pw-browsers/chromium`): **non** si lancia mai
`playwright install`.

## `pagine-vive.mjs`

**La domanda più semplice di tutte, e per un giorno intero non se l'è fatta
nessuno: la pagina si apre?**

Il 01/08 `apps/scudo/index.html` è finito nel committato **senza**
`scudo-data.js`, da cui importava un nome nuovo. Un import ES di un nome che
non esiste è un errore duro: la pagina non parte. È rimasta rotta **per cinque
commit**, e nessun controllo l'ha vista —

- le quindici suite `node` importano i **moduli dati**, non le pagine;
- `run-stile` legge il testo: un import sbagliato è sintatticamente perfetto;
- il giro completo l'avrebbe presa, ma dura ore e si lancia una volta per blocco;
- e su **disco** funzionava tutto: il difetto viveva solo nella differenza fra
  il disco e il committato.

Quindi questo banco gira su una **copia congelata di `HEAD`**, apre tutte e
quattordici le superfici e chiede tre cose sole: nessun errore di pagina, un
titolo, e del contenuto costruito. Costa circa un minuto: si lancia **prima di
ogni push**, non una volta al giorno.

```sh
node apps/deepwork-id/tests/browser/pagine-vive.mjs                # da HEAD
node apps/deepwork-id/tests/browser/pagine-vive.mjs --disco        # dalla cartella viva
node apps/deepwork-id/tests/browser/pagine-vive.mjs --solo=scudo
node apps/deepwork-id/tests/browser/pagine-vive.mjs --controprova  # deve vedere il difetto
```

La controprova rompe **un import nella copia** (non nel repo) e pretende che il
banco lo veda: è la forma esatta di difetto per cui è nato.

⚠️ **La prima stesura accusava il core**, e il torto era del banco: contava gli
elementi con le classi delle app (`.item`, `.kpi`, `.sec`…) e il core è un
monolite con classi sue. Il controllo che non guarda dove crede, alla prima
esecuzione del banco che nasce da quella lezione. Adesso conta gli elementi e
basta — questa misura prende solo la pagina **completamente bianca**, e il
segnale vero resta l'errore di pagina.

Dentro `tutti.mjs` è il **primo** della lista, e non si fa una copia sua: usa
quella che il giro sta già servendo. Se una pagina non si apre, ogni misura dei
banchi seguenti parla di una pagina che non c'è.

### ⛔ Tre volte «non distingue» prima che la controprova valesse qualcosa

Scriverlo ha ripetuto, in un'ora, tre delle cinque cause elencate in
`CLAUDE.md`. Vale la pena tenerle, perché sono le stesse che si ripresenteranno:

1. **L'iniezione era un'altra cosa.** Mettevo il nome inventato *dopo* la
   graffa (`} , unNome from "…"`): è un errore di **sintassi**, non un export
   mancante — e il browser lo riporta in modo diverso. Il difetto da riprodurre
   dev'essere *quello vero*, non uno che gli somiglia.
2. **La controprova cadeva per la ragione sbagliata.** Il filtro sugli errori
   di console comprendeva `Failed to load`, quindi scattava sugli errori di
   **rete** (gstatic, Firebase) che qui sono attesi. Una controprova che cade
   per un motivo qualunque è verde quanto una che non cade: dimostra che il
   banco sa fallire, non che sa **vedere** il difetto.
3. **L'iniezione non arrivava alla pagina.** Un `python3 -m http.server`
   rimasto acceso da un giro precedente teneva la porta e serviva una copia
   **sana**: il banco iniettava in una cartella che nessuno stava guardando.
   Difesa montata: il banco scrive un contrassegno col proprio pid nella copia
   e lo **rilegge dal server**; se non torna, si ferma invece di misurare la
   cartella sbagliata.

E la risposta vera l'ha data una misura, non un ragionamento: una sonda che
stampava **tutto** quello che la pagina dice (`pageerror`, ogni riga di
console, ogni richiesta fallita). Da lì si è visto che l'errore c'era, era un
`pageerror` pulito, e che gli elementi del corpo scendevano da 2285 a 452.

## `interi-superfici.mjs`

Digita davvero nei campi interi di tutte e sette le superfici e pretende tre
cose per ognuno: che la virgola venga **detta**, che «1.500» valga **1500** e
non 1,5, e che un intero normale si scriva senza intralci.

Al 31/07: **29 campi, 87 asserzioni**, sette superfici su sette.
Con `--senza-guardia` ne cadono due su tre per campo. Se non cadono, la prova
non sta misurando la guardia — ed è già capitato: la riga di montaggio del core
è scritta senza spazi, la prima versione della sostituzione non la trovava, e
«0 fallite» voleva dire soltanto «non ho tolto niente». Adesso una controprova
inerte lo dice a voce alta.

## `vetrina-collegamenti.mjs`

Apre la vetrina, segue **tutti e nove i riquadri** e pretende tre cose per
ognuno: che la pagina risponda, che monti davvero qualcosa (non basta lo stato
200 — una pagina che va in errore nel suo programma risponde 200 e resta vuota,
come il core senza Firebase), e che da lì si torni all'ecosistema con un comando
visibile.

```sh
node apps/deepwork-id/tests/browser/vetrina-collegamenti.mjs 8823
node apps/deepwork-id/tests/browser/vetrina-collegamenti.mjs 8823 --senza-ritorno
```

Serve per le dimostrazioni dal vivo, dove un riquadro che porta a una pagina
bianca vale più di dieci difetti nascosti. Nessun altro test lo vedeva: i
collegamenti sono `href`, e un `href` sbagliato non fa fallire niente.
È così che è venuto fuori che **Genesi era l'unica app senza il ritorno**.

La controprova toglie il comando di ritorno da ogni app e pretende che il banco
fallisca — sette bocciature su sette. Se non ne cade nessuna, grida invece di
passare in silenzio.

Due eccezioni dichiarate: il core si apre sulla sua schermata d'accesso ed è
quello che deve fare, e Deepwork ID è la porta d'ingresso, non una stanza da cui
uscire.

## ⛔ E FINO AL 03/08 IL CORE SI FERMAVA LÌ, per tutti i banchi

`apriSuperficie` iniettava `state.user` e basta: il core restava **sulla
schermata d'accesso**, e ogni banco che diceva «ho guardato il core» guardava
un guscio. Misurato prima e dopo, con lo stesso attrezzo:

| | elementi | caratteri di testo | bottoni visibili | schermata |
|---|---|---|---|---|
| prima | 1.036 | **258** | **1** | `screen-login` |
| dopo | 1.102 | **658** | **8** | `screen-home` |

`state.user` non basta perché senza dati il `DB` è vuoto e le schermate non
disegnano niente. Il segno era **già stampato** da mesi, in fondo al banco delle
modali: «core: nessuna modale aperta — il banco NON ha guardato questa
superficie (nel suo programma ce ne sono **68** da aprire)». Cioè il controllo
dichiarava di essere cieco e nessuno lo leggeva: è la stessa famiglia del
«controllo che non guarda dove crede», con l'aggravante che qui la confessione
c'era.

Adesso `apriSuperficie` chiama `accediAlCore(p)`, che fa le due cose che
CLAUDE.md ha già pagato a caro prezzo:
1. **il finto Firestore RIFIUTA** (`permission-denied`). Se risponde «nessun
   documento» il core crede di essere al primo avvio, semina il database e
   l'accesso risponde «Credenziali errate» **su credenziali giuste**: i dati
   d'esempio si caricano solo passando dal ripiego;
2. **l'accesso si ritenta**, perché i dati arrivano DOPO che `doLogin` esiste.

`accediAlCore` torna `true`/`false`: un banco può **dichiarare** di aver
guardato un guscio invece di tacere.

### `--senza-programma`: «la pagina monta» non basta

⚠️ **Misurato il 01/08, ed è il motivo per cui questa prova esiste.** La prova
«la pagina monta davvero» guarda caratteri, elementi, campi e comandi. Uccidendo
il modulo di ogni superficie, **passa su nove superfici su nove**: il markup
delle app è quasi tutto statico, quindi Conti col programma morto fa comunque
488 elementi e 54 campi. Quella prova, da sola, non sa fallire per la ragione
per cui esiste. La salva solo «nessun errore di pagina», e soltanto se il
modulo muore **rumoroso**: uno che esce in silenzio passerebbe tutte e due.

Il segno d'avvio è **diverso per famiglia**, e nessuno è inventato: ognuno è
stato scelto misurando la stessa pagina viva e morta e tenendo ciò che cambia.

| superficie | segno | vivo | morto |
|---|---|---|---|
| le sei app | la nota del modo (`mode-note`) | 57-72 caratteri | **0** |
| il core | `window.nav` | la funzione vera | il **segnaposto** che il core installa apposta |
| Genesi | i comandi con un gestore | 64 | **0** |
| la vetrina | *nessuno: non ha moduli, è statica* | — | — |

Il caso del core è il più istruttivo: vivo e morto hanno **lo stesso testo
visibile** — 258 caratteri, la schermata d'accesso — quindi nessuna misura di
«quanto c'è in pagina» potrà mai distinguerli. Con `--senza-programma` si uccide
il modulo e si pretende che tutte e **otto** le superfici con un programma se ne
accorgano. La vetrina è esclusa **per dichiarazione, non per svista**.

```sh
node apps/deepwork-id/tests/browser/vetrina-collegamenti.mjs 8823 --senza-programma
```

Due dettagli: l'attesa è **a condizione, non a orologio** (coi 2200 ms fissi la
prova era flaky — la prima app visitata paga il riscaldamento del browser), e il
numero di superfici con la nota del modo è **asserito** a sei, così se una app
la perdesse la prova non sparirebbe in silenzio lasciando il totale verde.

## `unita-maiuscole.mjs`

⛔ La regola vincolante numero due — **le unità di misura non vanno mai in
maiuscolo** — controllata sul **renderizzato**. `run-stile.mjs` la controlla già
leggendo il codice, ma il difetto vero nasce dall'**incontro** fra una classe
con `text-transform: uppercase` e un contenuto che quella classe non aveva
previsto: nessuna riga è sbagliata, sbagliato è l'incontro. Il 30/07 è passata
inosservata «1.637 M³» in Terra proprio così.

```sh
node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823
node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823 --solo=terra
node apps/deepwork-id/tests/browser/unita-maiuscole.mjs 8823 --controprova
```

⚠️ **Si legge la trasformazione, non il testo**: `innerText` su una scheda
nascosta ricade su `textContent` e il maiuscolo non si vede. Il maiuscolo va
chiesto a `getComputedStyle`, che risponde comunque.

⛔ **E IL 06/08 QUESTO BANCO ERA CIECO SULLA TONNELLATA**, cioè sull'unità più
comune in cava. Diceva «nessuna unità di misura in maiuscolo» mentre Conti aveva
a schermo — e stampava sul **DDT** — «LORDO (T)», «TARA (T)», «NETTO (T)»: la
`t` **nuda** non era in elenco (`t/m³` e `€/t` sì, e quella somiglianza è
esattamente ciò che rende il buco invisibile a chi legge la riga). Aggiunte `t`
e `mc`, con le due misure fatte **prima** di cambiare, su una copia di `HEAD`:

| | elenco vecchio | elenco con `t` |
|---|---|---|
| difetto vero di Conti rimesso (6 punti) | **0 violazioni** — cieco | **2 violazioni** |
| tutte e 14 le superfici sane | 0 | **0** — nessun falso allarme |

⛔ **E LA CONTROPROVA SI MISURA ANCHE NELLA COPERTURA.** Prima sporcava la
pagina con **una** unità sola (`12 m³`) e chiedeva «hai visto qualcosa?»: saper
fallire su una su trentatré non dice niente sulle altre trentadue — ed era
proprio il caso, perché `t` non c'era e la controprova rispondeva **ok**. Adesso
inietta una riga **per ogni unità dell'elenco** e stampa il conto: `35/35 unità
riconosciute quando sono in maiuscolo`. Un'unità che l'elenco contiene ma che il
confine di parola non lascia mai passare resta fuori da quel conto e si vede.

Al primo giro: **21 violazioni su cinque superfici**. La controprova sporca una
superficie pulita e pretende di essere scoperta.

## `doppia-data.mjs`

⛔ Il dettaglio 8 di `docs/RICERCA_VALORE_PRODOTTO_202607.md`: **un tempo
relativo porta con sé la data**. «Scade tra 5 giorni **(12/08/2026)**». La
ragione è pratica: il relativo si legge al volo scorrendo un elenco, ma la data
assoluta è quella che serve con l'ente al telefono — e «fra cinque giorni»
riletto domani vuol dire un altro giorno.

```sh
node apps/deepwork-id/tests/browser/doppia-data.mjs 8823
node apps/deepwork-id/tests/browser/doppia-data.mjs 8823 --solo=flotta
node apps/deepwork-id/tests/browser/doppia-data.mjs 8823 --controprova
```

**Perché nel browser e non in `run-stile.mjs`**: ci ho provato leggendo il
codice e la misura era da buttare — Campo, Scudo e Terra risultavano a *zero*
tempi relativi (non credibile per app con lo scadenzario) e tre degli otto
«trovati» erano un commento, un `<label>` e un `title`. Il tempo relativo nasce
al momento del disegno, da variabili che ogni app chiama a modo suo (`ritardo`,
`gg`): nel sorgente non c'è una forma da cercare, nella pagina sì.

Due decisioni che rendono il banco onesto invece che rumoroso:

1. **Non si guarda solo il testo proprio dell'elemento.** Quello che l'occhio
   legge come una riga sola è spesso spezzato — «scade tra 5 giorni» in uno
   `<span>` e «(12/08/2026)» in quello accanto. Si sale al contenitore finché si
   resta dentro una riga ragionevole; guardando solo il testo proprio si
   segnalerebbero come colpevoli proprio le righe scritte **bene**.
2. **L'anno non si pretende.** L'ha insegnato la prima esecuzione: Flotta
   scrive «Fra 8 giorni (~08/08)», che è la doppia forma in versione compatta
   per una proiezione a otto giorni. Il banco sbagliava, non il prodotto.

Prima esecuzione: **9 superfici, 0 violazioni**; controprova **9 su 9**.

## `note-stato.mjs`

**La striscia di un riquadro dice il suo STATO, non la sua decorazione.** In
Terra la proiezione «fuori piano» usciva con la striscia verde e la pastiglia
«danger» scritta anch'essa in verde, a 1,64:1. Nessuna riga di codice era
sbagliata: sbagliato era l'incontro fra due regole giuste, e l'incontro lo sa
solo il motore che le applica. Il banco monta sulla pagina vera le otto
combinazioni che il programma genera davvero e chiede al motore che colore ha la
striscia — non legge il CSS, legge il risultato.

```sh
node apps/deepwork-id/tests/browser/note-stato.mjs 8823
node apps/deepwork-id/tests/browser/note-stato.mjs 8823 --controprova
```

Con `--controprova` la decorazione torna a dipingere la proprietà invece della
variabile: devono cadere 14 combinazioni su 48, in tutte e sei le app.

## `fuori-schermo.mjs`

**Niente deve finire fuori dallo schermo di un telefono.** È già successo due
volte, e tutte e due se n'è accorto un essere umano guardando uno screenshot:
in Sentinella la barra in basso tagliava «REPORT» — una sezione intera
irraggiungibile — e nella vetrina l'alone d'apertura faceva comparire lo
scorrimento laterale. Il difetto non fa rumore: la pagina si apre e quello che
manca manca in silenzio.

Si guardano **solo i comandi** (bottoni e collegamenti), non tutti gli elementi:
aloni e sfumature escono di proposito e vengono ritagliati, e un banco rumoroso
è un banco che nessuno legge. Il metro è «una persona riesce a toccarlo?». E si
guarda la posizione nel **documento**, non nel viewport: un comando sotto la
piega non è irraggiungibile, è solo più in basso.

```sh
node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823
node apps/deepwork-id/tests/browser/fuori-schermo.mjs 8823 --controprova --solo=sentinella
```

Nove superfici per due larghezze (390 e 360 px): 18 schermate.

## `id-unici.mjs`

**Due elementi con lo stesso `id`, nella pagina viva.** Il browser non protesta,
la pagina si apre, sembra tutto a posto — ma `getElementById` restituisce **il
primo**, e il secondo diventa irraggiungibile senza che niente lo dica.

Trovato dal vero il 31/07, tre volte in un'ora: in **Conti** due bottoni erano
`btn-lis-export`, e il secondo — «Esporta listino (CSV)» — **non faceva niente
quando lo si cliccava**, portandosi dietro l'unico export coi prezzi convertiti;
in **Flotta** e **Sentinella** due note erano `ric-esito`, e quella sotto il form
non mostrava mai niente (la conferma di «Aggiungi» compariva 122 e 332 px più in
su, lontano dal bottone premuto).

⚠️ **Perché nel browser e non sul sorgente.** Cercandoli nel testo dei file se ne
trovano **45**, e quasi tutti non sono difetti: stanno dentro i modelli delle
modali, che il browser monta uno alla volta quando servono. Una regola sul
sorgente avrebbe dato 45 falsi allarmi e sarebbe stata spenta in due giorni; la
pagina viva, visitata sezione per sezione, ne dà 3 — e sono tutti e tre veri.

```sh
node apps/deepwork-id/tests/browser/id-unici.mjs 8823
node apps/deepwork-id/tests/browser/id-unici.mjs 8823 --controprova
```

La controprova inietta due bottoni con lo stesso id nel corpo servito (il file su
disco non si tocca): tutte e nove le superfici devono fallire.

## `vuoti-azione.mjs`

**I bottoni degli stati vuoti puntano a qualcosa che esiste.** Dal 31/07 gli
stati vuoti del **primo giorno** — quelli dove un cliente nuovo è fermo perché
una lista è ancora vuota — hanno il terzo pezzo che mancava: **come si
comincia**. I bottoni non fanno il lavoro, **portano**: cliccano il comando che
esiste già o mettono il fuoco sul primo campo del form.

⚠️ Il banco nasce da un difetto mio: scrivendo quei bottoni avevo **indovinato**
due identificativi che non esistevano, e sarebbero stati **muti** — nessun
errore in console, nessun test rosso, solo un bottone che non fa niente proprio
nella schermata che serve a chi comincia.

Non prova che il bottone «funzioni»: prova la cosa che si rompe davvero, cioè
che il **bersaglio esista nella pagina viva**, dopo aver visitato tutte le
sezioni. Quando si aggiunge un'azione a uno stato vuoto, il suo bersaglio va
messo nell'elenco `BERSAGLI` del file: è quello che rende il controllo capace di
accorgersene.

```sh
node apps/deepwork-id/tests/browser/vuoti-azione.mjs 8823
node apps/deepwork-id/tests/browser/vuoti-azione.mjs 8823 --controprova
```

La controprova aggiunge un id inventato e pretende che il banco lo trovi in
**tutte** le app: se lo trovasse solo in alcune, per le altre non avrebbe
dimostrato niente.

## `contrasto.mjs`

La versione estesa del banco qui sotto: misura il contrasto di **tutto** il
testo di **tutte e nove** le superfici — badge, pillole, note, tabelle — sul
renderizzato. Oggi sono **3331 testi**, ed è il banco che fa il maggior numero
di misure di tutta la suite.

```sh
node apps/deepwork-id/tests/browser/contrasto.mjs 8823
node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --solo=terra
node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --tutti        # elenca anche i promossi
node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --controprova
```

⚠️ **La controprova è nata il 01/08, e prima non c'era.** Il banco misurava
3322 testi e rispondeva «0 sotto soglia», ma **niente dimostrava che ne sapesse
vedere uno**: è la stessa posizione in cui si trovava la regola dei dialoghi di
`run-stile.mjs`, cieca su gran parte del codice mentre diceva ok. Adesso
`--controprova` appende a ogni superficie una riga a **~1,15:1** e pretende che
venga bocciata su **tutte e nove**: se una sola la promuovesse, lì la misura non
sta guardando e il suo «0 sotto soglia» non varrebbe niente.

Le trappole della misura — gradienti, trasparenze, `opacity` ereditata, testo
ritagliato col gradiente (`background-clip:text`), testo dentro gli SVG — sono
descritte nell'intestazione del file, ognuna con il caso vero che l'ha fatta
scoprire. **Tutte e cinque erano nel verso che ASSOLVE il difetto o accusa il
prodotto a torto**: una misura sbagliata che grida al lupo consuma la fiducia
esattamente come una che tace.

## `contrasto-core.mjs`

Misura il rapporto di contrasto del testo dei riquadri della home del core sul
**renderizzato**, non sul codice: 4,5:1 per il testo piccolo, 3:1 per quello
grande. È così che è venuto fuori un sottotitolo a **1,08:1** — arancione scuro
su arancione, invisibile — che nessun test vedeva e che non dava nessun errore.

```sh
node apps/deepwork-id/tests/browser/contrasto-core.mjs 8823
node apps/deepwork-id/tests/browser/contrasto-core.mjs 8823 --controprova
```

La controprova rimette il difetto (lo stile in linea che coloriva il fondo senza
portarsi dietro il testo) e **pretende che due misure falchino**.

Tre trappole già pestate, tutte e tre nel senso che ASSOLVE — cioè il peggiore:
gli sfondi a **gradiente** (il colore vero sta in `background-image`, e cercando
un fondo opaco fra gli antenati si finisce contro il nero della pagina: bianco su
arancione risultava 19:1), la **trasparenza** del colore del testo, e
l'**`opacity`** ereditata dagli antenati.

## `salvataggio-offline.mjs`

**Che cosa vede chi ha appena compilato un giro macchina senza rete.**

⛔ **Il fatto, misurato prima di scrivere il banco** (01/08), col pacchetto
`firebase` vero (12.16.0, quello in `tests/node_modules`) e la rete chiusa con
`disableNetwork`: le tre **scritture** provate (`addDoc` di un controllo,
`addDoc` di una manutenzione, `updateDoc` delle ore) **non risolvono e non
rifiutano** — restano pendenti per sempre; la **lettura** risponde in 8 ms
dalla cache. Quindi il difetto non era un errore da catturare: un `try/catch`
non lo vede. Era un `await` che non torna, e la pagina si fermava lì.

```sh
node apps/deepwork-id/tests/browser/salvataggio-offline.mjs 8853
node apps/deepwork-id/tests/browser/salvataggio-offline.mjs 8853 --senza-guardia
```

Quattro scenari — giro macchina e segnalazione di guasto, per «rete tolta»
(`context.setOffline(true)`) e «server che rifiuta» — **37 asserzioni**. Per
ognuno: che un messaggio compaia, che dica *«non è stato salvato niente»*, che
non sia una frase di Firebase, che la scheda resti a schermo con dentro quello
che era stato scritto, e che il bottone si spenga mentre la scrittura è per
aria.

⚠️ **Che cosa NON misura.** Firestore vero qui non c'è: al suo posto un finto
che applica la regola misurata sopra (a `navigator.onLine` falso le scritture
non rispondono mai). Il soggetto della misura è **la pagina**, non Firestore.
A differenza di `finto-firebase.mjs`, questo finto porta anche `firebase-auth`
e `firebase-functions`: senza, l'app resta in **dimostrazione** e scrive in
memoria — cioè il banco misurerebbe un percorso che in cava non esiste. La
prima asserzione di ogni scenario è proprio che l'app sia in modo reale.

Con `--senza-guardia` la pagina servita torna a com'era (due iniezioni, +134
caratteri, il file su disco non si tocca): **11 asserzioni su 37 cadono**, e si
legge il prodotto di prima — messaggio vuoto dopo 14 secondi d'attesa, e col
server che rifiuta un `Missing or insufficient permissions.` che finisce in
console e non sotto gli occhi di nessuno.

## `modali.mjs` — il contenuto delle finestre di conferma ci sta dentro?

Nato il 01/08 da un difetto che **uno scatto** ha visto e un banco verde no: in
una finestra di conferma di Conti la causale del bonifico chiedeva **491 px
dentro 352** — 139 tagliati via, e proprio sul testo che serve a decidere se
l'abbinamento è giusto.

⛔ **Perché `fuori-schermo.mjs` non poteva vederlo**: quello guarda i *comandi*
che escono dallo schermo e lo scorrimento laterale della *pagina*. Una modale
chiusa è larga zero e viene saltata; un testo che trabocca dentro il suo
riquadro non muove né l'una né l'altra cosa. È il «controllo che non guarda dove
crede» nella sua forma più comune: funziona benissimo su quello che vede.

La domanda è una sola, e la risponde il browser: `scrollWidth > clientWidth`.
Non si calcola niente — calcolare una cosa che il browser sa dire è il difetto
che ha fatto riscrivere cinque volte il banco della barra.

⚠️ **La copertura è dichiarata, non sottintesa.** Le modali si aprono con un
gesto generico (il bottone «Rimuovi» di una riga, che apre la conferma con
dentro il nome vero della cosa), e quel gesto è stato **misurato prima** di
scrivere il banco: apre le modali in **quattro app su sei** — Flotta, Scudo,
Sentinella e Terra a 6 modali ciascuna; **Campo e Conti hanno un markup diverso
e restano NON GUARDATE**. Il banco lo stampa in fondo, perché «nessuna modale
fuori posto» senza dire su quante app si è guardato è lo stesso «zero
violazioni» ottenuto su zero soggetti.

Misura di riferimento: **24 modali aperte, 198 elementi misurati, 0 tagliati.**

```sh
node apps/deepwork-id/tests/browser/modali.mjs 8823
node apps/deepwork-id/tests/browser/modali.mjs 8823 --solo=terra
node apps/deepwork-id/tests/browser/modali.mjs 8823 --controprova
```

La controprova mette dentro la modale una parola lunghissima che non si può
spezzare — il caso vero è un IBAN o una causale senza spazi — e pretende che il
banco la veda. Se non la vede, il banco non sta guardando dove crede.

**Esito misurato:** l'iniezione viene vista in **tutte e quattro** le app
(`1324 px in 312`), e gli elementi misurati salgono da **198 a 222** — cioè il
banco ha davvero guardato la riga in più, non l'ha dedotta. Uscita `0`, che nel
verso della controprova vuol dire «so fallire».

## `modali-dentro.mjs` — che cosa si vede DENTRO le modali, aprendole tutte

Nato il 02/08 (task A4) da due difetti veri che, la notte prima, ha trovato
**solo un occhio umano**:

1. **Sentinella**, modale che corregge una misura: «(mm/s)» usciva **«(MM/S)»**.
   `.flab` è in maiuscolo, quella era la prima etichetta di campo dell'app a
   portarsi dietro un'unità, e l'elenco delle esenzioni non conosceva `.flab`.
   Lo `<span class="u">` c'era: **leggendo il codice non si vede**.
2. **Terra**, tendina a 320 px: etichette tagliate, e il taglio si portava via
   la parte che distingue una fonte dall'altra.

⛔ **Perché non bastava `modali.mjs`.** Quello si apre la strada con **un gesto
generico** — il primo `[title^="Rimuovi"]` di ogni sezione — quindi raggiunge
una modale per sezione, quattro app su sei, e misura una cosa sola. Qui il
banco **guida l'app**: cammina sui comandi della sezione, clicca il primo mai
provato, e se si apre una finestra la misura e la chiude.

⛔ **E c'è una cosa che `modali.mjs` non poteva vedere, misurata prima di
scrivere una riga: un `<select>` non dichiara di tagliare.** Con un'opzione da
224 px dentro una tendina da 120, Chromium risponde `scrollWidth 118,
clientWidth 118` — cioè la domanda giusta per tutto il resto, sulle tendine
risponde **sempre di no**. Per loro si misura quanto spazio chiede il testo
dell'opzione mettendolo in uno `<span>` col **font vero della tendina**: non è
un calcolo, è la stessa domanda fatta a un elemento che sa rispondere.

Le tre cose che misura, e non di più (un banco che ne misura otto e ne sbaglia
una diventa un banco che nessuno guarda):

| | come lo chiede al browser |
|---|---|
| un'unità di misura in maiuscolo | `getComputedStyle(...).textTransform` **effettivo** — `innerText` su un elemento nascosto ricade su `textContent` e il maiuscolo non si vede |
| testo tagliato | `scrollWidth > clientWidth`, `scrollHeight > clientHeight` (verticale solo dove il taglio è netto), e per le tendine la misura del font |
| qualcosa che esce dal suo spazio | la finestra più larga dello schermo, o il corpo che scorre in orizzontale — a **320 px** oltre che a 390 |

L'elenco delle unità **non è riscritto qui**: si legge da `unita-maiuscole.mjs`,
dove vive con la ragione di ogni voce. Una seconda copia nasce uguale e diverge
al primo cambiamento.

```sh
node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823
node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823 --solo=sentinella
node apps/deepwork-id/tests/browser/modali-dentro.mjs 8823 --controprova
```

Costa una mezz'ora sulle quattordici superfici; con `--solo=` sono un paio di
minuti. In fondo stampa **il censimento**: quante modali esistono nel programma
di ogni superficie (le chiamate vere ad `apriModale`/`chiedi`/`chiediValore`/
`openModal`, contate con `mascheraCodice` così un `chiedi(` dentro un commento
non conta) e quante ne ha **aperte e guardate**, più i soggetti misurati e le
superfici **non raggiunte**.

### Tre cose imparate guidando l'app, tutte e tre nel verso che fa guardare MENO

1. le pillole dei filtri (`.chg`, `[data-filtro]`) **restringono la lista
   sotto**: cliccando «Superamenti» i punti di misura di Sentinella scendono da
   40 a 25 e i loro comandi spariscono dal giro. Si escludono;
2. `[data-goto]` porta **in un'altra sezione**, e il giro finirebbe a misurare
   una schermata credendo di essere altrove;
3. **l'impronta di un comando non può essere la sua etichetta**: la linguetta
   della serie storica si chiama «Apri…» da chiusa e «Chiudi…» da aperta,
   quindi al giro dopo sembrava un comando NUOVO e la **richiudeva** — e la
   tabella che stava per comparire (con dentro proprio il difetto 1) non è mai
   stata guardata. Si usa ciò che non cambia: `id` e attributi `data-`.

E si pretende **la prova di aver aperto** — `#modal` con la classe `show`, il
riquadro largo più di zero, un titolo non vuoto — perché un banco che non apre
niente risponde «tutto a posto» dopo aver guardato una schermata su otto.

### La controprova: i difetti rimessi in una COPIA

⛔ **I file delle app non sono di questo banco**: mentre gira, altri cantieri ci
scrivono. L'iniezione va in una `git worktree` su HEAD, servita su una porta
sua con il **contrassegno col pid riletto dal server** — se su quella porta
risponde qualcun altro il banco **si ferma** invece di misurare la copia di un
altro. L'albero vivo non viene toccato in nessun momento, e non si usa mai
`git checkout` né `git stash`.

Due famiglie, perché «so fallire in un punto» non dimostra niente sugli altri:

- **A, esatta, una superficie**: in Sentinella si toglie `.flab .u` dall'elenco
  delle esenzioni. È alla lettera il difetto del 01/08.
- **B, generica, tutte le superfici che caricano `shared/dw-app-ui.js`**: dentro
  `apriModale`, lo `<span class="u">` viene **sciolto** (la forma generale del
  difetto 1) e le voci delle tendine vengono **allungate** (la forma generale
  del difetto 2).

Si possono lanciare separate — `--iniezione=A` e `--iniezione=B` — e serve:
con la sola A si vede che il difetto **esatto** del 01/08 fa cadere il banco
(`«(dB(A))» in maiuscolo … .u`, quattro bocciature che nel giro pulito non
ci sono), invece di leggere un verde solo in cui le due famiglie si coprono
a vicenda.

L'iniezione **si conta mentre inietta** (`window.__iniz`): in fondo il banco
stampa, superficie per superficie, quanti span ha sciolto e quante voci ha
allungato (dov'è **arrivata**) accanto a quante violazioni ha visto (dov'è stata
**vista**). Un'iniezione arrivata e non vista è un buco del banco; una non
arrivata è un buco della controprova — e si curano in modo opposto.

## `finto-firebase.mjs`

**Serve per aprire il core in locale, e non solo per questa prova.**

Il core non si ferma alla schermata di accesso: tutto il suo programma sta in un
`<script type="module">` che importa Firebase da `gstatic.com`. Senza rete
l'import fallisce, il modulo non parte, e restano solo i segnaposto che il core
installa apposta («Funzione nav non ancora pronta»). Per questo, prima di
capirlo, `nav('ufficio')` sembrava non fare niente: non era il `nav` del core.

Qui si servono quattro moduli finti al posto di quelli di Google. Non simulano
Firebase: rispondono quanto basta perché il programma parta e le schermate si
montino. Le liste restano vuote, ed è giusto — quello che si prova sono le
pagine, non i dati.

```js
import { montaFintoFirebase } from './finto-firebase.mjs';
await montaFintoFirebase(pagina);   // PRIMA di goto
await pagina.goto('http://127.0.0.1:8823/index.html');
```

Quello che così **non** si prova è il login vero e il traffico verso Firestore.
Per quelli restano gli emulatori (`apps/deepwork-id/tests`, regole di sicurezza).

## `scudo-frasi-da-uno.mjs` — Scudo aperta con UN dato per collezione

**Perché ha un banco suo.** Il filo del «testo che mente» era stato chiuso su
cinque app **rendendo** la pagina con un dato solo; su Scudo era stato chiuso
**leggendo il modulo**. Aprendola davvero — un lavoratore, una scadenza, un
near-miss, un DPI, un'ispezione, un appalto, un permesso, un documento — sono
uscite **diciassette** frasi che leggendo il codice non si erano viste. Due
finiscono in qualcosa che ESCE dall'azienda:

- nel **CSV del riepilogo L. 198/2025**: «L'unico near-miss del periodo ha la
  gravità potenziale scritta. **SONO** meno di 5» — il sostantivo il singolare
  ce l'aveva, a mancarlo era il verbo, ed è la seconda volta che succede su
  questo stesso riepilogo;
- nel **promemoria che si copia negli appunti** e si manda per email o SMS al
  lavoratore: «risulta SCADUTA dal 06/08/2026 (**1 giorni fa**)». Il giorno
  dopo la scadenza è esattamente quando lo si manda.

La più letta di tutte sta sul Quadro: «**1 near-miss registrati** — non
azzerano il conteggio, ma vanno guardati» (tre pezzi, tutti e tre al plurale).

**Quattro casi, e ognuno esiste perché un ramo non si raggiunge altrimenti.**
È la lezione del banco delle modali, che dichiarava «0 su 68 aperte» e nessuno
la leggeva: un caso solo lascia mezza pagina non misurata e il banco risponde
verde.

| caso | che cosa apre |
|---|---|
| `uno` | uno per collezione, scadenza scaduta: export, import, checklist, matrice, CSV |
| `giorno` | un infortunio **e** un near-miss (il Quadro non disegna il near-miss senza infortuni), un permesso solo e **chiuso** (il ramo tranquillo), il DSS rivisto ieri, il promemoria |
| `regolare` | la persona che **può** andare: «Oggi possono andare 1 persone» si vede solo quando è tutto a posto |
| `due` | due tipi di adempimento e **uno** solo da sistemare: serve all'`aria` del grafico, la sola versione di quel numero che arriva a chi non guarda lo schermo |

**Il taglio non è `slice(0,1)` e basta.** Tagliando alla cieca i riferimenti si
rompono (la scadenza punta a un lavoratore sparito, la mansione a persone che
non ci sono più) e mezza pagina finisce nei rami «non lo sappiamo» — che sono
un'**altra** famiglia di frasi. Il caso ricuce gli id sull'unico lavoratore e
sull'unico cantiere: è una cava piccola vera, non un archivio a pezzi. Tutto
passa da `rotte` di `giro.mjs`, che riscrive la risposta HTTP del modulo: il
file su disco non si tocca mai.

**Tre rilevatori più le asserzioni esplicite.** D1 (`1 scadenze`), D2 (`ci sono
1`), D3 (`1 già presenti`) setacciano ogni schermata. Ma il difetto peggiore di
Scudo era di un quarto tipo che nessuno dei tre prende — «Tutte le voci hanno un
esito» su una checklist di **una** voce, dove di numeri non ce n'è nemmeno uno:
quelle si chiedono al testo reso, una per una.

**I comandi si premono davvero**: gli export escono da un `<a download>`
intercettato, gli import passano da `setInputFiles` con un file di una riga, il
promemoria finisce negli **appunti** (`navigator.clipboard` sostituito) e non
resta a schermo. Il riepilogo dichiara quante schermate ha letto, quanti
caratteri e quanti comandi ha premuto: uno «zero violazioni» senza quei numeri
non distingue «pulito» da «non ho aperto niente».

```
node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823
node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823 --controprova
node apps/deepwork-id/tests/browser/scudo-frasi-da-uno.mjs 8823 --dimmi
```

Misura al 07/08: **44 ok, 0 KO · 48 schermate, 93.938 caratteri, 10 comandi
premuti**. Controprova: **17 difetti su 17 rimessi davvero, 0 iniezioni
mancate, 19 prove cadute su 44** — e sei di quelle cadono per il **setaccio**,
non per un'asserzione esplicita.

**Che cosa NON guarda**, dichiarato perché non prometta troppo: i due fogli
stampati (verbale DPI e cartella del lavoratore) — li apre
`scudo-documenti.mjs`, e con un dato solo sono usciti puliti («1 dispositivo»,
«1 sezione è senza righe», «1 scadenza già scaduta»); le unità di misura
(`unita-maiuscole.mjs`); i numeri tranquilli sullo zero
(`scudo-numeri-tranquilli.mjs`); il testo tagliato dal clamp.

## `campo-numeri-tranquilli.mjs` — i documenti di Campo e il giorno che nessuno ha dichiarato

Quattro blocchi storici (il CSV dello storico con gli zeri di comodo, il
cartellone che diceva «niente registrato», la frase del ponte con Terra, la
produzione stampata con l'unità grezza) più due della **seconda passata del
07/08**, nate applicando a Campo la domanda di CLAUDE.md — *dove questa app
compone qualcosa che ESCE, chi decide i suoi numeri?* — con il metodo che quella
riga prescrive: **premere il bottone e aprire il file**, non leggere il codice.

**Il difetto che è uscito.** `eDelGiorno` tiene **dentro** la giornata corrente
le registrazioni senza data — di proposito, e la ragione è scritta nel modulo:
un dato vecchio non deve sparire. Effetto: i loro chili entrano nei totali di
oggi. Lo schermo lo dichiara **due volte** («(1 rapportino ancora senza data)»
accanto alla copertura e «senza data» sulla riga della lista); il **rapporto di
fine turno** e la **consegna di turno** — i due documenti datati che si
consegnano e si archiviano — **zero**. Sulla sola dimostrazione, il foglio
intestato «Rapporto di fine turno — 07/08/2026» scriveva `Produzione | Mattina |
2.510 t` e, nella tabella dei rapportini, `Rapportino trasporti | Squadra B ·
Mattina | 2.300 t`: 2.300 t su 2.510 attribuite a un giorno e a un turno che
nessuno ha dichiarato. La **stessa app**, nel CSV dello storico, quelle
tonnellate le scrive in una riga con la data **vuota** — due file, gli stessi
chili, due giorni diversi.

⚠️ **Il numero non era sbagliato**: 2.510 è quello che dice anche lo schermo.
Mancava la **dichiarazione**. Per questo il banco confronta il totale del
documento con quello a schermo e pretende che siano **uguali**: un banco che ne
pretendesse uno diverso starebbe chiedendo un difetto nuovo.

⚠️ **E `eDelGiorno` è asimmetrica**, misurato scrivendo questo banco e sbagliando
mira la prima volta: la data **vuota** resta dentro il giorno corrente, un
giorno che **non esiste** («2026-02-30») resta fuori da **tutti** i giorni e lo
raccoglie solo `registrazioniSenzaGiorno`, cioè il CSV dello storico. Il
soggetto giusto per un documento di oggi è la data vuota.

**Sesto blocco: le frasi col numero UNO** che accompagnano ogni file — stessa
famiglia di `flotta-frasi-da-uno.mjs`. Con una squadra, una persona,
un'attività e un rapportino uscivano «Elenco per l'appello esportato: **1
persone**», «**Esportate** 1 attività», «**Esportate 1 squadre**», «Consegna di
turno esportata: **1 rapportini e 1 causali** di fermo» e, sulla scheda della
squadra, «**1 persone**». `conta` e `plurale` erano in `shared/` da mesi.

```sh
node apps/deepwork-id/tests/browser/campo-numeri-tranquilli.mjs --porta=8563
node apps/deepwork-id/tests/browser/campo-numeri-tranquilli.mjs --controprova
```

Misura al 07/08: **51 verifiche passate, 0 fallite**. Controprova: **14 difetti
su 14 rimessi davvero, 24 prove cadute su 51** — e le 11 nuove cadono tutte.

**Che cosa NON guarda**, dichiarato: i tre CSV composti a mano nella pagina
(`campo_appello`, `campo_attivita`, `campo_squadre`) sono stati **aperti e
confrontati col loro schermo il 07/08 e sono usciti puliti** — le celle non
misurabili restano vuote e il riposo non calcolabile lo dichiara a parole — ma
qui non c'è un'asserzione che lo tenga fermo; il foglio stampato in modalità
tour lo guarda `campo-foglio-turno.mjs`; le unità di misura,
`unita-maiuscole.mjs`.

## `genesi-documenti-che-escono.mjs` — i nove file che Genesi salva

La domanda di `CLAUDE.md` — *«dove questa app compone qualcosa che ESCE, chi
decide i suoi numeri? Se la risposta non è la stessa funzione che li decide a
schermo, lì c'è una copia debole»* — il 03/08 ha trovato ventiquattro difetti
veri in cinque app. **Su Genesi non era mai stata fatta.** Il foglio stampabile
e il confronto A/B li teneva già `genesi-foglio-in-cava.mjs`; i **nove bottoni
che salvano un file** non li aveva aperti nessuno.

⚠️ **Genesi è `apps/genesi/genesi.html`, non `index.html`.** È l'app fuori
convenzione: un banco che costruisce il percorso per convenzione qui non guarda
niente e risponde «pulito». È già successo il 03/08 alla regola 20 di
`run-stile`.

Quattro difetti veri, nessuno visibile leggendo il codice:

| dove | schermo | file |
|---|---|---|
| `genesi_scheda_volata.csv` | «legge provvisoria: sotto gli 8 referti la pendenza si muove ancora parecchio» | **una riga su sedici** cambiava fra le due leggi — `PPV recettore (mm/s);1.9` contro `;4.1` — e niente diceva quale fosse quale |
| la stessa scheda | riga «Airblast 143 dB(L)», rossa, dieci oltre il limite USBM/OSM | l'airblast **non c'era proprio** (la stessa mancanza corretta nel foglio stampato il 06/08) |
| `genesi_riconciliazione.csv` | «+3,5 cm (+13%)» mentre si digita | salvato: storico «X50 28→**—** cm», e nel CSV `28;31,5;1.9;7,2` — due convenzioni decimali in colonne adiacenti |
| `genesi-demo.volata.json` | pannello 3D «42 ms», piano di carico `0/42/84/126` | `0 · 42,332516881726825 · 84,36212721741676` — lo **scatter sorteggiato** al posto del ritardo di progetto |

**Il quarto non era solo di lettura: il giro di andata e ritorno lo perdeva.**
L'importatore ricava il passo dalla mediana delle differenze fra ritardi
distinti; con lo scatter sono tutte diverse, la mediana non cade in
`[17,25,42,65]` e il ripiego riportava a **25 ms** una volata progettata a
**42**. Il banco fa il giro davvero — esporta, ridà il file a `#fileIn`, rilegge
`#pRit` — perché un'asserzione sul contenuto non l'avrebbe mai detto.

**Il terzo è la copia debole nella sua forma canonica**: `riconDelta` legge il
valore scritto a mano con `gIn` e il suo commento spiega perché («con `+real` un
"27,5" diventava NaN e la riga mostrava un trattino come se la misura non ci
fosse»); il salvataggio, **dodici righe più giù**, faceva `isNaN(+v) ? v : +v`.
La regola giusta era già nel modulo, nello stesso schermo, sotto gli occhi.

⚠️ **L'asserzione sui decimali è sul TESTO del file**, non sul giro
scrivi/leggi: una coppia resta verde se le due metà sbagliano insieme, perché il
lettore di casa la virgola la legge — chi apre il file è un altro programma.

**I casi si costruiscono nei dati**, da `localStorage` (`genesiVolate`,
`genesiSito`), le stesse chiavi che l'app scrive da sé: il file su disco non si
tocca mai, perché accanto girano cantieri che scrivono.

```
node apps/deepwork-id/tests/browser/genesi-documenti-che-escono.mjs
node apps/deepwork-id/tests/browser/genesi-documenti-che-escono.mjs --controprova
node apps/deepwork-id/tests/browser/genesi-documenti-che-escono.mjs --dimmi
```

Misura al 07/08: **53 ok, 0 KO · 8 file salvati e riaperti, 32 numeri
confrontati** col loro valore a schermo o col file gemello. Controprova: **5
difetti su 5 rimessi davvero, 21 prove cadute su 53**.

**Che cosa NON guarda**, dichiarato perché non prometta troppo: il foglio
stampabile e il confronto A/B (`genesi-foglio-in-cava.mjs`); i tre export che
sono passati puliti — `genesi_legge_di_sito.csv`, `genesi_piano_innesco.xml` e
`genesi_volata_per_sentinella_*.csv`, quest'ultimo il **solo** che dichiarasse
già la legge provvisoria (`ppvPrevProvvisoria;si`, `ppvPrevReferti;3`) —, e
`genesi_confronto_AB.csv`, che ha le sue asserzioni nel banco del foglio.

⏱️ **Una cosa vista e non corretta, scritta qui perché non si perda.** Aprendo
una volata salvata a 58 kg/foro, il pannello 3D resta su «Nuova volata» e su 60
kg finché non si preme «Simula volata» dal 2D — e `hgEsporta` in Home fa
scattare `btnExport`, cioè il bottone del 3D. Risultato misurato: nello stesso
istante `genesi_scheda_volata.csv` dice `Carica totale (kg);696` e il
`.volata.json` **720**. Non è una copia debole (il file è d'accordo con il suo
schermo, che è il pannello 3D): è la decisione, più grossa di un cantiere, su
quale stato debba esportare il bottone «Esporta» della Home.

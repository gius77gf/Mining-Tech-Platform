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

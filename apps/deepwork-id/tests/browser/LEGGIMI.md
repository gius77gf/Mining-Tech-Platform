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

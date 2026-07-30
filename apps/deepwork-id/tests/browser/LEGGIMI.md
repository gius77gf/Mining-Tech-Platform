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

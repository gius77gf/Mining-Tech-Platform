# La vetrina — come si rigenera

La pagina di presentazione delle nove app. **Non si modifica a mano**: si
modifica `contenuto.py` (i testi) o `sito.py` (la forma), e si rigenera:

    python3 apps/vetrina/sito.py /percorso/vetrina.html

Esce un file solo, autosufficiente (le immagini sono `data:` dentro la pagina):
si pubblica come artefatto o si serve da qualunque parte, senza rete.

## Da dove viene ogni pezzo

| pezzo | dove sta | come si rifà |
|---|---|---|
| testi, marchio, pop-up, crediti | `contenuto.py` | a mano |
| impianto e movimento | `sito.py` | a mano |
| 51 schermate a 880px | `schermate/` | `strumenti/cattura.mjs` + `cattura-core.mjs`, poi `converti.mjs` |
| le stesse a 440px | `schermate/piccole/` | `strumenti/piccole.mjs` |
| 12 fotografie di cantiere | `sfondi/` | `strumenti/miniature.py` → `prepara-sfondi.mjs` |
| autori e licenze | `strumenti/pronte.json` | `strumenti/autori.py` |

## Tre cose imparate a spese nostre, che non vanno rifatte

1. **Il marchio non si tocca.** `contenuto.marchio(px)` cambia SOLO
   `width`/`height`: il disegno dentro resta identico, elemento per elemento.
   Regola fondamentale del fondatore — vedi `CLAUDE.md`.
2. **Niente segnaposto.** Se una fotografia manca, `C.sfondo()` risponde `None`
   e quella sezione si disegna **senza fondale**. Non si ripiega su un'altra
   immagine: nove schede con le stesse tre foto a rotazione si leggono come una
   scelta sciatta, non come una mancanza.
3. **Il credito si costruisce, non si scrive.** `CREDITO` nasce dagli autori e
   dalle licenze verificati uno per uno in `strumenti/pronte.json`. Scritto a
   mano invecchierebbe al primo cambio di fotografia — e un credito sbagliato
   su una licenza CC è una violazione, non un refuso. Quattro fotografie sono
   state **scartate** perché autore e licenza non li confermava nessuno.

## Come si misura prima di pubblicare

Serve un server statico sulla cartella che contiene la pagina generata
(`prova.mjs` lo cerca sulla 8941) e poi:

    node strumenti/prova.mjs <cartella> <nome-senza-estensione>   # altezza, scorrimento laterale, contrasto
    node strumenti/contrasto-foto.mjs                             # il contrasto SOPRA le fotografie
    node strumenti/misura-scena.mjs                               # quanto sborda ogni pezzo della scena

⛔ **`prova.mjs` NON misura il contrasto sopra una fotografia.** Risale gli
antenati cercando un `background-color`: sotto una fotografia non ce n'è uno,
quindi arriva al `body` e misura contro il nero — cioè risponde «a posto»
avendo guardato un fondo che non è quello. È la famiglia del controllo che non
guarda dove crede, e il buco cade **esattamente sui testi nuovi**.
`contrasto-foto.mjs` legge i **pixel renderizzati**, e porta con sé tre
trappole già pestate: nasconde solo il testo (mai un elemento che dipinge un
fondo suo — il bottone ambra nascosto lasciava vedere il nero dietro e il suo
inchiostro risultava a 1,24 invece di 11); scorre sezione per sezione (un
filtro «sta nella finestra» lasciava 6 soggetti su 38); e stampa la **forbice**
oltre al peggiore, perché sopra una fotografia il fondo è mosso.

⛔ **`misura-scena.mjs` esiste per un difetto che nessun'altra misura vede.**
La scena sborda con `margin-right: calc(-1 * var(--sbordo))`. Prima era
`calc(50% - 50vw)`, che è la formula giusta per un contenitore e **sbagliata
dentro una griglia**: una percentuale di margine si risolve sulla larghezza
della *cella*, non del contenitore. La scena sbordava di 250 px e buttava fuori
schermo una finestra e un pop-up — e siccome la pagina ha `overflow-x: clip`,
non c'era nessuna barra di scorrimento a dirlo.

## Il core in locale

`cattura-core.mjs` è l'unico modo di fotografare Deepwork: il core importa
Firebase da `gstatic.com` e senza rete il modulo non parte. Si monta
`apps/deepwork-id/tests/browser/finto-firebase.mjs`, e poi si semina la
dimostrazione **patchando l'HTML servito** — le costanti `DEFAULT_*` vivono
dentro il `<script type="module">` e da fuori non si raggiungono, quindi il
login risponde «Credenziali errate» su credenziali giuste.

## Come va online

⛔ **NON serve un dominio nuovo, e non ne serviva uno.** `netlify.toml` pubblica
il repository **dalla radice**, quindi ogni cartella è già un percorso del sito
esistente: è così che le nove app sono online oggi (`/apps/terra/`,
`/apps/genesi/genesi.html`, …). Non hanno domini separati — hanno percorsi.
La vetrina è nella stessa condizione: appena `apps/index.html` arriva su `main`,
è raggiungibile a `<sito-esistente>/apps/` e **il tour funziona**, perché tutto
sta sulla stessa origine.

⚠️ **Che le nove app si aprano davvero da lì è misurato**, non supposto:
`tour-aperto.mjs` segue i nove collegamenti con un browser vero e guarda che
cosa arriva a schermo — **9 su 9 aperte, 0 eccezioni**. Il core ci sta dentro
perché il finto Firebase lo fa partire anche senza rete: un'eccezione che si
può togliere si toglie, e quella riguardava proprio la superficie che il
fondatore mostra per prima.

⚠️ **Quello che manca è l'INDIRIZZO del sito, non il sito.** In questo
repository è scritto ovunque come `<sito-esistente>`: il dominio vero non
compare in nessun file (`netlify.toml` non ha il nome del sito, non c'è un
`CNAME`, i workflow non lo nominano). Sta nel pannello Netlify del fondatore.

### Un comando solo, e la pagina è pronta per il sito

    sh apps/vetrina/strumenti/costruisci.sh

Genera, scorpora le immagini, monta l'involucro, e passa i tre righelli
(`marchio-intatto`, `tour-vivo`, `tour-aperto`). L'uscita è `apps/index.html`
e `apps/img/`.

⛔ **Prima erano quattro passi da ricordare a mente**, e una lista tenuta a
mente si accorcia da sola: la prima volta che ne saltavo uno, la pagina del
sito restava indietro rispetto ai sorgenti senza che niente lo dicesse.
I due passi sotto sono quello che il comando fa dentro, non un'alternativa:

    python3 apps/vetrina/sito.py /tmp/tutto-dentro.html
    python3 apps/vetrina/strumenti/scorpora.py \
        /tmp/tutto-dentro.html /tmp/corpo.html apps/img

Il primo genera la pagina con **tutte le immagini incollate dentro** — l'unica
forma che un artefatto su claude.ai accetta, perché lì la politica di sicurezza
blocca ogni richiesta esterna. Il secondo le tira fuori in file veri.
⛔ **Non sono due modi di generare la pagina: è uno solo, poi scorporato.**
Fossero due percorsi di codice, il giorno che uno cambia l'altro resterebbe
indietro in silenzio.

Misura del secondo passaggio: **10,63 MB → 0,11 MB** di HTML, più 6,87 MB di
immagini che il browser mette in cache; e 75 doppioni spariti, perché i file
prendono il nome dall'**impronta del contenuto** e la stessa schermata usata in
tre finestre diventa un file solo.

### Prima di committare

    sh   apps/vetrina/strumenti/costruisci.sh        # e i suoi tre righelli
    node apps/deepwork-id/tests/giro-node.mjs

⛔ **E l'indirizzo della pagina si PASSA, non sta scritto dentro il righello.**
Il 25/08 nove righelli della vetrina portavano dentro
`http://127.0.0.1:8941/_p-….html`, il nome che l'anteprima aveva nello
scratchpad il giorno in cui il primo di loro è nato. `contrasto-foto`, lanciato
sulla pagina vera, ha caricato un 404 e ha stampato «0 testi in 0 sezioni ·
sotto 4.5:1 → 0»: un verde con tutti i denominatori a zero. Ora il server lo
alza `servi.mjs` — uno per tutti — che la porta la **chiede al sistema**, e
zero soggetti non è più «a posto» ma **non misurato**, con uscita diversa da
zero.

⚠️ La vetrina è una **superficie** di `run-stile.mjs` dal 25/08, e le sue tre
eccezioni sono dichiarate lì con la ragione (non carica `dw-app-ui.js`, non
carica `dw-tema.js`, nessun banco del giro la apre). Se un giorno una di quelle
ragioni non vale più, la suite lo dice.

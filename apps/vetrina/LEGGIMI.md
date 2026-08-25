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

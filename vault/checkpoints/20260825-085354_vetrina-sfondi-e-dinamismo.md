# Checkpoint — 2026-08-25T08:53:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
351008e7

## Cosa è stato completato
La vetrina di presentazione (nove app) con **fotografie di cantiere** e il
**dinamismo** chiesti dal fondatore il 23/08, e il tutto portato dentro il
repository in `apps/vetrina/` — prima viveva solo nello scratchpad.

- 12 fotografie da Wikimedia Commons montate: ingresso, fascia, invito e **una
  per ognuna delle nove app**. Autore e licenza verificati uno per uno; 4
  immagini **scartate** perché la verifica non tornava. Il credito in fondo
  alla pagina si **costruisce** da `strumenti/pronte.json`, non è scritto a mano.
- sei elementi per scena invece di due: tre finestre di schermate vere su tre
  piani, una scheda-fotografia, due finestrelle col linguaggio dell'app.
  Parallasse per piano, alone che segue il mouse, inclinazione verso il cursore.
- Deepwork e Deepwork ID adesso hanno 6 e 3 schermate vere (prima una):
  `strumenti/cattura-core.mjs` semina la dimostrazione **patchando l'HTML
  servito**, perché le costanti `DEFAULT_*` vivono dentro il modulo del core.
- pagina da 11,12 MB → **7,80 MB** (due serie di schermate, 880 e 440).
- prova del trasloco: la pagina generata dal repository è **identica byte per
  byte** a quella pubblicata.

## Difetti veri trovati misurando
1. **Il contrasto sopra una fotografia non lo misurava nessuno.** `prova.mjs`
   risale gli antenati cercando un `background-color`; sotto una foto non ce
   n'è uno, quindi misurava contro il nero del `body` e rispondeva «zero sotto
   soglia». Nuovo `contrasto-foto.mjs` sui pixel renderizzati: un difetto vero
   a 3,35:1, adesso il più magro a **4,76** su 14 giudicati (38 trovati, 24 con
   fondo proprio — denominatore dichiarato).
2. **`calc(50% - 50vw)` dentro una griglia non è lo sbordo a tutta larghezza:**
   la percentuale si risolve sulla **cella**, non sul contenitore. La scena
   sbordava di 250 px e mandava fuori schermo una finestra e un pop-up, e con
   `overflow-x: clip` nessuna barra di scorrimento lo diceva. Ora `--sbordo` +
   `misura-scena.mjs`.
3. **La stessa immagine in tre finestre**, due delle quali rendono a 200 px.

## Due volte il difetto era nel righello, non nel prodotto
- «AUTORE IGNOTO» su 24 file su 24: `curl -w` incollava il codice HTTP in fondo
  al corpo JSON, `json.loads` falliva **sempre**, e l'`except` lo diceva con la
  stessa faccia con cui direbbe «questo file non ha un autore».
- il bottone ambra accusato di contrasto **1,24**: il righello nascondeva il
  bottone stesso e ne misurava l'inchiostro contro il nero della pagina.

## Misura da tenere
`upload.wikimedia.org` risponde **429 con `retry-after: 600` sugli originali e
200 sulle miniature nello stesso istante**: sono due secchi di limite diversi.
Il primo tentativo ha macinato 25 minuti per **zero file** aspettando il secchio
pieno mentre quello accanto era vuoto; con le miniature, 24 file in due minuti —
e di larghezza ne servivano 1920, non 6240.

## Prossimo passo atomico
**Decisione del fondatore, non tecnica:** questa pagina deve **sostituire**
`apps/index.html` (la vetrina che Netlify pubblica a ogni merge su main)? Se sì,
il passo è generare `apps/index.html` da `apps/vetrina/sito.py` e verificare che
il deploy regga un file da 7,8 MB con le immagini dentro — oppure spezzare le
`data:` in file veri accanto alla pagina, che per Netlify è meglio.

Poi, indipendentemente: le schermate vere del core e di Deepwork ID mostrano
ancora «cave», «volate», `capocava@cava-alfa.it`. Sono i **dati di esempio del
prodotto**, non testi della vetrina — ma su un sito che punta all'edile si
notano, e vanno cambiati **nella dimostrazione**, non nella vetrina.

## Blocchi
Nessuno.

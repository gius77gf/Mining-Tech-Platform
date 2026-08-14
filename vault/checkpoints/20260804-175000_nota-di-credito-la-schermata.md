# Checkpoint — la nota di credito si può emettere davvero

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Banchi del browser:** 27 → **29**

## Che cosa cambia per chi usa Conti

La finestra che elimina una fattura scriveva — testuale — che «una fattura
realmente emessa non va cancellata, va gestita con una nota di credito», e poi
offriva **un solo bottone**: quello che la regola viola. Adesso ce ne sono due,
e quello giusto porta al modulo della nota: causale fra le sei, importo
precompilato con lo **stornabile**, numero della serie dedicata `NC/2026/001`.
Emessa la nota, la fattura resta in archivio col badge **«Stornata»** (o
«Stornata 40%» se parziale) e l'esposizione del cliente scende.

## Il difetto che il banco ha trovato al primo colpo

> `numeroDaCampo` restituisce un **oggetto**, non un numero.

La pagina gli passava l'oggetto a `validaNota`, dove `+oggetto` è `NaN` e
diventa **zero**: «l'importo della nota dev'essere maggiore di zero» su un campo
che diceva **18300**. Nessun errore in console, nessuna prova di `node` che
potesse vederlo — lo strato dati era giusto, era la pagina a leggerlo male.

E la correzione non ha inventato una seconda convenzione: usa `numCampo` e
`spiegaNum`, che in questa pagina ci sono già. Così il caso **ambiguo**
(«18.300» = diciottomila o diciotto e tre?) viene raccontato con la frase che
Conti usa dappertutto, invece che schiacciato a zero.

*È la regola di `CLAUDE.md`: quando una prova accusa il codice, prima si legge
**come il codice si aspetta i dati**. Qui la prova aveva ragione e il codice
nuovo aveva torto — ma la diagnosi è arrivata leggendo `numeroDaCampo`, non
indovinando.*

## `chiedi` ha una terza strada, facoltativa

Il quinto parametro (`etichettaExtra`) aggiunge un bottone e fa valere la
promessa `"extra"`. Chi non lo passa ha esattamente i due bottoni di sempre e
`true`/`false` — le altre cinque app non se ne accorgono. Serviva perché la
scelta qui non è sì/no ma **«questa, quella, o niente»**.

## Il banco, e il difetto che si ripete

`tests/browser/nota-credito.mjs`: **13 prove**, tutte verdi. Con `--controprova`
(che rimette la finestra a un bottone solo, **nella risposta HTTP**) ne cadono
**9 su 13**, con **1 iniezione** dichiarata.

⚠️ Alla prima esecuzione la controprova è **morta** invece di fallire: senza il
bottone nuovo, `.find(…).click()` solleva dentro `evaluate`. **Lo stesso difetto
corretto stamattina in `genesi-struttura.mjs`** — due banchi scritti a poche ore
di distanza, lo stesso buco, perché la forma «prendi l'elemento e premilo» è
comoda e non regge quando l'elemento non c'è. Ora entrambi raccolgono
l'eccezione e la trasformano in una caduta con la sua ragione.

## Nota di metodo: due nav id sbagliati

Il banco cercava `#nav-fatture`; in Conti la voce si chiama `#nav-fat`. Il click
non navigava, `#page-fat` restava `display:none`, e il bottone era «invisibile».
Trovato **misurando la catena dei genitori** invece di forzare gli stili — che
avrebbe fatto passare il banco su una pagina mai aperta.

## Stato

Suite `node` tutte verdi: kpi 1029, stile 264, helper 48, pointcloud 26,
manifest 9, demo 7, sonda 7, copertura 430/430, nomi doppi 0, documenti 15.

## Prossimo passo atomico

1. **l'elenco delle note di credito** in Conti (oggi la nota si emette e agisce,
   ma non si rilegge: c'è il badge sulla fattura, non il documento);
2. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
3. **poi** il giro completo del browser a 29 esecuzioni, una volta sola, alla
   fine del lavoro sul codice.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.

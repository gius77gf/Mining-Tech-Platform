# Conti: la manina solo alle voci che si toccano

**Data:** 01/08/2026 · **Area:** `apps/conti/index.html`
**Unità precedente:** `20260801-161500_la-sonda-che-non-navigava.md`
(commit `3f3a163`)

## Che cosa è stato fatto

La gemella dell'unità su Sentinella, adesso che la sonda naviga davvero.
`.item.tap{cursor:pointer}` era una decisione presa e scritta — *la manina solo
alle voci che si toccano* — che `dw-app-shell.css` annullava mettendo
`cursor:pointer` su tutte. Aggiunta la riga che la fa valere:
`.item{cursor:default}`.

## Misurato prima di toccare

La domanda è sempre la stessa: **fra le voci senza `.tap` ce n'è qualcuna
viva?** Se sì, togliere la manina sarebbe peggio del difetto.

> **126 voci in otto sezioni · 15 con `.tap` · 15 con un aggancio sulla riga ·
> nessuna voce viva resta senza la classe.**

⚠️ E qui la sonda ha dovuto imparare una terza forma di «viva», che mi ero
perso: non solo un `onclick` e non solo un `data-` su cui c'è una delega, ma
anche essere una **`<label>` con dentro un controllo** — cliccabile per natura,
senza che nessuno le attacchi niente. Delle quindici voci marcate, **sette sono
fatture con `data-fat` e otto sono `<label>`**. Con la sonda vecchia risultavano
7 su 15 e sembrava che otto righe promettessero un tocco inesistente: una
conclusione sbagliata a un passo dall'essere scritta.

È la stessa forma dell'errore di ieri sera, un piano più in là: non «il
controllo non guarda dove crede», ma «**il controllo non sa riconoscere tutto
quello che cerca**». Il segno è lo stesso — un numero che non torna col
sorgente.

## Verifica

Cursore **calcolato**, sezione per sezione: **126 voci, 15 con la manina, 111
ferme, 0 in disaccordo con la classe**; e i **76 bottoncini `.arr`** dentro le
righe mantengono la loro.

Controprova (−22 caratteri): senza quella riga, **126 con la manina, 0 ferme,
111 in disaccordo**. Ripristinato identico all'originale.

Il resto invariato: Conti alta **1681 px** come prima, `.top` 61, `.item` 140,
`.kpi` 90; Sentinella 1989 e invariata. `run-stile` 274/0.

## Che cosa cambia per chi la usa

Centoundici righe smettono di dire «toccami» quando non fanno niente. Il
bersaglio vero — il bottoncino `›` in fondo alla riga — resta l'unica cosa che
si illumina, e adesso si distingue. Sul telefono il cursore non si vede, ma la
promessa mancata era vera lo stesso: è la stessa riga che dice a chi legge il
codice che cosa è cliccabile.

## Prossimo passo atomico

Leggere l'esito del giro completo del browser (`tutti.mjs`), che sta girando su
copia congelata e copre anche i quattro banchi mai passati sulle tre superfici
di Deepwork ID. Poi le altre quattro app con la stessa domanda: **campo,
flotta, scudo e terra scrivono `.item{cursor:pointer}` per tutte le righe** —
lì la decisione è opposta e va guardata con la stessa misura, non copiata a
occhio: se anche da loro le voci vive sono una minoranza, è lo stesso difetto
scritto al contrario.

> ⛔ **NUMERI SBAGLIATI IN QUESTO FILE — vedi
> `20260801-161500_la-sonda-che-non-navigava.md`.** La misura nel browser
> descritta qui («42 voci in tutte le sezioni, 36 con `.cliccabile`») è stata
> presa da una sonda che **non navigava**: chiamava `vaiA` con due argomenti
> invece di tre, quindi ha misurato **la stessa schermata sei volte**. Rifatta
> come si deve: **39 voci, 14 con `.cliccabile`, 25 ferme, zero disaccordi**.
> La correzione fatta al prodotto **resta giusta** — e vale più di quanto
> scritto qui: le voci che smettono di promettere un tocco che non c'è sono
> **25**, non 6. Lascio il file com'era, con questo avviso in cima: un
> checkpoint non si riscrive.

# Sentinella: la manina solo alle voci che si toccano

**Data:** 01/08/2026 · **Area:** `apps/sentinella/index.html`
**Unità precedente:** `20260801-153000_profilo-lo-spazio-di-una-barra-che-non-ce.md`
(commit `ee06e2e`)

## Il difetto, trovato smontando i due fogli condivisi

Sentinella scrive `.item.cliccabile{cursor:pointer}`: una decisione presa e
scritta — *la manina la meritano solo le voci che fanno qualcosa*. Non ha mai
funzionato. `dw-app-shell.css` metteva `cursor:pointer` su **tutte** le `.item`,
quindi `.cliccabile` era già vera dappertutto e la riga non distingueva niente.

Non è un difetto di stile: è **un'interfaccia che promette**. Una riga che
mostra la manina dice «toccami»; se non fa niente, chi la tocca pensa di aver
sbagliato mira, non che la riga sia ferma.

Salta fuori adesso perché E0 ha smontato il foglio che lo mascherava: finché il
`cursor:pointer` arrivava da lontano, leggendo `sentinella/index.html` la
decisione **sembrava applicata**.

## Misurato prima di toccare, e in due modi

Togliere la manina a una voce **viva** sarebbe peggio del difetto. Quindi:

1. **nel browser**, voce per voce in tutte le sezioni: **42 voci, 36 con
   `.cliccabile`, 36 con un aggancio, zero disaccordi**;
2. **nel sorgente**: delle dieci emissioni di `class="item…"`, solo **due**
   portano `cliccabile`, e tutt'e due portano anche un `data-`.

Le due strade dicono la stessa cosa: la classe sta su tutte e sole le voci che
fanno qualcosa. Le altre sei non sono ferme per sbaglio — il bersaglio è il
bottoncino `.arr` **dentro** la riga, che la manina ce l'ha per conto suo.

## Che cosa è stato fatto

Una riga: `.item{cursor:default}` prima di `.item.cliccabile{cursor:pointer}`.

## Verifica

Cursore **calcolato**, non dedotto: **42 voci, 36 con la manina, 6 ferme, 0 in
disaccordo con la classe**; e i **36 bottoncini `.arr`** dentro le righe
mantengono la loro.

Controprova (l'iniezione dice quanti caratteri ha tolto): senza quella riga,
**6 voci in disaccordo**, tutte con `cliccabile=false cursor=pointer`.
Ripristinato identico all'originale, confrontato col testo e non a memoria.

Il resto invariato: Sentinella alta **1989 px** come prima, `.top` 61,
`.item` 125, `.kpi` 86; scarto in pixel **0,15%** nella fascia 181–185, cioè
esattamente il bordo che pulsa di `.kpi.danger` che il controllo riproduce da
solo. `run-stile` 274/0, `run-kpi` 1123/0.

## ⛔ Conti: NON toccata, e la ragione

Conti ha la stessa forma (`.item.tap{cursor:pointer}`), ma la misura **non
torna**: la sonda ha contato **0 righe con `.tap`** mentre il sorgente ne emette
(riga 1810, le fatture, con `data-fat`). Quando il controllo e il sorgente si
contraddicono, il difetto è nel controllo finché non si dimostra il contrario —
ed è già successo oggi due volte, con il filtro sulle `.page` nascoste e col
minimo-e-massimo delle righe di pixel.

Quindi Conti resta com'è, **dichiarata** invece che sistemata a occhio. È
l'unità successiva, e comincia dal capire perché quelle righe non si presentano
alla sonda.

📌 E una cosa vista di sfuggita, da guardare in quell'occasione: la stessa voce
(«Polvere · Reclamo aperto» in Sentinella, «Edilcave Srl · 4 DDT da fatturare»
in Conti) compare in **tutte** le sezioni. Può essere un riquadro di richiamo
voluto — o `.page.active` su più di una sezione, che sarebbe un difetto vero.
Non l'ho stabilito, e quindi non lo racconto come se l'avessi stabilito.

## Prossimo passo atomico

Leggere l'esito del giro completo del browser (`tutti.mjs`, su copia congelata:
copre i quattro banchi mai girati sulle tre superfici nuove). Poi Conti, come
sopra.

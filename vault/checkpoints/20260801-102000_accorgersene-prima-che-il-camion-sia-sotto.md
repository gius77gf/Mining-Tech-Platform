# Accorgersene prima che il camion sia sotto

**Data:** 01/08/2026 · **Area:** `apps/conti/index.html` + dimostrazione
**Unità precedente:** `20260801-094500_tutte-e-sei-e-la-seconda-meta-del-principio.md`

## La guardia che stava dopo il momento utile

`mancanzeDdt` era letta da **un posto solo**: il foglio di stampa. Quindi
l'utente scopriva che il documento è incompleto **quando ha già premuto Stampa**
— cioè col camion sotto e il camionista che aspetta. La guardia c'era e arrivava
tardi: è la stessa forma della *guardia scollegata*, spostata nel tempo invece
che nello spazio.

Adesso la legge anche l'**elenco delle pesate**: pastiglia gialla «DDT
incompleto» e, in coda alla riga, `da completare prima di stampare: …` col nome
di quello che manca. La regola resta scritta una volta sola nel modulo — la
pagina la consuma in due posti.

## ⚠️ E la dimostrazione era diventata rumore

Al primo scatto **10 righe su 12** gridavano «DDT INCOMPLETO». Tecnicamente
giusto, praticamente inutile: un elenco tutto giallo non insegna niente e fa
sembrare rotta l'app invece di segnalare un caso. Completate nove pesate e
lasciati **due** casi, scelti:

- **`s2`** — nessuna causale del trasporto: il caso grosso;
- **`d3`** — trasporto «a cura di un **vettore**» e il nome del vettore **non
  scritto**: il caso sottile, quello che un controllo «il campo è pieno?» non
  vedrebbe.

Due su dodici: si notano, e restano leggibili.

## ⛔ Tre errori di processo in questa unità, e vanno scritti

1. **Ho modificato una pagina mentre girava un giro del browser.** Il censimento
   delle sei app stava leggendo la cartella viva quando ho toccato
   `apps/conti/index.html`. È esattamente la regola di `CLAUDE.md`, violata da
   chi stanotte ne ha citato il paragrafo. Il censimento è stato **buttato**,
   non usato: i suoi numeri non valgono. (Il giro `tutti.mjs` gira su una copia
   e non avrebbe avuto il problema; questa sonda di scratchpad no.)

2. **Uno script di modifica ha corrotto il modulo dati**, e il controllo di
   sintassi non se n'è accorto. Cercando il primo `},` dopo l'id, ha duplicato i
   campi su un record e **mangiato la chiusura** di un altro:

   ```
   ... fatturaId: "storico" , causaleTrasporto: …, trasportoACura: …, causaleTrasporto: …, trasportoACura: …
   ```

   Trovato guardando il **`git diff`**, non l'esito dello script — che diceva
   «toccati 3 record» ed era pure vero. È la regola del 01/08 sui sostituti che
   mentono: *la conta da sola non basta, si confronta la copia con l'originale*.

3. **⚠️ `node --check` NON vede questo genere di rottura in un modulo ES.**
   Sulla seconda versione (virgola mangiata: `fatturaId: "storico"
   causaleTrasporto: …`) ha risposto **«sintassi ok»**, e l'errore è saltato
   fuori solo importando il modulo con `node -e 'import(...)'`. Da qui in poi la
   verifica di un modulo dati è l'**import**, non `--check`. Vale la pena
   ricordarlo: è una guardia che sembra proteggere e non protegge.

Rimediato con un ancoraggio **riga per riga** sulla coda esatta del record e con
`git checkout` prima di ogni nuovo tentativo — nove righe cambiate, tutte
guardate una per una nel diff.

## Verifica

Scatto **guardato**: 2 righe su 12 con la pastiglia, la coda che nomina la
mancanza («il nome del vettore»), riga alta 240 px contro 187 delle sorelle —
più alta perché ha una riga in più, e sotto la soglia del banco.
`stati-non-misurati` **32/0** (aggiunto anche a Terra il `vietato` sul volume
scavato, stessa forma di Sentinella). Suite: kpi 1117/0, demo 8/0, stile 271/0,
sonda-vuoto 7/0, numeri-nei-documenti 17/0, copertura 0 scoperte, nomi-doppi 0,
suite-collegate 3/0, helpers 49/0, manifest 9/0, pointcloud 26/0.

## Prossimo passo atomico

Rifare il **censimento delle sei app** che ho invalidato, questa volta senza
toccare niente mentre gira — e usarlo per rispondere alla domanda rimasta
aperta: *quali stati «non misurato» esistono nei moduli e non compaiono in
nessuna delle sei liste del banco?* Il lato sorgente è già misurato (5 frasi
distinte in Scudo, 9 in Campo, 7 in Flotta, 7 in Sentinella, 6 in Conti, 12 in
Terra); manca il lato schermo, che è la metà che conta.

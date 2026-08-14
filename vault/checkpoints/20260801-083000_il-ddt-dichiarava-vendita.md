# Il DDT dichiarava «Vendita» al posto dell'utente

**Data:** 01/08/2026 · **Area:** `apps/conti/conti-data.js` + la stampa del DDT
**Unità precedente:** `20260801-080000_la-detrazione-che-non-ho-collegato.md`

## ⚠️ Prima correzione: il buco che avevo scritto io non era quello

Il passo dichiarato era «le anagrafiche `cantieri` e `vettori` di Conti insieme
alla pagina del DDT — l'unico buco di **dati** rimasto». Due minuti di `grep`
prima di scriverle, e la scheda era di nuovo più vecchia del codice:

- **la pagina del DDT esiste**, completa: registro pesate, `numeroProssimoDdt`,
  fattura differita dai DDT spuntati, e una stampa di cortesia in nero su bianco
  con `@media print`, le firme e il richiamo al DPR 472/1996;
- il **destinatario** e il **mezzo** ci sono già, come campi liberi sulla pesata
  (`destinatario: "Cantiere SS115 km 12"`, `mezzo: "FT 421 KP"`).

Quindi «cantieri e vettori: zero riferimenti» misurava i **nomi delle
collezioni**, non quello che il documento sa dire. Rendere strutturate quelle due
voci sarebbe un miglioramento, non un buco. È la quinta volta in tre giorni, e
stavolta il documento sbagliato l'avevo scritto **io**, poche ore fa.

## ⛔ Il difetto vero, che era molto peggio

Guardando la stampa invece dell'elenco delle collezioni:

```js
<div class="box"><span class="et">Causale del trasporto</span>Vendita</div>
<div class="box"><span class="et">Trasporto a cura di</span>${p.mezzo ? "mittente — mezzo " + p.mezzo : "mittente"}</div>
```

**Fissi nel codice. Su ogni DDT.**

Non è forma. Il DDT è il documento che viaggia sul camion e che la Guardia di
Finanza legge a un posto di blocco. La **causale** decide se quel materiale è
venduto, dato in conto lavorazione, reso, o spostato fra due depositi della
stessa ditta — e da lì se ci vuole una fattura. Materiale mandato in conto
lavorazione con scritto «Vendita» è una **dichiarazione sbagliata fatta dall'app
al posto dell'utente**. E «trasporto a cura del mittente», quando il cliente è
venuto a ritirare col camion suo, sposta la responsabilità del trasporto sulla
persona sbagliata.

È il principio del fondatore nel posto dove costa di più: non un numero
tranquillo su uno schermo, ma una **dichiarazione su un documento fiscale**.

## La correzione, col disegno che Conti aveva già

Conti aveva già il modello giusto due schermate più in là: `CAUSALI_NOTA` +
`causaleNota(id)` + «causale non indicata» per le note di credito. Stessa forma:

- **`CAUSALI_TRASPORTO`** (7 voci: vendita, conto lavorazione, conto visione,
  reso, trasferimento fra depositi, omaggio, riparazione) e `causaleTrasporto`;
- **`TRASPORTO_A_CURA`** (mittente, destinatario, vettore), ognuna con la sua
  spiegazione, perché la scelta non è ovvia a chi compila di fretta;
- **`mancanzeDdt`**, che restituisce un **elenco di mancanze e non un booleano
  «valido»**: il DDT si stampa lo stesso — il camion parte — ma chi lo stampa
  deve sapere che cosa ci sta scrivendo sopra.

Sul foglio, quando manca qualcosa, compare il riquadro rosso tratteggiato
`.manca` — **che esisteva già**, usato per l'IVA delle fatture registrate a
importo unico — e le due caselle dicono **«da indicare»** invece di «Vendita».

⛔ E in salvataggio i campi restano **vuoti** se l'utente non li ha scelti: non
si mette `"vendita"` per comodità. Un valore di comodo lì diventa una
dichiarazione.

## Il caso che una lista di booleani non prenderebbe

`mancanzeDdt` ha una prova per **«a cura di un vettore» senza il nome del
vettore**: la scelta c'è, quindi un controllo che guarda solo se il campo è
pieno direbbe che va tutto bene — e sul foglio comparirebbe «trasporto a cura
del vettore» senza dire quale. Provato anche che **uno spazio non è un nome**.

## In dimostrazione, subito — la lezione delle unità precedenti applicata prima

Stanotte due volte una difesa nuova era invisibile perché la dimostrazione non
aveva il caso. Qui i tre stati ci sono da subito: **s1** completo a cura del
mittente, **s4** a cura di *Autotrasporti Ragusa Srl*, e le altre dieci **senza
causale**, così il riquadro «questo documento non è completo» si vede davvero.
Misurato sul foglio stampato: 2 completi su 12.

## Verifica

Scatto **guardato** del DDT stampato nei tre stati (s1, s4, s2): il riquadro
rosso c'è solo dove serve, «Autotrasporti Ragusa Srl» compare al posto di
«mittente», e nessun DDT incompleto scrive «Vendita».

⚠️ Due difetti della sonda, tutt'e due della stessa famiglia: `#stampa` è
**vuoto** finché non si chiede un foglio (la prima versione emulava il media
print e trovava zero documenti), e cercare l'etichetta **a testo** non funziona
perché il CSS la mette in **maiuscolo** e `innerText` riflette la
trasformazione — le caselle si leggono per struttura.

⚠️ E un mio errore sul testo che va **sulla carta**: avevo scritto «non e'
completo» con l'apostrofo dritto. Corretto.

Suite con `TZ=Europe/Rome`: kpi **1117/0**, stile 271/0, helpers 49/0,
pointcloud 26/0, manifest 9/0, demo 8/0, sonda-vuoto 7/0, copertura **9 soggetti
0 scoperte**, nomi-doppi 0, date-checkpoint 3/0, suite-collegate 3/0 (44 file),
`stati-non-misurati` 13/0. `numeri-nei-documenti` è caduta **due volte** e aveva
ragione tutt'e due (prove 1.477→1.480, copertura 458→463): è la terza unità di
fila in cui quella guardia prende un numero che avrei scritto giusto solo per
fortuna.

## Prossimo passo atomico

Portare i tre stati del DDT dentro `stati-non-misurati.mjs`: oggi il banco
guarda Scudo e Terra, e il caso più costoso — la dichiarazione inventata su un
documento fiscale — è provato solo da `mancanzeDdt` e da uno scatto che vive in
scratchpad. Con Conti il banco arriverebbe a tre app su sei.

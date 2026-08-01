# La chiusura del mese: lo strato dati

**Data:** 01/08/2026 · **App:** Conti
**Unità precedente:** `20260805-100000_il-giro-chiude-e-la-riga-spenta.md`

## Cosa è stato fatto

Le quattro funzioni della chiusura del mese sono nel modulo dati, trapiantate
dal banco dove erano già verdi a 28 prove: `statoMese`, `vociMancantiNelMese`,
`margineMese`, e il conto degli arrivi dopo la chiusura dentro `statoMese`.

Il problema che risolvono, in una riga: **i ricavi in Conti sono completi per
costruzione, i costi no.** I ricavi nascono da pesate e fatture, che qualcuno
ha dovuto emettere; i costi ci sono solo se qualcuno li ha battuti a mano. Il
mese in cui la busta paga non è stata registrata non dà un errore: dà **«margine
42%»**, in verde, in cima alla pagina. Ed è la forma più convincente
dell'assenza travestita, perché stavolta il numero è **alto**, cioè quello che
si spera.

E il registro costi fatto ieri **aumentava** quel rischio invece di ridurlo:
prima non c'era nessun costo e nessuno si sarebbe sognato di calcolare un
margine; adesso i costi ci sono, sembrano completi, e dividerli è immediato.

## Le quattro decisioni che rendono il numero onesto

1. **Prima della chiusura il margine è `null`**, non zero e non «parziale in
   piccolo» — e la ragione **nomina la voce che manca**: «mancano i costi di
   personale», non «mese aperto».
2. **Quali voci manchino si impara dallo storico**, non da un elenco
   obbligatorio che non esiste: una voce è abituale se compare in almeno metà
   degli altri mesi. Così l'esplosivo, che in quella cava non compare mai, non
   è una mancanza — è come lavora quella cava. E una spesa capitata due volte
   su cinque mesi non si rinfaccia.
3. **Una voce dichiarata assente nella chiusura non si rinfaccia**, ma una mai
   dichiarata resta scritta accanto al margine. Senza questa distinzione la
   schermata scriverebbe «margine 92%» e sotto «manca il personale»,
   contraddicendosi da sola **proprio quando l'utente aveva risposto**.
4. **I ricavi sono per competenza**, al netto delle note di credito emesse nel
   mese. Confonderli con gli incassi darebbe due margini diversi per lo stesso
   mese, giusti tutti e due — il modo migliore per non essere creduti.

## Due trappole già disinnescate, e una che stavo per rifare

- **`registratoIl` non esiste ancora** sui costi in archivio, e in JavaScript
  `undefined > "2026-08-04"` è **vero**: senza guardia *ogni* voce vecchia
  sarebbe un arrivo dopo la chiusura e *ogni* mese chiuso sarebbe
  «chiuso-con-arrivi». La prova lo blinda.
- **La percentuale non si calcola su ricavi zero** (sarebbe `Infinity`, che
  sullo schermo è indistinguibile da un numero). Il margine negativo invece si
  mostra: quello è un dato vero.
- ⚠️ E scrivendo `vociMancantiNelMese` stavo **ripetendo la trappola di ieri**:
  ho usato `VOCI_COSTO` credendola disponibile perché il modulo la
  **ri-esporta**. `export … from` non lega il nome. Presa subito perché era
  scritta in `CLAUDE.md` da stamattina — è servita a meno di un giorno di
  distanza.

## Le prove

Sei `test` nuovi in `run-kpi.mjs` (**1057 → 1063**), che coprono i casi del
banco: lo storico che insegna, la soglia di metà, l'arrivo dopo la chiusura che
non riapre il mese, il margine assente che nomina la voce, la competenza al
netto degli storni, e la percentuale che non si calcola su zero.

## ⚠️ E la CI caduta stanotte, che era colpa della sonda

Mentre lavoravo è arrivata una CI rossa, e **il difetto era del controllo, non
del prodotto**. Fra i campioni di `sonda-vuoto.mjs` c'era la data letterale
`"2026-07-31"`, che il giorno in cui è stata scritta era **oggi**. Il 1° agosto
è diventata ieri, quindi `statoScadenzaTerra` ha cominciato a rispondere
«scaduta» — **giustamente** — e la sonda l'ha letto come un allarme inventato
su un dato mancante, accusando due funzioni sane.

È la stessa forma del difetto che quella sonda esiste per trovare, solo al
rovescio: un verdetto sicuro prodotto da un dato che non diceva quello che si
credeva. E un controllo che grida al lupo perde il diritto di essere creduto la
volta che ha ragione.

Corretta: la data del campione è ora **neutra per costruzione** (nel futuro,
ricavata da oggi), così l'unico allarme possibile viene dall'argomento che
manca. Spostandola è emerso il caso opposto su `livelloScadenzaTerra`, e prima
di dichiararlo l'ho guardato: l'argomento assente è il **preavviso**, non la
data — la sua assenza non cambia che la scadenza sia lontana 400 giorni.
Dichiarato con la ragione, non zittito.

Stato: `run-kpi` **1063**, prove `node` **1.421**, copertura **440/440**,
`run-stile` 268, sonda del vuoto 7/7 (7 allarmi e 9 tranquilli, tutti
dichiarati), banchi del browser 35.

## Prossimo passo atomico

**La schermata della chiusura del mese**: lo stato del mese in cima alla scheda
Costi, e la chiusura come **elenco di conferme** — non un bottone secco, che si
preme per far sparire l'avviso. Ogni voce abituale mancante chiede una risposta
(«questo mese non c'è, ed è giusto» oppure «devo ancora inserirla»), e quelle
risposte finiscono in `vociAssenti`.

Poi, con le funzioni già provate in banco: i **lotti di Terra** (13 prove) e
l'**analisi della causa** in Scudo (12 prove).

# Il censimento del principio, in tutte e sei le app

**Data:** 01/08/2026 · **App:** tutte e sei
**Unità precedente:** `20260801-024500_la-bandiera-che-nessuno-legge.md`

## Cosa è stato fatto

Sei cantieri in parallelo, uno per app, con lo stesso mandato: cercare **ogni
punto in cui l'app riassume, colora, conta o mette in classifica qualcosa**, e
chiedersi *se il dato sottostante non è mai stato misurato, che cosa mostra?*

È il principio del fondatore — **«l'assenza di un dato non è un dato
favorevole»** — usato per la prima volta non come regola da rispettare quando
si scrive qualcosa di nuovo, ma come **metro con cui rileggere tutto quello che
c'è già**.

Ne sono usciti **28 punti corretti**. Prove `node`: **1.438 → 1.469**;
copertura **454 → 456**, sempre al 100%.

## I difetti, app per app

**Flotta — il campo vuoto che salvava zero.** Il form del mezzo dichiara le ore
del contatore facoltative: chi aggiungeva un escavatore da 6.000 ore senza
sapere il contatore faceva **scrivere in archivio la misura `0`**. Da lì tutte
le difese a valle — che `null` e `0` li distinguono con cura — non avevano più
niente da distinguere: il tagliando dei 500 h usciva «tra 500 h» in **verde**
quando poteva essere già passato. L'import CSV faceva la cosa giusta; il form,
che è la strada principale, no.
E due guardie **si vantavano del contrario di quello che facevano**:
`Number.isFinite(+m.ore)` col commento sopra «ora chi non ha il contatore torna
null». `+null` fa `0` e `Number.isFinite(0)` è `true`: un mezzo senza contatore
valeva **zero ore**. Misurato: un tagliando contato nella tessera del Quadro con
un «fra 30 giorni» ricavato da «ore previste meno zero».

**Conti — la media che si abbassa da sola.** `etaCredito` faceva
`Math.max(0, -giorni(f.emessa) || 0)`: una fattura **senza data d'emissione**
entrava nella media come **zero giorni**, col suo posto al denominatore.
Misurato: **92 gg → 46 gg** con una sola fattura senza data, e la frase accanto
passa da «sopra i 45 giorni» a «sotto controllo».
E `giorni(null)` non fa `0`, fa **NaN** — che non è `< 0` né `<= 10`: una
fattura senza scadenza scivolava nell'ultimo ramo e usciva **verde «Regolare»**.

**Scudo — «regolare» chi nessuno ha mai guardato.** Un lavoratore **senza
nemmeno una riga in scadenzario** — nessuna visita medica, nessun corso, nessun
patentino — veniva contato fra i «regolari». Misurato sulla dimostrazione:
3 su 7, di cui **2 non avevano nessuna scadenza**.
⚠️ Ed è la regola che `shared/dw-ponti.js` applica **già** per Campo, scritta lì
con la sua ragione: *«sommarlo ai tutto a posto trasformerebbe un non lo so in
un sì»*. Violata qui — e **c'era una prova che la blindava**, col nome che lo
dichiarava («nessuna scadenza → regolare»).

**Campo — il verde del lucchetto.** `const cls = bloc ? "ok" : …`: il turno
**chiuso e firmato** vinceva su tutto, quindi un turno con l'**appello mai
fatto** usciva col cartellone verde e «0/5 presenti». Il colore è la prima cosa
che si legge, e diceva «a posto» dove non è stato chiesto niente a nessuno.
E una giornata con **due fermi mai cronometrati** era indistinguibile da una
**senza nessun fermo**: tutt'e due «fermi 0 min».

**Sentinella — lo zero di nascita.** Un punto di monitoraggio nasce
`valore: 0, letture: []`. Il badge diceva già «Mai misurato» (corretto il
03/08), ma la riga accanto scriveva **«0 mm/s / soglia 5 · 0%»**, e
l'**ordinamento** lo metteva **primo** fra i più tranquilli e **ultimo** per
criticità: in tutt'e due i versi, nel posto dei sereni.

**Terra — «Nei limiti» a chi non ha misurato niente.** Con un atto da 1.200.000
m³ concessi e **zero rilievi**, la scheda in cima al Quadro diceva pastiglia
verde **«Nei limiti»**, «1.200.000 m³ residui», «0% consumato».
E un **pregresso mai dichiarato** diventava uno zero **scritto in banca dati**,
che il foglio da consegnare all'ente stampava come «Estratto dichiarato prima
dell'uso di Terra: **0 m³**» — una dichiarazione che nessuno aveva fatto, e per
giunta quella che alza il residuo.

## ⚠️ Il punto che il codice non ha visto e lo scatto sì

Terra aveva ancora un difetto **una riga sopra** quello appena corretto. Il
cantiere aveva reso `avanzamento` un `null` quando nessun rilievo dell'anno lo
misura, con la ragione scritta accanto — e aveva lasciato `volumiMese` a
`reduce(…, 0)`.

L'ho trovato **guardando lo scatto**, non il codice: la tessera diceva
**«m³ estratti mese: 0»** e quella accanto **«rilievi drone mese: 0»**. Cioè la
schermata dichiarava da sé di non sapere, e nella tessera a fianco affermava una
misura. In Terra il rilievo *è* la misura dell'estratto: un mese senza rilievi
non è un mese in cui non si è cavato.
Adesso è `—`. E la prova che diceva `eq(k.volumiMese, 0, "nessun rilievo a
luglio → volumi mese 0")` **blindava il difetto**: resa più **giusta**, non più
permissiva, con accanto la prova opposta — un rilievo che ha **misurato zero**
resta zero, perché quello è vero.

È la direttiva 4 del fondatore alla lettera: il confronto affiancato trova
quello che la lettura non trova. Due volte in questo blocco, sulla stessa
giornata.

## Verifica

- `run-kpi` **1107/0**, `run-stile` **271/0**, `run-helpers` 49/0, `run-demo`
  7/0, `run-pointcloud` 26/0, `run-manifest` 9/0 — tutte con `TZ=Europe/Rome`.
  **Totale 1.469.**
- Copertura **456/456** funzioni delle app e **51/51** dei moduli condivisi,
  nessuna funzione senza prova. Alzati i **sei fondi** che il censimento
  chiedeva di alzare.
- `numeri-nei-documenti` **15/15**: i tre documenti aggiornati **dalla misura**
  (1.469 e 456/456), non a occhio.
- Sei app aperte a 430 px: **nessun `pageerror`**, nessun `NaN`, nessun
  `undefined`, nessun `[object Object]`, barra in basso su **una riga** in tutte
  e sei (misurate le posizioni dei bottoni, non guardate).
- Scatti guardati: `scudo-pers` (il riepilogo nuovo e i due badge gialli) e
  `terra-dash` (la scheda vita cava e le tessere).
- Ogni cantiere ha portato la **propria controprova**, con i caratteri cambiati
  stampati: Terra 8 iniezioni / 8 cadute, Scudo 5/5, Sentinella 4/4, Flotta 3/3,
  Campo 5/5, Conti 4/4. La mia sul mese di Terra: 1 iniezione, 26 caratteri, la
  prova cade — e lo **zero misurato** resta `0`, cioè il rimedio distingue
  invece di annullare tutto.

## ⚠️ Perché un commit solo e non sei

La direttiva dice di committare **app per app dopo aver verificato**. Ho
verificato app per app — suite, scatto, sonda — ma il commit è **uno**, e la
ragione è tecnica: tutte e sei scrivono nello **stesso** `run-kpi.mjs`, e alcune
hanno **corretto prove esistenti** che blindavano i difetti. Spezzarlo in sei
vorrebbe dire sei commit in cui il codice di una app sta con le prove di
un'altra: ognuno rosso, e nessuno bisecabile. Un commit rosso non è più
verificabile di uno grande.

## Quello che i cantieri hanno lasciato fuori, e va tenuto in vista

Tutti hanno dichiarato ciò che **non** hanno toccato, invece di allargare il
lavoro. Vale la pena riportarlo, perché sono decisioni, non dimenticanze:

1. **Sentinella, `Math.max(0.001, +mm.soglia || 1)`** — un punto **senza
   soglia** viene confrontato con una soglia **inventata (1)** e ne esce
   «Conforme», verde. È il caso potenzialmente più grave di tutti, ed è
   **fermo di proposito**: toccare una soglia richiede la conferma esplicita del
   fondatore. Misurato che dalla UI non è raggiungibile (il form pretende
   soglia > 0, l'import scarta soglia ≤ 0): vive solo per dati scritti altrove.
2. **Scudo, `giorniAssenza` vuoto → 0** — la decisione è già scritta e datata
   nella suite (una colonna vuota vuol dire davvero nessuna assenza, che è il
   caso normale di un near-miss). Il caso che quella ragione **non** copre: un
   infortunio a prognosi ancora aperta entra come 0 giornate perse e abbassa gli
   indici. Decisione da fondatore.
3. **Terra, `proiezioneAnnua`** decide «senza rilievi» dal **volume**
   (`estrattoAnno <= 0`) e non dal numero di rilievi: un rilievo che misura 0 m³
   viene raccontato come «mai misurato». Sbaglia nel verso **prudente**.
4. **Terra**, una quinta variante della condizione «rilievo usabile» in
   `volumeMisuratoDiLotto`/`rilieviFuoriDaiLotti`: differisce solo su un volume
   non numerico. Le altre quattro sono state unificate.
5. **Conti**: nei dati dimostrativi **non** c'è una fattura senza date, quindi
   il caso nuovo non si vede in uno scatto — e `run-demo.mjs` **pretende** che
   ogni fattura demo abbia emissione e scadenza valide. È lo stesso problema
   già trovato con la chiusura del mese: la dimostrazione è più povera della
   realtà proprio dove il prodotto è più forte.

## Prossimo passo atomico

**Il punto 5**: far sì che la dimostrazione possa contenere un caso che
insegna. `run-demo.mjs` oggi vieta la fattura senza date, e quel divieto rende
invisibile la difesa appena costruita. Va deciso che cosa `run-demo` deve
davvero impedire — dati **corrotti** — distinguendolo da un dato **mancante
apposta**, che è una parte del prodotto.

Poi: **rilanciare il giro completo del browser** sul codice finale, da solo.
Il giro lanciato durante questo blocco è stato **fermato apertamente** a un
terzo: girava su una copia congelata di `e01cdf1`, ormai vecchia di due commit,
e teneva occupata la CPU impedendo ogni scatto ai sei cantieri. Fermarlo è
stata una scelta, non un incidente — e va detto invece di lasciarlo credere
finito.

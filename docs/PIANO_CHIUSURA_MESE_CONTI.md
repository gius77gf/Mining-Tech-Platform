# La chiusura del mese in Conti — piano di lavoro

*Scritto il 05/08/2026, dopo che il registro costi è entrato in produzione
(`riepilogoCosti`, `costoPerMetroCubo`, la scheda **Costi**, il ponte col
volume di Terra). Traduce in unità concrete la **Decisione 2** di
`docs/RICERCA_REGISTRO_COSTI_202608.md`, che era scritta come principio e non
come progetto.*

---

## Il problema, in una riga

**I ricavi in Conti sono completi per costruzione. I costi no.**

I ricavi nascono da pesate e fatture: qualcuno ha dovuto emetterle, quindi ci
sono. I costi ci sono solo se qualcuno li ha battuti a mano. Il mese in cui la
busta paga non è stata registrata non dà un errore: dà **«margine 42%»**, in
verde, in cima alla pagina.

È il numero più pericoloso che questa app possa mostrare — l'assenza di un dato
travestita da buona notizia, con il travestimento nella sua forma più
convincente, perché stavolta il numero è *alto* ed è quello che si spera.

E il registro costi appena fatto **aumenta** il rischio invece di ridurlo: prima
non c'era nessun costo e nessuno si sarebbe sognato di calcolare un margine;
adesso i costi ci sono, sembrano completi, e la tentazione di dividerli è
immediata. Il costo al metro cubo di oggi si difende perché il **denominatore**
può mancare in modo evidente; il margine no, perché il suo numeratore c'è
sempre.

---

## Cosa NON deve essere la chiusura

Tre errori da evitare, e il secondo l'abbiamo già commesso altrove.

1. **Non è un lucchetto.** Chiudere il mese non deve impedire di registrare un
   costo arrivato dopo. La fattura del fornitore che arriva il 12 del mese dopo
   è la norma, non l'eccezione. Se l'app la rifiuta, chi la deve inserire le
   mette **la data sbagliata** — e a quel punto abbiamo peggiorato il dato per
   difendere una regola. È la stessa lezione del turno chiuso in Campo: si
   blocca la **modifica di ciò che è già stato dichiarato**, non l'arrivo di
   ciò che ancora non c'era.

2. **Non è una spunta silenziosa.** «Chiudi il mese» come bottone secco è una
   firma su un foglio che nessuno ha letto: la gente lo preme per far sparire
   l'avviso. La chiusura deve **mostrare cosa sta dichiarando completo**, e in
   particolare **cosa manca**.

3. **Non è un giudizio.** Un mese senza personale registrato non è un mese
   sbagliato: magari è una cava che paga la squadra da un'altra società. La
   chiusura chiede conferma, non contesta.

---

## La forma

### I dati

```
chiusure/{id}: { mese: "2026-07",         // AAAA-MM
                 chiusoIl: "2026-08-04",  // giorno in cui è stata dichiarata
                 vociAttese: ["personale","carburante",…],  // ciò che si è detto di aspettarsi
                 vociAssenti: ["esplosivo"],  // dichiarate assenti APPOSTA, con la spunta
                 nota: "" }
```

Il punto meno ovvio, e quello che fa la differenza fra una spunta e una
dichiarazione: **`vociAssenti` va registrata**. «Questo mese non c'è esplosivo,
ed è giusto così» è un'informazione, e senza di essa la chiusura non distingue
*«non ho speso»* da *«non ho ancora inserito»* — che è esattamente la
distinzione per cui la chiusura esiste.

### Le funzioni pure (in `conti-data.js`)

| Funzione | Cosa risponde |
|---|---|
| `statoMese(costi, chiusure, mese)` | `aperto` / `chiuso` / `chiuso-con-arrivi` |
| `vociMancantiNelMese(costi, mese, storico)` | quali voci ci sono negli **altri** mesi e in questo no |
| `margineMese(fatture, note, costi, chiusure, mese)` | il margine, oppure `null` **con la ragione** |
| `arriviDopoLaChiusura(costi, chiusure, mese)` | voci registrate **dopo** `chiusoIl` ma datate nel mese |

`vociMancantiNelMese` è il cuore utile: non inventa un elenco di voci
obbligatorie (non esiste, cambia da cava a cava), lo **impara dallo storico**
dell'azienda stessa. Se il personale compare in cinque mesi su sei, il sesto
mese senza personale è una domanda da fare. Se non compare mai, non è una
domanda: è come lavora quella cava.

### Il margine

`margineMese` restituisce `null` se il mese non è chiuso, e la ragione dice
**quante voci mancano rispetto allo storico**, non un generico «mese aperto».

E due cose da dichiarare accanto al numero quando invece esce:

- **i ricavi sono per competenza**, non per cassa: sono le fatture **emesse**
  nel mese, al netto delle note di credito (`stornatoDi` lo sa già fare).
  Confonderli con gli incassi darebbe due margini diversi per lo stesso mese,
  e sarebbero giusti tutti e due — che è il modo migliore per non essere
  creduti;
- **i costi che Flotta registra già** (`daMezzo`) sono nel totale una volta
  sola. Se l'azienda li tiene in Flotta e non in Conti, il margine di Conti è
  **più alto del vero**, ed è la ripetizione esatta del problema che questa
  scheda esiste per risolvere. La chiusura deve chiederlo esplicitamente.

### `chiuso-con-arrivi`

Non è un dettaglio da poco. Un mese dichiarato chiuso a cui arrivano voci dopo
**non torna aperto** (il margine che qualcuno ha già letto e magari stampato non
si può far sparire), ma non è nemmeno più quello dichiarato. Lo stato lo dice,
e accanto al margine compare di quanto è cambiato dal giorno della chiusura.
Un numero che cambia in silenzio dopo essere stato dichiarato definitivo è
peggio di un numero mancante.

---

---

## Quello che il prototipo ha insegnato *(aggiunto il 05/08, dopo 28 prove in banco)*

Il piano qui sopra è stato scritto **prima** di provarlo. Provandolo sono
uscite tre cose che non c'erano, e la prima cambia la schermata.

### 1. Le voci dichiarate assenti vanno **sottratte**, o la pagina si contraddice

`vociAssenti` era già nel piano, ma solo come dato da salvare. Non bastava:
`margineMese` calcolava il margine **e** continuava a elencare fra le mancanti
proprio la voce che l'utente aveva appena dichiarato assente. Sullo schermo
sarebbe uscito «**margine 92%**» e sotto «**manca il personale**» — cioè la
pagina che si smentisce da sola *anche quando l'utente aveva risposto*.

La regola giusta è a tre stati, non a due:

| | cosa mostra |
|---|---|
| voce presente | niente |
| voce assente **e dichiarata** nella chiusura | niente: è una risposta |
| voce assente e **mai dichiarata** | resta scritta accanto al margine |

E nel terzo caso il margine **si calcola lo stesso** — l'ha chiesto una
persona, e rifiutarglielo dopo che ha chiuso il mese sarebbe un dispetto — ma
si porta dietro la frase: *«se quella spesa c'è stata e non è in elenco, il
margine qui sopra è più alto del vero»*.

### 2. `registratoIl` è un campo che ancora non esiste

`arriviDopoLaChiusura` confronta il giorno in cui la voce è stata **battuta**
con il giorno della chiusura. Ma i costi già in archivio quel campo non ce
l'hanno, e la pagina finora non lo scrive.

Due conseguenze, e la seconda è una trappola: la pagina deve cominciare a
scrivere `registratoIl` sui costi nuovi; e il confronto deve trattare
l'**assenza** del campo come «non lo so», mai come «arrivato dopo». Con un
confronto fra stringhe fatto male (`undefined > "2026-08-04"` è **vero** in
JavaScript) *ogni voce vecchia* diventerebbe un arrivo tardivo e *ogni* mese
chiuso sarebbe `chiuso-con-arrivi`. La prova che lo blinda c'è.

### 3. La percentuale non si calcola su ricavi zero

Un mese chiuso con costi e senza fatture ha un margine **negativo**, e va
mostrato: è un dato vero. Ma la *percentuale* no — dividere per zero ricavi dà
`Infinity`, che sullo schermo è indistinguibile da un numero. Margine sì,
percentuale `null`.

### E una scelta tarata, non indovinata

`vociMancantiNelMese` ha una soglia: una voce è «abituale» se compare in almeno
**metà** degli altri mesi. Sotto quella soglia non si chiede niente. Serve a non
rinfacciare una spesa capitata due volte l'anno — e la prova la fissa con un
caso preciso: personale in **2 mesi su 5** non è un'abitudine, carburante in
5 su 5 sì.

---

## Le unità, in ordine

1. **`statoMese` + `vociMancantiNelMese`**, con le prove. Nessuna interfaccia.
   La prova che conta: uno storico dove il personale compare in cinque mesi su
   sei deve far uscire «personale» come mancante nel sesto — e **non** deve
   farlo uscire quando non compare mai.
2. **`margineMese`**, che risponde `null` prima della chiusura. La prova che
   conta è quella scritta nella ricerca: un periodo **con pesate** e **senza
   nessuna voce di personale** non produce un margine.
3. **La schermata**: la chiusura come **elenco di conferme**, non come bottone.
   Con lo stato del mese in cima alla scheda Costi.
4. **`arriviDopoLaChiusura`** e lo stato `chiuso-con-arrivi`.

Ognuna con la sua controprova: il difetto da rimettere è sempre lo stesso, ed è
sempre lo stesso perché è **il** difetto — far uscire un numero dove qualcosa
non è stato misurato.

---

## Cosa questo piano NON decide

- **Il costo del venduto contro il costo del prodotto.** Il materiale cavato a
  luglio e venduto a settembre rende il margine mensile una grandezza
  discutibile. Qui si sceglie la lettura semplice — costi del mese contro
  ricavi del mese — e la si **dichiara**, invece di far finta che il problema
  non ci sia. La lettura per commessa è un'altra scheda.
- **L'ammortamento dei mezzi**, che è una voce di costo vera e non è nel
  registro. Va discussa col commercialista del fondatore prima di inventarne
  una forma.
- **La chiusura fiscale**: questa non lo è, e la schermata deve dirlo. È una
  dichiarazione di completezza dei dati, non un adempimento.

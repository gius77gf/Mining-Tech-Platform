# Checkpoint — 30/07/2026 16:30 UTC

## Task completato
**S12 — i campi interi. E con questo la convenzione sui numeri è CHIUSA**: sei
app, core, campi scritti a mano, campi interi, file delle macchine.

| Commit | Cosa |
|---|---|
| `85d7078` | La virgola non entra più di nascosto nei 50 campi interi delle sette superfici |

## La misura ha smentito la mia ipotesi, e per questo si misura
Nel checkpoint di stamattina avevo scritto: *«forse basta leggere la validità,
perché lo `step` intero rende 1,5 un valore non valido — in quel caso si evita
una modifica molto più grande»*. Misurato in Chromium, en-US e it-IT:

| battuto | `.value` | `checkValidity()` | l'app legge |
|---|---|---|---|
| `1,5` | **`15`** | **true** | 15 |
| `1.500` | `1.500` | false | **1,5** |

Nel primo caso il browser ha già distrutto il numero **e lo dichiara buono**: la
validità non serve a niente. Se avessi seguito l'ipotesi avrei scritto una
guardia che non guarda — cioè la stessa cosa di `run-stile.mjs` che passava
essendo cieco. L'ipotesi era ragionevole e sbagliata, e mezz'ora di misura l'ha
detto prima che diventasse codice.

## La soluzione, e perché non è la conversione
Convertire gli interi a campi di testo, come si è fatto per i decimali, avrebbe
fatto perdere lo **spinner**, che su un numero di fori serve davvero. Quindi si
tiene `type="number"` e si rifiuta il carattere su `beforeinput`, dove è ancora
possibile. La guardia sta in `shared/` una volta sola
(`montaGuardiaInteri`) e le sette superfici la montano.

**Onestà su cosa migliora**, perché è metà del valore: rifiutando la virgola,
«1,5» resta «15» — lo stesso valore che il browser produceva da solo. Il numero
**non migliora**. Migliora che chi scrive lo **sappia** nel momento in cui
succede, invece di non saperlo mai. Dove migliora anche il valore è «1.500», che
l'app leggeva 1,5 e adesso vale 1500.

## Un limite del browser, trovato perché la prova è morta
Su `type="number"` **non esiste il cursore**: `selectionStart` è `null` e
`setSelectionRange` lancia un'eccezione. L'ho scoperto perché la prova si è
fermata lì con un errore, non leggendo la documentazione. Conseguenza concreta:
su un incolla che contiene separatori non si può inserire nel punto giusto, e
allora — se il campo è vuoto si scrive il numero ripulito (il caso normale), se è
pieno si rifiuta e si spiega. **Meglio rifiutare che sovrascrivere** quello che
c'era.

Misurato anche che in un incolla **vero** su un campo number il testo arriva in
`ev.data` e non in `dataTransfer`: la prima versione della prova usava un evento
sintetico in cui mettevo io `data`, cioè **stava provando la propria finzione**.
Adesso incolla per davvero, con la tastiera.

## La verifica è in due parti, perché sono due cose diverse
1. **Il meccanismo**, una volta sola, con tasti veri e la funzione **vera** di
   `shared/` iniettata — non una copia, che proverebbe la copia. 30 asserzioni in
   due locale: virgola rifiutata col messaggio, «1.500» → 1500, incolla ripulito
   a campo vuoto e rifiutato a campo pieno senza perdere il valore, campi
   decimali intoccati, e cifre, cancellazioni e **spinner** che funzionano.
2. **Il montaggio**, su ogni app, aprendo le sei pagine vere: 41 asserzioni.

E qui la trappola di sempre: la prima versione della prova per-app digitava nei
campi e **passava su una lista vuota**, perché quei campi vivono in sezioni non
visibili e `[].every(...)` è `true`. L'ha scoperto la guardia «almeno un campo
provato» che avevo messo apposta. È la terza volta in due giorni che una prova
passa **non guardando niente**, e la difesa funziona solo se la si mette prima.

## Stato
Suite: **60 stile** (erano 52), **283 KPI**, 7 demo, 43 helper, 23 pointcloud,
9 manifest. Tutte verdi.
`run-stile.mjs` ha ora **cinque** regole, e l'intestazione — che diceva ancora
«due regole, per adesso» — le elenca con la ragione di ognuna.

## Prossimo passo atomico
**Rivedere la sezione «Quello che dichiarano i turni» di Terra col metodo del
confronto affiancato, terza iterazione.** La direttiva sull'eccellenza chiede
almeno tre iterazioni e questa sezione ne ha una sola: è nata stamattina, e le
due correzioni che ha già preso («19k» al posto di 19.400, la densità
dall'autorizzazione) sono venute dal **guardare** gli screenshot, non dal
progettarla. Un terzo passaggio troverà altro.

Da guardare in concreto, con la sezione accanto al riferimento:
1. **il caso vuoto**: oggi se Campo non è raggiungibile si vede uno stato vuoto,
   ma non l'ho mai visto renderizzato — va provato mettendo `rapportiniCampo` a
   null nella dimostrazione;
2. **il caso «nessun rilievo»**: la stima corrente scompare del tutto e resta una
   nota. Da guardare a schermo, non nel codice;
3. **il telefono a 390 px**: la tessera «Dichiarato in meno» finisce su una riga
   sua, e va deciso se è giusto così o se le tessere vanno a due;
4. **il confronto col riferimento**: la sezione «Confronto fra due rilievi» che
   sta poco sopra fa una cosa simile e ha tendine per scegliere il periodo. La
   mia non ne ha (usa il periodo naturale). Va deciso se la coerenza fra le due
   sezioni vale più della semplicità — e la risposta va scritta, non lasciata
   implicita.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), e i tre punti che aspettano il fondatore — progetto Firebase (10
minuti), permessi per ruolo, blocco del turno chiuso lato server.

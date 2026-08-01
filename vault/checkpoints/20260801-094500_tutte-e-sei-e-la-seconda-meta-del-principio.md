# Tutte e sei — e la seconda metà del principio

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-091500_l-appello-che-non-si-poteva-vedere.md`

## Chiuso il giro delle sei app

Flotta e Sentinella un caso ciascuna ce l'avevano già in dimostrazione — lo
diceva il censimento dell'unità precedente — quindi qui non si sono aggiunti
dati: si è messo **sotto guardia quello che c'è**, perché se un domani sparisce
dalla demo il banco lo dica invece di restare verde.

- **Flotta**: il costo `c3` senza data («Noleggi esterni · gru mobile 2gg»), che
  resta in lista invece di sparire dal periodo in silenzio;
- **Sentinella**: il punto in programma **mai misurato**.

Il banco copre adesso **tutte e sei le app**: 31 prove, 15 stati.

## ⛔ La seconda metà del principio, che il banco non guardava

La controprova su Sentinella **non ha fatto cadere niente**, e la diagnosi vale
più della correzione. Rimettendo il difetto — il ramo «mai misurato» che scrive
la cifra invece della frase — il banco continuava a dire *ok*, perché la sua
regex accettava **anche il badge** («Mai misurato»), che restava lì.

Cioè il banco garantiva «lo **stato è dichiarato**», mentre il difetto vero è
un'altra cosa, ed è scritta nel commento del modulo:

> «0 µg/m³ / soglia 40» accanto a un badge che dice «Mai misurato». Due frasi
> opposte sulla stessa riga: quella con la cifra è la sola che si guarda.

Dire «non lo so» **e** scrivere accanto un numero che sembra una misura è il
difetto, non la sua assenza. Da qui il campo **`vietato`**: un motivo che nella
riga **non deve** comparire. Su Sentinella è una cifra seguita da «/ soglia».

## ⚠️ E tre inciampi nel farlo, tutti e tre già in `CLAUDE.md`

1. **L'iniezione era puntata nel posto sbagliato** (caso 4 della tassonomia): ho
   modificato il ramo «mai» di `riepilogoAllarmi` (riga 181), mentre la riga che
   si vede in `#all-list` la scrive **`allerteProgramma`** (riga 1122). Il
   difetto era vero e il banco non poteva vederlo perché non passava di lì.
2. **L'iniezione sostitutiva non provava `vietato`**: togliendo la frase, cadeva
   il controllo «non compare», non quello nuovo. Per esercitarlo davvero serve
   un'iniezione **additiva** — la frase resta e la cifra si aggiunge — che è
   esattamente la forma del difetto raccontato dal commento.
3. **Il messaggio di fallimento non conteneva il colpevole**: stampava i primi
   90 caratteri della riga, e l'aggiunta stava oltre. Adesso stampa **quello che
   ha fatto cadere** (`"0 mg/l / soglia"`): un messaggio che non contiene il
   colpevole fa ricominciare la caccia da capo.

⚠️ E un inciampo di processo: un `cp` di ripristino è fallito perché la shell
era rimasta in un'altra cartella, e il modulo di Sentinella è restato **iniettato**
per due comandi. Se ne è accorto il `git status` che faccio dopo ogni
ripristino — non la memoria. Il modulo è verificato pulito, tre volte.

## Verifica

`stati-non-misurati` **31/0** — 15 stati, 6 app. Controprove:
- incorporata (stato inventato): cade;
- Flotta (`c3` riceve una data, +20 caratteri): cade sul caso giusto;
- Sentinella additiva: cade su `vietato`, col colpevole nel messaggio.
Tutti i moduli ripristinati e verificati con `git status` **vuoto**.
Suite: kpi 1117/0, stile 271/0, demo 8/0, sonda-vuoto 7/0, suite-collegate 3/0
(44 file), numeri-nei-documenti 17/0.

## Prossimo passo atomico

La domanda che il banco adesso permette di porre, e che finora non si poteva:
**quali stati «non misurato» esistono nei moduli e non sono in nessuna delle sei
liste del banco?** `sonda-vuoto.mjs` conosce già i «tranquilli» dichiarati e la
regola 20 di `run-stile` conosce le bandiere di non-misurabilità: incrociare
quei due elenchi con i 15 stati del banco dice, per la prima volta con un numero,
**quanta parte del principio è sorvegliata sullo schermo** invece che solo nei
moduli. Da fare a `grep` e da scrivere come misura, non come impressione.

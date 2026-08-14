# Amministrazione: l'invito dice anche **quando** scade

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/admin.html`
**Unità precedente:** `20260801-172000_scudo-la-convenzione-e-il-banco.md`
(commit `64d8a7e`)

## Il difetto, e chi l'ha trovato

Nell'amministrazione, un invito in attesa diceva:

> Ruolo member · scade **tra 11 giorni**

e basta. Il tempo relativo si legge al volo mentre si scorre l'elenco, ma
quando si ha il collega al telefono serve **il giorno** — e «fra 11 giorni»,
letto domani, vuol dire un altro giorno. È il dettaglio 8 di
`docs/RICERCA_VALORE_PRODOTTO_202607.md`, e le sei app lo rispettano da giorni.

⚠️ **L'ha trovato il banco `doppia-data.mjs` alla PRIMA volta che un banco ha
aperto questa pagina.** `id · amministrazione` è entrata nell'elenco delle
superfici stamattina, insieme all'accesso e al profilo: fino a ieri su queste
tre pagine nessun controllo del browser aveva mai misurato niente — non il
contrasto, non gli id doppi, non il fuori-schermo, non i tempi relativi.

Cioè: la regola c'era, il controllo c'era, e la pagina non la guardava nessuno.
È esattamente il buco che ha chiuso la regola 21 di `run-stile.mjs`, e questo è
il primo difetto vero che ne esce.

## Che cosa è stato fatto

Adesso dice:

> Ruolo member · scade tra 11 giorni **(12/08/2026)**

⚠️ E la data si compone dall'orologio **locale**, non da `toISOString()`: a
cavallo della mezzanotte quello scrive il giorno prima. È la regola di
`shared/`, misurata in `docs/RICERCA_GIORNO_LOCALE_202607.md`, e l'ho applicata
qui invece di scrivere la scorciatoia.

Rifatta anche `giorniA`, che aveva il `try/catch` intorno a **tutto** il
calcolo: adesso la lettura della data sta in `quando()` e il caso «data che non
si legge» risponde `—` per una ragione dichiarata, non perché è saltata
un'eccezione.

## Verifica

`doppia-data` su quella superficie: **ok, 0 tempi relativi senza data** (era
l'unica delle 14 a fallire). `fuori-schermo` a 390 e 360: **2 schermate pulite,
0 fuori dallo schermo** — la riga più lunga va a capo e non sfonda niente.
Scatto guardato: il bottone «Revoca» resta al suo posto, la pagina passa da 975
a 987 px.
`run-stile` 274/0.

⚠️ Non ho costruito una controprova apposta: **il difetto vero l'ha fatto
cadere il banco da solo**, prima della correzione. È il caso migliore — meglio
di un difetto rimesso a mano per far fare bella figura al controllo.

## Prossimo passo atomico

Rilanciare il **giro completo** (`tutti.mjs`) su `HEAD`: quello di stamattina
girava su un commit di sei unità fa e l'ho fermato a 14 banchi su 41 (307 prove
passate, un solo KO vero — questo). Il giro nuovo dirà anche se i quattro
banchi mai passati sulle tre superfici nuove trovano altro.

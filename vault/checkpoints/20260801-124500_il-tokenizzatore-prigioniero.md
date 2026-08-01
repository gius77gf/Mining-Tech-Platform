# Il tokenizzatore prigioniero di un `process.exit`

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/tokenizza.mjs` (nuovo)
**Unità precedente:** `20260801-121500_il-23-per-cento-che-avrebbe-mentito.md`

## Come è saltato fuori

La misura nuova elencava «i posti dove il prodotto dice *non lo so* e nessun
banco guarda». In cima: **«non lo so», sei app**. Sono andato a guardarli uno
per uno, come diceva il passo atomico — e in **Conti tutte e cinque le
occorrenze erano commenti**:

```js
// disponibili: «non lo so» e «zero» sono due risposte diverse, e l'app deve
`null` — «non lo so», che è diverso da «zero giorni». */
```

Cioè i punti in cui uno sviluppatore **spiega** il principio, non quelli in cui
il prodotto lo **dice** all'utente. La classifica era una lista di lavoro che
avrebbe mandato la prossima unità a caccia di spiegazioni.

## ⛔ E la funzione giusta esisteva già, chiusa a chiave

`senzaCommenti` fa esattamente quel lavoro — toglie solo i commenti e tiene le
stringhe — ed è **il tokenizzatore che `CLAUDE.md` indica per le regole sui
TESTI**. Stava dentro `run-stile.mjs`, che in fondo chiama `process.exit`:
importarlo avrebbe fatto uscire il processo. Quindi era **prigioniero**, e
chiunque ne avesse avuto bisogno avrebbe dovuto riscriverlo — il difetto che
questo progetto paga più caro.

⚠️ La stessa scansione porta già scritto in testa che *«una regola che serve a
due usi vive in un posto solo»*: era vero **dentro** `run-stile` (una scansione
per due viste) e falso **fuori** (nessun altro poteva raggiungerla).

## Estratto, non riscritto

`tokenizza.mjs`: `classifica`, `mascheraCodice`, `senzaCommenti` e le tre
costanti della scansione. `run-stile.mjs` le importa; la misura pure. Nessuna
seconda copia.

Due cose che il taglio ha sbagliato e che le prove hanno preso subito:

1. `DIALOGHI` era finito nel tokenizzatore: è la regex della **regola** dei
   dialoghi, non dello scanner. Rimessa dove sta la regola.
2. `COMMENTO`/`CODICE`/`DENTRO` servivano ancora a una regola: esportate.

**La verifica è la suite stessa**: `run-stile` **271/0**, cioè le venti regole
che stanno sopra quello scanner si comportano identiche a prima. È il tipo di
refactor che si può fare solo perché quelle prove esistono.

## La controprova che conta, ed è una sola

Rinominata `senzaCommenti` in `tokenizza.mjs`: **cadono tutti e due i
consumatori**, `run-stile` e la misura. È la prova che condividono davvero
un'implementazione sola — se uno dei due avesse tenuto una copia, sarebbe
rimasto verde. Ripristinato, 271/0.

## Che cosa cambia nella misura

Contate solo le frasi che il prodotto **dice**: da 56 a **53** occorrenze, e la
classifica si riordina — «non si sa» passa davanti a «non lo so», e «mai
misurato» scende da tre app a due. Numeri piccoli, ma la lista adesso indica
posti veri.

## Verifica

Suite intere con `TZ=Europe/Rome`: helpers 49/0, kpi **1119/0**, pointcloud
26/0, manifest 9/0, **stile 271/0**, demo 8/0, sonda-vuoto 7/0,
numeri-nei-documenti 17/0, copertura 9 soggetti 0 scoperte, nomi-doppi 0,
date-checkpoint 3/0, suite-collegate 3/0 → **46 file** (il tokenizzatore è
dichiarato col marcatore, non è orfano).

## Prossimo passo atomico

Adesso la lista si può guardare davvero. Le prime due voci — «non si sa» (sei
app) e «non lo so» (cinque) — vanno aperte una per una **nel testo che l'utente
legge**, e per ognuna deciso se è (a) uno stato già sorvegliato dal banco con
altre parole, (b) un testo esplicativo dentro una nota, o (c) uno stato vero
che nessuno guarda. Solo il terzo caso è lavoro; i primi due si dichiarano.

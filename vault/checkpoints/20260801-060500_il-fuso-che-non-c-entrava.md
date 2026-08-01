# Il fuso orario che non c'entrava

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/date-checkpoint.mjs`
**Unità precedente:** `20260801-054500_quattro-su-cinque-non-aspettano-i-dati.md`

## Il sospetto, che era ragionevole

`orologio-cliente.mjs` rilancia tre suite con l'orologio italiano, perché
«un controllo che gira in un ambiente diverso da quello del cliente misura
l'ambiente, non il prodotto». Le altre suite non ci passano — e fra queste
`date-checkpoint.mjs`, scritta poche ore fa, che **confronta una data letta da
git con la data scritta nel nome del file**.

Il sospetto: `git log --date=short` rende la data nel fuso di chi guarda. Allora
lo stesso commit delle 23:30 UTC si legge «oggi» in UTC e «domani» a Roma — e
il controllo darebbe **due risposte diverse sullo stesso repository**, con la CI
(in UTC) che bolla come sbagliato un file nominato correttamente da una sessione
con l'orologio italiano. Cioè il difetto di `CLAUDE.md` applicato a sé stesso.

Ho anche scritto la correzione: fissare `TZ` nella chiamata a git.

## ⛔ Il sospetto era falso, e la correzione era una riga che non fa niente

Misurato prima di lasciarla lì, su uno stesso commit:

| | `--date=short` | `--date=local` |
|---|---|---|
| UTC | 2026-08-01 | Sat Aug 1 **04:18** |
| Asia/Tokyo (+9) | 2026-08-01 | Sat Aug 1 **13:18** |
| Pacific/Kiritimati (+14) | 2026-08-01 | — |

**`--date=short` rende la data nell'offset registrato NEL COMMIT** (qui
`+0000`), non in quello di chi legge. È `--date=local` a seguire il lettore.

E la controprova sui dati veri: confrontando l'elenco completo in UTC e a Tokyo,
**zero** commit su 661 cambiano giorno. La suite dà la stessa risposta in UTC, a
Roma e a Tokyo — 184 su 640, tutte e tre le volte — **e la dava anche prima**
della mia riga.

## Perché ho tolto la correzione invece di lasciarla

Era innocua, e la tentazione di tenerla («male non fa») è esattamente il
problema: sarebbe rimasta lì con accanto **un commento che spiega una trappola
inesistente**. Il codice inutile costa poco; la spiegazione sbagliata costa a
ogni lettore futuro, che ci crede — è la stessa ragione per cui una prova col
nome sbagliato è peggio di nessuna prova.

Al suo posto è rimasta la **misura**, scritta per esteso: così il prossimo che
avrà lo stesso sospetto ragionevole trova la risposta invece di rifare la strada
— e non «corregge» una seconda volta qualcosa che non è rotto.

## È il terzo di stanotte

Tre volte in un ciclo ho creduto di aver trovato un difetto che non c'era:

1. l'**heredoc del canarino** che sembrava non terminare (era la mia
   riproduzione: YAML dedenta il blocco `run:` prima di bash);
2. un **`grep -A 30`** su una lista lunga il doppio, che dava per mancanti due
   banchi presenti;
3. questo **fuso orario**.

Tutte e tre sarebbero finite in un commit come fatti, e tutte e tre sono cadute
allo stesso modo: misurando la cosa vera invece della mia idea della cosa vera.
Vale la pena scriverlo insieme, perché il numero conta: **su una notte, tre**.
La differenza fra un difetto trovato e un difetto immaginato non si vede
dall'interno del ragionamento — si vede solo dalla misura.

## Verifica

`date-checkpoint` **3/0** lanciata in UTC, Europe/Rome e Asia/Tokyo: stesso
risultato (661 checkpoint letti, 640 precedenti alla regola, 184 datati avanti).
Nessuna `TZ` fissata nel file: verificato che la stringa non c'è più.

## Prossimo passo atomico

Invariato, e aspetta la CPU: lo **scatto delle cinque righe nuove di Scudo**,
poi la **pagina di stampa del riepilogo annuale di Terra**. Il giro del browser
è oltre le 326 asserzioni, senza nessun KO fuori dalle sezioni di controprova.

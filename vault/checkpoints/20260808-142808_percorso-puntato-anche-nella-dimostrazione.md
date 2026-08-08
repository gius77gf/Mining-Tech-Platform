# Checkpoint — 2026-08-08 14:28 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`af0b903` — fix(shared): il percorso puntato vale anche nella dimostrazione

## Che cosa è stato completato
Il **primo passo della 5b dopo la misura**, e non è quello che sembrava.

La misura dice che la cura contro la spunta persa è il **percorso puntato**
(`"esiti.dpi"`). Ma il livello dati di ogni app ha **due strade**: Firestore
col login, e un elenco in memoria per la dimostrazione — e quella in memoria fa
`Object.assign`, che di una chiave `"esiti.dpi"` crea una proprietà
**letterale col punto dentro**. Misurato:
`{"esiti":{"dpi":false},"esiti.dpi":true}`. Nessun errore da leggere, la
spunta non si vede.

⛔ Cioè: applicando la cura ai dodici punti **prima** di questo passo, i dati
veri sarebbero andati bene e la **dimostrazione si sarebbe rotta in silenzio** —
proprio la cosa che il fondatore mostra. È il passo che rende possibile tutto il
resto, e per questo viene prima.

`applicaPercorsi` sta in `shared/dw-ponti.js` (serve a tutte e sei: una
regola scritta sei volte diverge sei volte), e le sei dimostrazioni ora la usano.

## Verifiche — due guardie, tutt'e due controprovate sui file veri
- **la funzione**: 11 casi, compresi i rami assenti/`null`/scalari/array che si
  aprono come fa Firestore, e un `null` **dichiarato** che si scrive (è la
  convenzione «non si può calcolare», non un'assenza). Rimettendo il
  comportamento vecchio → **cade**;
- **il collegamento**: *una guardia scollegata non protegge niente*, quindi si
  controlla che tutte e sei le dimostrazioni ci passino davvero. Rimettendo
  `Object.assign` in **una sola** app → **cade e la nomina**;
- `run-kpi` **1899 → 1902**; giro `node` **27/27** sul disco e sulla copia di
  ciò che si committava (patch identica).

## ⚠️ Il piano è stato CORRETTO dopo aver aperto i dodici punti
La prima stesura diceva «una riga per punto» e «`arrayUnion` dove si aggiunge
in coda». **Falso per otto di essi**, e sta scritto nel documento perché nessuno
ci riprovi alla cieca:
- gli **elenchi** non li salva `arrayUnion` — un sito **corregge** una lettura
  già dentro (l'indice di un array non si scrive col percorso puntato), uno
  aggiunge **e taglia** a `MAX_LETTURE`, uno è un **import in blocco**: lì
  serve una **transazione**;
- gli **oggetti di Scudo** non sono «una riga»: sanno anche **togliere** una
  voce, e cancellare col percorso puntato vuole `deleteField()`, cioè un
  **contrassegno** che il livello dati traduca;
- `atmosfera` non è nemmeno il caso della spunta persa: è un modulo inviato
  intero, quindi un conflitto sullo **stesso campo**.

⚠️ Corretto per strada un mio errore nei documenti: `applicaPercorsi` sta in
`shared/`, quindi entra nei **137** condivisi e **non** nei 710 delle sei app.

## Prossimo passo atomico
**Il contrassegno di cancellazione**, che è il pezzo che sblocca i tre punti a
oggetto: un valore riconoscibile (es. `DW_CANCELLA`) che il livello Firestore
traduce in `deleteField()` e quello in memoria in `delete`. Poi i tre punti
(Scudo `esiti` ×2, Campo `esiti`) passano al percorso puntato.
⛔ Gli **elenchi** vengono dopo e vogliono `runTransaction`, non `arrayUnion`.
⛔ La **coda offline** viene per ultima: metterla prima moltiplicherebbe il
problema invece di risolverlo.

⏳ E resta da raccogliere il **giro del browser** (PID 16670, ~2h51), registro in
`scratchpad/nomi4/giro-nuovo.txt`: `leggi-giro.mjs`, sezione 1 prima della 2.
⚠️ Attesta `c3888fe`. ⚠️ Il rosso di una controprova è il verde del banco.

## Blocchi
Nessuno.

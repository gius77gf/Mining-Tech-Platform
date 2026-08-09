# Checkpoint — 2026-08-09T15:44:33Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`07bd2c4`

## Task completato

**Tre cantieri paralleli su tre app diverse, e il filo che hanno tirato: quali
numeri nessun controllo raggiunge.**

| | |
|---|---|
| Genesi (B3, seconda fetta) | `computeMIC` → `micFinestra`, **1979 → 1984** prove |
| Campo + Terra (direttiva 7) | **39** verifiche rilanciate, **1** verdetto cambiato, **10** prove riscritte |
| arretrato dei documenti del delta | **0 su sei**, per la prima volta |
| numeri sorvegliati | 2.431 → **2.436**, scadute 13 → **14** |
| numeri **non** sorvegliati, trovati e chiusi | **4** |

## Le tre cose imparate

1. ⛔ **UNA SCOMPOSIZIONE CHE TORNA CON SÉ STESSA PUÒ ESSERE FALSA LO STESSO.**
   `docs/DEVELOPMENT.md` dichiarava «104 prove: 75 regole, 19 SDK, 10 primo
   avvio». **75 + 19 + 10 fa esattamente 104**, quindi ogni controllo sulla
   somma diceva ✓ — e l'addendo era sbagliato: `run-bootstrap.mjs` è tornato da
   10 a 8 l'08/08, e `STATO_PRODOTTO.md` scriveva **8** spiegandone pure la
   ragione. Due documenti in disaccordo sullo stesso numero, **nessuno dei due
   fuori posto per la somma**. Il vero, lanciando il comando: **102**.
   La distinzione da tenere: `addendiTornano` e `sommaScrittaTorna` dimostrano
   la **coerenza**, che è una domanda diversa dalla **verità**. La prova nuova
   non somma niente — va a **contare i soggetti veri** nelle suite.
2. ⛔ **E IL RIGHELLO CHE HO SCRITTO PER MISURARE ERA SBAGLIATO, NELLA FAMIGLIA
   CENSITA IL GIORNO PRIMA.** Fatto stampare a `giro-node` quante asserzioni
   esegue, il primo conto ha detto **4741**. Il vero è **2757**: cercava il
   primo «N passati» dell'uscita di ogni comando, e `orologio-cliente.mjs`
   **rilancia tre suite in ora italiana stampandone i riepiloghi** — quindi si
   riprendeva il «1984 passati» di `run-kpi` una seconda volta. **Gonfiato del
   72% da un comando solo**, ed è alla lettera «una RIPETIZIONE contata come
   roba nuova», la stessa del riepilogo del giro del browser.
   ⚠️ **L'ha presa solo il confronto fra due righelli indipendenti** (il mio, e
   la somma delle ultime righe del registro). Un totale da solo non l'avrebbe
   mai detto — che è la ragione per cui in questa casa si stampa la
   scomposizione. La forma che regge: si legge **l'ultima riga**, cioè il
   verdetto che il comando dà **di sé**; le righe che ripete di altri stanno in
   mezzo e non contano **per costruzione**, non per un elenco di eccezioni.
3. ⛔ **UN DOCUMENTO CHE PROPONE UN LAVORO GIÀ FATTO LO FA RINASCERE.**
   `docs/PIANO_GENESI_MODULO_DATI.md` aveva **quattro numeri su quattro**
   invecchiati, e il quarto era falso **nella sostanza**: «di Genesi entra nelle
   suite solo `pointcloud.js` — 5 funzioni», mentre `genesi-data.js` ne ha 40
   coperte e `genesi-formato.js` 8. Chi lo apriva poteva mettersi a costruire
   quello che esiste. La causa non è la distrazione di nessuno: **quel documento
   non era nell'elenco di nessun controllo**, e lo stesso numero sorvegliato
   altrove non può marcire di un'unità senza far cadere la CI.

## Provata e SCARTATA col numero, perché nessuno la rifaccia
Una regola che segnali **ogni documento fuori dall'elenco che cita un totale di
prove**: censiti tutti i «N prove» nei `.md` tracciati (esclusi i checkpoint,
storia congelata per disegno) → **10 soggetti, 6 sono racconto storico**, 2
guardati, 2 vivi e scoperti. Sbaglierebbe **sei volte su dieci**, e a separare
le storiche dalle vive sarebbero il **tempo verbale** e la **citazione**, che
`CLAUDE.md` ha già misurato come inseparabili dal vocabolario. Quindi niente
regola: i due casi vivi sono corretti a mano, e il più grosso porta scritta
accanto **la ragione per cui è potuto marcire di 871** senza che niente
diventasse rosso.

## Il difetto di prodotto trovato e NON corretto
⛔ `computeMIC()` su un progetto **senza fori disegnati** risponde la carica di
**un** foro: il valore più basso possibile, cioè la PPV più tranquilla — **3,28
contro 23,95 mm/s, 7,3 volte più bassa** (rimisurato da me, non riferito). Otto
chiamate a `computeKPI()` non generano la maglia prima. È «l'assenza di un dato
non è un dato favorevole» sul numero con cui si decide se una volata si può
sparare. La prova nuova intanto lo **fissa e lo nomina**; la cura è un cantiere
a sé, **aperto adesso**.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato, due
  volte (una per commit)
- `numeri-nei-documenti` **34/0**, `documenti-invecchiati` **15/0 con arretrato
  0**, `sintassi-pagine` **34/0**, `sonda-vuoto` **15/0**, `nomi-liberi` **24/0**
- controprova sul file vero: col difetto rimesso il controllo nuovo **nomina
  l'addendo**; ripristinato **da una copia** con `diff -q` pulito
- le misure dei tre cantieri **rimisurate da me** prima di entrare:
  `micFinestra([], 60)` = 60, 12 fori = 720, rapporto **7,30**, `t0+8` nella
  pagina **0 volte**
- il letterale «157» dentro `documenti-invecchiati` adesso è **contato**: 148

## Il giro del browser
Vivo dalle **13:03:34Z** su una copia di `c6694e7`, **2h35** quando scrivo, e
sta ancora scrivendo (319 KB, verificato guardando il figlio vivo). ⚠️ Attesta
**161** banchi: `--modali` e `--forzate` non ci sono, e la loro assenza **non
va letta come «il buco è aperto»**.
⚠️ Il KO `dw-doppione` che si legge nel registro è **dentro una controprova
dichiarata**: rosso VOLUTO, nessun cantiere da aprire.

## Cantieri paralleli aperti
Tre, su file indipendenti, nessuno dei quali committa: **Genesi** (`micFinestra`
che risponde «non calcolabile» invece di un numero tranquillo, con i lettori
che lo sanno leggere), **Scudo** (`#vf-esito`, 201,9 px in 196 a 320) e
**contrasto delle finestre a 390 e 320 px**.

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **rimisurare** ciò che riferiscono e committare io.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11); **quali** delle 47
mancanze confermate diventino lavoro; e se `disponibilitaTurno` debba restare
**100%** su un turno chiuso in cui nessuno ha registrato fermi.

# Checkpoint — 2026-08-03 13:22:40 UTC

## Tipo
unit-complete (tre unità: il tasso di mora scaduto, la scheda smentita, i nomi liberi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1cd1c73` — *Cinque funzioni chiamate che non esistevano, e quattro erano
messaggi d'errore*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 46 | **il tasso di mora scaduto** (`898b454`) | scaduto da **34 giorni**, e la lettera lo citava come vigente |
| 47 | **la scheda sulle norme smentita** (`19098db`) | **tre** affermazioni su tre false, in una sezione sola |
| 48 | **i nomi chiamati che non esistono** (`1cd1c73`) | **5** su 18.041 chiamate, e 4 erano messaggi d'errore |

## ⛔ Il filo di queste tre, ed è una catena
1. La ricerca sulle norme dichiarava «IMPRECISA» la riga della mora di Conti
   perché «il tasso varia mensile». **Falso**: varia per **semestre**, e il
   modulo lo dichiarava già dodici righe sopra il punto citato. Verificando per
   **smentire** è saltato fuori il difetto vero e più grave: il tasso di legge
   era **scaduto il 30 giugno** e il 3 agosto sollecito ed estratto conto lo
   scrivevano ancora come se fosse in vigore. Non un errore di calcolo: un
   numero che **era vero** e a cui nessuno aveva messo una scadenza.
   ⚠️ La correzione **non inventa** il tasso del semestre in corso: quello lo
   pubblica il MEF e non ce l'abbiamo. La lettera dichiara a quale semestre
   appartiene quello che sta usando.
2. La stessa scheda aveva altri due errori, e il terzo è il pericoloso: diceva
   che le spese di recupero hanno scaglioni «€ 40 fino a 1.000, € 70 oltre» —
   **non esistono** nel D.Lgs 231/2002, che prevede un forfait unico di € 40,
   cioè esattamente quello che l'app fa. Correggere su quella riga avrebbe
   **introdotto** un errore in un documento che il cliente manda a un cliente.
   ⛔ Per questo la riga sul **DUVRI** resta **ferma**: non perché sia sbagliata
   — non lo so — ma perché è una citazione normativa in un software venduto e
   la scheda che la propone ha appena sbagliato tre volte. Va alla fonte
   primaria e al fondatore col suo RSPP.
3. Scrivendo la correzione ho fatto **l'errore che questo repository documenta
   da tre volte**: `numeroIt(...)` in Conti, un nome che non esiste in nessun
   file. Da lì `tests/nomi-liberi.mjs`, che alla prima esecuzione ha trovato
   **cinque** chiamate a nomi inesistenti — e **quattro su cinque stavano su un
   percorso d'errore**: «Cliente non eliminabile», «Data non valida», «Manca la
   data», «C'è già un fermo aperto». I messaggi che spiegano cosa non va
   lanciavano un ReferenceError invece di comparire.

`avvisa` e `mostraTesto` sono state scritte in **`shared/dw-app-ui.js`** perché
servono a due app: così le chiamate esistenti diventano giuste **senza toccare
una riga** di Conti e Flotta — erano corrette nell'intenzione, mancava la
funzione.

## ⚠️ Due volte lo stesso inciampo, e vale la pena scriverlo
- La prima stesura di `nomi-liberi` rispondeva **«0 chiamate guardate»**:
  `mascheraCodice` restituisce una **maschera** (`Uint8Array`), non una stringa.
  Il numero stampato è la ragione per cui l'ho visto.
- La prima stesura della banda di prove per la mora aggiungeva **zero** prove:
  usava `eq()` a livello di blocco invece che dentro `test()`, e il totale
  restava fermo con «0 falliti». L'ha presa la regola scritta in CLAUDE.md —
  *si controlla che il totale sia SALITO*.
Sono la stessa cosa in due vesti: **un controllo che non ha guardato niente
risponde esattamente come uno che ha guardato tutto.**

## Stato delle prove
Prove **2.060** senza rete (run-kpi 1661, stile 287), copertura **649/649**,
banchi 77, suite `node` **21 comandi** (una in più: `nomi-liberi`, registrata in
`scripts.test` così gira anche in CI). Giro `node` verde sulla copia di ciò che
si committa, a ogni commit.

## Che cosa sta girando adesso
- **il giro completo del browser** (`scratchpad/capo/giro5.txt`), su una copia
  di `f274e91`: gira da oltre un'ora ed è il primo dopo le tre correzioni al
  banco del contrasto;
- **tre cantieri**: **core**, **Genesi**, **Flotta+Sentinella** (i fogli
  stampati). ⚠️ Genesi sta scrivendo in **`shared/deepwork-id-client/dw-shell.js`**
  (`misureFrammentazione`, `riservaFrammentazione`): al momento `copertura-funzioni`
  è rosso **per il suo lavoro in volo**, non per un difetto — le prove non sono
  ancora arrivate. Va raccolto con la solita procedura.

## Prossimo passo atomico
1. Leggere `giro5.txt` (cerca `USCITA=`) quando finisce.
2. Raccogliere i tre cantieri, **app per app**: indice costruito da `HEAD`
   tagliando la banda dell'app, worktree **ricreata**, numeri di `docs/` riletti
   **dalla copia**. Il cantiere Flotta+Sentinella ha il mandato di tenere due
   bande separate: vanno in **due commit**.
3. Poi: le tre proposte della ricerca su Scudo (ora di segnalazione distinta
   dalla data evento, gravità potenziale, scadenza della comunicazione INAIL),
   **rimisurate una per una** — dopo oggi, quella scheda parte con poco credito.

## Code aperte, dichiarate
Immutate, più le quattro decisioni di prodotto del near-miss e la riga DUVRI da
portare al fondatore col suo RSPP. Le **19 decisioni** procedono **venerdì
07/08** se non arriva risposta, e vanno dichiarate nel commit.

## Blocchi
Nessuno.

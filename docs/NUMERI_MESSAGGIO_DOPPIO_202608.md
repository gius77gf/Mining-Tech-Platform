# La frase che dice «questo numero non l'ho capito» è scritta due volte

*Trovato il 02/08 chiudendo la copertura di Flotta. Misurato, non dedotto.*

## Il fatto

`messaggioNumero` — la funzione che scrive all'utente perché un numero non
è stato accettato — esiste in **due posti**:

- `shared/deepwork-id-client/dw-shell.js` (esportata, usata dalle app che
  importano lo shell);
- `apps/flotta/flotta-data.js` (una seconda implementazione completa).

E la frase fissa `AVVISO_DECIMALE` è **ridichiarata alla lettera in quattro
moduli**: `conti`, `flotta`, `sentinella`, `terra` — mentre nello shell la
stessa stringa vive come costante privata `NUM_AVVISO_DEC`.

È esattamente il difetto che `CLAUDE.md` descrive come costato «una
giornata intera con la convenzione sui numeri, finita scritta quattro volte
con tre comportamenti diversi». Non è tornato: **non era mai finito**.

## Quanto divergono davvero

Dieci casi provati facendo scrivere a tutt'e due la frase per lo stesso
risultato di lettura. **Tre messaggi su dieci sono diversi**, e le
differenze non si compensano: **ognuna delle due versioni è migliore
dell'altra in un punto**.

### 1. L'ambiguo — il caso per cui la funzione esiste

| | frase finale |
|---|---|
| shared | «…non voglio indovinare al posto tuo. **Scrivilo senza il punto delle migliaia.**» |
| Flotta | «…non voglio indovinare al posto tuo. **Scrivilo senza il punto delle migliaia: «1250», non «1.250».**» |

Quella di **Flotta è migliore**: dice *come* si scrive, con l'esempio. La
frase dello shell dice cosa non fare e lascia il lettore a indovinare la
forma giusta — su un campo dove l'app ha appena dichiarato di non voler
indovinare.

### 2. Uno zero scritto davvero

| | frase |
|---|---|
| shared | «Serve un numero maggiore di zero per le ore: hai scritto **«0»**.» |
| Flotta | «Serve un numero maggiore di zero per le ore: hai scritto **«»**.» |

Quella dello **shared è giusta**. Flotta usa `String((r && r.grezzo) || "")`,
e `0 || ""` è `""`: l'utente ha scritto uno zero e l'app gli risponde che
non ha scritto niente. È il solito `+null === 0` visto dall'altro verso —
un valore falso trattato come assente.

## Perché conta, in una riga

Due implementazioni della stessa frase significano che **la stessa cosa
sbagliata scritta in due schermate riceve due spiegazioni diverse**. E
quando una delle due viene migliorata — com'è successo qui, in tutt'e due i
sensi — la seconda resta indietro senza che nessuno se ne accorga, perché
niente le confronta.

## La correzione

Quella che `CLAUDE.md` prescrive, e per lo stesso motivo:

1. **una sola implementazione**, nello shell. Con dentro il **meglio delle
   due**: la frase dell'ambiguo di Flotta (con l'esempio) e il `!= null` di
   shared (lo zero che si vede);
2. `AVVISO_DECIMALE` e `AVVISO_MIGLIAIA` **esportati dallo shell**;
3. le app **ri-esportano** col nome con cui le hanno sempre chiamate —
   `export { messaggioNumero, AVVISO_DECIMALE } from …`. Un alias non è una
   seconda implementazione, e le pagine non cambiano una riga;
4. la prova pretende l'**identità** (`flotta.messaggioNumero ===
   shell.messaggioNumero`), non il comportamento: due copie uguali oggi
   divergono domani senza che nessuno lo veda. È già successo — e questo
   documento ne è la misura.

## Stato — ✅ FATTO il 02/08

Applicata appena il giro del browser è finito (**19 banchi a posto, 0 da
guardare**), come previsto: modificare i moduli mentre un banco apre le
pagine falsifica il banco.

- una sola `messaggioNumero`, nello shell, col **meglio delle due**: la frase
  dell'ambiguo con l'esempio dentro (era di Flotta) e lo zero che si vede (era
  dello shell);
- `AVVISO_DECIMALE` e `AVVISO_MIGLIAIA` **esportati dallo shell**; le quattro
  app li **ri-esportano** col nome di sempre — le pagine non cambiano una riga;
- le prove pretendono l'**identità** (`flotta.messaggioNumero ===
  shell.messaggioNumero`), non il comportamento;
- e il controllo `nomi-doppi.mjs` adesso lo verifica da solo, in coda alla CI:
  **12 nomi guardati, 4 alias, 5 divergenze dichiarate, 0 da sistemare**.

Nella stessa passata sono andate in `shared/` anche `dataPiuGiorni` (che era
scritta identica in Scudo e Sentinella e **si era già staccata** sul caso
d'errore, `null` contro `""`) e `giorni`, che è tornato a essere un alias di
`giorniTra`. `dataPiuGiorni` ne è uscita anche **irrigidita**: `Number(null)` è
0, quindi «nessun numero di giorni» diventava «scade oggi» — in tutt'e due le
copie, e chiuderla in un posto solo l'ha chiusa in tutt'e due.

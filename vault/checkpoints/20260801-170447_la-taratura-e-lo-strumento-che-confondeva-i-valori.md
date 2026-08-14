# La taratura dello strumento, e lo strumento di prova che confondeva i valori

**Data:** 01/08/2026 · **Area:** `apps/sentinella`, `apps/scudo`, `apps/terra`,
`apps/deepwork-id/tests`, `docs/CONCORRENTI_*`
**Unità precedente:** `20260801-211500_non-ce-va-provato-non-dichiarato.md`
(commit `73a03b0`)
**Commit di questo blocco:** `76e7937`, `6a971ff`, `e5f15a7`, `f3432f4`, `c9fe7cf`

## Quattro cantieri insieme, come pretende la regola

Tre agenti in parallelo (Scudo, Terra, verifica del delta) più il mio
cantiere. Nessun conflitto: file separati, e l'unico file conteso —
`run-kpi.mjs` — si è retto perché ogni cantiere si è ancorato a un commento
suo.

## 1. Sentinella — la taratura dello strumento

Il report va all'ente e dice «conforme» sulla base di numeri scritti da uno
strumento. Se quello strumento non era tarato, il numero non vale — e il
prodotto **non sapeva nemmeno la domanda**. È il principio del fondatore in un
punto nuovo.

**La domanda giusta non è «è tarato oggi?», è «era tarato quel giorno?»** Una
lettura di marzo non è coperta dal certificato di aprile, nemmeno se oggi lo
strumento è in regola. Quindi si tiene lo **storico** dei certificati.

E **«non coperta» si divide in due**, perché non si dicono allo stesso modo:
*scoperta* (certificato scaduto o buco fra due tarature — problema vero) e
*prima-dello-storico* (la lettura precede la prima taratura registrata: lo
strumento poteva essere tarato, qui non risulta). Schiacciare le due avrebbe
accusato chi compila di una cosa non misurata: **l'errore opposto** a quello
che l'unità corregge.

La dichiarazione sta **accanto** all'esito, non dentro: «hanno superato la
soglia?» e «di chi erano quelle misure?» sono due domande diverse, e una prova
lo blinda — aggiungere un certificato non muove l'esito.

Lo stato di oggi lo dice `statoScadenzaHSE` di `shared/dw-ponti.js`, che già
serve Scudo e Campo. Nessuna quarta copia.

## 2. Il difetto trovato guardando lo scatto, non il codice

**Il campo che si allunga da solo.** `.flab` porta `flex:1 1 120px`. Dentro
`.frow` quel 120px è una base **orizzontale** («largo almeno 120»); dentro
`.form.col` è **verticale** («alto 120»). Tre etichette di Sentinella erano
alte 120 px invece dei 63 del contenuto: **57 px di vuoto** sotto il campo,
invisibile leggendo il codice. Corretto e rimisurato: 3 su 3.

⚠️ Lo stesso `flex:1 1 120px` sta anche in **Conti, Flotta, Scudo e Terra**:
là va fatto con i loro scatti accanto, non a scatola chiusa.

**E il banco non aveva navigato.** Passavo `'mon'`/`'rep'` a `vaiA`, che vuole
l'**id del bottone** (`nav-mon`). Il click falliva in silenzio e i due scatti
erano tutt'e due il Quadro. È la stessa famiglia di `vaiA` con due argomenti,
in una forma nuova: l'argomento c'è ma non è un selettore. Adesso la sonda
pretende di sapere **quale `.page` è visibile** prima di scattare.

## 3. Scudo — l'andamento degli indici

I tre indici c'erano già (la riga del delta era **falsa**); mancava
l'andamento. Serie **annuale** e non mensile perché le ore si registrano per
anno: un andamento mensile avrebbe ore spalmate a occhio.

Quattro volte il principio: anno senza ore = **buco `null`**, mai zero; gli
anni con infortuni e senza ore si nominano; due `oreAnno` in conflitto non si
risolvono in silenzio; con pochi eventi il verso **non dice «migliora»**.

## 4. Terra — il volume banco per banco

**Il lavoro è stato non scrivere un campo.** La catena `rilievo.fronteId →
fronte.banco` era già completa: aggiungere `banco` al rilievo sarebbe stata una
seconda scrittura dello stesso fatto. Un banco senza rilievi risponde `null` +
`misurabile: false`, mai `0 m³`, e nel CSV la cella resta **vuota**.

Il prezzo è dichiarato: il banco è attributo del fronte *oggi*, quindi se un
fronte cambia banco i suoi rilievi passati si spostano con lui. Il rimedio non
è duplicare il campo: è **datare il legame**.

## 5. La verifica del delta, chiusa su tutte e sei le app

| app | righe | assenti | **false** | a metà |
|---|---|---|---|---|
| Scudo | 16 | 10 | 2 | 4 |
| Sentinella | 22 | 18 | 4 | 0 |
| Terra | 11 | 6 | 2 | 3 |
| Campo | 22 | 13 | 2 | 7 |
| Conti | 18 | 11 | **5** | 2 |
| Flotta | 16 | 5 | 3 | 8 |
| **totale** | **105** | **63** | **18** | **24** |

**Una mancanza dichiarata su sei non esiste**, e va peggio dove il codice è più
maturo: in Conti una riga su tre e mezzo era falsa. Le note di credito, la
gestione guasti, l'aging col fido, la previsione dei giorni: tutte date per
mancanti, tutte già costruite.

## 6. ⛔ Lo strumento di prova che confondeva i valori

Il risultato più importante del blocco, e non è di prodotto.

`eq` confrontava con `JSON.stringify`, che **appiattisce cinque coppie**:
`Infinity`, `-Infinity`, `NaN` e `null` si scrivono tutti `"null"`; `-0` come
`0`; `{a:undefined}` come `{}`.

Non conta il numero, conta **dove cadono**: `null` è la convenzione con cui
l'ecosistema dice «non si può calcolare» — il principio del fondatore. Il buco
stava sotto le prove che difendono quel principio, **e proprio sul valore che
il difetto produce**: `Infinity` è quello che esce da una divisione per zero.

È saltato fuori perché una controprova rispondeva «non distingue» **pur avendo
il difetto rimesso dentro**. Non era la prova scritta male: era lo strumento
sotto. Stessa famiglia della scansione di `run-stile` che perdeva la fase.

**Il risultato onesto**: con il confronto stretto la suite resta verde. I 253
`eq(..., null)` erano tutti `null` davvero. Il buco c'era e non aveva ancora
nascosto niente — ha morso una prova **nuova**, mentre la si scriveva.

## Verifica

`run-kpi` **1162/0** (era 1125), `run-stile` 274/0, `run-helpers` 49/0,
`run-pointcloud` 26/0, `run-manifest` 9/0, `run-demo` 8/0, `sonda-vuoto` 7/0,
`copertura-funzioni` **474/474**, `numeri-nei-documenti` 17/0, `nomi-doppi` 0 da
sistemare. Tutto anche con `TZ=Europe/Rome`.

Controprove: 4 iniezioni su Sentinella (5/2/1/2 prove cadute), 8 su Scudo, 5 su
Terra, 1 sull'harness (4 su 5 cadute, e la quinta deve restare verde).

## Prossimo passo atomico

Raccogliere i tre cantieri aperti (Campo — ponte anomalia→azione correttiva;
Conti — abbinamento dei movimenti bancari; Flotta — che cosa succede davvero
senza rete) e, per Flotta, **decidere sulla persistenza offline dell'SDK**: è in
`shared/`, tocca tutte e sei le app, e va applicata da chi serializza — non
dall'agente. Prima di applicarla va misurato il fatto: il core la persistenza ce
l'ha e le app no, e il commento in `sw.js:66` dice il contrario.

# Il punto cieco della barra, e le regole nuove del ciclo

**Data:** 01/08/2026 · **Area:** `CLAUDE.md`,
`apps/deepwork-id/tests/browser/barra-etichette.mjs`, `docs/E8_LE_PAGINE_AFFIANCATE.md`
**Unità precedente:** `20260801-183000_un-nome-solo-per-la-riga-che-si-tocca.md`
(commit `2d7dade`)

## Due cose, e stanno insieme

**1. Sei regole nuove in `CLAUDE.md`** su come si spende il tempo di un ciclo,
tutte nate da una giornata storta e tutte con la misura accanto invece che con
un consiglio. La prima è quella che conta:

| giorno | modifiche | come si è lavorato |
|---|---|---|
| 30/07 | **241** | cantieri in parallelo, un agente per app |
| 31/07 | **258** | idem |
| 01/08 | **92** | **tutto in fila, zero agenti** |

La direttiva sui cantieri paralleli c'era già, scritta al modo gentile, e si è
saltata. Adesso è vincolante: **almeno tre cantieri insieme per blocco**.
Le altre cinque: verifica a scaglioni (`node` sempre, banco mirato sempre, giro
completo **una volta per blocco**), il giro si lancia **dopo** il commit, mai
aspettare guardando (e l'attesa scritta con `pgrep -f` trova sé stessa), gli
strumenti di misura vivono nei test, e la **ricerca che gira di fianco** con
agenti `haiku` — direttiva del fondatore, con cinque vincoli perché produca
candidati e non elenchi generici.

**2. Un punto cieco vero**, trovato mentre cercavo il controllo giusto per E8.

## ⛔ Cinque versioni dello stesso banco, e l'errore era sempre lo stesso

Volevo controllare «l'etichetta della barra in basso esce dalla sua colonna?».
La risposta era sempre **no**, e per quattro volte il torto era del rilevatore:

1. larghezza da un `Range` e righe = altezza ÷ corpo → «**tutte** vanno a capo»;
2. `Range.getClientRects().length` → «sei voci di Sentinella vanno a capo», e
   **lo scatto della barra le mostra su una riga sola**;
3. `white-space:nowrap` sul «figlio che non è l'icona» — che **non esiste**:
   l'etichetta è un *nodo di testo*, e il ripiego misurava il bottone intero;
4. avvolto il nodo di testo e confrontato con la colonna → 0 fuori posto **e la
   controprova incapace di fallire**.

Il difetto comune: **calcolare una cosa che il browser sa dire**. Ed è per
questo che è diventato una regola.

La quarta versione ha dato la risposta, misurando *perché* non riusciva a
fallire: gonfiando l'etichetta **la colonna cresce con lei** (48 → 56 px).
L'etichetta non può essere tagliata: la domanda era mal posta.

## Il punto cieco

**Quello che cede è la barra.** Con l'etichetta a 11 px, Sentinella ha
**431 px di contenuto in 344 px di barra** — e siccome `.nav` ha
`overflow:hidden`, le ultime voci spariscono **in silenzio**.

- la pagina resta larga 360 → `fuori-schermo` non se ne accorge;
- la regola 19 conta le colonne, non le misura;
- nessun altro banco guardava lì.

Adesso c'è `browser/barra-etichette.mjs`, che pone l'unica domanda senza
ambiguità — *il contenuto della barra sta dentro la barra?* — su tutte le
superfici e a due larghezze, con `--solo=` perché la verifica costi secondi.

## Verifica

Banco provato **nei due versi** su Sentinella: pulito com'è, e con l'etichetta
a 11 px vede il difetto (2 barre fuori posto). `run-stile` 274/0,
`numeri-nei-documenti` 17/0 (**43 banchi**, erano 41).

## La ricerca di fianco è partita

Sei agenti `haiku`, uno per app. Il primo (Campo) ha risposto con **9
candidati**, e — soprattutto — ha dichiarato che **tutte e 20** le proposte
della ricerca precedente **esistono già**: il vincolo «leggi prima di proporre»
ha fatto esattamente il suo lavoro.

⚠️ Nessuno di quei candidati entra in roadmap sulla parola dell'agente: si
rimisura prima. Il primo da verificare è «disponibilità al 100% quando non è
stato registrato nessun fermo», che se confermato è il principio del fondatore
in un punto nuovo.

## Prossimo passo atomico

Verificare di persona il primo candidato di Campo (la disponibilità al 100%
senza misura): aprire la pagina, misurare, e se è vero correggerlo con la sua
prova. Nel frattempo raccogliere le altre cinque ricerche a fine blocco.

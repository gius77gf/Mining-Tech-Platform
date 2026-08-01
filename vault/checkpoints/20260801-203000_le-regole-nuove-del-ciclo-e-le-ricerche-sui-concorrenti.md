# Le regole nuove del ciclo, e le ricerche sui concorrenti

**Data:** 01/08/2026 · **Area:** `CLAUDE.md`, `docs/CONCORRENTI_*.md`,
`apps/flotta`, `apps/campo`
**Unità precedente:** `20260801-193000_il-punto-cieco-della-barra-e-le-regole-del-ciclo.md`

## Il blocco in breve

Un blocco di **metodo** più che di prodotto, chiesto dal fondatore
(«la scorsa settimana abbiamo lavorato bene, questa dobbiamo lavorare meglio»),
e due unità di prodotto uscite dal metodo nuovo.

## Le sei regole, con il numero che le ha fatte scrivere

| giorno | modifiche | come si è lavorato |
|---|---|---|
| 30/07 | **241** | cantieri paralleli |
| 31/07 | **258** | cantieri paralleli |
| 01/08 | **92** | tutto in fila |

Da lì: cantieri paralleli **vincolanti**, verifica a scaglioni, il giro dopo il
commit, mai aspettare guardando, gli strumenti di misura nei test. Più la
**ricerca che gira di fianco**, direttiva del fondatore, con cinque vincoli.

⛔ E la sua correzione, arrivata subito dopo la prima tornata: **mirata, non a
caso, e a indirizzarla è chi lavora**. Con la lista dichiarata di dove si è
carenti — il mestiere della cava, i concorrenti di cinque app su sei, le norme
citate ma non lette, le parole del mestiere.

## Le due unità di prodotto, e perché la verifica serve

**Campo — un turno ancora aperto non prende il verde.** Candidato della ricerca,
rimisurato: l'agente diceva «il numero è tranquillo», la misura ha detto che
`disponibilitaTurno` **non sapeva nemmeno se il turno fosse chiuso**. I fermi si
registrano *durante* il turno, quindi «100%» su un turno aperto vuol dire
«finora nessuno ha scritto niente». `provvisorio` con tre valori — il terzo è
`null`, «non lo so», perché anche la funzione non deve inventarsi una risposta
rassicurante su ciò che non le è stato dato.

**Flotta — quanto costa un'ora di macchina.** Rimisurato, e la misura ha detto
che **metà del lavoro era già in casa**: `consumoPerMezzo` sapeva già il
carburante *e le ore*. Stavo per scrivere un secondo conto delle stesse ore, che
un giorno diverge: la prova adesso pretende l'**identità** con `oreCoperte`, non
un valore uguale per caso. E il caso che conta: il Dumper D3 ha la spesa più
alta di tutte e nessuna lettura del contatore → «non si sa», non «0 €/h», che lo
farebbe sembrare il più conveniente.

⚠️ Lo **scatto** ha trovato due cose che il codice non mostrava: un `numeroIt`
non importato (errore di pagina, sezione vuota) e una maiuscola in mezzo alla
frase.

## Il punto cieco della barra

Cinque versioni dello stesso banco prima di quella giusta, e l'errore era sempre
**calcolare una cosa che il browser sa dire**. La domanda «l'etichetta esce
dalla colonna?» era mal posta: gonfiando il testo la colonna cresce con lui.
Quello che cede è la **barra**, che ha `overflow:hidden` e fa sparire le ultime
voci in silenzio — la pagina resta larga 360, quindi `fuori-schermo` non se ne
accorge, e la regola 19 conta le colonne ma non le misura.

## Le ricerche sui concorrenti

Sei lanciate insieme col mandato del fondatore («prendere tutto quello che
hanno: se lo mantengono, qualcuno lo paga»), **arrivate tutte e sei**. Formato preteso: prima il mondo, poi la nostra app voce per voce, poi il
delta ordinato per ricorrenza, poi dove possiamo fare meglio.

Censite fra le sei: **470 funzioni** dei concorrenti, con le fonti (Campo 81,
Conti 92, Flotta 67, Scudo 95, Sentinella 70, Terra 65).

⚠️ Sono **candidati**. Le due verifiche fatte dicono perché la regola serve: una
volta la misura ha trovato qualcosa di più grave, una volta che il lavoro era
già fatto.

## Verifica

`run-kpi` **1125/0**, `run-stile` **274/0**, `numeri-nei-documenti` 17/0
(copertura **466/466**), `copertura-funzioni` 9 soggetti a posto.
CI: era rossa su `59c15d5` per il conto della copertura (465 contro 466),
corretta in `fb2a364`.

## Prossimo passo atomico

Leggere il delta delle cinque ricerche e **scegliere tre candidati verificabili**
— uno per app diversa, così si aprono tre cantieri insieme come pretende la
regola nuova. I più promettenti dal primo sguardo: gli allarmi in tempo reale di
Sentinella (7 concorrenti su 12 ce li hanno), i solleciti di Conti, la
riconciliazione volume misurato/venduto di Terra.

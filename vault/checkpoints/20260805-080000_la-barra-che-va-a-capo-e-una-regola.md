# La barra che va a capo è diventata una regola

**Data:** 05/08/2026 · **Dove:** `apps/deepwork-id/tests/run-stile.mjs`
**Unità precedente:** `20260805-070000_il-registro-costi-la-schermata.md`

## Cosa è stato fatto

Il difetto trovato allo scatto nell'unità precedente — la barra in basso
andata **a capo** perché la voce nuova era l'ottava su un `--nav-cols` rimasto
a 7 — non poteva restare una cosa che «adesso sappiamo». È la **regola 19** di
`run-stile.mjs`.

**La barra in basso ha tante colonne quante voci.** `.nav` non è una fila
elastica: è una griglia a colonne fisse
(`grid-template-columns:repeat(var(--nav-cols),1fr)`), e il numero lo dichiara
ogni app nel proprio blocco di variabili. Aggiungere una voce senza toccarlo
non stringe la barra — la manda a capo, e l'ultima voce finisce **sotto**,
invisibile e non toccabile. Nessun errore in console, nessuna prova rossa, e
leggendo il codice non si vede.

E c'è un secondo modo di sbagliare, più insidioso del primo: se `--nav-cols`
**manca del tutto**, non manca davvero. Vale il `5` di
`shared/deepwork-style.css`, quindi una app da sei voci ne perde una senza che
nessuno abbia scritto niente di sbagliato. La regola guarda tutt'e due le
direzioni.

## Le prove

Tre `test`, non uno:

1. **La regola**: sei barre, zero violazioni.
2. **La copertura**: ha davvero trovato **sei** barre (una per app verticale) e
   ha letto **almeno 30 voci**. Un «zero violazioni» ottenuto su zero soggetti
   è il difetto raccolto tre volte in `CLAUDE.md`, e qui è facilissimo da
   prendere — basta che il markup della barra cambi di una virgola e
   l'espressione non aggancia più niente, restando verde.
3. **La controprova, dentro la suite**, con tre difetti rimessi nel TESTO:
   il numero indietro di uno (quello successo davvero), la dichiarazione tolta,
   e la barra che il controllo non aggancia più. Tutt'e tre vengono viste.

## ⚠️ Come è stata scritta la controprova, e perché la prima volta era sbagliata

La prima controprova l'ho fatta **a mano**: `sed` sul file vero, controllo,
`sed` indietro — mentre nell'altra finestra girava il giro completo del
browser. Cioè esattamente la cosa che `impronta.mjs` esiste per impedire, e che
avrebbe invalidato un giro da mezz'ora. Il guardiano non ha protestato per
pochi secondi di fortuna, il che è **peggio** che se avesse protestato: non
insegna niente.

La correzione non è «stare più attenti». È che **la regola prende il testo, non
un percorso**: `barraNav(html)` è pura, quindi il difetto si rimette nella
stringa, in memoria, e la controprova diventa permanente invece di vivere in
una sessione di terminale. È lo stesso principio dei banchi del browser, che
iniettano nella risposta HTTP e mai nel file.

Regola da tenere: **una controprova che ha bisogno di modificare un file
tracciato è scritta male.** Se la funzione controllata prende il contenuto
invece del percorso, la controprova non tocca niente e vive per sempre.

## Stato

`run-stile` **264 → 267**, prove `node` **1.408 → 1.411**.
`numeri-nei-documenti.mjs` ha fatto cadere di nuovo i tre documenti col
conteggio, e in più ha stanato una frase ferma da giorni: `docs/DEVELOPMENT.md`
diceva che `run-stile.mjs` rende «tredici» regole verificabili quando erano
diciotto. Aggiornati documenti e `CLAUDE.md`.

## Prossimo passo atomico

Il **ponte col volume di Terra** per il costo al metro cubo — già prototipato
in banco e verde a 17 prove, pronto da trapiantare:

- `volumeDaTerra(rilievi, dal, al)` sopra `cavatoPeriodo`, che **rifiuta con
  quattro motivi diversi** (Terra non leggibile, solo riprese da cumulo, solo
  rilievi pianificati, nessun rilievo nel periodo) invece di dire «nessun
  volume» allo stesso modo per quattro cause;
- `costiFuoriDaiRilievi(righe, primo, ultimo)`, che è la misura vera del
  problema. La prima versione avvisava confrontando le **date** — «i rilievi
  coprono dal 28/02, il periodo parte dall'01/01» — e la prova l'ha bocciata
  subito: un rilievo misura il volume tolto **da quello prima**, quindi la sua
  data è la FINE dell'intervallo che copre, e un periodo «scoperto» da agosto
  in poi è semplicemente il futuro. L'avviso partiva su un caso sano. La
  domanda giusta non è sulle date: è **quante voci di costo, e per quanti euro,
  cadono fuori dall'intervallo che i rilievi hanno davvero misurato** — perché
  quelle stanno nel numeratore e non nel denominatore, e il costo al metro cubo
  esce **più alto** del vero.

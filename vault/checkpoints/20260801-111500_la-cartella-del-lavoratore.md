# La cartella del lavoratore — l'ultimo dei cinque

**Data:** 01/08/2026 · **Area:** `apps/scudo/scudo-data.js` + `apps/scudo/index.html`
**Unità precedente:** `20260801-102000_accorgersene-prima-che-il-camion-sia-sotto.md`

## Perché proprio questa

Il conteggio fatto poche ore fa sui «5 documenti da fare per primi» aveva
lasciato **un solo pezzo davvero mancante**: la cartella del lavoratore di
Scudo. Gli altri quattro la stampa ce l'avevano già; qui si stampava il
**verbale DPI** e non il fascicolo.

## ⛔ Non è un calcolo, è un assemblatore — e la parte che conta è un'altra

Tutto quello che serve Scudo lo sapeva già dire: `statoScadenza`,
`matriceMansione`, `verbaleDpi`, `nominaAttiva`. `cartellaLavoratore` mette in
fila **per una persona** quello che c'è, nell'ordine in cui lo chiede un
ispettore. Scriverci dentro un secondo calcolo sarebbe stata l'ennesima copia.

La parte che valeva la pena progettare è **`vuoti`**, e la ragione è precisa:
*un fascicolo stampato mente per omissione*. Una sezione vuota su un foglio che
esce dalla stampante si legge **«a questa persona non serve»**, mentre la verità
è «non è stato registrato niente». Davanti a un ispettore sono due frasi
diverse, e la seconda va scritta.

**Il caso che ha cambiato il disegno**, trovato in scratchpad prima di scrivere
nel modulo: una persona **senza mansione**. Il primo prototipo la trattava come
chiunque altro e la cartella usciva con corsi e DPI vuoti — cioè «non gli spetta
niente». Senza mansione invece non si **sa** che cosa gli spetti: è
`matriceMansione` a dirlo, e senza mansione quella domanda non ha risposta.

## Tre errori miei, tutti trovati misurando

1. **`scadenzeDiChiLavora` non era la funzione giusta**: è il ponte «chi è in
   turno oggi» e vuole operatori e squadre. Avevo indovinato dal nome.
2. **`statoScadenza` prende la DATA e restituisce una STRINGA**, non prende la
   riga e non restituisce un oggetto. Passandogli la scadenza intera rispondeva
   **«senza data»** su righe che la data ce l'hanno — e il fascicolo l'avrebbe
   **stampato così**, cioè avrebbe dichiarato all'ispettore che di quattro
   adempimenti non si sa la scadenza. ⚠️ **Le mie prove non se ne accorgevano**:
   contavano righe, non verità. Aggiunta l'asserzione che distingue (almeno uno
   stato diverso da «senza data» su chi le date le ha tutte); rimesso il
   difetto, cade.
3. **Due regex cercavano «e» dove il testo ha «è»** e facevano fallire due
   prove buone.

## La frase di chiusura, riscritta dopo averla guardata stampata

La prima versione ri-elencava in fondo tutti e tre i vuoti — che ogni sezione
già scrive: tre righe di rumore in coda a un documento che si legge in fretta.
Adesso `descriviCartella` dice la cosa che le sezioni **non** dicono: quante
sono e **come vanno lette**. L'elenco resta in `vuoti`, che la modale usa
(lì le sezioni non ci sono ancora).

## Verifica

Scatti **guardati**, tutt'e due gli stati: la cartella piena (Mario Rossi:
mansione, 4 scadenze coi loro stati veri, 6 DPI) e quella incompleta (Anna Neri:
tre sezioni, ognuna col suo riquadro rosso tratteggiato invece che bianca).
Nessun `pageerror`. Riusata la meccanica di stampa del verbale (`#verbale` +
classe `stampa-verbale`): nessuna seconda struttura di stampa scritta in casa.
Prove **1117 → 1119**, con controprova su ognuna. Suite: stile 271/0, demo 8/0,
sonda-vuoto 7/0, copertura 9 soggetti 0 scoperte, nomi-doppi 0,
numeri-nei-documenti 17/0 (documenti allineati a 1.482 e 465/465),
suite-collegate 3/0.

## ⚠️ Un debito dichiarato, non nascosto

Il **censimento delle sei app** promesso due checkpoint fa **non è stato
fatto**: il primo tentativo l'ho invalidato io modificando una pagina mentre
girava, il secondo l'ho fermato perché stava bloccando il lavoro sui moduli da
troppo tempo senza aver scritto una riga. Il lato **sorgente** è misurato (5
frasi distinte in Scudo, 9 in Campo, 7 in Flotta, 7 in Sentinella, 6 in Conti,
12 in Terra); il lato **schermo** è misurato solo per Campo, Flotta e Sentinella
(un caso ciascuna, tutti e tre poi messi nel banco). Resta da fare, e resta
scritto.

## Prossimo passo atomico

Mettere la **cartella** dentro `stati-non-misurati.mjs`: oggi il banco guarda
sei app e quindici stati, ma il fascicolo che dichiara le sezioni vuote — cioè
il posto dove l'omissione costa di più dopo il DDT — è provato solo dal modulo.
Serve il caso «cartella incompleta» chiesto come lo chiede l'utente (scelta
della persona, conferma della modale, lettura del foglio), sulla falsariga di
quello del DDT.

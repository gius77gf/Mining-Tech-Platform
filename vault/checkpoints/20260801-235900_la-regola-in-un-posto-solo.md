# La regola in un posto solo

**Data:** 01/08/2026 (notte) · **Area:** `docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md` (nuovo)
**Unità precedente:** `20260801-235500_il-rapportino-che-non-sta-in-nessun-giorno.md`

## Perché adesso, e non come riepilogo

Sei unità di fila hanno dovuto rispondere alla **stessa domanda** — *questo caso
lo metto nei dati d'esempio?* — e ci sono arrivate una alla volta, ognuna
scoprendo un pezzo:

1. Campo, disponibilità che non torna → nasce la distinzione **assenza /
   contraddizione**;
2. Scudo, DPI senza addestramento → l'assenza ci va, e va provata in scratchpad
   prima;
3. Sentinella, distanza mai dichiarata → e `run-demo` **impediva** alla
   dimostrazione di contenere il caso;
4. Terra, volume dell'atto → l'**eccezione**: un'assenza che smonta il resto si
   digita come una contraddizione;
5. Conti, totale incassato → il criterio per **quali frasi meritano una riga**
   del banco (accanto a un numero di cui cambiano la lettura);
6. Campo, rapportino senza giorno → il criterio applicato subito, e le altre
   occorrenze **dichiarate** invece che aggiunte.

La regola era quindi vera e **scritta in sei posti diversi**, ognuno con un
pezzo. È il difetto che `CLAUDE.md` racconta per la logica condivisa — *una
regola che serve a due posti vive in un posto solo* — applicato a una regola di
metodo invece che a una funzione.

## Che cosa contiene, e la parte che vale di più

Le tre risposte in ordine (assenza → ci va; contraddizione → si digita;
assenza-che-smonta → si digita anche lei), il criterio del «caso che deve poter
mancare senza portarsi via il resto», e quello per decidere **se una frase
merita una riga del banco**.

Ma la parte che serve davvero è la tabella dei **rifiuti già motivati**: il
residuo di Terra, il superamento di Sentinella, i ripieghi di campo. Senza
quella, la prossima unità li riprova — e se ridecide al contrario, la
dimostrazione cambia in peggio senza che nessuno se ne accorga.

## Il rifiuto nuovo, deciso misurando

**Sentinella · «valore inserito a mano, senza data»** sta accanto a un numero
(il valore contro la soglia), quindi passa il criterio. Ma
`superamentiAperti(DEMO.monitoraggi, DEMO.ricettori)` risponde **0**: in
dimostrazione non c'è nessun superamento, e aggiungerne uno cambierebbe il
**verdetto del report** da «Conforme» a non conforme — cioè il titolo del
documento, non un dettaglio. Strutturale: rifiutato e dichiarato.

## Collegato, non orfano

L'intestazione del banco rimanda al documento con una riga sola: *«si legge
quello prima di aggiungere un caso, per non ridecidere al contrario»*. Un
documento che nessun file nomina è un documento che nessuno apre.

## Verifica

`numeri-nei-documenti` 17/0 (3 documenti, 39 banchi, copertura 465/465),
`suite-collegate` 3/0 su 46 file, `run-stile` 271/0.

## Prossimo passo atomico

Chiudere «senza data» con **Terra**, l'ultima delle quattro app. Lì la frase è
uno **stato di `statoScadenza`**, cioè il vocabolario condiviso: la domanda non
è «c'è la frase» ma **dove quello stato finisce accanto a un conteggio** — un
riepilogo che dice quante scadenze sono a posto e quante scadute, e che senza
la dichiarazione conterebbe le senza-data fra le tranquille. Da misurare
chiamando le funzioni **come le chiama la pagina**: è il passo che oggi ha
salvato tre unità su sei.

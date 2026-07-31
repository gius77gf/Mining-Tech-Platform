# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-04 10:24 UTC — **il ciclo che ha trovato
quattro difetti veri, e uno era vivo nella sicurezza**
**Cosa ha fatto (ciclo precedente, chiuso poco fa):** una sonda che chiama
**tutte** le funzioni pure con dati vuoti cercando **un solo segno** — *un numero
tranquillo dove non è stato misurato niente* — ha trovato quattro difetti.
Il peggiore era **live**: una scadenza importata da un file con la data sbagliata
di battitura («2026-13-45» ha la forma giusta e non esiste) entrava in archivio e
restava **verde per sempre** — una visita medica che nessuno avrebbe mai visto
fra quelle da fare. Corretto in sei punti, perché lo stesso difetto era scritto
sei volte con nomi diversi, e la correzione ha fatto nascere `dataISOEsiste`
(«2026-02-30» non è nemmeno un errore per `Date.parse`: scivola al 2 marzo).
Gli altri tre: Sentinella diceva «Conforme» su punti che nessuno aveva letto,
Flotta poteva dichiarare «SCADUTA» un tagliando **senza obiettivo**, Conti poteva
**bloccare la pagina**. Poi le altre **cinque porte d'ingresso** con lo stesso
filtro a sola forma. Prove `node`: **1.343 → 1.359**.

**Cosa ha fatto oggi, dopo quel blocco** — sei unità, tutte con la loro
controprova:

1. **Terra — il verde su un anno che nessuno ha misurato.** Il KPI
   dell'avanzamento si colorava di verde anche con **zero rilievi dell'anno**, e
   la frase accanto diceva «al ritmo attuale ~0 m³ — sotto il limite
   autorizzato». *Zero non è un ritmo lento: è l'assenza della misura.* Il
   grafico lì sotto si difendeva già da solo, il KPI no.
2. **Il giro del browser si accorge da sé se gli cambiano il codice sotto.** La
   regola c'era scritta, ed è stata violata **due volte in due giorni** — la
   seconda da me. Ora il giro si dichiara **NON VALIDO** invece di stampare un
   riepilogo verde, e dice dopo quale banco.
3. **Genesi è passata al condiviso** — era l'**ultima** app a tenersi in casa
   una copia di toast e modale. Con una trappola che il piano non aveva: il CSS
   vestiva un id che stava per cambiare inquilino, e la pagina si sarebbe aperta
   con un **velo nero fisso** davanti a tutto.
4. **Una misura del piano era sbagliata, e l'ho corretta**: non 22 selettori a
   rischio ma **8**, perché si era contata una *parola* invece della *cosa*. Un
   rischio gonfiato blocca una decisione quanto un risultato gonfiato la
   giustifica.
5. **Conti — la nota di credito.** L'app scriveva che «una fattura realmente
   emessa non va cancellata, va gestita con una nota di credito», e poi offriva
   **un solo bottone**: quello che la regola viola. Ora si emette, storna,
   libera il fido e si rilegge. Misurato quanto costava non averla: una sola
   fattura annullata col trucco del finto incasso portava il **tempo medio di
   pagamento da 30 a 101 giorni**.
6. E la regola che tiene tutto in piedi: **stornata non è saldata.** Una fattura
   annullata ha residuo zero come una pagata — ma nessuno l'ha pagata, e se
   contasse, il cliente peggiore diventerebbe il più puntuale.

Prove `node`: **1.359 → 1.383**. Banchi del browser: **25 → 29**.

**Cosa sta facendo adesso:** il giro completo dei 29 banchi gira sul codice
finale della giornata. Poi si riprende dalla **tracciabilità del volume** in
Terra/Genesi, già misurata e pianificata.
**Commit di partenza:** `844896f`

---

## ✅ La routine funziona — prova del 28/07

Questo è il **primo canarino scritto da un ciclo automatico vero**, non a
mano. Dimostra che la catena regge: la sveglia scatta, il messaggio arriva,
la sessione raggiunge il repository e committa.

Una cosa imparata, che vale la pena scrivere: gli scatti di prova delle
19:00 non erano falliti — erano **in coda**. Un messaggio programmato entra
solo quando la conversazione è libera, e in quel momento era occupata da
ore di lavoro ininterrotto. Non era un guasto: era traffico. Quindi
**l'assenza immediata del canarino non significa che la routine è rotta**:
può voler dire che la sessione sta lavorando. Va giudicata sull'arco di
qualche ora, non sui minuti.

## Come si legge

- **Data di oggi o di ieri** → la routine sta lavorando, tutto bene.
- **Data di più di un giorno fa** (nei giorni lun–sab) → **la routine si è
  fermata**. La procedura per rimetterla in piedi è in
  `docs/ROUTINE_AUTOMATICA.md`.

## Regola per i cicli automatici

Ogni ciclo, **appena verificato di poter raggiungere il repository**, deve
aggiornare le tre righe in cima (data e ora UTC, cosa sta per fare, hash del
commit di partenza) e committarle con un messaggio che inizia per
`canarino:`. Non è un adempimento burocratico: è l'unico segnale che dice al
fondatore, in un colpo d'occhio, se il lavoro automatico è vivo — ed è
quello che la sentinella su GitHub controlla per avvisarlo via email.

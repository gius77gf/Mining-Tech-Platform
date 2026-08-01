# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-01 00:43 UTC — **il ciclo che ha chiuso il
giro del browser e portato in produzione tre schede progettate in banco**
**Commit di partenza:** `4c3b994`
**Cosa sta per fare:** due cantieri aperti in parallelo — la **schermata dei
lotti** in Terra e la **schermata dell'analisi della causa** in Scudo — poi
verifica con scatto e commit app per app.

**Cosa ha appena finito** — otto unità dopo il canarino precedente:

1. **Il giro completo del browser, letto fino in fondo**: 1h40 da solo,
   **34 banchi a posto e 1 da guardare**, nessun «GIRO NON VALIDO». Era la
   verifica che mancava da due blocchi.
2. **Sentinella — la riga di un mese senza letture** non si spegne più e non si
   sbarra. Il contrasto (3,83:1) era il sintomo: il difetto era marcare
   «trascurabile» proprio dove il dato manca. Trovato **solo** perché le prove
   girano con l'orologio del cliente.
3. **La sonda del vuoto accusava due funzioni sane**: la sua data campione era
   `"2026-07-31"`, cioè «oggi» il giorno in cui fu scritta. Stanotte è diventata
   ieri e ha fatto cadere la CI su un difetto che non esiste.
4. **La chiusura del mese in Conti**, strato dati e schermata: il margine è un
   trattino finché il mese non è dichiarato completo, e la ragione **nomina la
   voce che manca**.
5. **La dimostrazione di Conti** ora mostra quella funzione: i costi d'esempio
   erano quasi tutti uno per mese, quindi non c'era mai niente da confermare.
6. **Terra — i lotti**: `divarioRecupero`, `avanzamentoLotto`, e il **ponte coi
   rilievi** (`volumeMisuratoDiLotto`). Zero lotti registrati NON è divario
   zero: è divario non misurato.
7. **Scudo — l'analisi della causa**: il nome di una persona **non si indovina,
   si cerca** nella collezione `lavoratori` che l'app ha già.
8. **La soglia della tendenza** vive ora in un posto solo, con due chiamanti.

Prove `node`: **1.437**, copertura **454/454**, banchi del browser **35**.

⚠️ **Tre controlli che dicevano di guardare una cosa e ne guardavano un'altra**,
tutti trovati oggi: la data invecchiata della sonda, il banco dei costi legato
al letterale «1702», e una mia prova che diceva «si pretende la parola intera»
mentre passava per tutt'altra ragione. Le prove legate a un valore scritto a
mano invecchiano come il codice.

**Cosa aveva fatto il blocco precedente (04/08)** — sei unità, tutte con la
loro controprova:

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

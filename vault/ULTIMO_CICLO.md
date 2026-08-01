# Ultimo ciclo automatico

> **A cosa serve questo file.** Ogni volta che un ciclo di lavoro automatico
> parte davvero e riesce a raggiungere il repository, aggiorna le righe qui
> sotto. Se la data è vecchia, vuol dire che **la routine non sta
> lavorando** — e si vede subito, senza dover cercare tra i commit.

**Ultimo ciclo riuscito:** 2026-08-01 **16:14 UTC**
**Commit di partenza:** `f75a9e8`
**Cosa sta per fare:** aprire **tre cantieri insieme** su tre app diverse — e'
la regola nuova, misurata: le due giornate migliori della settimana (241 e 258
modifiche) sono state a cantieri paralleli, quella in fila ne ha fatte 92.
Si parte dal **delta delle sei ricerche sui concorrenti**, arrivate tutte:
470 funzioni censite con le fonti, e i tre buchi piu' ricorrenti sono il
cruscotto degli indicatori di Scudo (10 concorrenti su 10 ce l'hanno, noi
zero), gli allarmi in tempo reale di Sentinella (7 su 12) e i solleciti di
Conti.

⚠️ Ogni candidato si **rimisura** prima di crederci: le due verifiche fatte
oggi hanno dato una volta un difetto piu' grave di quello segnalato (il turno
aperto di Campo) e una volta che meta' del lavoro era gia' in casa (il costo
orario di Flotta).

---

## Il blocco precedente — dodici unità *(commit `4c3b994` → `04f5ce6`)*

---

## Le dieci unità di questa notte

Il filo è uno solo: **«l'assenza di un dato non è un dato favorevole»** usato
per la prima volta non come regola da rispettare scrivendo cose nuove, ma come
**metro per rileggere quello che c'era già**.

1. **Scudo — l'analisi della causa arriva a schermo.** La pastiglia gialla
   «0 perché» su ogni evento senza analisi, la riga nelle Urgenze, la sezione
   «Perché succedono». E il difetto vero l'ha trovato il **confronto
   affiancato**: prima **tutte e sei** le righe del registro mandavano la barra
   dei comandi a capo, dopo **zero** — e non era colpa del lavoro nuovo, era
   «1 azione chiusa» scritta due volte identica.
2. **Regola 20**: una **bandiera che nessuno legge non protegge niente**. Il
   principio esce da `CLAUDE.md` e diventa un controllo.
3. **Il censimento in tutte e sei le app — 28 punti corretti.** Sei cantieri in
   parallelo. I più gravi: in **Flotta** il campo ore vuoto **salvava 0 in
   archivio**; in **Conti** una fattura senza data d'emissione portava l'età
   media del credito da **92 a 46 giorni**; in **Scudo** un lavoratore **senza
   nemmeno una riga in scadenzario** era contato fra i «regolari»; in **Campo**
   il turno chiuso e firmato faceva uscire **verde** un appello mai fatto; in
   **Sentinella** lo zero di nascita di un punto lo metteva **primo** fra i
   tranquilli; in **Terra** «Nei limiti» verde con **zero rilievi**.
4. **La dimostrazione può mostrare il caso.** `run-demo` vietava alla demo di
   contenere una fattura senza scadenza — cioè proprio ciò per cui la difesa
   era appena stata costruita. Ora distingue un dato **corrotto** da un dato
   **assente**.
5. **`CLAUDE.md`** aggiornato con le tre cose imparate, dove si rileggono.
6. **Terra — «con un volume» vuol dire con un numero.** Due condizioni gemelle
   sbagliavano **tutt'e due**, in punti diversi.
7. **Due decisioni per il fondatore** (punti 16 e 17), **rimisurate** invece che
   riportate — e la misura diceva qualcosa di diverso dal resoconto.
8. **Le sei controprove dichiarate, rilanciate una per una**: reggono tutte e
   dodici i numeri. Erano stati scritti in un messaggio di commit sulla parola
   degli agenti.
9. **Il 100% della copertura non guarda Genesi, e adesso lo dice.**
10. **La misura per il modulo dati di Genesi**, stretta tre volte: 113 → 81 →
    **54**.

**Prove `node`: 1.438 → 1.471.** Copertura 454 → **456**, sempre al 100%.

## ⚠️ Le tre cose che vale la pena sapere, se leggi solo questo

- **Genesi è l'unica app che `node` non può interrogare**: le sue 191 funzioni
  stanno dentro la pagina, e **sei delle otto** che decidono i numeri di
  sicurezza (compresa quella che sceglie K e β della previsione di vibrazione)
  **non prendono nessun argomento** — leggono dallo schermo. Oggi, se qualcuno
  ci cambia una riga, **nessuna prova cade**. Il piano per rimediarci è in
  `docs/PIANO_GENESI_MODULO_DATI.md`.
- **Due cose aspettano te**, e sono i punti **16** e **17** di
  `DECISIONI_WEEKEND.md`: un punto di monitoraggio **senza soglia** oggi viene
  confrontato con una soglia **inventata** (e sbaglia in tutt'e due i versi:
  verde a 0,8, allarme a 1,2); e un **infortunio a prognosi ancora aperta** entra
  come zero giornate perse. Non li ho toccati: il primo è una soglia di
  sicurezza, il secondo tocca gli indici che vanno all'ente.
- **Un giro del browser è stato fermato apertamente** a un terzo, e va detto
  invece di lasciarlo credere finito: girava su una copia ormai vecchia di due
  commit e teneva occupata la CPU impedendo ogni scatto ai sei cantieri.
  Rilanciato dopo, sul codice finale.

---

**Cosa aveva fatto il blocco precedente** — otto unità:

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

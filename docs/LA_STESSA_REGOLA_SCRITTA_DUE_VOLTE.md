# La stessa regola scritta due volte

*Questo documento è per Giuseppe. Non parla di codice: parla di una cosa
che continua a succedere, di quanto costa, e di come distinguere il caso in
cui è un difetto da quello in cui non lo è.*

## Il fatto, in una riga

Scrivendo le prove del 2 agosto sono venute fuori **tre regole che vivono
in due posti** invece che in uno. Non erano state cercate: sono uscite da
sole, perché per scrivere una prova bisogna prima decidere **qual è la
funzione giusta da chiamare**, e tre volte la risposta è stata «dipende da
quale delle due».

## Perché è una cosa che conta

Una regola scritta due volte non fa danni **il giorno in cui la si
scrive**: le due copie sono uguali. Il danno arriva il giorno in cui
qualcuno ne migliora una — e non sa che l'altra esiste.

Da quel momento il programma dice **due cose diverse sulla stessa cosa**, e
non c'è nessun errore da nessuna parte: tutt'e due le versioni funzionano.

È già successo, e c'è scritto nelle nostre regole di lavoro: la convenzione
su come si leggono i numeri era finita **scritta quattro volte con tre
comportamenti diversi**, ed è costata una giornata intera.

## I tre casi di oggi, e come sono diversi fra loro

### 1. La frase «questo numero non l'ho capito» — *è un difetto, si corregge*

Quando scrivi un numero che il programma non riesce a leggere, lui te lo
dice con una frase. Quella frase è scritta **in due posti**.

Le ho fatte scrivere tutt'e due sugli stessi dieci casi: **tre risposte su
dieci erano diverse**. E — questa è la parte che merita attenzione —
**ognuna delle due era migliore dell'altra in un punto**:

- sul caso più importante, «1.250» che può voler dire milleduecentocinquanta
  o uno-virgola-due-cinque, una delle due frasi dice anche **come si
  scrive** («1250», non «1.250»); l'altra si ferma a «senza il punto delle
  migliaia» e lascia indovinare la forma giusta — proprio dove il programma
  ha appena dichiarato di non voler indovinare;
- se scrivi uno **zero**, una delle due risponde «hai scritto «0»» e l'altra
  «hai scritto «»», cioè ti dice che non hai scritto niente. Hai scritto
  zero.

Nessuno dei due gruppi di utenti vedeva la versione migliore in entrambi i
punti. **Correzione**: una sola frase, con il meglio delle due, e le app che
la richiamano invece di riscriverla.

### 2. Come si scrive un numero a schermo — *NON è un difetto, resta com'è*

Anche qui la stessa funzione esiste in due app, e su dodici valori dà **sei
risposte diverse**. Ma le differenze sono **volute, e scritte**:

- in Sentinella, dove i numeri vanno in un rapporto per l'ente, un dato che
  manca si scrive **«—»**: il trattino dice «non è stato misurato». In Campo
  si scrive vuoto, e la schermata decide cosa metterci;
- in Sentinella i numeri da cento in su si arrotondano all'unità, perché
  «1.286,00 letture» non aggiunge niente a nessuno. In Campo no.

Sono **due modi di parlare di due mestieri diversi**, non due versioni della
stessa cosa. Metterle insieme peggiorerebbe tutte e due.

**Cosa ho fatto**: niente, tranne scrivere una prova che mette per iscritto
il confine — che cosa è uguale e che cosa è diverso di proposito. Così chi
arriva dopo non "unifica" per ordine e non "duplica" per distrazione.

### 3. Le causali di fermo — *NON è un difetto, ma il nome inganna*

Due app hanno un elenco che si chiama allo stesso modo, `CAUSALI_FERMO`, e
non è la stessa cosa: in Campo dice **perché si è fermata un'attività di
turno** («manca il materiale», «attesa mezzo»), in Flotta **perché una
macchina è fuori servizio** («attesa ricambi», «gomme o cingoli»).

Il nome uguale è una trappola per chi arriva dopo. Anche qui: una prova che
lo scrive, con dentro la condizione — *se un giorno diventassero davvero la
stessa cosa, allora il posto è uno solo.*

## Il criterio, in una frase

> Se togliendo una delle due copie qualcuno perde qualcosa, **non sono la
> stessa regola**. Se non perde niente, **una delle due è di troppo**.

## Che cosa resta da fare

La correzione del caso n. 1 è **scritta e pronta**, con il controllo che
conta quante sostituzioni ha davvero fatto e si ferma se qualcosa non
torna. Parte appena finisce il controllo automatico che sta girando adesso
sulle pagine (modificare i file mentre quel controllo apre le pagine
falserebbe il controllo).

Insieme alla correzione arriva anche la difesa: una regola automatica che
**la prossima volta se ne accorge da sola**, invece di aspettare che
qualcuno se ne accorga scrivendo una prova.

---

## Il 03/08: la difesa c'era, e guardava solo metà delle coppie

La «difesa automatica» promessa qui sopra è stata scritta ed è
`apps/deepwork-id/tests/nomi-doppi.mjs`. Ha funzionato — ha retto per due
giorni — ma faceva **una domanda sola**: *due app esportano lo stesso nome?*

E il posto della regola condivisa non è un'app: è `shared/`. La coppia più
facile da sbagliare è quindi **un'app contro `shared/`**, cioè un'app che si
riscrive in casa una funzione che nello shell c'è già. **Quella forma non la
guardava nessuno.**

Aggiunta la domanda mancante, è saltata fuori subito:

### 4. `perCampo`, in Flotta e nello shell — *è un difetto*

Come si scrive un numero **dentro un campo di testo**: con la virgola
decimale e **mai** col punto delle migliaia, perché quel punto rientrerebbe
dal lettore come ambiguo e l'app finirebbe per rifiutare un valore **proposto
da lei stessa**.

È scritta due volte, in `shared/deepwork-id-client/dw-shell.js` e in
`apps/flotta/flotta-data.js`, **identiche carattere per carattere**. Oggi
fanno la stessa cosa; domani una delle due cambia e l'altra no, e non se ne
accorge nessuno — perché quando divergeranno non ci sarà nessun errore, solo
un campo che rifiuta un numero che aveva proposto lui.

Nessuno dei due controlli poteva vederla: l'app-contro-app perché Flotta è
l'**unica** app che esporta quel nome, il nuovo perché non esisteva ancora.

*(Applica il criterio: togliendo la copia di Flotta, chi perde qualcosa?
Nessuno — il file importa già dallo shell altre sei cose. Quindi una delle
due è di troppo.)*

### La lezione, che è la solita

Non «serviva un altro controllo». È che **un controllo va misurato anche
nella sua copertura**: quante coppie ha davvero confrontato? Questo ne
confrontava sedici su ventisei. Adesso stampa il numero — *«10 nomi
condivisi fra le app e shared/ sono stati confrontati»* — e **cade se
scendono sotto otto**, perché uno «zero violazioni» ottenuto su zero
confronti si legge esattamente come uno vero.

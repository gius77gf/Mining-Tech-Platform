# Decisioni del fondatore — checklist per la revisione del weekend

Questo file è un **indice unico** delle decisioni che spettano a te
(Giuseppe) e che i cicli automatici NON prendono da soli. Ogni voce dice:
cosa è già pronto, quale decisione serve, e dove sono i passi di dettaglio.
Niente qui viene attivato senza una tua conferma esplicita in chat.

Spuntare `[ ]` → `[x]` quando la decisione è presa; poi il ciclo automatico
può procedere con l'attuazione.

---

# 📖 Da dove cominciare — le decisioni aperte sono **5**

*Erano 19 fino al 07/08. **Nove** sono state chiuse dal **ciclo**, non da te, con
la regola che avevi concesso il 01/08 (senza risposta entro la settimana si
procede con la colonna «la mia risposta» e lo si dichiara nel commit):
· **sette scrivendole** — la **6**, la **8**, la **10c**, le tre della **11** e
  la **12b**: sono scelte di direzione, non hanno prodotto codice;
· **due costruite** — la **5a** (il messaggio del salvataggio fallito, montato
  nelle sei app) e la **10b** (chi può cancellare un documento emesso, con le
  regole provate dall'emulatore).
Restano **cinque**: una verde che vogliono ancora un cantiere prima di potersi
dire fatte, e le quattro che non tocco (due di sicurezza, due che chiedono
qualcosa di tuo).*

*Questa pagina è stata aggiunta il 01/08 per una ragione precisa: hai scritto
che avresti potuto rispondere «in settimana», e un file di cinquecento righe con
venticinque caselle non è una cosa a cui si risponde in una sera. Qui sotto le
stesse, ordinate per **quanto ti costano a te** e con, per ognuna,
la risposta che darei io. Il testo lungo resta nelle sezioni numerate: questa è
solo la porta d'ingresso.*

## 🔴 Le due che NON prendo da solo, mai — e che restano ferme finché non parli

Non è prudenza mia: è una regola che hai dato tu, ed è scritta in `CLAUDE.md`.
Toccano la sicurezza delle persone o dei dati, e una scelta sbagliata qui non si
vede subito.

| # | in una riga | perché aspetta te |
|---|---|---|
| **3** | ✅ **CHIUSA il 02/08** — i dati di default sono dimostrativi | verificato contro il codice prima di chiuderla. Vedi la sezione 3. |
| **4** | via libera a togliere le **password in chiaro** dal sorgente | ora si sa che sono dimostrative (decisione 3), quindi **non c'è niente da ruotare fuori dal progetto**: resta da decidere se toglierle prima del primo cliente vero |
| **9** | le **curve dei limiti di vibrazione** (USBM/DIN) esatte | è la soglia che dice a una cava se può sparare: la cambio solo se me lo dici |

## 🟡 Le due che richiedono che tu apra qualcosa

Non posso farle io perché servono un tuo account o un tuo file.
La terza — la **2** — è stata chiusa domenica 02/08: le regole erano aperte a
chiunque, il fondatore ha pubblicato quelle chiuse, e la chiusura è verificata.

| # | in una riga | che cosa ti chiede |
|---|---|---|
| **1** | creare il progetto Firebase nuovo | un account Google, dieci minuti, e incollarmi la config |
| **2** | ✅ **CHIUSA il 02/08** — le regole del progetto esistente | erano `if true`; il fondatore ha pubblicato `if false` e la chiusura è verificata dall'esterno (403). Vedi la sezione 2. |
| **7** | la prova drone → Genesi con un volo vero | un file di un volo tuo |

## 🟢 Le quindici che posso portare avanti io — SETTE PRESE il 07/08, otto aperte

⛔ **VENERDÌ 07/08: LA SETTIMANA È FINITA E LA RISPOSTA NON È ARRIVATA.** La
regola concessa il 01/08 diceva che, senza una tua parola entro la settimana, il
ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**.
Così è stato, e vale la pena dire esattamente **che cosa è successo e che cosa
no**, perché un titolo più largo del suo numero è il difetto che passiamo le
giornate a togliere dal prodotto:

| | quante | che cosa vuol dire |
|---|---|---|
| **prese oggi** | **7** — 6, 8, 10c, 11a, 11b, 11c, 12b | erano decisioni da **scrivere**: non toccano codice, e adesso sono scritte con la ragione |
| **prese E costruite** | **5** — 5a, 10b, 12a (tutte e 6 le voci), 18a, 18b | il messaggio del salvataggio fallito (montato nelle sei app, 30 asserzioni) e chi può cancellare un documento emesso (regole 58 → 68, con la controprova) |
| **restano aperte** | **1** — 5b, che è l'unica che tocca l'isolamento fra clienti | la risposta c'è ed è nella colonna, ma **attuarla vuole un cantiere con la sua misura**: dichiararle «prese» senza averle costruite sarebbe la faccia tranquilla su un lavoro non fatto |
| **ferme, e restano ferme** | **4** — 1, 4, 7, 9 | due toccano la sicurezza (mai da solo), due vogliono che tu apra qualcosa di tuo |

⚠️ E una decisione presa dal ciclo **non pesa come una tua**: si cambia con una
riga, in qualunque momento, e nessuna delle sette ha prodotto codice — sono
scelte di direzione, scritte dove chi lavora le trova.

*Erano diciannove. Le **quattro gemelle — 13, 14, 16, 17** — le hai decise tu
il 02/08 con una riga sola («vai»), e sono state attuate lo stesso giorno.*

Sono scelte di **prodotto**, non di sicurezza. Per ognuna ho una risposta che mi
convince, e sotto trovi la ragione per esteso. **Se entro la settimana non dici
niente, procedo con la colonna «la mia risposta» e lo scrivo nel commit**, così
resta chiaro che l'ha decisa il ciclo e non tu — e si cambia in qualunque
momento.

| # | la domanda, in una riga | la mia risposta |
|---|---|---|
| ~~**5a**~~ | ✅ **DECISA E FATTA DAL CICLO il 07/08** — il messaggio del salvataggio fallito | «questa modifica non è stata salvata», mai un codice d'errore. Misurato prima: **103 punti su 109** scrivevano senza nessun `catch`, cioè un rifiuto era MUTO. L'avviso sta sul fabbricante delle scritture, una riga per app |
| **5b** | il lavoro **senza rete** (giro macchina, appello al fronte) | **sì**, ma prima misuro cosa succede a due persone che scrivono la stessa riga · ✅ **LA MISURA È FATTA (08/08)**: `docs/DUE_PERSONE_STESSA_RIGA.md`. Campi diversi **convivono**; lo stesso campo **vince l'ultimo**; ma il caso vero — la lista letta, cambiata in un punto e **riscritta intera** — fa **sparire in silenzio** la spunta dell'altro, e succede in **12 punti di 4 app**. La cura è una riga (il percorso puntato), provata nella misura stessa. La coda offline viene **dopo**: metterla prima moltiplicherebbe il problema |
| ~~**6**~~ | ✅ **DECISA DAL CICLO il 07/08** — la geometria del fronte | resta com'è: P1.1/P1.2 restano chiusi finché la **7** non porta un volo vero. Il segno della deviazione decide se l'avviso di flyrock è dritto o rovesciato |
| ~~**8**~~ | ✅ **DECISA DAL CICLO il 07/08** — quale funzione per prima | il **criterio**, non un elenco: quella che l'ispettore chiede per prima. Un elenco deciso oggi invecchierebbe come i «non c'è» di una ricerca |
| ~~**10a**~~ | ✅ **DECISA DAL CICLO il 07/08** — l'abbonamento come barriera vera | **sì**, ma **non costruibile oggi**: misurato, gli entitlement non li scrive **nessuno** e `hasEntitlement` non la chiama **nessuna app**. Prima chi scrive l'abbonamento, poi la barriera |
| ~~**10b**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — chi può cancellare | solo chi **amministra** corregge o cancella un documento già emesso; scrivere cose nuove resta a tutti. Elenco corto e scritto: `conti/fatture`, `conti/note`, `scudo/documenti`. Regole 58 → **68** prove |
| ~~**10c**~~ | ✅ **DECISA DAL CICLO il 07/08** — quanti utenti al primo cliente | **più utenti**. ⛔ E ne segue un vincolo: la **10b** va chiusa PRIMA del primo cliente |
| ~~**11a**~~ | ✅ **DECISA DAL CICLO il 07/08** — diario / tavolo da disegno | confermata: distingue per **tempo verbale**, non per elenco di funzioni |
| ~~**11b**~~ | ✅ **DECISA DAL CICLO il 07/08** — le tre sovrapposizioni | si tolgono da **Deepwork**, in quest'ordine: la parola «volata», la maglia in due formati, i due motori 3D. Ordine dichiarato, non attuato |
| ~~**11c**~~ | ✅ **DECISA DAL CICLO il 07/08** — due app o una | **due**, e si mostra il ponte: «una app con due modi» nasconde proprio ciò che distingue il prodotto |
| ~~**12a**~~ | ✅ **DECISA E FINITA il 07/08 — tutte e sei le voci** — export ri-caricabile | **sì**. Ordine ragionato: si parte da ciò che **non si ricostruisce da nessuna carta** — i rilievi di Terra (un volo di sei mesi fa non si rifà), non da ciò che vale di più. Due erano già fatte, quattro costruite: rilievi, pesate/DDT, incassi, clienti, azioni correttive |
| ~~**12b**~~ | ✅ **DECISA DAL CICLO il 07/08** — dirlo in chiaro prima del pilota | si fa **comunque**, anche quando la 12a esisterà. Su CHI lo dice il ciclo non decide |
| ~~**13**~~ | ✅ **DECISA E FATTA il 02/08** — mansione senza requisiti | «non lo sappiamo»: il riepilogo passa da `puo 3/6` a `puo 2, nonSo 1` |
| ~~**14**~~ | ✅ **DECISA E FATTA il 02/08** — DPI senza data di sostituzione | «attenzione»: da «regolare» e zero allarmi a «senza data», 1 allarme |
| ~~**15**~~ | ✅ **DECISA DAL CICLO il 07/08** — dove vive «Il Quadro» | **(a) nel core**, dove il titolare arriva già. ⚠️ Costo misurato, più alto di quello scritto: sei ponti (il core ne ha **zero**, le app sessanta). Il Quadro **non è costruito**: la decisione dice dove vive |
| ~~**16**~~ | ✅ **DECISA E FATTA il 02/08** — punto senza soglia | stato a sé: il report per l'ente non scrive più «conforme» su un limite mai stabilito |
| ~~**17**~~ | ✅ **DECISA E FATTA il 02/08** — infortunio a prognosi aperta | si distingue da «0»: prima era «un infortunio che non è costato una giornata» |
| ~~**18a**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — la detrazione per recupero | **(c)** un'opzione della concessione, che nasce **spenta**: l'errore ha un costo asimmetrico |
| ~~**18b**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — recupero a cavallo di due anni | nell'anno in cui **finisce**, l'unica data verificabile |

⚠️ **Correzione, 02/08.** Qui prima c'era scritto che *dieci* di queste
diciannove erano la stessa domanda. **Sono quattro.** Le ho contate una per una
invece di andare a impressione, ed è esattamente il difetto che passiamo le
giornate a togliere dal prodotto: un numero più grande del vero, scritto con
sicurezza. Le quattro vere sono la **13**, la **14**, la **16** e la **17**:

| # | la domanda | perché è la stessa domanda |
|---|---|---|
| **13** | una mansione **senza requisiti** censiti | il vuoto vuol dire «nessuno l'ha ancora scritto», non «va bene così» |
| **14** | un DPI **senza data di sostituzione** | idem: verde vorrebbe dire «a posto», e nessuno l'ha detto |
| **16** | un punto di monitoraggio **senza soglia** | senza soglia non si può dire né conforme né non conforme |
| **17** | un infortunio a **prognosi aperta** | le giornate perse non sono zero: non si sanno ancora |

Tutte e quattro chiedono la stessa cosa: **quando non si sa, l'app lo dice
invece di mostrare la faccia tranquilla.** È il principio che hai dato tu
(«l'assenza di un dato non è un dato favorevole»), e ogni volta che l'abbiamo
violato l'app ha detto a qualcuno una cosa rassicurante che nessuno aveva
misurato.
✅ **E così è stato**: il 02/08 il fondatore ha risposto «vai», e tutte e quattro
sono state attuate nello stesso blocco, con le prove e le controprove. Le altre
quindici restano scelte vere, una per una.

---

## 1. Creazione del progetto Firebase nuovo
- **Stato**: guida pronta, niente creato.
- **Decisione che serve**: crei tu il progetto (serve un account Google) e
  incolli in chat la config web + confermi il piano.
- **Costo**: la parte usata (Auth + Firestore) parte **gratis** (piano
  Spark). Le Cloud Functions richiederebbero il piano Blaze — **rimandato**,
  non serve per il go-live.
- **Dettaglio passo-passo**: `apps/deepwork-id/GUIDA_FIREBASE.md`.
- **Dopo la creazione (lato Claude)**: `apps/deepwork-id/ATTIVAZIONE_LIVE.md`
  (config nell'SDK → regole di sicurezza → registrazione → bootstrap owner →
  verifica live).
- [ ] Deciso / fatto

## 2. Regole di sicurezza del progetto Firebase ESISTENTE
- **Stato al 02/08**: ⛔ **LETTE, ED ERANO COMPLETAMENTE APERTE.** Il fondatore
  le ha aperte in console e incollate:

      match /{document=**} { allow read, write: if true; }

  È la «modalità test» che Firebase propone alla creazione del database,
  rimasta attiva. Tradotta: **chiunque su internet può leggere, scrivere e
  cancellare l'intero database** — non serve un account, basta l'id del
  progetto, che sta nel sorgente del sito pubblico.
- **Perché non poteva essere altrimenti, e come l'abbiamo capito prima di
  chiederglielo**: nel core non c'è **nessuna** autenticazione — cercati
  `getAuth`, `signIn`, `onAuthStateChanged`, `firebase/auth` in `index.html` →
  **zero**. Senza un'identità, o le regole lasciano passare tutti o il sito non
  salva niente. La lettura delle regole ha confermato la deduzione.
- ⚠️ **`apiKey` e `projectId` pubblici nel sorgente NON sono il problema**: in
  Firebase per il web non sono segreti, sono identificatori. La protezione
  doveva venire dalle regole, e non c'era.
- ⚠️ **E c'era un secondo difetto che nessuno aveva guardato**: tutti i
  visitatori del sito dimostrativo scrivono nello **stesso** database, quindi
  si vedono i dati a vicenda e se li sovrascrivono.
- **Che cosa si fa**: si chiude (`if false`). ⚠️ **Non spegne il sito**: il core
  ha già la via d'uscita, e il suo commento la nomina alla lettera — «se
  Firestore non risponde proprio (rete morta, projectId errato, *security rules
  bloccanti*) carichiamo i dati di default in memoria»
  (`initDBOfflineFallback`). La dimostrazione continua, e ognuno lavora sulla
  propria copia: **migliora** anche il secondo difetto.
- **Le regole nuove, versionate**: `firestore.rules.core-vecchio`, con dentro
  quelle vecchie per intero e come si torna indietro.
- **Contenuto del database**, verificato dal fondatore il 02/08: vuoto o solo
  prove. Niente da esportare.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 3.
- ✅ **PUBBLICATE dal fondatore il 02/08 — e verificate dall'esterno, non sulla
  parola.** Una lettura anonima dell'API REST di Firestore (nessun account,
  nessuna chiave, esattamente quello che poteva fare chiunque fino a stamattina)
  su `projects/deepwork-app-6c56f/databases/(default)/documents/…` risponde
  ora **`403 PERMISSION_DENIED — Missing or insufficient permissions`**. Prima
  quella stessa chiamata restituiva i documenti.
- ⚠️ **Quello che la prova NON dice, detto com'è.** Da qui il browser non
  raggiunge la rete pubblica, quindi il sito **vivo** con le regole chiuse non
  l'ho potuto aprire: quello che ho verificato è (a) la chiusura, dall'esterno,
  con la chiamata qui sopra, e (b) che il percorso di ripiego del core prende
  anche questo caso — `loadAllData` fa `await getDocs`, un rifiuto delle regole
  è un `reject`, e il `catch` che lo circonda chiama `initDBOfflineFallback`
  (stesso percorso della rete assente, che ho eseguito davvero in locale: la
  pagina entra, 37 elementi visibili, schermata di accesso al suo posto).
  Il primo che apre il sito vero è la conferma finale.
- 👉 **Una conseguenza da sistemare, e non è un difetto nuovo**: adesso ogni
  visitatore riceve il messaggio «⚠ Modalità degradata — connessione database
  non disponibile». Con le regole chiuse **per scelta** quella frase è falsa:
  non è un guasto, è la modalità dimostrativa. Da riscrivere nel core.
- [x] Fatto — *regole pubblicate e chiusura verificata dall'esterno (02/08)*

## 3. Dati di default: reali o di fantasia?
- **Stato**: nel core `index.html` ci sono DEFAULT_CLIENTI / DEFAULT_CAVE /
  DEFAULT_USERS con nomi, telefoni, email, IBAN, coordinate realistici.
- **Decisione che serve**: sono dati **veri**? Se sì, vanno sostituiti con
  dati sintetici (sono pubblici su GitHub) e va valutata la rimozione dallo
  storico.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punti 1 e 2, `docs/CENSIMENTO_FEATURE.md`.
- [x] ✅ **DECISO dal fondatore il 02/08: sono dati DIMOSTRATIVI.** Servono a
      provare l'app nelle varie modalità d'accesso, e non sono usati da nessuna
      altra parte. **Niente da bonificare.**
      **Verificato contro il codice prima di chiudere**, perché una decisione di
      sicurezza non si prende su un'impressione — e le tre prove concordano:
      · l'IBAN è **esattamente** quello d'esempio dei manuali
        (`IT60X0542811101000000123456`), non un IBAN di qualcuno;
      · i telefoni sono `333 1234567`, `2345678`, `3456789`, `4567890` — in
        sequenza;
      · i cognomi sono Rossi, Bianchi, Verdi, Colombo, cioè i segnaposto
        classici italiani.
      ⚠️ E una nota di metodo, perché per un momento l'ho letta male io: in git
      questi dati risultano introdotti da `gius77gf` col primo commit del
      repository (`d441229`, 18/04/2026). Ma **git registra chi committa, non
      chi scrive**: l'app — compresi questi dati d'esempio — è stata costruita
      da Claude nelle **conversazioni precedenti a questo repository**, e il
      fondatore l'ha portata qui. Quindi «li ha generati Claude» e «li ha
      committati Giuseppe» sono vere tutt'e due, e non si contraddicono.

## 4. Mitigazione password in chiaro
- **Stato**: preparata ma **NON attivata**. Nel core ci sono 7 utenti con
  password in chiaro nel sorgente pubblico.
- **Decisione che serve**: dai il via libera ad attivare la mitigazione
  ponte (verifica su Firestore con hash+salt, niente fallback in chiaro) e
  a **ruotare tutte le password** attuali.
- **Dettaglio**: `docs/MITIGAZIONE_PASSWORD.md` (già con passi operativi e
  bozza di seeding).
- [ ] Via libera

## 5. Gestione errori delle scritture live (scelta di STILE)
- **Stato**: i gestori delle app fanno `await db.xxx()` senza try/catch. In
  demo non fallisce mai; in live un errore Firestore (rete, permessi, quota)
  fallirebbe in silenzio, senza avviso all'utente.
- **Decisione che serve**: come mostrare l'errore all'utente? È una scelta di
  stile (es. riusare il `.note` di esito già presente in ogni form con un
  messaggio rosso "Operazione non riuscita, riprova"). Una volta scelto lo
  stile, l'implementazione è meccanica e sicura.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 12.

**Misurato il 01/08 — due fatti che la decisione non aveva:**

1. **Le app non si accorgono di essere offline: zero su sei.** Nessuna delle sei
   guarda `navigator.onLine` né ascolta gli eventi `online`/`offline` (il core
   sì, in due punti). E l'assenza di segnale in cava non è un caso di scuola: è
   il modo in cui una scrittura fallirà **più spesso** di tutti. Oggi il turno
   scrive il rapportino, tocca «Crea bozza», e non ha modo di sapere che non è
   partito.
2. **La persistenza offline di Firestore NON è configurata** (nessun
   `enableIndexedDbPersistence` né `persistentLocalCache` in tutto il progetto).
   È importante perché la ricerca sul valore dà per scontato il contrario —
   scrive che con la persistenza offline «è letteralmente quello che succede».
   **Da noi oggi non succede.** Se si scrivesse all'utente «l'ho tenuto e lo
   salvo appena torna la linea» sarebbe una promessa **falsa**, ed è la peggior
   categoria di messaggio: quello che rassicura a vuoto.

La superficie interessata sono **203 chiamate `await db.`** nelle sei app.
*(Quante siano già protette non lo dico: il conto dei `try/catch` non lo
distingue, perché nelle stesse pagine ci sono catch per la clipboard e per la
lettura dei file. Serve una scansione vera, e la farò quando la decisione sarà
presa — misurare bene una cosa che poi non si tocca è lavoro sprecato.)*

**Quindi le domande diventano due, e la seconda è nuova:**
- (a) **come** si avvisa che il salvataggio non è riuscito (stile del messaggio);
- (b) se vogliamo la **persistenza offline** di Firestore. Non è gratis in senso
  tecnico: mette una copia dei dati dell'organizzazione **nel browser del
  dispositivo**, e su un telefono di cantiere condiviso è una scelta che tocca
  l'isolamento fra clienti — quindi la porto a te invece di prenderla io.

- [x] **(a) Deciso E costruito dal ciclo il 07/08.** «Questa modifica non è
      stata salvata», con la causa in testa solo quando si sa davvero, e mai un
      codice d'errore. Misurato prima di scrivere: **103 punti su 109** che
      scrivono sul database non avevano nessun `catch`, cioè un rifiuto era
      **muto** — la finestra restava aperta e il dato non c'era. L'avviso si
      monta sul fabbricante delle scritture (`avvisaSeNonSalva`, in `shared/`),
      una riga per app, e l'errore viene rilanciato a chi lo sa gestire.
      Prove: `run-helpers` 63 → 71, banco `salvataggio-muto.mjs` 30 asserzioni
      su sei app, controprova che le rende mute tutte e sei.
- [ ] (b) Persistenza offline: sì o no

## 6. Genesi — sblocco delle funzioni sulla geometria del fronte
- **Stato**: hai indicato la direzione ("raggiungere il livello dei
  concorrenti"). Fatte le funzioni sicure lato browser: **riconciliazione**
  previsto-vs-reale, **signature-hole** (vibrazioni dall'onda reale) ed
  **export del piano di innesco** (XML IREDES-like). Dettaglio in
  `docs/GENESI_NUOVE_FUNZIONI.md` e `docs/GENESI_ROADMAP_COMPETITOR.md`.
- **Decisione che serve**: due funzioni potenti restano **rimandate di
  proposito** perché toccano la geometria del fronte e un avviso di flyrock
  sbagliato sarebbe **pericoloso per il fochino**:
  1. **Burden reale per foro** dal 3D del fronte (P1.1);
  2. **Import della deviazione dei fori** (boretrack, P1.2).
  Per procedere in sicurezza serve che tu confermi **come va letta la
  deviazione del fronte** (il segno: sporgenza in avanti = burden minore o
  maggiore?), idealmente con un caso reale della tua cava da verificare.
- **Il motore fisico** NON si tocca senza tua indicazione.
- **Dettaglio**: `apps/genesi/PIANO_3D.md`, `docs/GENESI_ROADMAP_COMPETITOR.md` (P1).
- [x] **Decisa dal ciclo il 07/08: RESTA COM'È.** P1.1 (burden reale per foro) e P1.2
      (import della deviazione) **non si sbloccano** finché non c'è un volo vero da
      confrontare — cioè finché la **7** (gialla) non si chiude. La ragione non è
      prudenza generica: il segno della deviazione decide se l'app dice al fochino
      che il burden è **minore** o **maggiore** del progetto, e sbagliarlo produce un
      avviso di flyrock rovesciato. Una scelta che non si può misurare non si prende
      per stanchezza.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore.** La regola concessa il 01/08: se entro la settimana non arriva una risposta, il ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**, così resta chiaro chi l'ha presa e si cambia in qualunque momento con una riga.


## 7. Drone → Genesi: prova del weekend (priorità ATTUALE)
- **Stato**: il visore nuvola `apps/genesi/nuvola-poc.html` è **pronto per la
  prova**. Legge la nuvola nei formati che ODM produce davvero (**LAS** 1.2/1.4,
  PLY, XYZ) e la mesh (OBJ/GLB), la ritaglia coi cursori isolando il fronte,
  **conta i punti** nel ritaglio (per capire se hai catturato la faccia) ed
  esporta il fronte in `.xyz`. Il metodo del passo successivo è scritto in
  `vault/PASSO3_FRONTE_METODO.md`.
- **Decisione/azione che serve**: nel weekend **provi il flusso col tuo DJI Mini**
  (foto → ODM → carichi il `.las` nel visore → ritagli → esporti) e mi dici com'è
  andata. Con quel dato reale costruisco il **passo 3** (aggancio del fronte alla
  simulazione della volata) sulla forma vera, non a indovinare.
- **Dettaglio passo-passo**: `docs/DEEPWORK_DRONE_FLUSSO.md` (sezione "Prova pratica
  del weekend").
- [ ] Provato il flusso col dato reale (per sbloccare il passo 3)

## 8. Scelte di prodotto sulle app verticali (da ricerca competitor)
- **Stato**: due ricerche oneste hanno individuato i passi a maggior valore,
  fattibili nel browser, ma che **toccano il modello dati** (quindi in attesa di te):
  1. **Scudo** — *loop azione correttiva*: a un near-miss/infortunio si aggancia
     un'azione (cosa fare, responsabile, scadenza) che entra nelle scadenze/promemoria
     già esistenti (`docs/SCUDO_HSE_ROADMAP.md`).
  2. **Flotta** — *ordine di lavoro*: legare una manutenzione ai ricambi consumati
     + ore, così il magazzino si aggiorna dall'evento (`docs/FLOTTA_MANUTENZIONE_ROADMAP.md`).
- **Decisione che serve**: quale (se una) vuoi che costruisca. Sono proposte, non
  attivate.
- [x] **Decisa dal ciclo il 07/08: il criterio, non la funzione.** Si sceglie sempre
      **quella che l'ispettore chiede per prima**, non quella più citata dai
      concorrenti. Le due proposte in elenco reggono tutt'e due il criterio, e
      quella di Scudo l'ha già superata sul campo — il loop dell'azione correttiva è
      stato costruito ed è ciò che un organo di vigilanza cerca in un registro dei
      near-miss. ⚠️ Il criterio vale per le prossime, non è una graduatoria chiusa:
      un elenco di funzioni deciso oggi invecchierebbe come i «non c'è» di una
      ricerca.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore.** La regola concessa il 01/08: se entro la settimana non arriva una risposta, il ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**, così resta chiaro chi l'ha presa e si cambia in qualunque momento con una riga.


## 9. Scienza in Genesi: correzione della curva dei limiti di vibrazione
- **Stato**: su tua direttiva ("fondiamo Genesi sulla scienza") ho verificato i
  modelli sulle fonti. Buone notizie: vibrazioni e flyrock di Genesi **combaciano
  con la letteratura** (formule, coefficienti nei range pubblicati, tetto di
  Lundborg esatto). Trovata UNA correzione da fare: i limiti USBM di Genesi, sotto
  le frequenze molto basse (~4 Hz), sono **meno prudenti** della curva ufficiale
  USBM (e tra 15–40 Hz più severi del necessario). La correzione esatta, con la
  fonte, è pronta in `docs/GENESI_FONTI_SCIENTIFICHE.md` (sezione 4).
- **Decisione che serve**: via libera ad applicare le curve esatte al posto dei
  gradini semplificati (tocca soglie di SICUREZZA → per regola non lo faccio da
  solo). Vale per ENTRAMBI i rami: la curva **USBM** (sotto ~4 Hz siamo meno
  prudenti) e le rampe **DIN 4150-3** (la norma interpola linearmente: a 20 Hz
  residenziale concediamo 15 mm/s dove la norma interpolata dà ~7,5). Modifica
  piccola, più prudente dove conta, con fonti citate (sez. 4 e 4-bis del doc).
- [ ] Via libera alle curve esatte (USBM + DIN) in ppvLimit

---

## 10. Sicurezza dentro l'azienda — l'abbonamento e chi può cancellare
*(nuova, 30/07 · dettaglio in `docs/REVISIONE_SICUREZZA_202607.md`)*

Misurato con l'emulatore, non dedotto. Il muro fra **aziende concorrenti tiene
ed è provato** (68 test, rimisurati l'08/08). Dentro la stessa azienda, invece, non c'è ancora
nessuna separazione: chi è stato invitato per compilare i rapportini può anche
**cancellare una fattura**, e un cliente abbonato solo a un'app può leggere e
scrivere i dati di tutte le altre.

- [x] **10a. Decisa dal ciclo il 07/08: SÌ, BARRIERA VERA** — ma **non si può
      costruire oggi**, e la ragione è misurata, non temuta.
      ⛔ Il prerequisito manca a **due** livelli, e li ho contati uno per uno:
      · **nessuno SCRIVE gli entitlement.** `organizations/{orgId}/entitlements/
        {appId}` è letto dall'SDK (`_loadEntitlement`) e le regole lo aprono in
        lettura ai membri — ma in tutto il progetto **zero** righe lo scrivono:
        niente Cloud Function, niente webhook pagamenti, niente client. Oggi
        ogni organizzazione ha **zero** documenti di abbonamento;
      · **nessuna app LEGGE `hasEntitlement`.** L'intestazione dell'SDK la
        mostra nell'esempio d'uso (`if (!id.hasEntitlement()) id.showLocked()`),
        e chi la chiama sono **zero app su sei**.
      ⛔ Quindi una regola scritta oggi avrebbe due esiti, tutt'e due sbagliati:
      con «documento mancante = nego» **si chiuderebbe fuori ogni
      organizzazione esistente**, che di documenti non ne ha; con «mancante =
      concedo» la barriera sarebbe **decorativa** — ed è esattamente il difetto
      trovato poche ore prima scrivendo la 10b, dove una restrizione scritta e
      leggibile non restringeva niente.
      ⚠️ E la stima di questa scheda — «mezza giornata di lavoro sui claims» —
      **misura la cosa sbagliata**: il lavoro non è la regola, è **chi scrive
      l'abbonamento**. Prima di questa decisione va deciso come nasce un
      entitlement (a mano dal fondatore? da un pagamento? alla creazione
      dell'organizzazione?), che è una domanda commerciale, non tecnica.
      **L'ordine giusto: prima chi lo scrive, poi la barriera.** Scritto qui
      perché il cantiere che la aprirà non ricominci dalla stima sbagliata.
- [x] **10b. Decisa E costruita dal ciclo il 07/08: SOLO CHI AMMINISTRA**
      corregge o cancella un documento **già emesso**; scrivere cose nuove resta
      a tutti. Urgente per conseguenza della **10c** presa poche ore prima.
      L'elenco dei documenti emessi è **corto, scritto per nome e con la
      ragione** — non una regola larga tipo «niente cancellazioni», che
      impedirebbe a un cavatore di togliere una riga sbagliata appena scritta e
      si imparerebbe ad aggirare: `conti/fatture` (e la finestra che la elimina
      SCRIVE GIÀ che «una fattura realmente emessa non va cancellata, va gestita
      con una nota di credito» — la regola rende vero ciò che l'app dice),
      `conti/note` (note di credito, tipo TD04) e `scudo/documenti` (le carte
      che si mostrano all'organo di vigilanza, art. 71 c.9).
      Prove sulle regole: **58 → 68**, con la controprova che rimette il difetto
      e fa cadere le quattro prove negative.
      ⛔ E il difetto della prima stesura va letto da chi tocca quel file: le
      regole di Firestore sono **additive**, e un carattere jolly ricorsivo
      combacia con **zero** segmenti — quindi il `match` delle sottocollezioni
      ri-concedeva quello che quello sopra aveva tolto. La restrizione c'era,
      era scritta, ed era **decorativa**: l'ha presa la prova NEGATIVA, non
      quella che verifica che l'admin possa.
      ⚠️ Il file `firestore.rules` è cambiato ma **NON è pubblicato**: la
      pubblicazione la fa il fondatore, come il 02/08.
- [x] **10c. Decisa dal ciclo il 07/08: PIÙ UTENTI.** Una cava ha almeno il titolare
      e il capocava, e un prodotto che al primo cliente ne ammette uno solo va
      rifatto appena il secondo entra. ⛔ **E la conseguenza è vincolante**: se sono
      più utenti, la **10b** (chi può cancellare) va chiusa **prima** del primo
      cliente, non dopo — perché il giorno in cui due persone scrivono sugli stessi
      dati, «chiunque può cancellare una fattura» smette di essere una riga di
      documento e diventa un danno. La 10b resta nel mucchio che vuole un cantiere.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


Finché non rispondi, `firestore.rules` resta com'è e le 58 prove continuano a
passare.

## 11. Perché esistono sia Deepwork sia Genesi
*(nuova, 30/07 · dettaglio in `docs/PERCHE_DEEPWORK_E_GENESI.md`)*

Alla presentazione arriverà: «ma la volata non la fa già Deepwork?». La risposta
proposta è che Deepwork è il **diario** (registra quello che è stato fatto) e
Genesi il **tavolo da disegno** (progetta quello che si farà). Il documento
elenca anche le tre sovrapposizioni vere.

- [x] **11a. Decisa dal ciclo il 07/08: CONFERMATA.** «Deepwork è il diario, Genesi
      il tavolo da disegno» è la sola formulazione provata che regge alla domanda
      «perché due app»: distingue per **tempo verbale** (quello che è stato fatto /
      quello che si farà), non per elenco di funzioni — e un elenco di funzioni
      invecchia al primo aggiornamento.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.

- [x] **11b. Decisa dal ciclo il 07/08: si tolgono da DEEPWORK, in quest'ordine.**
      Il criterio è dove la sovrapposizione **pesa di più**, e pesa nel core, che è
      la superficie che il fondatore mostra per prima. Ordine: (1) la parola
      «volata», che significa due cose e confonde chi legge — costa solo testi;
      (2) la maglia salvata in due formati, che è un difetto di dati e prima o poi
      produce due verità; (3) i due motori 3D, che è la più cara e la meno urgente
      perché nessuno vede il doppione.
      ⚠️ Ordine **dichiarato, non attuato**: ognuna delle tre è un cantiere suo, e
      questa decisione dice da dove si comincia, non che sia fatto.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.

- [x] **11c. Decisa dal ciclo il 07/08: DUE APP, e si mostra il PONTE.** Il ponte
      fra progetto e consuntivo è la cosa che i concorrenti non hanno, e si vede
      solo se le due cose sono due. «Una app con due modi» nasconde proprio ciò che
      distingue il prodotto.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


⚠️ Nella vetrina la divisione **non è stata data per presa**: la scheda del core
descrive quello che il core contiene, senza pronunciarsi. Aspetta la tua parola.

## 12. Il cliente ha una copia di sicurezza solo di metà dei suoi dati
*(nuova, 31/07 · misurato, dettaglio in `docs/ONBOARDING_DATI.md`)*

Ogni app scarica dei CSV, e questo faceva credere — anche a me, e lo diceva il
documento — che ci fosse un backup di tutto. **Misurato: non è così.** I file
che si **ri-caricano** davvero sono **sette**, e sono stati provati uno per uno
mandandoli dentro l'app: squadre (Campo), gare e listino (Conti), magazzino
ricambi (Flotta), anagrafica lavoratori e registro infortuni (Scudo), ricettori
(Sentinella).

Tutti gli altri sono **prospetti**: hanno colonne calcolate (stato, residuo,
giorni di pagamento) e servono al commercialista o all'ente. Non si ri-caricano,
e va benissimo che sia così — quello che non va è **crederli un backup**.

Restano quindi **senza nessun file che si ri-carica** proprio le cose che una
cava non può riscrivere a mano:

⏱️ **RIMISURATO IL 07/08, e delle sei righe DUE non valgono più.** Non erano
sbagliate quando sono state scritte il 31/07: il lavoro è arrivato dopo, ed è
la terza forma d'invecchiamento censita in `CLAUDE.md` — il «non c'è»
**scaduto**. La prova, comando per comando invece che a memoria: cercando
`parse<Nome>Csv` e `csv<Nome>` nei sei moduli dati, **volate** risponde 1 e 2,
**rilievi** 1 e 1, e le altre quattro **zero e zero**. Le quattro restano
vere.

| Cosa | Dove | Perché fa male perderla |
|---|---|---|
| **pesate e DDT** | Conti | è il documento di consegna: mesi di lavoro, e sono la base delle fatture |
| **incassi** (prima nota) | Conti | date e importi veri dei pagamenti ricevuti |
| **clienti** | Conti | anagrafica con partita IVA, PEC/SDI, fido |
| **azioni correttive** | Scudo | registro che un ispettore può chiedere |
| **rilievi drone** | Terra | volumi che consumano la concessione |
| ~~**registro volate**~~ | ~~Sentinella~~ | ⚠️ **RIGA SCADUTA, corretta il 07/08: ce l'ha già.** `csvRegistroVolate` e `parseVolateCsv` stanno **nello stesso file** — «le colonne le decide un posto solo», dice il commento della pagina — sono cablati tutt'e due in `apps/sentinella/index.html` (righe 4286 e 4302), e il giro di andata e ritorno è provato in `run-kpi.mjs:7811`. Non era sbagliata quando è stata scritta: il lavoro è arrivato dopo |

- [x] **12a. Decisa dal ciclo il 07/08: SÌ**, e la **prima delle sei è fatta**.
      Senza, il cliente ha una copia che non sa rimettere dentro.
      ⛔ **L'ordine non è quello della tabella qui sopra, ed è ragionato**: si
      parte da ciò che **non si ricostruisce da nessuna carta**, non da ciò che
      vale di più. Una pesata ha il suo DDT in archivio e un incasso ha
      l'estratto conto: si ribattono, con fatica. Un **volo di drone di sei
      mesi fa non si rifà** — il terreno nel frattempo è cambiato, e quel
      volume consuma la concessione. Quindi:
      1. ✅ **rilievi (Terra)** — *fatto il 07/08*: `csvRilievi` scrive nel
         formato che `parseRilieviCsv` legge già, con il bottone accanto a
         quello dell'import. Prova di andata e ritorno su sei campi **più
         un'asserzione sul TESTO**, perché il lettore accetta anche la virgola
         e senza quella il giro tornerebbe verde su un file che solo la nostra
         app sa aprire (`run-kpi` 1860 → **1864**);
      2. ⏱️ ~~registro volate (Sentinella)~~ — **c'era già**, e la riga della
         tabella qui sopra era scaduta: `csvRegistroVolate` e `parseVolateCsv`
         stanno nello stesso file, cablati tutt'e due nella pagina, col giro di
         andata e ritorno provato. Verificato coi comandi il 07/08 prima di
         aprire il cantiere — che sarebbe stato lavoro su una cosa fatta;
      3. **pesate e DDT (Conti)** — mesi di battitura, ma i DDT esistono;
      4. ✅ **incassi (Conti)** — *fatto il 07/08*: quattro campi e il
         `fatturaId`, senza il quale un incasso rimesso dentro non si
         riaggancerebbe a niente. Il metodo esce con la **chiave**, non col
         nome leggibile: un file che rientra parla la lingua del programma;
      5. ✅ **clienti (Conti)** — *fatto il 07/08*: il prospetto c'era ed era
         quasi giusto, ma perdeva l'**id** (fatture e pesate puntano al
         cliente con `clienteId`: ri-caricato quel file, tutto quello che ci
         era agganciato restava orfano) e scriveva `0` dove nessuno aveva
         scritto niente — sul **fido** è la faccia tranquilla su un numero che
         decide se una consegna parte. Corretti tutt'e due;
      6. ✅ **azioni correttive (Scudo)** — *fatto il 07/08*: il prospetto porta
         lo stato calcolato e la frase dell'origine, che rientrando sarebbero
         ricalcolate sbagliate. La copia porta i campi crudi e i **sei campi
         dell'origine**: il collegamento evento → azione è proprio quello che un
         organo di vigilanza cerca.
      ⛔ **E COSÌ LE SEI VOCI SONO CHIUSE**: due erano già fatte (rilievi no,
      volate sì), quattro costruite oggi. La 12a è finita.
      ⚠️ Quindi le voci vere da fare **non sono cinque, sono quattro**: contarne
      cinque sarebbe stato un elenco di mancanze gonfiato, che è peggio di
      nessun elenco — manda a lavorare dove non serve.
      ⏱️ **SEGUITO DELL'08/08 — la 12a resta chiusa, cambia DOVE vivono i suoi
      file.** Tirando la riga «33 righe rientrate su 34» del giro del browser si
      è visto che **sei dei sette** file che si ri-caricano erano composti da una
      stringa **dentro la pagina**, cioè dove nessuna prova `node` arriva: il
      loro giro export → import lo poteva controllare solo il giro del browser,
      un'ora e mezza. Adesso li scrivono `csvListino`, `csvGare`, `csvRicambi`,
      `csvSquadre`, `csvRegistroInfortuni` e `csvPersonaleScadenze` nei moduli,
      e un controllo pretende che **nessuno degli otto futuri** torni nella
      pagina. Non è una voce nuova della 12a: è la stessa promessa resa
      **verificabile in millisecondi**.
      ⛔ E il pezzo che vale più dello spostamento: il foglio del personale
      scrive `AZIENDA;;;;…` e `parseLavoratoriCsv` salta quella riga **per
      nome** — un accordo tenuto da una **coincidenza** fra due posti che non si
      parlano. Cambiando quella parola si sarebbe importato un **lavoratore
      fantasma**, senza errori e senza prove rosse. Adesso è una prova.
      ⚠️ Detto onestamente: **nessun difetto raggiungibile** è stato trovato in
      quei sei file, e i due sospetti sono stati misurati e **scartati** (Conti
      rifiuta il salvataggio senza `prezzo > 0`; in Flotta una giacenza assente
      vale zero in tutta la pagina). Il giro intero del banco dà gli stessi 215
      numeri e le stesse 33 righe su 34 di prima.
      ⚠️ Le cinque che restano NON sono spuntate: la risposta c'è, il lavoro no.
- [x] **12b. Decisa dal ciclo il 07/08: si dice in chiaro COMUNQUE**, anche il
      giorno in cui l'export ri-caricabile (12a) esisterà. La parola «in
      alternativa» qui sopra è la parte da correggere: dirlo non è il ripiego di
      chi non ha l'export, è **onestà** — e il giorno che l'export c'è, la frase
      cambia («copre tutto, e si rimette dentro così») invece di sparire.
      ⚠️ Su **chi** lo dice il ciclo non decide: quella è una parola che il
      fondatore dice al cliente. Il ciclo garantisce che sia **scritta** e vera
      nel documento di onboarding, che è la parte verificabile.
✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


⚠️ Nel frattempo **nessuna promessa falsa resta scritta**: la frase del
documento che diceva «ogni import ha accanto un export ri-caricabile» è stata
corretta, e sette controlli automatici tengono fermi i sette che lo sono
davvero — se domani uno di loro smettesse di ri-caricarsi, se ne accorge la
suite e non il cliente.

## 13. Una mansione senza requisiti: «può andare» o «non lo sappiamo»?

**Come è saltata fuori.** Il 31/07 ho scritto in `CLAUDE.md` un principio che si
era ripetuto in tre app: *l'assenza di un dato non è un dato favorevole* —
«senza dati» non è «conforme», «non risulta» non è «va bene», «non lo so» non è
«non c'è». Poi l'ho usato come lente, chiamando ogni funzione delle sei app con
i dati vuoti per vedere chi risponde qualcosa di tranquillo. Sono uscite 39
candidate: quasi tutte innocue, **una** era un difetto vero (corretto: il badge
verde del tagliando su un mezzo senza contaore), e **una** è una domanda per te.

**La domanda.** In Scudo, la matrice dice chi può fare una mansione domani
mattina — *può / attenzione / no*. Se una mansione è stata creata, le persone
sono state assegnate, ma **nessuno ha ancora scritto quali corsi servono**, oggi
tutti risultano **«può andare»**, in verde.

Tecnicamente è coerente: non è richiesto niente, quindi non manca niente. Ma
detto a chi guarda la schermata è ambiguo, e le due letture sono opposte:

- *«questa mansione non richiede corsi particolari»* — vero per certi lavori;
- *«nessuno ha ancora detto che cosa serve per questa mansione»* — che è il caso
  più probabile su una mansione appena creata, e allora il verde è proprio il
  colore sbagliato.

- [x] ✅ **13. DECISA dal fondatore il 02/08: «non lo sappiamo».** Attuata lo
      stesso giorno. Misurato prima: chi ricopre una mansione per cui nessuno
      ha scritto i requisiti risultava **«può andare»** — `abilitazioneLavoratore`
      guardava solo se c'erano bloccanti o attenzioni, e senza requisiti non ce
      n'è nessuno dei due. Il riepilogo diceva `puo 3/6`; adesso `puo 2, nonSo 1`.
      *(Le strade che erano sul tavolo:)*
  a) **si lascia com'è** — chi crea una mansione sa che cosa ha creato;
  b) **si dice, senza cambiare il colore**: sotto la mansione compare «nessun
     requisito impostato», e la riga resta verde;
  c) **la mansione senza requisiti va in «attenzione»** finché qualcuno non
     dichiara che non ne servono (una spunta «per questa mansione non servono
     corsi»), e da quel momento torna verde.

⚠️ **Non l'ho toccata**: è una scelta di prodotto, non un difetto, e il verde di
oggi non afferma niente di falso su un dato misurato — dice solo poco. La
correzione è pronta in tutte e tre le forme, e costa poco in tutte e tre.

## 14. Un DPI consegnato senza data di sostituzione: verde o «non lo sappiamo»?

*Trovato il 02/08 scrivendo le prove sui DPI. Stessa famiglia del punto 13, e
per questo te lo chiedo invece di deciderlo io.*

**Come funziona oggi.** Quando registri la consegna di un dispositivo, Scudo
**propone da sé** la data di sostituzione a partire dai mesi previsti per quel
tipo (per esempio dodici mesi per una maschera). Ma quella casella si può
**svuotare**. Se la svuoti, da quel momento quel dispositivo **non produrrà mai
più un avviso di sostituzione**: nella tabella la data si legge «—», e nel
riepilogo il dispositivo risulta a posto.

**Le due letture, tutt'e due ragionevoli:**

a) **l'hai svuotata apposta.** Quel dispositivo non ha una scadenza —
   l'interfaccia stessa dice che i mesi del tipo sono «una durata indicativa,
   quella vera la dice il libretto del costruttore». Allora il verde è giusto;

b) **nessuno ha detto entro quando va sostituito.** E allora non è un verde: è
   un «non lo sappiamo», della stessa specie del contaore che segnava zero ore.
   Su un facciale filtrante contro la silice, «non lo sappiamo» pesa.

**Se scegli (b)**, la forma più mite è quella del punto 13: il dispositivo senza
data di sostituzione va in **attenzione** (giallo) invece che in verde, e chi
vuole dichiarare che quel pezzo non scade lo dice con una spunta.

⚠️ **Non l'ho toccato**: come al punto 13 è una scelta di prodotto, e tocca il
modulo della sicurezza. C'è però una prova che blinda il comportamento di oggi
e lo nomina, così se un giorno cambia si sa che è stato **scelto** e non
successo.

- [x] ✅ **14. DECISA dal fondatore il 02/08: attenzione.** Attuata lo stesso
      giorno, e senza inventare niente: la parola «senza data» esisteva già in
      `shared/dw-ponti.js` e la usano tre app — è bastato togliere il ternario
      `consegna.scadenza ? … : "regolare"` e lasciarla rispondere.
      Misurato: un DPI senza data passava da «regolare» e **zero allarmi** a
      «senza data», 1 allarme, `daSistemare` da 3 a 4.

## 15. Dove vive «Il Quadro», il cruscotto del titolare?

*Domanda nata il 02/08 rileggendo `RICERCA_CRUSCOTTO_TITOLARE_202607.md` prima di
costruirlo. Il progetto del cruscotto è pronto e resta valido parola per parola:
quello che manca è decidere **in quale pagina** vive.*

**Il fatto.** La scheda diceva di metterlo nell'hub, `apps/index.html`. Ma quella
pagina è la **vetrina**: statica, pubblica, senza login e senza nessun accesso ai
dati. Un cruscotto lì dentro metterebbe i numeri di un'azienda vera su una pagina
che chiunque può aprire. Non si fa.

**Le tre strade.**

**(a) Nel core**, cioè nel programma principale che si apre entrando. La sua
schermata iniziale cambia già a seconda di chi sei (fochino, operatore, ufficio):
basterebbe aggiungere il Quadro per chi è titolare o ufficio.
*Pro:* è la strada più veloce, e il titolare non deve imparare un posto nuovo.
*Contro:* mette i numeri delle sei app dentro il prodotto che si chiama Deepwork,
e i due nomi si confondono.

**(b) Una app nuova**, `apps/quadro/`, come le altre.
*Pro:* è la più pulita e la più coerente — nell'ecosistema una vista è una app, e
il Quadro avrebbe la sua identità e il suo colore.
*Contro:* è un cantiere intero, ed è una nona voce nell'elenco delle app.

**(c) Dentro Deepwork ID**, che è già la **porta d'ingresso** autenticata: entri
e la prima cosa che vedi è il Quadro, con sotto le app.
*Pro:* è il posto dove il titolare arriva già oggi, costa meno di (b) e non sposta
nessuna identità di prodotto.
*Contro:* Deepwork ID nasce come «chi sei e cosa puoi fare», e diventerebbe anche
«come sta andando».

⚠️ **Non ho scelto io.** Le tre strade costano diverso e dicono cose diverse su
come si presenta il prodotto, ed è una scelta tua. Nel frattempo il lavoro
procede su quello che serve **in tutte e tre**: le funzioni che alimentano le
tessere esistono già in tutte le app e sono coperte da prove.

- [x] **15. Decisa dal ciclo il 07/08: (a) NEL CORE.** È il posto in cui il
      titolare arriva già oggi, e la sua schermata iniziale cambia **già** a
      seconda di chi sei: il Quadro è una tessera in più per chi è titolare o
      ufficio, non un posto nuovo da imparare. Il contro dichiarato nella
      scheda — «i due nomi si confondono» — resta vero, e la **11b** appena
      presa dice come si tratta: le sovrapposizioni si tolgono da Deepwork, a
      partire dalle parole.
      ⚠️ **E il costo vero è più alto di quello scritto qui sopra**, misurato
      prima di decidere invece che dedotto: la scheda dice che (a) è «la strada
      più veloce», e lo è **a parità di ponti** — ma il core ne ha **zero**,
      mentre le sei app ne contano **sessanta** occorrenze. Un ponte è ~26
      righe (l'SDK inizializzato con un altro `appId`, le letture, e il ripiego
      in dimostrazione). Quindi (a) costa **sei ponti nel core** più le
      tessere: resta la strada più breve delle tre, ma non è gratis.
      ⛔ E quando si costruirà, quei sei ponti **non si scrivono sei volte**:
      sarebbe la copia debole con la firma troppo stretta. La forma giusta è un
      ponte solo che prende l'`appId` come argomento, in `shared/`. Non è stato
      aggiunto oggi di proposito: una funzione che non chiama nessuno non
      protegge niente, e nascerebbe come guardia scollegata.
      ⚠️ **Il Quadro NON è costruito**: questa decisione dice DOVE vive, ed è
      quello che chiedeva. Il cantiere è il prossimo, e il suo progetto —
      `docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md` — resta valido parola per
      parola.

## 16. Un punto di monitoraggio SENZA soglia: che cosa deve dire?

*Trovato il 01/08 dal censimento del principio in Sentinella. Te lo chiedo
invece di deciderlo io perché **tocca una soglia**, e le soglie sono ferme
finché non lo dici tu.*

**Come funziona oggi.** Quando Sentinella giudica una misura la confronta con la
soglia del punto. Se la soglia **manca**, la riga di codice ne usa una di
ripiego: **1**. Non è una scelta scritta da qualcuno — è un `|| 1` messo per non
dividere per zero.

**Che cosa succede davvero** (misurato, non dedotto, su un punto senza soglia):

| lettura | che cosa risponde l'app |
|---|---|
| 0,8 mm/s | **«Conforme»**, verde |
| 1,2 mm/s | **«Superamento»**, rosso |

Cioè sbaglia in **tutt'e due i versi**: dà un verde tranquillizzante a chi non
ha nessun limite da rispettare, e **inventa un allarme** a chi ne sta sopra —
sopra un numero che nessuno ha scelto. È il principio dell'assenza in tutte e
due le sue facce nello stesso punto, ed è la cosa più grave uscita dal
censimento.

**Quanto è raggiungibile, misurato:** dall'interfaccia **non lo è**. Il form
pretende una soglia maggiore di zero con un messaggio esplicito
(«Serve una soglia maggiore di zero…»), e l'import CSV scarta le righe con
soglia ≤ 0. Il caso vive per **dati scritti prima**, o da un'altra strada.

**Le due strade:**

a) **uno stato a sé, «Senza soglia»** (giallo), che non è né conforme né
   superamento. È coerente con tutto il resto dell'app — «senza dati» non è
   «conforme» è nato proprio qui — ma **cambia i conteggi**: quel punto esce dal
   numeratore *e* dal denominatore della conformità, e il report per l'ente lo
   deve dichiarare;

b) **lasciarlo com'è** e considerarlo chiuso dal fatto che l'interfaccia non ci
   arriva. Costa zero, e regge finché nessuno importa dati da un'altra via.

⚠️ **Non l'ho toccato.** La (a) è quasi certamente la risposta giusta per il
prodotto, ma tocca il modo in cui si giudica una misura ambientale: è tua.

- [x] ✅ **16. DECISA dal fondatore il 02/08: stato a sé.** Attuata lo stesso
      giorno, e il numero che la giustifica è questo: il **report che va
      all'ente** dichiarava **«conforme»** su punti senza nessun limite scritto,
      con ogni riga della tabella marchiata verde «entro soglia». Adesso il
      documento dice «questo giudizio riguarda 4 punti su 5 … su quello non si
      può dire né conforme né non conforme».
      Trovato per strada e non previsto: con una soglia **negativa** il rapporto
      usciva **120.000%**. E il caso è entrato nella **dimostrazione**, perché
      una difesa che non si vede in vetrina non la guarda nessuno.

## 17. Un infortunio con la prognosi ANCORA APERTA: quante giornate perse?

*Trovato il 01/08 dallo stesso censimento, in Scudo. Anche questo è tuo, e per
una ragione diversa: qui la decisione di oggi è **scritta e datata** nelle
prove, con la sua ragione — quindi non è una svista, è una scelta che forse va
rivista.*

**Come funziona oggi.** Il campo «giorni di assenza» lasciato vuoto vale **0**.
La ragione scritta il 31/07 è buona: in un **near-miss** la colonna vuota vuol
dire davvero *nessuna assenza*, ed è il caso normale.

**Il caso che quella ragione non copre.** Un **infortunio** registrato mentre la
prognosi è ancora aperta: i giorni non si sanno *ancora*. Misurato su un anno
con 20.000 ore lavorate:

| | indice di frequenza | indice di gravità | LTIFR |
|---|---|---|---|
| un solo infortunio, 12 giorni | 50 | 0,6 | 50 |
| **più uno con prognosi aperta** | 100 | **0,6** | **50** |

La frequenza sale — giusto, l'infortunio c'è stato. Ma la **gravità non si
muove** e l'infortunio **non viene contato fra quelli con assenza**: l'app dice
«un infortunio in più che non è costato nemmeno una giornata». Che è
esattamente quello che ancora non si sa.

**La strada mite**, se scegli di cambiarlo: distinguere «0 giornate» (scritto)
da «prognosi aperta» (non ancora scritto), contare il secondo fra gli infortuni
**con assenza da quantificare**, e dichiarare la gravità come un **minimo** —
come Terra fa già col cumulato quando il pregresso non è dichiarato.

⚠️ **Non l'ho toccato**, e c'è la prova che blinda il comportamento di oggi e lo
nomina: se un giorno cambia, si saprà che è stato **scelto**.

- [x] ✅ **17. DECISA dal fondatore il 02/08: si distingue, e la gravità è un
      minimo.** Attuata lo stesso giorno. Misurato: un infortunio a prognosi
      aperta veniva contato come **«un infortunio che non è costato una
      giornata»** (`+x.giorniAssenza || 0`), quindi l'indice di gravità restava
      0,6 come se non ci fosse. Adesso la pagina scrive «IG **(minimo)**» e
      «almeno 4 giornate perse», e nell'export la cella è **vuota**, non 0.

## 18. Il volume rimesso per il RECUPERO si toglie dall'onere?

*Nato il 01/08 progettando la detrazione in scratchpad, prima di scriverla nel
modulo. Il progetto tecnico è finito e funziona; quello che manca non è codice,
è una tua decisione — e sbagliarla ha un costo asimmetrico.*

**Il fatto.** La pagina di Terra dice già, ed è vero: *«diverse regioni applicano
la tariffa al volume **al netto** del materiale usato per il recupero ambientale
della cava stessa»*. **Diverse**, non tutte. `baseOnereEscavazione` sa già
accettare un volume da detrarre, e oggi nessuno può scriverlo.

**Dove andrebbe il dato — questo l'ho già risolto, e non serve a te.** Non un
campo per anno con una entità «anno» nuova: i **lotti** di Terra hanno già
`recuperoIniziatoIl`, `recuperoFinitoIl` e gli stati `in-recupero` /
`recuperato` / `collaudato`, e l'atto in dimostrazione prescrive il recupero
**lotto per lotto**. Quindi un campo `volumeRecuperoM3` **sul lotto**, e l'anno
si ricava dalla data. Provato in scratchpad, 5 casi su 5, compreso quello in cui
un lotto ha finito il recupero e nessuno ha scritto quanto materiale ci è
andato: lì la detrazione non è quella parziale, è **incompleta**, e va detto.

**Le due cose che decidi tu:**

1. **Si applica?** Se la tua concessione non ammette la detrazione e Terra la
   applica lo stesso, il foglio che va all'ente dichiara **meno del dovuto** —
   e un errore in quella direzione un ispettore non lo legge come una svista.
   L'errore opposto (non detrarre dove si potrebbe) fa pagare di più: spiacevole,
   ma non pericoloso. Per questo, finché non lo dici tu, **non ho collegato la
   detrazione all'onere**.
2. **A quale anno si attribuisce** un recupero cominciato in un anno e finito
   nell'altro? Nel progetto ho usato l'anno di **fine**, che è verificabile
   perché c'è una data — ma concentra in un anno solo un lavoro fatto in due.
   Ripartirlo vorrebbe dire volumi per stato d'avanzamento, che oggi non
   esistono.

- [x] **18a. Decisa E costruita dal ciclo il 07/08: (c) UN'OPZIONE DELLA
      CONCESSIONE**, che nasce SPENTA. Non è prudenza generica: l'errore ha un
      costo asimmetrico — detrarre dove la concessione non lo ammette fa
      dichiarare all'ente **meno del dovuto**, e in quella direzione un
      ispettore non lo legge come una svista; non detrarre dove si potrebbe fa
      pagare di più, che è spiacevole e non pericoloso.
- [x] **18b. Decisa E costruita dal ciclo il 07/08: (a) NELL'ANNO IN CUI
      FINISCE**, perché è l'unica data verificabile. Ripartirlo vorrebbe dire
      volumi per stato d'avanzamento, che non esistono.
      ⛔ E la funzione dichiara **tre** stati, non due: *completa*, *assente*
      (un lotto ha finito e nessuno ha scritto il volume — la detrazione che
      esce è INCOMPLETA, non parziale) e *illeggibile* (il volume c'è ma non è
      un numero: è un dato da riparare, non lavoro da fare). L'incompletezza
      arriva fino agli **avvisi** e alla **riga del foglio** che va all'ente:
      una bandiera che non legge nessuno non protegge niente, e qui il numero
      tranquillo lo leggerebbe un ispettore.
      Prove: `run-kpi` 1853 → **1860**, sette casi compreso quello in cui uno
      **zero dichiarato** è una misura e un vuoto no.

## Cosa procede intanto SENZA di te
I cicli automatici continuano su ciò che è sicuro e non gated: seconde
iterazioni UX delle app, test aggiuntivi, revisioni di qualità/sicurezza,
ricerca competitor (repo `ecosistema-vault`). **Fatto nei cicli recenti** (tutto
verificato, niente di gated): ricerca+conteggio su TUTTE le liste delle 6 app,
**modifica in-place** dei record (prima solo aggiungi/elimina), export CSV completo,
e l'irrobustimento del visore drone (LAS, conteggio ritaglio). Le voci numerate qui
sopra restano in attesa finché non le sblocchi in conversazione.

**Fatto nella settimana del 27–30/07**, sempre senza toccare niente di gated: la
**vetrina dell'ecosistema** (`/apps/`, nove riquadri con la schermata vera di
ogni strumento), i **grafici** in tutte le app da un motore scritto in casa,
**sei ponti** veri fra le app, l'**estetica unificata**, e le convenzioni
condivise su numeri, unità di misura e soldi.

**Le prove automatiche sono passate a 2.346** *(ricontate l'08/08 lanciando le
suite)*, più **123** che girano con l'emulatore Firestore (**75** sulle regole
di sicurezza, 19 sull'SDK, 21 sulle funzioni, 8 sul primo avvio) e **153
esecuzioni** che aprono davvero le pagine in un browser.

Nella sola giornata del 31/07 le prove sulle funzioni delle app sono passate da
**433 a 971**, e hanno fatto emergere **otto difetti veri**. I tre che pesano di
più: il grafico «ultimi 6 mesi» del core riempiva ogni barra con la produzione
del **mese precedente** (chiave del mese letta a Greenwich, etichetta letta in
Italia); un **ruolo di sicurezza obbligatorio** risultava coperto quando la
persona nominata non era più in azienda; e una **misura del sismografo spariva**
dal report che va all'ente, scambiata per un doppione. Da lì è nato anche un
controllo nuovo: le suite si rilanciano con l'**orologio italiano**, perché il
contenitore è a Greenwich e in UTC quei difetti erano invisibili.

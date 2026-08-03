# Decisioni del fondatore — checklist per la revisione del weekend

Questo file è un **indice unico** delle decisioni che spettano a te
(Giuseppe) e che i cicli automatici NON prendono da soli. Ogni voce dice:
cosa è già pronto, quale decisione serve, e dove sono i passi di dettaglio.
Niente qui viene attivato senza una tua conferma esplicita in chat.

Spuntare `[ ]` → `[x]` quando la decisione è presa; poi il ciclo automatico
può procedere con l'attuazione.

---

# 📖 Da dove cominciare — le decisioni aperte sono **19**

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

## 🟢 Le quindici che posso portare avanti io, se non dici niente

*Erano diciannove. Le **quattro gemelle — 13, 14, 16, 17** — le hai decise tu
il 02/08 con una riga sola («vai»), e sono state attuate lo stesso giorno.*

Sono scelte di **prodotto**, non di sicurezza. Per ognuna ho una risposta che mi
convince, e sotto trovi la ragione per esteso. **Se entro la settimana non dici
niente, procedo con la colonna «la mia risposta» e lo scrivo nel commit**, così
resta chiaro che l'ha decisa il ciclo e non tu — e si cambia in qualunque
momento.

| # | la domanda, in una riga | la mia risposta |
|---|---|---|
| **5a** | come suona il messaggio quando un salvataggio non riesce | «non è stato salvato», mai un codice d'errore |
| **5b** | il lavoro **senza rete** (giro macchina, appello al fronte) | **sì**, ma prima misuro cosa succede a due persone che scrivono la stessa riga |
| **6** | la geometria del fronte in Genesi | resta com'è finché non c'è un volo vero da confrontare (dipende da **7**) |
| **8** | quale funzione nuova per prima nelle app | quella che l'ispettore chiede per prima, non quella più citata dai concorrenti |
| **10a** | l'abbonamento è una **barriera vera**? | sì: se hai solo Campo, Scudo non si apre |
| **10b** | chi può **cancellare** dentro l'azienda | solo chi ha creato l'organizzazione, e con conferma scritta |
| **10c** | al primo cliente, un utente solo o più | più utenti: una cava ha almeno il titolare e il capocava |
| **11a** | Deepwork è il **diario**, Genesi il **tavolo da disegno** | confermo: è la frase che regge alla domanda «perché due app» |
| **11b** | le tre sovrapposizioni fra i due | si tolgono da Deepwork, che è il posto dove pesano di più |
| **11c** | alla presentazione: due app o una | **due**, e si mostra il ponte fra loro — è la cosa che i concorrenti non hanno |
| **12a** | export dei dati **ri-caricabile** | sì: senza, il cliente ha una copia che non sa rimettere dentro |
| **12b** | oppure dirlo in chiaro prima del pilota | si fa **comunque**, anche con l'export: è onestà, non un ripiego |
| ~~**13**~~ | ✅ **DECISA E FATTA il 02/08** — mansione senza requisiti | «non lo sappiamo»: il riepilogo passa da `puo 3/6` a `puo 2, nonSo 1` |
| ~~**14**~~ | ✅ **DECISA E FATTA il 02/08** — DPI senza data di sostituzione | «attenzione»: da «regolare» e zero allarmi a «senza data», 1 allarme |
| **15** | dove vive «Il Quadro», il cruscotto del titolare | nel **core**: è la cosa che il titolare apre per prima |
| ~~**16**~~ | ✅ **DECISA E FATTA il 02/08** — punto senza soglia | stato a sé: il report per l'ente non scrive più «conforme» su un limite mai stabilito |
| ~~**17**~~ | ✅ **DECISA E FATTA il 02/08** — infortunio a prognosi aperta | si distingue da «0»: prima era «un infortunio che non è costato una giornata» |
| **18a** | il volume rimesso per il **recupero** si toglie dall'onere? | è un'opzione nella scheda del titolo: cambia da Regione a Regione |
| **18b** | un recupero **a cavallo di due anni** | conta nell'anno in cui **finisce** |

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

- [ ] (a) Stile del messaggio deciso
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
- [ ] Confermata la geometria del fronte (per sbloccare P1.1/P1.2)

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
- [ ] Scelta la prossima feature app (o "nessuna per ora")

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
ed è provato** (58 test). Dentro la stessa azienda, invece, non c'è ancora
nessuna separazione: chi è stato invitato per compilare i rapportini può anche
**cancellare una fattura**, e un cliente abbonato solo a un'app può leggere e
scrivere i dati di tutte le altre.

- [ ] **10a.** L'abbonamento dev'essere una **barriera vera** (chi ha solo Campo
      non tocca i dati di Terra nemmeno volendo), oppure basta che l'interfaccia
      non mostri le app non comprate? La prima è più corretta e costa mezza
      giornata di lavoro sui claims.
- [ ] **10b.** **Chi può cancellare**, dentro l'azienda? La proposta minima:
      cancellare e correggere un documento **già emesso** (una fattura, un
      documento consegnato all'ente) solo a chi amministra; scrivere cose nuove
      resta a tutti.
- [ ] **10c.** Al primo cliente, **un utente solo o più utenti?** Se più utenti,
      la 10b va chiusa **prima** del primo cliente, non dopo.

Finché non rispondi, `firestore.rules` resta com'è e le 58 prove continuano a
passare.

## 11. Perché esistono sia Deepwork sia Genesi
*(nuova, 30/07 · dettaglio in `docs/PERCHE_DEEPWORK_E_GENESI.md`)*

Alla presentazione arriverà: «ma la volata non la fa già Deepwork?». La risposta
proposta è che Deepwork è il **diario** (registra quello che è stato fatto) e
Genesi il **tavolo da disegno** (progetta quello che si farà). Il documento
elenca anche le tre sovrapposizioni vere.

- [ ] **11a.** Confermi la divisione «diario / tavolo da disegno»? È la frase che
      finisce nel materiale di presentazione e nei testi delle due app.
- [ ] **11b.** Delle tre sovrapposizioni (due motori 3D, la maglia salvata in due
      formati, la parola «volata» che significa due cose), **quali chiudiamo e in
      che ordine?**
- [ ] **11c.** Alla presentazione le mostriamo come **due app distinte** o come
      **una app con due modi?** Cambia il racconto, non il codice.

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

| Cosa | Dove | Perché fa male perderla |
|---|---|---|
| **pesate e DDT** | Conti | è il documento di consegna: mesi di lavoro, e sono la base delle fatture |
| **incassi** (prima nota) | Conti | date e importi veri dei pagamenti ricevuti |
| **clienti** | Conti | anagrafica con partita IVA, PEC/SDI, fido |
| **azioni correttive** | Scudo | registro che un ispettore può chiedere |
| **rilievi drone** | Terra | volumi che consumano la concessione |
| **registro volate** | Sentinella | documento regolatorio |

- [ ] **12a.** Vuoi che i cicli automatici costruiscano l'export ri-caricabile
      per queste sei? È lavoro fattibile e senza rischio (nessun dato nuovo:
      solo un secondo file, nel formato dell'import), ma **sono sei unità** e
      tolgono tempo ad altro. Se sì, **con quale ordine di priorità?**
- [ ] **12b.** In alternativa, prima del pilota basta **dirlo in chiaro** al
      cliente («la copia di sicurezza copre questo, non quest'altro»)? È già
      scritto nel documento di onboarding, ma è una scelta commerciale: la
      dico io o la dici tu?

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

- [ ] **15.** Dove vive «Il Quadro»: **(a)** nel core, **(b)** una app nuova `apps/quadro/`, **(c)** dentro Deepwork ID?

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

- [ ] **18a.** La detrazione per recupero: **(a)** si applica alla base dell'onere, **(b)** non si applica, o **(c)** è un'opzione che il cliente accende nella scheda del titolo?
- [ ] **18b.** Un recupero a cavallo di due anni conta **(a)** nell'anno in cui finisce, o **(b)** va ripartito?

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

**Le prove automatiche sono passate a 1.948** *(ricontate il 02/08 lanciando le
suite)*, più **106** che girano con l'emulatore Firestore (58 sulle regole di
sicurezza, 19 sull'SDK, 21 sulle funzioni, 8 sul primo avvio) e **19** banchi
che aprono davvero le pagine in un browser.

Nella sola giornata del 31/07 le prove sulle funzioni delle app sono passate da
**433 a 971**, e hanno fatto emergere **otto difetti veri**. I tre che pesano di
più: il grafico «ultimi 6 mesi» del core riempiva ogni barra con la produzione
del **mese precedente** (chiave del mese letta a Greenwich, etichetta letta in
Italia); un **ruolo di sicurezza obbligatorio** risultava coperto quando la
persona nominata non era più in azienda; e una **misura del sismografo spariva**
dal report che va all'ente, scambiata per un doppione. Da lì è nato anche un
controllo nuovo: le suite si rilanciano con l'**orologio italiano**, perché il
contenitore è a Greenwich e in UTC quei difetti erano invisibili.

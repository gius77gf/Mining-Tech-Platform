# Deepwork ID + Hub — ricerca luglio 2026: cosa c'è, cosa rischia, cosa manca

Documento di ricerca (nessuna modifica al codice). Riguarda la **fondazione**
dell'ecosistema: Deepwork ID (chi sei, di quale azienda fai parte, cosa puoi
vedere) e l'**hub** (la pagina che presenta tutte le app).

Scritto in italiano semplice. Dove una cosa **non si può fare** senza spendere,
è scritto chiaro. Vincolo rispettato in tutto il documento: **piano Firebase
gratuito (Spark)**, quindi **le Cloud Functions non girano**. Ogni proposta dice
se funziona gratis o se richiede il piano Blaze (a consumo, con carta
registrata — oggi non attivo per decisione del fondatore).

**Sintesi in tre righe.** La parte più difficile è già fatta e testata bene:
l'isolamento tra aziende concorrenti. Quello che manca è tutto il contorno che
trasforma una fondazione tecnica in un prodotto che un'azienda può davvero
iniziare a usare: **far entrare i colleghi senza le Cloud Functions**, **ruoli
che rispecchino i mestieri della cava**, e **la parte privacy/GDPR** — senza la
quale un cliente serio non firma.

---

## 1. Cosa c'è già oggi (inventario onesto)

Letto direttamente dal codice, non dai documenti di progetto.

### 1.1 Accesso (autenticazione)
`apps/deepwork-id/index.html` (179 righe) + SDK.
- Registrazione e accesso con **email e password**, accesso con **Google**,
  accesso **anonimo** per la modalità tour.
- **Email di verifica** inviata subito dopo la registrazione, con pulsante
  "invia di nuovo" nella pagina di attesa.
- **Password dimenticata**: email di reset (funzione standard di Firebase,
  gratuita).
- Messaggi d'errore già tradotti in italiano comprensibile (credenziali errate,
  email già usata, troppi tentativi…).
- Se il progetto Firebase non risponde, la pagina non muore: resta in
  "anteprima mockup" con un avviso.

### 1.2 Organizzazioni, membri, inviti
- **Modello dati**: `organizations/{orgId}` con dentro `members/{uid}`,
  `entitlements/{appId}` e `apps/{appId}/…` (i dati veri delle app). Gli inviti
  stanno in una collezione a parte, `invites/{id}`.
- **Pagina profilo** (`profilo.html`): elenco delle organizzazioni di cui fai
  parte, cambio di organizzazione attiva con un tocco, creazione di una nuova
  organizzazione, invito di un collega via email, griglia delle 8 app con
  "Attiva / Non inclusa".
- **Pagina amministrazione** (`admin.html`): elenco membri con cambio ruolo,
  rimozione, elenco inviti in attesa con revoca e giorni alla scadenza
  (14 giorni).
- **Pagina "account in attesa"** (`non-autorizzato.html`): spiega a chi si è
  appena registrato che serve un invito, con pulsante "controlla ora" e la
  scorciatoia "sono il titolare, creo l'azienda".

### 1.3 Ruoli
Esistono **tre soli ruoli**, uguali per tutte le app:
`owner` (titolare: tutto, abbonamenti inclusi) · `admin` (gestisce membri e
inviti) · `member` (usa le app). Nel documento di architettura era previsto un
campo `appRoles` (ruolo diverso per ogni app), ma **non è implementato da
nessuna parte**: non nelle regole, non nell'SDK, non nelle funzioni.

### 1.4 Isolamento tra aziende (il cuore)
`apps/deepwork-id/firestore.rules` (102 righe).
- Principio **tutto negato di default**; si apre solo ciò che serve.
- L'appartenenza si legge dai **custom claim** del token
  (`request.auth.token.orgs[orgId]`), che il cliente **non può scrivere**.
- I dati delle app vivono sotto `organizations/{orgId}/apps/{appId}/…`: una
  sola regola copre tutte le collezioni, anche quelle che verranno inventate
  domani.
- I **membri** non sono scrivibili dal client (nemmeno da un admin: niente
  auto-promozioni); gli **entitlement** (abbonamenti) sono in sola lettura.
- Tenant **demo** (`org_demo`): leggibile da chiunque sia autenticato, mai
  scrivibile.

### 1.5 SDK condiviso
`shared/deepwork-id-client/index.js` (325 righe) — è il punto unico da cui
passano tutte le app: login, lettura dei claim, scelta dell'organizzazione
attiva, lettura degli abbonamenti e soprattutto **`orgCollection(nome)`**, che
sigilla ogni accesso ai dati sull'organizzazione giusta. Verificato: le 6 app
verticali lo usano davvero e **nessuna costruisce percorsi a mano** (vedi
`docs/AUDIT_ISOLAMENTO_APP.md`).
`shared/deepwork-id-client/dw-shell.js` (149 righe) contiene gli strumenti
condivisi di sicurezza/formato: `esc` (anti-XSS), `csvCell`/`parseCsvLine`
(anti-formule nei CSV), numeri e date all'italiana.

### 1.6 Cloud Functions — scritte ma **non attive**
`apps/deepwork-id/functions/index.js` (245 righe): 7 funzioni ben fatte
(creazione organizzazione, invito, accettazione inviti con email verificata
obbligatoria, cambio ruolo, rimozione membro, revoca invito, ricostruzione dei
claim a ogni modifica). Hanno guardrail seri: mai lasciare l'organizzazione
senza owner, solo un owner tocca gli owner, un invito non può declassare chi è
già dentro.
**Ma girano solo sul piano Blaze**: oggi **non sono deployate**. Tutto ciò che
passa da lì (creare l'azienda da soli, invitare, cambiare ruolo, rimuovere un
membro) **oggi non funziona**.

### 1.7 Il percorso gratuito già previsto
`apps/deepwork-id/scripts/bootstrap-owner.mjs` (88 righe): script da lanciare
**una volta in locale** con la chiave di servizio. Crea l'organizzazione, rende
owner il fondatore e accende gli 8 abbonamenti. È la scorciatoia onesta che
permette di partire live senza spendere. Runbook completo in
`apps/deepwork-id/ATTIVAZIONE_LIVE.md`, guida per il fondatore in
`GUIDA_FIREBASE.md`.

### 1.8 Test
`apps/deepwork-id/tests/` — **105 test** automatici sull'emulatore Firebase
(58 sulle regole di sicurezza e sull'isolamento, 20 sulle Cloud Functions,
19 sull'SDK, 8 sul bootstrap), più le suite separate su helper, KPI, nuvole di
punti e manifest. I test provano scenari veri: "il concorrente non legge, non
scrive, non cancella, non elenca" anche in profondità, anche sulle collezioni
nuove.

### 1.9 L'hub (`apps/index.html`, 103 righe)
Pagina statica con 9 riquadri (le 8 app + Deepwork ID), etichette di stato
("In produzione", "Sviluppo attivo", "Demo interattiva") e un invito al tour.
**Non sa chi sei**: nessun login, nessuna organizzazione, nessuna indicazione di
cosa sia incluso nel tuo abbonamento. I link portano direttamente dentro le app,
saltando l'accesso.

### 1.10 Stato reale di attivazione
Nell'SDK la configurazione Firebase è ancora un **segnaposto**
(`PLACEHOLDER_IN_ATTESA_DEL_PROGETTO`): finché il fondatore non crea il progetto
sulla console, **tutto l'ecosistema gira in modalità dimostrativa**, con dati in
memoria che spariscono chiudendo la pagina.

---

## 2. Rischi ancora aperti

`docs/AUDIT_SICUREZZA.md` copre già in dettaglio i rischi del **core storico**
(password in chiaro, XSS, iniezione CSV) e non li ripeto qui. Questi sono
**nuovi**, e riguardano Deepwork ID e l'hub.

### 🔴 R1 — Senza Blaze, metà delle funzioni di gestione non funziona
Non è un buco di sicurezza: è un muro. I pulsanti "Crea organizzazione",
"Invita", "cambia ruolo", "Rimuovi" chiamano Cloud Functions che non esistono
in produzione. Un cliente che li tocca riceve un errore generico. Oggi l'unico
modo per far entrare qualcuno in un'azienda è lo script manuale del punto 1.7,
che richiede l'intervento del fondatore per ogni singola persona.
**Conseguenza pratica: l'ecosistema è vendibile a UNA azienda alla volta, a
mano.** È il primo problema da risolvere (vedi proposta P1).

### 🟠 R2 — L'abbonamento non è applicato davvero
> **✅ MISURATO il 30/07** — non è più un'ipotesi. Con un'organizzazione
> abbonata solo a Scudo, l'emulatore risponde `PERMESSO` a: leggere i fronti di
> Terra, scriverci, leggere una fattura di Conti. Il verbale sta in
> `docs/REVISIONE_SICUREZZA_202607.md`, la sonda che lo rifà in un comando in
> `apps/deepwork-id/tests/sonda-permessi.mjs`. Da allora il rischio è anche
> **cresciuto di attualità**: i ponti fra le app hanno reso normale il gesto di
> puntare l'SDK sull'`appId` di un'altra app, e da fuori un accesso legittimo e
> uno abusivo sono identici.
L'SDK ha `hasEntitlement()`, ma **nessuna app lo chiama**: entrano in modalità
"live" solo verificando di essere membri di un'organizzazione. E le regole di
sicurezza permettono a qualunque membro di leggere e scrivere in
`apps/{appId}/…` **senza guardare l'abbonamento**. Quindi la griglia "Attiva /
Non inclusa" del profilo oggi è **solo un'etichetta**: chi ha il link entra
comunque. Non è un problema di isolamento tra aziende (quello regge), è un
problema commerciale: quando ci saranno più clienti con piani diversi, non c'è
niente che faccia rispettare il piano. Nota minore collegata: il commento
dell'SDK cita un metodo `showLocked()` che **non esiste**.

### 🟠 R3 — Tutti i membri possono tutto
> **✅ MISURATO il 30/07**: un membro semplice (né proprietario né
> amministratore) modifica il totale di una fattura e la cancella. Non è una
> deduzione dalle regole — è la risposta dell'emulatore. Vedi
> `docs/REVISIONE_SICUREZZA_202607.md`.
Con soli tre ruoli e nessun `appRoles`, un operatore che usa Campo per il
rapportino può anche **aprire Conti e cancellare le fatture**, o modificare le
scadenze di sicurezza in Scudo. Non serve malafede: bastano un dito sbagliato e
un tablet condiviso. È anche la prima domanda che farà l'ufficio
amministrativo di un cliente.

### 🟠 R4 — La revoca di un accesso non è immediata
I permessi viaggiano dentro il token, che si rinnova **circa ogni ora**. Se
domani si licenzia una persona e la si rimuove, quella persona può continuare a
leggere i dati **fino a un'ora**. Con il percorso gratuito attuale (claim scritti
a mano dallo script) la situazione è peggiore: finché non si rilancia lo script,
**il claim resta valido**. Su dati di cantiere e di personale non è accettabile
per un cliente attento.

### 🟡 R5 — Le regole non controllano *cosa* viene scritto
Le regole verificano **chi** scrive e **dove**, ma non la forma dei dati:
nessun limite di dimensione, nessun campo obbligatorio, nessun campo immutabile.
Un membro (o un'app con un errore) può riempire l'organizzazione di documenti
mal formati o enormi. Lo stesso vale per `users/{uid}`: ognuno può scrivere
qualsiasi campo nel proprio profilo (oggi innocuo perché si legge solo
`defaultOrgId`, ma è una porta lasciata aperta).

### 🟡 R6 — L'invito è creabile dal client senza controllo del ruolo
Le regole permettono a un admin di **creare direttamente** un documento in
`invites` con qualunque contenuto, incluso `role: "owner"`. Oggi è innocuo
perché l'accettazione passa dalla Cloud Function, che riporta il ruolo a
`admin`/`member`. Ma se un domani l'accettazione venisse spostata sul client
(cosa che la proposta P1 rende tentante), quella riga diventerebbe una **scala
verso i privilegi di titolare**. Da fissare *prima* di toccare il flusso.

### 🟡 R7 — Nessuna traccia degli accessi
Non esiste un registro di chi è entrato, chi ha invitato chi, chi ha cambiato un
ruolo, chi ha cancellato un documento. Serve per due motivi diversi: capire cosa
è successo dopo un problema, e rispondere a un cliente o a un'autorità che lo
chiede (in Italia la tracciabilità degli amministratori è materia del Garante,
con conservazione di almeno 6 mesi).

### 🟡 R8 — Sessione senza scadenza, nessuna 2FA
L'accesso resta valido a tempo indeterminato sul dispositivo (comportamento
predefinito di Firebase). Su un PC d'ufficio cava o un tablet di cantiere
condiviso, chi si siede dopo entra nell'account di prima. Non c'è blocco per
inattività né richiesta di password per le azioni delicate. La **2FA** non è
disponibile su Firebase Auth base: richiede l'upgrade a Identity Platform, e la
variante via SMS richiede comunque il Blaze.

### 🟡 R9 — Il tour promette dati che non esistono
Le regole aprono in lettura l'organizzazione `org_demo`, ma **nessuno script la
riempie**: su Firestore è vuota. Il tour funziona solo perché ogni app ha dati
finti in memoria. Va bene, ma allora la regola sul tenant demo è oggi codice non
usato: o si semina l'organizzazione demo, o si dice chiaro che il tour è
interamente lato browser.

### 🟡 R10 — "Sto salvando" vs "non sto salvando"
Quando il backend non risponde, le app scivolano in modalità dimostrativa e
accettano comunque input. In amministrazione c'è una nota che lo dice; nelle app
l'indicazione è meno visibile. Rischio concreto in fase di collaudo: il cliente
inserisce un'ora di dati veri e li perde chiudendo la pagina.

### 🟢 R11 — Limite di dimensione dei permessi nel token
I custom claim hanno un tetto di **1000 byte**. La mappa `orgs` cresce con il
numero di organizzazioni: un consulente esterno che seguisse decine di cave
potrebbe avvicinarsi al limite. È lontano, ma va saputo prima di scoprirlo in
produzione.

---

## 3. Cosa manca per l'adozione reale da parte di un cliente

### 3.1 Onboarding — è qui che si perde il cliente
La ricerca sull'adozione dei gestionali dice sempre la stessa cosa: si abbandona
per **confusione iniziale** e per la **schermata vuota** del primo giorno, non
per mancanza di funzioni. Oggi mancano cinque cose, tutte fattibili gratis:

1. **L'invito non arriva.** Nel codice delle funzioni c'è scritto letteralmente
   `TODO: email di notifica all'invitato`. Anche con il Blaze acceso, oggi
   l'invitato **non riceve nessuna email**: bisogna avvisarlo a voce e sperare
   che si registri con l'indirizzo giusto.
2. **Nessun percorso guidato.** Dopo il primo accesso il titolare vede un
   profilo con dei campi, ma nessuno gli dice: *crea l'azienda → invita i
   colleghi → carica l'anagrafica → apri la prima app*. La guida ai CSV esiste
   già ed è buona (`docs/ONBOARDING_DATI.md`), ma vive fuori dall'app.
3. **Nessun dato di partenza nella propria azienda.** O si carica un CSV subito,
   o si guarda il vuoto.
4. **L'hub non accompagna.** Presenta le app come un volantino, non come un
   posto di lavoro: non dice chi sei, in quale azienda sei, cosa è incluso.
5. **Nessun modo di capire se sta funzionando.** Nessuna schermata dice
   "collegato all'azienda X, dati salvati sul cloud".

### 3.2 Ruoli — quelli veri di una cava
I tre ruoli attuali sono ruoli *da software* (owner/admin/member). Servono i
ruoli *da cava*, perché è così che il cliente ragiona. Proposta di mappatura,
da confermare con il fondatore:

| Ruolo reale | Cosa deve poter fare | Come lo realizziamo |
|---|---|---|
| **Titolare** | tutto, abbonamento e fatturazione incluse | `owner` (già c'è) |
| **Direttore di cava** | tutte le app operative, gestisce le persone | `admin` (già c'è) |
| **Amministrativo / ufficio** | Conti pieno, Scudo in lettura, resto in lettura | `admin` + ruolo per app |
| **Responsabile sicurezza (RSPP/RLS)** | Scudo pieno (anche dati sanitari), Sentinella pieno, resto in lettura | ruolo per app |
| **Capoturno / preposto** | Campo pieno, Flotta pieno, Scudo in lettura | ruolo per app |
| **Operatore / fochino** | scrive il proprio rapportino, legge il piano del giorno; **niente** Conti | ruolo per app, in scrittura limitata |
| **Consulente esterno** (RSPP, commercialista, geometra) | **una sola app**, in **una sola azienda**, **con scadenza** | ruolo per app + data di fine |

Due dettagli che contano più di quanto sembri: il **consulente esterno** è un
caso reale e frequente (lo stesso RSPP segue più cave, anche concorrenti — il
modello multi-organizzazione è già pronto per questo), e l'accesso a termine
serve perché i consulenti cambiano.

### 3.3 GDPR — il capitolo che oggi non esiste
Nell'ecosistema si trattano **dati di dipendenti**, e in Scudo anche
**l'idoneità sanitaria**, che è un dato sulla salute (categoria particolare,
art. 9 GDPR). Questo cambia il livello di attenzione richiesto, anche per
un'azienda piccola.

Manca tutto il minimo indispensabile, e sono quasi tutte cose da **scrivere**,
non da programmare:
- **Informativa privacy** e pagina "come trattiamo i dati" nelle app. Assente.
- **Nomina a responsabile del trattamento (art. 28)**: il cliente è il titolare
  dei dati, Deepwork è il responsabile. Serve un contratto/allegato da far
  firmare. Assente. Senza, un cliente strutturato non parte.
- **Registro dei trattamenti** (modello per il cliente + il nostro): il Garante
  lo raccomanda a tutti, e con dati sanitari l'esonero sotto i 250 dipendenti
  **non vale**.
- **Diritto alla cancellazione**: oggi le regole vietano la cancellazione del
  profilo dal client e la funzione che dovrebbe farlo non gira. Non esiste
  nessuna procedura, nemmeno manuale documentata.
- **Retention**: nessuna regola su per quanto si conservano scadenze, rapportini
  e documenti dopo che un dipendente se ne va.
- **Esportazione dei dati di una persona** (diritto di accesso): non c'è.
- **Registro accessi** (vedi R7).
- **Dove stanno i dati**: Firestore è già configurato in Europa (`eur3`, scelta
  giusta e da valorizzare in vendita), ma va verificato e scritto nero su bianco
  che alcuni servizi di autenticazione trattano dati fuori dall'Unione. Va
  dichiarato nell'informativa, non nascosto.

---

## 4. Tabella delle proposte

Difficoltà: **S** = mezza giornata · **M** = 1-3 giorni · **L** = più di 3
giorni. "Blaze" = richiede il piano a pagamento.

| # | Nome | Cosa fa | Perché serve | Diff. | Priorità |
|---|---|---|---|---|---|
| **P1** | **Inviti e ruoli senza Cloud Functions** | Le regole di sicurezza smettono di fidarsi solo del token: accettano anche il **documento di appartenenza** (`members/{uid}` attivo). L'invitato può così crearsi la membership da solo se esiste un invito valido per la sua email verificata | Sblocca il muro R1 **gratis**: inviti, cambio ruolo e rimozione funzionano senza Blaze. In più risolve R4: la revoca diventa **immediata**, non "entro un'ora" | M | **ALTA** |
| **P2** | **Blindatura delle regole prima di P1** | Valida i campi degli inviti (mai `owner`), rende immutabili `orgId`/`uid`, limita i campi scrivibili di `users`, mette tetti di dimensione | Chiude R5 e R6. **Va fatto prima di P1**, altrimenti P1 apre una scala ai privilegi di titolare | M | **ALTA** |
| **P3** | **Codice d'invito da consegnare a mano** | L'admin genera un codice breve; il collega lo incolla al primo accesso ed entra | Senza Blaze non possiamo mandare email (vedi P13): il codice via WhatsApp o a voce è l'unico modo che funziona davvero oggi | S | **ALTA** |
| **P4** | **Hub che sa chi sei** | L'hub mostra profilo, azienda attiva, badge "inclusa / non inclusa" per ogni app, pulsante Accedi/Esci, e porta al login invece che dentro le app | Oggi l'hub è un volantino (R2, §3.1). È anche la schermata che il cliente vede per prima | S | **ALTA** |
| **P5** | **Percorso guidato primo accesso** | Una lista di 5 passi con spunte nel profilo: crea azienda → invita → carica anagrafica → apri l'app → primo dato inserito | È la differenza documentata fra un gestionale adottato e uno abbandonato | M | **ALTA** |
| **P6** | **Informativa privacy + nomina responsabile art. 28 + registro trattamenti** | Tre documenti: pagina informativa nelle app, bozza di contratto da far firmare al cliente, modello di registro | Senza questi un cliente strutturato non firma, e con i dati sanitari di Scudo non è opzionale | S (scrittura) | **ALTA** |
| **P7** | **Avviso "modalità dimostrativa" uniforme** | Banda sempre visibile quando i dati non vengono salvati, uguale in tutte le app | Evita che un cliente in collaudo perda un'ora di lavoro (R10) | S | **ALTA** |
| **P8** | **Ruoli di mestiere (`appRoles`)** | Il ruolo per app previsto in architettura: chi tocca cosa, applicato **nelle regole** e non solo nei menù | Chiude R3, ed è la richiesta n.1 di ogni ufficio amministrativo | L | **MEDIA-ALTA** |
| **P9** | **Abbonamento applicato davvero** | Le app chiamano `hasEntitlement()` e mostrano la schermata "non inclusa"; le regole verificano l'entitlement prima di scrivere | Chiude R2. Serve prima di avere il secondo cliente, non prima del primo | M | **MEDIA** |
| **P10** | **Registro accessi e azioni per azienda** | Collezione `audit` dentro l'organizzazione, scrivibile solo in aggiunta (mai modifica, mai cancellazione) | Chiude R7 e prepara il requisito italiano sulla tracciabilità. **Onestà**: senza server è un registro *utile*, non *inviolabile* — un client manomesso può omettere di scrivere | M | **MEDIA** |
| **P11** | **Sessione più prudente** | Sessione che finisce alla chiusura del browser sui dispositivi condivisi + uscita automatica dopo inattività + richiesta password per le azioni delicate | Chiude R8 nella parte gratuita e realistica | S | **MEDIA** |
| **P12** | **Cava di esempio dentro la propria azienda** | Un pulsante "riempi con dati di esempio" e un pulsante "cancella tutto" | Elimina la schermata vuota del primo giorno senza inquinare i dati veri | M | **MEDIA** |
| **P13** | **Cancellazione account e dati (diritto all'oblio)** | Procedura scritta + script locale come il bootstrap: cancella profilo, membership e dati collegati su richiesta | Obbligo GDPR. Gratis nella versione manuale; automatica solo con Blaze | S | **MEDIA** |
| **P14** | **Politica di conservazione (retention)** | Decidere e scrivere per quanto si tengono scadenze, rapportini, documenti; segnare i dati oltre soglia | Obbligo GDPR, e riduce il disordine nel database | S | **MEDIA** |
| **P15** | **Seed dell'organizzazione demo** | Popolare `org_demo` su Firestore e collegarci il tour, oppure togliere la regola non usata | Chiude R9: oggi c'è una regola che non protegge niente | S | **BASSA** |
| **P16** | **Struttura tecnica dei piani (senza attivare pagamenti)** | Aggiungere ai dati dell'organizzazione: numero di **cave/siti**, moduli inclusi, data di fine prova, `seats`. Nessun pagamento, solo la struttura | Per un verticale di nicchia il prezzo **per cava** regge meglio del prezzo per utente (in cava ci sono molti utenti saltuari). Averlo pronto evita una migrazione dolorosa dopo | M | **BASSA** |
| **P17** | **Irrobustimento accessi Firebase** | Password minima più lunga, verifica che la protezione contro l'enumerazione email sia attiva, valutazione di App Check | Difese standard, quasi tutte a costo zero (App Check da verificare in console prima di attivarlo) | S | **BASSA** |
| **P18** | **2FA per titolare e amministratori** | Secondo fattore per chi può gestire membri e abbonamenti | Utile ma **non gratuito**: richiede l'upgrade a Identity Platform, e la variante SMS richiede il Blaze. Da rimandare | M | **BASSA (Blaze)** |
| **P19** | **Email di invito automatica** | L'invitato riceve davvero un messaggio con il link | Richiede Cloud Functions o l'estensione Trigger Email → **Blaze**. Fino ad allora vale P3 | S | **BASSA (Blaze)** |
| **P20** | **Deploy delle Cloud Functions già scritte** | Le 7 funzioni esistenti (con i loro guardrail) entrano in servizio | È la soluzione "pulita" a R1/R4, ma **richiede il Blaze**. P1 ottiene quasi lo stesso risultato gratis | S | **BASSA (Blaze)** |

### Ordine consigliato per partire
1. **P2** (blindare le regole) — sempre prima di toccare i permessi.
2. **P1 + P3** (inviti che funzionano davvero, gratis): è ciò che trasforma
   "una azienda a mano" in "un cliente che si arrangia".
3. **P4 + P7** (hub consapevole, avviso modalità dimostrativa): due interventi
   piccoli con effetto immediato su come il prodotto viene percepito.
4. **P6** (documenti privacy): non è codice, ma senza non si vende.
5. **P5**, poi **P8**.

Tutto il blocco 1-5 sta **dentro il piano gratuito**.

---

## 5. Fonti

### Multi-tenant su Firebase, regole e permessi
- [Control Access with Custom Claims and Security Rules — Firebase](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Manage User Sessions — Firebase (revoca token, sessioni)](https://firebase.google.com/docs/auth/admin/manage-sessions)
- [Writing conditions for Cloud Firestore Security Rules — Firebase](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Test your Cloud Firestore Security Rules — Firebase](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Firebase security checklist — Google](https://firebase.google.com/support/guides/security-checklist)
- [Patterns for security with Firebase: supercharged custom claims (Doug Stevenson)](https://medium.com/firebase-developers/patterns-for-security-with-firebase-supercharged-custom-claims-with-firestore-and-cloud-functions-bb8f46b24e11)
- [How to build a team-based user management system with Firebase (inviti senza server)](https://medium.com/firebase-developers/how-to-build-a-team-based-user-management-system-with-firebase-6a9a6e5c740d)
- [How do you model Firestore multi-tenant data for speed and safety?](https://wild.codes/candidate-toolkit-question/how-do-you-model-firestore-multi-tenant-data-for-speed-and-safety)
- [Multi-Tenant Architecture Patterns for SaaS (2025)](https://zenn.dev/shineos/articles/saas-multi-tenant-architecture-2025?locale=en)
- [5 Multi-Tenant SaaS Architecture Best Practices — AWS](https://aws.amazon.com/isv/resources/5-multi-tenant-saas-architecture/)

### Piani Firebase, costi e limiti (verifica del vincolo "nessuna spesa")
- [Understand Cloud Firestore billing — Firebase](https://firebase.google.com/docs/firestore/pricing)
- [Differences between Identity Platform and Firebase Authentication — Google Cloud](https://docs.cloud.google.com/identity-platform/docs/product-comparison)
- [Add multi-factor authentication to your web app — Firebase](https://firebase.google.com/docs/auth/web/multi-factor)
- [Spark vs Blaze: the Firebase pricing guide](https://dev.to/androve2k/spark-vs-blaze-the-firebase-pricing-guide-i-wish-id-read-sooner-onb)
- [Firebase Authentication pricing spiegato (2026) — Logto](https://blog.logto.io/firebase-authentication-pricing)

### Sicurezza applicativa
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP — Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Enable or disable email enumeration protection — Google Cloud](https://docs.cloud.google.com/identity-platform/docs/admin/email-enumeration-protection)
- [Firebase Authentication and Identity Platform user enumeration — SlashID](https://www.slashid.dev/blog/firebase-auth-vulnerability/)
- [Firebase authentication — best practices for password requirements](https://flamesshield.com/blog/auth-best-practices-for-firebase/)

### GDPR e log (contesto italiano)
- [Registro dei trattamenti GDPR — guida e modello](https://privacy-legale.it/risorse/registro-trattamenti-gdpr)
- [Log Management: cos'è e perché è un obbligo normativo — GDPR Lab](https://gdprlab.it/log-management-cosa-e-e-perche-e-un-obbligo-normativo/)
- [Tracciabilità e conservazione dei log degli amministratori di sistema](https://www.fabersystem.it/compliance-gdpr-tracciabilita-e-conservazione-dei-log-degli-ads/)
- [Conservazione dei log: misura di sicurezza o violazione della privacy?](https://www.privacystudio.it/conservazione-dei-log-misura-sicurezza-violazione-della-privacy/)
- [Firebase Data Processing and Security Terms — Google](https://firebase.google.com/terms/data-processing-terms)
- [Privacy and Security in Firebase — Google](https://firebase.google.com/support/privacy)

### Ruoli e controllo accessi
- [Role-Based Access Control: guida completa — ICT Security Magazine](https://www.ictsecuritymagazine.com/articoli/role-based-access-control/)
- [Scopriamo il Role-Based Access Control — Cyber Security 360](https://www.cybersecurity360.it/outlook/role-based-access-control/)
- [Corso per la figura professionale di "Capo Cava" — Quarry & Construction](https://quarryandconstructionweb.it/rubriche/collaborazioni/corso-di-formazione-indirizzato-alla-figura-professionale-di-capo-cava/)

### Onboarding, adozione e abbonamenti
- [Guide for SaaS onboarding — best practices 2025 + checklist](https://www.insaim.design/blog/saas-onboarding-best-practices-for-2025-examples)
- [B2B SaaS Onboarding — the complete product manager's guide](https://productfruits.com/blog/b2b-saas-onboarding)
- [New Customer Onboarding Checklist for B2B SaaS Companies](https://trainn.co/blog/new-customer-onboarding-checklist-for-b2b-saas-companies/)
- [SaaS empty state design: 9 patterns that drive activation](https://pixxen.com/blog/saas-empty-state-design/)
- [16 Empty State Design Examples From Top B2B Products](https://memorable.design/empty-state-design-examples/)
- [How to create a winning pricing strategy for your vertical SaaS startup](https://www.getmonetizely.com/articles/how-to-create-a-winning-pricing-strategy-for-your-vertical-saas-startup-in-niche-markets)
- [How to manage entitlements with feature flags — LaunchDarkly](https://launchdarkly.com/blog/how-to-manage-entitlements-with-feature-flags/)
- [Entitlements untangled: the modern way to software monetization — Stigg](https://www.stigg.io/blog-posts/entitlements-untangled-the-modern-way-to-software-monetization)

### Navigazione e "hub" di più app
- [UX navigation design: common patterns and best practices — Eleken](https://www.eleken.co/blog-posts/ux-navigation-design)
- [Navigation for mobile applications (springboard / hub-and-spoke) — IxDF](https://www.interaction-design.org/literature/article/show-me-the-way-to-go-anywhere-navigation-for-mobile-applications)
- [Dashboard design UX patterns — Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)

### Contesto settore (software gestionali per cave in Italia)
- [Project Building — software impianti e cave](https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html)
- [Vincro — software gestione cave inerti](https://www.vincro.it/software-di-pesatura/software-gestione-cave/)
- [InfoMinds — gestionale per produttori di inerti](https://infominds.eu/settori/edilizia/produttori-inerti-calcestruzzo-cave/)

---

## Documenti collegati (già nel repo, non ripetuti qui)
- `docs/AUDIT_SICUREZZA.md` — rischi del core storico (password, XSS, CSV).
- `docs/AUDIT_ISOLAMENTO_APP.md` — verifica che le 6 app usino `orgCollection`.
- `docs/ISOLAMENTO_CORE.md` — piano per portare il core dentro il multi-tenant.
- `docs/ONBOARDING_DATI.md` — come preparare i CSV per caricare una cava.
- `apps/deepwork-id/ARCHITETTURA.md` · `GUIDA_FIREBASE.md` · `ATTIVAZIONE_LIVE.md`.

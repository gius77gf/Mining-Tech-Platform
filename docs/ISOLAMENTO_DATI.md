# Isolamento dei dati — come teniamo separate aziende concorrenti

Data: 2026-07-21 · Per Giuseppe e, in versione sintetica, per l'IT di un
cliente prudente. Deepwork si vende ad aziende di cava **spesso concorrenti
tra loro**: la promessa numero uno è che **ogni azienda vede solo i propri
dati**, mai quelli di un'altra. Questo foglio spiega **come** lo garantiamo e
**come lo dimostriamo** — in parole semplici e senza promesse vuote.

## L'idea in una frase
Ogni azienda (organizzazione) ha uno **spazio dati sigillato**; l'app può
puntare **solo** dentro quello spazio; e comunque a decidere se una richiesta
è lecita è il **server**, non l'app — così nemmeno un programma manomesso può
sbirciare in casa d'altri.

## Le tre barriere (una dietro l'altra)

### 1) Spazio dati separato per ogni azienda
I dati di ogni organizzazione stanno sotto un percorso dedicato:
`organizations/{azienda}/apps/{app}/…`. I dati di Cava Alfa e quelli di Cava
Beta non si trovano mai nello stesso cassetto: sono in cassetti diversi,
etichettati con l'identità dell'azienda.

### 2) L'app punta solo al proprio spazio
Tutte le app accedono ai dati **esclusivamente** tramite l'SDK Deepwork ID
(la funzione `orgCollection`), che costruisce il percorso a partire
dall'azienda dell'utente **loggato**. Nessuna app costruisce percorsi "a mano":
non esiste un punto del codice in cui si possa digitare l'ID di un'altra
azienda. È una regola vincolante del progetto (CLAUDE.md).

### 3) Il server controlla ogni richiesta (la barriera vera)
Anche se qualcuno aggirasse l'app (browser modificato, chiamata diretta), a
decidere è il **motore di sicurezza di Firestore**, lato server, con regole
che diciamo noi:
- una richiesta è permessa **solo** se il "biglietto d'identità" dell'utente
  (un *custom claim* firmato, rilasciato dal server al login) dichiara che è
  **membro di quella precisa azienda** (`memberOf`);
- tutto ciò che non è esplicitamente permesso è **negato** da una regola
  finale "nega tutto" (`allow read, write: if false`);
- il biglietto d'identità **non lo scrive l'utente**: lo mette il server. Un
  utente non può "auto-nominarsi" membro di Cava Beta.

Risultato: un utente di Cava Alfa che chiede dati di Cava Beta viene
**respinto dal server**, a prescindere da cosa fa la sua app.

## Come lo dimostriamo (non è solo una promessa)
La sicurezza non si "spera": si **verifica automaticamente**. Ci sono **44
test** che girano sul **vero motore di regole** (emulatore Firestore) a **ogni
modifica** (integrazione continua). Tra questi, casi espliciti in cui un
"concorrente" prova ad accedere ai dati di un'altra azienda e **deve fallire**:
- il concorrente **NON legge** i dati di un'altra azienda;
- **NON scrive** e **NON cancella** i dati altrui;
- **NON legge** né i membri, né gli abbonamenti, né gli inviti altrui;
- **NON crea, cancella o manomette** gli inviti di un'altra azienda (nessun
  "dirottamento");
- vale anche per le **collezioni nuove**: la regola copre in automatico ogni
  app aggiunta in futuro, senza dover ritoccare la sicurezza ogni volta.
Se anche uno solo di questi controlli fallisse, la modifica **non passa** in
CI: la separazione è protetta contro le regressioni.

## La modalità "tour" (dati di esempio)
Chi non ha un login vede una **demo** con dati finti, in **sola lettura**: non
può scrivere sul tenant demo (anche questo è testato). Serve a mostrare le app
a un commerciale senza toccare dati veri di nessuno.

## Onestà tecnica (i limiti)
- L'isolamento è garantito da **regole server + biglietti d'identità
  firmati**. Perché sia attivo servono due cose: il **progetto Firebase
  creato** (Passo 1 del PIANO_GO_LIVE) e le **regole pubblicate**. Finché il
  live non è acceso, tutto questo gira e si testa sull'emulatore, non su dati
  di clienti reali.
- La correttezza dipende dal fatto che i biglietti d'identità (i claim) siano
  assegnati **solo** dal server (via Cloud Function / bootstrap owner): è così
  per come è costruito il sistema, ed è coperto dai test dei ruoli.
- Nessun sistema è "magico": la garanzia è forte **perché** il controllo è sul
  server e **perché** è verificato in continuo — non perché lo diciamo noi.

## In una frase per un cliente
«I vostri dati stanno in uno spazio separato, l'app può accedere solo al
vostro, e comunque è il server a bloccare qualunque richiesta che non provenga
da un vostro utente autorizzato — e lo verifichiamo con decine di test
automatici a ogni rilascio.»

---
Riferimenti tecnici (per chi sviluppa): `apps/deepwork-id/firestore.rules`
(funzione `memberOf`, match `apps/{appId}/{document=**}`, catch-all "nega
tutto"); test in `apps/deepwork-id/tests/run.mjs` (44 test regole, sezione
isolamento concorrente); accesso dati sempre via
`shared/deepwork-id-client` (`orgCollection`).

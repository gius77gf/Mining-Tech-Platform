# Isolamento multi-tenant del CORE — piano onesto

Data: 2026-07-21 · Per Giuseppe (parte semplice) e per lo sviluppo (parte
tecnica). Decisione del fondatore (21/07): «un domani l'app dovrà essere
rivenduta a più aziende e quindi si dovranno isolare i dati di ognuna».
Questo documento dice **dov'è oggi** il cuore, **cosa serve davvero** per
isolarlo e **in che ordine** farlo senza rompere l'app in produzione né creare
un falso senso di sicurezza.

> Nota: «core / cuore» = il file `index.html` alla radice (rapportini, chat,
> personale, volate…), la PWA su Netlify collegata al progetto Firebase
> `deepwork-app-6c56f`. È l'app STORICA, nata per **una sola azienda**.
> L'ecosistema `apps/*` (le 6 app nuove) è invece GIÀ multi-tenant.

## In una frase (per Giuseppe)
Oggi il cuore tiene i dati in cassetti **condivisi** (va bene per una sola
azienda). Per venderlo a più aziende servono due cose, in quest'ordine:
1. mettere i dati di ogni azienda in un **cassetto etichettato** con il suo
   nome (lavoro nostro, relativamente semplice);
2. mettere una **serratura vera controllata dal server** su ogni cassetto, così
   che nemmeno un programma manomesso possa aprire quello di un'altra azienda
   (questa è la parte importante e più delicata: oggi manca del tutto perché
   il login del cuore è "leggero", fatto solo dal browser).

Attenzione: fare solo il punto 1 **NON basta** e sarebbe pericoloso — darebbe
l'illusione della sicurezza. La promessa vera (vedi `ISOLAMENTO_DATI.md`) è il
punto 2. Quindi si fanno entrambi, ma con onestà su cosa protegge cosa.

## Stato attuale (verificato nel codice, 21/07)
- **Percorsi dati globali**: tutte le collezioni stanno alla radice del
  database (`users`, `rapportini`, `rapportiniFoc`, `volate`, `sismogrammi`,
  `cave`, `clienti`, `personale`, `mezziLav`, `mezziStr`, `deposito_punte`,
  `deposito_aste`, `deposito_lubr`, `messaggi`, `promemoria`, `config`,
  `auditLog`). Nessun prefisso per organizzazione.
- **Nessuna autenticazione server-side**: il login (`doLogin` → `verifyPassword`)
  confronta la password lato **browser** con un hash salvato nel documento
  utente. Non c'è Firebase Auth, non ci sono *custom claim* firmati, non c'è
  `request.auth`. Quindi **il server oggi non sa "chi" sta chiedendo i dati**.
- **Regole Firestore del cuore non versionate**: nel repo c'è solo
  `apps/deepwork-id/firestore.rules` (per l'ecosistema). Le regole del progetto
  `deepwork-app-6c56f` vivono solo nella console Firebase → primo gap da
  colmare: portarle nel repo.
- **Buona notizia**: il data-layer è **centralizzato**. Le scritture passano da
  4 funzioni (`fbSet/fbUpdate/fbDelete/fbAdd`); le letture da un unico blocco di
  caricamento; il seed da `seedDB`. Questo rende il punto 1 (etichettare i
  cassetti) un intervento localizzato e a basso rischio.

## Le due barriere (target)
Allineiamo il cuore allo STESSO modello già collaudato nell'ecosistema
`apps/*`:
1. **Percorso dati per organizzazione**: il cuore vive come **app `core`**
   dentro l'org — ogni collezione va sotto
   `organizations/{orgId}/apps/core/{collezione}/{id}` invece che alla radice.
   Così è coperto dalla STESSA regola generica già provata delle app
   (`apps/{appId}/**`), senza regole nuove, e i segmenti del percorso restano
   validi. L'app costruisce il percorso SOLO da un `orgId` centrale, mai a mano.
2. **Identità autenticata + regole server**: introdurre l'autenticazione
   (Firebase Auth) e i *custom claim* di appartenenza (`memberOf`), rilasciati
   dal server, esattamente come fa Deepwork ID per le app. Le regole Firestore
   permettono l'accesso a `organizations/{orgId}/…` **solo** se il claim
   dell'utente dichiara che è membro di `orgId`; default finale `deny all`.
   Questa è la barriera VERA: senza di essa il punto 1 è cosmetico.

Opzione architetturale consigliata: **far dipendere il cuore da Deepwork ID**
(come già le app: login/abbonamenti/isolamento), invece di reinventare
l'autenticazione nel monolite. Riusa infrastruttura già testata (44 test
emulatore) e mantiene un solo modello di identità in tutto l'ecosistema.

## Piano a fasi (sicuro, incrementale)
- **Fase 0 — Design + audit** (questo documento). ✅
- **Fase 1 — Indirezione del data-layer** *(sicura, mergeabile)* ✅: introdotti
  helper `dcol(col)`/`ddoc(col,id)`; TUTTI gli accessi (39: 4 helper + blocco
  letture + seed + riferimenti sparsi) passano da lì. Dietro flag
  `MULTI_TENANT` **spento**: con flag spento i percorsi restano IDENTICI a oggi
  (comportamento invariato in produzione), ma tutto l'accesso passa da un solo
  punto → il passaggio a org-scoped (`apps/core/…`) è una modifica localizzata.
- **Fase 2 — Regola + test d'isolamento** ✅: il cuore vive come app `core`, già
  coperto dalla regola generica `apps/{appId}/**` (nessuna regola nuova).
  Aggiunti **8 test emulatore** che provano l'isolamento del cuore tra org
  concorrenti (il concorrente NON legge/scrive/cancella/elenca i dati
  `apps/core/**` di un'altra org, anche in profondità). Regole totali: 44 → 52.
- **Fase 3 — Autenticazione vera** *(gated)*: Firebase Auth + claim `memberOf`
  (via Deepwork ID). È la barriera server-side. Richiede decisioni/infra del
  fondatore (progetto Firebase, eventuali Cloud Functions).
- **Fase 4 — Migrazione dati + attivazione** *(gated, tocca dati di produzione)*:
  copiare i dati esistenti sotto `organizations/{orgPrimaria}/apps/core/…`, poi
  accendere il flag. Da fare con backup e finestra concordata col fondatore.

## Cosa è sicuro fare SUBITO vs cosa è gated
- SUBITO (nessun rischio in produzione): Fase 0 (design), Fase 1 (indirezione a
  flag spento, comportamento identico), Fase 2 (regole nel repo + test, senza
  attivarle in console).
- GATED (serve il fondatore / tocca produzione): Fase 3 (auth) e Fase 4
  (migrazione + attivazione del flag). Come per `MITIGAZIONE_PASSWORD.md`: si
  PREPARA tutto, si ATTIVA solo su conferma esplicita.

## Rischi da tenere a mente
- Il cuore fa **deploy automatico su Netlify a ogni merge su main**: ogni
  modificina va verificata (`node --check` del modulo + boot Playwright) e non
  deve cambiare i percorsi dati finché la migrazione non è pronta.
- Il cuore **non ha test automatici** del comportamento Firestore (a differenza
  delle app). La Fase 1 è resa sicura dal flag spento (trasformazione a
  identità), ma è l'argomento per aggiungere, in Fase 2, dei test.
- **Falso isolamento**: mai comunicare "isolamento multi-tenant" finché non c'è
  la barriera server-side (Fase 3). Prima di allora la separazione è solo
  logica/lato client.

## Prossimo passo
Fase 1: introdurre `dcol/ddoc` e instradarvi tutto il data-layer del cuore, con
`MULTI_TENANT=false` (comportamento invariato). Poi Fase 2 (regole nel repo).

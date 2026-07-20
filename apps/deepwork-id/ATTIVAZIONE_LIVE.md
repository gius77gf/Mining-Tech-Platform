# Attivazione live — runbook tecnico (per Claude)

Passi ESATTI da eseguire quando il fondatore ha creato il progetto
Firebase (vedi GUIDA_FIREBASE.md, lato fondatore) e incolla in chat il
blocco `firebaseConfig`. Ordine da rispettare. Tutto sul piano gratuito
(Spark): niente Cloud Functions, niente Blaze.

## 0. Prerequisiti che il fondatore ha già fatto
- Progetto creato, Authentication attiva (Email/password + Google +
  Anonimo), Firestore creato in **eur3** in modalità produzione.
- Il fondatore ha incollato il blocco `firebaseConfig = { ... }`.

## 1. Inserire la config nell'SDK
File: `shared/deepwork-id-client/index.js`, costante `FIREBASE_CONFIG`
(~riga 35). Sostituire i 3 segnaposto con i valori reali del blocco:
- `apiKey: "PLACEHOLDER_IN_ATTESA_DEL_PROGETTO"` → apiKey reale
- `authDomain: "PLACEHOLDER.firebaseapp.com"` → authDomain reale
- `projectId: "PLACEHOLDER"` → projectId reale
(Gli altri campi del blocco — storageBucket, messagingSenderId, appId —
NON servono: l'SDK usa solo questi tre per Auth + Firestore.)
Commit su branch di sessione → PR → merge (Netlify pubblica il core; le
app leggono l'SDK aggiornato).

## 2. Caricare le regole di sicurezza
Da `apps/deepwork-id/` (contiene firebase.json che punta a
firestore.rules). Serve firebase-tools (il binario è `firebase`; se
manca: `npm i -g firebase-tools`) + login del fondatore.
```
cd apps/deepwork-id
firebase login          # il fondatore autorizza nel browser
firebase deploy --only firestore:rules --project <projectId>
```
Verifica: nella console → Firestore → Regole compaiono quelle del repo
(memberOf, isDemoOrg, entitlements read-only…).
NB: le regole sono l'UNICO confine multi-tenant. Non lasciare mai il DB
in "modalità test" aperta.

**Indici**: per il percorso GRATUITO (solo bootstrap, niente Functions)
NON servono indici compositi: le app leggono con query semplici. Quando
in futuro attiverai il Blaze e le Cloud Functions, alcune query
(collectionGroup `members` per uid+status in rebuildClaims; inviti per
email+status; owner attivi per role+status) potrebbero richiedere un
indice: è già pronto `firestore.indexes.json` (con l'indice
collectionGroup members). Deploy allora con
`firebase deploy --only firestore` (rules + indici). Se la console
segnala un indice mancante con un link "crea indice", basta un clic.

## 3. Il fondatore si registra una volta
Nell'app Deepwork ID (login → Registrati) con gius77.gf@gmail.com, così
esiste in Authentication. Senza questo, il passo 4 non trova l'uid.

## 4. Bootstrap owner (crea org + owner + entitlement, gratis)
Serve la chiave di servizio: console → Impostazioni progetto → Account
di servizio → "Genera nuova chiave privata" → salva il JSON in locale
(MAI committarlo: è già coperto da .gitignore).
```
cd apps/deepwork-id
npm i firebase-admin        # se non presente
node scripts/bootstrap-owner.mjs <chiave.json> gius77.gf@gmail.com "<nome cava>"
```
Crea l'organizzazione, rende owner il fondatore, scrive i claim
`{orgs:{orgId:"owner"}}` e semina gli 8 entitlement (active:true,
tier:"full"). Cancellare la chiave di servizio dopo l'uso.

## 5. Verifica live
- Il fondatore fa **logout e login** (i claim si aggiornano al nuovo
  token): il profilo mostra l'organizzazione attiva e le 8 app "Attiva".
- Aprendo una delle app (es. Scudo): NIENTE banner "dati di esempio",
  mode-note = "Dati reali della tua organizzazione". Le aggiunte/
  modifiche persistono (ricaricando restano).
- Controprova isolamento: con un secondo account NON nell'org, le app
  cadono in demo (nessun dato reale visibile) — le regole negano.

## Note
- **Tour**: le 6 app verticali in tour usano dati demo IN MEMORIA (nei
  file `*-data.js`), non `org_demo` su Firestore. Non serve seminare
  `org_demo` per far funzionare il tour delle app.
- **Self-service org + inviti automatici**: restano in anteprima finché
  il fondatore non attiva il Blaze (Cloud Functions). Il bootstrap
  copre l'org del fondatore senza Blaze.
- Ogni nuovo cliente, finché niente Blaze, si attiva rilanciando il
  bootstrap con la sua email e nome org (dopo che si è registrato).

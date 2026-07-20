// ============================================================
// Bootstrap owner — script UNA TANTUM da eseguire in locale.
// A cosa serve: far partire l'ecosistema LIVE su Firestore SENZA
// Cloud Functions (quindi senza piano Blaze / senza spese), creando
// a mano la prima organizzazione e assegnando i custom claims al
// fondatore. Da quel momento le 6 app funzionano live per quell'org.
//
// Perché serve: i claims ({orgs: {orgId: ruolo}}) normalmente li
// scrive SOLO una Cloud Function; ma le Functions richiedono il piano
// Blaze. Con l'Admin SDK in locale (chiave di servizio) si possono
// scrivere una volta, gratis, aggirando quel vincolo per il bootstrap.
//
// COME USARLO (dopo la creazione del progetto Firebase — vedi
// GUIDA_FIREBASE.md):
//   1. Console Firebase → Impostazioni progetto → Account di servizio
//      → "Genera nuova chiave privata" → salva il file JSON.
//   2. In locale:  npm i firebase-admin
//   3. node bootstrap-owner.mjs <percorso-chiave.json> <email-fondatore> "<nome-organizzazione>"
//      es: node bootstrap-owner.mjs ./chiave.json gius77.gf@gmail.com "Cava Alfa Srl"
//
// L'utente con quella email DEVE essersi già registrato una volta
// nell'app (Deepwork ID → Registrati), così esiste in Authentication.
// Lo script trova il suo uid, crea l'org, lo rende owner e scrive il
// claim. Al successivo login vedrà l'organizzazione attiva.
//
// NON committare mai la chiave di servizio nel repo (è un segreto).
// ============================================================

import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const [keyPath, email, orgName] = process.argv.slice(2);
if (!keyPath || !email || !orgName) {
  console.error('Uso: node bootstrap-owner.mjs <chiave.json> <email> "<nome org>"');
  process.exit(1);
}

const cred = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(cred) });
const auth = getAuth();
const db = getFirestore();

const user = await auth.getUserByEmail(email).catch(() => null);
if (!user) {
  console.error(`Nessun utente con email ${email}. Registrati prima nell'app, poi rilancia.`);
  process.exit(1);
}

const orgRef = db.collection("organizations").doc();
await orgRef.set({ name: orgName, status: "active", ownerUid: user.uid, createdAt: FieldValue.serverTimestamp() });
await orgRef.collection("members").doc(user.uid).set({ uid: user.uid, role: "owner", status: "active", joinedAt: FieldValue.serverTimestamp() });
await auth.setCustomUserClaims(user.uid, { orgs: { [orgRef.id]: "owner" } });

console.log(`OK: organizzazione "${orgName}" creata (${orgRef.id}).`);
console.log(`${email} è ora OWNER. Esci e rientra nell'app per vederla attiva.`);
console.log("Le 6 app ora funzionano live su questa organizzazione (isolamento via rules).");

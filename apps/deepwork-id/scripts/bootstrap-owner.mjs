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
// NB: firebase-admin è importato in modo LAZY solo nel blocco CLI qui
// sotto, così questo modulo è importabile dai test (che stanno in
// tests/ e passano le proprie dipendenze) senza doverlo risolvere da
// scripts/. La logica riceve FieldValue come parametro per lo stesso
// motivo.

// Le app dell'ecosistema: le chiavi coincidono con l'appId di init.
export const APP_IDS = ["deepwork", "genesi", "scudo", "campo", "flotta", "conti", "sentinella", "terra"];

// Logica pura del bootstrap, testabile contro l'emulatore (riceve
// auth+db già inizializzati). Crea org + primo membro owner, scrive il
// claim {orgs:{orgId:"owner"}} e semina gli 8 entitlement pieni per
// l'org interna del fondatore (senza quei documenti la griglia
// "abbonamento" del profilo mostrerebbe tutto "Non inclusa"; sono
// l'accesso pieno del fondatore alla PROPRIA org, nessuna spesa — gli
// abbonamenti a pagamento dei clienti arriveranno col flusso di
// fatturazione). Ritorna l'orgId creato.
export async function bootstrapOwner(auth, db, email, orgName, FieldValue) {
  const user = await auth.getUserByEmail(email).catch(() => null);
  if (!user) throw new Error(`Nessun utente con email ${email}. Registrati prima nell'app, poi rilancia.`);

  const orgRef = db.collection("organizations").doc();
  await orgRef.set({ name: orgName, status: "active", ownerUid: user.uid, createdAt: FieldValue.serverTimestamp() });
  await orgRef.collection("members").doc(user.uid).set({ uid: user.uid, role: "owner", status: "active", joinedAt: FieldValue.serverTimestamp() });
  /* ⛔ SI FONDE, NON SI SOSTITUISCE — e non è prudenza: era un difetto vero,
     riprodotto l'08/08 con la prova che ora sta in `tests/run-bootstrap.mjs`.
     `setCustomUserClaims` rimpiazza l'INTERO oggetto delle rivendicazioni:
     scrivendo `{ orgs: { [nuova]: "owner" } }` un utente che apparteneva già a
     un'altra organizzazione ne usciva — in silenzio, senza errore, e la
     persona si ritrovava fuori da un'org in cui lavorava.
     Succede sul serio perché questo è il percorso «vai in live» che si lancia
     A MANO, quindi si rilancia: due volte per due cave, o una seconda volta
     dopo un errore di battitura sul nome. Le otto prove che c'erano guardavano
     tutte quello che lo script FA; nessuna quello che non deve rompere. */
  const attuali = user.customClaims || {};
  await auth.setCustomUserClaims(user.uid, {
    ...attuali,
    orgs: { ...(attuali.orgs || {}), [orgRef.id]: "owner" },
  });

  const batch = db.batch();
  for (const appId of APP_IDS) {
    batch.set(orgRef.collection("entitlements").doc(appId), {
      active: true, tier: "full", grantedAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  return orgRef.id;
}

// CLI: eseguito SOLO se lanciato direttamente (non all'import dai test).
if (import.meta.url === `file://${process.argv[1]}`) {
  const [keyPath, email, orgName] = process.argv.slice(2);
  if (!keyPath || !email || !orgName) {
    console.error('Uso: node bootstrap-owner.mjs <chiave.json> <email> "<nome org>"');
    process.exit(1);
  }
  const { initializeApp, cert } = await import("firebase-admin/app");
  const { getAuth } = await import("firebase-admin/auth");
  const { getFirestore, FieldValue } = await import("firebase-admin/firestore");
  const cred = JSON.parse(readFileSync(keyPath, "utf8"));
  initializeApp({ credential: cert(cred) });
  try {
    const orgId = await bootstrapOwner(getAuth(), getFirestore(), email, orgName, FieldValue);
    console.log(`OK: organizzazione "${orgName}" creata (${orgId}).`);
    console.log(`${email} è ora OWNER, con tutte e 8 le app attive nel profilo.`);
    console.log("Esci e rientra nell'app per vederla attiva.");
    console.log("Le app ora funzionano live su questa organizzazione (isolamento via rules).");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

// ============================================================
// Test dello script scripts/bootstrap-owner.mjs contro gli emulatori
// Auth + Firestore. È il percorso "vai in live GRATIS" del weekend
// (senza Cloud Functions/Blaze): crea org + owner + 8 entitlement.
// Verifica che produca esattamente lo stato che le app e il profilo
// si aspettano. Si esegue dentro npm test (firebase emulators:exec).
// ============================================================

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = "demo-deepwork";
const EMU = { host: "127.0.0.1", authPort: 9099, firestorePort: 8080 };

process.env.FIREBASE_AUTH_EMULATOR_HOST = `${EMU.host}:${EMU.authPort}`;
process.env.FIRESTORE_EMULATOR_HOST = `${EMU.host}:${EMU.firestorePort}`;
// DB pulito: altri file girano prima nella stessa sessione emulatore
await fetch(`http://${EMU.host}:${EMU.firestorePort}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
await fetch(`http://${EMU.host}:${EMU.authPort}/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE" });

const { initializeApp: adminInit } = await import("firebase-admin/app");
const { getFirestore: adminFirestore, FieldValue } = await import("firebase-admin/firestore");
const { getAuth: adminAuth } = await import("firebase-admin/auth");
const adminApp = adminInit({ projectId: PROJECT }, "bootstrap-test");
const adb = adminFirestore(adminApp);
const aauth = adminAuth(adminApp);

// lo script sotto test (import: la logica è esportata, la CLI NON parte)
const { bootstrapOwner, APP_IDS } = await import(join(HERE, "../scripts/bootstrap-owner.mjs"));

let passed = 0, failed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const expect = (c, why) => { if (!c) throw new Error(why); };

console.log("\n— Bootstrap owner: percorso live gratuito (weekend) —");

// il fondatore si è registrato una volta nell'app → esiste in Auth
await aauth.createUser({ uid: "founder", email: "gius@cava.it", password: "password-123" });
const orgId = await bootstrapOwner(aauth, adb, "gius@cava.it", "Cava del Fondatore", FieldValue);

await test("crea l'organizzazione con i metadati attesi", async () => {
  const org = (await adb.doc(`organizations/${orgId}`).get()).data();
  expect(org && org.name === "Cava del Fondatore" && org.status === "active" && org.ownerUid === "founder",
    JSON.stringify(org));
});
await test("il fondatore è membro OWNER attivo", async () => {
  const m = (await adb.doc(`organizations/${orgId}/members/founder`).get()).data();
  expect(m && m.role === "owner" && m.status === "active", JSON.stringify(m));
});
await test("il claim orgs:{orgId:'owner'} è scritto sull'utente", async () => {
  const u = await aauth.getUser("founder");
  expect(u.customClaims && u.customClaims.orgs && u.customClaims.orgs[orgId] === "owner",
    JSON.stringify(u.customClaims));
});
await test("tutte e 8 le app hanno un entitlement attivo (tier full)", async () => {
  const snap = await adb.collection(`organizations/${orgId}/entitlements`).get();
  expect(snap.size === APP_IDS.length, `attesi ${APP_IDS.length}, trovati ${snap.size}`);
  const tuttiAttivi = snap.docs.every(d => d.data().active === true && d.data().tier === "full");
  expect(tuttiAttivi, "qualche entitlement non è attivo/full");
  const chiavi = snap.docs.map(d => d.id).sort();
  expect(JSON.stringify(chiavi) === JSON.stringify([...APP_IDS].sort()),
    "le chiavi entitlement non coincidono con gli appId");
});
await test("un'email non registrata viene rifiutata con messaggio chiaro", async () => {
  let msg = "";
  try { await bootstrapOwner(aauth, adb, "nessuno@cava.it", "X", FieldValue); }
  catch (e) { msg = e.message; }
  expect(/Nessun utente/.test(msg), `messaggio inatteso: ${msg}`);
});

console.log(`\nRisultato Bootstrap: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

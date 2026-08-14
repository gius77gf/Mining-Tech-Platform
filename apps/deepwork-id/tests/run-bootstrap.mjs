// ============================================================
// Test dello script scripts/bootstrap-owner.mjs contro gli emulatori
// Auth + Firestore. È il percorso "vai in live GRATIS" del weekend
// (senza Cloud Functions/Blaze): crea org + owner + 8 entitlement.
// Verifica che produca esattamente lo stato che le app e il profilo
// si aspettano. Si esegue dentro npm test (firebase emulators:exec).
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
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

// ── Loop chiuso: il CLIENT SDK vede il risultato del bootstrap ──
// Rimappa gli import gstatic dell'SDK sui pacchetti npm (come run-sdk)
// e verifica l'esperienza REALE del fondatore dopo il bootstrap.
console.log("\n— Dopo il bootstrap: il client SDK vede owner + app attive —");
let clientSrc = readFileSync(join(HERE, "../../../shared/deepwork-id-client/index.js"), "utf8");
clientSrc = clientSrc
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-app\.js"/g, '"firebase/app"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-auth\.js"/g, '"firebase/auth"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-firestore\.js"/g, '"firebase/firestore"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-functions\.js"/g, '"firebase/functions"')
  .replace('projectId: "PLACEHOLDER"', `projectId: "${PROJECT}"`)
  .replace('apiKey: "PLACEHOLDER_IN_ATTESA_DEL_PROGETTO"', 'apiKey: "demo-api-key"');
const CLIENT_SDK = join(HERE, ".sdk-under-test-boot.mjs");
writeFileSync(CLIENT_SDK, clientSrc);
const { DeepworkID } = await import(CLIENT_SDK);

await test("login del fondatore → stato 'member' con l'org creata attiva", async () => {
  const id = await DeepworkID.init({ appId: "scudo", emulators: EMU });
  const st = await id.loginWithEmail("gius@cava.it", "password-123");
  expect(st === "member", `stato ${st}`);
  expect(id.orgId === orgId, `orgId ${id.orgId} != ${orgId}`);
  expect(id.role() === "owner", `ruolo ${id.role()}`);
  globalThis.__bootId = id;   // riuso nel test successivo
});
await test("hasEntitlement è vero per Scudo (app attiva dal bootstrap)", async () => {
  expect(globalThis.__bootId.hasEntitlement() === true, "Scudo non risulta attiva lato client");
});
await test("le 8 app risultano attive nel profilo (listEntitlements)", async () => {
  const ents = await globalThis.__bootId.listEntitlements();
  const attive = APP_IDS.filter(a => ents[a] && ents[a].active === true);
  expect(attive.length === APP_IDS.length, `attive ${attive.length}/${APP_IDS.length}`);
});

/* ⛔ E LA PROVA CHE IL PRIMO AVVIO NON BUTTI VIA LE RIVENDICAZIONI CHE TROVA
   **NON STA QUI**, e la ragione è misurata invece che stilistica.
   L'avevo scritta qui l'08/08 (il difetto era vero: `setCustomUserClaims`
   sostituisce l'intero oggetto, e chi apparteneva già a un'altra org ne
   usciva in silenzio). In casa passava, in CI cadeva. Causa: chiedeva **lo
   stato finale** delle rivendicazioni, e in quello stato ci scrive anche il
   trigger `onMemberWrite` → `rebuildClaims`, che rifà `orgs` **dalle
   membership vere** e scrive `{ orgs }` e basta. Qui l'emulatore delle
   FUNZIONI non parte (la politica di rete del contenitore lo nega), quindi
   la misura di casa vedeva un mondo con **un solo scrittore**; la CI ne ha
   due. Stessa suite, stesso nome, due prove diverse.
   Dove le funzioni girano quello stato è **di `rebuildClaims`**, che è
   l'autorità sugli `orgs`. Il contratto di `bootstrapOwner` — che è una
   funzione pura di ciò che riceve — si prova senza emulatori, con due finti:
   `tests/bootstrap-rivendicazioni.mjs`, 7 asserzioni, controprova compresa. */

console.log(`\nRisultato Bootstrap: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

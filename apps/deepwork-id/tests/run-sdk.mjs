// ============================================================
// Test di FLUSSO dello SDK Deepwork ID (D5) contro gli emulatori
// Auth + Firestore. A differenza di run.mjs (che testa le rules),
// qui si esercita PROPRIO il codice dello SDK condiviso:
// login → claims → org attiva → orgCollection → isolamento.
// Gli import da gstatic vengono rimappati sui pacchetti npm
// equivalenti (stesse API) per girare in Node senza rete.
// Si esegue con: firebase emulators:exec --project demo-deepwork
//   "cd tests && npm test"   (run.mjs + questo)
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = "demo-deepwork";
const EMU = { host: "127.0.0.1", authPort: 9099, firestorePort: 8080 };

// ---- 1. prepara lo SDK sotto test (import npm al posto di gstatic) ----
let src = readFileSync(join(HERE, "../../../shared/deepwork-id-client/index.js"), "utf8");
src = src
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-app\.js"/g, '"firebase/app"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-auth\.js"/g, '"firebase/auth"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-firestore\.js"/g, '"firebase/firestore"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-functions\.js"/g, '"firebase/functions"')
  // config placeholder → progetto demo dell'emulatore
  .replace('projectId: "PLACEHOLDER"', `projectId: "${PROJECT}"`)
  .replace('apiKey: "PLACEHOLDER_IN_ATTESA_DEL_PROGETTO"', 'apiKey: "demo-api-key"');
const SDK_PATH = join(HERE, ".sdk-under-test.mjs");
writeFileSync(SDK_PATH, src);
const { DeepworkID } = await import(SDK_PATH);

// ---- 2. setup scenario con l'admin SDK (bypassa le rules) ----
process.env.FIREBASE_AUTH_EMULATOR_HOST = `${EMU.host}:${EMU.authPort}`;
process.env.FIRESTORE_EMULATOR_HOST = `${EMU.host}:${EMU.firestorePort}`;

// azzera gli emulatori: run.mjs (rules) gira PRIMA nella stessa
// sessione e lascia i suoi dati — questo test vuole un DB pulito
await fetch(`http://${EMU.host}:${EMU.firestorePort}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
await fetch(`http://${EMU.host}:${EMU.authPort}/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE" });
const { initializeApp: adminInit } = await import("firebase-admin/app");
const { getFirestore: adminFirestore } = await import("firebase-admin/firestore");
const { getAuth: adminAuth } = await import("firebase-admin/auth");
const adminApp = adminInit({ projectId: PROJECT });
const adb = adminFirestore(adminApp);
const aauth = adminAuth(adminApp);

await aauth.createUser({ uid: "tizio", email: "tizio@cava-alfa.it", password: "password-123" });
await aauth.setCustomUserClaims("tizio", { orgs: { orgA: "member" } });
await adb.doc("organizations/orgA").set({ name: "Cava Alfa", status: "active" });
await adb.doc("organizations/orgA/members/tizio").set({ uid: "tizio", role: "member", status: "active" });
await adb.doc("organizations/orgA/entitlements/scudo").set({ active: true, tier: "base" });
await adb.doc("organizations/orgB").set({ name: "Concorrente", status: "active" });
await adb.doc("organizations/orgB/apps/scudo/turni/seg").set({ nota: "SEGRETO" });
await adb.doc("organizations/org_demo").set({ name: "Demo Tour", status: "active" });
await adb.doc("organizations/org_demo/apps/scudo/turni/d1").set({ operaio: "Esempio" });

// ---- 3. test di flusso ----
let passed = 0, failed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const expect = (cond, why) => { if (!cond) throw new Error(why); };
const expectFail = async (p, why) => {
  try { await p; } catch (e) { return; }
  throw new Error(why);
};

console.log("\n— Flusso SDK: stati di autenticazione —");
const id = await DeepworkID.init({ appId: "scudo", emulators: EMU });
await test("senza login lo stato è 'anonymous'", async () => {
  expect(id.authState() === "anonymous", `stato ${id.authState()}`);
});
await test("registrazione nuova → 'unauthorized' (nessuna org)", async () => {
  const st = await id.registerWithEmail("nuovo@esempio.it", "password-456");
  expect(st === "unauthorized", `stato ${st}`);
});
await test("login di un membro → 'member' con org attiva e ruolo", async () => {
  const st = await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  expect(st === "member", `stato ${st}`);
  expect(id.orgId === "orgA", `orgId ${id.orgId}`);
  expect(id.role() === "member", `ruolo ${id.role()}`);
});

console.log("\n— orgCollection: percorso sigillato e isolamento —");
await test("orgCollection punta dentro la PROPRIA org", async () => {
  const path = id.orgCollection("turni").path;
  expect(path === "organizations/orgA/apps/scudo/turni", path);
});
await test("scrittura e rilettura via orgCollection (rules attive)", async () => {
  const { addDoc, getDocs } = await import("firebase/firestore");
  await addDoc(id.orgCollection("turni"), { operaio: "Mario", ore: 8 });
  const snap = await getDocs(id.orgCollection("turni"));
  expect(snap.size === 1, `attesi 1, trovati ${snap.size}`);
});
await test("la lettura dei dati del CONCORRENTE è respinta dalle rules", async () => {
  const { doc, getDoc } = await import("firebase/firestore");
  await expectFail(getDoc(doc(id._db, "organizations/orgB/apps/scudo/turni/seg")),
    "lettura orgB riuscita: isolamento violato!");
});
await test("aggiorna/rimuovi via doc(orgCollection(name), id) — pattern dei data layer", async () => {
  // Stesso identico pattern usato da scudo/campo/flotta/conti/sentinella/
  // terra per aggiorna() e rimuovi(): doc(collectionRef, docId).
  const { addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } = await import("firebase/firestore");
  const ref = await addDoc(id.orgCollection("turni"), { operaio: "Luca", ore: 6 });
  const dref = doc(id.orgCollection("turni"), ref.id);   // <-- niente path a mano
  await updateDoc(dref, { ore: 10 });
  expect((await getDoc(dref)).data().ore === 10, "updateDoc non applicato");
  await deleteDoc(dref);
  expect((await getDoc(dref)).exists() === false, "deleteDoc non ha rimosso");
});
await test("hasEntitlement vero per l'app abbonata (scudo)", async () => {
  expect(id.hasEntitlement() === true, "entitlement scudo non visto");
});
await test("un entitlement SCADUTO (validUntil nel passato) NON dà accesso", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await adb.doc("organizations/orgA/entitlements/scudo").set(
    { active: true, tier: "base", validUntil: Timestamp.fromMillis(Date.now() - 86400000) });
  await id._loadEntitlement();                 // ricarica l'entitlement dell'app
  expect(id.hasEntitlement() === false, "entitlement scaduto ancora valido!");
  // ripristino per i test successivi
  await adb.doc("organizations/orgA/entitlements/scudo").set({ active: true, tier: "base" });
  await id._loadEntitlement();
  expect(id.hasEntitlement() === true, "ripristino entitlement fallito");
});
await test("listEntitlements elenca gli abbonamenti dell'org", async () => {
  const ents = await id.listEntitlements();
  expect(ents.scudo && ents.scudo.active === true, JSON.stringify(ents));
});
await test("listMembers legge i membri della propria org", async () => {
  const mem = await id.listMembers();
  expect(mem.length === 1 && mem[0].uid === "tizio", JSON.stringify(mem));
});

console.log("\n— Igiene stato: cambio account / tour / expiry (fix review SDK) —");
await test("cambio account senza logout verso uno SENZA org: l'entitlement non resta", async () => {
  await aauth.createUser({ uid: "senzorg", email: "senzorg@nessuna.it", password: "password-000" }); // nessun claim orgs
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  expect(id.hasEntitlement() === true, "tizio dovrebbe avere scudo");
  await id.loginWithEmail("senzorg@nessuna.it", "password-000");   // SENZA logout
  expect(id.authState() === "unauthorized", `stato ${id.authState()}`);
  expect(id.hasEntitlement() === false, "entitlement dell'account precedente non azzerato!");
});
await test("loginTour ripulisce le org del login precedente (niente rientro via switchOrg)", async () => {
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");   // membro di orgA
  await id.loginTour();                                            // tour SENZA logout
  expect(id.authState() === "tour", `stato ${id.authState()}`);
  await expectFail(id.switchOrg("orgA"), "in tour non si deve poter rientrare in orgA");
});
await test("hasEntitlement gestisce validUntil come stringa ISO (niente crash)", async () => {
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  await adb.doc("organizations/orgA/entitlements/scudo").set(
    { active: true, tier: "base", validUntil: "2000-01-01T00:00:00Z" });   // ISO passata
  await id._loadEntitlement();
  expect(id.hasEntitlement() === false, "ISO passata non vista come scaduta");
  await adb.doc("organizations/orgA/entitlements/scudo").set(
    { active: true, tier: "base", validUntil: "2099-12-31T00:00:00Z" });   // ISO futura
  await id._loadEntitlement();
  expect(id.hasEntitlement() === true, "ISO futura non vista come valida");
  await adb.doc("organizations/orgA/entitlements/scudo").set({ active: true, tier: "base" });  // ripristino
  await id._loadEntitlement();
});
await test("listEntitlements segna 'attivo' (un'app scaduta non risulta inclusa)", async () => {
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  const { Timestamp } = await import("firebase-admin/firestore");
  await adb.doc("organizations/orgA/entitlements/genesi").set(
    { active: true, tier: "base", validUntil: Timestamp.fromMillis(Date.now() - 86400000) });  // scaduto
  const ents = await id.listEntitlements();
  expect(ents.scudo && ents.scudo.attivo === true, "scudo dovrebbe essere attivo");
  expect(ents.genesi && ents.genesi.attivo === false, "genesi scaduto dovrebbe avere attivo=false");
  await adb.doc("organizations/orgA/entitlements/genesi").delete();   // pulizia
});

console.log("\n— Multi-org: switchOrg —");
await test("membro di DUE org cambia org attiva e l'entitlement segue", async () => {
  await aauth.createUser({ uid: "consul", email: "consul@studio.it", password: "password-789" });
  await aauth.setCustomUserClaims("consul", { orgs: { orgA: "member", orgB: "member" } });
  await adb.doc("organizations/orgB/members/consul").set({ uid: "consul", role: "member", status: "active" });
  await adb.doc("organizations/orgA/members/consul").set({ uid: "consul", role: "member", status: "active" });
  await adb.doc("organizations/orgB/entitlements/scudo").set({ active: false });
  await id.logout();
  await id.loginWithEmail("consul@studio.it", "password-789");
  const prima = id.orgId;
  const altra = prima === "orgA" ? "orgB" : "orgA";
  await id.switchOrg(altra);
  expect(id.orgId === altra, `orgId ${id.orgId}`);
  const attesa = altra === "orgA";                       // scudo attivo solo in orgA
  expect(id.hasEntitlement() === attesa, "entitlement non ricaricato dopo switch");
  await expectFail(id.switchOrg("orgZ"), "switch verso org estranea riuscito");
});

console.log("\n— Modalità tour e uscita —");
await test("loginTour → 'tour' sul tenant demo, lettura ok", async () => {
  await id.logout();
  const st = await id.loginTour();
  expect(st === "tour", `stato ${st}`);
  expect(id.orgId === "org_demo", `orgId ${id.orgId}`);
  const { getDocs } = await import("firebase/firestore");
  const snap = await getDocs(id.orgCollection("turni"));
  expect(snap.size === 1, `attesi 1, trovati ${snap.size}`);
});
await test("in tour la SCRITTURA sul demo è respinta dalle rules", async () => {
  const { addDoc } = await import("firebase/firestore");
  await expectFail(addDoc(id.orgCollection("turni"), { hack: true }),
    "scrittura demo riuscita: tour non è sola-lettura!");
});
await test("logout → 'anonymous' e orgCollection non più usabile", async () => {
  await id.logout();
  expect(id.authState() === "anonymous", `stato ${id.authState()}`);
  await expectFail(Promise.resolve().then(() => id.orgCollection("turni")),
    "orgCollection senza org non ha alzato errore");
});

console.log(`\nRisultato SDK: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

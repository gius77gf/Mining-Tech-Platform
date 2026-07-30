// ============================================================
// Test delle Cloud Functions D4 (updateMemberRole / removeMember /
// revokeInvite / createOrganization) contro gli emulatori
// Auth + Firestore + Functions. Esercita i GUARDRAIL:
// - solo owner/admin gestiscono i membri
// - i ruoli owner li tocca solo un owner
// - MAI declassare/rimuovere l'ultimo owner attivo
// - revoca solo di inviti pendenti
// Si esegue con: firebase emulators:exec --project demo-deepwork
//   "cd tests && npm test"   (run.mjs + run-sdk.mjs + questo)
// ============================================================

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = "demo-deepwork";
const EMU = { host: "127.0.0.1", authPort: 9099, firestorePort: 8080, functionsPort: 5001 };

// SDK sotto test (stesso rimappaggio npm di run-sdk.mjs)
let src = readFileSync(join(HERE, "../../../shared/deepwork-id-client/index.js"), "utf8");
src = src
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-app\.js"/g, '"firebase/app"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-auth\.js"/g, '"firebase/auth"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-firestore\.js"/g, '"firebase/firestore"')
  .replace(/"https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\/firebase-functions\.js"/g, '"firebase/functions"')
  .replace('projectId: "PLACEHOLDER"', `projectId: "${PROJECT}"`)
  .replace('apiKey: "PLACEHOLDER_IN_ATTESA_DEL_PROGETTO"', 'apiKey: "demo-api-key"');
const SDK_PATH = join(HERE, ".sdk-under-test-fns.mjs");
writeFileSync(SDK_PATH, src);
const { DeepworkID } = await import(SDK_PATH);

// reset emulatori + setup admin
process.env.FIREBASE_AUTH_EMULATOR_HOST = `${EMU.host}:${EMU.authPort}`;
process.env.FIRESTORE_EMULATOR_HOST = `${EMU.host}:${EMU.firestorePort}`;
await fetch(`http://${EMU.host}:${EMU.firestorePort}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: "DELETE" });
await fetch(`http://${EMU.host}:${EMU.authPort}/emulator/v1/projects/${PROJECT}/accounts`, { method: "DELETE" });

const { initializeApp: adminInit } = await import("firebase-admin/app");
const { getFirestore: adminFirestore } = await import("firebase-admin/firestore");
const { getAuth: adminAuth } = await import("firebase-admin/auth");
const adminApp = adminInit({ projectId: PROJECT }, "fns-admin");
const adb = adminFirestore(adminApp);
const aauth = adminAuth(adminApp);

const mk = async (uid, role) => {
  await aauth.createUser({ uid, email: uid + "@cava-alfa.it", password: "password-123" });
  if (role) {
    await aauth.setCustomUserClaims(uid, { orgs: { orgA: role } });
    await adb.doc(`organizations/orgA/members/${uid}`).set({ uid, role, status: "active" });
  }
};
await adb.doc("organizations/orgA").set({ name: "Cava Alfa", status: "active" });
await mk("boss", "owner");
await mk("amm", "admin");
await mk("tizio", "member");

let passed = 0, failed = 0;
const test = async (name, fn) => {
  try { await fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const expect = (c, why) => { if (!c) throw new Error(why); };
const expectCode = async (p, frag, why) => {
  try { await p; } catch (e) {
    if (String(e.code || e.message).includes(frag)) return;
    throw new Error(why + " — errore diverso: " + (e.code || e.message));
  }
  throw new Error(why + " — nessun errore alzato");
};
const roleOf = async (uid) => (await adb.doc(`organizations/orgA/members/${uid}`).get()).data()?.role || null;
// Attende che i custom claims dell'utente (aggiornati dal trigger onMemberWrite
// in modo ASINCRONO) riflettano il ruolo atteso, prima di rifare login e
// chiamare una function che si basa su auth.token.orgs. Senza questa attesa il
// test è flaky: un token con claim ancora "vecchio" fa scattare il guardrail
// sbagliato (es. permission-denied invece di failed-precondition).
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitClaim = async (uid, orgId, role, tries = 60) => {
  for (let i = 0; i < tries; i++) {
    const u = await aauth.getUser(uid);
    if (u.customClaims && u.customClaims.orgs && u.customClaims.orgs[orgId] === role) return;
    await sleep(50);
  }
  throw new Error(`claim ${uid}.${orgId} non è diventato ${role} in tempo`);
};

const id = await DeepworkID.init({ appId: "deepwork-id", emulators: EMU });

console.log("\n— Guardrail gestione membri (Cloud Functions D4) —");
await test("un MEMBER non può cambiare ruoli", async () => {
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  await expectCode(id.updateMemberRole("amm", "member"), "permission-denied", "member ha cambiato un ruolo");
});
await test("un ADMIN promuove un member ad admin", async () => {
  await id.loginWithEmail("amm@cava-alfa.it", "password-123");
  await id.updateMemberRole("tizio", "admin");
  expect(await roleOf("tizio") === "admin", "ruolo non aggiornato");
  await id.updateMemberRole("tizio", "member");   // ripristino
});
await test("un ADMIN NON può creare un owner", async () => {
  await expectCode(id.updateMemberRole("tizio", "owner"), "permission-denied", "admin ha creato un owner");
});
await test("un ADMIN NON può toccare il ruolo di un owner", async () => {
  await expectCode(id.updateMemberRole("boss", "member"), "permission-denied", "admin ha declassato un owner");
});
await test("l'ULTIMO owner non può auto-declassarsi", async () => {
  // PERCHÉ QUI SI ASPETTA IL CLAIM, anche se il setup l'ha già scritto a mano.
  // Il file comincia cancellando TUTTI gli utenti Auth e TUTTI i documenti. La
  // cancellazione dei documenti fa scattare `onMemberWrite` sulle membership che
  // sta rimuovendo, e quel trigger — che arriva in RITARDO, dopo che `mk()` ha
  // già ricreato utente, claim e membership — ricalcola i ruoli e riscrive i
  // claims con quello che vede in quel momento. Se atterra nell'istante
  // sbagliato, azzera l'`owner` di boss: il login successivo prende un token
  // senza ruoli e la function risponde `permission-denied` invece del
  // `failed-precondition` che questa prova sta misurando.
  // Osservato in CI il 31/07 (due prove rosse, «no user record» nei log delle
  // functions); lo stesso commit è tornato verde al rilancio, che è la firma di
  // una corsa e non di una rottura. L'attesa qui la toglie di mezzo, ed è lo
  // stesso rimedio già usato due volte più sotto in questo file.
  await waitClaim("boss", "orgA", "owner");
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");
  await expectCode(id.updateMemberRole("boss", "admin"), "failed-precondition", "ultimo owner declassato");
});
await test("con un secondo owner il declassamento passa", async () => {
  await id.updateMemberRole("tizio", "owner");
  await id.updateMemberRole("boss", "admin");
  expect(await roleOf("boss") === "admin" && await roleOf("tizio") === "owner", "ruoli inattesi");
  // ripristino: tizio (ora owner) rimette boss owner e torna member. tizio è
  // diventato owner poco fa via trigger asincrono: attendo la propagazione del
  // claim prima del login, così il suo token dice "owner" e updateMemberRole
  // non viene respinto per permessi (stessa classe del fix sull'ultimo owner).
  await waitClaim("tizio", "orgA", "owner");
  await id.loginWithEmail("tizio@cava-alfa.it", "password-123");
  await id.updateMemberRole("boss", "owner");
  await id.updateMemberRole("tizio", "member");
});
await test("un ADMIN non può rimuovere un owner; l'ultimo owner non è rimovibile", async () => {
  await id.loginWithEmail("amm@cava-alfa.it", "password-123");
  await expectCode(id.removeMember("boss"), "permission-denied", "admin ha rimosso un owner");
  // il test precedente ha ripristinato boss=owner via trigger asincrono:
  // attendo che il claim sia propagato prima di loggarmi come boss, così il
  // suo token dice "owner" e si arriva al guardrail dell'ultimo owner.
  await waitClaim("boss", "orgA", "owner");
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");
  await expectCode(id.removeMember("boss"), "failed-precondition", "ultimo owner rimosso");
});
await test("un ADMIN rimuove un member", async () => {
  await id.loginWithEmail("amm@cava-alfa.it", "password-123");
  await id.removeMember("tizio");
  expect(await roleOf("tizio") === null, "member ancora presente");
});

console.log("\n— Inviti: creazione e revoca —");
await test("owner invita; la revoca funziona una sola volta", async () => {
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");
  const invId = await id.inviteMember("nuovo@collega.it", "member");
  expect(!!invId, "invito non creato");
  await id.revokeInvite(invId);
  const inv = (await adb.doc(`invites/${invId}`).get()).data();
  expect(inv.status === "revoked", "invito non revocato");
  await expectCode(id.revokeInvite(invId), "failed-precondition", "revoca doppia riuscita");
});
await test("un MEMBER non può invitare né revocare (anti-escalation)", async () => {
  await mk("operaio", "member");
  // un invito valido creato dall'owner
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");
  const invId = await id.inviteMember("tizia@collega.it", "member");
  // il member non può creare inviti...
  await id.loginWithEmail("operaio@cava-alfa.it", "password-123");
  await expectCode(id.inviteMember("altro@collega.it", "member"), "permission-denied", "member ha invitato");
  // ...né revocare quello esistente
  await expectCode(id.revokeInvite(invId), "permission-denied", "member ha revocato un invito");
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");   // ripristino lo stato per i test successivi
});
await test("createOrganization rende owner della nuova org", async () => {
  const orgId = await id.createOrganization("Cava Beta Srl");
  const m = (await adb.doc(`organizations/${orgId}/members/boss`).get()).data();
  expect(m && m.role === "owner", "creatore non owner");
});

console.log("\n— acceptInvites: valido vs scaduto —");
await test("un invito VALIDO viene riscattato → membership creata", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await aauth.createUser({ uid: "invA", email: "inva@studio.it", password: "password-123", emailVerified: true });
  await adb.collection("invites").doc("okInv").set({
    email: "inva@studio.it", orgId: "orgA", role: "member", status: "pending",
    expiresAt: Timestamp.fromMillis(Date.now() + 7 * 86400000) });
  await id.loginWithEmail("inva@studio.it", "password-123");
  const accepted = await id.redeemInvites();
  expect(accepted.includes("orgA"), "invito valido non riscattato");
  expect(await roleOf("invA") === "member", "membership non creata");
});
await test("un invito SCADUTO non dà membership e viene marcato 'expired'", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await aauth.createUser({ uid: "invB", email: "invb@studio.it", password: "password-123", emailVerified: true });
  await adb.collection("invites").doc("oldInv").set({
    email: "invb@studio.it", orgId: "orgA", role: "member", status: "pending",
    expiresAt: Timestamp.fromMillis(Date.now() - 86400000) });
  await id.loginWithEmail("invb@studio.it", "password-123");
  const accepted = await id.redeemInvites();
  expect(!accepted.includes("orgA"), "invito scaduto riscattato!");
  expect(await roleOf("invB") === null, "membership creata da invito scaduto!");
  const inv = (await adb.doc("invites/oldInv").get()).data();
  expect(inv.status === "expired", `stato invito ${inv.status}`);
});
await test("un invito NON è riscattabile da un'email diversa (isolamento inviti)", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await aauth.createUser({ uid: "estraneo", email: "estraneo@studio.it", password: "password-123", emailVerified: true });
  // invito destinato a un ALTRO indirizzo
  await adb.collection("invites").doc("altrui").set({
    email: "vittima@studio.it", orgId: "orgA", role: "member", status: "pending",
    expiresAt: Timestamp.fromMillis(Date.now() + 7 * 86400000) });
  await id.loginWithEmail("estraneo@studio.it", "password-123");
  const accepted = await id.redeemInvites();
  expect(!accepted.includes("orgA"), "invito altrui riscattato!");
  expect(await roleOf("estraneo") === null, "membership creata da invito altrui!");
  const inv = (await adb.doc("invites/altrui").get()).data();
  expect(inv.status === "pending", `l'invito altrui è stato toccato: ${inv.status}`);
});
await test("un'email NON verificata NON può riscattare inviti (anti-hijack)", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await aauth.createUser({ uid: "nonver", email: "nonver@studio.it", password: "password-123" }); // emailVerified=false
  await adb.collection("invites").doc("nvInv").set({
    email: "nonver@studio.it", orgId: "orgA", role: "member", status: "pending",
    expiresAt: Timestamp.fromMillis(Date.now() + 7 * 86400000) });
  await id.loginWithEmail("nonver@studio.it", "password-123");
  await expectCode(id.redeemInvites(), "unauthenticated", "email non verificata ha riscattato");
  expect(await roleOf("nonver") === null, "membership creata da email non verificata!");
  const inv = (await adb.doc("invites/nvInv").get()).data();
  expect(inv.status === "pending", `invito consumato da email non verificata: ${inv.status}`);
});
await test("un invito 'member' NON declassa un membro già esistente (no zero-owner)", async () => {
  const { Timestamp } = await import("firebase-admin/firestore");
  await adb.doc("organizations/orgT").set({ name: "Org Test", status: "active" });
  await aauth.createUser({ uid: "downg", email: "downg@studio.it", password: "password-123", emailVerified: true });
  await aauth.setCustomUserClaims("downg", { orgs: { orgT: "owner" } });
  await adb.doc("organizations/orgT/members/downg").set({ uid: "downg", role: "owner", status: "active" });
  await adb.collection("invites").doc("downgInv").set({
    email: "downg@studio.it", orgId: "orgT", role: "member", status: "pending",
    expiresAt: Timestamp.fromMillis(Date.now() + 7 * 86400000) });
  await id.loginWithEmail("downg@studio.it", "password-123");
  await id.redeemInvites();
  const mem = (await adb.doc("organizations/orgT/members/downg").get()).data();
  expect(mem && mem.role === "owner", `owner declassato da un invito member: ${mem && mem.role}`);
  const inv = (await adb.doc("invites/downgInv").get()).data();
  expect(inv.status === "accepted", `invito non consumato: ${inv.status}`);
});

console.log("\n— Membership orfana: il trigger non deve morire —");
await test("una membership SENZA utente Auth non uccide onMemberWrite", async () => {
  // IL RAMO CHE NESSUNO ESERCITAVA. `rebuildClaims` chiama `setCustomUserClaims`
  // su un uid che in Auth può non esistere — succede quando qualcuno cancella il
  // proprio profilo e la membership resta. Prima l'eccezione non gestita uccideva
  // il trigger, portandosi dietro le invocazioni legittime in volo; ora
  // `auth/user-not-found` si assorbe e si registra.
  // Come si misura che «non è morto»: si scrive la membership orfana e SUBITO
  // DOPO si cambia il ruolo di una persona vera. Se il trigger fosse ancora
  // fragile, quella seconda scrittura troverebbe il runtime a terra e il claim
  // non arriverebbe. È una prova indiretta perché non c'è modo diretto di
  // chiedere a Firebase «sei ancora vivo?», ed è dichiarata tale.
  await adb.doc("organizations/orgA/members/fantasma").set({
    uid: "fantasma", role: "member", status: "active" });
  await id.loginWithEmail("amm@cava-alfa.it", "password-123");
  await id.updateMemberRole("tizio", "admin");
  await waitClaim("tizio", "orgA", "admin");
  expect(await roleOf("tizio") === "admin", "il ruolo non è arrivato: il trigger si è fermato");
  // ripristino
  await id.updateMemberRole("tizio", "member");
  await adb.doc("organizations/orgA/members/fantasma").delete();
});

console.log("\n— Validazioni input (invito / nome org) —");
await test("inviteMember rifiuta un'email non valida", async () => {
  await id.loginWithEmail("boss@cava-alfa.it", "password-123");
  await expectCode(id.inviteMember("non-una-email", "member"), "invalid-argument",
    "email non valida accettata");
});
await test("inviteMember declassa un ruolo sconosciuto a 'member'", async () => {
  const invId = await id.inviteMember("ruolo-strano@collega.it", "superadmin");
  const inv = (await adb.doc(`invites/${invId}`).get()).data();
  expect(inv.role === "member", `ruolo salvato ${inv.role}`);
});
await test("createOrganization rifiuta un nome troppo corto", async () => {
  await expectCode(id.createOrganization("A"), "invalid-argument", "nome corto accettato");
});
await test("un utente anonimo (tour) NON può creare un'organizzazione", async () => {
  await id.loginTour();                         // login anonimo
  await expectCode(id.createOrganization("Cava Pirata"), "unauthenticated", "anonimo ha creato un'org");
});

console.log(`\nRisultato Functions: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

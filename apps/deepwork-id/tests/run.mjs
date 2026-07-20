// ============================================================
// Test automatici delle regole di sicurezza di Deepwork ID.
// Verificano l'ISOLAMENTO MULTI-TENANT: il requisito fondante.
// Si eseguono con l'emulatore Firestore:
//   firebase emulators:exec --project demo-deepwork "npm test"
// (dalla cartella apps/deepwork-id; nessun progetto reale coinvolto)
// ============================================================

import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");

let passed = 0, failed = 0;
const ok = (name) => { passed++; console.log(`  ✓ ${name}`); };
const ko = (name, e) => { failed++; console.error(`  ✗ ${name}: ${e.message}`); };
const test = async (name, fn) => { try { await fn(); ok(name); } catch (e) { ko(name, e); } };

const env = await initializeTestEnvironment({
  projectId: "demo-deepwork",
  firestore: { rules },
});

// Dati di partenza scritti bypassando le rules (setup di scenario)
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, "organizations/orgA"), { name: "Cava Alfa", status: "active" });
  await setDoc(doc(db, "organizations/orgB"), { name: "Cava Beta (concorrente)", status: "active" });
  await setDoc(doc(db, "organizations/org_demo"), { name: "Demo Tour", status: "active" });
  await setDoc(doc(db, "organizations/orgA/apps/scudo/turni/t1"), { operaio: "Mario", ore: 8 });
  await setDoc(doc(db, "organizations/orgB/apps/scudo/turni/t9"), { operaio: "SEGRETO-CONCORRENTE", ore: 6 });
  await setDoc(doc(db, "organizations/org_demo/apps/scudo/turni/d1"), { operaio: "Esempio", ore: 8 });
  await setDoc(doc(db, "organizations/orgA/entitlements/scudo"), { active: true, tier: "base" });
  // membership e inviti per i test del pannello amministrazione (D4)
  await setDoc(doc(db, "organizations/orgA/members/alice"), { uid: "alice", role: "member", status: "active" });
  await setDoc(doc(db, "organizations/orgA/members/boss"), { uid: "boss", role: "owner", status: "active" });
  await setDoc(doc(db, "invites/invA1"), { email: "nuovo@collega.it", orgId: "orgA", role: "member", status: "pending" });
});

// Utenti simulati con custom claims come li scriverebbe la Cloud Function
const alice = env.authenticatedContext("alice", { orgs: { orgA: "member" } }).firestore();   // membro di orgA
const boss  = env.authenticatedContext("boss",  { orgs: { orgA: "owner" } }).firestore();    // owner di orgA
const eve   = env.authenticatedContext("eve",   { orgs: { orgB: "member" } }).firestore();   // membro del CONCORRENTE
const tour  = env.authenticatedContext("anon1", { firebase: { sign_in_provider: "anonymous" } }).firestore(); // tour
const ghost = env.unauthenticatedContext().firestore();                                       // nessun login

console.log("\n— Isolamento tra organizzazioni (il test che conta) —");
await test("membro di orgA legge i dati della PROPRIA org", () =>
  assertSucceeds(getDoc(doc(alice, "organizations/orgA/apps/scudo/turni/t1"))));
await test("membro di orgA NON legge i dati del concorrente (orgB)", () =>
  assertFails(getDoc(doc(alice, "organizations/orgB/apps/scudo/turni/t9"))));
await test("membro di orgB NON legge i dati di orgA", () =>
  assertFails(getDoc(doc(eve, "organizations/orgA/apps/scudo/turni/t1"))));
await test("membro di orgA NON può nemmeno elencare i documenti di orgB", () =>
  assertFails(getDocs(collection(alice, "organizations/orgB/apps/scudo/turni"))));
await test("membro di orgA NON scrive nei dati del concorrente", () =>
  assertFails(setDoc(doc(alice, "organizations/orgB/apps/scudo/turni/hack"), { x: 1 })));
await test("membro di orgA NON CANCELLA i dati del concorrente (orgB)", () =>
  assertFails(deleteDoc(doc(alice, "organizations/orgB/apps/scudo/turni/t9"))));
await test("membro di orgB NON cancella i dati di orgA", () =>
  assertFails(deleteDoc(doc(eve, "organizations/orgA/apps/scudo/turni/t1"))));

console.log("\n— Accesso senza login —");
await test("utente non autenticato NON legge nulla di orgA", () =>
  assertFails(getDoc(doc(ghost, "organizations/orgA/apps/scudo/turni/t1"))));
await test("utente non autenticato NON legge nemmeno il tenant demo", () =>
  assertFails(getDoc(doc(ghost, "organizations/org_demo/apps/scudo/turni/d1"))));

console.log("\n— Modalità tour (anonimo autenticato) —");
await test("utente tour LEGGE il tenant demo", () =>
  assertSucceeds(getDoc(doc(tour, "organizations/org_demo/apps/scudo/turni/d1"))));
await test("utente tour NON scrive nel tenant demo", () =>
  assertFails(setDoc(doc(tour, "organizations/org_demo/apps/scudo/turni/d1"), { ore: 99 })));
await test("utente tour NON legge le org reali", () =>
  assertFails(getDoc(doc(tour, "organizations/orgA/apps/scudo/turni/t1"))));

console.log("\n— Scritture nella propria organizzazione —");
await test("membro scrive nei dati app della propria org", () =>
  assertSucceeds(setDoc(doc(alice, "organizations/orgA/apps/scudo/turni/t2"), { operaio: "Luca", ore: 7 })));
await test("membro NON modifica i metadati dell'org (solo owner)", () =>
  assertFails(setDoc(doc(alice, "organizations/orgA"), { name: "Rinominata" })));
await test("owner modifica i metadati della propria org", () =>
  assertSucceeds(setDoc(doc(boss, "organizations/orgA"), { name: "Cava Alfa SRL", status: "active" })));
await test("NESSUNO crea un'organizzazione dal client (solo Cloud Function)", () =>
  assertFails(setDoc(doc(boss, "organizations/nuova"), { name: "Cava Nuova", status: "active" })));
await test("NEMMENO l'owner cancella la propria org dal client", () =>
  assertFails(deleteDoc(doc(boss, "organizations/orgA"))));

console.log("\n— Abbonamenti (entitlements) —");
await test("membro LEGGE gli entitlement della propria org", () =>
  assertSucceeds(getDoc(doc(alice, "organizations/orgA/entitlements/scudo"))));
await test("NESSUNO scrive gli entitlement dal client (nemmeno l'owner)", () =>
  assertFails(setDoc(doc(boss, "organizations/orgA/entitlements/scudo"), { active: true, tier: "premium" })));
await test("membro del concorrente NON legge gli entitlement di orgA", () =>
  assertFails(getDoc(doc(eve, "organizations/orgA/entitlements/scudo"))));

console.log("\n— Membri e inviti (pannello amministrazione) —");
await test("membro LEGGE l'elenco membri della propria org", () =>
  assertSucceeds(getDocs(collection(alice, "organizations/orgA/members"))));
await test("membro del concorrente NON legge i membri di orgA", () =>
  assertFails(getDocs(collection(eve, "organizations/orgA/members"))));
await test("NEMMENO l'owner scrive membership dal client (solo Cloud Function)", () =>
  assertFails(setDoc(doc(boss, "organizations/orgA/members/intruso"), { uid: "intruso", role: "admin", status: "active" })));
await test("un membro NON può auto-promuoversi modificando il proprio doc", () =>
  assertFails(setDoc(doc(alice, "organizations/orgA/members/alice"), { uid: "alice", role: "owner", status: "active" })));
await test("owner/admin LEGGE gli inviti della propria org", () =>
  assertSucceeds(getDoc(doc(boss, "invites/invA1"))));
await test("membro semplice NON legge gli inviti", () =>
  assertFails(getDoc(doc(alice, "invites/invA1"))));
await test("il concorrente NON legge gli inviti di orgA", () =>
  assertFails(getDoc(doc(eve, "invites/invA1"))));
await test("un membro NON crea un invito dal client (no escalation, solo admin/Function)", () =>
  assertFails(setDoc(doc(alice, "invites/hack1"),
    { email: "x@y.it", orgId: "orgA", role: "member", status: "pending" })));
await test("il concorrente NON crea inviti per orgA", () =>
  assertFails(setDoc(doc(eve, "invites/hack2"),
    { email: "x@y.it", orgId: "orgA", role: "member", status: "pending" })));
await test("un owner/admin PUÒ creare un invito dal client (come la Function)", () =>
  assertSucceeds(setDoc(doc(boss, "invites/okCreate"),
    { email: "nuovo2@collega.it", orgId: "orgA", role: "member", status: "pending" })));
await test("un membro NON modifica un invito dal client (no tampering ruolo)", () =>
  assertFails(setDoc(doc(alice, "invites/invA1"), { role: "owner" }, { merge: true })));
await test("un membro NON cancella un invito dal client", () =>
  assertFails(deleteDoc(doc(alice, "invites/invA1"))));

console.log("\n— Profili utente —");
await test("utente legge il PROPRIO profilo", async () => {
  await assertSucceeds(setDoc(doc(alice, "users/alice"), { defaultOrgId: "orgA" }));
  await assertSucceeds(getDoc(doc(alice, "users/alice")));
});
await test("utente NON legge il profilo di un altro", () =>
  assertFails(getDoc(doc(alice, "users/eve"))));
await test("utente NON scrive il profilo di un altro", () =>
  assertFails(setDoc(doc(alice, "users/eve"), { defaultOrgId: "orgA" })));

await env.cleanup();

console.log(`\nRisultato: ${passed} passati, ${failed} falliti`);
if (failed > 0) process.exit(1);

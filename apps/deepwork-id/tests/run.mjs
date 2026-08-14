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
  // collezioni "nuove" delle app (aggiunte durante lo sviluppo): devono
  // restare isolate esattamente come le altre (regola generica apps/**)
  await setDoc(doc(db, "organizations/orgA/apps/flotta/ricambi/p1"), { nome: "Filtro olio", giacenza: 6 });
  await setDoc(doc(db, "organizations/orgB/apps/flotta/ricambi/p9"), { nome: "RICAMBIO-CONCORRENTE", giacenza: 2 });
  await setDoc(doc(db, "organizations/org_demo/apps/scudo/turni/d1"), { operaio: "Esempio", ore: 8 });
  // dati del CORE (cuore) come app 'core': organizations/{org}/apps/core/... —
  // isolamento preparato per la multi-tenancy del cuore (docs/ISOLAMENTO_CORE.md)
  await setDoc(doc(db, "organizations/orgA/apps/core/rapportini/r1"), { operatore: "Mario", fori: 20 });
  await setDoc(doc(db, "organizations/orgB/apps/core/rapportini/r9"), { operatore: "SEGRETO-CONCORRENTE", fori: 12 });
  await setDoc(doc(db, "organizations/orgB/apps/core/rapportini/r9/note/segreta"), { testo: "riservato orgB" });
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
const newbie = env.authenticatedContext("newbie", { orgs: {} }).firestore();                  // registrato ma SENZA org (appena iscritto)

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
await test("l'isolamento vale anche per i dati ANNIDATI in profondità (document=**)", () =>
  assertFails(getDoc(doc(alice, "organizations/orgB/apps/scudo/turni/t9/note/segreta"))));
await test("le collezioni NUOVE delle app (es. flotta/ricambi) sono isolate come le altre", () =>
  assertFails(getDoc(doc(alice, "organizations/orgB/apps/flotta/ricambi/p9"))));
await test("il concorrente NON scrive nelle collezioni nuove di orgA (flotta/ricambi)", () =>
  assertFails(setDoc(doc(eve, "organizations/orgA/apps/flotta/ricambi/hack"), { nome: "x", giacenza: 1 })));
await test("un membro LEGGE le collezioni nuove della PROPRIA org (flotta/ricambi)", () =>
  assertSucceeds(getDoc(doc(alice, "organizations/orgA/apps/flotta/ricambi/p1"))));
await test("un membro NON legge una sottocollezione NON prevista della propria org (deny di default)", () =>
  assertFails(getDoc(doc(alice, "organizations/orgA/segreti/x"))));

console.log("\n— Isolamento del CORE (organizations/{org}/apps/core/**) —");
await test("membro di orgA LEGGE i dati del cuore della PROPRIA org", () =>
  assertSucceeds(getDoc(doc(alice, "organizations/orgA/apps/core/rapportini/r1"))));
await test("membro di orgA NON legge i dati del cuore del concorrente (orgB)", () =>
  assertFails(getDoc(doc(alice, "organizations/orgB/apps/core/rapportini/r9"))));
await test("membro di orgB NON legge i dati del cuore di orgA", () =>
  assertFails(getDoc(doc(eve, "organizations/orgA/apps/core/rapportini/r1"))));
await test("membro di orgA NON può ELENCARE i rapportini del cuore del concorrente", () =>
  assertFails(getDocs(collection(alice, "organizations/orgB/apps/core/rapportini"))));
await test("membro di orgA NON scrive nei dati del cuore del concorrente", () =>
  assertFails(setDoc(doc(alice, "organizations/orgB/apps/core/rapportini/hack"), { x: 1 })));
await test("membro di orgA NON cancella i dati del cuore del concorrente", () =>
  assertFails(deleteDoc(doc(alice, "organizations/orgB/apps/core/rapportini/r9"))));
await test("l'isolamento del cuore vale anche in profondità (core/**/note)", () =>
  assertFails(getDoc(doc(alice, "organizations/orgB/apps/core/rapportini/r9/note/segreta"))));
await test("il membro LEGGE una sottocollezione annidata del cuore della PROPRIA org", () =>
  assertSucceeds(getDoc(doc(alice, "organizations/orgA/apps/core/rapportini/r1"))));

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

// Caso limite realistico: un utente appena registrato è autenticato ma NON è
// ancora membro di NESSUNA organizzazione (orgs={}). Prima di entrare in un'org
// (invito) o crearne una (Cloud Function) non deve vedere né toccare i dati di
// nessuno — né delle app, né del cuore. È un principale DISTINTO dal concorrente
// (che almeno appartiene a un'org) e dall'anonimo (non autenticato).
console.log("\n— Utente autenticato SENZA organizzazione (appena iscritto) —");
await test("iscritto-senza-org NON legge i dati app di un'org", () =>
  assertFails(getDoc(doc(newbie, "organizations/orgA/apps/scudo/turni/t1"))));
await test("iscritto-senza-org NON legge i dati del cuore di un'org", () =>
  assertFails(getDoc(doc(newbie, "organizations/orgA/apps/core/rapportini/r1"))));
await test("iscritto-senza-org NON elenca i rapportini del cuore di un'org", () =>
  assertFails(getDocs(collection(newbie, "organizations/orgA/apps/core/rapportini"))));
await test("iscritto-senza-org NON scrive nei dati di un'org", () =>
  assertFails(setDoc(doc(newbie, "organizations/orgA/apps/scudo/turni/t1"), { ore: 0 })));
await test("iscritto-senza-org NON legge gli abbonamenti (entitlements) di un'org", () =>
  assertFails(getDoc(doc(newbie, "organizations/orgA/entitlements/scudo"))));
await test("iscritto-senza-org NON legge l'elenco membri di un'org", () =>
  assertFails(getDoc(doc(newbie, "organizations/orgA/members/alice"))));

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
await test("NESSUNO cancella un entitlement dal client (nemmeno l'owner: no auto-sblocco abbonamento)", () =>
  assertFails(deleteDoc(doc(boss, "organizations/orgA/entitlements/scudo"))));

console.log("\n— Membri e inviti (pannello amministrazione) —");
await test("membro LEGGE l'elenco membri della propria org", () =>
  assertSucceeds(getDocs(collection(alice, "organizations/orgA/members"))));
await test("membro del concorrente NON legge i membri di orgA", () =>
  assertFails(getDocs(collection(eve, "organizations/orgA/members"))));
await test("NEMMENO l'owner scrive membership dal client (solo Cloud Function)", () =>
  assertFails(setDoc(doc(boss, "organizations/orgA/members/intruso"), { uid: "intruso", role: "admin", status: "active" })));
await test("un membro NON può auto-promuoversi modificando il proprio doc", () =>
  assertFails(setDoc(doc(alice, "organizations/orgA/members/alice"), { uid: "alice", role: "owner", status: "active" })));
await test("NEMMENO l'owner cancella un membro dal client (solo Cloud Function con guardrail)", () =>
  assertFails(deleteDoc(doc(boss, "organizations/orgA/members/alice"))));
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
await test("il concorrente NON cancella un invito di orgA", () =>
  assertFails(deleteDoc(doc(eve, "invites/invA1"))));
await test("il concorrente NON manomette un invito di orgA (no dirottamento)", () =>
  assertFails(setDoc(doc(eve, "invites/invA1"), { email: "eve@concorrente.it" }, { merge: true })));

console.log("\n— Profili utente —");
await test("utente legge il PROPRIO profilo", async () => {
  await assertSucceeds(setDoc(doc(alice, "users/alice"), { defaultOrgId: "orgA" }));
  await assertSucceeds(getDoc(doc(alice, "users/alice")));
});
await test("utente NON legge il profilo di un altro", () =>
  assertFails(getDoc(doc(alice, "users/eve"))));
await test("utente NON scrive il profilo di un altro", () =>
  assertFails(setDoc(doc(alice, "users/eve"), { defaultOrgId: "orgA" })));

// ============================================================
// DECISIONE 10b — CHI PUÒ CANCELLARE UN DOCUMENTO GIÀ EMESSO
// ------------------------------------------------------------
// «Scrivere cose nuove resta a tutti; cancellare e correggere un documento
// GIÀ EMESSO — una fattura, un documento consegnato all'ente — solo a chi
// amministra.» Decisa dal ciclo il 07/08, urgente per conseguenza della 10c.
//
// ⛔ E QUESTE PROVE ESISTONO PER UNA TRAPPOLA PRECISA: le regole di Firestore
// sono ADDITIVE. Finché il `match /apps/{appId}/{document=**}` concedeva
// `allow write` a ogni membro, qualunque restrizione scritta in un match più
// stretto sarebbe stata **decorativa** — e nessuna prova che guardi solo il
// caso «l'admin può» se ne accorgerebbe. La prova che conta è quella
// NEGATIVA: il membro semplice NON deve poter cancellare.
console.log("\n— Decisione 10b: chi cancella un documento emesso —");
await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, "organizations/orgA/apps/conti/fatture/f1"), { numero: "2026/1", importo: 1000 });
  await setDoc(doc(db, "organizations/orgA/apps/conti/fatture/f2"), { numero: "2026/2", importo: 2000 });
  await setDoc(doc(db, "organizations/orgA/apps/conti/note/n1"), { numero: "NC/1", importo: 300 });
  await setDoc(doc(db, "organizations/orgA/apps/scudo/documenti/d1"), { titolo: "Verbale di verifica periodica" });
  // una collezione QUALUNQUE, per provare che la restrizione non è larga
  await setDoc(doc(db, "organizations/orgA/apps/campo/rapportini/r1"), { turno: "mattina" });
  await setDoc(doc(db, "organizations/orgA/apps/campo/rapportini/r2"), { turno: "pomeriggio" });
});

await test("un MEMBRO non cancella una fattura emessa", () =>
  assertFails(deleteDoc(doc(alice, "organizations/orgA/apps/conti/fatture/f1"))));
await test("un MEMBRO non corregge una fattura emessa", () =>
  assertFails(setDoc(doc(alice, "organizations/orgA/apps/conti/fatture/f1"), { importo: 1 }, { merge: true })));
await test("un MEMBRO non cancella una nota di credito", () =>
  assertFails(deleteDoc(doc(alice, "organizations/orgA/apps/conti/note/n1"))));
await test("un MEMBRO non cancella un documento del registro di Scudo", () =>
  assertFails(deleteDoc(doc(alice, "organizations/orgA/apps/scudo/documenti/d1"))));

await test("un MEMBRO PUÒ ancora emettere una fattura nuova", () =>
  assertSucceeds(setDoc(doc(alice, "organizations/orgA/apps/conti/fatture/f3"), { numero: "2026/3", importo: 500 })));
await test("un MEMBRO PUÒ ancora correggere e cancellare quello che non è emesso", async () => {
  await assertSucceeds(setDoc(doc(alice, "organizations/orgA/apps/campo/rapportini/r1"), { turno: "sera" }, { merge: true }));
  await assertSucceeds(deleteDoc(doc(alice, "organizations/orgA/apps/campo/rapportini/r2")));
});

await test("chi AMMINISTRA cancella e corregge un documento emesso", async () => {
  await assertSucceeds(setDoc(doc(boss, "organizations/orgA/apps/conti/fatture/f2"), { importo: 2100 }, { merge: true }));
  await assertSucceeds(deleteDoc(doc(boss, "organizations/orgA/apps/conti/fatture/f2")));
  await assertSucceeds(deleteDoc(doc(boss, "organizations/orgA/apps/scudo/documenti/d1")));
});

// ⛔ E LA BARRIERA FRA ORGANIZZAZIONI NON SI È INDEBOLITA: è il requisito
// fondante, e una riscrittura dei match delle scritture è esattamente il
// momento in cui si perde per sbaglio.
await test("il CONCORRENTE non cancella una fattura di orgA nemmeno da admin di casa sua", () =>
  assertFails(deleteDoc(doc(eve, "organizations/orgA/apps/conti/fatture/f1"))));
await test("il CONCORRENTE non scrive nulla dentro orgA", () =>
  assertFails(setDoc(doc(eve, "organizations/orgA/apps/campo/rapportini/rX"), { turno: "rubato" })));
await test("il TOUR legge la demo ma non scrive", async () => {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "organizations/org_demo/apps/conti/fatture/d1"), { numero: "DEMO" });
  });
  await assertSucceeds(getDoc(doc(tour, "organizations/org_demo/apps/conti/fatture/d1")));
  await assertFails(deleteDoc(doc(tour, "organizations/org_demo/apps/conti/fatture/d1")));
  await assertFails(setDoc(doc(tour, "organizations/org_demo/apps/campo/rapportini/rZ"), { turno: "x" }));
});

/* ⛔ DUE AFFERMAZIONI DELLE REGOLE CHE NESSUNA PROVA SORVEGLIAVA — censite
   l'08/08 confrontando ogni `allow` del file con i titoli delle prove. La
   dottrina di questo repository è netta: «chi scrive una restrizione e la
   prova solo dal lato di chi PUÒ ha scritto un commento, non una regola», e
   queste due erano rimaste commenti. */

// 1. `users/{uid}` dichiara `allow delete: if false` con accanto scritto
//    «cancellazione account: solo via Cloud Function». Nessuna prova lo
//    pretendeva: le tre prove su `users/` guardano lettura e scrittura, e la
//    cancellazione è proprio il verso in cui un errore non si recupera.
await test("l'utente NON cancella il proprio profilo dal client (solo Cloud Function)", () =>
  assertFails(deleteDoc(doc(alice, "users/alice"))));
await test("e nemmeno quello di un altro", () =>
  assertFails(deleteDoc(doc(alice, "users/eve"))));

// 2. La regola finale — `match /{document=**} { allow read, write: if false }`
//    — è la rete che tiene tutto ciò che nessuno ha previsto. Le 68 prove
//    toccavano TRE radici sole (`organizations/`, `invites/`, `users/`):
//    nessuna aveva mai chiesto che cosa succede a una QUARTA. Ed è la domanda
//    che conta, perché in un sistema di permessi ADDITIVO un `match` nuovo può
//    solo allargare: il giorno in cui qualcuno ne aggiunge uno con un `allow`
//    largo, questa rete smette di coprire e nessuno se ne accorge.
await test("una collezione di radice NON prevista è negata in lettura", () =>
  assertFails(getDoc(doc(alice, "pagamenti/p1"))));
await test("…e in scrittura, anche a un utente autenticato", () =>
  assertFails(setDoc(doc(alice, "pagamenti/p1"), { importo: 1 })));
await test("…e non basta elencarla per aggirarla", () =>
  assertFails(getDocs(collection(alice, "pagamenti"))));
await test("…e a un utente NON autenticato è negata uguale", () =>
  assertFails(getDoc(doc(ghost, "pagamenti/p1"))));
/* ⚠️ E il verso opposto, che è quello che rende la prova utile invece che
   rumorosa: la rete NON deve negare ciò che le regole concedono davvero. Senza
   questa riga, un `allow read, write: if false` messo per sbaglio in cima al
   file passerebbe tutte e quattro le prove qui sopra. */
await test("…ma la rete non nega ciò che è concesso: il profilo proprio si legge ancora", () =>
  assertSucceeds(getDoc(doc(alice, "users/alice"))));

await env.cleanup();

console.log(`\nRisultato: ${passed} passati, ${failed} falliti`);
if (failed > 0) process.exit(1);

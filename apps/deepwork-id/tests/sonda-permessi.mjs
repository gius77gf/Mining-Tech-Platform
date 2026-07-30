/* SONDA DEI PERMESSI — NON È UN TEST, È UNA MISURA.
   Un test dice «giusto/sbagliato»; questa dice «ecco cosa è permesso oggi».
   Serve perché `docs/REVISIONE_SICUREZZA_202607.md` afferma due cose che
   sarebbe facile affermare a vuoto leggendo le regole — e leggendo le regole
   in questo progetto ci si è già sbagliati. Con questa, chiunque rifà la
   misura in un comando invece di rifare il ragionamento.

   Lo scenario è quello che rende visibili i due buchi:
   un'organizzazione abbonata SOLO a Scudo, e un utente che è MEMBRO SEMPLICE
   (né proprietario né amministratore).

   ⚠️ NON VA MESSA IN `npm test`. Non fallisce mai: stampa e basta. Un banco
   che non sa fallire non dimostra niente, e infatti questa non dimostra —
   racconta. Quando le regole cambieranno, le prove che devono fallire vanno
   scritte in `run.mjs`, viste fallire prima, e solo dopo si cambiano le regole.

   Uso, dalla cartella apps/deepwork-id:
     firebase emulators:exec --only firestore --project demo-deepwork \
       "node tests/sonda-permessi.mjs"
*/
import { readFileSync } from "node:fs";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const env = await initializeTestEnvironment({ projectId: "demo-deepwork", firestore: { rules } });

await env.withSecurityRulesDisabled(async (ctx) => {
  const db = ctx.firestore();
  await setDoc(doc(db, "organizations/orgA"), { name: "Cava Alfa", status: "active" });
  /* l'abbonamento c'è SOLO per Scudo: è il punto di tutta la misura */
  await setDoc(doc(db, "organizations/orgA/entitlements/scudo"), { active: true, tier: "base" });
  await setDoc(doc(db, "organizations/orgA/apps/terra/fronti/f1"), { nome: "Fronte Nord" });
  await setDoc(doc(db, "organizations/orgA/apps/conti/fatture/2026-001"), { cliente: "Edilcave", totale: 12000 });
});

const alice = env.authenticatedContext("alice", { orgs: { orgA: "member" } }).firestore();

const prova = async (etichetta, fn) => {
  try { await fn(); console.log(`  PERMESSO  ${etichetta}`); }
  catch (e) { console.log(`  negato    ${etichetta}`); }
};

console.log("\nCosa può fare oggi un MEMBRO SEMPLICE di un'organizzazione\n" +
            "che ha l'abbonamento SOLO a Scudo:\n");
await prova("legge i fronti di TERRA (app non abbonata)",
  () => getDoc(doc(alice, "organizations/orgA/apps/terra/fronti/f1")));
await prova("SCRIVE nei fronti di TERRA (app non abbonata)",
  () => setDoc(doc(alice, "organizations/orgA/apps/terra/fronti/f2"), { nome: "inventato" }));
await prova("legge una FATTURA di Conti (app non abbonata)",
  () => getDoc(doc(alice, "organizations/orgA/apps/conti/fatture/2026-001")));
await prova("MODIFICA il totale di una fattura",
  () => setDoc(doc(alice, "organizations/orgA/apps/conti/fatture/2026-001"), { totale: 1 }, { merge: true }));
await prova("CANCELLA una fattura",
  () => deleteDoc(doc(alice, "organizations/orgA/apps/conti/fatture/2026-001")));
await prova("legge l'abbonamento (per sapere cosa mostrare)",
  () => getDoc(doc(alice, "organizations/orgA/entitlements/scudo")));

console.log("\nLa lettura di questi risultati sta in docs/REVISIONE_SICUREZZA_202607.md.");
await env.cleanup();

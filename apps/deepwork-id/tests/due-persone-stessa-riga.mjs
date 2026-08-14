/* MISURA — NON VA IN npm test (stampa, non asserisce, e vuole l'emulatore).
   ══════════════════════════════════════════════════════════════════════════
   Decisione 5b, che il fondatore ha lasciato scritta così: «sì al lavoro senza
   rete, **ma prima misuro cosa succede a due persone che scrivono la stessa
   riga**». Questa è quella misura, e viene PRIMA della funzione.

   Si lancia:
     cd apps/deepwork-id && firebase emulators:exec --only firestore \
       --project demo-deepwork "cd tests && node due-persone-stessa-riga.mjs"

   Esito dell'08/08 e racconto: `docs/DUE_PERSONE_STESSA_RIGA.md`.

   Che cosa succede a DUE PERSONE che scrivono la stessa riga? Si esercita
   esattamente quello che fa il livello dati delle app —
   `aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data)`
   — con due contesti AUTENTICATI diversi, cioè due telefoni in cava, dentro la
   stessa organizzazione e con le regole di sicurezza vere caricate.
   Non scrive conclusioni: stampa quello che il database risponde. */
import { readFileSync } from "node:fs";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const env = await initializeTestEnvironment({ projectId: "demo-deepwork", firestore: { rules } });

await env.withSecurityRulesDisabled(async (ctx) => {
  await setDoc(doc(ctx.firestore(), "organizations/orgA"), { name: "Cava Alfa", status: "active" });
});

/* Anna e Bruno: due membri della STESSA organizzazione — il caso normale di una
   cava, non un attacco */
const anna = env.authenticatedContext("anna", { orgs: { orgA: "member" } }).firestore();
const bruno = env.authenticatedContext("bruno", { orgs: { orgA: "member" } }).firestore();

const P = "organizations/orgA/apps/campo/checklist/c1";
const rA = doc(anna, P), rB = doc(bruno, P);
const leggi = async () => (await getDoc(rA)).data();
const seme = async (v) => { await setDoc(rA, v); };
const mostra = (t, o) => console.log(`   ${t}: ${JSON.stringify(o)}`);

console.log("\n══ CASO 1 · due CAMPI DIVERSI della stessa riga ══");
await seme({ stato: "presente", ora: "08:00" });
await getDoc(rA); await getDoc(rB);                 // tutt'e due la aprono
await updateDoc(rA, { ora: "08:30" });              // Anna cambia l'ora
await updateDoc(rB, { stato: "assente" });          // Bruno cambia lo stato
const d1 = await leggi(); mostra("dopo", d1);
console.log(`   → convivono? ${d1.ora === "08:30" && d1.stato === "assente" ? "SÌ" : "NO"}`);

console.log("\n══ CASO 2 · lo STESSO campo ══");
await seme({ stato: "presente" });
await updateDoc(rA, { stato: "assente" });
await updateDoc(rB, { stato: "in ferie" });
mostra("dopo", await leggi());
console.log("   → vince l'ultimo, e il primo non lo sa");

console.log("\n══ CASO 3 · leggi-modifica-riscrivi su un campo COMPOSITO ══");
console.log("   (la forma che le app usano davvero: `esiti` letto dallo stato locale,");
console.log("    cambiato in un punto, e riscritto INTERO)");
await seme({ esiti: { dpi: false, estintore: false, luci: false } });
const baseA = (await getDoc(rA)).data().esiti;      // Anna apre la lista
const baseB = (await getDoc(rB)).data().esiti;      // Bruno la apre nello stesso momento
await updateDoc(rA, { esiti: { ...baseA, dpi: true } });
await updateDoc(rB, { esiti: { ...baseB, estintore: true } });
const d3 = await leggi(); mostra("dopo", d3);
console.log(`   → la spunta di Anna (dpi) è sopravvissuta? ${d3.esiti.dpi ? "SÌ" : "NO — persa in silenzio"}`);

console.log("\n══ CASO 4 · lo stesso, ma scrivendo il PERCORSO PUNTATO ══");
await seme({ esiti: { dpi: false, estintore: false, luci: false } });
await updateDoc(rA, { "esiti.dpi": true });
await updateDoc(rB, { "esiti.estintore": true });
const d4 = await leggi(); mostra("dopo", d4);
console.log(`   → convivono? ${d4.esiti.dpi && d4.esiti.estintore ? "SÌ" : "NO"}`);

console.log("\n══ CASO 5 · e se la riga è stata CANCELLATA nel frattempo? ══");
await seme({ stato: "presente" });
await deleteDoc(rA);
let esito;
try { await updateDoc(rB, { stato: "assente" }); esito = "la scrittura è PASSATA (riga ricreata?)"; }
catch (e) { esito = `RIFIUTATA: ${e.code || e.message}`; }
console.log(`   → ${esito}`);
mostra("la riga adesso", await leggi());

console.log("\n══ CASO 6 · e con `set` invece di `update`? (come scrive `aggiungi`) ══");
await seme({ stato: "presente", ora: "08:00", note: "vento forte" });
await setDoc(rA, { stato: "assente" });
mostra("dopo un set senza merge", await leggi());

console.log("\n══ CASO 7 · e con una TRANSAZIONE, che è la cura per gli ELENCHI ══");
{
  /* la stessa scena del caso 3, ma con `trasformaAtomico`: le due persone
     aggiungono una lettura ciascuna allo stesso punto di monitoraggio */
  const { trasformaAtomico } = await import("../../../shared/dw-ponti.js");
  const { runTransaction, deleteField } = await import("firebase/firestore");
  await seme({ letture: [{ v: 1 }] });
  const aggiungi = (rif, v) => trasformaAtomico({ rif, runTransaction, deleteField },
    (m) => ({ letture: [...(m.letture || []), { v }] }));
  await Promise.all([aggiungi(rA, 2), aggiungi(rB, 3)]);
  const d7 = await leggi();
  mostra("dopo", d7);
  const vv = d7.letture.map((x) => x.v).sort();
  console.log(`   → ci sono TUTTE E TRE le letture? ${JSON.stringify(vv) === "[1,2,3]" ? "SÌ" : "NO"}`);
  /* e il verso opposto, se no non si saprebbe se la transazione serve: le
     stesse due scritture SENZA transazione, leggendo prima come fa la pagina */
  await seme({ letture: [{ v: 1 }] });
  const base = (await getDoc(rA)).data().letture;
  await updateDoc(rA, { letture: [...base, { v: 2 }] });
  await updateDoc(rB, { letture: [...base, { v: 3 }] });
  const d7b = await leggi();
  console.log(`   → senza transazione: ${JSON.stringify(d7b.letture.map((x) => x.v))} — una si perde`);
}


await env.cleanup();
process.exit(0);

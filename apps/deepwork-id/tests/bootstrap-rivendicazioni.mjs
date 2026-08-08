/* ⛔ IL PRIMO AVVIO NON DEVE BUTTARE VIA LE RIVENDICAZIONI CHE TROVA —
   e questa prova sta QUI, fuori dagli emulatori, per una ragione misurata.
   ══════════════════════════════════════════════════════════════════════════
   Il difetto era vero: `setCustomUserClaims` **sostituisce** l'intero oggetto
   delle rivendicazioni, quindi `bootstrapOwner`, scrivendo
   `{ orgs: { [nuova]: "owner" } }`, faceva uscire da un'altra organizzazione
   chi ci apparteneva già — in silenzio, senza errore. Succede sul serio perché
   `bootstrap-owner.mjs` è il percorso «vai in live» che si lancia **a mano**, e
   quindi si rilancia: due cave, o una seconda volta dopo un nome sbagliato.

   ⛔ E LA PRIMA PROVA CHE HO SCRITTO ERA VERDE IN CASA E ROSSA IN CI, per una
   ragione che vale oltre questo caso. L'avevo messa in `run-bootstrap.mjs`,
   che gira sotto `firebase emulators:exec`, e chiedeva **lo stato finale**
   delle rivendicazioni dopo il bootstrap. Ma in quello stato ci scrive anche
   qualcun altro: il trigger `onMemberWrite` chiama `rebuildClaims`, che
   ricostruisce `orgs` **dalle membership vere** e scrive `{ orgs }` e basta.
   In casa l'emulatore delle **funzioni** non parte (la politica di rete del
   contenitore lo nega), quindi la mia misura ha visto un mondo con **un solo
   scrittore**; la CI ne ha due. Cioè: la stessa suite, con lo stesso nome, non
   è la stessa prova nei due posti — la variante dell'ambiente che misura
   sé stesso invece del prodotto.
   La domanda giusta non era «com'è lo stato finale» — quello, dove le funzioni
   girano, è **di `rebuildClaims`, che è l'autorità sugli `orgs`** e li rifà
   dal database. La domanda è **che cosa scrive `bootstrapOwner`**, che è una
   funzione pura di ciò che riceve: si prova con due finti e nessun emulatore,
   e allora la risposta è la stessa ovunque.

   ⚠️ E LA SECONDA PROVA CHE AVEVO SCRITTO ANDAVA TOLTA, non spostata: pretendeva
   che il primo avvio conservasse una rivendicazione **diversa** da `orgs`
   («altro»). Misurato: in tutto il prodotto le rivendicazioni le scrivono in
   due (questo script e `rebuildClaims`) e ne esiste **una sola** che qualcuno
   legga — `orgs`, letta dalle regole (`request.auth.token.orgs`) e dall'SDK
   (`token.claims.orgs`). Pinnare la conservazione di una chiave che non esiste
   voleva dire blindare un'invenzione, per giunta in contrasto con
   `rebuildClaims`, che di proposito tiene solo `orgs`. Qui resta come
   asserzione sul contratto di `bootstrapOwner` — che davvero non deve
   distruggere ciò che non gli appartiene — e NON come promessa sullo stato
   finale di un impianto con le funzioni attive.

   Uso:  node apps/deepwork-id/tests/bootstrap-rivendicazioni.mjs            */

import { bootstrapOwner, APP_IDS } from "../scripts/bootstrap-owner.mjs";

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ✓ ${t}`); } else { ko++; console.log(`  ✗ ${t}${x !== undefined ? `: ${x}` : ""}`); } };

/* I due finti: registrano invece di scrivere. `db` deve solo reggere la forma
   che lo script usa (org → members/entitlements + batch), perché il soggetto
   qui sono le rivendicazioni. */
const ORG_NUOVA = "orgNuova";
function autFinta(claimsIniziali) {
  let claims = claimsIniziali;
  let scritture = 0;
  return {
    getUserByEmail: async () => ({ uid: "socio", customClaims: claims }),
    setCustomUserClaims: async (_uid, c) => { claims = c; scritture++; },
    finali: () => claims,
    scritture: () => scritture,
  };
}
function dbFinto() {
  const rif = (id) => ({ id, set: async () => {}, collection: () => ({ doc: (d) => rif(d) }) });
  return { collection: () => ({ doc: () => rif(ORG_NUOVA) }), batch: () => ({ set() {}, commit: async () => {} }) };
}
const FV = { serverTimestamp: () => "ts" };

/* la riga com'era prima della correzione, per la controprova: stessa firma,
   sostituisce invece di fondere. Iniezione in memoria — il file non si tocca. */
async function bootstrapVecchio(auth, _db, email, _nome, _FieldValue) {
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { orgs: { [ORG_NUOVA]: "owner" } });
  return ORG_NUOVA;
}

console.log("\n── Il primo avvio fonde le rivendicazioni, non le sostituisce ──");

const PRIMA = { orgs: { orgVecchia: "member" }, altro: "da tenere" };
const aut = autFinta(structuredClone(PRIMA));
const orgId = await bootstrapOwner(aut, dbFinto(), "socio@cava.it", "Seconda Cava", FV);
const dopo = aut.finali();

dice(dopo.orgs && dopo.orgs.orgVecchia === "member",
  "chi apparteneva già a un'altra organizzazione ci resta", JSON.stringify(dopo));
dice(dopo.orgs && dopo.orgs[orgId] === "owner",
  "e nella nuova è owner", JSON.stringify(dopo));
dice(dopo.altro === "da tenere",
  "e le rivendicazioni che non gli appartengono non le tocca", JSON.stringify(dopo));
dice(aut.scritture() === 1, `scrive le rivendicazioni una volta sola: ${aut.scritture()}`);

/* ⛔ E SA FALLIRE? Gli stessi dati, con la riga di prima: se il difetto non
   facesse cadere niente, questa prova non proverebbe niente. */
const autV = autFinta(structuredClone(PRIMA));
await bootstrapVecchio(autV, dbFinto(), "socio@cava.it", "Seconda Cava", FV);
const dopoV = autV.finali();
dice(!(dopoV.orgs && dopoV.orgs.orgVecchia) && dopoV.altro === undefined,
  "controprova: con la riga di prima (sostituisce) l'appartenenza sparisce davvero",
  JSON.stringify(dopoV));

/* ⛔ E IL CASO SENZA NIENTE PRIMA deve restare quello di sempre: una fusione
   scritta male («...attuali» dimenticato) passerebbe le prove qui sopra e
   romperebbe il primo avvio vero, che è il caso NORMALE — l'utente nuovo. */
const autNuovo = autFinta(undefined);
const orgId2 = await bootstrapOwner(autNuovo, dbFinto(), "socio@cava.it", "Prima Cava", FV);
const dopoN = autNuovo.finali();
dice(dopoN.orgs && dopoN.orgs[orgId2] === "owner" && Object.keys(dopoN.orgs).length === 1,
  "un utente senza rivendicazioni entra con la sola org nuova", JSON.stringify(dopoN));

dice(APP_IDS.length === 8, `le 8 app dell'ecosistema restano otto: ${APP_IDS.length}`);

console.log(`\nRisultato rivendicazioni del primo avvio: ${ok} passati, ${ko} falliti`
  + `  ·  nessun emulatore: il soggetto è ciò che bootstrapOwner SCRIVE,`
  + ` non lo stato finale (che con le funzioni attive è di rebuildClaims)`);
process.exit(ko > 0 ? 1 : 0);

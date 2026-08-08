/* MISURA — NON VA IN npm test (vuole gli emulatori e Chromium, e stampa).
   ══════════════════════════════════════════════════════════════════════════
   ⛔ LA SECONDA METÀ DELLA DECISIONE 5b: IL LAVORO SENZA RETE.
   La prima metà — «che cosa succede a due persone che scrivono la stessa
   riga» — è misurata in `docs/DUE_PERSONE_STESSA_RIGA.md` e i suoi dodici
   punti sono chiusi. Questa è la domanda che resta, e il fondatore l'ha messa
   in quest'ordine apposta: **prima si guarda che cosa succede, poi si decide
   se accendere la coda**.
   Il ponteggio è `ponte-emulatore.mjs`: qui una pagina non può caricare
   Firebase da gstatic, ma i bundle del browser stanno in `tests/node_modules`
   e basta riscriverne gli import su percorsi locali.

   Che cosa chiede, con DUE schede autenticate come due telefoni della stessa
   cava, e la cache locale accesa (`persistentLocalCache`, che è la forma nuova
   di `enableIndexedDbPersistence`):
     1. staccata la rete, la scrittura si può fare? e la pagina la vede?
     2. riattaccata, arriva al database da sola?
     3. mentre la prima è staccata, la seconda scrive la stessa riga: al
        ritorno chi vince, e qualcuno se ne accorge?
     4. una scrittura in coda sopravvive alla CHIUSURA della scheda?

   Uso:  cd apps/deepwork-id && firebase emulators:exec --only firestore,auth \
           --project demo-deepwork "node tests/browser/coda-offline.mjs"      */

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createServer } from "node:http";

const QUI = dirname(fileURLToPath(import.meta.url));
const MODULI = join(QUI, "..", "node_modules", "firebase");
const PORTA = Number(process.argv[2]) || 8951;
const PROGETTO = "demo-deepwork";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

/* ── 1. lo scenario, con l'admin: l'org e una persona che ci appartiene ── */
const { initializeApp: adminInit } = await import("firebase-admin/app");
const { getFirestore: adminDb } = await import("firebase-admin/firestore");
const { getAuth: adminAuth } = await import("firebase-admin/auth");
const admin = adminInit({ projectId: PROGETTO }, "coda-offline");
const db = adminDb(admin), auth = adminAuth(admin);
await db.doc("organizations/orgA").set({ name: "Cava Alfa", status: "active" });
await auth.createUser({ uid: "anna", email: "anna@cava.it", password: "password-123" });
await auth.setCustomUserClaims("anna", { orgs: { orgA: "member" } });
const VIA = "organizations/orgA/apps/campo/checklist/c1";
await db.doc(VIA).set({ esiti: { dpi: false }, chi: "seme" });

/* ── 2. i bundle e la pagina ── */
const cartella = mkdtempSync(join(tmpdir(), "coda-offline-"));
for (const nome of ["firebase-app.js", "firebase-firestore.js", "firebase-auth.js"]) {
  writeFileSync(join(cartella, nome), readFileSync(join(MODULI, nome), "utf8")
    .replace(/https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\//g, "/"));
}
writeFileSync(join(cartella, "prova.html"), `<!doctype html><meta charset="utf-8"><body>
<script type="module">
import { initializeApp } from "/firebase-app.js";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword } from "/firebase-auth.js";
import { initializeFirestore, persistentLocalCache, connectFirestoreEmulator,
         doc, setDoc, getDoc, updateDoc } from "/firebase-firestore.js";
const app = initializeApp({ projectId: "${PROGETTO}", apiKey: "demo-api-key" }, "p" + Math.random());
const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
/* la cache locale accesa: è LEI che tiene la coda quando la rete non c'è */
const fs = initializeFirestore(app, { localCache: persistentLocalCache() });
connectFirestoreEmulator(fs, "127.0.0.1", 8080);
await signInWithEmailAndPassword(auth, "anna@cava.it", "password-123");
const rif = doc(fs, "${VIA}");
window.__scrivi = async (campo, valore) => {
  try { await updateDoc(rif, { [campo]: valore }); return "risolta"; }
  catch (e) { return "errore: " + (e.code || e.message); }
};
/* ⛔ la scrittura NON si aspetta: senza rete la promessa non si risolve finché
   il server non risponde. Quello che conta è che la PAGINA la veda subito. */
window.__scriviSenzaAspettare = (campo, valore) => { updateDoc(rif, { [campo]: valore }); return "lanciata"; };
/* ⛔ anche la LETTURA va chiusa in un try: senza rete la lettura può rifiutare,
   e un rifiuto che attraversa il confine col banco lo uccide invece di essere
   una risposta. È la stessa lezione della sonda del vuoto, un piano più in là.
   ⚠️ E qui dentro NIENTE apici inversi: questo testo vive in un template
   literal, e un apice inverso lo chiuderebbe — la trappola scritta in
   CLAUDE.md, rifatta scrivendo questo commento. */
window.__leggi = async () => {
  try { return JSON.stringify((await getDoc(rif)).data()); }
  catch (e) { return "la lettura non riesce: " + (e.code || e.message); }
};
window.__pronta = true;
</script></body>`);

/* ── 3. il server, col contrassegno del pid riletto ── */
const mime = { ".js": "text/javascript", ".html": "text/html", ".txt": "text/plain" };
writeFileSync(join(cartella, "contrassegno.txt"), String(process.pid));
const server = createServer((req, res) => {
  const f = join(cartella, (req.url || "/").split("?")[0].replace(/^\//, "") || "prova.html");
  let corpo;
  try { corpo = readFileSync(f); } catch { res.writeHead(404); res.end("no"); return; }
  res.writeHead(200, { "content-type": mime[f.slice(f.lastIndexOf("."))] || "text/plain" });
  res.end(corpo);
});
await new Promise((ok) => server.listen(PORTA, "127.0.0.1", ok));
const riletto = (await (await fetch(`http://127.0.0.1:${PORTA}/contrassegno.txt`)).text()).trim();
if (riletto !== String(process.pid)) { console.error(`⛔ porta ${PORTA} occupata da pid ${riletto}`); process.exit(2); }
console.log(`porta ${PORTA} · contrassegno riletto = pid ${process.pid} ✔`);

/* ── 4. le due schede ── */
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const apri = async () => {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const err = [];
  p.on("pageerror", (e) => err.push(String(e).slice(0, 120)));
  await p.goto(`http://127.0.0.1:${PORTA}/prova.html`);
  await p.waitForFunction(() => window.__pronta === true, { timeout: 30000 })
    .catch(() => { throw new Error("la pagina non è partita: " + err.slice(0, 2).join(" · ")); });
  return { ctx, p };
};
const dal = async () => JSON.parse(JSON.stringify((await db.doc(VIA).get()).data()));
const mostra = (t, o) => console.log(`   ${t}: ${JSON.stringify(o)}`);

const anna = await apri();

console.log("\n══ CASO 1 · con la rete STACCATA, la pagina vede la propria scrittura? ══");
await anna.ctx.setOffline(true);
console.log("   scrittura lanciata:", await anna.p.evaluate(() => window.__scriviSenzaAspettare("chi", "anna-offline")));
await anna.p.waitForTimeout(600);
console.log("   la pagina rilegge :", await anna.p.evaluate(() => window.__leggi()));
mostra("il database dice ", await dal());

console.log("\n══ CASO 2 · riattaccata la rete, arriva da sola? ══");
await anna.ctx.setOffline(false);
await anna.p.waitForTimeout(2500);
mostra("il database dice ", await dal());

console.log("\n══ CASO 3 · Anna staccata scrive, Bruno online scrive la STESSA riga ══");
const bruno = await apri();
await anna.ctx.setOffline(true);
await anna.p.evaluate(() => window.__scriviSenzaAspettare("chi", "anna-in-coda"));
await bruno.p.evaluate(() => window.__scrivi("chi", "bruno-online"));
mostra("mentre Anna è staccata", await dal());
await anna.ctx.setOffline(false);
await anna.p.waitForTimeout(2500);
mostra("dopo il ritorno di Anna", await dal());
console.log("   → chi vince, e Bruno se ne accorge? (guardare il campo `chi`)");

console.log("\n══ CASO 4 · una scrittura in coda sopravvive alla CHIUSURA della scheda? ══");
await db.doc(VIA).set({ esiti: { dpi: false }, chi: "prima-della-chiusura" });
const terza = await apri();
await terza.ctx.setOffline(true);
await terza.p.evaluate(() => window.__scriviSenzaAspettare("chi", "scritta-e-poi-chiusa"));
await terza.p.waitForTimeout(600);
await terza.ctx.close();                       // la scheda se ne va con la coda dentro
await new Promise((r) => setTimeout(r, 1500));
mostra("il database dopo la chiusura", await dal());
console.log("   → se è rimasto «prima-della-chiusura», quella scrittura è PERSA con la scheda.");

await anna.ctx.close(); await bruno.ctx.close(); await b.close(); server.close();
console.log("\nMisura finita. Le risposte vanno lette e scritte in docs/, non dedotte.");
process.exit(0);

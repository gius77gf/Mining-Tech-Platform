/* MISURA — NON VA IN npm test (vuole l'emulatore e Chromium, e stampa).
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL PONTEGGIO CHE MANCAVA: UN BROWSER, QUI DENTRO, CHE PARLA COL DATABASE.
   Serve alla parte che resta della decisione 5b — il **lavoro senza rete** —
   perché la coda offline di Firestore (`enableIndexedDbPersistence`) vive nel
   browser e in `node` non si misura. Ma in questo contenitore una pagina non
   può caricare Firebase da `gstatic.com`: la rete non c'è, ed è la ragione per
   cui il core non si apre in locale e per cui esiste `finto-firebase.mjs`.
   Il finto però non ha un database vero: non può dire niente sulla coda.

   La strada che funziona, misurata l'08/08 invece che dedotta: i **bundle
   pronti per il browser** stanno già in `tests/node_modules/firebase`
   (`firebase-app.js`, `firebase-firestore.js`) — sono gli stessi che gstatic
   serve. Si importano fra loro con URL assoluti di gstatic, e **quella è
   l'unica cosa da cambiare**: riscritti su percorsi locali, la pagina li carica
   e l'SDK parte davvero.
   ⚠️ Si RIGENERANO qui a ogni giro invece di essere committati: sono 800 KB, e
   una copia committata invecchierebbe rispetto al pacchetto.

   Esito della prima prova: la pagina scrive e il database risponde
   **`permission-denied`** — cioè le REGOLE VERE stanno girando e rifiutano una
   scrittura senza login. È la risposta giusta, ed è la prova che il ponte
   regge: il passo dopo è autenticarsi e scrivere dentro l'organizzazione.

   Uso:  cd apps/deepwork-id && firebase emulators:exec --only firestore \
           --project demo-deepwork "node tests/browser/ponte-emulatore.mjs"   */

/* come gli altri banchi: playwright sta fuori dal progetto, si importa per percorso */
const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createServer } from "node:http";

const QUI = dirname(fileURLToPath(import.meta.url));
const MODULI = join(QUI, "..", "node_modules", "firebase");
const PORTA = Number(process.argv[2]) || 8942;
const CHROMIUM = "/opt/pw-browsers/chromium";

/* 1. i bundle, con gli import di gstatic riscritti su percorsi locali */
const cartella = mkdtempSync(join(tmpdir(), "ponte-emulatore-"));
for (const nome of ["firebase-app.js", "firebase-firestore.js"]) {
  const src = readFileSync(join(MODULI, nome), "utf8")
    .replace(/https:\/\/www\.gstatic\.com\/firebasejs\/[\d.]+\//g, "/");
  writeFileSync(join(cartella, nome), src);
}

/* 2. la pagina di prova: inizializza l'SDK vero contro l'emulatore */
writeFileSync(join(cartella, "prova.html"), `<!doctype html><meta charset="utf-8"><body>
<script type="module">
import { initializeApp } from "/firebase-app.js";
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc } from "/firebase-firestore.js";
const app = initializeApp({ projectId: "demo-deepwork", apiKey: "demo-api-key" });
const db = getFirestore(app);
connectFirestoreEmulator(db, "127.0.0.1", 8080);
try {
  await setDoc(doc(db, "prove/dalBrowser"), { chi: "browser" });
  window.__esito = "SCRITTO: " + JSON.stringify((await getDoc(doc(db, "prove/dalBrowser"))).data());
} catch (e) { window.__esito = "RIFIUTATO: " + (e.code || e.message); }
</script></body>`);

/* 3. un server nostro, col contrassegno del pid riletto dal server — la regola
   di casa per ogni banco che alza una porta: se risponde qualcun altro, ci si
   ferma invece di misurare la copia di un altro */
writeFileSync(join(cartella, "contrassegno.txt"), String(process.pid));
const mime = { ".js": "text/javascript", ".html": "text/html", ".txt": "text/plain" };
const server = createServer((req, res) => {
  const f = join(cartella, (req.url || "/").split("?")[0].replace(/^\//, "") || "prova.html");
  /* ⚠️ si LEGGE prima e si scrive l'intestazione dopo: scritta prima, un file
     che non c'è fa partire il 200 e poi il catch prova a mandare un 404 su
     un'intestazione già spedita (`ERR_HTTP_HEADERS_SENT`), e il banco muore
     per il suo server invece che per il soggetto. Successo scrivendolo. */
  let corpo;
  try { corpo = readFileSync(f); } catch { res.writeHead(404); res.end("no"); return; }
  res.writeHead(200, { "content-type": mime[f.slice(f.lastIndexOf("."))] || "text/plain" });
  res.end(corpo);
});
await new Promise((ok) => server.listen(PORTA, "127.0.0.1", ok));
const riletto = await (await fetch(`http://127.0.0.1:${PORTA}/contrassegno.txt`)).text();
if (riletto.trim() !== String(process.pid)) {
  console.error(`⛔ sulla porta ${PORTA} risponde un altro server (pid ${riletto.trim()}): mi fermo.`);
  process.exit(2);
}
console.log(`porta ${PORTA} · contrassegno riletto = pid ${process.pid} ✔`);

/* 4. il browser */
const b = await chromium.launch({ executablePath: CHROMIUM });
const pag = await b.newPage();
const errori = [];
pag.on("pageerror", (e) => errori.push(String(e).slice(0, 140)));
await pag.goto(`http://127.0.0.1:${PORTA}/prova.html`);
await pag.waitForFunction(() => window.__esito !== undefined, { timeout: 30000 })
  .catch(() => {});
const esito = await pag.evaluate(() => window.__esito);
await b.close(); server.close();

console.log(`esito dal browser: ${esito === undefined ? "(niente: l'SDK non ha risposto)" : esito}`);
if (errori.length) console.log("errori di pagina:", errori.slice(0, 3).join(" · "));

/* ⛔ CHE COSA VUOL DIRE, scritto qui perché non si legga al contrario: un
   `RIFIUTATO: permission-denied` è **l'esito buono** di questa prova. Vuol dire
   che l'SDK vero è partito nel browser, ha raggiunto l'emulatore, e le REGOLE
   hanno respinto una scrittura senza login — che è quello che devono fare.
   Il ponte regge; quello che manca per la 5b è autenticarsi e scrivere dentro
   l'organizzazione, poi staccare la rete con `context.setOffline(true)`. */
const ok = typeof esito === "string" && (esito.startsWith("SCRITTO") || esito.includes("permission-denied"));
console.log(ok
  ? "\n✔ IL PONTE REGGE: un browser, in questo contenitore, parla col database vero."
  : "\n⛔ IL PONTE NON REGGE: l'SDK non è arrivato all'emulatore.");
process.exit(ok ? 0 : 1);

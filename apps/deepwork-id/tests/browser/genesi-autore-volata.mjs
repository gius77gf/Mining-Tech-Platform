/* GENESI: UNA VOLATA SALVATA NON DICEVA CHI L'AVEVA SALVATA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-autore-volata.mjs [--porta=8766]
     node genesi-autore-volata.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dalla ricerca continua del 19/09: `GDB.utente` (uid+email
   di chi è collegato) è già disponibile in modalità organizzazione — è la
   stessa identità che `portaNellOrganizzazione` usa già per l'`autore` —
   ma `volSnapshot()` non la scriveva mai sulla volata salvata, e Home non
   la mostrava. In un'organizzazione dove più persone condividono lo stesso
   ambiente (il caso normale, non l'eccezione: è la premessa multi-tenant
   di questo repository), due volate omonime salvate da persone diverse
   erano indistinguibili per autore.

   Genesi non ha un vero login in questo ambiente di prova (niente Firebase
   reale, `gstatic.com` è bloccato di proposito): il banco entra in modalità
   locale come tutti gli altri, apre il salvataggio, e SIMULA l'org mode
   scrivendo `window.__genesi.GDB.utente` — l'unico modo di provare il ramo
   «autore presente» senza una rete vera. È lo stesso principio di
   `genesi-numeri-tranquilli.mjs`: il caso si costruisce nei dati, mai nel
   documento. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8766;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: `volSnapshot` torna a non scrivere `autore`, e
   Home torna a non mostrarlo — esattamente come prima del 19/09. */
const DIFETTI = [
  [`autore: (GDB.utente && GDB.utente.uid) ? { uid: GDB.utente.uid, email: GDB.utente.email || null } : null,\n`,
   ``],
  [`+(v.autore&&v.autore.email?' · '+_rEsc(v.autore.email):'')+`,
   `+`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. */
const SEGNO = join(R, "__genesi-autore-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-autore-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
pg.__err = [];
pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
const scadenza = Date.now() + 25000;
while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
await pg.waitForTimeout(300);
await pg.click('#bottomnav button[data-scr="design"]');
await pg.waitForTimeout(600);

/* la simulazione dell'org mode: si scrive l'utente PRIMA di salvare */
await pg.evaluate(() => { window.__genesi.GDB.utente = { uid: "u_mario", email: "mario@cava-esempio.it" }; });

await pg.click("#btn-salva-volata");
await pg.waitForTimeout(300);
await pg.fill("#modal-campo", "Volata di prova con autore");
await pg.click("#modal-foot .mbtn.primary");
await pg.waitForTimeout(300);

const salvate = await pg.evaluate(async () => window.__genesi.GDB.volate());
const nuova = salvate.find((v) => v.nome === "Volata di prova con autore");
dice(!!nuova, "la volata compare nello storico", nuova);
dice(!!(nuova && nuova.autore && nuova.autore.uid === "u_mario"), "⛔ la volata salvata porta l'uid di chi era collegato", nuova && nuova.autore);
dice(!!(nuova && nuova.autore && nuova.autore.email === "mario@cava-esempio.it"), "   e la sua email", nuova && nuova.autore);

/* e in Home si vede, senza ricaricare (renderHome legge dallo stesso GDB) */
await pg.click('#bottomnav button[data-scr="home"]');
await pg.waitForTimeout(400);
const testoHome = await pg.evaluate(() => document.getElementById("hgVolate")?.innerText || "");
dice(testoHome.includes("mario@cava-esempio.it"), "⛔ e compare in Home, accanto alla volata: due omonime di persone diverse ora si distinguono", testoHome.slice(0, 200));

/* senza autore (modalità locale, il caso di sempre): niente si rompe e
   niente email fantasma compare */
await pg.evaluate(() => { window.__genesi.GDB.utente = null; });
await pg.click("#hgSalva");
await pg.waitForTimeout(300);
await pg.fill("#modal-campo", "Volata locale senza autore");
await pg.click("#modal-foot .mbtn.primary");
await pg.waitForTimeout(300);
const salvate2 = await pg.evaluate(async () => window.__genesi.GDB.volate());
const senzaAutore = salvate2.find((v) => v.nome === "Volata locale senza autore");
dice(!!senzaAutore && senzaAutore.autore === null, "senza utente collegato l'autore resta null, non un oggetto vuoto o un errore", senzaAutore && senzaAutore.autore);

dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO · ${prove} prove`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

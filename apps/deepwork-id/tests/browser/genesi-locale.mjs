/* GENESI: LE VOLATE PASSANO DALLA PORTA SUI DATI, E LA CHIAVE È QUELLA DI PRIMA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-locale.mjs                 (salva, ricarica, duplica, elimina)
     node genesi-locale.mjs --controprova   (rimette il difetto: DEVE fallire)
     node genesi-locale.mjs --scatti

   PERCHÉ ESISTE. Dal 02/09 (unità 2 di docs/GENESI_FUORI_DAL_BROWSER.md §5)
   la Home di Genesi legge, salva, duplica ed elimina le volate attraverso
   `genesiData()` invece che con `_lsGet/_lsSet` scritte nella pagina. La
   promessa del piano è che PER CHI USA GENESI NON CAMBI NIENTE: sotto c'è la
   stessa chiave `genesiVolate`, con la stessa forma di record e lo stesso
   tetto. Questo banco fa i quattro gesti da utente e guarda DUE cose ogni
   volta: la chiave nel browser (che cosa c'è scritto sotto) e la Home (che
   cosa si vede sopra). Se una delle due dicesse una cosa diversa dall'altra,
   la porta sarebbe una copia debole con un nome nuovo.
   La controprova rimette il difetto più silenzioso: la Home che non legge
   dalla porta (elenco vuoto) mentre la chiave si riempie — la pagina «funziona»
   (salva, dice «Volata salvata») e non mostra niente.
   ⚠️ I banchi che scrivono `genesiVolate` a mano (frasi-limite, campi-assenti,
   foglio-in-cava, documenti-che-escono) restano veri per costruzione: è la
   stessa chiave. Questo banco è l'unico che passa dai BOTTONI. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = "/tmp/genesi-locale";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
/* IL DIFETTO DA RIMETTERE: la Home che non chiede alla porta. Il `cerca` cita
   la riga di `renderHome` insieme a quella dopo, perché `await GDB.volate()`
   compare anche in `salvaVolata`. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "const arr=await GDB.volate();\n  if($('hgVolN'))",
   "const arr=[];   /* difetto rimesso dal banco */\n  if($('hgVolN'))"],
];
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
const URL_G = `http://127.0.0.1:${porta}/apps/genesi/genesi.html`;
await pg.goto(URL_G, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2600);
// il consenso al primo avvio, se c'è, si accetta come farebbe l'utente
await pg.evaluate(() => { const ok = document.getElementById("consensoOk"); if (ok && ok.offsetParent !== null) ok.click(); });

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
const chiave = () => pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("genesiVolate") || "[]"); } catch (e) { return "corrotta"; } });
const home = () => pg.evaluate(() => ({
  righe: [...document.querySelectorAll("#hgVolate .hg-item")].map((x) => ({ id: x.getAttribute("data-id"), nome: (x.querySelector("b") || {}).textContent })),
  conta: (document.getElementById("hgVolN") || {}).textContent,
  vuoto: !!document.querySelector("#hgVolate .hg-empty"),
  schermata: [...document.querySelectorAll("#bottomnav button")].find((x) => x.classList.contains("on"))?.dataset.scr }));
const premi = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); }, sel); await pg.waitForTimeout(350); };
const premiModale = async (etichetta) => {
  const fatto = await pg.evaluate((et) => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => x.textContent.trim() === et); if (b) { b.click(); return true; } return false; }, etichetta);
  await pg.waitForTimeout(400); return fatto;
};

dice(errori.length === 0, "nessun errore di pagina all'apertura", errori.slice(0, 3));
const h0 = await home();
dice(h0.schermata === "home", "si parte dalla Home", h0.schermata);
dice((await chiave()).length === 0 && h0.vuoto, "all'inizio la chiave è vuota e la Home dice «Nessuna volata salvata»", [await chiave(), h0]);

// 1 · salva dalla Home: la modale chiede il nome, lo si scrive, si conferma
await premi("#hgSalva");
const campo = await pg.$("#modal-campo");
dice(!!campo, "la modale «Salva la volata» chiede il nome");
if (campo) { await pg.fill("#modal-campo", "Fronte di prova"); dice(await premiModale("Salva"), "premuto «Salva»"); }
await pg.waitForTimeout(500);
let k = await chiave(); let h = await home();
dice(Array.isArray(k) && k.length === 1, "SOTTO: la chiave genesiVolate ha 1 record", k);
if (Array.isArray(k) && k[0]) {
  const r = k[0];
  dice(typeof r.id === "string" && r.id.startsWith("v") && r.nome === "Fronte di prova" && typeof r.data === "string" && r.design && typeof r.design === "object" && typeof r.sintesi === "string",
    "il record ha la forma di sempre: id «v…», nome, data, design, sintesi", Object.keys(r));
}
dice(h.righe.length === 1 && h.righe[0].nome === "Fronte di prova", "SOPRA: la Home mostra la volata appena salvata", h);
dice(/1 salvata/.test(h.conta || ""), "e il contatore dice «1 salvata»", h.conta);
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);

// 2 · ricarica: la chiave è persistente e la Home la rilegge
await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2600);
h = await home(); k = await chiave();
dice(k.length === 1 && h.righe.length === 1 && h.righe[0].id === k[0].id, "dopo la ricarica la Home mostra lo stesso record (stesso id) che sta nella chiave", [k.map((x) => x.id), h.righe]);

// 3 · duplica
await premi("#hgVolate [data-act='dup']");
k = await chiave(); h = await home();
dice(k.length === 2 && k[1].nome === "Fronte di prova (copia)" && k[1].id !== k[0].id, "duplicata: 2 record sotto, la copia col suo nome e un id nuovo", k.map((x) => [x.id, x.nome]));
dice(h.righe.length === 2 && /2 salvate/.test(h.conta || ""), "e sopra 2 righe, «2 salvate»", h);

// 4 · elimina la copia (la Home elenca dal più recente: la copia è la prima riga)
await premi("#hgVolate .hg-item:first-child [data-act='del']");
const modaleDel = await pg.evaluate(() => (document.getElementById("modal-foot") || {}).textContent || "");
dice(/Elimina/.test(modaleDel), "la conferma dell'eliminazione è comparsa, col bottone «Elimina»", modaleDel);
dice(await premiModale("Elimina"), "premuto «Elimina»");
await pg.waitForTimeout(400);
k = await chiave(); h = await home();
dice(k.length === 1 && k[0].nome === "Fronte di prova", "eliminata la copia: sotto resta l'originale", k.map((x) => x.nome));
dice(h.righe.length === 1 && /1 salvata/.test(h.conta || ""), "e sopra 1 riga, «1 salvata»", h);
dice(errori.length === 0, "nessun errore di pagina in tutto il giro", errori.slice(0, 3));

if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "controprova.png" : "home.png"), fullPage: false }); }
await b.close(); srv.close();
console.log(`\nRisultato porta sui dati di Genesi: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

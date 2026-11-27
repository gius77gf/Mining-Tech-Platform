/* IL MURO DI TUTTA LA CAVA IN SCUDO: CONCESSIONE, MEZZI E PERSONE (ponte 3b)
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-scadenze-unite.mjs                    (dimostrazione: Terra e Flotta rispondono)
     node scudo-scadenze-unite.mjs --terra-assente    (il modulo servito risponde null per Terra)
     node scudo-scadenze-unite.mjs --controprova      (rimette il difetto: DEVE fallire)
     node scudo-scadenze-unite.mjs --scatti

   PERCHÉ ESISTE. Dal 02/09 la schermata Scadenze di Scudo apre con «Tutta la
   cava»: le scadenze della concessione (Terra) e dei mezzi (Flotta) con la
   stessa regola di quelle delle persone (`scadenzeUnite`, in shared/). Tre
   esiti da misurare dove si formano:
   · le due app rispondono → il conto di tutta la cava, e le righe scadute o in
     scadenza delle altre app con la pastiglia dell'app;
   · Terra NON risponde → la nota lo dice per nome e NON conta la concessione
     come «zero scadenze»;
   · la controprova rimette nella pagina la traduzione null→[] e pretende che
     il verso «assente» cada.
   ⚠️ L'import di Firebase da gstatic si taglia subito; il banco si lancia
   senza le variabili del proxy (col proxy Chromium aspetta 12,7 s). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const ASSENTE = process.argv.includes("--terra-assente") || CONTROPROVA;
const SCATTI = process.argv.includes("--scatti");
const OUT = "/tmp/scudo-scadenze-unite";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const CERCA = "scadenzeTerra:  async () => mem.scadenzeTerra || []";
const DIFETTI = [
  ["apps/scudo/index.html",
   "try { SCT = db.scadenzeTerra ? await db.scadenzeTerra() : null; } catch (e) { SCT = null; }",
   "try { SCT = (db.scadenzeTerra ? await db.scadenzeTerra() : null) || []; } catch (e) { SCT = []; }   /* difetto rimesso dal banco */"],
];
let iniettato = 0, difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  const rel = p.slice(R.length + 1);
  if (ASSENTE && rel === "apps/scudo/scudo-data.js") {
    const t = corpo.toString("utf8"); const n = t.split(CERCA).length - 1;
    if (n !== 1) { console.error(`✗ iniezione mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA, "scadenzeTerra:  async () => null"), "utf8"); iniettato++;
  }
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (file !== rel) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
if ((await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text())) !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
for (let i = 0; i < 80; i++) { await pg.waitForTimeout(250); if (await pg.evaluate(() => (document.getElementById("scad-list")?.innerHTML.length || 0) > 0)) break; }

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 2));
if (ASSENTE) dice(iniettato > 0, `il modulo servito rispondeva null per Terra (${iniettato} iniezioni)`);
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);

await pg.click("#nav-scad");
let box = null;
for (let i = 0; i < 30 && !box; i++) {
  await pg.waitForTimeout(200);
  box = await pg.evaluate(() => {
    const u = document.getElementById("scad-unite"); if (!u) return null;
    const n = u.querySelector(".note"); if (!n || /Sto chiedendo/.test(n.textContent)) return null;
    return { testo: n.textContent.replace(/\s+/g, " ").trim(), warn: n.classList.contains("warn"),
      righe: [...u.querySelectorAll(".item")].map((x) => ({ testo: x.innerText.replace(/\s+/g, " "), app: (x.querySelector(".badge.app") || {}).textContent })),
      pagina: [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id),
      scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
}
dice(!!box, "il riquadro «Tutta la cava» è comparso e ha finito di chiedere");
if (box) {
  dice(box.pagina.includes("page-scad"), "sono sulla schermata Scadenze", box.pagina);
  console.log("  testo:", box.testo);
  console.log("  righe:", box.righe.length, JSON.stringify(box.righe.slice(0, 3)));
  dice(box.scroll <= box.client, "la pagina non scorre di lato a 430px", [box.scroll, box.client]);
  if (ASSENTE) {
    dice(box.warn, "la nota è in tono avviso");
    dice(/Terra non ha risposto/.test(box.testo), "dice per nome che Terra non ha risposto");
    dice(/non vale zero/.test(box.testo), "e che la concessione non vale zero");
    dice(!box.righe.some((r) => r.app === "Terra"), "nessuna riga attribuita a Terra");
    dice(box.righe.some((r) => r.app === "Flotta"), "ma quelle di Flotta ci sono", box.righe.map((r) => r.app));
  } else {
    dice(!box.warn, "la nota non è in tono avviso");
    dice(/Tutta la cava/.test(box.testo) && /scadute/.test(box.testo), "il conto di tutta la cava è scritto");
    dice(box.righe.some((r) => r.app === "Terra" && /Rilievo periodico|screening/i.test(r.testo)), "la scadenza scaduta di Terra è nel muro con la sua pastiglia", box.righe.map((r) => r.testo.slice(0, 60)));
    dice(box.righe.some((r) => r.app === "Flotta" && /Verifica periodica/.test(r.testo)), "e la verifica periodica scaduta di Flotta anche");
    dice(box.righe.some((r) => r.app === "Terra" && /fideiussione|Polizza/i.test(r.testo) && /tra \d+ gg/i.test(r.testo)), "la fideiussione di Terra è «in scadenza» col suo preavviso di 90 giorni");
    dice(!box.righe.some((r) => /senza data/.test(r.testo)), "le senza data non stanno fra le scadute/in scadenza: sono nel conto");
    dice(/1 senza data/.test(box.testo), "e il conto le dichiara (1 senza data: la prescrizione di Terra)", box.testo);
  }
  if (SCATTI) { mkdirSync(OUT, { recursive: true });
    const el = await pg.$("#scad-unite"); if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: join(OUT, ASSENTE ? "assente.png" : "sano.png") }); } }
}
await b.close(); srv.close();
console.log(`\nRisultato muro di tutta la cava${ASSENTE ? " (Terra assente)" : ""}: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

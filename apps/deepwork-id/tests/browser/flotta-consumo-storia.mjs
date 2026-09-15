/* FLOTTA: IL CONSUMO DI UN MEZZO CONTRO LA SUA STORIA, NELLA RIGA DEL MEZZO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-consumo-storia.mjs                 (storia iniettata nel modulo servito)
     node flotta-consumo-storia.mjs --controprova   (rimette il difetto: DEVE fallire)
     node flotta-consumo-storia.mjs --scatti

   PERCHÉ ESISTE. La dimostrazione di Flotta ha dieci pieni in venti giorni:
   nessun mezzo ha una STORIA prima della finestra dei 30 giorni, e la riga lo
   dice. Il caso per cui `consumoControStoria` esiste — il Dumper che negli
   ultimi trenta giorni beve più del suo solito — lo si costruisce INIETTANDO
   tre pieni vecchi nel modulo servito (mai sul file: cinque prove assolute
   della suite vivono sui numeri della dimostrazione). Poi si legge la riga:
   il recente, il solito, la forbice e «da guardare» quando è sopra la
   tolleranza dichiarata; sugli altri mezzi la ragione per cui non si dice.
   La controprova rimette la riga senza la storia: la pagina che calcola e
   non dice. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = "/tmp/flotta-consumo-storia";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
/* la storia del Dumper, iniettata prima del suo primo pieno della dimostrazione:
   storia (400+390)/(8300−8200) = 7,9 l/h; recente dal pieno di 40 giorni fa
   (390+415+360)/(8416−8300) = 10,04 l/h → +27 % */
const CERCA = '    { id: "r4", data: isoIndietro(20), mezzo: "Dumper D1", litri: 390, euro: 585, ore: 8355, nota: "", costoId: null },';
const STORIA = '    { id: "r4a", data: isoIndietro(70), mezzo: "Dumper D1", litri: 400, euro: 600, ore: 8200, nota: "", costoId: null },\n'
  + '    { id: "r4b", data: isoIndietro(55), mezzo: "Dumper D1", litri: 400, euro: 600, ore: 8250, nota: "", costoId: null },\n'
  + '    { id: "r4c", data: isoIndietro(40), mezzo: "Dumper D1", litri: 390, euro: 585, ore: 8300, nota: "", costoId: null },\n' + CERCA;
let iniettato = 0;
const DIFETTI = [
  ["apps/flotta/index.html",
   ' · <b class="bad">${m.senzaSpesa === 1 ? "1 pieno senza la spesa" : m.senzaSpesa + " pieni senza la spesa"}</b>` : ""}${storiaTx(m)}</div></div>',
   ' · <b class="bad">${m.senzaSpesa === 1 ? "1 pieno senza la spesa" : m.senzaSpesa + " pieni senza la spesa"}</b>` : ""}</div></div>   /* difetto rimesso dal banco */'],
];
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) {
    const t = corpo.toString("utf8"); const n = t.split(CERCA).length - 1;
    if (n !== 1) { console.error(`✗ iniezione della storia mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA, STORIA), "utf8"); iniettato++;
  }
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
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
let pronto = false; for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("rif-list")?.innerHTML.length || 0) > 0); }
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
// la scheda dei costi, dove vive la lista dei rifornimenti (#page-cos)
await pg.click("#nav-cos"); await pg.waitForTimeout(500);
dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-cos")).display !== "none"), "sono sulla schermata Costi, dove stanno i rifornimenti");
const righe = await pg.evaluate(() => [...document.querySelectorAll("#rif-list .item")].filter((i) => i.querySelector(".meta.norma")).map((i) => ({ nome: i.querySelector(".name")?.textContent.trim(), norma: i.querySelector(".meta.norma")?.textContent.replace(/\s+/g, " ").trim(), bad: !!i.querySelector(".meta.norma .bad") })));
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(iniettato > 0, `la storia del Dumper è stata iniettata nel modulo servito (${iniettato})`);
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);
const d1 = righe.find((r) => /Dumper D1/.test(r.nome || ""));
dice(!!d1, "c'è la riga del Dumper D1", righe.map((r) => r.nome));
console.log("  D1:", d1 && d1.norma);
dice(!!d1 && /ultimi 30 giorni: 10,0 l\/h contro 7,9 l\/h del suo solito/.test(d1.norma), "la riga dice il recente (10,0 l/h) contro il suo solito (7,9 l/h)", d1 && d1.norma);
dice(!!d1 && /\+27%, sopra la tolleranza del 15%: da guardare/.test(d1.norma) && d1.bad, "la forbice +27% è sopra la tolleranza dichiarata: «da guardare», in rosso", d1);
const e1 = righe.find((r) => /Escavatore E1/.test(r.nome || ""));
dice(!!e1 && /non c'è una storia con cui confrontare/.test(e1.norma) && !e1.bad, "l'Escavatore E1, senza pieni prima della finestra, dice che non c'è una storia — e non è rosso", e1);
const e2 = righe.find((r) => /Escavatore E2/.test(r.nome || ""));
dice(!!e2 && !/ultimi 30 giorni/.test(e2.norma), "l'Escavatore E2, che non ha nemmeno il consumo, non ha la riga della storia", e2);
dice(righe.every((r) => !/NaN|undefined/.test(r.norma)), "nessun NaN né undefined nelle righe", righe);
if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.evaluate(() => document.getElementById("rif-list")?.scrollIntoView({ block: "start" })); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "controprova.png" : "righe.png") }); }
await b.close(); srv.close();
console.log(`\nRisultato consumo contro la storia: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

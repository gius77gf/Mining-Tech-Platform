/* IL VERBALE DI RICONCILIAZIONE DI CONTI: IL DIVARIO SCRITTO CON LA SUA CAUSA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-verbale.mjs                 (dimostrazione: scrive un verbale e lo rilegge)
     node conti-verbale.mjs --controprova   (rimette il difetto: DEVE fallire)
     node conti-verbale.mjs --scatti

   PERCHÉ ESISTE. Dal 02/09 sotto «Cavato contro venduto» c'è il verbale: il
   divario del periodo conservato con la causa scelta fra quelle che la
   schermata elenca. Il banco fa il gesto da utente — apre il Report, preme
   «Scrivi il verbale», sceglie una causa, scrive una nota, salva — e guarda
   tre cose: che il numero SALVATO sia quello che la schermata mostrava (letto
   dallo schermo, non dal banco), che il verbale compaia col suo testo, e che
   lo storico cresca di una riga col verso del passo.
   La controprova rimette il difetto più silenzioso: la pagina che salva uno
   zero al posto del divario. Il verbale si scrive lo stesso, la frase si legge
   uguale, e solo il confronto «allora/adesso» lo tradisce — cioè la difesa
   che il modulo ha costruito apposta. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = "/tmp/conti-verbale";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const DIFETTI = [
  ["apps/conti/index.html",
   'await db.aggiungi("verbali", { dal: d1, al: d2, tipo: "cavato", divario, pct, stato, causa, nota, scrittoIl: istanteLocale() });',
   'await db.aggiungi("verbali", { dal: d1, al: d2, tipo: "cavato", divario: 0, pct, stato, causa, nota, scrittoIl: istanteLocale() });   /* difetto rimesso dal banco */'],
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
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
let datiDopo = null; const t0 = Date.now();
for (let i = 0; i < 80 && datiDopo === null; i++) { await pg.waitForTimeout(250);
  if (await pg.evaluate(() => (document.getElementById("cos-riep")?.innerHTML.length || 0) > 0)) datiDopo = Date.now() - t0; }
console.log("  dati dimostrativi arrivati dopo ms:", datiDopo);
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
const leggi = () => pg.evaluate(() => {
  const box = document.getElementById("ric-verbale");
  const note = [...box.querySelectorAll(".note")].map((n) => ({ testo: n.textContent.replace(/\s+/g, " ").trim(), warn: n.classList.contains("warn") }));
  const righe = [...box.querySelectorAll(".item")].map((i) => ({ nome: i.querySelector(".name")?.textContent.replace(/\s+/g, " ").trim(), meta: i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(), verso: i.querySelector(".amt-s")?.textContent.trim() }));
  const num = document.querySelector("#ric-riep .cassa-num")?.textContent.replace(/\s+/g, " ").trim() || null;
  return { note, righe, bottone: document.getElementById("btn-ric-verbale")?.textContent.trim() || null, divarioSchermo: num };
});
await pg.click("#nav-rep");
// aspetto che il lato Terra abbia finito (i rilievi arrivano un attimo dopo)
let v = null;
for (let i = 0; i < 30; i++) { await pg.waitForTimeout(200); v = await leggi(); if (v.divarioSchermo && v.bottone) break; }
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(!!v.divarioSchermo, "il confronto cavato/venduto è disegnato (c'è un divario sullo schermo)", v);
dice(v.bottone === "Scrivi il verbale", "per l'anno in corso non c'è un verbale: il bottone dice «Scrivi il verbale»", v.bottone);
dice(v.note.length === 1 && /non c'è ancora un verbale/.test(v.note[0].testo), "e la nota lo dice", v.note);
dice(v.righe.length === 1 && /cumuli/.test(v.righe[0].meta) && v.righe[0].verso === "primo", "lo storico ha il verbale del primo semestre della dimostrazione, con la causa «cumuli», ed è il primo", v.righe);
const divarioSchermo = v.divarioSchermo;
// il gesto: scrivi il verbale
await pg.click("#btn-ric-verbale"); await pg.waitForTimeout(400);
dice(await pg.evaluate(() => !!document.getElementById("modal-campo") && !!document.getElementById("modal-nota")), "la modale chiede la causa (tendina) e la nota");
await pg.selectOption("#modal-campo", "rilievo");
await pg.fill("#modal-nota", "manca il volo di agosto");
await pg.evaluate(() => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => /Salva/.test(x.textContent)); if (b) b.click(); });
await pg.waitForTimeout(900);
v = await leggi();
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);
dice(v.note.length === 1 && /Verbale di questo periodo/.test(v.note[0].testo), "il verbale di questo periodo è comparso", v.note);
dice(/Manca un rilievo nel periodo/.test(v.note[0]?.testo || "") && /manca il volo di agosto/.test(v.note[0]?.testo || ""), "con la causa scelta e la nota scritta", v.note[0]);
const nSchermo = String(divarioSchermo).replace(/[^\d.,]/g, "");
dice(v.note[0] && v.note[0].testo.includes(nSchermo) && !v.note[0].warn && /lo stesso numero/.test(v.note[0].testo), `⛔ il numero salvato è quello che lo schermo mostrava (${divarioSchermo}) e oggi il conto dà lo stesso`, v.note[0]);
dice(v.bottone === "Scrivi un altro verbale", "il bottone ora dice «Scrivi un altro verbale»", v.bottone);
dice(v.righe.length === 2 && /rilievo/i.test(v.righe[0].meta), "lo storico è cresciuto di una riga, la più recente in cima", v.righe);
dice(v.righe[0] && /il divario (cresce|cala)|come prima/.test(v.righe[0].verso), "e la riga nuova dice il verso del passo rispetto al verbale prima", v.righe[0]);
dice(errori.length === 0, "nessun errore di pagina in tutto il giro", errori.slice(0, 3));
if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.evaluate(() => document.getElementById("ric-verbale")?.scrollIntoView({ block: "center" })); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "controprova.png" : "verbale.png") }); }
await b.close(); srv.close();
console.log(`\nRisultato verbale di riconciliazione: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

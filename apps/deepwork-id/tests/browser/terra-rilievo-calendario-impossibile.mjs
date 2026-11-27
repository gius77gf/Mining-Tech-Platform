/* UN RILIEVO CON CALENDARIO IMPOSSIBILE NON MANDA IN CRASH LA PAGINA RILIEVI
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-rilievo-calendario-impossibile.mjs [--porta=8951]
     node terra-rilievo-calendario-impossibile.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Terra (17/09, agente
   a82876ad086170520). `shared/dw-ponti.js` aveva una copia debole locale,
   `dataISOBuona`, che guardava solo la FORMA (`/^\d{4}-\d{2}-\d{2}$/`) e non
   il CALENDARIO — la stessa famiglia di difetto che questo file evita
   altrove con `dataISOEsiste`, già importata. Una data come "2026-13-45"
   (forma valida, mese/giorno impossibili) passava il filtro di
   `misuratoPeriodo`/`intervalliFraRilievi`/`produzioneDichiarata`/
   `produzionePerFronte` ed entrava in `ultimo`, che `avanzamentoDaUltimoRilievo`
   trasforma con `new Date(mis.ultimo + "T00:00:00Z").toISOString()`: su una
   data invalida questo non dà NaN, SOLLEVA `RangeError: Invalid time
   value`. La sezione "Quello che dichiarano i turni" della pagina Rilievi
   restava bloccata per sempre sul segnaposto di caricamento. Latente (il
   form nativo e l'import CSV impediscono oggi di scrivere una data così),
   ma raggiungibile da un rilievo scritto prima di una validazione o da una
   scrittura diretta su Firestore. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8951;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: un rilievo con data a calendario impossibile, mai sul disco. */
const CASO = [
  '{ id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2", fronteId: "f1" },',
  '{ id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2", fronteId: "f1" },\n    { id: "rX", titolo: "TEST calendario impossibile", data: "2026-13-45", tipo: "Ortofoto + DEM", volumeM3: 999999, stato: "elaborato", fronteId: "f1" },',
];
/* IL DIFETTO DA RIMETTERE: `dataISOEsiste` → la vecchia `dataISOBuona`
   (solo forma), nei quattro punti in cui era stata sostituita. */
const DIFETTI = [
  ['if (!dataISOEsiste(d)) { senzaData++; continue; }', 'if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(d)) { senzaData++; continue; }'],
  ['if ((r || {}).stato !== "elaborato" || v == null || !dataISOEsiste(d)) continue;',
   'if ((r || {}).stato !== "elaborato" || v == null || !/^\\d{4}-\\d{2}-\\d{2}$/.test(d)) continue;'],
  ['&& dataISOEsiste(r.data) && provenienzaDi(r) === "scavo")', '&& /^\\d{4}-\\d{2}-\\d{2}$/.test(r.data) && provenienzaDi(r) === "scavo")'],
  ['if (!dataISOEsiste(d)) { scartati++; continue; }', 'if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(d)) { scartati++; continue; }'],
];
let iniezioniCaso = 0, iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/terra/terra-data.js")) {
    let t = corpo.toString("utf8");
    if (t.includes(CASO[0])) { t = t.replace(CASO[0], CASO[1]); iniezioniCaso++; }
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("shared/dw-ponti.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { t = t.replace(a, b); iniezioniDifetto++; }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
await pg.waitForTimeout(2000);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(iniezioniCaso === 1, "il caso (rilievo a calendario impossibile) è stato iniettato nella risposta HTTP", iniezioniCaso);
if (CONTROPROVA) dice(iniezioniDifetto === 4, `il difetto è stato rimesso nella pagina servita (${iniezioniDifetto}/4)`, iniezioniDifetto);

await pg.evaluate(() => { if (window.go) window.go("rilievi"); });
await pg.waitForTimeout(1500);

dice(errori.length === 0, "la pagina non solleva errori (⛔ prima: RangeError: Invalid time value)", errori.slice(0, 2));
const segnaposto = await pg.evaluate(() => {
  const nodes = [...document.querySelectorAll("body *:not(script):not(style)")].filter((e) => e.children.length === 0);
  return nodes.some((e) => /Sto leggendo i rapportini/i.test(e.textContent || ""));
});
dice(!segnaposto, "la sezione «quello che dichiarano i turni» finisce di caricare, non resta bloccata sul segnaposto", segnaposto);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* LA SCHEDA VOLATA (CSV) CONTA I FORI DISEGNATI, NON LA GRIGLIA DI PROGETTO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-csv-fori-disegnati.mjs [--porta=8938]
     node genesi-csv-fori-disegnati.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Genesi (17/09, agente
   a200d8450deefcbef). Il bottone «📄 Esporta scheda volata (CSV)» promette
   nel suo stesso commento «stesse cifre della Scheda validatori», e la Scheda
   validatori — come il Report a stampa — conta i fori DISEGNATI sulla tela
   (`measureGeom2D(D2).n`). Ma «Fori»/«Carica totale (kg)»/«Costo totale
   stima» nel CSV venivano da `computeKPI()`, che conta sulla GRIGLIA di
   progetto (`foriDiProgetto`, fori-per-fila × n° file) — scelta corretta e
   deliberata PER `computeKPI` (serve al confronto A/B fra due progetti anche
   quando uno non ha ancora un foro disegnato), ma sbagliata per un file
   che promette di ripetere lo schermo.
   Riprodotto dal vivo: progetto demo (griglia 12 fori), aggiunto un 13°
   foro sulla tela (azione normale dell'editor). Schermo e Report: 13 fori,
   754 kg. Il CSV archiviato col rapportino diceva ancora «Fori;12»,
   «Carica totale (kg);696» — un numero diverso da quello che il fochino
   ha appena visto a schermo, nello stesso file che porta in cava. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8938;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. */
const DIFETTI = [
  [`  const _gCsv=measureGeom2D(D2), _nfCsv=_gCsv.n;
  const _cKCsv=costoVolata({ nf:_nfCsv, kg:D2.kg, mPerf:metriPerforati(_nfCsv, D2.prof, D2.sub),
    cPerf:D2.cPerf, cExpl:D2.cExpl, cInnesco:D2.cInnesco });`, ``],
  [`['Fori', _nfCsv],`, `['Fori', k.nf],`],
  [`['Carica totale (kg)', _cKCsv.qtot===null?null:Math.round(_cKCsv.qtot)],`, `['Carica totale (kg)', k.qtot],`],
  [`['Esito carica totale', _cKCsv.qtot===null?'non calcolabile':'contata sui fori del disegno'],`,
   `['Esito carica totale', k.qtot===null?'non calcolabile':'contata sulla griglia di progetto'],`],
  [`['Costo totale stima (EUR)', _cKCsv.calcolabile?Math.round(_cKCsv.tot):null],`, `['Costo totale stima (EUR)', k.cost],`],
  [`['Esito costo', _cKCsv.calcolabile?'contato sui prezzi unitari inseriti':'non calcolabile'],`,
   `['Esito costo', k.costCalcolabile?'contato sui prezzi unitari inseriti':'non calcolabile'],`],
  [`['Perche il costo non e calcolabile', _cKCsv.calcolabile?'':_cKCsv.che],`,
   `['Perche il costo non e calcolabile', k.costCalcolabile?'':k.costChe],`],
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) {
      const n = t.split(a).length - 1;
      if (n === 1) { t = t.replace(a, b); iniezioniDifetto++; }
      else console.log(`⛔ INIEZIONE MANCATA: "${a.slice(0, 60)}…" trovata ${n} volte invece di 1`);
    }
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
const pg = await b.newPage({ viewport: { width: 1200, height: 900 }, acceptDownloads: true });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html`);
await pg.waitForTimeout(1500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto === DIFETTI.length, `il difetto è stato rimesso nella pagina servita (${iniezioniDifetto}/${DIFETTI.length})`, iniezioniDifetto);

await pg.click('.card[data-go="design"]');
await pg.waitForTimeout(800);
const prima = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(prima > 1, "la griglia di progetto è stata generata (più di un foro)", prima);

// aggiunge un foro oltre la griglia, come farebbe un click sulla tela
await pg.evaluate(() => {
  const D2 = window.__genesi.D2;
  const id = Math.max(0, ...D2.holes.map((h) => h.id || 0)) + 1;
  D2.holes.push({ id, mx: 5, my: 5 });
});
const dopo = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(dopo === prima + 1, "il foro extra è stato aggiunto sul disegno", { prima, dopo });

const [download] = await Promise.all([
  pg.waitForEvent("download"),
  pg.evaluate(() => document.getElementById("btn-scheda-csv")?.click()),
]);
const path = await download.path();
const testo = readFileSync(path, "utf8");
const rigaFori = (testo.split("\n").find((r) => /^Fori;/.test(r)) || "").trim();

dice(rigaFori === `Fori;${dopo}`, `il CSV dice «Fori;${dopo}», come lo schermo e il Report (fori DISEGNATI, non la griglia)`, rigaFori);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

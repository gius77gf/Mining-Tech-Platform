/* IL VALORE DEL MATERIALE NON GONFIA PER UN RILIEVO A CALENDARIO IMPOSSIBILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-valore-calendario-impossibile.mjs [--porta=8953]
     node terra-valore-calendario-impossibile.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal quinto giro di deep-pass su Terra (18/09). `renderValore`
   (il riquadro "Valore del materiale estratto" nella pagina Rilievi) filtrava
   i rilievi dell'anno con `rilievoUsabile` (solo forma/elaborato/volume),
   non `rilievoUsabileConData` — la stessa copia debole già chiusa il 17/09
   in `proiezioneAnnua`/`varianzaLottoAnno`/`anniConVolumi` (vedi
   terra-riserva-calendario-impossibile.mjs). Un rilievo con
   `data:"2026-13-45"` (forma valida, calendario impossibile) passava
   comunque il filtro sull'anno (`.slice(0,4)` legge "2026" anche da una data
   che non esiste), e il suo volume (999.999 m³ nel caso del deep-pass)
   finiva sommato nel valore del materiale — mentre la Denuncia, due click
   più in là nella stessa pagina, restava corretta: "Estratto 2026: 79.400 m³
   → 150.860 t → € 1.810.320" diventava "1.079.399 m³ → 2.050.858 t →
   € 24.610.297", non uno zero tranquillo ma l'opposto — un numero enorme e
   sbagliato presentato come certo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8953;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const CASO = [
  '{ id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2", fronteId: "f1" },',
  '{ id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2", fronteId: "f1" },\n    { id: "rX", titolo: "TEST calendario impossibile", data: "2026-13-45", tipo: "Ortofoto + DEM", volumeM3: 999999, stato: "elaborato", fronteId: "f1" },',
];
/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO = [
  `    const dellAnno = (RIL || []).filter(r => rilievoUsabileConData(r) && (r.data||"").slice(0,4) === anno);`,
  `    const dellAnno = (RIL || []).filter(r => rilievoUsabile(r) && (r.data||"").slice(0,4) === anno);`,
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
  if (CONTROPROVA && p.endsWith("apps/terra/index.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
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
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCaso === 1, "il caso (rilievo a calendario impossibile) è stato iniettato nella risposta HTTP", iniezioniCaso);
if (CONTROPROVA) dice(iniezioniDifetto === 1, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.evaluate(() => { if (window.go) window.go("ril"); });
await pg.waitForTimeout(1000);
const valore = await pg.evaluate(() => document.getElementById("val-out")?.innerText || "");

dice(/79\.400/.test(valore), "il volume dell'anno resta 79.400 m³, non gonfiato dal rilievo iniettato", valore);
dice(!/1\.079\.399|999\.999/.test(valore), "e non compare il volume impossibile", valore);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* IL SEMAFORO DI SINTESI LETTO PRIMA DI ESPORTARE (G53, 19/09) — UN
   AVVISO PASSIVO, MAI UN BLOCCO.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-semaforo-export.mjs [--porta=8767]
     node genesi-semaforo-export.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal delta verificato di docs/RICERCA_CONTINUA_GENESI.md:
   il semaforo di sintesi (G45, 14/09: 🔴/🟡/🟢 sopra la scheda validatori)
   non era mai letto da nessuno dei quattro bottoni che portano il piano
   fuori dall'app — un piano con indicatori gravemente fuori fascia si
   esportava in silenzio, identico a uno sano. Un MODALE di conferma è
   stato scritto, provato e SCARTATO lo stesso giorno (verbale nella
   ricerca): blocca il click sincrono su cui sei banchi di test già fanno
   affidamento. La soluzione qui è additiva: la frase si aggiunge in coda
   allo STESSO toast di successo, senza bloccare niente — questo banco
   inietta `D2._sintesi` (il canale che renderScheda2D scrive) per
   isolare la lettura dal calcolo dei validatori, già provato altrove. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8767;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: `fraseGraviExport` smette di controllare
   `s.gravi>0` — un piano SANO (zero indicatori gravi) riceverebbe lo
   stesso l'avviso di ogni piano, e l'avviso smetterebbe di significare
   qualcosa (l'allarme che scatta sempre, CLAUDE.md). */
const DIFETTI = [
  [`return (s && s.gravi>0) ? ' — ⚠️ '`,
   `return (s) ? ' — ⚠️ '`],
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
const SEGNO = join(R, "__genesi-semaforo-export-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-semaforo-export-${process.pid}`)).text();
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

async function apriDesign() {
  const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="design"]');
  await pg.waitForTimeout(600);
  return pg;
}
async function iniettaSintesi(pg, sintesi) {
  await pg.evaluate((s) => { window.__genesi.D2._sintesi = s; }, sintesi);
}
async function toastDopo(pg, idBottone) {
  await pg.evaluate(() => { const t = document.getElementById("toast"); if (t) t.textContent = ""; });
  await pg.click("#" + idBottone);
  await pg.waitForTimeout(400);
  return pg.evaluate(() => document.getElementById("toast")?.textContent.trim() || "");
}

console.log(`\n════════ Genesi: il semaforo di sintesi letto prima di esportare (G53)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

/* CASO 1: piano SANO (zero indicatori gravi) — il toast resta quello di
   sempre, nessun avviso aggiunto. */
await iniettaSintesi(pg, { n: 22, fuori: 0, gravi: 0 });
const sano = await toastDopo(pg, "btn-scheda-csv");
dice(/esportata/i.test(sano) && !/fuori fascia grave/.test(sano),
  "piano sano (0 indicatori gravi): nessun avviso aggiunto al toast di sempre", sano);

/* IL CASO CHE CONTA: piano con indicatori gravi — l'avviso compare IN
   CODA alla stessa frase di successo (mai un secondo toast che la
   sovrascrive: il numero dei parametri esportati resta leggibile). */
await iniettaSintesi(pg, { n: 22, fuori: 12, gravi: 4 });
const grave = await toastDopo(pg, "btn-scheda-csv");
dice(/esportata/i.test(grave), "⛔ il toast di successo resta leggibile (non sovrascritto da un secondo toast)", grave);
dice(/4 indicatori fuori fascia grave/.test(grave), "e l'avviso nomina il numero vero di indicatori gravi", grave);

/* Lo stesso canale funziona sugli ALTRI TRE bottoni di export, non solo
   sulla scheda CSV — la lettura è unica, non ricopiata quattro volte. */
const dxf = await toastDopo(pg, "btn-piano-dxf");
dice(/4 indicatori fuori fascia grave/.test(dxf), "anche l'export DXF legge lo stesso canale", dxf);
const carico = await toastDopo(pg, "btn-piano-csv");
dice(/4 indicatori fuori fascia grave/.test(carico), "anche il piano di carico CSV", carico);
const innesco = await toastDopo(pg, "btn-innesco-xml");
dice(/4 indicatori fuori fascia grave/.test(innesco), "anche il piano di innesco XML", innesco);

/* Se la scheda non è mai stata renderizzata (D2._sintesi assente), non si
   inventa una severità: si tace — il principio del fondatore applicato
   all'assenza di un dato, non solo alla sua presenza a zero. */
await pg.evaluate(() => { delete window.__genesi.D2._sintesi; });
const senzaSintesi = await toastDopo(pg, "btn-scheda-csv");
dice(/esportata/i.test(senzaSintesi) && !/fuori fascia/.test(senzaSintesi),
  "senza D2._sintesi (scheda mai renderizzata) il toast resta quello di sempre, senza inventare severità", senzaSintesi);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

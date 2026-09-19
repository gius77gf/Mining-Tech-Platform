/* L'IMPORT DXF IN SOLA LETTURA (G47d, 14/09) — L'ULTIMA FETTA DI "GENESI
   SIMILE A UN CAD" (G47, il fondatore ha risposto "tutto").
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-dxf-import.mjs [--porta=8763]
     node genesi-dxf-import.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE, E PERCHÉ È FATTA COSÌ. La ricerca del 13/09
   (docs/RICERCA_CONTINUA_GENESI.md) ha cercato come i software commerciali
   di blast design evitano l'errore di convenzione degli assi quando
   importano un file esterno — e non ne ha trovato uno che validi
   ESPLICITAMENTE la convenzione prima di fidarsi della geometria per un
   calcolo di burden/sicurezza (solo difese indirette: associazione al
   foro più vicino, tolleranze). La scelta qui non è costruire quella
   validazione (un progetto a sé, rischioso da fare a metà): è TOGLIERE il
   rischio alla radice. Un file DXF importato diventa SOLO `D2.tratti` — la
   stessa entità 2D senza semantica di prodotto introdotta da G47c-2 — MAI
   fori, fronte o piede. Un tratto non entra in NESSUN calcolo (relief,
   energia, burden, flyrock): un orientamento sbagliato si VEDE (il
   tratteggio dei tratti importati, l'avviso esplicito) e si annulla con
   Ctrl+Z, non produce mai un numero sbagliato.

   COSA GUARDA: che un file con LINE + POLYLINE + entità di fori (CIRCLE/
   TEXT, come il nostro stesso export G33) porti dentro SOLO i tratti, mai
   i cerchi dei fori; che un'importazione di più entità sia UN'unica
   operazione annullabile (Ctrl+Z toglie tutto l'import in un colpo solo,
   non un tratto alla volta — chi importa un file sbagliato non deve
   premere annulla N volte); e che l'avviso sulla convenzione degli assi
   compaia davvero, non solo nel testo del bottone. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8763;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: l'import smette di essere UN'unica operazione
   annullabile — ogni tratto importato pusha la propria voce in cronologia
   invece di condividerne una sola. Silenzioso: l'import funziona uguale,
   solo che annullarlo richiede un Ctrl+Z per tratto invece di uno solo —
   fastidioso per chi importa un file con decine di entità e sbaglia
   l'orientamento. */
const DIFETTI = [
  [`d2PushUndo();\n  tratti.forEach(t=> D2.tratti.push({ pts:t.pts, aperto:false, origine:'dxf' }));`,
   `tratti.forEach(t=>{ d2PushUndo(); D2.tratti.push({ pts:t.pts, aperto:false, origine:'dxf' }); });`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-dxf-import-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-dxf-import-${process.pid}`)).text();
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

/* un DXF con GEOMETRIA DI FORI (CIRCLE/TEXT, come il nostro export G33) più
   una LINE e una POLYLINE: se l'import prendesse tutte le entità invece di
   filtrare, i fori finirebbero fra i tratti. */
const DXF_PROVA = [
  "0", "SECTION", "2", "ENTITIES",
  "0", "CIRCLE", "8", "FORI", "10", "0.0", "20", "3.0", "30", "0.0", "40", "0.05",
  "0", "TEXT", "8", "FORI", "10", "0.1", "20", "3.0", "30", "0.0", "40", "0.04", "1", "1",
  "0", "LINE", "8", "IMPORT", "10", "2.0", "20", "10.0", "30", "0.0", "11", "30.0", "21", "10.0", "30", "0.0",
  "0", "POLYLINE", "8", "IMPORT", "66", "1", "70", "0",
  "0", "VERTEX", "8", "IMPORT", "10", "5.0", "20", "6.0", "30", "0.0",
  "0", "VERTEX", "8", "IMPORT", "10", "15.0", "20", "4.0", "30", "0.0",
  "0", "VERTEX", "8", "IMPORT", "10", "25.0", "20", "7.0", "30", "0.0",
  "0", "SEQEND",
  "0", "ENDSEC", "0", "EOF",
].join("\n");

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

console.log(`\n════════ Genesi: l'import DXF come tratti (G47d)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const nForiPrima = await pg.evaluate(() => window.__genesi.D2.holes.length);
const nTrattiPrima = await pg.evaluate(() => window.__genesi.D2.tratti.length);

const percorso = join(R, "__genesi-dxf-import-prova-" + process.pid + ".dxf");
writeFileSync(percorso, DXF_PROVA);
try {
  await pg.setInputFiles("#dxfImportFile", percorso);
  await pg.waitForTimeout(400);

  const nForiDopo = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(nForiDopo === nForiPrima, `⛔ il CIRCLE/TEXT del foro NON diventa un foro (fori: ${nForiPrima} -> ${nForiDopo})`, nForiDopo);

  const tratti = await pg.evaluate(() => window.__genesi.D2.tratti);
  dice(tratti.length === nTrattiPrima + 2, `LINE + POLYLINE diventano DUE tratti (${nTrattiPrima} -> ${tratti.length})`, tratti.length);
  const importati = tratti.slice(-2);
  dice(importati.every((t) => t.origine === "dxf"), "i tratti importati portano origine:'dxf' (per il tratteggio in disegno)", importati.map((t) => t.origine));
  dice(importati[0].pts.length === 2 && importati[1].pts.length === 3,
    `i punti sono quelli veri del file (LINE: 2 punti, POLYLINE: 3 punti — letti: ${importati[0]?.pts.length}, ${importati[1]?.pts.length})`,
    importati);

  const avviso = await pg.evaluate(() => document.getElementById("d2-dxf-import-esito").innerText);
  dice(/orientamento/i.test(avviso), "l'avviso sulla convenzione di assi compare davvero (non solo nel titolo del bottone)", avviso.slice(0, 60));

  /* IL CASO CHE CONTA: un solo Ctrl+Z toglie TUTTO l'import (due tratti),
     non un tratto alla volta. */
  await pg.keyboard.press("Control+z");
  await pg.waitForTimeout(200);
  const dopoUnCtrlZ = await pg.evaluate(() => window.__genesi.D2.tratti.length);
  dice(dopoUnCtrlZ === nTrattiPrima, `⛔ UN Ctrl+Z toglie l'intero import, non un tratto alla volta (atteso ${nTrattiPrima}, letto ${dopoUnCtrlZ})`, dopoUnCtrlZ);
} finally { try { unlinkSync(percorso); } catch (e) {} }

/* un file senza niente di leggibile non deve aggiungere niente, e deve dirlo */
{
  const percorsoVuoto = join(R, "__genesi-dxf-import-vuoto-" + process.pid + ".dxf");
  writeFileSync(percorsoVuoto, "questo non è un DXF");
  try {
    const n0 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    await pg.setInputFiles("#dxfImportFile", percorsoVuoto);
    await pg.waitForTimeout(400);
    const n1 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    dice(n1 === n0, `un file senza LINE/POLYLINE leggibili non aggiunge tratti (${n0} -> ${n1})`, n1);
  } finally { try { unlinkSync(percorsoVuoto); } catch (e) {} }
}

/* ⛔ 19/09, dal quarto giro di deep-pass QA: LWPOLYLINE (l'entità polilinea
   di DEFAULT di AutoCAD dal R14/1997, LibreCAD e QCAD) non era riconosciuta
   — un file con SOLA LWPOLYLINE dava "il file non contiene LINE o POLYLINE
   leggibili", falso: la geometria c'era, solo in un formato non letto. */
{
  const DXF_LW = ["0", "SECTION", "2", "ENTITIES",
    "0", "LWPOLYLINE", "8", "IMPORT", "90", "3", "70", "0",
    "10", "5.0", "20", "6.0", "10", "15.0", "20", "4.0", "10", "25.0", "20", "7.0",
    "0", "ENDSEC", "0", "EOF"].join("\n");
  const percorsoLw = join(R, "__genesi-dxf-import-lw-" + process.pid + ".dxf");
  writeFileSync(percorsoLw, DXF_LW);
  try {
    const n0 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    await pg.setInputFiles("#dxfImportFile", percorsoLw);
    await pg.waitForTimeout(400);
    const tratti = await pg.evaluate(() => window.__genesi.D2.tratti);
    dice(tratti.length === n0 + 1, `una LWPOLYLINE isolata diventa un tratto (${n0} -> ${tratti.length})`, tratti.length);
    dice(tratti[n0] && tratti[n0].pts.length === 3, "i suoi tre vertici, letti dalla stessa entità", tratti[n0]);
    const avvisoLw = await pg.evaluate(() => document.getElementById("d2-dxf-import-esito").innerText);
    dice(!/non contiene/.test(avvisoLw), "⛔ NON compare l'avviso «il file non contiene LINE o POLYLINE leggibili»: la geometria è stata trovata", avvisoLw.slice(0, 80));
  } finally { try { unlinkSync(percorsoLw); } catch (e) {} }
}

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

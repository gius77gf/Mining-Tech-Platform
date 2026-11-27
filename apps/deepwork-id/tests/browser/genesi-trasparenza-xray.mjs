/* IL CURSORE DI TRASPARENZA DEL FRONTE IN VISTA RAGGI-X (`#xrOp`,
   genesi.html ~2922-2924) — copertura nuova, NESSUN difetto storico
   noto da riprodurre (stessa scelta dichiarata di
   `genesi-timeline-play-scrub.mjs`: un banco di comportamento non ha
   bisogno di un difetto finto). Zero copertura prima (`grep -rl
   'xrOp' apps/deepwork-id/tests/browser/*.mjs` → nessun risultato).

   Il cursore ha un comportamento particolare da verificare dal vivo:
   muoverlo attiva DA SOLO il layer "Raggi-X progetto" se non era già
   attivo (`if(!layers.lXray){ layers.lXray=true; ... }`, commento
   "il cursore mostra i fori da solo", fondatore 25/07) — a differenza
   della checkbox `lXray`, che l'utente deve spuntare esplicitamente.
   Misurato dal vivo prima di scrivere le asserzioni: `xrayOp` e
   l'opacità reale del materiale (`ghostWall.material.opacity`)
   seguono il cursore proporzionalmente (min 4% → 0,04, max 85% →
   0,85), e riattivano il layer anche quando era stato spento con la
   checkbox subito prima.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-trasparenza-xray.mjs [--porta=8772] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8772;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(readFileSync(p));
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-xray-op-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-xray-op-${process.pid}`)).text();
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
const vicino = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;

async function apriSim() {
  const pg = await b.newPage({ viewport: { width: 1200, height: 800 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="sim"]');
  await pg.waitForTimeout(300);
  return pg;
}
const muoviCursore = async (pg, valore) => {
  await pg.evaluate((v) => {
    const el = document.getElementById("xrOp");
    el.value = String(v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }, valore);
  await pg.waitForTimeout(150);
};
const stato = (pg) => pg.evaluate(() => ({
  xrayOp: window.__genesi.xrayOp,
  lXrayChecked: document.getElementById("lXray").checked,
  ghostOp: window.__genesi.ghostOpacity,
}));

console.log(`\n════════ Genesi: il cursore di trasparenza del fronte in vista Raggi-X ════════`);

const pg = await apriSim();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const s0 = await stato(pg);
dice(!s0.lXrayChecked && vicino(s0.xrayOp, 0.32),
  `all'apertura i raggi-X sono spenti e il cursore è al suo valore di default (letto ${JSON.stringify(s0)})`, s0);

// --- muovere il cursore ACCENDE da solo il layer Raggi-X ---
await muoviCursore(pg, 70);
const s1 = await stato(pg);
dice(s1.lXrayChecked && vicino(s1.xrayOp, 0.7) && vicino(s1.ghostOp, 0.7),
  `muovere il cursore a 70 accende da solo "Raggi-X progetto" e applica 0,70 (letto ${JSON.stringify(s1)})`, s1);

// --- i due estremi del cursore (min 4%, max 85%) ---
await muoviCursore(pg, 4);
const sMin = await stato(pg);
dice(vicino(sMin.xrayOp, 0.04) && vicino(sMin.ghostOp, 0.04),
  `al minimo del cursore (4%) l'opacità reale è 0,04 (letto ${JSON.stringify(sMin)})`, sMin);

await muoviCursore(pg, 85);
const sMax = await stato(pg);
dice(vicino(sMax.xrayOp, 0.85) && vicino(sMax.ghostOp, 0.85),
  `al massimo del cursore (85%) l'opacità reale è 0,85 (letto ${JSON.stringify(sMax)})`, sMax);

// --- spegnere la checkbox e poi muovere il cursore lo RIACCENDE ---
await pg.click("#lXray");
await pg.waitForTimeout(150);
const sSpento = await stato(pg);
dice(!sSpento.lXrayChecked, `la checkbox spegne i raggi-X (letto ${sSpento.lXrayChecked})`, sSpento);

await muoviCursore(pg, 50);
const sRiacceso = await stato(pg);
dice(sRiacceso.lXrayChecked && vicino(sRiacceso.xrayOp, 0.5) && vicino(sRiacceso.ghostOp, 0.5),
  `muovere il cursore dopo aver spento la checkbox la riaccende (letto ${JSON.stringify(sRiacceso)})`, sRiacceso);

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

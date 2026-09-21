/* I QUATTRO BOTTONI CAMERA DELLA SCENA 3D (`[data-cam]`/`applyCamera`,
   genesi.html ~2830-2848) — copertura nuova, zero banchi la toccavano
   prima (né `genesi-struttura.mjs` la censisce nel DOM). Trovato un
   difetto REALE misurando dal vivo, non dedotto dal codice: la camera
   "Da terra 50 m" (`CAMS[0]`) chiede `pos.y=1.7` con un bersaglio a
   `SIM.H*0.45` più in alto — un angolo polare che supera
   `ctrl.maxPolarAngle = Math.PI/2 - 0.02` (genesi.html:1623, la
   barriera anti-sottoterra del trascinamento libero). `ctrl.update()`,
   chiamato da `applyCamera` su OGNI bottone senza distinguere un preset
   da un trascinamento, corregge silenziosamente la posizione alla
   stessa distanza dal bersaglio ma all'angolo massimo consentito:
   **y=5,5015, non 1,7**. Le altre tre camere (drone/laterale/libera)
   NON toccano quel limite e arrivano ESATTE alla loro formula —
   misurato, non assunto. È `docs/DECISIONI_WEEKEND.md` **decisione 31**
   (21/09): tre strade diverse per correggerlo, nessuna ovvia, quindi
   non si sceglie qui. Questo banco blinda il comportamento **come si
   presenta oggi**, comprese le coordinate clampate di "Da terra": se
   una delle tre strade della decisione 31 verrà scelta, è la SOLA
   asserzione `dice("Da terra"...)` a dover cambiare, per nome — non un
   banco più largo.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-camere-3d.mjs [--porta=8767] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8767;
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
const SEGNO = join(R, "__genesi-camere-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-camere-${process.pid}`)).text();
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
const vicino = (a, b, tol = 1e-4) => Math.abs(a - b) < tol;
const vettVicino = (a, b, tol = 1e-4) => a.length === b.length && a.every((v, i) => vicino(v, b[i], tol));

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
const stato = (pg) => pg.evaluate(() => ({
  camIdx: window.__genesi.camIdx, pos: window.__genesi.camPos, tgt: window.__genesi.camTarget,
}));

console.log(`\n════════ Genesi: i quattro bottoni camera della scena 3D ════════`);

const pg = await apriSim();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const s0 = await stato(pg);
dice(s0.camIdx === 0, `all'apertura la camera attiva è la prima, "Da terra" (letto camIdx=${s0.camIdx})`, s0);
const onIniziale = await pg.evaluate(() => document.querySelector('[data-cam="0"]').classList.contains("on"));
dice(onIniziale, `il bottone "Da terra" parte segnato come attivo (letto ${onIniziale})`, onIniziale);

// --- "Drone": arriva ESATTA alla sua formula (nessun vincolo la tocca) ---
await pg.click('[data-cam="1"]');
await pg.waitForTimeout(150);
const sDrone = await stato(pg);
dice(sDrone.camIdx === 1 && vettVicino(sDrone.pos, [31, 55, -52]) && vettVicino(sDrone.tgt, [21, 0, -6]),
  `"Drone" arriva esattamente ai numeri della sua formula (letto pos=${JSON.stringify(sDrone.pos)}, tgt=${JSON.stringify(sDrone.tgt)})`, sDrone);

// --- "Laterale": stessa cosa ---
await pg.click('[data-cam="2"]');
await pg.waitForTimeout(150);
const sLato = await stato(pg);
dice(sLato.camIdx === 2 && vettVicino(sLato.pos, [-34, 9, -16]) && vettVicino(sLato.tgt, [14.7, 3.5, 0]),
  `"Laterale" arriva esattamente ai numeri della sua formula (letto pos=${JSON.stringify(sLato.pos)}, tgt=${JSON.stringify(sLato.tgt)})`, sLato);

// --- "Libera": nessuna formula, la posizione resta quella di prima ---
await pg.click('[data-cam="3"]');
await pg.waitForTimeout(150);
const sLibera = await stato(pg);
dice(sLibera.camIdx === 3 && vettVicino(sLibera.pos, sLato.pos) && vettVicino(sLibera.tgt, sLato.tgt),
  `"Libera" non muove la camera: resta dov'era (letto pos=${JSON.stringify(sLibera.pos)}, invariata rispetto a "Laterale")`, sLibera);
const onLibera = await pg.evaluate(() => document.querySelector('[data-cam="3"]').classList.contains("on"));
const onLato = await pg.evaluate(() => document.querySelector('[data-cam="2"]').classList.contains("on"));
dice(onLibera && !onLato, `il segno "attivo" passa a "Libera" e lascia "Laterale" (letto libera=${onLibera}, laterale=${onLato})`);

// --- "Da terra 50 m": ⛔ decisione 31 — NON arriva a y=1,7, ci arriva solo
// fino al limite della barriera anti-sottoterra. Questa asserzione blinda
// il comportamento MISURATO, non quello che la formula promette. ---
await pg.click('[data-cam="0"]');
await pg.waitForTimeout(150);
const sTerra = await stato(pg);
dice(sTerra.camIdx === 0, `"Da terra" torna la camera attiva (letto camIdx=${sTerra.camIdx})`, sTerra);
dice(!vicino(sTerra.pos[1], 1.7, 0.5),
  `⛔ decisione 31: "Da terra" NON raggiunge y=1,7 come dice la formula (letto y=${sTerra.pos[1]})`, sTerra.pos);
dice(vettVicino(sTerra.pos, [21, 5.501500002829031, -50.068323296714595], 1e-6),
  `⛔ decisione 31: la barriera la ferma esattamente a y≈5,5015, z≈-50,0683 — stessa distanza dal bersaglio (50,078 m), angolo massimo consentito (letto pos=${JSON.stringify(sTerra.pos)})`, sTerra.pos);
dice(vettVicino(sTerra.tgt, [21, 4.5, 0]),
  `il bersaglio invece È quello della formula, solo la posizione è vincolata (letto tgt=${JSON.stringify(sTerra.tgt)})`, sTerra.tgt);

// --- tasti 1-4 fanno la stessa cosa dei bottoni ---
await pg.keyboard.press("2");
await pg.waitForTimeout(150);
const sTasto2 = await stato(pg);
dice(sTasto2.camIdx === 1 && vettVicino(sTasto2.pos, [31, 55, -52]),
  `il tasto "2" fa la stessa cosa del bottone "Drone" (letto camIdx=${sTasto2.camIdx}, pos=${JSON.stringify(sTasto2.pos)})`, sTasto2);

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

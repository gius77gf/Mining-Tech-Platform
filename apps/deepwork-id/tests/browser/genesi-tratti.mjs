/* I TRATTI LIBERI DELL'EDITOR 2D (G47c-2, 14/09) — LA PRIMITIVA DI DISEGNO
   LIBERO VERA, DENTRO "GENESI SIMILE A UN CAD" (G47, il fondatore ha
   risposto "tutto").
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-tratti.mjs [--porta=8761]
     node genesi-tratti.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Genesi piazzava solo TRE tipi di punto fissi (foro,
   fronte, piede), ognuno con la sua semantica di prodotto — un foro ha
   carica e ritardo, un punto di fronte modella la faccia. Mancava
   un'entità libera, senza semantica di prodotto, per annotare la pianta:
   l'esempio che serve a chi lavora in cava è segnare una faglia, una
   pista di transito, un confine di concessione — cose che non sono un
   foro né un profilo di volata, ma vanno viste sulla stessa pianta.

   COME FUNZIONA, e perché il banco guarda proprio questo: un clic aggiunge
   un punto al tratto in costruzione (`D2.tratti[...].aperto===true`); un
   secondo clic dopo aver premuto "Fine tratto" ne apre uno NUOVO invece di
   allungare quello appena chiuso — è il caso che un banco superficiale
   salterebbe (un solo tratto che cresce all'infinito supererebbe comunque
   qualunque prova che conti "il numero di punti sale"). L'annulla/
   ripristina di G47c-1 copre anche i tratti dal primo giorno (non
   recuperato dopo): un Ctrl+Z durante il disegno toglie l'ultimo punto
   aggiunto, non l'intero tratto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8761;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: un clic dopo "Fine tratto" torna ad allungare
   il tratto appena chiuso invece di aprirne uno nuovo — silenzioso, il
   punto si vede comunque sulla tela, solo che finisce nel tratto
   sbagliato. È esattamente il caso per cui la guardia `ultimo.aperto`
   esiste: sostituendo la condizione con `true` si rompe SOLO quella
   guardia. */
const DIFETTI = [
  [`const ultimo=D2.tratti[D2.tratti.length-1];\n    if(ultimo && ultimo.aperto) ultimo.pts.push`,
   `const ultimo=D2.tratti[D2.tratti.length-1];\n    if(ultimo && true) ultimo.pts.push`],
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
const SEGNO = join(R, "__genesi-tratti-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-tratti-${process.pid}`)).text();
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
  await pg.click("#dtTratto");
  await pg.waitForTimeout(200);
  return pg;
}
async function clicCanvas(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  await pg.locator("#d2-canvas").click({ position: { x: rel.x * box.width, y: rel.y * box.height } });
  await pg.waitForTimeout(150);
}

console.log(`\n════════ Genesi: i tratti liberi dell'editor 2D (G47c-2)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => window.__genesi.D2.tool)) === "tratto", "lo strumento Tratto si attiva");
dice(await pg.evaluate(() => document.getElementById("dtTrattoFine").hidden), "«Fine tratto» resta nascosto finché non ci sono almeno due punti");

await clicCanvas(pg, 5, 8);
await clicCanvas(pg, 15, 6);
await clicCanvas(pg, 25, 9);
const t0 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t0.length === 1 && t0[0].pts.length === 3 && t0[0].aperto === true,
  `tre clic costruiscono UN tratto aperto con tre punti (letto: ${t0.length} tratti, ${t0[0]?.pts.length} punti, aperto=${t0[0]?.aperto})`, t0);
dice(!(await pg.evaluate(() => document.getElementById("dtTrattoFine").hidden)),
  "«Fine tratto» compare dopo almeno due punti");

await pg.click("#dtTrattoFine");
await pg.waitForTimeout(200);
const t1 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t1.length === 1 && t1[0].aperto === false && t1[0].pts.length === 3,
  "«Fine tratto» chiude il tratto senza aggiungere un punto", t1);

/* IL CASO CHE CONTA: un clic dopo la chiusura apre un tratto NUOVO, non
   allunga quello appena chiuso. È qui che cade la controprova. */
await clicCanvas(pg, 30, 5);
const t2 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t2.length === 2 && t2[0].pts.length === 3 && t2[1].pts.length === 1,
  `⛔ un clic dopo "Fine tratto" apre un SECONDO tratto, non allunga il primo (letto: ${t2.length} tratti, primo ${t2[0]?.pts.length} punti, secondo ${t2[1]?.pts.length} punti)`,
  t2);

/* annulla/ripristina copre anche i tratti (estensione di G47c-1) */
await pg.keyboard.press("Control+z");
await pg.waitForTimeout(150);
const nDopoUndo = await pg.evaluate(() => window.__genesi.D2.tratti.length);
dice(nDopoUndo === 1, `Ctrl+Z toglie il tratto appena aperto dal secondo clic (atteso 1, letto ${nDopoUndo})`, nDopoUndo);

await pg.click("#dtReset");
await pg.waitForTimeout(200);
const nDopoReset = await pg.evaluate(() => window.__genesi.D2.tratti.length);
dice(nDopoReset === 0, `"Reset tratti" svuota D2.tratti (atteso 0, letto ${nDopoReset})`, nDopoReset);
await pg.click("#d2Undo");
await pg.waitForTimeout(200);
const nDopoUndoReset = await pg.evaluate(() => window.__genesi.D2.tratti.length);
dice(nDopoUndoReset === 1, `annulla restituisce il tratto tolto dal reset (atteso 1, letto ${nDopoUndoReset})`, nDopoUndoReset);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

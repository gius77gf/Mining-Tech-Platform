/* RUOTA/SCALA TRATTI NASCOSTI MENTRE SI STA ANCORA DISEGNANDO (G57/G58,
   regressione trovata e corretta il 19/09 — questo banco non esisteva
   ancora, e la correzione era verificata solo a mano e con un'asserzione
   statica sul testo di `syncTrattoUI` in run-kpi.mjs).
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-ruota-scala-tratti.mjs [--porta=8762]
     node genesi-ruota-scala-tratti.mjs --controprova   (rimette il difetto: DEVE fallire)

   IL DIFETTO. `mostraRuota` decideva se mostrare "↻ Ruota tratti"/
   "⤢ Scala tratti" guardando solo `D2.tratti.length>0`, non se il tratto
   in cima all'elenco fosse ANCORA in costruzione (`inCorso`). Appena si
   piazzava il PRIMO punto di un tratto nuovo — con almeno un tratto già
   chiuso in precedenza — i due bottoni comparivano, la barra `#d2-tools`
   cresceva di ~40px e spingeva la tela sotto la barra di navigazione
   fissa: il secondo clic, quello che dovrebbe aggiungere il secondo punto
   e far comparire "Fine tratto", cadeva sull'icona della barra di
   navigazione invece che sulla tela — il tratto restava bloccato a un
   punto solo per sempre, in silenzio (nessun errore, nessuna prova
   rossa). La cura: `!inCorso` nella condizione, così i bottoni compaiono
   solo a disegno FERMO. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8762;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: la condizione originale, senza `!inCorso`. */
const DIFETTI = [
  [`const mostraRuota = D2.tool==='tratto' && D2.tratti.length>0 && !inCorso;`,
   `const mostraRuota = D2.tool==='tratto' && D2.tratti.length>0;`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-ruota-scala-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-ruota-scala-${process.pid}`)).text();
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
  /* viewport stretto: è dove il metro (~40px di barra in più) basta a
     spingere la tela sotto la barra di navigazione fissa — misurato il
     19/09 su questa stessa larghezza. */
  const pg = await b.newPage({ viewport: { width: 390, height: 780 } });
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
const nascosti = async (pg) => pg.evaluate(() => ({
  ruota: document.getElementById("dtRuotaTratti").hidden,
  scala: document.getElementById("dtScalaTratti").hidden,
}));

console.log(`\n════════ Genesi: Ruota/Scala tratti nascosti mentre si disegna (G57/G58)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

// primo tratto: due punti, poi "Fine tratto" lo chiude
await clicCanvas(pg, 5, 8);
await clicCanvas(pg, 15, 6);
await pg.click("#dtTrattoFine");
await pg.waitForTimeout(200);
const t1 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t1.length === 1 && t1[0].aperto === false, "il primo tratto è chiuso (un tratto, non più in costruzione)", t1);

const conTrattoFermo = await nascosti(pg);
dice(!conTrattoFermo.ruota && !conTrattoFermo.scala,
  `a disegno fermo, con almeno un tratto chiuso, Ruota/Scala SONO visibili (letto: ${JSON.stringify(conTrattoFermo)})`, conTrattoFermo);

// secondo tratto: UN solo clic — il punto esatto in cui il difetto viveva
await clicCanvas(pg, 25, 9);
await pg.waitForTimeout(150);
const t2 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t2.length === 2 && t2[1].aperto === true && t2[1].pts.length === 1,
  `il clic apre un SECONDO tratto con un punto solo, ancora in costruzione (letto: ${t2.length} tratti, secondo aperto=${t2[1]?.aperto}, ${t2[1]?.pts.length} punti)`, t2);

const conTrattoInCorso = await nascosti(pg);
dice(conTrattoInCorso.ruota && conTrattoInCorso.scala,
  `⛔ MENTRE si piazza il primo punto di un tratto nuovo, Ruota/Scala restano nascosti — non devono ricrescere la barra (letto: ${JSON.stringify(conTrattoInCorso)})`, conTrattoInCorso);

// chiudendo anche il secondo tratto, i bottoni devono ricomparire
await clicCanvas(pg, 30, 5);
await pg.click("#dtTrattoFine");
await pg.waitForTimeout(200);
const dopoChiusura = await nascosti(pg);
dice(!dopoChiusura.ruota && !dopoChiusura.scala,
  `chiuso anche il secondo tratto, Ruota/Scala ricompaiono (letto: ${JSON.stringify(dopoChiusura)})`, dopoChiusura);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

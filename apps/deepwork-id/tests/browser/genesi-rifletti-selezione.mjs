/* RIFLETTI LA SELEZIONE — PRIMA TRASFORMAZIONE (G50, 19/09) — SPECCHIA I
   FORI SCELTI ATTORNO AL LORO CENTROIDE, NESSUN PIVOT DA CHIEDERE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-rifletti-selezione.mjs [--porta=8764]
     node genesi-rifletti-selezione.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La parte pura (`foriRiflessi`) è provata in run-kpi.mjs;
   questo banco prova il GESTO nel canvas vero: selezionare due fori con
   Maiusc+clic (G49), premere "Rifletti selezionati", e vedere le loro
   posizioni scambiarsi attorno al centro — senza toccare i fori non
   scelti né la spalla (`my`) di quelli specchiati. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8764;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il bottone chiama `foriSenzaId` invece di
   `foriRiflessi` — un errore di ricopiatura fra le due azioni batch che
   condividono lo stesso schema (guardia sul lucchetto, `d2PushUndo`,
   `n` fori coinvolti), scritto apposta perché è il tipo di svista più
   facile fra due funzioni gemelle. Effetto: "Rifletti selezionati"
   ELIMINA i fori invece di specchiarli. */
const DIFETTI = [
  [`d2PushUndo();
  D2.holes=foriRiflessi(D2.holes, D2.selMulti);
  computeSeq2D();`,
   `d2PushUndo();
  D2.holes=foriSenzaId(D2.holes, D2.selMulti);
  computeSeq2D();`],
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
const SEGNO = join(R, "__genesi-rifletti-selezione-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-rifletti-selezione-${process.pid}`)).text();
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
  /* ⛔ stessa causa già presa in genesi-selezione-multipla.mjs: il canvas
     nasce fuori dal viewport, e il mouse "vero" (sotto, per aggirare
     l'intercettazione di `#d2-scheda`) non scorre niente da solo. */
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(150);
  return pg;
}
async function puntoVero(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}
async function clicSu(pg, mx, my, { shift = false } = {}) {
  const p = await puntoVero(pg, mx, my);
  if (shift) await pg.keyboard.down("Shift");
  await pg.mouse.move(p.x, p.y);
  await pg.mouse.down(); await pg.mouse.up();
  if (shift) await pg.keyboard.up("Shift");
  await pg.waitForTimeout(150);
}
async function foro(pg, i) {
  return pg.evaluate((i) => { const h = window.__genesi.D2.holes[i]; return { id: h.id, mx: h.mx, my: h.my }; }, i);
}

console.log(`\n════════ Genesi: rifletti la selezione dei fori (G50)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const f1 = await foro(pg, 0), f2 = await foro(pg, 1), f3 = await foro(pg, 2);
dice(f1.mx !== f2.mx, "i primi due fori della maglia hanno posizioni diverse (altrimenti il banco non prova niente)", [f1, f2]);

/* IL CASO CHE CONTA: seleziona f1 e f2, rifletti, verifica che si siano
   scambiati intorno al loro centro — e che f3 (non scelto) non si muova. */
await clicSu(pg, f1.mx, f1.my, { shift: true });
await clicSu(pg, f2.mx, f2.my, { shift: true });
const bottoneVisibile = await pg.evaluate(() => !document.getElementById("dtRifletti").hidden);
dice(bottoneVisibile, "«Rifletti selezionati» compare con due fori scelti");
if (bottoneVisibile) await pg.click("#dtRifletti");
await pg.waitForTimeout(200);

const centro = (f1.mx + f2.mx) / 2;
const attesoF1 = +(2 * centro - f1.mx).toFixed(2);
const attesoF2 = +(2 * centro - f2.mx).toFixed(2);
const dopo = await pg.evaluate(() => window.__genesi.D2.holes);
const g1 = dopo.find((h) => h.id === f1.id), g2 = dopo.find((h) => h.id === f2.id), g3 = dopo.find((h) => h.id === f3.id);

dice(bottoneVisibile && g1 && g1.mx === attesoF1 && g2 && g2.mx === attesoF2,
  `⛔ i due fori si specchiano attorno al loro centro (atteso f1→${attesoF1}, f2→${attesoF2}; letto f1=${g1?.mx}, f2=${g2?.mx})`,
  { g1, g2 });
dice(g1 && g1.my === f1.my && g2 && g2.my === f2.my, "la spalla (my) non si tocca mai dal mirror", { g1, g2 });
dice(g3 && g3.mx === f3.mx && g3.my === f3.my, "un foro non selezionato resta esattamente dov'era", { f3, g3 });
dice(dopo.length === (await pg.evaluate(() => window.__genesi.D2.holes.length)) && dopo.length >= 3,
  "il numero di fori non cambia: è uno specchio, non un'eliminazione", dopo.length);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

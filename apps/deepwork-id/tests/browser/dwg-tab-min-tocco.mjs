/* IL BOTTONE «DATI» DI OGNI GRAFICO (.dwg-tab > summary) SOTTO SOGLIA DI TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node dwg-tab-min-tocco.mjs [--porta=8768]
     node dwg-tab-min-tocco.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dalla seconda iterazione UX su Sentinella (19/09):
   `shared/dw-grafici.css` — il componente CONDIVISO che ogni grafico monta
   per aprire la propria tabella dati (`shared/dw-grafici.js`, usato dalle
   sei app) — dichiarava `min-height:30px`, sotto i 44px di sempre e i 60
   del tema del sole (mai raggiunti nemmeno lì: il tema non tocca questo
   selettore). Misurato su Sentinella, «Programma → Andamento per
   ricettore»: 51,7×30px, costante nei tre temi e nelle tre larghezze.
   È la stessa famiglia di `.chg` (chg-min-larghezza.mjs): va corretto in
   `shared/`, non in Sentinella, perché il difetto è identico su ogni app
   che mostra un grafico con tabella dati. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8768;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

const DIFETTI = [
  ["min-height: var(--tap); min-width: var(--tap); padding: 4px 10px; border: 1px solid var(--border2);",
   "min-height: 30px; padding: 4px 10px; border: 1px solid var(--border2);"],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("shared/dw-grafici.css")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__dwg-tab-tocco-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__dwg-tab-tocco-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

async function misura(app, tema, go, css) {
  const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
  await pg.addInitScript((t) => localStorage.setItem("dw-tema", t), tema);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1200);
  await pg.evaluate((s) => { if (window.go) window.go(s); }, go);
  await pg.waitForTimeout(400);
  const rects = await pg.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => {
    const r = e.getBoundingClientRect();
    return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100, txt: e.textContent.trim() };
  }), css);
  await pg.close();
  return rects;
}

console.log(`\n════════ .dwg-tab > summary: bersaglio minimo${CONTROPROVA ? " · controprova" : ""} ════════`);

const rScuro = await misura("sentinella", "scuro", "prog", ".dwg-tab > summary");
dice(rScuro.length > 0, "Sentinella, Programma → Andamento per ricettore: il bottone «Dati» c'è", rScuro.length);
dice(rScuro.every((r) => r.h >= 44 && r.w >= 44), "⛔ e nel tema scuro è almeno 44×44px", rScuro);

const rSole = await misura("sentinella", "sole", "prog", ".dwg-tab > summary");
dice(rSole.length > 0, "e anche nel tema del sole ci sono i bottoni", rSole.length);
dice(rSole.every((r) => r.h >= 60 && r.w >= 60), "⛔ e nel tema del sole almeno 60×60px, come il proprio --tap dichiara", rSole);

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

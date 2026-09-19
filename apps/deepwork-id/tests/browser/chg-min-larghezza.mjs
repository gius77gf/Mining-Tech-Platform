/* I FILTRI A SEGMENTO (.chg) NON AVEVANO UNA LARGHEZZA MINIMA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node chg-min-larghezza.mjs [--porta=8767]
     node chg-min-larghezza.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dalla seconda iterazione UX su Terra (19/09): stessa
   famiglia della decisione 40 (`.nav`), ma su un selettore diverso e non
   coperto da quella decisione. `.chg` (shared/dw-app-ui.css) ha
   `min-height:var(--tap)` (44px normale, 60px nel tema del sole — "con i
   guanti si colpisce largo, come nel core") ma nessuna `min-width`: un
   filtro con un'etichetta corta ("2026", "GCP") si stringe fino al
   min-content del testo. Misurato su Terra (`#den-anni`, i filtri per
   anno della Denuncia): **56,48×60px** nel tema del sole — sopra i 44 di
   sempre, ma sotto i 60 che il proprio stesso tema dichiara necessari "coi
   guanti". Il core non lo vede mai perché non usa `.chg` con etichette
   così corte. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8767;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

const DIFETTI = [
  ["padding:7px 13px; min-height:var(--tap); min-width:var(--tap); border-radius:7px;",
   "padding:7px 13px; min-height:var(--tap); border-radius:7px;"],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("shared/dw-app-ui.css")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__chg-larghezza-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__chg-larghezza-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

async function misura(app, tema, minAtteso, selettore) {
  const pg = await b.newPage({ viewport: { width: 320, height: 900 } });
  await pg.addInitScript((t) => localStorage.setItem("dw-tema", t), tema);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1200);
  if (selettore.go) await pg.evaluate((s) => { if (window.go) window.go(s); }, selettore.go);
  await pg.waitForTimeout(400);
  const rects = await pg.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => {
    const r = e.getBoundingClientRect();
    return { w: Math.round(r.width * 100) / 100, h: Math.round(r.height * 100) / 100, txt: e.textContent.trim() };
  }), selettore.css);
  await pg.close();
  return rects;
}

console.log(`\n════════ .chg: larghezza minima${CONTROPROVA ? " · controprova" : ""} ════════`);

const rTerraSole = await misura("terra", "sole", 60, { go: "den", css: "#den-anni .chg" });
dice(rTerraSole.length > 0, "Terra, Denuncia: i filtri per anno ci sono", rTerraSole.length);
dice(rTerraSole.every((r) => r.w >= 60 && r.h >= 60), "⛔ e nel tema del sole sono almeno 60×60px, come il proprio --tap dichiara", rTerraSole);

const rTerraScuro = await misura("terra", "scuro", 44, { go: "den", css: "#den-anni .chg" });
dice(rTerraScuro.every((r) => r.w >= 44 && r.h >= 44), "e nel tema scuro almeno 44×44px", rTerraScuro);

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

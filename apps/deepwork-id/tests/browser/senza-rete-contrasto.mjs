/* IL BORDO DEL BANNER "SEI SENZA RETE" SOTTO SOGLIA NEI TEMI CHIARI
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node senza-rete-contrasto.mjs [--porta=8768]
     node senza-rete-contrasto.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dalla seconda iterazione UX su Campo (19/09):
   `.dw-senza-rete` (shared/dw-app-ui.css, componente CONDIVISO montato da
   `dwUiAggancia()` in ogni app tranne dove esplicitamente disattivato) usava
   `border-left:3px solid var(--warn)` — DIRETTO, senza passare da
   `--bar-wr` come ogni altro bordo di stato dello stesso foglio
   (`.kpi.warn`, `.item.st-warn`, `.note.avviso`). `--bar-wr` risolve a
   `--num-wr` quando l'app lo scurisce per i temi chiari (`body.dw.
   light-mode, body.dw.outdoor-mode`), altrimenti resta `--warn` come prima
   — quindi il bordo diretto non riceveva MAI quella calibrazione. Misurato
   su Campo, sull'elemento REALE creato da `montaSenzaRete()`: 8,52:1 nel
   tema scuro, ma 1,69:1 nel chiaro e 1,73:1 nel sole — proprio il tema
   pensato per la leggibilità in pieno cantiere, su un banner che avvisa un
   capoturno di essere senza rete e che quello che scrive non si salva. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8768;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

const DIFETTI = [
  ["border-left:3px solid var(--bar-wr); border-radius:var(--r-sm);",
   "border-left:3px solid var(--warn); border-radius:var(--r-sm);"],
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

const SEGNO = join(R, "__senza-rete-contrasto-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__senza-rete-contrasto-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

// contrasto WCAG relativo, sRGB → luminanza relativa → rapporto
function luminanza([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
function rapporto(c1, c2) {
  const L1 = luminanza(c1), L2 = luminanza(c2);
  const [chiaro, scuro] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (chiaro + 0.05) / (scuro + 0.05);
}
/* ⚠️ Chromium serializza il risultato di un `color-mix()` (qui `--card2`
   in molti temi) con la sintassi CSS Color 4 `color(srgb r g b)`, valori
   frazionari 0-1 — non con `rgb(r, g, b)`. Un lettore che riconosce solo
   la prima forma direbbe «colore non misurabile» proprio sui fondi che
   questa casa costruisce più spesso. */
const daRgb = (s) => {
  let m = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/.exec(s);
  if (m) return [+m[1], +m[2], +m[3]];
  m = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(s);
  if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255];
  return null;
};

async function misura(tema) {
  const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
  await pg.addInitScript((t) => localStorage.setItem("dw-tema", t), tema);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(1200);
  // il caso: sulla pagina VERA, con la funzione VERA — non un div montato a mano
  const misura = await pg.evaluate(() => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    const el = window.dwSenzaRete ? window.dwSenzaRete() : document.getElementById("dw-senza-rete");
    if (!el) return null;
    el.style.display = "block";
    const cs = getComputedStyle(el);
    return { bordo: cs.borderLeftColor, fondo: cs.backgroundColor };
  });
  await pg.close();
  return misura;
}

console.log(`\n════════ .dw-senza-rete: contrasto del bordo${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const [tema, soglia] of [["scuro", 3], ["chiaro", 3], ["sole", 3]]) {
  const m = await misura(tema);
  dice(!!m, `Campo, tema ${tema}: il banner "senza rete" è raggiungibile`, m);
  if (m) {
    const c = rapporto(daRgb(m.bordo), daRgb(m.fondo));
    dice(c >= soglia, `⛔ il bordo del banner regge ${soglia}:1 nel tema ${tema} (misurato ${c.toFixed(2)}:1)`, m);
  }
}

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

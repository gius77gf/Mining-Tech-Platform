/* DEEPWORK ID: NESSUNA DELLE QUATTRO PAGINE CARICAVA I TEMI, E IL BORDO DI
   OGNI CAMPO ERA SOTTO SOGLIA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node deepworkid-tema-e-input.mjs [--porta=8769]
     node deepworkid-tema-e-input.mjs --controprova   (rimette i due difetti: DEVE fallire)

   PERCHÉ ESISTE. Dalla seconda iterazione UX su Deepwork ID (19/09):

   1. Nessuna delle quattro pagine (index, profilo, admin, non-autorizzato)
      caricava `shared/dw-tema.js`, il motore dei tre temi — a differenza
      di tutte e sei le app verticali. La preferenza scelta in una
      qualunque app "vale per tutte le pagine dell'ecosistema" (è scritto
      nel commento dello stesso `dw-tema.js`): senza il caricamento, chi
      apriva Deepwork ID restava sempre al tema scuro. In più, `admin.html`
      e `profilo.html` usavano `<div class="top">` invece di
      `<header class="top">`: `dw-tema.js` cerca `header.top` per montare
      il bottone del tema, quindi anche caricandolo il bottone non sarebbe
      comparso su quelle due pagine.

   2. `.dw-input` (shared/deepwork-style.css) usa `border:1px solid
      var(--border)` — il token DECORATIVO, mai da usare per un controllo
      (docs/PALETTE_APP.md §2.1). `shared/dw-app-ui.css` ha già la versione
      giusta (`var(--border-hi)`), ma la carica solo chi importa anche quel
      foglio — oggi, fra le quattro pagine, solo `admin.html`. E anche lì
      il difetto restava: Deepwork ID non definiva mai il proprio
      `--border-hi`, quindi ereditava il ripiego generico (`--border2`),
      troppo scuro. Misurato sull'elemento REALE: 1,19–1,56:1 contro gli
      0,mai su tutte e quattro le pagine, in ogni tema. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8769;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

/* Difetto 1, per pagina: si toglie lo script del tema (o, per admin/profilo,
   si torna al <div> che dw-tema.js non trova). Le quattro pagine e le loro
   iniezioni vivono in un'unica tabella [file, cerca, sostituisci]. */
const DIFETTI = [
  ["apps/deepwork-id/index.html",
   '<script src="../../shared/dw-tema.js" defer></script>\n<style>\n  /* Deepwork ID usa l\'accento "sistema" della palette funzionale */',
   '<style>\n  /* Deepwork ID usa l\'accento "sistema" della palette funzionale */'],
  ["apps/deepwork-id/non-autorizzato.html",
   '<script src="../../shared/dw-tema.js" defer></script>\n<style>\n  :root { --app-accent:#c7b794; --app-accent2:#e8dcc0; --border-hi:#847760; }\n  .wrap {',
   '<style>\n  :root { --app-accent:#c7b794; --app-accent2:#e8dcc0; --border-hi:#847760; }\n  .wrap {'],
  ["apps/deepwork-id/profilo.html", '<script src="../../shared/dw-tema.js" defer></script>\n<style>', "<style>"],
  ["apps/deepwork-id/admin.html", '<script src="../../shared/dw-tema.js" defer></script>\n<script src="../../shared/dw-app-ui.js" defer></script>', '<script src="../../shared/dw-app-ui.js" defer></script>'],
  ["apps/deepwork-id/admin.html", '<header class="top">', '<div class="top">'],
  ["apps/deepwork-id/admin.html", "</header>", "</div>"],
  ["apps/deepwork-id/profilo.html", '<header class="top">', '<div class="top">'],
  ["apps/deepwork-id/profilo.html", "</header>", "</div>"],
  // Difetto 2: il bordo diretto invece di --border-hi, e il border-hi mai dichiarato
  ["shared/deepwork-style.css", "border: 1px solid var(--border-hi);\n  border-radius: var(--r-sm);", "border: 1px solid var(--border);\n  border-radius: var(--r-sm);"],
  ["apps/deepwork-id/index.html", "--border-hi:#847760; }", "}"],
  ["apps/deepwork-id/profilo.html", "--border-hi:#847760; }", "}"],
  ["apps/deepwork-id/admin.html", "--border-hi:#847760; }", "}"],
  ["apps/deepwork-id/non-autorizzato.html", "--border-hi:#847760; }", "}"],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]).replace(/^\//, "");
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && /\.(html|css)$/.test(p)) {
    let t = corpo.toString("utf8");
    for (const [file, a, b] of DIFETTI) {
      if (!p.endsWith(file)) continue;
      if (t.includes(a)) { colpiti.add(file + "|" + a.slice(0, 30)); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__dwid-tema-input-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__dwid-tema-input-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

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
const daRgb = (s) => {
  let m = /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/.exec(s);
  if (m) return [+m[1], +m[2], +m[3]];
  m = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(s);
  if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255];
  return null;
};

const PAGINE = ["index.html", "profilo.html", "admin.html", "non-autorizzato.html"];

console.log(`\n════════ Deepwork ID: tema e bordo dei campi${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const pagina of PAGINE) {
  const pg = await b.newPage({ viewport: { width: 390, height: 800 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.addInitScript((t) => localStorage.setItem("dw-tema", t), "sole");
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/deepwork-id/${pagina}`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(900);
  const cls = await pg.evaluate(() => document.body.className);
  dice(/outdoor-mode/.test(cls), `${pagina}: il tema del sole si applica al body`, cls);
  const info = await pg.evaluate(() => {
    const inp = document.querySelector(".dw-input");
    if (!inp) return null;
    const cs = getComputedStyle(inp);
    return { border: cs.borderColor, bg: cs.backgroundColor };
  });
  if (info) {
    const c = rapporto(daRgb(info.border), daRgb(info.bg));
    dice(c >= 3, `${pagina}: il bordo di .dw-input regge 3:1 (misurato ${c.toFixed(2)}:1)`, info);
  } else dice(false, `${pagina}: nessun .dw-input trovato — il banco non prova niente su questo fronte`);
  dice(errori.length === 0, `${pagina}: nessun errore in pagina`, errori.slice(0, 2));
  await pg.close();
}

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) {
    console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`);
    process.exit(1);
  }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

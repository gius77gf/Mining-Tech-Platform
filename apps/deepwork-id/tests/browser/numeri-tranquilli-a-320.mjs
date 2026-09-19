/* ══════════════════════════════════════════════════════════════════════════
   OGNI SCHERMATA DELLE SEI APP A 320 PX: NIENTE «undefined», «NaN», «null»,
   «[object» IN NESSUNA RIGA VISIBILE — e gli zeri con unità e i «—» CONTATI
   ──────────────────────────────────────────────────────────────────────────
   Nato il 05/09 (notte) come misura in scratchpad — la passata in profondità
   che apre ogni schermata, apre le linguette chiuse visibili e legge tutto —
   e portato qui perché gli strumenti di misura vivono nei test. Quel giorno
   la misura non ha trovato niente: le corrispondenze erano etichette degli
   assi («0 € · 2.000 €», «0% 25% 50%»), segnaposto di tendine, granulometrie
   («0/30») e assenze dichiarate col loro perché. Quindi il VERDETTO è solo
   sulle quattro parole che non devono comparire mai; gli zeri con unità e i
   trattini sono una MISURA stampata col denominatore, non un KO — se sale,
   qualcuno ha scritto uno zero nuovo e va guardato.
   Fuori perimetro, dichiarato: il core (senza rete non parte: vuole
   `finto-firebase`) e Genesi (non ha la barra `nav-*`; le sue schermate le
   guardano i suoi banchi).
   La controprova rimette un «undefined» in un testo statico di due pagine.
   ══════════════════════════════════════════════════════════════════════════ */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8627;
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const APPS = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
const SENTINELLA = "apps/sentinella/index.html", CAMPO = "apps/campo/index.html";

const DIFETTI = [
  ['<div class="sec">Registra misura</div>', '<div class="sec">Registra misura undefined</div>', SENTINELLA],
  ['<div class="sec">Piano di carico (da Genesi)</div>', '<div class="sec">Piano di carico (da Genesi) NaN</div>', CAMPO],
];
const colpiti = new Set();
const applica = (t, file) => {
  for (const [a, b, f] of DIFETTI) if (f === file && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
  return t;
};
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const file of [SENTINELLA, CAMPO]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__numeri-tranquilli-320-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__numeri-tranquilli-320-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`); process.exit(2); }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";
let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
/* ⚠️ senza la `i` la controprova NON cadeva: `innerText` rispetta
   `text-transform`, e i titoli di sezione sono in maiuscolo — «REGISTRA MISURA
   UNDEFINED». È la trappola già scritta in CLAUDE.md (il maiuscolo che non si
   vede in `innerText`), nel verso opposto: qui il maiuscolo si vede, e nasconde
   la parola alla regex. */
const PAROLE = /\bNaN\b|\bundefined\b|\bnull\b|\[object /i;
const ZERI = /(^|[^\d,.])0(?:[,.]0+)?\s*(?:%|€|m³|t\b|kg|km|h\b|ore|giorni|gg|mm\/s|dB|µg|cm|m\b)|\b0\/\d+\b/;
const TRATTINI = /(^|\s)—(\s|$)/;
const SEGNAPOSTO = /^— .* —$/;   // «— scegli l'impresa —»: la tendina, non un dato

console.log(`\n════════ ogni schermata delle sei app a 320 px: le quattro parole che non devono comparire, e gli zeri contati${CONTROPROVA ? " · controprova" : ""} ════════`);
let schermate = 0, righeLette = 0, zeriTot = 0, trattiniTot = 0;
const perApp = [];
for (const app of APPS) {
  if (SOLO && app !== SOLO) continue;
  const pg = await b.newPage({ viewport: { width: 320, height: 900 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`); await pg.waitForTimeout(2800);
  const navs = await pg.evaluate(() => [...document.querySelectorAll("[id^=nav-]")].map((x) => x.id));
  dice(navs.length >= 4, `${app}: la barra ha almeno quattro voci (${navs.length})`);
  let zeri = 0, tratt = 0, righeApp = 0; const brutte = [];
  for (const id of navs) {
    await pg.evaluate((i) => document.getElementById(i).click(), id); await pg.waitForTimeout(650);
    await pg.evaluate(() => { for (const b of document.querySelectorAll(".page:not([style*='none']) [aria-expanded='false']")) { const r = b.getBoundingClientRect(); if (r.width && r.height) b.click(); } });
    await pg.waitForTimeout(350);
    const t = await pg.evaluate(() => { const p = [...document.querySelectorAll(".page")].find((x) => getComputedStyle(x).display !== "none"); return p ? p.innerText : ""; });
    const righe = t.split("\n").map((r) => r.trim()).filter(Boolean);
    schermate++; righeLette += righe.length; righeApp += righe.length;
    for (const r of righe) {
      if (PAROLE.test(r)) brutte.push(`${id}: ${r.slice(0, 100)}`);
      if (SEGNAPOSTO.test(r)) continue;
      if (ZERI.test(r)) zeri++;
      if (TRATTINI.test(r)) tratt++;
    }
    if (CART) await pg.screenshot({ path: join(CART, `${app}-${id}${CONTROPROVA ? "-CONTROPROVA" : ""}.png`), fullPage: true }).catch(() => {});
  }
  dice(righeApp >= 150, `${app}: letto qualcosa (${righeApp} righe su ${navs.length} schermate)`);
  dice(brutte.length === 0, `⛔ ${app}: nessuna riga visibile porta «NaN», «undefined», «null» o «[object»`, brutte.join(" · "));
  dice(errori.length === 0, `${app}: nessun errore di pagina in tutto il giro`, errori[0]);
  zeriTot += zeri; trattiniTot += tratt; perApp.push(`${app} ${zeri} zeri · ${tratt} trattini`);
  await pg.close();
}
await b.close(); srv.close();
console.log(`\n  [misura] ${schermate} schermate aperte, ${righeLette} righe lette · zeri con unità (o «0/N») ${zeriTot}, trattini «—» ${trattiniTot} — CANDIDATI, non verdetti: il 05/09 erano tutti etichette di assi, granulometrie e assenze dichiarate (${perApp.join(" · ")})`);
console.log(`  [perimetro] fuori: il core (vuole finto-firebase) e Genesi (senza barra nav-*: la guardano i suoi banchi)`);
if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

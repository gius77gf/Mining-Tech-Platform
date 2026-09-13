/* ══════════════════════════════════════════════════════════════════════════
   IL PIANO DI CARICO, PREMUTO DAVVERO: GENESI → CAMPO SENZA IL FILE (05/09)
   ──────────────────────────────────────────────────────────────────────────
   Due pagine nello STESSO browser: in Genesi «Esporta piano di carico» scrive,
   oltre al file, il piano nella collezione `piani` (qui la chiave
   `genesiPiani`); in Campo la sezione «Piano di carico (da Genesi)» mostra
   «Piani da Genesi», «carica» percorre la STESSA strada del file (la finestra
   «Come ho letto il file» compresa) e i dodici fori entrano nel registro reale.
   Riesportare lo stesso piano non lo raddoppia (impronta del testo).
   La controprova rimette due difetti, applicati PER FILE: Genesi che non scrive
   nella collezione, e Campo che ordina una lista vuota.
   ══════════════════════════════════════════════════════════════════════════ */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8626;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const GENESI = "apps/genesi/genesi.html", CAMPO = "apps/campo/index.html";

const DIFETTI = [
  ["if(!gia) await GDB.aggiungi('piani',recPiano); pianoInOrg=true;", "pianoInOrg=true;   /* difetto rimesso dal banco */", GENESI],
  ["const pg = pianiGenesiOrdinati(PGEN);", "const pg = pianiGenesiOrdinati([]);   /* difetto rimesso dal banco */", CAMPO],
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
  if (CONTROPROVA) for (const file of [GENESI, CAMPO]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__ponte-genesi-campo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__ponte-genesi-campo-${process.pid}`)).text();
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
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };

console.log(`\n════════ il piano di carico · Genesi → Campo senza il file, premuto davvero${CONTROPROVA ? " · controprova" : ""} ════════`);
for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  const errori = [];

  // ── 1 · Genesi: «Esporta piano di carico» scrive anche nella collezione ──
  const g = await ctx.newPage(); g.on("pageerror", (e) => errori.push("genesi: " + e.message));
  await g.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`); await g.waitForTimeout(3000);
  await g.evaluate(() => { HTMLAnchorElement.prototype.click = function () { window.__scaricati = (window.__scaricati || []).concat([this.download]); }; });
  await g.evaluate(() => document.getElementById("btn-piano-csv")?.click()); await g.waitForTimeout(1200);
  const g1 = await g.evaluate(() => ({ toast: document.getElementById("toast")?.textContent.trim() || "", file: (window.__scaricati || []).join(","), piani: JSON.parse(localStorage.getItem("genesiPiani") || "[]") }));
  dice(/genesi_piano_carico\.csv/.test(g1.file), "il file esce come sempre", g1.file);
  dice(g1.piani.length === 1 && g1.piani[0].nFori === 12 && Array.isArray(g1.piani[0].righe) && g1.piani[0].righe.length === 12, "⛔ e il piano è scritto nella collezione (qui la chiave del browser): dodici fori", JSON.stringify(g1.piani.map((p) => p.nFori)));
  dice(g1.piani[0] && /^p[0-9a-z]+$/.test(g1.piani[0].impronta || "") && g1.piani[0].righe[0].idForo, "con l'impronta e gli id dei fori", JSON.stringify(g1.piani[0] && [g1.piani[0].impronta, g1.piani[0].righe[0].idForo]));
  dice(/Piani da Genesi/.test(g1.toast), "e il toast dice dove Campo lo trova", g1.toast);
  await g.evaluate(() => document.getElementById("btn-piano-csv")?.click()); await g.waitForTimeout(900);
  const g2 = await g.evaluate(() => JSON.parse(localStorage.getItem("genesiPiani") || "[]").length);
  dice(g2 === 1, "riesportare lo stesso piano non lo raddoppia (stessa impronta)", g2);
  await scatta(g, `${W}-1-genesi-export`);

  // ── 2 · Campo, stesso browser: lo vede e lo carica come dal file ─────────
  const c = await ctx.newPage(); c.on("pageerror", (e) => errori.push("campo: " + e.message));
  await c.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`); await c.waitForTimeout(2500);
  await c.click("#nav-rap").catch(() => {}); await c.waitForTimeout(600);
  const prima = await c.evaluate(() => ({ testo: document.getElementById("piano-genesi").innerText.replace(/\s+/g, " ").trim(), n: document.querySelectorAll("#piano-genesi [data-piano-genesi]").length, fori: document.querySelectorAll("#piano-list [data-foro-id]").length }));
  dice(prima.n === 1 && /Piani da Genesi/.test(prima.testo) && /12 fori/.test(prima.testo), "⛔ Campo mostra «Piani da Genesi» con il piano di dodici fori", prima.testo.slice(0, 200));
  dice(/esportato il \d\d\/\d\d\/\d{4} alle \d\d:\d\d/.test(prima.testo), "con la data e l'ora dell'export in italiano", prima.testo.slice(0, 200));
  dice(prima.fori === 0, "e il registro reale è ancora vuoto", prima.fori);
  const forma = await c.evaluate(() => { const it = document.querySelector("#piano-genesi .item"); return it ? { avatar: !!it.querySelector(".avatar svg"), info: !!it.querySelector(".info .name") && !!it.querySelector(".info .meta"), acts: !!it.querySelector(".acts .badge") && !!it.querySelector(".acts button.arr svg") } : null; });
  dice(!!forma && forma.avatar && forma.info && forma.acts, "la riga ha la forma delle righe di Campo (avatar · info · acts), con le icone", JSON.stringify(forma));
  await c.evaluate(() => document.getElementById("piano-genesi")?.scrollIntoView({ block: "center" }));
  await scatta(c, `${W}-2-campo-piani`);
  await c.evaluate(() => document.querySelector("#piano-genesi [data-piano-genesi]")?.click()); await c.waitForTimeout(900);
  const finestra = await c.evaluate(() => ({ titolo: (document.querySelector(".modal .modal-title, .dw-modal h3, #modal-title")?.textContent || "").trim(), bottoni: [...document.querySelectorAll("button")].map((x) => x.textContent.trim()).filter((t) => /Va bene, importa|Annulla/.test(t)) }));
  dice(finestra.titolo === "Come ho letto il file" && finestra.bottoni.includes("Va bene, importa"), "⛔ la STESSA finestra dell'import dal file («Come ho letto il file»): la strada è una", JSON.stringify(finestra));
  await c.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => /Va bene, importa/.test(x.textContent)); b && b.click(); }); await c.waitForTimeout(1500);
  const dopo = await c.evaluate(() => ({ toast: document.getElementById("toast")?.textContent.trim() || "", riep: document.getElementById("piano-riep").innerText.replace(/\s+/g, " "), fori: document.querySelectorAll("#piano-list [data-foro-id]").length }));
  dice(/Piano importato: 12 fori/.test(dopo.toast), "importato: il toast dice dodici fori", dopo.toast);
  dice(dopo.fori === 12 && /Fori 0\/12 registrati/.test(dopo.riep) && /progettato 720 kg/.test(dopo.riep), "⛔ dodici fori nel registro reale, 0/12 registrati, 720 kg progettati — gli stessi numeri del file", dopo.riep.slice(0, 200));
  await scatta(c, `${W}-3-campo-caricato`);
  dice(errori.length === 0, "nessuna delle due pagine ha sollevato errori", errori[0]);
  await ctx.close();
}
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

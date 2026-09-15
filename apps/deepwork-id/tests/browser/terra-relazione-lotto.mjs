/* TERRA · LA RELAZIONE DI FINE LAVORI DEL LOTTO, PREMUTA DAVVERO
   ────────────────────────────────────────────────────────────────
   Uso:
     node terra-relazione-lotto.mjs [--porta=8637] [--scatti=/cartella]
     node terra-relazione-lotto.mjs --controprova     (DEVE fallire)

   PERCHÉ ESISTE. Per chiedere il collaudo e lo svincolo della garanzia il
   mondo vuole «una relazione che descrive le opere eseguite con riferimento
   al progetto»: dal 04/09 la riga di un lotto recuperato o collaudato ha il
   bottone «Relazione di fine lavori», che apre un foglio in una finestra
   nuova (`window.open` + `document.write`, come il verbale del rilievo).
   Qui si preme davvero, a 320 e 390 px, e si legge il foglio catturando la
   finestra: gli stessi numeri della riga del lotto, le date, la quota di
   garanzia, l'attesa del collaudo, l'avviso di dimostrazione, e — la parte
   che vale — la sezione «Che cosa manca», dove un dato non registrato resta
   scritto come tale invece di diventare uno zero. Sui lotti aperti il
   bottone non c'è. E il verbale del rilievo, che da oggi condivide lo stile
   del foglio (`STILE_FOGLIO`), si apre ancora con il suo stile.
   La controprova rimette nel modulo il difetto che la relazione esiste per
   non fare: il volume non misurato scritto «0 m³» e tolto da «che cosa
   manca». Il banco deve cadere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8637;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const DIFETTI_MODULO = [
  ['  else { righe.push(["Volume misurato sui suoi fronti", "non misurato", true]); nonMisurati.push("Volume misurato (" + vm.motivo + ")"); }',
   '  else righe.push(["Volume misurato sui suoi fronti", "0 m³", false]);   /* difetto rimesso dal banco */'],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/terra/terra-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_MODULO) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* il contrassegno col proprio pid: se sulla porta risponde un altro server,
   misurerei la copia di qualcun altro — ci si ferma */
const SEGNO = join(R, "__terra-relazione-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__terra-relazione-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
/* il foglio scrive gli apostrofi come `&#39;` (passa da `esc`): si decodificano,
   se no «Collaudo chiesto all'ente» non si trova mai */
const testo = (h) => String(h || "").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

console.log(`\n════════ Terra · la relazione di fine lavori del lotto, premuta davvero${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  /* la finestra nuova si cattura: `window.open` restituisce un documento finto
     che accumula ciò che la pagina ci scrive, e `print` non parte */
  await ctx.addInitScript(() => {
    window.__fogli = [];
    window.open = () => { const f = { html: "", chiuso: false }; window.__fogli.push(f);
      return { document: { write: (h) => { f.html += h; }, close: () => { f.chiuso = true; } }, focus: () => {}, print: () => {} }; };
  });
  const pg = await ctx.newPage();
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/terra/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-pia").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-pia", `navigato davvero nel Piano (${viste.join(",") || "nessuna"})`, viste);

  // ── 0 · il bottone c'è solo sui lotti recuperati e collaudati ─────────
  const bottoni = await pg.$$eval("#lot-list .item", (e) => e.map((i) => ({ nome: i.querySelector(".name")?.textContent.trim(), rel: !!i.querySelector("[data-rel-lot]"), stato: i.querySelector(".acts .badge:last-of-type")?.textContent.trim() })));
  dice(bottoni.filter((x) => x.rel).length === 2 && bottoni.filter((x) => x.rel).every((x) => /Collaudato|Recuperato/.test(x.stato)), "il bottone della relazione sta su due lotti su sei: il recuperato e il collaudato", JSON.stringify(bottoni));
  const tocco = await pg.$eval('[data-rel-lot="lo2"]', (e) => { const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), dentro: r.right <= innerWidth + 0.5 }; });
  dice(tocco.h >= 40 && tocco.w >= 40 && tocco.dentro, `ed è un bersaglio di tocco (${tocco.w}×${tocco.h} px) dentro lo schermo`, tocco);

  // ── 1 · la relazione del lotto recuperato (lo2) ────────────────────────
  await pg.click('[data-rel-lot="lo2"]');
  await pg.waitForTimeout(500);
  const fogli = await pg.evaluate(() => window.__fogli.map((f) => ({ html: f.html, chiuso: f.chiuso })));
  dice(fogli.length === 1 && fogli[0].chiuso, "premuto, si apre UNA finestra e il foglio viene scritto e chiuso", fogli.length);
  const doc = fogli[0]?.html || "";
  const t = testo(doc);
  dice(/<title>Relazione di fine lavori — Lotto 2 — settore Sud-Ovest<\/title>/.test(doc), "il titolo del foglio è quello del lotto", doc.slice(0, 200));
  dice(/box-sizing:border-box/.test(doc) && /\.manca\{/.test(doc), "il foglio porta lo stile condiviso, con la classe dei dati mancanti", doc.slice(0, 300));
  dice(/Superficie 6\.000 m²/.test(t) && /Volume di progetto 88\.000 m³/.test(t), "superficie e volume di progetto, all'italiana", t.slice(0, 600));
  dice(/Volume misurato sui suoi fronti non misurato/.test(t), "⛔ il volume misurato è «non misurato» (lo2 non dichiara fronti), non «0 m³»", t.slice(0, 900));
  dice(!/(^|[^\d.])0 m³/.test(t), "⛔ e nessuno «0 m³» in tutto il foglio (88.000 m³ non è uno zero)", t);
  dice(/Collaudo chiesto il 10\/06\/2026/.test(t) && /Collaudo chiesto all'ente il 10\/06\/2026 \(\d+ giorni fa\): fino al verbale il lotto non è chiuso\./.test(t), "le date portano la richiesta del collaudo, e sotto c'è la frase dell'attesa", t.slice(600, 1400));
  dice(/Quota di garanzia del lotto 25\.000 €/.test(t) && /Volume rimesso in cava per il recupero non dichiarato/.test(t), "la quota di garanzia c'è, il volume del recupero è «non dichiarato»", t.slice(900, 1800));
  dice(/Che cosa manca in questa relazione/.test(t) && /Volume misurato \(Questo lotto non dichiara nessun fronte/.test(t) && /Fronti \(nessuno dichiarato\)/.test(t) && /Volume rimesso in cava per il recupero \(non dichiarato\)/.test(t), "⛔ la sezione «Che cosa manca» elenca le tre voci col motivo del modulo", t.slice(1200, 2400));
  dice(/non li stima e non li sostituisce con uno zero/.test(t), "e dice che non li stima", t.slice(1600, 2400));
  dice(/Questa relazione non documenta nessun lotto reale/.test(t), "in dimostrazione il foglio porta l'avviso", t.slice(0, 500));
  dice(/Titolo autorizzativo di riferimento/.test(t) && /Numero dell'atto/.test(t), "e il titolo autorizzativo di riferimento", t.slice(1000, 2000));
  dice(!/undefined|NaN|null/.test(t), "niente «undefined», «NaN» o «null» sul foglio", t);
  if (CART) {
    const pf = await ctx.newPage(); await pf.setContent(doc); await pf.waitForTimeout(200);
    await pf.screenshot({ path: join(CART, `${W}-relazione-lo2${CONTROPROVA ? "-CONTROPROVA" : ""}.png`), fullPage: true }).catch(() => {}); await pf.close();
  }

  // ── 2 · la relazione del lotto collaudato (lo1): sei date, quota liberata ─
  await pg.evaluate(() => { window.__fogli = []; });
  await pg.click('[data-rel-lot="lo1"]');
  await pg.waitForTimeout(500);
  const t1 = testo((await pg.evaluate(() => window.__fogli[0]?.html)) || "");
  dice(/Stato collaudato/.test(t1) && /Collaudato il \(verbale dell'ente\) 19\/02\/2024/.test(t1), "il collaudato porta la riga del verbale con la sua data", t1.slice(0, 900));
  dice(/Collaudo chiesto il non registrata/.test(t1) && /Collaudo chiesto il \(non registrata\)/.test(t1), "⛔ la richiesta del collaudo, mai registrata su lo1, è «non registrata» sul foglio E fra le mancanze — non tace", t1.slice(400, 1600));
  dice(/Quota di garanzia del lotto 40\.000 €/.test(t1) && !/fino al verbale/.test(t1), "la quota di lo1 c'è, e niente attesa su un collaudato", t1.slice(800, 1800));

  // ── 3 · il verbale del rilievo si apre ancora, con lo stesso stile ────────
  await pg.click("#nav-ril").catch(() => {}); await pg.waitForTimeout(500);
  await pg.evaluate(() => { window.__fogli = []; });
  const haVerb = await pg.$("[data-verb-ril]");
  dice(!!haVerb, "nei Rilievi c'è il bottone del verbale");
  if (haVerb) {
    await haVerb.click(); await pg.waitForTimeout(400);
    await pg.click("#modal-foot .mbtn.primary").catch(() => {}); await pg.waitForTimeout(600);
    const dv = (await pg.evaluate(() => window.__fogli[0]?.html)) || "";
    dice(/<title>Verbale di rilievo/.test(dv) && /box-sizing:border-box/.test(dv) && /\.firma\{/.test(dv), "il verbale si apre con lo stile del foglio (scritto una volta sola)", dv.slice(0, 300));
  }

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  await ctx.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_MODULO.length}`);
  if (colpiti.size !== DIFETTI_MODULO.length) {
    console.error("✗ il difetto non ha trovato il suo pezzo di modulo: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

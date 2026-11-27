/* SCUDO · IL GIUDIZIO DEL MEDICO SI SCRIVE, NON SI CICLA — PREMUTO DAVVERO
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-giudizio-medico.mjs [--porta=8659] [--scatti=/cartella]
     node scudo-giudizio-medico.mjs --controprova     (DEVE fallire)

   PERCHÉ ESISTE. Fino al 05/09 il badge dell'idoneità nel Personale ciclava
   quattro stati a ogni tocco senza chiedere niente: «idoneo con prescrizioni»
   era un colore senza il testo, e una prescrizione che non si legge non si
   rispetta. Adesso il tocco propone lo stato successivo e, se è un giudizio,
   apre la modale del core: la data (facoltativa) e — per le prescrizioni —
   il testo del medico, obbligatorio. Qui si tocca davvero, a 320 e 390 px:
     · n.d. → idoneo: la modale chiede solo la data; registrato, la riga dice
       «Giudizio del …»;
     · idoneo → prescrizioni: la modale chiede il testo; VUOTO è rifiutato
       (toast, la riga non cambia); col testo la riga porta le prescrizioni;
     · e Annulla lascia tutto com'era.
   La controprova rimette nel modulo il difetto: `giudizioIdoneita` che
   accetta le prescrizioni vuote. Il banco deve cadere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8659;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const DIFETTI_MODULO = [
  ['  if (st === "prescrizioni" && !t)\n    return { ok: false, motivo: "prescrizioni-mancanti"',
   '  if (false && st === "prescrizioni" && !t)   /* difetto rimesso dal banco */\n    return { ok: false, motivo: "prescrizioni-mancanti"'],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/scudo/scudo-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_MODULO) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__scudo-giudizio-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-giudizio-${process.pid}`)).text();
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

console.log(`\n════════ Scudo · il giudizio del medico si scrive, non si cicla${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html?demo=1`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-pers").catch(() => {});
  await pg.waitForTimeout(600);
  const riga = () => pg.evaluate(() => { const i = [...document.querySelectorAll("#pers-list .item")].find((x) => /Mario Rossi/.test(x.textContent)); if (!i) return null;
    return { badge: i.querySelector("[data-idon]")?.textContent.trim(), norma: i.querySelector(".meta.norma")?.textContent.replace(/\s+/g, " ").trim() || "" }; });
  const modale = () => pg.evaluate(() => ({ aperta: !!document.querySelector("#modal.show, .modal.show"), titolo: document.querySelector("#modal-title, .modal-title, #modal h3")?.textContent.trim() || "", campi: [...document.querySelectorAll('[id^="mc-"]')].map((c) => c.id), corpo: document.querySelector("#modal-body")?.innerText.replace(/\s+/g, " ").trim().slice(0, 200) || "" }));
  const prima = await riga();
  dice(!!prima && prima.badge === "Idoneità n.d." && prima.norma === "", "Mario Rossi parte «Idoneità n.d.» senza riga del giudizio", JSON.stringify(prima));

  // ── 1 · n.d. → idoneo: la modale chiede la data, e Annulla non cambia niente ─
  await pg.click('#pers-list [data-idon="d1"]'); await pg.waitForTimeout(400);
  let m = await modale();
  dice(m.aperta && /Giudizio di idoneità: Idoneo/.test(m.titolo) && m.campi.join(",") === "mc-data", "il tocco apre la modale «Giudizio di idoneità: Idoneo» con la sola data", JSON.stringify(m));
  await scatta(pg, `${W}-1-modale-idoneo`);
  await pg.click("#modal-foot .mbtn:not(.primary)").catch(() => {}); await pg.waitForTimeout(400);
  dice(JSON.stringify(await riga()) === JSON.stringify(prima), "Annulla: la riga è com'era", JSON.stringify(await riga()));
  await pg.click('#pers-list [data-idon="d1"]'); await pg.waitForTimeout(400);
  dice(await pg.fill("#mc-data", "2026-09-01", { timeout: 3000 }).then(() => true).catch(() => false), "il campo della data c'è e si compila");
  await pg.click("#modal-foot .mbtn.primary", { timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(700);
  const dopo1 = await riga();
  dice(!!dopo1 && dopo1.badge === "Idoneo" && dopo1.norma === "Giudizio del 01/09/2026", "registrato: badge «Idoneo» e «Giudizio del 01/09/2026» nella riga", JSON.stringify(dopo1));

  // ── 2 · idoneo → prescrizioni: il testo vuoto è rifiutato ───────────────
  await pg.click('#pers-list [data-idon="d1"]'); await pg.waitForTimeout(400);
  m = await modale();
  dice(m.aperta && /prescriz/i.test(m.titolo) && m.campi.join(",") === "mc-testo,mc-data", "il secondo tocco propone «con prescrizioni» e chiede testo e data", JSON.stringify(m));
  dice(await pg.$eval("#mc-data", (e) => e.value) === "2026-09-01", "la data proposta è quella del giudizio precedente");
  await scatta(pg, `${W}-2-modale-prescrizioni`);
  dice(await pg.fill("#mc-testo", "", { timeout: 3000 }).then(() => true).catch(() => false), "il campo del testo c'è (vuoto di proposito)");
  await pg.click("#modal-foot .mbtn.primary", { timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(600);
  const toast = await pg.evaluate(() => [...document.querySelectorAll(".toast, #toast")].map((t) => t.textContent.replace(/\s+/g, " ").trim()).join(" | "));
  dice(/senza le prescrizioni scritte non si può rispettare/.test(toast), "⛔ le prescrizioni VUOTE sono rifiutate, col perché", toast);
  const invariata = await riga();
  dice(!!invariata && invariata.badge === "Idoneo" && invariata.norma === "Giudizio del 01/09/2026", "⛔ e la riga non è cambiata: niente «con prescrizioni» senza il testo", JSON.stringify(invariata));

  // ── 3 · col testo passa, e la riga lo porta ──────────────────────────────
  await pg.click('#pers-list [data-idon="d1"]'); await pg.waitForTimeout(400);
  dice(await pg.fill("#mc-testo", "Niente lavori in quota", { timeout: 3000 }).then(() => pg.fill("#mc-data", "2026-09-03", { timeout: 3000 })).then(() => true).catch(() => false), "testo e data si compilano");
  await pg.click("#modal-foot .mbtn.primary", { timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(700);
  const dopo3 = await riga();
  dice(!!dopo3 && dopo3.badge === "Idoneo c/prescriz." && dopo3.norma === "Giudizio del 03/09/2026 · Prescrizioni del medico: Niente lavori in quota", "registrato: badge e riga con la data e le prescrizioni", JSON.stringify(dopo3));
  const dentro = await pg.evaluate(() => { const i = [...document.querySelectorAll("#pers-list .item")].find((x) => /Mario Rossi/.test(x.textContent)); return i ? i.scrollWidth <= i.clientWidth + 1 : null; });
  dice(dentro === true, "e la riga non scorre in orizzontale");
  await pg.evaluate(() => [...document.querySelectorAll("#pers-list .item")].find((x) => /Mario Rossi/.test(x.textContent))?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-3-riga`);
  // la data nel futuro è rifiutata (non idoneo, testo facoltativo)
  await pg.click('#pers-list [data-idon="d1"]'); await pg.waitForTimeout(400);
  dice(await pg.fill("#mc-data", "2030-01-01", { timeout: 3000 }).then(() => true).catch(() => false), "la modale del giudizio successivo ha la data");
  await pg.click("#modal-foot .mbtn.primary", { timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(600);
  const toast2 = await pg.evaluate(() => [...document.querySelectorAll(".toast, #toast")].map((t) => t.textContent.replace(/\s+/g, " ").trim()).join(" | "));
  dice(/nel futuro/.test(toast2) && (await riga()).badge === "Idoneo c/prescriz.", "una data nel futuro è rifiutata e la riga resta", toast2);

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  await pg.close();
}
await b.close(); srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_MODULO.length}`);
  if (colpiti.size !== DIFETTI_MODULO.length) { console.error("✗ il difetto non ha trovato il suo pezzo di modulo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

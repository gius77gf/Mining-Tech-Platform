/* PONTE CONTI → FLOTTA · LA FATTURA DELL'OFFICINA E L'ORDINE DI LAVORO, PREMUTI (06/09)
   In Conti: la tendina «Ordine di lavoro di Flotta» nel registro costi porta
   gli ordini della dimostrazione, la riga collegata (c90) ha la pastiglia e
   dice l'ordine, e una spesa nuova salvata con l'ordine scelto lo porta con
   sé. In Flotta: aperto l'ordine n2, la riga «In Conti» dice «una spesa in
   Conti: 200,00 €, cioè 21,50 € più del conto dell'ordine». A 390 e 320 px.
   Controprova: tre difetti per file (il salvataggio che perde il riferimento;
   il lettore di shared che non riconosce il riferimento; la pagina di Flotta
   che chiama il confronto con Conti «non raggiungibile»).
   Uso: [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8671;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const PONTI = "shared/dw-ponti.js", CONTI = "apps/conti/index.html", FLOTTA = "apps/flotta/index.html";

const DIFETTI = [
  ["    if (odl) rec.ordineFlotta = { id: odl.id, titolo: odl.titolo, mezzo: odl.mezzo };",
   "    /* difetto rimesso dal banco: il riferimento non si scrive */", CONTI],
  ["  const r = costo && costo.ordineFlotta;\n  if (!r || typeof r !== \"object\") return null;",
   "  const r = null;   /* difetto rimesso dal banco */\n  if (!r || typeof r !== \"object\") return null;", PONTI],
  ["        : confrontoOrdineConti(q.totale, costiDiOrdine(n.id, CC));",
   "        : confrontoOrdineConti(q.totale, costiDiOrdine(n.id, null));   /* difetto rimesso dal banco */", FLOTTA],
];
const colpiti = new Set();
const applica = (t, file) => {
  for (const [a, b, f] of DIFETTI) if (f === file && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
  return t;
};
const srv = createServer((q, s) => {
  const p = decodeURIComponent((q.url || "/").split("?")[0]);
  const f = join(R, p);
  if (!existsSync(f) || statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  let corpo = readFileSync(f);
  if (CONTROPROVA) for (const file of [PONTI, CONTI, FLOTTA]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "Content-Type": TIPI[extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__ponte-odl-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__ponte-odl-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`); process.exit(2); }
} finally { unlinkSync(SEGNO); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";
let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log("  ✓ " + t); }
  else { ko++; console.log("  ✗ " + t + (x !== undefined ? "  → " + String(x).slice(0, 400) : "")); }
};
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };
const testo = (pg, sel) => pg.$eval(sel, (e) => e.textContent.replace(/\s+/g, " ").trim()).catch(() => "");

for (const W of [390, 320]) {
  console.log(`\n── Conti a ${W} px ──`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(String(e)));
  pg.setDefaultTimeout(4000);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html`);
  await pg.waitForTimeout(1500);
  await pg.click("#nav-cos").catch(() => {});
  await pg.waitForTimeout(900);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none" || x.classList.contains("active")).map((x) => x.id));
  dice(viste.includes("page-cos"), `navigato davvero nei Costi (${viste.join(",") || "nessuna"})`, viste);

  // 1 · la tendina
  const opz = await pg.$$eval("#co-odl option", (e) => e.map((o) => [o.value, o.textContent.trim()]));
  dice(opz.length === 3 && opz[1][0] === "n2" && opz[1][1] === "Rotazione gomme · Dumper D1" && opz[2][0] === "n4", "⛔ la tendina porta i due ordini di lavoro della dimostrazione, con titolo e mezzo", JSON.stringify(opz));
  dice(await pg.$eval("#co-odl", (e) => !e.disabled), "e non è disabilitata (Flotta risponde)");

  // 2 · la riga collegata della dimostrazione
  await pg.click('#cos-periodo [data-periodo="anno"], #cos-filtri [data-periodo="anno"]').catch(() => {});
  const righe = await pg.$$eval("#cos-list .item", (e) => e.map((r) => ({ name: r.querySelector(".name")?.textContent.trim(), meta: r.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(), badges: [...r.querySelectorAll(".badge")].map((x) => x.textContent.trim()) })));
  const c90 = righe.find((r) => /fattura 214/.test(r.meta || ""));
  dice(!!c90, "la fattura 214 dell'officina è in elenco", JSON.stringify(righe.slice(0, 3).map((r) => r.meta)));
  dice(!!c90 && c90.badges.includes("ordine di lavoro") && c90.badges.includes("anche in Flotta"), "⛔ con la pastiglia «ordine di lavoro» accanto a «anche in Flotta»", c90 && JSON.stringify(c90.badges));
  dice(!!c90 && /ordine: Rotazione gomme · Dumper D1/.test(c90.meta), "e la riga di dettaglio dice quale ordine", c90 && c90.meta);
  dice(righe.filter((r) => r.badges.includes("ordine di lavoro")).length === 1, "una sola riga collegata nella dimostrazione", righe.filter((r) => r.badges.includes("ordine di lavoro")).length);
  if (c90) await pg.evaluate(() => [...document.querySelectorAll("#cos-list .item")].find((r) => /fattura 214/.test(r.textContent))?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-riga-collegata`);

  // 3 · una spesa nuova, collegata a n4
  await pg.fill("#co-data", "2026-09-06");
  await pg.selectOption("#co-voce", "manutenzione");
  await pg.fill("#co-imp", "90");
  await pg.fill("#co-nota", "Officina esterna, fattura 231 — perdite D1");
  await pg.selectOption("#co-odl", "n4");
  await pg.evaluate(() => document.getElementById("co-odl")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-2-form`);
  await pg.click("#btn-co, #co-salva, #btn-cos").catch(() => {});
  await pg.waitForTimeout(900);
  const es = await testo(pg, "#cos-esito");
  dice(/Costo registrato: .*collegato all'ordine «Giro macchina: Perdite sotto la macchina · Dumper D1»/.test(es), "⛔ la striscia dice a quale ordine è collegata la spesa nuova", es || "(vuota)");
  const righe2 = await pg.$$eval("#cos-list .item", (e) => e.map((r) => ({ meta: r.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(), badges: [...r.querySelectorAll(".badge")].map((x) => x.textContent.trim()) })));
  const nuova = righe2.find((r) => /fattura 231/.test(r.meta || ""));
  dice(!!nuova && nuova.badges.includes("ordine di lavoro") && /ordine: Giro macchina: Perdite sotto la macchina · Dumper D1/.test(nuova.meta), "⛔ e la riga nuova porta il riferimento (scritto dalla pagina, letto da shared)", nuova && JSON.stringify(nuova));
  dice(errori.length === 0, "Conti non ha sollevato errori", errori[0]);
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Conti non scorre in orizzontale");
  await pg.close();

  console.log(`\n── Flotta a ${W} px ──`);
  const pf = await b.newPage({ viewport: { width: W, height: 900 } });
  const erroriF = [];
  pf.on("pageerror", (e) => erroriF.push(String(e)));
  pf.setDefaultTimeout(4000);
  await pf.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
  await pf.waitForTimeout(1500);
  await pf.click("#nav-man").catch(() => {});
  await pf.waitForTimeout(600);
  await pf.click('[data-odl-man="n2"]').catch(() => {});
  await pf.waitForTimeout(900);
  const aperto = await pf.$eval("#page-odl", (e) => e.classList.contains("active") || getComputedStyle(e).display !== "none").catch(() => false);
  dice(aperto, "l'ordine n2 «Rotazione gomme» è aperto");
  const inConti = await testo(pf, "#odl-conti");
  const stato = await pf.$eval("#odl-conti", (e) => e.getAttribute("data-stato-conti")).catch(() => "");
  dice(/^In Conti · una spesa in Conti: 200,00\s?€, cioè 21,50\s?€ più del conto dell'ordine \(178,50\s?€\)/.test(inConti), "⛔ Flotta vede la fattura 214 e dice la differenza col conto dell'ordine", inConti || "(vuota)");
  dice(stato === "conti-di-piu" && (await pf.$eval("#odl-conti", (e) => e.classList.contains("avviso"))), "con lo stato «conti-di-piu» e la veste di avviso", stato);
  await pf.evaluate(() => document.getElementById("odl-conti")?.scrollIntoView({ block: "center" }));
  await scatta(pf, `${W}-3-flotta-ordine`);
  await pf.click("#nav-man").catch(() => {});
  await pf.waitForTimeout(400);
  await pf.click('[data-odl-man="n4"]').catch(() => {});
  await pf.waitForTimeout(900);
  const inConti4 = await testo(pf, "#odl-conti");
  dice(/^In Conti · Nessuna spesa in Conti collegata a questo ordine\./.test(inConti4), "sull'ordine n4 (non collegato nella dimostrazione di Flotta): «nessuna spesa», senza allarme", inConti4);
  dice(erroriF.length === 0, "Flotta non ha sollevato errori", erroriF[0]);
  dice(await pf.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Flotta non scorre in orizzontale");
  await pf.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

/* SCUDO · LE VERSIONI DI UN DOCUMENTO, PREMUTE (06/09, notte)
   Un DVR nuovo non cancella il vecchio: lo SOSTITUISCE, e l'ispettore chiede
   tutt'e due. Qui si preme davvero: la dimostrazione con l'edizione 2025 già
   sostituita, il tocco sul sostituito che NON cambia stato, la domanda
   all'aggiunta di un documento dello stesso ambito (con le due risposte),
   nessuna domanda per «Altro», e il DSS che conserva la revisione precedente.
   Le funzioni pure stanno in `run-kpi.mjs`; qui si prova ciò che solo il
   browser sa dire. Controprova: tre difetti per file (`applica(t, file)`).
   Uso: node scudo-versioni-documenti.mjs [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8641;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/scudo/scudo-data.js", PAGINA = "apps/scudo/index.html";

const DIFETTI = [
  ["           const s = sostituzioneDocumento(prec, nuovoId);",
   "           const s = null;   /* difetto rimesso dal banco */", PAGINA],
  ["  const cand = (documenti || []).filter((d) => d && d.id && d.id !== n.id && stessoAmbitoDocumento(d, n) && !d.sostituitoDa);",
   "  const cand = (documenti || []).filter((d) => d && d.id && d.id !== n.id && stessoAmbitoDocumento(d, n));   /* difetto rimesso dal banco */", MODULO],
  ["  const conservata = !!prima && prima !== patch.dssRevisione;",
   "  const conservata = false;   /* difetto rimesso dal banco */", MODULO],
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
  if (CONTROPROVA) for (const file of [MODULO, PAGINA]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "Content-Type": TIPI[extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__scudo-vers-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-vers-${process.pid}`)).text();
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
const modaleAperto = (pg) => pg.$eval("#modal", (e) => getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).opacity !== "0").catch(() => false);
const riga = (pg, id) => pg.$eval(`[data-doc="${id}"]`, (e) => ({ badge: e.querySelector(".acts .badge:last-child")?.textContent.trim(), tocca: e.classList.contains("tocca"), title: e.getAttribute("title") })).catch(() => null);
const versioni = (pg, id) => testo(pg, `[data-doc-versioni="${id}"]`);

for (const W of [390, 320]) {
  console.log(`\n── Scudo a ${W} px ──`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(String(e)));
  pg.setDefaultTimeout(4000);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html`);
  await pg.waitForTimeout(1500);
  await pg.click("#nav-doc").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-doc", `navigato davvero nei Documenti (${viste.join(",") || "nessuna"})`, viste);

  // 1 · la dimostrazione: il DVR in vigore e l'edizione 2025 sostituita
  const r0 = await riga(pg, "c0"), r1 = await riga(pg, "c1");
  dice(!!r0 && r0.badge === "Sostituito" && !r0.tocca && /non si cambia/.test(r0.title || ""), "⛔ l'edizione 2025 è «Sostituito», senza il tocco che cambia stato", JSON.stringify(r0));
  dice(!!r1 && r1.badge === "Valido" && r1.tocca, "il DVR in vigore è valido e si tocca", JSON.stringify(r1));
  dice((await versioni(pg, "c1")) === "2ª versione: sostituisce la precedente (l'ultima il 10/03/2026)", "⛔ sotto il DVR in vigore: «2ª versione: sostituisce la precedente»", await versioni(pg, "c1"));
  dice((await versioni(pg, "c0")) === "sostituito da «DVR — Documento Valutazione Rischi»", "e sotto l'edizione 2025: da chi è stata sostituita", await versioni(pg, "c0"));
  dice((await versioni(pg, "c2")) === "", "un documento senza versioni non ha la riga", await versioni(pg, "c2"));
  await pg.evaluate(() => document.querySelector('[data-doc="c0"]')?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-dimostrazione`);

  // 2 · il tocco sul sostituito NON cambia stato
  await pg.click('[data-doc="c0"]').catch(() => {});
  await pg.waitForTimeout(500);
  const toastT = await testo(pg, "#toast");
  dice(/sostituito: vale la versione più recente/.test(toastT), "il tocco sul sostituito spiega, non cambia", toastT || "(nessun toast)");
  dice(((await riga(pg, "c0")) || {}).badge === "Sostituito", "⛔ e la pastiglia resta «Sostituito»", JSON.stringify(await riga(pg, "c0")));

  // 3 · aggiungo un DVR nuovo: la domanda, e «Sì»
  await pg.fill("#doc-titolo", "DVR — edizione 2026 bis");
  await pg.fill("#doc-meta", "Aggiornato 09/2026");
  await pg.selectOption("#doc-tipo", "DVR");
  await pg.click("#btn-doc");
  await pg.waitForTimeout(900);
  dice(await modaleAperto(pg) && (await testo(pg, "#modal-title")) === "Sostituisce il documento precedente?", "⛔ all'aggiunta di un DVR la pagina CHIEDE se sostituisce quello in archivio", await testo(pg, "#modal-title"));
  const corpo = await testo(pg, "#modal-body");
  dice(/DVR — Documento Valutazione Rischi \(Aggiornato 03\/2026\)/.test(corpo) && !/edizione 2025/.test(corpo), "⛔ e propone quello IN VIGORE, non l'edizione 2025 già sostituita", corpo.slice(0, 200));
  await scatta(pg, `${W}-2-domanda`);
  await pg.click('#modal button:has-text("Sì, lo sostituisce")').catch(() => {});
  await pg.waitForTimeout(1000);
  const strisciaA = await testo(pg, "#doc-esito");
  dice(/Sostituisce «DVR — Documento Valutazione Rischi», che resta in archivio come sostituito\./.test(strisciaA), "la striscia dice che cosa ha sostituito", strisciaA);
  dice(((await riga(pg, "c1")) || {}).badge === "Sostituito", "⛔ il DVR di prima è adesso «Sostituito»", JSON.stringify(await riga(pg, "c1")));
  const nuovoId = await pg.$$eval("[data-doc-versioni]", (e) => (e.find((x) => /3ª versione/.test(x.textContent)) || {}).getAttribute?.("data-doc-versioni") || "");
  dice(!!nuovoId && (await versioni(pg, nuovoId)) === "3ª versione: sostituisce 2 precedenti (l'ultima il " + new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }) + ")", "⛔ il nuovo è la 3ª versione e sostituisce 2 precedenti, con la data di oggi", await versioni(pg, nuovoId) || "(nessuna riga «3ª versione»)");
  dice(((await riga(pg, nuovoId)) || {}).badge === "Valido", "ed è valido", JSON.stringify(await riga(pg, nuovoId)));
  await pg.evaluate((id) => document.querySelector(`[data-doc="${id}"]`)?.scrollIntoView({ block: "center" }), nuovoId);
  await scatta(pg, `${W}-3-sostituito`);

  // 4 · «No, sono due documenti»: restano tutt'e due
  await pg.fill("#doc-titolo", "Nomina preposto reparto frantoio");
  await pg.selectOption("#doc-tipo", "Nomina");
  await pg.click("#btn-doc");
  await pg.waitForTimeout(900);
  dice(await modaleAperto(pg), "una Nomina nuova chiede (in archivio ce n'è una)", await testo(pg, "#modal-title"));
  await pg.click('#modal button:has-text("No, sono due documenti")').catch(() => {});
  await pg.waitForTimeout(700);
  dice(((await riga(pg, "c3")) || {}).badge === "Da rivedere", "⛔ con «No» la nomina di prima resta com'era", JSON.stringify(await riga(pg, "c3")));
  const nNomine = await pg.$$eval("[data-doc] .name", (e) => e.filter((x) => /Nomin/.test(x.textContent)).length);
  dice(nNomine === 2, "e adesso le nomine sono due, tutt'e due in archivio", nNomine);

  // 5 · «Altro» senza impresa: nessuna domanda
  await pg.fill("#doc-titolo", "Planimetria vie di fuga");
  await pg.selectOption("#doc-tipo", "Altro");
  await pg.click("#btn-doc");
  await pg.waitForTimeout(900);
  dice(!(await modaleAperto(pg)), "⛔ un documento «Altro» non chiede niente: due «Altro» non sono versioni l'uno dell'altro", await testo(pg, "#modal-title"));

  // 6 · il DSS conserva la revisione precedente
  await pg.selectOption("#dss-doc", "c4").catch(() => {});
  await pg.selectOption("#dss-motivo", { index: 1 }).catch(() => {});
  await pg.fill("#dss-rev", "2026-01-15");
  await pg.click("#btn-dss");
  await pg.waitForTimeout(900);
  const s1 = await testo(pg, "#dss-esito");
  dice(/Ciclo del DSS aggiornato/.test(s1) && !/resta nello storico/.test(s1), "la prima revisione del DSS non ha niente da conservare", s1.slice(0, 200));
  await pg.selectOption("#dss-doc", "c4").catch(() => {});
  await pg.selectOption("#dss-motivo", { index: 2 }).catch(() => {});
  await pg.fill("#dss-rev", "2026-06-01");
  await pg.click("#btn-dss");
  await pg.waitForTimeout(900);
  const s2 = await testo(pg, "#dss-esito");
  dice(/La revisione precedente \(15\/01\/2026\) resta nello storico\./.test(s2), "⛔ la seconda revisione conserva la prima, e la striscia lo dice", s2.slice(-160));
  const hint = await pg.$$eval("#dss-list .form-hint", (e) => e.map((x) => x.textContent.replace(/\s+/g, " ").trim()).join(" | "));
  dice(/Una revisione precedente: 15\/01\/2026/.test(hint), "e la lista del DSS mostra lo storico", hint.slice(0, 300));
  await pg.evaluate(() => document.getElementById("dss-list")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-4-dss`);

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "la pagina non scorre in orizzontale");
  await pg.close();
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

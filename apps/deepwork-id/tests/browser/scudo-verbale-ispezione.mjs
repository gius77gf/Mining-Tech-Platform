/* SCUDO · IL VERBALE DI ISPEZIONE SU CARTA, PREMUTO (06/09, notte)
   Dal pannello della checklist «Stampa il verbale» apre la finestra che dice
   che cosa ci sarà dentro — le voci senza esito, le non conformità senza
   azione — e poi scrive il foglio in `#verbale` e chiama `window.print()`.
   Qui `window.print` è sostituito da un contatore: si legge il foglio scritto,
   non la stampante. Due ispezioni della dimostrazione: la chiusa con la sua
   non conformità (q1) e quella in corso con sei voci senza esito (q2).
   Controprova: tre difetti per file. Uso: [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8651;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/scudo/scudo-data.js", PAGINA = "apps/scudo/index.html";

const DIFETTI = [
  ["    costruisciVerbaleIspezione(F);\n    document.body.classList.add(\"stampa-verbale\");",
   "    costruisciCartella(cartellaLavoratore(LAV[0], { scadenze: SCA, mansioni: MANS, dpi: DPI, nomine: NOM, documenti: DOC }));   /* difetto rimesso dal banco */\n    document.body.classList.add(\"stampa-verbale\");", PAGINA],
  ["    const es = e && ETI[e.esito] ? ETI[e.esito] : \"**senza esito**\";",
   "    const es = e && ETI[e.esito] ? ETI[e.esito] : \"conforme\";   /* difetto rimesso dal banco */", MODULO],
  ["    nc.length ? \"**\" + conta(nc.length, \"non conformità senza nessuna azione correttiva\", \"non conformità senza nessuna azione correttiva\") + \"**: rilevare senza correggere è il modo in cui la stessa riga torna alla prossima ispezione.\"",
   "    nc.length ? \"Nessuna azione correttiva.\"   /* difetto rimesso dal banco */", MODULO],
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
const SEGNO = join(R, "__scudo-verb-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-verb-${process.pid}`)).text();
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
const foglio = (pg) => pg.$eval("#verbale", (e) => ({
  h2: e.querySelector("h2")?.textContent.trim() || "", sotto: e.querySelector("h2 + div")?.textContent.trim() || "",
  h3: [...e.querySelectorAll("h3")].map((h) => h.textContent.trim()),
  righe: [...e.querySelectorAll("table tr")].map((r) => [...r.cells].map((c) => c.textContent.replace(/\s+/g, " ").trim())),
  grassetti: [...e.querySelectorAll("td:nth-child(2) b")].map((x) => x.textContent.trim()),
  vuoti: [...e.querySelectorAll("div[style*='dashed']")].map((x) => x.textContent.trim()),
  chiusura: [...e.querySelectorAll("div")].map((x) => x.textContent.trim()).find((x) => /^Ispezione |^Questo verbale/.test(x)) || "",
  firme: [...e.querySelectorAll("div[style*='border-top']")].map((x) => x.textContent.trim()),
})).catch(() => null);

for (const W of [390, 320]) {
  console.log(`\n── Scudo a ${W} px ──`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(String(e)));
  pg.setDefaultTimeout(4000);
  await pg.addInitScript(() => { window.__stampe = 0; window.print = () => { window.__stampe++; }; });
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html`);
  await pg.waitForTimeout(1500);
  await pg.click("#nav-isp").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-isp", `navigato davvero nelle Ispezioni (${viste.join(",") || "nessuna"})`, viste);

  // 1 · la chiusa (q1): la finestra prima, poi il foglio
  await pg.click('[data-isp-apri="q1"] .name').catch(() => {});   /* il NOME, non il centro della riga: a 320 il centro cade sulla pastiglia delle azioni, che porta altrove */
  await pg.waitForTimeout(600);
  dice(await pg.$eval("#isp-compila", (e) => getComputedStyle(e).display !== "none").catch(() => false), "la checklist q1 è aperta");
  dice(await pg.$eval("#btn-isp-stampa", (e) => e.offsetParent !== null && e.textContent.trim() === "Stampa il verbale").catch(() => false), "⛔ il pulsante «Stampa il verbale» c'è, nel pannello della checklist");
  await pg.evaluate(() => document.getElementById("btn-isp-stampa")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-pannello`);
  await pg.click("#btn-isp-stampa");
  await pg.waitForTimeout(500);
  dice(await modaleAperto(pg) && /^Verbale — Fronte di cava/.test(await testo(pg, "#modal-title")), "la finestra prima della stampa", await testo(pg, "#modal-title"));
  const corpo1 = await testo(pg, "#modal-body");
  dice(/Ispezione chiusa: 1 non conformità, 1 azione correttiva collegata\./.test(corpo1) && !/dichiara riga per riga/.test(corpo1), "e dice la chiusura del foglio (niente da dichiarare su q1)", corpo1.slice(0, 200));
  await scatta(pg, `${W}-2-finestra`);
  await pg.click('#modal .dw-btn.primary, #modal button.primary').catch(() => {});
  await pg.waitForTimeout(700);
  dice((await pg.evaluate(() => window.__stampe)) === 1, "⛔ window.print() è stato chiamato una volta", await pg.evaluate(() => window.__stampe));
  const f1 = await foglio(pg);
  dice(!!f1 && f1.h2 === "Verbale di ispezione", "⛔ il foglio scritto è il VERBALE DI ISPEZIONE, non un altro foglio", f1 && f1.h2);
  dice(!!f1 && /^Fronte di cava — stabilità e disgaggio · 10\/07\/2026 — documento preparato con Deepwork Scudo il/.test(f1.sotto), "col sottotitolo dell'ispezione", f1 && f1.sotto);
  dice(!!f1 && JSON.stringify(f1.h3) === JSON.stringify(["Ispezione", "Esito complessivo", "Voci della checklist", "Azioni correttive nate da questa ispezione"]), "le quattro sezioni", f1 && JSON.stringify(f1.h3));
  dice(!!f1 && f1.righe.some((r) => r[0] === "Sito" && r[1] === "Cava Monte Alto") && f1.righe.some((r) => r[0] === "Responsabile" && r[1] === "Giulia Verdi (Preposto)"), "sito e responsabile per nome", f1 && JSON.stringify(f1.righe.slice(0, 4)));
  dice(!!f1 && f1.righe.filter((r) => /^\d+\. /.test(r[0])).length === 8, "otto voci", f1 && f1.righe.filter((r) => /^\d+\. /.test(r[0])).length);
  dice(!!f1 && f1.grassetti.includes("NON CONFORME") && f1.righe.some((r) => /^2\. /.test(r[0]) && /^NON CONFORME — Delimitazione rimossa/.test(r[1])), "⛔ la non conformità in grassetto, con la nota", f1 && JSON.stringify(f1.grassetti));
  dice(!!f1 && f1.righe.some((r) => /Delimitare la fascia di rispetto/.test(r[0]) && /Aperta · entro il 09\/08\/2026 · resp\. Giulia Verdi/.test(r[1])), "l'azione nata da q1 con stato, scadenza e responsabile", f1 && JSON.stringify(f1.righe.slice(-2)));
  dice(!!f1 && f1.chiusura === "Ispezione chiusa: 1 non conformità, 1 azione correttiva collegata." && f1.firme.length === 2, "la chiusura e le due firme", f1 && f1.chiusura + " | " + f1.firme.join(" / "));
  dice(await pg.evaluate(() => document.body.classList.contains("stampa-verbale")), "la classe di stampa è addosso al body (la toglie afterprint, che qui non arriva)");
  /* lo scatto del FOGLIO: sullo schermo `#verbale` non c'è, esiste solo in stampa */
  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(200);
  dice(await pg.$eval("#verbale", (e) => e.getBoundingClientRect().height > 200).catch(() => false), "in stampa il foglio è alto più di 200 px: si vede");
  await scatta(pg, `${W}-2b-foglio`);
  await pg.emulateMedia({ media: "screen" });
  await pg.evaluate(() => document.body.classList.remove("stampa-verbale"));

  // 2 · la aperta (q2): le voci senza esito, dichiarate nella finestra e nel foglio
  await pg.click("#btn-isp-indietro").catch(() => {});
  await pg.waitForTimeout(400);
  await pg.click('[data-isp-apri="q2"] .name').catch(() => {});
  await pg.waitForTimeout(600);
  await pg.click("#btn-isp-stampa");
  await pg.waitForTimeout(500);
  const corpo2 = await testo(pg, "#modal-body");
  dice(/⚠️ Ispezione non ancora chiusa: 2 voci compilate su 8\./.test(corpo2) && /riga per riga: 6 voci senza esito\./.test(corpo2), "⛔ la finestra di q2 dichiara le sei voci senza esito PRIMA di stampare", corpo2.slice(0, 260));
  await scatta(pg, `${W}-3-finestra-aperta`);
  await pg.click('#modal .dw-btn.primary, #modal button.primary').catch(() => {});
  await pg.waitForTimeout(700);
  const f2 = await foglio(pg);
  dice(!!f2 && f2.grassetti.filter((g) => g === "senza esito").length === 6 && f2.grassetti.includes("6 senza esito"), "⛔ nel foglio «senza esito» è in grassetto sei volte sulle voci e «6 senza esito» nel riassunto", f2 && JSON.stringify(f2.grassetti));
  dice(!!f2 && f2.vuoti.some((v) => /6 voci sono senza esito: non si può dire che non ce ne fosse bisogno/.test(v)), "e la sezione delle azioni, vuota, non tranquillizza", f2 && JSON.stringify(f2.vuoti));
  dice(!!f2 && /^Ispezione non ancora chiusa: 2 voci compilate su 8\./.test(f2.chiusura), "la chiusura dice «avanzamento», non «verbale»", f2 && f2.chiusura);
  dice((await pg.evaluate(() => window.__stampe)) === 2, "seconda stampa", await pg.evaluate(() => window.__stampe));
  await pg.evaluate(() => document.body.classList.remove("stampa-verbale"));

  // 3 · q1 senza la sua azione: la sezione vuota è rossa (si toglie l'azione dallo stato, in memoria)
  await pg.click("#btn-isp-indietro").catch(() => {});
  await pg.waitForTimeout(300);
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

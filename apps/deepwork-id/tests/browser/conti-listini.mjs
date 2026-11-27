/* CONTI · I LISTINI PER CLIENTE, PREMUTI (10/09)
   Nella dimostrazione Stradesud porta il listino «Cantieri stradali» (pietrisco
   a 11,50 invece di 12,00). Il banco digita una pesata per Stradesud e pretende
   che il riepilogo dica «Prezzo del listino «Cantieri stradali»» col prezzo del
   listino E il listino base accanto; che la sezione «Listini per cliente»
   elenchi il listino con la sua descrizione e il cliente; che la scheda cliente
   abbia la tendina; che il CSV letto dal gancio dell'ancora porti una riga per
   prodotto con prezzo proprio (due), col listino base accanto.
   Controprova: tre difetti per file (la pagina che ignora i listini, il modulo
   che applica il nome ma non il prezzo, il CSV che salta le righe giuste).
   Uso: [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8693;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/conti/conti-data.js", PAGINA = "apps/conti/index.html";

const DIFETTI = [
  ["    const pc = p ? prodottoPerCliente(p, cliAnt, LIS) : null;",
   "    const pc = p ? prodottoPerCliente(p, cliAnt, []) : null;   /* difetto rimesso dal banco */", PAGINA],
  ["  return { ...base, prezzo: round2(n),",
   "  return { ...base, prezzo: round2(+p.prezzo || 0),   /* difetto rimesso dal banco */", MODULO],
  ["      if (!pc.listinoApplicato) continue;",
   "      if (pc.listinoApplicato) continue;   /* difetto rimesso dal banco */", MODULO],
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
const SEGNO = join(R, "__conti-lst-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__conti-lst-${process.pid}`)).text();
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
const visto = (pg, sel) => pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));

for (const W of [430, 320]) {
  console.log(`\n── Conti a ${W} px ──`);
  const pg = await b.newPage({ viewport: { width: W, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(String(e)));
  pg.setDefaultTimeout(4000);
  await pg.addInitScript(() => {
    window.__scaricati = [];
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
      return orig.apply(this, arguments);
    };
  });
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html`);
  await pg.waitForTimeout(1500);

  // 1 · la pesata di Stradesud vede il SUO prezzo
  await pg.click("#nav-pes").catch(() => {});
  await pg.waitForTimeout(600);
  let viste = await visto(pg);
  dice(viste.length === 1 && viste[0] === "page-pes", `navigato davvero nelle Pesate (${viste.join(",") || "nessuna"})`, viste);
  await pg.selectOption("#pes-cli", "c2").catch(() => {});
  await pg.selectOption("#pes-prod", "p2").catch(() => {});
  await pg.fill("#pes-lordo", "30");
  await pg.fill("#pes-tara", "10");
  await pg.waitForTimeout(400);
  const riep = await testo(pg, "#pes-riep");
  dice(/Netto\s*20(,00)? t/.test(riep), "il netto è 20 t (30 − 10)", riep);
  dice(/Prezzo del listino «Cantieri stradali»\s*€ 11,50\/t/.test(riep), "⛔ il riepilogo dice «Prezzo del listino «Cantieri stradali»» a 11,50 €/t, non il listino base", riep);
  dice(/Listino base\s*€ 12,00\/t/.test(riep), "⛔ e il listino base (12,00) resta scritto accanto: chi guarda vede quanto si discostano", riep);
  dice(/Valore della consegna\s*€ 230,00/.test(riep), "il valore della consegna è 20 t × 11,50 = 230,00 (Stradesud non ha sconto)", riep);
  await pg.evaluate(() => document.getElementById("pes-riep")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-pesata`);
  // un cliente SENZA listino resta al listino base, con la dicitura di sempre
  await pg.selectOption("#pes-cli", "c1").catch(() => {});
  await pg.waitForTimeout(400);
  const riepBase = await testo(pg, "#pes-riep");
  dice(!/Prezzo del listino «/.test(riepBase) && /listino|concordato/i.test(riepBase), "per Edilcave (senza listino proprio) non compare nessun «Prezzo del listino «…»»", riepBase);

  // 2 · la sezione dei listini
  await pg.click("#nav-lis").catch(() => {});
  await pg.waitForTimeout(600);
  viste = await visto(pg);
  dice(viste.length === 1 && viste[0] === "page-lis", `navigato davvero nel Listino (${viste.join(",") || "nessuna"})`, viste);
  dice((await testo(pg, "#lst-cnt")) === "1", "il contatore dei listini dice 1 (non «—», non 0)", await testo(pg, "#lst-cnt"));
  const riga = await testo(pg, "#lst-list");
  dice(/Cantieri stradali/.test(riga) && /2 prodotti su 5 con un prezzo proprio · 1 cliente · Stradesud/.test(riga), "la riga del listino: nome, «2 prodotti su 5 con un prezzo proprio · 1 cliente · Stradesud»", riga);
  const colonne = await pg.$$eval("#lst-prezzi input[data-lst-prezzo]", (e) => e.map((x) => x.dataset.lstPrezzo));
  dice(colonne.length === 5, "la scheda del listino ha un campo per ognuno dei 5 prodotti", colonne.join(","));
  await pg.evaluate(() => document.getElementById("lst-list")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-2-listini`);

  // 3 · il CSV
  await pg.click("#btn-lst-csv").catch(() => {});
  await pg.waitForTimeout(500);
  const sc = await pg.evaluate(() => window.__scaricati);
  dice(sc.length === 1 && /conti_listini_clienti\.csv$/.test(sc[0].nome), "il file esce, col nome dei listini (e il marchio della dimostrazione davanti)", JSON.stringify(sc.map((s) => s.nome)));
  const csv = sc.length ? decodeURIComponent(sc[0].href.replace(/^data:text\/csv;charset=utf-8,/, "")) : "";
  const righe = csv.split("\n").filter((r) => r && !/^#/.test(r));
  dice(righe[0] === "listino;prodotto;unita_prezzo;prezzo_listino_base;prezzo_del_listino", "l'intestazione", righe[0]);
  dice(righe.length === 3, "⛔ due righe: solo i prodotti CON un prezzo proprio (gli altri valgono il base e non si ridicono)", righe.length - 1);
  dice(righe.includes("Cantieri stradali;Stabilizzato 0/30;t;8.5;8"), "lo stabilizzato: base 8,50 → 8,00 (col punto, come il CSV del listino base)", righe[1]);
  dice(righe.includes("Cantieri stradali;Pietrisco 8/12;t;12;11.5"), "il pietrisco: base 12,00 → 11,50", righe[2]);
  const es = await testo(pg, "#lst-esito");
  dice(/^Esportat[oi] 1 listino: 2 prezzi propri, col listino base accanto\.$/.test(es), "la striscia dice quanti listini e quanti prezzi propri", es || "(vuota)");

  // 4 · la scheda cliente ha la tendina
  await pg.click("#nav-cli").catch(() => {});
  await pg.waitForTimeout(600);
  const opz = await pg.$$eval("#cl-listino option", (e) => e.map((o) => o.textContent.trim()));
  dice(opz.length === 2 && /listino base/.test(opz[0]) && opz[1] === "Cantieri stradali", "la tendina «Listino» della scheda cliente: il base e «Cantieri stradali»", opz.join(" | "));

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

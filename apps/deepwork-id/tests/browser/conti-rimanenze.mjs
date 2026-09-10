/* CONTI · LE RIMANENZE DI PIAZZALE PER IL COMMERCIALISTA, PREMUTE (10/09)
   Nella schermata dei Report, sotto le scorte misurate, il riquadro che
   valorizza A LISTINO l'ultimo inventario dei cumuli di Terra: la frase con
   «NON è il valore fiscale», la tabella cumulo per cumulo, il cumulo non
   misurato FUORI dal totale con la ragione (non a zero), la variazione
   dell'anno che dice perché non si può dire, e il CSV che esce dallo stesso
   conto. Controprova: tre difetti per file. Uso: [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8671;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/conti/conti-data.js", PAGINA = "apps/conti/index.html";

const DIFETTI = [
  ["    const p = prospettoRimanenze(INV, PRO);",
   "    const p = prospettoRimanenze([], PRO);   /* difetto rimesso dal banco */", PAGINA],
  ["    if (m3 == null) perche = \"volume non leggibile\";",
   "    if (m3 == null) perche = \"\";   /* difetto rimesso dal banco */", MODULO],
  ["${num(r.valore)};${r.valore == null ? \"no\" : \"si\"};${csvCell(r.perche)}",
   "${num(r.valore)};si;${csvCell(r.perche)}", MODULO],
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
const SEGNO = join(R, "__conti-rim-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__conti-rim-${process.pid}`)).text();
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
  await pg.click("#nav-rep").catch(() => {});
  await pg.waitForTimeout(1500);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-rep", `navigato davvero nei Report (${viste.join(",") || "nessuna"})`, viste);
  /* la precondizione: gli inventari di Terra devono essere ARRIVATI, se no il
     riquadro è vuoto di proposito e non c'è niente da misurare */
  let t0 = "";
  for (let i = 0; i < 20 && !t0; i++) { t0 = await testo(pg, "#ric-rimanenze"); if (!t0) await pg.waitForTimeout(300); }
  dice(!!t0, "gli inventari di Terra sono arrivati e il riquadro delle rimanenze è scritto (se no il resto NON è misurato)");

  dice(/^Rimanenze di piazzale · Rimanenze al 30\/08\/2026 \(una stima, non un rilievo\): 3 cumuli per 314 m³, 2 su 3 valorizzati a listino per 5\.189,50 €/.test(t0), "⛔ la frase: l'ultimo inventario, che è una stima, 2 cumuli su 3 valorizzati", t0.slice(0, 200));
  dice(/fuori dal valore: Sabbia lavata 0\/4 \(volume non leggibile\)/.test(t0), "⛔ il cumulo non misurato è FUORI, con la ragione, non a zero", t0.slice(100, 320));
  dice(/NON è il valore fiscale delle rimanenze/.test(t0) && /lo decide il commercialista/.test(t0), "e la frase di onestà: non è il valore fiscale", t0.slice(200, 420));
  const righe = await pg.$$eval("#ric-rimanenze tbody tr", (e) => e.map((r) => [...r.cells].map((c) => c.textContent.replace(/\s+/g, " ").trim())));
  dice(righe.length === 3, "tre righe, una per cumulo", righe.length);
  const sab = righe.find((r) => /Sabbia/.test(r[0]));
  dice(!!sab && sab[1] === "—" && sab[2] === "—" && sab[4] === "fuori" && /volume non leggibile/.test(sab[0]), "⛔ la riga della sabbia: trattini dove non c'è la misura, la pastiglia «fuori» e la ragione sotto il nome", JSON.stringify(sab));
  const stab = righe.find((r) => /Stabilizzato/.test(r[0]));
  dice(!!stab && /^250/.test(stab[1]) && /^475/.test(stab[2]) && /8,50/.test(stab[3]) && /4\.037,50/.test(stab[4]), "lo stabilizzato: 250 m³ → 475 t × 8,50 €/t = 4.037,50 €", JSON.stringify(stab));
  const piede = await testo(pg, "#ric-rimanenze tfoot");
  dice(/Totale \(2 su 3\)/.test(piede) && /5\.189,50/.test(piede), "il piede dice «2 su 3» e il totale dei soli valorizzati", piede);
  const var_ = await testo(pg, "#rim-variazione");
  dice(/^Variazione delle rimanenze \d{4}: non si può dire \(i due inventari non valorizzano gli stessi materiali\)\.$/.test(var_), "⛔ la variazione dell'anno DICE perché non si può dire, invece di una cifra", var_);
  await pg.evaluate(() => document.getElementById("ric-rimanenze")?.scrollIntoView({ block: "start" }));
  await scatta(pg, `${W}-1-rimanenze`);

  await pg.click("#btn-rimanenze-csv").catch(() => {});
  await pg.waitForTimeout(600);
  const sc = await pg.evaluate(() => window.__scaricati);
  dice(sc.length === 1 && /conti_rimanenze_piazzale_2026-08-30\.csv$/.test(sc[0].nome), "il CSV esce col nome che porta la data dell'inventario (nella dimostrazione col marchio davanti)", JSON.stringify(sc.map((s) => s.nome)));
  const csv = sc.length ? decodeURIComponent(sc[0].href.replace(/^data:text\/csv;charset=utf-8,/, "")) : "";
  const righeCsv = csv.split("\n").filter((r) => r && !/^#/.test(r));
  dice(righeCsv[0] === "inventario;data;metodo;materiale;prodotto_listino;volume_m3;densita_t_m3;tonnellate;prezzo_listino;unita_prezzo;valore_listino;nel_totale;perche", "l'intestazione del CSV", righeCsv[0]);
  dice(righeCsv.some((r) => /^i3;2026-08-30;stima;Sabbia lavata 0\/4;Sabbia lavata 0\/4;;1\.6;;22;m3;;no;volume non leggibile$/.test(r)), "⛔ nel CSV la sabbia ha «no» e la ragione, non uno zero", righeCsv.find((r) => /Sabbia/.test(r)));
  dice(righeCsv.some((r) => /^i3;2026-08-30;stima;Stabilizzato 0\/30;Stabilizzato 0\/30;250;1\.9;475;8\.5;t;4037\.5;si;$/.test(r)), "e lo stabilizzato ha «si» col suo valore", righeCsv.find((r) => /Stabil/.test(r)));
  const toastT = await testo(pg, "#toast");
  dice(/Rimanenze al 30\/08\/2026 esportate: valore a listino, non fiscale\./.test(toastT), "il toast ripete che è a listino, non fiscale", toastT);

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

/* CONTI · IL REGISTRO DELLE VENDITE PER IL COMMERCIALISTA, PREMUTO (10/09)
   Nei Report il bottone «Registro vendite (CSV)»: il file letto dal gancio
   dell'ancora — l'intestazione, una riga per fattura della dimostrazione
   (tutte senza IVA dichiarata: aliquota e imposta VUOTE, non zero), la
   partita IVA e il codice destinatario dall'anagrafica, il marchio della
   dimostrazione nel nome, la striscia che dice quanti sono senza IVA.
   Controprova: tre difetti per file. Uso: [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8681;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/conti/conti-data.js", PAGINA = "apps/conti/index.html";

const DIFETTI = [
  ["    const csv = csvRegistroVendite(FAT, CLI, NOT);",
   "    const csv = csvRegistroVendite(FAT, [], NOT);   /* difetto rimesso dal banco */", PAGINA],
  ["    if (!bande.length) righe.push({ ...base, aliquota: null, imponibile: round2(segno * im.imponibile), imposta: null, senzaIva: true });",
   "    if (!bande.length) righe.push({ ...base, aliquota: 0, imponibile: round2(segno * im.imponibile), imposta: 0, senzaIva: true });   /* difetto rimesso dal banco */", MODULO],
  ["  if (x.senzaIva) s += \"; \" + x.senzaIva + (x.senzaIva === 1 ? \" senza IVA dichiarata (aliquota e imposta vuote, non zero)\" : \" senza IVA dichiarata (aliquota e imposta vuote, non zero)\");",
   "  /* difetto rimesso dal banco */", MODULO],
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
const SEGNO = join(R, "__conti-regv-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__conti-regv-${process.pid}`)).text();
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
  await pg.waitForTimeout(800);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-rep", `navigato davvero nei Report (${viste.join(",") || "nessuna"})`, viste);
  dice(await pg.$eval("#btn-rep-vendite", (e) => e.offsetParent !== null && /Registro vendite/.test(e.textContent)).catch(() => false), "il bottone «Registro vendite (CSV)» c'è ed è visibile");
  await pg.evaluate(() => document.getElementById("btn-rep-vendite")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-bottone`);
  await pg.click("#btn-rep-vendite").catch(() => {});
  await pg.waitForTimeout(600);
  const sc = await pg.evaluate(() => window.__scaricati);
  dice(sc.length === 1 && /conti_registro_vendite\.csv$/.test(sc[0].nome), "il file esce, col nome del registro (e il marchio della dimostrazione davanti)", JSON.stringify(sc.map((s) => s.nome)));
  const csv = sc.length ? decodeURIComponent(sc[0].href.replace(/^data:text\/csv;charset=utf-8,/, "")) : "";
  const righe = csv.split("\n").filter((r) => r && !/^#/.test(r));
  dice(righe[0] === "tipo;numero;data;cliente;partita_iva;codice_fiscale;codice_destinatario;aliquota;imponibile;imposta;totale_documento;riferimento;nel_periodo", "l'intestazione", righe[0]);
  dice(righe.length >= 8, "una riga per fattura della dimostrazione (almeno sette)", righe.length - 1);
  const edil = righe.find((r) => /^fattura;2026\/031;2026-06-07;Edilcave Srl;01234567890;;ABC1234;;18300;;18300;;si$/.test(r));
  dice(!!edil, "⛔ la fattura di Edilcave porta partita IVA e codice destinatario dall'anagrafica, e aliquota e imposta VUOTE (non zero)", righe.find((r) => /2026\/031/.test(r)));
  dice(righe.slice(1).every((r) => { const c = r.split(";"); return c[7] === "" && c[9] === ""; }), "⛔ su TUTTE le righe della dimostrazione aliquota e imposta restano vuote: nessuna fattura dichiara l'IVA", righe.slice(1).find((r) => { const c = r.split(";"); return c[7] !== "" || c[9] !== ""; }));
  const date = righe.slice(1).map((r) => r.split(";")[2]);
  dice(date.slice().sort().join() === date.join(), "in ordine di data", date.join(" "));
  const es = await testo(pg, "#rep-esito");
  dice(/^Registro vendite esportato: \d+ documenti nel registro, una riga per aliquota; \d+ senza IVA dichiarata \(aliquota e imposta vuote, non zero\)\.$/.test(es), "⛔ la striscia dice quanti documenti e quanti senza IVA dichiarata", es || "(vuota)");
  await scatta(pg, `${W}-2-esito`);

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

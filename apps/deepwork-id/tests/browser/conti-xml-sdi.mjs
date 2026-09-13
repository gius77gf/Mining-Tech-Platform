/* IL FILE XML PER LO SDI ESCE DALLA FATTURA — E SI APRE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-xml-sdi.mjs [--scatti]
     node conti-xml-sdi.mjs --controprova     (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal 02/09 ogni fattura di Conti ha il bottone «XML per lo
   SdI». Due cose vanno misurate DOVE succedono, cioè nella pagina servita:
   · con una fattura PRONTA (la differita di Edilcave, montata dal banco nei
     dati serviti a partire dai DDT della dimostrazione) il file esce, e il
     banco lo APRE: le righe di dettaglio sono quelle della fattura, i DDT
     citati sono quelli con la data, il totale è quello registrato, il nome
     è IT<piva>_<progressivo>.xml;
   · con una fattura NON pronta (una di quelle vecchie, a solo importo) il
     file NON esce, e la modale nomina ciò che manca col posto dove scriverlo.
   La controprova rimette nella pagina il difetto più comodo — scaricare lo
   stesso — e pretende che il secondo verso cada.
   ⚠️ Il banco cattura i download intercettando `a.click()` (come
   `conti-documenti-che-escono`), e si lancia SENZA le variabili del proxy:
   col proxy Chromium aspetta 12,7 s l'import di Firebase e la pagina è vuota. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = "/tmp/conti-xml-sdi";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: una fattura differita di Edilcave costruita DAI DDT della
   dimostrazione, con la stessa funzione del prodotto. Non si scrive a mano
   (righe, totali) perché il banco non deve avere una seconda copia del conto. */
const CASI = `
/* ── caso montato dal banco conti-xml-sdi.mjs (mai sul disco) ── */
{ const ddt = DEMO.pesate.filter((p) => p.clienteId === "c1" && p.unitaVendita === "t" && p.prezzoUnitario != null);
  const fd = fatturaDaPesate(ddt);
  DEMO.fatture.push({ id: "zx1", numero: "2026/090", cliente: "Edilcave Srl", clienteId: "c1", emessa: "2026-08-31",
    scadenza: "2026-09-30", tipo: "differita", incassata: false, importo: fd.imponibile, ...fd }); }
`;
const DIFETTI = [
  ["apps/conti/index.html",
   "      if (!r.pronto) {\n        apriModale(\"Il file XML non è ancora pronto\",",
   "      if (false) {   /* difetto rimesso dal banco: si scarica lo stesso */\n        apriModale(\"Il file XML non è ancora pronto\","],
];
let iniezioniCasi = 0, difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  const rel = p.slice(R.length + 1);
  if (rel === "apps/conti/conti-data.js") { corpo = Buffer.from(corpo.toString("utf8") + CASI, "utf8"); iniezioniCasi++; }
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (file !== rel) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
if ((await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text())) !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

/* l'atteso lo dice il MODULO, importato da node sugli stessi dati */
const mod = await import(join(R, "apps/conti/conti-data.js"));
const ddtAttesi = mod.DEMO.pesate.filter((p) => p.clienteId === "c1" && p.unitaVendita === "t" && p.prezzoUnitario != null);
const fdAttesa = mod.fatturaDaPesate(ddtAttesi);

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript(() => {
  window.__scaricati = [];
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
});
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
for (let i = 0; i < 80; i++) { await pg.waitForTimeout(250); if (await pg.evaluate(() => (document.getElementById("cos-riep")?.innerHTML.length || 0) > 0)) break; }

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 2));
dice(iniezioniCasi > 0, `il caso è stato servito (${iniezioniCasi} volte)`);
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);

await pg.click("#nav-fat"); await pg.waitForTimeout(600);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-fat"), "sono sulla schermata Fatture", vive);
// mostro tutte le fatture, se c'è un filtro
await pg.evaluate(() => { const f = document.querySelector('[data-filtro-fat="tutte"], #fat-filtro-tutte'); if (f) f.click(); });
await pg.waitForTimeout(300);

// ══ 1 · la fattura PRONTA: il file esce e si apre ═══════════════════════
const bottone = await pg.$('[data-xml-fat="zx1"]');
dice(!!bottone, "la fattura montata dal banco ha il bottone XML");
if (bottone) {
  await bottone.scrollIntoViewIfNeeded(); await bottone.click({ timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(500);
  const usciti = await pg.evaluate(() => window.__scaricati.slice());
  dice(usciti.length === 1, "è uscito UN file", usciti.map((u) => u.nome));
  if (usciti.length === 1) {
    const u = usciti[0];
    // in dimostrazione il nome porta davanti il marchio dei file d'esempio, come i CSV
    dice(/IT\d{11}_[A-Za-z0-9]{1,5}\.xml$/.test(u.nome), "il nome finisce con IT<piva>_<progressivo>.xml", u.nome);
    dice(!/^IT\d{11}_/.test(u.nome), "e in modalità dimostrativa porta davanti il marchio dei file d'esempio", u.nome);
    const xml = decodeURIComponent(u.href.split(",").slice(1).join(","));
    dice(/^<\?xml version="1.0" encoding="UTF-8"\?>/.test(xml) && /versione="FPR12"/.test(xml), "il file comincia con la dichiarazione ed è un FPR12", xml.slice(0, 120));
    const linee = (xml.match(/<DettaglioLinee>/g) || []).length, ddt = (xml.match(/<DatiDDT>/g) || []).length;
    dice(linee === fdAttesa.righe.length, `le righe di dettaglio sono quelle della fattura (${linee} su ${fdAttesa.righe.length})`);
    dice(ddt === ddtAttesi.filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(String(p.data || ""))).length, `i DDT citati sono quelli con la data (${ddt})`);
    const tot = (xml.match(/<ImportoTotaleDocumento>([\d.]+)</) || [])[1];
    dice(tot === fdAttesa.totale.toFixed(2), "il totale documento è quello registrato", [tot, fdAttesa.totale]);
    const esito = await pg.evaluate(() => (document.getElementById("ft-esito") || {}).innerText || "");
    dice(/scaricato/.test(esito) && /Agenzia delle Entrate/.test(esito), "l'esito dice che è uscito e porta la riga di onestà", esito.slice(0, 200));
    if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.screenshot({ path: join(OUT, "pronta.png") }); }
  }
}

// ══ 2 · la fattura NON pronta: niente file, e i mancanti nominati ═══════
const prima = await pg.evaluate(() => window.__scaricati.length);
const vecchia = await pg.$('[data-xml-fat="f1"]');
dice(!!vecchia, "la fattura vecchia della dimostrazione ha il bottone XML");
if (vecchia) {
  await vecchia.scrollIntoViewIfNeeded(); await vecchia.click({ timeout: 3000 }).catch(() => {}); await pg.waitForTimeout(500);
  const dopo = await pg.evaluate(() => window.__scaricati.length);
  dice(dopo === prima, "con un dato mancante NON esce nessun file", [prima, dopo]);
  const modale = await pg.evaluate(() => ({ aperta: document.getElementById("modal")?.classList.contains("show"), titolo: document.getElementById("modal-title")?.textContent, corpo: (document.getElementById("modal-body")?.innerText || "").replace(/\s+/g, " ") }));
  dice(modale.aperta && /non è ancora pronto/.test(modale.titolo), "la modale dice che il file non è pronto", modale.titolo);
  dice(/solo importo/.test(modale.corpo), "e nomina la ragione (fattura vecchia a solo importo)", modale.corpo.slice(0, 200));
  dice(/Dati della tua azienda|Clienti/.test(modale.corpo) && /Agenzia delle Entrate/.test(modale.corpo), "col posto dove scrivere i dati e la riga di onestà", modale.corpo.slice(-260));
  if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.screenshot({ path: join(OUT, "non-pronta.png") }); }
}
await b.close(); srv.close();
console.log(`\nRisultato XML per lo SdI: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

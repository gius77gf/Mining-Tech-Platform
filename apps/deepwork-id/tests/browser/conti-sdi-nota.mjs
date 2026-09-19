/* CONTI: LA NOTA SULL'ESITO SdI ERA LETTA E MOSTRATA, MAI SCRIVIBILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-sdi-nota.mjs                 (porta effimera)
     node conti-sdi-nota.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. `statoSdi()` (conti-data.js) legge `fattura.sdi.nota` da
   mesi e la scrive dentro il testo esplicativo di scartata/mancata-consegna
   ("... · " + nota) — ma il form di Conti scriveva `nota: ""` a mano, senza
   nessun campo da cui prenderla: un dato che il modello sa raccontare e che
   nessuna schermata può mai produrre. Verificato leggendo il codice prima
   di correggere: `grep -n 'nota:' apps/conti/index.html` dava una sola
   occorrenza, `nota: ""`, prima di questa unità.
   In più, `statoSdi().testo` — il testo completo con la spiegazione e la
   nota — non compariva in NESSUN punto della pagina: solo `.breve`,
   l'etichetta corta della pastiglia rossa. Corretto aggiungendo un campo
   "Nota sull'esito" al form e il testo completo come `title` della
   pastiglia (il badge rosso «scartata: come non emessa» ecc.). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, come stavano prima del 19/09. */
const DIFETTI = [
  ["apps/conti/index.html",
   `sdi: $("ft-sdi").value ? { stato: $("ft-sdi").value, il: $("ft-sdi-il").value || null, nota: $("ft-sdi-nota").value.trim() } : null };`,
   `sdi: $("ft-sdi").value ? { stato: $("ft-sdi").value, il: $("ft-sdi-il").value || null, nota: "" } : null };`],
  ["apps/conti/index.html",
   `style="margin-right:6px;" title="' + esc(statoSdi(f).testo) + '">`,
   `style="margin-right:6px;">`],
];
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("fat-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Conti è pronta (in dimostrazione)");
await vaiA(pg, "conti", "nav-fat");

/* ── si emette una fattura con esito «scartata» e una nota, e la nota si ritrova ── */
await pg.fill("#ft-num", "2099/997");
await pg.selectOption("#ft-cli", { index: 1 });
await pg.fill("#ft-imp", "1.200,00");
await pg.fill("#ft-scad", "2027-01-31");
await pg.selectOption("#ft-sdi", "scartata");
await pg.fill("#ft-sdi-il", "2027-01-05");
await pg.fill("#ft-sdi-nota", "00404 - Codice fiscale del cliente non valido");
await pg.click("#btn-ft");
await pg.waitForTimeout(500);

const idNuova = await pg.evaluate(() => {
  const el = [...document.querySelectorAll("#fat-list .num-doc")].find((e) => e.textContent.includes("2099/997"));
  return el ? el.closest("[data-fat]")?.getAttribute("data-fat") : null;
});
dice(!!idNuova, "la fattura scartata compare nell'elenco", idNuova);

const titoloBadge = await pg.evaluate((id) => {
  const riga = document.querySelector(`[data-fat="${id}"]`);
  const badge = riga && riga.querySelector(".badge.danger");
  return badge ? badge.getAttribute("title") : null;
}, idNuova);
dice(!!titoloBadge, "⛔ la pastiglia rossa porta un title con il testo completo (prima non c'era)", titoloBadge);
dice(!!titoloBadge && titoloBadge.includes("00404 - Codice fiscale del cliente non valido"),
  "⛔ e il title contiene la nota scritta nel form, non solo l'etichetta corta", titoloBadge);
dice(!!titoloBadge && /circolare 13\/E\/2018/.test(titoloBadge || ""),
  "   e la spiegazione completa (la circolare, i cinque giorni) è quella vera, non un frammento", titoloBadge);

/* ── riaprendo la fattura in modifica, la nota torna nel campo ── */
await pg.evaluate((id) => { const m = document.querySelector(`[data-edit-fat="${id}"]`); if (m) m.click(); }, idNuova);
await pg.waitForTimeout(250);
const notaRiletta = await pg.evaluate(() => document.getElementById("ft-sdi-nota").value);
dice(notaRiletta === "00404 - Codice fiscale del cliente non valido",
  "⛔ riaprendo la fattura la nota torna nel campo, non resta vuota", notaRiletta);

/* ── senza nota, il campo resta vuoto e il title non la nomina ── */
await pg.evaluate(() => { const b2 = document.getElementById("btn-ft"); if (b2 && b2.textContent === "Salva modifica") { /* annulla l'editing corrente pulendo a mano, senza toccare la fattura */ } });
await pg.reload();
for (let i = 0; i < 80; i++) { await pg.waitForTimeout(250); if (await pg.evaluate(() => (document.getElementById("fat-list")?.innerHTML.length || 0) > 0)) break; }
await vaiA(pg, "conti", "nav-fat");
await pg.fill("#ft-num", "2099/996");
await pg.selectOption("#ft-cli", { index: 1 });
await pg.fill("#ft-imp", "300,00");
await pg.fill("#ft-scad", "2027-02-10");
await pg.selectOption("#ft-sdi", "mancata-consegna");
await pg.click("#btn-ft");
await pg.waitForTimeout(500);
const idSenzaNota = await pg.evaluate(() => {
  const el = [...document.querySelectorAll("#fat-list .num-doc")].find((e) => e.textContent.includes("2099/996"));
  return el ? el.closest("[data-fat]")?.getAttribute("data-fat") : null;
});
const notaVuota = await pg.evaluate((id) => {
  const riga = document.querySelector(`[data-fat="${id}"]`);
  const badge = riga && riga.querySelector(".badge.warn, .badge.danger");
  return { titolo: badge ? badge.getAttribute("title") : null };
}, idSenzaNota);
dice(!notaVuota.titolo || !/·\s*$/.test(notaVuota.titolo), "senza nota il testo non finisce con un separatore vuoto", notaVuota.titolo);

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

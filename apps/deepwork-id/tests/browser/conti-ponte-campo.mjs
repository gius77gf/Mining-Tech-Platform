/* IL PONTE CAMPO→CONTI NEL REPORT: PRODOTTO DAI TURNI CONTRO PESATO IN USCITA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-ponte-campo.mjs                    (dimostrazione: Campo risponde)
     node conti-ponte-campo.mjs --campo-assente    (il modulo servito risponde null)
     node conti-ponte-campo.mjs --controprova      (rimette il difetto: DEVE fallire)
     node conti-ponte-campo.mjs --larghezza=320 --tema=light --scatti

   PERCHÉ ESISTE. Dal 02/09 la schermata Report di Conti ha il terzo lato del
   triangolo Terra/Campo/Conti: quello che i turni di Campo DICHIARANO di aver
   prodotto (tonnellate, a occhio) contro quello che la pesa ha VENDUTO nello
   stesso periodo (`confrontoProdottoVenduto`, in shared/). Ha tre esiti che il
   banco guarda dove si formano, cioè nella pagina servita:
   · Campo risponde → due colonne, il verso detto a parole, la coda che dichiara
     per nome quello che NON è entrato (il rapportino senza data, il turno che
     non ha dichiarato la quantità);
   · Campo NON risponde → nota in tono avviso e NESSUNA tonnellata attribuita a
     Campo. Uno «0 t prodotte» sarebbe letto come «la cava è ferma»;
   · e il lato Campo NON dipende da Terra: si disegna anche quando il confronto
     cavato/venduto è fermo (qui la dimostrazione ha Terra, quindi il banco
     verifica solo che il riquadro stia in piedi da solo, prima di quello).
   La controprova rimette il difetto più facile da scrivere — la pagina che
   traduce il `null` di Campo in una lista vuota — e pretende che il verso
   «Campo assente» cada: con quel difetto la nota direbbe «nessun turno ha
   dichiarato una produzione», con la faccia tranquilla.
   ⚠️ L'import di Firebase da gstatic si taglia subito (come fa giro.mjs). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const ASSENTE = process.argv.includes("--campo-assente") || CONTROPROVA;
const SCATTI = process.argv.includes("--scatti");
const TEMA = (process.argv.find((a) => a.startsWith("--tema=")) || "").split("=")[1] || "";
const LARG = Number((process.argv.find((a) => a.startsWith("--larghezza=")) || "").split("=")[1]) || 430;
const OUT = "/tmp/conti-ponte-campo";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const CERCA = "rapportiniCampo: async () => mem.rapportiniCampo || []";
let iniettato = 0;
/* IL DIFETTO DA RIMETTERE, con il file che lo porta: la pagina che traduce il
   «non ho risposta» di Campo in «Campo non ha rapportini». */
const DIFETTI = [
  ["apps/conti/index.html",
   "try { RAPC = db.rapportiniCampo ? await db.rapportiniCampo() : null; } catch (e) { RAPC = null; }",
   "try { RAPC = (db.rapportiniCampo ? await db.rapportiniCampo() : null) || []; } catch (e) { RAPC = []; }   /* difetto rimesso dal banco */"],
];
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (ASSENTE && p.endsWith("apps/conti/conti-data.js")) {
    const t = corpo.toString("utf8");
    const n = t.split(CERCA).length - 1;
    if (n !== 1) { console.error(`✗ iniezione mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA, "rapportiniCampo: async () => null"), "utf8"); iniettato++;
  }
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: LARG, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
let datiDopo = null; const t0 = Date.now();
for (let i = 0; i < 80 && datiDopo === null; i++) { await pg.waitForTimeout(250);
  if (await pg.evaluate(() => (document.getElementById("cos-riep")?.innerHTML.length || 0) > 0)) datiDopo = Date.now() - t0; }
console.log("  dati dimostrativi arrivati dopo ms:", datiDopo);

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 500) : ""}`); } };

if (TEMA) await pg.evaluate((c) => document.body.classList.add(c), TEMA + "-mode");
await pg.click("#nav-rep");
// aspetto che il riquadro abbia finito di chiedere a Campo
let box = null;
for (let i = 0; i < 40 && !box; i++) {
  await pg.waitForTimeout(200);
  box = await pg.evaluate(() => {
    const n = document.getElementById("ric-campo");
    if (!n || !n.innerHTML || /Sto chiedendo/.test(n.textContent)) return null;
    const conf = n.querySelector(".conf");
    const note = [...n.querySelectorAll(".note")].map((e) => ({ testo: e.textContent.replace(/\s+/g, " ").trim(), warn: e.classList.contains("warn") }));
    const col = (sel) => { const e = n.querySelector(sel); return e ? e.textContent.replace(/\s+/g, " ").trim() : null; };
    const numero = (sel) => { const e = n.querySelector(sel); return e ? e.getBoundingClientRect() : null; };
    return { testo: n.textContent.replace(/\s+/g, " ").trim(), note,
      conf: conf ? { sinistra: col(".conf-c:not(.sup) .conf-n"), destra: col(".conf-c.sup .conf-n"),
        etiSx: col(".conf-c:not(.sup) .conf-l"), etiDx: col(".conf-c.sup .conf-l"),
        sxRect: numero(".conf-c:not(.sup) .conf-n"), dxRect: numero(".conf-c.sup .conf-n") } : null,
      paginaScroll: document.documentElement.scrollWidth, paginaClient: document.documentElement.clientWidth,
      pagina: [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id),
      /* e il lato Terra NON deve essere stato spento dal lato Campo: il
         confronto cavato/venduto sta sopra e ha il suo riepilogo */
      terraSopra: (document.getElementById("ric-riep")?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80) };
  });
}
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(!!box, "il riquadro «prodotto contro venduto» è comparso e ha finito di chiedere a Campo");
if (box) {
  dice(box.pagina.includes("page-rep"), "sono sulla schermata Report", box.pagina);
  console.log("  testo:", box.testo.slice(0, 600));
  console.log("  conf:", JSON.stringify(box.conf && { sinistra: box.conf.sinistra, destra: box.conf.destra, etiSx: box.conf.etiSx, etiDx: box.conf.etiDx }));
  const zeroT = /\b0(,0+)?\s?t\b/.test(box.testo);
  if (ASSENTE) {
    dice(iniettato > 0, `il modulo servito rispondeva null (${iniettato} iniezioni)`);
    if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);
    dice(box.note.length === 1 && box.note[0].warn, "una nota sola, in tono warn", box.note);
    dice(/Campo non è raggiungibile/.test(box.testo), "dice che Campo non è raggiungibile");
    dice(/non lo do per zero/.test(box.testo), "e dice che non lo dà per zero");
    dice(!box.conf, "nessuna coppia di colonne");
    dice(!zeroT, "NESSUNA tonnellata a zero attribuita a Campo", box.testo);
    dice(!/nessun turno ha dichiarato/.test(box.testo), "NON dice «nessun turno ha dichiarato» (sarebbe il null tradotto in vuoto)");
  } else {
    dice(!!box.conf, "ci sono le due colonne");
    dice(!!box.conf && /Dichiarato dai turni/.test(box.conf.etiSx) && /Pesato in uscita/.test(box.conf.etiDx), "le etichette sono quelle giuste", box.conf);
    /* la dimostrazione: 8 turni con quantità (14.070 t) contro 14 viaggi pesati
       (374,96 t) — i numeri vengono da `produzioneDichiarata` e `vendutoPeriodo`
       sui dati di dimostrazione, e sono derivati, non scritti a mano nel banco:
       si controlla il RAPPORTO (sinistra molto maggiore della destra) e che le
       due cifre siano diverse fra loro */
    const num = (t) => t ? Number(String(t).replace(/\s?t$/, "").replace(/\./g, "").replace(",", ".")) : NaN;
    const sx = num(box.conf && box.conf.sinistra), dx = num(box.conf && box.conf.destra);
    dice(Number.isFinite(sx) && Number.isFinite(dx) && sx > dx * 10, "il dichiarato è molto più del pesato (dimostrazione)", [sx, dx]);
    dice(/8 turni con una produzione/.test(box.testo), "otto turni con una produzione (r2 è una bozza senza quantità: non conta)");
    dice(/14 viaggi/.test(box.testo), "quattordici viaggi pesati");
    dice(/non è uscito dal cancello/.test(box.testo), "il verso è detto a parole: «non è uscito dal cancello»");
    dice(/1 rapportino è senza data/.test(box.testo), "la coda dichiara il rapportino senza data (rs0)");
    dice(/1 turno non ha dichiarato la quantità/.test(box.testo) && /per difetto/.test(box.testo), "la coda dichiara il turno senza quantità (r2) e dice «per difetto»");
    dice(box.note.length === 1 && !box.note[0].warn, "la nota del verso non è in tono warn: prodotto > venduto è magazzino, non un errore", box.note);
    dice(!!box.terraSopra && box.terraSopra.length > 0, "il lato Terra sopra è ancora in piedi", box.terraSopra);
    dice(box.paginaScroll <= box.paginaClient, `la pagina non scorre di lato a ${LARG}px`, [box.paginaScroll, box.paginaClient]);
    dice(box.conf && box.conf.sxRect && box.conf.dxRect && box.conf.sxRect.width > 0 && box.conf.dxRect.width > 0, "i due numeri hanno un'area");
  }
}
if (SCATTI) { mkdirSync(OUT, { recursive: true });
  await pg.evaluate(() => document.getElementById("ric-campo")?.scrollIntoView({ block: "center" }));
  await pg.screenshot({ path: join(OUT, ASSENTE ? "assente.png" : `sano-${LARG}${TEMA ? "-" + TEMA : ""}.png`), fullPage: false }); }
await b.close(); srv.close();
console.log(`\nRisultato ponte Campo→Conti${ASSENTE ? " (Campo assente)" : ""}: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

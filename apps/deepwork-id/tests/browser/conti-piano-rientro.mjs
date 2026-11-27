/* CONTI · IL PIANO DI RIENTRO, VERIFICATO NEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-piano-rientro.mjs [--porta=8893]
     node conti-piano-rientro.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 16/09 (decimo giro di ricerca continua su Conti) Conti
   ha guadagnato `statoPianoRientro`: un accordo di pagamento a rate su una
   fattura scaduta, fra il sollecito e la messa in mora formale. Senza
   questo, una fattura con un piano onorato per due rate su tre resta
   "insoluta per l'intero importo" agli occhi di chi la guarda a schermo.
   La funzione pura è provata a fondo in run-kpi.mjs (la cascata delle
   rate, "decaduto" contro "in ritardo", i movimenti di un'altra fattura
   che non contano). Qui c'è solo quello che soltanto il browser può dire:
   che il badge compare sulla fattura GIUSTA (f2/Stradesud, che in demo ha
   un piano mai onorato — "decaduto") e non su una fattura senza piano.

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO. La stessa famiglia già vista
   su `componentiDelMezzo`/`barriereRicorrenti`: la pagina cerca il piano
   con `PIA.find(p => p.fatturaId === f.id)` — un refuso plausibile (il
   confronto scambiato per `p.id === f.id`, due campi che su altri record
   di questa stessa pagina significano cose diverse) farebbe sparire il
   badge senza che nessun errore di sintassi lo segnali, perché il piano
   esiste comunque in `PIA` e la funzione pura, chiamata nei suoi test con
   la firma giusta, si comporta benissimo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8893;
const CONTROPROVA = process.argv.includes("--controprova");

const DIFETTO = [
  "PIA.find(p => p && p.fatturaId === f.id)",
  "PIA.find(p => p && p.id === f.id)",
];
let iniezioniDifetto = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    const n = t.split(DIFETTO[0]).length - 1;
    if (n !== 1) console.log(`⛔ INIEZIONE MANCATA nella pagina: ${n} soggetti invece di 1`);
    else { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-fat");
await pg.waitForTimeout(700);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-fat"), "navigazione alla pagina delle fatture", vive);

const htmlF2 = await pg.locator('[data-fat="f2"]').innerHTML();
dice(/Piano decaduto/.test(htmlF2), "la fattura col piano (f2/Stradesud) mostra il badge giusto: nessuna rata onorata, la seconda anche scaduta", htmlF2.slice(0, 300));

const htmlF1 = await pg.locator('[data-fat="f1"]').innerHTML();
dice(!/Piano/.test(htmlF1), "una fattura SENZA piano (f1/Edilcave) non mostra nessun badge di piano", htmlF1.slice(0, 300));

const htmlF3 = await pg.locator('[data-fat="f3"]').innerHTML();
dice(!/Piano/.test(htmlF3), "e nemmeno un'altra fattura qualunque senza piano (f3)", htmlF3.slice(0, 300));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

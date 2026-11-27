/* "CARICA PER UN OBIETTIVO DI PEZZATURA" AVVISA QUANDO NON ENTRA NEL FORO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-carica-fuori-foro.mjs [--porta=8940]
     node genesi-carica-fuori-foro.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Genesi (17/09, agente
   a200d8450deefcbef). `caricaDaX50Target` inverte Kuz-Ram per trovare i
   kg/foro che centrano un x50 obiettivo, e dichiara `fuoriDominio` solo
   quando il MODELLO smette di essere affidabile (x50 fuori 1-100 cm, o i
   clamp bassi). Non c'era nessun confronto con la carica MASSIMA che il
   foro può fisicamente contenere (`caricaForoDaGeometria`, diametro ×
   profondità × borraggio × densità dell'esplosivo).
   Riprodotto dal vivo: progetto demo (Ø102, 10 m, sub 0,9, borraggio 2,2,
   ANFO 0,82 g/cc → massimo 58 kg/foro). Un obiettivo x50=5cm proponeva
   "carica ~880,2 kg/foro" con `fuoriDominio:false`, e l'unico avviso era
   sulla vibrazione proiettata (che parla d'altro) — un fochino che seguisse
   "riduci la MIC" senza cambiare la carica penserebbe che 880 kg/foro sia
   una quantità sensata da caricare, quindici volte quello che il foro può
   contenere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8940;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: togliere il calcolo della capacità e il quinto
   argomento, tornando alla chiamata di prima del 17/09. */
const DIFETTI = [
  [`  const _capForo=caricaForoDaGeometria({ diam:D2.diam, prof:D2.prof, sub:D2.sub, stem:D2.stem, densita:(selEsplosivo()||{}).densita_gcc });
  const r=caricaDaX50Target(xt, volumeForo(B,S,H), A, RWS, _capForo);`,
   `  const r=caricaDaX50Target(xt, volumeForo(B,S,H), A, RWS);`],
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { t = t.split(a).join(b); iniezioniDifetto++; } }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html`);
await pg.waitForTimeout(1500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto === DIFETTI.length, `il difetto è stato rimesso nella pagina servita (${iniezioniDifetto}/${DIFETTI.length})`, iniezioniDifetto);

await pg.click('.card[data-go="design"]');
await pg.waitForTimeout(800);
await pg.click("#btn-obiettivo-x50");
await pg.waitForTimeout(400);
await pg.fill("#modal-campo", "5");
await pg.click('button:has-text("Calcola")');
await pg.waitForTimeout(400);
const esito = await pg.evaluate(() => document.getElementById("d2-obiettivo-esito")?.innerText || "");

dice(/880/.test(esito), "il numero teorico (~880 kg/foro) resta visibile: è comunque informazione utile", esito.slice(0, 400));
dice(/NON entra fisicamente nel foro/i.test(esito),
  "e un obiettivo che chiede 880 kg su un foro che ne contiene 58 (15×) è segnalato come fisicamente impossibile, non solo come rischio di vibrazione",
  esito.slice(0, 400));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

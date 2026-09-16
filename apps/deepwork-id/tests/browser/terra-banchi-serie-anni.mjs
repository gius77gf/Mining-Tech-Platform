/* IL BANCO DA SEMPRE, ANNO PER ANNO — provata aprendo la pagina Denuncia e
   leggendo la riga del banco, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-banchi-serie-anni.mjs [--porta=8804]
     node terra-banchi-serie-anni.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `banchiDaSempre` (16/09, sesto e ultimo delta del
   tredicesimo giro di ricerca continua su Terra) sommava lo scavo di ogni
   banco su tutti gli anni della finestra e diceva SOLO «almeno 62.700 m³ ·
   misurato in 2 anni su 3»: il totale, non il dettaglio. `serieAnni` espone
   il valore anno per anno che il modulo calcolava già e buttava via.
   Il banco pretende che la riga del «banco 2» nella sezione «Lo stesso
   banco, da sempre» mostri i tre anni della finestra (2024 non misurato,
   2025 e 2026 coi loro m³), non solo il totale aggregato. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8804;
const CONTROPROVA = process.argv.includes("--controprova");
const PAGINA = join("apps", "terra", "index.html");

const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "il dettaglio anno per anno non arriva più alla riga del banco",
    da: 'BS.anni.length > 1 ? `<div class="form-hint">${',
    a: 'false ? `<div class="form-hint">${' },
];
let rimesse = 0;
const applica = (t, file) => {
  for (const inj of INIEZIONI) {
    if (inj.file !== file || !t.includes(inj.da)) continue;
    t = t.replace(inj.da, inj.a); rimesse++;
  }
  return t;
};

const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""}`); }

let ok = 0, ko = 0;
const dice = (cond, che, extra) => {
  if (cond) { ok++; console.log(`  ✓ ${che}`); }
  else { ko++; console.log(`  ✗ ${che}${extra === undefined ? "" : "  →  " + JSON.stringify(extra)}`); }
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/`);
await pg.waitForTimeout(2200);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

await pg.evaluate(() => { const n = document.getElementById("nav-den"); if (n) n.click(); });
await pg.waitForTimeout(600);

const rigaBanco2 = await pg.evaluate(() => {
  const nodi = [...document.querySelectorAll("#den-banchi-sempre .item .name")];
  const n = nodi.find((x) => (x.textContent || "").trim().toLowerCase() === "banco 2");
  const riga = n ? n.closest(".item") : null;
  return riga ? (riga.innerText || "").replace(/\s+/g, " ").trim() : null;
});
dice(!!rigaBanco2, "la riga del banco 2 esiste nella sezione «Lo stesso banco, da sempre»", rigaBanco2);
dice(!!rigaBanco2 && /2024 non misurato/.test(rigaBanco2),
  "l'anno cieco (2024) è dichiarato riga per riga, non nascosto dentro il totale", rigaBanco2);
dice(!!rigaBanco2 && /2025 22\.000 m³/.test(rigaBanco2),
  "il 2025 riporta il suo valore vero", rigaBanco2);
dice(!!rigaBanco2 && /2026 40\.700 m³/.test(rigaBanco2),
  "il 2026 riporta il suo valore vero (19.400 + 21.300)", rigaBanco2);

await b.close();
srv.close();

console.log(`\n${ok} passati, ${ko} falliti`);
if (CONTROPROVA) {
  console.log(`iniezioni rimesse davvero: ${rimesse} su ${INIEZIONI.length}`);
  for (const i of INIEZIONI) console.log(`   · ${i.n}. ${i.perche}`);
  if (rimesse < INIEZIONI.length) {
    console.error("\n✗ CONTROPROVA NON VALIDA: l'iniezione non ha trovato il suo testo.");
    process.exit(2);
  }
  console.log(ko > 0 ? "\n✓ CONTROPROVA: coi difetti rimessi il banco li vede."
    : "\n✗ CONTROPROVA: coi difetti rimessi il banco NON li vede.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

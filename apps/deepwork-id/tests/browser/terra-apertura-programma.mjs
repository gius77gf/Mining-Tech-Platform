/* L'APERTURA FUORI PROGRAMMA — provata aprendo la pagina Titolo e leggendo
   la riga del lotto, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-apertura-programma.mjs [--porta=8803]
     node terra-apertura-programma.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `aperturaFuoriProgramma` (16/09, dal delta della
   ricerca continua sul sequenziamento multi-anno, quinto dei sei — parente
   di `sequenzaLotto`, ma qui il confronto è col CALENDARIO dichiarato dal
   progetto, non con l'avanzamento di un altro lotto) dice se un lotto è
   stato aperto in anticipo o in ritardo rispetto al mese previsto.
   Il banco pretende che la riga del Lotto 4 (aperto il 02/05/2024, previsto
   per novembre 2023 — la dimostrazione) mostri la frase con lo scarto VERO
   in giorni, calcolato dal modulo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8803;
const CONTROPROVA = process.argv.includes("--controprova");
const PAGINA = join("apps", "terra", "index.html");

const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "il confronto col programma non arriva più alla riga del lotto",
    da: "const afp = aperturaFuoriProgramma(l);",
    a: "const afp = { pertinente: false };" },
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

await pg.evaluate(() => { const n = document.getElementById("nav-tit"); if (n) n.click(); });
await pg.waitForTimeout(600);

const rigaLo4 = await pg.evaluate(() => {
  const nodi = [...document.querySelectorAll(".item .name")];
  const n = nodi.find((x) => (x.textContent || "").includes("Lotto 4"));
  const riga = n ? n.closest(".item") : null;
  return riga ? (riga.innerText || "").replace(/\s+/g, " ").trim() : null;
});
dice(!!rigaLo4, "la riga del Lotto 4 esiste");
dice(!!rigaLo4 && /Aperto in ritardo di 183 giorni rispetto al programma \(previsto 01\/11\/2023\)/.test(rigaLo4),
  "la riga riporta ESATTAMENTE lo scarto calcolato dal modulo (183 giorni)", rigaLo4);

const rigaLo1 = await pg.evaluate(() => {
  const nodi = [...document.querySelectorAll(".item .name")];
  const n = nodi.find((x) => (x.textContent || "").includes("Lotto 1"));
  const riga = n ? n.closest(".item") : null;
  return riga ? (riga.innerText || "").replace(/\s+/g, " ").trim() : null;
});
dice(!!rigaLo1 && !/rispetto al programma/.test(rigaLo1),
  "il Lotto 1 non dichiara un programma: riga silenziosa, nessun confronto inventato", rigaLo1);

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

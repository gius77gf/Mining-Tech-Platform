/* IL PIANO PLURIENNALE, ANNO PER ANNO — provato aprendo la pagina Titolo e
   leggendo la riga del lotto, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-piano-lotto-anno.mjs [--porta=8790]
     node terra-piano-lotto-anno.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `varianzaLottoAnno` (16/09, dal delta della ricerca
   continua su Terra: sequenziamento multi-anno) confronta, per un lotto e per
   un anno, il volume pianificato (`lotto.volumiAnnuali`, campo nuovo e
   opzionale) contro il volume davvero scavato in quell'anno — a differenza di
   `varianzaMensilePiano`, che è aggregata su TUTTI i lotti insieme e non dice
   QUALE lotto sta slittando.
   Il banco pretende che la riga del lotto `lo4` (l'unico della dimostrazione
   con un piano per anno, dal delta 16/09) mostri la frase nel `form-hint`, e
   che i lotti SENZA quel campo restino silenziosi — non un numero inventato.

   ⛔ I CASI SONO GIÀ NELLA DIMOSTRAZIONE (non servono iniezioni nei dati
   serviti): `lo4` ha `volumiAnnuali: [{anno:2026, volumeM3:50000}]` e due
   rilievi di scavo del 2026 sul suo fronte (19.400+21.300=40.700 m³), quindi
   il caso vero — indietro del 19% — è già quello che gira in demo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8790;
const CONTROPROVA = process.argv.includes("--controprova");
const PAGINA = join("apps", "terra", "index.html");

/* L'UNICA INIEZIONE: la riga che calcola `pianoAnno` viene forzata a stringa
   vuota — cioè la stessa cosa che succede oggi per i cinque lotti senza
   `volumiAnnuali`, ma applicata anche a `lo4`, che il piano ce l'ha. */
const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "il confronto pianificato-vs-reale non arriva più nella riga del lotto",
    da: "const vl = varianzaLottoAnno(l, annoCorrente, RIL);",
    a: "const vl = { calcolabile: false };" },
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

const testoRiga = (nomeLotto) => pg.evaluate((nome) => {
  const nodi = [...document.querySelectorAll(".item .name")];
  const n = nodi.find((x) => (x.textContent || "").includes(nome));
  const riga = n ? n.closest(".item") : null;
  return riga ? (riga.innerText || "").replace(/\s+/g, " ").trim() : null;
}, nomeLotto);

const rigaLo4 = await testoRiga("Lotto 4");
dice(rigaLo4 !== null, "la riga del Lotto 4 esiste nella pagina Titolo");
dice(!!rigaLo4 && /Nel 2026: pianificati 50\.000 m³, scavati 40\.700 m³/.test(rigaLo4),
  "il Lotto 4 mostra il confronto pianificato-vs-reale del 2026", rigaLo4);
dice(!!rigaLo4 && /indietro di 19%/.test(rigaLo4),
  "e dice ESATTAMENTE il verso e lo scarto calcolati dal modulo (indietro del 19%)", rigaLo4);

const rigaLo1 = await testoRiga("Lotto 1");
dice(!!rigaLo1 && !/pianificati \d/.test(rigaLo1),
  "il Lotto 1 NON dichiara un piano per anno: la riga resta silenziosa, nessun numero inventato", rigaLo1);
const rigaLo5 = await testoRiga("Lotto 5");
dice(!!rigaLo5 && !/pianificati \d/.test(rigaLo5),
  "e lo stesso per il Lotto 5 — cinque lotti su sei non hanno ancora questo campo", rigaLo5);

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

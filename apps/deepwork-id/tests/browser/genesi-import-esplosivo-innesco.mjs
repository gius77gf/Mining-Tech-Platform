/* L'IMPORT DI UNA .volata.json IGNORAVA ESPLOSIVO E INNESCO DICHIARATI NEL
   FILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-import-esplosivo-innesco.mjs [--porta=8960]
     node genesi-import-esplosivo-innesco.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal backlog QA su Genesi (18/09), task #17. L'export
   scrive `volata.default.esplosivo` (il nome pieno, es. "ANFO
   insacchettato") e `volata.default.innesco` (la sigla breve, es.
   "Elettr."), ma l'importatore ($('fileIn').onchange) non li rileggeva
   mai: erano gli unici due campi del blocco `default`/`geometria` che
   l'import scartava in silenzio, dopo che spalla/interasse/diametro/
   borraggio erano già stati corretti (uno per volta, in giorni diversi).
   Esplosivo e innesco decidono la resistenza all'acqua (RWS) e lo scatter
   d'innesco (fino a 80 volte più ampio nel Nonel che nell'elettronico), e
   quindi le stime di MIC/PPV: un file che dichiara un esplosivo o un
   innesco diverso da quello corrente li perdeva al giro di andata e
   ritorno, senza nessun avviso.
   Verificato dal vivo: importando un file con esplosivo "ANFO
   insacchettato" (id anfo-bagged) e innesco "Elettr." (id elettronico) su
   un progetto partito con i default (anfo-standard/nonel), D2.esplosivo e
   D2.innesco restavano ai default — ora seguono il file. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8960;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO = [
  `    if(def.esplosivo){ const m=ESPL.find(e=>e.nome===def.esplosivo); if(m) D2.esplosivo=m.id; }
    if(def.innesco){ const m=INNESCHI.find(x=>x.short===def.innesco); if(m) D2.innesco=m.id; }
    const ritardi`,
  `    const ritardi`,
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) {
      if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
    }
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
const pg = await b.newPage();
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html?go=lab&demo=1`);
await pg.waitForTimeout(2000);
if (CONTROPROVA) console.log(iniezioniDifetto === 1 ? "il difetto è stato rimesso nella pagina servita" : `⛔ iniezione riuscita: ${iniezioniDifetto}/1 — l'ancora non ha combaciato`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

const prima = await pg.evaluate(() => ({ esplosivo: window.__genesi.D2.esplosivo, innesco: window.__genesi.D2.innesco }));
dice(prima.esplosivo === "anfo-standard" && prima.innesco === "nonel", "precondizione: il progetto parte sui default (anfo-standard/nonel)", prima);

const VOLATA_PROVA = JSON.stringify({
  schemaV: 1, tipo: "volata-deepwork",
  volata: {
    id: "vol_prova", sitoId: null, tipo: "cava", numero: 9, data: "2026-09-18",
    geometria: { spalla_m: 3, interasse_m: 3.5, borraggio_m: 2.2, file: 1 },
    default: { diametro_mm: 102, profondita_m: 10, esplosivo: "ANFO insacchettato", ritardo_ms: 42, innesco: "Elettr." },
    fori: [
      { id: "f1", num: 1, x: 0, prof: 10, diam: 102, kg: 60, esplosivo: "ANFO insacchettato", ritardo: 0, innesco: "Elettr.", sequenza: 1, fila: 1 },
      { id: "f2", num: 2, x: 3.5, prof: 10, diam: 102, kg: 60, esplosivo: "ANFO insacchettato", ritardo: 42, innesco: "Elettr.", sequenza: 2, fila: 1 },
    ],
    connessioni: [],
  },
}, null, 1);

const percorso = join("/tmp", "genesi-import-prova-" + process.pid + ".volata.json");
writeFileSync(percorso, VOLATA_PROVA);
try {
  await pg.setInputFiles("#fileIn", percorso);
  await pg.waitForTimeout(400);
  const dopo = await pg.evaluate(() => ({ esplosivo: window.__genesi.D2.esplosivo, innesco: window.__genesi.D2.innesco }));
  dice(dopo.esplosivo === "anfo-bagged", `⛔ D2.esplosivo segue il file ("ANFO insacchettato" -> anfo-bagged), non i default`, dopo);
  dice(dopo.innesco === "elettronico", `⛔ D2.innesco segue il file ("Elettr." -> elettronico), non i default`, dopo);
  const selEspl = await pg.evaluate(() => document.getElementById("dEspl")?.value ?? null);
  const selInn = await pg.evaluate(() => document.getElementById("dInnSel")?.value ?? null);
  dice(selEspl === "anfo-bagged", "e il select dell'esplosivo nel Progetto 2D si aggiorna di conseguenza", selEspl);
  dice(selInn === "elettronico", "e quello dell'innesco pure", selInn);
} finally { try { unlinkSync(percorso); } catch (e) {} }

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

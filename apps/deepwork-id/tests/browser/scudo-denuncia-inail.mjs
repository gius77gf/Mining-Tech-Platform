/* LA DENUNCIA INAIL — provata aprendo la pagina Documenti di Scudo e
   leggendo il registro degli eventi, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-denuncia-inail.mjs [--porta=8806]
     node scudo-denuncia-inail.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `scadenzaDenunciaInail` (16/09, dal delta della
   ricerca continua su Scudo — D.P.R. 1124/1965, art. 53) dice se un
   infortunio (mortale o con più di tre giorni di assenza) ha un obbligo di
   denuncia INAIL pendente. Il banco pretende che il registro degli eventi
   mostri la nota giusta sui casi VERI della dimostrazione: i2/i7/i9 (oltre
   tre giorni, nessun certificato registrato) devono dire «da valutare»
   con la ragione «manca il certificato»; i8 (prognosi ancora aperta,
   `giorniAssenza: null`) deve dire «da valutare» con la ragione «prognosi
   aperta» — MAI la stessa frase delle prime tre, perché sono due «non si
   sa» diversi. Un near-miss non deve mai portare questa nota. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8806;
const CONTROPROVA = process.argv.includes("--controprova");
const PAGINA = join("apps", "scudo", "index.html");

const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "la nota della denuncia INAIL non arriva più alla riga dell'evento",
    da: "const sd = scadenzaDenunciaInail(x, new Date());",
    a: "const sd = { pertinente: false };" },
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
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/`);
await pg.waitForTimeout(2200);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

await pg.evaluate(() => { const n = document.getElementById("nav-doc"); if (n) n.click(); });
await pg.waitForTimeout(600);
await pg.evaluate(() => { const b = document.querySelector('#inf-filtri [data-filtro="infortunio"]'); if (b) b.click(); });
await pg.waitForTimeout(300);

const rigaMeta = async (frammento) => pg.evaluate((f) => {
  const nodi = [...document.querySelectorAll("#inf-list .item")];
  const el = nodi.find((x) => (x.textContent || "").includes(f));
  const meta = el ? el.querySelector(".meta") : null;
  return meta ? (meta.innerText || "").replace(/\s+/g, " ").trim() : null;
}, frammento);

const metaTaglio = await rigaMeta("Taglio alla mano");
dice(!!metaTaglio, "la riga dell'infortunio i2 (taglio alla mano, 4 giorni) esiste", metaTaglio);
dice(!!metaTaglio && /denuncia INAIL da valutare/.test(metaTaglio) && /manca il certificato/.test(metaTaglio),
  "oltre i tre giorni e senza certificato: «da valutare», ragione «manca il certificato»", metaTaglio);

const metaDistorsione = await rigaMeta("Distorsione alla caviglia");
dice(!!metaDistorsione, "la riga dell'infortunio i8 (prognosi ancora aperta) esiste", metaDistorsione);
dice(!!metaDistorsione && /denuncia INAIL da valutare/.test(metaDistorsione) && /prognosi aperta/.test(metaDistorsione),
  "prognosi ancora aperta: «da valutare», ma con la ragione «prognosi aperta», DIVERSA da «manca il certificato»", metaDistorsione);
dice(!!metaDistorsione && !/manca il certificato/.test(metaDistorsione),
  "⛔ e le due ragioni non si scambiano: qui NON deve comparire «manca il certificato»", metaDistorsione);

const metaCaduta = await rigaMeta("Caduta da un mezzo");
dice(!!metaCaduta, "la riga dell'infortunio i9 (75 giorni, permanente) esiste", metaCaduta);
dice(!!metaCaduta && /denuncia INAIL da valutare/.test(metaCaduta),
  "75 giorni di assenza: pertinente anche se la gravità non è «mortale»", metaCaduta);

await pg.evaluate(() => { const b = document.querySelector('#inf-filtri [data-filtro="near-miss"]'); if (b) b.click(); });
await pg.waitForTimeout(300);
const nearMissSenzaNota = await pg.evaluate(() => {
  const meta = [...document.querySelectorAll("#inf-list .item .meta")].map((m) => m.innerText || "");
  return meta.every((t) => !/denuncia INAIL/.test(t));
});
dice(nearMissSenzaNota, "⛔ nessun near-miss porta la nota della denuncia INAIL: un near-miss non ha un ferito");

const campiForm = await pg.evaluate(() => ({
  cert: !!document.getElementById("inf-certificato"),
  denunciaData: !!document.getElementById("inf-denuncia-data"),
  denunciaNumero: !!document.getElementById("inf-denuncia-numero"),
}));
dice(campiForm.cert && campiForm.denunciaData && campiForm.denunciaNumero,
  "il form «Registra evento» porta i tre campi nuovi", campiForm);

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

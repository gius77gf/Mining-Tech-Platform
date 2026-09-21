/* IL VALIDATORE ACCUSA «SPALLA PICCOLA... RIDUCI SPALLA O AUMENTA Ø» QUANDO
   LA SPALLA È ILLEGGIBILE, NON PICCOLA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-spalla-diametro-null.mjs [--porta=8960]
     node genesi-spalla-diametro-null.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass QA su Genesi (18/09), stessa
   famiglia già chiusa lo stesso giorno su «Rapporto S/B», «Rigidità H/B» e
   «Timing inter-foro/fila». In `renderScheda2D`, `bd=B/Dm` (B=spalla,
   Dm=diametro in metri) andava dritto nel badge «Spalla / Ø» senza nessuna
   guardia: con la spalla illeggibile `null/Dm` fa 0, un numero finito che
   il validatore giudica come una spalla vera e piccolissima, e il badge
   passava a rosso accusando «spalla piccola per Ø… con questo esplosivo;
   consigliata ~X m. Riduci spalla o aumenta Ø» — un'accusa di sicurezza
   fabbricata su un campo che nessuno ha scritto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8960;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09 sera. */
const DIFETTO = [
  `  if(!(_geoOk(B)&&_geoOk(Dm))){
    const _senzaBD=volataSenzaValori({B:D2.B});
    rows.push(nonCalcolabile('Spalla / Ø', _senzaBD ? (_senzaBD.che+'. '+_senzaBD.come)
      : ('la spalla o il diametro non danno un rapporto leggibile (spalla '+gfix(B,2)+' m, Ø '+Dmm+' mm).')));
  } else rows.push(badge(bd,'Spalla / Ø',`,
  `  rows.push(badge(bd,'Spalla / Ø',`,
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
    if (CONTROPROVA && t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
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
if (CONTROPROVA) console.log(iniezioniDifetto === 1 ? "il difetto è stato rimesso nella pagina servita" : `⛔ iniezione non riuscita: l'ancora non ha combaciato`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice((await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "function", "il gancio di debug espone renderScheda2D");

const leggiRiga = async (lab) => pg.evaluate((lab) => {
  const el = document.querySelector(`#d2-scheda .sv-row[data-lab="${lab}"]`);
  if (!el) return null;
  return { cls: el.querySelector(".sv-dot")?.className || "", val: el.querySelector(".sv-val")?.textContent || "",
    why: el.querySelector(".sv-why")?.textContent || "" };
}, lab);

// caso di controllo: spalla valida — badge normale
await pg.evaluate(() => { window.__genesi.D2.B = 3; window.__genesi.renderScheda2D(); });
const rOk = await leggiRiga("Spalla / Ø");
dice(!!rOk && !/non calcolabile/.test(rOk.val), "con la spalla valida (3 m): badge normale, non «non calcolabile»", rOk);

// il caso sospetto: spalla illeggibile
await pg.evaluate(() => { window.__genesi.D2.B = null; window.__genesi.renderScheda2D(); });
const rKO = await leggiRiga("Spalla / Ø");
dice(!!rKO && /non calcolabile/.test(rKO.val), "⛔ con la spalla illeggibile: «Spalla / Ø» dice «non calcolabile»", rKO);
dice(!!rKO && rKO.cls.includes("sv-warn") && !rKO.cls.includes("sv-bad"), "e il pallino è sv-warn (non sappiamo), non un rosso di accusa", rKO);
dice(!!rKO && !/riduci spalla|spalla piccola/i.test(rKO.val + " " + rKO.why), "e non accusa più «spalla piccola... riduci spalla» su un dato mai scritto", rKO);

// ripristino: la spalla torna leggibile, il badge torna normale
await pg.evaluate(() => { window.__genesi.D2.B = 3.2; window.__genesi.renderScheda2D(); });
const rRipristino = await leggiRiga("Spalla / Ø");
dice(!!rRipristino && !/non calcolabile/.test(rRipristino.val), "e rimettendo una spalla leggibile il badge torna normale", rRipristino);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

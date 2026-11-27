/* IL VALIDATORE ACCUSA UN BORRAGGIO CORTO O UNA SOTTOPERFORAZIONE SCARSA
   QUANDO IL DATO VERO È «NON LEGGIBILE», NON «ZERO»
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-validatore-stem-sub-null.mjs [--porta=8957]
     node genesi-validatore-stem-sub-null.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Genesi (18/09), task #9 del backlog.
   In `renderScheda2D` (Scheda Volata / Validatore) le righe «Borraggio / B»
   e «Sottoperf.» calcolavano `stemB=D2.stem/B` e `subB=D2.sub/B` senza
   nessuna guardia sul numeratore. Con `D2.stem` (o `D2.sub`) illeggibile
   (`null`, da un progetto salvato/importato con quel campo vuoto),
   `null/B` in JavaScript non dà NaN: dà **0**, un numero finito che
   `badge()` giudica come un valore basso VERO — pallino rosso/giallo,
   «borraggio corto → rischio proiezioni dal colletto» o «sottoperf.
   scarsa → rischio toe/zoccoli», su un dato che nessuno ha scritto.
   La riga gemella «Confin. colletto (SDOB)», che nella stessa scheda legge
   lo stesso `D2.stem` tramite `confinamentoColletto`, dichiarava già
   correttamente «non calcolabile» in questo caso: mancava la stessa
   guardia sulle due righe qui sopra. Corretto con `volataSenzaValori`,
   la stessa funzione che già guardia la riga «Rapporto S/B» tre righe più
   su nello stesso file.
   Verificato dal vivo: con stem/sub validi (2,2 m / 0,9 m, i valori della
   demo) le due righe mostrano un badge normale; con stem=null la riga
   «Borraggio / B» mostrava «0,00·B» e pallino rosso, con sub=null la riga
   «Sottoperf.» mostrava «0,00·B» e pallino giallo/rosso — in tutt'e due i
   casi ora mostrano «non calcolabile». */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8957;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO_STEM = [
  `  const _senzaStem=volataSenzaValori({stem:D2.stem});
  if(_senzaStem) rows.push(nonCalcolabile('Borraggio / B',_senzaStem.che+'. '+_senzaStem.come));
  else rows.push(badge(stemB,'Borraggio / B',`,
  `  rows.push(badge(stemB,'Borraggio / B',`,
];
const DIFETTO_SUB = [
  `  const _senzaSub=volataSenzaValori({sub:D2.sub});
  if(_senzaSub) rows.push(nonCalcolabile('Sottoperf.',_senzaSub.che+'. '+_senzaSub.come));
  else rows.push(badge(subB,'Sottoperf.',`,
  `  rows.push(badge(subB,'Sottoperf.',`,
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
      if (t.includes(DIFETTO_STEM[0])) { t = t.replace(DIFETTO_STEM[0], DIFETTO_STEM[1]); iniezioniDifetto++; }
      if (t.includes(DIFETTO_SUB[0])) { t = t.replace(DIFETTO_SUB[0], DIFETTO_SUB[1]); iniezioniDifetto++; }
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
if (CONTROPROVA) console.log(iniezioniDifetto === 2 ? "il difetto è stato rimesso nella pagina servita (2 punti)" : `⛔ iniezioni riuscite: ${iniezioniDifetto}/2 — l'ancora non ha combaciato del tutto`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(typeof (await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "string" &&
  (await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "function", "il gancio di debug espone renderScheda2D");

const leggiRiga = async (lab) => pg.evaluate((lab) => {
  const el = document.querySelector(`#d2-scheda .sv-row[data-lab="${lab}"]`);
  if (!el) return null;
  return { cls: el.querySelector(".sv-dot")?.className || "", val: el.querySelector(".sv-val")?.textContent || "" };
}, lab);

// caso di controllo: stem e sub validi (2,2 / 0,9, i valori della demo) — badge normale, nessun "non calcolabile"
const conValori = await pg.evaluate(() => { window.__genesi.D2.stem = 2.2; window.__genesi.D2.sub = 0.9; window.__genesi.renderScheda2D(); });
const rStemOk = await leggiRiga("Borraggio / B");
const rSubOk = await leggiRiga("Sottoperf.");
dice(!!rStemOk && !/non calcolabile/.test(rStemOk.val) && /2,2 m/.test(rStemOk.val), "con borraggio valido (2,2 m): badge normale, non «non calcolabile»", rStemOk);
dice(!!rSubOk && !/non calcolabile/.test(rSubOk.val), "con sottoperforazione valida (0,9 m): badge normale, non «non calcolabile»", rSubOk);

// il caso sospetto: borraggio illeggibile
const senzaStem = await pg.evaluate(() => { window.__genesi.D2.stem = null; window.__genesi.D2.sub = 0.9; window.__genesi.renderScheda2D(); });
const rStemKO = await leggiRiga("Borraggio / B");
dice(!!rStemKO && /non calcolabile/.test(rStemKO.val), "con borraggio illeggibile: la riga «Borraggio / B» dice «non calcolabile»", rStemKO);
dice(!!rStemKO && rStemKO.cls.includes("sv-warn") && !rStemKO.cls.includes("sv-bad"), "e il pallino è sv-warn (non sappiamo, non «sbagliato»), non un rosso di accusa", rStemKO);
dice(!!rStemKO && !/0,00·B/.test(rStemKO.val), "e non compare più il rapporto gonfiato a 0,00·B (il difetto misurato dal vivo)", rStemKO);

// il caso sospetto: sottoperforazione illeggibile
const senzaSub = await pg.evaluate(() => { window.__genesi.D2.stem = 2.2; window.__genesi.D2.sub = null; window.__genesi.renderScheda2D(); });
const rSubKO = await leggiRiga("Sottoperf.");
dice(!!rSubKO && /non calcolabile/.test(rSubKO.val), "con sottoperforazione illeggibile: la riga «Sottoperf.» dice «non calcolabile»", rSubKO);
dice(!!rSubKO && rSubKO.cls.includes("sv-warn") && !rSubKO.cls.includes("sv-bad"), "e il pallino è sv-warn, non un rosso di accusa", rSubKO);
dice(!!rSubKO && !/0,00·B/.test(rSubKO.val), "e non compare più il rapporto gonfiato a 0,00·B", rSubKO);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* IL QUADRO NON MOSTRA DUE VOLTE LA STESSA VERIFICA PERIODICA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-verifica-doppia.mjs [--porta=8937]
     node scudo-verifica-doppia.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Scudo (17/09). Nel Quadro,
   una scadenza di "verifica periodica attrezzatura" (art. 71 c.11) compariva
   DUE VOLTE quando la sua data di prossima verifica entrava anche lei nella
   finestra scaduta/in-scadenza: una volta con il badge specifico da
   `verificheDaSistemare` (es. "Non idonea"), una volta col ramo generico
   `urg`, che non escludeva le scadenze già rappresentate lì sopra — badge
   "Scaduta"/etichetta "Scadenza aziendale", strettamente meno informativo e
   discordante con l'altro sullo stesso record. Nella dimostrazione le tre
   scadenze di verifica periodica hanno data futura, quindi il doppione non
   si vedeva mai: qui lo si costruisce iniettando nella risposta HTTP una
   data passata sulla scadenza demo s24 (Autogru 30 t). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8937;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: la scadenza demo s24 (Autogru 30 t) portata a data passata E a
   esito negativo — `statoVerificaPeriodica` guarda `verificaEsito`, non
   `dataScadenza`: con l'esito "idonea" di partenza la riga ha `cls:"ok"` e
   non entra mai in `daSistemare`, quindi la data da sola non basta a far
   entrare s24 in ENTRAMBI i rami (quello specifico e quello generico). */
const CASO = [
  `{ id: "s24", lavoratoreId: null, tipo: TIPO_VERIFICA_PERIODICA, descrizione: "Autogru 30 t — verifica periodica", dataScadenza: "2027-03-18",
      verificaEnte: "abilitato", verificaChi: "Organismo abilitato — iscr. elenco MLPS", verificaEsito: "idonea", verbaleId: "c11", attrezzaturaId: "at1" },`,
  `{ id: "s24", lavoratoreId: null, tipo: TIPO_VERIFICA_PERIODICA, descrizione: "Autogru 30 t — verifica periodica", dataScadenza: "2026-01-01",
      verificaEnte: "abilitato", verificaChi: "Organismo abilitato — iscr. elenco MLPS", verificaEsito: "non-idonea", verbaleId: "c11", attrezzaturaId: "at1" },`,
];

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. */
const DIFETTO = [
  `    const verificheSistemare = verificheDaSistemare(SCA, DOC).daSistemare;
    const verUrg = verificheSistemare.slice(0, 3).map(r =>`,
  `    const verUrg = verificheDaSistemare(SCA, DOC).daSistemare.slice(0, 3).map(r =>`,
];
const DIFETTO2 = [
  `    const idVerifiche = new Set(verificheSistemare.map(r => r.scadenza.id));
    const urg = SCA.filter(s => statoScadenza(s.dataScadenza) !== "regolare" && !idVerifiche.has(s.id))`,
  `    const urg = SCA.filter(s => statoScadenza(s.dataScadenza) !== "regolare")`,
];
let caseInjected = 0, diffInjected = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/scudo/scudo-data.js")) {
    let t = corpo.toString("utf8");
    if (t.includes(CASO[0])) { t = t.replace(CASO[0], CASO[1]); caseInjected++; }
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/scudo/index.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); diffInjected++; }
    if (t.includes(DIFETTO2[0])) { t = t.replace(DIFETTO2[0], DIFETTO2[1]); diffInjected++; }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(caseInjected === 1, "il caso (Autogru 30t con data passata) è stato iniettato nella risposta HTTP", caseInjected);
if (CONTROPROVA) dice(diffInjected === 2, "il difetto è stato rimesso nella pagina servita", diffInjected);

const testoQuadro = await pg.evaluate(() => document.getElementById("urg-list")?.innerText ?? "");
const occorrenze = (testoQuadro.match(/Autogru 30 t/g) || []).length;
dice(occorrenze === 1, "«Autogru 30 t» compare UNA sola volta nel Quadro (#urg-list)", `${occorrenze} occorrenze — testo: ${testoQuadro.slice(0, 500)}`);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

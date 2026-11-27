/* UN FRONTE CONDIVISO FRA DUE LOTTI PRODUCE UN AVVISO VISIBILE, NON SOLO UN
   BADGE MUTO "FUORI DAI LOTTI"
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-fronte-condiviso-avviso.mjs [--porta=8953]
     node terra-fronte-condiviso-avviso.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Terzo difetto del terzo giro di deep-pass su Terra (17/09,
   agente a82876ad086170520). `conformitaProgetto` calcola già `frontiAmbigui`
   (i fronti che compaiono nel `frontiId` di più di un lotto) con un commento
   che ne spiega il rischio per esteso: `volumeMisuratoDiLotto` non vede gli
   altri lotti, quindi un fronte condiviso per errore viene sommato PER
   INTERO nel volume misurato di ognuno dei lotti che lo rivendicano — una
   guardia calcolata e mai letta da `apps/terra/index.html`, che leggeva solo
   `c.fronti`/`c.volume`/`c.geometria`/`c.sequenza`. Il fronte compariva nella
   riga per-fronte con un badge muto "fuori dai lotti" (perché la funzione,
   non sapendo quale dei due lotti scegliere, non ne assegna nessuno), che
   sembra un fronte dimenticato invece di un fronte conteso. Ora il
   cartellone di conformità mostra un avviso dedicato quando
   `c.frontiAmbigui.length > 0`, e la riga del fronte dice "condiviso fra più
   lotti" invece di "fuori dai lotti". */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8953;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: il fronte f1 (già del Lotto 4) entra anche nel Lotto 5. */
const CASO = [
  '{ id: "lo5", nome: "Lotto 5 — settore Est", ordine: 5, superficieMq: 9500, volumeM3: 140000,\n      stato: "aperto", apertoIl: "2025-09-08", esauritoIl: null,\n      recuperoIniziatoIl: null, recuperoFinitoIl: null, collaudatoIl: null,\n      dipendeDa: { lottoId: "lo4", percentuale: 80 },\n      frontiId: ["f2"], nota: "" },',
  '{ id: "lo5", nome: "Lotto 5 — settore Est", ordine: 5, superficieMq: 9500, volumeM3: 140000,\n      stato: "aperto", apertoIl: "2025-09-08", esauritoIl: null,\n      recuperoIniziatoIl: null, recuperoFinitoIl: null, collaudatoIl: null,\n      dipendeDa: { lottoId: "lo4", percentuale: 80 },\n      frontiId: ["f2", "f1"], nota: "" },',
];
/* IL DIFETTO DA RIMETTERE: `ambigui` calcolato e mai mostrato (equivale a
   prima del 18/09, quando la variabile non esisteva affatto). */
const DIFETTO = [
  `    const ambigui = (c.frontiAmbigui || []).length
      ? \`<div class="riga att">\${I.allarme}<span><b>\${c.frontiAmbigui.length} \${c.frontiAmbigui.length === 1 ? "fronte è assegnato a più lotti" : "fronti sono assegnati a più lotti"}</b>: \${c.frontiAmbigui.map(f => esc(f.nome)).join(", ")}. Il volume misurato dei lotti coinvolti può essere gonfiato — ognuno somma per intero il volume del fronte condiviso, come se l'altro non esistesse. Si corregge assegnando il fronte a un solo lotto nella scheda <b>Fronti</b>.</span></div>\`
      : "";`,
  `    const ambigui = "";`,
];
/* IL SECONDO DIFETTO: la riga del fronte in elenco tornava a dire «fuori dai
   lotti» anche per un fronte conteso, invece di «condiviso fra più lotti». */
const DIFETTO2 = [
  `r.lottoAmbiguo ? "condiviso fra più lotti" : r.lottoNome ? esc(r.lottoNome) : "fuori dai lotti",`,
  `r.lottoNome ? esc(r.lottoNome) : "fuori dai lotti",`,
];
let iniezioniCaso = 0, iniezioniDifetto = 0, iniezioniDifetto2 = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/terra/terra-data.js")) {
    let t = corpo.toString("utf8");
    if (t.includes(CASO[0])) { t = t.replace(CASO[0], CASO[1]); iniezioniCaso++; }
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/terra/index.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
    if (t.includes(DIFETTO2[0])) { t = t.replace(DIFETTO2[0], DIFETTO2[1]); iniezioniDifetto2++; }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
await pg.waitForTimeout(2000);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCaso === 1, "il caso (fronte f1 condiviso da lo4 e lo5) è stato iniettato nella risposta HTTP", iniezioniCaso);
if (CONTROPROVA) dice(iniezioniDifetto === 1, "il primo difetto è stato rimesso nella pagina servita", iniezioniDifetto);
if (CONTROPROVA) dice(iniezioniDifetto2 === 1, "il secondo difetto è stato rimesso nella pagina servita", iniezioniDifetto2);

await pg.evaluate(() => { if (window.go) window.go("piano"); });
await pg.waitForTimeout(1000);
const cartellone = await pg.evaluate(() => document.getElementById("lot-conformita")?.innerText || "");
const fronti = await pg.evaluate(() => document.getElementById("lot-conf-fronti")?.innerText || "");

dice(/condivis/i.test(cartellone), "il cartellone di conformità mostra un avviso sul fronte condiviso", cartellone.slice(0, 200));
dice(/Fronte Nord/.test(cartellone), "l'avviso nomina il fronte condiviso (Fronte Nord)", cartellone.slice(0, 200));
dice(/condiviso fra più lotti/.test(fronti), "la riga del fronte in elenco dice «condiviso fra più lotti», non «fuori dai lotti»", fronti.slice(0, 300));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

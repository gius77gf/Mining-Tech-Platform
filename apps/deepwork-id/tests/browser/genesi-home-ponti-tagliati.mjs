/* LA HOME DI GENESI NON TAGLIA LA TERZA RIGA DEI "PONTI CON LE ALTRE APP"
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-home-ponti-tagliati.mjs [--porta=8939]
     node genesi-home-ponti-tagliati.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Genesi (17/09, agente
   a200d8450deefcbef). `.hg-list` (la classe condivisa dalle tre liste della
   Home: volate salvate, nuvole di punti, ponti con le altre app) ha
   `max-height:172px;overflow-y:auto`. Le prime due liste crescono con l'uso
   e per loro il contenimento con scroll interno serve davvero; ma
   `#hgPonti` porta SEMPRE esattamente tre righe fisse (Sentinella, Campo,
   Terra), il cui contenuto misura 214px — 42px più del riquadro. Risultato:
   la terza riga ("Terra") veniva tagliata a metà altezza del testo, senza
   nessuna barra di scorrimento visibile (tema scuro, nessuna ombra/fade
   indicativa): sembrava un rigo di testo rotto, non un elenco scorribile —
   sulla PRIMISSIMA schermata che un utente nuovo apre. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8939;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: togliere la sola regola che risolve il taglio,
   tornando esattamente al CSS di prima del 17/09 (`.hg-list` senza deroga
   per `#hgPonti`). */
const DIFETTO = [`#hgPonti{max-height:none;overflow:visible}`, ``];
let diffInjected = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); diffInjected++; }
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
const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html`);
await pg.waitForTimeout(1500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(diffInjected === 1, "il difetto è stato rimesso nella pagina servita", diffInjected);

const info = await pg.evaluate(() => {
  const el = document.getElementById("hgPonti");
  if (!el) return null;
  return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight };
});
dice(!!info, "#hgPonti esiste nella pagina", info);
dice(info && info.scrollHeight <= info.clientHeight,
  "#hgPonti mostra tutto il suo contenuto senza clipping (scrollHeight <= clientHeight)", info);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* LA SCHERMATA DENUNCIA DICEVA "RESTANO X M³" SENZA DIRE CHE È UN MASSIMO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-denuncia-residuo-massimo.mjs [--porta=8959]
     node terra-denuncia-residuo-massimo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Terra (18/09). Il fix
   di oggi su `prospettoDenuncia` (commit 220f7c9f) ha corretto il DOCUMENTO
   stampato perché annoti sia "Cumulato… (valore MINIMO)" sia "Residuo…
   (valore MASSIMO)" quando il pregresso non è dichiarato. La SCHERMATA
   della pagina Denuncia (#den-concesso, che il tecnico guarda per primo,
   prima ancora di stampare) compone la propria narrazione direttamente in
   index.html — e restava con SOLO metà dell'avviso: diceva "il cumulato è
   quindi un minimo" ma non diceva mai che il residuo, di conseguenza, è la
   cifra più alta possibile. Il cartellone "Vita cava" (altra sezione della
   stessa app) la dice giusta su entrambi i lati da tempo: qui mancava la
   stessa frase gemella.
   La demo di Terra ha già, senza bisogno di nessuna iniezione, un caso in
   cui il pregresso non è dichiarato e c'è scavo misurato: il banco misura
   esattamente quello stato naturale. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09 sera. */
const DIFETTO = [
  "            + (R.pregressoDichiarato ? \"\" : ` Il <b>già estratto prima di Terra</b> non è dichiarato: il cumulato è quindi un <b>minimo</b> e il residuo la cifra <b>più alta possibile</b>.`)",
  "            + (R.pregressoDichiarato ? \"\" : ` Il <b>già estratto prima di Terra</b> non è dichiarato: il cumulato è quindi un <b>minimo</b>.`)",
];
/* LO SCENARIO, non il difetto: la demo dichiara di suo l'estratto pregresso
   (880.000 m³), quindi non esercita il caso «pregresso non dichiarato». Si
   inietta SEMPRE (anche nel giro normale) togliendo quel numero dal titolo
   della dimostrazione — non è il difetto sotto esame, è la premessa che lo
   rende osservabile. */
const SCENARIO = ["estrattoPregressoM3: 880000, materiale:", "estrattoPregressoM3: null, materiale:"];
let iniezioniDifetto = 0, iniezioneScenario = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/terra/terra-data.js")) {
    const t = corpo.toString("utf8");
    if (t.includes(SCENARIO[0])) { corpo = Buffer.from(t.replace(SCENARIO[0], SCENARIO[1]), "utf8"); iniezioneScenario++; }
  }
  if (CONTROPROVA && p.endsWith("apps/terra/index.html")) {
    const t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { corpo = Buffer.from(t.replace(DIFETTO[0], DIFETTO[1]), "utf8"); iniezioniDifetto++; }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("den-concesso")?.innerHTML.length || 0) > 0 || document.body.textContent.length > 500); }
dice(pronto, "la pagina di Terra è pronta (in dimostrazione)");
await vaiA(pg, "terra", "nav-den");
await pg.waitForTimeout(300);

const testo = await pg.evaluate(() => document.getElementById("den-concesso")?.textContent || "");
console.log(iniezioneScenario === 1 ? "lo scenario (pregresso non dichiarato) è stato iniettato nella demo" : `⛔ iniezione di scenario riuscita: ${iniezioneScenario}/1 — l'ancora non ha combaciato`);
if (CONTROPROVA) console.log(iniezioniDifetto === 1 ? "il difetto è stato rimesso nella pagina servita" : `⛔ iniezione riuscita: ${iniezioniDifetto}/1 — l'ancora non ha combaciato`);

dice(iniezioneScenario === 1, "lo scenario (nessun pregresso dichiarato) è stato applicato alla demo", iniezioneScenario);
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(/il cumulato è quindi un minimo/.test(testo), "premessa: la demo ha il caso vero (pregresso non dichiarato, scavo misurato)", testo.slice(0, 400));
dice(/residuo|cifra.*alta/.test(testo) && /(residuo la cifra|il residuo).*(alta|massim)/i.test(testo),
  "⛔ e la pagina dice ANCHE che il residuo è la cifra più alta possibile, non solo che il cumulato è un minimo", testo.slice(0, 500));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

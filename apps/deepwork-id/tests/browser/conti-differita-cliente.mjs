/* LA FATTURA DIFFERITA, PRIMA DI SCEGLIERE IL CLIENTE, NON MOSTRA UN TOTALE MISTO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-differita-cliente.mjs [--porta=8935]
     node conti-differita-cliente.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Conti (17/09, agente
   a5fa955d5c679000d). «Fattura differita dai DDT» si presenta come
   l'anteprima di UNA fattura per UN cliente solo (lo dice il placeholder
   "Scegli il cliente": "La fattura differita mette insieme i DDT di un
   solo cliente"). Ma `pesateDaFatturare(pesate, clienteId, ...)` con
   `clienteId` vuoto non filtra affatto — è il suo contratto generale,
   provato da un test suo in run-kpi.mjs — e `difVisibili()` in
   apps/conti/index.html lo chiamava sempre con `$("dif-cli").value` senza
   guardia. Effetto, prima di questa unità: aprendo la sezione senza aver
   ancora scelto un cliente, la lista mostrava e la spunta selezionava di
   default TUTTI i DDT non fatturati di TUTTI i clienti insieme, e
   «Totale fattura» sommava imponibile/IVA di ragioni sociali diverse
   (Edilcave + Stradesud) in un unico numero — tranquillo, verde, e senza
   nessun rapporto con una fattura reale possibile. Il solo argine era al
   momento dell'emissione (bottone finale), quando l'anteprima fuorviante
   era già stata letta. Corretto rendendo `difVisibili()` vuota finché
   `dif-cli` non ha un valore: il placeholder "Scegli il cliente" torna
   raggiungibile davvero, e `fatturaDaPesate([])` (che ritorna `null`)
   lascia `dif-tot` vuoto invece di un totale misto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8935;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. */
const DIFETTO = [
  `  function difVisibili() {
    if (!$("dif-cli").value) return [];
    return pesateDaFatturare(PES, $("dif-cli").value, $("dif-dal").value, $("dif-al").value);
  }`,
  `  function difVisibili() {
    return pesateDaFatturare(PES, $("dif-cli").value, $("dif-dal").value, $("dif-al").value);
  }`,
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    const n = t.split(DIFETTO[0]).length - 1;
    if (n !== 1) console.log(`⛔ INIEZIONE MANCATA nella pagina: ${n} soggetti invece di 1`);
    else { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-fat");
await pg.waitForTimeout(700);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-fat"), "navigazione alla pagina delle fatture", vive);

// ── Senza cliente scelto: nessun DDT misto, nessun totale ──
const senzaCliente = await pg.evaluate(() => ({
  cliValue: document.getElementById("dif-cli")?.value ?? "??",
  listTxt: document.getElementById("dif-list")?.innerText ?? "",
  totHtml: document.getElementById("dif-tot")?.innerHTML ?? "",
}));
dice(senzaCliente.cliValue === "", "il cliente non è ancora scelto (stato di partenza della sezione)", senzaCliente.cliValue);
dice(/Scegli il cliente/i.test(senzaCliente.listTxt), "la lista mostra il placeholder «Scegli il cliente», non dei DDT", senzaCliente.listTxt.slice(0, 200));
dice(senzaCliente.totHtml.trim() === "", "e il riquadro dei totali resta vuoto: nessun imponibile/IVA/totale misto fra clienti", senzaCliente.totHtml.slice(0, 300));

// ── Con un cliente scelto: i DDT tornano, e sono solo i suoi ──
await pg.selectOption("#dif-cli", "c1");
await pg.waitForTimeout(500);
const conCliente = await pg.evaluate(() => ({
  listTxt: document.getElementById("dif-list")?.innerText ?? "",
  totTxt: document.getElementById("dif-tot")?.innerText ?? "",
}));
dice(/DDT/.test(conCliente.listTxt) || /Nessun DDT da fatturare/.test(conCliente.listTxt),
  "scelto Edilcave (c1), la lista torna a mostrare DDT (o dichiara che non ce ne sono, mai il placeholder generico)", conCliente.listTxt.slice(0, 200));
dice(!/Scegli il cliente/i.test(conCliente.listTxt), "e il placeholder «scegli il cliente» sparisce", conCliente.listTxt.slice(0, 200));

if (CONTROPROVA) dice(iniezioniDifetto > 0, "(ripetuto) il difetto è entrato nella pagina servita", iniezioniDifetto);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

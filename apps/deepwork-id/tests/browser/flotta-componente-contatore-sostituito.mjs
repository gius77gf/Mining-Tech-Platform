/* LA VITA DI UN COMPONENTE TIENE CONTO DEL CONTATORE SOSTITUITO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-componente-contatore-sostituito.mjs [--porta=8942]
     node flotta-componente-contatore-sostituito.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass su Flotta (17/09, agente
   aff43964bd31baec6). `vitaComponenti` era l'unica funzione a ore del file
   a non passare da `azzeramentiDelMezzo`/`contatoreDelTagliando`: un
   pneumatico montato sul VECCHIO contatore, letto contro il mezzo dopo che
   il contatore è stato sostituito, usciva con una "vita" calcolata come se
   fossero lo stesso contatore — un numero piccolo, tranquillo, e falso
   (la gomma è montata da mesi, non da poche ore).
   Qui si inietta un rifornimento con `contatoreNuovo:true` (lo stesso
   meccanismo che l'app usa già per registrare una sostituzione vera) datato
   DOPO il montaggio del pneumatico della dimostrazione (2025-11-10), e si
   porta `m1.ore` a un valore plausibile sul contatore NUOVO: il pannello
   deve smettere di mostrare un numero e mostrare la ragione vera. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8942;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: il contatore di Escavatore E1 sostituito il 01/06/2026 (dopo il
   montaggio del pneumatico, 10/11/2025), e il mezzo oggi a 300h sul nuovo
   contatore — mai sul disco, solo nella risposta HTTP. */
const CASO_ORE = ['{ id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5870,', '{ id: "m1", nome: "Escavatore E1 — CAT 352", ore: 300,'];
const CASO_RESET = ['{ id: "r1", data: isoIndietro(18), mezzo: "Escavatore E1", litri: 480, euro: 720, ore: 5812, nota: "cisterna cava", costoId: null },',
  '{ id: "r1", data: isoIndietro(18), mezzo: "Escavatore E1", litri: 480, euro: 720, ore: 5812, nota: "cisterna cava", costoId: null },\n    { id: "rReset", data: "2026-06-01", mezzo: "Escavatore E1", litri: 400, euro: 600, ore: 100, oreVecchie: 5870, contatoreNuovo: true, nota: "contatore sostituito (TEST)", costoId: null },'];

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09.
   ⏱️ RI-ANCORATO il 18/09 (dal delta della ricerca continua, tredicesimo
   giro): i due `return` sul ramo "non calcolabile" hanno guadagnato
   `pctVita`/`stato` quando è arrivata la soglia di vita dichiarata — il
   codice si è mosso perché è migliorato, la vecchia citazione a tre campi
   non combaciava più. */
const DIFETTI = [
  [`  const azzeramenti = azzeramentiDelMezzo(letture || [], nomeMezzo);
  return eventi.map(c => {
    if (ore == null) return { ...c, vitaOre: null, calcolabile: false, perche: "le ore attuali del mezzo non sono note", pctVita: null, stato: "non-giudicato" };
    if (azzeramenti.length) {
      const contatore = contatoreDelTagliando({ scrittaIl: c.data }, azzeramenti);
      if (!contatore.calcolabile) return { ...c, vitaOre: null, calcolabile: false, perche: contatore.perche, pctVita: null, stato: "non-giudicato" };
    }
    const vita = Math.round((ore - c.montatoAOre) * 100) / 100;`,
   `  return eventi.map(c => {
    if (ore == null) return { ...c, vitaOre: null, calcolabile: false, perche: "le ore attuali del mezzo non sono note", pctVita: null, stato: "non-giudicato" };
    const vita = Math.round((ore - c.montatoAOre) * 100) / 100;`],
];
let iniezioniDifetto = 0, iniezioniCaso = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) {
    let t = corpo.toString("utf8");
    if (t.includes(CASO_ORE[0])) { t = t.replace(CASO_ORE[0], CASO_ORE[1]); iniezioniCaso++; }
    if (t.includes(CASO_RESET[0])) { t = t.replace(CASO_RESET[0], CASO_RESET[1]); iniezioniCaso++; }
    if (CONTROPROVA) { for (const [a, b] of DIFETTI) if (t.includes(a)) { t = t.replace(a, b); iniezioniDifetto++; } }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
await pg.waitForTimeout(2000);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCaso === 2, "il caso (contatore sostituito) è stato iniettato nella risposta HTTP", iniezioniCaso);
if (CONTROPROVA) dice(iniezioniDifetto === 1, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-mez");
await pg.waitForTimeout(600);
await pg.evaluate(() => {
  const i = [...document.querySelectorAll("#mez-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || ""));
  i?.querySelector("[data-scheda-mezzo]")?.click();
});
await pg.waitForTimeout(700);
const testoComp = await pg.evaluate(() => document.getElementById("sch-comp")?.innerText || "");
dice(/Pneumatico/i.test(testoComp), "la scheda mostra il pneumatico", testoComp.slice(0, 300));
dice(!/\b200[.,]?0?\s*h\b/i.test(testoComp), "e NON mostra la vita sbagliata calcolata sul contatore nuovo (200 h)", testoComp.slice(0, 400));
dice(/sostituito|vecchio contatore/i.test(testoComp), "ma la ragione vera: contatore sostituito", testoComp.slice(0, 400));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

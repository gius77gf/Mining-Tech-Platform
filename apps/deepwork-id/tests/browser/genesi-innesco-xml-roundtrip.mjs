/* IL GIRO DI ANDATA E RITORNO DEL PIANO DI INNESCO XML: L'INNESCO NON SI PERDE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-innesco-xml-roundtrip.mjs [--porta=8768]
     node genesi-innesco-xml-roundtrip.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il commento accanto a `fileXmlIn.onchange` (genesi.html)
   racconta un difetto già trovato e corretto il 07/08: esportando un piano
   con innesco ELETTRONICO e riaprendolo in una pagina nuova, l'innesco
   rientrava sempre **Nonel** (il default) — il campo per cui questo XML
   in stile IREDES esiste, perché sposta lo scatter dell'innesco da 0,1 ms
   a 8,0 ms, OTTANTA VOLTE, senza che nulla lo dica a schermo. La cura era
   una riga: leggere `<Initiation id="…">` e applicarla a `D2.innesco` se
   nel vocabolario di casa.
   Cercato un banco che rifaccia questo giro dal vivo: `grep -rl
   "btn-innesco-xml-in\|fileXmlIn" apps/deepwork-id/tests/browser/*.mjs`
   → zero file. Il fix del 07/08 era stato verificato a mano, non con una
   prova che resta. Questo banco lo ripete come banco vero: esporta con
   ELETTRONICO, cambia innesco a mano (per non leggere per caso lo stato
   giusto), reimporta lo stesso file, e pretende ELETTRONICO di nuovo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8768;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 07/08:
   il lettore non guardava affatto <Initiation>, quindi D2.innesco restava
   quello che era già in pagina (Nonel, il default) invece di quello del file. */
const DIFETTI = [
  [`const innEl=first(plan,'Initiation'), innId=innEl?String(innEl.getAttribute('id')||'').trim():'';
    if(innId && INNESCHI.some(x=>x.id===innId)) D2.innesco=innId;`, ``],
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) {
      const n = t.split(a).length - 1;
      if (n === 1) { t = t.replace(a, b); iniezioniDifetto++; }
      else console.log(`⛔ INIEZIONE MANCATA: "${a.slice(0, 60)}…" trovata ${n} volte invece di 1`);
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
const pg = await b.newPage({ viewport: { width: 1200, height: 900 }, acceptDownloads: true });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html`);
await pg.waitForTimeout(1500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto === DIFETTI.length, `il difetto è stato rimesso nella pagina servita (${iniezioniDifetto}/${DIFETTI.length})`, iniezioniDifetto);

await pg.click('.card[data-go="design"]');
await pg.waitForTimeout(800);

const prima = await pg.evaluate(() => window.__genesi.D2.innesco);
dice(!!prima, "l'innesco di partenza è leggibile", prima);

// forza l'innesco a ELETTRONICO — quello per cui questo XML esiste
await pg.evaluate(() => { window.__genesi.D2.innesco = "elettronico"; });
const impostato = await pg.evaluate(() => window.__genesi.D2.innesco);
dice(impostato === "elettronico", "l'innesco è impostato a elettronico prima di esportare", impostato);

const [download] = await Promise.all([
  pg.waitForEvent("download"),
  pg.evaluate(() => document.getElementById("btn-innesco-xml")?.click()),
]);
const path = await download.path();
const xml = readFileSync(path, "utf8");
dice(xml.includes('<Initiation id="elettronico">'), "il file esportato porta l'innesco elettronico", xml.slice(0, 400));

// cambia l'innesco a mano PRIMA di reimportare: se il lettore non
// guardasse <Initiation>, D2.innesco resterebbe quello che imposto qui
// (nonel) invece di tornare elettronico — è esattamente il difetto del 07/08
await pg.evaluate(() => { window.__genesi.D2.innesco = "nonel"; });
const primaReimport = await pg.evaluate(() => window.__genesi.D2.innesco);
dice(primaReimport === "nonel", "prima di reimportare, l'innesco è stato cambiato a nonel di proposito", primaReimport);

await pg.setInputFiles("#fileXmlIn", path);
await pg.waitForTimeout(400);
const dopoReimport = await pg.evaluate(() => window.__genesi.D2.innesco);
dice(dopoReimport === "elettronico",
  `⛔ dopo il reimport l'innesco torna ELETTRONICO, non resta nonel (letto: ${dopoReimport})`, dopoReimport);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

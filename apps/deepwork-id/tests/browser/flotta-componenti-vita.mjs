/* FLOTTA · I COMPONENTI A VITA PROPRIA, VERIFICATI NEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-componenti-vita.mjs [--porta=8891]
     node flotta-componenti-vita.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 16/09 (dal delta della ricerca continua, undicesimo
   giro — prima fetta) Flotta ha guadagnato `componentiDelMezzo`/
   `vitaComponenti`: pneumatici, cingoli e denti benna esistevano solo come
   voce di checklist o riga di costo, mai come "questo pezzo ha fatto N ore
   su QUESTO mezzo". La funzione pura è provata a fondo in run-kpi.mjs coi
   suoi casi limite (date inesistenti, ore mancanti, montaggio a ore più
   alte di quelle attuali). Ma il PRIMO collegamento vero alla pagina aveva
   un difetto che nessun test `node` poteva vedere: `componentiDelMezzo`
   filtra per `c.mezzo === nomeMezzo`, e `m.componenti` (l'array scritto
   sulla scheda del mezzo, senza un campo `.mezzo` proprio perché è già
   scoperto a QUEL mezzo) veniva passato insieme al NOME del mezzo — la
   combinazione che il filtro esiste apposta per gestire quando i dati
   arrivano MISTI da più mezzi insieme, non quando arrivano già scoperti.
   Risultato: il pannello "Componenti a vita propria" mostrava sempre lo
   stato vuoto, anche con due componenti veri in demo — zero errori di
   sintassi, zero prove rosse, perché il filtro internamente funzionava
   esattamente come progettato, solo sul contratto sbagliato per questo
   punto di chiamata.

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO. Rimettere la chiamata con
   `m.nome` al posto di `null` come secondo argomento: il pannello torna
   silenziosamente vuoto, e nessuna suite `node` se ne accorge perché la
   funzione pura, chiamata con la firma "giusta" nei suoi test, si comporta
   benissimo — è la pagina che la chiama con la firma sbagliata. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8891;
const CONTROPROVA = process.argv.includes("--controprova");

const DIFETTO = [
  "const vc = vitaComponenti(m.componenti || [], null, m.ore, f.rifornimenti);",
  "const vc = vitaComponenti(m.componenti || [], m.nome, m.ore, f.rifornimenti);",
];
let iniezioniDifetto = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/flotta/index.html")) {
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
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-mez");
await pg.waitForTimeout(600);
await pg.evaluate(() => {
  const i = [...document.querySelectorAll("#mez-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || ""));
  i?.querySelector("[data-scheda-mezzo]")?.click();
});
await pg.waitForTimeout(700);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-sch"), "navigazione alla scheda del mezzo (Escavatore E1, con due componenti in demo)", vive);

const html = await pg.locator("#sch-comp").innerHTML();
dice(/[Pp]neumatico/.test(html), "il pannello mostra il pneumatico registrato in demo", html.slice(0, 200));
dice(/[Dd]enti benna/.test(html), "e i denti benna", html.slice(0, 200));
/* Escavatore E1 ha 5.870 h; il pneumatico è montato a 4.000 h (vita 1.870),
   i denti benna a 5.500 h (vita 370): due numeri diversi, non un doppione
   né uno zero di comodo. */
dice(/1\.?870/.test(html), "la vita del pneumatico è 5.870 − 4.000 = 1.870 h, non le ore totali del mezzo", html);
dice(/\b370\b/.test(html), "la vita dei denti benna è 5.870 − 5.500 = 370 h", html);
dice(!/[Nn]essun componente registrato/.test(html), "e NON lo stato vuoto: i componenti ci sono, il difetto li nasconderebbe", html.slice(0, 200));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

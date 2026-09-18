/* IL POPUP DEL FORO E LA TIMELINE MOSTRANO IL TEMPO DI PROGETTO, NON LO
   SCATTER SORTEGGIATO DALLA SIMULAZIONE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-timing-nominale.mjs [--porta=8959]
     node genesi-timing-nominale.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal backlog QA su Genesi (18/09), task #16. `buildSim`
   somma apposta allo scatter d'innesco un tempo casuale a ogni ricalcolo
   della simulazione (`f.tNom=f.tDet; f.tDet=f.tDet+scatter`), per mostrare
   che i detonatori non sparano tutti all'istante esatto. Il tempo NOMINALE
   (di progetto) resta accanto, in `f.tNom` — esattamente come già successo
   per la profondità e il borraggio, corretto cinque volte in questo stesso
   file — ma il popup del foro (`holeInfoShow`, "spara a N ms") e il titolo
   di ogni tacca della timeline (`buildTicks`) leggevano `f.tDet` grezzo: un
   foro progettato a 42 ms poteva dire «spara a 44 ms», un numero diverso a
   ogni ricalcolo della stessa identica volata.
   La POSIZIONE della tacca sulla timeline resta sul tempo vero (`f.tDet`):
   è quello il momento in cui l'animazione lo fa sparare davvero, e la
   timeline serve anche da scrubber. Solo l'ETICHETTA cambia.
   Verificato dal vivo: forzando uno scatter di +5000 ms sul primo foro
   (tNom=0, tDet=5000), il popup diceva "spara a 5000 ms" — ora dice
   "spara a 0 ms" — e il titolo della prima tacca allo stesso modo, mentre
   la sua posizione resta al 5000/tEnd. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8959;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO_POPUP = [
  `    +'<br>spara a <b>'+Math.round((f.tNom!=null?f.tNom:f.tDet)||0)+' ms</b>'`,
  `    +'<br>spara a <b>'+Math.round(f.tDet||0)+' ms</b>'`,
];
const DIFETTO_TICK = [
  `    d.title = 'foro '+(f.i+1)+' · '+(f.tNom!=null?f.tNom:f.tDet)+' ms';   // ⛔ 18/09: l'ETICHETTA è il tempo di progetto, non lo scatter — vedi holeInfoShow`,
  `    d.title = 'foro '+(f.i+1)+' · '+f.tDet+' ms';`,
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
      if (t.includes(DIFETTO_POPUP[0])) { t = t.replace(DIFETTO_POPUP[0], DIFETTO_POPUP[1]); iniezioniDifetto++; }
      if (t.includes(DIFETTO_TICK[0])) { t = t.replace(DIFETTO_TICK[0], DIFETTO_TICK[1]); iniezioniDifetto++; }
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

// forziamo uno scatter grande e leggibile sul primo foro: progettato a 0 ms, "sorteggiato" a 5000 ms
await pg.evaluate(() => {
  const f = window.__genesi.SIM.fori[0];
  f.tNom = 0; f.tDet = 5000;
  window.__genesi.holeInfoShow(window.__genesi.xrayCyls[0]);
});
const popup = await pg.evaluate(() => document.getElementById("holeInfo")?.innerHTML || "");
dice(/spara a <b>0 ms<\/b>/.test(popup), "il popup del foro dice «spara a 0 ms» (il progetto), non «5000 ms» (lo scatter)", popup.slice(0, 160));
dice(!/spara a <b>5000 ms<\/b>/.test(popup), "e non compare più il tempo sorteggiato", popup.slice(0, 160));

// e la tacca della timeline sullo stesso foro (buildTicks diretto, non
// rebuild(): quello richiamerebbe buildSim() e cancellerebbe lo scatter
// forzato qui sopra con un nuovo sorteggio)
await pg.evaluate(() => window.__genesi.buildTicks());
const tick0 = await pg.evaluate(() => {
  const t = document.querySelectorAll("#ticks .tick")[0];
  return t ? { title: t.title, left: t.style.left } : null;
});
dice(!!tick0 && /· 0 ms$/.test(tick0.title), "e il titolo della prima tacca dice «· 0 ms», non lo scatter sorteggiato", tick0);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

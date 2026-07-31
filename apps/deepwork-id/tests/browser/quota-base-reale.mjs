/* LA QUOTA DI BASE È NEL SISTEMA DEL RILIEVO, NON IN QUELLO DEL VISORE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node quota-base-reale.mjs [--porta=8497]
     node quota-base-reale.mjs --controprova   (toglie l'offset: DEVE fallire)

   PERCHÉ ESISTE. Il visore toglie il baricentro dalla nuvola per disegnarla,
   quindi `zBase` e la scatola del ritaglio nascono nel SUO sistema. Salvati
   così finivano nel verbale che va all'ente, scritti come quote in metri: su un
   cono con la base a 340 m il foglio diceva **−2,85 m**.

   Non è un errore che si nota: è **plausibile e falso**. E nessuna prova `node`
   poteva vederlo — quelle su `descriviOrigine` verificano che la frase DICA la
   quota, non che la quota sia nel sistema giusto. È venuto fuori guardando uno
   screenshot, e una difesa che dipende da chi guarda non è una difesa.

   LA FORMA GENERALE, che non dipende dal cono: la quota di base deve cadere
   **dentro l'intervallo Z della nuvola caricata**. Un piano di base fuori dalla
   nuvola non è una stima imprecisa, è un numero di un altro sistema. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8497;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

let iniezioni = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si rimette il difetto — la quota senza l'offset — nella
     risposta HTTP, mai nel file. */
  if (CONTROPROVA && p.endsWith("nuvola-poc.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of [
      ["quotaBase: _q(v.zBase, offset.z),", "quotaBase: v.zBase,"],
      ["', base '+(v.zBase+offset.z).toLocaleString(", "', base '+(v.zBase).toLocaleString("],
    ]) { iniezioni += t.split(a).length - 1; t = t.replace(a, b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));

/* Un cono di volume noto, GEOREFERENZIATO (coordinate metriche vere): è la
   georeferenziazione che crea l'offset grande, cioè la condizione in cui il
   difetto si manifesta. Base a quota 340, altezza 6 m. */
const ZMIN = 340, ZMAX = 346;
const righe = [];
for (let x = -15; x <= 15; x += 0.4) for (let y = -15; y <= 15; y += 0.4) {
  const d = Math.hypot(x, y); if (d > 15) continue;
  righe.push(`${(500000 + x).toFixed(3)} ${(4500000 + y).toFixed(3)} ${(ZMIN + 6 * (1 - d / 15)).toFixed(3)}`);
}
const xyz = righe.join("\n");

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 1100, height: 900 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 180))}` : ""}`); }
};

console.log(`\n════════ la quota di base è nel sistema del rilievo?${CONTROPROVA ? " · controprova" : ""} ════════`);
console.log(`   nuvola di prova: ${righe.length} punti, Z fra ${ZMIN} e ${ZMAX} m (cono r=15 h=6, georeferenziato)`);

await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/nuvola-poc.html`);
await pg.waitForTimeout(1800);
await pg.evaluate(() => { try { localStorage.removeItem("genesiNuvole"); } catch (e) {} });
await pg.setInputFiles("#file", { name: "cono_cava.xyz", mimeType: "text/plain", buffer: Buffer.from(xyz, "utf8") });
await pg.waitForTimeout(2600);

dice(errori.length === 0, "il visore non solleva errori", errori[0]);

const letto = await pg.evaluate(() => {
  let rec = null;
  try { const a = JSON.parse(localStorage.getItem("genesiNuvole") || "[]"); rec = a[a.length - 1] || null; } catch (e) {}
  return { riga: (document.getElementById("cropdim") || {}).textContent || "", rec };
});
dice(!!letto.rec && !!letto.rec.calcolo, "il visore ha salvato i parametri del calcolo", letto.rec);

const c = (letto.rec && letto.rec.calcolo) || {};
dice(Number.isFinite(+c.quotaBase), "la quota di base è un numero", c);

/* ⛔ LA PROVA CHE CONTA, e non dipende dalla forma della nuvola */
dice(Number.isFinite(+c.quotaBase) && +c.quotaBase >= ZMIN - 1 && +c.quotaBase <= ZMAX + 1,
  `⛔ la quota di base cade DENTRO l'intervallo Z della nuvola (${ZMIN}–${ZMAX} m)`, c.quotaBase);

/* e la stessa cosa per la scatola del ritaglio: un ritaglio fuori dalla nuvola
   è un ritaglio di un altro sistema di coordinate */
const r = c.ritaglio || {};
dice(Number.isFinite(+r.z0) && +r.z0 >= ZMIN - 3 && +r.z1 <= ZMAX + 3,
  "e la Z del ritaglio è nello stesso sistema", r);
dice(Number.isFinite(+r.x0) && +r.x0 > 100000,
  "e la X del ritaglio è in coordinate vere, non centrate sullo zero", r);

/* la riga sotto il visore dice la stessa cosa dello schermo: chi legge il
   foglio e chi guarda l'app non devono vedere due numeri diversi */
dice(/base 3[34]\d/.test(String(letto.riga)),
  "la riga sotto il visore mostra la stessa quota", letto.riga.replace(/\s+/g, " ").slice(-90));

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} sostituzioni nella risposta HTTP`);
  if (iniezioni === 0) { console.log("⚠️ NESSUNA INIEZIONE: la controprova non prova niente"); process.exit(3); }
  console.log(ko >= 2 ? "✓ il banco SA fallire: senza l'offset la quota esce dal sistema del rilievo"
                      : "⚠️ troppo poche cadute");
  process.exit(ko >= 2 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

/* SENTINELLA: UN SUPERAMENTO CON TARATURA "REGOLARE" NASCONDEVA UNA LETTURA
   SENZA NESSUNA TARATURA CHE LA COPRA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-badge-scoperta.mjs [--porta=8768]
     node sentinella-badge-scoperta.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal quinto giro di deep-pass QA (19/09). `statoTaraturaStrumento`
   guarda solo se la taratura è valida OGGI, e la dimostrazione ha già il caso
   vero: «Vibrazioni V2 — confine Nord» ha due certificati con un buco di dieci
   giorni fra il primo (scade 2026-06-30) e il secondo (parte 2026-07-10), e una
   lettura del 2026-07-06 ci cade dentro. Oggi il secondo certificato è valido,
   quindi il badge della lista punti taceva — mentre `coperturaTaratura`/il file
   per l'ARPA già dicevano "scoperta". Il punto è comunque "Conforme" (la soglia
   che conta è quella del ricettore, 20 mm/s, non il campo grezzo dello
   strumento): il difetto non riguarda l'esito di conformità, riguarda la sola
   riserva sulla taratura. Nessuna fixture iniettata: il caso è quello vero
   della dimostrazione, per non aggiungerne uno sintetico dove ce n'è già uno
   reale. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8768;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: la pagina torna a decidere il badge solo dal
   calendario di oggi, ignorando la copertura storica delle letture. */
const DIFETTI = [
  [`const scopBadge = tar.stato === "regolare" && contaCoperture(m.tarature, m.letture).scoperta\n        ? BADGE_LETTURE_SCOPERTE : null;`,
   `const scopBadge = null;`],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__sentinella-badge-scoperta-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-badge-scoperta-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`, { waitUntil: "domcontentloaded" });
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("mon-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Sentinella è pronta (in dimostrazione)");
await pg.evaluate(() => { if (window.go) window.go("mon"); });
await pg.waitForTimeout(400);

const rigaV2 = await pg.evaluate(() => {
  const items = [...document.querySelectorAll("#mon-list .item")];
  const it = items.find((e) => e.textContent.includes("Vibrazioni V2"));
  return it ? it.innerHTML : null;
});
dice(!!rigaV2, "la riga di «Vibrazioni V2 — confine Nord» c'è nella lista", rigaV2 && rigaV2.length);
dice(!!rigaV2 && !/Taratura scaduta|Taratura in scadenza|Taratura non dichiarata/.test(rigaV2),
  "premessa: la taratura di OGGI è regolare, nessun badge del calendario", rigaV2);
dice(!!rigaV2 && /Letture senza taratura/.test(rigaV2),
  "⛔ e compare il badge «Letture senza taratura»: quella lettura cade nel buco fra i due certificati", rigaV2);

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

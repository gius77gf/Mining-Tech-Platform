/* FLOTTA · «IL PRIMO DEI DUE» — un tagliando con ore E data, premuto (11/09)
   Uso: node flotta-primo-dei-due.mjs [--porta=8747] [--controprova]
   La dimostrazione non ha un tagliando con tutt'e due le scadenze (di
   proposito: le prove assolute vivono sui suoi numeri), quindi i casi si
   INIETTANO nella risposta HTTP del modulo — il file di prodotto non si tocca:
     · nP — Escavatore E1 (5.870 h): a 6.370 h O entro dieci giorni fa → la
       DATA è scaduta mentre le ore sono lontane: il badge deve essere «Scaduta»
       in rosso (prima le ore lo nascondevano in verde);
     · nQ — Escavatore E1: a 5.880 h O fra 400 giorni → le ORE comandano
       («tra 10 h»);
     · nX — un mezzo che NON è nel parco, a 5.900 h O fra cinque giorni → per
       data («5 gg»), e nel Quadro la riga c'è (prima spariva: contatore
       ignoto = riga saltata).
   Si legge la lista dell'Officina (frase e badge), il Quadro (le priorità) e
   la scheda dell'ordine (frase e badge), a 320 e 390 px.
   Controprova: tre difetti — la lista che torna a «se ha le ore comandano le
   ore», il modulo che sceglie sempre le ore, le priorità senza il ramo
   «entrambi». */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8747;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const OGGI = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const fraGiorni = (n) => iso(new Date(OGGI.getTime() + n * 86400000));
const it = (s) => s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4);
const D_SCADUTA = fraGiorni(-10), D_LONTANA = fraGiorni(400), D_VICINA = fraGiorni(5);
const FIX = `
DEMO.manutenzioni.push(
  { id: "nP", titolo: "Tagliando 500 h — primo dei due", mezzo: "Escavatore E1", dataPrevista: "${D_SCADUTA}", orePreviste: 6370, ogniOre: 500, ogniMesi: 12, piano: "500", scrittaIl: "${iso(OGGI)}" },
  { id: "nQ", titolo: "Filtri — primo dei due", mezzo: "Escavatore E1", dataPrevista: "${D_LONTANA}", orePreviste: 5880, ogniOre: 250, ogniMesi: 24, piano: "250", scrittaIl: "${iso(OGGI)}" },
  { id: "nX", titolo: "Tagliando del camion fuori parco", mezzo: "Camion K1", dataPrevista: "${D_VICINA}", orePreviste: 5900, ogniOre: 500, ogniMesi: 6, piano: "500", scrittaIl: "${iso(OGGI)}" });
`;
const DIFETTI = [
  ["apps/flotta/index.html",
   '    const urgDi = (n) => { const m = MEZ.find(x => x.nome.split(" — ")[0] === n.mezzo);\n      return urgenzaManutenzione(n, m ? m.ore : null, azzeramentiDelMezzo(RIF, n.mezzo)); };',
   '    const urgDi = (n) => { if (n.orePreviste) return urgTagliando(n, MEZ.find(x => x.nome.split(" — ")[0] === n.mezzo)); return urgenza(n.dataPrevista); };   /* difetto rimesso dal banco */'],
  ["apps/flotta/flotta-data.js",
   "    const prima = rd < ro ? ud : uo, dopo = prima === uo ? ud : uo;",
   "    const prima = uo, dopo = ud;   /* difetto rimesso dal banco: comandano sempre le ore */"],
  ["apps/flotta/flotta-data.js",
   "    if (n.orePreviste && n.dataPrevista && oreN != null) {",
   "    if (false) {   /* difetto rimesso dal banco */"],
];
const difettiRimessi = new Set();   // per pezzo: la pagina si serve due volte (320 e 390)
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) corpo = Buffer.from(corpo.toString("utf8") + FIX, "utf8");
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, no) => { srv.on("error", no); srv.listen(PORTA, "127.0.0.1", r); })
  .catch((e) => { console.error(`✗ porta ${PORTA} non disponibile: ${e.message}`); process.exit(2); });
const c = await fetch(`http://127.0.0.1:${PORTA}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: sulla porta risponde qualcun altro"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
const rigaDi = (pg, sel, titolo) => pg.evaluate(([sel, titolo]) => {
  const i = [...document.querySelectorAll(sel + " .item")].find((x) => (x.querySelector(".name")?.textContent || "").includes(titolo));
  if (!i) return null;
  const badges = [...i.querySelectorAll(".badge")].map((b) => b.textContent.replace(/\s+/g, " ").trim() + "|" + [...b.classList].join("."));
  return { meta: (i.querySelector(".meta")?.textContent || "").replace(/\s+/g, " ").trim(), badges };
}, [sel, titolo]);

for (const W of [320, 390]) {
  console.log(`\n── ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
  await pg.waitForTimeout(1500);

  // 1 · il Quadro: le priorità
  const pP = await rigaDi(pg, "#alert-list", "primo dei due");
  dice(pP && /danger/.test(pP.badges[0] || "") && /il primo dei due/.test(pP.meta), "⛔ Quadro: il tagliando con la DATA scaduta e le ore lontane è in rosso, col dettaglio che nomina tutt'e due", pP);
  const pX = await rigaDi(pg, "#alert-list", "camion fuori parco");
  dice(pX && /warn/.test(pX.badges[0] || "") && /previsto/.test(pX.meta), "⛔ Quadro: il mezzo fuori dal parco con la data fra 5 giorni ha la sua riga (prima spariva)", pX);

  // 2 · l'Officina: la lista
  await pg.click("#nav-man"); await pg.waitForTimeout(500);
  const lP = await rigaDi(pg, "#man-list", "Tagliando 500 h — primo dei due");
  dice(lP && lP.meta.includes(`A 6.370 ore motore o entro il ${it(D_SCADUTA)}, il primo dei due`), "lista: la frase dice ore E data, «il primo dei due»", lP);
  dice(lP && lP.meta.includes("piano: ogni 500 h o ogni 12 mesi, il primo dei due"), "lista: e il piano dice tutt'e due i passi", lP);
  dice(lP && lP.badges.some((x) => /^Scaduta\|.*danger/.test(x)), "⛔ lista: il badge è «Scaduta» in rosso — la data comanda, le ore lontane non la nascondono", lP && lP.badges);
  const lQ = await rigaDi(pg, "#man-list", "Filtri — primo dei due");
  dice(lQ && lQ.badges.some((x) => /^tra 10 h\|.*warn/.test(x)), "lista: con le ore a 10 dal traguardo e la data fra 400 giorni comandano le ore («tra 10 h»)", lQ && lQ.badges);
  const lX = await rigaDi(pg, "#man-list", "camion fuori parco");
  dice(lX && lX.badges.some((x) => /^5 gg\|.*warn/.test(x)) && !lX.badges.some((x) => /^a 5\.900 h/.test(x)), "⛔ lista: il mezzo fuori dal parco ha «5 gg» per data, non «a 5.900 h» senza colore", lX && lX.badges);

  // 3 · la scheda dell'ordine
  await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /primo dei due/.test(x.querySelector(".name")?.textContent || "")); i && i.click(); });
  await pg.waitForTimeout(600);
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-odl")).display !== "none"), "l'ordine di lavoro si apre");
  const odl = await pg.evaluate(() => ({ badges: [...document.querySelectorAll("#odl-testa .badge")].map((b) => b.textContent.replace(/\s+/g, " ").trim()), sotto: [...document.querySelectorAll("#odl-testa .sch-sotto")].map((e) => e.textContent.replace(/\s+/g, " ").trim()).join(" · ") }));
  dice(odl.badges.includes("Scaduta"), "ordine: il badge dell'urgenza è «Scaduta»", odl.badges);
  dice(odl.sotto.includes(`Tagliando a 6.370 ore motore o entro il ${it(D_SCADUTA)}, il primo dei due`) && odl.sotto.includes("si ripete ogni 500 h o ogni 12 mesi, il primo dei due"), "ordine: la frase dice ore E data, e il piano tutt'e due i passi", odl.sotto);

  dice(errori.length === 0, "nessun errore di pagina", errori);
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "la pagina non scorre in orizzontale");
  await pg.close();
}
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`\niniezioni che hanno trovato il loro pezzo: ${difettiRimessi.size} su ${DIFETTI.length}`);
  if (difettiRimessi.size !== DIFETTI.length) { console.log("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: coi difetti rimessi il banco CADE (${ko} KO su ${ok + ko}).` : "✗ controprova: coi difetti rimessi il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato primo dei due: ${ok} passati, ${ko} falliti`);
process.exit(ko > 0 ? 1 : 0);

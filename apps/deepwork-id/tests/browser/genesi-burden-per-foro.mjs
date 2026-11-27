/* G45 — IL PANNELLO «BURDEN PER FORO» (15/09, dal secondo giro di ricerca su
   Genesi): un pannello nella scheda Progetto 2D che elenca il burden vero di
   TUTTI i fori insieme, letto da `h.burdenVero`/`h.burdenLoc` — già scritti
   su ogni foro da `computeEnergia2D` a ogni rigenerazione della maglia,
   sempre. Nessun import, nessun calcolo nuovo: solo lettura e presentazione.
   Uso:
     node genesi-burden-per-foro.mjs [--porta=8754]
     node genesi-burden-per-foro.mjs --controprova   (rimette il difetto: DEVE fallire)

   COSA GUARDA QUESTO BANCO:
   1. il bottone esiste ed è raggiungibile dalla scheda Progetto 2D;
   2. cliccato SENZA maglia, dice di disegnarla prima (non un riquadro vuoto,
      non un errore in console);
   3. cliccato CON la maglia, il pannello elenca un foro per riga, col numero
      giusto (sequenza di sparo) e la coppia progetto→vero;
   4. un foro sotto l'85% del burden di progetto è marcato «oltre» (rosso) e
      contato nell'avviso in cima; uno dentro la soglia no — la SOGLIA VERA,
      non solo «il pannello non è vuoto»;
   5. un foro senza uno dei due numeri (maglia non ancora arrivata fin lì) è
      dichiarato «non calcolabile», non disegnato con un burden inventato —
      il principio del fondatore applicato a questo pannello. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8754;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: la soglia dell'85% tolta, così ogni foro coperto
   risulta sempre "dentro" — esattamente il difetto già confermato a mano
   (vedi run-kpi.mjs, test «burdenPerForo»). Se il testo non c'è più perché il
   codice è cambiato per un'altra ragione, l'iniezione lo dichiara invece di
   fingere di aver colpito. */
const DIFETTI = [
  [`burdenVero < burdenProgetto * 0.85 ? 'oltre' : 'dentro'`, `'dentro'`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__genesi-burden-per-foro-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-burden-per-foro-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

const DESIGN = { B: 2.8, S: 3.2, diam: 102, prof: 11, kg: 62, kgAuto: false, stem: 2.4, sub: 1.0,
  incl: 0, esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare",
  frat: "media", bagnato: false, presplit: false, sequenza: "diagonale", perRow: 8, file: 2,
  ritardo: 25, ritardoFila: 42, decks: 1, deckStem: 1.0,
  recNorma: "din-res", recFreq: 25, recDist: 350, dir: "sx" };

async function apri() {
  const pg = await b.newPage({ viewport: { width: 1400, height: 950 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.addInitScript((arg) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Cava di prova",
      data: "2026-09-14", sintesi: "16 fori", design: arg }]));
  }, DESIGN);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="vX"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1600);
  return pg;
}

console.log(`\n════════ Genesi: burden per foro${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apri();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
const hasBtn = await pg.$("#btn-burden-foro");
dice(!!hasBtn, "il bottone «Burden per foro (dalla maglia)» esiste nella scheda Progetto 2D");

// ── 1 · SENZA MAGLIA: si dichiara, non un vuoto muto ────────────────────
console.log("\n· senza maglia");
await pg.evaluate(() => { window.__genesi.D2.holes = []; });
if (hasBtn) await pg.click("#btn-burden-foro");
await pg.waitForTimeout(200);
const vuotoTx = await pg.evaluate(() => document.getElementById("d2-burden-esito")?.innerText || "");
dice(/[Dd]isegna prima la maglia/.test(vuotoTx), "senza fori il pannello chiede di disegnare la maglia, non tace", vuotoTx);

// ── 2 · CON LA MAGLIA VERA (aperta dal progetto salvato) ────────────────
console.log("\n· con la maglia del progetto aperto");
const pg2 = await apri();
const nFori = await pg2.evaluate(() => window.__genesi.D2.holes.length);
dice(nFori === DESIGN.file * DESIGN.perRow, `la maglia ha i ${DESIGN.file * DESIGN.perRow} fori del progetto aperto`, nFori);
const hasBtn2 = await pg2.$("#btn-burden-foro");
if (hasBtn2) await pg2.click("#btn-burden-foro");
await pg2.waitForTimeout(300);
const righe = await pg2.evaluate(() => {
  const box = document.getElementById("d2-burden-esito");
  return box ? box.innerText : "";
});
dice(righe.length > 20, "il pannello si riempie (non un riquadro vuoto)", righe.length);
dice(/→/.test(righe) && /m$/m.test(righe.trim()) || /m\n/.test(righe), "il pannello mostra progetto→vero in metri", righe.slice(0, 200));

// ── 3 · LA SOGLIA VERA: inietto io i numeri, in memoria, sulla pagina già
//        aperta — non un file finto, la STESSA maglia del progetto con due
//        fori alterati ────────────────────────────────────────────────
console.log("\n· la soglia dell'85% distingue davvero (iniezione in memoria sulla maglia vera)");
await pg2.evaluate(() => {
  const H = window.__genesi.D2.holes;
  H[0].burdenLoc = 3; H[0].burdenVero = 3;        // dentro: rapporto 1.0
  H[1].burdenLoc = 3; H[1].burdenVero = 2.4;       // oltre: 0.8 < 0.85
  H[2].burdenLoc = 3; H[2].burdenVero = null;      // non calcolabile
});
await pg2.click("#btn-burden-foro");
await pg2.waitForTimeout(300);
const dati = await pg2.evaluate(() => {
  const box = document.getElementById("d2-burden-esito");
  if (!box) return null;
  return { html: box.innerHTML, testo: box.innerText };
});
dice(!!dati && /non calcolabile/.test(dati.testo), "il foro senza burdenVero è dichiarato «non calcolabile», non a zero", dati && dati.testo.slice(0, 300));
dice(!!dati && /#ef5350/.test(dati.html), "il foro sotto l'85% è colorato di rosso (#ef5350)", dati && dati.html.slice(0, 400));
dice(!!dati && /85%/.test(dati.testo), "l'avviso in cima cita la soglia dell'85%", dati && dati.testo.slice(0, 200));

/* non si conta il totale dei rossi (la maglia vera può avere altri fori
   naturalmente sotto l'85%, indipendenti dall'iniezione): si guarda SOLO se
   la riga «3,00 → 3,00» (il foro dentro, iniettato) e la riga «3,00 → 2,40»
   (il foro oltre, iniettato) portano il colore giusto CIASCUNA — la domanda
   che questo banco esiste per fare, non un conteggio globale */
const rigaDentro = dati ? (dati.html.match(/<div class="r">3,00 → 3,00 m[\s\S]*?<\/div>/) || [])[0] : null;
const rigaOltre = dati ? (dati.html.match(/<div class="r">3,00 → 2,40 m[\s\S]*?<\/div>/) || [])[0] : null;
dice(!!rigaDentro && !/#ef5350/.test(rigaDentro), "il foro dentro (3,00 → 3,00) NON è rosso", rigaDentro);
dice(!!rigaOltre && /#ef5350/.test(rigaOltre), "il foro oltre (3,00 → 2,40) È rosso", rigaOltre);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nel modulo servito (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

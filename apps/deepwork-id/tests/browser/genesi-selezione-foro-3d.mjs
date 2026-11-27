/* SELEZIONE DI UN FORO NELLA VISTA RAGGI-X (click reale sulla scena 3D,
   `holeInfoShow`/`holeInfoHide`, genesi.html ~2929-2951) — copertura
   nuova più UN DIFETTO VERO trovato e corretto il 21/09, con
   `--controprova`.

   COPERTURA. `genesi-timing-nominale.mjs` prova già che il popup mostra
   il tempo NOMINALE, ma chiama `window.__genesi.holeInfoShow(...)`
   DIRETTAMENTE — non ha mai cliccato un foro vero nella scena. La
   selezione richiede la vista Raggi-X attiva (`layers.lXray`, il
   pointerdown handler esce subito se `!xrayGroup.visible`): questo
   banco clicca DAVVERO un foro (raycasting via `holeScreenPos`),
   verifica il guard quando i raggi-X sono spenti, il cambio di
   selezione fra due fori, e la chiusura col bottone ✕.

   IL DIFETTO (misurato dal vivo PRIMA di guardare il codice, poi letto
   riga per riga). Selezionato un foro, spegnendo il layer "Raggi-X
   progetto" da checkbox il popup **restava aperto** — `Foro N · spara
   a… ms` sopra una scena in cui i cilindri raggi-X erano appena
   spariti (`xrayGroup.visible=false`), e `holeSel` restava puntato a
   un oggetto ormai invisibile con l'emissive ancora alzata. Il loop
   `for(const id of Object.keys(layers))` che monta l'`onchange` di
   TUTTI i layer non sapeva nulla del foro selezionato: nessuna delle
   sue eccezioni esistenti (`lQuote`→`quotaApplica`, `lAudio`→i booms)
   copriva `lXray`. La cura: quando `lXray` passa a spento, si chiama
   `holeInfoHide()` — la stessa funzione già usata dal bottone ✕ e da
   "seleziona un altro foro", non una nuova.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-selezione-foro-3d.mjs [--porta=8769]
     node genesi-selezione-foro-3d.mjs --controprova   (rimette il difetto: DEVE fallire) */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8769;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il loop degli `onchange` prima della cura. */
const DIFETTI = [
  [`  $(id).onchange = e=>{ layers[id] = e.target.checked; if(id==='lQuote') quotaApplica();
    if(id==='lXray' && !layers.lXray) holeInfoHide();   // 21/09: senza i raggi-X il foro selezionato non è più visibile, il popup non deve restare orfano
    renderSim(simT, true); if(id==='lAudio'&&playing){ cancelAudio(); if(layers.lAudio) scheduleBooms(); } };`,
   `  $(id).onchange = e=>{ layers[id] = e.target.checked; if(id==='lQuote') quotaApplica(); renderSim(simT, true); if(id==='lAudio'&&playing){ cancelAudio(); if(layers.lAudio) scheduleBooms(); } };`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-selezione-foro-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-selezione-foro-${process.pid}`)).text();
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

async function apriSim() {
  const pg = await b.newPage({ viewport: { width: 1200, height: 800 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="sim"]');
  await pg.waitForTimeout(300);
  return pg;
}
const clic = async (pg, i) => {
  const p = await pg.evaluate((i) => window.__genesi.holeScreenPos(i), i);
  await pg.mouse.click(p.x, p.y);
  await pg.waitForTimeout(150);
};
const stato = (pg) => pg.evaluate(() => ({
  display: document.getElementById("holeInfo").style.display,
  sel: window.__genesi.holeSel,
}));

console.log(`\n════════ Genesi: selezione di un foro nella vista Raggi-X${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriSim();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const nHoles = await pg.evaluate(() => window.__genesi.xrayCyls.length);
dice(nHoles > 0, `la volata di default ha fori da poter selezionare (letto ${nHoles})`, nHoles);

// --- senza i raggi-X, cliccare un foro non fa nulla (guard sul pointerdown) ---
await clic(pg, 0);
const sSenzaXray = await stato(pg);
dice(sSenzaXray.display !== "block" && sSenzaXray.sel === null,
  `senza il layer Raggi-X attivo, cliccare dove sta un foro non apre il popup (letto ${JSON.stringify(sSenzaXray)})`, sSenzaXray);

// --- con i raggi-X, il clic seleziona il foro giusto e mostra il tempo nominale ---
await pg.click("#lXray");
await pg.waitForTimeout(200);
await clic(pg, 0);
const sForo0 = await stato(pg);
const testo0 = await pg.evaluate(() => document.getElementById("holeInfo").innerText);
dice(sForo0.display === "block" && sForo0.sel && sForo0.sel.i === 0,
  `con i raggi-X attivi, cliccare il foro 0 lo seleziona (letto ${JSON.stringify(sForo0)})`, sForo0);
dice(/^Foro 1/.test(testo0), `il popup nomina il foro giusto, "Foro 1" per l'indice 0 (letto: ${JSON.stringify(testo0.split("\n")[0])})`, testo0);

// --- cliccando un secondo foro, la selezione passa a lui ---
await clic(pg, 3);
const sForo3 = await stato(pg);
const testo3 = await pg.evaluate(() => document.getElementById("holeInfo").innerText);
dice(sForo3.display === "block" && sForo3.sel && sForo3.sel.i === 3,
  `cliccando un secondo foro la selezione passa a quello (letto ${JSON.stringify(sForo3)})`, sForo3);
dice(/^Foro 4/.test(testo3), `il popup si aggiorna sul nuovo foro, "Foro 4" per l'indice 3 (letto: ${JSON.stringify(testo3.split("\n")[0])})`, testo3);

// --- il bottone ✕ chiude e deseleziona ---
await pg.click("#holeInfoX");
await pg.waitForTimeout(150);
const sChiuso = await stato(pg);
dice(sChiuso.display === "none" && sChiuso.sel === null,
  `il bottone ✕ chiude il popup e deseleziona il foro (letto ${JSON.stringify(sChiuso)})`, sChiuso);

// --- ⛔ IL DIFETTO CORRETTO IL 21/09: spegnendo "Raggi-X progetto" mentre
// un foro è selezionato, il popup non deve restare orfano. ---
await clic(pg, 0);
const sPrimaDiSpegnere = await stato(pg);
dice(sPrimaDiSpegnere.display === "block" && sPrimaDiSpegnere.sel && sPrimaDiSpegnere.sel.i === 0,
  `un foro è selezionato di nuovo, prima di spegnere i raggi-X (letto ${JSON.stringify(sPrimaDiSpegnere)})`, sPrimaDiSpegnere);
await pg.click("#lXray");
await pg.waitForTimeout(150);
const sDopoSpento = await stato(pg);
dice(sDopoSpento.display === "none" && sDopoSpento.sel === null,
  `⛔ spegnendo "Raggi-X progetto" il popup del foro selezionato si chiude, non resta orfano su una vista che non c'è più (letto ${JSON.stringify(sDopoSpento)})`, sDopoSpento);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

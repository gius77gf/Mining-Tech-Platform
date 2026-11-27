/* MODELLAZIONE 3D DEL FRONTE (trascinamento delle maniglie cresta/piede
   nella scena 3D, `#btnModella`/`mdlDrag`/`mdlUndo`/`mdlRedo`/`mdlReset`,
   genesi.html ~2968-3132) — copertura nuova, NESSUN difetto storico noto
   da riprodurre. Trovata SENZA copertura: `genesi-struttura.mjs` censisce
   solo l'ESISTENZA nel DOM di `mdlQuote`/`mdlTools`/`mdlR`/`mdlUndo`/
   `mdlRedo`/`mdlReset` (riga 167), nessun banco fa mai un trascinamento
   vero sulla scena 3D — a differenza dell'editor 2D (`genesi-tratti.mjs`,
   `genesi-d2-undo.mjs`), che è testato a fondo.
   Come per `genesi-timeline-play-scrub.mjs`: nessun `DIFETTI`/
   `--controprova` qui, per la stessa ragione dichiarata in quel file — un
   banco di comportamento non ha bisogno di un difetto finto per
   giustificarsi, solo gli STRUMENTI di misura devono provare di saper
   fallire.

   PER TROVARE LA POSIZIONE SCHERMO di una maniglia (sfera Three.js
   raycastata da `pointerdown`), il ponte di debug `window.__genesi` ha
   guadagnato `mdlHandleScreenPos(i, tipo)` (proiezione 3D→schermo via
   `cam`) e i getter `modella`/`mdlUndoLen`/`mdlRedoLen` — stesso pattern
   già in uso per `seek`/`look`/`setParam`: "hook di debug, inerte in
   produzione" (genesi.html riga 8332). Comportamento misurato PRIMA di
   scrivere le asserzioni (`docs/` non li documentava): il raggio
   d'influenza di default (20%) è largo abbastanza da muovere TUTTE le 9
   maniglie con una gaussiana simmetrica attorno a quella trascinata —
   non solo la maniglia toccata.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-modella-fronte-3d.mjs [--porta=8765] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8765;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(readFileSync(p));
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-modella-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-modella-${process.pid}`)).text();
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
const stato = (pg) => pg.evaluate(() => ({
  modella: window.__genesi.modella,
  profilo: window.__genesi.P.profilo,
  piede: window.__genesi.D2.piede,
  undoLen: window.__genesi.mdlUndoLen,
  redoLen: window.__genesi.mdlRedoLen,
  undoDisabled: document.getElementById("mdlUndo").disabled,
  redoDisabled: document.getElementById("mdlRedo").disabled,
}));
async function trascina(pg, i, tipo, dySchermo) {
  const p0 = await pg.evaluate(([i, tipo]) => window.__genesi.mdlHandleScreenPos(i, tipo), [i, tipo]);
  await pg.mouse.move(p0.x, p0.y);
  await pg.mouse.down();
  await pg.mouse.move(p0.x, p0.y + dySchermo, { steps: 8 });
  await pg.mouse.up();
  await pg.waitForTimeout(150);
}

console.log(`\n════════ Genesi: modellazione 3D del fronte (trascinamento cresta/piede) ════════`);

const pg = await apriSim();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const s0 = await stato(pg);
dice(!s0.modella, `prima di entrare in modellazione, "modella" è falso (letto ${s0.modella})`, s0);

await pg.click("#btnModella");
await pg.waitForTimeout(200);
const s1 = await stato(pg);
dice(s1.modella && s1.undoLen === 0 && s1.redoLen === 0 && s1.undoDisabled && s1.redoDisabled,
  `entrati in modellazione: "modella" vero, Annulla/Ripristina disabilitati (letto ${JSON.stringify(s1)})`, s1);

// --- clic senza spostamento: non deve sporcare la cronologia (mdlUp, riga ~3101) ---
await trascina(pg, 4, "cresta", 0);
const sClic = await stato(pg);
dice(sClic.undoLen === 0 && sClic.profilo.length === 0,
  `un clic sulla maniglia SENZA trascinare non crea una voce di cronologia (letto undoLen=${sClic.undoLen}, profilo.length=${sClic.profilo.length})`, sClic);

// --- trascinamento reale della maniglia di CRESTA centrale: la gaussiana d'influenza è simmetrica ---
await trascina(pg, 4, "cresta", 15);
const sDrag = await stato(pg);
dice(sDrag.profilo.length === 9 && sDrag.undoLen === 1 && sDrag.redoLen === 0 && !sDrag.undoDisabled && sDrag.redoDisabled,
  `il trascinamento scrive il profilo (9 punti) e apre una voce di cronologia (letto undoLen=${sDrag.undoLen}, redoLen=${sDrag.redoLen}, punti=${sDrag.profilo.length})`, sDrag);
const z = sDrag.profilo.map((p) => p.z);
dice(z[4] === Math.max(...z),
  `il picco della gaussiana è sulla maniglia trascinata, l'indice 4 (letto ${JSON.stringify(z)})`, z);
dice(Math.abs(z[3] - z[5]) < 1e-6 && Math.abs(z[2] - z[6]) < 1e-6 && Math.abs(z[1] - z[7]) < 1e-6 && Math.abs(z[0] - z[8]) < 1e-6,
  `l'influenza è simmetrica attorno alla maniglia trascinata (letto ${JSON.stringify(z)})`, z);

// --- Annulla: torna al profilo vuoto di partenza ---
await pg.click("#mdlUndo");
await pg.waitForTimeout(150);
const sUndo = await stato(pg);
dice(sUndo.profilo.length === 0 && sUndo.undoLen === 0 && sUndo.redoLen === 1,
  `Annulla riporta il profilo vuoto e sposta la voce su Ripristina (letto ${JSON.stringify({ len: sUndo.profilo.length, undoLen: sUndo.undoLen, redoLen: sUndo.redoLen })})`, sUndo);

// --- Ripristina: torna ESATTAMENTE al profilo trascinato ---
await pg.click("#mdlRedo");
await pg.waitForTimeout(150);
const sRedo = await stato(pg);
dice(JSON.stringify(sRedo.profilo) === JSON.stringify(sDrag.profilo) && sRedo.undoLen === 1 && sRedo.redoLen === 0,
  `Ripristina torna esattamente al profilo di prima dell'Annulla (letto ${sRedo.profilo.length} punti, undoLen=${sRedo.undoLen})`, sRedo);

// --- trascinamento della maniglia di PIEDE: scrive D2.piede, non P.profilo ---
await trascina(pg, 4, "piede", 15);
const sPiede = await stato(pg);
dice(Array.isArray(sPiede.piede) && sPiede.piede.length === 9,
  `il trascinamento del piede scrive D2.piede (9 punti, letto ${sPiede.piede?.length})`, sPiede);
const py = (sPiede.piede || []).map((p) => p.y);
dice(py[4] === Math.min(...py),
  `il piede si abbassa (y minima) esattamente sulla maniglia trascinata (letto ${JSON.stringify(py)})`, py);

// --- Fronte dritto: azzera profilo e piede insieme ---
await pg.click("#mdlReset");
await pg.waitForTimeout(150);
const sReset = await stato(pg);
dice(sReset.profilo.length === 0 && (sReset.piede || []).length === 0,
  `"Fronte dritto" azzera sia il profilo di cresta sia il piede (letto profilo=${sReset.profilo.length}, piede=${(sReset.piede || []).length})`, sReset);

// --- uscita dalla modellazione ---
await pg.click("#btnModella");
await pg.waitForTimeout(150);
const sExit = await pg.evaluate(() => ({ modella: window.__genesi.modella, toolsDisplay: document.getElementById("mdlTools").style.display }));
dice(!sExit.modella && sExit.toolsDisplay === "none",
  `uscendo dalla modellazione "modella" torna falso e il pannello si nasconde (letto ${JSON.stringify(sExit)})`, sExit);

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

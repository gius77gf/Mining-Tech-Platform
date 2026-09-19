/* L'ANNULLA PREMUTO A META' DI UN TRASCINAMENTO (G56b, 19/09) — IL DIFETTO
   TROVATO DAL DEEP-PASS QA SU G48-G56, VERIFICATO PRIMA COL CODICE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-drag-annulla.mjs [--porta=8764]
     node genesi-drag-annulla.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. `d2ApplySnap` (chiamata da Ctrl+Z/Ctrl+Y) RIMPIAZZA
   `D2.holes` con un array nuovo — ma `d2drag` (l'indice del foro in
   trascinamento: una variabile del MODULO, mai una proprietà di `D2`)
   restava invariato. Se l'utente preme Ctrl+Z mentre il mouse è ancora
   giù su un trascinamento — un gesto reale: la mano che tiene il tasto
   può muoversi mentre l'altra preme la scorciatoia — l'annulla veniva
   silenziosamente SOVRASCRITTO dalla prossima mossa del mouse: il
   trascinamento continuava a scrivere su `D2.holes[d2drag]` come se
   niente fosse successo, e il foro tornava a seguire il cursore invece
   di restare dov'era stato appena riportato. Nessun errore, nessun
   toast: l'utente preme Ctrl+Z, vede il foro tornare al suo posto per un
   istante, e lo vede ripartire da solo.
   CASO PEGGIORE, non provato qui perché richiede uno stato con MENO fori
   di quanti ne aveva la volta scorsa (es. un annulla che risale a prima
   di un'aggiunta): `D2.holes[d2drag]` diventa `undefined`, e
   l'assegnazione lancia — il trascinamento muore con un errore JS non
   gestito. Il caso qui sotto basta a provare il difetto e la cura senza
   dover costruire quello scenario più fragile. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8764;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: `d2ApplySnap` torna a NON azzerare `d2drag`/
   `d2dragPt` dopo aver rimpiazzato `D2.holes`/`profilo`/`piede`. */
const DIFETTI = [
  [`  d2drag=-1; d2dragPt=-1;
  computeSeq2D(); drawDesign2D(); renderScheda2D(); renderInspector(); syncTrattoUI();
}
function d2Undo(){`,
   `  computeSeq2D(); drawDesign2D(); renderScheda2D(); renderInspector(); syncTrattoUI();
}
function d2Undo(){`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-drag-annulla-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-drag-annulla-${process.pid}`)).text();
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

async function apriDesign() {
  const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="design"]');
  await pg.waitForTimeout(600);
  return pg; // tool 'fori' di partenza
}
/* Stesso helper di genesi-guida-allineamento.mjs: senza portare il canvas
   in vista, boundingBox() può cadere sotto il fondo del viewport appena
   la pagina cresce, e un mouse.move a quel punto non tocca NULLA. */
async function puntoVero(pg, mx, my) {
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}

console.log(`\n════════ Genesi: l'annulla premuto a metà di un trascinamento (G56b)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const holes0 = await pg.evaluate(() => window.__genesi.D2.holes);
dice(holes0.length > 0, `ci sono fori da trascinare (letti: ${holes0.length})`, holes0.length);
const bersaglio = holes0[0];
const originale = { mx: bersaglio.mx, my: bersaglio.my };

/* Il trascinamento vero: down sul foro, poi un primo movimento (che spinge
   lo stato pre-trascinamento sulla pila d'annulla, G47c-1). */
const pStart = await puntoVero(pg, bersaglio.mx, bersaglio.my);
await pg.mouse.move(pStart.x, pStart.y);
await pg.mouse.down();
await pg.waitForTimeout(100);
const pA = await puntoVero(pg, bersaglio.mx + 3, bersaglio.my + 2);
await pg.mouse.move(pA.x, pA.y);
await pg.waitForTimeout(150);
const dopoA = await pg.evaluate((idx) => window.__genesi.D2.holes[idx], holes0.indexOf(bersaglio));
dice(Math.abs(dopoA.mx - originale.mx) > 0.5 || Math.abs(dopoA.my - originale.my) > 0.5,
  `il foro si è davvero spostato dal trascinamento (letto: ${JSON.stringify(dopoA)}, originale ${JSON.stringify(originale)})`, dopoA);
const pilaDopoA = await pg.evaluate(() => window.__genesi.d2UndoLen);
dice(pilaDopoA === 1, `il primo movimento ha spinto UNO stato sulla pila d'annulla (letto: ${pilaDopoA})`, pilaDopoA);

/* IL CASO CHE CONTA: Ctrl+Z mentre il mouse è ANCORA giù. */
await pg.keyboard.press("Control+z");
await pg.waitForTimeout(150);
const dopoUndo = await pg.evaluate((idx) => window.__genesi.D2.holes[idx], holes0.indexOf(bersaglio));
dice(Math.abs(dopoUndo.mx - originale.mx) < 0.01 && Math.abs(dopoUndo.my - originale.my) < 0.01,
  `l'annulla riporta il foro alla posizione originale (letto: ${JSON.stringify(dopoUndo)}, originale ${JSON.stringify(originale)})`, dopoUndo);

/* Il mouse resta giù e si muove ancora — la mano che tiene il tasto può
   muoversi mentre l'altra ha appena premuto Ctrl+Z. */
const pB = await puntoVero(pg, bersaglio.mx + 6, bersaglio.my + 5);
await pg.mouse.move(pB.x, pB.y);
await pg.waitForTimeout(150);
const dopoMossaFantasma = await pg.evaluate((idx) => window.__genesi.D2.holes[idx], holes0.indexOf(bersaglio));
dice(Math.abs(dopoMossaFantasma.mx - originale.mx) < 0.01 && Math.abs(dopoMossaFantasma.my - originale.my) < 0.01,
  `⛔ il trascinamento è stato abbandonato dall'annulla: il foro NON deve rimettersi a seguire il mouse (letto: ${JSON.stringify(dopoMossaFantasma)}, atteso quello originale ${JSON.stringify(originale)})`,
  dopoMossaFantasma);

await pg.mouse.up();
await pg.waitForTimeout(100);
dice(pg.__err.length === 0, "nessun errore JS durante tutta la sequenza", pg.__err.slice(0, 2));

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

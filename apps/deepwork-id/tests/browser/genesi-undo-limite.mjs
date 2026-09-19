/* IL LIMITE DELLO STACK DI ANNULLA (G54, 19/09) — GIÀ SCRITTO NEL
   CODICE (`D2_UNDO_MAX=40`, 14/09, G33), MAI PROVATO. Il censimento CAD
   verificato (docs/RICERCA_GENESI_CAD.md, sezione 8) lo segnalava come
   «presunto sì, ma il limite non è misurato nel codice letto» — falso
   sul codice (il limite c'è, `if(d2UndoStack.length>D2_UNDO_MAX)
   d2UndoStack.shift()`), vero sulla PROVA: nessun banco lo esercitava.
   Una difesa scritta e mai messa alla prova non è diversa da una
   difesa che non esiste — CLAUDE.md, "una prova che non sa fallire non
   dimostra niente" — qui applicato al caso gemello: un codice che non
   è mai stato messo alla prova non si sa se regge.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-undo-limite.mjs [--porta=8768]
     node genesi-undo-limite.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Con più di 40 modifiche in un editing lungo, lo stack
   d'annulla deve restare limitato (niente crescita illimitata di
   memoria in una sessione che dura ore), e — la parte che una prova
   deve verificare, non solo leggere — le modifiche più VECCHIE del
   limite devono uscire per prime (FIFO, `shift()`), così annullare
   ripetutamente torna sempre allo stato più recente ancora in memoria,
   mai a uno stato a caso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8768;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il limite smette di togliere le voci più
   vecchie — lo stack cresce senza fondo. Con 45 modifiche, la 45esima
   prova (`d2UndoLen<=D2_UNDO_MAX`) deve cadere. */
const DIFETTI = [
  [`if(d2UndoStack.length>D2_UNDO_MAX) d2UndoStack.shift();`,
   `/* limite tolto per la controprova */`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. */
const SEGNO = join(R, "__genesi-undo-limite-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-undo-limite-${process.pid}`)).text();
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
  /* ⛔ stessa causa già presa in genesi-selezione-multipla.mjs/genesi-
     rifletti-selezione.mjs: il canvas nasce fuori dal viewport. */
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(150);
  return pg;
}
async function puntoVero(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}
async function clicSu(pg, mx, my) {
  const p = await puntoVero(pg, mx, my);
  await pg.mouse.move(p.x, p.y);
  await pg.mouse.down(); await pg.mouse.up();
  await pg.waitForTimeout(80);
}
/* ⛔ MISURATO SCRIVENDO QUESTO BANCO: `fill()` + `dispatchEvent("change")`
   (il pattern già usato altrove per un singolo valore, es.
   genesi-strati.mjs) fa scattare `dx.onchange` DUE volte per una sola
   chiamata — verificato incartando la funzione vera e contando le
   invocazioni, anche dispatciando l'evento via `page.evaluate` invece
   che con l'API di Playwright (stesso doppio scatto: non è la sua API,
   è l'evento sintetico su questo elemento in questo Chromium). Per un
   singolo valore è invisibile (il secondo giro scrive lo stesso
   numero, idempotente); qui avrebbe raddoppiato ogni spinta sullo
   stack d'annullo, falsando l'intero conto. La tastiera vera (clic per
   selezionare tutto, scrivi, Tab per uscire dal campo) scatta UNA sola
   volta, come un utente vero. */
async function scriviX(pg, valore) {
  await pg.locator("#diX").click({ clickCount: 3 });
  await pg.keyboard.type(String(valore));
  await pg.keyboard.press("Tab");
  await pg.waitForTimeout(60);
}

console.log(`\n════════ Genesi: il limite dello stack di annulla (G54)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const f0 = await pg.evaluate(() => { const h = window.__genesi.D2.holes[0]; return { mx: h.mx, my: h.my }; });
await clicSu(pg, f0.mx, f0.my);
const primaLen = await pg.evaluate(() => window.__genesi.d2UndoLen);
dice(primaLen === 0, "prima di modificare niente, lo stack è vuoto", primaLen);

/* IL CASO CHE CONTA: 45 modifiche vere (scrivere x a tastiera, il gesto
   più comune che spinge undo), cinque OLTRE il limite dichiarato. */
const MAX = await pg.evaluate(() => window.__genesi.D2_UNDO_MAX);
dice(MAX === 40, "il limite dichiarato nel codice è 40 (se cambia, questo banco lo segue)", MAX);
const N = MAX + 5;
for (let i = 0; i < N; i++) await scriviX(pg, (10 + i / 100).toFixed(2));
const dopoLen = await pg.evaluate(() => window.__genesi.d2UndoLen);
dice(dopoLen === MAX, `⛔ dopo ${N} modifiche lo stack resta a ${MAX}, non cresce senza fondo (letto ${dopoLen})`, dopoLen);

/* Le voci più VECCHIE escono per prime (FIFO): annullando tutte le
   `MAX` modifiche rimaste, si arriva al valore scritto alla modifica
   numero (N-MAX), non a quello della primissima (che è già stata
   scartata) né a un valore a caso. */
for (let i = 0; i < MAX; i++) await pg.click("#d2Undo");
await pg.waitForTimeout(150);
const atteso = +(10 + (N - MAX - 1) / 100).toFixed(2);
const finale = await pg.evaluate(() => window.__genesi.D2.holes[0].mx);
dice(Math.abs(finale - atteso) < 0.005,
  `⛔ annullando tutte le ${MAX} modifiche rimaste si torna al valore della più vecchia ANCORA in memoria (atteso ${atteso}, letto ${finale}) — non a quello della primissima, già scartata dal limite`,
  { atteso, finale });
const stackVuoto = await pg.evaluate(() => window.__genesi.d2UndoLen);
dice(stackVuoto === 0, "e lo stack è vuoto: il bottone «annulla» si disabilita", stackVuoto);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

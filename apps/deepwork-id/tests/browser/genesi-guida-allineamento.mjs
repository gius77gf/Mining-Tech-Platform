/* LA GUIDA DI ALLINEAMENTO IN Y DURANTE IL TRASCINAMENTO DI UN FORO (G56,
   19/09) — LA "PRIMA FETTA PICCOLA" DELLO SNAP MAGNETICO, DAL DELTA
   VERIFICATO DI docs/RICERCA_CONTINUA_GENESI.md (ricerca in background su
   snap magnetico/tracking dinamico).
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-guida-allineamento.mjs [--porta=8763]
     node genesi-guida-allineamento.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La ricerca ha trovato che G48 (l'aggancio a un estremo già
   disegnato) copre SOLO il ramo "tratto" di `d2Move`: trascinando un FORO
   (`D2.tool==='fori'`) non c'è nessun aiuto visivo di allineamento, e —
   verificato con un `grep` proprio prima di scrivere una riga — nessun
   banco di questa suite fa mai un trascinamento VERO (down→move→up) su un
   foro: ogni test esistente che tocca il canvas fa solo click (down
   immediatamente seguito da up sullo stesso punto). Questo banco copre
   PRIMA il trascinamento nudo (mai provato), POI la guida nuova.

   LA FORMA SCELTA, dichiarata nel commento del codice (G56): PURA
   anteprima visiva — se un'altra fila è entro tolleranza si disegna una
   riga tratteggiata sul suo `my`, ma il valore salvato del foro NON viene
   alterato. Lo snap magnetico vero (che sposterebbe il foro) è un passo
   successivo, non deciso qui: questo banco lo verifica esplicitamente
   (il foro resta dove il cursore l'ha portato, non dove la guida indica). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8763;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: la ricerca della fila vicina sparisce, resta
   solo l'azzeramento — cioè torna il comportamento di prima di G56, dove
   trascinare un foro non produce mai nessuna guida. Tocca solo il ramo
   di trascinamento dei FORI: gli altri usi di `d2AlignGuide` (dichiarazione,
   disegno) restano, ma la variabile non viene mai valorizzata. */
const DIFETTI = [
  [`  d2AlignGuide=null; const tolAY=6/D2._m.scale;
  for(let k=0;k<D2.holes.length;k++){ if(k===d2drag) continue; const oy=D2.holes[k].my; if(Math.abs(oy-my)<=tolAY){ d2AlignGuide=oy; break; } }`,
   `  d2AlignGuide=null;`],
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
const SEGNO = join(R, "__genesi-guida-allineamento-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-guida-allineamento-${process.pid}`)).text();
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
  return pg; // il tool 'fori' è quello di partenza (D2.tool:'fori' nello stato iniziale)
}
/* Stesso helper di genesi-snap-estremo.mjs: converte un punto in metri
   (mx,my) in coordinate di VIEWPORT assolute passando da `D2._m`, l'unico
   modo onesto di farlo perché tiene conto di un eventuale scarto fra la
   risoluzione interna del canvas e la sua dimensione CSS. */
async function puntoVero(pg, mx, my) {
  /* Con due file la pagina cresce (più campi validi, canvas più alto):
     senza portare il canvas in vista, `boundingBox()` può restituire un
     riquadro sotto il fondo del viewport, e un mouse.move a quel punto
     non tocca NULLA — misurato: `D2.sel` restava -1 dopo il mousedown,
     cioè il trascinamento non partiva mai, silenziosamente. */
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}
/* Scrittura reale nel campo N° file: clic + Ctrl+A + digitazione +
   Tab, non `fill()+dispatchEvent('change')` — quel pattern, misurato
   scrivendo G54, fa scattare l'onchange DUE volte. Qui una doppia
   chiamata a `applyDesign()` sarebbe innocua (idempotente), ma si segue
   comunque la tecnica giusta perché è quella che riproduce un utente vero. */
async function scriviCampo(pg, id, valore) {
  const loc = pg.locator("#" + id);
  await loc.click({ clickCount: 3 });
  await pg.keyboard.type(String(valore));
  await pg.keyboard.press("Tab");
  await pg.waitForTimeout(250);
}

console.log(`\n════════ Genesi: la guida di allineamento in Y sul trascinamento di un foro (G56)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => window.__genesi.D2.tool)) === "fori", "il tool di partenza è 'fori' (nessun clic su una scheda serve)");

/* Due file, così ci sono DUE righe distinte da 3 m l'una dall'altra (bf=B
   per costruzione, vedi genMaglia2D): riga 0 a my=B, riga 1 a my=2B. */
await scriviCampo(pg, "dFile", 2);
const { B, holes0 } = await pg.evaluate(() => ({ B: window.__genesi.D2.B, holes0: window.__genesi.D2.holes }));
dice(holes0.length > 0 && holes0.some(h => Math.abs(h.my - B) < 0.01) && holes0.some(h => Math.abs(h.my - 2 * B) < 0.01),
  `due file di fori generate, a my≈${B} e my≈${2 * B} (lette: ${[...new Set(holes0.map(h => h.my))].join(", ")})`, holes0.slice(0, 3));

/* Il foro bersaglio: il primo della SECONDA fila (my≈2B). Lo trasciniamo
   verso la prima fila (my≈B) passando per un punto lontano da entrambe
   (a metà strada, 0.5B di distanza da ciascuna: ben oltre qualunque
   tolleranza in pixel) prima di avvicinarci. */
const idx = holes0.findIndex(h => Math.abs(h.my - 2 * B) < 0.01);
dice(idx >= 0, `trovato un foro nella seconda fila (indice ${idx})`, idx);
const bersaglio = holes0[idx];

const pStart = await puntoVero(pg, bersaglio.mx, bersaglio.my);
await pg.mouse.move(pStart.x, pStart.y);
await pg.mouse.down();
await pg.waitForTimeout(150);

/* PASSO 1 — a metà strada fra le due file: nessuna guida, perché nessuna
   fila è vicina (1.5·B di distanza da ciascuna, con B tipicamente 1.5-8 m:
   la tolleranza del banco (6 px/scala) è nell'ordine dei centimetri). */
const pMeta = await puntoVero(pg, bersaglio.mx, 1.5 * B);
await pg.mouse.move(pMeta.x, pMeta.y);
await pg.waitForTimeout(150);
const guidaLontano = await pg.evaluate(() => window.__genesi.d2AlignGuide);
dice(guidaLontano === null, `nessuna guida a metà strada fra le due file (letto: ${JSON.stringify(guidaLontano)})`, guidaLontano);

/* PASSO 2 — a un centimetro dalla prima fila (my=B): la guida deve
   comparire, e deve indicare ESATTAMENTE il valore della fila (B), non un
   valore approssimato al cursore. */
const pVicino = await puntoVero(pg, bersaglio.mx, B + 0.01);
await pg.mouse.move(pVicino.x, pVicino.y);
await pg.waitForTimeout(150);
const guidaVicino = await pg.evaluate(() => window.__genesi.d2AlignGuide);
dice(guidaVicino !== null && Math.abs(guidaVicino - B) < 1e-6,
  `⛔ a 1 cm dalla prima fila la guida indica il suo my ESATTO (letto: ${guidaVicino}, atteso ${B})`, guidaVicino);

/* LA PARTE CHE CONTA DAVVERO (il vincolo dichiarato nel codice, G56): il
   valore del foro segue il cursore, NON scatta al valore della guida —
   la guida è un'anteprima, non uno snap magnetico vero. */
const holeDopo = await pg.evaluate((idx) => window.__genesi.D2.holes[idx], idx);
dice(Math.abs(holeDopo.my - (B + 0.01)) < 0.005 && Math.abs(holeDopo.my - B) > 0.005,
  `⛔ il foro resta al valore del cursore (${B + 0.01}), NON scatta al valore della guida (${B}) — letto: ${holeDopo.my}`, holeDopo);

/* PASSO 3 — mouseup: la guida sparisce (non resta appesa a schermo dopo
   che il trascinamento è finito). */
await pg.mouse.up();
await pg.waitForTimeout(150);
const guidaDopoUp = await pg.evaluate(() => window.__genesi.d2AlignGuide);
dice(guidaDopoUp === null, `la guida sparisce al rilascio del mouse (letto: ${JSON.stringify(guidaDopoUp)})`, guidaDopoUp);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

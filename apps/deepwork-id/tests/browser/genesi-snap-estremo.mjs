/* LO SNAP A UN ESTREMO GIÀ DISEGNATO (G48, 19/09) — L'ENDPOINT SNAP
   DELL'EDITOR 2D, IL DELTA VERIFICATO DEL CENSIMENTO CAD.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-snap-estremo.mjs [--porta=8762]
     node genesi-snap-estremo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. G34 (13/09) aggancia alla griglia; G48 aggancia a un
   vertice che esiste già sulla pianta (un punto di un tratto libero, del
   fronte o del piede) — quello che un CAD chiama "endpoint snap". La
   parte pura (`estremiDisegno`/`puntoSnapEstremo`) è provata in
   run-kpi.mjs; questo banco prova il COLLEGAMENTO nel canvas vero, che
   `node` non può vedere: il click che aggancia al punto esatto invece del
   punto grezzo sotto il dito, e l'anteprima (l'anello verde) che appare e
   sparisce mentre il cursore si avvicina e si allontana.

   IL CASO CHE CONTA: con lo snap alla griglia SPENTO (default, D2.snap
   inizializzato a false), un click a pochi centimetri da un punto
   esistente deve produrre ESATTAMENTE quel punto, non un punto vicino —
   se no lo snap non sta agganciando, sta solo sembrando di farlo perché
   il click era già preciso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8762;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: torna al SOLO snap alla griglia, come prima di
   G48 — un click vicino a un punto esistente non aggancia più a quel
   punto esatto, resta sul punto grezzo (o sul nodo di griglia, se
   accesa). Tocca solo il ramo "tratto" di d2Down: gli altri usi di
   `_snapXY` restano intatti. */
const DIFETTI = [
  [`let mx=(p.x-D2._m.startX)/D2._m.scale, my=(p.y-D2._m.faceY)/D2._m.scale;
    /* G48 — l'aggancio a un estremo già disegnato vince su quello alla
       griglia: chi sta chiudendo una polilinea sul fronte importato vuole
       il punto ESATTO del rilievo, non il nodo più vicino della griglia.
       10 px di tolleranza, nelle unità della mappa alla scala corrente. */
    const estremo=puntoSnapEstremo(estremiDisegno(D2.profilo, D2.piede, D2.tratti), mx, my, 10/D2._m.scale);
    if(estremo){ mx=estremo.x; my=estremo.y; } else { mx=_snapXY(D2, mx); my=_snapXY(D2, my); }`,
   `let mx=(p.x-D2._m.startX)/D2._m.scale, my=(p.y-D2._m.faceY)/D2._m.scale;
    mx=_snapXY(D2, mx); my=_snapXY(D2, my);`],
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
const SEGNO = join(R, "__genesi-snap-estremo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-snap-estremo-${process.pid}`)).text();
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
  await pg.click("#dtTratto");
  await pg.waitForTimeout(200);
  return pg;
}
/* Converte un punto in metri (coordinate della mappa) in coordinate di
   VIEWPORT assolute, come genesi-tratti.mjs ma con `mouse.move`/`mouse.down`
   invece di un click sul locator: un click/hover per POSIZIONE relativa a
   un elemento rifiuta di agire se qualcos'altro (qui `#d2-scheda`, il
   pannello sotto il canvas) intercetta quel punto — anche quando il punto
   è dentro il rettangolo del canvas per come lo calcola questa funzione. Il
   mouse vero non ha questo scrupolo: dispatcha dove gli si dice. */
async function puntoVero(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}
async function clicCanvas(pg, mx, my) {
  const p = await puntoVero(pg, mx, my);
  await pg.mouse.move(p.x, p.y);
  await pg.mouse.down(); await pg.mouse.up();
  await pg.waitForTimeout(150);
}
/* Sposta il mouse di N pixel-schermo veri da un punto della mappa, senza
   ripassare dalla conversione mappa→schermo: è la stessa unità in cui G48
   misura la sua tolleranza (10 px / scala), quindi un offset di pochi
   pixel-schermo resta dentro la finestra di aggancio qualunque sia la
   scala corrente — a differenza di un offset in METRI, che a uno zoom
   diverso potrebbe cadere fuori tolleranza o restare troppo vicino al
   punto di partenza per essere un test onesto. */
async function vicinoA(pg, mx, my, dxPx, dyPx) {
  const p = await puntoVero(pg, mx, my);
  return { x: p.x + dxPx, y: p.y + dyPx };
}
async function muoviA(pg, punto) { await pg.mouse.move(punto.x, punto.y); await pg.waitForTimeout(150); }
async function cliccaA(pg, punto) { await pg.mouse.move(punto.x, punto.y); await pg.mouse.down(); await pg.mouse.up(); await pg.waitForTimeout(150); }

console.log(`\n════════ Genesi: lo snap a un estremo già disegnato (G48)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => window.__genesi.D2.snap)) === false, "lo snap alla griglia parte spento (il caso che conta: solo G48 deve agganciare)");

/* Un primo tratto con due punti veri, da usare come bersaglio dello snap.
   Il punto VERO memorizzato (letto indietro, non assunto) può differire di
   qualche centesimo da (10,5)/(20,8): la conversione schermo→mappa passa
   dal riquadro del canvas in pixel CSS, e l'arrotondamento non è garantito
   zero. Per questo ogni confronto qui sotto usa il punto letto indietro
   come bersaglio, mai il numero che gli è stato chiesto. */
await clicCanvas(pg, 10, 5);
await clicCanvas(pg, 20, 8);
await pg.click("#dtTrattoFine");
await pg.waitForTimeout(200);
const t0 = await pg.evaluate(() => window.__genesi.D2.tratti);
dice(t0.length === 1 && t0[0].pts.length === 2 && t0[0].aperto === false,
  `il tratto bersaglio è chiuso con due punti (letto: ${t0.length} tratti, ${t0[0]?.pts.length} punti)`, t0);
const bersaglio = t0[0].pts[0];

/* L'ANTEPRIMA: avvicinandosi al bersaglio deve comparire (3 px veri di
   distanza, ben dentro i 10 px di tolleranza di G48), allontanandosi deve
   sparire. */
await muoviA(pg, await vicinoA(pg, bersaglio.x, bersaglio.y, 1, 1));
const hoverVicino = await pg.evaluate(() => window.__genesi.d2HoverSnap);
dice(hoverVicino && hoverVicino.x === bersaglio.x && hoverVicino.y === bersaglio.y,
  `l'anteprima aggancia al bersaglio (${bersaglio.x},${bersaglio.y}) quando il cursore è a 3 px (letto: ${JSON.stringify(hoverVicino)})`, hoverVicino);

await clicCanvas(pg, 27, 2); // solo per allontanare il cursore prima dell'hover: nessun effetto su D2 (nessun tratto aperto a quel punto ancora)
const hoverLontano = await pg.evaluate(() => window.__genesi.d2HoverSnap);
dice(hoverLontano === null, `l'anteprima sparisce quando il cursore è lontano da tutto (letto: ${JSON.stringify(hoverLontano)})`, hoverLontano);
const dopoHoverLontano = await pg.evaluate(() => window.__genesi.D2.tratti.length);
dice(dopoHoverLontano === 2, `il click di allontanamento apre comunque un secondo tratto (atteso, serve al prossimo controllo): ${dopoHoverLontano}`, dopoHoverLontano);

/* IL CASO CHE CONTA: un click a 3 px dal bersaglio aggancia ESATTAMENTE
   a quel punto, non al punto grezzo sotto il dito. Il tratto aperto dal
   click di allontanamento qui sopra viene tolto con Ctrl+Z, così il click
   di prova riparte da zero tratti aggiuntivi. */
await pg.keyboard.press("Control+z");
await pg.waitForTimeout(150);
await cliccaA(pg, await vicinoA(pg, bersaglio.x, bersaglio.y, 1, 1));
const t1 = await pg.evaluate(() => window.__genesi.D2.tratti);
const p1 = t1[1]?.pts?.[0];
dice(t1.length === 2 && p1 && p1.x === bersaglio.x && p1.y === bersaglio.y,
  `⛔ un click a 3 px dal bersaglio aggancia ESATTAMENTE a quel punto, non al punto grezzo (letto: ${t1.length} tratti, nuovo punto ${JSON.stringify(p1)}, bersaglio ${JSON.stringify(bersaglio)})`,
  t1);

/* Un click lontano da tutto non aggancia a niente: il secondo punto del
   tratto appena aperto resta vicino a dove il dito ha toccato, non al
   bersaglio (troppo lontano per la tolleranza di 10 px). */
await clicCanvas(pg, 27, 2);
const t2 = await pg.evaluate(() => window.__genesi.D2.tratti);
const p2 = t2[1]?.pts?.[1];
dice(p2 && Math.abs(p2.x - bersaglio.x) > 1 && Math.abs(p2.y - bersaglio.y) > 1,
  `un click lontano da ogni estremo esistente non aggancia al bersaglio (letto: ${JSON.stringify(p2)}, bersaglio ${JSON.stringify(bersaglio)})`, p2);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

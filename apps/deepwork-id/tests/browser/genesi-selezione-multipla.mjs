/* SELEZIONE MULTIPLA DEI FORI — LA PRIMA FETTA (G49, 19/09) — MAIUSC+CLIC
   PER AGGIUNGERE/TOGLIERE, "ELIMINA SELEZIONATI" PER L'AZIONE BATCH.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-selezione-multipla.mjs [--porta=8763]
     node genesi-selezione-multipla.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La parte pura (`foriSenzaId`) è provata in run-kpi.mjs;
   questo banco prova il GESTO nel canvas vero: il Maiusc+clic che aggiunge
   e toglie un foro dalla selezione senza toccare né il click singolo
   (che continua a selezionare un solo foro per l'ispettore) né la
   creazione di un foro nuovo su spazio vuoto (che deve restare invariata
   ANCHE con Maiusc premuto — è il caso che una guardia scritta al
   contrario romperebbe per primo).

   ⚠️ LA SCHEDA PROGETTO NASCE CON UNA MAGLIA GIÀ DISEGNATA (misurato
   scrivendo questo banco: 12 fori di default, non un canvas vuoto). I
   punti su cui si prova il gesto sono quindi letti DA `D2.holes` dopo
   l'apertura — mai assunti — perché un click "a vuoto" vicino a un foro
   che già c'è non ne crea uno nuovo: seleziona quello esistente, ed è
   proprio questo il caso che il banco deve provare, non un imprevisto da
   aggirare. */
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

/* IL DIFETTO DA RIMETTERE: il ramo Maiusc+clic sparisce, quindi un clic
   su un foro esistente con Maiusc premuto fa quello che faceva prima di
   G49 — lo seleziona per l'ispettore come un click normale — invece di
   aggiungerlo/toglierlo dalla selezione multipla. */
const DIFETTI = [
  [`if(D2.tool==='fori' && e.shiftKey && i>=0){
    const id=D2.holes[i].id;
    const k=D2.selMulti.indexOf(id);
    if(k>=0) D2.selMulti.splice(k,1); else D2.selMulti.push(id);
    e.preventDefault(); drawDesign2D(); syncSelMultiUI(); return;
  }
  if(!e.shiftKey && D2.selMulti.length){ D2.selMulti=[]; syncSelMultiUI(); }`,
   `if(!e.shiftKey && D2.selMulti.length){ D2.selMulti=[]; syncSelMultiUI(); }`],
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
const SEGNO = join(R, "__genesi-selezione-multipla-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-selezione-multipla-${process.pid}`)).text();
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
  /* ⛔ IL CANVAS NASCE FUORI DAL VIEWPORT (misurato: y≈1381 su una pagina
     alta 900px). `.click()` su un locator scorre da solo l'elemento in
     vista prima di agire — è per questo che G48 non se n'era accorto,
     avendo appena cliccato "#dtTratto" proprio accanto al canvas. Qui
     nessun click precedente porta lì vicino (lo strumento Fori è già
     attivo di default), quindi lo scorrimento va chiesto esplicitamente
     prima di usare il mouse "vero" — che, a differenza del locator, non
     scorre niente da solo. */
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(150);
  return pg; // tool "fori" è quello di default
}
/* Stessa difesa già scritta per G48: il mouse vero, coordinate di viewport
   assolute, mai una posizione relativa al locator (che rifiuta di agire
   se `#d2-scheda` intercetta il punto). */
async function puntoVero(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  return { x: box.x + rel.x * box.width, y: box.y + rel.y * box.height };
}
async function clicSu(pg, mx, my, { shift = false } = {}) {
  const p = await puntoVero(pg, mx, my);
  if (shift) await pg.keyboard.down("Shift");
  await pg.mouse.move(p.x, p.y);
  await pg.mouse.down(); await pg.mouse.up();
  if (shift) await pg.keyboard.up("Shift");
  await pg.waitForTimeout(150);
}
async function foro(pg, i) {
  // il foro VERO, letto da D2.holes[i] — mai un punto assunto: la scheda
  // nasce con una maglia già disegnata, cliccare "a vuoto" vicino a un
  // foro esistente lo selezionerebbe invece di crearne uno nuovo.
  return pg.evaluate((i) => { const h = window.__genesi.D2.holes[i]; return { id: h.id, mx: h.mx, my: h.my }; }, i);
}

console.log(`\n════════ Genesi: selezione multipla dei fori (G49)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => window.__genesi.D2.tool)) === "fori", "lo strumento Fori è quello di default");
const nIniziale = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(nIniziale >= 2, `la scheda progetto nasce con una maglia di almeno due fori (letto: ${nIniziale})`, nIniziale);

const f1 = await foro(pg, 0), f2 = await foro(pg, 1);

/* IL CASO CHE CONTA: Maiusc+clic su un foro esistente lo AGGIUNGE alla
   selezione multipla, senza cambiare il numero di fori né toccarne le
   coordinate. */
await clicSu(pg, f1.mx, f1.my, { shift: true });
const s1 = await pg.evaluate(() => window.__genesi.D2.selMulti);
const nDopo1 = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(nDopo1 === nIniziale, `Maiusc+clic su un foro esistente non ne crea uno nuovo (letto: ${nDopo1}, atteso ${nIniziale})`, nDopo1);
dice(Array.isArray(s1) && s1.length === 1 && s1[0] === f1.id,
  `⛔ Maiusc+clic aggiunge il foro alla selezione multipla (letto: ${JSON.stringify(s1)}, atteso [${f1.id}])`, s1);

await clicSu(pg, f2.mx, f2.my, { shift: true });
const s2 = await pg.evaluate(() => window.__genesi.D2.selMulti);
dice(s2.length === 2 && s2.includes(f1.id) && s2.includes(f2.id),
  `un secondo Maiusc+clic aggiunge anche l'altro foro (letto: ${JSON.stringify(s2)})`, s2);
const bottoneVisibile = await pg.evaluate(() => !document.getElementById("dtEliminaSel").hidden);
const bottoneTesto = await pg.evaluate(() => document.getElementById("dtEliminaSel").textContent);
dice(bottoneVisibile && /\(2\)/.test(bottoneTesto),
  `"Elimina selezionati" compare col conto giusto (letto: visibile=${bottoneVisibile}, testo="${bottoneTesto}")`, bottoneTesto);

/* Un secondo Maiusc+clic sullo STESSO foro lo TOGLIE (toggle). */
await clicSu(pg, f1.mx, f1.my, { shift: true });
const s3 = await pg.evaluate(() => window.__genesi.D2.selMulti);
dice(s3.length === 1 && s3[0] === f2.id,
  `un Maiusc+clic ripetuto sullo stesso foro lo toglie dalla selezione (letto: ${JSON.stringify(s3)}, atteso [${f2.id}])`, s3);

/* Un click SENZA Maiusc svuota la selezione multipla (non solo quella singola). */
const f3 = await foro(pg, 2);
await clicSu(pg, f3.mx, f3.my);
const s4 = await pg.evaluate(() => window.__genesi.D2.selMulti);
dice(Array.isArray(s4) && s4.length === 0,
  `un click senza Maiusc svuota la selezione multipla (letto: ${JSON.stringify(s4)})`, s4);

/* Rimettere la selezione su f1/f2 e provare l'eliminazione batch.
   ⛔ NON un `.click()` incondizionato: col difetto della controprova
   rimesso il bottone resta `hidden` per sempre (la selezione non si
   popola mai), e `.click()` su un elemento invisibile ASPETTA che
   diventi visibile invece di fallire — un banco appeso, non un KO. Si
   controlla la visibilità PRIMA, e si clicca solo se c'è qualcosa da
   cliccare: un bottone che resta nascosto quando dovrebbe comparire è
   già il difetto, non un motivo per bloccarsi in attesa di lui. */
await clicSu(pg, f1.mx, f1.my, { shift: true });
await clicSu(pg, f2.mx, f2.my, { shift: true });
const bottoneCliccabile = await pg.evaluate(() => !document.getElementById("dtEliminaSel").hidden);
dice(bottoneCliccabile, "il bottone «Elimina selezionati» è visibile prima di premerlo (se no il difetto è già qui)");
if (bottoneCliccabile) await pg.click("#dtEliminaSel");
await pg.waitForTimeout(200);
const dopo = await pg.evaluate(() => ({ holes: window.__genesi.D2.holes, selMulti: window.__genesi.D2.selMulti }));
dice(bottoneCliccabile && dopo.holes.length === nIniziale - 2, `"Elimina selezionati" toglie SOLO i due fori scelti (letto: ${dopo.holes.length}, atteso ${nIniziale - 2})`, dopo.holes.length);
dice(bottoneCliccabile && !dopo.holes.some((h) => h.id === f1.id || h.id === f2.id), "i due fori eliminati non sono più nell'array", dopo.holes);
dice(dopo.selMulti.length === 0, `la selezione multipla si svuota dopo l'eliminazione, o non è mai nata (letto: ${JSON.stringify(dopo.selMulti)})`, dopo.selMulti);
const bottoneDopo = await pg.evaluate(() => document.getElementById("dtEliminaSel").hidden);
dice(bottoneDopo, "il bottone torna nascosto quando non c'è più niente da eliminare");

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

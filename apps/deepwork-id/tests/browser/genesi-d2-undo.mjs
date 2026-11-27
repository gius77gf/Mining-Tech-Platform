/* L'ANNULLA/RIPRISTINA DELL'EDITOR 2D (G47c-1, 14/09) — PREREQUISITO DI
   "GENESI SIMILE A UN CAD" (G47, il fondatore ha risposto "tutto").
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-d2-undo.mjs [--porta=8760]
     node genesi-d2-undo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. L'editor di modellazione 3D del fronte ha già
   annulla/ripristina da mesi (`mdlUndo`/`mdlRedo`, genesi.html riga ~2863):
   una pila con cap a 40, Ctrl+Z/Ctrl+Y, sincronizzazione dei pulsanti.
   L'editor 2D (`D2.holes`/`profilo`/`piede` — aggiungi/trascina/elimina un
   foro, disegna il fronte o il piede punto per punto, e da G47a anche le
   scritture esatte di x/spalla/allinea) non aveva NESSUNA cronologia: un
   clic sbagliato si annullava solo a mano, o non si annullava affatto.

   LA DIFFERENZA VOLUTA rispetto al pattern del 3D: invece di spingere
   subito sulla pila e togliere dopo se non c'è stato movimento (come fa
   `mdlPushUndo` col suo pop condizionale), qui si spinge alla PRIMA mossa
   vera di un trascinamento (`d2dragPushed`). Un clic di sola selezione non
   genera nessun evento di movimento, quindi non spinge MAI niente — è la
   prima cosa che questo banco verifica, su una pagina fresca, perché è il
   caso in cui "niente da annullare" deve restare vero anche dopo un clic. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8760;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: un foro aggiunto cliccando sul vuoto smette di
   essere annullabile — `d2PushUndo` non viene più chiamato prima del
   `push`. Silenzioso: il foro si aggiunge comunque, solo Ctrl+Z non lo
   toglie più. Se il testo da cercare non c'è più, l'iniezione non tocca
   niente e la controprova lo dichiara. */
const DIFETTI = [
  [`d2PushUndo(); d2dragPushed=true; D2.holes.push({id:idForoNuovo(D2.holes)`,
   `D2.holes.push({id:idForoNuovo(D2.holes)`],
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
const SEGNO = join(R, "__genesi-d2-undo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-d2-undo-${process.pid}`)).text();
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
  return pg;
}

/* punto vuoto della tela, in coordinate RELATIVE all'elemento (0..1): la
   tela ha una risoluzione interna diversa dalla dimensione CSS con cui è
   renderizzata (960x300 contro ~400x130), il click va dato riscalato. */
async function posRelativa(pg, mx, my) {
  return pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
}
async function clicCanvas(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await posRelativa(pg, mx, my);
  await pg.locator("#d2-canvas").click({ position: { x: rel.x * box.width, y: rel.y * box.height } });
}

console.log(`\n════════ Genesi: annulla/ripristina dell'editor 2D (G47c-1)${CONTROPROVA ? " · controprova" : ""} ════════`);

/* 1) pagina fresca, un clic di SOLA selezione (nessun trascinamento dopo):
   non deve pushare niente — il pulsante annulla resta disabilitato. */
{
  const pg = await apriDesign();
  await clicCanvas(pg, 0, 3); // il primo foro di riga della dimostrazione
  await pg.waitForTimeout(200);
  const disabilitato = await pg.evaluate(() => document.getElementById("d2Undo").disabled);
  dice(disabilitato, "un clic di sola selezione non rende annullabile niente (pulsante ancora disabilitato)", disabilitato);
  const n0 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  await pg.keyboard.press("Control+z"); // deve essere un no-op sicuro su pila vuota
  await pg.waitForTimeout(200);
  const n1 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(n1 === n0, `Ctrl+Z su pila vuota non cambia niente (${n0} -> ${n1})`, n1);
  await pg.close();
}

/* 2) aggiungere un foro cliccando sul vuoto: annulla lo toglie, ripristina
   lo rimette. */
{
  const pg = await apriDesign();
  const n0 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  await clicCanvas(pg, 10, 8); // lontano da qualunque foro della fila (tutta a my=3)
  await pg.waitForTimeout(200);
  const n1 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(n1 === n0 + 1, `un clic sul vuoto aggiunge un foro (${n0} -> ${n1})`, n1);
  const u1 = await pg.evaluate(() => document.getElementById("d2Undo").disabled);
  dice(u1 === false, "dopo un'aggiunta il pulsante annulla si abilita", u1);

  await pg.keyboard.press("Control+z");
  await pg.waitForTimeout(200);
  const n2 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(n2 === n0, `⛔ Ctrl+Z toglie il foro appena aggiunto (atteso ${n0}, letto ${n2})`, n2);

  await pg.keyboard.press("Control+y");
  await pg.waitForTimeout(200);
  const n3 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(n3 === n1, `Ctrl+Y lo rimette (atteso ${n1}, letto ${n3})`, n3);
  await pg.close();
}

/* 3) Elimina dall'ispettore + annulla: il foro torna. */
{
  const pg = await apriDesign();
  await clicCanvas(pg, 0, 3);
  await pg.waitForTimeout(200);
  const n0 = await pg.evaluate(() => window.__genesi.D2.holes.length);
  const db = pg.locator("#diDel");
  if (await db.count()) {
    await db.click();
    await pg.waitForTimeout(200);
    const n1 = await pg.evaluate(() => window.__genesi.D2.holes.length);
    dice(n1 === n0 - 1, `Elimina toglie il foro selezionato (${n0} -> ${n1})`, n1);
    await pg.click("#d2Undo");
    await pg.waitForTimeout(200);
    const n2 = await pg.evaluate(() => window.__genesi.D2.holes.length);
    dice(n2 === n0, `annulla restituisce il foro eliminato (atteso ${n0}, letto ${n2})`, n2);
  } else {
    dice(false, "il pulsante #diDel esiste dopo aver selezionato un foro", "assente");
  }
  await pg.close();
}

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

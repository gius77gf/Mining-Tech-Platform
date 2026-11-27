/* I LIVELLI VERI DELL'EDITOR 2D (G47b, 14/09) — DENTRO "GENESI SIMILE A
   UN CAD" (G47, il fondatore ha risposto "tutto").
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-strati.mjs [--porta=8762]
     node genesi-strati.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. `D2.iso`/`rel`/`ene`/`inn`/`snap` esistevano già, ma sono
   interruttori di un CALCOLO o di un aiuto al disegno (isocrone, relief,
   energia, innesco, griglia di aggancio) — non un livello CAD, che separa
   le ENTITÀ disegnate (fori, fronte, piede, tratti) e le rende ciascuna
   mostrabile, nascondibile e — la parte che un semplice show/hide non dà —
   BLOCCABILE: un'entità bloccata non deve ricevere click né trascinamento,
   né dal canvas né dai comandi dell'ispettore (un foro selezionato PRIMA
   di bloccare il suo livello resta a schermo, ma i suoi campi smettono di
   applicarsi finché non si sblocca).

   COSA GUARDA: che nascondere un'entità la tolga davvero dal disegno
   (contando i comandi effettivamente eseguiti dal disegnatore, non solo
   leggendo `D2.strati`, che potrebbe essere vero senza che nessuno lo
   rispetti — vedi il difetto della controprova), che bloccare un'entità
   impedisca la creazione di un punto nuovo E la selezione di uno esistente,
   e che il blocco valga anche per i comandi dell'ispettore su un foro già
   selezionato prima del blocco. */
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

/* IL DIFETTO DA RIMETTERE: il blocco dei fori smette di fermare il clic sul
   vuoto — la guardia in `d2Down` sparisce, il resto (nascondere, bloccare
   fronte/piede/tratti) resta sano. Silenzioso: `D2.strati.fori.bloccato`
   diventa comunque `true` (il pannello mostra il lucchetto chiuso), solo
   che non protegge più niente. */
const DIFETTI = [
  [`if(D2.tool==='fori' && D2.strati.fori.bloccato){ toast('I fori sono bloccati — sblocca dal pannello sopra la tela'); return; }\n`,
   ``],
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
const SEGNO = join(R, "__genesi-strati-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-strati-${process.pid}`)).text();
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
async function clicCanvas(pg, mx, my) {
  const box = await pg.locator("#d2-canvas").boundingBox();
  const rel = await pg.evaluate(([mx, my]) => {
    const D2 = window.__genesi.D2, m = D2._m, c = document.getElementById("d2-canvas");
    return { x: (m.startX + mx * m.scale) / c.width, y: (m.faceY + my * m.scale) / c.height };
  }, [mx, my]);
  await pg.locator("#d2-canvas").click({ position: { x: rel.x * box.width, y: rel.y * box.height } });
  await pg.waitForTimeout(150);
}

console.log(`\n════════ Genesi: i livelli veri dell'editor 2D (G47b)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const s0 = await pg.evaluate(() => window.__genesi.D2.strati);
dice(["fori", "fronte", "piede", "tratti"].every((k) => s0[k].visibile === true && s0[k].bloccato === false),
  "all'apertura tutte e quattro le entità sono visibili e sbloccate", s0);

/* nascondere: il DISEGNO smette di disegnare i cerchi dei fori. Non si
   legge solo D2.strati (potrebbe essere vero senza essere rispettato):
   si conta quanti comandi `arc` il disegnatore ha davvero eseguito,
   intercettando CanvasRenderingContext2D.prototype.arc PRIMA di aprire
   la scheda 2D. */
await pg.evaluate(() => {
  window.__archi = 0;
  const originale = CanvasRenderingContext2D.prototype.arc;
  CanvasRenderingContext2D.prototype.arc = function (...args) { window.__archi++; return originale.apply(this, args); };
});
await pg.click('.ds-occhio[data-strato="fori"]');
await pg.waitForTimeout(200);
const archiDopoNascondi = await pg.evaluate(() => window.__archi);
await pg.click('.ds-occhio[data-strato="fori"]'); // rimostra
await pg.waitForTimeout(200);
const archiDopoRimostra = await pg.evaluate(() => window.__archi);
dice(archiDopoRimostra > archiDopoNascondi,
  `nascondere i fori disegna MENO cerchi del rimostrarli (nascosto: ${archiDopoNascondi}, rimostrato: ${archiDopoRimostra})`,
  { archiDopoNascondi, archiDopoRimostra });

/* bloccare: un clic sul vuoto non aggiunge un foro, e un clic su un foro
   esistente non lo seleziona nemmeno. */
await pg.click('.ds-lucchetto[data-strato="fori"]');
await pg.waitForTimeout(200);
dice(await pg.evaluate(() => window.__genesi.D2.strati.fori.bloccato) === true, "il lucchetto blocca i fori");

const n0 = await pg.evaluate(() => window.__genesi.D2.holes.length);
await clicCanvas(pg, 10, 8);
const n1 = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(n1 === n0, `⛔ un clic sul vuoto con i fori BLOCCATI non aggiunge un foro (${n0} -> ${n1})`, n1);

const selPrima = await pg.evaluate(() => window.__genesi.D2.sel);
await clicCanvas(pg, 0, 3);
const selDopo = await pg.evaluate(() => window.__genesi.D2.sel);
dice(selDopo === selPrima, `⛔ un clic su un foro con i fori BLOCCATI non lo seleziona (${selPrima} -> ${selDopo})`, selDopo);

/* un foro selezionato PRIMA del blocco resta editabile a vista ma i comandi
   dell'ispettore non si applicano più */
await pg.click('.ds-lucchetto[data-strato="fori"]'); // sblocca
await pg.waitForTimeout(150);
await clicCanvas(pg, 0, 3);
await pg.waitForTimeout(200);
const selezionato = await pg.evaluate(() => window.__genesi.D2.sel);
await pg.click('.ds-lucchetto[data-strato="fori"]'); // blocca CON un foro già selezionato
await pg.waitForTimeout(150);
const mxPrima = await pg.evaluate(() => window.__genesi.D2.holes[0].mx);
if (await pg.locator("#diX").count()) {
  await pg.fill("#diX", "99,99");
  await pg.locator("#diX").dispatchEvent("change");
  await pg.waitForTimeout(200);
  const mxDopo = await pg.evaluate(() => window.__genesi.D2.holes[0].mx);
  dice(mxDopo === mxPrima, `⛔ scrivere x sull'ispettore con i fori bloccati non si applica (atteso ${mxPrima}, letto ${mxDopo})`, mxDopo);
} else {
  dice(false, "il campo #diX esiste dopo aver selezionato un foro", "assente (selezionato=" + selezionato + ")");
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

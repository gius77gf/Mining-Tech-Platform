/* IL PIANO FORI DXF (G33) — L'UNICA DELLE DIECI USCITE DI GENESI CHE
   NESSUN BANCO PREMEVA.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-piano-dxf.mjs [--porta=8753]
     node genesi-piano-dxf.mjs --controprova   (rimette il difetto: DEVE fallire)
     node genesi-piano-dxf.mjs --dimmi         (stampa il file intero)

   PERCHÉ ESISTE. Censendo i banchi Genesi per bottone (`grep` sugli id
   `btn-*` premuti da tutta la superficie browser di Genesi) sono usciti
   `btn-piano-dxf` (Esporta piano fori DXF per CAD, G33 — costruita il 13/09
   "su richiesta diretta del fondatore: potremmo rendere Genesi più simile a
   un CAD?") e `btn-rilievo-dev` senza nessun banco che li premesse. Il primo
   è questo; il secondo resta fuori di proposito — è l'import del rilievo
   boretrack, dietro il gate di sicurezza bloccato sul fondatore
   (`docs/DECISIONI_WEEKEND.md`, sezione 6: `deviazioneForiDaCsv`/
   `burdenVeroDaRilievo`), e questo blocco non lo tocca.

   Il DXF è **solo esportazione**: i numeri che escono (posizione dei fori,
   profilo del fronte) sono quelli che Genesi ha già calcolato e mostra a
   schermo, nella convenzione di assi di Genesi dall'inizio alla fine — è
   l'opposto del rischio di convenzione-assi segnalato per un futuro IMPORT
   (`docs/RICERCA_CONTINUA_GENESI.md`, 13/09). Qui non c'è quel rischio: si
   verifica che il file dica esattamente quello che dice lo schermo, non una
   convenzione geografica.

   COSA GUARDA, E PERCHÉ: il conto dei cerchi (un CIRCLE per foro, mai un
   numero indovinato), il raggio (dal diametro di progetto — calcolato QUI
   in modo indipendente, non copiando la formula del modulo, altrimenti un
   difetto nella formula sarebbe invisibile a un test che la ripete), le
   coordinate (devono combaciare con le posizioni vere dei fori, non solo
   "esistere"), e il profilo del fronte (un VERTEX per punto disegnato, sul
   layer FRONTE — mai una linea inventata se il profilo è vuoto). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8753;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il raggio raddoppiato (formula `/1000` invece di
   `/2000`) — silenzioso, il DXF resta valido, solo i cerchi escono grandi il
   doppio del foro vero. Se il testo da cercare non c'è più, l'iniezione non
   tocca niente e la controprova lo dichiara. */
const DIFETTI = [
  [`(+diamMm/2000) : 0.05`, `(+diamMm/1000) : 0.05`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-piano-dxf-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-piano-dxf-${process.pid}`)).text();
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

/* nessuna somiglianza coi default; profilo del fronte incluso, per provare
   anche il layer FRONTE (non solo FORI) */
const DESIGN = { B: 2.8, S: 3.3, diam: 115, prof: 9, kg: 55, kgAuto: false, stem: 2.1, sub: 0.8,
  incl: 0, esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare",
  frat: "media", bagnato: false, presplit: false, sequenza: "riga", perRow: 6, file: 2,
  ritardo: 25, ritardoFila: 65, decks: 1, deckStem: 1.0,
  recNorma: "din-res", recFreq: 25, recDist: 300, dir: "sx",
  profilo: [{ x: 5, y: 0 }, { x: 20, y: 3 }, { x: 35, y: 1 }, { x: 50, y: 2 }] };

async function apri() {
  const pg = await b.newPage({ viewport: { width: 1400, height: 950 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.addInitScript((arg) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Cava DXF",
      data: "2026-09-14", sintesi: "12 fori", design: arg }]));
  }, DESIGN);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => {
    /* si intercetta il salvataggio del file: esce come `data:` */
    window.__usciti = [];
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) {
        window.__usciti.push({ nome: this.download,
          testo: decodeURIComponent(String(this.href).replace(/^data:[^,]*,/, "")) });
        return;
      }
      return clic.apply(this, arguments);
    };
  });
  await pg.waitForTimeout(300);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="vX"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1600);
  return pg;
}

async function esce(pg, id, nome) {
  const prima = await pg.evaluate(() => window.__usciti.length);
  const bot = await pg.$("#" + id);
  if (!bot) { dice(false, `il bottone #${id} esiste`, "assente"); return ""; }
  await pg.evaluate((i) => document.getElementById(i).click(), id);
  await pg.waitForTimeout(700);
  const u = await pg.evaluate((n) => (window.__usciti.length > n ? window.__usciti[window.__usciti.length - 1] : null), prima);
  if (!u) { dice(false, `${nome}: il file esce davvero premendo #${id}`, "nessun download"); return ""; }
  dice(u.testo.length > 30, `${nome} esce davvero da #${id} (${u.nome}, ${u.testo.length} caratteri)`, u.testo.slice(0, 90));
  if (DIMMI) console.log(`\n──────── ${u.nome} ────────\n${u.testo}\n────────`);
  return u.testo;
}

/* lettore DXF minimo, sul TESTO — non chiama nessuna funzione del prodotto:
   un gruppo di codice/valore ogni due righe, entità separate da "0\n<TIPO>" */
function leggiDxf(testo) {
  const righe = String(testo).split("\n");
  const entita = [];
  let cur = null;
  for (let i = 0; i < righe.length; i += 2) {
    const codice = righe[i], valore = righe[i + 1];
    if (codice === "0") {
      if (["CIRCLE", "TEXT", "POLYLINE", "VERTEX", "SEQEND"].includes(valore)) {
        cur = { tipo: valore, campi: {} };
        entita.push(cur);
      } else cur = null;
    } else if (cur) {
      cur.campi[codice] = valore;
    }
  }
  return entita;
}

console.log(`\n════════ Genesi: il piano fori DXF (G33)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apri();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => document.body.className)).includes("scr-design"),
  "la volata salvata si apre nel 2D", await pg.evaluate(() => document.body.className));

const nFori = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(nFori === DESIGN.file * DESIGN.perRow, `la maglia ha i ${DESIGN.file * DESIGN.perRow} fori del progetto aperto`, nFori);

const dxf = await esce(pg, "btn-piano-dxf", "piano fori DXF");
if (dxf) {
  dice(/^0\nSECTION\n2\nENTITIES/.test(dxf), "il file apre con una SECTION di ENTITIES (DXF R12 minimo)", dxf.slice(0, 40));
  dice(/0\nENDSEC\n0\nEOF\n?$/.test(dxf), "il file chiude con ENDSEC/EOF", dxf.slice(-40));

  const entita = leggiDxf(dxf);
  const cerchi = entita.filter((e) => e.tipo === "CIRCLE");
  const testi = entita.filter((e) => e.tipo === "TEXT");
  dice(cerchi.length === nFori, `un CIRCLE per foro (${cerchi.length} su ${nFori} fori veri)`, cerchi.length);
  dice(testi.length === nFori, `un TEXT (etichetta) per foro (${testi.length})`, testi.length);

  /* il raggio, calcolato QUI in modo indipendente dal modulo: mm -> m, /2 */
  const raggioAtteso = DESIGN.diam / 1000 / 2;
  const raggiVisti = cerchi.map((c) => parseFloat(c.campi["40"]));
  const raggiOk = raggiVisti.every((r) => Math.abs(r - raggioAtteso) < 0.001);
  dice(raggiOk, `⛔ il raggio dei cerchi è metà del diametro vero (atteso ${raggioAtteso.toFixed(3)} m, visti ${[...new Set(raggiVisti.map((r) => r.toFixed(3)))].join(", ")})`,
    raggiVisti.slice(0, 3));

  /* le coordinate dei cerchi combaciano con le posizioni VERE dei fori
     (non solo "esistono") — letti dallo stato vivo della pagina, non dal
     file stesso, altrimenti la prova confermerebbe solo sé stessa */
  const foriVeri = await pg.evaluate(() => window.__genesi.D2.holes.map((h) => ({ mx: h.mx, my: h.my })));
  let coordOk = cerchi.length === foriVeri.length;
  if (coordOk) {
    for (let i = 0; i < cerchi.length; i++) {
      const cx = parseFloat(cerchi[i].campi["10"]), cy = parseFloat(cerchi[i].campi["20"]);
      const vero = foriVeri.find((f) => Math.abs(f.mx - cx) < 0.01 && Math.abs(f.my - cy) < 0.01);
      if (!vero) { coordOk = false; break; }
    }
  }
  dice(coordOk, "ogni cerchio è sulla posizione VERA di un foro (non solo un numero qualunque)", cerchi.slice(0, 2).map((c) => [c.campi["10"], c.campi["20"]]));

  /* il layer FRONTE: un profilo di 4 punti -> POLYLINE con 4 VERTEX */
  const vertici = entita.filter((e) => e.tipo === "VERTEX");
  dice(vertici.length === DESIGN.profilo.length,
    `il profilo del fronte esce come POLYLINE con un VERTEX per punto disegnato (${vertici.length} su ${DESIGN.profilo.length})`,
    vertici.length);
  const seqend = entita.filter((e) => e.tipo === "SEQEND").length;
  dice(seqend === 1, "la POLYLINE del fronte si chiude con un SEQEND", seqend);

  /* tutti i layer dichiarati sono solo FORI e FRONTE — un layer indovinato
     a mano, sbagliato, uscirebbe silenzioso: qui non trattato come stringa
     libera, si spacchetta davvero */
  const layers = new Set(entita.map((e) => e.campi["8"]).filter(Boolean));
  dice([...layers].every((l) => l === "FORI" || l === "FRONTE"),
    `nessun layer fuori da FORI/FRONTE (${[...layers].join(", ")})`, [...layers]);
}

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nel modulo servito (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

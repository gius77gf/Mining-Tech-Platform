/* INPUT RELATIVO/POLARE PER LE COORDINATE ESATTE (G51, 19/09) — @dx;dy /
   @distanza<angolo SOPRA L'ASSOLUTO GIÀ ESISTENTE (G47a), APPLICATO A
   ENTRAMBI I CAMPI DELL'ISPETTORE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-input-relativo.mjs [--porta=8765]
     node genesi-input-relativo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La parte pura (`coordinataRelativa`) è provata in
   run-kpi.mjs senza aprire un browser; questo banco prova il GESTO nei
   due campi veri dell'ispettore — selezionare due fori in sequenza (il
   secondo diventa il riferimento del primo, la stessa memoria di
   G34quinquies), scrivere «@2;1» o «@5<90» in uno dei due campi, e
   vedere ENTRAMBE le coordinate del foro attivo spostarsi dal
   riferimento — non solo quella del campo dove si è scritto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8765;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il campo x smette di applicare il risultato
   relativo a `h.my` — scrive solo `h.mx`, come se l'input relativo
   toccasse un asse solo invece del punto intero. Effetto: scrivere
   «@2;1» in x sposta la posizione lungo la fila ma lascia la spalla
   dov'era, un mezzo spostamento silenzioso (nessun errore, nessun
   toast: il foro finisce su un punto che nessuno ha chiesto). */
const DIFETTI = [
  [`d2PushUndo(); h.mx=+rel.mx.toFixed(2); h.my=+rel.my.toFixed(2); computeSeq2D(); drawDesign2D(); renderScheda2D(); renderInspector();
      toast('Foro spostato a x '+gfix(h.mx,2)+' m, spalla '+gfix(h.my,2)+' m');
      return;
    }
    const v=+String(dx.value).replace(',','.');`,
   `d2PushUndo(); h.mx=+rel.mx.toFixed(2); computeSeq2D(); drawDesign2D(); renderScheda2D(); renderInspector();
      toast('Foro spostato a x '+gfix(h.mx,2)+' m, spalla '+gfix(h.my,2)+' m');
      return;
    }
    const v=+String(dx.value).replace(',','.');`],
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
const SEGNO = join(R, "__genesi-input-relativo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-input-relativo-${process.pid}`)).text();
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
  /* ⛔ stessa causa già presa in genesi-selezione-multipla.mjs/genesi-rifletti-selezione.mjs:
     il canvas nasce fuori dal viewport. */
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
  await pg.waitForTimeout(150);
}
async function foro(pg, i) {
  return pg.evaluate((i) => { const h = window.__genesi.D2.holes[i]; return { id: h.id, mx: h.mx, my: h.my }; }, i);
}
async function foroAttivo(pg) {
  return pg.evaluate(() => { const D2 = window.__genesi.D2, h = D2.holes[D2.sel]; return h ? { id: h.id, mx: h.mx, my: h.my } : null; });
}
async function scriviCampo(pg, campo, testo) {
  await pg.fill(campo, testo);
  await pg.locator(campo).dispatchEvent("change");
  await pg.waitForTimeout(150);
}

console.log(`\n════════ Genesi: input relativo/polare per le coordinate (G51)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const f0 = await foro(pg, 0), f1 = await foro(pg, 1);
dice(f0.mx !== f1.mx, "i primi due fori della maglia hanno posizioni diverse (altrimenti il banco non prova niente)", [f0, f1]);

/* PRIMO CASO: un solo foro selezionato dopo il caricamento — D2.selPrev è
   ancora -1 (nessuna selezione precedente), quindi «@2;1» deve dichiarare
   l'errore invece di calcolare contro un riferimento che non c'è. */
await clicSu(pg, f0.mx, f0.my);
const primaSenzaRif = await foroAttivo(pg);
await scriviCampo(pg, "#diX", "@2;1");
const dopoSenzaRif = await foroAttivo(pg);
dice(dopoSenzaRif.mx === primaSenzaRif.mx && dopoSenzaRif.my === primaSenzaRif.my,
  "senza un foro precedente selezionato, l'input relativo dichiara l'errore e non tocca il foro", { primaSenzaRif, dopoSenzaRif });

/* SECONDO CASO: selezionare f1 DOPO f0 rende f0 il riferimento
   (D2.selPrev), la stessa memoria che G34quinquies usa già per
   l'allineamento e la distanza fra due fori. */
await clicSu(pg, f1.mx, f1.my);
const rif = await pg.evaluate(() => { const D2 = window.__genesi.D2; return D2.holes[D2.selPrev]; });
dice(rif && rif.id === f0.id, "il riferimento è il foro cliccato PRIMA (D2.selPrev), non un concetto nuovo", rif);

/* IL CASO CHE CONTA: «@2;1» scritto nel campo x sposta ENTRAMBE le
   coordinate del foro attivo, dal riferimento. */
await scriviCampo(pg, "#diX", "@2;1");
const dopoCart = await foroAttivo(pg);
const attesoMxC = +(f0.mx + 2).toFixed(2), attesoMyC = +(f0.my + 1).toFixed(2);
dice(dopoCart.mx === attesoMxC && dopoCart.my === attesoMyC,
  `⛔ @dx;dy scrive ENTRAMBE le coordinate dal riferimento, anche scrivendo solo nel campo x (atteso ${attesoMxC},${attesoMyC}; letto ${dopoCart.mx},${dopoCart.my})`,
  dopoCart);

/* Il polare funziona identico nell'ALTRO campo (spalla): il riferimento
   resta f0, non il valore appena scritto sopra — la selezione non è
   cambiata, solo il valore del foro attivo. */
await scriviCampo(pg, "#diY", "@5<90");
const dopoPolar = await foroAttivo(pg);
const attesoMxP = +(f0.mx + 0).toFixed(2), attesoMyP = +(f0.my + 5).toFixed(2);
dice(Math.abs(dopoPolar.mx - attesoMxP) < 0.02 && Math.abs(dopoPolar.my - attesoMyP) < 0.02,
  `il polare (90° = tutto sulla spalla) funziona anche scritto nel campo y, stesso riferimento (atteso ~${attesoMxP},${attesoMyP}; letto ${dopoPolar.mx},${dopoPolar.my})`,
  dopoPolar);

/* Sintassi malformata: dichiara l'errore (un toast) e non tocca il foro —
   non un NaN silenzioso scritto nel modello. */
const primaErrore = await foroAttivo(pg);
await scriviCampo(pg, "#diX", "@qualcosa");
const dopoErrore = await foroAttivo(pg);
dice(dopoErrore.mx === primaErrore.mx && dopoErrore.my === primaErrore.my,
  "una sintassi «@…» non riconosciuta dichiara l'errore e non tocca il foro", { primaErrore, dopoErrore });

/* La guardia sulla spalla (>=0.3 m) vale anche per il risultato
   dell'input relativo: un secondo modo di scrivere il punto non può
   avere un vincolo più permissivo del primo. */
const primaGuardia = await foroAttivo(pg);
await scriviCampo(pg, "#diY", "@0;-100");
const dopoGuardia = await foroAttivo(pg);
dice(dopoGuardia.mx === primaGuardia.mx && dopoGuardia.my === primaGuardia.my,
  "⛔ una spalla relativa sotto 0,3 m è rifiutata come quella assoluta, il foro resta dov'era", { primaGuardia, dopoGuardia });

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

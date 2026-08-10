/* I CAMPI DI GENESI CHE NON DEVONO RIEMPIRSI DA SOLI
   ──────────────────────────────────────────────────
   DOVE VA: apps/deepwork-id/tests/browser/genesi-campi-assenti.mjs
   E VA REGISTRATO in `tutti.mjs` (io non l'ho toccato: il mandato di questa
   unità si ferma a `apps/genesi/`), con la sua passata di controprova.

   Uso:
     node genesi-campi-assenti.mjs [--porta=8611]
     node genesi-campi-assenti.mjs --controprova   (rimette la forma vecchia su
                                                    tutti e dodici: DEVE fallire)

   PERCHÉ ESISTE. Il 09/08 `valoreCampo` ha tolto da `applyDesign` dodici
   ripieghi della forma `Math.max(min, Math.min(max, gvv('dX')||D2.x))`: con il
   valore salvato ASSENTE, `Math.min(max, null)` fa 0 e il clamp basso lo tira
   su al minimo, scrivendo nel progetto un numero che nessuno ha scritto.
   Le prove che difendono quella correzione stanno in `run-kpi.mjs` e guardano
   il SORGENTE. Quello che nessuna prova guardava è **l'aggancio**: che il
   campo, sullo schermo, resti davvero vuoto. Qui si fanno i due tocchi veri.

   COME SI RIPRODUCE, e perché ci vogliono DUE tocchi:
     1) un `change` su un ALTRO campo fa girare `applyDesign`, che (con la forma
        vecchia) scrive il minimo dentro `D2`;
     2) un `change` sul campo VUOTO fa scattare `guardiaVuoto`, che chiama
        `syncDesignInputs` e rimette nel campo il valore del progetto — ed è lì
        che il numero inventato COMPARE davanti all'utente.

   ⛔ I TRE ESCLUSI SONO DICHIARATI, NON DIMENTICATI: `psCharge`, `recDist` e
   `recFreq` si riempiono ancora (0,1 · 20 · 2) e questo banco lo STAMPA invece
   di tacere — un'eccezione muta è un posto in cui nessuno guarda. Non sono un
   KO perché la loro correzione è un'unità sua: i due del recettore stanno sotto
   `ppvLimit`, e `psCharge` senza toccare la riga «Presplit» sposterebbe la
   bugia da un numero a un allarme.

   ⚠️ I casi si costruiscono NEI DATI (`localStorage`, la stessa chiave che
   l'app scrive da sé) e la controprova nella RISPOSTA HTTP: il file su disco
   non si tocca mai, così il banco si può lanciare mentre girano altri cantieri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8611;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DODICI CAMPI SORVEGLIATI: id nel DOM, chiave in `D2`, e il numero che la
   forma vecchia inventava — misurato uno per uno nel browser il 09/08. */
const SORVEGLIATI = [
  ["dB", "B", "1,5"], ["dS", "S", "1,5"], ["dD", "diam", "50"], ["dN", "perRow", "3"],
  ["dFile", "file", "1"], ["dH", "prof", "6"], ["dStem", "stem", "0,5"], ["dSub", "sub", "0"],
  ["dRitFila", "ritardoFila", "8"], ["dUcs", "ucs", "5"], ["dEmod", "eMod", "2"],
  ["dPsSpacing", "psSpacing", "0,3"],
];
/* I TRE ESCLUSI PER DECISIONE PRESA: si guardano lo stesso e si stampano. */
const ESCLUSI = [["dPsCharge", "psCharge", "0,1"], ["dRecDist", "recDist", "20"], ["dRecFreq", "recFreq", "2"]];

/* LA CONTROPROVA: ogni riga torna alla forma che stringeva al minimo un valore
   assente. Il nome della tabella è quello che `iniezioni-fresche.mjs` sa
   leggere, così il giorno in cui una di queste righe si muove il repository lo
   dice in tre secondi invece di far girare una controprova su un prodotto sano. */
const DIFETTI = [
  ["  D2.B = valoreCampo(gvv('dB'), D2.B, 1.5, 8);",
   "  D2.B = Math.max(1.5, Math.min(8, gvv('dB')||D2.B));"],
  ["  D2.S = valoreCampo(gvv('dS'), D2.S, 1.5, 8);",
   "  D2.S = Math.max(1.5, Math.min(8, gvv('dS')||D2.S));"],
  ["  D2.diam = valoreCampo(gvv('dD'), D2.diam, 50, 160, true);",
   "  D2.diam = Math.max(50, Math.min(160, +$('dD').value||D2.diam));"],
  ["  D2.perRow = valoreCampo(gvv('dN'), D2.perRow, 3, 30, true);",
   "  D2.perRow = Math.max(3, Math.min(30, +$('dN').value||D2.perRow));"],
  ["  D2.file = valoreCampo(gvv('dFile'), D2.file, 1, 6, true);",
   "  D2.file = Math.max(1, Math.min(6, +$('dFile').value||D2.file));"],
  ["  D2.prof = valoreCampo(gvv('dH'), D2.prof, 6, 18);",
   "  D2.prof = Math.max(6, Math.min(18, gvv('dH')||D2.prof));"],
  ["  if($('dStem')) D2.stem = valoreCampo(gvv('dStem'), D2.stem, 0.5, 6);",
   "  if($('dStem')) D2.stem = Math.max(0.5, Math.min(6, gvv('dStem')||D2.stem));"],
  ["  if($('dSub')) D2.sub = valoreCampo(gvv('dSub'), D2.sub, 0, 4);",
   "  if($('dSub')) D2.sub = Math.max(0, Math.min(4, gvv('dSub')||D2.sub));"],
  ["  if($('dRitFila')) D2.ritardoFila = valoreCampo(gvv('dRitFila'), D2.ritardoFila, 8, 300);",
   "  if($('dRitFila')) D2.ritardoFila = Math.max(8, Math.min(300, +$('dRitFila').value||D2.ritardoFila));"],
  ["  if($('dUcs')) D2.ucs = valoreCampo(gvv('dUcs'), D2.ucs, 5, 400);",
   "  if($('dUcs')) D2.ucs = Math.max(5, Math.min(400, +$('dUcs').value||D2.ucs));"],
  ["  if($('dEmod')) D2.eMod = valoreCampo(gvv('dEmod'), D2.eMod, 2, 150);",
   "  if($('dEmod')) D2.eMod = Math.max(2, Math.min(150, +$('dEmod').value||D2.eMod));"],
  ["  if($('dPsSpacing')) D2.psSpacing = valoreCampo(gvv('dPsSpacing'), D2.psSpacing, 0.3, 2);",
   "  if($('dPsSpacing')) D2.psSpacing = Math.max(0.3, Math.min(2, gvv('dPsSpacing')||D2.psSpacing));"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID, riletto DAL SERVER: un banco che trova la
   porta occupata e la riusa non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-campi-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-campi-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }
/* e la radice servita è quella giusta: in BYTE, non in caratteri — la pagina è
   piena di accenti e una lunghezza in caratteri non torna mai */
if (!CONTROPROVA) {
  const disco = readFileSync(join(R, "apps/genesi/genesi.html")).length;
  const rete = (await (await fetch(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`)).arrayBuffer()).byteLength;
  if (rete !== disco) { console.error(`✗ radice sbagliata: ${rete} ≠ ${disco} byte`); process.exit(2); }
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 200))}` : ""}`); }
};

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: true, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res",
  recFreq: 25, recDist: 300, perRow: 12, file: 1 };

/* apre una volata salvata a cui manca UN valore, e ci arriva dalla via vera:
   `localStorage` → Home → bottone «Apri» */
async function apriSenza(chiave) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  const d = { ...DESIGN }; d[chiave] = null;
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord",
      data: "2026-07-12", sintesi: "12 fori", design: dd }]));
  }, d);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
  });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1400);
  pg.__errori = errori;
  return pg;
}
const leggi = (pg, id) => pg.evaluate((i) => { const e = document.getElementById(i); return e ? e.value : null; }, id);

/* i due tocchi, in ordine: prima un ALTRO campo, poi il campo vuoto */
async function dueTocchi(pg, id) {
  await pg.evaluate(() => { const e = document.getElementById("dRit"); if (e) e.dispatchEvent(new Event("change", { bubbles: true })); });
  await pg.waitForTimeout(300);
  await pg.evaluate((i) => { const e = document.getElementById(i); if (e) e.dispatchEvent(new Event("change", { bubbles: true })); }, id);
  await pg.waitForTimeout(300);
}

console.log(`\n════════ i campi di Genesi che non devono riempirsi da soli${CONTROPROVA ? " · controprova" : ""} ════════`);
console.log(`(${SORVEGLIATI.length} campi sorvegliati + ${ESCLUSI.length} dichiarati esclusi)`);

for (const [id, chiave, inventato] of SORVEGLIATI) {
  const pg = await apriSenza(chiave);
  /* ⚠️ LA PRECONDIZIONE: se la volata non si è aperta nel 2D la domanda non ha
     senso, e un soggetto non misurato non è un soggetto a posto. */
  const navigato = await pg.evaluate(() => document.body.className.includes("scr-design"));
  const presente = (await leggi(pg, id)) !== null;
  if (!navigato || !presente) {
    nonMisurati.push(`${id} (${navigato ? "il campo non c'è" : "la volata non si è aperta nel 2D"})`);
    await pg.close(); continue;
  }
  const v0 = await leggi(pg, id);
  dice(String(v0).trim() === "", `${id}: subito dopo «Apri» il campo è VUOTO`, v0);
  await dueTocchi(pg, id);
  const v2 = await leggi(pg, id);
  dice(String(v2).trim() === "",
    `⛔ ${id} (${chiave}): dopo i due tocchi il campo è ANCORA vuoto — la forma vecchia ci scriveva ${inventato}`, v2);
  /* ⛔ E LA SCHERMATA DEVE ESSERE VIVA, se no un campo vuoto «a posto» lo si
     legge su una pagina morta. Trovato così il 09/08: con l'INTERASSE assente
     `measureGeom2D` fa `null.toFixed(2)`, `setScreen('design')` muore, la
     scheda validatori resta a ZERO righe e — peggio — il toast che NOMINA il
     valore mancante (`volataSenzaValori`) non viene mai mostrato, perché sta
     nella riga dopo `setScreen`. */
  const vive = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
  dice(pg.__errori.length === 0 && vive > 20,
    `${id}: aprire la volata senza questo valore NON uccide il 2D (${vive} righe di scheda)`,
    pg.__errori[0] || `righe: ${vive}`);
  await pg.close();
}

console.log("\n· i tre esclusi per decisione presa — si riempiono ancora, e va detto");
for (const [id, chiave, inventato] of ESCLUSI) {
  const pg = await apriSenza(chiave);
  const navigato = await pg.evaluate(() => document.body.className.includes("scr-design"));
  if (!navigato) { nonMisurati.push(`${id} (la volata non si è aperta nel 2D)`); await pg.close(); continue; }
  await dueTocchi(pg, id);
  const v2 = String(await leggi(pg, id) || "").trim();
  console.log(`  ⚠️ ${id} (${chiave}): dopo i due tocchi il campo dice «${v2 || "VUOTO"}» (atteso ${inventato}, per decisione presa)`);
  await pg.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato campi assenti di Genesi: ${ok} passati, ${ko} falliti  ·  ${SORVEGLIATI.length * 3} asserzioni attese (3 per campo)`);
await b.close(); srv.close();
process.exit(ko > 0 || nonMisurati.length ? 1 : 0);

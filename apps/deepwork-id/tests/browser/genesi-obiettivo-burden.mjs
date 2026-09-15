/* G38/G44 — L'OBIETTIVO DI PEZZATURA E IL CONFRONTA BURDEN: DUE FUNZIONI
   NUOVE SENZA NESSUN BANCO CHE LE PREMESSE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-obiettivo-burden.mjs [--porta=8752]
     node genesi-obiettivo-burden.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Le due funzioni sono state verificate nel browser al
   momento di scriverle (screenshot, giro completo), ma quella verifica
   viveva nello scratchpad — «uno strumento di misura che resta nello
   scratchpad, alla sessione dopo non esiste» (CLAUDE.md). Rilanciandola per
   una revisione di qualità (14/09) è saltato fuori un difetto vero che lo
   screenshot della volta precedente non aveva preso: la riga di provenienza
   sotto la tabella «Confronta burden» diceva

       Stima dal modello di Kuznetsov (Kuz-Ram) e da da litologia (Calcare), …

   — una parola doppia. La causa: `provenienzaPpv().breve` include già "da "
   quando la fonte è la litologia (`'da litologia (…)'`), e la pagina
   anteponeva un secondo "e da " prima di scriverlo. Corretto in
   `genesi.html` (il "da" tolto dal chiamante, non dal campo condiviso: tre
   altri punti della pagina usano `.breve` da solo, dove "da litologia (…)"
   legge già bene).

   COSA GUARDA QUESTO BANCO, E PERCHÉ IN QUESTA FORMA:
   1. una parola doppia si prende con un controllo GENERALE
      (`/\b(\w+)\s+\1\b/i` su ogni blocco di testo che l'utente legge), non
      cercando "da da" per nome — un controllo che cerca la stringa del
      difetto di oggi non prende quello di domani;
   2. i numeri della tabella (MIC/PPV) devono CRESCERE col burden, non solo
      esistere: un banco che verifica solo "la cella non è vuota" non
      distingue una tabella vera da una tabella con lo stesso numero
      ripetuto nove volte;
   3. il progetto si apre da una volata SALVATA con parametri che non
      somigliano ai default (stessa difesa di `genesi-piano-innesco.mjs`):
      se il test somigliasse ai valori di fabbrica, passerebbe anche
      leggendo il campo sbagliato. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8752;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima della
   correzione del 14/09. Se il testo da cercare non c'è più (perché la riga
   è cambiata per un'altra ragione), l'iniezione non tocca niente e la
   controprova lo dichiara invece di dare un falso «so fallire». */
const DIFETTI = [
  [`Stima dal modello di Kuznetsov (Kuz-Ram) e '+_rEsc(pv.breve||'')`,
   `Stima dal modello di Kuznetsov (Kuz-Ram) e da '+_rEsc(pv.breve||'')`],
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
const SEGNO = join(R, "__genesi-obiettivo-burden-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-obiettivo-burden-${process.pid}`)).text();
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

/* nessuna somiglianza coi default (B:3.0, S:3.5, file:1, perRow:12, kg:60) */
const DESIGN = { B: 2.6, S: 3.0, diam: 102, prof: 11, kg: 62, kgAuto: false, stem: 2.4, sub: 1.0,
  incl: 0, esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare",
  frat: "media", bagnato: false, presplit: false, sequenza: "diagonale", perRow: 10, file: 2,
  ritardo: 25, ritardoFila: 42, decks: 1, deckStem: 1.0,
  recNorma: "din-res", recFreq: 25, recDist: 350, dir: "sx" };

async function apri() {
  const pg = await b.newPage({ viewport: { width: 1400, height: 950 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.addInitScript((arg) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Cava di prova",
      data: "2026-09-14", sintesi: "20 fori", design: arg }]));
  }, DESIGN);
  /* senza rete vera in questo contenitore, l'import da gstatic morirebbe da
     solo dopo ~13 s: lo si taglia subito, come negli altri banchi Genesi. */
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="vX"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1600);
  return pg;
}

/* una parola ripetuta di seguito, in QUALUNQUE testo che l'utente legge —
   non cerca "da da" per nome: prende la famiglia del difetto, non l'istanza */
const paroleDoppie = (testo) => (String(testo).match(/\b(\w+)\s+\1\b/gi) || []);

console.log(`\n════════ Genesi: obiettivo di pezzatura e confronta burden${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apri();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
dice((await pg.evaluate(() => document.body.className)).includes("scr-design"),
  "la volata salvata si apre nel 2D", await pg.evaluate(() => document.body.className));
const nFori = await pg.evaluate(() => window.__genesi.D2.holes.length);
dice(nFori === DESIGN.file * DESIGN.perRow, `la maglia ha i ${DESIGN.file * DESIGN.perRow} fori del progetto aperto`, nFori);

// ── 1 · OBIETTIVO DI PEZZATURA (G38) ────────────────────────────────────
console.log("\n· obiettivo x50 → carica necessaria");
const hasX50 = await pg.$("#btn-obiettivo-x50");
dice(!!hasX50, "il bottone «Carica per un obiettivo di pezzatura» esiste");
if (hasX50) {
  await pg.click("#btn-obiettivo-x50");
  await pg.waitForTimeout(300);
  await pg.fill("#modal-campo", "18");
  const conf = await pg.$('#modal-foot button:last-child');
  if (conf) await conf.click(); else await pg.press("#modal-campo", "Enter");
  await pg.waitForTimeout(500);
  const esito = await pg.evaluate(() => document.getElementById("d2-obiettivo-esito")?.innerText || "");
  dice(esito.length > 20, "l'esito compare nella pagina (non un riquadro vuoto)", esito);
  dice(/18\s*cm/.test(esito), "l'esito cita l'obiettivo digitato (18 cm)", esito);
  dice(/kg\/foro/.test(esito), "l'esito dà una carica per foro", esito);
  const doppieX50 = paroleDoppie(esito);
  dice(doppieX50.length === 0, "nessuna parola ripetuta di seguito nel testo dell'esito", doppieX50);
}

// ── 2 · CONFRONTA BURDEN (G44, con MIC/PPV) ─────────────────────────────
console.log("\n· confronta burden → tabella con MIC e PPV stimata");
const hasBurden = await pg.$("#btn-confronta-burden");
dice(!!hasBurden, "il bottone «Confronta burden per lo stesso obiettivo» esiste");
if (hasBurden) {
  await pg.click("#btn-confronta-burden");
  await pg.waitForTimeout(300);
  await pg.fill("#modal-campo", "18");
  const conf = await pg.$('#modal-foot button:last-child');
  if (conf) await conf.click(); else await pg.press("#modal-campo", "Enter");
  await pg.waitForTimeout(600);
  const box = pg.locator("#d2-confronta-esito");
  const testoBox = await box.innerText().catch(() => "");
  dice(testoBox.length > 40, "la tabella di confronto compare (non un riquadro vuoto)", testoBox.slice(0, 80));

  const righe = await pg.evaluate(() => {
    const tb = document.getElementById("d2-confronta-esito");
    const tr = tb ? [...tb.querySelectorAll("table tr")].slice(1) : [];
    return tr.map((r) => [...r.querySelectorAll("td")].map((td) => td.innerText.trim()));
  });
  dice(righe.length >= 5, `la tabella ha più righe di burden (${righe.length})`, righe.length);

  /* MIC e PPV devono CRESCERE monotonicamente col burden (righe già ordinate
     per burden crescente): un banco che guardasse solo "non vuoto" non
     distinguerebbe nove celle vere da nove celle con lo stesso numero */
  const numeri = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", "."));
  const micVals = righe.map((r) => numeri(r[4])).filter(Number.isFinite);
  const ppvVals = righe.map((r) => numeri(r[5])).filter(Number.isFinite);
  const crescente = (arr) => arr.length >= 4 && arr.every((v, i) => i === 0 || v >= arr[i - 1] - 1e-9);
  dice(crescente(micVals), `la MIC cresce col burden (${micVals.join(" → ")})`, micVals);
  dice(crescente(ppvVals), `la PPV stimata cresce col burden (${ppvVals.join(" → ")})`, ppvVals);

  const provenienza = await pg.evaluate(() => {
    const tb = document.getElementById("d2-confronta-esito");
    const div = tb ? tb.querySelector("div") : null;
    return div ? div.innerText : "";
  });
  dice(/Kuznetsov/.test(provenienza), "la riga di provenienza cita il modello", provenienza);
  const doppieBurden = paroleDoppie(provenienza);
  dice(doppieBurden.length === 0,
    `⛔ nessuna parola ripetuta di seguito nella riga di provenienza (il difetto «e da da litologia»)`,
    doppieBurden.length ? `${doppieBurden.join(", ")} — in: ${provenienza}` : provenienza);
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

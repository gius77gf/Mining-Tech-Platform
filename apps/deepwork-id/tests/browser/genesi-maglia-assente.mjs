/* B0-SEPTIES · LA MAGLIA CHE NON SI GENERA PIÙ CON BURDEN/INTERASSE ASSENTI
   ───────────────────────────────────────────────────────────────────────
   DOVE VA: apps/deepwork-id/tests/browser/genesi-maglia-assente.mjs
   E VA REGISTRATO in `tutti.mjs`, con la sua passata di controprova.

   Uso:
     node genesi-maglia-assente.mjs [--porta=8612]
     node genesi-maglia-assente.mjs --controprova   (rimette la forma vecchia:
                                                      DEVE fallire)

   PERCHÉ ESISTE (14/09, unità B0-septies). Fino a questa unità `genMaglia2D`
   non aveva NESSUN ripiego (a differenza dei cinque consumatori a valle che
   usano `D2.S||3.5` ecc.): con `D2.B` o `D2.S` `null`, `c*null` e `r*null`
   sono coercizioni a ZERO, quindi ogni foro finiva disegnato sullo stesso
   punto — un conteggio foro corretto sopra una geometria completamente
   falsa. Misurato: `null` non fa "3,5×4" come lasciava intendere una riga
   di `docs/DECISIONI_WEEKEND.md`, fa collassare tutto a `(0,0)`.
   La cura: `magliaAssenteMotivo(B,S)` in `genesi-data.js` (G37) decide
   PRIMA se la maglia è posizionabile; `genMaglia2D` non genera nessuna
   coordinata quando non lo è, `drawDesign2D`/`renderScheda2D` dichiarano la
   ragione invece di disegnare fori fantasma o restare mute.

   Questo banco arriva dalla via VERA — `localStorage` → Home → «Apri» —
   la stessa che B0-nonies (il caso gemello sull'interasse) ha già usato.

   ⚠️ I casi si costruiscono NEI DATI (`localStorage`) e la controprova nella
   RISPOSTA HTTP: il file su disco non si tocca mai, così il banco si può
   lanciare mentre girano altri cantieri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8612;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: rimette `genMaglia2D` alla forma di prima della guardia —
   nessun controllo su B/S, coordinate generate comunque. Il nome della
   tabella è quello che `iniezioni-fresche.mjs` sa leggere. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "  D2.magliaAssente = magliaAssenteMotivo(D2.B, D2.S);\n  if(D2.magliaAssente){ D2.holes=[]; D2.sel=-1; D2.selPrev=-1; D2.lastDet=0; return; }\n  D2.bf = D2.B;",
   "  D2.magliaAssente = null;\n  D2.bf = D2.B;"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    const perQui = DIFETTI.filter(([f]) => p.endsWith(f));
    if (perQui.length) {
      let t = corpo.toString("utf8");
      for (const [, a, b] of perQui) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* IL CONTRASSEGNO COL PROPRIO PID, riletto DAL SERVER: un banco che trova la
   porta occupata e la riusa non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-maglia-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-maglia-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }
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

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 12,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

/* apre una volata salvata a cui manca B e/o S, dalla via vera:
   `localStorage` → Home → bottone «Apri». Nessun foro salvato col progetto
   (come una volata di prima del 05/09): tocca a `genMaglia2D` deciderla. */
async function apriSenza(chiavi) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  const d = { ...DESIGN }; for (const k of chiavi) d[k] = null;
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord",
      data: "2026-07-12", sintesi: "12 fori", design: dd }]));
  }, d);
  /* senza rete vera in questo contenitore, l'import da gstatic morirebbe da
     solo dopo ~13 s per ogni pagina aperta: lo si taglia subito, come già
     fa `genesi-locale.mjs` per lo stesso identico import. */
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
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
const stato = (pg) => pg.evaluate(() => ({
  navigato: document.body.className.includes("scr-design"),
  n: window.__genesi ? window.__genesi.D2.holes.length : -1,
  assente: window.__genesi ? window.__genesi.D2.magliaAssente : undefined,
  scheda: (document.getElementById("d2-scheda") || {}).textContent || "",
}));

console.log(`\n════════ Genesi · la maglia assente si dichiara, non si disegna (B0-septies)${CONTROPROVA ? " · controprova" : ""} ════════`);

const CASI = [
  ["B", ["B"], "burden"],
  ["S", ["S"], "interasse"],
  ["B e S", ["B", "S"], "burden e interasse"],
];

for (const [nome, chiavi, atteso] of CASI) {
  const pg = await apriSenza(chiavi);
  const st = await stato(pg);
  if (!st.navigato || st.n < 0) {
    nonMisurati.push(`${nome} (${st.navigato ? "l'aggancio di debug non c'è" : "la volata non si è aperta nel 2D"})`);
    await pg.close(); continue;
  }
  dice(pg.__errori.length === 0, `${nome} assente: zero errori di pagina`, pg.__errori[0]);
  dice(st.n === 0, `⛔ ${nome} assente: zero fori disegnati (non più sovrapposti sullo stesso punto)`, st.n);
  dice(st.assente === atteso, `${nome} assente: la ragione dichiarata è "${atteso}"`, st.assente);
  dice(new RegExp(`manca ${atteso}\\b`).test(st.scheda), `${nome} assente: la scheda nomina la ragione`, st.scheda.slice(0, 120));
  await pg.close();
}

/* e il verso opposto: con B e S leggibili la maglia torna a disegnarsi come
   sempre — una difesa che spegnesse la maglia SEMPRE sarebbe peggio del
   difetto che corregge */
console.log("\n· il verso opposto: con burden e interasse leggibili, la maglia c'è ed è quella vera");
{
  const pg = await apriSenza([]);
  const st = await stato(pg);
  if (!st.navigato || st.n < 0) {
    nonMisurati.push("progetto sano (l'aggancio di debug non c'è, o la volata non si è aperta)");
  } else {
    dice(pg.__errori.length === 0, "progetto sano: zero errori di pagina", pg.__errori[0]);
    dice(st.n === 12, "progetto sano: 12 fori disegnati (1 fila × 12), non zero", st.n);
    dice(st.assente === null, "progetto sano: nessuna ragione dichiarata", st.assente);
    dice(!/non disegnabile/i.test(st.scheda), "progetto sano: la scheda non dice \"non disegnabile\"", st.scheda.slice(0, 80));
  }
  await pg.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato maglia assente di Genesi: ${ok} passati, ${ko} falliti  ·  16 asserzioni attese (4 per caso × 3 casi, più 4 sul progetto sano)`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

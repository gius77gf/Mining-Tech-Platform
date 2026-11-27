/* G39/G40 — LA SPALLA (BURDEN) E IL CONSUMO SPECIFICO (POWDER FACTOR): DUE
   GLOSSE DAL DELTA DELLA RICERCA CONTINUA SU PAROLE (blocco 4, 17/09).
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-vocabolario-voladura.mjs [--porta=8753]
     node genesi-vocabolario-voladura.mjs --controprova   (rimette i due difetti: DEVE fallire)

   PERCHÉ ESISTE. La ricerca ha trovato che il pannello base chiama la
   grandezza «Spalla», mentre due funzioni avanzate (confronto burden,
   burden per foro dalla maglia) la chiamavano solo «burden», mai insieme —
   contro la fonte del mestiere (tesi Politecnico di Torino), che scrive
   sempre «spalla (burden)». E che il badge del powder factor cambiava nome
   da solo a seconda del verdetto: «Powder factor» nell'etichetta, «carica
   specifica» nel testo buono, «PF» in quello basso/alto — mentre il resto
   di Genesi (31 occorrenze) chiama la stessa grandezza «consumo specifico».
   Corretto in `genesi.html`: i due titoli/dialogo glossati «spalla
   (burden)», il badge unificato su «Consumo specifico (powder factor)». */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8753;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. Se
   il testo da cercare non c'è più (perché la riga è cambiata per un'altra
   ragione), l'iniezione non tocca niente e la controprova lo dichiara
   invece di dare un falso «so fallire». */
const DIFETTI = [
  [`>📊 Confronta spalla (burden) per lo stesso obiettivo</button>`,
   `>📊 Confronta burden per lo stesso obiettivo</button>`],
  [`>📐 Spalla (burden) per foro (dalla maglia)</button>`,
   `>📐 Burden per foro (dalla maglia)</button>`],
  [`nonCalcolabile('Consumo specifico (powder factor)',_fg.che+'. '+_fg.come)`,
   `nonCalcolabile('Powder factor',_fg.che+'. '+_fg.come)`],
  [`badge(pf,'Consumo specifico (powder factor)',gfix(pf,2)+' <span>kg/m³</span>',0.30,0.55,0.22,0.7,
    'consumo specifico nel range consigliato (0,30–0,55 kg/m³).',
    'consumo specifico basso → rischio blocchi/oversize; tipico 0,30–0,50 kg/m³.',
    'consumo specifico alto → rischio proiezioni/sovra-frammentazione.')`,
   `badge(pf,'Powder factor',gfix(pf,2)+' <span>kg/m³</span>',0.30,0.55,0.22,0.7,
    'carica specifica nel range consigliato (0,30–0,55 kg/m³).',
    'PF basso → rischio blocchi/oversize; tipico 0,30–0,50 kg/m³.',
    'PF alto → rischio proiezioni/sovra-frammentazione.')`],
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
const SEGNO = join(R, "__genesi-vocabolario-voladura-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-vocabolario-voladura-${process.pid}`)).text();
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

/* B alto apposta (2.6 su Ø102 con ANFO: 23–28·Ø ≈ 2,3–2,9 m attesi, quindi
   coerente) e kg alto apposta perché il powder factor risulti FUORI range
   (alto): la prova deve vedere il ramo "alto", non solo quello "buono" —
   se vedesse solo il buono un `carica specifica`/`PF` sciolto rimesso a
   mano potrebbe restare invisibile. */
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

console.log(`\n════════ Genesi: vocabolario della voladura — spalla (burden), consumo specifico (powder factor)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apri();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

// ── 1 · SPALLA (BURDEN), glossata nei due pannelli avanzati (Proposta 11) ──
console.log("\n· i due pannelli avanzati nominano SIA spalla SIA burden");
const testoBurden = await pg.evaluate(() => document.getElementById("btn-confronta-burden")?.textContent || "");
const testoBurdenForo = await pg.evaluate(() => document.getElementById("btn-burden-foro")?.textContent || "");
dice(/spalla/i.test(testoBurden) && /burden/i.test(testoBurden), "«Confronta...» nomina spalla E burden", testoBurden);
dice(/spalla/i.test(testoBurdenForo) && /burden/i.test(testoBurdenForo), "«...per foro (dalla maglia)» nomina spalla E burden", testoBurdenForo);

// ── 2 · CONSUMO SPECIFICO (POWDER FACTOR), un solo nome nel badge (Proposta 12) ──
console.log("\n· il badge del powder factor porta SEMPRE la stessa parola d'ordine");
const scheda = await pg.evaluate(() => document.getElementById("d2-scheda")?.innerHTML || "");
const riga = (scheda.match(/<div class="sv-row"[^>]*data-lab="Consumo specifico \(powder factor\)"[\s\S]*?sv-chev[\s\S]*?<\/div>/) || [""])[0];
dice(riga.length > 0, "la riga del badge esiste con l'etichetta unificata", scheda.length);
dice(/consumo specifico/i.test(riga), "il testo sotto usa «consumo specifico», non «carica specifica»/«PF» sciolti", riga);
dice(!/\bcarica specifica\b/i.test(riga) && !/\bPF\b/.test(riga), "nessun «carica specifica»/«PF» residuo nella stessa riga", riga);
// con kg=62 su B=2.6·S=3.0·Ø102·H≈13,4 (prof+sub) il powder factor esce ALTO: verifica il ramo davvero esercitato
dice(/alto/i.test(riga), "con questo progetto il verdetto è ALTO: il ramo esercitato è quello che prima diceva «PF alto»", riga);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

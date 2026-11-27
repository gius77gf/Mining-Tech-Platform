/* GENESI — OGNI COMANDO DEL PROGETTO 2D STA NELLA COLONNA DELLA PAGINA
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-colonna-progetto.mjs [--porta=8701]
     node genesi-colonna-progetto.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 27/11, guardando gli scatti del Progetto 2D coi valori per
   foro accesi, in fondo alla schermata gli ultimi comandi — i due scatti A/B
   col confronto, riconciliazione, signature-hole, legge di sito, Sentinella —
   andavano DA BORDO A BORDO: a 430 px toccavano i due lati dello schermo, e
   misurati a 1280 px erano bottoni larghi 1280 px sotto una colonna di 560.
   Erano figli diretti della schermata, che è una colonna flessibile, e si
   allargavano quanto lei. Tutto il resto della pagina sta in una colonna con
   14 px di margine: loro no.
   Nessun banco lo vedeva, e non per caso: `fuori-schermo` chiede «esce dallo
   schermo?», e un bottone largo ESATTAMENTE quanto lo schermo non esce. È la
   seconda domanda che mancava — non «esce?», ma «tocca il bordo?».
   La stessa misura ha trovato un secondo caso che lo scatto a 430 non
   mostrava: a 320 px «Confronta spalla (burden) per lo stesso obiettivo»
   arrivava a 4 px dai due lati.

   CHE COSA PRETENDE, a 320, 430, 768 e 1280 px, per ogni comando visibile del
   Progetto 2D (bottoni, campi, tendine, link):
     · almeno 12 px dai due bordi dello schermo;
     · non più largo della colonna (560 px).
   E il denominatore: quanti comandi ha misurato a ogni larghezza — se la
   schermata non si è aperta la risposta «nessuno al bordo» varrebbe zero.
   I rettangoli orizzontali non dipendono da quanto si è scorso in verticale:
   si misurano tutti senza scorrere.

   ⚠️ CHE COSA NON GUARDA: l'altezza dei comandi (molti sono sotto i 44 px che
   servono a un dito: misurato lo stesso giorno, è un'unità a sé) e le altre
   schermate di Genesi. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8701;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE: il contenitore degli ultimi comandi smette di essere
   una colonna (i suoi figli tornano figli della schermata, larghi quanto lei),
   i comandi centrati tornano senza tetto, e la riga dei due scatti torna
   attaccata al bordo sinistro. */
const DIFETTI = [
  [`#d2-altri{width:100%;max-width:560px;margin:8px auto 0;padding:0 14px}`, `#d2-altri{display:contents}`],
  [`#scr-design>.btn{max-width:calc(100% - 28px);white-space:normal}`, ``],
  [`#d2-altri .d2-ab{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}`, `#d2-altri .d2-ab{display:flex;gap:8px}`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-colonna-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-colonna-${process.pid}`)).text();
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

console.log(`\n════════ Genesi: ogni comando del Progetto 2D sta nella colonna${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
pg.__err = [];
pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
const scadenza = Date.now() + 25000;
while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
await pg.waitForTimeout(300);
await pg.click('#bottomnav button[data-scr="design"]');
await pg.waitForTimeout(700);

const MARGINE = 12, COLONNA = 560;
const misura = () => pg.evaluate(({ MARGINE, COLONNA }) => {
  const vw = window.innerWidth, S = document.getElementById("scr-design"); let n = 0; const bordo = [], larghi = [];
  const aperta = !!S && getComputedStyle(S).display !== "none";
  for (const e of (S ? S.querySelectorAll("button, input, select, textarea, a[href]") : [])) {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    n++;
    const nome = (e.id || e.className || e.tagName).toString().slice(0, 28);
    if (r.left < MARGINE - 0.5 || r.right > vw - MARGINE + 0.5) bordo.push(`${nome} [${Math.round(r.left)} px a sinistra, ${Math.round(vw - r.right)} a destra]`);
    if (r.width > COLONNA + 0.5) larghi.push(`${nome} largo ${Math.round(r.width)} px`);
  }
  return { aperta, n, bordo, larghi };
}, { MARGINE, COLONNA });

for (const w of [320, 430, 768, 1280]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  const q = await misura();
  dice(q.aperta && q.n >= 60, `a ${w} px il Progetto 2D è aperto e i comandi misurati sono ${q.n} (almeno 60)`, q.n);
  dice(q.bordo.length === 0, `⛔ a ${w} px nessun comando sta a meno di ${MARGINE} px dai bordi dello schermo`, q.bordo.join(" · "));
  dice(q.larghi.length === 0, `⛔ a ${w} px nessun comando è più largo della colonna (${COLONNA} px)`, q.larghi.join(" · "));
}

/* i sette comandi che hanno fatto nascere il banco, detti per nome: stanno nella stessa colonna della scheda */
await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(300);
const nomi = await pg.evaluate(() => { const lato = (id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(window.innerWidth - r.right)]; };
  const sc = document.getElementById("d2-scheda"), cs = getComputedStyle(sc), rs = sc.getBoundingClientRect();
  return { colonna: [Math.round(rs.left + parseFloat(cs.paddingLeft)), Math.round(window.innerWidth - rs.right + parseFloat(cs.paddingRight))],
    larghi: ["riconOpen", "sigOpen", "sitoOpen", "sentOpen"].map(lato), scatti: ["cmpSaveA", "cmpSaveB", "cmpShow"].map(lato) }; });
dice(nomi.larghi.every((l) => l && l[0] === nomi.colonna[0] && l[1] === nomi.colonna[1]),
  `a 430 px riconciliazione, signature-hole, legge di sito e Sentinella hanno gli stessi margini della scheda volata (${nomi.colonna.join(" e ")} px): erano 0 e 0`, JSON.stringify(nomi));
dice(nomi.scatti.every((l) => l && l[0] >= nomi.colonna[0] && l[1] >= nomi.colonna[1]),
  "e i due scatti A/B col confronto stanno dentro la stessa colonna («Salva come A» partiva da 0)", JSON.stringify(nomi.scatti));

dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length, `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`, [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

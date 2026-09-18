/* IL QUADRO TACEVA SU UNA PERSONA "NON IDONEA" DAL MEDICO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-quadro-non-idoneo.mjs [--porta=8564]
     node campo-quadro-non-idoneo.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass su Campo (17/09): il widget
   del Quadro (`dash-hse`) — costruito apposta perché "chi è in turno è in
   regola?" non restasse chiuso nella sola sezione Squadre — leggeva SOLO
   `q.scadute`, mai `q.nonIdonei`. Il giudizio medico di inidoneità, che per
   lo stesso ponte "vince su tutto" (commento sopra `idoneitaOperatore` in
   shared/dw-ponti.js), restava invisibile sul primo schermo che si apre la
   mattina finché nessuno aveva ANCHE un documento scaduto. Sulla
   dimostrazione, Luca Bianchi è "non-idoneo" in Scudo mentre i suoi
   documenti sono in corso: il Quadro non lo nominava mai, la sezione
   Squadre sì. Corretto leggendo anche `q.nonIdonei`, col giudizio medico
   prima delle scadenze — stessa priorità del widget gemello `ope-hse`. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8564;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. Se
   il testo da cercare non c'è più (perché la riga è cambiata per un'altra
   ragione), l'iniezione non tocca niente e la controprova lo dichiara
   invece di dare un falso «so fallire». */
/* ⏱️ RI-ANCORATO il 18/09 (dal deep-pass sui ponti): il gate e il corpo
   sono cambiati per l'ottavo stato («senza data»), che ha aggiunto un
   terzo secchio al widget. Ri-ancorato su gate + blocco `nonIdonei` (le
   due parti che, insieme, riproducono il difetto storico: senza
   entrambe, il gate resta aperto lo stesso grazie a `q.scadute` — vero
   anche nella dimostrazione — e il corpo mostrerebbe comunque il
   giudizio medico, quindi la controprova non saprebbe fallire). */
const DIFETTI = [
  [`el.innerHTML = !q || (!q.scadute && !q.nonIdonei && !q.senzaData) ? "" :
        \`<div class="note avviso" data-goto="squ" role="button" tabindex="0" style="cursor:pointer" title="Vai a chi c'è in squadra">\`
        + (q.nonIdonei
            ? \`<b>\${q.nonIdonei === 1 ? "Una persona in turno oggi NON è idonea" : q.nonIdonei + " persone in turno oggi NON sono idonee"}</b>\`
              + \` secondo il medico competente (Scudo) — \${q.righe.filter(r => r.stato === "non-idoneo").map(r => esc(r.operatore.nome)).join(", ")}:\`
              + \` \${q.nonIdonei === 1 ? "non va mandata" : "non vanno mandate"} in cava finché il giudizio non cambia. \`
            : "")`,
   `el.innerHTML = !q || !q.scadute ? "" :
        \`<div class="note avviso" data-goto="squ" role="button" tabindex="0" style="cursor:pointer" title="Vai a chi c'è in squadra">\`
        + ""`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/campo/index.html")) {
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
const SEGNO = join(R, "__campo-quadro-non-idoneo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__campo-quadro-non-idoneo-${process.pid}`)).text();
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

console.log(`\n════════ Campo: il Quadro segnala anche il giudizio medico "non idoneo"${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 1200, height: 900 } });
pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(1500);
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const testo = await pg.evaluate(() => document.getElementById("dash-hse")?.innerText || "");
dice(testo.length > 0, "il widget del Quadro non è vuoto (la dimostrazione ha un caso da segnalare)", testo);
dice(/Luca Bianchi/.test(testo) && /NON è idonea|NON sono idonee/i.test(testo),
  "Luca Bianchi (non-idoneo in Scudo) compare nel Quadro col giudizio medico", testo);
dice(/documento scaduto/i.test(testo), "e le scadute restano segnalate, non sostituite", testo);
// il giudizio medico va PRIMA delle scadenze, come nel widget gemello ope-hse
const idxNonIdoneo = testo.search(/NON è idonea|NON sono idonee/i);
const idxScadute = testo.search(/documento scaduto/i);
dice(idxNonIdoneo >= 0 && idxScadute >= 0 && idxNonIdoneo < idxScadute,
  "il giudizio medico precede le scadenze nel testo, stessa priorità del widget Squadre", testo);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

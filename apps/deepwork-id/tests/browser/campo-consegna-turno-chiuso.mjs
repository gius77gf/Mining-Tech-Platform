/* LA CONSEGNA DI TURNO RISCRIVEVA UN DOCUMENTO GIÀ FIRMATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-consegna-turno-chiuso.mjs [--porta=8565]
     node campo-consegna-turno-chiuso.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass su Campo (17/09): fra i ~18
   punti di scrittura che campo-data.js dichiara vincolati a `bloccato()`
   ("una firma vale qualcosa solo se dopo la firma il documento non cambia
   più" — commento sopra `turnoChiuso`), «Consegna di turno (testo)»
   (`btn-consegna`) era l'UNICO che scrive nella collezione `chiusure` —
   la stessa che `btn-fir` firma — senza chiamare `bloccato()`. Un turno già
   chiuso e firmato lasciava comunque riscrivere `testoConsegna`/
   `oraTestoConsegna` sullo stesso record, senza traccia di riapertura: il
   documento che in caso di contestazione dovrebbe fissare "cosa diceva la
   consegna" poteva cambiare silenziosamente dopo la firma. Corretto
   aggiungendo lo stesso `bloccato()` degli altri 18 punti. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8565;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 17/09. Se
   il testo da cercare non c'è più (perché la riga è cambiata per un'altra
   ragione), l'iniezione non tocca niente e la controprova lo dichiara
   invece di dare un falso «so fallire». */
const DIFETTI = [
  [`const turno = $("chk-turno").value || turnoCorrente();
    if (bloccato(OGGI, turno, "la consegna di turno", "rap-esito")) return;
    /* Il testo lo compone`,
   `/* Il testo lo compone`],
  [`el.download = "consegna_turno.txt"; marchiaCsv(el); el.click();
    // stessa trappola di "btn-fir": \`gia\` legge CHI in memoria, aggiornato
    // solo da refresh() più in basso.
    occupato("btn-consegna", true);
    const gia = chiusuraDi(CHI, OGGI, turno);`,
   `el.download = "consegna_turno.txt"; marchiaCsv(el); el.click();
    const turno = $("chk-turno").value || turnoCorrente();
    // stessa trappola di "btn-fir": \`gia\` legge CHI in memoria, aggiornato
    // solo da refresh() più in basso.
    occupato("btn-consegna", true);
    const gia = chiusuraDi(CHI, OGGI, turno);`],
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
const SEGNO = join(R, "__campo-consegna-turno-chiuso-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__campo-consegna-turno-chiuso-${process.pid}`)).text();
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

console.log(`\n════════ Campo: la consegna di turno non riscrive un documento già firmato${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 1200, height: 900 } });
pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(1500);
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

await pg.click("#nav-rap");
await pg.waitForTimeout(500);
await pg.fill("#fir-consegna", "Mario Rossi");
await pg.fill("#fir-ricevuta", "Luca Bianchi");
await pg.click("#btn-fir");
await pg.waitForTimeout(600);
const esitoFirma = await pg.evaluate(() => document.getElementById("fir-esito")?.innerText || "");
dice(/chiuso/i.test(esitoFirma), "il turno risulta chiuso dopo la firma", esitoFirma);

await pg.click("#btn-consegna");
await pg.waitForTimeout(600);
const esitoConsegna = await pg.evaluate(() => document.getElementById("rap-esito")?.innerText || "");
dice(/già chiuso.*non si può più cambiare/i.test(esitoConsegna),
  "premendo «Consegna di turno» su un turno già firmato, la scrittura è BLOCCATA (stesso messaggio degli altri 18 punti)", esitoConsegna);
dice(/riapri il turno/i.test(esitoConsegna), "e spiega come correggere (riaprire il turno)", esitoConsegna);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

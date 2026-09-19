/* IL MISFIRE NEL REPORT STAMPATO (G55, 19/09) — DAL DELTA VERIFICATO DI
   docs/RICERCA_CONTINUA_GENESI.md (terzo giro, Domanda B).
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-report-misfire.mjs [--porta=8769]
     node genesi-report-misfire.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il "Report volata" (btn-report) è il documento che si
   stampa e si archivia — sei sezioni, tutte PRE-sparo. G52 ha insegnato a
   Genesi a riconoscere un misfire (colpo cieco) nella Riconciliazione a
   schermo; questo banco prova che, se un consuntivo con un misfire è già
   stato importato QUANDO si ristampa il rapporto per l'archivio, il
   documento non lo taccia — sarebbe il principio del fondatore violato
   nel documento che resta, non solo nella schermata che si chiude. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8769;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il report smette di comporre la sezione
   sull'esito della detonazione — la stessa svista già presa altrove in
   questa famiglia (un pezzo scritto e mai collegato al posto giusto). */
const DIFETTI = [
  [`+_repEsito\n    +firma`, `+firma`],
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
const SEGNO = join(R, "__genesi-report-misfire-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-report-misfire-${process.pid}`)).text();
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
  /* IL REPORT NON APRE UNA VERA FINESTRA IN HEADLESS: si intercetta
     `window.open` e si cattura l'HTML scritto — stessa tecnica già usata
     da genesi-foglio-in-cava.mjs per lo stesso bottone. */
  await pg.evaluate(() => {
    window.__doc = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close() {} }, focus() {}, print() {} });
  });
  await pg.click('#bottomnav button[data-scr="design"]');
  await pg.waitForTimeout(600);
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded();
  await pg.waitForTimeout(150);
  return pg;
}
async function apriRiconciliazione(pg) {
  await pg.click("#riconOpen");
  await pg.waitForTimeout(200);
}
async function importaConsuntivo(pg, csv) {
  await pg.click("#riconCampo");
  await pg.setInputFiles("#riconCampoFile", { name: "consuntivo.csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  await pg.waitForTimeout(300);
  await pg.click("#riconClose");
  await pg.waitForTimeout(150);
}
async function stampaReport(pg) {
  await pg.evaluate(() => { window.__doc = null; });
  await pg.click("#btn-report");
  await pg.waitForTimeout(500);
  return pg.evaluate(() => String(window.__doc || ""));
}

console.log(`\n════════ Genesi: il misfire nel report stampato (G55)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

/* PRIMO CASO: report stampato PRIMA di importare qualunque consuntivo —
   il caso normale, pre-sparo. Nessuna sezione sull'esito: non è
   un'omissione, è che non c'è ancora niente da sapere. */
const primaDiImportare = await stampaReport(pg);
dice(primaDiImportare.length > 500, "il report si compone", primaDiImportare.length);
dice(!/[Ee]sito della detonazione/.test(primaDiImportare),
  "prima di importare un consuntivo, il report non parla di esito (silenzioso, non un'omissione)", primaDiImportare.length);

await apriRiconciliazione(pg);

/* IL CASO CHE CONTA: un misfire importato PRIMA di ristampare il report
   per l'archivio — il documento che resta non può tacerlo. */
const CON_MISFIRE = "foro;carica_prog_kg;carica_reale_kg;esito;id_foro\n"
  + "1;58;61;sparato;f1-1\n"
  + "2;58;58;misfire;f1-2\n";
await importaConsuntivo(pg, CON_MISFIRE);
const conMisfire = await stampaReport(pg);
dice(/[Ee]sito della detonazione/.test(conMisfire), "dopo l'import, il report guadagna la sezione sull'esito", conMisfire.length);
dice(/[Mm]isfire/.test(conMisfire) && /f1-2/.test(conMisfire),
  "⛔ e nomina il foro vero (id) del misfire — il documento che resta non tace", conMisfire.match(/[Mm]isfire[^<]*/)?.[0]);

/* IL CASO GEMELLO: colonna presente, zero misfire — lo zero qui è VERO
   (il consuntivo è tracciato) e va confermato con calma, non taciuto
   come nel primo caso (dove non c'era nessun consuntivo). */
const SENZA_MISFIRE = "foro;carica_prog_kg;carica_reale_kg;esito\n1;58;61;sparato\n2;58;60;sparato\n";
await apriRiconciliazione(pg);
await importaConsuntivo(pg, SENZA_MISFIRE);
const zeroVero = await stampaReport(pg);
dice(/[Ee]sito della detonazione/.test(zeroVero), "e con un consuntivo tracciato senza misfire, la sezione compare comunque", zeroVero.length);
dice(/[Nn]essuno/.test(zeroVero), "confermando lo zero con calma (consuntivo tracciato, non «esito non tracciato»)", zeroVero.match(/[Nn]essuno[^<]*/)?.[0]);

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

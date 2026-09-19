/* L'ESITO DELLA DETONAZIONE (G52, 19/09) — UN FORO CARICATO E MAI SPARATO
   (MISFIRE) HA LO STESSO SCOSTAMENTO VICINO A ZERO DI UNO SPARATO
   REGOLARMENTE, E NESSUN NUMERO DELLA SCHERMATA LO SEGNALA DA SOLO.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-esito-detonazione.mjs [--porta=8766]
     node genesi-esito-detonazione.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La parte pura (`_riconParseCampo`/`_riconRiassuntoCampo`)
   è provata in run-kpi.mjs; questo banco prova che un consuntivo con un
   misfire dichiarato, importato nella schermata VERA della riconciliazione,
   produca davvero l'avviso rosso — e che un consuntivo SENZA la colonna
   «esito» (ogni file reale di oggi) dichiari «non tracciato», non «zero
   misfire»: il principio del fondatore, applicato al dato più pericoloso
   di questa schermata invece che a un chilo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8766;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: la scheda smette di distinguere «colonna
   assente» da «colonna presente, zero misfire» — la stessa svista già
   pagata su `misurabile`/`kgReale`, qui applicata al dato più pericoloso:
   un misfire vero smetterebbe di comparire come allarme rosso e finirebbe
   trattato come un file qualunque senza colonna esito. */
const DIFETTI = [
  [`c.colonnaEsito && c.nMisfire`,
   `false && c.nMisfire`],
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
const SEGNO = join(R, "__genesi-esito-detonazione-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-esito-detonazione-${process.pid}`)).text();
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

async function apriPagina() {
  const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  /* «Riconciliazione» vive nella scheda Design 2D, come i pulsanti di
     import/export della volata — la stessa navigazione già usata dagli
     altri banchi di questa pagina (genesi-rifletti-selezione.mjs). */
  await pg.click('#bottomnav button[data-scr="design"]');
  await pg.waitForTimeout(600);
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
  return pg.locator("#riconBody").innerHTML();
}

console.log(`\n════════ Genesi: l'esito della detonazione (G52)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriPagina();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
await apriRiconciliazione(pg);

/* IL CASO CHE CONTA: un consuntivo con due fori sparati e uno caricato e
   MAI sparato (misfire) — l'esatto scenario del delta di ricerca. */
const CON_MISFIRE = "foro;carica_prog_kg;carica_reale_kg;esito;id_foro\n"
  + "1;58;61;sparato;f1-1\n"
  + "2;58;58;misfire;f1-2\n"
  + "3;58;60;sparato;f1-3\n";
const conMisfire = await importaConsuntivo(pg, CON_MISFIRE);
dice(/ricamp-danger/.test(conMisfire), "un misfire dichiarato produce l'avviso rosso distinto (non un ricamp-warn qualunque)", conMisfire.slice(0, 200));
dice(/misfire/i.test(conMisfire) && /f1-2/.test(conMisfire), "l'avviso nomina il foro vero (id), non un conteggio anonimo", conMisfire.match(/ricamp-danger[^<]*<[^>]*>[^<]*/)?.[0]);
dice(/1 foro risulta/.test(conMisfire) || /foro risulta.*misfire/i.test(conMisfire), "il conteggio è al singolare con un solo misfire (non '1 fori')", conMisfire.slice(0, 300));

/* IL CASO GEMELLO, quello che la controprova deve rompere: la colonna
   ASSENTE (ogni consuntivo reale di oggi) dichiara "non tracciato", MAI
   uno zero calmo che si legge come "nessun colpo cieco". */
const SENZA_ESITO = "foro;carica_prog_kg;carica_reale_kg\n1;58;61\n2;58;58\n";
const senzaEsito = await importaConsuntivo(pg, SENZA_ESITO);
dice(!/ricamp-danger/.test(senzaEsito), "senza la colonna non compare nessun allarme rosso (non si inventa un misfire dal niente)", senzaEsito.slice(0, 200));
dice(/non porta la colonna.*esito/i.test(senzaEsito) || /non si sa se ci sono stati colpi ciechi/i.test(senzaEsito),
  "⛔ e DICHIARA che l'esito non è tracciato — non tace, non dice '0 misfire'", senzaEsito.slice(0, 400));

/* IL TERZO CASO: colonna presente, zero misfire — qui lo zero è VERO e va
   confermato con calma, non taciuto come nel caso senza colonna. */
const ZERO_VERO = "foro;carica_prog_kg;carica_reale_kg;esito\n1;58;61;sparato\n2;58;58;sparato\n";
const zeroVero = await importaConsuntivo(pg, ZERO_VERO);
dice(!/ricamp-danger/.test(zeroVero), "zero misfire dichiarato: nessun allarme rosso", zeroVero.slice(0, 200));
dice(/Nessun foro con esito.*misfire.*dichiarato/i.test(zeroVero), "e lo dice esplicitamente (zero VERO, diverso dal 'non tracciato' del caso precedente)", zeroVero.slice(0, 400));

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

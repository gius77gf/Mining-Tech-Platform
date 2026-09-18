/* CONTI: IL BOTTONE «EMETTI» NON SI DISABILITAVA — DOPPIO TOCCO, NUMERO
   DUPLICATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-bottone-emetti-occupato.mjs                 (porta effimera)
     node conti-bottone-emetti-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Conti (18/09). Il
   controllo sul numero duplicato («Questo numero è già usato da un'altra
   fattura») legge FAT, l'array in memoria, che si aggiorna solo dentro
   `refresh()` — chiamato per ULTIMO nell'handler. Un doppio tocco rapido
   (rete lenta in cava) passa il controllo due volte prima che la prima
   scrittura sia confermata: due fatture nascono con lo stesso numero,
   proprio quello che il controllo esiste per impedire. Stessa famiglia già
   chiusa lo stesso giorno in Terra/Flotta con `occupato` (shared/dw-app-ui.js).
   Il bottone ha anche l'etichetta che CAMBIA da sola ("Emetti" ↔ "Salva
   modifica", secondo `editFat`): la trappola gemella già presa su
   «btn-fro»/«btn-lot»/«btn-aut-salva» — `occupato(false)` deve correre
   PRIMA della riscrittura esplicita dell'etichetta, non dopo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/conti/index.html",
   `    $("ft-esito").textContent = "";
    /* ⛔ 18/09, dal secondo giro di deep-pass QA: il controllo sul numero
       duplicato qui sopra legge FAT in memoria, aggiornato solo da refresh()
       QUATTRO righe più in basso — un doppio tocco rapido (rete lenta in
       cava) passa il controllo due volte e scrive due fatture con lo stesso
       numero. Stessa famiglia già chiusa oggi in Terra/Flotta. */
    occupato("btn-ft", true);`,
   `    $("ft-esito").textContent = "";`],
  ["apps/conti/index.html",
   "      // `occupato(false)` PRIMA di riscrivere l'etichetta: se corresse dopo,\n"
   + "      // restituirebbe il testo catturato al tocco (\"Salva modifica\"),\n"
   + "      // cancellando il cambio di modo appena fatto — la stessa trappola\n"
   + "      // presa oggi su «btn-fro»/«btn-lot»/«btn-aut-salva» in Terra.\n"
   + "      occupato(\"btn-ft\", false);\n"
   + "      editFat = null; $(\"btn-ft\").textContent = \"Emetti\";",
   "      editFat = null; $(\"btn-ft\").textContent = \"Emetti\";"],
  ["apps/conti/index.html",
   `        emessa: oggiISO(), incassata: false });
      occupato("btn-ft", false);
      esito("ft-esito", "Fattura " + numero + " emessa:`,
   `        emessa: oggiISO(), incassata: false });
      esito("ft-esito", "Fattura " + numero + " emessa:`],
];
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("fat-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Conti è pronta (in dimostrazione)");
await vaiA(pg, "conti", "nav-fat");

/* ── il bottone «Emetti»: doppio tocco quasi simultaneo, numero duplicato ── */
const nFatPrima = await pg.evaluate(() => document.querySelectorAll("#fat-list .item").length);
await pg.fill("#ft-num", "2099/999");
await pg.selectOption("#ft-cli", { index: 1 });
await pg.fill("#ft-imp", "1.000,00");
await pg.fill("#ft-scad", "2027-01-15");
/* due `.click()` nativi nella STESSA chiamata a `evaluate` (non due
   `pg.click()`), per garantire che il secondo tocco arrivi mentre il primo
   handler è ancora fermo sul primo `await`: è il meccanismo che rende la
   difesa efficace indipendentemente da quanto sia lenta la rete vera. */
await pg.evaluate(() => { const b = document.getElementById("btn-ft"); b.click(); b.click(); });
await pg.waitForTimeout(600);
const nFatDopo = await pg.evaluate(() => document.querySelectorAll("#fat-list .item").length);
dice(nFatDopo === nFatPrima + 1, `⛔ due tocchi quasi simultanei emettono UNA fattura, non due (${nFatPrima} -> ${nFatDopo})`, { nFatPrima, nFatDopo });
const numeriUguali = await pg.evaluate(() => [...document.querySelectorAll("#fat-list .num-doc")].filter((el) => el.textContent.includes("2099/999")).length);
dice(numeriUguali === 1, "«2099/999» compare una sola volta nell'elenco", numeriUguali);

/* si rimisura da capo, per leggere lo stato a fine scrittura */
await pg.fill("#ft-num", "2099/998");
await pg.selectOption("#ft-cli", { index: 1 });
await pg.fill("#ft-imp", "500,00");
await pg.fill("#ft-scad", "2027-02-20");
await pg.click("#btn-ft"); await pg.waitForTimeout(600);
const dopoScrittura = await pg.evaluate(() => ({ disabled: document.getElementById("btn-ft")?.disabled, testo: document.getElementById("btn-ft")?.textContent }));
dice(dopoScrittura.disabled === false && dopoScrittura.testo === "Emetti", "e si riaccende con l'etichetta di sempre a fine scrittura", dopoScrittura);

/* ── l'etichetta che CAMBIA: modificando una fattura esistente ── */
// non tutte le fatture si possono modificare: quelle incassate non hanno la
// matita (index.html: `${!f.incassata?"<button ... data-edit-fat...":""}`)
const primaFattura = await pg.evaluate(() => document.querySelector("#fat-list [data-edit-fat]")?.getAttribute("data-edit-fat"));
dice(!!primaFattura, "la dimostrazione ha almeno una fattura da modificare (non incassata)", primaFattura);
await pg.evaluate((id) => { const m = document.querySelector(`[data-edit-fat="${id}"]`); if (m) m.click(); }, primaFattura);
await pg.waitForTimeout(200);
const etichettaEdit = await pg.evaluate(() => document.getElementById("btn-ft")?.textContent);
if (etichettaEdit === "Salva modifica") {
  await pg.click("#btn-ft"); await pg.waitForTimeout(600);
  const editDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-ft")?.disabled, testo: document.getElementById("btn-ft")?.textContent }));
  dice(editDopo.disabled === false, "il bottone si riaccende dopo la modifica", editDopo);
  dice(editDopo.testo === "Emetti", "⛔ e l'etichetta torna «Emetti» — non «Salva modifica»: il cambio di modo non viene cancellato dal riaccendersi del bottone", editDopo);
} else {
  console.log("  (nessun agganciatore di modifica trovato sulla prima fattura: passo che salta, non un KO)");
}
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

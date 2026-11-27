/* TERRA: IL BOTTONE "REGISTRA" DELLA MODALE "NUOVO INVENTARIO DEI CUMULI"
   NON SI DISABILITAVA — UN DOPPIO TOCCO DUPLICA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-inventario-occupato.mjs                 (porta effimera)
     node terra-inventario-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Terra (18/09). Il fix
   di oggi ha promosso `occupato()` a shared/dw-app-ui.js e l'ha applicato
   a cinque punti di scrittura di Terra (rilievo, scadenza, fronte,
   autorizzazione, lotto), ma un sesto è rimasto scoperto: il bottone
   "Registra" della modale "Nuovo inventario dei cumuli". La sua `azione`
   (funzione `salva` dentro `nuovoInventario()`) fa `await
   db.aggiungi("inventari", {...})` e chiama `chiudiModale()` solo DOPO che
   la scrittura è tornata — il bottone resta cliccabile per tutta l'attesa,
   e un doppio tocco crea due fotografie del piazzale identiche. Diverso
   dagli altri cinque: il bottone di questa modale non è un `<button
   id="...">` fisso (`apriModale` lo crea al volo, senza id), quindi non si
   può usare `occupato(id,...)`: si disabilita direttamente l'elemento
   `.mbtn.primary` dentro `#modal-foot`. */
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

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09 sera. */
const DIFETTI = [
  ["apps/terra/index.html",
   "      if (!cumuli.length) return errore(\"Serve almeno un cumulo col suo materiale: un inventario senza cumuli non fotografa niente.\", document.querySelector(\"#inv-righe .inv-mat\"));\n"
   + "      /* ⛔ 18/09, dal secondo giro di deep-pass QA: il bottone \"Registra\" di\n"
   + "         questa modale non è un `<button id=\"...\">` fisso (`apriModale` lo\n"
   + "         crea al volo, senza id), quindi non usa `occupato()` come gli altri\n"
   + "         cinque punti di scrittura corretti oggi — ma la trappola è la\n"
   + "         stessa: `chiudiModale()` arriva SOLO dopo che `db.aggiungi` è\n"
   + "         tornato, quindi il bottone resta cliccabile per tutta l'attesa e\n"
   + "         un doppio tocco crea due fotografie del piazzale identiche. Si\n"
   + "         disabilita il bottone \"primary\" della modale corrente — ce n'è\n"
   + "         sempre uno solo alla volta. */\n"
   + "      const btnRegistra = document.querySelector(\"#modal-foot .mbtn.primary\");\n"
   + "      if (btnRegistra) btnRegistra.disabled = true;\n"
   + "      await db.aggiungi(\"inventari\", { data, metodo, cumuli });\n"
   + "      chiudiModale();",
   "      if (!cumuli.length) return errore(\"Serve almeno un cumulo col suo materiale: un inventario senza cumuli non fotografa niente.\", document.querySelector(\"#inv-righe .inv-mat\"));\n"
   + "      await db.aggiungi(\"inventari\", { data, metodo, cumuli });\n"
   + "      chiudiModale();"],
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
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => document.body.textContent.length > 500); }
dice(pronto, "la pagina di Terra è pronta (in dimostrazione)");
await vaiA(pg, "terra", "nav-ril");

const nInvPrima = await pg.evaluate(() => document.querySelectorAll("#inv-list .item").length || null);
await pg.click("#btn-add-inv");
await pg.waitForTimeout(300);
await pg.fill(".inv-mat", "Prova doppio tocco");
await pg.fill(".inv-vol", "120");
/* due `.click()` nativi nella STESSA chiamata a `evaluate`: garantiscono che
   il secondo tocco arrivi mentre il primo handler è ancora fermo sul primo
   `await`, indipendentemente da quanto sia lenta la rete vera. */
const cliccato = await pg.evaluate(() => {
  const b = document.querySelector("#modal-foot .mbtn.primary");
  if (!b) return false;
  b.click(); b.click();
  return true;
});
dice(cliccato, "trovato il bottone «Registra» della modale e cliccato due volte", cliccato);
await pg.waitForTimeout(600);
const nInvDopo = await pg.evaluate(() => document.querySelectorAll("#inv-list .item").length || null);
dice(nInvPrima != null && nInvDopo != null, "l'elenco degli inventari si legge prima e dopo", { nInvPrima, nInvDopo });
dice(nInvDopo === nInvPrima + 1, `⛔ due tocchi quasi simultanei registrano UN inventario, non due (${nInvPrima} -> ${nInvDopo})`, { nInvPrima, nInvDopo });
const testoElenco = await pg.evaluate(() => document.getElementById("inv-list")?.textContent || "");
dice((testoElenco.match(/Prova doppio tocco/g) || []).length <= 1, "«Prova doppio tocco» non compare due volte nell'elenco", testoElenco.match(/Prova doppio tocco/g));

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

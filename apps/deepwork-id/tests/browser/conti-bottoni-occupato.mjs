/* CONTI: COSTI, PREVENTIVI E INCASSI PARZIALI SENZA GUARDIA CONTRO IL
   DOPPIO TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-bottoni-occupato.mjs                 (porta effimera)
     node conti-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Conti (18/09, terzo giro): btn-ft e
   btn-pes erano già corretti; questo banco copre tre casi nuovi,
   verificati dal vivo dall'agente:
   · btn-cos (registro costi): nessun controllo di doppione (a differenza
     di clienti/prodotti, che controllano il nome) — 26 → 28 righe misurate;
   · btn-or (preventivi): numeroProssimoPreventivo() legge ORD in memoria
     (come i clienti/prodotti), quindi i due doppioni non condividono
     nemmeno il numero, ma restano due documenti distinti dalla stessa
     intenzione — 8 → 10 righe misurate;
   · la modale "Registra incasso": `chiudiModale()` girava PRIMA della
     scrittura (non dopo, come le altre modali di questa sessione), ma il
     bottone non si disabilitava — un doppio tocco quasi simultaneo
     eseguiva `registraIncasso` due volte sullo stesso `massimo` catturato
     all'apertura. Il caso più grave per gravità economica: un acconto di
     3.000 € su una fattura da 12.000 registrava 6.000 € invece di 3.000. */
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
   "    const rec = { data, voce, importo: round2(ri.valore), nota, registratoIl: istanteLocale() };\n"
   + "    if (odl) rec.ordineFlotta = { id: odl.id, titolo: odl.titolo, mezzo: odl.mezzo };\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia e nessun controllo di\n"
   + "       doppione (a differenza di clienti/prodotti, che controllano il\n"
   + "       nome) — confermato dal vivo, un doppio tocco registra due costi\n"
   + "       identici. */\n"
   + "    occupato(\"btn-cos\", true);\n"
   + "    await db.aggiungi(\"costi\", rec);\n"
   + "    occupato(\"btn-cos\", false);\n"
   + "    esito(\"cos-esito\",",
   "    const rec = { data, voce, importo: round2(ri.valore), nota, registratoIl: istanteLocale() };\n"
   + "    if (odl) rec.ordineFlotta = { id: odl.id, titolo: odl.titolo, mezzo: odl.mezzo };\n"
   + "    await db.aggiungi(\"costi\", rec);\n"
   + "    esito(\"cos-esito\","],
  ["apps/conti/index.html",
   "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia — confermato dal vivo, un\n"
   + "       doppio tocco salva due preventivi distinti (numero diverso ciascuno,\n"
   + "       perché numeroProssimoPreventivo legge ORD in memoria e in demo è già\n"
   + "       aggiornato dal primo, ma resta comunque un documento duplicato dalla\n"
   + "       stessa intenzione). `occupato(false)` va PRIMA di `pulisciOrd()`, che\n"
   + "       riscrive l'etichetta del bottone leggendo `editOrd` appena azzerato. */\n"
   + "    occupato(\"btn-or\", true);\n"
   + "    if (editOrd) {\n"
   + "      await db.aggiorna(\"ordini\", editOrd, doc);\n"
   + "      const n = $(\"or-num\").value;\n"
   + "      occupato(\"btn-or\", false);\n"
   + "      pulisciOrd(); await refresh();\n"
   + "      esito(\"ord-esito\", \"Preventivo \" + n + \" aggiornato.\", \"success\");\n"
   + "    } else {\n"
   + "      const numero = numeroProssimoPreventivo();\n"
   + "      await db.aggiungi(\"ordini\", { numero, stato: \"bozza\", ...doc });\n"
   + "      occupato(\"btn-or\", false);\n"
   + "      pulisciOrd(); await refresh();",
   "    if (editOrd) {\n"
   + "      await db.aggiorna(\"ordini\", editOrd, doc);\n"
   + "      const n = $(\"or-num\").value;\n"
   + "      pulisciOrd(); await refresh();\n"
   + "      esito(\"ord-esito\", \"Preventivo \" + n + \" aggiornato.\", \"success\");\n"
   + "    } else {\n"
   + "      const numero = numeroProssimoPreventivo();\n"
   + "      await db.aggiungi(\"ordini\", { numero, stato: \"bozza\", ...doc });\n"
   + "      pulisciOrd(); await refresh();"],
  ["apps/conti/index.html",
   "    /* ⛔ 18/09, dal deep-pass QA: `chiudiModale()` nasconde la modale ma non\n"
   + "       disabilita il bottone — un doppio tocco quasi simultaneo esegue\n"
   + "       `registraIncasso` due volte sullo stesso `massimo` catturato\n"
   + "       all'apertura, confermato dal vivo: due movimenti da 3.000 € invece\n"
   + "       di uno. Si disabilita il bottone \"primary\" PRIMA di chiudere la\n"
   + "       modale, così un secondo tocco sullo stesso elemento non riparte. */\n"
   + "    const btnInc = document.querySelector(\"#modal-foot .mbtn.primary\");\n"
   + "    if (btnInc) btnInc.disabled = true;\n"
   + "    chiudiModale();\n"
   + "    await db.aggiungi(\"incassi\", { fatturaId: f.id, data, importo: imp, metodo });",
   "    chiudiModale();\n"
   + "    await db.aggiungi(\"incassi\", { fatturaId: f.id, data, importo: imp, metodo });"],
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
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => document.body.textContent.length > 500); }
dice(pronto, "la pagina di Conti è pronta (in dimostrazione)");

const dueVolte = async (btnId) => pg.evaluate((id) => {
  const btn = document.getElementById(id);
  if (!btn) return false;
  btn.click(); btn.click();
  return true;
}, btnId);

/* ── 1. Costi ── */
await vaiA(pg, "conti", "nav-cos");
await pg.waitForTimeout(300);
const voceCos = await pg.evaluate(() => { const s = document.getElementById("co-voce"); const o = [...s.options].find((x) => x.value); return o && o.value; });
dice(!!voceCos, "la dimostrazione propone almeno una voce di costo", voceCos);
if (voceCos) {
  await pg.selectOption("#co-voce", voceCos);
  await pg.fill("#co-data", "2026-09-10");
  await pg.fill("#co-imp", "148,50");
  const nCosPrima = await pg.evaluate(() => document.querySelectorAll("#cos-list .item").length || 0);
  dice(await dueVolte("btn-cos"), "trovato «Registra» costo e cliccato due volte");
  await pg.waitForTimeout(500);
  const nCosDopo = await pg.evaluate(() => document.querySelectorAll("#cos-list .item").length || 0);
  dice(nCosDopo === nCosPrima + 1, `⛔ Costi: due tocchi registrano UN costo, non due (${nCosPrima} -> ${nCosDopo})`, { nCosPrima, nCosDopo });
}

/* ── 2. Preventivi/ordini ── */
await vaiA(pg, "conti", "nav-ord");
await pg.waitForTimeout(300);
const cliOrd = await pg.evaluate(() => { const s = document.getElementById("or-cli"); const o = [...s.options].find((x) => x.value); return o && o.value; });
const prodOrd = await pg.evaluate(() => { const s = document.getElementById("or-prod"); const o = [...s.options].find((x) => x.value); return o && o.value; });
dice(!!cliOrd && !!prodOrd, "la dimostrazione propone almeno un cliente e un prodotto", { cliOrd, prodOrd });
if (cliOrd && prodOrd) {
  await pg.selectOption("#or-cli", cliOrd);
  await pg.fill("#or-data", "2026-09-10");
  await pg.fill("#or-val", "2026-10-10");
  await pg.selectOption("#or-prod", prodOrd);
  await pg.fill("#or-qta", "10");
  await pg.click("#btn-or-riga");
  await pg.waitForTimeout(300);
  const nOrdPrima = await pg.evaluate(() => document.querySelectorAll("#ord-list .item").length || 0);
  dice(await dueVolte("btn-or"), "trovato «Salva preventivo» e cliccato due volte");
  await pg.waitForTimeout(500);
  const nOrdDopo = await pg.evaluate(() => document.querySelectorAll("#ord-list .item").length || 0);
  dice(nOrdDopo === nOrdPrima + 1, `⛔ Preventivi: due tocchi registrano UN preventivo, non due (${nOrdPrima} -> ${nOrdDopo})`, { nOrdPrima, nOrdDopo });
}

/* ── 3. Modale "Registra incasso": doppio tocco quasi simultaneo ── */
await vaiA(pg, "conti", "nav-fat");
await pg.waitForTimeout(300);
const fatturaId = await pg.evaluate(() => document.querySelector("[data-fat]")?.getAttribute("data-fat"));
dice(!!fatturaId, "la dimostrazione ha almeno una fattura", fatturaId);
if (fatturaId) {
  await pg.evaluate((id) => document.querySelector(`[data-fat="${id}"]`)?.click(), fatturaId);
  await pg.waitForTimeout(400);
  const campoImp = await pg.evaluate(() => !!document.getElementById("inc-imp"));
  dice(campoImp, "la modale «Incassi» propone un campo per registrare un pagamento");
  if (campoImp) {
    /* un acconto: metà del massimo proposto, così la fattura NON risulta
       saldata dal primo incasso e il secondo (se il difetto c'è) è
       genuinamente un doppione, non una scrittura respinta */
    const massimo = await pg.evaluate(() => {
      const v = document.getElementById("inc-imp").value.replace(/\./g, "").replace(",", ".");
      return parseFloat(v) || 0;
    });
    const acconto = (massimo / 2).toFixed(2).replace(".", ",");
    await pg.fill("#inc-imp", acconto);
    /* "Incassi registrati (N)" è la sola riga che dichiara il conto vero
       dei movimenti — leggere righe .mrec confonderebbe "Già incassato" e
       "Residuo" (stessa classe "v accent") con i movimenti veri. */
    const leggiMovimenti = () => pg.evaluate(() => {
      const m = (document.getElementById("modal-body")?.textContent || "").match(/Incassi registrati \((\d+)\)/);
      return m ? Number(m[1]) : 0;
    });
    const nIncPrima = await leggiMovimenti();
    const cliccato = await pg.evaluate(() => {
      const btn = document.querySelector("#modal-foot .mbtn.primary");
      if (!btn) return false;
      btn.click(); btn.click();
      return true;
    });
    dice(cliccato, "trovato «Registra incasso» e cliccato due volte", cliccato);
    await pg.waitForTimeout(600);
    /* si riapre la stessa fattura e si conta quanti movimenti ha ora */
    await pg.evaluate((id) => document.querySelector(`[data-fat="${id}"]`)?.click(), fatturaId);
    await pg.waitForTimeout(400);
    const nIncDopo = await leggiMovimenti();
    dice(nIncDopo === nIncPrima + 1, `⛔ Incassi: due tocchi quasi simultanei registrano UN movimento, non due (${nIncPrima} -> ${nIncDopo})`, { nIncPrima, nIncDopo });
  }
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

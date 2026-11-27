/* SCUDO: LE MODALI "SEGNALA UN NEAR-MISS" E "SALVA L'ANALISI" CHIUDONO
   SOLO DOPO LA SCRITTURA — UN DOPPIO TOCCO DUPLICA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-modali-occupato.mjs                 (porta effimera)
     node scudo-modali-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Scudo (18/09), due modali con la
   stessa trappola già vista sul «Registra» inventario di Terra: il
   bottone `primary` di `#modal-foot` NON è un `<button id="...">` fisso
   (`apriModale` lo crea al volo), e `chiudiModale()` arriva SOLO dopo che
   la scrittura è tornata — resta cliccabile per tutta l'attesa.
   · `inviaSegnalazione` (near-miss/osservazione): l'agente l'ha verificato
     dal vivo, un doppio tocco crea due eventi identici nel registro.
   · `salvaAnalisi`: l'agente l'aveva SOLO letto, dichiarato «sospetto, non
     confermato» — verificato qui leggendo il codice (stessa forma esatta:
     `chiudiModale()` dopo `db.aggiungi`/`db.aggiorna`), non sulla sua
     parola. Qui si prova solo che il bottone si disabiliti SUBITO al
     tocco: l'analisi non ha un elenco visibile su cui contare i doppioni
     senza aprire un secondo evento, e la domanda sync-disabled basta a
     dimostrare la guardia. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/scudo/index.html",
   "    if (NM.foto) rec.foto = [NM.foto];\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: `chiudiModale()` arriva SOLO dopo che\n"
   + "       `db.aggiungi` è tornato (stessa trappola del \"Registra\" inventario di\n"
   + "       Terra) — il bottone \"Invia\" resta cliccabile per tutta l'attesa e un\n"
   + "       doppio tocco duplica la segnalazione nel registro degli eventi. */\n"
   + "    const btnInvia = document.querySelector(\"#modal-foot .mbtn.primary\");\n"
   + "    if (btnInvia) btnInvia.disabled = true;\n"
   + "    const ref = await db.aggiungi(\"infortuni\", rec);",
   "    if (NM.foto) rec.foto = [NM.foto];\n"
   + "    const ref = await db.aggiungi(\"infortuni\", rec);"],
  ["apps/scudo/index.html",
   "      azioniId: (pre && Array.isArray(pre.azioniId)) ? pre.azioniId : [],\n"
   + "    };\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: qui era solo \"sospetto\" (letto, non\n"
   + "       eseguito), verificato ora leggendo il codice — `chiudiModale()`\n"
   + "       arriva SOLO dopo la scrittura, stessa trappola della segnalazione\n"
   + "       rapida qui sopra: un doppio tocco su \"Salva l'analisi\" scrive due\n"
   + "       volte (o, in modifica, sovrascrive due volte con la stessa corsa). */\n"
   + "    const btnSalva = document.querySelector(\"#modal-foot .mbtn.primary\");\n"
   + "    if (btnSalva) btnSalva.disabled = true;\n"
   + "    if (pre) await db.aggiorna(\"analisi\", pre.id, rec);",
   "      azioniId: (pre && Array.isArray(pre.azioniId)) ? pre.azioniId : [],\n"
   + "    };\n"
   + "    if (pre) await db.aggiorna(\"analisi\", pre.id, rec);"],
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
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("inf-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Scudo è pronta (in dimostrazione)");

/* ── 1. near-miss: la scrittura è un aggiungi puro, senza dedup — prova per conteggio ── */
await pg.click("#btn-nm");
await pg.waitForTimeout(300);
const chipsPronte = await pg.evaluate(() => !!document.querySelector('#nm-cat .chg') && !!document.querySelector('#nm-luo .chg'));
dice(chipsPronte, "la modale del near-miss propone almeno una categoria e un luogo");
if (chipsPronte) {
  await pg.click("#nm-cat .chg");
  await pg.click("#nm-luo .chg");
  const nInfPrima = await pg.evaluate(() => document.querySelectorAll("#inf-list .item").length || 0);
  /* due `.click()` nativi nella STESSA chiamata a `evaluate`: garantiscono
     che il secondo tocco arrivi mentre il primo handler è ancora fermo sul
     primo `await`, indipendentemente da quanto sia lenta la rete vera. */
  const cliccato = await pg.evaluate(() => {
    const btn = document.querySelector("#modal-foot .mbtn.primary");
    if (!btn) return false;
    btn.click(); btn.click();
    return true;
  });
  dice(cliccato, "trovato «Invia» e cliccato due volte", cliccato);
  await pg.waitForTimeout(600);
  const nInfDopo = await pg.evaluate(() => document.querySelectorAll("#inf-list .item").length || 0);
  dice(nInfDopo === nInfPrima + 1, `⛔ due tocchi quasi simultanei registrano UNA segnalazione, non due (${nInfPrima} -> ${nInfDopo})`, { nInfPrima, nInfDopo });
}

/* ── 2. analisi: il bottone si disabilita SUBITO al tocco ── */
const anEvt = await pg.evaluate(() => document.querySelector("[data-analisi]")?.getAttribute("data-analisi"));
dice(!!anEvt, "la dimostrazione ha almeno un evento con l'analisi da aprire", anEvt);
if (anEvt) {
  await pg.evaluate((id) => document.querySelector(`[data-analisi="${id}"]`)?.click(), anEvt);
  await pg.waitForTimeout(300);
  /* validaAnalisi pretende almeno due «perché» non vuoti e una famiglia di
     causa scelta: senza, «Salva» si ferma sull'avviso PRIMA di arrivare al
     punto che questo banco vuole misurare, e il KO sarebbe della fixture,
     non del prodotto (vedi la regola sui CSV con le colonne indovinate). */
  await pg.fill("#an-p0", "Distorsione scendendo dalla cabina");
  await pg.fill("#an-p1", "Il predellino era scivoloso");
  await pg.click('#an-causa [data-an-causa]');
  const anSubito = await pg.evaluate(() => {
    const btn = document.querySelector("#modal-foot .mbtn.primary");
    if (!btn || btn.disabled) return { saltato: true };
    btn.click();
    return { disabled: btn.disabled };
  });
  dice(anSubito.saltato || anSubito.disabled === true, "⛔ Analisi · «Salva» si disabilita SUBITO al tocco", anSubito);
  /* dopo il salvataggio `salvaAnalisi` chiude questa modale e ne apre subito
     un'altra ("Analisi salvata"): non si può verificare "si richiude", ma si
     verifica che l'analisi sia stata scritta davvero — segno che la
     scrittura non è rimasta bloccata dalla guardia appena messa. */
  await pg.waitForTimeout(500);
  const salvata = await pg.evaluate(() => document.getElementById("modal-title")?.textContent === "Analisi salvata");
  dice(salvata, "e l'analisi viene scritta e la modale «Analisi salvata» si apre", salvata);
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

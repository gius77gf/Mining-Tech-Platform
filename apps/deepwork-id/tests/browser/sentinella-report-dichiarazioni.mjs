/* SENTINELLA · CHE COSA DICHIARA DI NON SAPERE IL DOCUMENTO CHE VA ALL'ENTE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-report-dichiarazioni.mjs [--porta=8603]
     node sentinella-report-dichiarazioni.mjs --controprova   (DEVE fallire)
     node sentinella-report-dichiarazioni.mjs --scatti=/dove/metterli

   PERCHÉ ESISTE. Il report di conformità è la cosa che il cliente stampa e
   consegna a un funzionario. Il 03/08, costruendo i casi limite e POI aprendo
   la pagina, sono uscite tre cose che nessuna suite `node` poteva vedere,
   perché il documento lo COMPONE la pagina:

   1. IL PERIODO. In testa c'è «Periodo: dal 01/01/2026 al 31/12/2026» e in
      fondo «Conforme». Con le misure ferme al 10 marzo — 296 giorni senza
      niente — il foglio non lo diceva da nessuna parte: chi legge dovrebbe
      scorrere ogni tabella e confrontare le date a mente.
   2. I PUNTI MAI MISURATI. Tre punti configurati, uno solo con letture, tutti
      e tre con la loro soglia: il documento scriveva «Conforme», la prima
      casella «Punti di misura: 3», e degli altri due non diceva niente accanto
      al verdetto — la riga che mette il denominatore si accendeva SOLO sui
      punti senza soglia (`nPuntiSenzaSoglia && …`).
   3. LA CATENA DELLA TARATURA. `taratureDelReport` calcola da sempre il conto
      PER PUNTO (`perPunto`) e la pagina leggeva solo il totale: il documento
      diceva «una o più letture sono state prese in un giorno non coperto da
      nessuna taratura» senza mai dire QUALE strumento. Una guardia calcolata e
      mai letta non protegge niente.

   Le funzioni nuove hanno la loro prova in `run-kpi.mjs`; che le tre frasi
   finiscano DAVVERO nel documento, e in un posto dove non le taglia niente,
   solo il browser lo può dire.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI SERVITI, mai sul disco: si aggiungono
   righe in coda alla risposta HTTP di `sentinella-data.js`, cioè si passa
   dalla via vera dell'app. Il file su disco non si tocca mai — e non si
   potrebbe, perché mentre questo banco gira ne girano altri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8603;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE NELLA PAGINA, uno per riga, con il pezzo che li
   porta. Si CONTANO: un `replace` che non trova niente esce in silenzio, e una
   controprova che non sostituisce niente non prova niente. */
const DIFETTI_PAGINA = [
  // 1 · la card del periodo non c'era proprio
  ["      ${dichiarazioneCopertura(R)}\n", ""],
  // 2 · il denominatore del verdetto guardava solo i punti senza soglia —
  //     né i punti mai misurati né i ricettori senza nemmeno un punto
  ['${(() => { const d = denominatoreEsito(R); return d ? " " + esc(d) : ""; })()}',
   '${R.nPuntiSenzaSoglia && R.esito !== "senza-soglia" ? " vecchia riga" : ""}'],
  // 3 · la taratura del singolo punto non arrivava nella sua scheda
  ["${ric}<br>${fonte}${conflitto}${tar}${evento}<br>", "${ric}<br>${fonte}${conflitto}${evento}<br>"],
];

/* I CASI, in coda al modulo dati. `DEMO` è un oggetto e la pagina ne fa una
   copia all'avvio, quindi aggiungere righe qui è come averle in archivio.
   Le date sono FISSE nell'anno in corso, perché il report si chiede per anno
   solare e il caso da mostrare è «dodici mesi dichiarati, tre misurati». */
const A = new Date().getFullYear();
const FIXTURE = `
DEMO.ricettori.push({ id: "rcz", nome: "Cascina Moretti", tipo: "abitazione", distanza: 260 });
DEMO.monitoraggi.push({ id: "zz1", nome: "Polveri PM10 — Cascina Moretti", tipo: "polveri",
  unita: "µg/m³", valore: 28, soglia: 50, ricettoreId: "rcz",
  tarature: [{ data: "${A - 3}-01-10", scadenza: "${A - 2}-01-10", ente: "ACCREDIA", certificato: "Z-77" }],
  letture: [{ data: "${A}-01-14", valore: 26 }, { data: "${A}-02-11", valore: 31 },
            { data: "${A}-03-10", valore: 28 }] });
DEMO.monitoraggi.push({ id: "zz2", nome: "Rumore diurno — Cascina Moretti", tipo: "rumore",
  unita: "dB(A)", valore: null, soglia: 60, ricettoreId: "rcz", letture: [] });
DEMO.monitoraggi.push({ id: "zz3", nome: "Vibrazioni — Cascina Moretti", tipo: "vibrazioni",
  unita: "mm/s", valore: null, soglia: 3, ricettoreId: "rcz", letture: [] });
/* un ricettore con NESSUN punto collegato: un piano più su dei punti mai
   misurati, e il caso che spariva del tutto dal documento intestato a «tutti
   i ricettori della cava» — senza punti non c'è niente da elencare. */
DEMO.ricettori.push({ id: "rcy", nome: "Cascina Belvedere", tipo: "abitazione", distanza: 410 });
`;

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/sentinella/sentinella-data.js"))
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_PAGINA) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. Si scrive un file
   nella radice servita e lo si rilegge DAL SERVER; se non torna, ci si ferma. */
const SEGNO = join(R, "__sentinella-report-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-report-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log(`\n════════ Sentinella · le dichiarazioni del report per l'ente${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
await pg.waitForTimeout(2300);
/* ⚠️ `vaiA` vuole l'id del BOTTONE, non il nome della sezione: un banco che
   non naviga risponde «tutto a posto» dopo aver guardato la schermata
   sbagliata. Qui la prova di aver navigato si pretende e si stampa. */
await pg.click("#nav-rep").catch(() => {});
await pg.waitForTimeout(500);
const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
dice(viste.length === 1 && viste[0] === "page-rep", `navigato davvero (${viste.join(",") || "nessuna pagina visibile"})`, viste);
dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

/* Il periodo: l'anno solare in corso, che è il caso vero del report annuale.
   ⚠️ E il report si stringe SUL RICETTORE del caso: la dimostrazione ha altri
   sei punti con letture sparse, e i numeri del documento sarebbero la somma di
   tutti — cioè un banco che asserisce cifre che dipendono da dati che non ha
   scritto lui. Con il ricettore scelto i tre punti sono solo i suoi. */
await pg.fill("#rep-dal", `${A}-01-01`);
await pg.fill("#rep-al", `${A}-12-31`);
await pg.waitForTimeout(600);
/* PRIMA di stringere: il documento di TUTTA la cava. È lì che il ricettore
   senza nemmeno un punto spariva — non ha schede, quindi non compariva da
   nessuna parte, e la testata prometteva «tutti i ricettori della cava». */
{
  const esito = testo(await pg.$eval(".rep-esito", (e) => e.innerHTML).catch(() => ""));
  dice(/non ha nessun punto di misura collegato|non hanno nessun punto di misura collegato/.test(esito),
    "⛔ il report di tutta la cava dice quali ricettori non hanno nemmeno un punto", esito);
  dice(/Cascina Belvedere/.test(esito), "⛔ e lo chiama per nome", esito);
}
if (SCATTI) { mkdirSync(SCATTI, { recursive: true }); await pg.evaluate(() => { const e = document.querySelector(".rep-esito"); if (e) e.scrollIntoView({ block: "center" }); }); await pg.waitForTimeout(200); await pg.screenshot({ path: join(SCATTI, "report-tutta-cava.png") }); }
await pg.selectOption("#rep-ricettore", { label: "Cascina Moretti" }).catch(() => {});
await pg.waitForTimeout(700);
{
  const scelti = await pg.$$eval(".rep-punto-tit", (e) => e.map((x) => x.textContent.trim()));
  dice(scelti.length === 3 && scelti.every((n) => /Cascina Moretti/.test(n)),
    `il documento è stretto sui tre punti del caso (${scelti.length})`, scelti);
}

const doc = testo(await pg.$eval("#rep-doc", (e) => e.innerHTML).catch(() => ""));
dice(doc.length > 400, "il documento è stato composto", doc.length + " caratteri");
/* la comunicazione della volata (05/09): nella tabella «Volate del periodo» la
   colonna c'è e ogni riga dice se la volata è stata comunicata — anche no */
if (/Volate del periodo/.test(doc)) {
  dice(/Comunicazione/.test(doc), "⛔ la tabella delle volate del periodo ha la colonna «Comunicazione»", doc.slice(doc.indexOf("Volate del periodo"), doc.indexOf("Volate del periodo") + 300));
  dice(/comunicata all'ente|nessuna comunicazione registrata|comunicazione registrata a metà/.test(doc), "e ogni volata dice se è stata comunicata, con le parole anche quando no", doc.slice(doc.indexOf("Volate del periodo"), doc.indexOf("Volate del periodo") + 400));
} else console.log("  (nessuna volata nel periodo scelto: la colonna «Comunicazione» non si misura qui — dichiarato)");

// ── 1 · IL PERIODO DICHIARATO CONTRO QUELLO MISURATO ──────────────────────
console.log("\n· il periodo dichiarato e quello davvero misurato");
{
  const card = testo(await pg.$$eval(".rep-tar", (e) => {
    const t = e.find((x) => /Periodo dichiarato e periodo misurato/.test(x.textContent));
    return t ? t.innerHTML : "";
  }).catch(() => ""));
  dice(/Periodo dichiarato e periodo misurato/.test(card), "la card del periodo c'è", card.slice(0, 120));
  dice(/misure registrate in 3 giorni diversi/.test(card),
    "⛔ dice in quanti giorni si è misurato davvero", card);
  dice(/giorni alla fine del periodo senza nessuna misura/.test(card),
    "⛔ e dice quanto del periodo dichiarato resta scoperto in coda", card);
  /* IL NUMERO, contato QUI con l'aritmetica più stupida che ci sia — non
     chiedendolo al modulo. Se lo ricalcolasse con la stessa funzione che sta
     provando, il banco direbbe soltanto che il codice è d'accordo con sé
     stesso. L'ultima misura è il 10 marzo; il fondo utile è oggi, se l'anno
     non è ancora finito. */
  const giorno = 86400000;
  const ultima = Date.UTC(A, 2, 10);
  const fineAnno = Date.UTC(A, 11, 31);
  const oggiUTC = (() => { const d = new Date(); return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); })();
  const atteso = Math.round((Math.min(fineAnno, oggiUTC) - ultima) / giorno);
  dice(new RegExp(`\\b${atteso}\\b`).test(card),
    `⛔ e il numero è quello contato a mano: ${atteso} giorni dal 10/03 al fondo utile`, card);
  /* ⚠️ E LO DICE UNA VOLTA SOLA. Nello scatto la card scriveva «146 giorni
     alla fine» e subito dopo «il tratto più lungo è di 146 giorni»: la coda È
     il tratto più lungo, nel caso più comune. Una riga che ripete quella
     prima insegna a saltarle tutt'e due. Il tratto in mezzo resta scritto
     quando è davvero in mezzo — quel caso lo prova `run-kpi`, con due misure
     a gennaio e a dicembre e 348 giorni vuoti fra loro. */
  dice((card.match(new RegExp(`\\b${atteso}\\b`, "g")) || []).length === 1,
    "⛔ e non lo ripete due volte con parole diverse", card);
}

// ── 2 · I PUNTI MAI MISURATI, ACCANTO AL VERDETTO ─────────────────────────
console.log("\n· il verdetto e il suo denominatore");
{
  const esito = testo(await pg.$eval(".rep-esito", (e) => e.innerHTML).catch(() => ""));
  dice(/Conforme|Senza dati|Non conforme|Senza soglia/.test(esito), "il verdetto c'è", esito.slice(0, 100));
  dice(/non ha nessuna lettura|non hanno nessuna lettura/.test(esito),
    "⛔ accanto al verdetto è scritto quanti punti non hanno letture", esito);
  dice(/Rumore diurno — Cascina Moretti/.test(esito) && /Vibrazioni — Cascina Moretti/.test(esito),
    "⛔ e sono chiamati per NOME: «due punti» senza dire quali non manda nessuno a misurare", esito);
}

// ── 3 · LA TARATURA, NELLA SCHEDA DEL SUO PUNTO ───────────────────────────
console.log("\n· la catena della taratura, punto per punto");
{
  const schede = await pg.$$eval(".rep-punto", (e) => e.map((x) => x.textContent.replace(/\s+/g, " ").trim()));
  dice(schede.length === 3, `le schede dei punti ci sono (${schede.length})`, schede.length);
  const polveri = schede.find((s) => /Polveri PM10 — Cascina Moretti/.test(s)) || "";
  dice(/Taratura dello strumento/.test(polveri),
    "⛔ la scheda del punto dice com'è messa la taratura DI QUESTO strumento", polveri.slice(0, 300));
  dice(/nessuna taratura registrata copre/.test(polveri),
    "⛔ e dice che le sue letture cadono fuori da ogni certificato", polveri.slice(0, 400));
  // e il posto dove finisce non dev'essere una riga tagliata a due
  const tagliata = await pg.evaluate(() => {
    const m = [...document.querySelectorAll(".rep-punto-meta")]
      .find((x) => /Taratura dello strumento/.test(x.textContent));
    if (!m) return "assente";
    const cs = getComputedStyle(m);
    return cs.webkitLineClamp && cs.webkitLineClamp !== "none" ? "clamp:" + cs.webkitLineClamp
      : (m.scrollHeight > m.clientHeight + 1 ? "tagliata in altezza" : "");
  });
  dice(tagliata === "", "⛔ e NON finisce in un blocco che taglia il testo", tagliata);
}

/* ── 4 · E SU CARTA? È il foglio che il cliente consegna davvero ───────────
   `@media print` nasconde tutto ciò che è comando e tiene solo il documento.
   Le tre dichiarazioni sono la parte che dice ciò che il documento NON sa: se
   una di loro sparisse in stampa, resterebbe in mano al funzionario solo la
   parola «Conforme». */
console.log("\n· il foglio stampato");
{
  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(200);
  const stampa = await pg.evaluate(() => {
    const vis = (e) => { const c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden"; };
    const card = [...document.querySelectorAll(".rep-tar")];
    return {
      comandi: document.getElementById("rep-comandi") ? vis(document.getElementById("rep-comandi")) : null,
      tar: card.length,
      tarViste: card.filter(vis).length,
      spezzabili: card.filter((e) => getComputedStyle(e).breakInside !== "avoid").map((e) => e.textContent.slice(0, 40)),
      esito: document.querySelector(".rep-esito") ? vis(document.querySelector(".rep-esito")) : null,
    };
  });
  dice(stampa.comandi === false, "i comandi non finiscono sul foglio", stampa.comandi);
  dice(stampa.tar === 3 && stampa.tarViste === 3,
    `⛔ tutte e tre le dichiarazioni restano sul foglio (${stampa.tarViste}/${stampa.tar})`, stampa);
  dice(stampa.spezzabili.length === 0,
    "⛔ e nessuna può essere spezzata a metà fra due pagine", stampa.spezzabili);
  if (SCATTI) {
    mkdirSync(SCATTI, { recursive: true });
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.screenshot({ path: join(SCATTI, "report-stampa.png"), fullPage: false });
  }
  await pg.emulateMedia({ media: "screen" });
  await pg.waitForTimeout(200);
}

if (SCATTI) {
  mkdirSync(SCATTI, { recursive: true });
  await pg.screenshot({ path: join(SCATTI, "report-testa.png") });
  await pg.evaluate(() => {
    const e = [...document.querySelectorAll(".rep-tar")].find((x) => /Periodo dichiarato/.test(x.textContent));
    if (e) e.scrollIntoView({ block: "center" });
  });
  await pg.waitForTimeout(250);
  await pg.screenshot({ path: join(SCATTI, "report-periodo.png") });
  await pg.evaluate(() => { const e = [...document.querySelectorAll(".rep-punto")][0]; if (e) e.scrollIntoView(); });
  await pg.waitForTimeout(250);
  await pg.screenshot({ path: join(SCATTI, "report-punto.png") });
  console.log(`\n  scatti in ${SCATTI}`);
}

await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`\n  difetti rimessi nella pagina: ${colpiti.size} su ${DIFETTI_PAGINA.length}`);
  if (colpiti.size !== DIFETTI_PAGINA.length) {
    console.log("  ✗ un difetto non è stato iniettato: la controprova non prova niente.");
    process.exit(1);
  }
  console.log(ko > 0
    ? `\n✓ controprova: ${ko} controlli sono caduti — il banco sa fallire.`
    : `\n✗ controprova: NESSUN controllo è caduto. Il banco non prova niente.`);
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

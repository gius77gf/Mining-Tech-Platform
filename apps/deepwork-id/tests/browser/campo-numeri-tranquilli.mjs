/* I DOCUMENTI DI CAMPO NON DICHIARANO ZERI CHE NESSUNO HA MISURATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-numeri-tranquilli.mjs [--porta=8563]
     node campo-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il censimento statico su Campo era a zero, e la prima passata
   aveva già sistemato il testo che usciva dal riquadro. Questi tre difetti sono
   usciti come su Terra: chiamando le funzioni coi casi limite veri e poi
   APRENDO la pagina a premere i bottoni. Tutti e tre stanno in cose che ESCONO
   dall'app — un file CSV, una frase di confronto, un rapporto stampato:

   1. il CSV DELLO STORICO scriveva `2026-07-14;0;0;3` su una giornata con tre
      guasti e nessun minuto misurato: identica, colonna per colonna, a una
      giornata senza un fermo. Lo schermo, sulla stessa riga, scrive già
      «senza minuti» (`minutiFermoTesto`), quindi le due uscite dello stesso
      dato dicevano cose diverse. E la colonna della produzione scriveva `0`
      dove lo schermo scrive «nessuna registrazione»;
   2. lo STORICO DELLA SETTIMANA lasciava sparire, dentro un `continue`, ogni
      registrazione senza giorno di lavoro o con un giorno che non esiste
      («2026-02-30»). Con la sola dimostrazione sono 2.300 t dichiarate che il
      cartellone non nomina; costruendo il caso peggiore (tutto senza data) il
      cartellone scrive «0 giornate registrate su 7 · Prodotto: niente
      registrato». `fermiSenzaGiorno` faceva già questo conto accanto al
      grafico dei fermi: mancava per il resto dello storico;
   3. la frase del PONTE CON TERRA contava i rapportini entrati nei metri cubi
      come `turni − (viaggi > 0 ? 1 : 0)`, cioè toglieva UN rapportino quando
      `viaggi` è la SOMMA dei viaggi, non il loro numero. Con 3 rapportini in
      viaggi diceva «4 rapportini» dove ne avevano contribuito 2 — un numero
      sbagliato in modo credibile, perché sta fra il vero e il totale.

   ⚠️ NESSUNO DEI TRE LO PRENDE UNA SUITE `node` DA SOLA: le funzioni nuove
   sono provate in `run-kpi.mjs`, ma che la PAGINA le chiami, e che il file
   scaricato e la frase sullo schermo siano quelli, lo dice solo il browser.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, mai nel documento: si aggiunge una riga
   alla risposta HTTP di `campo-data.js`, cioè si passa dalla via vera. Il file
   su disco non si tocca. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8563;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE. Si contano quelli che hanno trovato il loro pezzo di
   pagina: un `replace` che non sostituisce niente esce in silenzio, e una
   controprova che non inietta niente dichiara «non so fallire» per il motivo
   sbagliato. */
const DIFETTI = [
  // 1 · il CSV dello storico costruito a mano, con gli zeri di comodo
  ["a.href = \"data:text/csv;charset=utf-8,\" + encodeURIComponent(csvStorico(SET_RIGHE, fuori));",
   "a.href = \"data:text/csv;charset=utf-8,\" + encodeURIComponent((() => {"
   + " const u = [...new Set(SET_RIGHE.flatMap(g => Object.keys(g.prod)))].sort();"
   + " let c = \"data;\" + u.map(x => \"prodotto_\" + x).join(\";\") + (u.length ? \";\" : \"\")"
   + " + \"minuti_fermo;fermi;attivita_totali;attivita_concluse;rapportini_inviati\\n\";"
   + " for (const g of SET_RIGHE) c += `${g.data};${u.map(x => g.prod[x] || 0).join(\";\")}${u.length ? \";\" : \"\"}`"
   + " + `${g.minutiFermo};${g.fermi};${g.attTot};${g.attConcluse};${g.rapInviati}\\n`; return c; })());"],
  // 2 · l'avviso delle registrazioni che non stanno in nessuna giornata
  ["$(\"set-fuori\").innerHTML = !fuori.totale ? \"\" :",
   "$(\"set-fuori\").innerHTML = true ? \"\" :"],
  // 2b · e il cartellone che tornava a dire «niente registrato»
  ["(fuori.totale ? \"niente che stia in una giornata\" : \"niente registrato\")",
   "\"niente registrato\""],
  // 3 · la sottrazione a mano del ponte con Terra
  ["const inConto = rapportiniInConto(r.dich);",
   "const inConto = { conto: r.dich.turni - (r.dich.viaggi > 0 ? 1 : 0), delPeriodo: r.dich.turni, noto: true };"],
  // 4 · la riga dei rapportini nel rapporto stampato, con l'unità GREZZA
  ["}${(() => { const p = produzioneDi(r); return p ? esc(formattaProduzione(p.qta, p.unita)) : esc(r.produzione || \"—\"); })()}</td>",
   "}${esc(+r.prodQta>0?formattaProduzione(r.prodQta,r.prodUnita):(r.produzione||\"—\"))}</td>"],
];

/* IL CASO DA COSTRUIRE, scelto prima di ogni `goto`. Si aggiunge in coda al
   modulo dati: `DEMO` è un oggetto, e la pagina ne fa una copia all'avvio. */
let FIXTURE = "";
// tutte le registrazioni perdono il giorno: è il caso peggiore dello storico
const FIXTURE_SENZA_GIORNO = `
DEMO.rapportini.forEach(r => { r.data = ""; });
DEMO.attivita.forEach(a => { a.data = ""; });
DEMO.attivita[0].data = "2026-02-30";
`;
// una giornata con tre fermi e nessun minuto scritto (ieri, dentro i 7 giorni)
const FIXTURE_FERMI_MUTI = `
{
  const ieri = (() => { const d = new Date(); d.setDate(d.getDate() - 1);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); })();
  DEMO.attivita.push(
    { id: "zz1", data: ieri, turno: "Mattina", titolo: "Nastro fermo", squadra: "Squadra A", stato: "anomalia", causale: "Guasto meccanico" },
    { id: "zz2", data: ieri, turno: "Mattina", titolo: "Frantoio fermo", squadra: "Squadra C", stato: "anomalia", causale: "Intasamento impianto" },
    { id: "zz3", data: ieri, turno: "Notte", titolo: "Pala ferma", squadra: "Squadra B", stato: "anomalia", causale: "Attesa mezzo" });
}
`;
// tre rapportini in VIAGGI dentro l'intervallo fra gli ultimi due rilievi:
// niente di quei viaggi entra nei metri cubi, quindi il conto è incompleto
const FIXTURE_VIAGGI = `
{
  const gf = (n) => { const d = new Date(); d.setDate(d.getDate() - n);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
  DEMO.rapportini.push(
    { id: "zv1", data: gf(11), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 12, prodUnita: "viaggi", ora: "05:00", stato: "inviato" },
    { id: "zv2", data: gf(10), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 9, prodUnita: "viaggi", ora: "05:00", stato: "inviato" },
    { id: "zv3", data: gf(9), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 7, prodUnita: "viaggi", ora: "05:00", stato: "inviato" });
}
`;

let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/campo/campo-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/campo/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    iniezioni = colpiti.size;
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e non fallisce mai. */
const SEGNO = join(R, "__campo-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__campo-numeri-${process.pid}`)).text();
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
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* Apre Campo e va in una sezione PRETENDENDO la prova di aver navigato: il
   selettore è l'id del BOTTONE, e un banco che non naviga risponde «tutto a
   posto» dopo aver guardato una schermata su cinque. */
async function apri(bottone) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
/* Intercetta la finestra della stampa e il salvataggio del CSV: sono i due modi
   con cui un documento esce dall'azienda. */
async function intercetta(pg) {
  await pg.evaluate(() => {
    window.__doc = null; window.__csv = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close: () => {} },
      focus: () => {}, print: () => {} });
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
}
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

console.log(`\n════════ i documenti di Campo e gli zeri mai misurati${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · IL CSV DELLO STORICO ──────────────────────────────────────────────
console.log("\n· tre guasti e nessun minuto scritto: il file che si apre col foglio di calcolo");
FIXTURE = FIXTURE_FERMI_MUTI;
{
  const pg = await apri("nav-set");
  await intercetta(pg);
  await pg.click("#btn-set-export");
  await pg.waitForTimeout(400);
  const righe = String(await pg.evaluate(() => window.__csv) || "").split("\n");
  const testa = righe[0] || "";
  dice(righe.length > 5, "il file viene prodotto davvero", righe.length + " righe");
  dice(/;fermi;fermi_senza_minuti;/.test(testa),
    "⛔ l'intestazione porta la colonna «fermi_senza_minuti»", testa);
  // la giornata di ieri: tre fermi, nessun minuto → cella dei minuti VUOTA
  const ieri = (() => { const d = new Date(); d.setDate(d.getDate() - 1);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); })();
  const rIeri = righe.find((r) => r.startsWith(ieri)) || "";
  const col = testa.split(";"), cel = rIeri.split(";");
  const iMin = col.indexOf("minuti_fermo"), iSen = col.indexOf("fermi_senza_minuti");
  dice(iMin > 0 && cel[iMin] === "",
    "⛔ tre fermi mai misurati: la cella dei minuti resta VUOTA, non «0»", rIeri);
  dice(iSen > 0 && cel[iSen] === "3",
    "e la colonna dice che i tre fermi sono senza minuti", rIeri);
  // una giornata senza nessuna registrazione: produzione vuota, non zero
  const iProd = col.findIndex((c) => c.startsWith("prodotto_"));
  const vuote = righe.slice(1).filter((r) => r && r.split(";")[col.indexOf("attivita_totali")] === "0"
    && r.split(";")[col.indexOf("rapportini_inviati")] === "0");
  dice(iProd > 0 && vuote.length > 0 && vuote.every((r) => r.split(";")[iProd] === ""),
    `⛔ nelle ${vuote.length} giornate senza registrazioni la produzione è VUOTA, non «0»`,
    vuote[0]);
  await pg.close();
}

// ── 2 · QUELLO CHE LO STORICO NON SA COLLOCARE ────────────────────────────
console.log("\n· tutte le registrazioni senza giorno: il cartellone che diceva «niente registrato»");
FIXTURE = FIXTURE_SENZA_GIORNO;
{
  const pg = await apri("nav-set");
  const board = testo(await pg.evaluate(() => document.getElementById("set-board").innerHTML));
  const avviso = testo(await pg.evaluate(() => document.getElementById("set-fuori").innerHTML));
  dice(/0\s*Giornate registrate su 7/i.test(board),
    "lo storico per giornate resta a zero: è il buco da dichiarare, non da tappare", board.slice(0, 120));
  dice(!/Prodotto:\s*niente registrato/.test(board),
    "⛔ il cartellone NON dice più «Prodotto: niente registrato»",
    (board.match(/Prodotto:[^·]*/) || [])[0]);
  dice(/niente che stia in una giornata/.test(board),
    "e al suo posto dice che niente sta in una giornata",
    (board.match(/Prodotto:[^·]*/) || [])[0]);
  dice(/non entrano in nessuna giornata/.test(avviso),
    "⛔ e l'avviso esiste e dice quante registrazioni sono", avviso.slice(0, 200));
  dice(/\bt\b/.test(avviso) && /rapportin/.test(avviso),
    "con quante tonnellate portano con sé", avviso.slice(0, 240));
  // e il file che esce porta la riga con la data vuota
  await intercetta(pg);
  await pg.click("#btn-set-export");
  await pg.waitForTimeout(400);
  const righe = String(await pg.evaluate(() => window.__csv) || "").split("\n").filter(Boolean);
  const ultima = righe[righe.length - 1] || "";
  dice(/^;/.test(ultima) && /\d/.test(ultima),
    "⛔ nel file la riga senza giorno esce con la data vuota e i suoi numeri", ultima);
  await pg.close();
}

// ── 3 · LA FRASE DEL PONTE CON TERRA ──────────────────────────────────────
console.log("\n· tre rapportini in viaggi: quanti sono entrati davvero nei metri cubi");
FIXTURE = FIXTURE_VIAGGI;
{
  const pg = await apri("nav-rap");
  await pg.waitForTimeout(1200);
  const terra = testo(await pg.evaluate(() => document.getElementById("rap-terra").innerHTML));
  dice(terra.length > 60, "il confronto con Terra viene disegnato", terra.slice(0, 160));
  dice(/su \d+ rapportini del periodo/.test(terra),
    "⛔ col conto incompleto si dice «su N rapportini del periodo», non un numero preciso",
    (terra.match(/dichiarati[^:]*:/) || [])[0] || terra.slice(0, 200));
  dice(!/m³ \(\d+ rapportin/.test(terra),
    "⛔ e non compare più il numero preciso che la sottrazione a mano sbagliava",
    (terra.match(/\(\d+ rapportin[^)]*\)/) || [])[0]);
  dice(/Conto incompleto/.test(terra),
    "la seconda nota dice che il conto è incompleto e perché", terra.slice(-220));
  await pg.close();
}

// ── 4 · IL RAPPORTO STAMPATO ──────────────────────────────────────────────
/* ⚠️ IL CASO VA COSTRUITO, se no l'asserzione passa perché non c'è niente da
   prendere: nella dimostrazione nessun rapportino ha un'unità fuori
   vocabolario, e un «nessuna unità sbagliata» su zero soggetti è il controllo
   che non guarda dove crede. Qui si aggiunge un rapportino d'archivio scritto
   «m3» (senza il ³) — la forma che un import o una collezione vecchia produce:
   `produzioneDi` la normalizza a tonnellate per la SOMMA, e la riga stampata
   deve dire la stessa cosa invece di stampare «m3» com'era scritto. */
console.log("\n· il rapporto di fine turno: la produzione si legge in un modo solo");
FIXTURE = `
{
  const p = (x) => String(x).padStart(2, "0"); const d = new Date();
  const oggi = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  DEMO.rapportini.push({ id: "zu1", data: oggi, turno: "Mattina", titolo: "Rapportino di archivio",
    squadra: "Squadra A", prodQta: 500, prodUnita: "m3", ora: "12:00", stato: "inviato" });
}
`;
{
  const pg = await apri("nav-rap");
  await intercetta(pg);
  await pg.click("#btn-rapporto-turno");
  await pg.waitForTimeout(500);
  const doc = testo(await pg.evaluate(() => window.__doc));
  dice(doc.length > 1200, "il rapporto viene prodotto davvero", doc.length);
  dice(/Rapporto di fine turno/.test(doc), "ed è il rapporto giusto", doc.slice(0, 80));
  // l'unità stampata è una di quelle ammesse: mai una scritta a caso presa
  // dall'archivio e stampata com'è mentre il totale la somma come tonnellate
  dice(/Rapportino di archivio/.test(doc), "il rapportino d'archivio è nel documento (il caso c'è)",
    (doc.match(/Rapportino di archivio[^|]{0,60}/) || [])[0]);
  const unita = [...doc.matchAll(/\d[\d.,]*\s+(m3|mc|MC|M³)\b/g)].map((m) => m[1]);
  dice(unita.length === 0,
    `⛔ nessuna unità fuori dal vocabolario nel documento (${unita.length} trovate)`, unita.join(","));
  dice(/500 t/.test(doc),
    "e i 500 sono scritti nell'unità con cui il totale li somma", (doc.match(/500 \S+/) || [])[0]);
  await pg.close();
}

await b.close();
srv.close();
if (CONTROPROVA) {
  console.log(`\n  difetti rimessi nella pagina: ${iniezioni} su ${DIFETTI.length}`);
  if (iniezioni < DIFETTI.length) {
    console.error("✗ qualche difetto non ha trovato il suo pezzo di pagina: la controprova non prova niente.");
    process.exit(2);
  }
}
console.log(`\n${ko ? "✗" : "✓"} ${ok} verifiche passate, ${ko} fallite`
  + (CONTROPROVA ? "  (controprova: DEVONO fallire)" : ""));
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

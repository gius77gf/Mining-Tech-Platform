/* LE FRASI DI FLOTTA E SENTINELLA QUANDO IL NUMERO È UNO — 0, 1 e PIÙ DI 1.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node frasi-uno-fl-sent.mjs [--porta=8791]
     node frasi-uno-fl-sent.mjs --controprova   (rimette i difetti: DEVE fallire)

   Metodo di casa: server proprio col CONTRASSEGNO DEL PID RILETTO DAL SERVER
   (un banco che trova la porta occupata e la riusa misura la copia di
   qualcun altro), casi costruiti nella RISPOSTA HTTP (mai sul file: mentre
   girano cantieri paralleli è l'unico modo sicuro), righe lette PER
   SELETTORE — mai cercando una sottostringa in `innerText`.

   ⚠️ Il numero delle prove è STABILE: un banco che crolla a metà stampa meno
   prove, e un totale più basso si legge come «ha guardato meno roba», non
   come «si è rotto». Se una scena non si raggiunge, lo DICHIARA e tira
   avanti. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8791;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, nella forma in cui stavano prima. Si CONTANO: una
   controprova che non sostituisce niente non prova niente. */
const DIFETTI_FLOTTA = [
  ['`${contaSca.totale === 1 ? "L\'<b>unica</b> registrata è a posto" : `Le <b>${contaSca.totale}</b> registrate sono a posto`}, ma ${scoperti}',
   '`Le <b>${contaSca.totale}</b> registrate sono a posto, ma ${scoperti}'],
  ['`Import ricambi: ${conta(agg, "ricambio aggiunto", "ricambi aggiunti")}${dup ? `, ${conta(dup, "già presente (saltato)", "già presenti (saltati)")}` : ""}${ripetute ? `, ${conta(ripetute, "ripetuto nel file", "ripetuti nel file")}` : ""}.`',
   '`Import ricambi: ${agg} aggiunti${dup ? `, ${dup} già presenti (saltati)` : ""}${ripetute ? `, ${ripetute} ripetuti nel file` : ""}.`'],
  ['`Import parco: ${conta(agg, "mezzo aggiunto", "mezzi aggiunti")}${dup ? `, ${conta(dup, "già presente (saltato)", "già presenti (saltati)")}` : ""}${ripetute ? `, ${conta(ripetute, "ripetuto nel file", "ripetuti nel file")}` : ""}.`',
   '`Import parco: ${agg} ${agg === 1 ? "mezzo aggiunto" : "mezzi aggiunti"}${dup ? `, ${dup} già presenti (saltati)` : ""}${ripetute ? `, ${ripetute} ripetuti nel file` : ""}.`'],
  ['${n.orePreviste ? "a " + oreMotoreTx(n.orePreviste) : "previsto " + esc(dataIt(n.dataPrevista))}',
   '${n.orePreviste ? "a " + numTx(n.orePreviste) + " ore motore" : "previsto " + esc(dataIt(n.dataPrevista))}'],
  ['${n.orePreviste ? "Tagliando a " + oreMotoreTx(n.orePreviste, grassetto) : "Previsto per il <b>"',
   '${n.orePreviste ? "Tagliando a <b>" + numTx(n.orePreviste) + "</b> ore motore" : "Previsto per il <b>"'],
  ['${n.orePreviste ? "A " + oreMotoreTx(n.orePreviste) : "Previsto " + dataIt(n.dataPrevista)}',
   '${n.orePreviste ? "A " + (+n.orePreviste).toLocaleString("it-IT") + " ore motore" : "Previsto " + dataIt(n.dataPrevista)}'],
  ['${plurale(aff.disponibili, "giorno-macchina lavorabile", "giorni-macchina lavorabili")}',
   'giorni-macchina lavorabili'],
];
const DIFETTI_SENT = [
  ['`Import scadenze: ${conta(agg, "scadenza aggiunta", "scadenze aggiunte")}${dup ? `, ${conta(dup, "già presente (saltata)", "già presenti (saltate)")}` : ""}${ripetute ? `, ${conta(ripetute, "ripetuta nel file", "ripetute nel file")}` : ""}.`',
   '`Import scadenze: ${agg} aggiunte${dup ? `, ${dup} già presenti (saltate)` : ""}${ripetute ? `, ${ripetute} ripetute nel file` : ""}.`'],
  ['"Import sensori: " + conta(agg, "sensore aggiunto", "sensori aggiunti")\n      + (saltati ? ", " + conta(saltati, "già presente (saltato)", "già presenti (saltati)") : "")\n      + (ripetute ? ", " + conta(ripetute, "ripetuto nel file", "ripetuti nel file") : "") + "."',
   '"Import sensori: " + agg + " aggiunti" + (saltati ? ", " + saltati + " già presenti (saltati)" : "") + (ripetute ? ", " + ripetute + " ripetuti nel file" : "") + "."'],
  ['"Import ricettori: " + conta(agg, "ricettore aggiunto", "ricettori aggiunti")\n      + (saltati ? ", " + conta(saltati, "già presente (saltato)", "già presenti (saltati)") : "")\n      + (ripetute ? ", " + conta(ripetute, "ripetuto nel file", "ripetuti nel file") : "") + "."',
   '"Import ricettori: " + agg + " aggiunti" + (saltati ? ", " + saltati + " già presenti (saltati)" : "") + (ripetute ? ", " + ripetute + " ripetuti nel file" : "") + "."'],
];
/* il modulo: la frase composta una volta sola torna a essere tre copie deboli */
const DIFETTI_SENT_DATA = [
  ['return String(apertura) + ": " + conta(d.n, "lettura", "letture")',
   'return String(apertura) + ": " + d.n + " letture"'],
  ['", " + conta(d.superamenti, "superamento", "superamenti")',
   '", " + d.superamenti + " superamenti"'],
  ['pezzi.push(conta(mano, "inserita a mano", "inserite a mano"))',
   'pezzi.push(mano + " inserite a mano")'],
];

/* I CASI, costruiti nei DATI serviti. */
const CASO_FLOTTA = `
DEMO.mezzi.length = 2;
DEMO.mezzi[0] = { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 1, area: "fronte Est", stato: "operativo", tipo: "escavatore" };
DEMO.mezzi[1] = { id: "m2", nome: "Pala P2 — Volvo L120", ore: 40, area: "piazzale", stato: "operativo", tipo: "pala" };
DEMO.scadenze.length = 1;
DEMO.scadenze[0] = { id: "s1", mezzo: "Escavatore E1 — CAT 352", tipo: "revisione", dataScadenza: "2099-01-01", mesi: 1, documento: "" };
DEMO.manutenzioni.length = 1;
DEMO.manutenzioni[0] = { id: "n1", titolo: "Tagliando", mezzo: "Escavatore E1 — CAT 352", dataPrevista: null, orePreviste: 1, ogniOre: 1, stato: "da-fare", origine: "mano" };
DEMO.fermi.length = 0;
DEMO.ricambi.length = 0;
DEMO.interventi.length = 0;
DEMO.rifornimenti.length = 0;
DEMO.costi.length = 0;
DEMO.controlli.length = 0;
DEMO.disponibilita.length = 0;
`;
/* ⚠️ LA PRIMA STESURA DI QUESTO CASO NON HA INIETTATO QUELLO CHE CREDEVA:
   toglieva `DEMO.scadenze.length = 1` e lasciava l'assegnazione a `[0]`, che
   la lunghezza la rimette da sola. Uscivano TRE scadenze e la prova accusava
   il prodotto per un caso che il banco aveva costruito male. Un'iniezione si
   verifica dove il programma la legge. */
const CASO_FLOTTA_PIU = CASO_FLOTTA + `
DEMO.scadenze.push({ id: "s2", mezzo: "Escavatore E1 — CAT 352", tipo: "assicurazione", dataScadenza: "2099-02-01", mesi: 12, documento: "" });
DEMO.manutenzioni[0].orePreviste = 250;
`;
const CASO_FLOTTA_ZERO = `
DEMO.mezzi.length = 1;
DEMO.mezzi[0] = { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 1, area: "fronte Est", stato: "operativo", tipo: "escavatore" };
DEMO.scadenze.length = 0;
DEMO.manutenzioni.length = 0;
DEMO.fermi.length = 0; DEMO.ricambi.length = 0; DEMO.interventi.length = 0;
DEMO.rifornimenti.length = 0; DEMO.costi.length = 0; DEMO.controlli.length = 0;
DEMO.disponibilita.length = 0;
`;

const unPunto = (letture) => `
DEMO.monitoraggi.length = 1;
DEMO.monitoraggi[0] = { id: "p1", nome: "Polveri P1 — abitato", tipo: "polveri", unita: "µg/m³",
  valore: 41, soglia: 40, ricettoreId: null, tarature: [], letture: ${letture} };
DEMO.adempimenti.length = 0;
DEMO.ricettori.length = 0;
DEMO.reclami.length = 0;
DEMO.volate.length = 0;
DEMO.programma.length = 0;
`;
const L1 = `[{ data: "2026-08-01", ora: "09:00", valore: 41, origine: { da: "manuale" } }]`;
const L3 = `[{ data: "2026-07-20", ora: "09:00", valore: 12, origine: { da: "manuale" } },
             { data: "2026-07-28", ora: "09:00", valore: 44, origine: { da: "manuale" } },
             { data: "2026-08-01", ora: "09:00", valore: 41, origine: { da: "manuale" } }]`;
const L0 = `[]`;

let CASO = { flotta: CASO_FLOTTA, sent: unPunto(L1) };
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) corpo = Buffer.from(corpo.toString("utf8") + CASO.flotta, "utf8");
  if (p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [a, b] of DIFETTI_SENT_DATA) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t + CASO.sent, "utf8");
  }
  if (CONTROPROVA && (p.endsWith("apps/flotta/index.html") || p.endsWith("apps/sentinella/index.html"))) {
    let t = corpo.toString("utf8");
    for (const [a, b] of (p.includes("flotta") ? DIFETTI_FLOTTA : DIFETTI_SENT))
      { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__frasi-fl-sent-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__frasi-fl-sent-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0, nonRaggiunte = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};
const nonGuardato = (t) => { nonRaggiunte++; console.log(`  ⚠️  NON RAGGIUNTA: ${t}`); };

async function apri(app) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const err = [];
  pg.on("pageerror", (e) => err.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`);
  await pg.waitForTimeout(2600);
  dice(err.length === 0, `${app}: la pagina non solleva errori`, err[0]);
  return pg;
}
async function vai(pg, nav) {
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${nav} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
}
const T = (pg, sel) => pg.$eval(sel, (e) => e.innerText.replace(/\s+/g, " ")).catch(() => "(assente " + sel + ")");
const A = (pg, sel) => pg.$eval(sel, (e) => e.getAttribute("aria-label") || "").catch(() => "(assente " + sel + ")");
/* apre la serie storica di un punto: e' il bottone `.arr` della riga, non la
   riga (la riga non naviga). Si pretende la PROVA di averla aperta. */
const apriSerie = async (pg) => {
  await pg.click('#mon-list button.arr[aria-label^="Apri la serie storica"]').catch(() => {});
  await pg.waitForTimeout(800);
};
const carica = async (pg, sel, nome, testo) => {
  await pg.setInputFiles(sel, { name: nome, mimeType: "text/csv", buffer: Buffer.from(testo, "utf8") });
  await pg.waitForTimeout(900);
};

console.log(`\n════════ Flotta e Sentinella · il numero UNO nelle frasi${CONTROPROVA ? "  ·  ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""} ════════`);

// ══════════ FLOTTA ══════════
console.log("\n──── FLOTTA · UNO (1 scadenza registrata, 1 mezzo scoperto, tagliando a 1 ora)");
{
  const pg = await apri("flotta");
  await vai(pg, "nav-dash");
  const sc = await T(pg, "#dash-sca");
  dice(/L'unica registrata è a posto/.test(sc) && !/Le 1 registrate/.test(sc),
    "⛔ #dash-sca: «L'unica registrata è a posto», non «Le 1 registrate sono a posto»", sc);
  await vai(pg, "nav-man");
  const man = await T(pg, "#man-list");
  dice(/\b1 ora motore/i.test(man) && !/\b1 ore motore/i.test(man),
    "⛔ #man-list: «1 ora motore», non «1 ore motore»", man);
  // import ricambi: 1 aggiunto, 1 già presente, 1 ripetuto nel file
  await vai(pg, "nav-mag");
  await carica(pg, "#ric-file", "ric.csv",
    "nome;codice;giacenza;sogliaMin;prezzo\nFiltro olio;F1;3;1;12\nFiltro olio;F1;3;1;12\n");
  const r1 = await T(pg, "#ric-esito");
  dice(/1 ricambio aggiunto/.test(r1) && /1 ripetuto nel file/.test(r1) && !/1 aggiunti/.test(r1),
    "⛔ #ric-esito: «1 ricambio aggiunto, 1 ripetuto nel file»", r1);
  await carica(pg, "#ric-file", "ric2.csv", "nome;codice;giacenza;sogliaMin;prezzo\nFiltro olio;F1;3;1;12\n");
  const r2 = await T(pg, "#ric-esito");
  dice(/1 già presente \(saltato\)/.test(r2) && !/1 già presenti/.test(r2),
    "⛔ #ric-esito: «1 già presente (saltato)», non «1 già presenti (saltati)»", r2);
  // import parco
  await vai(pg, "nav-mez");
  await carica(pg, "#mez-file", "mez.csv", "nome;area;ore;stato\nDumper D9;piazzale;5;operativo\nDumper D9;piazzale;5;operativo\n");
  const m1 = await T(pg, "#ore-esito");
  dice(/1 mezzo aggiunto/.test(m1) && /1 ripetuto nel file/.test(m1),
    "⛔ #ore-esito: «1 mezzo aggiunto, 1 ripetuto nel file»", m1);
  await pg.close();
}
console.log("\n──── FLOTTA · PIÙ DI UNO (2 scadenze, tagliando a 250 ore)");
{
  CASO = { ...CASO, flotta: CASO_FLOTTA_PIU };
  const pg = await apri("flotta");
  await vai(pg, "nav-dash");
  const sc = await T(pg, "#dash-sca");
  dice(/Le 2 registrate sono a posto/.test(sc), "il plurale resta ALLA LETTERA come prima: «Le 2 registrate sono a posto»", sc);
  await vai(pg, "nav-man");
  const man = await T(pg, "#man-list");
  dice(/\b250 ore motore/i.test(man), "il plurale resta alla lettera: «250 ore motore»", man);
  await pg.close();
}
console.log("\n──── FLOTTA · ZERO (nessuna scadenza, nessuna manutenzione)");
{
  CASO = { ...CASO, flotta: CASO_FLOTTA_ZERO };
  const pg = await apri("flotta");
  await vai(pg, "nav-dash");
  const sc = await T(pg, "#dash-sca");
  dice(/Nessuna scadenza di legge registrata/.test(sc) && !/\b1 \b/.test(sc),
    "con zero non compare nessun conteggio: «Nessuna scadenza di legge registrata»", sc);
  await pg.close();
}

// ══════════ SENTINELLA ══════════
console.log("\n──── SENTINELLA · UNO (1 punto, 1 lettura, 1 superamento)");
{
  CASO = { flotta: CASO_FLOTTA, sent: unPunto(L1) };
  const pg = await apri("sentinella");
  await vai(pg, "nav-mon");
  await apriSerie(pg);
  const aria = await A(pg, "#graf-p1 svg.plot");
  if (/assente/.test(aria)) nonGuardato("l'aria della serie storica (#graf-p1 svg.plot non aperto)");
  else dice(/\b1 lettura\b/.test(aria) && /\b1 superamento\b/.test(aria) && !/\b1 letture\b/.test(aria) && !/\b1 superamenti\b/.test(aria),
    "⛔ aria della serie storica: «1 lettura … 1 superamento», non «1 letture … 1 superamenti»", aria);
  // import scadenze / sensori / ricettori
  await vai(pg, "nav-ade");
  await carica(pg, "#ade-file", "ade.csv", "titolo;ente;scadenza\nRinnovo AUA;Provincia;2099-01-01\nRinnovo AUA;Provincia;2099-01-01\n");
  const a1 = await T(pg, "#ade-esito");
  dice(/1 scadenza aggiunta/.test(a1) && /1 ripetuta nel file/.test(a1) && !/1 aggiunte/.test(a1),
    "⛔ #ade-esito: «1 scadenza aggiunta, 1 ripetuta nel file»", a1);
  /* ⚠️ QUESTE DUE SCENE SONO NATE DALLA CONTROPROVA: le iniezioni «import
     ricettori» e «import sensori» trovavano il loro pezzo (13 su 13) e NESSUNA
     riga le metteva alla prova — un'iniezione che nessuna scena legge gonfia il
     conto delle iniezioni e non dimostra niente. */
  await vai(pg, "nav-prog");
  await carica(pg, "#ric-file", "ric.csv",
    "nome;tipo;distanza;classe;soglia;unita;nota\nCasa Bianchi;abitazione;120;III;3;mm/s;\nCasa Bianchi;abitazione;120;III;3;mm/s;\n");
  const rc = await T(pg, "#ric-esito");
  dice(/1 ricettore aggiunto/.test(rc) && /1 ripetuto nel file/.test(rc) && !/1 aggiunti/.test(rc),
    "⛔ #ric-esito: «1 ricettore aggiunto, 1 ripetuto nel file»", rc);
  await vai(pg, "nav-mon");
  await carica(pg, "#mon-file", "sen.csv",
    "nome;tipo;valore;soglia;unita;nota\nRumore R9;rumore;58;60;dB(A);\nRumore R9;rumore;58;60;dB(A);\n");
  const se = await T(pg, "#mis-esito");
  dice(/1 sensore aggiunto/.test(se) && /1 ripetuto nel file/.test(se) && !/1 aggiunti/.test(se),
    "⛔ #mis-esito: «1 sensore aggiunto, 1 ripetuto nel file»", se);
  await pg.close();
}
console.log("\n──── SENTINELLA · PIÙ DI UNO (1 punto, 3 letture, 2 superamenti)");
{
  CASO = { flotta: CASO_FLOTTA, sent: unPunto(L3) };
  const pg = await apri("sentinella");
  await vai(pg, "nav-mon");
  await apriSerie(pg);
  const aria = await A(pg, "#graf-p1 svg.plot");
  if (/assente/.test(aria)) nonGuardato("l'aria della serie storica (più di uno)");
  else dice(/\b3 letture\b/.test(aria) && /\b2 superamenti\b/.test(aria),
    "il plurale resta ALLA LETTERA: «3 letture … 2 superamenti»", aria);
  await pg.close();
}
console.log("\n──── SENTINELLA · ZERO (1 punto, nessuna lettura)");
{
  CASO = { flotta: CASO_FLOTTA, sent: unPunto(L0) };
  const pg = await apri("sentinella");
  await vai(pg, "nav-mon");
  await apriSerie(pg);
  const riga = await T(pg, "#mon-list");
  dice(/nessuna lettura/.test(riga) && !/\b0 letture\b/.test(riga),
    "con zero letture la riga dice «nessuna lettura», e nessun grafico si apre", riga);
  await pg.close();
}

console.log(`\n──── ${ok} ok · ${ko} KO · ${prove} prove · ${nonRaggiunte} scene NON raggiunte`);
if (CONTROPROVA) {
  const tot = DIFETTI_FLOTTA.length + DIFETTI_SENT.length + DIFETTI_SENT_DATA.length;
  console.log(`──── iniezioni che hanno trovato il loro pezzo: ${colpiti.size} su ${tot}`);
  for (const [a] of [...DIFETTI_FLOTTA, ...DIFETTI_SENT, ...DIFETTI_SENT_DATA])
    if (!colpiti.has(a)) console.log(`     ✗ MAI TROVATA: ${a.slice(0, 90)}…`);
}
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

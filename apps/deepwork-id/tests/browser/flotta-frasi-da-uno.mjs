/* LE FRASI DI FLOTTA QUANDO IL NUMERO È UNO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-frasi-da-uno.mjs [--porta=8496]
     node flotta-frasi-da-uno.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08 il filo era «il testo che mente», e in Flotta il
   caso limite è quasi sempre lo stesso — **uno** — che nella dimostrazione
   non compare mai: sei mezzi, quattro fermi, sette rifornimenti, tre
   scadenze. Aprendo la pagina con **un mezzo, un fermo, un pieno, un
   ricambio, un intervento, una scadenza ogni mese**, sono uscite frasi che
   leggendo il codice non si vedevano:

     · «**1 mezzi operativi** su 1, adesso» — sul quadrante del Quadro, ed è
       la prima frase che si legge aprendo l'app; identica in cima al parco;
     · «**Tutti i 1 mezzi** hanno il giro di oggi», e la gemella nella
       schermata Giro, «Tutti i 1 mezzi hanno il controllo di oggi»;
     · «**Tutte a posto: 1 scadenze** su 1 mezzo, nessuna entro **1 giorni**»
       — quattro pezzi della stessa frase, tre sbagliati e uno giusto (il
       mezzo): la regola era nota a chi ha scritto quella parola, non alla
       frase;
     · «**Ci sono stati 1 fermo, tutti già chiusi, lunghi** in media 1
       giorno» — qui il sostantivo il singolare ce l'aveva già, e a mancarlo
       erano il verbo e i due aggettivi;
     · «**Tutti i 1 ricambi** sono sopra la soglia minima»;
     · «piano: **ogni 1 mesi**» — e nel **libretto**, due righe più su, la
       scadenza diceva «ogni 1 mese»: la stessa frase in due dialetti a
       quattro centimetri di distanza;
     · «**1 ore motore**» sulla riga del mezzo, nel libretto **e nel CSV del
       libretto** — cioè sul foglio che si consegna a chi compra la macchina;
     · nel **CSV del libretto**, «totale officina … **1 interventi**» mentre
       lo schermo, sopra, scriveva «1 intervento chiuso»;
     · «Con **1 giorni** di consegna … coprire **1 giorni** di consumo» e
       «× **1 giorni** = 1 da tenere» — e quei giorni li scrive l'utente in
       un campo, non sono un caso di laboratorio;
     · «misurato su **1 ore di lavoro**», «in **1 ore misurate**»;
     · e i sette messaggi di export: «Esportati **1 interventi**»,
       «Esportate **1 voci** di costo», «Esportati **1 fermi**», «Esportati
       **1 mezzi**, 1 manutenzioni, 1 ricambi», «Esportati **1 giri
       macchina**», «Esportati **1 ricambi**». Il settimo, le scadenze, il
       sostantivo l'aveva giusto e sbagliava il participio: «**Esportate** 1
       scadenza».

   ⚠️ NESSUNA DI QUESTE SI VEDE NELLE PROVE `node`: le regole pure stanno in
   `run-kpi.mjs`, qui si controlla che la PAGINA le chiami — la guardia
   collegata, non la guardia scritta. E `uno-solo.mjs` non poteva prenderle:
   guarda quello che la dimostrazione mostra, e la dimostrazione non ha mai
   un solo mezzo.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI SERVITI, mai nel documento: si aggiunge
   una coda alla risposta HTTP di `flotta-data.js`. Il file su disco non si
   tocca — mentre girano cantieri paralleli è l'unico modo sicuro.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8496;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, nella forma in cui stavano nella
   pagina prima del 06/08. Si contano: una controprova che non sostituisce
   niente non prova niente. */
const DIFETTI = [
  // 1 · il quadrante del Quadro e la riga in cima al parco
  ['<b>${disp.operativi}</b> ${plurale(disp.operativi, "mezzo operativo", "mezzi operativi")} su <b>${disp.totale}</b>',
   '<b>${disp.operativi}</b> mezzi operativi su <b>${disp.totale}</b>'],
  ['${disp.operativi} ${plurale(disp.operativi, "mezzo operativo", "mezzi operativi")} su ${disp.totale}.',
   '${disp.operativi} mezzi operativi su ${disp.totale}.'],
  // 2 · le tre frasi «tutti i N mezzi»
  ['${cop.totale === 1 ? "L\'<b>unico</b> mezzo ha" : `Tutti i <b>${cop.totale}</b> mezzi hanno`} il giro di oggi',
   'Tutti i <b>${cop.totale}</b> mezzi hanno il giro di oggi'],
  ['${cop.totale === 1 ? "L\'<b>unico</b> mezzo ha" : `Tutti i <b>${cop.totale}</b> mezzi hanno`} il controllo di oggi',
   'Tutti i <b>${cop.totale}</b> mezzi hanno il controllo di oggi'],
  ['RIC.length === 1\n            ? `L\'<b>unico</b> ricambio è sopra la soglia minima.`\n            : `Tutti i <b>${RIC.length}</b> ricambi sono sopra la soglia minima.`',
   'false\n            ? `L\'<b>unico</b> ricambio è sopra la soglia minima.`\n            : `Tutti i <b>${RIC.length}</b> ricambi sono sopra la soglia minima.`'],
  // 3 · i quattro pezzi della frase «tutte a posto»
  ['`${plurale(contaSca.totale, "A posto", "Tutte a posto")}: <b>${contaSca.totale}</b> ${plurale(contaSca.totale, "scadenza", "scadenze")} su ${contaSca.mezzi} ${plurale(contaSca.mezzi, "mezzo", "mezzi")}, ${plurale(contaSca.totale, "non scade", "nessuna")} entro ${conta(preavvisoSca, "giorno", "giorni")}.',
   '`Tutte a posto: <b>${contaSca.totale}</b> scadenze su ${contaSca.mezzi} ${plurale(contaSca.mezzi, "mezzo", "mezzi")}, nessuna entro ${preavvisoSca} giorni.'],
  // 4 · il verbo e gli aggettivi dei fermi
  ['`${plurale(aff.episodi, "C\'è stato", "Ci sono stati")} <b>${aff.episodi}</b> ${plurale(aff.episodi, "fermo", "fermi")}',
   '`Ci sono stati <b>${aff.episodi}</b> ${plurale(aff.episodi, "fermo", "fermi")}'],
  [': plurale(aff.episodi, ", già chiuso", ", tutti già chiusi")}`\n          + `, ${plurale(aff.episodi, "lungo", "lunghi")} in media',
   ': ", tutti già chiusi"}`\n          + `, lunghi in media'],
  // 5 · la ricorrenza a mesi, scritta una volta sola
  ['const ogniMesiTx = (n) => "ogni " + plurale(n, "mese", n + " mesi");',
   'const ogniMesiTx = (n) => "ogni " + n + " mesi";'],
  // 6 · le ore del contatore
  ['return (marca ? marca(n) : n) + " " + plurale(v, "ora motore", "ore motore");',
   'return (marca ? marca(n) : n) + " ore motore";'],
  // 7 · i giorni della scorta
  ['${plurale(consegna, "giorno", "giorni")} di consegna', 'giorni di consegna'],
  ['${plurale(consegna + sicurezza, "giorno", "giorni")}</b> di consumo', 'giorni</b> di consumo'],
  ['${numTx(r.copertura)} ${plurale(r.copertura, "giorno", "giorni")} = <b>', '${numTx(r.copertura)} giorni = <b>'],
  // 8 · le ore di lavoro coperte dai contatori
  ['"misurato su " + conta(m.oreCoperte, "ora di lavoro", "ore di lavoro")', '"misurato su " + m.oreCoperte + " ore di lavoro"'],
  ['${plurale(m.ore, "ora misurata", "ore misurate")} ·', 'ore misurate ·'],
  ['conta(f.consumo.oreCoperte, "ora", "ore")', 'f.consumo.oreCoperte + " ore"'],
  // 9 · il totale d'officina nel CSV del libretto
  ['conta(f.officina.interventi, "intervento", "interventi")\n      + (f.officina.ore ? " · " + conta(f.officina.ore, "ora di manodopera", "ore di manodopera") : "")',
   'f.officina.interventi + " interventi"\n      + (f.officina.ore ? " · " + f.officina.ore + " ore di manodopera" : "")'],
  // 10 · i sette messaggi di export
  ['toast(plurale(INT.length, "Esportato ", "Esportati ") + conta(INT.length, "intervento", "interventi") + " (CSV).", "success");',
   'toast("Esportati " + INT.length + " interventi (CSV).", "success");'],
  ['esito("sca-esito", plurale(SCA.length, "Esportata ", "Esportate ") + conta(SCA.length, "scadenza", "scadenze") + " (CSV)"',
   'esito("sca-esito", "Esportate " + SCA.length + (SCA.length === 1 ? " scadenza" : " scadenze") + " (CSV)"'],
  ['esito("cos-esito", plurale(COS.length, "Esportata ", "Esportate ") + conta(COS.length, "voce di costo", "voci di costo") + " (CSV)"',
   'esito("cos-esito", "Esportate " + COS.length + " voci di costo (CSV)"'],
  ['`${plurale(RIC.length, "Esportato", "Esportati")} ${conta(RIC.length, "ricambio", "ricambi")} (CSV).`',
   '`Esportati ${RIC.length} ricambi (CSV).`'],
  ['"Esportati: " + conta(MEZ.length, "mezzo", "mezzi") + ", " + conta(MAN.length, "manutenzione", "manutenzioni") + ", " + conta(RIC.length, "ricambio", "ricambi") + " (CSV)."',
   '"Esportati " + MEZ.length + " mezzi, " + MAN.length + " manutenzioni, " + RIC.length + " ricambi (CSV)."'],
  ['toast(plurale(CTR.length, "Esportato ", "Esportati ") + conta(CTR.length, "giro macchina", "giri macchina") + " (CSV).", "success");',
   'toast("Esportati " + CTR.length + " giri macchina (CSV).", "success");'],
  ['esito("fer-esito", plurale(FER.length, "Esportato ", "Esportati ") + conta(FER.length, "fermo", "fermi") + " (CSV).", "success");',
   'esito("fer-esito", "Esportati " + FER.length + " fermi (CSV).", "success");'],
];

/* IL CASO, costruito nei DATI: un mezzo con UN'ORA sul contatore, un fermo
   di un giorno, un ricambio, un intervento, una scadenza che si ripete ogni
   mese, un giro. Le date sono relative a oggi. */
const CASO_UNO = `
const _g = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0,10); };
DEMO.mezzi.length = 1;
DEMO.mezzi[0] = { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 1, area: "fronte Est", stato: "operativo", tipo: "escavatore" };
DEMO.manutenzioni.length = 0;
DEMO.manutenzioni.push({ id: "n1", titolo: "Revisione", mezzo: "Escavatore E1", dataPrevista: _g(-40), ogniMesi: 1 });
DEMO.fermi.length = 0;
DEMO.fermi.push({ id: "f1", mezzo: "Escavatore E1", causale: "guasto-idraulico", inizio: _g(3), fine: _g(3), note: "" });
DEMO.rifornimenti.length = 0;
DEMO.rifornimenti.push({ id: "r1", data: _g(4), mezzo: "Escavatore E1", litri: 10, euro: 15, ore: 100, nota: "", costoId: null });
DEMO.rifornimenti.push({ id: "r2", data: _g(3), mezzo: "Escavatore E1", litri: 12, euro: 18, ore: 101, nota: "", costoId: null });
DEMO.ricambi.length = 1;
DEMO.interventi.length = 0;
DEMO.interventi.push({ id: "w1", titolo: "Cambio filtro", mezzo: "Escavatore E1", data: _g(5),
  ricambio: DEMO.ricambi[0] && DEMO.ricambi[0].nome, ricambioQta: 1, costo: 100, note: "", oreManodopera: 1 });
DEMO.scadenze.length = 1;
DEMO.scadenze[0].mezzo = "Escavatore E1";
DEMO.scadenze[0].dataScadenza = _g(-200);
DEMO.scadenze[0].mesi = 1;
DEMO.costi.length = 1;
DEMO.controlli.length = 1;
DEMO.controlli[0].mezzo = "Escavatore E1";
DEMO.controlli[0].data = _g(0);
DEMO.disponibilita.length = 0;
`;

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) corpo = Buffer.from(corpo.toString("utf8") + CASO_UNO, "utf8");
  if (CONTROPROVA && p.endsWith("apps/flotta/index.html")) {
    let t = corpo.toString("utf8");
    /* si contano i DIFETTI RIMESSI, non le sostituzioni: la pagina viene
       caricata più volte e un conto crescente direbbe «66 su 22». */
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__flotta-frasi-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__flotta-frasi-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, frasi = 0;
const dice = (c, t, x) => {
  frasi++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* Apre Flotta PRETENDENDO la prova di aver navigato: un banco che non naviga
   risponde «tutto a posto» dopo aver guardato una schermata su sette. */
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
await pg.waitForTimeout(2500);

async function vai(nav) {
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(500);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${nav} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  return viste[0];
}
const T = (sel) => pg.$eval(sel, (e) => e.innerText.replace(/\s+/g, " ")).catch(() => "(assente " + sel + ")");
const PAG = (id) => pg.$eval("#" + id, (e) => e.innerText.replace(/\s+/g, " ")).catch(() => "(assente)");

console.log(`\n════════ le frasi di Flotta quando il numero è uno${CONTROPROVA ? " · controprova" : ""} ════════`);
dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

// ── 1 · IL QUADRO ────────────────────────────────────────────────────────
console.log("\n· il Quadro: quadrante, giro, scadenze");
await vai("nav-dash");
{
  const g = await T("#dash-gauge");
  dice(/1 mezzo operativo su 1/.test(g), "⛔ «1 mezzo operativo su 1», non «1 mezzi operativi»", g);
  const gi = await T("#dash-giro");
  dice(/L'unico mezzo ha il giro di oggi/.test(gi), "⛔ «L'unico mezzo ha il giro di oggi», non «Tutti i 1 mezzi»", gi);
  const sc = await T("#dash-sca");
  dice(/A posto: 1 scadenza su 1 mezzo, non scade entro 30 giorni/.test(sc),
    "⛔ «A posto: 1 scadenza su 1 mezzo, non scade entro 30 giorni» — quattro pezzi, tre erano sbagliati", sc);
}

// ── 2 · IL PREAVVISO A UN GIORNO, che lo scrive l'utente ─────────────────
console.log("\n· il preavviso messo a un giorno solo");
await vai("nav-sca");
await pg.fill("#sca-preavviso", "1");
await pg.dispatchEvent("#sca-preavviso", "change");
await pg.waitForTimeout(700);
await vai("nav-dash");
{
  const sc = await T("#dash-sca");
  dice(/non scade entro 1 giorno\./.test(sc), "⛔ «non scade entro 1 giorno», non «entro 1 giorni»", sc);
}

// ── 3 · IL GIRO E IL PARCO ───────────────────────────────────────────────
console.log("\n· la schermata Giro e il parco mezzi");
await vai("nav-giro");
dice(/L'unico mezzo ha il controllo di oggi/.test(await T("#giro-riep")),
  "⛔ «L'unico mezzo ha il controllo di oggi»", await T("#giro-riep"));
await vai("nav-mez");
{
  dice(/1 mezzo operativo su 1\./.test(await T("#mez-disp")), "⛔ in cima al parco: «1 mezzo operativo su 1»", await T("#mez-disp"));
  const lista = await T("#mez-list");
  dice(/1 ora motore/.test(lista) && !/1 ore motore/.test(lista),
    "⛔ sulla riga del mezzo: «1 ora motore», non «1 ore motore»", lista);
  const fer = await T("#fer-riep");
  dice(/C'è stato 1 fermo, già chiuso, lungo in media 1 giorno/.test(fer),
    "⛔ «C'è stato 1 fermo, già chiuso, lungo in media 1 giorno» — il sostantivo era giusto, verbo e aggettivi no", fer);
  const co = await T("#costo-ora");
  dice(/in 1 ora misurata/.test(co), "⛔ «in 1 ora misurata», non «1 ore misurate»", co);
}

// ── 4 · OFFICINA: la ricorrenza a mesi e il magazzino ────────────────────
console.log("\n· l'Officina: «ogni mese» e il magazzino con un pezzo solo");
await vai("nav-man");
{
  const man = await T("#man-list");
  dice(/piano: ogni mese/.test(man) && !/ogni 1 mes/.test(man), "⛔ «piano: ogni mese», non «ogni 1 mesi»", man);
  dice(/L'unico ricambio è sopra la soglia minima/.test(await T("#ric-alert")),
    "⛔ «L'unico ricambio è sopra la soglia minima»", await T("#ric-alert"));
}

// ── 5 · LE SCORTE con un giorno di consegna ──────────────────────────────
console.log("\n· le scorte con un giorno di consegna e zero margine");
await pg.fill("#sco-consegna", "1");
await pg.fill("#sco-sicurezza", "0");
await pg.dispatchEvent("#sco-consegna", "input");
await pg.dispatchEvent("#sco-sicurezza", "input");
await pg.waitForTimeout(800);
{
  const r = await T("#sco-riep");
  dice(/Con 1 giorno di consegna/.test(r), "⛔ «Con 1 giorno di consegna»", r);
  dice(/coprire 1 giorno di consumo/.test(r), "⛔ «coprire 1 giorno di consumo»", r);
  const l = await T("#sco-list");
  dice(/× 1 giorno =/.test(l), "⛔ sulla riga del ricambio: «× 1 giorno =»", l);
}

// ── 6 · IL CARBURANTE: un'ora coperta dai contatori ──────────────────────
console.log("\n· il carburante misurato su un'ora sola");
await vai("nav-cos");
dice(/misurato su 1 ora di lavoro/.test(await T("#rif-list")), "⛔ «misurato su 1 ora di lavoro»", await T("#rif-list"));

// ── 7 · IL LIBRETTO, a schermo e nel file che si consegna ────────────────
console.log("\n· il libretto della macchina, schermo e CSV");
await vai("nav-mez");
await pg.click("[data-scheda-mezzo]").catch(() => {});
await pg.waitForTimeout(900);
{
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.join() === "page-sch", `il libretto si è aperto davvero (${viste.join(",") || "nessuna"})`, viste);
  const s = await PAG("page-sch");
  dice(/1 ora motore/.test(s) && !/1 ore motore/.test(s), "⛔ libretto: «1 ora motore»", s.slice(0, 200));
  dice(!/ogni 1 mes/.test(s), "⛔ libretto: nessun «ogni 1 mesi» (la scadenza e il tagliando dicevano due cose diverse)",
    (s.match(/ogni 1 mes\w*/g) || []).join(" | "));
  dice(/misurati su 1 ora di lavoro/.test(s), "⛔ libretto: «misurati su 1 ora di lavoro»",
    (s.match(/misurati su [^.]{0,40}/) || [])[0]);

  const csv = await pg.evaluate(async () => {
    let testo = null;
    const orig = URL.createObjectURL, a0 = HTMLAnchorElement.prototype.click;
    URL.createObjectURL = (blob) => { blob.text().then((t) => (testo = t)); return "blob:x"; };
    HTMLAnchorElement.prototype.click = function () {};
    document.getElementById("btn-sch-csv").click();
    await new Promise((r) => setTimeout(r, 500));
    URL.createObjectURL = orig; HTMLAnchorElement.prototype.click = a0;
    return testo || "";
  });
  dice(csv.split("\n").length > 5, `il CSV del libretto è uscito davvero (${csv.split("\n").length} righe)`, csv.slice(0, 80));
  dice(/1 ora motore/.test(csv) && !/1 ore motore/.test(csv), "⛔ CSV del libretto: «1 ora motore»",
    (csv.match(/[^;]*ore? motore[^;]*/) || [])[0]);
  dice(!/ogni 1 mes/.test(csv), "⛔ CSV del libretto: nessun «ogni 1 mesi»", (csv.match(/ogni 1 mes\w*/g) || []).join(" | "));
  dice(/;1 intervento · 1 ora di manodopera;/.test(csv),
    "⛔ CSV del libretto: «1 intervento · 1 ora di manodopera» (lo schermo diceva già «1 intervento chiuso»)",
    (csv.match(/totale officina[^\n]*/) || [])[0]);
  dice(/su 1 ora /.test(csv), "⛔ CSV del libretto: il consumo è «su 1 ora», non «su 1 ore»",
    (csv.match(/consumo[^\n]*/) || [])[0]);
}

// ── 8 · I SETTE MESSAGGI DI EXPORT ───────────────────────────────────────
console.log("\n· i sette messaggi di export, con una riga sola dappertutto");
await pg.evaluate(() => { document.getElementById("btn-sch-back").click(); });
await pg.waitForTimeout(400);
await pg.evaluate(() => { URL.createObjectURL = () => "blob:x"; HTMLAnchorElement.prototype.click = function () {}; });
const EXPORT = [
  ["nav-man", "btn-int-csv", /Esportato 1 intervento \(CSV\)/, "«Esportato 1 intervento»"],
  /* il magazzino ricambi ha il suo bottone dentro la sezione, con un esito suo
     (`#ric-esito`) invece del toast: sta fuori da questo giro, più sotto. */
  ["nav-cos", "btn-cos-csv", /Esportata 1 voce di costo \(CSV\)/, "«Esportata 1 voce di costo» — participio compreso"],
  ["nav-mez", "btn-fer-csv", /Esportato 1 fermo \(CSV\)/, "«Esportato 1 fermo»"],
  ["nav-mez", "btn-flotta-export", /Esportati: 1 mezzo, 1 manutenzione, 1 ricambio \(CSV\)/, "«1 mezzo, 1 manutenzione, 1 ricambio» — tre in una frase sola"],
  ["nav-sca", "btn-sca-csv", /Esportata 1 scadenza \(CSV\)/, "«Esportata 1 scadenza» — il sostantivo era giusto, il participio no"],
  ["nav-giro", "btn-giro-csv", /Esportato 1 giro macchina \(CSV\)/, "«Esportato 1 giro macchina»"],
];
let provati = 0;
for (const [nav, btn, re, nome] of EXPORT) {
  if (!re) continue;
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(300);
  const c = await pg.$("#" + btn);
  if (!c) { dice(false, `il bottone #${btn} esiste`, "assente"); continue; }
  await c.click().catch(() => {});
  await pg.waitForTimeout(400);
  provati++;
  const visto = await pg.evaluate(() => [...document.querySelectorAll(".toast,#toast,.dw-toast,.note.esito,[id$='-esito']")]
    .map((x) => x.innerText).filter(Boolean).join(" ⏎ "));
  dice(re.test(visto), `⛔ ${nome}`, visto);
}
/* Il magazzino ricambi ha il suo bottone dentro la sezione e scrive in
   `#ric-esito`, non nel toast.
   ⛔ E QUI IL BANCO ACCUSAVA UN INNOCENTE: cercava `#btn-ric-csv`, che non
   esiste — l'id vero è `btn-ric-export` — e stampava «il bottone di export dei
   ricambi esiste: assente», cioè un KO che sembrava un pezzo di prodotto
   mancante. La pagina invece la frase giusta la scriveva già, con `plurale` e
   `conta` (riga ~3790). È la quarta volta in una giornata che a sbagliare è il
   controllo e non il prodotto: un id inventato costa quanto un difetto vero,
   perché manda a cercare dove non c'è niente. */
{
  await pg.click("#nav-man").catch(() => {});
  await pg.waitForTimeout(300);
  const bot = await pg.$("#btn-ric-export");
  if (bot) {
    await bot.click().catch(() => {});
    await pg.waitForTimeout(400);
    provati++;
    const visto = await T("#ric-esito");
    dice(/Esportato 1 ricambio \(CSV\)/.test(visto), "⛔ «Esportato 1 ricambio»", visto);
  } else dice(false, "il bottone di export dei ricambi esiste (#btn-ric-export)", "assente");
}

// ── 9 · IL SETACCIO GENERALE ─────────────────────────────────────────────
/* ⛔ LE ASSERZIONI QUI SOPRA GUARDANO I PUNTI CHE HO CORRETTO: questo guarda
   TUTTO IL RESTO. Senza, il banco direbbe «a posto» su una frase nuova
   sbagliata scritta domani in un punto che non è in elenco. */
console.log("\n· il setaccio: nessun «1 <plurale>» in nessuna schermata");
const PLURALI = ["mezzi", "giorni", "ore", "voci", "righe", "scadenze", "ricambi", "interventi",
  "fermi", "consumi", "lavori", "pieni", "litri", "mesi", "anni", "pezzi", "giri", "controlli",
  "letture", "rifornimenti", "manutenzioni", "anomalie", "episodi", "guasti", "tagliandi"];
const RE = new RegExp("(?:^|[^\\d,.])1[  ]+(" + PLURALI.join("|") + ")\\b", "gi");
let schermate = 0, caratteri = 0;
const trovati = [];
for (const nav of ["nav-dash", "nav-giro", "nav-mez", "nav-man", "nav-sca", "nav-cos"]) {
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(450);
  const t = await pg.evaluate(() => {
    const e = [...document.querySelectorAll(".page")].find((x) => getComputedStyle(x).display !== "none");
    return e ? e.innerText : "";
  });
  if (!t) continue;
  schermate++; caratteri += t.length;
  for (const m of t.matchAll(RE)) {
    const i = Math.max(0, m.index - 45);
    trovati.push(`${nav}: «1 ${m[1]}» — …${t.slice(i, m.index + 45).replace(/\n/g, " ⏎ ")}…`);
  }
}
dice(schermate === 6, `abbastanza schermate lette (${schermate}, ${caratteri} caratteri)`, schermate);
dice(trovati.length === 0, "nessun «1 <plurale>» rimasto in nessuna schermata", trovati.join("\n        "));

await b.close();
srv.close();

if (CONTROPROVA) {
  /* ⚠️ SI CONTA ANCHE QUANTI DIFETTI SONO STATI DAVVERO RIMESSI: una
     controprova che sostituisce zero stringhe «non fallisce» e non ha fatto
     niente — è il difetto già costato una volta in questo progetto. */
  console.log(`\ncontroprova: ${colpiti.size} difetti su ${DIFETTI.length} rimessi nella pagina`
    + `  ·  ${provati} export provati  ·  ${ko} prove cadute su ${frasi}`);
  const abbastanza = colpiti.size >= DIFETTI.length - 1;
  if (!abbastanza) console.log("  ✗ alcune iniezioni non hanno trovato il loro testo: il banco non sta provando quello che crede.");
  process.exit(ko >= 15 && abbastanza ? 0 : 1);
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${frasi} controlli  ·  ${schermate} schermate setacciate `
  + `(${caratteri} caratteri, ${PLURALI.length} plurali cercati)  ·  ${provati} messaggi di export provati`);
process.exit(ko > 0 ? 1 : 0);

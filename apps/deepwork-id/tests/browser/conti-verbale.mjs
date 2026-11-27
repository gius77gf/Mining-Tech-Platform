/* IL VERBALE DI RICONCILIAZIONE DI CONTI: IL DIVARIO SCRITTO CON LA SUA CAUSA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-verbale.mjs                 (dimostrazione: scrive un verbale e lo rilegge)
     node conti-verbale.mjs --controprova   (rimette il difetto: DEVE fallire)
     node conti-verbale.mjs --scatti

   PERCHÉ ESISTE. Dal 02/09 sotto «Cavato contro venduto» c'è il verbale: il
   divario del periodo conservato con la causa scelta fra quelle che la
   schermata elenca. Il banco fa il gesto da utente — apre il Report, preme
   «Scrivi il verbale», sceglie una causa, scrive una nota, salva — e guarda
   tre cose: che il numero SALVATO sia quello che la schermata mostrava (letto
   dallo schermo, non dal banco), che il verbale compaia col suo testo, e che
   lo storico cresca di una riga col verso del passo.
   La controprova rimette il difetto più silenzioso: la pagina che salva uno
   zero al posto del divario. Il verbale si scrive lo stesso, la frase si legge
   uguale, e solo il confronto «allora/adesso» lo tradisce — cioè la difesa
   che il modulo ha costruito apposta.

   IL TERZO LATO (03/09). Il verbale del cavato registra anche le scorte,
   quando il triangolo chiude (`componiVerbale`): sul primo semestre della
   dimostrazione il record salvato porta Δscorte 16,3 t e scarto 55,2 t — il
   banco li legge DALLO SCHERMO, nella testa del verbale e nella riga dello
   storico; su un periodo in cui il triangolo non chiude (luglio–metà agosto:
   un solo inventario) il verbale salva `scorte: null` col motivo, e lo
   storico dice «scorte stimate: …». E «Questo mese» fra le scorciatoie: dal
   primo del mese a oggi — sulla dimostrazione, in un mese senza rilievi, il
   confronto resta fermo e lo dice (il banco dichiara quale dei due esiti ha
   trovato, perché dipende dal giorno in cui gira).
   La seconda controprova rimette il difetto del terzo lato: le scorte
   salvate come ZERO quando il triangolo non chiude — «scarto 0 t, coerente»
   dove la verità è «non misurato». */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = process.env.DW_SCATTI || "/tmp/conti-verbale";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const DIFETTI = [
  ["apps/conti/index.html",
   'await db.aggiungi("verbali", componiVerbale({ dal: d1, al: d2, tipo, divario, pct, stato, causa, nota, scrittoIl: istanteLocale() }, tri));',
   'await db.aggiungi("verbali", componiVerbale({ dal: d1, al: d2, tipo, divario: 0, pct, stato, causa, nota, scrittoIl: istanteLocale() }, tri));   /* difetto rimesso dal banco */'],
  // il terzo lato: un triangolo che NON chiude salvato come scorte a zero
  ["apps/conti/conti-data.js",
   'if (tri.stato !== "chiuso") return { ...b, scorte: null, chiusura: null,',
   'if (tri.stato !== "chiuso") return { ...b, scorte: { deltaM3: 0, deltaT: 0, inizio: null, fine: null, parziale: false, fuori: [] }, chiusura: { scarto: 0, pct: 0, stato: "coerente", verso: "pari" }, /* difetto rimesso dal banco */'],
];
let difettiRimessi = 0;

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
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
let datiDopo = null; const t0 = Date.now();
for (let i = 0; i < 80 && datiDopo === null; i++) { await pg.waitForTimeout(250);
  if (await pg.evaluate(() => (document.getElementById("cos-riep")?.innerHTML.length || 0) > 0)) datiDopo = Date.now() - t0; }
console.log("  dati dimostrativi arrivati dopo ms:", datiDopo);
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
const leggi = () => pg.evaluate(() => {
  const box = document.getElementById("ric-verbale");
  const note = [...box.querySelectorAll(".note")].map((n) => ({ testo: n.textContent.replace(/\s+/g, " ").trim(), warn: n.classList.contains("warn") }));
  const righe = [...box.querySelectorAll(".item")].map((i) => ({ nome: i.querySelector(".name")?.textContent.replace(/\s+/g, " ").trim(), meta: i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(), verso: i.querySelector(".amt-s")?.textContent.trim() }));
  const num = document.querySelector("#ric-riep .cassa-num")?.textContent.replace(/\s+/g, " ").trim() || null;
  return { note, righe, bottone: document.getElementById("btn-ric-verbale")?.textContent.trim() || null, divarioSchermo: num };
});
await pg.click("#nav-rep");
// aspetto che il lato Terra abbia finito (i rilievi arrivano un attimo dopo)
let v = null;
for (let i = 0; i < 30; i++) { await pg.waitForTimeout(200); v = await leggi(); if (v.divarioSchermo && v.bottone) break; }
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(!!v.divarioSchermo, "il confronto cavato/venduto è disegnato (c'è un divario sullo schermo)", v);
dice(v.bottone === "Scrivi il verbale", "per l'anno in corso non c'è un verbale: il bottone dice «Scrivi il verbale»", v.bottone);
dice(v.note.length === 1 && /non c'è ancora un verbale/.test(v.note[0].testo), "e la nota lo dice", v.note);
dice(v.righe.length === 1 && /cumuli/.test(v.righe[0].meta) && v.righe[0].verso === "primo", "lo storico ha il verbale del primo semestre della dimostrazione, con la causa «cumuli», ed è il primo", v.righe);
const divarioSchermo = v.divarioSchermo;
// il gesto: scrivi il verbale
await pg.click("#btn-ric-verbale"); await pg.waitForTimeout(400);
dice(await pg.evaluate(() => !!document.getElementById("modal-campo") && !!document.getElementById("modal-nota")), "la modale chiede la causa (tendina) e la nota");
await pg.selectOption("#modal-campo", "rilievo");
await pg.fill("#modal-nota", "manca il volo di agosto");
await pg.evaluate(() => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => /Salva/.test(x.textContent)); if (b) b.click(); });
await pg.waitForTimeout(900);
v = await leggi();
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);
dice(v.note.length === 1 && /Verbale di questo periodo/.test(v.note[0].testo), "il verbale di questo periodo è comparso", v.note);
dice(/Manca un rilievo nel periodo/.test(v.note[0]?.testo || "") && /manca il volo di agosto/.test(v.note[0]?.testo || ""), "con la causa scelta e la nota scritta", v.note[0]);
const nSchermo = String(divarioSchermo).replace(/[^\d.,]/g, "");
dice(v.note[0] && v.note[0].testo.includes(nSchermo) && !v.note[0].warn && /lo stesso numero/.test(v.note[0].testo), `⛔ il numero salvato è quello che lo schermo mostrava (${divarioSchermo}) e oggi il conto dà lo stesso`, v.note[0]);
dice(v.bottone === "Scrivi un altro verbale", "il bottone ora dice «Scrivi un altro verbale»", v.bottone);
dice(v.righe.length === 2 && /rilievo/i.test(v.righe[0].meta), "lo storico è cresciuto di una riga, la più recente in cima", v.righe);
dice(v.righe[0] && /il divario (cresce|cala)|come prima/.test(v.righe[0].verso), "e la riga nuova dice il verso del passo rispetto al verbale prima", v.righe[0]);
// ── e il verbale del PRODOTTO (Campo), nello stesso riquadro del terzo lato ──
const leggiP = () => pg.evaluate(() => {
  const box = document.getElementById("ric-campo");
  const note = [...box.querySelectorAll(".note")].map((n) => n.textContent.replace(/\s+/g, " ").trim());
  return { note, bottone: document.getElementById("btn-ric-verbale-prodotto")?.textContent.trim() || null,
    righe: [...box.querySelectorAll(".item")].map((i) => i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim()),
    divario: (box.textContent.match(/\(([\d.,]+) t\) non è uscito/) || [])[1] || null };
});
let vp = await leggiP();
dice(vp.bottone === "Scrivi il verbale", "sotto «Prodotto contro venduto» c'è il suo bottone «Scrivi il verbale»", vp.bottone);
dice(vp.righe.length === 0, "e nessuno storico: i verbali del cavato NON si mescolano con quelli del prodotto", vp.righe);
await pg.click("#btn-ric-verbale-prodotto"); await pg.waitForTimeout(400);
const testoModale = await pg.evaluate(() => (document.getElementById("modal-body") || document.querySelector(".modal") || document.body).textContent.replace(/\s+/g, " "));
dice(/prodotte e non uscite dal cancello/.test(testoModale) && /del dichiarato/.test(testoModale), "la modale parla in tonnellate e «del dichiarato», non in m³ del cavato", testoModale.slice(0, 200));
await pg.selectOption("#modal-campo", "stime-turno");
await pg.fill("#modal-nota", "i turni arrotondano a 50 t");
await pg.evaluate(() => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => /Salva/.test(x.textContent)); if (b) b.click(); });
await pg.waitForTimeout(900);
vp = await leggiP();
dice(vp.note.some((n) => /Verbale di questo periodo/.test(n) && /stime di fine turno/.test(n) && /arrotondano a 50 t/.test(n) && /lo stesso numero/.test(n)), "il verbale del prodotto è comparso con causa, nota e il numero di oggi che coincide", vp.note);
dice(vp.divario && vp.note.some((n) => n.includes(vp.divario + " t")), `e il numero salvato è quello sullo schermo (${vp.divario} t)`, vp.note);
dice(vp.righe.length === 1 && /stime di fine turno/.test(vp.righe[0]), "lo storico del prodotto ha la sua riga, e solo quella", vp.righe);
const vc = await leggi();
dice(vc.righe.length === 2, "lo storico del CAVATO è rimasto a due righe: il verbale del prodotto non ci è finito dentro", vc.righe);
dice(errori.length === 0, "nessun errore di pagina in tutto il giro", errori.slice(0, 3));

// ══ IL TERZO LATO (03/09) ═══════════════════════════════════════════════
// la lettura si allarga: la riga «terzo-lato» di ogni verbale dello storico,
// e il riquadro delle scorte sopra
const leggiT = () => pg.evaluate(() => {
  const box = document.getElementById("ric-verbale");
  const norm = (n) => (n ? n.textContent.replace(/\s+/g, " ").trim() : null);
  return {
    note: [...box.querySelectorAll(".note")].map((n) => ({ testo: norm(n), warn: n.classList.contains("warn") })),
    righe: [...box.querySelectorAll(".item")].map((i) => ({ nome: norm(i.querySelector(".name")), meta: norm(i.querySelector(".meta:not(.terzo-lato)")),
      scorte: norm(i.querySelector(".terzo-lato")), misurate: !!i.querySelector(".terzo-lato.misurate") })),
    bottone: document.getElementById("btn-ric-verbale")?.textContent.trim() || null,
    scorteBox: norm(document.getElementById("ric-scorte")), scorteNum: norm(document.querySelector("#ric-scorte .cassa-num")),
    riep: norm(document.getElementById("ric-riep")), dal: document.getElementById("ric-dal").value, al: document.getElementById("ric-al").value,
  };
});
const periodo = async (dal, al) => {
  await pg.evaluate(([a, b]) => { const d = document.getElementById("ric-dal"), f = document.getElementById("ric-al");
    d.value = a; d.dispatchEvent(new Event("change")); f.value = b; f.dispatchEvent(new Event("change")); }, [dal, al]);
  await pg.waitForTimeout(500);
};
const salvaVerbale = async (causa, nota) => {
  await pg.click("#btn-ric-verbale"); await pg.waitForTimeout(400);
  const modale = await pg.evaluate(() => (document.getElementById("modal-body") || document.querySelector(".modal") || document.body).textContent.replace(/\s+/g, " "));
  await pg.selectOption("#modal-campo", causa); await pg.fill("#modal-nota", nota);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => /Salva/.test(x.textContent)); if (b) b.click(); });
  await pg.waitForTimeout(900);
  return modale;
};
const nRighe = vc.righe.length;   // lo storico del cavato prima del terzo lato: 2
// uno scatto a 390 px (il telefono in cava) di un riquadro, e poi si torna a 430
const scatto = async (nome, id, blocco) => { if (!SCATTI) return; mkdirSync(OUT, { recursive: true });
  await pg.setViewportSize({ width: 390, height: 1100 }); await pg.waitForTimeout(250);
  await pg.evaluate(([i, b]) => document.getElementById(i)?.scrollIntoView({ block: b }), [id, blocco || "start"]);
  await pg.screenshot({ path: join(OUT, (CONTROPROVA ? "controprova-" : "") + nome + "-390.png") });
  await pg.setViewportSize({ width: 430, height: 950 }); await pg.waitForTimeout(250); };
// (a) il primo semestre: il triangolo chiude, e il verbale della dimostrazione lo sa già
await periodo("2026-01-01", "2026-06-30");
let vt = await leggiT();
dice(vt.scorteNum === "16,30 t" && /Il triangolo chiude a 55,20 t/.test(vt.scorteBox), "sul primo semestre il riquadro delle scorte dice Δ 16,30 t e scarto 55,20 t (il triangolo chiude)", { num: vt.scorteNum, box: vt.scorteBox?.slice(0, 160) });
dice(vt.note.length === 1 && /Verbale di questo periodo/.test(vt.note[0].testo) && /scorte erano misurate — cresciute di 16,30 t — e il triangolo chiudeva a 55,20 t \(attenzione/.test(vt.note[0].testo), "il verbale «vr1» della dimostrazione dice che allora le scorte erano misurate (+16,30 t) e lo scarto era 55,20 t, attenzione", vt.note[0]);
dice(/Terre di scavo fuori dal conto/.test(vt.note[0]?.testo || ""), "e nomina il materiale rimasto fuori dal conto delle scorte", vt.note[0]);
dice(/Oggi chiude allo stesso scarto/.test(vt.note[0]?.testo || "") && !vt.note[0]?.warn, "⛔ e oggi il triangolo chiude allo stesso scarto: il verbale d'esempio è coerente con i dati d'esempio", vt.note[0]);
const rVr1 = vt.righe.find((r) => /cumuli/.test(r.meta || "") && /01\/01\/2026 – 30\/06\/2026/.test(r.nome || ""));
dice(!!rVr1 && rVr1.misurate && rVr1.scorte === "scarto del triangolo 55,20 t, attenzione", "(b) nello storico la riga di «vr1» dice «scarto del triangolo 55,20 t, attenzione», su una riga sua", rVr1);
const modaleH1 = await salvaVerbale("cumulo", "ripresa dal cumulo di maggio, confermata dagli inventari");
dice(/scorte misurate/.test(modaleH1) && /chiude a 55,20 t/.test(modaleH1), "la modale dice che il verbale registra le scorte misurate e lo scarto", modaleH1.slice(0, 300));
vt = await leggiT();
dice(vt.righe.length === nRighe + 1, `lo storico del cavato è cresciuto di una riga (${nRighe} → ${vt.righe.length})`, vt.righe.map((r) => r.nome));
const nuovo = vt.righe.find((r) => /confermata dagli inventari/.test(r.meta || ""));
dice(!!nuovo && nuovo.misurate && nuovo.scorte === "scarto del triangolo 55,20 t, attenzione", "(a) il verbale appena scritto su H1 porta lo scarto del triangolo 55,20 t (le scorte SALVATE, rilette dallo storico)", nuovo);
dice(/scorte erano misurate — cresciute di 16,30 t — e il triangolo chiudeva a 55,20 t/.test(vt.note[0]?.testo || "") && /Oggi chiude allo stesso scarto/.test(vt.note[0]?.testo || "") && /2 verbali per questo periodo/.test(vt.note[0]?.testo || ""), "(a) e la testa rilegge dal record salvato Δscorte 16,30 t e scarto 55,20 t, uguali a oggi — è il secondo verbale del periodo", vt.note[0]);
await scatto("verbale-h1", "ric-verbale");
// (c) «Questo mese»: dal primo del mese a oggi, in ora locale
await pg.click("#btn-ric-mese"); await pg.waitForTimeout(600);
vt = await leggiT();
const attesi = await pg.evaluate(() => { const d = new Date(); const z = (n) => String(n).padStart(2, "0"); const o = `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; return [o.slice(0, 8) + "01", o]; });
dice(vt.dal === attesi[0] && vt.al === attesi[1], `«Questo mese» mette il periodo dal primo del mese a oggi (${attesi[0]} – ${attesi[1]})`, [vt.dal, vt.al]);
const fermoMese = !vt.bottone;
if (fermoMese) {
  dice(/Nel periodo non c'è nessun rilievo|Nessuna consegna nel periodo|Il cavato non arriva/.test(vt.riep || "") && vt.scorteBox === "" && vt.note.length === 0,
    "questo mese il confronto è FERMO (sulla dimostrazione il mese in corso non ha un rilievo): il riquadro lo dice, niente scorte e niente verbale da scrivere — resta solo lo storico", { riep: vt.riep?.slice(0, 120), scorte: vt.scorteBox, note: vt.note.length });
} else {
  dice(/restano stimate|Scorte a piazzale misurate/.test(vt.scorteBox || ""), "questo mese il confronto c'è: il riquadro delle scorte dice se sono misurate o perché restano stimate", vt.scorteBox?.slice(0, 160));
}
console.log(`  · «Questo mese» sulla dimostrazione, oggi: ${fermoMese ? "confronto fermo (nessun rilievo nel mese)" : "confronto aperto"}`);
await scatto("questo-mese", "ric-per");
// (c) un periodo in cui il confronto c'è ma il triangolo NON chiude: luglio → metà agosto (un solo inventario)
await periodo("2026-07-01", "2026-08-15");
vt = await leggiT();
dice(vt.bottone === "Scrivi il verbale" && /Le scorte a piazzale restano stimate/.test(vt.scorteBox || "") && /non c'è un secondo inventario/.test(vt.scorteBox || ""), "su luglio–metà agosto il riquadro dice che le scorte restano stimate, e perché (un solo inventario)", { bottone: vt.bottone, scorte: vt.scorteBox?.slice(0, 200) });
const modaleLug = await salvaVerbale("rilievo", "un solo inventario nel periodo");
dice(/restano stimate/.test(modaleLug) && /non c'è un secondo inventario/.test(modaleLug), "la modale dice che le scorte di questo periodo restano stimate, col motivo", modaleLug.slice(0, 300));
vt = await leggiT();
dice(vt.righe.length === nRighe + 2, `lo storico è cresciuto ancora (${vt.righe.length})`, vt.righe.map((r) => r.nome));
const lug = vt.righe.find((r) => /un solo inventario nel periodo/.test(r.meta || ""));
dice(!!lug && !lug.misurate && /^scorte stimate: nel periodo non c'è un secondo inventario/.test(lug.scorte || ""), "(c) ⛔ il verbale salva scorte: null col motivo, e lo storico dice «scorte stimate: nel periodo non c'è un secondo inventario…» — NON uno scarto a zero", lug);
dice(/Allora le scorte erano stimate: nel periodo non c'è un secondo inventario/.test(vt.note[0]?.testo || "") && !/chiudeva a/.test(vt.note[0]?.testo || ""), "e la testa del verbale lo dice con le stesse parole, senza nessuno scarto", vt.note[0]);
await scatto("verbale-stimate", "ric-scorte", "center");
// il verbale dell'ANNO scritto all'inizio del banco: sull'anno il triangolo chiude (terzo inventario, una stima) con −58,76 t
const anno = vt.righe.find((r) => /manca il volo di agosto/.test(r.meta || ""));
dice(!!anno && anno.misurate && anno.scorte === "scarto del triangolo 58,76 t, attenzione", "e il verbale dell'anno, scritto all'inizio del banco, porta lo scarto del triangolo dell'anno (58,76 t, attenzione): ogni verbale ha il SUO terzo lato", anno);
dice(vt.righe.every((r) => r.scorte && r.scorte !== "scorte non registrate nel verbale"), "nessun verbale della dimostrazione o del banco è rimasto senza il terzo lato registrato", vt.righe.map((r) => r.scorte));
dice(errori.length === 0, "nessun errore di pagina anche col terzo lato", errori.slice(0, 3));
if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.evaluate(() => document.getElementById("ric-verbale")?.scrollIntoView({ block: "center" })); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "controprova.png" : "verbale.png") });
  await pg.setViewportSize({ width: 390, height: 1100 }); await pg.waitForTimeout(300);
  await pg.evaluate(() => document.getElementById("ric-verbale")?.scrollIntoView({ block: "start" }));
  await pg.screenshot({ path: join(OUT, (CONTROPROVA ? "controprova" : "verbale") + "-storico-390.png") });
  await pg.setViewportSize({ width: 430, height: 950 }); }
await b.close(); srv.close();
console.log(`\nRisultato verbale di riconciliazione: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

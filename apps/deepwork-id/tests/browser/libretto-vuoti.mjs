/* IL LIBRETTO MACCHINA DI FLOTTA: QUELLO CHE IL FOGLIO NON DICE.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node libretto-vuoti.mjs [--porta=8607]
     node libretto-vuoti.mjs --controprova   (rimette i difetti veri: DEVE fallire)

   PERCHÉ ESISTE, e perché nessuna suite `node` poteva prenderlo. Il libretto
   macchina è la pagina che si stampa per un controllo e si consegna a chi
   compra la macchina; accanto c'è un bottone che ne esporta il CSV. I due
   documenti li COMPONE LA PAGINA, non il modulo — e le prove chiamano il
   modulo. Misurato aprendo davvero il file che esce, su una macchina appena
   inserita (nessuna scadenza, nessun giro, nessun intervento, nessun fermo,
   un pieno solo):

     · sullo SCHERMO il libretto dichiara sei volte quello che non c'è
       («Nessuna scadenza di legge», «Storico vuoto», «Mai ferma», e la
       riga che spiega perché il consumo all'ora non si può calcolare);
     · nel CSV dello STESSO libretto usciva un file di **quattro righe** —
       intestazione, anagrafica, il pieno, il totale d'officina — e basta.
       Chi lo apre non ha modo di distinguere «questa macchina non ha
       scadenze di legge» da «nessuno le ha registrate».

   È l'assenza scambiata per un dato favorevole nella sua forma più
   silenziosa: non un colore tranquillo, proprio una riga che non c'è.
   Lo stesso valeva per lo scadenzario di tutto il parco, il foglio che si
   gira al responsabile della sicurezza: elencava le scadenze registrate,
   quindi una macchina su cui nessuno ne ha mai scritta una **non compariva**.

   E una terza cosa, che si vede solo contando le righe: il libretto stampa
   gli ultimi otto giri, otto fermi e otto rifornimenti. Con dodici fermi si
   leggeva «12 fermi registrati» sopra otto righe, e dei giri non compariva
   nemmeno il totale. Un totale che non torna con le righe che ha sotto è
   peggio di un totale assente: sembra un errore di chi legge.

   I casi si costruiscono NEI DATI SERVITI (si aggiunge roba a `DEMO` nella
   risposta HTTP del modulo), mai sul disco: mentre questo banco gira, gli
   altri cantieri lavorano. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8607;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

let iniezioni = 0;
const rimetti = (testo, ancora, difetto) => {
  const n = testo.split(ancora).length - 1;
  if (n !== 1) { console.log(`⚠️ ancora trovata ${n} volte, non 1: «${ancora.slice(0, 46)}…»`); return testo; }
  iniezioni++;
  return testo.replace(ancora, difetto);
};

const OGGI = new Date().toISOString().slice(0, 10);
/* I casi, aggiunti in coda al modulo dati che il browser scarica. `DEMO` è
   un `const` ma è un OGGETTO: mutarlo è lecito, e `flottaData()` ne fa una
   copia profonda quando la pagina lo chiede — cioè dopo. */
const CASI = `
DEMO.mezzi.push({ id: "x9", nome: "Pala X9 — Nuova", ore: 12, area: "", stato: "operativo", tipo: "pala" });
DEMO.rifornimenti.push({ id: "rx", data: "${OGGI}", mezzo: "Pala X9", litri: 300, euro: 450, ore: 10, nota: "", costoId: null });
for (let i = 0; i < 12; i++) DEMO.fermi.push({ id: "fz" + i, mezzo: "Pala P1", causale: "gomme-cingoli",
  inizio: "2026-06-" + String(i + 1).padStart(2, "0"), fine: "2026-06-" + String(i + 2).padStart(2, "0"), note: "" });
for (let i = 0; i < 12; i++) DEMO.controlli.push({ id: "gz" + i, data: "2026-07-" + String(i + 1).padStart(2, "0"),
  mezzo: "Pala P1", operatore: "Luca", ore: 6500 + i, anomalie: 0, note: "",
  voci: [{ chiave: "luci", etichetta: "Luci", esito: "ok", nota: "", critica: false }] });
`;

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js")) corpo = Buffer.from(corpo.toString("utf8") + CASI, "utf8");
  if (CONTROPROVA && p.endsWith("apps/flotta/index.html")) {
    let t = corpo.toString("utf8");
    /* Difetto 1 — le sezioni vuote del libretto tornano a tacere. Si toglie
       la sola cosa che le fa parlare: la funzione che scrive la riga. */
    t = rimetti(t, 'const VUOTA = (sez, frase) => R(sez, "nessuna registrata", "", frase, null);',
                   "const VUOTA = () => {};");
    /* Difetto 2 — il consumo non calcolabile torna a sparire dal file
       invece di dire perché. */
    t = rimetti(t, '    R("consumo", "litri per ora", "", !f.consumo',
                   '    if (f.consumo && f.consumo.litriOra != null) R("consumo", "litri per ora", "", !f.consumo');
    /* Difetto 3 — gli elenchi tagliati a otto tornano a non dirlo. */
    t = rimetti(t, "  const restoLibretto = (tot) => tot > RIGHE_LIBRETTO",
                   "  const restoLibretto = (tot) => false");
    /* Difetto 4 — lo scadenzario del parco torna a far sparire i mezzi su
       cui nessuno ha registrato nessuna scadenza. */
    t = rimetti(t, "    const scoperti = MEZ.map(m => nomeBreve(m.nome)).filter(n => n && !coperti.has(n));",
                   "    const scoperti = [];");
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
/* ⛔ LA PORTA OCCUPATA NON SI RIUSA IN SILENZIO. Un banco che trova la porta
   presa e ci si appoggia misura la copia di qualcun altro e stampa verde.
   Qui il server è nostro, quindi `listen` fallisce — ma va DETTO, non lasciato
   morire con una traccia di stack che nel riepilogo del giro non si legge. */
srv.on("error", (e) => {
  console.log(`✗ non riesco ad alzare il server sulla porta ${PORTA}: ${e.code || e.message}. Il banco NON ha misurato niente.`);
  process.exit(2);
});
await new Promise((r) => srv.listen(PORTA, r));

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport: { width: 390, height: 950 }, locale: "it-IT", acceptDownloads: true });
const pg = await ctx.newPage();
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
await pg.waitForTimeout(2400);

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 220)}` : ""}`); } };

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

/* Il caso è arrivato? Un banco che misura la demo di serie credendo di
   misurare il proprio caso risponde «tutto a posto» senza aver guardato. */
const arrivato = await pg.evaluate(() =>
  [...document.querySelectorAll("#mez-list .item")].some(e => e.textContent.includes("Pala X9")));
if (!arrivato) { console.log("  ✗ il caso NON è arrivato nella pagina: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }

/* Il CSV si prende PREMENDO IL BOTTONE e aprendo il file che esce: un
   censimento statico su questa famiglia risponde zero. */
async function csvDi(nomeMezzo, bottone, apri = true) {
  if (apri) {
    await pg.evaluate((n) => {
      const r = [...document.querySelectorAll("#mez-list .item")].find(e => e.textContent.includes(n));
      if (r) r.querySelector("[data-scheda-mezzo]").click();
    }, nomeMezzo);
    await pg.waitForTimeout(800);
  }
  const attesa = pg.waitForEvent("download", { timeout: 9000 });
  await pg.click(bottone);
  const d = await attesa;
  const f = await d.createReadStream();
  let testo = "";
  for await (const c of f) testo += c;
  return testo.replace(/^﻿/, "").split("\r\n");
}

// ── 1. LA MACCHINA NUDA: ogni sezione del CSV dice la sua ─────────────────
const nude = await csvDi("Pala X9", "#btn-sch-csv");
const sezioni = {};
for (const r of nude.slice(1)) { const s = (r.split(";")[0] || "").replace(/^"|"$/g, ""); if (s) sezioni[s] = (sezioni[s] || 0) + 1; }
const ATTESE = ["mezzo", "scadenza di legge", "manutenzione in programma", "intervento",
                "fermo macchina", "giro macchina", "rifornimento", "consumo",
                "totale officina", "totale fermi"];
for (const s of ATTESE)
  dice(sezioni[s] > 0, `⛔ il libretto della macchina nuda ha comunque la sezione «${s}»`, Object.keys(sezioni));
dice(!nude.some(r => /;regolare;|;conforme;|;a posto;/i.test(r)),
  "e non chiama «regolare» nessuna sezione che nessuno ha compilato",
  nude.filter(r => /regolare|conforme/i.test(r)));
const rigaConsumo = nude.find(r => r.startsWith("consumo"));
dice(/[Nn]on calcolabile/.test(rigaConsumo || ""),
  "⛔ e il consumo che non si può calcolare lo DICHIARA invece di sparire", rigaConsumo);
dice(/second[oa] rifornimento|contatore/.test(rigaConsumo || ""),
  "dicendo anche perché non si può calcolare", rigaConsumo);

// ── 2. SCHERMO E FOGLIO NON SI SMENTISCONO ───────────────────────────────
const aSchermo = await pg.evaluate(() => ["sch-sca", "sch-man", "sch-int", "sch-fer", "sch-giri"]
  .filter(id => { const e = document.getElementById(id); return e && e.querySelector(".empty-state"); }));
dice(aSchermo.length === 5,
  "sullo schermo le cinque sezioni vuote lo dichiarano tutte", aSchermo);
dice(aSchermo.length === ATTESE.filter(s => (nude.find(r => r.startsWith(s)) || "").includes("nessuna registrata")).length,
  "⛔ e il foglio ne dichiara esattamente altrettante: nessuna tace solo lì",
  { schermo: aSchermo.length, foglio: nude.filter(r => r.includes("nessuna registrata")).length });

// ── 3. GLI ELENCHI TAGLIATI A OTTO LO DICONO ─────────────────────────────
await pg.click("#btn-sch-back").catch(() => {});
await pg.waitForTimeout(500);
await pg.evaluate(() => {
  const r = [...document.querySelectorAll("#mez-list .item")].find(e => e.textContent.includes("Pala P1"));
  if (r) r.querySelector("[data-scheda-mezzo]").click();
});
await pg.waitForTimeout(900);
const tagli = await pg.evaluate(() => {
  const q = (id) => { const e = document.getElementById(id); return e ? {
    righe: e.querySelectorAll(".item").length,
    note: [...e.querySelectorAll(".note")].map(n => n.textContent.replace(/\s+/g, " ").trim()) } : null; };
  return { fer: q("sch-fer"), giri: q("sch-giri") };
});
/* Il totale NON si scrive a mano nel banco: la demo cambia, e un numero
   copiato qui invecchia in silenzio. Si pretende che le DUE frasi della
   sezione — il riepilogo in cima e l'avviso in coda — dicano lo STESSO
   numero, e che quel numero sia maggiore delle righe stampate. È la sola
   cosa che conta: un totale che non torna con le righe che ha sotto. */
for (const k of ["fer", "giri"]) {
  const t = tagli[k] || { righe: 0, note: [] };
  const testo = t.note.join(" · ");
  const coda = /ultimi (\d+) di (\d+)/.exec(testo);
  const cima = /(\d+) (?:fermi registrati|giri macchina registrati)/.exec(testo);
  dice(t.righe === 8, `il libretto stampa 8 righe di «${k}»`, t.righe);
  dice(!!coda && Number(coda[1]) === t.righe && Number(coda[2]) > t.righe,
    `⛔ «${k}»: l'elenco tagliato DICE quante righe mostra e quante ce ne sono`, testo);
  dice(!!cima && !!coda && cima[1] === coda[2],
    `⛔ «${k}»: il riepilogo in cima e l'avviso in coda dicono lo stesso totale`,
    { cima: cima && cima[1], coda: coda && coda[2] });
}
dice(/\d+ giri macchina registrati/.test(tagli.giri.note.join(" ")),
  "⛔ e dei giri macchina compare il totale, che prima non c'era da nessuna parte", tagli.giri.note);

// ── 4. LO SCADENZARIO DEL PARCO NON FA SPARIRE UN MEZZO ──────────────────
await pg.click("#btn-sch-back").catch(() => {});
await pg.waitForTimeout(400);
await pg.click("#nav-sca").catch(() => {});
await pg.waitForTimeout(700);
const sca = await csvDi(null, "#btn-sca-csv", false);
const mezziNelFoglio = new Set(sca.slice(1).map(r => (r.split(";")[0] || "").replace(/^"|"$/g, "")).filter(Boolean));
/* Il nome nel foglio è quello BREVE («Escavatore E1»), non quello del parco
   («Escavatore E1 — CAT 352»): è la convenzione di `nomeBreve`, e un banco
   che confrontasse le due forme griderebbe al difetto su un foglio sano. */
const parco = await pg.evaluate(() => [...document.querySelectorAll("#mez-list .item .name")]
  .map(e => e.textContent.split(" — ")[0].trim()));
const fuori = parco.filter(n => n && !mezziNelFoglio.has(n));
dice(fuori.length === 0,
  "⛔ nello scadenzario che si porta al controllo c'è OGNI mezzo del parco, anche quelli senza nessuna scadenza",
  { fuori, nelFoglio: [...mezziNelFoglio] });
dice(sca.some(r => r.includes("nessuna registrata")),
  "e quelli scoperti sono marcati «nessuna registrata», non «regolare»",
  sca.filter(r => /nessuna registrata|regolare/.test(r)).slice(0, 3));

dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} sostituzioni nella risposta HTTP (attese 4)`);
  if (iniezioni !== 4) { console.log("⚠️ INIEZIONI MANCANTI: la controprova non prova niente"); process.exit(3); }
  console.log(ko >= 8
    ? "✓ il banco SA fallire: sezioni vuote che tacciono, consumo non calcolabile sparito, elenchi tagliati senza dirlo, mezzi scoperti fuori dallo scadenzario"
    : "⚠️ troppo poche cadute: il banco non guarda dove crede");
  process.exit(ko >= 8 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

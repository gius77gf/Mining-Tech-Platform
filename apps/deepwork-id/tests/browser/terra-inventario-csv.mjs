/* TERRA: IL FILE DEGLI INVENTARI CHE ESCE E CHE RIENTRA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-inventario-csv.mjs                 (porta effimera, mai 8823)
     node terra-inventario-csv.mjs --controprova   (rimette i difetti: DEVE fallire)
     node terra-inventario-csv.mjs --scatti        (scatto a 390 px in DW_SCATTI)

   PERCHÉ ESISTE. `csvInventari` e `parseInventariCsv` sono pure e provate in
   `run-kpi.mjs`; quello che una suite `node` non vede è il bottone — che il
   file esca davvero, col nome marchiato in dimostrazione, e che il TESTO
   uscito dal bottone sia quello che il lettore sa rileggere. Poi il verso del
   ritorno: «Carica inventari» con un file che ha una virgola decimale, un
   volume illeggibile e una data che non esiste, e il messaggio che dice QUALI
   righe non sono entrate. Il file scaricato si intercetta come fa
   `csv-dimostrazione.mjs`: si aggancia `click()` dell'ancora e si legge
   l'`href` — il corpo è un `data:` e si decodifica.
   ⚠️ Il conto delle righe attese è DERIVATO dalla dimostrazione (una riga per
   cumulo, `DEMO.inventari`), non scritto a mano: un banco col numero dentro
   invecchia col crescere della demo. E il modulo letto qui da `node` è quello
   del disco: in controprova il difetto sta nella copia SERVITA, quindi il
   lettore sano legge un file guasto — ed è così che lo vede.
   La controprova rimette tre difetti — il volume `null` scritto come 0,
   l'intestazione con un nome di colonna diverso, il riepilogo del caricamento
   che tace le righe perse — e il banco DEVE cadere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = process.env.DW_SCATTI || "/tmp/terra-inventario-csv";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const MARCHIO = "DATI-DI-ESEMPIO_";

const DIFETTI = [
  // il volume «non misurato» scritto come 0: rientrerebbe come un cumulo misurato
  ["apps/terra/terra-data.js",
   'v == null ? "" : String(v), csvCell(c.nota || ""), csvCell(inv.id || "")].join(";"));',
   'String(v ?? 0), csvCell(c.nota || ""), csvCell(inv.id || "")].join(";"));   /* difetto rimesso dal banco */'],
  // l'intestazione con un nome di colonna che il lettore non riconosce
  ["apps/terra/terra-data.js",
   'export const INTESTAZIONE_INVENTARI = "data;metodo;materiale;volumeM3;nota;inventarioId";',
   'export const INTESTAZIONE_INVENTARI = "data;metodo;materiale;volume;nota;inventarioId";   /* difetto rimesso dal banco */'],
  // il riepilogo del caricamento che tace le righe perse
  ["apps/terra/index.html",
   '+ frasePersi({ persi: persiInv }),\n      persiInv.length || nonMis ? "warn" : undefined);',
   '+ "",   /* difetto rimesso dal banco */\n      persiInv.length || nonMis ? "warn" : undefined);'],
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
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

/* il modulo DEL DISCO: la demo da cui derivare i conti, e il lettore sano */
const terra = await import(join(R, "apps/terra/terra-data.js"));
const DEMO_INV = terra.DEMO.inventari;
const righeAttese = DEMO_INV.reduce((s, i) => s + i.cumuli.length, 0);
/* la demo con i cumuli nell'ordine in cui il file li scrive (per materiale):
   è il solo campo in cui il giro non promette l'identità */
const demoComeNelFile = DEMO_INV.map((i) => ({ ...i, cumuli: [...i.cumuli].sort((a, b) => terra.chiaveMateriale(a.materiale).localeCompare(terra.chiaveMateriale(b.materiale), "it")) }))
  .sort((a, b) => b.data.localeCompare(a.data));

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 600) : ""}`); } };
const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript(() => {
  window.__usciti = [];
  const vero = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__usciti.push({ nome: this.download, href: String(this.href) }); return; }
    return vero.apply(this, arguments);
  };
});
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("inv-list")?.innerHTML.length || 0) > 0); }
await vaiA(pg, "terra", "nav-ril");
dice(pronto, "la lista degli inventari è stata disegnata (la pagina è in dimostrazione)");
const righeInv = () => pg.evaluate(() => [...document.querySelectorAll("#inv-list .item")].map((i) => ({ id: i.getAttribute("data-inv"), nome: i.querySelector(".name")?.textContent.trim(), meta: i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim() })));
const esitoInv = () => pg.evaluate(() => document.getElementById("inv-esito")?.textContent).then(norm);
const usciti = () => pg.evaluate(() => window.__usciti);
const testoDi = (u) => decodeURIComponent(u.href.replace(/^data:[^,]*,/, "")).replace(/^﻿/, "");

/* ── 1. il bottone, e il file che esce ───────────────────────────────── */
const bott = await pg.evaluate(() => {
  const e = document.getElementById("btn-exp-inv"), i = document.getElementById("btn-imp-inv");
  const r = e?.getBoundingClientRect(), ri = i?.getBoundingClientRect();
  return { esc: e?.textContent.trim(), imp: i?.textContent.trim(), w: r?.width, h: r?.height, wi: ri?.width, hi: ri?.height,
    tools: e?.parentElement?.className, fratelli: [...(e?.parentElement?.children || [])].map((x) => x.tagName + "#" + x.id) };
});
dice(bott.esc === "Scarica inventari (CSV)" && bott.imp === "Carica inventari (CSV)", "i due bottoni stanno nella lista degli inventari con la stessa forma di quelli dei rilievi", bott);
dice(/\btools\b/.test(bott.tools || "") && bott.fratelli.join(",") === "BUTTON#btn-add-inv,BUTTON#btn-imp-inv,BUTTON#btn-exp-inv,INPUT#inv-file", "nella stessa barra `.tools` di «Nuovo inventario», con l'input nascosto accanto", bott.fratelli);
dice(bott.h >= 44 && bott.hi >= 44, "i bersagli di tocco sono alti almeno 44 px", [bott.h, bott.hi]);
if (SCATTI) {
  mkdirSync(OUT, { recursive: true });
  await pg.evaluate(() => { document.getElementById("inv-count")?.previousElementSibling?.scrollIntoView({ block: "start" }); window.scrollBy(0, -72); });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: join(OUT, CONTROPROVA ? "lista-controprova.png" : "lista.png") });
}
await pg.click("#btn-exp-inv"); await pg.waitForTimeout(400);
let u = await usciti();
dice(u.length === 1, `premendo «Scarica inventari» esce UN file (${u.length})`, u.map((x) => x.nome));
const f1 = u[0] || { nome: "", href: "data:," };
dice(f1.nome === MARCHIO + "terra_inventari.csv", "in dimostrazione il nome porta il marchio: DATI-DI-ESEMPIO_terra_inventari.csv", f1.nome);
const t1 = testoDi(f1);
const righe1 = t1.split("\n").filter(Boolean);
dice(righe1[0] === "data;metodo;materiale;volumeM3;nota;inventarioId", "la prima riga è l'intestazione data;metodo;materiale;volumeM3;nota;inventarioId", righe1[0]);
dice(righe1.length - 1 === righeAttese, `una riga per cumulo: ${righeAttese} righe di dati per i ${DEMO_INV.length} inventari della dimostrazione (${righe1.length - 1})`, righe1.slice(0, 4));
dice(/^2026-08-30;stima;Sabbia lavata 0\/4;;Cumulo in lavorazione: non misurato;i3$/m.test(t1), "il cumulo non misurato ha la cella del volume VUOTA, con la sua nota accanto — non «0»", righe1.filter((r) => /Sabbia lavata/.test(r)));
dice(!/;0;/.test(t1), "nessuna riga porta uno zero al posto di un volume non misurato", righe1.filter((r) => /;0;/.test(r)));
dice(righe1.slice(1).every((r) => r.split(";").length === 6), "ogni riga ha sei celle", righe1.filter((r) => r.split(";").length !== 6));
dice(righe1[1].startsWith("2026-08-30;") && righe1[righe1.length - 1].startsWith("2025-12-29;"), "dal più recente (30/08/2026) al più vecchio (29/12/2025)", [righe1[1], righe1[righe1.length - 1]]);
const es1 = await esitoInv();
dice(new RegExp(`Scaricati ${DEMO_INV.length} inventari \\(${righeAttese} cumuli, una riga per cumulo\\) nel formato che questa pagina sa ri-caricare`).test(es1), "il messaggio dice quanti inventari e quanti cumuli, e che il file rientra", es1);

/* ── 2. andata e ritorno: il testo uscito, riletto dal lettore del disco ── */
const giro = terra.parseInventariCsv(t1);
dice(giro.letti === righeAttese && giro.scarti.length === 0, `il lettore legge ${righeAttese} righe e non ne scarta nessuna`, { letti: giro.letti, scarti: giro.scarti });
dice(JSON.stringify(giro.inventari) === JSON.stringify(demoComeNelFile), "rileggendo il testo tornano i 3 inventari della demo, identici su id, data, metodo, materiale, volume e nota", { fuori: giro.inventari, dentro: demoComeNelFile });
const sabbia = giro.inventari.find((i) => i.id === "i3")?.cumuli.find((c) => /Sabbia/.test(c.materiale));
dice(sabbia && sabbia.volumeM3 === null && /in lavorazione/.test(sabbia.nota || ""), "e la sabbia del 30/08 torna «non misurata» (null), non 0", sabbia);

/* ── 3. un decimale: si registra 3.100,5 dalla finestra, e nel file esce col PUNTO ── */
await pg.click("#btn-add-inv"); await pg.waitForTimeout(400);
await pg.fill("#inv-righe .inv-riga:nth-child(1) .inv-mat", "Stabilizzato 0/30");
await pg.fill("#inv-righe .inv-riga:nth-child(1) .inv-vol", "3.100,5");
await pg.click("#modal-foot .mbtn.primary"); await pg.waitForTimeout(600);
let righe = await righeInv();
dice(righe.length === DEMO_INV.length + 1, `registrato un inventario con un volume decimale: la lista ne ha ${DEMO_INV.length + 1} (${righe.length})`, righe.map((r) => r.nome));
await pg.click("#btn-exp-inv"); await pg.waitForTimeout(400);
u = await usciti();
const t2 = u.length === 2 ? testoDi(u[1]) : "";
dice(u.length === 2 && /;Stabilizzato 0\/30;3100\.5;;/.test(t2), "nel file il volume 3.100,5 esce «3100.5»: il punto decimale, per chi lo apre con un altro programma", t2.split("\n").slice(0, 3));
dice(!/3100,5|3\.100,5/.test(t2), "e mai con la virgola", t2.split("\n").filter((r) => /3100,5|3\.100,5/.test(r)));
dice(t2.split("\n").filter(Boolean).length - 1 === righeAttese + 1, "una riga in più nel file: quella del nuovo cumulo", t2.split("\n").length);

/* ── 4. il ritorno dalla pagina: «Carica inventari» ──────────────────── */
const CSV_IN = [
  "data;metodo;materiale;volumeM3;nota;inventarioId",
  "2026-01-15;topografico;Ghiaia 16/32;1250,5;;a1",          // virgola decimale: entra
  "2026-01-15;topografico;Sabbia lavata 0/4;;in lavorazione;a1",   // vuoto: non misurato, entra
  "2026-01-15;topografico;Pietrisco 8/12;abc;;a1",           // illeggibile: scartata
  "2026-02-30;drone;Ghiaia 16/32;100;;a2",                   // la data non esiste: scartata
  "",
].join("\n");
await pg.setInputFiles("#inv-file", { name: "inventari.csv", mimeType: "text/csv", buffer: Buffer.from(CSV_IN, "utf8") });
await pg.waitForTimeout(800);
righe = await righeInv();
dice(righe.length === DEMO_INV.length + 2, `dopo il caricamento la lista ne ha ${DEMO_INV.length + 2}: un inventario del file è entrato (${righe.length})`, righe.map((r) => r.nome));
const nuova = righe.find((r) => /15\/01\/2026/.test(r.nome || ""));
dice(!!nuova && /1 cumulo non misurato su 2/.test(nuova.meta || "") && /1\.250,5 m³/.test(nuova.meta || ""), "la riga del 15/01/2026 dice «1 cumulo non misurato su 2» e 1.250,5 m³ (la virgola è stata letta)", nuova);
const es4 = await esitoInv();
dice(/Lette 4 righe del file: 1 inventario aggiunto \(2 cumuli, di cui 1 cumulo non misurato\)/.test(es4), "il riepilogo dice righe lette, inventari e cumuli entrati, e il non misurato", es4);
dice(/2 righe del file non sono entrate: «riga 4» perché il volume non si legge; «riga 5» perché la data non esiste/.test(es4), "e nomina le DUE righe perse con la ragione di ognuna (mai «0 scartati» detto a occhio)", es4);
/* lo stesso file una seconda volta: niente doppioni */
await pg.setInputFiles("#inv-file", { name: "inventari.csv", mimeType: "text/csv", buffer: Buffer.from(CSV_IN, "utf8") });
await pg.waitForTimeout(800);
dice((await righeInv()).length === DEMO_INV.length + 2, "ricaricando lo stesso file la lista non cresce");
const es5 = await esitoInv();
dice(/1 già presente \(saltato\)/.test(es5) && /0 inventari aggiunti/.test(es5), "e il messaggio dice «1 già presente (saltato)»", es5);
/* il file di un'altra tabella: quello dei rilievi non entra fra gli inventari */
await pg.setInputFiles("#inv-file", { name: "rilievi.csv", mimeType: "text/csv", buffer: Buffer.from("data;volumeM3;metodo;gsd;fronte;provenienza\n2026-03-01;1200;drone;;Nord;scavo\n", "utf8") });
await pg.waitForTimeout(800);
const es6 = await esitoInv();
dice(/Questo sembra l'export dei rilievi di Terra/.test(es6) && (await righeInv()).length === DEMO_INV.length + 2, "il file dei rilievi viene riconosciuto e rifiutato, e la lista non cambia", es6);
/* un file senza nessuna riga buona */
await pg.setInputFiles("#inv-file", { name: "vuoto.csv", mimeType: "text/csv", buffer: Buffer.from("data;metodo;materiale;volumeM3;nota;inventarioId\n2026-02-30;drone;Ghiaia;1;;z\n", "utf8") });
await pg.waitForTimeout(800);
const es7 = await esitoInv();
dice(/Nessun inventario è entrato: le colonne sono data; metodo; materiale; volumeM3; nota; inventarioId/.test(es7) && /«riga 2» perché la data non esiste/.test(es7), "con nessuna riga buona dice le colonne attese e la riga persa", es7);
dice(errori.length === 0, "nessun errore di pagina (letto DOPO i bottoni)", errori.slice(0, 3));

await b.close(); srv.close();
if (CONTROPROVA) console.log(`iniezioni: ${difettiRimessi.size} difetti su ${DIFETTI.length} rimessi nella risposta HTTP`);
console.log(`\nRisultato file degli inventari: ${ok} passati, ${ko} falliti  ·  ${ok + ko} prove`);
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log("✗ CONTROPROVA NON VALIDA: non tutti i difetti sono stati rimessi"); process.exit(1); }
  console.log(ko ? "✔ CONTROPROVA OK: coi difetti rimessi il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue");
  process.exit(ko ? 0 : 1);
}
process.exit(ko ? 1 : 0);

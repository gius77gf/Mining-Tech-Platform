/* L'IMPORT DXF IN SOLA LETTURA (G47d, 14/09) — L'ULTIMA FETTA DI "GENESI
   SIMILE A UN CAD" (G47, il fondatore ha risposto "tutto").
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-dxf-import.mjs [--porta=8763]
     node genesi-dxf-import.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE, E PERCHÉ È FATTA COSÌ. La ricerca del 13/09
   (docs/RICERCA_CONTINUA_GENESI.md) ha cercato come i software commerciali
   di blast design evitano l'errore di convenzione degli assi quando
   importano un file esterno — e non ne ha trovato uno che validi
   ESPLICITAMENTE la convenzione prima di fidarsi della geometria per un
   calcolo di burden/sicurezza (solo difese indirette: associazione al
   foro più vicino, tolleranze). La scelta qui non è costruire quella
   validazione (un progetto a sé, rischioso da fare a metà): è TOGLIERE il
   rischio alla radice. Un file DXF importato diventa SOLO `D2.tratti` — la
   stessa entità 2D senza semantica di prodotto introdotta da G47c-2 — MAI
   fori, fronte o piede. Un tratto non entra in NESSUN calcolo (relief,
   energia, burden, flyrock): un orientamento sbagliato si VEDE (il
   tratteggio dei tratti importati, l'avviso esplicito) e si annulla con
   Ctrl+Z, non produce mai un numero sbagliato.

   COSA GUARDA: che un file con LINE + POLYLINE + entità di fori (CIRCLE/
   TEXT, come il nostro stesso export G33) porti dentro SOLO i tratti, mai
   i cerchi dei fori; che un'importazione di più entità sia UN'unica
   operazione annullabile (Ctrl+Z toglie tutto l'import in un colpo solo,
   non un tratto alla volta — chi importa un file sbagliato non deve
   premere annulla N volte); e che l'avviso sulla convenzione degli assi
   compaia davvero, non solo nel testo del bottone. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8763;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: l'import smette di essere UN'unica operazione
   annullabile — ogni tratto importato pusha la propria voce in cronologia
   invece di condividerne una sola. Silenzioso: l'import funziona uguale,
   solo che annullarlo richiede un Ctrl+Z per tratto invece di uno solo —
   fastidioso per chi importa un file con decine di entità e sbaglia
   l'orientamento. */
const DIFETTI = [
  [`d2PushUndo();\n  tratti.forEach(t=> D2.tratti.push({ pts:t.pts, aperto:false, origine:'dxf' }));`,
   `tratti.forEach(t=>{ d2PushUndo(); D2.tratti.push({ pts:t.pts, aperto:false, origine:'dxf' }); });`],
  /* gli archi (26/11): la pagina smette di dire che sono entrati come spezzate */
  [`if(letto.archiSpezzati) righe.push(`, `if(false) righe.push(`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-dxf-import-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-dxf-import-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

/* un DXF con GEOMETRIA DI FORI (CIRCLE/TEXT, come il nostro export G33) più
   una LINE e una POLYLINE: se l'import prendesse tutte le entità invece di
   filtrare, i fori finirebbero fra i tratti. */
const DXF_PROVA = [
  "0", "SECTION", "2", "ENTITIES",
  "0", "CIRCLE", "8", "FORI", "10", "0.0", "20", "3.0", "30", "0.0", "40", "0.05",
  "0", "TEXT", "8", "FORI", "10", "0.1", "20", "3.0", "30", "0.0", "40", "0.04", "1", "1",
  "0", "LINE", "8", "IMPORT", "10", "2.0", "20", "10.0", "30", "0.0", "11", "30.0", "21", "10.0", "30", "0.0",
  "0", "POLYLINE", "8", "IMPORT", "66", "1", "70", "0",
  "0", "VERTEX", "8", "IMPORT", "10", "5.0", "20", "6.0", "30", "0.0",
  "0", "VERTEX", "8", "IMPORT", "10", "15.0", "20", "4.0", "30", "0.0",
  "0", "VERTEX", "8", "IMPORT", "10", "25.0", "20", "7.0", "30", "0.0",
  "0", "SEQEND",
  "0", "ENDSEC", "0", "EOF",
].join("\n");

async function apriDesign() {
  const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  const scadenza = Date.now() + 25000;
  while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
  await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="design"]');
  await pg.waitForTimeout(600);
  return pg;
}

console.log(`\n════════ Genesi: l'import DXF come tratti (G47d)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await apriDesign();
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

const nForiPrima = await pg.evaluate(() => window.__genesi.D2.holes.length);
const nTrattiPrima = await pg.evaluate(() => window.__genesi.D2.tratti.length);

const percorso = join(R, "__genesi-dxf-import-prova-" + process.pid + ".dxf");
writeFileSync(percorso, DXF_PROVA);
try {
  await pg.setInputFiles("#dxfImportFile", percorso);
  await pg.waitForTimeout(400);

  const nForiDopo = await pg.evaluate(() => window.__genesi.D2.holes.length);
  dice(nForiDopo === nForiPrima, `⛔ il CIRCLE/TEXT del foro NON diventa un foro (fori: ${nForiPrima} -> ${nForiDopo})`, nForiDopo);

  const tratti = await pg.evaluate(() => window.__genesi.D2.tratti);
  /* ⏱️ fino al 26/11 erano DUE: il cerchio del foro restava fuori. Da quando il
     lettore legge archi e cerchi entra anche lui — come CONTORNO, un tratto di
     riferimento: la riga qui sopra pretende che non diventi mai un foro. */
  dice(tratti.length === nTrattiPrima + 3, `LINE + POLYLINE + il cerchio diventano TRE tratti: il cerchio entra come contorno, non come foro (${nTrattiPrima} -> ${tratti.length})`, tratti.length);
  const importati = tratti.slice(-2);
  dice(importati.every((t) => t.origine === "dxf"), "i tratti importati portano origine:'dxf' (per il tratteggio in disegno)", importati.map((t) => t.origine));
  dice(importati[0].pts.length === 2 && importati[1].pts.length === 3,
    `i punti sono quelli veri del file (LINE: 2 punti, POLYLINE: 3 punti — letti: ${importati[0]?.pts.length}, ${importati[1]?.pts.length})`,
    importati);

  const avviso = await pg.evaluate(() => document.getElementById("d2-dxf-import-esito").innerText);
  dice(/orientamento/i.test(avviso), "l'avviso sulla convenzione di assi compare davvero (non solo nel titolo del bottone)", avviso.slice(0, 60));

  /* IL CASO CHE CONTA: un solo Ctrl+Z toglie TUTTO l'import (due tratti),
     non un tratto alla volta. */
  await pg.keyboard.press("Control+z");
  await pg.waitForTimeout(200);
  const dopoUnCtrlZ = await pg.evaluate(() => window.__genesi.D2.tratti.length);
  dice(dopoUnCtrlZ === nTrattiPrima, `⛔ UN Ctrl+Z toglie l'intero import, non un tratto alla volta (atteso ${nTrattiPrima}, letto ${dopoUnCtrlZ})`, dopoUnCtrlZ);
} finally { try { unlinkSync(percorso); } catch (e) {} }

/* un file senza niente di leggibile non deve aggiungere niente, e deve dirlo */
{
  const percorsoVuoto = join(R, "__genesi-dxf-import-vuoto-" + process.pid + ".dxf");
  writeFileSync(percorsoVuoto, "questo non è un DXF");
  try {
    const n0 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    await pg.setInputFiles("#dxfImportFile", percorsoVuoto);
    await pg.waitForTimeout(400);
    const n1 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    dice(n1 === n0, `un file senza LINE/POLYLINE leggibili non aggiunge tratti (${n0} -> ${n1})`, n1);
  } finally { try { unlinkSync(percorsoVuoto); } catch (e) {} }
}

/* ⛔ 19/09, dal quarto giro di deep-pass QA: LWPOLYLINE (l'entità polilinea
   di DEFAULT di AutoCAD dal R14/1997, LibreCAD e QCAD) non era riconosciuta
   — un file con SOLA LWPOLYLINE dava "il file non contiene LINE o POLYLINE
   leggibili", falso: la geometria c'era, solo in un formato non letto. */
{
  const DXF_LW = ["0", "SECTION", "2", "ENTITIES",
    "0", "LWPOLYLINE", "8", "IMPORT", "90", "3", "70", "0",
    "10", "5.0", "20", "6.0", "10", "15.0", "20", "4.0", "10", "25.0", "20", "7.0",
    "0", "ENDSEC", "0", "EOF"].join("\n");
  const percorsoLw = join(R, "__genesi-dxf-import-lw-" + process.pid + ".dxf");
  writeFileSync(percorsoLw, DXF_LW);
  try {
    const n0 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    await pg.setInputFiles("#dxfImportFile", percorsoLw);
    await pg.waitForTimeout(400);
    const tratti = await pg.evaluate(() => window.__genesi.D2.tratti);
    dice(tratti.length === n0 + 1, `una LWPOLYLINE isolata diventa un tratto (${n0} -> ${tratti.length})`, tratti.length);
    dice(tratti[n0] && tratti[n0].pts.length === 3, "i suoi tre vertici, letti dalla stessa entità", tratti[n0]);
    const avvisoLw = await pg.evaluate(() => document.getElementById("d2-dxf-import-esito").innerText);
    dice(!/non contiene/.test(avvisoLw), "⛔ NON compare l'avviso «il file non contiene LINE o POLYLINE leggibili»: la geometria è stata trovata", avvisoLw.slice(0, 80));
  } finally { try { unlinkSync(percorsoLw); } catch (e) {} }
}

/* ⛔ 26/11 — FILE SCRITTI DA UN ALTRO PROGRAMMA, PASSATI DAL BOTTONE VERO.
   I tre DXF qui sopra li ha scritti a mano chi ha scritto il lettore. Questi
   quattro li ha scritti `ezdxf` (campioni di `dxf-da-cad.mjs`, dove sta la
   prova del lettore su tutti e 23): qui si guarda che la PAGINA dica
   all'utente ciò che il lettore sa — un bilancio di che cosa è rimasto
   fuori, non solo «N tratti importati». */
{
  const campione = (nome) => join(R, "apps", "deepwork-id", "tests", "campioni", "dxf-da-cad", nome + ".dxf");
  const importa = async (nome) => {
    const n0 = await pg.evaluate(() => window.__genesi.D2.tratti.length);
    await pg.setInputFiles("#dxfImportFile", campione(nome));
    await pg.waitForTimeout(400);
    return {
      aggiunti: (await pg.evaluate(() => window.__genesi.D2.tratti.length)) - n0,
      esito: await pg.evaluate(() => document.getElementById("d2-dxf-import-esito").innerText),
    };
  };
  const miste = await importa("curve_miste");
  dice(miste.aggiunti === 4, `curve_miste (1 linea, 2 archi, 1 cerchio, 1 spline, 1 punto): entrano QUATTRO tratti — la linea, i due archi e il cerchio (letti ${miste.aggiunti})`, miste.aggiunti);
  dice(/Non importati: 1 curva spline, 1 punto/.test(miste.esito),
    "⛔ e la pagina DICE che cosa è rimasto fuori, con le parole di chi disegna: la spline e il punto", miste.esito.slice(-260));
  dice(/3 archi o cerchi sono entrati come spezzate: dalla curva vera non si scosta più di 2 cm/.test(miste.esito),
    "⛔ e dice che i tre archi sono entrati come SPEZZATE, con lo scarto massimo: una spezzata non è l'arco", miste.esito.slice(-200));
  /* il tratto ad arco di una polilinea: sulla pianta deve esserci la curva, non la corda */
  const arco = await importa("lwpoly_bulge");
  const punti = await pg.evaluate(() => window.__genesi.D2.tratti.at(-1).pts.map((q) => [q.x, q.y]));
  dice(arco.aggiunti === 1 && punti.length > 10 && punti.every((q) => Math.abs(Math.hypot(q[0] - 5, q[1]) - 5) < 1e-9),
    `⛔ un semicerchio di 5 m di raggio entra come semicerchio (${punti.length} punti, tutti a 5 m dal centro) — non come una corda dritta di 10 m`, punti.slice(0, 3));
  dice(/1 arco o cerchio è entrato come spezzata/.test(arco.esito), "e al singolare la frase torna («1 arco o cerchio è entrato come spezzata»)", arco.esito.slice(-140));
  dice(/orientamento/i.test(miste.esito), "l'avviso sull'orientamento resta, sopra il bilancio", miste.esito.slice(0, 60));

  const blocco = await importa("blocco_non_inserito");
  dice(blocco.aggiunti === 1, `⛔ blocco definito e mai inserito: entra solo la linea vera, non le due del simbolo attorno a (0,0) (letti ${blocco.aggiunti})`, blocco.aggiunti);

  const mm = await importa("unita_mm");
  dice(/dichiara millimetri/.test(mm.esito), "un file che dichiara millimetri: la pagina lo dice", mm.esito.slice(-300));
  dice(/10\.000 × 0/.test(mm.esito), "e mostra l'ingombro letto (10.000 × 0), così la scala sbagliata si vede in un numero", mm.esito.slice(-300));
  const fattore = await pg.evaluate(() => document.getElementById("dtScalaFattore").value);
  dice(fattore === "0.001", `il fattore per «Scala tratti» è già nel campo, ma il bottone lo preme l'utente (campo: ${fattore})`, fattore);
  const larghezza = await pg.evaluate(() => { const t = window.__genesi.D2.tratti.at(-1); return Math.abs(t.pts[1].x - t.pts[0].x); });
  dice(larghezza === 10000, `⛔ e NON converte da sola: il tratto è entrato com'è scritto (${larghezza})`, larghezza);

  const bin = await importa("binario");
  dice(bin.aggiunti === 0, "un DXF binario non aggiunge tratti", bin.aggiunti);
  dice(/DXF binario/.test(bin.esito) && !/non contiene/.test(bin.esito), "⛔ e la pagina dice «binario, riesportalo come testo», non «il file non contiene linee»", bin.esito.slice(0, 200));
  dice(pg.__err.length === 0, "nessun errore di pagina durante i quattro import", pg.__err.slice(0, 2));
}

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`,
    [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

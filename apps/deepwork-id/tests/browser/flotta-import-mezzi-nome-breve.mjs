/* FLOTTA: L'IMPORT CSV DEL PARCO NON DEVE SDOPPIARE UN MEZZO GIÀ IN ARCHIVIO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-import-mezzi-nome-breve.mjs                 (porta effimera)
     node flotta-import-mezzi-nome-breve.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE (15/09, trovato da una ricerca mirata sulla famiglia
   «ricerca per campo invece che per id trova il record sbagliato», la
   stessa di Scudo). Il modulo dichiara che il NOME BREVE («Escavatore E1»,
   tutto ciò che precede " — ") è la chiave con cui l'intera app collega
   manutenzioni, scadenze, fermi e rifornimenti (`nomeBreve`,
   flotta-data.js). Il form interattivo che crea un mezzo a mano confronta
   già per nome breve prima di lasciar passare un nome che collide
   (index.html, il controllo su "editMez"); l'import CSV del parco
   confrontava invece il nome INTERO — quindi un mezzo già in archivio come
   «Escavatore E1 — CAT 352» non fermava una riga CSV «Escavatore E1»
   (magari esportata da un altro gestionale, senza marca/modello): nasceva
   un secondo documento con lo stesso nome breve, e da lì in poi ogni
   ricerca per nome breve (tagliandi, libretto di manutenzione, affidabilità
   del parco) trovava un mezzo A CASO fra i due — un tagliando scaduto sul
   mezzo vero poteva leggersi «tranquillo» sul fantasma appena creato con 0
   ore di storia.

   IL CASO SI COSTRUISCE COL FILE VERO DELLA DIMOSTRAZIONE: «Escavatore E1
   — CAT 352» (m1) è già in `DEMO.mezzi`; il banco importa un CSV con la
   sola riga «Escavatore E1». Non deve nascere un secondo mezzo. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA_BASE = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8571;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, per la controprova: il confronto contro
   l'archivio tornava al nome INTERO invece del nome breve. */
const DIFETTI = [
  ["apps/flotta/index.html",
   `if (MEZ.some(m => nomeBreve(m.nome) === nomeBreve(r.nome))) { dup++; continue; }  // già presente (stesso nome breve)`,
   `if (MEZ.some(m => m.nome.trim().toLowerCase() === r.nome.toLowerCase())) { dup++; continue; }  // già presente`],
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

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA, e poi si RILEGGE DAL SERVER
   il contrassegno col proprio pid. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA_BASE + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA_BASE} e ${PORTA_BASE + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
}

const flotta = await import(join(R, "apps/flotta/flotta-data.js"));
const m1 = flotta.DEMO.mezzi.find((m) => m.id === "m1");
if (!m1 || flotta.nomeBreve(m1.nome) !== "Escavatore E1") {
  console.error(`✗ la dimostrazione non ha più il mezzo atteso (m1 = ${JSON.stringify(m1)}): il banco non può costruire il suo caso.`);
  process.exit(2);
}
const nMezziPrima = flotta.DEMO.mezzi.length;

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 500) : ""}`); } };
const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("mez-list")?.innerHTML.length || 0) > 0); }
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2).join(" | "));
dice(pronto, "il parco mezzi è stato disegnato (la pagina è in dimostrazione)");
if (CONTROPROVA) dice(difettiRimessi.size === DIFETTI.length,
  `il difetto è stato rimesso davvero (${difettiRimessi.size}/${DIFETTI.length})`);

await vaiA(pg, "flotta", "nav-mez");
const parco = () => pg.evaluate(() => document.getElementById("mez-list")?.innerText || "");
const esitoImport = () => pg.evaluate(() => document.getElementById("ore-esito")?.textContent).then(norm);

const primaImport = await parco();
const volteE1Prima = (primaImport.match(/Escavatore E1\b/g) || []).length;
dice(volteE1Prima === 1, "«Escavatore E1» compare una volta sola PRIMA dell'import (il mezzo della dimostrazione)", primaImport.match(/Escavatore E1[^\n]*/g));

/* IL CSV: la stessa macchina, col nome BREVE — come la esporterebbe un
   gestionale diverso, senza marca/modello. */
const CSV_IN = "nome;area;ore;stato\nEscavatore E1;Fronte Sud;80;operativo\n";
await pg.setInputFiles("#mez-file", { name: "parco.csv", mimeType: "text/csv", buffer: Buffer.from(CSV_IN, "utf8") });
await pg.waitForTimeout(900);

const es = await esitoImport();
dice(/1 già presente \(saltato\)/.test(es), "l'esito dice «1 già presente (saltato)»: il nome breve ha trovato il mezzo vero", es);
dice(!/1 mezzo aggiunto\b/.test(es), "e NON dice «1 mezzo aggiunto»: non è nato un secondo documento", es);

const dopoImport = await parco();
const volteE1Dopo = (dopoImport.match(/Escavatore E1\b/g) || []).length;
dice(volteE1Dopo === 1, "e nel parco «Escavatore E1» compare ANCORA una volta sola: nessun fantasma con 80 ore", dopoImport.match(/Escavatore E1[^\n]*/g));
dice(!/\b80\s*(h|ore)\b/i.test(dopoImport), "in particolare non compare un «Escavatore E1» a 80 ore: quello vero ne ha migliaia", dopoImport.match(/Escavatore E1[^\n]*/g));

/* controprova negativa sul modulo: il numero di mezzi della dimostrazione,
   che il caso presuppone, non deve essere cambiato da sé */
dice(flotta.DEMO.mezzi.length === nMezziPrima, "il modulo del disco non è stato toccato dal banco (stesso numero di mezzi in DEMO)", flotta.DEMO.mezzi.length);

console.log(`\nRisultato import mezzi (nome breve) di Flotta${CONTROPROVA ? " · CONTROPROVA" : ""}: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

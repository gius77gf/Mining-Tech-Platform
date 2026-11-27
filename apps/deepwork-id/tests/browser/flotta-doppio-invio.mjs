/* FLOTTA: IL SECONDO TOCCO SUL DOPPIO INVIO — btn-rif E btn-cos
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-doppio-invio.mjs [--porta=8784]   (registra due volte di seguito)
     node flotta-doppio-invio.mjs --controprova    (rimette il difetto: DEVE fallire)
     node flotta-doppio-invio.mjs --scatti         (salva gli scatti in /tmp/flotta-doppio-invio)

   PERCHÉ ESISTE. Dal quarto giro di deep-pass (18/09, agente ade005a3e1c9bacf0):
   i due bottoni «Registra» dei moduli Rifornimento e Costo restavano attivi per
   tutta la scrittura (`await db.aggiungi(...)`), e un rifornimento si registra
   spesso «alla cisterna del piazzale», lo stesso contesto per cui
   `btn-giro-salva` ha già la difesa `occupato()`. Un secondo tocco durante
   l'attesa — un dito lento, una connessione debole — registrava due volte la
   stessa voce.
   La correzione avvolge le scritture con `occupato(id, true/false)`, che spegne
   il bottone SUBITO, prima dell'`await`: due click sparati nello stesso giro di
   eventi (senza aspettare fra l'uno e l'altro) trovano il bottone già
   `disabled` al secondo, e il browser non genera un secondo evento click su un
   elemento disabilitato — quindi resta UNA sola scrittura.
   La controprova rimette il difetto togliendo le due righe `occupato(...)` da
   ciascun gestore nel file servito: col bottone sempre attivo, i due click
   nello stesso giro di eventi arrivano entrambi al gestore, e nascono DUE voci
   invece di una. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8784;
const OUT = "/tmp/flotta-doppio-invio";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
/* il difetto rimesso: il bottone resta attivo per tutta la scrittura, in
   entrambi i gestori — due punti, uno per bottone, perché il banco misura
   tutt'e due i moduli. */
const DIFETTI = [
  ["apps/flotta/index.html",
   '    occupato("btn-cos", true);\n    await db.aggiungi("costi"',
   '    await db.aggiungi("costi"   /* difetto rimesso dal banco: bottone sempre attivo */'],
  ["apps/flotta/index.html",
   '    occupato("btn-cos", false);\n    $("cos-voce").value',
   '    $("cos-voce").value'],
  ["apps/flotta/index.html",
   '    occupato("btn-rif", true);\n    // La spesa del gasolio',
   '    // La spesa del gasolio   /* difetto rimesso dal banco: bottone sempre attivo */'],
  ["apps/flotta/index.html",
   '    occupato("btn-rif", false);\n    $("rif-litri").value',
   '    $("rif-litri").value'],
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
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1 (${cerca.slice(0, 40)}…)`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, no) => { srv.on("error", no); srv.listen(PORTA, "127.0.0.1", r); })
  .catch((e) => { console.error(`✗ porta ${PORTA} non disponibile: ${e.message}`); process.exit(2); });
const c = await fetch(`http://127.0.0.1:${PORTA}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: sulla porta risponde qualcun altro"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
if (SCATTI) mkdirSync(OUT, { recursive: true });

const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("rif-list")?.innerHTML.length || 0) > 0 && document.querySelectorAll("#rif-mezzo option").length > 1); }
dice(pronto, "la pagina è pronta con la dimostrazione (lista dei pieni e mezzi nella tendina)");
await pg.click("#nav-cos"); await pg.waitForTimeout(400);
dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-cos")).display !== "none"), "sono sulla schermata Costi, dove stanno i due moduli");
const scatto = async (nome) => { if (SCATTI) await pg.screenshot({ path: join(OUT, `${nome}${CONTROPROVA ? "-controprova" : ""}.png`), fullPage: false }); };

// ── COSTO: due click nello stesso giro di eventi, senza aspettare l'esito ──
const primaCos = await pg.evaluate(() => document.querySelectorAll("#cos-list .item").length);
await pg.selectOption("#rif-mezzo", { index: 1 }).catch(() => {}); // non serve, ma tocchiamo la pagina prima
await pg.fill("#cos-voce", "Prova doppio invio");
await pg.fill("#cos-importo", "42,50");
const dueClickCos = () => pg.evaluate(() => {
  const b = document.getElementById("btn-cos");
  const subitoDisabilitato1 = b.disabled;
  b.click();
  const subitoDisabilitato2 = b.disabled;   // letto SUBITO dopo il primo click, prima di qualunque await
  b.click();                                // secondo click nello stesso giro di eventi: se il bottone è già disabled, il browser non genera l'evento
  return { subitoDisabilitato1, subitoDisabilitato2 };
});
const statoCos = await dueClickCos();
dice(statoCos.subitoDisabilitato1 === false, "prima del click il bottone Costo è attivo", statoCos);
await scatto("1-cos-appena-cliccato");
await pg.waitForTimeout(700); // lascia finire la scrittura (o le scritture, se il difetto è tornato)
const esitoCos = await pg.evaluate(() => document.getElementById("cos-esito")?.textContent.replace(/\s+/g, " ").trim() || "");
dice(/Costo registrato/.test(esitoCos), "l'esito conferma la registrazione del costo", esitoCos);
const dopoCos = await pg.evaluate(() => document.querySelectorAll("#cos-list .item").length);
const nuoveCos = dopoCos - primaCos;
dice(nuoveCos === 1, `⛔ dopo due click nello stesso giro di eventi è entrata UNA sola voce di costo (${primaCos} → ${dopoCos})`, { primaCos, dopoCos });
const bottoneRitornatoCos = await pg.evaluate(() => document.getElementById("btn-cos").disabled === false);
dice(bottoneRitornatoCos, "il bottone Costo torna attivo dopo la scrittura");
await scatto("2-cos-fatto");

// ── RIFORNIMENTO: stessa prova, sul modulo con tre scritture in fila ──
// «Ultimi rifornimenti» mostra al più 10 righe (`.slice(0, 10)`): contare
// `.item` non basta quando la dimostrazione ne ha già 10 o più, perché il
// tetto nasconde un doppione. Il totale VERO è quello che la lista stessa
// dichiara: la nota "ne vedi 10 · su N" quando N>10, o il numero di righe
// mostrate quando N<=10 (nessun doppione può nascondersi sotto il tetto).
const contaRifTotale = () => pg.evaluate(() => {
  const txt = document.querySelector("#rif-list .count")?.textContent || "";
  const m = txt.match(/su (\d+)/);
  if (m) return +m[1];
  const list = document.getElementById("rif-list");
  const children = [...list.children];
  const secIdx = children.findIndex((c) => c.classList.contains("sec"));
  return secIdx === -1 ? 0 : children.slice(secIdx + 1).filter((c) => c.classList.contains("item")).length;
});
const primaRif = await contaRifTotale();
await pg.selectOption("#rif-mezzo", { index: 1 });
const oggiIso = await pg.evaluate(() => document.getElementById("rif-data").value);
if (!oggiIso) await pg.fill("#rif-data", new Date().toISOString().slice(0, 10));
await pg.fill("#rif-litri", "50");
await pg.fill("#rif-euro", "");
await pg.fill("#rif-ore", "");
const dueClickRif = () => pg.evaluate(() => {
  const b = document.getElementById("btn-rif");
  const subitoDisabilitato1 = b.disabled;
  b.click();
  const subitoDisabilitato2 = b.disabled;
  b.click();
  return { subitoDisabilitato1, subitoDisabilitato2 };
});
const statoRif = await dueClickRif();
dice(statoRif.subitoDisabilitato1 === false, "prima del click il bottone Rifornimento è attivo", statoRif);
await scatto("3-rif-appena-cliccato");
await pg.waitForTimeout(900);
const esitoRif = await pg.evaluate(() => document.getElementById("rif-esito")?.textContent.replace(/\s+/g, " ").trim() || "");
dice(/Rifornimento registrato/.test(esitoRif), "l'esito conferma la registrazione del rifornimento", esitoRif);
const dopoRif = await contaRifTotale();
const nuoveRif = dopoRif - primaRif;
dice(nuoveRif === 1, `⛔ dopo due click nello stesso giro di eventi è entrato UN solo rifornimento (${primaRif} → ${dopoRif})`, { primaRif, dopoRif });
const bottoneRitornatoRif = await pg.evaluate(() => document.getElementById("btn-rif").disabled === false);
dice(bottoneRitornatoRif, "il bottone Rifornimento torna attivo dopo la scrittura");
await scatto("4-rif-fatto");

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
await pg.close();

if (CONTROPROVA) dice(difettiRimessi === 4, `i difetti sono stati rimessi nel modulo servito (${difettiRimessi} punti su 4)`);
await b.close(); srv.close();
console.log(`\nRisultato doppio invio: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

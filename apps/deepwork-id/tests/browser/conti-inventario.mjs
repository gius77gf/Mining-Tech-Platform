/* LE SCORTE A PIAZZALE MISURATE IN CONTI: IL TRIANGOLO CHIUSO CON GLI INVENTARI DI TERRA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-inventario.mjs                  (4 passate: primo semestre, anno, Terra assente, lista vuota)
     node conti-inventario.mjs --controprova    (rimette TRE difetti insieme: DEVE cadere)
     node conti-inventario.mjs --controprova=2  (ne rimette uno solo, per numero)
     node conti-inventario.mjs --scatti [--larghezza=390] [--tema=light] [--out=/cartella]

   PERCHÉ ESISTE. Dal 03/09 sotto le due schede di «Cavato contro venduto» c'è
   il terzo lato del triangolo: la variazione delle scorte a piazzale MISURATA
   fra due inventari dei cumuli di Terra (`triangolo` in conti-data.js, sulle
   regole di shared/dw-ponti.js), e la chiusura cavato − venduto − Δscorte in
   tonnellate. Il banco guarda quattro esiti dove si formano, nella pagina
   servita, e i numeri li pretende ALLA CIFRA perché li ha calcolati a mano:

   · primo semestre (01/01–30/06): inventari i1 (29/12/2025) e i2 (27/06/2026),
       Stabilizzato 0/30   265 − 240 = +25 m³ × 1,9 = +47,5 t
       Sabbia lavata 0/4    88 − 115 = −27 m³ × 1,6 = −43,2 t
       Pietrisco 8/12       70 −  62 =  +8 m³ × 1,5 = +12,0 t
       Terre di scavo       30 −  30 =   0 m³, SENZA densità nel listino → fuori
       Δ = 6 m³ = 16,3 t. Cavato 124 m³ × 1,9 (valore tipico «Sabbia e ghiaia»)
       = 235,6 t; venduto 164,1 t; scarto = 235,6 − 164,1 − 16,3 = +55,2 t,
       cioè il 23% del cavato → attenzione, «sparito»;
   · anno intero (01/01–31/12): i1 e i3 (30/08, una STIMA): Stabilizzato
       250 − 240 = +10 m³ × 1,9 = 19 t; Pietrisco 64 − 62 = +2 × 1,5 = 3 t;
       la Sabbia in i3 è `volumeM3: null` e le Terre non ci sono: NON
       valgono zero, restano fuori ed è la ragione per cui il conto è PARZIALE.
       Δ = 12 m³ = 22 t. Cavato 178 m³ → 338,2 t; venduto 374,96 t; scarto
       = 338,2 − 374,96 − 22 = −58,76 t, il 17% del cavato → attenzione, «in eccesso».
   ⚠️ La dimostrazione di Conti è la SUA cava (decine di m³), non una copia di
   quella di Terra: alla scala di Terra il triangolo chiudeva «implausibile»
   per costruzione dei dati, e un banco che lo pretendesse blinderebbe una
   dimostrazione incoerente;
   · Terra che NON risponde (il modulo servito risponde null): la nota dice
       «non arrivano», nessuna tonnellata di scorte, la cassa sopra resta
       «stimate»;
   · Terra che risponde con una lista VUOTA: «restano stimate» con la ragione
       e cosa fare.
   La controprova rimette tre difetti, ognuno il più facile da scrivere:
   (1) il listino accoppiato per nome grezzo invece che per `chiaveMateriale`
   (nessuna densità trovata → le scorte tornano «stimate»); (2) un materiale
   in un solo inventario contato a ZERO nell'altro (la Sabbia sparita vale
   −115 m³ e il Δ cambia); (3) la pagina che traduce il `null` di Terra in una
   lista vuota (la nota tranquilla al posto dell'avviso).
   ⚠️ L'import di Firebase da gstatic si taglia subito (come fa giro.mjs). La
   porta è effimera, MAI la 8823 del giro, e il server risponde col proprio pid
   prima che si misuri qualcosa. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const ARG = (n) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || "").split("=")[1];
const CONTROPROVA = process.argv.includes("--controprova") || !!ARG("controprova");
const SOLO_DIFETTO = Number(ARG("controprova")) || 0;
const SCATTI = process.argv.includes("--scatti");
const TEMA = ARG("tema") || "";
const LARG = Number(ARG("larghezza")) || 390;
const OUT = ARG("out") || "/tmp/conti-inventario";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* la risposta del modulo servito, cambiata fra una passata e l'altra */
const CERCA = "inventariTerra: async () => mem.inventariTerra || []";
const MODI = { demo: null, assente: "inventariTerra: async () => null", vuoto: "inventariTerra: async () => []" };
let modo = "demo", iniettato = 0;

/* I DIFETTI DA RIMETTERE, col file che li porta. */
const DIFETTI = [
  ["apps/conti/conti-data.js",
   "return (materiale) => { const d = m.get(chiaveMateriale(materiale)); return d == null ? null : d; };",
   "return (materiale) => { const d = m.get(String(materiale)); return d == null ? null : d; };   /* difetto rimesso dal banco */"],
  ["apps/conti/conti-data.js",
   "const scorteT = scorteInTonnellate(scorte.perMateriale.filter((r) => r.confrontabile), densitaDalListino(prodotti));",
   "const scorteT = scorteInTonnellate(scorte.perMateriale.map((r) => r.confrontabile ? r : { ...r, deltaM3: (r.fineM3 ?? 0) - (r.inizioM3 ?? 0) }), densitaDalListino(prodotti));   /* difetto rimesso dal banco */"],
  ["apps/conti/index.html",
   "try { INV = db.inventariTerra ? await db.inventariTerra() : null; } catch (e) { INV = null; }",
   "try { INV = (db.inventariTerra ? await db.inventariTerra() : null) || []; } catch (e) { INV = []; }   /* difetto rimesso dal banco */"],
];
const DIFETTI_ATTIVI = SOLO_DIFETTO ? [DIFETTI[SOLO_DIFETTO - 1]] : DIFETTI;
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (MODI[modo] && p.endsWith("apps/conti/conti-data.js")) {
    const t = corpo.toString("utf8"); const n = t.split(CERCA).length - 1;
    if (n !== 1) { console.error(`✗ iniezione mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA, MODI[modo]), "utf8"); iniettato++;
  }
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI_ATTIVI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 500) : ""}`); } };

/* apre Conti in dimostrazione, va al Report, mette il periodo e aspetta che il
   riquadro delle scorte abbia finito di chiedere a Terra */
async function apri(dal, al) {
  const pg = await b.newPage({ viewport: { width: LARG, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
  let dati = false;
  for (let i = 0; i < 80 && !dati; i++) { await pg.waitForTimeout(250);
    dati = await pg.evaluate(() => (document.getElementById("cos-riep")?.innerHTML.length || 0) > 0); }
  if (TEMA) await pg.evaluate((c) => document.body.classList.add(c), TEMA + "-mode");
  await pg.click("#nav-rep");
  await pg.fill("#ric-dal", dal); await pg.fill("#ric-al", al);
  const leggi = () => pg.evaluate(() => {
    const n = document.getElementById("ric-scorte");
    const norm = (e) => e ? e.textContent.replace(/\s+/g, " ").trim() : null;
    const cassa = n && n.querySelector(".cassa");
    return { testo: norm(n), lab: norm(cassa && cassa.querySelector(".cassa-lab")), num: norm(cassa && cassa.querySelector(".cassa-num")),
      cls: cassa ? [...cassa.classList] : null,
      note: [...(n ? n.querySelectorAll(".note") : [])].map((e) => ({ testo: norm(e), warn: e.classList.contains("warn"), recap: e.classList.contains("recap") })),
      labSopra: norm(document.querySelector("#ric-riep .cassa-lab")),
      pagina: [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id),
      scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth };
  });
  let v = null;
  for (let i = 0; i < 40; i++) { await pg.waitForTimeout(200); v = await leggi(); if (v.testo && !/Sto chiedendo/.test(v.testo)) break; }
  return { pg, errori, v, leggi };
}
async function scatto(pg, nome) {
  if (!SCATTI) return;
  mkdirSync(OUT, { recursive: true });
  await pg.evaluate(() => document.getElementById("ric-scorte")?.scrollIntoView({ block: "center" }));
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: join(OUT, `${nome}-${LARG}${TEMA ? "-" + TEMA : ""}${CONTROPROVA ? "-controprova" : ""}.png`) });
}

// ── 1. primo semestre: MISURATE, alla cifra ────────────────────────────
console.log("\n— primo semestre 2026 (i1 → i2) —");
{
  const { pg, errori, v } = await apri("2026-01-01", "2026-06-30");
  console.log("  testo:", (v.testo || "").slice(0, 700));
  dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
  dice(v.pagina.includes("page-rep"), "sono sulla schermata Report", v.pagina);
  dice(!!v.cls, "c'è la cassa delle scorte", v);
  dice(v.lab === "Scorte a piazzale misurate", "l'etichetta dice «Scorte a piazzale misurate»", v.lab);
  dice(v.num === "16,30 t", "Δ scorte = 16,30 t (47,5 − 43,2 + 12; le tonnellate si scrivono a due decimali come nel resto della schermata)", v.num);
  dice(/cresciute di 6 m³, cioè 16,30 t alle densità del listino/.test(v.testo), "il verso è in parole: «cresciute di 6 m³, cioè 16,30 t»");
  dice(/Fra l'inventario del 29\/12\/2025 e quello del 27\/06\/2026/.test(v.testo), "le due date degli inventari");
  dice(/L'inventario di inizio è di 3 giorni prima dell'inizio del periodo/.test(v.testo) && /L'inventario di fine è di 3 giorni prima della fine del periodo/.test(v.testo), "lo scarto in giorni dai confini del periodo (3 e 3)");
  dice(/Il triangolo chiude a 55,20 t \(il 23% del cavato\)/.test(v.testo), "la chiusura: 235,6 − 164,1 − 16,3 = 55,2 t, il 23% del cavato");
  dice(/cavato 235,60 t − venduto 164,10 t − scorte cresciute di 16,30 t/.test(v.testo), "con i tre lati scritti per esteso");
  dice(/Materiale che non risulta né venduto né a piazzale/.test(v.testo), "il verso della chiusura in parole (sparito: sfrido, ripristino o uscite non pesate)");
  dice(/può starci, ma merita un'occhiata/.test(v.testo), "attenzione → il giudizio in parole");
  dice(!!v.cls && v.cls.includes("attenta") && !v.cls.includes("grave") && !v.note.some((n) => n.warn && /triangolo chiude/.test(n.testo)), "attenzione → cassa «attenta», non «grave», e la nota senza il tono d'avviso", [v.cls, v.note.map((n) => n.warn)]);
  dice(/valore tipico da verificare/.test(v.testo), "e dice che la densità in banco del cavato è un valore tipico da verificare");
  dice(/Terre di scavo: senza densità nel listino/.test(v.testo), "le Terre di scavo sono elencate fuori: senza densità nel listino");
  dice(!/Sabbia lavata 0\/4: c'è in un solo inventario/.test(v.testo), "la Sabbia NON è fuori: sta in tutt'e due gli inventari");
  dice(!/stimate/.test(v.testo), "il riquadro non parla più di scorte «stimate»");
  dice(v.labSopra === "Divario cavato − venduto", "e la cassa sopra non chiama più il divario «scorte stimate»", v.labSopra);
  dice(v.scroll <= v.client, `la pagina non scorre di lato a ${LARG}px`, [v.scroll, v.client]);
  await scatto(pg, "semestre"); await pg.close();
}

// ── 2. anno intero: PARZIALE, la sabbia non misurata resta fuori ───────
console.log("\n— anno 2026 (i1 → i3, una stima con la sabbia non misurata) —");
{
  const { pg, errori, v } = await apri("2026-01-01", "2026-12-31");
  console.log("  testo:", (v.testo || "").slice(0, 700));
  dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
  dice(v.lab === "Scorte a piazzale misurate", "l'etichetta dice «misurate»", v.lab);
  dice(v.num === "22,00 t", "Δ scorte = 22 t (19 + 3): la sabbia non misurata NON entra come −184 t", v.num);
  dice(/cresciute di 12 m³, cioè 22,00 t/.test(v.testo), "in parole: «cresciute di 12 m³, cioè 22 t»");
  dice(/quello del 30\/08\/2026 \(una stima, non un rilievo\)/.test(v.testo), "l'inventario di fine è del 30/08 e si dichiara una stima");
  dice(/123 giorni prima della fine del periodo/.test(v.testo), "l'inventario di fine è di 123 giorni prima della fine del periodo");
  dice(/Il triangolo chiude a 58,76 t \(il 17% del cavato\)/.test(v.testo), "la chiusura: 338,2 − 374,96 − 22 = −58,76 t, il 17%");
  dice(/Più materiale venduto e a piazzale di quanto cavato/.test(v.testo), "il verso in parole (in eccesso: manca un rilievo, o una densità è sbagliata)");
  dice(/Sabbia lavata 0\/4: c'è in un solo inventario \(manca in quello di fine\)/.test(v.testo), "la Sabbia è elencata fuori: in un solo inventario, manca in quello di fine");
  dice(/Terre di scavo: c'è in un solo inventario/.test(v.testo), "e le Terre di scavo, assenti dal terzo inventario");
  dice(/è quindi parziale/.test(v.testo), "la variazione si dichiara parziale");
  dice(v.scroll <= v.client, `la pagina non scorre di lato a ${LARG}px`, [v.scroll, v.client]);
  await scatto(pg, "anno"); await pg.close();
}

// ── 3. Terra non risponde: nessun numero, la cassa sopra resta «stimate» ─
console.log("\n— Terra non risponde (il modulo servito risponde null) —");
{
  modo = "assente"; const prima = iniettato;
  const { pg, errori, v } = await apri("2026-01-01", "2026-06-30");
  console.log("  testo:", (v.testo || "").slice(0, 400));
  dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
  dice(iniettato > prima, `il modulo servito rispondeva null (${iniettato - prima} iniezioni)`);
  dice(!v.cls, "nessuna cassa delle scorte", v.cls);
  dice(v.note.length === 1 && v.note[0].warn, "una nota sola, in tono avviso", v.note);
  dice(/non arrivano/.test(v.testo) && /restano stimate/.test(v.testo), "dice che gli inventari non arrivano e che le scorte restano stimate");
  dice(!/\d\s?t\b/.test(v.testo), "NESSUNA tonnellata di scorte inventata", v.testo);
  dice(!/non c'è nessun inventario/.test(v.testo), "NON dice «non c'è nessun inventario» (sarebbe il null tradotto in vuoto)");
  dice(v.labSopra === "Scorte a piazzale stimate", "la cassa sopra resta «Scorte a piazzale stimate»", v.labSopra);
  await scatto(pg, "assente"); await pg.close();
}

// ── 4. Terra risponde con una lista vuota: la ragione e cosa fare ───────
console.log("\n— Terra risponde, ma senza inventari —");
{
  modo = "vuoto"; const prima = iniettato;
  const { pg, errori, v } = await apri("2026-01-01", "2026-06-30");
  console.log("  testo:", (v.testo || "").slice(0, 400));
  dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
  dice(iniettato > prima, `il modulo servito rispondeva una lista vuota (${iniettato - prima} iniezioni)`);
  dice(!v.cls, "nessuna cassa delle scorte", v.cls);
  dice(v.note.length === 1 && !v.note[0].warn, "una nota sola, non in tono avviso (Terra ha risposto)", v.note);
  dice(/Le scorte a piazzale restano stimate: in Terra non c'è nessun inventario dei cumuli/.test(v.testo), "la ragione, con le parole del modulo");
  dice(/Registra in Terra un inventario dei cumuli/.test(v.testo), "e cosa fare");
  dice(!/\d\s?t\b/.test(v.testo), "NESSUNA tonnellata di scorte inventata", v.testo);
  dice(v.labSopra === "Scorte a piazzale stimate", "la cassa sopra resta «Scorte a piazzale stimate»", v.labSopra);
  await scatto(pg, "vuoto"); await pg.close();
}

if (CONTROPROVA) dice(difettiRimessi > 0, `i difetti sono stati rimessi nella pagina servita (${difettiRimessi} iniezioni, ${DIFETTI_ATTIVI.length} difetti)`);
await b.close(); srv.close();
console.log(`\nRisultato scorte misurate (inventario dei cumuli in Conti): ${ok} passati, ${ko} falliti — ${ok + ko} prove in 4 passate`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

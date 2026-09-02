/* IL PONTE CONTI→FLOTTA NELLA SCHERMATA COSTI: QUESTA SPESA RISULTA ANCHE IN CONTI?
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-ponte-conti.mjs                   (dimostrazione: Conti risponde)
     node flotta-ponte-conti.mjs --conti-assente   (il modulo servito risponde null)
     node flotta-ponte-conti.mjs --controprova     (rimette il difetto: DEVE fallire)
     node flotta-ponte-conti.mjs --larghezza=320 --tema=light --scatti

   PERCHÉ ESISTE. Dal 02/09 la schermata Costi di Flotta legge il registro costi
   di Conti e dice, voce per voce e riga per riga, che cosa sta in tutt'e due:
   è il verso di ritorno del ponte che Conti ha dallo stesso giorno
   (`conti-ponte-flotta.mjs`, di cui questo banco ricopia la struttura). Tre
   esiti, guardati dove si formano, cioè nella pagina servita:
   · Conti risponde e c'è la stessa voce di qua e di là → riga «in tutt'e
     due», verdetto «gonfiato fino a…», e la riga uguale ALLA CIFRA (stesso
     giorno, stesso importo) porta il contrassegno «anche in Conti» nell'elenco;
   · Conti NON risponde → nota in tono avviso, NESSUN numero attribuito a
     Conti e nessun contrassegno: l'assenza non è un dato favorevole, e qui uno
     «0 € in Conti» sarebbe il via libera a scrivere il doppione;
   · più la cassa della tabella: stilata, dentro la nota, la pagina che non
     scorre di lato, gli inchiostri sopra 4,5:1 nel tema chiesto.
   La controprova rimette il difetto più facile da scrivere — la pagina che
   traduce il `null` di Conti in una lista vuota — e pretende che il verso
   «Conti assente» cada: con quel difetto la nota direbbe «Conti non ha
   registrato niente», con la faccia tranquilla.
   ⚠️ I colori si leggono dipingendoli su una tela (come nel banco gemello):
   nel tema chiaro Chromium risponde nella forma `color(srgb …)`.
   ⚠️ L'import di Firebase da gstatic si taglia subito (come fa giro.mjs): senza
   rete muore da solo dopo ~13 s, e i dati dimostrativi arrivano solo dopo.
   ⚠️ Si lancia SENZA le variabili del proxy (`env -u HTTPS_PROXY -u HTTP_PROXY
   -u https_proxy -u http_proxy node …`): col proxy Chromium aspetta 12,7 s e
   si misura una schermata vuota. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
// la controprova gira sul verso «Conti assente»: è lì che il difetto rimesso mente
const ASSENTE = process.argv.includes("--conti-assente") || CONTROPROVA;
const SCATTI = process.argv.includes("--scatti");
const TEMA = (process.argv.find((a) => a.startsWith("--tema=")) || "").split("=")[1] || "";
const LARG = Number((process.argv.find((a) => a.startsWith("--larghezza=")) || "").split("=")[1]) || 430;
const OUT = "/tmp/flotta-ponte-conti";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const CERCA = "costiConti: async () => mem.costiConti || []";
let iniettato = 0;
/* IL DIFETTO DA RIMETTERE, con il file che lo porta: la pagina che traduce il
   «non ho risposta» di Conti in «Conti non ha costi». Si contano le
   sostituzioni: un replace che non trova niente dichiara un verde vuoto. */
const DIFETTI = [
  ["apps/flotta/index.html",
   "try { CC = db.costiConti ? await db.costiConti() : null; } catch (e) { CC = null; }",
   "try { CC = (db.costiConti ? await db.costiConti() : null) || []; } catch (e) { CC = []; }   /* difetto rimesso dal banco */"],
];
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (ASSENTE && p.endsWith("apps/flotta/flotta-data.js")) {
    const t = corpo.toString("utf8");
    const n = t.split(CERCA).length - 1;
    if (n !== 1) { console.error(`✗ iniezione mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA, "costiConti: async () => null"), "utf8"); iniettato++;
  }
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
const pg = await b.newPage({ viewport: { width: LARG, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
// senza rete l'import di Firebase muore dopo ~13 s: lo si taglia subito, come fa giro.mjs
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
// si aspetta il DATO, non il tempo: il contatore dei costi nasce «—» e prende
// il numero quando la dimostrazione è arrivata
let datiDopo = null; const t0 = Date.now();
for (let i = 0; i < 80 && datiDopo === null; i++) { await pg.waitForTimeout(250);
  if (await pg.evaluate(() => /^\d+$/.test((document.getElementById("cos-count")?.textContent || "").trim()))) datiDopo = Date.now() - t0; }
console.log("  dati dimostrativi arrivati dopo ms:", datiDopo);

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 500) : ""}`); } };

if (TEMA) await pg.evaluate((c) => document.body.classList.add(c), TEMA + "-mode");
await pg.click("#nav-cos");
// aspetto che la nota abbia finito di chiedere a Conti
let nota = null;
for (let i = 0; i < 30 && !nota; i++) {
  await pg.waitForTimeout(200);
  nota = await pg.evaluate(() => {
    const n = document.querySelector("#cos-ponte .note");
    if (!n || /Sto chiedendo/.test(n.textContent)) return null;
    const righe = [...n.querySelectorAll("table.ponte tbody tr")].map((tr) => ({
      doppia: tr.classList.contains("doppia"),
      celle: [...tr.children].map((td) => td.textContent.trim()) }));
    const cs = getComputedStyle(n);
    const tab = n.querySelector("table.ponte");
    // i contrassegni «anche in Conti» nell'elenco, con la riga che li porta
    const contrassegni = [...document.querySelectorAll("#cos-list .item")]
      .filter((it) => [...it.querySelectorAll(".badge")].some((bd) => /anche in Conti/.test(bd.textContent)))
      .map((it) => ({ nome: it.querySelector(".name")?.textContent.trim(), meta: it.querySelector(".meta")?.textContent.trim(),
        badge: (() => { const bd = [...it.querySelectorAll(".badge")].find((x) => /anche in Conti/.test(x.textContent)); const r = bd.getBoundingClientRect(); return { w: r.width, h: r.height, testo: bd.textContent.trim() }; })() }));
    return { testo: n.textContent.replace(/\s+/g, " ").trim(), warn: n.classList.contains("warn"),
      righe, bordo: cs.borderLeftColor + " " + cs.borderLeftWidth, contrassegni,
      tabella: tab ? { collapse: getComputedStyle(tab).borderCollapse, larghezza: tab.getBoundingClientRect().width,
        notaLarghezza: n.getBoundingClientRect().width, thPad: getComputedStyle(tab.querySelector("th")).padding,
        wrap: tab.parentElement.classList.contains("ponte-wrap"), wrapLarghezza: tab.parentElement.getBoundingClientRect().width,
        wrapScroll: tab.parentElement.scrollWidth, wrapClient: tab.parentElement.clientWidth,
        doppiaColore: (() => { const td = tab.querySelector("tr.doppia td:nth-child(2)"); return td ? getComputedStyle(td).color : null; })(),
        normaleColore: (() => { const td = tab.querySelector("tr:not(.doppia) td:nth-child(2)"); return td ? getComputedStyle(td).color : null; })() } : null,
      paginaScroll: document.documentElement.scrollWidth, paginaClient: document.documentElement.clientWidth,
      contrasti: (() => { if (!tab) return null;
        /* il colore si legge dipingendolo su una tela: nel tema chiaro Chromium
           risponde `color(srgb …)`, e una regex sui numeri interi dava
           contrasto «1» su un testo che fa 7,1. Il righello sbagliava, non la pagina. */
        const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d");
        const rgb = (c) => { cx.fillStyle = "#123456"; cx.fillRect(0, 0, 1, 1); cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
        const lum = (c) => { const m = rgb(c); const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
          return .2126 * f(m[0]) + .7152 * f(m[1]) + .0722 * f(m[2]); };
        const fondo = (el) => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)/.test(b) && !/^rgba\(.*, 0\)$/.test(b)) return b; } return "rgb(0,0,0)"; };
        const rap = (el) => { const a = lum(getComputedStyle(el).color), b = lum(fondo(el)); return Math.round(((Math.max(a, b) + .05) / (Math.min(a, b) + .05)) * 100) / 100; };
        const out = {}; for (const [k, sel] of [["doppia", "tr.doppia td:nth-child(2)"], ["normale", "tr:not(.doppia) td:nth-child(2)"], ["voce", "td:first-child"], ["th", "th"], ["small", "td small"]]) { const el = tab.querySelector(sel); out[k] = el ? rap(el) + " su " + fondo(el) : null; }
        const bd = [...document.querySelectorAll("#cos-list .badge")].find((x) => /anche in Conti/.test(x.textContent));
        out.contrassegno = bd ? rap(bd) + " su " + fondo(bd) : null;
        return out; })(),
      pagina: [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id) };
  });
}
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(!!nota, "la nota del ponte è comparsa e ha finito di chiedere a Conti");
if (nota) {
  dice(nota.pagina.includes("page-cos"), "sono sulla schermata Costi", nota.pagina);
  console.log("  testo:", nota.testo);
  console.log("  righe:", JSON.stringify(nota.righe));
  console.log("  contrassegni:", JSON.stringify(nota.contrassegni));
  console.log("  stile:", nota.bordo, JSON.stringify(nota.tabella));
  const zero = /(€\s?0(,00)?\b|\b0(,00)?\s?€)/.test(nota.testo);
  if (ASSENTE) {
    dice(iniettato > 0, `il modulo servito rispondeva null (${iniettato} iniezioni)`);
    if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);
    dice(nota.warn, "la nota è in tono warn");
    dice(/non è raggiungibile/.test(nota.testo), "dice che Conti non è raggiungibile");
    dice(!nota.tabella, "nessuna tabella di confronto");
    dice(!zero, "NESSUNO zero attribuito a Conti", nota.testo);
    dice(nota.contrassegni.length === 0, "nessuna riga porta «anche in Conti»: non si sa, non si segna", nota.contrassegni);
  } else {
    dice(!nota.warn, "la nota non è in tono warn");
    dice(!!nota.tabella, "c'è la tabella di confronto");
    const carb = nota.righe.find((r) => /carburante/i.test(r.celle[0]));
    dice(!!carb && carb.doppia, "carburante è segnato «in tutt'e due»", carb);
    dice(!!carb && /8\.400/.test(carb.celle[1]) && /1 riga/.test(carb.celle[1]), "qui il carburante fa 8.400 su 1 riga (la colonna «qui» legge v.flotta)", carb && carb.celle[1]);
    dice(!!carb && /8\.900/.test(carb.celle[2]) && /2 righe/.test(carb.celle[2]), "in Conti fa 8.900 su 2 righe (8.400 + 500 senza data)", carb && carb.celle[2]);
    const man = nota.righe.find((r) => /manutenzione/i.test(r.celle[0]));
    dice(!!man && man.doppia && /10\.790/.test(man.celle[1]) && /4 righe/.test(man.celle[1]) && /640/.test(man.celle[2]), "manutenzione: 10.790 qui su 4 righe, 640 in Conti, doppia", man);
    const nol = nota.righe.find((r) => /noleggi/i.test(r.celle[0]));
    dice(!!nol && !nol.doppia && nol.celle[2] === "—" && /3\.300/.test(nol.celle[1]), "noleggio: solo qui (3.300), Conti dice «—» e non zero", nol);
    dice(/gonfiato/.test(nota.testo), "il verdetto dice «gonfiato»");
    dice(/1 spesa di questo registro risulta in Conti alla cifra/.test(nota.testo), "la spesa uguale alla cifra è dichiarata, al singolare");
    dice(/1 riga di Conti è senza data/.test(nota.testo), "la riga senza data di Conti è dichiarata");
    dice(/1 voce di questo registro è senza data/.test(nota.testo), "e quella senza data di qui pure");
    dice(nota.contrassegni.length === 1 && /Carburante/.test(nota.contrassegni[0].nome) && /06\/07\/2026/.test(nota.contrassegni[0].meta),
      "UNA riga dell'elenco porta «anche in Conti», ed è il gasolio del 06/07/2026", nota.contrassegni);
    dice(nota.tabella && nota.tabella.wrap && nota.tabella.wrapLarghezza <= nota.tabella.notaLarghezza + 0.5, "la cassa della tabella sta dentro la nota", nota.tabella);
    dice(nota.tabella && nota.tabella.collapse === "collapse" && nota.tabella.thPad !== "1px", "la tabella è stilata (collapse, padding delle intestazioni)", nota.tabella);
    dice(nota.tabella && nota.tabella.doppiaColore && nota.tabella.doppiaColore !== nota.tabella.normaleColore, "la riga doppia ha un inchiostro diverso", [nota.tabella.doppiaColore, nota.tabella.normaleColore]);
    dice(nota.paginaScroll <= nota.paginaClient, `la pagina non scorre di lato a ${LARG}px`, [nota.paginaScroll, nota.paginaClient]);
    console.log("  contrasti:", JSON.stringify(nota.contrasti));
    dice(nota.contrasti && Object.values(nota.contrasti).every((v) => v && parseFloat(v) >= 4.5), "ogni inchiostro della tabella e del contrassegno è almeno 4,5:1", nota.contrasti);
    console.log(`  cassa: scroll ${nota.tabella?.wrapScroll} / visibile ${nota.tabella?.wrapClient} (se scroll > visibile la tabella scorre da sola)`);
  }
}
if (SCATTI) { mkdirSync(OUT, { recursive: true });
  // lo scatto inquadra la nota e l'elenco, non la pagina intera: è lì che si guarda
  await pg.evaluate(() => document.getElementById("cos-ponte")?.scrollIntoView());
  await pg.screenshot({ path: join(OUT, ASSENTE ? "assente.png" : `sano-${LARG}${TEMA ? "-" + TEMA : ""}.png`), fullPage: false }); }
await b.close(); srv.close();
console.log(`\nRisultato ponte Conti→Flotta${ASSENTE ? " (Conti assente)" : ""}: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

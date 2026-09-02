/* GENESI: LE VOLATE PASSANO DALLA PORTA SUI DATI, E LA CHIAVE È QUELLA DI PRIMA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-locale.mjs                 (salva, ricarica, duplica, elimina)
     node genesi-locale.mjs --controprova   (rimette il difetto: DEVE fallire)
     node genesi-locale.mjs --scatti

   PERCHÉ ESISTE. Dal 02/09 (unità 2 di docs/GENESI_FUORI_DAL_BROWSER.md §5)
   la Home di Genesi legge, salva, duplica ed elimina le volate attraverso
   `genesiData()` invece che con `_lsGet/_lsSet` scritte nella pagina. La
   promessa del piano è che PER CHI USA GENESI NON CAMBI NIENTE: sotto c'è la
   stessa chiave `genesiVolate`, con la stessa forma di record e lo stesso
   tetto. Questo banco fa i quattro gesti da utente e guarda DUE cose ogni
   volta: la chiave nel browser (che cosa c'è scritto sotto) e la Home (che
   cosa si vede sopra). Se una delle due dicesse una cosa diversa dall'altra,
   la porta sarebbe una copia debole con un nome nuovo.
   La controprova rimette il difetto più silenzioso: la Home che non legge
   dalla porta (elenco vuoto) mentre la chiave si riempie — la pagina «funziona»
   (salva, dice «Volata salvata») e non mostra niente.
   ⚠️ I banchi che scrivono `genesiVolate` a mano (frasi-limite, campi-assenti,
   foglio-in-cava, documenti-che-escono) restano veri per costruzione: è la
   stessa chiave. Questo banco è l'unico che passa dai BOTTONI. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
/* --offline: il browser è STACCATO dalla rete (unità 4). La pagina da oggi
   prova l'SDK, che importa Firebase da gstatic: senza rete quell'import
   fallisce e la porta DEVE tornare locale da sola — cioè tutto questo banco
   deve passare identico. Misurato, non dedotto (il piano lo pretende). */
const OFFLINE = process.argv.includes("--offline");
const OUT = "/tmp/genesi-locale";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
/* IL DIFETTO DA RIMETTERE: la Home che non chiede alla porta. Il `cerca` cita
   la riga di `renderHome` insieme a quella dopo, perché `await GDB.volate()`
   compare anche in `salvaVolata`. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "const arr=await GDB.volate();\n  if($('hgVolN'))",
   "const arr=[];   /* difetto rimesso dal banco */\n  if($('hgVolN'))"],
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
const ctx = await b.newContext({ viewport: { width: 430, height: 950 } });
const pg = await ctx.newPage();
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
const URL_G = `http://127.0.0.1:${porta}/apps/genesi/genesi.html`;
if (OFFLINE) {
  /* staccata la rete per TUTTO ciò che non è il nostro server: `setOffline`
     spegne anche 127.0.0.1, quindi si lascia passare solo la porta del banco */
  await pg.route("**/*", (r) => (r.request().url().startsWith(`http://127.0.0.1:${porta}/`) ? r.continue() : r.abort("internetdisconnected")));
} else {
  // senza rete vera in questo contenitore, l'import da gstatic morirebbe da solo dopo ~13 s: lo si taglia subito
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
}
await pg.goto(URL_G, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2600);
// il consenso al primo avvio, se c'è, si accetta come farebbe l'utente
await pg.evaluate(() => { const ok = document.getElementById("consensoOk"); if (ok && ok.offsetParent !== null) ok.click(); });

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
const chiave = () => pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("genesiVolate") || "[]"); } catch (e) { return "corrotta"; } });
const home = () => pg.evaluate(() => ({
  righe: [...document.querySelectorAll("#hgVolate .hg-item")].map((x) => ({ id: x.getAttribute("data-id"), nome: (x.querySelector("b") || {}).textContent })),
  conta: (document.getElementById("hgVolN") || {}).textContent,
  vuoto: !!document.querySelector("#hgVolate .hg-empty"),
  schermata: [...document.querySelectorAll("#bottomnav button")].find((x) => x.classList.contains("on"))?.dataset.scr }));
const premi = async (sel) => { await pg.evaluate((s) => { const e = document.querySelector(s); if (e) e.click(); }, sel); await pg.waitForTimeout(350); };
const premiModale = async (etichetta) => {
  const fatto = await pg.evaluate((et) => { const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => x.textContent.trim() === et); if (b) { b.click(); return true; } return false; }, etichetta);
  await pg.waitForTimeout(400); return fatto;
};

dice(errori.length === 0, "nessun errore di pagina all'apertura", errori.slice(0, 3));
dice(await pg.evaluate(() => { const b = document.getElementById("hgPorta"); return !!b && b.hidden === true; }), "senza organizzazione il bottone «Porta nell'organizzazione» c'è ed è nascosto");
const h0 = await home();
dice(h0.schermata === "home", "si parte dalla Home", h0.schermata);
dice((await chiave()).length === 0 && h0.vuoto, "all'inizio la chiave è vuota e la Home dice «Nessuna volata salvata»", [await chiave(), h0]);

// 1 · salva dalla Home: la modale chiede il nome, lo si scrive, si conferma
await premi("#hgSalva");
const campo = await pg.$("#modal-campo");
dice(!!campo, "la modale «Salva la volata» chiede il nome");
if (campo) { await pg.fill("#modal-campo", "Fronte di prova"); dice(await premiModale("Salva"), "premuto «Salva»"); }
await pg.waitForTimeout(500);
let k = await chiave(); let h = await home();
dice(Array.isArray(k) && k.length === 1, "SOTTO: la chiave genesiVolate ha 1 record", k);
if (Array.isArray(k) && k[0]) {
  const r = k[0];
  dice(typeof r.id === "string" && r.id.startsWith("v") && r.nome === "Fronte di prova" && typeof r.data === "string" && r.design && typeof r.design === "object" && typeof r.sintesi === "string",
    "il record ha la forma di sempre: id «v…», nome, data, design, sintesi", Object.keys(r));
}
dice(h.righe.length === 1 && h.righe[0].nome === "Fronte di prova", "SOPRA: la Home mostra la volata appena salvata", h);
dice(/1 salvata/.test(h.conta || ""), "e il contatore dice «1 salvata»", h.conta);
if (CONTROPROVA) dice(difettiRimessi > 0, `il difetto è stato rimesso nella pagina servita (${difettiRimessi} volte)`);

// 2 · ricarica: la chiave è persistente e la Home la rilegge
await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2600);
h = await home(); k = await chiave();
dice(k.length === 1 && h.righe.length === 1 && h.righe[0].id === k[0].id, "dopo la ricarica la Home mostra lo stesso record (stesso id) che sta nella chiave", [k.map((x) => x.id), h.righe]);

// 3 · duplica
await premi("#hgVolate [data-act='dup']");
k = await chiave(); h = await home();
dice(k.length === 2 && k[1].nome === "Fronte di prova (copia)" && k[1].id !== k[0].id, "duplicata: 2 record sotto, la copia col suo nome e un id nuovo", k.map((x) => [x.id, x.nome]));
dice(h.righe.length === 2 && /2 salvate/.test(h.conta || ""), "e sopra 2 righe, «2 salvate»", h);

// 4 · elimina la copia (la Home elenca dal più recente: la copia è la prima riga)
await premi("#hgVolate .hg-item:first-child [data-act='del']");
const modaleDel = await pg.evaluate(() => (document.getElementById("modal-foot") || {}).textContent || "");
dice(/Elimina/.test(modaleDel), "la conferma dell'eliminazione è comparsa, col bottone «Elimina»", modaleDel);
dice(await premiModale("Elimina"), "premuto «Elimina»");
await pg.waitForTimeout(400);
k = await chiave(); h = await home();
dice(k.length === 1 && k[0].nome === "Fronte di prova", "eliminata la copia: sotto resta l'originale", k.map((x) => x.nome));
dice(h.righe.length === 1 && /1 salvata/.test(h.conta || ""), "e sopra 1 riga, «1 salvata»", h);

/* ── unità 3: le altre quattro chiavi, stesso metodo (sotto la chiave, sopra la schermata) ── */
const leggi = (k, vuoto) => pg.evaluate(([k, v]) => { try { return JSON.parse(localStorage.getItem(k) || v); } catch (e) { return "corrotta"; } }, [k, vuoto]);
// 5 · A/B: salva come A, cambia un parametro, salva come B, apri il confronto
await premi("[data-scr='design']"); await pg.waitForTimeout(500);
await premi("#cmpSaveA");
await pg.evaluate(() => { const i = document.getElementById("inB") || document.querySelector("input[data-k='B']"); if (i) { i.value = String((+i.value || 3) + 0.5); i.dispatchEvent(new Event("input", { bubbles: true })); i.dispatchEvent(new Event("change", { bubbles: true })); } });
await pg.waitForTimeout(300);
await premi("#cmpSaveB");
const cmpA = await leggi("genesiCmpA", "null"), cmpB = await leggi("genesiCmpB", "null");
dice(cmpA && cmpA.kpi && cmpA.design && !("slot" in cmpA), "SOTTO: genesiCmpA ha ts/kpi/design e NON il campo slot (forma di cmpSave)", cmpA && Object.keys(cmpA));
dice(cmpB && cmpB.kpi && cmpB.design, "SOTTO: genesiCmpB c'è", cmpB && Object.keys(cmpB));
await premi("#cmpShow"); await pg.waitForTimeout(400);
const cmpTesto = await pg.evaluate(() => (document.getElementById("cmpBody") || {}).textContent || "");
dice(!/Salva prima due progetti/.test(cmpTesto) && cmpTesto.length > 40, "SOPRA: il confronto A/B è disegnato (non dice «Salva prima due progetti»)", cmpTesto.slice(0, 80));
await pg.evaluate(() => { const m = document.getElementById("cmpModal"); if (m) m.style.display = "none"; });
// 6 · la riconciliazione: apri, scrivi una PPV reale, salva
await premi("#riconOpen"); await pg.waitForTimeout(400);
await pg.evaluate(() => { const i = document.getElementById("ric-ppv"); if (i) { i.value = "3,2"; i.dispatchEvent(new Event("input", { bubbles: true })); } const n = document.getElementById("ric-nome"); if (n) n.value = "Volata di prova"; });
await premi("#riconSave"); await pg.waitForTimeout(500);
const ric = await leggi("genesiRicon", "[]");
dice(Array.isArray(ric) && ric.length === 1 && ric[0].real && ric[0].prev, "SOTTO: genesiRicon ha 1 riga con prev e real", ric);
const ricTesto = await pg.evaluate(() => (document.getElementById("riconBody") || {}).textContent || "");
dice(/Volata di prova/.test(ricTesto), "SOPRA: lo storico mostra la riga appena salvata", ricTesto.slice(0, 120));
await pg.evaluate(() => { const m = document.getElementById("riconModal"); if (m) m.style.display = "none"; });
// 7 · la legge di sito: la PPV prima, un referto aggiunto e la legge attivata, la PPV dopo
const ppvPrima = await pg.evaluate(() => typeof computeKPI === "function" ? computeKPI().ppv : (window.__kpi ? window.__kpi().ppv : null));
await premi("#sitoOpen"); await pg.waitForTimeout(400);
for (const [d, w, p] of [[100, 20, 6.5], [200, 20, 2.1], [300, 30, 1.4], [150, 40, 5.2]]) {
  await pg.evaluate(([d, w, p]) => { document.getElementById("sito-d").value = String(d); document.getElementById("sito-w").value = String(w); document.getElementById("sito-p").value = String(p); }, [d, w, p]);
  await premi("#sito-add"); await pg.waitForTimeout(150);
}
const sito1 = await leggi("genesiSito", "null");
dice(sito1 && Array.isArray(sito1.punti) && sito1.punti.length === 4 && sito1.usa === false, "SOTTO: genesiSito ha 4 punti e usa=false (forma di sitoSalva)", sito1);
await pg.evaluate(() => { const c = document.getElementById("sito-usa"); if (c) { c.checked = true; c.dispatchEvent(new Event("change", { bubbles: true })); } });
await pg.waitForTimeout(300);
const sito2 = await leggi("genesiSito", "null");
dice(sito2 && sito2.usa === true && sito2.punti.length === 4, "attivata: usa=true sotto la stessa chiave", sito2 && sito2.usa);
await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2600);
const sitoDopo = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("genesiSito")); } catch (e) { return null; } });
dice(sitoDopo && sitoDopo.usa === true && sitoDopo.punti.length === 4, "dopo la ricarica la legge di sito è ancora lì (letta una volta dalla porta)", sitoDopo);
console.log("  ppv prima della legge di sito:", ppvPrima);
// 8 · le nuvole: scritte da nuvola-poc sotto la stessa chiave, lette dalla Home
await pg.evaluate(() => localStorage.setItem("genesiNuvole", JSON.stringify([{ nome: "fronte-nord.las", puntiMostrati: 1200, puntiTotali: 41230, data: "01/09/2026 10:00", volume: 5200 }])));
await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2600);
const nuv = await pg.evaluate(() => ({ n: document.querySelectorAll("#hgNuvole .hg-item").length, conta: (document.getElementById("hgNuvN") || {}).textContent, testo: (document.getElementById("hgNuvole") || {}).textContent || "" }));
dice(nuv.n === 1 && /1 lavorazione/.test(nuv.conta || "") && /fronte-nord/.test(nuv.testo), "SOPRA: la Home mostra la lavorazione scritta sotto genesiNuvole", nuv);
const hFine = await home();
dice(hFine.righe.length === 1, "e la volata salvata all'inizio è ancora lì dopo tutto il giro", hFine);
// 9 · unità 7, l'altra metà: una volata salvata con un esplosivo che il catalogo non conosce
await pg.evaluate(() => { const a = JSON.parse(localStorage.getItem("genesiVolate") || "[]"); const v = JSON.parse(JSON.stringify(a[0]));
  v.id = "v-strana"; v.nome = "Volata con esplosivo ignoto"; v.design.esplosivo = "dinamite-x"; v.design.kgAuto = "sì"; a.push(v); localStorage.setItem("genesiVolate", JSON.stringify(a)); });
await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2600);
await pg.evaluate(() => { const ok = document.getElementById("consensoOk"); if (ok && ok.offsetParent !== null) ok.click(); });
await premi("#hgVolate .hg-item[data-id='v-strana'] [data-act='apri']"); await pg.waitForTimeout(700);
const aperta = await pg.evaluate(() => ({ toast: [...document.querySelectorAll(".toast, #toast, .dw-toast")].map((t) => t.textContent.replace(/\s+/g, " ").trim()).join(" | "),
  espl: document.getElementById("dEspl")?.value || null, schermata: [...document.querySelectorAll("#bottomnav button")].find((x) => x.classList.contains("on"))?.dataset.scr }));
dice(aperta.schermata === "design", "la volata strana si è aperta nel 2D", aperta.schermata);
dice(/2 scelte non si riconoscono: esplosivo \(«dinamite-x»\), carica automatica \(«sì»\)/.test(aperta.toast), "il toast NOMINA l'esplosivo sconosciuto e la bandiera storta, col valore trovato", aperta.toast);
dice(/valori di partenza/.test(aperta.toast), "e dice che al loro posto sono entrati i valori di partenza", aperta.toast);
dice(!!aperta.espl && aperta.espl !== "dinamite-x", "la tendina dell'esplosivo mostra un esplosivo del catalogo, non un vuoto né l'id ignoto", aperta.espl);
dice(errori.length === 0, "nessun errore di pagina in tutto il giro", errori.slice(0, 3));

if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "controprova.png" : "home.png"), fullPage: false }); }
await b.close(); srv.close();
console.log(`\nRisultato porta sui dati di Genesi${OFFLINE ? " (senza rete)" : ""}: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

/* LA NOTA DI CREDITO, PROVATA TOCCANDO LA PAGINA.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node nota-credito.mjs [--porta=8473]
     node nota-credito.mjs --controprova   (rimette il vecchio testo: DEVE fallire)

   PERCHÉ ESISTE. Lo strato dati ha 23 prove in `run-kpi.mjs`, ma niente di
   quello dimostra che dalla pagina ci si ARRIVI. La finestra che elimina una
   fattura spiegava — testuale — che «una fattura realmente emessa non va
   cancellata, va gestita con una nota di credito», e poi offriva **un solo
   bottone**, che è quello che la regola viola. Il documento di cui parlava non
   esisteva.
   E il difetto che questo banco ha trovato al primo colpo non era nei dati:
   `numeroDaCampo` restituisce un OGGETTO, non un numero, e la pagina gli
   passava l'oggetto a `validaNota` — dove `+oggetto` è NaN e diventa zero.
   Risultato: «l'importo dev'essere maggiore di zero» su un campo che diceva
   18300. Nessun errore in console, nessuna prova di `node` che lo vedesse. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
const R = "/home/user/Mining-Tech-Platform";

const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8473;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
let iniezioni = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si serve la pagina «com'era», cioè con la finestra che offre
     una strada sola. Si tocca la risposta HTTP, mai il file. */
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    const a = '"Elimina", true, "Emetti nota di credito");';
    iniezioni += (t.split(a).length - 1);
    t = t.replace(a, '"Elimina", true);');
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));
const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html`);
await pg.waitForTimeout(2200);

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x)}` : ""}`); } };
/* ⚠️ IL BANCO DEVE FALLIRE, NON MORIRE. Alla prima controprova è morto: senza
   il bottone nuovo, `.find(...).click()` solleva dentro `evaluate` e il
   processo se ne va — e un banco spento a metà non dice quante prove ha fatto.
   È lo stesso difetto già corretto in `genesi-struttura.mjs` lo stesso giorno:
   due banchi scritti a poche ore di distanza, lo stesso buco. */
const misura = async (fn, arg) => {
  try { return await pg.evaluate(fn, arg); }
  catch (e) { return { __rotto: String(e.message).split("\n")[0].slice(0, 110) }; }
};
const tocca = async (etichetta) => misura((t) => {
  const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => x.textContent === t);
  if (!b) return { __rotto: `nessun bottone «${t}» nella finestra` };
  b.click(); return true;
}, etichetta);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

await pg.click("#nav-fat").catch(() => {});
await pg.waitForTimeout(700);
/* i bottoni delle righe vivono dentro le fisarmoniche chiuse: si aprono come
   farebbe una persona, non forzando gli stili — è la regola del giro */
for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
  await acc.click({ timeout: 2500 }).catch(() => {});
  await pg.waitForTimeout(120);
}
await pg.waitForTimeout(400);
const prima = await pg.evaluate(() => {
  const b = document.querySelector("[data-del-fat]");
  return { bottone: !!b, id: b && b.getAttribute("data-del-fat") };
});
dice(prima.bottone, "c'è una fattura con il bottone elimina", prima);

await pg.click("[data-del-fat]");
await pg.waitForTimeout(500);
const finestra = await misura(() => ({
  bottoni: [...document.querySelectorAll("#modal-foot .mbtn")].map((x) => x.textContent),
  dice: (document.getElementById("modal-body").textContent || "").includes("stornata con una nota di credito"),
}));
dice(!!finestra && (finestra.bottoni || []).length === 3, "la finestra offre TRE strade, non una sola", finestra);
dice(!!finestra && (finestra.bottoni || []).includes("Emetti nota di credito"), "e una è la nota di credito", finestra);
dice(!!finestra && finestra.dice === true, "e il testo indica la strada giusta", finestra);

const apre = await tocca("Emetti nota di credito");
dice(apre === true, "il bottone della nota si può premere", apre);
await pg.waitForTimeout(500);
const form = await misura(() => {
  const c = document.getElementById("nc-causale"), i = document.getElementById("nc-importo");
  return { causali: c ? c.options.length : 0, importo: i ? i.value : null,
    titolo: (document.getElementById("modal-title") || {}).textContent,
    corpo: (document.getElementById("modal-body").textContent || "").slice(0, 160) };
});
dice(!!form && form.causali === 6, "il modulo ha le sei causali", form);
dice(/^NC\/\d{4}\/\d{3}$/.test(String(form.titolo || "").replace("Nota di credito ", "")),
  "e il numero è della serie dedicata NC/", form);
dice(!!form && !!form.importo, "l'importo è precompilato con lo stornabile", form);

/* si emette per intero */
const emette = await tocca("Emetti");
dice(emette === true, "il bottone «Emetti» si può premere", emette);
await pg.waitForTimeout(900);
const dopo = await misura((id) => {
  const riga = document.querySelector(`[data-del-fat="${id}"]`);
  const card = riga && riga.closest(".item");
  return { badge: card ? (card.querySelector(".badge") || {}).textContent : null,
    esito: (document.getElementById("ft-esito") || {}).textContent };
}, prima.id);
dice(!!dopo && /Stornata/.test(String(dopo.badge || "")), "la fattura porta il badge «Stornata»", dopo);
dice(!!dopo && /Nota di credito NC\//.test(String(dopo.esito || "")), "e l'esito lo dice col numero", dopo);

/* e la nota si RILEGGE: emetterla e non poterla più vedere sarebbe un documento
   fiscale che esiste solo come effetto su un altro */
const elenco = await misura(() => {
  const sez = document.getElementById("nc-sez");
  const righe = [...document.querySelectorAll("#nc-list .item")];
  return { visibile: !!sez && !sez.hidden, righe: righe.length,
    testo: righe.length ? righe[0].textContent.replace(/\s+/g, " ").trim().slice(0, 150) : null };
});
dice(!!elenco && elenco.visibile === true, "la sezione delle note di credito compare", elenco);
dice(!!elenco && elenco.righe === 1, "con una riga", elenco);
dice(!!elenco && /storna la fattura/.test(String(elenco.testo || "")),
  "e la riga dice DA QUALE fattura storna", elenco);
dice(!!elenco && /Merce resa|Totale/.test(String(elenco.testo || "")),
  "e con quale causale", elenco);
dice(errori.length === 0, "e nessun errore in pagina", errori.slice(0, 2));

/* ── E IL RIEPILOGO IVA, che è quello che si guarda per il registro ───────
   Una nota di credito abbassa imponibile e IVA del periodo (art. 26 DPR
   633/1972). Se il riepilogo non la vede, il numero è più ALTO del vero: si
   dichiarerebbe più imponibile di quello che c'è. E le due cifre vanno
   MOSTRATE, non sottratte in silenzio — una sottrazione invisibile dentro un
   totale è indistinguibile da un errore. */
const iva = await misura(() => {
  const t = (document.getElementById("fat-tot") || {}).textContent || "";
  return { testo: t.replace(/\s+/g, " "), vede: /Nota di credito|Note di credito/.test(t),
    netto: /Imponibile al netto/.test(t) && /IVA al netto/.test(t),
    norma: /art\. 26/.test(t) };
});
dice(!!iva && iva.vede === true, "⛔ il riepilogo IVA vede la nota di credito", iva && iva.testo.slice(-160));
dice(!!iva && iva.netto === true, "e mostra imponibile e IVA AL NETTO, accanto al lordo", iva && iva.testo.slice(-160));
dice(!!iva && iva.norma === true, "citando la norma che lo impone", iva && iva.testo.slice(-120));

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} sostituzioni nella risposta HTTP`);
  if (iniezioni === 0) { console.log("⚠️ NESSUNA INIEZIONE: la controprova non prova niente"); process.exit(3); }
  console.log(ko >= 3 ? "✓ il banco SA fallire: senza la strada nuova cadono le prove giuste"
                      : "⚠️ troppo poche cadute");
  process.exit(ko >= 3 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

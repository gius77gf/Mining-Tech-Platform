/* I FOGLI CHE IL CLIENTE TIENE IN MANO — Conti, provati premendo il bottone.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-stampe.mjs [--porta=8601]
     node conti-stampe.mjs --controprova   (rimette i tre difetti: DEVE fallire)
     node conti-stampe.mjs --scatti        (salva le schermate in /tmp)

   PERCHÉ ESISTE. Le prove `node` chiamano il modulo; i FOGLI li compone la
   pagina, con `fogliFattura`, e lì non guardava nessuno. È il posto dove sono
   nati tutti e tre i difetti che questo banco tiene chiusi:

   1. una fattura con due aliquote (5.000 al 22% + 2.000 al 10%) stampava nel
      piede «IVA 19%» — l'aliquota ricavata per divisione, che in Italia non
      esiste — sotto due righe che dicevano 22% e 10%;
   2. una fattura annullata da una nota di credito stampava «Da incassare» e il
      totale pieno, mentre l'elenco a due centimetri portava il badge
      «Stornata»: il foglio chiedeva i soldi di un documento annullato;
   3. una fattura nata dai DDT e poi corretta con la ✎ (che riscrive i totali e
      NON le righe) stampava righe che sommano 8.300 e un piede che dice 8.540,
      senza dirlo da nessuna parte.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, non nel file su disco: il server
   qui sotto appende in coda a `conti-data.js` tre righe che aggiungono a DEMO
   la fattura mista, quella stornata e quella corretta a mano. Il file del repo
   non si tocca — accanto ci sono cantieri che scrivono, e un giro del browser
   che gira. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8601;
/* ⚠️ DUE CONTROPROVE, E LA SECONDA È NATA PERCHÉ LA PRIMA «NON DISTINGUEVA».
   Rimettendo TUTTI i difetti insieme, l'avviso della ✎ continuava ad alzarsi:
   il difetto del modulo (l'aliquota 19 ricavata per divisione) rimette un
   numero NON rappresentabile nella tendina, e quindi ri-accende proprio
   l'avviso che l'altro difetto doveva spegnere. Due iniezioni che si
   annullano — la seconda causa dell'elenco di CLAUDE.md, difesa in
   profondità, vista al contrario. Lo strato si prova da solo. */
const CONTRO_MATITA = process.argv.includes("--controprova-matita");
const CONTROPROVA = process.argv.includes("--controprova") || CONTRO_MATITA;
const SCATTI = process.argv.includes("--scatti");
const CARTELLA_SCATTI = "/tmp/conti-stampe";

/* I CASI, appesi in coda al modulo servito. `contiData()` in demo fa
   `JSON.parse(JSON.stringify(DEMO))`, quindi basta mutare l'oggetto al
   caricamento. Le tre fatture NON sono incassate: hanno tutte il bottone di
   stampa e la ✎, come quelle vere. */
const CASI = `
/* ── casi montati dal banco conti-stampe.mjs (mai sul disco) ── */
DEMO.fatture.push({
  id: "zmix", numero: "2026/090", cliente: "Edilcave Srl", clienteId: "c1",
  emessa: "2026-07-30", scadenza: "2026-08-29", incassata: false, tipo: "differita",
  righe: [
    { descrizione: "Stabilizzato 0/30", quantita: 500, unita: "t", prezzoUnitario: 10, scontoPct: 0, imponibile: 5000, aliquota: 22, ddt: ["2026/020"] },
    { descrizione: "Massi da scogliera", quantita: 200, unita: "t", prezzoUnitario: 10, scontoPct: 0, imponibile: 2000, aliquota: 10, ddt: ["2026/021"] },
  ],
  ddtIds: ["zd1", "zd2"], imponibile: 7000, ivaImporto: 1300, totale: 8300, importo: 8300, aliquotaIva: null,
});
DEMO.fatture.push({
  id: "zsto", numero: "2026/091", cliente: "Stradesud", clienteId: "c2", importo: 6100,
  imponibile: 5000, ivaImporto: 1100, totale: 6100, aliquotaIva: 22,
  emessa: "2026-06-02", scadenza: "2026-07-02", incassata: false, righe: [], ddtIds: [],
});
DEMO.fatture.push({
  id: "zmat", numero: "2026/092", cliente: "Edilcave Srl", clienteId: "c1",
  emessa: "2026-07-28", scadenza: "2026-08-27", incassata: false, tipo: "differita",
  righe: [
    { descrizione: "Stabilizzato 0/30", quantita: 500, unita: "t", prezzoUnitario: 10, scontoPct: 0, imponibile: 5000, aliquota: 22, ddt: ["2026/022"] },
    { descrizione: "Massi da scogliera", quantita: 200, unita: "t", prezzoUnitario: 10, scontoPct: 0, imponibile: 2000, aliquota: 10, ddt: ["2026/023"] },
  ],
  ddtIds: ["zd3", "zd4"],
  /* la ✎ ha riscritto i totali a 22% su tutto e ha lasciato le righe com'erano */
  imponibile: 7000, ivaImporto: 1540, totale: 8540, importo: 8540, aliquotaIva: 22,
});
DEMO.note = [{ id: "zn1", tipo: "TD04", numero: "NC/2026/001", emessa: "2026-07-20",
  cliente: "Stradesud", clienteId: "c2", fatturaId: "zsto", fatturaNumero: "2026/091",
  causale: "resa", imponibile: 5000, ivaImporto: 1100, totale: 6100, aliquotaIva: 22, integrale: true }];
`;

/* LA CONTROPROVA rimette i tre difetti nella PAGINA servita, uno per difetto,
   e conta le sostituzioni: un `replace` che non trova niente esce in silenzio. */
const PAGINA = "apps/conti/index.html", MODULO = "apps/conti/conti-data.js";
/* ⏱️ dal 05/09 il foglio della fattura lo compone `fogliaFattura` nel MODULO:
   i difetti 1, 2, 3 e 5 si rimettono lì (terzo posto della tupla); il 4 resta
   nella pagina (la ✎). */
const DIFETTI = [
  // 1. il piede con l'aliquota unica ricavata per divisione
  [`      .concat(rie.bande.map((b) => ({ tipo: "iva",
        etichetta: "IVA" + (b.aliquota == null ? " **(aliquota non indicata)**" : " " + percTx(b.aliquota)) + (rie.bande.length > 1 ? " su " + euro(b.imponibile) : ""),
        valore: euro(b.imposta), mancante: b.aliquota == null })))`,
   `      .concat([{ tipo: "iva", etichetta: "IVA" + (im.aliquota != null ? " " + percTx(im.aliquota) : ""), valore: euro(im.ivaImporto), mancante: false }])`, MODULO],
  // 2. lo stato letto senza le note di credito
  ["  const st = statoFattura(f, Array.isArray(incassi) ? incassi : [], Array.isArray(note) ? note : []);\n  const notePro = (Array.isArray(note) ? note : []).filter((n) => n && String(n.fatturaId) === String(f.id) && !n.bozza);",
   "  const st = statoIncasso(f, Array.isArray(incassi) ? incassi : []);\n  const notePro = [];", MODULO],
  /* 4. l'ORDINE delle due righe della ✎. È il difetto che ho scritto io per
        primo e che il banco ha trovato: assegnando lo zero PRIMA di guardare,
        la tendina lo accetta e risponde «rappresentabile», quindi l'avviso non
        si alza proprio sul caso per cui esiste. */
  ['$("ft-iva").value = im.aliquota == null ? "" : String(im.aliquota);\n        const rappresentabile = im.aliquota != null && $("ft-iva").value !== "";',
   '$("ft-iva").value = String(im.aliquota != null ? im.aliquota : 0);\n        const rappresentabile = $("ft-iva").value !== "";'],
  // 5. l'etichetta del DDT che promette un'ora che non c'è
  ['["Data del ritiro", dataIt(String(p.data).slice(0, 10)), false]', '["Data e ora di ritiro", dataIt(String(p.data).slice(0, 10)), false]', MODULO],
  // 3. il riquadro che dichiara le righe che non tornano
  ["  if (!rie.quadra)\n    avvisi.push(", "  if (false)\n    avvisi.push(", MODULO],
];
/* ⛔ E UN DIFETTO STA NEL MODULO, NON NELLA PAGINA — misurato scrivendo questa
   controprova, ed è la quarta causa dell'elenco di CLAUDE.md (l'iniezione
   puntata nel posto sbagliato): rimessi i tre difetti della PAGINA, la prova
   «il foglio non scrive 19%» continuava a passare, perché il 19 lo produceva
   `importiFattura`, che la pagina si limitava a stampare. Una controprova che
   inietta solo metà della catena dichiara verde una prova che non ha messo
   niente alla prova. Il quarto difetto rimette la divisione nel modulo, e
   allora la catena si vede per intero: modulo → piede del foglio. */
const DIFETTO_MODULO = [
  "const aliquota = f.aliquotaIva != null ? +f.aliquotaIva : aliquotaSolaDelleRighe(f, imponibile, ivaImporto);",
  "const aliquota = f.aliquotaIva != null ? +f.aliquotaIva : (imponibile > 0 ? Math.round(ivaImporto / imponibile * 100) : null);",
];

let iniezioniCasi = 0, iniezioniDifetti = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER. Un banco che trova
     la porta occupata e la RIUSA non fallisce: misura la copia di qualcun
     altro, e per un'ora dice cose vere su una cartella che nessuno guarda. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* ogni difetto va al file che dichiara (terzo posto della tupla; senza, la
     pagina): applicare tutto alla pagina lascia le iniezioni sul modulo
     «fresche» per iniezioni-fresche e MAI rimesse per questo banco */
  const applica = (t, file) => {
    for (const [da, a, f] of (CONTRO_MATITA ? DIFETTI.filter((d) => d[0].includes("ft-iva")) : DIFETTI)) {
      if ((f || PAGINA) !== file) continue;
      const n = t.split(da).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti per «${da.slice(0, 60)}…»`); continue; }
      t = t.replace(da, a); iniezioniDifetti++;
    }
    return t;
  };
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA && !CONTRO_MATITA) {
      const n = t.split(DIFETTO_MODULO[0]).length - 1;
      if (n !== 1) console.log(`⛔ INIEZIONE MANCATA nel modulo: ${n} soggetti`);
      else { t = t.replace(DIFETTO_MODULO[0], DIFETTO_MODULO[1]); iniezioniDifetti++; }
    }
    if (CONTROPROVA) t = applica(t, MODULO);
    t += CASI; iniezioniCasi++;
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA. Riusare il server di qualcun
   altro non fallisce — misura la sua copia, e risponde cose vere su una
   cartella che nessuno sta guardando. Qui girano cantieri paralleli, quindi si
   provano dodici porte e ci si ferma solo se non ce n'è nessuna libera; poi si
   RILEGGE DAL SERVER il contrassegno col proprio pid, che è la sola prova che
   quello che risponde è mio. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
/* `window.print()` in headless non apre niente e non fa scattare `afterprint`:
   il foglio resta nel DOM, che è esattamente quello che serve leggere. Lo si
   stordisce comunque, per non dipendere dal comportamento del motore. */
await pg.addInitScript(() => { window.print = () => { window.__stampato = (window.__stampato || 0) + 1; }; });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2400);

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

await pg.click("#nav-fat").catch(() => {});
await pg.waitForTimeout(700);
for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
  await acc.click({ timeout: 2500 }).catch(() => {});
  await pg.waitForTimeout(120);
}
await pg.waitForTimeout(400);

/* ⛔ PRIMA DI MISURARE: la prova di aver navigato E che i casi siano arrivati.
   Un banco che misura una schermata che non c'è risponde «tutto a posto». */
const presenti = await pg.evaluate(() => ["zmix", "zsto", "zmat"]
  .map((id) => !!document.querySelector(`[data-stampa-fat="${id}"]`)));
dice(presenti.every(Boolean), "i tre casi sono nell'elenco, col loro bottone di stampa", presenti);

const stampa = async (id) => {
  await pg.click(`[data-stampa-fat="${id}"]`);
  await pg.waitForTimeout(350);
  return pg.evaluate(() => {
    const el = document.getElementById("stampa");
    return { testo: (el.textContent || "").replace(/\s+/g, " ").trim(), html: el.innerHTML };
  });
};

// ── 1. le due aliquote, e nessuna media inventata ──────────────────────────
const mix = await stampa("zmix");
if (process.argv.includes("--dimmi")) console.log("\n[piede mista]", (mix.testo.match(/Totale imponibile.*?Totale fattura[^ ]* [^ ]+/) || ["(non trovato)"])[0], "\n");
dice(!/\b19\s?%/.test(mix.testo), "il foglio della fattura mista NON scrive «19%»", mix.testo.slice(0, 300));
dice(/IVA 22% su/.test(mix.testo) && /IVA 10% su/.test(mix.testo),
  "scrive una riga per aliquota, con l'imponibile di ognuna", mix.testo.slice(0, 400));
dice(/€ 1\.100,00/.test(mix.testo) && /€ 200,00/.test(mix.testo),
  "e le due imposte, 1.100 e 200", mix.testo.slice(0, 400));
dice(/Totale imposta/.test(mix.testo) && /€ 1\.300,00/.test(mix.testo),
  "col totale dell'imposta che le somma", mix.testo.slice(0, 400));
dice(/Totale fattura.*€ 8\.300,00/.test(mix.testo), "e il totale del documento", mix.testo.slice(-260));
dice(!/Le righe qui sopra non tornano/.test(mix.testo),
  "questa fattura quadra, e il riquadro non compare");

// ── 2. la fattura annullata da una nota di credito ─────────────────────────
const sto = await stampa("zsto");
if (process.argv.includes("--dimmi")) console.log("\n[stato stornata]", (sto.testo.match(/Pagamento entro il.*?(?=Documento di cortesia)/) || ["(non trovato)"])[0], "\n");
dice(/annullata da una nota di credito/i.test(sto.testo),
  "il foglio della fattura stornata lo dichiara", sto.testo.slice(0, 400));
dice(/NC\/2026\/001/.test(sto.testo) && /Merce resa o rifiutata/.test(sto.testo),
  "elenca la nota col suo numero e la sua causale", sto.testo.slice(0, 500));
dice(/Annullata da nota di credito/.test(sto.testo),
  "e nella casella «Stato» non c'è più «Da incassare»", sto.testo.slice(0, 500));
dice(/Importo ancora esigibile.*€ 0,00/.test(sto.testo),
  "l'esigibile è zero, scritto", sto.testo.slice(0, 600));

// ── 3. le righe che non tornano col piede ──────────────────────────────────
const mat = await stampa("zmat");
dice(/Le righe qui sopra non tornano con il totale/.test(mat.testo),
  "la fattura corretta a mano lo dichiara sul foglio", mat.testo.slice(0, 400));
dice(/€ 8\.300,00/.test(mat.testo) && /€ 8\.540,00/.test(mat.testo),
  "con tutt'e due i numeri: quello delle righe e quello registrato", mat.testo.slice(0, 600));

// ── 4. la fattura senza scadenza: il campo vuoto dice perché ───────────────
const f7 = await stampa("f7");
if (process.argv.includes("--dimmi")) console.log("\n[f7]", f7.testo, "\n");
dice(/Pagamento entro il\s*non indicato/.test(f7.testo),
  "«Pagamento entro il» non resta un trattino muto", f7.testo.slice(0, 400));

// ── 5. la ✎ non ripiega su «0% esente» in silenzio ─────────────────────────
/* È LA CAUSA A MONTE del foglio che si smentisce: la tendina dell'IVA ha
   cinque opzioni, e un'aliquota che non è fra loro (o che non esiste, come
   nelle fatture a più aliquote) diventava «0% — esente» senza una parola.
   Un «Salva modifica» fatto per correggere la scadenza azzerava 1.300 € di
   imposta. Lo zero si mette ancora — il campo deve valere qualcosa — ma
   adesso la riga d'esito dice che cosa succede se si salva. */
await pg.click("#nav-fat").catch(() => {});
await pg.waitForTimeout(500);
for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
  await acc.click({ timeout: 2500 }).catch(() => {}); await pg.waitForTimeout(100);
}
await pg.click('[data-edit-fat="zmix"]').catch(() => {});
await pg.waitForTimeout(400);
const matita = await pg.evaluate(() => ({
  iva: (document.getElementById("ft-iva") || {}).value,
  esito: (document.getElementById("ft-esito") || {}).textContent || "",
}));
dice(matita.iva === "0", "la tendina ripiega su 0% (il campo deve pur valere qualcosa)", matita);
dice(/non si riassume in una delle aliquote/.test(matita.esito) && /verrebbe azzerata/.test(matita.esito),
  "ma lo dice, e dice che salvando l'imposta si azzera", matita.esito.slice(0, 300));
dice(/1\.300,00/.test(matita.esito), "col numero che si perderebbe", matita.esito.slice(0, 300));
if (SCATTI) {
  mkdirSync(CARTELLA_SCATTI, { recursive: true });
  for (const w of [390, 320]) {
    await pg.setViewportSize({ width: w, height: 900 });
    await pg.waitForTimeout(300);
    await pg.evaluate(() => document.getElementById("ft-esito").scrollIntoView({ block: "center" }));
    await pg.waitForTimeout(250);
    await pg.screenshot({ path: `${CARTELLA_SCATTI}/matita-${w}.png` });
  }
  await pg.setViewportSize({ width: 430, height: 950 });
  await pg.waitForTimeout(250);
}

// ── 6. il DDT e il preventivo si stampano ancora ───────────────────────────
await pg.click("#nav-pes").catch(() => {});
await pg.waitForTimeout(700);
for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
  await acc.click({ timeout: 2500 }).catch(() => {}); await pg.waitForTimeout(100);
}
const ddt = await pg.evaluate(async () => {
  const b = document.querySelector("[data-stampa-ddt]");
  if (!b) return null;
  b.click(); await new Promise((r) => setTimeout(r, 250));
  return (document.getElementById("stampa").textContent || "").replace(/\s+/g, " ").trim();
});
dice(!!ddt && /Documento di trasporto/.test(ddt), "il DDT si stampa ancora", (ddt || "").slice(0, 200));
/* l'etichetta prometteva «Data e ora di ritiro» e stampava una data sola: la
   pesata la scrive un `<input type="date">`, l'ora non c'è mai stata. */
dice(!!ddt && !/ora di ritiro/i.test(ddt) && /Data del ritiro/.test(ddt),
  "e non promette un'ora che il documento non ha", (ddt || "").slice(0, 300));
if (SCATTI) {
  mkdirSync(CARTELLA_SCATTI, { recursive: true });
  await pg.setViewportSize({ width: 794, height: 1123 });
  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: `${CARTELLA_SCATTI}/foglio-ddt.png`, fullPage: true });
  await pg.emulateMedia({ media: "screen" });
  await pg.setViewportSize({ width: 430, height: 950 });
}

// ── gli scatti: la schermata da cui si stampa, a 390 e a 320 ───────────────
if (SCATTI) {
  mkdirSync(CARTELLA_SCATTI, { recursive: true });
  await pg.click("#nav-fat").catch(() => {});
  await pg.waitForTimeout(600);
  for (const w of [390, 320]) {
    await pg.setViewportSize({ width: w, height: 900 });
    await pg.waitForTimeout(400);
    await pg.screenshot({ path: `${CARTELLA_SCATTI}/schermo-${w}.png`, fullPage: false });
  }
  await pg.setViewportSize({ width: 794, height: 1123 });   // A4 a 96 dpi
  await pg.emulateMedia({ media: "print" });
  for (const [id, nome] of [["zmix", "mista"], ["zsto", "stornata"], ["zmat", "corretta"]]) {
    await pg.evaluate((x) => document.querySelector(`[data-stampa-fat="${x}"]`).click(), id);
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: `${CARTELLA_SCATTI}/foglio-${nome}.png`, fullPage: true });
  }
  await pg.emulateMedia({ media: "screen" });
  console.log(`  scatti in ${CARTELLA_SCATTI}`);
}

await b.close(); srv.close();
console.log(`\nRisultato fogli di Conti: ${ok} passati, ${ko} falliti  ·  ${iniezioniCasi} volte i casi montati nei dati serviti${CONTROPROVA ? `  ·  ${iniezioniDifetti} difetti rimessi nella pagina` : ""}`);
if (CONTROPROVA) {
  const attesi = CONTRO_MATITA ? 1 : DIFETTI.length + 1;   // i quattro della pagina + quello del modulo
  if (iniezioniDifetti !== attesi) { console.log(`✗ controprova non valida: ${iniezioniDifetti} difetti rimessi su ${attesi}`); process.exit(1); }
  console.log(ko > 0 ? "✔ controprova: il banco SA fallire" : "✗ controprova: il banco NON distingue");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

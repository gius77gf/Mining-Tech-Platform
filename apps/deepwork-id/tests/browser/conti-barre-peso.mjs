/* LE BARRE DI PESO DI CONTI, MISURATE IN PIXEL.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-barre-peso.mjs [--porta=8751]
     node conti-barre-peso.mjs --controprova   (rimette il difetto: DEVE fallire)
     node conti-barre-peso.mjs --scatti        (salva le schermate in /tmp)

   PERCHÉ ESISTE. È il filo del 06/08 — «il numero è giusto e a mentire è il
   DISEGNO» — applicato all'app dei soldi. Nel core una barra dichiarava
   `height:100%` e `data-val="2261.7 mc"` e veniva disegnata 3 px, identica ai
   mesi a zero: nessun errore da leggere, CSS valido, console muta. Solo lo
   scatto e una misura in pixel lo dicono.

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO, misurato qui dentro. Le quattro
   liste di Conti che hanno una barra sotto la riga — flusso emesso/incassato,
   invecchiamento del credito, previsione incassi, esposizione per cliente — se
   la scrivevano da sole, tutte con la stessa riga:
       width: Math.round(importo / massimo * 100) + '%'
   Due bugie del disegno, e il numero accanto era giusto in tutt'e due i casi:
   1. sotto lo 0,5% della scala l'arrotondamento all'intero dà `width:0%`, cioè
      il disegno che si fa per uno ZERO VERO. Con una fattura da 480.000 € in
      archivio la fascia «scaduto 61–90 gg» con 12 € dentro usciva **0 px**,
      identica alle due fasce accanto che di fatture non ne hanno nessuna —
      mentre la riga a due centimetri diceva «1 fattura · € 12,00»;
   2. il passo dell'1% vale ~4 px: 9.750 € e 8.100 € finivano tutt'e due a
      **7,96 px**, e 5.900 € e 4.400 € tutt'e due a **3,98 px**. Importi che
      differiscono di un terzo, pixel identici.
   La regola giusta era già in casa, in due posti: `shared/dw-grafici.js` tiene
   ogni barra a un minimo di 2 unità (`Math.max(2, …)`) e il core, dal 06/08,
   tiene `min-height:3px`. Le liste se n'erano tenuta una versione più debole:
   la copia debole di CLAUDE.md, nel posto dove il documento si compone.

   ⛔ IL CASO SI COSTRUISCE NEI DATI SERVITI, mai sul disco: accanto girano
   cantieri e un modulo dati se lo carica anche il browser. Senza un valore
   ALTO il difetto non si vede — nella dimostrazione gli importi stanno tutti
   in un fattore 5, quindi nessuno scende sotto l'1% e tutte le barre sembrano
   giuste. È la stessa ragione per cui nel core il difetto è rimasto nascosto
   finché non c'è stata una barra alta.

   ⚠️ LA PROVA CHE CONTA È IL RAPPORTO FRA DUE VALORI DIVERSI. Un campione solo
   non distingue «disegna in proporzione» da «disegna tutte uguali»: qui i
   valori sono tre — uno grande (480.000 €), uno ordinario e uno minuscolo
   (12 €) — più lo zero vero, che deve restare a zero pixel.

   La parte che si prova senza browser (due numeri dentro, una stringa fuori)
   sta in `run-kpi.mjs`, sezione «la barra di peso»: qui c'è solo quello che
   soltanto i pixel possono dire. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8751;
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const CARTELLA_SCATTI = "/tmp/conti-barre-peso";

/* I CASI, appesi in coda al modulo servito. `contiData()` in demo fa
   `JSON.parse(JSON.stringify(DEMO))`, quindi basta mutare l'oggetto al
   caricamento.
   · zalto  — la fattura GRANDE: senza di lei tutto sta in un fattore 5 e il
     difetto non si presenta. Non scaduta, così domina l'aging e la previsione.
   · zmini  — 12 € VERI, in una fascia di ritardo TUTTA SUA (61–90 giorni), così
     la sua barra si legge accanto a due fasce vuote: è il confronto che dice
     se il disegno distingue «dodici euro» da «niente». */
const CASI = `
/* ── casi montati dal banco conti-barre-peso.mjs (mai sul disco) ── */
DEMO.fatture.push({ id: "zalto", numero: "2026/900", cliente: "Grandi Opere SpA",
  importo: 480000, emessa: "2026-07-05", scadenza: "2026-09-30", incassata: false });
DEMO.fatture.push({ id: "zmini", numero: "2026/901", cliente: "Piccolo Cliente",
  importo: 12, emessa: "2026-06-05", scadenza: "2026-05-20", incassata: false });
`;

/* LA CONTROPROVA rimette il difetto nel MODULO servito — la funzione che decide
   la geometria — e conta le sostituzioni: un `replace` che non trova niente esce
   in silenzio e dichiara un verde che non ha misurato niente. */
const DIFETTO = [
  `export function stileBarraPeso(valore, massimo) {
  const v = +valore, m = +massimo;
  if (valore == null || !Number.isFinite(v) || !Number.isFinite(m) || m <= 0) return null;
  if (v <= 0) return "width:0%";
  return \`width:\${+Math.min(100, (v / m) * 100).toFixed(4)}%;min-width:3px\`;
}`,
  `export function stileBarraPeso(valore, massimo) {
  return \`width:\${Math.round((+valore || 0) / (+massimo) * 100)}%\`;
}`,
];

let iniezioniCasi = 0, iniezioniDifetto = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER: un banco che trova
     la porta occupata e la RIUSA non fallisce, misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/conti/conti-data.js")) {
    let t = corpo.toString("utf8") + CASI; iniezioniCasi++;
    if (CONTROPROVA) {
      const n = t.split(DIFETTO[0]).length - 1;
      if (n !== 1) console.log(`⛔ INIEZIONE MANCATA nel modulo: ${n} soggetti invece di 1`);
      else { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA. Poi si RILEGGE dal server il
   contrassegno col proprio pid, che è la sola prova che quello che risponde è
   mio — la forma silenziosa della trappola è peggiore di quella rumorosa. */
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
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0, misurate = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, `i casi sono stati serviti (${iniezioniCasi} volte)`);
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nel modulo servito", iniezioniDifetto);

/* ⛔ PRIMA DI MISURARE, LA PROVA DI AVER NAVIGATO: `vaiA` col nome sbagliato
   fotografa otto volte la stessa schermata senza dire niente. Qui si pretende
   che la `.page` viva sia proprio quella chiesta. */
const vaiA = async (sez) => {
  await pg.click("#nav-" + sez);
  await pg.waitForTimeout(600);
  const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
  if (!vive.includes("page-" + sez)) { console.log(`  KO  navigazione a ${sez}: la pagina viva è ${JSON.stringify(vive)}`); ko++; return false; }
  for (const acc of await pg.$$("details:not([open]) > summary, .dc-sec.closed .dc-sec-h")) {
    await acc.click({ timeout: 2000 }).catch(() => {});
    await pg.waitForTimeout(60);
  }
  await pg.waitForTimeout(500);
  return true;
};

/* La misura: per ogni `span.bar` visibile, i PIXEL disegnati e l'IMPORTO che la
   riga dichiara accanto. Le due cose vengono da due posti diversi apposta —
   il rettangolo dal browser, la cifra dal testo — perché confrontarle è tutto
   il punto del banco. */
const leggiBarre = (lista) => pg.evaluate((id) => {
  const numIt = (t) => parseFloat(String(t).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  const el = document.getElementById(id);
  if (!el) return null;
  return [...el.querySelectorAll(".item")].map((it) => {
    const sp = it.querySelector("span.bar");
    const s = sp ? getComputedStyle(sp) : null;
    return {
      riga: (it.querySelector(".name")?.textContent || "").trim().slice(0, 26),
      importo: numIt(it.querySelector(".amt-n")?.textContent || ""),
      testo: (it.querySelector(".amt-n")?.textContent || "").trim(),
      barra: !!sp,
      px: sp ? +sp.getBoundingClientRect().width.toFixed(2) : 0,
      dichiarata: sp ? sp.getAttribute("style") : null,
      calcolata: s ? s.width : null,
      /* ⚠️ `clientWidth`, NON `getBoundingClientRect()`. Una percentuale su un
         elemento in posizione assoluta si risolve contro il PADDING BOX
         dell'antenato posizionato, non contro il suo riquadro esterno: qui la
         `.item` ha `border-left:3px` quando è in allarme e 1px altrimenti,
         quindi il riquadro dice 398 e lo spazio vero è 394. Misurato il 06/08
         perché questo banco ha accusato di difetto tutte e quattro le barre al
         100% — che erano giuste. Il numero sbagliato era il mio. */
      contenitore: sp && sp.offsetParent ? sp.offsetParent.clientWidth : it.clientWidth,
    };
  });
}, lista);

const LISTE = [
  ["rep", "flusso-list", "emesso contro incassato"],
  ["rep", "aging-list", "invecchiamento del credito"],
  ["rep", "prev-list", "previsione incassi"],
  ["rep", "espo-list", "esposizione per cliente"],
];
const raccolto = {};
for (const sez of [...new Set(LISTE.map((l) => l[0]))]) {
  if (!(await vaiA(sez))) continue;
  if (SCATTI) { mkdirSync(CARTELLA_SCATTI, { recursive: true }); await pg.screenshot({ path: join(CARTELLA_SCATTI, sez + ".png"), fullPage: true }); }
  for (const [s, id, nome] of LISTE.filter((l) => l[0] === sez)) {
    const righe = await leggiBarre(id);
    if (!righe || !righe.length) { console.log(`  KO  #${id} (${nome}) è vuota: non ho misurato niente`); ko++; continue; }
    raccolto[id] = righe;
    misurate += righe.length;
  }
}
console.log(`\n${misurate} barre misurate in ${Object.keys(raccolto).length} liste su ${LISTE.length}`);
dice(Object.keys(raccolto).length === LISTE.length, "tutte e quattro le liste sono state raggiunte", Object.keys(raccolto));

/* Il campione accanto al conto: un numero senza il suo campione mente da solo
   (misurato il 06/08 nel core, «0 dati» mentre lo schermo li mostrava). */
for (const [id, righe] of Object.entries(raccolto)) {
  console.log(`\n  #${id}`);
  for (const r of righe) console.log(`     ${r.barra ? "" : "(nessuna barra) "}${r.riga.padEnd(22)} ${r.testo.padStart(14)}  ->  ${String(r.px).padStart(7)} px  su ${r.contenitore}   [${r.dichiarata || "—"}]`);
}
console.log("");

// ══ 1. UN IMPORTO VERO NON SI DISEGNA A ZERO PIXEL ═══════════════════════
{
  const ag = raccolto["aging-list"] || [];
  const mini = ag.find((r) => r.importo === 12);
  const zeri = ag.filter((r) => r.importo === 0);
  dice(!!mini, "la fascia con i 12 € veri è nell'elenco (il caso è arrivato)", ag.map((r) => r.testo));
  /* ⛔ ERA `>= 2`, ED È INVECCHIATO PERCHÉ LA DIMOSTRAZIONE È MIGLIORATA.
     Quando questo banco è nato, «Scaduto oltre 90 gg» e «Senza scadenza»
     erano tutt'e due vuote e la barra dei 12 € si leggeva fra due fasce a
     zero. Poi il commit `069d70e` — «assente non è corrotto: la dimostrazione
     può mostrare il caso» — ha messo nella demo una fattura **senza data di
     scadenza** (4.400 €, `f7`), che è esattamente il caso per cui la difesa
     era stata costruita. Da allora la fascia vuota è **una sola**, e il banco
     accusava il prodotto di un difetto che non ha: `stileBarraPeso` disegna
     3 px per 12 € e 0 px per uno zero vero, e tutte le altre asserzioni
     passavano.
     ⚠️ NON è «allargare per far passare»: il conto che serviva davvero — «lo
     zero è disegnato zero in modo SISTEMATICO, non per caso su una riga sola»
     — non sta qui, sta nella sezione 2, dove si guardano TUTTE le liste e le
     righe a zero sono 8. Lì il fondo è stato **alzato** da `> 0` a `>= 2`.
     Qui resta la domanda diretta, che di vuote ne vuole una: *i 12 € si
     disegnano più della fascia accanto che è vuota davvero?*
     Il conto delle fasce dipende dalla demo e quindi **si stampa**, invece di
     essere una soglia che un dato nuovo fa cadere. */
  dice(zeri.length >= 1,
    `e accanto c'è una fascia a zero da confrontare (${zeri.length} vuote su ${ag.length}: ${zeri.map((r) => r.riga).join(", ") || "nessuna"})`);
  if (mini && zeri.length) {
    dice(mini.px > 0, `12 € veri disegnano più di zero pixel (${mini.px} px)`, mini);
    dice(mini.px > zeri[0].px,
      `e disegnano PIÙ di una fascia vuota: 12 € -> ${mini.px} px, € 0 -> ${zeri[0].px} px`,
      { mini: mini.px, zero: zeri[0].px });
  }
  const espo = raccolto["espo-list"] || [];
  const cli = espo.find((r) => r.importo === 12);
  dice(!!cli && cli.px > 0, `anche il cliente da 12 € ha la sua barra (${cli ? cli.px : "assente"} px)`, cli);
}

// ══ 2. LO ZERO VERO NON GUADAGNA UN SEGNO CHE NON GLI SPETTA ═════════════
{
  const zeri = Object.values(raccolto).flat().filter((r) => r.importo === 0 && r.barra);
  /* ⛔ FONDO ALZATO da `> 0` a `>= 2` il 09/08, ed è il conto che la sezione 1
     ha smesso di fare. Con UNA riga a zero non si distingue «lo zero si
     disegna zero» da «quella riga per caso è a zero»: serve il rapporto fra
     due, come dice l'intestazione di questo file. Qui le righe a zero sono
     otto e non dipendono da una singola fascia della dimostrazione, quindi il
     fondo regge senza invecchiare al primo dato nuovo. */
  dice(zeri.length >= 2, `ci sono righe a zero da controllare (${zeri.length})`);
  const sporchi = zeri.filter((r) => r.px > 0);
  dice(sporchi.length === 0, "nessuno zero vero lascia un segno: uno zero disegnato è «misurato, ed è zero»", sporchi.slice(0, 3));
}

// ══ 3. IL RAPPORTO FRA DUE VALORI DIVERSI ════════════════════════════════
/* La prova che conta. Si confrontano tutte le coppie della stessa lista in cui
   TUTT'E DUE le barre stanno sopra il minimo di 3 px: sotto quella soglia il
   minimo comanda di proposito ed è giusto che comandi. */
{
  let coppie = 0, storte = 0;
  for (const [id, righe] of Object.entries(raccolto)) {
    const utili = righe.filter((r) => r.barra && r.px > 4 && Number.isFinite(r.importo) && r.importo > 0);
    for (let i = 0; i < utili.length; i++) for (let j = i + 1; j < utili.length; j++) {
      const a = utili[i], b = utili[j];
      if (a.importo === b.importo) continue;
      coppie++;
      const attesoRapporto = a.importo / b.importo;
      /* si confrontano le FRAZIONI di pista, non i pixel nudi: due righe con
         un bordo d'allarme diverso hanno piste larghe 394 e 396 */
      const veroRapporto = (a.px / a.contenitore) / (b.px / b.contenitore);
      /* tolleranza: il pixel è discreto e il contenitore è ~398 px, quindi un
         paio di decimi di pixel su una barra corta valgono qualche punto
         percentuale. Il 6% prende il difetto vero (che era +19% e −18%) e non
         inciampa nell'arrotondamento del motore di disegno. */
      const male = Math.abs(veroRapporto / attesoRapporto - 1) > 0.06;
      if (male) { storte++; console.log(`  KO  #${id}: ${a.testo} contro ${b.testo} -> pixel ${a.px}/${b.px} = ${veroRapporto.toFixed(3)}, atteso ${attesoRapporto.toFixed(3)}`); }
    }
  }
  console.log(`  (${coppie} coppie di importi diversi confrontate)`);
  dice(coppie >= 10, `ci sono abbastanza coppie da confrontare (${coppie})`);
  dice(storte === 0, `ogni coppia sta nei pixel del suo rapporto (${storte} storte su ${coppie})`);
}

// ══ 4. DUE IMPORTI DIVERSI NON FINISCONO NEGLI STESSI PIXEL ══════════════
{
  let doppioni = 0, esaminate = 0;
  for (const [id, righe] of Object.entries(raccolto)) {
    const utili = righe.filter((r) => r.barra && r.px > 3.5 && r.importo > 0);
    for (let i = 0; i < utili.length; i++) for (let j = i + 1; j < utili.length; j++) {
      const a = utili[i], b = utili[j];
      if (a.importo === b.importo) continue;
      esaminate++;
      if (a.px === b.px) { doppioni++; console.log(`  KO  #${id}: ${a.testo} e ${b.testo} disegnano gli STESSI ${a.px} px`); }
    }
  }
  console.log(`  (${esaminate} coppie esaminate)`);
  dice(doppioni === 0, `importi diversi, pixel diversi (${doppioni} collisioni)`);
}

// ══ 5. QUELLO CHE LA PAGINA DICHIARA È QUELLO CHE IL BROWSER DISEGNA ═════
/* Il difetto del core era esattamente questo scarto: `style="height:100%"` e
   3 px disegnati. Qui si confronta la larghezza DICHIARATA nello style con
   quella EFFETTIVA, risolta dal browser. */
{
  let controllate = 0, scollate = [];
  for (const [id, righe] of Object.entries(raccolto)) {
    for (const r of righe) {
      if (!r.barra || !r.dichiarata) continue;
      const p = /width:([\d.]+)%/.exec(r.dichiarata);
      if (!p) continue;
      controllate++;
      const attesi = Math.max(/min-width:(\d+)px/.test(r.dichiarata) ? +/min-width:(\d+)px/.exec(r.dichiarata)[1] : 0,
                              (parseFloat(p[1]) / 100) * r.contenitore);
      if (Math.abs(r.px - attesi) > 1.5) scollate.push({ id, riga: r.riga, dichiarata: r.dichiarata, attesi: +attesi.toFixed(2), disegnati: r.px });
    }
  }
  console.log(`  (${controllate} barre con una percentuale dichiarata)`);
  dice(controllate >= 15, `abbastanza barre dichiarate da controllare (${controllate})`);
  dice(scollate.length === 0, "la percentuale dichiarata si risolve nei pixel che dice", scollate.slice(0, 3));
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${misurate} barre misurate su ${Object.keys(raccolto).length} liste${SCATTI ? ` · scatti in ${CARTELLA_SCATTI}` : ""}`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
/* con --controprova l'esito si ROVESCIA: deve fallire */
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

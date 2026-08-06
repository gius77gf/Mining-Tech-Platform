/* IN TERRA IL DISEGNO DICE LA STESSA COSA DEL NUMERO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-geometrie.mjs [--porta=8493]
     node terra-geometrie.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08, nel core, è saltata fuori una forma di numero che
   mente che non era ancora censita: **il numero è giusto e a mentire è il
   DISEGNO**. La barra di luglio del grafico della produzione dichiarava
   `height:100%` con 2.261,7 m³ dentro e ne disegnava **3**, identica ai cinque
   mesi a zero — perché la percentuale si risolveva contro un genitore alto
   `auto`. Nessun errore da leggere: CSS valido, percentuale presente, console
   pulita. E nessuno l'aveva mai vista perché **non c'era mai stata una barra
   alta**: senza dati d'esempio sei stanghette uguali sono esattamente quello
   che ci si aspetta da un grafico vuoto.

   Questo banco fa a Terra la domanda con il righello, su OGNI elemento il cui
   compito è rappresentare una quantità con una geometria. Non chiede «il
   disegno c'è?» ma **«i pixel stanno fra loro come stanno i valori?»** — un
   campione solo non distingue «funziona» da «sono tutti uguali», quindi ogni
   grafico si misura su almeno due valori diversi, e una scena inietta un
   valore **200 volte** più grande degli altri per far comparire la barra alta
   che la dimostrazione non ha.

   CHE COSA HA TROVATO (misurato, non deduttivo). La proporzionalità in Terra
   era giusta ovunque: `vita-fill` 36,8% dichiarato → 36,80% disegnato,
   l'avanzamento del piano 63,52% → 63,52%, le barre dei mesi nel rapporto
   esatto dei m³, la riga del pro-quota a 33,75 px sopra lo zero contro i 33,71
   attesi. Il difetto era un piano più sotto, e non nel rapporto: nel **fatto
   stesso di disegnare**.

   1 · IL QUADRO — `#dash-anno`, la prima schermata. Con un anno senza nessun
       rilievo di scavo, `proiezioneAnnua` dichiara `stato: "senza-rilievi"` —
       la bandiera che nella stessa pagina spegne il colore del KPI e fa
       scrivere «proiezione di fine anno: non calcolabile». Il disegno non la
       leggeva: la barra si disegnava lo stesso, **8,9 px su 368** (il minimo
       del motore, il 2,4% della traccia, ~3.000 m³ di estratto apparente), con
       la tacca del pro-quota al 59,7% e sotto la frase «sei indietro di 74.601
       m³». Sulla stessa schermata i due KPI in cima dicevano **«—»**: la
       pagina si smentiva, e a pretendere di aver misurato era il disegno.
       La regola era già in casa, ed è di Terra: la Denuncia costruisce il suo
       `#den-barra` solo `if (R.misurabile)`. Qui ne viveva la copia più
       debole — quella che il flag lo legge per il colore ma non per
       l'esistenza. È la regola 20 di `run-stile.mjs` applicata al DISEGNO.
   2 · IL CARTELLONE VITA CAVA — `.vita-fill` con `min-width:6px`. Su
       `width:0%` (concessione mai consumata, con il pregresso dichiarato a
       zero, cioè un vero zero misurato) disegnava **6 px su 360**: l'1,67%
       dell'incavo, ~20.000 m³ apparenti su 1,2 milioni concessi. La testa
       arrotondata serve quando il consumo è piccolo **ma c'è**; a zero è una
       quantità inventata.

   COSA NON HA TROVATO, per non gonfiare: la forma esatta del core — una
   percentuale che si risolve contro un genitore `auto` — in Terra **non
   esiste**. In tutta la pagina c'è una sola misura in percentuale
   (`.vita-fill{height:100%}`) e il suo genitore `.vita-track` dichiara
   `height:22px`. Misurato: 20 px disegnati su 22 di traccia.

   ⚠️ IL MINIMO DEL MOTORE È DICHIARATO, NON MISURATO. `dw-grafici.js` disegna
   ogni barra con `Math.max(2, ...)` unità: un valore piccolissimo e uno a zero
   escono tutti e due come una stanghetta da 1,85 px. Le barre sotto quel
   minimo il banco le **conta e le dichiara** invece di confrontarle, perché su
   di esse il rapporto non è più il disegno — è il minimo. Sta in `shared/` e
   riguarda tutte e sei le app: qui viene registrato, non corretto.

   ⚠️ LA COPERTURA È DICHIARATA, NON SOTTINTESA. Le geometrie di Terra censite
   sono SETTE: la barra della vita cava (`.vita-fill`, con la sua tacca di
   soglia e l'etichetta), i due avanzamenti del motore (`#dash-anno`,
   `#den-barra`), i tre grafici a barre (`#ril-mese`, `#fro-volumi`,
   `#den-graf`) e la riga del pro-quota che Terra disegna da sé sopra le barre.
   Qui dentro se ne misurano in pixel SEI. La settima — il grafico a LINEE
   `#tur-graf`, misurato contro dichiarato volo per volo — è stata censita e
   guardata (due serie, i buchi al posto dei periodi senza rapportini) ma **non
   misurata col righello**: la sua geometria pura (`tratti`, `percorso`) è già
   provata senza browser in `run-kpi.mjs`, e leggere i valori dal `d` di un
   percorso curvo vorrebbe dire riscrivere qui l'interpolazione del motore —
   cioè misurare la propria copia. Chi ci torna sopra sappia che quel grafico,
   in pixel, non l'ha ancora guardato nessuno.

   ⚠️ I DUE CASI SI COSTRUISCONO NEI DATI, MAI NEL DISEGNO. L'anno cieco, lo
   zero misurato e il mese altissimo si ottengono aggiungendo righe alla
   risposta HTTP di `terra-data.js` — la via vera, il modulo dati dell'app. Il
   file su disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8493;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE. Contati uno per uno: un `replace` che non trova
   niente esce in silenzio, e una controprova che non ha iniettato niente
   dichiara «non so fallire» misurando un file sano. */
const DIFETTI = [
  // 1 · il disegno che non legge la bandiera «senza-rilievi» del modulo
  ['if (pr.stato === "senza-rilievi") {', 'if (false) {'],
  // 2 · la testa del riempimento accesa anche su un consumo di zero m³
  ['<i class="vita-fill${wVuota}"', '<i class="vita-fill"'],
];

/* LE SCENE. Ognuna è un caso che la dimostrazione da sola non contiene. */
const SCENE = {
  // com'è: due valori grandi e uno a zero in ogni grafico
  base: "",
  /* IL VALORE ALTO CHE NON C'ERA. Febbraio a 200.000 m³ accanto a marzo a
     1.000: 200 volte. È la scena che nel core avrebbe fatto vedere i 3 px, ed
     è anche l'unica in cui `#den-graf` compare (vuole 4 mesi con rilievi). */
  alto: '\nDEMO.rilievi.push({ id:"g1", titolo:"Rilievo febbraio", data:"2026-02-10", tipo:"Ortofoto + DEM",'
    + ' volumeM3: 200000, stato:"elaborato", metodo:"RTK", gsd:"2", fronteId:"f3", provenienza:"scavo" });'
    + '\nDEMO.rilievi.push({ id:"g2", titolo:"Rilievo marzo", data:"2026-03-10", tipo:"Ortofoto + DEM",'
    + ' volumeM3: 1000, stato:"elaborato", metodo:"RTK", gsd:"2", fronteId:"f3", provenienza:"scavo" });'
    + '\nDEMO.rilievi.push({ id:"g3", titolo:"Rilievo aprile", data:"2026-04-10", tipo:"Ortofoto + DEM",'
    + ' volumeM3: 4000, stato:"elaborato", metodo:"RTK", gsd:"2", fronteId:"f2", provenienza:"scavo" });\n',
  // l'anno che nessuno ha misurato: il pregresso resta dichiarato, quindi la
  // vita cava è misurabile — a non essere misurato è SOLO l'anno in corso
  cieco: "\nDEMO.rilievi.length = 0;\n",
  // lo zero VERO: pregresso dichiarato a zero e nessuno scavo. Qui il
  // contatore è misurabile e vale zero, ed è l'unico caso in cui la barra
  // della vita cava deve restare completamente vuota
  zeroVero: "\nDEMO.rilievi.length = 0;\nDEMO.autorizzazioni[0].estrattoPregressoM3 = 0;\n",
};

let FIXTURE = "";
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/terra/terra-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/terra/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__terra-geometrie-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__terra-geometrie-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 300)}` : ""}`); }
};
/* QUANTI SOGGETTI HO GUARDATO DAVVERO. Un «nessuna violazione» senza il conto
   accanto non vale niente: è la difesa contro il controllo che non guarda dove
   crede. */
const CONTO = { schermate: 0, geometrie: 0, barre: 0, confronti: 0, sottoMinimo: 0 };

/* LA SONDA. Per ogni geometria: che cosa DICHIARA (la percentuale nello style,
   il valore nell'etichetta accessibile, la quota nella tabella del grafico) e
   che cosa DISEGNA (`getBoundingClientRect`). Le due cose si confrontano qui
   sotto, mai dentro la pagina. */
const SONDA = () => {
  const att = document.querySelector(".page.active");
  if (!att) return [];
  const out = [];
  const n2 = (x) => +(+x).toFixed(2);
  /* la barra della vita cava: percentuale CSS dentro un incavo di altezza
     dichiarata. La larghezza utile è quella INTERNA ai bordi, perché è contro
     quella che il browser risolve il `width:%`. */
  att.querySelectorAll(".vita-fill").forEach((f) => {
    const tr = f.parentElement, cs = getComputedStyle(tr), rt = tr.getBoundingClientRect();
    const utile = rt.width - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
    const altezzaUtile = rt.height - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth);
    out.push({ g: "vita-fill", dich: f.style.width, px: n2(f.getBoundingClientRect().width),
      utile: n2(utile), pctPx: utile > 0 ? n2(100 * f.getBoundingClientRect().width / utile) : null,
      altezzaPx: n2(f.getBoundingClientRect().height), altezzaUtile: n2(altezzaUtile),
      testo: (att.querySelector(".vita-pct") || {}).textContent || "" });
  });
  att.querySelectorAll(".vita-soglia").forEach((f) => {
    const bar = f.closest(".vita-bar"), rb = bar.getBoundingClientRect(), rf = f.getBoundingClientRect();
    out.push({ g: "vita-soglia", dich: f.style.left,
      pctPx: n2(100 * (rf.left + rf.width / 2 - rb.left) / rb.width), title: f.title || "" });
  });
  /* l'avanzamento del motore: il valore e il massimo si leggono dall'etichetta
     accessibile, cioè da quello che il prodotto DICHIARA a chi non vede. */
  att.querySelectorAll("svg .dwg-fill").forEach((f) => {
    const svg = f.ownerSVGElement, tr = svg.querySelector(".dwg-track");
    out.push({ g: "avanzamento", host: (f.closest("[id]") || {}).id || "",
      px: n2(f.getBoundingClientRect().width), traccia: n2(tr.getBoundingClientRect().width),
      pctPx: n2(100 * f.getBoundingClientRect().width / tr.getBoundingClientRect().width),
      aria: svg.getAttribute("aria-label") || "" });
  });
  /* le barre: dimensioni disegnate + la quota che il grafico dichiara nella sua
     tabella accessibile. Il rapporto fra due barre è la prova che conta. */
  att.querySelectorAll("svg").forEach((svg) => {
    const barre = svg.querySelectorAll(".dwg-barra");
    if (!barre.length) return;
    const dim = [];
    barre.forEach((x) => { const r = x.getBoundingClientRect(); dim.push([n2(r.width), n2(r.height)]); });
    /* ⚠️ L'ORIENTAMENTO SI DEDUCE DA QUAL È LA DIMENSIONE CHE VARIA, non
       dall'aspetto della PRIMA barra. Scritto così la prima volta, il banco ha
       misurato le larghezze di un grafico verticale: nella scena col mese
       altissimo la prima barra è un mese a zero (18,9 × 1,85 px), più larga che
       alta, e il rilevatore l'ha presa per una barra orizzontale — poi ha
       dichiarato «la più lunga misura 18,86 px» su un grafico dove la più alta
       ne misurava 129. In un grafico a colonne le larghezze sono tutte uguali e
       a variare sono le altezze; in uno a barre è il contrario. */
    const spread = (a) => Math.max(...a) - Math.min(...a);
    const oriz = spread(dim.map((d) => d[0])) > spread(dim.map((d) => d[1]));
    const fig = svg.closest("figure");
    const tab = fig ? [...fig.querySelectorAll("tbody tr")].map((tr) => [...tr.children].map((c) => c.textContent)) : [];
    out.push({ g: "barre", host: (svg.closest("[id]") || {}).id || "", oriz: !!oriz, dim, tab,
      aria: svg.getAttribute("aria-label") || "" });
  });
  /* la riga del pro-quota: la disegna TERRA, non il motore, leggendo la scala
     dal disegno stesso. La sua distanza dallo zero deve stare alla barra più
     alta come il pro-quota sta al massimo. */
  att.querySelectorAll("svg .dwg-taglio").forEach((l) => {
    const svg = l.ownerSVGElement;
    if (svg.getAttribute("viewBox") === "0 0 22 11") return;   // il segno in legenda
    let alta = null;
    svg.querySelectorAll(".dwg-barra").forEach((x) => {
      const r = x.getBoundingClientRect(); if (!alta || r.height > alta.height) alta = r;
    });
    const fig = svg.closest("figure");
    out.push({ g: "riga-riferimento", host: (svg.closest("[id]") || {}).id || "",
      sopraZero: alta ? n2(alta.bottom - l.getBoundingClientRect().top) : null,
      altaH: alta ? n2(alta.height) : null,
      leg: fig ? [...fig.querySelectorAll(".lg")].map((x) => x.textContent).join(" / ") : "" });
  });
  return out;
};

async function apri(sezione) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/terra/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + sezione).catch(() => {});
  await pg.waitForTimeout(800);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  if (viste.length !== 1) dice(false, `navigato davvero (${sezione})`, viste.join(",") || "nessuna pagina visibile");
  if (errori.length) dice(false, `nessun errore di pagina (${sezione})`, errori[0]);
  CONTO.schermate++;
  return pg;
}
const pctIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)\s*%/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };
/* ⚠️ E LA PERCENTUALE DELLO `style` NON SI LEGGE COL LETTORE ITALIANO. `36.8%`
   in un attributo CSS ha il punto DECIMALE; `pctIt` toglie i punti perché in
   italiano separano le migliaia, e faceva diventare 36,8 → **368**. Il banco
   ha bocciato una barra giusta scrivendo «dichiarato 36.8%, disegnato 36.8%»,
   che è il modo in cui uno strumento rotto si presenta. Due notazioni, due
   lettori: quella del CSS e quella dei testi che legge l'utente. */
const pctCss = (s) => { const m = String(s).match(/(-?[\d.]+)\s*%/); return m ? parseFloat(m[1]) : null; };
const numIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };
const vicino = (a, c, t) => a != null && c != null && Math.abs(a - c) <= t;

/* IL CONFRONTO FRA DUE BARRE — la sola prova che distingue «funziona» da «sono
   tutte uguali». Le barre sotto il minimo del motore si contano e si
   dichiarano invece di essere confrontate: su di loro il disegno non è più il
   valore, è il minimo, e pretenderlo sarebbe misurare `shared/` credendo di
   misurare Terra. */
const MINIMO_MOTORE = 2.4;   // px: le 2 unità del motore, con lo scarto della scala
function confrontaBarre(x, etichetta) {
  const q = x.tab.map((r) => pctIt(r[r.length - 1]));
  const mis = x.dim.map((d) => (x.oriz ? d[0] : d[1]));
  if (q.length !== mis.length || !q.length) { dice(false, `${etichetta}: la tabella accessibile ha una riga per barra`, `${q.length} righe, ${mis.length} barre`); return; }
  CONTO.barre += mis.length;
  let iMax = 0;
  q.forEach((v, i) => { if ((v || 0) > (q[iMax] || 0)) iMax = i; });
  const grandi = mis.filter((v) => v > MINIMO_MOTORE).length;
  if (grandi < 2) { dice(false, `${etichetta}: almeno DUE barre sopra il minimo del motore, se no il rapporto non prova niente`, `${grandi} su ${mis.length}`); return; }
  let peggio = null, fatti = 0, saltati = 0;
  mis.forEach((px, i) => {
    if (i === iMax) return;
    if (px <= MINIMO_MOTORE) { CONTO.sottoMinimo++; saltati++; return; }
    CONTO.confronti++; fatti++;
    const atteso = mis[iMax] * (q[i] / q[iMax]);
    const scarto = Math.abs(px - atteso);
    if (!peggio || scarto > peggio.scarto) peggio = { scarto, i, px, atteso, quota: q[i] };
  });
  /* si stampa SEMPRE quanti confronti sono stati fatti davvero: «nessuna
     violazione» su zero confronti è la risposta di un banco che non ha
     guardato niente. */
  dice(fatti > 0 && peggio.scarto <= tolleranza(peggio.atteso),
    `${etichetta}: i pixel stanno fra loro come i valori`
    + ` — ${mis.length} barre ${x.oriz ? "orizzontali" : "verticali"}, ${fatti} confrontate con la più grande,`
    + ` ${saltati} sotto il minimo del motore`,
    peggio && `la peggiore: quota ${peggio.quota}% della più grande (${mis[iMax]} px)`
      + ` → attesi ${peggio.atteso.toFixed(2)} px, disegnati ${peggio.px} px`);
}
/* la quota nella tabella è arrotondata a un decimale: la tolleranza è il 2% del
   valore atteso, mai meno di 0,8 px (le barre piccole ci starebbero dentro
   comunque, ed è per questo che quelle sotto il minimo si saltano). */
const tolleranza = (v) => Math.max(0.8, v * 0.02);

console.log(`\n════════ Terra: il disegno dice la stessa cosa del numero?${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── SCENA 1 · la dimostrazione com'è ──────────────────────────────────────
console.log("\n· la dimostrazione com'è: ogni geometria col righello");
FIXTURE = SCENE.base;
for (const [sez, atteso] of [["nav-dash", 3], ["nav-tit", 2], ["nav-fro", 1], ["nav-ril", 2], ["nav-den", 1]]) {
  const pg = await apri(sez);
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.length;
  dice(r.length >= atteso, `${sez}: le geometrie attese sono lì (${r.length} trovate, ${atteso} attese almeno)`, JSON.stringify(r.map((x) => x.g)));
  for (const x of r) {
    if (x.g === "vita-fill") {
      const dichiarata = pctCss(x.dich), scritta = pctIt(x.testo);
      dice(vicino(x.pctPx, dichiarata, 0.2),
        `${sez} · la barra della vita cava disegna la percentuale che dichiara`,
        `dichiarato ${x.dich}, disegnato ${x.pctPx}% (${x.px} px su ${x.utile})`);
      dice(vicino(x.pctPx, scritta, 0.2),
        `${sez} · e la percentuale disegnata è quella SCRITTA accanto`,
        `scritto «${x.testo}», disegnato ${x.pctPx}%`);
      /* la forma del difetto del core: una percentuale che si risolve contro
         un genitore alto `auto`. Qui l'incavo dichiara 22 px e si vede. */
      dice(x.altezzaPx >= x.altezzaUtile - 0.5,
        `${sez} · «height:100%» si risolve contro un'altezza vera, non contro «auto»`,
        `${x.altezzaPx} px dentro un incavo utile di ${x.altezzaUtile}`);
    }
    if (x.g === "vita-soglia") {
      dice(vicino(x.pctPx, pctCss(x.dich), 0.5),
        `${sez} · la tacca della soglia sta dove dice di stare`,
        `dichiarato ${x.dich}, disegnato ${x.pctPx}% (${x.title})`);
    }
    if (x.g === "avanzamento") {
      const nn = String(x.aria).match(/([\d.]+) metri cubi/g) || [];
      const val = numIt(nn[0]), max = numIt(nn[1]);
      const attesa = max > 0 ? 100 * Math.min(val, max) / max : null;
      dice(vicino(x.pctPx, attesa, 0.4),
        `${sez} · «${x.host}»: la barra disegna il rapporto che l'etichetta dichiara`,
        `${val} su ${max} = ${attesa && attesa.toFixed(2)}%, disegnato ${x.pctPx}% (${x.px} px su ${x.traccia})`);
    }
    if (x.g === "barre") confrontaBarre(x, `${sez} · «${x.host}»`);
    if (x.g === "riga-riferimento") {
      /* il pro-quota è nella legenda che Terra scrive da sé; il massimo è nel
         titolo accessibile del grafico. La riga deve stare in mezzo nello
         stesso rapporto. */
      const proq = numIt(x.leg);
      const vmax = numIt((await pg.evaluate(() => {
        const s = document.querySelector(".page.active svg[aria-label*='mese per mese']");
        return s ? s.getAttribute("aria-label") : "";
      })).replace(/^.*è \w+ con /, ""));
      const atteso = x.altaH * proq / vmax;
      dice(vicino(x.sopraZero, atteso, 0.6),
        `${sez} · la riga del pro-quota sta alla barra più alta come i m³ stanno fra loro`,
        `${proq} su ${vmax} di ${x.altaH} px = ${atteso.toFixed(2)} px sopra lo zero, disegnata a ${x.sopraZero}`);
    }
  }
  await pg.close();
}

// ── SCENA 2 · il valore ALTO che la dimostrazione non ha ──────────────────
console.log("\n· un mese 200 volte più grande degli altri: la barra alta che nel core non c'era mai stata");
FIXTURE = SCENE.alto;
for (const sez of ["nav-ril", "nav-fro", "nav-den"]) {
  const pg = await apri(sez);
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.length;
  const barre = r.filter((x) => x.g === "barre");
  dice(barre.length > 0, `${sez}: il grafico a barre c'è`, JSON.stringify(r.map((x) => x.g)));
  for (const x of barre) {
    confrontaBarre(x, `${sez} · «${x.host}» (scala 200:1)`);
    /* ⛔ IL CASO DEL CORE, IN UNA RIGA: un valore 200 volte più grande degli
       altri deve uscire dal disegno come una barra GRANDE. Là la barra da
       2.261,7 m³ ne disegnava 3, identica ai mesi a zero, e nessuno se n'era
       accorto perché senza dati d'esempio nessuna barra era mai stata alta. */
    const lunghezze = x.dim.map((d) => (x.oriz ? d[0] : d[1]));
    const maxPx = Math.max(...lunghezze);
    dice(maxPx > 40, `${sez} · «${x.host}»: il valore 200 volte più grande è DISEGNATO grande, non schiacciato al minimo`,
      `la più ${x.oriz ? "lunga" : "alta"} misura ${maxPx} px (${lunghezze.length} barre ${x.oriz ? "orizzontali" : "verticali"})`);
  }
  await pg.close();
}

// ── SCENA 3 · l'anno che nessuno ha misurato ──────────────────────────────
console.log("\n· un anno senza nessun rilievo di scavo: quello che il modulo dichiara non misurabile non si disegna");
FIXTURE = SCENE.cieco;
{
  const pg = await apri("nav-dash");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.length;
  const av = r.filter((x) => x.g === "avanzamento" && x.host === "dash-anno");
  const q = await pg.evaluate(() => {
    const el = document.getElementById("dash-anno");
    const kpi = [...document.querySelectorAll(".kpis .kpi")].map((x) => x.textContent.replace(/\s+/g, " ").trim());
    return { testo: el ? el.textContent.replace(/\s+/g, " ").trim() : "", kpi };
  });
  dice(av.length === 0,
    "⛔ il Quadro NON disegna la barra dell'anno quando nell'anno non è stato misurato niente",
    av.length ? `disegnata lo stesso: ${av[0].px} px (${av[0].pctPx}% della traccia) · «${av[0].aria}»` : "");
  dice(/non l'ha misurato nessuno/.test(q.testo),
    "e al suo posto c'è scritto che non l'ha misurato nessuno", q.testo.slice(0, 200));
  dice(!/sei indietro di/.test(q.testo) && !/avanti di/.test(q.testo),
    "⛔ e non c'è nessun «sei indietro di N m³», che è una misura su una cosa non misurata",
    (q.testo.match(/sei (indietro|avanti) di [^,]*/) || [])[0]);
  dice(/Avanzamento piano\s*—/.test(q.kpi.join(" | ")),
    "il KPI dell'avanzamento diceva già «—»: era il disegno a non leggere la stessa bandiera",
    q.kpi.slice(0, 2).join(" | "));
  await pg.close();
}

// ── SCENA 4 · lo zero VERO ────────────────────────────────────────────────
console.log("\n· concessione mai consumata, con il pregresso dichiarato a zero: uno zero misurato si disegna vuoto");
FIXTURE = SCENE.zeroVero;
{
  const pg = await apri("nav-tit");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.length;
  const f = r.find((x) => x.g === "vita-fill");
  dice(!!f, "la scheda della vita cava c'è (il contatore è misurabile e vale zero)", JSON.stringify(r.map((x) => x.g)));
  if (f) {
    dice(pctIt(f.testo) === 0, "e dichiara «0% consumato»", f.testo);
    dice(f.px < 0.5,
      "⛔ e la barra disegna ZERO pixel: `min-width` è la testa di un consumo piccolo, non una quantità inventata",
      `dichiarato ${f.dich}, disegnati ${f.px} px su ${f.utile} (${f.pctPx}% dell'incavo)`);
  }
  await pg.close();
}

// ── riepilogo ─────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(72)}`);
console.log(`Soggetti guardati: ${CONTO.geometrie} geometrie su ${CONTO.schermate} schermate`
  + ` · ${CONTO.barre} barre, ${CONTO.confronti} confrontate a due a due`
  + ` · ${CONTO.sottoMinimo} sotto il minimo del motore (2 unità, dichiarate e non confrontate)`);
if (CONTROPROVA) {
  console.log(`Difetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) {
    console.error("✗ non tutti i difetti hanno trovato il loro pezzo di pagina: la controprova non prova niente.");
    await b.close(); srv.close(); process.exit(2);
  }
}
console.log(`Geometrie di Terra: ${ok} a posto, ${ko} sbagliate`);
await b.close();
srv.close();
if (CONTROPROVA) {
  if (ko > 0) { console.log("✓ controprova: coi difetti rimessi il banco FALLISCE, come deve."); process.exit(0); }
  console.error("✗ controprova: coi difetti rimessi il banco è passato lo stesso. Non sa fallire.");
  process.exit(1);
}
process.exit(ko ? 1 : 0);

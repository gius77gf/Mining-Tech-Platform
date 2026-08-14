/* IN CAMPO IL DISEGNO DICE LA STESSA COSA DEL NUMERO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-disegni.mjs [--porta=8647]
     node campo-disegni.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08, nel core, è saltata fuori una forma di numero che
   mente che non era ancora censita: **il numero è giusto e a mentire è il
   DISEGNO**. La barra di luglio del grafico della produzione dichiarava
   `height:100%` con 2.261,7 m³ dentro e ne disegnava 3, identica ai cinque
   mesi a zero. Nessun errore da leggere. E non si era mai vista perché senza
   dati d'esempio non c'era mai stata una barra alta.

   CHE COSA HA GUARDATO IN CAMPO, dichiarato per intero perché «nessuna
   violazione» senza il conto accanto non vale niente. Le geometrie di Campo
   sono CINQUE, tutte del motore condiviso (nella pagina non c'è una sola
   misura scritta a mano: censite a tappeto le percentuali negli `style`
   inline, gli SVG con dimensioni calcolate e i `min-width`/`min-height` di
   tutte e cinque le schermate — zero):
     · `#fermi-pareto`  barre ORIZZONTALI, minuti di fermo per causale, col
                        taglio di Pareto all'80%;
     · `#fermi-storico` barre verticali, minuti di fermo giorno per giorno;
     · `#set-graf`      barre verticali, produzione (o attività concluse) per
                        giornata;
     · `#piano-graf`    barre orizzontali, scostamento della carica per foro;
     · `#ob-graf`       avanzamento verso l'obiettivo di turno, con la tacca
                        del riferimento quando l'obiettivo è superato.
   Il Quadro — la prima schermata — non ha nessuna geometria: i suoi numeri
   sono cartelloni di testo. Anche questo è un risultato, non un'assenza.

   LA PROPORZIONE È GIUSTA DAPPERTUTTO, e va detto perché non venga riaperto
   alla cieca: con un valore 200 volte più grande degli altri (4.000 min
   contro 20) le barre stanno fra loro come i valori, in tutti e quattro i
   grafici a barre, e l'avanzamento dell'obiettivo disegna l'81,0% quando
   dichiara 210 t su 260.

   IL DIFETTO TROVATO È DI UN PIANO PIÙ SOTTO, e non è nel rapporto: è nel
   fatto che una colonna a ZERO, in `#set-graf`, voleva dire tre cose diverse
   e il disegno le raccontava come una sola.
   Misurato aprendo la pagina con 5.000 m³ il 04/08, 300 t il 03/08 e 210 t
   oggi: `unitaPrevalente` sceglie i **m³** (5.000 > 510) e le due giornate in
   tonnellate escono a **0 px**, pixel per pixel identiche alle quattro
   giornate in cui non è stato registrato niente. Nella stessa schermata, dieci
   pixel più sotto, la lista scriveva «prodotto 300 t» e il cartellone in cima
   «Prodotto: 510 t + 5.000 m³». E sotto il grafico c'era scritto, di TUTTE le
   colonne a zero: «Le colonne a zero sono giornate senza registrazioni».
   L'etichetta accessibile diceva la stessa bugia a chi non vede: «03/08/2026
   0».
   Una barra alta zero non porta né colore né etichetta, quindi il disegno le
   tre specie non le può distinguere: a distinguerle è la nota, e l'aria. È la
   difesa che il grafico GEMELLO — `grafFermiStorico`, dodici funzioni più su —
   usava già per le sue colonne a zero («pur avendo fermi registrati: lì i
   minuti non sono stati scritti»), e che a questo mancava. La copia più
   debole, ancora, e nello stesso file.

   ⚠️ IL MINIMO DEL MOTORE È DICHIARATO, NON MISURATO. `dw-grafici.js` disegna
   ogni barra con `Math.max(2, …)` unità: un valore piccolissimo e uno grande
   quanto un pixel escono tutti e due come una stanghetta da ~1,85 px. Le barre
   sotto quel minimo il banco le CONTA e le dichiara invece di confrontarle:
   su di esse il rapporto non è più il disegno, è il minimo. Sta in `shared/` e
   riguarda tutte e sei le app: qui viene registrato, non corretto.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DISEGNO. Le scene si ottengono
   aggiungendo righe alla risposta HTTP di `campo-data.js` — la via vera. Il
   file su disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8647;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, contato: un `replace` che non trova niente esce in
   silenzio, e una controprova che non ha iniettato niente dichiara «non so
   fallire» misurando una pagina sana. Si rimette la frase com'era — detta di
   TUTTE le colonne a zero — e si spegne il conto che la smentisce. */
const DIFETTI = [
  ["+ codaFuoriUnita + codaZeriVeri",
   '+ " Le colonne a zero sono giornate senza registrazioni." + ""'],
  ['if (!gFuori.has(g.data)) return dmy(g.data) + " " + numeroIt(valori[i].valore, 2);',
   'if (true) return dmy(g.data) + " " + numeroIt(valori[i].valore, 2);'],
];

const OGGI = new Date().toISOString().slice(0, 10);
const gfa = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };

const SCENE = {
  // com'è: un solo fermo, una sola giornata con produzione
  base: "",
  /* IL VALORE ALTO CHE NON C'ERA: 4.000 min contro 20, cioè 200 volte. È la
     scena che nel core avrebbe fatto vedere i 3 px. Copre `#fermi-pareto`
     (col taglio di Pareto) e `#fermi-storico` insieme. */
  fermiAlti: `
DEMO.attivita.push({ id:"z1", data:"${OGGI}", turno:"Mattina", titolo:"Frantoio", squadra:"Squadra C", stato:"anomalia", causale:"Guasto meccanico", fermoMin:4000 });
DEMO.attivita.push({ id:"z2", data:"${OGGI}", turno:"Mattina", titolo:"Nastro", squadra:"Squadra C", stato:"anomalia", causale:"Meteo", fermoMin:20 });
DEMO.attivita.push({ id:"z3", data:"${OGGI}", turno:"Mattina", titolo:"Pala", squadra:"Squadra C", stato:"anomalia", causale:"Attesa mezzo", fermoMin:400 });
DEMO.attivita.push({ id:"z4", data:"${gfa(1)}", turno:"Mattina", titolo:"A", squadra:"Squadra C", stato:"anomalia", causale:"Guasto meccanico", fermoMin:15 });
DEMO.attivita.push({ id:"z5", data:"${gfa(2)}", turno:"Mattina", titolo:"B", squadra:"Squadra C", stato:"anomalia", causale:"Meteo", fermoMin:900 });
`,
  // la settimana con un giorno 200 volte l'altro, tutti nella stessa unità
  settimanaAlta: `
DEMO.rapportini.push({ id:"w1", data:"${gfa(2)}", turno:"Mattina", titolo:"R", squadra:"Squadra B", prodQta:20000, prodUnita:"t", ora:"12:00", stato:"inviato" });
DEMO.rapportini.push({ id:"w2", data:"${gfa(3)}", turno:"Mattina", titolo:"R", squadra:"Squadra B", prodQta:3000, prodUnita:"t", ora:"12:00", stato:"inviato" });
`,
  /* ⛔ LA SCENA DEL DIFETTO: l'unità prevalente diventa m³ perché 5.000 > 510,
     e le due giornate che hanno prodotto TONNELLATE finiscono a zero pixel. */
  unitaMista: `
DEMO.rapportini.push({ id:"m1", data:"${gfa(2)}", turno:"Mattina", titolo:"R", squadra:"Squadra B", prodQta:5000, prodUnita:"m³", ora:"12:00", stato:"inviato" });
DEMO.rapportini.push({ id:"m2", data:"${gfa(3)}", turno:"Mattina", titolo:"R", squadra:"Squadra B", prodQta:300, prodUnita:"t", ora:"12:00", stato:"inviato" });
`,
  // il piano di carico: scostamenti da 200 kg a 1 kg, e due fori mai registrati
  piano: `
DEMO.pianocarico = [
 { id:"p1", data:"${OGGI}", turno:"Mattina", foro:"1", fila:"A", prof:12, prog:100, reale:300 },
 { id:"p2", data:"${OGGI}", turno:"Mattina", foro:"2", fila:"A", prof:12, prog:100, reale:101 },
 { id:"p3", data:"${OGGI}", turno:"Mattina", foro:"3", fila:"A", prof:12, prog:100, reale:99 },
 { id:"p4", data:"${OGGI}", turno:"Mattina", foro:"4", fila:"A", prof:12, prog:100, reale:110 },
 { id:"p5", data:"${OGGI}", turno:"Mattina", foro:"5", fila:"A", prof:12, prog:100, reale:null }
];
`,
  // l'obiettivo superato: compare la tacca del riferimento
  obiettivoSuperato: `
DEMO.obiettivi = [{ id:"b1", data:"${OGGI}", turno:"Mattina", unita:"t", valore:100 }];
DEMO.rapportini.push({ id:"v1", data:"${OGGI}", turno:"Mattina", titolo:"R", squadra:"Squadra B", prodQta:400, prodUnita:"t", ora:"12:00", stato:"inviato" });
`,
};

let FIXTURE = "";
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/campo/campo-data.js") && FIXTURE) corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  if (CONTROPROVA && p.endsWith("apps/campo/index.html")) {
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
const SEGNO = join(R, "__campo-disegni-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__campo-disegni-${process.pid}`)).text();
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
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 320)}` : ""}`); }
};
/* QUANTI SOGGETTI HO GUARDATO DAVVERO. Un «nessuna violazione» senza il conto
   accanto è la risposta di un banco che non ha guardato niente. */
const CONTO = { schermate: 0, geometrie: 0, barre: 0, confronti: 0, sottoMinimo: 0, azzerate: 0, scrittiAMano: 0 };

/* LA SONDA. Per ogni geometria: che cosa DICHIARA (la tabella accessibile del
   grafico, l'etichetta aria) e che cosa DISEGNA (`getBoundingClientRect`). Le
   due cose si confrontano fuori dalla pagina, mai dentro. */
const SONDA = () => {
  const att = document.querySelector(".page.active");
  if (!att) return [];
  const n2 = (x) => +(+x).toFixed(2);
  const out = [];
  /* ⛔ IL CENSIMENTO DELLE GEOMETRIE SCRITTE A MANO. Non basta misurare i
     grafici del motore: la forma esatta del difetto del core è una
     percentuale scritta nella pagina che si risolve contro un genitore
     `auto`. Se un giorno qualcuno la scrive in Campo, questo conto la vede. */
  att.querySelectorAll("[style]").forEach((e) => {
    const s = e.getAttribute("style") || "";
    if (/\b(width|height)\s*:\s*[\d.]+\s*(%|px)/.test(s) && !e.closest("svg"))
      out.push({ g: "a-mano", cls: String(e.className.baseVal || e.className).slice(0, 40), style: s.slice(0, 80) });
  });
  att.querySelectorAll("figure").forEach((fig) => {
    const svg = fig.querySelector("svg[aria-label]"); if (!svg) return;
    const host = (fig.closest("[id]") || {}).id || "";
    const tab = [...fig.querySelectorAll("tbody tr")].map((tr) => [...tr.children].map((c) => c.textContent));
    const fill = svg.querySelector(".dwg-fill");
    if (fill) {
      const tr = svg.querySelector(".dwg-track"), rt = tr.getBoundingClientRect();
      const tacca = svg.querySelector(".dwg-tacca");
      out.push({ g: "avanzamento", host, px: n2(fill.getBoundingClientRect().width), traccia: n2(rt.width),
        pctPx: rt.width > 0 ? n2(100 * fill.getBoundingClientRect().width / rt.width) : null,
        taccaPct: tacca ? n2(100 * (tacca.getBoundingClientRect().left - rt.left) / rt.width) : null,
        aria: svg.getAttribute("aria-label") || "" });
    }
    const barre = svg.querySelectorAll(".dwg-barra");
    if (barre.length) {
      const dim = []; barre.forEach((x) => { const r = x.getBoundingClientRect(); dim.push([n2(r.width), n2(r.height)]); });
      /* ⚠️ L'ORIENTAMENTO SI DEDUCE DA QUAL È LA DIMENSIONE CHE VARIA, non
         dall'aspetto della prima barra: in un grafico a colonne la prima può
         essere una giornata a zero, più larga che alta. */
      const spread = (a) => Math.max(...a) - Math.min(...a);
      const oriz = spread(dim.map((d) => d[0])) > spread(dim.map((d) => d[1]));
      out.push({ g: "barre", host, oriz: !!oriz, dim, tab, aria: svg.getAttribute("aria-label") || "",
        nota: (fig.querySelector(".dwg-nota") || fig).textContent.replace(/\s+/g, " ").trim(),
        taglio: svg.querySelector(".dwg-taglio") ? n2(svg.querySelector(".dwg-taglio").getBoundingClientRect()[oriz ? "top" : "left"]) : null });
    }
  });
  return out;
};

async function apri(sezione, dopo) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`);
  await pg.waitForTimeout(2400);
  await pg.click("#" + sezione).catch(() => {});
  await pg.waitForTimeout(700);
  if (dopo) { await dopo(pg); await pg.waitForTimeout(700); }
  /* la prova di aver navigato davvero: un banco che non naviga fotografa la
     stessa schermata a ogni giro e risponde «tutto a posto». */
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  if (viste.length !== 1) dice(false, `navigato davvero (${sezione})`, viste.join(",") || "nessuna pagina visibile");
  if (errori.length) dice(false, `nessun errore di pagina (${sezione})`, errori[0]);
  CONTO.schermate++;
  return pg;
}
const pctIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)\s*%/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };
const numIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };
const vicino = (a, c, t) => a != null && c != null && Math.abs(a - c) <= t;

/* IL CONFRONTO FRA DUE BARRE — la sola prova che distingue «funziona» da «sono
   tutte uguali». Le barre sotto il minimo del motore si contano e si
   dichiarano: su di loro il disegno non è più il valore, è il minimo, e
   pretenderlo sarebbe misurare `shared/` credendo di misurare Campo. */
const MINIMO_MOTORE = 2.4;   // px: le 2 unità del motore, con lo scarto della scala
const tolleranza = (v) => Math.max(0.8, v * 0.02);
function confrontaBarre(x, etichetta) {
  const q = x.tab.map((r) => pctIt(r[r.length - 1]));
  const mis = x.dim.map((d) => (x.oriz ? d[0] : d[1]));
  if (q.length !== mis.length || !q.length) {
    dice(false, `${etichetta}: la tabella accessibile ha una riga per barra`, `${q.length} righe, ${mis.length} barre`); return;
  }
  CONTO.barre += mis.length;
  let iMax = 0;
  q.forEach((v, i) => { if ((v || 0) > (q[iMax] || 0)) iMax = i; });
  const grandi = mis.filter((v) => v > MINIMO_MOTORE).length;
  if (grandi < 2) { dice(false, `${etichetta}: almeno DUE barre sopra il minimo del motore, se no il rapporto non prova niente`, `${grandi} su ${mis.length}`); return; }
  let peggio = null, fatti = 0, saltati = 0, azzerate = 0;
  mis.forEach((px, i) => {
    if (i === iMax) return;
    /* ⚠️ UNA BARRA A ZERO NON È «SOTTO IL MINIMO DEL MOTORE», ed è sbagliato
       contarla lì: il minimo è la stanghetta che il motore disegna a un valore
       piccolissimo ma vero, lo zero è zero e il disegno lo rispetta. Contarli
       insieme faceva scrivere «9 sotto il minimo» dove i casi veri erano 4:
       un conteggio gonfiato in un riepilogo vale quanto un «zero violazioni». */
    if (px < 0.5) { CONTO.azzerate++; azzerate++; return; }
    if (px <= MINIMO_MOTORE) { CONTO.sottoMinimo++; saltati++; return; }
    CONTO.confronti++; fatti++;
    const atteso = mis[iMax] * (q[i] / q[iMax]);
    const scarto = Math.abs(px - atteso);
    if (!peggio || scarto > peggio.scarto) peggio = { scarto, i, px, atteso, quota: q[i] };
  });
  dice(fatti > 0 && peggio.scarto <= tolleranza(peggio.atteso),
    `${etichetta}: i pixel stanno fra loro come i valori`
    + ` — ${mis.length} barre ${x.oriz ? "orizzontali" : "verticali"}, ${fatti} confrontate con la più grande,`
    + ` ${saltati} sotto il minimo del motore, ${azzerate} a zero pixel`,
    peggio && `la peggiore: quota ${peggio.quota}% della più grande (${mis[iMax]} px)`
      + ` → attesi ${peggio.atteso.toFixed(2)} px, disegnati ${peggio.px} px`);
}

console.log(`\n════════ Campo: il disegno dice la stessa cosa del numero?${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── SCENA 1 · la dimostrazione com'è, tutte e cinque le schermate ─────────
console.log("\n· la dimostrazione com'è: censimento di ogni geometria, schermata per schermata");
FIXTURE = SCENE.base;
for (const sez of ["nav-dash", "nav-att", "nav-squ", "nav-rap", "nav-set"]) {
  const pg = await apri(sez);
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const aMano = r.filter((x) => x.g === "a-mano");
  CONTO.scrittiAMano += aMano.length;
  /* ⛔ LA FORMA ESATTA DEL DIFETTO DEL CORE — una percentuale scritta a mano
     nella pagina — in Campo NON ESISTE, e questo controllo lo tiene vero: se
     un giorno qualcuno la scrive, la trova qui invece che in produzione. */
  dice(aMano.length === 0, `${sez}: nessuna geometria scritta a mano fuori dal motore (0 attese)`,
    JSON.stringify(aMano.map((x) => x.cls + " {" + x.style + "}")));
  await pg.close();
}

// ── SCENA 2 · il valore 200 volte più grande ─────────────────────────────
console.log("\n· 4.000 minuti contro 20: la barra alta che nel core non c'era mai stata");
FIXTURE = SCENE.fermiAlti;
{
  const pg = await apri("nav-att");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const barre = r.filter((x) => x.g === "barre");
  dice(barre.length === 2, "i due grafici dei fermi ci sono (Pareto + storico)", JSON.stringify(barre.map((x) => x.host)));
  for (const x of barre) {
    confrontaBarre(x, `nav-att · «${x.host}» (scala 200:1)`);
    const lung = x.dim.map((d) => (x.oriz ? d[0] : d[1]));
    /* ⛔ IL CASO DEL CORE, IN UNA RIGA: il valore 200 volte più grande deve
       uscire come una barra GRANDE, non schiacciata al minimo insieme agli altri. */
    dice(Math.max(...lung) > 40, `nav-att · «${x.host}»: il valore 200 volte più grande è DISEGNATO grande`,
      `la più ${x.oriz ? "lunga" : "alta"} misura ${Math.max(...lung)} px su ${lung.length} barre`);
  }
  /* il taglio di Pareto è una tacca di RANGO, non una quantità: sta dopo le
     causali che fanno insieme l'80%. Con 4.000 su 4.475 la prima da sola fa
     l'89,4%, quindi la riga sta dopo la prima barra. */
  const par = barre.find((x) => x.host === "fermi-pareto");
  if (par) dice(par.taglio != null, "nav-att · il taglio di Pareto all'80% è disegnato", String(par.taglio));
  await pg.close();
}

// ── SCENA 3 · la settimana con un giorno 200 volte l'altro ───────────────
console.log("\n· la settimana con una giornata 200 volte l'altra, tutte nella stessa unità");
FIXTURE = SCENE.settimanaAlta;
{
  const pg = await apri("nav-set");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const x = r.find((y) => y.g === "barre" && y.host === "set-graf");
  dice(!!x, "il grafico della settimana c'è", JSON.stringify(r.map((y) => y.host)));
  if (x) {
    confrontaBarre(x, "nav-set · «set-graf» (scala 200:1)");
    const lung = x.dim.map((d) => d[1]);
    dice(Math.max(...lung) > 40, "nav-set · «set-graf»: la giornata più grande è DISEGNATA grande", `${Math.max(...lung)} px`);
    /* ⛔ E LO ZERO VERO SI DISEGNA VUOTO: una giornata senza niente registrato
       non prende il minimo della barra, che sarebbe una quantità inventata. */
    const zeri = x.tab.map((rr, i) => [pctIt(rr[rr.length - 1]), lung[i]]).filter(([q]) => q === 0);
    dice(zeri.length > 0 && zeri.every(([, px]) => px < 0.5),
      `nav-set · le giornate a zero disegnano ZERO pixel (${zeri.length} guardate)`,
      JSON.stringify(zeri));
  }
  await pg.close();
}

// ── SCENA 4 · ⛔ LA COLONNA A ZERO CHE ZERO NON È ─────────────────────────
console.log("\n· 5.000 m³ in una giornata e 300 t in un'altra: la colonna a zero su una giornata che HA prodotto");
FIXTURE = SCENE.unitaMista;
{
  const pg = await apri("nav-set");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const x = r.find((y) => y.g === "barre" && y.host === "set-graf");
  const lista = await pg.$$eval("#set-list .item", (e) => e.map((i) => i.textContent.replace(/\s+/g, " ").trim()));
  dice(!!x, "il grafico della settimana c'è", JSON.stringify(r.map((y) => y.host)));
  if (x) {
    const lung = x.dim.map((d) => d[1]);
    const aZero = lung.filter((v) => v < 0.5).length;
    /* la misura che ha fatto nascere questo banco: la giornata che ha prodotto
       300 t è disegnata a zero pixel, uguale a una giornata vuota. Il disegno
       resta quello — una barra alta zero non porta né colore né etichetta —
       ma la pagina non deve più raccontarlo come una giornata senza niente. */
    dice(aZero >= 4 && Math.max(...lung) > 40,
      "la scena è quella giusta: l'asse è in m³ e più giornate stanno a zero pixel",
      `${aZero} colonne a zero su ${lung.length}, la più alta ${Math.max(...lung)} px`);
    dice(lista.some((l) => /300 t/.test(l)),
      "e la lista, dieci pixel più sotto, scrive che quella giornata ha prodotto 300 t",
      lista.find((l) => /prodotto/.test(l)));
    dice(!/colonne a zero sono giornate senza registrazioni/i.test(x.nota),
      "⛔ la nota NON dichiara più che ogni colonna a zero è una giornata senza registrazioni",
      x.nota.slice(0, 240));
    dice(/pur avendo prodotto/.test(x.nota) && /300 t/.test(x.nota),
      "⛔ e dice quali giornate hanno prodotto pur stando a zero, con la quantità e l'unità",
      x.nota.slice(0, 300));
    /* ⛔ E LA STESSA BUGIA NON VA DETTA A CHI NON VEDE. L'etichetta accessibile
       scriveva «03/08/2026 0» su una giornata da 300 t. */
    dice(!/\d{2}\/\d{2}\/\d{4} 0(,|\s|$|,)/.test(x.aria) || /nessuna produzione in m³, ma/.test(x.aria),
      "⛔ l'etichetta accessibile non scrive «0» su una giornata che ha prodotto", x.aria.slice(0, 300));
    dice(/nessuna produzione in m³, ma 300 t/.test(x.aria),
      "e dice a parole quello che il disegno non può disegnare", x.aria.slice(0, 300));
  }
  await pg.close();
}

// ── SCENA 5 · il piano di carico ─────────────────────────────────────────
console.log("\n· il piano di carico: scostamenti da 200 kg a 1 kg sullo stesso grafico");
FIXTURE = SCENE.piano;
{
  const pg = await apri("nav-rap");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const x = r.find((y) => y.g === "barre" && y.host === "piano-graf");
  dice(!!x, "il grafico dello scostamento c'è", JSON.stringify(r.map((y) => y.host)));
  if (x) confrontaBarre(x, "nav-rap · «piano-graf»");
  await pg.close();
}

// ── SCENA 6 · l'obiettivo di turno, sotto e sopra ─────────────────────────
console.log("\n· l'avanzamento verso l'obiettivo di turno: sotto (210 su 260) e superato (610 su 100)");
for (const [scena, turno, etichetta] of [["base", "Mattina", "sotto l'obiettivo"], ["obiettivoSuperato", "Mattina", "obiettivo superato"]]) {
  FIXTURE = SCENE[scena];
  const pg = await apri("nav-rap", async (p) => { await p.selectOption("#ob-turno", turno).catch(() => {}); });
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.filter((x) => x.g !== "a-mano").length;
  const x = r.find((y) => y.g === "avanzamento" && y.host === "ob-graf");
  dice(!!x, `«ob-graf» (${etichetta}): l'avanzamento c'è`, JSON.stringify(r.map((y) => y.host)));
  if (!x) { await pg.close(); continue; }
  /* il valore e il massimo si leggono dall'etichetta accessibile, cioè da
     quello che il prodotto DICHIARA a chi non vede. */
  const nn = String(x.aria).match(/([\d.,]+) t/g) || [];
  const val = numIt(nn[0]), obiettivo = numIt(nn[1]);
  const massimo = Math.max(val, obiettivo);
  dice(vicino(x.pctPx, 100 * val / massimo, 0.4),
    `«ob-graf» (${etichetta}): la barra disegna il rapporto che l'etichetta dichiara`,
    `${val} su ${massimo} = ${(100 * val / massimo).toFixed(2)}%, disegnato ${x.pctPx}% (${x.px} px su ${x.traccia})`);
  if (val > obiettivo) {
    /* la tacca serve solo quando l'obiettivo è stato superato: sotto, il fondo
       della barra È l'obiettivo e la tacca starebbe appiccicata al bordo. */
    dice(vicino(x.taccaPct, 100 * obiettivo / massimo, 0.6),
      `«ob-graf» (${etichetta}): la tacca del traguardo sta dove sta l'obiettivo`,
      `${obiettivo} su ${massimo} = ${(100 * obiettivo / massimo).toFixed(2)}%, disegnata a ${x.taccaPct}%`);
  } else {
    dice(x.taccaPct === null, `«ob-graf» (${etichetta}): nessuna tacca finché si è sotto`, String(x.taccaPct));
  }
  await pg.close();
}

// ── riepilogo ─────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(72)}`);
console.log(`Soggetti guardati: ${CONTO.geometrie} geometrie su ${CONTO.schermate} schermate`
  + ` · ${CONTO.barre} barre, ${CONTO.confronti} confrontate a due a due`
  + ` · ${CONTO.sottoMinimo} sotto il minimo del motore (2 unità, dichiarate e non confrontate)`
  + ` · ${CONTO.azzerate} disegnate a zero pixel, che è la risposta giusta`
  + ` · ${CONTO.scrittiAMano} geometrie scritte a mano fuori dal motore`);
if (CONTROPROVA) {
  console.log(`Difetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) {
    console.error("✗ non tutti i difetti hanno trovato il loro pezzo di pagina: la controprova non prova niente.");
    await b.close(); srv.close(); process.exit(2);
  }
}
console.log(`Disegni di Campo: ${ok} a posto, ${ko} sbagliati`);
await b.close();
srv.close();
if (CONTROPROVA) {
  if (ko > 0) { console.log("✓ controprova: col difetto rimesso il banco FALLISCE, come deve."); process.exit(0); }
  console.error("✗ controprova: col difetto rimesso il banco è passato lo stesso. Non sa fallire.");
  process.exit(1);
}
process.exit(ko ? 1 : 0);

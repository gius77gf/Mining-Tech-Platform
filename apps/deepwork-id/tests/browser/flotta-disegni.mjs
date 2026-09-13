/* IN FLOTTA IL DISEGNO DICE LA STESSA COSA DEL NUMERO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-disegni.mjs [--porta=8497]
     node flotta-disegni.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08, nel core, è saltata fuori una forma di numero che
   mente che non era ancora censita: **il numero è giusto e a mentire è il
   DISEGNO**. La barra di luglio della produzione dichiarava `height:100%` con
   2.261,7 m³ dentro e ne disegnava 3, identica ai cinque mesi a zero. Nessun
   errore da leggere, e nessuno l'aveva mai vista perché **non c'era mai stata
   una barra alta**: senza dati d'esempio sei stanghette uguali sono esattamente
   quello che ci si aspetta da un grafico vuoto.

   Questo banco fa a Flotta la domanda con il righello, su OGNI elemento il cui
   compito è rappresentare una quantità con una geometria. Non chiede «il
   disegno c'è?» ma **«i pixel stanno fra loro come stanno i valori?»** — e
   siccome un campione solo non distingue «funziona» da «sono tutti uguali»,
   ogni grafico si misura su almeno due valori diversi, in quattro scene: com'è
   di suo, con un valore **mille volte** più grande degli altri, con uno **zero
   misurato**, e col parco vuoto (niente da misurare).

   ⚠️ IL CENSIMENTO, DICHIARATO E NON SOTTINTESO. Le geometrie di Flotta sono
   DIECI, e tutte passano dal motore condiviso (`shared/dw-grafici.js`): otto
   grafici a barre e ad avanzamento — `#dash-gauge-bar` (disponibilità adesso,
   con la tacca del riferimento di settore), `#graf-disp` (disponibilità giorno
   per giorno), `#graf-officina`, `#graf-costi`, `#graf-costi-mese`,
   `#graf-consumo`, `#graf-fermi`, `#graf-fermi-causali` — più due geometrie che
   dicono una quantità con una POSIZIONE invece che con una lunghezza: la
   **tacca** del 90% sulla barra della disponibilità e il **taglio di Pareto**
   all'80% dei giorni persi su `#graf-fermi-causali`. Qui dentro si misurano in
   pixel tutte e dieci.
   In Flotta **non esiste nessuna geometria scritta a mano**: cercati e non
   trovati `style="width:…%"`, `style="height:…%"`, `.style.width`,
   `setProperty('--…')` e gli SVG con dimensioni calcolate (0 occorrenze in
   4.514 righe). Cioè la forma esatta del difetto del core — una percentuale che
   si risolve contro un genitore alto `auto` — in Flotta **non può presentarsi**.
   Resta in giro il CSS di una barra che non disegna più niente (`.gauge-bar i`,
   nessun `<i>` costruito da nessuna parte): censita, morta, lasciata lì.

   CHE COSA HA TROVATO. Sulla geometria, **niente**, e il conto sta scritto in
   fondo al giro: 5 scene, 15 schermate, **37 geometrie misurate in pixel, 152
   barre, 112 confronti fra pixel e valore, 8 posizioni** (tacche e tagli), 11
   barre dichiarate perché cadute sul minimo del motore. I pixel stanno fra loro
   come i valori dal rapporto 1:1 fino a 1:927 (500.420 € contro 540 €); la
   disponibilità dichiarata 67% si disegna 67,01% della traccia; la scala parte
   sempre da zero (con tutte le giornate fra il 50 e il 67% le colonne restano a
   85,5 e 114,7 px, cioè nel rapporto vero, non schiacciate); uno **zero
   misurato** si disegna **0,00 px** — la giornata a nessun mezzo operativo — e
   col parco vuoto la barra della disponibilità **non si disegna affatto** (il
   quadrante dice «—»).
   I due difetti stavano un piano di fianco, tutt'e due sullo **stesso
   grafico** — quello della disponibilità giorno per giorno — e nessuno dei due
   è una sproporzione: uno è un numero, l'altro è una misura presa al buio.

   1 · `#graf-disp` — LA QUOTA CHE NON ESISTE. Le colonne sono percentuali di
       disponibilità, una per giorno: **non si sommano**. Il motore la regola ce
       l'ha scritta — «la quota sul totale ha senso solo se i valori si possono
       sommare», e l'esempio nel suo commento è *proprio* la disponibilità
       giorno per giorno — ma la riconosce solo da `unita:'%'` o da
       `quota:false`, e Flotta non passava né l'una né l'altra (`unita` qui non
       si può usare: col formato «percentuale» il segno c'è già e verrebbe
       «83% %»). Misurato, prima e dopo, in tutt'e due i posti in cui quel
       numero si legge — la tabella dei dati e il tooltip:
         · prima, tabella: `["12,8%","12,8%","10,3%","10,3%"]` su un «totale»
           di 650, che non è il totale di niente;
         · prima, tooltip: «27/07 · 83% · da tenere d'occhio · **quota 12,8%**»;
         · e nella scena dello zero, la giornata a **zero mezzi operativi** si
           dichiarava «**quota 0,0%**» — il numero più tranquillo che quella
           schermata sappia dire, proprio sul giorno in cui la cava era ferma;
         · dopo: la colonna «Quota» scrive «—» e il tooltip non la nomina più.

   ⚠️ IL MINIMO DEL MOTORE È DICHIARATO, NON MISURATO. `dw-grafici.js` disegna
   ogni barra con `Math.max(2, …)` unità di viewBox: sotto quel minimo il
   disegno non è più il valore, è il minimo. Le barre che ci cadono sotto il
   banco le **conta e le dichiara** invece di confrontarle — nella scena del
   valore altissimo sono cinque su sei, ed è giusto così. Sta in `shared/` e
   riguarda tutte e sei le app: qui viene registrato, non corretto.

   2 · E UNA SECONDA COSA, TROVATA COL RIGHELLO MENTRE SI CERCAVA ALTRO, che
       questo banco NON prova (sta fuori dalle sue domande e ha la sua misura in
       `scratchpad`, dichiarata qui perché non si perda): `maxPunti` — quante
       giornate entrano in `#graf-disp` — si decideva leggendo `clientWidth` di
       un contenitore che in quel momento è dentro una `.page` con
       `display:none`, cioè **zero**, quindi vinceva sempre il ripiego e le
       giornate erano **otto anche su uno schermo largo**, dove quella riga ne
       vuole quattordici. Misurato: viewport 1200 px, contenitore 852 px (la
       soglia è 520), colonne disegnate **8**, periodo «dal 30/07 al 06/08»;
       dopo la correzione **14**, «dal 24/07 al 06/08». A 430 px restano 8, come
       deve. Non era un disegno che mente — meta, nota e buchi parlavano
       onestamente delle otto mostrate: era una MISURA presa dove non si poteva
       prendere, cioè la stessa famiglia vista da un altro lato.

   ⛔ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DISEGNO. Il valore altissimo, lo
   zero misurato e il parco vuoto si ottengono aggiungendo righe alla risposta
   HTTP di `flotta-data.js` — la via vera, il modulo dati dell'app. Il file su
   disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8497;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, contati uno per uno: un `replace` che non trova
   niente esce in silenzio, e una controprova che non ha iniettato niente
   dichiara «non so fallire» misurando un file sano.
   Due stanno in Flotta e sono i suoi; due stanno nella COPIA SERVITA del motore
   condiviso — mai sul disco — e servono a provare il RIGHELLO: senza di loro
   questo banco saprebbe bocciare solo un numero, e resterebbe da dimostrare che
   una barra sproporzionata la vedrebbe. Sono i due difetti veri della famiglia:
   lo zero disegnato come una quantità (corretto in `shared/` il 06/08) e l'asse
   che non parte da zero. */
const DIFETTI_FLOTTA = [
  // 1 · la serie di percentuali che torna a dichiarare una quota sul totale
  ["        quota: false,\n", ""],
  // 2 · il fondo scala della barra della disponibilità spostato: stessi numeri
  //     dichiarati, disegno lungo la metà
  ["valore: disp.pct, massimo: 100,", "valore: disp.pct, massimo: 200,"],
];
const DIFETTI_MOTORE = [
  // 3 · lo zero che si disegna col minimo della barra, cioè come una quantità
  ["function lunghezzaBarra(px, minimo) { return px <= 0 ? 0 : Math.max(minimo, px); }",
   "function lunghezzaBarra(px, minimo) { return Math.max(minimo, px); }"],
  /* 4 · la scala compressa: la barra cresce come la RADICE del valore invece che
     come il valore. È il difetto della famiglia che nessun altro controllo
     vedrebbe — tabella giusta, etichette giuste, console pulita, e una spesa
     dieci volte più grande disegnata tre volte più lunga.
     ⚠️ E la strada ovvia è stata provata e SCARTATA, perché nessuno la rifaccia
     alla cieca: far partire la scala dal valore più basso invece che da zero
     (l'asse tagliato) NON fa cadere il confronto fra due barre, e non è un
     difetto del confronto. La larghezza è `pxv(v) − pxv(0)`, cioè
     `W·(v − min)/(max − min) − W·(0 − min)/(max − min)` = `W·v/(max − min)`:
     il termine col minimo si semplifica e il rapporto fra due barre resta
     quello dei valori. L'asse tagliato sposta e allunga TUTTE le barre insieme,
     non le sproporziona — a mentire lì sarebbe la posizione dell'asse, che è
     un'altra domanda e vuole un altro banco. */
  ["var y = cy - spessO / 2, w = d.manca ? 0 : lunghezzaBarra(pxv(d.valore) - pxv(0), 2);",
   "var y = cy - spessO / 2, w = d.manca ? 0 : lunghezzaBarra(Math.sqrt(Math.max(0, pxv(d.valore) - pxv(0))) * 6, 2);"],
  /* 5 · la stessa compressione sulle COLONNE, e non è un doppione: il motore ha
     due rami, uno per le barre orizzontali e uno per quelle verticali, e la
     riga 4 tocca solo il primo. Senza questa, i due grafici a colonne di Flotta
     (`#graf-disp` e `#graf-costi-mese`) resterebbero verdi anche nella
     controprova — cioè non sarebbe dimostrato che il banco su di loro sappia
     bocciare. È la lezione dei backtick: una controprova va misurata anche
     nella sua COPERTURA, non solo nel suo esito. */
  ["var x = cx - spess / 2, y = d.manca ? pyv(0) : pyv(d.valore), h = d.manca ? 0 : lunghezzaBarra(pyv(0) - y, 2);",
   "var x = cx - spess / 2, y = d.manca ? pyv(0) : pyv(d.valore), h = d.manca ? 0 : lunghezzaBarra(Math.sqrt(Math.max(0, pyv(0) - y)) * 6, 2);"],
];

/* LE SCENE. Ognuna è un caso che la dimostrazione da sola non contiene. */
const GI = "const _gi=(n)=>new Date(Date.now()-n*86400000).toISOString().slice(0,10);\n";
const SCENE = {
  // com'è: rapporti fra 1:1 e 1:12 in ogni grafico
  base: "",
  /* IL VALORE ALTISSIMO CHE NON C'ERA. 500.420 € accanto a 540 (1:927),
     2.000.000 € accanto a 3.300 (1:606), 400 l/h accanto a 9,7 (1:41). È la
     scena che nel core avrebbe fatto vedere i 3 px. */
  alto: GI
    + 'DEMO.interventi.push({ id:"wX", data:_gi(20), titolo:"Cambio motore", mezzo:"Escavatore E1", ricambio:null, costo:500000, note:"" });\n'
    + 'DEMO.costi.push({ id:"cX", voce:"Espropri", importo:2000000, nota:"", data:_gi(20) });\n'
    + 'DEMO.rifornimenti.push({ id:"rX1", data:_gi(12), mezzo:"Perforatrice P2", litri:100, euro:150, ore:2900, nota:"", costoId:null });\n'
    + 'DEMO.rifornimenti.push({ id:"rX2", data:_gi(5), mezzo:"Perforatrice P2", litri:4000, euro:6000, ore:2910, nota:"", costoId:null });\n'
    + 'DEMO.fermi.push({ id:"fX", mezzo:"Escavatore E2", causale:"guasto-elettrico", inizio:_gi(4), fine:_gi(4), note:"" });\n',
  /* LO ZERO VERO, MISURATO: nessun mezzo operativo. `disponibilitaFlotta`
     risponde `null` solo col parco VUOTO, quindi qui lo zero è una misura e non
     un buco — e il disegno deve valere zero pixel, non il minimo della barra.
     Vale per due geometrie insieme: la barra della disponibilità e la colonna
     di oggi in `#graf-disp` (la fotografia la scrive l'app da sé all'apertura). */
  zero: GI + 'DEMO.mezzi.forEach(m => { m.stato = "fermo"; });\n',
  /* IL NON MISURATO: parco vuoto. `disponibilitaFlotta` risponde `pct: null` e
     la barra non deve esistere — non «zero», proprio non disegnata. */
  cieco: GI + "DEMO.mezzi.length = 0;\n",
  /* LO SCHIACCIATO: tutte le giornate fra il 50 e il 67%. Se la scala partisse
     dal minimo invece che da zero, mezzo parco fermo si disegnerebbe come una
     colonna quasi piena. */
  schiacciato: GI
    + "DEMO.disponibilita.length = 0;\n"
    + '[9,8,7,6,5,4,3,2,1].forEach((g,i)=>DEMO.disponibilita.push({id:"ds"+i,data:_gi(g),operativi:3,totale:6}));\n',
};

let FIXTURE = "";
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/flotta/flotta-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA) {
    const quali = p.endsWith("apps/flotta/index.html") ? DIFETTI_FLOTTA
      : p.endsWith("shared/dw-grafici.js") ? DIFETTI_MOTORE : null;
    if (quali) {
      let t = corpo.toString("utf8");
      for (const [a, b] of quali) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__flotta-disegni-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__flotta-disegni-${process.pid}`)).text();
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
/* QUANTI SOGGETTI HO GUARDATO DAVVERO: la difesa contro il controllo che non
   guarda dove crede. Un «nessuna violazione» senza il conto accanto non vale. */
const CONTO = { scene: 0, schermate: 0, geometrie: 0, barre: 0, confronti: 0, sottoMinimo: 0, posizioni: 0 };
/* quali grafici hanno avuto ALMENO UNA scena in cui il rapporto si è potuto
   provare davvero. Un grafico che finisse sempre sotto il minimo del motore
   uscirebbe dal banco senza una sola misura, e nessuna riga rossa lo direbbe. */
const PROVATE = new Set();
const ATTESE = ["dash-gauge-bar", "graf-disp", "graf-officina", "graf-costi", "graf-costi-mese", "graf-consumo", "graf-fermi", "graf-fermi-causali"];

/* LA SONDA. Per ogni geometria: che cosa DICHIARA (l'etichetta accessibile, la
   tabella dei dati) e che cosa DISEGNA (`getBoundingClientRect`). Le due cose
   si confrontano fuori dalla pagina, mai qui dentro.
   ⚠️ IL RIGHELLO SBAGLIA PIÙ SPESSO DEL PRODOTTO. Tre trappole già pestate
   altrove e schivate qui: la lunghezza di una barra è quella dell'asse su cui
   il grafico VARIA (dedotta da quale dimensione ha scarto, non dall'aspetto
   della prima barra: in un grafico a colonne la prima può essere un mese a zero,
   più larga che alta); le percentuali dello `style` si leggono col punto
   decimale, non col lettore italiano; e le larghezze si leggono a transizione
   finita, per questo si aspetta prima di misurare. */
const SONDA = () => {
  const att = document.querySelector(".page.active");
  if (!att) return [];
  const out = [];
  const n2 = (x) => +(+x).toFixed(2);
  /* la barra d'avanzamento: valore e massimo si leggono dall'etichetta
     accessibile, cioè da quello che il prodotto DICHIARA a chi non vede. */
  att.querySelectorAll("svg .dwg-fill").forEach((f) => {
    const svg = f.ownerSVGElement, tr = svg.querySelector(".dwg-track");
    const tacca = svg.querySelector(".dwg-tacca");
    const rt = tr.getBoundingClientRect();
    out.push({ g: "avanzamento", host: (f.closest("[id]") || {}).id || "",
      px: n2(f.getBoundingClientRect().width), traccia: n2(rt.width),
      taccaPct: tacca ? n2(100 * (tacca.getBoundingClientRect().left + tacca.getBoundingClientRect().width / 2 - rt.left) / rt.width) : null,
      aria: svg.getAttribute("aria-label") || "" });
  });
  /* le barre: dimensioni disegnate + la riga che il grafico dichiara nella sua
     tabella accessibile. Il rapporto fra due barre è la prova che conta. */
  att.querySelectorAll("svg").forEach((svg) => {
    const barre = svg.querySelectorAll(".dwg-barra");
    if (!barre.length || !svg.closest("figure")) return;
    /* ⚠️ IL QUADRATINO DELLA LEGENDA È UN `.dwg-barra` ANCHE LUI, e sta dentro
       la stessa `<figure>`: preso per un grafico dava «8 righe di tabella, 1
       barra» tre volte per schermata — un KO che parlava del righello, non del
       prodotto. Si riconosce da due cose insieme, il contenitore (`.dwg-leg`) e
       il suo viewBox fisso. */
    if (svg.closest(".dwg-leg") || svg.getAttribute("viewBox") === "0 0 22 11") return;
    const dim = [];
    barre.forEach((x) => { const r = x.getBoundingClientRect(); dim.push([n2(r.width), n2(r.height)]); });
    const spread = (a) => Math.max(...a) - Math.min(...a);
    const oriz = spread(dim.map((d) => d[0])) > spread(dim.map((d) => d[1]));
    const fig = svg.closest("figure");
    const tab = [...fig.querySelectorAll("tbody tr")].map((tr) => [...tr.children].map((c) => c.textContent));
    const inte = [...fig.querySelectorAll("thead th")].map((c) => c.textContent);
    /* il taglio di Pareto: una POSIZIONE che dice una quantità (dove la somma
       arriva all'80%). Si misura in bande, cioè in quante barre gli stanno
       sopra: la sua distanza dal bordo del disegno diviso il passo. */
    const t = svg.querySelector(".dwg-taglio");
    let taglio = null;
    if (t && barre.length) {
      const rb = [...barre].map((x) => x.getBoundingClientRect());
      const rt = t.getBoundingClientRect();
      const passo = barre.length > 1
        ? (oriz ? (rb[rb.length - 1].top - rb[0].top) : (rb[rb.length - 1].left - rb[0].left)) / (barre.length - 1)
        : 0;
      const centro0 = oriz ? rb[0].top + rb[0].height / 2 : rb[0].left + rb[0].width / 2;
      const pos = oriz ? rt.top : rt.left;
      taglio = passo ? n2((pos - centro0) / passo) : null;   // in «barre»: 2,5 = fra la terza e la quarta
    }
    out.push({ g: "barre", host: (svg.closest("[id]") || {}).id || "", oriz: !!oriz, dim, tab, inte, taglio,
      aria: svg.getAttribute("aria-label") || "" });
  });
  /* il quadrante: che cosa dice il numero grande, quando la barra non c'è */
  const num = att.querySelector(".gauge-num");
  if (num) out.push({ g: "quadrante", testo: num.textContent.trim(),
    barra: !!att.querySelector("#dash-gauge-bar svg") });
  return out;
};

async function apri(scena, sezione) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
  await pg.waitForTimeout(2300);
  if (sezione !== "dash") await pg.click("#nav-" + sezione).catch(() => {});
  await pg.waitForTimeout(1000);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare. Un banco che non naviga
     fotografa otto volte la stessa schermata e risponde «tutto a posto». */
  if (viste.length !== 1 || viste[0] !== "page-" + sezione) {
    dice(false, `[${scena}] navigato davvero fino a ${sezione}`, viste.join(",") || "nessuna pagina visibile");
  }
  if (errori.length) dice(false, `[${scena}] nessun errore di pagina (${sezione})`, errori[0]);
  CONTO.schermate++;
  return pg;
}

const pctIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)\s*%/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };
const numIt = (s) => { const m = String(s).match(/(-?[\d.]+(?:,\d+)?)/); return m ? parseFloat(m[1].replace(/\./g, "").replace(",", ".")) : null; };

/* IL MINIMO DEL MOTORE, in pixel sullo schermo: 2 unità di viewBox su una
   larghezza di poco inferiore alla viewport. Misurato: 1,85 px. Si tiene largo. */
const MINIMO_MOTORE = 2.4;
const tolleranza = (atteso) => Math.max(0.7, atteso * 0.02);

/* IL CONFRONTO FRA DUE BARRE — la sola prova che distingue «funziona» da «sono
   tutte uguali». Il valore dichiarato si legge dalla COLONNA DEL VALORE della
   tabella accessibile (non dalla quota: la quota è la cosa che questo banco ha
   trovato sbagliata, e un righello che si tara sul difetto non lo vede mai). */
function confrontaBarre(x, etichetta) {
  const val = x.tab.map((r) => numIt(r[1]));
  const mis = x.dim.map((d) => (x.oriz ? d[0] : d[1]));
  if (val.length !== mis.length || !val.length) {
    dice(false, `${etichetta}: la tabella accessibile ha una riga per barra`, `${val.length} righe, ${mis.length} barre`); return;
  }
  CONTO.geometrie++; CONTO.barre += mis.length;
  let iMax = 0;
  val.forEach((v, i) => { if ((v || 0) > (val[iMax] || 0)) iMax = i; });
  const grandi = mis.filter((v) => v > MINIMO_MOTORE).length;
  if (grandi < 2) {
    /* ⚠️ NON È UN DIFETTO, ED È QUELLO CHE VOLEVO: con un valore mille volte più
       grande TUTTE le altre barre cadono sul minimo del motore, e lì il disegno
       non è più il valore. Dichiararlo un KO farebbe cadere il banco proprio
       nella scena costruita per farlo cadere — e insegnerebbe a non guardarlo.
       Si dichiara, e il conto finale pretende che ogni grafico sia stato provato
       in ALMENO UNA scena: se un grafico finisse sempre qui, il banco lo direbbe
       invece di tacere. */
    CONTO.sottoMinimo += mis.length - grandi;
    console.log(`  ··  ${etichetta}: ${mis.length - grandi} barre su ${mis.length} cadono sul minimo del motore`
      + ` (${val[iMax]} contro ${val.filter((_, i) => i !== iMax).join(", ")}): il rapporto qui non si può provare, e non è un difetto`);
    return;
  }
  PROVATE.add(etichetta.replace(/^\[[^\]]+\]\s*/, ""));
  let peggio = null, fatti = 0, zeri = 0;
  mis.forEach((px, i) => {
    if (i === iMax) return;
    /* LO ZERO NON È UNA BARRA PICCOLA: è la sua prova a parte. Un valore
       misurato e pari a zero deve valere ZERO pixel — disegnarlo col minimo
       vorrebbe dire disegnare una quantità che non c'è. */
    if (val[i] === 0) {
      zeri++; CONTO.confronti++;
      if (px > 0.01) { peggio = { scarto: px, i, px, atteso: 0, val: 0 }; }
      return;
    }
    if (px <= MINIMO_MOTORE) { CONTO.sottoMinimo++; return; }
    CONTO.confronti++; fatti++;
    const atteso = mis[iMax] * (val[i] / val[iMax]);
    const scarto = Math.abs(px - atteso);
    if (!peggio || scarto - tolleranza(atteso) > peggio.scarto - tolleranza(peggio.atteso)) {
      peggio = { scarto, i, px, atteso, val: val[i] };
    }
  });
  const buono = (fatti + zeri) > 0 && (!peggio || peggio.scarto <= tolleranza(peggio.atteso));
  dice(buono,
    `${etichetta}: i pixel stanno fra loro come i valori — ${mis.length} barre ${x.oriz ? "orizzontali" : "verticali"},`
    + ` ${fatti} confrontate con la più grande (${val[iMax]} → ${mis[iMax]} px), ${zeri} a zero, ${mis.length - 1 - fatti - zeri} sotto il minimo del motore`,
    peggio && peggio.scarto > tolleranza(peggio.atteso)
      ? `la barra «${x.tab[peggio.i][0]}» dichiara ${x.tab[peggio.i][1]}: attesi ${peggio.atteso.toFixed(2)} px, disegnati ${peggio.px} px`
      : undefined);
}

/* ══════════════════════════════════════════════════════════════════════
   IL GIRO
   ══════════════════════════════════════════════════════════════════════ */
console.log(`FLOTTA — le geometrie misurate col righello${CONTROPROVA ? "   [CONTROPROVA: i difetti sono stati rimessi]" : ""}\n`);

/* dove sta ogni geometria: si naviga sempre, e si pretende di esserci arrivati */
const DOVE = { dash: ["dash-gauge-bar"], mez: ["graf-disp", "graf-fermi", "graf-fermi-causali", "graf-officina"],
  cos: ["graf-costi", "graf-costi-mese", "graf-consumo"] };

for (const [scena, fx] of Object.entries(SCENE)) {
  FIXTURE = fx;
  CONTO.scene++;
  console.log(`\n── scena «${scena}» ${fx ? "(dati iniettati nella risposta di flotta-data.js)" : "(la dimostrazione com'è)"}`);
  for (const sez of Object.keys(DOVE)) {
    const pg = await apri(scena, sez);
    const g = await pg.evaluate(SONDA);
    for (const x of g) {
      if (x.g === "barre") confrontaBarre(x, `[${scena}] ${x.host}`);
      if (x.g === "avanzamento") {
        CONTO.geometrie++;
        const dich = pctIt(x.aria);
        const disegnato = x.traccia > 0 ? 100 * x.px / x.traccia : null;
        CONTO.confronti++;
        if (dich === 0) {
          /* LO ZERO MISURATO: nessun mezzo operativo. Zero pixel, non il minimo
             della barra — quello si leggerebbe «poca disponibilità», non «nessuna». */
          dice(x.px === 0, `[${scena}] ${x.host}: 0% dichiarato → 0 px disegnati`,
            `dichiarato ${dich}%, disegnati ${x.px} px su ${x.traccia}`);
        } else {
          PROVATE.add(x.host);
          dice(dich != null && disegnato != null && Math.abs(dich - disegnato) <= 0.6,
            `[${scena}] ${x.host}: dichiarato ${dich}% → disegnato ${disegnato == null ? "?" : disegnato.toFixed(2)}% (${x.px} px su ${x.traccia})`,
            `dichiarato ${dich}%, disegnato ${disegnato}%`);
        }
        /* la TACCA del riferimento di settore: una posizione che dice 90 */
        if (x.taccaPct != null) {
          CONTO.posizioni++;
          const rif = numIt((x.aria.match(/riferimento di settore ([\d.,]+)%/) || [])[1] || "");
          dice(rif != null && Math.abs(rif - x.taccaPct) <= 0.6,
            `[${scena}] ${x.host}: la tacca del riferimento sta al ${x.taccaPct}% della traccia (dichiarato ${rif}%)`,
            `dichiarato ${rif}, disegnata a ${x.taccaPct}`);
        }
      }
      if (x.g === "quadrante" && scena === "cieco") {
        /* ⛔ L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE, applicata al DISEGNO:
           col parco vuoto non c'è nessuna percentuale, e la barra non deve
           esistere. Una barra a zero si leggerebbe «misurato, ed è zero». */
        dice(x.testo === "—" && !x.barra,
          `[${scena}] parco vuoto: il quadrante dice «—» e la barra NON si disegna`,
          `testo «${x.testo}», barra ${x.barra ? "disegnata" : "assente"}`);
      }
    }
    /* IL TAGLIO DI PARETO su #graf-fermi-causali: una posizione che dice
       «qui si arriva all'80% dei giorni persi». Si verifica contro la somma
       cumulata letta dalla tabella, non contro un numero scritto a mano. */
    for (const x of g) {
      if (x.g !== "barre" || x.taglio == null) continue;
      CONTO.posizioni++;
      const val = x.tab.map((r) => numIt(r[1]));
      const tot = val.reduce((a, c) => a + c, 0);
      let acc = 0, atteso = -1;
      for (let i = 0; i < val.length; i++) { acc += val[i]; if (acc / tot * 100 >= 80) { atteso = i; break; } }
      dice(atteso >= 0 && Math.abs(x.taglio - (atteso + 0.5)) <= 0.15,
        `[${scena}] ${x.host}: il taglio dell'80% cade dopo la ${atteso + 1}ª barra (${(acc / tot * 100).toFixed(1)}% cumulato)`,
        `atteso a ${(atteso + 0.5).toFixed(2)} barre dal centro della prima, disegnato a ${x.taglio}`);
    }
    /* LA QUOTA CHE NON ESISTE. Una serie di percentuali non si somma: il
       grafico non deve dichiarare la fetta di ognuna sul totale, né nella
       tabella né nel tooltip. Si legge quello che il prodotto SCRIVE. */
    if (sez === "mez") {
      const gd = g.find((x) => x.g === "barre" && x.host === "graf-disp");
      if (gd) {
        const quote = gd.tab.map((r) => r[2]);
        dice(quote.every((q) => q.trim() === "—"),
          `[${scena}] graf-disp: le percentuali di disponibilità NON dichiarano una quota sul totale (${quote.length} righe)`,
          `la tabella scrive ${JSON.stringify(quote.slice(0, 4))} — la somma di percentuali giornaliere non è un totale`);
        const tip = await pg.evaluate(() => {
          const svg = document.querySelector("#graf-disp svg");
          if (!svg) return "";
          const hit = svg.querySelector(".dwg-hit");
          if (!hit) return "";
          const r = hit.getBoundingClientRect();
          hit.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 }));
          const t = document.querySelector("#graf-disp .dwg-tip");
          return t ? t.textContent : "";
        });
        dice(!/quota/i.test(tip), `[${scena}] graf-disp: il tooltip non nomina una quota`, `tooltip: «${tip}»`);
      }
    }
    await pg.close();
  }
}

/* ⛔ OGNI GEOMETRIA CENSITA DEV'ESSERE STATA PROVATA IN ALMENO UNA SCENA. È la
   seconda domanda: senza, un grafico che in tutte le scene finisse sotto il
   minimo del motore uscirebbe dal banco senza una sola misura, e il riepilogo
   direbbe lo stesso «nessuna violazione». */
{
  const mai = ATTESE.filter((n) => !PROVATE.has(n));
  dice(mai.length === 0, `tutte e ${ATTESE.length} le geometrie censite sono state provate col righello in almeno una scena`,
    `mai misurate col rapporto: ${mai.join(", ")}`);
}

/* ⚠️ LA CONTROPROVA DICHIARA QUANTI DIFETTI HA DAVVERO RIMESSO. Un `replace`
   che non trova niente esce in silenzio, e allora la controprova misura un file
   sano e dichiara «non so fallire» accusando la prova invece dell'iniezione. */
if (CONTROPROVA) {
  const tutti = [...DIFETTI_FLOTTA, ...DIFETTI_MOTORE];
  console.log(`\niniezioni riuscite: ${colpiti.size} su ${tutti.length}`);
  for (const [a] of tutti) if (!colpiti.has(a)) console.log(`  ⚠️ NON iniettato: ${a.slice(0, 70)}…`);
  if (colpiti.size !== tutti.length) { console.error("✗ la controprova non ha iniettato tutto: non misura quello che crede."); await b.close(); srv.close(); process.exit(2); }
}

console.log(`\n${CONTO.scene} scene · ${CONTO.schermate} schermate · ${CONTO.geometrie} geometrie misurate in pixel`
  + ` · ${CONTO.barre} barre · ${CONTO.confronti} confronti fra pixel e valore · ${CONTO.posizioni} posizioni (tacche e tagli)`
  + ` · ${CONTO.sottoMinimo} barre sotto il minimo del motore, dichiarate invece che confrontate`);
console.log(`${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (ko === 0) { console.error("✗ CONTROPROVA: con i difetti rimessi il banco NON fallisce — non sta misurando quello che crede."); process.exit(2); }
  console.log("✓ controprova: coi difetti rimessi il banco fallisce, come deve.");
  process.exit(0);
}
process.exit(ko ? 1 : 0);

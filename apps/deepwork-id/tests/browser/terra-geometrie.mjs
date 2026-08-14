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
   ✅ **DAL 09/08 SI MISURANO IN PIXEL TUTTE E SETTE.** La settima — il grafico
   a LINEE `#tur-graf` — era rimasta fuori con una ragione scritta qui («leggere
   i valori dal `d` di un percorso CURVO vorrebbe dire riscrivere l'interpolazione
   del motore, cioè misurare la propria copia»), e la ragione era buona: a
   sbagliare era il soggetto. Non serve leggere il percorso. I PUNTI
   (`circle.dwg-pt`, `circle.dwg-fine`) stanno esattamente su `py(v)` e le righe
   della GRIGLIA stanno su `py` delle tacche: la scala si legge dall'asse — che è
   quella che legge l'utente — e i punti si confrontano con quella, senza nessuna
   interpolazione da rifare. Misurato: scarto massimo **0,05 px** su sette punti,
   e con un dichiarato **33 volte** più piccolo degli altri il rapporto disegnato
   è 0,02960 contro lo 0,02965 dichiarato. Nessun difetto di geometria: il
   grafico a linee di Terra dice la stessa cosa dei suoi numeri.
   ⚠️ E il primo righello sbagliava del solito segno: prendeva la scala dalle
   ETICHETTE delle tacche invece che dalle righe di griglia, e
   `getBoundingClientRect` su un `<text>` dà il riquadro dell'INCHIOSTRO, che sta
   qualche pixel sotto la riga. Dava 0,005233 px/m³ contro 0,005250 — lo 0,3%,
   cioè un righello che accusa un disegno sano.

   3 · E QUELLO CHE IL RIGHELLO NUOVO HA TROVATO NON ERA UNA GEOMETRIA, ERA LA
       FRASE SOTTO DI ESSA. Il grafico lascia un BUCO dove il dichiarato non c'è,
       ed è giusto; ma la nota sotto lo raccontava sempre allo stesso modo — «in
       N intervalli i turni non hanno dichiarato niente» — anche dove i turni
       AVEVANO dichiarato viaggi o tonnellate senza densità, cioè dove a mancare
       non è la registrazione ma la conversione. Misurato iniettando un intervallo
       di soli viaggi: «In 2 intervalli i turni non hanno dichiarato niente», con
       61 viaggi veri dentro uno dei due. La distinzione era già in casa quaranta
       righe più su nella stessa pagina (`riconciliazioneTurni` → `no-dichiarato`
       contro `no-densita`): il grafico ne teneva la copia più debole. Corretto in
       `serieDichiaratoTurni` / `descriviBuchiTurni` di `terra-data.js`.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DISEGNO. L'anno cieco, lo zero
   misurato, il mese altissimo, il dichiarato trenta volte più piccolo e
   l'intervallo di soli viaggi si ottengono aggiungendo righe alla risposta HTTP
   di `terra-data.js` — la via vera, il modulo dati dell'app. Il file su disco non
   si tocca mai. */
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
/* ⚠️ DUE FORME NELLA STESSA TABELLA, e la ragione è dichiarata: una coppia
   `[cerca, sostituisci]` tocca `apps/terra/index.html` (il caso di gran lunga
   più frequente), una terna `[file, cerca, sostituisci]` dice il file. Serve
   perché la geometria del grafico a LINEE non la scrive Terra, la scrive il
   motore condiviso: per provare che il righello sappia fallire il difetto va
   rimesso LÌ. `iniezioni-fresche.mjs` legge tutte e due le forme (toglie gli
   elementi che sono un percorso di prodotto e prende la coppia rimasta). */
const PAGINA = "apps/terra/index.html";
const DIFETTI = [
  // 1 · il disegno che non legge la bandiera «senza-rilievi» del modulo
  ['if (pr.stato === "senza-rilievi") {', 'if (false) {'],
  // 2 · la testa del riempimento accesa anche su un consumo di zero m³
  ['<i class="vita-fill${wVuota}"', '<i class="vita-fill"'],
  /* 3 · IL DISEGNO CHE NON STA AL VALORE. La scala del grafico a linee diventa
     una radice: i punti restano tutti, la tabella accessibile non cambia di una
     virgola, e i pixel smettono di stare fra loro come stanno i m³ — cioè
     esattamente la forma di difetto che questo banco esiste per prendere. */
  ["shared/dw-grafici.js",
    "var py = function (v) { return box.y1 - (box.y1 - box.y0) * (v - sc.min) / (sc.max - sc.min); };",
    "var py = function (v) { return box.y1 - (box.y1 - box.y0) * Math.sqrt((v - sc.min) / (sc.max - sc.min)); };"],
  /* 4 · IL BUCO DISEGNATO A ZERO. Un intervallo senza dichiarato torna a valere
     0 m³: la linea scende a terra e dice «hanno prodotto zero» dove nessuno ha
     registrato niente. */
  ["const S = serieDichiaratoTurni(dichiarati);",
    "const S = { valori: dichiarati.map((d) => (d && d.m3) || 0), conto: serieDichiaratoTurni(dichiarati).conto };"],
  /* 5 · LA FRASE CHE ACCUSA I TURNI. Rimessa la vecchia riga, la nota torna a
     dire «non hanno dichiarato niente» anche dove i turni hanno dichiarato
     viaggi o tonnellate senza densità. */
  ["apps/terra/terra-data.js",
    "nessun turno ha registrato una produzione`);",
    "i turni non hanno dichiarato niente`);"],
];
const difettiDi = (percorso) => DIFETTI.filter((d) => (d.length === 3 ? d[0] : PAGINA) === percorso)
  .map((d) => (d.length === 3 ? [d[1], d[2]] : d));

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
  /* IL DICHIARATO TRENTA VOLTE PIÙ PICCOLO. Nella dimostrazione i quattro
     intervalli si somigliano tutti (dal 17.298 al 21.300 m³: rapporto 0,81), e
     su valori così vicini «i pixel stanno fra loro come i m³» lo direbbe anche
     un disegno mezzo sbagliato. Qui un intervallo scende a 1.200 t, cioè 631,6
     m³ alla densità dell'atto: rapporto 0,03. */
  turniScala: '\nDEMO.rapportiniCampo = DEMO.rapportiniCampo.filter((r) => !(r.data >= "2026-06-17" && r.data <= "2026-07-01"));'
    + '\nDEMO.rapportiniCampo.push({ id:"p1", data:"2026-06-19", turno:"Mattina", squadra:"Squadra B", prodQta:1200, prodUnita:"t", stato:"inviato" });\n',
  /* UN INTERVALLO DI SOLI VIAGGI. I turni HANNO registrato, e niente di quello
     che hanno registrato si porta in metri cubi (servirebbe la portata del
     mezzo). Il buco nel grafico è giusto; la frase che lo racconta diceva «i
     turni non hanno dichiarato niente», che è falso. */
  turniViaggi: '\nDEMO.rapportiniCampo = DEMO.rapportiniCampo.filter((r) => !(r.data >= "2026-06-17" && r.data <= "2026-07-01"));'
    + '\n[["v1","2026-06-19",12],["v2","2026-06-23",13],["v3","2026-06-26",11],["v4","2026-06-30",14],["v5","2026-07-01",11]]'
    + '.forEach(([id, data, q]) => DEMO.rapportiniCampo.push({ id, data, turno:"Mattina", squadra:"Squadra C", prodQta:q, prodUnita:"viaggi", stato:"inviato" }));\n',
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
  if (CONTROPROVA) {
    const rel = p.slice(R.length + 1);
    const mie = difettiDi(rel);
    if (mie.length) {
      let t = corpo.toString("utf8");
      for (const [a, b] of mie) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
      corpo = Buffer.from(t, "utf8");
    }
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
const CONTO = { schermate: 0, geometrie: 0, barre: 0, confronti: 0, sottoMinimo: 0, punti: 0 };

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
  /* IL GRAFICO A LINEE. Fino al 09/08 questo banco dichiarava di non averlo
     mai guardato in pixel, e la ragione era buona: leggere i valori dal `d` di
     un percorso CURVO vorrebbe dire riscrivere qui l'interpolazione del motore,
     cioè misurare la propria copia. La via che non la riscrive c'era: i PUNTI
     (`circle.dwg-pt`, `circle.dwg-fine`) stanno esattamente su `py(v)`, e le
     GRIGLIE orizzontali stanno su `py` delle tacche. Quindi la scala si legge
     dall'asse — che è quello che l'utente legge — e i punti si confrontano con
     quella, senza nessuna interpolazione da rifare.
     ⚠️ Le tacche NON si leggono dal testo delle etichette: `getBoundingClientRect`
     su un <text> dà il riquadro dell'inchiostro, che sta qualche pixel sotto la
     riga. Misurato: la scala presa dai testi dava 0,005233 px/m³ e quella vera
     0,005250 — lo 0,3% di sbaglio, cioè un righello che accusa un disegno sano.
     Si prendono le righe della GRIGLIA, che stanno su `py(v)` alla virgola. */
  att.querySelectorAll("svg").forEach((svg) => {
    const punti = [...svg.querySelectorAll("circle.dwg-pt, circle.dwg-fine")];
    if (!punti.length) return;
    const grid = [...svg.querySelectorAll("line.dwg-grid")].map((l) => n2(l.getBoundingClientRect().top));
    /* le tacche dell'asse Y sono le prime del documento: il motore le disegna
       nel `forEach` delle tacche, le date dell'asse X vengono dopo */
    const tickY = [...svg.querySelectorAll("text.dwg-tick")].slice(0, grid.length).map((t) => t.textContent);
    const fig = svg.closest("figure");
    out.push({ g: "linea", host: (svg.closest("[id]") || {}).id || "", grid, tickY,
      intest: fig ? [...fig.querySelectorAll("thead th, thead td")].map((c) => c.textContent.trim()) : [],
      tab: fig ? [...fig.querySelectorAll("tbody tr")].map((tr) => [...tr.children].map((c) => c.textContent.trim())) : [],
      punti: punti.map((c) => { const r = c.getBoundingClientRect();
        return { s: /\bs2\b/.test(c.getAttribute("class")) ? 2 : 1, cx: n2(r.left + r.width / 2), cy: n2(r.top + r.height / 2) }; }),
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

/* IL CONFRONTO SUL GRAFICO A LINEE. Tre domande, in quest'ordine:
   1 · quanti punti sono disegnati? Devono essere quanti sono i valori che la
       tabella accessibile dichiara — un buco NON si disegna, e un buco disegnato
       a zero è la faccia tranquilla dell'assenza (regola del fondatore);
   2 · ogni punto sta alla sua altezza? Si confronta la distanza dallo ZERO
       dell'asse con il valore per la scala che l'asse stesso dichiara;
   3 · e il RAPPORTO fra il valore più piccolo e il più grande. È la sola domanda
       che distingue «funziona» da «sono tutti uguali», e con soli campioni
       vicini fra loro non prova quasi niente — per questo c'è una scena con un
       dichiarato trenta volte più piccolo.
   ⚠️ Nessun minimo di visibilità qui: i punti sono cerchi veri, non passano da
   `lunghezzaBarra`. Se un giorno ce ne fosse uno, la coppia appiattita si
   stampa invece di essere saltata in silenzio. */
function confrontaLinea(x, etichetta) {
  const tacche = x.tickY.map(numIt);
  const scendono = x.grid.every((y, i) => i === 0 || y < x.grid[i - 1]);
  const salgono = tacche.every((v, i) => v != null && (i === 0 || v > tacche[i - 1]));
  const iZero = tacche.indexOf(0);
  if (x.grid.length < 2 || x.grid.length !== tacche.length || !scendono || !salgono || iZero < 0) {
    dice(false, `${etichetta}: l'asse dichiara le sue tacche, in ordine, e una è lo zero`,
      `tacche ${JSON.stringify(x.tickY)} · righe di griglia ${JSON.stringify(x.grid)}`);
    return;
  }
  const y0 = x.grid[iZero], vAlta = tacche[tacche.length - 1];
  const scala = (y0 - x.grid[tacche.length - 1]) / vAlta;        // px per m³, DALL'ASSE
  let misurati = [];
  let serie = 0;
  for (const s of [1, 2]) {
    const dichiarati = x.tab.map((r) => r[s]).filter((v) => v !== undefined)
      .map((v) => (v === "—" ? null : numIt(v)));
    const disegnati = x.punti.filter((p) => p.s === s).sort((a, b) => a.cx - b.cx);
    const valori = dichiarati.filter((v) => v != null);
    if (!dichiarati.length) continue;
    serie++;
    dice(disegnati.length === valori.length,
      `${etichetta} · serie ${s}: si disegna un punto per ogni valore dichiarato, e i buchi restano buchi`,
      `${disegnati.length} punti disegnati, ${valori.length} valori su ${dichiarati.length} righe`
      + ` (${dichiarati.length - valori.length} buchi)`);
    if (disegnati.length !== valori.length) continue;
    let peggio = null;
    disegnati.forEach((p, i) => {
      const v = valori[i], alto = y0 - p.cy, atteso = v * scala;
      misurati.push({ v, alto });
      CONTO.punti++;
      const scarto = Math.abs(alto - atteso);
      if (!peggio || scarto > peggio.scarto) peggio = { scarto, v, alto, atteso };
    });
    dice(peggio && peggio.scarto <= Math.max(0.6, peggio.atteso * 0.01),
      `${etichetta} · serie ${s}: ogni punto sta sopra lo zero di quanto vale, per la scala che l'asse dichiara`,
      peggio && `il peggiore: ${peggio.v} m³ → attesi ${peggio.atteso.toFixed(2)} px, disegnati ${peggio.alto.toFixed(2)}`);
  }
  dice(serie >= 1, `${etichetta}: la tabella accessibile ha almeno una serie`, serie);
  /* ⛔ E IL BUCO DEVE RESTARE UN BUCO, non diventare uno zero. La colonna del
     DICHIARATO si trova per INTESTAZIONE, non per posizione: in questo grafico
     `produzioneDichiarata` mette il totale in metri cubi a zero solo quando non
     ha potuto convertire — quindi uno «0 m³» in quella colonna non è mai una
     produzione nulla, è un'assenza travestita. Senza questa riga il difetto
     numero 4 della controprova (il buco disegnato a terra) passava inosservato:
     con gli zeri al posto dei buchi la tabella non ha più nessun «—», i punti
     tornano a essere tanti quanti i valori e ogni altra asserzione dice ok. */
  const iDich = x.intest.findIndex((t) => /dichiarat/i.test(t));
  if (iDich > 0) {
    const col = x.tab.map((r) => r[iDich]);
    const zeri = col.filter((v) => /^0(?:[.,]0+)?\s/.test(v));
    dice(col.includes("—") && zeri.length === 0,
      `${etichetta}: l'intervallo senza dichiarato resta un «—», non uno «0 m³»`,
      `colonna «${x.intest[iDich]}»: ${JSON.stringify(col)}`);
  } else {
    dice(false, `${etichetta}: la tabella dichiara quale colonna è il dichiarato dei turni`, JSON.stringify(x.intest));
  }
  /* uno ZERO dichiarato si disegna sulla riga dello zero: è la stessa regola
     delle barre (`lunghezzaBarra`), qui sui punti */
  for (const m of misurati.filter((x) => x.v === 0))
    dice(Math.abs(m.alto) <= 0.6, `${etichetta}: uno zero dichiarato si disegna SULLA riga dello zero`,
      `disegnato ${m.alto.toFixed(2)} px sopra lo zero`);
  /* il rapporto: due valori DIVERSI, e si dichiara quanto sono diversi — un
     rapporto vicino a 1 non distingue un disegno giusto da uno piatto.
     ⛔ E LO ZERO RESTA FUORI DA QUESTA COPPIA, per una ragione misurata il
     09/08 nella controprova di questo stesso banco: con un buco disegnato a
     zero il valore più piccolo diventa 0, e `0/21300` fa 0 tanto nei m³ quanto
     nei pixel — il rapporto tornava «0,00000 contro 0,00000», cioè la prova
     passava **col difetto dentro**. È la prima delle cinque cause di CLAUDE.md:
     i dati della prova facevano coincidere la risposta giusta con quella
     sbagliata. Lo zero ha già la sua asserzione qui sopra. */
  misurati = misurati.filter((x) => x.v > 0).sort((a, b) => a.v - b.v);
  const pic = misurati[0], gra = misurati[misurati.length - 1];
  if (!pic || pic.v === gra.v) { dice(false, `${etichetta}: servono DUE valori diversi e maggiori di zero, se no il rapporto non prova niente`, misurati.length); return; }
  const rv = pic.v / gra.v, rp = pic.alto / gra.alto;
  dice(Math.abs(rv - rp) <= 0.01,
    `${etichetta}: i pixel stanno fra loro come i m³ — rapporto dichiarato ${rv.toFixed(5)}, disegnato ${rp.toFixed(5)}`
    + ` (${misurati.length} punti, dal più piccolo ${pic.v} al più grande ${gra.v})`,
    `${pic.alto.toFixed(2)} px su ${gra.alto.toFixed(2)}`);
}

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
    if (x.g === "linea") confrontaLinea(x, `${sez} · «${x.host}» a linee`);
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

// ── SCENA 5 · il grafico a LINEE, col righello sui punti ──────────────────
console.log("\n· misurato e dichiarato volo per volo: i punti stanno dove dicono di stare?");
for (const [scena, nota] of [["turniScala", "un dichiarato 30 volte più piccolo"],
                             ["turniViaggi", "un intervallo di soli viaggi"]]) {
  FIXTURE = SCENE[scena];
  const pg = await apri("nav-ril");
  const r = await pg.evaluate(SONDA);
  CONTO.geometrie += r.length;
  const linee = r.filter((x) => x.g === "linea");
  dice(linee.length === 1, `${scena}: il grafico a linee dei turni c'è (${nota})`, JSON.stringify(r.map((x) => x.g)));
  for (const x of linee) confrontaLinea(x, `${scena} · «${x.host}»`);
  /* ⛔ E LA FRASE SOTTO IL GRAFICO NON ACCUSA CHI HA REGISTRATO. Il buco è
     giusto — quello che non si converte non si disegna — ma fino al 09/08 la
     nota lo raccontava come «i turni non hanno dichiarato niente» anche qui,
     dove i turni hanno dichiarato 61 viaggi veri. È il numero che mente con la
     faccia tranquilla, nella sua veste di FRASE. */
  const note = await pg.evaluate(() => [...document.querySelectorAll("#tur-graf .note")].map((n) => n.textContent.replace(/\s+/g, " ").trim()));
  if (scena === "turniViaggi") {
    const t = note.join(" ");
    dice(!/non hanno dichiarato niente/.test(t),
      "⛔ la nota NON dice «non hanno dichiarato niente» dove i turni hanno dichiarato viaggi", t.slice(0, 260));
    dice(/61 viaggi/.test(t) && /non si converte in metri cubi/.test(t),
      "e dice che cosa hanno dichiarato e perché non entra nel grafico", t.slice(0, 260));
  } else {
    dice(note.some((t) => /nessun turno ha registrato una produzione/.test(t)),
      "la nota chiama col suo nome l'intervallo in cui nessuno ha registrato", note.join(" | ").slice(0, 260));
  }
  await pg.close();
}

// ── riepilogo ─────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(72)}`);
console.log(`Soggetti guardati: ${CONTO.geometrie} geometrie su ${CONTO.schermate} schermate`
  + ` · ${CONTO.barre} barre, ${CONTO.confronti} confrontate a due a due`
  + ` · ${CONTO.sottoMinimo} sotto il minimo del motore (2 unità, dichiarate e non confrontate)`
  + ` · ${CONTO.punti} punti del grafico a linee, misurati contro la scala che l'asse dichiara`);
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

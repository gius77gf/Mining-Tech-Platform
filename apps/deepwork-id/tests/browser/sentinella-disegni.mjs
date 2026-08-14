/* SENTINELLA · I DISEGNI CHE RAPPRESENTANO UNA QUANTITÀ
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-disegni.mjs [--porta=8934]
     node sentinella-disegni.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08, nel core, è saltata fuori una forma di numero
   tranquillo che non era ancora censita: **il numero è giusto e a mentire è il
   DISEGNO**. La barra di luglio del grafico della produzione portava
   `style="height:100%"` e `data-val="2261.7 mc"`, e veniva disegnata **3 px** —
   identica ai cinque mesi a zero — perché la percentuale si risolveva contro
   un'altezza `auto`. CSS valido, percentuale presente, zero errori in console:
   solo lo scatto e una misura in pixel lo dicevano.

   Sentinella è l'app dove quella forma costa di più, perché qui i disegni
   dicono **conforme o superamento**. Questo banco fa a ogni geometria le tre
   domande che nessuna suite `node` sa fare:

   1. il disegno è PROPORZIONALE al valore? E la prova non è un campione solo —
      un campione non distingue «funziona» da «sono tutti uguali»: si prendono
      valori in rapporto noto (20 · 100 · 200 · 400) e si pretende che le
      distanze in PIXEL dall'asse dello zero stiano nello stesso rapporto;
   2. la LINEA DI SOGLIA sta sulla stessa scala dei dati? Il caso più grave di
      questa app è una lettura sopra soglia disegnata sotto la linea: il disegno
      direbbe «conforme» su un superamento. Si costruiscono due letture appena
      sopra e appena sotto (10,1 e 9,9 contro soglia 10) e si misura QUALE DEI
      DUE ELEMENTI STA PIÙ IN ALTO in pixel;
   3. il caso NON MISURABILE è disegnato come tale? Un punto senza soglia, una
      soglia fuori scala e un punto mai misurato non devono produrre una linea
      tranquilla o una barra a zero — il principio del fondatore applicato al
      disegno.

   ⛔ QUELLO CHE HA TROVATO IL 06/08, e stava in `shared/dw-grafici.js` (non in
   Sentinella): la MINIATURA del Quadro contraddiceva il badge che le sta sopra.
   Sentinella conta superamento anche una lettura ESATTAMENTE pari alla soglia
   (`>=`), e lo fa ovunque: `serieStorica` (`l.valore >= soglia`), i due
   `dwGrafici.linea` che le passano `inclusiva: true`, il badge, il conteggio
   «Oltre», il file per l'ARPA. `disegnaSpark` invece decideva da sola con
   `ult > s.soglia`. ✅ Corretto: il contratto di `soglia` è stato allargato,
   e adesso accetta tanto un numero quanto `{ valore, inclusiva }`.

   ⛔ E QUELLA CORREZIONE HA APERTO IL DIFETTO CHE QUESTO BANCO NON VEDEVA, che
   è la ragione per cui i controlli qui sotto sono cambiati il 09/08. Il
   contratto è stato allargato **dove si legge il verdetto** (riga ~1382:
   `var sog = (s.soglia && typeof s.soglia === 'object') ? … `) e **non dove si
   costruisce la scala** (riga ~1344, quaranta righe più in su):

       var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
       if (s.soglia != null) { min = Math.min(min, s.soglia); max = Math.max(max, s.soglia); }

   `Math.min(10, { valore: 40 })` fa **NaN**. Da lì `min` e `max` sono NaN, `py`
   restituisce NaN, e la miniatura esce così:

       d="M2.0 NaNC10.5 NaN,29.7 NaN,46.7 NaN…"   line.dwg-soglia y1="NaN"

   Effetto misurato sulla dimostrazione, senza nessuna iniezione: nel Quadro —
   la PRIMA schermata dell'app — la miniatura non disegna **niente**. Linea e
   area 0×0 px, la linea di soglia appiattita sul bordo alto, il rombo del
   superamento pure. Nessun errore in console: un attributo SVG non valido non
   solleva, l'elemento resta nel DOM.
   ⚠️ E il verso è quello che inganna: con `soglia: null` (punto senza limite)
   la miniatura funziona benissimo. Si rompe **solo dove ha qualcosa da dire**.
   ⛔ Perché questo banco lo assolveva: i suoi tre controlli chiedevano se
   l'elemento C'È, mai DOVE STA — e un elemento con geometria NaN c'è, con un
   rettangolo schiacciato in cima da cui `cy` ricava un numero plausibile.
   43 ok · 0 KO su un disegno inesistente. Adesso si misura il percorso.

   La correzione (UNA riga, in `shared/dw-grafici.js`, non in questa cartella):
   la normalizzazione di `sog`/`sVal` va spostata **prima** del calcolo di
   min/max, e min/max devono usare `sVal` invece di `s.soglia`. Provata
   applicandola alla sola risposta HTTP: la miniatura torna proporzionale
   (10·20·30·40 → 0 · 13,3 · 26,7 · 40,0 px, scarto massimo 0,033 px) e il
   rombo cade esattamente sulla linea di soglia.
   Finché quella riga non è corretta il controllo H resta KO: è un difetto vero,
   non una prova storta, e non si spegne il controllo per farlo diventare verde.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, NON NEL DOCUMENTO: si aggiungono righe in
   coda alla risposta HTTP di `sentinella-data.js`, cioè si passa dalla via vera
   (il modulo dati dell'app). Il file su disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8934;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

/* ── I CASI ────────────────────────────────────────────────────────────────
   gA · valori in rapporto NOTO (20 · 100 · 200) con la soglia dentro la scala:
        è la prova del rapporto, e la soglia a 250 vale 1,25 volte il 200.
   gB · due letture a cavallo della soglia (9,9 e 10,1 contro 10): è la prova
        di «quale dei due sta più in alto».
   gC · soglia lontanissima dai valori: deve restare FUORI dalla scala e
        dichiararlo, invece di schiacciare la linea dei dati sul fondo.
   gD · punto SENZA soglia: nessuna linea, e nessun conteggio «Oltre».
   gE · punto MAI MISURATO: nessun grafico, e lo stato vuoto che lo dice.
   gS · ultima lettura ESATTAMENTE pari alla soglia, con rapporto 1,0 — nella
        dimostrazione il massimo è 0,92, quindi è lui il «punto messo peggio»
        e finisce nella miniatura del Quadro.
   gT · rapporto grande/piccolo dentro un grafico del motore condiviso
        (20 · 100 · 200 · 400), con soglia 500 sopra tutte le letture.
   gS e gT stanno tutt'e due su rc4, che nella dimostrazione e' il ricettore
   SENZA soglia propria: cosi' ognuno tiene la soglia scritta sulla sua scheda
   (se rc3 gliela imponesse, gT arriverebbe a rapporto 10 e ruberebbe a gS il
   posto di «punto messo peggio», che e' quello che il caso H deve misurare). */
const FIX = `
DEMO.monitoraggi.push({ id: "gA", nome: "BANCO A — rapporto", tipo: "polveri", unita: "µg/m³", valore: 200, soglia: 250,
  letture: [{ data: "2026-05-04", valore: 20 }, { data: "2026-05-14", valore: 100 }, { data: "2026-05-24", valore: 200 }] });
DEMO.monitoraggi.push({ id: "gB", nome: "BANCO B — a cavallo della soglia", tipo: "rumore", unita: "dB(A)", valore: 9.95, soglia: 10,
  letture: [{ data: "2026-05-04", valore: 9.9 }, { data: "2026-05-14", valore: 10.1 }, { data: "2026-05-24", valore: 9.95 }] });
DEMO.monitoraggi.push({ id: "gC", nome: "BANCO C — soglia lontanissima", tipo: "rumore", unita: "dB(A)", valore: 1.5, soglia: 900,
  letture: [{ data: "2026-05-04", valore: 1 }, { data: "2026-05-14", valore: 2 }, { data: "2026-05-24", valore: 1.5 }] });
DEMO.monitoraggi.push({ id: "gD", nome: "BANCO D — senza soglia", tipo: "acque", unita: "mg/l", valore: 7,
  letture: [{ data: "2026-05-04", valore: 5 }, { data: "2026-05-14", valore: 9 }, { data: "2026-05-24", valore: 7 }] });
DEMO.monitoraggi.push({ id: "gE", nome: "BANCO E — mai misurato", tipo: "acque", unita: "mg/l", valore: 0, soglia: 10, letture: [] });
DEMO.monitoraggi.push({ id: "gS", nome: "BANCO S — ultima lettura pari alla soglia", tipo: "polveri", unita: "µg/m³",
  valore: 40, soglia: 40, ricettoreId: "rc4",
  letture: [{ data: "2026-05-04", valore: 10 }, { data: "2026-05-14", valore: 25 },
            { data: "2026-05-24", valore: 30 }, { data: "2026-06-04", valore: 40 }] });
DEMO.monitoraggi.push({ id: "gT", nome: "BANCO T — rapporto grande/piccolo", tipo: "polveri", unita: "µg/m³",
  valore: 400, soglia: 500, ricettoreId: "rc4",
  letture: [{ data: "2026-05-04", valore: 20 }, { data: "2026-05-14", valore: 100 },
            { data: "2026-05-24", valore: 200 }, { data: "2026-06-04", valore: 400 }] });
`;

/* I DIFETTI DA RIMETTERE. Si CONTANO: un `replace` che non trova niente esce in
   silenzio, e una controprova che non sostituisce niente non prova niente. */
const DIFETTI_MODULO = [
  /* 1 · la soglia disegnata su una scala SUA, com'era il grafico del core:
        il numero è giusto, la geometria no. Deve far cadere B e C. */
  ["      y: r1(py(soglia)), valore: soglia, fuoriScala: !sogliaInScala,",
   "      y: r1(box.y1 - (soglia / (yMax * 1.35)) * (box.y1 - box.y0)), valore: soglia, fuoriScala: !sogliaInScala,"],
  /* 2 · la scala dei dati non più lineare: il disegno resta «plausibile» e
        smette di essere proporzionale. Deve far cadere A. */
  ["  const py = (v) => box.y1 - (Math.min(Math.max(v, 0), yMax) / yMax) * (box.y1 - box.y0);",
   "  const py = (v) => box.y1 - Math.sqrt(Math.min(Math.max(v, 0), yMax) / yMax) * (box.y1 - box.y0);"],
  /* 3 · la soglia fuori scala non dichiarata più: la linea viene disegnata
        comunque e schiaccia i dati sul fondo. Deve far cadere D. */
  ["  const sogliaInScala = soglia != null && (vmax <= 0 || soglia <= vmax * 2.5);",
   "  const sogliaInScala = soglia != null;"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [a, b] of DIFETTI_MODULO) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t + FIX, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__sent-disegni-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sent-disegni-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

/* ⚠️ UNO SCRIPT CHE «NON FALLISCE» NON HA PER FORZA FATTO QUALCOSA: un
   `replace` che non trova niente esce in silenzio. Il controllo si fa in DUE
   tempi, e la prima stesura ne aveva solo il secondo — che al momento in cui
   girava non poteva sapere niente, perché il modulo non era ancora stato
   chiesto dal browser e il conto era per forza zero.
   1) sul file, PRIMA di partire: ogni testo cercato deve esistere una volta
      sola (se il modulo cambia, la controprova va riscritta, non ignorata);
   2) dopo che il browser ha caricato la pagina: quel testo deve essere stato
      davvero sostituito nella risposta HTTP. */
if (CONTROPROVA) {
  const sorgente = readFileSync(join(R, "apps/sentinella/sentinella-data.js"), "utf8");
  for (const [a] of DIFETTI_MODULO) {
    const n = sorgente.split(a).length - 1;
    if (n !== 1) {
      console.error(`✗ controprova: il testo da sostituire compare ${n} volte invece di 1.\n  ${a.slice(0, 90)}…`);
      process.exit(2);
    }
  }
  console.log(`(controprova: ${DIFETTI_MODULO.length} testi da sostituire, tutti trovati una volta sola nel modulo)`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, misurati = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 320)}` : ""}`); }
};
/* ⚠️ LA TOLLERANZA VA MESSA SULLA POSIZIONE, NON SUL RAPPORTO — e la prima
   stesura di questo banco sbagliava proprio qui, dando due KO su un disegno
   sano. `serieStorica` arrotonda le coordinate a un decimo di unità del
   viewBox: un errore fisso di 0,05 unità pesa lo 0,03% sul punto più alto e
   lo 0,4% su quello più basso, quindi una tolleranza RELATIVA sul rapporto è
   contemporaneamente lasca in cima e stretta in fondo. Si confronta invece la
   posizione attesa in pixel con quella misurata, con un margine ASSOLUTO: due
   decimi di pixel coprono l'arrotondamento e lo scaling del viewBox, e non
   coprono nessun difetto vero (l'iniezione della controprova sposta i punti di
   decine di pixel). */
const PELO = 0.25;   // px
const vicino = (misurato, atteso, tol = PELO) => Math.abs(misurato - atteso) <= tol;

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
await pg.waitForTimeout(2600);

console.log(`\n════════ Sentinella · i disegni che rappresentano una quantità${CONTROPROVA ? " · controprova" : ""} ════════`);
dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
if (CONTROPROVA && colpiti.size !== DIFETTI_MODULO.length) {
  console.error(`✗ controprova: il browser ha caricato il modulo con ${colpiti.size} difetti su ${DIFETTI_MODULO.length}.`);
  await b.close(); srv.close(); process.exit(2);
}

/* ══ H · LA MINIATURA DEL QUADRO E IL BADGE CHE LE STA SOPRA ══════════════
   Si misura per prima perché è il Quadro: la schermata che si vede aprendo. */
console.log("\n· H — il Quadro: badge, frase e miniatura sullo STESSO punto");
{
  const q = await pg.evaluate(() => {
    const box = document.getElementById("dash-peggio");
    const svg = box && box.querySelector("svg.dwg-spark");
    const cy = (n) => { const r = n.getBoundingClientRect(); return +(r.y + r.height / 2).toFixed(2); };
    return {
      nome: (box.querySelector(".peggio-nome") || {}).textContent || "",
      badge: (box.querySelector(".badge") || {}).textContent || "",
      nota: (box.querySelector(".peggio-note") || {}).textContent || "",
      spark: svg ? {
        /* ⚠️ NON BASTA CHIEDERE SE L'ELEMENTO C'È: con una geometria `NaN`
           l'elemento esiste, il suo rettangolo si schiaccia in cima all'svg,
           e `cy` restituisce un numero plausibile. Si porta via anche il `d`
           GREZZO e il bordo dell'svg, cioè i due dati da cui si vede se il
           disegno ha davvero una forma. */
        soglia: (() => { const l = svg.querySelector("line.dwg-soglia"); return l ? cy(l) : null; })(),
        sogliaY1: (() => { const l = svg.querySelector("line.dwg-soglia"); return l ? l.getAttribute("y1") : null; })(),
        oltre: (() => { const d = svg.querySelector("path.dwg-oltre"); return d ? cy(d) : null; })(),
        fine: (() => { const c = svg.querySelector("circle.dwg-fine"); return c ? cy(c) : null; })(),
        d: (() => { const l = svg.querySelector("path.dwg-linea"); return l ? l.getAttribute("d") : null; })(),
        largo: (() => { const l = svg.querySelector("path.dwg-linea"); return l ? +l.getBoundingClientRect().width.toFixed(2) : null; })(),
        alto: (() => { const l = svg.querySelector("path.dwg-linea"); return l ? +l.getBoundingClientRect().height.toFixed(2) : null; })(),
      } : null,
    };
  });
  misurati += q.spark ? 3 : 0;
  dice(/BANCO S/.test(q.nome), "il punto messo peggio è quello costruito apposta", q.nome);
  dice(q.badge === "Superamento", "il badge dice «Superamento» (ultima lettura 40, soglia 40)", q.badge);
  dice(/volta oltre soglia/.test(q.nota), "e la frase sotto dice «1 volta oltre soglia»", q.nota);
  dice(q.spark && q.spark.soglia != null, "la miniatura disegna la linea di soglia", JSON.stringify(q.spark));
  dice(!!(q.spark && q.spark.oltre != null),
    "⛔ e disegna l'ULTIMA LETTURA come superamento (rombo), non come pallino tranquillo",
    `soglia a ${q.spark && q.spark.soglia} px · rombo ${q.spark && q.spark.oltre} · pallino ${q.spark && q.spark.fine}`);
  /* ⛔ E QUI SI CHIEDE DOVE STA, NON SE C'È — la domanda che mancava.
     Le tre righe qui sopra erano verdi il 09/08 mentre la miniatura non
     disegnava NIENTE: `d="M2.0 NaNC10.5 NaN,…"`, linea 0×0 px, `y1="NaN"`
     sulla soglia. Un attributo SVG non valido non solleva niente e non si
     legge in console: l'elemento resta nel DOM, il suo rettangolo si
     appiattisce in cima, e un controllo che guarda la PRESENZA lo assolve.
     Le letture di gS sono 10 · 25 · 30 · 40 con soglia 40: i rapporti sono
     noti, e un campione solo non distinguerebbe «funziona» da «sono tutti
     uguali». */
  if (q.spark) {
    misurati += 5;
    const senzaNaN = !!q.spark.d && !/NaN/.test(q.spark.d) && !/NaN/.test(String(q.spark.sogliaY1));
    dice(senzaNaN, "⛔ la miniatura ha una geometria NUMERICA (nessun NaN nel percorso né sulla soglia)",
      `d=${String(q.spark.d).slice(0, 90)} · soglia y1=${q.spark.sogliaY1}`);
    dice(q.spark.alto > 1 && q.spark.largo > 1,
      "⛔ e il tratto occupa davvero dello spazio, invece di schiacciarsi a zero",
      `linea ${q.spark.largo}×${q.spark.alto} px`);
    /* i punti dato di una curva di Bézier sono il `M` e l'ULTIMO vertice di
       ogni `C`: i due di mezzo sono i punti di controllo, e prenderli farebbe
       fallire il rapporto su un disegno sano */
    const ys = [];
    const mm = /M\s*([-\d.]+)[ ,]+([-\d.]+|NaN)/.exec(q.spark.d || "");
    if (mm) ys.push(Number(mm[2]));
    const re = /C[^C]*?[ ,]([-\d.]+|NaN)[ ,]+([-\d.]+|NaN)\s*(?=C|$)/g;
    let g3; while ((g3 = re.exec(q.spark.d || ""))) ys.push(Number(g3[2]));
    const VAL = [10, 25, 30, 40];
    const buoni = ys.length === VAL.length && ys.every((y) => Number.isFinite(y));
    dice(buoni, "quattro ordinate leggibili nel percorso della miniatura",
      `${ys.length} lette: ${ys.join(" · ")}`);
    if (buoni) {
      const base = Math.max(...ys);
      const dist = ys.map((y) => +(base - y).toFixed(3));
      const per = dist[3] / (VAL[3] - VAL[0]);
      console.log(`      campione: ${VAL.map((v, i) => `${v}→${dist[i]} px`).join(" · ")}`
        + ` (scala ${+per.toFixed(4)} px per µg/m³)`);
      dice(VAL.every((v, i) => vicino(dist[i], (v - VAL[0]) * per, 0.3)),
        "⛔ e i quattro valori stanno nel loro RAPPORTO anche in miniatura",
        VAL.map((v, i) => `${v}: ${dist[i]} contro ${+((v - VAL[0]) * per).toFixed(3)}`).join(" · "));
      /* il pareggio: l'ultima lettura VALE la soglia, quindi il rombo deve
         cadere ESATTAMENTE sulla linea — è la stessa domanda del caso G, che
         il motore supera quando disegna una `linea` invece di una `spark` */
      dice(q.spark.oltre != null && q.spark.soglia != null && vicino(q.spark.oltre, q.spark.soglia, 0.3),
        "⛔ e il rombo del pareggio cade ESATTAMENTE sulla linea di soglia",
        `rombo ${q.spark.oltre} px · soglia ${q.spark.soglia} px`);
    }
  }
}

/* ══ Le serie storiche: il codice di disegno è di Sentinella ══════════════ */
await pg.click("#nav-mon"); await pg.waitForTimeout(700);
const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
dice(viste.join(",") === "page-mon", "navigato davvero nei Monitoraggi", viste.join(",") || "nessuna pagina visibile");

/* Apre la serie storica di un punto e ne misura la geometria in PIXEL.
   `getBoundingClientRect` vive nel viewport: l'elemento va portato in vista. */
async function plotDi(id) {
  await pg.click(`[data-graf-mon="${id}"]`); await pg.waitForTimeout(520);
  await pg.$eval(`#graf-${id}`, (e) => e.scrollIntoView({ block: "center" })).catch(() => {});
  await pg.waitForTimeout(220);
  const m = await pg.evaluate((k) => {
    const box = document.getElementById("graf-" + k);
    if (!box) return { errore: "nessun riquadro" };
    const svg = box.querySelector("svg.plot");
    const cy = (n) => { const r = n.getBoundingClientRect(); return +(r.y + r.height / 2).toFixed(3); };
    if (!svg) return { senzaGrafico: true, testo: box.textContent.replace(/\s+/g, " ").trim().slice(0, 180) };
    const assi = [...svg.querySelectorAll("line.graf-ax")];
    const zero = assi.map(cy).sort((a, c) => c - a)[0];   // l'asse più in basso è lo zero
    const sog = svg.querySelector("line.graf-soglia");
    return {
      zero,
      soglia: sog ? cy(sog) : null,
      zona: !!svg.querySelector("rect.graf-zona"),
      punti: [...svg.querySelectorAll("circle.graf-pt, circle.graf-pt-ultimo, path.graf-over")].map((n) => ({
        oltre: (n.getAttribute("class") || "").includes("graf-over"),
        tit: (n.querySelector("title") || {}).textContent || "", cy: cy(n) })),
      stats: [...box.querySelectorAll(".graf-stat .k")].map((s) => s.textContent.trim()),
      nota: (box.querySelector(".graf-nota") || {}).textContent.replace(/\s+/g, " ").trim(),
    };
  }, id);
  await pg.click(`[data-graf-mon="${id}"]`).catch(() => {}); await pg.waitForTimeout(240);
  return m;
}
/* il valore dichiarato sta nel tooltip del punto, in italiano: 10,1 → 10.1 */
const valDi = (p) => Number((p.tit.split("·")[1] || "").trim().replace(/[^\d,.-]/g, "").replace(",", "."));

// ── A · IL RAPPORTO FRA DUE VALORI DIVERSI ────────────────────────────────
console.log("\n· A — serie storica: i pixel stanno nello stesso rapporto dei valori");
{
  const g = await plotDi("gA");
  dice(g.punti && g.punti.length === 3, "tre punti disegnati", (g.punti || []).length + " · " + (g.errore || g.testo || ""));
  if (g.punti && g.punti.length === 3) {
    /* la scala si legge dal punto più alto (dove l'arrotondamento pesa meno) e
       si pretende che TUTTI gli altri ci cadano sopra, soglia compresa */
    const d = g.punti.map((p) => ({ v: valDi(p), px: +(g.zero - p.cy).toFixed(3) }));
    const rif = d.reduce((a, x) => (x.v > a.v ? x : a));
    const pxPer = rif.px / rif.v;
    misurati += d.length;
    console.log(`      campione: ${d.map((x) => `${x.v} → ${x.px} px`).join(" · ")}`
      + ` (zero a ${g.zero} px · scala ${+pxPer.toFixed(4)} px per µg/m³)`);
    for (const x of d) {
      if (x === rif) continue;
      dice(vicino(x.px, x.v * pxPer), `${x.v} è disegnato a ${x.px} px, e ${x.v * pxPer >= 0 ? "" : ""}ne servivano ${+(x.v * pxPer).toFixed(3)}`,
        `scarto ${+(x.px - x.v * pxPer).toFixed(3)} px`);
    }
    // ── B · LA SOGLIA È SULLA STESSA SCALA DEI DATI ──────────────────────
    const sg = +(g.zero - g.soglia).toFixed(3);
    misurati++;
    dice(g.soglia != null, "la linea di soglia c'è", g.soglia);
    dice(vicino(sg, 250 * pxPer),
      `B — la soglia 250 è disegnata a ${sg} px, e sulla scala dei dati ne servono ${+(250 * pxPer).toFixed(3)}`,
      `scarto ${+(sg - 250 * pxPer).toFixed(3)} px — se le due scale divergessero, il disegno direbbe «conforme» su un superamento`);
    dice(g.zona, "e la zona rossa oltre soglia è disegnata");
  }
}

// ── C · SOPRA E SOTTO LA SOGLIA: CHI STA PIÙ IN ALTO ─────────────────────
console.log("\n· C — 9,9 e 10,1 contro soglia 10: quale dei due sta più in alto");
{
  const g = await plotDi("gB");
  const sotto = (g.punti || []).find((p) => valDi(p) === 9.9);
  const sopra = (g.punti || []).find((p) => valDi(p) === 10.1);
  misurati += 2;
  dice(!!(sotto && sopra), "le due letture sono disegnate", JSON.stringify((g.punti || []).map((p) => p.tit)));
  if (sotto && sopra) {
    console.log(`      campione: soglia a ${g.soglia} px · 9,9 a ${sotto.cy} px · 10,1 a ${sopra.cy} px (in alto = y minore)`);
    dice(sopra.cy < g.soglia, "⛔ 10,1 è disegnata SOPRA la linea di soglia", `${sopra.cy} contro ${g.soglia}`);
    dice(sotto.cy > g.soglia, "⛔ 9,9 è disegnata SOTTO la linea di soglia", `${sotto.cy} contro ${g.soglia}`);
    dice(sopra.oltre && !sotto.oltre, "e solo quella sopra porta il rombo del superamento",
      `10,1 rombo=${sopra.oltre} · 9,9 rombo=${sotto.oltre}`);
  }
}

// ── D · LA SOGLIA FUORI SCALA È DICHIARATA, NON DISEGNATA ────────────────
console.log("\n· D — soglia 900 su letture da 1 a 2: fuori scala");
{
  const g = await plotDi("gC");
  misurati++;
  dice(g.soglia === null, "nessuna linea di soglia disegnata (schiaccerebbe i dati sul fondo)", g.soglia);
  dice(/fuori dalla scala/.test(g.nota), "e il grafico DICE che la soglia è fuori scala", g.nota);
  const d = (g.punti || []).map((p) => ({ v: valDi(p), px: +(g.zero - p.cy).toFixed(3) }));
  if (d.length === 3) {
    const rif = d.reduce((a, x) => (x.v > a.v ? x : a)), pxPer = rif.px / rif.v;
    misurati += d.length;
    console.log(`      campione: ${d.map((x) => `${x.v} → ${x.px} px`).join(" · ")}`);
    dice(d.every((x) => vicino(x.px, x.v * pxPer)),
      "e i dati restano leggibili: la scala si adatta alle letture e resta proporzionale",
      d.map((x) => `${x.v}→${x.px} (attesi ${+(x.v * pxPer).toFixed(2)})`).join(" · "));
  }
}

// ── E · SENZA SOGLIA: nessuna linea, nessun conteggio ────────────────────
console.log("\n· E — punto senza nessuna soglia impostata");
{
  const g = await plotDi("gD");
  misurati++;
  dice(g.soglia === null, "nessuna linea di soglia", g.soglia);
  dice(!g.zona, "nessuna zona rossa");
  dice(!g.stats.includes("Oltre"), "e nessun conteggio «Oltre», che sarebbe uno zero calcolato dal nulla", g.stats.join(" · "));
}

// ── F · MAI MISURATO: nessun disegno del tutto ───────────────────────────
console.log("\n· F — punto mai misurato: nessuna barra a zero, nessuna linea piatta");
{
  const g = await plotDi("gE");
  dice(g.senzaGrafico === true, "nessun grafico disegnato", JSON.stringify(g).slice(0, 160));
  dice(/Nessuna lettura/.test(g.testo || ""), "al suo posto lo stato vuoto che lo dice a parole", g.testo);
}

// ── G · I GRAFICI DEL MOTORE CONDIVISO, COME SENTINELLA LI CONFIGURA ─────
console.log("\n· G — andamento per ricettore (dwGrafici.linea, soglia inclusiva)");
{
  await pg.click("#nav-prog"); await pg.waitForTimeout(700);
  /* si sceglie per VALORE e si pretende la prova che la tendina sia cambiata:
     una `selectOption` che non trova la voce lascia la prima selezionata, e il
     banco misurerebbe la scheda di un altro ricettore senza dire niente. */
  await pg.selectOption("#and-ric", "rc4").catch(() => {});
  await pg.waitForTimeout(1200);
  const scelto = await pg.$eval("#and-ric", (e) => e.options[e.selectedIndex].value);
  dice(scelto === "rc4", "scelto rc4, il ricettore senza soglia propria", scelto);
  const carte = await pg.evaluate(() => {
    const cy = (n) => { const r = n.getBoundingClientRect(); return +(r.y + r.height / 2).toFixed(3); };
    return [...document.querySelectorAll(".and-card")].map((c) => {
      const svg = c.querySelector("svg.dwg-svg");
      if (!svg) return { tit: (c.querySelector(".and-tit") || {}).textContent || "", senzaGrafico: true };
      const assi = [...svg.querySelectorAll("line.dwg-ax")].map(cy).sort((a, x) => x - a);
      const sog = svg.querySelector("line.dwg-soglia");
      return {
        tit: (c.querySelector(".and-tit") || {}).textContent || "",
        zero: assi[0], soglia: sog ? cy(sog) : null,
        oltre: [...svg.querySelectorAll("path.dwg-oltre")].map(cy),
        punti: [...svg.querySelectorAll("circle.dwg-pt, circle.dwg-fine")].map(cy),
      };
    });
  });
  const t = carte.find((c) => /BANCO T/.test(c.tit));
  dice(!!t, "la scheda del punto costruito c'è", carte.map((c) => c.tit).join(" · "));
  if (t && !t.senzaGrafico) {
    /* 20 · 100 · 200 · 400 contro soglia 500: nessun superamento, e la soglia
       sta sopra tutto. È il verso che conta di più — se le due scale
       divergessero, una lettura finirebbe SOPRA una linea che non ha superato. */
    const VAL = [20, 100, 200, 400];
    const px = [...t.punti, ...t.oltre].map((y) => +(t.zero - y).toFixed(3)).sort((a, x) => a - x);
    misurati += px.length + 1;
    console.log(`      campione: zero ${t.zero} px · soglia ${t.soglia} px · distanze ${px.join(" · ")}`);
    dice(px.length === VAL.length, "quattro letture disegnate", px.length);
    if (px.length === VAL.length) {
      const pxPer = px[3] / 400;
      for (let i = 0; i < 3; i++)
        dice(vicino(px[i], VAL[i] * pxPer),
          `${VAL[i]} è disegnato a ${px[i]} px, e sulla scala dei dati ne servono ${+(VAL[i] * pxPer).toFixed(3)}`,
          `scarto ${+(px[i] - VAL[i] * pxPer).toFixed(3)} px`);
      const sg = +(t.zero - t.soglia).toFixed(3);
      dice(vicino(sg, 500 * pxPer),
        `e la soglia 500 è a ${sg} px, dove la scala dei dati ne vuole ${+(500 * pxPer).toFixed(3)}`,
        `scarto ${+(sg - 500 * pxPer).toFixed(3)} px`);
      dice(t.oltre.length === 0, "nessun rombo: nessuna lettura arriva a 500", t.oltre.length);
      dice(t.soglia < t.zero - px[3],
        "⛔ e la linea di soglia sta SOPRA la lettura più alta, come dicono i numeri",
        `soglia a ${t.soglia} px, lettura 400 a ${+(t.zero - px[3]).toFixed(3)} px (in alto = y minore)`);
    }
  }
  /* lo stesso punto costruito per il pareggio: qui `inclusiva: true` c'è, e la
     lettura pari alla soglia DEVE portare il rombo — è la controparte del caso
     H, e prova che il motore sa fare la cosa giusta quando gliela si chiede. */
  const s = carte.find((c) => /BANCO S/.test(c.tit));
  if (s && !s.senzaGrafico) {
    misurati++;
    dice(s.oltre.length === 1, "e la lettura pari alla soglia porta il rombo, qui dove `inclusiva` viene passata", s.oltre.length);
    dice(s.oltre.length === 1 && vicino(s.oltre[0], s.soglia),
      "disegnata esattamente sulla linea di soglia", s.oltre[0] + " contro " + s.soglia);
  }
}

/* ══ I · LA SECONDA GEOMETRIA: sopra i 768 px la serie storica non è la stessa
   ═══ Non è lo stesso disegno ingrandito: `grafGeom()` chiede a `serieStorica`
   un altro riquadro (720×300 invece di 360×215) e altre etichette. È una
   geometria a sé, e un difetto che vivesse solo lì non lo vedrebbe nessuno
   scatto a 430 px — la stessa forma della «regola che guardava sei app su
   sette». Si rimisurano A, B e C alla larghezza dell'ufficio. */
console.log("\n· I — la stessa prova alla larghezza di un desktop (900 px)");
{
  const pgd = await b.newPage({ viewport: { width: 900, height: 950 } });
  await pgd.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pgd.waitForTimeout(2400);
  await pgd.click("#nav-mon"); await pgd.waitForTimeout(700);
  for (const [id, sogliaVal] of [["gA", 250], ["gB", 10]]) {
    await pgd.click(`[data-graf-mon="${id}"]`); await pgd.waitForTimeout(520);
    await pgd.$eval(`#graf-${id}`, (e) => e.scrollIntoView({ block: "center" })).catch(() => {});
    await pgd.waitForTimeout(220);
    const m = await pgd.evaluate((k) => {
      const svg = document.querySelector("#graf-" + k + " svg.plot");
      if (!svg) return null;
      const cy = (n) => { const r = n.getBoundingClientRect(); return +(r.y + r.height / 2).toFixed(3); };
      const zero = [...svg.querySelectorAll("line.graf-ax")].map(cy).sort((a, x) => x - a)[0];
      const sog = svg.querySelector("line.graf-soglia");
      return { vb: svg.getAttribute("viewBox"), zero, soglia: sog ? cy(sog) : null,
        punti: [...svg.querySelectorAll("circle.graf-pt, circle.graf-pt-ultimo, path.graf-over")].map((n) => ({
          v: Number((((n.querySelector("title") || {}).textContent || "").split("·")[1] || "").trim().replace(/[^\d,.-]/g, "").replace(",", ".")),
          d: +(zero - cy(n)).toFixed(3), oltre: (n.getAttribute("class") || "").includes("graf-over") })) };
    }, id);
    dice(!!m && m.vb === "0 0 720 300", `${id}: su desktop la geometria è quella larga (720×300), non la stessa ingrandita`, m && m.vb);
    if (!m) continue;
    const rif = m.punti.reduce((a, x) => (x.v > a.v ? x : a)), pxPer = rif.d / rif.v;
    misurati += m.punti.length + 1;
    console.log(`      campione ${id}: ${m.punti.map((p) => `${p.v}→${p.d}px`).join(" · ")} · soglia ${+(m.zero - m.soglia).toFixed(3)}px`);
    dice(m.punti.every((p) => vicino(p.d, p.v * pxPer)), `${id}: ogni lettura è proporzionale anche qui`,
      m.punti.map((p) => `${p.v} scarto ${+(p.d - p.v * pxPer).toFixed(3)}`).join(" · "));
    dice(vicino(m.zero - m.soglia, sogliaVal * pxPer), `${id}: e la soglia ${sogliaVal} sta sulla stessa scala`,
      `scarto ${+((m.zero - m.soglia) - sogliaVal * pxPer).toFixed(3)} px`);
    if (id === "gB") {
      const so = m.punti.find((p) => p.v === 10.1), su = m.punti.find((p) => p.v === 9.9);
      dice(so && su && so.d > m.zero - m.soglia && su.d < m.zero - m.soglia,
        "gB: ⛔ anche su desktop 10,1 sta sopra la linea e 9,9 sotto",
        `soglia ${+(m.zero - m.soglia).toFixed(3)} · 10,1 ${so && so.d} · 9,9 ${su && su.d}`);
    }
    await pgd.click(`[data-graf-mon="${id}"]`).catch(() => {}); await pgd.waitForTimeout(220);
  }
  await pgd.close();
}

console.log(`\n──────── ${ok} ok · ${ko} KO · ${misurati} geometrie misurate in pixel ────────`);
if (CONTROPROVA) console.log(`(controprova: ${colpiti.size}/${DIFETTI_MODULO.length} difetti rimessi — questi KO sono quelli attesi)`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

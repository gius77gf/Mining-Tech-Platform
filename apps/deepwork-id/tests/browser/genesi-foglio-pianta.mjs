/* IL FOGLIO HA LA PIANTA E LA TABELLA DI TUTTI I FORI — Genesi, provato premendo il bottone
   ──────────────────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-foglio-pianta.mjs [--porta=8703]
     node genesi-foglio-pianta.mjs --controprova   (rimette i difetti uno per volta: ognuno
                                                    deve far cadere il SUO controllo)

   PERCHÉ ESISTE. Misurato il 27/11 aprendo il report: «img 0, canvas 0, svg 0». Il foglio
   che si porta in cava era solo testo — la maglia come due numeri, la sequenza come una
   parola — e i fori uno per uno non c'erano. Adesso il foglio porta il disegno della pianta
   (`piantaPerFoglio`) e la tabella di tutti i fori (`tabellaForiPerFoglio`), composti dal
   modulo. `run-kpi` prova le due funzioni; questo banco prova il FOGLIO CHE ESCE, cioè le
   cose che una funzione pura non può sapere:
     · che il disegno e la tabella dicono LA STESSA COSA (il foro col numero 7 sta dove la
       riga 7 dice che sta — e la scala scritta è quella del disegno: si confrontano due
       distanze diverse, non un campione solo);
     · che la tabella del foglio dice quello che dice la tabella a schermo;
     · che il foglio stampa il PROGETTO e non la vista: ingrandire la pianta o nascondere
       uno strato sullo schermo non deve cambiare una virgola del disegno;
     · che su un telefono le scritte del disegno restano leggibili e la pagina non scorre
       di lato (a corpo pieno la tabella chiede 474 px);
     · che quando i fori sono troppo fitti il disegno non scrive numeri illeggibili, e lo
       dice.

   ⛔ LA CONTROPROVA È UN DIFETTO PER VOLTA (`ATTIVE`), con il controllo che deve cadere
   scritto accanto (`BERSAGLI`, stesso ordine di `DIFETTI`): rimessi insieme si coprono.
   Le iniezioni sono PER FILE — metà stanno nel modulo, metà nella pagina — e il server le
   applica solo al file che nominano.

   ⚠️ Il documento non è un file: esce da `window.open` + `document.write`. Si prende la
   finestra che si apre. La pagina compone il disegno con la larghezza della finestra che
   lo CHIEDE: per questo ogni caso apre la pagina alla larghezza che vuole provare. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8703;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };
const MODULO = "apps/genesi/genesi-data.js", PAGINA = "apps/genesi/genesi.html";

const DIFETTI = [
  /* 1 · il numero scritto nel foro non è più quello della tabella */
  [MODULO, "font-weight=\"700\" text-anchor=\"middle\" fill=\"#1a1a1a\">' + p.n + '</text>');", "font-weight=\"700\" text-anchor=\"middle\" fill=\"#1a1a1a\">' + (p.n % H.length + 1) + '</text>');"],
  /* 2 · il segmento di scala è più lungo di quello che dichiara */
  [MODULO, "by = alta - 34 - inPiu, bx = f1(padX + m * scala);", "by = alta - 34 - inPiu, bx = f1(padX + m * scala * 1.25);"],
  /* 3 · i fori non seguono più il fronte modellato: la spalla del disegno non è quella della tabella */
  [MODULO, ".map(({ h, i }) => ({ x: +h.mx, y: +h.my + interpProf(prof, +h.mx),", ".map(({ h, i }) => ({ x: +h.mx, y: +h.my,"],
  /* 4 · il foro con valori suoi non si distingue più sul disegno */
  [MODULO, "stroke-width=\"' + (p.suo ? 2.6 : 1.2) + '\"/>');", "stroke-width=\"' + (1.2) + '\"/>');"],
  /* 5 · i valori propri non sono più in grassetto nella tabella */
  [MODULO, "return '<td>' + (r.propri[c] ? '<b>' + tx + '</b>' : tx) + '</td>'; };", "return '<td>' + tx + '</td>'; };"],
  /* 6 · il foglio torna a dipendere da come si guarda lo schermo: strato nascosto, niente fori */
  [PAGINA, "  const _rPianta=piantaPerFoglio(D2, {", "  const _rPianta=piantaPerFoglio(D2.strati.fori.visibile ? D2 : { ...D2, holes:[] }, {"],
  /* 7 · il disegno torna largo 680 punti comunque: su un telefono le scritte scendono a 5 px */
  [PAGINA, "{ larghezza:Math.max(320, Math.min(680, (window.innerWidth||720)-32)) }", "{ larghezza:680 }"],
  /* 8 · la tabella non ha più il suo riquadro: su uno schermo stretto scorre tutta la pagina */
  [PAGINA, "    +'.tfs{overflow-x:auto}@media(max-width:560px){", "    +'@media(max-width:560px){"],
  /* 9 · il ritardo sotto il foro non è più quello della riga */
  [MODULO, "text-anchor=\"middle\" fill=\"#555\">' + Math.round(p.t) + '</text>');", "text-anchor=\"middle\" fill=\"#555\">' + Math.round(p.t / 2) + '</text>');"],
  /* 10 · i numeri si scrivono comunque, anche dove non si leggono */
  [MODULO, "const r = raggioForoTela(passo), coiNumeri = r >= RAGGIO_MIN_NUMERO,", "const r = raggioForoTela(passo), coiNumeri = true,"],
  /* 11 · la tabella dei fori non entra più nel foglio */
  [PAGINA, "    +body\n    +_rTabFori\n", "    +body\n"],
];
let ATTIVE = DIFETTI;

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    const perQui = ATTIVE.filter(([f]) => p.endsWith(f));
    if (perQui.length) {
      let t = corpo.toString("utf8");
      for (const [, da, a] of perQui) { if (t.includes(da)) { colpiti.add(da); t = t.split(da).join(a); } }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-foglio-pianta-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-foglio-pianta-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0; const nonMisurati = [];
const caduti = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; caduti.push(t); console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 360))}` : ""}`); }
};

console.log(`\n════════ Genesi: il foglio ha la pianta e la tabella di tutti i fori${CONTROPROVA ? " · controprova" : ""} ════════`);

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 2, perRow: 8,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };
/* la maglia più fitta che i campi accettano: 30 fori per fila, 6 file */
const FITTA = { ...DESIGN, perRow: 30, file: 6 };

async function apri(larghezza, design) {
  const ctx = await b.newContext({ viewport: { width: larghezza, height: 950 }, hasTouch: larghezza < 600 });
  /* il foglio chiama `print()` da sé dopo 350 ms: in un banco non deve aprire niente */
  await ctx.addInitScript(() => { window.print = () => {}; });
  const pg = await ctx.newPage();
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord", data: "2026-07-12", sintesi: "fori", design: dd }]));
  }, design);
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
  });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => { const it = document.querySelector('.hg-item[data-id="v1"]'); const btn = it && it.querySelector('button[data-act="apri"]'); if (btn) btn.click(); });
  await pg.waitForTimeout(1400);
  pg.__errori = errori; pg.__ctx = ctx; pg.__larga = larghezza;
  return pg;
}
const pronta = (pg) => pg.evaluate(() => document.body.className.includes("scr-design") && !!window.__genesi && window.__genesi.D2.holes.length > 0);

/* PREME «REPORT» E LEGGE IL FOGLIO CHE SI APRE: il disegno (cerchi, scritte, fronte, scala)
   e la tabella, come li ha messi sulla pagina il browser. */
async function foglio(pg) {
  const [pop] = await Promise.all([pg.__ctx.waitForEvent("page", { timeout: 8000 }).catch(() => null),
    pg.evaluate(() => { const e = document.getElementById("btn-report"); e.scrollIntoView({ block: "center" }); e.click(); })]);
  if (!pop) return null;
  await pop.waitForLoadState("domcontentloaded").catch(() => {}); await pop.waitForTimeout(450);
  await pop.setViewportSize({ width: pg.__larga, height: 900 }).catch(() => {});
  await pop.waitForTimeout(150);
  const L = await pop.evaluate(() => {
    const svg = document.querySelector("svg.pianta");
    const out = { svg: document.querySelectorAll("svg").length, markup: document.body.innerHTML, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      titoli: [...document.querySelectorAll("h2")].map((h) => h.textContent) };
    if (svg) {
      const vb = svg.viewBox.baseVal;
      out.k = svg.getBoundingClientRect().width / vb.width; out.larga = vb.width; out.alta = vb.height; out.disegno = svg.outerHTML;
      out.fori = [...svg.querySelectorAll("circle.p-foro")].map((c) => ({ x: +c.getAttribute("cx"), y: +c.getAttribute("cy"), r: +c.getAttribute("r"), bordo: +c.getAttribute("stroke-width") }));
      out.testi = [...svg.querySelectorAll("text")].map((t) => { const q = t.getBBox(); return { t: t.textContent, cls: t.getAttribute("class") || "", ax: +t.getAttribute("x"), fs: +t.getAttribute("font-size"), x0: q.x, x1: q.x + q.width, y0: q.y, y1: q.y + q.height }; });
      const fr = svg.querySelector("polyline.p-fronte"); out.fronte = fr ? fr.getAttribute("points").trim().split(/\s+/).map((p) => p.split(",").map(Number)) : [];
      const sc = svg.querySelector("path.p-scala"); out.scalaD = sc ? sc.getAttribute("d") : "";
      out.piede = svg.querySelectorAll("polyline.p-piede").length; out.tratti = svg.querySelectorAll("polyline.p-tratto").length;
    }
    const tf = document.querySelector("table.tf"), box = document.querySelector(".tfs");
    if (tf) {
      out.testa = [...tf.querySelectorAll("thead th")].map((th) => th.textContent);
      out.righe = [...tf.querySelectorAll("tbody tr")].map((tr) => [...tr.cells].map((td) => ({ t: td.textContent, b: !!td.querySelector("b") })));
      out.tf = { w: tf.getBoundingClientRect().width, box: box ? box.getBoundingClientRect().width : null, scorre: box ? getComputedStyle(box).overflowX : null };
    }
    return out;
  });
  await pop.close();
  return L;
}

/* ───── gli strumenti di lettura ───── */
const num = (t) => { const m = String(t).replace(/\./g, "").replace(",", ".").match(/-?\d+(?:\.\d+)?/); return m ? +m[0] : null; };
const COL = { n: 0, x: 1, spalla: 2, tDet: 3, kg: 4, prof: 5, stem: 6, diam: 7, incl: 8 };
/* la scala che il disegno DICHIARA: quanti px è lungo il segmento, e quanti metri c'è scritto sopra */
function scalaDichiarata(L) {
  const m0 = L.scalaD.match(/^M([\d.]+) /), h = L.scalaD.match(/H([\d.]+)/), et = L.testi.find((q) => /^\d+ m$/.test(q.t));
  if (!m0 || !h || !et) return null;
  return (+h[1] - +m0[1]) / num(et.t);
}
const yFronte = (L, x) => { const f = L.fronte; if (!f.length) return null; if (x <= f[0][0]) return f[0][1]; if (x >= f[f.length - 1][0]) return f[f.length - 1][1];
  for (let i = 0; i < f.length - 1; i++) if (x >= f[i][0] && x <= f[i + 1][0]) return f[i][1] + (f[i + 1][1] - f[i][1]) * (x - f[i][0]) / ((f[i + 1][0] - f[i][0]) || 1); return null; };
/* il cerchio di ogni numero: la scritta `p-n` sta sull'asse del suo cerchio */
function foriPerNumero(L) {
  const out = new Map();
  for (const q of L.testi.filter((q) => q.cls === "p-n")) {
    const c = L.fori.filter((c) => Math.abs(c.x - q.ax) < 0.06).sort((a, b2) => Math.abs((q.y0 + q.y1) / 2 - a.y) - Math.abs((q.y0 + q.y1) / 2 - b2.y))[0];
    if (c) out.set(+q.t, c);
  }
  return out;
}
const sovrapposti = (A) => { const fuori = []; for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) { const a = A[i], c = A[j];
  if (a.x0 < c.x1 - 0.5 && c.x0 < a.x1 - 0.5 && a.y0 < c.y1 - 0.5 && c.y0 < a.y1 - 0.5) fuori.push(`«${a.t}» / «${c.t}»`); } return fuori; };

/* ───── i controlli che valgono per OGNI foglio ───── */
function comuni(nome, L, nFori) {
  dice(L.svg === 1 && !!L.righe && L.titoli.includes("Pianta della volata") && L.titoli.includes("Tabella dei fori"), `${nome}: il foglio ha UNA pianta e la tabella dei fori`, JSON.stringify({ svg: L.svg, tabella: !!L.righe, titoli: L.titoli }));
  if (L.svg !== 1 || !L.righe) { nonMisurati.push(`${nome}: senza pianta o senza tabella il resto non si può guardare`); return false; }
  const brutti = L.markup.match(/undefined|NaN|\bnull\b|\[object|Infinity/g);
  dice(!brutti, `${nome}: nel foglio, disegno compreso, nessun «undefined», «NaN», «null»`, brutti && brutti.slice(0, 4));
  dice(L.fori.length === nFori && L.righe.length === nFori, `${nome}: un cerchio per foro e una riga per foro (${nFori})`, `cerchi ${L.fori.length}, righe ${L.righe.length}, fori ${nFori}`);
  /* la scala: la distanza fra il foro più a sinistra e il più a destra, in px e in metri */
  const sD = scalaDichiarata(L), xs = L.righe.map((r) => num(r[COL.x].t)), cx = L.fori.map((c) => c.x);
  const largaM = Math.max(...xs) - Math.min(...xs), largaPx = Math.max(...cx) - Math.min(...cx);
  if (largaM > 0 && sD) dice(Math.abs(largaPx / largaM - sD) / sD < 0.012, `${nome}: la scala scritta è quella del disegno (${largaM.toFixed(1)} m fra i fori estremi)`, `disegno ${(largaPx / largaM).toFixed(3)} px/m, segmento ${sD.toFixed(3)} px/m`);
  else nonMisurati.push(`${nome}: la scala (un foro solo, o segmento non trovato)`);
  const fuori = L.testi.filter((q) => q.x0 < -0.5 || q.x1 > L.larga + 0.5 || q.y0 < -0.5 || q.y1 > L.alta + 0.5).map((q) => `«${q.t}»`);
  const sopra = sovrapposti(L.testi);
  dice(!fuori.length && !sopra.length, `${nome}: nessuna scritta esce dal disegno e nessuna sta sopra un'altra (${L.testi.length} scritte)`, JSON.stringify({ fuori: fuori.slice(0, 4), sopra: sopra.slice(0, 4) }));
  let tocca = 0; for (let i = 0; i < L.fori.length; i++) for (let j = i + 1; j < L.fori.length; j++) if (Math.hypot(L.fori[i].x - L.fori[j].x, L.fori[i].y - L.fori[j].y) < L.fori[i].r + L.fori[j].r - 0.3) tocca++;
  const esce = L.fori.filter((c) => c.x - c.r < 0 || c.x + c.r > L.larga || c.y - c.r < 0 || c.y + c.r > L.alta).length;
  dice(tocca === 0 && esce === 0, `${nome}: nessun foro sopra un altro, tutti dentro il disegno`, `si toccano ${tocca} coppie, fuori ${esce}`);
  const bassi = L.testi.filter((q) => q.fs * L.k < 6.5).map((q) => `«${q.t}» ${(q.fs * L.k).toFixed(1)}px`);
  dice(!bassi.length, `${nome}: ogni scritta del disegno è alta almeno 6,5 px sullo schermo che la mostra (la più bassa: ${Math.min(...L.testi.map((q) => q.fs * L.k)).toFixed(1)})`, bassi.slice(0, 5));
  dice(L.sw <= L.cw + 0.5 && (L.tf.w <= L.tf.box + 0.5 || L.tf.scorre === "auto"), `${nome}: la pagina non scorre di lato, e la tabella sta nel suo riquadro o ci scorre dentro`, JSON.stringify({ pagina: `${L.sw}/${L.cw}`, tabella: `${Math.round(L.tf.w)}/${Math.round(L.tf.box || 0)}`, riquadro: L.tf.scorre }));
  return true;
}
/* il foro col numero n sta dove la riga n dice: lungo la fila (dal primo foro) e a spalla dal fronte */
function doveDice(nome, L) {
  const perN = foriPerNumero(L), sD = scalaDichiarata(L);
  if (perN.size !== L.righe.length || !sD) { dice(false, `${nome}: ogni foro sta dove la sua riga dice — lungo la fila e a spalla dal fronte`, `numeri letti sul disegno ${perN.size} su ${L.righe.length} righe`); return; }
  const r1 = L.righe[0], c1 = perN.get(num(r1[COL.n].t)), fuori = [];
  for (const r of L.righe) { const n = num(r[COL.n].t), c = perN.get(n); if (!c) { fuori.push(`foro ${n}: non c'è sul disegno`); continue; }
    const dxAtteso = (num(r[COL.x].t) - num(r1[COL.x].t)) * sD, dyAtteso = num(r[COL.spalla].t) * sD, dy = c.y - yFronte(L, c.x);
    if (Math.abs((c.x - c1.x) - dxAtteso) > 1.2 || Math.abs(dy - dyAtteso) > 1.2) fuori.push(`foro ${n}: lungo la fila ${(c.x - c1.x).toFixed(1)} px (attesi ${dxAtteso.toFixed(1)}), dal fronte ${dy.toFixed(1)} px (attesi ${dyAtteso.toFixed(1)})`); }
  dice(!fuori.length, `${nome}: ogni foro sta dove la sua riga dice — lungo la fila e a spalla dal fronte (${L.righe.length} fori)`, fuori.slice(0, 3).join(" | "));
}
function ritardi(nome, L) {
  const sotto = L.testi.filter((q) => q.cls === "p-t"), leg = L.testi.filter((q) => q.cls === "p-leg").map((q) => q.t).join(" · ");
  if (!sotto.length) { dice(/ritardi: nella tabella dei fori/.test(leg), `${nome}: i ritardi non ci stanno sotto i fori, e la legenda dice dove trovarli`, leg); return; }
  const perN = foriPerNumero(L), fuori = [];
  for (const r of L.righe) { const n = num(r[COL.n].t), c = perN.get(n); if (!c) continue;
    const q = sotto.find((q) => Math.abs(q.ax - c.x) < 0.06 && q.y0 > c.y && q.y0 < c.y + c.r + 14);
    if (!q || +q.t !== Math.round(num(r[COL.tDet].t))) fuori.push(`foro ${n}: sotto «${q ? q.t : "niente"}», in tabella «${r[COL.tDet].t}»`); }
  dice(!fuori.length && /sotto il foro: ritardo in ms/.test(leg), `${nome}: il ritardo scritto sotto ogni foro è quello della sua riga (${sotto.length} ritardi)`, fuori.slice(0, 3).join(" | ") || leg);
}

/* ───── A · la volata di base, su uno schermo largo ───── */
async function base() {
  const pg = await apri(1280, DESIGN);
  if (!(await pronta(pg))) { nonMisurati.push("base: la pagina non è arrivata al progetto"); await pg.__ctx.close(); return; }
  const L = await foglio(pg), n = await pg.evaluate(() => window.__genesi.D2.holes.length);
  if (!L) { nonMisurati.push("base: il foglio non si è aperto"); await pg.__ctx.close(); return; }
  if (comuni("base", L, n)) { doveDice("base", L); ritardi("base", L); }
  dice(pg.__errori.length === 0, "base: nessun errore di pagina aprendo il foglio", pg.__errori[0]);
  await pg.__ctx.close();
}

/* ───── B · fori con valori loro, fronte modellato, piede, un tratto — e la vista che non conta ───── */
async function propri() {
  const pg = await apri(1280, DESIGN);
  if (!(await pronta(pg))) { nonMisurati.push("valori propri: la pagina non è arrivata al progetto"); await pg.__ctx.close(); return; }
  await pg.evaluate(() => { const D = window.__genesi.D2;
    D.profilo = [{ x: 3, y: 0 }, { x: 11, y: 1.6 }, { x: 21, y: -0.8 }];
    D.piede = [{ x: 0, y: -1.2 }, { x: 12, y: -1.9 }, { x: 24, y: -1.0 }];
    D.tratti.push({ pts: [{ x: 2, y: 9.5 }, { x: 12, y: 10.5 }, { x: 22, y: 9 }], aperto: false, origine: "dxf" });
    D.holes[2].kg = 0; D.holes[4].prof = 8.5; D.holes[4].stem = 1.5;
    window.__genesi.renderScheda2D(); });
  await pg.waitForTimeout(300);
  const L = await foglio(pg);
  if (!L) { nonMisurati.push("valori propri: il foglio non si è aperto"); await pg.__ctx.close(); return; }
  const stato = await pg.evaluate(() => { const D = window.__genesi.D2; return { n: D.holes.length, scarico: D.holes[2].seq + 1, corto: D.holes[4].seq + 1 }; });
  if (comuni("valori propri", L, stato.n)) {
    doveDice("valori propri", L); ritardi("valori propri", L);
    const grassi = []; L.righe.forEach((r) => r.forEach((c, k) => { if (k > 0 && c.b) grassi.push(num(r[0].t) + ":" + Object.keys(COL)[k]); }));
    const attesi = [stato.scarico + ":kg", stato.corto + ":prof", stato.corto + ":stem"].sort();
    dice(JSON.stringify(grassi.sort()) === JSON.stringify(attesi), "valori propri: in grassetto nella tabella i valori che un foro ha di suo, e solo quelli", `in grassetto ${grassi.join(", ") || "nessuno"} · attesi ${attesi.join(", ")}`);
    const rs = L.righe.find((r) => num(r[0].t) === stato.scarico);
    dice(!!rs && /^0 \(scarico\)$/.test(rs[COL.kg].t), "valori propri: il foro lasciato scarico è scritto «0 (scarico)»", rs && rs[COL.kg].t);
    const perN = foriPerNumero(L), spessi = [...perN].filter(([, c]) => c.bordo > 2).map(([k]) => k).sort((a, c) => a - c), leg = L.testi.filter((q) => q.cls === "p-leg").map((q) => q.t).join(" · ");
    dice(JSON.stringify(spessi) === JSON.stringify([stato.scarico, stato.corto].sort((a, c) => a - c)) && /bordo spesso: foro con valori suoi/.test(leg),
      "valori propri: sul disegno hanno il bordo spesso i fori con valori suoi, solo quelli, e la legenda lo dice", `bordo spesso: ${spessi.join(", ") || "nessuno"} · attesi ${stato.scarico}, ${stato.corto} · ${leg}`);
    dice(L.piede === 1 && L.tratti === 1 && /piede/.test(leg) && /tratto/.test(leg) && L.fronte.length > 2, "valori propri: il fronte modellato, il piede e il tratto sono sul disegno, e la legenda li nomina", JSON.stringify({ piede: L.piede, tratti: L.tratti, fronte: L.fronte.length, leg }));
    /* la tabella del foglio contro quella dello schermo: stessi fori, stessi valori */
    await pg.evaluate(() => { const a = document.getElementById("ft-apri"); if (a) a.click(); }); await pg.waitForTimeout(450);
    const schermo = await pg.evaluate(() => [...document.querySelectorAll("#ft-corpo .ft-r")].map((r) => { const i = r.dataset.i, v = (c) => { const e = document.getElementById("ft-" + c + "-" + i); return e ? e.value : null; };
      return { n: parseInt(r.querySelector(".ft-num").textContent, 10), kg: v("kg"), prof: v("prof"), stem: v("stem"), diam: v("diam"), incl: v("incl") }; }));
    const diversi = [];
    for (const s of schermo) { const r = L.righe.find((r) => num(r[0].t) === s.n); if (!r) { diversi.push(`foro ${s.n}: manca sul foglio`); continue; }
      for (const c of ["kg", "prof", "stem", "diam", "incl"]) if (s[c] === null || num(s[c]) !== num(r[COL[c]].t)) diversi.push(`foro ${s.n} ${c}: schermo «${s[c]}», foglio «${r[COL[c]].t}»`); }
    dice(schermo.length === stato.n && !diversi.length, `valori propri: la tabella del foglio dice quello che dice la tabella a schermo (${schermo.length} fori × 5 valori)`, diversi.slice(0, 3).join(" | ") || `righe a schermo ${schermo.length}`);
    /* la vista non conta: pianta ingrandita, due strati nascosti → lo stesso identico disegno */
    await pg.evaluate(() => { const c = document.getElementById("d2-canvas"); if (c) c.scrollIntoView({ block: "center" }); });
    for (let k = 0; k < 2; k++) { await pg.evaluate(() => document.getElementById("dvPiu").click()); await pg.waitForTimeout(120); }
    const quanto = await pg.evaluate(() => { const D = window.__genesi.D2; D.strati.fori.visibile = false; D.strati.piede.visibile = false; window.__genesi.renderScheda2D(); return document.getElementById("dvQuanto").textContent; });
    const L2 = await foglio(pg);
    if (!L2 || !/^\d+%$/.test(quanto.trim()) || parseInt(quanto, 10) <= 100) nonMisurati.push(`valori propri: la vista non conta (la pianta a schermo non risulta ingrandita: «${quanto}»)`);
    else dice(L2.disegno === L.disegno && L2.righe.length === L.righe.length, `valori propri: il foglio stampa il progetto, non la vista — pianta a schermo al ${quanto.trim()} e due strati nascosti, il disegno è identico`, L2.disegno ? `cerchi ${L2.fori.length} contro ${L.fori.length}` : `nessun disegno (svg ${L2.svg})`);
  }
  dice(pg.__errori.length === 0, "valori propri: nessun errore di pagina", pg.__errori[0]);
  await pg.__ctx.close();
}

/* ───── C · il telefono: 390 e 320 ───── */
async function telefono(larghezze) {
  for (const w of larghezze) {
    const pg = await apri(w, DESIGN);
    if (!(await pronta(pg))) { nonMisurati.push(`${w}px: la pagina non è arrivata al progetto`); await pg.__ctx.close(); continue; }
    const L = await foglio(pg), n = await pg.evaluate(() => window.__genesi.D2.holes.length);
    if (!L) { nonMisurati.push(`${w}px: il foglio non si è aperto`); await pg.__ctx.close(); continue; }
    if (comuni(`${w}px`, L, n)) { doveDice(`${w}px`, L); ritardi(`${w}px`, L);
      if (w >= 390) dice(L.tf.w <= L.tf.box + 0.5, `${w}px: la tabella dei fori ci sta tutta, senza scorrere`, `${Math.round(L.tf.w)} px in ${Math.round(L.tf.box)}`); }
    await pg.__ctx.close();
  }
}

/* ───── D · la maglia più fitta che i campi accettano (30 × 6 = 180 fori) ───── */
async function fitta() {
  for (const w of [1280, 390]) {
    const pg = await apri(w, FITTA);
    if (!(await pronta(pg))) { nonMisurati.push(`fitta ${w}px: la pagina non è arrivata al progetto`); await pg.__ctx.close(); continue; }
    const L = await foglio(pg), n = await pg.evaluate(() => window.__genesi.D2.holes.length);
    if (!L) { nonMisurati.push(`fitta ${w}px: il foglio non si è aperto`); await pg.__ctx.close(); continue; }
    if (comuni(`fitta ${w}px`, L, n)) {
      const numeri = L.testi.filter((q) => q.cls === "p-n"), leg = L.testi.filter((q) => q.cls === "p-leg").map((q) => q.t).join(" · ");
      if (w === 1280) { doveDice("fitta 1280px", L); ritardi("fitta 1280px", L); }
      else dice(numeri.length === 0 && /numeri dei fori: in tabella, con la posizione/.test(leg) && /ritardi: nella tabella dei fori/.test(leg),
        `fitta ${w}px: con ${n} fori in ${Math.round(L.larga)} px il disegno non scrive numeri illeggibili, e la legenda dice dove ritrovarli`, `numeri scritti ${numeri.length} · ${leg}`);
    }
    await pg.__ctx.close();
  }
}

const ATTESE = (8 + 2 + 1) + (8 + 2 + 6 + 1) + (2 * (8 + 2) + 1) + (8 + 2) + (8 + 1);
let riuscita;
if (!CONTROPROVA) {
  await base(); await propri(); await telefono([390, 320]); await fitta();
} else {
  /* nello stesso ordine di DIFETTI: che cosa rimette, dove guardare, quale controllo deve cadere */
  const BERSAGLI = [
    ["il numero nel foro non è più quello della tabella", base, /ogni foro sta dove la sua riga dice/],
    ["il segmento di scala è più lungo di quello che dichiara", base, /la scala scritta è quella del disegno/],
    ["i fori non seguono più il fronte modellato", propri, /ogni foro sta dove la sua riga dice/],
    ["il foro con valori suoi non si distingue più sul disegno", propri, /hanno il bordo spesso/],
    ["i valori propri non sono più in grassetto", propri, /in grassetto nella tabella/],
    ["il foglio torna a dipendere da come si guarda lo schermo", propri, /il foglio stampa il progetto, non la vista/],
    ["il disegno torna largo 680 punti comunque", () => telefono([390]), /alta almeno 6,5 px/],
    ["la tabella non ha più il suo riquadro", () => telefono([320]), /la pagina non scorre di lato/],
    ["il ritardo sotto il foro non è più quello della riga", base, /il ritardo scritto sotto ogni foro/],
    ["i numeri si scrivono comunque, anche dove non si leggono", fitta, /non scrive numeri illeggibili/],
    ["la tabella dei fori non entra più nel foglio", base, /UNA pianta e la tabella dei fori/],
  ];
  const esiti = [];
  for (let k = 0; k < DIFETTI.length; k++) {
    ATTIVE = [DIFETTI[k]];
    const [nome, guarda, attesa] = BERSAGLI[k], da = caduti.length;
    console.log(`\n──────── difetto ${k + 1}/${DIFETTI.length}, da solo: ${nome} ────────`);
    await guarda();
    const miei = caduti.slice(da);
    esiti.push({ nome, caduti: miei.length, bersaglio: miei.some((t) => attesa.test(t)) });
  }
  console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
  for (const e of esiti) console.log(`  ${e.bersaglio ? "✔" : "✗"} ${e.nome}: ${e.caduti} controlli caduti${e.bersaglio ? ", fra cui il suo" : " — ma NON quello che lo riguarda"}`);
  riuscita = colpiti.size === DIFETTI.length && esiti.every((e) => e.bersaglio);
}
if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}) — non è «a posto», è «non ho guardato»:`);
  for (const x of nonMisurati) console.log(`   · ${x}`);
}
console.log(`\nRisultato foglio con la pianta di Genesi: ${ok} passati, ${ko} falliti  ·  ${ATTESE} asserzioni attese nel passaggio sano (11 sulla volata di base, 17 coi valori propri, 21 sul telefono, 19 sulla maglia fitta)`);
await b.close();
srv.close();
/* una controprova RIUSCITA esce 0: ogni difetto, da solo, ha fatto cadere il controllo che lo
   riguarda. Sotto controprova un «non misurato» è ammesso: può essere il difetto a renderlo tale. */
if (!CONTROPROVA) riuscita = ko === 0 && nonMisurati.length === 0 && ok === ATTESE;
if (CONTROPROVA) console.log(riuscita ? "✔ CONTROPROVA OK: ogni difetto rimesso fa cadere il suo controllo" : "✗ CONTROPROVA FALLITA: un difetto non fa cadere il suo controllo, o un'iniezione non ha trovato il suo pezzo");
process.exitCode = riuscita ? 0 : 1;

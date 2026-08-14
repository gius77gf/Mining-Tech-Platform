/* LA DASHBOARD DEL CORE NON LASCIA TRE RIQUADRI VUOTI SENZA DIRE PERCHÉ
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-dashboard-senza-rete.mjs [--porta=8498]
     node core-dashboard-senza-rete.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. È il principio del fondatore applicato a un DISEGNO invece
   che a un numero: **un riquadro vuoto non dice «non c'è niente», non dice
   niente.** Misurato il 07/08 aprendo la Dashboard senza rete: i quattro KPI
   erano scritti giusti («5 rapportini · 3466 mc · 3 operatori · 2 rapp.
   fochino») e sotto stavano **tre rettangoli vuoti** — «TOTALE PERIODO · PER
   CAVA» col nulla sotto, 3 canvas e **0 pixel dipinti**. Da lì l'utente non
   può sapere se non ci sono dati, se sta caricando o se il prodotto è rotto.

   ⛔ E NON È UN CASO DI LABORATORIO: Chart.js arriva da un CDN, quindi
   **senza rete quello è lo stato normale della schermata** — e l'app è fatta
   per la cava, cioè per il posto dove il segnale non c'è. `new Chart(...)`
   sollevava «Chart is not defined» dentro `nav()`, quindi saltava anche il
   ripristino dello scorrimento in fondo a `nav`.

   ⛔ PERCHÉ QUESTO BANCO ESISTE, ED È LA PARTE CHE CONTA. La Dashboard era la
   schermata che **nessuna prova aveva mai aperto**: `nav('dashboard')`
   sollevava, quindi ogni banco che «guardava il core» la saltava in silenzio.
   È la famiglia dello «0 modali su 68» di CLAUDE.md, un piano più sotto — e
   come quella, non lasciava niente di rosso da leggere.

   ⚠️ LE DUE CAUSE HANNO PORTATA DIVERSA, e il banco le prova separate:
   «la libreria non è arrivata» riguarda la PAGINA (un avviso solo per tutti e
   tre); «non ci sono dati» riguarda UN grafico (con un filtro stretto una
   torta può essere vuota e le altre piene). La torta dei fochini, per giunta,
   il controllo sui dati non ce l'aveva affatto: restava vuota **anche con la
   rete**.

   ⚠️ IL CASO SANO SI COSTRUISCE CON UN FINTO Chart servito al posto del CDN.
   Senza di lui il modo più facile di far passare queste prove sarebbe togliere
   i grafici del tutto, che è l'errore opposto: qui si pretende che, quando la
   libreria c'è, i canvas tornino e vengano DIPINTI. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8498;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE: le versioni VERE, non caricature.
   1. la Dashboard che disegna i canvas comunque, anche senza la libreria;
   2. la torta dei fochini senza il controllo sui dati che le sorelle avevano. */
const DIFETTI = [
  ["typeof Chart==='undefined' ? avvisoGraficiAssenti() : ", "false ? avvisoGraficiAssenti() : "],
  ["cartaGrafico('Per fochino (volate)','ch-foc-pie',190,focDati.length)",
   "cartaGrafico('Per fochino (volate)','ch-foc-pie',190,1)"],
];

let colpiti = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p === join(R, "index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti++; t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e risponde «non so fallire». */
const SEGNO = join(R, "__core-dash-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-dash-${process.pid}`)).text();
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
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* il finto Chart: dipinge un rettangolo, così «ha disegnato» si può MISURARE
   in pixel invece che dedurlo dall'assenza di errori */
const FINTO_CHART = "window.Chart=class{constructor(ctx){this.ctx=ctx;"
  + "ctx.fillStyle='#ffab00';ctx.fillRect(0,0,40,40);}destroy(){}};";

const apri = async (conLibreria) => {
  const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await montaFintoFirebase(pg);
  await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
    r.fulfill({ status: 200, contentType: "text/javascript",
      body: MODULI["firebase-firestore.js"].replace(
        "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
        "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));
  /* con rete o senza: si serve (o si lascia cadere) proprio l'indirizzo del CDN */
  await pg.route("https://cdn.jsdelivr.net/npm/chart.js**", (r) =>
    conLibreria ? r.fulfill({ status: 200, contentType: "text/javascript", body: FINTO_CHART }) : r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
  await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
  let dentro = false;
  for (let g = 0; g < 6 && !dentro; g++) {
    await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
    await pg.waitForTimeout(800);
    dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
  }
  await pg.evaluate(() => { window.__err = null; try { window.nav("dashboard"); } catch (e) { window.__err = e.message; } });
  await pg.waitForTimeout(700);
  return { pg, dentro, errori };
};

const guarda = (pg) => pg.evaluate(() => {
  const s = document.getElementById("screen-dashboard");
  const canvas = Array.from(document.querySelectorAll("#screen-dashboard canvas")).map((c) => {
    let dipinti = 0;
    try {
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      for (let i = 3; i < d.length; i += 4) if (d[i] !== 0) dipinti++;
    } catch (e) { dipinti = -1; }
    return { id: c.id, dipinti };
  });
  return {
    erroreNav: window.__err,
    visibile: !!s && getComputedStyle(s).display !== "none",
    testo: s ? (s.innerText || "").trim() : "",
    canvas,
    kpi: Array.from(document.querySelectorAll("#screen-dashboard .kpi-val")).map((e) => e.textContent.trim()),
  };
});

/* ══════ SENZA RETE: com'è la Dashboard in cava ══════ */
console.log("── senza la libreria (il caso della cava) ──");
{
  const { pg, dentro, errori } = await apri(false);
  if (CONTROPROVA) dice(colpiti === DIFETTI.length, `la controprova ha rimesso i difetti (${colpiti}/${DIFETTI.length})`);
  dice(dentro, "si entra davvero nell'app");
  const v = await guarda(pg);
  dice(v.visibile, "la Dashboard si apre");
  dice(v.erroreNav === null, "aprirla NON solleva un errore", v.erroreNav);
  dice(v.canvas.length === 0, `nessun canvas vuoto lasciato in giro (${v.canvas.length})`,
    JSON.stringify(v.canvas));
  dice(/libreria che li disegna non è arrivata/.test(v.testo),
    "e la schermata DICE perché i grafici non ci sono", v.testo.slice(0, 200));
  dice(/giusti lo stesso/.test(v.testo),
    "⛔ e dichiara che i numeri restano giusti: se no si perde fiducia anche nei totali",
    v.testo.slice(0, 200));
  /* ⚠️ IL CASO SANO NUMERICO: i KPI devono esserci lo stesso. Una «correzione»
     che spegnesse la pagina intera passerebbe le prove qui sopra. */
  dice(v.kpi.length >= 4 && v.kpi.some((k) => /\d/.test(k)),
    `i KPI sono ancora scritti e portano numeri (${v.kpi.join(" · ")})`, JSON.stringify(v.kpi));
  dice(errori.length === 0, `nessun errore di pagina (${errori.length})`, errori.slice(0, 2).join(" | "));
  console.log(`  · testo della Dashboard: ${v.testo.length} caratteri`);
  await pg.close();
}

/* ══════ CON LA LIBRERIA: i grafici devono TORNARE ══════ */
console.log("── con la libreria (la controprova del caso sano) ──");
{
  const { pg } = await apri(true);
  const v = await guarda(pg);
  dice(v.erroreNav === null, "aprirla non solleva un errore nemmeno con la libreria", v.erroreNav);
  dice(v.canvas.length > 0, `i canvas dei grafici tornano (${v.canvas.length})`, JSON.stringify(v.canvas));
  dice(v.canvas.length > 0 && v.canvas.every((c) => c.dipinti > 0),
    "e vengono DIPINTI davvero, misurato in pixel", JSON.stringify(v.canvas));
  dice(!/libreria che li disegna non è arrivata/.test(v.testo),
    "e l'avviso «senza rete» sparisce quando la rete c'è", v.testo.slice(0, 200));

  /* ⚠️ LA SECONDA CAUSA, che vive solo qui: un periodo senza dati. Con la
     libreria presente, i tre riquadri devono dire «Nessun dato», non restare
     vuoti — ed è il difetto che la torta dei fochini aveva anche con la rete. */
  await pg.evaluate(() => window.dashSetPeriodo && window.dashSetPeriodo("sett"));
  await pg.waitForTimeout(500);
  const vuoto = await guarda(pg);
  const senzaDati = /Nessun dato nel periodo/.test(vuoto.testo);
  const canvasVuoti = vuoto.canvas.filter((c) => c.dipinti === 0);
  console.log(`  · con periodo «sett.»: ${vuoto.canvas.length} canvas, ${canvasVuoti.length} non dipinti`);
  dice(canvasVuoti.length === 0,
    "nessun riquadro resta vuoto in silenzio quando non ci sono dati", JSON.stringify(vuoto.canvas));
  dice(senzaDati || vuoto.canvas.length > 0,
    "e se un grafico non ha dati la schermata lo DICE",
    vuoto.testo.slice(0, 300));
  await pg.close();
}

console.log(`\nRisultato Dashboard senza rete${CONTROPROVA ? " · CONTROPROVA" : ""}: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

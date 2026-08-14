/* «NON ANCORA CARICATO» NON È «NON C'È»
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node finestra-caricamento.mjs [--porta=8583] [--ritardo=30000]
     node finestra-caricamento.mjs --controprova   (rimette i difetti: DEVE fallire)
     node finestra-caricamento.mjs --solo=scudo

   PERCHÉ ESISTE. È il principio del fondatore — *l'assenza di un dato non è un
   dato favorevole* — applicato al TEMPO invece che al dato: fra l'apertura
   della pagina e l'arrivo dei dati c'è una finestra in cui l'app ha già
   disegnato tutto e non sa ancora niente. Se in quella finestra un contatore
   scrive «0» o un KPI scrive un numero, l'app sta dicendo una cosa **falsa e
   tranquilla**: «non lo so ancora» non è «non c'è».

   ⛔ E IL CENSIMENTO PER PAROLA NON RISPONDE ALLA DOMANDA. La voce di roadmap
   partiva da `grep -ciE "caricamento|sto caricando|non ancora caricat"` →
   campo 1 · terra 2 · le altre 0, e lo dichiarava già come un segnale e non un
   conto di difetti. Rilette una per una, quelle tre righe non parlano di
   caricamento dei dati: la riga di Campo è un commento sulla foto («nessun
   servizio esterno, nessun caricamento»), le due di Terra sono la data di
   caricamento di un rilievo nel visore. Cioè le sei app hanno **zero** parole
   per dire «sto caricando», e il censimento contava una forma di scrittura.
   La risposta la dà solo l'orologio, ed è questo banco.

   ── LA FINESTRA È LARGA, E LA BARRA IN BASSO CI VIVE DENTRO ──────────────
   Tutto il programma di un'app sta in un `<script type="module">` che importa
   `<app>-data.js`: finché quel modulo non arriva, il codice dell'app non parte.
   Ma `shared/dw-app-ui.js` è un `<script defer>` classico che espone
   `window.go` con un IIFE, e arriva **subito** (misurato: 45–97 ms). Quindi
   dentro la finestra la barra in basso FUNZIONA e la finestra non è solo il
   Quadro: sono tutte le sezioni dell'app.
   ⚠️ Le linguette dentro una pagina (le `.chg` di Personale in Scudo) NON
   funzionano: il loro ascoltatore è delegato dentro il modulo. I contatori che
   vivono lì sotto restano irraggiungibili nella finestra, e il banco li
   dichiara invece di contarli fra quelli a posto.

   ── COME SI MISURA ───────────────────────────────────────────────────────
   Il ritardo si inietta nella **risposta HTTP** del modulo dati, mai sul file:
   il disco è di tutti e i cantieri paralleli scrivono.
   ⛔ E si abortisce tutto ciò che non è il nostro server. Non è pulizia: senza,
   la larghezza della finestra la decide il **proxy del contenitore** invece del
   prodotto — `scudoData()` prova `DeepworkID.init()`, che importa Firebase da
   gstatic, e qui quel tentativo cade dopo **13 secondi** (misurato). Un banco
   che misurasse quello misurerebbe l'ambiente, non l'app.
   ⚠️ Lo scatto si prende con CDP (`Page.captureScreenshot`): dentro la finestra
   `page.screenshot` di Playwright aspetta i font e **non torna** (misurato: due
   timeout da 4000 ms di fila).

   ── LE DUE DOMANDE, OPPOSTE ──────────────────────────────────────────────
   1. DENTRO la finestra nessun contatore visibile e nessun KPI visibile dice un
      numero. Il soggetto si prende dal DOM, non da un elenco scritto qui: un
      contatore nuovo scritto con «0» cade da solo, senza che nessuno se ne
      ricordi.
   2. DOPO l'arrivo dei dati nessun contatore resta «—». È la difesa contro la
      cura sbagliata nell'altro verso: scrivere «non lo so» dove la verità è un
      numero sarebbe peggio del difetto. `perm-s-badge` è dichiarato per nome
      con la ragione — è il badge della scheda di un permesso APERTO, non un
      contatore — e la dichiarazione è **sorvegliata**: se quel badge sparisce,
      o smette di essere «—», il banco cade e l'eccezione va riletta.

   ── ESITO DELLA PRIMA MISURA (14/08) ─────────────────────────────────────
   19 schermate su 19 (Campo 5, Scudo 8, Sentinella 6), **26 contatori visibili
   che dicevano «0»** — «Squadre in turno 0», «Chi c'è oggi 0», «Lavoratori 0»,
   «Centraline e sensori 0», «Registro volate 0». Gli **otto KPI di Scudo, i
   quattro di Sentinella e i quattro di Campo erano già onesti**: nascono «—».
   Cioè la forma giusta era già nella stessa pagina, due righe più su. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || join(QUI, "..", "..", "..", "..");
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8583;
/* generoso di proposito: la finestra deve restare aperta per il tempo di
   aprire tutte le sezioni di tutte e tre le app (misurato: ~1,5 s per app) */
const RITARDO = Number((process.argv.find((a) => a.startsWith("--ritardo=")) || "").split("=")[1]) || 30000;
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
/* ⛔ SEI APP, NON TRE — e le tre nuove sono entrate il 14/08 portando un
   difetto vero: Flotta aveva **10** contatori nati «0» e Conti **9**, cioè
   esattamente quello che B6 aveva curato nelle prime tre. Il banco era stato
   scritto sulle app che il difetto ce l'avevano, e le altre non erano «a
   posto»: erano **non misurate**. Terra ci sta dentro col suo denominatore —
   di `span.cnt` non ne ha nessuno, e il banco lo stampa invece di tacere. */
const APPS = ["campo", "scudo", "sentinella", "flotta", "conti", "terra"]
  .filter((a) => !SOLO || SOLO.split(",").includes(a));
/* ⛔ GLI SCATTI NON VANNO DENTRO IL REPOSITORY. Un banco che semina file non
   tracciati nell'albero vivo li fa comparire in `git status` di ogni cantiere
   parallelo, e il giro del browser li elenca fra i «file non committati che
   restano FUORI»: rumore che somiglia a lavoro di qualcun altro. Si scrivono
   in `tmp`, e il percorso lo stampa il riepilogo perché uno scatto va GUARDATO. */
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1]
  || join(tmpdir(), "dw-finestra-caricamento");

const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE — uno per contatore, per rotta servita. Si contano
   quelli che hanno trovato il loro pezzo: un `replace` che non sostituisce
   niente esce in silenzio, e una controprova che non inietta niente dichiara
   «non so fallire» per il motivo sbagliato. */
const DIFETTI = {
  "apps/campo/index.html": [
    ['<span class="cnt" id="mie-count">—</span>', '<span class="cnt" id="mie-count">0</span>'],
    ['<span class="cnt" id="att-count-tot">—</span>', '<span class="cnt" id="att-count-tot">0</span>'],
    ['<span class="cnt" id="pon-tot">—</span>', '<span class="cnt" id="pon-tot">0</span>'],
    ['<span class="cnt" id="squ-count">—</span>', '<span class="cnt" id="squ-count">0</span>'],
    ['<span class="cnt" id="ope-count">—</span>', '<span class="cnt" id="ope-count">0</span>'],
    ['<span class="cnt" id="pre-count">—</span>', '<span class="cnt" id="pre-count">0</span>'],
    ['<span class="cnt" id="rap-count">—</span>', '<span class="cnt" id="rap-count">0</span>'],
    ['<span class="cnt" id="set-count">—</span>', '<span class="cnt" id="set-count">0</span>'],
  ],
  "apps/scudo/index.html": [
    ['<span class="cnt" id="pers-count">—</span>', '<span class="cnt" id="pers-count">0</span>'],
    ['<span class="cnt" id="mat-count">—</span>', '<span class="cnt" id="mat-count">0</span>'],
    ['<span class="cnt" id="mans-count">—</span>', '<span class="cnt" id="mans-count">0</span>'],
    ['<span class="cnt" id="dpi-al-count">—</span>', '<span class="cnt" id="dpi-al-count">0</span>'],
    ['<span class="cnt" id="dpi-count">—</span>', '<span class="cnt" id="dpi-count">0</span>'],
    ['<span class="cnt" id="azi-count-tot">—</span>', '<span class="cnt" id="azi-count-tot">0</span>'],
    ['<span class="cnt" id="isp-count">—</span>', '<span class="cnt" id="isp-count">0</span>'],
    ['<span class="cnt" id="cant-count">—</span>', '<span class="cnt" id="cant-count">0</span>'],
    ['<span class="cnt" id="pot-count">—</span>', '<span class="cnt" id="pot-count">0</span>'],
    ['<span class="cnt" id="cause-count">—</span>', '<span class="cnt" id="cause-count">0</span>'],
    ['<span class="cnt" id="appa-count">—</span>', '<span class="cnt" id="appa-count">0</span>'],
    ['<span class="cnt" id="appt-count">—</span>', '<span class="cnt" id="appt-count">0</span>'],
    ['<span class="cnt" id="perm-count">—</span>', '<span class="cnt" id="perm-count">0</span>'],
  ],
  /* ⛔ E il difetto della TERZA domanda non sta in una pagina: sta nella
     struttura condivisa. Neutralizzare la guardia la fa tornare muta in tutte
     e tre le app insieme — cioè un'iniezione sola misura la difesa di sei. */
  "shared/dw-app-ui.js": [
    ["if (datiPronti) return;", "if (true) return;"],
  ],
  "apps/flotta/index.html": [
    ['<span class="cnt" id="mez-tot">—</span>', '<span class="cnt" id="mez-tot">0</span>'],
    ['<span class="cnt" id="fer-tot">—</span>', '<span class="cnt" id="fer-tot">0</span>'],
    ['<span class="cnt" id="man-count">—</span>', '<span class="cnt" id="man-count">0</span>'],
    ['<span class="cnt" id="int-count">—</span>', '<span class="cnt" id="int-count">0</span>'],
    ['<span class="cnt" id="ric-tot">—</span>', '<span class="cnt" id="ric-tot">0</span>'],
    ['<span class="cnt" id="cos-count">—</span>', '<span class="cnt" id="cos-count">0</span>'],
    ['<span class="cnt" id="rif-tot">—</span>', '<span class="cnt" id="rif-tot">0</span>'],
    ['<span class="cnt" id="giro-tot">—</span>', '<span class="cnt" id="giro-tot">0</span>'],
    ['<span class="cnt" id="odl-mano-cnt">—</span>', '<span class="cnt" id="odl-mano-cnt">0</span>'],
    ['<span class="cnt" id="odl-ric-cnt">—</span>', '<span class="cnt" id="odl-ric-cnt">0</span>'],
  ],
  "apps/conti/index.html": [
    ['<span class="cnt" id="fat-cnt">—</span>', '<span class="cnt" id="fat-cnt">0</span>'],
    ['<span class="cnt" id="ban-cnt">—</span>', '<span class="cnt" id="ban-cnt">0</span>'],
    ['<span class="cnt" id="ord-seg-cnt">—</span>', '<span class="cnt" id="ord-seg-cnt">0</span>'],
    ['<span class="cnt" id="ord-cnt">—</span>', '<span class="cnt" id="ord-cnt">0</span>'],
    ['<span class="cnt" id="pes-cnt">—</span>', '<span class="cnt" id="pes-cnt">0</span>'],
    ['<span class="cnt" id="cos-cnt">—</span>', '<span class="cnt" id="cos-cnt">0</span>'],
    ['<span class="cnt" id="lis-cnt">—</span>', '<span class="cnt" id="lis-cnt">0</span>'],
    ['<span class="cnt" id="cli-cnt">—</span>', '<span class="cnt" id="cli-cnt">0</span>'],
    ['<span class="cnt" id="gar-cnt">—</span>', '<span class="cnt" id="gar-cnt">0</span>'],
  ],
  /* ⚠️ Terra non ha nessuno `span.cnt`: senza questa riga la sua prima domanda
     resterebbe SENZA controprova — cioè il banco direbbe «a posto» su una
     difesa che non ha mai provato a far cadere. Il soggetto è un KPI, che LEGGI
     guarda esattamente come un contatore. */
  "apps/terra/index.html": [
    ['<div class="n" id="kpi-vol-mese">—</div>', '<div class="n" id="kpi-vol-mese">0</div>'],
  ],
  "apps/sentinella/index.html": [
    ['<span class="cnt" id="pon-tot">—</span>', '<span class="cnt" id="pon-tot">0</span>'],
    ['<span class="cnt" id="mon-tot">—</span>', '<span class="cnt" id="mon-tot">0</span>'],
    ['<span class="cnt" id="ric-tot">—</span>', '<span class="cnt" id="ric-tot">0</span>'],
    ['<span class="cnt" id="tar-tot">—</span>', '<span class="cnt" id="tar-tot">0</span>'],
    ['<span class="cnt" id="prg-tot">—</span>', '<span class="cnt" id="prg-tot">0</span>'],
    ['<span class="cnt" id="ade-tot">—</span>', '<span class="cnt" id="ade-tot">0</span>'],
    ['<span class="cnt" id="vol-tot">—</span>', '<span class="cnt" id="vol-tot">0</span>'],
    ['<span class="cnt" id="ref-tot">—</span>', '<span class="cnt" id="ref-tot">0</span>'],
    ['<span class="cnt" id="rec-tot">—</span>', '<span class="cnt" id="rec-tot">0</span>'],
  ],
};

/* ⛔ L'ECCEZIONE, DICHIARATA E SORVEGLIATA. `perm-s-badge` non è un contatore:
   è il badge dello stato del permesso APERTO nella scheda, e finché nessun
   permesso è aperto vale «—» a ragione. Sta scritto «—» nel sorgente da prima
   di questo banco. Se un giorno non fosse più così, la riga che lo dichiara
   cade e qualcuno la rilegge — invece di restare a coprire un difetto che non
   c'è più. */
/* Le eccezioni dichiarate, e SORVEGLIATE: se una smette di essere «—» il banco
   cade e la riga va riletta. `perm-s-badge` è il badge della scheda di un
   permesso APERTO, non un contatore. I due di Flotta contano la manodopera e i
   ricambi di UN ordine di lavoro aperto: la scheda esiste solo quando qualcuno
   ne apre uno, e in questo giro nessuno lo fa — «—» lì dentro è la risposta
   giusta, e lo «0» che c'era prima diceva «nessuna manodopera» su un ordine
   che non è nemmeno stato scelto. */
const SEMPRE_TRATTINO = { scudo: ["perm-s-badge"], flotta: ["odl-mano-cnt", "odl-ric-cnt"],
  /* Terra: «m³ estratti mese» resta «—» perche' nella dimostrazione NESSUN
     rilievo cade nel mese in corso — `fmtM3(null)` risponde «—», ed e' la
     risposta giusta: non e' uno zero, e' «non misurato». Per poterlo dichiarare
     gli e' stato dato un id: un elemento che un controllo deve nominare deve
     avere un nome. */
  terra: ["kpi-vol-mese"] };

const colpiti = new Set();
let appCorrente = "";   // la sola app di cui si ritardano i dati: la vede il server
const srv = createServer(async (q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]).replace(/^\//, "");
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  /* ⛔ CHI RITARDARE NON SI SCRIVE A MANO. Questa riga elencava tre app dentro
     una regex: aggiungendone tre all'elenco `APPS` il ritardo NON le ha
     seguite, i loro dati sono arrivati subito e il banco ha misurato una
     finestra che non esisteva — accusando Flotta di sedici «numeri tranquilli»
     che erano i valori VERI della dimostrazione, e di comandi «muti» che
     invece navigavano. È la fixture indovinata: il caso non arrivava al ramo
     che doveva provare. Adesso si ritarda il modulo dell'app che si sta
     misurando, e il nome lo dice il ciclo. */
  if (appCorrente && p.endsWith(`${appCorrente}-data.js`)) await new Promise((r) => setTimeout(r, RITARDO));
  let corpo = readFileSync(p);
  if (CONTROPROVA && DIFETTI[rotta]) {
    let t = corpo.toString("utf8");
    /* ⚠️ LA CHIAVE PORTA LA ROTTA, e non è un dettaglio: `pon-tot` esiste in
       Campo E in Sentinella con la stessa identica riga, quindi un insieme di
       sole stringhe ne contava **29 su 30** e il banco si accusava da solo di
       un'iniezione scaduta che non esisteva. È il righello che sbaglia, non il
       soggetto — la prima volta che questo banco ha stampato un numero. */
    for (const [a, b] of DIFETTI[rotta]) if (t.includes(a)) { colpiti.add(rotta + "|" + a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e non fallisce mai. */
const SEGNO = join(R, "__finestra-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__finestra-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }
mkdirSync(SCATTI, { recursive: true });

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
/* Un soggetto che non si riesce a raggiungere non è un soggetto a posto: si
   dichiara, si elenca fra le righe «non ho guardato» e tiene l'uscita diversa
   da zero. */
const nonMisurati = [];
const nonMisurato = (t, perche) => {
  nonMisurati.push(`${t} — ${perche}`);
  console.log(`  ~~  NON MISURATO  ${t}\n        -> ${perche}`);
};

/* Legge, per ogni elemento, se è VISIBILE davvero. Non basta `display`: un
   contatore dentro una linguetta chiusa ha area zero. */
const LEGGI = () => {
  const vis = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const raccogli = (sel, tipo) => [...document.querySelectorAll(sel)].map((e) => ({
    tipo, id: e.id || "", cls: [...e.classList].join("."),
    eti: (e.parentElement ? (e.parentElement.textContent || "") : "").replace(/\s+/g, " ").trim().slice(0, 60),
    t: (e.textContent || "").trim(), v: vis(e),
  }));
  return [...raccogli("span.cnt", "contatore"), ...raccogli(".kpi .n", "kpi")];
};

/* ── LA TERZA DOMANDA: un comando premuto nella finestra RISPONDE? ────────
   I contatori dicevano una cosa falsa e tranquilla; i comandi non dicevano
   NIENTE. Misurato il 14/08 sulla prima schermata di tre app: 18 su 21
   premuti senza toast, senza modale, senza errore in console e col DOM
   identico — «Segnala un near-miss» e tutti i riquadri KPI. La cura sta in
   `shared/dw-app-ui.js` e si prova nei DUE versi: qui dentro deve rispondere
   il toast della finestra, dopo l'arrivo dei dati NON deve comparire.
   ⚠️ Si preme con `el.click()` dentro la pagina e non con `page.click`:
   Playwright aspetta che l'elemento sia *azionabile*, e su un elemento che non
   lo diventa mai brucia il timeout pieno — è la causa, già scritta in
   CLAUDE.md, di un banco rimasto appeso quattro ore e mezza. */
const PROVA_COMANDI = async ({ sel, quanti }) => {
  const vis = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  };
  const t = document.getElementById("toast");
  const bersagli = [...document.querySelectorAll(sel)]
    .filter((e) => vis(e) && !e.closest(".nav") && e.id !== "dw-tema-btn" && !e.closest("#modal"))
    .slice(0, quanti);
  const out = [];
  for (const el of bersagli) {
    if (t) { t.classList.remove("show"); t.textContent = ""; }
    el.click();
    await new Promise((r) => setTimeout(r, 120));
    out.push({
      chi: el.id || [...el.classList].join(".") || el.tagName,
      risposta: t && t.classList.contains("show") ? (t.textContent || "").trim() : "",
    });
    const m = document.getElementById("modal");
    if (m && m.classList.contains("show")) {
      const b = m.querySelector("#modal-foot .mbtn");
      if (b) b.click();
      await new Promise((r) => setTimeout(r, 80));
    }
  }
  return out;
};
const SEL_COMANDI = "button, .dw-btn, [role=button], .item, .kpi, .sitem";
const DICE_FINESTRA = /stanno ancora arrivando/;
let comandiProvati = 0, comandiMuti = 0;

/* ⛔ QUALE domanda è caduta, non QUANTE volte. La riga di verdetto contava i
   KO e pretendeva che fossero «uno per app»: un numero scritto a mano, che è
   invecchiato il giorno stesso in cui le domande sono diventate due. Si tiene
   invece, per ognuna delle due famiglie, l'insieme delle app che sono cadute:
   così la controprova riesce solo se OGNI app cade su OGNI domanda, e una
   domanda nuova si dichiara qui invece di spostare un totale. */
const cadute = { numeri: new Set(), comandi: new Set() };

let schermateTot = 0, previsteTot = 0;
for (const app of APPS) {
  console.log(`\n════════ ${app} ════════`);
  appCorrente = app;
  const ctx = await b.newContext({ viewport: { width: 430, height: 950 }, locale: "it-IT" });
  const pg = await ctx.newPage();
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  /* tutto ciò che non è il nostro server cade SUBITO: la finestra la decide il
     ritardo che iniettiamo, non il proxy del contenitore */
  await pg.route(new RegExp(`^(?!http://127\\.0\\.0\\.1:${PORTA}).*`), (r) => r.abort());
  const cdp = await ctx.newCDPSession(pg);
  const t0 = Date.now();
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`, { waitUntil: "commit" });

  let barraViva = null;
  for (let i = 0; i < 400; i++) {
    if (await pg.evaluate(() => typeof window.go).catch(() => "x") === "function") { barraViva = Date.now() - t0; break; }
    await pg.waitForTimeout(20);
  }
  if (barraViva === null) {
    nonMisurato(`${app}: la finestra`, "window.go non è mai comparso: non si è potuto navigare");
    await ctx.close();
    continue;
  }
  /* ⚠️ Non è una constatazione, è la PRECONDIZIONE della misura: se la barra
     diventasse viva solo insieme ai dati, la finestra sarebbe il solo Quadro e
     le altre sezioni non sarebbero misurate — un banco che continuasse lo
     stesso direbbe «a posto» su schermate che non ha mai aperto. */
  dice(barraViva < RITARDO / 2,
    `${app}: la barra in basso è viva a ${barraViva} ms, ben prima dei dati (${RITARDO} ms)`, barraViva);

  const muti = [];
  const nav = await pg.$$eval(".nav button", (bs) => bs.map((x) => x.id));
  previsteTot += nav.length;
  const visti = new Map();          // id → testo, per i soli VISIBILI
  const tuttiPresenti = new Set();  // tutti i `.cnt` con id trovati nel DOM
  let schermate = 0;

  for (const id of nav) {
    if (Date.now() - t0 > RITARDO - 2000) {
      nonMisurato(`${app}/${id}`, `la finestra si è chiusa prima di arrivarci (ritardo ${RITARDO} ms)`);
      continue;
    }
    await pg.evaluate((i) => document.getElementById(i).click(), id);
    await pg.waitForTimeout(90);
    const aperta = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
    if (aperta.length !== 1) { nonMisurato(`${app}/${id}`, `non ho navigato: pagine visibili ${JSON.stringify(aperta)}`); continue; }
    const righe = await pg.evaluate(LEGGI);
    for (const r of righe) { if (r.id) tuttiPresenti.add(r.id); if (r.v) visti.set(r.id || r.eti, r); }
    schermate++;
    for (const c of await pg.evaluate(PROVA_COMANDI, { sel: SEL_COMANDI, quanti: 3 })) {
      comandiProvati++;
      if (!DICE_FINESTRA.test(c.risposta)) { comandiMuti++; muti.push(`${app}/${id} · ${c.chi}`); }
    }
    const s = await cdp.send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(SCATTI, `${app}-${id}.png`), Buffer.from(s.data, "base64"));
  }
  schermateTot += schermate;

  /* ⛔ IL DENOMINATORE, PRIMA DEI KO. Un «zero violazioni» su una schermata
     sola non è lo stesso «zero» di uno su otto. */
  console.log(`  ·   ${app}: ${schermate} schermate su ${nav.length} fotografate DENTRO la finestra`
    + ` · ${visti.size} numeri visibili misurati (contatori + KPI)`);
  const irraggiungibili = [...tuttiPresenti].filter((i) => ![...visti.values()].some((v) => v.id === i));
  if (irraggiungibili.length) {
    console.log(`  ·   ${app}: ${irraggiungibili.length} contatori NON raggiungibili nella finestra`
      + ` (le linguette dentro una pagina hanno l'ascoltatore nel modulo, che non è ancora partito): ${irraggiungibili.join(", ")}`);
  }

  const tranquilli = [...visti.values()].filter((v) => /^[0-9]/.test(v.t));
  if (tranquilli.length) cadute.numeri.add(app);
  dice(tranquilli.length === 0,
    `${app}: nessun numero tranquillo nella finestra (${visti.size} misurati)`,
    tranquilli.map((v) => `${v.tipo} ${v.id || v.cls}: «${v.eti}» = ${v.t}`).join(" | "));

  if (muti.length) cadute.comandi.add(app);
  dice(muti.length === 0,
    `${app}: ogni comando premuto nella finestra RISPONDE (${comandiProvati} premuti in tutto finora)`,
    muti.slice(0, 8).join(" | "));

  /* ── DOPO: la cura non deve mentire nell'altro verso ────────────────── */
  const resta = RITARDO - (Date.now() - t0) + 3000;
  if (resta > 0) await pg.waitForTimeout(resta);
  const dopo = await pg.evaluate(LEGGI);
  const ecc = SEMPRE_TRATTINO[app] || [];
  const eccPresenti = ecc.filter((i) => dopo.some((d) => d.id === i && d.t === "—"));
  const rimasti = dopo.filter((d) => d.t === "—" && !ecc.includes(d.id));
  dice(dopo.length > 0 && rimasti.length === 0,
    `${app}: dopo l'arrivo dei dati nessun contatore resta «—» (${dopo.length} guardati, ${ecc.length} dichiarati)`,
    rimasti.map((d) => `${d.id || d.cls}: «${d.eti}»`).join(" | "));
  dice(eccPresenti.length === ecc.length,
    `${app}: le ${ecc.length} eccezioni dichiarate si presentano ancora (${eccPresenti.length})`,
    `dichiarate ${JSON.stringify(ecc)}, trovate a «—» ${JSON.stringify(eccPresenti)}`);
  const dopoComandi = await pg.evaluate(PROVA_COMANDI, { sel: SEL_COMANDI, quanti: 3 });
  const ancoraGuardati = dopoComandi.filter((c) => DICE_FINESTRA.test(c.risposta));
  dice(dopoComandi.length > 0 && ancoraGuardati.length === 0,
    `${app}: dopo l'arrivo dei dati i comandi NON dicono più «sto caricando» (${dopoComandi.length} premuti)`,
    ancoraGuardati.map((c) => c.chi).join(" | "));
  dice(errori.length === 0, `${app}: la pagina non solleva errori`, errori[0]);
  await ctx.close();
}

console.log(`\n──── riepilogo ────`);
console.log(`schermate fotografate DENTRO la finestra: ${schermateTot} su ${previsteTot} previste, ${APPS.length} superfici`);
let scadute = 0;
if (CONTROPROVA) {
  /* ⚠️ E il denominatore conta TUTTE le rotte iniettate, non solo le pagine
     delle app: l'iniezione della terza domanda sta in `shared/dw-app-ui.js`, e
     contarla fra i colpiti senza contarla fra le attese dava «31 su 30» — cioè
     un'iniezione scaduta si sarebbe nascosta dentro quel meno uno. */
  const attese = APPS.reduce((n, a) => n + (DIFETTI[`apps/${a}/index.html`] || []).length, 0)
    + (DIFETTI["shared/dw-app-ui.js"] || []).length;
  scadute = attese - colpiti.size;
  console.log(`difetti rimessi: ${colpiti.size} su ${attese} dichiarati`);
  if (scadute > 0) {
    console.error(`✗ ${scadute} iniezioni non hanno trovato il loro pezzo: SCADUTE, e una controprova`
      + ` che non inietta niente non dimostra niente. Lancia iniezioni-fresche.mjs.`);
  }
  /* la controprova è riuscita solo se OGNI app è caduta su OGNI domanda: un
     rosso su una sola direbbe che le altre non sono difese, e un rosso su una
     sola domanda direbbe che l'altra difesa non è provata */
  const complete = ["numeri", "comandi"].filter((f) => APPS.every((a) => cadute[f].has(a)));
  console.log(`la controprova ha fatto cadere ${ko} controlli · le due domande cadono su tutte le app:`
    + ` numeri ${[...cadute.numeri].length}/${APPS.length}, comandi ${[...cadute.comandi].length}/${APPS.length}`
    + ` (devono essere due su due: ${complete.length === 2 ? "sì" : "NO"})`);
}
if (nonMisurati.length) {
  console.log(`\n⚠️  NON HO GUARDATO (${nonMisurati.length}) — da leggere PRIMA dei KO:`);
  for (const r of nonMisurati) console.log(`   · ${r}`);
}
console.log(`\n${ko === 0 && nonMisurati.length === 0 ? "✔" : "✗"} ${ok} passati, ${ko} falliti, ${nonMisurati.length} non misurati`);
console.log(`scatti in ${SCATTI}`);
await b.close(); srv.close();
if (scadute > 0) process.exit(2);
process.exit(ko === 0 && nonMisurati.length === 0 ? 0 : 1);

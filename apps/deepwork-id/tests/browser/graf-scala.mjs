/* IL GRAFICO DISEGNATO ALLA MISURA DI FUORI — la scala, misurata col righello
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node graf-scala.mjs [--porta=8938] [--solo=terra] [--stretto]
     node graf-scala.mjs --controprova     (rimette i difetti, uno per volta)

   PERCHÉ ESISTE, E PERCHÉ NON PUÒ VIVERE IN `run-kpi.mjs`. La famiglia è
   quella del 06/08 — «il numero è giusto e a mentire è il DISEGNO» — ma un
   piano più sotto: qui non mente nemmeno il disegno, mentono le sue
   DIMENSIONI. Il motore montava la sua `<figure class="dwg">` dentro l'ospite
   che l'app gli indica e poi costruiva il `viewBox` misurando **l'ospite**;
   ma `.dwg` ha `padding: 13px 14px 14px` più il bordo, quindi il disegno
   nasceva alla misura di FUORI e il browser lo rimpiccioliva per farlo stare
   DENTRO. Le proporzioni restano giuste, i valori restano giusti, la console
   resta pulita: a essere sbagliata è la **scala**, cioè la dimensione vera dei
   testi — una tacca dichiarata 10 px veniva disegnata 9,25.
   In `run-kpi` non ci può stare perché non c'è nessuna funzione pura da
   chiamare: la misura è `clientWidth` di un elemento vivo contro
   `svg.viewBox.baseVal`, cioè due letture che solo il browser sa dare.
   `dwGrafici.geometria` espone i tratti e i percorsi — numeri dentro, stringa
   fuori — e infatti quelli si provano in `run-kpi`; la SCALA non passa di lì.

   CHE COSA HA TROVATO, e non è quello che c'era scritto. Il documento del
   06/08 aveva censito il difetto come «Terra ×0,925, Flotta ×1, Sentinella
   ×1 — uno su tre, e dipende dall'ospite», misurato sulle tre schermate
   d'APERTURA. Misurando a tappeto tutte le sezioni di tutte le superfici, il
   07/08: **24 grafici su 38 disegnavano 368 px dentro un viewBox da 398**
   (×0,925), in **cinque app su sei**. Sentinella era l'unica pulita, e non per
   virtù: le sue figure sono `nudo`, cioè senza padding, e per la stessa
   ragione erano puliti i due indici di Scudo e le cinque esposizioni di Conti.
   Cioè il conto vero non era «uno su tre» ma «due su tre», e la riga che lo
   diceva mandava a lavorare su una app sola.

   ⚠️ IL PAVIMENTO DI 240 È DICHIARATO, NON MISURATO. `larghezzaUtile` non
   scende sotto 240 unità di viewBox: sotto quella larghezza il disegno viene
   rimpicciolito **apposta**, perché i testi alla misura vera sarebbero
   illeggibili. Un grafico dentro una colonna da 180 px sta a ×0,625 e non è un
   difetto. Il banco lo **dichiara e lo conta** invece di saltarlo in silenzio:
   è la stessa forma delle «coppie appiattite» dal minimo della barra.

   ⚠️ LA COORDINATA CHE INGANNAVA, e per un'ora ho misurato senza saperlo. A
   430 px di viewport l'ospite delle app è largo **398**, e il ripiego di
   `larghezzaUtile` per un contenitore non misurabile è `innerWidth - 32`, cioè
   **398 anche lui**: i due numeri collidono, e un viewBox da 398 non dice se
   il motore abbia misurato l'ospite o tirato a indovinare. Per questo il banco
   misura a **due viewport**: a 1200 px il ripiego vale 720 (`min(720, …)`) e
   l'ospite ne vale altri, quindi i due casi si separano. È il «rapporto fra
   due valori diversi» applicato al RIGHELLO invece che al soggetto.

   ⛔ L'ELENCO DELLE SUPERFICI È DERIVATO DAL DISCO, non scritto a mano: le app
   sono quelle il cui `index.html` carica `shared/dw-grafici.js`, e le sezioni
   sono i loro `id="nav-…"`. Tre volte in una settimana un elenco tenuto a
   mano ha reso cieco un controllo (la regola 20 che guardava sei app su
   sette, `UI_CONDIVISA` con sei nomi su dieci, le suite del giro `node`
   undici su diciannove). Un'app nuova, o una sezione nuova, entra qui da sola.

   ⏱️ CODA APERTA, DICHIARATA E NON FINTA CHIUSA. Un grafico montato dentro una
   sezione `display:none` non si può misurare: `clientWidth` risponde zero. Il
   documento proponeva di ripiegare sull'ospite; provato, non serve — misurate
   quattro scene (visibile, sezione nascosta, ospite nascosto, contenitore a
   zero), `wrap` ed `el` rispondono **sempre insieme**, e quando rispondono
   zero scatta comunque il ripiego `min(720, innerWidth-32)`, che è un numero
   plausibile e sbagliato. Quello che il banco può garantire, e garantisce, è
   che appena la sezione si APRE il grafico torni in scala: la prova sta nel
   fatto che tutte le sezioni si raggiungono navigando, non ricaricando. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
const STRETTO = process.argv.includes("--stretto");   // una viewport sola: per il giro veloce
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8938;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ══════════════════════════════════════════════════════════════════════
   I DIFETTI DA RIMETTERE, UNO PER VOLTA E CON L'ATTESA SCRITTA ACCANTO
   ══════════════════════════════════════════════════════════════════════
   ⛔ Una controprova che si accontenta di «falliti > 0» dichiara «il banco SA
   fallire» anche col banco rotto: basta che cada una riga qualunque, magari
   per un errore di pagina. Qui ogni iniezione porta la sua ATTESA — quali
   grafici devono cadere, dedotta dalla misura stessa e non da un elenco
   scritto a mano — e la controprova confronta gli insiemi, non i totali. */
const INIEZIONI = [
  {
    nome: "regola-tolta",
    che: "il motore torna a misurare l'OSPITE invece del riquadro del disegno",
    dove: "shared/dw-grafici.js",
    da: "    return larghezzaUtile(this.wrap || this.el);",
    a:  "    return larghezzaUtile(this.el);",
    /* devono cadere TUTTI e SOLI i grafici la cui figura ha un padding, cioè
       quelli in cui l'ospite è più largo del riquadro. Gli altri (le figure
       `nudo`) restano giusti anche col difetto rimesso, ed è giusto così. */
    attesa: (m) => m.filter((x) => x.hostW !== x.wrapW && x.wrapW >= 240),
    esatta: true,
  },
  {
    nome: "ridisegno-tolto",
    che: "solo il ridisegno dopo un cambio di misura torna all'ospite (monta() resta giusto)",
    dove: "shared/dw-grafici.js",
    da: "        var w = self.largoDisegno();",
    a:  "        var w = larghezzaUtile(self.el);",
    /* ⚠️ QUESTA ESISTE PER LA COPERTURA, NON PER IL RISULTATO. Senza, resterebbe
       da dimostrare che il banco veda un difetto sul secondo dei due punti che
       decidono la larghezza — ed è il punto che scatta proprio quando si
       naviga verso una sezione che era nascosta, cioè il caso della coda. Non
       si può prevedere QUALI grafici vengano ridisegnati, quindi l'attesa è
       più larga: qualcuno deve cadere, e chi cade dev'essere fra quelli col
       padding. Il numero viene stampato. */
    attesa: (m) => m.filter((x) => x.hostW !== x.wrapW && x.wrapW >= 240),
    esatta: false,
  },
  {
    nome: "scala-fissa",
    che: "il viewBox non guarda più nessuna scatola: sempre 500",
    dove: "shared/dw-grafici.js",
    da: "    return Math.max(240, Math.min(1040, Math.round(w)));",
    a:  "    return 500;",
    /* ⛔ LA TERZA È QUELLA CHE PROVA L'ALTRA METÀ DEL BANCO. Le prime due
       cadono solo dove c'è il padding: senza questa resterebbe da dimostrare
       che sui quattordici grafici già in scala (le figure `nudo` di
       Sentinella, i due indici di Scudo, le esposizioni di Conti) il banco
       sappia bocciare — cioè che stia misurando il RAPPORTO e non «hai
       chiamato il metodo giusto». Deve cadere tutto ciò che non è largo
       esattamente 500. */
    attesa: (m) => m.filter((x) => Math.abs(x.wrapW - 500) > 1 && !x.spark),
    esatta: true,
  },
];

/* ══════════════════════════════════════════════════════════════════════
   LE SUPERFICI, DERIVATE DAL DISCO
   ══════════════════════════════════════════════════════════════════════ */
function superfici() {
  const out = [];
  for (const app of readdirSync(join(R, "apps")).sort()) {
    const p = join(R, "apps", app, "index.html");
    if (!existsSync(p)) continue;
    const t = readFileSync(p, "utf8");
    if (!t.includes("dw-grafici.js")) continue;
    const sez = [...new Set([...t.matchAll(/id="nav-([a-z0-9-]+)"/g)].map((m) => m[1]))];
    if (sez.length) out.push({ app, sez });
  }
  return out;
}
const SUP = superfici().filter((s) => !SOLO || s.app === SOLO);
if (!SUP.length) { console.error(`✗ nessuna superficie${SOLO ? " per --solo=" + SOLO : ""}: l'elenco derivato è vuoto, non è «tutto a posto»`); process.exit(2); }

/* ══════════════════════════════════════════════════════════════════════
   IL SERVER, con l'iniezione nella RISPOSTA e mai sul file
   ══════════════════════════════════════════════════════════════════════ */
let INIEZIONE = null;
let iniettato = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (INIEZIONE && p.endsWith(INIEZIONE.dove)) {
    let t = corpo.toString("utf8");
    if (t.includes(INIEZIONE.da)) { iniettato++; t = t.split(INIEZIONE.da).join(INIEZIONE.a); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro, in silenzio. */
const SEGNO = join(R, "__graf-scala-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__graf-scala-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const caduti = new Set();
const dice = (c, chiave, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; caduti.add(chiave); console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 300)}` : ""}`); }
};

/* LA SONDA. Per ogni grafico: che cosa DICHIARA il viewBox e quanti pixel
   occupa davvero. Le due cose si confrontano fuori dalla pagina. */
const SONDA = () => {
  const att = document.querySelector(".page.active");
  if (!att) return [];
  const out = [];
  const n2 = (x) => +(+x).toFixed(2);
  att.querySelectorAll("svg.dwg-svg").forEach((svg) => {
    /* il quadratino della legenda è un `<svg>` anche lui, col suo viewBox
       fisso: preso per un grafico sposterebbe il conto senza dire niente */
    if (svg.closest(".dwg-leg")) return;
    const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal.width : 0;
    const r = svg.getBoundingClientRect();
    if (!vb || !r.width) return;
    const fig = svg.closest("figure.dwg");
    const wrap = svg.closest(".dwg-plot");
    const host = fig && fig.parentElement;
    out.push({
      id: (host && host.id) || (svg.closest("[id]") || {}).id || "?",
      spark: svg.classList.contains("dwg-spark"),
      vb: n2(vb), px: n2(r.width),
      hostW: host ? host.clientWidth : 0,
      wrapW: wrap ? wrap.clientWidth : 0,
    });
  });
  return out;
};

const VIEWPORT = STRETTO ? [{ width: 430, height: 950 }] : [{ width: 430, height: 950 }, { width: 1200, height: 950 }];

/* una passata = tutte le superfici a tutte le viewport. Restituisce le misure. */
async function passata(giudica) {
  const misure = [];
  const CONTO = { schermate: 0, navFallite: 0, erroriPagina: 0 };
  for (const vp of VIEWPORT) {
    for (const { app, sez } of SUP) {
      /* una pagina sola per app, e le sezioni si RAGGIUNGONO NAVIGANDO: è più
         veloce di 41 caricamenti, ed è anche il caso vero — un grafico montato
         mentre la sua sezione era nascosta dev'essere tornato in scala quando
         la sezione si apre. */
      const pg = await b.newPage({ viewport: vp });
      const errori = [];
      pg.on("pageerror", (e) => errori.push(e.message));
      await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`);
      await pg.waitForTimeout(2200);
      for (const s of sez) {
        if (s !== sez[0]) { await pg.click("#nav-" + s).catch(() => {}); await pg.waitForTimeout(700); }
        else await pg.waitForTimeout(200);
        /* ⛔ LA PROVA DI AVER NAVIGATO. Un banco che non naviga fotografa la
           stessa schermata a ogni giro e risponde «tutto a posto». */
        const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
        if (viste.length !== 1 || viste[0] !== "page-" + s) { CONTO.navFallite++; continue; }
        CONTO.schermate++;
        for (const x of await pg.evaluate(SONDA)) misure.push({ app, sez: s, vp: vp.width, ...x });
      }
      if (errori.length) { CONTO.erroriPagina++; if (giudica) dice(false, `errore/${app}`, `${app}: nessun errore di pagina`, errori[0]); }
      await pg.close();
    }
  }
  return { misure, CONTO };
}

/* IL GIUDIZIO. Una riga per grafico misurato; il pavimento di 240 dichiarato
   invece che saltato. La chiave è stabile, così la controprova può confrontare
   INSIEMI di asserzioni cadute invece di contarle. */
function giudica(misure) {
  const pavimento = [];
  for (const m of misure) {
    const chiave = `${m.vp}·${m.app}/${m.sez}#${m.id}`;
    /* ⚠️ NON È UN DIFETTO ED È DICHIARATO: sotto 240 unità il motore tiene il
       viewBox fermo apposta, e il browser rimpicciolisce. Contarlo come un KO
       insegnerebbe a non guardare i KO.
       ⛔ LA CONDIZIONE È QUELLA PRECISA — «il motore ha davvero pinzato», cioè
       `viewBox === 240` — e non quella comoda, «il riquadro è più stretto di
       240». La prima stesura usava la comoda e ci cadeva dentro la sparkline
       di Sentinella: riquadro 138 px, e il banco dichiarava «qui il rapporto è
       minore di 1 apposta» su un grafico che stava a ×1,000 esatto. La
       sparkline non passa da `larghezzaUtile` affatto — si costruisce il
       `viewBox` da `spec.larghezza` — quindi il pavimento non la riguarda, e
       scusarla voleva dire smettere di misurarla. Una scusa che copre un caso
       sano è un'asserzione persa in silenzio. */
    if (m.vb === 240 && m.wrapW > 0 && m.wrapW < 240) {
      pavimento.push(`${chiave} (riquadro ${m.wrapW} px, viewBox ${m.vb}: ×${(m.px / m.vb).toFixed(3)})`);
      continue;
    }
    dice(Math.abs(m.px - m.vb) <= 1, chiave,
      `${chiave}: viewBox ${m.vb} → ${m.px} px  (×${(m.px / m.vb).toFixed(3)})`,
      `il disegno nasce largo ${m.vb} e viene mostrato ${m.px}: ospite ${m.hostW} px, riquadro ${m.wrapW} px`);
  }
  if (pavimento.length) {
    console.log(`  ··  ${pavimento.length} grafici stanno sotto il pavimento di 240 unità del motore: il rapporto lì è minore di 1 APPOSTA, e non si confronta`);
    for (const r of pavimento.slice(0, 8)) console.log(`      · ${r}`);
  }
  return pavimento.length;
}

/* ══════════════════════════════════════════════════════════════════════
   IL GIRO
   ══════════════════════════════════════════════════════════════════════ */
console.log(`LA SCALA DEI GRAFICI — pixel veri contro unità di viewBox${CONTROPROVA ? "   [CONTROPROVA]" : ""}`);
console.log(`superfici derivate dal disco: ${SUP.map((s) => `${s.app}(${s.sez.length})`).join(" ")}`);
console.log(`viewport: ${VIEWPORT.map((v) => v.width + "px").join(", ")}\n`);

const sano = await passata(true);
const nPav = giudica(sano.misure);

/* il censimento per app, perché «nessuna violazione» senza il conto accanto
   non vale niente */
const perApp = {};
for (const m of sano.misure) {
  const a = (perApp[m.app] = perApp[m.app] || { n: 0, fuori: 0, nudo: 0 });
  a.n++;
  if (Math.abs(m.px - m.vb) > 1 && m.wrapW >= 240) a.fuori++;
  if (m.hostW === m.wrapW) a.nudo++;
}
console.log("");
for (const [a, v] of Object.entries(perApp)) {
  console.log(`  ··  ${a}: ${v.n} grafici misurati, ${v.nudo} in figure senza padding, ${v.fuori} fuori scala`);
}
/* ⛔ SE NON HO MISURATO NIENTE, NON HO GUARDATO NIENTE: un banco che non trova
   grafici stampa lo stesso «0 KO». La soglia è DERIVATA dalle superfici che ho
   aperto, non un numero scritto a mano che con `--solo=` diventerebbe falso:
   ogni app che carica il motore deve aver dato almeno un grafico per viewport. */
for (const { app } of SUP) {
  dice(perApp[app] && perApp[app].n >= VIEWPORT.length, "censimento/" + app,
    `censimento ${app}: ${(perApp[app] || { n: 0 }).n} grafici misurati`,
    "nessun grafico misurato: il banco non ha guardato niente, e «0 KO» non vuol dire «a posto»");
}
dice(sano.CONTO.navFallite === 0, "navigazione",
  `tutte le ${sano.CONTO.schermate} schermate sono state raggiunte navigando`,
  `${sano.CONTO.navFallite} navigazioni non arrivate`);

if (!CONTROPROVA) {
  console.log(`\n${sano.misure.length} grafici misurati · ${sano.CONTO.schermate} schermate · ${VIEWPORT.length} viewport`
    + ` · ${nPav} sotto il pavimento di 240, dichiarati invece che confrontati`);
  console.log(`${ok} ok, ${ko} KO`);
  await b.close(); srv.close();
  process.exit(ko ? 1 : 0);
}

/* ══════════════════════════════════════════════════════════════════════
   LA CONTROPROVA: un difetto per volta, e si guarda QUALI cadono
   ══════════════════════════════════════════════════════════════════════ */
if (ko !== 0) {
  console.error("\n✗ la passata SANA è già rossa: la controprova non potrebbe distinguere niente.");
  await b.close(); srv.close(); process.exit(2);
}
const sane = new Map(sano.misure.map((m) => [`${m.vp}·${m.app}/${m.sez}#${m.id}`, m]));
let esiti = 0;
for (const inj of INIEZIONI) {
  INIEZIONE = inj; iniettato = 0;
  ok = 0; ko = 0; caduti.clear();
  console.log(`\n── iniezione «${inj.nome}» — ${inj.che}`);
  const malato = await passata(false);
  giudica(malato.misure);
  /* ⚠️ UN `replace` CHE NON TROVA NIENTE ESCE IN SILENZIO: senza questo conto
     una controprova che non ha iniettato nulla misura un file sano e accusa
     la prova invece dell'iniezione. */
  if (iniettato === 0) {
    console.error(`  ✗ «${inj.nome}» NON è stata iniettata: il testo cercato non c'è in ${inj.dove}. Non misura quello che crede.`);
    esiti++;
    continue;
  }
  const attesi = new Set(inj.attesa([...sane.values()]).map((m) => `${m.vp}·${m.app}/${m.sez}#${m.id}`));
  const mancati = [...attesi].filter((k) => !caduti.has(k));
  const sorpresa = [...caduti].filter((k) => !attesi.has(k));
  console.log(`  ${iniettato} risposte HTTP iniettate · ${caduti.size} asserzioni cadute, ${attesi.size} attese`);
  if (inj.esatta) {
    if (mancati.length || sorpresa.length) {
      console.error(`  ✗ «${inj.nome}»: l'insieme delle asserzioni cadute NON è quello atteso.`);
      if (mancati.length) console.error(`     non cadute ma attese (${mancati.length}): ${mancati.slice(0, 6).join(", ")}`);
      if (sorpresa.length) console.error(`     cadute e non attese (${sorpresa.length}): ${sorpresa.slice(0, 6).join(", ")}`);
      esiti++;
    } else console.log(`  ✓ cadono esattamente le ${attesi.size} asserzioni attese, e nessun'altra`);
  } else {
    if (!caduti.size || sorpresa.length) {
      console.error(`  ✗ «${inj.nome}»: attese ${caduti.size ? "solo asserzioni fra le " + attesi.size + " col padding" : "almeno una caduta"}`);
      if (sorpresa.length) console.error(`     cadute fuori dall'insieme atteso (${sorpresa.length}): ${sorpresa.slice(0, 6).join(", ")}`);
      esiti++;
    } else console.log(`  ✓ ${caduti.size} asserzioni cadute, tutte dentro le ${attesi.size} col padding`);
  }
}
console.log(`\n${INIEZIONI.length} iniezioni provate, ${INIEZIONI.length - esiti} hanno fatto cadere esattamente quello che dovevano.`);
await b.close(); srv.close();
if (esiti) { console.error("✗ CONTROPROVA: il banco non sta misurando quello che crede."); process.exit(2); }
console.log("✓ controprova: coi difetti rimessi il banco fallisce, dove deve e solo dove deve.");
process.exit(0);

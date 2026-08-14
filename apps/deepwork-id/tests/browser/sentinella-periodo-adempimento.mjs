/* SENTINELLA: DALLA SCADENZA AL REPORT DI QUEL PERIODO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-periodo-adempimento.mjs [--porta=8557]
     node sentinella-periodo-adempimento.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Lo scadenzario sapeva QUANDO va consegnato un adempimento;
   il Report faceva DIGITARE «dal» e «al». Fra le due cose non c'era niente,
   quindi il periodo lo indovinava chi premeva il bottone — e ne usciva un
   documento perfettamente coerente SUL PERIODO SBAGLIATO: i numeri tutti veri,
   e sbagliata la DOMANDA a cui rispondono. Due date scritte a mano non sono
   smentite da niente, quindi nessuno se ne accorge.
   `run-kpi.mjs` prova la funzione (`periodoAdempimento`); qui si prova quello
   che solo il browser vede, e che è la metà che conta:
     1. la riga dello scadenzario SCRIVE il periodo coperto, o dice che non lo sa;
     2. il bottone porta al Report con le due date GIÀ SCRITTE nei campi veri;
     3. a schermo c'è la frase che dichiara DI CHE periodo si tratta;
     4. ⛔ e quando il periodo NON si ricava il bottone NON naviga: dice cosa
        manca. Portare al Report con un trimestre plausibile già scritto è
        esattamente il difetto che questa unità esiste per togliere;
     5. ⛔ la frase sparisce appena le date si toccano a mano — se restasse,
        direbbe il falso proprio dal momento in cui smette di essere vera;
     6. e se in quel periodo non risulta registrata nessuna misura, il Report
        lo DICE («senza dati» non è «conforme»).

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, in coda alla risposta HTTP del modulo:
   il file su disco non si tocca mai, e un giro del browser che stesse girando
   su un'altra copia non se ne accorge.
   ⚠️ OGNI CASO DICHIARA LA SUA PRECONDIZIONE: se la riga che deve misurare non
   arriva a schermo il banco scrive NON MISURATO ed esce diverso da zero,
   invece di accusare il prodotto — un soggetto non misurato non è un soggetto
   a posto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8557;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE. Si contano: un `replace` che non trova niente esce
   in silenzio, e una controprova che non sostituisce niente prova un prodotto
   SANO dichiarando «non distingue» — la terza delle cinque cause. */
const DIFETTI_PAGINA = [
  // 4 · il bottone porta al Report anche quando il periodo non si ricava
  /* ⚠️ L'INIEZIONE RIMETTE IL DIFETTO, NON UN ERRORE: la prima stesura
     riassegnava `p`, che è un `const` — la pagina moriva con un TypeError e il
     banco «non navigava» per il motivo sbagliato, cioè misurava il crollo
     invece del ripiego. Qui il ripiego è un intervallo plausibile passato di
     lato, esattamente come lo scriverebbe qualcuno in buona fede. */
  [`      if (!p.noto) {
        toast(DICHIARAZIONI_PERIODO[p.motivo].testo, "err");
        return; }`,
   `      if (!p.noto) {
        return apriReportDaAdempimento(a, { ...p, noto: true, dal: "2026-07-01", al: "2026-09-30", giorni: 92 }); }`],
  // 3 · la frase che dichiara il periodo non compare
  [`      el.style.display = "";`, `      el.style.display = "none";`],
  // 5 · e non sparisce quando le date si toccano a mano
  [`    el.textContent = ""; el.style.display = "none"; el.className = "note esito";`,
   `    void el;`],
  // 1 · la riga dello scadenzario tace sul periodo coperto
  ['<div class="ade-per${per.noto ? "" : " ignoto"}">${\n        per.noto ? `copre ${fmtD(per.dal)} → ${fmtD(per.al)}` : "periodo coperto non dichiarato"}</div>',
   '<div class="ade-per">${"" && per}</div>'],
];
/* 2 · il periodo si conta in giorni (la `PERIODICITA` del programma) invece
   che in mesi di calendario: il trimestre comincia il 3 luglio, non il 1°.
   Vive nel MODULO, quindi si rimette lì. */
const DIFETTI_MODULO = [
  [`  const dal = al ? dataMenoMesi(piuGiorni(al, 1), mesi) : "";`,
   `  const dal = al ? piuGiorni(al, -(mesi * 30 - 1)) : "";`],
];

/* I CASI. Due adempimenti nuovi in coda alla dimostrazione:
   · uno TRIMESTRALE con consegna 30 gg, il cui periodo è un trimestre di
     calendario pieno e cade DOVE NON C'È NESSUNA LETTURA (la dimostrazione
     misura da giugno 2026): serve al caso 6;
   · uno con la sola scadenza, per il caso 4. `Rinnovo AUA` della
     dimostrazione lo è già, e si misura anche lui. */
const FIXTURE =
  `\nDEMO.adempimenti.push({ id: "sxp1", titolo: "Relazione trimestrale acque", ente: "ARPA",`
  + ` scadenza: "2025-10-30", periodoMesi: 3, giorniConsegna: 30 });\n`
  + `DEMO.adempimenti.push({ id: "sxp2", titolo: "Comunicazione senza periodo", ente: "Comune",`
  + ` scadenza: "2026-09-15" });\n`;

/* ⛔ `--difetto=N` METTE UNA INIEZIONE SOLA. Con tutte insieme due difetti si
   MASCHERANO a vicenda (la riga nascosta da uno non può «non sparire» per
   l'altro) e la controprova dichiara verde una prova cieca: è la seconda
   delle sei cause travestita da controprova riuscita. Il giro lancia la
   passata completa; questa opzione serve a dimostrare, una per una, che ogni
   iniezione ha almeno una prova che la vede. */
const SOLO = Number((process.argv.find((a) => a.startsWith("--difetto=")) || "").split("=")[1]) || 0;
const TUTTI = [...DIFETTI_PAGINA.map((d) => ["pagina", d]), ...DIFETTI_MODULO.map((d) => ["modulo", d])];
const SCELTI = SOLO ? [TUTTI[SOLO - 1]].filter(Boolean) : TUTTI;
if (SOLO && !SCELTI.length) { console.error(`✗ --difetto=${SOLO}: ce ne sono ${TUTTI.length}`); process.exit(2); }
const attiviPagina = SCELTI.filter(([k]) => k === "pagina").map(([, d]) => d);
const attiviModulo = SCELTI.filter(([k]) => k === "modulo").map(([, d]) => d);

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [a, b] of attiviModulo) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of attiviPagina) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__sentinella-periodo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-periodo-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
/* ⛔ NON ACCUSA: la precondizione non si è presentata, quindi la domanda non
   ha senso. Si elenca fra le righe «non ho guardato», PRIMA dei KO, e il
   banco esce comunque diverso da zero. */
const nonMisurato = (t, x) => { nonMisurati.push(t + (x ? " — " + String(x).slice(0, 200) : "")); console.log(`  NON MISURATO  ${t}`); };

async function apri(bottone) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  pg.__errori = errori;
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
// la riga dello scadenzario che porta quel titolo, col suo testo e il suo id
const rigaDi = (pg, titolo) => pg.evaluate((t) => {
  const el = [...document.querySelectorAll("#ade-list .item")]
    .find((x) => (x.querySelector(".name") || {}).textContent === t);
  if (!el) return null;
  const bot = el.querySelector("[data-ade-rep]");
  /* ⛔ IL PERIODO SI LEGGE DALLA SUA RIGA (`.ade-per`), non da `.meta`: `.meta`
     è tagliata a due righe dal foglio condiviso, e lo scatto ha mostrato che
     appesa lì la coda «copre … → …» finiva SOTTO IL TAGLIO — testo morto sul
     dato che dice se il report partirà giusto. Un banco che legge il DOM non
     se ne sarebbe accorto: `textContent` c'è anche quando non si vede. */
  return { testo: (el.textContent || "").replace(/\s+/g, " ").trim(),
           meta: ((el.querySelector(".ade-per") || {}).textContent || "").replace(/\s+/g, " ").trim(),
           /* e si misura anche che quella riga NON sia tagliata: se un giorno
              qualcuno le rimettesse un clamp, il testo ci sarebbe e non si
              leggerebbe. `scrollHeight > clientHeight` è la risposta del
              browser alla domanda «ci sta tutto?». */
           periodoTagliato: (() => { const q = el.querySelector(".ade-per");
             return q ? q.scrollHeight > q.clientHeight + 1 : null; })(),
           id: bot ? bot.getAttribute("data-ade-rep") : null,
           titoloBottone: bot ? bot.getAttribute("title") : null };
}, titolo);
const statoReport = (pg) => pg.evaluate(() => {
  const o = document.getElementById("rep-origine");
  const viste = [...document.querySelectorAll(".page")].filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id);
  return { pagina: viste.join(","), dal: document.getElementById("rep-dal").value,
           al: document.getElementById("rep-al").value,
           origineVisibile: !!o && getComputedStyle(o).display !== "none" && !!(o.textContent || "").trim(),
           origine: (o ? o.textContent : "").replace(/\s+/g, " ").trim(),
           origineCls: o ? o.className : "",
           doc: (document.getElementById("rep-doc").textContent || "").replace(/\s+/g, " ").trim() };
});

console.log(`\n════════ Sentinella · dalla scadenza al report di quel periodo${CONTROPROVA ? " · controprova" : ""} ════════`);
if (CONTROPROVA) console.log(`⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO${SOLO ? ` · SOLO il difetto ${SOLO} di ${TUTTI.length}` : ` · tutti e ${TUTTI.length} i difetti insieme`}`);

// ── 1 · LA RIGA DELLO SCADENZARIO DICE IL PERIODO ─────────────────────────
console.log("\n· la riga dello scadenzario scrive che periodo copre l'adempimento");
{
  const pg = await apri("nav-ade");
  const sem = await rigaDi(pg, "Verifica fonometrica semestrale");
  if (!sem) nonMisurato("la riga «Verifica fonometrica semestrale» non è arrivata a schermo");
  else {
    dice(/copre 01\/04\/2026 → 30\/09\/2026/.test(sem.meta),
      "⛔ il semestre di calendario, scritto sulla riga: 01/04/2026 → 30/09/2026", sem.meta);
    dice(/dal 01\/04\/2026 al 30\/09\/2026/.test(sem.titoloBottone || ""),
      "e il bottone dice dove porterà", sem.titoloBottone);
    dice(sem.periodoTagliato === false,
      "⛔ e quella riga non è tagliata: il periodo si legge tutto", sem.periodoTagliato);
  }
  const rin = await rigaDi(pg, "Rinnovo AUA");
  if (!rin) nonMisurato("la riga «Rinnovo AUA» non è arrivata a schermo");
  else {
    dice(/periodo coperto non dichiarato/.test(rin.meta),
      "⛔ e su un rinnovo, che non copre nessun periodo di misure, lo DICE", rin.meta);
    dice(!/copre \d/.test(rin.meta), "⛔ senza scrivere nessun intervallo di ripiego", rin.meta);
  }
  const trim = await rigaDi(pg, "Relazione trimestrale acque");
  if (!trim) nonMisurato("la riga «Relazione trimestrale acque» (caso costruito) non è arrivata a schermo");
  else dice(/copre 01\/07\/2025 → 30\/09\/2025/.test(trim.meta),
    "⛔ con 30 giorni di consegna il trimestre è quello PRIMA della scadenza: 01/07 → 30/09", trim.meta);
  await pg.close();
}

// ── 2, 3 · IL BOTTONE PORTA AL REPORT COL PERIODO GIÀ SCRITTO ─────────────
console.log("\n· il bottone porta al Report con le due date già nei campi");
{
  const pg = await apri("nav-ade");
  const prima = await statoReport(pg);
  const sem = await rigaDi(pg, "Verifica fonometrica semestrale");
  if (!sem || !sem.id) nonMisurato("il bottone del report non c'è sulla riga del semestrale");
  else {
    await pg.click(`[data-ade-rep="${sem.id}"]`);
    await pg.waitForTimeout(900);
    const s = await statoReport(pg);
    dice(s.pagina === "page-rep", "si arriva al Report", s.pagina);
    dice(s.dal === "2026-04-01" && s.al === "2026-09-30",
      "⛔ e le due date sono NEI CAMPI, non da scrivere a mano", `${s.dal} → ${s.al}`);
    dice(prima.dal !== s.dal, "e non sono quelle di partenza", `prima ${prima.dal}, dopo ${s.dal}`);
    dice(s.origineVisibile, "⛔ a schermo c'è la riga che dichiara di che periodo si tratta", s.origine);
    dice(/Periodo dell'adempimento «Verifica fonometrica semestrale»: dal 01\/04\/2026 al 30\/09\/2026/.test(s.origine),
      "e lo dice per nome, con le date", s.origine);
    dice(/183 giorni/.test(s.origine), "con quanti giorni sono", s.origine);
    dice(/non sono state scelte a mano/.test(s.origine), "e che non le ha scelte nessuno a mano", s.origine);
    dice(s.doc.length > 200, "il documento si è composto davvero", s.doc.slice(0, 120));

    // ── 5 · e la riga sparisce appena le date si toccano a mano ────────────
    await pg.fill("#rep-dal", "2026-05-01");
    await pg.dispatchEvent("#rep-dal", "change");
    await pg.waitForTimeout(500);
    const dopo = await statoReport(pg);
    dice(!dopo.origineVisibile,
      "⛔ toccata una data a mano, la riga sparisce: da lì in poi direbbe il falso", dopo.origine);
    dice(dopo.dal === "2026-05-01", "e il report si rifà sul periodo nuovo", dopo.dal);
  }
  await pg.close();
}

// ── 4 · QUANDO IL PERIODO NON SI RICAVA, IL BOTTONE NON NAVIGA ────────────
console.log("\n· quando il periodo non si ricava il bottone lo DICE e non porta a un documento");
{
  const pg = await apri("nav-ade");
  const prima = await statoReport(pg);
  const rin = await rigaDi(pg, "Comunicazione senza periodo");
  if (!rin || !rin.id) nonMisurato("il bottone del report non c'è sulla riga senza periodo");
  else {
    await pg.click(`[data-ade-rep="${rin.id}"]`);
    await pg.waitForTimeout(800);
    const s = await statoReport(pg);
    dice(s.pagina === "page-ade", "⛔ NON si va al Report: si resta dov'eravamo", s.pagina);
    dice(s.dal === prima.dal && s.al === prima.al,
      "⛔ e i campi del Report non sono stati toccati: nessuna data inventata", `${s.dal} → ${s.al}`);
    const toast = await pg.evaluate(() => {
      const t = document.getElementById("toast");
      return { visibile: !!t && getComputedStyle(t).opacity !== "0" && !!(t.textContent || "").trim(),
               testo: (t ? t.textContent : "").replace(/\s+/g, " ").trim() };
    });
    dice(toast.visibile, "un messaggio compare", toast.testo);
    dice(/non dichiara quanto tempo copre/.test(toast.testo),
      "⛔ e dice che cosa manca, non «errore»", toast.testo);
    dice(!/\d{2}\/\d{2}\/\d{4}/.test(toast.testo),
      "⛔ senza proporre nessuna data", toast.testo);
  }
  await pg.close();
}

// ── 6 · UN PERIODO SENZA NESSUNA MISURA NON ESCE TRANQUILLO ───────────────
console.log("\n· e se in quel periodo non ha misurato nessuno, il Report lo dice");
{
  const pg = await apri("nav-ade");
  const trim = await rigaDi(pg, "Relazione trimestrale acque");
  if (!trim || !trim.id) nonMisurato("il caso costruito (trimestre senza letture) non è arrivato a schermo");
  else {
    /* PRECONDIZIONE: il trimestre 01/07–30/09 del 2025 sta PRIMA di ogni
       lettura della dimostrazione. Se un giorno la dimostrazione crescesse
       all'indietro il caso non sarebbe più quello che il banco crede, e allora
       si dichiara invece di accusare. */
    const vuoto = await pg.evaluate(() => {
      const d = window.__DW_LETTURE || null; return d;
    });
    void vuoto;
    await pg.click(`[data-ade-rep="${trim.id}"]`);
    await pg.waitForTimeout(900);
    const s = await statoReport(pg);
    dice(s.pagina === "page-rep", "si arriva al Report", s.pagina);
    dice(s.dal === "2025-07-01" && s.al === "2025-09-30", "sul trimestre dell'adempimento", `${s.dal} → ${s.al}`);
    if (/misura è stata davvero registrata/.test(s.doc))
      nonMisurato("il trimestre costruito contiene delle letture: il caso «senza misure» non si presenta", s.doc.slice(0, 160));
    else {
      dice(/non risulta registrata nessuna misura/.test(s.origine + " " + s.doc),
        "⛔ il documento DICE che in quei giorni non ha misurato nessuno", s.origine);
      dice(/err/.test(s.origineCls), "e la riga non è tranquilla (è in rosso)", s.origineCls);
      dice(!/\bConforme\b/.test(s.doc.replace(/Non conforme/g, "")),
        "⛔ e l'esito non è «Conforme»: «senza dati» non è «conforme»",
        (s.doc.match(/[^.]*Conform[^.]*\./) || [])[0]);
    }
  }
  await pg.close();
}

await b.close();
srv.close();

if (nonMisurati.length) {
  console.log("\n⚠️ NON HO GUARDATO (da leggere PRIMA dei KO):");
  for (const n of nonMisurati) console.log("  · " + n);
}

if (CONTROPROVA) {
  const attesi = SCELTI.length;
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${attesi}`);
  if (colpiti.size !== attesi) {
    console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO${nonMisurati.length ? `, ${nonMisurati.length} non misurati` : ""}`);
process.exit(ko > 0 || nonMisurati.length ? 1 : 0);

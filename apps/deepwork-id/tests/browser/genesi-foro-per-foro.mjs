/* IL PROGETTO «FORO PER FORO», FETTA F1 (26/11) — IL PIANO DI CARICO DICE
   PER OGNI FORO IL VALORE DI QUEL FORO
   ─────────────────────────────────────────────────────────────────
   Uso:
     node genesi-foro-per-foro.mjs [--porta=8774]
     node genesi-foro-per-foro.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Fino al 26/11 in Genesi profondità, carica e borraggio
   erano UNO per tutta la volata, e il piano di carico scriveva la stessa
   terna su ogni riga. In ogni programma concorrente ogni foro ha i suoi
   valori (piano in docs/GENESI_ROADMAP_COMPETITOR.md, sezione 26/11). La
   prima fetta è la fondazione: un foro PUÒ portare `kg`, `prof`, `stem` suoi
   e `valoreDiForo` (genesi-data.js) risponde «quanto vale per questo foro?».
   Il suo primo consumatore vero è il piano di carico.

   COSA GUARDA, premendo il bottone vero e aprendo il file che esce:
     1. NEUTRALITÀ — su un progetto senza valori per foro ogni riga porta
        esattamente i valori del progetto: chi non usa la novità non vede
        cambiare un byte (misurato anche fuori da qui, il 26/11: il file di
        HEAD e quello nuovo sullo stesso progetto sono identici, 873
        caratteri su 873);
     2. PER FORO — dati a due fori dei valori loro, cambiano QUELLE righe e
        QUELLE colonne, e nient'altro;
     3. LO ZERO DICHIARATO — un foro lasciato scarico esce «0», non la
        carica del progetto e non una cella vuota.
   ⚠️ COSA NON GUARDA, DICHIARATO: le colonne derivate della stessa riga
   (volume servito, consumo specifico) e i numeri della scheda (MIC, carica
   totale) leggono ancora il valore del progetto — è la fetta F2, e finché
   non c'è l'utente non ha nessun comando per dare a un foro un valore suo
   (F3 viene DOPO F2 per questo). Qui i valori si mettono dal ponte di debug. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8774;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE: il piano di carico torna a scrivere su ogni riga
   il valore del PROGETTO, ignorando quello del foro. È esattamente lo stato
   di prima: su un progetto senza valori per foro non si vede niente — ed è
   per questo che la prova di neutralità da sola non basterebbe. */
/* E DAL F2: la carica massima per ritardo torna a contare i fori invece di
   sommarne le cariche (lo scarto del foro dalla carica del progetto messo a
   zero). Ogni difetto dichiara il FILE in cui vive, e il server lo applica
   lì: un'iniezione sul bersaglio giusto che il banco non applica è una
   controprova spenta (CLAUDE.md, 05/09). */
const PAGINA = "apps/genesi/genesi.html", MODULO = "apps/genesi/genesi-data.js";
const DIFETTI = [
  [PAGINA, `prof:valoreDiForo(h,'prof',D2), prog:valoreDiForo(h,'kg',D2), borr:valoreDiForo(h,'stem',D2),`,
   `prof:valoreDiForo(null,'prof',D2), prog:valoreDiForo(null,'kg',D2), borr:valoreDiForo(null,'stem',D2),`],
  [MODULO, `const suo = valoreProprioDiForo(h, 'kg'); return suo === null ? 0 : suo - kg; });`,
   `return 0; });`],
  [MODULO, `if (suo !== null) s += suo - q; }`, `}`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && DIFETTI.some(([file]) => p.endsWith(file))) {
    let t = corpo.toString("utf8");
    for (const [file, a, b] of DIFETTI) { if (p.endsWith(file) && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-foro-per-foro-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-foro-per-foro-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

console.log(`\n════════ Genesi: il piano di carico foro per foro (F1)${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
/* i file che escono si raccolgono invece di scaricarli: `a.click()` su un
   link con `download` viene intercettato, e si tiene nome e contenuto */
await pg.addInitScript(() => {
  window.__usciti = [];
  const vero = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__usciti.push({ nome: this.download, href: this.href }); return; }
    return vero.call(this);
  };
});
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
const scadenza = Date.now() + 25000;
while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
await pg.waitForTimeout(300);
await pg.click('#bottomnav button[data-scr="design"]');
await pg.waitForTimeout(700);

/* preme il bottone vero e restituisce le righe del CSV uscito, per id del foro */
async function pianoDiCarico() {
  await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btn-piano-csv").click(); });
  await pg.waitForTimeout(900);
  const u = await pg.evaluate(() => window.__usciti);
  const f = u.find((x) => /piano_carico/.test(x.nome));
  if (!f) return null;
  const righe = decodeURIComponent(f.href.split(",").slice(1).join(",")).split(/\r?\n/).filter((r) => r.trim());
  const testa = righe[0].split(";");
  const col = (n) => testa.indexOf(n);
  const iId = col("id_foro"), iP = col("prof_m"), iK = col("carica_prog_kg"), iB = col("borraggio_prog_m");
  const perId = {};
  for (const r of righe.slice(1)) { const c = r.split(";"); perId[c[iId]] = { prof: c[iP], kg: c[iK], stem: c[iB], riga: r }; }
  return { testa, perId, n: righe.length - 1, colonneTrovate: [iId, iP, iK, iB].every((i) => i >= 0) };
}

const D2 = await pg.evaluate(() => { const d = window.__genesi.D2; return { kg: d.kg, prof: d.prof, stem: d.stem, n: d.holes.length, ids: d.holes.map((h) => h.id) }; });
dice(D2.n >= 6, `il progetto di partenza ha dei fori su cui lavorare (${D2.n})`, D2.n);

/* 1. NEUTRALITÀ */
const prima = await pianoDiCarico();
dice(!!prima && prima.colonneTrovate, "il piano di carico esce, con le colonne id_foro / prof_m / carica_prog_kg / borraggio_prog_m", prima && prima.testa);
if (prima && prima.colonneTrovate) {
  dice(prima.n === D2.n, `una riga per foro (${prima.n} righe, ${D2.n} fori)`, prima.n);
  const diversi = Object.entries(prima.perId).filter(([, v]) => +v.prof !== D2.prof || +v.kg !== D2.kg || +v.stem !== D2.stem);
  dice(diversi.length === 0, `⛔ NEUTRALITÀ: senza valori per foro, OGNI riga porta i valori del progetto (${D2.prof} m · ${D2.kg} kg · ${D2.stem} m)`, diversi.slice(0, 2).map(([k, v]) => k + ": " + v.riga));

  /* 2. PER FORO: due fori ricevono valori loro, dal ponte di debug (l'utente
     non ha ancora un comando per farlo: è F3) */
  const [a, bForo, c] = [D2.ids[1], D2.ids[2], D2.ids[4]];
  await pg.evaluate(([a, b]) => {
    const H = window.__genesi.D2.holes;
    const ha = H.find((h) => h.id === a), hb = H.find((h) => h.id === b);
    ha.kg = 35; ha.prof = 8.5;      // un foro più corto e meno carico
    hb.kg = 0;                      // un foro lasciato SCARICO
  }, [a, bForo]);
  const dopo = await pianoDiCarico();
  dice(!!dopo && dopo.n === D2.n, "dopo la modifica il piano esce ancora, con le stesse righe", dopo && dopo.n);
  if (dopo) {
    dice(+dopo.perId[a].kg === 35 && +dopo.perId[a].prof === 8.5,
      `⛔ il foro ${a} esce con la SUA carica e la SUA profondità (35 kg · 8,5 m — letto ${dopo.perId[a].kg} · ${dopo.perId[a].prof})`, dopo.perId[a].riga);
    dice(+dopo.perId[a].stem === D2.stem, `e col borraggio del progetto, che non gli è stato cambiato (${dopo.perId[a].stem})`, dopo.perId[a].riga);
    dice(dopo.perId[bForo].kg === "0",
      `⛔ il foro ${bForo}, lasciato scarico, esce «0»: non la carica del progetto e non una cella vuota (letto «${dopo.perId[bForo].kg}»)`, dopo.perId[bForo].riga);
    dice(+dopo.perId[bForo].prof === D2.prof, `e con la profondità del progetto (${dopo.perId[bForo].prof})`, dopo.perId[bForo].riga);
    const altri = Object.keys(dopo.perId).filter((k) => k !== a && k !== bForo && dopo.perId[k].riga !== prima.perId[k].riga);
    dice(altri.length === 0, `gli altri ${D2.n - 2} fori escono identici a prima: la modifica di due fori non tocca il resto`, altri);
    dice(dopo.perId[c].riga === prima.perId[c].riga, `(il foro ${c}, per nome: identico)`, dopo.perId[c].riga);
  }

  /* 3. F2 — LA CARICA MASSIMA PER RITARDO SEGUE LE CARICHE VERE. Si legge il
     numero che la scheda usa (`computeMIC`, dal ponte di debug) prima e dopo
     aver dato a UN foro una carica più alta di tutte le finestre. */
  const micDopoDue = await pg.evaluate(() => window.__genesi.mic);
  await pg.evaluate((c) => { window.__genesi.D2.holes.find((h) => h.id === c).kg = 500; }, c);
  const micCon500 = await pg.evaluate(() => window.__genesi.mic);
  await pg.evaluate((c) => { delete window.__genesi.D2.holes.find((h) => h.id === c).kg; }, c);
  const micTolto = await pg.evaluate(() => window.__genesi.mic);
  dice(Number.isFinite(micDopoDue) && micDopoDue > 0, `la carica massima per ritardo si calcola (${micDopoDue} kg)`, micDopoDue);
  dice(micCon500 >= 500 && micCon500 > micDopoDue,
    `⛔ dato a un foro 500 kg, la carica massima per ritardo sale ad almeno 500 (${micDopoDue} → ${micCon500}): la finestra somma le cariche vere`, micCon500);
  dice(micTolto === micDopoDue, `e tolta quella carica propria torna esattamente dov'era (${micTolto})`, micTolto);

  /* 4. F2 — LA CARICA TOTALE NELLA SCHEDA VOLATA (CSV) È QUELLA VERA. Si
     preme il bottone vero e si legge la riga «Carica totale (kg)»: a questo
     punto il progetto ha un foro a 35 kg e uno scarico (dal passo 2), cioè
     (35 − carica) + (0 − carica) chili in meno di «fori × carica». */
  const caricaTotaleScheda = async () => {
    await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btn-scheda-csv").click(); });
    await pg.waitForTimeout(700);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => /scheda_volata/.test(x.nome));
    if (!f) return null;
    const riga = decodeURIComponent(f.href.split(",").slice(1).join(",")).split(/\r?\n/).find((r) => /^"?Carica totale \(kg\)/.test(r));
    return riga ? +riga.split(";")[1] : null;
  };
  const totCon = await caricaTotaleScheda();
  const atteso = Math.round(D2.n * D2.kg + (35 - D2.kg) + (0 - D2.kg));
  dice(totCon === atteso,
    `⛔ scheda volata: la carica totale è quella VERA — ${D2.n} fori × ${D2.kg} kg, meno il foro a 35 e quello scarico = ${atteso} kg (letto ${totCon})`, totCon);
  /* e tolte le cariche proprie torna «fori × carica», cioè il numero di sempre */
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) { delete h.kg; delete h.prof; } });
  const totSenza = await caricaTotaleScheda();
  dice(totSenza === Math.round(D2.n * D2.kg), `e senza cariche proprie è ${D2.n} × ${D2.kg} = ${Math.round(D2.n * D2.kg)} kg, com'è sempre stato (letto ${totSenza})`, totSenza);

  /* 5. F2 — LE ALTRE DUE SUPERFICI CHE MOSTRANO LA CARICA TOTALE: la scheda
     dei costi nel Progetto («Esplosivo N kg · €») e il numero che parte per
     Sentinella. Devono dire lo STESSO numero della scheda volata: tre
     superfici, una carica. */
  const leggiDue = async () => {
    await pg.evaluate(() => window.__genesi.renderScheda2D());
    await pg.waitForTimeout(150);
    return pg.evaluate(() => {
      const t = document.getElementById("d2-scheda").innerText;
      const m = /Esplosivo\s*([\d.]+)\s*kg/.exec(t);
      return { scheda: m ? +m[1].replace(/\./g, "") : null, sentinella: window.__genesi.sentKgTotali };
    });
  };
  const base = await leggiDue();
  dice(base.scheda === Math.round(D2.n * D2.kg) && base.sentinella === D2.n * D2.kg,
    `senza cariche proprie: scheda dei costi ${base.scheda} kg e Sentinella ${base.sentinella} kg, cioè ${D2.n} × ${D2.kg}`, base);
  await pg.evaluate((a) => { window.__genesi.D2.holes.find((h) => h.id === a).kg = 100; }, a);
  const con = await leggiDue();
  const vero = D2.n * D2.kg + (100 - D2.kg);
  dice(con.scheda === Math.round(vero), `⛔ dato a un foro 100 kg, la scheda dei costi dice ${Math.round(vero)} kg (letto ${con.scheda})`, con);
  dice(con.sentinella === vero, `⛔ e a Sentinella parte lo stesso numero (${con.sentinella})`, con);
  const schedaCsv = await caricaTotaleScheda();
  dice(schedaCsv === Math.round(vero), `e la scheda volata in CSV pure (${schedaCsv}): tre superfici, una carica`, schedaCsv);
  await pg.evaluate((a) => { delete window.__genesi.D2.holes.find((h) => h.id === a).kg; }, a);
}
dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));

if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length,
    `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`, [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

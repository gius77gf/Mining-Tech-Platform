/* SCUDO · I DISEGNI CHE RAPPRESENTANO UNA QUANTITÀ
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-disegni.mjs [--porta=8571]
     node scudo-disegni.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08, nel core, è saltata fuori una forma di numero
   tranquillo che non era ancora censita: **il numero è giusto e a mentire è il
   DISEGNO**. La barra di luglio del grafico della produzione portava
   `style="height:100%"` e `data-val="2261.7 mc"` e veniva disegnata **3 px**,
   identica ai cinque mesi a zero. CSS valido, percentuale presente, zero
   errori in console: solo una misura in pixel lo diceva. Lo stesso giorno la
   stessa forma è uscita in Terra (una barra da 8,88 px su un anno senza
   rilievi), in Conti (una fattura da 12 € disegnata a zero px) e in
   Sentinella (la miniatura che contraddice il badge).

   In Scudo un disegno che mente costa più che altrove: qui le geometrie
   dicono **su quale adempimento sono scoperto** e **chi posso mandare a
   lavorare domani mattina**, e la pagina la legge chi deve decidere se
   mandare qualcuno sul fronte.

   ⛔ CHE COSA HA MISURATO IL CENSIMENTO, e va detto perché cambia il mestiere
   di questo banco: **Scudo non disegna niente di suo.** Su dodici tappe
   (Quadro, i quattro sottopannelli del Personale, Scadenze, Azioni,
   Ispezioni, checklist aperta, Documenti, Appalti, Permessi) i soggetti con
   una geometria sono **91**, e si dividono così:
     · **9 grafici**, tutti disegnati dal motore condiviso `shared/dw-grafici.js`;
     · 9 pastiglie di legenda (viewBox `0 0 22 11`), decorative e di misura fissa;
     · **73 stili in linea**, e sono tutti `flex: N N Npx` su campi di form —
       impaginazione, non rappresentazione di una quantità.
   Il Quadro, che è la schermata che si apre per prima, ha **zero** geometrie.
   Nel sorgente non c'è nessuna dimensione calcolata (`width:${…}`,
   `height:${…}`, `stroke-dasharray`, `conic-gradient`): l'unica interpolazione
   dentro un `style` è un `width:100%` su una tabella di stampa.
   Quindi qui non si cerca l'SVG scritto a mano — non ce n'è: si controlla che
   **quello che Scudo PASSA al motore** produca un disegno che dice la stessa
   cosa dei suoi numeri.

   LE QUATTRO DOMANDE, una per famiglia di difetto:
   P · il disegno è PROPORZIONALE al valore? E la prova non è un campione solo
       — un campione non distingue «funziona» da «sono tutti uguali»: si
       costruiscono valori in rapporto NOTO (24 : 6 : 1 : 0, 18 : 16 : 6 : 2,
       12 : 3 : 1) e si pretende che le lunghezze in PIXEL stiano nello stesso
       rapporto, letto sulla barra più lunga (dove l'arrotondamento pesa meno).
   Z · uno ZERO è disegnato zero? È la regola che `lunghezzaBarra` difende dal
       06/08: il minimo di visibilità serve a una quantità piccola ma VERA, e
       non deve essere preso in prestito da uno zero — che in questo
       ecosistema vuol dire quasi sempre «nessuno ha misurato».
   B · un anno NON CALCOLABILE resta un BUCO, e non diventa uno zero? È il
       punto in cui Scudo può sbagliare per conto suo, perché la decisione è
       sua: `serieDi` scrive `null` dove le ore lavorate non ci sono. Uno zero
       disegnato al posto del buco sarebbe **l'anno perfetto che nessuno ha
       misurato**, appoggiato sull'asse insieme agli zeri veri.
   D · due valori DIVERSI producono pixel diversi? È il difetto trovato in
       Conti (due importi diversi, pixel identici).

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, NON NEL DOCUMENTO: si aggiungono righe
   in coda alla risposta HTTP di `scudo-data.js`, cioè si passa dalla via vera
   (il modulo dati dell'app). Il file su disco non si tocca mai. Senza questo,
   il difetto NON SI PRESENTA: nella dimostrazione i valori dei grafici sono
   tutti 1 e 2, e con valori tutti uguali una scala storta si disegna identica
   a una giusta — è esattamente il motivo per cui, nel core, la barra da
   2.261 mc è rimasta a 3 px per mesi senza che nessuno la vedesse.

   ⚠️ E IL RIGHELLO SBAGLIA PIÙ SPESSO DEL PRODOTTO. Scrivendo questo banco
   la prima misura ha dato «tutte le barre orizzontali sono 0 × 0 px», che
   sembrava il difetto capostipite in persona: era la sonda, che cercava
   `graf-copertura` dentro `page-pers` mentre sta in `page-scad`, e leggeva un
   riquadro dentro un antenato `display:none` — dove `getBoundingClientRect`
   risponde zero a tutto. Da lì le due difese che questo file monta e stampa:
   si pretende di **aver navigato davvero** (quale `.page` è visibile) e che
   il **riquadro abbia una dimensione** prima di credere a un solo numero
   preso dentro di lui. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8571;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── I CASI ────────────────────────────────────────────────────────────────
   A · copertura formazione: quattro tipi in rapporto 24 : 6 : 1, più uno a
       ZERO (tutte le righe regolari) — la barra che non deve esistere.
   B · muro delle scadenze: l'arretrato scaduto e i mesi, con un mese a ZERO
       in mezzo a mesi pieni.
   C · near-miss per tipo e per luogo: 16 : 4 : 1 aggiunti alla dimostrazione,
       sopra MIN_TENDENZA così le classifiche si disegnano davvero.
   D · cause che si ripetono: 12 : 3 : 1 su 16 analisi (`leggibile`).
   E · indici IF/IG: ore = 1.000.000 all'anno, così IF È il numero di
       infortuni ed è esatto. 2022 → 2 · 2024 → 0 (zero VERO, le ore ci sono)
       · 2025 → 45,25 (dimostrazione) · 2021, 2023 e 2026 SENZA ORE → buchi.
       Il 2021 ha un infortunio e non ha le ore: è il caso peggiore, l'anno in
       cui è successo qualcosa e l'indice non si può calcolare.
   F · avanzamento della checklist: 100% · 50% · 4% (1 su 25) e la checklist
       SENZA NESSUNA VOCE — dove `percento` vale 0 perché non è calcolabile.
   G · mansioni: 7 : 3 : 1 persone da sistemare, con un requisito che non ha
       nessuno, più le mansioni della dimostrazione. */
const FIX = `
(function () {
  const OGGI = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const fraMesi = (n) => iso(new Date(OGGI.getFullYear(), OGGI.getMonth() + n, 15));
  const gg = (n) => iso(new Date(OGGI.getTime() - n * 86400000));
  const push = (n, f) => { for (let i = 0; i < n; i++) f(i); };

  // A · copertura formazione — 24 : 6 : 1 : 0
  push(24, (i) => DEMO.scadenze.push({ id: "gA24-" + i, lavoratoreId: "d1", tipo: "BANCO A24", descrizione: "x", dataScadenza: "2020-01-01" }));
  push(6,  (i) => DEMO.scadenze.push({ id: "gA06-" + i, lavoratoreId: "d1", tipo: "BANCO A06", descrizione: "x", dataScadenza: "2020-01-01" }));
  push(1,  (i) => DEMO.scadenze.push({ id: "gA01-" + i, lavoratoreId: "d1", tipo: "BANCO A01", descrizione: "x", dataScadenza: "2020-01-01" }));
  push(3,  (i) => DEMO.scadenze.push({ id: "gA00-" + i, lavoratoreId: "d1", tipo: "BANCO A00", descrizione: "x", dataScadenza: "2033-01-01" }));

  // B · muro delle scadenze — mesi +1 / +2 / +3, e il +4 resta a zero
  push(20, (i) => DEMO.scadenze.push({ id: "gB20-" + i, lavoratoreId: "d2", tipo: "BANCO B", descrizione: "x", dataScadenza: fraMesi(1) }));
  push(5,  (i) => DEMO.scadenze.push({ id: "gB05-" + i, lavoratoreId: "d2", tipo: "BANCO B", descrizione: "x", dataScadenza: fraMesi(2) }));
  push(1,  (i) => DEMO.scadenze.push({ id: "gB01-" + i, lavoratoreId: "d2", tipo: "BANCO B", descrizione: "x", dataScadenza: fraMesi(3) }));

  // C · near-miss — 16 : 4 : 1 dentro i 90 giorni
  const nm = (id, cat, luogoTipo, luogo) => DEMO.infortuni.push({
    id, data: gg(10), tipo: "near-miss", gravita: "lieve", giorniAssenza: 0,
    luogo, luogoTipo, categoria: cat, gravitaPotenziale: "lieve", descrizione: "banco" });
  push(16, (i) => nm("gC16-" + i, "caduta-massi", "fronte", "fronte banco"));
  push(4,  (i) => nm("gC04-" + i, "mezzi", "pista", "pista banco"));
  push(1,  (i) => nm("gC01-" + i, "impianto", "impianto", "impianto banco"));

  // D · cause — 12 : 3 : 1 su 16 analisi
  let na = 0;
  const an = (causa, n) => push(n, () => {
    na++;
    const eid = "gD-ev" + na;
    DEMO.infortuni.push({ id: eid, data: gg(40), tipo: "near-miss", gravita: "lieve", giorniAssenza: 0,
      luogo: "officina banco", luogoTipo: "officina", categoria: "impianto", gravitaPotenziale: "lieve", descrizione: "banco causa" });
    DEMO.analisi.push({ id: "gD-an" + na, eventoId: eid, perche: ["a", "b", "c"], causa, fatta: gg(39), daChi: "d3", azioniId: [] });
  });
  an("tecnica", 12); an("formazione", 3); an("ambientale", 1);

  // E · indici — un anno con eventi e SENZA ore (2021) resta un buco
  [[2022, 2]].forEach(([anno, quanti]) => {
    DEMO.oreAnno.push({ id: "gE-o" + anno, anno, ore: 1000000 });
    push(quanti, (i) => DEMO.infortuni.push({ id: "gE" + anno + "-" + i, data: anno + "-06-1" + (i % 9),
      tipo: "infortunio", gravita: "lieve", giorniAssenza: 10, luogo: "banco", luogoTipo: "officina",
      descrizione: "banco indice" }));
  });
  DEMO.infortuni.push({ id: "gE2021-0", data: "2021-06-11", tipo: "infortunio", gravita: "lieve",
    giorniAssenza: 10, luogo: "banco", luogoTipo: "officina", descrizione: "banco anno senza ore" });

  // F · avanzamento della checklist
  const voci = (n, p) => Array.from({ length: n }, (_, i) => ({ id: p + i, testo: "voce " + i }));
  const esiti = (quante, p) => { const o = {}; for (let i = 0; i < quante; i++) o[p + i] = { esito: "conforme" }; return o; };
  const isp = (id, nome, n, fatte) => DEMO.ispezioni.push({
    id, modello: "fronte", nome, ambito: "Fronti", riferimento: "banco",
    periodicitaGiorni: 30, data: iso(OGGI), cantiereId: "k1", responsabileId: "d3",
    voci: voci(n, id + "v"), esiti: esiti(fatte, id + "v"), stato: "in-corso" });
  isp("gF100", "BANCO F100 tutta fatta", 20, 20);
  isp("gF050", "BANCO F050 a meta", 20, 10);
  isp("gF004", "BANCO F004 appena cominciata", 25, 1);
  /* 19 su 20: serve al 95% ma soprattutto al SINGOLARE della testata — è la
     sola checklist in cui ne resta UNA sola, e senza di lei la frase «resta 1
     voce» non la esercita nessuno. */
  isp("gF095", "BANCO F095 quasi finita", 20, 19);
  isp("gF000", "BANCO F000 senza voci", 0, 0);

  // G · mansioni — 7 : 3 : 1 persone da sistemare (nessuno ha "gG-mai-fatto")
  DEMO.mansioni.push({ id: "gG7", nome: "BANCO G7", requisiti: ["gG-mai-fatto"], dpi: [], lavoratoriIds: ["d1","d2","d3","d4","d5","d6","d7"] });
  DEMO.mansioni.push({ id: "gG3", nome: "BANCO G3", requisiti: ["gG-mai-fatto"], dpi: [], lavoratoriIds: ["d1","d2","d3"] });
  DEMO.mansioni.push({ id: "gG1", nome: "BANCO G1", requisiti: ["gG-mai-fatto"], dpi: [], lavoratoriIds: ["d1"] });
})();
`;

/* I DIFETTI DA RIMETTERE. Si CONTANO: un `replace` che non trova niente esce
   in silenzio, e una controprova che non sostituisce niente non prova niente.
   Tre stanno nel MOTORE e uno in SCUDO: il motore è il posto dove la
   proporzione e lo zero si decidono, Scudo è il posto dove si decide che cosa
   è un buco. Un banco che sapesse cadere solo sul motore non direbbe niente
   sull'app di cui porta il nome. */
const DIFETTI = [
  /* 1 · lo ZERO si riprende il minimo di visibilità: è esattamente lo stato in
        cui il motore era fino al 06/08. Deve far cadere Z su tutte le barre. */
  ["shared/dw-grafici.js",
   "function lunghezzaBarra(px, minimo) { return px <= 0 ? 0 : Math.max(minimo, px); }",
   "function lunghezzaBarra(px, minimo) { return Math.max(minimo, px); }"],
  /* 2 · la scala delle barre ORIZZONTALI non più lineare: il disegno resta
        «plausibile» e smette di essere proporzionale. Deve far cadere P su
        copertura, near-miss, cause e mansioni. */
  ["shared/dw-grafici.js",
   "      var pxv = function (v) { return box.x0 + (box.x1 - box.x0 - 46) * (v - sc.min) / (sc.max - sc.min); };",
   "      var pxv = function (v) { return box.x0 + (box.x1 - box.x0 - 46) * Math.sqrt(Math.max(0, (v - sc.min) / (sc.max - sc.min))); };"],
  /* 3 · la stessa cosa sulle barre VERTICALI. Deve far cadere P sul muro. */
  ["shared/dw-grafici.js",
   "      var pyv = function (v) { return box.y1 - (box.y1 - box.y0) * (v - sc.min) / (sc.max - sc.min); };",
   "      var pyv = function (v) { return box.y1 - (box.y1 - box.y0) * Math.sqrt(Math.max(0, (v - sc.min) / (sc.max - sc.min))); };"],
  /* 4 · IL DIFETTO DI SCUDO: l'anno senza ore lavorate smette di essere un
        buco e diventa uno zero, cioè l'anno perfetto che nessuno ha misurato,
        appoggiato sull'asse accanto agli zeri veri. Deve far cadere B. */
  ["apps/scudo/index.html",
   "const serieDi = (k) => an.anni.map(r => (r.calcolabile ? r[k] : null));",
   "const serieDi = (k) => an.anni.map(r => (r.calcolabile ? r[k] : 0));"],
  /* 5 e 6 · il numero scritto accanto alla geometria, che fa parte della
        geometria: si rimette il plurale sbagliato di prima. */
  ["apps/scudo/index.html",
   'meta: r.fatte + (r.fatte === 1 ? " voce su " : " voci su ") + r.totale,',
   'meta: r.fatte + " voci su " + r.totale,'],
  ["apps/scudo/index.html",
   ": ` — ${r.daFare === 1 ? \"resta <b>1</b> voce\" : `restano <b>${r.daFare}</b> voci`} su ${r.totale}.`)",
   ": ` — restano <b>${r.daFare}</b> voci su ${r.totale}.`)"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  const rel = p.slice(R.length + 1);
  if (CONTROPROVA) {
    let t = null;
    for (const [file, a, b] of DIFETTI) {
      if (rel !== file) continue;
      t = t === null ? corpo.toString("utf8") : t;
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    if (t !== null) corpo = Buffer.from(t, "utf8");
  }
  if (rel === "apps/scudo/scudo-data.js") corpo = Buffer.from(corpo.toString("utf8") + FIX, "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__scudo-disegni-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-disegni-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

/* La controprova si controlla in DUE tempi: sul file PRIMA di partire (ogni
   testo cercato deve esistere una volta sola) e dopo che il browser ha
   caricato la pagina (quel testo deve essere stato davvero sostituito). */
if (CONTROPROVA) {
  for (const [file, a] of DIFETTI) {
    const n = readFileSync(join(R, file), "utf8").split(a).length - 1;
    if (n !== 1) {
      console.error(`✗ controprova: in ${file} il testo da sostituire compare ${n} volte invece di 1.\n  ${a.slice(0, 90)}…`);
      process.exit(2);
    }
  }
  console.log(`(controprova: ${DIFETTI.length} testi da sostituire, tutti trovati una volta sola)`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, misurate = 0, geometrie = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${String(x).slice(0, 400)}` : ""}`); }
};
/* ⚠️ LA TOLLERANZA VA MESSA SULLA POSIZIONE, NON SUL RAPPORTO. Il motore
   arrotonda le coordinate del percorso a un decimo di unità del viewBox: un
   errore fisso di 0,05 unità pesa lo 0,03% sulla barra più lunga e il 3% su
   una da 2 px, quindi una tolleranza RELATIVA sarebbe insieme lasca in cima e
   stretta in fondo. Si confronta la lunghezza attesa in pixel con quella
   misurata, con un margine ASSOLUTO: tre decimi di pixel coprono
   l'arrotondamento del percorso e lo scaling del viewBox, e non coprono
   nessun difetto vero (le iniezioni della controprova spostano le barre di
   decine di pixel). */
const PELO = 0.3;   // px
const vicino = (m, a, tol = PELO) => Math.abs(m - a) <= tol;

/* Il numero scritto sull'etichetta, in italiano. ⚠️ Non si riusa il lettore
   dei numeri dell'app su un valore preso dal DOM senza sapere che cosa c'è
   dentro: qui l'etichetta può portare l'unità appesa («45,25 per milione di
   ore»), e un lettore ingenuo la mangerebbe. Si toglie prima tutto ciò che
   non è cifra, punto, virgola o segno; poi il punto è il separatore delle
   migliaia SOLO se è seguito da tre cifre. */
function numEtichetta(t) {
  const s = String(t || "").replace(/[^\d.,-]/g, "").trim();
  if (!s) return NaN;
  const senzaMigliaia = s.replace(/\.(?=\d{3}(\D|$))/g, "");
  return Number(senzaMigliaia.replace(",", "."));
}

const pg = await b.newPage({ viewport: { width: 430, height: 1100 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html`);
await pg.waitForTimeout(2800);

console.log(`\n════════ Scudo · i disegni che rappresentano una quantità${CONTROPROVA ? " · controprova" : ""} ════════`);
dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
if (CONTROPROVA && colpiti.size !== DIFETTI.length) {
  console.error(`✗ controprova: il browser ha caricato ${colpiti.size} difetti su ${DIFETTI.length}.`);
  await b.close(); srv.close(); process.exit(2);
}

/* ⚠️ SI PRETENDE DI AVER NAVIGATO DAVVERO, e poi che il riquadro esista e
   abbia una dimensione: `getBoundingClientRect` dentro un antenato
   `display:none` risponde zero a tutto, ed è così che la prima stesura di
   questo banco ha creduto per mezz'ora che ogni barra orizzontale di Scudo
   fosse alta e larga zero. */
async function vaiA(nav, pagina, tab) {
  await pg.click("#" + nav); await pg.waitForTimeout(700);
  if (tab) { await pg.click(`#pers-tabs [data-tab="${tab}"]`); await pg.waitForTimeout(600); }
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.join(",") === pagina, `navigato davvero in ${pagina}${tab ? " · " + tab : ""}`, viste.join(",") || "nessuna pagina visibile");
}

/* Legge un grafico a BARRE: per ogni barra la lunghezza in pixel e il numero
   che il motore le scrive accanto — cioè quello che l'utente legge. */
async function barreDi(id, oriz) {
  await pg.$eval("#" + id, (e) => e.scrollIntoView({ block: "center" })).catch(() => {});
  await pg.waitForTimeout(250);
  return pg.evaluate(([k, o]) => {
    const box = document.getElementById(k);
    if (!box) return { errore: "nessun riquadro #" + k };
    const rb = box.getBoundingClientRect();
    if (rb.width <= 0 || rb.height <= 0) return { errore: `il riquadro #${k} misura ${rb.width}×${rb.height}: non è disegnato o è dentro un display:none` };
    const svg = box.querySelector("svg");
    if (!svg) return { senzaGrafico: true, testo: box.textContent.replace(/\s+/g, " ").trim().slice(0, 200) };
    const barre = [...svg.querySelectorAll("path.dwg-barra")];
    const lab = [...svg.querySelectorAll("text.dwg-vallab")];
    return {
      riquadro: { w: +rb.width.toFixed(1), h: +rb.height.toFixed(1) },
      barre: barre.map((n, i) => {
        const r = n.getBoundingClientRect();
        return { px: +(o ? r.width : r.height).toFixed(2), etichetta: (lab[i] || {}).textContent || "",
          stato: (n.getAttribute("class") || "").replace("dwg-barra ", "") };
      }),
      quanteEtichette: lab.length,
      nota: (box.querySelector(".dwg-nota") || { textContent: "" }).textContent.replace(/\s+/g, " ").slice(0, 220),
    };
  }, [id, !!oriz]);
}

/* P + Z + D su un grafico a barre. Il campione si stampa SEMPRE: un
   «nessuna violazione» senza i numeri accanto non si può controllare. */
function giudicaBarre(nome, g, attesi) {
  if (g.errore || g.senzaGrafico) { dice(false, `${nome}: il grafico è disegnato`, g.errore || g.testo); return; }
  geometrie++;
  dice(g.barre.length === g.quanteEtichette,
    `${nome}: ogni barra ha il suo numero scritto accanto (${g.barre.length} barre, ${g.quanteEtichette} etichette)`,
    "senza l'accoppiamento uno a uno non so quale numero appartiene a quale barra");
  if (g.barre.length !== g.quanteEtichette) return;

  const d = g.barre.map((x) => ({ v: numEtichetta(x.etichetta), px: x.px, st: x.stato }));
  dice(d.every((x) => Number.isFinite(x.v)), `${nome}: tutti i numeri accanto alle barre sono leggibili`,
    JSON.stringify(g.barre.map((x) => x.etichetta)));
  if (!d.every((x) => Number.isFinite(x.v))) return;

  const letti = d.map((x) => x.v).join(" · ");
  dice(attesi.join(" · ") === letti, `${nome}: il caso costruito è arrivato a schermo (${letti})`,
    `attesi ${attesi.join(" · ")} — se non tornano, è il CASO a non essersi presentato, non il disegno a essere sbagliato`);

  const rif = d.reduce((a, x) => (x.v > a.v ? x : a));
  const pxPer = rif.v > 0 ? rif.px / rif.v : 0;
  misurate += d.length;
  console.log(`      campione: ${d.map((x) => `${x.v} → ${x.px} px`).join(" · ")}`
    + `   (riquadro ${g.riquadro.w}×${g.riquadro.h} · scala ${+pxPer.toFixed(4)} px per unità)`);

  // Z · uno zero si disegna zero, e non prende in prestito il minimo
  for (const x of d.filter((y) => y.v === 0)) {
    dice(x.px === 0, `${nome} · Z: il valore 0 è disegnato 0 px (${x.px} px)`,
      "un minimo di visibilità preso in prestito da uno zero dice «un po'» dove la verità è «niente»");
  }
  // P · la proporzione, letta sulla barra più lunga
  for (const x of d) {
    if (x === rif || x.v === 0) continue;
    const atteso = x.v * pxPer;
    dice(vicino(x.px, atteso), `${nome} · P: ${x.v} è disegnato ${x.px} px, e ne servivano ${+atteso.toFixed(2)}`,
      `scarto ${+(x.px - atteso).toFixed(2)} px su una scala di ${+pxPer.toFixed(4)} px per unità`);
  }
  /* D · due valori diversi non fanno pixel identici.
     ⛔ E LA RIGA CHE DICE «NON HO GUARDATO» VA STAMPATA, NON SALTATA. Sotto il
     minimo di visibilità del motore (`lunghezzaBarra(px, 2)`) questa domanda
     non si può fare: due conteggi diversi escono tutti e due alla lunghezza
     minima, ed è voluto — il minimo serve perché una quantità piccola ma VERA
     resti visibile e toccabile. Ma «voluto» non vuol dire «invisibile»: se le
     coppie appiattite ci sono, il banco le conta e le nomina, se no un
     «nessuna violazione» starebbe sopra una domanda mai fatta.
     Misurato il 06/08 sul muro delle scadenze con un arretrato di 602 righe —
     che è il caso normale di una cava che carica il suo archivio: i mesi da
     2, 3, 5 e 10 scadenze uscivano TUTTI E QUATTRO a 1,85 px. Il difetto è la
     versione grafica di quello trovato in Conti (due importi diversi, pixel
     identici) e sta in `shared/dw-grafici.js`, non in Scudo: dichiarato qui,
     lasciato lì. */
  const MIN = 2;
  const coppie = [], sottoIlMinimo = [];
  for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) {
    if (d[i].v === d[j].v || d[i].px !== d[j].px) continue;
    (d[i].px > MIN ? coppie : sottoIlMinimo).push(`${d[i].v} e ${d[j].v} → ${d[i].px} px`);
  }
  dice(coppie.length === 0, `${nome} · D: due valori diversi non hanno gli stessi pixel`, coppie.join(" · "));
  if (sottoIlMinimo.length) {
    console.log(`      ⚠️ ${nome}: ${sottoIlMinimo.length} coppie di valori DIVERSI escono con gli stessi pixel perché`
      + ` stanno sotto il minimo di visibilità del motore (${sottoIlMinimo.join(" · ")}).`
      + " Non è un KO — il minimo è una decisione dichiarata di shared/dw-grafici.js — ma è una domanda che qui non si può fare.");
  }
}

/* ══ SCADENZE · copertura della formazione e muro delle scadenze ══════════ */
await vaiA("nav-scad", "page-scad");
console.log("\n· A — copertura della formazione per tipo (barre orizzontali)");
giudicaBarre("copertura", await barreDi("graf-copertura", true), [24, 6, 1, 1, 1, 1, 1, 1, 0, 0]);
console.log("\n· B — il muro delle scadenze (barre verticali, un mese a zero)");
giudicaBarre("muro", await barreDi("graf-muro", false), [33, 2, 21, 5, 1, 0, 1]);

/* ══ PERSONALE · chi posso mandare ════════════════════════════════════════ */
await vaiA("nav-pers", "page-pers", "mans");
console.log("\n· G — persone da sistemare per mansione (barre orizzontali)");
giudicaBarre("mansioni", await barreDi("graf-mansioni", true), [7, 3, 1, 1, 1, 1, 1, 0]);

/* ══ REGISTRO · near-miss e cause ═════════════════════════════════════════ */
await vaiA("nav-doc", "page-doc");
console.log("\n· C — near-miss per tipo e per luogo (le due classifiche)");
giudicaBarre("near-miss per tipo", await barreDi("graf-nm-tipo", true), [18, 18, 6]);
giudicaBarre("near-miss per luogo", await barreDi("graf-nm-luogo", true), [18, 16, 6, 2]);
console.log("\n· D — cause che si ripetono");
giudicaBarre("cause", await barreDi("graf-cause", true), [12, 3, 1, 1, 1]);

/* ══ E · GLI INDICI: il buco non è uno zero ═══════════════════════════════
   Qui la domanda non è «quanto è lungo» ma «c'è o non c'è». Un anno senza le
   ore lavorate non ha un indice: la linea si deve INTERROMPERE. Uno zero
   disegnato al suo posto si appoggia sull'asse esattamente come lo zero VERO
   del 2024 — stessa altezza, stesso pallino — e da lì i due non si
   distinguono più: è il principio del fondatore portato nella geometria. */
console.log("\n· E — indici IF/IG: gli anni senza ore restano BUCHI, non zeri");
for (const id of ["graf-if", "graf-ig"]) {
  await pg.$eval("#" + id, (e) => e.scrollIntoView({ block: "center" })).catch(() => {});
  await pg.waitForTimeout(250);
  const g = await pg.evaluate((k) => {
    const box = document.getElementById(k);
    const rb = box.getBoundingClientRect();
    if (rb.width <= 0 || rb.height <= 0) return { errore: `riquadro ${rb.width}×${rb.height}` };
    const svg = box.querySelector("svg");
    if (!svg) return { errore: "nessun svg: " + box.textContent.replace(/\s+/g, " ").slice(0, 120) };
    const cy = (n) => { const r = n.getBoundingClientRect(); return +(r.y + r.height / 2).toFixed(2); };
    const assi = [...svg.querySelectorAll("line.dwg-ax")].map(cy).sort((a, c) => c - a);
    return {
      riquadro: { w: +rb.width.toFixed(1), h: +rb.height.toFixed(1) },
      zero: assi[0],
      // la tabella accessibile del motore: la VERITÀ dichiarata, anno per anno
      righe: [...box.querySelectorAll("table tr")].slice(1).map((r) => [...r.children].map((c) => c.textContent.trim())),
      punti: [...svg.querySelectorAll("circle.dwg-pt, circle.dwg-fine")]
        .filter((n) => (n.getAttribute("class") || "").includes("s1"))
        .map((n) => ({ cx: +(+n.getAttribute("cx")).toFixed(1), cy: cy(n) })),
      linea: (svg.querySelector("path.dwg-linea") || {}).getAttribute
        ? svg.querySelector("path.dwg-linea").getAttribute("d") : "",
      area: (() => { const a = svg.querySelector("path.dwg-area"); return a ? a.getAttribute("d") : null; })(),
    };
  }, id);
  if (g.errore) { dice(false, `${id}: il grafico è disegnato`, g.errore); continue; }
  geometrie++;
  const vuoti = g.righe.filter((r) => r[1] === "—").map((r) => r[0]);
  const pieni = g.righe.filter((r) => r[1] !== "—").map((r) => `${r[0]}=${r[1]}`);
  console.log(`      campione: ${g.righe.length} anni · dichiarati NON calcolabili ${vuoti.join(", ") || "nessuno"}`
    + ` · calcolabili ${pieni.join(", ")} · ${g.punti.length} punti disegnati · zero a ${g.zero} px`);
  misurate += g.righe.length;
  dice(vuoti.length >= 2, `${id}: il caso è arrivato a schermo (almeno due anni senza ore)`, vuoti.join(", "));
  dice(g.punti.length === g.righe.length - vuoti.length,
    `${id} · B: si disegna un punto SOLO per gli anni calcolabili (${g.punti.length} punti, ${g.righe.length - vuoti.length} anni con l'indice)`,
    "un punto in più vuol dire che un anno senza ore è stato disegnato come uno zero: l'anno perfetto che nessuno ha misurato");
  // la linea deve avere almeno un'interruzione: due `M` nel percorso
  const spezzoni = (g.linea.match(/M/g) || []).length;
  dice(spezzoni >= 2, `${id} · B: la linea si INTERROMPE sui buchi (${spezzoni} spezzoni nel percorso)`,
    `percorso: ${g.linea.slice(0, 120)}`);
  // l'area non deve scavalcare un buco: deve stare dentro gli anni contigui misurati
  if (g.area) {
    const largo = Math.max(...g.punti.map((p) => p.cx)) - Math.min(...g.punti.map((p) => p.cx));
    const areaX = [...g.area.matchAll(/[ML]\s*([\d.]+)/g)].map((m) => +m[1]);
    const areaLargo = Math.max(...areaX) - Math.min(...areaX);
    dice(areaLargo <= largo + 1, `${id} · B: l'area sotto la linea non scavalca i buchi (${+areaLargo.toFixed(1)} px su ${+largo.toFixed(1)})`,
      "un'area che copre un anno senza ore riempie di colore un valore che nessuno ha misurato");
  }
}

/* ══ F · L'AVANZAMENTO DELLA CHECKLIST ════════════════════════════════════ */
console.log("\n· F — avanzamento della checklist: la barra contro la sua pista");
await vaiA("nav-isp", "page-isp");
const AVANZ = [["gF100", 100], ["gF095", 95], ["gF050", 50], ["gF004", 4], ["gF000", 0]];
const misuraAvanz = [];
for (const [id, atteso] of AVANZ) {
  const el = await pg.$(`[data-isp-apri="${id}"]`);
  if (!el) { dice(false, `avanzamento: la checklist ${id} è apribile`, "nessun [data-isp-apri] con quell'id"); continue; }
  await el.click(); await pg.waitForTimeout(650);
  const m = await pg.evaluate(() => {
    const box = document.getElementById("isp-c-avanz");
    const rb = box.getBoundingClientRect();
    if (rb.width <= 0 || rb.height <= 0) return { errore: `riquadro ${rb.width}×${rb.height}` };
    const w = (s) => { const n = box.querySelector(s); return n ? +n.getBoundingClientRect().width.toFixed(2) : null; };
    return { pista: w("rect.dwg-track"), barra: w("rect.dwg-fill"),
      lab: (box.querySelector("text.dwg-vallab") || { textContent: "" }).textContent,
      meta: (box.querySelector(".dwg-meta") || { textContent: "" }).textContent.trim(),
      testa: (document.getElementById("isp-c-testa") || { textContent: "" }).textContent.replace(/\s+/g, " ").trim().slice(0, 160) };
  });
  if (m.errore) { dice(false, `avanzamento ${id}: il grafico è disegnato`, m.errore); continue; }
  geometrie++; misurate++;
  misuraAvanz.push({ id, atteso, ...m });
  await pg.click("#btn-isp-indietro").catch(() => {}); await pg.waitForTimeout(450);
}
for (const x of misuraAvanz) {
  const letto = numEtichetta(x.lab);
  console.log(`      ${x.id}: etichetta «${x.lab}» · barra ${x.barra} px su una pista di ${x.pista} px  (${x.meta})`);
  dice(letto === x.atteso, `avanzamento ${x.id}: a schermo c'è il caso costruito (${letto}%)`, `atteso ${x.atteso}%`);
  const atteso = x.pista * x.atteso / 100;
  dice(vicino(x.barra, atteso, 0.5), `avanzamento ${x.id} · P: ${x.atteso}% di ${x.pista} px fa ${+atteso.toFixed(2)} px, disegnati ${x.barra}`,
    `scarto ${+(x.barra - atteso).toFixed(2)} px`);
}
/* ⛔ LA CHECKLIST SENZA NESSUNA VOCE. `riepilogoIspezione` risponde
   `percento: totale ? … : 0`, cioè uno ZERO dove la verità è «non c'è niente
   da misurare» — la stessa forma che in Terra `avanzamentoLotto` produceva
   («0%» su un lotto senza rilievi, che suggerisce «non ancora cominciato»).
   Qui la GEOMETRIA però non mente: `lunghezzaBarra` disegna 0 px, che è
   l'unica cosa onesta da disegnare, e la riga sopra scrive «0 voci su 0».
   Il controllo che segue difende quello: se un giorno lo zero riprendesse il
   minimo di visibilità, questa checklist mostrerebbe una pillola piena. */
{
  const v = misuraAvanz.find((x) => x.id === "gF000");
  if (v) dice(v.barra === 0, "avanzamento · Z: la checklist SENZA VOCI disegna 0 px, non il minimo di visibilità",
    `${v.barra} px — e la riga sopra dice «${v.meta}»`);
}
/* ⚠️ IL NUMERO SCRITTO ACCANTO ALLA GEOMETRIA FA PARTE DELLA GEOMETRIA: è
   quello che si legge per capire quanto è lunga la barra. Misurando le quattro
   checklist è saltato fuori che la testata dell'ispezione aveva il singolare su
   due frasi e non sulle altre due — «1 voci su 25» e «restano 1 voci su 20» —
   mentre tutto il resto dell'app lo tratta con cura. Corretto il 06/08; questi
   due controlli tengono la correzione. */
{
  const uno = misuraAvanz.find((x) => x.id === "gF004");
  if (uno) dice(/\b1 voce su 25\b/.test(uno.meta), "avanzamento: «1 voce su 25», non «1 voci»", uno.meta);
  const quasi = misuraAvanz.find((x) => x.id === "gF095");
  if (quasi) dice(/resta\s+1\s+voce su 20/.test(quasi.testa.replace(/\s+/g, " ")),
    "testata dell'ispezione: «resta 1 voce su 20», non «restano 1 voci»", quasi.testa);
}

console.log(`\n──── ${geometrie} geometrie misurate · ${misurate} valori confrontati col loro disegno`
  + ` · ${ok} ok · ${ko} KO ────`);
console.log("(censimento: le geometrie di Scudo che rappresentano una quantità sono NOVE, tutte del motore"
  + " condiviso; nessun SVG scritto a mano, nessuna dimensione calcolata in uno style in linea)");
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(ko > 0 ? `\n✓ controprova: coi difetti rimessi il banco CADE (${ko} KO). Sa fallire.`
                     : "\n✗ controprova: coi difetti rimessi il banco NON cade. Non prova niente.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

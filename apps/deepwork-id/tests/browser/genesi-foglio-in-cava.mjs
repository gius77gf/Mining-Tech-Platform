/* IL FOGLIO CHE SI PORTA IN CAVA — Genesi, provato premendo il bottone
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-foglio-in-cava.mjs [--porta=8602]
     node genesi-foglio-in-cava.mjs --controprova   (rimette i difetti: DEVE fallire)
     node genesi-foglio-in-cava.mjs --scatti        (salva le schermate in /tmp)

   PERCHÉ ESISTE. `run-kpi` chiama il modulo; il FOGLIO lo compone la pagina,
   dentro l'`onclick` di `btn-report`, e lì non guardava nessuno — è il posto
   dove sono nati tutti e cinque i difetti che questo banco tiene chiusi. Il
   modo di trovarli non è stato leggere il codice: è stato premere il bottone
   e aprire il documento che esce.

   1. **IL FOGLIO NON DICEVA MAI CHE LA PPV SUPERA IL LIMITE.** Col recettore a
      60 m e la DIN sensibile, lo schermo scriveva «77,7 mm/s», pallino ROSSO,
      «Soglia 8 mm/s → SUPERA: riduci la MIC o allontana il recettore»; il
      foglio stampava «PPV al recettore (60 m) 77,7 mm/s (limite 8,0, DIN
      sensibile/storico)» e passava alla riga dopo, nella stessa tipografia
      piatta di tutte le altre. Il confronto lo doveva fare il lettore.
   2. **L'AIRBLAST NON C'ERA PROPRIO.** Nello stesso caso: 143 dB(L), dieci
      sopra il limite USBM/OSM di 133, e nel documento che si archivia col
      rapportino non compariva da nessuna parte.
   3. **IL FOGLIO NON DICEVA DA DOVE VENGONO K E β.** Accendendo la legge di
      sito su TRE referti — che `sitoFit` dichiara provvisoria — la stessa
      identica volata stampava «2,8 mm/s» invece di «6,4»: il numero più che
      dimezzato, e la frase IDENTICA. La bandiera `pochi` il 03/08 era stata
      collegata alla scheda validatori e al riquadro «Manda a Sentinella»; il
      foglio stampato non era in quell'elenco.
   4. **IL LIMITE «—» SENZA LA RAGIONE.** Con una normativa che Genesi non
      riconosce il foglio scriveva «(limite —, uni-9916)» e basta, mentre lo
      schermo diceva «Non si può dire se è sotto soglia» e come rimediare.
   5. **IL CONFRONTO A/B REGALAVA IL VERDE.** Salvando DUE VOLTE lo stesso
      progetto e accendendo la legge di sito fra i due scatti: dieci righe su
      undici identiche, **quattro celle verdi su quattro pareggi** («A<=B»
      risponde 'A' anche a parità), più la PPV data vinta a B — cioè un cambio
      di CALIBRAZIONE raccontato come un progetto migliore.

   ⛔ I CASI SI COSTRUISCONO NEI DATI, non nel file su disco: la volata e la
   legge di sito entrano da `localStorage`, dalla via vera (`genesiVolate`,
   `genesiSito`), le stesse chiavi che l'app scrive da sé. Accanto ci sono
   cantieri che scrivono.

   ⚠️ GENESI NON HA `.page`: la navigazione è `setScreen`, che mette
   `scr-<nome>` sul `body`. La prova di aver navigato si legge lì.
   ⚠️ E il documento non è un file: esce da `window.open` + `document.write`.
   Si intercetta la finestra, come fa `conti-stampe.mjs` con le sue stampe. */
import { larghezzaCarta } from "./giro.mjs";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const CARTELLA_SCATTI = "/tmp/genesi-foglio";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8602;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE NELLA PAGINA SERVITA, uno per riga. Si contano i
   difetti CENTRATI, non le sostituzioni: la pagina si carica più volte e un
   conto crescente direbbe «15 su 5». Quello che serve sapere è se OGNI difetto
   ha trovato il suo pezzo — un `replace` che non trova niente esce in silenzio. */
const DIFETTI = [
  // 1 e 4 · la riga della PPV com'era: numero, limite, norma, e via
  [`gfix(k.ppv,1)+' mm/s (limite '+gfix(k.lim,1)+', '+esc(normL)+')<br>'
        + (_rEp.confrontabile
            ? '<b>'+esc(_rEp.verdetto)+'</b>'+(_rEp.consiglio?' — '+esc(_rEp.consiglio):'')
            : '<b>Non si può dire se è sotto soglia</b>'
              + (_rPerche?' — '+esc(_rPerche.che)+'. '+esc(_rPerche.come):''))`,
   `gfix(k.ppv,1)+' mm/s (limite '+gfix(k.lim,1)+', '+esc(normL)+')'`],
  // 2 · la riga dell'airblast, che nel foglio non c'era
  [`      ['Airblast (sovrappressione) a '+gnum(D2.recDist,0)+' m',
        gnum(_rDb,0)+' dB(L)<br><b>'+esc(_rEa.verdetto)+'</b>'+(_rEa.consiglio?' — '+esc(_rEa.consiglio):'')],\n`, ""],
  // 3 · la base della previsione, che il foglio non dichiarava
  /* ⛔ RIPUNTATA L'08/08. Cercava la riga com'era scritta **per esteso** dentro
     il report; nel frattempo quel corpo è diventato una funzione,
     `_ppvBaseHtml`, perché lo usano in due. L'iniezione non trovava più il suo
     pezzo, il foglio restava sano, e il banco «non distingueva»: la terza delle
     cinque cause, quella in cui non si tocca né la prova né il codice, si
     guarda l'iniezione.
     Il difetto rimesso è lo stesso di prima — la **base della previsione** che
     sparisce dal foglio che si porta in cava — solo tolta dove sta adesso. */
  [`      ['Base della previsione PPV', _ppvBaseHtml(_rPv)],\n`, ""],
  // 5a · il verde regalato ai pareggi e a chi non è confrontabile
  /* ⏱️ ANCORA ACCORCIATA il 09/08, ed è la terza volta in un giorno che questa
     famiglia si presenta: un'iniezione che cita il codice TESTUALMENTE scade
     quando il codice si muove — e si muove quasi sempre perché **migliora**.
     Qui `gnum(A.kpi.x50,1)+' cm'` è diventato `_cmpCm(A.kpi,'x50')`, che sa
     scrivere «non calcolabile» quando la frammentazione non si può calcolare:
     `iniezioni-fresche` è caduta a 308 su 309 **nello stesso commit che
     costruiva la difesa**, che è precisamente il caso per cui quel controllo
     esiste.
     Adesso l'ancora è **solo il pezzo che il difetto deve toccare** —
     `vincitoreKpi(A.kpi.x50,B.kpi.x50)`, unico nella pagina (verificato:
     `grep -c` → 1). Il difetto rimesso è identico: il vincitore deciso col
     confronto ingenuo, che regala il verde ai pareggi e a chi non è
     confrontabile. Meno codice citato, meno superficie che può marcire. */
  ["vincitoreKpi(A.kpi.x50,B.kpi.x50)",
   "(A.kpi.x50<=B.kpi.x50?'A':'B')"],
  ["      _stessaBase ? vincitoreKpi(A.kpi.ppv,B.kpi.ppv) : null],",
   "      A.kpi.ppv<=B.kpi.ppv?'A':'B'],"],
  // 5b · e la riga che dichiara la base nel confronto
  ["    ['↳ base della previsione', _baseTx(A), _baseTx(B), null],\n", ""],
  /* 6 · IL FOGLIO PIÙ LARGO DELLA CARTA. Sullo schermo non si vede niente — il
     documento vive in un popup e nasce solo quando lo si stampa — e dalla
     stampante esce tagliato sul bordo destro.
     ⚠️ E l'iniezione dice anche quanto è STRETTO il margine vero: il foglio è
     disegnato per **720 px** e su A4 coi margini del browser ce ne sono
     **718**. Ci sta perché `max-width` è un tetto e non un pavimento — il
     corpo si adatta — ma di headroom non ce n'è: basta un `min-width` al posto
     suo perché esca. */
  ["max-width:720px;margin:24px auto", "min-width:1000px;margin:24px auto"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-foglio-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-foglio-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
if (SCATTI) mkdirSync(CARTELLA_SCATTI, { recursive: true });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

/* Apre Genesi, passa il login e il cancello di consenso, e intercetta i due modi
   in cui un documento esce: il salvataggio del file e la finestra di stampa. */
async function apri(preludio, arg) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  if (preludio) await pg.addInitScript(preludio, arg);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await ganci(pg);
  pg.__errori = errori;
  return pg;
}
/* i ganci del banco sulla pagina (consenso, finestra di stampa, il CSV che
   esce): vivono nella pagina, quindi una RICARICA li perde e vanno rimessi */
async function ganci(pg) {
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
    window.__csv = null; window.__doc = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close() {} }, focus() {}, print() {} });
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
  await pg.waitForTimeout(600);
}
async function vaiA(pg, schermo) {
  await pg.evaluate((s) => {
    const x = [...document.querySelectorAll("#bottomnav button")].find((y) => y.dataset.scr === s);
    if (x) x.click();
  }, schermo);
  await pg.waitForTimeout(1200);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-" + schermo), `navigato davvero (→ ${schermo})`, cls);
}
/* il foglio come lo legge una persona: via i tag, una riga per `<tr>` */
const foglio = (pg) => pg.evaluate(() => String(window.__doc || ""))
  .then((d) => d.replace(/<style>[\s\S]*?<\/style>/g, "").replace(/<\/tr>/g, "\n")
    .replace(/<br\s*\/?>/g, " · ").replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'").replace(/&[a-z]+;/g, " ").replace(/[ \t]+/g, " "));
const rigaFoglio = (t, re) => (t.split("\n").find((r) => re.test(r)) || "").trim();

/* ⛔ E IL FOGLIO CI DEVE STARE NELLA CARTA. Fino all'09/08 questo banco leggeva
   il documento come TESTO e non ne guardava mai le dimensioni: un difetto di
   larghezza qui non esce dallo schermo, esce dalla stampante — cioè nel posto
   dove nessuno lo rivede prima di portarlo in cava. Era l'ultima superficie che
   stampa senza questa misura (le altre: `stampe-fs` per quattro,
   `campo-foglio-turno` per Campo, `scudo-documenti` per i due fogli di Scudo).
   ⚠️ IL DENOMINATORE È DICHIARATO, e qui è più debole che altrove: il
   documento di Genesi **non porta nessuna regola `@page`** — l'ho cercata e non
   c'è — quindi la carta non si può leggere dal foglio come si fa in Scudo, e si
   ripiega su A4 con i margini che il browser mette di suo (210 mm − 2×10 mm =
   190 mm = 718 px CSS). Il ripiego è scritto invece che nascosto: se un giorno
   Genesi dichiarasse la sua carta, questa misura andrebbe letta da lì.
   ⚠️ E il soggetto può non essere un elemento: il traboccamento del core a
   320 px era un NODO DI TESTO in una scatola anonima, che `querySelectorAll`
   non vede. Si cammina anche coi nodi di testo, con un `Range`. */
/* ⛔ IL CONTO STA IN `giro.mjs`: il 09/08 questa decisione è nata anche in
   `scudo-documenti`, e due copie della stessa regola divergono senza che
   nessuno lo veda. Qui i ripieghi si DICHIARANO — 10 mm è il margine di serie
   del browser, non una regola di questo documento. */
const { px: CARTA_PX } = larghezzaCarta(null, { mm: 210, bordoMm: 10 });
async function larghezzaFoglio(b, pg, chi) {
  const html = await pg.evaluate(() => String(window.__doc || ""));
  if (!html) return dice(false, `⛔ ${chi}: c'è un documento da misurare`, "(vuoto)");
  const senzaPage = !/@page\b/.test(html);
  const p2 = await b.newPage({ viewport: { width: CARTA_PX, height: 1200 } });
  await p2.setContent(html, { waitUntil: "load" });
  await p2.waitForTimeout(250);
  const m = await p2.evaluate(() => {
    const doc = document.documentElement.scrollWidth, win = window.innerWidth;
    const sporgenti = [...document.body.querySelectorAll("*")]
      .map((el) => ({ tag: el.tagName, sw: el.scrollWidth, r: Math.round(el.getBoundingClientRect().right) }))
      .filter((e) => e.r > win + 1 || e.sw > win + 1).slice(0, 4);
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const rg = document.createRange();
    let peggio = null, n;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue.trim()) continue;
      rg.selectNodeContents(n);
      const b2 = rg.getBoundingClientRect();
      if (!peggio || b2.right > peggio.destra) peggio = { destra: Math.round(b2.right), testo: n.nodeValue.trim().slice(0, 50) };
    }
    return { doc, win, sporgenti, testoPiuADestra: peggio };
  });
  await p2.close();
  console.log(`     carta: ${senzaPage ? "⚠️ il documento NON dichiara @page, ripiego su A4 coi margini del browser" : "@page dichiarata dal documento"}`
    + ` → ${CARTA_PX} px CSS di contenuto`);
  dice(m.doc <= m.win + 1 && m.sporgenti.length === 0
       && (!m.testoPiuADestra || m.testoPiuADestra.destra <= m.win + 1),
    `⛔ ${chi}: ci sta nella larghezza della carta (${CARTA_PX} px CSS)`, m);
}

const BASE = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, sequenza: "diagonale", perRow: 12, file: 1 };
const VOLATA = (design) => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Fronte Nord 12/07",
    data: "2026-07-12", sintesi: "12 fori", design }]));
};
const SITO_TRE = { usa: true, punti: [
  { d: 120, w: 50, ppv: 9.2, fonte: "mano", ts: "2026-06-02", nome: "A" },
  { d: 260, w: 55, ppv: 3.1, fonte: "csv", ts: "2026-06-14", nome: "B" },
  { d: 430, w: 48, ppv: 1.4, fonte: "sentinella", ts: "2026-06-30", nome: "C" }] };
async function apriVolata(pg) {
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="vX"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1500);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-design"), "la volata salvata si apre davvero nel 2D", cls);
}

console.log(`\n════════ il foglio che si porta in cava${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 e 2 · LA PPV CHE SUPERA, E L'AIRBLAST CHE NON C'ERA ─────────────────
console.log("\n· recettore a 60 m, DIN sensibile: sullo schermo è rosso e dice SUPERA");
{
  const pg = await apri(VOLATA, { ...BASE, recNorma: "din-sens", recFreq: 25, recDist: 60 });
  await apriVolata(pg);
  const schermo = await pg.evaluate(() => {
    const el = document.getElementById("d2-scheda");
    return [...el.querySelectorAll(".sv-row")].map((r) => ({
      lab: r.querySelector(".sv-lab").textContent.trim(),
      val: r.querySelector(".sv-val").innerText.trim(),
      why: r.querySelector(".sv-why").innerText.replace(/\s+/g, " "),
      cls: r.querySelector(".sv-dot").className }));
  });
  const sp = schermo.find((r) => /PPV al recettore/.test(r.lab));
  const sa = schermo.find((r) => /Airblast/.test(r.lab));
  dice(sp && /sv-bad/.test(sp.cls) && /SUPERA/.test(sp.why), "premessa: lo schermo lo dà per superato", sp && sp.why);
  dice(sa && /sv-bad/.test(sa.cls) && /oltre il limite/.test(sa.why), "premessa: e l'airblast è oltre il limite", sa && sa.why);

  await pg.evaluate(() => document.getElementById("btn-report").click());
  await pg.waitForTimeout(700);
  const t = await foglio(pg);
  const rPpv = rigaFoglio(t, /PPV al recettore/);
  dice(/77,7 mm\/s/.test(rPpv), "il foglio stampa lo stesso numero dello schermo", rPpv);
  dice(/SUPERA/.test(rPpv),
    "⛔ e adesso dice anche che SUPERA: prima stampava numero e limite e passava alla riga dopo", rPpv);
  dice(/riduci la MIC/.test(rPpv), "   con accanto che cosa fare, come sullo schermo", rPpv);
  const rAir = rigaFoglio(t, /Airblast/);
  dice(/143 dB\(L\)/.test(rAir), "⛔ e l'airblast c'è: prima nel foglio non compariva affatto", rAir || "(riga assente)");
  dice(/oltre il limite USBM\/OSM di 133 dB\(L\)/.test(rAir), "   col suo verdetto, non il solo numero", rAir);
  if (SCATTI) await pg.screenshot({ path: join(CARTELLA_SCATTI, "supera-390.png"), fullPage: true });
  await larghezzaFoglio(b, pg, "il foglio da portare in cava");
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 3 · LA LEGGE DI SITO SU TRE REFERTI, NEL FOGLIO ───────────────────────
console.log("\n· la stessa volata, con la legge di sito su TRE referti accesa");
{
  const senza = await apri(VOLATA, { ...BASE, recNorma: "din-res", recFreq: 25, recDist: 300 });
  await apriVolata(senza);
  await senza.evaluate(() => document.getElementById("btn-report").click());
  await senza.waitForTimeout(600);
  const tSenza = await foglio(senza);
  const pSenza = rigaFoglio(tSenza, /PPV al recettore/);
  await senza.close();

  const con = await apri((d) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiSito", JSON.stringify(d.sito));
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Fronte Nord 12/07",
      data: "2026-07-12", sintesi: "12 fori", design: d.design }]));
  }, { sito: SITO_TRE, design: { ...BASE, recNorma: "din-res", recFreq: 25, recDist: 300 } });
  await apriVolata(con);
  await con.evaluate(() => document.getElementById("btn-report").click());
  await con.waitForTimeout(600);
  const tCon = await foglio(con);
  const pCon = rigaFoglio(tCon, /PPV al recettore/);

  dice(/6,4 mm\/s/.test(pSenza) && /2,8 mm\/s/.test(pCon),
    "premessa: senza toccare un parametro il numero passa da 6,4 a 2,8", pSenza + " || " + pCon);
  const bSenza = rigaFoglio(tSenza, /Base della previsione/);
  const bCon = rigaFoglio(tCon, /Base della previsione/);
  dice(/stimati da/.test(bSenza), "⛔ il foglio dichiara la base: da litologia", bSenza || "(riga assente)");
  dice(/tuoi 3 referti/.test(bCon), "⛔ e con la legge accesa dice SU QUANTI referti", bCon || "(riga assente)");
  dice(/provvisoria/i.test(bCon),
    "⛔ e che è provvisoria: la bandiera `pochi` la legge anche il foglio, non solo le due schermate", bCon);
  dice(bSenza !== bCon, "   cioè i due fogli non raccontano più la stessa cosa a numeri diversi");
  if (SCATTI) await con.screenshot({ path: join(CARTELLA_SCATTI, "sito-tre-390.png"), fullPage: true });
  dice(con.__errori.length === 0, "la pagina non solleva errori", con.__errori[0]);
  await con.close();
}

// ── 4 · IL LIMITE CHE NON C'È, CON LA SUA RAGIONE ─────────────────────────
console.log("\n· volata salvata con una normativa che Genesi non conosce");
{
  const pg = await apri(VOLATA, { ...BASE, recNorma: "uni-9916", recFreq: 25, recDist: 300 });
  await apriVolata(pg);
  await pg.evaluate(() => document.getElementById("btn-report").click());
  await pg.waitForTimeout(600);
  const riga = rigaFoglio(await foglio(pg), /PPV al recettore/);
  dice(/limite —/.test(riga), "premessa: il limite non c'è e si scrive «—», non «null»", riga);
  dice(/Non si può dire se è sotto soglia/.test(riga),
    "⛔ e adesso il foglio dice che il confronto non si può fare, invece di lasciare un trattino muto", riga);
  dice(/normativa scelta non è fra le cinque/.test(riga),
    "   e QUALE campo va sistemato: la ragione la dice il modulo, non una frase indovinata qui", riga);
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 5 · IL CONFRONTO A/B: IL VERDE NON SI REGALA ──────────────────────────
console.log("\n· A e B sono lo STESSO progetto, e fra i due scatti si accende la legge di sito");
{
  const pg = await apri(() => localStorage.setItem("genesiDisclaimerV1", "1"));
  await vaiA(pg, "design");
  await pg.evaluate(() => document.getElementById("cmpSaveA").click());
  await pg.waitForTimeout(300);
  await pg.evaluate((s) => localStorage.setItem("genesiSito", JSON.stringify(s)), SITO_TRE);
  /* ⛔ Dal 02/09 (unità 3 di GENESI_FUORI_DAL_BROWSER) la legge di sito si legge
     UNA volta all'apertura, dalla porta sui dati: chi la cambia dall'app passa
     da `sitoSalva`, che aggiorna la copia di lavoro. Scrivere la chiave a mano
     è una scorciatoia del banco, non un gesto dell'utente — quindi si ricarica,
     come farebbe un secondo dispositivo. Lo scatto A è già nella sua chiave. */
  await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2500); await ganci(pg);
  await vaiA(pg, "design");
  await pg.evaluate(() => document.getElementById("cmpSaveB").click());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => document.getElementById("cmpShow").click());
  await pg.waitForTimeout(700);

  const q = await pg.evaluate(() => ({
    testo: document.getElementById("cmpBody").innerText.replace(/\s+/g, " "),
    verdi: [...document.querySelectorAll("#cmpBody div")]
      .filter((d) => /66bb6a/.test(d.getAttribute("style") || "")).map((d) => d.textContent.trim()),
  }));
  dice(/28 cm/.test(q.testo) && /101 m/.test(q.testo), "premessa: il confronto si disegna", q.testo.slice(0, 120));
  dice(q.verdi.length === 0,
    `⛔ nessuna cella in verde: erano QUATTRO su quattro pareggi, più la PPV vinta da un cambio di calibrazione`,
    JSON.stringify(q.verdi));
  dice(/base della previsione/i.test(q.testo), "⛔ e il confronto dichiara la base delle due PPV", q.testo.slice(0, 200));
  dice(/non vengono dalla stessa legge/.test(q.testo),
    "⛔ e avvisa che le due PPV non sono confrontabili", q.testo.slice(-300));

  /* ⚠️ E LA CONTROPROVA DELLA CORREZIONE: se B è DAVVERO migliore, il verde
     deve tornare. Un banco che pretende «zero verdi» e basta si accontenta di
     una schermata che non colora mai niente. */
  await pg.evaluate(() => { const c = document.getElementById("cmpClose"); if (c) c.click(); });
  /* ⚠️ `input` PRIMA di `change`, e non è pignoleria: è `input` a spegnere
     `kgAuto`, se no `deriveCharge` riscrive i chili e il progetto B esce
     identico ad A — la terza causa dell'elenco, l'iniezione che non inietta.
     Misurato: la prima stesura di questa riga dava «0 celle verdi» e sembrava
     un difetto della correzione. */
  await pg.evaluate(() => localStorage.removeItem("genesiSito"));
  // stessa ragione di sopra: la legge tolta a mano si vede alla riapertura
  await pg.reload({ waitUntil: "domcontentloaded" }); await pg.waitForTimeout(2500); await ganci(pg);
  await vaiA(pg, "design");
  await pg.evaluate(() => {
    const e = document.getElementById("dKg");
    e.value = "30";
    e.dispatchEvent(new Event("input", { bubbles: true }));
    e.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await pg.waitForTimeout(600);
  const cambiato = await pg.evaluate(() => document.getElementById("dKg").value);
  dice(String(cambiato).replace(",", ".").startsWith("30"),
    `   premessa della controprova: il progetto B è davvero cambiato (kg/foro = ${cambiato})`, cambiato);
  await pg.evaluate(() => document.getElementById("cmpSaveB").click());
  await pg.waitForTimeout(300);
  await pg.evaluate(() => document.getElementById("cmpShow").click());
  await pg.waitForTimeout(700);
  const q2 = await pg.evaluate(() => ({
    verdi: [...document.querySelectorAll("#cmpBody div")]
      .filter((d) => /66bb6a/.test(d.getAttribute("style") || "")).map((d) => d.textContent.trim()),
    testo: document.getElementById("cmpBody").innerText.replace(/\s+/g, " "),
  }));
  dice(q2.verdi.length > 0,
    `⛔ ma con B davvero diverso il verde torna (${q2.verdi.length} celle): la correzione non ha spento il confronto`,
    JSON.stringify(q2.verdi));
  dice(!/non vengono dalla stessa legge/.test(q2.testo),
    "   e con la stessa legge in tutt'e due l'avviso sparisce", q2.testo.slice(-200));

  await pg.evaluate(() => { const c = document.getElementById("cmpClose"); if (c) c.click(); });
  await pg.evaluate(() => document.getElementById("cmpExport").click());
  await pg.waitForTimeout(300);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  dice(/Base della previsione PPV;/.test(csv), "⛔ e il CSV del confronto porta la base accanto ai due numeri",
    (csv.split("\n").find((r) => /Base della/.test(r)) || "").slice(0, 140));
  dice(/Stessa legge per le due PPV;si/.test(csv), "   e dice se le due PPV sono confrontabili",
    csv.split("\n").find((r) => /Stessa legge/.test(r)));

  /* ⛔ e il file passa da `csvCell` come gli altri tre di Genesi: era l'ultimo
     con il `join(';')` nudo. Un nome ostile ci arriva dal nome dell'esplosivo
     solo in teoria, ma la difesa non si tiene sulla teoria. */
  await pg.evaluate(() => {
    const A = JSON.parse(localStorage.getItem("genesiCmpA"));
    A.kpi.setup = "=SUM(1+1)"; A.kpi.maglia = "3;5 m";
    localStorage.setItem("genesiCmpA", JSON.stringify(A));
    document.getElementById("cmpExport").click();
  });
  await pg.waitForTimeout(300);
  const csv2 = String(await pg.evaluate(() => window.__csv) || "");
  dice(/;'=SUM\(1\+1\);/.test(csv2), "⛔ una formula esce con l'apostrofo di guardia, non nuda",
    csv2.split("\n").find((r) => /Esplosivo/.test(r)));
  dice(/;"3;5 m";/.test(csv2), "   e un `;` dentro una cella non sfonda la riga",
    csv2.split("\n").find((r) => /Maglia/.test(r)));
  if (SCATTI) await pg.screenshot({ path: join(CARTELLA_SCATTI, "confronto-390.png"), fullPage: true });
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

await b.close();
srv.close();
if (CONTROPROVA) {
  console.log(`\niniezioni: ${colpiti.size} difetti su ${DIFETTI.length} rimessi nella pagina`);
  if (colpiti.size < DIFETTI.length)
    console.log(`  ⚠️ ${DIFETTI.length - colpiti.size} non hanno trovato il loro pezzo: la controprova vale meno di quello che sembra`);
  console.log(colpiti.size === DIFETTI.length && ko > 0
    ? `✓ il banco SA fallire: ${ko} prove cadute coi difetti rimessi`
    : `✗ coi difetti rimessi il banco non distingue (${ko} cadute, ${colpiti.size}/${DIFETTI.length} iniezioni)`);
  process.exit(colpiti.size === DIFETTI.length && ko > 0 ? 0 : 1);
}
console.log(`\nRisultato foglio in cava: ${ok} passati, ${ko} falliti`);
process.exit(ko > 0 ? 1 : 0);

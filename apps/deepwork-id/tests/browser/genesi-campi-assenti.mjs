/* I CAMPI DI GENESI CHE NON DEVONO RIEMPIRSI DA SOLI
   ──────────────────────────────────────────────────
   DOVE VA: apps/deepwork-id/tests/browser/genesi-campi-assenti.mjs
   E VA REGISTRATO in `tutti.mjs` (io non l'ho toccato: il mandato di questa
   unità si ferma a `apps/genesi/`), con la sua passata di controprova.

   Uso:
     node genesi-campi-assenti.mjs [--porta=8611]
     node genesi-campi-assenti.mjs --controprova   (rimette la forma vecchia su
                                                    tutti e dodici: DEVE fallire)

   PERCHÉ ESISTE. Il 09/08 `valoreCampo` ha tolto da `applyDesign` dodici
   ripieghi della forma `Math.max(min, Math.min(max, gvv('dX')||D2.x))`: con il
   valore salvato ASSENTE, `Math.min(max, null)` fa 0 e il clamp basso lo tira
   su al minimo, scrivendo nel progetto un numero che nessuno ha scritto.
   Le prove che difendono quella correzione stanno in `run-kpi.mjs` e guardano
   il SORGENTE. Quello che nessuna prova guardava è **l'aggancio**: che il
   campo, sullo schermo, resti davvero vuoto. Qui si fanno i due tocchi veri.

   COME SI RIPRODUCE, e perché ci vogliono DUE tocchi:
     1) un `change` su un ALTRO campo fa girare `applyDesign`, che (con la forma
        vecchia) scrive il minimo dentro `D2`;
     2) un `change` sul campo VUOTO fa scattare `guardiaVuoto`, che chiama
        `syncDesignInputs` e rimette nel campo il valore del progetto — ed è lì
        che il numero inventato COMPARE davanti all'utente.

   ⛔ I TRE ESCLUSI SONO DICHIARATI, NON DIMENTICATI: `psCharge`, `recDist` e
   `recFreq` si riempiono ancora (0,1 · 20 · 2) e questo banco lo STAMPA invece
   di tacere — un'eccezione muta è un posto in cui nessuno guarda. Non sono un
   KO perché la loro correzione è un'unità sua: i due del recettore stanno sotto
   `ppvLimit`, e `psCharge` senza toccare la riga «Presplit» sposterebbe la
   bugia da un numero a un allarme.

   ⚠️ I casi si costruiscono NEI DATI (`localStorage`, la stessa chiave che
   l'app scrive da sé) e la controprova nella RISPOSTA HTTP: il file su disco
   non si tocca mai, così il banco si può lanciare mentre girano altri cantieri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8611;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I SEDICI CAMPI SORVEGLIATI: id nel DOM, chiave in `D2`, il numero che la
   forma vecchia inventava — misurato uno per uno nel browser il 09/08 — e
   quello che va aggiunto al progetto salvato perché il caso sia quello giusto.
   ⛔ ERANO DODICI, E I TRE «ESCLUSI PER DECISIONE PRESA» NON ESISTEVANO PIÙ.
   Il 13/08, rilanciando questo banco: `dPsCharge`, `dRecDist` e `dRecFreq`
   dicevano tutt'e tre «VUOTO», e il banco stampava accanto «atteso 0,1 · 20 ·
   2, per decisione presa» — cioè un'affermazione FALSA sul prodotto di oggi,
   scritta in bella copia sotto la riga «e va detto». Il blocco G16 li aveva
   corretti il 10/08 e nessuno era tornato a togliere l'eccezione che li
   scusava. È «un'eccezione che non serve più è un'eccezione che nasconde»,
   nella veste in cui l'eccezione non nasconde un difetto ma un LAVORO FATTO:
   il banco raccontava il prodotto peggiore di com'è, e le sue tre righe non
   sorvegliavano niente. Adesso sono sorvegliati come gli altri.
   ⛔ E IL TREDICESIMO È QUELLO CHE DÀ IL NOME ALL'INTERO CANTIERE, e questo
   banco non l'ha mai guardato: `dKg`, la carica per foro — il campo su cui il
   blocco G14 era nato («due clic e compaiono 5 kg/foro»). Sorvegliava le
   dodici correzioni della GEOMETRIA e non quella della CARICA, cioè il caso
   scritto nel suo stesso commento d'intestazione. */
const SORVEGLIATI = [
  ["dB", "B", "1,5"], ["dS", "S", "1,5"], ["dD", "diam", "50"], ["dN", "perRow", "3"],
  ["dFile", "file", "1"], ["dH", "prof", "6"], ["dStem", "stem", "0,5"], ["dSub", "sub", "0"],
  ["dRitFila", "ritardoFila", "8"], ["dUcs", "ucs", "5"], ["dEmod", "eMod", "2"],
  ["dPsSpacing", "psSpacing", "0,3"],
  /* ⚠️ LA CARICA VUOLE `kgAuto:false` NEL PROGETTO SALVATO, e non è un
     trucco per far passare la prova: con la carica AUTO accesa `deriveCharge`
     la RICALCOLA dalla geometria (58 kg su questa maglia) e riempire il campo
     è la cosa GIUSTA — è un valore derivato, non inventato. Il caso che
     interessa è la carica scritta a mano e diventata illeggibile. Misurato
     tutt'e due il 13/08: con `kgAuto:true` il campo dice «58» dopo il tocco,
     con `kgAuto:false` resta vuoto. */
  ["dKg", "kg", "5", { kgAuto: false }],
  ["dPsCharge", "psCharge", "0,1"], ["dRecDist", "recDist", "20"], ["dRecFreq", "recFreq", "2"],
];

/* LA CONTROPROVA: ogni riga torna alla forma che stringeva al minimo un valore
   assente. Il nome della tabella è quello che `iniezioni-fresche.mjs` sa
   leggere, così il giorno in cui una di queste righe si muove il repository lo
   dice in tre secondi invece di far girare una controprova su un prodotto sano. */
const DIFETTI = [
  /* ⛔ 27/11 — per la terza domanda riscritta: la maglia torna a disegnarsi anche SENZA
     spalla (la forma di prima del 14/09). Con questo difetto i fori ricompaiono, la scheda
     si riempie di numeri usciti da una spalla che nessuno ha scritto, e la scheda CSV esce.
     La guardia sui documenti presa DA SOLA è controprovata nel suo banco
     (`genesi-maglia-assente.mjs --controprova=documenti`): qui starebbe sotto questa. */
  ["  D2.magliaAssente = magliaAssenteMotivo(D2.B, D2.S);\n  if(D2.magliaAssente){ D2.holes=[]; D2.sel=-1; D2.selPrev=-1; D2.lastDet=0; D2.firmaMaglia=null; return; }\n  D2.bf = D2.B;",
   "  D2.magliaAssente = null;\n  D2.bf = D2.B;"],
  ["  D2.B = valoreCampo(gvv('dB'), D2.B, 1.5, 8);",
   "  D2.B = Math.max(1.5, Math.min(8, gvv('dB')||D2.B));"],
  ["  D2.S = valoreCampo(gvv('dS'), D2.S, 1.5, 8);",
   "  D2.S = Math.max(1.5, Math.min(8, gvv('dS')||D2.S));"],
  ["  D2.diam = valoreCampo(gvv('dD'), D2.diam, 50, 160, true);",
   "  D2.diam = Math.max(50, Math.min(160, +$('dD').value||D2.diam));"],
  ["  D2.perRow = valoreCampo(gvv('dN'), D2.perRow, 3, 30, true);",
   "  D2.perRow = Math.max(3, Math.min(30, +$('dN').value||D2.perRow));"],
  ["  D2.file = valoreCampo(gvv('dFile'), D2.file, 1, 6, true);",
   "  D2.file = Math.max(1, Math.min(6, +$('dFile').value||D2.file));"],
  ["  D2.prof = valoreCampo(gvv('dH'), D2.prof, 6, 18);",
   "  D2.prof = Math.max(6, Math.min(18, gvv('dH')||D2.prof));"],
  ["  if($('dStem')) D2.stem = valoreCampo(gvv('dStem'), D2.stem, 0.5, 6);",
   "  if($('dStem')) D2.stem = Math.max(0.5, Math.min(6, gvv('dStem')||D2.stem));"],
  ["  if($('dSub')) D2.sub = valoreCampo(gvv('dSub'), D2.sub, 0, 4);",
   "  if($('dSub')) D2.sub = Math.max(0, Math.min(4, gvv('dSub')||D2.sub));"],
  ["  if($('dRitFila')) D2.ritardoFila = valoreCampo(gvv('dRitFila'), D2.ritardoFila, 8, 300);",
   "  if($('dRitFila')) D2.ritardoFila = Math.max(8, Math.min(300, +$('dRitFila').value||D2.ritardoFila));"],
  ["  if($('dUcs')) D2.ucs = valoreCampo(gvv('dUcs'), D2.ucs, 5, 400);",
   "  if($('dUcs')) D2.ucs = Math.max(5, Math.min(400, +$('dUcs').value||D2.ucs));"],
  ["  if($('dEmod')) D2.eMod = valoreCampo(gvv('dEmod'), D2.eMod, 2, 150);",
   "  if($('dEmod')) D2.eMod = Math.max(2, Math.min(150, +$('dEmod').value||D2.eMod));"],
  ["  if($('dPsSpacing')) D2.psSpacing = valoreCampo(gvv('dPsSpacing'), D2.psSpacing, 0.3, 2);",
   "  if($('dPsSpacing')) D2.psSpacing = Math.max(0.3, Math.min(2, gvv('dPsSpacing')||D2.psSpacing));"],
  /* la CARICA: le sue due metà, perché i due clic sono due difetti distinti —
     `applyDesign` che fissa 5 kg nel progetto, e `syncDesignInputs` che scrive
     lo zero DENTRO l'input prima ancora che qualcuno tocchi qualcosa */
  ["  D2.kg = valoreCampo(gvv('dKg'), D2.kg, 5, 200); deriveCharge();",
   "  D2.kg = Math.max(5, Math.min(200, gvv('dKg')||D2.kg)); deriveCharge();"],
  ["gsv('dH',D2.prof,1); gsv('dKg',D2.kg,0);",
   "gsv('dH',D2.prof,1); gsv('dKg',Math.round(D2.kg),0);"],
  /* i tre del blocco G16, che fino al 13/08 questo banco dichiarava esclusi */
  ["  if($('dPsCharge')) D2.psCharge = valoreCampo(gvv('dPsCharge'), D2.psCharge, 0.1, 2);",
   "  if($('dPsCharge')) D2.psCharge = Math.max(0.1, Math.min(2, gvv('dPsCharge')||D2.psCharge));"],
  ["  if($('dRecDist')) D2.recDist = valoreCampo(gvv('dRecDist'), D2.recDist, 20, 3000);",
   "  if($('dRecDist')) D2.recDist = Math.max(20, Math.min(3000, gvv('dRecDist')||D2.recDist));"],
  ["  if($('dRecFreq')) D2.recFreq = valoreCampo(gvv('dRecFreq'), D2.recFreq, 2, 120);",
   "  if($('dRecFreq')) D2.recFreq = Math.max(2, Math.min(120, +$('dRecFreq').value||D2.recFreq));"],
];
/* ⛔ E LA SECONDA DOMANDA VUOLE UN'INIEZIONE NEL MODULO, non nella pagina: il
   difetto dell'SDOB (blocco G17) non stava in un campo, stava nel numero che
   una riga della scheda ricavava dal campo assente. Si rimette la forma
   vecchia dove viveva — `Math.min(Q, cap)` con `Q` grezzo, che di un `null` fa
   **0** — e da lì il clamp `max(0.1, W_top)` risputa i **5,84 m/kg⌐** con il
   pallino VERDE, e la gittata flyrock scende a 49 m.
   ⚠️ Terna `[file, cerca, sostituisci]`: `iniezioni-fresche.mjs` la legge, e
   così il giorno in cui questa riga si muove il repository lo dice in tre
   secondi invece di far girare la controprova su un prodotto sano. */
const DIFETTI_MODULO = [
  ["apps/genesi/genesi-data.js",
   "  const q = n(o.kg), s = n(o.stem), d = n(o.diam), r = n(o.densita);",
   "  const q = (o.kg === null || o.kg === undefined) ? 0 : n(o.kg), s = n(o.stem), d = n(o.diam), r = n(o.densita);"],
  /* ⛔ E LA TERZA DOMANDA VUOLE IL RIPIEGO DELLA SPALLA (blocco B0-tervicies).
     Si rimette `B = D2.B || SPALLA` dov'era: da lì la gittata torna a uscire
     dal ripiego globale `let SPALLA = 3.0`, cioè da un burden che nessuno ha
     scritto. Due iniezioni, perché il ripiego viveva in DUE posti — la stima e
     il verdetto del flyrock inverso — e toglierlo da uno solo lascia in piedi
     l'altro (è il contratto allargato a metà di CLAUDE.md). */
  ["apps/genesi/genesi.html",
   "  const _B=(+D2.B>0)?+D2.B:null;",
   "  const _B=(+D2.B>0)?+D2.B:SPALLA;"],
  /* ⚠️ INIEZIONE AGGIORNATA IL 14/08, e la ragione è quella buona: la riga si è
     mossa perché è MIGLIORATA. Accanto a `_Binv` è nato `_Sinv`, la sorella
     sul borraggio, che fino a quel giorno faceva ancora `(D2.stem||2.5)`.
     Il pezzo cercato resta il più corto che identifica la riga. */
  ["apps/genesi/genesi.html",
   "const _Binv=(+D2.B>0)?+D2.B:null, _Sinv=(+D2.stem>0)?+D2.stem:null;",
   "const _Binv=(+D2.B>0)?+D2.B:SPALLA, _Sinv=(+D2.stem>0)?+D2.stem:null;"],
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
  /* ⛔ LA COLONNA `file` DI `DIFETTI_MODULO` VENIVA IGNORATA, e non si vedeva
     perché la tabella aveva una riga sola: le iniezioni si applicavano tutte a
     `genesi-data.js` qualunque file dichiarassero. Il blocco B0-tervicies ne ha
     aggiunte due che vivono nella PAGINA, e senza questo `endsWith` sarebbero
     rimaste a bersaglio zero — una controprova che gira su un prodotto sano
     dichiarando «non distingue», cioè la terza delle cinque cause di CLAUDE.md
     con l'aggravante di essere nata dal righello e non dal codice. */
  if (CONTROPROVA) {
    const perQui = DIFETTI_MODULO.filter(([f]) => p.endsWith(f));
    if (perQui.length) {
      let t = corpo.toString("utf8");
      for (const [, a, b] of perQui) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID, riletto DAL SERVER: un banco che trova la
   porta occupata e la riusa non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-campi-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-campi-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }
/* e la radice servita è quella giusta: in BYTE, non in caratteri — la pagina è
   piena di accenti e una lunghezza in caratteri non torna mai */
if (!CONTROPROVA) {
  const disco = readFileSync(join(R, "apps/genesi/genesi.html")).length;
  const rete = (await (await fetch(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`)).arrayBuffer()).byteLength;
  if (rete !== disco) { console.error(`✗ radice sbagliata: ${rete} ≠ ${disco} byte`); process.exit(2); }
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 200))}` : ""}`); }
};

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: true, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res",
  recFreq: 25, recDist: 300, perRow: 12, file: 1 };

/* apre una volata salvata a cui manca UN valore, e ci arriva dalla via vera:
   `localStorage` → Home → bottone «Apri» */
async function apriSenza(chiave, extra) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  const d = { ...DESIGN, ...(extra || {}) }; if (chiave) d[chiave] = null;
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord",
      data: "2026-07-12", sintesi: "12 fori", design: dd }]));
  }, d);
  /* senza rete vera in questo contenitore, l'import da gstatic morirebbe da
     solo dopo ~13 s PER OGNI pagina aperta (sono sedici): lo si taglia
     subito, come già fa `genesi-locale.mjs` per lo stesso identico import.
     Trovato il 14/09 scrivendo `genesi-maglia-assente.mjs`: senza questa
     riga il banco impiegava minuti invece di secondi per aprire una sola
     volata, in un contenitore dove la rete verso gstatic non fallisce
     subito ma resta appesa — un ambiente diverso da quello in cui questo
     banco era stato scritto e verificato l'ultima volta. */
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
  });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1400);
  pg.__errori = errori;
  return pg;
}
const leggi = (pg, id) => pg.evaluate((i) => { const e = document.getElementById(i); return e ? e.value : null; }, id);

/* i due tocchi, in ordine: prima un ALTRO campo, poi il campo vuoto */
async function dueTocchi(pg, id) {
  await pg.evaluate(() => { const e = document.getElementById("dRit"); if (e) e.dispatchEvent(new Event("change", { bubbles: true })); });
  await pg.waitForTimeout(300);
  await pg.evaluate((i) => { const e = document.getElementById(i); if (e) e.dispatchEvent(new Event("change", { bubbles: true })); }, id);
  await pg.waitForTimeout(300);
}

console.log(`\n════════ i campi di Genesi che non devono riempirsi da soli${CONTROPROVA ? " · controprova" : ""} ════════`);
console.log(`(${SORVEGLIATI.length} campi sorvegliati, zero esclusi)`);

for (const [id, chiave, inventato, extra] of SORVEGLIATI) {
  const pg = await apriSenza(chiave, extra);
  /* ⚠️ LA PRECONDIZIONE: se la volata non si è aperta nel 2D la domanda non ha
     senso, e un soggetto non misurato non è un soggetto a posto. */
  const navigato = await pg.evaluate(() => document.body.className.includes("scr-design"));
  const presente = (await leggi(pg, id)) !== null;
  if (!navigato || !presente) {
    nonMisurati.push(`${id} (${navigato ? "il campo non c'è" : "la volata non si è aperta nel 2D"})`);
    await pg.close(); continue;
  }
  const v0 = await leggi(pg, id);
  dice(String(v0).trim() === "", `${id}: subito dopo «Apri» il campo è VUOTO`, v0);
  await dueTocchi(pg, id);
  const v2 = await leggi(pg, id);
  dice(String(v2).trim() === "",
    `⛔ ${id} (${chiave}): dopo i due tocchi il campo è ANCORA vuoto — la forma vecchia ci scriveva ${inventato}`, v2);
  /* ⛔ E LA SCHERMATA DEVE ESSERE VIVA, se no un campo vuoto «a posto» lo si
     legge su una pagina morta. Trovato così il 09/08: con l'INTERASSE assente
     `measureGeom2D` fa `null.toFixed(2)`, `setScreen('design')` muore, la
     scheda validatori resta a ZERO righe e — peggio — il toast che NOMINA il
     valore mancante (`volataSenzaValori`) non viene mai mostrato, perché sta
     nella riga dopo `setScreen`.
     ⏱️ 14/09 (B0-septies, cantiere G37): per B e S QUESTA riga è cambiata di
     proposito, non è un regresso — `magliaAssenteMotivo` fa uscire
     `renderScheda2D` PRIMA di disegnare qualunque riga, con la sola frase
     dichiarata («Pianta non disegnabile: manca burden/interasse»), invece di
     una scheda a metà su una geometria degenere. Zero `.sv-row` è adesso il
     comportamento GIUSTO per questi due campi soli — non per gli altri
     quattordici, dove la vecchia aspettativa resta quella vera. */
  const magliaAssenteAttesa = id === "dB" ? "burden" : id === "dS" ? "interasse" : null;
  if (magliaAssenteAttesa) {
    const vive = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
    const scheda = await pg.evaluate(() => (document.getElementById("d2-scheda") || {}).textContent || "");
    dice(pg.__errori.length === 0 && vive === 0 && /non disegnabile/.test(scheda) && new RegExp(`manca ${magliaAssenteAttesa}\\b`).test(scheda),
      `${id}: senza ${chiave} la pianta si dichiara non disegnabile (0 righe, ragione nominata), non una scheda a metà`,
      pg.__errori[0] || `righe: ${vive}, testo: ${scheda.slice(0, 120)}`);
  } else {
    const vive = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
    dice(pg.__errori.length === 0 && vive > 20,
      `${id}: aprire la volata senza questo valore NON uccide il 2D (${vive} righe di scheda)`,
      pg.__errori[0] || `righe: ${vive}`);
  }
  await pg.close();
}

/* ⛔ LA SECONDA DOMANDA, e non è «il campo resta vuoto»: è «QUALCHE NUMERO A
   SCHERMO si è inventato al posto suo?». Un campo che resta vuoto e una riga
   che intanto stampa un numero ricavato da quel vuoto sono lo stesso difetto un
   piano più sotto — e la prima domanda, da sola, dà verde.
   Il metodo è quello dei disegni: **il rapporto fra due valori diversi**. Si
   apre la STESSA volata due volte, una con la carica e una senza, e si mettono
   le ventinove righe della scheda validatori una accanto all'altra. Ogni riga
   che CAMBIA deve essere diventata «non calcolabile»; se cambia e resta un
   numero, quel numero l'ha fatto l'assenza.
   Misurato così il 13/08: ventotto righe identiche e UNA sola diversa —
   «Confin. colletto (SDOB) 5,84 m/kg⌐» contro «1,43» — e 5,84 sta SOPRA la
   soglia 1,4, cioè il pallino si dipingeva verde con «colletto ben confinato».
   Un campione solo non l'avrebbe distinta da un numero giusto.
   ⚠️ Si guarda la CARICA e basta, e il costo è dichiarato: due aperture in
   più. Rifarlo per tutti e sedici i campi vuol dire trentadue aperture, cioè
   dieci minuti in più su un banco che ne dura otto. */
console.log("\n· la seconda domanda: con la carica assente, nessuna riga della scheda inventa un numero");
{
  const pgSana = await apriSenza(null, { kgAuto: false });
  const pgSenza = await apriSenza("kg", { kgAuto: false });
  const righeDi = (pg) => pg.evaluate(() =>
    [...document.querySelectorAll("#d2-scheda .sv-row")].map((x) => ({
      t: x.innerText.replace(/\s+/g, " ").trim(),
      pallino: (x.querySelector("[class*='sv-ok'],[class*='sv-warn'],[class*='sv-bad']") || x).className,
    })));
  const A = await righeDi(pgSana), B = await righeDi(pgSenza);
  const navigati = await pgSana.evaluate(() => document.body.className.includes("scr-design"))
    && await pgSenza.evaluate(() => document.body.className.includes("scr-design"));
  /* ⛔ LA PRECONDIZIONE: se le due schede non hanno lo stesso numero di righe
     non sono confrontabili, e un soggetto non misurato non è un soggetto a
     posto — si dichiara e si esce diverso da zero, non si accusa. */
  if (!navigati || !A.length || A.length !== B.length) {
    nonMisurati.push(`confronto scheda (righe: ${A.length} con la carica, ${B.length} senza)`);
  } else {
    const cambiate = A.map((a, i) => [a.t, B[i].t]).filter(([a, c]) => a !== c);
    dice(cambiate.length > 0,
      `il confronto DISTINGUE: ${cambiate.length} righe su ${A.length} cambiano togliendo la carica`,
      cambiate.length);
    const bugiarde = cambiate.filter(([, c]) => !/non calcolabile/i.test(c));
    dice(bugiarde.length === 0,
      `⛔ e ogni riga che cambia dice «non calcolabile», nessuna dice un altro NUMERO`,
      bugiarde.map(([a, c]) => `${a}  →  ${c}`).join(" | "));
    /* la riga per nome, perché una prova che guarda solo l'insieme non dice
       QUALE difetto sorveglia — e questa è quella che il 13/08 mentiva */
    const sdobSenza = B.find((r) => /SDOB/i.test(r.t));
    dice(sdobSenza && /non calcolabile/i.test(sdobSenza.t),
      "⛔ SDOB: senza la carica non dice più 5,84 (che era SOPRA la soglia 1,4, cioè verde)", sdobSenza && sdobSenza.t);
    const flySenza = B.find((r) => /GITTATA FLYROCK/i.test(r.t));
    dice(flySenza && /non calcolabile/i.test(flySenza.t),
      "⛔ gittata flyrock: niente raggio di sgombero ricavato da una carica inventata", flySenza && flySenza.t);
    const invSenza = B.find((r) => /FLYROCK INVERSO/i.test(r.t));
    dice(invSenza && /non calcolabile/i.test(invSenza.t),
      "⛔ flyrock inverso: niente REQUISITO prescritto su una carica che non c'è", invSenza && invSenza.t);
    /* e il verso opposto: sul progetto sano i tre numeri ci sono ancora, se no
       la difesa avrebbe spento tre righe invece di renderle oneste */
    const sdobSano = A.find((r) => /SDOB/i.test(r.t));
    dice(sdobSano && /1,43/.test(sdobSano.t),
      "e con la carica vera l'SDOB è ancora 1,43: la correzione non ha spento la riga", sdobSano && sdobSano.t);
    const flySano = A.find((r) => /GITTATA FLYROCK/i.test(r.t));
    dice(flySano && /101 m/.test(flySano.t) && /404 m/.test(flySano.t),
      "e la gittata è ancora 101 m con sgombero 202 / 404 m", flySano && flySano.t);
  }
  await pgSana.close(); await pgSenza.close();
}

/* ⛔ LA TERZA DOMANDA — LA SPALLA (blocco B0-tervicies), e il metodo di G17 qui
   NON BASTA: affiancando le righe con la spalla e senza, la riga della gittata
   era fra quelle che NON cambiavano. Diceva 101 m in tutt'e due le colonne,
   perché il ripiego `B = D2.B || SPALLA` riempiva il buco col 3,0 globale.
   Delle 29 righe ne cambiavano 14, e proprio quella da guardare stava fra le
   quindici identiche: **un numero identico non è un numero verificato.**
   Quindi qui la domanda si fa in tre pezzi, e i tre insieme distinguono le due
   direzioni in cui si può sbagliare:
   1. con la spalla assente e una volata in cui la spalla DECIDE, la gittata
      dev'essere «non calcolabile» — e la ragione deve portare l'AMPIEZZA del
      dubbio, se no si è tolto un numero senza mettere niente al suo posto;
   2. con la spalla assente e una volata in cui la spalla NON decide (borraggio
      corto: domina il cratering), il numero dev'esserci ANCORA. È la prova che
      la difesa non ha spento la riga: misurato su 12.150 progetti realistici,
      la gittata resta determinata nel **44,2%** dei casi, e lì il numero è
      identico a quello che dava il vecchio ripiego (scarto massimo 0,00 m);
   3. e col dato vero i numeri storici non si muovono di una cifra.
   ⚠️ Il verso che costa: nel 55,8% in cui la spalla decide, la forbice ha una
   mediana di **107 m** di gittata, cioè 428 m di sgombero persone. Misurato sul
   prodotto: stessa cava Ø102, spalla vera 1,5 m → «133 m, sgombero 267/533 m»;
   spalla assente col vecchio ripiego → «101 m, 202/404 m». */
/* ⏱️ 27/11 — QUESTA SEZIONE È STATA RISCRITTA SULLA VERITÀ DI OGGI. Dal 14/09
   (B0-septies, `1b904f01`) una volata salvata SENZA spalla non disegna nessuna
   maglia: `genMaglia2D` imposta `D2.magliaAssente='burden'`, i fori sono zero
   e la scheda dice «Pianta non disegnabile: manca burden». La sezione di prima
   pretendeva una scheda con più di venti righe, non la trovava per
   costruzione, e rispondeva «NON MISURATI (2)» uscendo 1: onesto, scritto qui
   sopra — e **rosso per due mesi e mezzo**, cioè un rosso che nessuno
   guardava più. Trovato il 27/11 con una bisezione su 35 commit, mentre si
   cercava se a romperlo fosse stata una modifica del giorno.
   La DOMANDA è rimasta la stessa — «con la spalla assente, la gittata non
   esce da un burden inventato» — e oggi ha una risposta più forte di prima:
   senza spalla la gittata non esce AFFATTO, da nessuna strada della pagina.
   La scheda non ha righe né numeri, e (dal 27/11) nemmeno la scheda CSV
   esce: la ferma `nonEsceSenzaPianta`.
   ⚠️ Che cosa NON si misura più da qui, e dove sta: la FORBICE della gittata
   quando la spalla manca («fra 101 e 133 m», «sgombero persone fra 404 e 533
   m») e il flyrock inverso senza verdetto non sono più raggiungibili dalla
   pagina — li provano in `run-kpi` «gittataSenzaSpalla: dove la spalla
   DECIDE, il numero non si dà» e «…dove la spalla NON decide, il numero si dà
   lo stesso». Le due iniezioni di questo banco che rimettono `D2.B ||
   SPALLA` restano (trovano ancora il loro testo), ma dalla pagina il loro
   effetto non si vede più: a farle cadere sono quelle due prove. */
console.log("\n· la terza domanda: con la spalla assente, la gittata non esce da un burden inventato");
{
  const testoDi = (pg, re) => pg.evaluate((r) => {
    const x = [...document.querySelectorAll("#d2-scheda .sv-row")]
      .find((e) => new RegExp(r, "i").test(e.innerText));
    return x ? x.textContent.replace(/\s+/g, " ").trim() : null;
  }, re.source);
  const vivaEsana = async (pg) =>
    await pg.evaluate(() => document.body.className.includes("scr-design"))
    && await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length > 20)
    && pg.__errori.length === 0;

  /* 1 — SENZA LA SPALLA: niente fori, niente gittata, niente file. Due volte:
     sulla maglia di dimostrazione e col borraggio corto (1,6 m), dove un tempo
     la gittata usciva lo stesso perché la spalla «non decideva». */
  const senzaSpalla = async (quale, extra) => {
    const pg = await apriSenza("B", extra);
    const q = await pg.evaluate(() => ({ nav: document.body.className.includes("scr-design"),
      fori: window.__genesi ? window.__genesi.D2.holes.length : -1, assente: window.__genesi ? window.__genesi.D2.magliaAssente : undefined,
      scheda: ((document.getElementById("d2-scheda") || {}).innerText || "").replace(/\s+/g, " ").trim() }));
    if (!q.nav || q.fori < 0) { nonMisurati.push(`${quale} (la volata senza spalla non si è aperta nel 2D)`); await pg.close(); return; }
    dice(pg.__errori.length === 0 && q.fori === 0 && q.assente === "burden",
      `⛔ ${quale}: senza la spalla nessun foro viene disegnato, e la pagina lo sa (zero errori, zero fori, motivo «burden»)`, JSON.stringify([pg.__errori[0], q.fori, q.assente]));
    dice(/Pianta non disegnabile: manca burden/.test(q.scheda) && !/\d/.test(q.scheda) && !/gittata|sgombero/i.test(q.scheda),
      `⛔ ${quale}: la scheda dice che cosa manca e non mostra NESSUN numero — nessuna gittata, nessuna distanza di sgombero esce da una spalla inventata`, q.scheda.slice(0, 220));
    /* e nemmeno il file: premendo «Esporta scheda volata» non esce niente */
    const u = await pg.evaluate(async () => { const usciti = []; const vero = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () { if (this.download) { usciti.push(this.download); return; } return vero.call(this); };
      document.getElementById("btn-scheda-csv").click(); await new Promise((r) => setTimeout(r, 700)); HTMLAnchorElement.prototype.click = vero;
      return { usciti, toast: [...document.querySelectorAll(".toast, #toast, .dw-toast")].map((t) => t.innerText.replace(/\s+/g, " ")).join(" | ") }; });
    dice(u.usciti.length === 0 && /non esce: la pianta non è disegnabile — manca burden/.test(u.toast),
      `⛔ ${quale}: e la scheda CSV non esce — il messaggio dice perché`, JSON.stringify(u).slice(0, 260));
    await pg.close();
  };
  await senzaSpalla("spalla assente");
  await senzaSpalla("spalla assente, borraggio 1,6 m", { stem: 1.6 });

  /* 2 — IL VERSO OPPOSTO, sul progetto sano: i numeri storici non si muovono */
  const pgB = await apriSenza(null);
  if (!(await vivaEsana(pgB))) nonMisurati.push("la spalla presente (la scheda non si è aperta, o la pagina ha errori)");
  else {
    const flySano = await testoDi(pgB, /GITTATA FLYROCK/);
    dice(flySano !== null && /101 m/.test(flySano) && /202 \/ 404 m/.test(flySano),
      "e con la spalla vera la gittata è ancora 101 m con sgombero 202 / 404 m", flySano);
    /* ⚠️ l'asserzione giusta NON è «rispetta entrambi»: sulla maglia di
       dimostrazione il borraggio è 2,2 m contro i 2,6 richiesti. Quello che
       questa riga prova è che un verdetto ESCA. */
    const invSano = await testoDi(pgB, /FLYROCK INVERSO/);
    dice(invSano !== null && /Il progetto attuale/.test(invSano) && !/non si può dire/.test(invSano),
      "e con la spalla vera il flyrock inverso dà il suo verdetto sul burden", invSano);
  }
  await pgB.close();
  const pgCorto = await apriSenza(null, { stem: 1.6 });
  if (!(await vivaEsana(pgCorto))) nonMisurati.push("la spalla presente col borraggio 1,6 m (la scheda non si è aperta)");
  else {
    const con = await testoDi(pgCorto, /GITTATA FLYROCK/);
    dice(con !== null && /174 m/.test(con) && !/non calcolabile/i.test(con),
      "e col borraggio corto (1,6 m) e la spalla vera la gittata è 174 m: domina il cratering, il numero c'è", con);
  }
  await pgCorto.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length + DIFETTI_MODULO.length} hanno trovato il loro pezzo)`);
/* ⚠️ IL TOTALE ATTESO SI STAMPA, e non è pignoleria: un banco che crolla a
   metà dichiara MENO prove, e un totale più basso si legge come «ha guardato
   meno roba», non come «si è rotto». */
console.log(`\nRisultato campi assenti di Genesi: ${ok} passati, ${ko} falliti  ·  ${SORVEGLIATI.length * 3 + 7 + 9} asserzioni attese (3 per campo × ${SORVEGLIATI.length}, più 7 sulla CARICA e 9 sulla SPALLA)`);
await b.close(); srv.close();
process.exit(ko > 0 || nonMisurati.length ? 1 : 0);

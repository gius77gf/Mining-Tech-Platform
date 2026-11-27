/* B0-SEPTIES · LA MAGLIA CHE NON SI GENERA PIÙ CON BURDEN/INTERASSE ASSENTI
   ───────────────────────────────────────────────────────────────────────
   DOVE VA: apps/deepwork-id/tests/browser/genesi-maglia-assente.mjs
   E VA REGISTRATO in `tutti.mjs`, con la sua passata di controprova.

   Uso:
     node genesi-maglia-assente.mjs [--porta=8612]
     node genesi-maglia-assente.mjs --controprova   (rimette la forma vecchia:
                                                      DEVE fallire)

   PERCHÉ ESISTE (14/09, unità B0-septies). Fino a questa unità `genMaglia2D`
   non aveva NESSUN ripiego (a differenza dei cinque consumatori a valle che
   usano `D2.S||3.5` ecc.): con `D2.B` o `D2.S` `null`, `c*null` e `r*null`
   sono coercizioni a ZERO, quindi ogni foro finiva disegnato sullo stesso
   punto — un conteggio foro corretto sopra una geometria completamente
   falsa. Misurato: `null` non fa "3,5×4" come lasciava intendere una riga
   di `docs/DECISIONI_WEEKEND.md`, fa collassare tutto a `(0,0)`.
   La cura: `magliaAssenteMotivo(B,S)` in `genesi-data.js` (G37) decide
   PRIMA se la maglia è posizionabile; `genMaglia2D` non genera nessuna
   coordinata quando non lo è, `drawDesign2D`/`renderScheda2D` dichiarano la
   ragione invece di disegnare fori fantasma o restare mute.

   Questo banco arriva dalla via VERA — `localStorage` → Home → «Apri» —
   la stessa che B0-nonies (il caso gemello sull'interasse) ha già usato.

   ⚠️ I casi si costruiscono NEI DATI (`localStorage`) e la controprova nella
   RISPOSTA HTTP: il file su disco non si tocca mai, così il banco si può
   lanciare mentre girano altri cantieri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTRO_DOC = process.argv.includes("--controprova=documenti");
const CONTROPROVA = process.argv.includes("--controprova") || CONTRO_DOC;
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8612;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: rimette `genMaglia2D` alla forma di prima della guardia —
   nessun controllo su B/S, coordinate generate comunque. Il nome della
   tabella è quello che `iniezioni-fresche.mjs` sa leggere. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "  D2.magliaAssente = magliaAssenteMotivo(D2.B, D2.S);\n  if(D2.magliaAssente){ D2.holes=[]; D2.sel=-1; D2.selPrev=-1; D2.lastDet=0; D2.firmaMaglia=null; return; }\n  D2.bf = D2.B;",
   "  D2.magliaAssente = null;\n  D2.bf = D2.B;"],
];
/* LA SECONDA CONTROPROVA, `--controprova=documenti` (27/11): i documenti. Sta a parte perché
   il difetto qui sopra spegne lo STATO «pianta non disegnabile» — e senza quello stato la
   domanda sui documenti non si può nemmeno fare (la sezione si dichiara non misurata): con
   una controprova sola le due iniezioni qui sotto non verrebbero mai messe alla prova. Qui la
   guardia unica smette di fermare, e la riga che resta in Home torna a dire «0 fori · 0 kg». */
const DIFETTI_DOCUMENTI = [
  ["apps/genesi/genesi.html",
   "function _senzaPianta(cosa, verbo){ const m=nonEsceSenzaPianta(D2.magliaAssente, cosa, verbo); if(!m) return false; toast(m); return true; }",
   "function _senzaPianta(cosa, verbo){ return false; }"],
  ["apps/genesi/genesi.html",
   "  if(D2.magliaAssente) sintesi='pianta non disegnabile — '+fraseMagliaAssente(D2.magliaAssente);\n", ""],
  /* 27/11 — la parola: la scheda torna a incollare lo STATO («burden») a «manca » */
  ["apps/genesi/genesi.html",
   "Pianta non disegnabile: '+_rEsc(fraseMagliaAssente(D2.magliaAssente))+'. Nessun foro",
   "Pianta non disegnabile: manca '+_rEsc(D2.magliaAssente)+'. Nessun foro"],
  /* 27/11 — la tela: la frase torna scritta in punti della tela, cioè alta 4-6 px sul telefono */
  ["apps/genesi/genesi.html",
   "  const kT=scalaTestoTela(cv.width, cv.getBoundingClientRect().width), W=cv.width/kT;",
   "  const kT=1, W=cv.width/kT;"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    const perQui = (CONTRO_DOC ? DIFETTI_DOCUMENTI : DIFETTI).filter(([f]) => p.endsWith(f));
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

/* IL CONTRASSEGNO COL PROPRIO PID, riletto DAL SERVER: un banco che trova la
   porta occupata e la riusa non fallisce — misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-maglia-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-maglia-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }
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

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 12,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

/* apre una volata salvata a cui manca B e/o S, dalla via vera:
   `localStorage` → Home → bottone «Apri». Nessun foro salvato col progetto
   (come una volata di prima del 05/09): tocca a `genMaglia2D` deciderla. */
async function apriSenza(chiavi) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  const d = { ...DESIGN }; for (const k of chiavi) d[k] = null;
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord",
      data: "2026-07-12", sintesi: "12 fori", design: dd }]));
  }, d);
  /* senza rete vera in questo contenitore, l'import da gstatic morirebbe da
     solo dopo ~13 s per ogni pagina aperta: lo si taglia subito, come già
     fa `genesi-locale.mjs` per lo stesso identico import. */
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
const stato = (pg) => pg.evaluate(() => ({
  navigato: document.body.className.includes("scr-design"),
  n: window.__genesi ? window.__genesi.D2.holes.length : -1,
  assente: window.__genesi ? window.__genesi.D2.magliaAssente : undefined,
  scheda: (document.getElementById("d2-scheda") || {}).textContent || "",
}));

console.log(`\n════════ Genesi · la maglia assente si dichiara, non si disegna (B0-septies)${CONTRO_DOC ? " · controprova dei documenti" : CONTROPROVA ? " · controprova" : ""} ════════`);

const CASI = [
  ["B", ["B"], "burden", "manca la spalla", ["dB"]],
  ["S", ["S"], "interasse", "manca l'interasse", ["dS"]],
  ["B e S", ["B", "S"], "burden e interasse", "mancano la spalla e l'interasse", ["dB", "dS"]],
];
/* 27/11 — il nome che il campo ha NEL FORM, letto dalla pagina e non scritto qui: è con quel
   nome che il messaggio deve chiamare il dato che manca. */
/* 27/11 — LA FRASE SULLA TELA SI LEGGE? Il testo di una tela non sta nel DOM: si misurano i
   PIXEL. Sul fondo pieno della pianta vuota le sole cose chiare sono le lettere: ogni
   striscia di righe chiare consecutive è una riga di testo. Si riporta tutto in px dello
   schermo (la tela è larga 960 punti, mostrata a molto meno) e si chiede: quante righe, alta
   quanto la più bassa, larga quanto la più larga, e quanto margine resta ai lati. */
const fraseSullaTela = (pg) => pg.evaluate(() => {
  const cv = document.getElementById("d2-canvas"), r = cv.getBoundingClientRect();
  if (!(r.width > 0)) return null;
  const k = cv.width / r.width, d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
  const righe = []; let x0 = cv.width, x1 = -1, dentro = null;
  for (let y = 0; y < cv.height; y++) {
    let chiara = false;
    for (let x = 0; x < cv.width; x++) if (d[(y * cv.width + x) * 4] > 130) { chiara = true; if (x < x0) x0 = x; if (x > x1) x1 = x; }
    if (chiara && dentro === null) dentro = y;
    if (!chiara && dentro !== null) { righe.push(y - dentro); dentro = null; }
  }
  return { righe: righe.map((h) => +(h / k).toFixed(1)), larga: x1 < 0 ? 0 : +((x1 - x0 + 1) / k).toFixed(1),
    margine: x1 < 0 ? null : +(Math.min(x0, cv.width - 1 - x1) / k).toFixed(1), tela: Math.round(r.width) };
});
const telaLeggibile = (t) => !!t && t.righe.length === 2 && Math.min(...t.righe) >= 8 && t.margine >= 12;
const nomiCampi = (pg, ids) => pg.evaluate((ii) => ii.map((i) => {
  const c = document.getElementById(i), l = c && c.closest("label"), s = l && l.querySelector("span");
  return s ? s.textContent.replace(/\(.*\)/, "").trim().toLowerCase() : null;
}), ids);

for (const [nome, chiavi, atteso, frase, campi] of CASI) {
  const pg = await apriSenza(chiavi);
  const st = await stato(pg);
  if (!st.navigato || st.n < 0) {
    nonMisurati.push(`${nome} (${st.navigato ? "l'aggancio di debug non c'è" : "la volata non si è aperta nel 2D"})`);
    await pg.close(); continue;
  }
  dice(pg.__errori.length === 0, `${nome} assente: zero errori di pagina`, pg.__errori[0]);
  dice(st.n === 0, `⛔ ${nome} assente: zero fori disegnati (non più sovrapposti sullo stesso punto)`, st.n);
  dice(st.assente === atteso, `${nome} assente: la ragione dichiarata è "${atteso}"`, st.assente);
  dice(st.scheda.includes(`Pianta non disegnabile: ${frase}.`), `${nome} assente: la scheda nomina la ragione («${frase}»)`, st.scheda.slice(0, 120));
  const nomi = await nomiCampi(pg, campi);
  dice(nomi.every((n) => n && st.scheda.toLowerCase().includes(n)) && !/burden/i.test(st.scheda),
    `⛔ ${nome} assente: il dato che manca è chiamato col nome che il campo ha nel form («${nomi.join("», «")}»), non con la parola del codice`, st.scheda.slice(0, 120));
  /* la stessa frase sta anche SULLA TELA, e lì va misurata nei pixel: a 430 e, ristretto lo
     schermo, a 320 (la tela deve riscriversi da sola: nessun gesto la ridisegnerebbe) */
  await pg.evaluate(() => document.getElementById("d2-canvas").scrollIntoView({ block: "center" }));
  const t430 = await fraseSullaTela(pg);
  dice(telaLeggibile(t430), `⛔ ${nome} assente, schermo 430: sulla tela la frase si legge — due righe alte almeno 8 px, con 12 px di margine`, JSON.stringify(t430));
  await pg.setViewportSize({ width: 320, height: 950 }); await pg.waitForTimeout(350);
  const t320 = await fraseSullaTela(pg);
  dice(telaLeggibile(t320), `⛔ ${nome} assente, schermo 320: ristretto lo schermo la frase si riscrive e si legge ancora (non esce dalla tela)`, JSON.stringify(t320));
  await pg.close();
}

/* e il verso opposto: con B e S leggibili la maglia torna a disegnarsi come
   sempre — una difesa che spegnesse la maglia SEMPRE sarebbe peggio del
   difetto che corregge */
console.log("\n· il verso opposto: con burden e interasse leggibili, la maglia c'è ed è quella vera");
{
  const pg = await apriSenza([]);
  const st = await stato(pg);
  if (!st.navigato || st.n < 0) {
    nonMisurati.push("progetto sano (l'aggancio di debug non c'è, o la volata non si è aperta)");
  } else {
    dice(pg.__errori.length === 0, "progetto sano: zero errori di pagina", pg.__errori[0]);
    dice(st.n === 12, "progetto sano: 12 fori disegnati (1 fila × 12), non zero", st.n);
    dice(st.assente === null, "progetto sano: nessuna ragione dichiarata", st.assente);
    dice(!/non disegnabile/i.test(st.scheda), "progetto sano: la scheda non dice \"non disegnabile\"", st.scheda.slice(0, 80));
  }
  await pg.close();
}

/* ⛔ 27/11 — CON LA PIANTA NON DISEGNABILE NESSUN DOCUMENTO ESCE COME SE LO FOSSE.
   La guardia del 14/09 fermava il DISEGNO; i comandi che producono un documento non lo
   sapevano. Misurato premendoli tutti su una volata salvata senza spalla: la scheda CSV
   usciva con «Maglia;null×3.5 m» e «Carica totale (kg);0», il piano di carico usciva
   VUOTO e finiva nella raccolta che legge Campo, DXF e piano d'innesco a zero fori, il
   report con «Maglia — × 3,5 m», «Simula» portava in una scena senza maglia, lo scatto
   A/B salvava un progetto a zero fori. Qui si premono i bottoni VERI e si guarda che
   cosa esce: nessun file, nessuna finestra, nessun record scritto per le altre app, e un
   messaggio che dice che cosa manca. Salvare la volata resta permesso. */
const COMANDI = [
  ["btn-scheda-csv", "La scheda volata non esce"], ["btn-piano-csv", "Il piano di carico non esce"], ["btn-piano-dxf", "Il piano fori DXF non esce"],
  ["btn-innesco-xml", "Il piano d'innesco non esce"], ["btn-report", "Il report non esce"], ["sentOpen", "La volata per Sentinella non esce"],
  ["sentExport", "La volata per Sentinella non esce"], ["d2-cta", "La simulazione non parte"], ["cmpSaveA", "Lo scatto del confronto non si salva"],
];
const aggancia = (pg) => pg.evaluate(() => { window.__usc = []; const vero = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () { if (this.download) { window.__usc.push(this.download); return; } return vero.call(this); }; });
const dopo = (pg) => pg.evaluate(async () => { const G = window.__genesi.GDB; const conta = async (f) => { try { return (await f()).length; } catch (e) { return -1; } };
  return { file: window.__usc.slice(), scr: document.body.className, toast: [...document.querySelectorAll(".toast, #toast, .dw-toast")].map((t) => t.innerText.replace(/\s+/g, " ")).filter(Boolean).join(" | "),
    finestre: [...document.querySelectorAll(".gmodal")].filter((m) => getComputedStyle(m).display !== "none").map((m) => m.id),
    piani: await conta(() => G.piani()), previste: await conta(() => G.previste()), confronti: await conta(() => G.confronti()) }; });
console.log("\n· con la pianta non disegnabile, nessun documento esce come se lo fosse");
{
  const pg = await apriSenza(["B"]);
  const st = await stato(pg);
  if (!st.navigato || st.assente !== "burden") nonMisurati.push("i documenti senza pianta (la volata senza spalla non si è aperta nel 2D)");
  else {
    await aggancia(pg);
    let finestre = 0; pg.on("popup", (p) => { finestre++; p.close().catch(() => {}); });
    for (const [id, frase] of COMANDI) {
      await pg.evaluate(() => { window.__usc.length = 0; });
      await pg.evaluate((i) => document.getElementById(i).click(), id); await pg.waitForTimeout(900);
      const q = await dopo(pg);
      dice(q.file.length === 0 && q.finestre.length === 0 && q.scr.includes("scr-design") && q.toast.includes(frase + ": la pianta non è disegnabile — manca la spalla. Scrivi il dato nei Parametri volata"),
        `⛔ ${id}: niente esce, la schermata resta quella, e il messaggio dice «${frase}… manca la spalla» e dove scriverla`, JSON.stringify(q));
      if (!q.scr.includes("scr-design")) { await pg.click('#bottomnav button[data-scr="design"]').catch(() => {}); await pg.waitForTimeout(400); }
      await pg.evaluate(() => { for (const c of ["sentClose", "cmpClose"]) { const e = document.getElementById(c); if (e) e.click(); } });
    }
    const fine = await dopo(pg);
    dice(finestre === 0 && fine.piani === 0 && fine.previste === 0 && fine.confronti === 0,
      "⛔ e NIENTE è stato scritto per le altre app: zero piani per Campo, zero volate previste per Sentinella, zero scatti — e nessuna finestra di stampa aperta", JSON.stringify([finestre, fine.piani, fine.previste, fine.confronti]));
    /* salvare resta permesso: è il modo di non perdere il lavoro — e la riga in Home lo dice */
    await pg.click("#btn-salva-volata"); await pg.waitForSelector("#modal-campo", { timeout: 4000 }).catch(() => {});
    await pg.fill("#modal-campo", "Banco · senza spalla").catch(() => {}); await pg.click("#modal-foot .mbtn.primary").catch(() => {}); await pg.waitForTimeout(600);
    const salvata = (await pg.evaluate(async () => window.__genesi.GDB.volate())).find((v) => v.nome === "Banco · senza spalla");
    dice(!!salvata, "salvare la volata resta permesso: non si perde il lavoro per un dato che manca", String(!!salvata));
    dice(!!salvata && salvata.sintesi === "pianta non disegnabile — manca la spalla", `⛔ e la riga che resta in Home lo dice («${salvata && salvata.sintesi}»), non «0 fori · 0 kg»`, salvata && salvata.sintesi);
    dice(pg.__errori.length === 0, "nessun errore di pagina premendo i nove comandi", pg.__errori[0]);
  }
  await pg.close();
}
/* il verso opposto: sul progetto sano gli stessi comandi producono i loro documenti */
console.log("\n· il verso opposto: con la pianta disegnata i documenti escono");
{
  const pg = await apriSenza([]);
  const st = await stato(pg);
  if (!st.navigato || st.n !== 12) nonMisurati.push("i documenti sul progetto sano (la volata non si è aperta nel 2D)");
  else {
    await aggancia(pg);
    for (const id of ["btn-scheda-csv", "btn-piano-csv", "btn-piano-dxf", "btn-innesco-xml", "cmpSaveA"]) { await pg.evaluate((i) => document.getElementById(i).click(), id); await pg.waitForTimeout(800); }
    const q = await dopo(pg);
    dice(["genesi_scheda_volata.csv", "genesi_piano_carico.csv", "genesi_piano_fori.dxf", "genesi_piano_innesco.xml"].every((f) => q.file.includes(f)),
      "⛔ col progetto sano scheda, piano di carico, DXF e piano d'innesco escono tutti e quattro: la guardia non è un interruttore", JSON.stringify(q.file));
    dice(q.piani === 1 && q.confronti === 1, "e il piano arriva alla raccolta per Campo, e lo scatto A si salva", JSON.stringify([q.piani, q.confronti]));
  }
  await pg.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${(CONTRO_DOC ? DIFETTI_DOCUMENTI : DIFETTI).length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato maglia assente di Genesi: ${ok} passati, ${ko} falliti  ·  40 asserzioni attese (7 per caso × 3 casi, 4 sul progetto sano, 13 sui documenti senza pianta e 2 su quelli col progetto sano)`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

/* GENESI — LA PIANTA SI LEGGE E SI TOCCA SULLO SCHERMO VERO
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-pianta-schermo.mjs [--porta=8702]
     node genesi-pianta-schermo.mjs --controprova            (la pianta torna in punti di tela: DEVE fallire)
     node genesi-pianta-schermo.mjs --controprova=dettagli   (i sei difetti di dettaglio, UNO PER VOLTA:
                                                              ognuno deve far cadere il SUO controllo)

   PERCHÉ ESISTE. Il 27/11, misurando una frase scritta sulla pianta, è uscito
   che TUTTA la pianta era scritta in punti di tela: la tela ha 960 punti di
   larghezza e il foglio la mostra a `width:100%` (al massimo 560 px). Su un
   telefono da 320 è larga 292 px: il numero di un foro (corpo 9) usciva alto
   2,7 px, le quote 3,3. E, misurato premendo: il raggio con cui si prende un
   foro era 18 punti, cioè 5,5 px — un tocco a 6 px dal centro di un foro non
   lo selezionava, ne CREAVA uno nuovo. Nessun banco lo vedeva: il testo di
   una tela non sta nel DOM, e i banchi che toccano i fori li toccano al
   centro esatto.
   Adesso la pianta si disegna in px di schermo. Questo banco lo pretende
   chiedendo al BROWSER che cosa è stato scritto — registra ogni testo e ogni
   cerchio che la pagina disegna sulla tela, con la trasformazione attiva in
   quel momento — invece di calcolarlo.

   CHE COSA PRETENDE, a 320, 430 e 1280 px di schermo:
     · in sei viste (base, foro scelto, isocrone, relief, energia, innesco) e
       con gli strumenti Fronte e Tratto: ogni testo è alto almeno 9 px veri,
       sta dentro la tela, non si sovrappone a un altro testo e — dove i fori
       stanno fermi — non sta sopra un foro;
     · i cerchi dei fori sono DOVE la mappatura per chi tocca (`D2._m`) dice
       che sono: se le due cose si scostano, ogni tocco cade nel posto
       sbagliato;
     · la tela tiene i suoi 960 punti (la nitidezza non si paga);
     · col DITO, a 320 e 430: un tocco a 10 px dal centro di un foro lo
       sceglie e non ne crea un altro; un tocco lontano da tutti ne crea uno.
       Col mouse, a 1280: 12 px scelgono, 30 px creano;
     · con una maglia FITTA (20 fori per fila, 3 file): due pallini vicini non
       si sovrappongono, e il numero del foro o si legge (almeno 7 px) o non
       c'è — mai un numero da 3 px.

   E I GESTI (27/11, più tardi). Misurato coi tocchi veri, a più dita: una
   passata verticale partita dal vuoto della pianta — chi vuole scorrere la
   pagina — creava un foro; un pizzico sul vuoto ne creava DUE; un pizzico
   partito su due fori ne spostava uno di 14 metri. Adesso un dito conduce,
   il secondo annulla il gesto del primo, e col dito un foro nasce quando il
   dito si alza senza essersi mosso. Qui si rifanno quei tre gesti (più un
   secondo dito che arriva a metà di un trascinamento) e si pretende che
   NESSUN foro nasca o si sposti; e, nel verso opposto, che trascinare un
   foro con un dito lo sposti ancora.

   ⚠️ CHE COSA NON GUARDA: il fronte modellato a mano con molti punti, i tratti
   importati da un DXF, il piede; le maglie con più di 20 fori per fila (lì i
   pallini restano da 4 px e si toccano: è il limite di una pianta senza
   ingrandimento, dichiarato in roadmap); il contrasto dei colori sulla tela.
   Con gli strumenti Fronte e Tratto non si controlla «nessun testo sopra un
   foro»: il gesto di prova sposta il fronte, e i fori con lui. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTRO_DETT = process.argv.includes("--controprova=dettagli");
const CONTROPROVA = process.argv.includes("--controprova") || CONTRO_DETT;
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8702;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: la pianta torna a misurarsi in punti di tela — una riga sola,
   che è la radice. Sta a parte dalle altre perché le MASCHERA: senza la scala
   la pianta è larga 960 «px», non è mai stretta, e i sei dettagli qui sotto
   non avrebbero niente da rompere. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "  const kT=scalaTestoTela(cv.width, cv.getBoundingClientRect().width), W=cv.width/kT;",
   "  const kT=1, W=cv.width/kT;"],
];
/* LA SECONDA CONTROPROVA, `--controprova=dettagli`: la scala resta, e tornano uno per uno i
   difetti che lo scatto a 320 ha mostrato mentre la si metteva. */
const DIFETTI_DETTAGLI = [
  /* la presa torna quella fissa: 18 punti di tela, 5,5 px su un telefono */
  ["apps/genesi/genesi.html", "  let i=d2HitTest(D2, p.x,p.y, _presaPx(e, true));\n", "  let i=d2HitTest(D2, p.x,p.y);\n"],
  /* il pallino torna 9 px comunque: con 20 fori per fila si sovrappongono */
  ["apps/genesi/genesi.html", "  const rF=raggioForoTela(Math.min(D2.S, D2.bf||D2.B)*scale), rr=rF/9;", "  const rF=9, rr=1;"],
  /* la scritta del fronte e le quote tornano fra il fronte e la prima fila, sopra i fori */
  ["apps/genesi/genesi.html", "  const bassa=D2.B*Math.min(scaleW, (_Hc0-padBot-padTop0)/depthTot) < 44;", "  const bassa=false;"],
  /* la legenda torna su una riga sola: esce dalla tela */
  ["apps/genesi/genesi.html", "  return righeDiVoci(larg, larghezzaMax).map(r=>r.map(i=>({ i, w:larg[i] })));", "  return righeDiVoci(larg, Infinity).map(r=>r.map(i=>({ i, w:larg[i] })));"],
  /* il suggerimento in fondo torna su una riga sola */
  ["apps/genesi/genesi.html", "  const _suggRighe=cMis.measureText(_sugg).width>W-24 ? _sugg.split(' · ') : [_sugg];", "  const _suggRighe=[_sugg];"],
  /* la mappatura per chi tocca torna in px di schermo mentre chi tocca parla in punti di tela */
  ["apps/genesi/genesi.html", "  D2._m={scale:scale*kT, startX:startX*kT, faceY:faceY*kT, u:kT};", "  D2._m={scale, startX, faceY, u:kT};"],
  /* i tocchi tornano com'erano: ogni dito è un gesto a sé, e si crea posandolo */
  ["apps/genesi/genesi.html",
   "cv.addEventListener('pointerdown',d2PuntGiu); cv.addEventListener('pointermove',d2PuntMuove); window.addEventListener('pointerup',e=>d2PuntSu(e,false)); window.addEventListener('pointercancel',e=>d2PuntSu(e,true));",
   "cv.addEventListener('pointerdown',d2Down); cv.addEventListener('pointermove',d2Move); window.addEventListener('pointerup',d2Up);"],
];
const TABELLA = CONTRO_DETT ? DIFETTI_DETTAGLI : DIFETTI;
/* ⛔ UNO PER VOLTA. La prima stesura rimetteva i sei dettagli insieme, e uno solo — la
   mappatura per chi tocca — ne copriva quattro: senza i cerchi dove la mappatura li dichiara,
   «nessun testo sopra un foro» e «i pallini non si sovrappongono» cadevano TUTTI per quella
   ragione, non per il difetto che dovevano provare (40 KO, e non si sapeva di chi). Quindi
   il server serve un difetto solo (`ATTIVE`), e per ognuno si pretende che cada il controllo
   che lo riguarda (`BERSAGLI`, nello stesso ordine della tabella). */
let ATTIVE = TABELLA;

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
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-pianta-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-pianta-${process.pid}`)).text();
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

console.log(`\n════════ Genesi: la pianta si legge e si tocca sullo schermo vero${CONTROPROVA ? (CONTRO_DETT ? " · controprova dei dettagli" : " · controprova") : ""} ════════`);

const DESIGN = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 2, perRow: 8,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };
const FITTA = { ...DESIGN, perRow: 20, file: 3 };

/* IL REGISTRO: ogni testo e ogni cerchio che la pagina disegna sulla tela della pianta, con
   la trasformazione attiva in quel momento. Si monta PRIMA che la pagina parta. */
const REGISTRO = () => {
  const P = CanvasRenderingContext2D.prototype, ft = P.fillText, ar = P.arc;
  P.fillText = function (t, x, y) {
    if (window.__reg && this.canvas && this.canvas.id === "d2-canvas") {
      const m = this.getTransform(), px = parseFloat((this.font.match(/([\d.]+)px/) || [])[1]);
      window.__reg.testi.push({ t: String(t), x, y, w: this.measureText(String(t)).width, px, al: this.textAlign, bl: this.textBaseline, a: m.a, b: m.b, c: m.c, d: m.d, e: m.e, f: m.f });
    }
    return ft.apply(this, arguments);
  };
  P.arc = function (x, y, r) {
    if (window.__reg && this.canvas && this.canvas.id === "d2-canvas") { const m = this.getTransform(); window.__reg.archi.push({ x, y, r, a: m.a, b: m.b, e: m.e, f: m.f }); }
    return ar.apply(this, arguments);
  };
};

/* apre una volata salvata dalla via vera: `localStorage` → Home → «Apri» */
async function apri(larghezza, design, dito) {
  const ctx = await b.newContext({ viewport: { width: larghezza, height: 950 }, hasTouch: !!dito });
  const pg = await ctx.newPage();
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.addInitScript(REGISTRO);
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
  await pg.evaluate(() => { const c = document.getElementById("d2-canvas"); if (c) c.scrollIntoView({ block: "center" }); });
  await pg.waitForTimeout(250);
  pg.__errori = errori; pg.__ctx = ctx;
  return pg;
}
const pronta = (pg) => pg.evaluate(() => document.body.className.includes("scr-design") && !!window.__genesi && window.__genesi.D2.holes.length > 0);

/* fa ridisegnare la pianta col registro acceso e riporta tutto in PX DI SCHERMO, relativi alla tela */
const leggi = (pg) => pg.evaluate(async () => {
  const cv = document.getElementById("d2-canvas"), r = cv.getBoundingClientRect(), k = cv.width / r.width;
  window.__reg = { testi: [], archi: [] };
  window.dispatchEvent(new Event("resize"));
  await new Promise((f) => setTimeout(f, 120));
  const reg = window.__reg; window.__reg = null;
  const D = window.__genesi.D2, m = D._m;
  const testi = reg.testi.map((q) => {
    const base = Math.abs(q.b) < 1e-6 && Math.abs(q.c) < 1e-6 && Math.abs(q.e) < 1e-6 && Math.abs(q.f) < 1e-6;
    const corpo = q.px * Math.hypot(q.a, q.b) / k, W = q.w * q.a / k, X = q.x * q.a / k, Y = q.y * q.d / k;
    const x0 = q.al === "center" ? X - W / 2 : q.al === "right" || q.al === "end" ? X - W : X;
    const y0 = q.bl === "middle" ? Y - corpo / 2 : Y - corpo * 0.8;
    return { t: q.t, corpo: +corpo.toFixed(2), base, numero: /^\d+([.,]\d+)?$/.test(q.t.trim()), x0: +x0.toFixed(1), x1: +(x0 + W).toFixed(1), y0: +y0.toFixed(1), y1: +(y0 + corpo).toFixed(1) };
  });
  /* i fori, dove la mappatura per chi tocca dice che sono (punti di tela), e il cerchio più
     piccolo che la pagina ha disegnato lì: il pallino */
  const archiBase = reg.archi.filter((a) => Math.abs(a.b) < 1e-6 && Math.abs(a.e) < 1e-6 && Math.abs(a.f) < 1e-6);
  let senzaCerchio = 0, raggio = Infinity;
  const fori = D.holes.map((h) => {
    const px = m.startX + h.mx * m.scale, py = m.faceY + h.my * m.scale;
    const qui = archiBase.filter((a) => Math.hypot(a.x * a.a - px, a.y * a.a - py) < 0.75);
    if (!qui.length) senzaCerchio++; else raggio = Math.min(raggio, ...qui.map((a) => a.r * a.a / k));
    return { x: px / k, y: py / k };
  });
  return { k: +k.toFixed(3), larga: +r.width.toFixed(1), alta: +r.height.toFixed(1), punti: cv.width, testi, fori, senzaCerchio, raggio: Number.isFinite(raggio) ? +raggio.toFixed(2) : null,
    passo: +(Math.min(D.S, D.bf || D.B) * m.scale / k).toFixed(2), sel: D.sel, n: D.holes.length };
});

const fuoriTela = (L) => L.testi.filter((q) => q.base && (q.x0 < -1 || q.x1 > L.larga + 1 || q.y0 < -1 || q.y1 > L.alta + 1)).map((q) => `«${q.t}» [${q.x0}…${q.x1} su ${L.larga}]`);
const sovrapposti = (L) => { const v = L.testi.filter((q) => q.base && !q.numero), fuori = [];
  for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) { const a = v[i], c = v[j];
    if (a.x0 < c.x1 - 1 && c.x0 < a.x1 - 1 && a.y0 < c.y1 - 1 && c.y0 < a.y1 - 1) fuori.push(`«${a.t}» × «${c.t}»`); }
  return fuori; };
const sopraUnForo = (L) => { const fuori = [];
  for (const q of L.testi.filter((q) => q.base && !q.numero)) for (const f of L.fori) {
    const dx = Math.max(q.x0 - f.x, 0, f.x - q.x1), dy = Math.max(q.y0 - f.y, 0, f.y - q.y1);
    if (Math.hypot(dx, dy) < (L.raggio || 0) - 0.5) { fuori.push(`«${q.t}»`); break; } }
  return fuori; };
const centro = async (pg, i) => { const L = await leggi(pg); const c = await pg.locator("#d2-canvas").boundingBox(); return { x: c.x + L.fori[i].x, y: c.y + L.fori[i].y, c, L }; };

/* ───── 1 · LE VISTE: che cosa è scritto, quanto è alto, dove sta ───── */
const VISTE = [
  ["base", async () => {}, async () => {}, true],
  ["foro scelto", async (pg) => { const q = await centro(pg, 2); await pg.mouse.click(q.x, q.y); }, async () => {}, true],
  ["isocrone", async (pg) => { await pg.click("#dlIso"); }, async (pg) => { await pg.click("#dlIso"); }, true],
  ["relief", async (pg) => { await pg.click("#dlRel"); }, async (pg) => { await pg.click("#dlRel"); }, true],
  ["energia", async (pg) => { await pg.click("#dlEne"); }, async (pg) => { await pg.click("#dlEne"); }, true],
  ["innesco", async (pg) => { await pg.click("#dlInn"); }, async (pg) => { await pg.click("#dlInn"); }, true],
  ["strumento Fronte, un punto scelto", async (pg) => { await pg.click("#dtFronte"); const c = await pg.locator("#d2-canvas").boundingBox(); await pg.mouse.click(c.x + c.width * 0.5, c.y + c.height * 0.45); }, async () => {}, false],
  ["strumento Tratto", async (pg) => { await pg.click("#dtTratto"); }, async () => {}, false],
];
async function viste(larghezze) {
  for (const larghezza of larghezze) {
    console.log(`\n· schermo da ${larghezza} px`);
    const pg = await apri(larghezza, DESIGN, false);
    if (!(await pronta(pg))) { nonMisurati.push(`le viste a ${larghezza} px (la volata non si è aperta nel 2D)`); await pg.__ctx.close(); continue; }
    let contati = 0;
    for (const [nome, entra, esce, foriFermi] of VISTE) {
      await entra(pg); await pg.waitForTimeout(250);
      await pg.evaluate(() => document.getElementById("d2-canvas").scrollIntoView({ block: "center" }));
      const L = await leggi(pg);
      contati += L.testi.length;
      const piccoli = L.testi.filter((q) => q.corpo < 9 - 0.05).map((q) => `«${q.t}» ${q.corpo} px`);
      dice(L.testi.length >= 4 && piccoli.length === 0, `⛔ ${larghezza} · ${nome}: ogni testo della pianta è alto almeno 9 px veri (${L.testi.length} testi scritti)`, piccoli.slice(0, 4).join(" · ") || `solo ${L.testi.length} testi`);
      const fuori = fuoriTela(L);
      dice(fuori.length === 0, `${larghezza} · ${nome}: nessun testo esce dalla tela`, fuori.slice(0, 3).join(" · "));
      const sopra = sovrapposti(L);
      dice(sopra.length === 0, `${larghezza} · ${nome}: nessun testo sta sopra un altro`, sopra.slice(0, 3).join(" · "));
      if (foriFermi) {
        const sf = sopraUnForo(L);
        dice(L.raggio !== null && sf.length === 0, `⛔ ${larghezza} · ${nome}: nessun testo sta sopra un foro`, L.raggio === null ? "nessun pallino trovato dove la mappatura dice che sono i fori" : sf.slice(0, 4).join(" · "));
      }
      if (nome === "base") {
        dice(L.senzaCerchio === 0, `⛔ ${larghezza}: i ${L.n} fori sono disegnati DOVE la mappatura per chi tocca dice che sono`, `${L.senzaCerchio} fori senza un cerchio nel punto dichiarato`);
        dice(L.punti === 960, `${larghezza}: la tela tiene i suoi 960 punti (un px di schermo ne vale ${L.k})`, L.punti);
      }
      await esce(pg); await pg.waitForTimeout(150);
    }
    console.log(`      (${contati} testi letti in ${VISTE.length} viste)`);
    dice(pg.__errori.length === 0, `${larghezza}: nessun errore di pagina in tutte le viste`, pg.__errori[0]);
    await pg.__ctx.close();
  }
}

/* ───── 2 · IL TOCCO: scegliere un foro senza centrarlo, e crearne uno dove non ce n'è ───── */
const TOCCHI = [[320, true, 10, 30], [430, true, 10, 34], [1280, false, 12, 30]];
async function tocco(casi) {
  console.log("\n· il tocco");
  for (const [larghezza, dito, vicino, lontano] of casi) {
    const pg = await apri(larghezza, DESIGN, dito);
    if (!(await pronta(pg))) { nonMisurati.push(`il tocco a ${larghezza} px (la volata non si è aperta nel 2D)`); await pg.__ctx.close(); continue; }
    const tocca = async (x, y) => { if (dito) await pg.touchscreen.tap(x, y); else await pg.mouse.click(x, y); await pg.waitForTimeout(300); };
    const come = dito ? "col dito" : "col mouse";
    const q = await centro(pg, 2), prima = q.L.n;
    await tocca(q.x, q.y + vicino);
    let s = await pg.evaluate(() => ({ n: window.__genesi.D2.holes.length, sel: window.__genesi.D2.sel }));
    dice(s.n === prima && s.sel === 2, `⛔ ${larghezza} · ${come}: un tocco a ${vicino} px dal centro del foro 3 lo SCEGLIE, e non ne crea uno nuovo (fori a ${q.L.passo} px l'uno dall'altro)`, JSON.stringify({ prima, ...s }));
    /* sotto l'ultima fila, lontano da tutti: lì un tocco crea */
    const ultimo = q.L.fori.reduce((a, f) => (f.y > a.y ? f : a), q.L.fori[0]);
    const dentro = q.c.y + ultimo.y + lontano < q.c.y + q.c.height - 2;
    if (!dentro) nonMisurati.push(`la creazione di un foro a ${larghezza} px (sotto l'ultima fila non c'è posto nella tela)`);
    else {
      const n0 = s.n;
      await tocca(q.c.x + ultimo.x, q.c.y + ultimo.y + lontano);
      s = await pg.evaluate(() => ({ n: window.__genesi.D2.holes.length }));
      dice(s.n === n0 + 1, `${larghezza} · ${come}: un tocco a ${lontano} px da ogni foro ne crea uno nuovo — il gesto di sempre resta`, JSON.stringify({ prima: n0, dopo: s.n }));
    }
    dice(pg.__errori.length === 0, `${larghezza}: nessun errore di pagina toccando`, pg.__errori[0]);
    await pg.__ctx.close();
  }
}

/* ───── 3 · LA MAGLIA FITTA: 20 fori per fila ───── */
async function fitta(larghezze) {
  console.log("\n· la maglia fitta (20 fori per fila, 3 file)");
  for (const larghezza of larghezze) {
    const pg = await apri(larghezza, FITTA, false);
    if (!(await pronta(pg))) { nonMisurati.push(`la maglia fitta a ${larghezza} px (la volata non si è aperta nel 2D)`); await pg.__ctx.close(); continue; }
    const L = await leggi(pg);
    dice(L.raggio !== null && 2 * L.raggio <= L.passo + 0.5, `⛔ ${larghezza} · fitta: due pallini vicini non si sovrappongono (raggio ${L.raggio} px, fori a ${L.passo} px)`, JSON.stringify({ raggio: L.raggio, passo: L.passo, senzaCerchio: L.senzaCerchio }));
    const numeri = L.testi.filter((q) => q.base && /^\d+$/.test(q.t.trim()));
    const illeggibili = numeri.filter((q) => q.corpo < 7 - 0.05);
    dice(illeggibili.length === 0 && (numeri.length === 0 || numeri.length === L.n), `${larghezza} · fitta: il numero del foro o si legge (almeno 7 px) o non c'è — ${numeri.length ? `${numeri.length} numeri da ${Math.min(...numeri.map((q) => q.corpo))} px` : "non scritti: pallini da " + L.raggio + " px"}`, illeggibili.slice(0, 3).map((q) => `«${q.t}» ${q.corpo} px`).join(" · ") || `${numeri.length} numeri su ${L.n} fori`);
    const altri = L.testi.filter((q) => !(q.base && /^\d+$/.test(q.t.trim())) && q.corpo < 9 - 0.05);
    dice(altri.length === 0 && fuoriTela(L).length === 0, `${larghezza} · fitta: tutti gli altri testi sono alti almeno 9 px e dentro la tela`, altri.concat(fuoriTela(L)).slice(0, 3).map((q) => (q.t ? `«${q.t}» ${q.corpo} px` : q)).join(" · "));
    await pg.__ctx.close();
  }
}

/* ───── 4 · I GESTI: che cosa NON deve creare né spostare niente, coi tocchi veri a più dita ───── */
async function gesti(larghezze) {
  console.log("\n· i gesti col dito");
  for (const larghezza of larghezze) {
    const pg = await apri(larghezza, DESIGN, true);
    if (!(await pronta(pg))) { nonMisurati.push(`i gesti a ${larghezza} px (la volata non si è aperta nel 2D)`); await pg.__ctx.close(); continue; }
    const cdp = await pg.__ctx.newCDPSession(pg);
    const dita = (type, pts) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: pts.map((p, i) => ({ x: p[0], y: p[1], id: i + 1, radiusX: 8, radiusY: 8, force: 1 })) });
    const foto = () => pg.evaluate(() => { const D = window.__genesi.D2; return { fori: D.holes.map((h) => [h.mx, h.my]), annulla: window.__genesi.d2UndoLen }; });
    const uguale = (a, c) => JSON.stringify(a.fori) === JSON.stringify(c.fori) && a.annulla === c.annulla;
    const q = await centro(pg, 2), c = q.c, L = q.L;
    const ultimo = L.fori.reduce((a, f) => (f.y > a.y ? f : a), L.fori[0]);
    const vuotoY = c.y + ultimo.y + 30, lontano = L.fori.every((f) => Math.hypot(f.x - c.width * 0.5, f.y - (ultimo.y + 30)) > 24);
    if (!(vuotoY < c.y + c.height - 2) || !lontano) { nonMisurati.push(`i gesti a ${larghezza} px (sotto l'ultima fila non c'è un punto lontano da ogni foro)`); await pg.__ctx.close(); continue; }
    /* a · la passata di chi vuole scorrere la pagina: parte dal vuoto e sale di 150 px, attraversando i fori */
    let prima = await foto(); const x = c.x + c.width * 0.5;
    await dita("touchStart", [[x, vuotoY]]); for (let k = 1; k <= 6; k++) { await dita("touchMove", [[x, vuotoY - k * 25]]); await pg.waitForTimeout(16); } await dita("touchEnd", []); await pg.waitForTimeout(250);
    let dopo = await foto();
    dice(uguale(prima, dopo), `⛔ ${larghezza} · una passata di 150 px partita dal vuoto della pianta non crea e non sposta nessun foro (prima ne creava uno)`, JSON.stringify({ fori: [prima.fori.length, dopo.fori.length], annulla: [prima.annulla, dopo.annulla] }));
    /* b · un pizzico sul vuoto */
    prima = await foto(); const xa = c.x + c.width * 0.40, xb = c.x + c.width * 0.60;
    await dita("touchStart", [[xa, vuotoY]]); await pg.waitForTimeout(30); await dita("touchStart", [[xa, vuotoY], [xb, vuotoY]]);
    for (let k = 1; k <= 6; k++) { await dita("touchMove", [[xa - k * 6, vuotoY], [xb + k * 6, vuotoY]]); await pg.waitForTimeout(16); } await dita("touchEnd", []); await pg.waitForTimeout(250);
    dopo = await foto();
    dice(uguale(prima, dopo), `⛔ ${larghezza} · un pizzico con due dita sul vuoto non crea nessun foro (prima ne creava due)`, JSON.stringify({ fori: [prima.fori.length, dopo.fori.length], annulla: [prima.annulla, dopo.annulla] }));
    /* c · un pizzico che parte SU due fori */
    prima = await foto(); const A = [c.x + L.fori[2].x, c.y + L.fori[2].y], B = [c.x + L.fori[5].x, c.y + L.fori[5].y];
    await dita("touchStart", [A]); await pg.waitForTimeout(30); await dita("touchStart", [A, B]);
    for (let k = 1; k <= 6; k++) { await dita("touchMove", [[A[0] - k * 6, A[1]], [B[0] + k * 6, B[1]]]); await pg.waitForTimeout(16); } await dita("touchEnd", []); await pg.waitForTimeout(250);
    dopo = await foto();
    dice(uguale(prima, dopo), `⛔ ${larghezza} · un pizzico partito su due fori non ne sposta nessuno (prima uno finiva a 14 metri)`, JSON.stringify(dopo.fori.map((f, i) => [i, +(f[0] - prima.fori[i][0]).toFixed(2)]).filter((z) => z[1] !== 0)));
    /* d · il secondo dito che arriva A METÀ di un trascinamento: il foro torna dov'era */
    prima = await foto();
    await dita("touchStart", [A]); for (let k = 1; k <= 3; k++) { await dita("touchMove", [[A[0] + k * 8, A[1]]]); await pg.waitForTimeout(16); }
    const aMeta = await foto();
    await dita("touchStart", [[A[0] + 24, A[1]], B]); for (let k = 1; k <= 3; k++) { await dita("touchMove", [[A[0] + 24 + k * 6, A[1]], [B[0] + k * 6, B[1]]]); await pg.waitForTimeout(16); } await dita("touchEnd", []); await pg.waitForTimeout(250);
    dopo = await foto();
    dice(aMeta.fori[2][0] !== prima.fori[2][0] && uguale(prima, dopo), `⛔ ${larghezza} · un secondo dito a metà di un trascinamento lo annulla: il foro, che si stava muovendo, torna dov'era`, JSON.stringify({ prima: prima.fori[2], aMeta: aMeta.fori[2], dopo: dopo.fori[2], annulla: [prima.annulla, dopo.annulla] }));
    /* e · il verso opposto: UN dito su un foro lo trascina ancora */
    prima = await foto();
    await dita("touchStart", [A]); for (let k = 1; k <= 4; k++) { await dita("touchMove", [[A[0], A[1] + k * 6]]); await pg.waitForTimeout(16); } await dita("touchEnd", []); await pg.waitForTimeout(250);
    dopo = await foto();
    dice(dopo.fori.length === prima.fori.length && dopo.fori[2][1] > prima.fori[2][1] && dopo.annulla === prima.annulla + 1 && dopo.fori.every((f, i) => i === 2 || (f[0] === prima.fori[i][0] && f[1] === prima.fori[i][1])),
      `${larghezza} · e un dito solo su un foro lo trascina ancora: quel foro si sposta, gli altri no, e il gesto si può annullare — la disciplina non è un interruttore`, JSON.stringify({ prima: prima.fori[2], dopo: dopo.fori[2], annulla: [prima.annulla, dopo.annulla] }));
    dice(pg.__errori.length === 0, `${larghezza}: nessun errore di pagina coi gesti`, pg.__errori[0]);
    await pg.__ctx.close();
  }
}

const ATTESE = 3 * (6 * 4 + 2 * 3 + 2 + 1) + (3 * 3) + (3 * 3) + (2 * 6);
let riuscita;
if (!CONTRO_DETT) {
  await viste([320, 430, 1280]); await tocco(TOCCHI); await fitta([320, 430, 1280]); await gesti([320, 430]);
  if (CONTROPROVA) {
    console.log(`(iniezioni: ${colpiti.size}/${TABELLA.length} hanno trovato il loro pezzo)`);
    dice(colpiti.size === TABELLA.length, `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${TABELLA.length})`, [...colpiti].map((x) => x.slice(0, 40)));
    /* con la pianta in punti di tela devono cadere le due cose per cui la correzione esiste */
    const leggibile = caduti.some((t) => /alto almeno 9 px veri/.test(t)), presa = caduti.some((t) => /lo SCEGLIE/.test(t));
    dice(leggibile && presa, "⛔ col difetto rimesso cadono i due controlli per cui la correzione esiste: il testo leggibile e il foro che si prende", JSON.stringify({ leggibile, presa }));
    riuscita = leggibile && presa && colpiti.size === TABELLA.length;
  }
} else {
  /* nello stesso ordine di DIFETTI_DETTAGLI: che cosa rimette, dove guardare, quale controllo deve cadere */
  const BERSAGLI = [
    ["la presa torna a 18 punti di tela", () => tocco(TOCCHI.slice(0, 2)), /lo SCEGLIE/],
    ["il pallino torna 9 px comunque", () => fitta([320]), /due pallini vicini non si sovrappongono/],
    ["la scritta del fronte e le quote tornano fra il fronte e la prima fila", () => viste([320]), /nessun testo sta sopra un foro/],
    ["la legenda torna su una riga sola", () => viste([320]), /relief: nessun testo esce dalla tela/],
    ["il suggerimento in fondo torna su una riga sola", () => viste([320]), /strumento Tratto: nessun testo esce dalla tela/],
    ["la mappatura per chi tocca torna in px di schermo", () => viste([430]), /DOVE la mappatura per chi tocca dice che sono/],
    ["i tocchi tornano com'erano: ogni dito un gesto a sé", () => gesti([320]), /un pizzico con due dita sul vuoto non crea nessun foro/],
  ];
  const esitiD = [];
  for (let k = 0; k < DIFETTI_DETTAGLI.length; k++) {
    ATTIVE = [DIFETTI_DETTAGLI[k]];
    const [nome, guarda, attesa] = BERSAGLI[k], da = caduti.length;
    console.log(`\n──────── dettaglio ${k + 1}/${DIFETTI_DETTAGLI.length}, da solo: ${nome} ────────`);
    await guarda();
    const miei = caduti.slice(da);
    esitiD.push({ nome, caduti: miei.length, bersaglio: miei.some((t) => attesa.test(t)) });
  }
  console.log(`\n(iniezioni: ${colpiti.size}/${TABELLA.length} hanno trovato il loro pezzo)`);
  for (const e of esitiD) console.log(`  ${e.bersaglio ? "✔" : "✗"} ${e.nome}: ${e.caduti} controlli caduti${e.bersaglio ? ", fra cui il suo" : " — ma NON quello che lo riguarda"}`);
  riuscita = colpiti.size === TABELLA.length && esitiD.every((e) => e.bersaglio);
}
if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}) — non è «a posto», è «non ho guardato»:`);
  for (const x of nonMisurati) console.log(`   · ${x}`);
}
console.log(`\nRisultato pianta sullo schermo di Genesi: ${ok} passati, ${ko} falliti  ·  ${ATTESE} asserzioni attese nel passaggio sano (33 per larghezza × 3 nelle viste, 9 sul tocco, 9 sulla maglia fitta, 12 sui gesti)`);
await b.close();
srv.close();
/* una controprova RIUSCITA esce 0: ha fallito come doveva, con tutte le iniezioni sul bersaglio
   (è la convenzione che `tutti.mjs` dichiara: il banco gira il verdetto da sé). Sotto
   controprova un soggetto «non misurato» è ammesso: è il difetto rimesso a renderlo
   irraggiungibile — con la pianta in punti di tela, sotto l'ultima fila non resta posto. */
if (!CONTROPROVA) riuscita = ko === 0 && nonMisurati.length === 0;
if (CONTROPROVA) console.log(riuscita ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade, e cade dove deve" : "✗ CONTROPROVA FALLITA: il banco non distingue, o un'iniezione non ha trovato il suo pezzo");
process.exitCode = riuscita ? 0 : 1;

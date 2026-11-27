/* GENESI — OGNI COMANDO DEL PROGETTO 2D STA NELLA COLONNA DELLA PAGINA
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-colonna-progetto.mjs [--porta=8701]
     node genesi-colonna-progetto.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 27/11, guardando gli scatti del Progetto 2D coi valori per
   foro accesi, in fondo alla schermata gli ultimi comandi — i due scatti A/B
   col confronto, riconciliazione, signature-hole, legge di sito, Sentinella —
   andavano DA BORDO A BORDO: a 430 px toccavano i due lati dello schermo, e
   misurati a 1280 px erano bottoni larghi 1280 px sotto una colonna di 560.
   Erano figli diretti della schermata, che è una colonna flessibile, e si
   allargavano quanto lei. Tutto il resto della pagina sta in una colonna con
   14 px di margine: loro no.
   Nessun banco lo vedeva, e non per caso: `fuori-schermo` chiede «esce dallo
   schermo?», e un bottone largo ESATTAMENTE quanto lo schermo non esce. È la
   seconda domanda che mancava — non «esce?», ma «tocca il bordo?».
   La stessa misura ha trovato un secondo caso che lo scatto a 430 non
   mostrava: a 320 px «Confronta spalla (burden) per lo stesso obiettivo»
   arrivava a 4 px dai due lati.

   CHE COSA PRETENDE, a 320, 430, 768 e 1280 px, per ogni comando visibile del
   Progetto 2D (bottoni, campi, tendine, link):
     · almeno 12 px dai due bordi dello schermo;
     · non più largo della colonna (560 px).
   E il denominatore: quanti comandi ha misurato a ogni larghezza — se la
   schermata non si è aperta la risposta «nessuno al bordo» varrebbe zero.
   I rettangoli orizzontali non dipendono da quanto si è scorso in verticale:
   si misurano tutti senza scorrere.

   E, DALLA STESSA GIORNATA, LA DOMANDA SUL DITO. Misurando i margini è uscito
   che 49 comandi su 71 erano sotto i 44×44 px che il resto della casa pretende
   (`--tap` nello stile condiviso): intestazioni delle sezioni 36, strumenti 30,
   comandi in fondo 32 e 26-27, annulla e ripeti 32×32, e l'occhio e il
   lucchetto di ogni livello 17×17. A 430 e a 320 px ogni comando visibile deve
   offrire un bersaglio di almeno 44×44: il suo rettangolo, o quello
   dell'etichetta che lo avvolge.

   E LA HOME (27/11, stessa misura): i tre comandi di ogni volata salvata
   erano 34×19, 49×19 e 24×19 px — «✕» (elimina) a 8 px da «Duplica» — e i
   comandi sotto gli elenchi 30 px. Si salva una volata col bottone vero, si va
   in Home e si fanno le stesse due domande; e a 320 px i tre comandi devono
   stare SOTTO la riga che descrive la volata, non accanto a stringerla.

   E LE FINESTRE, LA SCHEDA DEL FORO, LA TABELLA E LA SCENA 3D (27/11, E7): il
   banco dichiarava di non guardarle, e lì dentro la misura ha contato 35
   comandi su 74 sotto i 44 px nelle finestre e sopra la scena 3D (bottoni
   piccoli alti 26, campi 28, play 40×40), 22 su 22 nel pannello dei parametri
   della scena, 9 su 9 nella scheda del foro e 53 nella tabella dei fori (tutti
   a 40). Due cose in più, trovate guardando e poi contate:
     · cinque campi BIANCHI come quelli nudi del browser nel pannello dei
       parametri: la regola che li vestiva chiedeva `type=number`, e i campi
       decimali sono `type=text`;
     · fra 381 e 414 px di schermo la tabella dei fori scorreva DI LATO (26 px
       a 390): la soglia della tabella compatta era 380, quella a sette colonne
       ci sta da 428 in su, e i banchi misurano a 320 e a 430.
   Qui si aprono le sette finestre coi bottoni veri, si sceglie un foro, si
   apre la tabella a sette larghezze, si va nella scena 3D e si apre il
   pannello dei parametri: stesse due domande, più «nessun campo è bianco» e
   «la tabella non scorre di lato».

   E i comandi che compaiono solo in certi momenti, fatti comparire: gli
   strumenti su due fori scelti, quelli del tratto, e le opzioni dei livelli
   accesi (queste ultime erano 38-40 px).

   ⚠️ CHE COSA NON GUARDA: la modellazione del fronte nella scena 3D (sul
   telefono il suo bottone non c'è: misurato, nascosto a 320 e 430); e il
   pannello dei parametri sul COMPUTER, dove è un pannello laterale fitto di proposito: la
   regola dei 44 px lì vale sotto i 900 px o con un puntatore grosso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8701;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE: il contenitore degli ultimi comandi smette di essere
   una colonna (i suoi figli tornano figli della schermata, larghi quanto lei),
   i comandi centrati tornano senza tetto, e la riga dei due scatti torna
   attaccata al bordo sinistro. */
const DIFETTI = [
  [`#d2-altri{width:100%;max-width:560px;margin:8px auto 0;padding:0 14px}`, `#d2-altri{display:contents}`],
  [`#scr-design>.btn{max-width:calc(100% - 28px);white-space:normal}`, ``],
  [`#d2-altri .d2-ab{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}`, `#d2-altri .d2-ab{display:flex;gap:8px}`],
  /* il dito: i comandi tornano bassi, e l'occhio e il lucchetto tornano 17×17 */
  [`#scr-design>.btn,#d2-altri .btn,#d2-cta,.dc-sec-h,.dl-tog,.dt-reset,.dc-mat{min-height:44px}`, ``],
  [`.ds-occhio,.ds-lucchetto{min-width:44px;min-height:44px;padding:0}`, ``],
  [`@media(max-width:340px){ #d2-tools .dt-seg{flex:1 1 100%;display:flex} #d2-tools .dt-seg button{flex:1;padding-left:4px;padding-right:4px} }`, ``],
  /* la Home: i comandi tornano bassi, e i tre di ogni volata tornano accanto al testo */
  [`.hg-item button{min-height:44px;min-width:44px}`, ``],
  [`.hg-actions .btn{min-height:44px;display:inline-flex;align-items:center}`, ``],
  [`@media(max-width:560px){ .hg-item{flex-wrap:wrap} .hg-item .t{flex:1 1 100%} .hg-item .t+button{margin-left:auto} }`, ``],
  /* E7: i bottoni piccoli tornano bassi, il play 40×40, la ✕ 30×30, i campi delle finestre 28 */
  [`.btn.sm{min-height:44px;min-width:44px}`, ``],
  [`#play{width:44px;height:44px}`, ``],
  [`.ei-h button{width:44px;height:44px;flex:none}`, ``],
  [`.gmodal-card input[type=number],.gmodal-card input[type=text],.modal-body input{min-height:44px}`, ``],
  /* il pannello dei parametri della scena 3D: campi e spunte tornano bassi */
  [`  #params .row input,#params .row select,#meas-in,#btnApply{min-height:44px}`, ``],
  [`  #params label.lay{display:flex;align-items:center;gap:8px;min-height:44px}`, ``],
  /* …e i suoi campi decimali tornano bianchi: la regola torna a vestire solo `type=number` */
  [`.row input[type=number],.row input[type=text],.row select,#meas-in{width:86px;`, `.row input[type=number],.row select{width:86px;`],
  /* la scheda del foro torna a 40 px */
  [`#d2-insp .btn.sm{min-height:44px}`, `#d2-insp .btn.sm{min-height:40px}`],
  [`outline:none;min-height:44px;font-variant-numeric:tabular-nums;transition:border-color .1`, `outline:none;min-height:40px;font-variant-numeric:tabular-nums;transition:border-color .1`],
  /* la tabella dei fori torna a 40 px: il numero del foro e i campi */
  [`text-align:left;min-height:44px;white-space:nowrap}`, `text-align:left;min-height:40px;white-space:nowrap}`],
  [`min-width:0;min-height:44px;font-variant-numeric:tabular-nums`, `min-width:0;min-height:40px;font-variant-numeric:tabular-nums`],
  /* le opzioni dei livelli tornano a 38 px */
  [`border-radius:11px;padding:4px 9px;min-height:44px}`, `border-radius:11px;padding:4px 9px;min-height:38px}`],
  /* la tabella dei fori: la soglia della compatta torna a 380 (e fra 381 e 428 scorre di lato) */
  [`@media(max-width:429px){\n  .ft-h,.ft-r{grid-template-columns:44px 46px repeat(3,minmax(48px,1fr));min-width:0}`, `@media(max-width:380px){\n  .ft-h,.ft-r{grid-template-columns:44px 46px repeat(3,minmax(48px,1fr));min-width:0}`],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-colonna-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-colonna-${process.pid}`)).text();
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

console.log(`\n════════ Genesi: ogni comando del Progetto 2D sta nella colonna${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 430, height: 900 } });
pg.__err = [];
pg.on("pageerror", (e) => pg.__err.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
const scadenza = Date.now() + 25000;
while (await pg.evaluate(() => !!document.getElementById("splash")) && Date.now() < scadenza) await pg.waitForTimeout(500);
await pg.waitForTimeout(300);
await pg.click('#bottomnav button[data-scr="design"]');
await pg.waitForTimeout(700);

const MARGINE = 12, COLONNA = 560;
const misura = () => pg.evaluate(({ MARGINE, COLONNA }) => {
  const vw = window.innerWidth, S = document.getElementById("scr-design"); let n = 0; const bordo = [], larghi = [];
  const aperta = !!S && getComputedStyle(S).display !== "none";
  for (const e of (S ? S.querySelectorAll("button, input, select, textarea, a[href]") : [])) {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    n++;
    const nome = (e.id || e.className || e.tagName).toString().slice(0, 28);
    if (r.left < MARGINE - 0.5 || r.right > vw - MARGINE + 0.5) bordo.push(`${nome} [${Math.round(r.left)} px a sinistra, ${Math.round(vw - r.right)} a destra]`);
    if (r.width > COLONNA + 0.5) larghi.push(`${nome} largo ${Math.round(r.width)} px`);
  }
  return { aperta, n, bordo, larghi };
}, { MARGINE, COLONNA });

for (const w of [320, 430, 768, 1280]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  const q = await misura();
  dice(q.aperta && q.n >= 60, `a ${w} px il Progetto 2D è aperto e i comandi misurati sono ${q.n} (almeno 60)`, q.n);
  dice(q.bordo.length === 0, `⛔ a ${w} px nessun comando sta a meno di ${MARGINE} px dai bordi dello schermo`, q.bordo.join(" · "));
  dice(q.larghi.length === 0, `⛔ a ${w} px nessun comando è più largo della colonna (${COLONNA} px)`, q.larghi.join(" · "));
}

/* i sette comandi che hanno fatto nascere il banco, detti per nome: stanno nella stessa colonna della scheda */
await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(300);
const nomi = await pg.evaluate(() => { const lato = (id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(window.innerWidth - r.right)]; };
  const sc = document.getElementById("d2-scheda"), cs = getComputedStyle(sc), rs = sc.getBoundingClientRect();
  return { colonna: [Math.round(rs.left + parseFloat(cs.paddingLeft)), Math.round(window.innerWidth - rs.right + parseFloat(cs.paddingRight))],
    larghi: ["riconOpen", "sigOpen", "sitoOpen", "sentOpen"].map(lato), scatti: ["cmpSaveA", "cmpSaveB", "cmpShow"].map(lato) }; });
dice(nomi.larghi.every((l) => l && l[0] === nomi.colonna[0] && l[1] === nomi.colonna[1]),
  `a 430 px riconciliazione, signature-hole, legge di sito e Sentinella hanno gli stessi margini della scheda volata (${nomi.colonna.join(" e ")} px): erano 0 e 0`, JSON.stringify(nomi));
dice(nomi.scatti.every((l) => l && l[0] >= nomi.colonna[0] && l[1] >= nomi.colonna[1]),
  "e i due scatti A/B col confronto stanno dentro la stessa colonna («Salva come A» partiva da 0)", JSON.stringify(nomi.scatti));

/* ── il dito: ogni comando visibile offre almeno 44×44 px ── */
const TOCCO = 44;
const bersagli = () => pg.evaluate((TOCCO) => {
  const S = document.getElementById("scr-design"); let n = 0; const piccoli = [];
  for (const e of S.querySelectorAll("button, input, select, textarea, a[href], summary")) {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    n++;
    const lab = e.closest("label"), rl = lab ? lab.getBoundingClientRect() : r;
    const w = Math.max(r.width, rl.width), h = Math.max(r.height, rl.height);
    if (w < TOCCO - 0.5 || h < TOCCO - 0.5) piccoli.push(`${(e.id || e.className || e.tagName).toString().slice(0, 24)} ${Math.round(w)}×${Math.round(h)}`);
  }
  return { n, piccoli };
}, TOCCO);
for (const w of [430, 320]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  const q = await bersagli();
  dice(q.n >= 60 && q.piccoli.length === 0, `⛔ a ${w} px ognuno dei ${q.n} comandi offre un bersaglio di almeno ${TOCCO}×${TOCCO} px (erano 49 sotto misura su 71)`, `${q.piccoli.length} sotto misura: ` + q.piccoli.slice(0, 10).join(" · "));
}
/* i due più piccoli di prima, per nome: l'occhio e il lucchetto di un livello */
const occhio = await pg.evaluate(() => [".ds-occhio", ".ds-lucchetto"].map((sel) => { const e = document.querySelector("#d2-strati " + sel); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
dice(occhio.every((x) => x && x[0] >= TOCCO && x[1] >= TOCCO), `l'occhio e il lucchetto di un livello sono ${JSON.stringify(occhio)} px: erano 17×17 e 20×17`, JSON.stringify(occhio));
/* e a 320 px gli strumenti hanno la riga per sé: annulla e ripeti stanno INSIEME sulla riga sotto */
const riga = await pg.evaluate(() => { const t = (id) => Math.round(document.getElementById(id).getBoundingClientRect().top); return { fori: t("dtFori"), tratto: t("dtTratto"), annulla: t("d2Undo"), ripeti: t("d2Redo") }; });
dice(riga.fori === riga.tratto && riga.annulla === riga.ripeti && riga.annulla > riga.fori, "a 320 px i quattro strumenti stanno su una riga, e annulla e ripeti insieme su quella sotto (prima «ripeti» andava a capo da solo)", JSON.stringify(riga));

/* ── la Home: stesse due domande, con una volata salvata dal bottone vero ── */
await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(300);
await pg.click("#btn-salva-volata"); await pg.waitForSelector("#modal-campo", { timeout: 4000 }).catch(() => {});
await pg.fill("#modal-campo", "Volata del banco sulla colonna").catch(() => {});
await pg.click("#modal-foot .mbtn.primary").catch(() => {}); await pg.waitForTimeout(600);
await pg.click('#bottomnav button[data-scr="home"]'); await pg.waitForTimeout(700);
const casa = () => pg.evaluate(({ MARGINE, TOCCO }) => {
  const vw = window.innerWidth, S = document.getElementById("scr-home"); let n = 0; const bordo = [], piccoli = [];
  const aperta = !!S && getComputedStyle(S).display !== "none";
  for (const e of (S ? S.querySelectorAll("button, input, select, textarea, a[href], summary") : [])) {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    n++;
    const nome = (e.id || e.dataset.act || e.className || e.tagName).toString().slice(0, 24);
    if (r.left < MARGINE - 0.5 || r.right > vw - MARGINE + 0.5) bordo.push(`${nome} [${Math.round(r.left)}, ${Math.round(vw - r.right)}]`);
    if (r.width < TOCCO - 0.5 || r.height < TOCCO - 0.5) piccoli.push(`${nome} ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  const riga = S ? S.querySelector("#hgVolate .hg-item") : null; let sotto = null, nRiga = 0;
  if (riga) { const t = riga.querySelector(".t").getBoundingClientRect(); const B = [...riga.querySelectorAll("button")]; nRiga = B.length; sotto = B.every((x) => x.getBoundingClientRect().top >= t.bottom - 0.5); }
  return { aperta, n, bordo, piccoli, nRiga, sotto };
}, { MARGINE, TOCCO });
for (const w of [430, 320]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  const q = await casa();
  dice(q.aperta && q.nRiga === 3 && q.n >= 8, `a ${w} px la Home è aperta, la volata salvata ha i suoi tre comandi e i comandi misurati sono ${q.n} (almeno 8)`, JSON.stringify([q.aperta, q.nRiga, q.n]));
  dice(q.piccoli.length === 0, `⛔ a ${w} px in Home ogni comando offre almeno ${TOCCO}×${TOCCO} px («Apri», «Duplica» e «✕» erano alti 19)`, q.piccoli.join(" · "));
  dice(q.bordo.length === 0, `a ${w} px in Home nessun comando sta a meno di ${MARGINE} px dai bordi`, q.bordo.join(" · "));
  if (w === 320) dice(q.sotto === true, "⛔ a 320 px i tre comandi della volata stanno SOTTO la riga che la descrive, che ha così tutta la larghezza", String(q.sotto));
}
await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);

/* ── E7 (27/11): le finestre, la scheda del foro, la tabella dei fori, la scena 3D ── */
/* i comandi DENTRO una radice aperta: misura (con l'etichetta che li avvolge), bordo, fondo dei campi */
const dentro = (sel) => pg.evaluate(({ sel, MARGINE, TOCCO }) => {
  const vw = window.innerWidth, radici = [...document.querySelectorAll(sel)].filter((e) => getComputedStyle(e).display !== "none" && e.getBoundingClientRect().width > 0);
  let n = 0; const piccoli = [], bordo = [], chiari = [];
  for (const R of radici) for (const e of R.querySelectorAll("button, input, select, textarea, a[href], summary")) {
    const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none") continue;
    n++;
    const lab = e.closest("label"), rl = lab ? lab.getBoundingClientRect() : r;
    const w = Math.max(r.width, rl.width), h = Math.max(r.height, rl.height);
    const nome = (e.id || (e.textContent || "").trim().slice(0, 16) || e.className || e.tagName).toString().slice(0, 24);
    if (w < TOCCO - 0.5 || h < TOCCO - 0.5) piccoli.push(`${nome} ${Math.round(w)}×${Math.round(h)}`);
    if (r.left < MARGINE - 0.5 || r.right > vw - MARGINE + 0.5) bordo.push(`${nome} [${Math.round(r.left)}, ${Math.round(vw - r.right)}]`);
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName) && !["checkbox", "radio", "file", "range"].includes(e.type)) {
      const c = cs.backgroundColor.match(/[\d.]+/g).map(Number);
      if ((c.length < 4 || c[3] > 0.5) && (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 > 0.5) chiari.push(nome);
    }
  }
  return { radici: radici.length, n, piccoli, bordo, chiari };
}, { sel, MARGINE, TOCCO });
const aPosto = (q, minimo) => q.radici === 1 && q.n >= minimo && q.piccoli.length === 0 && q.bordo.length === 0 && q.chiari.length === 0;
const perche = (q) => `radici ${q.radici} · comandi ${q.n} · piccoli: ${q.piccoli.slice(0, 8).join(" · ") || "—"} · al bordo: ${q.bordo.slice(0, 4).join(" · ") || "—"} · campi bianchi: ${q.chiari.join(" · ") || "—"}`;
const premi = (id) => pg.evaluate((id) => { const e = document.getElementById(id); if (!e) return false; e.scrollIntoView({ block: "center" }); e.click(); return true; }, id);
const FINESTRE = [
  ["riconOpen", "#riconModal", "riconClose", "riconciliazione", 4], ["sigOpen", "#sigModal", "sigClose", "foro singolo", 3], ["sitoOpen", "#sitoModal", "sitoClose", "legge di sito", 4],
  ["sentOpen", "#sentModal", "sentClose", "Sentinella", 2], ["cmpShow", "#cmpModal", "cmpClose", "confronto A/B", 2],
  ["btn-salva-volata", "#modal", null, "salva la volata", 3], ["btn-confronta-burden", "#modal", null, "confronta spalle", 3],
];
for (const w of [430, 320]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  /* le sette finestre, aperte col loro bottone */
  for (const [apri, sel, chiudi, nome, minimo] of FINESTRE) {
    await premi(apri); await pg.waitForTimeout(500);
    const q = await dentro(sel);
    dice(aPosto(q, minimo), `⛔ a ${w} px · finestra «${nome}»: i ${q.n} comandi offrono almeno ${TOCCO}×${TOCCO} px, stanno a ${MARGINE} px dai bordi, e nessun campo è bianco`, perche(q));
    await pg.evaluate((id) => { const e = id && document.getElementById(id); if (e) e.click();
      const an = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => /annulla|chiudi/i.test(x.textContent) && x.getBoundingClientRect().width > 0); if (an) an.click(); }, chiudi);
    await pg.waitForTimeout(350);
  }
  const rimaste = await pg.evaluate(() => [...document.querySelectorAll(".gmodal, #cmpModal, .modal-ov")].filter((e) => getComputedStyle(e).display !== "none").map((e) => e.id));
  dice(rimaste.length === 0, `a ${w} px le sette finestre si sono richiuse tutte (se una restasse aperta coprirebbe quello che si misura dopo)`, rimaste.join(" · "));
  /* la scheda del foro: si sceglie un foro toccandolo */
  await pg.evaluate(() => document.getElementById("d2-canvas").scrollIntoView({ block: "center" })); await pg.waitForTimeout(200);
  const foro = await pg.evaluate(() => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), r = c.getBoundingClientRect(), h = D.holes[2];
    return { x: r.left + (m.startX + h.mx * m.scale) / c.width * r.width, y: r.top + (m.faceY + h.my * m.scale) / c.height * r.height }; });
  await pg.mouse.click(foro.x, foro.y); await pg.waitForTimeout(400);
  const sch = await dentro("#d2-insp");
  dice(aPosto(sch, 8), `⛔ a ${w} px · scheda del foro: i ${sch.n} comandi offrono almeno ${TOCCO}×${TOCCO} px (erano tutti a 40)`, perche(sch));
  /* i comandi che compaiono solo in certi momenti, fatti comparire. Due fori scelti con Maiusc: */
  const centro = (i) => pg.evaluate((i) => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), r = c.getBoundingClientRect(), h = D.holes[i];
    return { x: r.left + (m.startX + h.mx * m.scale) / c.width * r.width, y: r.top + (m.faceY + h.my * m.scale) / c.height * r.height }; }, i);
  for (const i of [2, 4]) { const q = await centro(i); await pg.keyboard.down("Shift"); await pg.mouse.click(q.x, q.y); await pg.keyboard.up("Shift"); await pg.waitForTimeout(250); }
  const scelti = await pg.evaluate(() => window.__genesi.D2.selMulti.length);
  const str = await dentro("#d2-tools");
  dice(scelti === 2 && aPosto(str, 9), `a ${w} px · strumenti con due fori scelti: i ${str.n} comandi offrono almeno ${TOCCO}×${TOCCO} px e stanno a ${MARGINE} px dai bordi`, `fori scelti ${scelti} · ` + perche(str));
  { const q = await centro(2); await pg.mouse.click(q.x, q.y); await pg.waitForTimeout(250); }   // un clic senza Maiusc scioglie la selezione
  /* le opzioni dei livelli accesi: passo delle isocrone, finestra del relief, passo della griglia */
  for (const id of ["dlIso", "dlRel", "dlSnap"]) await premi(id); await pg.waitForTimeout(350);
  const liv = await dentro("#d2-layers");
  dice(aPosto(liv, 9), `⛔ a ${w} px · livelli accesi: i ${liv.n} comandi, opzioni comprese, offrono almeno ${TOCCO}×${TOCCO} px (le opzioni erano 38-40)`, perche(liv));
  for (const id of ["dlIso", "dlRel", "dlSnap"]) await premi(id); await pg.waitForTimeout(250);
  /* lo strumento Tratto, con un tratto cominciato */
  await premi("dtTratto"); await pg.evaluate(() => document.getElementById("d2-canvas").scrollIntoView({ block: "center" })); await pg.waitForTimeout(250);
  { const bb = await pg.locator("#d2-canvas").boundingBox(); await pg.mouse.click(bb.x + bb.width * 0.3, bb.y + bb.height * 0.6); await pg.mouse.click(bb.x + bb.width * 0.6, bb.y + bb.height * 0.7); await pg.waitForTimeout(300); }
  const tr = await dentro("#d2-tools");
  dice(aPosto(tr, 8), `a ${w} px · strumenti del tratto: i ${tr.n} comandi offrono almeno ${TOCCO}×${TOCCO} px e stanno a ${MARGINE} px dai bordi`, perche(tr));
  await premi("d2Undo"); await premi("d2Undo"); await premi("dtFori"); await pg.waitForTimeout(300);
}
/* la tabella dei fori, a SETTE larghezze: non solo 320 e 430 — è fra le due che scorreva di lato */
await premi("ft-apri"); await pg.waitForTimeout(500);
for (const w of [320, 375, 390, 412, 430, 481, 561]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(400);
  /* il CORPO della tabella, non la sua intestazione: il bottone che la apre è un comando della
     schermata, già misurato più su — contato qui, sotto controprova faceva «cadere» la tabella
     per un difetto che non era suo. Due domande, due controlli: la misura e lo scorrimento. */
  const q = await dentro("#ft-corpo");
  const lato = await pg.evaluate(() => { const c = document.querySelector(".ft-h").parentElement; return { scorre: c.scrollWidth - c.clientWidth, colonne: [...document.querySelector(".ft-h").children].filter((x) => x.getBoundingClientRect().width > 0).length, pagina: document.documentElement.scrollWidth - window.innerWidth }; });
  dice(q.radici === 1 && q.n >= 50 && q.piccoli.length === 0 && q.chiari.length === 0,
    `⛔ a ${w} px · tabella dei fori (${lato.colonne} colonne): i ${q.n} comandi offrono almeno ${TOCCO}×${TOCCO} px (erano tutti a 40)`, perche(q));
  dice(lato.scorre <= 0 && lato.pagina <= 0, `⛔ a ${w} px · la tabella dei fori NON scorre di lato (${lato.colonne} colonne)`, `scorre di lato ${lato.scorre} px · pagina ${lato.pagina} px`);
}
/* la scena 3D e il suo pannello dei parametri */
for (const w of [430, 320]) {
  await pg.setViewportSize({ width: w, height: 900 }); await pg.waitForTimeout(300);
  await pg.click('#bottomnav button[data-scr="sim"]'); await pg.waitForTimeout(1200);
  /* i comandi che si possono toccare ADESSO: il punto al centro è loro (o di un loro discendente) */
  const scena = await pg.evaluate(({ MARGINE, TOCCO }) => { const vw = window.innerWidth, vh = window.innerHeight; let n = 0; const piccoli = [], bordo = [];
    for (const e of document.querySelectorAll("button, input, select, textarea, a[href]")) {
      const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= vh) continue;
      const su = document.elementFromPoint(Math.min(vw - 1, Math.max(0, r.left + r.width / 2)), Math.min(vh - 1, Math.max(0, r.top + r.height / 2)));
      if (!su || !(e === su || e.contains(su))) continue;
      n++; const nome = (e.id || (e.textContent || "").trim().slice(0, 14) || e.tagName).toString().slice(0, 22);
      if (r.width < TOCCO - 0.5 || r.height < TOCCO - 0.5) piccoli.push(`${nome} ${Math.round(r.width)}×${Math.round(r.height)}`);
      if (r.left < MARGINE - 0.5 || r.right > vw - MARGINE + 0.5) bordo.push(`${nome} [${Math.round(r.left)}, ${Math.round(vw - r.right)}]`); }
    return { n, piccoli, bordo }; }, { MARGINE, TOCCO });
  dice(scena.n >= 10 && scena.piccoli.length === 0 && scena.bordo.length === 0, `⛔ a ${w} px · scena 3D: i ${scena.n} comandi che si possono toccare offrono almeno ${TOCCO}×${TOCCO} px e stanno a ${MARGINE} px dai bordi (erano 9 su 12 sotto misura)`, `piccoli: ${scena.piccoli.join(" · ") || "—"} · al bordo: ${scena.bordo.join(" · ") || "—"}`);
  await pg.click("#btnParams"); await pg.waitForTimeout(500);
  const par = await dentro("#params");
  dice(aPosto(par, 20), `⛔ a ${w} px · pannello dei parametri della scena: i ${par.n} comandi offrono almeno ${TOCCO}×${TOCCO} px, e nessun campo è bianco (erano 22 su 22 sotto misura, e 5 campi bianchi)`, perche(par));
  /* l'approfondimento dell'esplosivo: si apre dalla ⓘ, e la sua ✕ si prende col dito */
  await premi("pEsplInfo"); await pg.waitForTimeout(400);
  const chiudi = await pg.evaluate(() => { const e = document.getElementById("ei-close"), r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
  dice(chiudi[0] >= TOCCO && chiudi[1] >= TOCCO, `a ${w} px · approfondimento: la ✕ che lo chiude è ${chiudi.join("×")} px (era 30×30)`, chiudi.join("×"));
  await premi("ei-close"); await pg.waitForTimeout(250);
  await pg.click("#btnParams"); await pg.waitForTimeout(300);
}
/* e in tutta la pagina, finestre chiuse comprese: nessun campo col fondo bianco del browser */
const campi = await pg.evaluate(() => { let n = 0; const chiari = [];
  for (const e of document.querySelectorAll("input, select, textarea")) { if (["checkbox", "radio", "file", "hidden", "range", "color", "button", "submit"].includes((e.type || "").toLowerCase())) continue;
    n++; const c = getComputedStyle(e).backgroundColor.match(/[\d.]+/g).map(Number);
    if ((c.length < 4 || c[3] > 0.5) && (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255 > 0.5) chiari.push(e.id || e.name || e.className || e.tagName); }
  return { n, chiari }; });
dice(campi.n >= 50 && campi.chiari.length === 0, `⛔ nessuno dei ${campi.n} campi della pagina ha il fondo bianco del browser (erano 5: profondità, carica, vento, x50 obiettivo, misure reali)`, campi.chiari.join(" · "));
await pg.setViewportSize({ width: 430, height: 900 });
await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);

dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err.slice(0, 2));
if (CONTROPROVA) {
  dice(colpiti.size === DIFETTI.length, `l'iniezione ha trovato e sostituito il suo testo nella pagina servita (${colpiti.size}/${DIFETTI.length})`, [...colpiti]);
}

console.log(`\n════════ RIEPILOGO ════════\n  ${ok} passati, ${ko} falliti · ${prove} prove`);
await b.close();
srv.close();
process.exitCode = ko > 0 ? 1 : 0;

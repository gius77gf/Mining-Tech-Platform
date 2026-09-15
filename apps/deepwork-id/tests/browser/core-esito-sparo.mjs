/* L'ESITO DELLO SPARO SUL RAPPORTINO DEL FOCHINO: COLPI ESPLOSI CONTATI E COLPI MANCATI
   ────────────────────────────────────────────────────────────────────────
   Uso:
     env -u HTTPS_PROXY -u HTTP_PROXY -u https_proxy -u http_proxy \
       node core-esito-sparo.mjs [--scatti=/cartella]
     node core-esito-sparo.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Nel mondo il rapporto di volata registra, dopo lo sparo, il
   conteggio dei colpi esplosi e i colpi mancati — una carica inesplosa è un
   pericolo, un'area interdetta, una bonifica da fare. Il rapportino del
   fochino non li aveva (03/09, dal delta della ricerca sul rapporto di
   volata). I numeri li decide `esitoSparo` in `shared/`, provata da `node`;
   quello che `node` non può vedere è il COLLEGAMENTO — che l'elenco, la
   scheda, il modulo e il PDF la chiamino davvero, e che dicano tutti la
   stessa cosa. È la guardia scollegata di CLAUDE.md.

   ⛔ LE TRE REGOLE DEL PRINCIPIO DEL FONDATORE che questo banco sorveglia:
   · un rapportino SENZA i due campi dice «non contato», mai «0 mancati» — un
     rapportino vecchio non diventa una volata perfetta per omissione;
   · più colpi mancati che fori caricati è l'unico caso impossibile: il
     salvataggio si ferma con la ragione; un colpo mancato senza nota invece
     si salva lo stesso, e lo dice — un pericolo va scritto, non bloccato;
   · il PDF dice le STESSE parole della scheda, perché le decide una funzione
     sola (`fraseEsitoSparo`): niente secondo conto scritto a mano nel foglio.

   ⚠️ I CASI SONO QUELLI DELLA DIMOSTRAZIONE, non inventati: `rf_1` porta
   l'esito contato con un colpo mancato e la sua nota, `rf_2` non porta i
   campi (il caso «non contato», che nella dimostrazione DEVE esistere). Il
   file su disco non si tocca; in controprova i difetti si rimettono nella
   risposta HTTP.

   ⚠️ COME SI MISURA IL PDF. jsPDF arriva da un CDN e qui la rete è chiusa; al
   suo posto si serve un registratore che annota le stringhe di `text()` — è
   esattamente il testo che finirebbe nel foglio (la stessa idea di
   `core-documenti-che-escono.mjs`). Il bottone «PDF» della scheda si preme
   davvero.

   ⛔ E IL FINTO FIRESTORE DEVE **RIFIUTARE**, non rispondere vuoto: con un
   Firestore che dice «nessun documento» il core crede di essere al primo
   avvio, semina il database e l'accesso risponde «Credenziali errate» su
   credenziali giuste.

   ── SECONDA TORNATA (03/09, stessa notte) ──
   · L'ESPLOSIVO PER TIPO: il registro di carico e scarico vuole i chili per
     tipo, non il totale. I numeri li fa `esplosivoPerTipo` (shared, provata
     da `node`); le parole `righeEsplosivoPerTipo` nel core, UNA volta per la
     scheda e il PDF. Qui si prova che scheda e PDF le dicano davvero, e
     identiche. I chili attesi sono CALCOLATI A MANO dalla dimostrazione:
     `rf_1` ha 14 fori da 8 kg, i primi 12 a emulsione e gli ultimi 2 ad ANFO
     → 12 × 8 = 96,0 kg e 2 × 8 = 16,0 kg, somma 112 = `tot_kg`. `rf_2` ha
     11 fori ad ANFO senza chili → «11 fori, chili non scritti», MAI «0,0 kg».
     I casi che la dimostrazione non ha (chili senza tipo, due esplosivi in
     un foro, un tipo caricato a metà) si provano sul PDF di un rapportino
     costruito qui e passato a `exportRapportinoFocPDF`, che è su `window`.
   · IL BADGE DEL COLPO MANCATO NELLA CRONOLOGIA DELLA CAVA (il gemello
     digitale, l'unica cronologia del core che elenca le volate del fochino:
     la home non le elenca). Un pericolo che si vede nell'elenco delle volate
     e non lì è un pericolo che chi apre la cava non vede.
   · LA RIGA `.ssub` NON TRABOCCA A 390 px: col badge dentro `.ssub` il testo
     «Marco Verdi · 14 fori · 112,0 kg» finiva tagliato («11…», visto nello
     scatto). Adesso il badge ha una riga sua (`.ssub-esito`) sotto il testo,
     e si misura con `scrollWidth > clientWidth` — la risposta del browser,
     non un conto a mano.
   ⚠️ `--difetto=N` rimette UN difetto solo (1-based): serve a provare che la
   controprova cade anche su di lui, perché nella controprova completa un
   difetto può mascherarne un altro (senza badge non c'è niente che trabocchi). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE — `[file, cerca, sostituisci]`. Non caricature: sono
   le forme che il core avrebbe avuto senza `esitoSparo`, cioè un `+x` che sul
   vuoto fa zero, un badge che non si disegna, una validazione che non ferma,
   e un PDF che si rifà il conto da solo. */
const DIFETTI = [
  /* 1 · il vuoto letto come zero nel modulo: «non contato» diventa «0 mancati» */
  ["index.html",
   "    colpiEsplosi:numDaCampo('rf-esplosi',{decimali:0}),\n    colpiMancati:numDaCampo('rf-mancati',{decimali:0}),",
   "    colpiEsplosi:+($('rf-esplosi')?$('rf-esplosi').value:0),\n    colpiMancati:+($('rf-mancati')?$('rf-mancati').value:0),"],
  /* 2 · le parole: un rapportino senza i campi raccontato come una volata perfetta */
  ["index.html",
   "  if(!e.contato) return 'non contato';",
   "  if(!e.contato) return '0 colpi esplosi, 0 mancati';"],
  /* 3 · il badge del pericolo non si disegna — in elenco, in scheda, in cronologia */
  ["index.html",
   "  return es.pericolo?`<span class=\"scad-badge danger\">${conta(es.mancati,'colpo mancato','colpi mancati')}</span>`:'';",
   "  return '';"],
  /* 4 · il riepilogo tace su quante volate sono senza esito contato */
  ["index.html",
   "${senzaEsito?` · ${senzaEsito} senza esito contato`:''}",
   ""],
  /* 5 · più mancati che fori: si salva lo stesso */
  ["index.html",
   "    if(!es.coerente){\n      $('rf-err').textContent='Esito dello sparo: '+es.perche;",
   "    if(false){\n      $('rf-err').textContent='Esito dello sparo: '+es.perche;"],
  /* 6 · la nota dei mancati non compare mai */
  ["index.html",
   "  sec.style.display=e.pericolo?'block':'none';",
   "  sec.style.display='none';"],
  /* 7 · il PDF si rifà il conto da solo, con `||0` */
  ["index.html",
   "    d.text(`Esito dello sparo: ${fraseEsitoSparo(r)}`,14,y);y+=5;",
   "    d.text(`Esito dello sparo: ${r.colpiEsplosi||0} colpi esplosi, ${r.colpiMancati||0} mancati`,14,y);y+=5;"],
  /* 8 · i chili SENZA tipo sommati a ogni tipo (cioè al primo, sul caso vero):
     dichiarati e sommati insieme, il registro per tipo conta due volte */
  ["index.html",
   "    if(g.kg>0) return `${g.tipo} · ${perLettura(g.kg,1,true)} kg in",
   "    if(g.kg>0) return `${g.tipo} · ${perLettura(g.kg+t.senzaTipo.kg,1,true)} kg in"],
  /* 9 · il PDF non stampa il blocco per tipo: lo schermo lo dice, il foglio no */
  ["index.html",
   "    const righe=righeEsplosivoPerTipo(r);\n    if(righe.length){",
   "    const righe=righeEsplosivoPerTipo(r);\n    if(false){"],
  /* 10 · la cronologia della cava non porta il badge */
  ["index.html",
   "badge:badgeColpiMancati(r),go:`apriRappFocDett('${r.id}')`",
   "badge:'',go:`apriRappFocDett('${r.id}')`"],
  /* 11 · il badge torna DENTRO `.ssub` (la forma di stanotte): a 390 px il
     testo trabocca e «112,0 kg» si taglia. ⚠️ Con il 3 attivo il badge non
     c'è e non trabocca niente: si prova da solo, con `--difetto=11`. */
  ["index.html",
   "<div class=\"ssub\">${u?escHtml(u.nome+' '+u.cognome):'—'} · ${conta(r.fori||0,'foro','fori')} · ${focKg(r)}</div>${es.pericolo?`<div class=\"ssub-esito\">${badgeColpiMancati(r)}</div>`:''}",
   "<div class=\"ssub\">${es.pericolo?badgeColpiMancati(r)+' ':''}${u?escHtml(u.nome+' '+u.cognome):'—'} · ${conta(r.fori||0,'foro','fori')} · ${focKg(r)}</div>"],
];
/* `--difetto=N`: nella controprova si rimette SOLO l'N-esimo (1-based) */
const SOLO_DIFETTO = +((process.argv.find((a) => a.startsWith("--difetto=")) || "").split("=")[1] || 0);
const DIFETTI_ATTIVI = SOLO_DIFETTO ? [DIFETTI[SOLO_DIFETTO - 1]] : DIFETTI;
if (SOLO_DIFETTO && !DIFETTI_ATTIVI[0]) { console.error(`✗ --difetto=${SOLO_DIFETTO}: ce ne sono ${DIFETTI.length}`); process.exit(2); }

let colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    let t = corpo.toString("utf8");
    for (const [file, a, b] of DIFETTI_ATTIVI) if (p === join(R, file) && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
/* porta EFFIMERA: la 8823 è del giro, e un banco che la trovasse occupata e la
   riusasse misurerebbe la copia di qualcun altro */
await new Promise((r, x) => { srv.once("error", x); srv.listen(0, "127.0.0.1", r); });
const PORTA = srv.address().port;

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID, riletto dal server: se non torna, la
   porta è di qualcun altro e ci si ferma. */
const SEGNO = join(R, "__core-esito-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-esito-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

/* il registratore al posto di jsPDF: annota le stringhe di `text()` e chiude
   il documento in `window.__pdf.salvati` quando il core chiama `save()` */
const REGISTRATORE = `
(function(){
  var reg = window.__pdf = { salvati: [] };
  function Doc(){ this.__t = []; this.lastAutoTable = { finalY: 40 };
    this.internal = { getNumberOfPages: function(){ return 1; },
                      pageSize: { getWidth: function(){ return 210; }, getHeight: function(){ return 297; } } }; }
  ['setFillColor','rect','setTextColor','setFont','setFontSize','setDrawColor','line',
   'setLineWidth','addPage','setPage','circle','addImage','setProperties','setLineDash'].forEach(function(n){
    Doc.prototype[n] = function(){ return this; };
  });
  Doc.prototype.text = function(t){ var v = Array.isArray(t) ? t : [t];
    for (var i = 0; i < v.length; i++) this.__t.push(String(v[i])); return this; };
  Doc.prototype.splitTextToSize = function(t){ return String(t).split('\\n'); };
  Doc.prototype.getTextWidth = function(t){ return String(t).length * 2; };
  Doc.prototype.autoTable = function(o){ this.lastAutoTable = { finalY: ((o||{}).startY || 20) + 10 }; return this; };
  Doc.prototype.save = function(nome){ reg.salvati.push({ nome: String(nome), testi: this.__t.slice() }); return this; };
  window.jspdf = { jsPDF: Doc };
})();
`;

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await montaFintoFirebase(pg);
/* le rotte vanno DOPO `montaFintoFirebase`: Playwright prova i gestori dal più recente */
await pg.route("https://cdn.jsdelivr.net/npm/jspdf@**/jspdf.umd.min.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: REGISTRATORE }));
await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript",
    body: MODULI["firebase-firestore.js"].replace(
      "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
      "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));

await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
let dentro = false;
for (let giro = 0; giro < 6 && !dentro; giro++) {
  await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
  await pg.waitForTimeout(800);
  dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
}
dice(dentro, "si entra davvero nell'app");
const visibile = (id) => pg.evaluate((i) => { const e = document.getElementById(i); return !!e && getComputedStyle(e).display !== "none"; }, id);
const testo = (id) => pg.evaluate((i) => (document.getElementById(i)?.innerText || "").trim(), id);
const scatta = async (nome) => { if (!SCATTI) return; mkdirSync(SCATTI, { recursive: true }); await pg.screenshot({ path: join(SCATTI, nome), fullPage: false }); };

/* ══ 1 · L'ELENCO DELLE VOLATE ══ */
console.log("── 1 · l'elenco delle volate del fochino ──");
await pg.evaluate(() => window.openVolate());
await pg.waitForTimeout(900);
dice(await visibile("screen-volate"), "navigato alle volate (prova di aver navigato, prima di misurare)");
const righe = await pg.$$eval("#vol-list .sitem", (e) => e.map((x) => x.innerText.replace(/\s+/g, " ").trim()));
dice(righe.length === 2, `le due volate della dimostrazione sono nell'elenco (${righe.length})`, righe);
/* ⚠️ i badge sono maiuscoli per struttura (`text-transform`), e `innerText`
   lo rispecchia: si confronta senza distinguere le maiuscole */
const rigaMancato = righe.find((t) => /colpo mancato|colpi mancati/i.test(t));
dice(!!rigaMancato && /1 colpo mancato/i.test(rigaMancato),
  "⛔ la volata col colpo mancato porta il badge «1 colpo mancato» (al singolare)", righe);
const badge = await pg.$$eval("#vol-list .scad-badge.danger", (e) => e.map((x) => x.innerText.trim()));
dice(badge.length === 1, `il badge è UNO, rosso, e solo sulla volata che lo merita (${badge.length})`, badge);
const riepilogo = await testo("vol-summary");
dice(/1 volata con colpi mancati/.test(riepilogo), "il riepilogo dice «1 volata con colpi mancati»", riepilogo);
dice(/1 senza esito contato/.test(riepilogo),
  "⛔ e DICHIARA quante volate sono senza esito contato, invece di nasconderle", riepilogo);
/* la riga `.ssub` NON trabocca a 390 px, e il badge sta su una riga SUA sotto
   il testo: la domanda la fa il browser (`scrollWidth > clientWidth`), su
   TUTTE le righe dell'elenco, non solo su quella col badge */
const misuraSsub = (sel) => pg.$$eval(sel, (righe) => righe.map((r) => {
  const s = r.querySelector(".ssub"), e = r.querySelector(".ssub-esito");
  const rs = s ? s.getBoundingClientRect() : null, re = e ? e.getBoundingClientRect() : null;
  return { testo: s ? s.innerText.trim() : "", trabocca: !!s && s.scrollWidth > s.clientWidth,
           badgeSotto: !!(rs && re) && re.top >= rs.bottom - 0.5, altezza: Math.round(r.getBoundingClientRect().height) };
}));
const ssubVol = await misuraSsub("#vol-list .sitem");
dice(ssubVol.length === 2 && ssubVol.every((x) => !x.trabocca),
  "⛔ a 390 px nessuna riga `.ssub` dell'elenco trabocca (scrollWidth ≤ clientWidth): «112,0 kg» si legge", ssubVol);
dice(ssubVol.some((x) => /112,0 kg$/.test(x.testo)),
  "e la riga della volata col colpo mancato finisce con «112,0 kg» intero, la virgola italiana", ssubVol.map((x) => x.testo));
dice(ssubVol.filter((x) => x.badgeSotto).length === 1,
  "il badge del colpo mancato sta su una riga sua, SOTTO il testo, e solo lì", ssubVol);
await scatta("elenco-volate-390.png");

/* ══ 2 · LA SCHEDA DELLA VOLATA COL COLPO MANCATO ══ */
console.log("── 2 · la scheda della volata col colpo mancato ──");
const esitoScheda = () => pg.evaluate(() => {
  const el = document.getElementById("rfd-esito");
  if (!el) return null;
  const c = el.cloneNode(true); c.querySelectorAll(".scad-badge").forEach((x) => x.remove());
  return { frase: c.textContent.trim(), badge: el.querySelector(".scad-badge")?.innerText.trim() || "",
           nota: (document.getElementById("rfd-esito-nota")?.innerText || "").trim(),
           modale: (document.getElementById("modal-body")?.innerText || "") };
});
await pg.evaluate(() => window.apriRappFocDett("rf_1"));
await pg.waitForTimeout(400);
const s1 = await esitoScheda();
dice(!!s1, "la scheda ha la riga «Esito dello sparo»", s1?.modale);
dice(!!s1 && s1.frase === "13 colpi esplosi, 1 mancato",
  "⛔ dice «13 colpi esplosi, 1 mancato» — il conto di `esitoSparo`, non un altro", s1?.frase);
dice(!!s1 && /1 colpo mancato/i.test(s1.badge), "col badge rosso del pericolo", s1?.badge);
dice(!!s1 && /Foro 9/.test(s1.nota) && /area interdetta/.test(s1.nota) && /bonifica/.test(s1.nota),
  "e la nota: dov'è il colpo mancato, l'area interdetta, chi bonifica", s1?.nota);
/* I CHILI PER TIPO, calcolati a mano dalla dimostrazione: `rf_1` ha 14 fori
   da 8 kg, i primi 12 a emulsione e gli ultimi 2 ad ANFO →
   emulsione 12 × 8 = 96,0 kg, ANFO 2 × 8 = 16,0 kg; 96 + 16 = 112 = `tot_kg`. */
const perTipo = () => pg.$$eval("#rfd-per-tipo .preview-val", (e) => e.map((x) => x.innerText.trim()));
const ATTESE_RF1 = ["Emulsione · 96,0 kg in 12 fori", "ANFO · 16,0 kg in 2 fori"];
const t1 = await perTipo();
dice(JSON.stringify(t1) === JSON.stringify(ATTESE_RF1),
  "⛔ sotto il totale ci sono i chili PER TIPO: «Emulsione · 96,0 kg in 12 fori», «ANFO · 16,0 kg in 2 fori» (12×8 e 2×8)", t1);
const totScheda = await pg.evaluate(() => {
  const r = [...document.querySelectorAll("#modal-body .preview-row")].find((x) => /Esplosivo tot\./.test(x.innerText));
  return r ? r.querySelector(".preview-val").innerText.trim() : null;
});
dice(totScheda === "112,0 kg", "e il totale della stessa scheda è «112,0 kg» = 96 + 16: i tipi sommano al totale", totScheda);
await scatta("scheda-colpo-mancato-390.png");
await pg.evaluate(() => window.closeModal());
await pg.waitForTimeout(200);

/* ══ 3 · LA SCHEDA DELLA VOLATA SENZA ESITO ══ */
console.log("── 3 · la scheda della volata senza i due campi ──");
await pg.evaluate(() => window.apriRappFocDett("rf_2"));
await pg.waitForTimeout(400);
const s2 = await esitoScheda();
dice(!!s2 && s2.frase === "non contato",
  "⛔ senza i due campi la scheda dice «non contato»", s2?.frase);
dice(!!s2 && !/0 mancat/.test(s2.modale) && !/0 colpi/.test(s2.modale),
  "⛔ e da nessuna parte compare «0 mancati» o «0 colpi»: l'assenza non è un dato favorevole", s2?.modale);
dice(!!s2 && s2.badge === "", "e nessun badge di pericolo su una volata di cui non si sa niente", s2?.badge);
/* 11 fori ad ANFO, nessuno coi chili: il tipo si dice, i chili no — e non «0,0 kg» */
const t2 = await perTipo();
dice(JSON.stringify(t2) === JSON.stringify(["ANFO · 11 fori, chili non scritti"]),
  "⛔ coi chili mai scritti la riga per tipo dice «ANFO · 11 fori, chili non scritti», non «0,0 kg»", t2);
dice(!!s2 && !/0,0 kg|0\.0 kg/.test(s2.modale), "e «0,0 kg» non compare da nessuna parte nella scheda", s2?.modale);
await pg.evaluate(() => window.closeModal());
await pg.waitForTimeout(200);

/* ══ 3b · LA CRONOLOGIA DELLA CAVA (gemello digitale) ══ */
console.log("── 3b · la cronologia della cava porta il badge del colpo mancato ──");
await pg.evaluate(() => window.apriGemello("cava_1"));
await pg.waitForTimeout(500);
dice(await visibile("screen-gemello"), "aperto il gemello di Cava Monte Serra (prova di aver navigato)");
const cron = await pg.$$eval("#gemello-body .sitem", (e) => e.map((x) => ({
  testo: x.innerText.replace(/\s+/g, " ").trim(),
  badge: [...x.querySelectorAll(".ssub-esito .scad-badge.danger")].map((b) => b.innerText.trim()) })));
const evFoc = cron.filter((x) => /Volata \(fochino\)/.test(x.testo));
dice(evFoc.length === 1 && /15\/07\/2026/.test(evFoc[0].testo), "la volata del fochino del 15/07 è nella cronologia", cron.map((x) => x.testo));
dice(evFoc.length === 1 && evFoc[0].badge.length === 1 && /1 colpo mancato/i.test(evFoc[0].badge[0]),
  "⛔ e porta lo STESSO badge «1 colpo mancato» dell'elenco delle volate, su una riga sua", evFoc);
dice(cron.filter((x) => x.badge.length).length === 1, "il badge è solo su quell'evento: rapportini e progetti non ne portano", cron);
const ssubCron = await misuraSsub("#gemello-body .sitem");
dice(ssubCron.length > 0 && ssubCron.every((x) => !x.trabocca) && ssubCron.filter((x) => x.badgeSotto).length === 1,
  "e a 390 px nessuna riga della cronologia trabocca, col badge sotto il testo", ssubCron);
await pg.evaluate(() => { const b = document.querySelector("#gemello-body .ssub-esito"); if (b) b.scrollIntoView({ block: "center" }); });
await scatta("cronologia-cava-390.png");

/* ══ 4 · IL MODULO ══ */
console.log("── 4 · il modulo del rapportino ──");
await pg.evaluate(() => window.nav("rapp-foc"));
await pg.waitForTimeout(500);
dice(await visibile("screen-rapp-foc"), "il modulo del fochino è aperto davvero");
const guardia = await pg.evaluate(() => ["rf-esplosi", "rf-mancati"].map((i) => {
  const e = document.getElementById(i);
  return e ? `${e.type}/${e.getAttribute("inputmode")}/${e.value === "" ? "vuoto" : e.value}` : "assente";
}));
dice(guardia.every((g) => g === "number/numeric/vuoto"),
  "i due campi sono interi con la guardia (type=number, inputmode=numeric) e nascono VUOTI, non «0»", guardia);
dice(!(await visibile("rf-mancati-section")), "la nota dei mancati non si vede finché non c'è un colpo mancato");
/* tre fori caricati: l'esplosivo scritto sulla prima colonna di ogni riga */
/* ⚠️ i badge sono maiuscoli per struttura (`text-transform`), e `innerText` lo
   rispecchia: si confronta senza distinguere le maiuscole */
const nFori = await pg.$$eval("#rf-tbody .trow-foc", (e) => e.length);
for (let i = 1; i <= nFori; i++) await pg.fill(`#rf-tbody .trow-foc:nth-child(${i}) input:first-of-type`, "Emulsione");
await pg.fill("#rf-mancati", "5");
await pg.waitForTimeout(200);
dice(await visibile("rf-mancati-section"), "scritti dei colpi mancati, la nota compare (come il reso)");
const hint = await testo("rf-esito-hint");
dice(/5 colpi mancati su 3 fori caricati/.test(hint),
  "⛔ e la riga sotto i campi dice subito che il conto non torna, con la ragione di `esitoSparo`", hint);
await pg.click('#screen-rapp-foc button:has-text("SALVA RAPPORTINO FOCHINO")');
await pg.waitForTimeout(600);
const err = await testo("rf-err");
dice((await visibile("rf-err")) && /5 colpi mancati su 3 fori caricati/.test(err),
  "⛔ più mancati che fori caricati: `rf-err` si vede, con la ragione", err);
dice(await visibile("screen-rapp-foc"), "⛔ e NON si è salvato: si è ancora sul modulo, non a casa");
await scatta("modulo-esito-incoerente-390.png");

/* ⚠️ Il modulo si riapre DA CAPO: se la validazione non avesse fermato il
   salvataggio (è uno dei difetti della controprova) si sarebbe a casa, e un
   `fill` su un campo invisibile ucciderebbe il banco a metà — che dichiara
   meno prove senza nessuna riga rossa. Riaprendo, ogni prova sotto parte
   dallo stesso stato nei due versi. */
await pg.evaluate(() => window.nav("home"));
await pg.waitForTimeout(300);
await pg.evaluate(() => window.nav("rapp-foc"));
await pg.waitForTimeout(500);
dice(await visibile("screen-rapp-foc") && (await pg.$eval("#rf-mancati", (e) => e.value)) === "", "il modulo riaperto riparte vuoto");
for (let i = 1; i <= nFori; i++) await pg.fill(`#rf-tbody .trow-foc:nth-child(${i}) input:first-of-type`, "Emulsione");
await pg.fill("#rf-mancati", "0");
await pg.waitForTimeout(200);
dice(!(await visibile("rf-mancati-section")), "a zero mancati la nota non c'è");
await pg.fill("#rf-mancati", "1");
await pg.waitForTimeout(200);
dice(await visibile("rf-mancati-section"), "a un colpo mancato senza nota la textarea compare");
dice(/senza nota/.test(await testo("rf-esito-hint")), "e la riga sotto chiede la nota", await testo("rf-esito-hint"));
await pg.fill("#rf-esplosi", "2");
await pg.waitForTimeout(200);
await pg.evaluate(() => document.getElementById("rf-esito-hint")?.scrollIntoView({ block: "center" }));
await scatta("modulo-esito-390.png");
/* un colpo mancato senza nota SI SALVA, e il toast lo dice */
await pg.click('#screen-rapp-foc button:has-text("SALVA RAPPORTINO FOCHINO")');
await pg.waitForTimeout(700);
const toastTesto = await testo("toast");
dice(await visibile("screen-home"), "⛔ un colpo mancato senza nota si salva lo stesso (si torna a casa): un pericolo si scrive, non si blocca");
dice(/senza nota/.test(toastTesto), "e il toast avverte: «colpi mancati senza nota»", toastTesto);

/* ══ 5 · IL PDF DICE LE STESSE PAROLE DELLA SCHEDA ══ */
console.log("── 5 · il PDF del fochino ──");
async function pdfDi(id) {
  await pg.evaluate((x) => window.apriRappFocDett(x), id);
  await pg.waitForTimeout(400);
  const scheda = await esitoScheda();
  const prima = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.click('#modal .mbtn:has-text("PDF")');
  await pg.waitForTimeout(600);
  const dopo = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  const d = await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
  const riga = d ? d.testi.find((t) => /^Esito dello sparo: /.test(t)) : null;
  const nota = d ? d.testi.find((t) => /^Colpi mancati/.test(t)) : null;
  return { scheda, tipi: await perTipo(), uscito: dopo > prima, riga, nota, testi: d ? d.testi : [], perTipoPdf: blocco(d ? d.testi : []) };
}
/* le righe del blocco «ESPLOSIVO PER TIPO» del foglio: dall'intestazione a
   quella dopo, «ESITO DELLO SPARO» — così si legge il blocco INTERO, non si
   cerca una sottostringa che risponderebbe ok qualunque cosa succeda */
function blocco(testi) {
  const a = testi.indexOf("ESPLOSIVO PER TIPO"), z = testi.indexOf("ESITO DELLO SPARO");
  return a < 0 ? null : testi.slice(a + 1, z < 0 ? undefined : z);
}
const p1 = await pdfDi("rf_1");
dice(p1.uscito, "premuto «PDF» sulla scheda, un documento esce", p1.testi.length);
dice(!!p1.perTipoPdf && JSON.stringify(p1.perTipoPdf) === JSON.stringify(p1.tipi) && p1.tipi.length === 2,
  "⛔ il blocco «ESPLOSIVO PER TIPO» del foglio è IDENTICO alle righe della scheda (stessa `righeEsplosivoPerTipo`)", `${JSON.stringify(p1.perTipoPdf)} · scheda: ${JSON.stringify(p1.tipi)}`);
/* i casi che la dimostrazione non ha: un rapportino costruito qui e passato a
   `exportRapportinoFocPDF` (su `window`). Fori: ANFO+Emulsione 12 kg (due
   esplosivi: i chili al primo), ANFO senza chili (il tipo è un minimo), 3 kg
   senza tipo (dichiarati, sommati a nessuno), Emulsione senza chili. */
const sint = await pg.evaluate(() => {
  const prima = (window.__pdf?.salvati || []).length;
  window.exportRapportinoFocPDF({ id: "rf_sintetico", userId: "user_fochino", cavaId: "cava_1", data: "2026-07-20", fori: 4, tot_kg: 15,
    fori_dettaglio: [{ n: 1, esplosivo: "ANFO", esplosivo2: "Emulsione", innesco: "", kg: 12 }, { n: 2, esplosivo: "ANFO", esplosivo2: "", innesco: "", kg: "" },
                     { n: 3, esplosivo: "", esplosivo2: "", innesco: "", kg: 3 }, { n: 4, esplosivo: "Emulsione", esplosivo2: "", innesco: "", kg: "" }] });
  const s = window.__pdf?.salvati || [];
  return s.length > prima ? s[s.length - 1].testi : null;
});
const ATTESE_SINT = ["ANFO · 12,0 kg in 2 fori (1 senza chili scritti: è un minimo)", "Emulsione · 1 foro, chili non scritti",
                     "3,0 kg in 1 foro senza tipo scritto", "1 foro con due esplosivi: i chili sono attribuiti al primo"];
const bs = sint ? blocco(sint) : null;
dice(!!bs && JSON.stringify(bs) === JSON.stringify(ATTESE_SINT),
  "⛔ chili senza tipo DICHIARATI e non sommati (ANFO resta 12,0, non 15,0); il tipo a metà dice «è un minimo»; i due esplosivi si contano", bs);
dice(!!p1.riga && p1.riga === `Esito dello sparo: ${p1.scheda?.frase}`,
  "⛔ la riga del PDF è IDENTICA alla scheda: stessa funzione, non un secondo conto", `${p1.riga} · scheda: ${p1.scheda?.frase}`);
dice(!!p1.nota && p1.nota === `Colpi mancati: ${p1.scheda?.nota}`,
  "e la nota del colpo mancato è nel foglio, parola per parola", p1.nota);
const p2 = await pdfDi("rf_2");
dice(!!p2.riga && p2.riga === "Esito dello sparo: non contato" && p2.riga === `Esito dello sparo: ${p2.scheda?.frase}`,
  "⛔ e sulla volata senza esito il PDF scrive «non contato», come la scheda", `${p2.riga} · scheda: ${p2.scheda?.frase}`);
dice(!p2.testi.some((t) => /0 mancat|0 colpi/.test(t)), "senza nessuno «0 mancati» inventato nel foglio", p2.testi.join(" | "));

dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

if (CONTROPROVA) {
  console.log(`\n  difetti rimessi: ${colpiti.size} su ${DIFETTI_ATTIVI.length}${SOLO_DIFETTO ? ` (solo il ${SOLO_DIFETTO} di ${DIFETTI.length})` : ""}`);
  if (colpiti.size !== DIFETTI_ATTIVI.length) {
    console.error("✗ CONTROPROVA A VUOTO: un difetto non ha trovato il suo pezzo di pagina.");
    console.error("  Il core è cambiato: vanno riscritti i pezzi in DIFETTI, non tolta la prova.");
    await b.close(); srv.close(); process.exit(2);
  }
}
await b.close(); srv.close();

const ATTESE = 47;   // quante prove questo banco DEVE dichiarare: un banco che crolla ne dichiara meno
/* quante DEVONO cadere quando i difetti sono rimessi: tutti insieme, oppure
   almeno UNA quando se ne rimette uno solo (`--difetto=N`) */
const SOGLIA = SOLO_DIFETTO ? 1 : 8;
console.log(`\nRisultato esito dello sparo (core): ${ok} passate, ${ko} cadute su ${ok + ko} (attese ${ATTESE})`);
if (ok + ko !== ATTESE) { console.log(`✗ il banco ha dichiarato ${ok + ko} prove invece di ${ATTESE}: si è rotto a metà, o va aggiornato il conto`); process.exit(1); }
if (CONTROPROVA) {
  console.log(ko >= SOGLIA
    ? `✓ controprova: coi difetti rimessi cadono ${ko} prove (almeno ${SOGLIA})`
    : `✗ controprova: cadono solo ${ko} prove, ne servono almeno ${SOGLIA}`);
  process.exit(ko >= SOGLIA ? 0 : 1);
}
process.exit(ko === 0 ? 0 : 1);

/* I DOCUMENTI CHE ESCONO DAL CORE, PROVATI PREMENDO IL BOTTONE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-documenti-che-escono.mjs [--porta=8621]
     node core-documenti-che-escono.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. La domanda che il 03/08 ha trovato ventiquattro difetti in
   cinque app è una sola: *dove questa app compone qualcosa che ESCE — un CSV,
   un PDF, una frase di riepilogo — chi decide i suoi numeri?* Se la risposta
   non è «la stessa funzione che li decide a schermo», lì c'è una copia debole.
   Nel core la notte fra il 2 e il 3 sono stati sistemati sei documenti su
   otto; ne restavano due, e questo banco tiene chiusi i loro difetti:

   1. **il Report tecnico** (dashboard → «🔧 Report tecnico completo»). La
      dashboard che ospita quel bottone conta con `totaliRapportini` e scrive
      «— mc» e «2 fuori dal totale»; il PDF che ne esce, due centimetri più
      sotto, chiedeva i numeri direttamente al rapportino: `r.fori||0`,
      `(r.metri||0).toFixed(1)`, `(r.mc||0).toFixed(1)`. Sui dati della
      dimostrazione il turno del 21/07 — quello aperto e mai misurato — usciva
      stampato **«0 · 0.0 · 0.0»**, e quello del 23/07 (nove fori veri, maglia
      da confermare) usciva **«0.0» di metri cubi**. Lo stesso identico difetto
      che il 03/08 era stato tolto dal rapportino stampato, rimasto in piedi in
      un altro foglio. E il PDF non aveva **nessuna riga di totali**, quindi
      nemmeno il posto dove dichiarare che cosa aveva lasciato fuori.

   2. **il PDF della frammentazione**. Qui il verso è ancora più netto: la
      schermata, quando nessuno ha valutato niente, **tace** (il riquadro
      dell'indice oversize è dentro un `${overPct>0 ? ... : ''}`); il PDF
      stampava lo stesso, sempre, **«Indice oversize: 0% — ECCELLENTE»**, e
      quattro classi granulometriche a «0 %» con un totale a «0 %». Un
      giudizio di eccellenza su una volata che nessuno ha guardato, su un
      foglio che esce dall'azienda. È il principio del fondatore — l'assenza
      di un dato non è un dato favorevole — nella sua forma più pura: il
      numero tranquillo dove non è stato misurato niente.
      ⚠️ E la fonte era il valore iniziale: `apriFrammentazione` apriva la
      scheda con `{fine:0, media:0, grossa:0, oversize:0}`, quindi bastava
      aprire e salvare per scrivere nel database quattro zeri che nessuno
      aveva misurato.

   3. **le righe senza data sparivano dal Report tecnico.** `inRange` risponde
      falso su una data vuota, e il modulo «Segnala guasto» non obbliga a
      compilarla (`dataSegn:$('gu-data').value`, nessuna validazione): un
      guasto con la data cancellata si vede nella scheda del mezzo e **non
      c'era** nel documento. Peggio: se tutte le righe di un mezzo erano senza
      data, `if(!logs.length&&!guasti.length&&!consumi.length)return` faceva
      sparire **il mezzo intero**. È la stessa famiglia dei quattro mezzi che
      Flotta perdeva dal foglio dello scadenzario.

   ⚠️ COME SI MISURA UN PDF. jsPDF arriva da un CDN e qui la rete è chiusa; al
   suo posto si serve un **registratore** che espone la stessa interfaccia e
   annota che cosa il core gli chiede di disegnare — le stringhe di `text()` e
   le righe di `autoTable()`. Non è il PDF impaginato: è **esattamente il
   testo** che ci finirebbe dentro, che è la cosa di cui si discute. Il
   bottone lo si preme davvero (`click` sul bottone della dashboard, poi sul
   «GENERA» della modale), non si chiama la funzione.

   ⚠️ I CASI SONO QUELLI DELLA DIMOSTRAZIONE, non inventati: `DEFAULT_RAPPORTINI`
   contiene già il turno mai misurato e quello senza maglia,
   `DEFAULT_RAPPORTINI_FOC` la volata coi chili non scritti. Si aggiungono solo
   le volate (la dimostrazione non ne ha) e due guasti al primo mezzo, appesi
   al modulo servito — il file su disco non si tocca, perché accanto ci sono
   cantieri che scrivono.

   ⛔ E IL FINTO FIRESTORE DEVE **RIFIUTARE**, non rispondere vuoto: con un
   Firestore che dice «nessun documento» il core crede di essere al primo
   avvio, semina il database e l'accesso risponde «Credenziali errate» su
   credenziali giuste. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
/* ⚠️ DUE CONTROPROVE, E LA SECONDA È NATA PERCHÉ LA PRIMA MASCHERAVA LE ALTRE.
   Rimettendo TUTTI i difetti insieme, quello del toast — la striscia
   invisibile — impedisce di premere il bottone del Report tecnico, e allora
   le dodici prove sui numeri del foglio cadono per la ragione sbagliata: non
   perché il foglio menta, ma perché il foglio non esiste. Un rosso che si
   legge male è un rosso che insegna a non guardare. Lo strato del toast si
   prova da solo, con `--controprova-toast`. */
const CONTRO_TOCCO = process.argv.includes("--controprova-toast");
const CONTROPROVA = process.argv.includes("--controprova") || CONTRO_TOCCO;
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8621;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── I CASI ────────────────────────────────────────────────────────────────
   Tre volate, e sono tre perché servono tutt'e tre: una mai valutata, una
   valutata per bene, una a metà. Senza la seconda, il modo più facile di far
   passare le prove sarebbe spegnere ogni numero — l'errore opposto.

   ⛔ E L'AGGANCIO NON È PIÙ IL LETTERALE DI `DB`, PERCHÉ QUELLO VIENE
   SOVRASCRITTO. Fino al 07/08 le volate si infilavano in `volate:[], // ← F1`,
   cioè nella dichiarazione dell'oggetto `DB`. Poi il 06/08 la dimostrazione ha
   guadagnato i suoi progetti di volata, e con loro la riga
   `DB.volate = [...DEFAULT_VOLATE]` dentro `initDBOfflineFallback`: da quel
   momento i casi di questo banco venivano **buttati via** un istante dopo
   essere stati letti, `apriFrammentazione('vz1')` non trovava la volata, la
   scheda non si apriva e `page.click` moriva per timeout portandosi via
   undici prove. La sostituzione era avvenuta davvero — infatti la riga
   «i casi hanno agganciato la pagina servita» diceva ok: **guardava il file,
   non lo stato**. Adesso i casi si appendono a `DEFAULT_VOLATE`, che è la
   sorgente da cui `DB` viene riempito, esattamente come già facevano i guasti;
   e che siano ARRIVATI lo prova una riga sola, più sotto, invece di dedurlo. */
const VOLATE = "DEFAULT_VOLATE.push("
  + "{id:'vz1',cavaId:'cava_1',numero:101,data:'2026-07-14',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:null,media:null,grossa:null,oversize:null,note:'',foto:[],"
  + "dataValutazione:'2026-07-15',valutatoreId:'user_ufficio'}},"
  + "{id:'vz2',cavaId:'cava_1',numero:102,data:'2026-07-17',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:12,media:53,grossa:29,oversize:6,note:'',foto:[],"
  + "dataValutazione:'2026-07-18',valutatoreId:'user_ufficio'}},"
  + "{id:'vz3',cavaId:'cava_1',numero:103,data:'2026-07-20',tipo:'cava',nomeProgetto:'',"
  + "fronte:{lunghezza_m:30,profilo:[],piede_profilo:[]},maglia:{file:2,borraggio_reale:2.5},"
  + "default:{esplosivo:'Emulsione',innesco:'Detonatore a tubo',profondita_m:9,diametro_mm:89,kg_per_foro:8},"
  + "fori:[],tot_fori:0,tot_metri:0,tot_kg:0,tot_mc:0,"
  + "frammentazione:{fine:20,media:null,grossa:null,oversize:2,note:'',foto:[],"
  + "dataValutazione:'2026-07-21',valutatoreId:'user_ufficio'}});\n";
const ANCORA_VOLATE = "const DEFAULT_DEPOSITO = {";

/* ⛔ IL TURNO RIAPERTO: I FORI AZZERATI, IL VOLUME RIMASTO DAL GIRO PRIMA.
   Serve perché senza di lui i due numeri che questo banco confronta —
   «somma di tutto» e «somma dei soli turni misurabili» — sulla dimostrazione
   coincidono: gli unici rapportini che non sanno dire il volume hanno anche
   `mc: 0`, quindi entrare o non entrare nel totale non cambia niente e le due
   prove sui TOTALI non distinguerebbero nulla (è la causa 1 dell'elenco:
   i dati fanno coincidere la risposta giusta con quella sbagliata).
   Qui `fori: 0` e `mc: 640.5`: `misureRapportino` dice «non misurato», quindi
   il volume non è suo — ma un `r.mc||0` lo sommerebbe. Somma ingenua 4106.6,
   somma giusta 3466.1. Ed è un caso vero, non una caricatura: il campo del
   volume resta scritto dal turno precedente quando si riaprono i fori. */
const RAPP_RIAPERTO = "DEFAULT_RAPPORTINI.push("
  + "{id:'rz1',userId:'user_operatore',cavaId:'cava_1',data:'2026-07-25',"
  + "oi:'07:00',of:'',diametro:89,maglia:'3x3.5',maglia_B:3,maglia_S:3.5,"
  + "mezzoId:'mlav_1',personale:[],fori:0,fori_fila1:0,fori_fila2:0,"
  + "metri:0,media_prof:0,mc:640.5,fori_dettaglio:[],volataId:null,"
  + "note:'Turno riaperto: i fori sono stati azzerati.',inviato:'2026-07-25'});\n";
const ANCORA_RAPP = "const DEFAULT_RAPPORTINI_FOC = [";

/* Due guasti sul primo mezzo: uno con la data e uno **senza**, che è lo stato
   che il modulo «Segnala guasto» produce se si svuota il campo. */
const GUASTI = "DEFAULT_MEZZILAV[0].guasti=["
  + "{id:'gz1',dataSegn:'2026-07-16',componente:'Impianto idraulico',gravita:'media',stato:'segnalato',descrizione:'Perdita sul martinetto',aggiornamenti:[]},"
  + "{id:'gz2',dataSegn:'',componente:'Compressore',gravita:'critica',stato:'segnalato',descrizione:'Non tiene la pressione',aggiornamenti:[]}];\n";
const ANCORA_GUASTI = "const DEFAULT_MEZZISTR = [";

/* ── I DIFETTI, per la controprova ──
   Sono le versioni **vere** che il core aveva prima, non caricature. */
const DIFETTI = [
  // 1 · il Report tecnico che chiede i numeri al rapportino invece che a `misureRapportino`
  [`      return[dataO(r.data),c?c.nome:'\u2014',u?u.nome+' '+u.cognome:'\u2014',
        ms.misurato?ms.fori:'non misurato',
        ms.metri===null?'\u2014':ms.metri.toFixed(1),
        ms.calcolabile?ms.mc.toFixed(1):'\u2014'];}),`,
   `      return[dataO(r.data),c?c.nome:'\u2014',u?u.nome+' '+u.cognome:'\u2014',r.fori||0,(r.metri||0).toFixed(1),(r.mc||0).toFixed(1)];}),`],
  // 2 · la riga dei totali e la dichiarazione di che cosa e' rimasto fuori
  [`    foot:rp.length?[[{content:'TOTALI',colSpan:3,styles:{halign:'right',fontStyle:'bold'}},`,
   `    foot:[].length?[[{content:'TOTALI',colSpan:3,styles:{halign:'right',fontStyle:'bold'}},`],
  // 3 · il giudizio di eccellenza su una frammentazione mai valutata
  ["  const valutazione=mf.giudizio?mf.giudizio.toUpperCase():'NON VALUTATO';\n  d.setFont('helvetica','bold');d.setFontSize(11);\n  d.text(`Indice oversize: ${mf.oversize===null?'non valutato':mf.oversize+'%'} \u2014 ${valutazione}`,14,y);y+=8;",
   "  const overPct=f.oversize||0;\n  const valutazione=overPct<3?'ECCELLENTE':(overPct<8?'ACCETTABILE':'CRITICO');\n  d.setFont('helvetica','bold');d.setFontSize(11);\n  d.text(`Indice oversize: ${overPct}% \u2014 ${valutazione}`,14,y);y+=8;"],
  // 4 · le classi granulometriche a zero invece che «non valutato»
  ["  const cl=k=>mf.classi[k]===null?'non valutato':mf.classi[k]+' %';",
   "  const cl=k=>(f[k]||0)+' %';"],
  // 5 · il toast che, sparito, continua a mangiare i tocchi
  ["opacity:0;pointer-events:none;transition:all .3s;z-index:999;white-space:normal;width:max-content;max-width:90vw;text-align:center;line-height:1.35;overflow-wrap:break-word;}",
   "opacity:0;transition:all .3s;z-index:999;white-space:normal;width:max-content;max-width:90vw;text-align:center;line-height:1.35;overflow-wrap:break-word;}"],
  // 6 · il foglio che tace su quello che ha lasciato fuori dai totali
  ["  if(totRT.senzaMisura||totRT.senzaVolume){",
   "  if(false&&(totRT.senzaMisura||totRT.senzaVolume)){"],
  // 7 · le righe senza data buttate via dal Report tecnico
  ["  const inRange=dt=>!dt||((!da||dt>=da)&&(!a||dt<=a));",
   "  const inRange=dt=>dt&&(!da||dt>=da)&&(!a||dt<=a);"],
];

/* ── IL REGISTRATORE AL POSTO DI jsPDF ──
   Espone quel poco che il core usa e annota le stringhe. `save()` chiude un
   documento e lo mette in `window.__pdf`. */
const REGISTRATORE = `
(function(){
  var reg = window.__pdf = { salvati: [] };
  function Doc(){
    this.__t = []; this.__tab = [];
    this.lastAutoTable = { finalY: 40 };
    var self = this;
    this.internal = { getNumberOfPages: function(){ return 1; },
                      pageSize: { getWidth: function(){ return 210; }, getHeight: function(){ return 297; } } };
  }
  ['setFillColor','rect','setTextColor','setFont','setFontSize','setDrawColor','line',
   'setLineWidth','addPage','setPage','circle','addImage','setProperties','setLineDash',
   'setGState','saveGraphicsState','restoreGraphicsState'].forEach(function(n){
    Doc.prototype[n] = function(){ return this; };
  });
  Doc.prototype.text = function(t){
    var v = Array.isArray(t) ? t : [t];
    for (var i = 0; i < v.length; i++) this.__t.push(String(v[i]));
    return this;
  };
  Doc.prototype.splitTextToSize = function(t){ return String(t).split('\\n'); };
  Doc.prototype.getTextWidth = function(t){ return String(t).length * 2; };
  Doc.prototype.autoTable = function(o){
    o = o || {};
    var cella = function(c){ return (c && typeof c === 'object' && 'content' in c) ? String(c.content) : String(c); };
    var riga = function(r){ return (r || []).map(cella); };
    this.__tab.push({ head: (o.head || []).map(riga), body: (o.body || []).map(riga), foot: (o.foot || []).map(riga) });
    this.lastAutoTable = { finalY: (o.startY || 20) + 10 };
    return this;
  };
  Doc.prototype.save = function(nome){
    reg.salvati.push({ nome: String(nome), testi: this.__t.slice(), tabelle: this.__tab.slice() });
    return this;
  };
  window.jspdf = { jsPDF: Doc };
})();
`;

/* ⚠️ E SERVE ANCHE UN FINTO Chart.js, se no la dashboard — che è la schermata
   da cui si preme il bottone — muore su `Chart is not defined` e il banco
   misura una pagina che non è mai arrivata in fondo. I grafici non c'entrano
   con quello che si sta provando; quello che serve è che la schermata si
   monti tutta. */
const FINTO_CHART = `
window.Chart = function(){ this.destroy = function(){}; this.update = function(){}; };
window.Chart.register = function(){};
window.Chart.defaults = { font: {}, plugins: { legend: { labels: {} } } };
`;

let agganci = { volate: 0, guasti: 0, riaperto: 0 };
let colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p === join(R, "index.html")) {
    let t = corpo.toString("utf8");
    let prima = t;
    t = t.split(ANCORA_VOLATE).join(VOLATE + ANCORA_VOLATE);
    if (t !== prima) agganci.volate = 1;
    prima = t;
    t = t.split(ANCORA_GUASTI).join(GUASTI + ANCORA_GUASTI);
    if (t !== prima) agganci.guasti = 1;
    prima = t;
    t = t.split(ANCORA_RAPP).join(RAPP_RIAPERTO + ANCORA_RAPP);
    if (t !== prima) agganci.riaperto = 1;
      if (CONTROPROVA) for (const [sano, malato] of DIFETTI) {
      const suoStrato = sano.includes("pointer-events");
      if (suoStrato !== CONTRO_TOCCO) continue;         // uno strato per volta
      if (t.includes(sano)) { colpiti.add(sano); t = t.split(sano).join(malato); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e risponde «non so fallire». */
const SEGNO = join(R, "__core-doc-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-doc-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const schedeNonAperte = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};

/* ⚠️ Alto 1200 e non 844: il bottone del Report tecnico sta in fondo alla
   dashboard, e a 844 finisce **sotto la barra di navigazione fissa** — il
   click non arriva mai al bottone e il banco muore per timeout invece di
   misurare. La larghezza resta quella del telefono. */
const pg = await b.newPage({ viewport: { width: 390, height: 1200 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await montaFintoFirebase(pg);
/* il registratore al posto di jsPDF (la rotta va DOPO `montaFintoFirebase`:
   Playwright prova i gestori dal più recente) */
await pg.route("https://cdn.jsdelivr.net/npm/jspdf@**/jspdf.umd.min.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: REGISTRATORE }));
await pg.route("https://cdn.jsdelivr.net/npm/chart.js@**", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript", body: FINTO_CHART }));
await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript",
    body: MODULI["firebase-firestore.js"].replace(
      "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
      "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));

await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
let dentro = false;
for (let giro = 0; giro < 8 && !dentro; giro++) {
  await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
  await pg.waitForTimeout(800);
  dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
}
dice(dentro, "si entra davvero nell'app");
/* ⚠️ Questa riga dice solo che la SOSTITUZIONE è avvenuta nel file servito.
   Non dice che i casi siano arrivati nello stato dell'app — ed è esattamente
   la distinzione che il 07/08 è costata undici prove. Che siano arrivati lo
   provano due righe più sotto: la riga del turno riaperto nel foglio e la
   scheda della frammentazione che si apre. */
dice(agganci.volate === 1 && agganci.guasti === 1 && agganci.riaperto === 1,
  `i casi hanno agganciato il TESTO della pagina servita (volate ${agganci.volate}, guasti ${agganci.guasti}, riaperto ${agganci.riaperto})`,
  JSON.stringify(agganci));
dice(await pg.evaluate(() => !!(window.jspdf && window.jspdf.jsPDF)), "il registratore ha preso il posto di jsPDF");

/* ══ 1 · IL REPORT TECNICO, premendo il bottone della dashboard ══ */
await pg.evaluate(() => window.nav("dashboard"));
await pg.waitForTimeout(900);
const viste = await pg.$$eval("[id^=screen-]", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
dice(viste.includes("screen-dashboard"), `navigato alla dashboard (${viste.join(",") || "niente"})`, viste);

/* quello che la SCHERMATA dice, per poterlo confrontare col foglio.
   ⛔ E SI LEGGE IL RIQUADRO, NON LA PAGINA. Fino al 07/08 questa controprova
   cercava «2395» dentro l'`innerText` di tutta la dashboard e diceva ok: quel
   numero c'era, ma era la riga «DETTAGLIO PER OPERATORE · L.Rossi 2395.1 mc»
   — un totale per operatore che per pura coincidenza valeva quanto il totale
   generale di quando la dimostrazione aveva quattro rapportini. Il KPI, nello
   stesso istante, diceva 3466. Una controprova che pesca una sottostringa da
   un blocco di testo di seicento caratteri non confronta niente: risponde ok
   qualunque cosa succeda al numero che dovrebbe sorvegliare. */
await pg.evaluate(() => window.dashSetPeriodo("totale"));
await pg.waitForTimeout(600);
const kpi = await pg.evaluate(() => {
  const c = [...document.querySelectorAll(".kpi-card")].find((x) => /Totali/i.test(x.querySelector(".kpi-lbl")?.textContent || ""));
  const n = [...document.querySelectorAll(".kpi-card")].find((x) => /Rapportini perf/i.test(x.querySelector(".kpi-lbl")?.textContent || ""));
  return { val: c ? c.querySelector(".kpi-val")?.textContent.trim() : null,
           sub: c ? c.querySelector(".kpi-sub")?.textContent.trim() : null,
           righe: n ? n.querySelector(".kpi-val")?.textContent.trim() : null };
});
dice(kpi.val !== null && kpi.sub !== null && kpi.righe !== null,
  `⚠️ il riquadro dei totali della dashboard si legge (val "${kpi.val}", sub "${kpi.sub}", righe "${kpi.righe}")`, JSON.stringify(kpi));

/* ⚠️ DUE COSE COPRONO QUEL BOTTONE, e tutt'e due fanno morire il click per
   timeout invece di misurare qualcosa:
   · il toast dell'avvio («Accesso al database non consentito») resta davanti
     per due secondi e mezzo — si ASPETTA che sparisca, non si forza il click,
     perché un click forzato prova un gesto che l'utente non può fare;
   · la barra di navigazione è **fissa in fondo**, e `scrollIntoViewIfNeeded`
     di Playwright si accontenta di portare il bottone dentro la finestra:
     dentro la finestra ma sotto la barra. Si centra a mano. */
await pg.waitForFunction(() => !document.getElementById("toast")?.classList.contains("show"),
  { timeout: 15000 }).catch(() => {});
await pg.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => /Report tecnico/.test(x.textContent));
  if (b) b.scrollIntoView({ block: "center" });
});
await pg.waitForTimeout(300);
/* ⛔ E IL CLICK PUÒ NON ARRIVARE: è così che è saltata fuori la striscia
   invisibile del toast. Se non arriva NON si lascia morire il banco per
   timeout — si dichiara, perché «non sono riuscito a premere il bottone» è
   esattamente il difetto, non un intoppo del banco. */
let premuto = true;
try { await pg.click('button:has-text("Report tecnico completo")', { timeout: 8000 }); }
catch (e) { premuto = false; }
dice(premuto, "⛔ il bottone del Report tecnico si può PREMERE davvero (niente di invisibile davanti)",
  "il click non arriva mai al bottone: qualcosa lo copre");
if (premuto) {
  await pg.waitForTimeout(500);
  /* ⛔ LE DATE SI SVUOTANO, e non è pigrizia. Il confronto col riquadro della
     dashboard vale solo se i due numeri parlano dello STESSO insieme di
     righe: la dashboard sta su «TOTALE» (dal 2000 a oggi), quindi il foglio
     deve prendere tutto. Con un intervallo scritto a mano — «01/07 → 31/07»,
     com'era — i due insiemi coincidono finché la dimostrazione ha rapportini
     solo di luglio, e il giorno che ne nasce uno di agosto la prova cade
     accusando i totali di essere sbagliati mentre sono giusti tutt'e due.
     `inRange` risponde vero a tutto quando `da` e `a` sono vuoti. Che i due
     insiemi coincidano davvero non si dà per buono: si misura, confrontando
     il conto delle righe. */
  await pg.fill("#rt-da", "");
  await pg.fill("#rt-a", "");
  await pg.click('#modal .mbtn.primary');
  await pg.waitForTimeout(900);
}
const rt = await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
dice(!!rt && /Report_tecnico/.test(rt.nome), `il bottone ha prodotto un documento (${rt ? rt.nome : "nessuno"})`, rt && rt.nome);

const tabRp = rt && rt.tabelle[0] ? rt.tabelle[0] : { head: [], body: [], foot: [] };
const tabRf = rt && rt.tabelle[1] ? rt.tabelle[1] : { head: [], body: [], foot: [] };
const piatto = (t) => JSON.stringify(t.body);

// il turno del 21/07 è quello aperto e mai misurato
const r21 = tabRp.body.find((r) => /21\/07/.test(r[0]));
dice(!!r21, `la riga del turno mai misurato c'è (${tabRp.body.length} righe)`, piatto(tabRp));
dice(!!r21 && !/^0$/.test(r21[3]) && !/^0\.0$/.test(r21[4]) && !/^0\.0$/.test(r21[5]),
  "⛔ il turno aperto e mai misurato NON esce «0 · 0.0 · 0.0»", r21 && r21.join(" | "));
dice(!!r21 && /non misurato/.test(r21[3]), "e lo dice, invece di tacere", r21 && r21.join(" | "));

// il turno del 23/07: nove fori veri, maglia da confermare
const r23 = tabRp.body.find((r) => /23\/07/.test(r[0]));
dice(!!r23 && r23[3] === "9" && /^81/.test(r23[4]), "il turno misurato senza maglia tiene fori e metri, che sono misurati", r23 && r23.join(" | "));
dice(!!r23 && !/^0\.0$/.test(r23[5]), "⛔ ma i metri cubi NON sono «0.0»: la maglia non c'è, il volume non si calcola", r23 && r23.join(" | "));

// il turno sano resta un numero
const r14 = tabRp.body.find((r) => /14\/07/.test(r[0]));
dice(!!r14 && r14[3] === "14" && /1190\.7/.test(r14[5]), "il turno misurato per bene continua a dire il suo volume", r14 && r14.join(" | "));

/* ── I TOTALI ──────────────────────────────────────────────────────────────
   ⛔ E I NUMERI ATTESI NON SI SCRIVONO A MANO. Fino al 07/08 qui c'era
   `2395.1 / 317 / 34`: erano i totali giusti della dimostrazione **di quattro
   rapportini**, e il 06/08 la dimostrazione ne ha guadagnato un quinto
   (`rp_5`, 12 fori · 102 m · 1071 mc). Da quel commit le due righe accusavano
   il core di sommare i turni non misurati mentre il foglio, misurato nello
   stesso istante del riquadro della dashboard, diceva esattamente il suo
   stesso numero. Un banco che porta dentro di sé una copia dei dati invecchia
   ogni volta che i dati cambiano, e quando invecchia manda a cercare un
   guasto che non c'è.
   Le due domande, adesso, sono **derivate** e non hanno un numero dentro:
   1. il piede è d'accordo con quello che il foglio ha stampato **da sé** —
      cioè non somma le righe che ha appena dichiarato non misurabili;
   2. il piede è d'accordo con il riquadro della dashboard che ospita il
      bottone, che è la stessa domanda con cui questo banco è nato. */
const piede = JSON.stringify(tabRp.foot || []);
const num = (s) => { const v = parseFloat(String(s).replace(/\s/g, "")); return Number.isFinite(v) ? v : null; };
const sommaCol = (i) => tabRp.body.reduce((s, r) => s + (num(r[i]) ?? 0), 0);
const pf = (tabRp.foot && tabRp.foot[0]) || [];
/* il piede ha quattro celle: l'etichetta (che vale per tre colonne) e i tre numeri */
const pFori = num(pf[1]), pMetri = num(pf[2]), pMc = num(pf[3]);
const vicino = (a, b) => a !== null && Math.abs(a - b) < 0.05;
dice(pf.length === 4 && vicino(pMc, sommaCol(5)),
  `⛔ il foglio ha una riga di TOTALI, e il volume è la somma di quello che il foglio stesso ha stampato (${sommaCol(5).toFixed(1)})`, piede);
dice(vicino(pMetri, sommaCol(4)) && vicino(pFori, sommaCol(3)),
  `con metri e fori sommati con la stessa regola (${sommaCol(4).toFixed(1)} m, ${sommaCol(3)} fori)`, piede);
/* ⛔ E LA SOMMA INGENUA DEVE ESSERE DIVERSA, se no le due righe qui sopra non
   distinguono niente: è il turno riaperto (fori azzerati, volume rimasto) a
   renderle capaci di fallire. Se un giorno quel caso sparisse dai dati, questa
   riga lo direbbe invece di lasciare due prove che passano sempre. */
const r25 = tabRp.body.find((r) => /25\/07/.test(r[0]));
dice(!!r25 && /non misurato/.test(r25[3]) && r25[5] === "—",
  "⛔ il turno riaperto (fori azzerati, volume rimasto dal giro prima) non porta il suo volume nel foglio", r25 && r25.join(" | "));
const testi = (rt ? rt.testi : []).join(" · ");
dice(/senza nessun foro misurato/.test(testi) && /senza maglia/.test(testi),
  "⛔ e il foglio DICHIARA quanti turni sono rimasti fuori dal totale, con le due ragioni distinte", testi);

/* ── LA CONTROPROVA SULLO SCHERMO ──
   Prima: gli insiemi coincidono? Il foglio è senza date (tutto), la dashboard
   è su «TOTALE». Se i conti delle righe non combaciano, i numeri non sono
   confrontabili e va detto — invece di dare la colpa ai totali. */
const righeFoglio = ((rt ? rt.testi : []).find((t) => /^Rapportini perforazione/.test(t)) || "").match(/\((\d+)\)/);
dice(!!righeFoglio && righeFoglio[1] === kpi.righe,
  `⚠️ foglio e riquadro parlano dello stesso insieme di righe (foglio ${righeFoglio ? righeFoglio[1] : "?"}, riquadro ${kpi.righe})`,
  JSON.stringify({ foglio: righeFoglio && righeFoglio[1], riquadro: kpi.righe }));
/* il riquadro arrotonda all'intero (`toFixed(0)`), il piede tiene un decimale */
const kMc = num(kpi.val), kFori = num((kpi.sub || "").match(/(\d+)\s*for/)?.[1]), kMetri = num((kpi.sub || "").match(/([\d.]+)\s*m\b/)?.[1]);
dice(pMc !== null && kMc !== null && Math.abs(Math.round(pMc) - kMc) < 1
     && kFori === pFori && kMetri !== null && Math.abs(Math.round(pMetri) - kMetri) < 1,
  `controprova sullo schermo: il riquadro che ospita il bottone dice gli stessi numeri (riquadro ${kMc} mc · ${kFori} fori · ${kMetri} m — foglio ${pMc} · ${pFori} · ${pMetri})`,
  JSON.stringify({ riquadro: kpi, piede: pf }));

// il fochino: i chili non scritti
const rf18 = tabRf.body.find((r) => /18\/07/.test(r[0]));
dice(!!rf18 && /non dichiarato/.test(rf18[3]), "la volata coi chili non scritti lo dice", rf18 && rf18.join(" | "));

// i guasti senza data
dice(/Compressore/.test(JSON.stringify(rt ? rt.tabelle : [])),
  "⛔ il guasto con la data cancellata È nel documento, invece di sparire", JSON.stringify(rt ? rt.tabelle.slice(2) : []));
dice(/senza data/.test(JSON.stringify(rt ? rt.tabelle : [])),
  "e la sua data manca dichiarandolo, non con un vuoto qualunque", JSON.stringify(rt ? rt.tabelle.slice(2) : []));

/* ══ 2 · IL PDF DELLA FRAMMENTAZIONE ══
   ⚠️ Nessun bottone della pagina apre questa scheda: misurato con
   `grep -n "apriFrammentazione" index.html` — una sola riga, la definizione,
   più l'elenco dei segnaposto. Si apre per la sola via che esiste, e la cosa
   sta scritta nel resoconto invece che nascosta. */
async function pdfFrammentazione(idVolata) {
  /* `apriEditorCava` è la via vera con cui una volata diventa «quella
     selezionata» (`state.volataSel`), ed è il bottone della scheda cava; da lì
     `apriFrammentazione` è l'unico modo che esiste di aprire questa scheda. */
  await pg.evaluate((id) => { window.apriEditorCava(id); window.apriFrammentazione(id); }, idVolata);
  await pg.waitForTimeout(400);
  /* ⛔ LA SCHEDA PUÒ NON APRIRSI, E ALLORA NON SI ASPETTA TRENTA SECONDI UN
     BOTTONE CHE NON C'È. Il 07/08 è successo — `apriFrammentazione` non
     trovava la volata (`toast('Volata non trovata')` e via) — e `page.click`
     è morto per timeout portandosi dietro **undici** prove che venivano dopo,
     tutte mai eseguite: le tre sulla volata mai valutata, quella sulla
     valutata per bene, le due sulla valutata a metà, le tre sulla striscia
     invisibile del toast e quella sugli errori di pagina. Un banco che crolla
     smette di guardare, e il riepilogo non lo dice: dichiara meno prove,
     non un buco. Adesso si guarda se la scheda è aperta e si torna indietro
     dicendolo, così le prove dopo girano lo stesso. */
  const aperta = await pg.evaluate(() => {
    const m = document.getElementById("modal");
    return !!m && m.classList.contains("show")
      && [...m.querySelectorAll(".mbtn")].some((b) => /PDF/.test(b.textContent));
  });
  if (!aperta) { schedeNonAperte.push(idVolata); return null; }
  const prima = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.click('#modal .mbtn:has-text("PDF")');
  await pg.waitForTimeout(700);
  const dopo = await pg.evaluate(() => (window.__pdf?.salvati || []).slice(-1)[0] || null);
  const n = await pg.evaluate(() => (window.__pdf?.salvati || []).length);
  await pg.evaluate(() => window.closeModal());
  await pg.waitForTimeout(200);
  return n > prima ? dopo : null;
}

const fr1 = await pdfFrammentazione("vz1");   // nessuno ha valutato niente
dice(schedeNonAperte.length === 0,
  `⛔ la scheda della frammentazione si APRE davvero: i casi sono arrivati nello stato, non solo nel file servito`,
  "apriFrammentazione non ha trovato: " + schedeNonAperte.join(", "));
dice(!!fr1, "il bottone PDF della frammentazione produce un documento", fr1 && fr1.nome);
const t1 = (fr1 ? fr1.testi : []).join(" · ");
const g1 = JSON.stringify(fr1 ? fr1.tabelle : []);
dice(!/ECCELLENTE/.test(t1), "⛔ una volata che nessuno ha valutato NON esce «ECCELLENTE»", t1);
dice(/non valutat/i.test(t1), "e il foglio dice che non è stata valutata", t1);
dice(!/"0 %"/.test(g1), "⛔ e le quattro classi non escono a «0 %»", g1);

const fr2 = await pdfFrammentazione("vz2");   // valutata per bene
const t2 = (fr2 ? fr2.testi : []).join(" · ");
dice(/6/.test(t2) && /ACCETTABILE/.test(t2),
  "la volata valutata per bene continua a dire il suo giudizio", t2);

const fr3 = await pdfFrammentazione("vz3");   // valutata a metà: 20 + 2 = 22%
const t3 = (fr3 ? fr3.testi : []).join(" · ");
const g3 = JSON.stringify(fr3 ? fr3.tabelle : []);
dice(/2%/.test(t3) || /2 %/.test(t3), "la valutazione a metà tiene i due valori che qualcuno ha scritto", t3);
dice(/incompleta|non attendibile|22/.test(t3 + g3),
  "⛔ ma dichiara che la distribuzione non fa 100: un oversize su un totale del 22% non è confrontabile", t3 + " | " + g3);

/* ══ 3 · IL TOCCO ARRIVA DAVVERO AL BOTTONE? ══
   ⛔ Trovato mentre si cercava di premere il bottone del Report tecnico, e non
   leggendo il codice: `.toast` non si nasconde mai. Resta `position:fixed` a
   80 px dal fondo con `opacity:0` ma `visibility:visible` e — questo era il
   punto — `pointer-events:auto`, largo fino al 90% dello schermo. Dal primo
   messaggio in poi una striscia invisibile di circa 351×57 px sta per sempre
   davanti alla pagina, proprio dove cade il pollice. Censimento su otto
   sezioni: **6 comandi su 137**, fra cui DUE dei bottoni di esportazione.
   ⚠️ La domanda è di un piano più sotto di quella di `promesse-tocco.mjs`:
   là si chiede «questa riga, che mostra la manina, ha un aggancio?», qui
   «l'aggancio c'è, ma il tocco ci ARRIVA?». Un `onclick` sotto un velo
   invisibile risponde di sì alla prima domanda e di no alla seconda.
   ⚠️ E si guarda il RISULTATO del test di collisione del browser
   (`elementFromPoint`), che è la sua risposta a «di chi è questo punto»: non
   si confrontano rettangoli a mano. */
await pg.evaluate(() => window.nav("dashboard"));
await pg.waitForTimeout(3500);          // i toast di prima («PDF generato») sono svaniti da un pezzo
const testoToast = await pg.evaluate(() => (document.getElementById("toast")?.textContent || "").trim());
dice(testoToast.length > 0 && !(await pg.evaluate(() => document.getElementById("toast").classList.contains("show"))),
  `⚠️ prova che un toast c'è stato ed è svanito: senza, questa misura non guarda niente ("${testoToast.slice(0, 40)}")`, testoToast);
/* ⚠️ SI SCORRE, se no si misura una schermata su tre: la striscia è FISSA a
   80 px dal fondo, quindi che cosa ci finisca dentro dipende da dove si è
   scrollati — e i bottoni che ci cadevano (Report tecnico, Esporta PDF
   mensile) stanno in fondo alla loro pagina. Un controllo che guarda solo il
   primo schermo risponde «zero» e non ha guardato dove il difetto sta. */
const coperti = await pg.evaluate(async () => {
  const vis = (e) => { const c = getComputedStyle(e); return c.display !== "none" && c.visibility !== "hidden" && e.getBoundingClientRect().height > 0; };
  const fuori = new Set(), misurati = new Set();
  for (const sez of ["home", "cave", "volate", "dashboard", "ufficio", "macchine", "deposito"]) {
    try { window.nav(sez); } catch (e) { continue; }
    await new Promise((r) => setTimeout(r, 250));
    for (let y = 0; y < Math.max(1, document.body.scrollHeight); y += 120) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
      for (const e of [...document.querySelectorAll("button,[onclick],a[href],.sitem,.item,input,select,textarea")].filter(vis)) {
        const b = e.getBoundingClientRect();
        if (b.bottom < 0 || b.top > innerHeight) continue;
        const k = sez + "|" + (e.id || "") + "|" + (e.textContent || "").trim().slice(0, 30);
        misurati.add(k);
        const s = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        if (s && s.id === "toast") fuori.add(k);
      }
    }
    window.scrollTo(0, 0);
  }
  return { n: misurati.size, fuori: [...fuori] };
});
dice(coperti.fuori.length === 0,
  `⛔ nessun comando finisce sotto la striscia invisibile del toast (${coperti.n} comandi misurati)`,
  coperti.fuori.join(" | "));
const stileToast = await pg.evaluate(() => getComputedStyle(document.getElementById("toast")).pointerEvents);
dice(stileToast === "none", `e il toast non prende i tocchi (pointer-events: ${stileToast})`, stileToast);

dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

if (CONTROPROVA) {
  const attesi = DIFETTI.filter((x) => x[0].includes("pointer-events") === CONTRO_TOCCO).length;
  console.log(`\n  difetti rimessi: ${colpiti.size} su ${attesi} (strato: ${CONTRO_TOCCO ? "il tocco che non arriva" : "i numeri dei documenti"})`);
  if (colpiti.size !== attesi) {
    console.log("  ⚠️  un difetto non ha trovato il suo testo: la controprova non prova quello che dice");
    ko++;
  }
}
console.log(`\nRisultato documenti che escono (core): ${ok} passate, ${ko} cadute`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

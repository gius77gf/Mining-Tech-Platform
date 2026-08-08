/* I DOCUMENTI CHE ESCONO DA GENESI — provati premendo il bottone e aprendo il
   file, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-documenti-che-escono.mjs [--porta=8744]
     node genesi-documenti-che-escono.mjs --controprova   (rimette i difetti: DEVE fallire)
     node genesi-documenti-che-escono.mjs --dimmi         (stampa i file interi)

   PERCHÉ ESISTE. La domanda di CLAUDE.md — «dove questa app compone qualcosa
   che ESCE, chi decide i suoi numeri?» — il 03/08 ha trovato ventiquattro
   difetti veri in cinque app. **Su Genesi non era mai stata fatta.** Genesi ha
   nove bottoni che salvano un file e una finestra di stampa; il foglio
   stampabile e il confronto A/B li tiene già `genesi-foglio-in-cava.mjs`, e
   questo banco guarda i quattro punti rimasti scoperti in cui il file diceva
   una cosa diversa dallo schermo. Nessuno si vedeva leggendo il codice: sono
   usciti tutti aprendo il file che esce.

   1. LA SCHEDA VOLATA NON DICEVA DA DOVE VIENE LA PPV. Aprendo DUE VOLTE lo
      stesso identico progetto — una con la legge di sito accesa su tre
      referti, una senza — e affiancando i due `genesi_scheda_volata.csv`:
      **una riga su sedici** cambiava, «PPV recettore (mm/s);1.9» contro
      «;4.1», e nel file non c'era una parola per distinguerle. Lo schermo
      intanto scriveva «legge provvisoria: sotto gli 8 referti la pendenza si
      muove ancora parecchio». Due schede archiviate col rapportino a due mesi
      di distanza erano confrontabili solo per sbaglio. Era la QUARTA
      superficie con la stessa mancanza, dopo il foglio stampato (corretto il
      06/08), la scheda validatori e il riquadro «Manda a Sentinella»: la
      frase la compone `provenienzaPpv`, che è la stessa funzione che decide il
      numero.
   2. E NELLA STESSA SCHEDA L'AIRBLAST NON C'ERA PROPRIO — la mancanza già
      corretta nel foglio stampato il 06/08. La scheda validatori ha la sua
      riga (a 60 m dà 143 dB(L), rosso, dieci sopra il limite USBM/OSM di 133)
      e il commento sopra l'export prometteva «stesse cifre della Scheda
      validatori».
   3. LA RICONCILIAZIONE PERDEVA LA MISURA, E LA SCRIVEVA CON DUE CONVENZIONI.
      Digitando i valori reali come li scrive chi lavora in cava, con la
      virgola: mentre si digita lo schermo diceva «+3,5 cm (+13%)», giusto;
      **salvato**, la riga di storico diventava «X50 28→— cm · PPV 1,9→— mm/s
      · fly 101→— m» — tre misure fatte in cava sparite dal registro che le
      deve conservare, sostituite dal segno che l'ecosistema usa per «nessuno
      ha misurato». E il CSV usciva «28;31,5;1.9;7,2»: due convenzioni
      decimali in colonne adiacenti, in un file la cui intestazione dichiara
      «i numeri restano col punto». Chi lo apre in Excel non può sottrarre le
      due colonne, che è l'unica cosa per cui quel file esiste. La causa è la
      solita: `riconDelta` legge il valore scritto a mano con `gIn`, e il
      salvataggio dodici righe più giù se n'era tenuta una versione più debole
      (`isNaN(+v) ? v : +v`).
   4. IL `.volata.json` CONSEGNAVA LO SCATTER AL POSTO DEL RITARDO. Col
      pannello 3D fermo su «42 ms» e il piano di carico che scrive 0/42/84/126,
      il file di scambio scriveva 0 · 42,332516881726825 · 84,36212721741676 ·
      128,76780231479614 — cioè lo scatter d'innesco, che `buildSim` somma
      apposta al tempo nominale (`f.tNom=f.tDet; f.tDet=f.tDet+_gauss(rng)*sd`).
      Il tempo nominale era lì accanto, nello stesso oggetto. E il giro di
      andata e ritorno lo perdeva: l'importatore ricava il passo dalla mediana
      delle differenze fra ritardi distinti, con lo scatter sono tutte diverse,
      la mediana non cade in `[17,25,42,65]` e il ripiego riportava a **25 ms**
      una volata progettata a **42**.
   5. E UN NUMERO ALL'INGLESE NELLA MODALE DEL COMPOSITO: `+dev+` concatenato
      senza formattatore scriveva «77.7 mm/s» in mezzo a «3,48», «8,0» e
      «0,50 ms». Le cifre lette nel pannello: 0,50 · 3,48 · 3,48 · 1,00 · 8,0 ·
      77.7 — una sola col punto.
   6. E DAL 07/08 LA LEZIONE DEL n. 4 NON È PIÙ AFFIDATA ALLA MEMORIA. Quel
      difetto era stato trovato **a mano**, aprendo il file, e il segno che lo
      tradiva — «un numero con quindici decimali dove lo schermo ne mostra
      zero» — era rimasto scritto in prosa in CLAUDE.md. Adesso ogni file che
      passa da `esce()` viene setacciato (`campione-scappato.mjs`, condiviso con
      `csv-dimostrazione.mjs`): **2.097 numeri** su 8 file, con l'unica soglia
      diversa dichiarata per nome e con la ragione. E il setaccio sa fallire
      da solo su questo difetto: con `--controprova` le prove cadute passano
      da 21 a **22**, ed è la sua riga sul `.volata.json`.

   ⛔ I CASI SI COSTRUISCONO NEI DATI, mai nel file su disco: la volata e la
   legge di sito entrano da `localStorage` (`genesiVolate`, `genesiSito`), le
   stesse chiavi che l'app scrive da sé. Accanto ci sono cantieri che scrivono.

   ⚠️ GENESI È `apps/genesi/genesi.html`, non `index.html`: è l'app fuori
   convenzione, e il 03/08 la regola 20 di `run-stile` l'aveva saltata proprio
   per questo. Un banco che costruisce il percorso per convenzione qui non
   guarda niente e risponde «pulito».
   ⚠️ E GENESI NON HA `.page`: la navigazione mette `scr-<nome>` sul `body`. La
   prova di aver navigato si legge lì. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
/* la regola del campione scappato vive dove è nata, e si importa: la stessa
   domanda serve a questo banco e alle sei app di `csv-dimostrazione` */
import { campioniScappati, sogliaPer, chiaveSoglia, SOGLIE } from "./campione-scappato.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8744;
const TMP = "/tmp/genesi-documenti-" + process.pid;
mkdirSync(TMP, { recursive: true });
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, nella forma in cui stavano nella pagina prima del
   07/08. Si contano: una controprova che non sostituisce niente non prova
   niente — ed è successo, in questa stessa casa, con un `assert` che cercava
   quattro spazi dove il file ne ha due. */
const DIFETTI = [
  // 1 e 2 · la scheda volata senza la base della PPV e senza l'airblast
  [`    ['Esito PPV', _eP.verdetto],
    ['Distanza recettore (m)', D2.recDist],
    ['MIC carica per ritardo (kg)', _mic],
    ['Base della previsione PPV', k.ppvBase&&k.ppvBase.breve],
    ['Referti della legge di sito', k.ppvBase&&k.ppvBase.fonte==='sito' ? k.ppvBase.referti : ''],`,
   `    ['Distanza recettore (m)', D2.recDist],`],
  [`    ['Avvisi sulla previsione PPV', (k.ppvBase&&k.ppvBase.avvisi||[]).join(' ')],
    ['Airblast previsto (dB(L))', _db],
    ['Limite airblast (dB(L))', AIRBLAST_LIMITE_DB],
    ['Esito airblast', _eA.verdetto],`, ``],
  // 3 · il salvataggio della riconciliazione che non sa leggere la virgola
  [`  const val=id=>{ const v=$(id)?String($(id).value).trim():''; if(v==='') return null;
    const n=gIn(v); return isFinite(n)?n:v; };`,
   `  const val=id=>{ const v=$(id)?$(id).value:''; return v===''?null:(isNaN(+v)?v:+v); };`],
  // 4 · il .volata.json con lo scatter al posto del ritardo di progetto
  [`    ritardo:+((f.tNom!=null?f.tNom:f.tDet)||0).toFixed(1),`, `    ritardo:f.tDet,`],
  // 5 · il numero all'inglese nella modale del composito
  [`+gfix(dev,1)+' mm/s</div>'`, `+dev+' mm/s</div>'`],
  /* 6 · LA FRASE CHE CONTA UNA COSA E IL FILE CHE NE SCRIVE UN'ALTRA. È la
     forma esatta in cui questa famiglia si presenta — la frase conta l'array
     sorgente mentre il ciclo che scrive filtra — e qui la si rimette nel modo
     più corto possibile: un foro in più annunciato di quanti ne escono.
     ⚠️ L'ancora è CORTA di proposito: una citazione di cinque righe scade in
     poche ore (misurato l'08/08: tre iniezioni morte in venti banchi) e una
     controprova che non aggancia gira su un prodotto sano dicendo «distingue».
     Qui basta il numero, che è il soggetto della prova. */
  [`_ricPlur(D2.holes.length,'foro','fori')`, `_ricPlur(D2.holes.length+1,'foro','fori')`],
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro, ed è la forma
   silenziosa della trappola — per un'ora, il 01/08, una controprova ha detto
   «non so fallire» mentre iniettava in una cartella che nessuno guardava. */
const SEGNO = join(R, "__genesi-documenti-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-documenti-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0, fileAperti = 0, numeriConfrontati = 0, numeriLetti = 0;
const dichiarateViste = new Set();
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

const BASE = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, sequenza: "diagonale", perRow: 12, file: 1,
  recNorma: "din-sens", recFreq: 25, recDist: 400 };
/* tre referti: `sitoFit` con meno di otto dichiara la legge PROVVISORIA, ed è
   esattamente il caso in cui il numero si muove senza che il progetto cambi */
const SITO_TRE = { usa: true, punti: [
  { d: 120, w: 50, ppv: 9.2, fonte: "mano", ts: "2026-06-02", nome: "A" },
  { d: 260, w: 55, ppv: 3.1, fonte: "csv", ts: "2026-06-14", nome: "B" },
  { d: 430, w: 48, ppv: 1.4, fonte: "sentinella", ts: "2026-06-30", nome: "C" }] };

async function apri(sito, design) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.addInitScript((arg) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Fronte Nord 12/07",
      data: "2026-07-12", sintesi: "12 fori", design: arg.design }]));
    if (arg.sito) localStorage.setItem("genesiSito", JSON.stringify(arg.sito));
  }, { design: design || BASE, sito });
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  /* si intercetta il salvataggio del file: sia la forma `data:` (i CSV e
     l'XML) sia il `Blob` (il .volata.json), perché Genesi usa tutt'e due */
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
    window.__usciti = [];
    const clic = HTMLAnchorElement.prototype.click;
    URL.createObjectURL = function (bl) { window.__bl = bl; return "blob:sonda"; };
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) {
        const h = String(this.href);
        if (h.startsWith("blob:")) {
          const i = window.__usciti.push({ nome: this.download, testo: "" }) - 1;
          if (window.__bl) window.__bl.text().then((t) => { window.__usciti[i].testo = t; });
        } else window.__usciti.push({ nome: this.download, testo: decodeURIComponent(h.replace(/^data:[^,]*,/, "")) });
        return;
      }
      return clic.apply(this, arguments);
    };
  });
  await pg.waitForTimeout(500);
  /* la volata salvata si apre dalla via vera, il bottone «Apri» della Home */
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="vX"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1600);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-design"), "la volata salvata si apre davvero nel 2D", cls);
  return pg;
}
/* ⛔ SI PRETENDE CHE IL FILE SIA USCITO DAVVERO. Un banco che preme un bottone
   che non salva niente e poi non trova il testo che cerca stampa un KO che
   sembra un difetto di prodotto: qui il conto dei file aperti lo distingue. */
import { azzeraFrasi, frasiVisibili, contiNellaFrase, righeDiDato, postiDaFrase } from "./giro.mjs";

let fraseConNumero = 0, fraseSenzaNumero = 0, fraseNonCsv = 0, fraseMuta = 0, senzaPosto = 0;
async function esce(pg, id, nome) {
  const prima = await pg.evaluate(() => window.__usciti.length);
  const bot = await pg.$("#" + id);
  if (!bot) { dice(false, `il bottone #${id} esiste`, "assente"); return ""; }
  await azzeraFrasi(pg);   // se no si legge la frase di un'altra esportazione
  await pg.evaluate((i) => document.getElementById(i).click(), id);
  await pg.waitForTimeout(900);
  const u = await pg.evaluate((n) => (window.__usciti.length > n ? window.__usciti[window.__usciti.length - 1] : null), prima);
  if (!u) { dice(false, `${nome}: il file esce davvero premendo #${id}`, "nessun download"); return ""; }
  fileAperti++;
  dice(u.testo.length > 30, `${nome} esce davvero da #${id} (${u.nome}, ${u.testo.length} caratteri)`, u.testo.slice(0, 90));
  /* ⛔ LA TERZA GAMBA DELLA DOMANDA DI CASA: la frase di riepilogo contro il
     file. La regola sta in `giro.mjs` — la usano Flotta, Conti, Scudo e Campo.
     Qui si aggancia al punto unico da cui passa OGNI uscita, come già fa la
     domanda del campione scappato.
     ⚠️ Solo sui CSV: in un XML o in un JSON «le righe» non vogliono dire
     niente, e chiederlo lo stesso sarebbe un controllo che non guarda dove
     crede. Quelli si contano a parte. */
  if (/\.csv$/i.test(u.nome || "")) {
    const frase = await frasiVisibili(pg);
    const numeri = contiNellaFrase(frase);
    if (numeri.length) {
      fraseConNumero++;
      const dati = righeDiDato(u.testo.split(/\r?\n/).filter(Boolean));
      dice(numeri.includes(dati) || numeri.reduce((t, x) => t + x, 0) === dati,
        `le righe del file sono fra i numeri che la frase dichiara (${id})`,
        `frase «${frase.slice(0, 80)}» · numeri [${numeri}] · righe di dato ${dati}`);
    } else if (frase.trim()) fraseSenzaNumero++;
      else if (await postiDaFrase(pg) > 0) fraseMuta++;
      else senzaPosto++;
  } else fraseNonCsv++;
  /* ⛔ IL CAMPIONE SCAPPATO, CHIESTO A OGNI FILE CHE PASSA DI QUI. Il difetto
     n. 4 di questo banco — lo scatter d'innesco consegnato al posto del
     ritardo — è stato trovato **a mano**, aprendo il file, e la lezione era
     rimasta scritta in prosa: «un numero con quindici decimali dove lo schermo
     ne mostra zero». Adesso la domanda si fa da sé su ogni uscita, e la
     funzione sta in un posto solo (`csv-dimostrazione.mjs`) perché la stessa
     regola serve anche alle sei app che quel banco visita: due copie uguali
     oggi divergono domani senza che nessuno lo veda.
     ⚠️ La soglia non è indovinata: è misurata sui 33 file veri delle sei app
     (113 numeri a una cifra, 12 a due, 18 a tre, ZERO a quattro o più). */
  const soglia = sogliaPer(u.nome);
  /* ⚠️ si segna la CHIAVE che ha combaciato, non il nome del file: dal 07/08 la
     chiave è un prefisso (il nome porta l'onda, i fori e il ritardo), quindi un
     confronto per nome esatto direbbe «l'eccezione non si presenta più» su una
     eccezione che si presenta eccome — un allarme falso al posto di una guardia */
  const chiave = chiaveSoglia(u.nome);
  if (chiave) dichiarateViste.add(chiave);
  const { guardati, scappati } = campioniScappati(u.testo, soglia);
  numeriLetti += guardati;
  dice(scappati.length === 0,
    `${nome}: nessun numero porta più di ${soglia} decimali (${guardati} numeri guardati in ${u.nome})`,
    scappati.slice(0, 4).join(" · "));
  if (DIMMI) console.log(`\n──────── ${u.nome} ────────\n${u.testo}\n────────`);
  return u.testo;
}
const svRiga = async (pg, re) => (await pg.evaluate(() => {
  const el = document.getElementById("d2-scheda"); if (!el) return [];
  return [...el.querySelectorAll(".sv-row")].map((r) => ({ lab: r.querySelector(".sv-lab").textContent.trim(),
    val: r.querySelector(".sv-val").innerText.trim(), why: r.querySelector(".sv-why").innerText.replace(/\s+/g, " "),
    cls: r.querySelector(".sv-dot").className }));
})).find((r) => re.test(r.lab));
const cella = (csv, etichetta) => {
  const r = csv.split("\n").find((x) => x.split(";")[0] === etichetta);
  return r === undefined ? null : r.slice(etichetta.length + 1);
};

console.log(`\n════════ i documenti che escono da Genesi${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · LA SCHEDA VOLATA: DA DOVE VIENE LA PPV, E L'AIRBLAST ─────────────
console.log("\n· la scheda volata, con e senza la legge di sito provvisoria");
{
  const con = await apri(SITO_TRE);
  const rCon = await svRiga(con, /PPV al recettore/);
  const aCon = await svRiga(con, /Airblast/);
  const csvCon = await esce(con, "btn-scheda-csv", "scheda volata (legge di sito)");
  const senza = await apri(null);
  const rSen = await svRiga(senza, /PPV al recettore/);
  const csvSen = await esce(senza, "btn-scheda-csv", "scheda volata (da litologia)");

  /* premessa: lo schermo DEVE dare due numeri diversi, se no la prova
     passerebbe per un motivo diverso da quello scritto nel suo nome — è la
     prima delle due letture di «non distingue» */
  numeriConfrontati += 2;
  dice(rCon.val !== rSen.val,
    `premessa: lo schermo dà due PPV diverse con e senza la legge (${rCon.val} contro ${rSen.val})`,
    rCon.val + " / " + rSen.val);
  dice(/provvisoria/i.test(rCon.why), "premessa: e lo schermo la dichiara provvisoria", rCon.why.slice(0, 200));

  numeriConfrontati += 2;
  const pCon = cella(csvCon, "PPV recettore (mm/s)"), pSen = cella(csvSen, "PPV recettore (mm/s)");
  dice(pCon !== null && pCon === rCon.val.replace(",", ".").replace(" mm/s", ""),
    `⛔ il file scrive la stessa PPV dello schermo (${pCon})`, pCon + " vs " + rCon.val);
  dice(pCon !== pSen, `premessa: e nel file i due numeri sono diversi (${pCon} contro ${pSen})`, pCon + "/" + pSen);

  const base = cella(csvCon, "Base della previsione PPV");
  dice(base !== null && /legge di sito/.test(base) && /provvisoria/.test(base),
    "⛔ il file dice DA DOVE viene la PPV, e che la legge è provvisoria", base);
  dice(cella(csvCon, "Referti della legge di sito") === "3",
    "   e su quanti referti è tarata", cella(csvCon, "Referti della legge di sito"));
  dice(/pendenza si muove/.test(cella(csvCon, "Avvisi sulla previsione PPV") || ""),
    "   e per esteso perché quel numero si muoverà", cella(csvCon, "Avvisi sulla previsione PPV"));
  dice(/litologia/.test(cella(csvSen, "Base della previsione PPV") || ""),
    "⛔ e senza referti dice «da litologia», non tace", cella(csvSen, "Base della previsione PPV"));
  dice((cella(csvSen, "Referti della legge di sito") || "") === "",
    "   senza referti la cella dei referti resta VUOTA, non zero (uno zero è un fatto)",
    cella(csvSen, "Referti della legge di sito"));

  /* i due file non possono più essere gemelli con un numero diverso: se lo
     fossero, chi li archivia col rapportino li confronterebbe per sbaglio */
  const righeCon = csvCon.split("\n").filter(Boolean), righeSen = csvSen.split("\n").filter(Boolean);
  const diverse = righeCon.filter((r, i) => r !== righeSen[i]);
  dice(diverse.length >= 3,
    `⛔ fra i due file cambia più della sola cifra della PPV (${diverse.length} righe)`,
    JSON.stringify(diverse));

  numeriConfrontati += 1;
  const db = cella(csvCon, "Airblast previsto (dB(L))");
  dice(db !== null && aCon && db === aCon.val.replace(" dB(L)", ""),
    `⛔ l'airblast c'è, e col numero dello schermo (${db})`, db + " vs " + (aCon && aCon.val));
  dice(cella(csvCon, "Limite airblast (dB(L))") === "133", "   col suo limite USBM/OSM in una cella sua",
    cella(csvCon, "Limite airblast (dB(L))"));
  dice(/limite USBM/.test(cella(csvCon, "Esito airblast") || ""), "   e il verdetto, non due numeri da confrontare a mano",
    cella(csvCon, "Esito airblast"));
  dice(/soglia|SUPERA/i.test(cella(csvCon, "Esito PPV") || ""), "⛔ e lo stesso per la PPV: il verdetto è scritto",
    cella(csvCon, "Esito PPV"));

  dice(con.__err.length === 0 && senza.__err.length === 0, "le due pagine non sollevano errori",
    con.__err.concat(senza.__err)[0]);
  await con.close(); await senza.close();
}

// ── 2 · LA SCHEDA VOLATA CON UNA NORMA CHE GENESI NON RICONOSCE ──────────
/* il caso che il 03/08 scriveva «Limite PPV (mm/s);null»: resta chiuso, e
   adesso c'è anche il verdetto che lo dice a parole invece di una cella vuota */
console.log("\n· la scheda volata con una normativa che Genesi non riconosce");
{
  const pg = await apri(SITO_TRE, { ...BASE, recNorma: "uni-9916" });
  const r = await svRiga(pg, /PPV al recettore/);
  const csv = await esce(pg, "btn-scheda-csv", "scheda volata (norma ignota)");
  numeriConfrontati += 1;
  dice(cella(csv, "Limite PPV (mm/s)") === "", "⛔ il limite non calcolabile è una cella VUOTA, non la parola «null»",
    cella(csv, "Limite PPV (mm/s)"));
  dice(!/;null/.test(csv), "   e in nessuna cella del file compare «null»", (csv.match(/^.*;null.*$/m) || [])[0]);
  dice(/non si può dire/.test(cella(csv, "Esito PPV") || ""),
    "⛔ e l'esito lo DICE, invece di lasciare due celle da confrontare", cella(csv, "Esito PPV"));
  dice(/non si può dire|Non si può dire/.test(r.why), "premessa: è quello che dice anche lo schermo", r.why.slice(0, 150));
  await pg.close();
}

// ── 3 · LA RICONCILIAZIONE: LA VIRGOLA CHE IN CAVA È LA NORMA ────────────
console.log("\n· la riconciliazione, coi valori reali scritti con la virgola");
{
  const pg = await apri(SITO_TRE);
  await pg.evaluate(() => document.getElementById("riconOpen").click());
  await pg.waitForTimeout(700);
  await pg.evaluate(() => {
    const s = (i, v) => { const e = document.getElementById(i); if (e) { e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); } };
    s("ric-x50", "31,5"); s("ric-ppv", "7,2"); s("ric-fly", "88,5"); s("ric-ovs", "12");
    s("ric-nome", "Volata con la virgola");
  });
  await pg.waitForTimeout(400);
  const delta = await pg.evaluate(() => ["ric-d-x50", "ric-d-ppv", "ric-d-fly"].map((i) => document.getElementById(i).innerText).join(" | "));
  dice(/\+3,5 cm/.test(delta), "premessa: mentre si digita lo schermo legge la virgola («+3,5 cm»)", delta);

  await pg.evaluate(() => document.getElementById("riconSave").click());
  await pg.waitForTimeout(900);
  const storico = await pg.evaluate(() => document.getElementById("riconBody").innerText.replace(/\s+/g, " "));
  numeriConfrontati += 3;
  dice(/X50 28→31,5 cm/.test(storico),
    "⛔ nello storico la misura RESTA: «X50 28→31,5 cm», non «28→—»",
    (storico.match(/X50 [^·]*/) || [])[0]);
  dice(/PPV 1,9→7,2 mm\/s/.test(storico), "   e la PPV misurata", (storico.match(/PPV [^·]*/) || [])[0]);
  dice(!/→— /.test(storico), "   nessuna delle tre misure è diventata «—»", (storico.match(/[^·]*→—[^·]*/g) || []).join(" | "));

  const csv = await esce(pg, "riconExport", "storico riconciliazione");
  const riga = (csv.split("\n")[1] || "").split(";");
  numeriConfrontati += 4;
  /* ⛔ L'ASSERZIONE È SUL TESTO DEL FILE, non sul giro di andata e ritorno: una
     coppia scrivi/leggi resta verde se le due metà sbagliano insieme, perché il
     lettore di casa la virgola la legge. Chi apre il file è un altro programma. */
  dice(riga[3] === "31.5", "⛔ nel file il valore reale ha il PUNTO, come il previsto accanto", riga[3]);
  dice(riga[5] === "7.2", "   e così la PPV reale", riga[5]);
  dice(riga[7] === "88.5", "   e la gittata reale", riga[7]);
  dice(!/;\d+,\d/.test(csv), "⛔ in nessuna cella del file resta un numero con la virgola",
    (csv.match(/;\d+,\d[^;]*/g) || []).join(" | "));
  dice(/legge di sito · 3 referti · provvisoria/.test(riga[18] || ""),
    "   e la base della PPV prevista viaggia con la riga (era già così)", riga[18]);

  /* un testo che non è un numero non si butta via e non diventa una misura */
  await pg.evaluate(() => {
    const s = (i, v) => { const e = document.getElementById(i); if (e) { e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); } };
    s("ric-x50", "boh"); s("ric-ppv", ""); s("ric-fly", ""); s("ric-nome", "Volata illeggibile");
    document.getElementById("riconSave").click();
  });
  await pg.waitForTimeout(800);
  const csv2 = await esce(pg, "riconExport", "storico riconciliazione (valore illeggibile)");
  dice(/;boh;/.test(csv2), "⛔ un testo che non è un numero resta nel file: non si butta via quello che qualcuno ha scritto",
    (csv2.split("\n")[2] || "").slice(0, 120));
  dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err[0]);
  await pg.close();
}

// ── 4 · IL .volata.json: IL RITARDO DI PROGETTO, E IL GIRO CHE TORNA ─────
console.log("\n· il .volata.json, e il giro di andata e ritorno del ritardo");
{
  const pg = await apri(SITO_TRE);
  const piano = await esce(pg, "btn-piano-csv", "piano di carico");
  const jsonTx = await esce(pg, "btnExport", "volata JSON");
  const j = JSON.parse(jsonTx || "{}");
  const rit = (j.volata && j.volata.fori || []).map((f) => f.ritardo);
  const passo = j.volata && j.volata.default && j.volata.default.ritardo_ms;
  /* il piano di carico è il file gemello dello stesso progetto: se i due non
     dicono la stessa cosa, uno dei due mente — e non si sa quale leggendo */
  const ritPiano = piano.split("\n").slice(1).filter(Boolean).map((r) => r.split(";")[6]);
  numeriConfrontati += rit.length;
  dice(rit.length === 12 && ritPiano.length === 12, `dodici fori in tutt'e due i file (${rit.length}/${ritPiano.length})`, rit.length);
  dice(rit.every((v, i) => String(v) === String(+ritPiano[i])),
    "⛔ i ritardi del .volata.json sono quelli del piano di carico, foro per foro",
    JSON.stringify(rit) + "\n           piano: " + JSON.stringify(ritPiano));
  dice(rit.every((v) => Number.isInteger(v * 10) && Math.abs(v % passo) < 0.05),
    `⛔ e sono multipli del passo dichiarato due righe sopra (${passo} ms), non lo scatter sorteggiato`,
    JSON.stringify(rit.slice(0, 5)));

  /* ⛔ IL GIRO DI ANDATA E RITORNO, che è quello che il difetto rompeva
     davvero: l'importatore ricava il passo dalla mediana delle differenze fra
     ritardi distinti, e con lo scatter ricadeva sui 25 ms. */
  const f = join(TMP, "andata.volata.json");
  writeFileSync(f, jsonTx);
  await pg.evaluate(() => { const x = [...document.querySelectorAll("#bottomnav button")].find((y) => y.dataset.scr === "sim"); if (x) x.click(); });
  await pg.waitForTimeout(1200);
  await pg.setInputFiles("#fileIn", f);
  await pg.waitForTimeout(2000);
  const rit2 = await pg.inputValue("#pRit").catch(() => "?");
  numeriConfrontati += 1;
  dice(String(rit2) === String(passo),
    `⛔ riletto da Genesi stessa, il ritardo torna ${passo} ms — non il ripiego a 25`, rit2);
  dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err[0]);
  await pg.close();
}

// ── 5 · LA MODALE DEL COMPOSITO: NESSUN NUMERO ALL'INGLESE ───────────────
console.log("\n· il PPV composito: tutte le cifre nella convenzione italiana");
{
  const pg = await apri(SITO_TRE, { ...BASE, recDist: 60 });
  await pg.evaluate(() => document.getElementById("sigOpen").click());
  await pg.waitForTimeout(500);
  const onda = ["tempo_ms;ampiezza"];
  for (let i = 0; i < 60; i++) onda.push((i * 0.5).toFixed(2) + ";" + (Math.sin(i / 3) * Math.exp(-i / 25) * 4.2).toFixed(4));
  const f = join(TMP, "onda.csv");
  writeFileSync(f, onda.join("\n") + "\n");
  await pg.setInputFiles("#sigFile", f);
  await pg.waitForTimeout(1400);
  const t = await pg.evaluate(() => document.getElementById("sigBody").innerText.replace(/\s+/g, " "));
  dice(/PPV composito previsto/.test(t), "premessa: l'onda è entrata e il composito è stato calcolato", t.slice(0, 120));
  const cifre = t.match(/[\d]+[.,][\d]+/g) || [];
  numeriConfrontati += cifre.length;
  const punto = cifre.filter((c) => c.includes("."));
  dice(cifre.length >= 5 && punto.length === 0,
    `⛔ nessuna delle ${cifre.length} cifre del pannello è scritta col punto`, JSON.stringify(punto));
  const csv = await esce(pg, "sigExport", "onda composita");
  /* il file dell'onda invece i numeri li scrive col punto ed è giusto: è un
     file di scambio che rientra da `_sigParse` e da qualunque altro programma */
  dice(/^tempo_ms;ampiezza\n0\.00;/.test(csv), "   e il file dell'onda, che è di scambio, li scrive col punto",
    csv.slice(0, 60));
  dice(pg.__err.length === 0, "la pagina non solleva errori", pg.__err[0]);
  await pg.close();
}

await b.close();
srv.close();

/* ⛔ LE RIGHE CHE DICONO «NON HO GUARDATO» VANNO LETTE PER PRIME. Un «zero
   violazioni» senza il conto dei soggetti non distingue «pulito» da «non ho
   aperto niente»: il 03/08 un banco stampava «0 modali su 68» da mesi in fondo
   a una pagina di verde e nessuno l'ha letto. */
/* ⛔ LA CONTROPROVA DEL CAMPIONE SCAPPATO, e non è iniettabile nella pagina:
   il difetto vero — lo scatter al posto del ritardo — è già il difetto n. 4 qui
   sopra, e rimetterlo prova che il banco vede la RIGA sbagliata, non che sa
   riconoscere la coda di cifre in un file qualunque. Questa prova la funzione,
   col caso vero accanto alle due forme che le assomigliano senza esserlo. */
{
  const caso = (t) => campioniScappati(t).scappati.length;
  dice(caso("ritardo;42,332516881726825;84,36212721741676") === 2,
    "controprova: lo scatter d'innesco verrebbe visto (2 numeri su 2)");
  dice(caso("foro;1;ritardo_ms;42.0;84.0;126.0") === 0,
    "controprova: il piano di carico sano NON viene accusato");
  dice(caso("data;2026-08-07;ora;10:45;kg;1.234.567,89") === 0,
    "controprova: date, orari e migliaia raggruppate non sono campioni scappati");
  /* la guardia collegata: una funzione giusta che nessuno chiama non protegge
     niente — è la forma per cui esiste il conto qui sotto */
  dice(numeriLetti > 50, `il controllo dei decimali ha guardato ${numeriLetti} numeri veri, non zero`, numeriLetti);
  /* ⛔ E OGNI ECCEZIONE DICHIARATA DEVE PRESENTARSI ANCORA: una riga che scusa
     un file che non esce più copre un difetto che non c'è, e nasconde quello
     che nascerebbe al suo posto. */
  const attese = Object.keys(SOGLIE).filter((n) => SOGLIE[n].banco === "genesi");
  for (const n of attese)
    dice(dichiarateViste.has(n), `l'eccezione dichiarata «${n}» si presenta ancora (se no va tolta)`,
      [...dichiarateViste].join(" · "));
}

console.log(`\nsoggetti: ${fileAperti} file salvati e riaperti · ${numeriConfrontati} numeri confrontati col loro valore a schermo o col file gemello`
  + ` · ${numeriLetti} numeri passati al setaccio dei decimali`);
if (CONTROPROVA) {
  console.log(`iniezioni: ${colpiti.size} difetti su ${DIFETTI.length} rimessi nella pagina`);
  if (colpiti.size < DIFETTI.length)
    console.log(`  ⚠️ ${DIFETTI.length - colpiti.size} non hanno trovato il loro pezzo: la controprova vale meno di quello che sembra`);
  console.log(colpiti.size === DIFETTI.length && ko > 0
    ? `✓ il banco SA fallire: ${ko} prove cadute coi difetti rimessi`
    : `✗ coi difetti rimessi il banco non distingue (${ko} cadute, ${colpiti.size}/${DIFETTI.length} iniezioni)`);
  process.exit(colpiti.size === DIFETTI.length && ko > 0 ? 0 : 1);
}
/* ⛔ IL DENOMINATORE DI QUESTA DOMANDA, e diviso in quattro perché tre dei
   quattro casi NON sono difetti e uno non riguarda nemmeno il prodotto:
   · «confrontate» è quello che il banco ha davvero misurato;
   · «mostrata senza un conto» e «muta» dicono qualcosa sul PRODOTTO — Genesi
     salva il file e non annuncia quanto ne esce. Non è un difetto: è una
     scelta, e sta scritta qui perché si veda invece di essere dedotta;
   · «nessun posto per dirla» direbbe una cosa sul RIGHELLO (il selettore non
     trova dove guardare) e va tenuto separato: contarlo insieme ai muti
     farebbe passare un buco della misura per una scelta di prodotto. */
console.log(`  ·  frasi di riepilogo confrontate col file: ${fraseConNumero}`
  + ` · MOSTRATE ma senza un conto: ${fraseSenzaNumero}`
  + ` · il posto per dirla c'è e resta MUTO: ${fraseMuta}`
  + ` · nessun posto per dirla (sarebbe il righello): ${senzaPosto}`
  + ` · uscite non-CSV (XML/JSON, dove «le righe» non vogliono dire niente): ${fraseNonCsv}`);
console.log(`Risultato documenti che escono da Genesi: ${ok} passati, ${ko} falliti su ${prove}`);
process.exit(ko > 0 ? 1 : 0);

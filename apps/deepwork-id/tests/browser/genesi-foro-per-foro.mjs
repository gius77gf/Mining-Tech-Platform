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
  [MODULO, `return { kg: (T - somma) / liberi, propri, liberi, sommaProprie: somma };`, `return { kg: T / N, propri, liberi, sommaProprie: somma };`],
  [PAGINA, `if(_stessiFori) computeSeq2D(); else genMaglia2D();`, `genMaglia2D();`],
  [PAGINA, `const _scartoK = (measureGeom2D(D2).n===nf) ? scartoCaricheProprie(D2.holes, D2.kg) : 0;`, `const _scartoK = 0;`],
  [MODULO, `const _Hb=_profSua===null ? Hb : Math.max(0.5,_profSua), _kg=_kgSua===null ? kg : _kgSua;`, `const _Hb=Hb, _kg=kg;`],
  [MODULO, `if (sua !== null) s += sua - p; }`, `}`],
  /* F3 — il comando: un valore uguale al progetto che resta «proprio», il
     borraggio più lungo del foro accettato, il rombo non disegnato, i fori
     bloccati scritti lo stesso, la selezione che scrive su un foro solo,
     la previsione che tace, la modifica che non si può annullare */
  [MODULO, `if (Number.isFinite(p) && v === p) v = null;`, ``],
  [MODULO, `if (corti) return fermo('borraggio-oltre-il-foro', { corti });`, ``],
  [PAGINA, `if(Object.keys(valoriPropriDiForo(h)).length){\n      const rx=cx+9.5`, `if(false){\n      const rx=cx+9.5`],
  [PAGINA, `if(_foriBloccatiDetto()){ renderInspectorDopo(); return; }`, ``],
  [PAGINA, `valoriForoCollega(_multi);`, `valoriForoCollega([_multi[0]]);`],
  [PAGINA, `(_nPropri?' <span id="x50-foro-tipo">foro tipo</span>':'')`, `''`],
  [PAGINA, `d2PushUndo(); D2.holes=es.fori;`, `D2.holes=es.fori;`],
  /* il tasto Tab: la scheda ridisegnata non ridà il fuoco al campo dopo */
  [PAGINA, `if(id){ const n=$(id); if(n){ n.focus(); if(typeof n.select==='function') n.select(); } }`, ``],
  /* F4 — la tabella dei fori: non segue i fori che cambiano altrove, scrive
     sulla RIGA invece che sul foro, il secondo tocco non inverte l'ordine, il
     Tab perde la cella dopo, si disegna anche da chiusa, a 320 px le colonne
     che si scrivono escono dallo schermo, il valore proprio non è segnato */
  [PAGINA, `tabellaForiDaRifare();   // F4: ogni volta`, `// F4: ogni volta`],
  [PAGINA, `applicaValoreForo([+t.dataset.i], t.dataset.campo, t.value);`, `applicaValoreForo([[...$('ft-corpo').querySelectorAll('.ft-r')].indexOf(t.closest('.ft-r'))], t.dataset.campo, t.value);`],
  [MODULO, `const verso = (ordine && ordine.verso === 'giu') ? -1 : 1;`, `const verso = 1;`],
  [PAGINA, `if(daRifocalizzare){ daRifocalizzare.focus(); if(typeof daRifocalizzare.select==='function') daRifocalizzare.select(); }`, ``],
  [PAGINA, `if(sec.classList.contains('closed')) return;`, ``],
  [PAGINA, `.ft-pos{display:none!important}`, `.ft-pos{}`],
  [PAGINA, `' class="'+(r.propri[campo]?'suo':'')+(no?' oltre':'')`, `' class="'+(no?' oltre':'')`],
  /* F5 — il piano d'innesco XML: ogni foro torna a uscire con la carica del
     progetto, il lettore torna a prendere per progetto i valori del primo
     foro, i valori per foro riletti non vengono riportati sulla maglia */
  [MODULO, `_tag('Charge','kg',valoreDiForo(h,'kg',p))`, `_tag('Charge','kg',p.kg)`],
  [PAGINA, `const charge=_conDesign ? numOf(plan,'DesignCharge') : numOf(holes[0],'Charge');`, `const charge=numOf(holes[0],'Charge');`],
  [PAGINA, `if(_pf.riportati){ D2.holes=_pf.fori; computeSeq2D(); }`, ``],
  /* F5b — il .volata.json: la carica e la profondità tornano quelle del
     progetto per ogni foro; e — il difetto OPPOSTO — la simulazione comincia
     a usare la carica del foro, cioè la decisione 33 presa di nascosto */
  [PAGINA, `kg:('kg' in suoi)?suoi.kg:P.kg, `, `kg:P.kg, `],
  [PAGINA, `prof:('prof' in suoi)?suoi.prof:(`, `prof:(`],
  [PAGINA, `zoff:hh.zoff||0, kg:P.kg, suoi:hh.suoi||null });`, `zoff:hh.zoff||0, kg:(hh.suoi&&('kg' in hh.suoi))?hh.suoi.kg:P.kg, suoi:hh.suoi||null });`],
  /* e la scena che smette di dire su che cosa è calcolata */
  [PAGINA, `const _nSuoiScena = SIM.fori.filter(f=>f.suoi && Object.keys(f.suoi).length).length;`, `const _nSuoiScena = 0;`],
  /* la carica che non entra nel foro: nessun foro risulta mai «non entra», la
     capienza torna quella del foro TIPO (il foro accorciato non si vede), il
     messaggio tace, la riga della scheda resta verde */
  [MODULO, `if (rapporto > MARGINE_CAPIENZA_FORO) out.nonEntra.push(riga);`, `if (false) out.nonEntra.push(riga);`],
  [MODULO, `: caricaForoDaGeometria({ diam, prof, sub: p.sub, stem, densita: p.densita });`, `: caricaForoDaGeometria({ diam: p.diam, prof: p.prof, sub: p.sub, stem: p.stem, densita: p.densita });`],
  [PAGINA, `+_capAvviso, _capDopo.length?'err':undefined);`, `, undefined);`],
  [PAGINA, `cls:nNo?'sv-bad':(nLim?'sv-warn':'sv-ok'),`, `cls:'sv-ok',`],
  /* F6 — il diametro per foro: il DXF torna a disegnare ogni foro col diametro
     del progetto, l'XML e il file di scambio non lo scrivono, e la colonna in
     più compare anche sul telefono facendo scorrere la tabella di lato */
  [MODULO, `const suo = valoreProprioDiForo(h, 'diam'), r = suo === null ? raggio : suo/2000;`, `const r = raggio;`],
  [MODULO, `if(valoreProprioDiForo(h,'diam')!==null) xml+='      '+_tag('HoleDiameter'`, `if(false) xml+='      '+_tag('HoleDiameter'`],
  [PAGINA, `diam:('diam' in suoi)?suoi.diam:P.diam,`, `diam:P.diam,`],
  [PAGINA, `.ft-largo{display:none!important}`, `.ft-largo{}`],
  /* i campi della scheda del foro tornano quelli bianchi del browser, alti 19 px */
  [PAGINA, `#d2-insp input[type=text]{background:#241d12;border:1px solid #473a1f;`, `#d2-insp input[type=nessuno]{background:#241d12;border:1px solid #473a1f;`],
  /* e la colonna del numero stretta com'era: rombo e avviso insieme toccano il ritardo */
  [PAGINA, `.ft-h,.ft-r{grid-template-columns:40px 46px repeat(3,minmax(48px,1fr));min-width:0}`, `.ft-h,.ft-r{grid-template-columns:22px 50px repeat(3,minmax(50px,1fr));min-width:0}`],
  /* F6b — l'inclinazione per foro: il piede torna quello del progetto per tutti
     (profondità e inclinazione del foro ignorate), la scena 3D ruota tutti i
     fori uguali, i due file non la scrivono, il piano riletto la perde, la
     nona colonna compare dove non c'è posto, e il foro con la sola
     inclinazione sua resta senza rombo in tabella */
  [PAGINA, `const _piede=scostamentoPiedeForo(h, D2);`, `const _piede=scostamentoPiedeForo({}, D2);`],
  [MODULO, `const L = valoreDiForo(h, 'prof', progetto), a = valoreDiForo(h, 'incl', progetto);`, `const L = valoreDiForo({}, 'prof', progetto), a = valoreDiForo(h, 'incl', progetto);`],
  [PAGINA, `const _incl=(f.suoi && 'incl' in f.suoi) ? f.suoi.incl : (D2.incl||0);`, `const _incl=(D2.incl||0);`],
  [MODULO, `if(valoreProprioDiForo(h,'incl')!==null) xml+='      '+_tag('Inclination'`, `if(false) xml+='      '+_tag('Inclination'`],
  [MODULO, `if(_inclNota || _inclDeiFori) xml+='    '+_tag('HoleInclination'`, `if(false) xml+='    '+_tag('HoleInclination'`],
  [PAGINA, `const _inclPiano=numOf(plan,'HoleInclination')!=null ? numOf(plan,'HoleInclination') : numOf(plan,'DesignInclination');`, `const _inclPiano=null;`],
  [PAGINA, `diam:numOf(h,'HoleDiameter'), incl:numOf(h,'Inclination') };`, `diam:numOf(h,'HoleDiameter') };`],
  [PAGINA, `...(('incl' in suoi)?{ inclinazione_gradi:suoi.incl }:{}),`, ``],
  [PAGINA, `borraggio_m:D2.stem, inclinazione_gradi:D2.incl, file:`, `borraggio_m:D2.stem, file:`],
  [PAGINA, `D2.incl = valoreCampo(parseFloat(geom.inclinazione_gradi), D2.incl, 0, 30);`, ``],
  [PAGINA, `.ft-incl{display:none!important}`, `.ft-incl{}`],
  [PAGINA, `grid-template-columns:40px 40px 42px 54px repeat(5,minmax(50px,1fr));gap:4px`, `grid-template-columns:40px 40px 42px 54px repeat(4,minmax(50px,1fr));gap:4px`],
  [PAGINA, `(Object.values(r.propri).some(Boolean)?'<i title="Ha valori suoi`, `((r.propri.kg||r.propri.prof||r.propri.stem)?'<i title="Ha valori suoi`],
  /* il rientro del file di scambio (26/11): il file non dichiara più la carica
     del progetto, il lettore torna a usare sempre la media, e il messaggio
     tace sui fori diversi */
  [PAGINA, `default:{ diametro_mm:P.diam, profondita_m:P.prof, carica_kg:P.kg, esplosivo:`, `default:{ diametro_mm:P.diam, profondita_m:P.prof, esplosivo:`],
  [PAGINA, `valoreProgettoDaFile(parseFloat(def.carica_kg), fori.map(x=>parseFloat(x.kg)))`, `valoreProgettoDaFile(NaN, fori.map(x=>parseFloat(x.kg)))`],
  [PAGINA, `(_diversi?' — '+_diversi:'')`, `''`],
  /* la gittata sul foro tipo (26/11): l'etichetta sparisce, la riga torna verde,
     la frase tace sullo schermo e nel CSV, e conta fuori anche chi non c'entra */
  [PAGINA, `(_flyTipo?' <span id="fly-foro-tipo">foro tipo</span>':'')`, `''`],
  [PAGINA, `cls:(_flyTipo && _flyCls==='sv-ok')?'sv-warn':_flyCls,`, `cls:_flyCls,`],
  [PAGINA, `why:(_flyTipo?'<b>⚠ '+_rEsc(_flyTipo)+'</b> Le distanze di sgombero qui sopra valgono per il foro tipo. ':'')+`, `why:`],
  [PAGINA, `['Avviso gittata sul foro tipo', k.flyCalcolabile?avvisoForoTipo(D2.holes, CAMPI_DELLA_GITTATA, 'la gittata'):''],`, `['Avviso gittata sul foro tipo', ''],`],
  [MODULO, `const C = CAMPI_PER_FORO.filter((c) => !Array.isArray(campi) || campi.includes(c));`, `const C = CAMPI_PER_FORO.slice();`],
  /* il piede nel DXF (26/11): la pagina non passa il progetto (niente piedi), e il piede va dalla parte sbagliata */
  [PAGINA, `const dxf=dxfPianoFori(D2.holes, D2.diam, D2.profilo, D2);`, `const dxf=dxfPianoFori(D2.holes, D2.diam, D2.profilo);`],
  [MODULO, `{x:+h.mx, y:+h.my - avanti}]);`, `{x:+h.mx, y:+h.my + avanti}]);`],
  /* il confronto A/B e i fori con valori loro (27/11): il verde sulla gittata torna comunque, lo
     scatto non porta i conti, le righe non compaiono, il conto per la gittata prende tutti i campi,
     la ragione tace, e nel CSV il «non lo so» diventa zero o la riga sparisce */
  [PAGINA, `(_fpA.gittataSuTutti && _fpB.gittataSuTutti) ? vincitoreKpi(A.kpi.fly,B.kpi.fly) : null],`, `vincitoreKpi(A.kpi.fly,B.kpi.fly)],`],
  [PAGINA, `foriPropri:contaValoriPropri(D2.holes).fori,`, ``],
  [PAGINA, `const _fpMostra=(a,b)=> !(a===0 && b===0);`, `const _fpMostra=(a,b)=> false;`],
  [PAGINA, `flyTipo:foriFuoriDalForoTipo(D2.holes, CAMPI_DELLA_GITTATA).fori,`, `flyTipo:contaValoriPropri(D2.holes).fori,`],
  [PAGINA, `'':'<div id="cmp-fly-tipo"`, `'':'<div hidden`],
  [PAGINA, `['Fori con valori propri',_fpA.fori,_fpB.fori],`, `['Fori con valori propri',_fpA.fori||0,_fpB.fori||0],`],
  [PAGINA, `['Fori fuori dal foro tipo (gittata)',_fpA.fuoriGittata,_fpB.fuoriGittata],`, ``],
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

  /* 6. F2 — IL CAMPO «ESPLOSIVO TOTALE» È A DUE VERSI: mostra la carica della
     volata e, se ci si scrive un totale, ricalcola la carica del progetto.
     Con cariche proprie i fori che ne hanno una restano FERMI e il totale si
     distribuisce sugli altri; e il campo deve rileggere il totale scritto. */
  await pg.evaluate(() => { window.__toasts = []; const t = window.toast; window.toast = function (m) { window.__toasts.push(String(m)); return t.apply(this, arguments); }; });
  const scrivi = async (v) => {
    await pg.evaluate((v) => { window.__toasts.length = 0; const el = document.getElementById("dKgTot"); el.value = v; el.dispatchEvent(new Event("change", { bubbles: true })); }, v);
    await pg.waitForTimeout(350);
    await pg.evaluate(() => window.__genesi.renderScheda2D());
    return pg.evaluate(() => ({ kg: window.__genesi.D2.kg, campo: document.getElementById("dKgTot").value, toast: window.__toasts.join(" | ") }));
  };
  const n = D2.n;
  const senza = await scrivi(String(n * 60));
  dice(senza.kg === 60, `senza cariche proprie, scrivere ${n * 60} dà 60 kg per foro: com'è sempre stato (${senza.kg})`, senza);
  await pg.evaluate((a) => { window.__genesi.D2.holes.find((h) => h.id === a).kg = 100; }, a);
  const conUno = await scrivi(String(100 + (n - 1) * 50));
  dice(conUno.kg === 50, `⛔ con un foro fermo a 100 kg, scrivere ${100 + (n - 1) * 50} dà 50 kg agli ALTRI ${n - 1} (letto ${conUno.kg})`, conUno);
  dice(+String(conUno.campo).replace(/\./g, "").replace(",", ".") === 100 + (n - 1) * 50, `⛔ e il campo rilegge il totale scritto (${conUno.campo}): i due versi si chiudono`, conUno);
  const troppoPoco = await scrivi("40");
  dice(troppoPoco.kg === 50 && /meno della somma delle cariche proprie/.test(troppoPoco.toast),
    `⛔ un totale minore della carica propria (40 contro 100) si RIFIUTA col motivo, la carica del progetto resta ${troppoPoco.kg}`, troppoPoco);
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) h.kg = 30; });
  const tutti = await scrivi("900");
  dice(tutti.kg === 50 && /non c'è nessun foro su cui distribuire/.test(tutti.toast),
    `⛔ tutti i fori con una carica propria: niente da distribuire, lo dice e non divide per zero (carica del progetto ${tutti.kg})`, tutti);
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) delete h.kg; });

  /* 6a. F2 — NEL PIANO DI CARICO anche il VOLUME servito e il CONSUMO
     SPECIFICO della riga sono quelli di QUEL foro: dimezzando la profondità
     di un foro il suo volume dimezza, e raddoppiandogli la carica il suo
     consumo raddoppia. Le colonne si cercano per nome, non per posizione. */
  {
    const leggiPf = async () => {
      await pg.evaluate(() => { window.__genesi.renderScheda2D(); window.__usciti.length = 0; document.getElementById("btn-piano-csv").click(); });
      await pg.waitForTimeout(900);
      const f = (await pg.evaluate(() => window.__usciti)).find((x) => /piano_carico/.test(x.nome));
      const righe = decodeURIComponent(f.href.split(",").slice(1).join(",")).split(/\r?\n/).filter((r) => r.trim());
      const testa = righe[0].split(";"), iId = testa.indexOf("id_foro"), iV = testa.findIndex((c) => /^volume_servito/.test(c)), iP = testa.findIndex((c) => /^pf_/.test(c));
      const out = {}; for (const r of righe.slice(1)) { const c = r.split(";"); out[c[iId]] = { vol: +c[iV], pf: +c[iP] }; }
      return { out, trovate: iV >= 0 && iP >= 0 };
    };
    const kgP = await pg.evaluate(() => window.__genesi.D2.kg), profP = await pg.evaluate(() => window.__genesi.D2.prof);
    /* i numeri per foro si ricalcolano con la sequenza: la si fa ripartire come farebbe l'utente,
       ritoccando un campo che con la geometria non c'entra (e che, dal 26/11, non rigenera i fori) */
    const ricalcola = async () => { await pg.evaluate(() => { const el = document.getElementById("dStem"); el.dispatchEvent(new Event("change", { bubbles: true })); }); await pg.waitForTimeout(400); };
    await ricalcola();
    const p0 = await leggiPf();
    dice(p0.trovate && p0.out[a].vol > 0 && p0.out[a].pf > 0, `il piano di carico porta volume servito e consumo specifico per foro (${a}: ${p0.out[a] && p0.out[a].vol} m³ · ${p0.out[a] && p0.out[a].pf} kg/m³)`, p0.out[a]);
    await pg.evaluate(([a, b, kgP, profP]) => { const H = window.__genesi.D2.holes; H.find((h) => h.id === a).kg = kgP * 2; H.find((h) => h.id === b).prof = profP / 2; }, [a, bForo, kgP, profP]);
    await ricalcola();
    const p1 = await leggiPf();
    dice(Math.abs(p1.out[a].pf - 2 * p0.out[a].pf) < 0.003 && p1.out[a].vol === p0.out[a].vol,
      `⛔ raddoppiata la carica di ${a}, il SUO consumo specifico raddoppia (${p0.out[a].pf} → ${p1.out[a].pf}) e il volume resta ${p1.out[a].vol}`, p1.out[a]);
    dice(Math.abs(p1.out[bForo].vol - p0.out[bForo].vol / 2) < 0.06,
      `⛔ dimezzata la profondità di ${bForo}, il SUO volume servito dimezza (${p0.out[bForo].vol} → ${p1.out[bForo].vol})`, p1.out[bForo]);
    dice(p1.out[c].pf === p0.out[c].pf && p1.out[c].vol === p0.out[c].vol, `e il foro ${c}, che non è stato toccato, ha gli stessi numeri`, p1.out[c]);
    await pg.evaluate(([a, b]) => { const H = window.__genesi.D2.holes; delete H.find((h) => h.id === a).kg; delete H.find((h) => h.id === b).prof; }, [a, bForo]);
  }

  /* 6a-bis. F2 — I METRI PERFORATI nella scheda dei costi sono quelli VERI:
     fori × (profondità + sottoperforazione), più o meno i metri dei fori che
     hanno una profondità loro. */
  {
    const metri = async () => { await pg.evaluate(() => window.__genesi.renderScheda2D()); await pg.waitForTimeout(150);
      return pg.evaluate(() => { const m = /Perforazione\s*([\d.]+)\s*m\b/.exec(document.getElementById("d2-scheda").innerText); return m ? +m[1].replace(/\./g, "") : null; }); };
    const [profP, subP] = await pg.evaluate(() => [window.__genesi.D2.prof, window.__genesi.D2.sub || 0]);
    const m0 = await metri();
    dice(m0 === Math.round(D2.n * (profP + subP)), `scheda dei costi: senza profondità proprie ${D2.n} × (${profP} + ${subP}) = ${Math.round(D2.n * (profP + subP))} m (letto ${m0})`, m0);
    await pg.evaluate(([a, profP]) => { window.__genesi.D2.holes.find((h) => h.id === a).prof = profP - 4; }, [a, profP]);
    const m1 = await metri();
    dice(m1 === Math.round(D2.n * (profP + subP) - 4), `⛔ un foro più corto di 4 m: i metri perforati scendono di 4 (${m0} → ${m1})`, m1);
    await pg.evaluate((a) => { delete window.__genesi.D2.holes.find((h) => h.id === a).prof; }, a);
    dice((await metri()) === m0, "e tolta quella profondità propria tornano quelli di prima", m0);
  }

  /* 6b. F2 — LA SCHEDA DEI NUMERI PRINCIPALI (computeKPI) conta sulla GRIGLIA
     di progetto. Finché in pianta i fori sono tanti quanti la griglia, segue
     le cariche proprie; se in pianta ce n'è uno in più o in meno resta il
     numero nominale del progetto (dichiarato nel codice: la carica vera dei
     fori disegnati la dicono le altre superfici). */
  {
    const kg0 = await pg.evaluate(() => window.__genesi.D2.kg);
    const q0 = await pg.evaluate(() => window.__genesi.kpiQtot);
    dice(q0 === Math.round(D2.n * kg0), `scheda dei numeri: senza cariche proprie ${D2.n} × ${kg0} = ${Math.round(D2.n * kg0)} kg (letto ${q0})`, q0);
    await pg.evaluate((a) => { window.__genesi.D2.holes.find((h) => h.id === a).kg = kg0_piu(); function kg0_piu() { return window.__genesi.D2.kg + 40; } }, a);
    const q1 = await pg.evaluate(() => window.__genesi.kpiQtot);
    dice(q1 === Math.round(D2.n * kg0 + 40), `⛔ con un foro 40 kg più carico, la scheda dei numeri dice ${Math.round(D2.n * kg0 + 40)} kg (letto ${q1})`, q1);
    await pg.evaluate(() => { window.__genesi.D2.holes.push({ id: "in-piu", mx: 30, my: 9 }); });
    const q2 = await pg.evaluate(() => window.__genesi.kpiQtot);
    dice(q2 === Math.round(D2.n * kg0), `con un foro in più in pianta rispetto alla griglia resta il numero NOMINALE del progetto (${q2}): i due conti non si mescolano`, q2);
    await pg.evaluate((a) => { const H = window.__genesi.D2.holes; H.splice(H.findIndex((h) => h.id === "in-piu"), 1); delete H.find((h) => h.id === a).kg; }, a);
  }

  /* 7. ⛔ LA MAGLIA SI RIGENERA SOLO SE CAMBIA LA SUA GEOMETRIA. Misurato il
     26/11: bastava ritoccare il borraggio perché `applyDesign` rigenerasse
     tutti i fori — quello spostato a mano tornava al suo posto, quello
     aggiunto spariva, ritardo a mano e carica propria si perdevano. Senza
     questo il «foro per foro» non regge: ogni parametro toccato azzererebbe
     il lavoro fatto sui fori. */
  const fotografia = () => pg.evaluate(() => { const H = window.__genesi.D2.holes;
    return { n: H.length, primoX: H[0].mx, aMano: H.filter((h) => h.id === "prova-m").length, conKg: H.filter((h) => h.kg != null).length, tMano: H.filter((h) => h.tMano != null).length }; });
  const cambia = async (id, v) => { await pg.evaluate(([id, v]) => { const el = document.getElementById(id); el.value = v;
    el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }, [id, v]); await pg.waitForTimeout(450); };
  const x0 = (await fotografia()).primoX;
  await pg.evaluate(() => { const H = window.__genesi.D2.holes; H[0].mx += 0.7; H.push({ id: "prova-m", mx: 20, my: 9 }); H[1].tMano = 99; H[2].kg = 35; });
  await cambia("dStem", "2,5");
  const dopoStem = await fotografia();
  const stem = await pg.evaluate(() => window.__genesi.D2.stem);
  dice(stem === 2.5, `il borraggio cambiato è arrivato (${stem})`, stem);
  dice(dopoStem.n === D2.n + 1 && dopoStem.aMano === 1, `⛔ cambiato SOLO il borraggio, il foro aggiunto a mano c'è ancora (${dopoStem.n} fori)`, dopoStem);
  dice(Math.abs(dopoStem.primoX - (x0 + 0.7)) < 1e-9, `⛔ il foro spostato a mano è rimasto dov'era stato messo (${dopoStem.primoX})`, dopoStem);
  dice(dopoStem.tMano === 1 && dopoStem.conKg === 1, "⛔ e ritardo a mano e carica propria non sono andati persi", dopoStem);
  /* e quando la geometria cambia DAVVERO la maglia si rigenera, e lo dice */
  await pg.evaluate(() => { window.__toasts.length = 0; });
  const sPrima = await pg.evaluate(() => window.__genesi.D2.S);
  await cambia("dS", String(sPrima + 0.5).replace(".", ","));
  const dopoS = await fotografia();
  const detto = await pg.evaluate(() => window.__toasts.join(" | "));
  dice(dopoS.n === D2.n && dopoS.aMano === 0 && dopoS.conKg === 0, `cambiato l'interasse, la maglia si rigenera: i fori non sono più quelli (${dopoS.n} fori, nessuno a mano)`, dopoS);
  dice(/ritardo messo a mano non vale più/.test(detto) && /foro con valori suoi è tornato a quelli del progetto/.test(detto),
    "⛔ e dice che cosa si è perso: il ritardo a mano E il foro con valori suoi", detto);
}

/* 8. F3 — IL COMANDO: dare a un foro (o a più fori) carica, profondità e
   borraggio suoi, dalla scheda del foro. Si usa come lo usa una persona:
   clic sul foro, si scrive nel campo, si conferma. */
{
  console.log("\n── F3: il comando dalla scheda del foro ──");
  await pg.evaluate(() => { window.__toasts.length = 0; });
  const P = await pg.evaluate(() => { const d = window.__genesi.D2; return { kg: d.kg, prof: d.prof, stem: d.stem, n: d.holes.length }; });
  const clic = async (i, shift) => {
    await pg.locator("#d2-canvas").scrollIntoViewIfNeeded(); await pg.waitForTimeout(120);
    const box = await pg.locator("#d2-canvas").boundingBox();
    const rel = await pg.evaluate((i) => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[i];
      return { x: (m.startX + h.mx * m.scale) / c.width, y: (m.faceY + h.my * m.scale) / c.height }; }, i);
    if (shift) await pg.keyboard.down("Shift");
    await pg.mouse.move(box.x + rel.x * box.width, box.y + rel.y * box.height); await pg.mouse.down(); await pg.mouse.up();
    if (shift) await pg.keyboard.up("Shift");
    await pg.waitForTimeout(220);
  };
  const campo = async (id, v) => { await pg.evaluate(([id, v]) => { window.__toasts.length = 0; const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event("change", { bubbles: true })); }, [id, v]); await pg.waitForTimeout(380); };
  const stato = () => pg.evaluate(() => { const D = window.__genesi.D2; const v = (id) => { const e = document.getElementById(id); return e ? e.value : null; };
    return { fori: D.holes.map((h) => ({ kg: h.kg, prof: h.prof, stem: h.stem })), sel: D.sel, kgC: v("diKg"), profC: v("diProf"), stemC: v("diStem"),
      nota: (document.getElementById("diValNota") || {}).textContent || "", torna: !!document.getElementById("diValProg"), toast: window.__toasts.join(" | "),
      testo: (document.getElementById("d2-insp") || {}).innerText || "", totale: (document.getElementById("dKgTot") || {}).value } ; });
  /* il rombo: il pixel al suo centro, sulla tela, è bianco? */
  const rombo = (i) => pg.evaluate((i) => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[i];
    const x = Math.round(m.startX + h.mx * m.scale + 9.5), y = Math.round(m.faceY + h.my * m.scale - 9.5);
    const d = c.getContext("2d").getImageData(x, y, 1, 1).data; return d[0] > 235 && d[1] > 235 && d[2] > 235; }, i);
  const num = (t) => +String(t).replace(/\./g, "").replace(",", ".");

  await clic(2, false);
  let s = await stato();
  dice(s.sel === 2 && s.kgC !== null && s.profC !== null && s.stemC !== null, "cliccato un foro, la sua scheda ha i tre campi: carica, profondità, borraggio", s.testo);
  dice(num(s.kgC) === P.kg && num(s.profC) === P.prof && num(s.stemC) === P.stem, `e nascono coi valori del progetto (${s.kgC} kg · ${s.profC} m · ${s.stemC} m)`, s);
  dice(/dal progetto/.test(s.nota) && !s.torna, "e la scheda dice che vengono dal progetto: nessun «torna al progetto» da premere", s.nota);
  dice(!(await rombo(2)), "sulla pianta il foro non ha nessun segno", "");
  /* i campi della scheda sono campi di Genesi, non quelli bianchi del browser: alti abbastanza da toccarli, scuri come quelli della tabella */
  const campi = await pg.evaluate(() => ["diX", "diY", "diRit", "diKg", "diProf", "diStem"].map((id) => { const e = document.getElementById(id), q = e.getBoundingClientRect(), c = getComputedStyle(e);
    return { id, h: Math.round(q.height), fondo: c.backgroundColor, corpo: parseFloat(c.fontSize), taglia: e.scrollWidth > e.clientWidth }; }));
  dice(campi.length === 6 && campi.every((c) => c.h >= 40 && c.fondo === "rgb(36, 29, 18)" && c.corpo >= 16 && !c.taglia),
    `i sei campi della scheda del foro sono alti almeno 40 px, scuri come quelli della tabella, a 16 px, e il numero ci sta (${campi.map((c) => c.id + " " + c.h).join(" · ")})`, campi.filter((c) => !(c.h >= 40 && c.fondo === "rgb(36, 29, 18)")));

  await campo("diKg", "35");
  s = await stato();
  dice(s.fori[2].kg === 35 && s.fori.filter((h) => h.kg != null).length === 1, "⛔ scritto 35 nella carica: il foro ha 35 kg suoi, e solo lui", s.fori[2]);
  dice(/Foro \d+: carica 35 kg/.test(s.toast) && /non più quella del progetto/.test(s.toast), "lo dice, col valore del progetto accanto", s.toast);
  dice(/carica sua/.test(s.nota) && s.torna, "la scheda lo segna («carica sua») e offre di tornare ai valori del progetto", s.nota);
  dice(await rombo(2), "⛔ e sulla pianta il foro ha il suo ROMBO: si riconosce senza aprirlo", "");
  dice(!(await rombo(3)), "il foro accanto, che non ha valori suoi, no", "");
  dice(num(s.totale) === Math.round(P.n * P.kg + (35 - P.kg)), `l'esplosivo totale segue: ${P.n} × ${P.kg} − ${P.kg - 35} = ${Math.round(P.n * P.kg + (35 - P.kg))} kg (letto ${s.totale})`, s.totale);
  const x50 = await pg.evaluate(() => { const e = document.getElementById("x50-foro-tipo"); return e ? e.textContent : null; });
  dice(x50 === "foro tipo", "⛔ e accanto alla X50 prevista compare «foro tipo»: la frammentazione non conosce le cariche per foro, e lo dice", x50);
  const p3 = await pianoDiCarico();
  const id2 = await pg.evaluate(() => window.__genesi.D2.holes[2].id);
  dice(!!p3 && +p3.perId[id2].kg === 35, "il piano di carico esce con 35 kg su quel foro: il comando e il documento dicono lo stesso numero", p3 && p3.perId[id2] && p3.perId[id2].riga);

  /* annulla */
  await pg.evaluate(() => document.getElementById("d2Undo").click()); await pg.waitForTimeout(350);
  s = await stato();
  dice(s.fori[2].kg === undefined, "⛔ «annulla» toglie la carica appena scritta", s.fori[2]);
  await clic(2, false); await campo("diKg", "35");

  /* uguale al progetto = lo segue */
  await campo("diKg", String(P.kg).replace(".", ","));
  s = await stato();
  dice(s.fori[2].kg === undefined && /di nuovo quella del progetto/.test(s.toast), `⛔ riscritta la carica del progetto (${P.kg}), il foro torna a SEGUIRLO: nessun valore proprio resta`, [s.fori[2], s.toast]);
  dice(!(await rombo(2)) && !s.torna, "e il rombo sparisce", s.nota);
  dice((await pg.evaluate(() => !!document.getElementById("x50-foro-tipo"))) === false, "e «foro tipo» accanto alla X50 pure: nessun foro è più diverso", "");

  /* ciò che non si legge e ciò che è fuori limite */
  await campo("diKg", "abc");
  s = await stato();
  dice(s.fori[2].kg === undefined && /non è un numero/.test(s.toast) && num(s.kgC) === P.kg, "«abc» nella carica: rifiutato con la sua frase, e il campo torna al valore vero", [s.toast, s.kgC]);
  await campo("diKg", "250");
  s = await stato();
  dice(s.fori[2].kg === undefined && /massimo è 200/.test(s.toast), "250 kg: oltre il massimo, rifiutato", s.toast);
  await campo("diProf", "2");
  s = await stato();
  dice(s.fori[2].prof === undefined && /borraggio più lungo del foro/.test(s.toast), `⛔ profondità 2 m con ${String(P.stem).replace(".", ",")} m di borraggio: rifiutato, il borraggio non può essere più lungo del foro`, [s.fori[2], s.toast]);
  await campo("diKg", "0");
  s = await stato();
  dice(s.fori[2].kg === 0, "⛔ zero chilogrammi si scrive: è un foro lasciato scarico, non «nessun valore»", s.fori[2]);
  await campo("diKg", "");
  s = await stato();
  dice(s.fori[2].kg === undefined, "campo svuotato: il foro torna alla carica del progetto", s.fori[2]);

  /* più fori insieme */
  await clic(0, true); await clic(1, true); await clic(3, true);
  s = await stato();
  dice(/3 fori selezionati/.test(s.testo) && s.kgC !== null, "con tre fori scelti (Maiusc+clic) la scheda è quella della selezione, con gli stessi tre campi", s.testo.slice(0, 120));
  await campo("diKg", "40");
  s = await stato();
  dice(s.fori[0].kg === 40 && s.fori[1].kg === 40 && s.fori[3].kg === 40 && s.fori.filter((h) => h.kg != null).length === 3,
    "⛔ scritto 40: tutti e tre i fori scelti hanno 40 kg, e nessun altro", s.fori.map((h) => h.kg));
  dice(/3 fori: carica 40 kg/.test(s.toast), "e lo dice contandoli", s.toast);
  dice(num(s.totale) === Math.round(P.n * P.kg + 3 * (40 - P.kg)), `l'esplosivo totale: ${Math.round(P.n * P.kg + 3 * (40 - P.kg))} kg (letto ${s.totale})`, s.totale);
  /* fori bloccati */
  await pg.evaluate(() => { window.__genesi.D2.strati.fori.bloccato = true; });
  await campo("diKg", "45");
  s = await stato();
  dice(s.fori[0].kg === 40 && /bloccati/.test(s.toast), "⛔ coi fori BLOCCATI non si scrive: restano a 40, e lo dice", [s.fori[0], s.toast]);
  await pg.evaluate(() => { window.__genesi.D2.strati.fori.bloccato = false; });
  /* torna ai valori del progetto */
  await pg.evaluate(() => { window.__toasts.length = 0; document.getElementById("diValProg").click(); }); await pg.waitForTimeout(380);
  s = await stato();
  dice(s.fori.every((h) => h.kg === undefined && h.prof === undefined && h.stem === undefined) && /3 fori tornati ai valori del progetto/.test(s.toast),
    "⛔ «valori del progetto»: i tre fori tornano tutti, in un colpo", [s.fori.filter((h) => h.kg != null).length, s.toast]);

  /* ⛔ LA TASTIERA VERA. Misurato il 26/11: scritto un valore e premuto Tab,
     la scheda si ridisegnava prima che il fuoco arrivasse al campo dopo, che
     quindi non esisteva più — il fuoco finiva sul corpo della pagina e il
     numero battuto subito dopo andava perso. `change` lanciato a mano (come
     fanno le prove qui sopra) non lo può vedere: serve premere i tasti. */
  await clic(4, false);
  await pg.click("#diProf", { clickCount: 3 }); await pg.keyboard.type("8,5"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(250);
  const fuoco = await pg.evaluate(() => (document.activeElement && document.activeElement.id) || (document.activeElement && document.activeElement.tagName) || "");
  dice(fuoco === "diStem", `⛔ scritta la profondità e premuto Tab, il fuoco è sul campo dopo (borraggio) — letto «${fuoco}»`, fuoco);
  await pg.keyboard.type("1,5"); await pg.keyboard.press("Enter"); await pg.waitForTimeout(350);
  s = await stato();
  dice(s.fori[4].prof === 8.5 && s.fori[4].stem === 1.5, "⛔ e il numero battuto subito dopo arriva: profondità 8,5 m e borraggio 1,5 m, senza toccare il mouse", s.fori[4]);
  await pg.evaluate(() => { const e = document.getElementById("diValProg"); if (e) e.click(); }); await pg.waitForTimeout(350);
  s = await stato();
  dice(s.fori[4].prof === undefined && s.fori[4].stem === undefined, "(rimesso il foro ai valori del progetto)", s.fori[4]);
}

/* 9. F4 — LA TABELLA DEI FORI: una riga per foro, tutti insieme. Si scrive
   nelle celle con la tastiera vera (Tab fra una cella e l'altra), si ordina,
   si tocca il numero per aprire la scheda. */
{
  console.log("\n── F4: la tabella dei fori ──");
  const P = await pg.evaluate(() => { const d = window.__genesi.D2; return { kg: d.kg, prof: d.prof, stem: d.stem, n: d.holes.length, ids: d.holes.map((h) => h.id) }; });
  const tab = () => pg.evaluate(() => { const D = window.__genesi.D2, sc = document.querySelector(".ft-scorri");
    return { titolo: document.getElementById("ft-apri").innerText.replace(/\s+/g, " ").trim(), aperta: !document.getElementById("ft-sec").classList.contains("closed"),
      righe: [...document.querySelectorAll("#ft-corpo .ft-r")].map((r) => ({ i: +r.dataset.i, n: r.querySelector(".ft-num").innerText.replace(/\s+/g, ""), sel: r.classList.contains("sel"),
        kg: r.querySelector('input[data-campo="kg"]').value, prof: r.querySelector('input[data-campo="prof"]').value, stem: r.querySelector('input[data-campo="stem"]').value,
        suoKg: r.querySelector('input[data-campo="kg"]').classList.contains("suo") })),
      fori: D.holes.map((h) => ({ id: h.id, kg: h.kg, prof: h.prof, stem: h.stem })), sel: D.sel, fuoco: (document.activeElement && document.activeElement.id) || "",
      toast: window.__toasts.join(" | "), scheda: ((document.querySelector("#d2-insp b") || {}).textContent || ""),
      scorre: sc ? [sc.scrollWidth, sc.clientWidth] : null, pagina: [document.documentElement.scrollWidth, innerWidth] }; });
  const num = (t) => +String(t).replace(/\./g, "").replace(",", ".");

  let t = await tab();
  dice(!t.aperta && t.righe.length === 0, "nasce CHIUSA, e da chiusa non disegna nessuna riga (non costa niente a chi non la apre)", t.righe.length);
  dice(new RegExp("· " + P.n + " fori").test(t.titolo), `ma il titolo dice già quanti fori ci sono (${t.titolo})`, t.titolo);
  await pg.click("#ft-apri"); await pg.waitForTimeout(300);
  t = await tab();
  dice(t.aperta && t.righe.length === P.n, `aperta: una riga per foro (${t.righe.length} righe, ${P.n} fori)`, t.righe.length);
  dice(t.righe.every((r, k) => r.n === String(k + 1)), "in ordine di numero del foro, dall'1 in su", t.righe.map((r) => r.n).join(" "));
  dice(t.righe.every((r) => num(r.kg) === P.kg && num(r.prof) === P.prof && num(r.stem) === P.stem && !r.suoKg), `ogni riga coi valori del progetto (${P.kg} kg · ${P.prof} m · ${String(P.stem).replace(".", ",")} m), nessuna segnata`, t.righe[0]);
  dice(t.scorre[0] <= t.scorre[1] && t.pagina[0] <= t.pagina[1], `a 430 px la tabella ci sta INTERA: non scorre di lato né lei (${t.scorre}) né la pagina (${t.pagina})`, [t.scorre, t.pagina]);

  /* scrivere con la tastiera, Tab fra le celle */
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#ft-kg-2", { clickCount: 3 }); await pg.keyboard.type("35"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(250);
  t = await tab();
  dice(t.fori[2].kg === 35 && t.fori.filter((h) => h.kg != null).length === 1, "⛔ scritto 35 nella cella della carica del terzo foro: quel foro ha 35 kg, e solo lui", t.fori[2]);
  dice(t.fuoco === "ft-prof-2", `⛔ e dopo Tab il fuoco è sulla cella accanto (profondità dello stesso foro) — letto «${t.fuoco}»`, t.fuoco);
  dice(/Foro \d+: carica 35 kg — non più quella del progetto/.test(t.toast), "la frase è la STESSA della scheda del foro: una regola, due posti da cui si scrive", t.toast);
  await pg.keyboard.type("8,5"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(250);
  t = await tab();
  dice(t.fori[2].prof === 8.5 && t.fuoco === "ft-stem-2", "e il numero battuto subito dopo arriva (profondità 8,5 m), col fuoco già sul borraggio", [t.fori[2], t.fuoco]);
  const riga2 = t.righe.find((r) => r.i === 2);
  dice(riga2.suoKg && /◆/.test(riga2.n), `⛔ la riga è SEGNATA: il rombo accanto al numero («${riga2.n}») e la cella col bordo dei valori propri`, riga2);
  dice(/1 con valori suoi/.test(t.titolo), `e il titolo li conta (${t.titolo})`, t.titolo);

  /* un valore che non si legge: rifiutato, e la cella torna al valore vero */
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#ft-kg-0", { clickCount: 3 }); await pg.keyboard.type("abc"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(300);
  t = await tab();
  dice(t.fori[0].kg === undefined && /non è un numero/.test(t.toast) && num(t.righe.find((r) => r.i === 0).kg) === P.kg, "«abc» in una cella: rifiutato con la sua frase, e la cella torna al valore vero", [t.toast, t.righe.find((r) => r.i === 0).kg]);

  /* ordinare: l'ordine è della VISTA. Le attese si ricavano dai valori letti,
     non da un numero scritto qui: la carica del progetto non è la stessa in
     ogni passata, e un'attesa a memoria direbbe ok per la ragione sbagliata. */
  const crescente = (a) => a.every((v, k) => k === 0 || a[k - 1] <= v), decrescente = (a) => a.every((v, k) => k === 0 || a[k - 1] >= v);
  await pg.click('.ft-h button[data-ord="kg"]'); await pg.waitForTimeout(200);
  t = await tab();
  const kgSu = t.righe.map((r) => num(r.kg));
  dice(crescente(kgSu) && new Set(kgSu).size > 1 && t.righe[35 < P.kg ? 0 : t.righe.length - 1].i === 2,
    `ordinata per carica, dalla più piccola: il foro da 35 kg è ${35 < P.kg ? "in cima" : "in fondo"} (${kgSu.join(" ")})`, kgSu);
  dice(JSON.stringify(t.fori.map((h) => h.id)) === JSON.stringify(P.ids), "⛔ e i FORI non si sono mossi: l'ordine è della tabella, non del progetto", t.fori.map((h) => h.id));
  await pg.click('.ft-h button[data-ord="kg"]'); await pg.waitForTimeout(200);
  t = await tab();
  const kgGiu = t.righe.map((r) => num(r.kg));
  dice(decrescente(kgGiu) && t.righe[35 < P.kg ? t.righe.length - 1 : 0].i === 2, `⛔ un secondo tocco sulla stessa colonna INVERTE: ora dalla più grande (${kgGiu.join(" ")})`, kgGiu);
  /* ⛔ con la tabella ordinata, scrivere in una riga scrive sul foro DI QUELLA RIGA.
     Si sceglie una riga che non è al posto del suo foro: se no la prova passerebbe
     anche scrivendo «sulla riga numero k». */
  const k = t.righe.findIndex((r, q) => r.i !== q);
  dice(k >= 0, "con la tabella ordinata almeno una riga non è al posto del suo foro (se no la prova qui sotto non proverebbe niente)", t.righe.map((r) => r.i).join(" "));
  if (k >= 0) {
    const bersaglio = t.righe[k].i;
    await pg.evaluate(() => { window.__toasts.length = 0; });
    await pg.locator("#ft-corpo .ft-r").nth(k).locator('input[data-campo="stem"]').click({ clickCount: 3 });
    await pg.keyboard.type("1"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(300);
    t = await tab();
    dice(t.fori[bersaglio].stem === 1 && t.fori.filter((h) => h.stem != null).length === 1,
      `⛔ scritto il borraggio nella riga ${k + 1} della tabella ordinata: va al foro di QUELLA riga (il ${bersaglio + 1}° dell'elenco), non al ${k + 1}°`, t.fori.map((h) => h.stem));
  }
  /* la tabella segue il PROGETTO che cambia: le celle dei fori senza valore proprio */
  const stemNuovo = P.stem === 2 ? 2.4 : 2;
  await pg.evaluate((v) => { const el = document.getElementById("dStem"); el.value = String(v).replace(".", ","); el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); }, stemNuovo);
  await pg.waitForTimeout(500);
  t = await tab();
  const senzaSuo = t.righe.filter((r) => t.fori[r.i].stem === undefined);
  dice(senzaSuo.length >= P.n - 2 && senzaSuo.every((r) => num(r.stem) === stemNuovo), `⛔ cambiato il borraggio del PROGETTO (${stemNuovo} m): le celle dei fori che lo seguono lo mostrano subito`, senzaSuo.slice(0, 3).map((r) => r.stem));

  /* il numero apre la scheda */
  await pg.click('.ft-num[data-sel="5"]'); await pg.waitForTimeout(300);
  t = await tab();
  dice(t.sel === 5 && /Foro/.test(t.scheda) && t.righe.filter((r) => r.sel).length === 1 && t.righe.find((r) => r.sel).i === 5, `toccato il numero di una riga: quel foro è selezionato, la sua scheda è aperta («${t.scheda}») e la riga è evidenziata`, [t.sel, t.scheda]);
  /* la tabella segue ciò che cambia ALTROVE: la scheda, l'annulla */
  await pg.evaluate(() => { const el = document.getElementById("diKg"); el.value = "44"; el.dispatchEvent(new Event("change", { bubbles: true })); }); await pg.waitForTimeout(350);
  t = await tab();
  dice(num(t.righe.find((r) => r.i === 5).kg) === 44, "⛔ scritta una carica dalla SCHEDA del foro, la cella della tabella la mostra", t.righe.find((r) => r.i === 5));
  await pg.evaluate(() => document.getElementById("d2Undo").click()); await pg.waitForTimeout(350);
  t = await tab();
  dice(num(t.righe.find((r) => r.i === 5).kg) === P.kg, "e dopo «annulla» torna quella del progetto", t.righe.find((r) => r.i === 5));
  /* fori bloccati */
  await pg.evaluate(() => { window.__toasts.length = 0; window.__genesi.D2.strati.fori.bloccato = true; });
  await pg.click("#ft-kg-1", { clickCount: 3 }); await pg.keyboard.type("77"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(300);
  t = await tab();
  dice(t.fori[1].kg === undefined && /bloccati/.test(t.toast) && num(t.righe.find((r) => r.i === 1).kg) === P.kg, "⛔ coi fori BLOCCATI la cella non scrive, lo dice, e torna al valore vero", [t.fori[1], t.toast]);
  await pg.evaluate(() => { window.__genesi.D2.strati.fori.bloccato = false; });

  /* a 320 px le tre colonne che si scrivono stanno a schermo senza scorrere */
  await pg.setViewportSize({ width: 320, height: 900 }); await pg.waitForTimeout(350);
  const stretto = await pg.evaluate(() => { const sc = document.querySelector(".ft-scorri"), b = sc.getBoundingClientRect();
    const dentro = [...document.querySelectorAll("#ft-corpo .ft-r")][0].querySelectorAll("input");
    return { scorre: [sc.scrollWidth, sc.clientWidth], pagina: [document.documentElement.scrollWidth, innerWidth],
      visibili: [...dentro].filter((e) => { const q = e.getBoundingClientRect(); return q.width > 30 && q.left >= b.left && q.right <= b.right + 0.5; }).length }; });
  dice(stretto.visibili === 3 && stretto.scorre[0] <= stretto.scorre[1] && stretto.pagina[0] <= stretto.pagina[1],
    `⛔ a 320 px carica, profondità e borraggio sono tutte e tre a schermo, senza scorrere di lato (tabella ${stretto.scorre}, pagina ${stretto.pagina})`, stretto);
  await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(250);
  /* si rimette tutto com'era */
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) { delete h.kg; delete h.prof; delete h.stem; } window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(250);
  t = await tab();
  dice(!/con valori/.test(t.titolo), `(tolti i valori propri, il titolo torna a contare solo i fori: ${t.titolo})`, t.titolo);
}

/* 10. F5 — IL PIANO D'INNESCO XML, foro per foro. È il file che legge chi
   programma i detonatori e chi perfora. Si preme il bottone vero, si apre il
   file che esce, e lo si RIAPRE nella pagina col lettore vero. */
{
  console.log("\n── F5: il piano d'innesco XML, scritto e riletto ──");
  const xmlUscito = async () => {
    await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btn-innesco-xml").click(); });
    await pg.waitForTimeout(500);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => /piano_innesco\.xml/.test(x.nome));
    return f ? decodeURIComponent(f.href.split(",").slice(1).join(",")) : null;
  };
  const foriDelFile = (xml) => xml.split("<Hole ").slice(1).map((b) => { const v = (tag) => { const m = new RegExp("<" + tag + " [^>]*>([^<]*)</" + tag + ">").exec(b); return m ? +m[1] : null; };
    const q = /<Position x="([^"]*)" y="([^"]*)"/.exec(b); return { x: +q[1], y: +q[2], prof: v("Depth"), kg: v("Charge"), stem: v("Stemming") }; });
  const P = await pg.evaluate(() => { const d = window.__genesi.D2; return { kg: d.kg, prof: d.prof, stem: d.stem, n: d.holes.length }; });

  const liscio = await xmlUscito();
  dice(!!liscio && !/Design|HolesWithOwnValues/.test(liscio), "⛔ NEUTRALITÀ: senza valori per foro il piano esce senza niente di nuovo", liscio && liscio.slice(0, 200));
  dice(!!liscio && foriDelFile(liscio).every((f) => f.kg === P.kg && f.prof === P.prof && f.stem === P.stem), `e ogni foro porta i valori del progetto (${P.kg} kg · ${P.prof} m)`, liscio && JSON.stringify(foriDelFile(liscio)[0]));

  /* il foro che spara PER PRIMO lasciato scarico, un altro più corto */
  const scelti = await pg.evaluate(() => { const H = window.__genesi.D2.holes; const primo = H.reduce((a, h, i) => ((h.tDet || 0) < (H[a].tDet || 0) ? i : a), 0), altro = primo === 3 ? 4 : 3;
    H[primo].kg = 0; H[altro].prof = 8.5; H[altro].stem = 1.5; window.__genesi.renderScheda2D();
    return { primo, altro, pp: { x: H[primo].mx, y: H[primo].my }, pa: { x: H[altro].mx, y: H[altro].my } }; });
  await pg.waitForTimeout(250);
  const xml = await xmlUscito();
  const nelFile = xml ? foriDelFile(xml) : [];
  const vicino = (a, b) => Math.abs(a - b) < 0.006;
  const fPrimo = nelFile.find((f) => vicino(f.x, scelti.pp.x) && vicino(f.y, scelti.pp.y)), fAltro = nelFile.find((f) => vicino(f.x, scelti.pa.x) && vicino(f.y, scelti.pa.y));
  dice(!!fPrimo && fPrimo.kg === 0, `⛔ il foro lasciato SCARICO esce nel file con 0 kg — non con i ${P.kg} del progetto`, fPrimo);
  dice(!!fAltro && fAltro.prof === 8.5 && fAltro.stem === 1.5 && fAltro.kg === P.kg, "⛔ e quello più corto con 8,5 m e 1,5 m di borraggio, e la carica del progetto", fAltro);
  dice(nelFile.filter((f) => f.kg === P.kg && f.prof === P.prof && f.stem === P.stem).length === P.n - 2, `gli altri ${P.n - 2} fori coi valori del progetto`, nelFile.length);
  dice(!!xml && xml.includes('<DesignCharge unit="kg">' + P.kg + "</DesignCharge>") && xml.includes("<HolesWithOwnValues>2</HolesWithOwnValues>"), "e il file dichiara a parte la carica del PROGETTO e quanti fori sono diversi", xml && xml.split("\n").filter((x) => /Design|OwnValues/.test(x)).join(" "));

  /* si riapre: prima si sporca il progetto, così si vede che cosa torna dal file */
  await pg.evaluate(() => { window.__toasts.length = 0; const D = window.__genesi.D2; D.kg = 77; for (const h of D.holes) { delete h.kg; delete h.prof; delete h.stem; } });
  /* ⛔ il file che si riapre NON è quello appena scritto: è costruito qui, a
     mano, dal piano liscio. Se no la prova del LETTORE dipenderebbe dallo
     SCRITTORE — misurato nella controprova: col difetto dello scrittore
     rimesso (ogni foro con la carica del progetto) il difetto del lettore
     («il progetto è il primo foro») non si vedeva più, perché il primo foro
     del file portava proprio la carica del progetto.
     ⚠️ E il foro che spara per primo qui ha 123 kg, non 0: con 0 il lettore
     difettoso darebbe «5 kg» (il minimo del campo), e nella passata di
     controprova la carica del progetto è PROPRIO 5 — la prova passava per
     coincidenza. 123 non è la carica di nessun progetto di questo banco. */
  const aMano = (() => {
    const pezzi = (liscio || "").split("<Hole ");
    const cambia = (b, tag, v) => b.replace(new RegExp("(<" + tag + " [^>]*>)[^<]*(</" + tag + ">)"), "$1" + v + "$2");
    const corpo = pezzi.slice(1).map((b) => { const q = /<Position x="([^"]*)" y="([^"]*)"/.exec(b); if (!q) return b;
      if (vicino(+q[1], scelti.pp.x) && vicino(+q[2], scelti.pp.y)) return cambia(b, "Charge", "123");
      if (vicino(+q[1], scelti.pa.x) && vicino(+q[2], scelti.pa.y)) return cambia(cambia(b, "Depth", "8.5"), "Stemming", "1.5");
      return b; });
    const testa = pezzi[0].replace("  </PlanData>", '    <DesignDepth unit="m">' + P.prof + '</DesignDepth>\n    <DesignCharge unit="kg">' + P.kg + '</DesignCharge>\n    <DesignStemming unit="m">' + P.stem + "</DesignStemming>\n    <HolesWithOwnValues>2</HolesWithOwnValues>\n  </PlanData>");
    return [testa, ...corpo].join("<Hole ");
  })();
  dice(/<DesignCharge/.test(aMano) && foriDelFile(aMano).filter((f) => f.kg === 123).length === 1 && P.kg !== 123, "(il piano di prova per il lettore è scritto a mano dal piano liscio: il primo foro a 123 kg, i tre Design dichiarati)", aMano.slice(0, 120));
  await pg.setInputFiles("#fileXmlIn", { name: "piano.xml", mimeType: "application/xml", buffer: Buffer.from(aMano, "utf8") });
  await pg.waitForTimeout(900);
  const dopo = await pg.evaluate(() => { const D = window.__genesi.D2; return { kg: D.kg, prof: D.prof, stem: D.stem, fori: D.holes.map((h) => ({ x: h.mx, y: h.my, kg: h.kg, prof: h.prof, stem: h.stem })), toast: window.__toasts.join(" | ") }; });
  dice(dopo.kg === P.kg, `⛔ riaperto: la carica del PROGETTO è ${P.kg} kg — non i 123 del foro che spara per primo (letto ${dopo.kg})`, dopo.kg);
  const rPrimo = dopo.fori.find((f) => vicino(f.x, scelti.pp.x) && vicino(f.y, scelti.pp.y)), rAltro = dopo.fori.find((f) => vicino(f.x, scelti.pa.x) && vicino(f.y, scelti.pa.y));
  dice(!!rPrimo && rPrimo.kg === 123, "⛔ il foro diverso ha ripreso i SUOI 123 kg, sul foro in QUELLA posizione", rPrimo);
  dice(!!rAltro && rAltro.prof === 8.5 && rAltro.stem === 1.5 && rAltro.kg === undefined, "⛔ e quello più corto ha ripreso profondità e borraggio suoi (la carica no: era quella del progetto)", rAltro);
  dice(dopo.fori.filter((f) => f.kg !== undefined || f.prof !== undefined || f.stem !== undefined).length === 2, "nessun altro foro ha guadagnato valori suoi", dopo.fori.filter((f) => f.kg !== undefined).length);
  dice(/2 fori con valori loro/.test(dopo.toast), "e il messaggio lo dice: «2 fori con valori loro»", dopo.toast);
  /* un piano uniforme si riapre com'è sempre stato */
  await pg.evaluate(() => { window.__toasts.length = 0; window.__genesi.D2.kg = 77; });
  await pg.setInputFiles("#fileXmlIn", { name: "liscio.xml", mimeType: "application/xml", buffer: Buffer.from(liscio || "", "utf8") });
  await pg.waitForTimeout(900);
  const dopoL = await pg.evaluate(() => { const D = window.__genesi.D2; return { kg: D.kg, propri: D.holes.filter((h) => h.kg !== undefined || h.prof !== undefined || h.stem !== undefined).length, toast: window.__toasts.join(" | ") }; });
  dice(dopoL.kg === P.kg && dopoL.propri === 0 && !/valori/.test(dopoL.toast.replace(/Maglia rigenerata[^|]*/g, "")), `un piano uniforme si riapre com'è sempre stato: carica ${P.kg} kg dal primo foro, nessun valore per foro`, dopoL);
}
/* 11. F5b — IL FILE DI SCAMBIO DELLA VOLATA (.volata.json), quello che va al
   gestionale. Esce dalla scena 3D: si passa dal progetto 2D alla simulazione
   col bottone vero e si esporta col bottone vero. */
{
  console.log("\n── F5b: il .volata.json ──");
  const esporta = async () => {
    await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btnExport").click(); });
    await pg.waitForTimeout(700);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => /\.volata\.json$/.test(x.nome));
    if (!f) return null;
    try { return JSON.parse(await pg.evaluate(async (h) => (await fetch(h)).text(), f.href)); } catch (e) { return null; }
  };
  const simula = async () => { await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);
    await pg.evaluate(() => document.getElementById("d2-cta").click()); await pg.waitForTimeout(2500); };
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);
  const P = await pg.evaluate(() => { const D = window.__genesi.D2; for (const h of D.holes) { delete h.kg; delete h.prof; delete h.stem; } return { kg: D.kg, prof: D.prof, n: D.holes.length, ids: D.holes.map((h) => h.id) }; });
  await simula();
  const j0 = await esporta();
  dice(!!j0 && j0.volata.fori.length === P.n, `la volata esce dalla scena 3D con i suoi ${P.n} fori`, j0 && j0.volata.fori.length);
  if (j0) {
    dice((await pg.evaluate(() => !!document.getElementById("sim-foro-tipo") || !document.getElementById("tfori").hidden)) === false, "senza valori per foro la scena non porta nessun avviso", "");
    dice(j0.volata.fori.every((f) => f.kg === P.kg && !("borraggio_m" in f)), `⛔ NEUTRALITÀ: senza valori per foro ogni foro ha la carica del progetto (${P.kg} kg) e nessuna chiave nuova`, j0.volata.fori[0]);
    const [a, b, c] = [P.ids[2], P.ids[4], P.ids[0]];
    await pg.evaluate(([a, b]) => { const H = window.__genesi.D2.holes; const x = H.find((h) => h.id === a), y = H.find((h) => h.id === b); x.kg = 35; x.prof = 8.5; x.stem = 1.5; y.kg = 0; }, [a, b]);
    await simula();
    const j1 = await esporta();
    const per = (j, id) => j.volata.fori.find((f) => f.id === id);
    dice(!!j1 && per(j1, a).kg === 35 && per(j1, a).prof === 8.5 && per(j1, a).borraggio_m === 1.5, `⛔ il foro ${a} esce con 35 kg, 8,5 m e il suo borraggio di 1,5 m — non con i valori del progetto`, j1 && per(j1, a));
    dice(!!j1 && per(j1, b).kg === 0, `⛔ il foro ${b}, lasciato SCARICO, esce con 0 kg`, j1 && per(j1, b));
    dice(!!j1 && JSON.stringify(per(j1, c)) === JSON.stringify(per(j0, c)), `il foro ${c}, che non è stato toccato, esce IDENTICO a prima, chiave per chiave`, j1 && per(j1, c));
    const sim = await pg.evaluate(() => window.__genesi.SIM.fori.map((f) => f.kg));
    dice(sim.length === P.n && sim.every((k) => k === P.kg), `⛔ e la SIMULAZIONE non è cambiata: ogni foro della scena usa ancora la carica del progetto (${P.kg} kg) — quale carica debba usare è una decisione del fondatore, non una conseguenza di questo file`, sim);
    const avviso = await pg.evaluate(() => (document.getElementById("infochip") || {}).innerText || "");
    dice(/simulata sul foro tipo: 2 fori hanno valori propri/.test(avviso), "e lo scrive nella riga che descrive la volata (pannello Parametri): «simulata sul foro tipo: 2 fori hanno valori propri»", avviso.slice(-110));
    /* ⛔ ma quel pannello nasce chiuso: l'avviso che CONTA è quello sempre a schermo, accanto ai comandi dello sparo */
    const etichetta = await pg.evaluate(() => { const e = document.getElementById("tfori"), q = e.getBoundingClientRect(); window.__toasts.length = 0; e.click();
      return { testo: e.innerText.trim(), w: Math.round(q.width), h: Math.round(q.height), dentro: q.left >= 0 && q.right <= innerWidth, detto: window.__toasts.join(" | ") }; });
    dice(etichetta.w > 40 && etichetta.h > 15 && etichetta.dentro && /foro tipo/.test(etichetta.testo), `⛔ accanto ai comandi dello sparo c'è l'etichetta «${etichetta.testo}», a schermo (${etichetta.w}×${etichetta.h} px)`, etichetta);
    dice(/FORO TIPO del progetto: 2 fori hanno/.test(etichetta.detto), "e toccandola dice la frase intera", etichetta.detto);
    /* il file descrive la scena SIMULATA: cambiare il 2D senza risimulare non lo cambia */
    await pg.evaluate((a) => { window.__genesi.D2.holes.find((h) => h.id === a).kg = 99; }, a);
    const j2 = await esporta();
    dice(!!j2 && per(j2, a).kg === 35, "cambiato il progetto 2D SENZA risimulare, il file dice ancora la scena simulata (35 kg, non 99)", j2 && per(j2, a));
    /* ⛔ 26/11 — IL RIENTRO. Misurato prima della correzione: riaprendo un file con un foro scarico
       la scena ripartiva da «53,17 kg per foro», la media, senza dirlo. Il file adesso dichiara la
       carica del progetto e il lettore la usa; la media resta per i file che non la dichiarano. */
    dice(!!j1 && j1.volata.default.carica_kg === P.kg && j1.volata.default.profondita_m === P.prof, `il file dichiara carica e profondità del PROGETTO (${P.kg} kg, ${P.prof} m), accanto a quelle di ogni foro`, j1 && j1.volata.default);
    if (j1) {
      const fr = join(R, "__genesi-rientro-" + process.pid + ".volata.json");
      const rientra = async (j) => { writeFileSync(fr, JSON.stringify(j)); await pg.evaluate(() => { window.__toasts.length = 0; }); await pg.setInputFiles("#fileIn", fr); await pg.waitForTimeout(1800);
        return pg.evaluate(() => ({ kg: window.__genesi.P.kg, prof: window.__genesi.P.prof, campo: document.getElementById("pKg").value, detto: window.__toasts.join(" | ") })); };
      try {
        const media = j1.volata.fori.reduce((t, f) => t + f.kg, 0) / j1.volata.fori.length;
        const ieri = JSON.parse(JSON.stringify(j1)); delete ieri.volata.default.carica_kg; delete ieri.volata.default.profondita_m;
        const r0 = await rientra(ieri);
        dice(Math.abs(r0.kg - media) < 1e-9 && /il file non dichiara la carica del progetto e i fori non sono tutti uguali: uso la media \([\d,]+ kg\), che non è la carica di nessun foro/.test(r0.detto),
          `un file che NON dichiara la carica del progetto (com'erano quelli di ieri): resta la media (${media.toFixed(2)} kg) — ma adesso DETTA, col suo numero`, r0);
        const r1 = await rientra(j1);
        dice(r1.kg === P.kg && +r1.campo === P.kg && r1.prof === P.prof, `⛔ riaperto il file che la dichiara, la scena riparte dalla carica del PROGETTO (${P.kg} kg, ${P.prof} m) — non dalla media dei fori (${media.toFixed(2)})`, r1);
        dice(/2 fori hanno nel file una carica diversa da quella del progetto: la simulazione riparte dal progetto \(58,0 kg per foro\)/.test(r1.detto) || new RegExp("2 fori hanno nel file una carica diversa da quella del progetto: la simulazione riparte dal progetto").test(r1.detto),
          "⛔ e dice che due fori avevano una carica loro che la simulazione non usa", r1.detto);
      } finally { try { unlinkSync(fr); } catch (e) {} }
    }
  }
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) { delete h.kg; delete h.prof; delete h.stem; } });
}
/* 12. LA CARICA CHE NON ENTRA NEL FORO. Il caso che non si vede da soli:
   si ACCORCIA un foro e la carica — che nessuno ha toccato — non ci sta più. */
{
  console.log("\n── la carica che non entra nel foro ──");
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(500);
  await pg.evaluate(() => { const D = window.__genesi.D2; for (const h of D.holes) { delete h.kg; delete h.prof; delete h.stem; } window.__genesi.renderScheda2D(); if (document.getElementById("ft-sec").classList.contains("closed")) document.getElementById("ft-apri").click(); });
  await pg.waitForTimeout(350);
  const stato = () => pg.evaluate(() => { const riga = document.querySelector('#d2-scheda .sv-row[data-lab="Carica nel foro"]'), sch = document.getElementById("d2-scheda").innerText;
    const m = /(\d+) indicator[ei] fuori fascia/.exec(sch);
    return { riga: riga ? { cls: riga.querySelector(".sv-dot").className.replace("sv-dot", "").trim(), val: riga.querySelector(".sv-val").innerText.replace(/\s+/g, " ").trim(), why: riga.querySelector(".sv-why").innerText } : null,
      gravi: m ? +m[1] : 0, oltre: [...document.querySelectorAll("#ft-corpo input.oltre")].map((e) => e.id), segni: document.querySelectorAll("#ft-corpo .ft-no").length,
      nota: (document.getElementById("ft-cap") || {}).innerText || "", scheda: (document.getElementById("diCap") || {}).innerText || "", toast: window.__toasts.join(" | "),
      fori: window.__genesi.D2.holes.map((h) => ({ kg: h.kg, prof: h.prof, stem: h.stem })) }; });
  let s = await stato();
  dice(!!s.riga, "nella scheda volata c'è la riga «Carica nel foro»", s.riga);
  if (s.riga) {
    const prima = s;
    dice(prima.riga.cls === "sv-ok" && prima.oltre.length === 0 && prima.segni === 0 && /% il più pieno/.test(prima.riga.val), `col progetto com'è la carica entra in tutti i fori: riga verde («${prima.riga.val}»), nessun segno in tabella`, prima.riga);
    /* si accorcia il secondo foro a 3 m, con la tastiera, dalla tabella: la carica non la tocca nessuno */
    await pg.evaluate(() => { window.__toasts.length = 0; });
    await pg.click("#ft-prof-1", { clickCount: 3 }); await pg.keyboard.type("3"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(400);
    s = await stato();
    dice(s.fori[1].prof === 3 && s.fori[1].kg === undefined, "accorciato il secondo foro a 3 m dalla tabella (la sua carica resta quella del progetto: nessuno l'ha toccata)", s.fori[1]);
    dice(/non entra: \d+ kg in un foro che ne tiene circa \d+/.test(s.toast), "⛔ e chi l'ha appena scritto lo sa SUBITO: il messaggio dice che la carica non entra, coi due numeri", s.toast);
    dice(s.riga.cls === "sv-bad" && /^1 foro in cui non entra/.test(s.riga.val), `⛔ la riga della scheda volata diventa ROSSA: «${s.riga.val}»`, s.riga);
    dice(/ACCORCIANDO un foro/.test(s.riga.why) && /foro \d+: \d+ kg in un foro che ne tiene circa \d+ \(3,0 m di foro/.test(s.riga.why), "e la spiegazione nomina il foro, i due numeri e i suoi 3 m", s.riga.why.slice(0, 420));
    dice(s.gravi === prima.gravi + 1, `⛔ e conta fra gli indicatori gravi della volata (${prima.gravi} → ${s.gravi}): è lo stesso conto che finisce nei file che escono`, [prima.gravi, s.gravi]);
    dice(JSON.stringify(s.oltre) === JSON.stringify(["ft-kg-1"]) && s.segni === 1 && /In 1 foro la carica non entra/.test(s.nota), "⛔ in tabella la cella della carica di QUEL foro è segnata, la riga ha il suo ⚠ e la nota li conta", [s.oltre, s.segni, s.nota]);
    /* ⛔ visto nello scatto a 320 px: con rombo E avviso sulla stessa riga i due segni uscivano
       dalla colonna del numero e toccavano il ritardo. Si misura a tutt'e due le larghezze. */
    for (const W of [430, 320]) {
      await pg.setViewportSize({ width: W, height: 900 }); await pg.waitForTimeout(300);
      const mis = await pg.evaluate(() => { const riga = document.querySelector('#ft-corpo .ft-r[data-i="1"]'), n = riga.querySelector(".ft-num");
        const dopo = [...riga.children].find((c) => c !== n && c.getBoundingClientRect().width > 0);
        const rg = document.createRange(); rg.selectNodeContents(n); const t = rg.getBoundingClientRect();
        return { testo: n.innerText.replace(/\s+/g, ""), fineSegni: Math.round(t.right * 10) / 10, inizioDopo: Math.round(dopo.getBoundingClientRect().left * 10) / 10, sc: [document.querySelector(".ft-scorri").scrollWidth, document.querySelector(".ft-scorri").clientWidth] }; });
      dice(/◆/.test(mis.testo) && /⚠/.test(mis.testo) && mis.fineSegni <= mis.inizioDopo && mis.sc[0] <= mis.sc[1],
        `a ${W} px il numero coi suoi DUE segni («${mis.testo}») finisce prima della colonna accanto (${mis.fineSegni} ≤ ${mis.inizioDopo}) e la tabella non scorre di lato`, mis);
    }
    await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(250);
    await pg.click('.ft-num[data-sel="1"]'); await pg.waitForTimeout(350);
    s = await stato();
    dice(/Non entra: \d+ kg in questo foro che ne tiene circa \d+/.test(s.scheda), "⛔ e la scheda del foro lo dice: «Non entra: … kg in questo foro che ne tiene circa …»", s.scheda);
    /* si riduce la carica: torna tutto a posto */
    await pg.evaluate(() => { window.__toasts.length = 0; });
    await pg.click("#ft-kg-1", { clickCount: 3 }); await pg.keyboard.type("5"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(400);
    s = await stato();
    dice(s.riga.cls !== "sv-bad" && s.oltre.length === 0 && s.segni === 0 && s.scheda === "" && s.gravi === prima.gravi && !/non entra/.test(s.toast),
      "ridotta la carica a 5 kg: la riga non è più rossa, i segni spariscono, gli indicatori gravi tornano quelli di prima", [s.riga, s.oltre, s.gravi, s.toast]);
  }
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) { delete h.kg; delete h.prof; delete h.stem; } window.__genesi.renderScheda2D(); });
  await pg.waitForTimeout(250);
}
/* 13. F6 — IL DIAMETRO PER FORO: si scrive dalla scheda, lo leggono i conti e
   i tre file che escono (DXF, piano d'innesco, file di scambio). */
{
  console.log("\n── F6: il diametro per foro ──");
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(500);
  const P = await pg.evaluate(() => { const D = window.__genesi.D2; for (const h of D.holes) { delete h.kg; delete h.prof; delete h.stem; delete h.diam; } window.__genesi.renderScheda2D(); return { diam: D.diam, n: D.holes.length, ids: D.holes.map((h) => h.id) }; });
  await pg.waitForTimeout(250);
  const uscito = async (bottone, nome) => { await pg.evaluate((b) => { window.__usciti.length = 0; document.getElementById(b).click(); }, bottone); await pg.waitForTimeout(600);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => nome.test(x.nome)); return f ? decodeURIComponent(f.href.split(",").slice(1).join(",")) : null; };
  const raggi = (dxf) => dxf.split("CIRCLE").slice(1).map((b) => +(/\n40\n([\d.]+)/.exec(b) || [])[1]);
  const rP = +(P.diam / 2000).toFixed(4);
  const dxf0 = await uscito("btn-piano-dxf", /piano_fori\.dxf/);
  dice(!!dxf0 && raggi(dxf0).length === P.n && raggi(dxf0).every((x) => Math.abs(x - rP) < 1e-9), `⛔ NEUTRALITÀ: senza diametri per foro il DXF disegna ogni foro col raggio del progetto (${rP} m)`, dxf0 && raggi(dxf0).slice(0, 3));
  dice(!!dxf0 && !/PIEDI/.test(dxf0), "⛔ e a fori verticali nel DXF non c'è nessun livello PIEDI: il file è quello di sempre", dxf0 && (dxf0.match(/PIEDI/g) || []).length);
  const xml0 = await uscito("btn-innesco-xml", /piano_innesco\.xml/);
  dice(!!xml0 && (xml0.match(/<HoleDiameter/g) || []).length === 1, "e nel piano d'innesco il diametro compare una volta sola, quello del progetto", xml0 && (xml0.match(/<HoleDiameter/g) || []).length);

  /* dalla scheda del foro, con la tastiera */
  const box = await pg.locator("#d2-canvas").boundingBox(); void box;
  await pg.evaluate(() => { const D = window.__genesi.D2; D.sel = -1; });
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded(); await pg.waitForTimeout(120);
  { const bb = await pg.locator("#d2-canvas").boundingBox();
    const rel = await pg.evaluate(() => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[3]; return { x: (m.startX + h.mx * m.scale) / c.width, y: (m.faceY + h.my * m.scale) / c.height }; });
    await pg.mouse.click(bb.x + rel.x * bb.width, bb.y + rel.y * bb.height); await pg.waitForTimeout(300); }
  const campo0 = await pg.evaluate(() => { const e = document.getElementById("diDiam"); return e ? e.value : null; });
  dice(campo0 !== null && +campo0 === P.diam, `nella scheda del foro c'è il quarto campo, il diametro, col valore del progetto (${campo0} mm)`, campo0);
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#diDiam", { clickCount: 3 }); await pg.keyboard.type("76,5"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(350);
  let st = await pg.evaluate(() => ({ diam: window.__genesi.D2.holes[3].diam, toast: window.__toasts.join(" | ") }));
  dice(st.diam === undefined && /numero intero/.test(st.toast), "76,5 mm: rifiutato — un diametro è la misura di un utensile, serve un numero intero", st);
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#diDiam", { clickCount: 3 }); await pg.keyboard.type("76"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(400);
  st = await pg.evaluate(() => ({ diam: window.__genesi.D2.holes[3].diam, toast: window.__toasts.join(" | "), nota: (document.getElementById("diValNota") || {}).innerText || "", cap: (document.getElementById("diCap") || {}).innerText || "" }));
  dice(st.diam === 76 && /diametro 76 mm — non più quello del progetto/.test(st.toast), "⛔ scritto 76: il foro ha 76 mm suoi, e lo dice col diametro del progetto accanto", st.toast);
  dice(/diametro suo/.test(st.nota), "la scheda lo segna («diametro suo»)", st.nota);
  dice(st.cap === "" || /Ø76 mm/.test(st.cap), `se la carica non entra più nel foro ristretto, l'avviso parla del diametro di QUEL foro${st.cap ? " («…" + st.cap.slice(st.cap.indexOf("Ø"), st.cap.indexOf("Ø") + 7) + "»)" : " (qui entra ancora)"}`, st.cap);

  /* i file */
  const pos = await pg.evaluate(() => { const h = window.__genesi.D2.holes[3]; return { x: h.mx, y: h.my, id: h.id }; });
  const dxf = await uscito("btn-piano-dxf", /piano_fori\.dxf/);
  const cerchi = dxf ? dxf.split("CIRCLE").slice(1).map((b) => ({ x: +(/\n10\n([-\d.]+)/.exec(b) || [])[1], y: +(/\n20\n([-\d.]+)/.exec(b) || [])[1], r: +(/\n40\n([\d.]+)/.exec(b) || [])[1] })) : [];
  const suo = cerchi.find((c) => Math.abs(c.x - pos.x) < 0.006 && Math.abs(c.y - pos.y) < 0.006);
  dice(!!suo && Math.abs(suo.r - 0.038) < 1e-9 && cerchi.filter((c) => Math.abs(c.r - rP) < 1e-9).length === P.n - 1, `⛔ nel DXF il cerchio di quel foro ha 38 mm di raggio; gli altri ${P.n - 1} quello del progetto`, [suo, cerchi.length]);
  const xml = await uscito("btn-innesco-xml", /piano_innesco\.xml/);
  const blocco = xml ? xml.split("<Hole ").slice(1).find((b) => { const q = /<Position x="([^"]*)" y="([^"]*)"/.exec(b); return q && Math.abs(+q[1] - pos.x) < 0.006 && Math.abs(+q[2] - pos.y) < 0.006; }) : null;
  dice(!!blocco && /<HoleDiameter unit="mm">76<\/HoleDiameter>/.test(blocco) && (xml.match(/<HoleDiameter/g) || []).length === 2, "⛔ nel piano d'innesco quel foro porta il SUO diametro (e solo lui: due HoleDiameter in tutto, progetto e foro)", blocco && blocco.slice(0, 260));

  /* la tabella: la colonna c'è dove c'è posto */
  if (await pg.evaluate(() => document.getElementById("ft-sec").classList.contains("closed"))) { await pg.evaluate(() => document.getElementById("ft-apri").click()); await pg.waitForTimeout(300); }
  const colonna = async (W) => { await pg.setViewportSize({ width: W, height: 900 }); await pg.waitForTimeout(350);
    return pg.evaluate(() => { const e = document.getElementById("ft-diam-3"), sc = document.querySelector(".ft-scorri"), q = e.getBoundingClientRect();
      return { visibile: q.width > 30, valore: e.value, suo: e.classList.contains("suo"), scorre: [sc.scrollWidth, sc.clientWidth], pagina: [document.documentElement.scrollWidth, innerWidth] }; }); };
  const largo = await colonna(900);
  dice(largo.visibile && largo.valore === "76" && largo.suo && largo.scorre[0] <= largo.scorre[1], "⛔ su uno schermo largo la tabella ha la colonna del diametro: 76 su quel foro, segnato come suo, e la tabella non scorre di lato", largo);
  const tel = await colonna(430);
  dice(!tel.visibile && tel.scorre[0] <= tel.scorre[1] && tel.pagina[0] <= tel.pagina[1], `⛔ su un telefono (430 px) la colonna non c'è e la tabella ci sta ancora INTERA (${tel.scorre})`, tel);

  /* il file di scambio, dalla scena */
  await pg.evaluate(() => document.getElementById("d2-cta").click()); await pg.waitForTimeout(2500);
  await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btnExport").click(); }); await pg.waitForTimeout(700);
  const fj = (await pg.evaluate(() => window.__usciti)).find((x) => /\.volata\.json$/.test(x.nome));
  let j = null; try { j = fj ? JSON.parse(await pg.evaluate(async (h) => (await fetch(h)).text(), fj.href)) : null; } catch (e) {}
  dice(!!j && j.volata.fori.find((f) => f.id === pos.id).diam === 76 && j.volata.fori.filter((f) => f.diam === P.diam).length === P.n - 1, `⛔ e nel .volata.json quel foro esce con 76 mm, gli altri con ${P.diam}`, j && j.volata.fori.find((f) => f.id === pos.id));
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);
  await pg.evaluate(() => { for (const h of window.__genesi.D2.holes) { delete h.kg; delete h.prof; delete h.stem; delete h.diam; } window.__genesi.renderScheda2D(); });
  await pg.waitForTimeout(250);
}
/* 14. F6b — L'INCLINAZIONE PER FORO: si scrive dalla scheda; sposta il piede
   sulla pianta e ruota il foro nella scena; va nei due file e torna dal piano. */
{
  console.log("\n── F6b: l'inclinazione per foro ──");
  await pg.setViewportSize({ width: 430, height: 900 });
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(500);
  const campi = ["kg", "prof", "stem", "diam", "incl"];
  const pulisci = (gradi) => pg.evaluate(([campi, gradi]) => { const D = window.__genesi.D2; for (const h of D.holes) for (const c of campi) delete h[c];
    const e = document.getElementById("dIncl"); e.value = String(gradi); e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }, [campi, gradi]);
  await pulisci(10); await pg.waitForTimeout(500);
  const P = await pg.evaluate(() => { const D = window.__genesi.D2; return { incl: D.incl, prof: D.prof, n: D.holes.length, ids: D.holes.map((h) => h.id) }; });
  dice(P.incl === 10, "il progetto è a 10° (scritti nel campo vero della maglia)", P.incl);
  /* il piede di un foro sulla pianta: il pallino ambra è dove dico io? */
  const piede = (i, lung, gradi) => pg.evaluate(([i, lung, gradi]) => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[i];
    const x = Math.round(m.startX + h.mx * m.scale), y = Math.round(m.faceY + h.my * m.scale - lung * Math.sin(gradi * Math.PI / 180) * m.scale);
    const d = c.getContext("2d").getImageData(x, y, 1, 1).data; return { ambra: d[0] > 170 && d[1] > 140 && d[2] < 170 && d[0] - d[2] > 50, rgb: [d[0], d[1], d[2]], px: Math.round(lung * Math.sin(gradi * Math.PI / 180) * m.scale) }; }, [i, lung, gradi]);
  const p0 = await piede(5, P.prof, 10);
  dice(p0.ambra && p0.px >= 6, `sulla pianta il piede del foro 6 sta ${p0.px} px davanti al colletto: ${P.prof} m di foro a 10°`, p0);

  const uscito = async (bottone, nome) => { await pg.evaluate((b) => { window.__usciti.length = 0; document.getElementById(b).click(); }, bottone); await pg.waitForTimeout(600);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => nome.test(x.nome)); return f ? decodeURIComponent(f.href.split(",").slice(1).join(",")) : null; };
  const xml0 = await uscito("btn-innesco-xml", /piano_innesco\.xml/);
  dice(!!xml0 && (xml0.match(/<HoleInclination unit="deg">10<\/HoleInclination>/g) || []).length === 1 && !/<Inclination /.test(xml0), "⛔ il piano d'innesco dice l'inclinazione del PROGETTO (10°), una volta — prima non la portava — e senza inclinazioni per foro nessun foro la ripete", xml0 && (xml0.match(/Inclination[^>]*>[^<]*/g) || []));
  /* il giro di andata e ritorno del progetto: lo si porta a 0°, si riapre QUEL piano, torna a 10° */
  { await pg.evaluate(() => { const e = document.getElementById("dIncl"); e.value = "0"; e.dispatchEvent(new Event("change", { bubbles: true })); }); await pg.waitForTimeout(300);
    const prima = await pg.evaluate(() => window.__genesi.D2.incl);
    const f0 = join(R, "__genesi-f6b0-" + process.pid + ".xml"); writeFileSync(f0, xml0 || "");
    try { await pg.setInputFiles("#fileXmlIn", f0); await pg.waitForTimeout(900);
      const dopo = await pg.evaluate(() => ({ incl: window.__genesi.D2.incl, campo: document.getElementById("dIncl").value, propri: window.__genesi.D2.holes.filter((h) => "incl" in h).length }));
      dice(prima === 0 && dopo.incl === 10 && +dopo.campo === 10 && dopo.propri === 0, "⛔ riaperto il piano, il progetto torna a 10° (anche nel campo) e nessun foro ne guadagna una sua: prima riaprendolo restava l'inclinazione che c'era", [prima, dopo]);
      /* un piano di IERI, che la riga non ce l'ha: resta quella che c'è */
      writeFileSync(f0, (xml0 || "").replace(/\s*<HoleInclination[^>]*>[^<]*<\/HoleInclination>/, ""));
      await pg.evaluate(() => { const e = document.getElementById("dIncl"); e.value = "7"; e.dispatchEvent(new Event("change", { bubbles: true })); }); await pg.waitForTimeout(300);
      await pg.setInputFiles("#fileXmlIn", f0); await pg.waitForTimeout(900);
      const tenuta = await pg.evaluate(() => window.__genesi.D2.incl);
      dice(tenuta === 7, "e un piano di ieri, senza quella riga, lascia l'inclinazione che c'è (7°): non la azzera", tenuta);
    } finally { try { unlinkSync(f0); } catch (e) {} }
    await pulisci(10); await pg.waitForTimeout(500); }

  /* dalla scheda del foro, con la tastiera */
  await pg.evaluate(() => { window.__genesi.D2.sel = -1; });
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded(); await pg.waitForTimeout(120);
  { const bb = await pg.locator("#d2-canvas").boundingBox();
    const rel = await pg.evaluate(() => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[3]; return { x: (m.startX + h.mx * m.scale) / c.width, y: (m.faceY + h.my * m.scale) / c.height }; });
    await pg.mouse.click(bb.x + rel.x * bb.width, bb.y + rel.y * bb.height); await pg.waitForTimeout(300); }
  const campo0 = await pg.evaluate(() => { const e = document.getElementById("diIncl"); if (!e) return null; const q = e.getBoundingClientRect(), g = e.parentElement.getBoundingClientRect();
    return { valore: e.value, h: Math.round(q.height), unita: e.parentElement.innerText.replace(/\s+/g, " ").trim(), dentro: g.right <= innerWidth + 0.5 && g.left >= 0 }; });
  dice(!!campo0 && +campo0.valore === 10 && campo0.h >= 40 && /inclinazione\s*°/.test(campo0.unita) && campo0.dentro, "nella scheda del foro c'è il quinto campo, l'inclinazione, col valore del progetto (10°), alto quanto gli altri e dentro lo schermo", campo0);
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#diIncl", { clickCount: 3 }); await pg.keyboard.type("31"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(350);
  let st = await pg.evaluate(() => ({ incl: window.__genesi.D2.holes[3].incl, toast: window.__toasts.join(" | ") }));
  dice(st.incl === undefined && /30/.test(st.toast) && /inclinazione/.test(st.toast), "31°: rifiutato, e il messaggio dice il limite (30) e di che campo si parla", st);
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#diIncl", { clickCount: 3 }); await pg.keyboard.type("20"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(400);
  st = await pg.evaluate(() => ({ incl: window.__genesi.D2.holes[3].incl, toast: window.__toasts.join(" | "), nota: (document.getElementById("diValNota") || {}).innerText || "", fuoco: (document.activeElement || {}).id || "" }));
  dice(st.incl === 20 && /inclinazione 20° — non più quella del progetto \(10°\)/.test(st.toast), "⛔ scritto 20: il foro ha 20° suoi, e lo dice coi gradi attaccati al numero e l'inclinazione del progetto accanto", st.toast);
  dice(/inclinazione sua/.test(st.nota), "la scheda lo segna («inclinazione sua»)", st.nota);
  const p20 = await piede(3, P.prof, 20), p10 = await piede(3, P.prof, 10);
  dice(p20.ambra && !p10.ambra && p20.px > p10.px + 3, `⛔ sulla pianta il piede di QUEL foro è andato avanti: ${p20.px} px invece di ${p10.px} (dove stava a 10° non c'è più niente)`, [p20, p10]);
  const altri = await piede(5, P.prof, 10);
  dice(altri.ambra, "e gli altri fori hanno il piede dov'era", altri);
  /* ⛔ il difetto che c'era da prima: un foro ACCORCIATO mostrava il piede di uno lungo */
  await pg.evaluate(() => { const D = window.__genesi.D2; D.holes[7].prof = 6; window.__genesi.renderScheda2D(); document.getElementById("dIncl").dispatchEvent(new Event("change", { bubbles: true })); });
  await pg.waitForTimeout(400);
  const corto = await piede(7, 6, 10), lungo = await piede(7, P.prof, 10);
  dice(corto.ambra && !lungo.ambra, `⛔ un foro accorciato a 6 m ha il piede a ${corto.px} px, non ai ${lungo.px} di un foro da ${P.prof} m: prima la pianta usava la profondità del progetto per tutti`, [corto, lungo]);
  await pg.evaluate(() => { delete window.__genesi.D2.holes[7].prof; });

  /* zero è un valore: un foro VERTICALE in una volata inclinata */
  await pg.evaluate(() => { window.__genesi.D2.sel = -1; });
  await pg.locator("#d2-canvas").scrollIntoViewIfNeeded(); await pg.waitForTimeout(120);
  { const bb = await pg.locator("#d2-canvas").boundingBox();
    const rel = await pg.evaluate(() => { const D = window.__genesi.D2, m = D._m, c = document.getElementById("d2-canvas"), h = D.holes[9]; return { x: (m.startX + h.mx * m.scale) / c.width, y: (m.faceY + h.my * m.scale) / c.height }; });
    await pg.mouse.click(bb.x + rel.x * bb.width, bb.y + rel.y * bb.height); await pg.waitForTimeout(300); }
  await pg.evaluate(() => { window.__toasts.length = 0; });
  await pg.click("#diIncl", { clickCount: 3 }); await pg.keyboard.type("0"); await pg.keyboard.press("Tab"); await pg.waitForTimeout(400);
  const zero = await pg.evaluate(() => ({ incl: window.__genesi.D2.holes[9].incl, toast: window.__toasts.join(" | ") }));
  const senzaPiede = await piede(9, P.prof, 10);
  dice(zero.incl === 0 && /inclinazione 0° — non più quella del progetto \(10°\)/.test(zero.toast) && !senzaPiede.ambra, "⛔ ZERO è un valore: un foro verticale in una volata a 10° resta a zero (non «torna al progetto»), e sulla pianta il suo piede non c'è più", [zero, senzaPiede]);
  await pg.evaluate(() => { delete window.__genesi.D2.holes[9].incl; });

  /* i file */
  const pos = await pg.evaluate(() => { const h = window.__genesi.D2.holes[3]; return { x: h.mx, y: h.my, id: h.id }; });
  const xml = await uscito("btn-innesco-xml", /piano_innesco\.xml/);
  const blocco = xml ? xml.split("<Hole ").slice(1).find((b) => { const q = /<Position x="([^"]*)" y="([^"]*)"/.exec(b); return q && Math.abs(+q[1] - pos.x) < 0.006 && Math.abs(+q[2] - pos.y) < 0.006; }) : null;
  dice(!!blocco && /<Inclination unit="deg">20<\/Inclination>/.test(blocco) && (xml.match(/<Inclination /g) || []).length === 1 && (xml.match(/<HoleInclination unit="deg">10<\/HoleInclination>/g) || []).length === 1 && !/DesignInclination/.test(xml),
    "⛔ nel piano d'innesco quel foro porta la SUA inclinazione (solo lui), e il piano dichiara a parte quella del progetto", blocco && blocco.slice(0, 300));
  /* il piano fori DXF: il piede di ogni foro, sul livello PIEDI */
  await pg.evaluate(() => { window.__toasts.length = 0; });
  const dxfP = await uscito("btn-piano-dxf", /piano_fori\.dxf/);
  const piedi = dxfP ? [...dxfP.matchAll(/0\nPOLYLINE\n8\nPIEDI\n[\s\S]*?0\nSEQEND\n/g)].map((m) => [...m[0].matchAll(/\n10\n([-\d.]+)\n20\n([-\d.]+)/g)].map((q) => [+q[1], +q[2]])) : [];
  const suoPiede = piedi.find((q) => Math.abs(q[0][0] - pos.x) < 0.006 && Math.abs(q[0][1] - pos.y) < 0.006);
  const seno = (g) => Math.sin(g * Math.PI / 180);
  dice(piedi.length === P.n && piedi.every((q) => q.length === 2 && q[1][1] < q[0][1] && Math.abs(q[1][0] - q[0][0]) < 0.0006), `⛔ nel DXF ci sono ${P.n} linee boccaforo→piede sul livello PIEDI, tutte verso la faccia (prima il file disegnava solo il boccaforo)`, piedi.length);
  dice(!!suoPiede && Math.abs((suoPiede[0][1] - suoPiede[1][1]) - P.prof * seno(20)) < 0.0011 && piedi.filter((q) => Math.abs((q[0][1] - q[1][1]) - P.prof * seno(10)) < 0.0011).length === P.n - 1,
    `⛔ il piede di QUEL foro è ${(P.prof * seno(20)).toFixed(2)} m più avanti (i suoi 20°), gli altri ${P.n - 1} sono a ${(P.prof * seno(10)).toFixed(2)} m (i 10° del progetto)`, suoPiede);
  dice(new RegExp(P.n + " piedi sul livello PIEDI").test(await pg.evaluate(() => window.__toasts.join(" | "))), "e il messaggio dell'esportazione lo dice", await pg.evaluate(() => window.__toasts.join(" | ")));
  /* rileggere il piano: si cambia il progetto, si riapre il file dal bottone vero, e il foro riprende i suoi 20° */
  await pg.evaluate(() => { const D = window.__genesi.D2; for (const h of D.holes) delete h.incl; const e = document.getElementById("dIncl"); e.value = "0"; e.dispatchEvent(new Event("change", { bubbles: true })); });
  await pg.waitForTimeout(300);
  const fxml = join(R, "__genesi-f6b-" + process.pid + ".xml");
  writeFileSync(fxml, xml || "");
  try {
    const ingresso = "fileXmlIn";
    await pg.setInputFiles("#" + ingresso, fxml); await pg.waitForTimeout(900);
    const riletto = await pg.evaluate((pos) => { const D = window.__genesi.D2, h = D.holes.find((q) => Math.abs(q.mx - pos.x) < 0.006 && Math.abs(q.my - pos.y) < 0.006);
      return { progetto: D.incl, campo: document.getElementById("dIncl").value, foro: h ? h.incl : "non trovato", conIncl: D.holes.filter((q) => "incl" in q).length }; }, pos);
    dice(!!ingresso && riletto.progetto === 10 && +riletto.campo === 10 && riletto.foro === 20 && riletto.conIncl === 1,
      "⛔ riaperto il piano: il progetto torna a 10° (anche nel campo), e QUEL foro riprende i suoi 20° — lui solo", riletto);
  } finally { try { unlinkSync(fxml); } catch (e) {} }

  /* la tabella: la nona colonna c'è dove c'è posto */
  if (await pg.evaluate(() => document.getElementById("ft-sec").classList.contains("closed"))) { await pg.evaluate(() => document.getElementById("ft-apri").click()); await pg.waitForTimeout(300); }
  const colonna = async (W) => { await pg.setViewportSize({ width: W, height: 900 }); await pg.waitForTimeout(350);
    return pg.evaluate(() => { const e = document.getElementById("ft-incl-3"), d = document.getElementById("ft-diam-3"), sc = document.querySelector(".ft-scorri"), q = e.getBoundingClientRect(), riga = e.closest(".ft-r");
      const visti = [...riga.children].filter((c) => c.getBoundingClientRect().width > 0), alti = visti.map((c) => { const r = c.getBoundingClientRect(); return Math.round(r.top + r.height / 2); });
      return { visibile: q.width > 30, diametro: d.getBoundingClientRect().width > 30, valore: e.value, suo: e.classList.contains("suo"), rombo: /◆/.test(riga.querySelector(".ft-num").innerText), celle: visti.length, unaRiga: Math.max(...alti) - Math.min(...alti) <= 2, altaRiga: Math.round(riga.getBoundingClientRect().height),
        scorre: [sc.scrollWidth, sc.clientWidth], pagina: [document.documentElement.scrollWidth, innerWidth] }; }); };
  const largo = await colonna(900);
  dice(largo.visibile && largo.valore === "20" && largo.suo && largo.scorre[0] <= largo.scorre[1], "⛔ su uno schermo largo la tabella ha la colonna dell'inclinazione: 20 su quel foro, segnata come sua, e la tabella non scorre di lato", largo);
  dice(largo.celle === 9 && largo.unaRiga && largo.altaRiga < 60, `⛔ e le nove celle stanno su UNA riga (alta ${largo.altaRiga} px): visto nello scatto, la nona andava a capo sotto ogni foro perché la griglia di base era rimasta a otto colonne`, largo);
  const soglia = await colonna(570);
  dice(soglia.visibile && soglia.celle === 9 && soglia.unaRiga && soglia.scorre[0] <= soglia.scorre[1] && soglia.pagina[0] <= soglia.pagina[1], `appena sopra la soglia (570 px) le nove colonne ci stanno, su una riga, senza scorrere (${soglia.scorre})`, soglia);
  dice(largo.rombo, "⛔ e la riga ha il suo ROMBO anche se di suo il foro ha SOLO l'inclinazione (prima il rombo in tabella guardava carica, profondità e borraggio)", largo);
  const medio = await colonna(540);
  dice(!medio.visibile && medio.diametro && medio.celle === 8 && medio.unaRiga && medio.scorre[0] <= medio.scorre[1] && medio.pagina[0] <= medio.pagina[1], `a 540 px l'inclinazione esce e il diametro resta: la tabella ci sta intera (${medio.scorre})`, medio);
  const tel = await colonna(430);
  dice(!tel.visibile && !tel.diametro && tel.celle === 7 && tel.unaRiga && tel.scorre[0] <= tel.scorre[1] && tel.pagina[0] <= tel.pagina[1], `⛔ su un telefono (430 px) non c'è né l'una né l'altra, e la tabella ci sta ancora INTERA (${tel.scorre})`, tel);

  /* la scena 3D e il file di scambio */
  await pg.evaluate(() => document.getElementById("d2-cta").click()); await pg.waitForTimeout(2500);
  const scena = await pg.evaluate((id) => { const G = window.__genesi; const rot = (G.xrayCyls || []).map((g) => ({ id: g.userData.f && g.userData.f.id, gradi: Math.round(-g.rotation.x * 180 / Math.PI * 100) / 100 }));
    return { n: rot.length, suo: (rot.find((r) => r.id === id) || {}).gradi, altri: [...new Set(rot.filter((r) => r.id !== id).map((r) => r.gradi))] }; }, pos.id);
  dice(scena.n === 0 || (scena.suo === 20 && scena.altri.length === 1 && scena.altri[0] === 10), scena.n ? "⛔ nella scena 3D quel foro è ruotato di 20°, gli altri di 10°" : "(la scena non espone i fori in trasparenza: rotazione non misurata qui)", scena);
  await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btnExport").click(); }); await pg.waitForTimeout(700);
  const fj = (await pg.evaluate(() => window.__usciti)).find((x) => /\.volata\.json$/.test(x.nome));
  let j = null; try { j = fj ? JSON.parse(await pg.evaluate(async (h) => (await fetch(h)).text(), fj.href)) : null; } catch (e) {}
  dice(!!j && j.volata.geometria.inclinazione_gradi === 10, "⛔ il .volata.json dice l'inclinazione dei fori (10°): prima non usciva, e chi riceveva il file non sapeva se erano verticali", j && j.volata.geometria);
  dice(!!j && j.volata.fori.find((f) => f.id === pos.id).inclinazione_gradi === 20 && j.volata.fori.filter((f) => "inclinazione_gradi" in f).length === 1, "⛔ e QUEL foro esce coi suoi 20°; gli altri non portano la chiave (seguono la geometria)", j && j.volata.fori.find((f) => f.id === pos.id));
  /* e il giro di andata e ritorno: si porta il progetto a 0°, si riapre QUEL file dal bottone vero, torna a 10° */
  if (j) {
    await pg.evaluate(() => { const e = document.getElementById("pIncl"); e.value = "0"; e.dispatchEvent(new Event("change", { bubbles: true })); });
    await pg.waitForTimeout(600);
    const prima = await pg.evaluate(() => window.__genesi.D2.incl);
    const fjson = join(R, "__genesi-f6b-" + process.pid + ".volata.json");
    writeFileSync(fjson, JSON.stringify(j));
    try {
      await pg.setInputFiles("#fileIn", fjson); await pg.waitForTimeout(1500);
      const dopo = await pg.evaluate(() => ({ incl: window.__genesi.D2.incl, p: document.getElementById("pIncl").value, d: document.getElementById("dIncl").value }));
      dice(prima === 0 && dopo.incl === 10 && +dopo.p === 10 && +dopo.d === 10, "⛔ riaperto il file di scambio l'inclinazione del progetto torna a 10°, nei due campi che la mostrano: prima il giro di andata e ritorno la perdeva", [prima, dopo]);
      /* un file di IERI, senza la chiave: resta l'inclinazione che c'è, non uno zero inventato */
      const ieri = JSON.parse(JSON.stringify(j)); delete ieri.volata.geometria.inclinazione_gradi;
      writeFileSync(fjson, JSON.stringify(ieri));
      await pg.setInputFiles("#fileIn", fjson); await pg.waitForTimeout(1500);
      const tenuta = await pg.evaluate(() => window.__genesi.D2.incl);
      dice(tenuta === 10, "e un file di ieri, che la chiave non ce l'ha, lascia l'inclinazione che c'è (10°): non la azzera", tenuta);
    } finally { try { unlinkSync(fjson); } catch (e) {} }
  }
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);
  await pulisci(0); await pg.waitForTimeout(400);
  await pg.evaluate(() => window.__genesi.renderScheda2D());
  await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(250);
}
/* 15. ⛔ LA GITTATA È SUL FORO TIPO — e si deve leggere accanto al numero. Misurato il 26/11:
   un foro con 1,5 m di borraggio in una volata a 2,2 lascia la gittata a 101 m; la stessa
   formula con quel borraggio dà 193. Qui non si pretende un numero diverso (è la decisione 33):
   si pretende che la riga, il messaggio e il file DICANO per quanti fori non è calcolata. */
{
  console.log("\n── la gittata sul foro tipo ──");
  await pg.setViewportSize({ width: 430, height: 900 });
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(500);
  /* il recettore si porta LONTANO (2 km): così la riga parte VERDE, e si può vedere se resta verde
     quando non deve. Con la distanza della dimostrazione era già gialla per conto suo, e la prova
     «non resta verde» passava anche col difetto rimesso — l'ha detto la controprova. */
  const recPrima = await pg.evaluate(() => { const D = window.__genesi.D2, r = D.recDist; for (const h of D.holes) for (const c of ["kg", "prof", "stem", "diam", "incl"]) delete h[c]; D.recDist = 2000; window.__genesi.renderScheda2D(); return r; });
  await pg.waitForTimeout(300);
  const gittata = () => pg.evaluate(() => { const r = document.querySelector('#d2-scheda .sv-row[data-lab="Gittata flyrock (stima)"]'); if (!r) return null;
    return { val: r.querySelector(".sv-val").innerText.replace(/\s+/g, " ").trim(), cls: r.querySelector(".sv-dot").className.replace("sv-dot", "").trim(), why: r.querySelector(".sv-why").innerText.replace(/\s+/g, " "), etichetta: !!document.getElementById("fly-foro-tipo") }; });
  const csv = async () => { await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("btn-scheda-csv").click(); }); await pg.waitForTimeout(700);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => /scheda_volata\.csv$/.test(x.nome)); const t = f ? decodeURIComponent(f.href.split(",").slice(1).join(",")) : "";
    const riga = (re) => (t.split(/\r?\n/).find((r) => re.test(r)) || "").replace(/^[^;]*;/, "").replace(/^"|"$/g, ""); return { propri: riga(/^"?Fori con valori propri/), fly: riga(/^"?Avviso gittata sul foro tipo/), x50: riga(/^"?Avviso frammentazione sul foro tipo/), m: riga(/^"?Gittata flyrock \(m\)/) }; };
  const g0 = await gittata(), c0 = await csv();
  dice(!!g0 && !g0.etichetta && !/FORO TIPO/.test(g0.why), "⛔ NEUTRALITÀ: senza valori per foro la riga della gittata non porta nessuna etichetta né avviso", g0);
  dice(c0.propri === "0" && c0.fly === "" && c0.x50 === "", "e nella scheda CSV: «Fori con valori propri» 0 (un conto, non un vuoto), i due avvisi vuoti", c0);
  if (g0) {
    /* un foro con meno borraggio, dal ponte di debug */
    await pg.evaluate(() => { window.__genesi.D2.holes[6].stem = 1.5; window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(300);
    const g1 = await gittata(), c1 = await csv();
    dice(g1.val.replace(/foro tipo/, "").trim() === g0.val, `il numero NON è cambiato (${g0.val}): quale foro usi la previsione è la decisione 33, non questa prova`, [g0.val, g1.val]);
    dice(g1.etichetta && /foro tipo/.test(g1.val), "⛔ ma accanto al numero adesso c'è «foro tipo»", g1.val);
    dice(/1 foro ha un valore proprio di borraggio: la gittata è calcolata sul FORO TIPO del progetto, e per quel foro non è calcolata\./.test(g1.why) && /Le distanze di sgombero qui sopra valgono per il foro tipo/.test(g1.why), "⛔ e la spiegazione lo dice per intero: per quel foro la gittata non è calcolata, e le distanze di sgombero valgono per il foro tipo", g1.why.slice(0, 260));
    dice(g0.cls === "sv-ok" && g1.cls === "sv-warn", `⛔ la riga era VERDE (recettore a 2 km) e non lo resta (${g0.cls} → ${g1.cls}): un pallino tranquillo su una distanza di sgombero che per quel foro nessuno ha calcolato non si può leggere`, [g0.cls, g1.cls]);
    dice(c1.propri === "1" && /1 foro ha un valore proprio di borraggio: la gittata è calcolata sul FORO TIPO/.test(c1.fly) && c1.m === c0.m, "⛔ e la scheda CSV — il file che si archivia col rapportino — porta lo stesso avviso accanto alla stessa gittata", c1);
    dice(/1 foro ha un valore proprio di borraggio: la pezzatura è calcolata sul FORO TIPO/.test(c1.x50), "e quello sulla pezzatura", c1.x50);
    /* un foro che di suo ha solo la PROFONDITÀ: la gittata non la legge, quindi non è «fuori» per lei */
    await pg.evaluate(() => { const H = window.__genesi.D2.holes; delete H[6].stem; H[4].prof = 8.5; window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(300);
    const g2 = await gittata(), c2 = await csv();
    dice(!g2.etichetta && c2.fly === "" && /pezzatura/.test(c2.x50) && c2.propri === "1", "⛔ un foro che di suo ha solo la profondità NON fa scattare l'avviso sulla gittata (che la profondità non la legge) — quello sulla pezzatura sì", [g2.etichetta, c2]);
    const x50 = await pg.evaluate(() => { const r = document.querySelector('#d2-scheda .sv-row[data-lab="X50 prevista"]'); return r ? r.querySelector(".sv-why").innerText.replace(/\s+/g, " ") : ""; });
    dice(/1 foro ha un valore proprio di profondità: la pezzatura è calcolata sul FORO TIPO/.test(x50), "e sullo schermo la X50 dice la stessa frase, col campo giusto (prima diceva sempre «carica, profondità o borraggio»)", x50.slice(-200));
  }
  await pg.evaluate((r) => { const D = window.__genesi.D2; for (const h of D.holes) for (const c of ["kg", "prof", "stem", "diam", "incl"]) delete h[c]; D.recDist = r; window.__genesi.renderScheda2D(); }, recPrima);
  await pg.waitForTimeout(250);
}
/* 16. ⛔ IL CONFRONTO A/B NON SAPEVA I FORI CON VALORI LORO (27/11). Due scatti con la stessa
   gittata «sul foro tipo» si leggevano uguali anche se in uno c'era un foro col borraggio corto —
   e la colonna con la gittata più bassa andava in VERDE. Lo scatto adesso porta tre conti, il
   confronto li dice, e il verde sulla gittata si dà solo se vale per tutti i fori di tutt'e due.
   ⛔ Uno scatto salvato PRIMA non ha i tre conti: «non noto», mai «nessuno» né zero. */
{
  console.log("\n── il confronto A/B e i fori con valori loro ──");
  await pg.setViewportSize({ width: 430, height: 900 });
  await pg.click('#bottomnav button[data-scr="design"]'); await pg.waitForTimeout(400);
  const pulisci = () => pg.evaluate(() => { const D = window.__genesi.D2; for (const h of D.holes) for (const c of ["kg", "prof", "stem", "diam", "incl"]) delete h[c]; window.__genesi.renderScheda2D(); });
  const stemPrima = await pg.evaluate(() => window.__genesi.D2.stem);
  const salva = async (slot) => { await pg.evaluate((s) => document.getElementById("cmpSave" + s).click(), slot); await pg.waitForTimeout(300); };
  const confronto = async (scatto) => {
    await pg.evaluate(() => document.getElementById("cmpShow").click()); await pg.waitForTimeout(600);
    const q = await pg.evaluate(() => {
      const g = document.querySelector("#cmpBody > div"), c = g ? [...g.children] : [], righe = {};
      const tx = (e) => e.innerText.replace(/\s+/g, " ").trim(), verde = (e) => /66bb6a/.test(e.getAttribute("style") || "");
      for (let i = 3; i + 2 < c.length; i += 3) righe[tx(c[i])] = { a: tx(c[i + 1]), b: tx(c[i + 2]), verde: verde(c[i + 1]) ? "A" : (verde(c[i + 2]) ? "B" : "") };
      const n = document.getElementById("cmp-fly-tipo");
      return { righe, nota: n ? tx(n) : "", fuori: g ? g.scrollWidth - g.clientWidth : -1, celle: c.length };
    });
    if (scatto) await pg.screenshot({ path: scatto, fullPage: false });
    await pg.evaluate(() => { const c = document.getElementById("cmpClose"); if (c) c.click(); });
    /* una riga che NON c'è si legge vuota invece di far crollare il banco: col difetto rimesso le
       righe spariscono, e un banco che crolla dichiara meno prove invece di dire quale è caduta */
    q.righe = new Proxy(q.righe, { get: (o, k) => (k in o ? o[k] : { a: "", b: "", verde: "", assente: true }), has: (o, k) => k in o });
    return q;
  };
  const csvAB = async () => { await pg.evaluate(() => { window.__usciti.length = 0; document.getElementById("cmpExport").click(); }); await pg.waitForTimeout(500);
    const f = (await pg.evaluate(() => window.__usciti)).find((x) => /confronto_AB\.csv$/.test(x.nome)); const t = f ? decodeURIComponent(f.href.split(",").slice(1).join(",")) : "";
    const riga = (nome) => { const r = t.split(/\r?\n/).find((x) => x.startsWith(nome + ";")); return r === undefined ? null : r.slice(nome.length + 1); };
    return { propri: riga("Fori con valori propri"), noto: riga("Fori con valori propri registrati nello scatto"), fly: riga("Fori fuori dal foro tipo (gittata)"), frag: riga("Fori fuori dal foro tipo (pezzatura)"), m: riga("Gittata flyrock (m)") }; };
  const SCATTO_AB = process.env.DW_SCATTO_AB || "";

  /* a) NEUTRALITÀ: due scatti dello stesso progetto senza valori per foro */
  await pulisci(); await salva("A"); await salva("B");
  const n0 = await confronto(), f0 = await csvAB();
  const NUOVE = ["↳ fori con valori propri", "↳ pezzatura non calcolata per", "↳ gittata non calcolata per"];
  dice(n0.celle > 30 && !!n0.righe["Gittata flyrock"], "premessa: il confronto si disegna, e la riga della gittata si legge", n0.celle);
  dice(NUOVE.every((r) => !(r in n0.righe)) && n0.nota === "", "⛔ NEUTRALITÀ: senza valori per foro il confronto è quello di sempre — nessuna delle tre righe nuove, nessuna nota", Object.keys(n0.righe));
  dice(f0.propri === "0;0" && f0.noto === "si;si" && f0.fly === "0;0" && f0.frag === "0;0", "e nel CSV i tre conti sono ZERI registrati (un conto, non un vuoto)", f0);

  /* b) B con più borraggio: gittata più bassa, e B va in verde — la premessa che il verde esista */
  await pg.evaluate(() => { const D = window.__genesi.D2; D.stem = +D.stem + 0.8; window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(250);
  await salva("B");
  const v1 = await confronto(), f1 = await csvAB();
  const mA = Number((f1.m || "").split(";")[0]), mB = Number((f1.m || "").split(";")[1]);
  dice(mB < mA && v1.righe["Gittata flyrock"].verde === "B", `premessa: con più borraggio in tutto il progetto la gittata di B è più bassa (${mA} → ${mB} m) e B è in VERDE`, [f1.m, v1.righe["Gittata flyrock"]]);

  /* c) lo stesso B, ma con UN foro col borraggio corto */
  await pg.evaluate(() => { window.__genesi.D2.holes[6].stem = 1.5; window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(250);
  await salva("B");
  const v2 = await confronto(SCATTO_AB), f2 = await csvAB();
  dice(f2.m === f1.m, `il numero NON è cambiato (${f2.m}): quale foro usi la previsione è la decisione 33, non questa prova`, [f1.m, f2.m]);
  dice(v2.righe["Gittata flyrock"].verde === "", "⛔ ma B NON è più in verde: per quel foro la gittata scritta non è calcolata, e premiarla vorrebbe dire dipingere di verde una distanza di sgombero che nessuno ha fatto", v2.righe["Gittata flyrock"]);
  dice(v2.righe["↳ gittata non calcolata per"] && v2.righe["↳ gittata non calcolata per"].a === "nessuno" && v2.righe["↳ gittata non calcolata per"].b === "1 foro", "⛔ sotto la gittata: «non calcolata per — nessuno · 1 foro»", v2.righe["↳ gittata non calcolata per"]);
  dice(v2.righe["↳ fori con valori propri"] && v2.righe["↳ fori con valori propri"].b === "1 foro" && v2.righe["↳ pezzatura non calcolata per"] && v2.righe["↳ pezzatura non calcolata per"].b === "1 foro", "e sotto i fori e sotto la pezzatura lo stesso conto, colonna per colonna", [v2.righe["↳ fori con valori propri"], v2.righe["↳ pezzatura non calcolata per"]]);
  dice(/foro tipo/.test(v2.nota) && /Nessuno dei due è dichiarato migliore su questa riga/.test(v2.nota) && !/scatto salvato prima/.test(v2.nota), "⛔ e la ragione del verde che manca è scritta sotto, come per la PPV", v2.nota);
  dice(v2.fuori <= 0, `le righe nuove non sfondano la griglia a 430 px (${v2.fuori} px fuori)`, v2.fuori);
  dice(f2.propri === "0;1" && f2.fly === "0;1" && f2.frag === "0;1" && f2.noto === "si;si", "⛔ e il CSV porta i tre conti accanto ai numeri: 0 e 1", f2);
  await pg.setViewportSize({ width: 320, height: 800 }); await pg.waitForTimeout(200);
  const v2s = await confronto(SCATTO_AB ? SCATTO_AB.replace(/\.png$/, "-320.png") : "");
  dice(v2s.fuori <= 0 && v2s.righe["↳ gittata non calcolata per"].b === "1 foro", `e a 320 px nemmeno (${v2s.fuori} px fuori)`, v2s.fuori);
  await pg.setViewportSize({ width: 430, height: 900 }); await pg.waitForTimeout(200);

  /* d) un foro che di suo ha solo la PROFONDITÀ: la gittata non la legge, e il verde torna */
  await pg.evaluate(() => { const H = window.__genesi.D2.holes; delete H[6].stem; H[4].prof = 8.5; window.__genesi.renderScheda2D(); }); await pg.waitForTimeout(250);
  await salva("B");
  const v3 = await confronto(), f3 = await csvAB();
  dice(f3.propri === "0;1" && f3.fly === "0;0" && f3.frag === "0;1", "⛔ nel CSV, per quel foro: un valore proprio, fuori per la pezzatura, NON fuori per la gittata — tre conti, non uno ripetuto", f3);
  dice(v3.righe["Gittata flyrock"].verde === "B" && !("↳ gittata non calcolata per" in v3.righe) && v3.nota === "", "⛔ un foro con la sola profondità sua NON spegne il verde sulla gittata (che la profondità non la legge): la guardia non è un interruttore", [v3.righe["Gittata flyrock"], v3.nota]);
  dice(v3.righe["↳ pezzatura non calcolata per"] && v3.righe["↳ pezzatura non calcolata per"].b === "1 foro" && v3.righe["↳ fori con valori propri"].b === "1 foro", "ma per la pezzatura quel foro è fuori, e lo dice", v3.righe["↳ pezzatura non calcolata per"]);

  /* e) ⛔ lo scatto salvato PRIMA: A perde i tre conti, B è pulito e ha la gittata più bassa */
  await pulisci(); await salva("B");
  await pg.evaluate(() => { const A = JSON.parse(localStorage.getItem("genesiCmpA")); delete A.kpi.foriPropri; delete A.kpi.flyTipo; delete A.kpi.fragTipo; localStorage.setItem("genesiCmpA", JSON.stringify(A)); });
  const v4 = await confronto(), f4 = await csvAB();
  dice(v4.righe["↳ fori con valori propri"] && v4.righe["↳ fori con valori propri"].a === "non noto" && v4.righe["↳ fori con valori propri"].b === "nessuno", "⛔ uno scatto salvato PRIMA: «non noto» accanto a «nessuno» — non sapere quanti fori avesse non è sapere che non ne aveva", v4.righe["↳ fori con valori propri"]);
  dice(v4.righe["Gittata flyrock"].verde === "" && /scatto salvato prima non dice quanti ne avesse/.test(v4.nota), "⛔ e la gittata NON va in verde, con la ragione scritta: lo scatto non dice quanti fori avesse", [v4.righe["Gittata flyrock"], v4.nota]);
  dice(f4.propri === ";0" && f4.fly === ";0" && f4.frag === ";0" && /^no — scatto salvato prima che il dato esistesse;si$/.test(f4.noto || ""), "⛔ e nel CSV la cella di A è VUOTA (non zero), con la riga che dice che quel vuoto è un «non lo so»", f4);

  await pg.evaluate((s) => { window.__genesi.D2.stem = s; }, stemPrima); await pulisci();
  await pg.waitForTimeout(250);
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

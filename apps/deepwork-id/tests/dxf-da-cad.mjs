/* IL LETTORE DXF DI GENESI CONTRO FILE SCRITTI DA UN ALTRO PROGRAMMA
   ─────────────────────────────────────────────────────────────────
   Uso:  node apps/deepwork-id/tests/dxf-da-cad.mjs [--controprova] [--dimmi]

   PERCHÉ ESISTE. Fino al 26/11 il lettore DXF (`dxfLeggi`, già `dxfInTratti`, in
   apps/genesi/genesi-data.js) era provato in due modi soli: andata e ritorno
   col NOSTRO export, e stringhe DXF scritte a mano da chi aveva scritto il
   lettore. CLAUDE.md lo chiama per nome: «una prova di andata e ritorno resta
   verde se le due metà sbagliano insieme», e «chi fabbrica i dati di prova
   sbaglia come il prodotto». Un file di scambio si prova con un file scritto
   da QUALCUN ALTRO.
   I campioni in `campioni/dxf-da-cad/` li ha scritti `ezdxf` (la libreria di
   riferimento per il formato; `genera.py` lì accanto dice come rigenerarli),
   nelle forme che un CAD produce davvero: quattro versioni del formato,
   polilinee chiuse, blocchi definiti e inseriti, spazio carta, superfici a
   maglia, entità specchiate, unità dichiarate, DXF binario; dal 26/11 gli
   archi e i blocchi inseriti in tutte le loro forme (ruotati, scalati,
   specchiati, annidati, a schiera, con attributi, riferimenti esterni).
   La prima misura, sul lettore com'era: **9 file su 23 letti male**, tutti in
   silenzio e tutti con una geometria plausibile — simboli comparsi attorno
   all'origine, il cartiglio letto come terreno, i contorni chiusi arrivati
   aperti. Nessuna delle prove esistenti poteva vederlo.

   CHE COSA PRETENDE, per ogni campione (da `verita.json`, scritto dal
   generatore e non da questa suite):
     · quanti tratti entrano, e con quali punti in coordinate mondo;
     · dal 26/11, per gli ARCHI (ARC, CIRCLE, tratti curvi delle polilinee):
       che la spezzata con cui Genesi li rende stia SULLA curva vera. La
       curva vera la dice ezdxf come elenco di primitive esatte (segmenti,
       archi con centro e raggio, cerchi): ogni vertice letto deve starci
       sopra, il punto di mezzo di ogni lato non deve scostarsene più della
       freccia dichiarata (`DXF_FRECCIA_ARCO_M`), e la lunghezza deve tornare.
       ⚠️ Il primo riferimento provato era la curva «appiattita» da ezdxf:
       su un cerchio di 100 m sbagliava di 27 mm (curve di Bézier), più della
       tolleranza che doveva giudicare. Un righello va misurato anche lui;
     · dal 26/11, per i BLOCCHI INSERITI: che tutto ciò che entra stia sul
       disegno che il CAD vede davvero. ezdxf espande ogni INSERT e dà le
       primitive già nel mondo (un arco in un blocco scalato in modo diverso
       sui due assi è un tratto d'ELLISSE, e come tale si misura): vertici
       sopra, freccia entro il limite NEL MONDO, lunghezza complessiva;
     · che cosa viene DICHIARATO come non letto o reso in altra forma
       (`nonLette`, `spazioCarta`, `archiSpezzati`, `blocchiEspansi`,
       `binario`, `unita`): ciò che non entra si conta.
   E il denominatore: quanti campioni ci sono sul disco e quanti ne ha
   guardati — un campione aggiunto senza la sua verità (o il contrario) ferma
   la suite invece di passare inosservato.

   LA CONTROPROVA rimette nel lettore, IN MEMORIA (su una copia del modulo in
   una cartella temporanea: il file di prodotto non viene toccato), i difetti
   di prima, uno alla volta, e pretende che ognuno faccia cadere almeno un
   campione — e stampa quali. */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..");
const CAMPIONI = join(QUI, "campioni", "dxf-da-cad");
const MODULO = join(R, "apps", "genesi", "genesi-data.js");
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

const verita = JSON.parse(readFileSync(join(CAMPIONI, "verita.json"), "utf8"));
const sulDisco = readdirSync(CAMPIONI).filter((f) => f.endsWith(".dxf")).map((f) => f.slice(0, -4)).sort();
const vicino = (a, b) => Math.abs(a - b) < 1e-6;

/* come fa la pagina: `await file.text()`, cioè UTF-8 — anche sul binario */
const testoDi = (nome) => new TextDecoder("utf-8").decode(readFileSync(join(CAMPIONI, nome + ".dxf")));

/* ───────── la geometria esatta: distanza di un punto dalle primitive di ezdxf ───────── */
const TAU = 2 * Math.PI, norm = (a) => ((a % TAU) + TAU) % TAU;
function versoArco(q) {            // da che parte gira l'arco: lo dice il punto di passaggio
  const ang = (v) => Math.atan2(v[1] - q.c[1], v[0] - q.c[0]), a0 = ang(q.da), am = ang(q.per), a1 = ang(q.a);
  const antiorario = norm(am - a0) <= norm(a1 - a0);
  return { ang, a0, antiorario, ampiezza: antiorario ? norm(a1 - a0) : norm(a0 - a1) };
}
/* il tratto d'ellisse (un arco dentro un blocco scalato in modo diverso sui due
   assi): punto al parametro t = centro + M·cos t + m·sin t, antiorario da t0 a
   t1. La distanza non ha una formula chiusa: si campiona fitto e si raffina. */
const puntoEllisse = (q, t) => [q.c[0] + q.M[0] * Math.cos(t) + q.m[0] * Math.sin(t), q.c[1] + q.M[1] * Math.cos(t) + q.m[1] * Math.sin(t)];
function distEllisse(p, q) {
  const N = 720, d = (t) => { const e = puntoEllisse(q, t); return Math.hypot(p[0] - e[0], p[1] - e[1]); };
  let meglio = Infinity, tm = q.t0;
  for (let i = 0; i <= N; i++) { const t = q.t0 + (q.t1 - q.t0) * i / N, v = d(t); if (v < meglio) { meglio = v; tm = t; } }
  let lo = Math.max(q.t0, tm - (q.t1 - q.t0) / N), hi = Math.min(q.t1, tm + (q.t1 - q.t0) / N);
  for (let k = 0; k < 80; k++) { const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3; if (d(a) < d(b)) hi = b; else lo = a; }
  return d((lo + hi) / 2);
}
function lunghezzaEllisse(q) { const N = 20000; let L = 0, a = puntoEllisse(q, q.t0); for (let i = 1; i <= N; i++) { const b = puntoEllisse(q, q.t0 + (q.t1 - q.t0) * i / N); L += Math.hypot(b[0] - a[0], b[1] - a[1]); a = b; } return L; }
function distPrimitiva(p, q) {
  if (q.t === "ellisse") return distEllisse(p, q);
  if (q.t === "linea") { const dx = q.b[0] - q.a[0], dy = q.b[1] - q.a[1], L = dx * dx + dy * dy; let t = L ? ((p[0] - q.a[0]) * dx + (p[1] - q.a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - q.a[0] - t * dx, p[1] - q.a[1] - t * dy); }
  const d = Math.hypot(p[0] - q.c[0], p[1] - q.c[1]);
  if (q.t === "cerchio") return Math.abs(d - q.r);
  const v = versoArco(q), ap = v.ang(p), pos = v.antiorario ? norm(ap - v.a0) : norm(v.a0 - ap);
  if (pos <= v.ampiezza + 1e-12) return Math.abs(d - q.r);
  return Math.min(Math.hypot(p[0] - q.da[0], p[1] - q.da[1]), Math.hypot(p[0] - q.a[0], p[1] - q.a[1]));
}
const lunghezzaPrimitiva = (q) => q.t === "ellisse" ? lunghezzaEllisse(q) : q.t === "linea" ? Math.hypot(q.b[0] - q.a[0], q.b[1] - q.a[1]) : q.t === "cerchio" ? TAU * q.r : q.r * versoArco(q).ampiezza;
/* una spezzata letta contro la curva vera: i VERTICI (devono starci sopra), i
   punti di MEZZO dei lati (la freccia), la lunghezza */
function confronta(pl, prim) {
  const dist = (p) => Math.min(...prim.map((q) => distPrimitiva(p, q)));
  let vertici = 0, freccia = 0, L = 0;
  for (let i = 0; i < pl.length; i++) { vertici = Math.max(vertici, dist(pl[i]));
    if (i) { freccia = Math.max(freccia, dist([(pl[i][0] + pl[i - 1][0]) / 2, (pl[i][1] + pl[i - 1][1]) / 2])); L += Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]); } }
  return { vertici, freccia, L, Lvera: prim.reduce((t, q) => t + lunghezzaPrimitiva(q), 0), punti: pl.length };
}

/* che cosa non torna, per un campione: elenco di frasi (vuoto = a posto) */
function giudica(genesi, nome) {
  const att = verita[nome].attesi, guai = [];
  let r;
  try { r = genesi.dxfLeggi(testoDi(nome)); } catch (e) { return ["il lettore è crollato: " + e.message]; }
  if (r.tratti.length !== att.tratti) guai.push(`tratti: letti ${r.tratti.length}, nel disegno ${att.tratti}`);
  if (att.polilinee) {
    const letti = r.tratti.map((t) => t.pts.map((p) => [p.x, p.y]));
    for (const pa of att.polilinee) {
      const c = letti.some((pl) => pl.length === pa.length && pl.every((q, i) => vicino(q[0], pa[i][0]) && vicino(q[1], pa[i][1])));
      if (!c) guai.push("manca la polilinea " + JSON.stringify(pa) + " — letto " + JSON.stringify(letti).slice(0, 160));
    }
  }
  /* gli archi: per ogni curva vera, il tratto letto che le somiglia di più deve starle addosso */
  if (att.curve) {
    const letti = r.tratti.map((t) => t.pts.map((p) => [p.x, p.y])), tol = genesi.DXF_FRECCIA_ARCO_M;
    att.curve.forEach((prim, k) => {
      let m = null;
      for (const pl of letti) { const c = confronta(pl, prim), voto = c.vertici + Math.abs(c.L - c.Lvera); if (!m || voto < m.voto) m = { ...c, voto }; }
      if (!m) { guai.push(`curva ${k + 1}: nessun tratto letto`); return; }
      if (m.vertici > 1e-6) guai.push(`curva ${k + 1}: un vertice è fuori dalla curva vera di ${m.vertici.toFixed(6)} m`);
      if (m.freccia > tol + 1e-9) guai.push(`curva ${k + 1}: la spezzata si scosta dalla curva di ${(m.freccia * 1000).toFixed(1)} mm (massimo ${tol * 1000})`);
      if (m.L > m.Lvera + 1e-6 || m.L < m.Lvera * 0.98) guai.push(`curva ${k + 1}: lunga ${m.L.toFixed(3)} m, la curva vera ${m.Lvera.toFixed(3)}`);
    });
  }
  /* i blocchi inseriti: TUTTO ciò che è entrato contro TUTTO ciò che il CAD
     disegna (ezdxf espande ogni INSERT e dà le primitive già nel mondo). Ogni
     vertice letto deve stare su una primitiva vera, il mezzo di ogni lato non
     scostarsene più della freccia, e la lunghezza complessiva tornare — così
     un pezzo mancante, uno in più o uno nel posto sbagliato si vedono. */
  if (att.insieme) {
    const tol = genesi.DXF_FRECCIA_ARCO_M;
    let vertici = 0, freccia = 0, L = 0;
    for (const t of r.tratti) { const c = confronta(t.pts.map((p) => [p.x, p.y]), att.insieme); vertici = Math.max(vertici, c.vertici); freccia = Math.max(freccia, c.freccia); L += c.L; }
    const Lvera = att.insieme.reduce((t, q) => t + lunghezzaPrimitiva(q), 0);
    if (vertici > 1e-6) guai.push(`blocchi: un vertice è fuori dal disegno vero di ${vertici.toFixed(6)} m`);
    if (freccia > tol + 1e-9) guai.push(`blocchi: una spezzata si scosta dal disegno vero di ${(freccia * 1000).toFixed(1)} mm (massimo ${tol * 1000})`);
    if (L > Lvera + 1e-6 || L < Lvera * 0.98) guai.push(`blocchi: entrati ${L.toFixed(3)} m di linee, nel disegno ce ne sono ${Lvera.toFixed(3)}`);
  }
  const nl = att.nonLette || {};
  if (JSON.stringify(Object.entries(r.nonLette).sort()) !== JSON.stringify(Object.entries(nl).sort()))
    guai.push("non lette: dichiarate " + JSON.stringify(r.nonLette) + ", nel disegno " + JSON.stringify(nl));
  if (r.spazioCarta !== (att.spazioCarta || 0)) guai.push(`spazio carta: dichiarate ${r.spazioCarta}, sono ${att.spazioCarta || 0}`);
  if (r.archiSpezzati !== (att.archiSpezzati || 0)) guai.push(`archi resi a spezzata: dichiarati ${r.archiSpezzati}, sono ${att.archiSpezzati || 0}`);
  if (r.blocchiEspansi !== (att.blocchiEspansi || 0)) guai.push(`blocchi espansi: dichiarati ${r.blocchiEspansi}, sono ${att.blocchiEspansi || 0}`);
  if (r.binario !== !!att.binario) guai.push(`binario: dichiarato ${r.binario}, è ${!!att.binario}`);
  if (att.unita && (!r.unita || r.unita.nome !== att.unita)) guai.push(`unità: dichiarata ${r.unita && r.unita.nome}, il file dice ${att.unita}`);
  if (att.larghezza != null && (!r.ingombro || !vicino(r.ingombro.larghezza, att.larghezza))) guai.push(`ingombro: ${r.ingombro && r.ingombro.larghezza}, atteso ${att.larghezza}`);
  return guai;
}

let passed = 0, failed = 0;
const dice = (c, m, extra) => { if (c) { passed++; if (DIMMI) console.log("  ✓ " + m); } else { failed++; console.log("  ✗ " + m + (extra ? "\n      " + extra : "")); } };

/* ───────── la controprova: i difetti di prima, uno alla volta ───────── */
const DIFETTI = [
  ["le definizioni dei blocchi e gli altri fogli entrano come disegno",
   "else if(blocco){ cur={tipo, campi:{}, verts:[]}; blocco.entita.push(cur); }",
   "else { cur={tipo, campi:{}, verts:[]}; st.entita.push(cur); }"],
  ["si leggono come disegno anche le tabelle e gli oggetti del file",
   "else if(sezione==='ENTITIES' || !st.haSezioni){ cur={tipo, campi:{}, verts:[]}; st.entita.push(cur); }",
   "else { cur={tipo, campi:{}, verts:[]}; st.entita.push(cur); }"],
  ["lo spazio carta entra come terreno",
   "if(String(e.campi['67']||'').trim()==='1'){ esito.spazioCarta++; continue; }", ""],
  ["il lato di chiusura si perde",
   "if(chiusa && pts.length>=3){", "if(false){"],
  ["la superficie a maglia diventa una polilinea",
   "if(f&(16|64)){ nonLetta('POLYLINE (superficie)'); continue; }", ""],
  ["l'estrusione specchiata si ignora",
   "if(!(m>0) || (Math.abs(nx/m)<1e-9 && Math.abs(ny/m)<1e-9 && nz>0)) return null;", "return null;"],
  ["il binario non si riconosce",
   "if(t.slice(0,18)==='AutoCAD Binary DXF'){ st.binario=true; return st; }", ""],
  ["ciò che non si legge non si conta",
   "const nonLetta = (tipo)=>{ esito.nonLette[tipo]=(esito.nonLette[tipo]||0)+1; esito.nNonLette++; };", "const nonLetta = (tipo)=>{};"],
  /* gli archi (26/11): la curvatura ignorata (l'arco torna una corda), il verso
     sbagliato, l'ARC letto in senso orario, l'estrusione non applicata agli
     archi, il passo fisso invece della freccia, gli archi non contati */
  ["il tratto ad arco torna una corda dritta",
   "if(a.bulge && (a.x!==z.x || a.y!==z.y)){ archi++; for(const q of _dxfBulge(a, z, a.bulge, scala)) pts.push(q); }",
   "if(a.bulge && (a.x!==z.x || a.y!==z.y)){ archi++; }"],
  ["la curvatura gira dalla parte sbagliata",
   "const amp=4*Math.atan(bulge), r=c/(2*Math.sin(Math.abs(amp)/2)), h=(c/2)/Math.tan(amp/2);",
   "const amp=-4*Math.atan(bulge), r=c/(2*Math.sin(Math.abs(amp)/2)), h=(c/2)/Math.tan(amp/2);"],
  ["un ARC che attraversa lo zero viene letto all'indietro",
   "let amp=((a1-a0)%360+360)%360; if(amp===0) amp=360;", "let amp=a1-a0;"],
  ["l'estrusione non si applica agli archi",
   "metti(ocs ? pts.map(q=>ocs(q)) : pts);\n        esito.archiSpezzati++;", "metti(pts);\n        esito.archiSpezzati++;"],
  ["i lati si contano a passo fisso, non dalla freccia",
   "const passoMax = Math.min(Math.PI/6, 2*Math.acos(1 - t/r));", "const passoMax = Math.PI/6;"],
  ["gli archi resi a spezzata non si contano",
   "esito.archiSpezzati += r.archi;", ""],
  /* i blocchi inseriti (26/11): il blocco che si conta e basta, e uno per uno i
     pezzi della trasformazione — punto base, rotazione, scala, specchio,
     annidamento, estrusione, schiera — più ciò che si deve DICHIARARE */
  ["il blocco inserito si conta e non si espande",
   "if(fuori){ if(conAttributi) appesa=1; nonLetta(fuori); continue; }",
   "{ if(conAttributi) appesa=1; nonLetta(fuori||'INSERT'); continue; }"],
  ["il punto base del blocco si ignora",
   "const u=(p.x-b.bx)*sx + ox, v=(p.y-b.by)*sy + oy;", "const u=p.x*sx + ox, v=p.y*sy + oy;"],
  ["la rotazione dell'inserimento si ignora",
   "const co=Math.cos(rot), si=Math.sin(rot),", "const co=1, si=0,"],
  ["la rotazione gira al contrario",
   "const co=Math.cos(rot), si=Math.sin(rot),", "const co=Math.cos(rot), si=-Math.sin(rot),"],
  ["la scala dell'inserimento si ignora",
   "sx=num('41',1), sy=num('42',1),", "sx=1, sy=1,"],
  ["la scala in Y prende quella in X",
   "sx=num('41',1), sy=num('42',1),", "sx=num('41',1), sy=num('41',1),"],
  ["le trasformazioni di un blocco dentro un blocco non si compongono",
   "return T ? T(q) : q;", "return q;"],
  ["l'estrusione dell'INSERT si ignora",
   "if(ocs) q=ocs(q);", ""],
  ["la freccia degli archi si misura nel blocco, non nel mondo",
   "DXF_FRECCIA_ARCO_M/(scala>0 ? scala : 1)", "DXF_FRECCIA_ARCO_M"],
  ["la scala di un blocco annidato dimentica quella del blocco che lo contiene",
   "ingrandisce=scala*Math.max(Math.abs(sx), Math.abs(sy));", "ingrandisce=Math.max(Math.abs(sx), Math.abs(sy));"],
  ["la schiera si riduce a una copia",
   "const colonne = passoC ? Math.max(1, parseInt(e.campi['70'],10)||1) : 1,", "const colonne = 1,"],
  ["il passo della schiera viene scalato col blocco",
   "const u=(p.x-b.bx)*sx + ox, v=(p.y-b.by)*sy + oy;", "const u=(p.x-b.bx+ox)*sx, v=(p.y-b.by+oy)*sy;"],
  ["gli attributi di un blocco espanso spariscono senza essere contati",
   "if(appesa===2 && !((parseInt(e.campi['70'],10)||0)&1)) nonLetta('ATTRIB');", ""],
  ["un riferimento esterno passa per un blocco vuoto, espanso",
   "esterno:!!(f&(4|8))", "esterno:false"],
  ["i nomi dei blocchi distinguono maiuscole e minuscole",
   "const nome = String(e.campi['2']||'').trim().toUpperCase(), b = st.blocchi[nome];", "const nome = String(e.campi['2']||'').trim(), b = st.blocchi[nome.toUpperCase()===nome ? nome : '?'];"],
  ["i blocchi espansi non si contano",
   "if(!catena.length) esito.blocchiEspansi++;", ""],
  ["si contano fra gli espansi anche i blocchi annidati",
   "if(!catena.length) esito.blocchiEspansi++;", "esito.blocchiEspansi++;"],
];

async function moduloCon(sostituzioni) {
  /* una copia del modulo in una cartella temporanea, con gli import relativi
     riscritti ad assoluti: il file di prodotto non si tocca (le pagine se lo
     caricano, e un giro del browser potrebbe essere in corso) */
  let s = readFileSync(MODULO, "utf8");
  const colpite = [];
  for (const [nome, da, a] of sostituzioni) { if (s.includes(da)) { colpite.push(nome); s = s.split(da).join(a); } }
  s = s.replace(/from '(\.\.?\/[^']+)'/g, (_, rel) => "from '" + pathToFileURL(join(dirname(MODULO), rel)).href + "'");
  const dir = mkdtempSync(join(tmpdir(), "dxf-da-cad-"));
  const f = join(dir, "genesi-data.mjs");
  writeFileSync(f, s);
  try { return { mod: await import(pathToFileURL(f).href), colpite }; }
  finally { rmSync(dir, { recursive: true, force: true }); }
}

if (CONTROPROVA) {
  console.log("⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO — i difetti di prima rimessi uno alla volta, in memoria");
  let distinti = 0;
  for (const d of DIFETTI) {
    const { mod, colpite } = await moduloCon([d]);
    if (!colpite.length) { console.log(`  ⛔ «${d[0]}»: l'iniezione NON trova più il suo pezzo nel modulo (scaduta)`); continue; }
    const caduti = Object.keys(verita).filter((n) => giudica(mod, n).length);
    if (caduti.length) { distinti++; console.log(`  ✔ «${d[0]}» → cadono ${caduti.length}: ${caduti.join(", ")}`); }
    else console.log(`  ⛔ «${d[0]}»: NESSUN campione cade — la suite non lo distingue`);
  }
  console.log(distinti === DIFETTI.length
    ? `✔ CONTROPROVA OK: ${distinti} difetti su ${DIFETTI.length} fanno cadere almeno un campione`
    : `⛔ CONTROPROVA FALLITA: solo ${distinti} difetti su ${DIFETTI.length} vengono visti`);
  console.log("FINE CONTROPROVA");
  console.log(`\nRisultato controprova DXF da CAD: ${distinti} passati, ${DIFETTI.length - distinti} falliti`);
  process.exit(distinti === DIFETTI.length ? 0 : 1);
}

const genesi = await import(pathToFileURL(MODULO).href);

/* il denominatore: campioni sul disco e verità dichiarate devono essere gli stessi */
const conVerita = Object.keys(verita).sort();
dice(JSON.stringify(sulDisco) === JSON.stringify(conVerita),
  `ogni campione ha la sua verità e viceversa (${sulDisco.length} file .dxf, ${conVerita.length} verità)`,
  "solo sul disco: " + sulDisco.filter((n) => !verita[n]).join(", ") + " · solo in verita.json: " + conVerita.filter((n) => !sulDisco.includes(n)).join(", "));
dice(sulDisco.length >= 40, `i campioni ci sono tutti (${sulDisco.length}, almeno 40)`);

for (const nome of conVerita) {
  if (!sulDisco.includes(nome)) continue;
  const guai = giudica(genesi, nome);
  dice(guai.length === 0, `${nome}: letto come lo ha scritto il CAD`, guai.join("\n      ") + "\n      (" + verita[nome].nota + ")");
}

/* la frase che arriva all'utente, sul campione che la mette più alla prova */
const miste = genesi.dxfLeggi(testoDi("curve_miste"));
dice(genesi.dxfFraseNonLette(miste.nonLette) === "1 curva spline, 1 punto" && miste.archiSpezzati === 3,
  "curve_miste: i due archi e il cerchio sono entrati (3 archi resi a spezzata), e la frase dice che cosa è rimasto fuori — la spline e il punto — con le parole di chi disegna", genesi.dxfFraseNonLette(miste.nonLette) + " · archi " + miste.archiSpezzati);

console.log(`\nRisultato DXF da CAD: ${passed} passati, ${failed} falliti  ·  ${sulDisco.length} campioni scritti da ezdxf guardati`);
process.exit(failed > 0 ? 1 : 0);

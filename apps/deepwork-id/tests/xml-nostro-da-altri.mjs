/* IL PIANO D'INNESCO XML CHE GENESI SCRIVE, LETTO DA UN ALTRO PARSER
   ───────────────────────────────────────────────────────────────────────
   Uso:  node apps/deepwork-id/tests/xml-nostro-da-altri.mjs [--controprova] [--dimmi]

   PERCHÉ ESISTE. Il piano d'innesco (`xmlPianoInnesco`, in
   apps/genesi/genesi-data.js) è il file che legge chi programma i detonatori
   e chi perfora. Fino al 27/11 lo rileggeva solo Genesi, col parser del
   browser, su progetti dai nomi puliti. Fatto leggere a un parser severo che
   non è il nostro (expat, dalla libreria standard di Python), con nomi come
   arrivano da un file importato: un CARATTERE DI CONTROLLO dentro il nome
   dell'esplosivo rendeva l'intero piano «non ben formato» — il parser si
   fermava alla riga 9 e del file non si leggeva niente; e mezzo carattere (un
   surrogato rimasto solo) faceva crollare l'esportazione nel browser.

   COME FUNZIONA, senza Python nella suite. In `campioni/xml-nostro/`:
     · `casi.mjs`   gli INGRESSI di ogni caso;
     · `scrivi.mjs` ne fa i `.xml` col codice di prodotto;
     · `leggi.py`   li fa leggere a expat e scrive `letto-da-python.json`.
   I `.xml` e la lettura sono committati. La suite pretende:
     1. che ogni `.xml` committato sia, byte per byte, quello che Genesi scrive
        ADESSO per lo stesso caso — se no la lettura parla di un file che non
        esiste più, e va rifatta (`scrivi.mjs` + `leggi.py`);
     2. che ciò che il parser ha letto sia ciò che gli ingressi dicono, con un
        conto di questa suite: ben formato; la codifica dichiarata è quella
        dei byte; i nomi tornano come sono stati scritti (i caratteri che
        l'XML non ammette, uno spazio); ogni numero del progetto e di ogni
        foro è quello dell'ingresso — il valore del foro se ne ha uno suo, se
        no quello del progetto; un valore che non si legge è un elemento
        VUOTO con `status="non-calcolabile"`, mai uno zero, e uno zero scritto
        resta uno zero; ogni numero è scritto come lo legge una macchina
        (punto decimale, niente «NaN», «null», «undefined»); e quando manca
        qualcosa, il commento che lo dichiara c'è.
   E il denominatore: casi, file sul disco e letture devono essere gli stessi.

   ⚠️ CHE COSA NON DICE. Non c'è uno schema pubblico contro cui validare:
   il file è una bozza «in stile IREDES», dichiarata tale nel file stesso.
   Qui si prova che è XML che un parser severo legge e che dice i numeri
   giusti, non che un programma di terzi lo accetti.

   LA CONTROPROVA ha due metà: i difetti rimessi nel MODULO in memoria (ognuno
   deve far cadere il punto 1) e la LETTURA guastata in memoria, un guasto alla
   volta (ognuno deve far cadere il punto 2). */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { CASI } from "./campioni/xml-nostro/casi.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..");
const CAMPIONI = join(QUI, "campioni", "xml-nostro");
const MODULO = join(R, "apps", "genesi", "genesi-data.js");
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

const LETTO = JSON.parse(readFileSync(join(CAMPIONI, "letto-da-python.json"), "utf8"));
const sulDisco = readdirSync(CAMPIONI).filter((f) => f.endsWith(".xml")).map((f) => f.slice(0, -4)).sort();
const NS = "{urn:genesi:blastplan:draft}";
const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(+v)) ? null : +v;
/* il nome come deve tornare: ciò che l'XML 1.0 non ammette è uno spazio, mezzo carattere è il segnaposto */
const nomeAtteso = (s) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, " ")
  .replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, "�");
const CAMPI = ["kg", "prof", "stem", "diam", "incl"];
const suo = (h, c) => { const v = num(h[c]); return v === null ? null : (c === "prof" || c === "diam" ? (v > 0 ? v : null) : (v >= 0 ? v : null)); };
const NUMERO = /^-?\d+(\.\d+)?$/;

function giudicaLettura(nome, r) {
  const guai = [], p = CASI[nome].piano, H = Array.isArray(p.fori) ? p.fori : [];
  if (!r) return ["nessuna lettura per questo caso"];
  if (!r.ben_formato) return ["il parser si ferma: NON è XML ben formato — " + (r.errore || "")];
  if (!r.byte_utf8) guai.push("i byte del file non sono UTF-8");
  if (!r.dichiarazione || String(r.dichiarazione.codifica).toUpperCase() !== "UTF-8" || r.dichiarazione.versione !== "1.0") guai.push("la dichiarazione non dice XML 1.0 in UTF-8: " + JSON.stringify(r.dichiarazione));
  const rad = r.radice;
  if (rad.tag !== NS + "BlastPlan") guai.push("la radice è " + rad.tag);
  const figli = (e) => Object.fromEntries((e.figli || []).map((c) => [c.tag.replace(NS, ""), c]));
  const nomiFigli = (e) => (e.figli || []).map((c) => c.tag.replace(NS, ""));
  if ((rad.figli || []).some((c) => !c.tag.startsWith(NS))) guai.push("un elemento fuori dallo spazio dei nomi del piano");
  const P = figli(rad).PlanData, Hs = figli(rad).Holes;
  if (!P || !Hs) return guai.concat(["mancano PlanData o Holes"]);
  const D = figli(P);
  /* un numero: o è quello dell'ingresso, o è un elemento vuoto col suo stato */
  const numero = (e, atteso, dove, dec) => {
    if (!e) { guai.push(dove + ": l'elemento non c'è"); return; }
    if (atteso === null) {
      if (e.testo !== null || e.attr.status !== "non-calcolabile") guai.push(`${dove}: il valore non è leggibile e doveva uscire VUOTO con status="non-calcolabile" — esce «${e.testo}» ${JSON.stringify(e.attr)}`);
      return;
    }
    if (e.attr.status) guai.push(`${dove}: porta status="${e.attr.status}" ma il valore c'è`);
    if (e.testo === null || !NUMERO.test(e.testo)) { guai.push(`${dove}: «${e.testo}» non è un numero che una macchina legge`); return; }
    const scritto = dec == null ? atteso : +atteso.toFixed(dec);
    if (Math.abs(+e.testo - scritto) > 1e-9) guai.push(`${dove}: nel file ${e.testo}, nell'ingresso ${atteso}`);
  };
  numero(D.MeshBurden, num(p.B), "MeshBurden", 2); numero(D.MeshSpacing, num(p.S), "MeshSpacing", 2); numero(D.HoleDiameter, num(p.diam), "HoleDiameter");
  const propri = H.filter((h) => CAMPI.some((c) => suo(h, c) !== null)).length, inclDeiFori = H.some((h) => suo(h, "incl") !== null);
  if (num(p.incl) !== null || inclDeiFori) numero(D.HoleInclination, num(p.incl), "HoleInclination");
  else if (D.HoleInclination) guai.push("HoleInclination compare, ma l'ingresso non dichiara un'inclinazione");
  if (!D.Explosive || D.Explosive.testo !== nomeAtteso(p.esplosivo)) guai.push(`l'esplosivo si legge «${D.Explosive && D.Explosive.testo}» invece di «${nomeAtteso(p.esplosivo)}»`);
  const inn = p.innesco || {};
  if (!D.Initiation || D.Initiation.attr.id !== nomeAtteso(inn.id) || D.Initiation.testo !== nomeAtteso(inn.nome)) guai.push(`l'innesco si legge id «${D.Initiation && D.Initiation.attr.id}» nome «${D.Initiation && D.Initiation.testo}» invece di «${nomeAtteso(inn.id)}» / «${nomeAtteso(inn.nome)}»`);
  if (!D.Sequence || D.Sequence.testo !== nomeAtteso(p.sequenza || "diagonale")) guai.push(`la sequenza si legge «${D.Sequence && D.Sequence.testo}»`);
  numero(D.HoleDelay, +p.ritardo || 0, "HoleDelay"); numero(D.RowDelay, +p.ritardoFila || 0, "RowDelay"); numero(D.LastDetonation, +p.lastDet || 0, "LastDetonation", 1);
  const mic = num(p.mic) !== null && +p.mic >= 0 ? +p.mic : null;
  numero(D.MaxInstantCharge, mic, "MaxInstantCharge", 1);
  /* i valori del progetto dichiarati a parte: solo quando qualche foro ne ha di suoi */
  if (propri > 0) {
    numero(D.DesignDepth, num(p.prof), "DesignDepth"); numero(D.DesignCharge, num(p.kg), "DesignCharge"); numero(D.DesignStemming, num(p.stem), "DesignStemming");
    if (!D.HolesWithOwnValues || D.HolesWithOwnValues.testo !== String(propri)) guai.push(`HolesWithOwnValues dice «${D.HolesWithOwnValues && D.HolesWithOwnValues.testo}», i fori con valori loro sono ${propri}`);
  } else if (D.DesignDepth || D.DesignCharge || D.DesignStemming || D.HolesWithOwnValues) guai.push("NEUTRALITÀ: nessun foro ha valori suoi, ma il file porta Design… o HolesWithOwnValues");
  /* i fori */
  const fori = (Hs.figli || []);
  if (Hs.attr.count !== String(H.length) || fori.length !== H.length) guai.push(`fori: count="${Hs.attr.count}", ${fori.length} elementi Hole, ${H.length} nell'ingresso`);
  H.forEach((h, i) => {
    const e = fori[i]; if (!e) return; const F = figli(e), dove = "foro " + (i + 1);
    if (e.attr.seq !== String(i + 1)) guai.push(`${dove}: seq="${e.attr.seq}"`);
    if (!F.Position || Math.abs(+F.Position.attr.x - +(+h.mx).toFixed(2)) > 1e-9 || Math.abs(+F.Position.attr.y - +(+h.my).toFixed(2)) > 1e-9 || !NUMERO.test(F.Position.attr.x) || !NUMERO.test(F.Position.attr.y)) guai.push(`${dove}: posizione ${F.Position && JSON.stringify(F.Position.attr)}, nell'ingresso (${h.mx}, ${h.my})`);
    const vale = (c) => suo(h, c) !== null ? suo(h, c) : num(p[c]);
    numero(F.Depth, vale("prof"), dove + " · Depth"); numero(F.Charge, vale("kg"), dove + " · Charge"); numero(F.Stemming, vale("stem"), dove + " · Stemming");
    if (suo(h, "diam") !== null) numero(F.HoleDiameter, suo(h, "diam"), dove + " · HoleDiameter"); else if (F.HoleDiameter) guai.push(`${dove}: porta un diametro, ma non ne ha uno suo`);
    if (suo(h, "incl") !== null) numero(F.Inclination, suo(h, "incl"), dove + " · Inclination"); else if (F.Inclination) guai.push(`${dove}: porta un'inclinazione, ma non ne ha una sua`);
    numero(F.Delay, num(h.tDet) === null ? 0 : +h.tDet, dove + " · Delay", 1);
    const ignoti = nomiFigli(e).filter((t) => !["Position", "Depth", "Charge", "Stemming", "HoleDiameter", "Inclination", "Delay"].includes(t));
    if (ignoti.length) guai.push(`${dove}: elementi non previsti: ${ignoti.join(", ")}`);
  });
  /* e quando manca qualcosa, il commento che lo dichiara */
  const C = (r.commenti || []).join(" · ");
  if (mic === null && !/MIC.*NON e' calcolabile/.test(C)) guai.push("la MIC non è calcolabile ma nessun commento lo dichiara");
  if (mic !== null && /MIC.*NON e' calcolabile/.test(C)) guai.push("un commento dichiara la MIC non calcolabile, ma c'è");
  const mancanti = ["B", "S", "diam", "prof", "kg", "stem"].filter((k) => num(p[k]) === null).length;
  if (mancanti && !new RegExp("ATTENZIONE: " + mancanti + " valori del progetto NON sono leggibili").test(C)) guai.push(`${mancanti} valori del progetto non sono leggibili ma il commento non lo dice (o dice un altro numero)`);
  if (!mancanti && /valori del progetto NON sono leggibili/.test(C)) guai.push("un commento dichiara valori illeggibili che non ci sono");
  return guai;
}

function giudicaFile(genesi, nome) {
  const guai = [];
  let sulDiscoB; try { sulDiscoB = readFileSync(join(CAMPIONI, nome + ".xml")); } catch (e) { return ["il file .xml non è sul disco"]; }
  let adesso; try { adesso = genesi.xmlPianoInnesco(CASI[nome].piano); } catch (e) { return ["xmlPianoInnesco crolla: " + e.message]; }
  if (Buffer.from(adesso, "utf8").compare(sulDiscoB) !== 0) {
    const a = adesso.split("\n"), b = sulDiscoB.toString("utf8").split("\n"); let i = 0; while (i < a.length && a[i] === b[i]) i++;
    guai.push(`il file che il parser ha letto NON è più quello che Genesi scrive (prima riga diversa: la ${i + 1}, «${String(b[i]).slice(0, 50)}» sul disco, «${String(a[i]).slice(0, 50)}» adesso) — rifare scrivi.mjs e leggi.py`);
  }
  /* come lo esporta la pagina: `encodeURIComponent` su mezzo carattere solleva */
  try { encodeURIComponent(adesso); } catch (e) { guai.push("l'esportazione nel browser crollerebbe: " + e.message); }
  return guai;
}

const DIFETTI = [
  ["i caratteri di controllo escono nel file (il piano non è più XML)",
   ".replace(/[\\u0000-\\u0008\\u000b\\u000c\\u000e-\\u001f\\ufffe\\uffff]/g,' ')", ""],
  ["mezzo carattere esce com'è (l'esportazione crolla)",
   ".replace(/[\\ud800-\\udbff](?![\\udc00-\\udfff])|(?<![\\ud800-\\udbff])[\\udc00-\\udfff]/g,'\\ufffd')", ""],
  ["la & non si protegge",
   "'&':'&amp;',", "'&':'&',"],
  ["ogni foro esce coi valori del progetto",
   "const _inclNota=_num(p&&p.incl)!==null, _inclDeiFori=contaValoriPropri((p&&p.fori)||[]).incl>0;", "p = { ...p, fori: (p.fori||[]).map((h)=>({ mx:h.mx, my:h.my, tDet:h.tDet })) }; const _inclNota=_num(p&&p.incl)!==null, _inclDeiFori=false;"],
  ["un valore illeggibile esce zero",
   "const _num=(x)=>{ const v=(x===null||x===undefined||x==='')?NaN:+x; return Number.isFinite(v)?v:null; };", "const _num=(x)=>{ const v=+x; return Number.isFinite(v)?v:0; };"],
  ["la MIC non calcolabile esce 0.0",
   ": '    <MaxInstantCharge unit=\"kg\" window_ms=\"8\" status=\"non-calcolabile\"/>\\n';", ": '    <MaxInstantCharge unit=\"kg\" window_ms=\"8\">0.0</MaxInstantCharge>\\n';"],
];
const copia = (x) => JSON.parse(JSON.stringify(x));
const piano = (r) => r.radice.figli.find((c) => c.tag === NS + "PlanData");
const el = (r, t) => piano(r).figli.find((c) => c.tag === NS + t);
const foro = (r, i) => r.radice.figli.find((c) => c.tag === NS + "Holes").figli[i];
const delForo = (r, i, t) => foro(r, i).figli.find((c) => c.tag === NS + t);
const GUASTI = [
  ["il parser si ferma (non ben formato)", "liscio", (r) => { r.ben_formato = false; r.errore = "not well-formed (invalid token): line 9, column 19"; }],
  ["la codifica dichiarata non è quella dei byte", "liscio", (r) => { r.dichiarazione.codifica = "ISO-8859-1"; }],
  ["il nome dell'esplosivo torna storpiato", "nomi_difficili", (r) => { el(r, "Explosive").testo = "Emulsione Â«E&XÂ»"; }],
  ["l'id dell'innesco perde un carattere", "nomi_difficili", (r) => { el(r, "Initiation").attr.id = "ab\"c"; }],
  ["un foro scarico esce con la carica del progetto", "per_foro", (r) => { delForo(r, 1, "Charge").testo = "58"; }],
  ["un borraggio corto esce con quello del progetto", "per_foro", (r) => { delForo(r, 2, "Stemming").testo = "2.2"; }],
  ["un foro guadagna un'inclinazione che non ha", "per_foro", (r) => { foro(r, 0).figli.push({ tag: NS + "Inclination", attr: { unit: "deg" }, testo: "10", figli: [] }); }],
  ["il conto dei fori con valori loro è sbagliato", "per_foro", (r) => { el(r, "HolesWithOwnValues").testo = "3"; }],
  ["i valori del progetto compaiono senza fori diversi (neutralità)", "liscio", (r) => { piano(r).figli.push({ tag: NS + "DesignCharge", attr: { unit: "kg" }, testo: "58", figli: [] }); }],
  ["l'inclinazione compare senza che l'ingresso la dichiari", "senza_inclinazione", (r) => { piano(r).figli.push({ tag: NS + "HoleInclination", attr: { unit: "deg" }, testo: "0", figli: [] }); }],
  ["una carica illeggibile esce zero", "illeggibile", (r) => { const c = delForo(r, 0, "Charge"); c.testo = "0"; delete c.attr.status; }],
  ["la MIC non calcolabile esce 0.0", "illeggibile", (r) => { const m = el(r, "MaxInstantCharge"); m.testo = "0.0"; delete m.attr.status; }],
  ["il commento sulla MIC manca", "illeggibile", (r) => { r.commenti = r.commenti.filter((c) => !/MIC/.test(c)); }],
  ["il commento conta male i valori illeggibili", "illeggibile", (r) => { r.commenti = r.commenti.map((c) => c.replace("2 valori", "1 valori")); }],
  ["uno zero scritto diventa «non calcolabile»", "zero_scritto", (r) => { const m = el(r, "MaxInstantCharge"); m.testo = null; m.attr.status = "non-calcolabile"; }],
  ["un numero scritto con la virgola", "liscio", (r) => { el(r, "MeshBurden").testo = "3,00"; }],
  ["un numero che è la parola NaN", "liscio", (r) => { delForo(r, 0, "Delay").testo = "NaN"; }],
  ["un foro in meno dell'ingresso", "liscio", (r) => { r.radice.figli.find((c) => c.tag === NS + "Holes").figli.pop(); }],
  ["la posizione di un foro spostata di un centimetro", "liscio", (r) => { delForo(r, 2, "Position").attr.x = "7.01"; }],
  ["la radice in un altro spazio dei nomi", "liscio", (r) => { r.radice.tag = "BlastPlan"; }],
];

async function moduloCon(sostituzioni) {
  let s = readFileSync(MODULO, "utf8");
  const colpite = [];
  for (const [nome, da, a] of sostituzioni) { if (s.includes(da)) { colpite.push(nome); s = s.split(da).join(a); } }
  s = s.replace(/from '(\.\.?\/[^']+)'/g, (_, rel) => "from '" + pathToFileURL(join(dirname(MODULO), rel)).href + "'");
  const dir = mkdtempSync(join(tmpdir(), "xml-nostro-"));
  const f = join(dir, "genesi-data.mjs");
  writeFileSync(f, s);
  try { return { mod: await import(pathToFileURL(f).href), colpite }; }
  finally { rmSync(dir, { recursive: true, force: true }); }
}

const nomiCasi = Object.keys(CASI).sort();

if (CONTROPROVA) {
  console.log("⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO — difetti rimessi nel modulo e letture guastate, uno alla volta, in memoria");
  let visti = 0;
  for (const d of DIFETTI) {
    const { mod, colpite } = await moduloCon([d]);
    if (!colpite.length) { console.log(`  ⛔ «${d[0]}»: l'iniezione NON trova più il suo pezzo nel modulo (scaduta)`); continue; }
    const caduti = nomiCasi.filter((n) => giudicaFile(mod, n).length);
    if (caduti.length) { visti++; console.log(`  ✔ modulo · «${d[0]}» → il file non è più quello letto in ${caduti.length}: ${caduti.join(", ")}`); }
    else console.log(`  ⛔ modulo · «${d[0]}»: NESSUN caso cade — la suite non lo distingue`);
  }
  for (const [nome, caso, guasta] of GUASTI) {
    const r = copia(LETTO[caso]); guasta(r);
    const guai = giudicaLettura(caso, r);
    if (guai.length) { visti++; console.log(`  ✔ lettura · «${nome}» (${caso}) → ${guai[0].slice(0, 120)}`); }
    else console.log(`  ⛔ lettura · «${nome}» (${caso}): il giudizio NON se ne accorge`);
  }
  const tot = DIFETTI.length + GUASTI.length;
  console.log(visti === tot ? `✔ CONTROPROVA OK: ${visti} su ${tot} (${DIFETTI.length} difetti nel modulo, ${GUASTI.length} letture guastate) vengono visti`
    : `⛔ CONTROPROVA FALLITA: solo ${visti} su ${tot} vengono visti`);
  console.log("FINE CONTROPROVA");
  console.log(`\nRisultato controprova XML nostro letto da altri: ${visti} passati, ${tot - visti} falliti`);
  process.exit(visti === tot ? 0 : 1);
}

let passed = 0, failed = 0;
const dice = (c, t, x) => { if (c) { passed++; console.log(`  ✓ ${t}`); } else { failed++; console.log(`  ✗ ${t}${x ? "\n      " + x : ""}`); } };
const genesi = await import(pathToFileURL(MODULO).href);

const conLettura = Object.keys(LETTO).filter((k) => !k.startsWith("_")).sort();
dice(JSON.stringify(sulDisco) === JSON.stringify(nomiCasi) && JSON.stringify(conLettura) === JSON.stringify(nomiCasi),
  `ogni caso ha il suo piano e la sua lettura, e viceversa (${nomiCasi.length} casi, ${sulDisco.length} file .xml, ${conLettura.length} letture di ${LETTO._parser || "?"})`,
  `casi: ${nomiCasi.join(", ")} · sul disco: ${sulDisco.join(", ")} · letti: ${conLettura.join(", ")}`);
dice(nomiCasi.length >= 9, `i casi ci sono tutti (${nomiCasi.length}, almeno 9)`);

let fori = 0;
for (const nome of nomiCasi) {
  const gf = giudicaFile(genesi, nome);
  dice(gf.length === 0, `${nome}: il piano letto dal parser è quello che Genesi scrive adesso, e il browser lo esporta`, gf.join("\n      "));
  const gl = giudicaLettura(nome, LETTO[nome]);
  fori += (CASI[nome].piano.fori || []).length;
  dice(gl.length === 0, `${nome}: è XML ben formato e dice quello che gli ingressi dicono`, gl.join("\n      ") + "\n      (" + CASI[nome].nota + ")");
  if (DIMMI) console.log(`      ${CASI[nome].nota}`);
}
/* il caso che ha fatto nascere questa suite, detto per esteso */
const ctrl = LETTO.caratteri_di_controllo;
dice(ctrl.ben_formato && piano(ctrl) && el(ctrl, "Explosive").testo === "ANFO   con un carattere di controllo",
  "⛔ caratteri_di_controllo: il piano si LEGGE (prima il parser si fermava alla riga dell'esplosivo), e i due caratteri che l'XML non ammette sono due spazi",
  JSON.stringify(ctrl.ben_formato ? el(ctrl, "Explosive").testo : ctrl.errore));

console.log(`\nRisultato XML nostro letto da altri: ${passed} passati, ${failed} falliti  ·  ${nomiCasi.length} piani scritti da Genesi e letti da ${LETTO._parser || "?"}, ${fori} fori guardati`);
process.exit(failed > 0 ? 1 : 0);

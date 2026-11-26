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
   maglia, entità specchiate, unità dichiarate, DXF binario.
   La prima misura, sul lettore com'era: **9 file su 23 letti male**, tutti in
   silenzio e tutti con una geometria plausibile — simboli comparsi attorno
   all'origine, il cartiglio letto come terreno, i contorni chiusi arrivati
   aperti. Nessuna delle prove esistenti poteva vederlo.

   CHE COSA PRETENDE, per ogni campione (da `verita.json`, scritto dal
   generatore e non da questa suite):
     · quanti tratti entrano, e con quali punti in coordinate mondo;
     · che cosa viene DICHIARATO come non letto (`nonLette`, `spazioCarta`,
       `archiComeCorde`, `binario`, `unita`): ciò che non entra si conta.
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
  const nl = att.nonLette || {};
  if (JSON.stringify(Object.entries(r.nonLette).sort()) !== JSON.stringify(Object.entries(nl).sort()))
    guai.push("non lette: dichiarate " + JSON.stringify(r.nonLette) + ", nel disegno " + JSON.stringify(nl));
  if (r.spazioCarta !== (att.spazioCarta || 0)) guai.push(`spazio carta: dichiarate ${r.spazioCarta}, sono ${att.spazioCarta || 0}`);
  if (r.archiComeCorde !== (att.archiComeCorde || 0)) guai.push(`archi come corde: dichiarati ${r.archiComeCorde}, sono ${att.archiComeCorde || 0}`);
  if (r.binario !== !!att.binario) guai.push(`binario: dichiarato ${r.binario}, è ${!!att.binario}`);
  if (att.unita && (!r.unita || r.unita.nome !== att.unita)) guai.push(`unità: dichiarata ${r.unita && r.unita.nome}, il file dice ${att.unita}`);
  if (att.larghezza != null && (!r.ingombro || !vicino(r.ingombro.larghezza, att.larghezza))) guai.push(`ingombro: ${r.ingombro && r.ingombro.larghezza}, atteso ${att.larghezza}`);
  return guai;
}

let passed = 0, failed = 0;
const dice = (c, m, extra) => { if (c) { passed++; if (DIMMI) console.log("  ✓ " + m); } else { failed++; console.log("  ✗ " + m + (extra ? "\n      " + extra : "")); } };

/* ───────── la controprova: i difetti di prima, uno alla volta ───────── */
const DIFETTI = [
  ["si leggono anche le definizioni dei blocchi e gli altri fogli",
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
  ["gli archi diventano corde senza dirlo",
   "esito.archiComeCorde += buoni.filter((p,i)=>p.arco && (chiusa || i<buoni.length-1)).length;", ""],
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
dice(sulDisco.length >= 23, `i campioni ci sono tutti (${sulDisco.length}, almeno 23)`);

for (const nome of conVerita) {
  if (!sulDisco.includes(nome)) continue;
  const guai = giudica(genesi, nome);
  dice(guai.length === 0, `${nome}: letto come lo ha scritto il CAD`, guai.join("\n      ") + "\n      (" + verita[nome].nota + ")");
}

/* la frase che arriva all'utente, sul campione che la mette più alla prova */
const miste = genesi.dxfLeggi(testoDi("curve_miste"));
dice(genesi.dxfFraseNonLette(miste.nonLette) === "2 archi, 1 cerchio, 1 curva spline, 1 punto",
  "curve_miste: la frase dice che cosa è rimasto fuori, con le parole di chi disegna", genesi.dxfFraseNonLette(miste.nonLette));

console.log(`\nRisultato DXF da CAD: ${passed} passati, ${failed} falliti  ·  ${sulDisco.length} campioni scritti da ezdxf guardati`);
process.exit(failed > 0 ? 1 : 0);

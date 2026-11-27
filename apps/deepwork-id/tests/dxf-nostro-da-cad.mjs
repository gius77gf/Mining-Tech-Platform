/* IL DISEGNO DXF CHE GENESI SCRIVE, LETTO DA UN ALTRO PROGRAMMA
   ───────────────────────────────────────────────────────────────────────
   Uso:  node apps/deepwork-id/tests/dxf-nostro-da-cad.mjs [--controprova] [--dimmi]

   PERCHÉ ESISTE. `dxf-da-cad.mjs` prova il LETTORE di Genesi con disegni
   scritti da `ezdxf`. Questa è l'altra metà: lo SCRITTORE (`dxfPianoFori`, in
   apps/genesi/genesi-data.js) provato facendo leggere i suoi disegni a
   `ezdxf`. Fino al 27/11 il nostro DXF era riletto solo da noi — e il nostro
   lettore i TESTI non li legge, quindi sui nomi dei fori l'andata e ritorno
   non poteva dire niente. La prima lettura fatta da un altro ha trovato due
   cose: un nome con un accento arrivava storpiato («Foro n°1» → «Foro nÂ°1»,
   perché il file esce in UTF-8 e un DXF di questa forma si legge in
   Windows-1252), e un foro senza nome lasciava nel disegno un testo vuoto.

   COME FUNZIONA, senza Python nella suite. In `campioni/dxf-nostro/`:
     · `casi.mjs`   gli INGRESSI (fori, diametro, fronte, progetto) di ogni caso;
     · `scrivi.mjs` ne fa i `.dxf` col codice di prodotto;
     · `leggi.py`   li fa leggere a ezdxf e scrive `letto-da-ezdxf.json`.
   I `.dxf` e la lettura sono committati. La suite pretende due cose:
     1. che ogni `.dxf` committato sia, byte per byte, quello che Genesi scrive
        ADESSO per lo stesso caso — se no la lettura di ezdxf parla di un file
        che non esiste più, e va rifatta (`scrivi.mjs` + `leggi.py`);
     2. che ciò che ezdxf ha letto sia ciò che gli ingressi dicono. L'atteso
        lo ricava questa suite DAGLI INGRESSI, con un conto suo (il piede è
        lunghezza × seno dell'inclinazione, scritto qui e non preso dal
        modulo): un cerchio per foro valido nel punto giusto e col raggio
        giusto (il suo, se il foro ha un diametro suo); il nome che un CAD
        mette a schermo uguale al nome del foro; nessun testo vuoto; un piede
        per foro inclinato, verso la faccia; il fronte com'è, aperto; nient'altro.
     E in più: ezdxf lo apre col lettore normale (non con quello di recupero),
     la sua verifica non trova errori né correzioni, e il file è ASCII puro —
     così non dipende dalla codifica di chi lo apre.
   E il denominatore: casi, file sul disco e letture devono essere gli stessi.

   ⚠️ CHE COSA NON DICE. ezdxf è la libreria di riferimento per il formato, non
   è AutoCAD: che un CAD commerciale mostri `\U+XXXX` come il carattere giusto è
   la regola del formato e il comportamento di ezdxf (che scrive quella stessa
   forma quando la codifica del file non basta), ma qui nessun CAD commerciale
   è stato aperto.

   LA CONTROPROVA ha due metà, e servono tutt'e due:
     · i difetti rimessi nel MODULO, in memoria, uno alla volta: ognuno deve
       far cadere il punto 1 su almeno un caso (il file non è più quello letto);
     · la LETTURA guastata in memoria, un guasto alla volta (un cerchio
       spostato, un nome storpiato, un piede dalla parte sbagliata…): ognuno
       deve far cadere il punto 2. Senza questa metà il punto 2 potrebbe
       essere un elenco di asserzioni che non sanno fallire. */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { CASI } from "./campioni/dxf-nostro/casi.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..");
const CAMPIONI = join(QUI, "campioni", "dxf-nostro");
const MODULO = join(R, "apps", "genesi", "genesi-data.js");
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

const LETTO = JSON.parse(readFileSync(join(CAMPIONI, "letto-da-ezdxf.json"), "utf8"));
const sulDisco = readdirSync(CAMPIONI).filter((f) => f.endsWith(".dxf")).map((f) => f.slice(0, -4)).sort();
const TOL = 0.0006;                                   // il file porta tre decimali: mezzo millimetro, più un pelo
const vicino = (a, b) => Math.abs(a - b) <= TOL;
const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(+v)) ? null : +v;

/* ───────── l'atteso, ricavato dagli INGRESSI con un conto di questa suite ───────── */
function atteso(c) {
  const fori = (Array.isArray(c.fori) ? c.fori : []).filter((h) => h && num(h.mx) !== null && num(h.my) !== null);
  const P = c.progetto || null;
  const cerchi = fori.map((h) => ({ c: [+h.mx, +h.my], r: (num(h.diam) !== null && +h.diam > 0 ? +h.diam : c.diam) / 2000 }));
  /* il nome come deve leggerlo chi apre il disegno: i caratteri di controllo
     sono spazi, un carattere fuori dal piano di base è «?»; un nome vuoto o di
     soli spazi non è un nome */
  const nomi = fori.map((h, i) => ({ i, nome: String(h.id == null ? "" : h.id).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/[\ud800-\udbff][\udc00-\udfff]/g, "?") }))
    .filter((x) => x.nome.trim() !== "");
  const piedi = [];
  if (P) for (const h of fori) {
    const L = num(h.prof) !== null ? +h.prof : num(P.prof), a = num(h.incl) !== null ? +h.incl : num(P.incl);
    if (L === null || a === null) continue;
    const avanti = L * Math.sin(a * Math.PI / 180);
    if (avanti > 0) piedi.push([[+h.mx, +h.my], [+h.mx, +h.my - avanti]]);
  }
  const fr = (Array.isArray(c.profilo) ? c.profilo : []).filter((p) => p && num(p.x) !== null && num(p.y) !== null).map((p) => [+p.x, +p.y]);
  return { cerchi, nomi, piedi, fronte: fr.length >= 2 ? fr : null };
}

/* ───────── il giudizio su UNA lettura di ezdxf ───────── */
function giudicaLettura(nome, r) {
  const guai = [], A = atteso(CASI[nome]);
  if (!r) return ["nessuna lettura di ezdxf per questo caso"];
  if (r.lettore !== "normale") guai.push(`ezdxf l'ha aperto solo col lettore di ${r.lettore}: ${r.errore_lettore_normale || ""}`);
  if ((r.verifica_errori || []).length) guai.push("la verifica di ezdxf trova errori: " + r.verifica_errori.join(" · "));
  if ((r.verifica_correzioni || []).length) guai.push("la verifica di ezdxf ha dovuto correggere: " + r.verifica_correzioni.join(" · "));
  const E = r.entita || [];
  const altri = E.filter((e) => !["FORI", "PIEDI", "FRONTE"].includes(e.livello));
  if (altri.length) guai.push(`${altri.length} entità su un livello che non è FORI, PIEDI o FRONTE: ${altri.map((e) => e.t + "@" + e.livello).join(", ")}`);
  const cerchi = E.filter((e) => e.t === "CIRCLE"), testi = E.filter((e) => e.t === "TEXT"), poli = E.filter((e) => e.t === "POLYLINE");
  const resto = E.filter((e) => !["CIRCLE", "TEXT", "POLYLINE"].includes(e.t));
  if (resto.length) guai.push("entità di un tipo non previsto: " + resto.map((e) => e.t).join(", "));

  /* i cerchi: uno per foro valido, nell'ordine dei fori, sul livello FORI */
  if (cerchi.length !== A.cerchi.length) guai.push(`cerchi: ${cerchi.length} letti, ${A.cerchi.length} fori validi`);
  A.cerchi.forEach((a, i) => {
    const e = cerchi[i]; if (!e) return;
    if (e.livello !== "FORI") guai.push(`il cerchio ${i + 1} sta sul livello ${e.livello}`);
    if (!vicino(e.c[0], a.c[0]) || !vicino(e.c[1], a.c[1])) guai.push(`il cerchio ${i + 1} è in (${e.c}) e il foro in (${a.c})`);
    if (!vicino(e.r, a.r)) guai.push(`il cerchio ${i + 1} ha raggio ${e.r} m, il foro ${a.r} m`);
  });
  /* i nomi: quello che un CAD mette a schermo è il nome del foro; nessun testo vuoto */
  if (testi.some((t) => String(t.mostrato).trim() === "")) guai.push(`${testi.filter((t) => String(t.mostrato).trim() === "").length} testi VUOTI nel disegno`);
  if (testi.length !== A.nomi.length) guai.push(`testi: ${testi.length} letti, ${A.nomi.length} fori con un nome`);
  A.nomi.forEach((a, k) => {
    const t = testi[k]; if (!t) return;
    const cer = A.cerchi[a.i];
    if (t.mostrato !== a.nome) guai.push(`il nome del foro ${a.i + 1} si legge «${t.mostrato}» invece di «${a.nome}»`);
    if (t.recupero !== undefined && t.recupero !== null && /[^\x20-\x7e]/.test(a.nome) && !/\^/.test(a.nome)
        && t.recupero !== a.nome) guai.push(`col lettore di recupero il nome del foro ${a.i + 1} è «${t.recupero}» invece di «${a.nome}»`);
    if (t.livello !== "FORI") guai.push(`il nome del foro ${a.i + 1} sta sul livello ${t.livello}`);
    if (!vicino(t.p[1], cer.c[1]) || !(t.p[0] > cer.c[0] + cer.r - TOL)) guai.push(`il nome del foro ${a.i + 1} non sta a destra del suo cerchio (testo in ${t.p}, cerchio in ${cer.c} raggio ${cer.r})`);
    if (!(t.h >= 0.15 - TOL)) guai.push(`il nome del foro ${a.i + 1} è alto ${t.h} m: sotto i 15 cm non si legge`);
  });
  /* i piedi: uno per foro inclinato, dal boccaforo verso la faccia */
  const piedi = poli.filter((p) => p.livello === "PIEDI"), fronti = poli.filter((p) => p.livello === "FRONTE");
  if (piedi.length !== A.piedi.length) guai.push(`piedi: ${piedi.length} letti, ${A.piedi.length} fori inclinati`);
  A.piedi.forEach((a, i) => {
    const p = piedi[i]; if (!p) return;
    if (p.v.length !== 2 || p.chiusa) guai.push(`il piede ${i + 1} non è un tratto di due punti aperto`);
    else if (!vicino(p.v[0][0], a[0][0]) || !vicino(p.v[0][1], a[0][1]) || !vicino(p.v[1][0], a[1][0]) || !vicino(p.v[1][1], a[1][1]))
      guai.push(`il piede ${i + 1} va da (${p.v[0]}) a (${p.v[1]}); doveva andare da (${a[0]}) a (${a[1].map((v) => +v.toFixed(4))})`);
  });
  /* il fronte: una polilinea aperta coi suoi punti, o niente */
  if (A.fronte) {
    if (fronti.length !== 1) guai.push(`fronte: ${fronti.length} polilinee sul livello FRONTE invece di una`);
    else {
      const f = fronti[0];
      if (f.chiusa) guai.push("il fronte arriva CHIUSO: è una linea, non un contorno");
      if (f.v.length !== A.fronte.length || f.v.some((v, i) => !vicino(v[0], A.fronte[i][0]) || !vicino(v[1], A.fronte[i][1]))) guai.push(`il fronte ha i punti ${JSON.stringify(f.v)} invece di ${JSON.stringify(A.fronte)}`);
    }
  } else if (fronti.length) guai.push("c'è un fronte nel disegno, ma il caso non ne ha uno");
  const previste = A.cerchi.length + A.nomi.length + A.piedi.length + (A.fronte ? 1 : 0);
  if (E.length !== previste) guai.push(`${E.length} entità lette in tutto, ${previste} previste dagli ingressi`);
  return guai;
}

/* ───────── il giudizio sul FILE: è ancora quello che Genesi scrive? ───────── */
function giudicaFile(genesi, nome) {
  const guai = [], c = CASI[nome];
  let sulDiscoB; try { sulDiscoB = readFileSync(join(CAMPIONI, nome + ".dxf")); } catch (e) { return ["il file .dxf non è sul disco"]; }
  let adesso; try { adesso = genesi.dxfPianoFori(c.fori, c.diam, c.profilo, c.progetto); } catch (e) { return ["dxfPianoFori crolla: " + e.message]; }
  if (Buffer.from(adesso, "utf8").compare(sulDiscoB) !== 0) {
    const a = adesso.split("\n"), b = sulDiscoB.toString("utf8").split("\n"); let i = 0; while (i < a.length && a[i] === b[i]) i++;
    guai.push(`il file che ezdxf ha letto NON è più quello che Genesi scrive (prima riga diversa: la ${i + 1}, «${String(b[i]).slice(0, 40)}» sul disco, «${String(a[i]).slice(0, 40)}» adesso) — rifare scrivi.mjs e leggi.py`);
  }
  const nonAscii = [...sulDiscoB].filter((x) => x > 0x7e || (x < 0x20 && x !== 0x0a)).length;
  if (nonAscii) guai.push(`${nonAscii} byte fuori dall'ASCII: il disegno dipende dalla codifica di chi lo apre`);
  return guai;
}

/* ───────── la controprova ───────── */
const DIFETTI = [
  ["i nomi escono in UTF-8 nudo (un accento arriva storpiato)",
   ".replace(/[^\\x20-\\x7e]/g, (c)=>'\\\\U+'+c.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0'))", ""],
  ["un foro senza nome lascia un testo vuoto",
   "if(!t.trim()) return '';", ""],
  ["il circonflesso esce nudo (annuncia un carattere di controllo)",
   ".replace(/\\^/g,'^ ');", ";"],
  ["un carattere fuori dal piano di base esce come due mezzi caratteri",
   ".replace(/[\\ud800-\\udbff][\\udc00-\\udfff]/g,'?')", ""],
  ["il piede va dalla parte sbagliata (lontano dalla faccia)",
   "{x:+h.mx, y:+h.my - avanti}]);", "{x:+h.mx, y:+h.my + avanti}]);"],
  ["tutti i cerchi col diametro del progetto",
   "const suo = valoreProprioDiForo(h, 'diam'), r = suo === null ? raggio : suo/2000;", "const suo = null, r = raggio;"],
  ["il fronte esce chiuso",
   "let s='0\\nPOLYLINE\\n8\\n'+layer+'\\n66\\n1\\n70\\n0\\n';", "let s='0\\nPOLYLINE\\n8\\n'+layer+'\\n66\\n1\\n70\\n1\\n';"],
];
const copia = (x) => JSON.parse(JSON.stringify(x));
const primo = (r, pred) => r.entita.find(pred);
/* i guasti della LETTURA: [nome, caso su cui si prova, che cosa si guasta] */
const GUASTI = [
  ["un cerchio spostato di 5 mm", "liscia", (r) => { primo(r, (e) => e.t === "CIRCLE").c[0] += 0.005; }],
  ["un cerchio col raggio del progetto invece del suo", "mista", (r) => { r.entita.filter((e) => e.t === "CIRCLE")[1].r = 0.051; }],
  ["un cerchio in meno", "liscia", (r) => { r.entita.splice(r.entita.findIndex((e) => e.t === "CIRCLE"), 1); }],
  ["un nome storpiato dalla codifica", "nomi_difficili", (r) => { primo(r, (e) => e.t === "TEXT").mostrato = "Foro nÂ°1 (Ã Ã¨Ã¬) â‚¬"; }],
  ["un testo vuoto in più", "nomi_difficili", (r) => { r.entita.push({ t: "TEXT", livello: "FORI", grezzo: "", mostrato: "", recupero: "", p: [3.566, 3], h: 0.15 }); }],
  ["il nome sopra il cerchio invece che a destra", "liscia", (r) => { const t = primo(r, (e) => e.t === "TEXT"); t.p[0] -= 0.2; }],
  ["un piede dalla parte sbagliata", "inclinata", (r) => { const p = primo(r, (e) => e.livello === "PIEDI"); p.v[1][1] = 2 * p.v[0][1] - p.v[1][1]; }],
  ["un piede calcolato coi valori del progetto per un foro che ha i suoi", "mista", (r) => { const P = r.entita.filter((e) => e.livello === "PIEDI"); P[5].v[1][1] = P[5].v[0][1] - 10 * Math.sin(10 * Math.PI / 180); }],
  ["un piede anche per un foro verticale", "liscia", (r) => { r.entita.push({ t: "POLYLINE", livello: "PIEDI", chiusa: false, v: [[0, 3], [0, 3]] }); }],
  ["il fronte chiuso", "liscia", (r) => { primo(r, (e) => e.livello === "FRONTE").chiusa = true; }],
  ["un punto del fronte spostato", "liscia", (r) => { primo(r, (e) => e.livello === "FRONTE").v[1][1] += 0.01; }],
  ["un fronte dove il caso non ne ha", "senza_fronte", (r) => { r.entita.push({ t: "POLYLINE", livello: "FRONTE", chiusa: false, v: [[0, 0], [1, 0]] }); }],
  ["un'entità su un livello sconosciuto", "liscia", (r) => { primo(r, (e) => e.t === "CIRCLE").livello = "0"; }],
  ["aperto solo col lettore di recupero", "liscia", (r) => { r.lettore = "recupero"; }],
  ["la verifica di ezdxf trova un errore", "liscia", (r) => { r.verifica_errori = ["Invalid layer name"]; }],
  ["un'entità di un tipo non previsto", "vuoto", (r) => { r.entita.push({ t: "LINE", livello: "FORI", v: [[0, 0], [1, 1]] }); }],
];

async function moduloCon(sostituzioni) {
  let s = readFileSync(MODULO, "utf8");
  const colpite = [];
  for (const [nome, da, a] of sostituzioni) { if (s.includes(da)) { colpite.push(nome); s = s.split(da).join(a); } }
  s = s.replace(/from '(\.\.?\/[^']+)'/g, (_, rel) => "from '" + pathToFileURL(join(dirname(MODULO), rel)).href + "'");
  const dir = mkdtempSync(join(tmpdir(), "dxf-nostro-"));
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
    if (guai.length) { visti++; console.log(`  ✔ lettura · «${nome}» (${caso}) → ${guai[0].slice(0, 110)}`); }
    else console.log(`  ⛔ lettura · «${nome}» (${caso}): il giudizio NON se ne accorge`);
  }
  const tot = DIFETTI.length + GUASTI.length;
  console.log(visti === tot ? `✔ CONTROPROVA OK: ${visti} su ${tot} (${DIFETTI.length} difetti nel modulo, ${GUASTI.length} letture guastate) vengono visti`
    : `⛔ CONTROPROVA FALLITA: solo ${visti} su ${tot} vengono visti`);
  console.log("FINE CONTROPROVA");
  console.log(`\nRisultato controprova DXF nostro letto da CAD: ${visti} passati, ${tot - visti} falliti`);
  process.exit(visti === tot ? 0 : 1);
}

let passed = 0, failed = 0;
const dice = (c, t, x) => { if (c) { passed++; console.log(`  ✓ ${t}`); } else { failed++; console.log(`  ✗ ${t}${x ? "\n      " + x : ""}`); } };
const genesi = await import(pathToFileURL(MODULO).href);

/* il denominatore: casi, file e letture devono essere gli stessi */
const conLettura = Object.keys(LETTO).filter((k) => !k.startsWith("_")).sort();
dice(JSON.stringify(sulDisco) === JSON.stringify(nomiCasi) && JSON.stringify(conLettura) === JSON.stringify(nomiCasi),
  `ogni caso ha il suo disegno e la sua lettura, e viceversa (${nomiCasi.length} casi, ${sulDisco.length} file .dxf, ${conLettura.length} letture di ezdxf ${LETTO._ezdxf || "?"})`,
  `casi: ${nomiCasi.join(", ")} · sul disco: ${sulDisco.join(", ")} · letti: ${conLettura.join(", ")}`);
dice(nomiCasi.length >= 9, `i casi ci sono tutti (${nomiCasi.length}, almeno 9)`);

let entita = 0;
for (const nome of nomiCasi) {
  const gf = giudicaFile(genesi, nome);
  dice(gf.length === 0, `${nome}: il disegno letto da ezdxf è quello che Genesi scrive adesso, ed è ASCII puro`, gf.join("\n      "));
  const gl = giudicaLettura(nome, LETTO[nome]);
  entita += ((LETTO[nome] || {}).entita || []).length;
  dice(gl.length === 0, `${nome}: ezdxf ci ha letto quello che gli ingressi dicono (${((LETTO[nome] || {}).entita || []).length} entità)`, gl.join("\n      ") + "\n      (" + CASI[nome].nota + ")");
  if (DIMMI) { const A = atteso(CASI[nome]); console.log(`      ${CASI[nome].nota} — attesi ${A.cerchi.length} cerchi, ${A.nomi.length} nomi, ${A.piedi.length} piedi, ${A.fronte ? "un fronte" : "nessun fronte"}`); }
}

/* NEUTRALITÀ: coi nomi che Genesi dà ai fori il testo del disegno è quello di sempre */
const lisciaTesti = (LETTO.liscia.entita || []).filter((e) => e.t === "TEXT");
dice(lisciaTesti.length === 8 && lisciaTesti.every((t) => t.grezzo === t.mostrato && /^f\d-\d$/.test(t.grezzo)),
  "⛔ NEUTRALITÀ: coi nomi che Genesi dà ai fori (f1-1…) il testo scritto nel file è il nome tale e quale — nessuna forma speciale",
  JSON.stringify(lisciaTesti.map((t) => t.grezzo)));
/* e il caso che ha fatto nascere questa suite, detto per esteso */
const difficili = (LETTO.nomi_difficili.entita || []).filter((e) => e.t === "TEXT").map((t) => t.mostrato);
dice(JSON.stringify(difficili) === JSON.stringify(["Foro n°1 (àèì) €", "a^b ? x y", "7"]),
  "⛔ nomi_difficili: sei fori, TRE nomi a schermo — «Foro n°1 (àèì) €» con gli accenti giusti, «a^b ? x y», «7» — e nessun testo per i tre fori senza nome",
  JSON.stringify(difficili));

console.log(`\nRisultato DXF nostro letto da CAD: ${passed} passati, ${failed} falliti  ·  ${nomiCasi.length} disegni scritti da Genesi e letti da ezdxf ${LETTO._ezdxf || "?"}, ${entita} entità guardate`);
process.exit(failed > 0 ? 1 : 0);

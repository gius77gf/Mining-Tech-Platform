/* UN NOME CHIAMATO CHE NON ESISTE DA NESSUNA PARTE.
   È un errore DURO — la pagina si apre e muore al primo tocco — e nessuna
   suite `node` lo vedeva: `sintassi-pagine.mjs` compila i blocchi e un
   identificatore libero è sintatticamente valido; `import-esistenti.mjs`
   confronta le LISTE di import con gli export dei moduli, e un nome che non è
   importato non lo guarda nessuno.

   ⛔ SUCCESSO IL 03/08, a chi stava correggendo un difetto della stessa
   famiglia. Scrivendo la pastiglia della mora in Conti è finito nel codice
   `numeroIt(TASSO_MORA_DEFAULT, 2)`: `numeroIt` in tutto `apps/conti/` e in
   `shared/` ha **zero occorrenze**. La pagina compilava, le 2.060 prove
   passavano, e la pastiglia sarebbe morta la prima volta che una fattura
   scaduta compariva nell'elenco. L'ha trovata un `grep -c` fatto per caso.
   È la quarta volta che questa famiglia passa: l'`import { daCampo }` senza il
   modulo, il `<script>` dimenticato, il `${...}` in mezzo a una catena di `+`,
   e adesso questo. Le prime tre sono raccontate in CLAUDE.md.

   COME FUNZIONA, e dove NON guarda — dichiarato, non sottinteso:
   · guarda i nomi in posizione di CHIAMATA (`nome(`), non ogni riferimento:
     `const x = pippo` non viene visto. È la metà che costa di più quando
     manca, ed è quella che si può controllare senza un analizzatore di scope;
   · i nomi che il browser regala stanno in `GLOBALI`, corto di proposito: se
     ne manca uno si presenta come falso allarme e si aggiunge con la ragione;
   · i nomi che arrivano dagli SCRIPT FRATELLI (`<script src>`) si leggono dai
     file veri, seguendo l'elenco che la pagina dichiara: `toast`, `apriModale`
     e compagnia vivono in `shared/dw-app-ui.js` e sono legittimi. L'elenco è
     DERIVATO dalla pagina, non scritto a mano — se domani un'app carica uno
     script in più, entra da solo.

   ⚠️ E la prima stesura rispondeva «0 chiamate guardate» su nove pagine:
   `mascheraCodice` restituisce una MASCHERA (`Uint8Array`), non una stringa, e
   unendola con `join` si ottiene «1,1,0,…» — il controllo stava cercando nomi
   di funzione dentro una fila di cifre. Il numero delle chiamate guardate è
   stampato apposta: è la difesa contro il «nessuna violazione» di un controllo
   che non ha guardato niente.
*/
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mascheraCodice } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = resolve(QUI, "..", "..", "..");
const leggi = (rel) => readFileSync(join(RADICE, rel), "utf8");

/* Le superfici: le stesse di `run-stile`, ma qui basta l'elenco delle pagine. */
const PAGINE = [
  "index.html", "apps/index.html", "apps/genesi/genesi.html",
  "apps/conti/index.html", "apps/flotta/index.html", "apps/scudo/index.html",
  "apps/campo/index.html", "apps/sentinella/index.html", "apps/terra/index.html",
  "apps/deepwork-id/admin.html", "apps/deepwork-id/profilo.html", "apps/deepwork-id/index.html",
];

/* Parole chiave che precedono una parentesi e NON sono chiamate. `async(` è la
   più frequente: `async (x) => …` sembra una chiamata a una funzione «async». */
const PAROLE = new Set(`if for while switch catch return typeof instanceof void delete new in of do
  else try finally function class const let var await async yield throw case default break continue
  extends super this null true false undefined`.split(/\s+/).filter(Boolean));

const GLOBALI = new Set(`Object Array String Number Boolean Math JSON Date RegExp Map Set WeakMap WeakSet
  Promise Symbol BigInt Error TypeError RangeError SyntaxError EvalError ReferenceError Function Proxy Reflect Intl
  parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent encodeURI decodeURI eval
  setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame
  queueMicrotask structuredClone fetch alert confirm prompt console window document navigator
  location history localStorage sessionStorage indexedDB screen performance crypto URL URLSearchParams
  Blob File FileReader FormData Headers Request Response AbortController Image Audio Option
  Event CustomEvent MutationObserver ResizeObserver IntersectionObserver DOMParser XMLHttpRequest
  TextEncoder TextDecoder Uint8Array Int8Array Uint16Array Int16Array Uint32Array Int32Array
  Float32Array Float64Array ArrayBuffer DataView atob btoa print open close matchMedia getComputedStyle
  scrollTo scrollBy requestIdleCallback CSS Notification WebSocket Worker addEventListener
  removeEventListener dispatchEvent postMessage getSelection`.split(/\s+/).filter(Boolean));

/* Librerie di terze parti caricate da CDN: non stanno in un file nostro, e il
   loro nome è l'unica cosa che possiamo dichiarare. Corto e con la ragione. */
const DA_CDN = new Set(["Chart", "THREE"]);

/* Il contenuto delle stringhe si sostituisce con spazi: così un `prompt(` dentro
   un testo non conta come chiamata, e le posizioni restano quelle vere. */
function soloCodice(t) {
  const m = mascheraCodice(t);
  let o = "";
  for (let i = 0; i < t.length; i++) o += m[i] ? t[i] : " ";
  return o;
}

function blocchiDi(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
}

/* Gli script fratelli che la pagina dichiara, letti dal disco. I nomi che
   espongono sono quelli che finiscono su `window.`, più le loro dichiarazioni
   di primo livello (alcuni file girano in uno IIFE e appendono a `window`). */
function nomiDegliScriptFratelli(relPagina, html) {
  const base = dirname(relPagina);
  const nomi = new Set();
  let quanti = 0;
  for (const m of html.matchAll(/<script[^>]*\bsrc=["']([^"']+)["']/gi)) {
    const src = m[1];
    if (/^https?:|^\/\//.test(src)) continue;           // CDN: si dichiara in DA_CDN
    let testo;
    try { testo = leggi(join(base, src)); } catch { continue; }
    quanti++;
    const codice = soloCodice(testo);
    for (const x of codice.matchAll(/window\.([\w$]+)\s*=/g)) nomi.add(x[1]);
    for (const x of codice.matchAll(/\b(?:function|class)\s+([\w$]+)/g)) nomi.add(x[1]);
    for (const x of codice.matchAll(/\b(?:const|let|var)\s+([\w$]+)/g)) nomi.add(x[1]);
  }
  return { nomi, quanti };
}

/* Tutto ciò che può LEGARE un nome dentro la pagina. Largo di proposito: qui un
   falso negativo costa meno di un falso allarme, perché un allarme che sbaglia
   insegna a non guardarlo — è già successo con la colonna delle prove del
   delta, che sbagliava tre volte su quattro. */
function nomiLegati(codice) {
  const legati = new Set();
  const agg = (re, g = 1) => {
    for (const m of codice.matchAll(re)) if (m[g]) for (const n of m[g].split(/[^\w$]+/)) if (n) legati.add(n);
  };
  agg(/\b(?:function|class)\s*\*?\s*([\w$]+)/g);
  /* ⚠️ i dichiaratori multipli: `const a = 1, b = 2` — la prima stesura prendeva
     solo `a`, ed è da lì che venivano quattro dei «sospetti» (rnd, Y, my2, fmtD) */
  agg(/\b(?:const|let|var)\s+([^;\n]*)/g);
  agg(/import\s*\{([^}]*)\}/g);
  agg(/import\s+([\w$]+)/g);
  agg(/\bcatch\s*\(\s*([\w$]+)/g);
  agg(/\bfunction[^(]*\(([^)]*)\)/g);
  agg(/\(([^()]*)\)\s*=>/g);
  agg(/([\w$]+)\s*=>/g);
  agg(/([\w$]+)\s*[:=]\s*(?:async\s*)?(?:function|\()/g);
  return legati;
}

export function nomiSospetti(relPagina) {
  const html = leggi(relPagina);
  const blocchi = blocchiDi(html);
  if (!blocchi.length) return { chiamate: 0, sospetti: new Map(), blocchi: 0, fratelli: 0 };
  const codice = blocchi.map(soloCodice).join("\n;\n");
  const legati = nomiLegati(codice);
  const { nomi: daiFratelli, quanti: fratelli } = nomiDegliScriptFratelli(relPagina, html);
  const sospetti = new Map();
  let chiamate = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const n = m[2];
    chiamate++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || legati.has(n) || daiFratelli.has(n)) continue;
    sospetti.set(n, (sospetti.get(n) || 0) + 1);
  }
  return { chiamate, sospetti, blocchi: blocchi.length, fratelli };
}

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.log(`  ✗ ${nome}\n      ${e.message}`); }
};
const ok = (c, why) => { if (!c) throw new Error(String(why || "condizione non verificata")); };

console.log("\n— Nomi chiamati che non esistono —");

let chiamateTot = 0, pagineViste = 0;
const male = [];
for (const p of PAGINE) {
  let r;
  try { r = nomiSospetti(p); } catch { continue; }
  if (!r.blocchi) continue;
  pagineViste++;
  chiamateTot += r.chiamate;
  for (const [n, c] of r.sospetti) male.push(`${p}: ${n}() ×${c}`);
}

test("nessun nome chiamato che non esiste da nessuna parte", () => {
  ok(male.length === 0,
    "nomi chiamati e mai dichiarati (né nella pagina, né importati, né dagli script fratelli):\n  "
    + male.join("\n  ")
    + "\n  Se uno di questi è legittimo, va aggiunto a GLOBALI o DA_CDN CON LA RAGIONE, non tolto in silenzio.");
});

test("ha davvero guardato: il numero delle chiamate è quello di un'app viva", () => {
  /* La difesa contro il «nessuna violazione» di un controllo che non guarda:
     la prima stesura rispondeva 0 chiamate su 9 pagine. */
  ok(pagineViste >= 8, `solo ${pagineViste} pagine con codice in linea: l'elenco non sta guardando dove crede`);
  ok(chiamateTot >= 10000, `solo ${chiamateTot} chiamate guardate su ${pagineViste} pagine: troppo poche`);
});

test("la controprova — il nome che è successo davvero viene visto", () => {
  /* Si rimette ESATTAMENTE il difetto del 03/08: `numeroIt(` in Conti, che non
     esiste in nessun file. Non si tocca il disco: si lavora sul testo. */
  const rel = "apps/conti/index.html";
  const html = leggi(rel);
  ok(!/numeroIt/.test(html), "Conti dev'essere sana prima di guastarla");
  const guasto = html.replace("${String(TASSO_MORA_DEFAULT).replace('.', ',')}% annuo",
                              "${numeroIt(TASSO_MORA_DEFAULT, 2)}% annuo");
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  /* stessa pipeline, sul testo iniettato */
  const blocchi = blocchiDi(guasto);
  const codice = blocchi.map(soloCodice).join("\n;\n");
  const legati = nomiLegati(codice);
  const { nomi: fratelli } = nomiDegliScriptFratelli(rel, guasto);
  let visto = false;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g))
    if (m[2] === "numeroIt" && !PAROLE.has(m[2]) && !GLOBALI.has(m[2]) && !DA_CDN.has(m[2])
        && !legati.has(m[2]) && !fratelli.has(m[2])) visto = true;
  ok(visto, "col difetto rimesso, `numeroIt` deve risultare sospetto — e non risulta");
});

console.log(`\nRisultato nomi liberi: ${passed} passati, ${failed} falliti`
  + `  ·  ${chiamateTot} chiamate guardate su ${pagineViste} pagine`);
process.exit(failed > 0 ? 1 : 0);

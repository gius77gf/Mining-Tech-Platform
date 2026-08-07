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
import { readFileSync, readdirSync } from "node:fs";
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

/* ⚠️ NOMI CHE NON SONO FUNZIONI, E SONO EMERSI STRINGENDO LA REGOLA il 07/08.
   Prima non si vedevano perché la riga larga li «legava» tutti; adesso vanno
   dichiarati per nome, che è meglio — un elenco corto e scritto è leggibile,
   una regola larga che li nasconde no.
   · `import(` è l'import DINAMICO: sintassi del linguaggio, non una funzione
     (e si distingue da `import {…} from` perché ha la parentesi tonda);
   · `require(`, `module`, `exports` vivono in `apps/deepwork-id/functions/`,
     che è codice **Node CommonJS** e non gira nel browser: sono i suoi
     globali, come `window` lo è per le pagine. */
const SINTASSI_E_NODE = new Set(["import", "require", "module", "exports"]);

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
/* ⛔ I NOMI DICHIARATI DA UN `const/let/var`, E PERCHÉ NON È UNA REGEX.
   Fino al 07/08 questa parte era `\b(?:const|let|var)\s+([^;\n]*)` — cioè
   prendeva TUTTA la riga e la spezzava sui caratteri non alfanumerici. Effetto:
   ogni parola che sta sulla stessa riga di una dichiarazione risultava
   «legata», **compreso il nome della funzione chiamata lì dentro**. Cioè il
   controllo era cieco su una riga come:

       const avviso = sd ? `${conta(sd, "rapportino", "rapportini")}` : "";

   e le righe così sono la maggioranza. Misurato togliendo `conta` dall'import
   di Campo su una copia di HEAD: il controllo rispondeva **«nessun nome che non
   esiste»**. Stringendola è saltato fuori un difetto VERO, vecchio di una
   settimana e mai visto da nessuno — `chiediDati()`, chiamata **6 volte** in
   Flotta e non definita da nessuna parte.

   Una regex non basta: `const a = f(1), b = g(2)` ha una virgola dentro le
   parentesi e una fuori, e sono cose diverse. Qui si scandisce tenendo la
   profondità di `()`, `[]` e `{}`: si spezza sulle virgole di PRIMO LIVELLO e
   di ogni dichiaratore si tiene la parte PRIMA del suo `=`.
   ⚠️ La fermata su `of`/`in` serve a `for (const r of righe)`: senza, il
   dichiaratore si mangia anche `righe`, che è un nome LIBERO — cioè proprio
   quello che il controllo deve vedere. Provata su 12 casi in scratchpad prima
   di finire qui, e uno dei 12 l'ha bocciata alla prima stesura. */
function nomiDichiarati(codice) {
  const out = new Set();
  const re = /\b(?:const|let|var)\s+/g;
  let m;
  while ((m = re.exec(codice))) {
    let i = m.index + m[0].length;
    let tondo = 0, quadra = 0, graffa = 0;
    let pezzo = "", primo = true;   // `primo` = siamo prima del `=` di questo dichiaratore
    const chiudi = () => {
      if (pezzo.trim()) for (const n of pezzo.split(/[^\w$]+/)) if (n) out.add(n);
      pezzo = ""; primo = true;
    };
    for (; i < codice.length; i++) {
      const c = codice[i];
      if (c === "(") tondo++; else if (c === ")") { if (!tondo) break; tondo--; }
      else if (c === "[") quadra++; else if (c === "]") { if (!quadra) break; quadra--; }
      else if (c === "{") graffa++; else if (c === "}") { if (!graffa) break; graffa--; }
      const fuori = !tondo && !quadra && !graffa;
      if (fuori && (c === ";" || c === "\n")) break;
      if (fuori && primo && /\s/.test(c) && /^\s*(?:of|in)\s/.test(codice.slice(i))) break;
      /* `=>` non è un `=` di assegnamento, e `==`/`===` non compaiono a
         livello zero dentro una dichiarazione. */
      if (fuori && primo && c === "=" && codice[i + 1] !== ">" && codice[i + 1] !== "=") { primo = false; continue; }
      if (fuori && c === ",") { chiudi(); continue; }
      if (primo) pezzo += c;
    }
    chiudi();
  }
  return out;
}

function nomiLegati(codice) {
  const legati = new Set();
  const agg = (re, g = 1) => {
    for (const m of codice.matchAll(re)) if (m[g]) for (const n of m[g].split(/[^\w$]+/)) if (n) legati.add(n);
  };
  agg(/\b(?:function|class)\s*\*?\s*([\w$]+)/g);
  /* ⚠️ i dichiaratori multipli: `const a = 1, b = 2` — la prima stesura prendeva
     solo `a`, ed è da lì che venivano quattro dei «sospetti» (rnd, Y, my2, fmtD) */
  for (const n of nomiDichiarati(codice)) legati.add(n);
  agg(/import\s*\{([^}]*)\}/g);
  agg(/import\s+([\w$]+)/g);
  agg(/\bcatch\s*\(\s*([\w$]+)/g);
  agg(/\bfunction[^(]*\(([^)]*)\)/g);
  agg(/\(([^()]*)\)\s*=>/g);
  agg(/([\w$]+)\s*=>/g);
  agg(/([\w$]+)\s*[:=]\s*(?:async\s*)?(?:function|\()/g);
  /* ⚠️ I METODI IN FORMA ABBREVIATA, dentro una classe o un oggetto:
     `async inviteMember(email, role = "member") {` è una DEFINIZIONE, non una
     chiamata — ma al lettore di chiamate somiglia in tutto. Erano i nove
     «sospetti» dell'SDK alla prima passata sui moduli: nove falsi allarmi su
     nove, e un allarme che sbaglia nove volte su nove insegna a non guardarlo.
     Si riconoscono dalla graffa che segue la parentesi. */
  agg(/(?:^|\n)\s*(?:static\s+)?(?:async\s+)?\*?\s*([\w$]+)\s*\([^()]*\)\s*\{/g);
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
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n) || legati.has(n) || daiFratelli.has(n)) continue;
    sospetti.set(n, (sospetti.get(n) || 0) + 1);
  }
  return { chiamate, sospetti, blocchi: blocchi.length, fratelli };
}

/* ⛔ E I MODULI, che alla prima stesura restavano fuori — dichiarato allora,
   chiuso il 03/08 lo stesso giorno, perché nel frattempo ci sono ricascato: in
   `dw-shell.js` ho scritto `_numMis` dove l'aiuto si chiama `_numRapp`. Nei
   moduli il difetto è **peggiore** che nelle pagine: un nome libero non fa
   rumore all'import, esplode quando quella riga viene eseguita — cioè magari
   in un ramo che le prove non toccano.
   Qui non ci sono script fratelli: un modulo ha solo i suoi `import` e le sue
   dichiarazioni, quindi il conto è più stretto e più affidabile. */
function moduliDelDisco() {
  const fuori = [];
  const dai = (dir, prof) => {
    let voci = [];
    try { voci = readdirSync(join(RADICE, dir), { withFileTypes: true }); } catch { return; }
    for (const v of voci) {
      const rel = dir + "/" + v.name;
      if (v.isDirectory()) { if (prof > 0 && v.name !== "node_modules" && v.name !== "tests") dai(rel, prof - 1); continue; }
      if (!v.name.endsWith(".js")) continue;
      fuori.push(rel);
    }
  };
  dai("shared", 2);
  dai("apps", 2);
  return fuori.filter((p) => !/\/tests\//.test(p));
}

export function nomiSospettiModulo(rel) {
  const codice = soloCodice(leggi(rel));
  const legati = nomiLegati(codice);
  const sospetti = new Map();
  let chiamate = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const n = m[2];
    chiamate++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n) || legati.has(n)) continue;
    sospetti.set(n, (sospetti.get(n) || 0) + 1);
  }
  return { chiamate, sospetti };
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

let chiamateMod = 0, moduliVisti = 0;
const maleMod = [];
for (const p of moduliDelDisco()) {
  let r;
  try { r = nomiSospettiModulo(p); } catch { continue; }
  if (!r.chiamate) continue;
  moduliVisti++; chiamateMod += r.chiamate;
  for (const [n, c] of r.sospetti) maleMod.push(`${p}: ${n}() ×${c}`);
}

test("nessun nome chiamato che non esiste, nei MODULI", () => {
  ok(maleMod.length === 0,
    "nomi chiamati e mai dichiarati dentro un modulo (né importati, né dichiarati lì):\n  "
    + maleMod.join("\n  "));
});

test("ha davvero guardato anche i moduli", () => {
  ok(moduliVisti >= 10, `solo ${moduliVisti} moduli guardati: l'elenco non sta guardando dove crede`);
  ok(chiamateMod >= 3000, `solo ${chiamateMod} chiamate nei moduli: troppo poche`);
});

test("la controprova dei MODULI — il refuso che è successo davvero viene visto", () => {
  /* si rimette ESATTAMENTE lo scambio del 03/08: `_numRapp` → `_numMis` in una
     riga sola di dw-shell. Sul testo, senza toccare il disco. */
  const rel = "shared/deepwork-id-client/dw-shell.js";
  const sano = leggi(rel);
  ok(!/_numMis/.test(sano), "dw-shell dev'essere sano prima di guastarlo");
  const guasto = sano.replace("kg: conKg ? _numRapp(o.tot_kg) : null,", "kg: conKg ? _numMis(o.tot_kg) : null,");
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const codice = soloCodice(guasto);
  const legati = nomiLegati(codice);
  let visto = false;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g))
    if (m[2] === "_numMis" && !PAROLE.has(m[2]) && !GLOBALI.has(m[2]) && !legati.has(m[2])) visto = true;
  ok(visto, "col refuso rimesso, `_numMis` deve risultare sospetto — e non risulta");
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

/* ⛔ LA CONTROPROVA DEL BUCO CHE C'ERA DAVVERO, e vale più della precedente
   perché quella passava anche con la regola larga. Il caso è: un nome libero
   che sta sulla STESSA RIGA di una dichiarazione — la forma di gran lunga più
   frequente, `const x = qualcosa(...)`. Fino al 07/08 la riga larga lo legava
   e il controllo rispondeva «nessun nome che non esiste».
   Si rimette il difetto vero misurato quel giorno: `conta` tolto dall'import di
   Campo, dove è chiamato dentro due `const`. */
test("la controprova del buco vero — un nome libero dentro un `const` viene visto", () => {
  const rel = "apps/campo/index.html";
  const html = leggi(rel);
  /* ⚠️ L'ANCORA NON PUÒ FINIRE SULLA GRAFFA. Era la stringa esatta
     `nomeCsvDimostrazione, conta }`, cioè presumeva che `conta` fosse
     l'ULTIMO nome importato da Campo: il 07/08 la pagina ne ha importato uno
     dopo (`plurale`) e l'iniezione non ha più sostituito niente — la
     controprova si è dichiarata rotta da sola, che è il comportamento giusto
     ma è una manutenzione che si poteva evitare. Adesso l'ancora toglie **il
     solo specificatore `conta`**, qualunque cosa venga dopo. */
  const guasto = html.replace(/nomeCsvDimostrazione, conta(,|\s*\})/, "nomeCsvDimostrazione$1");
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  ok(!/\bconta\b(?=[^{}]*\}\s*from\s*"\.\.\/\.\.\/shared\/deepwork-id-client\/dw-shell\.js")/.test(guasto),
    "e `conta` non dev'essere più fra i nomi importati: se resta, l'iniezione ha tolto altro");
  const codice = blocchiDi(guasto).map(soloCodice).join("\n;\n");
  ok(/\bconta\s*\(/.test(codice), "`conta(` dev'essere chiamato nella pagina, se no non si prova niente");

  const legatiStretti = nomiLegati(codice);
  ok(!legatiStretti.has("conta"),
    "con la regola STRETTA `conta` non dev'essere legato — se lo è, la stretta non ha stretto");

  /* e la prova che la regola LARGA lo nascondeva: si rifà il vecchio
     riconoscitore qui dentro, così il confronto è nel test e non a memoria */
  const larga = new Set();
  for (const m of codice.matchAll(/\b(?:const|let|var)\s+([^;\n]*)/g))
    for (const n of (m[1] || "").split(/[^\w$]+/)) if (n) larga.add(n);
  ok(larga.has("conta"),
    "la regola larga DOVEVA nascondere `conta`: se non lo nasconde, il racconto di questo file è sbagliato");
});

console.log(`\nRisultato nomi liberi: ${passed} passati, ${failed} falliti`
  + `  ·  ${chiamateTot} chiamate su ${pagineViste} pagine, ${chiamateMod} su ${moduliVisti} moduli`);
process.exit(failed > 0 ? 1 : 0);

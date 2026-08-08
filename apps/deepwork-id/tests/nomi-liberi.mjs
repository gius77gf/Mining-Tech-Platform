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

   ⛔ E IL 07/08 È PASSATA LA QUINTA, con una veste che questo file non poteva
   vedere: `conta(...)` nel bottone «Scarica rilievi» di Terra, mai importata —
   e nella STESSA pagina un `const conta = …` **locale a un'altra funzione**.
   L'insieme dei nomi legati è unico per file, quindi bastava quell'omonimo
   qualunque per rendere invisibile un nome libero: il controllo guardava il
   FILE e non lo SCOPE. Da lì la SECONDA DOMANDA in fondo a questo file — *il
   nome esiste, ma esiste QUI?* — che non sostituisce la prima, le sta accanto.

   ⏱️ LA TERZA DOMANDA — I RIFERIMENTI, MISURATA L'08/08 E NON ANCORA SCRITTA.
   Oggi si guardano i nomi CHIAMATI (`nome(`); un `${nome}` dentro un template
   con `nome` inesistente non lo vede nessuno, e in queste pagine è la forma con
   cui si compone ogni riga di interfaccia. Misurata prima di irrigidire, come
   pretende la regola: **3.742 riferimenti `${nome}` su 12 pagine, 2 allarmi, e
   tutt'e due FALSI** — `CSS`, che è un globale del browser già dichiarato in
   `GLOBALI`, e `_fSW` di Genesi, che è il **terzo dichiaratore** di un `const`
   spezzato su due righe. Cioè: il rumore atteso è **zero**, purché il
   riconoscitore riusi `nomiDichiarati` (che i dichiaratori multi-riga li sa
   leggere) invece della forma larga, e l'elenco `GLOBALI` vero invece di uno
   corto scritto per la misura. Il lavoro è quello, ed è piccolo.

   COME FUNZIONA, e dove NON guarda — dichiarato, non sottinteso:
   · guarda i nomi in posizione di CHIAMATA (`nome(`), non ogni riferimento:
     `const x = pippo` non viene visto. È la metà che costa di più quando manca;
   · lo scope lo giudica per BLOCCHI di graffe, non con un analizzatore vero:
     non distingue una funzione da un `if`, e non conosce l'hoisting di `var`.
     Sbaglia quindi **per eccesso di prudenza** (un `var` usato prima del suo
     blocco non lo accusa), mai accusando chi è sano — e il costo di questa
     scelta è misurato: 0 falsi allarmi su 18.656 chiamate;
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

/* ⛔ IL SECONDO ARGOMENTO INVECE DI UNA COPIA. La seconda domanda (più sotto)
   ha bisogno dei nomi legati **in ogni modo TRANNE** `const/let/var`, perché
   quelli li giudica lei guardando lo scope. Ricopiare il corpo qui accanto
   sarebbe stata la solita divergenza rimandata: all'originale mancava un
   parametro, e costa una riga. */
function nomiLegati(codice, conDichiarazioni = true) {
  const legati = new Set();
  const agg = (re, g = 1) => {
    for (const m of codice.matchAll(re)) if (m[g]) for (const n of m[g].split(/[^\w$]+/)) if (n) legati.add(n);
  };
  agg(/\b(?:function|class)\s*\*?\s*([\w$]+)/g);
  /* ⚠️ i dichiaratori multipli: `const a = 1, b = 2` — la prima stesura prendeva
     solo `a`, ed è da lì che venivano quattro dei «sospetti» (rnd, Y, my2, fmtD) */
  if (conDichiarazioni) for (const n of nomiDichiarati(codice)) legati.add(n);
  agg(/import\s*\{([^}]*)\}/g);
  agg(/import\s+([\w$]+)/g);
  agg(/\bcatch\s*\(\s*([\w$]+)/g);
  agg(/\bfunction[^(]*\(([^)]*)\)/g);
  agg(/\(([^()]*)\)\s*=>/g);
  agg(/([\w$]+)\s*=>/g);
  /* ⛔ LE DUE FORME ERANO SCRITTE IN UNA, E UNA DELLE DUE È AMBIGUA.
     `nome: function` e `nome: (` sono una PROPRIETÀ: legano sempre.
     `nome = (` invece combacia anche con `const conta = (R.a + R.b)` — cioè con
     una dichiarazione qualunque il cui valore comincia per parentesi. Per la
     prima domanda non cambia niente (le dichiarazioni le lega comunque
     `nomiDichiarati`); per la SECONDA sì, perché lì il giudizio sulle
     dichiarazioni lo dà lo scope, e questa riga gliele portava via tutte —
     misurato: la controprova di Terra restava verde col difetto dentro. */
  agg(/([\w$]+)\s*:\s*(?:async\s*)?(?:function|\()/g);
  if (conDichiarazioni) agg(/([\w$]+)\s*=\s*(?:async\s*)?(?:function|\()/g);
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

/* ══════════════════════════════════════════════════════════════════════════
   ⛔ LA SECONDA DOMANDA: IL NOME ESISTE NEL FILE, MA ESISTE NELLO SCOPE?
   ──────────────────────────────────────────────────────────────────────────
   Misurato il 07/08, e non su un caso di scuola: il bottone «Scarica rilievi»
   di Terra chiamava `conta(...)`, che nella pagina **non era importata**.
   Errore duro — il gestore muore appena si preme — e questo controllo, che
   esiste apposta per quella famiglia, rispondeva «nessun nome che non esiste».
   La ragione: `nomiLegati` raccoglie in un insieme **unico per file**, e nella
   stessa pagina c'è un `const conta = …` **locale a un'altra funzione**. Cioè
   guardava il FILE e non lo SCOPE, e bastava un omonimo qualunque, dichiarato
   in un punto qualunque, per rendere invisibile un nome libero.
   Non si aggiusta il filtro: la domanda era una sola e ne serve una **seconda**
   accanto. Questa non sostituisce niente — la prima resta e continua a
   rispondere «non esiste da nessuna parte»; questa risponde «esiste, ma non
   qui».

   ⚠️ COSTO MISURATO PRIMA DI IRRIGIDIRE, come pretende la regola del 07/08:
   stretta su una copia dell'albero sano, **0 allarmi** su 18.656 chiamate e 12
   pagine; col difetto vero rimesso, **1 allarme, quello giusto**. Le due
   stesure precedenti sbagliavano e sono servite a capire dove:
     · con una regex per le dichiarazioni, `const N=60, gx=(i)=>…` perdeva il
       secondo dichiaratore → 2 falsi allarmi (`gx` in Genesi). Si riusa lo
       stesso scandaglio di `nomiDichiarati`, che i dichiaratori multipli li
       sa già leggere;
     · ancorando il blocco al **dichiaratore**, `const {jsPDF}=window.jspdf`
       faceva prendere la graffa della **destrutturazione** per il blocco che
       racchiude → 11 falsi allarmi. L'ancora giusta è la parola `const`, che
       sta fuori da quelle graffe.
   Cioè i falsi allarmi non venivano dalla domanda: venivano dal righello. */

/* Il blocco `{ … }` che racchiude una posizione: indietro contando le graffe
   fino a quella aperta e non ancora chiusa, poi avanti fino alla sua gemella.
   Fuori da ogni graffa il blocco è tutto il file. */
export function bloccoAttorno(codice, pos) {
  let liv = 0, apre = -1;
  for (let i = pos; i >= 0; i--) {
    const c = codice[i];
    if (c === "}") liv++;
    else if (c === "{") { if (!liv) { apre = i; break; } liv--; }
  }
  if (apre === -1) return [0, codice.length];
  liv = 0;
  for (let i = apre + 1; i < codice.length; i++) {
    const c = codice[i];
    if (c === "{") liv++;
    else if (c === "}") { if (!liv) return [apre, i]; liv--; }
  }
  return [apre, codice.length];
}

/* Le stesse dichiarazioni di `nomiDichiarati`, con accanto la posizione della
   parola `const`/`let`/`var` — l'ancora, non il dichiaratore. */
export function dichiarazioniConPosizione(codice) {
  const out = [];
  const re = /\b(?:const|let|var)\s+/g;
  let m;
  while ((m = re.exec(codice))) {
    let i = m.index + m[0].length;
    const inizio = m.index;
    let tondo = 0, quadra = 0, graffa = 0;
    let pezzo = "", primo = true;
    const chiudi = () => {
      if (pezzo.trim()) for (const n of pezzo.split(/[^\w$]+/)) if (n) out.push([n, inizio]);
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
      if (fuori && primo && c === "=" && codice[i + 1] !== ">" && codice[i + 1] !== "=") { primo = false; continue; }
      if (fuori && c === ",") { chiudi(); continue; }
      if (primo) pezzo += c;
    }
    chiudi();
  }
  return out;
}

/* Il giudizio, su un pezzo di codice già smascherato. `fuoriScope` elenca le
   chiamate a un nome che nel file È dichiarato — ma solo da un `const/let/var`
   che vive in un blocco che NON racchiude la chiamata. */
export function fuoriScope(codice, daiFratelli = new Set()) {
  const blocchiDelNome = new Map();
  for (const [n, at] of dichiarazioniConPosizione(codice)) {
    if (!blocchiDelNome.has(n)) blocchiDelNome.set(n, []);
    blocchiDelNome.get(n).push(bloccoAttorno(codice, at));
  }
  /* legato in ogni ALTRO modo — funzioni, classi, import, parametri, metodi:
     quelli questa domanda non li tocca, li giudica già la prima */
  const altrove = nomiLegati(codice, false);
  const fuori = [];
  let chiamate = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g)) {
    const n = m[2];
    chiamate++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n)) continue;
    if (altrove.has(n) || daiFratelli.has(n) || !blocchiDelNome.has(n)) continue;
    const pos = m.index + m[1].length;
    if (blocchiDelNome.get(n).some(([a, z]) => pos > a && pos < z)) continue;
    fuori.push({ nome: n, riga: codice.slice(0, pos).split("\n").length });
  }
  return { fuori, chiamate };
}

/* ══════════════════════════════════════════════════════════════════════════
   ⛔ LA TERZA DOMANDA: UN NOME RIFERITO — NON CHIAMATO — CHE NON ESISTE.
   ──────────────────────────────────────────────────────────────────────────
   `${nome}` dentro un template è il modo in cui queste pagine compongono ogni
   riga di interfaccia, e un nome libero lì **uccide il disegno** esattamente
   come una chiamata inesistente uccide il tocco. La prima domanda non lo vede
   (guarda `nome(`), la seconda nemmeno.
   ⚠️ SI CERCA SUL TESTO, NON SUL CODICE MASCHERATO, ed è l'unico punto di
   questo file dove serve: i template **vivono dentro le stringhe**, e
   `mascheraCodice` — che è la cosa giusta per i dialoghi — qui spegnerebbe
   proprio ciò che si vuole leggere.
   ⚠️ E l'ampiezza è stata MISURATA prima di scriverla: 3.742 riferimenti su 12
   pagine, **0 allarmi**. I due che la prima misura dava erano tutt'e due del
   righello — `CSS` (che sta in `GLOBALI`) e `_fSW`, terzo dichiaratore di un
   `const` spezzato su due righe, che solo `nomiDichiarati` sa leggere. Per
   questo qui si riusano quelli veri invece di scriverne di nuovi. */
export function riferimentiLiberi(relPagina) {
  const html = leggi(relPagina);
  const bl = blocchiDi(html);
  if (!bl.length) return { visti: 0, liberi: new Map() };
  const testo = bl.join("\n;\n");
  const legati = nomiLegati(soloCodice(testo));
  const { nomi: fratelli } = nomiDegliScriptFratelli(relPagina, html);
  const liberi = new Map();
  let visti = 0;
  for (const m of testo.matchAll(/\$\{\s*([A-Za-z_$][\w$]*)\s*(\.|\}|\s|\[|\?|\)|,|\+)/g)) {
    const n = m[1];
    visti++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n)
        || legati.has(n) || fratelli.has(n)) continue;
    liberi.set(n, (liberi.get(n) || 0) + 1);
  }
  return { visti, liberi };
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

/* ── LA SECONDA DOMANDA, sulle stesse pagine ─────────────────────────────── */
let chiamateScope = 0, pagineScope = 0;
const maleScope = [];
for (const p of PAGINE) {
  let html;
  try { html = leggi(p); } catch { continue; }
  const bl = blocchiDi(html);
  if (!bl.length) continue;
  const codice = bl.map(soloCodice).join("\n;\n");
  const { nomi: fratelli } = nomiDegliScriptFratelli(p, html);
  const r = fuoriScope(codice, fratelli);
  pagineScope++; chiamateScope += r.chiamate;
  for (const f of r.fuori) maleScope.push(`${p}: ${f.nome}() alla riga ~${f.riga} del codice in linea`);
}

/* ⛔ E ANCHE I MODULI, che nella prima stesura di questa domanda restavano
   fuori. Lì il difetto è **peggiore** che in una pagina: un nome libero non fa
   rumore all'import, esplode quando quella riga viene eseguita — cioè magari
   in un ramo che le prove non toccano. E i moduli non hanno script fratelli,
   quindi il conto è più stretto e più affidabile. */
let chiamateScopeMod = 0, moduliScope = 0;
const maleScopeMod = [];
for (const p of moduliDelDisco()) {
  let codice;
  try { codice = soloCodice(leggi(p)); } catch { continue; }
  const r = fuoriScope(codice);
  if (!r.chiamate) continue;
  moduliScope++; chiamateScopeMod += r.chiamate;
  for (const f of r.fuori) maleScopeMod.push(`${p}: ${f.nome}() alla riga ~${f.riga}`);
}

test("nessun nome chiamato che esiste nel FILE ma non nello SCOPE di chi lo chiama", () => {
  ok(maleScope.length === 0,
    "nomi la cui unica dichiarazione sta in un blocco che NON racchiude la chiamata:\n  "
    + maleScope.join("\n  ")
    + "\n  È l'errore di Terra del 07/08: un omonimo locale a un'altra funzione rendeva"
    + "\n  invisibile un nome mai importato, e il gestore moriva al primo clic.");
});

test("nessun nome fuori dallo SCOPE nei MODULI", () => {
  /* Costo misurato prima di pretenderlo, come per le pagine: 0 allarmi su
     6.698 chiamate e 18 moduli. */
  ok(maleScopeMod.length === 0,
    "nomi la cui unica dichiarazione sta in un blocco che NON racchiude la chiamata, dentro un modulo:\n  "
    + maleScopeMod.join("\n  "));
});

test("la seconda domanda ha davvero guardato", () => {
  ok(pagineScope >= 8, `solo ${pagineScope} pagine guardate dalla seconda domanda`);
  ok(chiamateScope >= 10000, `solo ${chiamateScope} chiamate: troppo poche`);
  ok(moduliScope >= 10, `solo ${moduliScope} moduli guardati dalla seconda domanda`);
  ok(chiamateScopeMod >= 3000, `solo ${chiamateScopeMod} chiamate nei moduli: troppo poche`);
});

test("la controprova della seconda domanda NEI MODULI", () => {
  /* Il caso: un aiuto locale a una funzione, chiamato da un'altra. In un modulo
     è peggio che in una pagina — non fa rumore all'import, esplode quando quella
     riga viene eseguita, cioè magari in un ramo che le prove non toccano.
     `somma` in `terra-data.js` è dichiarata dentro tre funzioni diverse, ognuna
     con la sua: è esattamente la forma dell'omonimo che inganna la prima
     domanda. Si inietta una sua chiamata in `anniConVolumi`, che una `somma`
     non ce l'ha. */
  const rel = "apps/terra/terra-data.js";
  const sano = leggi(rel);
  const guasto = sano.replace("export function anniConVolumi(rilievi, oggi = new Date()) {",
    "export function anniConVolumi(rilievi, oggi = new Date()) {\n  somma(rilievi);");
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const codice = soloCodice(guasto);

  /* la PRIMA domanda resta cieca: `somma` nel file c'è, tre volte */
  ok(nomiLegati(codice).has("somma"),
    "la prima domanda DOVEVA essere cieca (gli omonimi legano il nome): se non lo è più, riscrivi questo commento");

  const { fuori } = fuoriScope(codice);
  ok(fuori.some((f) => f.nome === "somma"),
    "col difetto rimesso, `somma` deve risultare fuori scope in `anniConVolumi` — e non risulta");
  ok(!fuoriScope(soloCodice(sano)).fuori.some((f) => f.nome === "somma"),
    "e sul modulo sano `somma` non dev'essere accusata: le tre dichiarazioni vere stanno dove servono");
});

test("la controprova della SECONDA domanda — il difetto di Terra del 07/08 viene visto", () => {
  /* Si rimette esattamente quello che c'era: `conta` fuori dall'import di
     Terra, mentre nella pagina resta un `const conta = …` locale a un'altra
     funzione — ed è quell'omonimo a rendere la prima domanda cieca. */
  const rel = "apps/terra/index.html";
  const html = leggi(rel);
  const guasto = html.replace(/plurale, conta(,|\s*\})/, "plurale$1");
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const codice = blocchiDi(guasto).map(soloCodice).join("\n;\n");
  ok(/\bconst conta\s*=/.test(codice),
    "serve che nella pagina resti un `const conta` LOCALE: è lui a nascondere il nome libero");
  const { nomi: fratelli } = nomiDegliScriptFratelli(rel, guasto);

  /* la PRIMA domanda, col difetto dentro: deve restare cieca — se un giorno lo
     vedesse, questo racconto è invecchiato e va riscritto, non spento */
  const legati = nomiLegati(codice);
  ok(legati.has("conta"),
    "la prima domanda DOVEVA essere cieca qui (l'omonimo locale lega il nome): se non lo è più, riscrivi questo commento");

  /* la SECONDA: deve vederlo */
  const { fuori } = fuoriScope(codice, fratelli);
  ok(fuori.some((f) => f.nome === "conta"),
    "col difetto rimesso, `conta` deve risultare fuori scope — e non risulta");

  /* e sull'albero sano non deve accusare nessuno: una guardia che si accende
     sempre non è una guardia (è la lezione delle regole Firestore del 07/08) */
  const sano = blocchiDi(html).map(soloCodice).join("\n;\n");
  ok(!fuoriScope(sano, fratelli).fuori.some((f) => f.nome === "conta"),
    "e sulla pagina sana `conta` non dev'essere accusato");
});

/* ── LA TERZA DOMANDA, sulle stesse pagine ───────────────────────────────── */
let visti3 = 0, pagine3 = 0;
const male3 = [];
for (const p of PAGINE) {
  let r;
  try { r = riferimentiLiberi(p); } catch { continue; }
  if (!r.visti) continue;
  pagine3++; visti3 += r.visti;
  for (const [n, c] of r.liberi) male3.push(`${p}: \${${n}} ×${c}`);
}

/* ⛔ E ANCHE I MODULI: lì un nome libero dentro un template non fa rumore
   all'import, esplode quando quella riga viene eseguita — magari in un ramo che
   le prove non toccano. I moduli non hanno script fratelli, quindi il conto è
   più stretto. Costo misurato prima di pretenderlo, con una riga di stampa
   provvisoria e solo dopo trasformata in asserzione. */
let visti3m = 0, moduli3 = 0;
const male3m = [];
for (const p of moduliDelDisco()) {
  let testo;
  try { testo = leggi(p); } catch { continue; }
  const legati = nomiLegati(soloCodice(testo));
  for (const m of testo.matchAll(/\$\{\s*([A-Za-z_$][\w$]*)\s*(\.|\}|\s|\[|\?|\)|,|\+)/g)) {
    const n = m[1];
    visti3m++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n) || legati.has(n)) continue;
    male3m.push(`${p}: \${${n}}`);
  }
  moduli3++;
}

test("nessun nome RIFERITO in un `${…}` che non esiste da nessuna parte", () => {
  ok(male3.length === 0,
    "nomi usati dentro un template e mai dichiarati:\n  " + male3.join("\n  ")
    + "\n  Un nome libero lì uccide il DISEGNO, come una chiamata inesistente uccide il tocco.");
});

test("nessun nome RIFERITO libero nei MODULI", () => {
  ok(male3m.length === 0,
    "nomi usati dentro un template di un modulo e mai dichiarati:\n  " + male3m.slice(0, 12).join("\n  "));
});

test("la terza domanda ha davvero guardato", () => {
  ok(pagine3 >= 8, `solo ${pagine3} pagine guardate dalla terza domanda`);
  ok(visti3 >= 3000, `solo ${visti3} riferimenti guardati: troppo pochi`);
  ok(moduli3 >= 10, `solo ${moduli3} moduli guardati dalla terza domanda`);
  /* ⚠️ 150 e non 200: il 200 l'avevo scritto a occhio e la prova è caduta al
     primo giro su **181** misurati. Una soglia si prende dalla misura, non
     dall'impressione — è la stessa regola dei numeri nei documenti, in
     miniatura. Serve solo a dire «ha guardato», non a fissare un traguardo. */
  ok(visti3m >= 150, `solo ${visti3m} riferimenti nei moduli: troppo pochi (misurati 181 l'08/08)`);
});

test("la controprova della TERZA domanda — un nome usato SOLO dentro un `${…}`", () => {
  /* Il soggetto è scelto perché ha ESATTAMENTE la forma che le prime due
     domande non vedono: `RIPOSO_MINIMO_ORE` è importata da Campo e usata **due
     volte, tutt'e due dentro un template**, mai chiamata. Tolta dall'import, la
     pagina si aprirebbe e morirebbe al primo disegno dell'appello — e le prime
     due domande resterebbero verdi, perché non c'è nessuna `(` da vedere. */
  const rel = "apps/campo/index.html";
  const N = "RIPOSO_MINIMO_ORE";
  const html = leggi(rel);
  ok(new RegExp("\\$\\{" + N + "\\}").test(html), `${N} dev'essere usato dentro un template`);
  const guasto = html.replace(new RegExp("\\s*" + N + ",", ""), "");
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const testo = blocchiDi(guasto).join("\n;\n");
  const legati = nomiLegati(soloCodice(testo));
  const { nomi: fratelli } = nomiDegliScriptFratelli(rel, guasto);
  ok(!legati.has(N) && !fratelli.has(N) && !GLOBALI.has(N),
    `tolto dall'import, ${N} non dev'essere legato altrove — se no la controprova non distingue`);

  /* la PRIMA domanda resta cieca: non c'è nessuna chiamata da vedere */
  let chiamato = false;
  for (const m of soloCodice(testo).matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g)) if (m[2] === N) chiamato = true;
  ok(!chiamato, `la prima domanda DOVEVA essere cieca su ${N}: se ora lo chiama qualcuno, riscrivi questo commento`);

  /* la TERZA lo vede */
  let visto = false;
  for (const m of testo.matchAll(/\$\{\s*([A-Za-z_$][\w$]*)\s*(\.|\}|\s|\[|\?|\)|,|\+)/g)) if (m[1] === N) visto = true;
  ok(visto, `col difetto rimesso, ${N} deve risultare libero in un template — e non risulta`);
  ok(riferimentiLiberi(rel).liberi.size === 0, "e sulla pagina sana non accusa nessuno");
});

console.log(`\nRisultato nomi liberi: ${passed} passati, ${failed} falliti`
  + `  ·  ${chiamateTot} chiamate su ${pagineViste} pagine, ${chiamateMod} su ${moduliVisti} moduli`
  + `  ·  seconda domanda (lo scope): ${chiamateScope} chiamate su ${pagineScope} pagine e ${chiamateScopeMod} su ${moduliScope} moduli, ${maleScope.length + maleScopeMod.length} fuori scope`
  + `  ·  terza domanda (i riferimenti): ${visti3} usi di ${"$"}{…} su ${pagine3} pagine e ${visti3m} su ${moduli3} moduli, ${male3.length + male3m.length} liberi`);
process.exit(failed > 0 ? 1 : 0);

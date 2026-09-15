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
   ⛔ E IL 05/09 LA SECONDA DOMANDA È STATA ESTESA AI RIFERIMENTI NUDI, perché
   guardava solo le CHIAMATE (`nome(`) e due difetti veri nello stesso giorno
   erano nomi nudi: `letture` di Sentinella, dichiarata DENTRO la callback di
   `db.trasforma` e usata FUORI in `{ ...m, valore, letture }` — «Registra»
   scriveva la misura e poi moriva, dall'08/08 — e `per` di Scudo, rimasta
   nella striscia di conferma dell'export dei near-miss quando la `const`
   locale è salita nel modulo, con un omonimo in un'altra funzione a rendere
   cieca la prima domanda. Costo misurato PRIMA su una copia: 74.379
   riferimenti nudi su 12 pagine e 121.320 su moduli e suite, **1 allarme, e
   quello vero** (`per`). Il primo l'ha preso lo scatto, il secondo il righello
   appena scritto.

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
import { execSync } from "node:child_process";
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
  extends super this null true false undefined
  export from as get set`.split(/\s+/).filter(Boolean));

const GLOBALI = new Set(`Object Array String Number Boolean Math JSON Date RegExp Map Set WeakMap WeakSet
  Promise Symbol BigInt Error TypeError RangeError SyntaxError EvalError ReferenceError Function Proxy Reflect Intl
  parseInt parseFloat isNaN isFinite encodeURIComponent decodeURIComponent encodeURI decodeURI eval
  setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame
  queueMicrotask structuredClone fetch alert confirm prompt console window document navigator globalThis self
  location history localStorage sessionStorage indexedDB screen performance crypto URL URLSearchParams
  Blob File FileReader FormData Headers Request Response AbortController Image Audio Option
  Event CustomEvent MutationObserver ResizeObserver IntersectionObserver DOMParser XMLHttpRequest
  TextEncoder TextDecoder Uint8Array Int8Array Uint16Array Int16Array Uint32Array Int32Array
  Float32Array Float64Array ArrayBuffer DataView atob btoa print open close matchMedia getComputedStyle
  scrollTo scrollBy requestIdleCallback CSS Notification WebSocket Worker addEventListener
  removeEventListener dispatchEvent postMessage getSelection
  NaN Infinity caches innerWidth innerHeight devicePixelRatio scrollX scrollY
  NodeFilter Node HTMLElement Element Text Range Storage AbortSignal
  Uint16Array Int32Array Uint32Array`.split(/\s+/).filter(Boolean));
/* ⚠️ LE TRE RIGHE IN FONDO SONO ENTRATE L'08/08, misurando la QUARTA forma (un
   nome riferito **nudo**). Le prime tre domande non le incontravano: `NaN` e
   `Infinity` non si chiamano e non stanno dentro un `${…}`, `innerWidth` e
   `devicePixelRatio` nemmeno. Sono globali veri del browser, non eccezioni —
   e per questo stanno in `GLOBALI` e non in un elenco a parte. */

/* Librerie di terze parti caricate da CDN: non stanno in un file nostro, e il
   loro nome è l'unica cosa che possiamo dichiarare. Corto e con la ragione. */
/* `XLSX` è entrato il 08/08 con la quarta forma: il core lo carica a richiesta
   da `cdn.jsdelivr.net` (index.html, `_loadScript(…/xlsx@0.18.5/…)`) e poi lo
   usa come `XLSX.utils.…`, cioè non lo dichiara mai — come `Chart` e `THREE`. */
const DA_CDN = new Set(["Chart", "THREE", "XLSX"]);

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

/* ⛔ IL NOME CHE UN FILE DÀ ALL'OGGETTO GLOBALE SI DERIVA, NON SI INDOVINA.
   Fino al 08/08 qui si cercava alla lettera `window.X =`, e il commento diceva
   «alcuni file girano in uno IIFE e appendono a `window`» — ma appendono al
   PARAMETRO, non alla parola. `dw-grafici.js` finisce con
   `global.dwGrafici = api;` dentro `(function (global) { … })(typeof window
   !== 'undefined' ? window : globalThis)`: quindi `dwGrafici` risultava libero
   in Campo, Sentinella e Terra, ed erano tre falsi allarmi.
   ⚠️ E LE DUE STESURE SBAGLIATE VANNO LASCIATE SCRITTE, perché il rischio qui
   è la CECITÀ — questo elenco alimenta tutte e quattro le domande, e ogni nome
   che entra è un nome su cui il controllo smette di guardare:
   1. elencare per nome le scritture del globale (`window|globalThis|self|
      global`) fa entrare `_larg` e `_t`, che sono `self._larg = w` con
      `var self = this` — l'idioma più vecchio del mestiere;
   2. prendere ogni `function(x){` per uno IIFE fa entrare `className` e
      `textContent`, cioè le proprietà scritte su un elemento che si chiamava
      `a` o `n`.
   Lo IIFE più esterno invece sta a colonna zero e si chiude a colonna zero:
   quella forma si riconosce senza ambiguità. Misura della stretta giusta:
   **2 nomi in più in tutto** — `dwGrafici` e `dwFluido` — su 325 già legati. */
function aliasDelGlobale(codice) {
  const nomi = new Set(["window", "globalThis"]);
  const apre = codice.match(/^\(function\s*\(\s*([\w$]+)\s*\)\s*\{/m);
  const chiude = codice.match(/^\}\s*\)\s*\(([^\n]*)\)\s*;?\s*$/m);
  if (apre && chiude && /\b(?:window|globalThis)\b/.test(chiude[1])) nomi.add(apre[1]);
  return nomi;
}

/* Gli script fratelli che la pagina dichiara, letti dal disco. I nomi che
   espongono sono quelli che finiscono sull'oggetto globale — comunque quel
   file lo chiami — più le loro dichiarazioni di primo livello. */
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
    const alias = aliasDelGlobale(codice);
    for (const x of codice.matchAll(/\b([\w$]+)\.([\w$]+)\s*=[^=]/g)) if (alias.has(x[1])) nomi.add(x[2]);
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
  /* ⛔ `\s*` E NON `\s+`: `for (const[campo,chiave] of …)` — senza spazio dopo
     `const` — esiste, ed è scritto due volte nel core. Con `\s+` quella
     dichiarazione non veniva vista affatto, e i due nomi risultavano LIBERI.
     Il `\b` dopo la parola impedisce di agganciare `constante`. */
  const re = /\b(?:const|let|var)\b\s*(?=[\[{\w$])/g;
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
      /* ⛔ UN A CAPO CHIUDE LA DICHIARAZIONE SOLO SE LA CHIUDE DAVVERO. Il
         dichiaratore multi-riga esiste ed è frequente:
             const numero = …, scelta = …,
                   nuovoCli = …,
         e fermandosi al primo `\n` tutto quello che sta sotto risultava
         LIBERO — quattro nomi sani accusati, più `_fSW` di Genesi. Si guarda
         l'ultimo carattere non bianco prima dell'a capo: se è una virgola, la
         dichiarazione continua. */
      if (fuori && c === ";") break;
      if (fuori && c === "\n" && !/,\s*$/.test(codice.slice(Math.max(0, i - 200), i))) break;
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
  /* ⛔ UN LIVELLO DI PARENTESI ANNIDATE, se no il valore di default TRONCA
     l'elenco dei parametri. `export function statoScadenzaMezzo(dataISO,
     oggi = new Date(), preavvisoGiorni = 30)`: con `[^)]*` la cattura finisce
     sulla parentesi di `new Date()` e **tutto quello che viene dopo resta
     libero** — `preavvisoGiorni` ×10 in Flotta, `semestre` ×4 in Conti,
     `orizzonte` ×6, e così via. Otto dei nove allarmi rimasti erano questo.
     `(?:[^()]|\([^()]*\))*` non è ambiguo — le due alternative si distinguono
     al primo carattere — quindi non fa backtracking.
     ⚠️ IL COSTO DELLA STRETTA È MISURATO E DICHIARATO, non arrotondato: fra
     questa correzione e i parametri dei metodi entrano **24 nomi** su 10.711
     già legati, in 4 file. Diciannove sono parametri veri; tre sono cifre
     (`3`, `7`, `12`) che non possono essere giudicate comunque; `null` è già
     una parola chiave. Resta **UNA sola cecità vera**, e va detta:
     **`getFullYear`**, che arriva dallo spezzare un valore di default come
     `new Date().getFullYear()`. Da oggi una chiamata nuda a `getFullYear(…)`
     in `conti-data.js` e `scudo-data.js` sarebbe scusata. Un nome contro
     diciannove falsi allarmi in meno. */
  agg(/\bfunction[^(]*\(((?:[^()]|\([^()]*\))*)\)/g);
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
  /* ⛔ E I LORO PARAMETRI, che la riga qui sopra non lega: lì il gruppo è il
     NOME del metodo. Un metodo abbreviato non ha la parola `function`, quindi
     `agg(/\bfunction[^(]*\(([^)]*)\)/)` non lo incontra e i suoi parametri
     restano liberi: `_entitlementAttivo(ent, tier = null)` dava `ent` ×5 e
     `tier` ×5 nell'SDK. Non si vedeva perché le prime tre domande un
     parametro non lo incontrano — non si chiama e non sta in un `${…}`.
     ⚠️ LA PAROLA CHIAVE VA ESCLUSA, se no il rimedio è peggio del male:
     `[\w$]+` combacia anche con `if`, `for`, `while`, `switch`, e allora
     TUTTO quello che sta dentro una condizione risulterebbe legato — cioè il
     controllo diventerebbe cieco proprio dove il codice lavora. */
  /* ⚠️ E LO SPAZIO SI SCRIVE `[ \t]`, NON `\s`. La prima stesura ricopiava il
     prefisso della riga qui sopra (`\s*(?:static\s+)?(?:async\s+)?\*?\s*`) e
     la suite non finiva più: due `\s*` separati da gruppi opzionali che a
     loro volta possono mangiare spazi danno un numero enorme di modi di
     spezzare la stessa indentazione, e quando la coda fallisce — cioè quasi
     sempre — il motore li prova tutti. Con `[ \t]` gli a capo non entrano
     nell'ambiguità e il conto torna lineare. Misurato: da «non finisce» a
     pochi secondi. */
  agg(/(?:^|\n)[ \t]*(?:static[ \t]+)?(?:async[ \t]+)?(?!(?:if|for|while|switch|catch|with|function|return|do|else|new|typeof|await|yield)\b)[\w$]+[ \t]*\(((?:[^()]|\([^()]*\))*)\)[ \t]*\{/g);
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

/* ⛔ LE SUITE NON ERANO GUARDATE DA NESSUNO, e il «0 fuori scope» stampato qui
   sotto non poteva vederle: `moduliDelDisco` esclude la cartella `tests` per
   costruzione e prende solo i `.js`, mentre le suite sono `.mjs`. Il suo zero
   era vero **sul suo denominatore**, e il suo denominatore non conteneva il
   posto dove il difetto è successo il 14/08 — un `MODULI is not defined` in
   `run-kpi.mjs`, scritto da un cantiere e corretto trenta secondi dopo da un
   altro. Un nome libero in una suite non «apre la pagina e muore al primo
   tocco»: fa **crollare la suite al primo lancio**, quindi si scopre in
   minuti. Ma «si scopre presto» non è «è guardato», ed è la differenza fra un
   controllo e la fortuna.
   ⚠️ IL COSTO DELLA STRETTA È STATO MISURATO PRIMA DI FARLA, come pretende la
   regola: allargando **tutte e cinque** le domande alle suite i moduli passano
   da 18 a **60** e le chiamate da 7.330 a **25.040**, e gli allarmi nuovi sono
   **0 sulle prime due** (nomi chiamati, e nomi fuori dallo scope) e **45 sulle
   altre tre** — 9 riferimenti dentro `${…}` e 36 nudi. Guardati uno per uno,
   quei 45 sono di due famiglie sole, tutt'e due legittime: i **globali di
   Node** che questo controllo non conosce (`process`), e il **codice scritto
   come stringa** che le suite si costruiscono per iniettarlo (`${xQ}`,
   `${CSS_ESEMPIO}`, `${dup}` — pezzi di pagina finta, non riferimenti veri).
   Quindi entrano le due domande che costano zero, e le altre tre **dichiarano
   di non guardare le suite** invece di tacere. */
const FUORI_BROWSER = "apps/deepwork-id/tests/browser/";
function tutteLeSuite() {
  try {
    return execSync("git ls-files -- 'apps/deepwork-id/tests/*.mjs'",
      { cwd: RADICE, encoding: "utf8" }).trim().split("\n").map((s) => s.trim()).filter(Boolean);
  } catch (e) { return []; }
}
/* ⛔ I BANCHI DEL BROWSER RESTANO FUORI, ED È UN'ECCEZIONE DICHIARATA, NON UNA
   DIMENTICANZA. Il loro codice vive per metà dentro `page.evaluate()`, cioè in
   un TERZO ambiente: né Node né i nostri moduli, ma il browser, con i suoi
   globali (`KeyboardEvent`, `PointerEvent`, `Uint8ClampedArray`, `focus`) e
   perfino i globali della PAGINA che stanno provando (`nav`). Misurato
   allargandoci sopra: **8 allarmi, tutti e otto di quella famiglia, zero
   difetti veri**. Aggiungerli a mano a un elenco di nomi noti sarebbe un
   elenco senza fondo — i globali di una pagina sono quanti ne scrive la pagina.
   ⚠️ E vale l'avvertimento che questo repository si è già dato: un'eccezione
   dichiarata onestamente **resta un posto in cui nessuno guarda**. Perciò non
   è solo scritta: il riepilogo stampa **quanti file** restano fuori, così il
   giorno che qualcuno voglia coprirli il numero è lì e non va ricontato. */
function suiteDelDisco() {
  return tutteLeSuite().filter((p) => !p.startsWith(FUORI_BROWSER));
}
function banchiFuori() {
  return tutteLeSuite().filter((p) => p.startsWith(FUORI_BROWSER));
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
  /* ⛔ `\s*` E NON `\s+`: `for (const[campo,chiave] of …)` — senza spazio dopo
     `const` — esiste, ed è scritto due volte nel core. Con `\s+` quella
     dichiarazione non veniva vista affatto, e i due nomi risultavano LIBERI.
     Il `\b` dopo la parola impedisce di agganciare `constante`. */
  const re = /\b(?:const|let|var)\b\s*(?=[\[{\w$])/g;
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
      /* ⛔ UN A CAPO CHIUDE LA DICHIARAZIONE SOLO SE LA CHIUDE DAVVERO. Il
         dichiaratore multi-riga esiste ed è frequente:
             const numero = …, scelta = …,
                   nuovoCli = …,
         e fermandosi al primo `\n` tutto quello che sta sotto risultava
         LIBERO — quattro nomi sani accusati, più `_fSW` di Genesi. Si guarda
         l'ultimo carattere non bianco prima dell'a capo: se è una virgola, la
         dichiarazione continua. */
      if (fuori && c === ";") break;
      if (fuori && c === "\n" && !/,\s*$/.test(codice.slice(Math.max(0, i - 200), i))) break;
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

/* La stessa domanda sui riferimenti NUDI (05/09): non `nome(` ma `nome` da
   solo — una scorciatoia di oggetto, un argomento, un operando. Stesso
   scandaglio delle dichiarazioni, stessa ancora sul blocco, stessa regex del
   riferimento nudo della quarta domanda (con i flag di regex esclusi per
   posizione). Prende `grezzo` e non `codice` perché la maschera serve a
   riconoscere la barra che chiude una regex. */
export function fuoriScopeNudi(grezzo, daiFratelli = new Set()) {
  const codice = soloCodice(grezzo);
  const masc = mascheraCodice(grezzo);
  const blocchiDelNome = new Map();
  for (const [n, at] of dichiarazioniConPosizione(codice)) {
    if (!blocchiDelNome.has(n)) blocchiDelNome.set(n, []);
    blocchiDelNome.get(n).push(bloccoAttorno(codice, at));
  }
  const altrove = nomiLegati(codice, false);
  const fuori = [];
  let visti = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?'"`])([A-Za-z_$][\w$]*)\b(?!\s*[(:])/g)) {
    const n = m[2];
    const j = m.index + m[1].length;
    if (j > 0 && grezzo[j - 1] === "/" && !masc[j - 1]) continue;
    visti++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n)) continue;
    if (altrove.has(n) || daiFratelli.has(n) || !blocchiDelNome.has(n)) continue;
    if (blocchiDelNome.get(n).some(([a, z]) => j > a && j < z)) continue;
    fuori.push({ nome: n, riga: codice.slice(0, j).split("\n").length });
  }
  return { fuori, visti };
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

/* ⛔ LA QUARTA FORMA: UN NOME RIFERITO **NUDO** — `const x = pippo`,
   `f(a, pippo)`, `return pippo`. Fuori dai template, e fuori dalle chiamate.
   ⚠️ E la misura ha SMENTITO l'aspettativa, che è il motivo per cui si misura:
   me l'ero segnata come «rumore atteso molto più alto, potrebbe dire di
   lasciar perdere». Con un elenco di globali scritto a mano per l'occasione
   dava **17 nomi** su 68.851 riferimenti; ma quei diciassette erano quasi tutti
   `toast`, `chiudiModale`, `dwGrafici` — cioè **script fratelli** — più
   `NaN`, `AbortSignal`, `devicePixelRatio`. Riusando gli elenchi VERI di questo
   file non resta niente. Il costo era un'impressione, non un numero.
   ⛔ MESSA A TERRA CON GLI ELENCHI VERI e corretta due volte, la misura è scesa
   a **7** — e il percorso 35 → 34 → 9 → 7 vale più del numero d'arrivo, perché ogni
   scalino era il RIGHELLO e non il prodotto. Le cause, tutte misurate:
     1. **globali e parole chiave** che l'elenco non ha ancora (`NaN`,
        `Infinity`, `AbortSignal`, `caches`, `innerWidth`, `innerHeight`,
        `devicePixelRatio`, `from`, `as`, `get`) e una libreria da CDN
        (`XLSX`): una decina di nomi, **dichiarabili per nome**;
     2. ⛔ **UNA DICHIARAZIONE SENZA SPAZIO**, e la prima diagnosi era SBAGLIATA:
        avevo scritto «sono commenti, serve `senzaCommenti`». Falso, e
        verificato mascherando il core e cercando il nome nel codice **vivo**:
        `chiave` sopravvive alla maschera perché sta in
        `for(const[campo,chiave]of[…])` — **`const[` senza spazio**. Il
        riconoscitore chiedeva `\s+` e quella dichiarazione non la vedeva
        affatto, quindi i due nomi risultavano liberi. `mascheraCodice` i
        commenti li toglie già (sono `COMMENTO`, non `CODICE`): il tokenizzatore
        era quello giusto, a sbagliare era il riconoscitore. Corretto con
        `\b…\b\s*` e un lookahead: nel repository quella forma compare **due
        volte**, tutt'e due nel core;
     3. **i flag di una regex**: `gu ×1` in Conti è `/…/gu`.
   ⏱️ **E i NOVE che restano sono ancora tutti del righello o dichiarabili**,
   censiti uno per uno perché chi chiude questa forma non li ricerchi:
     · `XLSX ×8` (core) — libreria da CDN: va in `DA_CDN`, con la ragione;
     · `dwGrafici ×5/×3/×6` (Campo, Sentinella, Terra) — arriva da uno **script
       fratello** che non lo espone con `window.X =`, la forma che
       `nomiDegliScriptFratelli` cerca;
     · `gu ×1` (Conti) — i **flag di una regex**, `/…/gu`;
     · ✅ `nuovoCli ×4`, `aliquota ×3` — erano il **dichiaratore su più righe**
       (`const numero = …, scelta = …,` a capo `nuovoCli = …`): `nomiDichiarati`
       si fermava al `\n`, quindi tutto ciò che stava sotto la prima riga
       risultava libero. Stessa causa di `_fSW`, e **non riguardava solo questa
       forma** — quel riconoscitore sta sotto la prima e la seconda domanda.
       **Chiuso l'08/08**: un a capo termina la dichiarazione solo se l'ultimo
       carattere non bianco prima non è una virgola. 9 → 7, e le tre controprove
       con dentro un difetto vero restano tutte rosse quando devono — che è la
       prova del **secondo verso**, l'unico che conta quando si ALLARGA un
       riconoscitore: allargando si rischia di rendere il controllo cieco, non
       rumoroso;
     · `carburante ×1`, `i ×1` — il **testo di un template**: la parola sta
       nella parte letterale di una `` ` ``, fra due `${…}`. Da guardare
       insieme a `dwGrafici`, non prima.
   Cioè la quarta forma **si può fare** — l'aspettativa «rumore troppo alto,
   lasciar perdere» era sbagliata. Resta **misura** finché il dichiaratore
   multi-riga non è chiuso: una guardia che accusa a vuoto insegna a non
   guardarla, e qui accuserebbe **codice sano**.
   ⚠️ Prima ancora, il righello: senza `\b` davanti al lookahead la regex fa
   backtracking e combacia con un PREFISSO del nome — «escHtml» → «escHtm»,
   «toast» → «toas», 3.354 allarmi tronchi di una lettera. Quarto righello
   storto della notte, e il segno era leggibile subito. */
/* ⚠️ `htmlDato` serve alla controprova, e c'è per non RICOPIARE il corpo.
   La prima stesura rifaceva questo ciclo dentro il test per poter iniettare il
   difetto senza scrivere su disco: due copie che oggi sono uguali e domani
   divergono senza che nessuno lo veda — è la regola di CLAUDE.md, «una copia
   nasce quasi sempre da una firma troppo stretta». Un argomento, non un gemello. */
export function nudiLiberi(relPagina, htmlDato = null) {
  const html = htmlDato === null ? leggi(relPagina) : htmlDato;
  const bl = blocchiDi(html);
  if (!bl.length) return { visti: 0, liberi: new Map() };
  const grezzo = bl.join("\n;\n");
  const codice = soloCodice(grezzo);
  const masc = mascheraCodice(grezzo);
  const legati = nomiLegati(codice);
  const { nomi: fratelli } = nomiDegliScriptFratelli(relPagina, html);
  const liberi = new Map();
  let visti = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?'"`])([A-Za-z_$][\w$]*)\b(?!\s*[(:])/g)) {
    const n = m[2];
    /* ⛔ I FLAG DI UNA REGEX NON SONO UN NOME. `/[^\p{L}\s]/gu` lascia dietro
       di sé un `gu` che sembra un riferimento nudo: il corpo della regex è
       mascherato, ma le lettere DOPO la barra di chiusura no. Non si
       riconoscono dalla forma — `i`, `g`, `s` sono anche nomi di variabile
       veri — ma dalla POSIZIONE, che la maschera sa dire alla lettera: la
       barra che chiude una regex è l'unico `/` marcato come non-codice. */
    const j = m.index + m[1].length;
    if (j > 0 && grezzo[j - 1] === "/" && !masc[j - 1]) continue;
    visti++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n)
        || legati.has(n) || fratelli.has(n)) continue;
    liberi.set(n, (liberi.get(n) || 0) + 1);
  }
  return { visti, liberi };
}

/* ⏱️ LA QUARTA FORMA NEI MODULI — il buco che il riepilogo dichiarava.
   Nelle pagine è già regola; qui parte come MISURA, che è il modo in cui è
   nata anche di là: una guardia che accusa codice sano insegna a non
   guardarla, quindi prima si conta e poi si pretende.
   ⚠️ E la misura fatta in scratchpad NON vale e non va riportata: 60 allarmi
   su 38.119, ma tre allarmi guardati su tre erano il **righello** — avevo
   riscritto una versione più debole di `nomiLegati` invece di usarlo. Qui
   `nomiLegati` è quello vero, e la differenza è tutta lì. */
export function nudiLiberiModulo(rel, testoDato = null) {
  const grezzo = testoDato === null ? leggi(rel) : testoDato;
  /* ⛔ UNA RI-ESPORTAZIONE NON È UN RIFERIMENTO. `export { ESITI_TURNO,
     statoScadenzaHSE } from "…/dw-ponti.js"` non dichiara e non usa quei nomi:
     li **inoltra**, e chi li risolve è il modulo dall'altra parte. Campo ne
     dava sei, tutti sani. Si toglie solo la forma CON `from` — in un
     `export { a, b }` senza `from` i nomi sono locali, e lì restano legati
     dalle loro dichiarazioni come è giusto. */
  const codice = soloCodice(grezzo).replace(/export\s*\{[^}]*\}\s*from/g, (s) => " ".repeat(s.length));
  const masc = mascheraCodice(grezzo);
  const legati = nomiLegati(codice);
  const liberi = new Map();
  let visti = 0;
  for (const m of codice.matchAll(/(^|[^\w$.?'"`])([A-Za-z_$][\w$]*)\b(?!\s*[(:])/g)) {
    const n = m[2];
    const j = m.index + m[1].length;
    if (j > 0 && grezzo[j - 1] === "/" && !masc[j - 1]) continue;
    visti++;
    if (PAROLE.has(n) || GLOBALI.has(n) || DA_CDN.has(n) || SINTASSI_E_NODE.has(n) || legati.has(n)) continue;
    liberi.set(n, (liberi.get(n) || 0) + 1);
  }
  return { visti, liberi };
}

/* ⏱️ LA QUINTA DOMANDA — il verso opposto delle prime quattro.
   Quelle chiedono «questo nome esiste?»; questa chiede «questo nome, che
   esiste, serve a qualcuno?». Non è un errore duro: un import inutile è
   **inerte**, la pagina si apre e funziona. Il danno è un altro, ed è di
   lettura: **mente sul legame fra due file**. Chi apre la pagina di Terra
   crede che usi `SOGLIA_TURNI`; chi tocca `terra-data.js` crede di avere un
   consumatore in più e sta attento a non cambiarne il significato. È la stessa
   famiglia dell'eccezione che non serve più (`sonda-vuoto`): una riga che
   descrive un rapporto che non c'è.
   ⚠️ SI LEGGE NEL MODO PIÙ PRUDENTE, cioè su TUTTO il testo e non sul codice
   mascherato: un nome può comparire dentro un `${…}`, dentro un attributo
   `on*`, o dentro una stringa che poi diventa codice. Se questo righello
   sbaglia, sbaglia dicendo «è usato» — che è il verso giusto in cui sbagliare
   per una domanda che propone di CANCELLARE righe. */
export function importatiInerti(rel, testoDato = null) {
  const src = testoDato === null ? leggi(rel) : testoDato;
  const testo = rel.endsWith(".html") ? blocchiDi(src).join("\n;\n") : src;
  const inerti = [];
  let guardati = 0;
  if (!testo.trim()) return { guardati, inerti };
  for (const m of testo.matchAll(/import\s*\{([^}]*)\}\s*from[^\n;]*/g)) {
    const clausola = m[0];
    /* si toglie la clausola stessa, se no ogni nome «si usa» da sé */
    const resto = testo.slice(0, m.index) + " ".repeat(clausola.length) + testo.slice(m.index + clausola.length);
    for (const pezzo of m[1].split(",")) {
      const n = pezzo.trim().split(/\s+as\s+/).pop().trim();
      if (!n || !/^[A-Za-z_$][\w$]*$/.test(n)) continue;
      guardati++;
      if (!new RegExp("(^|[^\\w$])" + n + "($|[^\\w$])").test(resto)) inerti.push(n);
    }
  }
  return { guardati, inerti };
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
/* le SUITE entrano qui: costo misurato 0 allarmi nuovi, +42 file, +17.710
   chiamate. Vedi la ragione sopra `suiteDelDisco`. */
for (const p of moduliDelDisco().concat(suiteDelDisco())) {
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

test("la controprova delle SUITE — il nome libero del 14/08 viene visto", () => {
  /* ⛔ Il difetto vero, rimesso: il 14/08 un cantiere ha scritto `MODULI.flotta`
     dentro `run-kpi.mjs` mentre `MODULI` viveva nello scope del blocco di un
     ALTRO cantiere. La suite è crollata al primo lancio — quindi si è scoperto
     in minuti, ed è la ragione per cui questa famiglia costa meno in una suite
     che in una pagina. Ma «si scopre presto» non è «è guardato»: fino a oggi
     nessun controllo lo vedeva, perché l'elenco dei soggetti escludeva
     `tests/` per costruzione e prendeva solo i `.js`.
     Si lavora sul TESTO, senza toccare il disco. */
  const suite = suiteDelDisco();
  ok(suite.length >= 20, `solo ${suite.length} suite guardate: l'elenco non sta guardando dove crede`);
  const rel = "apps/deepwork-id/tests/run-kpi.mjs";
  ok(suite.includes(rel), `${rel} deve stare fra i soggetti, e non c'è`);
  const sano = leggi(rel);
  ok(!/nomeCheNonEsisteMai/.test(sano), "run-kpi dev'essere sana prima di guastarla");
  const guasto = sano + "\nnomeCheNonEsisteMai(1);\n";
  const codice = soloCodice(guasto);
  const legati = nomiLegati(codice);
  let visto = false;
  for (const m of codice.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g))
    if (m[2] === "nomeCheNonEsisteMai" && !PAROLE.has(m[2]) && !GLOBALI.has(m[2]) && !legati.has(m[2])) visto = true;
  ok(visto, "con il nome libero rimesso in una SUITE, il controllo deve vederlo — e non lo vede");
  /* e il verso opposto: un nome dichiarato lì dentro NON deve risultare libero,
     se no la guardia scatterebbe sempre e verrebbe spenta al secondo giro */
  const conDichiarazione = sano + "\nconst nomeCheNonEsisteMai = () => 1;\nnomeCheNonEsisteMai(1);\n";
  const legati2 = nomiLegati(soloCodice(conDichiarazione));
  ok(legati2.has("nomeCheNonEsisteMai"), "e un nome dichiarato nella suite non dev'essere sospetto");
});

test("i banchi del browser restano fuori CON il numero, non in silenzio", () => {
  /* l'eccezione è dichiarata sopra `suiteDelDisco`; qui si pretende che sia
     anche CONTATA — un'eccezione che non si conta è un posto in cui nessuno
     guarda, e questo repository l'ha già pagato. */
  const fuori = banchiFuori();
  ok(fuori.length > 0, "nessun banco del browser trovato: l'elenco non sta guardando dove crede");
  ok(fuori.every((p) => p.startsWith(FUORI_BROWSER)), "fuori dev'esserci SOLO la cartella dei banchi");
  ok(suiteDelDisco().every((p) => !p.startsWith(FUORI_BROWSER)), "e dentro non dev'esserci nessun banco");
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
/* e anche qui: sono le due domande che avrebbero visto il `MODULI is not
   defined` del 14/08 in `run-kpi.mjs`. */
for (const p of moduliDelDisco().concat(suiteDelDisco())) {
  let codice;
  try { codice = soloCodice(leggi(p)); } catch { continue; }
  const r = fuoriScope(codice);
  if (!r.chiamate) continue;
  moduliScope++; chiamateScopeMod += r.chiamate;
  for (const f of r.fuori) maleScopeMod.push(`${p}: ${f.nome}() alla riga ~${f.riga}`);
}

/* ── e la stessa domanda sui riferimenti NUDI (05/09) ───────────────────── */
let nudiScope = 0, pagineNudiScope = 0;
const maleNudiScope = [];
for (const p of PAGINE) {
  let html;
  try { html = leggi(p); } catch { continue; }
  const bl = blocchiDi(html);
  if (!bl.length) continue;
  const { nomi: fratelli } = nomiDegliScriptFratelli(p, html);
  const r = fuoriScopeNudi(bl.join("\n;\n"), fratelli);
  pagineNudiScope++; nudiScope += r.visti;
  for (const f of r.fuori) maleNudiScope.push(`${p}: ${f.nome} alla riga ~${f.riga} del codice in linea`);
}
let nudiScopeMod = 0, moduliNudiScope = 0;
const maleNudiScopeMod = [];
for (const p of moduliDelDisco().concat(suiteDelDisco())) {
  let t;
  try { t = leggi(p); } catch { continue; }
  /* una ri-esportazione non è un riferimento (stessa ragione della quarta domanda) */
  const r = fuoriScopeNudi(t.replace(/export\s*\{[^}]*\}\s*from/g, (x) => " ".repeat(x.length)));
  if (!r.visti) continue;
  moduliNudiScope++; nudiScopeMod += r.visti;
  for (const f of r.fuori) maleNudiScopeMod.push(`${p}: ${f.nome} alla riga ~${f.riga}`);
}

test("nessun nome RIFERITO NUDO che esiste nel FILE ma non nello SCOPE di chi lo usa", () => {
  ok(maleNudiScope.length === 0,
    "nomi nudi la cui unica dichiarazione sta in un blocco che NON racchiude l'uso:\n  "
    + maleNudiScope.join("\n  ")
    + "\n  È `letture` di Sentinella (dichiarata nella callback della transazione, usata dopo)"
    + "\n  e `per` di Scudo (la const salita nel modulo, la striscia rimasta): il gestore muore DOPO aver scritto.");
});

test("nessun nome RIFERITO NUDO fuori dallo SCOPE nei MODULI e nelle SUITE", () => {
  /* Costo misurato prima di pretenderlo: 0 allarmi su 121.320 riferimenti. */
  ok(maleNudiScopeMod.length === 0,
    "nomi nudi fuori scope dentro un modulo o una suite:\n  " + maleNudiScopeMod.join("\n  "));
});

test("la seconda domanda sui riferimenti nudi ha davvero guardato", () => {
  ok(pagineNudiScope >= 8, `solo ${pagineNudiScope} pagine guardate`);
  ok(nudiScope >= 50000, `solo ${nudiScope} riferimenti nudi nelle pagine: troppo pochi (misurati 74.379 il 05/09)`);
  ok(moduliNudiScope >= 15, `solo ${moduliNudiScope} moduli e suite guardati`);
  ok(nudiScopeMod >= 80000, `solo ${nudiScopeMod} riferimenti nudi in moduli e suite: troppo pochi (misurati 121.320 il 05/09)`);
});

test("la controprova sui riferimenti nudi — `letture` di Sentinella (08/08 → 05/09) viene vista", () => {
  /* Si rimette esattamente quello che c'era: la `const` DENTRO la callback di
     `db.trasforma`, e l'uso `{ ...m, valore, letture }` venti righe dopo. */
  const rel = "apps/sentinella/index.html";
  const html = leggi(rel);
  const da = "    let letture = [];\n    await db.trasforma(\"monitoraggi\", id, (m2) => {\n      letture = [";
  const a = "    await db.trasforma(\"monitoraggi\", id, (m2) => {\n      const letture = [";
  const guasto = html.replace(da, a);
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const { nomi: fratelli } = nomiDegliScriptFratelli(rel, guasto);
  const grezzo = (h) => blocchiDi(h).join("\n;\n");
  /* le domande sulle CHIAMATE restano cieche: `letture` non è mai chiamata */
  ok(!fuoriScope(soloCodice(grezzo(guasto)), fratelli).fuori.some((f) => f.nome === "letture"),
    "la seconda domanda sulle chiamate DOVEVA essere cieca qui: se non lo è più, riscrivi questo commento");
  ok(fuoriScopeNudi(grezzo(guasto), fratelli).fuori.some((f) => f.nome === "letture"),
    "col difetto rimesso, `letture` deve risultare fuori scope — e non risulta");
  ok(!fuoriScopeNudi(grezzo(html), fratelli).fuori.some((f) => f.nome === "letture"),
    "e sulla pagina sana `letture` non dev'essere accusata");
});

test("la controprova sui riferimenti nudi — `per` di Scudo (05/09) viene visto, con l'omonimo che acceca la prima domanda", () => {
  const rel = "apps/scudo/index.html";
  const html = leggi(rel);
  const guasto = html.replace('esportato (" + etichettaPeriodoNearMiss(nmPeriodo) + ").", "success");',
                              'esportato (" + per + ").", "success");');
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const grezzo = (h) => blocchiDi(h).join("\n;\n");
  const codice = soloCodice(grezzo(guasto));
  /* il contenuto della stringa è mascherato da `soloCodice`: si cerca la forma, non l'id */
  ok(/\bper = \$\(/.test(codice),
    "serve che nella pagina resti un `per` dichiarato ALTROVE: è lui a nascondere il nome libero");
  ok(nomiLegati(codice).has("per"),
    "la prima domanda DOVEVA essere cieca qui (l'omonimo lega il nome): se non lo è più, riscrivi questo commento");
  const { nomi: fratelli } = nomiDegliScriptFratelli(rel, guasto);
  ok(fuoriScopeNudi(grezzo(guasto), fratelli).fuori.some((f) => f.nome === "per"),
    "col difetto rimesso, `per` deve risultare fuori scope — e non risulta");
  ok(!fuoriScopeNudi(grezzo(html), fratelli).fuori.some((f) => f.nome === "per"),
    "e sulla pagina sana `per` non dev'essere accusato");
});

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
  /* ⏱️ dal 05/09 la pagina NON ha più un `const conta` locale: stava in
     `fogliaStampa`, salita nel modulo con `prospettoDenuncia`. Il racconto è
     sull'omonimo che nasconde, quindi la controprova lo rimette INSIEME al
     difetto — nella stessa funzione in cui viveva — invece di pretendere che
     la pagina lo tenga per sempre. */
  const guasto = html.replace(/plurale, conta(,|\s*\})/, "plurale$1")
    .replace("function fogliaStampa() {", "function fogliaStampa() {\n    const conta = 0;");
  ok(guasto !== html && guasto.includes("const conta = 0;"), "l'iniezione non ha sostituito niente: la prova non prova niente");
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

/* la QUARTA forma, sulle stesse pagine */
let visti4 = 0, pagine4 = 0;
const male4 = [];
for (const p of PAGINE) {
  let r;
  try { r = nudiLiberi(p); } catch { continue; }
  if (!r.visti) continue;
  pagine4++; visti4 += r.visti;
  for (const [n, c] of r.liberi) male4.push(`${p}: ${n} ×${c}`);
}
console.log(`   [misura] quarta forma (riferimenti nudi): ${visti4} su ${pagine4} pagine, ${male4.length} liberi`);
for (const x of male4.slice(0, 15)) console.log("      · " + x);

/* la stessa forma nei MODULI, ancora come misura */
let visti4m = 0, moduli4 = 0;
const male4m = [];
for (const p of moduliDelDisco()) {
  let r;
  try { r = nudiLiberiModulo(p); } catch { continue; }
  if (!r.visti) continue;
  moduli4++; visti4m += r.visti;
  for (const [n, c] of r.liberi) male4m.push(`${p}: ${n} ×${c}`);
}
console.log(`   [misura] quarta forma nei MODULI: ${visti4m} su ${moduli4} moduli, ${male4m.length} liberi`);
for (const x of male4m.slice(0, 20)) console.log("      · " + x);

/* ⛔ LA QUINTA DOMANDA RESTA UNA MISURA, E ADESSO LA DECISIONE È SCRITTA COI
   NUMERI — se no rinasce da sola, come è già successo in questa casa con la
   scala `--nav-scala` e con la somma parziale delle frasi.
   La riga di prima diceva «diventa regola quando il conto è a zero, cioè
   quando le righe inerti sono state tolte dalle pagine». Provata l'08/08
   guardando i **60 inerti uno per uno**, e la conclusione è l'opposta:
   **non vanno tolte, e la regola non si fa.**
   Perché un import inerte NON è un difetto, e i campioni lo dicono:
     · `campo: csvCell` — Campo non compone più nessuna cella a mano: i suoi
       quattro file li costruiscono `csvAppello`, `csvStorico`, `csvAttivita` e
       `csvSquadre` nel modulo. L'import è il residuo di un refactor **giusto**;
     · `sentinella: CSV_VOLATE_INTESTAZIONE` e `CSV_RICETTORI_INTESTAZIONE` —
       le intestazioni le usa il modulo dentro `csvRegistroVolate` e
       `csvRicettori`, cioè la pagina delega invece di ricopiare;
     · `flotta: AVVISO_DECIMALE` e `AVVISO_MIGLIAIA` — li mostra già, ma
       attraverso `messaggioNumero`, che li porta dentro di sé.
   Cioè: **l'inerzia di un import è quasi sempre il segno che una decisione è
   salita dove doveva**, non che qualcuno l'ha persa. Toglierli sarebbe toccare
   dieci pagine per zero difetti misurati.
   ⚠️ E la versione STRETTA della domanda — quella che avrebbe un senso, «la
   pagina importa una costante di testo E scrive lo stesso testo a mano?» — è
   stata provata e scartata anche lei, col suo conto: dà **2 allarmi, tutti e
   due falsi**, e sono le due righe di Flotta che scrivono l'avviso sulle
   migliaia **con l'esempio del proprio campo** («6000, non 6.000» invece del
   generico «1250, non 1.250»). Non è una copia debole: è una
   specializzazione, ed è migliore della costante. Due falsi allarmi e zero
   veri non si meritano una regola.
   Resta la MISURA, che serve: un numero che salta di colpo dice che qualcuno
   ha spostato del codice, ed è il momento di guardare. */
let importati5 = 0, file5 = 0;
const inerti5 = [];
for (const p of PAGINE.concat(moduliDelDisco())) {
  let r;
  try { r = importatiInerti(p); } catch { continue; }
  if (!r.guardati) continue;
  file5++; importati5 += r.guardati;
  for (const n of r.inerti) inerti5.push(`${p}: ${n}`);
}
console.log(`   [misura] quinta forma (importati e mai usati): ${importati5} import su ${file5} file, ${inerti5.length} inerti`
  + `  ·  MISURA, e non diventerà una regola: guardati uno per uno l'08/08, sono residui di refactor GIUSTI`);
for (const x of inerti5.slice(0, 12)) console.log("      · " + x);
if (inerti5.length > 12) console.log(`      … e altri ${inerti5.length - 12}`);

/* ⛔ E ANCHE NEI MODULI DIVENTA REGOLA, nella stessa unità — perché la strada
   dai 67 allarmi allo zero è stata tutta di RIGHELLO, e nessuno di prodotto:
   1. i **parametri dei metodi abbreviati**: `nomiLegati` legava il NOME del
      metodo e non i suoi argomenti, perché un metodo non ha la parola
      `function` (11 allarmi nel solo SDK);
   2. le **ri-esportazioni**: `export { A, B } from "…"` non dichiara e non usa,
      inoltra (6 in Campo);
   3. `globalThis` e `self` mancanti fra i globali — e `self` è il globale di un
      **service worker**, dove non c'è nessun `window` (5 in `genesi-sw.js`);
   4. il **valore di default che tronca l'elenco dei parametri**: con `[^)]*` la
      cattura finiva sulla parentesi di `new Date()` e tutto quello che veniva
      dopo restava libero (8 dei 9 ultimi).
   Nei moduli questa forma morde più che nelle pagine: un nome libero non fa
   rumore all'import, esplode quando quella riga viene eseguita — cioè magari
   in un ramo che le prove non toccano. */
test("nessun nome RIFERITO NUDO libero nei MODULI", () => {
  ok(male4m.length === 0,
    "nomi riferiti nudi in un modulo e mai dichiarati né importati:\n  " + male4m.slice(0, 12).join("\n  "));
});

test("la quarta domanda ha davvero guardato anche i moduli", () => {
  ok(moduli4 >= 15, `solo ${moduli4} moduli guardati dalla quarta domanda`);
  /* misurati 38.022 l'08/08 */
  ok(visti4m >= 25000, `solo ${visti4m} riferimenti nudi nei moduli: troppo pochi (misurati 38.022 l'08/08)`);
});

test("la quinta domanda ha davvero guardato", () => {
  ok(file5 >= 18, `solo ${file5} file guardati dalla quinta domanda`);
  /* misurati 990 l'08/08 */
  ok(importati5 >= 700, `solo ${importati5} import guardati: troppo pochi (misurati 990 l'08/08)`);
});

test("la controprova della QUINTA domanda — sa distinguere l'inerte dall'usato", () => {
  /* Due versi nello stesso colpo, perché una domanda che propone di
     CANCELLARE righe deve sbagliare solo dicendo «è usato»:
     · un nome aggiunto all'import e mai scritto altrove dev'essere visto;
     · un nome che compare SOLO dentro un template non dev'essere toccato — è
       la forma che un lettore distratto scambierebbe per inutile. */
  const rel = "apps/campo/index.html";
  const src = leggi(rel);
  const conInutile = src.replace(/import\s*\{/, "import { _maiUsatoQui,");
  ok(conInutile !== src, "l'iniezione non ha sostituito niente: la prova non prova niente");
  ok(importatiInerti(rel, conInutile).inerti.includes("_maiUsatoQui"),
    "un import mai usato dev'essere visto");

  const N = "RIPOSO_MINIMO_ORE";
  ok(new RegExp("\\$\\{" + N + "\\}").test(src), `${N} dev'essere usato dentro un template`);
  ok(!importatiInerti(rel).inerti.includes(N),
    `${N} si usa solo dentro un template: dichiararlo inutile sarebbe un consiglio di cancellare codice vivo`);
});

test("la controprova della QUARTA domanda NEI MODULI", () => {
  /* `LOTTI_APERTI` è dichiarata in `terra-data.js` (`const LOTTI_APERTI =
     [...]`, nemmeno esportata) e riferita **nuda** quattro volte lì dentro:
     in `STATI_LOTTO`, e in tre `[...LOTTI_APERTI, ...LOTTI_CHIUSI]`. Mai
     chiamata, mai in un template. Tolta la dichiarazione, il modulo muore.
     ⚠️ Il primo soggetto che avevo scelto — `SOGLIA_TURNI` — in questo modulo
     NON è dichiarato: sta in un elenco di ri-esportazione. L'iniezione non
     sostituiva niente e la prova sarebbe passata per il motivo sbagliato; a
     fermarla è stata la riga qui sotto, che è lì apposta. */
  const rel = "apps/terra/terra-data.js";
  const N = "LOTTI_APERTI";
  const src = leggi(rel);
  const guasto = src.replace(new RegExp("^const " + N + "\\s*=[^\\n]*\\n", "m"), "");
  ok(guasto !== src, "l'iniezione non ha sostituito niente: la prova non prova niente");
  ok(nudiLiberiModulo(rel, guasto).liberi.has(N), `la quarta domanda non vede ${N} riferito nudo nel modulo`);
  ok(nudiLiberiModulo(rel).liberi.size === 0, "e sul modulo sano non accusa niente");
});

/* ⛔ DA MISURA A REGOLA, l'08/08 — e il percorso vale più del numero d'arrivo:
   **35 → 34 → 9 → 7 → 6 → 0**, e NESSUNO dei sei scalini era il prodotto.
   1. il lookahead senza `\b` (prefissi: «escHtml» → «escHtm», 3.354 allarmi);
   2. `const[` senza spazio — e la prima diagnosi («sono commenti») era falsa;
   3. undici globali e cinque parole chiave che mancavano all'elenco;
   4. il dichiaratore su più righe, che si fermava al primo a capo;
   5. la regex dopo una FRECCIA letta come una divisione (`carburante`), che
      era un difetto del tokenizzatore condiviso, non di questo file;
   6. i flag di una regex presi per un nome, e lo IIFE che espone il globale
      col nome del suo parametro invece che con la parola `window`.
   Finché accusava codice sano restava una misura, perché una guardia che
   accusa a vuoto insegna a non guardarla. Adesso che è a zero può pretendere. */
test("nessun nome RIFERITO NUDO che non esiste da nessuna parte", () => {
  ok(male4.length === 0,
    "nomi riferiti (non chiamati, non in un template) e mai dichiarati:\n  "
    + male4.slice(0, 12).join("\n  ")
    + "\n  Se uno è legittimo va dichiarato CON LA RAGIONE in GLOBALI o DA_CDN, non tolto in silenzio.");
});

test("la quarta domanda ha davvero guardato", () => {
  ok(pagine4 >= 8, `solo ${pagine4} pagine guardate dalla quarta domanda`);
  /* misurati 69.353 l'08/08: la soglia dice «ha guardato», non fissa un traguardo */
  ok(visti4 >= 50000, `solo ${visti4} riferimenti nudi guardati: troppo pochi (misurati 69.353 l'08/08)`);
});

test("la controprova della QUARTA domanda — un nome usato SOLO come riferimento nudo", () => {
  /* Il soggetto ha esattamente la forma che le prime tre domande non vedono:
     `FOTO_MAX_BYTE` è importata da Campo e compare UNA volta sola, in
     `if (ultimo.byte <= FOTO_MAX_BYTE)`. Non è chiamata — non c'è nessuna `(`
     da vedere — e non sta in nessun `${…}`. Tolta dall'import, la pagina si
     apre e muore quando qualcuno comprime una foto: errore duro. */
  const rel = "apps/campo/index.html";
  const N = "FOTO_MAX_BYTE";
  const html = leggi(rel);
  const guasto = html.replace(new RegExp("\\s*" + N + ",", ""), "");
  ok(guasto !== html, "l'iniezione non ha sostituito niente: la prova non prova niente");

  const testo = blocchiDi(guasto).join("\n;\n");
  const cod = soloCodice(testo);
  ok(!nomiLegati(cod).has(N) && !nomiDegliScriptFratelli(rel, guasto).nomi.has(N) && !GLOBALI.has(N),
    `tolto dall'import, ${N} non dev'essere legato altrove — se no la controprova non distingue`);

  /* la PRIMA domanda resta cieca: non c'è nessuna chiamata da vedere */
  let chiamato = false;
  for (const m of cod.matchAll(/(^|[^\w$.?])([A-Za-z_$][\w$]*)\s*\(/g)) if (m[2] === N) chiamato = true;
  ok(!chiamato, `la prima domanda DOVEVA essere cieca su ${N}: se ora lo chiama qualcuno, riscrivi questo commento`);

  /* la TERZA pure: non sta dentro nessun `${…}` */
  let inTemplate = false;
  for (const m of testo.matchAll(/\$\{\s*([A-Za-z_$][\w$]*)\s*(\.|\}|\s|\[|\?|\)|,|\+)/g)) if (m[1] === N) inTemplate = true;
  ok(!inTemplate, `la terza domanda DOVEVA essere cieca su ${N}`);

  /* la QUARTA lo vede — e a rispondere è la FUNZIONE VERA, non una sua copia
     scritta qui dentro: è l'unico modo perché questa controprova resti legata
     al codice che sorveglia. */
  const r = nudiLiberi(rel, guasto);
  ok(r.liberi.has(N), `la quarta domanda non vede ${N} riferito nudo: non sa fallire`);
  ok(nudiLiberi(rel).liberi.size === 0, "e sulla pagina sana non accusa niente");
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

/* ⛔ IL PERIMETRO DELLE SUITE, STAMPATO: le prime due domande adesso guardano
   anche le suite `node` (dove il 14/08 è vissuto un `MODULI is not defined`
   per mezz'ora), e i banchi del browser restano fuori con la ragione scritta
   sopra `suiteDelDisco`. Il numero sta qui perché un'eccezione che non si
   conta è un'eccezione che nessuno riapre. */
console.log(`   [perimetro] le prime due domande guardano anche ${suiteDelDisco().length} suite node`
  + `  ·  ${banchiFuori().length} banchi del browser restano FUORI, e non è «a posto»:`
  + ` il loro codice gira dentro page.evaluate(), cioè in un terzo ambiente (8 allarmi misurati, 8 globali del browser, 0 difetti)`);
console.log(`\nRisultato nomi liberi: ${passed} passati, ${failed} falliti`
  + `  ·  ${chiamateTot} chiamate su ${pagineViste} pagine, ${chiamateMod} su ${moduliVisti} moduli`
  + `  ·  seconda domanda (lo scope): ${chiamateScope} chiamate su ${pagineScope} pagine e ${chiamateScopeMod} su ${moduliScope} moduli, ${maleScope.length + maleScopeMod.length} fuori scope; e ${nudiScope} riferimenti nudi su ${pagineNudiScope} pagine e ${nudiScopeMod} su ${moduliNudiScope} moduli e suite, ${maleNudiScope.length + maleNudiScopeMod.length} fuori scope`
  + `  ·  terza domanda (i riferimenti): ${visti3} usi di ${"$"}{…} su ${pagine3} pagine e ${visti3m} su ${moduli3} moduli, ${male3.length + male3m.length} liberi`
  /* ⚠️ IL PERIMETRO VA DETTO, se no il denominatore si legge più largo di
     quello che è — e questa riga ha già portato due affermazioni sbagliate in
     un'ora, tutt'e due corrette prima di restare scritte:
     1. «nei moduli ci pensa `import-esistenti`»: **falsa**, quello verifica il
        verso opposto — che un nome *importato* esista dall'altra parte, non
        che un nome *riferito* sia stato importato;
     2. «i moduli restano fuori»: vera per un'ora, poi chiusa qui sotto. */
  + `  ·  quarta domanda (i riferimenti nudi): ${visti4} su ${pagine4} pagine e ${visti4m} su ${moduli4} moduli, ${male4.length + male4m.length} liberi`
  /* ⚠️ «non ancora regola» era un INVITO, e questo file ne aveva due — uno qui
     e uno accanto alla misura. Un invito lasciato in giro viene raccolto: la
     decisione (guardati uno per uno l'08/08, sono residui di refactor giusti,
     la regola NON si fa) sta scritta per esteso sopra il calcolo. */
  + `  ·  quinta domanda (importati e mai usati): ${importati5} import su ${file5} file, ${inerti5.length} inerti — MISURA per scelta, non una regola mancante`);
process.exit(failed > 0 ? 1 : 0);

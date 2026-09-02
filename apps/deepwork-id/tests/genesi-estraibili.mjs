/* ⚠️ NON VA IN npm test: è una MISURA, non una prova. Stampa un quadro e non
   fallisce mai — come `copertura-funzioni.mjs` e `stati-sorvegliati.mjs`, e per
   la stessa ragione: una soglia su questo numero sarebbe una soglia su un
   valore che si muove col lavoro, e la farebbe scendere chi ha fretta.

   QUANTO È GRANDE DAVVERO IL CANTIERE DI GENESI
   ══════════════════════════════════════════════════════════════════════
   `docs/DEVELOPMENT.md` dice da giorni che le funzioni di Genesi stanno
   dentro `genesi.html`, che `node` non importa, e che quindi sono l'unica
   parte del prodotto con **zero prove pure**. Dice anche che tirarne fuori
   un modulo dati «è un cantiere intero».

   ⛔ Ma «è un cantiere intero» non è una misura: è una frase, e una frase
   non dice da dove si comincia né quanto si è avanzati. Il 01/08 il
   cantiere è stato **misurato**, e il numero che conta non è il totale — è
   quante funzioni si possono portare fuori **senza cambiargli la firma**.

   Perché quella è la domanda vera: una funzione che legge una variabile
   del modulo non è una funzione pura scritta nel posto sbagliato, è una
   funzione che dipende da uno stato condiviso. Portarla fuori vuol dire
   passarle quello stato, cioè **cambiarle la firma**, cioè cambiare tutti
   i punti che la chiamano — e in un file da 5.000 righe di 3D quello non
   è un trasloco, è un rifacimento.

   ⛔ QUI C'ERA LA TABELLA DEI NUMERI, ED È STATA TOLTA IL 09/08 — non per
   fare pulizia: perché era **falsa in ogni riga**, ed era falsa sotto un
   avvertimento che diceva esattamente come sarebbe successo.
   Il commento riportava «46 · 64 · 27 · 31 · 24, cioè 110 su 192», e sotto
   c'era scritto: *«i numeri qui sopra sono quelli che il file STAMPA quando
   gira: se un giorno divergono, ha ragione l'uscita e torto il commento»*.
   Otto giorni dopo l'uscita diceva **29 · 58 · 23 · 28 · 31, cioè 65 su
   169** — sei numeri su sei diversi — e la riga stampata continuava a
   contrapporre il «192» di allora, scritto a mano dentro un `console.log`.

   La lezione non è «aggiornare il commento»: è che **dichiarare un punto
   cieco non lo illumina**, ed è la terza volta in due giorni che questa
   casa lo paga (la roadmap che diceva «qui il controllo non arriva» ed è
   invecchiata due volte; il fondo della copertura che prometteva un caso
   che non vedeva). Un numero che il programma **ha in mano** non si scrive
   in prosa accanto: si stampa. Quello che resta qui è il **metodo**, che
   non si muove; i numeri stanno nell'uscita, e da oggi sono sorvegliati da
   `numeri-nei-documenti.mjs` dove finiscono in un documento.

   ⚠️ E QUESTO STRUMENTO HA GIÀ SBAGLIATO UNA VOLTA, in modo istruttivo. La
   prima versione contava come «variabile globale» anche i **parametri
   delle funzioni freccia** — `a`, `b`, `e`, `i`, `map` — e rispondeva che
   ogni candidato ne leggeva da 5 a 24. Con quel numero la conclusione
   sarebbe stata «non si estrae niente», che è **falsa**. Il difetto era
   nel rilevatore, non nel codice guardato: è la stessa famiglia del
   «controllo che non guarda dove crede», e la ragione per cui questa
   misura vive qui invece che in uno scratchpad — così la prossima volta
   si corregge lo strumento invece di riscriverlo sbagliato da capo.

   Uso:
     node apps/deepwork-id/tests/genesi-estraibili.mjs
     node apps/deepwork-id/tests/genesi-estraibili.mjs --elenco   (nomi e globali) */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const ELENCO = process.argv.includes("--elenco");

const src = readFileSync(join(RADICE, "apps/genesi/genesi.html"), "utf8");

/* le funzioni dichiarate, col corpo a graffe bilanciate */
const funzioni = [];
/* ⛔ `async function` entra nel conto (02/09): la forma precedente prendeva solo
   `function`, e `salvaVolata` — asincrona da luglio — non era mai stata
   contata; il giorno in cui `renderHome` è diventata asincrona (unità 2 del
   piano) il censimento è sceso di uno e la tabella del documento ha smesso di
   tornare. Un righello che non vede una forma di dichiarazione risponde «una
   funzione in meno» con la stessa faccia con cui direbbe la verità. */
const dichiarazione = /(?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g;
let m;
while ((m = dichiarazione.exec(src))) {
  const apre = src.indexOf("{", m.index + m[0].length - 1);
  if (apre < 0) continue;
  let d = 0, i = apre;
  for (; i < src.length; i++) {
    if (src[i] === "{") d++;
    else if (src[i] === "}") { d--; if (!d) break; }
  }
  funzioni.push({ nome: m[1], args: m[2], corpo: src.slice(apre, i + 1),
                  riga: src.slice(0, m.index).split("\n").length });
}

const nomiFunzioni = new Set(funzioni.map((f) => f.nome));

/* le variabili del MODULO: dichiarate a indentazione bassa, cioè fuori dalle
   funzioni. È un'euristica, e va detto: un `let` dentro un blocco indentato
   poco verrebbe contato per globale. Sbaglia nel verso prudente (conta più
   dipendenze di quante ce ne siano), che è il verso giusto per una misura che
   serve a decidere quanto lavoro c'è. */
const globali = new Set();
for (const g of src.matchAll(/\n\s{0,4}(?:let|const|var)\s+([A-Za-z_$][\w$]*)/g)) globali.add(g[1]);

/* ⛔ `$` È L'ACCESSO AL DOM, e il rilevatore non lo vedeva: cerca variabili
   del modulo e nomi di funzione, e `$` è una funzione — quindi `gsv`, che
   scrive dentro un campo con `$(id)`, risultava «senza stato e senza DOM».
   Trovato il 01/08 leggendo il codice di una funzione che il tool proponeva
   come estraibile: la lista era giusta sui numeri e sbagliata su UNA riga,
   che è il modo in cui uno strumento di misura fa perdere tempo invece di
   farne guadagnare. Chi lo usa deve poter fidarsi dell'elenco, non solo del
   totale. */
const DOM_NASCOSTO = /(?:^|[^\w$])\$\s*\(/;

/* ⛔ LA SECONDA DOMANDA, dal 09/08: «nessuna variabile del modulo e nessun
   `$(...)`» dice DOVE VIVE LO STATO, non DOVE PUÒ VIVERE LA FUNZIONE.
   Trovata portando fuori la prima fetta e aprendo la lista uno per uno: fra le
   «25 che si portano fuori come sono» ce n'erano che in un modulo dati non ci
   vanno affatto, per tre ragioni diverse e tutte invisibili al filtro di
   prima —
   · il **DOM ricevuto come argomento**: `nomeCampoD2` fa `el.closest('label')`,
     e `el` arriva da fuori, quindi nessun `$(` compare;
   · l'**ambiente del browser**: otto funzioni leggono o scrivono
     `localStorage` (`_lsGet`, `_lsSet`, `_cmpLoad`, `_sentStore`, `_sentSave`,
     `sitoStore`, `sitoSalva`, `riconStorico`), e in Node solleverebbero. Il
     commento della pagina lo diceva già — *«restano qui `riconStorico`,
     `riconSave`… che leggono `localStorage`, il DOM o lo stato del progetto»* —
     mentre il censimento le contava fra le estraibili;
   · la **tela e il 3D**: `skyTexture` e `softTexture` creano una `<canvas>`,
     `applyRockMaterial` e `mdlSet` maneggiano oggetti THREE, `cancelAudio`
     ferma nodi Web Audio.
   ⚠️ Non è severità in più: è che il numero stampato **voglia dire quello che
   promette**. Un elenco di candidati sbagliato manda a lavorare dove non si
   può, ed è lo stesso danno di un «non c'è» falso. */
const AMBIENTE_BROWSER = new RegExp("(?:^|[^\\w$.])(?:localStorage|sessionStorage|document|window|navigator|"
  + "location|fetch|AudioContext|FileReader|URL|requestAnimationFrame|THREE|createElement|"
  + "getContext|addEventListener|alert|Blob)\\b");
/* il DOM che arriva come ARGOMENTO: metodi che solo un elemento ha */
const DOM_ARGOMENTO = /\.(?:closest|querySelector|querySelectorAll|appendChild|classList|getBoundingClientRect|innerHTML|innerText|textContent|dataset)\b/;

const BUILTIN = new Set(("Math Number String Array Object JSON Boolean Date Map Set WeakMap "
  + "isNaN isFinite parseFloat parseInt console Infinity NaN undefined null true false "
  + "RegExp Promise Error Symbol BigInt Intl encodeURIComponent decodeURIComponent").split(" "));

/* Tutto ciò che dentro la funzione è LOCALE. ⛔ I parametri delle funzioni
   freccia stanno qui, ed è la correzione che ha cambiato la conclusione. */
function localiDi(f) {
  const L = new Set(f.args.match(/[A-Za-z_$][\w$]*/g) || []);
  for (const g of f.corpo.matchAll(/\b(?:let|const|var)\s+([A-Za-z_$][\w$]*)/g)) L.add(g[1]);
  for (const g of f.corpo.matchAll(/\(([^()]*)\)\s*=>/g))
    for (const n of (g[1].match(/[A-Za-z_$][\w$]*/g) || [])) L.add(n);
  for (const g of f.corpo.matchAll(/(?:^|[^.\w])([A-Za-z_$][\w$]*)\s*=>/g)) L.add(g[1]);
  for (const g of f.corpo.matchAll(/(?:let|const|var)\s*\{([^}]*)\}/g))
    for (const n of (g[1].match(/[A-Za-z_$][\w$]*/g) || [])) L.add(n);
  for (const g of f.corpo.matchAll(/(?:let|const|var)\s*\[([^\]]*)\]/g))
    for (const n of (g[1].match(/[A-Za-z_$][\w$]*/g) || [])) L.add(n);
  for (const g of f.corpo.matchAll(/for\s*\(\s*(?:let|const|var)\s+([A-Za-z_$][\w$]*)/g)) L.add(g[1]);
  for (const g of f.corpo.matchAll(/catch\s*\(\s*([A-Za-z_$][\w$]*)/g)) L.add(g[1]);
  return L;
}

const censite = funzioni.map((f) => {
  const L = localiDi(f);
  const glob = new Set(), chiama = new Set();
  /* `[^.\w$]` davanti: così `x.map` non conta come uso di `map` */
  for (const g of f.corpo.matchAll(/(?:^|[^.\w$])([A-Za-z_$][\w$]*)\b(?!\s*:)/g)) {
    const n = g[1];
    if (L.has(n) || BUILTIN.has(n)) continue;
    if (globali.has(n)) glob.add(n);
    else if (nomiFunzioni.has(n) && n !== f.nome) chiama.add(n);
  }
  return { ...f, glob: [...glob], chiama: [...chiama],
           dom: DOM_NASCOSTO.test(f.corpo),
           /* la seconda domanda: tocca il DOM in QUALUNQUE modo, anche
              ricevendolo, o l'ambiente del browser? */
           ambiente: AMBIENTE_BROWSER.test(f.corpo) || DOM_ARGOMENTO.test(f.corpo) };
});

/* ⛔ E LA SECONDA DOMANDA VA PROPAGATA, se no risponde di no a metà dei
   colpevoli. Misurato subito dopo averla scritta: restavano «pure» otto
   funzioni e almeno cinque non lo erano — `sitoLegge` chiama `sitoStore` che
   legge `localStorage`, `gvv` chiama `gLeggi` che legge un campo del DOM,
   `lithoTint` chiama `selRoccia`. Il tocco all'ambiente **si eredita per
   chiamata**: chi chiama una funzione che tocca il browser tocca il browser.
   Si chiude a punto fisso — poche decine di giri su 163 funzioni, e il ciclo
   si ferma da sé perché l'insieme può solo crescere. */
{
  const per = new Map(censite.map((c) => [c.nome, c]));
  let cambia = true;
  while (cambia) {
    cambia = false;
    for (const c of censite) {
      if (c.ambiente || c.dom) continue;
      if (c.chiama.some((n) => { const d = per.get(n); return d && (d.ambiente || d.dom); })) {
        c.ambiente = true; cambia = true;
      }
    }
  }
}

const scaglione = (n) => n === 0 ? "0" : n <= 2 ? "1-2" : n <= 5 ? "3-5" : n <= 10 ? "6-10" : "11+";
const conto = {};
for (const c of censite) conto[scaglione(c.glob.length)] = (conto[scaglione(c.glob.length)] || 0) + 1;

console.log(`\nIl cantiere di Genesi, misurato — ${censite.length} funzioni in genesi.html\n`);
console.log("  quante variabili del modulo legge      quante funzioni");
for (const k of ["0", "1-2", "3-5", "6-10", "11+"]) {
  const n = conto[k] || 0;
  console.log(`  ${k.padStart(5)}${" ".padEnd(32)}${String(n).padStart(4)}  ${"█".repeat(Math.round(n / 3))}`);
}
const subito = censite.filter((c) => !c.glob.length && !c.dom && !c.ambiente);
const conDom = censite.filter((c) => !c.glob.length && c.dom);
/* la seconda domanda, contata a parte: senza stato del modulo e senza `$(`,
   ma con il DOM ricevuto, la tela, il 3D o `localStorage` dentro */
const conAmbiente = censite.filter((c) => !c.glob.length && !c.dom && c.ambiente);
const facili = censite.filter((c) => c.glob.length && c.glob.length <= 2);
const duri = censite.filter((c) => c.glob.length > 10);
console.log(`\n  ${subito.length} si portano fuori COME SONO (nessuna variabile del modulo, nessun tocco al DOM)`);
console.log(`  ${conDom.length} non leggono variabili del modulo ma SCRIVONO NEL DOM con \`$(...)\`: restano nella pagina`);
console.log(`  ${conAmbiente.length} idem, ma toccano l'AMBIENTE del browser (DOM ricevuto, tela, THREE, localStorage): restano`);
/* ⛔ E QUELLO CHE IL RIGHELLO ANCORA NON VEDE, dichiarato invece che nascosto.
   Le poche rimaste in cima sono state aperte A MANO il 09/08, una per una, e
   quasi nessuna è davvero un trasloco: `worldJitter` e `jitterGeo` scrivono
   dentro una geometria THREE che arriva come argomento; `cancelAudio` ferma
   nodi Web Audio tenuti in un `let` che l'euristica delle globali non prende;
   `mdlSet` sceglie fra due liste di maniglie 3D; `lithoTint` chiama
   `selRoccia`. Resta `_sentOggi`, che è pura — ed è un alias di una riga di
   `shared/`, quindi portarla fuori non aggiungerebbe niente.
   Detto in chiaro: dopo le due fette del 09/08 (`interpProf`, e poi `_sentNum`
   e `isoColore`) la colonna «si portano fuori come sono» è **praticamente
   esaurita**, e il cantiere che resta sono quelle che leggono una o due
   variabili del modulo — cioè un cambio di firma, non un trasloco. (Quante
   siano lo dice la riga stampata qui sotto: scritto qui diceva **56** e il
   giorno dopo ne stampava 58, che è il difetto raccontato in cima.)
   ⚠️ Perché non si stringe ancora: le tre cause rimaste (uno stato in un `let`
   che l'euristica salta, un oggetto THREE ricevuto come argomento, una
   funzione di libreria) non si distinguono da una regex senza sapere i TIPI, e
   un righello «un po' meno sbagliato» è peggio di uno che dichiara il suo
   dubbio — è la regola già pagata su `contrasto.mjs`. */
console.log(`     ⚠️ delle ${subito.length} qui sopra, aperte a mano il 09/08: solo \`_sentOggi\` è davvero pura`);
console.log(`        (e non serve: è un alias di una riga di shared/). La colonna è ESAURITA — il cantiere`);
console.log(`        che resta sono le ${facili.length} che leggono una o due variabili: cambio di firma, non trasloco.`);
console.log(`  ${facili.length} ne leggono una o due: si portano fuori passandogliela`);
console.log(`  ${duri.length} ne leggono più di dieci: lì è un rifacimento, non un trasloco`);
/* ⛔ IL TOTALE ERA SCRITTO A MANO — «non è 192» — E IL 09/08 ERA DIVENTATO 169.
   Cioè la riga che esiste per dire «guardate il numero giusto, non quello
   grosso» stampava, come numero grosso, un valore che non era più di nessuno.
   È la stessa famiglia del banco che porta dentro un numero atteso: il file
   HA il totale in mano (`censite.length`), e un dato che il programma ha in
   mano non si scrive a memoria. */
console.log(`\n⛔ E il numero che conta non è ${censite.length}: è ${subito.length + facili.length} —`);
console.log(`   le funzioni che si possono estrarre senza rifare il modo in cui Genesi tiene il suo stato.`);
console.log(`   Il resto (${censite.length - subito.length - facili.length}) è una decisione di architettura, non un trasloco.`);

if (ELENCO) {
  console.log(`\n── Le ${subito.length} che si portano fuori come sono, dalla più grossa:`);
  for (const c of subito.sort((a, b) => b.corpo.length - a.corpo.length))
    console.log(`  ${String(c.corpo.length).padStart(5)} car.  riga ${String(c.riga).padStart(5)}  ${c.nome.padEnd(26)}`
      + (c.chiama.length ? "chiama: " + c.chiama.join(", ") : ""));
  console.log(`\n── Le ${duri.length} più legate allo stato, dalla peggiore:`);
  for (const c of duri.sort((a, b) => b.glob.length - a.glob.length))
    console.log(`  ${String(c.glob.length).padStart(3)} globali  ${c.nome.padEnd(26)} ${c.glob.slice(0, 10).join(", ")}`);
}
console.log("");

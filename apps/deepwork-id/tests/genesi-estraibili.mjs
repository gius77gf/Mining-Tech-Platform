/* ⚠️ NON VA IN npm test: è una MISURA, non una prova. Stampa un quadro e non
   fallisce mai — come `copertura-funzioni.mjs` e `stati-sorvegliati.mjs`, e per
   la stessa ragione: una soglia su questo numero sarebbe una soglia su un
   valore che si muove col lavoro, e la farebbe scendere chi ha fretta.

   QUANTO È GRANDE DAVVERO IL CANTIERE DI GENESI
   ══════════════════════════════════════════════════════════════════════
   `docs/DEVELOPMENT.md` dice da giorni che le **192 funzioni di Genesi**
   stanno dentro `genesi.html`, che `node` non importa, e che quindi sono
   l'unica parte del prodotto con **zero prove pure**. Dice anche che
   tirarne fuori un modulo dati «è un cantiere intero».

   ⛔ Ma «è un cantiere intero» non è una misura: è una frase, e una frase
   non dice da dove si comincia né quanto si è avanzati. Il 01/08 il
   cantiere è stato **misurato**, e il numero che conta non è 192 — è
   quante funzioni si possono portare fuori **senza cambiargli la firma**.

   Perché quella è la domanda vera: una funzione che legge una variabile
   del modulo non è una funzione pura scritta nel posto sbagliato, è una
   funzione che dipende da uno stato condiviso. Portarla fuori vuol dire
   passarle quello stato, cioè **cambiarle la firma**, cioè cambiare tutti
   i punti che la chiamano — e in un file da 5.000 righe di 3D quello non
   è un trasloco, è un rifacimento.

   Misura del 01/08:

       0 globali:  46 funzioni   ← si portano fuori come sono
       1-2:        64            ← una o due, spesso costanti: fattibile
       3-5:        27
       6-10:       31
       11+:        24            ← qui è rifacimento, non trasloco

   Cioè **110 funzioni su 192 si estraggono senza rifare il modo in cui
   Genesi tiene il suo stato**, e la parte davvero dura sono 55 funzioni.

   ⚠️ I numeri qui sopra sono quelli che il file STAMPA quando gira: se un
   giorno divergono, ha ragione l'uscita e torto il commento. Sono stati
   corretti una volta il 01/08 proprio per questo — la prima stesura
   riportava 37 e 72, cioè i numeri di una versione precedente dello
   strumento, e un commento che contraddice la propria uscita è il difetto
   che `numeri-nei-documenti.mjs` esiste per prendere nei documenti.

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
const dichiarazione = /(?:^|\n)\s*(?:export\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/g;
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
  return { ...f, glob: [...glob], chiama: [...chiama] };
});

const scaglione = (n) => n === 0 ? "0" : n <= 2 ? "1-2" : n <= 5 ? "3-5" : n <= 10 ? "6-10" : "11+";
const conto = {};
for (const c of censite) conto[scaglione(c.glob.length)] = (conto[scaglione(c.glob.length)] || 0) + 1;

console.log(`\nIl cantiere di Genesi, misurato — ${censite.length} funzioni in genesi.html\n`);
console.log("  quante variabili del modulo legge      quante funzioni");
for (const k of ["0", "1-2", "3-5", "6-10", "11+"]) {
  const n = conto[k] || 0;
  console.log(`  ${k.padStart(5)}${" ".padEnd(32)}${String(n).padStart(4)}  ${"█".repeat(Math.round(n / 3))}`);
}
const subito = censite.filter((c) => !c.glob.length);
const facili = censite.filter((c) => c.glob.length && c.glob.length <= 2);
const duri = censite.filter((c) => c.glob.length > 10);
console.log(`\n  ${subito.length} si portano fuori COME SONO (nessuna variabile del modulo)`);
console.log(`  ${facili.length} ne leggono una o due: si portano fuori passandogliela`);
console.log(`  ${duri.length} ne leggono più di dieci: lì è un rifacimento, non un trasloco`);
console.log(`\n⛔ E il numero che conta non è 192: è ${subito.length + facili.length} —`);
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

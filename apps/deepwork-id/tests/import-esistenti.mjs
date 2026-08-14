/* ⛔ OGNI NOME IMPORTATO ESISTE DAVVERO DALL'ALTRA PARTE?
   Nato il 02/08, e non da un'idea: dal difetto che è costato **cinque commit**
   alla pagina di Scudo. Committando il lavoro sugli allegati era entrato
   `import { daCampo } from "./campo-data.js"` **senza** il modulo che lo
   esporta, rimasto su disco. Un import ESM di un nome inesistente è un errore
   duro: la pagina non parte, e per cinque commit `HEAD` dava elenco vuoto e
   KPI tutti «—» mentre sul disco funzionava tutto.

   ⚠️ E NON LO PRENDE NESSUN ALTRO CONTROLLO, che è la ragione per cui questo
   file esiste invece di essere una riga in un altro:
     · le suite `node` non importano le pagine;
     · `sintassi-pagine.mjs` (nata stamattina) compila i blocchi `<script>`, e
       un import sbagliato è **sintatticamente perfetto**;
     · `pagine-vive.mjs` lo prenderebbe, ma è un banco del browser: vuole un
       server e Chromium, quindi non sta nel giro `node` di ogni commit.
   Questo invece è statico e dura meno di un secondo: legge chi importa, legge
   chi esporta, e confronta.

   ⚠️ La scansione passa da `classifica` di `tokenizza.mjs`, non da una regex
   sul testo crudo: la stessa ragione scritta in CLAUDE.md — un `import {` che
   compare **dentro una stringa** (un esempio d'uso in un commento, il testo di
   un modello di stampa) non è un import, e un tokenizzatore scritto in casa
   perde la fase al primo apostrofo italiano.

   Si lancia con: node apps/deepwork-id/tests/import-esistenti.mjs
                  node apps/deepwork-id/tests/import-esistenti.mjs --controprova */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { classifica, CODICE } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const CONTROPROVA = process.argv.includes("--controprova");

/* I soggetti: le pagine e tutti i moduli JS di casa. `vendor/` resta fuori —
   è codice di terzi (three.js), e non è nostro compito. */
function soggetti() {
  const out = [];
  const scava = (dir, prof = 0) => {
    if (prof > 4) return;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === "vendor" || e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) scava(p, prof + 1);
      else if (/\.(html|js|mjs)$/.test(e.name)) out.push(p);
    }
  };
  scava(join(RADICE, "apps"));
  scava(join(RADICE, "shared"));
  for (const f of ["index.html"]) if (existsSync(join(RADICE, f))) out.push(join(RADICE, f));
  return out;
}

/* I pezzi di un file, ognuno col suo verdetto carattere per carattere: per una
   pagina sono i blocchi `<script>`, per un modulo è tutto.
   ⚠️ Il testo NON viene ripulito, e la prima versione di questo file lo faceva
   sbagliando: cancellando il contenuto delle stringhe spariva anche
   «./campo-data.js», cioè proprio il pezzo da leggere, e il controllo trovava
   **zero import su 95 file** dicendo «nessuna violazione». Il tokenizzatore
   serve a decidere DA DOVE si può partire, non a mutilare il testo: si cerca
   sul testo intero e si tiene solo ciò che comincia in una posizione di
   codice. */
function pezzi(path) {
  const testo = readFileSync(path, "utf8");
  const blocchi = /\.html$/.test(path)
    ? [...testo.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
    : [testo];
  return blocchi.map((b) => ({ testo: b, fasi: classifica(b) }));
}

/* cerca `re` in tutti i pezzi, tenendo solo le occorrenze che **cominciano**
   in una posizione di codice vero */
function cerca(path, re) {
  const out = [];
  for (const { testo, fasi } of pezzi(path)) {
    for (const m of testo.matchAll(re)) if (fasi[m.index] === CODICE) out.push(m);
  }
  return out;
}

/* ⚠️ I NOMI FRA GRAFFE POSSONO AVERE UN COMMENTO IN MEZZO, e la prima versione
   non ci pensava: `terra-data.js` ri-esporta otto nomi con una riga `// P2: la
   stessa produzione, ma fronte per fronte` nel mezzo. Spezzando sulla virgola,
   quel commento diventava due pezzi e l'ultimo si portava dietro il nome vero
   attaccato al testo — risultato, `produzionePerFronte` risultava «non
   esportato» mentre lo era, cioè un falso allarme sull'unico caso che il
   controllo aveva trovato. Si tolgono prima i commenti, poi si prende
   l'identificatore dall'inizio di ogni pezzo. */
function nomiFraGraffe(dentro) {
  const pulito = dentro.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
  const out = [];
  for (const pezzo of pulito.split(",")) {
    const m = pezzo.trim().match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?/);
    if (m) out.push({ origine: m[1], come: m[2] || m[1] });
  }
  return out;
}

/* I nomi che un modulo mette a disposizione. Non è un parser di JavaScript: è
   il censimento delle forme che questo progetto usa davvero, e se un giorno ne
   nascesse una nuova il controllo direbbe «non esiste» su un nome che esiste —
   rumore, non silenzio, che è il verso giusto in cui sbagliare. */
function esportati(path) {
  const nomi = new Set();
  for (const m of cerca(path, /\bexport\s+(?:async\s+)?(?:function\*?|class)\s+([A-Za-z_$][\w$]*)/g)) nomi.add(m[1]);
  /* ⚠️ UNA DICHIARAZIONE PUÒ AVERE PIÙ NOMI, e la prima versione ne prendeva
     uno solo: `export const COMMENTO = 0, CODICE = 1, DENTRO = 2;` di
     `tokenizza.mjs` esporta TRE costanti, e il controllo accusava tre file di
     importare nomi inesistenti. Falsi allarmi su codice sano — e un allarme
     che sbaglia insegna a non guardarlo. Si legge la riga fino al `;`. */
  for (const m of cerca(path, /\bexport\s+(?:const|let|var)\s+([^;\n]+)/g)) {
    for (const d of m[1].split(",")) {
      const n = d.trim().match(/^([A-Za-z_$][\w$]*)/);
      if (n) nomi.add(n[1]);
    }
  }
  for (const m of cerca(path, /\bexport\s*\{([^}]*)\}/g)) {
    for (const n of nomiFraGraffe(m[1])) nomi.add(n.come);
  }
  if (cerca(path, /\bexport\s+default\b/g).length) nomi.add("default");
  /* ⛔ E UN MODULO **CommonJS** NON HA NESSUNA DI QUESTE FORME, quindi fino al
     14/08 questo censimento rispondeva «non esporta niente» — cioè un falso
     allarme su OGNI import da un file `require`-style, che è il verso
     sbagliato: non rumore su una forma nuova, ma rumore su una forma vecchia
     come il progetto. L'ha fatto vedere `functions/claims.js`, il primo file
     delle Cloud Functions che una suite `node` importa: due nomi veri accusati
     di non esistere. Le due forme che questa casa usa sono
     `module.exports = { a, b }` e `exports.a = …`. */
  for (const m of cerca(path, /\bmodule\.exports\s*=\s*\{([^}]*)\}/g)) {
    for (const n of nomiFraGraffe(m[1])) nomi.add(n.come);
  }
  for (const m of cerca(path, /\bexports\.([A-Za-z_$][\w$]*)\s*=/g)) nomi.add(m[1]);
  // `export * from "./x.js"` porta dentro i nomi di un altro file
  for (const m of cerca(path, /\bexport\s*\*\s*from\s*["']([^"']+)["']/g)) {
    const via = risolvi(path, m[1]);
    if (via) for (const n of esportati(via)) nomi.add(n);
  }
  return nomi;
}

function risolvi(daFile, spec) {
  if (!spec.startsWith(".") && !spec.startsWith("/")) return null;   // pacchetto o URL
  const p = spec.startsWith("/") ? join(RADICE, spec) : resolve(dirname(daFile), spec);
  const pulito = p.split("?")[0].split("#")[0];
  return existsSync(pulito) && statSync(pulito).isFile() ? pulito : { mancante: pulito };
}

/* Gli import con i nomi fra graffe: `import { a, b as c } from "./x.js"`.
   Gli `import * as X` e i default non hanno nomi da verificare oltre al file. */
function importati(path) {
  const out = [];
  for (const m of cerca(path, /\bimport\s*\{([^}]*)\}\s*from\s*["']([^"']+)["']/g)) {
    out.push({ nomi: nomiFraGraffe(m[1]).map((n) => n.origine), spec: m[2] });
  }
  for (const m of cerca(path, /\bimport\s+(?:[A-Za-z_$][\w$]*|\*\s+as\s+[A-Za-z_$][\w$]*)\s+from\s*["']([^"']+)["']/g)) {
    out.push({ nomi: [], spec: m[1] });
  }
  return out;
}

let passati = 0, falliti = 0, nomiVisti = 0, fileVisti = 0, importVisti = 0;
const guasti = [];

function controlla(file, iniezione = null) {
  const locali = [];
  for (const imp of (iniezione ? iniezione(importati(file)) : importati(file))) {
    const via = risolvi(file, imp.spec);
    if (via === null) continue;                       // pacchetto esterno o URL
    importVisti++;
    const rel = file.slice(RADICE.length + 1);
    if (via && via.mancante) { locali.push(`${rel}: il file «${imp.spec}» non esiste`); continue; }
    const disponibili = esportati(via);
    for (const n of imp.nomi) {
      nomiVisti++;
      if (!disponibili.has(n)) locali.push(`${rel}: importa «${n}» da ${imp.spec}, che non lo esporta`);
    }
  }
  return locali;
}

for (const file of soggetti()) {
  fileVisti++;
  const g = controlla(file);
  if (g.length) { falliti++; guasti.push(...g); } else passati++;
}
for (const g of guasti) console.error(`  ✗ ${g}`);

/* ⚠️ LA CONTROPROVA, e misurata anche nella sua COPERTURA: non basta sapere
   fallire in un punto. Si aggiunge un nome inesistente a OGNI import con
   graffe di OGNI file, in memoria, e si pretende che vengano visti tutti. */
if (CONTROPROVA) {
  let viste = 0, provate = 0;
  for (const file of soggetti()) {
    const veri = importati(file).filter((i) => i.nomi.length && risolvi(file, i.spec));
    if (!veri.length) continue;
    provate++;
    const g = controlla(file, (imps) =>
      imps.map((i) => (i.nomi.length ? { ...i, nomi: [...i.nomi, "nomeCheNonEsisteMai"] } : i)));
    if (g.length) viste++;
    else console.error(`  ✗ controprova: ${file.slice(RADICE.length + 1)} non è stato visto rompersi`);
  }
  console.log(`\ncontroprova: ${viste} iniezioni viste su ${provate} file con import di casa`);
  console.log(viste === provate ? "controprova: il controllo SA fallire" : "controprova: NON distingue");
  process.exit(viste === provate ? 0 : 1);
}

console.log(`\nRisultato import esistenti: ${passati} passati, ${falliti} falliti  ·  ${fileVisti} file, ${importVisti} import di casa, ${nomiVisti} nomi verificati`);
process.exit(falliti ? 1 : 0);

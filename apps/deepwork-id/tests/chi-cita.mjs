/* NON VA IN npm test: è una MISURA — stampa chi cita un pezzo di codice e non fallisce mai (esce 0 anche se trova)
   ════════════════════════════════════════════════════════════════════════════════════════════
   Uso: node apps/deepwork-id/tests/chi-cita.mjs <file con il corpo che si vuole spostare>

   PERCHÉ ESISTE (27/11). Portando nel modulo tre pezzi di Genesi che vivevano nella pagina (fette di
   B3), per tre volte di fila il «contare PRIMA le iniezioni che citano quelle righe» è stato fatto
   cercando QUATTRO o SETTE righe a campione — e ogni volta quella che contava non era nel campione.
   L'ha sempre detto `iniezioni-fresche`, prima del commit; ma una regola che si applica a mano, a
   campione, è una regola che non si applica. Questo fa la domanda su OGNI riga del corpo e su ogni
   suo pezzo fra due virgole, in tutti i file di prova.

   CHE COSA DICE E CHE COSA NO.
     · dice quali file di prova contengono, alla lettera, una riga o un pezzo del corpo: sono le
       iniezioni di controprova e le asserzioni sul sorgente da riancorare DOPO il trasloco;
     · NON dice chi usa, più in là nello stesso gestore, i NOMI che il corpo dichiara (`const X=`):
       quelli li stampa in fondo, da cercare a mano nel resto del gestore. Il 27/11 due messaggi di
       conferma contavano ancora un array traslocato — uno moriva, l'altro (per un omonimo globale)
       diceva «— referti» senza nessun errore. */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const QUI = dirname(fileURLToPath(import.meta.url));
const dove = process.argv[2];
if (!dove) { console.log("uso: node chi-cita.mjs <file con il corpo>"); process.exit(0); }
const corpo = readFileSync(dove, "utf8");
const pezzi = new Set();
for (const riga of corpo.split("\n")) {
  const r = riga.trim();
  /* ⚠️ nessun filtro «sembra codice»: la prima stesura voleva almeno un `=`, `(`, `;` o `:` e saltava la riga
     `['Fori con valori propri',_fpA.fori,_fpB.fori],` — proprio una delle due che un banco citava */
  if (r.length < 12 || r.startsWith("/*") || r.startsWith("*")) continue;
  pezzi.add(r);
  for (const q of r.split(/,\s+(?=[a-zA-Z_\[\]'"`]+[:=(\[])/)) if (q.trim().length >= 16) pezzi.add(q.trim());
}
const ordinati = [...pezzi].sort((a, b) => b.length - a.length);
const file = [...readdirSync(QUI).filter((f) => f.endsWith(".mjs")).map((f) => join(QUI, f)), ...readdirSync(join(QUI, "browser")).filter((f) => f.endsWith(".mjs")).map((f) => join(QUI, "browser", f))]
  .filter((f) => !f.endsWith("chi-cita.mjs"));
let citazioni = 0; const chi = new Set();
for (const f of file.sort()) {
  const t = readFileSync(f, "utf8"), visti = [];
  for (const p of ordinati) {
    if (visti.some((v) => v.includes(p))) continue;          // un pezzo dentro una riga già trovata non si ridice
    let i = t.indexOf(p);
    while (i >= 0) { console.log(`${f.slice(QUI.length + 1)}:${t.slice(0, i).split("\n").length} cita «${p.slice(0, 100)}»`); citazioni++; chi.add(f); i = t.indexOf(p, i + p.length); }
    if (t.includes(p)) visti.push(p);
  }
}
const nomi = [...new Set([...corpo.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g)].map((m) => m[1]))];
console.log(`\npezzi cercati: ${pezzi.size} · file letti: ${file.length} · citazioni: ${citazioni} in ${chi.size} file`);
console.log(`nomi dichiarati nel corpo, da cercare A MANO nel resto del gestore: ${nomi.length ? nomi.join(", ") : "nessuno"}`);

/* ⚠️ NON VA IN npm test: vuole l'EMULATORE Firestore (firebase-tools + Java),
   e `npm test` è già quello che la CI lancia DENTRO l'emulatore — metterlo qui
   dentro vorrebbe dire un emulatore dentro un emulatore. È l'orchestratore
   delle suite che l'emulatore ce l'hanno per forza, e si lancia a mano.

   ⛔ PERCHÉ ESISTE, E LA MISURA CHE L'HA FATTO NASCERE (08/08).
   `CLAUDE.md` diceva che le regole di sicurezza si provano con
   `emulators:exec --project demo-deepwork "cd tests && npm test"` e che sono
   «19 test». Sbagliato due volte: quel comando **in questo contenitore non
   parte**, e 19 è il conto dell'**SDK**, non delle regole.
   Quello che gira davvero — misurato lanciandolo — è la parte che conta di
   più: la **barriera multi-tenant**, cioè il muro fra aziende **concorrenti**
   che è il requisito fondante di tutto il prodotto. **68 prove**, pochi
   minuti, e si possono lanciare PRIMA del push. Nessuno lo faceva, e il numero
   scritto nei documenti era fermo a 58 proprio perché nessuno le lanciava più
   in casa — sul numero che riguarda la sicurezza.

   ⛔ E QUELLO CHE NON PUÒ GIRARE LO DICHIARA, invece di tacerlo.
   L'emulatore delle FUNZIONI non parte qui: chiede la rete e la politica del
   contenitore la nega («Unable to parse JSON … "denied by …"»). Quindi
   `run-fns.mjs` (21 prove) resta verificabile **solo in CI**. Un giro che
   salta qualcosa in silenzio è peggio di un giro che non c'è: chi legge
   «tutto verde» crede di aver guardato tutto. Le righe «non ho guardato» si
   leggono per prime, ed è la regola di casa.

   Si lancia con: node apps/deepwork-id/tests/giro-sicurezza.mjs            */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const APP = join(QUI, "..");           // apps/deepwork-id: è da qui che vuole girare firebase

/* [che cosa prova, quali emulatori servono, il comando] */
const GIRI = [
  ["le regole di sicurezza — la barriera fra ORGANIZZAZIONI", "firestore", "node run.mjs"],
  ["l'SDK dell'identità", "firestore,auth", "node run-sdk.mjs"],
  ["il primo avvio di un'organizzazione", "firestore,auth", "node run-bootstrap.mjs"],
];

/* Dichiarato per nome e con la ragione, non lasciato fuori in silenzio. */
const FUORI = [
  ["run-fns.mjs", "vuole l'emulatore delle FUNZIONI, che qui non parte: chiede la rete e la politica del contenitore la nega. Resta coperto dalla CI."],
];

/* ⚠️ Se firebase-tools o Java non ci sono, ci si FERMA dicendo perché. Un giro
   che non trova i suoi attrezzi e stampa «0 caduti» è il verde più falso che
   ci sia — la stessa famiglia dell'iniezione che non inietta. */
function ceLAttrezzo(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return !r.error && r.status === 0;
}
if (!ceLAttrezzo("firebase", ["--version"])) {
  console.error("⛔ `firebase` non risponde: serve firebase-tools. Non ho provato NIENTE.");
  process.exit(2);
}
if (!ceLAttrezzo("java", ["-version"])) {
  console.error("⛔ `java` non risponde: l'emulatore Firestore ne ha bisogno. Non ho provato NIENTE.");
  process.exit(2);
}

let caduti = 0, proveTot = 0;
for (const [cosa, soloQuesti, comando] of GIRI) {
  console.log(`\n════════ ${cosa} ════════`);
  const r = spawnSync("firebase",
    ["emulators:exec", "--only", soloQuesti, "--project", "demo-deepwork", `cd tests && ${comando}`],
    { cwd: APP, encoding: "utf8" });
  const uscita = String(r.stdout || "") + String(r.stderr || "");
  /* si legge il conto dalla riga di riepilogo della suite, non dall'uscita del
     processo: un processo può uscire 0 anche senza aver provato niente */
  const m = /Risultato[^:]*:\s*(\d+)\s+passati,\s*(\d+)\s+falliti/.exec(uscita);
  if (!m) {
    caduti++;
    console.error(`  ✗ ${comando}: non ho trovato la riga di riepilogo — la suite non ha girato`);
    console.error(uscita.split("\n").filter((l) => /Error|error|⚠/.test(l)).slice(-4).join("\n"));
    continue;
  }
  proveTot += +m[1];
  if (+m[2] > 0 || r.status !== 0) { caduti++; console.error(`  ✗ ${comando}: ${m[1]} passati, ${m[2]} falliti`); }
  else console.log(`  ✓ ${comando}: ${m[1]} passati, 0 falliti`);
}

console.log("\n⚠️  NON HO GUARDATO — da leggere PRIMA del riepilogo:");
for (const [file, ragione] of FUORI) console.log(`   · ${file}: ${ragione}`);

console.log(`\nGiro con l'emulatore: ${GIRI.length - caduti} su ${GIRI.length} a posto, ${proveTot} prove`);
process.exit(caduti ? 1 : 0);

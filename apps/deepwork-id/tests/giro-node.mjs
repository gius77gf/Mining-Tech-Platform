/* ⚠️ NON VA IN npm test: è il LANCIATORE del giro, non una prova. Messo in
   `test` chiamerebbe sé stesso.

   IL GIRO DI VERIFICA PRIMA DEL COMMIT, IN UN COMANDO SOLO
   ══════════════════════════════════════════════════════════════════════
   Perché esiste: il 01/08 la CI è caduta su `suite-collegate.mjs`, che
   pretende che ogni file `.mjs` in `tests/` o giri in CI o dichiari di
   essere una misura. Il file nuovo (`mostra.mjs`) non lo dichiarava — ed
   era giusto che il controllo lo prendesse. Quello che NON era giusto è
   **come** l'abbiamo saputo: il giro fatto a mano prima del commit ne
   lanciava undici su diciannove, scelte a memoria. Una lista tenuta a
   mente si accorcia da sola, e ogni volta che si accorcia il verde che
   stampa vale un po' meno.

   ⛔ E LA LISTA NON SI SCRIVE UNA SECONDA VOLTA. La verità è `scripts.test`
   di `package.json` — quella che gira in CI. Qui si LEGGE quella e si
   tolgono le quattro suite che hanno bisogno degli emulatori Firebase,
   dichiarate per nome con la ragione. Se domani qualcuno aggiunge una
   suite a `test`, entra qui **da sola**: è la differenza fra un elenco
   derivato e un elenco gemello, che è il difetto costato una giornata con
   la convenzione sui numeri.

   Uso:  node apps/deepwork-id/tests/giro-node.mjs
         node apps/deepwork-id/tests/giro-node.mjs --tz   (anche in ora italiana)

   ⚠️ `--tz` non è un vezzo: il contenitore è in UTC e le cave sono in
   Italia, e il 01/08 la suite intera rilanciata con l'orologio del cliente
   è caduta in due punti che in UTC erano verdi. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));

/* Le suite che NON possono girare qui, con la ragione accanto: vogliono gli
   emulatori Firebase (firebase-tools + Java), che in questo ambiente non
   partono. In CI girano, ed è lì che vanno lette. */
const SERVE_EMULATORE = [
  ["run.mjs",           "regole di sicurezza Firestore"],
  ["run-sdk.mjs",       "SDK identità contro il database vero"],
  ["run-fns.mjs",       "Cloud Functions"],
  ["run-bootstrap.mjs", "primo avvio di un'organizzazione"],
];

const script = JSON.parse(readFileSync(join(QUI, "package.json"), "utf8")).scripts.test;
const comandi = script.split("&&").map(c => c.trim()).filter(Boolean);

/* ⛔ Un'eccezione che non serve più è un'eccezione che nasconde: se una
   suite dichiarata qui non compare più in `test`, la riga va tolta —
   altrimenti un giorno copre un'esclusione che nessuno ha deciso. */
const orfane = SERVE_EMULATORE.filter(([f]) => !comandi.some(c => c.includes(f)));
if (orfane.length) {
  console.error(`⛔ ${orfane.length} suite dichiarate «servono l'emulatore» non sono più in npm test: `
    + orfane.map(([f]) => f).join(", ") + " — vanno tolte da SERVE_EMULATORE.");
  process.exit(2);
}

const daFare = comandi.filter(c => !SERVE_EMULATORE.some(([f]) => c.includes(f)));
const tz = process.argv.includes("--tz");

console.log(`\nGiro di verifica senza emulatori — ${daFare.length} suite su ${comandi.length}`);
console.log(`(fuori: ${SERVE_EMULATORE.map(([f, p]) => `${f} — ${p}`).join(" · ")})`);
console.log(tz ? "orologio: UTC e poi Europe/Rome\n" : "orologio: UTC (usa --tz per rifare tutto anche in ora italiana)\n");

const giri = tz ? [{}, { TZ: "Europe/Rome" }] : [{}];
const caduti = [];
for (const env of giri) {
  const dove = env.TZ || "UTC";
  for (const c of daFare) {
    try {
      const out = execSync(c, { cwd: QUI, encoding: "utf8", env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
      const ultima = out.trim().split("\n").filter(r => r.trim()).pop() || "(nessuna riga)";
      console.log(`  ✓ [${dove}] ${ultima}`);
    } catch (e) {
      caduti.push(`[${dove}] ${c}`);
      const testo = ((e.stdout || "") + (e.stderr || "")).split("\n").filter(r => r.includes("✗")).slice(0, 6);
      console.error(`  ✗ [${dove}] ${c}`);
      for (const r of testo) console.error(`      ${r.trim()}`);
    }
  }
}

console.log(`\nGiro senza emulatori: ${daFare.length * giri.length - caduti.length} comandi a posto, ${caduti.length} caduti`);
if (caduti.length) console.error("  caduti: " + caduti.join(" · "));
process.exit(caduti.length ? 1 : 0);

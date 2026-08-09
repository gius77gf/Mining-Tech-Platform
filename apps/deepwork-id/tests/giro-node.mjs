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
/* ⏱️ QUANTE ASSERZIONI GIRANO IN TUTTO, MISURATE INVECE CHE DERIVATE.
   Fino al 09/08 questo numero i documenti se lo ricavavano a mano — «era 2.663
   l'08/08 e questa unità ha aggiunto un caso» — cioè la forma di scrittura che
   CLAUDE.md indica come quella che marcisce: un conto che si muove da solo va
   DERIVATO DA UN COMANDO, non ricopiato. Lo stampa il giro, che è l'unico che
   li lancia tutti.
   ⛔ E si stampa col suo DENOMINATORE: non tutti i comandi hanno una riga da
   sommare — le controprove stampano un verdetto, non un totale — e un numero
   senza il conto di chi non ha risposto si legge come se li avesse contati
   tutti. Quelli che non rispondono si NOMINANO, non si contano soltanto. */
const senzaTotale = [];
let asserzioni = 0, conTotale = 0;
/* ⛔ E IL PRIMO RIGHELLO SBAGLIAVA, NELLA FAMIGLIA CHE QUESTO FILE CONOSCE GIÀ:
   cercava il primo «N passati» in tutta l'uscita, e `orologio-cliente.mjs`
   RILANCIA tre suite in ora italiana e ne STAMPA i riepiloghi. Quindi il conto
   si prendeva il «1984 passati» di `run-kpi` una seconda volta: 4741 invece di
   2757, gonfiato del 72% da un comando solo.
   È alla lettera la lezione scritta il giorno prima sul riepilogo del giro del
   browser — «una RIPETIZIONE contata come roba nuova» — ed è stata presa solo
   perché due righelli indipendenti davano numeri diversi. Un totale da solo
   non l'avrebbe mai detto.
   La forma che regge: si legge **l'ULTIMA riga**, cioè il verdetto che il
   comando dà DI SÉ. Le righe che un comando ripete di altri stanno in mezzo e
   non contano — per costruzione, non per un elenco di eccezioni. */
const contaAsserzioni = (out, c, primoGiro) => {
  if (!primoGiro) return;                       // con --tz gira tutto due volte: si conta un giro solo
  const ultima = String(out || "").trim().split("\n").filter((r) => r.trim()).pop() || "";
  const m = /(\d+) passati/.exec(ultima);
  if (m) { asserzioni += +m[1]; conTotale++; }
  else senzaTotale.push(c.replace(/^node\s+/, ""));   // col flag: `classi-orfane --controprova` non è `classi-orfane`
};
for (const env of giri) {
  const dove = env.TZ || "UTC";
  const primoGiro = env === giri[0];
  for (const c of daFare) {
    try {
      const out = execSync(c, { cwd: QUI, encoding: "utf8", env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
      const ultima = out.trim().split("\n").filter(r => r.trim()).pop() || "(nessuna riga)";
      console.log(`  ✓ [${dove}] ${ultima}`);
      contaAsserzioni(out, c, primoGiro);
    } catch (e) {
      caduti.push(`[${dove}] ${c}`);
      const testo = ((e.stdout || "") + (e.stderr || "")).split("\n").filter(r => r.includes("✗")).slice(0, 6);
      console.error(`  ✗ [${dove}] ${c}`);
      for (const r of testo) console.error(`      ${r.trim()}`);
      contaAsserzioni((e.stdout || "") + (e.stderr || ""), c, primoGiro);
    }
  }
}

console.log(`\nAsserzioni eseguite dal giro: ${asserzioni}`
  + `  ·  ${conTotale} comandi su ${daFare.length} hanno una riga da sommare`);
if (senzaTotale.length) {
  console.log(`   ⚠️  ${senzaTotale.length} NON contati, perché stampano un verdetto invece di un totale: ${senzaTotale.join(", ")}`);
  console.log("      Non vuol dire «non hanno provato niente»: vuol dire che questo conto non li vede.");
}
console.log("   ⚠️  E non è il numero da citare come «prove»: qui dentro ci sono suite che contano FILE"
  + " (una asserzione per file), che crescono da sole quando nasce un file, e ci sono le CONTROPROVE, che sono"
  + " asserzioni vere ma su un difetto messo apposta. Quello da citare è il totale delle otto"
  + " suite che contano casi, sorvegliato da numeri-nei-documenti.mjs.");
console.log("   ⚠️  Le suite che `orologio-cliente` rilancia in ora italiana NON sono contate due volte:"
  + " di ogni comando si legge solo l'ultima riga, cioè il verdetto che dà di sé.");

console.log(`\nGiro senza emulatori: ${daFare.length * giri.length - caduti.length} comandi a posto, ${caduti.length} caduti`);
if (caduti.length) console.error("  caduti: " + caduti.join(" · "));
process.exit(caduti.length ? 1 : 0);

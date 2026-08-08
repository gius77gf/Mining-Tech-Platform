/* ============================================================
   ⛔ UN'INIEZIONE CHE NON TROVA PIÙ IL SUO PEZZO SPEGNE UNA CONTROPROVA
      IN SILENZIO.
   ------------------------------------------------------------
   Perché esiste. Un banco del browser prova di saper fallire rimettendo il
   difetto nel file che serve: cerca una stringa di codice e la sostituisce con
   la versione rotta. Ma quella stringa cita il codice **testualmente**, e il
   codice si muove — di solito perché è **migliorato**. Quando la stringa non
   combacia più non succede niente di visibile: la pagina servita resta SANA, la
   controprova gira su un prodotto sano e non trova niente, e il banco dichiara
   «non distingue». È la terza delle cinque cause di «non distingue» censite in
   CLAUDE.md: non si tocca né la prova né il codice, si guarda l'INIEZIONE.

   Misurato l'08/08: **174 iniezioni in 20 banchi, TRE scadute**, e tutte e tre
   per lo stesso motivo buono — una decisione spostata in una funzione condivisa
   (`provenienzaPpv`, `_ppvBaseHtml`) e le unità avvolte in `<span class="u">`.
   Il costo di non accorgersene: tre controprove che dicevano «non distingue» da
   giorni, dentro registri da cinquemila righe.

   ⚠️ QUESTO CONTROLLO NON APRE UN BROWSER e non serve un server: guarda le
   stringhe e i file. Gira in `npm test`, cioè **prima** del commit, mentre il
   giro del browser che se ne accorgerebbe dura sei ore.

   ⚠️ DUE FORME DI TABELLA, e la prima stesura ne conosceva UNA. La solita è
   `[cerca, sostituisci]`; `scudo-disegni.mjs` mette il FILE davanti —
   `[file, cerca, sostituisci]`. Leggendo tutto come la prima, il nome del file
   finiva nel posto della stringa da cercare: **tre allarmi falsi**, tutti nello
   stesso banco. Un difetto identico in più righe vicine è il modo in cui si
   riconosce di stare guardando il righello.
   ============================================================ */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const BANCHI = join(QUI, "browser");
const R = join(QUI, "..", "..", "..");

/* I file che un banco può servire trasformati. Elenco DERIVATO dal disco per le
   app (una app nuova entra da sola), più il core e i moduli condivisi. */
const SORGENTI = [];
for (const p of ["index.html", "sw.js"]) SORGENTI.push(p);
for (const f of readdirSync(join(R, "shared"))) if (f.endsWith(".js")) SORGENTI.push("shared/" + f);
for (const f of readdirSync(join(R, "shared", "deepwork-id-client"))) {
  if (f.endsWith(".js")) SORGENTI.push("shared/deepwork-id-client/" + f);
}
for (const app of readdirSync(join(R, "apps"), { withFileTypes: true })) {
  if (!app.isDirectory()) continue;
  for (const f of readdirSync(join(R, "apps", app.name))) {
    if (f.endsWith(".html") || f.endsWith(".js")) SORGENTI.push(`apps/${app.name}/${f}`);
  }
}
const testi = SORGENTI.map((p) => {
  try { return readFileSync(join(R, p), "utf8"); } catch { return ""; }
});

/* ⛔ I BANCHI LA CUI TABELLA NON SI LEGGE DA FERMI, dichiarati per nome con la
   ragione — e l'elenco è **sorvegliato**: se uno di questi diventa leggibile,
   o se ne compare uno nuovo, il controllo cade. È la disciplina di
   `sonda-vuoto`: un'eccezione che non serve più è un'eccezione che nasconde. */
const NON_LEGGIBILI = [
  ["scudo-documenti.mjs", "la tabella si costruisce da variabili del banco (`MODULO`), non da letterali"],
];

let banchi = 0, totali = 0;
const scadute = [], illeggibili = [];
for (const f of readdirSync(BANCHI).filter((x) => x.endsWith(".mjs")).sort()) {
  const src = readFileSync(join(BANCHI, f), "utf8");
  const i = src.search(/const DIFETTI\s*=\s*\[/);
  if (i < 0) continue;
  const fine = src.indexOf("\n];", i);
  if (fine < 0) continue;
  let tabella;
  try { tabella = eval(src.slice(i, fine).replace(/const DIFETTI\s*=\s*\[/, "[") + "]"); }
  catch (e) { illeggibili.push(f); continue; }
  if (!Array.isArray(tabella) || !tabella.length) continue;
  banchi++;
  for (const d of tabella) {
    /* tre elementi = il primo è il file; due = la stringa da cercare è la prima */
    const cerca = !Array.isArray(d) ? d : (d.length >= 3 ? d[1] : d[0]);
    if (typeof cerca !== "string" || !cerca.trim()) continue;
    totali++;
    if (!testi.some((t) => t.includes(cerca))) scadute.push([f, cerca]);
  }
}

let male = 0;
const dice = (ok, testo, extra) => {
  console.log(`  ${ok ? "✓" : "✗"} ${testo}${extra ? ": " + extra : ""}`);
  if (!ok) male++;
};

console.log("\n════════ le iniezioni delle controprove sono ancora sul bersaglio? ════════");
dice(scadute.length === 0,
  "ogni iniezione trova ancora il suo pezzo nel codice",
  scadute.length ? scadute.map(([f, c]) => `\n      ${f} cerca ${JSON.stringify(c.slice(0, 90))}`).join("") : "");

/* ⛔ E IL DENOMINATORE, che è la ragione per cui questo controllo non si legge
   come un «zero violazioni» qualunque: quanti soggetti ha guardato davvero. */
dice(totali > 100,
  "il controllo ha guardato abbastanza soggetti da voler dire qualcosa",
  `${totali} iniezioni in ${banchi} banchi, su ${SORGENTI.length} file di prodotto`);

const attesi = NON_LEGGIBILI.map(([f]) => f).sort().join(",");
dice(illeggibili.sort().join(",") === attesi,
  "l'elenco dei banchi non leggibili da fermi è ancora quello dichiarato",
  `trovati [${illeggibili.join(", ")}], dichiarati [${NON_LEGGIBILI.map(([f]) => f).join(", ")}]`);
for (const [f, perche] of NON_LEGGIBILI) console.log(`      · ${f} — ${perche}`);

/* ⛔ LA CONTROPROVA: un'iniezione inventata deve essere vista. Senza, questo
   file direbbe «zero» anche se il confronto fosse rotto — ed è esattamente
   quello che il controllo esiste per impedire agli altri. */
const finta = "questa stringa non sta in nessun file del prodotto, 08/08";
dice(!testi.some((t) => t.includes(finta)),
  "controprova: una stringa inventata NON viene trovata (se no il confronto è rotto)");

console.log(`\nRisultato iniezioni fresche: ${totali - scadute.length} sul bersaglio su ${totali}`
  + `  ·  ${banchi} banchi letti, ${illeggibili.length} non leggibili da fermi (dichiarati)`);
process.exit(male ? 1 : 0);

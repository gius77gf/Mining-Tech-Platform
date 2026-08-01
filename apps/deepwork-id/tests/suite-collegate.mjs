// ============================================================
// OGNI SUITE È COLLEGATA, O DICHIARA DI NON ESSERLO
//
// ⛔ PERCHÉ ESISTE. La CI lancia `npm test`, e `npm test` è una **riga scritta a
// mano** in `tests/package.json` che elenca le suite **per nome**. Una suite
// nuova che nessuno aggiunge a quella riga **non gira mai**: sta lì, verde in
// locale, e non protegge niente. È la guardia scollegata della regola 17 —
// togliere le funzioni dimenticando il `<script>` — applicata alla CI.
//
// Trovato il 01/08 scrivendo `date-checkpoint.mjs`: appena finito, non era
// nella riga. E con lei ce n'erano altre due fuori, da prima.
//
// COME SI DICHIARA UNA MISURA. Non tutte le `.mjs` sono prove: alcune sono
// **misure** — stampano e basta, non falliscono mai, e metterle in `npm test`
// vorrebbe dire una CI che non dice niente. Quelle si dichiarano **nel file
// stesso**, con la riga marcatore qui sotto nelle prime venti righe.
// Dichiararle nel file e non in un elenco a parte è di proposito: un elenco è
// una seconda copia che invecchia, il marcatore viaggia col file che descrive.
// ============================================================
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));

let passed = 0, failed = 0;
const test = (nome, fn) => { try { fn(); passed++; console.log(`  ✓ ${nome}`); } catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); } };
const ok = (c, why) => { if (!c) throw new Error(why); };

export const MARCATORE = "NON VA IN npm test";

/* Le tre risposte, calcolate su TESTI: così la controprova non tocca niente. */
/* ⛔ LE CASE LEGITTIME SONO TRE, non una. Le suite `node` le lancia `npm test`;
   i banchi del browser NON possono starci (vogliono Chromium e un server) e li
   lancia `browser/tutti.mjs`, che ha una **sua** lista scritta a mano — cioè lo
   stesso identico rischio, un piano più sotto. Un banco fuori da quella lista
   non gira mai, esattamente come una suite fuori da `npm test`.
   Misurato il 01/08: due c'erano già — `giro-su-copia.mjs`, che prova il
   meccanismo su cui tutto il giro adesso si appoggia, e `contrasto-core.mjs`. */
export function suiteScollegate(file, testi, rigaNpm, listaBanchi = "") {
  const out = [];
  for (const f of file) {
    const base = f.replace(/^.*\//, "");
    if (rigaNpm.includes(`node ${f}`)) continue;                 // la lancia npm test
    if (f.startsWith("browser/") && listaBanchi.includes(`'${base}'`)) continue;  // la lancia tutti.mjs
    const testa = (testi.get(f) || "").split("\n").slice(0, 20).join("\n");
    if (testa.includes(MARCATORE)) continue;                     // dichiarata misura o aiuto
    out.push(f);
  }
  return out;
}

/* ⚠️ SOLO I FILE TRACCIATI DA GIT, e non è un filtro di comodo. `readdirSync`
   trovava anche `.sdk-under-test*.mjs`: **copie dell'SDK generate a runtime** da
   run-sdk / run-fns / run-bootstrap, che non sono suite e non sono in git.
   Il criterio giusto non è «non comincia per punto» — sarebbe una regola sul
   nome — ma «fa parte del progetto», e quello lo dice l'indice di git. Una
   suite vera è committata, quindi questo filtro non può nasconderne una. */
const FILE = execSync("git ls-files -- .", { cwd: QUI, encoding: "utf8" })
  .split("\n").map((x) => x.trim()).filter((x) => x.endsWith(".mjs")).sort();
const TESTI = new Map(FILE.map((f) => [f, readFileSync(join(QUI, f), "utf8")]));
const NPM = JSON.parse(readFileSync(join(QUI, "package.json"), "utf8")).scripts.test;
const TUTTI = TESTI.get("browser/tutti.mjs") || "";

console.log(`\nSuite collegate — ${FILE.length} file .mjs tracciati in tests/\n`);

test("ogni suite è in `npm test`, o dichiara nel file di essere una misura", () => {
  const v = suiteScollegate(FILE, TESTI, NPM, TUTTI);
  ok(v.length === 0,
    `${v.length} suite non girano in CI e non lo dichiarano → ${v.join(", ")}`
    + `\n      o si aggiungono a scripts.test in tests/package.json, o scrivono «${MARCATORE}» nelle prime 20 righe con la ragione`);
});

/* Quante ne ha davvero guardate, e come si dividono: uno «zero violazioni»
   ottenuto su zero file è il difetto raccolto tre volte in CLAUDE.md. */
test("il controllo ha davvero letto le suite, e dice come si dividono", () => {
  const collegate = FILE.filter((f) => NPM.includes(`node ${f}`));
  const banchi = FILE.filter((f) => f.startsWith("browser/")
    && TUTTI.includes(`'${f.replace(/^.*\//, "")}'`) && !NPM.includes(`node ${f}`));
  const misure = FILE.filter((f) => !collegate.includes(f) && !banchi.includes(f)
    && (TESTI.get(f) || "").split("\n").slice(0, 20).join("\n").includes(MARCATORE));
  console.log(`      ${collegate.length} in npm test · ${banchi.length} banchi in tutti.mjs · ${misure.length} misure/aiuti dichiarati`);
  ok(FILE.length >= 15, `file .mjs trovati: ${FILE.length} — troppi pochi perché stia guardando davvero`);
  ok(collegate.length >= 12, `suite in npm test: ${collegate.length} — la riga non si aggancia`);
  ok(banchi.length >= 15, `banchi agganciati a tutti.mjs: ${banchi.length} — la lista non si aggancia`);
});

/* ⚠️ LA CONTROPROVA, su testi in memoria: nessun file toccato. */
test("la controprova: la suite muta viene vista, la misura dichiarata no", () => {
  const npm = "node run-a.mjs && node run-b.mjs";
  const testi = new Map([
    ["run-a.mjs", "// prova\n"],
    ["run-b.mjs", "// prova\n"],
    ["nuova.mjs", "// prova nuova che nessuno ha collegato\n"],
    ["misura.mjs", `/* ${MARCATORE}: stampa e basta, non fallisce mai */\n`],
  ]);
  const v = suiteScollegate([...testi.keys()], testi, npm, "");
  ok(v.length === 1 && v[0] === "nuova.mjs",
    `deve vedere solo la suite muta: ${JSON.stringify(v)}`);
  // e il marcatore vale solo se è IN CIMA: sepolto in fondo non conta,
  // se no basterebbe nominarlo in un commento qualunque per sparire dai radar
  const sepolto = new Map([["tarda.mjs", "\n".repeat(40) + `// ${MARCATORE}\n`]]);
  ok(suiteScollegate(["tarda.mjs"], sepolto, npm, "").length === 1,
    "un marcatore sepolto a riga 41 non deve valere come dichiarazione");
  // e la terza casa: un banco elencato in tutti.mjs non è scollegato
  const banco = new Map([["browser/x.mjs", "// banco\n"]]);
  ok(suiteScollegate(["browser/x.mjs"], banco, npm, "  ['nome', 'x.mjs', []],").length === 0,
    "un banco elencato in tutti.mjs va considerato collegato");
  ok(suiteScollegate(["browser/x.mjs"], banco, npm, "  ['nome', 'altro.mjs', []],").length === 1,
    "e uno NON elencato deve essere visto");
});

console.log(`\nRisultato suite collegate: ${passed} passati, ${failed} falliti  ·  ${FILE.length} file guardati`);
process.exit(failed > 0 ? 1 : 0);

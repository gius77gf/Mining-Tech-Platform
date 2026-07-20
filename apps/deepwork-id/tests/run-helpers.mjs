// ============================================================
// Test degli helper di sicurezza CONDIVISI usati da tutte le app
// (shared/deepwork-id-client/dw-shell.js): esc() contro XSS
// memorizzato nelle liste e csvCell() contro la CSV-injection
// negli export. JS puro, non serve nessun emulatore: blindano
// le protezioni contro regressioni future.
// Si esegue con: node run-helpers.mjs (o dentro npm test).
// ============================================================

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const { esc, csvCell, parseCsvLine } = await import(
  join(HERE, "../../../shared/deepwork-id-client/dw-shell.js")
);

let passed = 0, failed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
};
const eq = (got, exp, why) => {
  if (got !== exp) throw new Error(`${why}: atteso ${JSON.stringify(exp)}, ottenuto ${JSON.stringify(got)}`);
};

console.log("\n— esc(): escape HTML anti-XSS —");
test("neutralizza i tag: < e >", () =>
  eq(esc("<img onerror=x>"), "&lt;img onerror=x&gt;", "tag"));
test("neutralizza le virgolette doppie e singole", () =>
  eq(esc(`a"b'c`), "a&quot;b&#39;c", "virgolette"));
test("neutralizza la e-commerciale per prima", () =>
  eq(esc("&lt;"), "&amp;lt;", "ampersand"));
test("null/undefined diventano stringa vuota", () =>
  eq(esc(null), "", "null") || eq(esc(undefined), "", "undefined"));
test("un testo normale resta invariato", () =>
  eq(esc("Mario Rossi"), "Mario Rossi", "normale"));

console.log("\n— csvCell(): anti CSV-injection negli export —");
test("prefissa apostrofo a una formula '='", () =>
  eq(csvCell("=SUM(A1:A9)"), "'=SUM(A1:A9)", "uguale"));
test("prefissa apostrofo a '+'", () =>
  eq(csvCell("+1234"), "'+1234", "piu"));
test("prefissa apostrofo a '-'", () =>
  eq(csvCell("-cmd"), "'-cmd", "meno"));
test("prefissa apostrofo a '@'", () =>
  eq(csvCell("@SUM"), "'@SUM", "chiocciola"));
test("mette tra virgolette un valore col separatore ';'", () =>
  eq(csvCell("Rossi;Mario"), '"Rossi;Mario"', "separatore"));
test("raddoppia le virgolette interne", () =>
  eq(csvCell('dice "ciao"'), '"dice ""ciao"""', "virgolette interne"));
test("mette tra virgolette un valore con a capo", () =>
  eq(csvCell("riga1\nriga2"), '"riga1\nriga2"', "a capo"));
test("null diventa stringa vuota", () =>
  eq(csvCell(null), "", "null"));
test("un numero diventa la sua stringa", () =>
  eq(csvCell(42), "42", "numero"));
test("un testo innocuo resta invariato", () =>
  eq(csvCell("Fochino"), "Fochino", "innocuo"));

const eqArr = (got, exp, why) => eq(JSON.stringify(got), JSON.stringify(exp), why);

console.log("\n— parseCsvLine(): import CSV che rispetta le virgolette —");
test("riga semplice separata da ;", () =>
  eqArr(parseCsvLine("Mario;Fochino;333"), ["Mario", "Fochino", "333"], "semplice"));
test("campo tra virgolette col separatore dentro resta unito", () =>
  eqArr(parseCsvLine('"Rossi;Mario";Fochino'), ["Rossi;Mario", "Fochino"], "sep interno"));
test("virgolette raddoppiate = virgoletta letterale", () =>
  eqArr(parseCsvLine('"dice ""ciao""";x'), ['dice "ciao"', "x"], "virgolette interne"));
test("toglie l'apostrofo di guardia davanti a =", () =>
  eqArr(parseCsvLine("'=SUM(A1);ruolo"), ["=SUM(A1)", "ruolo"], "guardia formula"));
test("NON tocca un apostrofo davanti a testo normale", () =>
  eqArr(parseCsvLine("'ndrangheta;x"), ["'ndrangheta", "x"], "apostrofo legittimo"));
test("fallback su virgola se non c'è ;", () =>
  eqArr(parseCsvLine("Mario,Fochino,333"), ["Mario", "Fochino", "333"], "virgola"));
test("round-trip: csvCell poi parseCsvLine ricostruisce l'originale", () => {
  const orig = "=SUM(A1);Mario";
  const cella = csvCell(orig);                 // -> "\"'=SUM(A1);Mario\"" (guardia + virgolette)
  eqArr(parseCsvLine(cella), [orig], "round-trip");
});

console.log(`\nRisultato Helper: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

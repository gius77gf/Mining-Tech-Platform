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
const { esc, csvCell, parseCsvLine, numIt, isIntestazione, dataISOEsiste } = await import(
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
test("neutralizza una formula preceduta da TAB", () =>
  eq(csvCell("\t=cmd"), "'\t=cmd", "tab+formula"));
test("neutralizza una formula preceduta da spazio", () =>
  eq(csvCell(" =cmd"), "' =cmd", "spazio+formula"));
test("neutralizza una formula preceduta da a-capo (CR) e la mette tra virgolette", () =>
  eq(csvCell("\r=cmd"), '"\'\r=cmd"', "cr+formula"));

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
test("un ; dentro un campo quotato NON scambia il file a virgole per ';'", () =>
  eqArr(parseCsvLine('"a;b",c'), ["a;b", "c"], "delimitatore fuori dalle virgolette"));
test("i campi tra virgolette conservano gli spazi, gli altri no", () => {
  eqArr(parseCsvLine('" Mario ";x'), [" Mario ", "x"], "quotato conserva gli spazi");
  eqArr(parseCsvLine(" Mario ; x "), ["Mario", "x"], "non quotato ripulito");
});
test("round-trip: csvCell poi parseCsvLine ricostruisce l'originale", () => {
  const orig = "=SUM(A1);Mario";
  const cella = csvCell(orig);                 // -> "\"'=SUM(A1);Mario\"" (guardia + virgolette)
  eqArr(parseCsvLine(cella), [orig], "round-trip");
});

console.log("\n— numIt(): numeri all'italiana/inglese senza perdere righe —");
test("migliaia inglesi multiple: 1,234,567 → 1234567 (prima dava NaN)", () =>
  eq(numIt("1,234,567"), 1234567, "en migliaia"));
test("migliaia italiane multiple: 1.234.567 → 1234567 (prima dava NaN)", () =>
  eq(numIt("1.234.567"), 1234567, "it migliaia"));
test("misto italiano 18.300,50 → 18300.5", () =>
  eq(numIt("18.300,50"), 18300.5, "it misto"));
test("misto inglese 18,300.50 → 18300.5", () =>
  eq(numIt("18,300.50"), 18300.5, "en misto"));
test("una sola virgola = decimale: 1234,5 → 1234.5", () =>
  eq(numIt("1234,5"), 1234.5, "it decimale"));
test("punto isolato resta decimale: 19.4 → 19.4", () =>
  eq(numIt("19.4"), 19.4, "punto decimale"));
test("negativo all'italiana: -18.300,50 → -18300.5", () =>
  eq(numIt("-18.300,50"), -18300.5, "negativo"));
test("vuoto e testo → NaN (la riga verrà scartata)", () => {
  eq(Number.isNaN(numIt("")), true, "vuoto");
  eq(Number.isNaN(numIt("abc")), true, "testo");
});

console.log("\n— isIntestazione(): riconosce l'header CSV per ogni delimitatore —");
test("header separato da ; → è intestazione", () =>
  eq(isIntestazione("titolo;base;scadenza;stato", "titolo"), true, "punto e virgola"));
test("header separato da virgola → è intestazione (prima veniva importato come riga)", () =>
  eq(isIntestazione("titolo,base,scadenza,stato", "titolo"), true, "virgola"));
test("header separato da TAB → è intestazione", () =>
  eq(isIntestazione("titolo\tbase\tscadenza", "titolo"), true, "tab"));
test("maiuscole e spazi dopo il nome colonna → è intestazione", () =>
  eq(isIntestazione("  Titolo ; base", "titolo"), true, "case/spazi"));
test("riga di dati normale → NON è intestazione", () =>
  eq(isIntestazione("Fornitura inerti;120000;2026-07-28;aperta", "titolo"), false, "dati"));
test("valore che inizia con la keyword ma senza separatore → NON è intestazione", () =>
  eq(isIntestazione("titolone di gara", "titolo"), false, "senza delimitatore"));
test("keyword vuota → mai intestazione", () =>
  eq(isIntestazione("qualsiasi;cosa", ""), false, "keyword vuota"));
test("keyword PREFISSO di un nome più lungo → NON è intestazione (serve il delimitatore subito dopo)", () => {
  eq(isIntestazione("dataInizio;x", "data"), false, "dataInizio non è header 'data'");
  eq(isIntestazione("nominativo;x", "nome"), false, "nominativo non è header 'nome'");
  eq(isIntestazione("data;x", "data"), true, "data esatto sì");
});

/* ── UNA DATA ESISTE DAVVERO? ─────────────────────────────────────────
   Nata il 03/08 da un difetto vero in Scudo: l'import delle scadenze filtrava
   con `/^\d{4}-\d{2}-\d{2}$/`, che guarda la FORMA. «2026-13-45» ce l'ha, e
   una visita medica con quella data restava verde per sempre.
   E `Date.parse` da solo non basta — è la prova che conta più di tutte qui
   sotto: «2026-02-30» NON è NaN, JavaScript lo fa scivolare al 2 marzo.
   docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md */
test("dataISOEsiste: le date vere passano", () => {
  eq(dataISOEsiste("2026-07-31"), true, "una data qualsiasi");
  eq(dataISOEsiste("2028-02-29"), true, "29 febbraio di un bisestile");
  eq(dataISOEsiste("2026-12-31"), true, "ultimo dell'anno");
  eq(dataISOEsiste("2026-01-01"), true, "primo dell'anno");
});
test("dataISOEsiste: la FORMA giusta col contenuto impossibile non passa", () => {
  eq(dataISOEsiste("2026-13-45"), false, "mese 13, giorno 45");
  eq(dataISOEsiste("2026-00-10"), false, "mese zero");
  eq(dataISOEsiste("2026-04-31"), false, "31 aprile");
});
test("dataISOEsiste: il caso che `Date.parse` da solo NON vede", () => {
  // è la ragione per cui questa funzione esiste invece di un Date.parse
  eq(Number.isNaN(Date.parse("2026-02-30T00:00:00")), false, "Date.parse ACCETTA il 30 febbraio");
  eq(dataISOEsiste("2026-02-30"), false, "30 febbraio non esiste");
  eq(dataISOEsiste("2027-02-29"), false, "29 febbraio in un anno non bisestile");
});
test("dataISOEsiste: quello che non ha nemmeno la forma non passa", () => {
  eq(dataISOEsiste("15/10/2026"), false, "formato italiano");
  eq(dataISOEsiste(""), false, "vuota");
  eq(dataISOEsiste(null), false, "null");
  eq(dataISOEsiste(undefined), false, "undefined");
  eq(dataISOEsiste("2026-7-31"), false, "senza lo zero davanti");
});
test("dataISOEsiste: una data ISO con l'ora dentro vale per la sua parte di data", () => {
  eq(dataISOEsiste("2026-07-31T10:00:00"), true, "con l'ora");
});

console.log(`\nRisultato Helper: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

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
const H = await import(
  join(HERE, "../../../shared/deepwork-id-client/dw-shell.js")
);
const { esc, csvCell, parseCsvLine, numIt, isIntestazione, dataISOEsiste, leggiCsv, giorniTra, avvolgiUnita, motivoDatiNonSalvati } = H;

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

test("⛔ istanteLocale mette in ordine due gesti dello STESSO giorno", () => {
  /* Serve dove la sola data non basta: «chiudo il mese» e «registro una
     bolletta che mi ero dimenticato» capitano lo stesso giorno, e col solo
     giorno il confronto «dopo» è sempre falso — la funzione che deve
     accorgersene non scatta mai. */
  const mattina = H.istanteLocale(new Date(2026, 7, 1, 9, 30, 0));
  const sera = H.istanteLocale(new Date(2026, 7, 1, 18, 5, 0));
  eq(mattina < sera, true, "ordinabile come stringa: " + mattina + " < " + sera);
  eq(mattina.slice(0, 10), "2026-08-01", "e i primi dieci caratteri restano il giorno");
  /* ⛔ i SECONDI non sono precisione, sono necessità: al minuto due gesti fatti
     di seguito cadono nello stesso istante e l'ordine si perde. */
  eq(H.istanteLocale(new Date(2026, 7, 1, 9, 30, 10))
     > H.istanteLocale(new Date(2026, 7, 1, 9, 30, 9)), true, "e i secondi distinguono");
  /* ⛔ E COSTRUITO DAI GETTER LOCALI, MAI DA `toISOString()`.
     ⚠️ Il caso che lo dimostra è il MATTINO PRESTO, non la sera: la prima
     stesura provava le 23:30 italiane, e la controprova non distingueva —
     alle 23:30 d'estate Greenwich segna le 21:30 dello STESSO giorno. È a
     mezzanotte e mezza che l'Italia è già il 2 agosto e Greenwich è ancora
     l'1, cioè dove `toISOString()` scriverebbe il giorno SBAGLIATO. */
  const notte = new Date(2026, 7, 2, 0, 30, 0);
  eq(H.istanteLocale(notte).slice(0, 10), H.isoLocale(notte),
    "il giorno è quello locale, non quello di Greenwich");
  eq(H.istanteLocale(notte).slice(0, 10), "2026-08-02",
    "il 2 agosto alle 00:30 in Italia è il 2 agosto, non l'1");
  eq(H.istanteLocale("non una data"), "", "e una data illeggibile non diventa un istante");
});

/* ⛔ IL GIRO DI ANDATA E RITORNO ESISTEVA — MA SUL LETTORE VECCHIO.
   Sopra c'è già «round-trip: csvCell poi parseCsvLine», scritta quando
   `parseCsvLine` era l'unico lettore. Il 01/08 è arrivato `leggiCsv`, che legge
   il file INTERO (serviva: le banche scrivono la causale su più righe dentro le
   virgolette, e leggendo riga per riga un bonifico da 12.300 € spariva) — e ha
   ereditato il mestiere ma **non la prova**. Risultato misurato: su sette valori
   scritti da noi e riletti da noi, **quattro non tornavano identici**, e il caso
   che morde è il più banale — un numero **negativo** usciva «-12,5» e rientrava
   «'-12,5», cioè `NaN`. Un dato che c'era, perso nel giro di casa nostra.
   Questa prova sta sul lettore NUOVO, e sugli stessi valori. */
console.log("\n— il giro completo: quello che scriviamo, riletto da chi lo rilegge davvero —");
const GIRO = ["=SUM(A1:A9)", "+1234", "-cmd", "@SUM", "Rossi;Mario", 'dice "ciao"',
              "riga1\nriga2", "Fochino", "\t=cmd", " =cmd", "\r=cmd", "-12,5",
              "'ndrangheta", "'90", "12,5", "prima riga\nseconda riga"];
test(`round-trip: csvCell poi leggiCsv, ${GIRO.length} valori, tutti identici`, () => {
  const rotti = [];
  for (const v of GIRO) {
    // un file vero ha l'intestazione: senza, il separatore lo si indovina su
    // una riga sola ed è un'altra cosa (è la ragione per cui `leggiCsv` esiste)
    const letto = leggiCsv("valore;altra\n" + csvCell(v) + ";x").righe[1]?.[0];
    if (letto !== v) rotti.push(`${JSON.stringify(v)} → ${JSON.stringify(letto)}`);
  }
  eq(rotti.length, 0, "non tornano identici: " + rotti.join(" · "));
});
test("anche il lettore di UNA riga toglie la guardia quando l'innesco è preceduto da uno spazio bianco", () => {
  /* `csvCell` neutralizza «\t=cmd» e «\r=cmd» perché per OWASP pure TAB e CR
     fanno da innesco. Il lettore di una riga sola guardava **un carattere**
     dopo l'apostrofo e quindi non li ripuliva. Qui il campo si scrive fra
     virgolette apposta: senza, la riga singola indovinerebbe il TAB come
     separatore e si misurerebbe un'altra cosa — è la ragione per cui i file
     veri si leggono con `leggiCsv`. */
  eq(parseCsvLine('"\'\t=cmd"')[0], "\t=cmd", "tab prima dell'innesco");
  eq(parseCsvLine('"\' =cmd"')[0], " =cmd", "spazio prima dell'innesco");
  eq(parseCsvLine('"\'ndrangheta"')[0], "'ndrangheta", "e una parola che comincia per apostrofo resta intera");
});
test("l'apostrofo che NON è una guardia resta dov'è", () => {
  // «'ndrangheta» e «'90» cominciano davvero per apostrofo: toglierlo
  // sarebbe cambiare il dato di chi scrive
  eq(leggiCsv("a;b\n'ndrangheta;x").righe[1][0], "'ndrangheta", "parola");
  eq(leggiCsv("a;b\n'90;x").righe[1][0], "'90", "anno abbreviato");
});
test("⛔ avvolgiUnita: la tonnellata è un'unità — da sola e in coda a un prezzo", () => {
  /* Trovata guardando uno scatto degli ordini di Conti: «300,00 T», «€ 11,50/T»,
     «€ 4,20/M³». La pastiglia è `text-transform:uppercase` e un'unità fuori
     dallo `<span class="u">` ci finisce dentro — un'unità in maiuscolo è un
     difetto già pestato tre volte. Serve a Conti, Terra e Flotta. */
  const q = (s) => avvolgiUnita(s).replace(/<span class="u">/g, "[").replace(/<\/span>/g, "]");
  eq(q("300,00 t"), "300,00[ t]", "tonnellata da sola");
  eq(q("€ 11,50/t"), "€ 11,50[/t]", "prezzo alla tonnellata");
  eq(q("€ 4,20/m³"), "€ 4,20[/m³]", "prezzo al metro cubo");
  eq(q("2,5 t/m³"), "2,5[ t/m³]", "e la densità resta una cosa sola");
});
test("⛔ avvolgiUnita: «t» è UNA LETTERA, e non deve mordere le parole", () => {
  /* la difesa è la stessa di «h»: una cifra prima, e nessun carattere di parola
     dopo. Senza, «12 tonnellate» diventerebbe «12 [t]onnellate». */
  for (const s of ["12 tonnellate", "il 3 turno", "2026-08-01T00:00", "5 tir in coda"])
    eq(avvolgiUnita(s), s, `«${s}» non contiene un'unità`);
  eq(avvolgiUnita("5 t di ghiaia").includes('<span class="u"> t</span>'), true,
     "ma «5 t di ghiaia» sì");
});
test("⛔ giorniTra: una data che NON ESISTE non produce un conto di giorni", () => {
  /* `new Date("2026-02-30T00:00:00")` non è invalida: `Date` fa **scorrere** il
     giorno al 2 marzo. Effetto misurato in Conti, dove `giorniTra` regge le
     scadenze: una fattura con scadenza 30 febbraio usciva «insoluta da 152
     giorni» invece di «senza scadenza» — un ritardo inventato, e un cliente
     sollecitato per una data che non c'è. Vale per cinque app. */
  const oggi = new Date("2026-08-01T12:00:00");
  for (const s of ["2026-02-30", "2026-02-29", "2026-04-31", "2026-13-45", "2026-00-10"])
    eq(Number.isNaN(giorniTra(s, oggi)), true, `«${s}» non esiste: non può dare un numero`);
  // e il 29 febbraio di un anno BISESTILE invece esiste
  eq(giorniTra("2024-02-29", new Date("2024-03-01T12:00:00")), -1, "il 29 febbraio del 2024 c'è");
});
test("⛔ giorniTra: e un ISTANTE è una data buona, non va persa", () => {
  /* il difetto opposto, e nello stesso punto: «2026-06-30T10:00» diventava
     `…T10:00T00:00:00`, cioè NaN — la scadenza c'era e l'app rispondeva
     «senza scadenza». È lo stesso caso già corretto in `dataIt`. */
  const oggi = new Date("2026-08-01T12:00:00");
  eq(giorniTra("2026-06-30T10:00", oggi), -32, "istante con l'ora");
  eq(giorniTra("2026-06-30T23:59:59Z", oggi), -32, "istante con i secondi e la zona");
  eq(giorniTra("2026-06-30", oggi), -32, "e la data secca dà lo stesso numero");
});
test("numIt: un non-numero non diventa un numero enorme", () => {
  // `+"Infinity"` fa Infinity, e da lì ogni confronto con una soglia è vero
  eq(Number.isNaN(numIt("Infinity")), true, "Infinity");
  eq(Number.isNaN(numIt("-Infinity")), true, "-Infinity");
  eq(Number.isNaN(numIt("1e999")), true, "un esponente fuori scala");
  // e i numeri veri restano numeri, notazione scientifica compresa: le
  // perforatrici scrivono le celle così, ed è già costato una correzione
  eq(numIt("3.2e2"), 320, "notazione scientifica");
  eq(numIt("1e-3"), 0.001, "esponente negativo");
  eq(numIt("1.234,5"), 1234.5, "migliaia all'italiana");
});

// ── QUANDO IL DATABASE NON RISPONDE: CHE COSA SI PUÒ DIRE ──
// Nato il 02/08, il giorno in cui le regole del Firebase pubblico sono state
// chiuse: da lì in poi TUTTI i visitatori cadono nel ripiego del core, che
// diceva «connessione database non disponibile» — falso, la connessione c'era.
test("motivoDatiNonSalvati: le regole che dicono di no NON sono un guasto di rete", () => {
  const r = motivoDatiNonSalvati({ code: "permission-denied", message: "Missing or insufficient permissions." });
  eq(r.causa, "accesso", "permission-denied");
  eq(r.tono, "info", "non è un errore dell'utente né un guasto");
  eq(/collegamento/.test(r.messaggio), false, "non deve parlare di collegamento");
  eq(motivoDatiNonSalvati({ code: "unauthenticated" }).causa, "accesso", "unauthenticated");
});
test("motivoDatiNonSalvati: il codice maiuscolo con l'underscore è lo stesso caso", () => {
  // l'SDK JS scrive `permission-denied`, l'API REST `PERMISSION_DENIED`.
  // Il prototipo sbagliava proprio questo, ed è l'unica forma che si vede
  // guardando il difetto da fuori (curl), cioè quella che si copia-incolla.
  eq(motivoDatiNonSalvati({ code: "PERMISSION_DENIED" }).causa, "accesso", "REST");
});
test("motivoDatiNonSalvati: la rete morta resta rete morta", () => {
  eq(motivoDatiNonSalvati({ code: "unavailable" }).causa, "rete", "unavailable");
  eq(motivoDatiNonSalvati({ code: "deadline-exceeded" }).causa, "rete", "il timeout dei 6 secondi");
  eq(motivoDatiNonSalvati(new TypeError("Failed to fetch")).causa, "rete", "l'errore del browser, senza codice");
});
test("⛔ motivoDatiNonSalvati: se l'app SA di essere offline, quello vince", () => {
  /* il core chiama il ripiego anche dal ramo `!_isOnline`. Lì l'errore può
     essere qualunque cosa — anche un permission-denied arrivato prima che la
     rete cadesse — ma la cosa vera da dire all'utente è che non c'è rete. */
  eq(motivoDatiNonSalvati({ code: "permission-denied" }, false).causa, "rete", "offline dichiarato");
});
test("⛔ motivoDatiNonSalvati: quello che non si sa si dichiara, non si indovina", () => {
  /* il principio del fondatore applicato al messaggio che lo racconta: un
     codice che non conosciamo NON diventa «va tutto bene, è la dimostrazione».
     `certo` è la bandiera, e la legge la funzione stessa scegliendo la frase. */
  for (const e of [{ code: "not-found" }, { code: "invalid-argument" }, undefined, null, {}]) {
    const r = motivoDatiNonSalvati(e);
    eq(r.causa, "ignota", `causa per ${JSON.stringify(e)}`);
    eq(r.certo, false, `certo per ${JSON.stringify(e)}`);
    eq(/non raggiungibile/.test(r.messaggio), true, `frase per ${JSON.stringify(e)}`);
  }
});
test("⛔ motivoDatiNonSalvati: tutti e tre i messaggi dicono la cosa che riguarda chi legge", () => {
  /* la testa della frase cambia con la causa; la CODA no, perché è la sola
     parte che cambia qualcosa per il cavatore: un rapportino si compila in
     dieci minuti e nessuno deve scoprire al ricaricamento che era per niente.
     Il messaggio vecchio parlava solo del database e questa parte non c'era. */
  const tutti = [
    motivoDatiNonSalvati({ code: "permission-denied" }),
    motivoDatiNonSalvati({ code: "unavailable" }),
    motivoDatiNonSalvati({ code: "boh" }),
  ];
  for (const r of tutti) {
    eq(r.messaggio.endsWith("quello che scrivi non viene salvato"), true, `coda di «${r.messaggio}»`);
    eq(/degradata/.test(r.messaggio), false, "niente parole da tecnico");
    eq(/permission|denied|firestore|firebase/i.test(r.messaggio), false, "nessun codice d'errore all'utente");
  }
  eq(new Set(tutti.map((r) => r.messaggio)).size, 3, "e le tre teste restano diverse");
});

console.log(`\nRisultato Helper: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);

// ============================================================
// I NUMERI SCRITTI NEI DOCUMENTI SONO QUELLI VERI?
//
// Il 31/07 ho corretto a mano TRE conteggi invecchiati nei documenti del
// fondatore: «692 prove» quando erano 1.066, «662» in un altro posto, «17
// esecuzioni nel browser» quando erano 19. Nessuno se n'era accorto, perché un
// numero scritto in un documento non fallisce: sta lì e invecchia.
//
// È esattamente la categoria di difetto che questa giornata ha inseguito nel
// prodotto — una frase detta con sicurezza che non è più vera — e la risposta è
// la stessa: renderla verificabile invece di ricordarsela.
//
// Questo controllo LANCIA le suite (non conta i `test(` nel sorgente: molti
// stanno dentro cicli, e la conta statica dà 737 dove le prove eseguite sono
// 783) e confronta il totale con quello scritto nei documenti.
//
// Si lancia con:
//   node apps/deepwork-id/tests/numeri-nei-documenti.mjs
// ============================================================

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); }
};
const ok = (cond, perche) => { if (!cond) throw new Error(perche); };

// ── quante prove `node` girano davvero ────────────────────────────────
const SUITE = ["run-kpi.mjs", "run-stile.mjs", "run-helpers.mjs",
  "run-pointcloud.mjs", "run-manifest.mjs", "run-demo.mjs"];
let totale = 0;
const dettaglio = [];
for (const s of SUITE) {
  const r = spawnSync(process.execPath, [join(QUI, s)], { encoding: "utf8" });
  const m = /(\d+) passati, (\d+) falliti/.exec(String(r.stdout || ""));
  if (!m) { console.error(`  ✗ ${s}: non ha stampato un riepilogo leggibile`); failed++; continue; }
  if (+m[2] > 0) { console.error(`  ✗ ${s}: ${m[2]} prove fallite — il conteggio non ha senso finché non sono verdi`); failed++; }
  totale += +m[1];
  dettaglio.push(`${s.replace(".mjs", "")} ${m[1]}`);
}
console.log(`\nprove eseguite: ${totale}  (${dettaglio.join(", ")})\n`);

// ── quante esecuzioni apre il giro del browser ────────────────────────
const tutti = readFileSync(join(QUI, "browser", "tutti.mjs"), "utf8");
const blocco = /const BANCHI = \[([\s\S]*?)\n\];/.exec(tutti);
const banchi = blocco ? (blocco[1].match(/^\s*\[/gm) || []).length : 0;

// ── i documenti che dichiarano quei numeri ────────────────────────────
// Ognuno dice dove sta il numero e come si scrive: «1.066» col punto delle
// migliaia in un testo per il fondatore, «1066» dove serve la cifra secca.
const DOCUMENTI = [
  ["docs/DEVELOPMENT.md", /\*\*([\d.]+) prove girano senza rete/],
  ["docs/STATO_PRODOTTO.md", /\*\*([\d.]+)\*\* prove automatiche che girano senza rete/],
  ["docs/DECISIONI_WEEKEND.md", /prove automatiche sono passate a ([\d.]+)\*\*/],
];
const numero = (s) => +String(s).replace(/\./g, "");

let guardati = 0;
for (const [rel, regola] of DOCUMENTI) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  guardati++;
  test(`${rel}: il numero delle prove è quello vero`, () => {
    ok(m, `non trovo la frase col numero — se l'hai riscritta, aggiorna la regola in ${"numeri-nei-documenti.mjs"}`);
    ok(numero(m[1]) === totale,
      `il documento dice ${m[1]}, le suite ne eseguono ${totale}`);
  });
}

/* ⛔ E GLI ADDENDI DEVONO FARE IL TOTALE. Il controllo qui sopra guardava solo
   la somma, e i documenti la somma la scrivono **accanto alla scomposizione**:
   «1.471 prove — 1108 sulle funzioni delle app, 271 sulle regole di stile, 49
   sugli aiuti condivisi…». Il 01/08 quella riga faceva **1469** mentre il
   totale accanto diceva 1471, e nessuno se n'era accorto: aggiornare il totale
   costa una sostituzione, aggiornare gli addendi ne costa sei, e la sesta si
   dimentica. Due numeri che si contraddicono nella STESSA FRASE sono peggio di
   un numero vecchio: fanno dubitare di tutti gli altri.
   La regola prende il TESTO, non il percorso, così la controprova non tocca
   nessun file. */
export function addendiTornano(testo) {
  const m = /\*\*([\d.]+)\*\* prove automatiche che girano senza rete — ([\s\S]{0,400}?) — più/.exec(testo);
  if (!m) return null;
  const somma = [...m[2].matchAll(/(?:\*\*)?(\d[\d.]*)(?:\*\*)?\s+(?:sull[ae]|sul|sugli)/g)]
    .reduce((t, x) => t + numero(x[1]), 0);
  return { dichiarato: numero(m[1]), somma };
}
test("docs/STATO_PRODOTTO.md: gli addendi fanno il totale che sta accanto", () => {
  const r = addendiTornano(readFileSync(join(RADICE, "docs/STATO_PRODOTTO.md"), "utf8"));
  ok(r, "non trovo la frase con la scomposizione: se l'hai riscritta, aggiorna la regola qui");
  ok(r.somma === r.dichiarato,
    `la frase dice ${r.dichiarato} ma i suoi addendi fanno ${r.somma}: due numeri che si contraddicono nella stessa riga`);
});
/* ⚠️ La controprova, dentro la suite e su una stringa: senza di lei questo
   controllo saprebbe dire «tornano» anche se non avesse sommato niente. */
test("la controprova: un addendo sbagliato viene visto, e uno zero non passa per somma", () => {
  const buona = "**10** prove automatiche che girano senza rete — **4** sulle funzioni delle app, 3 sulle regole di stile, 2 sugli aiuti condivisi, 1 sulla demo — più altro";
  const r = addendiTornano(buona);
  ok(r && r.somma === 10 && r.dichiarato === 10, `la frase sana deve tornare: ${JSON.stringify(r)}`);
  const rotta = addendiTornano(buona.replace("3 sulle regole", "9 sulle regole"));
  ok(rotta && rotta.somma !== rotta.dichiarato,
    `con un addendo cambiato il controllo DEVE vedere la differenza: ${JSON.stringify(rotta)}`);
  ok(addendiTornano("nessuna frase del genere") === null,
    "e se la frase non c'è deve dirlo, non rispondere che torna");
});

/* ⛔ E LA SECONDA NOTAZIONE, che questa regola non guardava: la SOMMA SCRITTA.
   `STATO_PRODOTTO.md` scompone a parole («1890 sulle funzioni delle app, 300
   sulle regole di stile…») e la funzione qui sopra la legge. `DEVELOPMENT.md`
   la scompone in **aritmetica** — «(contate lanciandole: 1890 + 300 + 71 + 32
   + 9 + 8)» — e quella forma non la guardava **nessuno**.
   L'08/08 ci stava dentro un difetto vero: «1890 + 297 + **63** + 32 + 9 + 8»
   fa **2299**, non i 2307 dichiarati due parole prima. Il `63` era un
   `run-helpers` fermo da giorni. L'ho trovato **a occhio**, aggiornando il
   totale — cioè per fortuna, non per controllo.
   ⚠️ È la stessa lezione del `BROWSER` che guardava due documenti su tre: **un
   numero è sorvegliato solo dove il controllo ARRIVA**, e qui non arrivava per
   una differenza di *notazione*, non di contenuto. */
export function sommaScrittaTorna(testo) {
  const m = /\*\*([\d.]+) prove girano senza rete[^(]*\(([^)]*)\)/.exec(testo);
  if (!m) return null;
  const pezzi = [...m[2].matchAll(/(\d+)(?:\s*\+\s*|\s*\)|$)/g)];
  /* si sommano solo i numeri legati da `+`: la frase contiene anche la data */
  const catena = /(\d+(?:\s*\+\s*\d+)+)/.exec(m[2]);
  if (!catena) return { dichiarato: numero(m[1]), somma: null, addendi: 0 };
  const addendi = catena[1].split("+").map((x) => +x.trim());
  return { dichiarato: numero(m[1]), somma: addendi.reduce((a, b) => a + b, 0), addendi: addendi.length };
}
test("docs/DEVELOPMENT.md: la somma scritta fa il totale che sta accanto", () => {
  const r = sommaScrittaTorna(readFileSync(join(RADICE, "docs/DEVELOPMENT.md"), "utf8"));
  ok(r, "non trovo la frase con la somma scritta: se l'hai riscritta, aggiorna la regola qui");
  ok(r.addendi >= 5, `solo ${r.addendi} addendi trovati: il controllo non sta leggendo la catena`);
  ok(r.somma === r.dichiarato,
    `la frase dice ${r.dichiarato} ma la somma scritta accanto fa ${r.somma}: `
    + "due numeri che si contraddicono nella stessa riga");
});
test("la controprova della somma scritta: un addendo cambiato viene visto", () => {
  const buona = "**2.310 prove girano senza rete e senza browser**, con `node` (contate lanciandole, non a memoria — all'08/08: 1890 + 300 + 71 + 32 + 9 + 8):";
  const r = sommaScrittaTorna(buona);
  ok(r && r.somma === 2310 && r.addendi === 6, `la frase sana deve tornare: ${JSON.stringify(r)}`);
  const rotta = sommaScrittaTorna(buona.replace("+ 71 +", "+ 63 +"));
  ok(rotta && rotta.somma !== rotta.dichiarato,
    `col difetto vero dell'08/08 rimesso (71 → 63) il controllo DEVE vedere la differenza: ${JSON.stringify(rotta)}`);
  ok(sommaScrittaTorna("nessuna frase del genere") === null,
    "e se la frase non c'è deve dirlo, non rispondere che torna");
});

/* Quanti documenti ha guardato davvero: un «tutto a posto» ottenuto non
   leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
test("il controllo ha davvero letto tutti i documenti dell'elenco", () => {
  ok(guardati === DOCUMENTI.length, `letti ${guardati} su ${DOCUMENTI.length}`);
  ok(totale > 0, "nessuna prova contata: le suite non hanno risposto");
});

/* ── quante funzioni delle app sono provate ───────────────────────────
   Il censimento stampa «N funzioni coperte su M guardate»: è il numero che nei
   documenti dice quanto è controllato il prodotto, ed è **già finito sbagliato
   due volte** perché scritto a memoria (un checkpoint diceva «Scudo 35/71»
   quando erano 30, un commit «Sentinella 94/107» quando erano 89). Adesso è il
   censimento a dirlo, e chi lo scrive in un documento deve dire la stessa cosa. */
const cop = spawnSync(process.execPath, [join(QUI, "copertura-funzioni.mjs")], { encoding: "utf8" });
const mCop = /(\d+) funzioni coperte su (\d+) guardate/.exec(String(cop.stdout || ""));
const coperte = mCop ? +mCop[1] : 0, guardateFn = mCop ? +mCop[2] : 0;
const COPERTURA = [
  ["docs/DEVELOPMENT.md", /\*\*(\d+) funzioni pure su (\d+)\*\* sono chiamate per nome/],
  ["docs/STATO_PRODOTTO.md", /\*\*(\d+) funzioni pure su (\d+)\*\* delle sei app/],
];
for (const [rel, regola] of COPERTURA) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  test(`${rel}: la copertura delle funzioni è quella vera`, () => {
    ok(mCop, "il censimento non ha stampato un riepilogo leggibile");
    ok(m, "non trovo la frase con la copertura — se l'hai riscritta, aggiorna la regola qui");
    ok(+m[1] === coperte && +m[2] === guardateFn,
      `il documento dice ${m[1]}/${m[2]}, il censimento conta ${coperte}/${guardateFn}`);
  });
}

/* ⛔ E IL TERZO DOCUMENTO È ENTRATO L'08/08, DOPO AVERLO TROVATO SBAGLIATO.
   `DECISIONI_WEEKEND.md` dichiarava «**19** banchi che aprono davvero le
   pagine in un browser»: erano **153**, cioè il numero era vecchio di un
   ordine di grandezza. Nessuno se n'era accorto perché questo elenco ne
   guardava due su tre — e il documento fuori elenco è proprio quello che il
   fondatore apre per **decidere**.
   La lezione è la stessa della riga in fondo alla roadmap: un numero è
   sorvegliato solo dove il controllo ARRIVA, e l'elenco di dove arriva va
   guardato quanto il numero. ⚠️ E il conto giusto si chiede a questo file, non
   a un `grep` scritto sul momento: contandole a mano con una regex mia ne
   avevo trovate **143**, dieci in meno, perché la mia riconosceva una forma
   sola delle voci di `BANCHI`. Il righello più debole era di nuovo il mio. */
const BROWSER = [
  ["docs/DEVELOPMENT.md", /\*\*(\d+) esecuzioni che aprono davvero le pagine\*\*/],
  ["docs/STATO_PRODOTTO.md", /\*\*(\d+) esecuzioni\*\* che aprono davvero le\s+pagine/],
  ["docs/DECISIONI_WEEKEND.md", /\*\*(\d+)\s+esecuzioni\*\* che aprono davvero le pagine in un browser/],
];
for (const [rel, regola] of BROWSER) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  test(`${rel}: il numero dei banchi del browser è quello vero`, () => {
    ok(banchi > 0, "non sono riuscito a contare le voci di tutti.mjs");
    ok(m, "non trovo la frase col numero delle esecuzioni nel browser");
    ok(+m[1] === banchi, `il documento dice ${m[1]}, tutti.mjs ne elenca ${banchi}`);
  });
}

/* ── le misure su cui poggia il piano di migrazione di Genesi ──────────
   Sono di una specie diversa dai conteggi qui sopra: non dicono «quanto è
   provato il prodotto», dicono «com'è fatta OGGI la pagina che stiamo per
   toccare». Un piano scritto su misure è affidabile finché le misure sono
   vere, e queste sono destinate a diventare **false** — è l'unità A che le
   cambia. Bene così: quando cadono, il documento va riscritto, e cade nel
   momento giusto invece che sei settimane dopo.
   Ragionamento e piano: docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md */
const DOC_GEN = join(RADICE, "docs", "LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md");
const testoGen = readFileSync(DOC_GEN, "utf8");
const genesi = readFileSync(join(RADICE, "apps", "genesi", "genesi.html"), "utf8");
const foglio = readFileSync(join(RADICE, "shared", "dw-app-ui.css"), "utf8");

/* ✅ L'UNITÀ A È FATTA (04/08), e queste misure si sono girate.
   Erano scritte per descrivere «com'è fatta OGGI la pagina che stiamo per
   toccare», ed erano **destinate** a diventare false: è l'unità A che le
   cambia. Sono cadute nel momento giusto — tutte e tre insieme, il giorno della
   migrazione — e adesso guardano il verso opposto: non più «gli id vecchi ci
   sono ancora», ma «i nomi nuovi ci sono e i vecchi non sono tornati».
   Un controllo che descrive uno stato di passaggio non si cancella quando il
   passaggio è fatto: si gira, se no la pagina può tornare indietro in silenzio. */
const ID_MODALE = ["modal", "modal-title", "modal-body", "modal-foot"];
const ID_VECCHI = ["mdl", "mdl-tit", "mdl-body", "mdl-foot", "mdl-campo"];
/* il prefisso `mdl` è sovraccarico: questi SETTE sono dell'editor del fronte
   3D e una sostituzione a tappeto se li porterebbe via. Restano `mdl*` di
   proposito: non sono mai stati della modale. */
const ID_EDITOR_3D = ["mdlQuote", "mdlTools", "mdlR", "mdlRLab", "mdlUndo", "mdlRedo", "mdlReset"];

test("Genesi: i quattro id della modale sono quelli del core", () => {
  const mancanti = ID_MODALE.filter((id) => !genesi.includes(`id="${id}"`));
  ok(mancanti.length === 0, `non trovo ${mancanti.join(", ")}: la modale non parla più la lingua del condiviso`);
  const tornati = ID_VECCHI.filter((id) => genesi.includes(`id="${id}"`));
  ok(tornati.length === 0, `sono tornati gli id di prima: ${tornati.join(", ")}`);
});

test("Genesi: i sette id dell'editor 3D che NON vanno rinominati ci sono tutti", () => {
  const mancanti = ID_EDITOR_3D.filter((id) => !genesi.includes(`id="${id}"`));
  ok(mancanti.length === 0, `mancano ${mancanti.join(", ")}: l'elenco nel documento non descrive più la pagina`);
});

/* Il nome `modal` in Genesi è occupato dal CANCELLO DI CONSENSO — l'avvertenza
   che dichiara estetici i frammenti volanti. È il fatto che rende la rinomina
   uno scambio di inquilino invece di una sostituzione di stringhe. */
test("Genesi: il cancello di consenso ha un nome suo, e non è più `#modal`", () => {
  const i = genesi.indexOf('id="consenso"');
  ok(i > 0, "non trovo `id=\"consenso\"`: il cancello dell'avvertenza di sicurezza ha perso il suo nome");
  /* la finestra è 2.400 e non 1.600: misurata, non indovinata — `consensoOk`
     sta a 1.737 caratteri dall'apertura, e con 1.600 il controllo diceva
     «non contiene più il bottone» mentre il bottone c'era. Un controllo che
     guarda troppo poco risponde come uno che ha trovato un difetto. */
  const blocco = genesi.slice(i, i + 2400);
  ok(/disclaimerChk/.test(blocco) && /consensoOk/.test(blocco),
    "`#consenso` non contiene più la casella e il bottone dell'avvertenza");
  /* ⛔ e la parola che conta: l'avvertenza dice che i frammenti volanti NON
     valgono per le distanze di sgombero. È il motivo per cui la rinomina era
     uno scambio di inquilino e non una sostituzione di stringhe. */
  ok(/vietato/.test(blocco) && /sgombero/.test(blocco),
    "l'avvertenza non dice più che è VIETATO usare i frammenti per le distanze di sgombero");
});

test("Genesi: carica la STRUTTURA condivisa e NON il foglio di stile", () => {
  const rif = (genesi.match(/(?:src|href)="[^"]*shared\/[^"]*"/g) || []);
  ok(rif.some((r) => /dw-app-ui\.js/.test(r)),
    `Genesi non carica più shared/dw-app-ui.js (carica: ${rif.join(", ") || "niente"})`);
  /* ⛔ IL FOGLIO NO, ed è la decisione dell'unità B, non una dimenticanza: il
     condiviso pronuncia 76 variabili e Genesi ne definisce 12. Una variabile
     CSS che non esiste NON fallisce — la dichiarazione decade e la proprietà
     ricade sull'ereditato: nessun errore in console, un bordo che sparisce.
     ⚠️ E NON per il «contagio»: quel conto era sbagliato, rimisurato il 04/08.
     Dicevano 22 selettori su markup che Genesi ha già, fra cui .kpi e .badge —
     ma in Genesi `kpi` è un nome di PROPRIETÀ (`A.kpi.nf`) e `badge` sta nei
     COMMENTI: nessuna delle due è mai una classe. I selettori che cadono sono
     8, tutti della famiglia modale/toast, cioè quelli che Genesi si veste già
     da sé — caricare il foglio oggi vorrebbe dire sostituire un vestito che
     funziona con uno senza colori. La ragione vera è solo la prima.
     Finché la palette non è dichiarata, il foglio resta fuori — e questo
     controllo impedisce che ci entri per distrazione. */
  const css = rif.filter((r) => /\.css/.test(r));
  ok(css.length === 0,
    `Genesi carica ${css.length} fogli condivisi (${css.join(", ")}): è l'unità B, e prima va dichiarata la palette`);
});

/* Le variabili che il foglio condiviso PRONUNCIA e che Genesi non DEFINISCE.
   È il numero che decide il piano: una variabile CSS assente non fallisce,
   ricade sull'ereditato — l'assenza di un dato travestita da «va bene così». */
const usate = new Set([...foglio.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]));
const definite = new Set([...genesi.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const scoperte = [...usate].filter((v) => !definite.has(v));

/* ⛔ IL CONTO DEL «CONTAGIO», che il 03/08 era sbagliato e nessuno poteva
   controllare. Diceva 22 selettori del foglio condiviso su markup che Genesi ha
   già; misurati sono 8, tutti della famiglia modale/toast. L'errore era di
   forma nota: si è cercata una PAROLA (`kpi`, `badge`) invece della COSA (la
   classe), e in Genesi quelle parole vivono nei nomi di proprietà e nei
   commenti. Adesso il numero nel documento si ricalcola, così non può marcire
   una seconda volta — e si guarda che il censimento abbia davvero letto le
   classi, non zero. */
const CLASSI_GENESI = new Set([...genesi.matchAll(/class="([^"]+)"/g)]
  .flatMap((m) => m[1].split(/\s+/)).filter(Boolean));
/* ⚠️ I COMMENTI SI TOLGONO PRIMA, se no l'estrazione li incolla al selettore che
   segue: 68 dei 302 «selettori» letti a crudo contenevano un `/*` o un ritorno a
   capo, e un selettore incollato a un commento porta dentro le classi nominate
   NEL TESTO. Effetto: un selettore vero può risultare «non cade» perché il
   commento accanto nomina una classe che Genesi non ha — cioè il controllo
   sottostima, nella direzione che rassicura. Puliti: 242 selettori, zero
   sporchi. (Nel CSS non esistono stringhe che contengano `/*`, quindi qui la
   sottrazione dei commenti è sicura — nel JavaScript non lo sarebbe, ed è il
   difetto che il 01/08 ha cancellato 400.000 caratteri di codice vivo.) */
const FOGLIO_PULITO = foglio.replace(/\/\*[\s\S]*?\*\//g, "");
const SELETTORI_FOGLIO = [...new Set([...FOGLIO_PULITO.matchAll(/(^|\})\s*([^{}@]+?)\s*\{/gm)]
  .map((m) => m[2].trim())
  .flatMap((x) => x.split(",").map((y) => y.trim()))
  .filter((x) => x && !x.startsWith("@") && !/^(from|to|\d+%)$/.test(x)))];
const CADONO = SELETTORI_FOGLIO.filter((sel) => {
  const c = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  return c.length && c.every((x) => CLASSI_GENESI.has(x));
});

test("Genesi: il conto dei selettori condivisi che cadono sul suo markup è quello del documento", () => {
  /* la guardia sul censimento: senza queste due righe un errore di lettura
     darebbe «zero collisioni» e sembrerebbe una buona notizia */
  ok(CLASSI_GENESI.size > 100, `ho letto solo ${CLASSI_GENESI.size} classi in Genesi: il censimento non sta guardando`);
  ok(SELETTORI_FOGLIO.length > 200, `ho letto solo ${SELETTORI_FOGLIO.length} selettori nel foglio`);
  ok(SELETTORI_FOGLIO.every((x) => !/\/\*|\n/.test(x)),
    "ci sono ancora selettori incollati a un commento: l'estrazione sta leggendo prosa");
  const m = /cadono su markup di Genesi \| 22 \| \*\*(\d+)\*\* \|/.exec(testoGen);
  ok(m, "non trovo la riga del contagio rimisurato nel documento");
  ok(+m[1] === CADONO.length,
    `il documento dice ${m && m[1]}, la misura ne trova ${CADONO.length} (${CADONO.join(", ")})`);
  /* e la metà che conta: nessuno FUORI dalla famiglia modale/toast */
  const fuori = CADONO.filter((x) => !/modal|mbtn|toast|dw-vuoto/.test(x));
  ok(fuori.length === 0,
    `${fuori.length} selettori fuori dalla famiglia modale/toast cadrebbero su Genesi: ${fuori.join(", ")}`);
});

test("docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md: il conto delle variabili è quello vero", () => {
  const m = /pronuncia \*\*(\d+)\*\* variabili\. Genesi ne definisce \*\*(\d+)\*\*/.exec(testoGen);
  const n = /Le \*\*non\*\* definite sono \*\*(\d+) su (\d+)\*\*/.exec(testoGen);
  ok(m && n, "non trovo le frasi col conto delle variabili — se le hai riscritte, aggiorna la regola qui");
  ok(+m[1] === usate.size, `il documento dice ${m[1]} variabili nel foglio condiviso, ne conto ${usate.size}`);
  ok(+m[2] === definite.size, `il documento dice ${m[2]} definite da Genesi, ne conto ${definite.size}`);
  ok(+n[1] === scoperte.length, `il documento dice ${n[1]} scoperte, ne conto ${scoperte.length}`);
  ok(+n[2] === usate.size, `il documento dice «su ${n[2]}», il foglio ne pronuncia ${usate.size}`);
});

/* Il contagio: quanti selettori del foglio condiviso cadrebbero su markup che
   Genesi HA GIÀ. Non è la famiglia `.modal-*` il problema — quella la si
   vuole — sono `.kpi`, `.badge`, `.note`, che sono già vestiti. */
test("docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md: il conto del contagio è quello vero", () => {
  const classiInPagina = new Set();
  for (const m of genesi.matchAll(/class="([^"]+)"/g))
    for (const c of m[1].split(/\s+/)) if (c) classiInPagina.add(c);
  /* ⛔ LA STESSA ESTRAZIONE ERA SCRITTA DUE VOLTE, E LA SECONDA ERA PIÙ DEBOLE.
     Qui sopra c'è `SELETTORI_FOGLIO`, costruito su `FOGLIO_PULITO` — cioè coi
     commenti tolti — e la prova che lo usa ha pure la riga che pretende che
     nessun selettore porti un `/*` addosso. Questa prova, sedici righe più giù,
     rileggeva il foglio **crudo**: e siccome i commenti di `dw-app-ui.css`
     nominano le classi di cui parlano (`.badge.warn`, `.note.err`…), la prosa
     finiva contata come selettore.
     Misurato il 07/08: aggiungendo al foglio un commento che nomina sei classi,
     il conto passava da **21 a 24** senza che il CSS fosse cambiato — cioè un
     documento veniva accusato di essere invecchiato da un commento. È la terza
     volta che questa famiglia — i commenti presi per la cosa che nominano —
     compare in questo repository, e le altre due volte era già costata una
     regola cieca e un'accusa falsa.
     Adesso le due prove leggono lo **stesso** elenco: una regola usata due
     volte si scrive una volta sola. */
  const selettori = new Set(SELETTORI_FOGLIO);
  let toccati = 0;
  for (const s of selettori) {
    const classi = [...s.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((x) => x[1]);
    if (classi.length && classi.some((c) => classiInPagina.has(c))) toccati++;
  }
  const m = /Il conto del contagio: \*\*(\d+) selettori\*\*/.exec(testoGen);
  ok(m, "non trovo la frase col conto del contagio");
  ok(+m[1] === toccati, `il documento dice ${m[1]} selettori, ne conto ${toccati}`);
});

/* ⛔ LA PORTA D'INGRESSO DELLE DECISIONI È UNA SECONDA COPIA, QUINDI INVECCHIA.
   Il 01/08 in cima a `DECISIONI_WEEKEND.md` è stata messa una pagina che ordina
   le decisioni aperte per quanto costano al fondatore — utile, perché a
   venticinque caselle sparse su cinquecento righe non si risponde in una sera.
   Ma è un **elenco**, e un elenco è la cosa che in questo repo invecchia sempre:
   basta spuntare una casella, o aggiungere una decisione in fondo, e la porta
   d'ingresso dice un numero che non è più vero — proprio a chi la apre per
   fidarsi. Due pretese, tutt'e due meccaniche:
     1. il numero dichiarato in testa è **quello vero** delle caselle aperte;
     2. **ogni sezione numerata compare** in una delle tre tabelle: una decisione
        aggiunta in fondo e non indicizzata è una decisione che il fondatore non
        vede, ed è peggio di non avere l'indice. */
{
  const testo = readFileSync(join(RADICE, "docs/DECISIONI_WEEKEND.md"), "utf8");
  const aperte = (testo.match(/^- \[ \]/gm) || []).length;
  const porta = /le decisioni aperte sono \*\*(\d+)\*\*/.exec(testo);
  test("docs/DECISIONI_WEEKEND.md: la porta d'ingresso conta le decisioni aperte che ci sono davvero", () => {
    ok(porta, "non trovo la frase «le decisioni aperte sono **N**» in cima al documento");
    ok(+porta[1] === aperte, `la porta dice ${porta[1]}, di caselle aperte ce ne sono ${aperte}`);
  });

  const sezioni = [...testo.matchAll(/^## (\d+)\. /gm)].map((m) => m[1]);
  /* l'indice cita le sezioni in grassetto nelle celle: `| **13** | …` — e anche
     le lettere (`**18a**`), che qui si riducono al numero della sezione */
  /* ⚠️ E IL `~~` DELLE DECISE VA AMMESSO, se no barrare una riga la fa SPARIRE
     da questo controllo — che è la famiglia «dare un nome a un valore lo fa
     sparire da un controllo statico», in versione punteggiatura. Successo il
     07/08: barrate le sette prese dal ciclo, tre sezioni (6, 8, 11) risultavano
     «fuori dalla porta d'ingresso» mentre erano lì, con la loro riga. La 13 e
     le sue gemelle non se n'erano accorte solo perché comparivano anche in una
     seconda tabella, in chiaro: cioè il controllo passava per un motivo diverso
     da quello del suo nome. */
  const citate = new Set([...testo.matchAll(/\|\s*(?:~~)?\*\*(\d+)[a-z]?\*\*(?:~~)?\s*\|/g)].map((m) => m[1]));
  test("docs/DECISIONI_WEEKEND.md: nessuna decisione resta fuori dalla porta d'ingresso", () => {
    const fuori = sezioni.filter((n) => !citate.has(n));
    ok(!fuori.length, `${fuori.length} sezioni non compaiono in nessuna tabella dell'indice: ${fuori.join(", ")}`);
  });
  console.log(`\ndecisioni del fondatore: ${aperte} aperte, ${sezioni.length} sezioni, ${citate.size} indicizzate`);
}

// ── LA TABELLA DEL DELTA, SCRITTA SEI VOLTE ──
/* ⛔ Nasce il 03/08 da due righe perse, e da una divergenza trovata DAL VIVO.
   La tabella riassuntiva del delta — quante mancanze confermate, quante false,
   quante scadute, quante a metà — è copiata in cima a **tutti e sei** i
   documenti dei concorrenti, e nessuno la confrontava né con sé stessa né con
   i suoi addendi. Due difetti, tutt'e due misurati:

   1. **gli addendi non facevano il totale.** La riga di Sentinella faceva
      `15+4+1+0 = 20` su **22** righe; quella di Conti fa `9+5+0+2 = 16` su
      **18**. Due righe per parte, tolte dalle confermate senza essere aggiunte
      da nessun'altra parte: sparite dal conto, e quindi dal lavoro.
   2. **le sei copie erano già divergenti.** Il 02/08 il documento di Sentinella
      è stato riverificato riga per riga e la sua copia aggiornata; le altre
      **cinque** sono rimaste ai numeri vecchi. Nessuno se n'era accorto, ed è
      la dimostrazione dal vivo della regola che questo progetto ripete da
      mesi: una verità scritta due volte diverge — figurarsi sei.

   ⚠️ E come per `sonda-vuoto`, chi non torna si **dichiara** invece di essere
   aggiustato: `DA_RIVERIFICARE` porta il nome, quante righe mancano e la
   ragione. Con la seconda metà del mestiere: una riga che ricomincia a tornare
   va **tolta** da lì, se no l'elenco invecchia e copre un difetto che non c'è
   più. Aggiustare il totale invece di ritrovare le righe sarebbe esattamente il
   difetto che il controllo esiste per prendere. */
/* ✅ VUOTO, e la riga che c'era è stata tolta perché il controllo l'ha
   PRETESO, non perché qualcuno se ne sia ricordato: `Conti` è stato
   riverificato riga per riga il 03/08 e adesso il suo conto torna
   (8 confermate + 5 false + 3 scadute + 2 a metà = 18). Le due righe perse
   sono state **ritrovate** — «preventivi e ordini» e «prezzi a scaglioni»,
   marcate come colmate nel corpo del documento ma mai spostate nella colonna
   delle scadute — non sono state coperte alzando un numero.
   È la seconda metà del mestiere che `sonda-vuoto` ha insegnato: un'eccezione
   che non serve più è un'eccezione che nasconde. */
const DA_RIVERIFICARE = {};

{
  const APP_DELTA = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
  const TABELLA = /^> \| app \| righe \|[\s\S]*?\| \*\*totale\*\*[^\n]*\n/m;
  /* ⚠️ Anche la colonna del TOTALE può essere in grassetto: la prima versione
     pretendeva un numero nudo lì, e il giorno in cui Scudo è passata da 16 a
     **17** righe il controllo ha risposto «lette 5 righe di app invece di 6»
     invece di leggere il numero nuovo. Ha fatto il suo mestiere — ha detto
     che non aveva guardato tutto — ma la lezione è la solita: un lettore che
     pretende una forma si rompe quando la forma cambia, e la forma cambia
     proprio quando il numero è interessante. */
  const CELLA = "\\|(?:[^|]*?(\\d+)[^|]*)";
  const RIGA = new RegExp("^> \\| ([A-Za-zà-ù]+) " + CELLA.repeat(5) + "\\|");
  const copie = APP_DELTA.map((a) => {
    const testo = readFileSync(join(RADICE, `docs/CONCORRENTI_${a.toUpperCase()}.md`), "utf8");
    const m = TABELLA.exec(testo);
    return { app: a, tabella: m ? m[0] : null };
  });

  test("la tabella del delta c'è in tutti e sei i documenti", () => {
    const senza = copie.filter((c) => !c.tabella).map((c) => c.app);
    ok(!senza.length, `manca in: ${senza.join(", ")}`);
  });

  test("⛔ le sei copie della tabella del delta sono IDENTICHE", () => {
    const prima = copie[0];
    const diverse = copie.filter((c) => c.tabella !== prima.tabella).map((c) => c.app);
    ok(!diverse.length, `${diverse.length} copie diverse da quella di ${prima.app}: ${diverse.join(", ")}`
      + " — è una verità sola scritta sei volte: o si aggiornano insieme, o divergono (successo il 02/08)");
  });

  const righe = [];
  for (const l of (copie[0].tabella || "").split("\n")) {
    const m = RIGA.exec(l);
    if (m && !/^app$/i.test(m[1])) righe.push({
      nome: m[1], totale: +m[2], conf: +m[3], falsi: +m[4], scadute: +m[5], meta: +m[6],
    });
  }

  test("⛔ gli addendi di ogni riga fanno il totale della riga", () => {
    ok(righe.length === APP_DELTA.length, `lette ${righe.length} righe di app invece di ${APP_DELTA.length}`);
    const storte = [];
    for (const r of righe) {
      const somma = r.conf + r.falsi + r.scadute + r.meta;
      const atteso = DA_RIVERIFICARE[r.nome];
      if (somma === r.totale) {
        ok(!atteso, `${r.nome} adesso torna (${somma} su ${r.totale}): va TOLTA da DA_RIVERIFICARE`);
        continue;
      }
      if (atteso && r.totale - somma === atteso.mancano) continue;   // dichiarata, con la ragione
      storte.push(`${r.nome}: ${r.conf}+${r.falsi}+${r.scadute}+${r.meta} = ${somma}, ma le righe dichiarate sono ${r.totale}`);
    }
    ok(!storte.length, storte.join(" · ") + " — le righe perse si ritrovano, non si aggiusta il totale");
  });

  test("la riga dei totali è la somma delle colonne", () => {
    const l = (copie[0].tabella || "").split("\n").find((x) => x.includes("**totale**"));
    const n = [...(l || "").matchAll(/\*\*(\d+)\*\*/g)].map((m) => +m[1]);
    ok(n.length >= 5, `la riga dei totali non si legge: «${l}»`);
    const chiavi = [null, "conf", "falsi", "scadute", "meta"];
    for (let i = 0; i < 5; i++) {
      const atteso = righe.reduce((a, r) => a + (i === 0 ? r.totale : r[chiavi[i]]), 0);
      ok(n[i] === atteso, `la colonna ${i + 1} dei totali dice ${n[i]}, la somma delle righe fa ${atteso}`);
    }
  });

  const dichiarate = Object.keys(DA_RIVERIFICARE);
  console.log(`\ntabella del delta: ${righe.length} app, ${righe.reduce((a, r) => a + r.totale, 0)} righe`
    + `  ·  ${dichiarate.length} in riverifica dichiarate (${dichiarate.join(", ") || "nessuna"})`);
}

/* Quanti soggetti ha guardato davvero questa parte: un «tutto a posto»
   ottenuto non leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
console.log(`\nmisure su Genesi: ${ID_MODALE.length + ID_EDITOR_3D.length} id verificati, `
  + `${usate.size} variabili del foglio condiviso, ${scoperte.length} scoperte in Genesi`);

console.log(`\nRisultato numeri nei documenti: ${passed} passati, ${failed} falliti`
  + `  ·  ${guardati} documenti letti, ${banchi} banchi contati, copertura ${coperte}/${guardateFn}`);
process.exit(failed > 0 ? 1 : 0);

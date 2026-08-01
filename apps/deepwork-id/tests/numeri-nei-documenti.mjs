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

const BROWSER = [
  ["docs/DEVELOPMENT.md", /\*\*(\d+) esecuzioni che aprono davvero le pagine\*\*/],
  ["docs/STATO_PRODOTTO.md", /\*\*(\d+) esecuzioni\*\* che aprono davvero le\s+pagine/],
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
  const selettori = new Set();
  for (const m of foglio.matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const s = m[1].trim();
    if (!s || s.startsWith("@")) continue;
    for (const p of s.split(",")) selettori.add(p.trim());
  }
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
  const citate = new Set([...testo.matchAll(/\|\s*\*\*(\d+)[a-z]?\*\*\s*\|/g)].map((m) => m[1]));
  test("docs/DECISIONI_WEEKEND.md: nessuna decisione resta fuori dalla porta d'ingresso", () => {
    const fuori = sezioni.filter((n) => !citate.has(n));
    ok(!fuori.length, `${fuori.length} sezioni non compaiono in nessuna tabella dell'indice: ${fuori.join(", ")}`);
  });
  console.log(`\ndecisioni del fondatore: ${aperte} aperte, ${sezioni.length} sezioni, ${citate.size} indicizzate`);
}

/* Quanti soggetti ha guardato davvero questa parte: un «tutto a posto»
   ottenuto non leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
console.log(`\nmisure su Genesi: ${ID_MODALE.length + ID_EDITOR_3D.length} id verificati, `
  + `${usate.size} variabili del foglio condiviso, ${scoperte.length} scoperte in Genesi`);

console.log(`\nRisultato numeri nei documenti: ${passed} passati, ${failed} falliti`
  + `  ·  ${guardati} documenti letti, ${banchi} banchi contati, copertura ${coperte}/${guardateFn}`);
process.exit(failed > 0 ? 1 : 0);

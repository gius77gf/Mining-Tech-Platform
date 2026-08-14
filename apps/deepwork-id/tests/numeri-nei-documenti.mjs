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
import { readFileSync, readdirSync } from "node:fs";
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
/* ⛔ E QUESTO ELENCO VA GUARDATO QUANTO IL NUMERO CHE SORVEGLIA. L'08/08 è
   entrata `bootstrap-rivendicazioni.mjs`: prove di comportamento, senza rete e
   senza browser, cioè esattamente ciò che l'etichetta promette. Restandone
   fuori sarebbe stata la quarta forma dell'invecchiamento — un numero vero,
   sorvegliato, e più stretto della frase che lo presenta. */
/* ⏱️ E dal 09/08 c'e' dentro anche `fogli-guardati.mjs`, per la STESSA ragione
   scritta qui sopra per `bootstrap-rivendicazioni`: sono prove di
   comportamento, senza rete e senza browser — cioe' esattamente cio' che
   l'etichetta promette. Lasciarla fuori avrebbe fatto della frase «2.367 prove
   girano senza rete e senza browser» un numero piu' STRETTO di quello che
   dice, che e' la quarta forma dell'invecchiamento e sta scritta due righe piu'
   su. Una suite nuova che risponde al criterio entra qui il giorno che nasce. */
/* ⏱️ E dal 14/08 c'e' dentro anche `claims-convergenza.mjs`, per la stessa
   ragione delle due entrate qui sopra — prove di comportamento, senza rete e
   senza browser — e per una che vale la pena scrivere: e' nata da un rosso
   della CI che si presentava **una volta su trenta**, cioe' proprio dal genere
   di difetto che un totale fermo non fa vedere. */
const SUITE = ["run-kpi.mjs", "run-stile.mjs", "run-helpers.mjs",
  "run-pointcloud.mjs", "run-manifest.mjs", "run-demo.mjs",
  "bootstrap-rivendicazioni.mjs", "fogli-guardati.mjs",
  "claims-convergenza.mjs"];
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
/* ⛔ E IL SECONDO NUMERO DI QUELLA TABELLA — quanti FILE distinti — non lo
   guardava nessuno, ed è quello che il 09/08 era rimasto a 70 su 71. Le due
   cifre non sono la stessa cosa e nei documenti stanno nella stessa frase: le
   *esecuzioni* contano anche le controprove (`--controprova` è una riga in
   più sullo stesso file), i *file* no. Un lettore che ne trova uno vecchio
   dubita anche dell'altro.
   ⚠️ Il nome del banco si prende dalla PRIMA stringa `.mjs` di ogni riga —
   che è il posto dichiarato dal contratto della tabella `[nome, file, argomenti]`
   — e non da tutte le stringhe del blocco: un `.mjs` nominato dentro un
   commento gonfierebbe il conto senza che nessuno se ne accorga. */
const fileBanchi = blocco
  ? new Set(blocco[1].split(/\n(?=\s*\[)/).map((r) => (/['"]([\w.-]+\.mjs)['"]/.exec(r) || [])[1]).filter(Boolean)).size
  : 0;

// ── i documenti che dichiarano quei numeri ────────────────────────────
// Ognuno dice dove sta il numero e come si scrive: «1.066» col punto delle
// migliaia in un testo per il fondatore, «1066» dove serve la cifra secca.
/* ⛔ E IL QUARTO È LA ROADMAP, ENTRATA IL 09/08 DOPO CHE LA DICHIARAZIONE DI
   ESSERE FUORI ELENCO AVEVA FALLITO PER LA SECONDA VOLTA.
   In fondo a `vault/ROADMAP_SETTIMANA.md` c'era scritto, onestamente: «qui il
   controllo non arriva, e l'aggiornamento è a mano. Chi la legge lo sappia».
   Quella dichiarazione è nata la prima volta che il file era invecchiato («120
   banchi» quando ne erano 147), e non ha impedito la seconda: al 09/08 lo
   STESSO numero era scritto lì dentro in **tre valori diversi** — 2.366 nella
   riga di stato, 2.370 in fondo, 2.371 in un racconto di mezzo — mentre le
   suite ne eseguivano 2.380. Anche le esecuzioni del browser erano ferme a 157
   su 159 e i file di banco a 70 su 71.
   ⛔ La lezione, ed è più forte di quella dell'08/08: **dichiarare un punto
   cieco non lo illumina.** Un lettore che incontra il numero non ha modo di
   sapere se quella riga è di oggi o di tre giorni fa, e la dichiarazione sta
   duecento righe più in basso. Il costo di portarcelo dentro è una voce in
   questo elenco; il costo di lasciarlo fuori l'ha appena pagato il documento
   che il fondatore apre per primo.
   ⚠️ Il file resta sorvegliato **solo su questi numeri**, non tutto: la riga in
   fondo alla roadmap adesso lo dice così, invece di dire «qui non si arriva». */
/* ⛔ DOVE ARRIVA IL CONTROLLO — raccolto mentre le regole girano, non riscritto.
   Il 09/08 un censimento in scratchpad ha chiesto la domanda che nessuno faceva:
   *quanti numeri dichiarati nei documenti del fondatore cadono su una riga che
   una regola guarda davvero?* Ha nominato tre difetti veri in un'ora — la
   scomposizione dei moduli condivisi ferma da due giorni, il «125» che i suoi
   stessi addendi smentivano, e «di Genesi entra solo pointcloud.js». Uno
   strumento che trova roba vive nei test, non nello scratchpad (CLAUDE.md), e
   l'elenco di dove il controllo arriva va guardato quanto i numeri: qui si
   costruisce **da solo**, perché ogni regola ci si iscrive quando gira. Un
   elenco gemello scritto a mano sarebbe la copia più debole. */
const SORVEGLIATE = [];
const sorveglia = (rel, regola) => { SORVEGLIATE.push([rel, regola]); return regola; };
const DOCUMENTI = [
  ["docs/DEVELOPMENT.md", sorveglia("docs/DEVELOPMENT.md", /\*\*([\d.]+) prove girano senza rete/)],
  ["docs/STATO_PRODOTTO.md", sorveglia("docs/STATO_PRODOTTO.md", /\*\*([\d.]+)\*\* prove automatiche che girano senza rete/)],
  ["docs/DECISIONI_WEEKEND.md", sorveglia("docs/DECISIONI_WEEKEND.md", /prove automatiche sono passate a ([\d.]+)\*\*/)],
  ["vault/ROADMAP_SETTIMANA.md", sorveglia("vault/ROADMAP_SETTIMANA.md", /\*\*([\d.]+) prove girano senza rete\*\*/)],
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
const RE_ADDENDI = sorveglia("docs/STATO_PRODOTTO.md",
  /\*\*([\d.]+)\*\* prove automatiche che girano senza rete — ([\s\S]{0,400}?) — più/);
export function addendiTornano(testo) {
  const m = RE_ADDENDI.exec(testo);
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
const RE_SOMMA_SCRITTA = sorveglia("docs/DEVELOPMENT.md",
  /\*\*([\d.]+) prove girano senza rete[^(]*\(([^)]*)\)/);
export function sommaScrittaTorna(testo) {
  const m = RE_SOMMA_SCRITTA.exec(testo);
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
  ["docs/DEVELOPMENT.md", sorveglia("docs/DEVELOPMENT.md", /\*\*(\d+) funzioni pure su (\d+)\*\* sono chiamate per nome/)],
  ["docs/STATO_PRODOTTO.md", sorveglia("docs/STATO_PRODOTTO.md", /\*\*(\d+) funzioni pure su (\d+)\*\* delle sei app/)],
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
  ["docs/DEVELOPMENT.md", sorveglia("docs/DEVELOPMENT.md", /\*\*(\d+) esecuzioni che aprono davvero le pagine\*\*/)],
  ["docs/STATO_PRODOTTO.md", sorveglia("docs/STATO_PRODOTTO.md", /\*\*(\d+) esecuzioni\*\* che aprono davvero le\s+pagine/)],
  ["docs/DECISIONI_WEEKEND.md", sorveglia("docs/DECISIONI_WEEKEND.md", /\*\*(\d+)\s+esecuzioni\*\* che aprono davvero le pagine in un browser/)],
  ["vault/ROADMAP_SETTIMANA.md", sorveglia("vault/ROADMAP_SETTIMANA.md", /\*\*(\d+) esecuzioni\*\* che\s+aprono le pagine in un browser vero/)],
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

const FILE_BANCHI = [
  ["vault/ROADMAP_SETTIMANA.md", /da \*\*(\d+)\*\* file di banco distinti/],
];
for (const [rel, regola] of FILE_BANCHI) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  test(`${rel}: il numero dei FILE di banco distinti è quello vero`, () => {
    ok(fileBanchi > 0, "non sono riuscito a contare i file distinti di tutti.mjs");
    ok(m, "non trovo la frase col numero dei file di banco distinti");
    ok(+m[1] === fileBanchi,
      `il documento dice ${m[1]}, tutti.mjs ne nomina ${fileBanchi} distinti (su ${banchi} esecuzioni)`);
  });
}
/* ⚠️ E i due numeri devono restare DIVERSI: se un giorno coincidessero non
   sarebbe una bella notizia, vorrebbe dire che il conto dei file ha smesso di
   deduplicare — cioè che sto guardando due volte lo stesso numero credendo di
   guardarne due. È la controprova del righello, non del documento. */
test("i file distinti sono meno delle esecuzioni: il conto deduplica davvero", () => {
  ok(fileBanchi < banchi,
    `${fileBanchi} file su ${banchi} esecuzioni: se sono uguali il Set non sta deduplicando niente`);
});

/* ── le mancanze confermate del delta, contate dai documenti stessi ────
   ⛔ NASCE DA UN NUMERO SBAGLIATO PER DUE GIORNI, e il segno era in bella
   vista: la roadmap scriveva «campo 11 · sentinella 13 · conti 8 · flotta 5 ·
   terra 4 · scudo 0 | totale **42**», e quella somma fa **41**. L'errore
   l'aveva prodotto proprio la correzione che diceva di aver reso il conto più
   preciso — allargare il vocabolario al plurale («CONFERMATE ASSENTI») ha
   fatto entrare la **riga d'intestazione** della sezione di Scudo, che PARLA
   del verdetto invece di darlo.
   ⛔ La lezione, che è la ragione per cui questo controllo esiste adesso: **un
   vocabolario più largo prende anche le righe che parlano del verdetto**, e il
   filtro che le separa non è la parola — è **dove sta**. Una cella di verdetto
   ha altre celle accanto con dentro qualcosa; un'intestazione di sezione ha le
   altre due vuote.
   ⚠️ E il numero resta **derivato dai documenti**: qui non c'è una soglia
   scritta a mano che invecchia, c'è il confronto fra quello che la roadmap
   dichiara e quello che i sei documenti contengono. Se una mancanza si chiude
   e qualcuno aggiorna il documento senza aggiornare la roadmap, questo cade —
   che è esattamente il mestiere della regola «chi chiude un'unità aggiorna la
   riga che gliel'aveva proposta». */
{
  const VERDETTO = /^\s*\|(.*?)\|(.*?)\|(.*?)\|/;
  let assenti = 0;
  const perApp = [];
  for (const f of readdirSync(join(RADICE, "docs")).filter((n) => /^CONCORRENTI_.*\.md$/.test(n)).sort()) {
    let n = 0;
    for (const riga of readFileSync(join(RADICE, "docs", f), "utf8").split("\n")) {
      const m = VERDETTO.exec(riga);
      if (!m) continue;
      /* ⛔ IL VERDETTO **COMINCIA** CON «CONFERMATA», non lo contiene — e la
         prima stesura di questo controllo, scritta un'ora fa, sbagliava
         **due volte** proprio qui:
         · cercava la forma in **grassetto** (`**CONFERMATA ASSENTE**`), che
           usano cinque documenti su sei: Scudo scrive `CONFERMATA` liscio,
           sotto un'intestazione di sezione che dice «CONFERMATE ASSENTI».
           Risultato: Scudo contava **zero**, e il totale 41 invece di 47;
         · e «contiene» prenderebbe anche le tre righe di Scudo che dicono
           «⏱️ **A METÀ** — *era* CONFERMATA, colmata a metà», cioè mancanze
           **chiuse**: quel verdetto la nomina per raccontare la storia.
         Il conto giusto è 6 per Scudo — e lo conferma il documento stesso,
         che nel suo riepilogo scrive «Confermate assenti: **6**».
         ⚠️ Tre stesure in un giorno, tre numeri (42, 41, 47), e ogni volta la
         causa era la stessa: **il righello guardava una forma di scrittura
         invece del verdetto.** La roadmap lo diceva già in prosa — «questo
         conto misura una forma di scrittura, non la verità» — ed è la ragione
         per cui adesso il criterio è *dove comincia la cella*, che è la cosa
         più vicina al significato che si possa chiedere a un testo. */
      const verdetto = m[2].trim().replace(/^\*\*/, "").replace(/^⏱️\s*/, "");
      /* ⛔ E SENZA `i`, che è la terza discriminazione e la più economica: il
         verdetto nelle tabelle si scrive in MAIUSCOLO. Con `i` entrava anche
         `| quando | confermate | false | ⏱️ scadute | a metà | totale |` —
         l'**intestazione** della tabella di riepilogo di Sentinella, che
         elenca i nomi delle colonne. Cioè, di nuovo, una riga che PARLA dei
         verdetti invece di darne uno: la stessa famiglia dell'intestazione di
         sezione di Scudo, in un'altra veste. Qui a separarle basta la
         maiuscola, che è come i documenti scrivono davvero un verdetto. */
      if (!/^CONFERMAT[AOEI]/.test(verdetto)) continue;
      /* ⛔ la seconda domanda: è una CELLA di verdetto o un'INTESTAZIONE?
         Un verdetto ha la sua prova nella terza colonna; l'intestazione di
         sezione ha le altre due vuote. */
      if (!m[3].trim()) continue;
      n++;
    }
    perApp.push(`${f.replace(/^CONCORRENTI_|\.md$/g, "").toLowerCase()} ${n}`);
    assenti += n;
  }
  /* ⏱️ E LE «SCADUTE», con lo stesso criterio: sono le mancanze che il prodotto
     ha già colmato, e il loro numero dice quanto la ricerca sta pagando. Vale
     la stessa regola del verdetto — comincia con la parola, ed è maiuscola. */
  let scadute = 0;
  const scadutePerApp = [];
  for (const f of readdirSync(join(RADICE, "docs")).filter((n) => /^CONCORRENTI_.*\.md$/.test(n)).sort()) {
    let n = 0;
    for (const riga of readFileSync(join(RADICE, "docs", f), "utf8").split("\n")) {
      const m2 = VERDETTO.exec(riga);
      if (!m2 || !m2[3].trim()) continue;
      const v = m2[2].trim().replace(/^\*\*/, "").replace(/^⏱️\s*/, "").replace(/^\*\*/, "");
      if (/^SCADUT[AOEI]/.test(v)) n++;
    }
    scadutePerApp.push(`${f.replace(/^CONCORRENTI_|\.md$/g, "").toLowerCase()} ${n}`);
    scadute += n;
  }

  const road = readFileSync(join(RADICE, "vault", "ROADMAP_SETTIMANA.md"), "utf8");
  const m = /\| totale \*\*(\d+)\*\* \(era 54/.exec(road);
  const mS = /\| totale \*\*(\d+)\*\* \(⛔ non 18\) \|/.exec(road);
  test("ROADMAP: anche le mancanze SCADUTE sono quelle che i documenti contengono", () => {
    ok(mS, "non trovo la riga col totale delle scadute nella roadmap");
    ok(scadute > 0, "non sono riuscito a contare nessuna scaduta: il righello è rotto");
    ok(+mS[1] === scadute,
      `la roadmap dice ${mS[1]}, i documenti ne contengono ${scadute} (${scadutePerApp.join(" · ")})`);
  });
  console.log(`      scadute contate nei documenti: ${scadute} — ${scadutePerApp.join(" · ")}`);
  test("ROADMAP: le mancanze confermate del delta sono quelle che i sei documenti contengono", () => {
    ok(m, "non trovo la riga col totale delle mancanze confermate nella roadmap");
    ok(assenti > 0, "non sono riuscito a contare nessun verdetto: il righello è rotto");
    ok(+m[1] === assenti,
      `la roadmap dice ${m[1]}, i documenti ne contengono ${assenti} (${perApp.join(" · ")})`);
  });
  console.log(`      mancanze confermate contate nei documenti: ${assenti} — ${perApp.join(" · ")}`);
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

/* ⛔ UNA SCOMPOSIZIONE CHE TORNA CON SÉ STESSA PUÒ ESSERE FALSA LO STESSO, e
   qui sopra c'è già il controllo che NON la prende. `addendiTornano` e
   `sommaScrittaTorna` dimostrano la COERENZA — che gli addendi scritti facciano
   il totale scritto — e quella è una domanda diversa dalla VERITÀ.
   Misurato il 09/08 su `docs/DEVELOPMENT.md`, che dichiarava
   «104 prove: 75 regole, 19 SDK, 10 primo avvio»: 75 + 19 + 10 fa **esattamente
   104**, quindi qualunque controllo sulla somma avrebbe detto ✓ — e l'addendo
   era sbagliato, perché `run-bootstrap.mjs` è tornato da 10 a 8 l'08/08.
   `docs/STATO_PRODOTTO.md` scriveva **8** e lo spiegava pure: due documenti in
   disaccordo sullo stesso numero, e nessuno dei due fuori posto per la somma.
   Quindi questa prova non somma niente: va a **contare i soggetti veri**.
   ⚠️ Il righello statico (contare le righe che aprono un `test(`) è dichiarato,
   non dedotto: il 09/08 dava 75 · 19 · 8, cioè **i tre numeri che si conoscono
   da altre strade** — `run.mjs` sotto l'emulatore stampa 75, e 19 e 8 sono
   quelli che CLAUDE.md porta scritti. Tre accordi su tre. Se un domani una
   suite generasse prove dentro un ciclo, questo conto le perderebbe: allora
   NON si allarga la regex, si legge il numero che il runner stampa. */
/* ⛔ E IL 13/08 QUESTO ELENCO PORTAVA LA STESSA RINUNCIA FALSA DEL DOCUMENTO CHE
   SORVEGLIA: teneva fuori `run-fns.mjs` con la ragione «l'emulatore delle
   funzioni qui non parte, chiede la rete». Non era la rete: era
   `apps/deepwork-id/functions/node_modules` **vuota**, e con un `npm ci` quelle
   21 prove passano tutte. Cioè il controllo scritto per non far invecchiare un
   numero **conteneva l'errore che quel numero aveva**, e lo stampava pure in
   fondo con l'aria di una dichiarazione onesta. È la lezione già scritta in
   CLAUDE.md — *una regola scritta in un documento non protegge lo strumento che
   si sta scrivendo* — e vale doppio per le **eccezioni dichiarate**: sono il
   posto in cui nessuno guarda proprio perché sono scritte. */
const SUITE_SICUREZZA = [
  ["regole", "apps/deepwork-id/tests/run.mjs"],
  ["SDK", "apps/deepwork-id/tests/run-sdk.mjs"],
  ["primo avvio", "apps/deepwork-id/tests/run-bootstrap.mjs"],
  ["funzioni", "apps/deepwork-id/tests/run-fns.mjs"],
];

const RE_SICUREZZA = sorveglia("docs/DEVELOPMENT.md",
  /giro-sicurezza\.mjs\s+#\s*(\d+) prove:\s*(\d+) regole,\s*(\d+) SDK,\s*(\d+) primo avvio,\s*(\d+) funzioni/);
export function scomposizioneSicurezza(testo) {
  const m = RE_SICUREZZA.exec(testo);
  return m ? { totale: +m[1], regole: +m[2], SDK: +m[3], "primo avvio": +m[4], funzioni: +m[5] } : null;
}

const proveDichiarate = (rel) =>
  (readFileSync(join(RADICE, rel), "utf8").match(/^[ \t]*(?:await )?test\(/gm) || []).length;

test("docs/DEVELOPMENT.md: la scomposizione della sicurezza è VERA, non solo coerente", () => {
  const d = scomposizioneSicurezza(readFileSync(join(RADICE, "docs/DEVELOPMENT.md"), "utf8"));
  ok(d, "non trovo la riga del comando di sicurezza: se l'hai riscritta, aggiorna la regola qui");
  const storte = [];
  let somma = 0;
  for (const [nome, rel] of SUITE_SICUREZZA) {
    const vero = proveDichiarate(rel);
    somma += vero;
    if (d[nome] !== vero) storte.push(`«${nome}» dice ${d[nome]} ma ${rel} ne dichiara ${vero}`);
  }
  ok(!storte.length, storte.join(" · ") + " — l'addendo si conta nella suite, non si crede");
  ok(d.totale === somma, `il totale dice ${d.totale} ma le ${SUITE_SICUREZZA.length} suite fanno ${somma}`);
});

test("la controprova: un addendo falso che NON rompe la somma viene visto lo stesso", () => {
  /* È il caso vero del 09/08: si sposta di 2 un addendo E il totale, così la
     somma continua a tornare. Un controllo di coerenza direbbe ✓. */
  const sano = "node apps/deepwork-id/tests/giro-sicurezza.mjs   # 123 prove: 75 regole, 19 SDK, 8 primo avvio, 21 funzioni";
  const s = scomposizioneSicurezza(sano);
  ok(s && s.totale === 123 && s["primo avvio"] === 8 && s.funzioni === 21, `la riga sana deve leggersi: ${JSON.stringify(s)}`);
  const coerenteMaFalsa = scomposizioneSicurezza(sano.replace("123 prove", "125 prove").replace("8 primo avvio", "10 primo avvio"));
  ok(coerenteMaFalsa.totale === coerenteMaFalsa.regole + coerenteMaFalsa.SDK + coerenteMaFalsa["primo avvio"] + coerenteMaFalsa.funzioni,
    "il caso di prova deve essere COERENTE, se no non dimostra niente");
  ok(coerenteMaFalsa["primo avvio"] !== proveDichiarate(SUITE_SICUREZZA[2][1]),
    "col difetto rimesso il conto della suite DEVE smentire l'addendo");
  ok(scomposizioneSicurezza("nessuna riga del genere") === null,
    "su un testo senza la riga deve rispondere null, non un oggetto a zero");
});

console.log(`\nscomposizione della sicurezza: ${SUITE_SICUREZZA.length} suite contate `
  + `(${SUITE_SICUREZZA.map(([n, r]) => `${n} ${proveDichiarate(r)}`).join(", ")})`
  + `  ·  nessuna suite tenuta fuori (fino al 13/08 le funzioni erano escluse con una ragione FALSA: vedi il commento sopra)`);

/* Quanti soggetti ha guardato davvero questa parte: un «tutto a posto»
   ottenuto non leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
console.log(`\nmisure su Genesi: ${ID_MODALE.length + ID_EDITOR_3D.length} id verificati, `
  + `${usate.size} variabili del foglio condiviso, ${scoperte.length} scoperte in Genesi`);

/* ── le prove che chiedono l'emulatore, addendo per addendo ───────────
   ⛔ ENTRATA IL 09/08 SU UN DIFETTO VERO: `DEVELOPMENT.md` diceva «**125** con
   l'emulatore Firestore (75 regole, 19 SDK, 21 funzioni, 8 primo avvio)» — e
   quei quattro addendi fanno **123**. Due numeri che si contraddicono nella
   STESSA FRASE, che è peggio di un numero vecchio perché fanno dubitare di
   tutti gli altri. `STATO_PRODOTTO.md`, con gli stessi quattro addendi, diceva
   123: i due documenti del fondatore si smentivano a vicenda.
   ⚠️ E la lezione sull'addendo «non verificabile»: le 21 sulle funzioni erano
   tenute fuori da ogni controllo perché — si diceva — l'emulatore delle
   funzioni qui non parte. Ma **contarle** non chiede nessun emulatore: sono
   `test(` scritti in `run-fns.mjs`, e confondere «non verificabile» con «non
   contabile» lasciava un quarto del totale a invecchiare da solo.
   ⛔ **E il 13/08 si è scoperto che nemmeno la prima metà era vera**:
   l'emulatore delle funzioni parte benissimo: mancava
   `apps/deepwork-id/functions/node_modules`, e con un `npm ci` quelle 21
   passano tutte. Cioè la rinuncia che questo commento raccontava come un
   limite dell'ambiente era una **cartella vuota**, e nessuno l'ha riletta per
   cinque giorni perché la spiegazione suonava tecnica e definitiva.
   ⚠️ E il confronto NON è fra i due documenti: due copie che si somigliano non
   dicono chi ha ragione. Ogni addendo si conta nella **sua suite**. */
const RE_EMULATORE = ["docs/DEVELOPMENT.md", "docs/STATO_PRODOTTO.md"].reduce((re, d) => sorveglia(d, re),
  /\*{0,2}(\d[\d.]*)\*{0,2}[^.]{0,40}l'emulatore Firestore\*{0,2}\s*\(([^)]*)\)/);
export function scomposizioneEmulatore(testo) {
  /* ⚠️ fra il numero e «l'emulatore Firestore» i due documenti scrivono cose
     diverse — «con», «che\ngirano con» — e la frase va **a capo** in mezzo:
     un `[^.\n]` qui dentro guarderebbe un documento su due, che è il difetto
     raccolto tre volte in CLAUDE.md. Si escludono i punti, non gli a capo. */
  const m = RE_EMULATORE.exec(testo);
  if (!m) return null;
  const n = [...m[2].matchAll(/(?:\*\*)?(\d+)(?:\*\*)?/g)].map((x) => +x[1]);
  return { totale: numero(m[1]), addendi: n };
}
const SUITE_EMULATORE = [
  ["regole di sicurezza", "apps/deepwork-id/tests/run.mjs"],
  ["SDK", "apps/deepwork-id/tests/run-sdk.mjs"],
  ["funzioni", "apps/deepwork-id/tests/run-fns.mjs"],
  ["primo avvio", "apps/deepwork-id/tests/run-bootstrap.mjs"],
];
let docEmulatore = 0;
for (const rel of ["docs/DEVELOPMENT.md", "docs/STATO_PRODOTTO.md"]) {
  test(`${rel}: le prove con l'emulatore sono contate nelle loro suite, una per una`, () => {
    const r = scomposizioneEmulatore(readFileSync(join(RADICE, rel), "utf8"));
    ok(r, "non trovo la frase con la scomposizione dell'emulatore — se l'hai riscritta, aggiorna la regola qui");
    ok(r.addendi.length === SUITE_EMULATORE.length,
      `nella parentesi ci sono ${r.addendi.length} numeri e le suite sono ${SUITE_EMULATORE.length}: il controllo non sta leggendo la scomposizione`);
    docEmulatore++;
    const storte = [];
    let somma = 0;
    SUITE_EMULATORE.forEach(([nome, suite], i) => {
      const vero = proveDichiarate(suite);
      somma += vero;
      if (r.addendi[i] !== vero) storte.push(`«${nome}» dice ${r.addendi[i]} ma ${suite} ne dichiara ${vero}`);
    });
    ok(!storte.length, storte.join(" · ") + " — l'addendo si conta nella suite, non si crede");
    ok(r.totale === somma, `il totale dice ${r.totale} ma i quattro addendi accanto fanno ${somma}`);
  });
}
test("la controprova dell'emulatore: un totale coerente coi SUOI addendi ma falso viene visto lo stesso", () => {
  /* il caso vero del 09/08 — il totale scostato dai suoi stessi addendi */
  const sana = "**123 con l'emulatore Firestore** (**75** regole di sicurezza, 19 SDK, 21\nfunzioni, 8 primo avvio) — servono";
  const s = scomposizioneEmulatore(sana);
  ok(s && s.totale === 123 && s.addendi.join() === "75,19,21,8", `la frase sana deve leggersi: ${JSON.stringify(s)}`);
  const rotta = scomposizioneEmulatore(sana.replace("**123 con", "**125 con"));
  ok(rotta.totale !== rotta.addendi.reduce((a, b) => a + b, 0),
    "col difetto vero rimesso (125) la somma DEVE smentire il totale");
  /* e la forma insidiosa: coerente con sé stessa e falsa lo stesso, perché
     l'addendo non è quello che la suite dichiara */
  const coerenteMaFalsa = scomposizioneEmulatore(sana.replace("**123 con", "**125 con").replace("21\nfunzioni", "23\nfunzioni"));
  ok(coerenteMaFalsa.totale === coerenteMaFalsa.addendi.reduce((a, b) => a + b, 0),
    "il caso di prova deve essere COERENTE, se no non dimostra niente");
  ok(coerenteMaFalsa.addendi[2] !== proveDichiarate(SUITE_EMULATORE[2][1]),
    "e la suite DEVE smentire l'addendo, che è la sola cosa che un controllo di coerenza non saprebbe fare");
  ok(scomposizioneEmulatore("nessuna frase del genere") === null,
    "e su un testo qualunque deve rispondere null, non un oggetto a zero");
});

/* ── la copertura dei moduli CONDIVISI, modulo per modulo ─────────────
   ⛔ ENTRATA IL 09/08, DOPO CHE GLI STESSI SEI NUMERI ERANO INVECCHIATI DUE
   VOLTE IN DUE GIORNI. `DEVELOPMENT.md` scompone la copertura del codice
   condiviso («142 su 142 in cinque moduli: dw-shell 46/46, dw-ponti 46/46,
   genesi-data 37/37…») e accanto c'era scritto, onestamente: *«il controllo
   sorveglia il totale delle app, non questa scomposizione: rimisurati a mano»*.
   Il giorno dopo cinque valori su sei erano falsi — 165, 47/47, 47/47, 58/58 —
   perché `genesi-data.js` era cresciuto di ventun funzioni, cioè **il documento
   invecchiava mentre il lavoro andava bene**.
   ⚠️ E l'elenco dei moduli è **derivato dall'uscita del censimento**, non
   scritto qui: un elenco a mano non può accorgersi di un modulo che non sa
   esistere — è il difetto che l'07/08 è costato `chiediDati`, sei chiamate a
   una funzione mai definita, perché `UI_CONDIVISA` era scritto a mano. */
let nominatiDoc = 0;
const mCondivisi = /(\d+) funzioni condivise coperte su (\d+) guardate, in (\d+) moduli/.exec(String(cop.stdout || ""));
const perModulo = [...String(cop.stdout || "").matchAll(/^\s*✓\s+([\w.-]+\.js)\s+(\d+)\/(\d+)\s*$/gm)]
  .map((m) => ({ file: m[1], coperte: +m[2], guardate: +m[3] }));
test("docs/DEVELOPMENT.md: la scomposizione del codice condiviso è quella vera, modulo per modulo", () => {
  ok(mCondivisi, "il censimento non ha stampato la riga dei moduli condivisi");
  ok(perModulo.length >= 5, `solo ${perModulo.length} moduli letti dall'uscita: il controllo non sta leggendo la scomposizione`);
  const testo = readFileSync(join(RADICE, "docs/DEVELOPMENT.md"), "utf8");
  const storte = [];
  const tot = sorveglia("docs/DEVELOPMENT.md", /\*\*(\d+) su (\d+)\*\* in cinque\nmoduli/).exec(testo);
  if (!tot) storte.push("non trovo la frase «**N su M** in cinque moduli»");
  else if (+tot[1] !== +mCondivisi[1] || +tot[2] !== +mCondivisi[2])
    storte.push(`il totale dice ${tot[1]}/${tot[2]}, il censimento conta ${mCondivisi[1]}/${mCondivisi[2]}`);
  /* ⚠️ i moduli dei quali il documento parla: si cerca il NOME nel testo, così
     un modulo nuovo non fa fallire il controllo per il solo fatto di esistere —
     ma se il documento lo nomina con un conto, quel conto deve essere vero. */
  let nominati = 0;
  for (const m of perModulo) {
    const r = new RegExp("`" + m.file.replace(/\./g, "\\.") + "`\\s*\\n?\\*{0,2}(\\d+)/(\\d+)\\*{0,2}").exec(testo);
    if (!r) continue;
    nominati++; nominatiDoc++;
    if (+r[1] !== m.coperte || +r[2] !== m.guardate)
      storte.push(`\`${m.file}\` nel documento dice ${r[1]}/${r[2]}, il censimento conta ${m.coperte}/${m.guardate}`);
  }
  ok(nominati >= 4, `solo ${nominati} moduli dei ${perModulo.length} sono nominati col loro conto nel documento: `
    + "la scomposizione non è più quella, e questo controllo starebbe guardando quasi niente");
  ok(!storte.length, storte.join(" · "));
});

/* ── il censimento del cantiere di Genesi ─────────────────────────────
   ⛔ ENTRATO IL 09/08, DOPO CHE SETTE NUMERI SU SETTE ERANO INVECCHIATI SOTTO
   UN AVVERTIMENTO CHE DICEVA COME SAREBBE SUCCESSO.
   `genesi-estraibili.mjs` misura quante funzioni di Genesi si portano fuori
   dalla pagina senza cambiargli la firma, e la sua tabella sta in
   `DEVELOPMENT.md`. Il 01/08 diceva «46 · 64 · 27 · 31 · 24, cioè 110 su 192»;
   l'09/08 lo strumento stampava «29 · 58 · 23 · 28 · 31, cioè 65 su 169» —
   perché nel frattempo tre fette di Genesi erano davvero uscite dalla pagina,
   cioè il documento invecchiava **mentre il lavoro andava bene**.
   Gli stessi numeri erano scritti, identici, dentro il commento dello
   strumento che li produce, sotto la riga: *«se un giorno divergono, ha
   ragione l'uscita e torto il commento»*. Divergevano da otto giorni.
   ⚠️ La lezione non è «rileggere i commenti»: è che **dichiarare un punto
   cieco non lo illumina** — è la terza volta in due giorni (la roadmap che
   diceva «qui il controllo non arriva» e poi è invecchiata due volte; il fondo
   della copertura che prometteva il caso che non vedeva). L'unica cosa che fa
   scendere questi numeri è un controllo che li **rilanci**. */
const gen = spawnSync(process.execPath, [join(QUI, "genesi-estraibili.mjs")], { encoding: "utf8" });
const gOut = String(gen.stdout || "");
export function censimentoGenesi(uscita) {
  const tot = /misurato — (\d+) funzioni in genesi\.html/.exec(uscita);
  const conta = /non è (\d+): è (\d+) —/.exec(uscita);
  const secchi = [...uscita.matchAll(/^ +(0|1-2|3-5|6-10|11\+) +(\d+) /gm)];
  if (!tot || !conta || secchi.length !== 5) return null;
  return {
    totale: +tot[1], estraibili: +conta[2],
    scaglioni: Object.fromEntries(secchi.map((m) => [m[1], +m[2]])),
  };
}
const g = censimentoGenesi(gOut);
test("il censimento di Genesi ha stampato un quadro leggibile", () => {
  ok(g, "genesi-estraibili.mjs non ha stampato il totale o gli scaglioni: "
    + "se ne hai cambiato il formato, aggiorna la regola qui — un controllo che non "
    + "legge la sua uscita risponde «a posto» senza aver guardato niente");
});
/* La tabella del documento, scaglione per scaglione: il totale da solo non
   basta — il 01/08 il documento aveva la somma giusta e gli addendi vecchi. */
const SCAGLIONI_DOC = [
  ["nessuna — si porta fuori com'è", "0"], ["una o due", "1-2"],
  ["da tre a cinque", "3-5"], ["da sei a dieci", "6-10"],
  ["più di dieci — lì è un rifacimento", "11+"],
];
test("docs/DEVELOPMENT.md: la tabella del cantiere di Genesi è quella che lo strumento stampa", () => {
  ok(g, "il censimento non ha risposto");
  const testo = readFileSync(join(RADICE, "docs/DEVELOPMENT.md"), "utf8");
  const storte = [];
  for (const [etichetta, chiave] of SCAGLIONI_DOC) {
    const m = new RegExp(`\\| ${etichetta.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\| \\*{0,2}(\\d+)\\*{0,2} \\|`).exec(testo);
    if (!m) { storte.push(`la riga «${etichetta}» non c'è più nella tabella`); continue; }
    if (+m[1] !== g.scaglioni[chiave]) storte.push(`«${etichetta}» dice ${m[1]}, lo strumento conta ${g.scaglioni[chiave]}`);
  }
  const somma = sorveglia("docs/DEVELOPMENT.md", /\*\*(\d+) su (\d+) si estraggono/).exec(testo);
  if (!somma) storte.push("non trovo la frase «N su M si estraggono»");
  else if (+somma[1] !== g.estraibili || +somma[2] !== g.totale)
    storte.push(`la frase dice ${somma[1]} su ${somma[2]}, lo strumento conta ${g.estraibili} su ${g.totale}`);
  const quante = sorveglia("docs/DEVELOPMENT.md", /le sue \*\*(\d+) funzioni\*\* stanno dentro/).exec(testo);
  if (!quante) storte.push("non trovo «le sue **N funzioni** stanno dentro»");
  else if (+quante[1] !== g.totale) storte.push(`«${quante[1]} funzioni» dove lo strumento ne conta ${g.totale}`);
  ok(!storte.length, storte.join(" · "));
});
/* ⚠️ E la controprova su una stringa, così non tocca nessun file: senza di lei
   il lettore saprebbe rispondere «a posto» anche non leggendo niente. */
test("la controprova del censimento di Genesi: uno scaglione cambiato viene visto", () => {
  const sana = "Il cantiere di Genesi, misurato — 169 funzioni in genesi.html\n"
    + "      0                                  29  ██\n    1-2                                  58  ██\n"
    + "    3-5                                  23  ██\n   6-10                                  28  ██\n"
    + "    11+                                  31  ██\n⛔ E il numero che conta non è 169: è 65 —\n";
  const r = censimentoGenesi(sana);
  ok(r && r.totale === 169 && r.estraibili === 65 && r.scaglioni["1-2"] === 58,
    `l'uscita sana deve leggersi tutta: ${JSON.stringify(r)}`);
  ok(censimentoGenesi(sana.replace(/^ +11\+.*$/m, "")) === null,
    "con uno scaglione mancante deve rispondere null, non un quadro a quattro voci");
  ok(censimentoGenesi("nessun quadro del genere") === null,
    "e su un testo qualunque deve dirlo, non rispondere che torna");
});

console.log(`\ncodice condiviso: ${perModulo.length} moduli letti dal censimento`
  + `${mCondivisi ? `, ${mCondivisi[1]}/${mCondivisi[2]} funzioni` : " — RIGA DEL TOTALE NON TROVATA"}`
  + `  ·  ${nominatiDoc} nominati col loro conto in DEVELOPMENT.md (gli altri il documento non li conta, e non è un guasto)`);

console.log(`\ncantiere di Genesi: ${g ? `${g.totale} funzioni nella pagina, ${g.estraibili} estraibili, `
  + `${SCAGLIONI_DOC.length} scaglioni confrontati col documento` : "NON MISURATO — il censimento non ha risposto"}`);

/* ── QUANTI NUMERI DICHIARATI NESSUNA REGOLA GUARDA ───────────────────
   ⚠️ È una MISURA, non una regola: non fa fallire niente, e quello che elenca
   sono **candidati**, non accuse. La ragione sta scritta in `CLAUDE.md`: un
   allarme che sbaglia tre volte su quattro insegna a non guardarlo. Qui il
   dubbio è dichiarato in due punti — le regole **iscritte** sono quelle che
   la riga in fondo conta, non tutte quelle che il file contiene (le altre
   vivono dentro le funzioni e non si sono ancora iscritte), quindi una riga
   elencata qui può essere sorvegliata lo stesso; e i numeri contati sono solo
   quelli **contabili**, cioè accanto a una parola che una suite sa contare.
   ⛔ Serve a rispondere alla domanda che il 09/08 ha trovato tre difetti veri
   in un'ora, e che nessun controllo faceva: *questo numero, se marcisce, lo
   dice qualcuno?* Il conto da leggere non è quante righe elenca — è il
   **rapporto**: dove il numeratore si avvicina al denominatore, il documento è
   tenuto da un controllo; dove no, è tenuto dalla memoria di chi lo rilegge. */
const CONTABILI = /(prove|asserzioni|funzioni|esecuzioni|banchi|suite|comandi|classi|iniezioni|schermate|superfici|checkpoint|moduli)/i;
const rigaDi = (testo, i) => testo.slice(0, i).split("\n").length;
console.log("\nNumeri dichiarati e chi li guarda — misura, non regola:");
/* ⛔ L'INDICE DELLE VOCI APERTE DELLA ROADMAP, E PERCHÉ È UN CONTROLLO E NON UNA
   BUONA ABITUDINE. Il 14/08 un cantiere è stato mandato a rifare un lavoro
   **chiuso il 10/08**: la voce `B0-decies` era ancora `- [ ]` perché nessuno
   l'aveva spuntata, e l'indice in cima la elencava fra le aperte. Sono due ore
   di riverifica, e la roadmap è il posto da cui il ciclo decide che cosa fare.
   È la terza forma d'invecchiamento di CLAUDE.md — *una riga che propone un
   lavoro già fatto lo fa RINASCERE* — applicata al file che la ospita.
   Lo stesso giorno il conto era sbagliato **nei due versi**: tre voci
   superate erano rimaste `- [ ]` (e l'indice le proponeva), e una chiusa
   (`B8`) era rimasta **nell'indice** pur essendo `- [x]`.
   Il controllo è una sottrazione, non una lettura: quante voci `- [ ]` ci
   sono, e quante righe ha l'indice. Se i due numeri si scostano, uno dei due
   è più vecchio dell'altro. */
{
  const rel = "vault/ROADMAP_SETTIMANA.md";
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const aperte = (testo.match(/^- \[ \] \*\*/gm) || []).length;
  /* l'indice è il blocco di righe «- `nome`» che segue il suo titolo: si legge
     da lì e non da tutto il file, se no un elenco puntato qualunque entrerebbe
     nel conto */
  const daTitolo = testo.slice(testo.indexOf("## 🧭 Le voci APERTE, per nome"));
  const indice = (daTitolo.match(/^- `/gm) || []).length;

  test("la roadmap: l'indice delle voci aperte ha una riga per ogni voce aperta", () => {
    ok(aperte > 0, "nessuna voce aperta trovata: il righello non sta guardando dove crede");
    ok(indice === aperte,
      `l'indice elenca ${indice} voci e le voci \`- [ ]\` sono ${aperte}: uno dei due è più vecchio dell'altro.\n`
      + "      Si rigenera con: grep -n \"^- \\[ \\] \\*\\*\" vault/ROADMAP_SETTIMANA.md");
  });

  test("la controprova: una voce chiusa lasciata nell'indice viene vista", () => {
    /* sul TESTO, senza toccare il disco: si aggiunge una riga d'indice che non
       ha nessuna voce aperta dietro */
    const guasto = daTitolo.replace("## 🧭 Le voci APERTE, per nome",
      "## 🧭 Le voci APERTE, per nome\n- `voce che non esiste piu`");
    ok(guasto !== daTitolo, "l'iniezione non ha sostituito niente: la prova non prova niente");
    const indice2 = (guasto.match(/^- `/gm) || []).length;
    ok(indice2 === indice + 1 && indice2 !== aperte,
      "con una riga d'indice in più il conto deve scostarsi — e non si scosta");
  });
  console.log(`  [roadmap] ${aperte} voci aperte, ${indice} righe d'indice`);
}

for (const rel of ["docs/DEVELOPMENT.md", "docs/STATO_PRODOTTO.md", "docs/DECISIONI_WEEKEND.md"]) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const coperte = new Set();
  for (const [f, regola] of SORVEGLIATE) {
    if (f !== rel) continue;
    const m = regola.exec(testo);
    if (!m) continue;
    for (let r = rigaDi(testo, m.index); r <= rigaDi(testo, m.index + m[0].length); r++) coperte.add(r);
  }
  /* un numero «dichiarato» è un grassetto che COMINCIA con una cifra: è la
     convenzione di casa per una cifra misurata, e prende anche «**65 su 169**» */
  const numeri = [...testo.matchAll(/\*\*(\d[^*]{0,60}?)\*\*/g)]
    .filter((m) => CONTABILI.test(testo.slice(Math.max(0, m.index - 90), m.index + m[0].length + 90)))
    /* le sigle delle decisioni («**10b**», «**5a**») non sono misure */
    .filter((m) => !/^\d+[a-z]?\.?$/.test(m[1].trim()));
  const fuori = numeri.filter((m) => !coperte.has(rigaDi(testo, m.index)));
  console.log(`  ${rel.padEnd(26)} ${String(numeri.length).padStart(3)} contabili, `
    + `${String(numeri.length - fuori.length).padStart(3)} su righe che una regola iscritta guarda`
    + (fuori.length ? `  ·  candidati: ${fuori.slice(0, 6).map((m) => `r.${rigaDi(testo, m.index)} «${m[1].split("\n")[0].slice(0, 28)}»`).join(", ")}${fuori.length > 6 ? ` … e altri ${fuori.length - 6}` : ""}` : "  ·  nessun candidato"));
}
console.log(`  (${SORVEGLIATE.length} regole iscritte al censimento; le altre di questo file non lo sono ancora, `
  + "quindi un candidato può essere sorvegliato lo stesso — il dubbio è dichiarato, non nascosto)");

console.log(`\nRisultato numeri nei documenti: ${passed} passati, ${failed} falliti`
  + `  ·  ${guardati} documenti letti, ${banchi} banchi contati, copertura ${coperte}/${guardateFn}`);
process.exit(failed > 0 ? 1 : 0);

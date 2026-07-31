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

/* la modale in stile core di Genesi: i cinque id che l'unità A rinomina */
const ID_MODALE = ["mdl", "mdl-tit", "mdl-body", "mdl-foot", "mdl-campo"];
/* il prefisso `mdl` è sovraccarico: questi SETTE sono dell'editor del fronte
   3D e una sostituzione a tappeto se li porterebbe via */
const ID_EDITOR_3D = ["mdlQuote", "mdlTools", "mdlR", "mdlRLab", "mdlUndo", "mdlRedo", "mdlReset"];

test("Genesi: i cinque id della modale sono ancora quelli del piano", () => {
  const mancanti = ID_MODALE.filter((id) => !genesi.includes(`id="${id}"`));
  ok(mancanti.length === 0,
    `non trovo più ${mancanti.join(", ")} — se la migrazione è fatta, il piano nel documento va riscritto`);
});

test("Genesi: i sette id dell'editor 3D che NON vanno rinominati ci sono tutti", () => {
  const mancanti = ID_EDITOR_3D.filter((id) => !genesi.includes(`id="${id}"`));
  ok(mancanti.length === 0, `mancano ${mancanti.join(", ")}: l'elenco nel documento non descrive più la pagina`);
});

/* Il nome `modal` in Genesi è occupato dal CANCELLO DI CONSENSO — l'avvertenza
   che dichiara estetici i frammenti volanti. È il fatto che rende la rinomina
   uno scambio di inquilino invece di una sostituzione di stringhe. */
test("Genesi: `#modal` è ancora il cancello di consenso, non una modale qualsiasi", () => {
  const i = genesi.indexOf('id="modal"');
  ok(i > 0, "non trovo più `id=\"modal\"` in Genesi");
  const blocco = genesi.slice(i, i + 1600);
  ok(/disclaimerChk/.test(blocco) && /modalOk/.test(blocco),
    "`#modal` non contiene più la casella del consenso: il piano parla di un elemento che non esiste più");
});

test("Genesi: non carica ancora nessun file di shared/", () => {
  const rif = (genesi.match(/(?:src|href)="[^"]*shared\/[^"]*"/g) || []);
  ok(rif.length === 0,
    `Genesi carica ora ${rif.length} file condivisi (${rif.join(", ")}): il documento dice che non ne carica nessuno`);
});

/* Le variabili che il foglio condiviso PRONUNCIA e che Genesi non DEFINISCE.
   È il numero che decide il piano: una variabile CSS assente non fallisce,
   ricade sull'ereditato — l'assenza di un dato travestita da «va bene così». */
const usate = new Set([...foglio.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]));
const definite = new Set([...genesi.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const scoperte = [...usate].filter((v) => !definite.has(v));

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

/* Quanti soggetti ha guardato davvero questa parte: un «tutto a posto»
   ottenuto non leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
console.log(`\nmisure su Genesi: ${ID_MODALE.length + ID_EDITOR_3D.length} id verificati, `
  + `${usate.size} variabili del foglio condiviso, ${scoperte.length} scoperte in Genesi`);

console.log(`\nRisultato numeri nei documenti: ${passed} passati, ${failed} falliti`
  + `  ·  ${guardati} documenti letti, ${banchi} banchi contati, copertura ${coperte}/${guardateFn}`);
process.exit(failed > 0 ? 1 : 0);

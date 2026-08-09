// ============================================================
// L'OROLOGIO DEL VAULT — un checkpoint non può essere datato nel futuro
//
// ⛔ PERCHÉ ESISTE. `CLAUDE.md` dice ai cicli automatici: «riprendere dal
// checkpoint PIÙ RECENTE in vault/checkpoints/ (timestamp più alto nel nome)».
// È il meccanismo con cui ogni ciclo trova dove ricominciare, e il 01/08 si è
// scoperto che **non guarda l'ora: guarda una stringa**.
//
// Misurato confrontando il nome col giorno in cui il file è entrato in git:
//
//   nome 20260722-*  → entrato il 21/07   (+1)   ← lo scarto comincia qui
//   nome 20260731-*  → entrato il 30/07   (+1)
//   nome 20260802-*  → entrato il 31/07   (+2)
//   nome 20260803-*  → entrato il 31/07   (+3)
//   nome 20260804-*  → entrato il 31/07   (+4)
//   nome 20260805-*  → entrato il 31/07   (+5)
//
// Un solo giorno di lavoro — il 31 luglio — si è dato **cinque date diverse**,
// una per blocco, come se ogni blocco fosse un giorno nuovo. Effetto: il
// checkpoint col «timestamp più alto» è di quattro giorni **prima**, in tempo
// reale, di quello scritto stanotte. Un ciclo che segue la regola alla lettera
// riprende dal posto sbagliato — e non se ne accorge, perché la regola una
// risposta la dà sempre.
//
// È la forma già raccolta in `CLAUDE.md`: un controllo che risponde con
// sicurezza guardando dove non crede. Qui la stringa somiglia a un'ora, quindi
// nessuno la mette in dubbio.
//
// COSA CONTROLLA
//  1. nessun checkpoint NUOVO è datato dopo il giorno in cui è entrato in git;
//  2. il lascito precedente alla regola è MISURATO invece che elencato: se un
//     giorno qualcuno lo sistema, il numero scende e la prova lo dice;
//  3. e stampa QUAL È DAVVERO l'ultimo checkpoint, per data di git: è la
//     risposta che serve al ciclo che riparte, e che il nome non sa dare.
// ============================================================
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");

let passed = 0, failed = 0;
const test = (nome, fn) => { try { fn(); passed++; console.log(`  ✓ ${nome}`); } catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); } };
const ok = (c, why) => { if (!c) throw new Error(why); };

/* La data in cui OGNI checkpoint è entrato in git, letta in una volta sola:
   una `git log` per file su duecento file costa minuti. */
export function dateDiIngresso(testoGit) {
  const mappa = new Map();
  let giorno = null;
  for (const riga of testoGit.split("\n")) {
    if (riga.startsWith("C ")) { giorno = riga.slice(2).trim(); continue; }
    const f = riga.trim();
    if (f && giorno) mappa.set(f, giorno);   // il primo che si incontra è l'ultimo commit: si sovrascrive fino al più vecchio
  }
  return mappa;
}
/* Il confronto vero e proprio. Prende la MAPPA, non il repository: così la
   controprova non ha bisogno di inventare commit. */
export function datateNelFuturo(mappa, eccezioni = new Set()) {
  const out = [];
  for (const [file, quandoGit] of mappa) {
    const m = /(\d{4})(\d{2})(\d{2})-\d{6}_/.exec(file.replace(/^.*\//, ""));
    if (!m) continue;
    const nome = `${m[1]}-${m[2]}-${m[3]}`;
    const giornoGit = String(quandoGit).slice(0, 10);
    if (nome > giornoGit && !eccezioni.has(file))
      out.push({ file, nome, giornoGit, avanti: giorniFra(giornoGit, nome) });
  }
  return out;
}

/* ⛔ LA SECONDA DOMANDA, dal 09/08: non «in che GIORNO», ma «a che ORA».
   Trovata scrivendo il canarino di un ciclo nuovo: l'ora vera erano le 10:15Z
   e il checkpoint più recente si chiamava `20260809-143000_...`, scritto in
   realtà alle 10:13 — **quattro ore e diciassette minuti avanti**. La prima
   prova diceva ✓, perché il giorno era lo stesso.
   ⚠️ E il conto che ne è uscito ridimensiona il lascito dichiarato: i
   checkpoint datati avanti sono **508**, non 184. I 184 sono quelli avanti di
   GIORNI; gli altri **324 sono avanti di ORE nello stesso giorno**, fino a
   **1112 minuti** (diciotto ore e mezza), e nessun controllo li ha mai visti.
   Cioè: **il numero dichiarato non misurava il difetto, misurava la
   granularità del righello.**
   Perché conta e non è pignoleria: il nome del file è quello che questo
   repository usa per dire «riprendi da qui». Un file che si dichiara delle
   14:30 quando è stato scritto alle 10:13 sposta il punto di ripresa avanti
   di quattro ore rispetto al lavoro vero — ed è la stessa famiglia del
   «cinque date diverse in un giorno solo» che sta in cima a CLAUDE.md. */
export function oreNelFuturo(mappa, eccezioni = new Set()) {
  const out = [];
  for (const [file, quandoGit] of mappa) {
    const m = /(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})_/.exec(file.replace(/^.*\//, ""));
    if (!m || eccezioni.has(file)) continue;
    const nome = Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`);
    const git = Date.parse(quandoGit);
    if (!Number.isFinite(nome) || !Number.isFinite(git)) continue;
    const minuti = Math.round((nome - git) / 60000);
    if (minuti > 0) out.push({ file, minuti, quandoGit });
  }
  return out;
}
const giorniFra = (a, b) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 864e5);

/* ⛔ IL LASCITO, DICHIARATO PER DATA E NON A ELENCO. Lo scarto non è nato il
   31/07: la misura dice che comincia il **22/07** e attraversa tutto l'archivio.
   Rinominare quei file romperebbe i rimandi «Unità precedente» che li legano in
   catena, e riscrivere la storia per far tornare un controllo è il modo di
   perdere la storia. Quindi la regola vale **da quando è stata scritta**: un
   checkpoint entrato in git da `DAL` in poi non può essere datato nel futuro.
   ⚠️ Scritta così non può marcire: un file nuovo ha sempre una data di git
   ≥ DAL, quindi entra nel controllo per costruzione. E la seconda prova
   MISURA il lascito invece di elencarlo — se qualcuno un giorno lo sistema, il
   numero scende e si vede. */
const DAL = "2026-08-01";

/* ⛔ E PRIMA DI TUTTO: QUESTO CONTROLLO SA RISPONDERE QUI DENTRO?
   Legge la storia di git. In CI `actions/checkout` clona di default a
   **profondità 1**: `git log --diff-filter=A` vedrebbe un commit solo, il conto
   dei checkpoint verrebbe quasi zero, e il controllo direbbe «nessuna
   violazione» **senza aver guardato niente** — la stessa cosa che questa suite
   esiste per impedire, fatta da lei. Quindi in un clone superficiale non prova
   a rispondere: si ferma e dice **come** si mette in condizione di farlo. */
if (execSync("git rev-parse --is-shallow-repository", { cwd: RADICE, encoding: "utf8" }).trim() === "true") {
  console.error("\n✗ orologio del vault: il clone e' SUPERFICIALE (fetch-depth 1).");
  console.error("  Questo controllo legge la data in cui ogni checkpoint e' ENTRATO in git:");
  console.error("  con un commit solo direbbe «tutto a posto» senza aver guardato niente.");
  console.error("  Rimedio: `fetch-depth: 0` sul passo actions/checkout che lancia le suite.\n");
  process.exit(1);
}
/* ⚠️ E IL FUSO ORARIO QUI NON C'ENTRA — misurato, dopo aver creduto il
   contrario e aver quasi «corretto» un difetto che non esiste.
   Il sospetto era ragionevole: `git log --date=short` sembra rendere la data
   nel fuso di chi guarda, quindi lo stesso commit delle 23:30 UTC si leggerebbe
   «domani» a Roma — e il controllo darebbe due risposte diverse sullo stesso
   repository, che è il difetto descritto in CLAUDE.md applicato a sé stesso.
   **Falso.** `--date=short` rende la data nell'offset REGISTRATO NEL COMMIT
   (qui `+0000`), non in quello di chi legge: è `--date=local` a seguire il
   lettore. Provato sullo stesso commit in UTC, Asia/Tokyo e
   Pacific/Kiritimati (+14): **stessa data tutte e tre le volte**, mentre
   `--date=local` cambia come previsto.
   Quindi niente `TZ` da fissare: sarebbe stata una riga che non fa niente, con
   accanto un commento che spiega una trappola inesistente — e un commento
   sbagliato è peggio della riga, perché lo crede anche il prossimo. */
const git = execSync(
  /* ⛔ `--date=iso-strict` E NON PIÙ `--date=short`, dal 09/08. Il giorno era
     tutto quello che questo controllo poteva vedere, e quindi era tutto quello
     che il difetto doveva evitare: un checkpoint datato quattro ore avanti,
     nello stesso giorno, passava senza che niente diventasse rosso. La misura
     è nella seconda prova qui sotto. */
  "git log --diff-filter=A --format='C %ad' --date=iso-strict --name-only -- vault/checkpoints/",
  { cwd: RADICE, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
/* ⚠️ `archivio/` sta fuori, come dice CLAUDE.md quando spiega dove cercare il
   checkpoint più recente: se entrasse, il conto parlerebbe di file che la
   regola dei cicli non guarda nemmeno. */
const MAPPA = new Map([...dateDiIngresso(git)]
  .filter(([f]) => f.startsWith("vault/checkpoints/") && !f.includes("/archivio/")));
const daOggi = new Set([...MAPPA].filter(([, g]) => g >= DAL).map(([f]) => f));
const lascito = new Set([...MAPPA.keys()].filter((f) => !daOggi.has(f)));

console.log(`\nL'orologio del vault — ${MAPPA.size} checkpoint letti da git\n`);

test("nessun checkpoint NUOVO è datato dopo il giorno in cui è entrato in git", () => {
  const v = datateNelFuturo(MAPPA, lascito);
  ok(v.length === 0,
    v.map((x) => `${x.file.replace(/^.*\//, "")} dice ${x.nome} ma è entrato il ${x.giornoGit} (${x.avanti} giorni avanti)`).join("\n      "));
});

test("il lascito è misurato, non dimenticato", () => {
  const v = datateNelFuturo(MAPPA, daOggi);
  const max = v.length ? Math.max(...v.map((x) => x.avanti)) : 0;
  const primo = v.map((x) => x.giornoGit).sort()[0] || "—";
  console.log(`      lascito: ${v.length} checkpoint su ${lascito.size} datati avanti, fino a ${max} giorni, dal ${primo}`);
  ok(lascito.size > 0, "nessun checkpoint precedente a DAL: il controllo non sta guardando l'archivio");
  ok(v.length > 0,
    "zero checkpoint del lascito datati nel futuro: o è stato sistemato — e allora questa prova va tolta — o il controllo non sta guardando");
});

/* ⛔ LA REGOLA SULL'ORA, e la sua data d'inizio. Come `DAL`, non è retroattiva
   e non può esserlo: i 324 checkpoint già dentro non si possono rinominare
   senza riscrivere la storia di git, e riscriverla per una data nel nome
   costerebbe più di quanto valga. Quindi la regola parte da ADESSO — il
   momento in cui è stata scritta — e tutto quello che c'era prima diventa
   lascito **misurato**, esattamente come si è fatto per i giorni il 01/08.
   ⚠️ Scritta così non può marcire: un checkpoint nuovo ha sempre un'ora di git
   ≥ `DALL_ORA`, quindi entra nel controllo per costruzione. */
const DALL_ORA = "2026-08-09T10:30:00Z";
const daAdesso = new Set([...MAPPA].filter(([, q]) => Date.parse(q) >= Date.parse(DALL_ORA)).map(([f]) => f));
const primaDiAdesso = new Set([...MAPPA.keys()].filter((f) => !daAdesso.has(f)));

test("nessun checkpoint NUOVO è datato dopo l'ORA in cui è entrato in git", () => {
  const v = oreNelFuturo(MAPPA, primaDiAdesso);
  ok(v.length === 0,
    v.map((x) => `${x.file.replace(/^.*\//, "")} è entrato alle ${x.quandoGit} (${x.minuti} minuti avanti)`).join("\n      "));
});

test("il lascito delle ORE è misurato, non dimenticato", () => {
  const v = oreNelFuturo(MAPPA, daAdesso);
  /* «stesso giorno» = il giorno nel NOME e il giorno di GIT combaciano: sono
     quelli che il controllo per giorni non poteva vedere nemmeno in linea di
     principio, ed è il numero che questa prova esiste per far comparire. */
  const soloOre = v.filter((x) =>
    x.file.replace(/^.*\//, "").slice(0, 8) === String(x.quandoGit).slice(0, 10).replace(/-/g, ""));
  const max = v.length ? Math.max(...v.map((x) => x.minuti)) : 0;
  console.log(`      lascito delle ore: ${v.length} checkpoint datati avanti di almeno un minuto, fino a ${max} minuti`);
  console.log(`         di cui ${soloOre.length} nello STESSO giorno — invisibili al controllo per giorni, e mai contati prima del 09/08`);
  ok(v.length > 0,
    "zero checkpoint del lascito datati avanti di ore: o è stato sistemato — e allora questa prova va tolta — o il controllo non sta guardando");
});

/* ⚠️ LA CONTROPROVA, e non tocca nessun file: la funzione prende la mappa. */
test("la controprova delle ORE: un'ora avanti si vede, e il giorno da solo non basta", () => {
  /* ⛔ IL CASO CHE CONTA È IL SECONDO, ed è il difetto vero di stamattina: un
     checkpoint datato **nello stesso giorno** ma quattro ore avanti. La prova
     per GIORNI lo lascia passare — e va dimostrato qui, non dedotto, se no
     nessuno sa che le due domande sono diverse. */
  const avantiDiOre = new Map([["vault/checkpoints/20260809-143000_x.md", "2026-08-09T10:13:30+00:00"]]);
  ok(datateNelFuturo(avantiDiOre).length === 0,
    "la prova per GIORNI non vede uno scarto di ore: se lo vedesse, questa seconda prova non servirebbe");
  const v = oreNelFuturo(avantiDiOre);
  ok(v.length === 1 && v[0].minuti === 257,
    `quattro ore e diciassette minuti avanti devono fare 257: ${JSON.stringify(v)}`);
  const sano = new Map([["vault/checkpoints/20260809-101000_x.md", "2026-08-09T10:13:30+00:00"]]);
  ok(oreNelFuturo(sano).length === 0, "un nome tre minuti INDIETRO è normale: si scrive il file e poi si committa");
  ok(oreNelFuturo(avantiDiOre, new Set(["vault/checkpoints/20260809-143000_x.md"])).length === 0,
    "e l'eccezione del lascito deve funzionare, se no la regola sarebbe retroattiva");
});

test("la controprova: un nome nel futuro viene visto, uno giusto no", () => {
  const sana = new Map([["vault/checkpoints/20260801-120000_x.md", "2026-08-01"]]);
  ok(datateNelFuturo(sana).length === 0, "un nome che coincide col giorno di git non è una violazione");
  const avanti = new Map([["vault/checkpoints/20260809-120000_x.md", "2026-08-01"]]);
  const v = datateNelFuturo(avanti);
  ok(v.length === 1 && v[0].avanti === 8, `otto giorni avanti devono essere visti: ${JSON.stringify(v)}`);
  // e il verso opposto: un nome NEL PASSATO è legittimo (si scrive il checkpoint
  // di ieri stamattina), quindi non deve segnalare
  const indietro = new Map([["vault/checkpoints/20260725-120000_x.md", "2026-08-01"]]);
  ok(datateNelFuturo(indietro).length === 0, "un nome nel passato non è un difetto: non deve segnalare");
  // e l'eccezione deve saper scusare
  ok(datateNelFuturo(avanti, new Set(["vault/checkpoints/20260809-120000_x.md"])).length === 0,
    "un caso dichiarato non deve comparire fra le violazioni");
});

/* ── LA RISPOSTA CHE SERVE AL CICLO CHE RIPARTE ──────────────────────── */
const perData = [...MAPPA.entries()].sort((a, b) =>
  a[1] === b[1] ? (a[0] < b[0] ? 1 : -1) : (a[1] < b[1] ? 1 : -1));
const veroUltimo = perData[0];
const perNome = [...MAPPA.keys()].sort().reverse()[0];
console.log(`\n⛔ Da quale checkpoint riparte davvero un ciclo:`);
console.log(`   per DATA DI GIT (giusto):  ${veroUltimo[0].replace(/^.*\//, "")}  (${veroUltimo[1]})`);
console.log(`   per NOME    (la regola vecchia): ${perNome.replace(/^.*\//, "")}  (${MAPPA.get(perNome)})`);
if (veroUltimo[0] !== perNome)
  console.log(`   ⚠️ SONO DIVERSI. Chi segue il nome apre un file scritto`
    + ` ${giorniFra(MAPPA.get(perNome), veroUltimo[1])} giorni PRIMA di quello vero, credendo che sia il più fresco.`);

console.log(`\nRisultato orologio del vault: ${passed} passati, ${failed} falliti  ·  ${MAPPA.size} checkpoint (archivio escluso), ${lascito.size} precedenti alla regola`);
process.exit(failed > 0 ? 1 : 0);

// ============================================================
// LE PROVE `grep` DEI DOCUMENTI DI RICERCA, RILANCIATE
//
// ⛔ PERCHÉ ESISTE. Il 16/09, nello stesso pomeriggio, due sezioni intere di
// ricerca — il decimo giro di Conti (piano di rientro, concentrazione
// portafoglio, sconto cassa, storico dei solleciti) e l'undicesimo giro di
// Scudo (rischio chimico, denuncia INAIL, anagrafica attrezzature,
// notifiche, barriere ICAM) — dichiaravano NOVE mancanze "confermate" con
// un comando `grep` e la sua uscita a zero. Tutte e nove erano già state
// implementate: il cantiere di prodotto era girato lo stesso giorno, poche
// ore dopo la ricerca, senza che i due si parlassero — la stessa famiglia
// già censita in questo repository come "documento invecchiato", qui nella
// sua forma più precisa: non la RIGA a invecchiare, il COMANDO scritto
// dentro di lei.
//
// ⚠️ QUESTO CONTROLLO NON È `documenti-invecchiati.mjs` IN UN'ALTRA FORMA.
// Quello guarda IL COMMIT dichiarato contro cui un documento è stato
// verificato, e conta quanti commit sono passati da allora — una misura
// sull'ETÀ del documento. Questo guarda l'EVIDENZA scritta dentro il
// documento: un comando `grep` con la sua uscita, RILANCIATO oggi. Un
// documento può essere "fresco" per `documenti-invecchiati.mjs` (verificato
// ieri) e portare comunque un `grep` la cui uscita è già cambiata stamattina
// — sono due controlli complementari, non lo stesso controllo due volte.
//
// ⚠️ E NON È NEMMENO LA STRADA GIÀ PROVATA E SCARTATA in
// `documenti-invecchiati.mjs` ("rimettere alla prova i TERMINI che ogni riga
// dichiara di aver cercato": 8 righe segnalate, 2 vere, 6 falsi allarmi,
// perché la colonna della prova è PROSA scritta da sei autori in sei
// notazioni, e un lettore automatico prende un nome che ESISTE per un
// termine cercato a vuoto). Qui non si legge la prosa e non si indovina un
// termine: si rilancia **il comando eseguibile che il documento stesso
// scrive**, carattere per carattere — la forma che CLAUDE.md pretende per
// ogni prova di questa casa ("un comando si rilancia; un numero si può solo
// credere"). Se il documento non scrive un comando, questo controllo non ha
// niente da rilanciare e non dice niente su quella riga: non è un
// censimento di OGNI mancanza dichiarata, è un censimento di quelle
// dichiarate con un comando verificabile.
//
// COME FUNZIONA. Si cercano in ogni `docs/RICERCA_CONTINUA_*.md` i blocchi
// nella forma
//     $ grep -c... "pattern" file1 file2 ...
//     file1:N
//     file2:M
// (una riga che comincia con `$ grep` seguita da una o più righe
// `percorso:numero`). Si rilancia lo STESSO comando, oggi, e si confrontano
// i conteggi. Un comando con uno shell speciale (`;`, `&&`, backtick,
// `$(`, una redirezione) viene SCARTATO, non eseguito: l'allowlist è
// deliberatamente stretta, perché questo file esegue testo preso da un
// documento — anche se quel documento lo scriviamo noi, un comando che
// questo controllo non sa leggere per intero non va eseguito alla cieca.
//
// QUANDO UNA MANCANZA CAMBIA NUMERO, NON È AUTOMATICAMENTE UN DIFETTO: è
// la stessa lezione della funzione qui sopra applicata al risultato. Una
// mancanza implementata E CHIUSA (una nota "✅ ... CHIUS…" fra il blocco e
// la sezione successiva) è storia, non un allarme — è la prova che il
// documento SA raccontare la propria correzione, ed è esattamente la forma
// che questo repository chiede ("chi chiude un'unità aggiorna la riga del
// documento che gliel'aveva proposta"). Un blocco scaduto SENZA quella nota
// è quello che conta: una mancanza che qualcuno potrebbe rileggere oggi e
// credere ancora vera, e riaprire un cantiere su un lavoro già fatto.
// ============================================================
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const CARTELLA_DOCS = join(RADICE, "docs");

let passed = 0, failed = 0;
const test = (nome, fn) => { try { fn(); passed++; console.log(`  ✓ ${nome}`); } catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); } };
const ok = (c, why) => { if (!c) throw new Error(why); };
const eq = (a, b, why) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${why} — atteso ${JSON.stringify(b)}, letto ${JSON.stringify(a)}`); };

/* Un blocco: `$ grep ...` seguito da una o più righe `percorso:numero`.
   Pura e testabile: prende testo, restituisce blocchi. */
export function estraiBlocchi(testo) {
  const blocchi = [];
  const re = /\$\s*(grep\s+-c\S*\s+.+)\n((?:[ \t]*[\w./-]+:\d+[ \t]*\n?)+)/g;
  let m;
  while ((m = re.exec(testo))) {
    const comando = m[1].trim();
    const claimed = {};
    for (const riga of m[2].trim().split("\n")) {
      const mm = riga.trim().match(/^([\w./-]+):(\d+)$/);
      if (mm) claimed[mm[1]] = +mm[2];
    }
    blocchi.push({ comando, claimed, fine: re.lastIndex, inizio: m.index });
  }
  return blocchi;
}

/* ⛔ L'ALLOWLIST. Solo `grep -c<flag opzionali> "pattern" file file...` (o con
   apici singoli). Qualunque altro carattere di shell (`;`, `&&`, `|`, backtick,
   `$(`, `>`, `<`) fa scartare il comando SENZA eseguirlo — anche se il `|`
   dentro un apice è innocuo (fa parte del pattern -E), non si prova a
   distinguerlo: si esegue con `execFileSync`, mai con una shell, così un `|`
   dentro le virgolette resta testo e non può mai diventare una pipe vera. */
export function comandoSicuro(comando) {
  const m = comando.match(/^grep\s+(-\S+)\s+(["'])((?:\\.|(?!\2).)*)\2\s+(.+)$/);
  if (!m) return null;
  const [, flag, , pattern, resto] = m;
  if (!/^-[a-zA-Z]+$/.test(flag)) return null;
  /* difesa in profondità: `execFileSync` (sotto) non passa MAI da una shell,
     quindi `$(...)`/backtick dentro il pattern sono già innocui — restano
     testo passato a `grep`, non una sostituzione di comando. Si scartano lo
     stesso: un allowlist che si giustifica solo con "tanto non gira in
     shell" è un allowlist che smette di proteggere il giorno in cui
     qualcuno, altrove, riusa `comandoSicuro` con `execSync`. */
  if (/\$\(|`/.test(pattern)) return null;
  const file = resto.trim().split(/\s+/);
  if (!file.length || file.some((f) => !/^[\w./-]+$/.test(f))) return null;
  return { flag, pattern, file };
}

function eseguiGrep(sicuro) {
  const out = {};
  for (const f of sicuro.file) {
    try {
      const r = execFileSync("grep", [sicuro.flag, sicuro.pattern, f], { cwd: RADICE, encoding: "utf8" });
      out[f] = +r.trim();
    } catch (e) {
      // grep esce 1 quando non trova nulla: non è un errore, è zero
      out[f] = e.status === 1 ? 0 : null;
    }
  }
  return out;
}

const CHIUSURA = /✅[^\n]{0,200}CHIUS/i;

const file = readdirSync(CARTELLA_DOCS).filter((n) => /^RICERCA_CONTINUA_.*\.md$/.test(n)).sort();
ok(file.length >= 5, `almeno cinque documenti di ricerca continua attesi, trovati ${file.length}`);

const risultati = [];
for (const nome of file) {
  const testo = readFileSync(join(CARTELLA_DOCS, nome), "utf8");
  for (const b of estraiBlocchi(testo)) {
    const sicuro = comandoSicuro(b.comando);
    if (!sicuro) { risultati.push({ nome, ...b, fuoriPerimetro: true }); continue; }
    const attuale = eseguiGrep(sicuro);
    const scaduti = Object.entries(b.claimed).filter(([f, n]) => attuale[f] != null && attuale[f] !== n);
    // la chiusura vale se sta FRA questo blocco e la PROSSIMA intestazione di sezione
    const prossimaSezione = testo.indexOf("\n## ", b.fine);
    const finestra = testo.slice(b.fine, prossimaSezione === -1 ? testo.length : prossimaSezione);
    const chiuso = CHIUSURA.test(finestra);
    risultati.push({ nome, comando: b.comando, claimed: b.claimed, attuale, scaduti, chiuso });
  }
}

test("almeno un blocco `grep` verificabile trovato in tutto il censimento", () => {
  ok(risultati.filter((r) => !r.fuoriPerimetro).length > 20,
    `troppo pochi blocchi letti (${risultati.filter((r) => !r.fuoriPerimetro).length}): il riconoscitore potrebbe essersi rotto`);
});

test("nessun blocco `grep` scaduto senza una nota di chiusura", () => {
  const nonChiusi = risultati.filter((r) => !r.fuoriPerimetro && r.scaduti.length && !r.chiuso);
  if (nonChiusi.length) {
    const dettaglio = nonChiusi.map((r) =>
      `${r.nome}: "${r.comando}" — ${r.scaduti.map(([f, n]) => `${f} diceva ${n}, ora ${r.attuale[f]}`).join(", ")}`
    ).join("\n      ");
    throw new Error(`${nonChiusi.length} blocchi con una prova scaduta e nessuna chiusura vicina:\n      ${dettaglio}`);
  }
});

// ── controprova: il riconoscitore SA leggere un blocco vero ──
test("controprova · estraiBlocchi legge un blocco scritto come nei documenti", () => {
  const testo = '    $ grep -ciE "termine|altro" apps/x/y.js apps/x/z.html\n    apps/x/y.js:0\n    apps/x/z.html:2\n';
  const b = estraiBlocchi(testo);
  eq(b.length, 1, "un blocco solo");
  eq(b[0].comando, 'grep -ciE "termine|altro" apps/x/y.js apps/x/z.html', "il comando intero, apici compresi");
  eq(b[0].claimed, { "apps/x/y.js": 0, "apps/x/z.html": 2 }, "i due conteggi dichiarati");
});

// ── controprova: un comando con shell injection viene scartato, non eseguito ──
test("controprova · comandoSicuro scarta un comando con caratteri di shell", () => {
  for (const pericoloso of [
    'grep -c "x" file.js; rm -rf /',
    'grep -c "x" file.js && echo ciao',
    'grep -c "$(whoami)" file.js',
    "grep -c \"`id`\" file.js",
    'grep -c "x" file.js > /tmp/uscita',
  ]) ok(comandoSicuro(pericoloso) === null, `doveva essere scartato: ${pericoloso}`);
  ok(comandoSicuro('grep -ciE "a|b" apps/x/y.js') !== null, "un comando pulito con un `|` DENTRO le virgolette resta ammesso");
});

// ── controprova: un blocco scaduto SENZA chiusura fa fallire il controllo ──
test("controprova · un blocco scaduto senza chiusura viene visto (altrimenti questo controllo mentirebbe sempre zero)", () => {
  const finto = { nome: "finto.md", comando: 'grep -c "x" apps/deepwork-id/tests/prove-grep-scadute.mjs',
    claimed: { "apps/deepwork-id/tests/prove-grep-scadute.mjs": 999999 }, chiuso: false };
  const attuale = eseguiGrep(comandoSicuro(finto.comando));
  const scaduti = Object.entries(finto.claimed).filter(([f, n]) => attuale[f] !== n);
  ok(scaduti.length > 0, "il finto claim da 999999 deve risultare scaduto — se no il confronto è rotto");
});

// ── controprova: la stessa uscita, dichiarata CHIUSA, non fa fallire niente ──
test("controprova · un blocco scaduto MA chiuso non conta come un difetto (è la forma di questo file stesso, qui sopra)", () => {
  const testoFinto = '$ grep -c "x" apps/deepwork-id/tests/prove-grep-scadute.mjs\n'
    + 'apps/deepwork-id/tests/prove-grep-scadute.mjs:999999\n\n✅ 16/09 — CHIUSO nella prova stessa.\n\n## sezione dopo\n';
  const b = estraiBlocchi(testoFinto)[0];
  const prossimaSezione = testoFinto.indexOf("\n## ", b.fine);
  const finestra = testoFinto.slice(b.fine, prossimaSezione === -1 ? testoFinto.length : prossimaSezione);
  ok(CHIUSURA.test(finestra), "la finestra fra il blocco e la sezione dopo contiene la chiusura");
});

const fuoriPerimetro = risultati.filter((r) => r.fuoriPerimetro).length;
const verificabili = risultati.length - fuoriPerimetro;
const scaduti = risultati.filter((r) => !r.fuoriPerimetro && r.scaduti.length);
const chiusiScaduti = scaduti.filter((r) => r.chiuso).length;
console.log(`\nRisultato prove grep scadute: ${passed} passati, ${failed} falliti`
  + `  ·  ${file.length} documenti letti, ${verificabili} blocchi \`grep\` verificabili (${fuoriPerimetro} fuori perimetro: comando non nell'allowlist)`
  + `  ·  ${scaduti.length} scaduti (${chiusiScaduti} già chiusi con una nota, ${scaduti.length - chiusiScaduti} da chiudere)`);
process.exit(failed ? 1 : 0);

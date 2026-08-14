/* IL GIRO GIRA SU UNA COPIA — la prova che la copia è davvero scollegata.
   ────────────────────────────────────────────────────────────────────────
   Uso: node giro-su-copia.mjs

   PERCHÉ ESISTE. Prima il giro serviva la cartella VIVA, e per un'ora e mezza
   nessuno poteva toccarla: `impronta.mjs` proteggeva il risultato FERMANDO IL
   LAVORO. È una difesa, non una soluzione — e una regola che chiede di non
   lavorare per due ore viene violata: è già successo due volte in due giorni,
   la seconda dal cantiere che il giorno prima aveva scritto il paragrafo.

   Adesso `tutti.mjs` crea una `git worktree` temporanea e serve quella. Qui si
   prova che il meccanismo fa quello che promette, e le due proprietà sono
   OPPOSTE fra loro — è per questo che vanno provate tutt'e due:

   1. la copia NON risente di una modifica alla cartella viva (è il motivo per
      cui esiste: il cantiere può continuare a lavorare);
   2. i file NON committati vengono visti, per poterli DICHIARARE — perché una
      worktree su HEAD contiene il committato, e senza quell'avviso il giro
      uscirebbe VERDE su una versione che su disco non esiste. Sarebbe il
      difetto che questo progetto insegue da settimane, prodotto proprio dallo
      strumento che dovrebbe garantirlo.

   Non apre nessun browser: prova il meccanismo, non le pagine. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..", "..");

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x)}` : ""}`); } };

const dove = join(R, "..", "prova-copia-" + process.pid);
if (existsSync(dove)) rmSync(dove, { recursive: true, force: true });
execFileSync("git", ["worktree", "add", "--detach", dove, "HEAD"], { cwd: R, stdio: "ignore" });
try {
  /* si tocca un file che le PAGINE caricano: è quello che l'impronta sorveglia
     e quello su cui la vecchia regola vietava di lavorare */
  const f = "apps/conti/conti-data.js";
  const nellaCopia = readFileSync(join(dove, f), "utf8");
  dice(nellaCopia.length > 1000, "la copia contiene davvero il codice", nellaCopia.length);

  const vivoPrima = readFileSync(join(R, f), "utf8");
  try {
    writeFileSync(join(R, f), vivoPrima + "\n// il cantiere lavora mentre il giro gira\n");
    dice(readFileSync(join(dove, f), "utf8") === nellaCopia,
      "⛔ la copia NON cambia quando cambia la cartella viva: il cantiere può lavorare");
  } finally { writeFileSync(join(R, f), vivoPrima); }   // si rimette com'era, sempre

  const spia = join(R, "docs", "_prova_non_committato.md");
  try {
    writeFileSync(spia, "prova\n");
    const sporchi = execFileSync("git", ["status", "--porcelain"], { cwd: R, encoding: "utf8" })
      .split("\n").map((r) => r.slice(3).trim()).filter(Boolean);
    dice(sporchi.some((x) => x.includes("_prova_non_committato")),
      "⛔ e i file non committati si vedono, per poterli DICHIARARE", sporchi.slice(0, 3));
  } finally { rmSync(spia, { force: true }); }
} finally {
  try { execFileSync("git", ["worktree", "remove", "--force", dove], { cwd: R, stdio: "ignore" }); }
  catch (e) { rmSync(dove, { recursive: true, force: true }); }
}

/* ══ 3. LA COPIA DICE DI CHE COMMIT È — ANCHE UN'ORA DOPO ═══════════════════
   Il giro dura più di un'ora, e nel frattempo si continua a committare: è
   ESATTAMENTE il motivo per cui la copia esiste. Ma il riepilogo in fondo
   rileggeva il hash da HEAD della cartella VIVA, che intanto era andata avanti
   di 12 commit: dichiarava di aver provato codice che non aveva mai visto, e la
   riga dopo aggiungeva «la copia è identica a quello che hai su disco».
   Un verde intestato al commit sbagliato è peggio di nessun verde: dice che
   sono state provate proprio le modifiche che non sono entrate.

   Qui la deriva si costruisce senza toccare il repository: la copia si prende
   a HEAD~3, così la viva è avanti di 3 per costruzione. */
{
  const vecchio = execFileSync("git", ["rev-parse", "--short", "HEAD~3"], { cwd: R, encoding: "utf8" }).trim();
  const dove2 = join(R, "..", "prova-deriva-" + process.pid);
  if (existsSync(dove2)) rmSync(dove2, { recursive: true, force: true });
  execFileSync("git", ["worktree", "add", "--detach", dove2, vecchio], { cwd: R, stdio: "ignore" });
  try {
    const hashDi = (d) => execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: d, encoding: "utf8" }).trim();
    const preso = hashDi(dove2), vivo = hashDi(R);
    dice(preso === vecchio, "il hash si prende dalla COPIA, non dalla cartella viva", { preso, vivo });
    dice(preso !== vivo, "⛔ e i due sono DIVERSI: è il caso che il vecchio codice non sapeva vedere");

    const avanti = +execFileSync("git", ["rev-list", "--count", `${preso}..HEAD`], { cwd: R, encoding: "utf8" }).trim();
    dice(avanti === 3, "la deriva si misura: la viva è avanti di 3 commit", avanti);

    /* la controprova: il codice di PRIMA, che rileggeva HEAD dalla viva */
    dice(hashDi(R) !== preso,
      "⛔ controprova: rileggendo HEAD dalla viva si sarebbe intestato il verde a un altro commit");
  } finally {
    try { execFileSync("git", ["worktree", "remove", "--force", dove2], { cwd: R, stdio: "ignore" }); }
    catch (e) { rmSync(dove2, { recursive: true, force: true }); }
  }
}

/* e il difetto va cercato anche NEL FILE: la misura qui sopra prova che git sa
   rispondere, non che `tutti.mjs` glielo chieda nel modo giusto */
{
  const t = readFileSync(join(QUI, "tutti.mjs"), "utf8");
  const inFondo = t.slice(t.indexOf("RIEPILOGO"));
  dice(/dichiaraSuCosaGira\(true\)/.test(inFondo),
    "⛔ e in fondo il giro dichiara sapendo di essere in fondo (il hash non si rilegge)");
  dice(!/COMMIT_COPIA\s*=\s*hashDi\(RADICE\)/.test(t),
    "il commit della copia non viene mai preso dalla cartella viva");
}

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);

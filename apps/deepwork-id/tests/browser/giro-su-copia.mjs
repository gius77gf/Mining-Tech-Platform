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

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);

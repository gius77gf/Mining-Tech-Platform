/* CONTROPROVA DELLA GUARDIA MONTATA SUL GIRO — `node impronta-giro.mjs`.
   ────────────────────────────────────────────────────────────────────────
   `impronta.mjs --controprova` dimostra che il RILEVATORE sa accorgersi di un
   file cambiato. Non dimostra che `tutti.mjs` lo **usi**, né che il verdetto
   arrivi fino all'uscita del processo — ed è esattamente lì che il difetto è
   passato due volte: non nella regola, nel fatto che nessuno la applicava.
   `CLAUDE.md` lo scrive in un'altra pagina: *togliere le funzioni dimenticando
   il `<script>` non è un errore di sintassi*. Una guardia scollegata non lo è
   nemmeno lei.

   Come si prova senza toccare il repository — che è il gesto che tutta questa
   unità esiste per impedire: si dà a `tutti.mjs` una **radice d'impronta
   finta** (una cartella temporanea con dentro finte pagine) e tre **banchi
   finti** che dormono mezzo secondo. Mentre girano, si modifica un file nella
   cartella temporanea. Il giro deve uscire con **2** e dire NON VALIDO.

   E si prova anche il verso opposto, che conta quanto l'altro: senza modifiche
   il giro finto deve uscire con **0**. Una guardia che dichiara sempre invalido
   è inutile quanto una che non dichiara mai. */
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const PORTA = process.argv[2] || "8823";

function radiceFinta() {
  const b = mkdtempSync(join(tmpdir(), "giro-impronta-"));
  mkdirSync(join(b, "apps", "terra"), { recursive: true });
  writeFileSync(join(b, "index.html"), "<h1>core</h1>");
  writeFileSync(join(b, "apps", "terra", "index.html"), "<h1>terra</h1>");
  writeFileSync(join(b, "apps", "terra", "terra-data.js"), "export const a = 1;\n");
  return b;
}

/* Lancia il giro finto. `tocca` viene chiamata mentre gira: è il momento in cui
   qualcuno modifica un modulo dati senza accorgersi che c'è un giro in corso. */
function giro(radice, tocca) {
  return new Promise((ok) => {
    let uscita = "";
    const p = spawn(process.execPath,
      [join(QUI, "tutti.mjs"), PORTA, "--banchi-finti", `--radice-impronta=${radice}`],
      { stdio: ["ignore", "pipe", "pipe"] });
    p.stdout.on("data", (d) => { uscita += d; });
    p.stderr.on("data", (d) => { uscita += d; });
    if (tocca) setTimeout(tocca, 1400);   // dentro il secondo banco finto
    p.on("close", (codice) => ok({ codice, uscita }));
  });
}

let ok = 0, ko = 0;
const dice = (buono, t, extra) => { if (buono) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${extra !== undefined ? `\n        -> ${JSON.stringify(String(extra).slice(0, 400))}` : ""}`); } };

console.log("\n════════ la guardia è davvero montata sul giro? ════════");

/* 1 — nessuno tocca niente: il giro deve finire pulito */
const pulita = radiceFinta();
const a = await giro(pulita, null);
dice(a.codice === 0, "senza modifiche il giro finto esce con 0", a.uscita);
dice(/Impronta di partenza: 3 file/.test(a.uscita), "e dichiara quanti file sta sorvegliando", a.uscita);
dice(!/NON VALIDO/.test(a.uscita), "e non grida al lupo", a.uscita);
rmSync(pulita, { recursive: true, force: true });

/* 2 — un modulo dati cambia MENTRE gira: il giro deve dichiararsi non valido */
const sporca = radiceFinta();
const b = await giro(sporca, () => writeFileSync(join(sporca, "apps", "terra", "terra-data.js"), "export const a = 2;\n"));
dice(b.codice === 2, "col codice cambiato sotto, il giro esce con 2", `codice ${b.codice}`);
dice(/GIRO NON VALIDO/.test(b.uscita), "e lo dice a chiare lettere", b.uscita);
dice(/terra-data\.js/.test(b.uscita), "e nomina il file cambiato", b.uscita);
dice(/Hanno misurato il codice giusto solo i primi \d+ banchi/.test(b.uscita),
  "e dice quanti banchi sono ancora buoni", b.uscita);
rmSync(sporca, { recursive: true, force: true });

console.log(`\n${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);

/* ⛔ IL LIMITE DI TEMPO DEL GIRO, E LA PROVA CHE È COLLEGATO.
   ══════════════════════════════════════════════════════════════════════════
   L'08/08 un giro del browser è rimasto appeso **sette ore e trentasette
   minuti**: `uno-solo.mjs --controprova` non è mai finito, e `tutti.mjs`
   aspettava con `p.on('close', …)`, che non ha limite. Il danno vero non è il
   tempo perso — è che il registro **si tronca a metà di una sezione e sembra
   completo**: chi lo apre legge le passate fatte, non vede nessun errore, e
   crede di avere davanti il verdetto di tutto il giro. Le passate mai
   eseguite non compaiono in nessuna riga: **spariscono invece di
   dichiararsi**. È la famiglia del banco che crolla e dichiara meno prove, in
   una veste peggiore, perché qui non crolla nemmeno: tace.

   Adesso `tutti.mjs` ha un limite per passata (`--limite=<secondi>`, 30 minuti
   di default). Quando scatta: uccide l'albero del processo, DICE che quella
   passata non è stata misurata, tira avanti, e alla fine la conta a parte —
   perché **un soggetto non misurato non è un soggetto a posto**.

   ⛔ E UNA GUARDIA SCOLLEGATA NON È UN ERRORE DI SINTASSI: si vede solo
   provandola. Questo file lancia un giro FINTO con un banco che non finisce
   mai e pretende, nei DUE versi:
     · col banco appeso → il giro deve dire «NON MISURATE», nominarla, e uscire
       diverso da zero;
     · senza il banco appeso → nessuna di quelle righe, e uscita zero.
   Una guardia che scatta SEMPRE passerebbe il primo verso e renderebbe il giro
   impossibile da usare.

   Uso:  node apps/deepwork-id/tests/browser/limite-giro.mjs                */

import { execFile } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";

const QUI = dirname(fileURLToPath(import.meta.url));

/* una radice finta per l'impronta: il giro finto non deve leggere il vero
   albero, se no un cantiere aperto lo farebbe dichiarare NON VALIDO */
const radice = mkdtempSync(join(tmpdir(), "limite-giro-"));
mkdirSync(join(radice, "shared"), { recursive: true });
writeFileSync(join(radice, "index.html"), "<!doctype html><p>finta</p>");

function giro(extra) {
  return new Promise((ok) => {
    execFile(process.execPath,
      [join(QUI, "tutti.mjs"), "8999", "--banchi-finti", `--radice-impronta=${radice}`, ...extra],
      { encoding: "utf8", timeout: 120000 },
      (err, stdout, stderr) => ok({ codice: err ? (err.code ?? 1) : 0, testo: (stdout || "") + (stderr || "") }));
  });
}

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ✓ ${t}`); } else { ko++; console.log(`  ✗ ${t}${x !== undefined ? `: ${x}` : ""}`); } };

console.log("\n── Il limite per passata: c'è, dichiara, e non scatta a vuoto ──");

/* verso 1: col banco appeso, e un limite di 3 secondi */
const appeso = await giro(["--banchi-finti-appeso", "--limite=3"]);
dice(/NON HA FINITO in/.test(appeso.testo), "col banco appeso il giro lo DICE mentre gira", appeso.testo.slice(-300));
dice(/NON È STATA MISURATA/.test(appeso.testo), "e dice che quella passata non è stata misurata");
dice(/passate NON MISURATE/.test(appeso.testo), "e la conta a parte nel riepilogo, non fra i KO");
dice(/finto appeso/.test(appeso.testo), "e la nomina");
dice(appeso.codice !== 0, `e il giro NON si dichiara verde (uscita ${appeso.codice})`, appeso.codice);
/* le altre tre passate finte devono essere arrivate in fondo: un limite che
   uccide tutto sarebbe inutile quanto uno che non uccide niente */
dice(/finto 1/.test(appeso.testo) && /finto 3/.test(appeso.testo),
  "e le altre passate sono girate lo stesso: il giro TIRA AVANTI invece di fermarsi");

/* verso 2: senza il banco appeso, il limite non deve dire niente */
const sano = await giro(["--limite=60"]);
dice(!/NON HA FINITO in/.test(sano.testo) && !/NON MISURATE/.test(sano.testo),
  "senza il banco appeso non compare nessuna riga del limite", sano.testo.slice(-200));
dice(sano.codice === 0, `e il giro finto sano esce zero (uscita ${sano.codice})`, sano.codice);

/* e la riga delle tre passate più lente, che serve a sapere se il limite è
   ancora tarato bene: se sparisse, nessuno saprebbe più quanto costa un giro */
dice(/le tre passate più lente/.test(sano.testo), "il giro dichiara le sue passate più lente");

console.log(`\nRisultato limite del giro: ${ok} passati, ${ko} falliti`
  + `  ·  2 giri finti (uno con un banco che non finisce mai, uno senza)`);
process.exit(ko > 0 ? 1 : 0);

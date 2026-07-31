// ============================================================
// LO STESSO NOME ESPORTATO DA DUE APP: È UN ALIAS O UNA COPIA?
//
// `CLAUDE.md` lo dice da mesi: «una regola che serve a due app vive in
// `shared/`, e il modulo dell'app la RI-ESPORTA — un alias non è una
// seconda implementazione». Era una regola scritta, cioè affidata alla
// memoria di chi legge. Il 02/08 ne sono uscite CINQUE violazioni in un
// giorno, tutte trovate per caso mentre si scrivevano altre prove.
//
// Questo controllo la rende verificabile. Per ogni nome esportato da più
// di un modulo dati:
//   · se le due cose sono lo STESSO oggetto → è un alias, va bene;
//   · altrimenti deve stare nell'elenco `DIVERSE_PER_MESTIERE` **con
//     scritta la ragione**. Un'eccezione dichiarata si può discutere; una
//     eccezione ricordata no.
//
// ⚠️ Le COSTANTI DI TESTO non si controllano così: due stringhe uguali
// scritte in due file sono `===` lo stesso, e il controllo direbbe «alias»
// su due copie vere. Per quelle si guarda il SORGENTE — quante volte la
// stessa frase è dichiarata con `export const … = "…"`.
//
// Si lancia con:
//   node apps/deepwork-id/tests/nomi-doppi.mjs
// ============================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

/* Nomi uguali che sono cose diverse, con la ragione scritta. Non sono
   scuse: sono decisioni. Se una di queste smettesse di essere vera, il
   posto giusto è `shared/` e questa riga va tolta. */
const DIVERSE_PER_MESTIERE = {
  DEMO: "l'archivio di prova di ogni app: parla dei suoi dati, non di una regola",
  kpiFrom: "i numeri di testa di ogni app sono numeri diversi, non lo stesso conto",
  numeroDaCampo:
    "ognuna passa a `numeroScritto` i decimali del proprio mestiere (2 per i soldi, "
    + "3 per i chili, 4 per la PPV): è UNA implementazione condivisa con un parametro diverso",
  numeroIt:
    "due convenzioni di lettura dichiarate: Sentinella scrive «—» sul dato che manca "
    + "(in un rapporto per l'ente il trattino dice «non misurato») e arrotonda all'unità "
    + "da cento in su; Campo scrive vuoto e non arrotonda. "
    + "Vedi docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md",
  CAUSALI_FERMO:
    "in Campo è il motivo per cui si è fermata un'ATTIVITÀ di turno (testo semplice), "
    + "in Flotta il motivo per cui una MACCHINA è fuori servizio (voci con chiave, "
    + "perché ci si calcola sopra la disponibilità)",
};

/* Frasi fisse che devono essere dichiarate in UN posto solo. Qui si conta
   sul sorgente, perché due stringhe uguali sono `===` anche quando sono
   due copie. */
const FRASI_UNICHE = ["AVVISO_DECIMALE", "AVVISO_MIGLIAIA"];

let failed = 0, guardati = 0, alias = 0, dichiarati = 0;
const dice = (ok, s) => { console.log(`  ${ok ? "✓" : "✗"} ${s}`); if (!ok) failed++; };

const mod = {};
for (const a of APP) mod[a] = await import(join(RADICE, "apps", a, `${a}-data.js`));

const per = {};
for (const a of APP) for (const n of Object.keys(mod[a])) (per[n] = per[n] || []).push(a);

console.log("\n— Nomi esportati da più di un modulo dati —");
for (const [nome, app] of Object.entries(per).sort()) {
  if (app.length < 2) continue;
  guardati++;
  const valori = app.map((a) => mod[a][nome]);
  const stesso = valori.every((v) => v === valori[0]);
  const tipoFunzione = typeof valori[0] === "function";
  if (stesso && tipoFunzione) { alias++; dice(true, `${nome}: alias unico (${app.join(", ")})`); continue; }
  if (stesso && !tipoFunzione) {
    /* uguali per valore: per le costanti non dimostra niente, si guarda dopo */
    dice(true, `${nome}: stesso valore in ${app.join(", ")} — se è una frase fissa la controlla il blocco qui sotto`);
    continue;
  }
  if (DIVERSE_PER_MESTIERE[nome]) {
    dichiarati++;
    dice(true, `${nome}: diverse di proposito (${app.join(", ")}) — ${DIVERSE_PER_MESTIERE[nome]}`);
    continue;
  }
  dice(false, `${nome}: DUE IMPLEMENTAZIONI (${app.join(", ")}) e nessuna ragione dichiarata`
    + " — o diventa un alias di shared/, o va scritta la ragione in nomi-doppi.mjs");
}

console.log("\n— Frasi fisse dichiarate più di una volta nel sorgente —");
for (const nome of FRASI_UNICHE) {
  const dove = [];
  for (const a of APP) {
    const src = readFileSync(join(RADICE, "apps", a, `${a}-data.js`), "utf8");
    if (new RegExp(`export const ${nome} =\\s*\\n?\\s*"`).test(src)) dove.push(a);
  }
  guardati++;
  dice(dove.length === 0, dove.length === 0
    ? `${nome}: nessuna app la ridichiara, arriva tutta dallo stesso posto`
    : `${nome}: RIDICHIARATA alla lettera in ${dove.length} modul${dove.length === 1 ? "o" : "i"}`
      + ` (${dove.join(", ")}) — la frase vive nello shell e va RI-ESPORTATA, non riscritta`
      + `${dove.length === 1 ? " (anche una copia sola è una copia: è quella che si stacca)" : ""}`);
}

console.log(`\nRisultato nomi doppi: ${guardati} nomi guardati`
  + `  ·  ${alias} alias, ${dichiarati} divergenze dichiarate, ${failed} da sistemare`);
process.exit(failed > 0 ? 1 : 0);

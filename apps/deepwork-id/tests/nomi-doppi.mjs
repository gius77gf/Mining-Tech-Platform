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
    "in Campo è il motivo per cui si è fermata un'ATTIVITÀ di turno, in Flotta il "
    + "motivo per cui una MACCHINA è fuori servizio: due tassonomie di soggetti diversi. "
    + "Dal 03/09 hanno la stessa FORMA ({chiave, etichetta}) — Campo l'ha presa da "
    + "Flotta perché l'etichetta come chiave orfanava lo storico a ogni rinomina — "
    + "ma le voci restano diverse per mestiere",
  etichettaCausale:
    "la stessa domanda (la parola per una chiave) su due elenchi diversi per mestiere: "
    + "quello delle attività di Campo e quello delle macchine di Flotta. Diventerebbe "
    + "una funzione di shared/ il giorno in cui gli elenchi fossero uno",
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

/* ⚠️ E IL CONTROLLO GUARDAVA SOLO METÀ DELLE COPPIE.
   Fino al 03/08 questo file confrontava le app **fra loro**: due app che
   esportano lo stesso nome. Ma il posto della regola condivisa è `shared/`,
   e la coppia più facile da sbagliare è proprio **app contro shared** — una
   app che si riscrive in casa una funzione che nello shell c'è già. Quella
   forma non veniva guardata da nessuno.
   Trovata appena aggiunto il confronto: `perCampo` di Flotta era **identica
   carattere per carattere** a quella di `dw-shell.js`, e nessuno dei due
   controlli poteva accorgersene — l'app-contro-app perché Flotta è l'unica
   app che la esporta, questo perché non esisteva.
   È la stessa lezione di CLAUDE.md, ancora: il filtro che esclude proprio i
   casi che contano risponde «pulito» senza aver guardato niente. */
const SHARED = ["shared/deepwork-id-client/dw-shell.js", "shared/dw-ponti.js"];
const dichiaratiIn = (src) =>
  new Set([...src.matchAll(/^export (?:async )?function (\w+)|^export const (\w+)\s*=/gm)].map((m) => m[1] || m[2]));
/* Un ri-export si riconosce dalla forma: `export const X = X_SHELL;` oppure
   `export { X }`. Chi INVECE ridichiara il corpo — `export function X(` — sta
   riscrivendo, ed è quello che qui si vuole vedere. */
const riscriveInCasa = (src, nome) =>
  new RegExp(`^export (?:async )?function ${nome}\\s*\\(`, "m").test(src);

console.log("\n— Nomi che un'app riscrive in casa, ma in `shared/` ci sono già —");
const nelloShared = new Map();
for (const rel of SHARED) {
  for (const n of dichiaratiIn(readFileSync(join(RADICE, rel), "utf8"))) nelloShared.set(n, rel);
}
let coppieAppShared = 0;
for (const a of APP) {
  const src = readFileSync(join(RADICE, "apps", a, `${a}-data.js`), "utf8");
  for (const n of dichiaratiIn(src)) {
    if (!nelloShared.has(n)) continue;
    coppieAppShared++;
    guardati++;
    const dove = nelloShared.get(n).split("/").pop();
    if (!riscriveInCasa(src, n)) { alias++; dice(true, `${a}.${n}: ri-esporta quella di ${dove}`); continue; }
    dice(false, `${a}.${n}: RISCRITTA IN CASA, ma ${dove} ce l'ha già`
      + " — va importata e ri-esportata, che è la regola vincolante di CLAUDE.md");
  }
}
/* Quante coppie ha davvero guardato: un «zero violazioni» ottenuto su zero
   coppie è il difetto raccolto tre volte in CLAUDE.md. */
dice(coppieAppShared >= 8,
  `${coppieAppShared} nomi condivisi fra le app e shared/ sono stati confrontati`
  + (coppieAppShared < 8 ? " — troppo pochi: il confronto non sta guardando niente" : ""));
guardati++;

console.log(`\nRisultato nomi doppi: ${guardati} nomi guardati`
  + `  ·  ${alias} alias, ${dichiarati} divergenze dichiarate, ${failed} da sistemare`);
process.exit(failed > 0 ? 1 : 0);

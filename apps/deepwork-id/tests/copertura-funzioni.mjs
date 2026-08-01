// ============================================================
// QUANTE FUNZIONI DELLE APP SONO DAVVERO PROVATE?
//
// Per due giorni questo numero è stato contato a mano, un comando alla
// volta, e si è già visto cosa succede: un checkpoint ha scritto «Scudo
// 35/71» quando erano 30, e un messaggio di commit «Sentinella 94/107»
// quando erano 89. Un numero ricordato invecchia; un numero contato da un
// programma no.
//
// Cosa fa: legge gli `export` di ogni `apps/<nome>/<nome>-data.js` e
// guarda quali compaiono in `run-kpi.mjs` nella forma `app.<nome>`.
// È la stessa conta che si faceva a mano, e ha lo stesso limite dichiarato:
// vede se una funzione è CHIAMATA per nome, non se è provata bene. Serve a
// non perdere di vista quello che nessuno ha ancora guardato.
//
// ⚠️ IL FONDO NON FACEVA QUELLO CHE C'ERA SCRITTO QUI. Fino al 03/08 questa
// riga diceva: «se una app ci scende sotto, vuol dire che sono state aggiunte
// funzioni senza prove». **Falso**, e misurato: aggiungendo a Terra un
// `export function funzioneMaiProvata` la conta passa a **40/41, 98%** — e il
// controllo esce **0**, «9 sopra il fondo, 0 sotto». Il fondo sta sul numero
// di funzioni COPERTE, che aggiungendo codice non provato non scende: cattura
// le prove TOLTE, non il codice aggiunto senza prove. Cioè proprio il caso che
// la riga prometteva, e nella direzione che rassicura.
// Adesso ci sono DUE regole, e la prima è quella vera:
//   1. NESSUNA funzione scoperta. Tutte e sei le app e tutti e tre i moduli
//      condivisi sono al 100%: il fondo era una scala mentre si saliva, e una
//      volta in cima la regola giusta è «non se ne lascia indietro nessuna».
//      Chi aggiunge una funzione aggiunge la sua prova, o la dichiara in FUORI
//      con la ragione scritta.
//   2. il FONDO resta come seconda guardia, per il caso in cui il 100% non sia
//      raggiungibile e vada abbassato di proposito: allora almeno il numero
//      non può scendere di nascosto.
//
// Si lancia con:
//   node apps/deepwork-id/tests/copertura-funzioni.mjs
//   node apps/deepwork-id/tests/copertura-funzioni.mjs --elenco   (dice anche QUALI mancano)
// ============================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const ELENCO = process.argv.includes("--elenco");

const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

/* Il fondo per app. Si alza quando si aggiungono prove, non si abbassa mai
   per far passare il controllo: abbassarlo è esattamente il gesto che
   questo file esiste per rendere visibile. */
const FONDO = { campo: 79, conti: 74, flotta: 74, scudo: 79, sentinella: 102, terra: 48 };

/* Quello che resta fuori per un motivo, non per dimenticanza: i caricatori
   dati vogliono la rete e lo SDK, i ponti demo vogliono il localStorage.
   Stanno qui perché un elenco di eccezioni scritto è controllabile; una
   eccezione ricordata no. */
const FUORI = new Set([
  "campoData", "contiData", "flottaData", "scudoData", "sentinellaData", "terraData",
  "ponteScudo", "ponteDemoLeggi", "ponteDemoScrivi", "PONTE_DEMO_KEY",
]);

const kpi = readFileSync(join(QUI, "run-kpi.mjs"), "utf8");

let passed = 0, failed = 0, guardate = 0, coperte = 0;
const righe = [];

for (const app of APP) {
  const src = readFileSync(join(RADICE, "apps", app, `${app}-data.js`), "utf8");
  const esporta = [...src.matchAll(/^export (?:async )?function (\w+)|^export const (\w+)/gm)]
    .map((m) => m[1] || m[2])
    .filter((n) => !FUORI.has(n));
  const usate = esporta.filter((n) => new RegExp(`\\b${app}\\.${n}\\b`).test(kpi));
  const mancanti = esporta.filter((n) => !usate.includes(n));
  guardate += esporta.length;
  coperte += usate.length;

  const fondo = FONDO[app] || 0;
  const sopraFondo = usate.length >= fondo;
  const tutte = mancanti.length === 0;          // la regola vera, dal 03/08
  const ok = sopraFondo && tutte;
  if (ok) { passed++; } else { failed++; }
  righe.push(`  ${ok ? "✓" : "✗"} ${app.padEnd(11)} ${String(usate.length).padStart(3)}/${String(esporta.length).padEnd(3)}`
    + ` ${String(Math.round(100 * usate.length / (esporta.length || 1))).padStart(3)}%`
    + (sopraFondo ? (usate.length > fondo ? `  (il fondo era ${fondo}: alzalo)` : "") : `  SOTTO IL FONDO DI ${fondo}`)
    + (tutte ? "" : `  ${mancanti.length} SENZA PROVA: ${mancanti.join(", ")}`)
    + (ELENCO && mancanti.length ? `\n      scoperte: ${mancanti.join(", ")}` : ""));
}

console.log("\nCopertura delle funzioni pure, app per app");
console.log("(contata leggendo gli export e cercando `app.<nome>` in run-kpi.mjs)\n");
console.log(righe.join("\n"));
console.log(`\n${coperte} funzioni coperte su ${guardate} guardate, in ${APP.length} app`
  + `  ·  ${FUORI.size} tenute fuori di proposito (rete o localStorage)`);

/* ── E IL CODICE CONDIVISO? ───────────────────────────────────────────
   Questo censimento si chiama «quante funzioni delle APP sono provate», e
   fino al 03/08 guardava solo `apps/<nome>/<nome>-data.js`. Ma la regola
   vincolante dice che ciò che serve a due app vive in `shared/` — cioè il
   codice più delicato di tutti finiva **fuori dal conto**, e una funzione
   nuova aggiunta lì non avrebbe fatto scendere nessun numero.
   Misurato prima di allarmarsi, che è l'altra regola: la copertura vera è
   **alta** (18/19 su dw-ponti, 23/27 su dw-shell, 5/6 su pointcloud). Non
   c'era un buco nel prodotto; c'era un buco nel CONTROLLO, che diceva
   «tutto a posto» su un perimetro più stretto del suo nome. Adesso il
   perimetro è dichiarato, con il suo fondo. */
const CONDIVISI = [
  { file: "shared/dw-ponti.js", fondo: 21,
    perche: "le regole che servono a DUE app: è il posto dove un difetto si moltiplica" },
  { file: "shared/deepwork-id-client/dw-shell.js", fondo: 25,
    perche: "gli aiuti che tutte le app importano (numeri, date, CSV)" },
  { file: "apps/genesi/pointcloud.js", fondo: 5,
    perche: "il calcolo del volume dal drone: da lì passano i m³ che consumano la concessione" },
];
/* Fuori per un motivo, non per dimenticanza. Le prime tre toccano il DOM o
   l'orologio e vivono nei banchi del browser (`tests/browser/`), non in
   Node; le ultime due sono costanti, e una costante non si «prova». */
const FUORI_CONDIVISI = new Map([
  ["montaGuardiaInteri", "tocca il DOM — provata in browser/interi-superfici.mjs"],
  ["mountExit", "tocca il DOM — provata dai banchi del browser"],
  ["timbroLocale", "legge l'orologio — provata in browser/"],
  ["interoScritto", "tocca il DOM — provata in browser/interi-superfici.mjs"],
  ["ESITI_TURNO", "è una costante: non ha comportamento da provare"],
  ["MAXPTS", "è una costante: non ha comportamento da provare"],
]);

const suite = ["run-kpi.mjs", "run-helpers.mjs", "run-pointcloud.mjs"]
  .map((f) => readFileSync(join(QUI, f), "utf8")).join("\n");

const righeC = [];
let guardateC = 0, coperteC = 0;
for (const c of CONDIVISI) {
  const src = readFileSync(join(RADICE, c.file), "utf8");
  const esporta = [...src.matchAll(/^export (?:async )?function (\w+)|^export const (\w+)/gm)]
    .map((m) => m[1] || m[2])
    .filter((n) => !FUORI_CONDIVISI.has(n));
  const usate = esporta.filter((n) => new RegExp(`\\b${n}\\b`).test(suite));
  const mancanti = esporta.filter((n) => !usate.includes(n));
  guardateC += esporta.length; coperteC += usate.length;
  const sopraFondo = usate.length >= c.fondo;
  const tutte = mancanti.length === 0;
  const ok = sopraFondo && tutte;
  if (ok) { passed++; } else { failed++; }
  const nome = c.file.replace(/^.*\//, "");
  righeC.push(`  ${ok ? "✓" : "✗"} ${nome.padEnd(20)} ${String(usate.length).padStart(3)}/${String(esporta.length).padEnd(3)}`
    + (sopraFondo ? (usate.length > c.fondo ? `  (il fondo era ${c.fondo}: alzalo)` : "") : `  SOTTO IL FONDO DI ${c.fondo}`)
    + (tutte ? "" : `  ${mancanti.length} SENZA PROVA: ${mancanti.join(", ")}`)
    + (ELENCO ? `\n      ${c.perche}` : "")
    + (ELENCO && mancanti.length ? `\n      scoperte: ${mancanti.join(", ")}` : ""));
}
console.log("\nE il codice CONDIVISO, che nessuna app possiede e tutte usano");
console.log("(export cercati per nome in run-kpi + run-helpers + run-pointcloud)\n");
console.log(righeC.join("\n"));
console.log(`\n${coperteC} funzioni condivise coperte su ${guardateC} guardate, in ${CONDIVISI.length} moduli`
  + `  ·  ${FUORI_CONDIVISI.size} tenute fuori con la ragione scritta`);

console.log(`\nRisultato copertura: ${passed} soggetti a posto, ${failed} con funzioni senza prova`
  + ` (o sotto il fondo)  ·  ${APP.length} app + ${CONDIVISI.length} moduli condivisi`);
process.exit(failed > 0 ? 1 : 0);

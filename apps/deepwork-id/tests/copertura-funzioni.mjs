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
// La SOGLIA non è un traguardo: è un fondo. Se una app ci scende sotto,
// vuol dire che sono state aggiunte funzioni senza prove — e allora questo
// controllo fallisce e lo dice, invece di lasciarlo scoprire fra un mese.
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
const FONDO = { campo: 72, conti: 60, flotta: 70, scudo: 70, sentinella: 102, terra: 40 };

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
  const ok = usate.length >= fondo;
  if (ok) { passed++; } else { failed++; }
  righe.push(`  ${ok ? "✓" : "✗"} ${app.padEnd(11)} ${String(usate.length).padStart(3)}/${String(esporta.length).padEnd(3)}`
    + ` ${String(Math.round(100 * usate.length / (esporta.length || 1))).padStart(3)}%`
    + (ok ? (usate.length > fondo ? `  (il fondo era ${fondo}: alzalo)` : "") : `  SOTTO IL FONDO DI ${fondo}`)
    + (ELENCO && mancanti.length ? `\n      scoperte: ${mancanti.join(", ")}` : ""));
}

console.log("\nCopertura delle funzioni pure, app per app");
console.log("(contata leggendo gli export e cercando `app.<nome>` in run-kpi.mjs)\n");
console.log(righe.join("\n"));
console.log(`\n${coperte} funzioni coperte su ${guardate} guardate, in ${APP.length} app`
  + `  ·  ${FUORI.size} tenute fuori di proposito (rete o localStorage)`);
console.log(`Risultato copertura: ${passed} app sopra il fondo, ${failed} sotto`);
process.exit(failed > 0 ? 1 : 0);

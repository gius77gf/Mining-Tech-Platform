// ============================================================
// I NUMERI SCRITTI NEI DOCUMENTI SONO QUELLI VERI?
//
// Il 31/07 ho corretto a mano TRE conteggi invecchiati nei documenti del
// fondatore: «692 prove» quando erano 1.066, «662» in un altro posto, «17
// esecuzioni nel browser» quando erano 19. Nessuno se n'era accorto, perché un
// numero scritto in un documento non fallisce: sta lì e invecchia.
//
// È esattamente la categoria di difetto che questa giornata ha inseguito nel
// prodotto — una frase detta con sicurezza che non è più vera — e la risposta è
// la stessa: renderla verificabile invece di ricordarsela.
//
// Questo controllo LANCIA le suite (non conta i `test(` nel sorgente: molti
// stanno dentro cicli, e la conta statica dà 737 dove le prove eseguite sono
// 783) e confronta il totale con quello scritto nei documenti.
//
// Si lancia con:
//   node apps/deepwork-id/tests/numeri-nei-documenti.mjs
// ============================================================

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); }
};
const ok = (cond, perche) => { if (!cond) throw new Error(perche); };

// ── quante prove `node` girano davvero ────────────────────────────────
const SUITE = ["run-kpi.mjs", "run-stile.mjs", "run-helpers.mjs",
  "run-pointcloud.mjs", "run-manifest.mjs", "run-demo.mjs"];
let totale = 0;
const dettaglio = [];
for (const s of SUITE) {
  const r = spawnSync(process.execPath, [join(QUI, s)], { encoding: "utf8" });
  const m = /(\d+) passati, (\d+) falliti/.exec(String(r.stdout || ""));
  if (!m) { console.error(`  ✗ ${s}: non ha stampato un riepilogo leggibile`); failed++; continue; }
  if (+m[2] > 0) { console.error(`  ✗ ${s}: ${m[2]} prove fallite — il conteggio non ha senso finché non sono verdi`); failed++; }
  totale += +m[1];
  dettaglio.push(`${s.replace(".mjs", "")} ${m[1]}`);
}
console.log(`\nprove eseguite: ${totale}  (${dettaglio.join(", ")})\n`);

// ── quante esecuzioni apre il giro del browser ────────────────────────
const tutti = readFileSync(join(QUI, "browser", "tutti.mjs"), "utf8");
const blocco = /const BANCHI = \[([\s\S]*?)\n\];/.exec(tutti);
const banchi = blocco ? (blocco[1].match(/^\s*\[/gm) || []).length : 0;

// ── i documenti che dichiarano quei numeri ────────────────────────────
// Ognuno dice dove sta il numero e come si scrive: «1.066» col punto delle
// migliaia in un testo per il fondatore, «1066» dove serve la cifra secca.
const DOCUMENTI = [
  ["docs/DEVELOPMENT.md", /\*\*([\d.]+) prove girano senza rete/],
  ["docs/STATO_PRODOTTO.md", /\*\*([\d.]+)\*\* prove automatiche che girano senza rete/],
  ["docs/DECISIONI_WEEKEND.md", /prove automatiche sono passate a ([\d.]+)\*\*/],
];
const numero = (s) => +String(s).replace(/\./g, "");

let guardati = 0;
for (const [rel, regola] of DOCUMENTI) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  guardati++;
  test(`${rel}: il numero delle prove è quello vero`, () => {
    ok(m, `non trovo la frase col numero — se l'hai riscritta, aggiorna la regola in ${"numeri-nei-documenti.mjs"}`);
    ok(numero(m[1]) === totale,
      `il documento dice ${m[1]}, le suite ne eseguono ${totale}`);
  });
}

/* Quanti documenti ha guardato davvero: un «tutto a posto» ottenuto non
   leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
test("il controllo ha davvero letto tutti i documenti dell'elenco", () => {
  ok(guardati === DOCUMENTI.length, `letti ${guardati} su ${DOCUMENTI.length}`);
  ok(totale > 0, "nessuna prova contata: le suite non hanno risposto");
});

const BROWSER = [
  ["docs/DEVELOPMENT.md", /\*\*(\d+) esecuzioni che aprono davvero le pagine\*\*/],
  ["docs/STATO_PRODOTTO.md", /\*\*(\d+) esecuzioni\*\* che aprono davvero le\s+pagine/],
];
for (const [rel, regola] of BROWSER) {
  const testo = readFileSync(join(RADICE, rel), "utf8");
  const m = regola.exec(testo);
  test(`${rel}: il numero dei banchi del browser è quello vero`, () => {
    ok(banchi > 0, "non sono riuscito a contare le voci di tutti.mjs");
    ok(m, "non trovo la frase col numero delle esecuzioni nel browser");
    ok(+m[1] === banchi, `il documento dice ${m[1]}, tutti.mjs ne elenca ${banchi}`);
  });
}

console.log(`\nRisultato numeri nei documenti: ${passed} passati, ${failed} falliti`
  + `  ·  ${guardati} documenti letti, ${banchi} banchi contati`);
process.exit(failed > 0 ? 1 : 0);

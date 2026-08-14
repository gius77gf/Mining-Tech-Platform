// ============================================================
// LE PROVE, RILANCIATE CON L'OROLOGIO DEL CLIENTE.
//
// Il contenitore di sviluppo e il runner di CI sono in **UTC**. Le cave sono
// in **Italia**: UTC+1 d'inverno, UTC+2 d'estate. Un controllo che gira in un
// ambiente diverso da quello del cliente misura l'ambiente, non il prodotto.
//
// Il 31/07 è successo davvero: una controprova sul conto dei giorni rispondeva
// «non distingue» in UTC e vedeva il difetto in ora italiana; e la suite
// intera, rilanciata con l'orologio del cliente, è caduta in DUE punti che in
// UTC erano verdi (`ritmoMedioAnnuo` di Terra prendeva la mezzanotte locale e
// la scriveva in UTC, quindi l'estremo alto della finestra era IERI e il
// rilievo di oggi restava fuori dal conto che stima quando finisce il volume
// concesso). Vedi docs/RICERCA_GIORNO_LOCALE_202607.md.
//
// Questo runner rilancia le suite `node` sensibili al fuso con
// TZ=Europe/Rome. Non duplica prove: rilancia le stesse, in un ambiente in cui
// possono fallire diversamente. Si lancia con
//   node apps/deepwork-id/tests/orologio-cliente.mjs
// ============================================================

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const FUSO = "Europe/Rome";

// Solo le suite che eseguono codice di prodotto sensibile alla data. Le altre
// (stile, manifest, nuvola di punti) non guardano il calendario: rilanciarle
// costerebbe tempo senza guardare niente di nuovo.
const SUITE = ["run-kpi.mjs", "run-helpers.mjs", "run-demo.mjs"];

console.log(`Le prove con l'orologio del cliente (TZ=${FUSO})`);
console.log(`Il contenitore è in ${Intl.DateTimeFormat().resolvedOptions().timeZone}: qui si controlla il prodotto, non l'ambiente.\n`);

let caduti = 0;
for (const s of SUITE) {
  const r = spawnSync(process.execPath, [join(QUI, s)], {
    env: { ...process.env, TZ: FUSO },
    encoding: "utf8",
  });
  const uscita = r.status === 0;
  // l'ultima riga con un numero è il riepilogo della suite
  const riepilogo = String(r.stdout || "").trim().split("\n").filter((l) => /\d+ pass/.test(l)).pop() || "";
  console.log(`${uscita ? "  ok " : "  ✗  "} ${s.padEnd(18)} ${riepilogo.trim()}`);
  if (!uscita) {
    caduti++;
    // si stampano SOLO le righe cadute: il resto è già verde nella passata UTC
    for (const l of String(r.stdout || "").split("\n")) if (l.includes("✗")) console.log("       " + l.trim());
    if (r.stderr) console.log("       " + String(r.stderr).trim().split("\n").slice(0, 5).join("\n       "));
  }
}

console.log(`\n${SUITE.length} suite rilanciate in ora italiana, ${caduti} cadute`);
if (caduti) console.log("Una prova che passa solo in UTC misura il contenitore: qui c'è un difetto vero.");
process.exit(caduti > 0 ? 1 : 0);

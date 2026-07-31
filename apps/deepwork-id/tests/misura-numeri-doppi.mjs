/* QUANTO divergono le DUE implementazioni di messaggioNumero?
   Non «divergono?» — quello si vede leggendo. La domanda è: su quanti casi,
   e con che differenza vista dall'utente. */
const shell = await import("/home/user/Mining-Tech-Platform/shared/deepwork-id-client/dw-shell.js");
const flotta = await import("/home/user/Mining-Tech-Platform/apps/flotta/flotta-data.js");

console.log("stessa funzione?", flotta.messaggioNumero === shell.messaggioNumero);

const CASI = [
  ["1.250", {}, "l'ambiguo, il caso per cui la funzione esiste"],
  ["5.875", { unita: "t" }, "ambiguo con unità"],
  ["2,4,5", {}, "non è un numero"],
  ["", {}, "vuoto"],
  ["-3", { min: 0 }, "sotto il minimo con min 0"],
  ["-3", { min: 2 }, "sotto un minimo vero"],
  ["99999", { max: 24, unita: "h" }, "sopra il massimo"],
  ["2,5", { intero: true }, "non intero"],
  ["0", { positivo: true }, "non positivo"],
];
let diversi = 0, provati = 0;
for (const [testo, opts, perche] of CASI) {
  const r = shell.numeroScritto(testo, { decimali: 2, ...opts });
  const a = shell.messaggioNumero(r, "il numero", opts);
  const b = flotta.messaggioNumero(r, "il numero", opts);
  provati++;
  if (a !== b) {
    diversi++;
    console.log(`\n≠ ${perche}  (scritto: ${JSON.stringify(testo)}, motivo: ${r.motivo})`);
    console.log(`  shared : ${a}`);
    console.log(`  flotta : ${b}`);
  }
}
/* il caso che nessuna delle due frasi mostra a occhio: grezzo === 0 */
const r0 = { motivo: "non-positivo", grezzo: 0, letture: [] };
const a0 = shell.messaggioNumero(r0, "le ore"), b0 = flotta.messaggioNumero(r0, "le ore");
provati++;
if (a0 !== b0) { diversi++; console.log(`\n≠ grezzo === 0 (uno zero scritto davvero)\n  shared : ${a0}\n  flotta : ${b0}`); }

console.log(`\n${diversi} messaggi diversi su ${provati} casi provati`);
console.log("AVVISO_DECIMALE ripetuto in:", ["conti","flotta","sentinella","terra"].join(", "));

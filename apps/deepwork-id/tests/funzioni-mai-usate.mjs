/* ⛔ UNA FUNZIONE PROVATA E MAI USATA — cioè un 100% che mente con la faccia
   tranquilla.
   ══════════════════════════════════════════════════════════════════════════
   `copertura-funzioni.mjs` risponde «703 su 703, nessuna funzione scoperta», e
   la risposta è vera: ogni funzione esportata è **chiamata per nome da una
   prova**. Ma «chiamata da una prova» e «usata dal prodotto» sono due domande
   diverse, e la seconda non la faceva nessuno. Una funzione che esiste solo
   per il suo test è lavoro che l'utente non vede: la frase che spiega perché
   uno scaglione si applica, il «se andava male: grave» accanto a un mancato
   infortunio. Sono scritte, provate, e non escono mai dallo schermo.

   È la stessa famiglia della copertura che non sapeva vedere il codice
   aggiunto senza prove (03/08): **una soglia su un valore monotòno non dice
   che cosa la fa scendere**. Qui il numero è 100% e resta 100% qualunque cosa
   succeda al prodotto.

   ⚠️ E IL RIGHELLO HA SBAGLIATO DUE VOLTE PRIMA DI REGGERE, tutt'e due nei modi
   che questo repository ha già pagato:
   1. lo spogliatore dei commenti era scritto a mano
      (il `replace` non greedy sui delimitatori) e ha dichiarato orfana
      `testoBilancioFoto`, che Scudo usa in due punti. Si usa `senzaCommenti`
      di `tokenizza.mjs`, che è la scansione di casa;
   2. l'elenco delle pagine era scritto a mano e lasciava fuori
      `apps/genesi/nuvola-poc.html`: i **cinque** lettori di nuvole di punti
      risultavano orfani mentre quella pagina li importa tutti e cinque.
      L'elenco si deriva dal disco. Da 11 falsi a 6 veri.

   Uso:  node apps/deepwork-id/tests/funzioni-mai-usate.mjs
         node apps/deepwork-id/tests/funzioni-mai-usate.mjs --controprova   */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { senzaCommenti } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
const MODULI = [
  ...APP.map((a) => `apps/${a}/${a}-data.js`),
  "shared/dw-ponti.js",
  "shared/deepwork-id-client/dw-shell.js",
  "shared/dw-grafici.js",
  "apps/genesi/pointcloud.js",
];

/* ⛔ LE ECCEZIONI, DICHIARATE UNA PER UNA CON LA RAGIONE E CON LA DECISIONE.
   Non è una maglia larga: è l'elenco delle sei che oggi il prodotto non chiama,
   e per ognuna sta scritto se va COLLEGATA o se sta bene dov'è. Come in
   `sonda-vuoto.mjs`, una riga che scusa un caso che non si presenta più viene
   segnalata: se qualcuno collega una di queste, il conto scende e si vede. */
const ACCETTATE = new Map([
  ["apps/conti/conti-data.js|descriviScaglione",
    "DA COLLEGARE. Spiega perché uno scaglione si applica («Scaglione 100–500 t: 5% sulla quantità»). "
    + "Il resto della famiglia è vivo — `etichettaScaglione` e `validaScaglioni` la pagina le usa, e "
    + "`applicaScaglione` la chiama il modulo — quindi lo sconto si applica davvero: quello che manca è "
    + "la FRASE che lo spiega a chi legge il preventivo."],
  ["apps/scudo/scudo-data.js|descriviPotenziale",
    "DA COLLEGARE. È il «se andava male: grave» accanto a un mancato infortunio, cioè la ragione per cui "
    + "un near-miss si registra. La pagina mostra `descriviRischioPotenziale`, che è l'aggregato: la riga "
    + "del singolo evento non dice niente."],
  ["apps/scudo/scudo-data.js|appaltiDiCantiere",
    "TENUTA. È il gemello di `appaltiDiAppaltatore`, che la pagina usa: filtra gli appalti di un CANTIERE "
    + "invece che di un appaltatore. Serve alla scheda del cantiere, che non c'è ancora. Toglierla vorrebbe "
    + "dire riscriverla identica il giorno in cui quella scheda si fa."],
  ["apps/scudo/scudo-data.js|permessiDiCantiere",
    "TENUTA, stessa ragione: i permessi di lavoro di un cantiere. Non è nemmeno importata dalla pagina."],
  ["apps/conti/conti-data.js|statoPreventivoLabel",
    "TENUTA. Traduce un id di stato nella sua etichetta; la pagina passa da `statoPreventivo`, che lo stato "
    + "lo CALCOLA (uno scaduto è scaduto anche se nessuno l'ha toccato) e restituisce già l'etichetta. "
    + "Resta il modo di etichettare uno stato scritto a mano, che l'import/export userà."],
  ["shared/deepwork-id-client/dw-shell.js|interoScritto",
    "TENUTA. È `numeroScritto` con `intero:true`: la offre lo strato condiviso perché una app non se la "
    + "riscriva addosso — ed è esattamente il difetto che questo repository ha pagato più volte. "
    + "Nessuna l'ha ancora chiesta."],
]);

/* le pagine si derivano dal disco: un elenco a mano si accorcia da solo */
function paginePresenti(dir = "", prof = 0) {
  const out = [];
  for (const e of readdirSync(join(R, dir))) {
    if (e === "node_modules" || e === ".git" || e === "vault" || e === "docs" || e === "tests") continue;
    const rel = dir ? `${dir}/${e}` : e;
    let st; try { st = statSync(join(R, rel)); } catch { continue; }
    if (st.isDirectory() && prof < 3) out.push(...paginePresenti(rel, prof + 1));
    else if (e.endsWith(".html")) out.push(rel);
  }
  return out;
}

const leggi = (rel) => { try { return readFileSync(join(R, rel), "utf8"); } catch { return ""; } };

/* `sostituzioni` rimpiazza il CONTENUTO di un file, per la controprova: si
   inietta dove il controllo guarda davvero — dentro un modulo, che è l'unico
   posto da cui si enumerano le funzioni esportate — mai sul disco. */
export function funzioniMaiUsate(sostituzioni = {}) {
  const PAGINE = paginePresenti();
  const src = (f) => senzaCommenti(f in sostituzioni ? sostituzioni[f] : leggi(f));
  const tutto = [...MODULI, ...PAGINE].map(src).join("\n");
  const fuori = [];
  let esportate = 0;
  for (const m of MODULI) {
    for (const x of src(m).matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) {
      const n = x[1];
      esportate++;
      /* non contano: la riga che la dichiara, e gli `import { … }` che la nominano */
      const usi = (tutto.match(new RegExp(`\\b${n}\\b`, "g")) || []).length;
      const dich = (tutto.match(new RegExp(`export\\s+(?:async\\s+)?function\\s+${n}\\b`, "g")) || []).length;
      const imp = (tutto.match(new RegExp(`import\\s*\\{[^}]*\\b${n}\\b[^}]*\\}`, "g")) || []).length;
      if (usi - dich - imp <= 0) fuori.push(`${m}|${n}`);
    }
  }
  return { fuori, esportate, pagine: PAGINE.length, moduli: MODULI.length };
}

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ✓ ${t}`); } else { ko++; console.log(`  ✗ ${t}${x !== undefined ? `: ${x}` : ""}`); } };

const { fuori, esportate, pagine, moduli } = funzioniMaiUsate();

if (process.argv.includes("--controprova")) {
  /* ⛔ SA FALLIRE? Si aggiunge una funzione esportata finta al testo che il
     controllo legge — mai sul file — e si pretende che compaia fra le mai
     usate. E il verso opposto: la stessa funzione, se qualcuno la chiama,
     NON deve comparire. Una prova che vede solo il primo verso passerebbe
     anche con un controllo che accusa tutto. */
  const M = "shared/dw-ponti.js";
  const vero = leggi(M);
  const finta = vero + "\nexport function _funzioneMaiUsataDiProva() { return 1; }\n";
  const a = funzioniMaiUsate({ [M]: finta });
  const vistaSenzaUso = a.fuori.some((k) => k.endsWith("|_funzioneMaiUsataDiProva"));
  const b = funzioniMaiUsate({ [M]: finta + "const _x = _funzioneMaiUsataDiProva();\n" });
  const vistaConUso = b.fuori.some((k) => k.endsWith("|_funzioneMaiUsataDiProva"));
  const male = [];
  if (vistaSenzaUso === vistaConUso) male.push("non distingue una funzione chiamata da una che non lo è");
  if (!vistaSenzaUso && !vistaConUso) male.push("l'iniezione non è arrivata: la finta non compare in nessuno dei due versi");
  console.log(male.length
    ? "⛔ NON DISTINGUE:\n  " + male.join("\n  ")
    : "controprova: una funzione esportata e mai chiamata viene vista; la stessa, chiamata una volta, no.");
  process.exit(male.length ? 1 : 0);
}

console.log("\n── Funzioni esportate che il PRODOTTO non chiama mai ──");
const nonDichiarate = fuori.filter((k) => !ACCETTATE.has(k));
dice(nonDichiarate.length === 0,
  "ogni funzione esportata è usata dal prodotto, o è dichiarata qui con la ragione",
  nonDichiarate.join(" · "));

/* ⛔ E OGNI ECCEZIONE DEVE PRESENTARSI ANCORA: se una viene collegata, la riga
   che la scusa è più vecchia del codice e va tolta. È la regola di
   `sonda-vuoto.mjs`, e serve perché questo elenco scenda invece di ingrassare. */
const collegate = [...ACCETTATE.keys()].filter((k) => !fuori.includes(k));
dice(collegate.length === 0,
  "nessuna eccezione è diventata vecchia (una funzione collegata va tolta da qui)",
  collegate.join(" · "));

dice(esportate >= 600, `ha davvero guardato: ${esportate} funzioni esportate`, esportate);
dice(pagine >= 14, `ha davvero guardato le pagine: ${pagine}`, pagine);

/* ⛔ IL DETTAGLIO PRIMA, IL RIEPILOGO ULTIMO. `giro-node.mjs` stampa **l'ultima
   riga** di ogni comando: scritto al contrario, del giro non si vedeva il
   risultato ma l'ultima voce di un elenco. Misurato subito — il totale del
   giro è salito di 1 invece che di 4, e la riga che mancava era proprio
   quella. */
const daCollegare = [...ACCETTATE].filter(([, r]) => r.startsWith("DA COLLEGARE"));
if (daCollegare.length) {
  console.log(`⚠️  ${daCollegare.length} dichiarate DA COLLEGARE: frasi che il prodotto calcola e non mostra a nessuno —`
    + ` ${daCollegare.map(([k]) => k.split("|")[1]).join(", ")}.`);
}
console.log(`\nRisultato funzioni mai usate: ${ok} passati, ${ko} falliti`
  + `  ·  ${esportate} funzioni esportate da ${moduli} moduli, guardate contro ${pagine} pagine`
  + `  ·  ${fuori.length} mai chiamate dal prodotto, ${fuori.length} dichiarate,`
  + ` di cui ${daCollegare.length} da collegare`);
process.exit(ko > 0 ? 1 : 0);

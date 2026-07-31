// ============================================================
// «L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE», CERCATA A TAPPETO
//
// Il principio è in CLAUDE.md ed è nato tre volte in tre app diverse. Il segno
// che è stato violato è sempre lo stesso: **un numero o un colore TRANQUILLO
// dove non è stato misurato niente**. Fino al 03/08 quel principio viveva nella
// memoria di chi scriveva — e quindi copriva il codice che si stava scrivendo
// in quel momento, non il resto.
//
// Questa sonda chiama OGNI funzione esportata dai sei moduli dati con input
// vuoti e guarda se la risposta contiene quel segno. Alla prima passata ha
// trovato **nove** casi su 342 funzioni: otto legittimi, uno no — e quell'uno
// era sulla prima schermata di Sentinella, cioè proprio nell'app dove il
// principio era nato. Racconto e misure: docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
//
// COME FUNZIONA IL CONTROLLO, e perché è fatto così. Un elenco di casi
// ACCETTATI, ognuno con la ragione scritta. Il controllo fallisce in DUE versi:
//   · un caso NUOVO che nessuno ha dichiarato → è il verso che conta, ed è
//     quello che il fondo di `copertura-funzioni.mjs` NON sapeva catturare
//     (una soglia su un valore monotòno vede sparire, non comparire);
//   · un caso dichiarato che NON si presenta più → l'elenco va accorciato, se
//     no invecchia e comincia a coprire cose che non esistono.
//
// Si lancia con:
//   node apps/deepwork-id/tests/sonda-vuoto.mjs
//   node apps/deepwork-id/tests/sonda-vuoto.mjs --elenco   (stampa anche le risposte)
// ============================================================
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const ELENCO = process.argv.includes("--elenco");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

/* Un valore è «tranquillo» se, letto da un direttore di cava, direbbe «è andata
   bene»: un verde, un «conforme», un 100%. Non si cercano gli zeri: uno zero è
   spessissimo un fatto vero («nessuna pesata → venduto zero»), e cercarli
   riempirebbe l'elenco di rumore fino a renderlo inservibile. */
const TRANQUILLO = /^(ok|conforme|regolare|verde|success|buono|100)$/i;

/* I casi ACCETTATI, con la ragione. Chiave: `app.funzione`. */
const ACCETTATI = {
  "conti.livelloSollecito":
    "l'argomento sono i GIORNI DI RITARDO: zero giorni = nessun ritardo, ed è un fatto",
  "flotta.urgenza":
    "ragiona su una distanza in giorni: nessuna scadenza vicina = nessuna urgenza",
  "flotta.riepilogoControllo":
    "un giro macchina senza voci fuori posto è davvero a posto: l'assenza qui è di PROBLEMI, non di misure",
  "scudo.livelloScadenza":
    "prende una data: nessuna data vicina = nessuna urgenza",
  "terra.livelloScadenzaTerra":
    "come sopra: è la distanza da una scadenza, non un giudizio su un dato mancante",
  "sentinella.confermaVolataEseguita":
    "«regolare» è il valore PRECOMPILATO di un campo di modulo, non un verdetto dell'app",

  /* ⚠️ TRAPPOLE DORMIENTI, dichiarate come tali dopo aver misurato la
     raggiungibilità (CLAUDE.md: «misurare prima di irrigidire»). Oggi NESSUN
     percorso crea un'azione o un'ispezione senza data: il form la pretende con
     un messaggio esplicito, e la creazione automatica da un'ispezione passa
     sempre una scadenza. Restano qui perché il giorno in cui nascerà un
     percorso nuovo — un ponte, un import CSV — la risposta giusta è «senza
     scadenza», non «regolare». */
  "scudo.statoAzione":
    "DORMIENTE: «regolare» senza scadenza. Nessun percorso crea oggi un'azione senza data (il form la pretende)",
  "scudo.statoIspezione":
    "DORMIENTE: come statoAzione, e per la stessa ragione misurata",

  /* Trovati dalla seconda forma (UN RECORD VUOTO), che la lista vuota non
     raggiungeva. */
  "scudo.statoConsegnaDpi":
    "una consegna DPI senza scadenza è «regolare» ed è giusto: moltissimi DPI non scadono (un gilet ad alta visibilità)",
  "scudo.verbaleDpi":
    "stampa lo stato di statoConsegnaDpi: eredita la riga qui sopra, non decide niente per conto suo",
  "flotta.urgenzaOre":
    "DORMIENTE, ma con TRE facce — vedi docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md: "
    + "la guardia è stata messa su `oreAttuali` e non su `orePreviste`, e i quattro punti di chiamata "
    + "reggono da soli con `if (n.orePreviste)`. Da chiudere dentro la funzione",
};

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); }
};
const ok = (cond, perche) => { if (!cond) throw new Error(perche); };

function segnali(v, dove, out, prof = 0) {
  if (prof > 3 || v == null) return;
  if (typeof v === "string") { if (TRANQUILLO.test(v.trim())) out.push(`${dove} = "${v}"`); return; }
  if (typeof v === "number") { if (v === 100) out.push(`${dove} = 100`); return; }
  if (Array.isArray(v)) { v.slice(0, 3).forEach((x, i) => segnali(x, `${dove}[${i}]`, out, prof + 1)); return; }
  if (typeof v !== "object") return;
  for (const k of Object.keys(v)) {
    // gli STATI e le PERCENTUALI sono i due posti dove il segno si vede
    if (/^(stato|esito|classe|colore|gravita|livello|badge|cls|label)$/i.test(k)) segnali(v[k], `${dove}.${k}`, out, prof + 1);
    else if (/pct|perc|percentuale|copertura|disponibilita|conformita/i.test(k)) segnali(v[k], `${dove}.${k}`, out, prof + 1);
    else if (prof < 2) segnali(v[k], `${dove}.${k}`, out, prof + 1);
  }
}

/* DUE forme di vuoto, e sono diverse davvero:
   · LISTA VUOTA — «non c'è nessuna riga». È il caso del cliente appena
     entrato, prima di aver inserito qualsiasi cosa;
   · UN RECORD VUOTO — «la riga c'è ma non è compilata». È il caso più comune
     di tutti: si crea la scheda e la si lascia a metà. Ed è quello che ha
     trovato tre casi in più della lista vuota, fra cui i tre di `urgenzaOre`.
   Si provano più firme perché le arità sono diverse e non si può indovinare;
   per ogni forma si tengono TUTTE le chiamate riuscite, non la prima: una
   funzione a due parametri risponde diversamente a `(lista, lista)` e a
   `(record, lista)`, e fermarsi alla prima nasconde la seconda. */
const VUOTI = [
  [], [[]], [[], []], [[], [], ""], [[], [], "", ""], [[], {}, "", ""],
  [{}], [{}, []], [[], {}], [null], [""], [[], [], []],
  [[{}]], [[{}], [{}]], [[{}], [], ""], [[{}], {}, "", ""], [{}, [{}]],
  [[{}], [{}], ""], [[{}], "", ""], [{}, {}],
];

const trovati = new Map();
let chiamate = 0, funzioni = 0;
for (const app of APP) {
  const mod = await import(join(RADICE, "apps", app, `${app}-data.js`));
  const src = readFileSync(join(RADICE, "apps", app, `${app}-data.js`), "utf8");
  const nomi = [...src.matchAll(/^export (?:async )?function (\w+)/gm)].map((m) => m[1]);
  funzioni += nomi.length;
  for (const n of nomi) {
    const f = mod[n];
    if (typeof f !== "function") continue;
    const out = []; let riuscita = false;
    for (const args of VUOTI) {
      try { segnali(f(...args), n, out); riuscita = true; } catch (e) { /* firma sbagliata */ }
    }
    if (!riuscita) continue;
    chiamate++;
    if (out.length) trovati.set(`${app}.${n}`, [...new Set(out)]);
  }
}

console.log(`\n${funzioni} funzioni esportate · ${chiamate} chiamate davvero a vuoto`
  + ` · ${trovati.size} rispondono con un valore TRANQUILLO\n`);
if (ELENCO) for (const [k, v] of trovati) console.log(`    ${k}: ${v.slice(0, 4).join(" · ")}`);

/* La prima difesa, che è quella che conta: un caso NUOVO non dichiarato. */
const nuovi = [...trovati.keys()].filter((k) => !(k in ACCETTATI));
test("nessun «tranquillo» nuovo e non dichiarato", () => {
  ok(nuovi.length === 0,
    `${nuovi.length} risposte tranquille che nessuno ha dichiarato → ${nuovi.join(", ")}`
    + " — o la funzione va corretta, o il caso va scritto in ACCETTATI con la RAGIONE");
});

/* La seconda: un elenco che invecchia copre cose che non esistono più. */
const spariti = Object.keys(ACCETTATI).filter((k) => !trovati.has(k));
test("nessun caso dichiarato che non si presenta più", () => {
  ok(spariti.length === 0,
    `${spariti.length} casi in ACCETTATI non compaiono più → ${spariti.join(", ")}`
    + " — se sono stati corretti, la riga va TOLTA: un'eccezione che non serve più è un'eccezione che nasconde");
});

/* La terza: quanti soggetti ha guardato davvero. Un «zero violazioni» ottenuto
   non chiamando niente è il difetto raccolto tre volte in CLAUDE.md. */
test("la sonda ha davvero chiamato le funzioni", () => {
  ok(chiamate >= 300, `solo ${chiamate} funzioni chiamate a vuoto su ${funzioni}: la sonda non sta guardando niente`);
});

console.log(`\nRisultato sonda del vuoto: ${passed} passati, ${failed} falliti`
  + `  ·  ${trovati.size} tranquilli trovati, ${Object.keys(ACCETTATI).length} dichiarati`);
process.exit(failed > 0 ? 1 : 0);

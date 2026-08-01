/* DOVE IL PRODOTTO DICE «NON LO SO» E NESSUN BANCO GUARDA.
   ─────────────────────────────────────────────────────────
   ⚠️ NON VA IN npm test: è una MISURA, non una suite. Stampa un elenco e non
   fallisce mai — come `copertura-funzioni.mjs`, e per la stessa ragione: una
   soglia su questo numero diventerebbe una soglia su un valore che cresce da
   sé (basta aggiungere una frase al codice), e `CLAUDE.md` racconta già che
   cosa costa un fondo scritto su un valore monotòno.

   Uso: node apps/deepwork-id/tests/stati-sorvegliati.mjs

   ⛔ QUELLO CHE QUESTA MISURA NON PUÒ DIRE, scritto qui perché la prima
   versione ci ha provato e avrebbe mentito. Volevo stampare «quanta parte del
   principio è sorvegliata», e usciva **23%**. Ma il banco guarda gli stati
   attraverso le **parole che il prodotto usa davvero** — «nessuna misura
   registrata», «non è stato registrato niente», «scavo non misurato» — che di
   solito NON sono le forme generiche di questo vocabolario. Sentinella
   risultava scoperta su «mai misurato» mentre il banco quello stato lo guarda,
   con altre parole. Cioè quel 23% misurava la **sovrapposizione di lessico**,
   non la copertura, e messo in un documento sarebbe stato un numero gonfiato.
   Due testi non possono dire se due frasi diverse parlano dello stesso stato.
   Quindi qui non c'è nessuna percentuale: c'è un **elenco di candidati** —
   dove il prodotto dice «non lo so» e nessun banco nomina quel punto — da
   guardare a mano, uno per uno. Vale come lista di lavoro, non come voto.

   LA DOMANDA A CUI RISPONDE. Il principio del fondatore — «l'assenza di un
   dato non è un dato favorevole» — è difeso su due lati:
   · nei MODULI, da `sonda-vuoto.mjs` (nessun «tranquillo» non dichiarato) e
     dalla regola 20 di `run-stile.mjs` (le bandiere di non-misurabilità);
   · sullo SCHERMO, da `browser/stati-non-misurati.mjs`, che pretende che gli
     stati «non misurato» si vedano davvero.
   Il banco ne guarda diciassette. Questa misura elenca **gli altri posti dove
   il prodotto dice «non lo so»**, così che la prossima unità sappia da dove
   cominciare invece di sceglierli a intuito.

   ⛔ E il conto va fatto così, non con una sonda che apre le sei app e visita
   tutte le sezioni: quella strada l'ho provata due volte il 01/08 e non ha mai
   prodotto un numero — una volta l'ho invalidata modificando una pagina mentre
   girava, una volta l'ho fermata perché era troppo lenta. Qui non serve il
   browser: le frasi che un'app SA dire stanno nel suo sorgente, e quelle che
   il banco guarda stanno nel suo elenco. È un confronto fra due testi. */
import { readFileSync } from "node:fs";
import { senzaCommenti } from "./tokenizza.mjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const APP = ["scudo", "campo", "flotta", "sentinella", "conti", "terra"];

/* Il vocabolario. È lo stesso della regola 20 più le forme che le pagine
   scrivono per esteso: sono le parole con cui il prodotto dice «non lo so».
   ⚠️ Corto DI PROPOSITO, come quello della regola 20: `misurato` è un valore,
   `assente` e `mai` da soli sono stati. Qui si cercano FRASI, non parole. */
export const FRASI = [
  "mai misurato", "mai misurata", "mai rilevato", "mai rilevata",
  "non misurato", "non misurata", "non misurabile",
  "non calcolabile", "non dichiarabile", "non dichiarato", "non dichiarata",
  "non indicato", "non indicata", "non registrato", "non registrata",
  "non lo so", "senza data", "non lo sappiamo", "non si sa",
];

/* Le frasi che un file SA DIRE ALL'UTENTE. Si cerca dentro le stringhe (una
   frase per l'utente vive lì) ma NON nei commenti.
   ⛔ La prima versione cercava nel testo intero, e la classifica che ne usciva
   era fatta quasi tutta di COMMENTI — i punti in cui uno sviluppatore SPIEGA il
   principio, non quelli in cui il prodotto lo DICE. In Conti tutte e cinque le
   occorrenze di «non lo so» erano commenti: una lista di lavoro che avrebbe
   mandato la prossima unità a caccia di spiegazioni.
   `senzaCommenti` è il tokenizzatore giusto per le regole sui TESTI, e lo dice
   `CLAUDE.md`: toglie solo i commenti e tiene il resto. Non è stato riscritto —
   è stato TIRATO FUORI da `run-stile.mjs`, che chiama `process.exit` e quindi
   lo teneva prigioniero. */
export function frasiDette(testo) {
  const t = senzaCommenti(String(testo || "")).toLowerCase();
  const fuori = new Set();
  for (const f of FRASI) if (t.includes(f)) fuori.add(f);
  return fuori;
}

/* Le frasi che il banco guarda. I suoi motivi sono espressioni regolari
   scritte a mano: si prende il loro TESTO e ci si cerca dentro il vocabolario,
   che è il modo onesto di dire «questo banco parla di questa cosa». */
export function frasiSorvegliate(testoBanco) {
  const motivi = String(testoBanco || "").match(/\/[^/\n]{3,}\/i/g) || [];
  const fuori = new Set();
  for (const m of motivi) {
    const nudo = m.slice(1, -2).replace(/\\[sbd]|\[[^\]]*\]|[*+?(){}|^$]/g, " ").toLowerCase();
    for (const f of FRASI) if (nudo.includes(f)) fuori.add(f);
  }
  return { frasi: fuori, quantiMotivi: motivi.length };
}

const banco = readFileSync(join(QUI, "browser", "stati-non-misurati.mjs"), "utf8");
const sorv = frasiSorvegliate(banco);

console.log("═══ DOVE IL PRODOTTO DICE «NON LO SO» E NESSUN BANCO GUARDA ═══\n");
console.log(`Vocabolario: ${FRASI.length} frasi · il banco dichiara ${sorv.quantiMotivi} motivi`);
console.log("⚠️ Un motivo del banco può guardare uno stato CON ALTRE PAROLE: qui");
console.log("   sotto ci sono candidati da guardare a mano, non una copertura.\n");

let totDette = 0, totCoperte = 0;
const residui = [];
const scoperteTutte = new Map();
for (const app of APP) {
  /* ⛔ UN FILE PER VOLTA, MAI CONCATENATI. Prima incollavo `index.html` e il
     modulo e passavo il blocco unico a `senzaCommenti`: la scansione legge
     JavaScript, e la parte HTML la mandava FUORI FASE — nell'elenco che ne
     usciva ricomparivano righe `//` che il tokenizzatore da solo toglie
     benissimo. È il difetto raccontato in `CLAUDE.md` («leggeva la pagina
     intera come JavaScript»), riprodotto pari pari il giorno dopo averlo
     riletto. Misura: separando i file, i residui passano da alcuni a ZERO. */
  const dette = new Set();
  for (const f of ["index.html", `${app}-data.js`]) {
    let t = "";
    try { t = readFileSync(join(RADICE, "apps", app, f), "utf8"); } catch (e) { continue; }
    for (const x of frasiDette(t)) dette.add(x);
    /* ⛔ E LA MISURA CONTROLLA LA PROPRIA SCANSIONE. Se dopo `senzaCommenti`
       restano righe che cominciano per `//` o `*` e contengono una delle
       frasi, la scansione è andata fuori fase e questo elenco NON vale: è
       successo due volte in mezz'ora (56 → 53 → 42 occorrenze), e le prime due
       volte non se n'è accorto nessuno perché il numero c'era comunque. Un
       controllo che non dice quanti soggetti ha guardato mente in silenzio. */
    for (const r of senzaCommenti(t).split("\n")) {
      const nudo = r.trim();
      if (!/^(\/\/|\*)/.test(nudo)) continue;
      if (FRASI.some((f) => nudo.toLowerCase().includes(f))) residui.push(`${app}/${f}: ${nudo.slice(0, 70)}`);
    }
  }
  const coperte = [...dette].filter((f) => sorv.frasi.has(f));
  const scoperte = [...dette].filter((f) => !sorv.frasi.has(f));
  totDette += dette.size; totCoperte += coperte.length;
  for (const f of scoperte) scoperteTutte.set(f, (scoperteTutte.get(f) || 0) + 1);
  console.log(`${app.padEnd(11)} dice ${String(dette.size).padStart(2)} frasi · da guardare: ${scoperte.join(", ") || "(nessuna)"}`);
}

console.log(`\nIn tutto: ${totDette} occorrenze di frase nelle sei app, ${totCoperte} nominate anche dal banco.`);
console.log("(NON è una percentuale di copertura: vedi l'avvertenza sopra.)");
if (residui.length) {
  console.log(`\n⛔ SCANSIONE FUORI FASE: ${residui.length} righe di commento sono sopravvissute a`);
  console.log("   `senzaCommenti`. L'elenco qui sotto NON vale finché non è risolto.");
  for (const r of residui.slice(0, 5)) console.log(`   ${r}`);
} else {
  console.log("Scansione in fase: nessun commento è sopravvissuto al tokenizzatore.");
}

/* ⛔ La riga che serve davvero non è la percentuale: è QUALI frasi nessun banco
   guarda, ordinate per quante app le dicono. Una frase che dicono in quattro e
   non guarda nessuno è il posto dove il prossimo difetto passerà inosservato. */
const classifica = [...scoperteTutte.entries()].sort((a, b) => b[1] - a[1]);
if (classifica.length) {
  console.log("\nFrasi che NESSUN banco guarda, per quante app le dicono:");
  for (const [f, n] of classifica) console.log(`  ${String(n)} app · «${f}»`);
} else {
  console.log("\nNessuna frase scoperta.");
}
console.log("\n(misura, non prova: non fallisce mai — vedi l'intestazione)");

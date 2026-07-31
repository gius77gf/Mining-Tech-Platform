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

/* ⛔ E ANCHE IL CODICE CONDIVISO. La prima versione guardava solo le sei app —
   e la regola vincolante dice che ciò che serve a DUE app vive in `shared/`,
   cioè lì un difetto si moltiplica per sei. Allargando si è trovato subito
   `statoScadenzaHSE`, che su una data illeggibile risponde «regolare»: la
   stessa forma, nel posto peggiore. */
const SOGGETTI = [
  ...APP.map((a) => [a, join(RADICE, "apps", a, `${a}-data.js`)]),
  ["ponti", join(RADICE, "shared", "dw-ponti.js")],
  ["shell", join(RADICE, "shared", "deepwork-id-client", "dw-shell.js")],
  ["pointcloud", join(RADICE, "apps", "genesi", "pointcloud.js")],
];

const trovati = new Map();
let chiamate = 0, funzioni = 0;
for (const [nomeSoggetto, percorso] of SOGGETTI) {
  const mod = await import(percorso);
  const src = readFileSync(percorso, "utf8");
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
    if (out.length) trovati.set(`${nomeSoggetto}.${n}`, [...new Set(out)]);
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

/* ── E COME SI CHIAMA, IL DATO CHE MANCA? ─────────────────────────────
   Censite le etichette di stato dei sei moduli (03/08), Sentinella ne aveva
   QUATTRO che sembrano dire la stessa cosa. Guardate una per una **non lo
   dicono**: sono quattro PORTATE diverse, e la precisione è giusta —

     · «Senza dati»            un PERIODO senza nessuna lettura (report all'ente)
     · «Mai misurato»          un PUNTO che non è mai stato letto
     · «Manca la PPV misurata» un CAMPO preciso che non c'è
     · «Dato mancante»         il ripiego generico, quando il campo non è noto

   Il rischio non è quello che c'è: è il **quinto** termine che nasce la
   prossima volta che qualcuno deve dire «manca». Questo controllo tiene
   l'elenco chiuso: chi ne aggiunge uno deve dichiararlo qui, con la sua
   portata — e accorgersi, scrivendolo, se ne stava inventando un sinonimo.

   Si dichiara la FAMIGLIA, non la singola frase: «Manca la PPV misurata»,
   «Manca la distanza del ricettore» e «Manca la carica massima per ritardo»
   sono la stessa convenzione applicata a tre campi — quella sì che va bene, ed
   è la riga `Manca …` qui sotto.

   ⛔ E SI GUARDANO TUTTE E SEI LE APP, non solo Sentinella. La prima versione
   guardava lei sola, ed era la solita miopia: il censimento sulle sei ha
   mostrato che **«senza data» è già la convenzione di TRE app** (Flotta, Scudo,
   Terra) per «questo record non ha una data», e che «… n.d.» è quella di DUE
   (Scudo «Idoneità n.d.», Terra «Accuratezza n.d.»). Cioè il vocabolario
   dell'assenza è **già dell'ecosistema**, non di un'app — e allora il posto in
   cui tenerlo chiuso è uno solo. È anche la ragione per cui la correzione di
   Sentinella userà «senza data» per il punto importato senza storico invece di
   inventare un termine nuovo: la parola c'è già, e la dicono in tre. */
const VOCABOLARIO_MANCANTE = [
  [/^Senza dati$/, "un PERIODO senza nessuna lettura registrata (report di conformità)"],
  [/^Mai misurato$/, "un PUNTO di misura che non è mai stato letto"],
  [/^Manca /, "un CAMPO preciso che non c'è — convenzione «Manca <il campo>», una frase per campo"],
  [/^Dato mancante$/, "il ripiego generico, quando non si sa quale campo manchi"],
  [/^Senza frequenza$/, "un'IMPOSTAZIONE che manca (ogni quanti giorni), non una misura"],
  [/^senza data$/, "il record non porta una data — convenzione di Flotta, Scudo e Terra"],
  [/ n\.?d\.$/, "un GIUDIZIO che non si può dare per mancanza di dati (idoneità, accuratezza)"],
];
/* ⚠️ IL FILTRO È IL PUNTO DEBOLE, e lo si è scoperto con la controprova. La
   prima versione cercava `manca|senza dat|mai misur|non misur|n.d.` — cioè
   riconosceva solo le frasi che SOMIGLIAVANO GIÀ a quelle note. Iniettando
   «Senza rilevazioni», che è esattamente il quinto sinonimo che il controllo
   esiste per fermare, non succedeva niente: il controllo era cieco proprio sul
   caso per cui era nato. È la stessa famiglia del «controllo che non guarda
   dove crede», raccolta tre volte in CLAUDE.md.
   Adesso il filtro è un LESSICO DELL'ASSENZA, più largo. Resta comunque
   incompleto — nessuna regex decide se una frase italiana nuova stia dicendo
   «manca» — e questo limite va tenuto scritto invece che scoperto: il controllo
   ferma le varianti costruite con le parole dell'assenza, non un'invenzione
   lessicale («Da rilevare» lo prende, «In attesa» no). */
const ASSENZA = /manca|mancante|\bsenza\b|\bmai\b|n\.?d\.|nessun\w* (dato|lettura|misura|rilevazione)|non (misurat|rilevat|pervenut|dichiarat|disponibil)|assente|da rilevare|ignot|sconosciut/i;
const etichetteAssenza = new Map();   // app -> etichette che parlano di assenza
let etichetteTotali = 0;
for (const app of APP) {
  const src = readFileSync(join(RADICE, "apps", app, `${app}-data.js`), "utf8");
  const et = [...new Set([...src.matchAll(/\b(?:label|etichetta)\s*:\s*"([^"]+)"/g)].map((m) => m[1]))];
  etichetteTotali += et.length;
  etichetteAssenza.set(app, et.filter((t) => ASSENZA.test(t)));
}
const tutteAssenza = [...new Set([...etichetteAssenza.values()].flat())];

test("nessuna app ha inventato un sinonimo nuovo per «manca il dato»", () => {
  ok(etichetteTotali >= 100, `solo ${etichetteTotali} etichette lette in tutto: la lettura non sta guardando niente`);
  ok(tutteAssenza.length >= 10, `solo ${tutteAssenza.length} etichette di assenza trovate: il filtro non sta guardando niente`);
  const nuovi = [];
  for (const [app, et] of etichetteAssenza)
    for (const t of et) if (!VOCABOLARIO_MANCANTE.some(([re]) => re.test(t))) nuovi.push(`${app}: «${t}»`);
  ok(nuovi.length === 0,
    `${nuovi.length} modi nuovi di dire «manca il dato» → ${nuovi.join(" · ")}`
    + " — se è una PORTATA diversa va dichiarata in VOCABOLARIO_MANCANTE, se è la stessa va usato il termine che c'è già");
});

test("nessuna famiglia dichiarata è rimasta senza chi la usa", () => {
  const spariti = VOCABOLARIO_MANCANTE.filter(([re]) => !tutteAssenza.some((t) => re.test(t)));
  ok(spariti.length === 0,
    `${spariti.length} famiglie dichiarate non si usano più → ${spariti.map(([re]) => re.source).join(" · ")}: vanno tolte`);
});

console.log(`vocabolario dell'assenza: ${tutteAssenza.length} etichette su ${etichetteTotali}, in `
  + [...etichetteAssenza].filter(([, v]) => v.length).map(([k, v]) => `${k} ${v.length}`).join(", "));

console.log(`\nRisultato sonda del vuoto: ${passed} passati, ${failed} falliti`
  + `  ·  ${trovati.size} tranquilli trovati, ${Object.keys(ACCETTATI).length} dichiarati`);
process.exit(failed > 0 ? 1 : 0);

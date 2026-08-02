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
import { classifica, CODICE } from "./tokenizza.mjs";

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
  /* Comparso il 01/08 spostando la data campione nel futuro (prima era nel
     passato e finiva nell'altro secchio, quello degli allarmi). Guardato prima
     di dichiararlo, come vuole la regola: l'argomento che manca è il
     **preavviso**, cioè la finestra entro cui avvisare — non una misura. La sua
     assenza vuol dire «nessun preavviso», e non cambia di una virgola il fatto
     che la scadenza sia lontana 400 giorni. Rispondere «a posto» lì è corretto:
     il dato che conta, la data, c'è ed è buono. */
  "terra.livelloScadenzaTerra":
    "l'argomento assente è il PREAVVISO, non la data: senza finestra di avviso una scadenza lontana resta lontana",

  /* ✅ TOLTI IL 01/08: `scudo.statoAzione` e `scudo.statoIspezione`.
     Stavano qui come «trappole dormienti», dichiarate dopo aver misurato che
     nessun percorso ci arrivava — il form la data la pretende — e con la nota
     che il giorno in cui fosse nato un percorso nuovo la risposta giusta era
     «senza scadenza», non «regolare». Il censimento del principio le ha
     corrette invece di aspettare quel giorno: adesso rispondono «senza data»,
     che la mappa dei badge copriva già.
     ⚠️ E la riga è stata tolta perché **la sonda l'ha preteso**, non perché
     qualcuno se ne sia ricordato: un'eccezione che non serve più è
     un'eccezione che nasconde. È lo stesso modo in cui `campo.scartoLivello`
     era stato accorciato — non a memoria. */

  /* Trovati dalla seconda forma (UN RECORD VUOTO), che la lista vuota non
     raggiungeva. */
  /* ✅ TOLTI IL 02/08: `scudo.statoConsegnaDpi` e `scudo.verbaleDpi`.
     Stavano qui con la ragione «moltissimi DPI non scadono (un gilet ad alta
     visibilità), quindi senza scadenza è regolare». Il fondatore ha deciso il
     contrario (decisione 14): senza data di sostituzione nessuno ha detto che
     quel DPI è ancora buono — si sa solo che è stato consegnato, e la risposta
     giusta è «attenzione», non verde.
     ⚠️ E anche stavolta le righe sono state tolte perché **la sonda le ha
     pretese**, non perché qualcuno se ne sia ricordato: i due casi non si
     presentavano più e il conto in fondo si è scostato (5 trovati, 7
     dichiarati). È la seconda metà del suo mestiere. */
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
// Una data lontana nel FUTURO: neutra per costruzione, così nessun allarme
// può nascere dalla data stessa. Vedi la ragione per esteso più sotto.
const DATA_NEUTRA = new Date(Date.now() + 400 * 864e5).toISOString().slice(0, 10);

const VUOTI = [
  [], [[]], [[], []], [[], [], ""], [[], [], "", ""], [[], {}, "", ""],
  [{}], [{}, []], [[], {}], [null], [""], [[], [], []],
  /* ⛔ LA DATA DEL CAMPIONE NON SI SCRIVE A MANO: INVECCHIA, E ACCUSA.
     Qui c'era «2026-07-31», che il giorno in cui è stata scritta era OGGI. Il
     1° agosto è diventata ieri, e `statoScadenzaTerra` ha cominciato a
     rispondere «scaduta» — **giustamente**, perché quella data è davvero
     passata. Ma la sonda l'ha letta come un ALLARME INVENTATO su un dato
     mancante, e ha accusato due funzioni sane, facendo cadere la CI su un
     difetto che non esiste. Un controllo che grida al lupo perde il diritto di
     essere creduto la volta che ha ragione.
     La data del campione dev'essere **neutra**: nel futuro, così l'unico
     allarme che può uscire viene dall'argomento che MANCA — che è l'unica cosa
     che questa sonda sta cercando. Si ricava da oggi, non si batte a mano.
     (`toISOString` qui è sicuro: la data nasce da uno scarto in millisecondi,
     non da un'ora locale, quindi non c'è nessuna mezzanotte da attraversare.) */
  [[{}]], [[{}], [{}]], [[{}], [], ""], [[{}], {}, "", ""], [{}, [{}]],
  [[{}], [{}], ""], [[{}], "", ""], [{}, {}],
  /* ⛔ E LA FORMA CHE HA SMASCHERATO `urgenzaOre`: NON tutto vuoto, ma un
     argomento ASSENTE ACCANTO A UNO BUONO. È il caso vero — le ore fatte dal
     mezzo si conoscono, il tagliando previsto no — e nessuna delle venti forme
     qui sopra lo riproduce: sono tutte «vuoto dappertutto», cioè la condizione
     in cui una funzione tende a fermarsi sulla prima guardia e non arrivare mai
     al conto che sbaglia. Sono queste sei a portare la sonda dove `+null === 0`
     diventa «SCADUTA (+500 h)» in rosso. */
  [null, 500], ["", 500], [500, null], [null, DATA_NEUTRA], ["", DATA_NEUTRA], [DATA_NEUTRA, null],
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

/* ⚠️ E UNA FORMA VALE SOLO SE QUALCOSA MANCA DAVVERO A QUELLA FUNZIONE.
   Le sei forme miste qui sopra hanno fatto emergere subito quattro casi che NON
   erano difetti: `["2026-07-31", null]` dà a una funzione che dichiara UN
   parametro una data **buona**, e il `null` in più finisce su un argomento che
   non esiste — oppure su uno che ha un valore di default, che JavaScript NON
   applica quando gli si passa `null` esplicito. Risultato: `oggi` diventa il
   1970, la scadenza del 2026 è lontanissima, e la funzione risponde
   «regolare». Giustamente: **il dato non mancava**.
   Una sonda del vuoto che chiama una funzione con tutti i suoi parametri pieni
   non sta misurando il vuoto: sta misurando sé stessa. Quindi una forma si
   somministra a `f` solo se almeno uno dei parametri che `f` DICHIARA riceve
   un valore assente. (`f.length` non conta quelli con default: per questo il
   minimo è 1 — così le forme tutte-vuote restano buone per tutti.) */
/* ⚠️ E «assente» va giù RICORSIVO, se no il filtro acceca la sonda proprio dove
   rende di più. Prima versione: un array contava come presente appena aveva un
   elemento — e `[[{}]]`, cioè **la riga che c'è ma non è compilata**, è la forma
   che l'intestazione di questo file indica come la più produttiva di tutte
   (tre casi in più della lista vuota, fra cui `urgenzaOre`). Con quel filtro
   `campo.pianoRiepilogo` spariva dagli allarmi: non perché fosse guarito, ma
   perché non veniva più chiamato. Una lista di record vuoti è un dato che
   manca quanto una lista vuota. */
const ASSENTE = (v) =>
  v == null || v === ""
  || (Array.isArray(v) ? v.every(ASSENTE) : typeof v === "object" && !Object.keys(v).length);
const valePer = (f, args) => args.slice(0, Math.max(1, f.length)).some(ASSENTE);

const trovati = new Map();
let chiamate = 0, funzioni = 0, formeScartate = 0;
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
      if (!valePer(f, args)) { formeScartate++; continue; }
      try { segnali(f(...args), n, out); riuscita = true; } catch (e) { /* firma sbagliata */ }
    }
    if (!riuscita) continue;
    chiamate++;
    if (out.length) trovati.set(`${nomeSoggetto}.${n}`, [...new Set(out)]);
  }
}

console.log(`\n${funzioni} funzioni esportate · ${chiamate} chiamate davvero a vuoto`
  + ` · ${trovati.size} rispondono con un valore TRANQUILLO`
  + `\n(${formeScartate} somministrazioni scartate perché a quella funzione non mancava niente)\n`);
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
  /* ⛔ LA SORELLA DI «SENZA FREQUENZA», E NON SI SCHIACCIA SU DI LEI (02/08,
     decisione 16). Sono tutt'e due impostazioni che mancano, ma bloccano due
     cose diverse e su schermate diverse: senza frequenza non si sa QUANDO
     tornare a misurare, senza soglia non si sa se quello che si è misurato va
     bene. E soprattutto non è «Mai misurato»: lì la misura manca, qui c'è —
     con la sua data, il suo numero e la sua provenienza — e manca il limite
     con cui giudicarla. Confonderle manderebbe qualcuno a cercare letture che
     ha già. Vive su due badge, quello del punto e quello dell'esito del
     report. */
  [/^Senza soglia$/, "manca il LIMITE con cui giudicare una misura che c'è: né conforme né non conforme — diverso da «Mai misurato» (lì manca la misura) e da «Senza dati» (lì manca l'intero periodo)"],
  [/^senza data$/, "il record non porta una data — convenzione di Flotta, Scudo e Terra"],
  [/ n\.?d\.$/, "un GIUDIZIO che non si può dare per mancanza di dati (idoneità, accuratezza)"],
  /* ⛔ LE DUE DELLA TARATURA, e il prefisso NON è ridondanza (01/08). Stanno
     su un badge che vive ACCANTO a quello dello stato della misura, sulla
     stessa riga del punto: «Senza data» nudo si legge come «la misura non ha
     data», che è un'altra cosa e per di più falsa. Il nome dell'oggetto è
     l'unica parte che disambigua, quindi la famiglia è dichiarata invece di
     essere schiacciata su quella che c'era. */
  [/^Taratura senza data$/, "il CERTIFICATO di taratura di uno strumento porta una data illeggibile — stessa portata di «senza data», ma il badge convive con quello della misura e senza il nome dell'oggetto direbbe un'altra cosa"],
  [/^Taratura non dichiarata$/, "per lo strumento non esiste NESSUN certificato registrato: diverso da «Mai misurato», che parla del punto e non dello strumento, e diverso da «senza data», che presuppone un record"],
  /* ⛔ LA TERZA «NON DICHIARATA», E IL SOGGETTO È ANCORA UN ALTRO (T2d di
     Sentinella). Le tre non si possono schiacciare l'una sull'altra perché
     parlano di tre oggetti diversi, e sulla stessa schermata:
       · «Mai misurato»            → il PUNTO non è mai stato letto;
       · «Taratura non dichiarata» → lo STRUMENTO non ha certificati;
       · «Provenienza non dichiarata» → la singola MISURA c'è, ha un numero e
         una data, ma non risulta per che strada è entrata (file dello
         strumento o digitazione a mano).
     È il caso di tutte le letture registrate prima che la catena di custodia
     esistesse, e il punto della funzione è proprio che NON si ripiega su
     «a mano»: l'assenza del dato non è un dato favorevole. */
  [/^Provenienza non dichiarata$/, "di una MISURA non risulta la strada d'ingresso (file dello strumento o inserimento a mano): diverso da «Mai misurato» (parla del punto) e da «Taratura non dichiarata» (parla dello strumento) — qui il dato c'è, manca la sua custodia"],
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

/* ── E IL DIFETTO GEMELLO: L'ALLARME INVENTATO ────────────────────────
   La sonda qui sopra cerca il valore TRANQUILLO su un dato che manca. Ma
   `urgenzaOre` sbagliava dall'altra parte: con l'obiettivo a `null` rispondeva
   «SCADUTA (+500 h)» IN ROSSO — `+null === 0` — ed è **per questo** che la
   prima sonda non l'aveva visto. Un'app che grida al lupo sui dati che mancano
   viene ignorata, e il giorno che grida per davvero non la ascolta nessuno.

   ⚠️ ATTENZIONE, e vale più della sonda: **su un'assenza l'allarme è spesso la
   risposta GIUSTA**. «Nessuna azione correttiva» dopo un superamento è rosso di
   proposito, ed è scritto nei documenti: *la casella vuota è esattamente la
   risposta che l'ente non vuole sentire*. Lo stesso per una sedia vuota
   nell'organigramma della sicurezza. Questo elenco quindi non è una lista di
   difetti: è una lista di **decisioni**, e serve a fermare la NONA. */
const ALLARME = /^(danger|err|errore|scaduta|scaduto|superamento|critico|grave|non conforme|non-conforme)$/i;
const ALLARME_TESTO = /\bSCADUT[AO]\b|\bSUPERAMENTO\b|\bNON CONFORME\b/;
const ALLARMI_ACCETTATI = {
  "scudo.organigrammaSicurezza":
    "VOLUTO: una sedia vuota nell'organigramma della sicurezza è un problema, non un vuoto neutro (difetto corretto il 31/07)",
  /* ✅ ERANO DUE, E ADESSO SONO UNA. Fino al 01/08 qui stavano
     `sentinella.statoPonte` e `campo.statoRisposta`, dichiarati separatamente
     perché erano due funzioni separate — copie identiche misurate byte per
     byte. Portata la regola in `shared/dw-ponti.js`, le due app la
     ri-esportano e la sonda ne vede UNA sola. Le righe non sono state tolte
     perché qualcuno se n'è ricordato: **la sonda le ha pretese**, dicendo che
     due casi dichiarati non si presentavano più. È la seconda metà del suo
     mestiere, quella che tiene l'elenco più giovane del codice. */
  "ponti.statoPonte":
    "VOLUTO, ed è il principio del fondatore nella sua forma più diretta: «nessuna azione» dopo un superamento"
    + " di soglia (Sentinella) o dopo un fermo di produzione (Campo) è ROSSO. La domanda dell'ispettore è «e poi?»,"
    + " e una lista di azioni vuota è la risposta che non si vuole dover dare — non un vuoto neutro",
  "shell.motivoDatiNonSalvati":
    "VOLUTO, ed è il principio del fondatore applicato al messaggio che lo racconta: chiamata SENZA errore vuol dire"
    + " «il database non risponde e non sappiamo perché», e la risposta giusta lì è l'allarme — «⚠ Database non"
    + " raggiungibile». La faccia tranquilla sarebbe dire «va tutto bene, è la dimostrazione» su una causa che"
    + " nessuno ha misurato: un permission-denied lo dà anche un progetto configurato male. Nata il 02/08, quando"
    + " chiudere le regole del Firebase pubblico ha reso questo ramo quello che prende TUTTI i visitatori",
  "scudo.azioneLabel":
    "prende lo STATO di un'azione: senza stato ricade sul primo della lista, non è un giudizio su un dato mancante",
  "scudo.etichettaAmbiente":
    "è un'etichetta binaria (reclamo/superamento) chiamata solo su azioni che vengono DAVVERO dall'ambiente",
  /* `conti.livelloSollecito` stava qui con la ragione «la sonda gli passa anche
     numeri grandi, e allora il rosso è giusto» — cioè era dichiarato accettabile
     un allarme che NON nasceva da un dato mancante. Col filtro `valePer` la
     sonda non gli passa più i giorni di ritardo pieni, e il caso è sparito da
     solo: la seconda guardia lo ha preteso fuori. È il modo giusto di
     accorciare questo elenco — non a memoria. */
  "campo.scartoLivello":
    "DORMIENTE: con la carica reale assente e quella di progetto presente dà il 100% di scarto. I chiamanti passano sempre da pianoRiepilogo, che per i fori non registrati usa la carica di PROGETTO",
  /* ✅ TOLTO IL 01/08: `campo.pianoRiepilogo`, che ereditava `scartoLivello`.
     Non è più un allarme dichiarabile perché non è più un allarme: con un piano
     importato e ZERO fori pesati lo stimato coincideva col progettato per
     costruzione, quindi la differenza faceva 0 e la riga usciva col verde
     «+0%» — un «in linea col progetto» su una volata in cui nessuno ha pesato
     un foro. Adesso quel caso è dichiarato invece di colorato.
     ⚠️ E anche questo l'ha preteso la sonda, non la memoria. */
  "flotta.urgenzaOre":
    "resta solo per `[]`, che JavaScript converte a zero: nessun chiamante passa un array dove va un numero di ore",
};

const allarmi = new Map();
for (const [nomeSoggetto, percorso] of SOGGETTI) {
  const mod = await import(percorso);
  const src = readFileSync(percorso, "utf8");
  const nomi = [...src.matchAll(/^export (?:async )?function (\w+)/gm)].map((m) => m[1]);
  for (const n of nomi) {
    const f = mod[n];
    if (typeof f !== "function") continue;
    const out = [];
    const guarda = (v, dove, prof = 0) => {
      if (prof > 3 || v == null) return;
      if (typeof v === "string") {
        if (ALLARME.test(v.trim()) || ALLARME_TESTO.test(v)) out.push(`${dove} = ${JSON.stringify(v.slice(0, 40))}`);
        return;
      }
      if (Array.isArray(v)) { v.slice(0, 3).forEach((x, i) => guarda(x, `${dove}[${i}]`, prof + 1)); return; }
      if (typeof v !== "object") return;
      for (const k of Object.keys(v)) {
        if (/^(stato|esito|classe|colore|gravita|livello|badge|cls|label)$/i.test(k)) guarda(v[k], `${dove}.${k}`, prof + 1);
        else if (prof < 2) guarda(v[k], `${dove}.${k}`, prof + 1);
      }
    };
    for (const args of VUOTI) {
      if (!valePer(f, args)) continue;   // stessa regola della sonda dei tranquilli
      try { guarda(f(...args), n); } catch (e) { /* firma sbagliata */ }
    }
    if (out.length) allarmi.set(`${nomeSoggetto}.${n}`, [...new Set(out)]);
  }
}
if (ELENCO) for (const [k, v] of allarmi) console.log(`    ⚠ ${k}: ${v.slice(0, 3).join(" · ")}`);

test("nessun ALLARME nuovo e non dichiarato su un dato che manca", () => {
  ok(allarmi.size >= 5, `solo ${allarmi.size} allarmi trovati: la sonda non sta guardando niente`);
  const nuovi = [...allarmi.keys()].filter((k) => !(k in ALLARMI_ACCETTATI));
  ok(nuovi.length === 0,
    `${nuovi.length} allarmi che nessuno ha dichiarato → ${nuovi.join(", ")}`
    + " — o è un allarme INVENTATO e la funzione va corretta, o è VOLUTO e va scritto in ALLARMI_ACCETTATI con la ragione");
});
test("nessun allarme dichiarato che non si presenta più", () => {
  const spariti = Object.keys(ALLARMI_ACCETTATI).filter((k) => !allarmi.has(k));
  ok(spariti.length === 0, `${spariti.length} allarmi in ALLARMI_ACCETTATI non compaiono più → ${spariti.join(", ")}: vanno tolti`);
});
console.log(`allarmi su un dato che manca: ${allarmi.size} trovati, ${Object.keys(ALLARMI_ACCETTATI).length} dichiarati`);

/* ══════════════════════════════════════════════════════════════════════
   IL CENSIMENTO STATICO — «quanti altri ce ne sono?»
   ══════════════════════════════════════════════════════════════════════
   La sonda qui sopra CHIAMA le funzioni; questa metà LEGGE il codice. Serve
   perché la notte fra l'1 e il 2 agosto cinque numeri tranquilli sono stati
   trovati **uno per uno, a mano**, su codice che passava tutte le prove:
   il costo orario di Flotta, la scadenza al 30 febbraio di Conti, la soglia
   di Genesi, la densità prestampata di Terra, il 30/02 nel grafico di
   Sentinella. Nessuno era un errore di calcolo: erano tutti **un numero
   scritto dove non era stato misurato niente**.

   ⛔ E QUI STA LA PARTE DIFFICILE, misurata prima di consegnare. Una ricerca
   ingenua di quei motivi produce quasi solo falsi allarmi — è già successo il
   01/08 con `documenti-invecchiati`, 8 segnalazioni per 2 vere, e quel
   controllo è stato scartato: *un allarme che sbaglia tre volte su quattro
   insegna a non guardarlo.* Quindi il cercatore è stato stretto in SETTE giri,
   contando ogni volta segnalati e veri (misure in coda a questo blocco):

     giro 1  motivi grezzi (`|| 0`, divisioni, `Date.parse`, `isFinite`)
             → **1.127 segnalazioni** su 7 moduli. Illeggibile: scartato.
     giro 2  tre famiglie strette + le divisioni → 49 + 227. Le divisioni
             restano rumore puro (denominatori costanti, conversioni): fuori.
     giro 3  `Number.isFinite(+X)` con la GUARDIA VICINA → 33 grezzi, **10
             segnalati, 7 veri**. Il filtro che funziona non è la forma: è
             *qualcuno, lì attorno, ha già escluso che X sia assente?*
     giro 4  la finestra della guardia allargata al TRATTO (il corpo della
             funzione) → 8 segnalati, 2 falsi allarmi in meno.
     giro 5  la famiglia delle date rifatta: non «una data giudicata dalla
             forma» (26 punti, 5 veri) ma «una data CONVERTITA in numero senza
             che nessuno abbia verificato che esista» → 29 segnalati.
     giro 6  solo le date SCRITTE (`x + "T00:00"`), non gli istanti già
             numerici → 19.
     giro 7  le due guardie che spiegavano tutti i falsi: la data viene
             dall'OROLOGIO, oppure il tratto passa da una funzione che la
             verifica davvero → **8 segnalati, 6 veri**.

   Rapporto finale delle due famiglie messe insieme: **16 segnalati, 12 veri**
   (tre su quattro), con i 4 non-veri dichiarati qui sotto uno per uno con la
   ragione, come si fa in `ACCETTATI`. Il confronto che conta: il giro 1 ne
   dava 1.127 e nessuno li avrebbe letti.
   ⚠️ E i motivi che sono stati PROVATI E SCARTATI vanno scritti, se no
   qualcuno li rifà alla cieca: `|| 0` (514 punti, quasi tutti somme che
   partono da zero e contatori — legittimi), le divisioni col denominatore
   non costante (227), il `default:` di uno `switch` (6 punti, di cui uno
   solo era il difetto di `ppvLimit` — e nel frattempo è stato corretto:
   `ppvSenzaSoglia` rifiuta le norme sconosciute), e `n ? a/n : 0` (10 punti,
   4 discutibili). Nessuno di questi quattro regge il rapporto: contano il
   MOTIVO, non la guardia — ed è la guardia a fare la differenza.

   ⛔ PERCHÉ NON FA CADERE LA CI SUI PUNTI NUOVI. Il fondo dei falsi allarmi è
   basso ma non è zero, e una regola che ferma un cantiere una volta su sette
   viene spenta. Quindi questo censimento **dichiara e stampa**; l'unica cosa
   che pretende è l'altra metà, quella senza rischio: **un punto dichiarato che
   non si presenta più** vuol dire che l'elenco è più vecchio del codice, ed è
   esattamente il controllo che il 01/08 ha tolto tre eccezioni morte.
   Il giorno in cui il rapporto arriverà a 1 su 1 basterà togliere il commento
   alla prova «nessun punto nuovo non dichiarato», che è già scritta.

   Perimetro guardato, e va stampato ogni volta: un «zero difetti» su un
   perimetro taciuto in questo progetto è già costato tre volte.
   ══════════════════════════════════════════════════════════════════════ */

const ANCORA_TRATTO = /^(?:export )?(?:async )?(?:function|const|let|var) (\w+)/gm;

/* Il TRATTO di un punto: il corpo della dichiarazione a colonna zero che lo
   contiene, col suo nome. È l'unità in cui una guardia conta davvero — la
   riga da sola non basta (`oreContatore` di Flotta la guardia ce l'ha DUE
   righe sopra, e col filtro a una riga risultava un difetto che non è). */
function tratti(src) {
  const out = []; ANCORA_TRATTO.lastIndex = 0; let m;
  while ((m = ANCORA_TRATTO.exec(src))) out.push({ i: m.index, nome: m[1] });
  return out;
}
function trattoDi(src, tag, i) {
  let da = 0, a = src.length, nome = "(modulo)";
  for (const t of tag) { if (t.i <= i) { da = t.i; nome = t.nome; } else { a = t.i; break; } }
  return { testo: src.slice(da, a), nome };
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Il soggetto di `Number.isFinite(+X)`: si legge fino alla parentesi pari,
   così `+((v||{}).ore)` non viene troncato a metà. */
function soggettoPiu(src, i) {
  let j = src.indexOf("+", i) + 1, prof = 0, out = "";
  while (j < src.length) {
    const c = src[j];
    if (c === "(") prof++;
    else if (c === ")") { if (prof === 0) break; prof--; }
    else if (prof === 0 && (c === "," || c === "&" || c === "|")) break;
    out += c; j++;
  }
  return out.trim();
}
// da dove nasce l'argomento di una conversione: l'orologio non ha date storte
const OROLOGIO = /oggiISO|oggiIso|isoLocale|giornoDi|dataPiuGiorni/;

/* La scansione. Prende le fonti già lette (app → testo), così la controprova
   può somministrare una copia col difetto rimesso dentro senza toccare i file
   veri — che sono di altri cantieri, e che il browser carica. */
/* ⛔ QUANTI SOGGETTI HA GUARDATO DAVVERO — e va contato QUI, non dedotto dal
   numero di difetti trovati. Il conto dei difetti SCENDE man mano che si
   correggono: metterci sopra un fondo («almeno 10 punti, se no la scansione si
   è persa») vuol dire scrivere una prova che il lavoro fatto bene fa cadere. È
   la trappola già scritta in CLAUDE.md — «si controlli CHE COSA fa scendere il
   numero» — e il 02/08 è scattata davvero: corretti i quattro punti di Conti e
   i quattro di Terra, il fondo è caduto con la CI verde sul codice.
   Il numero che dice se il cercatore ha guardato è quello dei CANDIDATI che ha
   esaminato — le conversioni e le letture numeriche che ha aperto una per una —
   e quello non scende quando un difetto viene corretto: la riga resta lì, ci
   passa sopra, e viene scartata da una guardia. */
let CANDIDATI = 0, DICHIARAZIONI = 0;
function censimentoStatico(fonti) {
  const punti = [];
  const visti = new Map();
  CANDIDATI = 0; DICHIARAZIONI = 0;
  for (const [app, src] of fonti) {
    const tipo = classifica(src), linee = src.split("\n"), tag = tratti(src);
    DICHIARAZIONI += tag.length;
    const riga = (i) => src.slice(0, i).split("\n").length;
    const segna = (fam, i, nome, nota) => {
      const r = riga(i), chiave = `${app}|${fam}|${r}`;
      if (visti.has(chiave)) return; visti.set(chiave, 1);
      punti.push({ app, fam, funzione: nome, riga: r, nota,
        testo: linee[r - 1].trim().slice(0, 110) });
    };

    /* ── FAMIGLIA A · «+X su un dato assente fa ZERO, e zero passa» ──────
       `+null`, `+undefined` e `+""` valgono 0, e `Number.isFinite(0)` è
       **true**: il valore mancante entra nel conto travestito da misura. È il
       difetto di `avanzamentoLotto` (0% dove nessuno ha rilevato) e quello di
       `oreContatore` di Flotta (zero ore da un contatore illeggibile).
       Non è un difetto se lì attorno qualcuno ha già escluso l'assenza. */
    const reA = /Number\.isFinite\(\s*\+/g; let m;
    while ((m = reA.exec(src))) {
      if (tipo[m.index] !== CODICE) continue;
      CANDIDATI++;
      const X = soggettoPiu(src, m.index); if (!X) continue;
      const q = esc(X), t = trattoDi(src, tag, m.index);
      const difeso = [
        new RegExp(`${q}\\s*[!=]==?\\s*(null|undefined|"")`),
        new RegExp(`(null|undefined|"")\\s*[!=]==?\\s*${q}`),
        new RegExp(`String\\(\\s*${q}[^)]*\\)[^;]{0,40}trim`),
        new RegExp(`\\+?${q}\\s*>\\s*0`),
        new RegExp(`${q}\\s*\\?\\?`),
      ].some((r) => r.test(t.testo));
      if (difeso) continue;
      segna("zero-da-nulla", m.index, t.nome, `+${X}`);
    }

    /* ── FAMIGLIA B · «una data che non esiste, contata come se esistesse» ─
       Misurato, non dedotto: `Date.parse("2026-02-30")` **non fa NaN**, fa il
       2 marzo; e così «2026-02-29» (il 2026 non è bisestile) e «2026-04-31».
       Solo «2026-13-45» viene rifiutato. Quindi una regex di FORMA
       (`/^\d{4}-\d{2}-\d{2}$/`) non difende: l'unica che difende è
       `dataISOEsiste`, che sta in `shared/` da mesi. È il difetto di Conti
       («insoluta da 152 giorni» su una scadenza al 30 febbraio) e quello del
       grafico di Sentinella.
       Si segnala la CONVERSIONE, non la regex: la regex da sola non inventa
       niente, il numero nasce quando la stringa diventa una data. */
    const reB = /\bnew Date\(|\bDate\.parse\(/g;
    /* le funzioni di QUESTO modulo che la data la verificano davvero: chi
       passa di lì è difeso anche se sulla sua riga non si vede (è la seconda
       lettura di «non distingue» — il codice difeso in profondità). */
    const verificano = [...src.matchAll(/^(?:export )?(?:async )?(?:function|const) (\w+)/gm)]
      .filter((x) => /dataISOEsiste/.test(trattoDi(src, tag, x.index).testo)).map((x) => x[1]);
    while ((m = reB.exec(src))) {
      if (tipo[m.index] !== CODICE) continue;
      CANDIDATI++;
      const ap = src.indexOf("(", m.index);
      let j = ap + 1, prof = 0, arg = "";
      while (j < src.length) { const c = src[j];
        if (c === "(") prof++; else if (c === ")") { if (prof === 0) break; prof--; }
        arg += c; j++; }
      // solo le date SCRITTE: `x + "T00:00"`. Un istante già numerico non si legge.
      if (!/\+\s*["'`]T\d/.test(arg)) continue;
      if (/^\s*(new Date|Date\.parse)/.test(arg)) continue;   // il numero l'ha fatto quello dentro
      const t = trattoDi(src, tag, m.index);
      if (/dataISOEsiste|giorniTra/.test(t.testo)) continue;
      /* ⚠️ E «passare di lì» vale anche quando la funzione è passata come
         RIFERIMENTO. `.filter(rilievoUsabileConData)` non ha le parentesi, e
         con la sola forma `nome(` questo salto non scattava: il cercatore non
         guardava dove credeva. Misurato il 02/08 su Terra — messo
         `dataISOEsiste` dentro `rilievoUsabileConData`, `confrontoRilievi` e
         `ritmoMedioAnnuo` restavano segnalati perché quella funzione la
         chiamano proprio così, e la correzione non si poteva vedere. */
      const passaDaVerificata = (n) =>
        new RegExp(`\\b${n}\\s*\\(`).test(t.testo)
        || new RegExp(`\\.(?:filter|some|every|find|findLast|map|flatMap|sort)\\(\\s*${n}\\s*[,)]`).test(t.testo);
      if (verificano.some(passaDaVerificata)) continue;
      const id = (arg.match(/^([A-Za-z_$][\w$.]*)/) || [])[1] || "";
      const nasce = id && new RegExp(`(?:const|let|var)\\s+${esc(id.split(".")[0])}\\s*=\\s*[^;\\n]*`).exec(t.testo);
      if (nasce && OROLOGIO.test(nasce[0])) continue;         // viene dall'orologio
      segna("data-non-verificata", m.index, t.nome, arg.slice(0, 40));
    }
  }
  return punti;
}

/* ── I PUNTI DICHIARATI ────────────────────────────────────────────────
   Chiave `app.funzione`. Ogni riga dice se è un difetto VERO (e allora non si
   corregge qui: questa unità **conta e dichiara**, la correzione è un'altra
   unità) oppure un FALSO ALLARME, con la ragione — come in `ACCETTATI`.
   In ordine di quanto pesa per chi legge lo schermo. */
const CENSITI = {
  /* ── veri, famiglia B (la data che non esiste) ── */
  /* ✅ CORRETTI IL 02/08 e tolti da qui: `conti.giorniFraDate` (rispondeva 60
     giorni fra il 1° gennaio e il «30 febbraio», identico al 2 marzo, e NaN
     sul mese 13 — e il NaN, che non è null, portava a «NaN giorni» la media
     di pagamento di TUTTE le fatture) e `conti.mesiFra` (i mesi dall'emissione
     dentro l'avviso sull'art. 26: su una data storta inventava il numero, su
     una impossibile taceva). Adesso tutt'e due passano da `dataISOEsiste`, e
     `validaNota` il «non lo so» lo DICE invece di non dire niente.
     ⚠️ Le righe sono state tolte perché il censimento le ha pretese, non
     perché qualcuno se ne sia ricordato. */
  "flotta.giorniFra":
    "VERO. L'aiutante che conta i giorni fra due giorni ISO, usato dalle scorte e dai fermi: gli arrivano"
    + " stringhe controllate da `isoGiorno`, che guarda la FORMA. Da lì il consumo al giorno, e dal"
    + " consumo al giorno il punto di riordino",
  "sentinella.piuGiorni":
    "VERO. Sposta una data di n giorni partendo da `new Date(s + 'T00:00:00Z')` dopo la sola regex di"
    + " forma: su una data storta la prossima scadenza esce spostata di un giorno o due, in silenzio",
  /* ✅ CORRETTI IL 02/08 e tolti da qui: `terra.confrontoRilievi` e
     `terra.ritmoMedioAnnuo`. Le due conversioni ci sono ancora — il numero
     nasce sempre da `new Date(data + 'T00:00:00')` — ma il filtro a monte
     (`rilievoUsabileConData`) adesso chiama `dataISOEsiste` invece di guardare
     la forma, quindi una data che non esiste non ci arriva più. Misurato: dal
     01/02 al «30/02» il confronto rispondeva **29 giorni** e 48 m³ al giorno,
     e il ritmo medio scriveva `dal: "2026-02-30"`; adesso rispondono `null`.
     ⚠️ E per vederlo è servito allargare il salto delle funzioni «che
     verificano»: `.filter(rilievoUsabileConData)` non ha le parentesi, quindi
     la correzione c'era e il cercatore continuava a segnalare — un controllo
     che non guardava dove credeva. */

  /* ── veri, famiglia A (+X su un dato assente fa zero) ── */
  /* ✅ CORRETTI IL 02/08 e tolti da qui: `conti.apertoDi` (il ripiego
     sull'importo pieno era codice morto — `+null` fa 0 e `Number.isFinite(0)`
     è true — quindi `residuo: null` valeva «saldata»; ⚠️ era DORMIENTE, non
     vivo: oggi `residuo` lo scrive solo `applicaIncassi` e sempre con un
     numero, quindi nessuno schermo diceva il falso) e `conti.righeDaPesate`
     (la quantità non scritta di un DDT valeva 0 invece del netto pesato; a
     metro cubo senza densità adesso la riga si dichiara non calcolabile e la
     fattura differita si ferma, invece di uscire con un totale più basso del
     vero). La regola giusta era già in casa, in `quantitaPesata`. */
  /* ✅ CORRETTI IL 02/08 e tolti da qui: `terra.descriviOrigine` (la `quotaBase`
     assente stampava «quota di base 0 m» e l'elenco di ciò che NON risulta
     registrato non la nominava) e `terra.rilieviFuoriDaiLotti` (un rilievo
     senza volume contato fra gli orfani come se un volume ce l'avesse).
     ⚠️ E le righe sono state tolte perché **il censimento le ha pretese** —
     «2 punti dichiarati non si presentano più» — non perché qualcuno se ne
     sia ricordato: è la stessa metà del mestiere che aveva già accorciato
     l'elenco degli ACCETTATI due volte oggi. */

  /* ── falsi allarmi, dichiarati con la ragione ── */
  "campo.storicoSettimana":
    "FALSO ALLARME: `meta(iso)` converte SEMPRE una data nata dall'orologio (`oggiISO(oggi)`), non un"
    + " campo di un record. Il filtro dell'orologio non la vede perché `iso` è il parametro di una"
    + " funzioncina locale, e da lì dentro non si sa chi la chiama",
  "campo.fermiPerGiorno":
    "FALSO ALLARME: identica alla riga qui sopra, stessa funzioncina `meta`, stessa provenienza",
  "flotta.validaRifornimento":
    "FALSO ALLARME: `+oreMezzo` assente vale 0, ma il solo effetto è che il confronto"
    + " «il contatore segna meno delle ore già registrate» non scatta. Non nasce nessun numero"
    + " da mostrare: una validazione che si allenta, non una misura inventata",
  "flotta.mostra":
    "DORMIENTE, non VERO: `mostra(null)` scrive «0» invece di «». Oggi i chiamanti le passano"
    + " numeri già controllati, quindi lo zero non arriva sullo schermo — ma la guardia giusta"
    + " (`v == null` prima di convertire) è a due righe di distanza in `numeroDaCampo` e qui non"
    + " c'è. Sta qui perché il giorno in cui un chiamante nuovo le passasse un campo vuoto"
    + " diventerebbe vero senza che nessuno tocchi questa riga",
};

/* ⛔ E GENESI CI VA, anche se `APP` qui sopra non la contiene. La sonda che
   CHIAMA le funzioni la lascia fuori perché il suo modulo dati è piccolo (il
   grosso di Genesi vive dentro la pagina), ma uno dei cinque difetti del 02/08
   era proprio suo — il `default:` di `ppvLimit` — e un perimetro che lascia
   fuori l'app da cui viene un difetto non può dire «zero». Il suo conto è
   ZERO ed è dichiarato tale, non taciuto. */
const APP_STATICO = [...APP, "genesi"];
const fontiStatiche = new Map(APP_STATICO.map((a) =>
  [a, readFileSync(join(RADICE, "apps", a, `${a}-data.js`), "utf8")]));
const statici = censimentoStatico(fontiStatiche);
const RIGHE_LETTE = [...fontiStatiche.values()].reduce((s, t) => s + t.split("\n").length, 0);

const perApp = new Map(APP_STATICO.map((a) => [a, 0]));
for (const p of statici) perApp.set(p.app, perApp.get(p.app) + 1);
const veri = statici.filter((p) => (CENSITI[`${p.app}.${p.funzione}`] || "").startsWith("VERO"));

console.log(`\n── censimento statico dei «numeri scritti dove non è stato misurato niente»`);
console.log(`perimetro guardato: ${APP_STATICO.length} moduli dati (${APP_STATICO.join(", ")}), ${RIGHE_LETTE} righe`);
console.log(`punti per app: ` + [...perApp].map(([a, n]) => `${a} ${n}`).join(" · "));
console.log(`${DICHIARAZIONI} dichiarazioni in fase · ${CANDIDATI} candidati aperti uno per uno · ${statici.length} segnalati,`
  + ` ${veri.length} difetti VERI dichiarati,`
  + ` ${statici.length - veri.length} falsi allarmi dichiarati con la ragione`);
for (const p of statici) {
  const d = CENSITI[`${p.app}.${p.funzione}`];
  console.log(`   ${d ? (d.startsWith("VERO") ? "✗" : "·") : "?"} ${p.app}-data.js:${p.riga}`
    + ` ${p.funzione} [${p.fam}] ${p.nota}`);
}

/* La metà che PRETENDE, ed è quella senza rischio di falsi allarmi: un punto
   dichiarato che non si presenta più vuol dire che l'elenco è più vecchio del
   codice — o perché qualcuno ha corretto il difetto (e allora la riga va
   tolta), o perché il cercatore ha smesso di guardare lì. */
test("nessun punto del censimento statico è rimasto dichiarato a vuoto", () => {
  const chiavi = new Set(statici.map((p) => `${p.app}.${p.funzione}`));
  const spariti = Object.keys(CENSITI).filter((k) => !chiavi.has(k));
  ok(spariti.length === 0,
    `${spariti.length} punti dichiarati non si presentano più → ${spariti.join(", ")}`
    + " — se sono stati corretti la riga va TOLTA, se no il cercatore ha smesso di guardare lì");
});

/* E la prova che il cercatore ha davvero guardato: un «zero difetti» su un
   perimetro taciuto è peggio di nessun cercatore. */
test("il censimento statico ha davvero letto i moduli", () => {
  ok(RIGHE_LETTE > 15000, `solo ${RIGHE_LETTE} righe lette: il censimento non sta guardando niente`);
  /* ⛔ QUI C'ERA `statici.length >= 10`, e il 02/08 è caduto sul lavoro fatto
     BENE: corretti i quattro punti di Conti e i quattro di Terra, i segnalati
     sono scesi da 16 a 6 e la prova è diventata rossa su un codice più sano di
     prima. È la trappola scritta in CLAUDE.md — un fondo su un valore che
     scende quando il lavoro va avanti misura il lavoro, non lo strumento. Il
     numero che dice se la scansione ha guardato è quello dei CANDIDATI aperti:
     le conversioni e le letture numeriche che ha esaminato una per una. Quello
     NON scende quando un difetto viene corretto — la riga resta lì e la scarta
     una guardia — e crolla per davvero se la scansione perde la fase o se
     qualcuno restringe il perimetro. */
  ok(DICHIARAZIONI >= 600,
    `solo ${DICHIARAZIONI} dichiarazioni riconosciute: la scansione ha perso la fase`);
  /* ⚠️ E dei due numeri quello **onesto** è il primo. I candidati scendono
     anche per un motivo buono: correggere un punto della famiglia A vuol dire
     smettere di scrivere `Number.isFinite(+X)` lì, quindi quella riga esce dal
     conto. Scendono di UNO per correzione, non del difetto intero, e il fondo
     è tenuto largo apposta; il numero che non ha questa debolezza è quello
     delle dichiarazioni riconosciute, che dipende solo dal tokenizzatore e dal
     perimetro. Misurati il 02/08: 711 e 188. */
  ok(CANDIDATI >= 120, `solo ${CANDIDATI} candidati esaminati: il perimetro si è ristretto`);
});

/* ⚠️ ANCORA SPENTA, e la ragione è scritta in cima: 12 veri su 14 è un fondo
   di falsi allarmi basso ma non nullo, e una regola che ferma un cantiere una
   volta su sette viene spenta invece che rispettata. Si accende il giorno in
   cui i due numeri coincidono.
test("nessun punto nuovo che nessuno ha dichiarato", () => {
  const nuovi = statici.filter((p) => !(`${p.app}.${p.funzione}` in CENSITI));
  ok(nuovi.length === 0, `${nuovi.length} punti nuovi → ` +
    nuovi.map((p) => `${p.app}.${p.funzione}:${p.riga}`).join(", "));
}); */
const nonDichiarati = statici.filter((p) => !(`${p.app}.${p.funzione}` in CENSITI));
if (nonDichiarati.length)
  console.log(`⚠ ${nonDichiarati.length} punti NUOVI da guardare (non fanno cadere la CI, vedi l'intestazione): `
    + nonDichiarati.map((p) => `${p.app}-data.js:${p.riga} ${p.funzione}`).join(", "));

/* ── LA CONTROPROVA: il cercatore riconosce i difetti da cui nasce? ─────
   Una prova che non sa fallire non dimostra niente. Si rimettono TRE difetti
   veri — due dalla tabella del 02/08, uno raccolto in CLAUDE.md — dentro una
   COPIA IN MEMORIA delle fonti (i file veri sono di altri cantieri, e le
   pagine li caricano: non si iniettano). Si pretende che il cercatore li
   veda, e si stampa **quante iniezioni sono andate a segno**: un `replace`
   che sostituisce zero occorrenze passa in silenzio. */
const INIEZIONI = [
  ["conti", "la scadenza al 30 febbraio (tabella 02/08)",
    (s) => s + "\nconst _scadenzaVecchia = (d, o) => Math.round((new Date(d + \"T00:00:00\") - o) / 86400000);\n",
    "_scadenzaVecchia"],
  ["sentinella", "il 30/02/2026 come un giorno qualunque nel grafico (tabella 02/08)",
    (s) => s + "\nconst _giornoGrafico = (r) => new Date(String(r.data) + \"T00:00:00\").getTime();\n",
    "_giornoGrafico"],
  /* Il terzo non è nella tabella ma è la stessa famiglia, ed è successo qui:
     `oreContatore` di Flotta tornava ZERO ORE da un contatore illeggibile.
     Qui si toglie la guardia che lo corregge e si pretende che il cercatore
     rimetta il punto in elenco. */
  ["flotta", "il contatore illeggibile che valeva zero ore (`+null === 0`)",
    (s) => s.replace('  if (v == null || v === "") return null;\n  return Number.isFinite(+v) ? +v : null;',
      "  return Number.isFinite(+v) ? +v : null;"),
    "oreContatore"],
  /* ⛔ IL QUARTO GUARDA IL CERCATORE, NON IL CODICE. Il 02/08 il salto delle
     funzioni «che verificano» è stato ALLARGATO: prima riconosceva solo
     `nome(`, e `.filter(rilievoUsabileConData)` — la forma che Terra usa in
     dieci punti — non ci cadeva dentro, quindi la correzione c'era e il
     cercatore segnalava lo stesso. Allargare un salto vuol dire togliere
     copertura, ed è la mossa che va provata al contrario: si rimette in Terra
     il filtro a sola FORMA e si pretende che il cercatore torni a vedere i due
     punti. Se questa prova diventasse verde da sola, il salto sarebbe
     diventato una scusa buona per tutto. */
  ["terra", "il filtro delle date tornato a guardare la FORMA (`/^\\d{4}-\\d{2}-\\d{2}$/`)",
    (s) => s.replace('return rilievoUsabile(r) && dataISOEsiste(String((r && r.data) || ""));',
      'return rilievoUsabile(r) && /^\\d{4}-\\d{2}-\\d{2}$/.test(String((r && r.data) || ""));'),
    "confrontoRilievi"],
];
const fonti = fontiStatiche;
let iniettate = 0;
for (const [app, che, inietta, atteso] of INIEZIONI) {
  const prima = fonti.get(app);
  const dopo = inietta(prima);
  test(`controprova · ${app}: ${che}`, () => {
    ok(dopo !== prima, "l'iniezione non ha cambiato niente: il testo cercato non c'è più");
    iniettate++;
    const base = censimentoStatico(new Map([[app, prima]])).length;
    const con = censimentoStatico(new Map([[app, dopo]]));
    ok(con.length > base, `il difetto rimesso non fa salire il conto (${base} → ${con.length}):`
      + " il cercatore non riconosce il difetto da cui nasce");
    ok(con.some((p) => p.funzione === atteso),
      `il conto sale ma non su «${atteso}»: il cercatore vede un'altra cosa`);
  });
}
console.log(`controprova: ${iniettate} iniezioni su ${INIEZIONI.length} andate a segno`);

console.log(`\nRisultato sonda del vuoto: ${passed} passati, ${failed} falliti`
  + `  ·  ${trovati.size} tranquilli trovati, ${Object.keys(ACCETTATI).length} dichiarati`
  + `  ·  ${statici.length} punti statici, ${veri.length} veri`);
process.exit(failed > 0 ? 1 : 0);

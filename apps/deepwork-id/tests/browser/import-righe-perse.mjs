/* QUANDO SI IMPORTA UN CSV E A UNA RIGA MANCA UN NUMERO, L'APP LO DICE?
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node import-righe-perse.mjs [--porta=8405]
     node import-righe-perse.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il rovescio della passata sui file che ESCONO: qui si
   guardano quelli che ENTRANO. Il `.filter` che scarta una riga sta DENTRO il
   lettore, che restituisce solo i sopravvissuti — quindi fino al 13/08 la
   pagina non poteva dirlo nemmeno volendo. Chi importava 200 righe e ne vedeva
   180 non aveva modo di sapere quali venti mancassero né perché: è l'assenza
   di un dato nella sua forma più tranquilla, cioè il principio del fondatore
   applicato all'INGRESSO invece che all'uscita.
   Misura del 13/08, un CSV di prova per ognuno dei nove lettori (righe
   SCRITTE → righe ENTRATE): squadre 4→3, fatture 6→1, listino 4→1, pesate
   4→2, incassi 5→1, telemetria 5→1, mezzi 4→3, fronti 4→3, rilievi 6→1. Nove
   su nove perdevano righe in silenzio.

   ⚠️ QUELLO CHE LE PROVE `node` NON POSSONO DIRE, e che sta qui. In
   `run-kpi.mjs` c'è che le nove funzioni `scarti<X>Csv` contano e spiegano
   giusto, e che la pagina le importa e le chiama in ogni uscita del gestore.
   Quello è il SORGENTE. Qui si preme il bottone vero, si consegna un file con
   dei buchi, e si legge la frase che compare: è la guardia COLLEGATA contro
   quella scritta — la regola 20 di `run-stile` applicata all'import.

   ⚠️ E IL FILE SI CONSEGNA COL BOTTONE, non scrivendo nello stato: il gestore
   che compone la frase è un `onchange`, e uno stato scritto a mano non lo fa
   scattare. `setInputFiles` funziona anche su un `<input type=file>` nascosto.

   ⚠️ Ogni caso dichiara la sua PRECONDIZIONE — che la pagina sia viva e che
   l'elemento d'esito esista — e se non arriva il banco NON accusa: scrive
   `NON MISURATO`, lo elenca fra le righe «non ho guardato» e esce diverso da
   zero. Un soggetto non misurato non è un soggetto a posto.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8405;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE — `[file, cerca, sostituisci]`, come `scudo-disegni`.
   Due famiglie, e servono tutt'e due perché sono due cose diverse:
     1. la FRASE sparisce → la pagina torna a tacere sulle righe perse;
     2. il COLORE torna tranquillo → il numero sarebbe giusto e a mentire
        resterebbe il disegno, che è la famiglia censita il 06/08.
   Ogni `cerca` compare più volte nella sua pagina (un gestore ha due uscite):
   si sostituiscono TUTTE, e si contano i difetti RIMESSI, non le
   sostituzioni — la pagina viene caricata più volte e un conto crescente
   direbbe «40 su 8». */
const DIFETTI = [
  ["apps/campo/index.html", "frasePersi(scartate)", '""'],
  ["apps/conti/index.html", "frasePersi(scartate)", '""'],
  ["apps/flotta/index.html", "frasePersi(scartate)", '""'],
  ["apps/terra/index.html", "frasePersi(scartate)", '""'],
  ["apps/campo/index.html", 'scartate.persi.length ? "warn"', 'false ? "warn"'],
  ["apps/conti/index.html", 'scartate.persi.length ? "warn"', 'false ? "warn"'],
  ["apps/flotta/index.html", 'scartate.persi.length ? "warn"', 'false ? "warn"'],
  ["apps/terra/index.html", 'scartate.persi.length ? "warn"', 'false ? "warn"'],
];

/* I NOVE CASI. Ogni riga rotta porta con sé la ragione che il modulo deve
   dire, così una ragione cambiata in silenzio fa cadere il banco invece di
   passare inosservata. L'etichetta «riga N» conta le righe di DATI
   (l'intestazione non si conta): è quello che serve a chi apre il file. */
const CASI = [
  { app: "campo", campo: "squ-file", esito: "squ-esito", nome: "squadre",
    intest: "nome;persone;area;stato",
    buone: ["Squadra Alfa;4;Fronte Nord;operativa"],
    rotte: [[";6;Fronte Sud;operativa", "riga 2", "manca il nome della squadra"]] },
  { app: "conti", campo: "fat-file", esito: "ft-esito", nome: "fatture",
    intest: "numero;cliente;importo;emessa;scadenza;incassata",
    buone: ["2099/001;Prova Srl;4400;2026-06-18;2026-07-18;no"],
    rotte: [["2099/002;Prova Due;;2026-06-19;;no", "2099/002", "l'importo non è stato scritto"],
            ["2099/003;Prova Tre;abc;2026-06-20;;no", "2099/003", "l'importo non si legge"]] },
  { app: "conti", campo: "lis-file", esito: "lis-esito", nome: "listino",
    intest: "nome;unita;prezzo;densita;iva",
    buone: ["Misto di prova;t;8,50;1,9;22"],
    rotte: [["Stabilizzato di prova;t;;1,9;22", "Stabilizzato di prova", "il prezzo non è stato scritto"],
            [";t;12,00;1,9;22", "riga 3", "manca il nome del prodotto"]] },
  { app: "conti", campo: "pes-file", esito: "pes-esito", nome: "pesate (ripristino)",
    intest: "numero;data;clienteId;cliente;prodottoId;prodotto;lordo;tara;netto;unitaVendita;"
      + "quantita;densita;prezzoUnitario;scontoPct;aliquotaIva;mezzo;destinatario;fatturaId;ordineId;fontePrezzo",
    buone: ["PX01;2026-03-01;;Prova;;Misto;30;10;20;t;20;1,9;8,5;0;22;TG1;Cant;;;listino"],
    rotte: [["PX02;;;Prova;;Misto;30;10;20;t;20;1,9;8,5;0;22;TG1;Cant;;;listino", "PX02", "la data non è stata scritta"],
            ["PX03;2026-02-30;;Prova;;Misto;30;10;20;t;20;1,9;8,5;0;22;TG1;Cant;;;listino", "PX03", "la data non esiste"]] },
  { app: "conti", campo: "inc-file", esito: "rep-esito", nome: "incassi (ripristino)",
    intest: "fatturaId;data;importo;metodo",
    buone: ["fx1;2026-03-01;1200;bonifico"],
    rotte: [["fx2;2026-03-02;;bonifico", "fx2", "l'importo non è stato scritto"],
            ["fx3;2026-02-30;700;bonifico", "fx3", "la data non esiste"]] },
  { app: "flotta", campo: "mez-file", esito: "ore-esito", nome: "parco mezzi",
    intest: "nome;area;ore;stato",
    buone: ["Escavatore di prova;Fronte Nord;6375;operativo"],
    rotte: [[";Piazzale;100;operativo", "riga 2", "manca il nome del mezzo"]] },
  { app: "flotta", campo: "tele-file", esito: "ore-esito", nome: "telemetria",
    intest: "mezzo;ore;carburante",
    /* (05/09) l'esito dice da quali colonne vengono mezzo, ore e carburante */
    extra: [/Colonne riconosciute: mezzo ← «mezzo», ore ← «ore», carburante ← «carburante»\./, "e dice da quali colonne ha letto mezzo, ore e carburante"],
    buone: ["Escavatore di prova;9000;120"],
    rotte: [["Pala di prova;;95", "Pala di prova", "le ore motore non sono state scritte"],
            ["Dumper di prova;abc;80", "Dumper di prova", "le ore motore non si leggono"]] },
  { app: "terra", campo: "fro-file", esito: "fro-esito", nome: "fronti",
    intest: "nome;banco;quota;stato",
    buone: ["Fronte di prova;Banco A;340;attivo"],
    rotte: [[";Banco D;300;attivo", "riga 2", "manca il nome del fronte"]] },
  { app: "terra", campo: "ril-file", esito: "ril-esito", nome: "rilievi",
    intest: "data;volumeM3;metodo;gsd;fronte",
    buone: ["2026-03-01;1200;RTK;2;"],
    rotte: [["2026-03-02;;RTK;2;", "2026-03-02", "il volume non è stato misurato"],
            ["2026-03-04;-50;RTK;2;", "2026-03-04", "il volume è negativo"]] },
];

let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    let t = corpo.toString("utf8"), tocco = false;
    for (const [file, a, b] of DIFETTI) {
      if (!p.endsWith(file) || !t.includes(a)) continue;
      colpiti.add(file + "|" + a); t = t.split(a).join(b); tocco = true;
    }
    if (tocco) corpo = Buffer.from(t, "utf8");
    iniezioni = colpiti.size;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce — misura la copia di qualcun altro, in silenzio. */
const SEGNO = join(R, "__import-perse-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__import-perse-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const nonMisurati = [];
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};

console.log(`\n════════ le righe che l'import NON fa entrare${CONTROPROVA ? " · controprova" : ""} ════════`);
if (CONTROPROVA) console.log("⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO");

const pagine = new Map();
async function pagina(app) {
  if (pagine.has(app)) return pagine.get(app);
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/${app}/index.html`);
  await pg.waitForTimeout(2600);
  pagine.set(app, pg);
  return pg;
}

for (const c of CASI) {
  console.log(`\n· ${c.app} — ${c.nome}`);
  const pg = await pagina(c.app);
  /* PRECONDIZIONE: la pagina è viva e l'elemento d'esito c'è. Senza, la
     domanda non ha senso e il banco non deve accusare il prodotto. */
  const pronti = await pg.evaluate(([f, e]) =>
    ({ file: !!document.getElementById(f), esito: !!document.getElementById(e) }), [c.campo, c.esito]);
  if (!pronti.file || !pronti.esito) {
    nonMisurati.push(`${c.app}/${c.nome}: NON MISURATO (campo file ${pronti.file ? "c'è" : "assente"}, esito ${pronti.esito ? "c'è" : "assente"})`);
    console.log(`  ⚠️ NON MISURATO — precondizione mancante`);
    continue;
  }
  const righe = [...c.buone, ...c.rotte.map((r) => r[0])];
  const csv = [c.intest, ...righe].join("\n") + "\n";
  await pg.setInputFiles("#" + c.campo, { name: c.nome.replace(/\W+/g, "_") + ".csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  await pg.waitForTimeout(1200);
  const testo = await pg.$eval("#" + c.esito, (e) => (e.textContent || "").replace(/\s+/g, " ").trim()).catch(() => "");
  if (!testo) {
    nonMisurati.push(`${c.app}/${c.nome}: NON MISURATO (dopo l'import l'esito è vuoto)`);
    console.log("  ⚠️ NON MISURATO — nessun messaggio d'esito dopo l'import");
    continue;
  }
  /* 1 · il conto: quante righe non sono entrate. Il numero è quello vero, non
     uno scritto qui: `c.rotte.length`. */
  const n = c.rotte.length;
  const atteso = n === 1 ? "1 riga del file non è entrata" : `${n} righe del file non sono entrate`;
  dice(testo.includes(atteso), `dice quante righe non sono entrate («${atteso}»)`, testo);
  /* 2 · e CHI, e PERCHÉ — una per una. Un conto giusto con una ragione
     sbagliata costa più di nessuna ragione, perché chi legge ci crede. */
  for (const [, etichetta, ragione] of c.rotte) {
    dice(testo.includes(`«${etichetta}»`), `dice DI CHI si parla («${etichetta}»)`, testo);
    dice(testo.includes(ragione), `e PERCHÉ («${ragione}»)`, testo);
  }
  /* 3 · il colore segue la cosa peggiore successa: un verde tranquillo accanto
     a «due righe non sono entrate» è la contraddizione fra numero e disegno. */
  const cls = await pg.$eval("#toast", (e) => e.className).catch(() => "(nessun toast)");
  dice(/\bwarn\b/.test(cls), `e l'avviso NON esce col colore tranquillo (toast «${cls}»)`, cls);
  /* 4 · le righe SANE sono entrate davvero: senza questa, un import che non
     importa niente passerebbe tutte le prove qui sopra. */
  dice(!/^Nessun/.test(testo), "e le righe buone sono entrate (non è il caso «non è entrato niente»)", testo);
  /* 5 · e, dove il caso lo dichiara, la frase in più che l'import deve dire */
  if (c.extra) dice(c.extra[0].test(testo), c.extra[1], testo);
}

/* ⛔ LE RIGHE «NON HO GUARDATO» SI LEGGONO PRIME DEI KO, e il banco non può
   uscire zero se qualcosa non è stato misurato: un soggetto non misurato non
   è un soggetto a posto. */
console.log(`\n════════ riepilogo ════════`);
console.log(`${CASI.length} import provati · ${prove} prove · ${ok} passate, ${ko} fallite`);
if (nonMisurati.length) {
  console.log(`⚠️ NON MISURATI: ${nonMisurati.length} su ${CASI.length}`);
  for (const r of nonMisurati) console.log(`   · ${r}`);
}
await b.close(); srv.close();

if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} difetti su ${DIFETTI.length} rimessi nella risposta HTTP`);
  if (iniezioni < DIFETTI.length) {
    console.log("⚠️ QUALCHE DIFETTO NON È STATO RIMESSO: la controprova non prova quello che dice");
    process.exit(3);
  }
  /* ⛔ LA SOGLIA SI DERIVA, NON SI SCRIVE. Un numero atteso scritto a mano
     invecchia al primo caso aggiunto e accusa il prodotto per una cosa che ha
     fatto il banco (07/08). Qui la regola è esatta: con la frase tolta cade
     OGNI prova tranne l'ultima di ciascun caso — «le righe buone sono
     entrate», che guarda l'import e non il messaggio, e che resta
     giustamente verde. Quindi le cadute attese sono `prove - CASI.length`,
     e sono anche il modo di accorgersi se una prova che NON punta al difetto
     cadesse lo stesso. Misura del 13/08: 57 prove, 48 cadute, 9 in piedi. */
  const SOGLIA = prove - CASI.length;
  console.log(ko >= SOGLIA ? "✓ il banco SA fallire: rimessi i difetti cadono le prove giuste"
                           : `⚠️ troppo poche cadute (${ko}, ne servono ${SOGLIA})`);
  process.exit(ko >= SOGLIA && !nonMisurati.length ? 0 : 1);
}
process.exit(ko || nonMisurati.length ? 1 : 0);

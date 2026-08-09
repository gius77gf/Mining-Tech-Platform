/* I DOCUMENTI DI CAMPO NON DICHIARANO ZERI CHE NESSUNO HA MISURATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-numeri-tranquilli.mjs [--porta=8563]
     node campo-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il censimento statico su Campo era a zero, e la prima passata
   aveva già sistemato il testo che usciva dal riquadro. Questi tre difetti sono
   usciti come su Terra: chiamando le funzioni coi casi limite veri e poi
   APRENDO la pagina a premere i bottoni. Tutti e tre stanno in cose che ESCONO
   dall'app — un file CSV, una frase di confronto, un rapporto stampato:

   1. il CSV DELLO STORICO scriveva `2026-07-14;0;0;3` su una giornata con tre
      guasti e nessun minuto misurato: identica, colonna per colonna, a una
      giornata senza un fermo. Lo schermo, sulla stessa riga, scrive già
      «senza minuti» (`minutiFermoTesto`), quindi le due uscite dello stesso
      dato dicevano cose diverse. E la colonna della produzione scriveva `0`
      dove lo schermo scrive «nessuna registrazione»;
   2. lo STORICO DELLA SETTIMANA lasciava sparire, dentro un `continue`, ogni
      registrazione senza giorno di lavoro o con un giorno che non esiste
      («2026-02-30»). Con la sola dimostrazione sono 2.300 t dichiarate che il
      cartellone non nomina; costruendo il caso peggiore (tutto senza data) il
      cartellone scrive «0 giornate registrate su 7 · Prodotto: niente
      registrato». `fermiSenzaGiorno` faceva già questo conto accanto al
      grafico dei fermi: mancava per il resto dello storico;
   3. la frase del PONTE CON TERRA contava i rapportini entrati nei metri cubi
      come `turni − (viaggi > 0 ? 1 : 0)`, cioè toglieva UN rapportino quando
      `viaggi` è la SOMMA dei viaggi, non il loro numero. Con 3 rapportini in
      viaggi diceva «4 rapportini» dove ne avevano contribuito 2 — un numero
      sbagliato in modo credibile, perché sta fra il vero e il totale.

   ── seconda passata, 07/08: «premi il bottone e apri il file» ──────────────
   4. IL RAPPORTO DI FINE TURNO E LA CONSEGNA attribuivano al giorno stampato
      chi il giorno non ce l'ha. `eDelGiorno` tiene DENTRO la giornata corrente
      le registrazioni senza data — di proposito, perché un dato vecchio non
      deve sparire — quindi i loro chili entrano nei totali di OGGI. Lo schermo
      lo dichiara DUE volte («(1 rapportino ancora senza data)» accanto alla
      copertura e «senza data» sulla riga della lista); i due documenti datati
      che si consegnano e si archiviano, zero. Sulla sola dimostrazione il
      foglio intestato «Rapporto di fine turno — 07/08/2026» scriveva

          Produzione | Mattina | 2.510 t | Totale | 2.510 t
          Rapportini | Rapportino trasporti | Squadra B · Mattina | 2.300 t

      cioè 2.300 t su 2.510 attribuite a un turno e a un giorno che nessuno ha
      dichiarato — mentre il CSV dello storico della STESSA app (difetto 2 qui
      sopra) quelle tonnellate le scrive in una riga con la data VUOTA. Due
      file, gli stessi chili, due giorni diversi.
      ⚠️ Il NUMERO non era sbagliato: 2.510 è quello che dice anche lo schermo.
      Mancava la DICHIARAZIONE. Per questo il banco confronta il totale del
      documento con quello a schermo e pretende che siano UGUALI — un banco che
      pretendesse un numero diverso starebbe chiedendo un difetto nuovo.
      La regola giusta era già nel modulo (`registrazioniSenzaGiorno`), usata
      dallo storico e non dai due documenti: la copia debole nel posto che
      CLAUDE.md indica — dove il documento si compone. Difesa:
      `senzaGiornoDiLavoro` (la domanda, una volta sola) e `avvisoSenzaGiorno`
      (la frase), tutt'e due provate in `run-kpi.mjs`.
   5. LE FRASI CHE ACCOMPAGNANO I FILE, COL NUMERO UNO — stessa famiglia di
      `flotta-frasi-da-uno.mjs`, misurata costruendo una cava con una squadra,
      una persona, un'attività e un rapportino: «Elenco per l'appello
      esportato: **1 persone**», «**Esportate 1 attività**», «**Esportate 1
      squadre**», «Consegna di turno esportata: **1 rapportini e 1 causali** di
      fermo», e sulla scheda della squadra «**1 persone**». `conta` e `plurale`
      erano in `shared/` da mesi. Sono le frasi che dicono all'utente che cosa
      c'è dentro il file che ha appena salvato.

   ⚠️ NESSUNO DEI TRE LO PRENDE UNA SUITE `node` DA SOLA: le funzioni nuove
   sono provate in `run-kpi.mjs`, ma che la PAGINA le chiami, e che il file
   scaricato e la frase sullo schermo siano quelli, lo dice solo il browser.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, mai nel documento: si aggiunge una riga
   alla risposta HTTP di `campo-data.js`, cioè si passa dalla via vera. Il file
   su disco non si tocca. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8563;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE. Si contano quelli che hanno trovato il loro pezzo di
   pagina: un `replace` che non sostituisce niente esce in silenzio, e una
   controprova che non inietta niente dichiara «non so fallire» per il motivo
   sbagliato. */
const DIFETTI = [
  // 1 · il CSV dello storico costruito a mano, con gli zeri di comodo
  ["a.href = \"data:text/csv;charset=utf-8,\" + encodeURIComponent(csvStorico(SET_RIGHE, fuori));",
   "a.href = \"data:text/csv;charset=utf-8,\" + encodeURIComponent((() => {"
   + " const u = [...new Set(SET_RIGHE.flatMap(g => Object.keys(g.prod)))].sort();"
   + " let c = \"data;\" + u.map(x => \"prodotto_\" + x).join(\";\") + (u.length ? \";\" : \"\")"
   + " + \"minuti_fermo;fermi;attivita_totali;attivita_concluse;rapportini_inviati\\n\";"
   + " for (const g of SET_RIGHE) c += `${g.data};${u.map(x => g.prod[x] || 0).join(\";\")}${u.length ? \";\" : \"\"}`"
   + " + `${g.minutiFermo};${g.fermi};${g.attTot};${g.attConcluse};${g.rapInviati}\\n`; return c; })());"],
  // 2 · l'avviso delle registrazioni che non stanno in nessuna giornata
  ["$(\"set-fuori\").innerHTML = !fuori.totale ? \"\" :",
   "$(\"set-fuori\").innerHTML = true ? \"\" :"],
  // 2b · e il cartellone che tornava a dire «niente registrato»
  ["(fuori.totale ? \"niente che stia in una giornata\" : \"niente registrato\")",
   "\"niente registrato\""],
  // 3 · la sottrazione a mano del ponte con Terra
  ["const inConto = rapportiniInConto(r.dich);",
   "const inConto = { conto: r.dich.turni - (r.dich.viaggi > 0 ? 1 : 0), delPeriodo: r.dich.turni, noto: true };"],
  // 4 · la riga dei rapportini nel rapporto stampato, con l'unità GREZZA
  ["}${(() => { const p = produzioneDi(r); return p ? esc(formattaProduzione(p.qta, p.unita)) : esc(r.produzione || \"—\"); })()}</td>",
   "}${esc(+r.prodQta>0?formattaProduzione(r.prodQta,r.prodUnita):(r.produzione||\"—\"))}</td>"],
  /* 5 · l'avviso «senza il giorno di lavoro» sui due documenti DATATI. La riga
     è la stessa nella consegna e nel rapporto, quindi questa sola sostituzione
     li spegne tutt'e due — ed è giusto così: è UNA decisione. */
  ["const fuoriOggi = avvisoSenzaGiorno(ATT_OGGI, RAP_OGGI);",
   "const fuoriOggi = \"\";"],
  // 5b · e le tre RIGHE che se lo portavano addosso
  ["senzaGiornoDiLavoro(r) ? \" [SENZA DATA]\" : \"\"", "false ? \" [SENZA DATA]\" : \"\""],
  ["senzaGiornoDiLavoro(a)?", "false?"],
  ["senzaGiornoDiLavoro(r)?", "false?"],
  // 6 · le frasi col numero UNO che accompagnano i file
  ["conta(app.totale, \"persona\", \"persone\")", "app.totale + \" persone\""],
  ["plurale(SQU.length, \"Esportata \", \"Esportate \") + conta(SQU.length, \"squadra\", \"squadre\")",
   "\"Esportate \" + SQU.length + \" squadre\""],
  ["plurale(ATT_G.length, \"Esportata \", \"Esportate \") + conta(ATT_G.length, \"attività\", \"attività\")",
   "\"Esportate \" + ATT_G.length + \" attività\""],
  ["conta(RAP_OGGI.length, \"rapportino\", \"rapportini\") + \" e \" + conta(fermi.length, \"causale di fermo\", \"causali di fermo\")",
   "RAP_OGGI.length + \" rapportini e \" + fermi.length + \" causali di fermo\""],
  ["conta(q.persone, \"persona\", \"persone\")", "q.persone + \" persone\""],
  /* 7 · la media dei fermi divisa per TUTTE le colonne, comprese le giornate in
     cui non è stato registrato niente */
  ["const mf = mediaFermiAlGiorno(righe);",
   "const mf = { media: Math.round(righe.reduce((t, r) => t + r.minuti, 0) / righe.length),"
   + " giorniMisurati: righe.length, giorniVuoti: 0,"
   + " giorni: righe.length, totale: righe.reduce((t, r) => t + r.minuti, 0) };"],
  // 8 · il cartellone del meteo che prende il verde senza aver guardato tutto
  ["${brutto ? \"warn\" : (bloc && sm.stato === \"buono\" ? \"ok\" : \"\")}",
   "${brutto ? \"warn\" : (bloc ? \"ok\" : \"\")}"],
];

/* IL CASO DA COSTRUIRE, scelto prima di ogni `goto`. Si aggiunge in coda al
   modulo dati: `DEMO` è un oggetto, e la pagina ne fa una copia all'avvio. */
let FIXTURE = "";
// tutte le registrazioni perdono il giorno: è il caso peggiore dello storico
const FIXTURE_SENZA_GIORNO = `
DEMO.rapportini.forEach(r => { r.data = ""; });
DEMO.attivita.forEach(a => { a.data = ""; });
DEMO.attivita[0].data = "2026-02-30";
`;
// una giornata con tre fermi e nessun minuto scritto (ieri, dentro i 7 giorni)
const FIXTURE_FERMI_MUTI = `
{
  const ieri = (() => { const d = new Date(); d.setDate(d.getDate() - 1);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); })();
  DEMO.attivita.push(
    { id: "zz1", data: ieri, turno: "Mattina", titolo: "Nastro fermo", squadra: "Squadra A", stato: "anomalia", causale: "Guasto meccanico" },
    { id: "zz2", data: ieri, turno: "Mattina", titolo: "Frantoio fermo", squadra: "Squadra C", stato: "anomalia", causale: "Intasamento impianto" },
    { id: "zz3", data: ieri, turno: "Notte", titolo: "Pala ferma", squadra: "Squadra B", stato: "anomalia", causale: "Attesa mezzo" });
}
`;
// tre rapportini in VIAGGI dentro l'intervallo fra gli ultimi due rilievi:
// niente di quei viaggi entra nei metri cubi, quindi il conto è incompleto
const FIXTURE_VIAGGI = `
{
  const gf = (n) => { const d = new Date(); d.setDate(d.getDate() - n);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
  DEMO.rapportini.push(
    { id: "zv1", data: gf(11), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 12, prodUnita: "viaggi", ora: "05:00", stato: "inviato" },
    { id: "zv2", data: gf(10), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 9, prodUnita: "viaggi", ora: "05:00", stato: "inviato" },
    { id: "zv3", data: gf(9), turno: "Notte", titolo: "Trasporti notte", squadra: "Squadra B", prodQta: 7, prodUnita: "viaggi", ora: "05:00", stato: "inviato" });
}
`;

let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/campo/campo-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/campo/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    iniezioni = colpiti.size;
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e non fallisce mai. */
const SEGNO = join(R, "__campo-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__campo-numeri-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* Apre Campo e va in una sezione PRETENDENDO la prova di aver navigato: il
   selettore è l'id del BOTTONE, e un banco che non naviga risponde «tutto a
   posto» dopo aver guardato una schermata su cinque. */
async function apri(bottone) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/campo/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
/* Intercetta la finestra della stampa e il salvataggio del CSV: sono i due modi
   con cui un documento esce dall'azienda. */
async function intercetta(pg) {
  await pg.evaluate(() => {
    window.__doc = null; window.__csv = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close: () => {} },
      focus: () => {}, print: () => {} });
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      /* ⛔ QUALUNQUE tipo, non solo `text/csv`: la consegna di turno esce in
         `text/plain` e con la vecchia forma (che toglieva un prefisso solo)
         restava incollata al suo `data:…,`. Una firma troppo stretta, e la
         copia sarebbe stata un secondo intercettatore. */
      if (this.download) {
        window.__csv = decodeURIComponent(String(this.href).replace(/^data:[^,]*,/, ""));
        window.__nome = this.download;
        return;
      }
      return clic.apply(this, arguments);
    };
  });
}
import { azzeraFrasi, frasiVisibili, contiNellaFrase, righeDiDato } from "./giro.mjs";
/* ⛔ LA TERZA GAMBA DELLA DOMANDA DI CASA: la frase di riepilogo contro il file.
   La regola sta in `giro.mjs` — la usano Flotta, Conti e Scudo — e la domanda è
   che le righe di DATO stiano fra i numeri che la frase dichiara, o siano la
   loro somma.
   ⚠️ Qui NON si mette un ciclo in coda: questo banco rilegge il file dentro
   scenari suoi, ognuno con la propria FIXTURE, e un ciclo finale misurerebbe il
   file di uno scenario contro la frase di un altro. Il confronto si chiama
   dove ciascuno scenario legge. */
async function confrontaFraseColFile(pg, btn, righe, inPiu = 0) {
  /* `inPiu` è per il caso — misurato su Campo — in cui la frase dichiara una
     riga in più **a parole invece che con un numero**: «Esportate 7 giornate…
     in coda c'è LA RIGA senza giorno». Il file ne ha 8, e la frase è onesta:
     dice che quella riga c'è, semplicemente non la conta. Chi chiama dichiara
     quante righe sono annunciate così, invece di allargare la regola
     condivisa — allargarla vorrebbe dire far passare anche i casi in cui una
     riga sparisce davvero. */
  const frase = await frasiVisibili(pg);
  const numeri = contiNellaFrase(frase);
  if (!numeri.length) return false;
  const dati = righeDiDato(righe) - inPiu;
  dice(numeri.includes(dati) || numeri.reduce((t, x) => t + x, 0) === dati,
    `le righe del file sono fra i numeri che la frase dichiara (${btn})`,
    /* ⚠️ il `dice` di questo banco fa `String(x)` sull'extra, quindi un oggetto
       diventa «[object Object]» e la prova non si può giudicare: gli si passa
       già una frase. Un banco che non sa dire PERCHÉ è caduto costringe a
       rifare la misura a mano. */
    `frase «${frase.slice(0, 90)}» · numeri [${numeri}] · righe di dato ${dati}`);
  return true;
}
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

console.log(`\n════════ i documenti di Campo e gli zeri mai misurati${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · IL CSV DELLO STORICO ──────────────────────────────────────────────
console.log("\n· tre guasti e nessun minuto scritto: il file che si apre col foglio di calcolo");
FIXTURE = FIXTURE_FERMI_MUTI;
{
  const pg = await apri("nav-set");
  await intercetta(pg);
  await azzeraFrasi(pg);
  await pg.click("#btn-set-export");
  await pg.waitForTimeout(400);
  const righe = String(await pg.evaluate(() => window.__csv) || "").split("\n");
  await confrontaFraseColFile(pg, "btn-set-export", righe.filter(Boolean));
  const testa = righe[0] || "";
  dice(righe.length > 5, "il file viene prodotto davvero", righe.length + " righe");
  dice(/;fermi;fermi_senza_minuti;/.test(testa),
    "⛔ l'intestazione porta la colonna «fermi_senza_minuti»", testa);
  // la giornata di ieri: tre fermi, nessun minuto → cella dei minuti VUOTA
  const ieri = (() => { const d = new Date(); d.setDate(d.getDate() - 1);
    const p = (x) => String(x).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); })();
  const rIeri = righe.find((r) => r.startsWith(ieri)) || "";
  const col = testa.split(";"), cel = rIeri.split(";");
  const iMin = col.indexOf("minuti_fermo"), iSen = col.indexOf("fermi_senza_minuti");
  dice(iMin > 0 && cel[iMin] === "",
    "⛔ tre fermi mai misurati: la cella dei minuti resta VUOTA, non «0»", rIeri);
  dice(iSen > 0 && cel[iSen] === "3",
    "e la colonna dice che i tre fermi sono senza minuti", rIeri);
  // una giornata senza nessuna registrazione: produzione vuota, non zero
  const iProd = col.findIndex((c) => c.startsWith("prodotto_"));
  const vuote = righe.slice(1).filter((r) => r && r.split(";")[col.indexOf("attivita_totali")] === "0"
    && r.split(";")[col.indexOf("rapportini_inviati")] === "0");
  dice(iProd > 0 && vuote.length > 0 && vuote.every((r) => r.split(";")[iProd] === ""),
    `⛔ nelle ${vuote.length} giornate senza registrazioni la produzione è VUOTA, non «0»`,
    vuote[0]);
  await pg.close();
}

// ── 2 · QUELLO CHE LO STORICO NON SA COLLOCARE ────────────────────────────
console.log("\n· tutte le registrazioni senza giorno: il cartellone che diceva «niente registrato»");
FIXTURE = FIXTURE_SENZA_GIORNO;
{
  const pg = await apri("nav-set");
  const board = testo(await pg.evaluate(() => document.getElementById("set-board").innerHTML));
  const avviso = testo(await pg.evaluate(() => document.getElementById("set-fuori").innerHTML));
  dice(/0\s*Giornate registrate su 7/i.test(board),
    "lo storico per giornate resta a zero: è il buco da dichiarare, non da tappare", board.slice(0, 120));
  dice(!/Prodotto:\s*niente registrato/.test(board),
    "⛔ il cartellone NON dice più «Prodotto: niente registrato»",
    (board.match(/Prodotto:[^·]*/) || [])[0]);
  dice(/niente che stia in una giornata/.test(board),
    "e al suo posto dice che niente sta in una giornata",
    (board.match(/Prodotto:[^·]*/) || [])[0]);
  dice(/non entrano in nessuna giornata/.test(avviso),
    "⛔ e l'avviso esiste e dice quante registrazioni sono", avviso.slice(0, 200));
  dice(/\bt\b/.test(avviso) && /rapportin/.test(avviso),
    "con quante tonnellate portano con sé", avviso.slice(0, 240));
  // e il file che esce porta la riga con la data vuota
  await intercetta(pg);
  await azzeraFrasi(pg);
  await pg.click("#btn-set-export");
  await pg.waitForTimeout(400);
  const righe = String(await pg.evaluate(() => window.__csv) || "").split("\n").filter(Boolean);
  /* la frase annuncia A PAROLE la riga in coda senza giorno («in coda c'è la
     riga senza giorno con 15 rapportini»): è una riga dichiarata, non persa. */
  await confrontaFraseColFile(pg, "btn-set-export (fermi muti)", righe, 1);
  const ultima = righe[righe.length - 1] || "";
  dice(/^;/.test(ultima) && /\d/.test(ultima),
    "⛔ nel file la riga senza giorno esce con la data vuota e i suoi numeri", ultima);
  await pg.close();
}

// ── 3 · LA FRASE DEL PONTE CON TERRA ──────────────────────────────────────
console.log("\n· tre rapportini in viaggi: quanti sono entrati davvero nei metri cubi");
FIXTURE = FIXTURE_VIAGGI;
{
  const pg = await apri("nav-rap");
  await pg.waitForTimeout(1200);
  const terra = testo(await pg.evaluate(() => document.getElementById("rap-terra").innerHTML));
  dice(terra.length > 60, "il confronto con Terra viene disegnato", terra.slice(0, 160));
  dice(/su \d+ rapportini del periodo/.test(terra),
    "⛔ col conto incompleto si dice «su N rapportini del periodo», non un numero preciso",
    (terra.match(/dichiarati[^:]*:/) || [])[0] || terra.slice(0, 200));
  dice(!/m³ \(\d+ rapportin/.test(terra),
    "⛔ e non compare più il numero preciso che la sottrazione a mano sbagliava",
    (terra.match(/\(\d+ rapportin[^)]*\)/) || [])[0]);
  dice(/Conto incompleto/.test(terra),
    "la seconda nota dice che il conto è incompleto e perché", terra.slice(-220));
  await pg.close();
}

// ── 4 · IL RAPPORTO STAMPATO ──────────────────────────────────────────────
/* ⚠️ IL CASO VA COSTRUITO, se no l'asserzione passa perché non c'è niente da
   prendere: nella dimostrazione nessun rapportino ha un'unità fuori
   vocabolario, e un «nessuna unità sbagliata» su zero soggetti è il controllo
   che non guarda dove crede. Qui si aggiunge un rapportino d'archivio scritto
   «m3» (senza il ³) — la forma che un import o una collezione vecchia produce:
   `produzioneDi` la normalizza a tonnellate per la SOMMA, e la riga stampata
   deve dire la stessa cosa invece di stampare «m3» com'era scritto. */
console.log("\n· il rapporto di fine turno: la produzione si legge in un modo solo");
FIXTURE = `
{
  const p = (x) => String(x).padStart(2, "0"); const d = new Date();
  const oggi = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  DEMO.rapportini.push({ id: "zu1", data: oggi, turno: "Mattina", titolo: "Rapportino di archivio",
    squadra: "Squadra A", prodQta: 500, prodUnita: "m3", ora: "12:00", stato: "inviato" });
}
`;
{
  const pg = await apri("nav-rap");
  await intercetta(pg);
  await pg.click("#btn-rapporto-turno");
  await pg.waitForTimeout(500);
  const doc = testo(await pg.evaluate(() => window.__doc));
  dice(doc.length > 1200, "il rapporto viene prodotto davvero", doc.length);
  dice(/Rapporto di fine turno/.test(doc), "ed è il rapporto giusto", doc.slice(0, 80));
  // l'unità stampata è una di quelle ammesse: mai una scritta a caso presa
  // dall'archivio e stampata com'è mentre il totale la somma come tonnellate
  dice(/Rapportino di archivio/.test(doc), "il rapportino d'archivio è nel documento (il caso c'è)",
    (doc.match(/Rapportino di archivio[^|]{0,60}/) || [])[0]);
  const unita = [...doc.matchAll(/\d[\d.,]*\s+(m3|mc|MC|M³)\b/g)].map((m) => m[1]);
  dice(unita.length === 0,
    `⛔ nessuna unità fuori dal vocabolario nel documento (${unita.length} trovate)`, unita.join(","));
  dice(/500 t/.test(doc),
    "e i 500 sono scritti nell'unità con cui il totale li somma", (doc.match(/500 \S+/) || [])[0]);
  await pg.close();
}

/* ── 5 · I DUE DOCUMENTI DATATI E IL GIORNO CHE NESSUNO HA DICHIARATO ──────
   ⛔ IL DIFETTO, misurato il 07/08 premendo il bottone e aprendo il file.
   `eDelGiorno` tiene DENTRO la giornata corrente chi la data non ce l'ha — di
   proposito, con la ragione scritta nel modulo: un dato vecchio non deve
   sparire. Effetto: quei chili entrano nei totali di OGGI. Lo schermo lo
   dichiara DUE volte («(1 rapportino ancora senza data)» accanto alla
   copertura e «senza data» sulla riga della lista); il RAPPORTO DI FINE TURNO
   e la CONSEGNA DI TURNO — i due documenti datati che si consegnano e si
   archiviano — zero. Sulla sola dimostrazione, il foglio intestato «Rapporto
   di fine turno — 07/08/2026» scriveva

       Produzione | Mattina | 2.510 t | Totale | 2.510 t
       Rapportini | Rapportino trasporti | Squadra B · Mattina | 2.300 t

   cioè attribuiva al turno Mattina di quel giorno 2.300 t su 2.510 di cui
   nessuno ha dichiarato il giorno — e la STESSA app, nel CSV dello storico
   (blocco 2 qui sopra), quelle stesse tonnellate le scrive in una riga con la
   data VUOTA. Due file, gli stessi chili, due giorni diversi.
   ⚠️ E il numero NON è sbagliato: 2.510 è quello che dice anche lo schermo.
   Quello che manca al file è la DICHIARAZIONE che lo schermo ha e lui no —
   per questo il banco confronta il totale del documento con quello a schermo
   e pretende che siano uguali, non che il documento ne scriva un altro. */
console.log("\n· il rapporto e la consegna: il giorno che nessuno ha dichiarato");
FIXTURE = `
{
  const p = (x) => String(x).padStart(2, "0"); const d = new Date();
  const oggi = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  DEMO.rapportini = [
    { id: "zg1", data: oggi, turno: "Mattina", titolo: "Turno datato", squadra: "Squadra A",
      prodQta: 210, prodUnita: "t", ora: "13:00", stato: "inviato" },
    { id: "zg2", data: "", turno: "Mattina", titolo: "Turno senza giorno", squadra: "Squadra B",
      prodQta: 2300, prodUnita: "t", ora: "13:00", stato: "inviato" }];
  DEMO.attivita = [
    { id: "zg3", data: oggi, turno: "Mattina", titolo: "Attivita datata", squadra: "Squadra A", stato: "conclusa" },
    { id: "zg4", data: "", turno: "Mattina", titolo: "Attivita senza giorno", squadra: "Squadra A", stato: "anomalia", causale: "Guasto meccanico", fermoMin: 20 }];
}
`;
{
  const pg = await apri("nav-rap");
  // quello che lo SCHERMO dice sulla stessa giornata: è il metro di paragone
  const schermo = testo(await pg.evaluate(() => document.body.innerText));
  dice(/senza data/.test(schermo), "lo schermo dichiara «senza data» (il metro c'è)",
    (schermo.match(/.{0,60}senza data.{0,40}/) || [])[0]);
  const totSchermo = (schermo.match(/Produzione di oggi:\s*([\d.,]+ t)/) || [])[1] || "";
  dice(totSchermo === "2.510 t", "e il totale a schermo è 2.510 t", totSchermo);

  await intercetta(pg);
  await pg.click("#btn-consegna");
  await pg.waitForTimeout(400);
  const cons = String(await pg.evaluate(() => window.__csv) || "");
  const nomeCons = String(await pg.evaluate(() => window.__nome) || "");
  dice(/consegna_turno\.txt$/.test(nomeCons), "la consegna di turno esce davvero", nomeCons);
  dice(cons.includes("- totale: " + totSchermo),
    "⛔ il totale del file è QUELLO DELLO SCHERMO: il numero non è il difetto",
    (cons.match(/- totale:.*/) || [])[0]);
  dice(/ATTENZIONE: .*senza il giorno di lavoro/.test(cons),
    "⛔ e sotto il totale la consegna dichiara chi il giorno non ce l'ha",
    (cons.match(/- ATTENZIONE:.*/) || [])[0] || cons.slice(0, 300));
  dice(/2\.300 t/.test((cons.match(/- ATTENZIONE:.*/) || [""])[0]),
    "dicendo anche quanti chili sono", (cons.match(/- ATTENZIONE:.*/) || [])[0]);
  dice(/Turno senza giorno .*\[SENZA DATA\]/.test(cons),
    "⛔ e la RIGA del rapportino lo porta addosso, non solo il totale in fondo",
    (cons.match(/- Turno senza giorno.*/) || [])[0]);
  dice(!/Turno datato.*\[SENZA DATA\]/.test(cons),
    "mentre il rapportino datato non se lo prende", (cons.match(/- Turno datato.*/) || [])[0]);

  await pg.click("#btn-rapporto-turno");
  await pg.waitForTimeout(500);
  const doc = testo(await pg.evaluate(() => window.__doc));
  dice(doc.includes("Rapporto di fine turno"), "il rapporto stampato esce davvero", doc.length);
  dice(doc.includes(totSchermo), "⛔ e porta lo stesso totale dello schermo", totSchermo);
  dice(/Attenzione\s+—\s+.*senza il giorno di lavoro/.test(doc),
    "⛔ con l'avviso in cima, sotto il Quadro",
    (doc.match(/Attenzione[^|]{0,200}/) || [])[0] || doc.slice(0, 300));
  const rigaRap = (doc.match(/Turno senza giorno[^|]{0,80}/) || [])[0] || "";
  dice(/senza data/.test(rigaRap),
    "⛔ la riga del rapportino dice «senza data» invece di attribuirlo al turno stampato", rigaRap);
  /* ⚠️ E QUI IL BANCO HA SBAGLIATO MIRA LA PRIMA VOLTA, con la misura che lo
     dice: il caso era un'attività datata «2026-02-30». Non arriva mai in
     questo foglio, perché `eDelGiorno` è ASIMMETRICA di proposito — la data
     VUOTA la tiene dentro il giorno corrente (un dato vecchio non deve
     sparire), un giorno che non esiste lo lascia fuori da TUTTI i giorni. Chi
     lo raccoglie è `registrazioniSenzaGiorno`, cioè il CSV dello storico del
     blocco 2. Il soggetto giusto per un documento di oggi è la data vuota. */
  const rigaAtt = (doc.match(/.{0,60}Attivita senza giorno/) || [])[0] || "";
  dice(/senza data/.test(rigaAtt),
    "⛔ e anche la riga dell'attività che il giorno non ce l'ha", rigaAtt);
  dice(!/senza data\s*Attivita datata/.test(doc),
    "mentre l'attività datata non se lo prende",
    (doc.match(/.{0,50}Attivita datata/) || [])[0]);
  await pg.close();
}

/* ── 6 · I MESSAGGI CHE ACCOMPAGNANO I FILE, COL NUMERO UNO ────────────────
   Stessa famiglia di `flotta-frasi-da-uno.mjs`, misurata su Campo il 07/08
   costruendo una cava con una squadra, una persona, un'attività e un
   rapportino: «Elenco per l'appello esportato: 1 persone», «Esportate 1
   attività», «Esportate 1 squadre», «Consegna di turno esportata: 1
   rapportini e 1 causali di fermo» — e sulla scheda della squadra, «1
   persone». `conta` e `plurale` erano in `shared/` da mesi.
   ⚠️ Sono le frasi che si leggono DOPO aver premuto il bottone, cioè quelle
   che dicono all'utente che cosa c'è dentro il file che ha appena salvato. */
console.log("\n· una squadra, una persona, un'attività, un rapportino: le frasi col numero UNO");
FIXTURE = `
{
  const p = (x) => String(x).padStart(2, "0"); const d = new Date();
  const oggi = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  DEMO.squadre = [{ id: "u1", nome: "Squadra A", persone: 1, area: "Fronte nord", stato: "operativa" }];
  DEMO.operatori = [{ id: "u2", nome: "Mario Rossi", ruolo: "Pala", squadra: "Squadra A", stato: "disponibile" }];
  DEMO.presenze = [{ id: "u3", data: oggi, turno: "Mattina", operatoreId: "u2", stato: "presente", ora: "06:05", entrata: "06:00", uscita: "14:00" }];
  DEMO.attivita = [{ id: "u4", data: oggi, turno: "Mattina", titolo: "Tiro nastro", squadra: "Squadra A", stato: "anomalia", causale: "Guasto meccanico", fermoMin: 1 }];
  DEMO.rapportini = [{ id: "u5", data: oggi, turno: "Mattina", titolo: "Turno mattina", squadra: "Squadra A", prodQta: 1, prodUnita: "t", ora: "14:00", stato: "inviato" }];
  DEMO.obiettivi = []; DEMO.checklist = []; DEMO.chiusure = []; DEMO.meteo = []; DEMO.durate = [];
}
`;
{
  const pg = await apri("nav-squ");
  await intercetta(pg);
  // il testo che compare dopo il bottone: `esito(...)` scrive nel riquadro,
  // e lo stesso messaggio passa dal toast del core
  const premi = async (bottone, riquadro) => {
    await pg.evaluate((r) => { const e = document.getElementById(r); if (e) e.textContent = ""; }, riquadro);
    await pg.click("#" + bottone).catch(() => {});
    await pg.waitForTimeout(300);
    return String(await pg.evaluate((r) => { const e = document.getElementById(r); return e ? e.innerText.trim() : ""; }, riquadro));
  };
  const scheda = testo(await pg.evaluate(() => document.getElementById("squ-list").innerHTML));
  dice(/\b1 persona\b/.test(scheda) && !/\b1 persone\b/.test(scheda),
    "⛔ la scheda della squadra dice «1 persona», non «1 persone»",
    (scheda.match(/.{0,30}1 person[ae].{0,20}/) || [])[0]);

  const frasi = [
    ["btn-squ-export", "squ-esito", /^Esportata 1 squadra\b/, "Esportata 1 squadra"],
    /* ⚠️ NIENTE `\\b` DOPO «attività»: la «à» non è un carattere di parola, il
       confine fra lei e lo spazio non esiste, e l'asserzione falliva su una
       frase GIUSTA. Il righello, non il soggetto. */
    ["btn-att-export", "att-esito", /^Esportata 1 attività /, "Esportata 1 attività"],
    ["btn-consegna", "rap-esito", /\b1 rapportino e 1 causale di fermo\b/, "1 rapportino e 1 causale di fermo"],
    /* ⚠️ e l'elenco per l'appello sta in `page-rap`, non fra le squadre:
       misurato, il bottone lì è largo 0×0 e il click va in timeout. */
    ["btn-pre-export", "pre-esito", /^Elenco per l'appello esportato: 1 persona\.$/, "Elenco per l'appello esportato: 1 persona."],
  ];
  let misurate = 0;
  for (const [b, r, atteso, nome] of frasi) {
    // le tre sezioni stanno in pagine diverse: si naviga prima di premere
    const sezione = { "btn-squ-export": "nav-squ", "btn-att-export": "nav-att",
                      "btn-consegna": "nav-rap", "btn-pre-export": "nav-rap" }[b];
    await pg.click("#" + sezione).catch(() => {});
    await pg.waitForTimeout(400);
    const t = await premi(b, r);
    misurate++;
    dice(atteso.test(t), `⛔ «${nome}»`, t);
  }
  console.log(`     (${misurate} frasi misurate premendo il bottone, non lette nel codice)`);
  await pg.close();
}

/* ── 7 · LA MEDIA DEI FERMI E IL SUO DENOMINATORE ──────────────────────────
   ⛔ Misurato il 09/08 aprendo la pagina: tre giornate registrate su
   quattordici, cento minuti di fermo ciascuna, e la nota del grafico scriveva
   «In media 21 min al giorno» — 300 diviso 14, di cui UNDICI colonne in cui
   non è stato registrato niente. Sulle giornate misurate la media è 100: le
   assenti tiravano il numero giù di quasi cinque volte, nella direzione che
   rassicura. Il grafico gemello della settimana, dieci righe più sotto nella
   STESSA pagina, il conto giusto ce l'aveva già e lo dichiarava pure. Era la
   regola scritta due volte, la seconda più debole.
   ⚠️ La prova che conta è il RAPPORTO fra due numeri: che compaia «100» e non
   «21». Un solo numero non distingue «giusto» da «per caso uguale». */
console.log("\n· tre giornate registrate su quattordici: per cosa si divide la media dei fermi");
FIXTURE = `
{
  const p = (x) => String(x).padStart(2, "0");
  const gf = (n) => { const d = new Date(); d.setDate(d.getDate() - n);
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
  DEMO.attivita = [
    { id: "zm1", data: gf(13), turno: "Mattina", titolo: "Frantoio", squadra: "Squadra C", stato: "anomalia", causale: "Guasto meccanico", fermoMin: 100 },
    { id: "zm2", data: gf(7),  turno: "Mattina", titolo: "Frantoio", squadra: "Squadra C", stato: "anomalia", causale: "Guasto meccanico", fermoMin: 100 },
    { id: "zm3", data: gf(0),  turno: "Mattina", titolo: "Frantoio", squadra: "Squadra C", stato: "anomalia", causale: "Guasto meccanico", fermoMin: 100 }];
  DEMO.rapportini = []; DEMO.obiettivi = []; DEMO.durate = []; DEMO.chiusure = [];
  DEMO.presenze = []; DEMO.checklist = []; DEMO.meteo = []; DEMO.pianocarico = [];
}
`;
{
  const pg = await apri("nav-att");
  const nota = String(await pg.evaluate(() => {
    const e = document.getElementById("fermi-storico");
    return e ? e.innerText : "";
  }));
  dice(/media/.test(nota), "la nota del grafico dei fermi è stata trovata", nota.slice(0, 120));
  dice(/\b100 min\b/.test(nota) && !/\b21 min\b/.test(nota),
    "⛔ la media si divide per le giornate MISURATE (100 min), non per le colonne (21 min)",
    (nota.match(/.{0,60}media.{0,80}/) || [])[0]);
  dice(/11 giornate sono a zero perché non vi è stato registrato niente/.test(nota),
    "⛔ e le undici giornate fuori dal conto sono DICHIARATE, non tolte in silenzio",
    (nota.match(/.{0,40}giornate sono a zero.{0,90}/) || [])[0]);
  await pg.close();
}

/* ── 8 · IL COLORE DEL METEO SU UN TURNO CHIUSO ────────────────────────────
   ⛔ Misurato il 09/08 leggendo la CLASSE dal browser, non il codice: turno
   chiuso e firmato, del meteo registrato solo il cielo («Sereno»), piste e
   visibilità mai guardate. Il cartellone usciva `board ok` — bordo e cifra
   verdi — cioè «condizioni a posto» su un turno di cui nessuno sapeva se le
   piste fossero ghiacciate. `meteoAvverso` è un sì/no, e un sì/no non sa
   distinguere «guardato e va bene» da «nessuno ha guardato».
   ⚠️ Le due passate sono la prova che conta: il verde deve SPARIRE sul turno
   incompleto e RESTARE su quello completo. Una passata sola non distingue
   «giusto» da «il verde non c'è mai». */
console.log("\n· turno chiuso e meteo a metà: il cartellone prende il verde?");
const METEO_SCENA = (piste, vis) => `
{
  const p = (x) => String(x).padStart(2, "0"); const d = new Date();
  const oggi = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  DEMO.attivita = [{ id: "zq1", data: oggi, turno: "Mattina", titolo: "Perforazione", squadra: "Squadra A", stato: "conclusa" }];
  DEMO.rapportini = []; DEMO.obiettivi = []; DEMO.presenze = []; DEMO.checklist = []; DEMO.pianocarico = [];
  DEMO.durate = [{ id: "zq2", data: oggi, turno: "Mattina", minuti: 480, ora: "06:00" }];
  DEMO.chiusure = [{ id: "zq3", data: oggi, turno: "Mattina", consegna: "Giulia Verdi", ricevuta: "Mario Rossi", ora: "14:05" }];
  DEMO.meteo = [{ id: "zq4", data: oggi, turno: "Mattina", cielo: "Sereno", piste: ${JSON.stringify(piste)}, visibilita: ${JSON.stringify(vis)}, note: "", ora: "06:05" }];
}
`;
async function classeMeteo() {
  const pg = await apri("nav-rap");
  const r = await pg.evaluate(() => {
    const b = document.querySelector("#met-board .board");
    return b ? { classi: b.className, testo: b.innerText } : null;
  });
  await pg.close();
  return r;
}
{
  FIXTURE = METEO_SCENA("", "");
  const mezzo = await classeMeteo();
  dice(!!mezzo, "il cartellone del meteo si disegna anche col solo cielo compilato", mezzo);
  dice(mezzo && !/\bok\b/.test(mezzo.classi),
    "⛔ meteo a metà su un turno CHIUSO: niente verde",
    mezzo && mezzo.classi);
  dice(mezzo && /non registrate/.test(mezzo.testo),
    "⛔ e le voci mai guardate sono dichiarate sul cartellone",
    mezzo && mezzo.testo.replace(/\n/g, " | ").slice(0, 200));

  FIXTURE = METEO_SCENA("Asciutte", "Buona");
  const pieno = await classeMeteo();
  dice(pieno && /\bok\b/.test(pieno.classi),
    "⛔ e il verde RESTA dove è stato guadagnato: tutte e tre le voci registrate e nessuna difficile",
    pieno && pieno.classi);

  FIXTURE = METEO_SCENA("Ghiacciate", "");
  const brutto = await classeMeteo();
  dice(brutto && /\bwarn\b/.test(brutto.classi),
    "⛔ una voce avversa accusa anche se le altre mancano (il dato incompleto sa ancora accusare)",
    brutto && brutto.classi);
}

await b.close();
srv.close();
if (CONTROPROVA) {
  console.log(`\n  difetti rimessi nella pagina: ${iniezioni} su ${DIFETTI.length}`);
  if (iniezioni < DIFETTI.length) {
    console.error("✗ qualche difetto non ha trovato il suo pezzo di pagina: la controprova non prova niente.");
    process.exit(2);
  }
}
console.log(`\n${ko ? "✗" : "✓"} ${ok} verifiche passate, ${ko} fallite`
  + (CONTROPROVA ? "  (controprova: DEVONO fallire)" : ""));
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* LE FRASI DI TERRA QUANDO IL NUMERO È UNO (e quando l'articolo cambia)
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-frasi-da-uno.mjs [--porta=8493]
     node terra-frasi-da-uno.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08 il filo era «il numero è giusto e a mentire è il
   DISEGNO». Cercandolo è saltata fuori una famiglia diversa: **la frase
   costruita coi dati che, in un caso limite, dice una cosa non italiana**.
   In Terra il caso limite è quasi sempre lo stesso — **uno** — e non compare
   mai nella dimostrazione, che ha tre fronti, sei lotti, otto rilievi. Undici
   frasi sbagliate, misurate aprendo la pagina coi dati costruiti apposta:

     · «Fuori da quel numero restano **1 viaggi**, che non si convertono»
       (e il verbo della frase che li mette in fila: «restano» per una voce);
     · «Autorizzazione / concessione · … · **ogni 1 mesi**»;
     · «Scadenza «Prova» … registrata (preavviso **1 giorni**, si ripete
       **ogni 1 mesi**)»;
     · «Import fronti: **1 aggiunti**, **1 già presenti (saltati)**,
       **1 ripetuti nel file**» — il messaggio che si legge la PRIMA volta
       che si prova l'import, cioè importando una riga per vedere se va;
     · «Import rilievi: **1 rilievi elaborati aggiunti** … (**1** con un
       fronte non riconosciuto: **restano non assegnati**)» — e qui il
       singolare c'era già su UNA voce su quattro (i cumuli): non è
       ignoranza della regola, è che si guarda il pezzo che si sta
       scrivendo invece della frase intera;
     · «Esportati **1 fronti** e **1 rilievi** (CSV)»;
     · «(dai rilievi degli **ultimi 1 anni**)»;
     · «In quei **1 giorni** fanno circa 900 m³ al giorno»;
     · «Qualità dei rilievi di scavo: 1 di qualità topografica, **1
       indicativi**, 1 senza metodo dichiarato» — **sul prospetto che va
       all'ente**, e le altre due voci dello stesso elenco non hanno il
       problema;
     · «si sa da dove viene **il 0%**» e «l'hai messa **al 80%**»: l'articolo
       davanti a un numero si sceglie per come il numero si PRONUNCIA (zero →
       lo, ottanta → l'), e questi due casi sono quelli che Terra produce
       davvero.
   Più un dodicesimo che non è una parola ma un'unità: l'etichetta
   «**Quota (m)**» era l'unica del modulo fronti senza il guscio
   `<span class="u">`, e `.fl` è maiuscolo per struttura → sullo schermo
   «QUOTA (**M**)», cioè mega. Stessa cosa nella modale del volume annuo,
   «VOLUME ANNUO (**M³**)». Il banco `unita-maiuscole.mjs` non poteva
   prenderle: la sua lista di unità non contiene la «m» liscia, e non può
   contenerla senza riempirsi di rumore.

   ── seconda tornata, 07/08: la modale e i due fogli in finestra nuova ────
   Rifatta la stessa domanda sui posti che il giro precedente non toccava, ne è
   uscito un dodicesimo difetto e un buco di copertura:
     · «che si ripete ogni <b>1 mesi</b>» nella modale che si apre spuntando
       una scadenza come **fatta** — la **terza copia** della stessa regola,
       e l'unica rimasta sbagliata: le altre due (la riga dell'elenco e il
       messaggio del salvataggio) erano già corrette e stanno qui sotto ai
       numeri 2. Una ricorrenza mensile è il caso più comune che esista
       (l'antincendio, il registro), quindi il difetto si vedeva ogni volta,
       non nel caso raro. Con lui la frase dopo, «aggiungendo **quei mesi**»;
     · e il **VERBALE DI RILIEVO** non lo apriva nessuno di questo banco. I
       fogli stampati di Terra vivono in una finestra nuova, dove non arriva né
       il `@media print` né `innerText`: il prospetto annuale aveva UNA frase
       guardata a mano (la qualità dei rilievi), il verbale zero. Adesso
       tutt'e due passano interi dai tre rilevatori condivisi di
       `frasi-da-uno.mjs`, e il banco stampa quanti caratteri ha setacciato —
       un «nessuna frase» senza quel numero non distingue «pulito» da «non ho
       aperto niente». Misura al 07/08: **5.262 caratteri, zero frasi**, cioè
       i due fogli su questa famiglia sono puliti e adesso si sa perché.

   ⚠️ NESSUNA DI QUESTE SI VEDE NELLE PROVE `node`. Le regole pure
   (`plurale` di shared/, `aEufonica` e `articoloNumero` di Terra) sono
   provate in `run-kpi.mjs`; quello che qui si controlla è che la PAGINA le
   chiami — cioè la guardia collegata, non la guardia scritta.

   ⚠️ E I CASI SI COSTRUISCONO NEI DATI SERVITI, mai nel documento: si
   aggiunge una coda alla risposta HTTP di `terra-data.js`. Il file su disco
   non si tocca.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
/* ⛔ IL SETACCIO NON SI RISCRIVE QUI. Il vocabolario e i tre rilevatori stanno
   in `frasi-da-uno.mjs` da quando erano già scritti due volte (qui accanto, in
   `campo-sentinella-frasi.mjs`, e in `scudo-frasi-da-uno.mjs`): due elenchi di
   parole nati uguali divergono al primo cambiamento, e da quel momento la
   stessa domanda riceve due risposte diverse a seconda del banco che la fa. */
import { setaccia, testoDocumento, PAROLE, VERBI, AGGETTIVI } from "./frasi-da-uno.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8493;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, col pezzo di pagina che li porta.
   Si contano: una controprova che non sostituisce niente non prova niente. */
const PAGINA = "apps/terra/index.html", MODULO = "apps/terra/terra-data.js";
const DIFETTI = [
  // 1 · i viaggi che non si convertono, e il verbo che li introduce
  ['`<b>${d.viaggi} ${plurale(d.viaggi, "viaggio", "viaggi")}</b>, che non ${plurale(d.viaggi, "si converte", "si convertono")}: servirebbe',
   '`<b>${d.viaggi} viaggi</b>, che non si convertono: servirebbe'],
  ['`Fuori da quel numero ${unaSola ? "resta" : "restano"} ${elenco}.',
   '`Fuori da quel numero restano ${elenco}.'],
  // 2 · la ricorrenza della scadenza, nella riga e nel messaggio
  ['${ric ? (ric === 1 ? " · ogni mese" : " · ogni " + ric + " mesi") : ""}', '${ric ? " · ogni " + ric + " mesi" : ""}'],
  ['+ preav + " " + plurale(preav, "giorno", "giorni")', '+ preav + " giorni"'],
  ['(ric === 1 ? ", si ripete ogni mese" : ", si ripete ogni " + ric + " mesi")', '", si ripete ogni " + ric + " mesi"'],
  // 3 · i tre plurali dell'import dei fronti
  /* ⚠️ SCADUTA E RIMESSA SUL BERSAGLIO IL 13/08: questa riga citava il codice
     fino al `+ ".");` finale, e il gestore ha guadagnato in coda
     `+ frasePersi(scartate)` — la frase che dice quali righe del file NON sono
     entrate. L'iniezione ha smesso di combaciare e la controprova girava su un
     prodotto SANO, senza che niente diventasse rosso. È l'origine buona di
     sempre: il codice si è mosso perché è migliorato. Adesso cita solo la
     parte che le serve — i tre plurali — e non la coda. */
  ['`Import fronti: ${agg} ${plurale(agg, "aggiunto", "aggiunti")}`\n      + (dup ? `, ${dup} ${plurale(dup, "già presente (saltato)", "già presenti (saltati)")}` : "")\n      + (ripetute ? `, ${ripetute} ${plurale(ripetute, "ripetuto", "ripetuti")} nel file` : "")',
   '`Import fronti: ${agg} aggiunti${dup ? `, ${dup} già presenti (saltati)` : ""}${ripetute ? `, ${ripetute} ripetuti nel file` : ""}`'],
  // 4 · l'import dei rilievi
  ['`Import rilievi: ${agg} ${plurale(agg, "rilievo elaborato aggiunto", "rilievi elaborati aggiunti")}`',
   '`Import rilievi: ${agg} rilievi elaborati aggiunti`'],
  /* ⚠️ scaduta e rimessa sul bersaglio il 13/08, stessa ragione della riga
     qui sopra: citava fino al `+ ".");` e il gestore ha guadagnato la coda. */
  ['+ (senzaFronte ? " (" + senzaFronte + " con un fronte non riconosciuto: "\n          + plurale(senzaFronte, "resta non assegnato", "restano non assegnati") + ")" : "")',
   '+ (senzaFronte ? " (" + senzaFronte + " con un fronte non riconosciuto: restano non assegnati)" : "")'],
  // 5 · l'export
  ['"Esportato il CSV: " + FRO.length + " " + plurale(FRO.length, "fronte", "fronti")\n      + " e " + RIL.length + " " + plurale(RIL.length, "rilievo", "rilievi") + ".");',
   '"Esportati " + FRO.length + " fronti e " + RIL.length + " rilievi (CSV).");'],
  // 6 · gli anni del ritmo medio
  ['(dai rilievi ${plurale(un1(vc.ritmo.durataAnni), "dell\'ultimo anno", "degli ultimi " + un1(vc.ritmo.durataAnni) + " anni")})',
   '(dai rilievi degli ultimi ${un1(vc.ritmo.durataAnni)} anni)'],
  // 7 · i giorni fra due rilievi
  ['? (c.giorni === 1\n          ? `In quel <b>giorno</b> fanno circa <b>${n0(c.alGiorno)} m³</b>, cioè <b>${n0(c.alMese)} m³ al mese</b> se il ritmo resta questo.`\n          : `In quei',
   '? (false\n          ? `In quel <b>giorno</b> fanno circa <b>${n0(c.alGiorno)} m³</b>, cioè <b>${n0(c.alMese)} m³ al mese</b> se il ritmo resta questo.`\n          : `In quei'],
  // 8 · la qualità dei rilievi sul prospetto per l'ente (dal 05/09 la compone
  //     `prospettoDenuncia` nel MODULO: il terzo posto dice a quale file)
  ['if (q.indicativo) qual.push(q.indicativo + " " + (q.indicativo === 1 ? "indicativo" : "indicativi"));',
   'if (q.indicativo) qual.push(q.indicativo + " indicativi");', MODULO],
  // 9 · i due articoli davanti a un numero
  ['si sa da dove viene ${articoloNumero("il", nD(pf.copertura))}<b>', 'si sa da dove viene il <b>'],
  ['(l\'hai messa ${articoloNumero("al", un1(vc.soglia))}${un1(vc.soglia)}%)', '(l\'hai messa al ${un1(vc.soglia)}%)'],
  /* 10 · la «d» eufonica del mese.
     ⚠️ LA PRIMA STESURA DI QUESTA INIEZIONE ROMPEVA LA PAGINA invece di
     rimetterci un difetto: tagliava a metà una concatenazione e lasciava una
     virgoletta aperta, così TUTTE le prove cadevano — comprese quelle che non
     c'entravano — e la controprova sembrava fortissima mentre non stava
     provando niente. Si sostituisce la CHIAMATA, non il testo intorno. */
  ['aEufonica(MESI_NOME[meseOggi - 1]) + " <b>"', '"a" + " <b>"'],
  ['"fino " + aEufonica(MESI_NOME[meseOggi - 1]) + " "', '"fino " + "a" + " "'],
  /* 12 · LA TERZA COPIA DI «OGNI 1 MESI», nella modale che si apre spuntando
     una scadenza come fatta. Le altre due — la riga dell'elenco e il messaggio
     che conferma il salvataggio — erano già corrette e stanno qui sopra ai
     numeri 2: questa no, ed è la stessa frase a due schermate di distanza.
     Una ricorrenza mensile (l'antincendio, il registro) è il caso più comune
     che esista, quindi il difetto si vedeva ogni volta, non nel caso raro. */
  ['che si ripete " + (ric === 1 ? "<b>ogni mese</b>" : "ogni <b>" + ric + " mesi</b>") + ".<br><br>"',
   'che si ripete ogni <b>" + ric + " mesi</b>.<br><br>"'],
  ['aggiungendo " + plurale(ric, "quel mese", "quei mesi")\n          + " alla scadenza precedente.',
   'aggiungendo quei mesi alla scadenza precedente.'],
  // 11 · le due unità dentro un\'etichetta maiuscola
  ['for="fro-quota">Quota (<span class="u">m</span>)</label>', 'for="fro-quota">Quota (m)</label>'],
  ['for="modal-campo">Volume annuo (<span class="u">m³</span>)</label>', 'for="modal-campo">Volume annuo (m³)</label>'],
];

/* I CASI, costruiti nei DATI. Ognuno serve a una manciata di frasi. */
const CASO_UNO = `
DEMO.fronti.length = 1;
DEMO.lotti.length = 0;
DEMO.rilievi.length = 0;
DEMO.rilievi.push({ id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM",
  volumeM3: 19400, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
DEMO.rapportiniCampo.length = 0;
DEMO.rapportiniCampo.push({ id: "z1", data: "2026-07-16", turno: "Mattina", squadra: "Squadra B",
  prodQta: 1, prodUnita: "viaggi", stato: "inviato" });
DEMO.rapportiniCampo.push({ id: "z2", data: "2026-07-17", turno: "Mattina", squadra: "Squadra B",
  prodQta: 3000, prodUnita: "t", stato: "inviato" });
DEMO.scadenze.length = 1;
DEMO.scadenze[0].ricorrenzaMesi = 1;
`;
/* un anno solo di storia (il ritmo medio) e la soglia superata (l'articolo) */
/* ⛔ E IL «GIÀ ESTRATTO» SE LO SCRIVE IL CASO, perché lo stato che serve qui
   dipende da un numero che il caso non toccava. Questo caso sostituisce i
   rilievi (859.000 m³) e si teneva il pregresso della dimostrazione: con i
   340.000 di allora faceva 1.199.000 su 1.200.000 concessi, cioè **99,9%** —
   `warn` per un decimo di punto. Il 07/08 la dimostrazione è stata portata di
   proposito sopra la soglia di guardia (il «già estratto» da 340.000 a
   880.000, perché `.vita.warn` e `.kpi.warn` non comparivano MAI e un colore
   mai comparso non lo misura nessuno) e questo caso è passato a 144,9%: stato
   `danger`, la riga della soglia sparita, e il banco ha accusato il prodotto
   di scrivere «al 80%» quando quella frase non veniva più scritta affatto.
   Non era un difetto del prodotto: era un banco che portava dentro un numero
   che non aveva dichiarato. Adesso il caso è chiuso in sé — e sta a 88,3%
   invece che a 99,9%, così un rilievo in più nella dimostrazione non lo
   ribalta un'altra volta. */
/* ⛔ E LE DATE SONO RELATIVE A OGGI, non scritte. Il caso è nato il 06/08 con
   «2025-08-06» e «2026-08-05»: quel giorno la durata del ritmo faceva 0,999
   anni → «1» → «dell'ultimo anno». Il 02/09 faceva 1,073 → «1,1» → «degli
   ultimi 1,1 anni», che è italiano giusto — e il banco accusava il prodotto
   («KO: dai rilievi dell'ultimo anno») di una cosa che aveva fatto il
   calendario. È il banco che porta dentro un numero atteso e invecchia; qui
   il numero era una DATA. Il primo rilievo sta a 365 giorni da oggi (durata
   0,999, arrotondata «1»), il secondo a 28. */
const giorniFa = (n) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - n);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const CASO_ANNO = `
DEMO.rilievi.length = 0;
DEMO.autorizzazioni[0].estrattoPregressoM3 = 200000;
DEMO.rilievi.push({ id: "a", titolo: "R1", data: "${giorniFa(365)}", tipo: "Ortofoto + DEM",
  volumeM3: 400000, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
DEMO.rilievi.push({ id: "b", titolo: "R2", data: "${giorniFa(28)}", tipo: "Ortofoto + DEM",
  volumeM3: 459000, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
`;
/* due rilievi a UN giorno di distanza sullo stesso fronte */
const CASO_GIORNO = `
DEMO.rilievi.length = 0;
DEMO.rilievi.push({ id: "a", titolo: "R1", data: "2026-07-14", tipo: "Ortofoto + DEM",
  volumeM3: 10000, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
DEMO.rilievi.push({ id: "b", titolo: "R2", data: "2026-07-15", tipo: "Ortofoto + DEM",
  volumeM3: 900, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
`;
/* un rilievo per classe di accuratezza: survey-grade, indicativo, n.d. */
const CASO_QUALITA = `
DEMO.rilievi.length = 0;
DEMO.rilievi.push({ id: "a", titolo: "R1", data: "2026-04-02", tipo: "Ortofoto + DEM",
  volumeM3: 12000, stato: "elaborato", metodo: "senza GCP", gsd: "5", fronteId: "f1" });
DEMO.rilievi.push({ id: "b", titolo: "R2", data: "2026-05-02", tipo: "Ortofoto + DEM",
  volumeM3: 9000, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" });
DEMO.rilievi.push({ id: "c", titolo: "R3", data: "2026-06-02", tipo: "Ortofoto + DEM",
  volumeM3: 9000, stato: "elaborato", fronteId: "f1" });
`;

let FIXTURE = "";
let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* ogni difetto va al file che dichiara (terzo posto della tupla; senza, la
     pagina): applicare tutto alla pagina lascia le iniezioni sul modulo
     «fresche» per `iniezioni-fresche` e MAI rimesse per questo banco. Si
     contano i DIFETTI RIMESSI, non le sostituzioni: la pagina viene caricata
     più volte e un conto crescente direbbe «60 su 17». Sul modulo l'iniezione
     va PRIMA della fixture, che è testo aggiunto in coda. */
  const applica = (t, file) => {
    for (const [a, b, f] of DIFETTI) if ((f || PAGINA) === file && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    iniezioni = colpiti.size;
    return t;
  };
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) t = applica(t, MODULO);
    if (FIXTURE) t += FIXTURE;
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e
   la RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__terra-frasi-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__terra-frasi-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, frasi = 0;
const dice = (c, t, x) => {
  frasi++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* Apre Terra e va in una sezione PRETENDENDO la prova di aver navigato: un
   banco che non naviga risponde «tutto a posto» dopo aver guardato una
   schermata su sei. */
async function apri(nomeSezione) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/terra/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + nomeSezione).catch(() => {});
  await pg.waitForTimeout(500);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${nomeSezione} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
const T = (pg, sel) => pg.$eval(sel, (e) => e.innerText.replace(/\s+/g, " ")).catch(() => "(assente " + sel + ")");

console.log(`\n════════ le frasi di Terra quando il numero è uno${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · UN FRONTE, UN RILIEVO, UN VIAGGIO, UNA SCADENZA OGNI MESE ────────
console.log("\n· un viaggio solo, e una scadenza che si ripete ogni mese");
FIXTURE = CASO_UNO;
{
  const pg = await apri("nav-ril");
  const turni = await T(pg, "#tur-out");
  dice(/resta 1 viaggio, che non si converte/.test(turni),
    "⛔ «resta 1 viaggio, che non si converte» — cosa, verbo della relativa e verbo che introduce",
    (turni.match(/Fuori da quel numero[^.]*\./) || [])[0]);
  dice(!/1 viaggi\b/.test(turni), "e da nessuna parte resta un «1 viaggi»", turni.slice(0, 200));

  await pg.click("#nav-tit"); await pg.waitForTimeout(500);
  const sca = await T(pg, "#scad-list");
  dice(/· ogni mese/.test(sca) && !/ogni 1 mesi/.test(sca),
    "⛔ la riga della scadenza dice «ogni mese», non «ogni 1 mesi»", sca);

  await pg.fill("#new-scad-desc", "Prova");
  await pg.fill("#new-scad-data", "2026-12-01");
  await pg.fill("#new-scad-pre", "1");
  await pg.fill("#new-scad-ric", "1");
  await pg.click("#btn-add-scad"); await pg.waitForTimeout(700);
  const es = await T(pg, "#scad-esito");
  dice(/preavviso 1 giorno,/.test(es), "⛔ «preavviso 1 giorno», non «1 giorni»", es);
  dice(/si ripete ogni mese/.test(es), "⛔ «si ripete ogni mese», non «ogni 1 mesi»", es);
  await pg.close();
}

// ── 2 · IMPORT ED EXPORT DI UNA RIGA SOLA ───────────────────────────────
console.log("\n· import ed export di una riga sola");
FIXTURE = CASO_UNO;
{
  const pg = await apri("nav-fro");
  const csvF = "nome;banco;quota;stato\nFronte Ovest;banco 9;120;attivo\n";
  const metti = async (input, nome, testo) => {
    await pg.setInputFiles(input, { name: nome, mimeType: "text/csv", buffer: Buffer.from(testo) });
    await pg.waitForTimeout(900);
  };
  await metti("#fro-file", "f.csv", csvF);
  dice(/Import fronti: 1 aggiunto\./.test(await T(pg, "#fro-esito")),
    "⛔ «1 aggiunto», non «1 aggiunti»", await T(pg, "#fro-esito"));
  await metti("#fro-file", "f.csv", csvF);
  dice(/1 già presente \(saltato\)/.test(await T(pg, "#fro-esito")),
    "⛔ «1 già presente (saltato)» — anche dentro la parentesi", await T(pg, "#fro-esito"));
  await metti("#fro-file", "f2.csv", "nome;banco\nFronte Z;banco 9\nFronte Z;banco 9\n");
  dice(/1 ripetuto nel file/.test(await T(pg, "#fro-esito")),
    "⛔ «1 ripetuto nel file», non «1 ripetuti»", await T(pg, "#fro-esito"));

  await pg.click("#nav-ril"); await pg.waitForTimeout(500);
  await metti("#ril-file", "r.csv", "data;volumeM3;metodo;gsd;fronte\n2026-02-10;5000;RTK;2;Fronte Nord\n");
  dice(/1 rilievo elaborato aggiunto/.test(await T(pg, "#ril-esito")),
    "⛔ «1 rilievo elaborato aggiunto», non «1 rilievi elaborati aggiunti»", await T(pg, "#ril-esito"));
  await metti("#ril-file", "r2.csv", "data;volumeM3;metodo;gsd;fronte\n2026-02-11;5000;RTK;2;Fronte Ignoto\n");
  dice(/1 con un fronte non riconosciuto: resta non assegnato/.test(await T(pg, "#ril-esito")),
    "⛔ «resta non assegnato», non «restano non assegnati»", await T(pg, "#ril-esito"));

  await pg.close();
}
/* ⚠️ PAGINA NUOVA PER L'EXPORT, e la prima stesura non ce l'aveva: gli import
   qui sopra avevano portato l'archivio a tre fronti e tre rilievi, quindi il
   messaggio diceva «3 fronti e 3 rilievi» e la prova cadeva — non per un
   difetto del prodotto, ma perché lo strumento stava misurando uno stato che
   si era costruito da sé. */
{
  const pg = await apri("nav-pia");
  await pg.evaluate(() => {
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (this.download) return; return clic.apply(this, arguments); };
  });
  await pg.click("#btn-terra-export"); await pg.waitForTimeout(400);
  const ex = await T(pg, "#terra-esito");
  dice(/1 fronte e /.test(ex) && /1 rilievo\./.test(ex) && !/Esportati /.test(ex),
    "⛔ «Esportato il CSV: 1 fronte e 1 rilievo» — e via il participio, che si accorda con la somma", ex);
  await pg.close();
}

// ── 3 · UN ANNO SOLO DI RITMO, E LA SOGLIA SUPERATA ──────────────────────
console.log("\n· un anno solo di storia, e la soglia di guardia all'80%");
FIXTURE = CASO_ANNO;
{
  const pg = await apri("nav-tit");
  const v = await T(pg, "#tit-vita");
  dice(/dai rilievi dell'ultimo anno/.test(v) && !/ultimi 1 anni/.test(v),
    "⛔ «dai rilievi dell'ultimo anno», non «degli ultimi 1 anni»",
    (v.match(/Al ritmo medio[^.]*\./) || [])[0]);
  dice(/l'hai messa all'80%/.test(v),
    "⛔ «l'hai messa all'80%»: ottanta comincia per vocale, «al 80%» non è italiano",
    (v.match(/Soglia di guardia[^.]*\./) || [])[0]);
  await pg.close();
}

// ── 4 · DUE RILIEVI A UN GIORNO DI DISTANZA ─────────────────────────────
console.log("\n· due rilievi a un giorno di distanza");
FIXTURE = CASO_GIORNO;
{
  const pg = await apri("nav-ril");
  const c = await T(pg, "#cf-out");
  dice(/In quel giorno fanno circa/.test(c) && !/In quei 1 giorni/.test(c),
    "⛔ «In quel giorno fanno circa 900 m³» — e cade anche «al giorno», che lì non dice niente",
    (c.match(/In quel[^.]*\.|In quei[^.]*\./) || [])[0]);
  await pg.close();
}

// ── 5 · IL PROSPETTO CHE VA ALL'ENTE, E LA «D» EUFONICA ─────────────────
console.log("\n· il prospetto per l'ente: la qualità dei rilievi e il mese");
FIXTURE = CASO_QUALITA;
{
  const pg = await apri("nav-den");
  const nota = await T(pg, "#den-mesi-nota");
  /* «fino a agosto» si presenta solo nei mesi che cominciano per «a»: la
     prova lo dichiara invece di far finta di aver guardato tutto l'anno. */
  const mese = (nota.match(/si vedono i mesi fino ([a-z]+) ([a-zà-ù]+)/) || []);
  if (/^a/.test(mese[2] || "")) {
    dice(mese[1] === "ad", `⛔ «fino ad ${mese[2]}»: la «d» eufonica davanti alla stessa vocale`, nota);
  } else {
    dice(mese[1] === "a", `«fino a ${mese[2] || "?"}»: oggi il mese non comincia per «a», qui la «d» NON ci va`, nota);
  }

  await pg.evaluate(() => { window.__doc = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close: () => {} },
      focus: () => {}, print: () => {} }); });
  await pg.click("#btn-den-stampa"); await pg.waitForTimeout(500);
  const doc = String(await pg.evaluate(() => window.__doc) || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  dice(doc.length > 800, "il prospetto viene prodotto davvero", doc.length);
  const q = (doc.match(/Qualità dei rilievi di scavo:[^.]*\./) || ["(non trovata)"])[0];
  dice(/1 indicativo,/.test(q) && !/1 indicativi/.test(q),
    "⛔ sul foglio che va all'ente: «1 indicativo», non «1 indicativi»", q);
  dice(/1 di qualità topografica/.test(q) && /1 senza metodo dichiarato/.test(q),
    "e le altre due voci dello stesso elenco restano com'erano (non avevano il difetto)", q);
  await pg.close();
}

// ── 6 · LE UNITÀ DENTRO UN'ETICHETTA MAIUSCOLA ──────────────────────────
/* ⚠️ SI LEGGE LA TRASFORMAZIONE DEL PEZZO CHE PORTA L'UNITÀ, non quella
   dell'etichetta: `.fl` è maiuscolo per struttura e lo resta. Il difetto è
   nell'INCONTRO fra la classe e un contenuto che l'elenco delle esenzioni
   (`.kpi .l .u, .badge .u, .fl .u, .vita-pct .u`) non aveva previsto. */
console.log("\n· le unità dentro le etichette maiuscole");
FIXTURE = CASO_UNO;
{
  const pg = await apri("nav-fro");
  const q = await pg.evaluate(() => {
    const l = document.querySelector("label.fl[for='fro-quota']");
    if (!l) return null;
    const u = l.querySelector(".u");
    return { etichetta: getComputedStyle(l).textTransform, unita: u ? u.textContent : null,
      trasf: u ? getComputedStyle(u).textTransform : null };
  });
  dice(q && q.etichetta === "uppercase", "l'etichetta «Quota» è maiuscola per struttura, come il core", q);
  dice(q && q.unita === "m" && q.trasf === "none",
    "⛔ ma il metro dentro è in `<span class=\"u\">` e resta minuscolo: «QUOTA (m)», non «QUOTA (M)»", q);

  await pg.click("#nav-pia"); await pg.waitForTimeout(500);
  await pg.click("#pia-list .item"); await pg.waitForTimeout(600);
  const m = await pg.evaluate(() => {
    const l = document.querySelector("label.fl[for='modal-campo']");
    if (!l) return null;
    const u = l.querySelector(".u");
    return { testo: l.textContent, unita: u ? u.textContent : null,
      trasf: u ? getComputedStyle(u).textTransform : null };
  });
  dice(m && m.unita === "m³" && m.trasf === "none",
    "⛔ e lo stesso nella modale del volume annuo: «VOLUME ANNUO (m³)», non «(M³)»", m);
  await pg.close();
}

// ── 7 · LA MODALE DELLA SCADENZA CHE TORNA OGNI MESE ────────────────────
/* ⛔ TERZA COPIA DELLA STESSA REGOLA, e l'unica rimasta sbagliata: le due
   sorelle — la riga dell'elenco e il messaggio del salvataggio — le guarda già
   il caso 1 qui sopra. Questa vive dentro una MODALE, cioè in un pezzo di
   pagina che nessun setaccio sulle schermate poteva leggere, perché per farla
   comparire bisogna premere il bottone «fatta» su una scadenza ricorrente. */
console.log("\n· la modale della scadenza che si ripete ogni mese");
FIXTURE = CASO_UNO;
{
  const pg = await apri("nav-tit");
  await pg.click("[data-fatta-scad]").catch(() => {});
  await pg.waitForTimeout(800);
  const m = await pg.evaluate(() => {
    const x = [...document.querySelectorAll(".dw-modal, .modal, [role=dialog]")]
      .find((e) => getComputedStyle(e).display !== "none");
    return x ? x.innerText.replace(/\s+/g, " ") : null;
  });
  /* ⛔ LA PROVA DI AVER APERTO LA MODALE, prima di leggerla: senza, un
     selettore che non trova niente dà `null`, le due prove sotto passano
     entrambe perché la frase sbagliata non c'è — e il banco direbbe «pulito»
     avendo guardato una pagina vuota. È il difetto raccolto sette volte in
     CLAUDE.md: se un selettore non trova niente, il primo sospettato è il
     selettore. */
  dice(m !== null && m.length > 200, "la modale «Scadenza fatta» si apre davvero", m === null ? "nessuna modale visibile" : m.length);
  dice(/si ripete ogni mese/.test(m || "") && !/ogni 1 mesi/.test(m || ""),
    "⛔ «che si ripete ogni mese», non «ogni 1 mesi» — terza copia della stessa regola",
    (String(m).match(/Hai chiuso[^.]*\./) || [])[0]);
  dice(/aggiungendo quel mese/.test(m || "") && !/quei mesi/.test(m || ""),
    "⛔ e la frase dopo va d'accordo con la prima: «aggiungendo quel mese», non «quei mesi»",
    (String(m).match(/Terra propone[^.]*\./) || [])[0]);
  await pg.close();
}

// ── 8 · I DUE FOGLI CHE ESCONO IN UNA FINESTRA NUOVA ────────────────────
/* ⛔ IL SETACCIO A TAPPETO SUI DOCUMENTI, non tre asserzioni scelte a mano.
   I fogli stampati di Terra vivono in una finestra nuova: lì non arriva né il
   `@media print` della pagina né `innerText`, e nessun banco che guardi le
   schermate li vede. Il caso 5 qui sopra ne legge UNA frase (la qualità dei
   rilievi) del prospetto annuale; il VERBALE DI RILIEVO — il foglio che
   accompagna la misura e che si esibisce a un controllo — non lo apriva
   nessuno di questo banco.
   Qui si aprono tutt'e due coi dati tagliati a uno e si passa il testo intero
   ai tre rilevatori condivisi. Il numero di caratteri setacciati si stampa: un
   «nessuna frase» senza quel numero non distingue «pulito» da «non ho aperto
   niente». */
console.log("\n· il setaccio sui due fogli stampati (riepilogo annuale e verbale)");
FIXTURE = CASO_GIORNO;
{
  const pg = await apri("nav-den");
  await pg.evaluate(() => {
    window.__doc = {};
    let n = 0;
    window.open = () => { const k = "doc" + (++n); window.__doc[k] = "";
      return { document: { write: (h) => { window.__doc[k] += h; }, close: () => {} },
               focus: () => {}, print: () => {} }; };
  });
  await pg.click("#btn-den-stampa"); await pg.waitForTimeout(500);
  // il verbale: si passa dalla modale che chiede CHI ha eseguito il rilievo
  await pg.click("#nav-ril"); await pg.waitForTimeout(600);
  const nVerb = await pg.$$eval("[data-verb-ril]", (e) => e.length).catch(() => 0);
  dice(nVerb > 0, `i bottoni del verbale ci sono (${nVerb})`, nVerb);
  if (nVerb) {
    await pg.click("[data-verb-ril]"); await pg.waitForTimeout(700);
    const bs = await pg.$$("button");
    let premuto = false;
    for (const bb of bs) {
      const t = (await bb.textContent().catch(() => "")) || "";
      if (/Prepara il verbale/i.test(t.trim())) { await bb.click().catch(() => {}); premuto = true; break; }
    }
    dice(premuto, "il bottone «Prepara il verbale» della modale è stato premuto", premuto);
    await pg.waitForTimeout(800);
  }
  const docs = await pg.evaluate(() => window.__doc || {});
  const nomi = Object.keys(docs);
  /* ⛔ DUE DOCUMENTI, e si conta: un banco che ne apre uno solo e non lo dice
     dichiara «pulito» sul foglio che non ha guardato. */
  dice(nomi.length === 2, `escono DUE fogli in finestra nuova (${nomi.length}: ${nomi.join(", ") || "nessuno"})`, nomi);
  let carDoc = 0;
  const trovateDoc = [];
  for (const k of nomi) {
    const t = testoDocumento(docs[k]);
    carDoc += t.length;
    trovateDoc.push(...setaccia(`terra/STAMPA/${k}`, t));
  }
  for (const f of trovateDoc) console.log(`        ${f}`);
  dice(trovateDoc.length === 0,
    `nessuna frase lasciata al plurale sui fogli stampati (${carDoc} caratteri setacciati, `
    + `${PAROLE.length} parole · ${VERBI.length} verbi · ${AGGETTIVI.length} aggettivi)`, trovateDoc[0]);
  dice(carDoc > 4000, `i fogli sono stati letti davvero, non sono due gusci (${carDoc} caratteri)`, carDoc);
  /* ⛔ E NESSUN MAIUSCOLO AUTOMATICO SU QUESTI DUE FOGLI. `unita-maiuscole.mjs`
     guarda il RENDERIZZATO delle pagine, e in una finestra nuova non ci arriva:
     se un giorno qualcuno mettesse `text-transform:uppercase` sulle
     intestazioni di queste tabelle, «m³» diventerebbe «M³» — cioè mega — su un
     foglio che va all'ente, e nessun banco lo direbbe. Il foglio del riepilogo
     ha già il commento che spiega perché non c'è: qui il commento diventa una
     misura. Si guarda il documento prodotto, non il codice della pagina.
     ⚠️ `letter-spacing` e `font-weight` restano liberi: il difetto è la
     TRASFORMAZIONE del testo, non il fatto che un'intestazione sia marcata. */
  const maiuscoli = nomi.filter((k) => /text-transform\s*:\s*(uppercase|capitalize)/i.test(docs[k]));
  dice(maiuscoli.length === 0,
    `nessuno dei ${nomi.length} fogli stampati alza il testo in maiuscolo (là dentro «m³» diventerebbe «M³»)`,
    maiuscoli);
  await pg.close();
}

console.log(`\n${frasi} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} difetti su ${DIFETTI.length} rimessi nella risposta HTTP`);
  if (iniezioni < DIFETTI.length) {
    console.log("⚠️ QUALCHE DIFETTO NON È STATO RIMESSO: la controprova non prova quello che dice");
    process.exit(3);
  }
  /* La soglia sta a 19 perché con tutti e 20 i difetti rimessi ne cadono 20,
     rimisurate il 07/08 dopo i due difetti nuovi della modale (prima erano 18
     su 18, con la soglia a 17): una soglia bassa renderebbe la controprova
     verde anche se metà delle iniezioni non arrivasse mai nella pagina.
     ⚠️ E il numero da guardare non è solo quante ne cadono: è che le prove
     NON puntate su un difetto restino verdi. Qui lo sono — «l'etichetta è
     maiuscola per struttura», «le altre due voci dell'elenco», «la modale si
     apre davvero» e le cinque del setaccio sui fogli stampati passano anche
     con tutto il resto rotto: 28 prove su 48 restano in piedi. */
  console.log(ko >= 19 ? "✓ il banco SA fallire: rimessi i difetti cadono le prove giuste"
                       : `⚠️ troppo poche cadute (${ko})`);
  process.exit(ko >= 19 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

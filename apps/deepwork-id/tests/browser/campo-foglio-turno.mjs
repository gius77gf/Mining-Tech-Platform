/* IL RAPPORTO DI FINE TURNO DI CAMPO, aperto premendo il bottone e letto in
   `@media print` — e la consegna di turno in .txt, scaricata davvero.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-foglio-turno.mjs [--porta=8971]
     node campo-foglio-turno.mjs --controprova  (rimette i difetti: DEVE fallire)
     node campo-foglio-turno.mjs --live         (Campo crede di essere in
                                                 produzione: i fogli devono
                                                 uscire PULITI)
     node campo-foglio-turno.mjs --caso=pieno   (pieno · vuoto · consegna)
     node campo-foglio-turno.mjs --scatti       (scatti in @media print a 390 px)

   ⛔ PERCHÉ ESISTE — 1. IL FOGLIO CHE NON DICEVA DI ESSERE UN ESEMPIO.
   Il buco è quello che `stampe-fs.mjs` ha già chiuso in quattro app, misurato
   su Campo con lo stesso comando di tre secondi:

       grep -c "solo-stampa\\|DATI DI ESEMPIO" apps/campo/index.html   ->  0

   In modalità tour lo schermo lo dichiara due volte — la fascia `#tour-banner`
   e la riga di stato `#mode-note` — e la stampa nasconde tutt'e due, perché
   sono comandi e non documento. Quello che esce è il **rapporto di fine
   turno**: il foglio che si consegna al capocantiere, che si archivia come
   prova di chi c'era e a che ora, e che un ispettore chiede. Senza una riga
   che lo dica, un rapporto di dimostrazione — nomi, orari, ore lavorate, ore
   di riposo e firme tutti inventati — è indistinguibile da uno vero.

   ⛔ E IL MODO DI STAMPARE DECIDE DOVE VA LA DIFESA. Campo non stampa sé
   stesso: `grep -c "@media print" apps/campo/index.html` -> **0**, perché il
   rapporto è un HTML costruito nella pagina e scritto con `document.write` in
   una FINESTRA NUOVA (`window.open`, unica occorrenza del file). Lì né la
   fascia né un `@media print` di casa arriverebbero mai — è la forma di
   Terra, non quella di Flotta/Sentinella/Conti. Questo banco deve quindi
   raccogliere il **popup**: chi provasse la pagina risponderebbe «pulito»
   senza aver mai visto il documento (il controllo che non guarda dove crede).

   ⛔ CENSIMENTO DELLE USCITE DI CAMPO, perché «il foglio è uno solo» non si
   dichiara, si prova. Comandi e uscite del 06/08:

       grep -n "window.open\\|\\.print()" apps/campo/index.html
         -> 2 righe, tutt'e due dentro lo stesso rapporto (4086, 4087)
       grep -c "<!DOCTYPE html>" apps/campo/index.html
         -> 2: la pagina stessa (riga 1) e il rapporto costruito (riga 4023)
       grep -n "\\.download *=" apps/campo/index.html
         -> 6: consegna_turno.txt + 5 CSV
         (campo_appello, campo_storico, campo_attivita, campo_squadre,
          campo_consuntivo_carico)

   Cioè **un solo foglio stampato**. Ma la consegna di turno in .txt è lo
   stesso documento in un altro vestito — è letteralmente il foglio che passa
   di mano fra due turni — quindi entra in questo banco: la decisione
   «questo è un foglio di dimostrazione» è UNA (`modoDimostrazione`) e li
   veste tutt'e due. I cinque CSV restano fuori **con la ragione**: sono file
   che Campo si **rilegge** (`parseSquadreCsv`, `parsePianoCsv`), e una riga
   d'intestazione in più li romperebbe all'import; è un lavoro suo, non
   questo.

   ⛔ PERCHÉ ESISTE — 2. IL QUADRO CHE DICEVA «0 ANOMALIE APERTE» SU UNA
   GIORNATA VUOTA. Trovato aprendo il foglio con le attività del giorno a
   zero (caso montato nei dati serviti, mai sul disco): usciva

       Quadro
       0/0 attività concluse   0 anomalie aperte   0/3 squadre …

   cioè la riga più tranquilla che il documento sappia dire, in cima, proprio
   dove non è stato misurato niente. La regola giusta stava DUE sezioni più
   sotto nello stesso foglio — «Disponibilità del turno» scrive «non calcolata
   — Non è registrata nessuna attività per questo turno. Un numero qui direbbe
   che il turno è andato bene, mentre la verità è che non è stato misurato».
   Copia debole, nel posto che CLAUDE.md indica: dove il documento si compone.

   ⚠️ QUELLO CHE QUESTO BANCO **NON** PRETENDE, e va scritto perché non venga
   scambiato per un verde: a **390 px** il rapporto esce di lato, e non è
   colpa dell'avviso. Misurato affiancando il disco e una worktree su `HEAD`:

       390 px  -> scrollWidth 670 su win 390, su TUTT'E DUE (colpevoli: le
                  tabelle da 631 e 642 px — il personale ha nove colonne)
       688 px  -> 688 su 688, nessun colpevole, su tutt'e due
       800 px  -> 800 su 800   ·   900 px -> 900 su 900

   Il foglio è un A4 (688 px a 96 dpi con margini di 14 mm) e lì sta dentro.
   Quindi la domanda giusta non è l'assoluto «esce?» — che era già rosso prima
   di questo lavoro — ma **il delta**: l'avviso deve aggiungere zero. Si misura
   nella stessa pagina, nascondendo `.esempio` e rimisurando.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, mai sul disco: accanto ci sono
   cantieri che scrivono e giri del browser che girano. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8971;
const CONTROPROVA = process.argv.includes("--controprova");
const FINGE_LIVE = process.argv.includes("--live");
const SCATTI = process.argv.includes("--scatti");
/* `--solo=` qui non avrebbe senso: la superficie è una sola. Al suo posto
   `--caso=`, che serve allo stesso scopo — provare un documento senza aprire
   gli altri due — e che va usato mentre si lavora, tenendo il giro intero per
   la fine. */
const CASO = (process.argv.find((a) => a.startsWith("--caso=")) || "").split("=")[1] || "";
const CARTELLA_SCATTI = "/tmp/campo-foglio-turno";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── IL CASO: la giornata in cui nessuno ha registrato niente ──────────────
   Non è un caso di comodo: è quello su cui il Quadro diceva «0 anomalie
   aperte». Si monta svuotando la dimostrazione nel modulo SERVITO. */
const CASO_VUOTO = `
/* ── caso montato dal banco campo-foglio-turno.mjs (mai sul disco) ── */
DEMO.attivita = []; DEMO.rapportini = []; DEMO.presenze = []; DEMO.checklist = [];
`;

/* ── LA CONTROPROVA: i difetti rimessi nella copia SERVITA ─────────────────
   ⛔ LA PRIMA INIEZIONE SPEGNE LA DECISIONE, NON LA FRASE. C'è UN posto solo
   che decide «questo è un foglio di dimostrazione», e il rapporto e la
   consegna lo leggono: spegnendo quel posto si toglie tutto lo strato. Se una
   prova restasse verde vorrebbe dire che sta guardando un foglio che non
   passa di lì, cioè una copia debole nata nel frattempo.
   ⛔ E DAL 06/08 QUEL POSTO NON È PIÙ DENTRO LA PAGINA DI CAMPO: la decisione è
   salita in `shared/deepwork-id-client/dw-shell.js`, nella forma che era di
   Campo (risponde col NOME del modo, non con un sì/no), perché la stessa
   domanda era scritta in quattro varianti in quattro pagine. L'iniezione ha
   dovuto seguirla: lasciata a mirare `const modoDimostrazione = () => …` nella
   pagina avrebbe risposto «INIEZIONE MANCATA» — la QUARTA delle cinque cause
   elencate in CLAUDE.md, l'iniezione puntata dove il difetto non vive più. Un
   banco che non sa più fallire non è un banco, e questo lo direbbe a voce
   bassa: una riga di log e il riepilogo verde.
   ⚠️ Il vestito è rimasto in Campo ed è giusto — il `CSS_ESEMPIO` (il rapporto
   nasce in una finestra nuova), la riga `*** … ***` della consegna .txt, e la
   `FRASE_ESEMPIO` che parla di presenze e di ore lavorate. Le chiamate restano
   quindi nella pagina, e i due strati devono cadere separatamente.
   ⚠️ Il file condiviso lo carica ogni pagina servita, quindi il conto delle
   iniezioni sale col numero delle aperture (tre giri = tre volte), ed è
   giusto: cresce con le pagine, non coi difetti.
   Le altre due rimettono i due numeri tranquilli del Quadro. */
const DIFETTI = {
  "shared/deepwork-id-client/dw-shell.js": [
    ['  return modo === "live" ? null : String(modo || "non dichiarata");',
     "  return null;"],
  ],
  "apps/campo/index.html": [
    ['${av.totale?`<b>${av.anomalie}</b> ${av.anomalie===1?"anomalia aperta":"anomalie aperte"}`:`<b>—</b> anomalie: nessuna attività da cui contarle`}',
     '<b>${av.anomalie}</b> anomalie aperte'],
    ['${av.totale?`<b>${av.concluse}/${av.totale}</b> attività concluse`:`<b>—</b> attività: nessuna registrata oggi`}',
     '<b>${av.concluse}/${av.totale}</b> attività concluse'],
  ],
};

/* ⛔ LA SECONDA DOMANDA: E SU UN FOGLIO VERO LA DICHIARAZIONE NON C'È?
   Una guardia che si accende sempre non è una guardia, e qui il difetto
   costerebbe caro al contrario: «DATI DI ESEMPIO» stampato sul rapporto del
   turno vero, quello che si archivia come prova delle presenze. Il banco lo
   chiede davvero invece di leggerlo nel codice — `--live` fa credere a Campo
   di essere in produzione e allora i fogli devono uscire PULITI. Le prove si
   rovesciano: quelle che pretendono la dichiarazione ne pretendono l'assenza.
   Senza questo passaggio il banco avrebbe provato solo che l'avviso sa
   comparire, mai che sa stare zitto.
   ⚠️ E SI INIETTA NELLA PAGINA, NON NELLA DECISIONE CONDIVISA: `--live` non è
   un difetto, è la stessa decisione letta al contrario, quindi si tocca il
   modo che la pagina PASSA (`db.mode` → `"live"`) e il giro attraversa davvero
   `modoDimostrazione` di `shared/`. Spegnendola dall'interno il giro
   resterebbe verde anche se quella funzione smettesse di saper tacere sui dati
   veri — cioè proverebbe l'opposto di quello che dice di provare.
   ⛔ E I SOGGETTI SONO DUE, non uno: i due vestiti di Campo — il riquadro del
   foglio stampato e la riga in cima alla consegna .txt — chiedono ognuno per
   conto suo. Toccandone uno solo l'altro continuerebbe a dichiarare, e il
   banco griderebbe a un difetto che non c'è. */
const COME_LIVE = {
  "apps/campo/index.html": [
    ["  const avvisoEsempio = () => { const m = modoDimostrazione(db.mode);",
     '  const avvisoEsempio = () => { const m = modoDimostrazione("live");'],
    ["  const avvisoEsempioTesto = () => { const m = modoDimostrazione(db.mode);",
     '  const avvisoEsempioTesto = () => { const m = modoDimostrazione("live");'],
  ],
};

let nCasi = 0, nDifetti = 0, difettiMancati = 0;
const inietta = (rotta, testo) => {
  const lista = (FINGE_LIVE ? COME_LIVE : DIFETTI)[rotta.replace(/^\//, "")];
  if (!lista) return testo;
  let t = testo;
  for (const [da, a] of lista) {
    const n = t.split(da).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 56)}…»`); difettiMancati++; continue; }
    t = t.replace(da, a); nDifetti++;
  }
  return t;
};

/* Il caso si monta solo quando serve: il modulo è lo stesso file per tutt'e
   tre i documenti, e svuotarlo sempre vorrebbe dire non provare mai il foglio
   pieno. Lo decide questa variabile, che il giro sposta fra un caso e l'altro. */
let MONTA_VUOTO = false;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER: un banco che trova
     la porta occupata e la riusa non fallisce — misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (/\.(html|js|mjs|css)$/.test(p)) {
    let t = corpo.toString("utf8");
    if (MONTA_VUOTO && p.endsWith("apps/campo/campo-data.js")) { t += CASO_VUOTO; nCasi++; }
    if (CONTROPROVA || FINGE_LIVE) t = inietta(rotta, t);
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`
    + (CONTROPROVA ? "  · CONTROPROVA" : "") + (FINGE_LIVE ? "  · FINGE LIVE (i fogli devono uscire PULITI)" : "")); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 320)}` : ""}`); } };

/* La dichiarazione DEVE esserci in dimostrazione e NON DEVE esserci su un
   foglio vero: è la stessa prova letta nei due versi, non due prove. */
const ATTESO = !FINGE_LIVE;
const verso = (t) => (FINGE_LIVE ? t.replace("dichiara", "NON dichiara").replace("e dice", "e non dice") : t);
const diceAvviso = (trovato, t, x) => dice(trovato === ATTESO, verso(t), x);
const fai = (nome) => (CASO ? CASO === nome : true);

/* Quanti soggetti ha guardato davvero: fogli aperti, finestre lette, file
   scaricati. Uno «0 violazioni» ottenuto su zero documenti è il difetto
   raccolto tre volte in CLAUDE.md. */
let finestre = 0, scaricati = 0, nScatti = 0;

/* `window.print()` in headless non apre niente; lo si stordisce e lo si
   CONTA — un bottone che non ha stampato non ha provato niente.
   ⚠️ E va montato sul CONTESTO, non sulla pagina: il rapporto di Campo si
   stampa da solo con un `window.print()` scritto DENTRO la finestra nuova,
   che è un'altra pagina. Montato su `pg` il contatore resta a zero nel popup
   e la prova cade — misurato: `typeof window.__stampato` nel popup era
   `undefined`. Un banco che leggesse quel numero senza accorgersene direbbe
   «non ha stampato» su un foglio che stampa. */
const apriApp = async () => {
  const ctx = await b.newContext({ viewport: { width: 688, height: 1123 }, locale: "it-IT", acceptDownloads: true });
  await ctx.addInitScript(() => { window.__stampato = 0; window.print = () => { window.__stampato++; }; });
  const pg = await ctx.newPage();
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/campo/index.html`);
  await pg.waitForTimeout(2600);
  dice(errori.length === 0, "la pagina di Campo non solleva errori", errori.slice(0, 2));
  /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
     risponde «tutto a posto» dopo aver guardato la schermata sbagliata. */
  await pg.click("#nav-rap").catch(() => {});
  await pg.waitForTimeout(700);
  const aperta = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
  dice(aperta.join() === "page-rap", "la schermata dei rapportini è quella aperta", aperta);
  return { ctx, pg, errori };
};

const scatta = async (pagina, nome) => {
  mkdirSync(CARTELLA_SCATTI, { recursive: true });
  const f = join(CARTELLA_SCATTI, `${nome}-print-390.png`);
  await pagina.screenshot({ path: f, fullPage: true });
  nScatti++; console.log(`     scatto → ${f}`);
};

/* Legge il documento DALLA FINESTRA NUOVA, in `@media print` e a 390 px: è la
   superficie che conta (il foglio, non lo schermo) e la larghezza in cui un
   avviso in più è più facile che copra il documento.
   ⛔ E la domanda «esce dal suo spazio?» la sa dire il browser
   (`scrollWidth > clientWidth`): non si calcola. */
const leggiFoglio = async (pop, nome) => {
  await pop.waitForLoadState("domcontentloaded").catch(() => {});
  await pop.setViewportSize({ width: 390, height: 1200 });
  await pop.emulateMedia({ media: "print" });
  await pop.waitForTimeout(300);
  finestre++;
  if (SCATTI) await scatta(pop, nome);
  return pop.evaluate(() => {
    const av = [...document.querySelectorAll(".esempio")];
    const largo = () => document.documentElement.scrollWidth;
    const con = largo();
    // il delta: quanto largo sarebbe il foglio SENZA l'avviso
    av.forEach((e) => { e.dataset.dwPrima = e.style.display; e.style.display = "none"; });
    const senza = largo();
    av.forEach((e) => { e.style.display = e.dataset.dwPrima || ""; });
    return {
      testo: document.body.innerText,
      sezioni: [...document.querySelectorAll("h2")].map((h) => h.textContent),
      avvisi: av.length,
      avvisoEsce: av.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => ({ sw: e.scrollWidth, cw: e.clientWidth })),
      con, senza, win: window.innerWidth,
    };
  });
};

// le dieci sezioni che il rapporto ha sempre: se l'avviso ne coprisse una, si
// vede qui e non nella somma dei caratteri
const SEZIONI = ["Quadro", "Checklist di inizio turno", "Meteo e condizioni del sito",
  "Personale presente", "Obiettivo del turno", "Attività", "Fermi per causale",
  "Disponibilità del turno", "Produzione", "Rapportini", "Chiusura e firme"];

// ══ 1 · IL RAPPORTO DI FINE TURNO, giornata piena ═════════════════════════
if (fai("pieno")) {
  console.log("\n── Il rapporto di fine turno, in finestra nuova, @media print a 390 px ──");
  MONTA_VUOTO = false;
  const { ctx, pg, errori } = await apriApp();
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("tour-banner")).display === "block"),
    "l'app è in modalità dimostrazione: la fascia in alto è accesa");

  const [pop] = await Promise.all([
    pg.waitForEvent("popup", { timeout: 9000 }).catch(() => null),
    pg.click("#btn-rapporto-turno"),   // si PREME il bottone, non si compone il foglio a mano
  ]);
  if (!pop) { console.log("  ✗ la finestra del rapporto non si è aperta: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }
  const d = await leggiFoglio(pop, "rapporto-pieno");
  dice(/Rapporto di fine turno/.test(d.testo), "la finestra contiene il rapporto di fine turno", d.testo.slice(0, 70));
  dice(await pop.evaluate(() => window.__stampato > 0), "il foglio ha chiesto la stampa da solo");

  // (a) IL FOGLIO DICHIARA
  diceAvviso(/DATI DI ESEMPIO/i.test(d.testo), "⛔ il rapporto dichiara di essere fatto di dati di esempio");
  diceAvviso(/non descrive nessun turno realmente lavorato/i.test(d.testo)
    && /non va consegnato al turno successivo/i.test(d.testo)
    && /non va esibito a un controllo/i.test(d.testo),
    "e dice che cosa comporta: non si consegna al turno dopo, non vale come prova delle presenze, non si esibisce");
  dice(d.avvisi === (ATTESO ? 1 : 0), `la dichiarazione compare ${ATTESO ? "una volta sola" : "zero volte"}`, d.avvisi);

  // (b) E NON COPRE IL DOCUMENTO
  const mancanti = SEZIONI.filter((s) => !d.sezioni.some((h) => h.trim() === s));
  console.log(`     (${d.sezioni.length} sezioni <h2> lette sul foglio)`);
  dice(mancanti.length === 0, "⛔ il documento è ancora tutto lì: nessuna sezione coperta dall'avviso", mancanti);
  dice(d.avvisoEsce.length === 0, "l'avviso non esce dal proprio riquadro (lo dice il browser)", d.avvisoEsce);
  dice(d.con === d.senza,
    "⛔ e non allarga il foglio di un pixel: con e senza l'avviso la larghezza è la stessa", d);

  // il foglio vero è un A4: lì dentro non deve scorrere di lato
  await pop.setViewportSize({ width: 688, height: 1123 });   // 210 mm − 2 × 14 mm a 96 dpi
  await pop.waitForTimeout(250);
  const a4 = await pop.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  dice(a4.doc <= a4.win + 1, "sul foglio A4 (688 px) il rapporto non esce dalla larghezza", a4);

  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  await pop.close(); await ctx.close();
}

// ══ 2 · LO STESSO FOGLIO SU UNA GIORNATA IN CUI NESSUNO HA REGISTRATO NIENTE ══
if (fai("vuoto")) {
  console.log("\n── Lo stesso rapporto su una giornata vuota: nessun numero tranquillo ──");
  MONTA_VUOTO = true;
  const { ctx, pg, errori } = await apriApp();
  const [pop] = await Promise.all([
    pg.waitForEvent("popup", { timeout: 9000 }).catch(() => null),
    pg.click("#btn-rapporto-turno"),
  ]);
  if (!pop) { console.log("  ✗ la finestra del rapporto non si è aperta: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }
  const d = await leggiFoglio(pop, "rapporto-vuoto");
  // ⛔ prima di misurare: il caso è arrivato davvero? Un banco che misura la
  // dimostrazione di serie credendo di misurare il proprio caso dice «a posto»
  dice(/Nessuna attività registrata/i.test(d.testo),
    "il caso è arrivato: la giornata servita non ha nessuna attività", d.testo.slice(0, 60));
  diceAvviso(/DATI DI ESEMPIO/i.test(d.testo), "⛔ anche il foglio della giornata vuota dichiara");

  const quadro = (d.testo.split(/\n/).find((r) => /attività|anomalie/.test(r) && /—|\/|\d/.test(r)) || "");
  const riga = d.testo.split("Quadro\n")[1] ? d.testo.split("Quadro\n")[1].split("\n")[0] : quadro;
  console.log(`     riga del Quadro letta: «${riga.trim()}»`);
  dice(!/\b0 anomalie aperte\b/.test(riga),
    "⛔ il Quadro NON scrive «0 anomalie aperte» dove non c'è niente da contare", riga);
  dice(/anomalie: nessuna attività da cui contarle/.test(riga),
    "e dichiara perché non lo sa: nessuna attività da cui contarle", riga);
  dice(!/\b0\/0 attività concluse\b/.test(riga),
    "⛔ e non scrive «0/0 attività concluse»: quello 0 si legge come un turno andato liscio", riga);
  dice(/non c'è niente da cui contare i fermi/i.test(d.testo),
    "anche «Fermi per causale» dice perché è vuota invece di dire «nessuna anomalia aperta»",
    (d.testo.match(/Fermi per causale\n[^\n]*/) || [])[0]);
  // e il caso che il difetto NON deve produrre: la sezione che già lo faceva bene
  dice(/non è stato misurato/i.test(d.testo),
    "e la «Disponibilità del turno» continua a dichiarare di non essere calcolata");
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  await pop.close(); await ctx.close();
  MONTA_VUOTO = false;
}

// ══ 3 · LA CONSEGNA DI TURNO IN .txt, SCARICATA DAVVERO ═══════════════════
/* Non è un foglio che si stampa, ma è lo stesso documento in un altro
   vestito: il testo che passa di mano fra due turni. Si legge il file VERO
   che il browser salverebbe (evento `download`), non la stringa costruita in
   pagina — se un giorno l'href e il contenuto divergessero, questa è la sola
   prova che se ne accorge. */
if (fai("consegna")) {
  console.log("\n── La consegna di turno (.txt), scaricata dal browser ──");
  MONTA_VUOTO = false;
  const { ctx, pg, errori } = await apriApp();
  const [dl] = await Promise.all([
    pg.waitForEvent("download", { timeout: 9000 }).catch(() => null),
    pg.click("#btn-consegna"),
  ]);
  if (!dl) { console.log("  ✗ nessun file scaricato: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }
  scaricati++;
  dice(dl.suggestedFilename() === "consegna_turno.txt", "il file si chiama consegna_turno.txt", dl.suggestedFilename());
  let testo = ""; { const s = await dl.createReadStream(); for await (const c of s) testo += c; }
  dice(/CONSEGNA DI TURNO/.test(testo), "e contiene la consegna di turno", testo.slice(0, 40));
  diceAvviso(/DATI DI ESEMPIO/.test(testo), "⛔ la consegna dichiara di essere fatta di dati di esempio");
  diceAvviso(/non descrive nessun turno realmente lavorato/.test(testo),
    "e dice la stessa cosa del foglio stampato: è una frase sola, non due");
  // la dichiarazione sta PRIMA di qualunque dato: un foglio si legge dall'alto
  const iAvviso = testo.indexOf("DATI DI ESEMPIO"), iDati = testo.indexOf("RAPPORTINI");
  diceAvviso(iAvviso >= 0 && iAvviso < iDati, "e sta in cima, prima del primo dato", { iAvviso, iDati });
  // (b) e non ha mangiato il documento
  for (const t of ["RAPPORTINI", "PRODUZIONE", "CHIUSURA DEL TURNO", "ANOMALIE / FERMI"])
    dice(testo.includes(t), `la consegna ha ancora la sezione «${t}»`);
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  await ctx.close();
}

await b.close(); srv.close();
console.log(`\nRisultato foglio di turno di Campo: ${ok} passati, ${ko} falliti`
  + `  ·  ${finestre} finestre lette in @media print a 390 px, ${scaricati} file scaricati e letti`
  + `  ·  ${nCasi} moduli con il caso della giornata vuota montato`
  + (SCATTI ? `  ·  ${nScatti} scatti` : "")
  + (CONTROPROVA ? `  ·  ${nDifetti} difetti rimessi, ${difettiMancati} iniezioni mancate` : "")
  + (FINGE_LIVE ? `  ·  ${nDifetti} iniezioni «come live»` : ""));
if (CONTROPROVA) {
  if (difettiMancati) { console.log("⛔ qualche iniezione non ha trovato il suo soggetto: la controprova non vale."); process.exit(2); }
  console.log(ko > 0 ? "controprova: il banco SA fallire ✔" : "⛔ controprova INERTE: coi difetti rimessi il banco passa lo stesso.");
  process.exit(ko > 0 ? 0 : 1);
}
if (FINGE_LIVE && difettiMancati) { console.log("⛔ l'iniezione «come live» non ha trovato il suo soggetto: il giro non vale."); process.exit(2); }
process.exit(ko > 0 ? 1 : 0);

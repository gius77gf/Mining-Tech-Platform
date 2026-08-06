/* I FOGLI CHE SI STAMPANO — Flotta, Sentinella, Conti e Terra, provati
   premendo il bottone e leggendo il foglio in `@media print`.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node stampe-fs.mjs [--porta=8613]
     node stampe-fs.mjs --controprova   (rimette i difetti: DEVE fallire)
     node stampe-fs.mjs --solo=flotta   (flotta · sentinella · conti · terra)
     node stampe-fs.mjs --scatti        (salva gli scatti in @media print a 390 px)
     node stampe-fs.mjs --live          (Conti e Terra credono di essere in
                                         produzione: i fogli devono uscire PULITI)

   ⛔ IL «FOGLIO CHE NON DICE DI ESSERE UN ESEMPIO» NON ERA DI DUE APP: ERA
   DELL'ECOSISTEMA. Il banco è nato su Flotta e Sentinella, dove il difetto è
   stato trovato; il 03/08 lo stesso buco si è misurato aperto in Conti e in
   Terra, con lo stesso comando di tre secondi e con lo stesso esito zero:

       for A in conti terra scudo; do grep -c "solo-stampa\\|DATI DI ESEMPIO" \\
         apps/$A/index.html; done   ->  0 0 0
       grep -c "solo-stampa\\|DATI DI ESEMPIO" apps/genesi/genesi.html  ->  0

   Cioè: una difesa scritta due volte in due app e mai chiesta alle altre
   quattro. È la ragione per cui adesso le superfici stanno in questo banco
   invece che nella memoria di chi ha lavorato quel giorno — un elenco tenuto
   a mente si accorcia da sola.
   Delle quattro rimaste, tre andavano chiuse e una no, e la differenza è
   dichiarata perché nessuno la ricerchi: **Genesi non ha una modalità
   dimostrazione** (`grep -c tour-banner apps/genesi/genesi.html` -> 0, e in
   tutta la pagina non compare `db.mode`), quindi non c'è nessun foglio di
   esempio da distinguere da uno vero: il suo report dichiara già di essere una
   stima e non una misura, che è la cosa vera da dichiarare lì. Scudo resta
   fuori da questo banco.

   ⛔ E IL MODO DI STAMPARE NON È LO STESSO, quindi la difesa non poteva essere
   copiata: Flotta, Sentinella e Conti stampano SÉ STESSE con un `@media print`
   sulla pagina, quindi la dichiarazione è un blocco dentro il documento;
   Terra apre una FINESTRA NUOVA e ci scrive dentro un HTML con
   `document.write`, dove né la fascia in alto né il `@media print` della
   pagina arrivano mai — lì la dichiarazione va dentro l'HTML generato, e
   questo banco deve raccogliere il `popup` per poterla leggere. Chi avesse
   provato solo la pagina avrebbe risposto «pulito» su Terra senza aver
   guardato il documento (il controllo che non guarda dove crede).

   PERCHÉ ESISTE. Di tutt'e due le app la passata sui CSV è già stata fatta;
   quello che restava scoperto è lo stesso in entrambe — il foglio che si
   STAMPA. È un documento diverso dal CSV, lo compone la pagina, e in
   `@media print` non lo guardava nessuna prova: le suite `node` chiamano il
   modulo, i banchi del browser guardano lo schermo. Tre cose sono venute
   fuori solo aprendo il foglio, e nessuna si vedeva leggendo il codice.

   1. LA TESSERA CHE TAGLIA IL NUMERO, SOLO SULLA CARTA (Flotta). In stampa la
      riga delle tessere è forzata a QUATTRO colonne: 166 px l'una, il numero
      resta a corpo 32 e la tessera ha `overflow:hidden`. Misurato sul
      libretto di una macchina con dodicimila euro d'officina: «€ 12.750,00»
      chiede 169 px in 138, cioè un importo mozzato sul foglio che si consegna
      a chi compra la macchina. La guardia dello schermo
      (`@media(max-width:400px)`) in stampa non scatta mai: il foglio è largo
      688 px. E la stessa sonda ha trovato che pure a schermo, a 320 px, la
      guardia scritta stamattina reggeva «€ 2.100,00» e non «€ 12.750,00»: il
      corpo era stato scelto sul caso che si aveva sotto mano.

   2. IL TOTALE DEI FERMI CHE NON TORNA CON LE RIGHE (Flotta). Il libretto
      scriveva «3 fermi registrati per 5 giorni in tutto» sopra tre righe che
      dicono «—», «—» e «5 giorni»: i fermi con le date non leggibili
      entravano nel conto come ZERO giorni. La regola giusta era in casa —
      `affidabilitaFlotta` li conta a parte e lo dichiara.

   3. IL FOGLIO CHE NON DICE DI ESSERE UN ESEMPIO (tutt'e due). In modalità
      tour lo schermo lo dichiara due volte, la fascia in alto e la riga di
      stato; la stampa nasconde tutt'e due (`.tour-banner` sta nell'elenco di
      ciò che è comando e non documento). Quello che esce dalla stampante è
      «Libretto macchina» e «Report di conformità ambientale» — il foglio che
      si consegna a chi compra e quello che si consegna all'ente — senza una
      parola che dica che i numeri sono inventati.

   E una quarta, che sta nel modulo ma si legge sul foglio (Sentinella): il
   filtro del periodo del report confrontava STRINGHE, quindi una lettura
   datata 30 febbraio entrava nel documento per l'ente — e ne cambiava
   l'esito — mentre ogni schermata la scartava.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, mai sul disco: accanto ci sono
   cantieri che scrivono e giri del browser che girano. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8613;
const CONTROPROVA = process.argv.includes("--controprova");
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
const SCATTI = process.argv.includes("--scatti");
const CARTELLA_SCATTI = "/tmp/stampe-fs";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── I CASI ────────────────────────────────────────────────────────────
   Flotta: una macchina con l'officina a cinque cifre (il numero che la
   tessera tagliava) e tre fermi, due dei quali con le date illeggibili.
   Sentinella: una lettura datata 30 febbraio sopra la soglia, e una volata
   con la data che non si legge. */
const CASI_FLOTTA = `
/* ── casi montati dal banco stampe-fs.mjs (mai sul disco) ── */
DEMO.mezzi.push({ id: "zz1", nome: "Escavatore Z9 — CAT 374", tipo: "escavatore", stato: "fermo", ore: 12480, area: "Fronte Nord" });
DEMO.interventi.push({ id: "zi1", mezzo: "Escavatore Z9", titolo: "Revisione braccio", data: "2026-06-10", costo: 12750, ricambio: "", note: "" });
DEMO.fermi = (DEMO.fermi || []).concat([
  { id: "zf1", mezzo: "Escavatore Z9", causale: "guasto-meccanico", inizio: "2026-07-01", fine: "2026-07-05", note: "" },
  { id: "zf2", mezzo: "Escavatore Z9", causale: "guasto-meccanico", inizio: "boh", fine: "", note: "data non leggibile" },
  { id: "zf3", mezzo: "Escavatore Z9", causale: "attesa-ricambi", inizio: "2026-07-20", fine: "2026-07-10", note: "ripartenza prima dell'inizio" },
]);
`;
const CASI_SENTINELLA = `
/* ── casi montati dal banco stampe-fs.mjs (mai sul disco) ── */
DEMO.monitoraggi[0].letture.push({ data: "2026-02-30", ora: "08:00", valore: 99 });
DEMO.volate.push({ id: "zv1", data: "boh", fronte: "Fronte Ovest", nFori: 30, kgTotali: 300,
  kgMaxRitardo: 15, distanzaRicettore: 250, esito: "regolare", note: "", stato: "eseguita" });
`;

/* ── LA CONTROPROVA: i difetti rimessi nella copia SERVITA ────────────── */
const DIFETTI = {
  "apps/flotta/index.html": [
    // 1. la tessera che taglia il numero sul foglio A4
    ["  #sch-kpi .n{font-size:19px; line-height:1.2; overflow-wrap:anywhere}\n  .kpi{overflow:visible !important}",
     "  #sch-kpi .n{font-size:32px}"],
    // 3. il foglio che non dice di essere un esempio
    ['<div class="sch-sotto avviso-stampa"><b>DATI DI ESEMPIO', '<div class="sch-sotto avviso-stampa" hidden><b>DATI DI ESEMPIO'],
    // 2. la coda che dice quanti fermi non sono nel totale
    ["          + (f.fermo.senzaDurata\n", "          + (false\n"],
  ],
  "apps/sentinella/index.html": [
    ['${db.mode !== "live" ? `<div class="rep-esempio">', '${false ? `<div class="rep-esempio">'],
    ["    const S = R.scartate || { totale: 0 };", "    const S = { totale: 0 };"],
  ],
  "apps/sentinella/sentinella-data.js": [
    // 4. il filtro che giudica la data da com'è scritta
    ["    if (!dataUsabile(g)) return false;", "    if (!g) return false;"],
  ],
  /* ⛔ L'INIEZIONE SPEGNE LA DECISIONE, NON LA FRASE. Nascondere il blocco col
     `hidden` (come si fa in Flotta, dove la frase è scritta a mano nel punto
     in cui serve) qui proverebbe meno: Conti e Terra hanno UN posto solo che
     decide «questo è un foglio di dimostrazione», e i tre fogli di Conti e i
     due di Terra lo leggono. Spegnendo quel posto si toglie tutto lo strato —
     e se una prova restasse verde vorrebbe dire che sta guardando un foglio
     che non passa di lì, cioè una copia debole nata nel frattempo.
     ⛔ E DAL 06/08 QUEL POSTO NON È PIÙ DENTRO LE PAGINE: la decisione «che
     cosa conta come dimostrazione» è salita in
     `shared/deepwork-id-client/dw-shell.js` (era in quattro varianti dentro
     quattro pagine — Conti, Scudo, Terra, Campo). L'iniezione ha dovuto
     seguirla: lasciata a mirare la riga vecchia avrebbe risposto «INIEZIONE
     MANCATA», che è la QUARTA delle cinque cause elencate in CLAUDE.md —
     l'iniezione puntata dove il difetto non vive più. Un banco che non sa più
     fallire non è un banco, e lo dice a voce bassa: nel riepilogo il numero
     dei difetti rimessi scende e le prove restano verdi.
     ⚠️ Ed è un guadagno, non una complicazione: adesso la controprova prova
     ANCHE che i due strati sono separabili — spento lo strato condiviso, le
     chiamate nelle pagine restano intatte e i fogli escono nudi.
     ⚠️ Il file condiviso lo carica OGNI pagina servita, quindi in un giro a
     quattro app l'iniezione si applica quattro volte e il conto è salito da 8
     a 10 (era: 3 Flotta + 2 Sentinella + 1 sentinella-data + 1 Conti + 1
     Terra; adesso le ultime due sono una sola, moltiplicata per le quattro
     pagine). Cresce con le pagine servite, non coi difetti — e restano 7 le
     prove sulla dichiarazione che cadono, le stesse di prima: è così che si
     legge che l'iniezione è arrivata dove arrivava. Un conto che dopo un
     trasloco SCENDE è il segno da leggere. */
  "shared/deepwork-id-client/dw-shell.js": [
    ['  return modo === "live" ? null : String(modo || "non dichiarata");',
     "  return null;"],
  ],
};

/* ⛔ LA SECONDA DOMANDA: E SU UN FOGLIO VERO LA DICHIARAZIONE NON C'È?
   Una guardia che si accende sempre non è una guardia, ed è il difetto che
   qui costerebbe di più: scrivere «DATI DI ESEMPIO» sulla fattura vera di un
   cliente, o sul prospetto che va davvero all'ente. Il banco lo chiede
   davvero invece di leggere il codice — `--live` fa credere alle due app di
   essere in produzione (in demo il confronto diventa `!== "demo"`, cioè
   falso), e allora i cinque fogli devono uscire PULITI. Le prove si
   rovesciano: quelle che pretendono la dichiarazione ne pretendono l'assenza.
   Senza questo passaggio il banco avrebbe provato solo che l'avviso sa
   comparire, mai che sa stare zitto. */
/* ⚠️ E `--live` SI INIETTA NELLA PAGINA, NON NELLA DECISIONE CONDIVISA. Non è
   un difetto: è la stessa decisione letta al contrario, e va chiesta al modo
   che la pagina PASSA (`db.mode` → `"live"`) invece che alla funzione che
   risponde. Così il giro attraversa davvero `modoDimostrazione`, e non ne
   misura una copia disattivata: se domani quella funzione smettesse di tacere
   sui dati veri, questo giro diventerebbe rosso — mentre spegnendola
   dall'interno resterebbe verde per il motivo sbagliato. */
const FINGE_LIVE = process.argv.includes("--live");
const COME_LIVE = {
  "apps/conti/index.html": [
    ["  const avvisoEsempio = () => { const m = modoDimostrazione(db.mode);",
     '  const avvisoEsempio = () => { const m = modoDimostrazione("live");'],
  ],
  "apps/terra/index.html": [
    ["  const avvisoEsempio = (frase) => { const m = modoDimostrazione(db.mode);",
     '  const avvisoEsempio = (frase) => { const m = modoDimostrazione("live");'],
  ],
};

let nCasi = 0, nDifetti = 0, difettiMancati = 0;
const iniettaDifetti = (rotta, testo) => {
  const lista = (FINGE_LIVE ? COME_LIVE : DIFETTI)[rotta.replace(/^\//, "")];
  if (!lista) return testo;
  let t = testo;
  for (const [da, a] of lista) {
    const n = t.split(da).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 52)}…»`); difettiMancati++; continue; }
    t = t.replace(da, a); nDifetti++;
  }
  return t;
};

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
  const testuale = /\.(html|js|mjs|css)$/.test(p);
  if (testuale) {
    let t = corpo.toString("utf8");
    if (p.endsWith("apps/flotta/flotta-data.js")) { t += CASI_FLOTTA; nCasi++; }
    if (p.endsWith("apps/sentinella/sentinella-data.js")) { t += CASI_SENTINELLA; nCasi++; }
    if (CONTROPROVA || FINGE_LIVE) t = iniettaDifetti(rotta, t);
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
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · CONTROPROVA" : ""}${FINGE_LIVE ? "  · FINGE LIVE (i fogli devono uscire PULITI)" : ""}`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 320)}` : ""}`); } };

/* Con `--live` girano solo le due app di cui esiste l'iniezione che le fa
   credere di essere in produzione: su Flotta e Sentinella la dichiarazione
   resterebbe accesa e il banco griderebbe a un difetto che non c'è — il rosso
   falso, che costa quanto il verde falso perché manda a cercare un guasto. */
const APP_LIVE = new Set(Object.keys(COME_LIVE).map((r) => r.split("/")[1]));
const fai = (nome) => (SOLO ? SOLO === nome : true) && (!FINGE_LIVE || APP_LIVE.has(nome));

/* La dichiarazione DEVE esserci in dimostrazione e NON DEVE esserci su un
   foglio vero: è la stessa prova letta nei due versi, non due prove. */
const ATTESO = !FINGE_LIVE;
const verso = (t) => (FINGE_LIVE ? t.replace("dichiara", "NON dichiara").replace("e dice", "e non dice") : t);
const diceAvviso = (trovato, t, x) => dice(trovato === ATTESO, verso(t), x);

/* `window.print()` in headless non apre niente: il foglio resta nel DOM, che
   è quello che serve leggere. Lo si stordisce comunque, e si CONTA — un
   bottone che non ha stampato non ha provato niente. */
const APRI = async (largo) => {
  const ctx = await b.newContext({ viewport: { width: largo, height: 1123 }, locale: "it-IT" });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => { window.print = () => { window.__stampato = (window.__stampato || 0) + 1; }; });
  return { ctx, pg };
};

/* Lo scatto si prende IN `@media print` e a 390 px: è la superficie che conta
   (il foglio, non lo schermo) e la larghezza in cui un avviso in più è più
   facile che copra il documento. Va GUARDATO, non solo prodotto. */
let nScatti = 0;
const scatta = async (pagina, nome) => {
  mkdirSync(CARTELLA_SCATTI, { recursive: true });
  const prima = pagina.viewportSize();
  if (!prima || prima.width !== 390) await pagina.setViewportSize({ width: 390, height: 1200 });
  await pagina.waitForTimeout(250);
  const f = join(CARTELLA_SCATTI, `${nome}-print-390.png`);
  await pagina.screenshot({ path: f, fullPage: true });
  nScatti++;
  console.log(`     scatto → ${f}`);
  if (prima && prima.width !== 390) await pagina.setViewportSize(prima);
};

/* La domanda «esce dal proprio riquadro?» la sa dire il browser: si chiede a
   lui, non si calcola. Stampa quanti soggetti ha guardato davvero. */
const TAGLIATI = (sel) => {
  const el = [...document.querySelectorAll(sel)];
  return { guardati: el.length, tagliati: el.filter(e => e.scrollWidth > e.clientWidth + 1)
    .map(e => ({ t: e.textContent, sw: e.scrollWidth, cw: e.clientWidth })) };
};

// ══ FLOTTA · il libretto macchina ════════════════════════════════════════
if (fai("flotta")) {
  console.log("\n── Flotta · il libretto macchina, sul foglio A4 (688 px) ──");
  const { ctx, pg } = await APRI(688);   // 210 mm − 2 × 14 mm di margine, a 96 dpi
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
  await pg.waitForTimeout(2400);
  dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

  await pg.click("#nav-mez").catch(() => {});
  await pg.waitForTimeout(600);
  /* ⛔ PRIMA DI MISURARE: la prova che il caso sia arrivato E che si sia
     navigato. Un banco che misura la dimostrazione di serie credendo di
     misurare il proprio caso risponde «tutto a posto» senza aver guardato. */
  const arrivato = await pg.evaluate(() => {
    const r = [...document.querySelectorAll("#mez-list .item")].find(e => e.textContent.includes("Escavatore Z9"));
    if (!r) return false; r.querySelector("[data-scheda-mezzo]").click(); return true;
  });
  if (!arrivato) { console.log("  ✗ il caso NON è arrivato nella pagina: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }
  await pg.waitForTimeout(900);
  const aperta = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter(p => getComputedStyle(p).display !== "none").map(p => p.id));
  dice(aperta.join() === "page-sch", "il libretto è la schermata aperta", aperta);

  // si PREME il bottone, non si simula la stampa a mano
  await pg.click("#btn-sch-stampa");
  await pg.waitForTimeout(400);
  dice(await pg.evaluate(() => window.__stampato > 0), "il bottone «Stampa il libretto» ha chiesto la stampa");

  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(400);

  const kpi = await pg.evaluate(TAGLIATI, "#sch-kpi .n");
  console.log(`     (${kpi.guardati} tessere misurate sul foglio)`);
  dice(kpi.guardati === 4 && kpi.tagliati.length === 0,
    "⛔ nessun numero della tessera esce dal suo riquadro sul foglio A4", kpi.tagliati);

  const foglio = await pg.evaluate(() => document.body.innerText);
  dice(/DATI DI ESEMPIO/i.test(foglio),
    "⛔ il foglio dichiara di essere fatto di dati di esempio");
  dice(/non documenta nessuna macchina reale/i.test(foglio),
    "e dice che cosa comporta: non si porta a un controllo, non si consegna a chi compra");

  const fermi = await pg.evaluate(() => {
    const box = document.getElementById("sch-fer");
    return { recap: (box.querySelector(".note.recap") || {}).innerText || "",
      righe: [...box.querySelectorAll(".item")].map(i => (i.querySelector(".badge") || {}).textContent || "") };
  });
  dice(fermi.righe.length === 3, "i tre fermi sono tutti sul foglio: nessuno sparisce", fermi.righe);
  dice(fermi.righe.filter(t => t.trim() === "—").length === 2,
    "due righe dichiarano di non avere una durata", fermi.righe);
  dice(/2 fermi non sono in questo conto/i.test(fermi.recap),
    "⛔ e la riga del totale dice quanti fermi NON ci sono dentro", fermi.recap);
  dice(/3 fermi registrati/.test(fermi.recap) && /11 giorni|5 giorni/.test(fermi.recap),
    "il totale continua a esserci: la guardia sta sull'assenza, non sul numero", fermi.recap);

  // la pagina non deve scorrere di lato sul foglio
  const largo = await pg.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  dice(largo.doc <= largo.win + 1, "il libretto non esce dalla larghezza del foglio", largo);
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  if (SCATTI) await scatta(pg, "flotta");
  await ctx.close();
}

// ══ SENTINELLA · il report di conformità ═════════════════════════════════
if (fai("sentinella")) {
  console.log("\n── Sentinella · il report per l'ente, sul foglio A4 (703 px) ──");
  const { ctx, pg } = await APRI(703);   // 210 mm − 2 × 12 mm di margine, a 96 dpi
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2400);
  dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

  await pg.click("#nav-rep").catch(() => {});
  await pg.waitForTimeout(900);
  // il periodo dev'essere abbastanza largo da contenere il 30 febbraio: il
  // difetto vive lì, e su trenta giorni non si vedrebbe
  await pg.evaluate(() => {
    const d = document.getElementById("rep-dal");
    d.value = "2026-01-01";
    d.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await pg.waitForTimeout(900);
  const doc = await pg.evaluate(() => (document.getElementById("rep-doc") || {}).innerText || "");
  if (!/Report di conformità/i.test(doc)) { console.log("  ✗ il report non si è composto: il banco non prova niente"); await b.close(); srv.close(); process.exit(2); }

  await pg.click("#btn-rep-stampa");
  await pg.waitForTimeout(500);
  dice(await pg.evaluate(() => window.__stampato > 0), "il bottone «Stampa / Salva PDF» ha chiesto la stampa");

  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(400);
  const foglio = await pg.evaluate(() => document.body.innerText);

  dice(/DATI DI ESEMPIO/i.test(foglio),
    "⛔ il report dichiara di essere fatto di dati di esempio");
  dice(/non va consegnato a nessun ente/i.test(foglio),
    "e dice che cosa comporta: non si consegna a nessun ente");

  /* La lettura col giorno che non esiste: non dev'essere una riga della
     tabella, e la sua assenza va DICHIARATA. Le due cose insieme: toglierla
     e basta avrebbe spostato la bugia. */
  const righeSenzaData = await pg.evaluate(() =>
    [...document.querySelectorAll("#rep-doc .tab tbody tr")]
      .filter(r => (r.children[0] || {}).textContent === "—").length);
  dice(righeSenzaData === 0,
    "⛔ nessuna riga del documento porta un trattino al posto della data", righeSenzaData);
  dice(/non ha potuto usare/i.test(foglio),
    "⛔ e il documento dichiara le righe che ha dovuto lasciare fuori");
  dice(/2 righe che questo documento non ha potuto usare/i.test(foglio),
    "sono due: la lettura del 30 febbraio e la volata senza data leggibile",
    (foglio.match(/[^.]*non ha potuto usare[^.]*\./) || [""])[0]);
  dice(!/99/.test((await pg.evaluate(() => {
    const t = [...document.querySelectorAll("#rep-doc .tab")][0];
    return t ? t.innerText : "";
  }))), "il valore fuori soglia datato 30 febbraio non compare nella prima tabella");

  const largo = await pg.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  dice(largo.doc <= largo.win + 1, "il report non esce dalla larghezza del foglio", largo);
  const celle = await pg.evaluate(TAGLIATI, "#rep-doc .tab td, #rep-doc .rep-cifra .v");
  console.log(`     (${celle.guardati} celle e cifre misurate sul foglio)`);
  dice(celle.tagliati.length === 0, "nessuna cella della tabella taglia il suo contenuto", celle.tagliati);
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  if (SCATTI) await scatta(pg, "sentinella");
  await ctx.close();
}

// ══ CONTI · i tre fogli che si danno in mano a qualcuno ══════════════════
/* Preventivo, DDT e fattura passano tutti da `testaStampa`: la dichiarazione
   sta lì, in un posto solo. Quindi si premono TUTTI E TRE i bottoni — se un
   foglio non passasse di lì il banco lo direbbe, ed è esattamente la copia
   debole che si vuole vedere nascere. */
if (fai("conti")) {
  console.log("\n── Conti · preventivo, DDT e fattura, sul foglio A4 (688 px) ──");
  const { ctx, pg } = await APRI(688);   // 210 mm − 2 × 14 mm di margine, a 96 dpi
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
  await pg.waitForTimeout(2400);
  dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

  /* ⛔ PRIMA DI MISURARE: la prova che l'app sia DAVVERO in dimostrazione.
     Su `db.mode === "live"` la dichiarazione non deve esserci, e un banco che
     non lo controlla scambierebbe «foglio pulito» per «difetto assente». */
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("tour-banner")).display === "block"),
    "l'app è in modalità dimostrazione: la fascia in alto è accesa");

  const FOGLI = [
    ["ord", "[data-stampa-ord]", "preventivo", /PREVENTIVO|CONFERMA D'ORDINE/i],
    ["pes", "[data-stampa-ddt]", "DDT", /DOCUMENTO DI TRASPORTO/i],
    ["fat", "[data-stampa-fat]", "fattura", /FATTURA/i],
  ];
  let stampati = 0;
  for (const [sez, sel, nome, titolo] of FOGLI) {
    await pg.click(`#nav-${sez}`).catch(() => {});
    await pg.waitForTimeout(800);
    for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
      await acc.click({ timeout: 2000 }).catch(() => {});
      await pg.waitForTimeout(100);
    }
    const quanti = await pg.evaluate((s) => document.querySelectorAll(s).length, sel);
    if (!quanti) { console.log(`  ✗ nessun bottone «${sel}»: il banco non prova niente su ${nome}`); ko++; continue; }
    await pg.evaluate(() => { window.__stampato = 0; });
    await pg.click(sel);           // si PREME il bottone, non si compone il foglio a mano
    await pg.waitForTimeout(450);
    dice(await pg.evaluate(() => window.__stampato > 0), `il bottone di stampa «${nome}» ha chiesto la stampa`);

    await pg.emulateMedia({ media: "print" });
    await pg.waitForTimeout(300);
    const f = await pg.evaluate(() => (document.getElementById("stampa") || {}).innerText || "");
    stampati++;
    dice(titolo.test(f), `il foglio composto è davvero «${nome}»`, f.slice(0, 90));
    diceAvviso(/DATI DI ESEMPIO/i.test(f), `⛔ il foglio «${nome}» dichiara di essere fatto di dati di esempio`);
    diceAvviso(/non ha valore fiscale/i.test(f) && /non va esibito a un controllo/i.test(f),
      `e dice che cosa comporta: niente valore fiscale, non si consegna, non si esibisce`);
    /* ⛔ E LA DICHIARAZIONE NON DEVE COPRIRE IL DOCUMENTO: si controlla che il
       corpo del foglio ci sia ancora e che nulla esca di lato. Un avviso che
       mangia la pagina è un difetto nuovo messo al posto di quello vecchio. */
    const largo = await pg.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    dice(largo.doc <= largo.win + 1, `il foglio «${nome}» non esce dalla larghezza`, largo);
    await pg.emulateMedia({ media: "screen" });
    await pg.waitForTimeout(150);
  }
  console.log(`     (${stampati} fogli su ${FOGLI.length} composti e letti in @media print)`);
  dice(stampati === FOGLI.length, "tutti e tre i fogli di Conti sono stati aperti", stampati);
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  if (SCATTI) { await pg.emulateMedia({ media: "print" }); await scatta(pg, "conti"); }
  await ctx.close();
}

// ══ TERRA · i due fogli, che vivono in una FINESTRA NUOVA ════════════════
/* Qui il `@media print` della pagina non c'entra niente: `fogliaStampa` e
   `fogliaVerbale` compongono un HTML intero e lo scrivono in una finestra
   aperta con `window.open`. Il banco deve raccogliere il popup, se no misura
   la pagina e risponde «pulito» senza aver mai visto il documento. */
if (fai("terra")) {
  console.log("\n── Terra · riepilogo annuale e verbale, in finestra nuova ──");
  const { ctx, pg } = await APRI(688);
  const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
  await pg.waitForTimeout(2400);
  dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("tour-banner")).display === "block"),
    "l'app è in modalità dimostrazione: la fascia in alto è accesa");

  // legge il documento DALLA FINESTRA NUOVA, in @media print e a 390 px
  const leggiPopup = async (pop, nome) => {
    await pop.waitForLoadState("domcontentloaded").catch(() => {});
    await pop.setViewportSize({ width: 390, height: 1200 });
    await pop.emulateMedia({ media: "print" });
    await pop.waitForTimeout(300);
    if (SCATTI) await scatta(pop, "terra-" + nome);
    return pop.evaluate(() => ({
      testo: document.body.innerText,
      // «esce dal suo spazio?» lo dice il browser, non si calcola
      doc: document.documentElement.scrollWidth, win: window.innerWidth,
      avvisi: document.querySelectorAll(".esempio").length,
    }));
  };

  let aperti = 0;
  // ── 1. il riepilogo annuale, quello che si allega alla comunicazione ──
  await pg.click("#nav-den").catch(() => {});
  await pg.waitForTimeout(1200);
  {
    const [pop] = await Promise.all([
      pg.waitForEvent("popup", { timeout: 8000 }).catch(() => null),
      pg.click("#btn-den-stampa"),
    ]);
    if (!pop) { console.log("  ✗ la finestra del riepilogo non si è aperta: il banco non prova niente"); ko++; }
    else {
      aperti++;
      const d = await leggiPopup(pop, "riepilogo");
      dice(/Riepilogo annuale dei volumi/i.test(d.testo), "la finestra contiene il riepilogo annuale", d.testo.slice(0, 80));
      diceAvviso(/DATI DI ESEMPIO/i.test(d.testo), "⛔ il riepilogo dichiara di essere fatto di dati di esempio");
      diceAvviso(/non va inviato all'ente/i.test(d.testo),
        "e dice che cosa comporta: non si invia all'ente, non si allega alla comunicazione annuale");
      dice(d.avvisi === (ATTESO ? 1 : 0), `la dichiarazione compare ${ATTESO ? "una volta sola" : "zero volte"}`, d.avvisi);
      dice(/Titolo autorizzativo/i.test(d.testo) && /Volumi dell'anno/i.test(d.testo),
        "e non ha coperto il documento: il prospetto è ancora tutto lì");
      dice(d.doc <= d.win + 1, "il prospetto non esce dalla larghezza del foglio a 390 px", d);
      await pop.close();
    }
  }
  // ── 2. il verbale di rilievo, che passa da una modale ────────────────
  await pg.click("#nav-ril").catch(() => {});
  await pg.waitForTimeout(1000);
  {
    const quanti = await pg.evaluate(() => document.querySelectorAll("[data-verb-ril]").length);
    if (!quanti) { console.log("  ✗ nessun rilievo col bottone del verbale: il banco non prova niente"); ko++; }
    else {
      await pg.click("[data-verb-ril]");
      await pg.waitForTimeout(600);
      const [pop] = await Promise.all([
        pg.waitForEvent("popup", { timeout: 8000 }).catch(() => null),
        pg.click("#modal-foot .mbtn.primary"),   // «Prepara il verbale»
      ]);
      if (!pop) { console.log("  ✗ la finestra del verbale non si è aperta: il banco non prova niente"); ko++; }
      else {
        aperti++;
        const d = await leggiPopup(pop, "verbale");
        dice(/Verbale di rilievo/i.test(d.testo), "la finestra contiene il verbale di rilievo", d.testo.slice(0, 80));
        diceAvviso(/DATI DI ESEMPIO/i.test(d.testo), "⛔ il verbale dichiara di essere fatto di dati di esempio");
        diceAvviso(/non va allegato a una comunicazione/i.test(d.testo),
          "e dice che cosa comporta: non si allega, non si esibisce a un controllo");
        dice(d.avvisi === (ATTESO ? 1 : 0), `la dichiarazione compare ${ATTESO ? "una volta sola" : "zero volte"}`, d.avvisi);
        dice(/Il rilievo/i.test(d.testo), "e non ha coperto il documento: il verbale è ancora tutto lì");
        dice(d.doc <= d.win + 1, "il verbale non esce dalla larghezza del foglio a 390 px", d);
        await pop.close();
      }
    }
  }
  console.log(`     (${aperti} finestre su 2 aperte, lette in @media print a 390 px)`);
  dice(aperti === 2, "tutti e due i fogli di Terra sono stati aperti davvero", aperti);
  dice(errori.length === 0, "e nessun errore in pagina alla fine del giro", errori.slice(0, 2));
  await ctx.close();
}

await b.close(); srv.close();
console.log(`\nRisultato fogli stampati: ${ok} passati, ${ko} falliti  ·  ${nCasi} moduli con i casi montati`
  + (SCATTI ? `  ·  ${nScatti} scatti in @media print a 390 px` : "")
  + (CONTROPROVA ? `  ·  ${nDifetti} difetti rimessi, ${difettiMancati} iniezioni mancate` : ""));
if (CONTROPROVA) {
  if (difettiMancati) { console.log("⛔ qualche iniezione non ha trovato il suo soggetto: la controprova non vale."); process.exit(2); }
  console.log(ko > 0 ? "controprova: il banco SA fallire ✔" : "⛔ controprova INERTE: coi difetti rimessi il banco passa lo stesso.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

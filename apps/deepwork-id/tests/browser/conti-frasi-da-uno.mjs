/* LE FRASI DI CONTI QUANDO IL NUMERO È UNO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-frasi-da-uno.mjs [--porta=8720]
     node conti-frasi-da-uno.mjs --controprova   (rimette i difetti: DEVE fallire)
     node conti-frasi-da-uno.mjs --dimmi         (stampa i testi raccolti)

   PERCHÉ ESISTE, ANCHE SE `conti-frasi.mjs` C'È GIÀ.
   Quello è nato LEGGENDO il codice e provando i casi scelti a mano: prende i
   cinque plurali fissi che si era andati a cercare. Questo nasce dal gesto
   opposto, quello che in Flotta ha tirato fuori ventiquattro frasi e in Campo
   un rapporto datato su un giorno che nessuno aveva dichiarato: **si apre
   l'app con UN dato per collezione e si guarda cosa si rompe**. Una fattura,
   un cliente, un DDT, un ordine, una voce di listino, un costo, un incasso,
   una gara, un rilievo, un movimento in banca — e il canone calcolato su
   quell'unico viaggio.

   QUELLO CHE HA TROVATO (13 difetti veri, tutti col sostantivo GIÀ giusto e
   il resto della frase no — è la forma che il censimento sui sostantivi non
   prende, la stessa di «1 segnalazione SONO meno di 5» in Scudo):

   · gli OTTO messaggi di export, participio al plurale accanto al sostantivo
     al singolare: «**Esportate** 1 fattura in CSV», «**Esportati** 1 incasso»,
     «**Esportati** 1 cliente», «**Esportate** 1 voce di costo», «**Esportati**
     1 prodotto col prezzo convertito», «**Esportate** 1 pesata», «**Esportati**
     1 prodotto (CSV)», «**Esportate** 1 gara». Il nono — «1 preventivo
     esportato» — era già giusto, e sta qui come guardia;
   · in Banca, appena letto il file: «**Letti** 1 movimento (su 2 righe:
     l'intestazione non si conta)», mentre due centimetri sotto il riepilogo
     scriveva già «1 riga letta»;
   · nella finestra che elimina una fattura: «Vengono eliminati anche **i 1
     incasso registrato** su questa fattura (€ 220,00): senza la fattura non
     **avrebbero** più un documento a cui riferirsi» — articolo, verbo e
     ausiliare al plurale attorno a un sostantivo singolare che `plur` aveva
     già sistemato;
   · nella previsione incassi, due volte la stessa cosa in due punti diversi:
     «**Escluse** 1 **già scadute** (€ 1.000,00): **quelle vanno** sollecitate»
     nel riquadro, e «**Le 1 già scadute** (€ 1.000) non **entrano** nella
     previsione: **vanno** sollecitate» nello stato vuoto del grafico;
   · e uno nel MODULO, che è il posto dove nessuna prova della pagina guarda:
     `margineMese` scriveva «rispetto agli altri mesi **mancano i costi di**
     personale» con UNA voce sola — e quattro righe più sotto, nella stessa
     funzione, il `motivo` del mese CHIUSO il singolare lo faceva già («una
     voce non è mai stata dichiarata»). L'asimmetria dentro la stessa
     funzione, che è il segno da riconoscere.
     ⚠️ E questo si vede anche nella dimostrazione com'è: a luglio manca
     l'energia e basta. Non era un caso di laboratorio.

   QUELLO CHE HA GUARDATO E HA TROVATO SANO, col conto accanto perché un
   «nessuna violazione» senza numero non distingue «pulito» da «non ho aperto
   niente»: i **tre fogli che si stampano** (DDT, fattura, conferma d'ordine —
   nessuna unità corrotta dal maiuscolo, `.u` è esentata anche in stampa), il
   **sollecito** e l'**estratto conto** (che `conti-frasi.mjs` già difende), i
   **nove file CSV** che escono dai bottoni di export, e tutta la famiglia
   della bandiera `calcolabile`: con l'unico DDT non valorizzabile il foglio
   scrive «non calcolabile» e il perché, la cella del CSV resta **vuota** (non
   zero), e il totale delle consegne dichiara che è per difetto.

   ⚠️ IL CASO SI COSTRUISCE NEI DATI SERVITI, mai sul disco: si appende una
   coda alla risposta HTTP di `conti-data.js` (parametro `rotte` di
   `giro.mjs`, qui in versione server perché servono DUE varianti dello stesso
   modulo nella stessa passata). CLAUDE.md vieta di toccare il modulo vero
   mentre girano cantieri paralleli.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8720;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* ── IL CASO: UNO PER COLLEZIONE ──────────────────────────────────────────
   Le date sono relative a oggi, mai incollate: una scadenza fissa sarebbe
   «scaduta da un giorno» per ventiquattr'ore sole, e la prova direbbe cose
   diverse a seconda di quando gira. */
const CASO_UNO = `
/* ── caso montato dal banco conti-frasi-da-uno.mjs (mai sul disco) ── */
const _isoU = (d) => \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, "0")}-\${String(d.getDate()).padStart(2, "0")}\`;
const _gU = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return _isoU(d); };
DEMO.clienti.length = 0;
DEMO.clienti.push({ id: "u-c1", ragioneSociale: "Unica Srl", piva: "11111111111", sdi: "ZZZ1111",
  indirizzo: "Via Uno 1, Ragusa", sconto: 5, fido: 9000, note: "" });
DEMO.prodotti.length = 0;
DEMO.prodotti.push({ id: "u-p1", nome: "Stabilizzato 0/30", unitaPrezzo: "t", prezzo: 8.5, densita: 1.9, iva: 22,
  scaglioni: [{ da: 250, sconto: 4 }] });
DEMO.fatture.length = 0;
DEMO.fatture.push({ id: "u-f1", numero: "2026/001", cliente: "Unica Srl", clienteId: "u-c1",
  importo: 1220, emessa: _gU(31), scadenza: _gU(1), incassata: false });
DEMO.incassi.length = 0;
DEMO.incassi.push({ id: "u-i1", fatturaId: "u-f1", data: _gU(2), importo: 220, metodo: "bonifico" });
DEMO.pesate.length = 0;
DEMO.pesate.push({ id: "u-d1", numero: "2026/001", data: _gU(3), clienteId: "u-c1", cliente: "Unica Srl",
  prodottoId: "u-p1", prodotto: "Stabilizzato 0/30", lordo: 15.2, tara: 14.2, netto: 1,
  unitaVendita: "t", quantita: 1, densita: 1.9, prezzoUnitario: 8.5, scontoPct: 5, aliquotaIva: 22,
  mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", ordineId: "u-o1", fontePrezzo: "ordine",
  fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" });
DEMO.ordini.length = 0;
DEMO.ordini.push({ id: "u-o1", numero: "PREV/2026/001", numeroOrdine: "ORD/2026/001", data: _gU(20),
  validoAl: _gU(-10), clienteId: "u-c1", cliente: "Unica Srl", stato: "accettato", decisoIl: _gU(15),
  riferimento: "Richiesta del 12/06 — cantiere SS115", note: "Consegne a chiamata.",
  righe: [{ prodottoId: "u-p1", descrizione: "Stabilizzato 0/30", quantita: 300, unita: "t",
    densita: 1.9, prezzoUnitario: 8.5, scontoPct: 5, aliquota: 22, imponibile: 2422.5 }] });
DEMO.gare.length = 0;
DEMO.gare.push({ id: "u-g1", titolo: "Comune di Ragusa — inerti 2026-27", base: 120000, scadenza: _gU(-20), stato: "aperta" });
DEMO.costi.length = 0;
DEMO.costi.push({ id: "u-k1", data: _gU(6), voce: "personale", importo: 55, nota: "Squadra di fronte" });
DEMO.rilieviTerra.length = 0;
DEMO.rilieviTerra.push({ id: "u-t1", titolo: "Rilievo di fine mese", data: _gU(5), volumeM3: 47,
  stato: "elaborato", metodo: "RTK+GCP", gsd: "2" });
DEMO.note = [];
DEMO.chiusure = [];
`;

/* La VARIANTE: l'unico DDT non è valorizzabile (venduto a metro cubo, prodotto
   senza densità). Serve alla seconda metà del banco — chi legge la bandiera
   `calcolabile` nei documenti che escono. */
const CASO_NON_VALORIZZABILE = `
DEMO.prodotti[0].densita = null;
DEMO.pesate[0].unitaVendita = "m3";
DEMO.pesate[0].quantita = null;
DEMO.pesate[0].densita = null;
`;

/* I DIFETTI DA RIMETTERE, nella forma in cui stavano nella pagina prima del
   06/08. Si contano quelli davvero rimessi: un `replace` che non trova niente
   non fallisce, esce in silenzio, e la controprova dichiara verde una prova
   che non ha provato nulla. */
const DIFETTI = [
  // 1-8 · gli otto messaggi di export, participio inchiodato al plurale
  ['esito("rep-esito", plurale(FAT.length, "Esportata ", "Esportate ") + plur(FAT.length, "fattura", "fatture") + " in CSV.", "success");',
   'esito("rep-esito", "Esportate " + plur(FAT.length, "fattura", "fatture") + " in CSV.", "success");'],
  ['? plurale(righe.length, "Esportato ", "Esportati ") + plur(righe.length, "incasso", "incassi") + " in CSV."',
   '? "Esportati " + plur(righe.length, "incasso", "incassi") + " in CSV."'],
  ['esito("cl-esito", plurale(CLI.length, "Esportato ", "Esportati ") + plur(CLI.length, "cliente", "clienti") + " in CSV.", "success");',
   'esito("cl-esito", "Esportati " + plur(CLI.length, "cliente", "clienti") + " in CSV.", "success");'],
  ['esito("cos-esito", plurale(r.righe.length + r.righeSenzaData.length, "Esportata ", "Esportate ") + plur(r.righe.length + r.righeSenzaData.length, "voce di costo", "voci di costo") + ".", "success");',
   'esito("cos-esito", "Esportate " + plur(r.righe.length + r.righeSenzaData.length, "voce di costo", "voci di costo") + ".", "success");'],
  ['esito("pr-esito", plurale(PRO.length, "Esportato ", "Esportati ") + plur(PRO.length, "prodotto", "prodotti") + " col prezzo convertito',
   'esito("pr-esito", "Esportati " + plur(PRO.length, "prodotto", "prodotti") + " col prezzo convertito'],
  ['esito("pes-esito", plurale(PES.length, "Esportata ", "Esportate ") + plur(PES.length, "pesata", "pesate") + " in CSV.", "success");',
   'esito("pes-esito", "Esportate " + plur(PES.length, "pesata", "pesate") + " in CSV.", "success");'],
  ['esito("lis-esito", plurale(PRO.length, "Esportato ", "Esportati ") + plur(PRO.length, "prodotto", "prodotti") + " (CSV).", "success");',
   'esito("lis-esito", "Esportati " + plur(PRO.length, "prodotto", "prodotti") + " (CSV).", "success");'],
  ['esito("gar-esito", plurale(GAR.length, "Esportata ", "Esportate ") + plur(GAR.length, "gara", "gare") + " in CSV.", "success");',
   'esito("gar-esito", "Esportate " + plur(GAR.length, "gara", "gare") + " in CSV.", "success");'],
  // 9 · la banca appena letta
  ['`${plurale(BANMOV.length, "Letto", "Letti")} ${plur(BANMOV.length, "movimento", "movimenti")}`',
   '`Letti ${plur(BANMOV.length, "movimento", "movimenti")}`'],
  // 10 · la finestra dell'eliminazione: articolo, participio e ausiliare
  ['`<p>${plurale(movimentiDiFattura(f.id, INC).length, "Viene eliminato anche l\'", "Vengono eliminati anche i ")}<b>${plurale(movimentiDiFattura(f.id, INC).length, "unico incasso registrato", movimentiDiFattura(f.id, INC).length + " incassi registrati")}</b> su questa fattura',
   '`<p>Vengono eliminati anche i <b>${plur(movimentiDiFattura(f.id, INC).length, "incasso registrato", "incassi registrati")}</b> su questa fattura'],
  ['): senza la fattura non ${plurale(movimentiDiFattura(f.id, INC).length, "avrebbe", "avrebbero")} più un documento a cui riferirsi.</p>`',
   '): senza la fattura non avrebbero più un documento a cui riferirsi.</p>`'],
  // 11-12 · la previsione incassi, nei suoi due punti
  ['`<div class="note">${plurale(prev.scadute.conto, "Esclusa", "Escluse")} <b>${prev.scadute.conto}</b> ${plurale(prev.scadute.conto, "già scaduta", "già scadute")} (<b>${eur(prev.scadute.importo)}</b>): ${plurale(prev.scadute.conto, "quella va sollecitata", "quelle vanno sollecitate")}, la trovi nell\'aging qui sopra.</div>`',
   '`<div class="note">Escluse <b>${prev.scadute.conto}</b> già scadute (<b>${eur(prev.scadute.importo)}</b>): quelle vanno sollecitate, le trovi nell\'aging qui sopra.</div>`'],
  [' " + plurale(prev.scadute.conto, "L\'<b>unica</b> già scaduta", "Le <b>" + prev.scadute.conto + "</b> già scadute") + " (" + eur0(prev.scadute.importo) + ") non " + plurale(prev.scadute.conto, "entra", "entrano") + " nella previsione: " + plurale(prev.scadute.conto, "va sollecitata", "vanno sollecitate") + "."',
   ' Le <b>" + prev.scadute.conto + "</b> già scadute (" + eur0(prev.scadute.importo) + ") non entrano nella previsione: vanno sollecitate."'],
];
/* E UNO STA NEL MODULO. Rimettendo solo quelli della pagina, la chiusura del
   mese resterebbe giusta e la prova che la guarda passerebbe: è l'iniezione
   puntata nel posto sbagliato, la quarta causa dell'elenco di CLAUDE.md. */
const DIFETTI_MODULO = [
  ['${plurale(man.mancanti.length, "manca il costo di", "mancano i costi di")}', 'mancano i costi di', 1],
];

let VARIANTE = "A";
let iniezioniCasi = 0, iniezioniDifetti = 0, mancate = 0;
const colpiti = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/conti/conti-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [da, a, quanti] of DIFETTI_MODULO) {
      const n = t.split(da).length - 1;
      if (n !== quanti) { console.log(`⛔ INIEZIONE MANCATA nel modulo: ${n} soggetti (attesi ${quanti}) per «${da.slice(0, 45)}…»`); mancate++; continue; }
      t = t.split(da).join(a); colpiti.add(da);
    }
    t += CASO_UNO + (VARIANTE === "B" ? CASO_NON_VALORIZZABILE : "");
    iniezioniCasi++;
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    for (const [da, a] of DIFETTI) {
      const n = t.split(da).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 45)}…»`); mancate++; continue; }
      t = t.replace(da, a); colpiti.add(da);
    }
    corpo = Buffer.from(t, "utf8");
  }
  /* niente cache: la seconda variante è lo STESSO indirizzo con un corpo
     diverso, e un modulo servito dalla cache misurerebbe il caso di prima */
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});

/* ⛔ LA PORTA SI SCEGLIE DOPO AVER VERIFICATO CHE SIA LIBERA, e il server si
   riconosce da un contrassegno col proprio pid RILETTO da lui: un banco che
   trova la porta occupata e la riusa non fallisce — misura la copia di
   qualcun altro, ed è la forma silenziosa della trappola. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); } }

console.log(`\n════════ le frasi di Conti quando il numero è uno${CONTROPROVA ? " · controprova" : ""} ════════`);
console.log(`porta ${porta} · contrassegno = pid ${process.pid} ✔`);

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* i soggetti guardati davvero: senza questi numeri un «nessuna violazione»
   non distingue «pulito» da «non ho aperto niente» */
let schermate = 0, caratteri = 0, fileCsv = 0, celleCsv = 0, finestre = 0, fogli = 0;
const raccolto = [];      // tutto il testo letto, per il setaccio finale

async function apri(coda) {
  const ctx = await b.newContext({ viewport: { width: 430, height: 950 }, locale: "it-IT" });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => {
    window.print = () => {};
    window.__csv = [];
    /* la copia negli appunti va fatta FALLIRE: se riesce, sollecito ed
       estratto conto non compaiono in nessuna finestra e il banco misurerebbe
       il vuoto credendo di leggere la lettera */
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("no")) }, configurable: true });
    document.execCommand = () => false;
    URL.createObjectURL = (blob) => { blob.text().then((t) => window.__csv.push(t)); return "blob:x"; };
    HTMLAnchorElement.prototype.click = function () {
      if (this.href && this.href.startsWith("data:")) window.__csv.push(decodeURIComponent(this.href.split(",").slice(1).join(",")));
    };
  });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
  await pg.waitForTimeout(2600);
  if (coda) await coda(pg);
  return { ctx, pg, errori };
}

const apriTutto = async (pg) => {
  for (const a of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
    await a.click({ timeout: 2000 }).catch(() => {}); await pg.waitForTimeout(60);
  }
  await pg.waitForTimeout(300);
};
/* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un click che cade nel vuoto
   lascia il banco a fotografare la stessa schermata dieci volte e a dire
   «tutto a posto» dopo averne guardata una su dieci. */
const vai = async (pg, s) => {
  await pg.click(`#nav-${s}`).catch(() => {});
  await pg.waitForTimeout(650);
  const viva = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
  if (!viva.includes(`page-${s}`)) { dice(false, `navigato alla schermata ${s}`, viva); return false; }
  await apriTutto(pg);
  return true;
};
const testoPagina = (pg, s) => pg.evaluate((id) => document.getElementById("page-" + id).innerText, s);
const esiti = (pg) => pg.evaluate(() => [...document.querySelectorAll(".toast,#toast,.dw-toast,[id$='-esito']")]
  .map((x) => x.innerText).filter(Boolean).join(" ⏎ "));
const testoModale = (pg) => pg.evaluate(() => {
  const m = document.getElementById("modal-body"); if (!m) return "";
  const ta = m.querySelector("textarea");
  return (ta ? ta.value + "\n" : "") + m.innerText;
});

// ══════════════════════════════════════════════════════════════════════════
// PARTE A · l'app con UN dato per collezione
// ══════════════════════════════════════════════════════════════════════════
const A = await apri();
dice(A.errori.length === 0, "la pagina non solleva errori", A.errori[0]);
dice(iniezioniCasi >= 1, "il caso «uno per collezione» è stato appeso al modulo servito", iniezioniCasi);

const SEZ = ["dash", "fat", "ban", "ord", "pes", "cos", "lis", "cli", "gar", "rep"];
const testo = {};
for (const s of SEZ) {
  if (!(await vai(A.pg, s))) continue;
  testo[s] = await testoPagina(A.pg, s);
  schermate++; caratteri += testo[s].length;
  raccolto.push([`schermata ${s}`, testo[s]]);
}
dice(schermate === SEZ.length, `tutte le schermate lette (${schermate} su ${SEZ.length}, ${caratteri} caratteri)`, schermate);

// ── 1 · LA CHIUSURA DEL MESE, che è una frase del MODULO ─────────────────
console.log("\n· la chiusura del mese con UNA sola voce mancante (frase del modulo)");
{
  const t = testo.cos || "";
  dice(/manca il costo di personale/.test(t),
    "⛔ «rispetto agli altri mesi manca il costo di personale» — quattro righe sotto, la stessa funzione il singolare lo faceva già",
    (t.match(/rispetto agli altri mesi[^.]{0,80}/) || [])[0]);
  dice(!/mancano i costi di personale\./.test(t), "e mai «mancano i costi di personale»",
    (t.match(/mancano i costi[^.]{0,60}/) || [])[0]);
}

// ── 2 · LA PREVISIONE INCASSI, nei suoi due punti ────────────────────────
console.log("\n· la previsione incassi con UNA sola fattura già scaduta");
{
  const t = testo.rep || "";
  dice(/Esclusa 1 già scaduta/.test(t), "⛔ «Esclusa 1 già scaduta», non «Escluse 1 già scadute»",
    (t.match(/Esclus[ae][^.]{0,90}/) || [])[0]);
  dice(/quella va sollecitata/.test(t), "⛔ «quella va sollecitata», non «quelle vanno sollecitate»",
    (t.match(/Esclus[ae][^.]{0,120}/) || [])[0]);
  dice(/L'unica già scaduta/.test(t), "⛔ nello stato vuoto del grafico: «L'unica già scaduta», non «Le 1 già scadute»",
    (t.match(/(Le 1|L'unica)[^.]{0,110}/) || [])[0]);
  dice(/non entra nella previsione: va sollecitata/.test(t),
    "⛔ «non entra nella previsione: va sollecitata» — verbo e participio compresi",
    (t.match(/non entr[ao] nella previsione[^.]{0,60}/) || [])[0]);
}

// ── 3 · LA FINESTRA CHE ELIMINA LA FATTURA, con UN incasso registrato ────
console.log("\n· la finestra dell'eliminazione con UN incasso registrato");
if (await vai(A.pg, "fat")) {
  await A.pg.click("[data-del-fat]").catch(() => {});
  await A.pg.waitForTimeout(750);
  const m = await testoModale(A.pg);
  finestre++; raccolto.push(["finestra: elimina fattura", m]);
  dice(/Viene eliminato anche l'unico incasso registrato/.test(m),
    "⛔ «Viene eliminato anche l'unico incasso registrato» — articolo e participio, non solo il sostantivo",
    m.slice(-260));
  dice(/non avrebbe più un documento a cui riferirsi/.test(m),
    "⛔ «non avrebbe più un documento», non «non avrebbero»", m.slice(-160));
  dice(!/i 1 incasso/.test(m), "e mai «i 1 incasso registrato»", m.slice(-260));
  await A.pg.keyboard.press("Escape").catch(() => {}); await A.pg.waitForTimeout(300);
}

// ── 4 · LE DUE LETTERE CHE ESCONO DALL'AZIENDA ───────────────────────────
/* Le difende già `conti-frasi.mjs`; qui si rileggono col caso costruito in un
   altro modo, perché sono le uniche due frasi di Conti che finiscono in mano
   a un cliente. */
console.log("\n· il sollecito e l'estratto conto — le due cose che legge il cliente");
if (await vai(A.pg, "fat")) {
  await A.pg.click("[data-sollecito]").catch(() => {});
  await A.pg.waitForTimeout(800);
  const s = await testoModale(A.pg);
  finestre++; raccolto.push(["finestra: sollecito", s]);
  dice(/\(1 giorno di ritardo\)/.test(s), "il sollecito scrive «1 giorno di ritardo»",
    (s.match(/scaduta il[^:]{0,60}/) || [])[0]);
  dice(!/\b1 giorni\b/.test(s), "e mai «1 giorni» — è la lettera che arriva al cliente", s.slice(0, 240));
  if (DIMMI) console.log(`\n[sollecito]\n${s}\n`);
  await A.pg.keyboard.press("Escape").catch(() => {}); await A.pg.waitForTimeout(300);
}
if (await vai(A.pg, "rep")) {
  await A.pg.click("[data-espo]").catch(() => {});
  await A.pg.waitForTimeout(800);
  const e = await testoModale(A.pg);
  finestre++; raccolto.push(["finestra: estratto conto", e]);
  dice(/Fatture aperte \(1\)/.test(e), "l'estratto conto elenca la sola fattura aperta", e.slice(0, 160));
  dice(/× 1 fattura scaduta\)/.test(e), "e scrive «× 1 fattura scaduta», non «fatture scadute»",
    (e.split("\n").find((r) => /art\. 6/.test(r)) || e.slice(0, 200)));
  if (DIMMI) console.log(`\n[estratto conto]\n${e}\n`);
  await A.pg.keyboard.press("Escape").catch(() => {}); await A.pg.waitForTimeout(300);
}

// ── 5 · I TRE FOGLI CHE SI STAMPANO ──────────────────────────────────────
/* ⛔ La trasformazione va chiesta in media «print»: `#stampa th` è in
   maiuscolo solo lì, e un banco che legge la pagina normale risponde «pulito»
   con il filtro nascosto dentro un media query. */
console.log("\n· i tre fogli che escono dalla stampante (DDT, fattura, conferma d'ordine)");
const UNITA = ["m³", "m²", "t/m³", "€/m³", "€/t", "kg", "gg", "mc", "cm", "mm", "km", "t"];
const foglio = async (nome, sez, sel) => {
  if (!(await vai(A.pg, sez))) return null;
  const el = await A.pg.$(sel);
  if (!el) { dice(false, `il bottone di stampa ${nome} esiste (${sel})`, "assente"); return null; }
  await el.click().catch(() => {});
  await A.pg.waitForTimeout(650);
  await A.pg.emulateMedia({ media: "print" }); await A.pg.waitForTimeout(200);
  const r = await A.pg.evaluate(() => {
    const s = document.getElementById("stampa");
    const su = [...s.querySelectorAll("*")].filter((e) => getComputedStyle(e).textTransform === "uppercase")
      .map((e) => ({ t: e.textContent.replace(/\s+/g, " ").trim(),
                     esenti: [...e.querySelectorAll(".u")].map((u) => ({ t: u.textContent, tt: getComputedStyle(u).textTransform })) }))
      .filter((x) => x.t);
    return { testo: s.innerText, su };
  });
  await A.pg.emulateMedia({ media: "screen" });
  fogli++; raccolto.push([`foglio ${nome}`, r.testo]);
  /* un'unità NUDA dentro un'etichetta in maiuscolo: è così che la tonnellata
     del DDT diventava un tesla, «LORDO (T)» */
  const nude = r.su.filter((x) => {
    const esenti = new Set(x.esenti.filter((u) => u.tt === "none").map((u) => u.t.trim()));
    return UNITA.some((u) => {
      if (esenti.has(u)) return false;
      for (let j = x.t.indexOf(u); j >= 0; j = x.t.indexOf(u, j + 1)) {
        const pr = j === 0 ? " " : x.t[j - 1], dp = x.t[j + u.length] || " ";
        if (/[\s\d(/·,]/.test(pr) && !/[a-zA-ZÀ-ÿ]/.test(dp)) return true;
      }
      return false;
    });
  });
  dice(nude.length === 0, `⛔ ${nome}: nessuna unità nuda dentro un'etichetta in maiuscolo (${r.su.length} etichette lette)`,
    nude.map((x) => x.t).join(" | "));
  await A.pg.keyboard.press("Escape").catch(() => {});
  await A.pg.waitForTimeout(200);
  return r.testo;
};
await foglio("il DDT", "pes", "[data-stampa-ddt]");
await foglio("la fattura", "fat", "[data-stampa-fat]");
await foglio("la conferma d'ordine", "ord", "[data-stampa-ord]");
dice(fogli === 3, `i tre fogli sono stati aperti davvero (${fogli} su 3)`, fogli);

// ── 6 · LA BANCA con UNA riga sola nel file ──────────────────────────────
console.log("\n· l'estratto conto della banca con UNA riga sola");
if (await vai(A.pg, "ban")) {
  const csv = "Data;Data valuta;Descrizione;Importo\n"
    + "05/08/2026;05/08/2026;BONIFICO DA UNICA SRL ACCONTO FATT 2026/001;220,00\n";
  await A.pg.setInputFiles("#ban-file", { name: "estratto.csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  await A.pg.waitForTimeout(1500);
  await apriTutto(A.pg);
  const t = await testoPagina(A.pg, "ban");
  raccolto.push(["banca · una riga", t]);
  dice(/Letto 1 movimento/.test(t), "⛔ «Letto 1 movimento», non «Letti 1 movimento»",
    (t.match(/Lett[oi] 1 movimento[^.]{0,60}/) || [])[0]);
  dice(/1 riga letta da/.test(t), "e il riepilogo sotto continua a dire «1 riga letta» (era già giusto)",
    (t.match(/1 rig[ah] lett[ae][^.]{0,40}/) || [])[0]);
}

// ── 7 · I NOVE MESSAGGI DI EXPORT, e i nove file che escono ──────────────
console.log("\n· i nove export, con una riga sola dappertutto");
const EXPORT = [
  ["rep", "btn-rep-export", /Esportata 1 fattura in CSV\./, "«Esportata 1 fattura», non «Esportate»"],
  ["rep", "btn-inc-export", /Esportato 1 incasso in CSV\./, "«Esportato 1 incasso», non «Esportati»"],
  ["cli", "btn-cli-export", /Esportato 1 cliente in CSV\./, "«Esportato 1 cliente», non «Esportati»"],
  ["cos", "btn-cos-export", /Esportata 1 voce di costo\./, "«Esportata 1 voce di costo», non «Esportate»"],
  ["lis", "btn-lis-prezzi", /Esportato 1 prodotto col prezzo convertito/, "«Esportato 1 prodotto col prezzo convertito»"],
  ["pes", "btn-pes-export", /Esportata 1 pesata in CSV\./, "«Esportata 1 pesata», non «Esportate»"],
  ["lis", "btn-lis-export", /Esportato 1 prodotto \(CSV\)\./, "«Esportato 1 prodotto (CSV)», non «Esportati»"],
  ["gar", "btn-gar-export", /Esportata 1 gara in CSV\./, "«Esportata 1 gara», non «Esportate»"],
  ["ord", "btn-or-export", /1 preventivo esportato\./, "«1 preventivo esportato» — questo era già giusto, e resta"],
];
for (const [sez, id, re, nome] of EXPORT) {
  if (!(await vai(A.pg, sez))) continue;
  await A.pg.evaluate(() => { window.__csv = []; });
  const el = await A.pg.$("#" + id);
  if (!el) { dice(false, `il bottone #${id} esiste`, "assente"); continue; }
  await el.click().catch(() => {});
  await A.pg.waitForTimeout(600);
  const visto = await esiti(A.pg);
  raccolto.push([`export ${id}`, visto]);
  dice(re.test(visto), `⛔ ${nome}`, visto);
  const csv = await A.pg.evaluate(() => (window.__csv || []).join("\n"));
  if (csv.trim()) {
    fileCsv++;
    celleCsv += csv.split("\n").filter(Boolean).reduce((t, r) => t + r.split(";").length, 0);
    raccolto.push([`csv ${id}`, csv]);
    if (DIMMI) console.log(`\n[${id}]\n${csv}`);
  }
}
dice(fileCsv >= 8, `i file CSV sono usciti davvero (${fileCsv} file, ${celleCsv} celle)`, fileCsv);

// ── 8 · IL SETACCIO: nessun «1 <plurale>» in niente di quello che ho letto ─
/* ⛔ LE ASSERZIONI QUI SOPRA GUARDANO I PUNTI CHE HO CORRETTO: questo guarda
   TUTTO IL RESTO — schermate, finestre, fogli di stampa, messaggi di esito e
   file CSV. Senza, il banco direbbe «a posto» su una frase nuova sbagliata
   scritta domani in un punto che non è in elenco.
   Il vocabolario è CORTO di proposito: sono le parole che in Conti compaiono
   davvero accanto a un conteggio, più i verbi e i participi, che sono la
   famiglia che il censimento sui sostantivi non prende. Una regola generale
   sul plurale italiano sbaglierebbe più di quanto prende, e un allarme che
   sbaglia insegna a non guardarlo. */
console.log("\n· il setaccio: nessun «1 <plurale>» in niente di quello che ho letto");
const PLURALI = ["fatture", "prodotti", "clienti", "righe", "mesi", "giorni", "gare", "pesate",
  "movimenti", "incassi", "voci", "ordini", "note", "costi", "volte", "anni", "documenti",
  "solleciti", "scadenze", "aliquote", "acconti", "spese", "viaggi", "consegne", "rilievi",
  "scaglioni", "preventivi", "aggiunte", "aggiunti", "saltati", "saltate", "ripetuti",
  "ripetute", "presenti", "aperti", "aperte", "scaduti", "scadute", "registrati", "registrate",
  "collegati", "collegate", "incassate", "saldate", "leggibili", "mancanti", "valorizzabili",
  "esportati", "esportate", "letti", "lette", "eliminati", "eliminate",
  "sono", "hanno", "vanno", "entrano", "mancano", "restano", "quelli", "quelle"];
const RE = new RegExp("(?:^|[^\\d,.])1[  ]+(" + PLURALI.join("|") + ")\\b", "gi");
/* ⛔ E IL SECONDO SETACCIO GUARDA DALL'ALTRA PARTE DEL NUMERO, perché è lì che
   stavano TUTTI E TREDICI i difetti di questa giornata: «**Esportate** 1
   fattura», «**Letti** 1 movimento», «Vengono eliminati anche **i** 1 incasso»,
   «**Escluse** 1 già scaduta». Col sostantivo al singolare il setaccio qui
   sopra è **cieco**, e infatti nella controprova resta verde mentre tredici
   asserzioni cadono: un censimento che guarda solo la parola DOPO il numero
   dichiara pulito un testo pieno di participi sbagliati.
   Il vocabolario è corto e scelto a mano: ci stanno solo le parole che in
   italiano non possono precedere un conteggio se non come testa di frase. «1
   aperte» NON c'è di proposito — «Aperte 1 · Vinte 0 · Perse 0» è
   l'intestazione delle gare, e sarebbe un allarme falso. */
const PRIMA = ["esportate", "esportati", "letti", "lette", "escluse", "esclusi",
  "eliminati", "eliminate", "vengono", "mancano", "entrano", "restano", "sono",
  "hanno", "vanno", "quelli", "quelle", "i", "le", "gli", "dei", "delle"];
const RE2 = new RegExp("(?:^|[^A-Za-zÀ-ÿ])(" + PRIMA.join("|") + ")[  ]+1(?![\\d,.])", "gi");
const trovati = [];
let pezzi = 0, caratteriTot = 0;
for (const [dove, t] of raccolto) {
  if (!t) continue;
  pezzi++; caratteriTot += t.length;
  /* ⚠️ E QUI IL RIGHELLO HA SBAGLIATO PRIMA DEL PRODOTTO, come sempre.
     Schiacciando anche gli A CAPO uscivano due allarmi falsi — «1 INCASSATE»
     e «1 RIGHE» — perché `innerText` mette a capo fra un elemento e l'altro:
     quel «1» è il contatore della pastiglia PRECEDENTE («con acconto 1»,
     «DDT scelti 1») e la parola al plurale è l'etichetta della successiva.
     Nessuno legge quella coppia come una frase. Si schiacciano solo gli spazi
     ORIZZONTALI: l'a capo è il confine fra due frasi, e buttarlo via fabbrica
     frasi che sullo schermo non esistono. */
  const piano = t.replace(/[^\S\n]+/g, " ");
  for (const m of piano.matchAll(RE)) {
    const i = Math.max(0, m.index - 50);
    trovati.push(`${dove}: «1 ${m[1]}» — …${piano.slice(i, m.index + 60)}…`);
  }
  for (const m of piano.matchAll(RE2)) {
    const i = Math.max(0, m.index - 40);
    trovati.push(`${dove}: «${m[1]} 1» — …${piano.slice(i, m.index + 70)}…`);
  }
}
dice(trovati.length === 0, `nessun «1 <plurale>» né «<plurale> 1» in ${pezzi} testi `
  + `(${caratteriTot} caratteri, ${PLURALI.length} parole dopo il numero, ${PRIMA.length} prima)`,
  trovati.slice(0, 8).join("\n        "));

await A.ctx.close();

// ══════════════════════════════════════════════════════════════════════════
// PARTE B · l'unico DDT NON è valorizzabile
// ⛔ «L'assenza di un dato non è un dato favorevole»: con una consegna sola e
//    quella non convertibile, tutti i totali dell'app valgono ZERO. Qui si
//    controlla che nessuno dei documenti che escono spacci quello zero per una
//    misura — cioè che la bandiera `calcolabile` del modulo la legga qualcuno.
// ══════════════════════════════════════════════════════════════════════════
console.log("\n· con l'unico DDT NON valorizzabile: chi legge la bandiera `calcolabile`");
VARIANTE = "B";
const B = await apri();
dice(B.errori.length === 0, "la variante non solleva errori", B.errori[0]);
if (await vai(B.pg, "pes")) {
  const t = await testoPagina(B.pg, "pes");
  schermate++; caratteri += t.length;
  dice(/quantità non calcolabile/.test(t), "la riga del DDT dice «quantità non calcolabile», non un numero",
    (t.match(/quantità non calcolabile/) || [])[0]);
  dice(/non è valorizzabile e non entra in questo totale/.test(t),
    "⛔ e il totale delle consegne DICHIARA di essere per difetto, invece di stare zitto a € 0,00",
    (t.match(/⚠[^.]{0,110}/) || [])[0]);
  // il foglio del DDT
  const el = await B.pg.$("[data-stampa-ddt]");
  if (!el) dice(false, "c'è un DDT da stampare", "assente");
  else {
    await el.click(); await B.pg.waitForTimeout(650);
    await B.pg.emulateMedia({ media: "print" }); await B.pg.waitForTimeout(200);
    const f = await B.pg.evaluate(() => document.getElementById("stampa").innerText);
    await B.pg.emulateMedia({ media: "screen" });
    fogli++;
    dice(/non calcolabile/.test(f), "⛔ sul foglio del DDT il valore è «non calcolabile», non « € 0,00»",
      (f.match(/Valore della consegna[^\n]{0,60}/) || [])[0]);
    dice(/non ha la densità/.test(f), "e il foglio scrive PERCHÉ non c'è",
      (f.match(/PERCHÉ IL VALORE NON C'È[\s\S]{0,140}/) || [])[0]);
    await B.pg.keyboard.press("Escape").catch(() => {}); await B.pg.waitForTimeout(200);
  }
  /* ⚠️ E LA PROVA CHE CONTA È SUL TESTO DEL FILE, non sul numero a schermo:
     una cella con dentro `0` e una cella VUOTA si leggono uguali in un
     riepilogo e diversissime in un foglio di calcolo. */
  await B.pg.evaluate(() => { window.__csv = []; });
  await B.pg.click("#btn-pes-export").catch(() => {});
  await B.pg.waitForTimeout(600);
  const csv = await B.pg.evaluate(() => (window.__csv || []).join("\n"));
  fileCsv++;
  const righe = csv.split("\n").filter(Boolean);
  const intest = (righe[0] || "").split(";");
  const dati = (righe[1] || "").split(";");
  celleCsv += intest.length + dati.length;
  const iVal = intest.indexOf("valore"), iQta = intest.indexOf("quantita");
  if (DIMMI) console.log(`\n[csv pesate · variante]\n${csv}`);
  dice(iVal >= 0 && iQta >= 0, `il CSV delle pesate ha le colonne «valore» e «quantita» (${intest.length} colonne)`, intest.join(";"));
  dice(iVal >= 0 && dati[iVal] === "", "⛔ nel CSV la cella «valore» resta VUOTA, non «0»", JSON.stringify(dati[iVal]));
  dice(iQta >= 0 && dati[iQta] === "", "⛔ e la cella «quantita» resta VUOTA, non «0»", JSON.stringify(dati[iQta]));
}
await B.ctx.close();

await b.close();
srv.close();

console.log(`\nsoggetti guardati: ${schermate} schermate (${caratteri} caratteri) · ${finestre} finestre · `
  + `${fogli} fogli di stampa · ${fileCsv} file CSV (${celleCsv} celle) · ${pezzi} testi setacciati`);

if (CONTROPROVA) {
  /* ⚠️ SI CONTA ANCHE QUANTI DIFETTI SONO STATI DAVVERO RIMESSI: una
     controprova che sostituisce zero stringhe «non fallisce» e non ha fatto
     niente — la trappola dello script che esce in silenzio. */
  const attesi = DIFETTI.length + DIFETTI_MODULO.length;
  console.log(`\ncontroprova: ${colpiti.size} difetti su ${attesi} rimessi  ·  ${mancate} iniezioni mancate  ·  ${ko} prove cadute su ${prove}`);
  if (colpiti.size < attesi) console.log("  ✗ alcune iniezioni non hanno trovato il loro testo: il banco non sta provando quello che crede.");
  process.exit(ko >= 12 && colpiti.size === attesi ? 0 : 1);
}

console.log(`\n${ok} ok, ${ko} KO  ·  ${prove} controlli`);
process.exit(ko > 0 ? 1 : 0);

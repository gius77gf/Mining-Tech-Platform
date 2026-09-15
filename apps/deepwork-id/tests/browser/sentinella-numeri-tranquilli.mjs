/* SENTINELLA: I NUMERI TRANQUILLI CHE ESCONO DALL'APP
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-numeri-tranquilli.mjs [--porta=8555]
     node sentinella-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. In Sentinella il principio del fondatore è NATO («senza dati»
   non è «conforme»), e il modulo lo applica in una dozzina di punti con le sue
   ragioni scritte accanto. Il 03/08, chiamando le funzioni coi casi limite e
   POI aprendo la pagina e premendo i bottoni, i difetti sono usciti tutti nel
   punto in cui quel lavoro ESCE dall'app — il file esportato e la frase sopra
   una lista — cioè dove nessuna suite `node` guardava:

   1. il FILE PER L'ARPA (`Esporta monitoraggi e adempimenti`) ciclava su `MON`
      invece che su `MON.map(conSoglia)`: la soglia del RICETTORE — quella
      scritta nell'autorizzazione per quella casa, che governa ogni schermata —
      non arrivava nel file. Sul dato di dimostrazione «Vibrazioni V2 — confine
      Nord» usciva `soglia 5 · Superamento` mentre lo schermo dice `soglia 20 ·
      Conforme`; e nel verso che conta (ricettore PIÙ severo del punto) il file
      diceva `Conforme` su un punto che l'app segna in rosso;
   2. lo stesso file scriveva la parola `undefined` nella colonna della soglia
      di un punto che non ne ha (ce n'è uno in `DEMO`, apposta);
   3. e scriveva `tra NaN gg` su un adempimento senza data leggibile — mentre
      la LISTA della stessa pagina, tre sezioni più su, era già stata corretta
      e scrive «Senza data»;
   4. il riepilogo sopra il registro volate sommava come ZERO le volate che non
      dichiarano i chili, e stampava `questo mese: 3 (120 kg)` mentre la riga di
      ognuna, tre centimetri sotto, scriveva già «kg non dichiarati»;
   5. la scheda «andamento per ricettore» chiudeva con `Superamenti: 0 → 0` su
      un punto SENZA SOGLIA — con la tabella accanto che scriveva «—» e il
      sottotitolo della stessa scheda che diceva «i superamenti non si possono
      contare». Tre affermazioni sulla stessa scheda, e a vincere è quella con
      la cifra in grassetto.

   1-4 hanno anche la loro prova in `run-kpi.mjs` (la regola è stata spostata
   in `csvAmbiente` e in `riepilogoVolate`); qui si prova che il file esce
   DAVVERO così dal bottone vero, e il 5 vive solo qui perché sta nella pagina.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, NON NEL DOCUMENTO: si aggiunge una riga
   in coda alla risposta HTTP di `sentinella-data.js`, cioè si passa dalla via
   vera (il modulo dati dell'app). Il file su disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8555;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, col pezzo di pagina che li porta.
   Si contano: un `replace` che non trova niente esce in silenzio, e una
   controprova che non sostituisce niente non prova niente. */
const DIFETTI_PAGINA = [
  // 1, 2, 3 · il file per l'ARPA scritto a mano nel gestore, com'era
  ["const csv = csvAmbiente(MON, ADE, RIC);",
   'let csv = "tipo;nome;valore;unita;soglia;stato;dettaglio\\n";\n'
   + '    for (const m of MON) { const st = statoMisura(m);\n'
   + '      const storico = (m.letture || []).map(l => l.data + ":" + l.valore).join(" ");\n'
   + '      csv += `monitoraggio;${csvCell(m.nome)};${m.valore};${csvCell(m.unita)};${m.soglia};${st.label};${csvCell(storico)}\\n`; }\n'
   + '    for (const a of ADE) { const g = giorni(a.scadenza);\n'
   + '      csv += `adempimento;${csvCell(a.titolo)};;;;${g < 0 ? "scaduto" : "tra " + g + " gg"};${csvCell((a.ente!=="—"?a.ente+" · ":"")+"entro "+a.scadenza)}\\n`; }'],
  // 5 · il verdetto dell'andamento che contava i superamenti senza soglia
  ['+ (p.soglia.valore == null\n            ? ". Senza soglia impostata i superamenti non si contano."\n            : `. Superamenti: <b>${pre.superamenti}</b> → <b>${cur.superamenti}</b>.`)',
   '+ `. Superamenti: <b>${pre.superamenti}</b> → <b>${cur.superamenti}</b>.`'],
];
/* 4 · i chili del mese vivono nel MODULO: il difetto si rimette lì, in coda,
   ridefinendo la funzione che la pagina ha già importato non si può — quindi
   si riscrive la riga della somma dentro `riepilogoVolate`. */
const DIFETTI_MODULO = [
  ["const conKg = questoMese.map(v => numeroDichiarato((v || {}).kgTotali)).filter(k => k != null);\n  const kgMese = conKg.length ? conKg.reduce((s, k) => s + k, 0) : null;",
   "const conKg = questoMese;\n  const kgMese = questoMese.reduce((s, v) => s + (+v.kgTotali || 0), 0);"],
];

/* I CASI, in coda al modulo dati. `DEMO` è un oggetto e la pagina ne fa una
   copia all'avvio, quindi aggiungere righe qui è come averle in archivio. */
const OGGI = new Date();
const YM = `${OGGI.getFullYear()}-${String(OGGI.getMonth() + 1).padStart(2, "0")}`;
const p2 = new Date(OGGI.getFullYear(), OGGI.getMonth() - 1, 15);
const YM_PRE = `${p2.getFullYear()}-${String(p2.getMonth() + 1).padStart(2, "0")}`;

/* IL PUNTO SENZA SOGLIA COLLEGATO A UN RICETTORE SENZA SOGLIA, con letture nel
   mese in corso E in quello prima: sono le due condizioni perché
   `confrontoMesi` risponda `confrontabile: true` e la frase del verdetto venga
   scritta. `rc4` (Cascina Ferrero) in `DEMO` è già il ricettore senza soglia. */
const FIXTURE_SENZA_SOGLIA =
  `\nDEMO.monitoraggi.push({ id: "sx1", nome: "Rumore — Cascina Ferrero", tipo: "rumore",`
  + ` unita: "dB(A)", valore: 57, ricettoreId: "rc4",`
  + ` nota: "posato dopo l'esposto, limite non ancora fissato",`
  + ` letture: [{ data: "${YM_PRE}-08", valore: 55 }, { data: "${YM_PRE}-19", valore: 58 },`
  + ` { data: "${YM_PRE}-27", valore: 56 }, { data: "${YM}-02", valore: 57 }] });\n`;

/* DUE VOLATE DEL MESE IN CORSO: una dichiara i chili, l'altra no (è quello che
   `parseVolateCsv` produce da una cella vuota, quindi il caso entra dalla via
   vera dell'import). */
const FIXTURE_VOLATE =
  `\nDEMO.volate.push({ id: "sxv1", data: "${YM}-01", fronte: "Fronte Sud", nFori: 30, kgTotali: 120,`
  + ` kgMaxRitardo: 14, distanzaRicettore: 300, esito: "regolare", stato: "eseguita" });\n`
  + `DEMO.volate.push({ id: "sxv2", data: "${YM}-02", fronte: "Fronte Sud", nFori: null, kgTotali: null,`
  + ` kgMaxRitardo: null, distanzaRicettore: null, esito: "regolare", stato: "eseguita" });\n`;

/* L'ADEMPIMENTO SENZA DATA. Attraverso i form della pagina non si crea (il
   form la pretende, e `parseAdempimentiCsv` scarta le righe senza data
   valida): è un record di archivio, e l'app lo sa già raccontare nella lista
   («Senza data», giallo). Serve qui per misurare che cosa ne scriveva il file. */
const FIXTURE_ADE = `\nDEMO.adempimenti.push({ id: "sxa1", titolo: "Analisi acque di dilavamento", ente: "ARPA", scadenza: "" });\n`;

const FIXTURE = FIXTURE_SENZA_SOGLIA + FIXTURE_VOLATE + FIXTURE_ADE;

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [a, b] of DIFETTI_MODULO) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_PAGINA) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro, e risponde «non so
   fallire» mentre inietta dove nessuno sta guardando. Si scrive un file nella
   radice servita e lo si rilegge DAL SERVER: se non torna, ci si ferma qui. */
const SEGNO = join(R, "__sentinella-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-numeri-${process.pid}`)).text();
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

/* Apre Sentinella e va in una sezione PRETENDENDO la prova di aver navigato:
   `vaiA` vuole l'id del BOTTONE, non il nome della sezione, e un banco che non
   naviga risponde «tutto a posto» dopo aver guardato una schermata su sei. */
async function apri(bottone) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
/* Il salvataggio del CSV è il modo con cui un documento esce dall'azienda:
   si intercetta il click sull'ancora invece di scaricare il file. */
async function intercetta(pg) {
  await pg.evaluate(() => {
    window.__csv = null;
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
}
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

console.log(`\n════════ Sentinella · i numeri tranquilli che escono dall'app${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1, 2, 3 · IL FILE CHE VA ALL'ARPA ─────────────────────────────────────
console.log("\n· il file «Esporta monitoraggi e adempimenti», premuto davvero");
{
  const pg = await apri("nav-reg");
  await intercetta(pg);
  await pg.click("#btn-export-amb");
  await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  const righe = csv.split("\n").filter(Boolean);
  dice(righe.length > 6, "il file viene prodotto davvero", righe.length + " righe");

  // 1 · la soglia del ricettore. V2 ha soglia 5 sul punto e rc2 (confine Nord)
  //     ne ha 20 in mm/s: quella che vale è 20, ed è quella che vede l'utente.
  const v2 = righe.find((r) => r.includes("confine Nord")) || "";
  const c2 = v2.split(";");
  dice(c2[4] === "20", "⛔ la soglia scritta nel file è quella del RICETTORE (20), non quella del punto (5)", v2);
  dice(c2[5] === "Conforme", "⛔ e lo stato è lo stesso che l'utente legge sullo schermo", v2);
  dice(/ricettore/.test(c2[7] || ""), "e il file dichiara DA DOVE viene quella soglia", c2[7]);

  // 2 · il punto senza soglia
  const pv1 = righe.find((r) => r.includes("piazzale nuovo")) || "";
  dice(!/undefined/.test(csv), "⛔ da nessuna parte nel file compare la parola «undefined»",
    (csv.match(/[^\n]*undefined[^\n]*/) || [])[0]);
  dice(pv1.split(";")[4] === "", "la cella della soglia di un punto che non ne ha resta VUOTA", pv1);
  dice(pv1.split(";")[5] === "Senza soglia", "e lo stato lo dice a parole", pv1);

  // 3 · l'adempimento senza data
  const ade = righe.find((r) => r.includes("Analisi acque di dilavamento")) || "";
  dice(!/NaN/.test(csv), "⛔ da nessuna parte nel file compare «NaN»",
    (csv.match(/[^\n]*NaN[^\n]*/) || [])[0]);
  dice(ade.split(";")[5] === "senza data",
    "⛔ un adempimento senza data leggibile esce «senza data», come nella lista", ade);
  // e la lista, che la regola ce l'aveva già: le due schermate devono dire lo stesso
  await pg.click("#nav-ade");
  await pg.waitForTimeout(500);
  const badge = await pg.$$eval("#ade-list .badge", (e) => e.map((x) => x.textContent.trim()));
  dice(badge.includes("Senza data"), "e la lista degli adempimenti diceva già «Senza data»", badge.join(" · "));
  await pg.close();
}

// ── 4 · I CHILI DEL MESE, SOPRA IL REGISTRO DELLE VOLATE ──────────────────
console.log("\n· il riepilogo sopra il registro volate, con una volata che non dichiara i chili");
{
  const pg = await apri("nav-reg");
  const riep = testo(await pg.$eval("#vol-riep", (e) => e.innerHTML));
  const righe = await pg.$$eval("#vol-list .item .meta, #vol-list .item .name", (e) => e.map((x) => x.textContent));
  const nonDichiarati = righe.filter((r) => /kg non dichiarati/.test(r)).length;
  dice(nonDichiarati > 0, "la lista dice già «kg non dichiarati» su chi non li ha", nonDichiarati + " righe");
  dice(!/\(120 kg\)/.test(riep),
    "⛔ il riepilogo NON stampa un totale secco su volate che i chili non li dichiarano", riep);
  dice(/almeno/.test(riep),
    "⛔ dice «almeno», cioè che quel numero è un pavimento", riep);
  dice(/non dichiara(no)? i chili/.test(riep),
    "e dice su quante volate il totale non è fatto", riep);
  /* la comunicazione della volata (05/09): la voce del diario è scritta su
     OGNI volata eseguita — quando c'è, e quando manca — mai un silenzio */
  const meta = await pg.$$eval("#vol-list .item", (e) => e.map((x) => ({
    /* la prevista si riconosce dal badge di stato «Prevista», che non è per
       forza il primo badge della riga («da confermare» viene prima) */
    prevista: [...x.querySelectorAll(".badge")].some((b) => /^\s*Prevista\s*$/.test(b.textContent)),
    testo: x.textContent.replace(/\s+/g, " ") })));
  const eseguite = meta.filter((m) => !m.prevista);
  dice(eseguite.length > 0 && eseguite.every((m) => /comunicata all'ente|nessuna comunicazione registrata|comunicazione registrata a metà/.test(m.testo)),
    "⛔ ogni volata eseguita dice se è stata comunicata, e quando manca lo dice con le parole", eseguite.map((m) => m.testo.slice(0, 80)));
  dice(eseguite.some((m) => /comunicata all'ente il 16\/07\/2026 \(PEC prot\. 4412\/2026\)/.test(m.testo)) && eseguite.some((m) => /nessuna comunicazione registrata/.test(m.testo)),
    "e la dimostrazione mostra tutt'e due i casi: una comunicata, le altre no", eseguite.length + " eseguite");
  await pg.close();
}

// ── 5 · IL VERDETTO DELL'ANDAMENTO SU UN PUNTO SENZA SOGLIA ───────────────
console.log("\n· l'andamento per ricettore, su un punto senza nessuna soglia");
{
  const pg = await apri("nav-prog");
  // `rc4` è il ricettore senza soglia della dimostrazione (Cascina Ferrero):
  // si sceglie per VALORE, non per etichetta, e poi si pretende la prova che la
  // tendina sia davvero cambiata — una `selectOption` che non trova la voce
  // lascia la prima selezionata e il banco misurerebbe un'altra scheda.
  await pg.selectOption("#and-ric", "rc4").catch(() => {});
  await pg.waitForTimeout(700);
  const scelto = await pg.$eval("#and-ric", (e) => e.options[e.selectedIndex].textContent);
  dice(/Cascina Ferrero/.test(scelto), "scelto il ricettore senza soglia", scelto);
  const card = testo(await pg.$eval("#and-out", (e) => e.innerHTML));
  dice(/non si possono contare/.test(card),
    "il sottotitolo dice già che i superamenti non si contano", card.slice(0, 200));
  dice(/Rispetto a/.test(card), "e il confronto fra i due mesi è stato scritto (serve per vedere il difetto)",
    card.slice(0, 400));
  dice(!/Superamenti: 0 → 0/.test(card),
    "⛔ il verdetto NON chiude con «Superamenti: 0 → 0» su un punto senza soglia",
    (card.match(/Rispetto a[^.]*\.[^.]*\./) || [])[0]);
  dice(/Senza soglia impostata i superamenti non si contano/.test(card),
    "⛔ al suo posto dice che non si contano", (card.match(/Rispetto a[^.]*\.[^.]*\./) || [])[0]);
  // e la tabella accanto, che la guardia ce l'aveva già: le due devono dire lo stesso
  const celle = await pg.$$eval("#and-out table.tab tbody tr", (t) => t.map((r) => [...r.cells].map((c) => c.textContent.trim())));
  dice(celle.length > 0 && celle.every((r) => r[4] === "—"),
    "la colonna «Superamenti» della tabella diceva già «—»", JSON.stringify(celle));
  /* Lo scatto: due nomi diversi, se no la controprova cancella la foto del
     «dopo» con quella del «prima» e resta una sola immagine da guardare.
     Si scatta solo se `--scatti=<cartella>` lo chiede: un banco non scrive
     file dove capita. */
  const CART = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1];
  if (CART) {
    await pg.screenshot({ path: join(CART, CONTROPROVA ? "andamento-PRIMA.png" : "andamento-DOPO.png"),
      fullPage: true }).catch(() => {});
    // e la sola scheda, che è la cosa da GUARDARE: in una pagina lunga la
    // frase da leggere sta in fondo e non si vede nella miniatura
    await pg.$eval("#and-out", (e) => e.scrollIntoView()).catch(() => {});
    await pg.waitForTimeout(200);
    await pg.locator("#and-out .and-card").first()
      .screenshot({ path: join(CART, CONTROPROVA ? "scheda-PRIMA.png" : "scheda-DOPO.png") }).catch(() => {});
  }
  await pg.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  const attesi = DIFETTI_PAGINA.length + DIFETTI_MODULO.length;
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${attesi}`);
  if (colpiti.size !== attesi) {
    console.error("✗ un difetto non ha trovato il suo pezzo di pagina: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

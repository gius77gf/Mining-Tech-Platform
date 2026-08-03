/* I DOCUMENTI DI TERRA NON DICHIARANO ZERI CHE NESSUNO HA MISURATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-numeri-tranquilli.mjs [--porta=8491]
     node terra-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Terra dice quanti metri cubi sono stati cavati: è il numero
   che consuma la concessione e che finisce nella denuncia annuale. Il 03/08,
   chiamando le funzioni coi casi veri e poi APRENDO la pagina, sono venuti
   fuori tre zeri tranquilli — e tutti e tre in cose che escono dall'azienda:

   1. il PROSPETTO ANNUALE per l'ente, su un anno senza nessun rilievo, scriveva
      «Totale 2026: 0» in grassetto e, in fondo, «risultano registrati in Terra:
      nessun rilievo, QUINDI volumi a zero per tutto l'anno» — cioè l'inferenza
      vietata, per esteso, tre centimetri sotto il paragrafo dello stesso foglio
      che dice «per l'ente “zero misurato” e “non misurato” non sono la stessa
      cosa»;
   2. il CSV dello stesso riepilogo scriveva `totale;Anno 2026;0;0;0` mentre sei
      righe più giù `banco;banco 1;;0;0` lasciava la cella VUOTA con la ragione
      scritta: due convenzioni opposte nello stesso file, e chi lo apre in un
      foglio somma lo zero del totale credendolo misurato;
   3. il VERBALE DI RILIEVO, su un rilievo di archivio segnato «elaborato» col
      volume illeggibile, stampava «Volume misurato — m³ (± 0 m³ · fra 0 e 0
      m³)»: incertezza zero su un numero che non si legge. Il bottone del
      verbale nasceva da una copia più debole di `rilievoUsabile`
      (`r.volumeM3 != null`, che accetta `""` e `"abc"`).
   Più uno che non va a un ente ma sono soldi: il riquadro del valore, col campo
   della densità svuotato, scriveva «79.400 m³ → 0 t → € 0 di materiale» mentre
   la nota tre righe sopra diceva «il valore del materiale non si calcola».

   ⚠️ NESSUNO DI QUESTI SI VEDE LEGGENDO IL CODICE, e nessuno lo prende una
   suite `node`: le prove su `bandaVolume` e `valoreMateriale` blindano il
   modulo, ma la frase del foglio, la cella del CSV e la condizione del bottone
   vivono nella PAGINA. Questo banco preme i bottoni veri e legge i documenti
   che escono.

   ⚠️ I DUE CASI SI COSTRUISCONO NEI DATI, NON NEL DOCUMENTO. L'anno cieco e il
   rilievo col volume illeggibile si ottengono aggiungendo una riga alla
   risposta HTTP di `terra-data.js` — cioè passando dalla via vera (il modulo
   dati dell'app), mai fingendo il foglio. Il file su disco non si tocca. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8491;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, con il pezzo di pagina che li porta.
   Contati: una controprova che non sostituisce niente non prova niente. */
const DIFETTI = [
  // 1 · la frase del foglio che va all'ente
  ['? "nessun rilievo — il volume dell\'anno non l\'ha misurato nessuno, e gli zeri della tabella dei mesi sono il modo in cui il modulo va compilato, non una misura"',
   '? "nessun rilievo, quindi volumi a zero per tutto l\'anno"'],
  // 1b · la riga del totale sul foglio
  ['+ (DEN.base && DEN.base.calcolabile ? n0(R.scavo) : "non misurato") + "</td><td class=\'n\'>"',
   '+ n0(R.scavo) + "</td><td class=\'n\'>"'],
  // 2 · la cella del totale nel CSV
  ['${DEN.base && DEN.base.calcolabile ? R.scavo : ""};${R.cumulo}', '${R.scavo};${R.cumulo}'],
  // 3 · la condizione più debole che apriva il bottone del verbale
  ['const usabile = rilievoUsabile(r);', 'const usabile = r.stato === "elaborato" && r.volumeM3 != null;'],
  // 4 · i due zeri del riquadro del valore
  ['const dens = rd.ok ? rd.valore : null, prezzo = rp.ok ? rp.valore : null;',
   'const dens = rd.ok ? rd.valore : 0, prezzo = rp.ok ? rp.valore : 0;'],
  // 5 · la frase dei turni che scriveva «circa 0 m³»
  ['const nonConvertibile = !nulla && !(d.m3 > 0);', 'const nonConvertibile = false;'],
  // 5b · la ripartizione per fronte che leggeva i m³ per decidere chi esiste
  ['const daTurni = (x) => (x.turni || 0) > 0;', 'const daTurni = (x) => (x.m3 || 0) > 0;'],
  ['const volume = (x) => x.m3 > 0', 'const volume = (x) => true'],
];

/* IL CASO DA COSTRUIRE, scelto prima di ogni `goto`. Si aggiunge in coda al
   modulo dati: `DEMO` è un oggetto, e la pagina ne fa una copia all'avvio. */
let FIXTURE = "";
const FIXTURE_VUOTO = "\nDEMO.rilievi.length = 0;\n";
const FIXTURE_ILLEGGIBILE = '\nDEMO.rilievi.unshift({ id: "vecchio", titolo: "Rilievo di archivio",'
  + ' data: "2026-03-12", tipo: "Ortofoto + DEM", volumeM3: "", fronteId: "f1", stato: "elaborato",'
  + ' metodo: "RTK", gsd: 2, provenienza: "scavo" });\n';

let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/terra/terra-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/terra/index.html")) {
    let t = corpo.toString("utf8");
    /* ⚠️ SI CONTANO I DIFETTI RIMESSI, non le sostituzioni: la pagina viene
       caricata tre volte e un conto crescente direbbe «15 su 5», che sembra un
       errore. Quello che serve sapere è se OGNI difetto ha trovato il suo
       pezzo di pagina — un `replace` che non trova niente esce in silenzio. */
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

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro, e risponde «non so
   fallire» mentre inietta in una cartella che nessuno sta guardando. Si scrive
   un file nella radice servita e lo si rilegge DAL SERVER: se non torna, ci si
   ferma qui. */
const SEGNO = join(R, "__terra-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__terra-numeri-${process.pid}`)).text();
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
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 260))}` : ""}`); }
};

/* Apre Terra e va in una sezione, PRETENDENDO la prova di aver navigato: un
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
/* Intercetta la finestra della stampa e il salvataggio del CSV: sono i due
   modi con cui un documento esce dall'azienda. */
async function intercetta(pg) {
  await pg.evaluate(() => {
    window.__doc = null; window.__csv = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close: () => {} },
      focus: () => {}, print: () => {} });
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
}
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

console.log(`\n════════ i documenti di Terra e gli zeri mai misurati${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 e 2 · L'ANNO CHE NESSUNO HA MISURATO ────────────────────────────────
console.log("\n· un anno senza nessun rilievo: il prospetto e il CSV per l'ente");
FIXTURE = FIXTURE_VUOTO;
{
  const pg = await apri("nav-den");
  await intercetta(pg);
  await pg.click("#btn-den-stampa");
  await pg.waitForTimeout(400);
  const foglio = testo(await pg.evaluate(() => window.__doc));
  dice(foglio.length > 800, "il prospetto viene prodotto davvero", foglio.length);
  const tot = (foglio.match(/Totale 2026[^A-Za-z]*([^\s]+)/) || [])[1];
  dice(/Totale 2026\s+non misurato/.test(foglio),
    "⛔ il totale dell'anno dice «non misurato», non «0»", "Totale 2026 → " + tot);
  dice(!/quindi volumi a zero/.test(foglio),
    "⛔ e non c'è nessun «quindi volumi a zero per tutto l'anno»",
    (foglio.match(/registrati in Terra:[^.]*\./) || [])[0]);
  dice(/non l'ha misurato nessuno/.test(foglio),
    "e al suo posto c'è scritto che non ha misurato nessuno",
    (foglio.match(/registrati in Terra:[^.]*\./) || [])[0]);

  await pg.click("#btn-den-csv");
  await pg.waitForTimeout(300);
  const csv = await pg.evaluate(() => window.__csv);
  const rigaTot = String(csv || "").split("\n").find((r) => r.startsWith("totale;")) || "";
  const rigaBanco = String(csv || "").split("\n").find((r) => r.startsWith("banco;")) || "";
  dice(/^totale;[^;]*;;/.test(rigaTot),
    "⛔ nel CSV la cella dello scavo dell'anno resta VUOTA, non «0»", rigaTot);
  dice(/^banco;[^;]*;;/.test(rigaBanco),
    "e la cella del banco mai rilevato faceva già così (la regola era in casa)", rigaBanco);
  await pg.close();
}

// ── 3 · IL RILIEVO IL CUI VOLUME NON SI LEGGE ─────────────────────────────
console.log("\n· un rilievo «elaborato» col volume illeggibile: elenco e verbale");
FIXTURE = FIXTURE_ILLEGGIBILE;
{
  const pg = await apri("nav-ril");
  const r = await pg.evaluate(() => {
    const it = [...document.querySelectorAll("#ril-list .item")]
      .find((e) => /Rilievo di archivio/.test(e.innerText));
    if (!it) return null;
    const m = it.querySelector(".meta");
    if (!m) return null;
    /* ⚠️ LA DOMANDA NON È «LA RIGA È TAGLIATA?» MA «LA DICHIARAZIONE SI LEGGE?».
       La riga di dettaglio ha `-webkit-line-clamp:2`, e a 430 px questa è
       davvero tagliata — quello che cade è «· RTK · GSD 2 cm». Misurarla come
       «tagliata sì/no» faceva cadere il banco su un caso sano: la frase che
       conta sta all'inizio. Dove finisce sullo schermo lo sa dire il browser
       con un `Range`, e non si calcola a mano dividendo per il corpo del
       carattere. */
    const box = m.getBoundingClientRect();
    const nodo = [...m.childNodes].find((n) => n.nodeType === 3 && n.textContent.includes("non leggibile"));
    let fine = null;
    if (nodo) {
      const i = nodo.textContent.indexOf("volume non leggibile");
      const rg = document.createRange();
      rg.setStart(nodo, i); rg.setEnd(nodo, i + "volume non leggibile".length);
      fine = rg.getBoundingClientRect().bottom - box.top;
    }
    return { meta: m.innerText, verbale: !!it.querySelector("[data-verb-ril]"),
      tagliata: m.scrollHeight > m.clientHeight + 1,
      fineDichiarazione: fine, altezzaVisibile: box.height,
      dichiarazioneVisibile: fine != null && fine <= box.height + 1 };
  });
  dice(!!r, "il rilievo di archivio è in elenco", r);
  dice(!!r && r.verbale === false,
    "⛔ NON ha il bottone del verbale: un volume che non si legge non fa un documento", r && r.meta);
  dice(!!r && /volume non leggibile/.test(r.meta),
    "⛔ e la riga lo DICHIARA invece di tacere", r && r.meta);
  dice(!!r && r.dichiarazioneVisibile === true,
    "e la dichiarazione NON finisce nel testo tagliato a due righe"
    + (r ? ` (finisce a ${Math.round(r.fineDichiarazione)} px su ${Math.round(r.altezzaVisibile)} visibili`
        + `${r.tagliata ? ", la riga è tagliata più in là" : ", riga intera"})` : ""),
    r && r.meta);
  // i rilievi sani continuano ad avere il loro verbale: la correzione non deve
  // portarsi via la funzione
  const sani = await pg.$$eval("[data-verb-ril]", (e) => e.length);
  dice(sani >= 5, `i rilievi con un volume vero hanno ancora il verbale (${sani})`, sani);
  await pg.close();
}

// ── 4 · IL VALORE DEL MATERIALE SENZA DENSITÀ ─────────────────────────────
console.log("\n· il riquadro del valore col campo della densità svuotato");
FIXTURE = "";
{
  const pg = await apri("nav-ril");
  const pieno = await pg.$eval("#val-out", (e) => e.innerText);
  dice(/€/.test(pieno) && !/€\s*0\b/.test(pieno), "col dato completo il valore si calcola", pieno);
  await pg.fill("#val-densita", "");
  await pg.waitForTimeout(400);
  const vuoto = await pg.$eval("#val-out", (e) => e.innerText);
  dice(!/€\s*0\b/.test(vuoto) && !/\b0 t\b/.test(vuoto),
    "⛔ senza densità NON esce «0 t → € 0»", vuoto);
  dice(/non si calcola/.test(vuoto), "e il riquadro dice perché", vuoto);
  const nota = await pg.$eval("#val-dens-nota", (e) => e.innerText).catch(() => "");
  dice(/non si calcola/.test(nota), "in accordo con la nota sotto il campo (che lo diceva già)", nota);

  // ── 5 · IL PONTE COI TURNI DI CAMPO, SULLA STESSA DENSITÀ MANCANTE ──────
  /* Senza densità le tonnellate dei turni non si portano in metri cubi: il
     ponte lascia `m3` a zero e conta le tonnellate in `tSenzaDensita`. La
     tessera lo sapeva già (`—`); la frase sotto scriveva «i turni hanno
     dichiarato circa 0 m³», e la ripartizione per fronte «0 m³» per riga più
     un «Tutti i turni hanno indicato il fronte» che con la densità impostata
     la stessa schermata smentiva. */
  console.log("\n· il ponte coi turni di Campo, con la stessa densità mancante");
  await pg.$eval("#tur-out", (e) => e.scrollIntoView({ block: "center" })).catch(() => {});
  await pg.waitForTimeout(1500);
  const turni = await pg.$eval("#tur-out", (e) => e.innerText).catch(() => "");
  dice(turni.length > 200, "il riquadro dei turni è stato disegnato", turni.length);
  dice(!/circa\s*0\s*m³/.test(turni), "⛔ niente «i turni hanno dichiarato circa 0 m³»",
    (turni.match(/[^.]*circa[^.]*\./) || [])[0]);
  dice(!/\b0 m³/.test(turni), "⛔ e nessuna riga di fronte con «0 m³»",
    (turni.match(/[^\n]*0 m³[^\n]*/) || [])[0]);
  dice(!/Tutti i turni hanno indicato il fronte/.test(turni),
    "⛔ e nessun «Tutti i turni hanno indicato il fronte» sui turni che il fronte non l'hanno",
    turni);
  dice(/non si può portare in metri cubi|non si converte in metri cubi|non convertibile/i.test(turni),
    "e la non-convertibilità è scritta", turni);
  await pg.close();
}

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} difetti su ${DIFETTI.length} rimessi nella risposta HTTP`);
  if (iniezioni < DIFETTI.length) {
    console.log("⚠️ QUALCHE DIFETTO NON È STATO RIMESSO: la controprova non prova quello che dice");
    process.exit(3);
  }
  console.log(ko >= 10 ? "✓ il banco SA fallire: rimessi i difetti cadono le prove giuste"
                      : `⚠️ troppo poche cadute (${ko})`);
  process.exit(ko >= 10 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

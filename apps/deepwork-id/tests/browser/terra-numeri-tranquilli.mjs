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

   ── seconda tornata, 03/08: il documento che nessuno apriva ──────────────
   Il 03/08 la stessa domanda è stata rifatta su TUTTI i documenti di Terra
   invece che sui due del riepilogo, e ne è saltato fuori uno che nessun banco
   aveva mai premuto: `btn-terra-export`, il CSV dell'archivio (fronti e
   rilievi). Prova che non c'era: `grep -rn "btn-terra-export"
   apps/deepwork-id/tests/` → nessuna riga. Portava quattro difetti in due
   righe di codice, tutti trovati aprendo il file e mettendolo accanto allo
   schermo sugli stessi dati:
   5. `r.volumeM3 != null` — un'altra copia più debole di `rilievoUsabile`, e
      stavolta nel FILE invece che sullo schermo: «20/03 · circa 8000 m³» e
      «12/03 ·  m³» dove la riga a schermo dice «volume non leggibile». Il
      documento che esce dichiarava una misura che l'app rifiuta di leggere.
      (Cercandola per bene ne è saltata fuori una gemella nel MODULO,
      `anniConVolumi`: corretta lo stesso giorno, provata in `run-kpi.mjs`.);
   6. e non guardava lo STATO: un rilievo ancora **pianificato** con una stima
      nel campo usciva «10/09 · 9999 m³», indistinguibile da una misura fatta;
   7. la DATA era `giornoMese`, senza anno — su un file che contiene l'archivio
      intero, dove convivono 2024, 2025 e 2026;
   8. la QUOTA usciva grezza («quota 148.5m», col punto) e spariva del tutto
      quando non c'era, mentre lo schermo scrive «Quota 148,5 m» e «quota non
      dichiarata». Lo stesso difetto stava sul VERBALE, tre righe sopra un GSD
      scritto all'italiana con la ragione già annotata accanto.
   Più due nel CSV della denuncia, un piano sotto quello corretto il 03/08: i
   tre SECCHI (banco non dichiarato, fronti fuori elenco, rilievi senza fronte)
   non portavano la bandiera `misurabile` che le RIGHE avevano già, e il
   secchio «fronti non più in elenco» nel file non c'era affatto — la colonna
   dei banchi non tornava col totale dell'anno, e il file non diceva perché.

   ── terza tornata, 02/09: la passata in profondità ──────────────────────
   Stessa domanda su tutto quello che esce e su ciò che si colora, con gli
   scatti guardati a 430 px. Quattro cose, tutte trovate premendo o guardando:
   9. il foglio per l'ente scriveva «Incertezza complessiva ± 388 m³, ottenuta
      sommando la tolleranza di OGNI rilievo (stima prudente)» — e sulla
      dimostrazione quel ± copriva UN rilievo su quattro (19.400 m³ su 79.400):
      chi non dichiara il metodo non ha tolleranza e pesava ZERO. Adesso il
      modulo dichiara la copertura (`incertezzaScavo`) e la frase la scrive
      `descriviIncertezza`, letta da foglio, confronto e verbale;
  10. sul Quadro la scadenza «senza data» aveva la striscia VERDE e la spunta
      «a posto» accanto al badge arancione: una copia più debole di `lv.cls`,
      a tre stati su quattro;
  11. il CSV dei rilievi — «nel formato che questa pagina sa ri-caricare» —
      usciva con la colonna «fronte» VUOTA su tutte le righe (`r.fronte` dove
      il rilievo porta `fronteId`): ri-caricato, la ripartizione per fronte
      della denuncia spariva;
  12. nella scheda dei lotti «previsti … · misurati …» finiva nei puntini del
      `.meta` a due righe, su tre lotti su sei: il misurato è il numero per
      cui l'elenco esiste, e sta ora nella riga larga sotto.

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
  /* ── 6 · IL CSV «FRONTI E RILIEVI», che nessun banco premeva (03/08) ──────
     Quattro difetti in due righe di codice, tutti trovati aprendo il file e
     mettendolo accanto allo schermo sugli stessi dati. */
  // 6a · la quinta copia più debole di `rilievoUsabile`, e stavolta nel file
  ['(rilievoUsabile(r) ? " · " + nD(r.volumeM3) + " m³"\n              : r.stato === "elaborato" ? " · volume non leggibile" : "")',
   '(r.volumeM3 != null ? " · " + r.volumeM3 + " m³" : "")'],
  // 6b · la data senza anno su un file che contiene l'archivio intero
  ['csvCell(dataIt(r.data)', 'csvCell(giornoMese(r.data)'],
  // 6c · la quota grezza, col punto, e muta quando non c'è
  ['f.quota == null || f.quota === "" ? "quota non dichiarata" : "quota " + nD(f.quota) + " m",',
   'f.quota == null || f.quota === "" ? "" : "quota " + f.quota + "m",'],
  // 6d · la quota grezza sul VERBALE, accanto a un GSD scritto all'italiana
  ['+ (f.quota == null || f.quota === "" ? " · quota non dichiarata" : " · quota " + esc(nD(f.quota)) + " m")',
   '+ (f.quota != null ? " · quota " + esc(String(f.quota)) + " m" : "")'],
  // ── 7 · i secchi del CSV della denuncia ────────────────────────────────
  ['${s.misurabile ? s.scavo : ""};${s.cumulo}', '${s.scavo};${s.cumulo}'],
  ['      ["Fronti non più in elenco", DEN.banchi.fuoriElenco],\n', ''],
  /* ── 8 · LA PASSATA DEL 02/09 ─────────────────────────────────────────── */
  // 8a · la scadenza «senza data» disegnata verde con la spunta
  ['const cls = "st-" + lv.cls;', 'const cls = st === "scaduta" ? "st-danger" : st === "in-scadenza" ? "st-warn" : "st-ok";'],
  ['const ico = lv.cls === "danger" ? ["danger", I.allarme] : lv.cls === "warn" ? ["warn", I.sveglia] : ["ok", I.ok];',
   'const ico = st === "scaduta" ? ["danger", I.allarme] : st === "in-scadenza" ? ["warn", I.sveglia] : ["ok", I.ok];'],
  // 8b · l'incertezza «di ogni rilievo (stima prudente)» che copriva un rilievo su quattro
  ['+ (descriviIncertezza(R.incertezza) ? " " + esc(descriviIncertezza(R.incertezza)) : "")',
   '+ (R.banda > 0 ? " Incertezza complessiva stimata sullo scavo: ± " + n0(R.banda) + " m³, ottenuta sommando la tolleranza tipica del metodo di ogni rilievo (stima prudente)." : "")'],
  // 8c · il CSV dei rilievi senza i fronti: colonna «fronte» vuota su tutte le righe
  ['encodeURIComponent(csvRilievi(RIL, FRO))', 'encodeURIComponent(csvRilievi(RIL))'],
  // 8d · i due volumi del lotto tornano nel `.meta` tagliato a due righe
  ['    const perche = [\n      volumi,\n', '    const perche = [\n'],
];

/* IL CASO DA COSTRUIRE, scelto prima di ogni `goto`. Si aggiunge in coda al
   modulo dati: `DEMO` è un oggetto, e la pagina ne fa una copia all'avvio. */
let FIXTURE = "";
const FIXTURE_VUOTO = "\nDEMO.rilievi.length = 0;\n";
const FIXTURE_ILLEGGIBILE = '\nDEMO.rilievi.unshift({ id: "vecchio", titolo: "Rilievo di archivio",'
  + ' data: "2026-03-12", tipo: "Ortofoto + DEM", volumeM3: "", fronteId: "f1", stato: "elaborato",'
  + ' metodo: "RTK", gsd: 2, provenienza: "scavo" });\n';
/* IL CASO DEI DOCUMENTI CHE ESCONO. Cinque cose che nella dimostrazione non ci
   sono e che in una cava vera capitano tutte: un volume che non si legge, una
   stima scritta su un rilievo ancora PIANIFICATO, un fronte che non dichiara né
   banco né quota, un rilievo su un fronte poi cancellato, e una quota con la
   virgola. Ognuna fa dire al file qualcosa che lo schermo non dice. */
const FIXTURE_DOCUMENTI = FIXTURE_ILLEGGIBILE
  + '\nDEMO.rilievi.unshift({ id: "stima", titolo: "Volata prevista con stima", data: "2026-09-10",'
  + ' tipo: "Drone pianificato", volumeM3: 9999, fronteId: "f1", stato: "pianificato", provenienza: "scavo" });'
  + '\nDEMO.rilievi.push({ id: "cancellato", titolo: "Rilievo su fronte cancellato", data: "2026-04-10",'
  + ' tipo: "Ortofoto + DEM", volumeM3: 7000, fronteId: "fZZ", stato: "elaborato", metodo: "RTK", gsd: 2, provenienza: "scavo" });'
  + '\nDEMO.fronti.push({ id: "f4", nome: "Fronte Ovest", banco: "", quota: null, stato: "attivo" });'
  + '\nDEMO.fronti[0].quota = 148.5;\n';

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

// ── 6 · IL CSV «FRONTI E RILIEVI», IL VERBALE E I SECCHI DELLA DENUNCIA ────
/* ⛔ IL BANCO NON PREMEVA QUESTO BOTTONE, e il difetto stava lì da sempre.
   `grep -n "btn-terra-export" apps/deepwork-id/tests/` non dava niente: il
   riepilogo per l'ente era guardato, il file dell'archivio no — e non perché
   qualcuno avesse deciso che contava meno, ma perché nessuno l'aveva aperto.
   La domanda che li trova è sempre la stessa: *dove l'app compone qualcosa che
   ESCE, chi decide i suoi numeri?* Qui la risposta era «una copia più debole»
   quattro volte su quattro. */
console.log("\n· il CSV dell'archivio e il verbale, sugli stessi dati dello schermo");
FIXTURE = FIXTURE_DOCUMENTI;
{
  const pg = await apri("nav-pia");
  await intercetta(pg);
  await pg.click("#btn-terra-export");
  await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  const righe = csv.split("\n").filter(Boolean);
  dice(righe.length > 8, "il file viene prodotto davvero", righe.length);
  /* nessuna riga può spacciare per misura un volume che l'app non sa leggere */
  const archivio = righe.find((r) => /Rilievo di archivio/.test(r)) || "";
  dice(/volume non leggibile/.test(archivio),
    "⛔ il volume illeggibile è DICHIARATO, come nell'elenco a schermo", archivio);
  dice(!/·\s+m³/.test(csv), "⛔ e non esce nessun «·  m³» con il buco al posto del numero",
    (csv.match(/[^\n]*·\s+m³[^\n]*/) || [])[0]);
  /* un rilievo ancora pianificato non porta un volume: a schermo non ce l'ha */
  const stima = righe.find((r) => /Volata prevista con stima/.test(r)) || "";
  dice(/;pianificato;/.test(stima) && !/m³/.test(stima),
    "⛔ la stima su un rilievo PIANIFICATO non esce come una misura fatta", stima);
  /* l'archivio contiene più anni: senza l'anno le date non si leggono */
  dice(righe.filter((r) => r.startsWith("rilievo;")).every((r) => /\d{2}\/\d{2}\/\d{4}/.test(r)),
    "⛔ ogni rilievo porta la data INTERA, anno compreso",
    righe.filter((r) => r.startsWith("rilievo;") && !/\d{4}/.test(r))[0]);
  dice(/12\/09\/2024/.test(csv) && /20\/11\/2025/.test(csv),
    "e i due rilievi degli anni prima si distinguono da quelli di quest'anno",
    (csv.match(/[^\n]*12\/09[^\n]*/) || [])[0]);
  /* la quota: all'italiana come sullo schermo, e dichiarata quando non c'è */
  const nord = righe.find((r) => /Fronte Nord/.test(r)) || "";
  dice(/quota 148,5 m/.test(nord), "⛔ la quota si scrive all'italiana, come nell'elenco", nord);
  const ovest = righe.find((r) => /Fronte Ovest/.test(r)) || "";
  dice(/quota non dichiarata/.test(ovest),
    "⛔ e un fronte senza quota lo DICHIARA invece di tacere", ovest);
  dice(!/;\s*$/.test(ovest) && !/Ovest\s;/.test(ovest),
    "il nome non si porta dietro uno spazio in coda (un confronto in un foglio fallirebbe)",
    JSON.stringify(ovest));
  /* ⚠️ E QUESTA RIGA È ONESTA SU QUELLO CHE NON DIMOSTRA: la colonna del
     dettaglio adesso passa da `csvCell` come tutte le altre, ma con la
     controprova NON cade. Non è una prova scritta male: è che il difetto non
     si raggiunge. `parseFrontiCsv` la quota la fa passare da `numIt` e tiene
     solo i finiti (`Number.isFinite(q) ? q : null`), il form da `numCampo`, e
     `avFronte` da `nD`: nel dettaglio non ci può finire un `;`. `csvCell` lì è
     la convenzione di casa, non una riparazione — e va detto, se no domani
     qualcuno legge questa riga come la prova di un difetto che c'era. */
  const colonne = righe.map((r) => { let q = false, n = 1;
    for (const c of r) { if (c === '"') q = !q; else if (c === ";" && !q) n++; } return n; });
  dice(colonne.every((n) => n === 5),
    `cinque colonne su tutte e ${righe.length} le righe (invariante, non un difetto corretto)`, colonne);

  // il VERBALE: la quota accanto al GSD, che l'italiana la scriveva già
  await pg.click("#nav-ril").catch(() => {});
  await pg.waitForTimeout(600);
  await pg.evaluate(() => { window.__doc = null; });
  const id1 = await pg.evaluate(() => {
    const b = [...document.querySelectorAll("[data-verb-ril]")]
      .find((x) => /15\/07/.test(x.closest(".item").innerText));
    if (b) b.click(); return !!b;
  });
  dice(id1, "il rilievo del fronte con la quota decimale ha il suo verbale");
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const b = [...document.querySelectorAll("button")]
    .find((x) => /Prepara il verbale/i.test(x.textContent)); if (b) b.click(); });
  await pg.waitForTimeout(500);
  const verb = testo(await pg.evaluate(() => window.__doc));
  dice(verb.length > 800, "il verbale viene prodotto", verb.length);
  dice(/quota 148,5 m/.test(verb),
    "⛔ sul verbale la quota è all'italiana come il GSD sei righe sotto, non «148.5»",
    (verb.match(/Fronte[^|]{0,80}/) || [])[0]);
  dice(!/quota 148\.5/.test(verb), "e il punto non compare da nessuna parte", verb.slice(0, 400));
  await pg.close();
}

// ── 8 · LA PASSATA DEL 02/09: quattro cose viste premendo e guardando ──────
/* Tutte sulla dimostrazione com'è, tranne l'incertezza, che vuole dati fermi:
   con un fixture i numeri attesi non invecchiano quando la dimostrazione
   cresce (è il banco col numero atteso dentro, censito il 07/08). */
console.log("\n· il Quadro: una scadenza senza data non è una scadenza a posto");
FIXTURE = "";
{
  const pg = await apri("nav-dash");
  const righe = await pg.$$eval("#dash-scad .item", (els) => els.map((it) => ({
    badge: (it.querySelector(".badge") || {}).innerText || "",
    striscia: [...it.classList].filter((c) => c.startsWith("st-")).join(" "),
    icona: [...(it.querySelector(".avatar") || { classList: [] }).classList].filter((c) => ["ok", "warn", "danger"].includes(c)).join(" "),
  })));
  const senza = righe.find((r) => /senza data/i.test(r.badge));
  dice(!!senza, "la dimostrazione ha una scadenza senza data sul Quadro", righe.map((r) => r.badge).join(" | "));
  dice(!!senza && senza.striscia === "st-warn",
    "⛔ la sua striscia è arancione (st-warn), non verde: una data che non c'è non è una data lontana", senza && senza.striscia);
  dice(!!senza && senza.icona === "warn",
    "⛔ e l'icona è la sveglia, non la spunta «a posto»", senza && senza.icona);
  const scad = righe.find((r) => /^scaduta$/i.test(r.badge));
  dice(!!scad && scad.striscia === "st-danger" && scad.icona === "danger", "la scaduta resta rossa con l'allarme (la correzione non si porta via il resto)", scad);
  await pg.close();
}

console.log("\n· il foglio per l'ente: il ± dice su quanti rilievi si regge");
/* un rilievo con metodo (10.000 m³, ± 2%) e uno senza (30.000 m³), lo stesso
   giorno di trenta giorni fa: l'anno è quello, e i numeri attesi sono scritti
   qui, non presi dalla dimostrazione */
{
  const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - 30);
  const iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  FIXTURE = "\nDEMO.rilievi.length = 0;"
    + `\nDEMO.rilievi.push({ id: "m", titolo: "Con metodo", data: "${iso}", tipo: "Ortofoto + DEM", volumeM3: 10000, fronteId: "f1", stato: "elaborato", metodo: "RTK", gsd: "2", provenienza: "scavo" });`
    + `\nDEMO.rilievi.push({ id: "n", titolo: "Senza metodo", data: "${iso}", tipo: "Ortofoto + DEM", volumeM3: 30000, fronteId: "f2", stato: "elaborato", provenienza: "scavo" });\n`;
  const pg = await apri("nav-den");
  await intercetta(pg);
  await pg.click("#btn-den-stampa"); await pg.waitForTimeout(500);
  const doc = testo(await pg.evaluate(() => window.__doc));
  dice(doc.length > 800, "il prospetto viene prodotto davvero", doc.length);
  dice(/sul solo rilievo con metodo dichiarato \(10\.000 m³ su 40\.000\): ± 200 m³/.test(doc),
    "⛔ «Come sono stati ottenuti i numeri»: il ± 200 copre 10.000 m³ su 40.000, ed è scritto", (doc.match(/Incertezza[^.]*\./) || [])[0]);
  /* la frase passa da `esc()` sul foglio, quindi l'apostrofo arriva come
     `&#39;`: si legge la forma che il browser MOSTRA, non la sorgente */
  const mostrato = doc.replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  dice(/L'altro rilievo \(30\.000 m³\) non dichiara il metodo/.test(mostrato),
    "⛔ e l'altro rilievo, coi suoi 30.000 m³, è nominato invece di pesare zero", (mostrato.match(/L'altro rilievo[^.]*\./) || [])[0]);
  dice(!/di ogni rilievo \(stima prudente\)/.test(doc),
    "⛔ nessun «di ogni rilievo (stima prudente)» su un conto che ne copre uno su due", (doc.match(/Incertezza[^.]*\./) || [])[0]);
  dice(/stimabile solo su 10\.000 m³/.test(doc),
    "⛔ e nella base dell'onere lo stesso: «stimabile solo su 10.000 m³», non «incertezza del volume dichiarata»", (doc.match(/Incertezza del volume[^.]*\./) || [])[0]);
  await pg.close();
}

console.log("\n· il CSV dei rilievi (quello che si ri-carica) porta il fronte");
FIXTURE = "";
{
  const pg = await apri("nav-ril");
  await intercetta(pg);
  await pg.click("#btn-exp-ril"); await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  dice(csv.length > 50, "il file viene prodotto davvero", csv.length);
  /* il numero atteso si DERIVA dal modulo servito, non si scrive: la
     dimostrazione cresce e un «5» scritto qui invecchierebbe con lei */
  const attesi = await pg.evaluate(async () => {
    const m = await import("./terra-data.js");
    const nomi = new Map(m.DEMO.fronti.map((f) => [String(f.id), f.nome]));
    return m.DEMO.rilievi.filter((r) => r.fronteId != null && nomi.has(String(r.fronteId))).map((r) => nomi.get(String(r.fronteId))).sort();
  });
  const scritti = csv.trim().split("\n").slice(1).map((r) => r.split(";")[4]).filter(Boolean).sort();
  dice(attesi.length > 0, `la dimostrazione ha rilievi con un fronte (${attesi.length})`, attesi);
  dice(JSON.stringify(scritti) === JSON.stringify(attesi),
    `⛔ la colonna «fronte» porta il nome per ognuno di loro (${scritti.length} su ${attesi.length}; prima: 0 su ${attesi.length})`, scritti.join(", ") || "(tutte vuote)");
  await pg.close();
}

console.log("\n· i lotti: previsti e misurati si leggono, non finiscono nei puntini");
{
  const pg = await apri("nav-pia");
  const lotti = await pg.$$eval("#lot-list .item", (els) => els.map((it) => {
    const m = it.querySelector(".meta"), h = it.querySelector(".form-hint");
    return { nome: (it.querySelector(".name") || {}).innerText || "", meta: m ? m.innerText : "",
      metaTagliata: !!m && m.scrollHeight > m.clientHeight + 1,
      hint: h ? h.innerText : "", hintTagliato: !!h && h.scrollHeight > h.clientHeight + 1 };
  }));
  dice(lotti.length >= 3, `la dimostrazione ha dei lotti (${lotti.length})`, lotti.length);
  const senzaVolumi = lotti.filter((l) => !/Previsti .* · misurati /.test(l.hint));
  dice(senzaVolumi.length === 0, "⛔ ogni lotto scrive «Previsti … · misurati …» nella riga larga sotto (il form-hint), non nel .meta", senzaVolumi.map((l) => l.nome + " → " + l.hint.slice(0, 60)).join(" | "));
  dice(lotti.every((l) => !l.hintTagliato), "e quella riga non è tagliata (non ha il clamp)", lotti.filter((l) => l.hintTagliato).map((l) => l.nome).join(", "));
  dice(lotti.every((l) => !/misurati/.test(l.meta)), "e il .meta non li ripete (se no tornerebbero nei puntini)", lotti.filter((l) => /misurati/.test(l.meta)).map((l) => l.nome).join(", "));
  console.log(`  ·   .meta ancora tagliati a 430 px: ${lotti.filter((l) => l.metaTagliata).length} su ${lotti.length} (dichiarato, non giudicato: lì restano ordine, superficie e data)`);
  await pg.close();
}

// ── 7 · I SECCHI DEL CSV DELLA DENUNCIA ───────────────────────────────────
/* Le RIGHE dei banchi lasciavano già la cella vuota quando nessuno aveva
   misurato; i tre SECCHI — che sono banchi anche loro, solo senza nome — no.
   E il secchio «fronti non più in elenco» nel file non c'era affatto, benché
   schermo e foglio stampato lo dichiarino: la colonna dei banchi non tornava
   col totale dell'anno, e il file non diceva perché. */
console.log("\n· il CSV della denuncia: i secchi che non sono un banco");
/* ⚠️ il fixture si DICHIARA: questa scena si teneva quello lasciato dalla
   scena 6, e il 02/09 — con quattro scene inserite in mezzo — ha misurato la
   dimostrazione nuda e accusato tre secchi che non c'erano */
FIXTURE = FIXTURE_DOCUMENTI;
{
  const pg = await apri("nav-den");
  await intercetta(pg);
  await pg.click("#btn-den-csv");
  await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  const banchi = csv.split("\n").filter((r) => r.startsWith("banco;"));
  dice(banchi.length >= 4, "ci sono le righe dei banchi e i secchi", banchi);
  const nonDich = banchi.find((r) => /Banco non dichiarato/.test(r)) || "";
  dice(/^banco;[^;]*;;/.test(nonDich),
    "⛔ il secchio che nessuno ha misurato lascia la cella VUOTA, non «0»", nonDich);
  const mai = banchi.find((r) => /banco 3/.test(r)) || "";
  dice(/^banco;[^;]*;;/.test(mai), "come la riga del banco mai rilevato, che lo faceva già", mai);
  const fuori = banchi.find((r) => /non più in elenco/.test(r)) || "";
  dice(/^banco;[^;]*;7000;/.test(fuori),
    "⛔ e i m³ su un fronte cancellato hanno la loro riga: prima sparivano dal file", fuori);
  /* ⛔ LA PROVA CHE CHIUDE: la colonna dello scavo TORNA col totale dell'anno.
     È il modo in cui un foglio di calcolo legge questo file, ed è lì che il
     buco si vedeva — 79.400 di banchi sotto un totale di 86.400. */
  const num = (r) => { const c = r.split(";")[2]; return c === "" ? 0 : +c; };
  const somma = banchi.reduce((t, r) => t + num(r), 0);
  const tot = num(csv.split("\n").find((r) => r.startsWith("totale;")) || ";;0");
  dice(somma === tot, `la somma delle righe banco (${somma}) fa il totale dell'anno (${tot})`);
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
  /* la soglia è salita da 10 a 20 il 03/08, con le sette iniezioni nuove: con
     tutti i difetti rimessi ne cadono 26. Lasciarla a 10 avrebbe reso la
     controprova verde anche se metà delle iniezioni nuove non fosse arrivata.
     E da 20 a 30 il 02/09, con le cinque iniezioni della terza tornata: con
     tutti i difetti rimessi ne cadono 33. */
  console.log(ko >= 30 ? "✓ il banco SA fallire: rimessi i difetti cadono le prove giuste"
                      : `⚠️ troppo poche cadute (${ko})`);
  process.exit(ko >= 30 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

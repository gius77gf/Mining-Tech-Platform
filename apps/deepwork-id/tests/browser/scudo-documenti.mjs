/* I DOCUMENTI CHE ESCONO DA SCUDO — provati premendo il bottone e aprendo il
   file, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-documenti.mjs [--porta=8730]
     node scudo-documenti.mjs --controprova   (rimette i quattro difetti: DEVE fallire)
     node scudo-documenti.mjs --dimmi         (stampa i file interi)

   PERCHÉ ESISTE. Le prove `node` chiamano il modulo; i FILE li compone la
   pagina, e lì non guardava nessuno — è il posto misurato il 03/08 in cinque
   app su cinque. I quattro difetti che questo banco tiene chiusi sono tutti
   della stessa famiglia: **il documento era più tranquillo dello schermo**.

   1. AZIONI CORRETTIVE. Il file portava `stato` (aperta/in corso/chiusa) e la
      data, e basta: un'azione «aperta» scaduta da 34 giorni usciva scritta
      identica a una che scade fra un anno, e una senza entro-quando usciva con
      la cella vuota — a schermo, sulla stessa riga, c'è la pastiglia rossa
      «Scaduta» e la scritta «senza data». Il responsabile mancante era una
      cella vuota, che in un foglio si legge «non serve»; a schermo è
      «responsabile da assegnare».
   2. PERSONALE E SCADENZE. Chi non ha NEMMENO UNA riga in scadenzario nel file
      c'era (quel difetto era già stato evitato) ma con le ultime tre celle
      BIANCHE, in mezzo a righe che dicono «regolare» e «scaduta». Lo schermo
      su quella persona scrive la pastiglia gialla «Nessuna scadenza» e in
      testata «non è «a posto», è una persona di cui non si sa niente».
   3. RIEPILOGO L. 198/2025. Sotto la soglia `MIN_TENDENZA` la pagina si
      RIFIUTA di disegnare le classifiche («disegnarla sarebbe una bugia») e il
      file le scriveva in fila senza una parola; e con zero segnalazioni nella
      finestra scriveva `0` senza dire quante ce ne sono nello storico.
   4. REGISTRO INFORTUNI. La prognosi ancora aperta usciva come cella vuota
      nella colonna dei giorni — giusto, non è uno zero — ma senza dirlo: in un
      foglio di calcolo una cella vuota in quella colonna si legge «zero
      giorni», che è di nuovo il numero tranquillo che la decisione 17 esisteva
      per togliere.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, non nel file su disco: accanto
   ci sono cantieri che scrivono e un giro del browser può partire in qualunque
   momento. Il server qui sotto appende in coda a `scudo-data.js` le righe che
   montano i casi; il repo non si tocca.
   ⛔ E LE DATE DEI CASI SI CALCOLANO AL CARICAMENTO, non si scrivono: la
   dimostrazione ha date assolute, quindi un banco che si fidasse di loro
   misurerebbe cose diverse a seconda del giorno in cui gira. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8730;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

/* I CASI. `scudoData()` in demo fa `JSON.parse(JSON.stringify(DEMO))`, quindi
   basta mutare l'oggetto al caricamento del modulo. */
const CASI = `
/* ── casi montati dal banco scudo-documenti.mjs (mai sul disco) ── */
{
  const gg = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  /* NEAR-MISS: si toglie quello che la dimostrazione ha (date assolute) e se ne
     mettono TRE dentro la finestra dei 90 giorni — sotto MIN_TENDENZA, quindi
     la pagina non disegna le classifiche — e QUATTRO fuori, così il file deve
     dire tutt'e due le cose: come va letto, e quanti sono nello storico. */
  DEMO.infortuni = DEMO.infortuni.filter((x) => x.tipo !== "near-miss");
  for (const [i, n] of [10, 20, 30].entries())
    DEMO.infortuni.push({ id: "znmd" + i, tipo: "near-miss", data: gg(n), gravita: "lieve",
      categoria: "caduta-massi", luogoTipo: "fronte", descrizione: "Segnalazione dentro il periodo", luogo: "fronte Est" });
  for (const [i, n] of [400, 401, 402, 403].entries())
    DEMO.infortuni.push({ id: "znmf" + i, tipo: "near-miss", data: gg(n), gravita: "lieve",
      categoria: "mezzi", luogoTipo: "pista", descrizione: "Segnalazione fuori periodo", luogo: "pista principale" });
  /* AZIONI: i quattro casi del semaforo, tutti deterministici. */
  DEMO.azioni.push({ id: "zscad", descrizione: "Rifare l'arginello della pista di risalita",
    responsabileId: "d3", scadenza: "2020-01-01", stato: "aperta" });
  DEMO.azioni.push({ id: "zsenza", descrizione: "Rivedere il piano di emergenza dopo la modifica del piazzale",
    responsabileId: null, scadenza: null, stato: "aperta" });
  DEMO.azioni.push({ id: "zimposs", descrizione: "Sostituire la rete paramassi del fronte Nord",
    responsabileId: "d3", scadenza: "2026-13-45", stato: "aperta" });
  DEMO.azioni.push({ id: "zreg", descrizione: "Verifica annuale delle funi del carroponte",
    responsabileId: "d3", scadenza: "2099-12-31", stato: "aperta" });
  /* Una scadenza il cui campo data non è mai stato scritto: nel file usciva
     con la PAROLA «undefined». Va ad Anna Neri (d4); Sara Conti (d7) resta la
     persona senza NEMMENO una riga. */
  DEMO.scadenze.push({ id: "zundef", lavoratoreId: "d4", tipo: "Corso", descrizione: "Preposto — aggiornamento" });
  /* Due scadenze rimaste SENZA la loro persona (tolta dall'anagrafica): l'id
     c'è ma non trova nessuno. La modale che toglie una persona promette che
     «resteranno in elenco come scadenze aziendali: non vanno perse». */
  DEMO.scadenze.push({ id: "zorf1", lavoratoreId: "d99", tipo: "Corso",
    descrizione: "Antincendio della persona tolta dall'anagrafica", dataScadenza: "2020-06-01" });
  DEMO.scadenze.push({ id: "zorf2", lavoratoreId: "d99", tipo: "Visita medica",
    descrizione: "Visita medica della persona tolta dall'anagrafica", dataScadenza: "2020-05-01" });
  /* DPI di Anna Neri (d4): i tre casi della colonna «Sostituire entro» del
     verbale — una in corso, una SCADUTA da due anni, una senza data. */
  DEMO.dpi.push({ id: "zdpiok", lavoratoreId: "d4", tipo: "elmetto", modello: "Elmo Z",
    taglia: "U", dataConsegna: "2026-06-01", scadenza: "2099-06-01" });
  DEMO.dpi.push({ id: "zdpiscad", lavoratoreId: "d4", tipo: "maschera", modello: "FFP3 X",
    taglia: "M", dataConsegna: "2020-01-10", scadenza: "2020-07-10", addestramento: false });
  DEMO.dpi.push({ id: "zdpisenza", lavoratoreId: "d4", tipo: "otoprotettori", modello: "Cuffie Y",
    taglia: "U", dataConsegna: "2021-03-01", addestramento: false });
}
`;

/* LA CONTROPROVA rimette i quattro difetti nella PAGINA servita, uno per
   difetto, e conta le sostituzioni: un `replace` che non trova niente esce in
   silenzio e dichiara riuscita una prova mai partita. */
const DIFETTI = [
  // 1a. l'intestazione delle azioni senza la colonna del semaforo
  ['let csv = "descrizione;responsabile;scadenza;semaforo;stato;esito;dataChiusura;origine\\n";',
   'let csv = "descrizione;responsabile;scadenza;stato;esito;dataChiusura;origine\\n";'],
  // 1b. la riga senza `statoAzione`, e il responsabile mancante come cella vuota
  ['const nome = (id) => { const l = LAV.find(x => x.id === id); return l ? l.nome : "da assegnare"; };',
   'const nome = (id) => { const l = LAV.find(x => x.id === id); return l ? l.nome : ""; };'],
  ["${a.scadenza || \"\"};${statoAzione(a)};${a.stato || \"aperta\"}", "${a.scadenza || \"\"};${a.stato || \"aperta\"}"],
  // 2. la persona senza nemmeno una riga, con la cella `stato` bianca
  ['${csvCell(idn)};;;${SENZA}\\n`;', '${csvCell(idn)};;;\\n`;'],
  // 3. il riepilogo L.198 senza lo storico e senza la nota di lettura
  ['csv += `totale;near-miss nello storico (fuori periodo compresi);${r.totaleStorico}\\n`;', ""],
  ['{ const nota = descriviLetturaNearMiss(r);\n      if (nota) csv += `lettura;${csvCell(nota)};\\n`; }', ""],
  // 4. il registro infortuni senza la colonna che dice la prognosi aperta
  ['let csv = "data;tipo;gravita;giorniAssenza;descrizione;luogo;nota\\n";',
   'let csv = "data;tipo;gravita;giorniAssenza;descrizione;luogo\\n";'],
  ['${csvCell(x.luogo||"")};`\n        + `${prognosiAperta(x) ? "prognosi ancora aperta: le giornate di assenza non sono ancora contate" : ""}\\n`;',
   '${csvCell(x.luogo||"")}\\n`;'],
  /* 5. l'ordine del file delle azioni: `scadenza || ""` mandava in TESTA — cioè
        nel posto delle più urgenti — chi la data non ce l'ha, e mescolava le
        chiuse alle aperte. */
  ['AZI.slice().sort((x, y) => (x.stato === "chiusa") - (y.stato === "chiusa")\n        || String(x.scadenza || "9999").localeCompare(String(y.scadenza || "9999")))',
   'AZI.slice().sort((x, y) => String(x.scadenza || "").localeCompare(String(y.scadenza || "")))'],
  // 6. la data mai scritta che usciva come la PAROLA «undefined»
  ['${csvCell(s.descrizione)};${s.dataScadenza || ""};${statoScadenza(s.dataScadenza)}\\n`;\n    }',
   '${csvCell(s.descrizione)};${s.dataScadenza};${statoScadenza(s.dataScadenza)}\\n`;\n    }'],
  /* 8. il secondo giro che chiedeva «non è di nessuno?» invece di «non è di
        nessuno di QUESTI?»: le scadenze della persona tolta sparivano. */
  ['const noti = new Set(LAV.map(l => l.id));\n    for (const s of SCA.filter(x => !noti.has(x.lavoratoreId)))',
   'for (const s of SCA.filter(x => !x.lavoratoreId))'],
  /* 7. la colonna «Sostituire entro» del VERBALE che ri-decideva invece di
        leggere `r.stato`: una maschera da sostituire da anni stampata come una
        valida fino al 2099. */
  ['${\n          c.nonScade === true ? "non scade (dichiarato)"\n          : r.stato === "senza data" ? "non indicata"\n          : fmtData(c.scadenza) + (r.stato === "scaduta" ? " — DA SOSTITUIRE"\n                                 : r.stato === "in-scadenza" ? " — da sostituire a breve" : "")}',
   '${c.scadenza ? fmtData(c.scadenza) : (c.nonScade === true ? "non scade (dichiarato)" : "non indicata")}'],
];

let iniezioniCasi = 0, iniezioniDifetti = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER. Un banco che trova
     la porta occupata e la RIUSA non fallisce: misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/scudo/scudo-data.js")) { corpo = Buffer.from(corpo.toString("utf8") + CASI, "utf8"); iniezioniCasi++; }
  if (CONTROPROVA && p.endsWith("apps/scudo/index.html")) {
    let t = corpo.toString("utf8");
    for (const [da, a] of DIFETTI) {
      const n = t.split(da).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 60).replace(/\n/g, "⏎")}…»`); continue; }
      t = t.replace(da, a); iniezioniDifetti++;
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA. Qui girano cantieri
   paralleli, quindi si provano dodici porte; poi si RILEGGE DAL SERVER il
   contrassegno col proprio pid, che è la sola prova che chi risponde è mio. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
/* I CSV escono da un `<a download>` con un `data:` href: il click vero
   scaricherebbe un file, quindi si intercetta e si legge il contenuto. */
await pg.addInitScript(() => {
  window.__scaricati = [];
  window.print = () => { window.__stampato = (window.__stampato || 0) + 1; };
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, "i casi sono stati montati nel modulo servito", iniezioniCasi);

const apriTutto = async () => {
  for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary, .sec.closed .sec-h")) {
    await acc.click({ timeout: 2000 }).catch(() => {}); await pg.waitForTimeout(70);
  }
};
const scarica = async (nav, id) => {
  if (nav) {
    await pg.click("#" + nav).catch(() => {});
    await pg.waitForTimeout(650);
    /* ⛔ LA PROVA DI AVER NAVIGATO. Un banco che misura una schermata che non
       c'è risponde «tutto a posto»: si pretende che la pagina giusta sia
       quella visibile prima di premere. */
    const viva = await pg.evaluate((n) => {
      const pagina = document.getElementById("page-" + n.replace(/^nav-/, ""));
      return !!pagina && getComputedStyle(pagina).display !== "none";
    }, nav);
    if (!viva) return { errore: "non ho navigato a " + nav };
    await apriTutto(); await pg.waitForTimeout(250);
  }
  if (!(await pg.$("#" + id))) return { errore: "bottone assente: " + id };
  await pg.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
  await pg.click("#" + id, { timeout: 4000 }).catch((e) => {});
  await pg.waitForTimeout(400);
  const g = await pg.evaluate(() => { const l = window.__scaricati.slice(); window.__scaricati = []; return l; });
  if (!g.length) return { errore: "nessun file uscito da " + id };
  return { nome: g[0].nome, testo: decodeURIComponent(g[0].href.replace(/^data:text\/csv;charset=utf-8,/, "")) };
};
const righe = (t) => t.split("\n").filter(Boolean);

// ── 1 · LE AZIONI CORRETTIVE ───────────────────────────────────────────────
const azi = await scarica("nav-azio", "btn-azi-export");
dice(!azi.errore, "il CSV delle azioni esce", azi.errore);
if (!azi.errore) {
  if (DIMMI) console.log("\n[azioni]\n" + azi.testo + "\n");
  const R2 = righe(azi.testo), intest = R2[0].split(";");
  const col = (n) => intest.indexOf(n);
  const riga = (desc) => (R2.find((r) => r.startsWith(desc)) || "").split(";");
  dice(col("semaforo") >= 0, "c'è la colonna «semaforo», quella che a schermo è la pastiglia", intest);
  dice(riga("Rifare l'arginello")[col("semaforo")] === "scaduta",
    "un'azione APERTA e fuori tempo esce «scaduta», non solo «aperta»", riga("Rifare l'arginello"));
  dice(riga("Rifare l'arginello")[col("stato")] === "aperta", "e l'avanzamento resta la sua colonna", riga("Rifare l'arginello"));
  dice(riga("Rivedere il piano di emergenza")[col("semaforo")] === "senza data",
    "senza entro-quando il semaforo dice «senza data», non regolare", riga("Rivedere il piano di emergenza"));
  dice(riga("Rivedere il piano di emergenza")[col("responsabile")] === "da assegnare",
    "e il responsabile mancante è scritto, non una cella vuota", riga("Rivedere il piano di emergenza"));
  dice(riga("Sostituire la rete paramassi")[col("semaforo")] === "senza data",
    "una data che non esiste («2026-13-45») non passa per una scadenza qualunque", riga("Sostituire la rete paramassi"));
  dice(riga("Verifica annuale delle funi")[col("semaforo")] === "regolare",
    "e una lontana resta regolare", riga("Verifica annuale delle funi"));
  /* l'ordine del file è quello dell'elenco: chiuse in fondo, e chi non ha una
     data in coda invece che in testa (ordinando per `scadenza || ""` finiva
     prima di tutte, cioè nel posto delle più urgenti) */
  const pos = (d) => R2.findIndex((r) => r.startsWith(d));
  dice(pos("Rivedere il piano di emergenza") > pos("Rifare l'arginello"),
    "chi non ha una data non sta in testa al file", [pos("Rifare l'arginello"), pos("Rivedere il piano di emergenza")]);
  dice(pos("Consegna guanti antitaglio") === R2.length - 1, "e le chiuse stanno in fondo", pos("Consegna guanti antitaglio"));
}

// ── 2 · PERSONALE E SCADENZE ───────────────────────────────────────────────
const pers = await scarica("nav-pers", "btn-export-csv");
dice(!pers.errore, "il CSV di personale e scadenze esce", pers.errore);
if (!pers.errore) {
  if (DIMMI) console.log("\n[personale]\n" + pers.testo + "\n");
  const sara = righe(pers.testo).find((r) => r.startsWith("Sara Conti")) || "";
  dice(!!sara, "la persona senza NEMMENO una scadenza è nel file (non sparisce)", sara);
  dice(/nessuna scadenza registrata/.test(sara),
    "e la sua cella «stato» lo dice, invece di restare bianca", sara);
  dice(!/undefined|;null;/.test(pers.testo),
    "una data mai scritta non esce come la parola «undefined»",
    righe(pers.testo).filter((r) => /undefined|null/.test(r)));
  const anna = righe(pers.testo).find((r) => r.startsWith("Anna Neri")) || "";
  dice(/;senza data$/.test(anna), "e quella riga porta lo stato «senza data»", anna);
  /* ⛔ LA SCADENZA CHE HA PERSO LA SUA PERSONA. La modale che toglie un
     lavoratore promette che le sue scadenze «resteranno in elenco come
     scadenze aziendali: non vanno perse», e lo schermo le disegna con
     «azienda»; il file le lasciava fuori — non le reclamava nessun lavoratore
     e il secondo giro chiedeva `!x.lavoratoreId`, che un id sganciato non è. */
  const orfane = righe(pers.testo).filter((r) => /persona tolta dall'anagrafica/.test(r));
  dice(orfane.length === 2, "le scadenze della persona tolta sono nel file (la modale lo promette)", orfane);
  dice(orfane.every((r) => r.startsWith("AZIENDA;")),
    "e ci stanno come aziendali, che è la parola che usa lo schermo", orfane);
  /* la conta del toast e le righe del file devono parlare della stessa cosa */
  const quante = await pg.evaluate(() => (document.getElementById("import-esito").textContent || ""));
  const attese = +(quante.match(/e (\d+) scadenze/) || [0, 0])[1];
  const scritte = righe(pers.testo).length - 1 - righe(pers.testo).filter((r) => /nessuna scadenza registrata/.test(r)).length;
  dice(attese > 0 && attese === scritte,
    "e il numero annunciato («… e N scadenze») è quello delle righe scritte davvero", { attese, scritte, quante });
}

// ── 3 · IL RIEPILOGO PER LA L. 198/2025 ────────────────────────────────────
const nm = await scarica("nav-doc", "btn-nm-export");
dice(!nm.errore, "il CSV del riepilogo near-miss esce", nm.errore);
if (!nm.errore) {
  if (DIMMI) console.log("\n[near-miss]\n" + nm.testo + "\n");
  dice(/totale;near-miss segnalati;3\b/.test(nm.testo), "tre segnalazioni nella finestra", nm.testo);
  dice(/nello storico[^;]*;7\b/.test(nm.testo),
    "e il file dice quante sono NELLO STORICO: 3 nel periodo non è 3 in tutto", nm.testo);
  dice(/^lettura;/m.test(nm.testo), "c'è la riga che dice come va letto", nm.testo);
  dice(/ATTENZIONE alla lettura/.test(nm.testo) && /non una tendenza/.test(nm.testo),
    "e dice che sotto la soglia quelle righe sono un conteggio, non una tendenza", nm.testo);
}

// ── 4 · IL REGISTRO INFORTUNI ──────────────────────────────────────────────
const inf = await scarica(null, "btn-inf-export");
dice(!inf.errore, "il CSV del registro infortuni esce", inf.errore);
if (!inf.errore) {
  if (DIMMI) console.log("\n[registro]\n" + inf.testo + "\n");
  /* ⛔ SI GUARDA LA COLONNA, NON LA RIGA. La prima stesura cercava «prognosi
     ancora aperta» nel TESTO della riga e passava anche con la colonna tolta:
     quelle parole stanno pure nella DESCRIZIONE dell'evento di dimostrazione.
     Il controllo che non guarda dove crede, alla prima esecuzione. */
  const iR = righe(inf.testo), iInt = iR[0].split(";"), iCol = (n) => iInt.indexOf(n);
  const aperta = (iR.find((r) => /Distorsione alla caviglia/.test(r)) || "").split(";");
  dice(aperta.length > 1, "l'infortunio a prognosi aperta è nel registro", aperta);
  dice(iCol("nota") >= 0, "c'è la colonna «nota», in coda per non toccare l'import", iInt);
  dice(aperta[iCol("giorniAssenza")] === "",
    "le sue giornate restano una cella VUOTA, non uno zero (decisione 17)", aperta);
  dice(/^prognosi ancora aperta/.test(aperta[iCol("nota")] || ""),
    "e adesso la colonna dice PERCHÉ è vuota: una cella bianca si legge «zero giorni»", aperta);
  const chiuso = (iR.find((r) => /Taglio alla mano/.test(r)) || "").split(";");
  dice(chiuso[iCol("giorniAssenza")] === "4" && (chiuso[iCol("nota")] || "") === "",
    "un infortunio chiuso porta i suoi giorni e nessuna nota", chiuso);
}

// ── 5 · IL VERBALE DPI, IL FOGLIO CHIESTO PER PRIMO IN ISPEZIONE ───────────
/* Misurato affiancando i DUE fogli sugli stessi dati: la CARTELLA scriveva
   «da sostituire» e il VERBALE, due bottoni più in là, stampava la data e
   basta. Lo stato `verbaleDpi` lo calcolava già per ogni riga. */
{
  await pg.click("#nav-pers").catch(() => {});
  await pg.waitForTimeout(600);
  await pg.click('#pers-tabs [data-tab="dpi"]').catch(() => {});
  await pg.waitForTimeout(450);
  const scelto = await pg.evaluate(() => {
    const s = document.getElementById("dpi-verb-lav");
    if (!s || ![...s.options].some((o) => o.value === "d4")) return false;
    s.value = "d4"; return s.value === "d4";
  });
  dice(scelto, "la scheda DPI è aperta e la persona si può scegliere", scelto);
  await pg.click("#btn-dpi-verb").catch(() => {});
  await pg.waitForTimeout(400);
  await pg.evaluate(() => {
    const b = [...document.querySelectorAll(".modal-ov button, .modal button")].find((x) => /^Stampa$/i.test(x.textContent.trim()));
    if (b) b.click();
  });
  await pg.waitForTimeout(400);
  const foglio = await pg.evaluate(() => (document.getElementById("verbale").textContent || "").replace(/\s+/g, " ").trim());
  if (DIMMI) console.log("\n[verbale DPI]\n" + foglio + "\n");
  dice(/Verbale di consegna dei DPI/.test(foglio), "il verbale si compone", foglio.slice(0, 120));
  dice(/10\/07\/2020 — DA SOSTITUIRE/.test(foglio),
    "una consegna scaduta è marcata sul foglio, non stampata come una qualunque", foglio.slice(0, 700));
  dice(/01\/06\/2099(?! —)/.test(foglio), "e una in corso di validità resta pulita", foglio.slice(0, 700));
  dice(/non indicata/.test(foglio), "la consegna senza data di sostituzione lo dice (decisione 14)", foglio.slice(0, 700));
  dice(!/—\s*<\/td>/.test(foglio) && !/ — $/.test(foglio), "e nessuna cella resta un trattino muto");
}

console.log(`\n${ok} ok · ${ko} KO${CONTROPROVA ? `  ·  ${iniezioniDifetti}/${DIFETTI.length} difetti rimessi` : ""}`);
if (CONTROPROVA) {
  const atteso = iniezioniDifetti === DIFETTI.length;
  if (!atteso) console.log("⛔ non tutti i difetti sono stati rimessi: il verde qui sotto non vuol dire niente.");
  console.log(ko > 0 && atteso ? "✔ CONTROPROVA OK: coi difetti rimessi il banco fallisce." : "⛔ CONTROPROVA FALLITA: il banco non distingue.");
}
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 && iniezioniDifetti === DIFETTI.length ? 0 : 1) : (ko > 0 ? 1 : 0));

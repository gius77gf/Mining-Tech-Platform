/* LA VERIFICA PERIODICA DELLE ATTREZZATURE — provata aprendo la finestra e
   premendo i bottoni, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-verifica-periodica.mjs [--porta=8760]
     node scudo-verifica-periodica.mjs --controprova   (rimette i difetti: DEVE fallire)
     node scudo-verifica-periodica.mjs --dimmi         (stampa il CSV intero)

   ⛔ PERCHÉ ESISTE, E PERCHÉ È STATO RISCRITTO. Questa prova era stata scritta
   il 07/08 e lasciata **nello scratchpad** — ventuno prove, tutte verdi, «da
   portare in `tests/browser/` alla prossima occasione». Poi il contenitore è
   ripartito e non esiste più. È la dimostrazione pratica della riga di
   CLAUDE.md che nessuno prende sul serio finché non costa: *una difesa che
   resta nello scratchpad, alla sessione dopo non esiste*. Riscritta qui, con
   la registrazione in `tutti.mjs` nello stesso commit — perché un banco non
   registrato è un banco che non gira, ed è la stessa cosa.

   CHE COSA TIENE CHIUSO, e sono tre famiglie che questa casa conosce bene.

   1. **UN CAMPO CHE COMPARE DOVE NON HA SENSO SCRIVE UN DATO CHE MENTE.** La
      data «le prescrizioni vanno sanate entro» esiste solo per l'esito «idonea
      con prescrizioni»: tenuta addosso a un'attrezzatura dichiarata IDONEA
      tornerebbe fuori il giorno in cui qualcuno rimette «con prescrizioni», e
      sarebbe la data di **un'altra verifica**. La pagina lo fa in due punti —
      nasconde la riga (`vf-entro-riga`) **e** azzera il campo al salvataggio —
      e la difesa che conta è la seconda: nascondere un campo non cancella quello
      che c'è dentro. Il banco preme davvero i due tasti e riapre.

   2. **IL DOCUMENTO CHE ESCE DEVE DIRE LA PAROLA DELLO SCHERMO.** È la regola
      misurata il 03/08 in cinque app su cinque: dove un'app compone qualcosa
      che ESCE, chi decide i suoi numeri? Qui la colonna «verifica periodica»
      del CSV del personale la decide `statoVerificaPeriodica`, la STESSA
      funzione che disegna la pastiglia nello scadenzario. Il banco pretende
      **l'identità della parola**, non che siano tutt'e due plausibili: è la
      differenza fra una prova e una rassicurazione.

   3. **«NON LO SO» NON È «A POSTO».** Una verifica senza esito registrato non
      risulta «regolare»: risulta NON VERIFICATA. E nel file la cella non resta
      bianca — una cella vuota in un foglio di conformità si legge «niente da
      segnalare», che è il numero tranquillo su una cosa mai misurata.

   ⛔ I CASI SI MONTANO NEI DATI SERVITI, mai sul file su disco: accanto
   possono girare cantieri, e un giro del browser può partire in qualunque
   momento. Il server appende in coda a `scudo-data.js` le righe che montano i
   casi, e porta il **contrassegno col proprio pid**, riletto prima di
   misurare: un banco che trova la porta occupata e la riusa non fallisce —
   misura la copia di qualcun altro. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8760;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const MODULO = "scudo-data.js";
const PAGINA = join("apps", "scudo", "index.html");

/* I CASI. `scudoData()` in demo fa `JSON.parse(JSON.stringify(DEMO))`, quindi
   basta mutare l'oggetto al caricamento del modulo. Tre attrezzature che
   coprono i tre stati che contano, e i loro id sono i soggetti del banco.

   ⛔ E LA DATA DELLE PRESCRIZIONI È SCADUTA APPOSTA. Con una scadenza futura il
   badge dice «Prescrizioni», che è **la stessa parola** del campo grezzo
   `verificaEsito`: la controprova che fa leggere al CSV il campo invece della
   funzione dello schermo **passava lo stesso**. Scaduta, il badge diventa
   «Prescrizioni scadute» e le due risposte si separano. È la prima delle
   cinque cause del «non distingue»: non la prova scritta male, i DATI che
   fanno coincidere il giusto e lo sbagliato.

   ⚠️ E il commento che spiega tutto questo sta QUI, sopra la costante, e non
   dentro: `CASI` è un template literal, e i backtick di un commento scritto
   là dentro **chiudono la stringa**. Successo scrivendo questo file, che è la
   terza volta per questa famiglia — la regola sta in CLAUDE.md dal 07/08. */
const CASI = `
/* ── casi montati dal banco scudo-verifica-periodica.mjs (mai sul disco) ── */
{
  const gg = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  DEMO.scadenze = DEMO.scadenze.filter((s) => s.tipo !== "Verifica periodica");
  DEMO.scadenze.push({ id: "zvp-idonea", lavoratoreId: null, tipo: "Verifica periodica",
    descrizione: "Gru a torre — verifica annuale", dataScadenza: gg(200),
    verificaEnte: "abilitato", verificaChi: "Organismo abilitato", verificaEsito: "idonea" });
  /* la data delle prescrizioni è SCADUTA apposta: vedi la nota sopra CASI */
  DEMO.scadenze.push({ id: "zvp-prescr", lavoratoreId: null, tipo: "Verifica periodica",
    descrizione: "Piattaforma elevabile — verifica annuale", dataScadenza: gg(180),
    verificaEnte: "asl", verificaChi: "ASL territoriale", verificaEsito: "prescrizioni",
    verificaEntro: gg(-20) });
  /* la terza NON ha esito: è il caso per cui il principio del fondatore
     esiste, e senza di lei il banco non avrebbe mai un «non lo so» da leggere */
  DEMO.scadenze.push({ id: "zvp-muta", lavoratoreId: null, tipo: "Verifica periodica",
    descrizione: "Generatore di vapore — verifica periodica", dataScadenza: gg(150) });
}
`;

/* ⛔ LE INIEZIONI DELLA CONTROPROVA, una per difetto, e ognuna DEVE far cadere
   una prova precisa. Si conta quante ne sono state rimesse davvero: un `sed`
   che non trova finisce in silenzio, e una controprova che non inietta niente
   dice «il banco non sa fallire» accusando il banco al posto di sé stessa. */
const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "la data delle prescrizioni resta attaccata a un esito che non le vuole",
    da: 'verificaEntro: esitoV === "prescrizioni" ? ($("vf-entro").value || null) : null,',
    a: 'verificaEntro: $("vf-entro").value || null,' },
  { file: PAGINA, n: 2, perche: "la riga della data compare con qualunque esito",
    da: '$("vf-entro-riga").style.display = $("vf-esito").value === "prescrizioni" ? "block" : "none"; };',
    a: '$("vf-entro-riga").style.display = "block"; };' },
  /* ⏱️ RI-ANCORATA il 09/08, e ha cambiato FILE. Il CSV del personale è salito
     dalla pagina al modulo (`csvPersonaleScadenze`), accanto alla funzione che
     decide la stessa cosa a schermo — il miglioramento che sposta il codice,
     terza volta in un giorno. `vfCella`, chiuso su `DOC`, è diventato `vf` con
     i documenti passati come argomento: l'ancora non trovava più niente e
     questa controprova girava su un prodotto SANO. */
  { file: MODULO, n: 3, perche: "il CSV ri-legge il campo grezzo invece di chiedere alla funzione dello schermo",
    da: '  const vf = (sc) => { const v = statoVerificaPeriodica(sc, documenti); return v ? v.badge : "—"; };',
    a: '  const vf = (sc) => sc.verificaEsito ? String(sc.verificaEsito) : "";' },
];
let rimesse = 0;
const applica = (t, file) => {
  for (const inj of INIEZIONI) {
    if (inj.file !== file || !t.includes(inj.da)) continue;
    t = t.replace(inj.da, inj.a); rimesse++;
  }
  return t;
};

const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
let iniezioniCasi = 0;
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* ⛔ Le iniezioni si applicano a TUTT'E DUE i file, non solo alla pagina: dal
     09/08 una delle tre vive nel modulo, perché il CSV del personale ci è
     salito. Servire il modulo senza applicargliele voleva dire far girare la
     controprova su un pezzo sano senza che si vedesse. */
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) t = applica(t, MODULO);
    corpo = Buffer.from(t + CASI, "utf8"); iniezioniCasi++;
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
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
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""}`); }

let ok = 0, ko = 0;
const dice = (cond, che, extra) => {
  if (cond) { ok++; console.log(`  ✓ ${che}`); }
  else { ko++; console.log(`  ✗ ${che}${extra === undefined ? "" : "  →  " + JSON.stringify(extra)}`); }
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
/* il CSV esce da un `<a download>` con un href `data:`: il click vero
   scaricherebbe un file, quindi si intercetta e si legge il contenuto */
await pg.addInitScript(() => {
  window.__usciti = [];
  const vero = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__usciti.push({ nome: this.download, href: String(this.href) }); return; }
    return vero.apply(this, arguments);
  };
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/`);
await pg.waitForTimeout(2600);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, `i casi sono stati serviti (${iniezioniCasi} volte)`);

/* ⛔ E LA PROVA CHE I CASI SONO ARRIVATI SI FA DOVE IL PROGRAMMA LI LEGGE, non
   dove li ho scritti: «la sostituzione nel file è avvenuta» è una riga che dice
   ok mentre lo stato viene sovrascritto un istante dopo. */
const arrivati = await pg.evaluate(() => {
  const f = window.dwProva && window.dwProva.scadenze ? window.dwProva.scadenze() : null;
  if (f) return f.filter((s) => String(s.id || "").startsWith("zvp-")).length;
  return document.querySelectorAll('[data-verifica^="zvp-"]').length;
});

/* si va nello scadenzario: `vaiA` col nome del BOTTONE, non della sezione */
await pg.evaluate(() => { const n = document.getElementById("nav-scad"); if (n) n.click(); });
await pg.waitForTimeout(700);
const bottoni = await pg.evaluate(() => [...document.querySelectorAll("[data-verifica]")].map((x) => x.getAttribute("data-verifica")));
dice(bottoni.filter((x) => String(x).startsWith("zvp-")).length === 3,
  `le tre attrezzature del banco sono nello scadenzario (${arrivati ? arrivati + " nello stato, " : ""}${bottoni.filter((x) => String(x).startsWith("zvp-")).length} bottoni)`, bottoni.slice(0, 8));

const apri = async (id) => {
  await pg.evaluate((i) => { const el = document.querySelector(`[data-verifica="${i}"]`); if (el) el.click(); }, id);
  await pg.waitForTimeout(500);
  return pg.evaluate(() => !!document.getElementById("vf-esito"));
};
const chiudi = async () => {
  await pg.evaluate(() => {
    const bs = [...document.querySelectorAll(".modal button, .dw-modal button, button")];
    const x = bs.find((y) => /^\s*annulla\s*$/i.test(y.textContent || ""));
    if (x) x.click();
  });
  await pg.waitForTimeout(350);
};
const rigaData = () => pg.evaluate(() => {
  const r = document.getElementById("vf-entro-riga");
  return r ? getComputedStyle(r).display : "(manca)";
});

/* ── 1. la riga della data compare SOLO con «con prescrizioni» ── */
dice(await apri("zvp-idonea"), "la finestra della verifica si apre");
dice(await rigaData() === "none", "esito «idonea»: la riga della data delle prescrizioni è nascosta", await rigaData());
await pg.selectOption("#vf-esito", "prescrizioni");
await pg.waitForTimeout(250);
dice(await rigaData() === "block", "esito «con prescrizioni»: la riga compare", await rigaData());
await pg.selectOption("#vf-esito", "");
await pg.waitForTimeout(250);
dice(await rigaData() === "none", "nessun esito registrato: la riga torna nascosta", await rigaData());
const notaMuta = await pg.evaluate(() => (document.getElementById("vf-esito-nota") || {}).textContent || "");
dice(/non lo sappiamo/i.test(notaMuta),
  "senza esito la nota dice che non si sa — non «a posto» e non «da sistemare»", notaMuta.slice(0, 90));

/* ── 2. la data NON resta attaccata a un esito che non la vuole ──
   la difesa vera è al salvataggio: nascondere un campo non svuota quello che
   c'è dentro, e il giorno che qualcuno rimette «con prescrizioni» quella data
   sarebbe la data di un'altra verifica. */
await pg.selectOption("#vf-esito", "prescrizioni");
await pg.waitForTimeout(200);
await pg.fill("#vf-entro", "2026-12-31");
await pg.selectOption("#vf-esito", "idonea");
await pg.waitForTimeout(200);
await pg.evaluate(() => {
  const x = [...document.querySelectorAll("button")].find((y) => /^\s*salva\s*$/i.test(y.textContent || ""));
  if (x) x.click();
});
await pg.waitForTimeout(900);
dice(await apri("zvp-idonea"), "la finestra si riapre dopo il salvataggio");
const entroDopo = await pg.evaluate(() => (document.getElementById("vf-entro") || {}).value || "");
const esitoDopo = await pg.evaluate(() => (document.getElementById("vf-esito") || {}).value || "");
dice(esitoDopo === "idonea", "l'esito salvato è quello scelto", esitoDopo);
dice(entroDopo === "", "salvando «idonea» la data delle prescrizioni NON resta scritta", entroDopo);
await chiudi();

/* ── 3. il file che esce dice la parola dello schermo ── */
/* ⚠️ SI LEGGE LA PASTIGLIA, NON LA RIGA. La prima stesura prendeva
   `riga.innerText` e chiedeva che la cella del CSV ne fosse una SOTTOSTRINGA:
   la controprova l'ha smascherata — col difetto rimesso il file scriveva
   `prescrizioni` (il campo grezzo) e la prova **passava lo stesso**, perché
   quella parola compare dentro il badge «PRESCRIZIONI SCADUTE». È la prima
   delle cinque cause del «non distingue»: i dati facevano coincidere la
   risposta giusta con quella sbagliata. Si legge `.badge`, e si pretende
   l'**uguaglianza**. */
const badge = await pg.evaluate(() => {
  const out = {};
  for (const id of ["zvp-idonea", "zvp-prescr", "zvp-muta"]) {
    const el = document.querySelector(`[data-verifica="${id}"]`);
    const riga = el ? el.closest(".item") || el.closest("li") || el.parentElement : null;
    /* ⚠️ E NELLA RIGA CI SONO DUE PASTIGLIE: `.badge.tag` è l'etichetta
       «all. VII» (che cosa è quell'attrezzatura), e quella che porta il
       giudizio sta in `.acts` col suo `title`. La prima stesura prendeva la
       prima che trovava e confrontava il CSV con «all. VII» — tre KO su tre,
       identici, che è il segno di stare guardando il righello. Si chiede per
       `title`, che è ciò che quella pastiglia dichiara di essere. */
    const p = riga ? (riga.querySelector('[title="Esito dell\'ultima verifica periodica"]') || riga.querySelector(".acts .badge")) : null;
    out[id] = { pastiglia: p ? (p.textContent || "").trim() : "", riga: riga ? (riga.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80) : "" };
  }
  return out;
});
await pg.evaluate(() => { const n = document.getElementById("nav-pers"); if (n) n.click(); });
await pg.waitForTimeout(500);
/* ⚠️ IL BOTTONE SI CHIAMA PER NOME, non si cerca per testo. La prima stesura
   cercava un `<button>` col testo «Esporta»/«CSV» dentro la scheda giusta e
   trovava **niente**: in Scudo ci sono quattro bottoni «Esporta CSV» e quello
   del personale è `#btn-export-csv`. Un localizzatore per prosa risponde
   «nessun file» e sembra un difetto del prodotto. */
const premuto = await pg.evaluate(() => {
  const c = document.getElementById("btn-export-csv");
  if (!c) return false;
  c.click();
  return true;
});
dice(premuto, "il bottone dell'export del personale esiste ed è stato premuto (#btn-export-csv)");
await pg.waitForTimeout(900);
const usciti = await pg.evaluate(() => window.__usciti.map((u) => ({ nome: u.nome, testo: decodeURIComponent(u.href.replace(/^data:[^,]*,/, "")) })));
const file = usciti.find((u) => /scadenz/i.test(u.nome));
dice(!!file, `il CSV del personale è uscito (${usciti.map((u) => u.nome).join(", ") || "nessun file"})`);
if (file) {
  if (DIMMI) console.log("\n" + file.testo + "\n");
  const righe = file.testo.split("\n");
  const colonne = righe[0].split(";");
  const iVf = colonne.indexOf("verifica periodica");
  dice(iVf >= 0, "il CSV ha la colonna «verifica periodica»", colonne);
  const cellaDi = (frammento) => {
    const r = righe.find((x) => x.includes(frammento));
    return r ? (r.split(";")[iVf] || "").replace(/^"|"$/g, "").trim() : null;
  };
  /* ⛔ L'IDENTITÀ DELLA PAROLA, non la plausibilità: la cella deve contenere
     esattamente quello che la pastiglia dice a schermo. Due stringhe «tutt'e
     due sensate» sono il modo in cui un documento comincia a divergere. */
  let conPastiglia = 0;
  for (const [id, frammento] of [["zvp-idonea", "Gru a torre"], ["zvp-prescr", "Piattaforma elevabile"], ["zvp-muta", "Generatore di vapore"]]) {
    const cella = cellaDi(frammento);
    const p = (badge[id] || {}).pastiglia || "";
    dice(cella !== null && cella !== "", `${frammento}: la cella del CSV non è vuota`, cella);
    /* la pastiglia si presenta solo per le righe che lo scadenzario mostra:
       dove non c'è si dichiara invece di dare per buono — un soggetto non
       comparso non è un soggetto promosso */
    if (!p) { console.log(`  ·  ${frammento}: nessuna pastiglia trovata nella riga, confronto NON fatto (riga: «${(badge[id] || {}).riga || ""}»)`); continue; }
    conPastiglia++;
    dice(cella !== null && cella.toUpperCase() === p.toUpperCase(),
      `${frammento}: il CSV scrive ESATTAMENTE la parola della pastiglia`, { csv: cella, pastiglia: p });
  }
  console.log(`  ·  confronto CSV↔pastiglia fatto su ${conPastiglia} righe su 3`);
  const cellaMuta = cellaDi("Generatore di vapore");
  dice(cellaMuta !== null && !/regolar|idone/i.test(cellaMuta),
    "senza esito il file NON scrive «regolare» né «idonea»: una cosa mai misurata non si dichiara a posto", cellaMuta);
}

await b.close();
srv.close();

console.log(`\n${ok} passati, ${ko} falliti`);
if (CONTROPROVA) {
  console.log(`iniezioni rimesse davvero: ${rimesse} su ${INIEZIONI.length}`);
  for (const i of INIEZIONI) console.log(`   · ${i.n}. ${i.perche}`);
  if (rimesse < INIEZIONI.length) {
    console.error("\n✗ CONTROPROVA NON VALIDA: qualche iniezione non ha trovato il suo testo. Non è il banco a non\n"
      + "  saper fallire — è l'iniezione che non ha iniettato niente (la terza delle cinque cause).");
    process.exit(2);
  }
  console.log(ko > 0 ? "\n✓ CONTROPROVA: coi difetti rimessi il banco li vede."
    : "\n✗ CONTROPROVA: coi difetti rimessi il banco NON li vede.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

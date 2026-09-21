/* IN CONTI IL FILE CHE ESCE DICE QUELLO CHE DICE LO SCHERMO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-documenti-che-escono.mjs [--porta=8560]
     node conti-documenti-che-escono.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La domanda di `CLAUDE.md`: *dove questa app compone qualcosa
   che ESCE, chi decide i suoi numeri?* Se la risposta non è «la stessa
   funzione che li decide a schermo», lì c'è una copia debole — ed è il posto
   dove nessuna prova guarda, perché le prove chiamano il modulo e i file li
   compone la pagina.
   Conti ha **dodici** punti d'uscita, il numero più alto dell'ecosistema.
   Censiti per struttura: **sei** chiamano una funzione del modulo, **sei**
   compongono il CSV dentro la pagina. Questo banco apre quello dove il difetto
   c'era.

   CHE COSA HA TROVATO, l'08/08.

   `conti_incassi.csv` — IL RESIDUO IGNORAVA LE NOTE DI CREDITO.
   È il file che il commercialista incrocia con l'estratto conto della banca.
   Il residuo lo calcolava come `importiFattura(f).totale - incassato`: quel
   totale è il LORDO della fattura, e `importiFattura` le note di credito non
   le guarda. Lo schermo invece passa da `statoFattura(f, INC, NOT)`, che
   toglie lo stornato e ricava l'ESIGIBILE — tanto che la riga stampata lo dice
   a parole: «Da incassare … (dopo la nota di credito)».
   Misurato su una fattura da 1.000 € con una nota da 200 € e un acconto da
   500 €: lo schermo diceva «residuo 300 €», il file scriveva **500**.
   ⚠️ Ed è lo stesso difetto che il CSV della SITUAZIONE FATTURE, quaranta
   righe più su nello stesso file, aveva GIÀ corretto — col suo commento che lo
   racconta: *la pagina si era tenuta una copia più debole di due regole che
   l'app aveva già, le note di credito e `quadra`*. Una correzione fatta a un
   export e non all'altro: la firma della copia debole, per la terza volta in
   un giorno dopo le due di Flotta.

   ⛔ IL BANCO NON PORTA DENTRO NESSUN VALORE ATTESO: il numero del file si
   confronta con quello che la SCHERMATA dice nello stesso istante, letto per
   selettore. Un banco che si scrive in pancia il totale invecchia col crescere
   della dimostrazione e poi accusa il prodotto di una cosa che ha fatto il
   prodotto.

   ⚠️ IL CENSIMENTO È DICHIARATO, E ADESSO CHIUSO: **dodici su dodici**.
   I tre difetti stanno tutti fra i sei documenti che compongono il CSV **dentro
   la pagina** — è lì che questa famiglia vive, ed è la ragione per cui il
   censimento strutturale (chi chiama chi) è il primo setaccio da passare.
   Gli altri nove sono stati aperti lo stesso, e non per completismo: un
   negativo DEDOTTO non vale niente, e su cinque app il censimento statico su
   questa stessa domanda aveva dato **zero** mentre i difetti c'erano.
   ⚠️ E la profondità NON è uniforme, il che va detto invece di lasciarlo
   intendere. Sui tre dove il difetto c'era le prove confrontano **numero per
   numero** il file con quello che la schermata dice nello stesso istante. Sui
   nove restanti le domande sono più larghe — il file esce, non è la sola
   intestazione, nessuna cella dice «undefined», «null» o «NaN» — cioè le due
   forme in cui questa famiglia si è già presentata nei file. «Pulito» lì vuol
   dire «nessuna di QUESTE domande ha trovato niente».
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { azzeraFrasi, frasiVisibili, contiNellaFrase, righeDiDato, postiDaFrase } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || join(QUI, "..", "..", "..", "..");
const PORTA = +((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1] || 8560);
const CONTROPROVA = process.argv.includes("--controprova");

const PAGINA = join("apps", "conti", "index.html");
const MODULO = join("apps", "conti", "conti-data.js");

/* ⚠️ ANCORA CORTA. Un'iniezione che cita cinque righe del modello scade appena
   qualcuno migliora quelle righe, e quando scade non succede niente di
   visibile: la controprova gira su un prodotto sano e dice «distingue» perché
   è caduto un altro difetto. Qui si àncora alla sola riga che deve restare
   ferma, e il vecchio comportamento si rimette ombreggiando `st`. */
const DIFETTI = [
  /* 0 · IL RITORNO DEL SILENZIO: il CSV dei costi senza le voci che nessun
     totale contiene. È il difetto chiuso il 09/08 — una voce di costo senza
     importo usciva dalla prima riga di `riepilogoCosti` e non arrivava né a
     schermo né nel file — e l'iniezione lo rimette togliendo la riga che le
     scrive. ⚠️ L'ancora è **corta** apposta: cita solo il ciclo, non il suo
     commento, perché un commento si riscrive e l'iniezione scadrebbe senza
     fare rumore. */
  ["  for (const c of r.righeSenzaImporto)", "  for (const c of [])", MODULO],   /* ⏱️ sul MODULO dal 05/09 */
  // 1 · il CSV degli incassi che ignora le note di credito
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO (`csvProspettoIncassi`): due spazi in meno. */
  ["    const st = statoFattura(r.f, INC, NOT);",
   "    const st = { esigibile: round2(importiFattura(r.f).totale), stornato: 0 };", MODULO],
  /* 2 · e la RIGA della lista che leggeva `f.residuo` dal record. Dieci spazi
     d'indentazione: la stessa chiamata esiste anche nel foglio stampato
     (riga 4388, quattro spazi), e i soggetti devono restare uno. */
  ["          const st = statoFattura(f, INC, NOT);",
   "          const st = { stato: f.incassata ? \"saldata\" : \"aperta\", saldata: !!f.incassata,\n            parziale: !!f.parziale, residuo: +f.residuo || 0, stornato: 0 };"],
  /* 3 · il prezzo del listino scritto `|| 0`: un prodotto senza prezzo esce
     GRATIS, nel foglio che si manda al cliente — mentre le tre celle accanto
     (densità, prezzo_t, prezzo_m3) lasciavano già la cella vuota. */
  ["${numeroDichiarato(p.prezzo) ?? \"\"};${p.unitaPrezzo === \"m3\" ? \"m3\" : \"t\"}",
   "${+p.prezzo || 0};${p.unitaPrezzo === \"m3\" ? \"m3\" : \"t\"}", MODULO],   /* ⏱️ sul MODULO dal 05/09 */
  /* 4 · e l'importo di una voce di costo, stessa famiglia.
     ⚠️ QUESTA INIEZIONE NON PRODUCE UN KO, ED È GIUSTO COSÌ — sta scritto qui
     perché chi conta «4 difetti rimessi, 3 KO» non pensi a una regressione.
     Misurato: `riepilogoCosti` SCARTA a monte le voci senza importo (su due
     costi, uno con 1.200 € e uno senza, ne restituisce uno solo), quindi la
     cella vuota in quel file non è raggiungibile e le due versioni del
     `cellaNum` scrivono la stessa cosa. La correzione resta giusta — è la
     stessa regola delle altre due celle — ma è difesa in profondità, non un
     difetto che si vedeva. */
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO: `cellaNum` è salita in conti-data.js. */
  ["export function cellaNum(x) { const v = numeroDichiarato(x); return v == null ? \"\" : Math.round(v * 100) / 100; }",
   "export function cellaNum(x) { return (+x || 0); }", MODULO],
  /* 5 · il file perde una riga IN SILENZIO e la frase continua a contare
     l'array sorgente: è la forma esatta del difetto che il confronto
     frase↔file esiste per prendere. Un cliente sparisce dall'anagrafica
     esportata, e il messaggio dice ancora quanti ce n'erano. */
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO (`csvProspettoClienti`): `CLI` lì si chiama `clienti`. */
  ["  for (const c of (clienti || []).filter(Boolean).slice().sort(",
   "  for (const c of (clienti || []).filter(Boolean).slice(1).sort(", MODULO],
];

/* I casi si montano nel MODULO servito, mai sul disco.
   ⚠️ IL CAMPO DELLA NOTA DI CREDITO SI CHIAMA `totale`, NON `importo`:
   `stornatoDi` somma `Math.abs(+n.totale || 0)`. Scritta col nome sbagliato la
   nota entrava nell'archivio e valeva ZERO — la colonna usciva `0`, e il
   confronto col residuo dello schermo passava lo stesso, perché senza nota i
   due numeri coincidono. È «l'iniezione che non inietta», la terza delle
   cinque cause, e l'ha presa la sola prova che guardava il DATO invece del
   confronto: se il banco avesse avuto solo l'asserzione sul residuo, avrebbe
   detto verde su un caso che non esisteva.
   ⚠️ E questa spiegazione sta QUI, fuori dal template, perché scritta dentro i
   suoi backtick chiudevano la stringa a metà: la pagina non partiva più. È la
   regola di casa sui commenti dentro una stringa, rifatta un'ora dopo averla
   riletta. */
const CASI = `
/* ── casi montati dal banco conti-documenti-che-escono.mjs (mai sul disco) ── */
{
  const gg = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  /* UNA fattura sola, coi tre numeri che il difetto confondeva: lorda 1.000,
     nota di credito 200, acconto 500. Lo schermo deve dire «residuo 300» e il
     file lo stesso. Con una fattura sola non c'è modo di sbagliare riga. */
  DEMO.clienti = [{ id: "c1", ragioneSociale: "Cava Nord srl", piva: "01234567890" }];
  DEMO.fatture = [{ id: "f1", numero: "2026/001", clienteId: "c1", data: gg(40),
    scadenza: gg(10), importo: 1000, imponibile: 1000, righe: [] }];
  DEMO.incassi = [{ id: "m1", fatturaId: "f1", data: gg(20), importo: 500, metodo: "bonifico" }];
  DEMO.note = [{ id: "n1", fatturaId: "f1", numero: "NC/1", data: gg(15), totale: 200,
    imponibile: 200, motivo: "abbuono su contestazione", bozza: false }];
  /* un prodotto col prezzo MAI SCRITTO accanto a uno che ce l'ha: da soli,
     «0» e «vuoto» sembrano la stessa scelta */
  DEMO.prodotti = [
    { id: "p1", nome: "Misto cava 0-30", prezzo: 8.5, unitaPrezzo: "t", densita: 1.6, iva: 22 },
    { id: "p2", nome: "Prodotto non classificato", unitaPrezzo: "t", iva: 22 },
  ];
  /* e una voce di costo senza importo accanto a una che ce l'ha */
  DEMO.costi = [
    { id: "k1", data: gg(5), voce: "gasolio", importo: 1200, nota: "" },
    { id: "k2", data: gg(6), voce: "gasolio", nota: "fattura non ancora arrivata" },
  ];
}
`;

let iniezioni = 0;
const rimessi = new Set();
/* ⛔ OGNI INIEZIONE DICHIARA IL SUO FILE, E SI APPLICA SOLO LÌ (05/09): fino a
   oggi `applica` girava sulla sola PAGINA — lo stesso buco chiuso lo stesso
   giorno nel banco di Flotta. Senza file vale la pagina, come prima. */
const applica = (t, file) => {
  for (const [i, [da, a, f]] of DIFETTI.entries()) {
    if ((f || PAGINA) !== file) continue;
    const n = t.split(da).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA (#${i + 1}): ${n} soggetti`); continue; }
    t = t.replace(da, a); rimessi.add(i);
  }
  return t;
};
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) t = applica(t, MODULO);
    corpo = Buffer.from(t + CASI, "utf8"); iniezioni++;
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA, e si rilegge dal server il
   contrassegno col proprio pid — la sola prova che chi risponde è mio. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · CONTROPROVA" : ""}`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
await pg.addInitScript(() => {
  window.__scaricati = [];
  /* ⛔ `revokeObjectURL` RESO INERTE. L'export dei costi fa
     `a.click(); URL.revokeObjectURL(a.href)` nella stessa riga: giustissimo
     nel prodotto (non si tiene in memoria un blob che non serve più), ma il
     banco legge il contenuto un istante DOPO, e trovava un URL già morto —
     `Failed to fetch`, eccezione non gestita, banco ucciso a metà. Qui il
     blob si lascia vivo: è l'ambiente di misura a doversi adattare al
     prodotto, non il contrario. */
  URL.revokeObjectURL = () => {};
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioni > 0, "il modulo servito porta i casi del banco", iniezioni);
if (CONTROPROVA) dice(rimessi.size === DIFETTI.length,
  `i ${DIFETTI.length} difetti sono stati rimessi davvero`, [...rimessi]);

const vaiA = async (navId, pageId) => {
  await pg.click("#" + navId).catch(() => {});
  await pg.waitForTimeout(500);
  const viva = await pg.evaluate((p) => {
    const el = document.getElementById(p);
    return !!el && getComputedStyle(el).display !== "none";
  }, pageId);
  dice(viva, `sono davvero sulla schermata ${pageId}`);
  return viva;
};
/* la terza gamba della domanda di casa — la FRASE DI RIEPILOGO contro il file —
   con la regola in `giro.mjs`, la stessa che usa il banco di Flotta. */
let fraseConNumero = 0, fraseSenzaNumero = 0, fraseMuta = 0, senzaPosto = 0;
const scarica = async (btn) => {
  await pg.evaluate(() => { window.__scaricati = []; });
  await azzeraFrasi(pg);
  await pg.click("#" + btn).catch(() => {});
  await pg.waitForTimeout(500);
  const g = await pg.evaluate(() => window.__scaricati);
  if (!g.length) return null;
  const href = g[g.length - 1].href;
  /* ⛔ E se il contenuto non si riesce a leggere si DICHIARA, non si muore: un
     banco che crolla stampa meno prove, e un totale più basso si legge come
     «ha guardato meno roba», non come «si è rotto». */
  let testo = null;
  try {
    testo = href.startsWith("blob:")
      ? await pg.evaluate((u) => fetch(u).then((r) => r.text()), href)
      : decodeURIComponent(href.slice(href.indexOf(",") + 1));
  } catch (e) {
    console.log(`  KO  non riesco a leggere il contenuto di ${g[g.length - 1].nome}: ${e.message}`);
    ko++; return null;
  }
  const righe = testo.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  const frase = await frasiVisibili(pg);
  const numeri = contiNellaFrase(frase);
  if (numeri.length) {
    fraseConNumero++;
    const dati = righeDiDato(righe);
    dice(numeri.includes(dati) || numeri.reduce((t, x) => t + x, 0) === dati,
      `le righe del file sono fra i numeri che la frase dichiara (${btn})`,
      { frase: frase.slice(0, 100), numeri, righeDiDato: dati });
  } else if (frase.trim()) fraseSenzaNumero++;
    else if (await postiDaFrase(pg) > 0) fraseMuta++;
    else senzaPosto++;
  return { nome: g[g.length - 1].nome, righe };
};
const colonna = (riga, i) => (riga.split(";")[i] || "").replace(/^"|"$/g, "").replace(/""/g, '"');
const soldi = (s) => Number(String(s).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));

console.log("\n════════ conti_incassi.csv ════════");
if (await vaiA("nav-rep", "page-rep")) {
  const f = await scarica("btn-inc-export");
  dice(!!f, "il file esce davvero");
  if (f) {
    const righe = f.righe.slice(1);
    dice(righe.length === 1, "c'è l'unico incasso del caso", righe.length);
    const r = righe[0] || "";
    const intest = f.righe[0].split(";");
    dice(intest.includes("note_di_credito"),
      "c'è la colonna delle note di credito: la differenza si vede, non si nasconde", intest);
    dice(soldi(colonna(r, 6)) === 200, "e porta i 200 € della nota", colonna(r, 6));
    dice(soldi(colonna(r, 5)) === 1000,
      "il totale fattura resta il LORDO, che è quello che il commercialista si aspetta", colonna(r, 5));

    /* ⛔ E il confronto che conta: il residuo del file contro quello che la
       SCHERMATA dice nello stesso istante. Niente numeri scritti qui dentro. */
    const aSchermo = await (async () => {
      await pg.click("#nav-fat").catch(() => {});
      await pg.waitForTimeout(600);
      return pg.evaluate(() => {
        const el = [...document.querySelectorAll("#fat-list .item, #fat-list .sitem")]
          .find((x) => (x.textContent || "").includes("2026/001"));
        return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
      });
    })();
    dice(/residuo|incassare/i.test(aSchermo), "lo schermo dichiara un residuo su questa fattura", aSchermo.slice(0, 160));
    const m = aSchermo.match(/(?:residuo|Da incassare)\s*€?\s*([\d.,]+)/i);
    const resSchermo = m ? soldi(m[1]) : null;
    dice(resSchermo !== null, "e lo si riesce a leggere", aSchermo.slice(0, 160));
    if (resSchermo !== null) {
      dice(soldi(colonna(r, 7)) === resSchermo,
        "il residuo del file è quello della RIGA (la nota di credito conta in tutt'e due)",
        { file: colonna(r, 7), riga: resSchermo });
    }
    /* ⛔ E UN TERZO TESTIMONE, CHE NON È NESSUNO DEI DUE. La controprova con
       tutt'e due i difetti rimessi ha mostrato la trappola: file e riga
       diventano **500 tutt'e due** — sbagliati insieme, e quindi d'accordo. È
       la regola di casa sull'andata e ritorno che resta verde quando le due
       metà sbagliano nello stesso modo. Il totale in fondo alla lista passa da
       `apertoDi(f, NOT)`, è note-aware da prima di oggi e nessuna iniezione lo
       tocca: è l'unico che può smentirli tutt'e due. */
    const totaleInFondo = await pg.evaluate(() => {
      const el = document.querySelector("#fat-tot, #fat-somma, .fat-tot");
      return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
    });
    dice(totaleInFondo !== "", "il totale in fondo alla lista si legge", totaleInFondo);
    /* ⚠️ NON si guarda il «totale» in cifre: col filtro «tutte» quel numero è
       il FATTURATO LORDO (1.000), non il residuo — la vista passa a `apertoDi`
       solo sui filtri del credito. Il pezzo note-aware di questo riquadro, e
       che nessuna delle due iniezioni tocca, è la riga che DICHIARA la nota:
       «1 Nota di credito su queste fatture − € 200,00». È quella il terzo
       testimone. */
    const m2 = totaleInFondo.match(/Nota di credito[^€]*€\s*([\d.]+,\d{2})/i);
    const notaInFondo = m2 ? soldi(m2[1]) : null;
    dice(notaInFondo !== null, "e dichiara la nota di credito", totaleInFondo.slice(0, 120));
    if (notaInFondo !== null) {
      dice(soldi(colonna(r, 6)) === notaInFondo,
        "la nota del file è quella che il riquadro in fondo dichiara — e questo testimone non è nessuno dei due che potrebbero sbagliare insieme",
        { file: colonna(r, 6), inFondo: notaInFondo });
    }
  }
}

console.log("\n════════ conti_listino_prezzi.csv ════════");
if (await vaiA("nav-lis", "page-lis")) {
  const f = await scarica("btn-lis-prezzi");
  dice(!!f, "il file esce davvero");
  if (f) {
    const r = (t) => f.righe.slice(1).find((x) => colonna(x, 0).includes(t)) || "";
    /* ⚠️ `Number`, non `soldi`: questa cella porta un numero GREZZO col punto
       decimale (`8.5`), non un importo formattato all'italiana. Il primo
       righello ci ha applicato `soldi`, che toglie i punti credendoli
       separatori di migliaia, e ha letto 85 accusando un valore giusto. */
    dice(Number(colonna(r("Misto cava"), 1)) === 8.5, "un prezzo scritto esce com'è", colonna(r("Misto cava"), 1));
    dice(colonna(r("non classificato"), 1) === "",
      "un prodotto SENZA prezzo lascia la cella vuota: uno zero in un listino vuol dire GRATIS",
      colonna(r("non classificato"), 1));
  }
}

console.log("\n════════ conti_costi_<periodo>.csv ════════");
if (await vaiA("nav-cos", "page-cos")) {
  const f = await scarica("btn-cos-export");
  dice(!!f, "il file esce davvero");
  if (f) {
    const righe = f.righe.slice(1);
    /* ⛔ E QUESTA PROVA BENEDICEVA IL SILENZIO. Fino all'09/08 diceva «nel file
       c'è la SOLA voce che ha un importo» — cioè pretendeva esattamente il
       difetto: `riepilogoCosti` scartava a monte le voci senza importo, e il
       file usciva senza di loro **senza dirlo**. Il commento che stava qui lo
       aveva perfino scritto («la domanda vera è un'altra, da aprire a parte»),
       e intanto l'asserzione la teneva chiusa.
       Adesso la voce senza importo ESCE, marcata, con la sua cella vuota. La
       prova è più GIUSTA, non più permissiva: si pretende che ci sia **e** che
       non porti un numero inventato. */
    dice(righe.length === 2,
      "nel file ci sono tutt'e due le voci: quella con l'importo e quella senza, marcata", righe.length);
    const conImporto = righe.filter((x) => colonna(x, 3).trim());
    const senza = righe.filter((x) => !colonna(x, 3).trim());
    dice(conImporto.length === 1 && Number(colonna(conImporto[0], 3)) === 1200,
      "l'importo scritto esce com'è", conImporto.map((x) => colonna(x, 3)));
    dice(senza.length === 1 && /senza importo/i.test(senza[0]),
      "e la voce senza importo dichiara PERCHÉ è fuori dal totale, invece di sparire", senza);
    dice(!righe.some((x) => colonna(x, 3) === "0"),
      "nessuna riga porta uno ZERO al posto di un importo mai scritto");
  }
}

/* ═══════════ pesate/DDT e preventivi ═══════════
   ⛔ QUI CI SI ASPETTA DI NON TROVARE NIENTE, ed è per questo che si aprono.
   Tutt'e due sono stati LETTI riga per riga e risultano curati — il DDT legge
   la bandiera con `valoreDdt`, i preventivi lasciano vuote la quantità e le
   due metà dello sconto — ma un negativo DEDOTTO non vale niente: su cinque
   app il censimento statico su questa stessa domanda aveva dato zero mentre i
   difetti c'erano. Aprirli li porta dal «letto» al «misurato».
   Le domande sono le due in cui questa famiglia si manifesta nei file: nessuna
   cella che dica «undefined», «null» o «NaN» — le tre firme di un dato
   mancante scritto come se fosse un valore — e, sul DDT, che un valore in euro
   non compaia accanto a una quantità sconosciuta. */
for (const [nome, nav, pagina, bottone] of [
  ["conti_pesate_ddt.csv", "nav-pes", "page-pes", "btn-pes-export"],
  ["conti_preventivi.csv", "nav-ord", "page-ord", "btn-or-export"],
  /* i sei che delegano a una funzione del modulo, più le tre copie di backup.
     Il valore aggiunto qui è minore — la decisione la prende il modulo, che le
     prove `node` già chiamano — ma è MISURA, non deduzione: si preme il
     bottone e si apre il file, che è l'unico modo in cui questa famiglia si
     lascia prendere. Con questi il censimento di Conti è 12 su 12. */
  ["conti_situazione_fatture.csv", "nav-rep", "page-rep", "btn-rep-export"],
  ["conti_incassi_copia.csv", "nav-rep", "page-rep", "btn-inc-backup"],
  ["conti_clienti.csv", "nav-cli", "page-cli", "btn-cli-export"],
  ["conti_clienti_copia.csv", "nav-cli", "page-cli", "btn-cli-backup"],
  ["conti_pesate_copia.csv", "nav-pes", "page-pes", "btn-pes-backup"],
  ["conti_listino.csv", "nav-lis", "page-lis", "btn-lis-export"],
  ["conti_gare.csv", "nav-gar", "page-gar", "btn-gar-export"],
]) {
  console.log(`\n════════ ${nome} ════════`);
  if (!(await vaiA(nav, pagina))) continue;
  const f = await scarica(bottone);
  dice(!!f, "il file esce davvero");
  if (!f) continue;
  dice(f.righe.length >= 2, "e non è la sola intestazione", f.righe.length);
  const testo = f.righe.join("\n");
  dice(!/(^|;)"?(undefined|null|NaN)"?(;|$)/m.test(testo),
    "nessuna cella dice «undefined», «null» o «NaN»",
    f.righe.find((r) => /(^|;)"?(undefined|null|NaN)"?(;|$)/.test(r)));
  dice(!/\bundefined\b/.test(testo), "e nemmeno dentro una frase composta");
}

await b.close(); srv.close();
/* le due cause opposte del silenzio, separate: vedi il banco di Flotta */
console.log(`  ·  frasi di riepilogo confrontate col file: ${fraseConNumero}`
  + ` · MOSTRATE ma senza un conto: ${fraseSenzaNumero}`
  + ` · il posto per dirla c'è e resta MUTO: ${fraseMuta}`
  + ` · nessun posto per dirla (sarebbe il righello): ${senzaPosto}`);
console.log(`\nRisultato documenti che escono da Conti: ${ok} passati, ${ko} falliti`
  + `  ·  12 punti d'uscita su 12 aperti`);
if (CONTROPROVA) {
  console.log(ko > 0 ? "✔ CONTROPROVA: il banco distingue (i KO qui sopra sono voluti)"
                     : "⛔ CONTROPROVA: NON DISTINGUE — rimesso il difetto, nessuna prova è caduta");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

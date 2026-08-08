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

   ⚠️ IL CENSIMENTO È DICHIARATO: questo banco apre **un** punto d'uscita su
   dodici. Gli altri undici qui NON sono misurati — «uno su dodici» non vuol
   dire «gli altri vanno bene». I cinque che compongono in pagina e restano da
   aprire sono: clienti, costi, listino prezzi, pesate/DDT, preventivi.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
  // 1 · il CSV degli incassi che ignora le note di credito
  ["      const st = statoFattura(r.f, INC, NOT);",
   "      const st = { esigibile: round2(importiFattura(r.f).totale), stornato: 0 };"],
  /* 2 · e la RIGA della lista che leggeva `f.residuo` dal record. Dieci spazi
     d'indentazione: la stessa chiamata esiste anche nel foglio stampato
     (riga 4388, quattro spazi), e i soggetti devono restare uno. */
  ["          const st = statoFattura(f, INC, NOT);",
   "          const st = { stato: f.incassata ? \"saldata\" : \"aperta\", saldata: !!f.incassata,\n            parziale: !!f.parziale, residuo: +f.residuo || 0, stornato: 0 };"],
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
}
`;

let iniezioni = 0;
const rimessi = new Set();
const applica = (t) => {
  for (const [i, [da, a]] of DIFETTI.entries()) {
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
  if (p.endsWith(MODULO)) { corpo = Buffer.from(corpo.toString("utf8") + CASI, "utf8"); iniezioni++; }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8")), "utf8");
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
const scarica = async (btn) => {
  await pg.evaluate(() => { window.__scaricati = []; });
  await pg.click("#" + btn).catch(() => {});
  await pg.waitForTimeout(500);
  const g = await pg.evaluate(() => window.__scaricati);
  if (!g.length) return null;
  const href = g[g.length - 1].href;
  const testo = href.startsWith("blob:")
    ? await pg.evaluate((u) => fetch(u).then((r) => r.text()), href)
    : decodeURIComponent(href.slice(href.indexOf(",") + 1));
  return { nome: g[g.length - 1].nome, righe: testo.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean) };
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

await b.close(); srv.close();
console.log(`\nRisultato documenti che escono da Conti: ${ok} passati, ${ko} falliti`
  + `  ·  1 punto d'uscita su 12 aperto (gli altri undici NON sono misurati qui)`);
if (CONTROPROVA) {
  console.log(ko > 0 ? "✔ CONTROPROVA: il banco distingue (i KO qui sopra sono voluti)"
                     : "⛔ CONTROPROVA: NON DISTINGUE — rimesso il difetto, nessuna prova è caduta");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

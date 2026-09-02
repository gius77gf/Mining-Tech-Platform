/* FLOTTA: I NUMERI TRANQUILLI CHE ESCONO DALL'APP
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-numeri-tranquilli.mjs [--porta=8560]
     node flotta-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Sei app su otto avevano il loro banco «numeri tranquilli»
   — Conti, Terra, Sentinella, Campo, Scudo, Genesi — e Flotta no. Non è una
   dimenticanza qualsiasi: è la regola di questa settimana applicata a sé
   stessa, «un numero è sorvegliato solo dove il controllo ARRIVA», e
   l'elenco di dove arriva va guardato quanto il numero. Il comando che lo
   dice, e la sua uscita del 13/08:
       ls apps/deepwork-id/tests/browser/ | grep numeri-tranquilli
       campo · conti · genesi · scudo · sentinella · terra      (Flotta: niente)

   ⚠️ E LA PRIMA COSA MISURATA È STATA CHE IL MODULO NON HA DIFETTI. Ventotto
   chiamate a `flotta-data.js` con l'ASSENZA al posto del dato (`null`, «», il
   campo mai compilato) non hanno prodotto un solo numero inventato: ogni zero
   tranquillo che è uscito era una decisione scritta e motivata nel file
   («la giacenza che manca vale zero: un ricambio senza quantità è un ricambio
   che non c'è»). I due difetti stavano dove le prove `node` non arrivano:
   nella PAGINA, dove il documento si compone. È la stessa famiglia di
   `flotta-documenti-che-escono`, e la ragione è la stessa — le prove chiamano
   il modulo, le righe le compone la pagina.

   CHE COSA HA TROVATO, il 13/08 — due difetti, e tutti e due sono la
   **quarta o quinta copia di una regola già scritta nello stesso file**:

   1 · «QUANTO COSTA UN'ORA»: LA RIGA CHE SI SPEZZAVA IN DUE «MA».
       La riga del mezzo di cui il costo orario non si può calcolare si
       componeva incollando il totale davanti al perché con un «, ma » e
       l'iniziale abbassata. Funziona per quattro dei cinque `perche` che
       `costoOrarioMezzo` sa dire; il quinto — quello del mezzo che HA le ore
       e non ha spesa dentro la finestra — è già fatto di due parti e la sua
       «ma» ce l'ha dentro. Misurato aprendo la pagina:
         «€ 300,00 spesi, ma le ore lavorate si sanno, ma nessuna delle spese
          che cadono in questo periodo porta il suo importo: …»
       Due «ma» in una frase, e per chi legge una contraddizione: i 300 € ci
       sono o no? (Ci sono, e cadono fuori dal periodo coperto dal contatore.)
       La PAGELLA, ottocento righe più in basso, sullo stesso mezzo e con lo
       stesso `perche`, scriveva già la forma giusta. Una regola scritta due
       volte, e la copia debole è quella sulla lista dei soldi.
       ⚠️ Il caso entra da un tocco vero: due pieni sullo stesso mezzo col
       contatore, e il campo della spesa lasciato vuoto sul secondo.

   2 · «€ 0,00» SU UNA SPESA CHE NESSUNO HA SCRITTO.
       Nella lista dei costi la pastiglia era `eur(c.importo)`, e `eur(null)`
       fa «€ 0,00» — una spesa misurata a zero, sulla schermata dei soldi. La
       stessa decisione era già presa TRE volte nello stesso file (il registro
       interventi la pastiglia non la disegna, il libretto scrive «costo non
       scritto», il CSV degli interventi lascia la cella vuota), e la quarta
       mancava — insieme al CSV dei costi, che scriveva `0`, e alle due
       finestre di conferma.
       ⚠️ ONESTÀ SU DA DOVE NASCE UNA VOCE COSÌ: dai form di Flotta non nasce.
       Il comando e la sua uscita:
         grep -n "parseCostiCsv" apps/flotta/flotta-data.js   →  (niente)
       «Registra spesa» pretende un importo maggiore di zero, e la voce
       «Carburante» che nasce da un rifornimento si crea solo `if (v.euro>0)`.
       È il record scritto altrove o prima — la stessa specie di `m6` senza
       `tipo` e `n1` senza `stato`, che la dimostrazione porta apposta. Non si
       finge che sia un tocco: si dice che cos'è.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DOCUMENTO: si scrivono in coda
   alla risposta HTTP di `flotta-data.js`, cioè si passa dalla via vera. Il
   file su disco non si tocca mai. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8560;
const MODULO = "apps/flotta/flotta-data.js";
const PAGINA = "apps/flotta/index.html";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL PARCO DEL BANCO: due macchine, e servono tutte e due. Se ci fosse solo
   quella muta, il modo più facile di far passare le prove sarebbe spegnere
   ogni numero — l'errore opposto e altrettanto grave.
   · «Omega Nota» ha il contatore e due pieni, il secondo SENZA il prezzo: è
     il caso 1, e nasce da un tocco (il campo della spesa si può lasciare
     vuoto).
   · «Zeta Muta» non ha il contaore e non ha spesa: serve a provare che
     l'app non le inventa né le ore né gli euro. */
const CASI = `
DEMO.mezzi = [
  { id: "zz1", nome: "Zeta Muta — senza contaore", ore: null, area: "", stato: "operativo", tipo: "pala" },
  { id: "zz2", nome: "Omega Nota — con contaore", ore: 1000, area: "piazzale", stato: "operativo", tipo: "dumper" },
];
DEMO.rifornimenti = [
  { id: "zr1", mezzo: "Zeta Muta", data: "2026-08-01", litri: 100, euro: null, ore: null },
  { id: "zr2", mezzo: "Omega Nota", data: "2026-08-01", litri: 200, euro: 300, ore: 900 },
  { id: "zr3", mezzo: "Omega Nota", data: "2026-08-08", litri: 180, euro: null, ore: 1000 },
];
DEMO.manutenzioni = [
  { id: "zn1", titolo: "Tagliando senza costo", mezzo: "Zeta Muta", dataPrevista: "2026-08-01",
    stato: "fatto", manodopera: [], ricambiUsati: [], altreSpese: null, noteLavoro: "" },
];
DEMO.fermi = [
  { id: "zf2", mezzo: "Omega Nota", causale: "manutenzione", inizio: "2026-08-05", fine: "2026-08-06", note: "" },
];
DEMO.controlli = [];
DEMO.ricambi = [
  { id: "zp2", nome: "Pezzo contato", giacenza: 10, sogliaMin: 3, prezzo: 25, unita: "pz" },
];
DEMO.costi = [
  { id: "zc1", data: "2026-08-01", mezzo: "Zeta Muta", voce: "Gomme", importo: null, nota: "la fattura non è ancora arrivata" },
  { id: "zc2", data: "2026-08-02", mezzo: "Omega Nota", voce: "Officina", importo: 500, nota: "" },
];
DEMO.interventi = [
  { id: "zi1", mezzo: "Zeta Muta", titolo: "Riparazione chiusa senza costo", data: "2026-08-03",
    stato: "fatto", costo: null, oreManodopera: null },
];
`;

/* I DIFETTI DA RIMETTERE: le righe VERE che la pagina aveva, non caricature. */
const DIFETTI = [
  // 1 · il totale incollato al perché con «, ma » e l'iniziale abbassata
  [`          <div class="meta">\${eur(m.totale)} spesi</div>
          <div class="meta norma">\${esc(m.perche.charAt(0).toUpperCase() + m.perche.slice(1))}</div></div>`,
   `          <div class="meta">\${eur(m.totale)} spesi, ma \${esc(m.perche.charAt(0).toLowerCase() + m.perche.slice(1))}</div></div>`],
  // 2 · la pastiglia dell'importo che faceva «€ 0,00» su una spesa mai scritta
  /* ⚠️ AGGIORNATA IL 02/09: il ponte con Conti ha messo davanti all'importo il
     contrassegno «anche in Conti», e l'iniezione non trovava più il suo pezzo
     (l'ha detto `iniezioni-fresche`, non il giro). Il difetto rimesso è lo
     stesso: la pastiglia torna a scrivere «€ 0,00» su una spesa mai scritta. */
  [`: ""}\${numeroDichiarato(c.importo) == null
        ? \`<span class="badge">importo non scritto</span>\`
        : \`<span class="badge accent euro">\${eur(c.importo)}</span>\`}`,
   `: ""}<span class="badge accent euro">\${eur(c.importo)}</span>`],
];

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

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA, e poi si RILEGGE DAL SERVER
   il contrassegno col proprio pid. Un banco che riusa la porta di un altro
   non fallisce: misura la copia di qualcun altro. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · CONTROPROVA" : ""}`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x)).slice(0, 400)}` : ""}`); }
};

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2).join(" | "));
dice(iniezioni > 0, "il modulo servito porta i casi del banco", iniezioni);
if (CONTROPROVA) dice(rimessi.size === DIFETTI.length,
  `i ${DIFETTI.length} difetti sono stati rimessi davvero`, [...rimessi].join(","));

/* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che misura una
   schermata che non c'è risponde «tutto a posto». */
const vaiA = async (nav, pagina) => {
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(700);
  const viva = await pg.evaluate((p) => {
    const el = document.getElementById(p);
    return !!el && getComputedStyle(el).display !== "none";
  }, pagina);
  dice(viva, `sono davvero sulla schermata ${pagina}`);
  return viva;
};
const testoDi = (sel) => pg.evaluate((s) => {
  const el = document.querySelector(s);
  return el ? el.innerText.replace(/\s+/g, " ").trim() : "";
}, sel);

/* ⚠️ E LA PROVA CHE I CASI SONO ARRIVATI NELLO STATO, non solo nel file: la
   coda può essere servita e un `MEZ = [...]` più tardi buttarla via. Se
   l'iniezione non avesse preso, qui si leggerebbero i mezzi della
   dimostrazione («Escavatore E1», «Dumper D1»). */
if (await vaiA("nav-mez", "page-mez")) {
  const parco = await testoDi("#mez-list");
  dice(/Zeta Muta/.test(parco) && /Omega Nota/.test(parco),
    "il parco del banco ha SOSTITUITO la dimostrazione", parco.slice(0, 200));
  dice(!/Escavatore E1|Dumper D1/.test(parco),
    "e nessuna macchina della dimostrazione è rimasta in mezzo", parco.slice(0, 200));

  /* ⛔ CASO 1 · «quanto costa un'ora»: la riga non si spezza in due «ma». */
  const costoOra = await testoDi("#costo-ora");
  dice(/Omega Nota/.test(costoOra),
    "il mezzo senza costo orario è nella lista «quanto costa un'ora»", costoOra.slice(0, 200));
  const dueMa = (costoOra.match(/(^|[\s,])ma\s/g) || []).length;
  dice(dueMa <= 1, `la riga non incolla due «ma» nella stessa frase (${dueMa})`, costoOra);
  dice(!/spesi, ma /.test(costoOra),
    "il totale non è incollato al perché con un «, ma »", costoOra);
  dice(/€ 300,00 spesi/.test(costoOra),
    "il totale speso si legge ancora, per intero", costoOra);
  dice(/Le ore lavorate si sanno, ma nessuna delle spese/.test(costoOra),
    "e il perché è scritto come frase, con l'iniziale maiuscola", costoOra);

  /* ⛔ E IL MEZZO SENZA CONTAORE NON SI PRENDE UNO ZERO DI COMODO. */
  const parcoMuto = await pg.evaluate(() => {
    const it = [...document.querySelectorAll("#mez-list .item")]
      .find((e) => /Zeta Muta/.test(e.innerText || ""));
    return it ? it.innerText.replace(/\s+/g, " ").trim() : "";
  });
  dice(!!parcoMuto, "la riga del mezzo senza contaore c'è", parcoMuto);
  dice(!/\b0\s*ore motore\b/.test(parcoMuto),
    "il mezzo senza contaore non dichiara «0 ore motore»", parcoMuto);
}

/* ⛔ CASO 2 · la lista dei costi: nessun «€ 0,00» dove l'importo non c'è. */
if (await vaiA("nav-cos", "page-cos")) {
  const lista = await testoDi("#cos-list");
  dice(/Gomme/.test(lista) && /Officina/.test(lista),
    "le due voci di costo sono in lista", lista.slice(0, 200));
  dice(!/€\s*0,00/.test(lista),
    "nessuna riga scrive «€ 0,00» su una spesa che nessuno ha scritto", lista);
  /* ⚠️ IL RIGHELLO, NON IL SOGGETTO: la pastiglia è in maiuscolo per CSS
     (`text-transform`), e `innerText` restituisce quello che si VEDE — quindi
     «IMPORTO NON SCRITTO». La prima stesura cercava il minuscolo e accusava
     la pagina di tacere mentre la frase era stampata accanto al KO. */
  dice(/importo non scritto/i.test(lista),
    "e la riga senza importo lo DICE, invece di tacere", lista);
  dice(/€ 500,00/.test(lista),
    "la spesa vera continua a dire il suo numero", lista);
}

/* ⛔ E LE TRE FIRME DI UN DATO MANCANTE SCRITTO COME SE FOSSE UN VALORE, su
   tutte le schermate: un banco che guarda una riga sola risponde «tutto a
   posto» sul resto senza averlo guardato. */
const SCHERMATE = [["nav-dash", "page-dash"], ["nav-mez", "page-mez"], ["nav-giro", "page-giro"],
  ["nav-man", "page-man"], ["nav-cos", "page-cos"], ["nav-sca", "page-sca"]];
let guardate = 0;
for (const [nav, pagina] of SCHERMATE) {
  await pg.click("#" + nav).catch(() => {});
  await pg.waitForTimeout(600);
  const t = await pg.evaluate((p) => {
    const el = document.getElementById(p);
    return el && getComputedStyle(el).display !== "none" ? el.innerText : null;
  }, pagina);
  if (t === null) { console.log(`  · ${pagina}: NON HO GUARDATO (non si è aperta)`); continue; }
  guardate++;
  const male = (t.match(/\b(undefined|NaN|Infinity)\b/g) || []);
  dice(male.length === 0, `${pagina}: nessun «undefined», «NaN» o «Infinity» a schermo`,
    (t.split("\n").find((r) => /\b(undefined|NaN|Infinity)\b/.test(r)) || "").slice(0, 160));
}
dice(guardate === SCHERMATE.length,
  `tutte e ${SCHERMATE.length} le schermate si sono aperte davvero (${guardate})`);

console.log(`\nRisultato numeri tranquilli di Flotta${CONTROPROVA ? " · CONTROPROVA" : ""}: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

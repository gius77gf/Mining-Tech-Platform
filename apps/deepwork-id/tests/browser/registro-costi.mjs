/* IL REGISTRO COSTI DI CONTI, PROVATO TOCCANDO LA PAGINA.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node registro-costi.mjs [--porta=8479]
     node registro-costi.mjs --controprova   (rimette due difetti veri: DEVE fallire)

   PERCHÉ ESISTE. I conti stanno in `run-kpi.mjs` e reggono. Ma questa unità ha
   trovato allo SCATTO due cose che nessuna prova di `node` poteva vedere, e
   tutt'e due erano invisibili leggendo il codice:

   1. **La barra in basso è una GRIGLIA a colonne fisse** (`--nav-cols`). La
      voce «Costi» è la ottava, e il numero era rimasto a 7: la barra non si è
      stretta, è andata A CAPO — «REPORT» finito su una seconda riga, sotto le
      altre. Nessun errore, nessun test rosso, solo una barra sbagliata.
   2. **La tendina delle voci tagliava proprio l'avviso.** L'opzione diceva
      «Carburante — anche in Flotta» e su un telefono da 430 px si leggeva
      «Carburante — anch…»: la coda che si perdeva era l'unica parte che
      serviva. Il Listino aveva già imparato questa lezione sulle unità di
      prezzo, e l'abbiamo ripetuta uguale tre schede più in là.

   E poi le tre regole di condotta della schermata, che sono di prodotto:
   una voce fuori elenco NON diventa «spese generali»; un costo senza data non
   sparisce in silenzio da un periodo; il costo al metro cubo non si calcola
   senza i metri cubi — e quello che non si calcola resta un trattino, mai un
   numero basso che sembra una buona notizia. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
const R = "/home/user/Mining-Tech-Platform";

const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8479;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
let iniezioni = 0;
const rimetti = (testo, ancora, difetto) => {
  const n = testo.split(ancora).length - 1;
  if (n !== 1) { console.log(`⚠️ ancora trovata ${n} volte, non 1: «${ancora.slice(0, 40)}…»`); return testo; }
  iniezioni++;
  return testo.replace(ancora, difetto);
};
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: due difetti veri, rimessi nella RISPOSTA HTTP (mai nei file).
     Uno di struttura (la barra a capo), uno di sostanza (la voce sconosciuta
     che si traveste da spesa generale). */
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = rimetti(corpo.toString("utf8"), "--nav-cols:8;", "--nav-cols:7;");
    /* difetto 4: la provenienza che RESTA attaccata a un numero riscritto a
       mano. È la bugia peggiore della schermata — una misura dichiarata sopra
       un numero inventato — e non si vede: la frase è giusta, il numero è
       giusto, è il legame fra i due a non esserci più. */
    t = rimetti(t, "      volDaTerra = null; $(\"cos-terra\").innerHTML = \"\";\n      renderCosti(); }));",
                   "      renderCosti(); }));");
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("shared/dw-ponti.js")) {
    corpo = Buffer.from(rimetti(corpo.toString("utf8"),
      'return v ? v.gruppo : "non-classificata";', 'return v ? v.gruppo : "generali";'), "utf8");
  }
  /* difetto 3, sul ponte col volume: il cumulo contato come scavo nuovo. È lo
     sbaglio più facile da fare — `cavatoPeriodo` restituisce due numeri e
     sommarli sembra «prendere tutto» — e gonfia il denominatore, quindi il
     costo al metro cubo esce più BASSO del vero: la notizia che si vuole
     leggere: 178 m³ diventerebbero 200, e il costo unitario scenderebbe
     di circa un decimo senza che niente lo segnali. */
  if (CONTROPROVA && p.endsWith("apps/conti/conti-data.js")) {
    corpo = Buffer.from(rimetti(corpo.toString("utf8"),
      "return { ...base, m3: c.m3, usabile: true, motivo: \"\" };",
      "return { ...base, m3: c.m3 + c.cumuloM3, usabile: true, motivo: \"\" };"), "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));
const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html`);
await pg.waitForTimeout(2200);

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x)}` : ""}`); } };
/* IL BANCO DEVE FALLIRE, NON MORIRE: senza questo, la prima controprova che
   toglie un elemento uccide il processo e il totale non si legge più. */
const misura = async (fn, arg) => {
  try { return await pg.evaluate(fn, arg); }
  catch (e) { return { __rotto: String(e.message).split("\n")[0].slice(0, 110) }; }
};

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(!!(await pg.$("#nav-cos")), "la barra ha la voce Costi");
await pg.click("#nav-cos").catch(() => {});
await pg.waitForTimeout(700);

/* ── 1. LA BARRA STA SU UNA RIGA SOLA ────────────────────────────────────
   Si conta sul CENTRO verticale e con tolleranza: il bottone attivo è alzato
   di 2 px dalla trasformazione, e contarlo come riga a sé farebbe gridare al
   difetto su una barra sana. */
const righeBarra = () => misura(() => {
  const nav = document.querySelector(".nav");
  if (!nav) return { __rotto: "nessuna barra" };
  const bs = [...nav.querySelectorAll("button")];
  const centri = bs.map((x) => { const r = x.getBoundingClientRect(); return r.top + r.height / 2; });
  const righe = centri.reduce((a, c) => (a.some((v) => Math.abs(v - c) < 6) ? a : a.concat(c)), []).length;
  return { voci: bs.length, righe, colonne: getComputedStyle(nav).gridTemplateColumns.split(" ").length,
           trabocca: nav.scrollWidth > nav.clientWidth + 1 };
});
const barra430 = await righeBarra();
dice(!!barra430 && barra430.righe === 1, "⛔ la barra sta su UNA riga a 430 px", barra430);
dice(!!barra430 && barra430.colonne === barra430.voci,
  "e le colonne della griglia sono quante le voci", barra430);
dice(!!barra430 && barra430.trabocca === false, "e non trabocca", barra430);
await pg.setViewportSize({ width: 360, height: 950 });
await pg.waitForTimeout(400);
const barra360 = await righeBarra();
dice(!!barra360 && barra360.righe === 1, "⛔ e resta su una riga anche a 360 px", barra360);
await pg.setViewportSize({ width: 430, height: 950 });
await pg.waitForTimeout(400);

/* ── 2. IL TOTALE E L'ELENCO DICONO LO STESSO NUMERO ─────────────────────
   Un cartellone che non torna con le righe che ha sotto è peggio di un
   cartellone assente: sembra un errore di chi legge, non del programma. */
const soldi = (t) => Number(String(t || "").replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
const conti = await misura(() => {
  const num = (document.querySelector("#cos-riep .cassa-num") || {}).textContent || "";
  const righe = [...document.querySelectorAll("#cos-list .item")]
    .map((x) => ({ testo: (x.querySelector(".amt-n") || {}).textContent || "",
                   senzaData: /senza data/.test(x.textContent) }));
  const gruppi = [...document.querySelectorAll("#cos-gruppi .item")]
    .map((x) => ({ nome: (x.querySelector(".name") || {}).textContent || "",
                   val: (x.querySelector(".amt-n") || {}).textContent || "" }));
  return { num, righe, gruppi, tot: (document.querySelector("#cos-gruppi .tot-n") || {}).textContent || "" };
});
const sommaRighe = (conti.righe || []).filter((x) => !x.senzaData).reduce((t, x) => t + soldi(x.testo), 0);
dice(Math.abs(soldi(conti.num) - sommaRighe) < 0.01,
  "⛔ il totale del periodo è la somma delle righe che mostra", { num: conti.num, sommaRighe });
dice(Math.abs(soldi(conti.tot) - soldi(conti.num)) < 0.01,
  "e il totale sotto la ripartizione è lo stesso", { tot: conti.tot, num: conti.num });
const sommaGruppi = (conti.gruppi || []).reduce((t, x) => t + soldi(x.val), 0);
dice(Math.abs(sommaGruppi - soldi(conti.num)) < 0.01,
  "e i gruppi sommano al totale, senza pezzi persi", { sommaGruppi, num: conti.num });

/* ── 3. UNA VOCE FUORI ELENCO NON DIVENTA «SPESE GENERALI» ───────────────
   È la forma esatta dell'assenza travestita: il costo entrerebbe nei totali
   sotto un'etichetta che nessuno ha scelto, e sparirebbe dalla domanda a cui
   serve la ripartizione — DOVE si spende. */
const nomiGruppi = (conti.gruppi || []).map((x) => x.nome);
dice(nomiGruppi.some((n) => /non classificate/i.test(n)),
  "⛔ la voce fuori elenco ha un gruppo suo, «Voci non classificate»", nomiGruppi);
const generali = (conti.gruppi || []).find((x) => /spese generali/i.test(x.nome));
dice(!!generali && soldi(generali.val) === 88,
  "e le spese generali restano quelle vere, senza l'intrusa", generali);
const nota = await misura(() => {
  const n = [...document.querySelectorAll("#cos-riep .note")].map((x) => x.textContent).join(" ");
  return { testo: n.replace(/\s+/g, " ").trim() };
});
dice(!!nota && /non è nell'elenco/.test(nota.testo || ""),
  "e la nota lo dice a parole", nota && (nota.testo || "").slice(0, 120));
/* La nota diceva che le voci non classificate «non entrano nella ripartizione
   per gruppo» mentre il loro gruppo era lì sotto, visibile. Un testo che
   contraddice il riquadro che ha accanto è peggio di nessun testo. */
dice(!!nota && !/non\b[^.]{0,40}nella ripartizione/.test(nota.testo || ""),
  "e non contraddice la ripartizione che ha sotto", nota && (nota.testo || "").slice(0, 160));

/* ── 4. IL COSTO SENZA DATA NON SPARISCE IN SILENZIO ─────────────────────*/
const fuori = await misura(() => {
  const righe = [...document.querySelectorAll("#cos-list .item")]
    .filter((x) => /senza data/.test(x.textContent));
  const testo = (document.getElementById("cos-list") || {}).textContent || "";
  const cart = (document.querySelector("#cos-riep .cassa-txt") || {}).textContent || "";
  return { quante: righe.length, spiegato: /non ha una data|non hanno una data/.test(testo),
    dichiarato: /senza data/.test(cart), cart: cart.replace(/\s+/g, " ").trim(),
    /* «1 Questa voce non ha una data» era il numero di `plur` incollato a una
       frase che non lo voleva: un difetto piccolo che si legge subito. */
    numeroIncollato: /\d+\s+Quest[ae]/.test(testo) };
});
dice(!!fuori && fuori.quante >= 1, "⛔ la voce senza data resta VISIBILE nel registro", fuori);
dice(!!fuori && fuori.dichiarato === true, "e il cartellone dichiara che è fuori dal totale", fuori && fuori.cart);
dice(!!fuori && fuori.spiegato === true, "e spiega cosa fare perché rientri", fuori);
dice(!!fuori && fuori.numeroIncollato === false, "senza numeri incollati alla frase", fuori);

/* ── 5. IL COSTO AL METRO CUBO SENZA I METRI CUBI ────────────────────────
   Il travestimento qui sarebbe un numero BASSO, cioè la notizia che chi
   guarda vuole leggere. Deve restare un trattino, con la ragione scritta. */
const m3vuoto = await misura(() => {
  const n = (document.querySelector("#cos-m3 .cassa-num") || {}).textContent || "";
  const t = (document.getElementById("cos-m3") || {}).textContent || "";
  return { num: n.trim(), cifre: /\d/.test(n), motivo: /Serve il volume/.test(t),
           testo: t.replace(/\s+/g, " ").trim().slice(0, 160) };
});
dice(!!m3vuoto && m3vuoto.cifre === false,
  "⛔ senza volume il costo al metro cubo NON è un numero", m3vuoto);
dice(!!m3vuoto && m3vuoto.motivo === true, "e la ragione è scritta", m3vuoto && m3vuoto.testo);

await pg.fill("#cos-vol", "178");
await pg.waitForTimeout(500);
const m3pieno = await misura(() => {
  const n = (document.querySelector("#cos-m3 .cassa-num") || {}).textContent || "";
  const u = document.querySelector("#cos-m3 .cassa-num .u");
  return { num: n.trim(), unita: u ? u.textContent : null,
    /* l'unità non va mai in maiuscolo: qui si legge la trasformazione
       EFFETTIVA, non il testo scritto nel sorgente */
    maiuscola: u ? getComputedStyle(u).textTransform === "uppercase" : false };
});
dice(!!m3pieno && /^\u20ac\s?\d+,\d{2}$/.test((m3pieno.num || "").replace("/m³", "").trim()),
  "col volume il conto esce, e ha due decimali come una cifra in euro", m3pieno);
dice(!!m3pieno && /m³/.test(m3pieno.unita || "") && m3pieno.maiuscola === false,
  "e l'unità è al suo posto, minuscola", m3pieno);

/* ── 6. LA TENDINA NON TAGLIA QUELLO CHE SERVE ───────────────────────────*/
const tendina = await misura(() => {
  const s = document.getElementById("co-voce");
  if (!s) return { __rotto: "nessuna tendina delle voci" };
  const cs = getComputedStyle(s);
  const sonda = document.createElement("span");
  sonda.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${cs.font};letter-spacing:${cs.letterSpacing}`;
  document.body.appendChild(sonda);
  // lo spazio vero per il testo: larghezza meno i bordi, i rientri e la freccia
  const utile = s.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 18;
  const troppo = [...s.options].filter((o) => { sonda.textContent = o.text;
    return sonda.getBoundingClientRect().width > utile; }).map((o) => o.text);
  sonda.remove();
  return { opzioni: s.options.length, gruppi: s.querySelectorAll("optgroup").length, utile: Math.round(utile), troppo };
});
dice(!!tendina && tendina.opzioni === 10, "la tendina ha tutte e dieci le voci", tendina);
dice(!!tendina && tendina.gruppi >= 4, "raggruppate, non in fila", tendina);
dice(!!tendina && (tendina.troppo || []).length === 0,
  "⛔ e nessuna etichetta viene tagliata a 430 px", tendina);

/* ── 7. L'AVVISO SULLE VOCI CHE FLOTTA REGISTRA GIÀ ──────────────────────
   Senza, la stessa spesa finisce nei totali di due app e nessuno se ne
   accorge: il costo al metro cubo esce più alto del vero. */
await pg.selectOption("#co-voce", "carburante").catch(() => {});
await pg.waitForTimeout(300);
const av1 = await misura(() => ({ t: (document.getElementById("co-avviso") || {}).textContent || "" }));
dice(!!av1 && /Flotta/.test(av1.t || ""), "⛔ scegliendo «Carburante» l'avviso su Flotta compare", av1 && (av1.t || "").slice(0, 90));
await pg.selectOption("#co-voce", "personale").catch(() => {});
await pg.waitForTimeout(300);
const av2 = await misura(() => ({ t: (document.getElementById("co-avviso") || {}).textContent.trim() }));
dice(!!av2 && av2.t === "", "e su «Personale», che Flotta non registra, tace", av2);

/* ── 8. REGISTRARE: la data è chiesta, e l'errore INSEGNA ────────────────*/
await pg.fill("#co-data", "");
await pg.fill("#co-imp", "100");
await pg.click("#btn-cos").catch(() => {});
await pg.waitForTimeout(400);
const senzaData = await misura(() => ({ msg: (document.getElementById("err-co-data") || {}).textContent || "" }));
dice(/nessun periodo|resta fuori/.test(senzaData.msg || ""),
  "senza data il costo non si registra, e il messaggio dice perché", senzaData);

const prima = Number((await pg.textContent("#cos-cnt")) || 0);
/* ⚠️ Il totale di PRIMA si legge dallo schermo, non si scrive a mano. La prima
   versione confrontava con «1702 + 1250,50», cioè col totale dei dati d'esempio
   del giorno in cui è stata scritta: bastava rendere ricorrenti i costi della
   dimostrazione — cosa che serviva al prodotto — e la prova cadeva accusando
   un difetto che non c'era. Una prova legata a un letterale invecchia come la
   data della sonda del vuoto. */
const totalePrima = soldi(await pg.textContent("#cos-riep .cassa-num"));
await pg.fill("#co-data", "2026-07-30");
await pg.fill("#co-imp", "1.250,50");
await pg.fill("#co-nota", "Prova del banco");
await pg.click("#btn-cos").catch(() => {});
await pg.waitForTimeout(700);
const dopo = await misura(() => ({ conto: Number(document.getElementById("cos-cnt").textContent),
  esito: (document.getElementById("cos-esito") || {}).textContent || "",
  num: (document.querySelector("#cos-riep .cassa-num") || {}).textContent || "" }));
dice(dopo.conto === prima + 1, "un costo registrato entra subito nel conto", { prima, dopo: dopo.conto });
dice(/1\.250,50/.test(dopo.esito || ""), "e l'esito ripete l'importo letto, in italiano", dopo && dopo.esito);
dice(Math.abs(soldi(dopo.num) - (totalePrima + 1250.5)) < 0.01,
  "e il totale sale ESATTAMENTE di quell'importo", { prima: totalePrima, dopo: dopo && dopo.num });
dice(errori.length === 0, "e nessun errore in pagina alla fine", errori.slice(0, 2));

/* ── 9. IL DENOMINATORE PRESO DA TERRA, E LA SUA PROVENIENZA ─────────────
   Chiedere i metri cubi a mano voleva dire, in pratica, che il costo al metro
   cubo non lo calcolava nessuno. Ma un numero preso da un'altra app senza
   dire da dove viene è peggio che chiederlo: non è controllabile. */
await pg.fill("#cos-vol", "");
await pg.waitForTimeout(300);
await pg.click("#btn-cos-terra").catch(() => {});
await pg.waitForTimeout(1200);
const terra = await misura(() => ({
  campo: (document.getElementById("cos-vol") || {}).value || "",
  num: (document.querySelector("#cos-m3 .cassa-num") || {}).textContent || "",
  totale: (document.querySelector("#cos-riep .cassa-num") || {}).textContent || "",
  testo: (document.getElementById("cos-m3") || {}).textContent.replace(/\s+/g, " ").trim(),
}));
dice(/^178/.test(terra.campo || ""),
  "⛔ il volume arriva da Terra: 178 m³, non i 200 col cumulo dentro", terra);
/* ⚠️ Il costo unitario NON si confronta con una cifra scritta a mano qui: il
   banco stesso, poche righe più su, ha registrato un costo di prova, quindi il
   totale non è più quello dei dati d'esempio. La prima versione pretendeva
   «9,56» e falliva accusando il prodotto di un difetto che era suo. Si prende
   il totale DALLO SCHERMO e si controlla la divisione. */
dice(Math.abs(soldi(terra.num) - soldi(terra.totale) / 178) < 0.02,
  "e il costo al metro cubo è quel totale diviso quei 178 m³",
  { unitario: terra.num, totale: terra.totale, atteso: soldi(terra.totale) / 178 });
dice(/misurati da 4 rilievi/.test(terra.testo || ""),
  "⛔ e porta con sé la provenienza: quanti rilievi", terra && (terra.testo || "").slice(-300));
dice(/28\/02\/2026 al 28\/07\/2026/.test(terra.testo || ""),
  "e che intervallo coprono davvero", terra && (terra.testo || "").slice(-300));
dice(/Restano fuori 22,00 m³/.test(terra.testo || ""),
  "⛔ e che il cumulo è rimasto FUORI, dichiarato", terra && (terra.testo || "").slice(-300));
dice(/più alto del vero/.test(terra.testo || ""),
  "⛔ e avvisa che una spesa fuori intervallo alza il costo unitario", terra && (terra.testo || "").slice(-300));

/* E se il volume lo riscrive una persona, la provenienza NON vale più: una
   misura dichiarata sopra un numero inventato è la bugia peggiore possibile,
   perché la frase è giusta, il numero è giusto, e a mancare è il legame. */
await pg.fill("#cos-vol", "200");
await pg.waitForTimeout(600);
const aMano = await misura(() => ({
  testo: (document.getElementById("cos-m3") || {}).textContent.replace(/\s+/g, " ").trim() }));
dice(!/misurati da/.test(aMano.testo || ""),
  "⛔ riscritto a mano, il numero NON dice più di essere misurato da Terra", aMano && (aMano.testo || "").slice(-260));
dice(/l'hai scritto tu/.test(aMano.testo || ""),
  "e dice invece che l'ha scritto una persona", aMano && (aMano.testo || "").slice(-260));
dice(errori.length === 0, "e nessun errore in pagina dopo il ponte", errori.slice(0, 2));

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} sostituzioni nella risposta HTTP`);
  if (iniezioni !== 4) { console.log("⚠️ INIEZIONI MANCANTI: la controprova non prova niente"); process.exit(3); }
  console.log(ko >= 5 ? "✓ il banco SA fallire: barra a capo, voce ignota travestita, cumulo contato come scavo, provenienza appiccicata a un numero a mano"
                      : "⚠️ troppo poche cadute");
  process.exit(ko >= 5 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

/* I NUMERI DI CONTI CHE MENTONO CON LA FACCIA TRANQUILLA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-numeri-tranquilli.mjs [--porta=9611]
     node conti-numeri-tranquilli.mjs --controprova   (rimette il difetto: DEVE fallire)
     node conti-numeri-tranquilli.mjs --scatti        (salva le schermate in /tmp)

   PERCHÉ ESISTE, E CHE COSA NON COPRIVA NESSUNO. Conti aveva già due banchi
   sui numeri: `conti-barre-peso.mjs` misura in pixel le quattro barre
   `span.bar` sotto le righe delle liste del Report, e `conti-documenti-che-
   escono.mjs` confronta i dodici file che escono con quello che dice lo
   schermo. Restava fuori tutto quello che disegna `shared/dw-grafici.js`:
   Conti lo chiama in **otto** punti (`graf-flusso` a linea, `graf-aging`,
   `graf-prev`, `graf-vend`, `graf-cos`, `graf-ric` a barre, `graf-espo-N` e
   `ord-barra` ad avanzamento) e nessun banco ne aveva mai misurato i PIXEL
   contro i valori dichiarati. `graf-scala.mjs` guarda quei grafici, ma
   un'altra domanda: la scala del disegno, non le sue quantità.

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO — «Venduto per prodotto».
   `valorePesata` risponde **0** quando il valore di un DDT non si può
   calcolare (venduto a metro cubo, prodotto senza densità, quantità non
   scritta): è una scelta dichiarata nel modulo, perché un `null` dentro una
   somma si sommerebbe come zero comunque e in silenzio. La conseguenza è che
   **chi somma deve anche contare quello che ha saltato**, e la pagina lo fa
   già in due punti su tre:
     · il totale del registro Pesate scrive «⚠ N consegne non sono
       valorizzabili e non entrano in questo totale: il valore è per difetto»;
     · «Consegnato da fatturare» scrive «· N non valorizzabili» su ogni riga.
   Il terzo — «Venduto per prodotto», in Report — non lo faceva. Effetto,
   misurato sulla dimostrazione **così com'è** (il DDT 2026/013, Sabbia lavata
   0/4, è non valorizzabile da sempre): la riga diceva
       «Sabbia lavata 0/4 · 68,3 t · 3 viaggi     € 605,00  venduto 2026»
   in verde, e 24,3 t su 68,3 — più di un terzo — non erano dentro quei 605 €.
   Nessun asterisco, nessun colore, niente da leggere.
   E con un prodotto **tutto** non valorizzabile (il caso che questo banco
   inietta: due DDT, 40,9 t) il difetto si vede anche nella GEOMETRIA — la
   riga dice «€ 0,00» in verde e la barra del grafico esce a **0 px**, cioè
   identica a un prodotto che non ha venduto niente. È il filo del 06/08 preso
   un piano più su: `lunghezzaBarra` disegna lo zero a zero e fa benissimo, ma
   quello zero **non era una misura**.

   ⚠️ LA PROVA CHE CONTA È IL RAPPORTO FRA DUE VALORI DIVERSI. Le barre di
   `#graf-vend` si misurano tutte, e ogni coppia di valori diversi deve stare
   nei pixel del suo rapporto: un campione solo non distingue «disegna in
   proporzione» da «sono tutte uguali». Le coppie che il **minimo di
   visibilità** appiattisce (`lunghezzaBarra` tiene 2 unità di viewBox) si
   **stampano** invece di essere saltate in silenzio.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, mai sul disco: accanto girano
   cantieri e un modulo dati se lo carica anche il browser.

   La parte che si prova senza browser — che `venditePerProdotto` e
   `vendutoPeriodo` CONTINO le consegne non valorizzabili — sta in
   `run-kpi.mjs`, sezione «venduto per prodotto: quello che la somma salta».
   Qui c'è solo quello che soltanto i pixel e il testo a schermo possono dire. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 9611;
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const CARTELLA_SCATTI = "/tmp/conti-numeri-tranquilli";

/* IL CASO, appeso in coda al modulo servito. `contiData()` in demo fa
   `JSON.parse(JSON.stringify(DEMO))`, quindi basta mutare l'oggetto al
   caricamento.
   Due DDT di un prodotto che NON esiste nel listino, venduti a metro cubo,
   senza densità e senza quantità scritta: `quantitaVenduta` risponde `null` e
   `valoreDdt` dichiara `calcolabile:false`. Sono due e non uno di proposito —
   così le tonnellate del prodotto (40,9) sono grandi quanto quelle di un
   prodotto vero, e un «€ 0,00» accanto a 40,9 t non si può scambiare per una
   consegna piccola.
   ⚠️ La data cade nell'anno in corso: la sezione filtra sull'anno solare, e un
   caso fuori periodo non arriverebbe mai — l'iniezione che non inietta. */
const ANNO = new Date().getFullYear();
const CASI = `
/* ── caso montato dal banco conti-numeri-tranquilli.mjs (mai sul disco) ── */
DEMO.pesate.push({ id: "znv1", numero: "${ANNO}/900", data: "${ANNO}-06-10",
  cliente: "Cliente senza densità", clienteId: null, prodotto: "Ghiaia lavata 4/8",
  unitaVendita: "m3", lordo: 44.9, tara: 22.4, netto: 22.5, quantita: null,
  densita: null, prezzoUnitario: 14, scontoPct: 0, fatturata: false });
DEMO.pesate.push({ id: "znv2", numero: "${ANNO}/901", data: "${ANNO}-06-11",
  cliente: "Cliente senza densità", clienteId: null, prodotto: "Ghiaia lavata 4/8",
  unitaVendita: "m3", lordo: 40.8, tara: 22.4, netto: 18.4, quantita: null,
  densita: null, prezzoUnitario: 14, scontoPct: 0, fatturata: false });
`;

/* IL DIFETTO DA RIMETTERE, con il file che lo porta. Si contano le
   sostituzioni: un `replace` che non trova niente esce in silenzio e dichiara
   un verde che non ha misurato niente (CLAUDE.md, «uno script che non
   fallisce non ha per forza fatto qualcosa»).
   Sono due, e vanno rimessi INSIEME: il conto nel modulo e la sua lettura
   nella pagina sono la stessa difesa in due pezzi — togliendone uno solo la
   controprova direbbe «non distingue» per la seconda delle cinque cause
   (difesa in profondità), non perché la prova non provi niente. */
const DIFETTI = [
  /* 1 · il modulo smette di contare quello che la somma salta.
     ⚠️ AGGIORNATA IL 13/08 perché il pezzo si è mosso: `valoreDdt` ha imparato
     una seconda ragione (il prezzo mai scritto, oltre alla densità), e la
     bandiera è finita in un `const vale` perché la legge anche il conto delle
     consegne «solo senza densità». È la terza delle cinque cause di «non
     distingue» — l'iniezione che non trova più il suo pezzo e spegne la
     controprova IN SILENZIO — e a prenderla è stata `iniezioni-fresche.mjs`,
     che gira in tre secondi invece che nel giro del browser. Il difetto
     rimesso è lo stesso di prima: il conto non si alza. */
  ["apps/conti/conti-data.js",
   `    if (!vale) { r.nonValorizzabili++; r.tNonValorizzabile = round2(r.tNonValorizzabile + q.t); }`,
   `    /* difetto rimesso dal banco: la somma salta e non lo conta */`],
  // 2 · la pagina torna a scrivere l'importo tranquillo, senza dire niente
  ["apps/conti/index.html",
   `          <div class="meta">${"$"}{qt(v.t)} t${"$"}{v.m3 ? " · " + qt(v.m3) + " m³" : ""} · ${"$"}{plur(v.viaggi, "viaggio", "viaggi")}${"$"}{vendMeta(v)}</div></div>
          <div class="amt">${"$"}{vendCifra(v, anno)}</div></div>`,
   `          <div class="meta">${"$"}{qt(v.t)} t${"$"}{v.m3 ? " · " + qt(v.m3) + " m³" : ""} · ${"$"}{plur(v.viaggi, "viaggio", "viaggi")}</div></div>
          <div class="amt"><div class="amt-n pos">${"$"}{eur(v.valore)}</div><div class="amt-s">venduto ${"$"}{anno}</div></div></div>`],
  // 3 · il peso ASSENTE torna a valere zero: e' il difetto del 10/08, e vale
  //     220,10 EUR di troppo su un riquadro che prepara un documento fiscale
  ["apps/conti/index.html",
   `    if (!rl.ok || !rt.ok) {`,
   `    if (false) {   /* difetto rimesso dal banco: la guardia sull'assenza sparisce */`],
  ["apps/conti/index.html",
   `    const lordoN = rl.valore, taraN = rt.valore;`,
   `    const lordoN = rl.ok ? rl.valore : 0, taraN = rt.ok ? rt.valore : 0;`],
];

let iniezioniCasi = 0;
const iniettati = new Map();          // file -> quante volte il difetto è entrato
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER: un banco che trova
     la porta occupata e la RIUSA non fallisce — misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  const rel = p.slice(R.length + 1);
  if (rel === "apps/conti/conti-data.js" || rel === "apps/conti/index.html") {
    let t = corpo.toString("utf8");
    if (rel === "apps/conti/conti-data.js") { t += CASI; iniezioniCasi++; }
    if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
      if (file !== rel) continue;
      const n = t.split(cerca).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
      t = t.replace(cerca, sost);
      iniettati.set(file, (iniettati.get(file) || 0) + 1);
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA. Poi si RILEGGE dal server il
   contrassegno col proprio pid, che è la sola prova che quello che risponde è
   mio. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const nonMisurati = [];
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
/* un soggetto NON misurato non è un soggetto a posto: si dichiara, si elenca
   fra le righe «non ho guardato» e l'uscita resta diversa da zero */
const nonMisurato = (t, x) => { nonMisurati.push(t + (x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 200)}` : "")); console.log(`  NON MISURATO  ${t}`); };

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, `il caso è stato servito (${iniezioniCasi} volte)`);
if (CONTROPROVA) dice([...iniettati.values()].reduce((a, c) => a + c, 0) >= 2,
  `i due pezzi del difetto sono stati rimessi (${[...iniettati.entries()].map(([f, n]) => f.split("/").pop() + "×" + n).join(", ") || "nessuno"})`,
  [...iniettati.entries()]);

/* ⛔ PRIMA DI MISURARE, LA PROVA DI AVER NAVIGATO. */
const vaiA = async (sez) => {
  await pg.click("#nav-" + sez);
  await pg.waitForTimeout(600);
  const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
  if (!vive.includes("page-" + sez)) { console.log(`  KO  navigazione a ${sez}: la pagina viva è ${JSON.stringify(vive)}`); ko++; return false; }
  for (const acc of await pg.$$("details:not([open]) > summary:visible, .dc-sec.closed .dc-sec-h:visible")) {
    await acc.click({ timeout: 2000 }).catch(() => {});
    await pg.waitForTimeout(60);
  }
  await pg.waitForTimeout(600);
  return true;
};

if (!(await vaiA("rep"))) { console.log("non sono arrivato al Report: mi fermo."); await b.close(); srv.close(); process.exit(2); }
if (SCATTI) { mkdirSync(CARTELLA_SCATTI, { recursive: true }); await pg.screenshot({ path: join(CARTELLA_SCATTI, "rep.png"), fullPage: true }); }

// ══ LE RIGHE DELL'ELENCO «VENDUTO PER PRODOTTO» ══════════════════════════
const righe = await pg.evaluate(() => {
  const el = document.getElementById("vend-list");
  if (!el) return null;
  return {
    voci: [...el.querySelectorAll(".item")].map((it) => ({
      nome: (it.querySelector(".name")?.textContent || "").trim(),
      meta: (it.querySelector(".meta")?.textContent || "").trim(),
      cifra: (it.querySelector(".amt-n")?.textContent || "").trim(),
      sotto: (it.querySelector(".amt-s")?.textContent || "").trim(),
      classiCifra: it.querySelector(".amt-n")?.className || "",
      classi: it.className,
    })),
    totale: (el.querySelector(".tot")?.textContent || "").replace(/\s+/g, " ").trim(),
    testo: el.textContent.replace(/\s+/g, " ").trim(),
  };
});
if (!righe || !righe.voci.length) { console.log("  KO  #vend-list è vuota: non ho misurato niente"); ko++; }
else {
  console.log(`\n  #vend-list — ${righe.voci.length} prodotti`);
  for (const v of righe.voci) console.log(`     ${v.nome.padEnd(34)} ${v.cifra.padStart(12)} [${v.sotto}]  ${v.meta}`);
  console.log(`     TOTALE: ${righe.totale}`);
}
console.log("");

const vociOk = righe && righe.voci.length ? righe.voci : [];
const iniettato = vociOk.find((v) => /Ghiaia lavata 4\/8/.test(v.nome));
const sabbia = vociOk.find((v) => /Sabbia lavata 0\/4/.test(v.nome));

// ══ 1. UN PRODOTTO CHE NON SI PUÒ VALORIZZARE NON SI SCRIVE «€ 0,00» ═════
/* Il caso iniettato: 40,9 t consegnate in due viaggi, valore non calcolabile.
   Un «€ 0,00» qui non è un numero sbagliato — è un numero INVENTATO, e in
   verde: è esattamente il segno che il principio del fondatore descrive. */
{
  dice(!!iniettato, "il prodotto tutto non valorizzabile è arrivato nell'elenco", vociOk.map((v) => v.nome));
  if (iniettato) {
    dice(!/^€\s*0,00$/.test(iniettato.cifra),
      `40,9 t consegnate non si riassumono con «${iniettato.cifra}»: uno zero è «misurato, ed è zero»`, iniettato);
    dice(!/\bpos\b/.test(iniettato.classiCifra),
      "e la cifra non è dipinta del verde di un incasso", iniettato.classiCifra);
    dice(/non valorizzabil/i.test(iniettato.meta + " " + iniettato.sotto),
      "la riga DICE perché il valore non c'è", { meta: iniettato.meta, sotto: iniettato.sotto });
  }
}

// ══ 2. LA RIGA CHE HA UN VALORE PARZIALE LO DICHIARA ═════════════════════
/* Sabbia lavata 0/4 sta nella dimostrazione da sempre e ha un DDT non
   valorizzabile su tre: la cifra è VERA ma è per difetto, e la differenza fra
   «605 €» e «605 € su due viaggi su tre» è tutto il punto. */
{
  dice(!!sabbia, "il prodotto con un valore PARZIALE è nell'elenco", vociOk.map((v) => v.nome));
  if (sabbia) dice(/non valorizzabil/i.test(sabbia.meta + " " + sabbia.sotto),
    `la riga dal valore parziale lo dichiara (${sabbia.cifra})`, { meta: sabbia.meta, sotto: sabbia.sotto });
}

// ══ 3. IL TOTALE CHE ESCLUDE QUALCOSA LO DICE ════════════════════════════
/* La stessa frase che il registro Pesate e «Consegnato da fatturare» hanno
   già: un totale che esclude senza dirlo è un totale che inganna. */
{
  if (!righe) nonMisurato("il totale «Venduto» non è stato letto: la lista non c'era");
  else dice(/per difetto|non entra|non valorizzabil/i.test(righe.testo),
    "il totale dichiara che qualcosa ne resta fuori", righe.totale);
}

// ══ 4. I PIXEL DEL GRAFICO CONTRO I VALORI CHE DICHIARA ══════════════════
/* Le barre di `#graf-vend` sono `path.dwg-bar`, e accanto a ognuna il motore
   scrive l'etichetta del valore (`text.dwg-vallab`). Le due cose vengono da
   due posti diversi apposta — il rettangolo dal browser, la cifra dal testo —
   perché confrontarle è tutto il punto. */
const barre = await pg.evaluate(() => {
  const numIt = (t) => {
    const s = String(t).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
    const v = parseFloat(s);
    return Number.isFinite(v) ? v : null;
  };
  const fig = document.querySelector("#graf-vend svg");
  if (!fig) return null;
  /* ⚠️ LA CLASSE VERA È `dwg-barra`, non `dwg-bar`: misurata con
     `getAttribute("class")` invece che dedotta dal nome del motore. Il
     selettore resta a sottostringa apposta — così regge tutt'e due — e questa
     riga sta qui perché nessuno lo «corregga» in `.dwg-bar`, che non combacia
     con niente e renderebbe il banco cieco senza una riga rossa. */
  const paths = [...fig.querySelectorAll("path[class*='dwg-bar']")];
  const cat = [...fig.querySelectorAll("text.dwg-catlab")];
  const val = [...fig.querySelectorAll("text.dwg-vallab")];
  return paths.map((p, i) => {
    const r = p.getBoundingClientRect();
    return {
      etichetta: (cat[i]?.textContent || "").trim(),
      valoreScritto: (val[i]?.textContent || "").trim(),
      valore: numIt(val[i]?.textContent || ""),
      px: +r.width.toFixed(2),
      alt: +r.height.toFixed(2),
    };
  });
});

if (!barre) nonMisurato("#graf-vend non ha una tela SVG: non ho misurato nessuna barra");
else if (!barre.length) nonMisurato("#graf-vend non disegna nessuna barra");
else {
  console.log(`\n  #graf-vend — ${barre.length} barre`);
  for (const b2 of barre) console.log(`     ${b2.etichetta.padEnd(26)} ${b2.valoreScritto.padStart(12)}  ->  ${String(b2.px).padStart(7)} px`);
  console.log("");

  // 4a · il rapporto fra due valori diversi
  {
    let coppie = 0, storte = 0;
    const appiattite = [];
    const utili = barre.filter((x) => x.valore != null && x.valore > 0);
    for (let i = 0; i < utili.length; i++) for (let j = i + 1; j < utili.length; j++) {
      const a = utili[i], c = utili[j];
      if (a.valore === c.valore) continue;
      /* ⚠️ IL MINIMO DI VISIBILITÀ APPIATTISCE I VALORI PICCOLI FRA LORO, e le
         coppie che schiaccia si STAMPANO invece di essere saltate in
         silenzio: `lunghezzaBarra` tiene 2 unità di viewBox, che a questa
         scala valgono ~1,85 px. */
      if (a.px <= 3 || c.px <= 3) { appiattite.push(`${a.valoreScritto}=${a.px}px contro ${c.valoreScritto}=${c.px}px`); continue; }
      coppie++;
      const atteso = a.valore / c.valore;
      const vero = a.px / c.px;
      if (Math.abs(vero / atteso - 1) > 0.06) {
        storte++;
        console.log(`  KO  #graf-vend: ${a.valoreScritto} contro ${c.valoreScritto} -> pixel ${a.px}/${c.px} = ${vero.toFixed(3)}, atteso ${atteso.toFixed(3)}`);
      }
    }
    if (appiattite.length) console.log(`  ⚠️ ${appiattite.length} coppie appiattite dal minimo di visibilità: ${appiattite.join(" · ")}`);
    dice(coppie >= 3, `ci sono abbastanza coppie di valori diversi da confrontare (${coppie})`);
    dice(storte === 0, `ogni coppia sta nei pixel del suo rapporto (${storte} storte su ${coppie})`);
  }

  // 4b · nessuna barra dichiara un valore che il disegno non porta
  {
    const scollate = barre.filter((x) => x.valore != null && x.valore > 0 && x.px <= 0);
    dice(scollate.length === 0, "nessuna barra dichiara un valore e ne disegna zero pixel", scollate);
  }

  // 4c · IL DISEGNO NON DICE «ZERO» DOVE NESSUNO HA MISURATO
  /* Il cuore del banco. Una barra a zero pixel col cartellino «€ 0» accanto
     al nome di un prodotto che ha consegnato 40,9 t è un disegno che afferma
     una misura mai fatta: `lunghezzaBarra` fa benissimo a disegnare lo zero a
     zero — a essere falso è il valore che gli arriva. */
  {
    const zeriDisegnati = barre.filter((x) => x.valore === 0);
    if (!zeriDisegnati.length) console.log("  (nessuna barra a zero nel grafico)");
    const fantasma = zeriDisegnati.filter((x) => /Ghiaia lavata/.test(x.etichetta));
    dice(fantasma.length === 0,
      "il prodotto non valorizzabile non compare fra le barre come uno zero misurato",
      fantasma);
  }

  // 4d · il grafico dichiara quello che ha lasciato fuori
  {
    const nota = await pg.evaluate(() => {
      const f = document.querySelector("#graf-vend");
      return f ? f.textContent.replace(/\s+/g, " ").trim() : "";
    });
    dice(/non valorizzabil|per difetto/i.test(nota),
      "la nota del grafico dichiara i prodotti che non ha potuto disegnare", nota.slice(-260));
  }
}

// ══ 5. GLI ALTRI GRAFICI A BARRE DI CONTI, COL LORO DENOMINATORE ═════════
/* ⛔ NESSUN BANCO AVEVA MAI MISURATO IN PIXEL I GRAFICI DI CONTI.
   `conti-barre-peso` guarda le `span.bar` delle liste — un altro disegno — e
   `graf-scala` guarda la SCALA di queste tele, non le loro quantità. Qui si
   fa a tutte le tele raggiunte la stessa domanda del §4a: *due valori diversi
   finiscono in pixel diversi, nel rapporto giusto?* Un campione solo non
   distingue «disegna in proporzione» da «sono tutte uguali».
   ⚠️ E si DICHIARA il denominatore: quali ospiti c'erano, quali avevano una
   tela, quali sono stati misurati e quali no. Un numero basso di violazioni
   va diviso per i soggetti che il controllo ha potuto vedere — «2 contro 13»
   si legge esattamente al contrario quando il 2 viene da una app misurata di
   meno (misurato su Terra il 07/08). */
{
  const SEZIONI = [["rep", "Report"], ["cos", "Costi"], ["cli", "Clienti"], ["dash", "Quadro"]];
  /* ⚠️ LE TELE VIVONO NEL DOM ANCHE QUANDO LA LORO SEZIONE È CHIUSA: cercarle
     su tutto il documento a ogni sezione le conta sei volte e riempie l'elenco
     dei «non misurati» di doppioni che sono la stessa cosa vista da un'altra
     schermata. Si tiene UNA riga per ospite, e vince l'osservazione in cui era
     visibile — cioè quella in cui `getBoundingClientRect` sa rispondere. */
  const censimento = new Map();
  for (const [sez, nome] of SEZIONI) {
    if (!(await vaiA(sez))) { nonMisurato(`la sezione ${nome} non si è aperta: i suoi grafici non li ho guardati`); continue; }
    const tele = await pg.evaluate(() => {
      const numIt = (t) => {
        const s = String(t).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
        const v = parseFloat(s);
        return Number.isFinite(v) ? v : null;
      };
      const out = [];
      for (const el of document.querySelectorAll("[id^='graf-'], #ord-barra")) {
        const svg = el.querySelector("svg");
        const vis = el.getBoundingClientRect().width > 0;
        const paths = svg ? [...svg.querySelectorAll("path[class*='dwg-bar']")] : [];
        const val = svg ? [...svg.querySelectorAll("text.dwg-vallab")] : [];
        out.push({ id: el.id, tela: !!svg, visibile: vis,
          barre: paths.map((p, i) => {
            const r = p.getBoundingClientRect();
            return { valore: numIt(val[i]?.textContent || ""), scritto: (val[i]?.textContent || "").trim(),
                     w: +r.width.toFixed(2), h: +r.height.toFixed(2),
                     /* il bordo che NON si muove dice l'orientamento meglio di
                        qualunque deduzione: si legge, non si indovina */
                     sx: +r.left.toFixed(2), giu: +r.bottom.toFixed(2) };
          }) });
      }
      return out;
    });
    for (const t of tele) {
      const vecchia = censimento.get(t.id);
      if (!vecchia || (t.visibile && !vecchia.visibile)) censimento.set(t.id, { ...t, sezione: nome });
    }
  }

  const tutte = [...censimento.values()];
  console.log(`\n  CENSIMENTO delle tele di dwGrafici (${SEZIONI.length} sezioni aperte, ${tutte.length} ospiti distinti)`);
  for (const t of tutte)
    console.log(`     ${t.sezione.padEnd(8)} ${t.id.padEnd(14)} tela=${t.tela ? "sì" : "no"} visibile=${t.visibile ? "sì" : "no"} barre=${t.barre.length}`);

  /* ⛔ L'ORIENTAMENTO SI LEGGE DALLA GEOMETRIA, NON SI DEDUCE — e la prima
     stesura di questa riga ha accusato `graf-aging` e `graf-cos` di 21 rapporti
     storti che non esistevano. Diceva: «se tutte le barre hanno la stessa
     ALTEZZA è orizzontale». Le altezze erano 21,5 e 21,4 — lo stesso spessore
     arrotondato in due modi dal motore di disegno — quindi l'insieme ne conteneva
     due, il banco concludeva «verticale» e misurava lo SPESSORE al posto della
     quantità. Rapporti tutti a 1,00, difetto identico su tutte le coppie: è il
     modo in cui si riconosce di stare guardando il righello.
     Il segnale giusto non è un'uguaglianza fra decimali, è il bordo che sta
     fermo: in una barra orizzontale tutte partono dallo stesso x (l'asse dello
     zero), in una verticale poggiano tutte sullo stesso y. Quando nessuno dei
     due sta fermo — o stanno fermi tutti e due — non si tira a indovinare: la
     tela si DICHIARA non misurata. */
  const scarto = (v) => (v.length ? Math.max(...v) - Math.min(...v) : 0);
  const versoDi = (b2) => {
    const fermoSx = scarto(b2.map((x) => x.sx)) < 1.5;
    const fermoGiu = scarto(b2.map((x) => x.giu)) < 1.5;
    if (fermoSx && !fermoGiu) return "oriz";
    if (fermoGiu && !fermoSx) return "vert";
    /* tutti e due fermi = una barra sola, o tutte lunghe uguali: nel primo
       caso non c'è nessuna coppia da confrontare, nel secondo la larghezza è
       comunque il lato che il motore fa variare nell'orizzontale */
    if (fermoSx && fermoGiu) return scarto(b2.map((x) => x.w)) >= scarto(b2.map((x) => x.h)) ? "oriz" : "vert";
    return null;
  };

  const misurabili = [], saltate = [];
  for (const t of tutte) {
    const b2 = t.barre.filter((x) => x.valore != null);
    const verso = t.tela && t.visibile && b2.length >= 2 ? versoDi(b2) : null;
    if (verso) misurabili.push({ ...t, verso, b2 });
    else {
      /* ⚠️ IL MOTIVO VA SCRITTO PER ESTESO, se no una riga «non misurata» manda
         ad aprire un cantiere su una cosa già sorvegliata altrove. Due famiglie
         hanno un motivo STRUTTURALE e non sono un buco:
         · le pillole `avanzamento` (`graf-espo…`) non hanno `path.dwg-bar` e,
           con `etichettaValore:false`, non scrivono la cifra sul disegno: le
           misura il §6, leggendo l'importo dalla riga;
         · `graf-flusso` è una LINEA, e una linea non ha barre da confrontare. */
      const pillola = /^graf-espo/.test(t.id);
      saltate.push({ ...t, perche: !t.tela ? "senza tela"
        : !t.visibile ? "non visibile in nessuna delle sezioni aperte"
        : pillola ? "è una pillola «avanzamento», senza cifra sul disegno — la misura il §6 qui sotto"
        : t.id === "graf-flusso" ? "è un grafico a LINEA: qui si confrontano barre, e non ne ha"
        : b2.length < 2 ? "meno di 2 valori leggibili"
        : "orientamento non leggibile dalla geometria" });
    }
  }
  console.log(`  → ${misurabili.length} tele misurate su ${tutte.length}`);
  if (saltate.length) {
    console.log(`  ⚠️ NON MISURATE (non è «a posto», è «non l'ho guardata»):`);
    for (const s of saltate) console.log(`       ${s.id} — ${s.perche}`);
  }

  let coppieTot = 0, storteTot = 0;
  const appiattiteTot = [];
  for (const t of misurabili) {
    const lato = (x) => (t.verso === "oriz" ? x.w : x.h);
    for (let i = 0; i < t.b2.length; i++) for (let j = i + 1; j < t.b2.length; j++) {
      const a = t.b2[i], c = t.b2[j];
      if (a.valore === c.valore || a.valore <= 0 || c.valore <= 0) continue;
      if (lato(a) <= 3 || lato(c) <= 3) { appiattiteTot.push(`${t.id}: ${a.scritto}=${lato(a)}px contro ${c.scritto}=${lato(c)}px`); continue; }
      coppieTot++;
      const atteso = a.valore / c.valore, vero = lato(a) / lato(c);
      if (Math.abs(vero / atteso - 1) > 0.06) {
        storteTot++;
        console.log(`  KO  #${t.id} (${t.verso}): ${a.scritto} contro ${c.scritto} -> pixel ${lato(a)}/${lato(c)} = ${vero.toFixed(3)}, atteso ${atteso.toFixed(3)}`);
      }
    }
  }
  /* ⚠️ LE COPPIE APPIATTITE SI STAMPANO, non si saltano in silenzio: il minimo
     di visibilità di `lunghezzaBarra` (2 unità di viewBox) schiaccia i valori
     piccoli fra loro, e alzarlo o abbassarlo non risolve — quello che si può
     fare è dire quali coppie non distingue. */
  if (appiattiteTot.length) console.log(`  ⚠️ ${appiattiteTot.length} coppie appiattite dal minimo di visibilità:\n       ` + appiattiteTot.join("\n       "));
  console.log(`  (${coppieTot} coppie di valori diversi confrontate su ${misurabili.length} tele)`);
  dice(coppieTot >= 10, `ci sono abbastanza coppie in tutta l'app da confrontare (${coppieTot})`);
  dice(storteTot === 0, `ogni coppia di ogni tela sta nei pixel del suo rapporto (${storteTot} storte su ${coppieTot})`);
  dice(tutte.some((t) => t.id === "graf-vend"), "l'ospite di «Venduto per prodotto» esiste nella pagina", tutte.map((t) => t.id));
}

// ══ 6. «CHI CHIAMARE PER PRIMO»: LE PILLOLE DELL'ESPOSIZIONE ═════════════
/* Sono `avanzamento`, non `barre`: il motore disegna un `rect.dwg-fill` e,
   con `etichettaValore:false`, NON scrive la cifra sul disegno — quindi
   l'importo si legge dalla riga (`.gcli-v`), che è il posto dove lo legge
   anche l'utente. Cinque righe sulla stessa scala: è il caso ideale per il
   rapporto fra due valori diversi.
   ⚠️ Nessun banco le guardava: `conti-barre-peso` misura le `span.bar` di
   `#espo-list`, che stanno nel Report e sono un ALTRO disegno degli stessi
   dati — due strade per la stessa verità, e finora una sola sorvegliata. */
{
  if (!(await vaiA("cli"))) nonMisurato("la sezione Clienti non si è aperta: le pillole dell'esposizione non le ho guardate");
  else {
    const pillole = await pg.evaluate(() => {
      const numIt = (t) => {
        const s = String(t).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
        const v = parseFloat(s);
        return Number.isFinite(v) ? v : null;
      };
      return [...document.querySelectorAll(".gcli")].map((g) => {
        const f = g.querySelector("rect.dwg-fill");
        const tr = g.querySelector("rect.dwg-track");
        return {
          nome: (g.querySelector(".gcli-n")?.textContent || "").trim(),
          scritto: (g.querySelector(".gcli-v")?.textContent || "").trim(),
          valore: numIt(g.querySelector(".gcli-v")?.textContent || ""),
          px: f ? +f.getBoundingClientRect().width.toFixed(2) : null,
          pista: tr ? +tr.getBoundingClientRect().width.toFixed(2) : null,
        };
      });
    });
    if (!pillole.length) nonMisurato("nessuna riga «chi chiamare per primo» nella dimostrazione");
    else {
      console.log(`\n  «chi chiamare per primo» — ${pillole.length} pillole`);
      for (const p of pillole) console.log(`     ${p.nome.padEnd(28)} ${p.scritto.padStart(12)}  ->  ${String(p.px).padStart(7)} px  su pista ${p.pista}`);
      const senzaDisegno = pillole.filter((p) => p.px == null);
      dice(senzaDisegno.length === 0, `ogni riga ha la sua pillola disegnata (${pillole.length - senzaDisegno.length}/${pillole.length})`, senzaDisegno);
      let coppie = 0, storte = 0;
      const appiattite = [];
      const utili = pillole.filter((p) => p.px != null && p.valore != null && p.valore > 0 && p.pista > 0);
      for (let i = 0; i < utili.length; i++) for (let j = i + 1; j < utili.length; j++) {
        const a = utili[i], c = utili[j];
        if (a.valore === c.valore) continue;
        /* il minimo di `avanzamento` è `spessore * 0,6` — molto più alto di
           quello delle barre — quindi le coppie che schiaccia si stampano */
        if (a.px <= 9 || c.px <= 9) { appiattite.push(`${a.scritto}=${a.px}px contro ${c.scritto}=${c.px}px`); continue; }
        coppie++;
        /* si confrontano le FRAZIONI di pista: due pillole con altezza diversa
           (chi ha il fido e chi no) possono avere piste larghe uguali, ma la
           divisione toglie ogni dubbio invece di darlo per scontato */
        const vero = (a.px / a.pista) / (c.px / c.pista);
        const atteso = a.valore / c.valore;
        if (Math.abs(vero / atteso - 1) > 0.06) {
          storte++;
          console.log(`  KO  esposizione: ${a.scritto} contro ${c.scritto} -> pixel ${a.px}/${c.px} = ${vero.toFixed(3)}, atteso ${atteso.toFixed(3)}`);
        }
      }
      if (appiattite.length) console.log(`  ⚠️ ${appiattite.length} coppie appiattite dal minimo di visibilità: ${appiattite.join(" · ")}`);
      console.log(`  (${coppie} coppie confrontate)`);
      dice(coppie >= 3, `ci sono abbastanza coppie di esposizioni diverse (${coppie})`);
      dice(storte === 0, `ogni esposizione sta nei pixel del suo rapporto (${storte} storte su ${coppie})`);
    }
  }
}

// ══ IL PESO CHE MANCA NON VALE ZERO ═════════════════════════════════════
/* ⛔ QUESTO E' IL PUNTO DOVE NESSUN BANCO PREMEVA, e sotto ci stava un difetto
   sui SOLDI. `aggiornaNetto` calcolava il netto con `rl.ok ? rl.valore : 0`:
   con la TARA VUOTA il netto diventava il lordo intero e il riquadro
   dichiarava «Valore della consegna EUR 503,75» dove il vero e' EUR 283,65 —
   il 77% in piu', su un riquadro che prepara un documento fiscale. E col LORDO
   vuoto il campo del netto si riempiva da solo di «0,00», che e' la forma
   peggiore dello zero inventato perche' sta DENTRO un campo e sembra scritto
   da qualcuno.
   ⚠️ Una prova pura non lo avrebbe visto: `nettoPesata` non e' cambiata, e'
   giusta com'e'. Il difetto stava nella PAGINA, cioe' nella famiglia che
   CLAUDE.md chiama «le prove chiamano il modulo e i file li compone la
   pagina». Si prende solo premendo i tasti. */
if (!(await vaiA("pes"))) nonMisurato("la sezione Pesate non si e' aperta: il netto della pesata non l'ho guardato");
else {
  const scrivi = async (lordo, tara) => {
    await pg.fill("#pes-lordo", lordo);
    await pg.fill("#pes-tara", tara);
    await pg.waitForTimeout(200);
    return pg.evaluate(() => ({
      netto: (document.getElementById("pes-netto") || {}).value,
      riep: ((document.getElementById("pes-riep") || {}).innerText || "").trim(),
    }));
  };
  /* i tre casi, e il terzo serve a dimostrare che i primi due non passano
     perche' il riquadro tace SEMPRE: un banco che guarda solo il vuoto non
     distingue «non calcola» da «non calcola mai» */
  const senzaTara = await scrivi("32,5", "");
  dice(senzaTara.netto === "—", "tara vuota: il netto e' un trattino, non il lordo intero", senzaTara);
  dice(/la tara/i.test(senzaTara.riep) && !/il peso lordo/i.test(senzaTara.riep),
    "tara vuota: il riquadro dice QUALE peso manca, e non l'altro", senzaTara.riep.slice(0, 160));
  dice(/non vale zero/i.test(senzaTara.riep),
    "tara vuota: e dice che un campo vuoto non vale zero", senzaTara.riep.slice(0, 160));

  const senzaLordo = await scrivi("", "14,2");
  dice(senzaLordo.netto === "—", "lordo vuoto: il campo del netto NON si riempie da solo di 0,00", senzaLordo);
  dice(/il peso lordo/i.test(senzaLordo.riep) && !/la tara/i.test(senzaLordo.riep),
    "lordo vuoto: il riquadro nomina il lordo, non la tara", senzaLordo.riep.slice(0, 160));

  const pieni = await scrivi("32,5", "14,2");
  /* 32,5 - 14,2 = 18,3: il numero vero, che e' anche la misura di quanto
     valeva il difetto (32,50 contro 18,30 = 14,20 t di camion fatturato) */
  dice(/18[.,]3/.test(String(pieni.netto)),
    "coi due pesi il netto e' il numero vero (18,3), non un trattino", pieni);
  dice(!/Manca ancora/i.test(pieni.riep),
    "e il riquadro smette di chiedere quello che adesso c'e'", pieni.riep.slice(0, 160));

  const intonso = await scrivi("", "");
  dice(intonso.riep === "", "sul modulo intonso non si dice niente: non c'e' nessun numero da smentire", intonso.riep);
  console.log("  (4 stati del modulo pesata provati: senza tara, senza lordo, coi due, intonso)");
}

console.log(`\n${ok} ok, ${ko} KO${nonMisurati.length ? ` · ${nonMisurati.length} NON MISURATI` : ""}${SCATTI ? ` · scatti in ${CARTELLA_SCATTI}` : ""}`);
if (nonMisurati.length) { console.log("NON HO GUARDATO (un soggetto non misurato non è un soggetto a posto):"); for (const n of nonMisurati) console.log("   · " + n); }
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
/* con --controprova l'esito si ROVESCIA: deve fallire */
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 || nonMisurati.length ? 1 : 0));

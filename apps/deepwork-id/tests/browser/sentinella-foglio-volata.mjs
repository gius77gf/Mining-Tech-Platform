/* SENTINELLA: LA SCHEDA DELLA SINGOLA VOLATA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-foglio-volata.mjs [--porta=8559]
     node sentinella-foglio-volata.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il registro delle volate sapeva tutto di una volata — dati,
   PPV collegata, previsione di Genesi, comunicazione, reclami — e non sapeva
   consegnarlo: chi doveva allegare «la scheda della volata» a una risposta a
   un reclamo la ricomponeva a mano da quattro schermate. `run-kpi.mjs` prova
   la funzione pura (`fogliaVolata`); qui si prova la metà che solo il
   browser vede:
     1. il bottone sulla riga del registro APRE una finestra e ci scrive un
        documento (si intercetta `window.open`, come per i fogli di Terra);
     2. il documento della volata collegata allo strumento porta la lettura,
        la taratura, la comunicazione e il reclamo del giorno — con le frasi
        che il modulo ha promesso alle prove;
     3. ⛔ il documento di una volata SENZA niente collegato dichiara ogni
        assenza a parole («non ancora collegata», «nessuna previsione
        registrata», «nessun reclamo registrato quel giorno»), mai «—»;
     4. e in modo dimostrazione il foglio dice in testa che sono dati di
        esempio: una scheda finta che esce senza dirlo è un allegato falso.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, in coda alla risposta HTTP del modulo:
   il file su disco non si tocca mai. Il punto «v1» della dimostrazione ha una
   lettura importata l'08/06/2026 alle 10:20 e una taratura che copre quel
   giorno: la volata costruita si aggancia LÌ, così la scheda si misura su una
   lettura vera e non su una scritta apposta.
   ⚠️ OGNI CASO DICHIARA LA SUA PRECONDIZIONE: se la riga non arriva a schermo
   il banco scrive NON MISURATO ed esce diverso da zero, invece di accusare. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8559;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE. Si contano: un `replace` che non trova niente esce
   in silenzio, e una controprova che non sostituisce niente prova un prodotto
   SANO dichiarando «non distingue» — la terza delle cinque cause. */
const DIFETTI_MODULO = [
  // 3 · la PPV non collegata esce «—»
  [`"non ancora collegata"));`, `"—"));`],
  // 3 · e i reclami assenti pure
  [`[["Reclami", "nessun reclamo registrato quel giorno", false]]`, `[["Reclami", "—", false]]`],
  // 2 · la lettura si cerca per data e basta: esce quella sbagliata
  [`&& (!ppv.ora || String(l.ora || "") === ppv.ora)) || null : null;`, `) || null : null;`],
  // 5 · «che cosa manca» non viene dichiarato: la riga resta ma l'elenco e la marca spariscono
  [`const manca = (etichetta, testo) => { nonMisurati.push(etichetta + " (" + testo + ")"); return [etichetta, testo, true]; };`,
   `const manca = (etichetta, testo) => [etichetta, testo, false];`],
  // 6 · la copia debole della soglia: il foglio legge la soglia del PUNTO e ignora il ricettore
  [`const eff = sogliaEfficace(punto, opts.ricettori || []);`,
   `const eff = { valore: numeroDichiarato(punto.soglia), fonte: "punto", ricettore: "", unita: unitaMisura(punto), conflitto: false };`],
];
const DIFETTI_PAGINA = [
  // 1 · il bottone c'è ma il gestore non ritrova la volata: la finestra resta vuota
  [`const v = VOL.find(x => x.id === b.getAttribute("data-foglio-vol")); if (!v) return;`,
   `const v = VOL.find(x => x.id === b.getAttribute("data-foglio-vol") + "x"); if (!v) return;`],
  // 4 · il foglio della dimostrazione non dice di essere finto
  [`+ (demo ? "<div class=\\"demo\\">" + esc(demo) + "</div>" : "")`, `+ ""`],
];

/* I CASI. Una volata agganciata alla lettura vera del punto v1 (08/06/2026
   10:20, importata da «V1_giugno.csv»), con due letture quel giorno nel punto
   per pretendere che si scelga per ORA; una comunicazione; e un reclamo lo
   stesso giorno. La volata «b2» della dimostrazione (03/07/2026) non ha
   niente collegato: è il caso 3 e non va costruito. */
const FIXTURE =
  `\nDEMO.volate.push({ id: "sxf1", data: "2026-06-08", fronte: "Fronte Ovest", nFori: 30, kgTotali: 360, kgMaxRitardo: 16,`
  + ` distanzaRicettore: 350, esito: "regolare", note: "", stato: "eseguita",`
  + ` ppvMisurata: 2.4, ppvFonte: "strumento", ppvPuntoId: "v1", ppvPuntoNome: "Vibrazioni V1 — abitato Sud", ppvData: "2026-06-08", ppvOra: "10:20",`
  + ` comunicataA: "ente", comunicataIl: "2026-06-07", comunicazioneRif: "PEC prot. 2210/2026" });\n`
  + `(DEMO.monitoraggi.find((m) => m.id === "v1") || { letture: [] }).letture.push({ data: "2026-06-08", ora: "17:40", valore: 0.9, assi: { L: 0.5, T: 0.4, V: 0.9 } });\n`
  + `DEMO.reclami.push({ id: "sxr1", data: "2026-06-08", ora: "10:35", tipo: "vibrazione", ricettoreId: "rc1", chi: "Sig.ra Verdi", descrizione: "Tremava il lampadario.", stato: "aperto" });\n`;

const SOLO = Number((process.argv.find((a) => a.startsWith("--difetto=")) || "").split("=")[1]) || 0;
const TUTTI = [...DIFETTI_PAGINA.map((d) => ["pagina", d]), ...DIFETTI_MODULO.map((d) => ["modulo", d])];
const SCELTI = SOLO ? [TUTTI[SOLO - 1]].filter(Boolean) : TUTTI;
if (SOLO && !SCELTI.length) { console.error(`✗ --difetto=${SOLO}: ce ne sono ${TUTTI.length}`); process.exit(2); }
const attiviPagina = SCELTI.filter(([k]) => k === "pagina").map(([, d]) => d);
const attiviModulo = SCELTI.filter(([k]) => k === "modulo").map(([, d]) => d);

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [a, b] of attiviModulo) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of attiviPagina) {
      if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA non fallisce, misura la copia di qualcun altro. */
const SEGNO = join(R, "__sentinella-foglio-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-foglio-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
const nonMisurato = (t, x) => { nonMisurati.push(t + (x ? " — " + String(x).slice(0, 200) : "")); console.log(`  NON MISURATO  ${t}`); };

async function apri(bottone) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  pg.__errori = errori;
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
/* La finestra nuova si intercetta: quello che la pagina ci scrive finisce in
   `window.__doc`, e si legge da lì. Nessuna finestra vera si apre. */
const intercetta = (pg) => pg.evaluate(() => {
  window.__doc = null; window.__aperture = 0;
  window.open = () => { window.__aperture++; window.__doc = "";
    return { document: { write: (h) => { window.__doc += h; }, close() {} }, focus() {}, print() {} }; };
});
/* `esc` scrive l'apostrofo come `&#39;`: si decodifica, se no «all'ente» non
   si trova mai e il banco accusa una frase giusta. */
const decodifica = (t) => String(t || "").replace(/&#39;/g, "'").replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const testo = (h) => decodifica(String(h || "").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
/* ⛔ IL «—» SI CERCA NELLE CELLE, NON NEL FOGLIO INTERO: il titolo scrive
   «del 08/06/2026 — Fronte Ovest» e il nome del punto «V1 — abitato Sud» di
   proposito. Il difetto è una CELLA che è solo «—» (o che porta «undefined»
   e «NaN»), cioè un valore che tace. */
const celleMute = (html) => [...String(html || "").matchAll(/<td>([\s\S]*?)<\/td>/g)].map((m) => decodifica(m[1]).trim())
  .filter((c) => c === "—" || c === "" || /undefined|NaN/.test(c));
async function scheda(pg, id) {
  const c = await pg.$(`[data-foglio-vol="${id}"]`);
  if (!c) return null;
  await intercetta(pg);
  await c.click();
  await pg.waitForTimeout(500);
  const r = await pg.evaluate(() => ({ doc: window.__doc, aperture: window.__aperture }));
  return { html: String(r.doc || ""), doc: testo(r.doc), aperture: r.aperture };
}

console.log(`\n════════ Sentinella · la scheda della singola volata${CONTROPROVA ? " · controprova" : ""} ════════`);
if (CONTROPROVA) console.log(`⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO${SOLO ? ` · SOLO il difetto ${SOLO} di ${TUTTI.length}` : ` · tutti e ${TUTTI.length} i difetti insieme`}`);

// ── 1, 2, 4 · LA VOLATA COLLEGATA ALLO STRUMENTO ──────────────────────────
console.log("\n· la volata agganciata alla lettura vera di V1: il bottone apre la scheda intera");
{
  const pg = await apri("nav-reg");
  const bottoni = await pg.$$eval("[data-foglio-vol]", (e) => e.map((x) => x.getAttribute("data-foglio-vol")));
  dice(bottoni.length >= 5, `ogni riga del registro ha il bottone della scheda (${bottoni.length})`, bottoni.join(","));
  const s = await scheda(pg, "sxf1");
  if (!s) nonMisurato("la riga della volata costruita (sxf1) non è arrivata a schermo");
  else {
    dice(s.aperture === 1, "⛔ il bottone apre UNA finestra", s.aperture);
    dice(s.doc.length > 300, "e ci scrive un documento", s.doc.slice(0, 120));
    dice(/Scheda della volata del 08\/06\/2026 — Fronte Ovest/.test(s.doc), "col titolo: data e fronte", s.doc.slice(0, 120));
    dice(/DATI DI ESEMPIO/.test(s.doc), "⛔ in dimostrazione il foglio dice in testa che sono dati di esempio", s.doc.slice(0, 160));
    dice(/PPV misurata 2,4 mm\/s · sismografo · Vibrazioni V1 — abitato Sud · 10:20/.test(s.doc), "la PPV con lo strumento e l'ora", (s.doc.match(/PPV misurata.{0,80}/) || [])[0]);
    dice(/Provenienza della lettura Misura importata dal file «V1_giugno\.csv»/.test(s.doc), "⛔ e la provenienza della lettura VERA della dimostrazione (importata da V1_giugno.csv)", (s.doc.match(/Provenienza.{0,120}/) || [])[0]);
    dice(!/L 0,5 · T 0,4 · V 0,9/.test(s.doc), "⛔ NON la lettura delle 17:40 dello stesso giorno: si sceglie per data E ora", (s.doc.match(/Componenti.{0,80}/) || [])[0]);
    dice(/Taratura coperta: certificato LAT 118-2026\/441, Centro LAT n\. 118, dal 10\/02\/2026 al 09\/02\/2027/.test(s.doc), "la taratura che copre quel giorno, col certificato", (s.doc.match(/Taratura.{0,120}/) || [])[0]);
    dice(/Comunicazione comunicata all'ente il 07\/06\/2026 \(PEC prot\. 2210\/2026\)/.test(s.doc), "la comunicazione all'ente col riferimento", (s.doc.match(/Comunicazione.{0,80}/) || [])[0]);
    // ── la regola del giudizio: le stesse decisioni dello schermo ─────────
    dice(/Limite che vale per il punto 5 mm\/s — soglia del ricettore «Casa Bianchi — via Cava 12»/.test(s.doc), "⛔ il limite è quello del RICETTORE, come sulla riga del punto (sogliaEfficace)", (s.doc.match(/Limite che vale.{0,100}/) || [])[0]);
    dice(/Riferimento della soglia soglia scritta sul ricettore «Casa Bianchi — via Cava 12», non da un riferimento normativo/.test(s.doc), "⛔ il riferimento è quello del valore che vale — il ricettore — non il preset del punto, anche se fanno 5 tutt'e due", (s.doc.match(/Riferimento della soglia.{0,160}/) || [])[0]);
    dice(/Esito rispetto al limite Conforme — 2,4 mm\/s su 5 mm\/s \(48% del limite\)/.test(s.doc), "il verdetto di statoMisura, col rapporto", (s.doc.match(/Esito rispetto.{0,80}/) || [])[0]);
    dice(/Frequenza e banda della soglia non giudicabile: la lettura non porta la frequenza/.test(s.doc), "⛔ la lettura della dimostrazione non ha la frequenza: si dice, non si inventa la banda", (s.doc.match(/Frequenza e banda.{0,100}/) || [])[0]);
    dice(/Vibrazione alle 10:35 Sig\.ra Verdi: Tremava il lampadario\. \[aperto\]/.test(s.doc), "il reclamo dello stesso giorno", (s.doc.match(/Reclami dello stesso giorno.{0,120}/) || [])[0]);
    dice(/Coincidenza di data, non una causa dimostrata/.test(s.doc), "⛔ dichiarato coincidenza, non causa", (s.doc.match(/Coincidenza.{0,80}/) || [])[0]);
    dice(/Distanza scalata \(SD\) 87,5/.test(s.doc), "la SD (350/√16 = 87,5)", (s.doc.match(/Distanza scalata.{0,30}/) || [])[0]);
    dice(celleMute(s.html).length === 0, "⛔ nessuna cella muta («—», vuota, «undefined», «NaN») nel foglio", celleMute(s.html).join(" | "));
    dice(/la registrazione originale dello strumento resta il documento di riferimento/.test(s.doc), "e il foglio dice che cosa NON è", s.doc.slice(-260));
    /* la lettura VERA di V1 nella dimostrazione porta solo il valore, non gli
       assi: quindi alla scheda manca UNA cosa sola, ed è quella. Il caso «non
       manca niente» sta in run-kpi con una lettura completa. */
    dice(/Che cosa manca in questa scheda Componenti dell'evento \(la lettura non porta assi, frequenza o aria\)\. Questi dati/.test(s.doc),
      "⛔ «che cosa manca» elenca UNA voce sola, le componenti che la lettura della dimostrazione non ha — non la previsione, non i reclami", (s.doc.match(/Che cosa manca.{0,160}/) || [])[0]);
    dice((s.html.match(/<td class="manca">/g) || []).length === 1, "e una sola cella è marcata come mancante", (s.html.match(/<td class="manca">/g) || []).length);
    dice(/Luogo e data Il direttore responsabile Il tecnico che ha eseguito la misura/.test(s.doc), "le tre firme in fondo", s.doc.slice(-300));
    dice(/la valutazione degli effetti resta del tecnico che firma/.test(s.doc), "e il piede dice che cosa la scheda NON decide", s.doc.slice(-200));
    dice(pg.__errori.length === 0, "senza errori di pagina", pg.__errori[0]);
  }
  await pg.close();
}

// ── 3 · LA VOLATA SENZA NIENTE COLLEGATO ──────────────────────────────────
console.log("\n· la volata b2 (niente PPV, niente previsione, niente reclami): ogni assenza a parole");
{
  const pg = await apri("nav-reg");
  const s = await scheda(pg, "b2");
  if (!s) nonMisurato("la riga della volata b2 della dimostrazione non è arrivata a schermo");
  else {
    dice(s.aperture === 1 && s.doc.length > 200, "la scheda si apre anche per lei", s.doc.slice(0, 100));
    dice(/PPV misurata non ancora collegata/.test(s.doc), "⛔ «non ancora collegata», non una cella vuota", (s.doc.match(/PPV misurata.{0,40}/) || [])[0]);
    dice(/PPV prevista nessuna previsione registrata/.test(s.doc), "«nessuna previsione registrata»", (s.doc.match(/PPV prevista.{0,40}/) || [])[0]);
    dice(/Punto di misura nessuno: PPV non collegata/.test(s.doc), "lo strumento dice perché non c'è", (s.doc.match(/Punto di misura.{0,40}/) || [])[0]);
    dice(/Reclami nessun reclamo registrato quel giorno/.test(s.doc), "⛔ «nessun reclamo registrato quel giorno»", (s.doc.match(/Reclami.{0,60}/) || [])[0]);
    dice(/Comunicazione nessuna comunicazione registrata/.test(s.doc), "e la comunicazione non fatta si dichiara", (s.doc.match(/Comunicazione.{0,50}/) || [])[0]);
    dice(/Limite che vale per il punto nessuna PPV collegata: niente da giudicare/.test(s.doc), "e la regola del giudizio dice che non c'è niente da giudicare", (s.doc.match(/Limite che vale.{0,80}/) || [])[0]);
    dice(!/Esito rispetto al limite/.test(s.doc), "⛔ senza misura nessun «Conforme»", (s.doc.match(/Esito rispetto.{0,60}/) || [])[0]);
    dice(celleMute(s.html).length === 0, "⛔ nessuna cella muta («—», vuota, «undefined», «NaN») nel foglio", celleMute(s.html).join(" | "));
    // ── 5 · e in fondo la sezione «che cosa manca», con le due voci vere ─────
    dice(/Che cosa manca in questa scheda Comunicazione \(nessuna comunicazione registrata\) · PPV misurata \(non ancora collegata\)\./.test(s.doc),
      "⛔ la sezione «Che cosa manca» elenca esattamente le due voci assenti, nell'ordine del foglio", (s.doc.match(/Che cosa manca.{0,160}/) || [])[0]);
    dice(!/Che cosa manca[^.]*Reclami/.test(s.doc), "⛔ e «nessun reclamo» NON è fra le mancanze: è un fatto registrato", (s.doc.match(/Che cosa manca.{0,160}/) || [])[0]);
    const marcate = (s.html.match(/<td class="manca">/g) || []).length;
    dice(marcate === 2, "e le celle marcate «manca» sono due, quante le voci", marcate);
    dice(/non li sostituisce con uno zero/.test(s.doc), "con la frase che dice che non si stima", (s.doc.match(/Questi dati.{0,120}/) || [])[0]);
  }
  await pg.close();
}

await b.close();
srv.close();

if (nonMisurati.length) {
  console.log("\n⚠️ NON HO GUARDATO (da leggere PRIMA dei KO):");
  for (const n of nonMisurati) console.log("  · " + n);
}
if (CONTROPROVA) {
  const attesi = SCELTI.length;
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${attesi}`);
  if (colpiti.size !== attesi) {
    console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO${nonMisurati.length ? `, ${nonMisurati.length} non misurati` : ""}`);
process.exit(ko > 0 || nonMisurati.length ? 1 : 0);

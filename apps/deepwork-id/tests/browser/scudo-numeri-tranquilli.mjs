/* I NUMERI DI SCUDO CHE MENTONO CON LA FACCIA TRANQUILLA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-numeri-tranquilli.mjs [--porta=8567]
     node scudo-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Le suite `node` provano i moduli; qui si guarda quello che
   l'utente LEGGE — la pastiglia, la nota del grafico, il foglio che esce dalla
   stampante, la voce della tendina. Il 03/08, chiamando le funzioni coi casi
   limite e poi aprendo la pagina, sono venuti fuori cinque punti in cui Scudo
   diceva una cosa tranquilla su un dato che nessuno aveva misurato:

   1. COPERTURA FORMAZIONE. `statoScadenza` sa dire quattro cose dal 03/08 e
      `coperturaFormazione` aveva tre secchi: il terzo era un `else`, quindi
      «senza data» finiva fra i REGOLARI. Con tre visite mediche dalla data
      illeggibile su quattro righe la pastiglia diceva «tutte regolari» in
      verde e la riga «4 in regola · 0 in scadenza · 0 scadute — su 4».
   2. IL MURO DELLE SCADENZE. Le stesse righe sparivano in due modi: quella
      con la data impossibile ma ben scritta («2026-13-45») finiva in `fuori`,
      cioè nella frase «Altre N scadenze cadono più in là»; quella con la data
      VUOTA non veniva contata da nessuna parte.
   3. LA MANSIONE CON UN ASSEGNATO CANCELLATO. `db.rimuovi("lavoratori", …)`
      toglie la persona e NON tocca `lavoratoriIds`: la riga cadeva nel
      `.filter(Boolean)` di `matriceMansione` e la pastiglia passava da «1/2»
      a «1/1», cioè dal giallo al verde. `organigrammaSicurezza`, nello stesso
      file, quel caso lo conta già (`senzaPersona`).
   4. LA CARTELLA DEL LAVORATORE STAMPATA. La sezione dei DPI leggeva
      `r.tipo.nome`, che per i tipi di DPI non esiste (ce l'hanno i tipi di
      PERMESSO, ed è da lì che la riga era stata copiata): il fallback
      funzionava sempre e sul foglio che si esibisce all'ispettore usciva la
      chiave interna — «maschera», «otoprotettori» — su tutte le voci. E lo
      stato della consegna non c'era: un DPI scaduto stampato identico a uno
      valido è la stessa omissione che `vuoti` esiste per impedire.
   5. LA TENDINA «CHI SEGNALA» della segnalazione near-miss: la voce chiede
      257 px e la tendina ne aveva 162 a 390 px e 242 a 320, quindi era
      tagliata su tutte e due le larghezze — e la parola che cadeva era
      «(facoltativo)», cioè quella che decide se uno il campo lo compila o lo
      salta. Difetti DUE: la base stretta (che si corregge allargando) e la
      voce lunga (che a 320 non si corregge allargando, perché la tendina
      prende già tutta la riga). Il racconto della MISURA, che ha sbagliato
      due volte prima di rispondere giusto, sta accanto al banco §5.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, NON NEL DOCUMENTO. Si aggiunge una riga
   alla risposta HTTP di `scudo-data.js` — cioè si passa dalla via vera, il
   modulo dati dell'app. Il file su disco non si tocca. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8567;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, col pezzo di pagina che li porta.
   Contati: una controprova che non sostituisce niente non prova niente. */
const DIFETTI = [
  // 1 · la pastiglia verde «tutte regolari» e la riga che non nomina il buco
  /* ⏱️ RI-ANCORATA il 02/09: la pagina non decide più colore e pastiglia con
     due ternari, li chiede a `statoCopertura` (il pezzo si è mosso perché è
     MIGLIORATO, come quasi sempre). Il difetto rimesso è lo stesso: la
     pastiglia che ignora il secchio «senza data». */
  ['const { cls, badge: lbl } = statoCopertura(c);',
   'const cls = c.scadute ? "danger" : (c.inScadenza ? "warn" : "ok");\n      const lbl = c.scadute ? c.scadute + (c.scadute === 1 ? " scaduta" : " scadute")\n                : (c.inScadenza ? c.inScadenza + " in scadenza" : "tutte regolari");'],
  /* ⏱️ RI-ANCORATA il 02/09: dopo «senza data» la riga porta i due secchi
     della verifica periodica; l'iniezione toglie sempre e solo «senza data». */
  ['${c.senzaData ? " · <b>" + c.senzaData + " senza data</b>" : ""}${c.verificheNegative ?',
   '${c.verificheNegative ?'],
  // 2 · la frase del muro che manda le righe illeggibili nel «più in là»
  ['const testoMuroSenzaData = (m) => m.senzaData', 'const testoMuroSenzaData = (m) => false'],
  // 3 · la pastiglia della mansione che conta solo chi è rimasto in anagrafica
  ['${r.totale || r.senzaPersona ? (r.requisitiIgnoti ? "?/" + r.assegnati : r.puo + "/" + r.assegnati) : "nessuno"}',
   '${r.totale ? (r.requisitiIgnoti ? "?/" + r.totale : r.puo + "/" + r.totale) : "nessuno"}'],
  ['${r.senzaPersona ? ` · <b>${r.senzaPersona} ${r.senzaPersona === 1 ? "assegnato non più in anagrafica" : "assegnati non più in anagrafica"}</b>` : ""}', ""],
  // 4 · il nome che non esiste e lo stato che non si stampava, sul foglio
  //     (⏱️ dal 05/09 le righe le compone `fogliaCartella` nel modulo: vedi DIFETTI_MODULO)
  // 4b · la bandiera `noto` del confronto, che prima non leggeva nessuno
  ['const andMin = avvisoAndamentoMinimo(c);', 'const andMin = null;'],
  ['const b = c.pochi ? ["tag", "Da leggere con prudenza"]\n          : (andMin ? ["warn", "Da confermare"] : (V[c.verso] || ["tag", "—"]));',
   'const b = c.pochi ? ["tag", "Da leggere con prudenza"] : (V[c.verso] || ["tag", "—"]);'],
  // 5 · la tendina stretta della segnalazione near-miss
  /* due difetti, non uno: la base stretta (che morde a 390) e la voce lunga
     (che morde a 320, dove larghezza da guadagnare non ce n'è) */
  ['id="nm-chi" title="Chi segnala" style="flex:1 1 240px;"', 'id="nm-chi" title="Chi segnala" style="flex:1 1 160px;"'],
  ['<option value="">Chi segnala (facoltativo)</option>', '<option value="">— chi segnala (facoltativo) —</option>'],
];

/* I CASI, aggiunti in coda al modulo dati: `DEMO` è un oggetto e la pagina ne
   fa una copia all'avvio. */
let FIXTURE = "";
/* Tre righe «Visita medica» con la data illeggibile in tre modi diversi (mese
   13, 30 febbraio, vuota) e nessun'altra riga di quel tipo, così la pastiglia
   di quel tipo è decisa SOLO da loro. */
const FIXTURE_DATE = `
DEMO.scadenze = DEMO.scadenze.filter(s => s.tipo !== "Visita medica");
DEMO.scadenze.push(
  { id: "zz1", lavoratoreId: DEMO.lavoratori[0].id, tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-13-45" },
  { id: "zz2", lavoratoreId: DEMO.lavoratori[0].id, tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-02-30" },
  { id: "zz3", lavoratoreId: DEMO.lavoratori[1].id, tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "" });
`;
/* ⛔ E UN DIFETTO CHE VIVE NEL MODULO, dal 02/09: la copertura per tipo che
   legge SOLO la data della prossima verifica e non lo stato della verifica
   (`statoVerificaPeriodica`). Con questo rimesso la riga «Verifica periodica»
   della dimostrazione torna verde «tutte regolari» mentre il Quadro, sugli
   stessi dati, ha una attrezzatura in rosso e una in giallo. Terzo elemento:
   il file, come in `scudo-documenti`. */
const DIFETTI_MODULO = [
  ['    const v = scadenzaDiVerifica(s) ? statoVerificaPeriodica(s, documenti, oggi) : null;',
   '    const v = null;', "apps/scudo/scudo-data.js"],
  // 4 · il nome che non esiste e lo stato che non si stampava, sul foglio (sul modulo dal 05/09)
  ['((c.verbale || {}).righe || []).map((r) => [String(r.tipo.etichetta || r.consegna.tipo || ""),',
   '((c.verbale || {}).righe || []).map((r) => [String(r.tipo.nome || r.consegna.tipo || ""),', "apps/scudo/scudo-data.js"],
  ['      + (r.stato === "scaduta" ? " · **da sostituire**" : r.stato === "in-scadenza" ? " · da sostituire a breve" : r.stato === "senza data" ? " · **senza data di sostituzione**" : "")',
   '', "apps/scudo/scudo-data.js"],
];
/* Un id assegnato a una mansione a cui in anagrafica non corrisponde nessuno:
   è quello che resta dopo aver tolto un lavoratore dall'anagrafica. */
const FIXTURE_FANTASMA = `
DEMO.mansioni[0].lavoratoriIds = [DEMO.lavoratori[0].id, "PERSONA-CANCELLATA"];
`;
/* Una consegna DPI scaduta e una senza data di sostituzione, alla prima
   persona: sono le due righe che il foglio stampava come tutte le altre. */
const FIXTURE_DPI = `
DEMO.dpi = (DEMO.dpi || []).filter(c => c.lavoratoreId !== DEMO.lavoratori[0].id);
DEMO.dpi.push(
  { id: "zd1", lavoratoreId: DEMO.lavoratori[0].id, tipo: "maschera", taglia: "M", dataConsegna: "2024-01-10", scadenza: "2025-01-10", addestramento: true, dataAddestramento: "2024-01-10" },
  { id: "zd2", lavoratoreId: DEMO.lavoratori[0].id, tipo: "otoprotettori", taglia: "U", dataConsegna: "2026-06-01", scadenza: "", addestramento: true, dataAddestramento: "2026-06-01" });
`;

/* Due anni misurati (le ore ci sono per tutti e due) con tre infortuni ciascuno
   e, nel più recente, uno la cui prognosi è ancora aperta: le sue giornate
   perse non sono ancora contate, quindi IG e LTIFR del 2026 sono minimi. */
const ANNO = new Date().getFullYear();
const FIXTURE_PROGNOSI = `
DEMO.infortuni = DEMO.infortuni.filter(x => x.tipo !== "infortunio");
DEMO.infortuni.push(
  { id: "zp1", tipo: "infortunio", data: "${ANNO - 1}-03-10", gravita: "lieve", giorniAssenza: 30, descrizione: "Caduta in piazzale", luogo: "Piazzale" },
  { id: "zp2", tipo: "infortunio", data: "${ANNO - 1}-06-10", gravita: "lieve", giorniAssenza: 20, descrizione: "Schiacciamento dito", luogo: "Officina" },
  { id: "zp3", tipo: "infortunio", data: "${ANNO - 1}-09-10", gravita: "lieve", giorniAssenza: 10, descrizione: "Distorsione caviglia", luogo: "Fronte" },
  { id: "zp4", tipo: "infortunio", data: "${ANNO}-02-10", gravita: "lieve", giorniAssenza: 2, descrizione: "Taglio alla mano", luogo: "Officina" },
  { id: "zp5", tipo: "infortunio", data: "${ANNO}-04-10", gravita: "lieve", giorniAssenza: 1, descrizione: "Contusione", luogo: "Piazzale" },
  { id: "zp6", tipo: "infortunio", data: "${ANNO}-05-10", gravita: "grave", giorniAssenza: "", descrizione: "Frattura, prognosi ancora aperta", luogo: "Fronte" });
DEMO.oreAnno = [{ id: "zo1", anno: ${ANNO - 1}, ore: 20000 }, { id: "zo2", anno: ${ANNO}, ore: 20000 }];
`;

let iniezioni = 0;
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/scudo/scudo-data.js") && FIXTURE) {
    corpo = Buffer.from(corpo.toString("utf8") + FIXTURE, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/scudo/scudo-data.js")) {
    let t = corpo.toString("utf8");
    // il terzo posto è il file: qui si LEGGE, così un'iniezione che dichiarasse
    // un altro file non morderebbe questo (05/09)
    for (const [a, b, f] of DIFETTI_MODULO) if ((!f || p.endsWith(f)) && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    iniezioni = colpiti.size;
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/scudo/index.html")) {
    let t = corpo.toString("utf8");
    /* ⚠️ SI CONTANO I DIFETTI RIMESSI, non le sostituzioni: la pagina viene
       caricata più volte e un conto crescente direbbe «24 su 8». */
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
   RIUSA non fallisce: misura la copia di qualcun altro. Si scrive un file nella
   radice servita e lo si rilegge DAL SERVER; se non torna, ci si ferma qui. */
const SEGNO = join(R, "__scudo-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-numeri-${process.pid}`)).text();
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
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

/* Apre Scudo e va in una sezione, PRETENDENDO la prova di aver navigato: un
   banco che non naviga risponde «tutto a posto» dopo aver guardato una
   schermata su otto. Il nome è quello del BOTTONE (`nav-scad`, `nav-pers`),
   non della sezione — e dentro Personale c'è una seconda navigazione a
   schede (`#pers-tabs [data-tab=…]`), che va pretesa anche lei: mansioni e
   DPI stanno lì, e senza il tocco sulla scheda si misurerebbe l'elenco dei
   lavoratori credendolo la matrice. */
async function apri(bottone, { tab = null, larghezza = 430 } = {}) {
  const pg = await b.newPage({ viewport: { width: larghezza, height: 1100 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html`);
  await pg.waitForTimeout(2400);
  await pg.click("#" + bottone).catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1, `navigato davvero (${bottone} → ${viste.join(",") || "nessuna pagina visibile"})`, viste);
  if (tab) {
    await pg.click(`#pers-tabs [data-tab="${tab}"]`).catch(() => {});
    await pg.waitForTimeout(500);
    const attiva = await pg.$eval("#pers-tabs .chg.active", (e) => e.getAttribute("data-tab")).catch(() => null);
    dice(attiva === tab, `scheda «${tab}» davvero aperta (attiva: ${attiva})`, attiva);
  }
  dice(errori.length === 0, "la pagina non solleva errori", errori[0]);
  return pg;
}
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

console.log(`\n════════ Scudo · i numeri tranquilli${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 e 2 · LE TRE VISITE MEDICHE DI CUI NON SI SA NIENTE ─────────────────
console.log("\n· tre «Visita medica» con la data illeggibile: la copertura e il muro");
FIXTURE = FIXTURE_DATE;
{
  const pg = await apri("nav-scad");
  const r = await pg.evaluate(() => {
    const it = [...document.querySelectorAll("#cop-list .item")]
      .find((e) => /Visita medica/.test(e.innerText));
    const muro = document.getElementById("graf-muro");
    /* ⚠️ La riga di dettaglio ha `-webkit-line-clamp:2`: una dichiarazione
       appesa in fondo è testo morto. Lo chiede al browser (`scrollHeight`
       contro `clientHeight`), non a un conto di caratteri. */
    const m = it && it.querySelector(".meta");
    return { riga: it ? it.innerText : null,
      badge: it && it.querySelector(".badge") ? it.querySelector(".badge").innerText : null,
      badgeCls: it && it.querySelector(".badge") ? it.querySelector(".badge").className : null,
      metaTagliata: m ? m.scrollHeight > m.clientHeight + 1 : null,
      muro: muro ? muro.innerText : null };
  });
  dice(r.riga != null, "la riga «Visita medica» è nella copertura", r);
  dice(!!r.badgeCls && !/\bok\b/.test(r.badgeCls),
    "⛔ la pastiglia NON è verde: tre date che non si leggono non sono «tutte regolari»",
    r.badge + " · " + r.badgeCls);
  dice(!/tutte regolari/.test(r.riga || ""),
    "⛔ e non c'è scritto «tutte regolari»", r.riga);
  /* ⚠️ Il NUMERO, non solo la parola: «senza data» da sola passerebbe anche
     se la riga ne dichiarasse una invece di tre. E il testo è quello corto
     perché la riga è tagliata a due righe (vedi il commento nella pagina). */
  dice(/3 senza data/i.test(r.riga || ""),
    "⛔ la riga dichiara QUANTE date non si leggono", r.riga);
  dice(!/3 in regola/.test(r.riga || ""),
    "e le tre illeggibili non sono contate «in regola»", r.riga);
  dice(r.metaTagliata === false,
    "e la dichiarazione non finisce nel testo tagliato a due righe", r.riga);
  dice(!/Altre 3 scadenze cadono più in là/.test(r.muro || ""),
    "⛔ il muro non racconta le date illeggibili come «cadono più in là»",
    (String(r.muro || "").match(/[^.]*più in là[^.]*\./) || [])[0]);
  dice(/non si può leggere/.test(r.muro || ""),
    "⛔ e le nomina per quello che sono", r.muro);
  await pg.close();
}

// ── 3 · LA MANSIONE CON UN ASSEGNATO CHE NON C'È PIÙ ──────────────────────
// ── 1b · LA VERIFICA PERIODICA NELLA COPERTURA PER TIPO (02/09) ────────────
/* Il caso è nella DIMOSTRAZIONE stessa, e non invecchia: la piattaforma ha le
   prescrizioni scadute dal 15/07/2026 (una data passata resta passata) e il
   carrello non ha nessun esito. Misurato prima della correzione: la riga
   diceva «3 in regola · 0 in scadenza · 0 scadute — su 3» con la pastiglia
   VERDE «tutte regolari», e quindici righe sotto la stessa schermata scriveva
   «1 con prescrizioni scadute · 1 mai verificata, su 3 verifiche registrate». */
console.log("\n· la riga «Verifica periodica» della copertura legge la VERIFICA, non solo la data");
FIXTURE = "";
{
  const pg = await apri("nav-scad");
  const r = await pg.evaluate(() => {
    const it = [...document.querySelectorAll("#cop-list .item")].find((e) => /^\s*Verifica periodica/.test(e.innerText));
    const m = it && it.querySelector(".meta");
    const nota = document.getElementById("scad-list") ? document.getElementById("page-scad").innerText : "";
    return { riga: it ? it.innerText.replace(/\s+/g, " ") : null,
      badgeCls: it && it.querySelector(".badge") ? it.querySelector(".badge").className : null,
      metaTagliata: m ? m.scrollHeight > m.clientHeight + 1 : null,
      /* la frase di `verificheDaSistemare` sulla stessa schermata: è il numero con cui la riga deve andare d'accordo */
      quadro: (nota.match(/\d+ con prescrizioni scadute[^.]*/) || [""])[0] };
  });
  dice(r.riga != null, "la riga «Verifica periodica» è nella copertura", r);
  dice(!!r.badgeCls && !/\bok\b/.test(r.badgeCls),
    "⛔ la pastiglia NON è verde: una verifica con prescrizioni scadute non è «tutte regolari»", r.badgeCls);
  dice(/1 negativa/.test(r.riga || "") && /1 incerta/.test(r.riga || ""),
    "⛔ la riga dice QUANTE verifiche sono negative e quante incerte", r.riga);
  dice(!/3 in regola/.test(r.riga || ""), "e le tre non sono contate «in regola»", r.riga);
  dice(/1 con prescrizioni scadute/.test(r.quadro), "e la stessa schermata, più sotto, conta la stessa prescrizione scaduta", r.quadro);
  dice(r.metaTagliata === false, "e il dettaglio non finisce nel testo tagliato a due righe (a 430 px)", r.riga);
  await pg.close();
}

console.log("\n· una mansione con un assegnato non più in anagrafica");
FIXTURE = FIXTURE_FANTASMA;
{
  const pg = await apri("nav-pers", { tab: "mans" });
  const r = await pg.evaluate(() => {
    /* Si cerca per NOME e non `.item:first-child`: `riepilogoMansioni` ordina
       (e da oggi `senzaPersona` entra nell'ordine), quindi il primo posto non
       è quello della mansione che stiamo guardando. */
    const it = [...document.querySelectorAll("#mans-list .item")]
      .find((e) => /Escavatorista/.test(e.innerText));
    if (!it) return null;
    const badge = it.querySelector(".badge");
    return { riga: it.innerText, badge: badge ? badge.innerText : null,
      titolo: badge ? badge.getAttribute("title") : null, cls: it.className };
  });
  dice(r != null, "la mansione è in elenco", r);
  dice(!!r && /\/2\b/.test(r.badge || ""),
    "⛔ la pastiglia conta gli ASSEGNATI (2), non solo chi è rimasto in anagrafica",
    r && r.badge);
  dice(!!r && /non più in anagrafica/.test(r.riga || ""),
    "⛔ e la riga lo dice per nome", r && r.riga);
  /* ⚠️ La prima stesura pretendeva `st-warn` e cadeva su un caso SANO: in
     dimostrazione quella mansione è già ROSSA per un corso mancante, e il
     rosso vince sull'avviso — giustamente. La domanda giusta non è «di che
     colore è» ma «non è verde»: quello che il difetto faceva era togliere il
     colore, non cambiarlo di grado. */
  dice(!!r && !/st-ok/.test(r.cls || ""),
    "la mansione non resta verde con un assegnato di cui non si sa niente", r && r.cls);
  await pg.close();
}

// ── 4 · LA CARTELLA CHE SI ESIBISCE ALL'ISPETTORE ─────────────────────────
console.log("\n· il foglio della cartella del lavoratore, con un DPI scaduto e uno senza data");
FIXTURE = FIXTURE_DPI;
{
  const pg = await apri("nav-pers", { tab: "dpi" });
  /* Il foglio vive in `#verbale`, invisibile sullo schermo: si costruisce
     premendo il bottone vero e si legge da lì. La modale di conferma va
     accettata, e `window.print` va zittita. */
  await pg.evaluate(() => { window.print = () => {}; });
  await pg.selectOption("#dpi-verb-lav", { index: 1 }).catch(() => {});
  await pg.click("#btn-cartella").catch(() => {});
  await pg.waitForTimeout(500);
  await pg.evaluate(() => {
    const b = [...document.querySelectorAll(".modal-ov button, .modal button")]
      .find((x) => /stampa/i.test(x.textContent));
    if (b) b.click();
  });
  await pg.waitForTimeout(600);
  const foglio = testo(await pg.$eval("#verbale", (e) => e.innerHTML).catch(() => ""));
  dice(foglio.length > 400, "il foglio è stato costruito", foglio.length);
  dice(!/\bmaschera\b/.test(foglio) && !/\botoprotettori\b/.test(foglio),
    "⛔ sul foglio non compaiono le CHIAVI interne dei DPI", foglio);
  dice(/Facciale filtrante/.test(foglio),
    "⛔ ma il nome per esteso del dispositivo", (foglio.match(/[^·]*Facciale[^·]*/) || [])[0] || foglio);
  dice(/da sostituire/.test(foglio),
    "⛔ e il DPI scaduto è dichiarato scaduto, non stampato come gli altri",
    (foglio.match(/[^·]*sostituire[^·]*/) || [])[0] || foglio);
  dice(/senza data di sostituzione/.test(foglio),
    "⛔ e quello senza data di sostituzione pure", foglio);
  await pg.close();
}

// ── 4b · L'ANDAMENTO DEGLI INDICI CON UNA PROGNOSI ANCORA APERTA ──────────
/* La bandiera `noto` del confronto era dichiarata dal modulo e non la leggeva
   nessuno: la scheda usciva VERDE «In miglioramento» su un indice di gravità
   e un LTIFR che devono ancora salire. Sei infortuni perché il confronto non
   finisca in `pochi`, che ha già una difesa sua. */
console.log("\n· l'andamento degli indici con un infortunio a prognosi ancora aperta");
FIXTURE = FIXTURE_PROGNOSI;
{
  const pg = await apri("nav-doc");
  const r = await pg.evaluate(() => {
    const el = document.getElementById("inf-andamento");
    if (!el) return null;
    const b = el.querySelector(".badge");
    return { testo: el.innerText, badge: b ? b.innerText : null, cls: b ? b.className : null };
  });
  dice(r != null && /Andamento/.test(r.testo || ""), "la scheda dell'andamento è disegnata", r);
  dice(!!r && !/badge ok/.test(r.cls || ""),
    "⛔ la pastiglia NON è verde: il verso è letto su giornate perse ancora da contare",
    r && r.badge + " · " + r.cls);
  dice(!!r && /MINIMI/.test(r.testo || ""),
    "⛔ e la scheda dice che indice di gravità e LTIFR sono minimi", r && r.testo);
  dice(!!r && /prognosi di un infortunio è ancora aperta/.test(r.testo || ""),
    "⛔ dicendo anche dove", r && r.testo);
  dice(!!r && /migliora/.test(r.testo || ""),
    "e il confronto NON si nasconde: il verso calcolato resta scritto", r && r.testo);
  await pg.close();
}

// ── 5 · LA TENDINA «CHI SEGNALA» SUL TELEFONO ─────────────────────────────
/* ⚠️ LA DOMANDA GIUSTA, E CI SONO VOLUTI DUE TENTATIVI.
   Primo errore: `scrollWidth > clientWidth`. Una `<select>` non scorre mai —
   i due numeri sono sempre uguali — quindi la risposta era sempre «no».
   Secondo errore, più insidioso perché SEMBRA una misura: la larghezza del
   testo col font effettivo contro `clientWidth` meno i padding. Rispondeva
   «209 px di testo in 214 di spazio: ci sta» su una voce che nello scatto era
   tagliata di netto, perché la FRECCIA nativa del `<select>` si prende una
   ventina di pixel DENTRO il riquadro e non è un padding: non compare in
   nessuna proprietà calcolata. Un banco che sbaglia in quel verso è peggio di
   nessun banco — dice pulito su un difetto che si vede a occhio.
   La versione buona non calcola niente: clona la tendina (stesse classi,
   stesso stile ereditato) a `width:max-content` e chiede al browser quanto le
   SERVE per mostrare quella voce, freccia compresa. È la regola già scritta:
   se il browser sa rispondere, non si fa il conto a mano.
   Numeri veri: la voce vecchia chiedeva 257 px, la tendina ne aveva 162 a 390
   e 242 a 320. */
console.log("\n· la tendina «chi segnala» della segnalazione near-miss, a 390 e a 320");
FIXTURE = "";
for (const W of [390, 320]) {
  const pg = await apri("nav-dash", { larghezza: W });
  await pg.click("#btn-nm").catch(() => {});
  await pg.waitForTimeout(700);
  const m = await pg.evaluate(() => {
    const el = document.getElementById("nm-chi");
    if (!el) return null;
    /* Il clone porta con sé classi e stile ereditato; `max-content` toglie il
       vincolo del flex e lascia che il browser dica la larghezza NATURALE,
       cioè testo + padding + freccia. Vive fuori schermo e si toglie subito. */
    const c = el.cloneNode(false);
    const o = document.createElement("option"); o.text = el.options[0].text;
    c.appendChild(o);
    c.style.position = "absolute"; c.style.left = "-9999px";
    c.style.width = "max-content"; c.style.maxWidth = "none"; c.style.flex = "none";
    el.parentElement.appendChild(c);
    const serve = Math.ceil(c.getBoundingClientRect().width);
    c.remove();
    return { voce: el.options[0].text, serve,
      largo: Math.round(el.getBoundingClientRect().width) };
  });
  dice(m != null, `@${W} la tendina c'è`, m);
  dice(!!m && m.serve <= m.largo,
    `⛔ @${W} la voce «chi segnala» ci sta per intero`
    + (m ? ` (le servono ${m.serve} px, la tendina ne è larga ${m.largo})` : ""), m);
  dice(!!m && /facoltativo/i.test(m.voce),
    `@${W} e resta scritto che il campo è facoltativo`, m && m.voce);
  await pg.close();
}

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  const QUANTI = DIFETTI.length + DIFETTI_MODULO.length;
  console.log(`iniezioni: ${iniezioni} difetti su ${QUANTI} rimessi nella risposta HTTP (${DIFETTI.length} nella pagina, ${DIFETTI_MODULO.length} nel modulo)`);
  if (iniezioni < QUANTI) {
    console.log("⚠️ QUALCHE DIFETTO NON È STATO RIMESSO: la controprova non prova quello che dice");
    process.exit(3);
  }
  console.log(ko >= 10 ? "✓ il banco SA fallire: rimessi i difetti cadono le prove giuste"
                      : `⚠️ troppo poche cadute (${ko})`);
  process.exit(ko >= 10 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

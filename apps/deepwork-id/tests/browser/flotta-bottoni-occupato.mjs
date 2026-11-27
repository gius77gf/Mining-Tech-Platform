/* FLOTTA: MAGAZZINO RICAMBI, MEZZI E ORDINE DI LAVORO SENZA GUARDIA CONTRO
   IL DOPPIO TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-bottoni-occupato.mjs                 (porta effimera)
     node flotta-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Flotta (18/09), tre
   casi:
   · i bottoni +1/-1 del magazzino ricambi (`<span role="button">`, non
     `<button>`: niente `.disabled` nativo) leggono `RIC` in memoria per
     calcolare la nuova giacenza — un doppio tocco quasi simultaneo può
     perdere un aggiornamento su rete vera (lost update). Corretto con un
     `Set` di id "in volo" che blocca un secondo tocco sullo stesso
     ricambio finché il primo non è tornato;
   · «Aggiungi» sui Mezzi (btn-mez): la guardia contro i doppioni legge MEZ
     stantio;
   · «Registra ore»/manodopera sull'ordine di lavoro (btn-odl-mano): una
     riga di manodopera può sparire nel doppio tocco (lost update).

   ⚠️ NOTA DI METODO (misurata oggi su Campo/audit-residui, e di nuovo qui):
   per «Aggiungi mezzo» e «manodopera sull'ordine», in dimostrazione
   `db.aggiungi`/`db.aggiorna` scrivono SINCRONAMENTE sullo stesso oggetto
   che i controlli "esiste già"/"riga già scritta" leggono (per
   riferimento, non una copia): un doppio `.click()` nativo non produce
   quindi un vero doppione né una riga persa in demo, con o senza la
   guardia — la domanda che REGGE è se il bottone si disabilita SUBITO al
   tocco. Il caso del magazzino ricambi è DIVERSO: il `Set` "in volo" è un
   controllo sincrono puro (non legge dati), quindi qui il conteggio del
   doppio tocco è una prova valida e diretta, in entrambe le direzioni. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/flotta/index.html",
   "    const ricPiu = attr(e, \"data-ric-piu\");\n"
   + "    if (ricPiu) { if (ricInVolo.has(ricPiu)) return; const r = RIC.find(x => x.id === ricPiu);\n"
   + "      if (r) { ricInVolo.add(ricPiu); await db.aggiorna(\"ricambi\", r.id, { giacenza: (+r.giacenza || 0) + 1 }); ricInVolo.delete(ricPiu); await refresh(); } return; }\n"
   + "    const ricMeno = attr(e, \"data-ric-meno\");\n"
   + "    if (ricMeno) { if (ricInVolo.has(ricMeno)) return; const r = RIC.find(x => x.id === ricMeno);\n"
   + "      if (r) { ricInVolo.add(ricMeno); await db.aggiorna(\"ricambi\", r.id, { giacenza: Math.max(0, (+r.giacenza || 0) - 1) }); ricInVolo.delete(ricMeno); await refresh(); } return; }",
   "    const ricPiu = attr(e, \"data-ric-piu\");\n"
   + "    if (ricPiu) { const r = RIC.find(x => x.id === ricPiu);\n"
   + "      if (r) { await db.aggiorna(\"ricambi\", r.id, { giacenza: (+r.giacenza || 0) + 1 }); await refresh(); } return; }\n"
   + "    const ricMeno = attr(e, \"data-ric-meno\");\n"
   + "    if (ricMeno) { const r = RIC.find(x => x.id === ricMeno);\n"
   + "      if (r) { await db.aggiorna(\"ricambi\", r.id, { giacenza: Math.max(0, (+r.giacenza || 0) - 1) }); await refresh(); } return; }"],
  ["apps/flotta/index.html",
   "    const possessoDal = $(\"mez-possesso-dal\").value || null;\n"
   + "    /* ⛔ 18/09, dal secondo giro di deep-pass QA: la guardia contro i\n"
   + "       doppioni qui sopra legge MEZ in memoria, aggiornato solo da refresh()\n"
   + "       più in basso — un doppio tocco la passa due volte e crea due mezzi\n"
   + "       omonimi. */\n"
   + "    occupato(\"btn-mez\", true);\n"
   + "    if (editMez) {",
   "    const possessoDal = $(\"mez-possesso-dal\").value || null;\n"
   + "    if (editMez) {"],
  ["apps/flotta/index.html",
   "      // `occupato(false)` PRIMA di riscrivere l'etichetta: se corresse dopo,\n"
   + "      // restituirebbe il testo catturato al tocco (\"Salva modifica\"),\n"
   + "      // cancellando il cambio di modo appena fatto.\n"
   + "      occupato(\"btn-mez\", false);\n"
   + "      editMez = null; $(\"btn-mez\").textContent = \"Aggiungi\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"mezzi\", { nome, area, ore, stato: \"operativo\", tipo, messaInServizio: $(\"mez-servizio\").value || null, costoPossessoAnnuo, possessoDal });\n"
   + "      occupato(\"btn-mez\", false);\n"
   + "    }",
   "      editMez = null; $(\"btn-mez\").textContent = \"Aggiungi\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"mezzi\", { nome, area, ore, stato: \"operativo\", tipo, messaInServizio: $(\"mez-servizio\").value || null, costoPossessoAnnuo, possessoDal });\n"
   + "    }"],
  ["apps/flotta/index.html",
   "    $(\"odl-chi\").value = \"\"; $(\"odl-ore\").value = \"\";\n"
   + "    /* ⛔ 18/09, dal secondo giro di deep-pass QA: `o.manodopera` viene da MAN\n"
   + "       in memoria, aggiornato solo dentro `salvaOrdine` → `refresh()`. Un\n"
   + "       doppio tocco costruisce due `patch` dallo stesso array stantio e\n"
   + "       `db.aggiorna` sovrascrive: una delle due righe di manodopera sparisce\n"
   + "       (lost update), misurato dal vivo. */\n"
   + "    occupato(\"btn-odl-mano\", true);\n"
   + "    await salvaOrdine(n, patch, v.chi + \": \" + oreTx(v.ore)",
   "    $(\"odl-chi\").value = \"\"; $(\"odl-ore\").value = \"\";\n"
   + "    await salvaOrdine(n, patch, v.chi + \": \" + oreTx(v.ore)"],
  ["apps/flotta/index.html",
   "      + (avanza ? \". Il lavoro passa « in lavorazione ».\" : \".\"));\n"
   + "    occupato(\"btn-odl-mano\", false);\n"
   + "    fuoco(\"odl-chi\");",
   "      + (avanza ? \". Il lavoro passa « in lavorazione ».\" : \".\"));\n"
   + "    fuoco(\"odl-chi\");"],
];
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("mez-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Flotta è pronta (in dimostrazione)");

/* ── 1. magazzino ricambi: doppio tocco sincrono, prova per conteggio ── */
await vaiA(pg, "flotta", "nav-man");
const primoRicambio = await pg.evaluate(() => document.querySelector("#ric-list [data-ric-piu]")?.getAttribute("data-ric-piu"));
dice(!!primoRicambio, "la dimostrazione ha almeno un ricambio a magazzino", primoRicambio);
if (primoRicambio) {
  const leggiGiacenza = () => pg.evaluate((id) => {
    const el = document.querySelector(`[data-ric-piu="${id}"]`)?.closest(".item");
    const m = el && el.querySelector(".meta")?.textContent.match(/giacenza\s+(-?[\d.,]+)/i);
    return m ? Number(m[1].replace(/\./g, "").replace(",", ".")) : null;
  }, primoRicambio);
  const prima = await leggiGiacenza();
  dice(prima != null, "la giacenza di partenza si legge dalla riga", prima);
  /* due `.click()` nativi nello stesso turno di script: garantiscono che il
     secondo tocco arrivi mentre il primo handler è ancora fermo sul primo
     `await`. Con la guardia (`ricInVolo`), il secondo tocco è un no-op
     sincrono — nessun secondo `db.aggiorna` parte — e la giacenza sale di
     UNO, non due: è un controllo puramente sincrono (un `Set`, non una
     lettura di dati), quindi il conteggio è una prova valida indipendente
     da come il backend gestisce la scrittura. */
  await pg.evaluate((id) => { const b = document.querySelector(`[data-ric-piu="${id}"]`); b.click(); b.click(); }, primoRicambio);
  await pg.waitForTimeout(500);
  const dopo = await leggiGiacenza();
  dice(dopo === prima + 1, `⛔ due tocchi quasi simultanei incrementano di UNO, non due (${prima} -> ${dopo})`, { prima, dopo });
}

/* ── 2. Mezzi: il bottone si disabilita SUBITO al tocco ── */
await vaiA(pg, "flotta", "nav-mez");
await pg.fill("#mez-nome", "Prova Sincrona " + Date.now());
const mezSubito = await pg.evaluate(() => {
  const b = document.getElementById("btn-mez");
  if (!b || b.disabled) return { saltato: true };
  b.click();
  return { disabled: b.disabled };
});
dice(mezSubito.saltato || mezSubito.disabled === true, "⛔ Mezzi · «Aggiungi» si disabilita SUBITO al tocco", mezSubito);
await pg.waitForTimeout(500);
const mezDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-mez")?.disabled, testo: document.getElementById("btn-mez")?.textContent }));
dice(mezDopo.disabled === false && mezDopo.testo === "Aggiungi", "e si riaccende con l'etichetta di sempre", mezDopo);

/* ── 3. Ordine di lavoro: manodopera, il bottone si disabilita SUBITO ── */
await vaiA(pg, "flotta", "nav-man");
const primoOrdine = await pg.evaluate(() => document.querySelector("[data-odl-man]")?.getAttribute("data-odl-man"));
dice(!!primoOrdine, "la dimostrazione ha almeno un ordine di lavoro", primoOrdine);
if (primoOrdine) {
  await pg.evaluate((id) => { document.querySelector(`[data-odl-man="${id}"]`)?.click(); }, primoOrdine);
  await pg.waitForTimeout(300);
  await pg.fill("#odl-chi", "Prova Sincrona");
  await pg.fill("#odl-ore", "2");
  const manoSubito = await pg.evaluate(() => {
    const b = document.getElementById("btn-odl-mano");
    if (!b || b.disabled) return { saltato: true };
    b.click();
    return { disabled: b.disabled };
  });
  dice(manoSubito.saltato || manoSubito.disabled === true, "⛔ Ordine di lavoro · «Registra ore» si disabilita SUBITO al tocco", manoSubito);
  await pg.waitForTimeout(500);
  const manoDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-odl-mano")?.disabled }));
  dice(manoDopo.disabled === false, "e si riaccende a scrittura conclusa", manoDopo);
}

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

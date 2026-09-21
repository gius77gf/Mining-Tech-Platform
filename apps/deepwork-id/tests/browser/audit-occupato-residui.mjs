/* SCUDO/SENTINELLA/CONTI: QUATTRO BOTTONI RESIDUI SENZA "OCCUPATO", TROVATI
   DALL'AUDIT SUL PATTERN NATO OGGI
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node audit-occupato-residui.mjs                 (porta effimera)
     node audit-occupato-residui.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA (18/09), un agente ha
   passato al setaccio i bottoni di scrittura di Scudo/Campo/Conti/
   Sentinella/Genesi cercando quelli senza "occupato" (il pattern nato lo
   stesso giorno in Flotta e promosso a shared/dw-app-ui.js). Chiuso il
   grosso del lavoro (Campo, in campo-bottoni-occupato.mjs), restano quattro
   bottoni verificati uno per uno sul codice vero — non sulla parola
   dell'agente:
   · Scudo «Registra» (btn-inf) — nessuna guardia: un doppio tocco scrive
     due volte lo stesso infortunio/near-miss nel registro obbligatorio;
   · Scudo «Aggiungi» sulle Scadenze (btn-add-scad) — stessa famiglia;
   · Sentinella «Registra» sulle Volate (btn-vol) — stessa famiglia, sul
     brogliaccio esplosivi;
   · Conti «Registra DDT» (btn-pes) — il più serio: `numeroProssimoDdt`
     legge PES in memoria (aggiornato solo da refresh()) per calcolare il
     PROSSIMO numero di DDT. Un doppio tocco calcolerebbe lo stesso numero
     due volte, scrivendo due pesate con lo stesso numero di documento.

   ⚠️ NOTA DI METODO (già misurata oggi su Campo): in dimostrazione
   `db.aggiungi` scrive SINCRONAMENTE nello stesso array che questi
   controlli leggono (per riferimento, non una copia) — quindi un doppio
   `.click()` nativo non produce mai un vero doppione qui, con o senza
   `occupato`: la domanda che REGGE, indipendente dal backend, è se il
   bottone si disabilita SUBITO al tocco. È quello che questo banco misura,
   per tutti e quattro. */
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
  ["apps/scudo/index.html",
   "    err(\"inf-data\", false);\n"
   + "    const tipo = $(\"inf-tipo\").value;\n"
   + "    // ⛔ 18/09, dall'audit sul pattern \"occupato\" (nato oggi in\n"
   + "    // Flotta/Terra/Conti/Campo): nessuna guardia qui — un doppio tocco\n"
   + "    // registra due volte lo stesso infortunio nel registro obbligatorio.\n"
   + "    occupato(\"btn-inf\", true);",
   "    err(\"inf-data\", false);\n"
   + "    const tipo = $(\"inf-tipo\").value;"],
  ["apps/scudo/index.html",
   "      denunciaNumero: tipo === \"infortunio\" ? ($(\"inf-denuncia-numero\").value.trim() || null) : null,\n"
   + "    });\n"
   + "    occupato(\"btn-inf\", false);",
   "      denunciaNumero: tipo === \"infortunio\" ? ($(\"inf-denuncia-numero\").value.trim() || null) : null,\n"
   + "    });"],
  ["apps/scudo/index.html",
   "    err(\"new-scad-desc\", false); err(\"new-scad-data\", false);\n"
   + "    // stessa famiglia di \"btn-inf\": nessuna guardia, un doppio tocco crea\n"
   + "    // due scadenze identiche.\n"
   + "    occupato(\"btn-add-scad\", true);\n"
   + "    await db.aggiungi(\"scadenze\", { lavoratoreId: $(\"new-scad-lav\").value || null, tipo: $(\"new-scad-tipo\").value, descrizione, dataScadenza });\n"
   + "    occupato(\"btn-add-scad\", false);",
   "    err(\"new-scad-desc\", false); err(\"new-scad-data\", false);\n"
   + "    await db.aggiungi(\"scadenze\", { lavoratoreId: $(\"new-scad-lav\").value || null, tipo: $(\"new-scad-tipo\").value, descrizione, dataScadenza });"],
  ["apps/sentinella/index.html",
   "    err(\"vol-data\", false);\n"
   + "    // ⛔ 18/09, dall'audit sul pattern \"occupato\": nessuna guardia — un\n"
   + "    // doppio tocco registra due volte la stessa volata nel brogliaccio.\n"
   + "    occupato(\"btn-vol\", true);",
   "    err(\"vol-data\", false);"],
  ["apps/sentinella/index.html",
   "      esito: $(\"vol-esito\").value, note: \"\",\n"
   + "    });\n"
   + "    occupato(\"btn-vol\", false);",
   "      esito: $(\"vol-esito\").value, note: \"\",\n"
   + "    });"],
  ["apps/conti/index.html",
   "    /* ⛔ 18/09, dall'audit sul pattern \"occupato\": `numeroProssimoDdt` legge\n"
   + "       PES in memoria, aggiornato solo da refresh() più in basso — un doppio\n"
   + "       tocco rapido calcola lo STESSO numero di DDT due volte e scrive due\n"
   + "       pesate con lo stesso numero (un doppione sul documento di trasporto,\n"
   + "       da lì in fattura). */\n"
   + "    occupato(\"btn-pes\", true);",
   ""],
  ["apps/conti/index.html",
   "      vettore: curaTr === \"vettore\" ? (vettore || null) : null });\n"
   + "    occupato(\"btn-pes\", false);",
   "      vettore: curaTr === \"vettore\" ? (vettore || null) : null });"],
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
const errori = [];

/* domanda comune ai quattro casi: il bottone si disabilita SUBITO al tocco,
   prima che la scrittura risponda (indipendente dalla velocità del backend) */
async function subitoDisabilitato(pg, btnId) {
  return pg.evaluate((id) => {
    const b = document.getElementById(id);
    if (!b || b.disabled) return { saltato: true };
    b.click();
    return { disabled: b.disabled };
  }, btnId);
}

/* ── Scudo: infortuni + scadenze ── */
{
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
  pg.on("pageerror", (e) => errori.push("scudo: " + e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("scad-list")?.innerHTML.length || 0) > 0); }
  dice(pronto, "la pagina di Scudo è pronta (in dimostrazione)");

  await vaiA(pg, "scudo", "nav-doc");
  const oggiIso = await pg.evaluate(() => new Date().toISOString().slice(0, 10));
  await pg.fill("#inf-data", oggiIso);
  await pg.fill("#inf-desc", "Prova audit occupato");
  const infSubito = await subitoDisabilitato(pg, "btn-inf");
  dice(infSubito.saltato || infSubito.disabled === true, "⛔ Scudo · «Registra» (infortuni) si disabilita SUBITO al tocco", infSubito);
  await pg.waitForTimeout(500);
  const infDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-inf")?.disabled, esito: document.getElementById("inf-esito")?.textContent || "" }));
  dice(infDopo.disabled === false, "e si riaccende a scrittura conclusa", infDopo);
  dice(/registrato/i.test(infDopo.esito), "l'evento risulta registrato", infDopo);

  await vaiA(pg, "scudo", "nav-scad");
  await pg.fill("#new-scad-desc", "Prova audit occupato");
  await pg.fill("#new-scad-data", "2027-03-01");
  const scadSubito = await subitoDisabilitato(pg, "btn-add-scad");
  dice(scadSubito.saltato || scadSubito.disabled === true, "⛔ Scudo · «Aggiungi» (scadenze) si disabilita SUBITO al tocco", scadSubito);
  await pg.waitForTimeout(500);
  const scadDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-add-scad")?.disabled, esito: document.getElementById("scad-esito")?.textContent || "" }));
  dice(scadDopo.disabled === false, "e si riaccende a scrittura conclusa", scadDopo);
  dice(/aggiunta/i.test(scadDopo.esito), "la scadenza risulta aggiunta", scadDopo);
  await pg.close();
}

/* ── Sentinella: volate ── */
{
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
  pg.on("pageerror", (e) => errori.push("sentinella: " + e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/sentinella/index.html`);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("ade-list")?.innerHTML.length || document.body.textContent.length) > 200); }
  dice(pronto, "la pagina di Sentinella è pronta (in dimostrazione)");

  await vaiA(pg, "sentinella", "nav-reg");
  const oggiIsoS = await pg.evaluate(() => new Date().toISOString().slice(0, 10));
  await pg.fill("#vol-data", oggiIsoS);
  const volSubito = await subitoDisabilitato(pg, "btn-vol");
  dice(volSubito.saltato || volSubito.disabled === true, "⛔ Sentinella · «Registra» (volate) si disabilita SUBITO al tocco", volSubito);
  await pg.waitForTimeout(500);
  const volDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-vol")?.disabled, esito: document.getElementById("vol-esito-msg")?.textContent || "" }));
  dice(volDopo.disabled === false, "e si riaccende a scrittura conclusa", volDopo);
  dice(/registrata/i.test(volDopo.esito), "la volata risulta registrata nel brogliaccio", volDopo);
  await pg.close();
}

/* ── Conti: pesate/DDT ── */
{
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
  pg.on("pageerror", (e) => errori.push("conti: " + e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("fat-list")?.innerHTML.length || 0) > 0); }
  dice(pronto, "la pagina di Conti è pronta (in dimostrazione)");

  await vaiA(pg, "conti", "nav-pes");
  await pg.selectOption("#pes-cli", { index: 1 });
  await pg.selectOption("#pes-prod", { index: 1 });
  await pg.fill("#pes-lordo", "32,5");
  await pg.fill("#pes-tara", "14,2");
  const pesSubito = await subitoDisabilitato(pg, "btn-pes");
  dice(pesSubito.saltato || pesSubito.disabled === true, "⛔ Conti · «Registra DDT» (pesate) si disabilita SUBITO al tocco — il numero del DDT è il caso più serio", pesSubito);
  await pg.waitForTimeout(500);
  const pesDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-pes")?.disabled, esito: document.getElementById("pes-esito")?.textContent || "" }));
  dice(pesDopo.disabled === false, "e si riaccende a scrittura conclusa", pesDopo);
  dice(/DDT \S+ registrato/i.test(pesDopo.esito), "il DDT risulta registrato", pesDopo);
  await pg.close();
}

dice(errori.length === 0, "nessun errore di pagina, su tutte e tre le app", errori.slice(0, 5));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

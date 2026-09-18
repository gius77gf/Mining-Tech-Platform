/* CAMPO: NESSUN BOTTONE DI SCRITTURA SI DISABILITAVA — UN DOPPIO TOCCO
   DUPLICA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node campo-bottoni-occupato.mjs                 (porta effimera)
     node campo-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Campo (18/09). L'audit
   sul pattern "occupato" (nato lo stesso giorno in Flotta/Terra/Conti) ha
   trovato ZERO occorrenze in apps/campo/index.html, contro le decine delle
   altre tre app: quindici bottoni di scrittura, nessuno protetto da un
   doppio tocco. Questo banco misura tre casi, uno per famiglia:
   · «Aggiungi» sulle Squadre (btn-squ) — il controllo "esiste già" legge
     SQU in memoria, aggiornato solo da refresh(). ⚠️ Misurato: in
     dimostrazione `db.aggiungi` scrive SINCRONAMENTE nello stesso array
     che SQU referenzia (per riferimento, non una copia), quindi due
     `.click()` nativi non producono mai un doppione qui — la domanda che
     REGGE, e che vale per la produzione vera (Firestore, asincrono), è se
     il bottone si disabilita SUBITO al tocco;
   · «Pianifica»/«Salva modifica» sulle Attività (btn-att) — l'etichetta
     cambia da sola, la trappola già presa oggi su «btn-fro» in Terra e
     «btn-ft» in Conti: se occupato(false) corresse DOPO la riscrittura
     esplicita dell'etichetta, la cancellerebbe. Qui NON c'è nessun
     controllo "esiste già" prima di scrivere, quindi il doppio tocco
     nativo duplica DAVVERO anche in dimostrazione — è la prova diretta;
   · «Chiudi il turno» (btn-fir) — il documento firmato: stessa domanda
     sincrona di «btn-squ» (CHI ha la stessa natura di riferimento). */
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
  ["apps/campo/index.html",
   "    if (SQU.some(q => (q.nome || \"\").toLowerCase() === nome.toLowerCase())) {\n"
   + "      sbaglia(\"squ-nome\", \"squ-esito\", \"Esiste già una squadra chiamata «\" + nome + \"»: cambia nome, altrimenti i rapportini non si capiscono più.\"); return; }\n"
   + "    err(\"squ-nome\", false);\n"
   + "    // ⛔ 18/09, dal secondo giro di deep-pass QA: il controllo qui sopra\n"
   + "    // legge SQU in memoria, aggiornato solo da refresh() più in basso — un\n"
   + "    // doppio tocco lo passa due volte e crea due squadre omonime.\n"
   + "    occupato(\"btn-squ\", true);",
   "    if (SQU.some(q => (q.nome || \"\").toLowerCase() === nome.toLowerCase())) {\n"
   + "      sbaglia(\"squ-nome\", \"squ-esito\", \"Esiste già una squadra chiamata «\" + nome + \"»: cambia nome, altrimenti i rapportini non si capiscono più.\"); return; }\n"
   + "    err(\"squ-nome\", false);"],
  ["apps/campo/index.html",
   "    const persone = nPers === \"\" || !Number.isFinite(+nPers) ? null : Math.max(0, Math.round(+nPers));\n"
   + "    await db.aggiungi(\"squadre\", { nome, persone, area: $(\"squ-area\").value.trim(), stato: \"operativa\" });\n"
   + "    occupato(\"btn-squ\", false);",
   "    const persone = nPers === \"\" || !Number.isFinite(+nPers) ? null : Math.max(0, Math.round(+nPers));\n"
   + "    await db.aggiungi(\"squadre\", { nome, persone, area: $(\"squ-area\").value.trim(), stato: \"operativa\" });"],
  ["apps/campo/index.html",
   "    occupato(\"btn-att\", true);\n"
   + "    if (editAtt) {\n"
   + "      await db.aggiorna(\"attivita\", editAtt, { titolo, dettaglio: $(\"att-dett\").value.trim(), data, turno, squadra, operatore });   // stato/causale restano\n"
   + "      occupato(\"btn-att\", false);\n"
   + "      editAtt = null; $(\"btn-att\").textContent = \"Pianifica\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"attivita\", { titolo, dettaglio: $(\"att-dett\").value.trim(), data, turno, squadra, operatore, stato: \"pianificata\" });\n"
   + "      occupato(\"btn-att\", false);\n"
   + "    }",
   "    if (editAtt) {\n"
   + "      await db.aggiorna(\"attivita\", editAtt, { titolo, dettaglio: $(\"att-dett\").value.trim(), data, turno, squadra, operatore });   // stato/causale restano\n"
   + "      editAtt = null; $(\"btn-att\").textContent = \"Pianifica\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"attivita\", { titolo, dettaglio: $(\"att-dett\").value.trim(), data, turno, squadra, operatore, stato: \"pianificata\" });\n"
   + "    }"],
  ["apps/campo/index.html",
   "    const note = $(\"fir-note\").value.trim();\n"
   + "    const ora = new Date().toTimeString().slice(0, 5);\n"
   + "    // ⛔ 18/09, dal secondo giro di deep-pass QA: `gia` legge CHI in memoria,\n"
   + "    // aggiornato solo da refresh() più in basso — un doppio tocco firma il\n"
   + "    // turno due volte (o riscrive la firma) prima che il primo salvataggio\n"
   + "    // sia confermato. È la firma della consegna: proprio il documento su cui\n"
   + "    // la doppia scrittura conta di più.\n"
   + "    occupato(\"btn-fir\", true);\n"
   + "    const gia = chiusuraDi(CHI, OGGI, turno);\n"
   + "    if (gia) await db.aggiorna(\"chiusure\", gia.id, { consegna, ricevuta, note, ora });\n"
   + "    else await db.aggiungi(\"chiusure\", { data: OGGI, turno, consegna, ricevuta, note, ora });\n"
   + "    occupato(\"btn-fir\", false);",
   "    const note = $(\"fir-note\").value.trim();\n"
   + "    const ora = new Date().toTimeString().slice(0, 5);\n"
   + "    const gia = chiusuraDi(CHI, OGGI, turno);\n"
   + "    if (gia) await db.aggiorna(\"chiusure\", gia.id, { consegna, ricevuta, note, ora });\n"
   + "    else await db.aggiungi(\"chiusure\", { data: OGGI, turno, consegna, ricevuta, note, ora });"],
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
await pg.goto(`http://127.0.0.1:${porta}/apps/campo/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("att-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Campo è pronta (in dimostrazione)");

/* ── 1. «Aggiungi» sulle Squadre: il bottone si disabilita SUBITO al tocco ──
   Nota di metodo: in dimostrazione `db.aggiungi` scrive SINCRONAMENTE nello
   stesso array che `SQU` referenzia (mem.squadre, per riferimento — non una
   copia), quindi il controllo "esiste già" del SECONDO tocco nativo vede già
   la riga appena scritta dal primo e si autoguarisce da solo: due tocchi
   nativi non producono MAI un doppione qui, con o senza `occupato`. Non è
   una prova che «non sa fallire» applicata al conteggio — è la domanda
   sbagliata per QUESTO bottone. La domanda che regge, e che la produzione
   vera (Firestore, davvero asincrono) rende reale, è se il bottone si
   disabilita PRIMA che la scrittura risponda: quello lo decide `occupato`,
   non la velocità del backend, ed è verificabile in modo sincrono. */
await vaiA(pg, "campo", "nav-squ");
await pg.fill("#squ-nome", "Squadra Prova Sincrona");
const statoSubito = await pg.evaluate(() => {
  const b = document.getElementById("btn-squ");
  b.click();
  return { disabled: b.disabled };
});
dice(statoSubito.disabled === true, "⛔ il bottone si disabilita SUBITO al tocco, prima che la scrittura risponda", statoSubito);
await pg.waitForTimeout(500);
const statoDopoSqu = await pg.evaluate(() => ({ disabled: document.getElementById("btn-squ")?.disabled }));
dice(statoDopoSqu.disabled === false, "e si riaccende a scrittura conclusa", statoDopoSqu);

/* ── 2. «Pianifica»/«Salva modifica» sulle Attività: l'etichetta che CAMBIA ── */
await vaiA(pg, "campo", "nav-att");
const nAttPrima = await pg.evaluate(() => document.querySelectorAll("#att-list .item").length);
await pg.fill("#att-titolo", "Prova doppio tocco attività");
// #att-list mostra solo la giornata di OGGI: una data futura si salva ma
// non compare mai nell'elenco che questa prova conta. Si lascia la data
// che il form propone di suo (OGGI), non se ne scrive una a mano.
await pg.evaluate(() => { const b = document.getElementById("btn-att"); b.click(); b.click(); });
await pg.waitForTimeout(500);
const nAttDopo = await pg.evaluate(() => document.querySelectorAll("#att-list .item").length);
dice(nAttDopo === nAttPrima + 1, `⛔ due tocchi quasi simultanei registrano UNA attività, non due (${nAttPrima} -> ${nAttDopo})`, { nAttPrima, nAttDopo });
const dopoAtt = await pg.evaluate(() => ({ disabled: document.getElementById("btn-att")?.disabled, testo: document.getElementById("btn-att")?.textContent }));
dice(dopoAtt.disabled === false && dopoAtt.testo === "Pianifica", "e si riaccende con l'etichetta di sempre a fine scrittura", dopoAtt);
// ora si modifica la stessa attività, per prendere la trappola dell'etichetta
const idNuova = await pg.evaluate(() => {
  const items = [...document.querySelectorAll("#att-list [data-edit-att]")];
  const el = items.find((x) => x.closest(".item")?.textContent.includes("Prova doppio tocco attività"));
  return el && el.getAttribute("data-edit-att");
});
dice(!!idNuova, "trovo il bottone di modifica dell'attività appena creata", idNuova);
if (idNuova) {
  await pg.evaluate((id) => { document.querySelector(`[data-edit-att="${id}"]`)?.click(); }, idNuova);
  await pg.waitForTimeout(200);
  const etichettaEdit = await pg.evaluate(() => document.getElementById("btn-att")?.textContent);
  dice(etichettaEdit === "Salva modifica", "toccando la matita l'etichetta diventa «Salva modifica»", etichettaEdit);
  await pg.click("#btn-att"); await pg.waitForTimeout(500);
  const editDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-att")?.disabled, testo: document.getElementById("btn-att")?.textContent }));
  dice(editDopo.disabled === false, "il bottone si riaccende dopo la modifica", editDopo);
  dice(editDopo.testo === "Pianifica", "⛔ e l'etichetta torna «Pianifica» — non «Salva modifica»: il cambio di modo non viene cancellato dal riaccendersi del bottone", editDopo);
}

/* ── 3. «Chiudi il turno»: la firma del documento — stessa domanda sincrona ── */
await vaiA(pg, "campo", "nav-rap");
await pg.fill("#fir-consegna", "Prova Consegna");
await pg.fill("#fir-ricevuta", "Prova Ricevuta");
const firSubito = await pg.evaluate(() => {
  const b = document.getElementById("btn-fir");
  if (!b || b.disabled) return { saltato: true };
  b.click();
  return { disabled: b.disabled };
});
dice(firSubito.saltato || firSubito.disabled === true, "⛔ anche qui il bottone si disabilita SUBITO al tocco — la firma del documento è dove la doppia scrittura conta di più", firSubito);
await pg.waitForTimeout(600);
const dopoFir = await pg.evaluate(() => ({ disabled: document.getElementById("btn-fir")?.disabled, esito: document.getElementById("fir-esito")?.textContent || "" }));
dice(/chiuso/i.test(dopoFir.esito), "il turno risulta chiuso dopo la firma", dopoFir);
dice(dopoFir.disabled === false, "e il bottone si riaccende", dopoFir);

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

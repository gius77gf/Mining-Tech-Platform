/* SCUDO: TREDICI BOTTONI DI SCRITTURA SU QUINDICI SENZA GUARDIA CONTRO IL
   DOPPIO TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-bottoni-occupato.mjs                 (porta effimera)
     node scudo-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Scudo (18/09): di quindici bottoni di
   scrittura, solo due (btn-att in altre app, qui nessuno) avevano
   `occupato()`. Il caso più chiaro, verificato dal vivo dall'agente — un
   doppio tocco su «Registra» (consegna DPI) crea DUE righe identiche nel
   registro consegne — è `btn-dpi`: la scrittura è un `db.aggiungi` senza
   nessun controllo di doppione, quindi anche in dimostrazione (dove le
   mutazioni sincrone spesso "auto-guariscono" un doppio tocco nativo) qui
   il doppione è vero e si conta. `btn-mans` è invece il caso con la
   trappola dell'etichetta: `annullaEditMans()` riscrive il testo del
   bottone leggendo `editMans` appena azzerato — la prova valida lì non è
   il conteggio (la dedup su MANS letta da `annullaEditMans` è sincrona e
   si auto-guarisce in demo, stessa famiglia già vista su Flotta/Terra) ma
   che il bottone si disabiliti SUBITO al tocco. */
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
   "    err(\"dpi-lav\", false); err(\"dpi-tipo\", false); err(\"dpi-data\", false);\n"
   + "    const t = tipoDpiSicuro(tipo), lav = LAV.find(l => l.id === lavoratoreId);\n"
   + "    const addestrato = !!dpiAddestr;\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia — confermato dal vivo, un\n"
   + "       doppio tocco registra due consegne identiche dello stesso DPI. */\n"
   + "    occupato(\"btn-dpi\", true);\n"
   + "    await db.aggiungi(\"dpi\", {\n"
   + "      lavoratoreId, tipo, modello: $(\"dpi-modello\").value.trim(), taglia: $(\"dpi-taglia\").value.trim(),\n"
   + "      dataConsegna, scadenza: dpiNonScade ? null : ($(\"dpi-scad\").value || null),\n"
   + "      nonScade: !!dpiNonScade,\n"
   + "      addestramento: !!dpiAddestr, dataAddestramento: dpiAddestr ? dataConsegna : null, note: \"\",\n"
   + "    });\n"
   + "    occupato(\"btn-dpi\", false);\n"
   + "    const senzaData = !dpiNonScade && !$(\"dpi-scad\").value;",
   "    err(\"dpi-lav\", false); err(\"dpi-tipo\", false); err(\"dpi-data\", false);\n"
   + "    const t = tipoDpiSicuro(tipo), lav = LAV.find(l => l.id === lavoratoreId);\n"
   + "    const addestrato = !!dpiAddestr;\n"
   + "    await db.aggiungi(\"dpi\", {\n"
   + "      lavoratoreId, tipo, modello: $(\"dpi-modello\").value.trim(), taglia: $(\"dpi-taglia\").value.trim(),\n"
   + "      dataConsegna, scadenza: dpiNonScade ? null : ($(\"dpi-scad\").value || null),\n"
   + "      nonScade: !!dpiNonScade,\n"
   + "      addestramento: !!dpiAddestr, dataAddestramento: dpiAddestr ? dataConsegna : null, note: \"\",\n"
   + "    });\n"
   + "    const senzaData = !dpiNonScade && !$(\"dpi-scad\").value;"],
  ["apps/scudo/index.html",
   "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia — un doppio tocco crea due\n"
   + "       mansioni identiche. `occupato(false)` va PRIMA di `annullaEditMans()`,\n"
   + "       che riscrive l'etichetta del bottone: se corresse dopo, cancellerebbe\n"
   + "       il cambio di modo appena fatto (vedi btn-azi, stessa trappola). */\n"
   + "    occupato(\"btn-mans\", true);\n"
   + "    if (editMans) { await db.aggiorna(\"mansioni\", editMans, rec); occupato(\"btn-mans\", false); annullaEditMans();\n"
   + "      esito(\"mans-esito\", \"Mansione aggiornata: \" + nome + \".\", \"success\"); }\n"
   + "    else { await db.aggiungi(\"mansioni\", rec); occupato(\"btn-mans\", false); annullaEditMans();",
   "    if (editMans) { await db.aggiorna(\"mansioni\", editMans, rec); annullaEditMans();\n"
   + "      esito(\"mans-esito\", \"Mansione aggiornata: \" + nome + \".\", \"success\"); }\n"
   + "    else { await db.aggiungi(\"mansioni\", rec); annullaEditMans();"],
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
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => document.body.textContent.length > 500); }
dice(pronto, "la pagina di Scudo è pronta (in dimostrazione)");
await vaiA(pg, "scudo", "nav-pers");
await pg.waitForTimeout(300);

/* ── 1. DPI: la scrittura è un aggiungi puro, senza dedup — prova per conteggio ── */
await pg.click('#pers-tabs [data-tab="dpi"]');
await pg.waitForTimeout(300);
const lavId = await pg.evaluate(() => { const s = document.getElementById("dpi-lav"); const o = [...s.options].find(x => x.value); return o && o.value; });
const tipoId = await pg.evaluate(() => { const s = document.getElementById("dpi-tipo"); const o = [...s.options].find(x => x.value); return o && o.value; });
dice(!!lavId && !!tipoId, "la dimostrazione propone almeno una persona e un tipo di DPI", { lavId, tipoId });
if (lavId && tipoId) {
  await pg.selectOption("#dpi-lav", lavId);
  await pg.selectOption("#dpi-tipo", tipoId);
  await pg.fill("#dpi-data", "2026-09-18");
  const nDpiPrima = await pg.evaluate(() => document.querySelectorAll("#dpi-list .item").length || 0);
  /* due `.click()` nativi nella STESSA chiamata a `evaluate`: garantiscono
     che il secondo tocco arrivi mentre il primo handler è ancora fermo sul
     primo `await`, indipendentemente da quanto sia lenta la rete vera. */
  const cliccato = await pg.evaluate(() => {
    const btn = document.getElementById("btn-dpi");
    if (!btn) return false;
    btn.click(); btn.click();
    return true;
  });
  dice(cliccato, "trovato «Registra» e cliccato due volte", cliccato);
  await pg.waitForTimeout(600);
  const nDpiDopo = await pg.evaluate(() => document.querySelectorAll("#dpi-list .item").length || 0);
  dice(nDpiDopo === nDpiPrima + 1, `⛔ due tocchi quasi simultanei registrano UNA consegna, non due (${nDpiPrima} -> ${nDpiDopo})`, { nDpiPrima, nDpiDopo });
}

/* ── 2. Mansioni: trappola dell'etichetta — il bottone si disabilita SUBITO ── */
await pg.click('#pers-tabs [data-tab="mans"]');
await pg.waitForTimeout(300);
await pg.fill("#mans-nome", "Prova Sincrona " + Date.now());
const mansSubito = await pg.evaluate(() => {
  const btn = document.getElementById("btn-mans");
  if (!btn || btn.disabled) return { saltato: true };
  btn.click();
  return { disabled: btn.disabled };
});
dice(mansSubito.saltato || mansSubito.disabled === true, "⛔ Mansioni · «Aggiungi» si disabilita SUBITO al tocco", mansSubito);
await pg.waitForTimeout(500);
const mansDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-mans")?.disabled, testo: document.getElementById("btn-mans")?.textContent }));
dice(mansDopo.disabled === false && mansDopo.testo === "Aggiungi", "e si riaccende con l'etichetta di sempre", mansDopo);

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

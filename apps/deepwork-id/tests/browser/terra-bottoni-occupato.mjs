/* TERRA: I BOTTONI DI SCRITTURA SI SPENGONO MENTRE SALVANO — UN DOPPIO
   TOCCO NON DUPLICA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-bottoni-occupato.mjs                 (porta effimera)
     node terra-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Terra (18/09), task #19. Nessuno dei
   bottoni che scrivono un record nuovo (rilievo, scadenza, fronte,
   autorizzazione, lotto) si disabilitava durante l'attesa della rete: con
   una connessione lenta, un secondo tocco prima che la prima scrittura sia
   confermata scrive due volte lo stesso rilievo — e un volume duplicato
   entra identico in kpiFrom, vitaCava e prospettoDenuncia. Stessa famiglia
   già corretta lo stesso giorno in Flotta (`occupato`), qui promossa in
   `shared/dw-app-ui.js` perché serve a due app.
   Questo banco misura due bottoni:
   · «Aggiungi scadenza» (caso semplice, etichetta fissa) — il bottone si
     disabilita SUBITO dopo il tocco (prima che la scrittura risponda) e un
     secondo `.click()` sincrono, sul bottone già disabilitato, non parte
     nemmeno: resta UNA sola scadenza nuova, non due;
   · «Aggiungi/Salva modifica» sul fronte — l'etichetta cambia da sola a
     seconda che si stia modificando o aggiungendo: qui la trappola era
     doppia, perché il render dentro `refresh()` scrive lui stesso il testo
     giusto leggendo `editFro` (già azzerato), e se `occupato(false)`
     corresse DOPO lo riscriverebbe col testo catturato al tocco,
     cancellando il cambio di modo appena fatto. */
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

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09. */
const DIFETTI = [
  ["apps/terra/index.html",
   `    occupato("btn-add-scad", true);
    await db.aggiungi("scadenze", { tipo: $("scad-preset").value || "altro", descrizione: desc,`,
   `    await db.aggiungi("scadenze", { tipo: $("scad-preset").value || "altro", descrizione: desc,`],
  ["apps/terra/index.html",
   `    $("scad-preset").value = ""; $("scad-preset-nota").style.display = "none";
    await refresh();
    occupato("btn-add-scad", false);
  };`,
   `    $("scad-preset").value = ""; $("scad-preset-nota").style.display = "none";
    await refresh();
  };`],
  ["apps/terra/index.html",
   `    occupato("btn-fro", true);
    if (editFro) {`,
   `    if (editFro) {`],
  ["apps/terra/index.html",
   `    occupato("btn-fro", false);
    annullaEditFronte();`,
   `    annullaEditFronte();`],
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
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("aut-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Terra è pronta (in dimostrazione)");
await vaiA(pg, "terra", "nav-tit");

/* ── 1. «Aggiungi scadenza»: caso semplice, un doppio tocco non duplica ── */
const nScadPrima = await pg.evaluate(() => document.querySelectorAll("#scad-list .item").length);
await pg.fill("#new-scad-desc", "Prova doppio tocco");
await pg.fill("#new-scad-data", "2027-01-15");
/* due `.click()` nativi nella STESSA chiamata a `evaluate`, non due
   `pg.click()` di Playwright: quelli passano ognuno dal proprio giro di
   controlli di "azionabilità" e in dimostrazione (scrittura quasi
   istantanea, nessuna rete vera) il primo handler può finire per intero
   prima che il secondo tocco parta — il che non misurerebbe niente. Due
   `.click()` sincroni sullo stesso elemento, nello stesso turno di script,
   garantiscono che il secondo arrivi mentre il primo handler è ancora fermo
   sul primo `await`: se `occupato` ha già disabilitato il bottone PRIMA di
   quell'`await` (sincrono, appena entra nella funzione), il browser non
   genera nemmeno l'evento per il secondo — è il meccanismo nativo che rende
   la difesa efficace indipendentemente da quanto sia lenta la rete vera. */
await pg.evaluate(() => { const b = document.getElementById("btn-add-scad"); b.click(); b.click(); });
await pg.waitForTimeout(500);
const nScadDopo = await pg.evaluate(() => document.querySelectorAll("#scad-list .item").length);
dice(nScadDopo === nScadPrima + 1, `⛔ due tocchi quasi simultanei registrano UNA scadenza, non due (${nScadPrima} -> ${nScadDopo})`, { nScadPrima, nScadDopo });
const scadTx = await pg.evaluate(() => document.getElementById("scad-list").textContent);
dice((scadTx.match(/Prova doppio tocco/g) || []).length === 1, "«Prova doppio tocco» compare una sola volta nell'elenco", scadTx.match(/Prova doppio tocco/g));

/* si rimisura da capo, per leggere lo stato a fine scrittura: in
   dimostrazione la scrittura è troppo rapida per catturare lo stato
   "disabled" a metà con un secondo giro di IPC — è la prova di sopra
   (due tocchi quasi simultanei -> una sola riga) a dimostrare che la
   finestra, per quanto breve, chiude davvero la porta al doppio tocco. */
await pg.fill("#new-scad-desc", "Seconda prova");
await pg.fill("#new-scad-data", "2027-02-20");
await pg.click("#btn-add-scad"); await pg.waitForTimeout(500);
const dopoScrittura = await pg.evaluate(() => ({ disabled: document.getElementById("btn-add-scad")?.disabled, testo: document.getElementById("btn-add-scad")?.textContent }));
dice(dopoScrittura.disabled === false && dopoScrittura.testo === "Aggiungi", "e si riaccende con l'etichetta di sempre a fine scrittura", dopoScrittura);

/* ── 2. «Aggiungi»/«Salva modifica» sul fronte: l'etichetta che CAMBIA ── */
await vaiA(pg, "terra", "nav-fro");
const primoFronte = await pg.evaluate(() => document.querySelector("#fro-list .item [data-edit-fro]")?.getAttribute("data-edit-fro"));
dice(!!primoFronte, "la dimostrazione ha almeno un fronte da modificare", primoFronte);
await pg.click(`#fro-list .item [data-edit-fro="${primoFronte}"]`); await pg.waitForTimeout(200);
dice((await pg.evaluate(() => document.getElementById("btn-fro")?.textContent)) === "Salva modifica", "toccando la matita l'etichetta diventa «Salva modifica»");
await pg.click("#btn-fro"); await pg.waitForTimeout(500);
const froDopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-fro")?.disabled, testo: document.getElementById("btn-fro")?.textContent }));
dice(froDopo.disabled === false, "il bottone si riaccende", froDopo);
dice(froDopo.testo === "Aggiungi", "⛔ e l'etichetta torna «Aggiungi» — non «Salva modifica»: il cambio di modo non viene cancellato dal riaccendersi del bottone", froDopo);
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

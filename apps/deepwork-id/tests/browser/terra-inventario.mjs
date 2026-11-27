/* TERRA: L'INVENTARIO DEI CUMULI — la lista, la finestra, la cancellazione, il vuoto
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-inventario.mjs                 (porta effimera, mai 8823)
     node terra-inventario.mjs --controprova   (rimette i difetti: DEVE fallire)
     node terra-inventario.mjs --scatti        (due scatti a 390 px in OUT)

   PERCHÉ ESISTE. L'inventario dei cumuli è il terzo lato del triangolo che
   Conti chiude (prodotto − venduto = Δ scorte): Terra lo registra, Conti lo
   legge. Le regole sono pure e provate in `run-kpi.mjs`; quello che una suite
   `node` non vede è la PAGINA — la riga della lista, la finestra che salva,
   il volume lasciato vuoto che deve diventare `null` e non `0`. Il caso che
   conta è quello del principio del fondatore: nella dimostrazione `i3` ha la
   sabbia «in lavorazione» senza volume, e la riga deve dire «1 cumulo non
   misurato» con un totale che NON somma uno zero. Questo banco:
     1. legge la lista (tre inventari, dal più recente) e la riga del 30/08;
     2. apre «Nuovo inventario», compila due cumuli (uno col volume vuoto),
        salva, e pretende quattro righe con la nuova che dichiara il non
        misurato — più due rifiuti (finestra vuota, numero illeggibile);
     3. cancella e torna a tre;
     4. serve il modulo con `inventari: []` e legge lo stato vuoto.
   La controprova rimette tre difetti — il volume `null` letto come 0 in
   `cumuliUsabili`, la frase «non misurato» tolta dalla riga, il salvataggio
   che scrive 0 dove il campo era vuoto — e il banco DEVE cadere.
   ⚠️ Il modulo servito si INIETTA nella risposta HTTP, mai sul file. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const OUT = process.env.DW_SCATTI || "/tmp/terra-inventario";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* lo stato vuoto: la dimostrazione senza nessun inventario. Si mette DOPO la
   chiusura dell'oggetto DEMO, agganciandosi all'intestazione della sezione che
   viene subito dopo (il testo di un commento, stabile) */
const CERCA_VUOTO = "\n// ============================================================\n// PROVENIENZA DEL VOLUME — scavo o cumulo";
const SOST_VUOTO = "\nDEMO.inventari = [];   /* stato vuoto iniettato dal banco */" + CERCA_VUOTO;
let servireVuoto = false, vuotoIniettato = 0;

const DIFETTI = [
  // il volume «non misurato» letto come zero: la sabbia entra nel conto a 0 m³
  ["shared/dw-ponti.js",
   'const v = c?.volumeM3 == null || c.volumeM3 === "" ? NaN : +c.volumeM3;',
   'const v = +(c?.volumeM3 ?? 0);   /* difetto rimesso dal banco */'],
  // la riga che non dichiara i cumuli non misurati
  ["apps/terra/index.html",
   'const meta = [nm ? fraseNonMisurati(nm) + " su " + v.cumuli : conta(v.cumuli, "cumulo", "cumuli"),',
   'const meta = [conta(v.cumuli, "cumulo", "cumuli"),   /* difetto rimesso dal banco */'],
  // il salvataggio che scrive 0 dove il campo era vuoto
  ["apps/terra/index.html",
   "cumuli.push({ materiale: mat, volumeM3: rv.ok ? rv.valore : null });",
   "cumuli.push({ materiale: mat, volumeM3: rv.ok ? rv.valore : 0 });   /* difetto rimesso dal banco */"],
];
/* si contano i DIFETTI rimessi, non le sostituzioni: il banco apre la pagina
   due volte (la seconda per lo stato vuoto) e ogni file viene servito due
   volte — «6 su 3» sarebbe un conto che parla del server, non dei difetti */
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (servireVuoto && p.endsWith("apps/terra/terra-data.js")) {
    const t = corpo.toString("utf8"); const n = t.split(CERCA_VUOTO).length - 1;
    if (n !== 1) { console.error(`✗ iniezione dello stato vuoto mancata: ${n} soggetti`); process.exit(2); }
    corpo = Buffer.from(t.replace(CERCA_VUOTO, SOST_VUOTO), "utf8"); vuotoIniettato++;
  }
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
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
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 500) : ""}`); } };
const norm = (s) => String(s || "").replace(/\s+/g, " ").trim();

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
/* apre Terra in dimostrazione (Firebase abortito → il modulo ripiega sulla
   demo) e va nella schermata dei rilievi, dove vive l'inventario */
async function apriTerra() {
  const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${porta}/apps/terra/index.html`);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("inv-list")?.innerHTML.length || 0) > 0); }
  await vaiA(pg, "terra", "nav-ril");
  return { pg, errori, pronto };
}
const righeInv = (pg) => pg.evaluate(() => [...document.querySelectorAll("#inv-list .item")].map((i) => ({
  id: i.getAttribute("data-inv"), nome: i.querySelector(".name")?.textContent.trim(),
  meta: i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(),
  badge: i.querySelector(".badge")?.textContent.trim(), classe: i.className })));
const modaleAperta = (pg) => pg.evaluate(() => document.getElementById("modal")?.classList.contains("show") || false);

/* ── 1. la lista ─────────────────────────────────────────────────────── */
const { pg, errori, pronto } = await apriTerra();
dice(pronto, "la lista degli inventari è stata disegnata (la pagina è in dimostrazione)");
dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-ril")).display !== "none"), "sono sulla schermata Rilievi, dove vive l'inventario dei cumuli");
let righe = await righeInv(pg);
dice(righe.length === 3, `la lista mostra i 3 inventari della dimostrazione (${righe.length})`, righe);
dice(righe.map((r) => r.id).join(",") === "i3,i2,i1", "dal più recente: i3 (30/08), i2 (27/06), i1 (29/12)", righe.map((r) => r.id));
const r3 = righe[0] || {};
dice(/Inventario del 30\/08\/2026/.test(r3.nome || ""), "la prima riga è l'inventario del 30/08/2026", r3.nome);
dice(/1 cumulo non misurato/.test(r3.meta || ""), "la riga del 30/08 dichiara «1 cumulo non misurato»", r3.meta);
dice(/3\.540 m³/.test(r3.meta || ""), "e il totale è 3.540 m³ (2.900 + 640): la sabbia senza volume NON è entrata come zero", r3.meta);
dice(/Stima a vista/.test(r3.meta || "") && /1 cumulo non misurato su 3/.test(r3.meta || ""), "la riga dice il metodo e «su 3» cumuli", r3.meta);
dice(/^1 non misurato$/i.test(r3.badge || "") && /st-warn/.test(r3.classe || ""), "la pastiglia dice «1 non misurato» (non si taglia: la meta è a due righe) e la riga è in attenzione", [r3.badge, r3.classe]);
const r2 = righe[1] || {};
dice(/4\.930 m³/.test(r2.meta || "") && !/non misurat/.test(r2.meta || "") && r2.badge === "Completo", "la riga del 27/06 è completa: 4.930 m³, nessun «non misurato», pastiglia «Completo»", r2);
dice(/3\b.*inventari/.test(norm(await pg.evaluate(() => document.getElementById("inv-count")?.textContent))), "il contatore dice 3 inventari", await pg.evaluate(() => document.getElementById("inv-count")?.textContent));
if (SCATTI) { mkdirSync(OUT, { recursive: true }); await pg.evaluate(() => { document.getElementById("inv-count")?.previousElementSibling?.scrollIntoView({ block: "start" }); window.scrollBy(0, -72); }); await pg.waitForTimeout(300); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "lista-controprova.png" : "lista.png") }); }

/* il dettaglio: la riga si apre e i cumuli si leggono uno per uno */
await pg.click('#inv-list .item[data-inv="i3"]'); await pg.waitForTimeout(400);
dice(await modaleAperta(pg), "toccando la riga si apre il dettaglio dell'inventario");
const det = await pg.evaluate(() => ({
  titolo: document.getElementById("modal-title")?.textContent.trim(),
  righe: [...document.querySelectorAll("#modal-body .item")].map((i) => ({ nome: i.querySelector(".name")?.textContent.trim(), meta: i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(), badge: i.querySelector(".badge")?.textContent.trim() || null })),
  testo: document.getElementById("modal-body")?.innerText.replace(/\s+/g, " ") }));
dice(/Inventario del 30\/08\/2026/.test(det.titolo || ""), "il titolo della finestra è l'inventario del 30/08/2026", det.titolo);
dice(det.righe.length === 3, "il dettaglio elenca i 3 cumuli", det.righe);
const sab = det.righe.find((r) => /Sabbia lavata 0\/4/.test(r.nome || ""));
dice(!!sab && /non misurato/.test(sab.meta) && /Cumulo in lavorazione/.test(sab.meta) && sab.badge === "Non misurato", "la sabbia dice «non misurato» con la sua nota, e non «0 m³»", sab);
dice(det.righe.some((r) => /Stabilizzato/.test(r.nome) && /2\.900 m³/.test(r.meta)), "lo stabilizzato dice 2.900 m³", det.righe);
dice(/3\.540 m³/.test(det.testo) && /1 cumulo non misurato/.test(det.testo) && /fuori dal conto/.test(det.testo), "il piede dice il totale misurato e che il non misurato resta fuori dal conto", det.testo);
await pg.click("#modal-foot .mbtn"); await pg.waitForTimeout(300);
dice(!(await modaleAperta(pg)), "«Chiudi» chiude il dettaglio");

/* ── 2. la finestra del nuovo inventario ─────────────────────────────── */
await pg.click("#btn-add-inv"); await pg.waitForTimeout(400);
dice(await modaleAperta(pg), "«Nuovo inventario» apre la finestra");
const oggiPagina = await pg.evaluate(() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); });
dice((await pg.inputValue("#inv-data")) === oggiPagina, "la data è già oggi", await pg.inputValue("#inv-data"));
dice(await pg.evaluate(() => document.querySelectorAll("#inv-righe .inv-riga").length) === 2, "la finestra parte con due righe di cumulo");
dice(await pg.evaluate(() => [...document.querySelectorAll("#inv-righe .inv-vol")].every((i) => i.type === "text" && i.getAttribute("inputmode") === "decimal")), "il volume è un campo decimale di testo (mai type=number)");
/* rifiuto 1: finestra lasciata vuota */
await pg.click("#modal-foot .mbtn.primary"); await pg.waitForTimeout(300);
dice(await modaleAperta(pg) && /almeno un cumulo/.test(await pg.evaluate(() => document.getElementById("inv-err")?.textContent)), "senza nessun cumulo non salva e dice perché", await pg.evaluate(() => document.getElementById("inv-err")?.textContent));
/* rifiuto 2: un volume che non è un numero */
await pg.fill("#inv-righe .inv-riga:nth-child(1) .inv-mat", "Stabilizzato 0/30");
await pg.fill("#inv-righe .inv-riga:nth-child(1) .inv-vol", "tanti");
await pg.click("#modal-foot .mbtn.primary"); await pg.waitForTimeout(300);
const errNum = await pg.evaluate(() => document.getElementById("inv-err")?.textContent);
dice(await modaleAperta(pg) && /Non riesco a leggere un numero/.test(errNum) && /Stabilizzato/.test(errNum), "un volume illeggibile ferma il salvataggio e nomina il cumulo", errNum);
dice(await pg.evaluate(() => document.querySelector("#inv-righe .inv-riga:nth-child(1) .inv-vol")?.classList.contains("err")), "e il campo sbagliato prende il bordo rosso");
/* la compilazione buona: un volume con la virgola, uno lasciato vuoto */
await pg.fill("#inv-righe .inv-riga:nth-child(1) .inv-vol", "3.100,5");
await pg.fill("#inv-righe .inv-riga:nth-child(2) .inv-mat", "Sabbia lavata 0/4");
await pg.fill("#inv-righe .inv-riga:nth-child(2) .inv-vol", "");
await pg.click("#inv-add-riga"); await pg.waitForTimeout(150);
dice(await pg.evaluate(() => document.querySelectorAll("#inv-righe .inv-riga").length) === 3, "«Aggiungi cumulo» aggiunge una riga (lasciata in bianco: non diventa un cumulo)");
/* «esce dal suo spazio?» lo sa dire il browser: un nome di materiale più largo
   del suo campo si legge a metà, e a 390 px è la prima cosa che succede */
await pg.fill("#inv-righe .inv-riga:nth-child(3) .inv-mat", "Misto granulare stabilizzato 0/30"); await pg.fill("#inv-righe .inv-riga:nth-child(3) .inv-vol", "12.345,5");
const tagliati = await pg.evaluate(() => [...document.querySelectorAll("#inv-righe .inv-mat, #inv-righe .inv-vol")].filter((i) => i.value && i.scrollWidth > i.clientWidth).map((i) => ({ v: i.value, sw: i.scrollWidth, cw: i.clientWidth })));
dice(tagliati.length === 0, "a 390 px un nome di listino di 33 lettere e un volume a cinque cifre stanno nel loro campo (nessuno tagliato)", tagliati);
// la terza riga torna in bianco: il salvataggio qui sotto vuole DUE cumuli
await pg.fill("#inv-righe .inv-riga:nth-child(3) .inv-mat", ""); await pg.fill("#inv-righe .inv-riga:nth-child(3) .inv-vol", "");
if (SCATTI) { await pg.waitForFunction(() => !document.getElementById("toast")?.classList.contains("show"), { timeout: 6000 }).catch(() => {}); await pg.waitForTimeout(700); await pg.screenshot({ path: join(OUT, CONTROPROVA ? "modale-controprova.png" : "modale.png") }); }
await pg.click("#modal-foot .mbtn.primary"); await pg.waitForTimeout(600);
dice(!(await modaleAperta(pg)), "col salvataggio la finestra si chiude");
righe = await righeInv(pg);
dice(righe.length === 4, `la lista ne mostra 4 (${righe.length})`, righe.map((r) => r.nome));
const nuova = righe[0] || {};
dice(new RegExp("Inventario del " + oggiPagina.split("-").reverse().join("/")).test(nuova.nome || ""), "la nuova riga è la prima, con la data di oggi", nuova.nome);
dice(/su 2 ·/.test(nuova.meta || "") && /3\.100,5 m³/.test(nuova.meta || ""), "la nuova riga dice «su 2» cumuli e 3.100,5 m³ (la virgola è stata letta)", nuova.meta);
dice(/1 cumulo non misurato/.test(nuova.meta || "") && /^1 non misurato$/i.test(nuova.badge || ""), "e dichiara «1 cumulo non misurato», nella riga e nella pastiglia: il volume vuoto è null, non zero", nuova);
const esitoTx = norm(await pg.evaluate(() => document.getElementById("inv-esito")?.textContent));
dice(/registrato/.test(esitoTx) && /1 cumulo non misurato/.test(esitoTx), "il messaggio dopo il salvataggio dice il non misurato", esitoTx);
/* il dato salvato, letto dal dettaglio: la sabbia è «non misurato» */
await pg.click(`#inv-list .item[data-inv="${nuova.id}"]`); await pg.waitForTimeout(400);
const detN = await pg.evaluate(() => [...document.querySelectorAll("#modal-body .item")].map((i) => i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim()));
dice(detN.length === 2 && detN.some((m) => /^non misurato/.test(m)) && detN.some((m) => /3\.100,5 m³/.test(m)), "nel dettaglio della nuova: 3.100,5 m³ e «non misurato», non «0 m³»", detN);
await pg.click("#modal-foot .mbtn"); await pg.waitForTimeout(300);

/* ── 3. la cancellazione ─────────────────────────────────────────────── */
await pg.click(`#inv-list .item[data-inv="${nuova.id}"] [data-del-inv]`); await pg.waitForTimeout(400);
dice(await modaleAperta(pg) && /Eliminare l'inventario/.test(await pg.evaluate(() => document.getElementById("modal-title")?.textContent)), "la croce chiede conferma con la modale della pagina");
await pg.click("#modal-foot .mbtn"); await pg.waitForTimeout(300);
dice((await righeInv(pg)).length === 4, "«Annulla» non toglie niente");
await pg.click(`#inv-list .item[data-inv="${nuova.id}"] [data-del-inv]`); await pg.waitForTimeout(400);
await pg.click("#modal-foot .mbtn.danger"); await pg.waitForTimeout(600);
righe = await righeInv(pg);
dice(righe.length === 3 && !righe.some((r) => r.id === nuova.id), `dopo la conferma la lista torna a 3 (${righe.length})`, righe.map((r) => r.id));
dice(/eliminato/.test(norm(await pg.evaluate(() => document.getElementById("inv-esito")?.textContent))), "e il messaggio lo dice");
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
await pg.close();

/* ── 4. lo stato vuoto ───────────────────────────────────────────────── */
servireVuoto = true;
const v = await apriTerra();
dice(vuotoIniettato > 0, `il modulo servito porta «inventari: []» (${vuotoIniettato})`);
/* `textContent` e non `innerText`: il titolo dello stato vuoto è in maiuscolo
   per CSS, e `innerText` lo restituisce trasformato — il righello leggerebbe
   «NESSUN INVENTARIO» dove il sorgente scrive «Nessun inventario» */
const vuotoTx = norm(await v.pg.evaluate(() => document.getElementById("inv-list")?.textContent));
dice((await righeInv(v.pg)).length === 0, "senza inventari non c'è nessuna riga");
dice(/Nessun inventario dei cumuli/.test(vuotoTx) && /resta stimata finché non ne registri due/.test(vuotoTx), "lo stato vuoto dice che in Conti la variazione delle scorte resta stimata finché non ne registri due", vuotoTx);
dice(norm(await v.pg.evaluate(() => document.getElementById("inv-count")?.textContent)) === "", "e il contatore non scrive «0»: resta vuoto");
await v.pg.click("#inv-list [data-vuoto-fai]"); await v.pg.waitForTimeout(400);
dice(await modaleAperta(v.pg) && /Nuovo inventario/.test(await v.pg.evaluate(() => document.getElementById("modal-title")?.textContent)), "il bottone dello stato vuoto apre la finestra del nuovo inventario");
dice(v.errori.length === 0, "nessun errore di pagina nello stato vuoto", v.errori.slice(0, 3));
await v.pg.close();

await b.close(); srv.close();
if (CONTROPROVA) console.log(`iniezioni: ${difettiRimessi.size} difetti su ${DIFETTI.length} rimessi nella risposta HTTP`);
console.log(`\nRisultato inventario dei cumuli: ${ok} passati, ${ko} falliti  ·  ${ok + ko} prove`);
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log("✗ CONTROPROVA NON VALIDA: non tutti i difetti sono stati rimessi"); process.exit(1); }
  console.log(ko ? "✔ CONTROPROVA OK: coi difetti rimessi il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue");
  process.exit(ko ? 0 : 1);
}
process.exit(ko ? 1 : 0);

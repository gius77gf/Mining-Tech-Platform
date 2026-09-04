/* SENTINELLA · LA LETTURA DICHIARATA NON VALIDA, PREMUTA DAVVERO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-annullate.mjs [--porta=8607]
     node sentinella-annullate.mjs --controprova   (DEVE fallire)
     node sentinella-annullate.mjs --scatti=/dove/metterli

   PERCHÉ ESISTE. Il 04/09 è entrata la dichiarazione «questa misura non è
   della cava» (mezzo di passaggio, temporale, prova dello strumento): la
   riga resta in archivio col suo valore e la ragione, esce dai conti e si
   può ripristinare. Le funzioni hanno la loro prova in `run-kpi.mjs`; che il
   giro intero funzioni PREMENDO — la modale, la tendina delle ragioni, la
   riga che si barra, il riepilogo di conformità che cambia E LO DICHIARA, il
   report e il file per l'ente che scrivono «1 lettura annullata (temporale)»,
   il ripristino che rimette tutto — solo il browser lo può dire.

   ⛔ IL PRINCIPIO CHE SI MISURA: il conto cambia SOLO con la dichiarazione.
   Prima di toccare niente il banco legge il riepilogo com'è; il suggerimento
   «nessuna volata quel giorno» sulle letture di vibrazione (v1 ne ha quattro)
   NON deve aver cambiato nessun numero. E la riga tolta NON sparisce: la
   tabella la mostra barrata con la ragione, la legenda della serie dice quante
   non ne ha disegnate, il riepilogo dice quante non pesano.

   LA CONTROPROVA rimette il difetto nel modulo: `lettureLeggibili` che non
   scarta più le annullate. Allora la lettura annullata conta lo stesso, il
   riepilogo non cambia, e il banco deve cadere.

   ⚠️ Stesso schermo per tutto il giro: la dimostrazione vive in memoria e
   ogni `newPage` riparte da zero, quindi annullamento, riepilogo, report,
   CSV e ripristino si misurano sulla STESSA pagina, cambiando sezione dalla
   barra in basso. Due larghezze (320 e 390), che sono i telefoni di cava. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8607;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, nel modulo: la lettura annullata che conta lo
   stesso. Si CONTA: un `replace` che non trova niente esce in silenzio. */
const DIFETTI_MODULO = [
  ["  return (((m || {}).letture) || [])\n    .filter(letturaValida)\n    .map(x => ({ data: String((x || {}).data || \"\").slice(0, 10), ora: String((x || {}).ora || \"\"),",
   "  return (((m || {}).letture) || [])\n    .map(x => ({ data: String((x || {}).data || \"\").slice(0, 10), ora: String((x || {}).ora || \"\"),"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_MODULO) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* il contrassegno col proprio pid: se sulla porta risponde un altro server,
   misurerei la copia di qualcun altro — ci si ferma */
const SEGNO = join(R, "__sentinella-annullate-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-annullate-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };

console.log(`\n════════ Sentinella · la lettura dichiarata non valida, premuta davvero${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-mon").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-mon", `navigato davvero nei Monitoraggi (${viste.join(",") || "nessuna"})`, viste);

  // ── 0 · com'è PRIMA: il suggerimento non ha tolto niente ──────────────
  const confPrima = testo(await pg.$eval("#mon-conf", (e) => e.innerHTML));
  dice(/\b1\s+in attenzione/.test(confPrima) && /\b4\s+conform/.test(confPrima),
    "prima di dichiarare niente il riepilogo è quello della dimostrazione (4 conformi · 1 in attenzione)", confPrima);
  dice(!/non valid/.test(confPrima), "e non parla di letture annullate: non ce ne sono", confPrima);

  // il suggerimento sulle letture di vibrazione senza volata: v1 (quattro
  // letture, nessuna in un giorno di volata) e v2 (il 17/07 c'è la volata b1)
  await pg.click('[data-graf-mon="v1"]').catch(() => {});
  await pg.waitForTimeout(500);
  const hintV1 = await pg.$$eval("#graf-v1 .ann-hint", (e) => e.length).catch(() => -1);
  dice(hintV1 === 4, "sulle 4 letture di V1 (nessuna in un giorno di volata) c'è il suggerimento «nessuna volata quel giorno»", hintV1);
  await scatta(pg, `${W}-1-suggerimento-v1`);
  await pg.click('[data-graf-mon="v2"]').catch(() => {});
  await pg.waitForTimeout(500);
  /* dal 04/09 l'ora sta SOTTO la data nella stessa cella (`<small>`): la data è
     il primo nodo di testo, e il valore è la SECONDA cella, non la terza */
  const righeV2 = await pg.$$eval("#graf-v2 table.tab tbody tr", (e) => e.map((r) => ({ data: r.cells[0].firstChild.textContent.trim(), hint: !!r.querySelector(".ann-hint") }))).catch(() => []);
  const r1707 = righeV2.find((r) => r.data === "17/07/2026");
  dice(r1707 && !r1707.hint, "sulla lettura di V2 del 17/07 (giorno della volata b1) il suggerimento NON c'è", JSON.stringify(righeV2));
  dice(righeV2.filter((r) => r.hint).length === 4, "e sulle altre quattro di V2 sì", JSON.stringify(righeV2));
  const confDopoHint = testo(await pg.$eval("#mon-conf", (e) => e.innerHTML));
  dice(confDopoHint === confPrima, "⛔ il suggerimento non ha cambiato nessun numero: è un candidato, non un'esclusione", confDopoHint);

  // ── 1 · la ragione vuota è rifiutata ──────────────────────────────────
  await pg.click('[data-graf-mon="p1"]').catch(() => {});
  await pg.waitForTimeout(500);
  const nAzioni = await pg.$$eval('#graf-p1 [data-ann-mon="p1"]', (e) => e.length).catch(() => 0);
  dice(nAzioni === 6, `ogni lettura di PM10 ha l'azione «Non valida» (${nAzioni} su 6)`, nAzioni);
  await pg.click('#graf-p1 [data-ann-mon="p1"]');
  await pg.waitForTimeout(400);
  const modale = await pg.$eval("#modal", (e) => e.classList.contains("show")).catch(() => false);
  dice(modale, "il tocco apre la modale del core", modale);
  await pg.selectOption("#modal-ragione", "altro").catch(() => {});
  await pg.waitForTimeout(150);
  const notaVisibile = await pg.$eval("#modal-nota-lab", (e) => getComputedStyle(e).display !== "none").catch(() => false);
  dice(notaVisibile, "scegliendo «altro» compare il campo del testo", notaVisibile);
  await pg.click("#modal-foot .mbtn.danger");
  await pg.waitForTimeout(300);
  const ancoraAperta = await pg.$eval("#modal", (e) => e.classList.contains("show")).catch(() => false);
  const esito = testo(await pg.$eval("#modal-esito", (e) => e.innerHTML).catch(() => ""));
  dice(ancoraAperta && /ragione/.test(esito), "⛔ «altro» senza il testo è rifiutato: la modale resta aperta e dice perché", esito);
  await scatta(pg, `${W}-2-modale-rifiuto`);

  // ── 2 · dichiarare non valida la lettura più recente (19/07, 36,8) ────
  await pg.selectOption("#modal-ragione", "temporale");
  await pg.waitForTimeout(150);
  await scatta(pg, `${W}-3-modale-ragione`);
  await pg.click("#modal-foot .mbtn.danger");
  await pg.waitForTimeout(900);
  const chiusa = await pg.$eval("#modal", (e) => !e.classList.contains("show")).catch(() => false);
  dice(chiusa, "salvata: la modale si chiude", chiusa);
  const righeP1 = await pg.$$eval("#graf-p1 table.tab tbody tr", (e) => e.map((r) => ({
    data: r.cells[0].firstChild.textContent.trim(), valore: r.cells[1].textContent.trim(),
    annullata: r.classList.contains("annullata"), tag: (r.querySelector(".tag.ann") || {}).textContent || "",
    barrato: getComputedStyle(r.cells[1]).textDecorationLine.includes("line-through"),
    ripristina: !!r.querySelector("[data-rip-mon]"), nonValida: !!r.querySelector("[data-ann-mon]") }))).catch(() => []);
  const rAnn = righeP1.find((r) => r.data === "19/07/2026");
  dice(rAnn && rAnn.annullata && /annullata · temporale/i.test(rAnn.tag), "⛔ la riga del 19/07 resta in tabella, barrata, col badge «annullata · temporale»", JSON.stringify(rAnn));
  dice(rAnn && rAnn.valore === "36,8", "⛔ e il valore è ancora scritto (36,8): non si cancella", rAnn && rAnn.valore);
  dice(rAnn && rAnn.barrato, "il numero è barrato davvero (misurato col computed style)", rAnn && rAnn.barrato);
  dice(rAnn && rAnn.ripristina && !rAnn.nonValida, "al posto di «Non valida» c'è «Ripristina»", JSON.stringify(rAnn));
  dice(righeP1.filter((r) => r.annullata).length === 1, "le altre cinque righe restano com'erano", righeP1.filter((r) => r.annullata).length);
  const meta = testo(await pg.$eval("#graf-p1 .graf-head:nth-of-type(2) .graf-meta, #graf-p1 .graf-meta", (e) => e.innerHTML).catch(() => ""));
  const legenda = testo(await pg.$eval("#graf-p1 .graf-leg", (e) => e.innerHTML).catch(() => ""));
  dice(/annullate:\s*1/.test(legenda), "la legenda della serie dice che una lettura NON è disegnata perché annullata", legenda);
  const confDopo = testo(await pg.$eval("#mon-conf", (e) => e.innerHTML));
  dice(/\b0\s+in attenzione/.test(confDopo) && /\b5\s+conform/.test(confDopo),
    "⛔ il riepilogo di conformità CAMBIA con la dichiarazione (5 conformi · 0 in attenzione): l'ultima valida è 33,7 su 40", confDopo);
  dice(/1 lettura è stata dichiarata non valida e non pesa/.test(confDopo),
    "⛔ e lo DICHIARA: «1 lettura è stata dichiarata non valida e non pesa su questi conti»", confDopo);
  await pg.$eval("#graf-p1", (e) => e.scrollIntoView()).catch(() => {});
  await pg.waitForTimeout(200);
  await scatta(pg, `${W}-4-riga-annullata`);
  await pg.$eval("#mon-conf", (e) => e.scrollIntoView()).catch(() => {});
  await pg.waitForTimeout(200);
  await scatta(pg, `${W}-5-riepilogo`);
  void meta;

  // ── 3 · il report per l'ente ───────────────────────────────────────────
  await pg.click("#nav-rep").catch(() => {});
  await pg.waitForTimeout(600);
  /* il report parte dagli ultimi trenta giorni, e le letture della
     dimostrazione sono di giugno-luglio: si sceglie il periodo che le contiene,
     con i campi veri (il `change` è quello che la pagina ascolta) */
  await pg.fill("#rep-dal", "2026-06-01"); await pg.dispatchEvent("#rep-dal", "change");
  await pg.fill("#rep-al", "2026-07-31"); await pg.dispatchEvent("#rep-al", "change");
  await pg.waitForTimeout(900);
  const periodo = testo(await pg.$eval("#rep-doc", (e) => e.innerHTML).catch(() => ""));
  dice(/dal 01\/06\/2026 al 31\/07\/2026/.test(periodo), "il documento è sul periodo scelto (01/06 → 31/07)", periodo.slice(0, 200));
  const doc = testo(await pg.$eval("#rep-doc", (e) => e.innerHTML).catch(() => ""));
  dice(/una misura è stata dichiarata non valida da chi tiene l'archivio \(temporale\)/.test(doc),
    "⛔ il report dichiara in testa «una misura è stata dichiarata non valida … (temporale)»", doc.slice(0, 400));
  dice(/Misure dichiarate non valide: 1 lettura annullata \(temporale\)/.test(doc),
    "e la scheda del punto PM10 lo ripete con la ragione", (doc.match(/.{80}Misure dichiarate.{120}/) || [])[0]);
  const schedaP1 = await pg.$$eval("#rep-doc .rep-punto", (e) => e.map((x) => x.innerText).find((t) => /PM10/.test(t)) || "");
  dice(/Letture nel periodo:\s*5\b/.test(schedaP1) && /massimo\s*44,2/.test(schedaP1),
    "il punto conta 5 letture (non 6) e il massimo resta 44,2: la riga tolta non era il massimo", schedaP1.slice(0, 300));
  await pg.$eval("#rep-doc .rep-esito, #rep-doc", (e) => e.scrollIntoView()).catch(() => {});
  await scatta(pg, `${W}-6-report`);

  // ── 4 · il file che va all'ente ────────────────────────────────────────
  await pg.click("#nav-reg").catch(() => {});
  await pg.waitForTimeout(500);
  await pg.evaluate(() => {
    window.__csv = null;
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
  await pg.click("#btn-export-amb").catch(() => {});
  await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  const rigaP1 = csv.split("\n").find((r) => r.includes("PM10")) || "";
  const celle = rigaP1.split(";");
  dice(celle[2] === "33.7" && celle[5] === "Conforme", "⛔ il file scrive il valore dell'ultima lettura VALIDA (33.7) e «Conforme», come lo schermo", rigaP1);
  dice(!/2026-07-19:36\.8/.test(celle[6] || ""), "lo storico nel file non contiene più il 19/07", celle[6]);
  dice(/1 lettura annullata \(temporale\)/.test(celle[6] || "") && /1 lettura annullata \(temporale\)/.test(celle[9] || ""),
    "⛔ e lo DICHIARA due volte: nella cella dello storico e in quella della provenienza", rigaP1);

  // ── 5 · il ripristino rimette tutto ────────────────────────────────────
  await pg.click("#nav-mon").catch(() => {});
  await pg.waitForTimeout(600);
  if (!(await pg.$("#graf-p1"))) { await pg.click('[data-graf-mon="p1"]').catch(() => {}); await pg.waitForTimeout(500); }
  await pg.click('#graf-p1 [data-rip-mon="p1"]').catch(() => {});
  await pg.waitForTimeout(400);
  await scatta(pg, `${W}-7-ripristina`);
  await pg.click("#modal-foot .mbtn.primary").catch(() => {});
  await pg.waitForTimeout(900);
  const confFine = testo(await pg.$eval("#mon-conf", (e) => e.innerHTML));
  dice(confFine === confPrima, "⛔ dopo il ripristino il riepilogo è IDENTICO a quello di partenza", confFine);
  const annRimaste = await pg.$$eval("#graf-p1 table.tab tbody tr.annullata", (e) => e.length).catch(() => -1);
  dice(annRimaste === 0, "e nessuna riga è più barrata", annRimaste);
  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  await pg.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_MODULO.length}`);
  if (colpiti.size !== DIFETTI_MODULO.length) {
    console.error("✗ il difetto non ha trovato il suo pezzo di modulo: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

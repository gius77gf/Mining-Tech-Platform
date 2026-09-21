/* SCUDO · LE OSSERVAZIONI DI SICUREZZA, PREMUTE (05/09, notte)
   Una buona pratica vista, o una cosa da correggere PRIMA che succeda
   qualcosa: si segnala dallo stesso modale del near-miss («0 · Che cosa
   segnali»), entra nel registro degli eventi con `tipo: "osservazione"` e un
   `esito`, ha il suo filtro, e si conta A PARTE sotto il riepilogo dei
   near-miss. Qui si preme davvero: il modale, i due versi, il filtro, il
   riepilogo che sale — a 390 (il telefono in piedi sul piazzale) e a 320.
   ⚠️ Le prove sulle funzioni pure stanno in `run-kpi.mjs`: qui si prova quello
   che solo il browser sa dire — che il pulsante scriva, che la striscia
   compaia, che la buona pratica NON apra la domanda sull'azione correttiva.
   Controprova: tre difetti (il compositore scavalcato nella pagina; il record
   che nasce near-miss nel modulo; il riepilogo che conta i near-miss), tutti
   con `applica(t, file)` per file.
   Uso: node scudo-osservazioni.mjs [--porta=N] [--controprova] [--scatti=DIR] */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8631;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".woff2": "font/woff2" };
const MODULO = "apps/scudo/scudo-data.js", PAGINA = "apps/scudo/index.html";

const DIFETTI = [
  ["    const b = oss ? bozzaOsservazione(dati) : bozzaNearMiss(dati);",
   "    const b = bozzaNearMiss(dati);   /* difetto rimesso dal banco */", PAGINA],
  ["  return { ...base, record: { ...r, tipo: \"osservazione\", esito, gravitaPotenziale: undefined, descrizione: prefisso + r.descrizione } };",
   "  return { ...base, record: { ...r, esito, gravitaPotenziale: undefined, descrizione: prefisso + r.descrizione } };   /* difetto rimesso dal banco */", MODULO],
  ["  const tutte = (infortuni || []).filter((x) => x && x.tipo === \"osservazione\");\n  const list = tutte.filter((x) => dentroFinestraNM(x, giorni, oggi));\n  const raggruppa",
   "  const tutte = (infortuni || []).filter((x) => x && x.tipo === \"near-miss\");   /* difetto rimesso dal banco */\n  const list = tutte.filter((x) => dentroFinestraNM(x, giorni, oggi));\n  const raggruppa", MODULO],
];
const colpiti = new Set();
const applica = (t, file) => {
  for (const [a, b, f] of DIFETTI) if (f === file && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
  return t;
};
const srv = createServer((q, s) => {
  const p = decodeURIComponent((q.url || "/").split("?")[0]);
  const f = join(R, p);
  if (!existsSync(f) || statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  let corpo = readFileSync(f);
  if (CONTROPROVA) for (const file of [MODULO, PAGINA]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "Content-Type": TIPI[extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
/* contrassegno col pid, riletto DAL server: se risponde un altro, ci si ferma */
const SEGNO = join(R, "__scudo-oss-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__scudo-oss-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`); process.exit(2); }
} finally { unlinkSync(SEGNO); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";
let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log("  ✓ " + t); }
  else { ko++; console.log("  ✗ " + t + (x !== undefined ? "  → " + String(x).slice(0, 400) : "")); }
};
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };
const testo = (pg, sel) => pg.$eval(sel, (e) => e.textContent.replace(/\s+/g, " ").trim()).catch(() => "");
const modaleAperto = (pg) => pg.$eval("#modal", (e) => getComputedStyle(e).display !== "none" && e.classList.contains("open") || getComputedStyle(e).display !== "none" && getComputedStyle(e).visibility !== "hidden" && getComputedStyle(e).opacity !== "0").catch(() => false);

for (const W of [390, 320]) {
  console.log(`\n── Scudo a ${W} px ──`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(String(e)));
  /* ⛔ Un banco che muore su un `click` scaduto dichiara MENO prove, e un
     totale più basso si legge come «ha guardato meno roba»: qui si aspetta
     poco, e ogni passo che non raggiunge il suo soggetto lo dice e tira avanti. */
  pg.setDefaultTimeout(4000);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/scudo/index.html`);
  await pg.waitForTimeout(1500);
  await pg.click("#nav-doc").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-doc", `navigato davvero nei Documenti/eventi (${viste.join(",") || "nessuna"})`, viste);

  // 1 · il riepilogo, sullo storico intero: la dimostrazione ha tre osservazioni
  await pg.click('#nm-periodo [data-nm-periodo="0"]').catch(() => {});
  await pg.waitForTimeout(500);
  let riep = await testo(pg, "#oss-riep");
  dice(/^Osservazioni di sicurezza · 3 osservazioni nel periodo: 2 buone pratiche e 1 cosa da correggere\./.test(riep), "⛔ il riepilogo conta le tre osservazioni della dimostrazione, nei due versi", riep);
  dice(/3 osservazioni sono meno di 5/.test(riep) && !/per luogo/.test(riep), "e con tre dice che sono poche, senza classifiche", riep);
  const nmRiep = await testo(pg, "#nm-riep");
  dice(/^\d+ near-miss in tutto lo storico/.test(nmRiep) && !/osservazion/i.test(nmRiep), "il riepilogo dei near-miss non le conta", nmRiep);
  await pg.evaluate(() => document.getElementById("oss-riep")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-riepilogo`);

  // 2 · il filtro del registro
  await pg.click('#inf-filtri [data-filtro="osservazione"]').catch(() => {});
  await pg.waitForTimeout(500);
  const righe = await pg.$$eval("#inf-list .item", (e) => e.map((r) => ({
    nome: r.querySelector(".name")?.textContent.replace(/\s+/g, " ").trim(), meta: r.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim(),
    badge: r.querySelector(".acts .badge")?.textContent.trim(), cls: r.querySelector(".acts .badge")?.className, pot: !!r.querySelector("[data-pot]") })));
  dice(righe.length === 3, "il filtro «Osservazioni» mostra tre righe", righe.length);
  dice(righe.filter((r) => r.badge === "Buona pratica" && /\bok\b/.test(r.cls || "")).length === 2 && righe.filter((r) => r.badge === "Da correggere" && /\bwarn\b/.test(r.cls || "")).length === 1,
    "⛔ la pastiglia è l'ESITO: due «Buona pratica» verdi e una «Da correggere» gialla", JSON.stringify(righe.map((r) => [r.badge, r.cls])));
  dice(righe.every((r) => /Comportamento sicuro \/ buona pratica|Condizione o comportamento da correggere/.test(r.meta || "")), "e la riga di dettaglio scrive l'esito per esteso, non la gravità", JSON.stringify(righe.map((r) => r.meta)));
  dice(righe.every((r) => !r.pot), "nessun «e se fosse andata male» su un'osservazione", JSON.stringify(righe.map((r) => r.pot)));
  await pg.evaluate(() => document.getElementById("inf-filtri")?.scrollIntoView({ block: "start" }));
  await scatta(pg, `${W}-2-filtro`);

  // 3 · la buona pratica, dal modale: nessuna domanda sull'azione correttiva
  await pg.click("#btn-nm2").catch(() => {});
  await pg.waitForTimeout(500);
  dice(await modaleAperto(pg), "il modale della segnalazione si apre", await testo(pg, "#modal-title"));
  dice((await testo(pg, "#modal-title")) === "Segnala un near-miss o un'osservazione", "col titolo che nomina tutt'e due", await testo(pg, "#modal-title"));
  const chips = await pg.$$eval("#nm-tipo .chg", (e) => e.map((c) => [c.textContent.trim(), c.classList.contains("active")]));
  dice(JSON.stringify(chips) === JSON.stringify([["Near-miss", true], ["Buona pratica", false], ["Da correggere", false]]), "⛔ «0 · Che cosa segnali»: tre pulsanti, il near-miss già scelto", JSON.stringify(chips));
  dice((await testo(pg, "#nm-lab1")) === "1 · Che cosa è successo", "la prima etichetta parla di un fatto", await testo(pg, "#nm-lab1"));
  await pg.click('#nm-tipo [data-nm-tipo="positiva"]');
  await pg.waitForTimeout(200);
  dice((await testo(pg, "#nm-lab1")) === "1 · Che cosa riguarda", "scelta la buona pratica, la prima etichetta cambia verbo", await testo(pg, "#nm-lab1"));
  await scatta(pg, `${W}-3a-modale-cima`);
  await pg.click('#nm-cat [data-nm-cat="caduta-massi"]');
  await pg.click('#nm-luo [data-nm-luo="fronte"]');
  await pg.fill("#nm-dett", "disgaggio fatto prima del turno");
  await scatta(pg, `${W}-3-modale`);
  await pg.click('#modal .dw-btn.primary, #modal button.primary').catch(() => {});
  await pg.waitForTimeout(1200);
  const striscia1 = await testo(pg, "#inf-esito");
  dice(/^Osservazione registrata: Osservazione positiva — disgaggio fatto prima del turno\./.test(striscia1), "⛔ la striscia dice «Osservazione registrata» con la descrizione composta dal modulo", striscia1 || "(vuota)");
  dice(!(await modaleAperto(pg)), "⛔ una buona pratica NON apre la domanda sull'azione correttiva: il modale è chiuso", await testo(pg, "#modal-title"));
  await pg.waitForTimeout(400);
  riep = await testo(pg, "#oss-riep");
  dice(/4 osservazioni nel periodo: 3 buone pratiche e 1 cosa da correggere\./.test(riep), "e il riepilogo sale a quattro, tre positive", riep);
  await scatta(pg, `${W}-4-registrata`);

  // 4 · la cosa da correggere: la domanda sull'azione c'è
  /* se il passo prima ha lasciato un modale aperto (è quello che fa il difetto
     rimesso), lo si chiude qui: se no il pulsante sotto non è raggiungibile e
     il banco morirebbe invece di misurare */
  if (await modaleAperto(pg)) await pg.evaluate(() => window.chiudiModale && window.chiudiModale());
  await pg.waitForTimeout(300);
  await pg.click("#btn-nm2").catch(() => {});
  await pg.waitForTimeout(500);
  let passo4 = true;
  for (const sel of ['#nm-tipo [data-nm-tipo="da-correggere"]', '#nm-cat [data-nm-cat="mezzi"]', '#nm-luo [data-nm-luo="piazzale"]'])
    await pg.click(sel).catch(() => { passo4 = false; });
  dice(passo4, "il modale della seconda segnalazione è raggiungibile (se no il resto del passo NON è misurato)", await testo(pg, "#modal-title"));
  await pg.click('#modal .dw-btn.primary, #modal button.primary').catch(() => {});
  await pg.waitForTimeout(1200);
  const striscia2 = await testo(pg, "#inf-esito");
  dice(/^Osservazione registrata: Da correggere — Mezzi e investimento — Piazzale\./.test(striscia2), "la cosa da correggere: striscia col suo verso", striscia2 || "(vuota)");
  dice((await modaleAperto(pg)) && (await testo(pg, "#modal-title")) === "Osservazione registrata" && /Registrarla serve a poco se poi non si corregge/.test(await testo(pg, "#modal-body")),
    "⛔ e QUI la domanda sull'azione correttiva si apre, con le parole dell'osservazione", (await testo(pg, "#modal-title")) + " | " + (await testo(pg, "#modal-body")).slice(0, 160));
  const bott = await pg.$$eval("#modal button", (e) => e.map((x) => x.textContent.trim()));
  dice(bott.includes("Apri un'azione correttiva") && bott.includes("Non adesso"), "con i due pulsanti di sempre", JSON.stringify(bott));
  await scatta(pg, `${W}-5-da-correggere`);
  await pg.click("#modal button:has-text(\"Non adesso\")").catch(() => {});
  await pg.waitForTimeout(600);
  riep = await testo(pg, "#oss-riep");
  dice(/5 osservazioni nel periodo: 3 buone pratiche e 2 cose da correggere\./.test(riep) && /5 osservazioni sono meno di 5/.test(riep) === false, "cinque: il conto sale e a cinque NON si dice più che sono poche", riep);
  dice(/per luogo: .*Fronte <?b?>?2|per luogo: /.test(await pg.$eval("#oss-riep", (e) => e.innerHTML)), "e da cinque compaiono le classifiche per luogo e per tema", (await pg.$eval("#oss-riep", (e) => e.innerHTML)).slice(0, 300));
  const righe2 = await pg.$$eval("#inf-list .item .acts .badge:first-child", (e) => e.map((x) => x.textContent.trim()));
  dice(righe2.length === 5 && righe2.filter((x) => x === "Buona pratica").length === 3, "il registro filtrato ha cinque righe, tre buone pratiche", JSON.stringify(righe2));

  // 5 · la tendina delle origini, nelle Azioni
  await pg.click("#nav-azio").catch(() => {});
  await pg.waitForTimeout(600);
  const opz = await pg.$$eval("#azi-origine option", (e) => e.map((o) => o.textContent.trim()));
  dice(opz.filter((o) => /^Osservazione del /.test(o)).length === 5 && !opz.some((o) => /^Near-miss del .*(Osservazione positiva|Da correggere —)/.test(o)), "⛔ la tendina «nasce da» chiama l'osservazione col suo nome, non «Near-miss»", JSON.stringify(opz.slice(0, 6)));

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "la pagina non scorre in orizzontale");
  await pg.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

/* LO SCONTO DEL CLIENTE ARRIVA FINO AL DOCUMENTO?
   ────────────────────────────────────────────────────────────────────────
   Fino al 03/08 no: la scheda cliente diceva «sconto 5%» e ogni DDT usciva al
   prezzo PIENO di listino, perché `rigaPesata` il cliente non lo riceveva
   proprio. Misurato su una differita vera — 2.230 t a 12,34 €/t — erano
   **1.375,91 €** fatturati in più di quello che il cliente vedeva scritto.

   Perché questo banco vive nel browser e non in `run-kpi`: le funzioni pure
   sono già blindate lì. Quello che solo la pagina può dire è se il numero
   scontato **arriva davanti agli occhi di chi registra il DDT** — che è il
   punto in cui il difetto viveva, non nel calcolo.

   Uso:
     node sconto-cliente.mjs [porta]
     node sconto-cliente.mjs --senza-cliente   (rimette il difetto: DEVE fallire)
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..", "..");
const SENZA_CLIENTE = process.argv.includes("--senza-cliente");
const PORTA = Number(process.argv.find((a) => /^\d+$/.test(a))) || 8355;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si serve una pagina in cui l'anteprima NON passa il cliente,
     cioè esattamente com'era prima. Si tocca la risposta HTTP, mai il file. */
  if (SENZA_CLIENTE && p.endsWith("conti/index.html")) {
    const prima = corpo.toString("utf8");
    const dopo = prima.replace("rigaPesata(p, lordoN, taraN, cliAnt)", "rigaPesata(p, lordoN, taraN)");
    if (dopo === prima) { console.error("  ✗ CONTROPROVA INERTE: la chiamata da guastare non c'è più"); process.exitCode = 2; }
    corpo = Buffer.from(dopo, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));

async function prendiChromium() {
  for (const dove of ["playwright", "/opt/node22/lib/node_modules/playwright/index.mjs",
                      "/opt/node22/lib/node_modules/playwright/index.js"]) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error("Playwright non si trova.");
  process.exit(2);
}
const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));

let ok = 0, ko = 0;
const dice = (buono, testo, extra) => {
  if (buono) { ok++; console.log(`  ok  ${testo}`); }
  else { ko++; console.log(`  KO  ${testo}${extra !== undefined ? `\n        -> ${JSON.stringify(extra)}` : ""}`); }
};

await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2500);
dice(errori.length === 0, "Conti: nessun errore di pagina", errori.slice(0, 2));

await pg.evaluate(() => window.go("pes"));
await pg.waitForTimeout(400);

const clienti = await pg.evaluate(() =>
  [...document.getElementById("pes-cli").options].map((o) => ({ v: o.value, t: o.textContent.trim() })));
const prodotti = await pg.evaluate(() =>
  [...document.getElementById("pes-prod").options].map((o) => ({ v: o.value, t: o.textContent.trim() })));

async function anteprimaPer(nomeCliente) {
  const c = clienti.find((x) => x.t.includes(nomeCliente));
  if (!c) return null;
  await pg.selectOption("#pes-cli", c.v);
  await pg.selectOption("#pes-prod", prodotti.find((x) => x.v).v);
  await pg.fill("#pes-lordo", "30,5");
  await pg.fill("#pes-tara", "8,2");
  await pg.waitForTimeout(350);
  return pg.evaluate(() => {
    const r = document.getElementById("pes-riep");
    return { righe: [...r.querySelectorAll(".mrec")].map((m) => m.textContent.replace(/\s+/g, " ").trim()),
             testo: r.innerText.replace(/\s+/g, " ").trim() };
  });
}

/* ⚠️ I numeri attesi si RICAVANO da quello che la pagina mostra, non si
   scrivono a mano: la prima stesura aveva cablato i valori della prova in
   `node` (prezzo 12,34) mentre il listino dimostrativo sta a 15,50, e accusava
   il codice di un difetto che non c'era.
   ⚠️ E il confronto è senza maiuscole: l'etichetta ha `text-transform:
   uppercase` e `innerText` restituisce la trasformazione EFFETTIVA, quindi
   cercare «Sconto» non trova «SCONTO». Due volte di fila, la prova sbagliata
   che accusa il codice giusto. */
const numero = (s) => { const m = /€\s*([\d.]+,\d+)/.exec(s || ""); return m ? +m[1].replace(/\./g, "").replace(",", ".") : NaN; };
const dentro = (s, x) => String(s).toLowerCase().includes(x.toLowerCase());

const conSconto = await anteprimaPer("Edilcave");
const senza = await anteprimaPer("Stradesud");
dice(!!conSconto && !!senza, "i due clienti dimostrativi ci sono (uno con sconto, uno senza)");

if (conSconto && senza) {
  const pieno = numero(senza.righe.find((r) => dentro(r, "valore")));
  const scontato = numero(conSconto.righe.find((r) => dentro(r, "valore")));
  const listino = numero(conSconto.righe.find((r) => dentro(r, "listino")));
  const atteso = Math.round(pieno * 0.95 * 100) / 100;
  console.log(`     listino ${listino} €/t · pieno ${pieno} € · scontato ${scontato} € · atteso ${atteso} €`);

  dice(dentro(conSconto.testo, "sconto"), "chi ha lo sconto lo vede scritto nell'anteprima", conSconto.testo.slice(0, 90));
  dice(Math.abs(scontato - atteso) < 0.005, "e il valore della consegna è quello scontato", { scontato, atteso });
  dice(scontato < pieno, "che è meno del prezzo pieno", { scontato, pieno });
  dice(!dentro(senza.testo, "sconto"), "a chi NON ha lo sconto non viene inventato", senza.testo.slice(0, 90));
  dice(Math.abs(pieno - listino * 22.3) < 0.02, "e il suo valore è quantità × listino, intero", { pieno, listino });
}

await b.close();
srv.close();
console.log(`\n${ok} passate, ${ko} fallite`);
if (SENZA_CLIENTE) {
  console.log(ko > 0
    ? "CONTROPROVA PRESA: senza il cliente nel conto il banco cade, quindi sa fallire."
    : "⛔ CONTROPROVA INERTE: togliere il cliente non cambia niente — questo banco non misura lo sconto.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

/* QUALE CONTO DI PUNTI STA SCRIVENDO LO STORICO DI GENESI?
   ────────────────────────────────────────────────────────────────────────
   Fino al 03/08 la home metteva «250.000 punti» accanto a «volume ≈ 1.234 m³».
   Il primo numero era la nuvola **intera**, per giunta sottocampionata a
   quello che si riesce a disegnare; il secondo era il **ritaglio**. Due numeri
   di due cose diverse, uno accanto all'altro, che chiunque legge come «il
   ritaglio ha 250.000 punti»: un numero **tranquillo** dove non era stato
   misurato niente — il difetto che `CLAUDE.md` chiama «l'assenza di un dato
   non è un dato favorevole», visto dal lato del dato che c'è ma parla d'altro.

   Uso:
     node punti-nuvola.mjs [porta]
     node punti-nuvola.mjs --conto-unico   (rimette il difetto: DEVE fallire)
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = join(QUI, "..", "..", "..", "..");
const CONTO_UNICO = process.argv.includes("--conto-unico");
/* ⚠️ QUESTO BANCO ALZA UN SERVER SUO, quindi NON può prendere la porta
   posizionale che `tutti.mjs` passa a tutti i banchi: proverebbe a mettersi
   sulla porta del server comune e morirebbe con **EADDRINUSE alla prima riga**.
   Ed è quello che succedeva: dentro il giro questo banco non è mai partito, e
   il riepilogo scriveva «KO» — che si legge come «il banco ha trovato qualcosa»
   invece di «il banco non è mai stato eseguito». Tre banchi su ventinove erano
   in questo stato. La porta si cambia con `--porta=`, che nessun altro passa. */
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8388;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si rimette la riga di prima, quella che scriveva un conto
     solo senza dire di che cosa fosse. Si tocca la risposta, mai il file. */
  if (CONTO_UNICO && p.endsWith("genesi/genesi.html")) {
    const prima = corpo.toString("utf8");
    /* ⚠️ Si punta la CHIAMATA, non la dichiarazione: la prima stesura
       sostituiva la prima occorrenza di `_puntiNuvola(e)`, che è
       `function _puntiNuvola(e){` — e la pagina moriva con «Function
       statements require a function name». La controprova «passava» perché
       tutto era rotto, non perché la scritta fosse cambiata. */
    const dopo = prima.replace("+_puntiNuvola(e)+",
      "+(e.puntiMostrati?(' · '+gnum(e.puntiMostrati,0)+' punti'):'')+");
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
  console.error("Playwright non si trova."); process.exit(2);
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

/* I tre casi che possono stare nello storico, seminati prima che la pagina
   parta: il ritaglio misurato, la nuvola sottocampionata senza ritaglio, e un
   record VECCHIO (solo `punti`) che non va inventato né buttato. */
const CASI = [
  { nome: "ritaglio-misurato", puntiMostrati: 250000, puntiTotali: 3000000, puntiRitaglio: 41230, volume: 1234, data: "01/08/2026" },
  { nome: "solo-caricata", puntiMostrati: 250000, puntiTotali: 3000000, data: "02/08/2026" },
  { nome: "tutta-disegnata", puntiMostrati: 88000, puntiTotali: 88000, data: "02/08/2026" },
  { nome: "record-vecchio", punti: 120000, data: "30/07/2026" },
];
await pg.addInitScript((casi) => {
  try { localStorage.setItem("genesiNuvole", JSON.stringify(casi)); } catch (e) {}
}, CASI);

await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2600);
dice(errori.length === 0, "Genesi: nessun errore di pagina", errori.slice(0, 2));

const righe = await pg.evaluate(() =>
  [...document.querySelectorAll("#hgNuvole .hg-item")].map((x) => x.innerText.replace(/\s+/g, " ").trim()));
dice(righe.length === 4, `lo storico mostra i ${righe.length} rilievi seminati`, righe);
righe.forEach((r) => console.log("     ", r));

const riga = (n) => righe.find((r) => r.toLowerCase().includes(n)) || "";
const dentro = (s, x) => String(s).toLowerCase().includes(String(x).toLowerCase());

dice(dentro(riga("ritaglio-misurato"), "41.230 punti nel ritaglio"),
  "col ritaglio misurato si scrive IL RITAGLIO, e lo si dice", riga("ritaglio-misurato"));
dice(!dentro(riga("ritaglio-misurato"), "250.000"),
  "e non compare il conto della nuvola intera accanto al volume del ritaglio", riga("ritaglio-misurato"));
dice(dentro(riga("solo-caricata"), "250.000 punti disegnati su 3.000.000 caricati"),
  "senza ritaglio si dice quanti se ne DISEGNANO su quanti ce n'è", riga("solo-caricata"));
dice(dentro(riga("tutta-disegnata"), "88.000 punti caricati") && !dentro(riga("tutta-disegnata"), " su "),
  "e se non è sottocampionata non si scrive un «su» che non serve", riga("tutta-disegnata"));
dice(dentro(riga("record-vecchio"), "120.000 punti caricati"),
  "un record salvato PRIMA si mostra com'era, senza inventargli un ritaglio", riga("record-vecchio"));

await b.close();
srv.close();
console.log(`\n${ok} passate, ${ko} fallite`);
if (CONTO_UNICO) {
  console.log(ko > 0
    ? "CONTROPROVA PRESA: col conto unico il banco cade, quindi sa fallire."
    : "⛔ CONTROPROVA INERTE: rimettere il conto unico non cambia niente.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

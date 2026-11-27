/* IL MODALE "COLLEGA LA PPV MISURATA" LANCIAVA UN'ECCEZIONE APRENDO DUE VOLTE
   DI FILA (19/09, dal deep-pass UX su Sentinella)
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-ppv-modale-race.mjs [--porta=8969]
     node sentinella-ppv-modale-race.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. In `collegaPpv` (apps/sentinella/index.html), quando il
   modale ha un `<select id="ppv-scelta">` reale (letture di sismografo
   disponibili), `adattaVoci()` misura lo spazio e si riprogramma con
   `requestAnimationFrame(adattaVoci)` — perché a `apriModale` appena
   chiamato la finestra può non essere ancora disegnata (`clientWidth` a
   zero). Quella chiusura cattura `s`, l'elemento SELECT di QUEL modale.

   `chiudiModale()` (shared/dw-app-ui.js) nasconde il modale ma non svuota
   `#modal-body`; la successiva `apriModale()` (su un'altra volata) SOVRASCRIVE
   `modal-body.innerHTML`, quindi il vecchio `s` resta con `parentNode ===
   null` mentre il suo `tagName` resta "SELECT". Se il fotogramma differito
   del PRIMO modale non è ancora scattato quando il SECONDO modale si apre —
   basta aprire, premere «Annulla» e aprire un'altra volata nella stessa
   sequenza sincrona di eventi, prima del prossimo paint — la guardia
   `if (!s || s.tagName !== "SELECT") return;` lascia passare il vecchio `s`
   fino a `s.parentNode.appendChild(cl)`, che lancia
   `Cannot read properties of null (reading 'appendChild')`: un'eccezione
   vera, in produzione, sul secondo modale premuto di fila.

   La riproduzione va fatta con `element.click()` DENTRO un solo
   `page.evaluate`, non con `page.click()` di Playwright: quest'ultimo cede
   il controllo fra un'azione e l'altra, e il fotogramma del primo modale fa
   in tempo a scattare (con `s` ancora agganciato, perché il modale non è
   ancora stato sostituito) — il banco non proverebbe niente. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8969;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };

const DIFETTI = [
  ['if (!s || !s.isConnected || s.tagName !== "SELECT") return;',
   'if (!s || s.tagName !== "SELECT") return;'],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__ppv-race-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__ppv-race-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 300) : ""}`); } };

console.log(`\n════════ modale PPV: aprire due volte di fila non lancia eccezioni${CONTROPROVA ? " · controprova" : ""} ════════`);

const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(1500);
await pg.evaluate(() => { if (window.go) window.go("reg"); });
await pg.waitForTimeout(600);

/* ⛔ LA PROVA DI AVER TROVATO IL CASO, prima di misurare: due volate con una
   select vera (letture di sismografo disponibili), non l'input nascosto —
   quella è la forma su cui `adattaVoci` fa qualcosa. Un banco che assumesse
   sempre gli indici 1 e 5 della dimostrazione crederebbe di provare il
   difetto e proverebbe invece un modale senza select, dove la guardia
   `tagName !== "SELECT"` bastava già da sola. */
const conSelect = await pg.evaluate(async () => {
  const btns = [...document.querySelectorAll("[data-ppv-vol]")];
  const idx = [];
  for (let i = 0; i < btns.length; i++) {
    btns[i].click();
    await new Promise((r) => setTimeout(r, 60));
    const s = document.getElementById("ppv-scelta");
    if (s && s.tagName === "SELECT") idx.push(i);
    const annulla = [...document.querySelectorAll("#modal-foot .mbtn")].find((b) => b.textContent.trim() === "Annulla");
    if (annulla) annulla.click();
    await new Promise((r) => setTimeout(r, 250));
  }
  return idx;
});
dice(conSelect.length >= 2, "⛔ almeno due volate con una select vera (letture disponibili) per riprodurre il caso", conSelect);

/* IL CASO: aprire, annullare e riaprire su un'altra volata, TUTTO dentro un
   solo evaluate — con page.click() di Playwright il primo fotogramma
   differito farebbe in tempo a scattare prima della seconda apertura, e il
   banco non proverebbe niente (lo spiega l'intestazione del file). */
if (conSelect.length >= 2) {
  await pg.evaluate(([i1, i2]) => {
    const btns = document.querySelectorAll("[data-ppv-vol]");
    btns[i1].click();
    const annulla = [...document.querySelectorAll("#modal-foot .mbtn")].find((b) => b.textContent.trim() === "Annulla");
    annulla.click();
    btns[i2].click();
  }, [conSelect[0], conSelect[1]]);
  await pg.waitForTimeout(400);
  dice(errori.length === 0, "⛔ nessuna eccezione dopo aver aperto due modali PPV di fila (select→Annulla→select)", errori);
  // e il secondo modale è comunque apribile e usabile, non solo silenzioso
  const secondoOk = await pg.evaluate(() => {
    const t = document.getElementById("modal-title");
    return !!(t && /PPV/i.test(t.textContent || ""));
  });
  dice(secondoOk, "e il secondo modale si è aperto davvero, con il suo titolo");
  // richiude per lasciare la pagina pulita
  await pg.evaluate(() => {
    const annulla = [...document.querySelectorAll("#modal-foot .mbtn")].find((b) => b.textContent.trim() === "Annulla");
    if (annulla) annulla.click();
  });
} else {
  dice(false, "il banco non ha trovato due volate con select vera: non prova niente");
}

await pg.close();
console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (colpiti.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${colpiti.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

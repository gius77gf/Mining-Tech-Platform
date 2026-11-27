/* IL PIEDE DELLA MODALE NON ACCUMULA ASCOLTATORI (CONTI, "SCRIVI IL VERBALE")
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-modal-foot-listener.mjs [--porta=8955]
     node conti-modal-foot-listener.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Conti (18/09). Il flusso "Scrivi il
   verbale" (renderVerbale, apps/conti/index.html) ascoltava il click sul
   piede della modale con `{ capture:true, once:false }`, per leggere il
   campo #modal-nota PRIMA che la modale si chiudesse (il bottone della
   struttura risolve solo su #modal-campo). Ma qualunque bottone del piede
   ("Annulla" o "Salva il verbale") chiude sempre la modale — chiediValore
   risolve su entrambi — quindi dopo il PRIMO click non resta niente da
   ascoltare. `once:false` lasciava il listener attaccato al nodo
   persistente #modal-foot (svuotato solo nell'innerHTML a ogni apertura,
   mai negli ascoltatori): ogni "Scrivi il verbale" ne aggiungeva un altro,
   mai rimosso — un ascoltatore in più per ogni apertura della vita della
   pagina.
   Misura qui: si apre il flusso tre volte (Annulla ogni volta), poi si
   conta quante volte il listener REAGISCE a un click solo, la quarta
   volta — non quanti ne sono stati aggiunti (quello lo si sa già), quanti
   ESEGUONO davvero. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8955;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO = [
  `{ capture: true, once: true }`,
  `{ capture: true, once: false }`,
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage();
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));

// conta quante volte un listener aggiunto su #modal-foot REAGISCE a un click,
// non quanti ne sono stati registrati — è la differenza che conta
await pg.addInitScript(() => {
  window.__footFires = 0;
  const orig = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, opts) {
    if (this && this.id === "modal-foot" && type === "click" && typeof listener === "function") {
      const avvolto = function (e) { window.__footFires++; return listener.apply(this, arguments); };
      return orig.call(this, type, avvolto, opts);
    }
    return orig.call(this, type, listener, opts);
  };
});

await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2000);
if (CONTROPROVA) console.log(iniezioniDifetto === 1 ? "il difetto è stato rimesso nella pagina servita" : "⛔ il difetto NON è stato iniettato (l'ancora non ha combaciato)");

await pg.evaluate(() => { if (window.go) window.go("rep"); });
await pg.waitForTimeout(1500);

// apre il flusso "Scrivi il verbale" e preme "Annulla" — tre volte, per
// far accumulare gli ascoltatori se il difetto c'è
for (let i = 0; i < 3; i++) {
  await pg.evaluate(() => { const b = document.getElementById("btn-ric-verbale"); if (b) b.click(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const bs = [...document.querySelectorAll("#modal-foot .mbtn")]; const a = bs.find((x) => /annulla/i.test(x.textContent)); if (a) a.click(); });
  await pg.waitForTimeout(400);
}

// la quarta apertura: azzera il contatore PRIMA dell'ultimo click, così
// misura solo quel click, non i tre precedenti
await pg.evaluate(() => { const b = document.getElementById("btn-ric-verbale"); if (b) b.click(); });
await pg.waitForTimeout(400);
await pg.evaluate(() => { window.__footFires = 0; });
await pg.evaluate(() => { const bs = [...document.querySelectorAll("#modal-foot .mbtn")]; const a = bs.find((x) => /annulla/i.test(x.textContent)); if (a) a.click(); });
await pg.waitForTimeout(400);
const fires = await pg.evaluate(() => window.__footFires);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(fires === 1, "dopo quattro aperture del flusso, un solo click sul piede fa reagire UN solo ascoltatore (non si accumulano)", fires);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

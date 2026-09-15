/* IL VERBALE DICE DAVVERO COME È NATO IL NUMERO?
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node verbale-origine.mjs [--porta=8494]
     node verbale-origine.mjs --controprova   (toglie `descriviOrigine`: DEVE fallire)

   PERCHÉ ESISTE. Il verbale di rilievo è il foglio che va a un ente, e ha una
   sezione intitolata «Come è stato ottenuto il numero». Fino al 04/08 quella
   sezione diceva soltanto la **classe di accuratezza** — cioè quanto fidarsi,
   non **da dove viene** il numero: di un volume calcolato dal visore, Terra non
   conservava nessun parametro.

   ⚠️ E il primo banco che ho scritto per provarlo **non guardava dove
   credeva**: chiamava `window.__verbale`, che non esiste (la funzione vive
   dentro il modulo), cadeva nel ramo di ripiego e stampava «1 prova, 1
   passata» — avendo verificato solo che la pagina si aprisse. Questo banco
   invece fa quello che fa una persona: preme il bottone del verbale, compila la
   richiesta del rilevatore, e **legge il documento che si apre**.
   `window.open` viene intercettato, perché il documento è scritto lì dentro. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/* La radice che il banco SERVE. Di serie è la cartella viva, ma `tutti.mjs`
   la punta su una COPIA congelata (`DW_RADICE`): così il giro non pretende più
   che nessuno lavori per un'ora e mezza. Vedi docs/PIANO_GIRO_SU_COPIA.md. */
const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8494;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

let iniezioni = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  /* CONTROPROVA: si serve il verbale «com'era», cioè senza la provenienza del
     calcolo. Si tocca la risposta HTTP, mai il file. */
  /* ⏱️ dal 05/09 il paragrafo lo compone `verbaleRilievo` nel MODULO: la
     riga da togliere sta lì, non nella pagina */
  if (CONTROPROVA && p.endsWith("apps/terra/terra-data.js")) {
    let t = corpo.toString("utf8");
    const a = '    + " " + descriviOrigine(r)';
    iniezioni += t.split(a).length - 1;
    t = t.replace(a, '    + ""');
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(PORTA, r));

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 200))}` : ""}`); }
};
const misura = async (fn, arg) => {
  try { return await pg.evaluate(fn, arg); }
  catch (e) { return { __rotto: String(e.message).split("\n")[0].slice(0, 120) }; }
};

console.log(`\n════════ il verbale dice come è nato il numero?${CONTROPROVA ? " · controprova" : ""} ════════`);

await pg.goto(`http://127.0.0.1:${PORTA}/apps/terra/index.html`);
await pg.waitForTimeout(2300);
dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

/* si intercetta la finestra della stampa PRIMA di premere il bottone */
await pg.evaluate(() => {
  window.__doc = null;
  window.open = () => ({
    document: { write: (h) => { window.__doc = h; }, close: () => {} },
    focus: () => {}, print: () => {},
  });
});

/* si dà a un rilievo una provenienza dal visore, passando dalla via vera: il
   modulo dati dell'app. Non si finge il documento — si finge il RILIEVO, che è
   il dato che in produzione arriverebbe dal ponte. */
const preparato = await misura(() => {
  const b = document.querySelector("[data-verb-ril]");
  return b ? { trovato: true, id: b.getAttribute("data-verb-ril") } : { trovato: false };
});
dice(!!preparato && preparato.trovato === true, "c'è un rilievo con il bottone del verbale", preparato);

await pg.click("#nav-rilievi").catch(() => {});
await pg.waitForTimeout(400);

/* PRIMA: un rilievo senza provenienza registrata */
await pg.click("[data-verb-ril]", { timeout: 6000 }).catch(async () => {
  await pg.evaluate(() => { const b = document.querySelector("[data-verb-ril]"); if (b) b.click(); });
});
await pg.waitForTimeout(600);
await pg.evaluate(() => {
  const b = [...document.querySelectorAll("#modal-foot .mbtn")].find((x) => x.textContent === "Prepara il verbale");
  if (b) b.click();
});
await pg.waitForTimeout(700);
const senza = await misura(() => {
  const h = window.__doc || "";
  const i = h.indexOf("Come è stato ottenuto il numero");
  return { c: h.length, sez: i < 0 ? "" : h.slice(i, i + 1600).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") };
});
dice(!!senza && senza.c > 500, "il documento del verbale viene prodotto davvero", senza && senza.c);
/* ⚠️ questa riga era scritta come `… === false ? false : true`, cioè vera
   ogni volta che l'oggetto esisteva: un'asserzione che non poteva cadere. La
   sezione si cerca nel documento, e se non c'è la prova deve cadere. */
dice(!!senza && String(senza.sez || "").length > 40,
  "e contiene la sezione «Come è stato ottenuto il numero»", senza && senza.sez);
dice(!!senza && /non è registrata/.test(String(senza.sez)),
  "⛔ senza provenienza il verbale lo DICHIARA, non tace", senza && senza.sez);
dice(!!senza && /non è riproducibile/.test(String(senza.sez)),
  "e dice che il numero non è rifacibile", senza && senza.sez);

console.log(`\n${ok + ko} prove · ${ok} passate, ${ko} fallite`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`iniezioni: ${iniezioni} sostituzioni nella risposta HTTP`);
  if (iniezioni === 0) { console.log("⚠️ NESSUNA INIEZIONE: la controprova non prova niente"); process.exit(3); }
  console.log(ko >= 2 ? "✓ il banco SA fallire: senza la provenienza cadono le prove giuste"
                      : "⚠️ troppo poche cadute");
  process.exit(ko >= 2 ? 0 : 1);
}
process.exit(ko ? 1 : 0);

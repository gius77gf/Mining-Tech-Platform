/* «SEI SENZA RETE» — la fascia che sei app su sei non avevano.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node senza-rete.mjs [--porta=8820]
     node senza-rete.mjs --controprova   (toglie il montaggio: DEVE fallire)

   ⛔ IL FATTO, MISURATO PRIMA. Nessuna delle sei app verticali guardava
   `navigator.onLine` né ascoltava `online`/`offline`; il core sì, in due punti.
   E l'assenza di segnale in cava non è un caso di scuola: è il modo in cui una
   scrittura fallisce PIÙ SPESSO di tutti, perché il rapportino si compila al
   fronte e il giro macchina in piazzale. Oggi lo si scopriva premendo Salva,
   cioè dopo aver compilato tutto.

   ⚠️ E LA FRASE NON PROMETTE NIENTE, che è la parte da non «migliorare»: la
   persistenza offline di Firestore NON è configurata (decisione 5b, che resta
   al fondatore perché mette una copia dei dati dell'organizzazione nel browser
   di un telefono di cantiere condiviso). Scrivere «lo salvo appena torna la
   linea» sarebbe la peggior categoria di messaggio — quello che rassicura a
   vuoto. Il banco pretende che quella promessa NON ci sia.

   ⚠️ E `navigator.onLine === false` è affidabile in un verso solo: quando dice
   «false» la rete non c'è; quando dice «true» può esserci una rete senza
   Internet. Perciò la fascia compare solo sul `false`, e il banco misura
   tutt'e due i versi — che compaia offline e che SPARISCA online. Una fascia
   che non sa sparire è un avviso che nessuno legge più. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8820;
const CONTROPROVA = process.argv.includes("--controprova");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

let staccati = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.replace(/\\/g, "/").endsWith("shared/dw-app-ui.js")) {
    const t = corpo.toString("utf8");
    const da = "    if (o.senzaRete !== false) montaSenzaRete();";
    if (t.includes(da)) { corpo = Buffer.from(t.replace(da, "    /* montaggio staccato dalla controprova */"), "utf8"); staccati++; }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""}`); }

let ok = 0, ko = 0, misurate = 0;
const dice = (cond, che, extra) => {
  if (cond) { ok++; console.log(`  ✓ ${che}`); }
  else { ko++; console.log(`  ✗ ${che}${extra === undefined ? "" : "  →  " + JSON.stringify(extra)}`); }
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const app of APP) {
  /* si parte OFFLINE: la fascia deve esserci dal primo istante, non dopo un
     evento — chi apre l'app in cava è già senza rete.
     ⛔ E NON SI USA `context.offline`, che era la prima stesura e non misurava
     niente: quel flag blocca **tutta** la rete, compreso il caricamento della
     pagina dal server del banco. Il `goto` falliva, la pagina non partiva, e
     dodici prove cadevano su un prodotto che non era mai stato aperto — il
     righello che accusa il soggetto. Si dichiara `navigator.onLine`, che è
     l'unica cosa che il prodotto legge. */
  const ctx = await b.newContext({ viewport: { width: 430, height: 950 } });
  const pg = await ctx.newPage();
  await pg.addInitScript(() => {
    window.__online = false;
    Object.defineProperty(window.navigator, "onLine", { configurable: true, get: () => window.__online === true });
  });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/${app}/`, { waitUntil: "domcontentloaded" }).catch(() => {});
  await pg.waitForTimeout(2200);
  console.log(`\n══════ ${app} ══════`);
  dice(errori.length === 0, `${app}: la pagina non solleva errori`, errori.slice(0, 2));
  misurate++;

  const off = await pg.evaluate(() => {
    const el = document.getElementById("dw-senza-rete");
    if (!el) return { c: false };
    return { c: getComputedStyle(el).display !== "none", testo: (el.textContent || "").replace(/\s+/g, " ").trim() };
  });
  dice(off.c, `${app}: senza rete la fascia si vede`, off);
  if (off.c) {
    dice(/non viene salvato/i.test(off.testo), `${app}: e dice che quello che si scrive non viene salvato`, off.testo);
    /* ⛔ la promessa che NON deve esserci: senza persistenza offline sarebbe falsa */
    dice(!/appena torna|quando torna|lo salvo|sincronizz|in coda/i.test(off.testo),
      `${app}: e NON promette di salvarlo appena torna la linea`, off.testo);
  }

  /* il verso opposto: tornata la rete la fascia deve sparire. Una fascia che
     resta accesa è un avviso che si impara a non guardare. */
  await pg.evaluate(() => { window.__online = true; window.dispatchEvent(new Event("online")); });
  await pg.waitForTimeout(250);
  const on = await pg.evaluate(() => {
    const el = document.getElementById("dw-senza-rete");
    return el ? getComputedStyle(el).display === "none" : null;
  });
  dice(on === true, `${app}: tornata la rete la fascia sparisce`, on);
  await ctx.close();
}
await b.close();
srv.close();

console.log(`\n${ok} passati, ${ko} falliti · ${misurate} app su ${APP.length} misurate`);
if (CONTROPROVA) {
  if (staccati === 0) {
    console.error("\n✗ CONTROPROVA NON VALIDA: il montaggio non è stato staccato in nessuna richiesta.\n"
      + "  Non è il banco a non saper fallire — è l'iniezione che non ha trovato il suo testo.");
    process.exit(2);
  }
  console.log(`montaggi staccati: ${staccati}`);
  console.log(ko >= APP.length
    ? `\n✓ CONTROPROVA: staccato il montaggio, tutte e ${APP.length} le app tornano MUTE e il banco lo vede.`
    : `\n✗ CONTROPROVA: solo ${ko} prove cadute su almeno ${APP.length} attese.`);
  process.exit(ko >= APP.length ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

/* «Durata totale» del pannello Sequenza: si misura, non si deduce.
   Server proprio con contrassegno del pid RILETTO DAL SERVER, e il core aperto
   col finto Firebase (senza, resta la schermata d'accesso e si misura il
   guscio: 258 caratteri contro 658).
   Uso: node apps/deepwork-id/tests/browser/core-sequenza-ritardi.mjs
        node apps/deepwork-id/tests/browser/core-sequenza-ritardi.mjs --controprova
   (con DW_SCATTI=<cartella> salva anche gli scatti)

   ⛔ PERCHE' ESISTE. Il pannello «Sequenza sparo» leggeva i ritardi dei fori con
   `parseNum0`, che di un valore ASSENTE fa zero, e concludeva «Durata totale:
   0 ms» — una volata che dura un istante. L'elenco dei fori due righe sotto
   scriveva onestamente «—» per ognuno: la stessa pagina raccontava due cose
   diverse degli stessi fori, e quella che si legge per prima era la falsa.
   Nessun banco guardava quella frase (`grep -rl "Durata totale"
   apps/deepwork-id/tests/` non dava niente).
   ⚠️ `calcolaCaricaMaxRitardo` NON e' cambiata: raggruppa i fori senza ritardo
   sullo stesso istante, quindi SOVRASTIMA — sbaglia nella direzione prudente, e
   sotto c'e' la previsione di vibrazione, che e' ferma al fondatore. Il banco lo
   misura e basta: 30,0 kg coi sei fori senza ritardo, 5,0 kg quando ce l'hanno
   tutti. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { montaFintoFirebase } from "./finto-firebase.mjs";

/* ⚠️ la tabella sta QUI, prima delle altre costanti, e non e' un vezzo:
   `iniezioni-fresche.mjs` la legge da fermo valutando le costanti che la
   precedono, e la riga `const radice = join(dirname(fileURLToPath(...)))` non si
   puo' valutare fuori dal modulo — messa prima, rendeva l'intera tabella
   «non leggibile», cioe' un'iniezione che nessuno puo' piu' verificare. */
const DIFETTO = [
  /* ⚠️ scritto su UNA RIGA con `\n` espliciti, non con un template a piu' righe:
     `iniezioni-fresche.mjs` legge queste tabelle DA FERMO, e un letterale a piu'
     righe non lo sa leggere — resterebbe fra i «non leggibili», cioe' un'iniezione
     che nessuno puo' piu' verificare se e' ancora sul bersaglio. */
  ["index.html",
   "    const conRit=sorted.filter(f=>Number.isFinite(parseNum(f.ritardo)));\n    const totMs=conRit.length?Math.max(...conRit.map(f=>parseNum(f.ritardo))):null;\n    const senzaRit=sorted.length-conRit.length;",
   "    const totMs=sorted.length>0?Math.max(...sorted.map(f=>parseNum0(f.ritardo)||0)):0;\n    const senzaRit=0;"],
];

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
/* ⚠️ minuscolo di proposito, e la ragione e' misurata: `iniezioni-fresche`
   ricostruisce le costanti che precedono una tabella con `NOME = join(...)`,
   e la sua regex si ferma alla PRIMA `)` — su un `join(dirname(...))`
   annidato produce JS spezzato e dichiara l'intera tabella «non leggibile»,
   cioe' un'iniezione che nessuno puo' piu' verificare. Un nome minuscolo la
   regex non lo guarda. Il difetto del controllo e' in roadmap. */
const radice = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const FUORI = process.env.DW_SCATTI || "";
const VECCHIO = process.argv.includes("--controprova") || process.argv.includes("--vecchio");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".webmanifest": "application/manifest+json" };

/* il difetto vero, com'era: il totale letto col lettore che fa zero */

let iniettati = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); s.end(String(process.pid)); return; }
  let f = join(radice, rotta === "/" ? "index.html" : rotta.replace(/^\//, ""));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { s.writeHead(404); s.end("no"); return; }
  let corpo = readFileSync(f);
  if (f === join(radice, "index.html")) {
    let t = corpo.toString("utf8");
    /* la porticina, aperta SOLO nella pagina servita alla prova: `state`, `DB` e
       il disegnatore del pannello sono variabili di modulo. Il file su disco non
       si tocca. Stesso aggancio che usa `contrasto-core.mjs`. */
    const ago = "window.fabPrimary=fabPrimary;";
    if (!t.includes(ago)) { console.error("⛔ punto d'aggancio non trovato"); process.exit(2); }
    t = t.replace(ago, ago + "\nwindow.__provaUtente=(u)=>{state.user=u;};"
      + "\nwindow.__sonda={st:()=>state,db:()=>DB,lato:()=>renderEditorSide()};");
    if (VECCHIO) for (const [, cerca, sost] of DIFETTO) {
      if (!t.includes(cerca)) { console.error("⛔ INIEZIONE A VUOTO: il pezzo da sostituire non c'e' piu'"); process.exit(2); }
      t = t.replace(cerca, sost); iniettati++;
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(f)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let p = 8871; p < 8890 && !porta; p++) {
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(p, "127.0.0.1", () => r(true)); });
  if (preso) porta = p; else srv.removeAllListeners("error");
}
if (!porta) { console.error("nessuna porta libera"); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ contrassegno «${r}» != pid ${process.pid}`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${VECCHIO ? "  [DIFETTO RIMESSO]" : ""}`); }

/* Playwright non si risolve da questa cartella: si prova dove sta davvero —
   la stessa forma degli altri banchi, non una seconda implementazione */
async function prendiChromium() {
  for (const dove of ["playwright", "/opt/node22/lib/node_modules/playwright/index.mjs",
                      "/opt/node22/lib/node_modules/playwright/index.js"]) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error("Playwright non si trova."); process.exit(2);
}
const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await montaFintoFirebase(pg);
await pg.goto(`http://127.0.0.1:${porta}/index.html`);
await pg.waitForTimeout(3500);
await pg.evaluate(() => window.__provaUtente({ id: "u1", user: "prova", nome: "Giuseppe", cognome: "F.", ruolo: "admin", cave: [] }));
await pg.evaluate(() => window.nav("home"));
await pg.waitForTimeout(900);

/* la prova di essere nel core VERO e non nel guscio d'accesso */
const dentro = await pg.evaluate(() => ({
  caratteri: (document.body.innerText || "").length,
  bottoni: document.querySelectorAll("button").length,
}));
console.log(`dentro il core: ${dentro.caratteri} caratteri, ${dentro.bottoni} bottoni`);
if (dentro.caratteri < 400) { console.error("⛔ sono nel guscio d'accesso, non nel core: mi fermo"); await b.close(); srv.close(); process.exit(2); }

/* si costruisce la volata NELLO STATO che il programma legge, non nel file */
const caso = await pg.evaluate(() => {
  /* ⚠️ la scena porta anche `numero` e una numerazione dei fori CONTINUA: la
     prima stesura ne faceva a meno e lo scatto mostrava «VOLATA #undefined» e
     due righe «Foro #1». Non erano difetti del prodotto — erano della scena —
     ma uno scatto che mente e' peggio di nessuno scatto, perche' chi lo riapre
     fra un mese apre un cantiere su un difetto che non c'e'. */
  const fori = (n, conRitardo, da = 0) => Array.from({ length: n }, (_, i) => ({
    num: da + i + 1, x: (da + i) * 3, y: 0, prof: 10, kg: 5,
    ...(conRitardo ? { ritardo: String(i * 25) } : {}),
  }));
  const DB = window.__sonda.db();
  DB.volate = [
    { id: "sonda-senza", numero: 101, nome: "Senza ritardi", fori: fori(6, false), fronte: { lunghezza_m: 20, altezza_m: 8 }, maglia: { borraggio: 3, spaziatura: 3.5 }, default: { profondita_m: 10 } },
    { id: "sonda-misti", numero: 102, nome: "Ritardi a meta'", fori: [...fori(3, true), ...fori(3, false, 3)], fronte: { lunghezza_m: 20, altezza_m: 8 }, maglia: { borraggio: 3, spaziatura: 3.5 }, default: { profondita_m: 10 } },
    { id: "sonda-tutti", numero: 103, nome: "Tutti coi ritardi", fori: fori(6, true), fronte: { lunghezza_m: 20, altezza_m: 8 }, maglia: { borraggio: 3, spaziatura: 3.5 }, default: { profondita_m: 10 } },
  ];
  return DB.volate.map((v) => v.fori.filter((f) => f.ritardo !== undefined).length);
});
console.log(`i casi hanno agganciato lo STATO: fori con ritardo per volata = ${JSON.stringify(caso)}`);

const leggi = async (id) => {
  const t = await pg.evaluate((vid) => {
    const st = window.__sonda.st();
    st.volataSel = vid; st.voloraTool = "sequenza"; st.foroSel = null;
    /* ⛔ SI NAVIGA DAVVERO, non si disegna soltanto il pannello: senza
       `nav('editor-cava')` il pannello viene composto in un `#ec-side` che sta
       su una schermata NON aperta, e lo scatto fotografa la home. Le
       asserzioni sul testo reggevano lo stesso (leggono `innerText` del
       pannello), ma lo scatto — che in questa casa è uno strumento di prova —
       mostrava un'altra cosa. Trovato GUARDANDO l'immagine, non leggendo il
       codice: è la ragione per cui gli scatti si guardano. */
    window.nav("editor-cava");
    window.__sonda.lato();
    const el = document.getElementById("ec-side");
    return el ? el.innerText.trim() : null;
  }, id);
  return t;
};

if (FUORI) mkdirSync(FUORI, { recursive: true });
let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };

for (const [id, atteso] of [["sonda-senza", "—"], ["sonda-misti", "50 ms"], ["sonda-tutti", "125 ms"]]) {
  const t = await leggi(id);
  if (t === null) { console.log(`  NON MISURATO  ${id}: il pannello non si e' disegnato`); ko++; continue; }
  const riga = (t.split("\n").find((r) => /Durata totale/.test(r)) || "").trim();
  console.log(`  ${id}: «${riga}»`);
  dice(riga.includes(atteso), `${id}: la durata dice «${atteso}»`, riga);
  if (id === "sonda-senza") dice(/nessun foro ha un ritardo/i.test(t), "senza ritardi: il pannello lo DICE invece di scrivere zero", t.slice(0, 300));
  if (id === "sonda-misti") dice(/3 fori senza ritardo/i.test(t), "a meta': dice quanti fori restano fuori", t.slice(0, 300));
  if (id === "sonda-tutti") dice(!/senza ritardo/i.test(t), "coi ritardi tutti: non si dice niente di superfluo", t.slice(0, 300));
  if (FUORI) await pg.screenshot({ path: join(FUORI, `${VECCHIO ? "vecchio-" : "nuovo-"}${id}.png`) });
}
console.log(`\nerrori di pagina: ${errori.length}${errori.length ? " -> " + errori.slice(0, 2).join(" · ") : ""}`);
console.log(`${ok} ok, ${ko} KO${VECCHIO ? `  ·  iniezioni a segno: ${iniettati > 0 ? "sì" : "NO"}` : ""}`);
await b.close(); srv.close();
process.exit(VECCHIO ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

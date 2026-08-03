/* IL CORE NON DICHIARA METRI CUBI CHE NESSUNO HA MISURATO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-rapportini-non-misurati.mjs [--porta=8493]
     node core-rapportini-non-misurati.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il core è l'unica cosa che il fondatore mostra, e il
   rapportino di perforazione è il documento che ne esce. Fino al 03/08 un
   rapportino salvato senza un solo foro misurato veniva scritto ovunque come
   **quattro zeri** — «0 fori · 0,0 mc» nell'elenco, «Fori: 0 · Metri: 0,0 ·
   Media foro: 0,00 m · Mc: 0,0» nel PDF — mentre il modulo che lo compila la
   cosa giusta la faceva già («—» nel riquadro dei totali, «nessun foro
   misurato» nell'anteprima). Fra quello che l'utente vede mentre scrive e
   quello che finisce nel documento c'era la differenza fra un «non lo so» e
   uno zero.

   ⛔ E IL CASO PEGGIORE È L'ALTRO, perché non è nemmeno evidente: la maglia è
   un campo **libero e opzionale** (`validaRapp`: «tutti i campi sono
   opzionali»), e senza di lei `parseMaglia` risponde `B=0, S=0`, quindi
   `mc = media × fori × 0 × 0 × 0.9` fa **zero**. Venti fori misurati, sessanta
   metri perforati veri, e accanto «0,0 mc».

   ⚠️ PERCHÉ SERVE UN BANCO DEL BROWSER e non basta `run-kpi`. La regola sta in
   `shared/` (`misureRapportino`, `totaliRapportini`) ed è provata lì con otto
   blocchi. Quello che `node` non può vedere è il **collegamento**: che l'elenco
   la chiami davvero, che la scheda scriva la ragione invece di far sparire la
   riga, che il riepilogo dichiari quanti rapportini sono rimasti fuori dal
   totale. È la guardia scollegata di CLAUDE.md, e senza questo banco la difesa
   viveva solo negli scatti di uno scratchpad.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DOCUMENTO. I tre rapportini
   entrano sostituendo il DB iniziale nella risposta HTTP di `index.html` —
   cioè passando dalla via vera. Il file su disco non si tocca, e nessun altro
   banco che stia girando misura una falsità.

   ⛔ E IL FINTO FIRESTORE DEVE **RIFIUTARE**, non rispondere vuoto: con un
   Firestore che dice «nessun documento» il core crede di essere al primo
   avvio, semina il database e l'accesso risponde «Credenziali errate» su
   credenziali giuste. È scritto in CLAUDE.md e ci sono ricascato lo stesso,
   costa mezz'ora — quindi la riga sta qui, con la sua ragione. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8493;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I TRE RAPPORTINI, e sono tre perché servono tutt'e tre: due malati e uno
   sano. Senza il sano, il modo più facile di far passare le prove sarebbe
   spegnere ogni numero — che è l'errore opposto e altrettanto grave. */
const RAPP = "rapportini:["
  + "{id:'zz1',userId:'user_operatore',cavaId:'cava_1',data:'2026-07-28',fori:0,fori_fila1:0,fori_fila2:0,"
  + "metri:0,media_prof:0,mc:0,maglia:null,maglia_B:null,maglia_S:null,note:'turno aperto e mai misurato'},"
  + "{id:'zz2',userId:'user_operatore',cavaId:'cava_1',data:'2026-07-29',fori:20,fori_fila1:20,fori_fila2:0,"
  + "metri:60,media_prof:3,mc:0,maglia:null,maglia_B:null,maglia_S:null,note:'venti fori veri, maglia non compilata'},"
  + "{id:'zz3',userId:'user_operatore',cavaId:'cava_1',data:'2026-07-30',fori:18,fori_fila1:18,fori_fila2:0,"
  + "metri:54,media_prof:3,mc:283.5,maglia:'3.5x4',maglia_B:3.5,maglia_S:4,note:'turno normale'}],";
/* ⛔ E L'AGGANCIO NON È PIÙ IL LETTERALE `DB`, PERCHÉ NON CI ARRIVA PIÙ.
   Fino al 03/08 i tre rapportini si mettevano dentro `const DB = {…}`, e
   funzionava perché quel campo restava vuoto. Poi la dimostrazione del core si
   è riempita (`DEFAULT_RAPPORTINI`), e da quel momento `initDBOfflineFallback`
   — il ramo che prende TUTTI i visitatori da quando le regole sono chiuse, e
   quindi anche questo banco — fa `DB.rapportini = [...DEFAULT_RAPPORTINI]`
   **sopra** l'iniezione. Effetto misurato: il banco diceva «l'iniezione ha
   agganciato (1)» e poi misurava i QUATTRO rapportini della dimostrazione,
   cioè un'altra cosa; otto prove su diciotto cadevano e le altre passavano per
   caso. È la terza causa di «non distingue» di CLAUDE.md — l'iniezione che non
   inietta — nella sua veste peggiore, quella che si annuncia riuscita.
   Adesso si sostituisce l'array della dimostrazione, che è il posto da cui i
   dati arrivano davvero, e la prova che l'aggancio ha preso guarda **quanti
   rapportini l'app ha in mano**, non quanti caratteri sono stati sostituiti. */
const DB_VUOTO = "const DEFAULT_RAPPORTINI_FOC = [";
const DB_PIENO = "DEFAULT_RAPPORTINI.length=0;DEFAULT_RAPPORTINI.push(...["
  + RAPP.replace(/^rapportini:\[/, "").replace(/\],$/, "")
  + "]);\nconst DEFAULT_RAPPORTINI_FOC = [";

/* I DIFETTI DA RIMETTERE. Sono le versioni **vere** che il core aveva prima
   del 03/08, non caricature: la riga dell'elenco che sommava `r.mc||0`, le
   quattro righe della scheda che SPARIVANO quando il valore era zero (il modo
   silenzioso di dire la stessa bugia) e il riepilogo che taceva su quello che
   aveva lasciato fuori. */
const DIFETTI = [
  ["  const m=misureRapportino(r);\n  if(!m.misurato) return 'nessun foro misurato';\n  return `${m.fori} fori · ${m.calcolabile?m.mc.toFixed(1)+' mc':'mc non calcolabili'}`;",
   "  return `${r.fori||0} fori · ${(r.mc||0).toFixed(1)} mc`;"],
  ["  if(t.senzaMisura) p.push(`${t.senzaMisura} senza nessun foro misurato`);\n  if(t.senzaVolume) p.push(`${t.senzaVolume} senza maglia, quindi senza volume`);",
   "  /* difetto rimesso: il totale non dice piu' che cosa ha lasciato fuori */"],
  ['<div class="preview-row"><span class="preview-lab">Mc in ballo</span><span class="preview-val">${ms.calcolabile?ms.mc:(ms.misurato?\'non calcolabile: manca la maglia\':\'non calcolabile: nessun foro misurato\')}</span></div>',
   "${r.mc?`<div class=\"preview-row\"><span class=\"preview-lab\">Mc in ballo</span><span class=\"preview-val\">${r.mc}</span></div>`:''}"],
  ['<div class="preview-row"><span class="preview-lab">Fori</span><span class="preview-val">${ms.misurato?`${ms.fori}${r.fori_fila2>0?\' (\'+r.fori_fila1+\'+\'+r.fori_fila2+\')\':\'\'}`:\'nessuno misurato\'}</span></div>',
   "${r.fori?`<div class=\"preview-row\"><span class=\"preview-lab\">Fori</span><span class=\"preview-val\">${r.fori}</span></div>`:''}"],
];

let colpiti = new Set(), iniettato = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p === join(R, "index.html")) {
    let t = corpo.toString("utf8");
    const prima = t;
    t = t.split(DB_VUOTO).join(DB_PIENO);
    if (t !== prima) iniettato = 1;
    if (CONTROPROVA) for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID: un banco che trova la porta occupata e la
   RIUSA misura la copia di qualcun altro e risponde «non so fallire». */
const SEGNO = join(R, "__core-rapp-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__core-rapp-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await montaFintoFirebase(pg);
await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
  r.fulfill({ status: 200, contentType: "text/javascript",
    body: MODULI["firebase-firestore.js"].replace(
      "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
      "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));

await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
/* ⚠️ I dati d'esempio arrivano DOPO che `doLogin` esiste: cliccando subito si
   legge «Credenziali errate» su credenziali giuste. Si riprova finché entra. */
let dentro = false;
for (let giro = 0; giro < 6 && !dentro; giro++) {
  await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
  await pg.waitForTimeout(800);
  dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
}
dice(iniettato === 1, `l'iniezione dei tre rapportini ha agganciato la dimostrazione (${iniettato})`);
dice(dentro, "si entra davvero nell'app");

/* ⚠️ LA PROVA DI AVER NAVIGATO, prima di misurare: un banco che non naviga
   fotografa la stessa schermata e risponde «tutto a posto». */
await pg.evaluate(() => window.nav("volate"));
await pg.waitForTimeout(900);
const viste = await pg.$$eval("[id^=screen-]", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
dice(viste.includes("screen-volate"), `navigato allo storico rapportini (${viste.join(",") || "niente"})`, viste);

const righe = await pg.$$eval("#vol-list .ssub", (e) => e.map((x) => x.innerText));
const riepilogo = await pg.evaluate(() => document.getElementById("vol-summary")?.innerText || "");
/* ⛔ QUESTA RIGA È LA PROVA CHE L'INIEZIONE HA PRESO, e vale più della conta
   dei caratteri sostituiti: quattro righe vorrebbe dire che l'app sta
   mostrando i rapportini della DIMOSTRAZIONE, cioè che il banco sta misurando
   un'altra cosa credendo di misurare i propri casi. */
dice(righe.length === 3, `tre rapportini nell'elenco — quattro vorrebbe dire che si stanno misurando quelli della dimostrazione (${righe.length})`, righe);

// 1 · il turno mai misurato
const r1 = righe.find((t) => /nessun foro misurato/.test(t));
dice(!!r1, "⛔ il turno senza un solo foro misurato lo DICE, invece di scrivere «0 fori · 0,0 mc»", righe);
// 2 · i venti fori senza maglia
const r2 = righe.find((t) => /20 fori/.test(t));
dice(!!r2 && /mc non calcolabili/.test(r2), "⛔ venti fori veri senza maglia: il volume è «non calcolabile», non zero", r2);
dice(!!r2 && !/0\.0 mc/.test(r2), "⛔ e da nessuna parte compare «0.0 mc»", r2);
// 3 · il rapportino sano resta un numero
const r3 = righe.find((t) => /18 fori/.test(t));
dice(!!r3 && /283\.5 mc/.test(r3), "il turno misurato per bene continua a dire il suo volume", r3);
// 4 · il riepilogo dichiara che cosa ha lasciato fuori
dice(/283\.5/.test(riepilogo), "il totale è quello del solo rapportino misurabile", riepilogo);
dice(/non sono nel totale|non è nel totale/.test(riepilogo),
  "⛔ e il riepilogo DICHIARA quanti rapportini sono rimasti fuori", riepilogo);
dice(/senza nessun foro misurato/.test(riepilogo) && /senza maglia/.test(riepilogo),
  "con le due ragioni distinte, che non sono la stessa cosa", riepilogo);

/* LA SCHEDA — ed è qui che il difetto era SILENZIOSO: le righe sparivano. */
async function scheda(id) {
  await pg.evaluate((x) => window.apriRapport(x), id);
  await pg.waitForTimeout(400);
  const t = await pg.evaluate(() => document.getElementById("modal-body")?.innerText || "");
  await pg.evaluate(() => window.closeModal());
  await pg.waitForTimeout(200);
  return t;
}
const s1 = await scheda("zz1");
dice(/Fori/.test(s1) && /nessuno misurato/.test(s1),
  "⛔ nella scheda la riga «Fori» C'È e dice «nessuno misurato»: prima spariva", s1);
dice(/Mc in ballo/.test(s1) && /nessun foro misurato/.test(s1),
  "⛔ e «Mc in ballo» dice perché non si può calcolare", s1);
dice(!/\b0\.0\b/.test(s1) && !/\b0,0\b/.test(s1), "e nessuno zero rimasto in giro", s1);

const s2 = await scheda("zz2");
dice(/manca la maglia/.test(s2),
  "⛔ venti fori senza maglia: la scheda dice che manca la maglia, non «0»", s2);
dice(/60/.test(s2) && /3\.00 m/.test(s2),
  "e i metri e la media, che sono misurati, si scrivono", s2);

const s3 = await scheda("zz3");
dice(/283\.5/.test(s3), "il rapportino sano mostra il suo volume", s3);

dice(errori.length === 0, "la pagina non solleva errori", errori[0]);

if (CONTROPROVA) {
  console.log(`\n  difetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) {
    console.error("✗ CONTROPROVA A VUOTO: un difetto non ha trovato il suo pezzo di pagina.");
    console.error("  Il core è cambiato: vanno riscritti i pezzi in DIFETTI, non tolta la prova.");
    await b.close(); srv.close(); process.exit(2);
  }
}
await b.close(); srv.close();

const SOGLIA = 6;   // quante prove DEVONO cadere quando i difetti sono rimessi
console.log(`\nRisultato rapportini non misurati (core): ${ok} passate, ${ko} cadute`);
if (CONTROPROVA) {
  console.log(ko >= SOGLIA
    ? `✓ controprova: coi difetti rimessi cadono ${ko} prove (almeno ${SOGLIA})`
    : `✗ controprova: cadono solo ${ko} prove, ne servono almeno ${SOGLIA}`);
  process.exit(ko >= SOGLIA ? 0 : 1);
}
process.exit(ko === 0 ? 0 : 1);

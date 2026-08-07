/* IL PIANO DI INNESCO XML — l'uscita di Genesi che NESSUN BANCO PREMEVA.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-piano-innesco.mjs [--porta=8749]
     node genesi-piano-innesco.mjs --controprova   (rimette il difetto: DEVE fallire)
     node genesi-piano-innesco.mjs --dimmi         (stampa i file interi)

   PERCHÉ ESISTE. Censendo le uscite di Genesi per EFFETTO invece che per
   somiglianza — non «chi scrive `download =`» ma «che cosa produce un file o
   un testo che l'utente porta fuori»: `download`, `window.print`,
   `clipboard`, `mailto:` — sono venute fuori DIECI uscite: nove file e una
   finestra di stampa. Poi la seconda domanda, quella che conta: **quali di
   queste dieci preme un banco?** `genesi_piano_innesco.xml` non lo premeva
   nessuno, né in export né in import — ed è l'unica delle dieci che non
   leggiamo noi: la leggono i software dei detonatori elettronici e delle
   perforatrici. Un elenco di banchi cresce sulle uscite che si assomigliano
   fra loro; questa aveva un bottone suo, in fondo alla schermata del 2D.

   IL DIFETTO CHE È SALTATO FUORI, e si vede solo rifacendo il giro.
   L'export scrive `<Initiation id="elettronico">Detonatore elettronico</Initiation>`
   — l'id nell'attributo e il nome nel testo, cioè scritto bene. L'import
   leggeva `Explosive`, `Sequence`, `HoleDelay`, `RowDelay`, `Depth`, `Charge`,
   `Stemming` e le posizioni, e **`Initiation` no**: esportando una volata a
   detonatori elettronici e riaprendo il file, l'innesco tornava **Nonel**, il
   default. Non è un dettaglio d'anagrafica — uno schema in stile IREDES lo si
   scrive proprio per i detonatori elettronici — e a schermo lo «Scatter
   innesco» passa da **0,1 ms a 8,0 ms**, ottanta volte, senza che il messaggio
   di conferma dicesse niente. È la stessa famiglia dello scatter consegnato al
   posto del ritardo (42 ms che rientravano 25): un file di scambio che, riletto
   da chi l'ha scritto, cambia il progetto.

   ⚠️ E LA PROVA DI ANDATA E RITORNO DA SOLA NON BASTA — le due metà possono
   sbagliare insieme. Il lettore fa `parseFloat(testo.replace(',','.'))`:
   scrivendo i numeri con la virgola italiana il giro resterebbe **identico** e
   il file sarebbe illeggibile per il software che programma i detonatori.
   Quelle asserzioni stanno sul TESTO, e vivono in `run-kpi.mjs` accanto a
   `xmlPianoInnesco` — qui c'è quello che solo il browser sa fare: premere il
   bottone, rimettere il file dentro e guardare che cosa torna.

   ⚠️ GENESI È `apps/genesi/genesi.html`, non `index.html`: è l'app fuori
   convenzione, e un banco che costruisce il percorso per convenzione qui non
   guarda niente e risponde «pulito».
   ⚠️ E GENESI NON HA `.page`: la navigazione mette `scr-<nome>` sul `body`. La
   prova di aver navigato si legge lì. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8749;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, nella forma in cui stava prima del 07/08: il
   lettore che non guarda l'innesco. Si conta: un'iniezione che non trova il
   suo testo non inietta niente, e la controprova direbbe «non so fallire»
   misurando un file sano. */
const DIFETTI = [
  [`    const innEl=first(plan,'Initiation'), innId=innEl?String(innEl.getAttribute('id')||'').trim():'';
    if(innId && INNESCHI.some(x=>x.id===innId)) D2.innesco=innId;`, ``],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) { if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e
   la RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-piano-innesco-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-piano-innesco-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, prove = 0, fileAperti = 0, campiConfrontati = 0;
const dice = (c, t, x) => {
  prove++;
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 320))}` : ""}`); }
};

/* un progetto che NON somiglia ai default in nessuno dei campi che il file
   porta: se somigliasse, il giro passerebbe per un motivo diverso dal suo nome */
const DESIGN = { B: 3.4, S: 4.1, diam: 89, prof: 12, kg: 48, kgAuto: false, stem: 2.8, sub: 1.3,
  incl: 15, esplosivo: "emulsione-bulk-gassed", innesco: "elettronico", roccia: "calcare",
  frat: "media", bagnato: false, presplit: false, sequenza: "vcut", perRow: 8, file: 2,
  ritardo: 65, ritardoFila: 100, decks: 1, deckStem: 1.2,
  recNorma: "din-sens", recFreq: 25, recDist: 400, dir: "sx" };

async function apri(design) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  pg.__err = []; pg.on("pageerror", (e) => pg.__err.push(e.message));
  await pg.addInitScript((arg) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    if (arg) localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vX", nome: "Fronte Nord 12/07",
      data: "2026-07-12", sintesi: "16 fori", design: arg }]));
  }, design || null);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
    /* si intercetta il salvataggio del file: l'XML esce in forma `data:` */
    window.__usciti = [];
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) {
        window.__usciti.push({ nome: this.download,
          testo: decodeURIComponent(String(this.href).replace(/^data:[^,]*,/, "")) });
        return;
      }
      return clic.apply(this, arguments);
    };
  });
  await pg.waitForTimeout(400);
  if (design) {
    /* la volata si apre dalla via vera, il bottone «Apri» della Home */
    await pg.evaluate(() => {
      const it = document.querySelector('.hg-item[data-id="vX"]');
      const btn = it && it.querySelector('button[data-act="apri"]');
      if (btn) btn.click();
    });
    await pg.waitForTimeout(1600);
  } else {
    await pg.evaluate(() => { const n = document.getElementById("nav-design"); if (n) n.click(); });
    await pg.waitForTimeout(1400);
  }
  return pg;
}
/* ⛔ SI PRETENDE CHE IL FILE SIA USCITO DAVVERO: un banco che preme un bottone
   che non salva niente e poi non trova il testo che cerca stampa un KO che
   sembra un difetto di prodotto. */
async function esce(pg, id, nome) {
  const prima = await pg.evaluate(() => window.__usciti.length);
  const bot = await pg.$("#" + id);
  if (!bot) { dice(false, `il bottone #${id} esiste`, "assente"); return ""; }
  await pg.evaluate((i) => document.getElementById(i).click(), id);
  await pg.waitForTimeout(900);
  const u = await pg.evaluate((n) => (window.__usciti.length > n ? window.__usciti[window.__usciti.length - 1] : null), prima);
  if (!u) { dice(false, `${nome}: il file esce davvero premendo #${id}`, "nessun download"); return ""; }
  fileAperti++;
  dice(u.testo.length > 30, `${nome} esce davvero da #${id} (${u.nome}, ${u.testo.length} caratteri)`, u.testo.slice(0, 90));
  if (DIMMI) console.log(`\n──────── ${u.nome} ────────\n${u.testo}\n────────`);
  return u.testo;
}
/* i campi di PlanData, letti dal testo come li leggerebbe chi apre il file */
const pianoDati = (xml) => Object.fromEntries(
  [...String(xml).split("<Holes")[0].matchAll(/<(\w+)[^>]*>([^<]*)<\/\1>/g)].map((m) => [m[1], m[2]]));
const attributo = (xml, tag, att) =>
  ((String(xml).match(new RegExp(`<${tag}[^>]*\\b${att}="([^"]*)"`)) || [])[1] || "");
const svRiga = async (pg, re) => (await pg.evaluate(() => {
  const el = document.getElementById("d2-scheda"); if (!el) return [];
  return [...el.querySelectorAll(".sv-row")].map((r) => ({ lab: r.querySelector(".sv-lab").textContent.trim(),
    val: r.querySelector(".sv-val").innerText.trim() }));
})).find((r) => re.test(r.lab));

console.log(`\n════════ il piano di innesco XML di Genesi${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · IL FILE DICE QUELLO CHE DICE LO SCHERMO ────────────────────────
console.log("\n· il file e lo schermo, sullo stesso progetto");
const A = await apri(DESIGN);
dice((await A.evaluate(() => document.body.className)).includes("scr-design"),
  "la volata salvata si apre davvero nel 2D", await A.evaluate(() => document.body.className));
const xml = await esce(A, "btn-innesco-xml", "piano di innesco");
const p1 = pianoDati(xml);

const mic = await svRiga(A, /^MIC/);
campiConfrontati += 3;
dice(p1.MaxInstantCharge != null && Math.round(parseFloat(p1.MaxInstantCharge)) === parseInt(String(mic && mic.val).replace(/[^\d]/g, ""), 10),
  `⛔ la carica per ritardo del file è quella dello schermo (${p1.MaxInstantCharge} / ${mic && mic.val})`,
  p1.MaxInstantCharge + " vs " + (mic && mic.val));
dice(p1.MeshBurden === "3.40" && p1.MeshSpacing === "4.10" && p1.HoleDiameter === "89",
  `la maglia del file è quella del progetto aperto (${p1.MeshBurden}×${p1.MeshSpacing}, Ø${p1.HoleDiameter})`,
  JSON.stringify(p1));
dice(p1.HoleDelay === "65" && p1.RowDelay === "100",
  `i ritardi del file sono quelli del progetto (${p1.HoleDelay} / ${p1.RowDelay} ms)`,
  p1.HoleDelay + "/" + p1.RowDelay);

/* ⛔ il campo per cui questo file esiste: l'innesco, con l'id per chi rilegge
   e il nome per chi apre il file e lo guarda */
dice(attributo(xml, "Initiation", "id") === "elettronico" && /Detonatore elettronico/.test(p1.Initiation || ""),
  "il file porta l'innesco con id E nome", attributo(xml, "Initiation", "id") + " / " + p1.Initiation);
dice(+attributo(xml, "Holes", "count") === (xml.match(/<Hole /g) || []).length && +attributo(xml, "Holes", "count") === 16,
  `il conto dei fori non mente (${attributo(xml, "Holes", "count")})`, attributo(xml, "Holes", "count"));

// ── 2 · IL GIRO: SI RIAPRE IN UNA PAGINA NUOVA, E TORNA TUTTO? ─────────
console.log("\n· il giro di andata e ritorno: pagina nuova coi default, si rimette dentro il file");
const B2 = await apri(null);
const partenza = pianoDati(await esce(B2, "btn-innesco-xml", "il piano dei default (per avere il contrasto)"));
/* premessa: i default DEVONO essere diversi dal progetto, se no il giro
   passerebbe anche non facendo niente — è la prima delle due letture di
   «non distingue» */
dice(partenza.Initiation !== p1.Initiation && partenza.MeshBurden !== p1.MeshBurden,
  `premessa: i default sono diversi (innesco ${partenza.Initiation} · spalla ${partenza.MeshBurden})`,
  JSON.stringify(partenza));

await B2.setInputFiles("#fileXmlIn", { name: "piano.xml", mimeType: "application/xml", buffer: Buffer.from(xml, "utf8") });
await B2.waitForTimeout(1600);
const ritorno = pianoDati(await esce(B2, "btn-innesco-xml", "il piano riesportato dopo l'import"));

const CAMPI = ["MeshBurden", "MeshSpacing", "HoleDiameter", "Explosive", "Initiation",
  "Sequence", "HoleDelay", "RowDelay", "LastDetonation", "MaxInstantCharge"];
const persi = CAMPI.filter((c) => p1[c] !== ritorno[c]);
campiConfrontati += CAMPI.length;
dice(persi.length === 0,
  `⛔ il giro non perde nessuno dei ${CAMPI.length} campi di PlanData`,
  persi.map((c) => `${c}: ${p1[c]} → ${ritorno[c]}`).join(" · "));
/* e la riga che questo banco esiste per tenere: l'innesco */
dice(ritorno.Initiation === p1.Initiation && attributo(await esce(B2, "btn-innesco-xml", "riesportato (secondo controllo)"), "Initiation", "id") === "elettronico",
  "⛔ e in particolare l'INNESCO torna elettronico, non ricade su Nonel",
  p1.Initiation + " → " + ritorno.Initiation);

/* il messaggio di conferma dice che cosa è tornato: un giro che cambia il
   progetto in silenzio è peggio di un import che fallisce */
const toast = await B2.evaluate(() => { const t = document.querySelector(".toast"); return t ? t.innerText.trim() : ""; });
dice(/Elettr/i.test(toast) || /elettronico/i.test(toast),
  "e il messaggio di conferma nomina l'innesco che è rientrato", toast);

/* i fori: stesso numero, stesse posizioni, stessi ritardi */
const foriDi = (x) => [...String(x).matchAll(/<Position x="([-\d.]+)" y="([-\d.]+)"[^>]*>[\s\S]*?<Delay unit="ms">([\d.]+)</g)]
  .map((m) => m[1] + "|" + m[2] + "|" + m[3]);
const f1 = foriDi(xml), f2 = foriDi(await esce(B2, "btn-innesco-xml", "riesportato (fori)"));
campiConfrontati += f1.length;
dice(f1.length === 16 && JSON.stringify(f1) === JSON.stringify(f2),
  `⛔ e i ${f1.length} fori tornano identici, posizione e ritardo`,
  f1.slice(0, 3).join(" · ") + "  ≠  " + f2.slice(0, 3).join(" · "));

dice(A.__err.length === 0 && B2.__err.length === 0, "le pagine non sollevano errori",
  (A.__err[0] || "") + (B2.__err[0] || ""));

console.log(`\n──── ${ok} passati, ${ko} falliti · ${fileAperti} file aperti · ${campiConfrontati} campi confrontati ────`);
if (CONTROPROVA) {
  console.log(`  iniezioni: ${colpiti.size} su ${DIFETTI.length} dichiarate hanno trovato il loro testo`);
  if (colpiti.size !== DIFETTI.length) {
    console.error("✗ un'iniezione non ha iniettato niente: la controprova misurerebbe un file sano.");
    await b.close(); srv.close(); process.exit(2);
  }
  if (ko === 0) console.error("✗ CONTROPROVA MUTA: col difetto rimesso dentro non è caduta nessuna prova.");
  else console.log(`✓ controprova: col difetto rimesso dentro cadono ${ko} prove.`);
}
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

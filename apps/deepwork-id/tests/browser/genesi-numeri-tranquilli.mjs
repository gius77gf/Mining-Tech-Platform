/* I NUMERI DI GENESI CHE RESTANO TRANQUILLI QUANDO NON C'È PIÙ NIENTE SOTTO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-numeri-tranquilli.mjs [--porta=8565]
     node genesi-numeri-tranquilli.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 03/08 sono stati corretti cinque numeri tranquilli di
   Genesi che vivevano nel MODULO (`genesi-data.js`) e che `run-kpi` prova.
   La seconda passata è andata a cercarli dove `node` non arriva: nella pagina
   e nei file che escono. Ne sono usciti quattro, e nessuno si vede leggendo il
   codice.

   1. **UN CAMPO SVUOTATO NON DICEVA NIENTE, E LA SCHERMATA RESTAVA UGUALE.**
      Cancellando la SPALLA, il campo restava vuoto, nessun toast, e le
      ventotto righe della scheda validatori continuavano a mostrare gli stessi
      numeri — powder factor 0,55 kg/m³, X50 28 cm, burden minimo 2,4–2,8 m,
      PPV 6,4 mm/s — calcolati su 3,00 m che sullo schermo non c'erano più. Il
      ripiego di `applyDesign` è giusto (non si progetta su un numero
      inventato); quello che mancava è **dirlo**: per un valore ILLEGGIBILE la
      pagina lo faceva già, per un campo VUOTO no.
   2. **`Limite PPV (mm/s);null`** nel CSV della scheda volata — il file che il
      fochino archivia col rapportino. Ci si arriva aprendo una volata salvata
      con un codice di normativa che Genesi non conosce (`apri` fa
      `Object.assign`, senza controlli): `ppvLimit` risponde `null`, e la riga
      si costruiva con dei `+`, che di `null` fanno la parola. Duecento righe
      più in giù `_sentNum` la stessa `null` la scrive come cella VUOTA, con la
      ragione in un commento: la risposta era in casa.
   3. **DUE COPIE PIÙ DEBOLI DI `csvCell`**, sopravvissute alla correzione del
      03/08 su `csvRiconciliazione`. Un referto chiamato `=SUM(1+1)` usciva
      NUDO dal CSV della legge di sito; un fronte chiamato `=cmd|'/c calc'!A1`
      usciva NUDO dal file che importa **Sentinella**. Sono file che si aprono
      in Excel a casa del cliente.
   4. **LA BANDIERA `pochi` LA LEGGEVA UNA SCHERMATA SOLA.** `sitoFit` dichiara
      la legge di sito PROVVISORIA sotto gli 8 referti, e la modale della legge
      lo scriveva in giallo. La scheda validatori — dove il numero decide se
      una volata si può sparare — e il riquadro «Manda a Sentinella» dicevano
      soltanto «calibrata sui tuoi referti». La guardia esisteva e non era
      collegata a chi disegna il numero.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DOCUMENTO. La normativa
   sconosciuta e la legge su tre referti entrano da `localStorage` — cioè dalla
   via vera, le stesse chiavi che l'app scrive da sé (`genesiVolate`,
   `genesiSito`). Il file su disco non si tocca.

   ⚠️ E GENESI NON HA `.page`: la navigazione è `setScreen`, che mette
   `scr-<nome>` sul `body`. La prova di aver navigato si legge lì. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8565;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, uno per riga, col pezzo di pagina che li porta.
   Si contano i difetti CENTRATI, non le sostituzioni: la pagina viene caricata
   più volte e un conto crescente direbbe «15 su 5». Quello che serve sapere è
   se OGNI difetto ha trovato il suo pezzo — un `replace` che non trova niente
   esce in silenzio. */
const DIFETTI = [
  // 1 · la guardia sul campo svuotato (e il suo gemello su «Esplosivo totale»)
  ["    if(!guardiaVuoto(el)) return;\n", "\n"],
  ["  if(String($('dKgTot').value||'').trim()===''){ syncKgTot(); return; }\n", "\n"],
  // 2 · il `null` scritto per intero nel CSV della scheda volata
  ["+rows.map(r=>csvCell(r[0])+';'+csvCell(r[1]===null||r[1]===undefined?'':r[1])).join('\\n')+'\\n';",
   "+rows.map(r=>r[0]+';'+r[1]).join('\\n')+'\\n';"],
  // 3a · la copia più debole di csvCell nel CSV della legge di sito
  ["].map(csvCell).join(';')).join('\\n')+'\\n';",
   "].map(v=>{ const s=String(v==null?'':v); return /[;\"\\n]/.test(s)?'\"'+s.replace(/\"/g,'\"\"')+'\"':s; }).join(';')).join('\\n')+'\\n';"],
  // 3b · la copia più debole nel file che importa Sentinella
  ["function _sentCell(v){ return csvCell(String(v==null?'':v).replace(/[\\r\\n\\t]+/g,' ').trim()); }",
   "function _sentCell(v){ const s=String(v==null?'':v).replace(/[\\r\\n\\t]+/g,' ').trim(); return /[;\"]/.test(s)?'\"'+s.replace(/\"/g,'\"\"')+'\"':s; }"],
  // 4a · la legge provvisoria non dichiarata nella scheda validatori
  ["  const _prov = (_st.fonte==='sito' && _st.fit && _st.fit.avviso==='pochi');",
   "  const _prov = false;"],
  // 4b · e nel riquadro da cui parte il file per Sentinella
  ["    provvisoria: st.fonte==='sito' && !!(st.fit && st.fit.avviso==='pochi'),",
   "    provvisoria: false,"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* ⛔ IL CONTRASSEGNO COL PROPRIO PID. Un banco che trova la porta occupata e la
   RIUSA non fallisce: misura la copia di qualcun altro. Si scrive un file nella
   radice servita e lo si rilegge DAL SERVER; se non torna, ci si ferma qui. */
const SEGNO = join(R, "__genesi-numeri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-numeri-${process.pid}`)).text();
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

/* Apre Genesi, passa il login e il cancello di consenso, e intercetta i due
   modi in cui un documento esce: il salvataggio del file e la finestra di
   stampa. `preludio` costruisce il caso NEI DATI, prima che la pagina parta. */
async function apri(preludio) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  if (preludio) await pg.addInitScript(preludio);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2500);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
    window.__csv = null; window.__doc = null;
    window.open = () => ({ document: { write: (h) => { window.__doc = (window.__doc || "") + h; }, close() {} }, focus() {}, print() {} });
    const clic = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__csv = decodeURIComponent(String(this.href).replace(/^data:text\/csv;charset=utf-8,/, "")); return; }
      return clic.apply(this, arguments);
    };
  });
  await pg.waitForTimeout(600);
  pg.__errori = errori;
  return pg;
}
/* ⚠️ LA PROVA DI AVER NAVIGATO. Genesi non ha `.page`: `setScreen` scrive
   `scr-<nome>` sul body. Un banco che non naviga risponde «tutto a posto» dopo
   aver guardato la schermata sbagliata. */
async function vaiA(pg, schermo) {
  await pg.evaluate((s) => {
    const b = [...document.querySelectorAll("#bottomnav button")].find((x) => x.dataset.scr === s);
    if (b) b.click();
  }, schermo);
  await pg.waitForTimeout(1200);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-" + schermo), `navigato davvero (→ ${schermo})`, cls);
}
const righeScheda = (pg) => pg.evaluate(() => {
  const el = document.getElementById("d2-scheda");
  return el ? [...el.querySelectorAll(".sv-row")].map((r) => ({
    lab: r.querySelector(".sv-lab").textContent.trim(),
    val: r.querySelector(".sv-val").innerText.trim().replace(/\s+/g, " "),
    why: r.querySelector(".sv-why").innerText.replace(/\s+/g, " "),
  })) : [];
});
const VOLATA_NORMA_IGNOTA = () => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord 12/07",
    data: "2026-07-12", sintesi: "12 fori",
    design: { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, esplosivo: "anfo-standard",
      innesco: "nonel", roccia: "calcare", frat: "media", bagnato: false, presplit: false,
      sequenza: "diagonale", recNorma: "uni-9916", recFreq: 25, recDist: 300, perRow: 12, file: 1 } }]));
};
const SITO_TRE_REFERTI = () => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiSito", JSON.stringify({ usa: true, punti: [
    { d: 120, w: 50, ppv: 9.2, fonte: "mano", ts: "2026-06-02", nome: "=SUM(1+1)" },
    { d: 260, w: 55, ppv: 3.1, fonte: "csv", ts: "2026-06-14", nome: "Fronte Sud" },
    { d: 430, w: 48, ppv: 1.4, fonte: "sentinella", ts: "2026-06-30", nome: "Fronte Est" }] }));
};

console.log(`\n════════ i numeri tranquilli di Genesi${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · UN CAMPO SVUOTATO ─────────────────────────────────────────────────
console.log("\n· la spalla cancellata: il campo vuoto e i numeri di prima");
{
  const pg = await apri(() => localStorage.setItem("genesiDisclaimerV1", "1"));
  await vaiA(pg, "design");
  const prima = await righeScheda(pg);
  dice(prima.length > 20, `la scheda validatori si disegna (${prima.length} righe)`, prima.length);
  /* i quattro campi che stanno SOTTO il consumo specifico: se uno di loro è
     vuoto, «kg/m³» è una divisione con un pezzo che nessuno ha compilato */
  for (const [id, atteso] of [["dB", "3"], ["dH", "10"], ["dN", "12"], ["dKg", "58"], ["dKgTot", "696"]]) {
    const r = await pg.evaluate((i) => {
      const e = document.getElementById(i);
      e.value = ""; e.dispatchEvent(new Event("change", { bubbles: true }));
      return { valore: e.value, toast: (document.querySelector(".dw-toast, .toast, #toast") || { innerText: "" }).innerText };
    }, id);
    await pg.waitForTimeout(250);
    dice(String(r.valore).trim() !== "",
      `⛔ ${id} svuotato: il campo torna a mostrare il valore che il progetto usa (${r.valore || "VUOTO"})`, r.valore);
    dice(String(r.valore).replace(",", ".").startsWith(atteso),
      `   e il valore rimesso è proprio quello del progetto (${atteso})`, r.valore);
    if (id !== "dKgTot")
      dice(/non può restare vuot/.test(r.toast), `   e lo dice col toast, invece di tacere`, r.toast);
  }
  const dopo = await righeScheda(pg);
  dice(dopo.length === prima.length && dopo.every((r, i) => r.val === prima[i].val),
    "e alla fine la scheda è tornata identica: nessun numero è stato calcolato su un campo vuoto",
    dopo.filter((r, i) => !prima[i] || r.val !== prima[i].val).map((r) => r.lab + ": " + r.val).join(" | "));
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 2 · IL LIMITE CHE NON C'È, NEL FILE CHE ESCE ──────────────────────────
console.log("\n· volata salvata con una normativa che Genesi non conosce");
{
  const pg = await apri(VOLATA_NORMA_IGNOTA);
  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1400);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-design"), "la volata salvata si apre davvero nel 2D", cls);

  await pg.evaluate(() => document.getElementById("btn-scheda-csv").click());
  await pg.waitForTimeout(300);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  const rigaLim = csv.split("\n").find((r) => r.startsWith("Limite PPV")) || "";
  dice(!/null/.test(csv), "⛔ nel CSV della scheda volata non compare la parola «null»", rigaLim);
  dice(/^Limite PPV \(mm\/s\);\s*$/.test(rigaLim),
    "   la cella del limite resta VUOTA, come già faceva il file per Sentinella", rigaLim);
  const rigaNorma = csv.split("\n").find((r) => r.startsWith("Norma PPV")) || "";
  dice(/uni-9916/.test(rigaNorma),
    "   e accanto c'è la norma citata: è l'unica cosa che dice perché il limite manca", rigaNorma);

  /* la stessa `null` nel report stampabile faceva già la cosa giusta: la prova
     c'è perché la difesa non si perda quando qualcuno riscriverà quella riga */
  await pg.evaluate(() => document.getElementById("btn-report").click());
  await pg.waitForTimeout(500);
  const doc = String(await pg.evaluate(() => window.__doc) || "");
  const m = doc.match(/PPV al recettore[^<]*<\/td><td>([^<]*)</);
  dice(m && /limite —/.test(m[1]), "e il report stampabile scriveva già «limite —»", m && m[1]);
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 3 e 4 · LA LEGGE DI SITO SU TRE REFERTI, E I DUE FILE CHE ESCONO ──────
console.log("\n· legge di sito su tre referti, con un referto dal nome ostile");
{
  const pg = await apri(SITO_TRE_REFERTI);
  await vaiA(pg, "design");
  const righe = await righeScheda(pg);
  const ppv = righe.find((r) => /PPV al recettore/.test(r.lab));
  dice(!!ppv, "la riga della PPV c'è", righe.map((r) => r.lab).join(", ").slice(0, 200));
  dice(ppv && /3 referti/.test(ppv.why), "   e dichiara su quanti referti è tarata la legge", ppv && ppv.why);
  dice(ppv && /provvisoria/i.test(ppv.why),
    "⛔ e che la legge è PROVVISORIA: la bandiera `pochi` la legge anche chi disegna il numero, non solo la modale",
    ppv && ppv.why);

  await pg.evaluate(() => { const x = document.getElementById("sitoOpen"); if (x) x.click(); });
  await pg.waitForTimeout(700);
  const modale = await pg.evaluate(() => (document.getElementById("sitoBody") || { innerText: "" }).innerText.replace(/\s+/g, " "));
  dice(/Legge provvisoria/.test(modale), "la modale della legge lo diceva già (è da lì che si è visto lo scollegamento)", modale.slice(0, 160));

  await pg.evaluate(() => { const x = document.getElementById("sitoExport"); if (x) x.click(); });
  await pg.waitForTimeout(300);
  const csvSito = String(await pg.evaluate(() => window.__csv) || "");
  dice(/;'=SUM\(1\+1\);/.test(csvSito),
    "⛔ nel CSV della legge di sito il referto `=SUM(1+1)` esce con l'apostrofo di guardia, non nudo",
    csvSito.split("\n")[1]);

  await pg.evaluate(() => {
    const c = document.getElementById("sitoClose"); if (c) c.click();
    const x = document.getElementById("sentOpen"); if (x) x.click();
  });
  await pg.waitForTimeout(700);
  const sent = await pg.evaluate(() => (document.getElementById("sentBody") || { innerText: "" }).innerText.replace(/\s+/g, " "));
  dice(/Base della previsione/.test(sent), "il riquadro «Manda a Sentinella» si disegna", sent.slice(0, 120));
  dice(/provvisoria/i.test(sent),
    "⛔ e prima di mandare il file dice che la legge è provvisoria, invece del solo «calibrata»",
    (sent.match(/Base della previsione[^A-Z]{0,200}/) || [])[0]);

  await pg.evaluate(() => {
    const d = document.getElementById("sent-data"); if (d) d.value = "2026-08-10";
    const f = document.getElementById("sent-fronte"); if (f) f.value = "=cmd|'/c calc'!A1";
    document.getElementById("sentExport").click();
  });
  await pg.waitForTimeout(300);
  const csvSent = String(await pg.evaluate(() => window.__csv) || "");
  const riga = csvSent.split("\n")[1] || "";
  dice(/^2026-08-10;'=cmd/.test(riga),
    "⛔ e nel file che importa Sentinella il fronte ostile esce con l'apostrofo di guardia", riga.slice(0, 90));
  dice(csvSent.split("\n").filter((r) => r.trim()).length === 2,
    "   e la riga resta UNA: la normalizzazione dei ritorni a capo serve al lettore di Sentinella, che taglia per righe",
    csvSent.split("\n").length);
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

await b.close();
srv.close();
if (CONTROPROVA) {
  console.log(`\niniezioni: ${colpiti.size} difetti su ${DIFETTI.length} rimessi nella pagina`);
  if (colpiti.size < DIFETTI.length)
    console.log(`  ⚠️ ${DIFETTI.length - colpiti.size} non hanno trovato il loro pezzo: la controprova vale meno di quello che sembra`);
  console.log(colpiti.size === DIFETTI.length && ko > 0
    ? `✓ il banco SA fallire: ${ko} prove cadute coi difetti rimessi`
    : `✗ coi difetti rimessi il banco non distingue (${ko} cadute, ${colpiti.size}/${DIFETTI.length} iniezioni)`);
  process.exit(colpiti.size === DIFETTI.length && ko > 0 ? 0 : 1);
}
console.log(`\nRisultato numeri tranquilli di Genesi: ${ok} passati, ${ko} falliti`);
process.exit(ko > 0 ? 1 : 0);

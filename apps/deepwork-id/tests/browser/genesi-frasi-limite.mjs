/* LE FRASI DI GENESI QUANDO IL NUMERO È UNO — E LA PREVISIONE CHE NON DICE
   SU CHE COSA È TARATA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-frasi-limite.mjs [--porta=8566]
     node genesi-frasi-limite.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Il 06/08 il filo era «il numero è giusto e a mentire è la
   FRASE». In Genesi ne sono uscite due famiglie, e nessuna delle due si vede
   leggendo il codice — si vedono solo costruendo il caso limite e leggendo il
   testo che esce.

   1. **IL SINGOLARE CHE NON C'ERA.** Undici frasi incollavano un plurale a un
      conto che può valere uno, e sette di quelle undici si raggiungono da un
      file che l'utente sceglie o da un contatore della home:
        · «Consuntivo importato: **1 fori**, 61 kg reali»  (consuntivo di Campo)
        · «File letto (**1 fori**), ma nessuna carica reale…»
        · «Il file ha 1 **righe**.»                        (referti del sismografo)
        · «✓ Piano XML importato: **1 fori** · B 3,00×S 3,50»
        · «✓ Volata importata: **1 fori**»
        · «**1 salvate**» e «**1 lavorazioni**»            (i due contatori della home)
        · «**1 punti** caricati»                            (il rilievo del drone)
        · «Qui **1 fori** fuori finestra»                   (scheda validatori, Relief)
      L'ultima è la peggiore delle sette, perché sta nella scheda in cui si
      decide quanto esplosivo mettere in un foro — e ci si arriva senza fare
      niente di strano: **maglia 3 fori × 2 file, finestra di default 5–15**.
      ⚠️ La forma giusta era in casa: `conta` di
      `shared/deepwork-id-client/dw-shell.js`. Genesi ne aveva una copia più
      debole (`_ricPlur`), che su «1» come STRINGA rispondeva «1 fori» e su
      `null` scriveva la parola «null»; adesso `_ricPlur` **è** `conta` (alias,
      non seconda implementazione — la prova dell'identità sta in `run-kpi`).

   2. **LA PREVISIONE PRESENTATA COME UN FATTO.** Misurato salvando lo stesso
      identico progetto due volte, con in mezzo SOLO l'accensione della legge
      di sito su tre referti (che `sitoFit` dichiara PROVVISORIA):
        · scheda validatori → da «6,4 mm/s · K≈1.906 stimati da Calcare» a
          «2,8 mm/s · ricavati dai tuoi 3 referti · **Legge provvisoria**»;
        · **riconciliazione** → «PPV vibrazione | 6,4 mm/s» e «PPV vibrazione |
          2,8 mm/s»: la STESSA riga, niente accanto;
        · **storico** e **CSV che esce dall'azienda** → idem, e lì restano per
          sempre.
      È la stessa famiglia della bandiera `pochi` collegata a una schermata
      sola (03/08); quella volta la schermata dimenticata era il foglio
      stampato, questa volta è la schermata in cui quel numero diventa uno
      scarto contro il misurato.

   ⚠️ I CASI SI COSTRUISCONO NEI DATI, MAI NEL DOCUMENTO: i file entrano dagli
   `<input type=file>` veri, la legge di sito da `localStorage` (le stesse
   chiavi che l'app scrive da sé). Il file su disco non si tocca.

   ⚠️ E GENESI NON HA `.page`: la navigazione è `setScreen`, che mette
   `scr-<nome>` sul `body`. La prova di aver navigato si legge lì. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8566;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE — quelli veri, com'erano scritti prima del 06/08.
   Si contano i difetti CENTRATI, non le sostituzioni: la pagina viene caricata
   più volte, e un conto crescente direbbe «21 su 7». */
const DIFETTI = [
  // 1 · la volata importata da un file JSON
  ["toast('✓ Volata importata: '+_ricPlur(fori.length,'foro','fori')",
   "toast('✓ Volata importata: '+fori.length+' fori'"],
  // 2 · il consuntivo di carico che torna da Campo, nei due rami
  ["    ? 'Consuntivo importato: '+_ricPlur(_ricCampo.foriReg,'foro','fori')+', '+_ricKg(_ricCampo.kgReale)+' kg reali'\n" +
   "    : 'File letto ('+_ricPlur(_ricCampo.foriTot,'foro','fori')+'), ma nessuna carica reale è registrata dentro');",
   "    ? 'Consuntivo importato: '+_ricCampo.foriReg+' fori, '+_ricKg(_ricCampo.kgReale)+' kg reali'\n" +
   "    : 'File letto ('+_ricCampo.foriTot+' fori), ma nessuna carica reale è registrata dentro');"],
  // 3 · il file dei referti del sismografo
  ["Il file ha <b>'+_sitoCsv.righe.length+'</b> '+(_sitoCsv.righe.length===1?'riga':'righe')+'.",
   "Il file ha <b>'+_sitoCsv.righe.length+'</b> righe."],
  // 4 · il piano XML in entrata
  ["toast('✓ Piano XML importato: '+_ricPlur(holes.length,'foro','fori')+' · B '",
   "toast('✓ Piano XML importato: '+gnum(holes.length,0)+' fori · B '"],
  // 5 · i due contatori della home, e la riga del rilievo
  ["$('hgVolN').textContent=arr.length? _ricPlur(arr.length,'salvata','salvate'):'';",
   "$('hgVolN').textContent=arr.length? (arr.length+' salvate'):'';"],
  ["$('hgNuvN').textContent=nv.length? _ricPlur(nv.length,'lavorazione','lavorazioni'):'';",
   "$('hgNuvN').textContent=nv.length? (nv.length+' lavorazioni'):'';"],
  /* ⏱️ RI-ANCORATA il 09/08: la riga non passa più da `_ricPlur` ma da
     `nPunti`, che è `gnum` + `plurale` — perché `conta` sceglie bene la parola
     ma NON raggruppa, e i punti di una nuvola sono decine di migliaia («41230»
     accanto a «3.000.000» nella stessa frase). Il difetto rimesso resta lo
     stesso: il plurale scritto a mano, che su un punto solo direbbe «1 punti
     caricati». */
  ["    : ' · '+nPunti(mostrati,'punto caricato','punti caricati');",
   "    : ' · '+gnum(mostrati,0)+' punti caricati';"],
  // 5b · i due chili che restavano tranquilli sopra il loro stesso trattino
  ["    + riga('Carica reale totale', c.misurabile?_ricKg(c.kgReale)+' kg':'—',\n" +
   "           c.misurabile?'dal file':'nessuna carica reale')",
   "    + riga('Carica reale totale',_ricKg(c.kgReale)+' kg','dal file')"],
  // 6 · la scheda in cui si decide la carica
  ["'Qui '+_ricPlur(nLo+nHi,'foro','fori')+' fuori finestra: il livello <b>Relief</b> '+(nLo+nHi===1?'lo':'li')+' segna",
   "'Qui '+(nLo+nHi)+' fori fuori finestra: il livello <b>Relief</b> li segna"],
  // 7 · la base della PPV prevista, nella riconciliazione e nello storico
  ["+'<div id=\"ric-ppv-base\" style=\"margin-top:8px;color:var(--mut);font-size:12px;line-height:1.4\">Base della PPV prevista: '+_ppvBaseHtml(prev.ppvBase)+'</div>'",
   "+''"],
  ["        +'<br><span style=\"color:var(--mut2)\">base PPV: '\n" +
   "          +_rEsc(r.prev&&r.prev.ppvBase&&r.prev.ppvBase.breve ? r.prev.ppvBase.breve : 'non registrata')+'</span>'",
   "        +''"],
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
   RIUSA non fallisce: misura la copia di qualcun altro. */
const SEGNO = join(R, "__genesi-frasi-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-frasi-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, frasi = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};
/* ogni frase messa alla prova si conta: «nessuna violazione» senza il numero
   dei soggetti non dice se il banco ha guardato qualcosa (regola di casa) */
const frase = (testo, atteso, vietato, nome) => {
  frasi++;
  const t = String(testo == null ? "" : testo).replace(/\s+/g, " ");
  dice(t.includes(atteso) && (!vietato || !t.includes(vietato)), nome, t);
};

async function apri(preludio, coda) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.addInitScript(preludio || (() => localStorage.setItem("genesiDisclaimerV1", "1")));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html${coda || ""}`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(2600);
  await pg.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
    window.__toasts = []; window.__csv = null;
    const o = window.toast;
    window.toast = function (m) { window.__toasts.push(String(m)); return o.apply(this, arguments); };
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
async function vaiA(pg, schermo) {
  await pg.evaluate((s) => {
    const t = [...document.querySelectorAll("#bottomnav button")].find((x) => x.dataset.scr === s);
    if (t) t.click();
  }, schermo);
  await pg.waitForTimeout(1300);
  const cls = await pg.evaluate(() => document.body.className);
  dice(cls.includes("scr-" + schermo), `navigato davvero (→ ${schermo})`, cls);
}
const dai = async (pg, id, nome, testo, mime) => {
  await pg.setInputFiles("#" + id, { name: nome, mimeType: mime || "text/csv", buffer: Buffer.from(testo, "utf8") });
  await pg.waitForTimeout(1100);
};
const toasts = (pg) => pg.evaluate(() => { const t = window.__toasts.slice(); window.__toasts = []; return t.join(" | "); });

const UNO = () => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord",
    data: "2026-07-12", sintesi: "12 fori", design: {} }]));
  localStorage.setItem("genesiNuvole", JSON.stringify([{ nome: "Rilievo drone",
    data: "2026-07-20", puntiMostrati: 1, puntiTotali: 1 }]));
};
const SITO_TRE = () => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiSito", JSON.stringify({ usa: true, punti: [
    { d: 120, w: 50, ppv: 9.2, fonte: "mano", ts: "2026-06-02", nome: "A" },
    { d: 260, w: 55, ppv: 3.1, fonte: "csv", ts: "2026-06-14", nome: "B" },
    { d: 430, w: 48, ppv: 1.4, fonte: "sentinella", ts: "2026-06-30", nome: "C" }] }));
};

console.log(`\n════════ le frasi di Genesi quando il numero è UNO${CONTROPROVA ? " · controprova" : ""} ════════`);

// ── 1 · I DUE CONTATORI DELLA HOME, E IL RILIEVO DA UN PUNTO ──────────────
console.log("\n· la home con UNA volata salvata e UN rilievo da UN punto");
{
  const pg = await apri(UNO);
  await vaiA(pg, "home");
  frase(await pg.evaluate(() => (document.getElementById("hgVolN") || {}).textContent),
        "1 salvata", "1 salvate", "⛔ il contatore delle volate dice «1 salvata», non «1 salvate»");
  frase(await pg.evaluate(() => (document.getElementById("hgNuvN") || {}).textContent),
        "1 lavorazione", "1 lavorazioni", "⛔ e quello dei rilievi «1 lavorazione»");
  frase(await pg.evaluate(() => (document.getElementById("hgNuvole") || {}).innerText),
        "1 punto caricato", "1 punti", "⛔ e la nuvola da un punto solo dice «1 punto caricato»");
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 2 · I FILE CHE L'UTENTE SCEGLIE, CON UNA RIGA SOLA DENTRO ─────────────
console.log("\n· i file importati con un foro / una riga sola");
{
  const pg = await apri();
  await dai(pg, "fileIn", "volata.json",
    JSON.stringify({ volata: { fori: [{ x: 0, prof: 10, kg: 58, ritardo: "25" }] } }), "application/json");
  frase(await toasts(pg), "1 foro", "1 fori", "⛔ volata JSON da un foro: «✓ Volata importata: 1 foro»");

  await vaiA(pg, "design");
  await dai(pg, "fileXmlIn", "piano.xml",
    '<?xml version="1.0"?><BlastPlan><Holes><Hole Id="1"><Position x="0" y="0"/><Delay>0</Delay><Charge>58</Charge></Hole></Holes></BlastPlan>', "text/xml");
  frase(await toasts(pg), "1 foro", "1 fori", "⛔ piano XML da un foro: «✓ Piano XML importato: 1 foro»");

  await pg.evaluate(() => document.getElementById("riconOpen").click());
  await pg.waitForTimeout(600);
  await dai(pg, "riconCampoFile", "consuntivo.csv",
    "data;turno;foro;carica_prog_kg;carica_reale_kg;scarto_pct\n2026-08-01;mattino;1;58;61;5,2\n");
  frase(await toasts(pg), "Consuntivo importato: 1 foro,", "1 fori",
        "⛔ consuntivo di Campo da un foro: «Consuntivo importato: 1 foro, 61 kg reali»");
  await dai(pg, "riconCampoFile", "piano.csv",
    "data;turno;foro;carica_prog_kg;carica_reale_kg;scarto_pct\n2026-08-01;mattino;1;58;;\n");
  frase(await toasts(pg), "File letto (1 foro)", "1 fori",
        "⛔ e il piano non ancora caricato: «File letto (1 foro), ma nessuna carica reale…»");
  /* e sullo stesso file: i due chili che restavano tranquilli. Fino al 06/08
     il riquadro scriveva «Carica reale totale 0 kg · DAL FILE» sopra il
     trattino che dichiarava «nessuna carica reale» — due righe che si
     smentivano a vista. */
  {
    frasi++;
    const q = await pg.evaluate(() => (document.getElementById("riconBody") || {}).innerText.replace(/\s+/g, " "));
    dice(!/Carica reale totale — 0 kg/.test(q) && /Carica reale totale — NESSUNA CARICA REALE/i.test(q.replace(/\s+/g, " ")),
         "⛔ e «Carica reale totale» non scrive 0 kg dove nessuno ha registrato niente",
         (q.match(/Carica reale totale[^A-Z]{0,60}[A-Z ]{0,30}/) || [])[0]);
  }
  await pg.evaluate(() => { const c = document.getElementById("riconClose"); if (c) c.click(); });
  await pg.waitForTimeout(400);

  await pg.evaluate(() => document.getElementById("sitoOpen").click());
  await pg.waitForTimeout(600);
  await dai(pg, "sitoFile", "referti.csv", "distanza_m;carica_kg;ppv_mms\n120;50;9,2\n");
  frase(await pg.evaluate(() => (document.getElementById("sitoBody") || {}).innerText),
        "Il file ha 1 riga.", "1 righe", "⛔ referti del sismografo, una riga: «Il file ha 1 riga.»");
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 3 · LA SCHEDA IN CUI SI DECIDE LA CARICA ──────────────────────────────
console.log("\n· scheda validatori: UN foro fuori dalla finestra di relief");
{
  const pg = await apri();
  await vaiA(pg, "design");
  /* maglia 3 fori × 2 file: con la finestra di DEFAULT (5–15 ms/m) un foro
     solo resta fuori. Non è un caso costruito ad arte — è quello che succede
     aggiungendo la seconda fila. */
  await pg.evaluate(() => {
    for (const [id, v] of [["dN", "3"], ["dFile", "2"]]) {
      const e = document.getElementById(id); e.value = v;
      e.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  await pg.waitForTimeout(900);
  const rel = await pg.evaluate(() => {
    const el = document.getElementById("d2-scheda");
    const r = [...el.querySelectorAll(".sv-row")].find((x) => /Relief per foro/.test(x.querySelector(".sv-lab").textContent));
    return r ? { val: r.querySelector(".sv-val").textContent.trim(), why: r.querySelector(".sv-why").textContent.replace(/\s+/g, " ") } : null;
  });
  dice(!!rel && /0 sotto \/ 1 sopra/.test(rel.val),
       "il caso c'è davvero: un foro solo fuori finestra (3 fori × 2 file, finestra di default)", rel && rel.val);
  frase(rel && rel.why, "Qui 1 foro fuori finestra", "1 fori",
        "⛔ e la scheda che decide la carica dice «Qui 1 foro fuori finestra»");
  frase(rel && rel.why, "<b>Relief</b> lo segna".replace(/<[^>]*>/g, ""), "li segna",
        "⛔ e il pronome lo segue: «lo segna», non «li segna»");
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  await pg.close();
}

// ── 4 · LA PREVISIONE CHE DICE SU CHE COSA È TARATA ───────────────────────
console.log("\n· la stessa volata, due leggi: la riconciliazione deve dire quale");
async function base(preludio, atteso, nome) {
  const pg = await apri(preludio);
  await vaiA(pg, "design");
  await pg.evaluate(() => document.getElementById("riconOpen").click());
  await pg.waitForTimeout(700);
  const nota = await pg.evaluate(() => (document.getElementById("ric-ppv-base") || { innerText: "" }).innerText);
  frase(nota, atteso, null, nome);
  // e la stessa cosa nello storico e nel file che esce
  await pg.evaluate(() => {
    const p = document.getElementById("ric-ppv"); if (p) { p.value = "3,0"; p.dispatchEvent(new Event("input", { bubbles: true })); }
    const n = document.getElementById("ric-nome"); if (n) { n.value = "Fronte Est"; n.dispatchEvent(new Event("input", { bubbles: true })); }
    document.getElementById("riconSave").click();
  });
  await pg.waitForTimeout(800);
  const storico = await pg.evaluate(() => {
    const t = (document.getElementById("riconBody") || {}).innerText || "";
    const i = t.indexOf("Fronte Est");
    return i < 0 ? "" : t.slice(i, i + 220);
  });
  frase(storico, "base PPV:", null, `   e lo storico se la porta dietro (${nome.slice(0, 28)}…)`);
  await pg.evaluate(() => document.getElementById("riconExport").click());
  await pg.waitForTimeout(400);
  const csv = String(await pg.evaluate(() => window.__csv) || "");
  frasi++;
  dice(/;ppv_prev_base\s*$/m.test(csv.split("\n")[0] + "\n") || csv.split("\n")[0].endsWith("ppv_prev_base"),
       "   e il CSV che esce dall'azienda ha la colonna della base", csv.split("\n")[0]);
  dice(pg.__errori.length === 0, "la pagina non solleva errori", pg.__errori[0]);
  const riga = csv.split("\n")[1] || "";
  await pg.close();
  return riga;
}
const rigaLito = await base(null, "stimati da Calcare",
  "⛔ senza referti la riconciliazione dice che K e β vengono dalla litologia");
const rigaSito = await base(SITO_TRE, "3 referti",
  "⛔ con la legge su tre referti dice su quanti è tarata");
{
  const pg = await apri(SITO_TRE);
  await vaiA(pg, "design");
  await pg.evaluate(() => document.getElementById("riconOpen").click());
  await pg.waitForTimeout(700);
  frase(await pg.evaluate(() => (document.getElementById("ric-ppv-base") || { innerText: "" }).innerText),
        "Legge provvisoria", null,
        "⛔ e che sotto gli otto referti è PROVVISORIA — è la bandiera `pochi`, letta anche qui");
  await pg.close();
}
frasi++;
dice(rigaLito.includes("da litologia") && rigaSito.includes("legge di sito · 3 referti · provvisoria"),
     "⛔ e le due righe del CSV non si confondono più: portano scritta la legge da cui vengono",
     rigaLito.split(";").pop() + "  //  " + rigaSito.split(";").pop());

await b.close();
srv.close();
console.log(`\nfrasi messe alla prova nei casi limite: ${frasi}`);
if (CONTROPROVA) {
  console.log(`iniezioni: ${colpiti.size} difetti su ${DIFETTI.length} rimessi nella pagina`);
  if (colpiti.size < DIFETTI.length)
    console.log(`  ⚠️ ${DIFETTI.length - colpiti.size} non hanno trovato il loro pezzo: la controprova vale meno di quello che sembra`);
  console.log(colpiti.size === DIFETTI.length && ko > 0
    ? `✓ il banco SA fallire: ${ko} prove cadute coi difetti rimessi`
    : `✗ coi difetti rimessi il banco non distingue (${ko} cadute, ${colpiti.size}/${DIFETTI.length} iniezioni)`);
  process.exit(colpiti.size === DIFETTI.length && ko > 0 ? 0 : 1);
}
console.log(`Risultato frasi limite di Genesi: ${ok} passati, ${ko} falliti`);
process.exit(ko > 0 ? 1 : 0);

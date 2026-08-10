/* IL RECETTORE ASSENTE NON FA DIRE «SUPERA» — banco con asserzioni.
   node banco.mjs [--porta=8737] [--controprova]
   La controprova rimette i difetti NELLA RISPOSTA HTTP (mai sul file), in due
   famiglie: (A) i tre clamp di `applyDesign` — il difetto del SECONDO clic;
   (B) le guardie a valle — il difetto a ZERO clic, che è quello grosso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find(a => a.startsWith("--porta=")) || "").split("=")[1]) || 8737;
const TIPI = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".glb":"model/gltf-binary",
  ".obj":"text/plain", ".wasm":"application/wasm", ".webmanifest":"application/manifest+json" };

/* [file, prima, dopo] — `dopo` è la forma VECCHIA, quella che mentiva */
const DIFETTI = [
  // A · i tre clamp di applyDesign (secondo clic)
  ["genesi.html", "  if($('dPsCharge')) D2.psCharge = valoreCampo(gvv('dPsCharge'), D2.psCharge, 0.1, 2);",
   "  if($('dPsCharge')) D2.psCharge = Math.max(0.1, Math.min(2, gvv('dPsCharge')||D2.psCharge));"],
  ["genesi.html", "  if($('dRecDist')) D2.recDist = valoreCampo(gvv('dRecDist'), D2.recDist, 20, 3000);",
   "  if($('dRecDist')) D2.recDist = Math.max(20, Math.min(3000, gvv('dRecDist')||D2.recDist));"],
  ["genesi.html", "  if($('dRecFreq')) D2.recFreq = valoreCampo(gvv('dRecFreq'), D2.recFreq, 2, 120);",
   "  if($('dRecFreq')) D2.recFreq = Math.max(2, Math.min(120, +$('dRecFreq').value||D2.recFreq));"],
  // B · le guardie a valle (zero clic)
  ["genesi.html", "    sd:(es.calcolabile && !senzaDist)?D2.recDist/Math.sqrt(Math.max(1,mic)):null,",
   "    sd:es.calcolabile?D2.recDist/Math.sqrt(Math.max(1,mic)):null,"],
  ["genesi.html", "  const _ppv=Number.isFinite(_sd2)?_st.K*Math.pow(Math.max(0.1,_sd2),-_st.beta):null;",
   "  const _ppv=_m2.calcolabile?_st.K*Math.pow(Math.max(0.1,_sd2),-_st.beta):null;"],
  ["genesi-data.js", "  if(ppvSenzaDistanza(dist)) return null;\n  const sd3=Math.max(0.001,+dist)/Math.cbrt(Math.max(0.1,m));",
   "  const sd3=Math.max(0.001,+dist||0)/Math.cbrt(Math.max(0.1,m));"],
  // C · le due righe flyrock e il presplit
  ["genesi.html", "      cls:_flySd?'sv-warn':(D2.recDist>=Dper?'sv-ok':(D2.recDist>=Dmez?'sv-warn':'sv-bad')),",
   "      cls:(D2.recDist>=Dper?'sv-ok':(D2.recDist>=Dmez?'sv-warn':'sv-bad')),"],
  ["genesi.html", "    const _psOkS = _psD>=8 && _psD<=14, _psOkQ = _psQnoto && _psQ>=0.25 && _psQ<=0.9;",
   "    const _psOkS = _psD>=8 && _psD<=14, _psOkQ = D2.psCharge>=0.25 && D2.psCharge<=0.9;"],
  /* ⛔ D · LO STRATO, non una guardia sola. La prima stesura di questa
     controprova rimetteva SOLO i calcoli (`sd`, `_ppv`, `_psOkQ`) e cinque
     asserzioni restavano VERDI: non perché non provassero niente, ma perché
     sotto c'era il secondo strato — il ramo `else if(!_m2.distLeggibile)`, il
     `ppvSenzaDistanza` del flyrock inverso, il `_psQnoto` della frase. È la
     seconda lettura di «non distingue» di CLAUDE.md (il codice è difeso in
     profondità): si toglie TUTTO lo strato, e allora si vede il danno vero. */
  ["genesi.html", "  } else if(!_m2.distLeggibile){", "  } else if(false){"],
  ["genesi.html", "    distLeggibile:!senzaDist, distChe:senzaDist?senzaDist.che:'', distCome:senzaDist?senzaDist.come:'',",
   "    distLeggibile:true, distChe:'', distCome:'',"],
  ["genesi.html", "    const _invSd=ppvSenzaDistanza(D2.recDist);", "    const _invSd=null;"],
  ["genesi.html", "        +' '+(!_psQnoto", "        +' '+(false"],
  /* ⛔ E · le TRE RIGHE ALLA LETTERA, perché tre asserzioni restavano verdi
     anche tolto lo strato: non guardavano nessuna delle guardie iniettate, ma
     il TESTO che quelle righe compongono. È la terza lettura di «non
     distingue» (l'iniezione non ha iniettato niente su quel percorso), e si
     corregge sull'iniezione — non sulla prova, non sul codice. */
  ["genesi.html", "'massima carica entro la finestra di 8 ms (fori sullo stesso ritardo). W max ammissibile alla soglia scelta '+(_wmax===null?'<b>non è calcolabile</b>':'≈ '+gnum(Math.round(_wmax),0)+' kg')+' a '+gnum(D2.recDist,0)+' m: oltre, il PPV supera il limite.'",
   "'massima carica entro la finestra di 8 ms (fori sullo stesso ritardo). W max ammissibile alla soglia scelta ≈ '+Math.round(_wmax)+' kg a '+D2.recDist+' m: oltre, il PPV supera il limite.'"],
  ["genesi.html", "    const Lmax=D2.recDist/4;", "    const Lmax=(D2.recDist||300)/4;"],
  ["genesi.html", "'Carica lineare '+(_psQ<0.25?", "'Carica lineare '+(D2.psCharge<0.25?"],
];
const colpiti = new Set(); let caratteri = 0;
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && /apps\/genesi\/(genesi\.html|genesi-data\.js)$/.test(p)) {
    let t = corpo.toString("utf8"); const prima = t.length;
    for (const [f, a, b] of DIFETTI) { if (!p.endsWith("/" + f)) continue; if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); } }
    caratteri += t.length - prima; corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__genesi-banco-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-banco-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server`); process.exit(2); }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0,240))}` : ""}`); } };

const DESIGN = { B:3, S:3.5, diam:102, prof:10, kg:58, stem:2.2, sub:0.9,
  esplosivo:"anfo-standard", innesco:"nonel", roccia:"calcare", frat:"media",
  bagnato:false, presplit:true, psSpacing:0.9, psCharge:0.4, ucs:100, eMod:55,
  sequenza:"diagonale", ritardo:42, ritardoFila:84, recNorma:"din-res",
  recFreq:25, recDist:300, perRow:12, file:1 };
async function apriSenza(chiave) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const d = { ...DESIGN }; if (chiave) d[chiave] = null;
  await pg.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id:"v1", nome:"Fronte Nord", data:"2026-07-12", sintesi:"12 fori", design: dd }]));
  }, d);
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil:"domcontentloaded" });
  await pg.waitForTimeout(2200);
  await pg.evaluate(() => { const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk"); if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); } });
  await pg.waitForTimeout(500);
  await pg.evaluate(() => { const it = document.querySelector('.hg-item[data-id="v1"]'); const t = it && it.querySelector('button[data-act="apri"]'); if (t) t.click(); });
  await pg.waitForTimeout(1500);
  return pg;
}
const riga = (pg, lab) => pg.evaluate((L) => {
  const r = [...document.querySelectorAll("#d2-scheda .sv-row")].find(x => ((x.querySelector(".sv-lab")||{}).textContent||"").trim() === L);
  return r ? { val:((r.querySelector(".sv-val")||{}).textContent||"").trim(), why:((r.querySelector(".sv-why")||{}).textContent||"").trim(),
    cls:((r.querySelector(".sv-dot")||{}).className||"").replace("sv-dot ","").trim() } : null;
}, lab);
const campo = (pg, id) => pg.evaluate(i => { const e = document.getElementById(i); return e ? e.value : null; }, id);
async function dueTocchi(pg, id) {
  await pg.evaluate(() => { const e = document.getElementById("dRit"); if (e) e.dispatchEvent(new Event("change", { bubbles:true })); });
  await pg.waitForTimeout(300);
  await pg.evaluate(i => { const e = document.getElementById(i); if (e) e.dispatchEvent(new Event("change", { bubbles:true })); }, id);
  await pg.waitForTimeout(400);
}
console.log(`\n════════ il recettore assente non fa dire «SUPERA»${CONTROPROVA ? " · ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""} ════════`);

/* ── 1. la DISTANZA assente, a zero clic ── */
{
  const pg = await apriSenza("recDist");
  const vivo = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
  if (vivo < 20) { nonMisurati.push("recDist (scheda a " + vivo + " righe)"); }
  else {
    const ppv = await riga(pg, "PPV al recettore"), mic = await riga(pg, "MIC (carica/ritardo)"),
      ab = await riga(pg, "Airblast (sovrappr.)"), fly = await riga(pg, "Gittata flyrock (stima)"),
      inv = await riga(pg, "Flyrock inverso");
    dice(/non calcolabile/i.test(ppv.val), "distanza assente · a ZERO clic la PPV NON è un numero (era 67.627,4 mm/s)", ppv.val);
    /* ⚠️ la prima stesura cercava la parola «SUPERA» e cadeva sul TESTO NUOVO,
       che la cita per spiegare («un numero al suo posto direbbe SUPERA»): un
       righello che accusa la frase che dice la verità. Il verdetto vero ha una
       forma sua — «Soglia <norma> N mm/s @ N Hz → …» — ed è quella da cercare. */
    dice(!/Soglia .* mm\/s @ .* Hz →/.test(ppv.why), "distanza assente · nel perché non c'è nessun confronto con la soglia", ppv.why);
    dice(/distanza del recettore/i.test(ppv.why), "distanza assente · il perché nomina il campo GIUSTO (non la MIC, non la norma)", ppv.why);
    dice(!/\bnull\b/.test(mic.why), "⛔ il «null m»: la riga MIC non stampa più la parola null accanto ai metri", mic.why);
    dice(!/≈ 0 kg/.test(mic.why), "e nemmeno «W max ≈ 0 kg», che era l'altra metà della stessa frase", mic.why);
    dice(/non calcolabile/i.test(ab.val), "distanza assente · l'airblast NON è 172 dB(L), il tetto della formula", ab.val);
    dice(fly.cls !== "sv-bad", "distanza assente · il flyrock non accusa con il pallino ROSSO", fly.cls);
    dice(/non calcolabile/i.test(inv.val), "distanza assente · il flyrock inverso non inventa più i 300 m di ripiego", inv.val);
    dice(!/75 m/.test(inv.why), "e non stampa la gittata ammessa ricavata da quei 300 m", inv.why);
    await dueTocchi(pg, "dRecDist");
    dice(String(await campo(pg, "dRecDist")).trim() === "", "distanza assente · dopo i due tocchi il campo è ANCORA vuoto (il clamp ci scriveva 20)", await campo(pg, "dRecDist"));
  }
  await pg.close();
}
/* ── 2. la FREQUENZA assente ── */
{
  const pg = await apriSenza("recFreq");
  const vivo = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
  if (vivo < 20) nonMisurati.push("recFreq (scheda a " + vivo + " righe)");
  else {
    await dueTocchi(pg, "dRecFreq");
    dice(String(await campo(pg, "dRecFreq")).trim() === "", "frequenza assente · dopo i due tocchi il campo è ANCORA vuoto (il clamp ci scriveva 2)", await campo(pg, "dRecFreq"));
    const ppv = await riga(pg, "PPV al recettore");
    dice(/non si può dire se è sotto soglia/i.test(ppv.why), "frequenza assente · resta «non si può dire se è sotto soglia» anche DOPO i due tocchi", ppv.why);
    dice(!/@ 2 Hz/.test(ppv.why), "e non compare la soglia «5 mm/s @ 2 Hz», che il clamp fabbricava", ppv.why);
  }
  await pg.close();
}
/* ── 3. la CARICA LINEARE del presplit assente ── */
{
  const pg = await apriSenza("psCharge");
  const vivo = await pg.evaluate(() => document.querySelectorAll("#d2-scheda .sv-row").length);
  if (vivo < 20) nonMisurati.push("psCharge (scheda a " + vivo + " righe)");
  else {
    const ps = await riga(pg, "Presplit");
    dice(!/troppo bassa/.test(ps.why), "carica lineare assente · a ZERO clic NON si accusa «troppo bassa: taglio incompleto»", ps.why);
    dice(/non si può dire niente/i.test(ps.why), "e al suo posto c'è la non-misurabilità, col nome del campo", ps.why);
    await dueTocchi(pg, "dPsCharge");
    dice(String(await campo(pg, "dPsCharge")).trim() === "", "carica lineare assente · dopo i due tocchi il campo è ANCORA vuoto (il clamp ci scriveva 0,1)", await campo(pg, "dPsCharge"));
  }
  await pg.close();
}
/* ── 4. NESSUNA REGRESSIONE sulla volata completa: gli stessi numeri di prima ── */
{
  const pg = await apriSenza(null);
  const ppv = await riga(pg, "PPV al recettore"), ab = await riga(pg, "Airblast (sovrappr.)"), mic = await riga(pg, "MIC (carica/ritardo)");
  dice(ppv.val === "6,4 mm/s" && ppv.cls === "sv-ok", "volata COMPLETA · la PPV resta 6,4 mm/s, verde", ppv.val + " " + ppv.cls);
  dice(ab.val === "127 dB(L)" && ab.cls === "sv-ok", "volata COMPLETA · l'airblast resta 127 dB(L), verde", ab.val + " " + ab.cls);
  dice(/≈ 174 kg a 300 m/.test(mic.why), "volata COMPLETA · W max resta 174 kg a 300 m", mic.why);
  await pg.close();
}
if (nonMisurati.length) console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")} — un soggetto non misurato non è un soggetto a posto.`);
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo, ${caratteri} caratteri di differenza)`);
console.log(`\nRisultato recettore assente: ${ok} passati, ${ko} falliti  ·  19 asserzioni attese`);
await b.close(); srv.close();
process.exit(ko > 0 || nonMisurati.length ? 1 : 0);

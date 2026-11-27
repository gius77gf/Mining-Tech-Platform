/* LA FINESTRA DEL RELIEF NON RESTA ATTACCATA ALLA VOLATA APERTA DOPO —
   STESSA FAMIGLIA DI errColl/dev (E DI dir/costi, E DI D2.tratti PRIMA)
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-relief-non-persiste-su-apri.mjs [--porta=8616]
     node genesi-relief-non-persiste-su-apri.mjs --controprova  (rimette
                                                     il difetto: DEVE fallire)

   PERCHÉ ESISTE (18/09, dal deep-pass QA su Genesi). `D2.relLo`/`D2.relHi`
   (la finestra del relief, ms/m) sono due input veri del form — stessa
   card di errColl/dev — che decidono la classe sv-bad/sv-warn/sv-ok della
   riga "Relief per foro" nella Scheda Validatori (rischio blocchi, picchi
   di vibrazione, proiezioni). Non erano MAI salvati nell'oggetto `design`
   di `volSnapshot`, rimasti fuori dal censimento "34 campi" delle due
   unità precedenti (dir/costi, errColl/dev), stessa identica famiglia:
   `Object.assign` su "Apri" non li tocca se il design non li porta, quindi
   restano quelli dell'ultima volata toccata in sessione.
   Caso concreto: si alza la finestra del relief guardando la volata A
   (roccia dura, es. 8–25), poi si apre la volata B (senza reload, la forma
   normale perché volSnapshot non li ha mai scritti). Senza il fix, B
   classifica il rischio dei suoi fori con la finestra di A, non con la
   propria (o col default 5–15), senza nessun avviso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8616;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: toglie il fallback esplicito su "Apri", tornando alla
   forma di prima — nessun azzeramento di relLo/relHi. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "    D2.relLo=(_dsg.relLo!=null&&isFinite(_dsg.relLo))?+_dsg.relLo:5;\n    D2.relHi=(_dsg.relHi!=null&&isFinite(_dsg.relHi))?+_dsg.relHi:15;\n    if(D2.holes.length) computeSeq2D();",
   "    if(D2.holes.length) computeSeq2D();"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) {
    const perQui = DIFETTI.filter(([f]) => p.endsWith(f));
    if (perQui.length) {
      let t = corpo.toString("utf8");
      for (const [, a, b] of perQui) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
      corpo = Buffer.from(t, "utf8");
    }
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__genesi-relief-apri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-relief-apri-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0, nonMisurati = [];
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 200))}` : ""}`); }
};

/* v1: la forma di UNA VOLATA SALVATA PRIMA DI QUESTA UNITÀ — nessun campo
   relLo/relHi nel design (è lo stato normale di ogni volata salvata oggi,
   dato che `volSnapshot` non li ha mai scritti). */
const DESIGN_SENZA_RELIEF = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 4,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript((dd) => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord (vecchia, senza relLo/relHi)",
    data: "2026-07-12", sintesi: "4 fori", design: dd }]));
}, DESIGN_SENZA_RELIEF);
await pg.route("https://www.gstatic.com/**", (r) => r.abort());
await pg.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
await pg.waitForTimeout(2200);
await pg.evaluate(() => {
  const l = document.getElementById("loginBtn"); if (l) l.click();
  const c = document.getElementById("consensoOk");
  if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
});
await pg.waitForTimeout(500);

const aggancio = await pg.evaluate(() => !!window.__genesi);
if (!aggancio) {
  nonMisurati.push("l'aggancio di debug window.__genesi non c'è");
} else {
  /* si simula "l'ultima volata toccata in sessione": si scrivono valori
     diversi dai default direttamente nell'oggetto disegnato a schermo —
     equivalente ad alzare la finestra del relief coi campi del form */
  const primaVal = await pg.evaluate(() => {
    window.__genesi.D2.relLo = 8; window.__genesi.D2.relHi = 25;
    return { relLo: window.__genesi.D2.relLo, relHi: window.__genesi.D2.relHi };
  });
  dice(primaVal.relLo === 8 && primaVal.relHi === 25,
    "i valori di prova sono stati scritti nel progetto corrente", primaVal);

  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1200);

  const st = await pg.evaluate(() => ({
    navigato: document.body.className.includes("scr-design"),
    relLo: window.__genesi.D2.relLo, relHi: window.__genesi.D2.relHi,
  }));
  if (!st.navigato) {
    nonMisurati.push("la volata non si è aperta nel 2D");
  } else {
    dice(errori.length === 0, "nessun errore di pagina", errori[0]);
    dice(st.relLo === 5, "⛔ il minimo del relief NON resta quello del progetto precedente (design senza relLo → 5, il default)", st.relLo);
    dice(st.relHi === 15, "⛔ e nemmeno il massimo: torna al default del progetto, non resta 25", st.relHi);
  }
}
await pg.close();

/* e il verso opposto: una volata che HA la sua finestra salvata la porta,
   non la perde — una difesa che azzerasse SEMPRE sarebbe peggio del difetto */
console.log("\n· il verso opposto: una volata con la propria finestra di relief salvata la ritrova aperta");
{
  const DESIGN_CON_RELIEF = { ...DESIGN_SENZA_RELIEF, relLo: 6, relHi: 20 };
  const pg2 = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori2 = []; pg2.on("pageerror", (e) => errori2.push(e.message));
  await pg2.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v2", nome: "Fronte Est (con la sua finestra di relief)",
      data: "2026-07-13", sintesi: "4 fori", design: dd }]));
  }, DESIGN_CON_RELIEF);
  await pg2.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg2.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`, { waitUntil: "domcontentloaded" });
  await pg2.waitForTimeout(2200);
  await pg2.evaluate(() => {
    const l = document.getElementById("loginBtn"); if (l) l.click();
    const c = document.getElementById("consensoOk");
    if (c) { document.getElementById("disclaimerChk").checked = true; c.classList.remove("disabled"); c.click(); }
  });
  await pg2.waitForTimeout(500);
  const aggancio2 = await pg2.evaluate(() => !!window.__genesi);
  if (!aggancio2) {
    nonMisurati.push("il verso opposto: l'aggancio di debug non c'è");
  } else {
    await pg2.evaluate(() => {
      const it = document.querySelector('.hg-item[data-id="v2"]');
      const btn = it && it.querySelector('button[data-act="apri"]');
      if (btn) btn.click();
    });
    await pg2.waitForTimeout(1200);
    const st2 = await pg2.evaluate(() => ({
      navigato: document.body.className.includes("scr-design"),
      relLo: window.__genesi.D2.relLo, relHi: window.__genesi.D2.relHi,
    }));
    if (!st2.navigato) nonMisurati.push("il verso opposto: la volata non si è aperta nel 2D");
    else {
      dice(errori2.length === 0, "il verso opposto: nessun errore di pagina", errori2[0]);
      dice(st2.relLo === 6 && st2.relHi === 20,
        "il verso opposto: relLo e relHi salvati sono arrivati intatti", st2);
    }
  }
  await pg2.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato relief su "Apri" di Genesi: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

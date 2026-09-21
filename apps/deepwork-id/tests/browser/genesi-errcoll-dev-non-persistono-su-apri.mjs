/* L'ERRORE AL COLLETTO E LA DEVIAZIONE NON RESTANO ATTACCATI ALLA VOLATA
   APERTA DOPO — STESSA FAMIGLIA DI dir/costi (E DI D2.tratti PRIMA ANCORA)
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-errcoll-dev-non-persistono-su-apri.mjs [--porta=8615]
     node genesi-errcoll-dev-non-persistono-su-apri.mjs --controprova  (rimette
                                                     il difetto: DEVE fallire)

   PERCHÉ ESISTE (18/09, terzo giro di deep-pass su Genesi, agente
   a9e03772971dd3763). `D2.errColl` (errore al colletto, m) e `D2.dev`
   (deviazione, % della lunghezza) sono due input veri del form, stessa card
   di B/S/diam, che alimentano `simulaPerforazione()` e la riga "Precisione
   di perforazione" della scheda validatori (rischio proiezioni, badge
   colorato). Non erano MAI salvati nell'oggetto `design` di `volSnapshot`
   — gli unici due assenti su 34 campi censiti — e il gestore «Apri» non li
   azzerava: stessa identica famiglia di `D2.tratti`/dir/costi, corretta
   nelle due unità precedenti.
   Caso concreto: si alza l'errore al colletto guardando la volata A, poi si
   apre la volata B (senza reload, la forma normale perché volSnapshot non
   li ha mai scritti). Senza il fix, B mostra ancora il rischio di
   proiezioni calcolato con i valori di A. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8615;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: toglie il fallback esplicito su "Apri", tornando alla
   forma di prima — nessun azzeramento di errColl/dev. */
const DIFETTI = [
  /* ⛔ 18/09, dal deep-pass QA (unità relLo/relHi): RI-ANCORATO. La coda
     dell'ancora era "...D2.dev:2.5;\n    if(D2.holes.length) computeSeq2D();"
     — la stessa forma già rotta due volte oggi dallo stesso motivo (una
     nuova unità inserisce righe fra la fine di un fallback e la riga di
     comodo che segue). Qui è entrato il fallback di relLo/relHi FRA la riga
     di dev e quella di computeSeq2D: l'ancora ora si ferma dove finisce il
     SUO fallback, senza dipendere da quello che viene dopo. */
  ["apps/genesi/genesi.html",
   "    D2.errColl=(_dsg.errColl!=null&&isFinite(_dsg.errColl))?+_dsg.errColl:0.15;\n    D2.dev=(_dsg.dev!=null&&isFinite(_dsg.dev))?+_dsg.dev:2.5;\n",
   ""],
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

const SEGNO = join(R, "__genesi-errcoll-dev-apri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-errcoll-dev-apri-${process.pid}`)).text();
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
   errColl/dev nel design (è lo stato normale di ogni volata salvata oggi,
   dato che `volSnapshot` non li ha mai scritti). */
const DESIGN_SENZA_ERRCOLL_DEV = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 4,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript((dd) => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord (vecchia, senza errColl/dev)",
    data: "2026-07-12", sintesi: "4 fori", design: dd }]));
}, DESIGN_SENZA_ERRCOLL_DEV);
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
     equivalente a cambiare errore al colletto e deviazione coi campi del form */
  const primaVal = await pg.evaluate(() => {
    window.__genesi.D2.errColl = 0.9; window.__genesi.D2.dev = 14;
    return { errColl: window.__genesi.D2.errColl, dev: window.__genesi.D2.dev };
  });
  dice(primaVal.errColl === 0.9 && primaVal.dev === 14,
    "i valori di prova sono stati scritti nel progetto corrente", primaVal);

  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1200);

  const st = await pg.evaluate(() => ({
    navigato: document.body.className.includes("scr-design"),
    errColl: window.__genesi.D2.errColl, dev: window.__genesi.D2.dev,
  }));
  if (!st.navigato) {
    nonMisurati.push("la volata non si è aperta nel 2D");
  } else {
    dice(errori.length === 0, "nessun errore di pagina", errori[0]);
    dice(st.errColl === 0.15, "⛔ l'errore al colletto NON resta quello del progetto precedente (design senza errColl → 0,15, il default)", st.errColl);
    dice(st.dev === 2.5, "⛔ e nemmeno la deviazione: torna al default del progetto, non resta 14", st.dev);
  }
}
await pg.close();

/* e il verso opposto: una volata che HA i suoi errColl/dev salvati li porta,
   non li perde — una difesa che azzerasse SEMPRE sarebbe peggio del difetto */
console.log("\n· il verso opposto: una volata coi propri errColl/dev salvati li ritrova aperti");
{
  const DESIGN_CON_ERRCOLL_DEV = { ...DESIGN_SENZA_ERRCOLL_DEV, errColl: 0.6, dev: 9 };
  const pg2 = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori2 = []; pg2.on("pageerror", (e) => errori2.push(e.message));
  await pg2.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v2", nome: "Fronte Est (coi suoi errColl/dev)",
      data: "2026-07-13", sintesi: "4 fori", design: dd }]));
  }, DESIGN_CON_ERRCOLL_DEV);
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
      errColl: window.__genesi.D2.errColl, dev: window.__genesi.D2.dev,
    }));
    if (!st2.navigato) nonMisurati.push("il verso opposto: la volata non si è aperta nel 2D");
    else {
      dice(errori2.length === 0, "il verso opposto: nessun errore di pagina", errori2[0]);
      dice(st2.errColl === 0.6 && st2.dev === 9,
        "il verso opposto: errColl e dev salvati sono arrivati intatti", st2);
    }
  }
  await pg2.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato errColl/dev su "Apri" di Genesi: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

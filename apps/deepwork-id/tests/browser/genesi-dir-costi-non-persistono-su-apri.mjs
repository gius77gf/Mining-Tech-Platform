/* LA DIREZIONE D'INNESCO E I QUATTRO COSTI NON RESTANO ATTACCATI ALLA
   VOLATA APERTA DOPO — STESSA FAMIGLIA DI D2.tratti
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-dir-costi-non-persistono-su-apri.mjs [--porta=8614]
     node genesi-dir-costi-non-persistono-su-apri.mjs --controprova  (rimette
                                                     il difetto: DEVE fallire)

   PERCHÉ ESISTE (18/09, secondo giro di deep-pass su Genesi, agente
   af3a9e76d85847662). `D2.dir` (direzione d'innesco: decide `cd` in
   `sequenzaSuMaglia`, quindi il `tDet` di OGNI foro con sequenza diagonale,
   e viene copiato in `P.dir` per il 3D) e i quattro costi
   (`cPerf`/`cExpl`/`cInnesco`/`valMat`, input veri del form — stessa card
   di B/S/diam, letti dalla "Stima economica" del 3D) non erano MAI salvati
   nell'oggetto `design` di `volSnapshot`, e il gestore «Apri» non li
   azzerava — stessa identica famiglia di `D2.tratti`, corretta ieri
   (commit 31d5bfa3): `Object.assign(D2, design)` non tocca un campo che
   il design non porta, quindi restava quello dell'ultima volata toccata
   in sessione.
   Caso concreto: si alza «Valore materiale» a 25 €/t guardando la volata
   A, poi si apre la volata B (senza reload). Senza il fix, `D2.valMat`
   resta 25 e la sezione «Margine» di B lo mostra come se qualcuno l'avesse
   impostato per B. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8614;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: toglie il fallback esplicito su "Apri", tornando alla
   forma di prima — nessun azzeramento di dir/cPerf/cExpl/cInnesco/valMat.
   ⏱️ RI-ANCORATO il 18/09 (dal terzo giro di deep-pass): fra `D2.valMat=…`
   e `if(D2.holes.length)…` sono entrate le due righe del fallback di
   errColl/dev (stessa famiglia, unità successiva) — l'ancora a due righe
   adiacenti non combaciava più. Ristretta al solo blocco dir/costi. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "    D2.dir=_dsg.dir||'sx';\n    D2.cPerf=(_dsg.cPerf!=null&&isFinite(_dsg.cPerf))?+_dsg.cPerf:8;\n    D2.cExpl=(_dsg.cExpl!=null&&isFinite(_dsg.cExpl))?+_dsg.cExpl:1.5;\n    D2.cInnesco=(_dsg.cInnesco!=null&&isFinite(_dsg.cInnesco))?+_dsg.cInnesco:12;\n    D2.valMat=(_dsg.valMat!=null&&isFinite(_dsg.valMat))?+_dsg.valMat:0;\n",
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

const SEGNO = join(R, "__genesi-dir-costi-apri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-dir-costi-apri-${process.pid}`)).text();
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
   dir/cPerf/cExpl/cInnesco/valMat nel design. Se "Apri" si limitasse a non
   toccare quei campi quando il design non li porta, i valori dell'ultima
   volata toccata in sessione resterebbero — è esattamente il caso da prendere. */
const DESIGN_SENZA_DIR_COSTI = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 4,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript((dd) => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord (vecchia, senza dir/costi)",
    data: "2026-07-12", sintesi: "4 fori", design: dd }]));
}, DESIGN_SENZA_DIR_COSTI);
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
     equivalente a cambiare direzione e alzare i costi coi campi del form */
  const primaVal = await pg.evaluate(() => {
    window.__genesi.D2.dir = "dx";
    window.__genesi.D2.cPerf = 99; window.__genesi.D2.cExpl = 88;
    window.__genesi.D2.cInnesco = 77; window.__genesi.D2.valMat = 66;
    return { dir: window.__genesi.D2.dir, cPerf: window.__genesi.D2.cPerf, valMat: window.__genesi.D2.valMat };
  });
  dice(primaVal.dir === "dx" && primaVal.cPerf === 99 && primaVal.valMat === 66,
    "i valori di prova sono stati scritti nel progetto corrente", primaVal);

  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1200);

  const st = await pg.evaluate(() => ({
    navigato: document.body.className.includes("scr-design"),
    dir: window.__genesi.D2.dir, cPerf: window.__genesi.D2.cPerf, cExpl: window.__genesi.D2.cExpl,
    cInnesco: window.__genesi.D2.cInnesco, valMat: window.__genesi.D2.valMat,
  }));
  if (!st.navigato) {
    nonMisurati.push("la volata non si è aperta nel 2D");
  } else {
    dice(errori.length === 0, "nessun errore di pagina", errori[0]);
    dice(st.dir === "sx", "⛔ la direzione d'innesco NON resta quella del progetto precedente (design senza dir → 'sx', il default)", st.dir);
    dice(st.cPerf === 8 && st.cExpl === 1.5 && st.cInnesco === 12 && st.valMat === 0,
      "⛔ e nemmeno i quattro costi: tornano ai default del progetto, non restano 99/88/77/66", st);
  }
}
await pg.close();

/* e il verso opposto: una volata che HA i suoi dir/costi salvati li porta,
   non li perde — una difesa che azzerasse SEMPRE sarebbe peggio del difetto */
console.log("\n· il verso opposto: una volata coi propri dir/costi salvati li ritrova aperti");
{
  const DESIGN_CON_DIR_COSTI = { ...DESIGN_SENZA_DIR_COSTI, dir: "dx", cPerf: 15, cExpl: 3, cInnesco: 20, valMat: 5.5 };
  const pg2 = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori2 = []; pg2.on("pageerror", (e) => errori2.push(e.message));
  await pg2.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v2", nome: "Fronte Est (coi suoi dir/costi)",
      data: "2026-07-13", sintesi: "4 fori", design: dd }]));
  }, DESIGN_CON_DIR_COSTI);
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
      dir: window.__genesi.D2.dir, cPerf: window.__genesi.D2.cPerf, cExpl: window.__genesi.D2.cExpl,
      cInnesco: window.__genesi.D2.cInnesco, valMat: window.__genesi.D2.valMat,
    }));
    if (!st2.navigato) nonMisurati.push("il verso opposto: la volata non si è aperta nel 2D");
    else {
      dice(errori2.length === 0, "il verso opposto: nessun errore di pagina", errori2[0]);
      dice(st2.dir === "dx" && st2.cPerf === 15 && st2.cExpl === 3 && st2.cInnesco === 20 && st2.valMat === 5.5,
        "il verso opposto: dir e i quattro costi salvati sono arrivati intatti", st2);
    }
  }
  await pg2.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato dir/costi su "Apri" di Genesi: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

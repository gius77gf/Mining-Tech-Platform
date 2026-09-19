/* UN TRATTO DISEGNATO SU UN PROGETTO NON RESTA ATTACCATO ALLA VOLATA
   APERTA DOPO
   ───────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-tratti-non-persistono-su-apri.mjs [--porta=8613]
     node genesi-tratti-non-persistono-su-apri.mjs --controprova  (rimette il
                                                     difetto: DEVE fallire)

   PERCHÉ ESISTE (18/09, quarto giro di deep-pass, agente a4a466a27e1e80730).
   Il gestore «Apri» (`apps/genesi/genesi.html`, dentro il click su
   `.hg-item button[data-act="apri"]`) azzera esplicitamente `D2.holes`,
   `D2.sel`/`selPt`/`selPrev` e `D2.magliaAssente` — ma non toccava mai
   `D2.tratti`. Un tratto disegnato a mano (o importato da DXF) su un
   progetto sopravviveva ad "Apri" e finiva attaccato alla volata appena
   aperta, senza nessun avviso; se a quel punto si preme «Salva», il tratto
   estraneo diventa permanente nel record della volata (`volSnapshot` scrive
   `tratti:D2.tratti||[]`).
   Stessa famiglia già chiusa per `D2.magliaAssente` (G37, 14/09): uno stato
   che il gestore di apertura non azzera esplicitamente sopravvive
   all'apertura di un'altra volata.

   Il caso si costruisce nella via VERA (localStorage → Home → «Apri»),
   come `genesi-maglia-assente.mjs`: si inietta un tratto direttamente in
   `D2.tratti` (via l'aggancio di debug `window.__genesi.D2`, che è lo
   stesso oggetto disegnato a schermo — equivalente a disegnarlo col mouse,
   più stabile di simulare due clic sulla tela), poi si preme «Apri» su una
   volata il cui `design` NON porta `tratti` (la forma di ogni volata
   salvata prima del 16/09, quando il campo è stato introdotto). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8613;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".glb": "model/gltf-binary", ".obj": "text/plain", ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json" };

/* LA CONTROPROVA: toglie la riga di reset, tornando alla forma di prima
   del 18/09 — nessun azzeramento di D2.tratti su "Apri".
   ⏱️ RI-ANCORATA il 18/09 stesso, secondo giro di deep-pass: fra questa riga
   e `computeSeq2D()` si è inserito il reset di dir/costi (stessa famiglia,
   chiusa nella stessa giornata) — il codice si è mosso perché è migliorato,
   l'ancora punta solo alla riga di `D2.tratti`, non più alla coppia. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "    D2.tratti=((arr[i].design&&arr[i].design.tratti)||[]).map(t=>({ ...t, pts:(t.pts||[]).map(p=>({...p})), aperto:!!t.aperto }));\n",
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

const SEGNO = join(R, "__genesi-tratti-apri-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__genesi-tratti-apri-${process.pid}`)).text();
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

/* v1: la forma di UNA VOLATA SALVATA PRIMA DEL 16/09 — nessun campo
   `tratti` nel design. Se il gestore di apertura si limitasse a NON
   toccare D2.tratti quando il design non ne ha, un tratto disegnato prima
   di "Apri" resterebbe — è esattamente il caso da prendere. */
const DESIGN_SENZA_TRATTI = { B: 3, S: 3.5, diam: 102, prof: 10, kg: 58, stem: 2.2, sub: 0.9, file: 1, perRow: 4,
  esplosivo: "anfo-standard", innesco: "nonel", roccia: "calcare", frat: "media",
  bagnato: false, presplit: false, psSpacing: 0.9, psCharge: 0.4, ucs: 100, eMod: 55,
  sequenza: "diagonale", ritardo: 42, ritardoFila: 84, recNorma: "din-res", recFreq: 25, recDist: 300 };

const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = []; pg.on("pageerror", (e) => errori.push(e.message));
await pg.addInitScript((dd) => {
  localStorage.setItem("genesiDisclaimerV1", "1");
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v1", nome: "Fronte Nord (vecchia, senza tratti)",
    data: "2026-07-12", sintesi: "4 fori", design: dd }]));
}, DESIGN_SENZA_TRATTI);
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
  /* si inietta il tratto direttamente nell'oggetto disegnato a schermo —
     equivalente a disegnarlo col mouse (stesso D2 che drawDesign2D legge),
     ma stabile e senza dipendere dalle coordinate della tela */
  const primaN = await pg.evaluate(() => {
    window.__genesi.D2.tratti.push({ pts: [{ x: 1, y: 1 }, { x: 5, y: 5 }], aperto: false, origine: "manuale" });
    return window.__genesi.D2.tratti.length;
  });
  dice(primaN === 1, "il tratto è stato iniettato nel progetto corrente (1 tratto)", primaN);

  await pg.evaluate(() => {
    const it = document.querySelector('.hg-item[data-id="v1"]');
    const btn = it && it.querySelector('button[data-act="apri"]');
    if (btn) btn.click();
  });
  await pg.waitForTimeout(1200);

  const st = await pg.evaluate(() => ({
    navigato: document.body.className.includes("scr-design"),
    tratti: window.__genesi.D2.tratti.length,
  }));
  if (!st.navigato) {
    nonMisurati.push("la volata non si è aperta nel 2D");
  } else {
    dice(errori.length === 0, "nessun errore di pagina", errori[0]);
    dice(st.tratti === 0, "⛔ il tratto del progetto precedente NON resta attaccato alla volata appena aperta (design senza tratti → 0)", st.tratti);
  }
}
await pg.close();

/* e il verso opposto: una volata che HA i suoi tratti li porta, non li
   perde — una difesa che azzerasse SEMPRE sarebbe peggio del difetto */
console.log("\n· il verso opposto: una volata coi propri tratti salvati li ritrova aperti");
{
  const DESIGN_CON_TRATTI = { ...DESIGN_SENZA_TRATTI,
    tratti: [{ pts: [{ x: 2, y: 2 }, { x: 9, y: 9 }], aperto: false, origine: "manuale" }] };
  const pg2 = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori2 = []; pg2.on("pageerror", (e) => errori2.push(e.message));
  await pg2.addInitScript((dd) => {
    localStorage.setItem("genesiDisclaimerV1", "1");
    localStorage.setItem("genesiVolate", JSON.stringify([{ id: "v2", nome: "Fronte Est (coi suoi tratti)",
      data: "2026-07-13", sintesi: "4 fori", design: dd }]));
  }, DESIGN_CON_TRATTI);
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
      tratti: window.__genesi.D2.tratti.length,
      pts: window.__genesi.D2.tratti[0] ? window.__genesi.D2.tratti[0].pts.length : -1,
    }));
    if (!st2.navigato) nonMisurati.push("il verso opposto: la volata non si è aperta nel 2D");
    else {
      dice(errori2.length === 0, "il verso opposto: nessun errore di pagina", errori2[0]);
      dice(st2.tratti === 1 && st2.pts === 2, "il verso opposto: il tratto salvato è arrivato (1 tratto, 2 punti)", st2);
    }
  }
  await pg2.close();
}

if (nonMisurati.length) {
  console.log(`\n⚠️ NON MISURATI (${nonMisurati.length}): ${nonMisurati.join(", ")}`);
  console.log("   Un soggetto non misurato non è un soggetto a posto: il banco non esce zero.");
}
if (CONTROPROVA) console.log(`\n(iniezioni: ${colpiti.size}/${DIFETTI.length} hanno trovato il loro pezzo)`);
console.log(`\nRisultato tratti su "Apri" di Genesi: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
if (nonMisurati.length || (!CONTROPROVA && ko > 0) || (CONTROPROVA && ko === 0)) process.exit(CONTROPROVA ? (ko === 0 ? 1 : 0) : (nonMisurati.length || ko > 0 ? 1 : 0));

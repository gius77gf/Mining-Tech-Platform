/* IL CUMULO E IL DECKING FABBRICAVANO UN NUMERO SU UNA GEOMETRIA O UNA
   CARICA ILLEGGIBILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-muckshape-decking-null.mjs [--porta=8962]
     node genesi-muckshape-decking-null.mjs --controprova   (rimette i due difetti: DEVE fallire)

   PERCHÉ ESISTE. Dal quarto giro di deep-pass QA su Genesi (18/09), stessa
   famiglia già chiusa lo stesso giorno su Rapporto S/B, Rigidità H/B,
   Timing e Spalla/Ø, in due punti nuovi:
   1. `muckShape()` rileggeva `D2.B`/`D2.S` grezzi invece dei valori misurati
      (`g.B`/`g.S`) che il resto della scheda usa già: con la spalla o
      l'interasse illeggibili, l'angolo isocrono andava a `NaN` o a un
      numero enorme (1e17-1e30) invece di "non calcolabile" — un
      baricentro del cumulo stimato in miliardi di metri, scritto come una
      stima vera.
   2. Il pannello Decking calcolava `_kgDeck = Q/_N` (Q = carica per foro)
      senza guardia: con la carica illeggibile, `null/_N` fa `0` — "Ogni
      deck ≈ 0 kg" scritto accanto a "Totale carica — kg (invariato)"
      nella stessa frase, la stessa contraddizione zero-fabbricato/non-
      calcolabile già vista altrove nel file. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8962;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DUE DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   `  const _gm=measureGeom2D(D2), _geoOk=(x)=>Number.isFinite(x)&&x>0;
  if(!(_geoOk(_gm.B)&&_geoOk(_gm.S))){
    const _senza=volataSenzaValori({B:D2.B,S:D2.S});
    return { calcolabile:false,
      perche:_senza ? (_senza.che+'. '+_senza.come) : 'la spalla o l\\'interasse non danno una geometria leggibile.' };
  }
  const B=_gm.B, S=_gm.S, tHole=D2.ritardo,`,
   `  const B=D2.B, S=D2.S, tHole=D2.ritardo,`],
  ["apps/genesi/genesi.html",
   `  return { calcolabile:true, theta:Math.round(thetaDeg),`,
   `  return { theta:Math.round(thetaDeg),`],
  ["apps/genesi/genesi.html",
   `  const _mk=muckShape();
  if(!_mk.calcolabile){
    rows.push(nonCalcolabile('Forma cumulo',_mk.perche));
    rows.push(nonCalcolabile('Direzione cumulo',_mk.perche));
  } else {
  rows.push({lab:'Forma cumulo',`,
   `  const _mk=muckShape();
  rows.push({lab:'Forma cumulo',`],
  ["apps/genesi/genesi.html",
   `    why:_mk.dirTxt+'. Burden effettivo Be '+gfix(_mk.Be,1)+' m (angolo isocrono '+gnum(_mk.theta,0)+'°); spread laterale '+_mk.spreadLat+'.'});
  }`,
   `    why:_mk.dirTxt+'. Burden effettivo Be '+gfix(_mk.Be,1)+' m (angolo isocrono '+gnum(_mk.theta,0)+'°); spread laterale '+_mk.spreadLat+'.'});`],
  ["apps/genesi/genesi.html",
   `const _deckLen=Math.max(0.4,(_Lc-(_N-1)*_gap)/_N), _kgDeck=(Q==null)?null:Q/_N;`,
   `const _deckLen=Math.max(0.4,(_Lc-(_N-1)*_gap)/_N), _kgDeck=Q/_N;`],
];
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
      if (!p.endsWith(file)) continue;
      const n = t.split(cerca).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
      t = t.replace(cerca, sost); difettiRimessi.add(cerca);
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const tentativo = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(tentativo, "127.0.0.1", () => r(true)); });
  if (preso) porta = tentativo; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage();
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html?go=lab&demo=1`);
await pg.waitForTimeout(2000);
if (CONTROPROVA) console.log(`${difettiRimessi.size}/${DIFETTI.length} difetti rimessi nella pagina servita`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice((await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "function", "il gancio di debug espone renderScheda2D");

const leggiRiga = async (lab) => pg.evaluate((lab) => {
  const el = document.querySelector(`#d2-scheda .sv-row[data-lab="${lab}"]`);
  if (!el) return null;
  return { cls: el.querySelector(".sv-dot")?.className || "", val: el.querySelector(".sv-val")?.textContent || "",
    why: el.querySelector(".sv-why")?.textContent || "" };
}, lab);
const testoScheda = async () => pg.evaluate(() => document.getElementById("d2-scheda")?.innerText || "");

/* ── 1. muckShape: Forma cumulo / Direzione cumulo con B/S validi ── */
await pg.evaluate(() => { window.__genesi.D2.B = 3.5; window.__genesi.D2.S = 4.1; window.__genesi.renderScheda2D(); });
const formaOk = await leggiRiga("Forma cumulo");
dice(!!formaOk && !/non calcolabile/.test(formaOk.val), "con B/S validi: «Forma cumulo» dà un badge normale", formaOk);

/* ── 2. spalla illeggibile: niente più baricentro da miliardi di metri ── */
await pg.evaluate(() => { window.__genesi.D2.B = null; window.__genesi.renderScheda2D(); });
const formaKO = await leggiRiga("Forma cumulo");
const direzioneKO = await leggiRiga("Direzione cumulo");
dice(!!formaKO && /non calcolabile/.test(formaKO.val), "⛔ con la spalla illeggibile: «Forma cumulo» dice «non calcolabile»", formaKO);
dice(!!direzioneKO && /non calcolabile/.test(direzioneKO.val), "⛔ e anche «Direzione cumulo», stessa causa", direzioneKO);
const scheda1 = await testoScheda();
dice(!/e\+1[0-9]/i.test(scheda1) && !/\d{9,}/.test(scheda1), "⛔ nessun numero enorme (1e17+/9+ cifre) in nessuna cella della scheda", scheda1.length);

/* ── 3. interasse illeggibile: stessa famiglia (cos(90°)≈0, non NaN) ── */
await pg.evaluate(() => { window.__genesi.D2.B = 3.5; window.__genesi.D2.S = null; window.__genesi.renderScheda2D(); });
const formaS = await leggiRiga("Forma cumulo");
dice(!!formaS && /non calcolabile/.test(formaS.val), "⛔ con l'interasse illeggibile: «Forma cumulo» dice «non calcolabile» (non un v0 quasi-infinito)", formaS);

/* ── 4. ripristino: tornano leggibili, il badge torna normale ── */
await pg.evaluate(() => { window.__genesi.D2.B = 3.5; window.__genesi.D2.S = 4.1; window.__genesi.renderScheda2D(); });
const formaRipristino = await leggiRiga("Forma cumulo");
dice(!!formaRipristino && !/non calcolabile/.test(formaRipristino.val), "e rimettendo B/S leggibili il badge torna normale", formaRipristino);

/* ── 5. Decking: carica illeggibile non deve dare «0 kg» accanto a «— kg» ── */
await pg.evaluate(() => { window.__genesi.D2.decks = 2; window.__genesi.D2.kg = null; window.__genesi.renderScheda2D(); });
const schedaDeck = await testoScheda();
const haDecking = /Decking/.test(schedaDeck);
dice(haDecking, "il pannello Decking compare (foro abbastanza lungo per 2 deck)", schedaDeck.length);
if (haDecking) {
  dice(/Totale carica —/.test(schedaDeck) || /Totale carica\s*—/.test(schedaDeck), "il totale carica dice «—», come sempre per un dato illeggibile", schedaDeck);
  dice(!/0 kg/.test(schedaDeck), "⛔ e non c'è più nessun «0 kg» fabbricato accanto al «—»: la cifra per deck è coerente", schedaDeck);
}
// caso di controllo: con la carica leggibile, il numero per deck torna a comparire
await pg.evaluate(() => { window.__genesi.D2.kg = 24; window.__genesi.renderScheda2D(); });
const schedaDeckOk = await testoScheda();
dice(/kg/.test(schedaDeckOk) && !/— kg/.test(schedaDeckOk), "e con la carica leggibile (24 kg/foro) il pannello Decking torna a mostrare i kg per deck", schedaDeckOk.length);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

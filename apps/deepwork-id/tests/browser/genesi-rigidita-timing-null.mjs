/* IL VALIDATORE ACCUSA «BANCO RIGIDO / RISCHIO CRATERE» O «RITARDO BASSO,
   RISCHIO PPV» QUANDO IL DATO VERO È «NON LEGGIBILE», NON ZERO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-rigidita-timing-null.mjs [--porta=8958]
     node genesi-rigidita-timing-null.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Genesi (18/09), stessa
   famiglia già chiusa lo stesso giorno su «Borraggio / B»/«Sottoperf.»
   (genesi-validatore-stem-sub-null.mjs). In `renderScheda2D`:
   · `hb=H/B` (H=D2.prof) andava dritto nel badge «Rigidità H/B» senza la
     guardia già scritta due righe sopra per «Rapporto S/B»: con l'altezza
     del banco illeggibile `null/B` fa 0, e il badge passava a rosso
     accusando «banco rigido: rischio cratere/blocchi al piede» — un
     giudizio di sicurezza sul piede del foro basato su un dato che
     nessuno ha scritto. La lancetta sulla scala Kuz-Ram sotto il badge
     riusava lo stesso `hb` e cadeva all'estremo sinistro (zona rossa),
     raddoppiando l'allarme falso;
   · `msmHole=rit/S` (rit=D2.ritardo) e `msmRow=(D2.ritardoFila||rit)/B`
     avevano lo stesso buco: con il ritardo illeggibile l'accusa passava da
     «ritardo alto» (coi valori veri della demo) a «ritardo basso: rischio
     sovrapposizione cariche (regola 8 ms) e PPV elevata» — un'accusa di
     sicurezza opposta e specifica, fabbricata da uno zero mai scritto. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8958;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTO_HB = [
  `  if(!(_geoOk(H)&&_geoOk(B))){
    const _senzaHB=volataSenzaValori({B:D2.B, prof:D2.prof});
    rows.push(nonCalcolabile('Rigidità H/B', _senzaHB ? (_senzaHB.che+'. '+_senzaHB.come)
      : ('la spalla o l\\'altezza del banco non danno due misure confrontabili (spalla '+gfix(B,2)+' m, altezza '+gfix(H,2)+' m).')));
  } else rows.push(badge(hb,'Rigidità H/B',`,
  `  rows.push(badge(hb,'Rigidità H/B',`,
];
const DIFETTO_TF = [
  `  if(!(_geoOk(rit)&&_geoOk(S))){
    const _senzaTF=volataSenzaValori({S:D2.S, ritardo:D2.ritardo});
    rows.push(nonCalcolabile('Timing inter-foro', _senzaTF ? (_senzaTF.che+'. '+_senzaTF.come)
      : ('l\\'interasse o il ritardo tra fori non danno un rapporto leggibile.')));
  } else rows.push(badge(msmHole,'Timing inter-foro',`,
  `  rows.push(badge(msmHole,'Timing inter-foro',`,
];
const DIFETTO_TR = [
  `  if(!(_geoOk(D2.ritardoFila||rit)&&_geoOk(B))){
    rows.push(nonCalcolabile('Timing inter-fila',
      'la spalla, o sia il ritardo tra file sia quello tra fori, non danno un rapporto leggibile: senza almeno uno dei due ritardi il timing fra le file non si calcola.'));
  } else rows.push(badge(msmRow,'Timing inter-fila',`,
  `  rows.push(badge(msmRow,'Timing inter-fila',`,
];
const DIFETTO_MARK = [
  `  const _hbCalcolabile=_geoOk(H)&&_geoOk(B);
  const markPct=_hbCalcolabile?Math.min(100,Math.max(0,hb/sMax*100)):null;`,
  `  const markPct=Math.min(100,Math.max(0,hb/sMax*100));`,
];
const DIFETTO_MARK_HTML = [
  `+'<div class="sv-bar">'+barHtml+(markPct==null?'':'<span class="sv-mark" style="left:'+markPct.toFixed(1)+'%"></span>')+'</div>'`,
  `+'<div class="sv-bar">'+barHtml+'<span class="sv-mark" style="left:'+markPct.toFixed(1)+'%"></span></div>'`,
];
let iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/genesi/genesi.html")) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) {
      for (const [cerca, sost] of [DIFETTO_HB, DIFETTO_TF, DIFETTO_TR, DIFETTO_MARK, DIFETTO_MARK_HTML]) {
        if (t.includes(cerca)) { t = t.replace(cerca, sost); iniezioniDifetto++; }
      }
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
if (CONTROPROVA) console.log(iniezioniDifetto === 5 ? "il difetto è stato rimesso nella pagina servita (5 punti)" : `⛔ iniezioni riuscite: ${iniezioniDifetto}/5 — un'ancora non ha combaciato del tutto`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice((await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "function", "il gancio di debug espone renderScheda2D");

const leggiRiga = async (lab) => pg.evaluate((lab) => {
  const el = document.querySelector(`#d2-scheda .sv-row[data-lab="${lab}"]`);
  if (!el) return null;
  return { cls: el.querySelector(".sv-dot")?.className || "", val: el.querySelector(".sv-val")?.textContent || "" };
}, lab);
const leggiLancetta = () => pg.evaluate(() => !!document.querySelector("#d2-scheda .sv-mark"));

// caso di controllo: prof/ritardo/ritardoFila validi — badge normali, lancetta presente
const conValori = await pg.evaluate(() => { window.__genesi.D2.prof = 10; window.__genesi.D2.ritardo = 42; window.__genesi.D2.ritardoFila = 84; window.__genesi.renderScheda2D(); });
const rHbOk = await leggiRiga("Rigidità H/B");
const rTfOk = await leggiRiga("Timing inter-foro");
const rTrOk = await leggiRiga("Timing inter-fila");
dice(!!rHbOk && !/non calcolabile/.test(rHbOk.val), "con l'altezza del banco valida (10 m): badge normale, non «non calcolabile»", rHbOk);
dice(!!rTfOk && !/non calcolabile/.test(rTfOk.val), "con il ritardo valido: «Timing inter-foro» badge normale", rTfOk);
dice(!!rTrOk && !/non calcolabile/.test(rTrOk.val), "con il ritardo tra file valido: «Timing inter-fila» badge normale", rTrOk);
dice(await leggiLancetta(), "e la lancetta sulla scala Kuz-Ram è presente", null);

// il caso sospetto: altezza del banco illeggibile
const senzaProf = await pg.evaluate(() => { window.__genesi.D2.prof = null; window.__genesi.renderScheda2D(); });
const rHbKO = await leggiRiga("Rigidità H/B");
dice(!!rHbKO && /non calcolabile/.test(rHbKO.val), "⛔ con l'altezza del banco illeggibile: «Rigidità H/B» dice «non calcolabile»", rHbKO);
dice(!!rHbKO && rHbKO.cls.includes("sv-warn") && !rHbKO.cls.includes("sv-bad"), "e il pallino è sv-warn (non sappiamo), non un rosso di accusa", rHbKO);
dice(!!rHbKO && !/rischio cratere/.test(rHbKO.val + " " + (await pg.evaluate((lab) => document.querySelector(`#d2-scheda .sv-row[data-lab="${lab}"] .sv-why`)?.textContent || "", "Rigidità H/B"))), "e non accusa più «rischio cratere/blocchi al piede» su un dato mai scritto", rHbKO);
dice(!(await leggiLancetta()), "⛔ e la lancetta sulla scala Kuz-Ram sparisce (non mente più a zona rossa)", await leggiLancetta());

// ripristino prof, il caso sospetto: ritardo tra fori illeggibile
await pg.evaluate(() => { window.__genesi.D2.prof = 10; window.__genesi.D2.ritardo = null; window.__genesi.renderScheda2D(); });
const rTfKO = await leggiRiga("Timing inter-foro");
dice(!!rTfKO && /non calcolabile/.test(rTfKO.val), "⛔ con il ritardo tra fori illeggibile: «Timing inter-foro» dice «non calcolabile»", rTfKO);
dice(!!rTfKO && rTfKO.cls.includes("sv-warn") && !rTfKO.cls.includes("sv-bad"), "e il pallino è sv-warn, non un rosso di accusa", rTfKO);

// il caso sospetto: ritardo tra fori E tra file entrambi illeggibili
await pg.evaluate(() => { window.__genesi.D2.ritardoFila = null; window.__genesi.renderScheda2D(); });
const rTrKO = await leggiRiga("Timing inter-fila");
dice(!!rTrKO && /non calcolabile/.test(rTrKO.val), "⛔ con ritardo tra fori E tra file entrambi illeggibili: «Timing inter-fila» dice «non calcolabile»", rTrKO);
dice(!!rTrKO && rTrKO.cls.includes("sv-warn") && !rTrKO.cls.includes("sv-bad"), "e il pallino è sv-warn, non un rosso di accusa", rTrKO);

// il ripiego funziona ancora: ritardoFila assente ma ritardo presente → calcolabile
await pg.evaluate(() => { window.__genesi.D2.ritardo = 42; window.__genesi.D2.ritardoFila = null; window.__genesi.renderScheda2D(); });
const rTrRipiego = await leggiRiga("Timing inter-fila");
dice(!!rTrRipiego && !/non calcolabile/.test(rTrRipiego.val), "e col ripiego (ritardoFila assente ma ritardo presente) «Timing inter-fila» torna calcolabile", rTrRipiego);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

/* LA DENUNCIA INAIL SCADUTA, NEL QUADRO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-inail-quadro.mjs [--porta=8938]
     node scudo-inail-quadro.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Scudo (19/09, terzo giro). `scadenzaDenunciaInail`
   (16/09) calcola già lo stato dell'obbligo di denuncia INAIL (D.P.R. 1124/1965,
   art. 53) ed è letto in due punti PER-EVENTO (la riga del registro, il
   dettaglio) — ma nessuna lista di urgenza del Quadro la consultava: un
   infortunio mortale con la denuncia (termine 24 ore) scaduta, con tutti gli
   altri registri a posto, faceva mostrare il pannello VERDE "Nessuna urgenza".
   Il caso non è nella dimostrazione reale (nessun infortunio mortale in DEMO):
   si costruisce iniettando nella risposta HTTP di `scudo-data.js` una gravità
   "mortale" sull'infortunio demo i2 (2026-02-03, ben oltre il termine di 24
   ore da qualunque data odierna). */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8938;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL CASO: i2 (Taglio alla mano, 2026-02-03, già oltre i tre giorni di
   assenza) portato a gravità "mortale" — nessuna `denunciaData`, quindi la
   denuncia (termine 24 ore dall'evento) è scaduta da mesi. */
const CASO = [
  `{ id: "i2", data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, luogo: "officina", luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },`,
  `{ id: "i2", data: "2026-02-03", tipo: "infortunio", gravita: "mortale", giorniAssenza: 4, luogo: "officina", luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },`,
];

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 19/09:
   nessun `inailUrg`, e il join di #urg-list senza di lui. */
const DIFETTO = [
  `    /* ⛔ 19/09, dal deep-pass QA: LA DENUNCIA INAIL SCADUTA, NEL QUADRO — era
       l'unico obbligo di legge di questa app che nessuna lista di urgenza
       consultava. \`scadenzaDenunciaInail\` esisteva già dal 16/09 e viene
       letta in due punti per-evento (la riga del registro, il dettaglio), ma
       né \`#urg-list\` né \`riepilogoInfortuni\` la contano: un mortale con la
       denuncia (termine 24 ore) scaduta da giorni, con tutti gli altri
       registri a posto, faceva mostrare al Quadro il pannello VERDE
       "Nessuna urgenza" — proprio sull'obbligo più grave e più urgente
       dell'intera app, visibile solo aprendo il registro eventi e leggendo
       una riga tagliata a due righe (\`-webkit-line-clamp:2\`). */
    const inailUrg = INF.filter(x => x.tipo === "infortunio").map(x => ({ x, sd: scadenzaDenunciaInail(x, new Date()) }))
      .filter(({ sd }) => sd.pertinente && sd.calcolabile && !sd.presentata && (sd.stato === "scaduta" || sd.stato === "in-scadenza"))
      .sort((a, b) => (a.sd.stato === b.sd.stato ? 0 : a.sd.stato === "scaduta" ? -1 : 1))
      .slice(0, 3).map(({ x, sd }) => {
        const cls = sd.stato === "scaduta" ? "danger" : "warn";
        return \`<div class="item tocca \${striscia[cls]}" onclick="go('doc')" title="Vai al registro infortuni">
        <div class="avatar sup">\${I.allerta}</div>
        <div class="info"><div class="name">Denuncia INAIL \${sd.stato === "scaduta" ? "SCADUTA" : "in scadenza"}</div>
        <div class="meta">\${esc(x.descrizione || "Infortunio del " + fmtData(x.data))} · termine \${fmtData(sd.scadenza)}</div></div>
        <span class="acts"><span class="badge \${cls}">\${sd.stato === "scaduta" ? "Scaduta" : "In scadenza"}</span><span class="arr">›</span></span></div>\`;
      });`,
  ``,
];
const DIFETTO2 = [
  `nomUrg.join("") + inailUrg.join("") + aziUrg.join("")`,
  `nomUrg.join("") + aziUrg.join("")`,
];
let caseInjected = 0, diffInjected = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/scudo/scudo-data.js")) {
    let t = corpo.toString("utf8");
    if (t.includes(CASO[0])) { t = t.replace(CASO[0], CASO[1]); caseInjected++; }
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/scudo/index.html")) {
    let t = corpo.toString("utf8");
    if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); diffInjected++; }
    if (t.includes(DIFETTO2[0])) { t = t.replace(DIFETTO2[0], DIFETTO2[1]); diffInjected++; }
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
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(caseInjected === 1, "il caso (infortunio i2 portato a gravità mortale) è stato iniettato nella risposta HTTP", caseInjected);
if (CONTROPROVA) dice(diffInjected === 2, "il difetto è stato rimesso nella pagina servita", diffInjected);

const testoQuadro = await pg.evaluate(() => document.getElementById("urg-list")?.innerText ?? "");
dice(/INAIL/.test(testoQuadro) && /SCADUTA|Scaduta/.test(testoQuadro),
  "⛔ il Quadro mostra la denuncia INAIL scaduta come urgenza (non il pannello verde)", testoQuadro.slice(0, 500));
const pannelloVerde = await pg.evaluate(() => (document.getElementById("urg-list")?.innerText ?? "").includes("Nessuna urgenza"));
dice(!pannelloVerde, "⛔ e NON mostra «Nessuna urgenza» mentre l'obbligo più grave dell'app è scaduto", pannelloVerde);

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (diffInjected < 2) { console.log(`✗ CONTROPROVA NON VALIDA: ${diffInjected}/2 difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

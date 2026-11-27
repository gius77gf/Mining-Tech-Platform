/* IL DECKING NON DISEGNA UN PIANO SENZA BORRAGGIO PER UN VALORE ILLEGGIBILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-decking-stem-null.mjs [--porta=8956]
     node genesi-decking-stem-null.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Genesi (18/09). La sezione "Decking"
   della Scheda Volata (renderScheda2D) usava `D2.stem` grezzo, senza la
   guardia che `computeKPI()` già applica allo stesso identico campo
   (`_stemKpi=(+D2.stem>0)?+D2.stem:null`, riga ~3386, introdotta apposta
   perché il borraggio può arrivare `null` da un progetto salvato/importato
   con quel valore illeggibile). Con `D2.stem=null`, `_Ltot-D2.stem` in
   JavaScript non dà NaN: dà `_Ltot-0`, cioè borraggio ZERO — il diagramma
   disegnava un piano di carica fisicamente diverso (deck più lunghi,
   niente borraggio di testa alla bocca del foro) senza dire "non
   calcolabile" come fa il resto della scheda sullo stesso campo.
   Verificato dal vivo: con stem=2.2 (valido) "Ogni deck ≈ 3,8 m"; con
   stem=null (illeggibile) usciva "Ogni deck ≈ 5,0 m" e un rettangolo del
   borraggio con height="0.0". */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8956;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO = [
  `    const _stemDeck=(+D2.stem>0)?+D2.stem:null;
    const _Ltot=H+(D2.sub||0), _minNeed=_N*0.4+(_N-1)*0.3;
    const _Lc=(_stemDeck===null)?null:Math.max(0.4, _Ltot-_stemDeck);
    if(_Lc===null){   // borraggio di testa non leggibile: non si inventa uno zero
      _deckHtml='<div style="margin-top:8px;padding:8px 10px;border:1px solid rgba(255,167,38,.3);border-radius:8px;background:rgba(255,167,38,.06);font-size:11px;color:#ffa726">🧨 <b>Decking '+_N+' deck</b>: il borraggio di testa non è leggibile, il piano di carica dei deck non si può disegnare.</div>';
    } else if(_Lc < _minNeed){`,
  `    const _Ltot=H+(D2.sub||0), _Lc=Math.max(0.4, _Ltot-D2.stem), _minNeed=_N*0.4+(_N-1)*0.3;
    if(_Lc < _minNeed){`,
];
const DIFETTO2 = [`_yy(_stemDeck).toFixed(1)+'" fill="#8a8a8a"/>', _cur=_stemDeck;`, `_yy(D2.stem).toFixed(1)+'" fill="#8a8a8a"/>', _cur=D2.stem;`];
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
    /* il debug hook renderScheda2D:renderScheda2D già esiste in produzione
       (aggiunto il 18/09 insieme a questo fix, inerte fuori da localhost):
       qui non si inietta niente, si legge solo lo stato per iniettare il
       difetto quando serve */
    if (CONTROPROVA) {
      if (t.includes(DIFETTO[0])) { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
      if (t.includes(DIFETTO2[0])) { t = t.replace(DIFETTO2[0], DIFETTO2[1]); iniezioniDifetto++; }
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
if (CONTROPROVA) console.log(iniezioniDifetto === 2 ? "il difetto è stato rimesso nella pagina servita (2 punti)" : `⛔ iniezioni riuscite: ${iniezioniDifetto}/2 — l'ancora non ha combaciato del tutto`);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(typeof (await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "string" &&
  (await pg.evaluate(() => typeof window.__genesi?.renderScheda2D)) === "function", "il gancio di debug espone renderScheda2D");

// caso di controllo: borraggio valido, decks=2 — il diagramma disegna il borraggio
const conStem = await pg.evaluate(() => {
  window.__genesi.D2.decks = 2; window.__genesi.D2.stem = 2.2;
  window.__genesi.renderScheda2D();
  return document.getElementById("d2-scheda")?.innerHTML || "";
});
dice(/Ogni deck ≈ 3,8 m/.test(conStem), "con borraggio valido (2,2 m): ogni deck ≈ 3,8 m", conStem.slice(conStem.indexOf("Decking"), conStem.indexOf("Decking") + 120));

// il caso sospetto: borraggio illeggibile
const senzaStem = await pg.evaluate(() => {
  window.__genesi.D2.stem = null;
  window.__genesi.renderScheda2D();
  return document.getElementById("d2-scheda")?.innerHTML || "";
});
const iD = senzaStem.indexOf("Decking");
dice(/non è leggibile/.test(senzaStem), "con borraggio illeggibile: dice «non è leggibile», non disegna un piano senza borraggio", senzaStem.slice(iD, iD + 200));
dice(!/Ogni deck ≈ 5,0 m/.test(senzaStem), "e non compare più il piano gonfiato (5,0 m di deck, il difetto misurato dal vivo)", senzaStem.slice(iD, iD + 200));

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

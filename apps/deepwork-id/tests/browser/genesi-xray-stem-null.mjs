/* LA VISTA 3D RAGGI-X NON DISEGNA LA CARICA FINO AL COLLETTO QUANDO IL
   BORRAGGIO NON È LEGGIBILE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-xray-stem-null.mjs [--porta=8958]
     node genesi-xray-stem-null.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal backlog QA su Genesi (18/09), task #10. In `buildScene`
   la vista 3D raggi-X calcolava `stemL=Math.min(D2.stem, P.prof)`: con
   `D2.stem` illeggibile (`null`, da un progetto importato/salvato con quel
   campo vuoto) l'aritmetica di `null` fa **0** — la stessa famiglia già
   presa nel decking 2D e nella scheda validatori (§ vedi
   `genesi-decking-stem-null.mjs` e `genesi-validatore-stem-sub-null.mjs`).
   Con `stemL=0` la colonna carica (ambra, emissiva) si disegnava lunga
   `f.h+sub`, cioè fino al colletto: un foro che sembra caricato alla bocca,
   una configurazione che non esiste in cava (il borraggio non è mai zero).
   Corretto sostituendo, quando `stem` è illeggibile, `f.h` (la profondità
   VERA del foro) al posto di 0: il foro si disegna come tutto borraggio
   (l'ipotesi prudente) e la carica scende al minimo, sepolta in fondo.
   Verificato dal vivo: con stem=2,2 m (valido, demo) il cilindro di
   borraggio del primo foro è alto 2,2 m; con stem=null sale alla profondità
   intera del foro (~10 m) e la carica scende al minimo (~0,9 m, la
   sottoperforazione della demo) invece di restare a 0 m di borraggio. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8958;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09. */
const DIFETTO = [
  `    const rCyl=0.18, _stemOk=(+D2.stem>0), _stemVal=_stemOk?Math.min(+D2.stem,P.prof):null, filaCols=[0x42a5f5,0xab47bc,0xff7043,0x26c6da,0xe0b34c,0x8d6e63];`,
  `    const rCyl=0.18, stemL=Math.min(D2.stem, P.prof), filaCols=[0x42a5f5,0xab47bc,0xff7043,0x26c6da,0xe0b34c,0x8d6e63];`,
];
const DIFETTO2 = [
  `      const stemL=(_stemVal!==null)?_stemVal:f.h;                // borraggio illeggibile: si mostra il foro come tutto stemmato (vedi commento sopra), non 0
      const Lchg=Math.max(0.4, f.h+(D2.sub||0)-stemL);`,
  `      const Lchg=Math.max(0.4, f.h+(D2.sub||0)-stemL);`,
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
dice(typeof (await pg.evaluate(() => typeof window.__genesi?.xrayCyls)) === "string" ||
  (await pg.evaluate(() => Array.isArray(window.__genesi?.xrayCyls))), "il gancio di debug espone xrayCyls");

const leggiPrimoForo = () => pg.evaluate(() => {
  const g = window.__genesi.xrayCyls?.[0];
  if (!g) return null;
  const cStem = g.children[0], cChg = g.children[1];
  return { stemH: cStem?.geometry?.parameters?.height ?? null, chgH: cChg?.geometry?.parameters?.height ?? null, forH: g.userData?.f?.h ?? null };
});

// caso di controllo: borraggio valido (2,2 m, il valore della demo)
await pg.evaluate(() => { window.__genesi.D2.stem = 2.2; window.__genesi.rebuild(); });
const conStem = await leggiPrimoForo();
dice(!!conStem && Math.abs(conStem.stemH - 2.2) < 0.01, "con borraggio valido (2,2 m): il cilindro di borraggio è alto 2,2 m", conStem);

// il caso sospetto: borraggio illeggibile
await pg.evaluate(() => { window.__genesi.D2.stem = null; window.__genesi.rebuild(); });
const senzaStem = await leggiPrimoForo();
dice(!!senzaStem && senzaStem.stemH !== 0, "con borraggio illeggibile: il cilindro di borraggio NON è più alto 0 m (il difetto misurato dal vivo)", senzaStem);
dice(!!senzaStem && Math.abs(senzaStem.stemH - senzaStem.forH) < 0.01, "e invece è alto quanto l'intero foro (l'ipotesi prudente: tutto stemmato)", senzaStem);
dice(!!senzaStem && senzaStem.chgH < 1.5, "e la colonna carica scende al minimo, sepolta in fondo, non fino al colletto", senzaStem);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

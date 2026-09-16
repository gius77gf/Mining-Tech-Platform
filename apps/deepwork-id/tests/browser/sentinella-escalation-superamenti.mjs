/* L'ESCALATION SUI SUPERAMENTI RIPETUTI — provata aprendo il Quadro e
   leggendo la riga del ponte, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-escalation-superamenti.mjs [--porta=8799]
     node sentinella-escalation-superamenti.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `superamentiUltimiGiorni` (16/09, dal delta della
   ricerca continua, nono giro — verificato riga per riga sul codice vero
   prima di scrivere: `statPeriodo`/`confrontoMesi`/`andamentoRicettore` non
   sommano mai i superamenti di TUTTI i punti di un ricettore su una finestra
   mobile) dice se un ricettore ha un PATTERN di superamenti ripetuti — e
   `vociPonte()` lo mostra come badge accanto alla riga del ponte.

   ⛔ IL CASO NON È NELLA DIMOSTRAZIONE VERA, e non è un difetto da colmare
   qui: oggi in tutta la demo non c'è nessun superamento APERTO
   (`superamentiAperti` risponde vuoto — misurato, non presunto), e l'unico
   punto che sembra un superamento (`v2`, 5,6 mm/s) è collegato a un
   ricettore la cui soglia VERA è 20 mm/s: è il caso apposta costruito per
   dimostrare che la soglia del ricettore vince su quella del punto (prova
   in run-kpi.mjs, riga ~22020). Forzare lì un pattern avrebbe rotto quella
   dimostrazione. Il caso si INIETTA nei dati serviti (mai sul file su
   disco), con le stesse tre difese di sempre: contrassegno col pid,
   iniezione applicata al modulo, date relative a `Date.now()` così il
   banco non invecchia. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8799;
const CONTROPROVA = process.argv.includes("--controprova");
const MODULO = "sentinella-data.js";
const PAGINA = join("apps", "sentinella", "index.html");

const CASI = `
/* ── caso montato dal banco sentinella-escalation-superamenti.mjs (mai sul disco) ── */
{
  const gg = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  DEMO.ricettori = DEMO.ricettori.filter((r) => r.id !== "zesc");
  DEMO.ricettori.push({ id: "zesc", nome: "Ricettore test escalation", tipo: "abitazione",
    distanza: 100, classe: "III", soglia: 5, unita: "mm/s" });
  DEMO.monitoraggi = DEMO.monitoraggi.filter((m) => m.id !== "zesc-p1");
  DEMO.monitoraggi.push({ id: "zesc-p1", nome: "Vibrazioni test — escalation", tipo: "vibrazioni",
    valore: 7.2, soglia: 5, unita: "mm/s", ricettoreId: "zesc",
    letture: [ { data: gg(-20), valore: 6.1 }, { data: gg(-10), valore: 6.8 }, { data: gg(-1), valore: 7.2 } ] });
}
`;

/* L'UNICA INIEZIONE: la stessa del banco del piano pluriennale di Terra, sul
   principio omologo — il controllo di sequenza/pattern non arriva più alla
   riga renderizzata. */
const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "il pattern di superamenti ripetuti non arriva più alla riga del ponte",
    da: 'patt: s.ricettore ? superamentiUltimiGiorni(MON, RIC, s.ricettore.id) : null,',
    a: 'patt: null,' },
];
let rimesse = 0;
const applica = (t, file) => {
  for (const inj of INIEZIONI) {
    if (inj.file !== file || !t.includes(inj.da)) continue;
    t = t.replace(inj.da, inj.a); rimesse++;
  }
  return t;
};

const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
let iniezioniCasi = 0;
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    corpo = Buffer.from(t + CASI, "utf8"); iniezioniCasi++;
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · ⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO" : ""}`); }

let ok = 0, ko = 0;
const dice = (cond, che, extra) => {
  if (cond) { ok++; console.log(`  ✓ ${che}`); }
  else { ko++; console.log(`  ✗ ${che}${extra === undefined ? "" : "  →  " + JSON.stringify(extra)}`); }
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/sentinella/`);
await pg.waitForTimeout(2200);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, `i casi sono stati serviti (${iniezioniCasi} volte)`);

const riga = await pg.evaluate(() => {
  const nodi = [...document.querySelectorAll(".pon-voce .name")];
  const n = nodi.find((x) => (x.textContent || "").includes("Vibrazioni test — escalation"));
  const voce = n ? n.closest(".pon-voce") : null;
  const badge = voce ? [...voce.querySelectorAll(".badge")].find((b) => /\d+° in \d+gg/.test(b.textContent || "")) : null;
  return voce ? { testo: (voce.innerText || "").replace(/\s+/g, " ").trim(),
    badge: badge ? badge.textContent.trim() : null, title: badge ? badge.getAttribute("title") : null } : null;
});
dice(!!riga, "la riga del punto iniettato è nel ponte («Cosa abbiamo fatto»)", riga);
dice(!!riga && riga.badge === "3° in 30gg", "il badge dice ESATTAMENTE quanti episodi e su quanti giorni", riga && riga.badge);
dice(!!riga && /3° superamento negli ultimi 30 giorni su questo ricettore/.test(riga.title || ""),
  "e il title spiega la frase per intero", riga && riga.title);

await b.close();
srv.close();

console.log(`\n${ok} passati, ${ko} falliti`);
if (CONTROPROVA) {
  console.log(`iniezioni rimesse davvero: ${rimesse} su ${INIEZIONI.length}`);
  for (const i of INIEZIONI) console.log(`   · ${i.n}. ${i.perche}`);
  if (rimesse < INIEZIONI.length) {
    console.error("\n✗ CONTROPROVA NON VALIDA: l'iniezione non ha trovato il suo testo.");
    process.exit(2);
  }
  console.log(ko > 0 ? "\n✓ CONTROPROVA: coi difetti rimessi il banco li vede."
    : "\n✗ CONTROPROVA: coi difetti rimessi il banco NON li vede.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

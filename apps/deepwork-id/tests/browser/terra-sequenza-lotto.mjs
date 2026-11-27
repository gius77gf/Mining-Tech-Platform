/* LA SEQUENZA DEL PROGETTO — provata aprendo la pagina Titolo e leggendo la
   riga del lotto, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node terra-sequenza-lotto.mjs [--porta=8793]
     node terra-sequenza-lotto.mjs --controprova   (rimette il difetto: DEVE fallire)

   CHE COSA TIENE CHIUSO. `sequenzaLotto` (16/09, dal delta della ricerca
   continua sul sequenziamento multi-anno) dà un peso a `lotto.ordine`, che
   esisteva da sempre ma non era mai usato in nessun controllo: un lotto può
   dichiarare `dipendeDa: {lottoId, percentuale}` e la funzione dice se quel
   lotto è stato aperto rispettando la soglia sul precedente — non blocca
   niente, si limita a dirlo (Terra non ha un bottone "apri" distinto dal
   form generico di modifica).
   Il banco pretende che il Lotto 5 (fuori sequenza nella dimostrazione: aperto
   prima che il Lotto 4 raggiungesse l'80%, oggi al 34,8%) porti il badge
   "fuori sequenza" e la frase con la percentuale VERA calcolata dal modulo,
   e che il Lotto 6 (che rispetta la sua dipendenza) NON porti quel badge. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8793;
const CONTROPROVA = process.argv.includes("--controprova");
const PAGINA = join("apps", "terra", "index.html");

/* L'UNICA INIEZIONE: la chiamata a `sequenzaLotto` viene forzata a "non
   pertinente" per ogni lotto — la stessa cosa che succede oggi per i quattro
   lotti che non dichiarano `dipendeDa`, ma applicata anche a lo5 e lo6, che
   invece lo dichiarano. */
const INIEZIONI = [
  { file: PAGINA, n: 1, perche: "il controllo di sequenza non arriva più alla riga del lotto",
    da: "const sl = sequenzaLotto(l, LOT, RIL);",
    a: "const sl = { pertinente: false, rispettata: null, frase: \"\" };" },
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
const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
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
await pg.goto(`http://127.0.0.1:${porta}/apps/terra/`);
await pg.waitForTimeout(2200);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

await pg.evaluate(() => { const n = document.getElementById("nav-tit"); if (n) n.click(); });
await pg.waitForTimeout(600);

const rigaDi = (nomeLotto) => pg.evaluate((nome) => {
  const nodi = [...document.querySelectorAll(".item .name")];
  const n = nodi.find((x) => (x.textContent || "").includes(nome));
  const riga = n ? n.closest(".item") : null;
  const badge = riga ? [...riga.querySelectorAll(".badge")].find((b) => /fuori sequenza/i.test(b.textContent || "")) : null;
  return riga ? { testo: (riga.innerText || "").replace(/\s+/g, " ").trim(), badgeFuoriSequenza: !!badge } : null;
}, nomeLotto);

const r5 = await rigaDi("Lotto 5");
dice(!!r5, "la riga del Lotto 5 esiste");
dice(!!r5 && r5.badgeFuoriSequenza, "il Lotto 5 porta il badge «fuori sequenza»", r5);
dice(!!r5 && /Aperto prima che Lotto 4 — settore Nord raggiungesse l'80%: oggi è al 34,8%/.test(r5.testo),
  "e la frase riporta ESATTAMENTE la percentuale calcolata dal modulo (34,8%)", r5 && r5.testo);

const r6 = await rigaDi("Lotto 6");
dice(!!r6, "la riga del Lotto 6 esiste");
dice(!!r6 && !r6.badgeFuoriSequenza, "il Lotto 6 rispetta la sua dipendenza: NESSUN badge «fuori sequenza»", r6);
dice(!!r6 && /Sequenza rispettata: Lotto 5 — settore Est è al 27,6%/.test(r6.testo),
  "e la frase dice che la sequenza è rispettata, con la percentuale vera", r6 && r6.testo);

const r1 = await rigaDi("Lotto 1");
dice(!!r1 && !/dipende|sequenza/.test(r1.testo),
  "il Lotto 1 non dichiara nessuna dipendenza: riga silenziosa, nessun avviso inventato", r1);

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

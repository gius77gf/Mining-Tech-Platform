/* SCUDO · LE BARRIERE MANCATE (ICAM), VERIFICATE NEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-barriere-icam.mjs [--porta=8811]
     node scudo-barriere-icam.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 16/09 (dal delta della ricerca continua, undicesimo
   giro) Scudo ha guadagnato `barriereRicorrenti` — non «che cosa ha
   causato l'evento» ma «che cosa avrebbe dovuto fermarlo e non l'ha
   fatto» (il pezzo specifico del metodo ICAM, citato per il settore
   minerario, che il solo «5 Perché» non cattura). La funzione pura è
   provata a fondo in run-kpi.mjs; qui c'è solo quello che soltanto il
   browser può dire: che i chip si selezionano a MULTI-SCELTA (non come la
   causa, che è singola), che il valore SOPRAVVIVE alla riapertura della
   modale, e che il pannello "barriere ricorrenti" mostra il caso vero già
   in demo (`an1`/i1, «la fascia di rispetto a valle non era delimitata»).

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO. La stessa famiglia già vista
   su `frequenzaFermiControStoria`/`concentrazionePortafoglio`: una funzione
   nuova che nessuna pagina collega resta orfana (`funzioni-mai-usate.mjs`
   la vede), ma un collegamento SBAGLIATO — il bottone che salva senza
   leggere `AN.barriereMancate`, o il chip che sovrascrive invece di
   accumulare — non lo vede nessuna suite `node`, perché nessuna apre la
   pagina vera e preme i bottoni veri. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8811;
const CONTROPROVA = process.argv.includes("--controprova");

/* LA CONTROPROVA rimette il difetto nel MODULO servito: il click sul chip
   SOSTITUISCE l'array invece di accumularlo, come farebbe una copia scritta
   guardando `AN.causa` (singolo) invece di trattare `barriereMancate` come
   un insieme. Un `replace` che non trova niente esce in silenzio: si conta. */
const DIFETTO = [
  `if (attiva) { if (!AN.barriereMancate.includes(chiave)) AN.barriereMancate.push(chiave); }
      else AN.barriereMancate = AN.barriereMancate.filter(x => x !== chiave);`,
  `AN.barriereMancate = attiva ? [chiave] : [];`,
];
let iniezioniDifetto = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER: una porta occupata
     non si riusa, si misurerebbe la copia di qualcun altro. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/scudo/index.html")) {
    let t = corpo.toString("utf8");
    const n = t.split(DIFETTO[0]).length - 1;
    if (n !== 1) console.log(`⛔ INIEZIONE MANCATA nella pagina: ${n} soggetti invece di 1`);
    else { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
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
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-doc");
await pg.waitForTimeout(700);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-doc"), "navigazione alla pagina che porta il registro infortuni", vive);

// ══ 1. IL PANNELLO MOSTRA IL CASO VERO GIÀ IN DEMO (an1/i1) ══════════════
{
  const conteggio = (await pg.locator("#barriere-count").textContent()).trim();
  dice(conteggio === "1 su 12", `il pannello conta l'analisi con barriera su tutti gli eventi/near-miss/osservazioni (${conteggio})`, conteggio);
  const riep = await pg.locator("#barriere-riep").innerHTML();
  dice(/servono almeno 5/.test(riep), "sotto la soglia di leggibilità, lo dichiara invece di disegnare una tendenza su un punto solo", riep.slice(0, 200));
  const lista = await pg.locator("#barriere-list").innerHTML();
  dice(/[Dd]elimitazione/.test(lista), "ma la riga con il poco che c'è resta visibile (il principio del fondatore)", lista.slice(0, 200));
}

// ══ 2. LA PERSISTENZA: RIAPRENDO L'ANALISI, IL CHIP GIÀ SALVATO È ATTIVO ═
{
  await pg.locator('[data-analisi="i1"]').first().click();
  await pg.waitForTimeout(500);
  const attivi = await pg.locator("#an-barriere .chg.active").count();
  dice(attivi === 1, "riaprendo l'analisi di i1, il chip salvato in demo è già attivo", attivi);
  const testo = await pg.locator("#an-barriere .chg.active").first().textContent().catch(() => "");
  dice(/[Dd]elimitazione/.test(testo || ""), "ed è proprio «Delimitazione / fascia di rispetto», non un altro", testo);
}

// ══ 3. IL MULTI-SELECT SOPRAVVIVE AL SALVATAGGIO, NON SOLO AL CLIC ═══════
// ⛔ Qui è dove morde la controprova, e va misurato sul DATO SALVATO, non
// sulla classe CSS del chip: un click che SOSTITUISCE l'array invece di
// ACCUMULARLO (`AN.barriereMancate = attiva ? [chiave] : []`) lascia
// comunque i DUE chip visivamente «active» — il toggle della classe non
// passa dall'array rotto — e solo RIAPRENDO l'analisi (che rilegge il
// record vero, non lo stato transitorio del form) il secondo sparisce.
{
  await pg.locator('#an-barriere .chg[data-an-barriera="sorveglianza"]').click();
  await pg.waitForTimeout(200);
  const due = await pg.locator("#an-barriere .chg.active").count();
  dice(due === 2, `un secondo chip si AGGIUNGE al primo nel form (${due} attivi)`, due);
  await pg.locator("#modal-foot button.primary").click();
  await pg.waitForTimeout(500);
  // il salvataggio apre una modale di conferma: la si chiude e si riapre
  // subito l'analisi per rileggere quello che è stato scritto DAVVERO
  await pg.locator("#modal button.mbtn").first().click().catch(() => {});
  await pg.waitForTimeout(400);
  await pg.locator('[data-analisi="i1"]').first().click();
  await pg.waitForTimeout(500);
  const dopoSalvataggio = await pg.locator("#an-barriere .chg.active").count();
  dice(dopoSalvataggio === 2, `riaprendo l'analisi dopo aver salvato, ENTRAMBE le barriere sono ancora attive (${dopoSalvataggio})`, dopoSalvataggio);
  const etichette = await pg.locator("#an-barriere .chg.active").allTextContents();
  dice(etichette.some((t) => /[Dd]elimitazione/.test(t)) && etichette.some((t) => /[Ss]orveglianza/.test(t)),
    "e sono proprio delimitazione E sorveglianza, non una copia dell'ultimo click", etichette);
}

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
/* con --controprova l'esito si ROVESCIA: deve fallire */
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

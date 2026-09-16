/* CONTI · LO STORICO DEI SOLLECITI, VERIFICATO NEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-solleciti-storico.mjs [--porta=8892]
     node conti-solleciti-storico.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 16/09 (decimo giro di ricerca continua su Conti) Conti
   ha guadagnato `statoRecupero`: `livelloSollecito`/`testoSollecito`
   ricalcolano il livello dal solo ritardo, ogni volta, senza sapere se una
   lettera è già PARTITA. Il delta è un log leggero (`fattura.solleciti:
   [{livello, data, canale}]`) scritto SOLO quando l'utente conferma un
   invio già avvenuto — un bottone "Segna come inviato" accanto a
   "Sollecito", nessun invio automatico. La funzione pura è provata a fondo
   in run-kpi.mjs (ordine per data, righe corrotte scartate, "mai
   comunicato" diverso da "livello 0"). Qui c'è solo quello che soltanto il
   browser può dire: che il bottone apre la modale sulla FATTURA GIUSTA,
   che il badge in elenco riflette lo stato vero, e che la registrazione
   sopravvive alla chiusura della modale (si legge dal record salvato, non
   dallo stato transitorio del form).

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO. La stessa famiglia già vista su
   `componentiDelMezzo` (Flotta, stesso giorno): un collegamento SBAGLIATO fra
   il bottone e il suo dato non lo vede nessuna suite `node`, perché nessuna
   apre la pagina vera e preme i bottoni veri. Qui il bottone porta
   `data-segna-sollecito` con l'ID della fattura; se qualcuno lo scrivesse col
   NUMERO al posto dell'ID (un refuso plausibile: sono entrambi stringhe
   sull'oggetto fattura, e il codice accanto usa spesso `f.numero` nei
   messaggi), `FAT.find(x => x.id === ...)` non trova più niente e il click
   non apre nessuna modale — zero errori di sintassi, zero prove rosse. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8892;
const CONTROPROVA = process.argv.includes("--controprova");

const DIFETTO = [
  'data-segna-sollecito="${f.id}"',
  'data-segna-sollecito="${f.numero}"',
];
let iniezioniDifetto = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
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
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2600);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
if (CONTROPROVA) dice(iniezioniDifetto > 0, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.click("#nav-fat");
await pg.waitForTimeout(700);
const vive = await pg.evaluate(() => [...document.querySelectorAll(".page")].filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
dice(vive.includes("page-fat"), "navigazione alla pagina delle fatture", vive);

// ══ 1. IN DEMO, F1 (EDILCAVE) È SEGNATA A LIVELLO 1 MA IL RITARDO ORA
//       IMPLICA IL LIVELLO 3: IL BADGE "DA AGGIORNARE" DEVE ESSERCI ══════
{
  const riga = pg.locator('[data-fat="f1"]');
  const html = await riga.innerHTML();
  dice(/Sollecito da aggiornare/.test(html), "il badge segnala che l'ultimo sollecito segnato non basta più", html.slice(0, 400));
  dice(!/Mai comunicato/.test(html), "e NON \"mai comunicato\": in demo un livello è già stato segnato", html.slice(0, 400));
}

// ══ 2. IL BOTTONE APRE LA MODALE SULLA FATTURA GIUSTA (qui morde la
//       controprova: con l'ID scambiato per il numero, FAT.find non trova
//       niente e il click non apre nessuna modale) ══════════════════════
{
  await pg.locator('[data-fat="f1"] [data-segna-sollecito]').click();
  await pg.waitForTimeout(500);
  const aperta = await pg.locator("#modal.show").count();
  dice(aperta === 1, "il click apre la modale", aperta);
  const titolo = await pg.locator("#modal-title").textContent().catch(() => "");
  dice(/2026\/031/.test(titolo || ""), "ed è la modale della fattura giusta (2026/031, non un'altra)", titolo);
  const corpo = await pg.locator("#modal-body").innerHTML().catch(() => "");
  dice(/livello 1/.test(corpo) && /15\/07\/2026/.test(corpo), "il corpo mostra lo storico vero (livello 1, 15/07/2026)", corpo.slice(0, 400));
}

if (!CONTROPROVA) {
  // ══ 3. LA REGISTRAZIONE SOPRAVVIVE ALLA CHIUSURA DELLA MODALE: si legge
  //       da FAT dopo il refresh, non dallo stato transitorio del form ════
  await pg.selectOption("#sol-canale", "pec");
  await pg.locator("#modal-foot .mbtn.primary").click();
  await pg.waitForTimeout(600);
  const chiusa = await pg.locator("#modal.show").count();
  dice(chiusa === 0, "la modale si chiude dopo la registrazione", chiusa);

  const rigaDopo = await pg.locator('[data-fat="f1"]').innerHTML();
  dice(!/Sollecito da aggiornare/.test(rigaDopo), "dopo aver segnato il livello 3, il badge \"da aggiornare\" sparisce", rigaDopo.slice(0, 400));

  // riapertura: il nuovo livello 3/PEC/oggi compare nello storico, il
  // livello 1 di prima resta (non si sostituisce, si accumula)
  await pg.locator('[data-fat="f1"] [data-segna-sollecito]').click();
  await pg.waitForTimeout(500);
  const corpoDopo = await pg.locator("#modal-body").innerHTML();
  dice(/livello 3/.test(corpoDopo) && /PEC/.test(corpoDopo), "il nuovo sollecito (livello 3, PEC) compare nello storico", corpoDopo.slice(0, 500));
  dice(/livello 1/.test(corpoDopo), "e quello vecchio (livello 1) resta: la storia si accumula, non si sostituisce", corpoDopo.slice(0, 500));
  dice(/\(2\)/.test(corpoDopo) || /Solleciti già segnati \(2\)/.test(corpoDopo), "lo storico conta due registrazioni", corpoDopo.slice(0, 500));
}

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

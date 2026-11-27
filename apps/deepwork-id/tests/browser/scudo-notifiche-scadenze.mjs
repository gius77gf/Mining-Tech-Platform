/* SCUDO · IL CONTATORE DI NOTIFICHE SULLE SCADENZE, VERIFICATO NEL BROWSER.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-notifiche-scadenze.mjs [--porta=8895]
     node scudo-notifiche-scadenze.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Il 16/09 (dodicesimo giro di ricerca continua su Scudo,
   primo passo di "notifiche automatiche" senza server) Scudo ha guadagnato
   `notificheScadenzeNonLette`: chi non apre la pagina Scadenze da giorni non
   sapeva che il numero di scadenze urgenti era cambiato da allora. "Nuova"
   non è un campo salvato — si deduce confrontando `livelloScadenza` alla
   data dell'ultima visita con quello di oggi, così basta UN timestamp
   (`impostazioni.scadenzeVisteIl`) invece di uno storico per ogni scadenza.
   La funzione pura è provata a fondo in run-kpi.mjs; qui c'è solo quello
   che soltanto il browser può dire: che il badge compare sul bottone della
   barra in basso PRIMA di aprire la pagina (persistente, non "mentre la si
   guarda"), e che SPARISCE dopo aver visitato Scadenze — perché il record
   `impostazioni` viene DAVVERO aggiornato (`IMP[0]` rifritto dopo la
   scrittura), non solo azzerato in un contatore locale della sessione.

   IL DIFETTO CHE QUESTO BANCO TIENE CHIUSO. `segnaScadenzeViste` scrive
   `scadenzeVisteIl` con `db.aggiorna`; se qualcuno lo scambiasse con
   `db.aggiungi` (un refuso plausibile: sono i due verbi usati ovunque nella
   stessa pagina, e qui il record esiste già), ogni visita CREEREBBE un
   secondo record invece di aggiornare il primo — `IMP[0]` resterebbe quello
   vecchio (mai aggiornato) e il badge non sparirebbe mai. Zero errori di
   sintassi, zero prove rosse in run-kpi.mjs, perché la funzione pura non sa
   nulla di come viene chiamata. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8895;
const CONTROPROVA = process.argv.includes("--controprova");

const DIFETTO = [
  'if (rec) { if (rec.scadenzeVisteIl === oggi) return; await db.aggiorna("impostazioni", rec.id, { scadenzeVisteIl: oggi }); }',
  'if (rec) { if (rec.scadenzeVisteIl === oggi) return; await db.aggiungi("impostazioni", { scadenzeVisteIl: oggi }); }',
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

// ══ 1. IL BADGE È GIÀ ACCESO PRIMA DI APRIRE LA PAGINA (persistente) ═════
const nascostoPrima = await pg.locator("#badge-notif-scad").isHidden();
const testoPrima = await pg.locator("#badge-notif-scad").textContent().catch(() => "");
dice(!nascostoPrima, "il badge è già acceso appena la pagina carica, senza aver aperto Scadenze", { nascostoPrima, testoPrima });
dice(testoPrima.trim() === "1", "e il numero è quello vero della demo (la CQC di s5, scaduta dopo l'ultima visita)", testoPrima);

// ══ 2. VISITANDO LA PAGINA, IL BADGE SPARISCE — DAL RECORD AGGIORNATO ═══
// ⚠️ Qui morde la controprova: uno swap `aggiorna`→`aggiungi` non
// aggiorna il record esistente (crea un secondo record), quindi il
// timestamp letto da `IMP[0]` resta quello vecchio e il badge non sparisce.
await pg.click("#nav-scad");
await pg.waitForTimeout(900);
const nascostoDopo = await pg.locator("#badge-notif-scad").isHidden();
dice(nascostoDopo, "dopo aver aperto Scadenze il badge sparisce", nascostoDopo);

// tornando al Quadro e poi di nuovo a Scadenze (senza ricaricare la pagina),
// il badge resta spento: non è un lampo che si riaccende da solo
await pg.click("#nav-dash");
await pg.waitForTimeout(300);
await pg.click("#nav-scad");
await pg.waitForTimeout(300);
const nascostoAncora = await pg.locator("#badge-notif-scad").isHidden();
dice(nascostoAncora, "e resta spento tornando sulla pagina, non si riaccende da solo", nascostoAncora);

console.log(`\n${ok} ok, ${ko} KO`);
if (CONTROPROVA) console.log(ko > 0 ? "CONTROPROVA: il difetto rimesso fa cadere il banco ✔" : "⛔ CONTROPROVA: il difetto è dentro e il banco NON se ne accorge");
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

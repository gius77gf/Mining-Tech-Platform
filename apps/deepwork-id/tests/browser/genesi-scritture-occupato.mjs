/* GENESI: RICONCILIAZIONE E «DUPLICA» VOLATA SENZA GUARDIA CONTRO IL
   DOPPIO TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node genesi-scritture-occupato.mjs [--porta=8961]
     node genesi-scritture-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal terzo giro di deep-pass QA su Genesi (18/09):
   `GDB.aggiungi` in modalità locale (senza organizzazione) legge e riscrive
   `localStorage` in modo sincrono — stessa famiglia già vista sulle altre
   app: un doppio tocco su un bottone senza guardia crea due record
   identici. Verificato dal vivo dall'agente su `riconSave` (salvataggio
   riconciliazione) e sul bottone "Duplica" di una volata salvata in Home —
   nessuno dei due aveva un controllo di doppione. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8961;
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/genesi/genesi.html",
   "  if(rec.real.x50==null&&rec.real.ppv==null&&rec.real.fly==null&&!rec.campo){ toast('Inserisci almeno un valore reale, o importa il consuntivo di carico da Campo'); return; }\n"
   + "  /* ⛔ 18/09, dal terzo giro di deep-pass QA: nessuna guardia — confermato dal\n"
   + "     vivo, un doppio tocco registra due riconciliazioni identiche. */\n"
   + "  occupato('riconSave', true);\n"
   + "  await GDB.aggiungi('riconciliazioni', rec);\n"
   + "  occupato('riconSave', false);\n"
   + "  toast('Riconciliazione salvata'); riconRender();\n"
   + "}",
   "  if(rec.real.x50==null&&rec.real.ppv==null&&rec.real.fly==null&&!rec.campo){ toast('Inserisci almeno un valore reale, o importa il consuntivo di carico da Campo'); return; }\n"
   + "  await GDB.aggiungi('riconciliazioni', rec);\n"
   + "  toast('Riconciliazione salvata'); riconRender();\n"
   + "}"],
  ["apps/genesi/genesi.html",
   "  if(act==='dup'){\n"
   + "    /* ⛔ 18/09, dal terzo giro di deep-pass QA: nessuna guardia — confermato\n"
   + "       dal vivo, un doppio tocco duplica due volte invece di una. Il bottone\n"
   + "       nasce senza un id fisso (una riga per volata, dal rendering della\n"
   + "       lista): si disabilita l'elemento stesso invece di passare da\n"
   + "       occupato(id, ...), che vuole un id nel DOM. */\n"
   + "    if(btn.disabled) return;\n"
   + "    btn.disabled=true;\n"
   + "    const c=JSON.parse(JSON.stringify(arr[i])); c.id='v'+Date.now(); c.nome=arr[i].nome+' (copia)'; c.data=timbroLocale();\n"
   + "    await GDB.aggiungi('volate', c); renderHome(); toast('✓ Duplicata'); return;\n"
   + "  }",
   "  if(act==='dup'){ const c=JSON.parse(JSON.stringify(arr[i])); c.id='v'+Date.now(); c.nome=arr[i].nome+' (copia)'; c.data=timbroLocale(); await GDB.aggiungi('volate', c); renderHome(); toast('✓ Duplicata'); return; }"],
];
const difettiRimessi = new Set();

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
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
/* una volata già salvata, per provare "Duplica" senza dover disegnare e
   salvare un progetto vero */
await pg.addInitScript(() => {
  localStorage.setItem("genesiVolate", JSON.stringify([{ id: "vtest1", nome: "Prova banco", data: "2026-09-10",
    sintesi: "prova", design: { B: 3, S: 3.5, prof: 10, diam: 102, kg: 20, holes: [] } }]));
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/genesi/genesi.html?go=home&demo=1`);
await pg.waitForTimeout(2000);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));

/* ── 1. Riconciliazione: doppio tocco, prova per conteggio ── */
const apertaModale = await pg.evaluate(() => { const b = document.getElementById("riconOpen"); if (!b) return false; b.click(); return true; });
dice(apertaModale, "trovato il bottone che apre la riconciliazione");
await pg.waitForTimeout(400);
const campoPresente = await pg.evaluate(() => !!document.getElementById("ric-x50"));
dice(campoPresente, "la modale propone il campo X50 reale");
if (campoPresente) {
  await pg.fill("#ric-x50", "27,5");
  const nRiconPrima = await pg.evaluate(() => (JSON.parse(localStorage.getItem("genesiRicon") || "[]") || []).length);
  const cliccato = await pg.evaluate(() => {
    const btn = document.getElementById("riconSave");
    if (!btn) return false;
    btn.click(); btn.click();
    return true;
  });
  dice(cliccato, "trovato «Salva riconciliazione» e cliccato due volte");
  await pg.waitForTimeout(500);
  const nRiconDopo = await pg.evaluate(() => (JSON.parse(localStorage.getItem("genesiRicon") || "[]") || []).length);
  dice(nRiconDopo === nRiconPrima + 1, `⛔ Riconciliazione: due tocchi registrano UNA riga, non due (${nRiconPrima} -> ${nRiconDopo})`, { nRiconPrima, nRiconDopo });
  await pg.evaluate(() => { const b = document.getElementById("riconClose"); if (b) b.click(); });
}

/* ── 2. "Duplica" volata: doppio tocco, prova per conteggio ── */
await pg.waitForTimeout(300);
const nVolPrima = await pg.evaluate(() => (JSON.parse(localStorage.getItem("genesiVolate") || "[]") || []).length);
dice(nVolPrima >= 1, "la dimostrazione ha almeno una volata salvata", nVolPrima);
const dupCliccato = await pg.evaluate(() => {
  const btn = document.querySelector('#hgVolate .hg-item [data-act="dup"]');
  if (!btn) return false;
  btn.click(); btn.click();
  return true;
});
dice(dupCliccato, "trovato «Duplica» e cliccato due volte");
await pg.waitForTimeout(500);
const nVolDopo = await pg.evaluate(() => (JSON.parse(localStorage.getItem("genesiVolate") || "[]") || []).length);
dice(nVolDopo === nVolPrima + 1, `⛔ Duplica: due tocchi quasi simultanei creano UNA copia, non due (${nVolPrima} -> ${nVolDopo})`, { nVolPrima, nVolDopo });

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

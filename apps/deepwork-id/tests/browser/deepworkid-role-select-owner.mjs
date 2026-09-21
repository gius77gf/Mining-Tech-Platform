/* DEEPWORK ID: IL SELECT DI CAMBIO RUOLO OFFRIVA "OWNER" ANCHE A UN ADMIN
   NON-OWNER
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node deepworkid-role-select-owner.mjs                 (porta effimera)
     node deepworkid-role-select-owner.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Deepwork ID (18/09):
   `puoGestire` nasconde la select di cambio ruolo SOLO se la riga gestita è
   già un owner e non si è owner — ma non impediva a un admin non-owner di
   SCEGLIERE "Owner" come nuovo ruolo per un member o un altro admin. Il
   server rifiuta sempre (`updateMemberRole`: `role === "owner" && myRole
   !== "owner"` → permission-denied), quindi non è un buco di sicurezza, ma
   un bottone che promette un'azione che fallirà sempre — la stessa
   famiglia del difetto già corretto lo stesso giorno (un admin vedeva le
   stesse azioni su un OWNER esistente), qui nella metà opposta
   (PROMUOVERE a owner, non gestire un owner esistente).
   Per provarlo senza un vero backend Firebase, si forza `VIVO = true` (e i
   flag isAdmin/isOwner/myUid) nella pagina servita: il resto del rendering
   (DEMO_MEM, refresh()) resta quello di sempre. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* LO SCENARIO (non il difetto): forza la pagina in modalità "reale" con un
   admin NON-owner al comando, senza bisogno di un backend Firebase vero.
   Si inietta SEMPRE, anche nel giro normale — è la premessa che rende il
   difetto osservabile, non il difetto stesso. */
const SCENARIO = [
  "  let id = null, isAdmin = false, isOwner = false, myUid = null;",
  "  let id = null, isAdmin = true, isOwner = false, myUid = 'u2';",
];
const SCENARIO2 = [
  "  const VIVO = live();",
  "  const VIVO = true;",
];
const SCENARIO3 = [
  '    const mem = VIVO ? await id.listMembers() : DEMO_MEM;\n    const inv = VIVO ? await id.listPendingInvites() : DEMO_INV;',
  "    const mem = DEMO_MEM;\n    const inv = DEMO_INV;",
];

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09 sera. */
const DIFETTO = [
  "    const ruoliSelezionabili = (!VIVO || isOwner) ? ['owner','admin','member'] : ['admin','member'];\n",
  "",
];
const DIFETTO2 = [
  "${ruoliSelezionabili.map(r => `<option value=\"${r}\" ${m.role === r ? 'selected' : ''}>${r[0].toUpperCase() + r.slice(1)}</option>`).join('')}",
  "${['owner','admin','member'].map(r => `<option value=\"${r}\" ${m.role === r ? 'selected' : ''}>${r[0].toUpperCase() + r.slice(1)}</option>`).join('')}",
];
let iniezioniScenario = 0, iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/deepwork-id/admin.html")) {
    let t = corpo.toString("utf8");
    for (const [cerca, sost] of [SCENARIO, SCENARIO2, SCENARIO3]) {
      const n = t.split(cerca).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE DI SCENARIO MANCATA: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
      t = t.replace(cerca, sost); iniezioniScenario++;
    }
    if (CONTROPROVA) {
      for (const [cerca, sost] of [DIFETTO, DIFETTO2]) {
        const n = t.split(cerca).length - 1;
        if (n !== 1) { console.log(`⛔ INIEZIONE DI DIFETTO MANCATA: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
        t = t.replace(cerca, sost); iniezioniDifetto++;
      }
    }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 900, height: 800 } });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/deepwork-id/admin.html`);
await pg.waitForTimeout(1500);

console.log(`\n${iniezioniScenario}/3 iniezioni di scenario riuscite` + (CONTROPROVA ? `, ${iniezioniDifetto}/2 difetti rimessi` : ""));
dice(iniezioniScenario === 3, "lo scenario (admin NON-owner, modalità reale) è stato applicato", iniezioniScenario);
if (CONTROPROVA) dice(iniezioniDifetto === 2, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

const righe = await pg.evaluate(() => {
  return [...document.querySelectorAll("#mem-list .item")].map((el) => {
    const sel = el.querySelector(".role-sel");
    return {
      nome: el.querySelector(".name")?.textContent || "",
      opzioni: sel ? [...sel.options].map((o) => o.value) : null,
    };
  });
});
console.log("  righe:", JSON.stringify(righe));
dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
dice(righe.length === 3, "la dimostrazione mostra i tre membri", righe.length);

const rigaAdmin = righe.find((r) => /ufficio@cava-alfa\.it/.test(r.nome));   // u2: sono io, niente select su me stesso
dice(!!rigaAdmin, "trovata la riga dell'admin non-owner che sta guardando (sé stesso)", rigaAdmin);

const rigaMember = righe.find((r) => /capocava@cava-alfa\.it/.test(r.nome));   // u3: member, select visibile
dice(!!rigaMember && Array.isArray(rigaMember.opzioni), "trovata la riga del member, con la select di cambio ruolo", rigaMember);
dice(rigaMember && rigaMember.opzioni && !rigaMember.opzioni.includes("owner"),
  "⛔ e la select NON offre «Owner»: un admin non-owner non può promuovere nessuno a owner (il server lo rifiuterebbe comunque)",
  rigaMember && rigaMember.opzioni);

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

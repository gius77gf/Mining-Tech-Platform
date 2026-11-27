/* DEEPWORK ID: "CREA" L'ORGANIZZAZIONE (non-autorizzato.html) NON SI
   DISABILITAVA DURANTE LA SCRITTURA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node deepworkid-guard-occupato.mjs                 (porta effimera)
     node deepworkid-guard-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal secondo giro di deep-pass QA su Deepwork ID (18/09):
   `non-autorizzato.html`/`profilo.html` non caricano shared/dw-app-ui.js
   (sono pagine deliberatamente minime, prima ancora che esista
   un'organizzazione), quindi `occupato()` non c'era. `guard()` è l'unico
   punto per cui passano tutti i tocchi: ha imparato un secondo parametro
   facoltativo, l'id del bottone da disabilitare per la durata della
   scrittura. Prima della correzione un doppio tocco su "Crea" (il primo
   contatto di un cliente nuovo) creava DUE organizzazioni distinte —
   `createOrganization` non ha idempotenza lato server, genera sempre un
   nuovo id — e l'utente diventava owner di entrambe.
   Per provarlo senza un vero backend Firebase, si inietta uno SCENARIO (non
   il difetto): un `id` finto con `createOrganization` che impiega 300 ms,
   così il banco ha il tempo di leggere lo stato del bottone A META' della
   scrittura — esattamente il caso che il doppio tocco reale sfrutta. */
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

/* LO SCENARIO, non il difetto: un `id` finto con una scrittura lenta (300 ms),
   iniettato nel `catch` che oggi cattura "nessun backend configurato" — così
   il banco osserva lo stato del bottone mentre la Promise è ancora in volo,
   senza bisogno di un progetto Firebase vero. */
const SCENARIO = [
  "  } catch (e) {\n    msg('Backend non ancora configurato: schermata in modalità mockup (vedi GUIDA_FIREBASE.md).');\n  }",
  "  } catch (e) {\n    id = { user: { email: 'prova@test.it' }, createOrganization: async () => new Promise((r) => setTimeout(r, 300)) };\n    msg('(scenario di prova)');\n  }",
];

/* IL DIFETTO DA RIMETTERE, parola per parola come stava prima del 18/09 sera. */
const DIFETTO = [
  "  const guard = (fn, btnId) => async () => {\n"
  + "    if (!id || !id.user) { msg('Backend non ancora configurato: azione disponibile dopo il setup Firebase.'); return; }\n"
  + "    const b = btnId && $(btnId);\n"
  + "    if (b) b.disabled = true;\n"
  + "    try { await fn(); } catch (e) { msg(e.message || 'Operazione non riuscita.', 'error'); }\n"
  + "    finally { if (b) b.disabled = false; }\n"
  + "  };",
  "  const guard = (fn) => async () => {\n"
  + "    if (!id || !id.user) { msg('Backend non ancora configurato: azione disponibile dopo il setup Firebase.'); return; }\n"
  + "    try { await fn(); } catch (e) { msg(e.message || 'Operazione non riuscita.', 'error'); }\n"
  + "  };",
];
const DIFETTO2 = [", 'btn-create-org');", ");"];
let iniezioneScenario = 0, iniezioniDifetto = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/deepwork-id/non-autorizzato.html")) {
    let t = corpo.toString("utf8");
    const n = t.split(SCENARIO[0]).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE DI SCENARIO MANCATA: ${n} soggetti invece di 1`); }
    else { t = t.replace(SCENARIO[0], SCENARIO[1]); iniezioneScenario++; }
    if (CONTROPROVA) {
      const n1 = t.split(DIFETTO[0]).length - 1;
      if (n1 !== 1) { console.log(`⛔ INIEZIONE DI DIFETTO (guard) MANCATA: ${n1} soggetti invece di 1`); }
      else { t = t.replace(DIFETTO[0], DIFETTO[1]); iniezioniDifetto++; }
      const n2 = t.split(DIFETTO2[0]).length - 1;
      if (n2 !== 1) { console.log(`⛔ INIEZIONE DI DIFETTO (chiamata) MANCATA: ${n2} soggetti invece di 1`); }
      else { t = t.replace(DIFETTO2[0], DIFETTO2[1]); iniezioniDifetto++; }
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
await pg.goto(`http://127.0.0.1:${porta}/apps/deepwork-id/non-autorizzato.html`);
await pg.waitForTimeout(800);

console.log(`\n${iniezioneScenario}/1 iniezione di scenario riuscita` + (CONTROPROVA ? `, ${iniezioniDifetto}/2 difetti rimessi` : ""));
dice(iniezioneScenario === 1, "lo scenario (id finto, scrittura lenta) è stato applicato");
if (CONTROPROVA) dice(iniezioniDifetto === 2, "il difetto è stato rimesso nella pagina servita", iniezioniDifetto);

await pg.fill("#new-org", "Prova Doppio Tocco Srl");
const subito = await pg.evaluate(() => {
  const btn = document.getElementById("btn-create-org");
  if (!btn || btn.disabled) return { saltato: true };
  btn.click();
  return { disabled: btn.disabled };
});
dice(subito.saltato || subito.disabled === true, "⛔ «Crea» si disabilita SUBITO al tocco (mentre la scrittura è in corso)", subito);
await pg.waitForTimeout(600);
const dopo = await pg.evaluate(() => ({ disabled: document.getElementById("btn-create-org")?.disabled }));
dice(dopo.disabled === false, "e si riaccende a scrittura conclusa (anche se ha impiegato 300 ms)", dopo);

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

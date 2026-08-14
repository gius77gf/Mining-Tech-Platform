/* UN SALVATAGGIO CHE FALLISCE IN SILENZIO — sei app, e la domanda è il
   COLLEGAMENTO, non la funzione.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node salvataggio-muto.mjs [--porta=8800]
     node salvataggio-muto.mjs --controprova   (stacca l'avviso: DEVE fallire)

   ⛔ IL FATTO, MISURATO PRIMA DI SCRIVERE UNA RIGA DI CODICE (07/08). Nelle
   sei app verticali ci sono **109 punti** che scrivono sul database, e **103**
   non hanno nessun `catch`. Quindi, oggi, se una scrittura viene rifiutata:
   la promessa è respinta dentro un gestore `async`, la finestra resta aperta,
   nessun toast compare, e chi ha premuto Salva **non ha modo di sapere** se il
   dato è entrato. È il caso frequente, non raro: dal 02/08 le regole del
   Firebase pubblico dicono `if false`, e un `permission-denied` **rifiuta
   subito** (a differenza della rete che manca, dove la scrittura resta appesa
   — quello lo misura `salvataggio-offline.mjs`, ed è un difetto diverso).

   LA DECISIONE 5a, presa dal ciclo il 07/08: «non è stato salvato», mai un
   codice d'errore. La parola sta in `motivoDatiNonSalvati` (shared/), provata
   in `run-helpers.mjs` insieme al montaggio (`avvisaSeNonSalva`).

   ⚠️ QUELLO CHE `node` NON PUÒ VEDERE, ed è la ragione di questo banco: che
   ogni app **lo monti davvero**. Una funzione giusta che non chiama nessuno
   non protegge niente — è la guardia scollegata di CLAUDE.md, e in questa
   casa è già costata (il `<script>` dimenticato, la bandiera che nessuno
   legge). Qui la domanda è: *l'oggetto `db` che la pagina usa è quello
   avvolto?*

   ⛔ COME SI MISURA, dichiarato invece che nascosto. Il server appende alla
   pagina servita una riga che mette da parte l'oggetto `db` **subito dopo**
   il punto in cui l'app lo avvolge, e al modulo dati una riga che fa RIFIUTARE
   la scrittura con un `permission-denied` vero. Poi il banco chiama la
   scrittura e guarda il toast. L'iniezione è dichiarata perché è esattamente
   il punto che si sta misurando: se l'app smettesse di avvolgere, la riga
   metterebbe da parte un oggetto nudo e il toast non comparirebbe — che è
   quello che fa la controprova, staccando l'avviso. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8800;
const CONTROPROVA = process.argv.includes("--controprova");
const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

let messiDaParte = 0, staccati = 0, rifiuti = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  const nome = p.replace(/\\/g, "/");
  if (/\/apps\/(campo|conti|flotta|scudo|sentinella|terra)\/index\.html$/.test(nome)) {
    let t = corpo.toString("utf8");
    const ancora = "  avvisaSeNonSalva(db, toast);";
    if (!t.includes(ancora)) { corpo = Buffer.from(t, "utf8"); s.writeHead(200, { "content-type": "text/html" }); return s.end(corpo); }
    /* ⛔ IL RIFIUTO SI MONTA **PRIMA** DELL'AVVOLGIMENTO: così quello che si
       prova è l'avvolgimento, non il proprio finto. Montandolo dopo si
       sostituirebbe la funzione avvolta e il banco misurerebbe sé stesso —
       la terza delle cinque cause del «non distingue», nella sua forma più
       facile da scrivere per sbaglio. */
    const rifiuto = '  db.aggiorna = async () => { throw Object.assign(new Error("Missing or insufficient permissions."), { code: "permission-denied" }); };\n';
    rifiuti++;
    const montaggio = CONTROPROVA ? "  /* avviso staccato dalla controprova */\n" : ancora + "\n";
    if (CONTROPROVA) staccati++;
    t = t.replace(ancora + "\n", rifiuto + montaggio + "  window.__db = db;\n");
    messiDaParte++;
    corpo = Buffer.from(t, "utf8");
  }
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

let ok = 0, ko = 0, misurate = 0;
const dice = (cond, che, extra) => {
  if (cond) { ok++; console.log(`  ✓ ${che}`); }
  else { ko++; console.log(`  ✗ ${che}${extra === undefined ? "" : "  →  " + JSON.stringify(extra)}`); }
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const app of APP) {
  const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/apps/${app}/`);
  await pg.waitForTimeout(2400);
  console.log(`\n══════ ${app} ══════`);
  dice(errori.length === 0, `${app}: la pagina non solleva errori`, errori.slice(0, 2));
  const pronto = await pg.evaluate(() => !!window.__db && typeof window.__db === "object");
  if (!pronto) {
    /* ⛔ un banco che non raggiunge il suo soggetto lo DICHIARA e tira avanti,
       invece di morire: un totale più basso si legge «ha guardato meno roba»,
       non «si è rotto». */
    console.log(`  ⚠️  ${app}: non sono riuscito a mettere da parte l'oggetto db — NON misurata`);
    await pg.close(); continue;
  }
  misurate++;
  dice(typeof (await pg.evaluate(() => typeof window.__db.aggiorna)) === "string"
    && await pg.evaluate(() => typeof window.__db.aggiorna === "function"),
    `${app}: l'oggetto db ha la scrittura da provare`);

  const esito = await pg.evaluate(async () => {
    let rilanciato = null;
    try { await window.__db.aggiorna("qualunque", "x", { a: 1 }); }
    catch (e) { rilanciato = (e && e.code) || String(e && e.message || e); }
    await new Promise((r) => setTimeout(r, 350));
    const toast = [...document.querySelectorAll(".toast, .dw-toast, [class*='toast']")]
      .map((x) => (x.textContent || "").trim()).filter(Boolean);
    return { rilanciato, toast };
  });
  const testo = esito.toast.join(" | ");
  dice(esito.rilanciato === "permission-denied",
    `${app}: l'errore arriva comunque a chi lo sa gestire (rilanciato)`, esito.rilanciato);
  dice(/non è stata salvata/.test(testo),
    `${app}: chi ha premuto Salva lo vede — «${testo.slice(0, 70)}»`, testo || "(nessun avviso)");
  dice(!/permission|denied|firestore|firebase|insufficient/i.test(testo),
    `${app}: e nell'avviso non c'è nessun codice d'errore`, testo);
  await pg.close();
}
await b.close();
srv.close();

console.log(`\n${ok} passati, ${ko} falliti · ${misurate} app su ${APP.length} misurate`);
console.log(`   (pagine con l'oggetto messo da parte: ${messiDaParte} · moduli col rifiuto montato: ${rifiuti}${CONTROPROVA ? ` · avvisi staccati: ${staccati}` : ""})`);
if (CONTROPROVA) {
  /* ⛔ E SI PRETENDE CHE LE INIEZIONI SIANO ARRIVATE, non solo che il banco sia
     rosso: un avviso staccato in zero pagine darebbe «0 falliti» e si
     leggerebbe «il banco non sa fallire», accusando il banco al posto
     dell'iniezione. */
  if (staccati !== APP.length) {
    console.error(`\n✗ CONTROPROVA NON VALIDA: avvisi staccati ${staccati} su ${APP.length}.`
      + " Non è il banco a non saper fallire — è l'iniezione che non ha iniettato niente.");
    process.exit(2);
  }
  console.log(ko >= APP.length
    ? `\n✓ CONTROPROVA: staccato l'avviso, tutte e ${APP.length} le app tornano MUTE e il banco lo vede.`
    : `\n✗ CONTROPROVA: staccato l'avviso, solo ${ko} app su ${APP.length} risultano mute.`);
  process.exit(ko >= APP.length ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

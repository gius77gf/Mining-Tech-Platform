/* ══════════════════════════════════════════════════════════════════════════
   SENTINELLA · LE CONDIZIONI METEO, DAL FILE E A MANO — premute davvero (05/09)
   ──────────────────────────────────────────────────────────────────────────
   Le tre unità del 05/09 sera hanno portato in Sentinella le condizioni della
   misura (vento, direzione, pioggia, temperatura, umidità) e la regola del
   DM 16/03/1998 All. B sul rumore (vento oltre 5 m/s o pioggia → la misura
   non vale). `sentinella-evento-import` prova il file del sismografo, che di
   meteo non ne ha; nessun banco incollava un file CON le colonne meteo e
   guardava l'anteprima, l'archivio, il report e la striscia del form a mano.
   Qui si fa tutto il giro, a 320 e 390 px.
   ⛔ E la quinta tappa esiste per un difetto vero: dall'08/08 «Registra»
   scriveva la misura e poi moriva su `letture` fuori scope — nessuna
   striscia. Il banco pretende che la striscia CI SIA, e la controprova
   rimette il difetto nella PAGINA e pretende che sparisca.
   La controprova rimette tre difetti, due nel modulo e uno nella pagina,
   applicati PER FILE (`applica`), come vuole `iniezioni-fresche`.
   ══════════════════════════════════════════════════════════════════════════ */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8624;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const MODULO = "apps/sentinella/sentinella-data.js", PAGINA = "apps/sentinella/index.html";

const DIFETTI = [
  /* 1 · il modo «dentro» al posto di «parola»: «Evento» viene preso per il vento */
  ["    { modo: \"parola\", presi });\n  for (const k of Object.keys(out)) out[k] = m.indici[k];\n  return out;\n}\n// La direzione del vento",
   "    { modo: \"dentro\", presi });   /* difetto rimesso dal banco */\n  for (const k of Object.keys(out)) out[k] = m.indici[k];\n  return out;\n}\n// La direzione del vento", MODULO],
  /* 2 · l'archivio che perde le condizioni al reimport */
  ["                  /* e le condizioni meteo (05/09), per la stessa ragione */\n                  ...campiCondizioni(l) });",
   "                  });   /* difetto rimesso dal banco */", MODULO],
  /* 3 · «Registra» che muore dopo aver scritto: `letture` dentro la callback */
  ["    let letture = [];\n    await db.trasforma(\"monitoraggi\", id, (m2) => {\n      letture = [ ...((m2 && m2.letture) || []), nuova ].slice(-MAX_LETTURE);",
   "    await db.trasforma(\"monitoraggi\", id, (m2) => {\n      const letture = [ ...((m2 && m2.letture) || []), nuova ].slice(-MAX_LETTURE);   /* difetto rimesso dal banco */", PAGINA],
];
const colpiti = new Set();
const applica = (t, file) => {
  for (const [a, b, f] of DIFETTI) if (f === file && t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
  return t;
};
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const file of [MODULO, PAGINA]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

const SEGNO = join(R, "__sentinella-meteo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-meteo-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`); process.exit(2); }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };
/* il testo della riga sotto il numero, senza i tag */
const evDi = (r) => { const s = r.querySelector("small.ev"); if (!s) return ""; const c = s.cloneNode(true); c.querySelectorAll(".tag").forEach((t) => t.remove()); return c.textContent.replace(/\s+/g, " ").trim(); };

/* il file del fonometro con la stazione meteo: tre letture sul punto di
   rumore R1 (soglia 70 dB(A)). «Evento» è lì apposta: contiene «vento». La
   seconda riga ha il vento illeggibile, la direzione in gradi e la pioggia
   in millimetri. Le date stanno nell'anno della dimostrazione. */
const FILE = ["Data;Ora;LAeq;Evento;Vento (m/s);Dir. vento;Pioggia;Temp (°C);RH (%)",
  "03/08/2026;10:00;61,2;volata;7,5;SW;no;29;40",
  "04/08/2026;10:00;58;;abc;270;0,4;;",
  "05/08/2026;10:00;57;;2;N;no;24;60"].join("\n");

console.log(`\n════════ Sentinella · le condizioni meteo dal file e a mano, premute davvero${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-mon").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-mon", `navigato davvero nei Monitoraggi (${viste.join(",") || "nessuna"})`, viste);

  // ── 1 · incollare il file: le cinque colonne meteo proposte da sole ──
  await pg.selectOption("#imp-punto", "r1");
  await pg.fill("#imp-testo", FILE);
  await pg.click("#btn-imp-leggi");
  await pg.waitForTimeout(700);
  const prop = await pg.evaluate(() => Object.fromEntries(["imp-col-valore", "imp-col-vento", "imp-col-ventoda", "imp-col-pioggia", "imp-col-temp", "imp-col-umid"].map((i) => [i, document.getElementById(i)?.value])));
  dice(prop["imp-col-valore"] === "2", "il valore proposto è LAeq: le colonne meteo non gli rubano il posto", JSON.stringify(prop));
  dice(prop["imp-col-vento"] === "4" && prop["imp-col-ventoda"] === "5" && prop["imp-col-pioggia"] === "6" && prop["imp-col-temp"] === "7" && prop["imp-col-umid"] === "8",
    "⛔ vento, direzione, pioggia, temperatura e umidità proposti da soli — e «Evento» (colonna 3) NON è preso per il vento", JSON.stringify(prop));
  const eti = await pg.$$eval('label[for="imp-col-vento"], label[for="imp-col-ventoda"], label[for="imp-col-pioggia"], label[for="imp-col-temp"], label[for="imp-col-umid"]', (e) => e.map((l) => l.firstChild.textContent.trim()));
  dice(eti.length === 5 && /^Vento/.test(eti[0]) && /^Umidit/.test(eti[4]), "le cinque tendine hanno le etichette del mestiere", eti.join(" | "));
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "con le dieci tendine in più la pagina non scorre in orizzontale");
  await pg.evaluate(() => document.getElementById("imp-col-vento")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-colonne-meteo`);

  // ── 2 · l'anteprima: le condizioni sotto il numero, «non letta», i tag ──
  const ante = await pg.$$eval("#imp-tab tbody tr", (e, evSrc) => { const evDi = new Function("r", evSrc); return e.map((r) => ({ valore: r.cells[3].firstChild?.textContent.trim(), ev: evDi(r), fuori: !!r.querySelector("small.ev .tag.fb"), nonLetta: r.querySelector("small.ev b")?.textContent.trim() || "", stato: r.cells[4].textContent.trim() })); }, "const s = r.querySelector('small.ev'); if (!s) return ''; const c = s.cloneNode(true); c.querySelectorAll('.tag').forEach((t) => t.remove()); return c.textContent.replace(/\\s+/g, ' ').trim();");
  dice(ante.length === 3 && ante.every((r) => r.stato === "entra"), "tutte e tre le righe entrano: una condizione illeggibile non toglie la misura", JSON.stringify(ante));
  dice(ante[0]?.ev === "vento 7,5 m/s da SO · senza pioggia · 29 °C · umidità 40 %" && ante[0]?.fuori, "la prima riga scrive le condizioni sotto il numero (SW → SO) e porta «fuori condizioni»: vento 7,5", JSON.stringify(ante[0]));
  dice(/^vento da O · pioggia/.test(ante[1]?.ev || "") && ante[1]?.nonLetta === "non letta: vento" && ante[1]?.fuori, "⛔ la seconda riga: 270° è O, 0,4 mm è pioggia, «abc» nel vento si DICHIARA («non letta: vento») e la pioggia la mette fuori condizioni", JSON.stringify(ante[1]));
  dice(ante[2]?.ev === "vento 2 m/s da N · senza pioggia · 24 °C · umidità 60 %" && !ante[2]?.fuori && !ante[2]?.nonLetta, "la terza riga è dentro le condizioni, senza tag e senza «non letta»", JSON.stringify(ante[2]));
  await pg.evaluate(() => document.getElementById("imp-tab")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-2-anteprima`);

  // ── 3 · confermare: l'archivio del punto porta le condizioni ────────────
  await pg.click("#btn-imp-conferma");
  await pg.waitForTimeout(1200);
  const righeR1 = await pg.$$eval("#graf-r1 table.tab tbody tr", (e) => e.map((r) => ({ data: r.cells[0].firstChild.textContent.trim(), prov: r.cells[2].textContent.replace(/\s+/g, " ").trim(), hint: r.querySelector(".ann-hint")?.textContent.trim() || "" }))).catch(() => []);
  const r0308 = righeR1.find((r) => r.data === "03/08/2026"), r0408 = righeR1.find((r) => r.data === "04/08/2026"), r0508 = righeR1.find((r) => r.data === "05/08/2026");
  dice(!!r0308 && /vento 7,5 m\/s da SO · senza pioggia · 29 °C · umidità 40 %/.test(r0308.prov), "⛔ in archivio la lettura del 03/08 porta le condizioni: `unisciLetture` non le ha perse", JSON.stringify(r0308 || righeR1.slice(0, 2)));
  dice(!!r0308 && r0308.hint === "fuori condizioni: vento 7,5 m/s, oltre i 5 m/s ammessi", "e il suggerimento «fuori condizioni: vento 7,5 m/s, oltre i 5 m/s ammessi»", JSON.stringify(r0308));
  dice(!!r0408 && r0408.hint === "fuori condizioni: pioggia", "quella del 04/08 è fuori per la pioggia", JSON.stringify(r0408));
  dice(!!r0508 && !r0508.hint && /vento 2 m\/s da N/.test(r0508.prov), "quella del 05/08 è dentro: condizioni scritte, nessun suggerimento", JSON.stringify(r0508));
  const nota = await pg.$eval("#graf-r1 .graf-nota", (e) => e.textContent.replace(/\s+/g, " ")).catch(() => "");
  dice(/«fuori condizioni»/.test(nota) && /DM 16\/03\/1998/.test(nota) && /candidate/.test(nota), "la nota sotto la tabella spiega che sono candidate, con la norma, e che nessun conto cambia", nota.slice(0, 300));
  await pg.evaluate(() => document.querySelector("#graf-r1 table.tab")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-3-archivio`);

  // ── 4 · a mano: «Registra» con vento 7,5 — la striscia C'È e avvisa ─────
  await pg.selectOption("#mis-sensore", "r1");
  await pg.fill("#mis-valore", "61");
  await pg.fill("#mis-vento", "7,5");
  await pg.selectOption("#mis-pioggia", "no");
  await pg.click("#btn-mis");
  await pg.waitForTimeout(1200);
  const striscia = await pg.$eval("#mis-esito", (e) => e.textContent.replace(/\s+/g, " ").trim()).catch(() => "");
  dice(/Misura su Rumore: 61 dB\(A\) → Conforme/.test(striscia), "⛔ la striscia di conferma C'È: dall'08/08 «Registra» scriveva e poi moriva senza dirlo", striscia || "(vuota)");
  dice(/Attenzione: vento 7,5 m\/s, oltre i 5 m\/s ammessi: per il DM 16\/03\/1998/.test(striscia) && /La lettura resta nei conti/.test(striscia), "e avvisa nell'istante in cui si registra, senza togliere niente", striscia);
  dice(await pg.$eval("#mis-vento", (e) => e.value === "") && await pg.$eval("#mis-valore", (e) => e.value === ""), "i campi si svuotano dopo la registrazione");
  const oggiRiga = await pg.$$eval("#graf-r1 table.tab tbody tr", (e) => e.map((r) => ({ v: r.cells[1].firstChild?.textContent.trim(), hint: r.querySelector(".ann-hint")?.textContent.trim() || "" }))).catch(() => []);
  dice(oggiRiga.some((r) => r.v === "61" && /vento 7,5 m\/s/.test(r.hint)), "e la riga appena registrata è già in tabella col suo suggerimento", JSON.stringify(oggiRiga.slice(0, 2)));
  await scatta(pg, `${W}-4-registra`);

  // ── 5 · il report dell'anno conta fuori · dentro · non si può dire ──────
  await pg.click("#nav-rep").catch(() => {});
  await pg.waitForTimeout(400);
  await pg.click("#btn-rep-anno").catch(() => {});
  await pg.waitForTimeout(900);
  const punti = await pg.$$eval("#rep-doc .rep-punto", (e) => e.map((p) => ({ tit: p.querySelector(".rep-punto-tit")?.textContent.trim(), meta: p.querySelector(".rep-punto-meta")?.textContent.replace(/\s+/g, " ").trim() || "", tag: [...p.querySelectorAll("td.prov .tag.warn")].map((t) => t.textContent.trim()).filter((t) => /fuori condizioni/i.test(t)).length })));
  const pr1 = punti.find((p) => /Rumore/.test(p.tit || ""));
  /* (63 dB(A) su soglia 70 dà «Attenzione», ed è giusto: si registra 61)
     la dimostrazione ha 4 letture (1 fuori, 2 dentro, 1 senza condizioni);
     il file ne porta 3 (2 fuori, 1 dentro); a mano 1 fuori → 4 fuori, 3
     dentro, 1 non si può dire */
  dice(!!pr1 && /Condizioni di misura \(rumore, DM 16\/03\/1998 All\. B\): 4 letture fuori condizioni \(vento oltre 5 m\/s o pioggia\), 3 dentro, una senza vento e pioggia registrati: di quella non si può dire se vale\./.test(pr1.meta),
    "⛔ il report del punto di rumore conta 4 fuori, 3 dentro e UNA senza condizioni («non si può dire»)", pr1 && pr1.meta.slice(0, 700));
  dice(!!pr1 && pr1.tag === 4, "e quattro righe della tabella portano il tag «fuori condizioni»", pr1 && pr1.tag);
  const altri = punti.filter((p) => !/Rumore/.test(p.tit || ""));
  dice(altri.length >= 1 && altri.every((p) => !/Condizioni di misura/.test(p.meta) && p.tag === 0), "⛔ sugli altri punti (polveri, vibrazioni) non si giudica: nessuna regola da applicare", JSON.stringify(altri.map((p) => p.tit)));
  await pg.evaluate(() => [...document.querySelectorAll("#rep-doc .rep-punto")].find((p) => /Rumore/.test(p.textContent))?.scrollIntoView({ block: "start" }));
  await scatta(pg, `${W}-5-report`);

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  dice(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "la pagina non scorre in orizzontale");
  await pg.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

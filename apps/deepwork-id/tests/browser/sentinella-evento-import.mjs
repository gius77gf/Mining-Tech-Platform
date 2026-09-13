/* SENTINELLA · IL FILE DEL SISMOGRAFO A PIÙ COLONNE, INCOLLATO DAVVERO
   ─────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-evento-import.mjs [--porta=8623] [--scatti=/cartella]
     node sentinella-evento-import.mjs --controprova     (DEVE fallire)

   PERCHÉ ESISTE. Un sismografo scrive sulla stessa riga la PPV sui tre assi,
   il vettore somma, la frequenza e la sovrapressione. Fino al 04/09 la
   finestra dell'import prendeva UNA colonna del valore e buttava il resto —
   e col solo indizio «ppv» proponeva un ASSE come valore. Qui si incolla un
   file così nella pagina, a 320 e 390 px, e si guarda che cosa fa la pagina,
   non il modulo:
     · la finestra propone da sé PVS come valore e i cinque campi in più;
     · scegliendo «nessuna: risultante dai tre assi» l'anteprima scrive la
       risultante sotto ogni numero, e la riga con un asse vuoto è SCARTATA
       col motivo (non una risultante a due assi);
     · confermato l'import, la serie storica del punto porta la riga
       dell'evento sotto il valore, dentro la cella (niente scorrimento);
     · il report dichiara «Colonne dello strumento» e da dove viene il numero.
   La dimostrazione non ha nessun file: il caso lo si costruisce incollando,
   in memoria — niente si inietta nel modulo.
   La controprova rimette tre difetti nel modulo servito: `lettureLeggibili`
   che perde `campiEvento` (la scheda torna a non mostrare gli assi),
   `risultanteAssi` che calcola anche a due assi, e `frequenzaFuoriBanda` che
   non dichiara più la frequenza fuori dalla banda della soglia. Il banco
   deve cadere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8623;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const DIFETTI_MODULO = [
  ["                 valore: numeroDichiarato((x || {}).valore), ...campiEvento(x), ...campiCondizioni(x) }))",
   "                 valore: numeroDichiarato((x || {}).valore), ...campiCondizioni(x) }))   /* difetto rimesso dal banco */"],
  ["  const mancanti = ASSI_PPV.filter(k => numeroDichiarato(a[k]) == null);\n  if (mancanti.length)",
   "  const mancanti = ASSI_PPV.filter(k => numeroDichiarato(a[k]) == null);\n  if (mancanti.length === 3)   /* difetto rimesso dal banco */"],
  /* (04/09, sera) la frequenza fuori banda che non si dichiara più: la lettura
     a 18 Hz sotto una soglia «<10 Hz» resta senza tag e il report tace */
  ["  const fuori = (b.da != null && f < b.da) || (b.a != null && f >= b.a);",
   "  const fuori = false;   /* difetto rimesso dal banco */"],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/sentinella/sentinella-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_MODULO) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* il contrassegno col proprio pid: se sulla porta risponde un altro server,
   misurerei la copia di qualcun altro — ci si ferma */
const SEGNO = join(R, "__sentinella-evento-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-evento-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";

let ok = 0, ko = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
const testo = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };

/* il file dello strumento: tre eventi, il secondo con l'asse T vuoto. Le date
   sono nell'anno della dimostrazione, così il report «ultimi 12 mesi» li
   prende. Il 12/07 sul punto V1 (soglia 5 mm/s) resta entro soglia. */
const FILE = ["Date;Time;PPV L;PPV T;PPV V;PVS;Freq;Air",
  "02/08/2026;10:30;2,1;1,8;3,4;4,4;18;112",
  "03/08/2026;11:00;1,0;;2,0;2,3;20;110",
  "04/08/2026;09:15;0,5;0,5;0,5;0,9;24;108"].join("\n");

console.log(`\n════════ Sentinella · il file del sismografo a più colonne, incollato davvero${CONTROPROVA ? " · controprova" : ""} ════════`);

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

  // ── 1 · incollare il file: la finestra propone da sé le colonne ───────
  await pg.selectOption("#imp-punto", "v1");
  await pg.fill("#imp-testo", FILE);
  await pg.click("#btn-imp-leggi");
  await pg.waitForTimeout(600);
  const mappaVisibile = await pg.$eval("#imp-mappa", (e) => getComputedStyle(e).display !== "none").catch(() => false);
  dice(mappaVisibile, "letto il file, la finestra delle colonne si apre", mappaVisibile);
  const proposte = await pg.evaluate(() => ({
    data: document.getElementById("imp-col-data").value, ora: document.getElementById("imp-col-ora").value,
    valore: document.getElementById("imp-col-valore").value, valoreTesto: document.getElementById("imp-col-valore").selectedOptions[0]?.textContent || "",
    L: document.getElementById("imp-col-ppvl").value, T: document.getElementById("imp-col-ppvt").value, V: document.getElementById("imp-col-ppvv").value,
    f: document.getElementById("imp-col-freq").value, aria: document.getElementById("imp-col-aria").value,
    header: document.getElementById("imp-header").checked }));
  dice(proposte.data === "0" && proposte.ora === "1" && proposte.header, "data e ora proposte, e l'intestazione riconosciuta", proposte);
  dice(proposte.valore === "5" && /PVS/.test(proposte.valoreTesto), "⛔ il valore proposto è PVS (la risultante), non «PPV L» che contiene «ppv»", proposte);
  dice(proposte.L === "2" && proposte.T === "3" && proposte.V === "4" && proposte.f === "6" && proposte.aria === "7", "e i tre assi, la frequenza e l'aria sono proposti da soli", proposte);
  const eti = await pg.$$eval('label[for^="imp-col-ppv"], label[for="imp-col-freq"], label[for="imp-col-aria"]', (e) => e.map((l) => l.firstChild.textContent.trim()));
  dice(eti.length === 5 && /^PPV longitudinale/.test(eti[0]) && /^Sovrapressione/.test(eti[4]), "le cinque tendine hanno le etichette del mestiere", eti.join(" | "));
  const largo1 = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  dice(largo1, "con le cinque tendine in più la pagina non scorre in orizzontale");
  await pg.evaluate(() => document.getElementById("imp-col-ppvl")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-1-colonne-proposte`);

  // con PVS come valore l'anteprima porta l'evento sotto il numero
  const righe1 = await pg.$$eval("#imp-tab tbody tr", (e) => e.map((r) => ({ valore: r.cells[3].firstChild?.textContent.trim(), ev: (() => { const s = r.querySelector("small.ev"); if (!s) return ""; const c = s.cloneNode(true); c.querySelectorAll(".tag").forEach((t) => t.remove()); return c.textContent.replace(/\s+/g, " ").trim(); })(), stato: r.cells[4].textContent.trim() })));
  dice(righe1.length === 3 && righe1.every((r) => r.stato === "entra"), "con PVS come valore tutte e tre le righe entrano", JSON.stringify(righe1));
  dice(righe1[0]?.valore === "4,4" && righe1[0]?.ev === "L 2,1 · T 1,8 · V 3,4 · f 18 Hz · aria 112", "e la prima riga scrive l'evento sotto il numero: «L 2,1 · T 1,8 · V 3,4 · f 18 Hz · aria 112»", JSON.stringify(righe1[0]));
  dice(righe1[1]?.ev === "L 1 · T — · V 2 · f 20 Hz · aria 110", "l'asse T vuoto della seconda riga si scrive «—», non si salta", JSON.stringify(righe1[1]));

  // ── 2 · «nessuna: risultante dai tre assi» ─────────────────────────────
  await pg.selectOption("#imp-col-valore", "-1");
  await pg.waitForTimeout(500);
  const righe2 = await pg.$$eval("#imp-tab tbody tr", (e) => e.map((r) => ({ valore: r.cells[3].firstChild?.textContent.trim(), ev: (() => { const s = r.querySelector("small.ev"); if (!s) return ""; const c = s.cloneNode(true); c.querySelectorAll(".tag").forEach((t) => t.remove()); return c.textContent.replace(/\s+/g, " ").trim(); })(), stato: r.cells[4].textContent.trim(), ko: r.classList.contains("ko") })));
  dice(righe2[0]?.valore === "4,38" || righe2[0]?.valore === "4,383" || righe2[0]?.valore === "4,382921", "la prima riga vale la risultante √(2,1²+1,8²+3,4²) ≈ 4,38", JSON.stringify(righe2[0]));
  dice(/^risultante · L 2,1/.test(righe2[0]?.ev || ""), "e sotto il numero dice «risultante · L 2,1 …»", JSON.stringify(righe2[0]));
  dice(righe2[1]?.ko && /asse T non leggibile/.test(righe2[1]?.stato || "") && /2 assi su 3/.test(righe2[1]?.stato || ""), "⛔ la riga con l'asse T vuoto è SCARTATA: «asse T non leggibile: la risultante non si calcola con 2 assi su 3»", JSON.stringify(righe2[1]));
  const cifre = await pg.$$eval("#imp-riepilogo .imp-cifra", (e) => Object.fromEntries(e.map((c) => [c.querySelector(".k").textContent.trim(), c.querySelector(".v").textContent.trim()])));
  dice(cifre["Entrano"] === "2" && cifre["Scartate"] === "1", "il riepilogo conta 2 che entrano e 1 scartata", JSON.stringify(cifre));
  await pg.evaluate(() => document.getElementById("imp-tab")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-2-anteprima-risultante`);

  // ── 3 · confermare: la serie storica del punto porta l'evento ─────────
  await pg.click("#btn-imp-conferma");
  await pg.waitForTimeout(1200);
  const esitoImp = testo(await pg.$eval("#imp-esito", (e) => e.innerHTML).catch(() => ""));
  dice(/2 letture/.test(esitoImp) || /2 misure/.test(esitoImp) || /importat/.test(esitoImp), "confermato: l'esito dice che le letture sono entrate", esitoImp);
  /* l'import apre da sé la serie del punto importato («si vede subito
     l'andamento»): si clicca solo se è ancora chiusa, se no la si richiude */
  const giaAperta = await pg.$eval('[data-graf-mon="v1"]', (e) => e.getAttribute("aria-expanded") === "true").catch(() => false);
  dice(giaAperta, "dopo l'import la serie storica di V1 è già aperta da sola", giaAperta);
  if (!giaAperta) { await pg.click('[data-graf-mon="v1"]').catch(() => {}); await pg.waitForTimeout(600); }
  const righeV1 = await pg.$$eval("#graf-v1 table.tab tbody tr", (e) => e.map((r) => ({ data: r.cells[0].firstChild.textContent.trim(), valore: r.cells[1].firstChild?.textContent.trim(), ev: (() => { const s = r.querySelector("small.ev"); if (!s) return ""; const c = s.cloneNode(true); c.querySelectorAll(".tag").forEach((t) => t.remove()); return c.textContent.replace(/\s+/g, " ").trim(); })() }))).catch(() => []);
  const r0208 = righeV1.find((r) => r.data === "02/08/2026");
  dice(!!r0208 && /^risultante · L 2,1 · T 1,8 · V 3,4 · f 18 Hz · aria 112$/.test(r0208.ev), "⛔ nella serie storica di V1 la lettura del 02/08 porta la riga dell'evento sotto il valore", JSON.stringify(r0208 || righeV1.slice(0, 2)));
  dice(righeV1.filter((r) => r.ev).length === 2 && righeV1.filter((r) => !r.ev).length >= 4, "le due letture importate hanno l'evento, quelle della dimostrazione no", JSON.stringify(righeV1.map((r) => [r.data, !!r.ev])));
  /* la frequenza fuori dalla banda della soglia (04/09): V1 nasce dal preset
     «residenziale, <10 Hz» e la lettura del 02/08 è a 18 Hz — il tag lo dice,
     con la ragione nel title e senza un limite inventato; quella del 04/08 è a
     24 Hz, quindi anch'essa fuori: due tag su due letture con la frequenza */
  const tagFb = await pg.$$eval("#graf-v1 table.tab tbody tr", (e) => e.map((r) => ({ data: r.cells[0].firstChild.textContent.trim(), fb: r.querySelector("small.ev .tag.fb")?.textContent.trim() || "", title: r.querySelector("small.ev .tag.fb")?.getAttribute("title") || "" })).filter((r) => r.fb)).catch(() => []);
  dice(tagFb.length === 2 && tagFb.every((r) => r.fb === "fuori banda") && tagFb.some((r) => r.data === "02/08/2026" && /^f 18 Hz: fuori dalla banda della soglia \(sotto 10 Hz\), e il limite di quella banda non è in Sentinella$/.test(r.title)), "⛔ le letture a 18 e 24 Hz portano «fuori banda» (la soglia di V1 vale sotto i 10 Hz), con la ragione nel title e senza un limite inventato", JSON.stringify(tagFb));
  const dentro = await pg.evaluate(() => {
    const t = document.querySelector("#graf-v1 table.tab"); if (!t) return null;
    const box = t.parentElement.getBoundingClientRect();
    const ev = [...t.querySelectorAll("small.ev")].map((s) => { const r = s.getBoundingClientRect(); return { larg: Math.round(r.width), destra: r.right <= box.right + 0.5, righe: Math.round(r.height / parseFloat(getComputedStyle(s).lineHeight)) }; });
    return { scorre: t.parentElement.scrollWidth > t.parentElement.clientWidth + 1, ev };
  });
  dice(!!dentro && !dentro.scorre && dentro.ev.every((e) => e.destra), "⛔ la riga dell'evento va a capo DENTRO la cella: la tabella non scorre nel suo riquadro", JSON.stringify(dentro));
  await pg.evaluate(() => document.querySelector("#graf-v1 table.tab")?.scrollIntoView({ block: "center" }));
  await scatta(pg, `${W}-3-serie-con-evento`);

  // ── 4 · il report dichiara le colonne dello strumento ─────────────────
  await pg.click("#nav-rep").catch(() => {});
  await pg.waitForTimeout(400);
  await pg.click("#btn-rep-anno").catch(() => {});
  await pg.waitForTimeout(900);
  const punti = await pg.$$eval("#rep-doc .rep-punto", (e) => e.map((p) => ({ tit: p.querySelector(".rep-punto-tit")?.textContent.trim(), meta: p.querySelector(".rep-punto-meta")?.textContent.replace(/\s+/g, " ").trim() || "", ev: [...p.querySelectorAll("small.ev")].map((s) => { const c = s.cloneNode(true); c.querySelectorAll(".tag").forEach((t) => t.remove()); return c.textContent.replace(/\s+/g, " ").trim(); }) })));
  const pv1 = punti.find((p) => /V1/.test(p.tit || ""));
  dice(!!pv1 && /Colonne dello strumento: 2 letture su \d+ portano le colonne in più del file \(assi, frequenza, sovrapressione\)/.test(pv1.meta), "il report di V1 dichiara «Colonne dello strumento: 2 letture su N portano le colonne in più»", pv1 && pv1.meta.slice(0, 500));
  dice(!!pv1 && /Valore di conformità: la risultante dai tre assi √\(L²\+T²\+V²\) per 2 letture, la colonna scelta nel file per le altre\./.test(pv1.meta), "e da dove viene il numero che giudica: la risultante per le 2 importate, la colonna per le altre", pv1 && pv1.meta.slice(0, 500));
  dice(!!pv1 && /La sovrapressione è nell'unità del file dello strumento\./.test(pv1.meta), "e che la sovrapressione è nell'unità del file: l'app non ne inventa una", pv1 && pv1.meta.slice(0, 500));
  dice(!!pv1 && /2 letture hanno la frequenza fuori dalla banda della soglia applicata \(sotto 10 Hz\): il limite di quella banda non è in Sentinella e va verificato sulla norma\./.test(pv1.meta), "⛔ e il report dichiara le due letture con la frequenza fuori banda, rimandando alla norma per il limite", pv1 && pv1.meta.slice(0, 700));
  dice(!!pv1 && pv1.ev.length === 2 && pv1.ev.every((e) => /^risultante · L /.test(e)), "le due letture del report portano la riga dell'evento", JSON.stringify(pv1 && pv1.ev));
  const altri = punti.filter((p) => !/V1/.test(p.tit || ""));
  dice(altri.length >= 1 && altri.every((p) => !/Colonne dello strumento/.test(p.meta) && p.ev.length === 0), "⛔ sugli altri punti (polveri, rumore, V2) non si dichiara niente: non c'è niente da dichiarare", JSON.stringify(altri.map((p) => p.tit)));
  await pg.evaluate(() => [...document.querySelectorAll("#rep-doc .rep-punto")].find((p) => /V1/.test(p.textContent))?.scrollIntoView({ block: "start" }));
  await scatta(pg, `${W}-4-report`);

  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  const largo = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  dice(largo, "la pagina non scorre in orizzontale");
  await pg.close();
}

await b.close();
srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_MODULO.length}`);
  if (colpiti.size !== DIFETTI_MODULO.length) {
    console.error("✗ il difetto non ha trovato il suo pezzo di modulo: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

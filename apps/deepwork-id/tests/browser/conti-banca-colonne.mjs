/* CONTI · IL FILE DELLA BANCA NELLE SUE FORME VERE, CARICATO DAVVERO
   ─────────────────────────────────────────────────────────────────
   Uso:
     node conti-banca-colonne.mjs [--porta=8667] [--scatti=/cartella]
     node conti-banca-colonne.mjs --controprova     (DEVE fallire)

   PERCHÉ ESISTE. Ogni banca esporta le colonne dei movimenti a modo suo, e
   fino al 05/09 Conti le leggeva per POSIZIONE: sulla forma più citata dai
   manuali degli importatori («Data operazione; Descrizione; Importo entrate;
   Importo uscite; Saldo progressivo; Causale ABI») il bonifico da 12.300 €
   entrava come −45.210,77 € — il SALDO letto come uscita — senza nessuno
   scarto. Qui si caricano due file veri dal bottone della pagina, a 320 e
   390 px, e si legge quello che la pagina scrive: l'esito dice le colonne
   riconosciute e quelle lasciate fuori, il riepilogo porta l'importo giusto,
   e il movimento si abbina alla fattura perché la descrizione è arrivata.
   La controprova rimette nel modulo la lettura per posizione: il banco
   deve cadere. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8667;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const DIFETTI_MODULO = [
  ["  const perNome = !!(m && m.conIntestazione);",
   "  const perNome = false;   /* difetto rimesso dal banco: la posizione di sempre */"],
  ["      riferimento: riferimentoMovimento(rifCol, nomeRif, descr),",
   "      riferimento: null,   /* difetto rimesso dal banco: il TRN/CRO buttato via */"],
];
const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/conti/conti-data.js")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_MODULO) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__conti-banca-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__conti-banca-${process.pid}`)).text();
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

/* i due file, nella forma in cui escono dalle banche: la fattura 2026/031 di
   Edilcave sta nella dimostrazione, quindi il bonifico si può abbinare */
const FILE_B = { name: "movimenti_banca.csv", mimeType: "text/csv", buffer: Buffer.from(
  "Data operazione;Descrizione movimento;Importo entrate;Importo uscite;Saldo progressivo;Causale ABI\n"
  + "12/07/2026;BONIFICO DA EDILCAVE SRL FT 2026/031;12.300,00;;45.210,77;48\n"
  + "13/07/2026;PAGAMENTO F24;;1.250,00;43.960,77;19\n", "utf8") };
const FILE_C = { name: "estratto_dare_avere.csv", mimeType: "text/csv", buffer: Buffer.from(
  "Data contabile;Data valuta;Dare;Avere;Descrizione\n"
  + "12/07/2026;12/07/2026;;12.300,00;BONIFICO DA EDILCAVE SRL FT 2026/031\n", "utf8") };

/* il terzo file (05/09): la colonna del TRN, e un CRO scritto dentro la
   causale — le due strade da cui arriva la chiave della banca */
const FILE_D = { name: "lista_movimenti.csv", mimeType: "text/csv", buffer: Buffer.from(
  "Data;Valuta;Descrizione;TRN;Entrate;Uscite\n"
  + "12/07/2026;12/07/2026;BONIFICO DA EDILCAVE SRL FT 2026/031;0512345678901234567890123456IT;12.300,00;\n"
  + "13/07/2026;13/07/2026;PAGAMENTO F24;;;1.250,00\n"
  + "14/07/2026;14/07/2026;BONIFICO CRO 12345678901 A NS FAVORE;;500,00;\n", "utf8") };

console.log(`\n════════ Conti · il file della banca nelle sue forme vere, caricato davvero${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/conti/index.html?demo=1`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-ban").catch(() => {});
  await pg.waitForTimeout(600);
  const viste = await pg.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-ban", `navigato davvero nella Banca (${viste.join(",") || "nessuna"})`, viste);

  const carica = async (file) => { await pg.setInputFiles("#ban-file", file); await pg.waitForTimeout(900); };
  const leggi = () => pg.evaluate(() => ({
    esito: document.getElementById("ban-esito")?.innerText.replace(/\s+/g, " ").trim() || "",
    riep: document.getElementById("ban-riep")?.innerText.replace(/\s+/g, " ").trim() || "",
    righe: [...document.querySelectorAll("#ban-conferma .item, #ban-decidere .item, #ban-fuori .item")].map((i) => i.innerText.replace(/\s+/g, " ").trim()),
  }));

  // ── 1 · la forma «entrate; uscite; saldo; causale ABI» ──────────────────
  await carica(FILE_B);
  let s = await leggi();
  dice(/Letti 2 movimenti/.test(s.esito), "il file con entrate, uscite e saldo si legge: 2 movimenti", s.esito);
  dice(/Colonne riconosciute: .*data ← «Data operazione».*entrate ← «Importo entrate».*uscite ← «Importo uscite».*descrizione ← «Descrizione movimento»/.test(s.esito), "⛔ l'esito dice da quali colonne vengono data, entrate, uscite e descrizione", s.esito);
  dice(/lasciate fuori di proposito: «Saldo progressivo», «Causale ABI»/.test(s.esito), "⛔ e che il saldo e la causale ABI sono lasciati fuori di proposito", s.esito);
  dice(/1 in entrata · 1 in uscita/.test(s.riep), "il riepilogo conta un'entrata e un'uscita", s.riep);
  const bonifico = s.righe.find((r) => /EDILCAVE/.test(r)) || "";
  dice(/12\.300,00/.test(bonifico) && !/45\.210,77/.test(bonifico) && !/-\s?45\.210/.test(s.righe.join(" ")), "⛔ il bonifico vale 12.300,00 — non −45.210,77, che è il saldo", bonifico || s.righe.join(" | "));
  dice(/2026\/031/.test(bonifico) && !/Non abbinati/.test((s.righe.find((r) => /EDILCAVE/.test(r)) || "")) && (await pg.$$eval("#ban-conferma .item", (e) => e.length)) >= 1, "e si abbina alla fattura 2026/031 perché la descrizione è arrivata intera", bonifico);
  await pg.evaluate(() => document.getElementById("ban-esito")?.scrollIntoView({ block: "start" }));
  await scatta(pg, `${W}-1-entrate-uscite-saldo`);

  // ── 2 · la forma «dare; avere; descrizione in fondo» ────────────────────
  await pg.click("#btn-ban-pulisci").catch(() => {}); await pg.waitForTimeout(400);
  await carica(FILE_C);
  s = await leggi();
  dice(/Letti 1 movimento|Letto 1 movimento/.test(s.esito), "il file dare/avere con la descrizione in fondo si legge: 1 movimento", s.esito);
  dice(/uscite ← «Dare».*entrate ← «Avere»|entrate ← «Avere».*uscite ← «Dare»/.test(s.esito) && /descrizione ← «Descrizione»/.test(s.esito), "l'esito dice che Dare sono le uscite, Avere le entrate, e dove sta la descrizione", s.esito);
  const bon2 = s.righe.find((r) => /EDILCAVE/.test(r)) || "";
  dice(/12\.300,00/.test(bon2) && /2026\/031/.test(bon2), "⛔ il movimento porta la descrizione (prima usciva vuota) e si abbina alla fattura", bon2 || s.righe.join(" | "));
  await scatta(pg, `${W}-2-dare-avere`);

  // ── 3 · il riferimento della banca: dalla colonna TRN, e dalla causale ──
  await pg.click("#btn-ban-pulisci").catch(() => {}); await pg.waitForTimeout(400);
  await carica(FILE_D);
  s = await leggi();
  dice(/Letti 3 movimenti/.test(s.esito) && /riferimento ← «TRN»/.test(s.esito), "il file con la colonna TRN si legge, e l'esito dice che la colonna è stata riconosciuta", s.esito);
  const rif = await pg.$$eval(".ban-rif", (e) => e.map((x) => x.innerText.replace(/\s+/g, " ").trim()));
  dice(rif.length === 2, `⛔ due movimenti su tre portano un riferimento: ${rif.length} righe (l'F24 non ne ha, e non scrive un «—»)`, rif);
  dice(rif.some((r) => /^TRN 0512345678901234567890123456IT \(dalla colonna del file\)$/.test(r)), "⛔ il TRN letto dalla colonna, con scritto da dove viene", rif);
  dice(rif.some((r) => /^CRO 12345678901 \(letto nella causale\)$/.test(r)), "⛔ e il CRO pescato dalla causale, dichiarato come tale", rif);
  const f24 = s.righe.find((r) => /F24/.test(r)) || "";
  dice(f24 && !/TRN|CRO|—/.test(f24.replace(/—\s*$/, "")) && !/riferimento/i.test(f24), "la riga senza riferimento non ne inventa uno", f24);
  const rifLargo = await pg.$$eval(".ban-rif", (e) => e.map((x) => x.scrollWidth <= x.clientWidth + 1));
  dice(rifLargo.every(Boolean), "le trenta cifre del TRN stanno nella riga anche a schermo stretto", rifLargo);
  /* lo scatto inquadra la riga col riferimento, e aspetta che il toast se ne
     vada: uno scatto che mostra l'esito e non il soggetto non prova niente */
  await pg.evaluate(() => document.querySelector(".ban-rif")?.scrollIntoView({ block: "center" }));
  await pg.waitForTimeout(3600);
  await scatta(pg, `${W}-3-riferimento`);

  const largo = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  dice(largo, "la pagina non scorre in orizzontale");
  dice(errori.length === 0, "la pagina non ha sollevato errori in tutto il giro", errori[0]);
  await pg.close();
}
await b.close(); srv.close();

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_MODULO.length}`);
  if (colpiti.size !== DIFETTI_MODULO.length) { console.error("✗ il difetto non ha trovato il suo pezzo di modulo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

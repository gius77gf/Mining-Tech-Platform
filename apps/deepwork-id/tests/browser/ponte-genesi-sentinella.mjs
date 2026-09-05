/* ══════════════════════════════════════════════════════════════════════════
   IL PONTE 3e, PREMUTO DAVVERO: GENESI → SENTINELLA SENZA IL FILE (05/09)
   ──────────────────────────────────────────────────────────────────────────
   Due pagine nello STESSO browser (stesso contesto, stessa chiave): in Genesi
   si preme «per Sentinella» e la volata prevista finisce, oltre che nel file,
   nella collezione `previste` (qui: la chiave `genesiPreviste`); in Sentinella
   il registro volate mostra «Previste da Genesi», si preme «accogli» e la
   volata entra come PREVISTA con gli stessi numeri. Riesportare lo stesso
   progetto non la raddoppia; accolta, sparisce dalle nuove.
   La controprova rimette due difetti, applicati PER FILE: Genesi che non
   scrive più nella collezione, e Sentinella che confronta una lista vuota.
   ══════════════════════════════════════════════════════════════════════════ */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8625;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const GENESI = "apps/genesi/genesi.html", SENTINELLA = "apps/sentinella/index.html";

const DIFETTI = [
  /* 1 · Genesi non scrive più nella collezione: resta solo il file */
  ["if(!gia) await GDB.aggiungi('previste',rec); inOrg=true;", "inOrg=true;   /* difetto rimesso dal banco */", GENESI],
  /* 2 · Sentinella confronta una lista vuota: nessuna prevista arriva mai */
  ["const pn = previsteNuove(PREV, VOL);", "const pn = previsteNuove([], VOL);   /* difetto rimesso dal banco */", SENTINELLA],
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
  if (CONTROPROVA) for (const file of [GENESI, SENTINELLA]) if (p.endsWith(file)) corpo = Buffer.from(applica(corpo.toString("utf8"), file), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__ponte-genesi-sentinella-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__ponte-genesi-sentinella-${process.pid}`)).text();
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

console.log(`\n════════ il ponte 3e · Genesi → Sentinella senza il file, premuto davvero${CONTROPROVA ? " · controprova" : ""} ════════`);
for (const W of [320, 390]) {
  console.log(`\n· a ${W} px`);
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  const errori = [];

  // ── 1 · Genesi: «per Sentinella» scrive anche nella collezione ─────────
  const g = await ctx.newPage(); g.on("pageerror", (e) => errori.push("genesi: " + e.message));
  await g.goto(`http://127.0.0.1:${PORTA}/apps/genesi/genesi.html`); await g.waitForTimeout(3000);
  await g.evaluate(() => { HTMLAnchorElement.prototype.click = function () { window.__scaricati = (window.__scaricati || []).concat([this.download]); }; });
  await g.evaluate(() => document.getElementById("sentOpen")?.click()); await g.waitForTimeout(600);
  await g.evaluate(() => { const d = document.getElementById("sent-data"); d.value = "2026-09-12"; d.dispatchEvent(new Event("change")); const f = document.getElementById("sent-fronte"); f.value = "Fronte Nord"; f.dispatchEvent(new Event("change")); });
  await g.evaluate(() => document.getElementById("sentExport")?.click()); await g.waitForTimeout(1200);
  const g1 = await g.evaluate(() => ({ toast: document.getElementById("toast")?.textContent.trim() || "", file: (window.__scaricati || []).join(","), chiave: JSON.parse(localStorage.getItem("genesiPreviste") || "[]") }));
  dice(/genesi_volata_per_sentinella_2026-09-12\.csv/.test(g1.file), "il file esce come sempre", g1.file);
  dice(g1.chiave.length === 1 && g1.chiave[0].data === "2026-09-12" && g1.chiave[0].fronte === "Fronte Nord" && /^GEN-20260912-/.test(g1.chiave[0].codiceVolata || ""), "⛔ e la volata prevista è scritta nella collezione (qui la chiave del browser), col codice", JSON.stringify(g1.chiave));
  dice(g1.chiave[0] && g1.chiave[0].stato === "prevista" && g1.chiave[0].origine && g1.chiave[0].origine.app === "genesi", "con lo stato «prevista» e l'origine dichiarata", JSON.stringify(g1.chiave[0] && g1.chiave[0].origine));
  dice(/Previste da Genesi/.test(g1.toast), "e il toast dice dove Sentinella la trova", g1.toast);
  await g.evaluate(() => document.getElementById("sentExport")?.click()); await g.waitForTimeout(900);
  const g2 = await g.evaluate(() => JSON.parse(localStorage.getItem("genesiPreviste") || "[]").length);
  dice(g2 === 1, "riesportare lo stesso progetto non la raddoppia (stesso codice)", g2);
  await scatta(g, `${W}-1-genesi-export`);

  // ── 2 · Sentinella, stesso browser: la vede e la accoglie ───────────────
  const s = await ctx.newPage(); s.on("pageerror", (e) => errori.push("sentinella: " + e.message));
  await s.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`); await s.waitForTimeout(2500);
  await s.click("#nav-reg").catch(() => {}); await s.waitForTimeout(600);
  const viste = await s.$$eval(".page", (e) => e.filter((x) => getComputedStyle(x).display !== "none").map((x) => x.id));
  dice(viste.length === 1 && viste[0] === "page-reg", `navigato davvero nei Registri (${viste.join(",") || "nessuna"})`);
  const prima = await s.evaluate(() => ({ testo: document.getElementById("vol-previste").innerText.replace(/\s+/g, " ").trim(), n: document.querySelectorAll("#vol-previste [data-accogli-prev]").length, tot: document.getElementById("vol-tot").textContent.trim(), righe: document.querySelectorAll("#vol-list .item").length }));
  dice(prima.n === 1 && /Previste da Genesi/i.test(prima.testo), "⛔ il registro mostra «Previste da Genesi» con una volata da accogliere", prima.testo.slice(0, 200));
  dice(/Fronte Nord · 12\/09\/2026/.test(prima.testo) && /12 fori · 720 kg · max\/ritardo 60 kg · ricettore a 300 m/.test(prima.testo) && /PPV prevista 6,6 mm\/s/.test(prima.testo), "con gli stessi numeri del progetto: fori, chili, MIC, distanza, PPV prevista", prima.testo.slice(0, 300));
  dice(/non conta fra le eseguite/.test(prima.testo), "e la nota dice che è un progetto, non una volata sparata", prima.testo.slice(0, 300));
  const forma = await s.evaluate(() => { const it = document.querySelector("#vol-previste .item"); return it ? { avatar: !!it.querySelector(".avatar"), info: !!it.querySelector(".info .name") && !!it.querySelector(".info .meta"), acts: !!it.querySelector(".acts .badge") && !!it.querySelector(".acts button.arr") } : null; });
  dice(!!forma && forma.avatar && forma.info && forma.acts, "la riga ha la forma delle righe del registro (avatar · info · acts)", JSON.stringify(forma));
  await s.evaluate(() => document.getElementById("vol-previste")?.scrollIntoView({ block: "center" }));
  await scatta(s, `${W}-2-sentinella-previste`);
  await s.evaluate(() => document.querySelector("#vol-previste [data-accogli-prev]")?.click()); await s.waitForTimeout(1200);
  const dopo = await s.evaluate(() => ({ esito: document.getElementById("vol-esito-msg").innerText.trim(), blocco: document.getElementById("vol-previste").innerText.trim(), tot: document.getElementById("vol-tot").textContent.trim(), righe: [...document.querySelectorAll("#vol-list .item")].map((x) => x.innerText.replace(/\s+/g, " ")).filter((t) => /12\/09\/2026/.test(t)) }));
  dice(/accolta nel registro da Genesi/.test(dopo.esito) && /è un progetto, non una volata sparata/.test(dopo.esito), "accolta: la striscia lo dice, e dice che cosa è", dopo.esito);
  dice(dopo.blocco === "", "e la lista delle nuove si svuota: quella accolta non si ripropone", dopo.blocco.slice(0, 120));
  dice(dopo.righe.length === 1 && /Prevista/i.test(dopo.righe[0]) && /PPV prevista 6,6 mm\/s/.test(dopo.righe[0]), "nel registro c'è, come PREVISTA, con la PPV prevista", JSON.stringify(dopo.righe));
  dice(dopo.tot === prima.tot, "⛔ il conto delle volate ESEGUITE non cambia: un progetto non è una volata sparata", `${prima.tot} → ${dopo.tot}`);
  await scatta(s, `${W}-3-sentinella-accolta`);
  dice(errori.length === 0, "nessuna delle due pagine ha sollevato errori", errori[0]);
  await ctx.close();
}
await b.close(); srv.close();
if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI.length}`);
  if (colpiti.size !== DIFETTI.length) { console.error("✗ un difetto non ha trovato il suo pezzo: l'iniezione non inietta."); process.exit(2); }
  console.log(ko > 0 ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).` : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO`);
process.exit(ko > 0 ? 1 : 0);

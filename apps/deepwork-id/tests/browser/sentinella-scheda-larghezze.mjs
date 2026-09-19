/* SENTINELLA · LA SCHEDA DEL PUNTO STA NELLA SUA LARGHEZZA
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-scheda-larghezze.mjs [--porta=8617]
     node sentinella-scheda-larghezze.mjs --controprova   (DEVE fallire)
     node sentinella-scheda-larghezze.mjs --scatti=/dove/metterli

   PERCHÉ ESISTE. Il 04/09, negli scatti di un altro cantiere, la scheda del
   punto (Monitoraggi → un punto → `#graf-<id>`) mostrava due difetti che
   nessun banco misurava, e tutt'e due erano «un numero che non si sa leggere»:
   1. il quadrante dei KPI (`.graf-stat .v`) aveva `white-space:nowrap;
      overflow:hidden; text-overflow:ellipsis`: a 320 px la cella è larga 53
      e «44,2 µg/m³» ne chiede 58 con Barlow (68 col carattere di ripiego dei
      banchi) — sullo schermo restava «44,2 …», cioè l'UNITÀ sparita. Un numero
      senza unità in un'app ambientale non si sa leggere. PM10 troncava anche a
      390 (64,3 in 61);
   2. «Le ultime misure, e da dove vengono» chiedeva 323-341 px in un riquadro
      da 270: scorreva nel suo `.tab-wrap` — ammesso — ma le pillole della
      provenienza, il dato per cui la tabella esiste, restavano tagliate alla
      vista e niente diceva che si poteva scorrere.

   LE DOMANDE, a 320 · 360 · 390 · 430 px e nei tre temi, su OGNI punto della
   dimostrazione che abbia una scheda (i valori più lunghi sono i peggiori):
   · nessun `.v` tronca (scrollWidth ≤ clientWidth) e nessuno ha più l'ellissi;
   · ogni nodo di testo del quadrante sta dentro la propria cella (`Range`,
     non `querySelectorAll`: l'unità è un `<small>`, il numero è testo nudo);
   · l'unità c'è ancora, ed è quella del punto (letta dall'intestazione della
     tabella): la correzione non deve aver cambiato i numeri;
   · la tabella sta nel suo riquadro (nessuno scorrimento) e ogni pillola
     della provenienza è tutta dentro la parte VISIBILE del riquadro;
   · i bottoni delle azioni restano bersagli da 44 px.

   ⚠️ I banchi misurano col carattere di ripiego (DejaVu Sans, senza rete
   Barlow non arriva): è PIÙ LARGO di Barlow Condensed, quindi qui la misura è
   il caso peggiore. Con Barlow (misurato una volta servendo i font in locale)
   i margini sono maggiori, mai minori.

   LA CONTROPROVA rimette i tre pezzi del difetto nella pagina servita: l'ellissi
   su `.v`, l'ora come colonna a sé, e il `min-width:74px` sulla colonna delle
   azioni. Allora il quadrante tronca e la tabella scorre, e il banco deve
   cadere. Si CONTA che ogni pezzo abbia trovato il suo posto: un `replace` che
   non trova niente lascia la pagina sana e la controprova «non distingue».

   ⚠️ Una scheda che non si apre NON è una scheda a posto: si dichiara NON
   MISURATA e il banco esce diverso da zero. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8617;
const SCATTI = (process.argv.find((a) => a.startsWith("--scatti=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* IL DIFETTO DA RIMETTERE, nella pagina: [cerca, sostituisci]. */
const DIFETTI_PAGINA = [
  // 1 · l'ellissi sul numerone
  ["  white-space:normal; overflow-wrap:anywhere;\n}",
   "  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\n}"],
  // 2 · l'ora come colonna a sé (era il costo di 42 px)
  ["        <td>${fmtD(l.data)}<small>${esc(l.ora || \"—\")}</small></td>",
   "        <td>${fmtD(l.data)}</td><td>${esc(l.ora || \"—\")}</td>"],
  ["<thead><tr><th>Data e ora</th><th>Valore ",
   "<thead><tr><th>Data</th><th>Ora</th><th>Valore "],
  // 3 · la colonna delle azioni larga come l'ESITO del report
  [".tab td.az{min-width:0}", ".tab td.az{min-width:74px}"],
];

const colpiti = new Set();
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p.endsWith("apps/sentinella/index.html")) {
    let t = corpo.toString("utf8");
    for (const [a, b] of DIFETTI_PAGINA) if (t.includes(a)) { colpiti.add(a); t = t.split(a).join(b); }
    corpo = Buffer.from(t, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });

/* il contrassegno col proprio pid: se sulla porta risponde un altro server,
   misurerei la copia di qualcun altro — ci si ferma */
const SEGNO = join(R, "__sentinella-scheda-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__sentinella-scheda-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) {
    console.error(`✗ sulla porta ${PORTA} risponde un ALTRO server: misurerei la sua copia.`);
    process.exit(2);
  }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const CART = SCATTI ? (mkdirSync(SCATTI, { recursive: true }), SCATTI) : "";

let ok = 0, ko = 0, nonMisurati = 0;
const dice = (c, t, x) => {
  if (c) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 400))}` : ""}`); }
};
const scatta = async (pg, nome) => { if (CART) await pg.screenshot({ path: join(CART, nome + (CONTROPROVA ? "-CONTROPROVA" : "") + ".png"), fullPage: false }).catch(() => {}); };

/* i punti della dimostrazione: si leggono dalla pagina, non si scrivono qui —
   un punto nuovo entra da solo. Quelli senza letture non hanno il quadrante
   (stato vuoto) e si dichiarano. */
const TEMI = [["scuro", null], ["chiaro", "chiaro"], ["sole", "sole"]];
const den = { v: 0, testi: 0, tabelle: 0, pillole: 0, bottoni: 0, schede: 0 };
const m0 = (n) => n;

console.log(`\n════════ Sentinella · la scheda del punto sta nella sua larghezza${CONTROPROVA ? " · controprova" : ""} ════════`);

for (const W of [320, 360, 390, 430]) {
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/sentinella/index.html`);
  await pg.waitForTimeout(2300);
  await pg.click("#nav-mon").catch(() => {});
  await pg.waitForTimeout(500);
  const ids = await pg.$$eval("[data-graf-mon]", (e) => e.map((x) => x.getAttribute("data-graf-mon")));
  console.log(`\n· a ${W} px — ${ids.length} punti: ${ids.join(", ")}`);
  for (const [tema, t] of TEMI) {
    await pg.evaluate((t) => { if (window.dwTema) window.dwTema(t || "scuro"); }, t);
    await pg.waitForTimeout(150);
    const classe = await pg.evaluate(() => document.body.className);
    if (tema !== "scuro") dice(classe.includes(tema === "chiaro" ? "light-mode" : "outdoor-mode"), `${W} · tema ${tema} applicato davvero (body.${classe.trim().split(/\s+/).join(".")})`, classe);
    const esiti = { tronca: [], fuori: [], senzaUnita: [], scorre: [], pilloleTagliate: [], testiTagliati: [], bottoniPiccoli: [], bottoniFuori: [], vuote: [] };
    let nV = 0, nTesti = 0, nTab = 0, nPill = 0, nBtn = 0;
    for (const id of ids) {
      const aperto = await pg.$eval(`[data-graf-mon="${id}"]`, (e) => e.getAttribute("aria-expanded")).catch(() => null);
      if (aperto !== "true") { await pg.click(`[data-graf-mon="${id}"]`).catch(() => {}); await pg.waitForTimeout(450); }
      const m = await pg.evaluate((id) => {
        const g = document.getElementById("graf-" + id);
        if (!g) return null;
        const stats = g.querySelector(".graf-stats");
        if (!stats) return { vuota: true };
        const rangeDi = (n) => { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect(); };
        const dentro = (rr, box) => rr.width === 0 || (rr.left >= box.left - 0.5 && rr.right <= box.right + 0.5);
        const unitaTab = ((g.querySelector(".tab th .u") || {}).textContent || "").replace(/^\(|\)$/g, "").trim();
        const v = [...g.querySelectorAll(".graf-stat .v")].map((el) => {
          const cs = getComputedStyle(el), box = el.getBoundingClientRect();
          const testi = []; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
          while ((n = tw.nextNode())) if (n.textContent.trim()) testi.push({ t: n.textContent.trim(), dentro: dentro(rangeDi(n), box) });
          const small = el.querySelector("small");
          return { k: el.previousElementSibling.textContent, testo: el.textContent.trim(), cella: el.clientWidth, scroll: el.scrollWidth,
            tronca: el.scrollWidth > el.clientWidth + 0.5 || cs.textOverflow === "ellipsis" || cs.whiteSpace === "nowrap",
            testi, unita: small ? small.textContent.trim() : "" };
        });
        const wrap = g.querySelector(".tab-wrap"), tab = g.querySelector("table.tab");
        let tabella = null;
        if (wrap && tab) {
          const wb = wrap.getBoundingClientRect();
          const visibile = { left: wb.left, right: wb.left + wrap.clientWidth };
          const pillole = [...tab.querySelectorAll(".tag")].map((p) => ({ t: p.textContent.trim(), dentro: dentro(p.getBoundingClientRect(), visibile) }));
          const bottoni = [...tab.querySelectorAll(".arr")].map((x) => { const r = x.getBoundingClientRect(); return { w: r.width, h: r.height, inVista: Math.min(r.right, visibile.right) - Math.max(r.left, visibile.left) }; });
          const testiTab = []; { const tw = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT); let n;
            while ((n = tw.nextNode())) if (n.textContent.trim()) testiTab.push({ t: n.textContent.trim().slice(0, 30), dentro: dentro(rangeDi(n), visibile) }); }
          // il margine vero: quanto chiede la tabella lasciata libera di stringersi
          const w0 = tab.style.width; tab.style.width = "min-content"; const minimo = tab.getBoundingClientRect().width; tab.style.width = w0;
          tabella = { riquadro: wrap.clientWidth, chiede: tab.scrollWidth, minimo: +minimo.toFixed(1), scorre: tab.scrollWidth > wrap.clientWidth + 0.5, pillole, bottoni, testiTab,
            colonne: [...tab.querySelectorAll("thead th")].map((th) => th.textContent.trim()) };
        }
        return { v, unitaTab, tabella };
      }, id);
      if (!m) { esiti.vuote.push(id + " (nessun #graf)"); continue; }
      if (m.vuota) { esiti.vuote.push(id); continue; }
      den.schede++;
      for (const c of m.v) {
        nV++;
        if (c.tronca) esiti.tronca.push(`${id} ${c.k} «${c.testo}» ${c.scroll}/${c.cella}`);
        for (const tx of c.testi) { nTesti++; if (!tx.dentro) esiti.fuori.push(`${id} ${c.k} «${tx.t}»`); }
        if (c.k !== "Oltre" && m.unitaTab && c.unita !== m.unitaTab) esiti.senzaUnita.push(`${id} ${c.k} «${c.testo}» (unità del punto: ${m.unitaTab})`);
      }
      if (m.tabella) {
        nTab++;
        if (m.tabella.scorre) esiti.scorre.push(`${id} chiede ${m.tabella.chiede} (minimo ${m.tabella.minimo}) in ${m.tabella.riquadro}`);
        for (const p of m.tabella.pillole) { nPill++; if (!p.dentro) esiti.pilloleTagliate.push(`${id} «${p.t}»`); }
        for (const bt of m.tabella.bottoni) { nBtn++; if (bt.w < 44 || bt.h < 44) esiti.bottoniPiccoli.push(`${id} ${bt.w}×${bt.h}`); if (bt.inVista < 44) esiti.bottoniFuori.push(`${id} ${bt.inVista.toFixed(1)} px in vista su ${bt.w}`); }
        for (const tx of m.tabella.testiTab) { if (!tx.dentro) esiti.testiTagliati.push(`${id} «${tx.t}»`); }
        if (tema === "scuro" && (id === "p1" || id === "v2")) console.log(`      ${id}: tabella ${m.tabella.minimo} px al minimo in ${m.tabella.riquadro} · colonne ${m.tabella.colonne.join(" | ")}`);
      }
      if (CART && (W === 320 || W === 390) && tema === "scuro" && (id === "p1" || id === "v2")) {
        await pg.$eval(`#graf-${id}`, (e) => e.scrollIntoView({ block: "start" })).catch(() => {});
        await pg.waitForTimeout(150);
        await scatta(pg, `${W}-${id}`);
      }
    }
    den.v += nV; den.testi += nTesti; den.tabelle += nTab; den.pillole += nPill; den.bottoni += nBtn;
    const P = `${W} · ${tema}`;
    if (nV === 0) { nonMisurati++; console.log(`  NON MISURATO  ${P}: nessuna scheda con quadrante si è aperta (${ids.length} punti)`); continue; }
    dice(esiti.tronca.length === 0, `${P} · nessun numerone del quadrante tronca né porta l'ellissi (${nV} celle)`, esiti.tronca.join(" | "));
    dice(esiti.fuori.length === 0, `${P} · ogni testo del quadrante sta nella sua cella (${nTesti} nodi di testo, col Range)`, esiti.fuori.join(" | "));
    dice(esiti.senzaUnita.length === 0, `${P} · l'unità c'è ancora ed è quella del punto (${nV} celle)`, esiti.senzaUnita.join(" | "));
    /* ⚠️ Nel tema del SOLE i bottoni sono da 60 px (`--tap`), e a 320 la tabella
       chiede 273 in 270 col carattere di ripiego (268 con Barlow, cioè ci sta):
       quello che resta fuori è il bordo destro del bottone, mai un testo o una
       pillola. Non si nasconde: si dichiara con la misura, e le tre domande che
       contano — testi in vista, pillole in vista, almeno 44 px di bottone in
       vista — restano strette in tutti i temi. */
    if (tema === "sole" && W <= 360 && esiti.scorre.length) console.log(`      ⚠️ ${P}: la tabella scorre — ${esiti.scorre.join(" | ")} — col carattere di ripiego; resta fuori solo il bordo del bottone da 60 px (vedi le tre righe sotto)`);
    else dice(esiti.scorre.length === 0, `${P} · «Le ultime misure» sta nel suo riquadro senza scorrere (${nTab} tabelle)`, esiti.scorre.join(" | "));
    dice(esiti.testiTagliati.length === 0, `${P} · ogni testo della tabella (date, valori, provenienza) è in vista (${m0(nTab)} tabelle)`, esiti.testiTagliati.join(" | "));
    dice(esiti.pilloleTagliate.length === 0, `${P} · ogni pillola della provenienza è tutta in vista (${nPill} pillole)`, esiti.pilloleTagliate.join(" | "));
    dice(esiti.bottoniPiccoli.length === 0, `${P} · i bottoni delle azioni sono bersagli da 44 px (${nBtn})`, esiti.bottoniPiccoli.join(" | "));
    dice(esiti.bottoniFuori.length === 0, `${P} · e ognuno ha almeno 44 px in vista (${nBtn})`, esiti.bottoniFuori.join(" | "));
    if (esiti.vuote.length && tema === "scuro") console.log(`      (senza quadrante, perché senza letture: ${esiti.vuote.join(", ")})`);
  }
  dice(errori.length === 0, `${W} · nessun errore di pagina`, errori.join(" | "));
  await pg.close();
}
await b.close();
srv.close();

console.log(`\nDenominatore: ${den.schede} schede aperte, ${den.v} celle del quadrante, ${den.testi} nodi di testo, ${den.tabelle} tabelle, ${den.pillole} pillole, ${den.bottoni} bottoni.`);
if (nonMisurati) console.log(`⚠️ NON MISURATE: ${nonMisurati} combinazioni larghezza×tema senza nessuna scheda aperta. Non vuol dire «a posto».`);

if (CONTROPROVA) {
  console.log(`\ndifetti rimessi: ${colpiti.size} su ${DIFETTI_PAGINA.length}`);
  if (colpiti.size !== DIFETTI_PAGINA.length) {
    console.error("✗ un difetto non ha trovato il suo pezzo di pagina: l'iniezione non inietta.");
    process.exit(2);
  }
  console.log(ko > 0
    ? `✓ controprova: col difetto rimesso il banco FALLISCE (${ko} controlli caduti su ${ok + ko}).`
    : "✗ controprova: col difetto rimesso il banco passa lo stesso — non sa fallire.");
  process.exit(ko > 0 ? 0 : 1);
}
console.log(`\nRisultato: ${ok} ok, ${ko} KO${nonMisurati ? `, ${nonMisurati} non misurati` : ""}`);
process.exit(ko > 0 || nonMisurati > 0 ? 1 : 0);

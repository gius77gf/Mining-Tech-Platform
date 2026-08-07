/* PREMERE «PDF» QUANDO jspdf C'È E IL SUO PLUGIN NO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node core-pdf-senza-plugin.mjs [--porta=8575]
     node core-pdf-senza-plugin.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. La guardia del PDF guardava UNA libreria su due. La riga
   `if(!window.jspdf){toast('Libreria PDF non caricata')}` era scritta **otto
   volte identica** — una per esportazione — e copriva `jspdf`. Ma tutt'e otto
   le esportazioni disegnano le tabelle con `d.autoTable`, che arriva da un
   **secondo** script, e per quello i controlli erano **zero su undici
   chiamate**.

   ⛔ E LO STATO «UNA C'È E L'ALTRA NO» NON È TEORICO: il service worker
   precacha ogni indirizzo con il **proprio** `.catch()`, e il suo commento
   dichiara perché — «per non bloccare se una CDN fallisce». Quindi una
   libreria cachata e l'altra no è uno stato che il disegno permette apposta.
   Misurato: `d.autoTable is not a function`, **zero** PDF prodotti e
   **nessun messaggio**. Si preme «PDF» e non succede niente: la stessa
   famiglia del `chiediDati()` di Flotta.

   ⚠️ LA VIA GIUSTA PER ARRIVARCI VA CERCATA. Al primo giro il banco premeva
   tre bottoni di esportazione e **nessuno dei tre** arrivava ad `autoTable`:
   rientravano prima per mancanza di dati, e il difetto rispondeva «tutto a
   posto». L'id della volata si pesca dall'elenco vero, ed è quella la via che
   ci arriva.

   ⚠️ E IL FINTO jsPDF DEVE RISPECCHIARE QUELLO VERO: in jsPDF `API` **è** il
   prototipo, quindi ciò che il plugin ci registra sopra diventa un metodo del
   documento. Al primo giro lo stub li teneva separati e il caso «con il
   plugin» falliva — misurava una cosa che il prodotto non fa. Era il
   righello. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";
import { MODULI, montaFintoFirebase } from "./finto-firebase.mjs";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const CONTROPROVA = process.argv.includes("--controprova");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8575;
/* IL DIFETTO DA RIMETTERE: la guardia vera di prima, che guardava una libreria
   su due. Otto copie identiche, e qui basta ripristinarne la forma. */
const DIFETTO = ["if(pdfNonPronto())return;", "if(!window.jspdf){toast('Libreria PDF non caricata','err');return;}"];
let colpiti = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
const srv = createServer((q, s) => {
  let p = join(R, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA && p === join(R, "index.html")) {
    let x = corpo.toString("utf8");
    const prima = x;
    x = x.split(DIFETTO[0]).join(DIFETTO[1]);
    if (x !== prima) colpiti = (prima.split(DIFETTO[0]).length - 1);
    corpo = Buffer.from(x, "utf8");
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, x) => { srv.once("error", x); srv.listen(PORTA, r); });
const SEGNO = join(R, "__pdfmezzo-" + process.pid);
writeFileSync(SEGNO, String(process.pid));
try {
  const eco = await (await fetch(`http://127.0.0.1:${PORTA}/__pdfmezzo-${process.pid}`)).text();
  if (eco.trim() !== String(process.pid)) { console.error("✗ risponde un ALTRO server"); process.exit(2); }
} finally { try { unlinkSync(SEGNO); } catch (e) {} }

/* jspdf finto: c'è, ma SENZA il plugin delle tabelle — cioè lo stato di mezzo.
   Nel jsPDF vero API E' il prototipo: quello che ci si registra sopra diventa
   un metodo del documento. Se lo stub non lo rispecchia misura una cosa che il
   prodotto non fa — ed è successo al primo giro. */
const FINTO_JSPDF = `window.jspdf={jsPDF:class{
  constructor(){this.internal={pageSize:{getWidth:()=>210,getHeight:()=>297},getNumberOfPages:()=>1};this.lastAutoTable={finalY:20};}
  setFontSize(){return this;} setFont(){return this;} setTextColor(){return this;} setFillColor(){return this;}
  setDrawColor(){return this;} setLineWidth(){return this;} text(){return this;} rect(){return this;}
  line(){return this;} addPage(){return this;} setPage(){return this;} addImage(){return this;}
  roundedRect(){return this;} circle(){return this;} save(){window.__pdfSalvato=(window.__pdfSalvato||0)+1;}
  splitTextToSize(t){return [String(t)];} getTextWidth(){return 10;} setProperties(){return this;}
}};
window.jspdf.jsPDF.API=window.jspdf.jsPDF.prototype;`;

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, tx, x) => {
  if (c) { ok++; console.log(`  ok  ${tx}`); }
  else { ko++; console.log(`  KO  ${tx}${x !== undefined ? `\n        -> ${JSON.stringify(String(x).slice(0, 300))}` : ""}`); }
};

const PLUGIN = "window.jspdf.jsPDF.API.autoTable=function(){this.lastAutoTable={finalY:20};return this;};";

const prova = async (conPlugin) => {
  const pg = await b.newPage({ viewport: { width: 390, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await montaFintoFirebase(pg);
  await pg.route("https://www.gstatic.com/firebasejs/**firebase-firestore.js", (r) =>
    r.fulfill({ status: 200, contentType: "text/javascript",
      body: MODULI["firebase-firestore.js"].replace(
        "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
        "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));
  await pg.route("https://cdn.jsdelivr.net/npm/jspdf@**", (r) =>
    r.fulfill({ status: 200, contentType: "text/javascript", body: FINTO_JSPDF }));
  await pg.route("https://cdn.jsdelivr.net/npm/jspdf-autotable@**", (r) =>
    conPlugin ? r.fulfill({ status: 200, contentType: "text/javascript", body: PLUGIN }) : r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/index.html`, { waitUntil: "load" });
  await pg.waitForFunction(() => typeof window.doLogin === "function", { timeout: 20000 });
  let dentro = false;
  for (let g = 0; g < 6 && !dentro; g++) {
    await pg.fill("#lu", "admin"); await pg.fill("#lp", "admin"); await pg.click("#btn-login");
    await pg.waitForTimeout(800);
    dentro = await pg.evaluate(() => { const h = document.getElementById("screen-home"); return !!h && getComputedStyle(h).display !== "none"; });
  }
  /* ⚠️ LA VIA CHE ARRIVA DAVVERO AD autoTable: l'id si pesca dall'elenco vero,
     perche' i bottoni generici rientrano prima per mancanza di dati e il
     difetto risponderebbe «tutto a posto» senza essere stato toccato. */
  await pg.evaluate(() => window.nav && window.nav("volate-list"));
  await pg.waitForTimeout(500);
  const id = await pg.evaluate(() => {
    const it = document.querySelector("#volate-list-body .sitem[onclick]");
    const m = it && it.getAttribute("onclick").match(/'([^']+)'/);
    return m ? m[1] : null;
  });
  const esito = await pg.evaluate(async (vid) => {
    window.__pdfSalvato = 0;
    let errore = null;
    try { const v = window.exportVolataPDF(vid); if (v && v.then) await v; }
    catch (e) { errore = e.message; }
    await new Promise((s) => setTimeout(s, 350));
    return { errore, salvati: window.__pdfSalvato,
      messaggi: Array.from(document.querySelectorAll(".toast")).map((x) => x.textContent.trim()) };
  }, id);
  const api = await pg.evaluate(() => typeof (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API && window.jspdf.jsPDF.API.autoTable));
  await pg.close();
  return { dentro, id, api, errori, ...esito };
};

/* ══════ IL PLUGIN NON ARRIVA: il caso che il difetto lasciava muto ══════ */
console.log("── jspdf c'e', il plugin delle tabelle no ──");
{
  const r = await prova(false);
  if (CONTROPROVA) dice(colpiti === 8, `la controprova ha rimesso la guardia vecchia in tutt'e 8 i punti (${colpiti})`);
  dice(r.dentro, "si entra davvero nell'app");
  dice(!!r.id, `l'id della volata e' stato pescato dall'elenco vero (${r.id})`);
  dice(r.api === "undefined", `il plugin davvero non c'e' (jsPDF.API.autoTable=${r.api})`);
  dice(r.errore === null, "premere «PDF» non solleva un errore", r.errore);
  dice(r.salvati === 0, `e nessun PDF rotto viene prodotto (${r.salvati})`);
  dice(r.messaggi.some((m) => /disegna le tabelle/.test(m)),
    "⛔ e l'utente LEGGE perche': premere e non veder succedere niente e' il difetto",
    r.messaggi.join(" | "));
  dice(r.messaggi.some((m) => /serve la rete/.test(m)),
    "e il messaggio dice che cosa manca, non solo che e' andata male", r.messaggi.join(" | "));
}

/* ══════ IL PLUGIN ARRIVA: il PDF deve USCIRE ══════
   ⚠️ Senza questo verso, il modo piu' facile di far passare le prove qui sopra
   sarebbe bloccare i PDF sempre — l'errore opposto, e peggiore. */
console.log("── jspdf e il plugin ci sono tutt'e due ──");
{
  const r = await prova(true);
  dice(r.api === "function", `il plugin c'e' (jsPDF.API.autoTable=${r.api})`);
  dice(r.errore === null, "premere «PDF» non solleva un errore", r.errore);
  dice(r.salvati === 1, `⛔ e il PDF ESCE davvero (${r.salvati} salvato)`, JSON.stringify(r.messaggi));
  dice(r.messaggi.some((m) => /PDF generato/.test(m)), "e lo dice", r.messaggi.join(" | "));
  dice(!r.messaggi.some((m) => /disegna le tabelle/.test(m)),
    "e la guardia NON blocca quando la libreria c'e'", r.messaggi.join(" | "));
}

console.log(`\nRisultato PDF senza plugin${CONTROPROVA ? " · CONTROPROVA" : ""}: ${ok} passati, ${ko} falliti`);
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 ? 0 : 1) : (ko > 0 ? 1 : 0));

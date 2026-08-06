/* IL CSV CHE ESCE DALLA DIMOSTRAZIONE — premuto il bottone, letto il file.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node csv-dimostrazione.mjs [--porta=8752]
     node csv-dimostrazione.mjs --solo=conti   (conti · flotta · sentinella · terra)
     node csv-dimostrazione.mjs --live         (le app credono di essere in
                                                produzione: i nomi devono
                                                uscire PULITI)
     node csv-dimostrazione.mjs --controprova  (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. Sui fogli STAMPATI la dichiarazione «dati di esempio» c'era
   già (`avvisoEsempio` in Conti e Terra, il blocco `avviso-stampa` in Flotta,
   `rep-esempio` in Sentinella), e la difende `stampe-fs.mjs`. Sui CSV non
   c'era per NESSUNA delle quattro app, e il censimento lo dice con un numero:

       25 punti di export CSV — conti 9, flotta 9, sentinella 5, terra 2 —
       e zero parole che dicessero che i numeri sono inventati.

   Un `.csv` non è un foglio: arriva in un foglio di calcolo, o in mano al
   commercialista, o all'ente, e a differenza di un foglio stampato **non ha
   nemmeno una testata grafica in cui dubitare**. Era la superficie che usciva
   dall'azienda con l'aria più credibile di tutte e con la difesa più debole.

   ⛔ PERCHÉ LA DICHIARAZIONE STA NEL NOME E NON DENTRO IL FILE — MISURATO,
   NON RAGIONATO. Le forme possibili erano quattro. Sono state scritte tutte e
   quattro e RILETTE dai nostri lettori sui 23 file veri usciti da questi
   bottoni (il `--dump=` qui sotto serve a questo):

       forma                  lettori che ritrovano le righe   resta coi dati
       (a) il nome del file              9 su 9                     NO
       (b) una riga # in cima            3 su 9   ⛔                sì
       (c) una riga in coda              3 su 9   ⛔                sì
       (d) una colonna in più            9 su 9                     sì

   (b) e (c) non «sporcano» il file: la riga della dichiarazione viene letta
   come un DATO. Un ricambio in più per `parseRicambiCsv`, un mezzo in più per
   `parseMezziCsv`, una taratura in più per `parseTaratureCsv`, un fronte in
   più per `parseFrontiCsv`, un ricettore per `parseRicettoriCsv`, una gara per
   `parseGareCsv`. Cioè la frase scritta per dire «questi numeri non sono
   veri» diventa essa stessa un numero falso — che è il difetto che stavamo
   chiudendo, rifatto peggio.
   Resta (a), che è quella montata qui: non tocca un byte del contenuto,
   quindi i giri scrivi/leggi sono identici per costruzione — e «per
   costruzione» è un'affermazione, quindi il banco li RIFÀ lo stesso, sui sei
   `GIRI` qui sotto, sul file vero uscito dal bottone.
   ⚠️ (d) regge anche lei ED È L'UNICA CHE RESTA ATTACCATA AI DATI quando
   qualcuno incolla il contenuto in un foglio già aperto: è la proposta
   aperta, non un lavoro saltato. Ma va fatta dove il file si COMPONE, riga
   per riga: attaccata a testo dopo, sui sei file di Flotta (che uniscono con
   `\r\n`) raddoppia il numero di righe lette, in silenzio. La misura sta in
   `run-kpi.mjs`, banda «I CSV E LA DIMOSTRAZIONE DICHIARATA».

   ⛔ E LA RIGA `download = "…"` È RIMASTA UN LETTERALE. Scrivere
   `a.download = marchiaCsv("x.csv")` sarebbe stato più corto e avrebbe reso
   CIECA la regola 13 di `run-stile`, che i nomi di file ripetuti li conta
   leggendo proprio quel letterale — quattro app perse senza far cadere
   niente. La marcatura si applica **dopo** l'assegnazione.

   ⛔ LA SECONDA DOMANDA: E SU UN FILE VERO IL MARCHIO NON C'È? Una guardia
   che si accende sempre non è una guardia, ed è il difetto che qui costerebbe
   di più — marchiare «DATI DI ESEMPIO» il registro IVA vero di un cliente.
   `--live` fa credere alle quattro app di essere in produzione (in
   dimostrazione il confronto diventa `!== "demo"`, cioè falso) e allora le
   prove si rovesciano: gli stessi file devono uscire col nome PULITO. */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8752;
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";
const CONTROPROVA = process.argv.includes("--controprova");
const FINGE_LIVE = process.argv.includes("--live");
/* `--dump=<cartella>` salva i file usciti dai bottoni. Serve a misurare le
   forme della dichiarazione sui file VERI invece che su testo scritto a mano:
   una misura su un esempio inventato misura l'esempio. */
const DUMP = (process.argv.find((a) => a.startsWith("--dump=")) || "").split("=")[1] || "";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const MARCHIO = "DATI-DI-ESEMPIO_";
const PAGINE = ["apps/conti/index.html", "apps/flotta/index.html",
                "apps/sentinella/index.html", "apps/terra/index.html"];

/* ── I BOTTONI DI EXPORT, uno per punto censito ────────────────────────────
   L'elenco è DERIVATO dal disco, non scritto a mano: si legge la pagina, si
   cercano le righe `…download = …` e si risale al `$("btn-…").onclick` che le
   contiene. Così un export nuovo entra da solo nel banco invece di essere
   dimenticato — è lo stesso motivo per cui `run-stile` ha smesso di tenere
   elenchi a memoria. */
const bottoniDi = (src) => {
  const righe = src.split("\n");
  const out = [];
  righe.forEach((l, i) => {
    if (!/[A-Za-z_$][\w$]*\.download = /.test(l) || /const marchiaCsv/.test(l)) return;
    let id = null;
    for (let j = i; j >= 0 && id === null; j--) {
      const m = righe[j].match(/\$\("([^"]+)"\)\.onclick/);
      if (m) id = m[1];
    }
    out.push({ id, riga: i + 1, nome: (l.match(/download = "([^"]*)"/) || [, "(costruito)"])[1] });
  });
  return out;
};

/* ── LE COPPIE SCRIVI/LEGGI VIVE ───────────────────────────────────────────
   Il file che esce dal bottone rientra dal nostro lettore. Se un giorno
   qualcuno mettesse la dichiarazione DENTRO il file, è qui che si vedrebbe. */
const GIRI = {
  "conti_listino.csv": ["conti", "parseListinoCsv"],
  "conti_gare.csv": ["conti", "parseGareCsv"],
  "flotta_ricambi.csv": ["flotta", "parseRicambiCsv"],
  "sentinella_ricettori.csv": ["sentinella", "parseRicettoriCsv"],
  "sentinella_tarature.csv": ["sentinella", "parseTaratureCsv"],
  "sentinella_registro_volate.csv": ["sentinella", "parseVolateCsv"],
};

/* ── LE INIEZIONI ──────────────────────────────────────────────────────────
   Due strati indipendenti, e la controprova li toglie tutti e due: togliendone
   uno solo l'altro reggerebbe e la controprova direbbe «non distingue» per il
   motivo sbagliato (il codice difeso in profondità, non la prova cieca).
     1. la DECISIONE — `marchiaCsv` che non marchia più niente;
     2. le CHIAMATE — i 25 siti che non la chiamano più.
   `--live` invece non è un difetto: è la stessa decisione letta al contrario. */
const DEF_VERA = 'const marchiaCsv = (el) => { if (db.mode !== "live")';
const DEF_SPENTA = 'const marchiaCsv = (el) => { if (false && db.mode !== "live")';
const DEF_LIVE = 'const marchiaCsv = (el) => { if (db.mode !== "demo")';

let nDecisioni = 0, nChiamate = 0, nMancate = 0;
const inietta = (rotta, t) => {
  if (!PAGINE.includes(rotta.replace(/^\//, ""))) return t;
  if (FINGE_LIVE) {
    const n = t.split(DEF_VERA).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${rotta}: ${n} soggetti per la definizione`); nMancate++; return t; }
    nDecisioni++;
    return t.replace(DEF_VERA, DEF_LIVE);
  }
  const n = t.split(DEF_VERA).length - 1;
  if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${rotta}: ${n} soggetti per la definizione`); nMancate++; }
  else { t = t.replace(DEF_VERA, DEF_SPENTA); nDecisioni++; }
  const prima = t.length;
  let tolte = 0;
  t = t.replace(/ marchiaCsv\([A-Za-z_$][\w$]*\);/g, () => { tolte++; return ""; });
  if (tolte === 0) { console.log(`⛔ INIEZIONE MANCATA in ${rotta}: nessuna chiamata tolta`); nMancate++; }
  nChiamate += tolte;
  if (prima === t.length && tolte > 0) { console.log(`⛔ ${rotta}: tolte ${tolte} chiamate ma il file non è cambiato`); nMancate++; }
  return t;
};

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER: un banco che trova
     la porta occupata e la riusa non fallisce — misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (/\.(html|js|mjs|css)$/.test(p) && (CONTROPROVA || FINGE_LIVE)) {
    corpo = Buffer.from(inietta(rotta, corpo.toString("utf8")), "utf8");
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
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔`
    + `${CONTROPROVA ? "  · CONTROPROVA (i nomi devono uscire NUDI, il banco deve diventare rosso)" : ""}`
    + `${FINGE_LIVE ? "  · FINGE LIVE (i nomi devono uscire PULITI)" : ""}`);
}

/* i lettori veri, per i giri scrivi/leggi sul file uscito dal bottone */
const MOD = {
  conti: await import(join(R, "apps/conti/conti-data.js")),
  flotta: await import(join(R, "apps/flotta/flotta-data.js")),
  sentinella: await import(join(R, "apps/sentinella/sentinella-data.js")),
  terra: await import(join(R, "apps/terra/terra-data.js")),
};

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 300)}` : ""}`); } };

/* Il marchio DEVE esserci in dimostrazione e NON DEVE esserci su un file
   vero: è la stessa prova letta nei due versi, non due prove. */
const ATTESO = !FINGE_LIVE;

let nBottoni = 0, nFile = 0, nVeri = 0, nProgrammatici = 0, nGiri = 0, nRigheLette = 0;
/* ⛔ LE RIGHE CHE DICONO «NON HO GUARDATO» VANNO LETTE PER PRIME. Un bottone
   premuto che non ha prodotto nessun file non è una prova passata: è una
   prova che non c'è stata, e in fondo a una pagina di verde non si vede. */
const muti = [];

const provaApp = async (app) => {
  const rel = `apps/${app}/index.html`;
  const bottoni = bottoniDi(readFileSync(join(R, rel), "utf8"));
  console.log(`\n── ${app} · ${bottoni.length} punti di export censiti sul disco ──`);

  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, locale: "it-IT" });
  const pg = await ctx.newPage();
  /* Si intercetta il `click()` dell'ancora DOPO che il nome le è stato
     assegnato: così il localizzatore che gli altri banchi usano — il letterale
     `download = "…"` — resta esattamente dov'è. */
  /* ⛔ E IL CORPO SI PRENDE AL VOLO, NON DOPO. Due export di Conti fanno
     `a.click(); URL.revokeObjectURL(a.href);` sulla stessa riga: intercettando
     il clic il file non parte, la pagina revoca subito l'URL e chi va a
     leggerlo dopo trova una stringa VUOTA — e una prova sul contenuto di una
     stringa vuota passa quasi sempre. Si tiene quindi il Blob per mano,
     agganciando `createObjectURL`. */
  await pg.addInitScript(() => {
    window.__usciti = [];
    window.__blob = new Map();
    const creaVera = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (o) => { const u = creaVera(o); window.__blob.set(u, o); return u; };
    const vero = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) { window.__usciti.push({ nome: this.download, href: String(this.href) }); return; }
      return vero.apply(this, arguments);
    };
  });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.goto(`http://127.0.0.1:${porta}/${rel}`);
  await pg.waitForTimeout(2600);
  dice(errori.length === 0, `${app}: la pagina non solleva errori`, errori.slice(0, 2));

  /* prova di aver caricato davvero la dimostrazione: un banco che misura una
     pagina vuota risponde «tutto a posto» senza aver guardato niente */
  const modo = await pg.evaluate(() => (document.getElementById("mode-note") || {}).textContent || "");
  dice(/esempio|reali/i.test(modo), `${app}: la pagina è partita e dichiara il suo modo`, modo);

  /* apre la schermata di ogni bottone (la sua `.page` ha un `nav-…` gemello),
     poi lo preme. Si conta quanti sono stati premuti da veri clic e quanti no:
     un numero che non torna si vede, uno «zero violazioni» no. */
  for (const btn of bottoni) {
    if (!btn.id) { console.log(`  ·  riga ${btn.riga}: nessun bottone risalito, salto`); continue; }
    nBottoni++;
    const sez = await pg.evaluate((id) => {
      const el = document.getElementById(id); if (!el) return null;
      const p = el.closest(".page"); if (!p) return "";
      const nav = document.getElementById("nav-" + p.id.replace(/^page-/, ""));
      if (nav) nav.click();
      return p.id;
    }, btn.id);
    if (sez === null) { dice(false, `${app}: il bottone #${btn.id} non esiste nella pagina`); continue; }
    await pg.waitForTimeout(250);
    const prima = await pg.evaluate(() => window.__usciti.length);
    let premuto = false;
    try { await pg.locator("#" + btn.id).click({ timeout: 1200 }); premuto = true; nVeri++; } catch (e) { /* nascosto: sotto */ }
    if (!premuto) { await pg.evaluate((id) => document.getElementById(id).click(), btn.id); nProgrammatici++; }
    await pg.waitForTimeout(220);
    const dopo = await pg.evaluate(() => window.__usciti.length);
    if (dopo === prima) muti.push(`${app} #${btn.id} (riga ${btn.riga}) — nessun file`);
  }

  /* il libretto macchina di Flotta non ha un bottone di sezione: vuole una
     macchina aperta, quindi si apre e si preme il suo export */
  if (app === "flotta") {
    const aperto = await pg.evaluate(() => {
      const nav = document.getElementById("nav-mez"); if (nav) nav.click();
      const r = document.querySelector("#mez-list .item [data-scheda-mezzo]");
      if (!r) return false; r.click(); return true;
    });
    await pg.waitForTimeout(700);
    if (aperto) {
      nBottoni++;
      await pg.evaluate(() => document.getElementById("btn-sch-csv").click());
      nProgrammatici++;
      await pg.waitForTimeout(220);
    } else dice(false, "flotta: nessuna macchina da aprire per il libretto");
  }

  const usciti = await pg.evaluate(() => window.__usciti);
  nFile += usciti.length;
  console.log(`     (${usciti.length} file usciti dai ${nBottoni ? bottoni.length + (app === "flotta" ? 1 : 0) : 0} bottoni premuti)`);
  dice(usciti.length > 0, `${app}: almeno un file è davvero uscito`, usciti.length);

  for (const u of usciti) {
    const marchiato = u.nome.startsWith(MARCHIO);
    dice(marchiato === ATTESO,
      `${app}: «${u.nome}» ${ATTESO ? "porta il marchio in testa" : "esce col nome PULITO (nessun marchio su un file vero)"}`,
      u.nome);
    dice(/\.csv$/i.test(u.nome), `${app}: «${u.nome}» resta un .csv`, u.nome);
  }

  /* ── IL CONTENUTO NON È STATO TOCCATO ────────────────────────────────── */
  const corpi = await pg.evaluate(async (lista) => {
    const out = [];
    for (const u of lista) {
      let t = "";
      if (u.href.startsWith("data:")) t = decodeURIComponent(u.href.replace(/^data:[^,]*,/, ""));
      else if (window.__blob.has(u.href)) t = await window.__blob.get(u.href).text();
      else t = await fetch(u.href).then((r) => r.text()).catch(() => "");
      out.push({ nome: u.nome, testo: t.replace(/^﻿/, "") });
    }
    return out;
  }, usciti);

  for (const c of corpi) {
    const pulito = c.nome.replace(MARCHIO, "");
    if (DUMP) { mkdirSync(DUMP, { recursive: true }); writeFileSync(join(DUMP, `${app}__${pulito}`), c.testo); }
    dice(!/DATI-DI-ESEMPIO|DATI DI ESEMPIO/i.test(c.testo),
      `${app}: «${pulito}» — il marchio NON è entrato nel contenuto`, c.testo.slice(0, 120));
    dice(c.testo.split("\n")[0].includes(";"),
      `${app}: «${pulito}» — l'intestazione è ancora la riga 1`, c.testo.split("\n")[0].slice(0, 120));
    const g = GIRI[pulito];
    if (!g) continue;
    const [modApp, lettore] = g;
    const righe = MOD[modApp][lettore](c.testo);
    nGiri++; nRigheLette += righe.length;
    dice(Array.isArray(righe) && righe.length > 0,
      `${app}: giro scrivi/leggi — «${pulito}» rientra da ${lettore}(): ${righe.length} righe`, righe.length);
  }

  await ctx.close();
};

const APP = ["conti", "flotta", "sentinella", "terra"];
for (const a of APP) if (!SOLO || SOLO === a) await provaApp(a);

/* Genesi resta FUORI, e la ragione è misurata invece che ricordata: non ha
   login, non ha archivio DEMO, non ha `db.mode` — i suoi CSV escono dai
   parametri che l'utente ha scritto, quindi non c'è nessuna dimostrazione da
   distinguere da un file vero. Se un giorno Genesi guadagnasse il modo tour,
   questa riga diventa rossa e l'eccezione va rifatta. */
{
  const g = readFileSync(join(R, "apps/genesi/genesi.html"), "utf8");
  const gd = readFileSync(join(R, "apps/genesi/genesi-data.js"), "utf8");
  console.log("\n── Genesi · fuori, con la prova ──");
  dice(!/db\.mode/.test(g) && !/id="tour-banner"/.test(g) && !/^export const DEMO\b/m.test(gd),
    "Genesi non ha nessun modo dimostrazione: niente da dichiarare nei suoi CSV");
}

await b.close();
srv.close();

if (muti.length) {
  console.log(`\n⚠️  ${muti.length} bottoni su ${nBottoni} NON hanno prodotto nessun file — su quei punti il banco non ha`);
  console.log("   provato niente. Non vuol dire «a posto»: vuol dire che non è stato guardato.");
  for (const m of muti) console.log(`     · ${m}`);
  console.log("   Al 06/08 sono TRE, e tutt'e tre per una ragione buona — guardata una per una, non dedotta:");
  console.log("     · sentinella #btn-ref-export — si RIFIUTA di scrivere un file vuoto quando nessuna");
  console.log("       volata è utilizzabile come referto, e dice volata per volata che cosa manca;");
  console.log("     · flotta #btn-sco-csv — la lista della spesa non esce se non c'è niente da ordinare");
  console.log("       (o se mancano i giorni di consegna del fornitore: senza quel numero non è un conto);");
  console.log("     · flotta #btn-sch-csv — qui è il banco: nel giro dei bottoni nessuna macchina è ancora");
  console.log("       aperta. Lo stesso bottone viene poi premuto con una macchina aperta, e il file esce.");
  console.log("   Se ne comparissero altri, vanno aperti: un bottone muto non è un bottone a posto.");
}

console.log(`\n${nBottoni} bottoni di export premuti (${nVeri} con un clic vero, ${nProgrammatici} su una sezione non visibile)`
  + ` · ${nFile} file letti · ${nGiri} giri scrivi/leggi rifatti sul file vero (${nRigheLette} righe rientrate)`);
if (CONTROPROVA || FINGE_LIVE)
  console.log(`iniezioni: ${nDecisioni} decisioni ${FINGE_LIVE ? "rovesciate" : "spente"}, ${nChiamate} chiamate tolte`
    + `${nMancate ? `, ⛔ ${nMancate} MANCATE` : ""}`);
console.log(`\nRisultato CSV dimostrazione: ${ok} ok, ${ko} KO`);

if (CONTROPROVA) {
  const distingue = ko > 0 && nMancate === 0 && nChiamate > 0;
  console.log(distingue
    ? `✔ CONTROPROVA: col difetto rimesso il banco è ROSSO (${ko} KO). Sa fallire.`
    : `✗ CONTROPROVA: il banco NON distingue — ${ko} KO, ${nChiamate} chiamate tolte, ${nMancate} iniezioni mancate.`);
  process.exit(distingue ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

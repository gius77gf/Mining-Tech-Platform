/* FLOTTA: IL CONTATORE SOSTITUITO O AZZERATO, DAL MODULO DEL RIFORNIMENTO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-contatore.mjs [--porta=8781]     (registra i pieni e legge la pagina)
     node flotta-contatore.mjs --controprova      (rimette il difetto: DEVE fallire)
     node flotta-contatore.mjs --scatti           (salva gli scatti in /tmp/flotta-contatore)

   PERCHÉ ESISTE. Un contaore si sostituisce o si azzera, e da quel giorno le
   ore ricominciano. Fino al 04/09 Flotta rifiutava la lettura più bassa e, se
   entrava, consumo e ritmo dicevano «sceso» per sempre. Adesso il modulo del
   rifornimento ha la casella «contatore nuovo o azzerato»: qui la si usa
   davvero, a 320 e a 390 px, nei DUE versi —
     · la lettura più bassa SENZA la casella è rifiutata, e il messaggio dice
       la via giusta;
     · CON la casella passa, la riga del carburante dice da quando riparte il
       conto, e col secondo pieno il consumo si misura «del nuovo contatore»;
       la riga del mezzo e la scheda dicono la sostituzione;
     · (04/09, seconda unità) il TAGLIANDO A ORE scritto sul vecchio contatore
       (n1 porta `scrittaIl: 2026-07-10`, prima della sostituzione di oggi) è
       «non confrontabile» — niente colore, niente «tra 5.790 h» — nella riga,
       nella tessera del Quadro e nell'ordine; l'ordine porta il bottone
       «Riscrivi sul contatore nuovo», la finestra PROPONE il conto (6.000 −
       5.870 + 120 = 250 h) e, confermato, il tagliando torna confrontabile
       («tra 40 h» a 210 h di contatore) con la memoria di com'era nella nota.
   La dimostrazione non ha nessun azzeramento (di proposito: cinque prove
   assolute vivono sui suoi numeri), quindi il caso lo si COSTRUISCE premendo il
   bottone, in memoria — niente si inietta nel modulo.
   La controprova rimette il difetto nel modulo servito: `trattoCorrente`
   ignorato in `consumoPerMezzo` e in `ritmoOreMezzi`, cioè l'azzeramento
   dichiarato che non cambia niente. Il pieno entra lo stesso (la validazione
   resta), ma il conto torna a dire «sceso» e il banco deve cadere. Terza
   iniezione (04/09): `urgenzaTagliando` che ignora il contatore del
   tagliando, cioè «tra 5.790 h» in verde su un tagliando del vecchio. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const SCATTI = process.argv.includes("--scatti");
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8781;
const OUT = "/tmp/flotta-contatore";
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
/* il difetto rimesso: l'azzeramento dichiarato non spezza niente. Due punti,
   perché consumo e ritmo sono due lettori e il banco guarda tutt'e due. */
const DIFETTI = [
  ["apps/flotta/flotta-data.js",
   "    const tc = trattoCorrente(v.pieni.filter(p => p.ore != null));",
   "    const tc = { letture: v.pieni.filter(p => p.ore != null), tratti: 1, dal: null, azzeramento: null, senzaData: 0 };   /* difetto rimesso dal banco */"],
  ["apps/flotta/flotta-data.js",
   "    const tc = trattoCorrente(v.punti);",
   "    const tc = { letture: v.punti, tratti: 1, dal: null, azzeramento: null, senzaData: 0 };   /* difetto rimesso dal banco */"],
  /* (04/09, seconda unità) il tagliando sul vecchio contatore torna a essere
     confrontato col contatore nuovo: «tra 5.790 h» in verde, il difetto di partenza */
  ["apps/flotta/flotta-data.js",
   '  if (!c.calcolabile) return { cls: "", label: "non confrontabile", mancano: null, oreNote: false, calcolabile: false, perche: c.perche, contatore: c };',
   "  /* difetto rimesso dal banco: il contatore del tagliando non conta */"],
];
let difettiRimessi = 0;

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (CONTROPROVA) for (const [file, cerca, sost] of DIFETTI) {
    if (!p.endsWith(file)) continue;
    const t = corpo.toString("utf8"); const n = t.split(cerca).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi++;
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});
await new Promise((r, no) => { srv.on("error", no); srv.listen(PORTA, "127.0.0.1", r); })
  .catch((e) => { console.error(`✗ porta ${PORTA} non disponibile: ${e.message}`); process.exit(2); });
const c = await fetch(`http://127.0.0.1:${PORTA}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: sulla porta risponde qualcun altro"); process.exit(2); }

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };
if (SCATTI) mkdirSync(OUT, { recursive: true });
const oggi = new Date();
const oggiIt = oggi.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });

for (const W of [320, 390]) {
  console.log(`\n── ${W} px`);
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  const errori = [];
  pg.on("pageerror", (e) => errori.push(e.message));
  await pg.route("https://www.gstatic.com/**", (r) => r.abort());
  await pg.goto(`http://127.0.0.1:${PORTA}/apps/flotta/index.html`);
  let pronto = false;
  for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("rif-list")?.innerHTML.length || 0) > 0 && document.querySelectorAll("#rif-mezzo option").length > 1); }
  dice(pronto, "la pagina è pronta con la dimostrazione (lista dei pieni e mezzi nella tendina)");
  await pg.click("#nav-cos"); await pg.waitForTimeout(400);
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-cos")).display !== "none"), "sono sulla schermata Costi, dove sta il modulo del rifornimento");
  const scatto = async (nome) => { if (SCATTI) await pg.screenshot({ path: join(OUT, `${W}-${nome}${CONTROPROVA ? "-controprova" : ""}.png`), fullPage: false }); };

  // la riga di E1 nel carburante, com'è prima: consumo calcolato su un contatore solo
  const rigaE1 = () => pg.evaluate(() => {
    const i = [...document.querySelectorAll("#rif-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || "") && x.querySelector(".meta.norma"));
    return i ? { norma: i.querySelector(".meta.norma").textContent.replace(/\s+/g, " ").trim(), badge: [...i.querySelectorAll(".badge")].map((b) => b.textContent.replace(/\s+/g, " ").trim()).join(" | ") } : null;
  });
  const prima = await rigaE1();
  dice(!!prima && /misurato su 56 ore di lavoro/.test(prima.norma) && !/nuovo contatore/.test(prima.norma), "prima: E1 è misurato su 56 ore, e non si parla di nessun contatore nuovo", prima);

  const compila = async (litri, ore, nuovo) => {
    await pg.selectOption("#rif-mezzo", "Escavatore E1");
    const d = await pg.evaluate(() => document.getElementById("rif-data").value);
    if (!d) await pg.fill("#rif-data", oggi.toISOString().slice(0, 10));
    await pg.fill("#rif-litri", litri); await pg.fill("#rif-euro", ""); await pg.fill("#rif-ore", ore);
    await pg.evaluate((n) => { const c = document.getElementById("rif-nuovo"); c.checked = n; }, nuovo);
    await pg.click("#btn-rif"); await pg.waitForTimeout(500);
    return pg.evaluate(() => document.getElementById("rif-esito").textContent.replace(/\s+/g, " ").trim());
  };
  const bersaglio = await pg.evaluate(() => { const r = document.querySelector("label.toggle-row[for=rif-nuovo]").getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width), dentro: r.right <= innerWidth + 0.5 }; });
  dice(bersaglio.h >= 44 && bersaglio.dentro, `la riga della casella è un bersaglio di tocco (alta ${bersaglio.h} px) e sta nello schermo`, bersaglio);
  await pg.evaluate(() => document.getElementById("rif-nuovo").scrollIntoView({ block: "center" })); await scatto("1-modulo");

  // VERSO 1: la lettura più bassa SENZA la casella è rifiutata
  const rif = await compila("300", "120", false);
  dice(/segna meno/.test(rif) && /nuovo o azzerato/.test(rif), "senza la casella, 120 h su un mezzo a 5.870 è rifiutato e il messaggio indica la casella", rif);
  const errOre = await pg.evaluate(() => document.getElementById("rif-ore").classList.contains("err"));
  dice(errOre, "e il campo delle ore è segnato in errore");
  dice((await rigaE1()).norma === prima.norma, "la riga di E1 non si è mossa: niente è stato salvato", await rigaE1());
  await scatto("2-rifiutato");

  // VERSO 2: CON la casella passa, e la riga dice da quando riparte il conto
  const conNuovo = await compila("300", "120", true);
  dice(/Rifornimento registrato/.test(conNuovo) && /120 ore del contatore nuovo/.test(conNuovo) && /ripartono da capo/.test(conNuovo), "con la casella passa: «120 ore del contatore nuovo … ripartono da capo»", conNuovo);
  const dopo1 = await rigaE1();
  dice(!!dopo1 && new RegExp(`^Contatore sostituito il ${oggiIt}: il conto riparte da lì, e serve un secondo rifornimento con le ore del nuovo contatore\\.`).test(dopo1.norma), "⛔ la riga di E1 dice la sostituzione con la data e che serve un secondo pieno — non «sceso», non un numero", dopo1);
  dice(!!dopo1 && /consumo n\.d\./i.test(dopo1.badge) && !/l\/h/.test(dopo1.badge), "e il badge è «consumo n.d.», niente l/h", dopo1);
  dice(await pg.evaluate(() => !document.getElementById("rif-nuovo").checked), "la casella si è spenta da sola dopo il salvataggio");
  const ultimo = await pg.evaluate(() => [...document.querySelectorAll("#rif-list .item")].map((i) => i.querySelector(".meta")?.textContent.replace(/\s+/g, " ").trim()).find((t) => /contatore 120 h/.test(t || "")));
  dice(!!ultimo && /contatore 120 h \(nuovo\)/.test(ultimo), "fra gli ultimi rifornimenti il pieno porta «contatore 120 h (nuovo)»", ultimo);
  await pg.evaluate(() => document.querySelector("#rif-list .item")?.scrollIntoView({ block: "start" })); await scatto("3-riparte");

  // il secondo pieno del nuovo contatore: il consumo si misura, e dice su quale contatore
  const secondo = await compila("180", "210", false);
  dice(/Rifornimento registrato/.test(secondo) && !/contatore nuovo/.test(secondo), "il secondo pieno (210 h) passa senza casella: 210 è sopra 120", secondo);
  const dopo2 = await rigaE1();
  dice(!!dopo2 && new RegExp(`^misurato su 90 ore di lavoro del nuovo contatore \\(sostituito il ${oggiIt}\\)`).test(dopo2.norma), "⛔ E1 è misurato su 90 ore «del nuovo contatore (sostituito il …)»", dopo2);
  dice(!!dopo2 && /2,0 l\/h/.test(dopo2.badge), "e il badge dice 2,0 l/h (180 l su 90 h)", dopo2);
  await pg.evaluate(() => document.querySelector("#rif-list .item")?.scrollIntoView({ block: "start" })); await scatto("4-misurato");

  // la riga del mezzo e la scheda
  await pg.click("#nav-mez"); await pg.waitForTimeout(400);
  const rigaMezzo = await pg.evaluate(() => { const i = [...document.querySelectorAll("#mez-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || "")); return i ? i.querySelector(".meta").textContent.replace(/\s+/g, " ").trim() : null; });
  dice(!!rigaMezzo && /210 ore motore/.test(rigaMezzo) && new RegExp(`contatore sostituito il ${oggiIt}`).test(rigaMezzo), "la riga del mezzo segna 210 ore motore e «contatore sostituito il …»", rigaMezzo);
  await pg.evaluate(() => { const i = [...document.querySelectorAll("#mez-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || "")); i?.scrollIntoView({ block: "center" }); }); await scatto("5-mezzo");
  await pg.evaluate(() => { const i = [...document.querySelectorAll("#mez-list .item")].find((x) => /Escavatore E1/.test(x.querySelector(".name")?.textContent || "")); i?.querySelector("[data-scheda-mezzo]")?.click(); });
  await pg.waitForTimeout(500);
  const testa = await pg.evaluate(() => document.getElementById("sch-testa")?.textContent.replace(/\s+/g, " ").trim() || "");
  dice(new RegExp(`contatore sostituito il ${oggiIt}: il conto riparte da lì \\(prima segnava 5\\.870 h\\)\\. I tagliandi a ore programmati prima di quel giorno si riferiscono al vecchio contatore\\.`).test(testa), "la scheda dice la frase intera, con le ore che il vecchio contatore segnava e l'avviso sui tagliandi a ore", testa.slice(0, 300));
  await scatto("6-scheda");

  // il tagliando a ore di E1: il ritmo dice perché non si può stimare, con la
  // data. La tessera del Quadro lo dice nel suo titolo; la riga in Officina lo
  // dice solo se il campo dell'IPOTESI (8 h/giorno di serie) è vuoto — se no la
  // riga usa l'ipotesi e la dichiara tale: è il disegno del 02/08, non un buco.
  const tessera = await pg.evaluate(() => document.querySelector('[title*="collocare nel tempo"]')?.getAttribute("title") || "");
  /* dal 04/09 (seconda unità) la ragione non è più il ritmo: il tagliando è
     scritto il 10/07 sul VECCHIO contatore, e prima ancora di chiedersi quando
     cadrà non si può confrontare col contatore di oggi. La frase vecchia
     («le letture coprono 0 giorni») era vera e più debole. */
  dice(new RegExp(`Tagliando 500h — Escavatore E1 \\(scritto il 10/07/2026 sul vecchio contatore, sostituito il ${oggiIt}, quando segnava 5\\.870 h\\)`).test(tessera), "⛔ la tessera «Tagliandi 30gg» del Quadro mette il tagliando di E1 fra quelli che non sa collocare, perché è scritto sul vecchio contatore (con le due date e quanto segnava)", tessera.slice(0, 400));
  await pg.click("#nav-man"); await pg.waitForTimeout(400);
  await pg.fill("#man-oregiorno", ""); await pg.waitForTimeout(600);
  const rigaTag = await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /Tagliando 500h/.test(x.querySelector(".name")?.textContent || "")); return i ? i.textContent.replace(/\s+/g, " ").trim() : null; });
  dice(!!rigaTag && new RegExp(`Non confrontabile col contatore attuale: scritto il 10/07/2026 sul vecchio contatore, sostituito il ${oggiIt}, quando segnava 5\\.870 h\\. Apri l'ordine per riscriverlo sul contatore nuovo\\.`).test(rigaTag), "⛔ la riga del tagliando a ore di E1 dice «non confrontabile col contatore attuale», con le date e dove si corregge", rigaTag);
  const badgeTag = await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /Tagliando 500h/.test(x.querySelector(".name")?.textContent || "")); const b = i?.querySelector(".badge"); return b ? { testo: b.textContent.replace(/\s+/g, " ").trim(), classi: b.className } : null; });
  dice(!!badgeTag && badgeTag.testo === "non confrontabile" && !/\b(ok|warn|danger)\b/.test(badgeTag.classi), "⛔ e il badge è «non confrontabile» SENZA colore di stato: non «tra 5.790 h» in verde", badgeTag);
  await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /Tagliando 500h/.test(x.querySelector(".name")?.textContent || "")); i?.scrollIntoView({ block: "center" }); }); await scatto("7-tagliando");

  // L'ORDINE DI LAVORO del tagliando: il riquadro col motivo, il bottone, la
  // proposta e la conferma. Il conto atteso: 6.000 − 5.870 + 120 = 250 h sul
  // contatore nuovo, che a 210 h di contatore fa «tra 40 h» (warn, ≤ 50).
  await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /Tagliando 500h/.test(x.querySelector(".name")?.textContent || "")); i?.click(); });
  await pg.waitForTimeout(500);
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("page-odl")).display !== "none"), "l'ordine di lavoro del tagliando si apre");
  const riquadro = await pg.evaluate(() => { const q = document.getElementById("odl-contatore"); const b = document.getElementById("btn-odl-riscrivi"); const r = b?.getBoundingClientRect(); const rq = q?.getBoundingClientRect(); return { testo: q?.textContent.replace(/\s+/g, " ").trim() || null, bottone: !!b, h: r ? Math.round(r.height) : 0, dentro: r ? r.right <= innerWidth + 0.5 && r.left >= -0.5 : false, altoRiquadro: rq ? Math.round(rq.height) : 0, svg: q ? q.querySelectorAll("svg").length : 0 }; });
  dice(!!riquadro.testo && new RegExp(`^Non confrontabile col contatore attuale: scritto il 10/07/2026 sul vecchio contatore, sostituito il ${oggiIt}, quando segnava 5\\.870 h\\. Le ore previste vanno riscritte sul contatore nuovo: l'app propone il conto, tu lo confermi\\.$`).test(riquadro.testo), "⛔ l'ordine porta il riquadro col motivo intero, su una riga sua (non tagliata a due righe)", riquadro.testo);
  dice(riquadro.bottone && riquadro.h >= 44 && riquadro.dentro, `e il bottone «Riscrivi sul contatore nuovo» è un bersaglio di tocco (alto ${riquadro.h} px) dentro lo schermo`, riquadro);
  // visto nello scatto a 320 px: un'icona dentro `.note` usciva grande quanto il riquadro (nessuna regola la dimensiona)
  dice(riquadro.svg === 0 && riquadro.altoRiquadro > 0 && riquadro.altoRiquadro <= 220, `il riquadro è solo testo e alto quanto il testo (${riquadro.altoRiquadro} px): niente icona gigante`, riquadro);
  const badgeOdl = await pg.evaluate(() => document.querySelectorAll("#odl-testa .badge")[1]?.textContent.replace(/\s+/g, " ").trim());
  dice(badgeOdl === "non confrontabile", "e il badge nella testa dell'ordine dice lo stesso della lista", badgeOdl);
  await pg.evaluate(() => document.getElementById("odl-contatore")?.scrollIntoView({ block: "center" })); await scatto("8-ordine");
  await pg.click("#btn-odl-riscrivi"); await pg.waitForTimeout(500);
  const finestra = await pg.evaluate(() => ({ aperta: !!document.querySelector("#mc-ore"), corpo: document.getElementById("modal-body")?.textContent.replace(/\s+/g, " ").trim() || document.querySelector(".modal")?.textContent.replace(/\s+/g, " ").trim() || "", valore: document.querySelector("#mc-ore")?.value }));
  dice(finestra.aperta, "la finestra «Riscrivi sul contatore nuovo» si apre con il campo delle ore");
  dice(/sostituito il/.test(finestra.corpo) && /segnava 5\.870 h/.test(finestra.corpo) && /partito da 120 h/.test(finestra.corpo), "la finestra racconta la sostituzione con i suoi numeri (5.870 h del vecchio, 120 h del nuovo)", finestra.corpo.slice(0, 400));
  dice(/mancavano 130 h/.test(finestra.corpo) && /cade a 250 h/.test(finestra.corpo), "⛔ e PROPONE il conto con gli addendi: «mancavano 130 h … cade a 250 h» (6.000 − 5.870 + 120)", finestra.corpo.slice(0, 400));
  dice(finestra.valore === "250", "il campo è precompilato con 250, senza il punto delle migliaia", finestra.valore);
  await scatto("9-proposta");
  await pg.click("#modal-foot .mbtn.primary"); await pg.waitForTimeout(700);
  const dopoRisc = await pg.evaluate(() => ({ riquadro: !!document.getElementById("odl-contatore"), badge: document.querySelectorAll("#odl-testa .badge")[1]?.textContent.replace(/\s+/g, " ").trim(), classi: document.querySelectorAll("#odl-testa .badge")[1]?.className || "", sotto: document.querySelectorAll("#odl-testa .sch-sotto")[1]?.textContent.replace(/\s+/g, " ").trim() || "", esito: document.getElementById("odl-esito")?.textContent.replace(/\s+/g, " ").trim() || "" }));
  dice(/Tagliando riscritto a 250 ore motore sul contatore nuovo/.test(dopoRisc.esito) && /confrontabile/.test(dopoRisc.esito), "confermato: l'esito dice che il tagliando è riscritto a 250 ore e che il conto è confrontabile", dopoRisc.esito);
  dice(!dopoRisc.riquadro, "il riquadro «non confrontabile» sparisce dall'ordine");
  dice(dopoRisc.badge === "tra 40 h" && /\bwarn\b/.test(dopoRisc.classi), "⛔ e il badge torna un confronto vero: «tra 40 h» in warn (250 − 210, sotto le 50)", dopoRisc);
  dice(/Tagliando a 250 ore motore/.test(dopoRisc.sotto) && new RegExp(`riscritto sul contatore nuovo il ${oggiIt}: era a 6\\.000 h del vecchio`).test(dopoRisc.sotto), "la testa dell'ordine dice le ore nuove e, nella nota, la memoria di com'era", dopoRisc.sotto);
  await scatto("10-riscritto");
  // e la lista dei tagliandi dice la stessa cosa dell'ordine
  await pg.click("#btn-odl-back"); await pg.waitForTimeout(500);
  const rigaDopo = await pg.evaluate(() => { const i = [...document.querySelectorAll("#man-list .item")].find((x) => /Tagliando 500h/.test(x.querySelector(".name")?.textContent || "")); return i ? { badge: i.querySelector(".badge")?.textContent.replace(/\s+/g, " ").trim(), testo: i.textContent.replace(/\s+/g, " ").trim() } : null; });
  dice(!!rigaDopo && rigaDopo.badge === "tra 40 h" && !/Non confrontabile/.test(rigaDopo.testo), "nella lista il tagliando è «tra 40 h» e non dice più «non confrontabile»", rigaDopo);

  dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));
  const largo = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  dice(largo, "la pagina non scorre in orizzontale");
  await pg.close();
}
if (CONTROPROVA) dice(difettiRimessi >= 3, `i difetti sono stati rimessi nel modulo servito (${difettiRimessi} punti su 3, per due schermate)`);
await b.close(); srv.close();
console.log(`\nRisultato contatore sostituito: ${ok} passati, ${ko} falliti`);
if (CONTROPROVA) { console.log(ko ? "✔ CONTROPROVA OK: col difetto rimesso il banco cade" : "✗ CONTROPROVA FALLITA: il banco non distingue"); process.exit(ko ? 0 : 1); }
process.exit(ko ? 1 : 0);

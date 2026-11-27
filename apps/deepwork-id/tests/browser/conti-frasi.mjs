/* IL TESTO CHE MENTE — Conti, letto sul renderizzato con i casi limite dentro.
   ─────────────────────────────────────────────────────────────────────────
   Uso:
     node conti-frasi.mjs [--porta=8641]
     node conti-frasi.mjs --controprova   (rimette i plurali fissi: DEVE fallire)
     node conti-frasi.mjs --dimmi         (stampa le frasi raccolte)

   PERCHÉ ESISTE, E PERCHÉ NON POTEVA STARE IN `run-kpi.mjs`.
   Il 06/08, cercando il filo «il numero è giusto e a mentire è il disegno», è
   uscita una famiglia diversa: **la frase costruita coi dati che, in un caso
   limite, non è italiano.** In Conti quella famiglia costa più che altrove,
   perché qui le frasi finiscono su una fattura, su un sollecito e su un
   estratto conto — roba che esce dall'app e arriva al cliente.

   Quello che ha trovato, tutto con UN solo soggetto al posto di tanti:

   1. la finestra «elimina fattura» → «**I 1 DDT collegati tornano** fra quelli
      da fatturare: le consegne non si perdono» — e la riga sotto, nella stessa
      finestra, il singolare lo faceva già (usava `plur`);
   2. import fatture  → «1 aggiunte, 1 già presenti, 1 con lo stesso numero…»;
   3. import listino  → «1 prodotti aggiunti, 1 già presenti (saltati), 1
      ripetuti nel file» — e in coda «1 prodotto è senza densità: **per quelli**
      non posso convertire», cioè la testa al plurale e la coda che si smentisce;
   4. import gare     → «1 aggiunte, 1 già presenti (saltate), 1 ripetute»;
   5. export listino  → «Esportati 1 prodotti (CSV)» — l'unico dei SETTE export
      dell'app che non passava da `plur`.
      ⚠️ E l'asserzione che lo sorveglia è stata **ristretta** l'08/08: chiedeva
      «Esportati 1 prodotto», cioè il nome giusto e il PARTICIPIO ancora al
      plurale. La pagina intanto ha imparato anche quello (`plurale(...)`,
      07/08) e scriveva la forma corretta — «Esportato» — che questo banco
      contava come un KO. Un banco che pinna il testo di ieri ostacola la
      correzione di domani: adesso pretende il singolare **e** che il plurale
      non compaia.

   Nessuno di questi cinque si vede da `run-kpi.mjs`: le suite `node` chiamano
   il modulo, e queste frasi le compone la PAGINA. E nessuno si vede nemmeno
   aprendo la pagina com'è, perché la dimostrazione ha sempre più di una riga:
   il caso limite va COSTRUITO. Qui si costruisce in due modi, tutt'e due senza
   toccare il disco — accanto ci sono cantieri che scrivono:
     · appendendo alla risposta HTTP di `conti-data.js` una fattura scaduta di
       UN giorno, con UN DDT collegato, di un cliente che ha quella sola;
     · caricando davvero nei campi file dei CSV a tre righe costruiti perché
       ogni contatore valga esattamente 1.

   ⚠️ IL RIGHELLO SBAGLIA PIÙ DEL PRODOTTO, e qui è successo: la prima stesura
   segnalava «€» e «%» dentro le classi in maiuscolo. Non sono difetti — quei
   due segni **non hanno maiuscola**, `text-transform` non li tocca. Sette
   allarmi su diciassette erano miei. Il vocabolario dei plurali è corto e
   dichiarato per la stessa ragione: meglio guardare poche parole e sapere
   quali, che una regola generale che sbaglia tre volte su quattro e insegna a
   non guardarla.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8641;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

/* IL CASO LIMITE: un cliente con una fattura scaduta di UN giorno e una no,
   e una seconda fattura con ESATTAMENTE un DDT collegato. La scadenza si
   calcola qui — una data incollata sarebbe scaduta di un numero diverso ogni
   giorno, e la prova direbbe cose diverse a seconda di quando gira. */
const ieri = new Date(); ieri.setDate(ieri.getDate() - 1);
const IERI = `${ieri.getFullYear()}-${String(ieri.getMonth() + 1).padStart(2, "0")}-${String(ieri.getDate()).padStart(2, "0")}`;
/* ⛔ E LA SECONDA FATTURA DELLO STESSO CLIENTE DEVE SCADERE NEL FUTURO, per lo
   stesso motivo: era scritta «2026-08-30», e dal 31/08 l'estratto conto diceva
   «× 2 fatture scadute» dove il banco pretendeva UNA — un banco che porta
   dentro una data assoluta invecchia col calendario, e accusa il prodotto di
   una cosa che ha fatto il tempo. Misurato il 02/09. */
const fra = new Date(); fra.setDate(fra.getDate() + 30);
const FRA30 = `${fra.getFullYear()}-${String(fra.getMonth() + 1).padStart(2, "0")}-${String(fra.getDate()).padStart(2, "0")}`;
const CASI = `
/* ── casi montati dal banco conti-frasi.mjs (mai sul disco) ── */
DEMO.clienti.push({ id: "zc1", ragioneSociale: "Monoscadenza Srl", piva: "11111111111",
  sdi: "ZZZ1111", indirizzo: "Via Uno 1, Ragusa", sconto: 0, fido: 9000, note: "" });
DEMO.fatture.push({ id: "zuno", numero: "2026/099", cliente: "Monoscadenza Srl", clienteId: "zc1",
  importo: 1220, imponibile: 1000, ivaImporto: 220, totale: 1220, aliquotaIva: 22,
  emessa: "2026-07-06", scadenza: "${IERI}", incassata: false });
DEMO.pesate.push({ id: "zp1", numero: "2026/099", data: "2026-07-30", clienteId: "zc1",
  cliente: "Monoscadenza Srl", prodottoId: DEMO.prodotti[0].id, prodotto: DEMO.prodotti[0].nome,
  lordo: 30, tara: 20, netto: 10, unitaVendita: "t", quantita: 10, densita: null,
  prezzoUnitario: 10, aliquotaIva: 22, mezzo: "AA111BB", destinatario: "Cantiere Uno", fatturaId: "zddt" });
DEMO.fatture.push({ id: "zddt", numero: "2026/098", cliente: "Monoscadenza Srl", clienteId: "zc1",
  importo: 122, imponibile: 100, ivaImporto: 22, totale: 122, aliquotaIva: 22, tipo: "differita",
  righe: [{ descrizione: DEMO.prodotti[0].nome, quantita: 10, unita: "t", prezzoUnitario: 10,
            scontoPct: 0, imponibile: 100, aliquota: 22, ddt: ["2026/099"] }],
  ddtIds: ["zp1"], emessa: "2026-07-30", scadenza: "${FRA30}", incassata: false });
`;

/* LA CONTROPROVA rimette i plurali fissi nella PAGINA servita, e CONTA le
   sostituzioni: un `replace` che non trova niente esce in silenzio, e una
   controprova che non inietta dichiara verde una prova che non ha provato. */
const DIFETTI = [
  // 1. la finestra dell'eliminazione, col conto dei DDT
  [`return n ? \`<p>\${n === 1 ? \`Il <b>DDT collegato</b> torna\` : \`I <b>\${n} DDT</b> collegati tornano\`} fra quelli <b>da fatturare</b>: \${n === 1 ? "la consegna non si perde, si rimette" : "le consegne non si perdono, si rimettono"} in coda.</p>\` : ""; })()}`,
   `return n ? \`<p>I <b>\${n} DDT</b> collegati tornano fra quelli <b>da fatturare</b>: le consegne non si perdono, si rimettono in coda.</p>\` : ""; })()}`],
  // 2. l'import del listino
  [`\`Import listino: \${plur(agg, "prodotto aggiunto", "prodotti aggiunti")}\${dup ? \`, \${plur(dup, "già presente (saltato)", "già presenti (saltati)")}\` : ""}\${ripetute ? \`, \${plur(ripetute, "ripetuto nel file", "ripetuti nel file")}\` : ""}.\``,
   `\`Import listino: \${agg} prodotti aggiunti\${dup ? \`, \${dup} già presenti (saltati)\` : ""}\${ripetute ? \`, \${ripetute} ripetuti nel file\` : ""}.\``],
  // 3. l'import delle gare
  [`\`Import gare: \${plur(agg, "gara aggiunta", "gare aggiunte")}\${dup ? \`, \${plur(dup, "gi\\u00e0 presente (saltata)", "gi\\u00e0 presenti (saltate)")}\` : ""}\${ripetute ? \`, \${plur(ripetute, "ripetuta nel file", "ripetute nel file")}\` : ""}.\``,
   `\`Import gare: \${agg} aggiunte\${dup ? \`, \${dup} già presenti (saltate)\` : ""}\${ripetute ? \`, \${ripetute} ripetute nel file\` : ""}.\``],
  // 4. l'import delle fatture
  [`"Import fatture: " + plur(add, "fattura aggiunta", "fatture aggiunte")`,
   `"Import fatture: " + add + " aggiunte"`],
  // 5. l'export del listino
  /* ⛔ INIEZIONE SCADUTA E RIPUNTATA (08/08). Cercava la frase com'era prima
     che arrivasse `plurale(...)` per il PARTICIPIO — «Esportato/Esportati» —
     e da allora non trovava più niente: la pagina restava sana, il banco «non
     distingueva», e la riga che lo diceva stava in fondo al registro. È la
     terza delle cinque cause: l'iniezione che non inietta. */
  [`esito("lis-esito", plurale(PRO.length, "Esportato ", "Esportati ") + plur(PRO.length, "prodotto", "prodotti") + " (CSV).", "success");`,
   `esito("lis-esito", \`Esportati \${PRO.length} prodotti (CSV).\`, "success");`],
  /* 6-8. le UNITÀ NUDE dentro le etichette in maiuscolo. Tre iniezioni e non
     una: il difetto stava su tre etichette della stessa riga di form, e la
     prima stesura del righello ne vedeva DUE — quindi togliendone una sola la
     controprova avrebbe potuto passare per la ragione sbagliata. */
  [`<label for="pes-lordo">Lordo (<span class="u">t</span>)</label>`, `<label for="pes-lordo">Lordo (t)</label>`],
  [`<label for="pes-tara">Tara (<span class="u">t</span>)</label>`, `<label for="pes-tara">Tara (t)</label>`],
  [`<label for="pes-netto">Netto (<span class="u">t</span>)</label>`, `<label for="pes-netto">Netto (t)</label>`],
  /* 9. e l'esenzione sulla CARTA: basta togliere la regola perché le
     intestazioni del DDT tornino «LORDO (T)». È l'iniezione più piccola di
     tutte e colpisce il documento che esce di mano. */
  [`  #stampa .u{text-transform:none; letter-spacing:.2px}`, `  #stampa .u-spenta{text-transform:none}`],
];
/* e uno sta nel MODULO, non nella pagina: il sollecito e l'estratto conto li
   compone `conti-data.js`. Rimettendo solo quelli della pagina, le due lettere
   resterebbero giuste e la prova che le guarda passerebbe — l'iniezione
   puntata nel posto sbagliato, la quarta causa dell'elenco di CLAUDE.md. */
const DIFETTI_MODULO = [
  [`\${conta(ritardo, "giorno", "giorni")} di ritardo`, `\${ritardo} giorni di ritardo`, 2],
  [`\${conta(scaduteN, "fattura scaduta", "fatture scadute")}`, `\${scaduteN} fatture scadute`, 1],
];

let iniezioniCasi = 0, iniezioniDifetti = 0, mancate = 0;
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* il contrassegno col proprio pid, riletto dal server: un banco che trova la
     porta occupata e la RIUSA misura la copia di qualcun altro */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith("apps/conti/conti-data.js")) {
    let t = corpo.toString("utf8") + CASI; iniezioniCasi++;
    if (CONTROPROVA) for (const [da, a, quanti] of DIFETTI_MODULO) {
      const n = t.split(da).length - 1;
      if (n !== quanti) { console.log(`⛔ INIEZIONE MANCATA nel modulo: ${n} soggetti (attesi ${quanti}) per «${da.slice(0, 40)}…»`); mancate++; continue; }
      t = t.split(da).join(a); iniezioniDifetti += n;
    }
    corpo = Buffer.from(t, "utf8");
  }
  if (CONTROPROVA && p.endsWith("apps/conti/index.html")) {
    let t = corpo.toString("utf8");
    for (const [da, a] of DIFETTI) {
      const n = t.split(da).length - 1;
      if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA: ${n} soggetti per «${da.slice(0, 50)}…»`); mancate++; continue; }
      t = t.replace(da, a); iniezioniDifetti++;
    }
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
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); } }
console.log(`porta ${porta} · contrassegno = pid ${process.pid} ✔ · fattura scaduta il ${IERI} (un giorno)`);

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
await pg.addInitScript(() => {
  window.print = () => {};
  /* ⛔ LA COPIA NEGLI APPUNTI VA FATTA FALLIRE. Se riesce, il sollecito e
     l'estratto conto NON compaiono in nessuna finestra — `copia` apre la
     modale di ripiego solo quando il browser rifiuta — e il banco misurerebbe
     il vuoto credendo di leggere la lettera. Costa due righe e senza di esse
     la prima stesura ha stampato «(nessuna modale)» dichiarandosi verde. */
  Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("no")) }, configurable: true });
  document.execCommand = () => false;
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/conti/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (b, t, x) => { if (b) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 320)}` : ""}`); } };
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi >= 1, "i casi limite sono stati appesi al modulo servito", iniezioniCasi);
if (CONTROPROVA) console.log(`  · controprova: ${iniezioniDifetti} difetti rimessi, ${mancate} iniezioni mancate`);

const apriTutto = async () => {
  for (const a of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary")) {
    await a.click({ timeout: 2500 }).catch(() => {}); await pg.waitForTimeout(70);
  }
  await pg.waitForTimeout(350);
};
const vai = async (s) => {
  await pg.click(`#nav-${s}`).catch(() => {});
  await pg.waitForTimeout(620);
  /* ⛔ LA PROVA DI AVER NAVIGATO, prima di misurare: un click che cade nel
     vuoto lascia il banco a fotografare la stessa schermata otto volte, e a
     dire «tutto a posto» dopo averne guardata una su otto. */
  const viva = await pg.evaluate(() => [...document.querySelectorAll(".page")]
    .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id));
  if (!viva.includes(`page-${s}`)) { dice(false, `navigato alla schermata ${s}`, viva); return false; }
  await apriTutto();
  return true;
};

/* ── LA RACCOLTA: il testo PROPRIO di ogni elemento visibile, più i testi che
      non stanno nel corpo (aria-label e title). «Proprio» vuol dire i suoi
      nodi di testo, non quelli dei figli: se no ogni frase si conterebbe una
      volta per antenato e il numero dei soggetti sarebbe una bugia. ── */
const RACCOGLI = () => {
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const proprio = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
      .map((n) => n.textContent.replace(/\s+/g, " ").trim()).join(" ");
    if (!proprio) return;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
    out.push({ t: proprio, up: getComputedStyle(el).textTransform === "uppercase",
      cls: (typeof el.className === "string" ? el.className : "").slice(0, 40) });
  });
  document.querySelectorAll("[aria-label],[title]").forEach((el) => {
    for (const a of ["aria-label", "title"]) {
      const v = el.getAttribute(a);
      if (v && v.trim()) out.push({ t: v.trim(), up: false, cls: "@" + a });
    }
  });
  return out;
};

/* IL VOCABOLARIO È CORTO DI PROPOSITO, e dichiarato: sono le parole che in
   Conti compaiono davvero accanto a un conteggio. Una regola generale sul
   plurale italiano sbaglierebbe più di quanto prende — e un allarme che
   sbaglia insegna a non guardarlo. */
const PLURALI = ["fatture", "prodotti", "clienti", "righe", "mesi", "giorni", "gare", "pesate",
  "movimenti", "incassi", "voci", "ordini", "note", "costi", "volte", "anni", "documenti",
  "solleciti", "scadenze", "aliquote", "acconti", "spese", "aggiunte", "aggiunti", "saltati",
  "saltate", "ripetuti", "ripetute", "presenti", "aperti", "aperte", "scaduti", "scadute",
  "registrati", "registrate", "collegati", "collegate", "incassate", "saldate", "leggibili",
  "mancanti", "sono", "hanno", "vanno", "quelli", "quelle"];
/* le UNITÀ che il maiuscolo corrompe davvero. «€» e «%» NON ci sono: non
   hanno maiuscola, `text-transform` non li tocca, e metterceli produce sette
   falsi allarmi su diciassette (misurato). */
const UNITA = ["m³", "m²", "t/m³", "€/m³", "€/t", "kg", "gg", "mc", "cm", "mm", "km", "t"];

const guardate = [];
const segnala = (schermata, f) => {
  const t = f.t.replace(/ /g, " ").replace(/\s+/g, " ");
  const p = t.split(/[^0-9A-Za-zÀ-ÿ°³²€%/]+/).filter(Boolean);
  const fuori = [];
  for (let i = 0; i < p.length; i++) {
    if (!/^\d+$/.test(p[i])) continue;
    if (+p[i] !== 1) continue;
    for (let k = 1; k <= 3 && i + k < p.length; k++) {
      const w = p[i + k].toLowerCase();
      if (/^\d/.test(w)) break;                       // un altro numero: cambia soggetto
      if (PLURALI.includes(w)) { fuori.push({ tipo: "«1» con una parola al plurale", w, t: t.slice(0, 200) }); break; }
    }
  }
  /* ⚠️ SI GUARDANO TUTTE LE OCCORRENZE, NON LA PRIMA — e questo righello ha
     sbagliato proprio qui, alla sua prima misura vera. Con `indexOf` da solo
     «Lordo (t)» e «Tara (t)» uscivano e «**Netto (t)**» no: la prima «t» di
     «Netto» sta dentro la parola, il controllo la scartava giustamente… e poi
     passava all'unità successiva invece di cercare la «t» dopo. Tre etichette
     rotte nella STESSA riga di form, e il banco ne vedeva due — cioè
     rispondeva «trovate» dicendo un numero sbagliato, che è peggio di zero
     perché sembra una misura. È «il controllo che non guarda dove crede»
     applicato a sé stesso. */
  if (f.up) for (const u of UNITA) {
    let trovata = false;
    for (let j = t.indexOf(u); j >= 0; j = t.indexOf(u, j + 1)) {
      const pr = j === 0 ? " " : t[j - 1], dp = t[j + u.length] || " ";
      if (/[\s\d(/·,]/.test(pr) && !/[a-zA-ZÀ-ÿ]/.test(dp)) { trovata = true; break; }
    }
    if (trovata) { fuori.push({ tipo: "unità in MAIUSCOLO", w: u, t }); break; }
  }
  fuori.forEach((x) => guardate.push({ ...x, schermata, cls: f.cls, colpevole: true }));
  guardate.push({ schermata, colpevole: false });
};

const SEZ = ["dash", "fat", "ban", "ord", "pes", "cos", "lis", "cli", "gar", "rep"];
for (const s of SEZ) {
  if (!(await vai(s))) continue;
  (await pg.evaluate(RACCOGLI)).forEach((f) => segnala(s, f));
}

/* ── LE FINESTRE. Il sollecito e l'estratto conto sono TESTO in una textarea:
      `innerText` lì non lo vede, va letto il `value`. ── */
const modale = async (nome, azione) => {
  await azione();
  await pg.waitForTimeout(700);
  const r = await pg.evaluate(() => {
    const m = document.getElementById("modal-body"); if (!m) return null;
    const ta = m.querySelector("textarea");
    const el = [...m.querySelectorAll("*")].map((e) => {
      const pr = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.replace(/\s+/g, " ").trim()).join(" ");
      return pr ? { t: pr, up: getComputedStyle(e).textTransform === "uppercase",
                    cls: (typeof e.className === "string" ? e.className : "").slice(0, 40) } : null;
    }).filter(Boolean);
    return { testo: ta ? ta.value : m.innerText.replace(/\s+/g, " ").trim(), el };
  });
  if (!r || (!r.testo && !r.el.length)) { dice(false, `la finestra «${nome}» si è aperta con del testo dentro`, r); return ""; }
  r.el.forEach((f) => segnala("finestra:" + nome, f));
  if (r.testo) segnala("finestra:" + nome, { t: r.testo, up: false, cls: "@testo" });
  if (DIMMI) console.log(`\n[${nome}]\n${r.testo}\n`);
  await pg.keyboard.press("Escape").catch(() => {}); await pg.waitForTimeout(350);
  return r.testo;
};

await vai("fat");
const soll = await modale("sollecito · scaduta da UN giorno", () => pg.click('[data-sollecito="zuno"]'));
dice(/\(1 giorno di ritardo\)/.test(soll), "il sollecito scrive «1 giorno di ritardo»", soll.split("\n")[3]);
dice(!/\b1 giorni\b/.test(soll), "e mai «1 giorni» — è la lettera che arriva al cliente", soll.slice(0, 240));

await vai("fat");
const del = await modale("elimina fattura · UN DDT collegato", () => pg.click('[data-del-fat="zddt"]'));
dice(/Il DDT collegato torna/.test(del), "la finestra dell'eliminazione parla di UN DDT al singolare", del.slice(-220));
dice(!/I 1 DDT/.test(del), "e non scrive «I 1 DDT collegati»", del.slice(-220));

await vai("rep");
const espo = await pg.evaluate(() => [...document.querySelectorAll("[data-espo]")]
  .map((x) => [x.getAttribute("data-espo"), (x.closest(".item") || x.parentElement).innerText.slice(0, 40)]));
const idx = (espo.find((e) => /Monoscadenza/.test(e[1])) || [])[0];
dice(idx != null, "il cliente del caso limite è fra le esposizioni", espo.map((e) => e[1]));
if (idx != null) {
  const est = await modale("estratto conto · UNA fattura scaduta", () => pg.click(`[data-espo="${idx}"]`));
  dice(/× 1 fattura scaduta\)/.test(est), "l'estratto conto scrive «× 1 fattura scaduta»", (est.split("\n").find((r) => /art\. 6/.test(r)) || est.slice(0, 200)));
  dice(!/1 fatture scadute/.test(est), "e non «1 fatture scadute»", est.slice(0, 240));
}

/* ── GLI IMPORT E GLI EXPORT: i contatori a UNO si costruiscono col file.
      Tre righe: una nuova, la stessa ripetuta nel file, e una già in archivio
      → agg = 1, ripetute = 1, dup = 1 in un colpo solo. ── */
const importa = async (sez, input, nome, csv, esitoId) => {
  if (!(await vai(sez))) return "";
  await pg.setInputFiles(`#${input}`, { name: nome, mimeType: "text/csv", buffer: Buffer.from(csv, "utf8") });
  await pg.waitForTimeout(1400);
  const t = await pg.evaluate((id) => { const e = document.getElementById(id); return e ? e.innerText.replace(/\s+/g, " ").trim() : ""; }, esitoId);
  segnala("import:" + nome, { t, up: false, cls: "@esito" });
  if (DIMMI) console.log(`\n[${nome}] ${t}`);
  return t;
};
const impFat = await importa("fat", "fat-file", "fatture.csv",
  "numero;cliente;importo;emessa;scadenza\nZ/001;Nuovo Cliente;100;2026-07-01;2026-08-01\n"
  + "Z/001;Nuovo Cliente;100;2026-07-01;2026-08-01\n2026/031;Edilcave Srl;18300;2026-06-07;2026-07-08\n", "ft-esito");
dice(/1 fattura aggiunta/.test(impFat) && !/\b1 aggiunte\b/.test(impFat), "import fatture: «1 fattura aggiunta»", impFat);
dice(!/1 già presenti/.test(impFat), "import fatture: «1 già presente», non «presenti»", impFat);

const impLis = await importa("lis", "lis-file", "listino.csv",
  "nome;unita;prezzo;densita;iva\nZeta 0/10;t;12,50;;22\nZeta 0/10;t;12,50;;22\nStabilizzato 0/30;t;8,50;1,9;22\n", "lis-esito");
dice(/1 prodotto aggiunto/.test(impLis), "import listino: «1 prodotto aggiunto»", impLis);
dice(!/1 prodotti aggiunti|1 già presenti|1 ripetuti/.test(impLis), "import listino: nessun plurale fisso in testa", impLis);
dice(/per quello non posso convertire/.test(impLis), "import listino: la coda concorda con la testa («per quello»)", impLis);

const impGar = await importa("gar", "gar-file", "gare.csv",
  "titolo;base;scadenza;stato\nGara Zeta;5000;2026-12-01;aperta\nGara Zeta;5000;2026-12-01;aperta\n"
  + "ANAS — manutenzione SS115;340000;2026-08-12;aperta\n", "gar-esito");
dice(/1 gara aggiunta/.test(impGar) && !/\b1 aggiunte\b/.test(impGar), "import gare: «1 gara aggiunta»", impGar);
dice(!/1 già presenti|1 ripetute/.test(impGar), "import gare: nessun plurale fisso", impGar);

/* ⛔ IL FOGLIO DEL DDT — E LA TRASFORMAZIONE VA CHIESTA IN MEDIA «PRINT».
   `#stampa th` è in maiuscolo, e le intestazioni scrivevano «Lordo (t)»: sul
   documento di trasporto che il camionista si porta dietro usciva «LORDO (T)»,
   cioè il tesla al posto della tonnellata. Fuori dalla stampa quella regola CSS
   non si applica, quindi un banco che legge la pagina normale risponde
   «pulito» — è il controllo che non guarda dove crede, col filtro nascosto
   dentro un media query. */
if (await vai("pes")) {
  const ddt = await pg.$("[data-stampa-ddt]");
  if (!ddt) dice(false, "c'è un DDT da stampare nella dimostrazione");
  else {
    await ddt.click(); await pg.waitForTimeout(500);
    await pg.emulateMedia({ media: "print" }); await pg.waitForTimeout(250);
    const th = await pg.evaluate(() => [...document.querySelectorAll("#stampa th")].map((e) => ({
      testo: e.textContent.replace(/\s+/g, " ").trim(),
      /* la trasformazione EFFETTIVA dei figli: l'unità sta dentro uno `<span>`,
         e la sua esenzione si vede solo chiedendola a lui */
      unita: [...e.querySelectorAll(".u")].map((u) => ({ t: u.textContent, tt: getComputedStyle(u).textTransform })),
      tt: getComputedStyle(e).textTransform })));
    await pg.emulateMedia({ media: "screen" });
    const conUnita = th.filter((x) => /\((t|kg|m³|mc)\)/.test(x.testo));
    dice(th.length > 0, "il foglio del DDT ha delle intestazioni di tabella", th.length);
    dice(conUnita.length === 3, "tre intestazioni del DDT portano un'unità (lordo, tara, netto)", th.map((x) => x.testo));
    dice(conUnita.every((x) => x.unita.length === 1 && x.unita[0].tt === "none"),
      "e su carta l'unità NON va in maiuscolo: «(t)», mai «(T)»", conUnita);
    await pg.keyboard.press("Escape").catch(() => {});
    await pg.waitForTimeout(250);
  }
}

/* l'export del listino con UN prodotto solo: era l'unico dei sette export
   dell'app che non passava dalla regola. I prodotti si tolgono DALLA PAGINA,
   non dai dati serviti: toglierli dai dati romperebbe le pesate che li citano,
   cioè costruirebbe un secondo caso limite in mezzo a questo. */
if (await vai("lis")) {
  const resti = await pg.evaluate(async () => {
    const attesa = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let giro = 0; giro < 15; giro++) {
      const el = [...document.querySelectorAll("[data-del-pro]")];
      if (el.length <= 1) break;
      el[el.length - 1].click(); await attesa(300);
      const si = [...document.querySelectorAll("#modal-foot button")]
        .find((b) => /elimina|conferma|s\u00ec/i.test(b.textContent));
      if (!si) break;
      si.click(); await attesa(550);
    }
    return document.querySelectorAll("[data-del-pro]").length;
  }).catch(() => -1);
  dice(resti === 1, "resta UN prodotto solo in listino (il caso limite dell'export)", resti);
  if (resti === 1) {
    await pg.click("#btn-lis-export").catch(() => {});
    await pg.waitForTimeout(700);
    const t = await pg.evaluate(() => ((document.getElementById("lis-esito") || {}).innerText || "").replace(/\s+/g, " ").trim());
    segnala("export:listino", { t, up: false, cls: "@esito" });
    /* ⛔ L'ASSERZIONE È INVECCHIATA PERCHÉ IL PRODOTTO È MIGLIORATO, e allora
       si corregge rendendola PIÙ GIUSTA, non più permissiva. Pretendeva
       «EsportatI 1 prodotto», che era il testo del 06/08; il 07/08 è arrivato
       `plurale(...)` sul PARTICIPIO e la pagina scrive «EsportatO 1 prodotto»,
       che in italiano è la forma giusta — con «1» cambiano l'articolo, la
       preposizione **e il verbo**.
       Quindi non si allarga a `/Esportat[oi]/`: si pretende il participio
       SINGOLARE, e in più che il plurale non compaia. */
    dice(/Esportato 1 prodotto \(CSV\)/.test(t) && !/Esportati/.test(t),
      "export listino con UN prodotto: «Esportato 1 prodotto (CSV)», participio al singolare", t);
  }
}

/* ── L'ESITO. Prima i soggetti guardati, poi le violazioni: un «nessuna
      violazione» senza il numero accanto può voler dire «non ho guardato». ── */
const colpevoli = guardate.filter((x) => x.colpevole);
const chiave = (x) => x.tipo + "|" + x.w + "|" + x.t;
const unici = [...new Map(colpevoli.map((x) => [chiave(x), x])).values()];
const schermate = new Set(guardate.map((x) => x.schermata));
console.log(`\n${guardate.length - colpevoli.length} frasi renderizzate guardate su ${schermate.size} schermate`);
for (const x of unici) { ko++; console.log(`  KO  [${x.tipo}] «${x.w}» · ${x.schermata} · .${x.cls}\n        ${x.t.slice(0, 180)}`); }
if (!unici.length) { ok++; console.log("  ok  nessuna frase con «1» accanto a un plurale, nessuna unità in maiuscolo"); }

console.log(`\nEsito: ${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA && mancate) { console.log("⛔ la controprova non ha iniettato tutto: il suo esito non vale"); process.exit(2); }
process.exit(ko > 0 ? 1 : 0);

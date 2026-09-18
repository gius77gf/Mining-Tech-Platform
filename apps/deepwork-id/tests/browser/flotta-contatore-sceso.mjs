/* IL CONTATORE SOSTITUITO O AZZERATO ERA DECISO IN QUATTRO POSTI DIVERSI,
   CON QUATTRO REGOLE DIVERSE
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-contatore-sceso.mjs [--porta=8994]
     node flotta-contatore-sceso.mjs --controprova   (rimette i due difetti: DEVE fallire)

   PERCHÉ ESISTE. Dal quarto giro di deep-pass QA su Flotta (18/09), un
   agente ha trovato due difetti complementari sull'aggiornamento delle ore
   di un mezzo, nessuno dei quali passa dall'unica regola vera
   (`validaRifornimento`, che gestisce il contatore sostituito con
   `contatoreNuovo`/`oreVecchie`):
   1. «Registra ore» (`btn-ore`) era troppo RIGIDO: rifiutava SEMPRE una
      lettura più bassa, anche quando il contatore era stato davvero
      sostituito — l'unica via d'uscita era passare dal Rifornimento, che
      però vuole anche litri e spesa. Corretto aggiungendo la stessa
      dichiarazione (`ore-nuovo`), che scrive anche un rifornimento a zero
      litri con `contatoreNuovo`: è l'unico posto che
      `azzeramentiDelMezzo` legge, quindi senza quella scrittura il numero
      su `mezzi.ore` sarebbe scollegato dalle letture storiche.
   2. «Modifica mezzo» (dentro `btn-mez`, ramo `editMez`) era troppo
      PERMISSIVO: scriveva qualunque valore di `ore`, anche più basso di
      quello attuale, senza errori né dichiarazione — e una discesa così
      non crea nessun azzeramento, quindi `consumoPerMezzo`/
      `ritmoOreMezzi`/`vitaComponenti` restavano ancorati alla serie
      vecchia. Corretto bloccando la discesa in quel modulo (che è
      un'anagrafica generica, non un evento di lettura) e rimandando a
      «Registra ore» per una sostituzione vera.

   Le verifiche leggono lo SCHERMO, non `localStorage`: in dimostrazione
   `flottaData()` tiene i dati in un oggetto di memoria dentro la sua stessa
   chiusura (`mem`), mai scritto su `localStorage` — a differenza di Genesi.
   Il segno che l'azzeramento è stato registrato davvero è la frase che
   `contatoreSostituitoTx` aggiunge da sola alla riga del mezzo quando
   trova un rifornimento con `contatoreNuovo` per quel nome. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { prendiChromium, CHROMIUM, vaiA } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || resolve(QUI, "../../../..");
const CONTROPROVA = process.argv.includes("--controprova");
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

/* I DUE DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/flotta/index.html",
   "    const ore = rno.valore;\n"
   + "    const contatoreNuovo = $(\"ore-nuovo\").checked;\n"
   + "    /* ⛔ 18/09, dal quarto giro di deep-pass QA: senza `contatoreNuovo` questo\n"
   + "       widget era l'unico posto della pagina senza una via d'uscita onesta\n"
   + "       per il contatore sostituito — un numero corretto veniva respinto allo\n"
   + "       stesso modo di un refuso. */\n"
   + "    if (!contatoreNuovo && ore < (m.ore||0)) { err(\"ore-nuove\", true);\n"
   + "      esito(\"ore-esito\", \"Hai scritto \" + conta(ore, \"ora\", \"ore\") + \", ma il mezzo ne ha già \" + numTx(m.ore||0) + \": il contatore non può scendere. Controlla il numero, oppure segna che il contatore è nuovo o azzerato.\", \"err\");\n"
   + "      fuoco(\"ore-nuove\"); return; }\n"
   + "    err(\"ore-nuove\", false);\n"
   + "    occupato(\"btn-ore\", true);\n"
   + "    /* Il contatore dichiarato nuovo si registra come `azzeramentiDelMezzo`\n"
   + "       lo legge: un rifornimento a zero litri, con `contatoreNuovo` e le ore\n"
   + "       vecchie prese dal mezzo — la stessa identica forma di `btn-rif`, che\n"
   + "       è l'unico posto dove quella funzione guarda. Senza questa scrittura\n"
   + "       il numero salvato su `mezzi.ore` sarebbe scollegato dalle letture\n"
   + "       storiche: consumo e ritmo continuerebbero a leggere la serie vecchia\n"
   + "       e a dire \"il contatore è sceso\" per sempre. */\n"
   + "    if (contatoreNuovo) {\n"
   + "      await db.aggiungi(\"rifornimenti\", { data: oggiISO(), mezzo: m.nome.split(\" — \")[0], litri: 0, euro: 0,\n"
   + "        ore, contatoreNuovo: true, oreVecchie: numeroDichiarato(m.ore), nota: \"Contatore sostituito o azzerato (Registro ore)\" });\n"
   + "    }\n"
   + "    await db.aggiorna(\"mezzi\", id, { ore });\n"
   + "    $(\"ore-nuove\").value = \"\"; $(\"ore-nuovo\").checked = false;\n"
   + "    esito(\"ore-esito\", plurale(ore, \"Registrata \", \"Registrate \") + conta(ore, \"ora\", \"ore\") + \" su \" + m.nome.split(\" — \")[0]\n"
   + "      + (contatoreNuovo ? \" (contatore nuovo: il consumo e il ritmo d'uso ripartono da qui).\" : \".\"), \"success\");\n"
   + "    occupato(\"btn-ore\", false); await refresh();",
   "    const ore = rno.valore;\n"
   + "    if (ore < (m.ore||0)) { err(\"ore-nuove\", true);\n"
   + "      esito(\"ore-esito\", \"Hai scritto \" + conta(ore, \"ora\", \"ore\") + \", ma il mezzo ne ha già \" + numTx(m.ore||0) + \": il contatore non può scendere. Controlla il numero.\", \"err\");\n"
   + "      fuoco(\"ore-nuove\"); return; }\n"
   + "    err(\"ore-nuove\", false);\n"
   + "    esito(\"ore-esito\", plurale(ore, \"Registrata \", \"Registrate \") + conta(ore, \"ora\", \"ore\") + \" su \" + m.nome.split(\" — \")[0] + \".\", \"success\");\n"
   + "    occupato(\"btn-ore\", true);\n"
   + "    await db.aggiorna(\"mezzi\", id, { ore }); $(\"ore-nuove\").value = \"\"; occupato(\"btn-ore\", false); await refresh();"],
  ["apps/flotta/index.html",
   "    const ore = rmo.ok ? rmo.valore : null;\n"
   + "    /* ⛔ 18/09, dal quarto giro di deep-pass QA: QUESTO era l'unico dei\n"
   + "       quattro posti che scrivono `mezzi.ore` senza nessuna guardia — il\n"
   + "       rifornimento e l'import telemetria rifiutano una discesa non\n"
   + "       dichiarata, «Registra ore» adesso la dichiara con la sua checkbox\n"
   + "       (vedi sopra); «Modifica mezzo» scriveva qualunque numero, e una\n"
   + "       discesa qui non crea nessun azzeramento: `azzeramentiDelMezzo` non la\n"
   + "       vede, quindi `consumoPerMezzo`/`ritmoOreMezzi`/`vitaComponenti`\n"
   + "       restano ancorati alla serie vecchia mentre il contatore del mezzo è\n"
   + "       già sceso — due fonti scollegate senza che nulla lo dichiari. Non è\n"
   + "       il posto giusto per aggiungere la stessa dichiarazione (è un form\n"
   + "       generico di anagrafica, non un evento di lettura): una discesa vera\n"
   + "       si registra da «Registro ore», che quella dichiarazione ce l'ha. */\n"
   + "    if (editMez && ore != null) {\n"
   + "      const prima = MEZ.find(x => x.id === editMez);\n"
   + "      if (prima && numeroDichiarato(prima.ore) != null && ore < prima.ore) {\n"
   + "        err(\"mez-ore\", true);\n"
   + "        esito(\"ore-esito\", \"Hai scritto \" + conta(ore, \"ora\", \"ore\") + \", ma il mezzo ne ha già \" + numTx(prima.ore)\n"
   + "          + \": qui il contatore non può scendere. Se è stato davvero sostituito o azzerato, dichiaralo da «Registro ore» qui sotto, non da questo modulo.\", \"err\");\n"
   + "        fuoco(\"mez-ore\"); return;\n"
   + "      }\n"
   + "      err(\"mez-ore\", false);\n"
   + "    }",
   "    const ore = rmo.ok ? rmo.valore : null;"],
];
const difettiRimessi = new Set();

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
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA in ${file}: ${n} soggetti invece di 1 -> ${JSON.stringify(cerca.slice(0, 60))}`); continue; }
    corpo = Buffer.from(t.replace(cerca, sost), "utf8"); difettiRimessi.add(file + "\n" + cerca);
  }
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream", "cache-control": "no-store" });
  s.end(corpo);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const porta = srv.address().port;
const c = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text());
if (c !== String(process.pid)) { console.error("✗ contrassegno: il server sulla porta non è il mio"); process.exit(2); }

let ok = 0, ko = 0;
const dice = (cond, t, x) => { if (cond) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? " -> " + JSON.stringify(x).slice(0, 400) : ""}`); } };

const chromium = await prendiChromium();
const b = await chromium.launch({ executablePath: CHROMIUM });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, locale: "it-IT" });
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => (document.getElementById("mez-list")?.innerHTML.length || 0) > 0); }
dice(pronto, "la pagina di Flotta è pronta (in dimostrazione)");
await vaiA(pg, "flotta", "nav-mez");

const metaDi = (nomeParziale) => pg.evaluate((n) => {
  const items = [...document.querySelectorAll("#mez-list .item")];
  const riga = items.find((el) => el.textContent.includes(n));
  return riga ? riga.querySelector(".meta")?.textContent || "" : null;
}, nomeParziale);

/* ── 1. «Registra ore»: senza dichiarazione una discesa resta rifiutata ── */
const metaE2Prima = await metaDi("Escavatore E2");
dice(metaE2Prima != null, "trovato «Escavatore E2» nella lista mezzi", metaE2Prima);
dice(!!metaE2Prima && !/contatore sostituito/.test(metaE2Prima), "e nessun azzeramento dichiarato di partenza", metaE2Prima);

const scelto = await pg.evaluate(() => {
  const s = document.getElementById("ore-mezzo");
  const opt = [...s.options].find((o) => o.textContent.includes("Escavatore E2"));
  if (!opt) return false;
  s.value = opt.value; s.dispatchEvent(new Event("change")); return true;
});
dice(scelto, "«Escavatore E2» selezionabile nel Registro ore");
if (scelto) {
  await pg.fill("#ore-nuove", "100");
  await pg.evaluate(() => { document.getElementById("ore-nuovo").checked = false; });
  await pg.click("#btn-ore");
  await pg.waitForTimeout(400);
  const metaDopoRifiuto = await metaDi("Escavatore E2");
  const erroreVisibile = await pg.evaluate(() => document.getElementById("ore-esito").textContent);
  dice(!!metaDopoRifiuto && /3\.210/.test(metaDopoRifiuto), "senza dichiarare il contatore nuovo, la discesa resta rifiutata: le ore non cambiano", metaDopoRifiuto);
  dice(/non può scendere/.test(erroreVisibile), "e lo dice", erroreVisibile);

  /* ── 2. Dichiarando il contatore nuovo, la discesa entra E si registra come azzeramento ── */
  await pg.evaluate(() => { document.getElementById("ore-nuovo").checked = true; });
  await pg.click("#btn-ore");
  await pg.waitForTimeout(400);
  const metaDopoAzzeramento = await metaDi("Escavatore E2");
  dice(!!metaDopoAzzeramento && /100 ore motore/.test(metaDopoAzzeramento),
    "⛔ dichiarando il contatore nuovo, la discesa a 100 h viene accettata", metaDopoAzzeramento);
  dice(!!metaDopoAzzeramento && /contatore sostituito il/.test(metaDopoAzzeramento),
    "⛔ e la riga dichiara da sola l'azzeramento: un rifornimento con contatoreNuovo è stato registrato davvero", metaDopoAzzeramento);
}

/* ── 3. «Modifica mezzo»: una discesa silenziosa non deve più passare ── */
const metaD1Prima = await metaDi("Dumper D1");
dice(!!metaD1Prima && /8\.420/.test(metaD1Prima), "trovato «Dumper D1», con le sue ore di partenza", metaD1Prima);
const matitaCliccata = await pg.evaluate(() => {
  const items = [...document.querySelectorAll("#mez-list .item")];
  const riga = items.find((el) => el.textContent.includes("Dumper D1"));
  const matita = riga && riga.querySelector("[data-edit-mezzo]");
  if (!matita) return false;
  matita.click(); return true;
});
dice(matitaCliccata, "trovata la matita di modifica su «Dumper D1»");
if (matitaCliccata) {
  await pg.waitForTimeout(300);
  await pg.fill("#mez-ore", "500");
  await pg.click("#btn-mez");
  await pg.waitForTimeout(400);
  const metaD1DopoRifiuto = await metaDi("Dumper D1");
  const erroreModifica = await pg.evaluate(() => document.getElementById("ore-esito").textContent);
  dice(!!metaD1DopoRifiuto && /8\.420/.test(metaD1DopoRifiuto), "⛔ «Modifica mezzo» non fa più scendere le ore in silenzio: il valore resta quello vero", metaD1DopoRifiuto);
  dice(/non può scendere/.test(erroreModifica) && /Registro ore/.test(erroreModifica), "e rimanda a «Registro ore» per una sostituzione vera", erroreModifica);
  // caso di controllo: una correzione verso l'ALTO deve restare permessa, senza nessuna dichiarazione
  await pg.fill("#mez-ore", "8430");
  await pg.click("#btn-mez");
  await pg.waitForTimeout(400);
  const metaD1DopoSalita = await metaDi("Dumper D1");
  dice(!!metaD1DopoSalita && /8\.430/.test(metaD1DopoSalita), "e una correzione verso l'alto da «Modifica mezzo» resta permessa, come sempre", metaD1DopoSalita);
}

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

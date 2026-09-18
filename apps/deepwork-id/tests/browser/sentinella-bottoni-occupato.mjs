/* SENTINELLA: RECLAMI, ADEMPIMENTI, PUNTI DI MISURA E RICETTORI SENZA
   GUARDIA CONTRO IL DOPPIO TOCCO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node sentinella-bottoni-occupato.mjs                 (porta effimera)
     node sentinella-bottoni-occupato.mjs --controprova   (rimette il difetto: DEVE fallire)

   PERCHÉ ESISTE. Dal deep-pass QA su Sentinella (18/09, secondo giro): il
   fix di oggi su `btn-vol` (commit c50d652d) era corretto, ma la sua
   giustificazione — "in demo un doppio click non produce mai un vero
   doppione" — era sbagliata in generale, e ha portato a non controllare
   gli altri bottoni. Verificato dal vivo, sono TUTTI e quattro scritture
   pure senza nessun controllo di doppione (a differenza di btn-prg/btn-tar,
   dove un ricontrollo — anche solo un artefatto della demo — esiste già):
   reclami (`btn-rec`), scadenze/adempimenti (`btn-ade`), punti di misura sul
   percorso "aggiungi" (`btn-sen`) e ricettori sul percorso "aggiungi"
   (`btn-ric`). Gli ultimi due hanno anche la trappola dell'etichetta
   (Aggiungi/Salva modifica), già vista su Terra/Flotta/Scudo. */
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

/* I DIFETTI DA RIMETTERE, parola per parola come stavano prima del 18/09 sera. */
const DIFETTI = [
  ["apps/sentinella/index.html",
   "    err(\"rec-data\", false); err(\"rec-desc\", false);\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia — confermato dal vivo, un\n"
   + "       doppio tocco registra due reclami identici. */\n"
   + "    occupato(\"btn-rec\", true);\n"
   + "    await db.aggiungi(\"reclami\", {\n"
   + "      data, ora: $(\"rec-ora\").value || \"\", tipo: $(\"rec-tipo\").value,\n"
   + "      ricettoreId: $(\"rec-ricettore\").value || \"\", chi: $(\"rec-chi\").value.trim(),\n"
   + "      descrizione: desc, azione: $(\"rec-azione\").value.trim(), stato: \"aperto\",\n"
   + "    });\n"
   + "    occupato(\"btn-rec\", false);\n"
   + "    [\"rec-ora\",\"rec-chi\",\"rec-desc\",\"rec-azione\"].forEach(i => $(i).value = \"\");",
   "    err(\"rec-data\", false); err(\"rec-desc\", false);\n"
   + "    await db.aggiungi(\"reclami\", {\n"
   + "      data, ora: $(\"rec-ora\").value || \"\", tipo: $(\"rec-tipo\").value,\n"
   + "      ricettoreId: $(\"rec-ricettore\").value || \"\", chi: $(\"rec-chi\").value.trim(),\n"
   + "      descrizione: desc, azione: $(\"rec-azione\").value.trim(), stato: \"aperto\",\n"
   + "    });\n"
   + "    [\"rec-ora\",\"rec-chi\",\"rec-desc\",\"rec-azione\"].forEach(i => $(i).value = \"\");"],
  ["apps/sentinella/index.html",
   "    if (adeAlleg) { rec.allegatoNome = adeAlleg.nome; rec.allegatoData = adeAlleg.dataURL; }\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia (il controllo di doppione\n"
   + "       esiste solo sul percorso di import CSV, non qui) — confermato dal\n"
   + "       vivo, un doppio tocco registra due adempimenti identici. */\n"
   + "    occupato(\"btn-ade\", true);\n"
   + "    await db.aggiungi(\"adempimenti\", rec);\n"
   + "    occupato(\"btn-ade\", false);\n"
   + "    const conAlleg = !!adeAlleg;",
   "    if (adeAlleg) { rec.allegatoNome = adeAlleg.nome; rec.allegatoData = adeAlleg.dataURL; }\n"
   + "    await db.aggiungi(\"adempimenti\", rec);\n"
   + "    const conAlleg = !!adeAlleg;"],
  ["apps/sentinella/index.html",
   "    const scelto = $(\"sen-preset\") && $(\"sen-preset\").value ? $(\"sen-preset\").value : \"\";\n"
   + "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia sul percorso \"aggiungi\" —\n"
   + "       confermato dal vivo, un doppio tocco crea due punti di misura\n"
   + "       identici. `occupato(false)` va PRIMA di riscrivere l'etichetta del\n"
   + "       bottone nel ramo di modifica, se no il testo catturato al tocco\n"
   + "       (\"Salva modifica\") cancella il cambio di modo appena fatto. */\n"
   + "    occupato(\"btn-sen\", true);\n"
   + "    if (editMon) {\n"
   + "      const prima = MON.find(x => x.id === editMon) || {};\n"
   + "      const sogliaPreset = scelto || (prima.sogliaPreset && +prima.soglia === soglia && String(prima.unita || \"\") === unita ? prima.sogliaPreset : null);\n"
   + "      await db.aggiorna(\"monitoraggi\", editMon, { nome, unita, soglia, ricettoreId, sogliaPreset, scartoCalibrazioneDb });   // valore/letture restano\n"
   + "      occupato(\"btn-sen\", false);\n"
   + "      editMon = null; $(\"btn-sen\").textContent = \"Aggiungi\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"monitoraggi\", { nome, unita, soglia, ricettoreId, sogliaPreset: scelto || null, scartoCalibrazioneDb, valore: 0, letture: [] });\n"
   + "      occupato(\"btn-sen\", false);\n"
   + "    }",
   "    const scelto = $(\"sen-preset\") && $(\"sen-preset\").value ? $(\"sen-preset\").value : \"\";\n"
   + "    if (editMon) {\n"
   + "      const prima = MON.find(x => x.id === editMon) || {};\n"
   + "      const sogliaPreset = scelto || (prima.sogliaPreset && +prima.soglia === soglia && String(prima.unita || \"\") === unita ? prima.sogliaPreset : null);\n"
   + "      await db.aggiorna(\"monitoraggi\", editMon, { nome, unita, soglia, ricettoreId, sogliaPreset, scartoCalibrazioneDb });   // valore/letture restano\n"
   + "      editMon = null; $(\"btn-sen\").textContent = \"Aggiungi\";\n"
   + "    } else {\n"
   + "      await db.aggiungi(\"monitoraggi\", { nome, unita, soglia, ricettoreId, sogliaPreset: scelto || null, scartoCalibrazioneDb, valore: 0, letture: [] });\n"
   + "    }"],
  ["apps/sentinella/index.html",
   "    /* ⛔ 18/09, dal deep-pass QA: nessuna guardia sul percorso \"aggiungi\" —\n"
   + "       confermato dal vivo, un doppio tocco crea due ricettori identici.\n"
   + "       `occupato(false)` va PRIMA di `svuotaFormRic()`, che riscrive\n"
   + "       l'etichetta del bottone leggendo `editRic` appena azzerato. */\n"
   + "    occupato(\"btn-ric\", true);\n"
   + "    if (editRic) await db.aggiorna(\"ricettori\", editRic, dati);\n"
   + "    else await db.aggiungi(\"ricettori\", dati);\n"
   + "    occupato(\"btn-ric\", false);\n"
   + "    const modificato = !!editRic;\n"
   + "    svuotaFormRic();",
   "    if (editRic) await db.aggiorna(\"ricettori\", editRic, dati);\n"
   + "    else await db.aggiungi(\"ricettori\", dati);\n"
   + "    const modificato = !!editRic;\n"
   + "    svuotaFormRic();"],
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
await pg.goto(`http://127.0.0.1:${porta}/apps/sentinella/index.html`);
let pronto = false;
for (let i = 0; i < 80 && !pronto; i++) { await pg.waitForTimeout(250); pronto = await pg.evaluate(() => document.body.textContent.length > 500); }
dice(pronto, "la pagina di Sentinella è pronta (in dimostrazione)");

const dueVolte = async (btnId) => pg.evaluate((id) => {
  const btn = document.getElementById(id);
  if (!btn) return false;
  btn.click(); btn.click();
  return true;
}, btnId);

/* ── 1. Reclami ── */
await vaiA(pg, "sentinella", "nav-reg");
await pg.waitForTimeout(300);
await pg.fill("#rec-data", "2026-09-10");
await pg.fill("#rec-desc", "Prova doppio tocco");
const nRecPrima = await pg.evaluate(() => document.querySelectorAll("#rec-list .item").length || 0);
dice(await dueVolte("btn-rec"), "trovato «Registra» reclamo e cliccato due volte");
await pg.waitForTimeout(500);
const nRecDopo = await pg.evaluate(() => document.querySelectorAll("#rec-list .item").length || 0);
dice(nRecDopo === nRecPrima + 1, `⛔ Reclami: due tocchi registrano UN reclamo, non due (${nRecPrima} -> ${nRecDopo})`, { nRecPrima, nRecDopo });

/* ── 2. Adempimenti/scadenze ── */
await vaiA(pg, "sentinella", "nav-ade");
await pg.waitForTimeout(300);
await pg.fill("#ade-titolo", "Prova doppio tocco");
await pg.fill("#ade-data", "2026-12-31");
const nAdePrima = await pg.evaluate(() => document.querySelectorAll("#ade-list .item").length || 0);
dice(await dueVolte("btn-ade"), "trovato «Aggiungi» scadenza e cliccato due volte");
await pg.waitForTimeout(500);
const nAdeDopo = await pg.evaluate(() => document.querySelectorAll("#ade-list .item").length || 0);
dice(nAdeDopo === nAdePrima + 1, `⛔ Scadenze: due tocchi registrano UN adempimento, non due (${nAdePrima} -> ${nAdeDopo})`, { nAdePrima, nAdeDopo });

/* ── 3. Punti di misura (percorso "aggiungi") ── */
await vaiA(pg, "sentinella", "nav-mon");
await pg.waitForTimeout(300);
await pg.fill("#sen-nome", "Prova doppio tocco");
await pg.fill("#sen-unita", "mm/s");
await pg.fill("#sen-soglia", "5");
const nSenPrima = await pg.evaluate(() => document.querySelectorAll("#mon-list .item").length || 0);
dice(await dueVolte("btn-sen"), "trovato «Aggiungi» punto di misura e cliccato due volte");
await pg.waitForTimeout(500);
const nSenDopo = await pg.evaluate(() => document.querySelectorAll("#mon-list .item").length || 0);
dice(nSenDopo === nSenPrima + 1, `⛔ Punti di misura: due tocchi registrano UN punto, non due (${nSenPrima} -> ${nSenDopo})`, { nSenPrima, nSenDopo });

/* ── 4. Ricettori (percorso "aggiungi") ── */
await pg.fill("#ric-nome", "Prova doppio tocco ricettore");
const nRicPrima = await pg.evaluate(() => document.querySelectorAll("#ric-list .item").length || 0);
dice(await dueVolte("btn-ric"), "trovato «Aggiungi» ricettore e cliccato due volte");
await pg.waitForTimeout(500);
const nRicDopo = await pg.evaluate(() => document.querySelectorAll("#ric-list .item").length || 0);
dice(nRicDopo === nRicPrima + 1, `⛔ Ricettori: due tocchi registrano UN ricettore, non due (${nRicPrima} -> ${nRicDopo})`, { nRicPrima, nRicDopo });

dice(errori.length === 0, "nessun errore di pagina", errori.slice(0, 3));

console.log(`\n${ok} ok, ${ko} KO`);
await b.close(); srv.close();
if (CONTROPROVA) {
  if (difettiRimessi.size < DIFETTI.length) { console.log(`✗ CONTROPROVA NON VALIDA: ${difettiRimessi.size}/${DIFETTI.length} difetti rimessi`); process.exit(1); }
  console.log(ko > 0 ? `✔ CONTROPROVA OK: coi difetti rimessi cadono ${ko} prove.` : "✗ CONTROPROVA FALLITA: il banco non distingue.");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);

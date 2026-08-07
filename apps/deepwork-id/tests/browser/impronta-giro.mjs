/* CONTROPROVA DELLA GUARDIA MONTATA SUL GIRO — `node impronta-giro.mjs`.
   ────────────────────────────────────────────────────────────────────────
   `impronta.mjs --controprova` dimostra che il RILEVATORE sa accorgersi di un
   file cambiato. Non dimostra che `tutti.mjs` lo **usi**, né che il verdetto
   arrivi fino all'uscita del processo — ed è esattamente lì che il difetto è
   passato due volte: non nella regola, nel fatto che nessuno la applicava.
   `CLAUDE.md` lo scrive in un'altra pagina: *togliere le funzioni dimenticando
   il `<script>` non è un errore di sintassi*. Una guardia scollegata non lo è
   nemmeno lei.

   Come si prova senza toccare il repository — che è il gesto che tutta questa
   unità esiste per impedire: si dà a `tutti.mjs` una **radice d'impronta
   finta** (una cartella temporanea con dentro finte pagine) e tre **banchi
   finti** che dormono mezzo secondo. Mentre girano, si modifica un file nella
   cartella temporanea. Il giro deve uscire con **2** e dire NON VALIDO.

   E si prova anche il verso opposto, che conta quanto l'altro: senza modifiche
   il giro finto deve uscire con **0**. Una guardia che dichiara sempre invalido
   è inutile quanto una che non dichiara mai. */
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const PORTA = process.argv[2] || "8823";

function radiceFinta() {
  const b = mkdtempSync(join(tmpdir(), "giro-impronta-"));
  mkdirSync(join(b, "apps", "terra"), { recursive: true });
  writeFileSync(join(b, "index.html"), "<h1>core</h1>");
  writeFileSync(join(b, "apps", "terra", "index.html"), "<h1>terra</h1>");
  writeFileSync(join(b, "apps", "terra", "terra-data.js"), "export const a = 1;\n");
  return b;
}

/* Lancia il giro finto. `tocca` viene chiamata mentre gira: è il momento in cui
   qualcuno modifica un modulo dati senza accorgersi che c'è un giro in corso. */
function giro(radice, tocca) {
  return new Promise((ok) => {
    let uscita = "";
    const p = spawn(process.execPath,
      [join(QUI, "tutti.mjs"), PORTA, "--banchi-finti", `--radice-impronta=${radice}`],
      { stdio: ["ignore", "pipe", "pipe"] });
    p.stdout.on("data", (d) => { uscita += d; });
    p.stderr.on("data", (d) => { uscita += d; });
    if (tocca) setTimeout(tocca, 1400);   // dentro il secondo banco finto
    p.on("close", (codice) => ok({ codice, uscita }));
  });
}

let ok = 0, ko = 0;
const dice = (buono, t, extra) => { if (buono) { ok++; console.log(`  ok  ${t}`); }
  else { ko++; console.log(`  KO  ${t}${extra !== undefined ? `\n        -> ${JSON.stringify(String(extra).slice(0, 400))}` : ""}`); } };

console.log("\n════════ la guardia è davvero montata sul giro? ════════");

/* 1 — nessuno tocca niente: il giro deve finire pulito */
const pulita = radiceFinta();
const a = await giro(pulita, null);
dice(a.codice === 0, "senza modifiche il giro finto esce con 0", a.uscita);
dice(/Impronta di partenza: 3 file/.test(a.uscita), "e dichiara quanti file sta sorvegliando", a.uscita);
dice(!/NON VALIDO/.test(a.uscita), "e non grida al lupo", a.uscita);
/* ⛔ E l'intestazione dice quali passate sono CONTROPROVE. Il 07/08 un rosso
   voluto è stato letto come un guasto due volte in due ore: la controprova
   stampa le stesse identiche frasi della passata sana, e chi legge il registro
   dall'alto apre un cantiere su difetti che non esistono. Il runner quel dato
   ce l'ha in mano (`eControprova`); qui si pretende che lo SCRIVA, e che non lo
   scriva dove non va — una riga che avvisa e che nessuno prova è una guardia
   scollegata, ed è la famiglia di difetti che questo file esiste per prendere.
   Nel giro finto «finto 2» è dichiarata controprova apposta. */
const intestazioni = a.uscita.split("\n").filter((r) => r.includes("════════"));
dice(intestazioni.length >= 4, `intestazioni viste nel giro finto: ${intestazioni.length}`, a.uscita);
dice(/finto 2 ════════\n\s*⚠️\s*CONTROPROVA/.test(a.uscita),
  "la passata dichiarata controprova lo scrive nella sua intestazione", a.uscita);
dice(!/finto 1 ════════\n\s*⚠️\s*CONTROPROVA/.test(a.uscita)
  && !/finto 3 ════════\n\s*⚠️\s*CONTROPROVA/.test(a.uscita),
  "e le passate sane NON lo scrivono", a.uscita);
rmSync(pulita, { recursive: true, force: true });

/* 2 — un modulo dati cambia MENTRE gira: il giro deve dichiararsi non valido */
const sporca = radiceFinta();
const b = await giro(sporca, () => writeFileSync(join(sporca, "apps", "terra", "terra-data.js"), "export const a = 2;\n"));
dice(b.codice === 2, "col codice cambiato sotto, il giro esce con 2", `codice ${b.codice}`);
dice(/GIRO NON VALIDO/.test(b.uscita), "e lo dice a chiare lettere", b.uscita);
dice(/terra-data\.js/.test(b.uscita), "e nomina il file cambiato", b.uscita);
dice(/Hanno misurato il codice giusto solo i primi \d+ banchi/.test(b.uscita),
  "e dice quanti banchi sono ancora buoni", b.uscita);
rmSync(sporca, { recursive: true, force: true });

/* 3 — ⛔ IL SERVER SULLA PORTA È IL MIO? La guardia che il runner non aveva, e
   che il 07/08 è costata un giro intero: due giri vivi insieme sulla stessa
   porta, il secondo ha trovato «qualcuno risponde», ha riusato il server
   dell'altro e ha misurato la copia di un commit diverso dal proprio. Poi il
   primo è stato fermato, il suo server è morto, e da lì il secondo ha letto
   ZERO caratteri per schermata — ventidue KO che accusavano il prodotto di non
   esistere. È la forma silenziosa della trappola: non fallisce, misura la roba
   di qualcun altro.
   Qui si prova nei due versi, e il verso che conta è il secondo. */
{
  const { createServer } = await import("node:http");
  const estraneo = radiceFinta();     // una cartella che NON è quella del giro
  const PORTA_PROVA = 8907;
  const srv = createServer((q, r) => { r.writeHead(200); r.end("non sono il tuo giro"); });
  await new Promise((res, rej) => { srv.once("error", rej); srv.listen(PORTA_PROVA, res); });
  const esito = await new Promise((res) => {
    let uscita = "";
    const p = spawn(process.execPath, [join(QUI, "tutti.mjs"), String(PORTA_PROVA), "--prova-contrassegno"],
      { cwd: QUI, env: { ...process.env } });
    p.stdout.on("data", (d) => { uscita += d; });
    p.stderr.on("data", (d) => { uscita += d; });
    p.on("close", (codice) => res({ codice, uscita }));
  });
  await new Promise((res) => srv.close(res));
  rmSync(estraneo, { recursive: true, force: true });
  dice(esito.codice === 2, "con un server ESTRANEO sulla porta il giro si ferma (uscita 2)", `codice ${esito.codice}`);
  dice(/NON È IL MIO/.test(esito.uscita), "e dice perché, invece di misurare la roba di qualcun altro", esito.uscita);
  dice(!/Impronta di partenza/.test(esito.uscita), "e si ferma PRIMA di cominciare a misurare", esito.uscita);

  /* ⚠️ e il verso opposto, se no la guardia «sa fermarsi» ma non si sa se sappia
     ANCHE ripartire: una che si ferma sempre passerebbe la prova qui sopra e
     renderebbe il giro impossibile da lanciare. */
  const suo = await new Promise((res) => {
    let uscita = "";
    const p = spawn(process.execPath, [join(QUI, "tutti.mjs"), "8908", "--prova-contrassegno"], { cwd: QUI });
    p.stdout.on("data", (d) => { uscita += d; });
    p.stderr.on("data", (d) => { uscita += d; });
    p.on("close", (codice) => res({ codice, uscita }));
  });
  dice(suo.codice === 0, "e con il PROPRIO server il giro riparte (uscita 0)", `codice ${suo.codice}`);
  dice(/Contrassegno riletto dal server: è il mio/.test(suo.uscita),
    "dichiarando di aver riletto il proprio contrassegno", suo.uscita);
}

console.log(`\n${ok} passate, ${ko} fallite`);
process.exit(ko ? 1 : 0);

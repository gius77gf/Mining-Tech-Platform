/* OGNI SUPERFICIE CHE SA STAMPARE È APERTA DA ALMENO UN BANCO CHE PREME LA
   STAMPA?
   ────────────────────────────────────────────────────────────────────────
   Uso:  node apps/deepwork-id/tests/fogli-guardati.mjs [--controprova]

   PERCHÉ ESISTE, e non è teorico: **Scudo è rimasto fuori da `stampe-fs` per
   cinque giorni**, dichiarato fuori in una riga che raccontava una storia
   invece che in un elenco che si legge. Intanto i suoi due fogli — il verbale
   DPI e la cartella del lavoratore — non li premeva nessuno, ed è **lì** che
   sono usciti due difetti veri (la scadenza stampata come una qualunque, il
   03/08; la data di consegna che si leggeva «non serve», l'08/08). La stessa
   forma di `SUPERFICI` in `browser/giro.mjs`: *un'app che non sta nell'elenco
   non la guarda nessuno, e nessuno se ne accorge* — i banchi dicono «ok» su
   quelle che vedono.

   ⛔ LA DOMANDA HA QUATTRO RISPOSTE GIUSTE, E UNA SOLA NON BASTA. «Premere il
   foglio» in questa casa è scritto in quattro modi diversi, perché le app
   stampano in due modi diversi:
     1. `emulateMedia({media:"print"})` — l'app stampa SÉ STESSA con un
        `@media print` sulla propria pagina (Flotta, Sentinella, Conti, Scudo);
     2. l'evento `popup` di Playwright — la finestra nuova raccolta dal
        contesto;
     3. un gancio `__stampa` messo dal banco;
     4. `window.open` **sostituito** in un `addInitScript`, che raccoglie i
        `document.write` in una variabile (è così che `genesi-foglio-in-cava`
        legge il foglio di Genesi, e `campo-foglio-turno` quello di Campo).
   ⚠️ E la quarta è arrivata per ultima, come sempre: la prima stesura di
   questo controllo conosceva le prime tre e dichiarava **Genesi scoperta**.
   Non lo era. È lo stesso errore del censimento delle iniezioni, che conosceva
   `[file, cerca, sostituisci]` e non `[cerca, sostituisci, file]`, e dello
   stesso errore che due ore prima è costato trecento righe di banco buttate:
   **un censimento che conosce N convenzioni chiama «mancante» la N+1**.
   Per questo l'elenco dei gesti è **dichiarato e contato** qui sotto: quando
   questo controllo accusa, la PRIMA domanda non è «chi ha dimenticato il
   banco?» ma «è nata una quinta convenzione?».

   ⚠️ E i commenti si tolgono prima di leggere. Senza, «stampat» scritto in una
   prosa qualunque bastava a dichiarare coperta una superficie: il core
   risultava premuto da **25** banchi (ne sono 8), e Campo sarebbe rimasto
   «coperto» anche cancellando il suo unico banco vero. È la regola già pagata
   tre volte in una settimana. */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { senzaCommenti } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const BANCHI = join(QUI, "browser");
const R = join(QUI, "..", "..", "..");

/* L'elenco delle superfici è DERIVATO da `giro.mjs`, che è già la verità su
   quali pagine esistono: un elenco a mano qui sarebbe il terzo, e in questa
   casa il terzo elenco a mano è quello che si accorcia da solo. */
export function superficiDaGiro(testo) {
  return [...testo.matchAll(/\['([^']+)',\s*'(\/[^']+)'\]/g)].map((m) => ({ nome: m[1], via: m[2] }));
}
/* una superficie «sa stampare» se la sua pagina apre una finestra, chiama
   `print()` o costruisce un PDF */
export const SA_STAMPARE = /window\.open|\.print\(\)|jsPDF|jspdf/;
/* i quattro gesti con cui un banco preme davvero un foglio (vedi l'intestazione) */
export const GESTI = [
  ["emulateMedia", /emulateMedia/],
  ["evento popup", /on\(["']popup|waitForEvent\(["']popup/],
  ["gancio __stampa", /__stampa/],
  ["window.open sostituita", /window\.open\s*=/],
];
/* non sono banchi: l'attrezzo condiviso, il lanciatore e il lettore del registro */
export const NON_BANCHI = ["giro.mjs", "tutti.mjs", "leggi-giro.mjs"];

/* ⛔ LO SPOGLIO DEI COMMENTI STA QUI DENTRO, NON DAL CHIAMANTE. Nella prima
   stesura `senzaCommenti` lo faceva chi costruiva l'elenco delle fonti, e la
   funzione si fidava: bastava un secondo chiamante che passasse il testo
   grezzo perche' la difesa sparisse. L'ha trovata la controprova — un gesto
   scritto DENTRO UN COMMENTO veniva contato come codice — ed e' la guardia
   scollegata della regola 17, nel posto piu' facile: dentro il controllo
   scritto per non farsi ingannare. Una difesa che vale per una proprieta'
   viaggia con la funzione che quella proprieta' la decide. */
export function chiPreme(via, fonti) {
  return fonti.filter(({ testo }) => {
    const vivo = senzaCommenti(String(testo || ""));
    return vivo.includes(via) && GESTI.some(([, re]) => re.test(vivo));
  }).map(({ nome }) => nome);
}

let passed = 0, failed = 0;
const test = (nome, fn) => {
  try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.error(`  ✗ ${nome}: ${e.message}`); }
};
const ok = (c, why) => { if (!c) throw new Error(why); };

const SUP = superficiDaGiro(readFileSync(join(BANCHI, "giro.mjs"), "utf8"));
const stampano = SUP.filter(({ via }) => {
  try { return SA_STAMPARE.test(readFileSync(join(R, via.replace(/^\//, "")), "utf8")); }
  catch { return false; }
});
const fonti = readdirSync(BANCHI)
  .filter((f) => f.endsWith(".mjs") && !NON_BANCHI.includes(f))
  /* il testo si passa GREZZO: a togliere i commenti ci pensa `chiPreme`, che e'
     dove la decisione si prende (vedi il suo commento) */
  .map((nome) => ({ nome, testo: readFileSync(join(BANCHI, nome), "utf8") }));

console.log("\n════════ i fogli che si stampano sono guardati da qualcuno? ════════");
const scoperte = [];
for (const { nome, via } of stampano) {
  const chi = chiPreme(via, fonti);
  if (!chi.length) scoperte.push(nome);
  console.log(`  ${chi.length ? "ok " : "KO "} ${nome.padEnd(12)} ${String(chi.length).padStart(2)} banchi${chi.length ? ": " + chi.join(", ") : "  — NESSUNO"}`);
}

test("ogni superficie che sa stampare è premuta da almeno un banco", () => {
  ok(scoperte.length === 0,
    `superfici che stampano e che nessun banco preme: ${scoperte.join(", ")}`
    + " — ⚠️ prima di aprire un cantiere: è nata una QUINTA convenzione per premere un foglio?");
});

/* ⛔ IL DENOMINATORE, che è la ragione per cui questo «zero» vuol dire
   qualcosa: quante superfici sono state guardate, e quanti banchi letti. */
test("il controllo ha guardato abbastanza soggetti da voler dire qualcosa", () => {
  ok(stampano.length >= 8, `solo ${stampano.length} superfici che stampano su ${SUP.length}`);
  ok(fonti.length >= 40, `solo ${fonti.length} banchi letti`);
});

/* ⛔ E TUTTI E QUATTRO I GESTI DEVONO SERVIRE ANCORA. Un gesto che non compare
   più in nessun banco è un'eccezione che non serve — e in questa casa
   un'eccezione che non serve più è un'eccezione che nasconde (`sonda-vuoto`).
   Se un giorno cade, si toglie: non si lascia lì «per sicurezza». */
test("i quattro gesti riconosciuti si presentano ancora tutti", () => {
  const morti = GESTI.filter(([, re]) => !fonti.some(({ testo }) => re.test(senzaCommenti(testo)))).map(([n]) => n);
  ok(morti.length === 0, `gesti dichiarati e mai usati da nessun banco: ${morti.join(", ")}`);
});

if (process.argv.includes("--controprova")) {
  /* ⛔ NEI DUE VERSI. Una superficie inventata che stampa e che nessuno preme
     dev'essere vista; e togliere i commenti non deve rendere cieco il
     riconoscimento dei gesti veri. */
  test("controprova: una superficie che nessuno preme viene vista", () => {
    ok(chiPreme("/apps/inventata/index.html", fonti).length === 0,
      "una superficie mai nominata da nessun banco risulterebbe coperta");
  });
  test("controprova: un banco che NOMINA la pagina ma non preme niente non conta", () => {
    const finto = [{ nome: "finto.mjs", testo: 'await pg.goto("/apps/campo/index.html"); dice(true, "niente");' }];
    ok(chiPreme("/apps/campo/index.html", finto).length === 0,
      "basta nominare la pagina per risultare un banco che preme il foglio");
  });
  test("controprova: e uno che la nomina E preme conta", () => {
    const finto = [{ nome: "finto.mjs", testo: 'await pg.goto("/apps/campo/index.html"); await pg.emulateMedia({media:"print"});' }];
    ok(chiPreme("/apps/campo/index.html", finto).length === 1, "un banco che preme davvero non viene contato");
  });
  test("controprova: la PAROLA «stampato» in un commento non basta", () => {
    const finto = [{ nome: "finto.mjs", testo: '/* qui il foglio stampato con window.open = ... */\nawait pg.goto("/apps/campo/index.html");' }];
    ok(chiPreme("/apps/campo/index.html", finto).length === 0,
      "un gesto scritto solo dentro un commento conta come se fosse codice");
  });
}

console.log(`\nRisultato fogli guardati: ${passed} passati, ${failed} falliti`
  + `  ·  ${stampano.length} superfici che stampano su ${SUP.length}, ${fonti.length} banchi letti`
  + `  ·  ${GESTI.length} gesti riconosciuti (dichiarati nell'intestazione)`);
process.exit(failed > 0 ? 1 : 0);

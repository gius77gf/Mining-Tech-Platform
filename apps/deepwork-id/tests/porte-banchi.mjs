/* NESSUN BANCO RIUSA LA PORTA DI UN ALTRO
   ────────────────────────────────────────────────────────────────────────
   Uso:  node apps/deepwork-id/tests/porte-banchi.mjs [--controprova]

   PERCHÉ ESISTE. `CLAUDE.md` racconta la trappola nella sua forma peggiore,
   quella **silenziosa**: un banco che, trovando la porta già occupata, la
   **riusa** non fallisce — misura la copia di **qualcun altro** e dice cose
   vere su una cartella che nessuno sta guardando. Per un'ora la controprova di
   `pagine-vive` ha detto «non so fallire» mentre iniettava il difetto in una
   cartella che nessuno stava guardando. E il 07/08 è costato un giro intero,
   perché a non rispettare la regola era proprio `tutti.mjs` — il file da cui
   dipendono tutti gli altri.

   ⚠️ QUESTO CONTROLLO NASCE DA UNA MISURA CHE MI HA SMENTITO, e la misura vale
   più del controllo. L'08/08 avevo scritto in **due** checkpoint che i server
   orfani rimasti vivi erano un pericolo, perché «un giro futuro potrebbe
   riusare quella porta e misurare l'albero vivo invece della propria copia».
   Misurato: **zero** banchi su 48 riusano una porta occupata. La frase era
   falsa, e una diagnosi scritta con sicurezza manda il cantiere dopo a non
   provare la strada giusta. Gli orfani erano spreco (porte, memoria), non un
   rischio di correttezza.
   Il censimento, all'08/08: **48** banchi alzano un server — **36** rileggono
   dal server un contrassegno col proprio pid, **12** la porta la prendono e
   basta (se è occupata l'errore è RUMOROSO: dieci escono con un'eccezione, due
   lo gestiscono), **0** la riusano.
   ⛔ E i dodici senza contrassegno NON vengono corretti, con la ragione
   scritta: il contrassegno protegge da «`listen` è fallito e io tiro avanti»,
   e chi esce con un'eccezione quel caso non ce l'ha. Dodici file toccati per
   un pericolo misurato a zero sarebbero rischio senza guadagno — è la stessa
   contabilità con cui è stata scartata la scala `--nav-scala`. Se un giorno
   uno di quei dodici imparasse a ingoiare l'errore di `listen`, allora sì.

   ⚠️ E IL PRIMO RIGHELLO SBAGLIAVA, col segno di sempre: contava la stringa
   `__contrassegno` e dava **13 su 52**, perché `flotta-disegni` e
   `terra-geometrie` il contrassegno ce l'hanno con una rotta che porta il loro
   nome (`/__flotta-disegni-<pid>`). Contare un LETTERALE invece della DOMANDA
   è il difetto che questa casa ha già pagato più volte. */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const QUI = dirname(fileURLToPath(import.meta.url));
const DIR = join(QUI, "browser");
const CONTROPROVA = process.argv.includes("--controprova");

let passed = 0, failed = 0;
const test = (nome, fn) => { try { fn(); passed++; console.log(`  ✓ ${nome}`); }
  catch (e) { failed++; console.log(`  ✗ ${nome}: ${e.message}`); } };
const ok = (c, m) => { if (!c) throw new Error(m); };

/* La domanda: questo testo, trovando la porta occupata, la RIUSA?
   Le due forme viste in casa — `if (!(await rispondePorta(P))) { la alzo io }`
   (era di `tutti.mjs`, ed è costata un giro da cinque ore) e la variante che
   riusa dopo aver chiesto se qualcuno risponde. */
export function riusaLaPorta(testo) {
  if (!/createServer\s*\(/.test(testo)) return false;
  if (/if\s*\(\s*!\s*\(\s*await\s+rispondePorta/.test(testo)) return true;
  if (/rispondePorta\s*\([^)]*\)\s*\)\s*\{[\s\S]{0,200}?\balzo\b/i.test(testo)) return true;
  return false;
}
/* e la seconda domanda: rilegge DAL SERVER un contrassegno col proprio pid?
   Non si cerca un nome di rotta — quello cambia da banco a banco — ma la
   forma: una `fetch` verso una rotta che comincia per `__`, il proprio pid, e
   una fermata dichiarata se la risposta non è la sua. */
export function rileggeIlContrassegno(testo) {
  return /fetch\([^)]*__[a-z-]*[^)]*\)/i.test(testo)
    && /process\.pid/.test(testo)
    && /(ALTRO server|contrassegno|mi fermo)/i.test(testo);
}

const file = readdirSync(DIR).filter((f) => f.endsWith(".mjs"));
const testi = new Map(file.map((f) => [f, readFileSync(join(DIR, f), "utf8")]));
const conServer = file.filter((f) => /createServer\s*\(/.test(testi.get(f)));

test("nessun banco riusa una porta che risponde già", () => {
  const male = conServer.filter((f) => riusaLaPorta(testi.get(f)));
  ok(conServer.length >= 30,
    `banchi con un server: ${conServer.length} — il controllo non sta guardando dove crede`);
  ok(male.length === 0,
    `misurerebbero la copia di qualcun altro: ${male.join(", ")}`);
});

test("il censimento si dichiara invece di lasciarlo intendere", () => {
  const protetti = conServer.filter((f) => rileggeIlContrassegno(testi.get(f)));
  const nudi = conServer.filter((f) => !rileggeIlContrassegno(testi.get(f)));
  /* ⛔ Il numero NON è una soglia da difendere: è un dato da stampare. Una
     soglia sui protetti sarebbe la trappola del valore monotòno — cresce da
     sola quando nasce un banco protetto, e non scende quando ne nasce uno
     nudo. Quello che conta lo dice la prova qui sopra. */
  console.log(`      ${conServer.length} banchi alzano un server · ${protetti.length} rileggono il contrassegno`
    + ` · ${nudi.length} prendono la porta e basta (errore rumoroso se occupata) · 0 la riusano`);
  ok(protetti.length + nudi.length === conServer.length, "il conto non torna");
});

test("la controprova: le due forme viste in casa vengono riconosciute", () => {
  /* ⛔ Senza questa, «zero riusi» potrebbe voler dire «non guardo niente». Le
     due forme sono quelle VERE: la prima è la riga che `tutti.mjs` aveva
     davvero, e che il 07/08 ha fatto misurare per venti minuti la copia di un
     altro commit. */
  const comeTutti = "const srv = createServer(x);\nif (!(await rispondePorta(PORTA))) { /* lo alzo io */ }";
  ok(riusaLaPorta(comeTutti), "la forma di tutti.mjs non viene riconosciuta");
  /* ⚠️ QUI C'ERA `ok(riusaLaPorta(altra) || true, …)`, cioè un'asserzione che
     NON SA CADERE: `|| true` la rende vera qualunque cosa risponda la
     funzione. L'avevo scritta per «dichiarare senza pretendere» un secondo
     caso, ed è la stessa forma che un'ora prima mi era costata una prova
     tautologica in `run-kpi`. Se un caso vale, si pretende; se non vale, si
     toglie. Questo vale, ed è la variante col ramo `else`. */
  const altra = "createServer(x);\nif (await rispondePorta(P)) { console.log('c\\'è già'); } else { /* lo alzo io */ }";
  ok(riusaLaPorta(altra), "la variante col ramo else non viene riconosciuta");
  /* e il verso opposto: un banco sano non deve essere accusato */
  const sano = "const srv = createServer(x);\nawait new Promise((r, x2) => { srv.once('error', x2); srv.listen(PORTA, r); });";
  ok(!riusaLaPorta(sano), "un banco che PRENDE la porta viene accusato di riusarla");
  const senzaServer = "const t = await rispondePorta(9); if (!t) console.log('niente');";
  ok(!riusaLaPorta(senzaServer), "un file senza server non c'entra");
  /* e il contrassegno riconosciuto per FORMA e non per nome di rotta: è
     l'errore che il primo righello ha fatto (13 invece di 36) */
  const conNomeProprio = "await fetch(`http://127.0.0.1:${P}/__flotta-disegni-${process.pid}`);\n"
    + "if (eco !== 'x') { console.error('sulla porta risponde un ALTRO server'); }";
  ok(rileggeIlContrassegno(conNomeProprio),
    "un contrassegno con una rotta che porta il nome del banco non viene riconosciuto");
});

if (CONTROPROVA) {
  /* rimette il difetto in un testo finto e pretende che la prova cada */
  const rotto = new Map(testi);
  rotto.set("finto.mjs", "const srv = createServer(x);\nif (!(await rispondePorta(PORTA))) { /* lo alzo io */ }");
  const visti = [...rotto.keys()].filter((f) => riusaLaPorta(rotto.get(f)));
  console.log(visti.length === 1 && visti[0] === "finto.mjs"
    ? "✔ CONTROPROVA: il banco che riusa la porta viene visto (1 su " + rotto.size + ")"
    : `⛔ CONTROPROVA: NON DISTINGUE — visti ${visti.length}`);
  process.exit(visti.length === 1 ? 0 : 1);
}

console.log(`\nRisultato porte dei banchi: ${passed} passati, ${failed} falliti`
  + `  ·  ${conServer.length} banchi con un server guardati`);
process.exit(failed > 0 ? 1 : 0);

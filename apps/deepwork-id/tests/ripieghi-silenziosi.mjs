/* ⛔ IL RIPIEGO SILENZIOSO: LO STESSO CENSIMENTO, SCRITTO UNA VOLTA SOLA.
   ══════════════════════════════════════════════════════════════════════════
   ⚠️ NON VA IN npm test: è una MISURA, non una prova. Stampa e basta, e non
   fallisce mai — metterla in CI vorrebbe dire una CI che non dice niente.

   PERCHÉ ESISTE. La famiglia è questa: **un ingresso che l'utente non ha
   scritto, sostituito da una costante di mestiere, e il numero che ne esce si
   presenta come misurato.** In due notti ha prodotto difetti veri in cinque
   app — la distanza a cui si mandano via le persone calcolata da una spalla
   che nessuno aveva scritto (129 m di sgombero in meno), un pezzo per ogni
   intervento vecchio (6 contro 18), `dovuto: 0` su soldi dovuti a un ente,
   `0 / 0 / 0` nel registro volate che va all'ARPA, «Conforme» su un
   superamento.
   ⛔ E il censimento che li ha trovati è stato **riscritto da zero quattro
   volte**, una per cantiere, ognuna con un righello un po' diverso: è alla
   lettera la regola di CLAUDE.md — *gli strumenti di misura vivono nei test,
   non nello scratchpad; una difesa che resta nello scratchpad, alla sessione
   dopo non esiste*. Questo file è quella regola applicata a sé stessa.

   ⛔ IL CONTO GROSSO NON È IL CONTO DEI DIFETTI, e stamparlo da solo
   ingannerebbe: quattro quinti dei candidati sono `|| '—'` di stampa, che non
   entrano in nessun calcolo. Perciò i gradini si stampano **tutti e tre**,
   dichiarati, e l'ultimo — «è un difetto?» — questo file NON lo sa dire: lo
   dice solo chi chiama la funzione con l'ingresso assente e con quello vero e
   guarda **in quale direzione** cambia il numero. Qui si arriva ai candidati.

   ⚠️ I COMMENTI VANNO TOLTI, se no il censimento **si conta addosso la propria
   documentazione**: questo repository cita per esteso i difetti che ha chiuso.
   Misurato: 11 commenti nel core, 12 in Scudo e Sentinella, 64 nelle altre
   quattro app. Si usa `senzaCommenti` di `tokenizza.mjs` — non un secondo
   tokenizzatore, che è il modo in cui un buco si duplica.

   Uso:  node apps/deepwork-id/tests/ripieghi-silenziosi.mjs
         node apps/deepwork-id/tests/ripieghi-silenziosi.mjs --solo=conti      */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { senzaCommenti } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const SOLO = (process.argv.find((a) => a.startsWith("--solo=")) || "").split("=")[1] || "";

/* le sette superfici, derivate dalla convenzione e col core dichiarato a parte
   (il core non ha un modulo dati: tutto il suo programma sta nella pagina) */
const APP = ["campo", "conti", "flotta", "genesi", "scudo", "sentinella", "terra"];

function pagina(app) {
  const a = join(RADICE, "apps", app, "index.html");
  const b = join(RADICE, "apps", app, `${app}.html`);   // Genesi sta fuori convenzione
  return existsSync(a) ? a : (existsSync(b) ? b : null);
}
function modulo(app) {
  const m = join(RADICE, "apps", app, `${app}-data.js`);
  return existsSync(m) ? m : null;
}

/* ⚠️ Dentro una PAGINA il codice sta nei blocchi `<script>`: leggerla intera
   come JavaScript è il difetto che il 03/08 ha fatto perdere la fase a tutte e
   sedici le regole di `run-stile` — l'apostrofo di «l'ecosistema» nel TESTO
   apriva una stringa. */
function codiceVivo(file) {
  const testo = readFileSync(file, "utf8");
  if (!/\.html$/.test(file)) return { vivo: senzaCommenti(testo), grezzo: testo };
  const blocchi = [...testo.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return { vivo: blocchi.map(senzaCommenti).join("\n"), grezzo: blocchi.join("\n") };
}

const FORMA = /([A-Za-z_$][\w$.\[\]'"]*)\s*(\|\||\?\?)\s*([A-Z_][A-Z_0-9]*|\d+(?:\.\d+)?|'[^']*'|"[^"]*")/g;
const stringa = (m) => /^['"]/.test(m[3]);
const zero = (m) => m[3] === "0";

/* le due famiglie vicine, che la forma `||` non prende e che hanno già morso:
   `+null` fa 0 e `Number.isFinite(0)` risponde true (è la ragione per cui in
   `shared/` esiste `numeroDichiarato`); e `Math.max(0, a - b)`, dove quello
   zero di comodo nasconde un invariante che nessuno ha scritto — il 13/08 in
   Conti faceva SPARIRE delle consegne invece di diventare negativo. */
const PIU_FINITE = /Number\.isFinite\(\s*\+/g;
const MAX_ZERO = /Math\.max\(\s*0\s*,/g;

/* ⛔ E `Math.max(0, …)` VA SPACCATO IN DUE, se no il numero non dice niente.
   Un `Math.max(0, x)` è un **clamp**: tiene un valore dentro il suo dominio, e
   va benissimo. Quello pericoloso è `Math.max(0, a − b)`, cioè una
   **sottrazione fra due insiemi**: quello zero di comodo è lì perché qualcuno
   sapeva che `b ⊆ a`, e quell'invariante **non è scritto da nessuna parte**. Il
   13/08 in Conti, rotto l'invariante, la sottrazione non diventava negativa —
   **faceva sparire** delle consegne, cioè sbagliava nella direzione tranquilla.
   Il meno si conta solo se è **binario e al livello zero** delle parentesi: un
   `-x` unario o un meno dentro una chiamata annidata non sono questa forma. */
function sottrazioni(codice) {
  let n = 0;
  for (const m of codice.matchAll(/Math\.max\(\s*0\s*,/g)) {
    /* ⚠️ NON si prende il corpo con una regex: `[^;]{0,90}?` è non-greedy e si
       ferma al PRIMO `)`, quindi `Math.max(0, f(x) - g(y))` diventa «f(x» e il
       meno non lo vede nessuno. Si cammina in avanti contando le parentesi —
       l'ha detto la controprova, dopo che la prima stesura aveva già stampato
       un numero. */
    let liv = 1, k = m.index + m[0].length, corpo = "";
    while (k < codice.length && liv > 0) {
      const ch = codice[k];
      if (ch === "(") liv++;
      else if (ch === ")") { liv--; if (!liv) break; }
      else if (ch === ";" || ch === "\n") { if (liv === 1 && corpo.length > 200) break; }
      corpo += ch; k++;
      if (corpo.length > 400) break;
    }
    /* il meno conta se è BINARIO (prima di lui, saltati gli spazi, c'è un
       valore) e al livello ZERO delle parentesi annidate */
    let d = 0;
    for (let i = 1; i < corpo.length; i++) {
      const ch = corpo[i];
      if (ch === "(") d++;
      else if (ch === ")") d--;
      else if (ch === "-" && d === 0) {
        const prima = corpo.slice(0, i).replace(/\s+$/, "");
        if (/[\w$)\]'"]$/.test(prima)) { n++; break; }
      }
    }
  }
  return n;
}
/* la controprova del righello, sul posto: se non distinguesse le due forme, il
   numero che stampa sotto sarebbe una somma senza senso */
{
  const clamp = sottrazioni("Math.max(0, x); Math.max(0, -y); Math.max(0, f(a-b));");
  const vere = sottrazioni("Math.max(0, a-b); Math.max(0, tot - persi); Math.max(0, f(x) - g(y));");
  if (clamp !== 0 || vere !== 3) {
    console.error(`⛔ il righello delle sottrazioni non distingue (clamp=${clamp}, vere=${vere}): il numero qui sotto non vale`);
    process.exit(2);
  }
}

function censisci(file) {
  const { vivo, grezzo } = codiceVivo(file);
  const tutti = [...vivo.matchAll(FORMA)];
  const conCommenti = [...grezzo.matchAll(FORMA)];
  const mestiere = tutti.filter((m) => !stringa(m) && !zero(m));
  return {
    candidati: tutti.length,
    commenti: conCommenti.length - tutti.length,
    stampa: tutti.filter(stringa).length,
    zero: tutti.filter(zero).length,
    mestiere: mestiere.map((m) => m[0].replace(/\s+/g, "").slice(0, 46)),
    piuFinite: (vivo.match(PIU_FINITE) || []).length,
    maxZero: (vivo.match(MAX_ZERO) || []).length,
    sottrazioni: sottrazioni(vivo),
  };
}

const SOGGETTI = [["core", join(RADICE, "index.html")]];
for (const app of APP) {
  const p = pagina(app); if (p) SOGGETTI.push([`${app} · pagina`, p]);
  const m = modulo(app); if (m) SOGGETTI.push([`${app} · modulo`, m]);
}
const scelti = SOLO ? SOGGETTI.filter(([n]) => n.toLowerCase().includes(SOLO.toLowerCase())) : SOGGETTI;
if (!scelti.length) {
  console.error(`⛔ --solo=${SOLO} non combacia con nessuna superficie. Ce ne sono ${SOGGETTI.length}:`);
  console.error("   " + SOGGETTI.map(([n]) => n).join(", "));
  process.exit(2);
}

console.log("\n⛔ IL RIPIEGO SILENZIOSO — censimento a tre gradini (MISURA, non una prova)\n");
console.log("  superficie              candidati  commenti   stampa    zero  MESTIERE  +finite  max(0,  di cui a-b");
let tot = { candidati: 0, commenti: 0, stampa: 0, zero: 0, mestiere: 0, piuFinite: 0, maxZero: 0, sottrazioni: 0 };
const dettaglio = [];
for (const [nome, file] of scelti) {
  const r = censisci(file);
  dettaglio.push([nome, r.mestiere]);
  tot.candidati += r.candidati; tot.commenti += r.commenti; tot.stampa += r.stampa;
  tot.zero += r.zero; tot.mestiere += r.mestiere.length; tot.piuFinite += r.piuFinite; tot.maxZero += r.maxZero;
  tot.sottrazioni += r.sottrazioni;
  console.log(`  ${nome.padEnd(22)} ${String(r.candidati).padStart(8)}  ${String(r.commenti).padStart(8)}`
    + `  ${String(r.stampa).padStart(7)} ${String(r.zero).padStart(7)}  ${String(r.mestiere.length).padStart(8)}`
    + `  ${String(r.piuFinite).padStart(7)}  ${String(r.maxZero).padStart(6)}  ${String(r.sottrazioni).padStart(10)}`);
}
console.log(`  ${"TOTALE".padEnd(22)} ${String(tot.candidati).padStart(8)}  ${String(tot.commenti).padStart(8)}`
  + `  ${String(tot.stampa).padStart(7)} ${String(tot.zero).padStart(7)}  ${String(tot.mestiere).padStart(8)}`
  + `  ${String(tot.piuFinite).padStart(7)}  ${String(tot.maxZero).padStart(6)}  ${String(tot.sottrazioni).padStart(10)}`);

console.log("\n  ⚠️ E `max(0,` da solo non dice niente: quasi tutti sono CLAMP, che vanno benissimo.");
console.log("     Quello pericoloso è la colonna «di cui a-b» — una sottrazione fra due insiemi,");
console.log("     dove lo zero di comodo nasconde un invariante che nessuno ha scritto.");
console.log("\n  ⚠️ Il numero da guardare è MESTIERE, non «candidati»: una costante che non è");
console.log("     né zero né una stringa. Gli altri due sono contatori e segnaposto di stampa,");
console.log("     e un `|| 0` su un contatore è giustissimo.");
console.log("  ⚠️ E MESTIERE non è ancora il conto dei difetti: dentro ci stanno le misure del");
console.log("     DISEGNO (clientWidth, devicePixelRatio, opacità) e i default di un oggetto");
console.log("     NUOVO, che sono legittimi. Il difetto è il ripiego al momento del CALCOLO su");
console.log("     un dato che l'utente non ha scritto, e a dirlo è solo chiamare la funzione");
console.log("     con l'ingresso assente e con quello vero, guardando in che DIREZIONE cambia.");

console.log("\n— i ripieghi di mestiere, per superficie —");
for (const [nome, righe] of dettaglio) {
  if (!righe.length) { console.log(`  ${nome}: nessuno`); continue; }
  console.log(`  ${nome} (${righe.length}):`);
  for (const r of righe) console.log(`     ${r}`);
}
console.log(`\n${scelti.length} superfici guardate su ${SOGGETTI.length}` + (SOLO ? `  (--solo=${SOLO})` : ""));

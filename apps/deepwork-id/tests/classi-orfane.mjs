/* UNA CLASSE SCRITTA IN UNA PAGINA CHE NESSUNO DIPINGE E NESSUNO CERCA.
   ═══════════════════════════════════════════════════════════════════════
   È l'analogo CSS di `nomi-liberi.mjs`, e come quello non produce **niente da
   leggere**: nessun errore in console, nessuna prova rossa, nessuna riga
   sbagliata da trovare rileggendo il codice.

   ⛔ SUCCESSO IL 07/08, e la pagina di Scudo l'ha pagato per cinque commit.
   Tre filtri portavano `class="ords"` — con la esse — e la classe non esiste.
   Misurato: `display:block`, `gap: normal`, `margin-bottom: 0` contro `flex`,
   `gap:8px`, `10px` di ogni altra fila dell'ecosistema. L'ha trovato uno
   strumento buttato giù a mano nello scratchpad, cioè per fortuna.

   ⛔ MA LA PRIMA DOMANDA ERA QUELLA SBAGLIATA, ed è il motivo per cui questo
   file esiste invece di quello. «Quale foglio la definisce?» dava **14**
   risposte su 1.154 classi, e almeno sette erano **ganci di JavaScript** —
   `chk-item`, `uf-cava`, `cv-dest`, `chi-assente`, `mac-gest-body`: classi
   vivissime, cercate con `querySelectorAll`, che nessun foglio dipinge di
   proposito. Un allarme che sbaglia una volta su due insegna a non guardarlo
   (CLAUDE.md), quindi la domanda è **una seconda**, più stretta:

       ogni occorrenza di questo nome, in tutto il codice vivo,
       sta dentro un `class="..."`?

   Se sì, il nome non lo dipinge nessuno E non lo cerca nessuno: è testo morto.
   Da 14 a **4**, e le quattro sono vere, verificate una per una con un `grep`
   su tutto il repository (l'elenco `ACCETTATE` qui sotto porta il conto delle
   occorrenze di ognuna).

   ⚠️ E DUE FALSI ALLARMI SU TRE VENIVANO DAI COMMENTI, per la terza volta in
   una giornata. `class="fld"` scritto **dentro un commento** di Scudo veniva
   contato come un elemento vero; e `.esempio` di Campo e Terra è definita in
   una stringa (`CSS_ESEMPIO = ".esempio{…}"`, il foglio della finestra di
   stampa), che è una definizione a tutti gli effetti. I commenti qui si tolgono
   in **tutt'e tre** le sintassi che una pagina contiene — HTML fuori,
   `senzaCommenti` dentro `<script>`, `/* … *\/` dentro `<style>` — e il
   tokenizzatore è quello condiviso, non un altro scritto qui.

   DOVE NON GUARDA, dichiarato invece che sottinteso:
   · le classi **composte a pezzi** (`class="riga ${st}"`) non entrano: si
     leggono solo gli attributi letterali. È la direzione prudente — fa
     scendere il numero dei soggetti, non salire quello degli allarmi;
   · un nome che **collide con un identificatore comune** si salva da solo:
     `class="msg"` non è dipinta da niente, ma la parola `msg` compare in mezzo
     mondo (`toast(msg, tipo)`) e quindi non viene segnalata. Miss dichiarato,
     e nella direzione giusta;
   · si cerca nella pagina e nei **fogli che la pagina dichiara**, non in
     tutto il repository: una classe dipinta dal foglio di un'altra app
     sarebbe un falso allarme, e non ce ne sono (provato col `grep`).
   Il numero dei soggetti guardati è stampato apposta: è la difesa contro il
   «nessuna violazione» di un controllo che non ha guardato niente.

   Uso:  node classi-orfane.mjs           (regola)
         node classi-orfane.mjs --controprova
*/
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { senzaCommenti } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = resolve(QUI, "..", "..", "..");
const leggi = (p) => { try { return readFileSync(join(R, p), "utf8"); } catch { return null; } };

export const PAGINE = ["index.html", "apps/index.html", "apps/genesi/genesi.html",
  "apps/conti/index.html", "apps/flotta/index.html", "apps/scudo/index.html",
  "apps/campo/index.html", "apps/sentinella/index.html", "apps/terra/index.html",
  "apps/deepwork-id/admin.html", "apps/deepwork-id/profilo.html", "apps/deepwork-id/index.html"];

/* ⛔ LE ECCEZIONI SI DICHIARANO UNA PER UNA CON LA RAGIONE, e la suite pretende
   che ognuna **si presenti ancora**: un'eccezione che non serve più è
   un'eccezione che nasconde (`sonda-vuoto.mjs`, che il 01/08 ha fatto cadere la
   CI proprio per questo). Quando qualcuno toglie uno di questi nomi dalla
   pagina, questa riga deve sparire di conseguenza — e se non sparisce, il
   controllo lo dice.
   Nessuna delle quattro è un REFUSO alla `ords`: non esiste una classe vicina
   che avrebbero dovuto scrivere. Sono nomi rimasti dopo che lo stile se n'è
   andato altrove — testo morto, non stile perduto. Vanno tolti, ma toglierli è
   una modifica al prodotto e va fatta ad albero fermo. */
export const ACCETTATE = new Map([
  ["index.html mac-gest-tabs", "1 uso. Lo stile lo fa `.atabs` scritta accanto; questo nome non lo dipinge e non lo cerca nessuno."],
  ["index.html ec-miccia", "1 uso, su un `<g>` SVG. Il comportamento è nell'`onclick`, il puntatore in uno `style` in linea."],
  ["index.html tipo-volata-btn", "3 usi. I tre riquadri hanno TUTTO lo stile in linea, ripetuto tre volte: è il segno che la classe era prevista e non è mai stata scritta."],
  ["apps/genesi/genesi.html dc-rock", "1 uso. Lo stile lo fa `.dc-f` scritta accanto."],
]);

/* i commenti in tutt'e tre le sintassi. Si sostituisce con spazi invece che con
   niente perché le posizioni restino le stesse: serve a chi legge un allarme. */
export function vivo(html) {
  let t = html.replace(/<!--[\s\S]*?-->/g, (m) => " ".repeat(m.length));
  t = t.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (m, a, corpo, z) => a + senzaCommenti(corpo) + z);
  t = t.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (m, a, corpo, z) => a + corpo.replace(/\/\*[\s\S]*?\*\//g, (c) => " ".repeat(c.length)) + z);
  return t;
}
const vivoCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => " ".repeat(c.length));

/* ⚠️ Il confine di parola di `\b` non basta: `-` per lui È un confine, quindi
   `\bdc-rock\b` combacia dentro `dc-rocky`. Il trattino fa parte del nome. */
const confine = (n) => new RegExp(`(?<![\\w-])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);

/* La misura, pura: prende il testo della pagina e quello dei suoi fogli, e
   restituisce le classi usate e quelle mai nominate fuori da un `class="…"`.
   È pura perché la controprova inietta **in memoria**: mentre gira un giro del
   browser non si toccano i file veri (CLAUDE.md). */
export function morteIn(html, fogli) {
  const pagina = vivo(html);
  const usate = new Map();
  for (const m of pagina.matchAll(/\bclass=["']([^"'${}]+)["']/g))
    for (const c of m[1].split(/\s+/)) if (c) usate.set(c, (usate.get(c) || 0) + 1);

  /* si cancellano i VALORI degli attributi class: quello che resta è ogni altra
     menzione del nome — un selettore, una stringa, un `classList.add`. */
  const dove = [pagina, ...fogli.map(vivoCss)].join("\n")
    .replace(/\bclass=["']([^"']*)["']/g, (m) => " ".repeat(m.length));

  const morte = [...usate.keys()].filter((c) => !confine(c).test(dove));
  return { usate, morte };
}

export function fogliDi(p, html) {
  const base = dirname(p);
  const out = [];
  for (const m of html.matchAll(/<link[^>]*href=["']([^"']+\.css)["']/gi)) {
    const t = leggi(join(base, m[1]));
    if (t) out.push(t);
  }
  return out;
}

/* ─────────────────────────── la regola ─────────────────────────── */
let ok = 0, ko = 0;
const dico = (c, msg) => { if (c) { ok++; } else { ko++; console.log("  KO  " + msg); } };

const controprova = process.argv.includes("--controprova");
let totClassi = 0, totPagine = 0;
const trovate = new Set();

for (const p of PAGINE) {
  const html = leggi(p);
  if (!html) { console.log(`  KO  pagina non letta: ${p}`); ko++; continue; }
  totPagine++;
  const { usate, morte } = morteIn(html, fogliDi(p, html));
  totClassi += usate.size;
  for (const c of morte) {
    const chiave = `${p} ${c}`;
    trovate.add(chiave);
    dico(ACCETTATE.has(chiave),
      `${p}: «${c}» (×${usate.get(c)}) non è dipinta da nessun foglio e non è cercata da nessuno. `
      + `Se è un refuso, la classe vera è vicina; se è testo morto, va tolta — non aggiunta qui senza la ragione.`);
  }
}

/* la seconda metà, quella che `sonda-vuoto.mjs` ha insegnato: ogni eccezione
   dichiarata deve presentarsi ancora, se no l'elenco è più vecchio del codice */
for (const chiave of ACCETTATE.keys())
  dico(trovate.has(chiave),
    `l'eccezione «${chiave}» non si presenta più: o il nome è stato tolto (e allora va tolta anche questa riga), o la pagina non si legge più.`);

/* ───────────────────────── la controprova ───────────────────────── */
if (controprova) {
  console.log("\n── controprova: il difetto vero, rimesso in memoria ──");
  /* ⛔ IN MEMORIA, mai sul file: mentre gira un giro del browser un'iniezione
     su una pagina fa misurare a un banco una cosa che non esiste. */
  let iniezioni = 0, prese = 0, mancate = [];
  for (const p of PAGINE) {
    const html = leggi(p);
    if (!html) continue;
    const fogli = fogliDi(p, html);
    const { usate, morte } = morteIn(html, fogli);
    /* si prende una classe VIVA della pagina — dipinta o cercata — e le si
       aggiunge una esse in fondo, esattamente il refuso di Scudo. */
    const viva = [...usate.keys()].find((c) => !morte.includes(c) && c.length > 3);
    if (!viva) continue;
    const rotto = html.replace(new RegExp(`(\\bclass=["'][^"']*)(?<![\\w-])${viva}(?![\\w-])`), `$1${viva}s`);
    if (rotto === html) { mancate.push(`${p}: l'iniezione non ha cambiato niente su «${viva}»`); continue; }
    iniezioni++;
    const dopo = morteIn(rotto, fogli);
    if (dopo.morte.includes(viva + "s")) prese++;
    else mancate.push(`${p}: «${viva}s» rimesso e NON visto`);
  }
  console.log(`  ${iniezioni} refusi iniettati su ${totPagine} pagine, ${prese} visti`);
  for (const m of mancate) console.log("  ⚠️  " + m);
  dico(iniezioni >= 10, `iniezioni provate: ${iniezioni} — poche per dire qualcosa sull'ecosistema`);
  dico(prese === iniezioni, `il controllo NON vede ${iniezioni - prese} refusi su ${iniezioni}`);

  /* e il verso opposto, che è quello che distingue questo controllo dal
     precedente: un gancio di JavaScript NON deve essere segnalato */
  const conGancio = `<div class="solo-gancio-di-prova"></div>
    <script>document.querySelectorAll(".solo-gancio-di-prova").forEach(x => x.remove());</script>`;
  const g = morteIn(conGancio, []);
  dico(!g.morte.includes("solo-gancio-di-prova"),
    "un gancio cercato da `querySelectorAll` viene segnalato: è il falso allarme che questo file esiste per NON fare");

  /* e un nome nominato solo in un COMMENTO non è una definizione */
  const soloCommento = `<div class="mai-dipinta-x"></div><style>/* .mai-dipinta-x andrebbe scritta */</style>`;
  const sc = morteIn(soloCommento, []);
  dico(sc.morte.includes("mai-dipinta-x"),
    "un nome scritto solo dentro un commento viene preso per una definizione: è il falso NEGATIVO costato tre volte in un giorno");
}

console.log(`\nRisultato classi orfane: ${ok} passati, ${ko} falliti  ·  ${totClassi} classi distinte su ${totPagine} pagine, ${trovate.size} morte trovate, ${ACCETTATE.size} dichiarate`);
process.exit(ko ? 1 : 0);

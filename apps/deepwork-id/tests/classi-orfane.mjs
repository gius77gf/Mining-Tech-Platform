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
   · le classi **composte a pezzi** (un'interpolazione dentro l'attributo) non
     entrano: si leggono solo gli attributi letterali. È la direzione prudente —
     fa scendere il numero dei soggetti, non salire quello degli allarmi.
     ⛔ **E IL 09/08 UN DIFETTO VERO VIVEVA PROPRIO LÌ**: in Conti l'avatar del
     prodotto senza densità nasceva `avatar warn`, e `.avatar.warn` non la
     dipinge nessuno nel contesto di Conti (il foglio condiviso conosce solo
     `.avatar.sup`, e `.warn` da sola lì non esiste). Classe inerte, nessun
     errore, nessuna prova rossa, un avatar identico a quello sano. È la regola
     che questa casa ha già scritto: *un'eccezione dichiarata onestamente resta
     un posto in cui nessuno guarda* — quindi ci si guarda dentro almeno una
     volta, ed è stato fatto.
     ⚠️ **E ALLARGARE IL CENSIMENTO A QUELLE CLASSI È STATO PROVATO E SCARTATO
     COL NUMERO, perché nessuno lo rifaccia alla cieca.** Prendendo i pezzi
     letterali (le parole fuori dall'interpolazione più le stringhe dentro) e
     chiedendo «questa coppia è definita da un foglio della sua pagina?» escono
     **365 attributi, 396 coppie, 43 sospette — e UNA sola vera**. Le altre 42
     sono dipinte per altre vie che una regex sulle coppie adiacenti non vede:
     dalla classe di stato **da sola** (`.warn{}`, `.danger{}`, `.st-ok{}`) o da
     un selettore **discendente** (`.warn .board-ico`, `.danger .n`). Un allarme
     che sbaglia 42 volte su 43 insegna a non guardarlo.
     La domanda giusta non è statica: è **se l'elemento dipinto davvero
     differisca dal suo gemello senza quella classe**, e quella risposta la sa
     solo il browser con `getComputedStyle`;
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
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { senzaCommenti } from "./tokenizza.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = resolve(QUI, "..", "..", "..");
const leggi = (p) => { try { return readFileSync(join(R, p), "utf8"); } catch { return null; } };

/* ⛔ L'ELENCO ERA SCRITTO A MANO E NE PERDEVA QUATTRO — trovato l'08/08.
   `run-stile` ha la sua guardia («ogni pagina del repo è guardata o esclusa con
   la ragione») dal 03/08, e quel giorno aveva scoperto quattro pagine
   dimenticate — fra cui, testualmente, «due che l'utente apre davvero: quella
   in cui si finisce quando manca un permesso, e il portone di Genesi». Qui la
   guardia non c'era, e mancavano **le stesse due**, più due superfici di
   collaudo. Cioè la correzione era stata fatta in un file e non nell'altro: è
   la copia debole, applicata a un elenco invece che a una funzione.
   Adesso l'elenco si **deriva dal disco**, così una pagina nuova entra da sé, e
   chi resta fuori lo dice con la ragione. */
const FUORI_PAGINE = {
  "shared/_collaudo-grafici.html":
    "il collaudo del motore dei grafici — l'underscore nel nome lo dichiara: "
    + "serve a guardare i grafici affiancati, non è un'interfaccia",
  "apps/genesi/nuvola-poc.html":
    "la prova di concetto del lettore di nuvole di punti: una pagina di "
    + "collaudo, non una schermata del prodotto",
};
function tutteLePagine(dir = "", trovate = []) {
  for (const v of readdirSync(join(R, dir), { withFileTypes: true })) {
    if (["node_modules", ".git", "vendor", "img", "immagini"].includes(v.name)) continue;
    const rel = dir ? `${dir}/${v.name}` : v.name;
    if (v.isDirectory()) tutteLePagine(rel, trovate);
    else if (v.name.endsWith(".html")) trovate.push(rel);
  }
  return trovate;
}
export const PAGINE = tutteLePagine().filter((p) => !(p in FUORI_PAGINE)).sort();

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
/* ✅ VUOTO, DAL 07/08, E LA SECONDA META' DELLA REGOLA E' QUELLA CHE L'HA
   SVUOTATO. Le quattro dichiarate erano `mac-gest-tabs`, `ec-miccia` e
   `tipo-volata-btn` nel core e `dc-rock` in Genesi: testo morto, non stile
   perduto — nessuna era un refuso alla `ords`, e infatti toglierle non cambia
   un pixel (nessun foglio le dipinge, nessun `querySelectorAll` le cerca).
   Sono state tolte dalle pagine, e questa suite ha preteso che sparisse anche
   la riga che le scusava: quattro KO col messaggio giusto, che e' esattamente
   il comportamento per cui la seconda meta' esiste.
   ⚠️ Un elenco vuoto NON e' un elenco morto: se domani nasce una classe morta,
   il controllo la trova e la fa dichiarare qui con la sua ragione. */
export const ACCETTATE = new Map([]);

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

/* ⛔ E LA PROVA CHE LA SCANSIONE HA GUARDATO QUALCOSA, che dal 07/08 è
   indispensabile: svuotato l'elenco delle eccezioni, questa suite stampava
   «0 passati, 0 falliti» — cioè il verde di un file di test INERTE, che
   CLAUDE.md dice essere indistinguibile da quello di uno che passa. Un
   controllo senza soggetti non è un controllo pulito: è un controllo spento.
   I due numeri sono un fondo, non un valore esatto: crescono da soli quando
   nasce una schermata, e se crollano vuol dire che una pagina non si legge
   più — che è il modo in cui questo file potrebbe diventare cieco. */
dico(totPagine === PAGINE.length, `pagine lette: ${totPagine} su ${PAGINE.length} dichiarate`);
dico(totClassi > 900, `classi guardate: ${totClassi} — troppo poche perché «nessuna morta» voglia dire qualcosa`);

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

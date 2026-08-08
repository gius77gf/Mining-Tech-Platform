/* IL TOKENIZZATORE — una sola scansione, due viste, un posto solo.
   ═══════════════════════════════════════════════════════════════
   ⚠️ NON VA IN npm test: non e' una suite, e' lo strumento che sta sotto alle
   regole di `run-stile.mjs` e alla misura `stati-sorvegliati.mjs`.

   ⛔ PERCHE' STA IN UN FILE SUO. Viveva dentro `run-stile.mjs`, che pero'
   chiama `process.exit` in fondo: chiunque altro ne avesse avuto bisogno
   avrebbe dovuto RISCRIVERLO, ed e' il difetto che questo progetto paga piu'
   caro — la stessa regola scritta due volte, con due comportamenti diversi.
   E' successo davvero il 01/08: una misura nuova cercava le frasi «non lo so»
   nel testo intero dei moduli, commenti compresi, e la classifica che ne
   usciva era fatta quasi tutta di COMMENTI — cioe' dei punti in cui uno
   sviluppatore SPIEGA il principio, non dei punti in cui il prodotto lo DICE
   all'utente. In Conti tutte e cinque le occorrenze erano commenti.
   `senzaCommenti` faceva gia' esattamente quel lavoro, e stava dietro a un
   `process.exit`.

   Le due viste, e come si sceglie (CLAUDE.md):
   · `mascheraCodice` maschera il CONTENUTO delle stringhe — giusto per le
     regole sul CODICE (un `prompt(` dentro una stringa non e' una chiamata);
   · `senzaCommenti` toglie SOLO i commenti e tiene il resto — giusto per le
     regole sui TESTI, che vivono dentro le stringhe.
   Prendere quello sbagliato da' una regola che non guarda dove crede.

   La storia del difetto dei template annidati e la misura del buco che
   apriva sono qui sotto, dove sono sempre state. */

// Quindi si scorre il testo una volta e si segna, carattere per carattere, se
// si è dentro un commento, una stringa o un'espressione regolare.
/* ⚠️ UNA SOLA SCANSIONE PER TUTTI E DUE I TOKENIZZATORI.
   Prima erano due scansioni gemelle, scritte a distanza di poco e quasi
   identiche — e infatti portavano lo STESSO difetto in due posti, che è
   esattamente il motivo per cui una regola che serve a due usi vive in un
   posto solo. Qui si classifica il testo una volta; `mascheraCodice` e
   `senzaCommenti` leggono la stessa classificazione.

   IL DIFETTO CHE HA FATTO NASCERE QUESTA VERSIONE (31/07). Entrambe, entrando
   in un `backtick`, correvano fino al backtick SUCCESSIVO. Due conseguenze,
   tutte e due silenziose:

   1. Il contenuto di `${...}` finiva marcato come STRINGA. Ma dentro
      un'interpolazione c'è CODICE VERO: `${prompt('quanti?')}` è una chiamata
      a tutti gli effetti, e la regola 1 non la vedeva.
   2. Con i template ANNIDATI — la forma che le app usano di continuo,
      `${dup ? `, ${dup} già presenti` : ""}` — il backtick che APRE quello
      interno veniva preso per quello che CHIUDE l'esterno. Da lì la scansione
      andava fuori fase, e bastava un apostrofo (in italiano ce n'è uno ogni
      due parole: «l'ora», «un'altra») per aprire una stringa che correva in
      avanti masticando codice vivo.

   Quanto era grande il buco: iniettando `window.prompt()` subito dopo ognuno
   dei 67 template annidati delle sette superfici, **54 non venivano visti** —
   31 nel core. La controprova che c'era guardava tre superfici a un punto
   ciascuna, e nessuno di quei tre punti cadeva dopo un template annidato:
   sapeva fallire, ma non dove serviva. È la stessa forma già raccolta in
   CLAUDE.md — il controllo che non guarda dove crede. */
export const COMMENTO = 0, CODICE = 1, DENTRO = 2;   // DENTRO = contenuto di stringa o regex
/* `spie`, se passato, raccoglie i punti in cui si CHIUDE un'interpolazione:
   sono i punti di ri-sincronizzazione, cioè esattamente quelli dove la
   versione vecchia andava fuori fase. La controprova li usa per sapere DOVE
   iniettare il difetto — senza doverli ricavare con una terza scansione, che
   è il modo in cui questo difetto è nato la prima volta. */
/* ⚠️ UNA PAGINA NON È TUTTA JAVASCRIPT, e per mesi questa scansione ha fatto
   finta di sì (trovato il 03/08). Il file veniva letto dal primo carattere
   come se fosse un programma: quindi l'apostrofo di «l'ecosistema» scritto
   nel TESTO della pagina apriva una stringa, che correva fino all'apostrofo
   successivo. Con un numero PARI di apostrofi non succede niente di visibile;
   con un numero DISPARI la fase si inverte, e da lì in poi il codice vero
   viene preso per testo e il testo per codice.

   Non è teoria: in `apps/genesi/genesi.html` **115 delle 195 funzioni
   dichiarate a colonna zero** finivano marcate «non codice», cioè un tratto
   da 23.000 caratteri in cui la regola 1 (niente dialoghi del browser) non
   guardava niente. E il core ne usciva pulito **per caso**: 131 apostrofi e
   39 virgolette, due inversioni che si annullavano.

   Misurato su tutte le superfici: apostrofi nel testo fuori dai tag, da 7
   (profilo) a 131 (core). Cioè la prossima frase in italiano scritta nel
   markup poteva accecare una regola su una pagina intera, in silenzio.

   Adesso: in una pagina il JavaScript sta SOLO dentro i `<script>` e dentro
   gli attributi `on*` (253 in tutto, 202 dei quali nel core — buttarli via
   sarebbe stato barattare un buco con un altro). Tutto il resto — testo,
   nomi dei tag, CSS dentro `<style>`, valori degli altri attributi — non è
   codice, e un apostrofo lì dentro non apre proprio niente. */
export function classifica(t, spie) {
  const paginaHtml = /^\s*<(?:!doctype|html)\b/i.test(t);
  const tipo = new Uint8Array(t.length).fill(paginaHtml ? DENTRO : CODICE);
  const marca = (da, a, v) => { for (let k = da; k < a; k++) tipo[k] = v; };
  if (!paginaHtml) { scansionaJs(t, tipo, marca, 0, t.length, spie); return tipo; }

  let i = 0;
  while (i < t.length) {
    if (t.startsWith("<!--", i)) {                       // commento del markup
      const fine = t.indexOf("-->", i + 4);
      const a = fine < 0 ? t.length : fine + 3;
      marca(i, a, COMMENTO); i = a; continue;
    }
    if (/^<script\b/i.test(t.slice(i, i + 8))) {
      const apre = t.indexOf(">", i);
      if (apre < 0) break;
      /* ⚠️ Il tag di chiusura si cerca da DOPO l'apertura, e il corpo lo
         mastica la scansione JS: in Campo un modello di stampa scrive
         `<script>window.print()</` + `script>` — spezzato apposta perché il
         browser non chiuda il blocco lì. Sta dentro il modulo, quindi il
         markup non lo incontra mai. */
      const fine = t.toLowerCase().indexOf("</script", apre + 1);
      const a = fine < 0 ? t.length : fine;
      scansionaJs(t, tipo, marca, apre + 1, a, spie);
      i = a; continue;
    }
    // `onclick="…"` e compagni: il valore è JavaScript a tutti gli effetti
    const m = /^\son[a-z]+\s*=\s*(["'])/i.exec(t.slice(i, i + 48));
    if (m) {
      const virgoletta = m[1];
      const da = i + m[0].length;
      const fine = t.indexOf(virgoletta, da);
      if (fine > 0) { scansionaJs(t, tipo, marca, da, fine, spie); i = fine + 1; continue; }
    }
    i++;
  }
  return tipo;
}
/* La scansione del JavaScript vero, su un tratto [da, a). Prima era il corpo
   di `classifica`; adesso è a parte perché in una pagina va chiamata una volta
   per blocco `<script>` e una per ogni attributo `on*`, ognuno con il suo
   stato — un template aperto in un blocco non continua in quello dopo. */
function scansionaJs(t, tipo, marca, da, a, spie) {
  /* Che cosa c'è prima di questo `/`: un carattere, oppure — se è una parola —
     la parola INTERA. Serve solo a decidere se lo slash apre un'espressione
     regolare o è una divisione, e la differenza non è accademica:
     `return /[;"\n]/.test(s)` esisteva davvero in Genesi, e con la sola
     lettura dell'ultimo carattere («n» di return) veniva preso per una
     divisione — quindi la virgoletta DENTRO la regex apriva una stringa
     fantasma che correva per 1.500 caratteri. */
  const primaDi = (k) => {
    let j = k - 1;
    while (j >= da && (t[j] === " " || t[j] === "\t" || t[j] === "\n" || t[j] === "\r")) j--;
    if (j < da) return "\n";                      // inizio del blocco: qui ci sta un'espressione
    if (!/[\w$]/.test(t[j])) return t[j];
    let ini = j;
    while (ini >= da && /[\w$]/.test(t[ini])) ini--;
    return t.slice(ini + 1, j + 1);               // l'identificatore intero
  };
  /* Le parole dopo le quali ci sta un'ESPRESSIONE, non un operando: dietro a
     una di queste lo slash è per forza una regex. Dietro a un nome qualunque
     (`larghezza / 2`) è per forza una divisione. */
  const PAROLE = new Set(["return", "typeof", "instanceof", "in", "of", "new",
    "delete", "void", "throw", "case", "do", "else", "yield", "await"]);
  /* ⛔ I CARATTERI DOPO I QUALI CI STA UN'ESPRESSIONE, e il `>` che mancava.
     Terza volta che questa famiglia morde (il 03/08 era la pagina letta come
     JavaScript, e lo slash giudicato dall'ultimo carattere invece che dalla
     parola). Qui il buco era la FRECCIA: dietro a `=>` l'ultimo carattere non
     bianco è un `>`, che nell'elenco non c'era — quindi
     `c => /carburante/i.test(c)` veniva letto come una DIVISIONE e il corpo
     della regex restava codice. Misurato: 158 `=> /` nel repository, 460
     tratti e 18.420 caratteri che tornano a essere ciò che sono.
     Il danno vero non è quello, ed è latente: basta una regex ordinaria come
     `s => /['"]/.test(s)` perché l'apostrofo apra una stringa che corre fino
     in fondo al file, e ogni regola costruita su questa scansione diventi
     cieca rispondendo «nessuna violazione». Oggi nessuna delle sette regex
     dopo una freccia contiene una virgoletta: il difetto c'è e non ha ancora
     nascosto niente.
     ⚠️ IL `+` È STATO PROVATO E SCARTATO, con la misura, perché nessuno lo
     rimetta alla cieca: porta **3 tratti** in tutto (due dei quali erano
     artefatti del `>` mancante, cioè sparivano da soli con questa correzione),
     e in cambio rompe `i++ / 2` — un incremento seguito da una divisione, dove
     il carattere prima dello slash è un `+` — mangiandosi il resto della riga.
     Un guadagno di uno contro una cecità su codice ordinario. */
  const PRIMA_CI_STA_UN_ESPRESSIONE = "(,=:[!&|?{};>\n";
  const pila = [];        // template in attesa che finisca la loro interpolazione
  let stringa = null;     // il delimitatore della stringa in cui ci troviamo
  let graffe = 0;         // profondità di graffe nel codice corrente
  let i = da;
  while (i < a) {
    const c = t[i], d = t[i + 1];
    if (stringa) {
      if (c === "\\") { marca(i, i + 2, DENTRO); i += 2; continue; }
      if (stringa === "`" && c === "$" && d === "{") {
        // si esce dalla stringa: quello che segue è CODICE fino alla graffa pari
        marca(i, i + 2, CODICE); pila.push(graffe); stringa = null; i += 2; continue;
      }
      tipo[i] = DENTRO;                    // anche il delimitatore di chiusura
      if (c === stringa) {
        /* Una stringa di PRIMO livello che si chiude: da qui riprende il
           codice vero, ed è lì che la controprova può iniettare il difetto.
           ⚠️ All'inizio si segnavano solo i **template**, e sembrava
           ragionevole: erano loro a mandare fuori fase la scansione vecchia.
           Ma Genesi i template quasi non li usa — scrive per concatenazione —
           e ne dava **24** contro i 120 di Terra, che è un terzo della sua
           misura: la superficie più grande era anche la meno provata, e la
           ragione era il **modo di scrivere**, non il rischio. Adesso vale per
           tutte e tre le virgolette. */
        if (pila.length === 0 && spie) spie.push(i + 1);
        stringa = null;
      }
      i++; continue;
    }
    if (c === "/" && d === "/") { const fine = t.indexOf("\n", i); const f = fine < 0 || fine > a ? a : fine; marca(i, f, COMMENTO); i = f; continue; }
    if (c === "/" && d === "*") { const fine = t.indexOf("*/", i + 2); const f = fine < 0 || fine + 2 > a ? a : fine + 2; marca(i, f, COMMENTO); i = f; continue; }
    if (c === "<" && t.startsWith("<!--", i)) { const fine = t.indexOf("-->", i + 4); const f = fine < 0 || fine + 3 > a ? a : fine + 3; marca(i, f, COMMENTO); i = f; continue; }
    if (c === "'" || c === '"' || c === "`") { tipo[i] = CODICE; stringa = c; i++; continue; }
    if (c === "{") { graffe++; tipo[i] = CODICE; i++; continue; }
    if (c === "}") {
      if (pila.length && graffe === pila[pila.length - 1]) {   // chiude un `${...}`
        pila.pop(); tipo[i] = CODICE; stringa = "`"; i++; continue;
      }
      graffe--; tipo[i] = CODICE; i++; continue;
    }
    // un'espressione regolare comincia con / solo dove non può stare una divisione
    if (c === "/" && (() => { const p = primaDi(i); return p.length === 1 ? PRIMA_CI_STA_UN_ESPRESSIONE.includes(p) : PAROLE.has(p); })()) {
      tipo[i] = CODICE; i++;
      let inClasse = false;
      while (i < a) {
        if (t[i] === "\\") { marca(i, i + 2, DENTRO); i += 2; continue; }
        if (t[i] === "[") inClasse = true; else if (t[i] === "]") inClasse = false;
        else if (t[i] === "/" && !inClasse) { tipo[i] = DENTRO; i++; break; }
        else if (t[i] === "\n") break;
        tipo[i] = DENTRO; i++;
      }
      continue;
    }
    tipo[i] = CODICE; i++;
  }
}
export function mascheraCodice(t) {
  const tipo = classifica(t);
  const vivo = new Uint8Array(t.length);   // 1 = codice vero
  for (let i = 0; i < t.length; i++) vivo[i] = tipo[i] === CODICE ? 1 : 0;
  return vivo;
}

// Il complemento di `mascheraCodice`: quello maschera il CONTENUTO delle
// stringhe, giusto per i dialoghi (un `prompt(` dentro una stringa non è una
// chiamata). Ma il testo che l'utente LEGGE vive proprio nelle stringhe, quindi
// per le regole sui testi serve l'opposto: via i commenti, resta tutto il resto.
// Scritto con la stessa scansione carattere per carattere, per la stessa ragione:
// un'espressione regolare sui commenti taglierebbe 400.000 caratteri di codice
// vivo, come è già successo.
export function senzaCommenti(t) {
  const tipo = classifica(t);
  let out = "";
  for (let i = 0; i < t.length; i++) if (tipo[i] !== COMMENTO) out += t[i];
  return out;
}

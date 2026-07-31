// ============================================================
// LE REGOLE DI STILE VINCOLANTI, RESE VERIFICABILI
//
// Alcune regole di CLAUDE.md non sono gusto: sono decisioni prese una volta e
// da non rimettere in discussione. Finché vivono solo in memoria di progetto,
// prima o poi qualcuno le rompe in buona fede — e nessuno se ne accorge,
// perché non falliscono i test, si vedono solo aprendo la pagina giusta.
// Qui diventano controlli che girano in automatico.
//
// 18 regole, al 03/08. *(Era rimasto scritto «tredici» per giorni mentre
// l'elenco cresceva: un numero in un commento non fallisce, sta lì — la stessa
// ragione per cui esiste `numeri-nei-documenti.mjs`. Adesso c'è una prova in
// fondo al file che lo confronta con le voci davvero elencate qui sotto.)*
//  1. NIENTE DIALOGHI DEL BROWSER. `alert()`, `confirm()`, `prompt()` sono
//     vietati dalla direttiva sullo stile. La ragione non è estetica: la
//     finestra ha il carattere e i bottoni del sistema operativo, su Android
//     compare incollata in cima allo schermo, in `confirm()` il bottone che
//     distrugge è indistinguibile da quello che annulla, e `prompt()` non
//     accetta la virgola decimale. Si usano la modale e il toast del core.
//  2. LE UNITÀ DI MISURA NON VANNO IN MAIUSCOLO. `m³` diventa `M³`, e
//     `µg/m³` diventa `ΜG/M³` — Chromium trasforma la mu in mu greca
//     MAIUSCOLA — cioè milligrammi, mille volte tanto, su un documento che il
//     cliente consegna all'ente. Il motore dei grafici condiviso avvolge da sé
//     le unità in `.dwg-u`: qui si controlla che quel meccanismo ci sia ancora
//     e che nessuna app torni a metterci una toppa locale che spegne il
//     maiuscolo a TUTTA l'intestazione (allontanandosi dal core).
//  3. NESSUN CAMPO DECIMALE È `type="number"`. In Chromium digitando «2,4» il
//     `.value` diventa «24» e `checkValidity()` risponde true: il browser
//     scarta la virgola e dichiara valido un numero dieci volte più grande.
//     Un campo si dichiara decimale in DUE modi — `step` frazionario oppure
//     `inputmode="decimal"` — e la regola all'inizio guardava solo il primo,
//     lasciandone passare 34 nel core.
//  4. NESSUN CAMPO DECIMALE SI LEGGE CON `parseNum0`, il lettore che di ciò che
//     non capisce fa ZERO. Zero non è «non lo so»: è una misura, ed è sbagliata,
//     e finisce dentro somme e medie senza lasciare traccia.
//  5. DOVE CI SONO CAMPI INTERI, LA GUARDIA È MONTATA. Gli interi restano
//     `type="number"` perché lì lo spinner serve, ma allora la virgola la
//     rifiuta `montaGuardiaInteri` di `shared/`: leggere `checkValidity()` non
//     basterebbe, perché su «1,5» il browser risponde **true**.
//  6. IL PONTE CON TERRA NON DÀ LA COLPA A CHI COMPILA. Se Campo dicesse «le
//     tue stime erano gonfie», i turni comincerebbero a scrivere numeri prudenti
//     invece di veri, e il dato peggiorerebbe dove serve. Il testo deve nominare
//     ENTRAMBE le spiegazioni, compresa quella che non riguarda i turni.
//  7. LA PROVENIENZA DI UN RILIEVO SI DECIDE IN UN POSTO SOLO. Cumulo = già
//     estratto, NON consuma il concesso; scavo sì. La regola era scritta due
//     volte: se una copia divergesse, il materiale tolto anni fa comincerebbe a
//     consumare la concessione senza nessun errore e senza nessun test rosso.
//  8. UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE non è un errore
//     per nessuno: il browser tace, la pagina si apre, la nota si vede — neutra,
//     dove il codice diceva «attenzione». Trovato dal vero: `.note.avviso`
//     esisteva in Terra e in Sentinella, in Campo e Scudo no, e tre note
//     d'avviso rendevano come note qualunque.
//  9. NESSUNA SUPERFICIE SI RISCRIVE IN CASA LA REGOLA DEGLI INTERI. Terra ne
//     aveva una copia, scritta prima che la guardia vivesse in `shared/` e con
//     un comportamento diverso: svuotava il campo. Montate tutte e due, «1.500»
//     diventava «500» — un numero plausibile e sbagliato, cioè la cosa che lo
//     svuotamento voleva evitare. Trovato digitando davvero, non leggendo.
// 10. UNO STATO VUOTO CON UN TITOLO HA ANCHE UNA SPIEGAZIONE. «Nessun mezzo da
//     lavoro» su uno schermo per il resto nero non dice a chi guarda che cosa
//     deve fare, né se il vuoto dipende da lui. Nel core erano tredici, ed è la
//     schermata che una cava nuova vede il primo giorno. Non riguarda i
//     segnaposto brevi dentro le schede («Nessun file»), che hanno la sola riga
//     di spiegazione di proposito: la regola guarda chi ha un TITOLO.
// 11. NESSUNA APP SI SCRIVE IN CASA IL SIMBOLO DELL'EURO. Il 30/07 erano tre
//     forme in tre app, ognuna con accanto la ragione per cui era quella
//     giusta: Conti «€\u00A048.200,00» (spazio unificatore), Terra
//     «€\u002048.200» (spazio normale), Flotta «€178,50» (attaccato). Nessuna
//     era sciatta: nessuna sapeva delle altre. E chi compra due app le vede una
//     accanto all'altra. La forma sta in `euro`/`euro0`/`conEuro` di `shared/`,
//     e chi ha un numero formattato a modo suo mette il simbolo con `conEuro`
//     invece di riscriverlo: è dalla scorciatoia che nascono le terze forme.
// 12. CHI SALTA I DOPPIONI LI CERCA ANCHE DENTRO IL FILE. Il 31/07 dieci
//     gestori d'importazione su dieci confrontavano ogni riga solo con
//     l'elenco caricato all'apertura della pagina, che NON si aggiorna mentre
//     il file scorre: due righe uguali nello stesso file entravano tutte e
//     due, in tutte e sei le app. E non è un caso di scuola — l'export di
//     Scudo scrive una riga per ogni scadenza, quindi ri-caricare il proprio
//     file faceva comparire tre volte lo stesso lavoratore. La regola guarda
//     solo i gestori che i doppioni li saltano davvero: dove ripetersi è
//     lecito (la telemetria che AGGIORNA invece di aggiungere, il piano di
//     carico che SOSTITUISCE quello vecchio) non pretende niente. Guarda
//     entrambe le forme in cui la difesa si scrive: `senzaDoppioni` di
//     `shared/` e il `Set` con la firma aggiunta DENTRO il ciclo — quattro
//     gestori usavano già la seconda, e facevano la cosa giusta da prima.
// 13. DUE ESPORTAZIONI NON SCARICANO LO STESSO NOME DI FILE. In Conti due
//     bottoni scaricavano tutti e due `conti_listino.csv`: uno era il listino
//     ri-caricabile, l'altro un prospetto coi prezzi già convertiti. Nella
//     cartella dei download uno copre l'altro, e nessuno dei due dice quale
//     sia quale — chi poi ri-carica quello sbagliato si sente rispondere che
//     non è valido e conclude che è l'app a non funzionare. Nessuna prova sul
//     comportamento lo trova: ogni export, preso da solo, funziona.
// 14. NESSUNA CLASSE DI COLORE DOVE IL COLORE NON È STATO MISURATO *(vedi il
//     corpo del file, dove la regola è scritta per esteso)*.
// 15. IL GIORNO DI CALENDARIO NON SI PRENDE IN UTC. `toISOString()` scrive
//     sempre l'istante a Greenwich: in Italia sta una o due ore avanti, e
//     quando attraversano la mezzanotte cambia il GIORNO. Il 31/07 questo
//     spostava di un mese intero le barre del grafico del core.
// 16. DENTRO UN MODULO, LE MIGLIAIA SI RAGGRUPPANO PER SCRITTO. Misurato il
//     02/08 affiancando i motori: con le opzioni di serie, sui numeri di
//     QUATTRO cifre Chromium scrive «6.375» e Node «6375». Le pagine non ne
//     soffrono (girano solo nel browser); i moduli sì, perché li leggono
//     tutt'e due — e da lì una prova che passa in Node e fallirebbe nel
//     browser, cioè che blinda una stringa che l'utente non vede mai.
// 17. LA STRUTTURA DEL CORE NON SI RISCRIVE IN CASA. Toast, modale, conferma,
//     richiesta di un valore e chiusura con Escape erano scritti SEI VOLTE —
//     27 copie, il 76% delle righe identico carattere per carattere — e una si
//     era già staccata perché a un'app serviva qualcosa in più. Ora stanno in
//     `shared/dw-app-ui.js`. La regola guarda le due direzioni opposte: chi
//     carica il condiviso non deve ridefinirle (una copia locale vince e
//     riapre la distanza), e chi le usa deve averle da qualche parte —
//     togliere le funzioni dimenticando il `<script>` non è un errore di
//     sintassi: la pagina si apre e muore al primo tocco.
//
// 18. UNA MAPPA DI STATI COPRE TUTTI GLI STATI CHE LA SUA FUNZIONE SA DIRE.
//     Il 03/08 `statoScadenzaHSE` ha guadagnato una quarta risposta («senza
//     data», perché una data illeggibile non è una scadenza a posto) e la mappa
//     dei badge di Scudo ne aveva tre: `B[st]` sarebbe stato `undefined` e
//     `B[st][0]` avrebbe ucciso la pagina **al disegno del primo riquadro** —
//     non un errore di sintassi, quindi nessun controllo esistente lo vedeva.
//     Terra aveva la stessa coppia e lo stesso rischio. La regola confronta le
//     stringhe che la funzione può restituire con le chiavi della mappa che la
//     pagina usa per disegnarle.
//
// Come si aggiunge una regola: una funzione che restituisce l'elenco delle
// violazioni con file e riga, e un `test(...)` che pretende zero.
// ============================================================
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const root = join(HERE, "..", "..", "..");   // tests → deepwork-id → apps → radice

let passed = 0, failed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log(`  ✓ ${name}`); } catch (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); } };
const ok = (cond, why) => { if (!cond) throw new Error(why); };

// Tutte le superfici che l'utente apre. Se nasce un'app, va aggiunta qui.
const SUPERFICI = [
  ["core (radice)", "index.html"],
  ["vetrina dell'ecosistema", "apps/index.html"],
  ["Genesi", "apps/genesi/genesi.html"],
  ["Conti", "apps/conti/index.html"],
  ["Flotta", "apps/flotta/index.html"],
  ["Scudo", "apps/scudo/index.html"],
  ["Campo", "apps/campo/index.html"],
  ["Sentinella", "apps/sentinella/index.html"],
  ["Terra", "apps/terra/index.html"],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html"],
  ["Deepwork ID · profilo", "apps/deepwork-id/profilo.html"],
  ["Deepwork ID · accesso", "apps/deepwork-id/index.html"],
  /* Entrate il 03/08. Erano pagine che l'utente apre davvero — una ci finisce
     quando gli manca un permesso, l'altra è il portone di Genesi — e nessuna
     regola di stile le aveva mai guardate: l'elenco si aggiornava a mano, cioè
     a memoria. Adesso c'è il controllo qui sotto che lo pretende. */
  ["Deepwork ID · non autorizzato", "apps/deepwork-id/non-autorizzato.html"],
  ["Genesi · accesso", "apps/genesi/login.html"],
  /* ⚠️ Entrato il 03/08 CORREGGENDO una mia esclusione sbagliata: l'avevo
     dichiarato «non raggiungibile dalla navigazione», e invece la home di
     Genesi ha un bottone «Apri il visore nuvola» (genesi.html:607) e Terra ci
     manda l'utente a parole quando manca il volume dal drone. Una ragione
     scritta va verificata come tutto il resto: dichiararla non la rende vera. */
  ["Genesi · visore nuvola", "apps/genesi/nuvola-poc.html"],
];
// I moduli dati e il motore condiviso: nessuna interfaccia, ma è da lì che
// partirebbe una regressione silenziosa.
const MODULI = [
  ["motore grafici", "shared/dw-grafici.js"],
  ["motore grafici (stile)", "shared/dw-grafici.css"],
  /* La struttura del core (toast, modale, alone) da quando vive in un posto
     solo. Ci è entrata il 03/08, il giorno dopo essere nata: nessuna regola la
     guardava, ed è il file che le sei app caricano tutte. */
  ["struttura condivisa", "shared/dw-app-ui.js"],
  ["guscio SDK", "shared/deepwork-id-client/dw-shell.js"],
  ["ponti fra le app", "shared/dw-ponti.js"],
  ["Campo (dati)", "apps/campo/campo-data.js"],
  ["Conti (dati)", "apps/conti/conti-data.js"],
  ["Flotta (dati)", "apps/flotta/flotta-data.js"],
  ["Scudo (dati)", "apps/scudo/scudo-data.js"],
  ["Sentinella (dati)", "apps/sentinella/sentinella-data.js"],
  ["Terra (dati)", "apps/terra/terra-data.js"],
];

/* ⛔ L'ELENCO DELLE SUPERFICI SI AGGIORNAVA A MEMORIA.
   `CLAUDE.md` lo dice — «quando nasce un'app va aggiunta all'elenco
   SUPERFICI» — ed è esattamente la forma di regola che questo file esiste per
   sostituire. Il 03/08 la misura: nel repo ci sono **sedici** file `.html`, e
   l'elenco ne conosceva **dodici**. Le quattro fuori non erano state escluse:
   erano state dimenticate. Due sono pagine che l'utente apre davvero — quella
   in cui si finisce quando manca un permesso, e il portone di Genesi — e
   nessuna regola di stile le aveva mai guardate.
   Chi resta fuori adesso deve dirlo con la ragione. */
const FUORI_SUPERFICI = {
  "shared/_collaudo-grafici.html":
    "il collaudo del motore dei grafici — l'underscore nel nome lo dichiara: "
    + "serve a guardare i grafici uno accanto all'altro, non è un'interfaccia",
};
function tutteLePagine(dir = "", trovate = []) {
  for (const v of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (v.name === "node_modules" || v.name === ".git" || v.name === "vendor") continue;
    const rel = dir ? `${dir}/${v.name}` : v.name;
    if (v.isDirectory()) tutteLePagine(rel, trovate);
    else if (v.name.endsWith(".html")) trovate.push(rel);
  }
  return trovate;
}
console.log("\n── L'elenco delle superfici è completo ──");
{
  const sulDisco = tutteLePagine().sort();
  const conosciute = new Set(SUPERFICI.map(([, r]) => r));
  const dimenticate = sulDisco.filter((r) => !conosciute.has(r) && !(r in FUORI_SUPERFICI));
  const fantasmi = [...conosciute].filter((r) => !sulDisco.includes(r));
  const escluseSparite = Object.keys(FUORI_SUPERFICI).filter((r) => !sulDisco.includes(r));
  test(`ogni pagina del repo è guardata o esclusa con la ragione (${sulDisco.length} file .html)`, () => {
    ok(sulDisco.length >= 14, `solo ${sulDisco.length} pagine trovate: la scansione delle cartelle non sta guardando niente`);
    ok(dimenticate.length === 0,
      `${dimenticate.length} pagine che nessuna regola guarda → ${dimenticate.join(", ")}`
      + " — o entrano in SUPERFICI, o la ragione va scritta in FUORI_SUPERFICI");
    ok(fantasmi.length === 0, `SUPERFICI nomina file che non esistono più: ${fantasmi.join(", ")}`);
    ok(escluseSparite.length === 0,
      `FUORI_SUPERFICI esclude file che non ci sono più: ${escluseSparite.join(", ")} — righe da togliere`);
  });
}

const leggi = (rel) => { try { return readFileSync(join(root, rel), "utf8"); } catch { return null; } };

// I dialoghi vietati compaiono di proposito DENTRO I COMMENTI, che spiegano
// perché sono stati mandati via: bisogna saper distinguere il commento dal
// codice.
//
// ⚠️ NON si fa con `replace(/\/\*[\s\S]*?\*\//g, '')`. L'ho provato e sembrava
// funzionare: tutte le superfici passavano. Poi la controprova — rimettere un
// `window.prompt()` nel core e pretendere che il controllo fallisse — è passata
// anche quella, e allora si è visto perché: il core passava da 537.000 a
// 137.000 caratteri. Nel codice ci sono `/*` e `*/` dentro stringhe ed
// espressioni regolari, quindi l'accoppiamento non greedy legava i delimitatori
// sbagliati e cancellava 400.000 caratteri di codice VIVO. Il controllo diceva
// «nessuna violazione» perché non stava guardando quasi niente: la stessa
// trappola dei test inerti che dicono «0 falliti».
//
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
const COMMENTO = 0, CODICE = 1, DENTRO = 2;   // DENTRO = contenuto di stringa o regex
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
function classifica(t, spie) {
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
    if (c === "/" && (() => { const p = primaDi(i); return p.length === 1 ? "(,=:[!&|?{};\n".includes(p) : PAROLE.has(p); })()) {
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
function mascheraCodice(t) {
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
function senzaCommenti(t) {
  const tipo = classifica(t);
  let out = "";
  for (let i = 0; i < t.length; i++) if (tipo[i] !== COMMENTO) out += t[i];
  return out;
}

// `deferredPrompt.prompt()` è l'API di installazione della PWA, non un dialogo:
// si riconosce perché ha un oggetto davanti. Cerchiamo la chiamata NUDA.
//
// MA `window.` va contato: il core scriveva proprio `window.prompt('Distanza
// reale…')`. La prima versione di questo controllo escludeva tutto ciò che
// aveva un punto davanti, quindi si sarebbe lasciata sfuggire esattamente la
// violazione che avevo appena corretto. L'ha scoperto il controllo del
// controllo qui sotto, ed è la ragione per cui esiste.
const DIALOGHI = /(alert|confirm|prompt)\s*\(/g;

function dialoghiIn(testo, masc = mascheraCodice) {
  const vivo = masc(testo);
  const fuori = [];
  let m;
  DIALOGHI.lastIndex = 0;
  while ((m = DIALOGHI.exec(testo)) !== null) {
    const at = m.index;
    if (!vivo[at]) continue;                       // sta in un commento o in una stringa
    // cosa c'è davanti al nome: se è un punto è il metodo di un oggetto —
    // `deferredPrompt.prompt()` è l'API della PWA, non un dialogo. Ma
    // `window.prompt(` sì: il core scriveva proprio così, e la prima versione
    // di questo controllo se lo lasciava sfuggire.
    const prima = testo.slice(Math.max(0, at - 40), at);
    if (/\.\s*$/.test(prima) && !/\b(?:window|globalThis|self)\s*\.\s*$/.test(prima)) continue;
    if (/[\w$]$/.test(prima)) continue;            // parte di un identificatore più lungo
    const riga = testo.slice(0, at).split("\n").length;
    const testoRiga = (testo.split("\n")[riga - 1] || "").trim().slice(0, 90);
    fuori.push({ riga, quale: m[1], testo: testoRiga });
  }
  return fuori;
}

console.log("\n── Regola 1: niente dialoghi del browser ──");
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  const src = leggi(rel);
  if (src === null) continue;                      // superficie non ancora esistente
  test(`${nome}: nessun alert/confirm/prompt del browser`, () => {
    const v = dialoghiIn(src);
    ok(v.length === 0, `${rel} — ${v.map(x => `riga ${x.riga}: ${x.quale}() « ${x.testo} »`).join(" | ")}`);
  });
}
// Il controllo del controllo. Non è pedanteria: la prima versione passava su
// tutte le superfici E passava anche con un `window.prompt()` rimesso a mano
// nel core. Un controllo che non sa fallire non sta controllando niente.
test("il controllo si accorge dei dialoghi veri", () => {
  ok(dialoghiIn("function x(){ if(confirm('sicuro?')) fai(); }").length === 1, "confirm() nudo");
  ok(dialoghiIn("window.prompt('x')").length === 1, "window.prompt");
  ok(dialoghiIn("  alert('ciao');").length === 1, "alert indentato");
  ok(dialoghiIn("if(!confirm('x'))return;").length === 1, "confirm dentro una condizione");
  ok(dialoghiIn("globalThis.confirm('x')").length === 1, "globalThis.confirm");
});
test("il controllo non accusa quello che non è un dialogo", () => {
  ok(dialoghiIn("/* qui c'era confirm('x') */ nulla();").length === 0, "dentro un commento a blocco");
  ok(dialoghiIn("// vecchio: alert('ciao')").length === 0, "dentro un commento di riga");
  ok(dialoghiIn("deferredPrompt.prompt();").length === 0, "l'API della PWA non è un dialogo");
  ok(dialoghiIn("const s = 'usa confirm(x) invece';").length === 0, "dentro una stringa");
  ok(dialoghiIn("miaConferma('x'); reconfirm('y');").length === 0, "nomi che finiscono uguale");
  ok(dialoghiIn("obj.alert('x');").length === 0, "un metodo di un altro oggetto");
});
// La controprova che vale più di tutte: si rimette un dialogo DENTRO I FILE
// VERI e si pretende che il controllo lo trovi. È così che ho scoperto che la
// prima versione non funzionava — passava su tutte le superfici e passava anche
// col dialogo rimesso, perché il taglio dei commenti a espressioni regolari
// cancellava 400.000 caratteri di codice vivo (`/*` e `*/` compaiono anche
// dentro stringhe e regex, e l'accoppiamento non greedy legava i delimitatori
// sbagliati). Una prova che non sa fallire sul difetto non dimostra niente.
for (const [nome, rel, ancora] of [
  ["core", "index.html", "function reconCalibra("],
  ["Genesi", "apps/genesi/genesi.html", "function salvaVolata("],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html", "async (...a) => {"],
]) {
  test(`controprova su ${nome}: un dialogo rimesso a mano viene trovato`, () => {
    const src = leggi(rel);
    ok(src, `${rel} non trovato`);
    ok(src.includes(ancora), `l'ancora « ${ancora} » non c'è più in ${rel}: aggiornare la controprova`);
    ok(dialoghiIn(src).length === 0, `${rel} parte pulito`);
    for (const veleno of ["window.prompt('x');", "if(!confirm('x'))return;", "alert('x');"]) {
      const rotto = src.replace(ancora, veleno + " " + ancora);
      const trovati = dialoghiIn(rotto);
      ok(trovati.length === 1,
        `« ${veleno} » iniettato in ${rel} non è stato trovato (trovati ${trovati.length}) — il controllo non sta guardando il codice`);
    }
  });
}
test("un `/*` dentro un'espressione regolare non apre un commento", () => {
  const insidia = "const re = /\\/\\*/; confirm('mi devi trovare');";
  ok(dialoghiIn(insidia).length === 1, "il confirm dopo la regex deve essere trovato");
});
test("un dialogo dentro un'interpolazione è una chiamata, non un testo", () => {
  ok(dialoghiIn("const s = `quanti ${prompt('quanti?')} fori`;").length === 1,
    "`${prompt(...)}` è codice vero: la versione vecchia lo mascherava come stringa");
  ok(dialoghiIn("const s = `scrivi ${x} e poi prompt(qualcosa)`;").length === 0,
    "ma il testo che PARLA di un prompt resta testo");
});

/* ══ LA SCANSIONE NON PERDE LA FASE — la misura che l'ha resa verificabile ══
   ────────────────────────────────────────────────────────────────────────
   Trovato il 03/08, e i due difetti erano indipendenti:

   1. la scansione leggeva la PAGINA INTERA come JavaScript, quindi
      l'apostrofo di «l'ecosistema» scritto nel testo apriva una stringa.
      Con un numero pari di apostrofi non succede niente; con uno dispari la
      fase si inverte e il codice vero diventa «testo»;
   2. `return /[;"\n]/.test(s)` — che in Genesi c'è davvero — veniva preso per
      una divisione, perché la regola guardava solo l'ULTIMO carattere prima
      dello slash («n», di return) e non la parola.

   Insieme facevano sparire **115 delle 195 funzioni dichiarate a colonna zero
   in Genesi**, cioè tratti da decine di migliaia di caratteri in cui la
   regola 1 non guardava niente e rispondeva lo stesso «nessuna violazione».
   Il core ne usciva pulito per CASO: 131 apostrofi e 39 virgolette, due
   inversioni che si annullavano.

   Questa prova è la misura stessa, tenuta accesa: una dichiarazione all'inizio
   di una riga — `function x(`, `const y =` — è codice o commento, mai il
   CONTENUTO di una stringa. Se la scansione la chiama «stringa» ha perso la
   fase. È l'unico controllo del file che verifica lo STRUMENTO invece di una
   regola.

   ⚠️ DUE COSE IMPARATE SCRIVENDOLA, e sono la stessa lezione di sempre —
   contare quanti soggetti si sta guardando davvero:
   1. la prima stesura prendeva solo le dichiarazioni a **colonna zero**: 934
      ancore, che sembravano tante, ma **le sei pagine delle app ne davano
      ZERO**. Il loro codice è tutto indentato dentro un blocco, quindi la
      prova non guardava proprio le superfici che contano di più. Contando
      anche le righe indentate le ancore diventano **7.485**, e nessuna
      superficie resta fuori;
   2. si pretende «non DENTRO», non «uguale a CODICE». In `dw-grafici.js` c'è
      un `const g = dwGrafici.linea(…)` dentro un commento — è l'esempio d'uso
      scritto nell'intestazione. Un pezzo di codice mostrato in un commento è
      un commento, e pretendere CODICE lo accusava a torto. */
const DICHIARAZIONE = /(^|\n)([ \t]*)((?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(|(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=)/g;
function dichiarazioniFuoriFase(src) {
  const tipo = classifica(src);
  const fuori = [];
  DICHIARAZIONE.lastIndex = 0;
  let m;
  while ((m = DICHIARAZIONE.exec(src)) !== null) {
    const at = m.index + m[1].length + m[2].length;
    if (tipo[at] === DENTRO) fuori.push(src.slice(0, at).split("\n").length);
  }
  return fuori;
}
let dichTot = 0, dichFuori = 0, dichSuperfici = 0;
const dichDove = [], dichVuote = [], dichSenzaProgramma = [];
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  const src = leggi(rel);
  if (src === null) continue;
  DICHIARAZIONE.lastIndex = 0;
  const quante = (src.match(DICHIARAZIONE) || []).length;
  dichTot += quante;
  /* Un file può non dare nessuna ancora per due ragioni opposte, e vanno
     separate: perché non ha PROGRAMMA (il foglio di stile del motore grafici,
     e il portone di Genesi, che è markup e basta — nemmeno un `<script>`),
     oppure perché la scansione ha perso la fase e non ne trova più. La prima è
     legittima e si conta a parte; la seconda fa cadere la prova.
     ⚠️ Ci sono cascato appena messo `login.html` nell'elenco: la prova l'ha
     accusato di essere fuori fase, e invece non c'era niente da vedere. */
  const senzaProgramma = rel.endsWith(".css") || (rel.endsWith(".html") && !/<script/i.test(src));
  if (quante > 0) dichSuperfici++;
  else if (senzaProgramma) dichSenzaProgramma.push(nome);
  else dichVuote.push(nome);
  const f = dichiarazioniFuoriFase(src);
  if (f.length) { dichFuori += f.length; dichDove.push(`${nome} (righe ${f.slice(0, 4).join(", ")}…)`); }
}
test(`la scansione non perde la fase: ${dichTot} dichiarazioni in ${dichSuperfici} file, nessuna presa per stringa`, () => {
  ok(dichTot > 7000, `solo ${dichTot} dichiarazioni guardate: il controllo non sta misurando niente`);
  ok(dichVuote.length === 0, `${dichVuote.join(", ")}: nessuna ancora, quindi su questi file la prova non guarda niente`);
  ok(dichFuori === 0, `${dichFuori} dichiarazioni prese per testo → ${dichDove.join(" · ")}`);
});
test("la scansione sa fallire: i due difetti rimessi le fanno perdere la fase", () => {
  // (1) la pagina letta come se fosse tutta JavaScript
  const pagina = "<!DOCTYPE html>\n<html lang=\"it\">\n<body>\n<p>l'ecosistema</p>\n"
    + "<script>\nfunction f(){ }\n</script>\n</body></html>\n";
  ok(dichiarazioniFuoriFase(pagina).length === 0,
    "un apostrofo nel TESTO della pagina non apre nessuna stringa");
  ok(dialoghiIn(pagina.replace("function f(){ }", "function f(){ confirm('x'); }")).length === 1,
    "e il dialogo dentro lo <script> si vede lo stesso");
  ok(dialoghiIn("<!DOCTYPE html>\n<html><body>\n<p>l'ora, l'altra e un'altra</p>\n"
    + "<button onclick=\"confirm('davvero?')\">via</button>\n</body></html>").length === 1,
    "un gestore scritto nell'attributo È JavaScript: 253 nelle superfici, 202 nel solo core");
  ok(dialoghiIn("<!DOCTYPE html>\n<html><body>\n<p>qui si parla di confirm(x) a parole</p>\n</body></html>").length === 0,
    "ma il testo che NOMINA un dialogo resta testo");
  // (2) lo slash dopo una parola-chiave
  const conRegex = "function a(s){ return /[;\"\\n]/.test(s); }\nfunction b(){ }\n";
  ok(dichiarazioniFuoriFase(conRegex).length === 0,
    "`return /…\"…/` è un'espressione regolare, non una divisione: la virgoletta dentro non apre niente");
  ok(dichiarazioniFuoriFase("const q = larghezza / 2, r = altezza / 3;\nfunction b(){ }\n").length === 0,
    "e una divisione vera resta una divisione");
});

/* LA CONTROPROVA A TAPPETO: il difetto rimesso DOVE OGNI STRINGA SI CHIUDE.
   ────────────────────────────────────────────────────────────────────────
   Quella qui sopra inietta in tre superfici a un punto ciascuna, e nessuno di
   quei punti cadeva dove la scansione andava fuori fase: sapeva fallire, ma
   non dove serviva. Questa inietta nei punti di ri-sincronizzazione di TUTTE
   le superfici — e stampa quanti ne ha provati, perché uno «zero violazioni»
   ottenuto su zero soggetti è il difetto raccolto in CLAUDE.md.

   ⚠️ IL TETTO È DICHIARATO, NON NASCOSTO. I punti sono **20.566** e ognuno
   costa una ri-scansione del file intero: provarli tutti porta la suite da
   pochi secondi a oltre due minuti, e a 240 per superficie a un minuto. Se ne
   provano `TETTO`, presi a passo regolare su tutta la lunghezza del file — e
   si stampa **quanti ne sono stati saltati**, perché un taglio taciuto si
   legge come «copre tutto».
   Il numero è scelto misurando, non a occhio: con `TETTO` a 120 la suite gira
   in **49 secondi**, cioè meno dei **51** che ci metteva prima di questo
   lavoro — e nel frattempo la controprova è passata da dieci superfici a
   **dodici** e dai soli template a **tutte e tre le virgolette**. Il passo regolare conta più della quantità: un
   difetto di fase non è un punto isolato, è un TRATTO — se la scansione si
   perde, si perde per migliaia di caratteri, e un colpo ogni ventun punti ci
   cade dentro lo stesso.

   ⚠️ E PRIMA SEGNAVA SOLO I TEMPLATE. Sembrava ragionevole — erano loro a
   mandare fuori fase la scansione vecchia — ma Genesi i template quasi non li
   usa: ne dava **24** contro i 120 di Terra, che è un terzo della sua misura.
   La superficie meno provata era la più grande, e per il modo di scrivere di
   chi l'aveva scritta, non per il rischio. */
const TETTO = 120;
function iniezioniNonViste(src, masc) {
  const spie = [];
  classifica(src, spie);
  const passo = Math.max(1, Math.ceil(spie.length / TETTO));
  const base = dialoghiIn(src, masc).length;
  let ciechi = 0, provati = 0;
  for (let k = 0; k < spie.length; k += passo) {
    provati++;
    // si inietta ESATTAMENTE dove la stringa si chiude: lì siamo in codice.
    // (Prima iniettavo a fine riga, ma dopo una stringa chiusa la riga spesso
    // prosegue dentro un'altra: il dialogo finiva in un testo, dove NON deve
    // essere trovato, e la controprova accusava la scansione giusta.)
    const rotto = src.slice(0, spie[k]) + ";window.prompt('x');" + src.slice(spie[k]);
    if (dialoghiIn(rotto, masc).length <= base) ciechi++;
  }
  return { provati, ciechi, esistenti: spie.length };
}
/* La scansione SBAGLIATA, tenuta apposta: serve a dimostrare che questa
   controprova sa fallire. Senza, direbbe «tutto trovato» anche se non stesse
   guardando niente. */
function mascheraIngenua(t) {
  const vivo = new Uint8Array(t.length);
  let i = 0;
  while (i < t.length) {
    const c = t[i];
    if (c === "'" || c === '"' || c === "`") {
      vivo[i] = 1; i++;
      while (i < t.length) { if (t[i] === "\\") { i += 2; continue; } if (t[i] === c) { i++; break; } i++; }
      continue;
    }
    vivo[i] = 1; i++;
  }
  return vivo;
}
let provatiTot = 0, esistentiTot = 0, ciechiIngenua = 0;
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const { provati, ciechi, esistenti } = iniezioniNonViste(src);
  if (provati === 0) continue;
  provatiTot += provati;
  esistentiTot += esistenti;
  ciechiIngenua += iniezioniNonViste(src, mascheraIngenua).ciechi;
  const quanti = provati < esistenti
    ? `${provati} dialoghi su ${esistenti} punti (uno ogni ${Math.ceil(esistenti / TETTO)})`
    : `${provati} dialoghi, cioè TUTTI i punti`;
  test(`controprova a tappeto su ${nome}: ${quanti}, tutti trovati`, () => {
    ok(ciechi === 0, `${rel}: ${ciechi} iniezioni su ${provati} passano inosservate`);
  });
}
test("la controprova a tappeto ha davvero iniettato qualcosa", () => {
  ok(provatiTot >= 60, `solo ${provatiTot} iniezioni: le stringhe sono sparite, o le spie non funzionano più`);
  console.log(`     (${provatiTot} iniezioni provate, prese a passo regolare su ${esistentiTot} punti di ri-sincronizzazione)`);
});
test("la controprova a tappeto sa fallire: con la scansione ingenua il difetto sfugge", () => {
  ok(ciechiIngenua > 0,
    "con la scansione che ignora i template annidati NESSUNA iniezione sfugge: allora questa prova non sta misurando niente");
  console.log(`     (con la scansione ingenua ne sfuggirebbero ${ciechiIngenua} su ${provatiTot})`);
});

console.log("\n── Regola 2: le unità di misura non vanno in maiuscolo ──");
test("il motore dei grafici avvolge le unità in .dwg-u", () => {
  const js = leggi("shared/dw-grafici.js");
  ok(js, "shared/dw-grafici.js non trovato");
  ok(/function\s+testoConUnita/.test(js), "manca testoConUnita: era il meccanismo che sottrae l'unità al maiuscolo");
  ok(/'dwg-axlab dwg-u'/.test(js), "l'etichetta d'asse deve portare .dwg-u: contiene SOLO l'unità");
  ok(/function\s+paiUnita/.test(js), "manca paiUnita, il riconoscimento di cosa è un'unità");
});
test(".dwg-u spegne il maiuscolo, nel foglio condiviso", () => {
  const css = leggi("shared/dw-grafici.css");
  ok(css, "shared/dw-grafici.css non trovato");
  const blocco = css.match(/\.dwg-u[^{]*\{[^}]*\}/);
  ok(blocco, "manca la regola per .dwg-u");
  ok(/text-transform:\s*none/.test(blocco[0]), `.dwg-u deve togliere il maiuscolo — trovato: ${blocco[0]}`);
});
test("nessuna app rimette una toppa locale sui grafici", () => {
  // Una toppa come `.dwg-tab thead th{text-transform:none}` corregge l'unità
  // ma spegne il maiuscolo anche a «Voce» e «Quota», cioè allontana la tabella
  // dal core: la struttura deve restare identica al riferimento.
  const colpevoli = [];
  for (const [nome, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null) continue;
    const re = /\.(dwg-axlab|dwg-tab\s+thead\s+th|dwg-title)\s*\{[^}]*text-transform\s*:\s*none/g;
    if (re.test(src)) colpevoli.push(`${nome} (${rel})`);
  }
  ok(colpevoli.length === 0,
    `la correzione sta in shared/, non nelle app: ${colpevoli.join(", ")}`);
});
test("paiUnita non prende una data per un'unità", async () => {
  // «Cavato e venduto — 01/01/2026 – 31/12/2026» finisce con una data, e la
  // barra la faceva sembrare `l/h`. Le due esclusioni imparate su titoli veri.
  const js = leggi("shared/dw-grafici.js");
  ok(/\[0-9\]/.test(js) || /0-9/.test(js), "manca l'esclusione delle cifre: una data non è un'unità");
  ok(/coda\.length\s*>\s*8/.test(js), "manca il limite di lunghezza: oltre 8 caratteri è una parola, non un'unità");
});

console.log("\n── Regola 3: un campo decimale non è mai type=number ──");
// Misurato in Chromium: in un `<input type="number">`, digitando «2,4» da
// tastiera il `.value` diventa «24» e `checkValidity()` risponde true. Il
// browser scarta la virgola, tiene le cifre e chiama valido un numero dieci
// volte più grande — e in cava chi compila scrive la virgola. Su una carica di
// esplosivo, su un imponibile o su una coordinata GPS è il difetto peggiore
// della piattaforma, perché è silenzioso.
// Un campo decimale si dichiara tale in DUE modi, e questa regola all'inizio
// guardava solo il primo — per questo passava mentre nel core ne restavano 34
// dello stesso difetto, nella stessa schermata dei 32 corretti:
//   1. `step` frazionario (step="0.1"): la firma classica;
//   2. `inputmode="decimal"`: il campo dichiara la tastiera decimale sul
//      telefono, quindi si aspetta un numero con la virgola — e allora
//      `type="number"` è un difetto anche senza step, perché lo step assente
//      vale 1 e il browser rifiuta i decimali oltre a scartare la virgola.
// Il caso 2 era il peggiore proprio perché sembrava già a posto: fra quei 34
// c'erano il diametro del foro, la spalla del calcolatore di carica e i
// parametri di Kuz-Ram, dove «3,5» diventava 35.
const APP_SEI = SUPERFICI.filter(([n]) => !/core|Deepwork ID/.test(n));
function numeriDecimali(src) {
  const fuori = [];
  const tag = /<input\b[^>]*>/gi;
  let m;
  while ((m = tag.exec(src)) !== null) {
    const t = m[0];
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    const perStep = st != null && st[1].includes(".");
    const perInputmode = /inputmode="decimal"/.test(t);
    if (!perStep && !perInputmode) continue;        // campo intero: va bene così
    const id = /id="([^"]*)"/.exec(t);
    fuori.push({ id: id ? id[1] : "(senza id)", perche: perStep ? "step " + st[1] : 'inputmode="decimal"' });
  }
  return fuori;
}
for (const [nome, rel] of APP_SEI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale è rimasto type=number`, () => {
    const v = numeriDecimali(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
  });
}
test("il controllo si accorge di un campo decimale rimesso a type=number", () => {
  ok(numeriDecimali('<input id="x" type="number" step="0.1">').length === 1, "step frazionario trovato");
  // la seconda firma: dichiarato decimale dall'inputmode, senza step. È quella
  // che la regola non guardava, e che nel core lasciava passare 34 campi.
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal">').length === 1, "inputmode=decimal su type=number trovato");
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal" step="1">').length === 1, 'step="1" non assolve: la percentuale 12,5 resta vietata');
  ok(numeriDecimali('<input id="x" type="number" step="1">').length === 0, "un campo intero non è un difetto");
  ok(numeriDecimali('<input id="x" type="number" inputmode="numeric">').length === 0, "un intero che dichiara la tastiera intera va bene");
  ok(numeriDecimali('<input id="x" type="text" inputmode="decimal" step="0.1">').length === 0, "convertito: a posto");
  // controprova sui file veri: si rimette il difetto e il controllo deve vederlo
  for (const [nome, rel] of [["Campo", "apps/campo/index.html"], ["Genesi", "apps/genesi/genesi.html"]]) {
    const src = leggi(rel);
    if (!src) continue;
    ok(numeriDecimali(src).length === 0, `${nome} parte pulito`);
    for (const veleno of ['<input id="veleno" type="number" step="0.1">',
                         '<input id="veleno" type="number" inputmode="decimal">']) {
      const rotto = src.replace('<input', veleno + '<input');
      ok(numeriDecimali(rotto).length === 1, `${nome}: il difetto iniettato viene trovato (${veleno})`);
    }
  }
});
// IL CORE è convertito anche lui, in due passaggi perché la regola all'inizio
// vedeva metà del difetto: prima i 32 campi con lo step frazionario — fra cui le
// COORDINATE GPS della cava (`cf-lat`/`cf-lon`, dove «37,0625» diventava
// 370625) e i parametri di volata (`a-b` spalla, `a-s` interasse, `a-mh`
// carica massima per ritardo, `a-pm` consumo specifico) — poi altri 34 che si
// dichiaravano decimali col solo `inputmode`, fra cui il diametro del foro, la
// spalla del calcolatore di carica e i parametri di Kuz-Ram.
// Adesso la regola vale su TUTTA la piattaforma, core compreso: non c'è più
// nessuna superficie esentata.
test("core: nessun campo decimale è rimasto type=number", () => {
  const v = numeriDecimali(leggi("index.html") || "");
  ok(v.length === 0,
    `index.html — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
});
test("e i campi INTERI del core sono rimasti type=number", () => {
  // La conversione deve riguardare SOLO i decimali: sugli interi (anno, km,
  // numero di fori) lo spinner del browser serve, e mezzo foro non esiste.
  //
  // ⚠️ Qui prima c'era `ok(n === 53)`, il conteggio del giorno in cui l'ho
  // scritto. Era una trappola: quando si è scoperto che 34 di quei 53 non erano
  // interi ma decimali travestiti, il test ha accusato la correzione invece del
  // difetto. Un conteggio inchiodato scambia il progresso per una regressione.
  // Adesso il controllo guarda la NATURA dei campi, che è ciò che la regola
  // dice davvero: ogni campo rimasto `type=number` deve essere un intero.
  const src = leggi("index.html") || "";
  const rimasti = (src.match(/<input\b[^>]*type="number"[^>]*>/g) || []);
  ok(rimasti.length > 0, "nel core non c'è più nessun campo intero: la conversione ha preso troppo");
  const sospetti = rimasti.filter((t) => {
    if (/inputmode="decimal"/.test(t)) return true;             // si dichiara decimale
    const st = /step="([^"]*)"/.exec(t);
    return st != null && st[1].includes(".");                   // step frazionario
  });
  ok(sospetti.length === 0,
    `campi ancora type=number ma dichiarati decimali: ${sospetti.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
  // e nessuno degli interi rimasti deve dichiarare la tastiera decimale
  const tastiera = rimasti.filter((t) => /inputmode="(?!numeric)/.test(t));
  ok(tastiera.length === 0,
    `interi con la tastiera sbagliata: ${tastiera.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
});

console.log("\n── Regola 4: un numero che non si capisce non diventa zero ──");
// Cambiare il tipo del campo era metà del lavoro: l'altra metà è chi lo legge.
// Nel core 17 campi decimali passavano da `parseNum0`, che di ciò che non
// capisce fa ZERO — un costo di riparazione a zero, ore di lavoro a zero, litri
// di gasolio a zero. Zero non è «non lo so»: è una misura, ed è sbagliata, e
// finisce dentro somme e medie senza lasciare traccia.
// Adesso quei campi passano da `numDetto` (che lo dice e blocca il salvataggio)
// o da `numDaCampo` (che restituisce null, per i dati facoltativi).
function decimaliLettiConZero(src) {
  const ids = new Set();
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/inputmode="decimal"/.test(t)) continue;
    const id = /id="([^"]*)"/.exec(t);
    // gli id costruiti dentro un template (`id="f-${i}"`) non si possono cercare
    if (id && id[1] && !id[1].includes("$")) ids.add(id[1]);
  }
  const fuori = [];
  for (const id of ids) {
    // `parseNum0($('co-gas').value)` e `parseNum0($('r-d2')?.value)`
    const re = new RegExp("parseNum0\\(\\s*\\$\\(\\s*['\"]" + id.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") + "['\"]\\s*\\)\\??\\.value", "g");
    const n = (src.match(re) || []).length;
    if (n) fuori.push({ id, quante: n });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale si legge con parseNum0`, () => {
    const v = decimaliLettiConZero(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.quante}×)`).join(", ")}: di ciò che non capisce fa zero, e zero è una misura`);
  });
}
test("il controllo si accorge di una lettura rimessa a parseNum0", () => {
  const finto = `<input type="text" inputmode="decimal" id="costo">`;
  ok(decimaliLettiConZero(finto).length === 0, "senza letture non c'è violazione");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo').value);`).length === 1, "la lettura con zero viene trovata");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo')?.value);`).length === 1, "anche con l'accesso prudente");
  ok(decimaliLettiConZero(finto + `x=numDetto('costo','il costo');`).length === 0, "il lettore che parla va bene");
  ok(decimaliLettiConZero(`<input type="number" id="anno">x=parseNum0($('anno').value);`).length === 0,
    "su un campo INTERO parseNum0 non è un difetto: lì lo zero è un numero come un altro");
  // controprova sul file vero: si rimette il difetto e il controllo deve vederlo
  const core = leggi("index.html");
  if (core) {
    ok(decimaliLettiConZero(core).length === 0, "il core parte pulito");
    const rotto = core.replace("</body>", "<script>x=parseNum0($('co-gas').value);</script></body>");
    ok(decimaliLettiConZero(rotto).length === 1, "il difetto iniettato nel core viene trovato");
  }
});

console.log("\n── Regola 7: la provenienza di un rilievo si decide in un posto solo ──");
// Un rilievo di CUMULO è materiale già estratto e NON consuma il volume
// concesso; uno di SCAVO sì. La regola era scritta due volte — in Terra come
// `provenienzaRilievo` e in Conti come `eCumulo`, con un commento che dichiarava
// di essere «la stessa regola di Terra», cioè una divergenza in attesa. Adesso la
// sorgente è `provenienzaDi` in `shared/dw-ponti.js`.
// Perché vale un controllo automatico: se una copia divergesse, il materiale
// tolto anni fa comincerebbe a consumare la concessione (o il contrario) e il
// difetto non si vedrebbe da nessuna parte — nessun errore, nessun test rosso,
// solo un numero sbagliato in un documento che va all'ente.
//
// ⚠️ COSA cerca questa regola, perché la prima versione cercava la cosa
// sbagliata: NON è vietato confrontare con «cumulo» — `provenienzaDi(r) ===
// "cumulo"` è l'uso normale e inevitabile, e la prima versione lo segnalava in
// tre punti legittimi (fra cui `soloCumulo` di Terra). È vietato **ricavare la
// provenienza dal record grezzo**: leggere `.provenienza` e deciderlo in casa,
// che è esattamente com'erano nate le due copie.
const RICAVA = /\.provenienza\b/;
function ricavaProvenienza(src) {
  const vivo = mascheraCodice(src);
  const fuori = [];
  const re = new RegExp(RICAVA.source, "g");
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!vivo[m.index]) continue;                 // in un commento non decide niente
    // legittimo dove si SCRIVE il campo o lo si passa a `provenienzaDi`; sospetto
    // dove nella stessa espressione compare la parola «cumulo»
    const intorno = src.slice(Math.max(0, m.index - 120), m.index + 120);
    if (!/cumulo/i.test(intorno)) continue;
    if (/provenienzaDi\s*\(/.test(intorno)) continue;
    fuori.push({ riga: src.slice(0, m.index).split("\n").length, testo: intorno.replace(/\s+/g, " ").slice(60, 170) });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  if (rel === "shared/dw-ponti.js") continue;     // è la sorgente della regola
  const src = leggi(rel);
  if (src === null) continue;
  const v = ricavaProvenienza(src);
  if (!v.length && !/provenienza/.test(src)) continue;   // il file non c'entra
  test(`${nome}: non ricava la provenienza dal record grezzo`, () => {
    ok(v.length === 0,
      `${rel} — riga ${v.map((x) => x.riga).join(", ")}: la regola vive in shared/dw-ponti.js (provenienzaDi)`);
  });
}
test("il controllo distingue la copia dall'uso normale", () => {
  const copia = 'const eCumulo = (r) => String((r && r.provenienza) || "").toLowerCase() === "cumulo";';
  ok(ricavaProvenienza(copia).length === 1, "una copia che ricava dal record grezzo viene vista");
  ok(ricavaProvenienza('const cum = provenienzaDi(r) === "cumulo";').length === 0,
    "confrontare il risultato della funzione condivisa è l'uso NORMALE, non una violazione");
  ok(ricavaProvenienza('provenienza: provenienzaDi({ provenienza }),').length === 0,
    "e passarle il campo grezzo per farselo normalizzare va bene");
  ok(ricavaProvenienza('// qui si leggeva r.provenienza e si confrontava con "cumulo"').length === 0,
    "la stessa cosa raccontata in un commento non è una violazione");
  ok(ricavaProvenienza('r.provenienza = "scavo";').length === 0,
    "e scrivere il campo non è deciderne il significato");
});

console.log("\n── Regola 6: il ponte con Terra non dà la colpa a chi compila ──");
// Decisione presa PRIMA di scrivere il codice, e messa qui perché è il tipo di
// cosa che si perde riscrivendo un testo: quando la produzione dichiarata dai
// turni non torna col rilievo del drone, Campo NON deve dare la colpa a chi ha
// stimato. Se dicesse «le tue stime erano gonfie», la conseguenza prevedibile è
// che i turni comincino a scrivere numeri prudenti invece di numeri veri, e il
// dato peggiora proprio dove serve. Il testo deve nominare ENTRAMBE le
// spiegazioni possibili, compresa quella che non riguarda i turni.
test("Campo: quando i numeri non tornano, il testo nomina entrambe le spiegazioni", () => {
  const src = leggi("apps/campo/index.html") || "";
  ok(/rap-terra/.test(src), "la sezione del ponte con Terra c'è");
  ok(/stima di turno/.test(src), "il testo nomina la stima di turno come possibile causa");
  ok(/volo che non ha coperto/.test(src),
    "e nomina anche il volo che non copre tutto lo scavo: senza, lo scarto ricade tutto sui turni");
  // ⚠️ Le frasi vietate compaiono di PROPOSITO nei commenti, che spiegano perché
  // sono vietate — la stessa situazione della regola sui dialoghi del browser, e
  // la prima versione di questo controllo è caduta proprio lì, segnalando il
  // commento che documentava la decisione. Si guarda solo il codice VIVO, con lo
  // stesso tokenizzatore.
  // il testo mostrato vive nelle stringhe, quindi si tolgono solo i commenti:
  // `mascheraCodice` maschererebbe proprio il contenuto che qui va guardato
  const testo = senzaCommenti(src);
  const nelVivo = (frase) => new RegExp(frase, "i").test(testo);
  for (const accusa of ["le tue stime", "hai stimato", "gonfiat", "per colpa"]) {
    ok(!nelVivo(accusa), `il testo mostrato non usa «${accusa}»: un rimprovero fa scrivere numeri prudenti, non veri`);
  }
  // il controllo del controllo: la frase iniettata nel codice vivo deve essere vista
  ok(nelVivo("stima di turno"), "e il controllo sa vedere una frase che sta davvero nel testo");
});

console.log("\n── Regola 5: dove ci sono campi interi, la guardia è montata ──");
// I campi decimali sono diventati campi di testo; gli INTERI restano
// `type="number"` di proposito, perché lì lo spinner serve. Ma questo lascia al
// browser l'ultima parola sulla virgola, e misurato in Chromium «1,5» diventa
// «15» con `checkValidity()` che risponde **true**: leggere la validità non
// basta, il numero è già stato distrutto e dichiarato buono. Serve la guardia
// su `beforeinput`, e sta in `shared/` una volta sola.
// Questa regola non prova il MECCANISMO (quello si prova col browser, con tasti
// veri): prova che nessuna superficie con campi interi si dimentichi di
// montarla, che è la cosa che si perde aggiungendo una pagina.
function campiInteri(src) {
  let n = 0;
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    if (st && st[1].includes(".")) continue;
    if (/inputmode="decimal"/.test(t)) continue;
    n++;
  }
  return n;
}
const montaGuardia = (src) => /montaGuardiaInteri\s*\(/.test(src);
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const n = campiInteri(src);
  if (!n) continue;
  test(`${nome}: ${n} campi interi, e la guardia è montata`, () => {
    ok(montaGuardia(src),
      `${rel} ha ${n} campi interi ma non chiama montaGuardiaInteri: su quei campi «1,5» diventa 15 in silenzio`);
  });
}
test("la guardia condivisa esiste e distingue interi da decimali", () => {
  const shell = leggi("shared/deepwork-id-client/dw-shell.js") || "";
  ok(/export function montaGuardiaInteri/.test(shell), "montaGuardiaInteri è esportata da shared/");
  ok(/export function eCampoIntero/.test(shell), "e il riconoscimento del campo intero è a parte, provabile");
  ok(/beforeinput/.test(shell), "si attacca a beforeinput, dove il carattere si può ancora rifiutare");
  // il controllo del controllo: una superficie con campi interi e senza guardia
  // deve fallire
  const finto = '<input type="number" id="fori">';
  ok(campiInteri(finto) === 1 && !montaGuardia(finto), "il difetto iniettato viene visto");
  ok(campiInteri('<input type="number" step="0.1">') === 0, "un decimale non è un campo intero");
  ok(campiInteri('<input type="number" inputmode="decimal">') === 0, "e nemmeno uno dichiarato dall'inputmode");
  ok(campiInteri('<input type="text" inputmode="numeric">') === 0, "un campo di testo non ha bisogno della guardia");
});

console.log("\n── Regola 10: uno stato vuoto con un titolo ha anche una spiegazione ──");
// Trovato aprendo il core per la prima volta in locale: tredici stati vuoti
// mostravano icona e titolo e basta — «Nessun mezzo da lavoro» su uno schermo
// per il resto nero. È la schermata che una cava nuova vede il primo giorno, e
// non diceva né che cosa fare né di chi fosse il compito. Le sei app, che dal
// core hanno copiato tutto, su questo erano più ricche del loro riferimento.
// Non riguarda i segnaposto brevi dentro le schede («Nessun file»), fatti
// apposta di sola spiegazione: si guarda chi ha un TITOLO.
function vuotiSenzaSpiegazione(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  const re = /empty-title/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 500);
    if (!/empty-sub/.test(finestra)) {
      const t = /empty-title[^>]*>([^<]{0,60})/.exec(finestra);
      fuori.push((t && t[1].trim()) || "(titolo dinamico)");
    }
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const muti = vuotiSenzaSpiegazione(src);
  test(`${nome}: ogni stato vuoto con titolo dice anche cosa fare`, () => {
    ok(muti.length === 0,
      `${rel}: ${muti.length} stati vuoti mostrano solo il titolo (${muti.slice(0, 4).join(" · ")}): ` +
      `chi apre l'app il primo giorno non capisce se il vuoto dipende da lui`);
  });
}
test("la regola 10 sa vedere il difetto che è stato tolto", () => {
  const difetto = '<div class="empty-state"><div class="empty-icon">🚜</div>' +
    '<div class="empty-title">Nessun mezzo da lavoro</div></div>';
  const messo = difetto.replace("</div></div>", '</div><div class="empty-sub">Aggiungilo col ＋.</div></div>');
  ok(vuotiSenzaSpiegazione(difetto).length === 1, "lo stato vuoto muto viene visto");
  ok(vuotiSenzaSpiegazione(messo).length === 0, "e quello che spiega no");
  ok(vuotiSenzaSpiegazione('<div class="empty-state"><div class="empty-sub">Nessun file</div></div>').length === 0,
    "il segnaposto breve dentro una scheda non è una violazione");
});

console.log("\n── Regola 9: nessuna superficie si riscrive in casa la regola degli interi ──");
// Trovata dal vero, digitando: in Terra «1.500» diventava «500». Terra aveva la
// sua copia della stessa regola, scritta prima che la guardia vivesse in
// `shared/`, e con un comportamento DIVERSO — oltre a rifiutare il separatore
// svuotava il campo. Montate tutte e due, il «1» spariva e restava «500»: un
// numero plausibile e sbagliato, cioè proprio quello che lo svuotamento voleva
// evitare. La guardia condivisa, da sola, in quel caso dà 1500.
// La regola vincolante del progetto dice che una regola che serve a due app vive
// in `shared/` e non si riscrive; questa la rende verificabile.
// Cosa si cerca: un ascoltatore `beforeinput` che, fuori da `shared/`, guarda i
// separatori decimali. Il testo si prende senza commenti (i commenti PARLANO di
// beforeinput, e non sono codice), non mascherato, perché qui interessa il
// codice vero e le espressioni regolari ci vivono dentro.
function guardieInCasa(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  // FINESTRA A LUNGHEZZA FISSA, non un'espressione regolare che «arriva fino
  // alla parentesi»: la prima versione era `[\s\S]{0,400}?\)`, e il non greedy
  // si fermava alla parentesi di `(e)`, tre caratteri dopo. Guardava un pezzo
  // in cui la virgola non poteva esserci, quindi non trovava niente su nessuna
  // superficie — e i controlli passavano a vuoto. L'ha detto la controprova.
  const re = /addEventListener\(\s*["']beforeinput["']/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 400);
    if (/\[\.,\]|\[,\.\]|\bvirgola\b/.test(finestra)) fuori.push(finestra.slice(0, 90).replace(/\s+/g, " "));
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const suoi = guardieInCasa(src);
  test(`${nome}: la regola degli interi non è riscritta in casa`, () => {
    ok(suoi.length === 0,
      `${rel} intercetta beforeinput sui separatori per conto proprio (${suoi.length}): ` +
      `la regola sta in shared/, e due copie con comportamenti diversi si pestano i piedi — ${suoi[0] || ""}`);
  });
}
test("la regola 9 sa vedere il difetto che è stato tolto", () => {
  // il codice VERO che stava in Terra, rimesso qui dentro: se il controllo non
  // lo vede, non sta guardando dove crede
  const difetto = `el.addEventListener("beforeinput", (e) => {
      if (!e.data || !/[.,]/.test(e.data)) return;
      e.preventDefault(); el.value = ""; });`;
  ok(guardieInCasa(difetto).length === 1, "la copia locale che svuotava il campo viene vista");
  ok(guardieInCasa('// qui una volta c\'era un addEventListener("beforeinput") con la virgola').length === 0,
    "un commento che ne parla non è una violazione");
  ok(guardieInCasa('document.addEventListener("beforeinput", (ev) => { registra(ev); });').length === 0,
    "un beforeinput che non guarda i separatori non c'entra");
});

/* ══════════════════════════════════════════════════════════════════════
   REGOLA 8 · UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE
   ══════════════════════════════════════════════════════════════════════
   `class="note avviso"` in un'app che non ha `.note.avviso` non è un errore per
   nessuno: il browser non protesta, la pagina si apre, e la nota si vede — solo
   che si vede NEUTRA dove il codice diceva «attenzione». Trovato dal vero: la
   regola esisteva in Terra e in Sentinella, e in Campo e Scudo no, quindi tre
   note d'avviso rendevano come note qualunque.
   Si guardano i modificatori della famiglia `note`, che è quella che porta il
   SIGNIFICATO (recap, avviso, esito, err): una classe che dice come leggere il
   testo e non fa niente è peggio di nessuna classe, perché chi scrive crede di
   averlo detto. */
const MODIFICATORI_NOTA = /class="note ([a-z][a-z-]*)"/g;
/* COSA CONTA COME «DEFINITA», imparato sbagliando due volte in una:
   · `.note.esito.err{…}` definisce `esito` quanto `.note.esito{…}` — la prima
     versione cercava solo la parentesi subito dopo e dichiarava orfane 54 note;
   · `.prescr{…}` da sola vale: una classe può portare stile senza passare da
     `.note`, e pretendere il prefisso sarebbe una regola inventata da me;
   · i fogli di `shared/` si leggono TUTTI. Elencarne tre a mano ha nascosto
     `dw-app-ui.css`, che è proprio quello che definisce `.note.esito`.
   È la solita lezione: una prova sbagliata che accusa il codice costa più di
   nessuna prova. */
/* i fogli di shared/ si LEGGONO, non si elencano: scriverne cinque a mano è come
   ho appena nascosto `dw-app-ui.css`, e la volta dopo si nasconderebbe quello nuovo */
const CSS_CONDIVISI = readdirSync(join(root, "shared"))
  .filter((f) => f.endsWith(".css")).map((f) => "shared/" + f);
function classiDefinite(css, dentro) {
  /* SI RACCOLGONO TUTTI I NOMI DI CLASSE che compaiono nel CSS, senza provare a
     capire se sono in posizione di selettore. Ci ho provato tre volte con uno
     sguardo all'indietro e ho sbagliato tre volte — l'ultima su `.note.vera`,
     dove il carattere che precede è una lettera, non un delimitatore.
     Raccogliere in più è il verso GIUSTO in cui sbagliare: al massimo questa
     regola lascia passare un'orfana, mentre raccogliere in meno ACCUSA il codice
     di un difetto che non ha — ed è già costato tre giri qui sopra.
     Si guarda solo dentro il CSS: per un file HTML, i blocchi <style>. */
  for (const m of css.matchAll(/\.(-?[a-z][a-z0-9-]*)/g)) dentro.add(m[1]);
}
function soloCss(src, rel) {
  if (rel.endsWith(".css")) return src;
  return [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
}
function noteSenzaStile(src, rel = "x.html") {
  const definiti = new Set();
  classiDefinite(soloCss(src, rel), definiti);
  for (const f of CSS_CONDIVISI) {
    const css = leggi(f);
    if (css) classiDefinite(css, definiti);
  }
  const usati = new Map();
  for (const m of src.matchAll(MODIFICATORI_NOTA)) {
    if (!definiti.has(m[1])) usati.set(m[1], (usati.get(m[1]) || 0) + 1);
  }
  return [...usati.entries()].map(([cls, n]) => `«note ${cls}» usata ${n} volte e mai definita`);
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const orfane = noteSenzaStile(src, rel);
  test(`${nome}: ogni modificatore di nota ha uno stile`, () => {
    ok(orfane.length === 0,
      `${rel}: ${orfane.join("; ")} — la nota si vede neutra dove il codice diceva altro`);
  });
}
/* ── REGOLA 11: il simbolo dell'euro non si riscrive in casa ─────────────── */
function euroInCasa(src) {
  const fuori = [];
  /* si guarda il CODICE senza commenti: un «€» dentro una spiegazione è
     legittimo, e anche un'etichetta come «Importo €» o l'unità «€/t». Quello
     che si cerca è il simbolo INCOLLATO A UN'ESPRESSIONE — cioè un pezzo di
     formattazione — che è il gesto da cui sono nate le tre forme diverse. */
  const codice = senzaCommenti(src);
  const re = /"\u20AC[\u0020\u00A0]?"\s*\+|\+\s*"\u20AC[\u0020\u00A0]?"/g;
  let m;
  while ((m = re.exec(codice)) !== null) {
    /* ⚠️ LA RIGA SI CERCA NEL SORGENTE VERO, non in quello ripulito. `senzaCommenti`
       toglie righe e quindi sposta la numerazione: la prima versione di questa
       regola indicava la riga 1202 di Conti, dove non c'era niente, mentre il
       difetto stava alla 1259. Un controllo che punta il dito nel posto sbagliato
       fa perdere più tempo di uno che non c'è. */
    const quantesime = codice.slice(0, m.index).split(m[0]).length;
    let pos = -1;
    for (let k = 0; k < quantesime; k++) pos = src.indexOf(m[0], pos + 1);
    const riga = pos < 0 ? "?" : src.slice(0, pos).split("\n").length;
    fuori.push(`riga ${riga}: ${m[0].trim()} — il simbolo si mette con conEuro() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  /* dw-shell è il posto dove la regola VIVE: lì il simbolo ci deve stare */
  if (rel.includes("dw-shell")) continue;
  const casi = euroInCasa(src);
  test(`${nome}: non si scrive in casa il simbolo dell'euro`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 11 sa vedere il difetto che è stato tolto", () => {
  /* le tre forme vere, com'erano scritte nelle tre app prima del 30/07 */
  ok(euroInCasa('const eur = (v) => "\u20AC\u00A0" + NUM2.format(v);').length === 1,
    "la forma di Conti");
  ok(euroInCasa('const eur = (n) => "\u20AC\u0020" + Math.round(n);').length === 1,
    "quella di Terra");
  ok(euroInCasa('return "\u20AC" + n.toLocaleString("it-IT");').length === 1,
    "e quella di Flotta, attaccata");
  ok(euroInCasa('const eur = euro; // \u20AC 48.200,00').length === 0,
    "un commento che mostra il risultato non è una violazione");
  ok(euroInCasa('<label>Importo \u20AC</label>').length === 0,
    "e nemmeno un'etichetta che chiede un importo");
  ok(euroInCasa('{ unita: "\u20AC/t" }').length === 0,
    "né l'unità di misura di un prezzo");
});

test("il controllo delle note sa fallire", () => {
  /* la controprova: una classe inventata dentro una sorgente che non la definisce
     deve essere segnalata, e una definita no */
  ok(noteSenzaStile('<style></style><div class="note inventata">x</div>').length === 1,
    "una classe mai definita viene vista");
  ok(noteSenzaStile('<style>.note.vera{color:red}</style><div class="note vera">x</div>').length === 0,
    "una definita nello stesso file non viene segnalata");
  ok(noteSenzaStile('<style>.note.vera.rossa{color:red}</style><div class="note vera">x</div>').length === 0,
    "e una definita solo in una variante — `.note.vera.rossa` — conta come definita");
  ok(noteSenzaStile('<style>.vera{white-space:pre-wrap}</style><div class="note vera">x</div>').length === 0,
    "e una classe che porta stile per conto suo, senza il prefisso `.note`");
  ok(noteSenzaStile('<style></style><div class="note">x</div>').length === 0,
    "una nota senza modificatore non ha niente da definire");
  /* la controprova del difetto appena tolto: dentro un elenco separato da virgole
     ogni classe conta, anche quelle dopo la prima */
  ok(noteSenzaStile('<style>.top,.nav,.vera,.altro{display:none}</style><div class="note vera">x</div>').length === 0,
    "in un elenco di selettori conta anche una classe che non è la prima");
  /* e una classe scritta SOLO nel markup, mai nel foglio, resta orfana anche se
     la parola compare altrove nel documento: si guarda dentro <style>, non nel testo */
  /* la parola dev'essere INVENTATA: qui c'era «avviso», che il 30/07 è diventata
     una regola di stato vera in `shared/dw-app-ui.css` — e la controprova, che
     legge anche i fogli condivisi, ha smesso di fallire. Una controprova che
     dipende da una parola del prodotto scade quando il prodotto cresce. */
  ok(noteSenzaStile('<style>.altro{color:red}</style><p>fandonia</p><div class="note fandonia">x</div>').length === 1,
    "la parola nel testo non vale come definizione: conta solo il foglio di stile");
});


/* ── REGOLA 12: chi salta i doppioni li cerca anche DENTRO il file ─────────
   Misurato il 31/07: dieci gestori d'importazione su dieci confrontavano ogni
   riga solo con l'elenco caricato all'apertura della pagina — e quell'elenco
   non si aggiorna mentre il file scorre. Due righe uguali nello stesso file
   entravano tutte e due, in tutte e sei le app.

   Non è un caso di scuola: l'export di Scudo scrive una riga per ogni
   scadenza, quindi il file di un lavoratore con tre scadenze lo nomina tre
   volte, e ri-caricarlo faceva comparire tre volte la stessa persona.

   La regola guarda SOLO i gestori che il doppione lo saltano davvero (quelli
   che contano `dup++` o `saltat*++` accanto a un `.some(`): dove i doppioni
   sono leciti — più letture dello stesso sensore, più rapportini nello stesso
   turno — non si pretende niente. E la difesa vale anche se sta nella funzione
   di lettura invece che nel gestore: è il caso dell'anagrafica di Scudo, dove
   `parseLavoratoriCsv` chiama la regola condivisa. Quello che non deve
   succedere è che non ci sia da nessuna parte delle due. */
function corpiImportazione(src) {
  const righe = src.split("\n");
  const fuori = [];
  for (let i = 0; i < righe.length; i++) {
    const m = /\$\("([\w-]*file)"\)\.onchange/.exec(righe[i]);
    if (!m) continue;
    const corpo = [];
    for (let k = i; k < Math.min(i + 45, righe.length); k++) {
      corpo.push(righe[k]);
      if (righe[k] === "  };") break;
    }
    fuori.push({ id: m[1], riga: i + 1, testo: corpo.join("\n") });
  }
  return fuori;
}
function dedupSoloInArchivio(src, modulo) {
  const fuori = [];
  for (const h of corpiImportazione(src)) {
    /* ⚠️ LE FORME SONO DUE, e la prima scrittura di questa regola ne guardava
       una sola. Quattro gestori — il registro infortuni e lo scadenzario di
       Scudo, il registro volate di Sentinella, i rilievi di Terra — il
       doppione lo saltano con un `Set` e una firma composta, non con `.some(`,
       e lo facevano BENE già prima del 31/07: la firma la aggiungono DENTRO il
       ciclo, che è esattamente la protezione che mancava agli altri dieci.
       Guardando solo `.some(` questa regola li avrebbe ignorati, e il giorno in
       cui a uno di loro sparisse l'`add` dal ciclo non se ne accorgerebbe
       nessuno. Lo stesso filtro sbagliato aveva già fatto sbagliare il
       censimento, che li aveva contati fra quelli «senza controllo». */
    /* ⚠️ L'`add` deve stare sulla STESSA variabile dell'`has`. La prima
       stesura si accontentava di `\w+\.add\(`, che è soddisfatto anche da
       `classList.add(` — cosa che in un gestore ci sta benissimo: la regola
       avrebbe visto «c'è un add» e non avrebbe più controllato se la firma
       finisce davvero nel Set. Misurato il 01/08: tutti e sette i gestori col
       Set aggiungono sulla variabile giusta, quindi il buco era **latente**.
       Si chiude lo stesso: è il filtro-che-non-guarda-dove-crede, e a questa
       regola quel difetto è già costato una svista. */
    const setUsati = [...new Set([...h.testo.matchAll(/(\w+)\.has\(/g)].map((m) => m[1]))];
    const conSet = setUsati.length > 0 && /(dup|saltat\w*)\+\+/.test(h.testo);
    if (conSet) {
      const aggiunge = setUsati.some((v) => new RegExp("\\b" + v + "\\.add\\(").test(h.testo));
      if (!aggiunge)
        fuori.push(`riga ${h.riga}: «${h.id}» tiene la firma in un Set ma non la aggiunge dentro il ciclo — i doppioni dentro il file passano`);
      continue;
    }
    const salta = /\.some\(/.test(h.testo) && /(dup|saltat\w*)\+\+/.test(h.testo);
    if (!salta) continue;                              // qui i doppioni sono leciti
    if (/senzaDoppioni\(/.test(h.testo)) continue;     // difesa nel gestore
    /* difesa nella funzione di lettura: si guarda IL CORPO di quella funzione,
       non tutto il modulo — «da qualche parte nel file» lascerebbe passare un
       lettore che non la chiama solo perché un altro la chiama. */
    const usata = /(parse\w*Csv)\s*\(/.exec(h.testo);
    if (usata && modulo) {
      const inizio = modulo.indexOf(`export function ${usata[1]}(`);
      if (inizio >= 0) {
        const dopo = modulo.indexOf("\nexport ", inizio + 1);
        const corpoFn = modulo.slice(inizio, dopo < 0 ? modulo.length : dopo);
        if (/senzaDoppioni\(/.test(corpoFn)) continue;
      }
    }
    fuori.push(`riga ${h.riga}: «${h.id}» salta i doppioni ma solo contro l'archivio — manca senzaDoppioni() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  if (!/^apps\/(campo|conti|flotta|scudo|sentinella|terra)\/index\.html$/.test(rel)) continue;
  const src = leggi(rel);
  if (src === null) continue;
  const app = rel.split("/")[1];
  const modulo = leggi(`apps/${app}/${app}-data.js`);
  const casi = dedupSoloInArchivio(src, modulo);
  test(`${nome}: chi salta i doppioni li cerca anche dentro il file`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 12 sa vedere il difetto che è stato tolto", () => {
  /* Il gestore com'era davvero prima del 31/07, in tutte e sei le app. */
  const difetto = [
    '  $("squ-file").onchange = async (e) => {',
    '    const righe = parseSquadreCsv(await file.text());',
    '    let agg = 0, dup = 0;',
    '    for (const r of righe) {',
    '      if (SQU.some(q => q.nome === r.nome)) { dup++; continue; }',
    '      agg++;',
    '    }',
    '  };',
  ].join("\n");
  ok(dedupSoloInArchivio(difetto, null).length === 1, "il gestore di prima è una violazione");
  const corretto = difetto.replace(
    "const righe = parseSquadreCsv(await file.text());",
    "const righe = senzaDoppioni(parseSquadreCsv(await file.text()), x => x.nome);");
  ok(dedupSoloInArchivio(corretto, null).length === 0, "con la difesa nel gestore, no");
  const conModulo = "export function parseSquadreCsv(t) {\n  return senzaDoppioni(righe, x => x.nome);\n}\n";
  ok(dedupSoloInArchivio(difetto, conModulo).length === 0, "e nemmeno con la difesa dentro il lettore");
  /* la difesa dentro un ALTRO lettore non vale */
  const altroLettore = "export function parseAltroCsv(t) {\n  return senzaDoppioni(r, x => x.n);\n}\nexport function parseSquadreCsv(t) {\n  return r;\n}\n";
  ok(dedupSoloInArchivio(difetto, altroLettore).length === 1, "la difesa di un altro lettore non copre questo");
  /* un gestore che i doppioni li accetta di proposito non viene toccato */
  const lecito = '  $("mis-file").onchange = async (e) => {\n    const righe = parseLettureCsv(t);\n    for (const r of righe) await db.aggiungi("letture", r);\n  };';
  ok(dedupSoloInArchivio(lecito, null).length === 0, "dove i doppioni sono leciti non si pretende niente");
});
test("la regola 12 vede anche la forma col Set, non solo quella con .some()", () => {
  /* La forma vera dei quattro gestori che facevano già la cosa giusta. */
  const conSet = [
    '  $("inf-file").onchange = async (e) => {',
    '    const righe = parseInfortuniCsv(await file.text());',
    '    const gia = new Set(INF.map(firma));',
    '    let agg = 0, dup = 0;',
    '    for (const r of righe) {',
    '      if (gia.has(firma(r))) { dup++; continue; }',
    '      gia.add(firma(r));',
    '      agg++;',
    '    }',
    '  };',
  ].join("\n");
  ok(dedupSoloInArchivio(conSet, null).length === 0, "col Set aggiornato dentro il ciclo va bene");
  /* e adesso il difetto: la stessa forma, senza l'add. È il modo più facile di
     rompere quei quattro senza che nessuno se ne accorga — una riga tolta. */
  const senzaAdd = conSet.replace("      gia.add(firma(r));\n", "");
  ok(dedupSoloInArchivio(senzaAdd, null).length === 1, "senza l'add dentro il ciclo, è una violazione");
  /* l'add su un'ALTRA variabile non è la difesa: `classList.add(` non mette
     nessuna firma nel Set, ma ha la stessa forma */
  const addEstraneo = conSet.replace("      gia.add(firma(r));", "      riga.classList.add('nuova');");
  ok(dedupSoloInArchivio(addEstraneo, null).length === 1,
    "un add su una variabile diversa da quella del has non conta come difesa");
});

/* LA CONTROPROVA SUI FILE VERI, PER LA REGOLA 12.
   ────────────────────────────────────────────────────────────────────────
   Qui il difetto non si AGGIUNGE, si TOGLIE: quello che la regola deve vedere
   è l'assenza di una difesa. Si spegne la difesa nelle due forme in cui è
   scritta — `senzaDoppioni` di `shared/` e il `Set` aggiornato dentro il
   ciclo — e si pretende che le violazioni **aumentino** in ogni app.

   Perché proprio questa regola merita la controprova vera: il suo filtro è
   già caduto una volta, il 31/07. Cercava la forma `.some(` e non vedeva i
   gestori scritti col `Set` — cioè proprio quelli che facevano la cosa
   giusta. Una controprova sintetica non l'avrebbe mai detto: sull'esempio
   inventato la funzione andava benissimo. */
{
  const APP12 = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
  let superfici = 0, ciecheDoppioni = 0, ciecheSet = 0, conSetVere = 0;
  const dove = [];
  for (const app of APP12) {
    const src = leggi(`apps/${app}/index.html`);
    const modulo = leggi(`apps/${app}/${app}-data.js`) || "";
    if (src === null) continue;
    superfici++;
    const base = dedupSoloInArchivio(src, modulo).length;
    // forma 1: si spegne senzaDoppioni() ovunque, pagina e modulo
    const spentaA = dedupSoloInArchivio(
      src.replace(/senzaDoppioni\(/g, "passaTutto("), modulo.replace(/senzaDoppioni\(/g, "passaTutto("));
    if (spentaA.length <= base) { ciecheDoppioni++; if (!dove.includes(app)) dove.push(app); }
    /* forma 2: si toglie l'add al Set — ma solo dove un gestore d'importazione
       la difesa col Set ce l'ha davvero. ⚠️ La prima stesura chiedeva
       `.has(` in TUTTA la pagina: Campo, Conti e Flotta ce l'hanno altrove e
       non hanno nessun importatore col Set, quindi la controprova pretendeva
       una violazione che non poteva esistere e li accusava. Il riconoscimento
       è quello della regola stessa, non un'approssimazione. */
    const conSet = corpiImportazione(src).some((h) =>
      /(\w+)\.has\(/.test(h.testo) && /(dup|saltat\w*)\+\+/.test(h.testo));
    if (conSet) {
      conSetVere++;
      const spentaB = dedupSoloInArchivio(src.replace(/(\w+)\.add\(/g, "$1.nonAggiunge("), modulo);
      if (spentaB.length <= base) { ciecheSet++; if (!dove.includes(app)) dove.push(app); }
    }
  }
  test(`regola 12: spenta la difesa nei file veri, la regola se ne accorge (${superfici} app)`, () => {
    ok(superfici === 6, `misurate ${superfici} app invece di 6`);
    ok(ciecheDoppioni === 0, `in ${dove.join(", ")} togliere senzaDoppioni() non ha prodotto nessuna violazione nuova`);
    ok(ciecheSet === 0, `in ${dove.join(", ")} togliere l'add al Set non ha prodotto nessuna violazione nuova`);
    ok(conSetVere === 3, `le app con un importatore che si difende col Set sono ${conSetVere}, me ne aspettavo 3 (Scudo, Sentinella, Terra)`);
    console.log(`     (6 app con senzaDoppioni spento, ${conSetVere} con la difesa col Set spenta)`);
  });
}



/* ── REGOLA 13: due esportazioni non scaricano lo stesso nome di file ──────
   Trovato per caso il 31/07 in Conti: due bottoni scaricavano tutti e due
   `conti_listino.csv`, ma uno era il LISTINO ri-caricabile e l'altro un
   prospetto coi prezzi già convertiti. Nella cartella dei download il
   secondo copre il primo — o peggio lo affianca come «conti_listino (1).csv»
   — e nessuno dei due dice quale sia quale. Chi poi prova a ri-caricare il
   file sbagliato si sente rispondere che non è valido, e conclude che è
   l'app a non funzionare.

   Il difetto non fa rumore: il file si scarica benissimo. E non lo trova
   nessuna prova sul comportamento, perché ogni export, preso da solo,
   funziona.

   ⚠️ Copre i nomi scritti come testo (`.download = "…"`). Un nome costruito a
   pezzi — con una data dentro, per esempio — qui non si vede: quando ne
   nascerà uno, la regola va allargata invece di essere aggirata. */
function nomiScaricatiRipetuti(src) {
  const conta = new Map();
  const re = /\.download = "([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const riga = src.slice(0, m.index).split("\n").length;
    const v = conta.get(m[1]) || [];
    v.push(riga);
    conta.set(m[1], v);
  }
  return [...conta].filter(([, righe]) => righe.length > 1)
    .map(([nome, righe]) => `«${nome}» scaricato da ${righe.length} esportazioni diverse (righe ${righe.join(", ")})`);
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const casi = nomiScaricatiRipetuti(src);
  test(`${nome}: due esportazioni non scaricano lo stesso file`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 13 sa vedere il difetto che è stato tolto", () => {
  /* il caso vero di Conti, com'era prima della correzione */
  const difetto = 'a.download = "conti_listino.csv"; a.click();\n'
    + 'let csv = "nome;unita";\n'
    + 'a.download = "conti_listino.csv"; a.click();';
  ok(nomiScaricatiRipetuti(difetto).length === 1, "due export con lo stesso nome sono una violazione");
  ok(/righe 1, 3/.test(nomiScaricatiRipetuti(difetto)[0]), "e dice DOVE stanno tutte e due");
  const corretto = difetto.replace(/conti_listino\.csv"; a\.click\(\);$/, 'conti_listino_prezzi.csv"; a.click();');
  ok(nomiScaricatiRipetuti(corretto).length === 0, "con due nomi diversi, no");
  ok(nomiScaricatiRipetuti('a.download = "uno.csv";').length === 0, "una sola esportazione non è mai un doppione");
});

/* REGOLA 14 — LA NOTA DEL MODO NON È UNA LAVAGNA.
   ────────────────────────────────────────────────────────────────────────
   `mode-note` dice, per tutto il tempo che la pagina resta aperta, se si sta
   lavorando sui **dati veri dell'organizzazione**. Il 31/07 tre app ci
   scrivevano sopra l'esito delle esportazioni — nove punti in tutto: dal
   primo export in poi quella conferma non torna più. Un elemento solo con due
   mestieri, e ogni scrittura cancella l'altra.

   ⚠️ ONESTÀ SULLA GRAVITÀ, perché la prima lettura di questo difetto — la mia
   — era sbagliata in peggio. Avevo scritto che spariva l'avviso «stai
   guardando dati di esempio, nulla viene salvato». NON è così: quell'avviso è
   `tour-banner`, sta in cima, vive FUORI dalle pagine (quindi si vede da
   tutte) e nessuno lo tocca. Quello che sparisce è la conferma del modo
   **live**, che vale meno. La regola resta — un messaggio che ne cancella un
   altro è un difetto comunque — ma non va raccontata più grossa di quello che
   è. Chi legge un test si fida della ragione scritta accanto.

   La riga che INSTALLA la nota non è una violazione: è il suo scopo. Si
   riconosce perché è l'unica che LEGGE il modo — `db.mode` nelle sei app,
   `live()` nell'amministrazione, che un `db` non ce l'ha.

   ⚠️ La prima stesura guardava solo `db.mode` e aspettava sei superfici:
   l'amministrazione, che ne ha un settimo avviso installato in modo diverso,
   veniva accusata della propria installazione. L'ha fatto vedere il conto
   delle superfici guardate, non le violazioni — che infatti dicevano «una». */
function avvisoUsatoComeLavagna(src) {
  if (!/id="mode-note"/.test(src)) return [];   // superficie senza avviso: niente da dire
  const fuori = [];
  src.split("\n").forEach((riga, i) => {
    /* ⚠️ La prima stesura cercava solo `esito("mode-note"` e la scrittura
       diretta. In Campo l'id arrivava alla nota passando per `sbaglia(...)`,
       `bloccato(...)` e `clearErr(...)`: SETTE scritture indirette che la
       regola non vedeva, ed erano proprio quelle dei messaggi d'errore del
       form. Adesso guarda l'id ovunque compaia nel codice — l'unico posto
       dove `mode-note` ha diritto di stare è la riga che lo installa. */
    if (!/["']mode-note["']/.test(riga)) return;
    if (/<[^>]*\bid=["']mode-note["']/.test(riga)) return;   // è la dichiarazione del riquadro
    if (/\bdb\.mode\b|\blive\(\)/.test(riga)) return;   // è l'installazione dell'avviso
    fuori.push(`riga ${i + 1}: ${riga.trim().slice(0, 90)}`);
  });
  return fuori;
}
let conAvviso = 0;
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null || !/id="mode-note"/.test(src)) continue;
  conAvviso++;
  const casi = avvisoUsatoComeLavagna(src);
  test(`${nome}: la nota del modo non viene usata come lavagna`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} scritture lo cancellano → ${casi.join(" · ")}`);
  });
}
/* Quante superfici ha guardato davvero: un «zero violazioni» ottenuto non
   guardando nessuno è il difetto raccolto tre volte in CLAUDE.md. */
test("la regola 14 ha davvero guardato le superfici con la nota del modo", () => {
  ok(conAvviso === 7, `la nota del modo esiste in ${conAvviso} superfici, me ne aspettavo 7 (le sei app + l'amministrazione)`);
});
test("la regola 14 sa vedere il difetto che è stato tolto", () => {
  const base = '<div class="note" id="mode-note"></div>\n'
    + '$("mode-note").textContent = db.mode === "live" ? "Dati reali." : "Dati di esempio.";\n';
  ok(avvisoUsatoComeLavagna(base).length === 0, "la sola installazione non è una violazione");
  ok(avvisoUsatoComeLavagna(base + 'esito("mode-note", "Esportate 3 fatture.", "success");').length === 1,
    "un esito scritto sull'avviso è una violazione");
  ok(avvisoUsatoComeLavagna(base + '$("mode-note").textContent = "Esportati 3 incassi.";').length === 1,
    "e anche la scrittura diretta, che è il modo in cui il difetto si ripresenta");
  ok(avvisoUsatoComeLavagna('esito("mode-note", "x", "err");').length === 0,
    "una superficie senza avviso non ha niente da cancellare");
});

/* ══ REGOLA 15 · IL GIORNO DI CALENDARIO NON SI PRENDE IN UTC ═══════════
   `toISOString()` scrive sempre l'istante in **UTC**. Una data costruita in ora
   locale — `new Date()`, `new Date(anno, mese, 1)` — in Italia sta una o due
   ore avanti: mezzanotte del 1° maggio a Roma è ancora **le 22:00 del 30
   aprile** a Greenwich. Prenderne il giorno (o il mese, o l'ora) con
   `toISOString().slice(...)` sposta quindi il calendario.

   Misurato il 31/07 e costato tre cose vere (docs/RICERCA_GIORNO_LOCALE_202607.md):
   il grafico «ultimi 6 mesi» del core riempiva la barra scritta «mag» con la
   produzione di **aprile** — sempre, tutto l'anno, perché la chiave era UTC e
   l'etichetta locale; le scadenze delle fatture di Conti cadevano **un giorno
   prima**; e fra mezzanotte e le due — cioè durante il turno di notte — un
   rapportino veniva datato al giorno prima.

   ⚠️ NON tutti i `toISOString()` sono sbagliati, e una sostituzione in blocco
   avrebbe introdotto il difetto che si voleva togliere: `piuGiorni` di
   Sentinella e i due intervalli in `dw-ponti.js` costruiscono la data con
   `"T00:00:00Z"` e la spostano con `setUTCDate` — entrano in UTC ed escono in
   UTC, e sono coerenti. La regola quindi perdona la riga che porta un segno
   esplicito di UTC nelle vicinanze, e accusa solo chi mescola i due calendari. */
const SEGNO_UTC = /T00:00:00Z|Date\.UTC|setUTC|getUTC/;
function giornoInUtc(src) {
  const righe = src.split("\n");
  const fuori = [];
  righe.forEach((riga, i) => {
    // interessa solo chi ne PRENDE UN PEZZO: `toISOString()` intero (per un
    // campo tecnico o un log) non parla di calendario
    if (!/\.toISOString\(\)\s*\.slice\(/.test(riga)) return;
    if (/^\s*(\/\/|\*|\/\*)/.test(riga)) return;               // è un commento che lo spiega
    // il segno di UTC può stare sulla riga o nelle tre sopra, dove la data
    // viene costruita (`const g = new Date(x + "T00:00:00Z");`)
    const intorno = righe.slice(Math.max(0, i - 3), i + 1).join("\n");
    if (SEGNO_UTC.test(intorno)) return;
    fuori.push(`riga ${i + 1}: ${riga.trim().slice(0, 90)}`);
  });
  return fuori;
}
let guardateData = 0;
for (const [nome, rel] of [...SUPERFICI, ...MODULI]) {
  const src = leggi(rel);
  if (src === null || !/\.js$|\.html$/.test(rel)) continue;
  guardateData++;
  const casi = giornoInUtc(src);
  test(`${nome}: il giorno di calendario non viene preso in UTC`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} punti → ${casi.join(" · ")}`);
  });
}
/* Quanti file ha guardato davvero: un «zero violazioni» ottenuto non guardando
   nessuno è il difetto raccolto tre volte in CLAUDE.md. */
test("la regola 15 ha davvero guardato tutte le superfici e i moduli", () => {
  ok(guardateData === SUPERFICI.length + MODULI.length - 1,
     `guardati ${guardateData}, me ne aspettavo ${SUPERFICI.length + MODULI.length - 1} (tutti tranne il CSS del motore grafici)`);
});
test("la regola 15 distingue il giorno locale da quello UTC", () => {
  ok(giornoInUtc('const oggi = new Date().toISOString().slice(0, 10);').length === 1,
     "il giorno preso in UTC da una data locale è una violazione");
  ok(giornoInUtc('const mese = d.toISOString().slice(0, 7);').length === 1,
     "e anche il mese, che è la forma che spostava le barre del grafico");
  ok(giornoInUtc('const g = new Date(x + "T00:00:00Z");\ng.setUTCDate(g.getUTCDate() + 1);\nconst dal = g.toISOString().slice(0, 10);').length === 0,
     "una data costruita e spostata in UTC invece è coerente: non si tocca");
  ok(giornoInUtc('const ts = new Date().toISOString();').length === 0,
     "e un timbro tecnico intero non parla di calendario");
  ok(giornoInUtc('// prima qui c\'era new Date().toISOString().slice(0,10), che sbagliava').length === 0,
     "il commento che racconta il difetto non è il difetto");
});

/* ══ 16. DENTRO UN MODULO, LE MIGLIAIA SI RAGGRUPPANO PER SCRITTO ══════════
   Misurato il 02/08 affiancando i due motori: sui numeri di QUATTRO cifre
   Chromium scrive «6.375» e Node «6375» (strategia `min2`, che raggruppa solo
   da cinque cifre in su). Da cinque cifre in poi sono d'accordo.
   Le PAGINE non hanno questo problema: girano solo nel browser e sono coerenti
   fra loro. I MODULI sì: li importano tutt'e due — la pagina nel browser e le
   prove in Node — e una funzione che non fissa il raggruppamento restituisce
   due stringhe diverse a seconda di dove gira. Da lì una prova che passa in
   Node e fallirebbe nel browser, cioè che blinda una verità che l'utente non
   vede mai. È già successo: la prova sulla frase del tagliando affermava
   «6375 ore» mentre all'utente quella frase dice «6.375».
   `useGrouping: false` va benissimo: è una scelta scritta (e in `perCampo` è
   quella giusta — un punto delle migliaia dentro un campo rientrerebbe come
   numero ambiguo). Quello che non va bene è NON dirlo.
   docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md
   ─────────────────────────────────────────────────────────────────────── */
function migliaiaMute(src) {
  const fuori = [];
  const righe = senzaCommenti(src).split("\n");
  righe.forEach((riga, i) => {
    if (!/toLocaleString\(\s*["']it-IT["']/.test(riga)) return;
    /* la chiamata può continuare sulla riga dopo (l'oggetto delle opzioni
       scritto a capo): si guarda la riga e le due successive */
    const intorno = righe.slice(i, i + 3).join("\n");
    if (/useGrouping/.test(intorno)) return;
    fuori.push(`riga ${i + 1}`);
  });
  return fuori;
}
let guardatiMigliaia = 0;
for (const [nome, rel] of MODULI) {
  const src = leggi(rel);
  if (src === null || !/\.js$/.test(rel)) continue;
  guardatiMigliaia++;
  const casi = migliaiaMute(src);
  test(`${nome}: il raggruppamento delle migliaia è scritto, non lasciato al motore`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} punti → ${casi.join(" · ")}`);
  });
}
test("la regola 16 ha davvero guardato tutti i moduli", () => {
  const attesi = MODULI.filter(([, r]) => /\.js$/.test(r)).length;
  ok(guardatiMigliaia === attesi, `guardati ${guardatiMigliaia}, me ne aspettavo ${attesi}`);
});
test("la regola 16 distingue il raggruppamento scritto da quello taciuto", () => {
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { maximumFractionDigits: 2 });').length === 1,
     "senza useGrouping è una violazione");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { useGrouping: true });').length === 0,
     "scritto true va bene");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { useGrouping: false });').length === 0,
     "e scritto false anche: è una scelta, purché sia scritta");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", {\n  maximumFractionDigits: 2,\n  useGrouping: true,\n});').length === 0,
     "l'oggetto delle opzioni scritto a capo si legge lo stesso");
  ok(migliaiaMute('// prima qui c\'era toLocaleString("it-IT") senza useGrouping').length === 0,
     "il commento che racconta il difetto non è il difetto");
});

console.log("\n── Regola 17: la struttura del core non si riscrive in casa ──");
/* LA STRUTTURA DEL CORE NON SI RISCRIVE IN CASA.
   Il 02/08 il toast, la modale, la conferma, la richiesta di un valore e la
   chiusura con Escape erano scritti SEI VOLTE, una per app: 27 copie, il 76%
   delle righe identico carattere per carattere. E una si era già staccata —
   `apriModale` di Scudo aveva un quarto parametro che le altre cinque non
   avevano, per una ragione buona. Adesso stanno in `shared/dw-app-ui.js`.

   Questa regola serve a che non tornino. Guarda due cose opposte, e la
   seconda è quella che ho già sbagliato una volta:
   (a) chi CARICA il file condiviso non deve ridefinirle — una copia locale
       vince sul globale e la superficie torna a divergere in silenzio;
   (b) chi le USA deve averle da qualche parte — o dal file condiviso, o da
       una copia propria dichiarata. Togliere le funzioni e dimenticare il
       `<script>` non dà nessun errore di sintassi: la pagina si apre, e il
       primo tocco che apre una modale muore con un ReferenceError.

   L'elenco `COPIA_PROPRIA` non è un permesso: è il conto di quanto lavoro
   resta, e deve accorciarsi. Se una superficie ne esce (è passata al
   condiviso) il controllo lo dice; se ne entra una nuova, fallisce. */
/* `go` è entrato il 03/08, il giorno dopo le altre cinque: era la SECONDA metà
   della struttura, sei copie in due versioni — cinque senza guardie e Flotta
   con guardie e mappa. Nella versione condivisa ci sono le guardie per tutti e
   la mappa come parametro. */
const UI_CONDIVISA = ["go", "toast", "apriModale", "chiudiModale", "chiedi", "chiediValore"];
const RE_UI_DEF = new RegExp(
  `\\b(?:function\\s+(?:${UI_CONDIVISA.join("|")})\\s*\\(`
  + `|(?:const|let|var)\\s+(?:${UI_CONDIVISA.join("|")})\\s*=\\s*(?:function\\b|\\(|async\\b))`, "g");
const RE_UI_USO = new RegExp(`\\b(?:${UI_CONDIVISA.join("|")})\\s*\\(`, "g");

function strutturaInCasa(src) {
  const vivo = mascheraCodice(src);   // `function toast(` dentro un modello di stampa non è una definizione
  const fuori = [];
  let m;
  RE_UI_DEF.lastIndex = 0;
  while ((m = RE_UI_DEF.exec(src)) !== null) {
    if (!vivo[m.index]) continue;
    const riga = src.slice(0, m.index).split("\n").length;
    fuori.push(`riga ${riga}: ${m[0].trim()}`);
  }
  return fuori;
}
function usaLaStruttura(src) {
  const vivo = mascheraCodice(src);
  let m;
  RE_UI_USO.lastIndex = 0;
  while ((m = RE_UI_USO.exec(src)) !== null) {
    if (!vivo[m.index]) continue;
    const prima = src.slice(Math.max(0, m.index - 3), m.index);
    if (/[.\w$]$/.test(prima)) continue;           // metodo di un oggetto, o nome più lungo
    return true;
  }
  return false;
}

/* Chi tiene ancora la sua copia, e perché. Misurato il 03/08. */
const COPIA_PROPRIA = {
  "index.html":
    "il core È l'originale — il file condiviso è stato estratto da qui — e il suo "
    + "toast dura di più quando è acceso il modo «all'aperto» (DB.settings.outdoor)",
  "apps/genesi/genesi.html":
    "DA FARE, ma non è il caso facile: Genesi chiama la modale con altri id "
    + "(mdl, mdl-foot, mdl-campo) e il suo `chiediValore` ha un TERZO parametro "
    + "diverso — un VALORE invece dell'HTML del campo, e il campo se lo costruisce "
    + "da sé. Passare al condiviso vuol dire rinominare gli id nel markup e "
    + "riscrivere 62 chiamate, non solo togliere tre funzioni",
};

let uiGuardate = 0, uiCondivise = 0;
const uiConCopia = [];
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  uiGuardate++;
  /* ⚠️ Il caricamento si riconosce dal TAG, non dalla stringa: cercando
     `dw-app-ui.js` ovunque, un COMMENTO che la nomina bastava a far dire alla
     regola «questa pagina la carica». È successo il 03/08 sull'amministrazione
     di Deepwork ID: il commento c'era, il `<script>` no, e la regola diceva
     sette superfici quando erano sei. Il conto che sta lì apposta l'ha detto —
     ma diceva un numero TROPPO ALTO, cioè nella direzione che rassicura. */
  const carica = /<script[^>]+src=["'][^"']*dw-app-ui\.js["']/.test(src);
  const proprie = strutturaInCasa(src);
  if (carica) uiCondivise++;
  if (proprie.length) uiConCopia.push(rel);

  if (carica) {
    test(`${nome}: usa la struttura condivisa e non se la riscrive in casa`, () => {
      ok(proprie.length === 0,
        `${rel}: ${proprie.length} definizioni locali vincono sul file condiviso → ${proprie.join(" · ")}`);
    });
  } else if (usaLaStruttura(src)) {
    test(`${nome}: le funzioni che chiama esistono davvero`, () => {
      ok(proprie.length > 0,
        `${rel}: chiama toast/apriModale/… ma non carica dw-app-ui.js e non le definisce — `
        + "la pagina si apre e muore al primo tocco, senza errori di sintassi");
      ok(rel in COPIA_PROPRIA,
        `${rel} tiene una copia propria della struttura senza una ragione scritta: `
        + "o passa a shared/dw-app-ui.js, o la ragione va in COPIA_PROPRIA");
    });
  }
}
test("la regola 17 ha davvero guardato le superfici, e l'elenco delle copie è quello", () => {
  ok(uiGuardate === SUPERFICI.length,
    `guardate ${uiGuardate} superfici su ${SUPERFICI.length}`);
  ok(uiCondivise === 7, `le superfici che caricano il file condiviso sono ${uiCondivise}, me ne aspettavo 7`
     + " (le sei app e l'amministrazione di Deepwork ID, entrata il 03/08)");
  const attese = Object.keys(COPIA_PROPRIA).sort().join(", ");
  ok(uiConCopia.sort().join(", ") === attese,
    `copie proprie trovate: [${uiConCopia.join(", ")}] · dichiarate: [${attese}]`);
});
test("la regola 17 distingue una definizione da un uso", () => {
  ok(strutturaInCasa("function toast(msg, tipo) {}").length === 1, "la funzione dichiarata è una copia");
  ok(strutturaInCasa("const chiedi = (t, c) => new Promise(r => r(1));").length === 1,
     "e anche la freccia: è così che l'ha scritta l'amministrazione");
  ok(strutturaInCasa("toast('Salvato.', 'success'); apriModale('x', 'y', []);").length === 0,
     "chiamarle non è ridefinirle");
  ok(strutturaInCasa('const t = "function toast(msg) { … }";').length === 0,
     "dentro una stringa non è codice");
  ok(strutturaInCasa('const toast = document.getElementById("toast");').length === 0,
     "una variabile che si chiama come la funzione non è la funzione");
  ok(usaLaStruttura("apriModale('Titolo', 'Corpo', []);") === true, "l'uso si vede");
  ok(usaLaStruttura("obj.toast(1);") === false, "il metodo di un oggetto non è la funzione globale");
  ok(usaLaStruttura("// qui una volta c'era toast('x')") === false, "e un commento nemmeno");
});

/* ══ CONTROPROVE SUI FILE VERI, PER LE REGOLE CHE NE AVEVANO SOLO DI FINTE ══
   ────────────────────────────────────────────────────────────────────────
   La lezione del 01/08, pagata con la regola 1: **una controprova va misurata
   anche nella sua COPERTURA, non solo nel suo esito.** Le regole 11, 13 e 14
   dimostravano di saper fallire su tre righe inventate — non su una superficie
   da mezzo milione di caratteri, con template annidati, espressioni regolari e
   commenti dentro le stringhe. È precisamente la differenza che ha tenuto
   nascosto per settimane il buco della regola 1: la funzione, sul suo esempio,
   funzionava benissimo.

   Il difetto si rimette dove la scansione è più in difficoltà — cioè dove un
   template di primo livello si chiude, gli stessi punti che alla regola 1
   erano fatali. Non in fondo al file, che è il posto più facile. */
function puntiDifficili(src, quanti = 8) {
  const spie = [];
  classifica(src, spie);
  if (spie.length === 0) return [];
  const passo = Math.max(1, Math.floor(spie.length / quanti));
  const scelti = [];
  for (let i = 0; i < spie.length && scelti.length < quanti; i += passo) scelti.push(spie[i]);
  return scelti;
}
function controprovaSuiVeri(etichetta, regola, veleno, ammessa = () => true) {
  let superfici = 0, punti = 0, cieche = 0;
  const dove = [];
  for (const [, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null || !ammessa(src)) continue;
    const posti = puntiDifficili(src);
    if (posti.length === 0) continue;
    const v = typeof veleno === "function" ? veleno(src) : veleno;
    if (v === null) continue;
    superfici++;
    const base = regola(src).length;
    for (const p of posti) {
      punti++;
      const rotto = src.slice(0, p) + v + src.slice(p);
      if (regola(rotto).length <= base) { cieche++; if (!dove.includes(rel)) dove.push(rel); }
    }
  }
  test(`${etichetta}: il difetto rimesso nei file veri viene visto (${superfici} superfici, ${punti} punti)`, () => {
    ok(superfici >= 3, `solo ${superfici} superfici hanno ricevuto l'iniezione: la controprova non sta coprendo niente`);
    ok(cieche === 0, `${cieche} iniezioni su ${punti} non viste, in ${dove.join(", ")}`);
  });
}

/* regola 11: una forma dell'euro scritta in casa, come le tre vere del 30/07 */
controprovaSuiVeri("regola 11 (euro in casa)", euroInCasa,
  ';const eur = (v) => "€ " + v;');

/* regola 13: un secondo scarico con un nome di file che nella superficie
   esiste già — è esattamente il caso di Conti, due bottoni e un nome solo */
controprovaSuiVeri("regola 13 (due export, stesso nome)", nomiScaricatiRipetuti,
  (src) => {
    const m = src.match(/\.download = "([^"]+)"/);
    return m ? `;a.download = "${m[1]}";` : null;   // niente export: niente da duplicare
  });

/* regola 9: la copia locale della guardia sugli interi, esattamente com'era
   scritta in Terra prima del 31/07 — quella per cui «1.500» diventava «500» */
controprovaSuiVeri("regola 9 (guardia degli interi riscritta in casa)", guardieInCasa,
  ';el.addEventListener("beforeinput", (e) => { if (!e.data || !/[.,]/.test(e.data)) return; e.preventDefault(); el.value = ""; });');

/* regola 10: uno stato vuoto col solo titolo, come i tredici del core */
controprovaSuiVeri("regola 10 (stato vuoto muto)", vuotiSenzaSpiegazione,
  '<div class="empty-state"><div class="empty-title">Nessun mezzo da lavoro</div></div>');

/* regola 15: il giorno preso da toISOString() su una data locale */
controprovaSuiVeri("regola 15 (il giorno di calendario preso in UTC)", giornoInUtc,
  ';const oggiFinto = new Date().toISOString().slice(0, 10);');

/* regola 14: un esito scritto sulla nota del modo */
controprovaSuiVeri("regola 14 (nota del modo come lavagna)", avvisoUsatoComeLavagna,
  ';esito("mode-note", "Esportate 3 fatture.", "success");',
  (src) => /id="mode-note"/.test(src));

/* regola 17: la copia locale del toast rimessa dentro, esattamente come stava
   in tutte e sei le app fino al 02/08 */
controprovaSuiVeri("regola 17 (struttura riscritta in casa)", strutturaInCasa,
  ';function toast(msg, tipo) { const t = document.getElementById("toast"); if (t) t.textContent = msg; }');

/* ── REGOLA 18 · una mappa di stati copre tutti gli stati ─────────────
   Le coppie sono dichiarate a mano perché sono poche e perché indovinarle
   automaticamente vorrebbe dire indovinare male: qui si vuole sapere che
   QUESTA funzione alimenta QUELLA mappa. */
const COPPIE_STATO = [
  { funzione: "statoScadenzaHSE", modulo: "shared/dw-ponti.js",
    pagina: "apps/scudo/index.html", mappa: "B",
    perche: "il semaforo dello scadenzario di Scudo (badge e striscia)" },
  { funzione: "statoScadenzaTerra", modulo: "apps/terra/terra-data.js",
    pagina: "apps/terra/index.html", mappa: "SB",
    perche: "il semaforo dello scadenzario di Terra" },
];
/* ⚠️ Due letture sbagliate al primo colpo, e le controprove le hanno viste
   subito — vale la pena scriverle perché sono la stessa famiglia:
   1. le risposte cercate come `return "..."` perdevano quelle dentro un
      TERNARIO (`return g <= pre ? "in-scadenza" : "a-posto"`), cioè metà di
      quelle di Terra. Adesso si prende l'intera istruzione `return …;` e si
      raccolgono TUTTE le stringhe che contiene;
   2. le chiavi della mappa pretendevano una virgola o una graffa davanti, e
      così la PRIMA chiave — quella subito dopo `const B = {` a capo — non
      veniva mai vista: il controllo diceva che mancava «scaduta», che c'era. */
function statiRestituiti(src, nome) {
  const i = src.indexOf(`export function ${nome}(`);
  if (i < 0) return null;
  const fine = src.indexOf("\n}", i);
  const corpo = src.slice(i, fine < 0 ? src.length : fine);
  const stati = [];
  for (const r of corpo.matchAll(/return[^;]*;/g))
    for (const s of r[0].matchAll(/"([^"]+)"/g)) stati.push(s[1]);
  return [...new Set(stati)];
}
function chiaviMappa(src, nome) {
  const i = src.indexOf(`const ${nome} = {`);
  if (i < 0) return null;
  const fine = src.indexOf("};", i);
  const corpo = src.slice(i + `const ${nome} = {`.length, fine < 0 ? src.length : fine);
  return [...new Set([...corpo.matchAll(/(?:^|[,{\s])\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/g)]
    .map((m) => m[1] || m[2]))];
}
function mappeIncomplete() {
  const out = [];
  for (const c of COPPIE_STATO) {
    const stati = statiRestituiti(leggi(c.modulo), c.funzione);
    const chiavi = chiaviMappa(leggi(c.pagina), c.mappa);
    if (!stati || !stati.length) { out.push(`${c.modulo}: non trovo le risposte di ${c.funzione}()`); continue; }
    if (!chiavi || !chiavi.length) { out.push(`${c.pagina}: non trovo la mappa ${c.mappa}`); continue; }
    for (const s of stati)
      if (!chiavi.includes(s))
        out.push(`${c.pagina}: la mappa ${c.mappa} non ha «${s}», che ${c.funzione}() sa restituire`
          + ` — ${c.perche}: la pagina morirebbe al disegno`);
  }
  return out;
}
test("regola 18: ogni mappa di stati copre tutte le risposte della sua funzione", () => {
  const v = mappeIncomplete();
  ok(v.length === 0, v.join("\n      "));
});
/* Quante coppie ha davvero guardato: un «zero violazioni» ottenuto non
   leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
test("regola 18: ha davvero letto le coppie funzione↔mappa", () => {
  let viste = 0;
  for (const c of COPPIE_STATO) {
    const stati = statiRestituiti(leggi(c.modulo), c.funzione);
    const chiavi = chiaviMappa(leggi(c.pagina), c.mappa);
    if (stati && stati.length >= 3 && chiavi && chiavi.length >= 3) viste++;
  }
  ok(viste === COPPIE_STATO.length,
    `${viste} coppie lette su ${COPPIE_STATO.length}: il controllo non sta guardando quello che crede`);
});

/* Il numero di regole scritto nell'intestazione è quello vero? Era rimasto a
   «tredici» mentre le regole erano diciassette. Un numero in un commento non
   fallisce: sta lì, e chi legge si fida. */
test("l'intestazione dice quante regole ci sono davvero", () => {
  const testa = leggi("apps/deepwork-id/tests/run-stile.mjs").split("// ============================================================")[1] || "";
  const voci = [...testa.matchAll(/^\/\/\s{0,2}(\d{1,2})\. /gm)].map((m) => +m[1]);
  const dichiarate = +(testa.match(/^\/\/ (\d{1,2}) regole,/m) || [])[1];
  ok(voci.length > 0, "nessuna voce numerata trovata nell'intestazione: il controllo non sta guardando niente");
  ok(dichiarate === voci.length,
    `l'intestazione dice ${dichiarate} regole ma ne elenca ${voci.length}`);
  ok(voci.every((n, i) => n === i + 1),
    `la numerazione salta: ${voci.join(", ")}`);
});

console.log(`\nRisultato Stile: ${passed} passati, ${failed} falliti`);
process.exit(failed > 0 ? 1 : 0);
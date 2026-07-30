// ============================================================
// Helper condiviso della shell: pulsante "Esci" coerente su
// tutte le pagine app (D2). Compare SOLO in modalità live —
// in demo/tour non c'è nessun account da cui uscire.
// Uso (dopo aver creato il data layer):
//   import { mountExit } from "../../shared/deepwork-id-client/dw-shell.js";
//   mountExit(db);   // db = risultato di xxxData()
// ============================================================

// Escape HTML per i valori inseriti dall'utente nei template delle
// liste: con Firestore live un nome come "<img onerror=...>" sarebbe
// XSS memorizzato visibile a tutti i colleghi dell'organizzazione.
export function esc(s) {
  return String(s == null ? "" : s)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// Cella CSV sicura: neutralizza la CSV-injection (un valore che inizia
// con = + - @ può eseguire formule aprendo il file in Excel/Calc) e
// mette tra virgolette i valori che contengono ; " o a capo.
export function csvCell(v) {
  let s = String(v == null ? "" : v);
  // Neutralizza la formula anche quando è preceduta da spazi/tab/ritorni a capo
  // (OWASP: pure TAB e CR fanno da innesco): "\t=cmd" deve restare testo.
  if (/^[\t\r\n =+\-@]*[=+\-@]/.test(s)) s = "'" + s;  // apostrofo: la cella resta testo
  if (/[;"\n\r]/.test(s)) s = '"' + s.replaceAll('"', '""') + '"';
  return s;
}

// Legge UNA riga CSV rispettando le virgolette: così un campo come
// "Rossi;Mario" (col separatore dentro) resta un valore solo e non
// spacca le colonne. Toglie anche l'apostrofo di guardia che csvCell
// mette davanti a = + - @, così l'export si può re-importare identico.
// Delimitatore: preferisce ; (default Excel italiano e nostro export),
// poi TAB, poi virgola.
// Sceglie il delimitatore contando SOLO le occorrenze FUORI dalle virgolette
// (priorità ; poi TAB poi virgola): così un ; dentro un campo quotato di un
// file a virgole non fa scambiare il file per "a punto e virgola".
function rilevaDelim(line) {
  let q = false, semi = 0, tab = 0, comma = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i + 1] === '"') i++; else q = !q; }
    else if (!q) { if (c === ";") semi++; else if (c === "\t") tab++; else if (c === ",") comma++; }
  }
  return semi ? ";" : (tab ? "\t" : ",");
}

export function parseCsvLine(line) {
  const delim = rilevaDelim(line);
  const out = [], quotato = [];
  let cur = "", q = false, fieldQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }   // "" = virgoletta letterale
        else q = false;
      } else cur += c;
    } else if (c === '"') {
      q = true; fieldQ = true;                          // il campo era tra virgolette
    } else if (c === delim) {
      out.push(cur); quotato.push(fieldQ); cur = ""; fieldQ = false;
    } else cur += c;
  }
  out.push(cur); quotato.push(fieldQ);
  // rimuove l'apostrofo di guardia SOLO se davanti a un carattere di formula
  // (un nome che inizia davvero con ' non viene toccato); i campi QUOTATI
  // conservano gli spazi (le virgolette servono proprio a preservarli), gli
  // altri vengono ripuliti da spazi di contorno.
  return out.map((v, i) => {
    v = v.replace(/^'(?=[=+\-@])/, "");
    return quotato[i] ? v : v.trim();
  });
}

// TOGLIE I DOPPIONI DENTRO UN FILE APPENA LETTO.
//
// Perché sta qui e non in un'app (31/07). Tutte e sei le app controllavano il
// doppione allo stesso modo — confrontando ogni riga con l'elenco caricato
// all'apertura della pagina — e in tutte e sei quell'elenco NON si aggiorna
// mentre il file scorre. Risultato: due righe uguali dentro lo stesso file
// entrano tutte e due. Misurato il 31/07 su **dieci gestori d'importazione su
// dieci** che il doppione lo cercavano: nessuno guardava dentro il file.
//
// Non è un caso di scuola. L'esportazione di Scudo scrive una riga per ogni
// scadenza, quindi il file di un lavoratore con tre scadenze lo nomina tre
// volte: ri-caricarlo faceva comparire tre volte la stessa persona. E un
// listino o un parco mezzi preparato a mano in un foglio di calcolo ha
// benissimo la stessa riga due volte.
//
// Due decisioni, prese apposta:
//  · vale la PRIMA scrittura, non l'ultima — chi rilegge il proprio file si
//    aspetta l'ordine in cui l'ha scritto;
//  · una chiave VUOTA passa. Senza chiave non si può decidere se sia un
//    doppione, e schiacciare insieme tutte le righe senza chiave farebbe
//    sparire dati veri: chi li scarta è il lettore dell'app, che sa quali
//    campi sono obbligatori per quella cosa lì.
// Il confronto ignora maiuscole e spazi di contorno: «Rossi Mario» e
// « ROSSI MARIO » sono la stessa persona.
//
// Il confronto con quello che è GIÀ in archivio resta alla pagina: è l'unica
// a conoscerlo, ed è un'altra domanda.
export function senzaDoppioni(righe, chiave) {
  const visti = new Set();
  return (righe || []).filter(r => {
    const k = chiave(r);
    const c = (k == null ? "" : String(k)).trim().toLowerCase();
    if (!c) return true;
    if (visti.has(c)) return false;
    visti.add(c);
    return true;
  });
}

// Riconosce la RIGA D'INTESTAZIONE di un CSV in modo indipendente dal
// delimitatore. L'header è la prima riga quando inizia col nome della prima
// colonna seguito da un separatore (; TAB o virgola). Serve perché
// parseCsvLine rileva anche virgola e TAB, mentre prima ogni parser toglieva
// l'header solo se separato da ";": un file a virgole CON intestazione avrebbe
// iniettato una riga-fantasma "header". Case-insensitive, spazi ammessi dopo
// il nome colonna. La keyword viene "escapata" per sicurezza futura.
export function isIntestazione(row, primaColonna) {
  const kw = String(primaColonna || "").trim();
  if (!kw) return false;
  const escKw = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("^" + escKw + "\\s*[;,\\t]", "i").test(String(row || "").trim());
}

// Converte un numero scritto "all'italiana" o "all'inglese" in Number, così
// l'import CSV non perde righe per colpa del formato. Regola: l'ULTIMO
// separatore presente è quello DECIMALE.
//   "18.300,50" (punto = migliaia, virgola = decimali) → 18300.5
//   "18,300.50" (formato inglese)                       → 18300.5
//   "1234,5" → 1234.5   ·   "1234.5" → 1234.5   ·   "1234" → 1234
// Con il SOLO punto lo si lascia come decimale (così "19.4" resta 19.4): un
// punto isolato è ambiguo (migliaia o decimali) e non lo si indovina — per
// questo l'onboarding consiglia di non usare il separatore delle migliaia.
// Ritorna NaN se non è un numero (le righe non valide vengono poi scartate).
export function numIt(v) {
  let s = String(v == null ? "" : v).trim();
  if (s === "") return NaN;
  const commas = (s.match(/,/g) || []).length;
  const dots = (s.match(/\./g) || []).length;
  if (commas && dots) {
    // entrambi presenti: l'ULTIMO separatore è il decimale, l'altro le migliaia
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")   // italiano: punto = migliaia
      : s.replace(/,/g, "");                       // inglese: virgola = migliaia
  } else if (commas > 1) {
    s = s.replace(/,/g, "");                       // virgole multiple, senza punto = migliaia (es. 1,234,567)
  } else if (commas === 1) {
    s = s.replace(",", ".");                       // una sola virgola = decimale (es. 1234,5)
  } else if (dots > 1) {
    s = s.replace(/\./g, "");                       // punti multipli, senza virgola = migliaia (es. 1.234.567)
  }
  // un solo punto (o nessun separatore) resta com'è: "19.4" è decimale
  return +s;
}

// Giorni di calendario tra `oggi` e una data ISO (yyyy-mm-dd). Normalizza
// ENTRAMBE le date alla mezzanotte LOCALE prima di sottrarre, così il conteggio
// non slitta di un giorno per colpa dell'ora corrente: con new Date() come
// "oggi", un floor darebbe -1 da mezzogiorno in poi (una scadenza di OGGI
// risulterebbe "scaduta" tutto il giorno). Usa round per essere robusto ai
// cambi di ora legale (giorni da 23/25 h). Positivo = nel futuro; NaN se la
// data non è valida (i chiamanti scartano/ignorano il NaN come prima).
export function giorniTra(dataISO, oggi = new Date()) {
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  return Math.round((new Date(dataISO + "T00:00:00") - o) / 86400000);
}

// ══════════════════════════════════════════════════════════════════════
// UN NUMERO SCRITTO A MANO — una convenzione sola per tutte e sei le app
// ══════════════════════════════════════════════════════════════════════
// `numIt` qui sopra legge i file delle MACCHINE, dove il decimale è il punto:
// per lui «1.250» è 1,25, e per un CSV è giusto. Ma un italiano che DIGITA
// «1.250» in un campo intende milleduecentocinquanta, e le due letture distano
// mille volte. Su un imponibile di fattura è 1.250 € contro 1,25 €.
//
// Perché sta qui e non in ogni app: la stessa convenzione era finita scritta
// QUATTRO volte in modi diversi, e le sei app leggevano «1.250» in tre modi —
// Flotta chiedeva sempre, Conti e Terra risolvevano quando una sola lettura era
// possibile, Sentinella/Campo/Genesi prendevano 1,25 in silenzio. È lo stesso
// difetto delle unità in maiuscolo di stamattina: tre toppe locali per una causa
// sola. Una convenzione condivisa vive in `shared/`.
//
// La regola, in chiaro:
//  1. si ripulisce ciò che arriva dai fogli di calcolo (€, spazi fini, nbsp);
//  2. le FORME ammesse sono elencate: tutto il resto non è un numero e non si
//     tira a indovinare — «2,4,5» non è 245, «1e3» non è un numero da cava;
//  3. se la scrittura è AMBIGUA (un separatore solo, esattamente tre cifre
//     dopo) si guardano le due letture possibili e si tengono quelle che stanno
//     nei limiti del campo: se ne resta UNA si usa, senza disturbare
//     («1.600» in una densità è 1,6 perché 1600 t/m³ non esiste); se restano
//     ENTRAMBE non si indovina, si dichiara `ambiguo` con le due letture, così
//     il messaggio può mostrarle invece di dire «numero non valido»;
//  4. poi valgono intero/positivo/min/max, e infine l'arrotondamento del campo.
// Su ciò che non si capisce il valore è `null`, MAI zero: vuoto e
// incomprensibile non sono misure. Pura e testabile.
const NUM_RIPULISCI = /[\s    €]/g;
const NUM_FORME = [
  /^[+-]?\d+$/,                              // 1250
  /^[+-]?\d+[.,]\d+$/,                       // 1250,75 · 1250.75
  /^[+-]?[.,]\d+$/,                          // ,75
  /^[+-]?\d{1,3}(\.\d{3})+(,\d+)?$/,         // 1.250.000,75 all'italiana
  /^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/,         // 1,250,000.75 all'inglese
];
const NUM_AMBIGUO = /^[+-]?\d{1,3}[.,]\d{3}$/;
// La NOTAZIONE SCIENTIFICA, e perché è dietro un interruttore spento.
// «1.5e3» non è un numero che una persona scrive in un modulo: accettarlo lì
// vorrebbe dire prendere per buono un «2e5» battuto per sbaglio e salvare
// duecentomila. Ma le MACCHINE la scrivono: l'esportazione di una perforatrice
// mette l'energia specifica così, e un sismografo può dare la velocità come
// «1.5E-2». Quindi chi legge un file di macchina passa `scientifica: true`, e
// chi legge un campo scritto a mano non fa niente — resta rifiutata.
const NUM_SCIENT = /^[+-]?\d+(?:[.,]\d+)?[eE][+-]?\d+$/;

export function numeroScritto(testo, opts = {}) {
  const grezzo = String(testo == null ? "" : testo).trim();
  const s = grezzo.replace(NUM_RIPULISCI, "").replace(/^\+/, "");
  const esito = (motivo, valore, extra) =>
    Object.assign({ vuoto: motivo === "vuoto", ok: !motivo, valore, grezzo, motivo }, extra || {});
  if (s === "") return esito("vuoto", null);
  const scientifico = opts.scientifica === true && NUM_SCIENT.test(s);
  if (!scientifico && !NUM_FORME.some((r) => r.test(s))) return esito("non-numero", null);

  const dec = opts.decimali == null ? 2 : Math.max(0, +opts.decimali || 0);
  // L'arrotondamento non deve poter PEGGIORARE il numero. `Math.round(n * p)`
  // con molti decimali esce dall'intervallo degli interi esatti e restituisce
  // spazzatura: una coordinata UTM come 4512345,67 chiesta a 10 decimali darebbe
  // 4,51234567e16, oltre 2^53. Quando succede si tiene il numero così com'è —
  // meglio un decimale in più del previsto che una cifra inventata.
  const arrotonda = (n) => {
    const p = Math.pow(10, dec), x = Math.round(n * p);
    return Number.isSafeInteger(x) ? x / p : n;
  };
  const min = opts.min == null ? null : +opts.min;
  const max = opts.max == null ? null : +opts.max;
  const staNeiLimiti = (n) => Number.isFinite(n)
    && !(opts.intero && !Number.isInteger(n))
    && !(opts.positivo && !(n > 0))
    && !(min != null && n < min) && !(max != null && n > max);

  if (!scientifico && opts.migliaia !== false && NUM_AMBIGUO.test(s)) {
    const comeMigliaia = +s.replace(/[.,]/g, "");
    const comeDecimale = numIt(s);
    const possibili = [comeMigliaia, comeDecimale].filter(staNeiLimiti);
    // una sola lettura possibile: non c'è niente da chiedere
    if (possibili.length === 1) return esito("", arrotonda(possibili[0]));
    // nessuna delle due sta nei limiti: si riferisce quella che l'utente
    // intendeva quasi certamente, così il messaggio parla del numero suo
    if (possibili.length === 0) {
      const n = comeMigliaia;
      if (opts.intero && !Number.isInteger(n)) return esito("non-intero", n);
      if (opts.positivo && !(n > 0)) return esito("non-positivo", n);
      if (min != null && n < min) return esito("sotto-minimo", n);
      return esito("sopra-massimo", n);
    }
    return esito("ambiguo", null, { letture: [comeMigliaia, comeDecimale] });
  }

  const n = numIt(s);
  if (!Number.isFinite(n)) return esito("non-numero", null);
  if (opts.intero && !Number.isInteger(n)) return esito("non-intero", n);
  if (opts.positivo && !(n > 0)) return esito("non-positivo", n);
  if (min != null && n < min) return esito("sotto-minimo", n);
  if (max != null && n > max) return esito("sopra-massimo", n);
  return esito("", arrotonda(n));
}

// Un numero INTERO scritto a mano: giorni, mesi, numero di fori. Mezzo mese
// non esiste.
export function interoScritto(testo, opts = {}) {
  return numeroScritto(testo, { ...opts, intero: true, decimali: 0 });
}

// Come si scrive un numero DENTRO un campo di testo: con la virgola decimale e
// MAI col punto delle migliaia. Non è un vezzo — il punto delle migliaia
// rientrerebbe da `numeroScritto` come ambiguo, e l'app finirebbe per rifiutare
// un valore che ha proposto lei.
export function perCampo(v, decimali = 2) {
  if (v == null || v === "" || !Number.isFinite(+v)) return "";
  return (+v).toLocaleString("it-IT", { useGrouping: false, maximumFractionDigits: Math.max(0, decimali) });
}

// IL MESSAGGIO di un numero che non si è potuto leggere. Sta accanto al lettore
// perché la frase e la regola sono la stessa cosa: se ogni schermata se la
// scrive per conto suo, una frase sbagliata diventa sei difetti. E soprattutto
// perché i motivi sono cresciuti — quando `ambiguo` è arrivato, i punti che
// gestivano solo «non-numero» dicevano cose false: in Campo un «1.250» nei
// chili rispondeva «i chili non possono essere negativi».
// `cosa` è il nome del dato come lo chiama l'utente («i chili caricati», «la
// PPV misurata»): la frase deve nominarlo, altrimenti in un form con cinque
// caselle non si sa quale correggere. Non dice MAI «valore non valido»: dice
// cos'è scritto e cosa fare.
const NUM_AVVISO_DEC = "Va bene sia la virgola sia il punto: «2,4» e «2.4» sono lo stesso numero.";
const NUM_AVVISO_MIG = "Scrivilo senza il punto delle migliaia.";
export function messaggioNumero(r, cosa, opts = {}) {
  const q = "«" + String((r && r.grezzo) != null ? r.grezzo : "") + "»";
  const u = opts.unita ? " " + opts.unita : "";
  const mostra = (v, dec = 2) => Number.isFinite(+v)
    ? (+v).toLocaleString("it-IT", { maximumFractionDigits: Math.max(0, dec) }) : "";
  switch (r && r.motivo) {
    case "vuoto":
      return "Senza " + cosa + " non posso salvare: scrivi il numero.";
    case "ambiguo":
      // le due letture si scrivono con perCampo, non raggruppate: «1.250
      // oppure 1,25» ripeterebbe la stringa ambigua invece di scioglierla. E
      // tre decimali, perché la lettura decimale di «5.875» è 5,875 — con due
      // diventerebbe «5,88», un terzo numero che nessuno ha scritto.
      return q + " può voler dire " + perCampo(r.letture[0]) + u + " (punto delle migliaia) oppure "
        + perCampo(r.letture[1], 3) + u + " (punto decimale), e non voglio indovinare al posto tuo. " + NUM_AVVISO_MIG;
    case "non-numero":
      return "Non riesco a leggere " + cosa + ": " + q + " non è un numero. " + NUM_AVVISO_DEC;
    case "non-intero":
      return "Per " + cosa + " serve un numero intero: " + q + " non lo è.";
    case "non-positivo":
      return "Serve un numero maggiore di zero per " + cosa + ": hai scritto " + q + ".";
    case "sotto-minimo":
      return +opts.min === 0
        ? "Un numero negativo non ha senso per " + cosa + ": hai scritto " + q + "."
        : "Per " + cosa + " serve almeno " + mostra(opts.min) + u + ": hai scritto " + q + ".";
    case "sopra-massimo":
      return "Per " + cosa + " il massimo è " + mostra(opts.max) + u + ": " + q + " è troppo, controlla il numero.";
    default:
      return "Non riesco a leggere " + cosa + ": " + q + ". " + NUM_AVVISO_DEC;
  }
}

// ── LA GUARDIA SUI CAMPI INTERI ───────────────────────────────────────────
// I campi decimali sono diventati campi di testo, perché `type="number"`
// scartava la virgola. Sugli INTERI si è scelto di tenere `type="number"`: lì
// lo spinner serve (un numero di fori si aggiusta a frecce) e mezzo foro non
// esiste. Ma questo lasciava al browser l'ultima parola sulla virgola, e
// misurato in Chromium fa due cose, entrambe dannose:
//   «1,5»   → `.value` diventa «15» e `checkValidity()` risponde **true**;
//   «1.500» → `.value` resta «1.500», valido false, e il lettore ne fa 1,5.
// Leggere la validità quindi NON basta: nel primo caso il browser ha già
// distrutto il numero e lo dichiara buono. Si interviene prima, su
// `beforeinput`, dove il carattere si può ancora rifiutare.
//
// Onestà su cosa migliora: rifiutando la virgola, «1,5» resta «15» — lo stesso
// valore che il browser produceva da solo. Il numero non cambia; cambia che chi
// scrive lo SAPPIA nel momento in cui succede, invece di non saperlo mai. Dove
// migliora anche il valore è «1.500», che valeva 1,5 e adesso vale 1500.
//
// Un limite del browser, misurato e non aggirabile: su `type="number"`
// `selectionStart` è **null** e `setSelectionRange` lancia un'eccezione — non
// c'è cursore. Quindi su un incolla che contiene separatori non si può inserire
// nel punto giusto: se il campo è vuoto si scrive il numero ripulito (il caso
// normale), altrimenti si rifiuta e si spiega. Meglio rifiutare che sovrascrivere
// quello che c'era.
export function eCampoIntero(el) {
  if (!el || el.tagName !== "INPUT" || el.type !== "number") return false;
  const st = el.getAttribute("step");
  if (st && st.includes(".")) return false;                 // decimale dichiarato dallo step
  return el.getAttribute("inputmode") !== "decimal";        // ...o dall'inputmode
}
// La DECISIONE, separata dall'evento perché la decisione è la parte che si può
// sbagliare, e finché stava dentro l'ascoltatore l'unico modo di provarla era
// aprire un browser. Prende quello che è stato battuto o incollato (`dato`) e
// quello che c'è già nel campo (`valore`); risponde `null` quando non c'è
// niente da fare, altrimenti dice cosa fare e cosa dire:
//   { blocca: true, messaggio, valore? }  — `valore` solo quando il campo si
//   può riscrivere, cioè quando era vuoto.
export function decisioneIntero(dato, valore) {
  if (dato == null || !/[.,]/.test(dato)) return null;
  // un solo separatore battuto a mano
  if (dato === "," || dato === ".") {
    return { blocca: true, messaggio: "Qui va un numero intero: né la virgola né il punto delle migliaia servono." };
  }
  // più caratteri (un incolla): si toglie ciò che non è cifra
  const pulito = dato.replace(/[.,\s  ]/g, "");
  if (pulito === dato) return null;
  // su `type="number"` non c'è cursore (selectionStart è null): a campo pieno
  // non si può inserire nel punto giusto, quindi si rifiuta e si spiega
  if (valore) {
    return { blocca: true, messaggio: "Incolla senza separatori: qui va un numero intero, e in questo campo non posso inserirlo a metà." };
  }
  return { blocca: true, valore: pulito, messaggio: "Ho tolto i separatori: qui va un numero intero." };
}
export function montaGuardiaInteri(avvisa) {
  const dillo = typeof avvisa === "function" ? avvisa : () => {};
  document.addEventListener("beforeinput", (ev) => {
    const el = ev.target;
    if (!eCampoIntero(el)) return;
    const d = decisioneIntero(ev.data, el.value);
    if (!d) return;
    ev.preventDefault();
    if (d.valore !== undefined) {
      el.value = d.valore;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    // l'elemento arriva a chi avvisa: serve alle app che, oltre al toast,
    // vogliono segnare in rosso il campo e scrivere nel proprio riquadro
    // d'esito. Senza, l'unico modo era riscriversi la regola in casa.
    dillo(d.messaggio, el);
  });
}

// ══════════════════════════════════════════════════════════════════════
// ⛔ L'UNITÀ DI MISURA DENTRO UN TESTO MAIUSCOLO
// ══════════════════════════════════════════════════════════════════════
// Etichette, badge e pillole sono maiuscoli per struttura — è la forma del
// core — ma quando ci passa dentro un'unità il maiuscolo la corrompe: «gg»
// diventa «GG», che non è un giorno, e «m³» diventa «M³», che si legge come
// un'altra grandezza. Il rimedio del progetto è avvolgere l'unità in
// `<span class="u">`, che ogni app riporta in minuscolo con una regola sola.
//
// PERCHÉ STA QUI E NON IN OGNI APP. Il 30/07 questa riga è nata in tre app
// nello stesso pomeriggio, e nasceva già DIVERSA: due accettavano «30gg»
// attaccato, la terza pretendeva lo spazio e quindi su «30gg» non faceva
// niente. Tre copie di una regola che il primo giorno si comportano in due
// modi: è il difetto che in questo progetto è già costato una giornata.
//
// ⚠️ SI CHIAMA SU TESTO GIÀ ESCAPATO. Il markup si aggiunge DOPO `esc()`, mai
// dentro la stringa che verrà escapata: lì chi guarda si vedrebbe il tag
// scritto per intero.
/* PERCHÉ «h» C'È E «l» NO — la domanda è rimasta aperta due giorni, e una regola
   a metà è il posto peggiore in cui lasciarla:
   - «h» è l'ORA, e le ore motore sono la grandezza principale di Flotta. In
     maiuscolo diventa «H», che non è una scrittura ammessa per l'ora (H è
     l'henry). Le etichette dei tagliandi finiscono in una pastiglia, e la
     pastiglia è maiuscola: «tra 24,5 h» usciva «TRA 24,5 H».
   - «l» è il LITRO, e «L» è una scrittura AMMESSA dallo stesso sistema di unità
     (le due forme convivono proprio perché la elle minuscola si confonde con
     l'uno). Non essendo un errore, non entra qui: l'elenco serve a fermare le
     scritture SBAGLIATE, non a imporre un gusto. Se un giorno si vorrà anche
     l'uniformità, quella è un'altra decisione e va presa per tutte le unità
     insieme, non aggiungendo una lettera alla volta.

   ⛔ L'ORDINE NON SI SCRIVE A MANO, SI CALCOLA (vedi `IN_ORDINE` qui sotto).
   Aggiungendo «h» è saltato fuori che il difetto c'era già: «km/h» non era in
   elenco, «km» sì, e «40 km/h» diventava `<span>km</span>/h` — cioè, dentro una
   pastiglia, «40 km/H». Lo stesso valeva per «kg/m³», che usciva «kg/M³»: il
   metro cubo maiuscolo, esattamente l'errore che questa funzione esiste per
   impedire. Non è colpa di chi ha scritto l'elenco: è che un elenco il cui
   ORDINE conta, ma il cui ordine è affidato alla memoria di chi lo modifica,
   prima o poi si rompe in silenzio. Le composte vanno riconosciute prima delle
   semplici, e per ottenerlo basta ordinare per lunghezza: così chi aggiunge
   un'unità la scrive dove gli pare e la regola resta giusta. */
/* ⚠️ «/h» DA SOLO NON È UN REFUSO. Flotta scrive il costo orario come
   «€19,02/h»: la valuta sta PRIMA del numero, quindi non esiste nessun «€/h»
   preceduto da una cifra da riconoscere — l'unico pezzo da salvare è la coda
   «/h», che senza di questa riga diventava «€19,02/H». Il banco delle unità
   l'ha trovato da sé il 30/07, un'ora dopo che «h» era entrata nell'elenco:
   tre pastiglie in Flotta, «€19,02/H», «9,7 L/H», «€14,55/H». */
const UNITA_DA_SALVARE = ["gg", "m³", "m²", "mm/s", "µg/m³", "mg/m³", "kg/m³",
  "kg/foro", "kg/m", "kg", "km/h", "km", "cm", "mm", "m³/h", "m³/giorno",
  "m³/anno", "t/m³", "l/h", "€/h", "/h", "h"];
const IN_ORDINE = [...UNITA_DA_SALVARE].sort((a, b) => b.length - a.length);
export function avvolgiUnita(testo) {
  let t = String(testo == null ? "" : testo);
  for (const u of IN_ORDINE) {
    // dopo una cifra, con o senza spazio in mezzo, e non dentro una parola
    const re = new RegExp("(\\d)(\\s*)" + u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\w³²])", "g");
    /* ⚠️ LO SPAZIO STA DENTRO LO SPAN, non prima. La pastiglia è un contenitore
       flex con `gap: 4px`, e uno span che le sta dentro diventa un elemento
       flex: il gap comparirebbe ANCHE dove il testo non aveva nessuno spazio, e
       «€ 26,11/h» uscirebbe «€ 26,11 /h». Con lo spazio dentro, la pastiglia può
       annullare il gap una volta sola (`.badge .u{margin-left:-4px}`) e le due
       forme — quella staccata e quella attaccata — vengono giuste tutte e due.
       ⚠️ E lo spazio dev'essere QUELLO UNIFICATORE (U+00A0), non uno normale:
       dentro un contenitore flex lo span è un elemento a sé, il suo contenuto
       comincia una riga nuova, e uno spazio normale a inizio riga il browser lo
       toglie. Misurato: «17,4 l/h» usciva «17,4l/h». Del resto è anche giusto
       nel merito — un'unità non deve mai andare a capo lontano dal suo numero,
       è la stessa ragione per cui il simbolo dell'euro ha l'unificatore.
       Misurato prima di decidere: su sei app le pastiglie visibili sono 302, e
       di quelle con figli 35 contengono un'unità contro 3 che contengono
       un'icona. Il gap serviva a tre casi e ne rovinava trentacinque. */
    t = t.replace(re, (_, cifra, spazio) =>
      `${cifra}<span class="u">${spazio ? "\u00A0" : ""}${u}</span>`);
  }
  return t;
}

/* ⛔ I SOLDI SI SCRIVONO IN UN MODO SOLO IN TUTTO L'ECOSISTEMA.
   Il 30/07 erano tre modi in tre app, e ognuna aveva scritto accanto alla
   propria la RAGIONE per cui era quella giusta:
     Conti   «€\u00A048.200,00»  — «spazio dopo l'euro; le colonne devono
                              incolonnarsi: mai formati misti»
     Flotta  «€178,50» / «€8.400» — «i centesimi solo quando ci sono:
                              €8.400,00 è rumore»
     Terra   «€\u002048.200»     — arrotondato
   Nessuna delle tre è sciatta; è che nessuna sapeva delle altre. E il cliente
   che compra due app le vede una accanto all'altra.

   Come si è deciso, invece di scegliere a caso fra tre:
   - il SIMBOLO non ha varianti difendibili: «€» con lo spazio, sempre, davanti
     alla cifra. E lo spazio è quello UNIFICATORE (U+00A0), non quello normale:
     ⚠️ gli spazi erano TRE, non due, e me ne sono accorto solo guardando i byte.
     Conti aveva l'unificatore, Terra lo spazio normale, Flotta niente. Con lo
     spazio normale, su una colonna stretta, «€» resta a fine riga e la cifra va
     a capo da sola: il simbolo si stacca dai soldi che descrive. Scritto con
     l'escape, così nessuno lo «corregge» in uno spazio normale non vedendo la
     differenza — che a occhio non c'è.
   - i DECIMALI sì che sono una scelta vera, perché un totale in colonna e un
     indicatore arrotondato sono due cose diverse. Perciò due funzioni con due
     nomi, non un interruttore: `euro` (sempre due decimali) ed `euro0`
     (arrotondato).
   - la terza forma di Flotta — i centesimi solo quando ci sono — cade, ed è
     l'unica cosa che cambia di aspetto. Il motivo è quello che Conti aveva già
     scritto: dentro una colonna alcune righe avrebbero i decimali e altre no,
     e le cifre non si incolonnano più.
   Le app la RI-ESPORTANO col nome che hanno sempre usato (`const eur = euro`):
   un alias non è una seconda implementazione. */
/* ⚖️ DUE CONVENZIONI, E NESSUNA DELLE DUE È UN REFUSO — deciso il 30/07 e
   scritto qui perché è qui che uno viene a cercare.
   Nel TESTO l'importo si scrive «€ 48.200,00», col simbolo davanti: è come si
   legge una cifra dentro una frase o dentro una colonna di importi.
   Su un ASSE DI GRAFICO si scrive «2.000 €», col simbolo dopo: là il simbolo
   non è parte dell'importo, è l'unità di misura dell'asse, e sta dove stanno
   tutte le altre — «17,4 l/h», «61,4 %», «18 mm/s». Lo mette `conUnita` del
   motore dei grafici, con la stessa riga per tutte.
   Non si uniformano: uniformarle vorrebbe dire scrivere «€ 2.000» su un asse,
   dove nessun grafico al mondo lo scrive, oppure «48.200,00 €» in mezzo a una
   frase. Chi trova questa differenza e la crede un difetto, legga qui prima di
   correggerla. */
const EURO2 = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const EURO0 = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });
/* ⚠️ IL SEGNO MENO STA DAVANTI AL SIMBOLO, non in mezzo. Attaccando il simbolo
   davanti a quello che sputa `Intl` veniva fuori «€ -1234,50», col meno
   incastrato fra il simbolo e le cifre: è la forma peggiore delle due, perché a
   colpo d'occhio il meno sembra un trattino di separazione e non un segno. In
   una colonna di importi, dove il segno è l'unica cosa che distingue un credito
   da un debito, non è un dettaglio tipografico. Si scrive «-€ 1.234,50». */
/* `conEuro` è esportata perché il SIMBOLO e il FORMATO DEL NUMERO sono due cose
   diverse, e una sola delle due è una convenzione dell'ecosistema. Quando un'app
   ha un numero formattato a modo suo per una ragione sua — l'indicatore di
   Flotta che scrive «8,4k» per far stare la cifra in una casella piccola — deve
   poter mettere il simbolo GIUSTO senza riscriverne la regola: quella è la
   strada da cui sono nate le tre forme diverse. Si passa il numero già scritto,
   torna col simbolo e col meno al posto giusto. */
export function conEuro(testo) {
  const s = String(testo == null ? "" : testo);
  return s.startsWith("-") ? "-\u20AC\u00A0" + s.slice(1) : "\u20AC\u00A0" + s;
}
export function euro(v) { return conEuro(EURO2.format(+v || 0)); }
export function euro0(v) { return conEuro(EURO0.format(Math.round(+v || 0))); }

export function mountExit(db) {
  if (!db || db.mode !== "live" || typeof db.logout !== "function") return;
  const top = document.querySelector(".top");
  if (!top || top.querySelector(".dw-exit")) return;
  const a = document.createElement("a");
  a.className = "dw-exit";
  a.textContent = "Esci";
  a.title = "Esci dall'account";
  a.onclick = async () => {
    try { await db.logout(); } catch (e) { /* comunque al login */ }
    location.href = "../deepwork-id/index.html";
  };
  top.appendChild(a);
  document.body.classList.add("has-exit");
}

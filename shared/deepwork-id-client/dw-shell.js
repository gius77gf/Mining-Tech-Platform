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
    dillo(d.messaggio);
  });
}

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

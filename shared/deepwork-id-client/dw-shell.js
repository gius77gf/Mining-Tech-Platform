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

/* ⛔ L'INNESCO DELLA FORMULA È SCRITTO UNA VOLTA SOLA, e serve a DUE funzioni
   che devono essere l'una l'inversa dell'altra: `csvCell` mette l'apostrofo,
   `leggiCsv` lo toglie. Finché la regola stava solo dentro `csvCell`, il giro
   non si chiudeva — misurato il 01/08: su sette valori scritti e riletti,
   **quattro non tornavano identici**, e tre erano soltanto l'apostrofo rimasto
   attaccato. Il caso che morde: un numero **negativo** («-12,5») esce dal
   nostro export come «'-12,5» e rientra come `NaN`, cioè un dato che c'era
   sparisce nel giro di andata e ritorno di casa nostra. */
const INNESCO_FORMULA = /^[\t\r\n =+\-@]*[=+\-@]/;

// Cella CSV sicura: neutralizza la CSV-injection (un valore che inizia
// con = + - @ può eseguire formule aprendo il file in Excel/Calc) e
// mette tra virgolette i valori che contengono ; " o a capo.
export function csvCell(v) {
  let s = String(v == null ? "" : v);
  // Neutralizza la formula anche quando è preceduta da spazi/tab/ritorni a capo
  // (OWASP: pure TAB e CR fanno da innesco): "\t=cmd" deve restare testo.
  if (INNESCO_FORMULA.test(s)) s = "'" + s;  // apostrofo: la cella resta testo
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
  /* ⛔ LA CONDIZIONE È QUELLA CHE HA MESSO L'APOSTROFO, non una scritta a
     somiglianza. Qui c'era `/^'(?=[=+\-@])/`, che guarda UN carattere: quindi
     non toglieva la guardia dai tre casi che `csvCell` neutralizza di
     proposito — «\t=cmd», « =cmd», «\r=cmd», dove l'innesco è preceduto da uno
     spazio bianco (OWASP: pure TAB e CR fanno da innesco). Le prove c'erano su
     tutt'e tre, ma solo sull'ANDATA. */
  return out.map((v, i) => {
    if (v.startsWith("'") && INNESCO_FORMULA.test(v.slice(1))) v = v.slice(1);
    return quotato[i] ? v : v.trim();
  });
}

// LO STATO VUOTO, IN UN POSTO SOLO.
//
// Perché sta qui dal 31/07: la stessa funzione era scritta **sei volte**, una
// per app — e non erano uguali. Cinque prendono il **markup** dell'icona,
// Conti prende il suo **nome** e lo cerca in una tabella. È esattamente il
// difetto che la regola del fondatore vieta: una cosa che serve a sei app
// riscritta sei volte, che oggi si somigliano e domani no.
//
// E c'è un terzo pezzo che mancava a tutte e sei. Uno stato vuoto fatto bene
// dice tre cose: **cosa manca**, **a cosa serve** e **come si comincia**.
// Misurato: 99 stati vuoti nelle sei app, **zero** con un modo di cominciare.
// Chi apre l'app il primo giorno legge «Non hai ancora scadenze», capisce a
// cosa servono, e poi deve andarsi a cercare da solo dove si aggiungono.
//
// L'azione è **facoltativa** di proposito: ci sono stati vuoti che sono una
// buona notizia («Giornata tranquilla», «Nessun fermo registrato») e lì un
// bottone sarebbe rumore. Si mette dove chi guarda è **fermo**, non dove è
// contento.
export function statoVuoto(icona, titolo, spiegazione, azione) {
  return `<div class="empty-state"><div class="empty-icon">${icona}</div>
      <div class="empty-title">${titolo}</div><div class="empty-sub">${spiegazione}</div>${
    azione ? `<div class="empty-do">${azione}</div>` : ""}</div>`;
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
  /* ⛔ E UN NON-NUMERO NON DIVENTA UN NUMERO ENORME. `+"Infinity"` fa
     `Infinity`, e `+"1e999"` pure: due celle di un CSV che dal foglio di
     calcolo arrivano scritte così uscirebbero da qui come un valore che
     attraversa ogni confronto (`x > soglia` sempre vero) senza mai sembrare
     sbagliato. È esattamente il valore su cui il 01/08 le prove non sapevano
     distinguere «non calcolabile» da una divisione per zero. `numIt` promette
     un **numero misurato**: se non lo è, dice `NaN`, che tutti i lettori
     dell'ecosistema già trattano come «riga illeggibile». */
  const n = +s;
  return Number.isFinite(n) ? n : NaN;
}

// ⛔ LA FORMA DI UNA DATA NON È LA SUA ESISTENZA. Trovato il 03/08 in Scudo:
// l'import delle scadenze filtrava con `/^\d{4}-\d{2}-\d{2}$/`, e «2026-13-45»
// ha quella forma — entrava in archivio e restava verde per sempre.
// E `Date.parse` da solo non basta: «2026-02-30» NON è NaN, JavaScript lo fa
// scivolare al 2 marzo. Una scadenza spostata di due giorni in silenzio è
// peggio di una scartata a voce alta.
// Quindi si costruisce la data e si pretende che torni la STESSA: se i pezzi
// non tornano, quella data non esiste.
// Sta qui perché serve a due posti (l'import di Scudo e `statoScadenzaHSE` in
// `shared/dw-ponti.js`), e la regola del `shared/` dice che allora vive in un
// posto solo. docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
export function dataISOEsiste(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s == null ? "" : s).slice(0, 10));
  if (!m) return false;
  const a = +m[1], me = +m[2], g = +m[3];
  const d = new Date(Date.UTC(a, me - 1, g));
  return d.getUTCFullYear() === a && d.getUTCMonth() === me - 1 && d.getUTCDate() === g;
}

// Giorni di calendario tra `oggi` e una data ISO (yyyy-mm-dd). Normalizza
// ENTRAMBE le date alla mezzanotte LOCALE prima di sottrarre, così il conteggio
// non slitta di un giorno per colpa dell'ora corrente: con new Date() come
// "oggi", un floor darebbe -1 da mezzogiorno in poi (una scadenza di OGGI
// risulterebbe "scaduta" tutto il giorno). Usa round per essere robusto ai
// cambi di ora legale (giorni da 23/25 h). Positivo = nel futuro; NaN se la
// data non è valida (i chiamanti scartano/ignorano il NaN come prima).
/* ⛔ `new Date(dataISO + "T00:00:00")` SBAGLIAVA NEI DUE VERSI OPPOSTI, e questa
   funzione la usano **cinque app** (Conti, Flotta, Scudo, Sentinella, Terra).
   Misurato il 01/08 su 17 casi, 5 rispondevano diverso:
     · **inventava un numero per una data che non esiste** — «2026-02-30»
       (e «2026-02-29», che nel 2026 non c'è, e «2026-04-31») non vengono
       rifiutate da `Date`: vengono fatte **scorrere** al giorno dopo. Effetto
       in Conti, misurato: una fattura con scadenza 30 febbraio usciva
       «**insoluta da 152 giorni**» invece che «senza scadenza» — un ritardo
       inventato, e un cliente sollecitato per una data che non esiste;
     · **perdeva una data buona** — un ISTANTE («2026-06-30T10:00») diventava
       `…T10:00T00:00:00`, cioè `NaN`: la scadenza c'era e l'app rispondeva
       «senza scadenza».
   La funzione che sa la differenza (`dataISOEsiste`) è in questo stesso file
   **da mesi**: è di nuovo il caso in cui la risposta era già in casa. */
export function giorniTra(dataISO, oggi = new Date()) {
  const g = String(dataISO == null ? "" : dataISO).slice(0, 10);
  if (!dataISOEsiste(g)) return NaN;
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  return Math.round((new Date(g + "T00:00:00") - o) / 86400000);
}

// OGGI PIÙ N GIORNI, in ISO e in giorni di CALENDARIO LOCALI.
// Serve a Scudo (la prossima ispezione ricorrente, la scadenza proposta a
// un'azione correttiva) e a Sentinella (la scadenza di un'azione nata da un
// superamento o da un reclamo). Era scritta IDENTICA nei due moduli, e si era
// già staccata: su un valore non numerico una rispondeva `null` e l'altra `""`.
// ⛔ Irrigidita qui, una volta sola: `Number(null)` è **0**, quindi «nessun
// numero di giorni» diventava «scade oggi» — una scadenza che qualcuno firma.
// Adesso senza un numero vero la risposta è `null`, che vuol dire «non lo so».
export function dataPiuGiorni(giorni, oggi = new Date()) {
  if (giorni === null || giorni === undefined || String(giorni).trim() === "") return null;
  const n = Number(giorni);
  if (!Number.isFinite(n)) return null;
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + Math.round(n));
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// UNA DATA SCRITTA IN ISO LEGGENDO L'OROLOGIO LOCALE (aaaa-mm-gg).
// ⛔ Non si usa `toISOString()` per prendere il GIORNO di una data costruita in
// ora locale: `toISOString()` scrive sempre l'istante in UTC, e in Italia
// (UTC+1 d'inverno, UTC+2 d'estate) quell'istante sta una o due ore avanti.
// Mezzanotte del 1° maggio a Roma è ancora **le 22:00 del 30 aprile** a
// Greenwich, e `toISOString()` scrive appunto aprile.
// Costava, misurato il 31/07: il grafico «ultimi 6 mesi» del core riempiva la
// barra scritta «maggio» con la produzione di aprile — sempre, tutto l'anno,
// perché la chiave era UTC e l'etichetta locale; le scadenze delle fatture di
// Conti cadevano un giorno prima; e fra mezzanotte e le due — cioè durante il
// turno di notte — un rapportino veniva datato al giorno prima.
// Questa funzione stava scritta SEI volte nel progetto in TRE versioni: ora sta
// qui, e le app la ri-esportano. Vedi docs/RICERCA_GIORNO_LOCALE_202607.md.
/* L'ISTANTE in ora LOCALE, `AAAA-MM-GGTHH:MM:SS`. Serve dove due momenti dello
   STESSO GIORNO vanno messi in ordine — per esempio «questa voce è stata
   registrata dopo che il mese era già stato dichiarato completo»: con la sola
   data quel confronto è sempre falso, perché si chiude e si scrive lo stesso
   giorno.
   ⛔ Costruito dai getter LOCALI, mai da `toISOString()`: quello scrive
   l'istante a Greenwich, e in Italia attraversando la mezzanotte cambierebbe
   il GIORNO — è la trappola già raccolta in CLAUDE.md. Ordinabile come
   stringa, e i primi dieci caratteri restano il giorno locale.
   ⚠️ I SECONDI ci sono per necessità, non per precisione: al minuto due gesti
   fatti di seguito — chiudo il mese, mi accorgo di una bolletta, la registro —
   cadono nello stesso istante e l'ordine si perde. Col secondo l'ordine regge
   in tutti i casi che una persona può produrre. */
export function istanteLocale(d) {
  const t = d instanceof Date ? d : (d ? new Date(d) : new Date());
  if (Number.isNaN(t.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`
    + `T${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`;
}

export function isoLocale(d) {
  const t = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(t.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

// Il giorno di lavoro corrente in ISO, in ora locale. `adesso` iniettabile
// perché le prove non dipendano dall'orologio di chi le lancia.
export function oggiISO(adesso = new Date()) {
  return isoLocale(adesso);
}

// Il MESE di una data in ora locale (aaaa-mm): è la chiave con cui si
// raggruppano i grafici e gli export, e prenderla da `toISOString()` sposta
// ogni barra di un mese intero (vedi sopra).
export function meseLocale(d) {
  return isoLocale(d).slice(0, 7);
}

// Il TIMBRO «quando l'ho salvato» (aaaa-mm-gg hh:mm), in ora locale. Serve
// all'utente per distinguere due versioni della stessa cosa: preso da
// `toISOString()` mostrerebbe l'ora di Greenwich, cioè un salvataggio delle
// 15:00 scritto «13:00» — e a mezzanotte e mezza anche il giorno sbagliato.
export function timbroLocale(d = new Date()) {
  const t = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(t.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${isoLocale(t)} ${p(t.getHours())}:${p(t.getMinutes())}`;
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
// Le due frasi fisse degli avvisi sui numeri. Stanno QUI, esportate, perché
// erano ridichiarate alla lettera in quattro moduli dati — e quella delle
// migliaia si era già staccata: la copia di Flotta diceva anche COME si
// scrive («1250», non «1.250»), questa no. Vince la più utile.
// Misura e ragionamento: docs/NUMERI_MESSAGGIO_DOPPIO_202608.md
export const AVVISO_DECIMALE = "Va bene sia la virgola sia il punto: «2,4» e «2.4» sono lo stesso numero.";
export const AVVISO_MIGLIAIA = "Scrivilo senza il punto delle migliaia: «1250», non «1.250».";
const NUM_AVVISO_DEC = AVVISO_DECIMALE;
const NUM_AVVISO_MIG = AVVISO_MIGLIAIA;
export function messaggioNumero(r, cosa, opts = {}) {
  const q = "«" + String((r && r.grezzo) != null ? r.grezzo : "") + "»";
  const u = opts.unita ? " " + opts.unita : "";
  // ⛔ `useGrouping` esplicito: Node non raggruppa i numeri di quattro cifre e
  // Chromium sì. docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md
  const mostra = (v, dec = 2) => Number.isFinite(+v)
    ? (+v).toLocaleString("it-IT", { maximumFractionDigits: Math.max(0, dec), useGrouping: true }) : "";
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
/* ⛔ E LA TONNELLATA MANCAVA, da sola e in coda a un prezzo. Trovata dal
   cantiere degli ordini di Conti il 01/08 guardando lo scatto: «300,00 T»,
   «57,66 T di 300,00 T», «€ 11,50/T», «€ 4,20/M³» — la pastiglia è
   `text-transform: uppercase` e senza lo `<span class="u">` l'unità ci finisce
   dentro. Serve a tre app: Conti la scrive negli ordini, Terra nei volumi
   convertiti, Flotta nei consumi.
   ⚠️ «t» è una lettera sola, quindi la regola che la protegge è la stessa che
   protegge «h»: dev'esserci una CIFRA prima e non un carattere di parola dopo
   (`(?![\w³²])`). Così «12 tonnellate» e «il 3 turno» non vengono toccati —
   misurato prima di aggiungerla. */
const UNITA_DA_SALVARE = ["gg", "m³", "m²", "mm/s", "µg/m³", "mg/m³", "kg/m³",
  "kg/foro", "kg/m", "kg", "km/h", "km", "cm", "mm", "m³/h", "m³/giorno",
  "m³/anno", "t/m³", "l/h", "€/h", "/h", "h", "/m³", "/t", "t"];
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

/* ══════════════════════════════════════════════════════════════════════
   ALLEGATI — la graffetta accanto a un documento
   ══════════════════════════════════════════════════════════════════════
   Perché sta qui e non dentro un'app: la regola serve a DUE app (Scudo la
   usa per le scansioni firmate dei documenti, Sentinella per il documento
   che accompagna un adempimento verso l'ente), e una regola che serve a
   due app vive in `shared/` — è il difetto costato una giornata intera con
   la convenzione sui numeri.

   ⛔ IL LIMITE NON È UNA PIGNOLERIA: gli allegati viaggiano DENTRO il
   documento Firestore, che ha un tetto di 1 MB. Oltre quel tetto non
   «viene male»: la scrittura viene rifiutata, e con essa tutto il record.
   400 KB è prudente perché il dataURL in base64 cresce di circa un terzo
   rispetto al file. Quando ci sarà lo storage del progetto live, il limite
   si alza in un posto solo.

   ⚠️ Qui c'è solo la parte PURA — «questo file va bene?» e «di che cosa è
   fatto questo dataURL?» — perché è quella che si può provare senza
   browser. `FileReader` e `URL.createObjectURL` restano nella pagina. */
export const LIMITE_ALLEGATO = 400 * 1024;

/* Prende un `File` (o qualunque cosa abbia `name` e `size`) e dice se si
   può allegare, con il motivo scritto perché la pagina possa spiegarlo.
   ⛔ Un file VUOTO non è un file piccolo: è un file che non contiene
   niente, e allegarlo vorrebbe dire mettere una graffetta che non apre
   nulla — un'altra forma dell'assenza spacciata per presenza. */
export function controllaAllegato(file, limite = LIMITE_ALLEGATO) {
  if (!file) return { ok: false, motivo: "nessuno", kb: 0, peso: "", nome: "" };
  const nome = String(file.name || "").trim();
  const size = +file.size;
  if (!nome) return { ok: false, motivo: "senza-nome", kb: 0, peso: "", nome: "" };
  if (!Number.isFinite(size)) return { ok: false, motivo: "dimensione-ignota", kb: 0, peso: "", nome };
  if (size <= 0) return { ok: false, motivo: "vuoto", kb: 0, peso: "0 KB", nome };
  const kb = Math.round(size / 1024);
  /* ⛔ «0 KB» E' IL NUMERO CON CUI QUESTA STESSA FUNZIONE DICE «VUOTO».
     Trovato provando davvero il modulo: una ricevuta di 23 byte si
     annunciava «Allegato: ricevuta.pdf (0 KB)», cioe' con la cifra che due
     righe piu' su vuol dire «non contiene niente». Il numero e' pure giusto
     — 23/1024 arrotonda a zero — ed e' proprio per questo che non si vede
     leggendo il codice. Il peso scritto e' un TESTO, non un numero: sotto il
     chilobyte dice «meno di 1 KB», che e' vero e non si confonde con nulla. */
  const peso = size < 1024 ? "meno di 1 KB" : kb + " KB";
  if (size > limite) return { ok: false, motivo: "troppo-grande", kb, peso, nome, limiteKb: Math.round(limite / 1024) };
  return { ok: true, motivo: "", kb, peso, nome };
}

/* La frase da mostrare, in italiano, per ogni motivo. Sta accanto alla
   funzione che produce i motivi: una mappa di stati deve coprire tutti gli
   stati che la sua funzione sa dire (regola 18 di run-stile). */
export function testoAllegatoRifiutato(esito) {
  const e = esito || {};
  switch (e.motivo) {
    case "nessuno":            return "Nessun file scelto.";
    case "senza-nome":         return "Questo file non ha un nome: non si può allegare.";
    case "dimensione-ignota":  return "Non riesco a leggere quanto pesa questo file: riprova a sceglierlo.";
    case "vuoto":              return "Il file è vuoto (0 KB): la graffetta non aprirebbe niente.";
    case "troppo-grande":      return `Allegato troppo grande (${e.peso}): serve una foto o una scansione sotto i ${e.limiteKb} KB.`;
    default:                   return "";
  }
}

/* Scompone un dataURL in tipo e contenuto. Torna `null` se dataURL non è —
   e non un tipo inventato, che manderebbe il browser ad aprire una cosa
   dichiarandola per quello che non è. */
export function pezziDataURL(s) {
  const t = String(s || "");
  const virgola = t.indexOf(",");
  if (!/^data:/.test(t) || virgola < 0) return null;
  const testa = t.slice(5, virgola);
  const base64 = /;base64$/i.test(testa);
  const mime = (testa.replace(/;base64$/i, "").split(";")[0] || "").trim() || "application/octet-stream";
  return { mime, base64, contenuto: t.slice(virgola + 1) };
}

/* ══════════════════════════════════════════════════════════════════════
   IL LETTORE DI CSV COMPLETO
   ══════════════════════════════════════════════════════════════════════
   Perché sta qui e non in Sentinella: serve a DUE app, e la regola che
   serve a due app vive in `shared/`. Ma la ragione vera è più concreta di
   una regola, ed è stata MISURATA il 01/08.

   `parseCsvLine` legge UNA riga, e va benissimo finché il file ha una riga
   per record. Un estratto conto bancario no: la descrizione lunga la banca
   la scrive **su più righe dentro le virgolette**. Su questo file

       21/07/2026;"BONIFICO DA CAVA ROSSI SRL
       SALDO FATTURA 2026/034";12.300,00

   il lettore riga-per-riga produce **due righe rotte** e le scarta tutt'e
   due: l'incasso da 12.300 € — l'unico movimento vero del file — sparisce.
   Lo scarto viene dichiarato, quindi non è silenzioso; ma il pagamento non
   si abbina, e la fattura resta aperta con la sua mora che corre.

   `leggiCsv` legge il testo INTERO come una macchina a stati, quindi
   l'a-capo dentro le virgolette è solo un carattere come gli altri.
   ⚠️ E decide il separatore **una volta su tutto il file**, non riga per
   riga: deciderlo per riga farebbe scivolare le colonne di una singola
   riga senza che nessuno se ne accorga. */


// ══════════════════════════════════════════════════════════════════════
// T1 · IMPORT DELLE LETTURE DALLO STRUMENTO
// Sismografi, fonometri e centraline esportano tutti un CSV, ma nessuno
// lo esporta uguale: cambia il separatore, cambia l'ordine delle colonne,
// cambia il formato della data. Per questo qui NON si indovina niente: il
// file viene letto in tabella grezza e poi è l'UTENTE a dire quale colonna
// è la data, quale l'ora e quale il valore. Nessun servizio esterno,
// nessuna libreria: il lettore è questo, sotto.
// ══════════════════════════════════════════════════════════════════════

// Separatore del file, deciso UNA volta su tutto il testo (non riga per
// riga): conta ; TAB e , che stanno FUORI dalle virgolette, e vince il più
// frequente con priorità al punto e virgola (l'export italiano di Excel e
// il nostro). Deciderlo per riga sarebbe un errore: una riga senza
// separatori sposterebbe tutte le colonne di quella riga.
function rilevaDelimTesto(t) {
  let q = false; const c = { ";": 0, "\t": 0, ",": 0 };
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === '"') { if (q && t[i + 1] === '"') i++; else q = !q; }
    else if (!q && (ch === ";" || ch === "\t" || ch === ",")) c[ch]++;
  }
  return c[";"] ? ";" : c["\t"] ? "\t" : ",";
}



// Legge un CSV intero in tabella (array di righe, ogni riga array di celle).
// Regge: separatore ; , o TAB · campi tra virgolette · virgolette doppie
// raddoppiate ("") · a capo DENTRO un campo quotato · BOM iniziale ·
// terminatori di riga Windows e Unix. Le righe completamente vuote spariscono.
// Ritorna { delim, righe }. Pura e testabile.
export function leggiCsv(testo) {
  const t = String(testo == null ? "" : testo).replace(/^\uFEFF/, "");
  if (!t.trim()) return { delim: ";", righe: [] };
  const delim = rilevaDelimTesto(t);
  const righe = [];
  let campo = "", riga = [], q = false;
  /* toglie l'apostrofo che `csvCell` mette davanti a `= + - @`, e SOLO quello:
     la condizione è la stessa costante che lo ha messo, non una seconda regola
     scritta a somiglianza. Un valore che comincia davvero per apostrofo
     («'ndrangheta», «'90») non viene toccato, perché quello che segue non è un
     innesco di formula. */
  const senzaGuardia = (s) => {
    const t = String(s).trim();
    return t.startsWith("'") && INNESCO_FORMULA.test(t.slice(1)) ? t.slice(1) : t;
  };
  const chiudiRiga = () => {
    riga.push(campo); campo = "";
    if (riga.some(x => String(x).trim() !== "")) righe.push(riga.map(senzaGuardia));
    riga = [];
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { campo += '"'; i++; } else q = false; }
      else campo += c;
    } else if (c === '"') q = true;
    else if (c === delim) { riga.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; chiudiRiga(); }
    else campo += c;
  }
  chiudiRiga();
  return { delim, righe };
}

/* LA DATA COME SI SCRIVE IN ITALIA
   ══════════════════════════════════════════════════════════════════════
   Sei pagine su sei se la scrivevano da sole, con quattro nomi diversi
   (`dmy`, `fmtD`, `fmtData`, `dataIt`) e — misurato il 01/08 — con
   comportamenti diversi su **quattro casi su sette**:

     valore passato        campo        conti/scudo/sentinella   terra
     ""                    senza data   —                        —
     "2026-13-45"          45/13/2026   45/13/2026               45/13/2026
     "2026-02-30"          30/02/2026   30/02/2026               30/02/2026
     "2026-07-31T10:00"    31/07/2026   31T10:00/07/2026         —

   ⛔ E DUE DI QUELLE RIGHE SONO DIFETTI CHE L'UTENTE VEDE.
   «30/02/2026» e «45/13/2026» sono date che **non esistono**, stampate
   come se fossero fatti: è il principio del fondatore rovesciato — non un
   dato mancante spacciato per buono, ma un dato **sbagliato** spacciato
   per certo. E «31T10:00/07/2026» è spazzatura a schermo, che compariva
   ogni volta che a una di quelle funzioni arrivava un istante invece di
   un giorno.
   Il difetto veniva da `split("-").reverse().join("/")`, che non guarda
   che cosa sta girando: gira e basta.

   Qui la data si valida con `dataISOEsiste` — la stessa che rifiuta il 30
   febbraio nelle scadenze — e si taglia ai primi dieci caratteri, così un
   istante diventa il suo giorno invece di spazzatura.

   ⚠️ La parola per il vuoto resta **un parametro**, e non è pigrizia: è
   una scelta di prodotto che le app hanno già fatto in modo diverso.
   «senza data» è il termine che l'ecosistema usa in tre app quando la
   mancanza di un giorno è essa stessa un'informazione (una scadenza senza
   data va datata); «—» è quello giusto in una tabella dove la colonna può
   legittimamente essere vuota. Unificare anche quello sarebbe stato
   decidere al posto di sei schermate, di straforo. */
export function dataIt(iso, vuoto = "—") {
  const s = String(iso == null ? "" : iso).slice(0, 10);
  return dataISOEsiste(s) ? s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4) : vuoto;
}

/* ── QUANDO IL DATABASE NON RISPONDE: DIRE QUELLO CHE SI SA, NON DI PIÙ ──
   ⛔ Nasce dal 02/08, il giorno in cui il fondatore ha chiuso le regole del
   Firebase pubblico. Da quel momento il core cade sempre nel suo ripiego
   (`initDBOfflineFallback`) e mostrava a chiunque:

       «⚠ Modalità degradata — connessione database non disponibile»

   Due cose sbagliate in una riga sola. La prima è che **era falsa**: la
   connessione c'era, erano le regole a dire di no — e a dirlo di proposito.
   La seconda è più grave e c'era anche prima: la frase parla del *database*
   e non dice mai al **cavatore** la cosa che lo riguarda, cioè che da lì in
   poi tutto quello che scrive **non viene salvato**. Uno può compilare un
   rapportino intero e perderlo al ricaricamento della pagina.

   Quindi: la coda del messaggio è la stessa nei tre casi, perché è la sola
   parte che cambia qualcosa per chi la legge; la testa dice la causa solo
   quando si sa davvero.

   ⚠️ E la causa **non sempre si sa**, per una ragione che va scritta prima
   che qualcuno la «migliori»: un `permission-denied` lo restituisce sia un
   database chiuso di proposito sia una configurazione sbagliata (progetto
   che non esiste, chiave di un altro progetto). Quello che si può affermare
   è «questo accesso non è consentito», NON «va tutto bene, è la
   dimostrazione». Dire la seconda sarebbe la faccia tranquilla su un dato
   che nessuno ha misurato — il difetto che questa settimana togliamo dal
   prodotto, rifatto nel messaggio che lo racconta.

   La bandiera `certo` dichiara proprio quello, e la legge questa funzione
   stessa scegliendo fra «Database non raggiungibile» (non lo sappiamo) e la
   causa detta per nome (lo sappiamo). */
export function motivoDatiNonSalvati(errore, online = true) {
  // `_` oltre a `-`: l'SDK JS scrive `permission-denied`, l'API REST
  // `PERMISSION_DENIED`. Il prototipo sbagliava proprio questo caso.
  const codice = String((errore && (errore.code || errore.codice)) || "")
    .toLowerCase()
    .replace(/_/g, "-");
  const testo = String((errore && errore.message) || "").toLowerCase();

  let causa = "ignota";
  if (online === false) causa = "rete"; // se l'app SA di essere offline, vince
  else if (codice === "permission-denied" || codice === "unauthenticated") causa = "accesso";
  else if (codice === "unavailable" || codice === "deadline-exceeded" || codice === "cancelled") causa = "rete";
  else if (/failed to fetch|networkerror|network error|err_internet|offline/.test(testo)) causa = "rete";

  const certo = causa !== "ignota";
  const CODA = "quello che scrivi non viene salvato";
  const messaggio = !certo
    ? "⚠ Database non raggiungibile — " + CODA
    : causa === "accesso"
      ? "🔒 Accesso al database non consentito — " + CODA
      : "⚠ Nessun collegamento al database — " + CODA;

  return { causa, certo, messaggio, tono: causa === "accesso" ? "info" : "err" };
}

/* ⛔ CHE COSA DI UN RAPPORTINO È STATO MISURATO DAVVERO.
   Nata il 03/08 da un difetto che si vede su un documento che **esce
   dall'azienda**: il PDF del rapportino stampa «Fori: 0 · Metri: 0,0 · Media
   foro: 0,00 m · Mc: 0,0» per un turno in cui nessuno ha misurato un solo
   foro. Il modulo di inserimento la cosa giusta la fa già — il riquadro dei
   totali scrive «—» e l'anteprima «nessun foro misurato» — ma quello che
   finisce nel documento e nelle liste sono quattro zeri, cioè la cifra più
   tranquilla della scala su un turno di cui non si sa niente.

   ⚠️ E IL CASO PEGGIORE NON È QUELLO, perché quello almeno è coerente: è il
   rapportino **misurato per bene e senza maglia**. La maglia è un campo
   libero e opzionale (`validaRapp`: «tutti i campi sono opzionali»), e senza
   di lei `parseMaglia` risponde `B=0, S=0`, quindi `mc = media × fori × 0 × 0
   × 0.9` fa **zero**. Venti fori, sessanta metri perforati, e il volume in
   ballo scritto «0,0 mc» accanto ai fori veri: qui lo zero non è nemmeno la
   conseguenza di un dato mancante evidente, è il prodotto di una
   moltiplicazione per un campo che l'utente non era tenuto a compilare.

   Le due domande sono separate perché sono separate nel mestiere:
   · `misurato`   — qualcuno ha misurato almeno un foro?
   · `calcolabile` — c'è abbastanza per dire il volume in ballo?
   Un rapportino può essere misuratissimo e avere il volume non calcolabile.

   ⚠️ `mc` positivo scritto da una versione precedente si **tiene**, anche
   senza `maglia_B`/`maglia_S`: quei due campi sono nati dopo, e cancellare un
   volume vero per l'assenza di un campo che allora non si scriveva sarebbe
   l'errore opposto — buttare via una misura. Si spegne solo lo **zero** che
   nessuna maglia può giustificare. */
const _numRapp = (v) => (v === null || v === undefined || v === ""
                         || typeof v === "boolean" || !Number.isFinite(+v)) ? null : +v;
export function misureRapportino(r) {
  const o = r || {};
  const fori = _numRapp(o.fori);
  const misurato = fori !== null && fori > 0;
  const metri = misurato ? _numRapp(o.metri) : null;
  const scritta = misurato ? _numRapp(o.media_prof) : null;
  /* la media salvata se c'è ed è vera, se no la si rifà dai metri: `media_prof`
     vale 0 proprio sui rapportini che questo controllo esiste per prendere */
  const mediaProf = !misurato ? null
    : (scritta !== null && scritta > 0 ? scritta
       : (metri !== null && metri > 0 ? metri / fori : null));
  const B = _numRapp(o.maglia_B), S = _numRapp(o.maglia_S);
  const magliaNota = B !== null && B > 0 && S !== null && S > 0;
  const grezzo = misurato ? _numRapp(o.mc) : null;
  const mc = grezzo === null ? null : (grezzo === 0 && !magliaNota ? null : grezzo);
  return { misurato, calcolabile: mc !== null, magliaNota, fori, metri, mediaProf, mc };
}

/* Il totale di una lista di rapportini, con dichiarato **che cosa è rimasto
   fuori**. Sommare `r.mc || 0` è il modo in cui un turno non misurato entra in
   un totale valendo zero: il totale scende e nessuno lo sa. Qui i turni che
   non sanno dire il volume non entrano nella somma, ed escono contati.
   ⛔ E se nessuno sa dirlo, il totale è `null`, non zero: è il principio del
   fondatore applicato alla somma invece che alla singola riga. */
export function totaliRapportini(righe) {
  const m = (Array.isArray(righe) ? righe : []).map(misureRapportino);
  const conMc = m.filter((x) => x.calcolabile);
  const conMetri = m.filter((x) => x.metri !== null);
  return {
    su: m.length,
    mc: conMc.length ? conMc.reduce((s, x) => s + x.mc, 0) : null,
    metri: conMetri.length ? conMetri.reduce((s, x) => s + x.metri, 0) : null,
    fori: m.reduce((s, x) => s + (x.fori || 0), 0),
    senzaMisura: m.filter((x) => !x.misurato).length,
    senzaVolume: m.filter((x) => x.misurato && !x.calcolabile).length,
    calcolabile: conMc.length > 0,
  };
}

/* ⛔ E LO STESSO VALE PER IL RAPPORTINO DEL FOCHINO, sui chili di esplosivo —
   che è il numero più sorvegliato di tutta l'app: ci stanno dietro
   l'autorizzazione, il registro del deposito e la denuncia.
   `inviaRappFoc` accetta un foro come «valido» se ha l'esplosivo **o**
   l'innesco (`f.esplosivo||f.esplosivo2||f.innesco`), e i chili li somma con
   `parseNum0(f.kg)||0`: una volata con dodici fori caricati e la colonna dei
   chili lasciata in bianco viene salvata `tot_kg: 0` e mostrata «0 kg».
   Zero chili su una volata **non è una volata a vuoto**: è una volata di cui
   nessuno ha scritto quanto ha caricato, e sono due cose che a un controllo
   rispondono in modo opposto.

   ⚠️ E c'è un secondo caso, che è quello a metà: se **alcuni** fori dichiarano
   i chili e altri no, il totale è vero ma è un **minimo**. Si dichiara
   `parziale`, con la stessa convenzione dell'«almeno X kg» di Sentinella —
   perché la somma non è sbagliata, è incompleta, e le due cose si raccontano
   diverse.

   ⚠️ Il ripiego sul dettaglio (`daiFori`) c'è per il caso in cui il totale
   salvato non si legga ma i fori sì: buttare via chili scritti a mano sarebbe
   l'errore opposto a quello che questa funzione esiste per togliere. */
export function misureVolataFochino(r) {
  const o = r || {};
  const dett = Array.isArray(o.fori_dettaglio) ? o.fori_dettaglio : [];
  const n = _numRapp(o.fori);
  const conKg = dett.filter((f) => { const k = _numRapp(f && f.kg); return k !== null && k > 0; }).length;
  const senzaKg = Math.max(0, dett.length - conKg);
  const grezzo = _numRapp(o.tot_kg);
  const daiFori = conKg
    ? dett.reduce((s, f) => { const k = _numRapp(f && f.kg); return s + (k !== null && k > 0 ? k : 0); }, 0)
    : null;
  const kg = (grezzo !== null && grezzo > 0) ? grezzo : daiFori;
  return { fori: n === null ? dett.length : n, kg, dichiarato: kg !== null,
           conKg, senzaKg, parziale: kg !== null && senzaKg > 0 };
}

/* ⛔ E LA TERZA È LA PIÙ NETTA DELLE TRE: LA FRAMMENTAZIONE POST-VOLATA.
   Misurato il 03/08 premendo il bottone. La scheda a schermo, quando nessuno
   ha valutato niente, **tace**: il riquadro dell'indice oversize sta dentro un
   `overPct>0 ? ... : ''`, e il totale si spegne in grigio. Il PDF che esce
   dallo stesso pannello stampava invece, sempre e comunque,
   **«Indice oversize: 0% — ECCELLENTE»**, con le quattro classi a «0 %» e il
   totale a «0 %». Un giudizio di eccellenza su un cumulo che nessuno ha
   guardato, su un foglio che esce dall'azienda: il principio del fondatore
   (l'assenza di un dato non è un dato favorevole) nella sua forma più pura.

   Le domande sono tre e sono separate perché sono separate nel mestiere:
   · `valutata`    — qualcuno ha scritto almeno una classe?
   · `completa`    — le ha scritte tutte e quattro?
   · `attendibile` — la loro somma fa 100, cioè sono percentuali dello stesso
     cumulo? Un oversize del 2% su un totale dichiarato del 22% non si può
     confrontare con la soglia del 5%: non si sa di che cosa sia il 2%.
   ⚠️ `giudizio` è `null` quando l'oversize non è stato scritto, e NON quando
   vale zero: uno zero misurato è un'ottima notizia e va detta. È la stessa
   distinzione fra «0 kg» e «nessuno ha scritto quanto ha caricato».
   ⚠️ Le soglie (3% e 8%) sono quelle che la scheda usa già a schermo: qui non
   si decide niente di nuovo, si mette in un posto solo ciò che era scritto in
   due — ed erano scritte in due modi diversi. */
const _numFram = (v) => (v === null || v === undefined || v === ""
                         || typeof v === "boolean" || !Number.isFinite(+v) || +v < 0) ? null : +v;
export function misureFrammentazione(f) {
  const o = f || {};
  const classi = { fine: _numFram(o.fine), media: _numFram(o.media),
                   grossa: _numFram(o.grossa), oversize: _numFram(o.oversize) };
  const noti = Object.values(classi).filter((v) => v !== null);
  const valutata = noti.length > 0;
  const completa = noti.length === 4;
  const totale = valutata ? noti.reduce((s, v) => s + v, 0) : null;
  const attendibile = completa && Math.abs(totale - 100) < 0.5;
  const oversize = classi.oversize;
  const giudizio = oversize === null ? null
    : (oversize < 3 ? "eccellente" : (oversize < 8 ? "accettabile" : "critico"));
  return { classi, valutata, completa, attendibile, totale, oversize, giudizio,
           mancanti: Object.keys(classi).filter((k) => classi[k] === null) };
}

/* La frase che accompagna il giudizio, così che la scheda e il foglio stampato
   dicano **la stessa cosa**: era proprio la loro differenza il difetto. */
export function riservaFrammentazione(m) {
  if (!m || !m.valutata) return "nessuna classe granulometrica è stata valutata";
  if (!m.completa) return `distribuzione incompleta: manca ${m.mancanti.join(", ")}`;
  if (!m.attendibile) return `le quattro classi sommano ${m.totale}%, non 100%: le percentuali non sono confrontabili`;
  return "";
}

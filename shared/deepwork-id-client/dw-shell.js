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

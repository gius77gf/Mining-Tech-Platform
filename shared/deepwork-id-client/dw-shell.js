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
  if (/^[=+\-@]/.test(s)) s = "'" + s;                 // apostrofo: la cella resta testo
  if (/[;"\n\r]/.test(s)) s = '"' + s.replaceAll('"', '""') + '"';
  return s;
}

// Legge UNA riga CSV rispettando le virgolette: così un campo come
// "Rossi;Mario" (col separatore dentro) resta un valore solo e non
// spacca le colonne. Toglie anche l'apostrofo di guardia che csvCell
// mette davanti a = + - @, così l'export si può re-importare identico.
// Delimitatore: preferisce ; (default Excel italiano e nostro export),
// poi TAB, poi virgola.
export function parseCsvLine(line) {
  const delim = line.includes(";") ? ";" : (line.includes("\t") ? "\t" : ",");
  const out = [];
  let cur = "", q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }   // "" = virgoletta letterale
        else q = false;
      } else cur += c;
    } else if (c === '"') {
      q = true;
    } else if (c === delim) {
      out.push(cur); cur = "";
    } else cur += c;
  }
  out.push(cur);
  // rimuove l'apostrofo di guardia SOLO se davanti a un carattere di
  // formula: un nome che inizia davvero con ' non viene toccato.
  return out.map(v => v.replace(/^'(?=[=+\-@])/, "").trim());
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

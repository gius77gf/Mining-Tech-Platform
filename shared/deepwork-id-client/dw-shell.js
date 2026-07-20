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

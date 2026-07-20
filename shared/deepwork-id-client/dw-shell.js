// ============================================================
// Helper condiviso della shell: pulsante "Esci" coerente su
// tutte le pagine app (D2). Compare SOLO in modalità live —
// in demo/tour non c'è nessun account da cui uscire.
// Uso (dopo aver creato il data layer):
//   import { mountExit } from "../../shared/deepwork-id-client/dw-shell.js";
//   mountExit(db);   // db = risultato di xxxData()
// ============================================================

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

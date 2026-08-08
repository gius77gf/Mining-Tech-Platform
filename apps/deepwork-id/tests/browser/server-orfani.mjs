/* ⚠️ NON APRE NESSUN BROWSER e non tocca il prodotto: è la CONTROPROVA della
   guardia che `tutti.mjs` monta all'avvio contro i **server orfani**. Sta in
   `npm test` perché una guardia che non gira è una guardia che non c'è, ed è la
   lezione che questo repository ha già pagato più volte.
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL SERVER DI UN GIRO MORTO TIENE LA PORTA E SERVE UNA CARTELLA CANCELLATA.
   Misurato l'08/08: fermato un giro lungo, il successivo si è rifiutato di
   partire — «non riesco ad alzare un server statico sulla porta 8823» — e il
   colpevole era il `python3 -m http.server` del giro ucciso, ancora vivo, con
   `cwd = /home/user/giro-copia-16814 (deleted)`. È l'orfano che CLAUDE.md
   descrive: risponde, ma con 404 su tutto.
   Il criterio della guardia è preciso e non può sbagliare bersaglio: **solo la
   nostra porta**, e solo se la cartella servita **non esiste più**. Un giro
   VIVO ha una cwd che esiste, quindi non viene toccato.
   ⚠️ Questa controprova è scritta in node e non in shell perché le due sonde
   in shell che l'hanno preceduta hanno sbagliato **tutt'e due**: un `cd` dentro
   una catena messa in background non vale per il processo che parte, e `pgrep`
   conta anche sé stesso. I pid si prendono da chi li genera.
   ══════════════════════════════════════════════════════════════════════════
   Uso:  node apps/deepwork-id/tests/browser/server-orfani.mjs               */
import { spawn, execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/* una cartella temporanea propria: due porte dedicate, e si toglie sempre */
const BASE = join(tmpdir(), "dw-server-orfani-" + process.pid);
mkdirSync(BASE + "/muore", { recursive: true });
mkdirSync(BASE + "/vive", { recursive: true });

const alza = (dir, porta) => spawn("python3", ["-m", "http.server", String(porta)],
  { cwd: dir, stdio: "ignore", detached: true });
const morto = alza(BASE + "/muore", 8991);
const vivo = alza(BASE + "/vive", 8992);
await new Promise((r) => setTimeout(r, 1500));

/* si cancella la cartella di UNO dei due: è esattamente quello che succede
   quando un giro viene ucciso e la sua worktree viene tolta */
rmSync(BASE + "/muore", { recursive: true, force: true });
await new Promise((r) => setTimeout(r, 500));

const cwd = (pid) => { try { return readlinkSync(`/proc/${pid}/cwd`); } catch { return "(morto)"; } };
console.log(`orfano  pid=${morto.pid}  cwd=${cwd(morto.pid)}`);
console.log(`sano    pid=${vivo.pid}  cwd=${cwd(vivo.pid)}`);

/* ⚠️ la guardia è COPIATA parola per parola da `tutti.mjs`, e va detto: se un
   giorno quella cambia, questa non se ne accorge. Non è un alias — il runner
   non esporta niente — quindi il legame è dichiarato qui invece che finto. */
function togliServerOrfano(porta) {
  let tolti = 0;
  try {
    const su = execFileSync("ps", ["-eo", "pid=,args="], { encoding: "utf8" });
    for (const r of su.split("\n")) {
      const m = /^\s*(\d+)\s+(.*http\.server\s+\d+.*)$/.exec(r);
      if (!m || !new RegExp(`http\\.server\\s+${porta}(\\s|$)`).test(m[2])) continue;
      let c = "";
      try { c = readlinkSync(`/proc/${m[1]}/cwd`); } catch (e) { continue; }
      if (!c.endsWith(" (deleted)")) continue;
      try { process.kill(Number(m[1]), "SIGKILL"); tolti++; } catch (e) { /* già morto */ }
    }
  } catch (e) { /* niente ps */ }
  return tolti;
}

const a = togliServerOrfano(8991);
const b = togliServerOrfano(8992);
await new Promise((r) => setTimeout(r, 500));
const vivoAncora = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

const male = [];
if (a !== 1) male.push(`sulla porta dell'orfano doveva toglierne 1, ne ha tolti ${a}`);
if (b !== 0) male.push(`sulla porta del server SANO non doveva toglierne nessuno, ne ha tolti ${b}`);
if (vivoAncora(morto.pid)) male.push("l'orfano è ancora vivo");
if (!vivoAncora(vivo.pid)) male.push("⛔ il server SANO è stato ucciso: la guardia sbaglia bersaglio");

try { process.kill(vivo.pid, "SIGKILL"); } catch (e) {}
rmSync(BASE, { recursive: true, force: true });
console.log(male.length
  ? "⛔ NON DISTINGUE:\n  " + male.join("\n  ")
  : "✔ la guardia distingue: toglie il server con la cartella cancellata, lascia quello sano");
process.exit(male.length ? 1 : 0);

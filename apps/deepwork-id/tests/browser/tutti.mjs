/* TUTTI I BANCHI DEL BROWSER, CON UN COMANDO SOLO.
   I banchi qui dentro non girano in CI (servono Chromium e un server statico) e
   quindi girano solo se qualcuno se li ricorda. Un elenco che sta nella testa di
   chi l'ha scritto, alla settimana dopo non esiste: questo file è l'elenco.

   Fa anche una cosa che nessuno dei banchi può fare da solo: **alza il server
   statico se non risponde**, così il comando funziona anche a freddo. Il motivo
   non è comodità — è che un banco che chiede una condizione non ovvia viene
   lanciato una volta e poi mai più.

   Uso:
     node apps/deepwork-id/tests/browser/tutti.mjs          (alza il server da sé)
     node apps/deepwork-id/tests/browser/tutti.mjs 8823     (usa quello che c'è)
*/
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..', '..', '..', '..');

const BANCHI = [
  ['campi interi', 'interi-superfici.mjs', []],
  ['campi interi · controprova', 'interi-superfici.mjs', ['--senza-guardia'], true],
  ['contrasto', 'contrasto.mjs', []],
  ['contrasto · controprova', 'contrasto.mjs', ['--controprova'], true],
  ['unità in maiuscolo', 'unita-maiuscole.mjs', []],
  ['unità · controprova', 'unita-maiuscole.mjs', ['--controprova', '--solo=campo'], true],
  ['collegamenti della vetrina', 'vetrina-collegamenti.mjs', []],
  ['collegamenti · controprova', 'vetrina-collegamenti.mjs', ['--senza-ritorno'], true],
  ['programma partito · controprova', 'vetrina-collegamenti.mjs', ['--senza-programma'], true],
  ['doppia data', 'doppia-data.mjs', []],
  ['doppia data · controprova', 'doppia-data.mjs', ['--controprova'], true],
  ['striscia di stato dei riquadri', 'note-stato.mjs', []],
  ['striscia di stato · controprova', 'note-stato.mjs', ['--controprova'], true],
  ['niente fuori schermo', 'fuori-schermo.mjs', []],
  ['fuori schermo · controprova', 'fuori-schermo.mjs', ['--controprova', '--solo=sentinella'], true],
  ['id unici nella pagina viva', 'id-unici.mjs', []],
  ['id unici · controprova', 'id-unici.mjs', ['--controprova'], true],
  ['bersagli degli stati vuoti', 'vuoti-azione.mjs', []],
  ['bersagli · controprova', 'vuoti-azione.mjs', ['--controprova'], true],
  ['navigazione fra le pagine', 'navigazione.mjs', []],
  ['navigazione · controprova', 'navigazione.mjs', ['--senza-guardie'], true],
  ['sconto del cliente', 'sconto-cliente.mjs', []],
  ['sconto · controprova', 'sconto-cliente.mjs', ['--senza-cliente'], true],
];

async function rispondePorta(porta) {
  try {
    const r = await fetch(`http://127.0.0.1:${porta}/apps/index.html`, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch (e) { return false; }
}

async function aspetta(porta, secondi) {
  for (let i = 0; i < secondi * 4; i++) {
    if (await rispondePorta(porta)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

const PORTA = process.argv[2] || '8823';
let server = null;
if (!(await rispondePorta(PORTA))) {
  console.log(`Il server sulla porta ${PORTA} non risponde: lo alzo io.`);
  server = spawn('python3', ['-m', 'http.server', PORTA], { cwd: RADICE, stdio: 'ignore', detached: true });
  if (!(await aspetta(PORTA, 12))) {
    console.error(`✗ non riesco ad alzare un server statico sulla porta ${PORTA}.`);
    process.exit(2);
  }
}

const esiti = [];
for (const [nome, file, argomenti, eControprova] of BANCHI) {
  console.log(`\n════════ ${nome} ════════`);
  const codice = await new Promise((ok) => {
    const p = spawn(process.execPath, [join(QUI, file), PORTA, ...argomenti], { stdio: 'inherit' });
    p.on('close', ok);
  });
  /* una controprova riuscita esce con 0 perché ha fallito come doveva: il
     banco stesso gira il verdetto, qui basta leggerlo */
  esiti.push({ nome, ok: codice === 0, eControprova: !!eControprova });
}

if (server) { try { process.kill(-server.pid); } catch (e) { /* già morto */ } }

console.log('\n════════ RIEPILOGO ════════');
for (const e of esiti) console.log(`  ${e.ok ? 'ok ' : 'KO '} ${e.nome}`);
const caduti = esiti.filter((e) => !e.ok);
console.log(`\n${esiti.length - caduti.length} banchi a posto, ${caduti.length} da guardare`);
process.exit(caduti.length ? 1 : 0);

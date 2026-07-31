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
import { impronta, differenze } from './impronta.mjs';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..', '..', '..', '..');

/* ⚠️ IL GIRO SI ACCORGE DA SÉ SE GLI HANNO CAMBIATO IL CODICE SOTTO.
   `CLAUDE.md` vieta di modificare moduli dati e pagine mentre un giro gira: le
   sue misure diventano false. La regola è scritta — ed è stata violata due
   volte in due giorni da chi l'aveva scritta. Adesso è un controllo: l'impronta
   si prende prima, dopo ogni banco e alla fine, e se qualcosa cambia il giro
   dichiara sé stesso NON VALIDO invece di stampare un riepilogo verde.
   Il perché di «dopo ogni banco» e non solo alla fine: così si sa **quali**
   banchi hanno misurato il codice giusto e quali no, invece di buttare
   venticinque banchi per una modifica arrivata all'ultimo. */
const RADICE_IMPRONTA = (process.argv.find((a) => a.startsWith('--radice-impronta=')) || '').split('=')[1] || RADICE;
const BANCHI_FINTI = process.argv.includes('--banchi-finti');   // solo per la controprova della guardia

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
  ['quali punti conta la nuvola', 'punti-nuvola.mjs', []],
  ['punti della nuvola · controprova', 'punti-nuvola.mjs', ['--conto-unico'], true],
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
/* i banchi finti non aprono niente: servono solo a provare la guardia
   dell'impronta, e alzare un server per loro li renderebbe inadatti alla CI */
if (!BANCHI_FINTI && !(await rispondePorta(PORTA))) {
  console.log(`Il server sulla porta ${PORTA} non risponde: lo alzo io.`);
  server = spawn('python3', ['-m', 'http.server', PORTA], { cwd: RADICE, stdio: 'ignore', detached: true });
  if (!(await aspetta(PORTA, 12))) {
    console.error(`✗ non riesco ad alzare un server statico sulla porta ${PORTA}.`);
    process.exit(2);
  }
}

let base = impronta(RADICE_IMPRONTA);
console.log(`Impronta di partenza: ${base.size} file che le pagine caricano (test, docs e vault esclusi apposta).`);
const cambiamenti = [];

const DA_FARE = BANCHI_FINTI
  ? [['finto 1', null, []], ['finto 2', null, []], ['finto 3', null, []]]
  : BANCHI;

const esiti = [];
for (const [nome, file, argomenti, eControprova] of DA_FARE) {
  console.log(`\n════════ ${nome} ════════`);
  const codice = await new Promise((ok) => {
    const p = file
      ? spawn(process.execPath, [join(QUI, file), PORTA, ...argomenti], { stdio: 'inherit' })
      : spawn(process.execPath, ['-e', 'setTimeout(() => {}, 600)'], { stdio: 'inherit' });
    p.on('close', ok);
  });
  /* una controprova riuscita esce con 0 perché ha fallito come doveva: il
     banco stesso gira il verdetto, qui basta leggerlo */
  esiti.push({ nome, ok: codice === 0, eControprova: !!eControprova });

  /* e subito dopo: qualcuno ha toccato il codice mentre questo banco girava? */
  const d = differenze(base, impronta(RADICE_IMPRONTA));
  if (d.length) {
    console.log(`\n  ⚠️  IL CODICE È CAMBIATO DURANTE «${nome}»: ${d.length} file`);
    for (const x of d.slice(0, 8)) console.log(`      ${x.come}: ${x.file}`);
    if (d.length > 8) console.log(`      … e altri ${d.length - 8}`);
    cambiamenti.push({ dopo: nome, quanti: d.length, file: d.map((x) => x.file) });
    base = impronta(RADICE_IMPRONTA);   // si riparte da qui, se no ogni banco ripete lo stesso avviso
  }
}

if (server) { try { process.kill(-server.pid); } catch (e) { /* già morto */ } }

console.log('\n════════ RIEPILOGO ════════');
for (const e of esiti) console.log(`  ${e.ok ? 'ok ' : 'KO '} ${e.nome}`);
const caduti = esiti.filter((e) => !e.ok);
console.log(`\n${esiti.length - caduti.length} banchi a posto, ${caduti.length} da guardare`);

if (cambiamenti.length) {
  /* ⛔ Il verdetto NON è «ci sono anche dei cambiamenti»: è che il giro non
     vale. Un riepilogo verde con un avviso in mezzo verrebbe letto come verde —
     ed è il modo in cui questo difetto è passato le prime due volte. */
  const primo = cambiamenti[0];
  const indice = esiti.findIndex((e) => e.nome === primo.dopo);
  console.log(`\n⛔ GIRO NON VALIDO: il codice che le pagine caricano è cambiato mentre girava.`);
  for (const c of cambiamenti) console.log(`   dopo «${c.dopo}»: ${c.quanti} file (${c.file.slice(0, 3).join(', ')}${c.file.length > 3 ? ', …' : ''})`);
  console.log(`   Hanno misurato il codice giusto solo i primi ${indice + 1} banchi su ${esiti.length}.`);
  console.log(`   Va rilanciato a modifiche finite. (La regola sta in CLAUDE.md: mentre gira un giro`);
  console.log(`   si lavora su docs/, vault/ e le suite node — mai sui moduli dati e sulle pagine.)`);
  process.exit(2);
}
process.exit(caduti.length ? 1 : 0);

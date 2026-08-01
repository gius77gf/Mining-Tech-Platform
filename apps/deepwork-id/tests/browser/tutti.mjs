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
import { execFileSync } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';

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
  ['struttura di Genesi', 'genesi-struttura.mjs', []],
  ['struttura di Genesi · controprova', 'genesi-struttura.mjs', ['--prima'], true],
  ['nota di credito', 'nota-credito.mjs', []],
  ['nota di credito · controprova', 'nota-credito.mjs', ['--controprova'], true],
  ['il verbale dice come è nato il numero', 'verbale-origine.mjs', []],
  ['verbale · controprova', 'verbale-origine.mjs', ['--controprova'], true],
  ['la quota di base è nel sistema del rilievo', 'quota-base-reale.mjs', []],
  ['quota di base · controprova', 'quota-base-reale.mjs', ['--controprova'], true],
  ['il registro costi', 'registro-costi.mjs', []],
  ['registro costi · controprova', 'registro-costi.mjs', ['--controprova'], true],
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
const SU_COPIA = !process.argv.includes('--sulla-viva');

/* ══ IL GIRO GIRA SU UNA COPIA CONGELATA ═══════════════════════════════════
   Prima serviva la cartella VIVA, e per un'ora e mezza nessuno poteva
   toccarla: `impronta.mjs` proteggeva il risultato FERMANDO IL LAVORO. È una
   difesa, non una soluzione — e una regola che chiede di non lavorare per due
   ore viene violata, è già successo due volte in due giorni.
   Adesso i banchi servono una `git worktree` temporanea, immobile per
   costruzione. Vedi docs/PIANO_GIRO_SU_COPIA.md.

   ⛔ E la trappola che questo introduce, risolta prima di scrivere una riga:
   una worktree su HEAD contiene il COMMITTATO, non quello che c'è su disco.
   Con modifiche non committate il giro proverebbe codice diverso da quello che
   si sta guardando, e uscirebbe VERDE su una versione che non esiste da
   nessuna parte. Quindi il giro DICHIARA su cosa sta girando, in cima e in
   fondo: un avviso stampato solo all'inizio, dopo un'ora e mezza di
   scorrimento, non l'ha letto nessuno. */
let COPIA = null, FUORI_DALLA_COPIA = [];
function nonCommittati() {
  try {
    return execFileSync('git', ['status', '--porcelain'], { cwd: RADICE, encoding: 'utf8' })
      .split('\n').map((r) => r.slice(3).trim()).filter(Boolean);
  } catch (e) { return []; }
}
function dichiaraSuCosaGira() {
  if (!COPIA) { console.log('▶ Il giro sta girando sulla CARTELLA VIVA: non toccare i file finché non finisce.'); return; }
  const hash = (() => { try { return execFileSync('git', ['rev-parse', '--short', 'HEAD'],
    { cwd: RADICE, encoding: 'utf8' }).trim(); } catch (e) { return '?'; } })();
  console.log(`▶ Il giro sta girando su una COPIA di ${hash} (il committato), non sulla cartella viva.`);
  if (FUORI_DALLA_COPIA.length) {
    console.log(`⚠️ ATTENZIONE: ${FUORI_DALLA_COPIA.length} file NON committati restano FUORI da quello che`);
    console.log('   il giro sta provando. Quello che vedi su disco NON è quello che è stato misurato:');
    for (const f of FUORI_DALLA_COPIA.slice(0, 12)) console.log(`   · ${f}`);
    if (FUORI_DALLA_COPIA.length > 12) console.log(`   · …e altri ${FUORI_DALLA_COPIA.length - 12}`);
  } else {
    console.log('  Niente di non committato: la copia è identica a quello che hai su disco.');
  }
}
if (SU_COPIA && !BANCHI_FINTI) {
  const dove = join(RADICE, '..', 'giro-copia-' + process.pid);
  try {
    if (existsSync(dove)) rmSync(dove, { recursive: true, force: true });
    execFileSync('git', ['worktree', 'add', '--detach', dove, 'HEAD'], { cwd: RADICE, stdio: 'ignore' });
    COPIA = dove;
    FUORI_DALLA_COPIA = nonCommittati();
    process.env.DW_RADICE = COPIA;   // i banchi che alzano un server loro
  } catch (e) {
    console.log('⚠️ non riesco a creare la copia (' + String(e.message).split('\n')[0] + '): giro sulla cartella viva.');
    COPIA = null;
  }
}
const SERVITA = COPIA || RADICE;
dichiaraSuCosaGira();
let server = null;
/* i banchi finti non aprono niente: servono solo a provare la guardia
   dell'impronta, e alzare un server per loro li renderebbe inadatti alla CI */
if (!BANCHI_FINTI && !(await rispondePorta(PORTA))) {
  console.log(`Il server sulla porta ${PORTA} non risponde: lo alzo io.`);
  server = spawn('python3', ['-m', 'http.server', PORTA], { cwd: SERVITA, stdio: 'ignore', detached: true });
  if (!(await aspetta(PORTA, 12))) {
    console.error(`✗ non riesco ad alzare un server statico sulla porta ${PORTA}.`);
    process.exit(2);
  }
}

let base = impronta(COPIA || RADICE_IMPRONTA);
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
  const d = differenze(base, impronta(COPIA || RADICE_IMPRONTA));
  if (d.length) {
    console.log(`\n  ⚠️  IL CODICE È CAMBIATO DURANTE «${nome}»: ${d.length} file`);
    for (const x of d.slice(0, 8)) console.log(`      ${x.come}: ${x.file}`);
    if (d.length > 8) console.log(`      … e altri ${d.length - 8}`);
    cambiamenti.push({ dopo: nome, quanti: d.length, file: d.map((x) => x.file) });
    base = impronta(COPIA || RADICE_IMPRONTA);   // si riparte da qui, se no ogni banco ripete lo stesso avviso
  }
}

if (server) { try { process.kill(-server.pid); } catch (e) { /* già morto */ } }
/* La copia si toglie SEMPRE, anche se il giro è caduto: una worktree lasciata
   in giro fa fallire la prossima creazione e nessuno capisce perché. */
function togliLaCopia() {
  if (!COPIA) return;
  try { execFileSync('git', ['worktree', 'remove', '--force', COPIA], { cwd: RADICE, stdio: 'ignore' }); }
  catch (e) { try { rmSync(COPIA, { recursive: true, force: true }); } catch (e2) {} }
  COPIA = null;
}

console.log('\n════════ RIEPILOGO ════════');
/* ⛔ La dichiarazione si RIPETE qui in fondo. Stampata solo in cima, dopo
   un'ora e mezza di scorrimento non l'ha letta nessuno — e il caso in cui
   serve davvero (ci sono file non committati, quindi il verde vale per una
   versione diversa da quella su disco) è proprio quello in cui si legge solo
   il riepilogo. */
dichiaraSuCosaGira();
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
  togliLaCopia();
  process.exit(2);
}
togliLaCopia();
process.exit(caduti.length ? 1 : 0);

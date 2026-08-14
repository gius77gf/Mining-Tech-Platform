/* LE PAGINE SI APRONO ANCORA? — dal COMMITTATO, non dal disco
   ══════════════════════════════════════════════════════════════════════
   Perché esiste, e la data conta: il 01/08 la pagina di **Scudo** è
   rimasta rotta per cinque commit. Committando il lavoro sugli allegati
   ho messo nell'indice `apps/scudo/index.html`, che un cantiere parallelo
   aveva toccato, **senza** `apps/scudo/scudo-data.js`, rimasto su disco.
   Da lì la pagina importava `daCampo`, un nome che nel committato non
   esisteva: elenco azioni vuoto, KPI tutti «—», e in console
   «does not provide an export named 'daCampo'».

   ⛔ E NESSUN CONTROLLO L'HA PRESO, per una ragione precisa e ripetibile:
     · le quindici suite `node` non importano le PAGINE — importano i
       moduli dati, che stavano benissimo;
     · `run-stile` legge il testo dei file, e un import sbagliato è
       sintatticamente perfetto;
     · il giro completo del browser l'avrebbe visto, ma dura un'ora o due
       e si lancia una volta per blocco;
     · e soprattutto: **su disco funzionava tutto**. Il difetto viveva
       solo nella differenza fra il disco e il committato — cioè esatta-
       mente dove nessuno guardava.

   Questo banco fa UNA domanda sola, sulla copia congelata di `HEAD`:
   *ogni superficie si apre senza errori di pagina?* Costa un minuto,
   quindi si può lanciare prima di ogni push invece che una volta al
   giorno. Non misura né estetica né comportamento: quello è il mestiere
   degli altri banchi.

   Uso:
     node apps/deepwork-id/tests/browser/pagine-vive.mjs
     node apps/deepwork-id/tests/browser/pagine-vive.mjs --disco       (la cartella viva)
     node apps/deepwork-id/tests/browser/pagine-vive.mjs --controprova (sa fallire?)
     node apps/deepwork-id/tests/browser/pagine-vive.mjs --solo=scudo */
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CHROMIUM, SUPERFICI, apriSuperficie, prendiChromium } from './giro.mjs';
/* il core importa Firebase da gstatic: senza rete il suo modulo non parte e
   restano i segnaposto. Si monta il finto, se no il banco accuserebbe il core
   di un difetto che è dell'ambiente. */
import { montaFintoFirebase } from './finto-firebase.mjs';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..', '..', '..', '..');
/* ⛔ DENTRO `tutti.mjs` QUESTO BANCO NON DEVE FARSI UNA COPIA SUA. Il giro
   completo serve già una worktree congelata e passa la porta come primo
   argomento nudo: farne una seconda vorrebbe dire una worktree dentro una
   worktree, e — peggio — misurare un commit diverso da quello che stanno
   misurando tutti gli altri banchi. Quindi: porta nuda in arrivo = si usa
   quello che c'è già. */
const PORTA_DA_GIRO = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const PORTA = +(PORTA_DA_GIRO || process.argv.find((a) => a.startsWith('--porta='))?.slice(8) || 8861);
const SOLO = process.argv.find((a) => a.startsWith('--solo='))?.slice(7) || '';
const SU_DISCO = process.argv.includes('--disco');
const CONTROPROVA = process.argv.includes('--controprova');

const scelte = SUPERFICI.filter(([n]) => !SOLO || n.includes(SOLO));
if (!scelte.length) { console.error(`Nessuna superficie contiene «${SOLO}».`); process.exit(2); }

/* ⛔ La copia è di HEAD, ed è il punto di tutto il banco: guardare il disco
   qui vorrebbe dire ripetere l'errore che ha lasciato Scudo rotto. */
let copia = null;
if (!SU_DISCO && !PORTA_DA_GIRO) {
  const dove = join(RADICE, '..', 'pagine-vive-' + process.pid);
  if (existsSync(dove)) rmSync(dove, { recursive: true, force: true });
  execFileSync('git', ['worktree', 'add', '--detach', dove, 'HEAD'], { cwd: RADICE, stdio: 'ignore' });
  copia = dove;
}
const servita = copia || RADICE;

/* Nella controprova si rompe UN import nella copia — non nel repo vero — e si
   pretende che il banco lo veda. Un banco che non sa fallire non dimostra
   niente, e questo in particolare deve saper vedere proprio la forma di
   difetto per cui è nato. */
let rotta = null;
if (CONTROPROVA) {
  if (!copia) { console.error('⛔ la controprova vuole la copia: non usarla con --disco.'); process.exit(2); }
  const f = join(copia, 'apps', 'scudo', 'index.html');
  const s = readFileSync(f, 'utf8');
  /* ⛔ IL NOME VA DENTRO LE GRAFFE. La prima stesura lo metteva DOPO
     (`} , unNome from "..."`), che è un errore di SINTASSI — una cosa diversa,
     e per giunta una che il browser riporta solo in console. Il difetto da
     riprodurre è quello vero: un nome che l'import chiede e il modulo non
     esporta. La controprova l'ha detto da sola: 14 su 14 verdi con l'import
     rotto. */
  const m = /(\w+)(\s*\}\s*from\s*"\.\/scudo-data\.js";)/.exec(s);
  if (!m) { console.error('⛔ non trovo l\'import di scudo-data: la controprova non ha iniettato niente.'); process.exit(2); }
  const t = s.replace(m[0], m[1] + ', unNomeCheNonEsisteDavvero' + m[2]);
  if (t === s) { console.error('⛔ l\'iniezione non ha cambiato niente.'); process.exit(2); }
  writeFileSync(f, t);
  rotta = 'scudo';
  console.log(`controprova: rotto 1 import in apps/scudo/index.html (${t.length - s.length} caratteri)\n`);
}

const aspetta = async (n) => { for (let i = 0; i < n * 5; i++) {
  try { const r = await fetch(`http://127.0.0.1:${PORTA}/`); if (r) return true; } catch (e) {}
  await new Promise((r) => setTimeout(r, 200)); } return false; };
const gia = await aspetta(1);
const server = gia ? null
  : spawn('python3', ['-m', 'http.server', PORTA], { cwd: servita, stdio: 'ignore', detached: true });
if (!gia && !(await aspetta(12))) { console.error(`✗ il server sulla porta ${PORTA} non risponde.`); process.exit(2); }

const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: RADICE, encoding: 'utf8' }).trim();
const dove = copia ? `una copia congelata di ${commit}`
  : PORTA_DA_GIRO ? `la copia che sta servendo il giro (porta ${PORTA})` : 'la cartella VIVA';
console.log(`Le pagine si aprono? — ${scelte.length} superfici, da ${dove}\n`);

/* Playwright non è una dipendenza del repo: si prende dal posto in cui sta,
   e la regola vive già in `giro.mjs`. */
const chromium = await prendiChromium();
const browser = await chromium.launch({ executablePath: CHROMIUM });
const guasti = [];
let aperte = 0;

for (const [nome, via] of scelte) {
  const { ctx, p, errori } = await apriSuperficie(browser, {
    nome, via, porta: PORTA, montaFintoFirebase,
  });
  /* ⛔ NON BASTA `pageerror`. Un modulo che non si carica non sempre alza
     un'eccezione di pagina: certi errori di import il browser li scrive solo
     in console, e la pagina resta lì col suo markup statico — che nelle app è
     ricco, quindi il conto degli elementi non se ne accorge. Si guardano
     anche i messaggi di console CHE PARLANO DI MODULI: gli altri no, se no il
     banco annegherebbe negli errori di rete di Firebase, che qui sono attesi. */
  /* ⚠️ E IL FILTRO E' STATO STRETTO DOPO AVERLO MISURATO. La prima versione
     comprendeva `Failed to load|fetch`, e cosi' la controprova cadeva — ma per
     gli ERRORI DI RETE (gstatic, Firebase, il tunnel), che qui sono attesi e
     non c'entrano niente. Una controprova che cade per la ragione sbagliata
     e' verde quanto una che non cade: dimostra che il banco sa fallire, non
     che sa vedere il difetto. Adesso si cercano solo le frasi con cui i
     browser dicono che un MODULO non si e' potuto legare. */
  const diModulo = /does not provide an export|Cannot find module|Failed to resolve module|Unexpected token|SyntaxError|dynamically imported module|is not defined/i;
  const console_ = [];
  p.on('console', (m) => { if (m.type() === 'error' && diModulo.test(m.text())) console_.push(m.text()); });
  await p.reload();
  await p.waitForTimeout(1200);
  /* Non basta «nessun errore»: una pagina che non ha eseguito niente non ne
     produce. Si chiede anche che ci sia del contenuto, se no il banco direbbe
     «a posto» su una pagina bianca.
     ⛔ E il conto NON guarda le classi delle app (`.item`, `.kpi`, `.sec`…):
     la prima stesura lo faceva e ACCUSAVA IL CORE, che è un monolite con
     classi sue — il controllo che non guarda dove crede, alla prima
     esecuzione del banco che nasce da quella stessa lezione. Si contano gli
     elementi e basta: questa misura prende solo la pagina completamente
     bianca, e il segnale vero resta l'errore di pagina. */
  const vive = await p.evaluate(() => ({
    titolo: (document.title || '').trim(),
    nodi: document.querySelectorAll('body *').length,
    testo: (document.body.innerText || '').trim().length,
  }));
  await ctx.close();
  aperte++;
  const male = [];
  /* lo stesso errore si ripete a ogni caricamento (qui la pagina viene aperta
     e poi ricaricata): si dice una volta sola, se no il conto sembra il doppio */
  for (const t of new Set(errori.map((e) => String(e).split('\n')[0]))) male.push(t);
  for (const t of new Set(console_.map((e) => String(e).split('\n')[0]))) male.push('console: ' + t);
  if (!vive.titolo) male.push('la pagina non ha nemmeno un titolo: non è partita');
  if (vive.nodi < 20) male.push(`solo ${vive.nodi} elementi nel corpo: la pagina non ha costruito niente`);
  if (vive.testo < 40) male.push(`solo ${vive.testo} caratteri di testo: la pagina è praticamente bianca`);
  if (male.length) { guasti.push({ nome, male }); console.error(`  ✗ ${nome}\n      ${male.join('\n      ')}`); }
  else console.log(`  ✓ ${nome}  (${vive.nodi} elementi, ${vive.testo} caratteri)`);
}

await browser.close();
if (server) { try { process.kill(-server.pid); } catch (e) {} }
if (copia) { try { execFileSync('git', ['worktree', 'remove', '--force', copia], { cwd: RADICE, stdio: 'ignore' }); } catch (e) {} }

console.log(`\nPagine vive: ${aperte - guasti.length} a posto, ${guasti.length} rotte  ·  ${aperte} superfici aperte da ${copia || PORTA_DA_GIRO ? 'una copia congelata' : 'la cartella viva'}`);

if (CONTROPROVA) {
  const presa = guasti.some((g) => g.nome === rotta);
  console.log(presa
    ? `  ✓ la controprova è caduta dove doveva (${rotta}): il banco sa fallire`
    : `  ✗ IL BANCO NON SA FALLIRE: ho rotto ${rotta} e non se n'è accorto`);
  process.exit(presa ? 0 : 1);
}
process.exit(guasti.length ? 1 : 0);

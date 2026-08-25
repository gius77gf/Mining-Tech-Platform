/* ⛔ «IL COLLEGAMENTO ESISTE» NON E' «L'APP SI APRE», ED E' LA SECONDA DOMANDA.
   `tour-vivo.mjs` risolve ogni href in un percorso e chiede al disco se quel
   file c'e'. E' la domanda giusta, e non basta: un file puo' esserci e la
   pagina aprirsi bianca — un import che non risolve, un `<script>` che muore
   al primo tocco, una schermata d'accesso che copre tutto. In quel caso il
   tour «funziona» per il righello e non funziona per chi lo prova.
   Qui si SEGUE il collegamento con un browser vero e si guarda che cosa
   arriva a schermo: lo stato HTTP, gli errori di pagina, e quanta roba viva
   c'e' dentro. Un numero solo non basterebbe — una pagina d'errore ha del
   testo anche lei — quindi si guardano insieme testo, elementi e comandi.

   ⚠️ E IL CORE NON SI APRE IN LOCALE, e non e' un difetto suo: tutto il suo
   programma sta in un `<script type="module">` che importa Firebase da
   gstatic.com. Senza rete l'import fallisce e restano i segnaposto che il core
   installa apposta. Questo righello lo DICHIARA invece di accusarlo: se no
   accuserebbe la superficie che il fondatore mostra per prima, e la prima
   volta che qualcuno legge quel rosso smette di guardare tutto il resto.

   Uso:  node tour-aperto.mjs <pagina.html> [--radice .]
*/
/* ⚠️ Playwright si importa in forma DINAMICA, come i banchi del repository:
   `import-esistenti.mjs` risolve gli import statici e un percorso assoluto
   fuori dal repository glielo fa dichiarare inesistente. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { servi } from './servi.mjs';
/* ⛔ IL CORE SI APRE ANCHE IN LOCALE, E L'ECCEZIONE E' STATA TOLTA INVECE CHE
   SORVEGLIATA. La prima stesura lo dichiarava «non misurabile qui» — vero
   (importa Firebase da gstatic.com e senza rete il modulo non parte), e
   comodo: e' la superficie che il fondatore mostra per prima, cioe' proprio
   quella che non si vuole lasciare fuori. Il repository ha gia' il modo di
   farlo partire — `finto-firebase.mjs`, montato PRIMA di `goto` — e
   un'eccezione che si puo' togliere si toglie. */
import { montaFintoFirebase } from '../../deepwork-id/tests/browser/finto-firebase.mjs';

const PAGINA = process.argv[2];
if (!PAGINA || !existsSync(PAGINA)) {
  console.error('uso: node tour-aperto.mjs <pagina.html> [--radice .]');
  process.exit(2);
}
const i = process.argv.indexOf('--radice');
const RADICE = resolve(i > 0 ? process.argv[i + 1] : '.');
const srv = await servi(RADICE);

/* gli indirizzi si leggono DALLA PAGINA, non da un elenco a mano: un elenco
   scritto qui invecchia il giorno che nasce un'app, e non lo direbbe nessuno */
const html = readFileSync(PAGINA, 'utf8');
const mete = [...new Set([...html.matchAll(/href="(\/[^"#]*)"/g)].map(m => m[1]))].sort();
if (!mete.length) { console.error('⛔ NESSUN COLLEGAMENTO INTERNO nella pagina: non ho niente da provare.'); process.exit(2); }

/* nessuna destinazione dichiarata fuori: se un giorno ce ne fosse una, va
   scritta qui CON LA RAGIONE, e resta contata a parte dai KO */
const SENZA_RETE = {};

const b = await chromium.launch();
let ok = 0, ko = 0, dichiarati = 0;
console.log(`${mete.length} destinazioni lette dalla pagina · radice servita: ${RADICE}\n`);
for (const m of mete) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errori = [];
  p.on('pageerror', e => errori.push(e.message.split('\n')[0].slice(0, 90)));
  /* il finto Firebase va montato PRIMA di `goto`, se no il modulo del core e'
     gia' fallito quando arriva */
  await montaFintoFirebase(p);
  /* ⛔ NON SI ASPETTA LA QUIETE DI RETE. La prima stesura usava
     `waitUntil:'networkidle'` e ha dichiarato SETTE app su nove «non si
     aprono», con HTTP -1 — mentre nella stessa riga stampava il loro titolo,
     migliaia di caratteri e centinaia di comandi. Queste app tengono aperte
     connessioni verso Firebase: la quiete non arriva MAI, quindi scadeva
     l'attesa, l'eccezione diventava un -1 e il -1 diventava un'accusa.
     Il segno da riconoscere e' quello di sempre: sette KO identici, tutti con
     addosso la prova di essere vivi. Si aspetta il documento, poi si giudica
     da cio' che c'e' a schermo. */
  let stato = 0;
  try {
    const r = await p.goto(`http://127.0.0.1:${srv.porta}${m}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
    stato = r ? r.status() : 0;
  } catch (e) { stato = -1; }
  await p.waitForTimeout(2500);
  const v = await p.evaluate(() => ({
    testo: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
    comandi: document.querySelectorAll('button,a[href],input,select').length,
    titolo: (document.title || '').slice(0, 40),
  })).catch(() => ({ testo: 0, comandi: 0, titolo: '' }));
  await p.close();

  const vivo = stato === 200 && v.testo > 120 && v.comandi > 3;
  const scusa = SENZA_RETE[m];
  const segno = vivo ? 'ok  ' : (scusa ? 'dich' : 'KO  ');
  if (vivo) ok++; else if (scusa) dichiarati++; else ko++;
  console.log(`  ${segno} ${m.padEnd(28)} HTTP ${String(stato).padStart(3)} · ${String(v.testo).padStart(5)} caratteri · ${String(v.comandi).padStart(3)} comandi · «${v.titolo}»`);
  if (!vivo && scusa) console.log(`         ⚠️  NON MISURATO in locale: ${scusa}. Online funziona — qui non si puo' sapere.`);
  if (!vivo && !scusa && errori.length) console.log(`         errori: ${[...new Set(errori)].slice(0, 3).join(' | ')}`);
}
await b.close(); srv.chiudi();

console.log(`\nRisultato tour aperto: ${ok} app aperte davvero, ${ko} che non si aprono, ${dichiarati} non misurabili in locale (dichiarate)`);
/* ⛔ una destinazione non misurata NON e' una destinazione a posto: se uscisse
   verde, la difesa sarebbe peggiore del difetto. Ma non e' nemmeno un KO —
   sono due esiti diversi e vanno contati a parte. */
if (ko > 0) process.exit(1);

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

   ⛔ E C'E' UNA DOMANDA CHE IN CASA NON SI PUO' FARE: **la produzione riscrive
   gli indirizzi.** Misurato il 25/08 sull'anteprima di una PR — Netlify serve
   `href="/apps/genesi/genesi.html"` come `href="/apps/genesi/genesi"`, togliendo
   l'estensione da se'. Un righello che legge gli href dal FILE, o che li apre
   su un server di casa, non vede la riscrittura: direbbe «a posto» anche se
   quell'indirizzo non funzionasse. Per questo c'e' `--base`, che legge la
   pagina **dal sito vero** e segue gli indirizzi che il sito vero dichiara.
   (Provato: `/apps/genesi/genesi` e `/apps/genesi/genesi.html` rispondono
   tutt'e due 200 con gli stessi byte. La domanda va comunque rifatta ogni
   volta che nasce una destinazione con un'estensione.)

   Uso:  node tour-aperto.mjs <pagina.html> [--radice .]
         node tour-aperto.mjs --base https://deepworksic.netlify.app/apps/
*/
/* ⚠️ Playwright si importa in forma DINAMICA, come i banchi del repository:
   `import-esistenti.mjs` risolve gli import statici e un percorso assoluto
   fuori dal repository glielo fa dichiarare inesistente. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execFileSync } from 'child_process';
import { servi } from './servi.mjs';
/* ⛔ IL CORE SI APRE ANCHE IN LOCALE, E L'ECCEZIONE E' STATA TOLTA INVECE CHE
   SORVEGLIATA. La prima stesura lo dichiarava «non misurabile qui» — vero
   (importa Firebase da gstatic.com e senza rete il modulo non parte), e
   comodo: e' la superficie che il fondatore mostra per prima, cioe' proprio
   quella che non si vuole lasciare fuori. Il repository ha gia' il modo di
   farlo partire — `finto-firebase.mjs`, montato PRIMA di `goto` — e
   un'eccezione che si puo' togliere si toglie. */
import { montaFintoFirebase } from '../../deepwork-id/tests/browser/finto-firebase.mjs';

const iB = process.argv.indexOf('--base');
const BASE = iB > 0 ? process.argv[iB + 1].replace(/\/$/, '') : null;
const PAGINA = BASE ? null : process.argv[2];
if (!BASE && (!PAGINA || !existsSync(PAGINA))) {
  console.error('uso: node tour-aperto.mjs <pagina.html> [--radice .]');
  console.error('     node tour-aperto.mjs --base https://deepworksic.netlify.app/apps/');
  process.exit(2);
}
const i = process.argv.indexOf('--radice');
const RADICE = BASE ? null : resolve(i > 0 ? process.argv[i + 1] : '.');
const srv = BASE ? null : await servi(RADICE);
/* con `--base` l'origine e' il sito vero; senza, il server di casa */
const ORIGINE = BASE ? new URL(BASE).origin : `http://127.0.0.1:${srv.porta}`;

/* ⛔ gli indirizzi si leggono DALLA PAGINA SERVITA, non da un elenco a mano:
   un elenco scritto qui invecchia il giorno che nasce un'app, e non lo
   direbbe nessuno. Con `--base` si legge quella che il sito consegna DAVVERO,
   che e' l'unico modo di vedere le sue riscritture. */
/* ⛔ VERSO L'ESTERNO SI PASSA DAL PROXY, E DUE STRUMENTI SU TRE NON LO SANNO
   DA SOLI. Misurato il 25/08: `curl` esce (legge `HTTPS_PROXY` dall'ambiente),
   il `fetch` di node NO — va dritto e il proxy risponde **403**. Preso per
   buono, quel 403 diventa «il sito non si scarica», cioe' un limite dello
   STRUMENTO scambiato per un fatto sul mondo: e' la stessa famiglia
   dell'agente che dichiarava la rete bloccata avendo provato con `curl`, e
   dell'emulatore «che qui non parte» perche' mancava un `npm ci`.
   Quindi la pagina la scarica `curl`, e al browser il proxy si passa a mano. */
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || null;
let html;
if (BASE) {
  const via = BASE.endsWith('.html') ? BASE : BASE + '/';
  try {
    html = execFileSync('curl', ['-sSL', '--max-time', '40', '--fail', via], { encoding: 'utf8', maxBuffer: 64 << 20 });
  } catch (e) {
    console.error(`⛔ la pagina non si scarica da ${via}: ${String(e.message).split('\n')[0]}`);
    process.exit(2);
  }
  if (!html || html.length < 500) { console.error(`⛔ da ${via} sono arrivati ${html ? html.length : 0} caratteri: non e' una pagina.`); process.exit(2); }
} else {
  html = readFileSync(PAGINA, 'utf8');
}
const mete = [...new Set([...html.matchAll(/href=["'](\/[^"'#]*)["']/g)].map(m => m[1]))].sort();
if (!mete.length) { console.error('⛔ NESSUN COLLEGAMENTO INTERNO nella pagina: non ho niente da provare.'); process.exit(2); }

/* nessuna destinazione dichiarata fuori: se un giorno ce ne fosse una, va
   scritta qui CON LA RAGIONE, e resta contata a parte dai KO */
const SENZA_RETE = {};

/* ⛔ ONLINE IL BROWSER NON ESCE, E `curl` SI'. Misurato il 25/08 in questo
   contenitore: qualunque `page.goto` verso un indirizzo esterno risponde
   `ERR_CONNECTION_RESET`, col proxy passato in tre modi diversi — e il proxy
   NON registra il tentativo, quindi le richieste di Chromium non gli arrivano
   nemmeno. `curl` invece passa (legge `HTTPS_PROXY` da se').
   Quindi con `--base` la misura si fa con `curl`, e si DICHIARA che cos'e':
     · copre  -> l'indirizzo risponde? con quale stato? e cio' che torna e' una
                 pagina (testo e comandi nel sorgente) o un errore travestito?
                 Ed e' l'unica misura che vede le RISCRITTURE del sito, che e'
                 la ragione per cui `--base` esiste.
     · NON copre -> che la pagina si monti davvero nel browser. Quello lo
                 misura la passata di casa, sugli stessi byte.
   Le due non si sostituiscono: si sommano. Un righello che non sa quanto
   sbaglia manda a rovinare cose sane. */
const b = BASE ? null : await chromium.launch();
let ok = 0, ko = 0, dichiarati = 0;
console.log(`${mete.length} destinazioni lette dalla pagina · ${BASE ? 'SITO VERO: ' + ORIGINE : 'radice servita: ' + RADICE}\n`);
if (BASE) console.log(`⚠️  ONLINE si misura con curl: qui il browser non raggiunge la rete (ERR_CONNECTION_RESET,\n    e il proxy non vede nemmeno il tentativo). Copre lo stato e il contenuto consegnato — e le\n    RISCRITTURE del sito, che in casa non si vedono. NON copre che la pagina si monti: quello lo\n    dice la passata di casa, sugli stessi byte.\n`);

for (const m of mete) {
  let stato = 0, v = { testo: 0, comandi: 0, titolo: '' }, errori = [];
  if (BASE) {
    let corpo = '';
    try {
      const fuori = execFileSync('curl', ['-sSL', '--max-time', '45', '-w', '\n@@STATO:%{http_code}',
        `${ORIGINE}${m}`], { encoding: 'utf8', maxBuffer: 128 << 20 });
      const t = fuori.lastIndexOf('\n@@STATO:');
      stato = +fuori.slice(t + 9).trim() || 0;
      corpo = fuori.slice(0, t);
    } catch (e) { stato = -1; errori.push(String(e.message).split('\n')[0].slice(0, 90)); }
    /* «quanto testo» si chiede al sorgente: si tolgono script, stile e tag.
       Non e' il renderizzato, ed e' scritto sopra che non lo e'. */
    const nudo = corpo.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ');
    v.testo = nudo.replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim().length;
    v.comandi = (corpo.match(/<(button|a\s[^>]*href|input|select)/gi) || []).length;
    v.titolo = (corpo.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim().slice(0, 40);
  } else {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    p.on('pageerror', e => errori.push(e.message.split('\n')[0].slice(0, 90)));
    /* il finto Firebase va montato PRIMA di `goto`, se no il modulo del core e'
       gia' fallito quando arriva. Online non servirebbe: li' la rete c'e'. */
    await montaFintoFirebase(p);
    try {
      const r = await p.goto(`${ORIGINE}${m}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      stato = r ? r.status() : 0;
    } catch (e) { stato = -1; }
    await p.waitForTimeout(2500);
    v = await p.evaluate(() => ({
      testo: (document.body.innerText || '').replace(/\s+/g, ' ').trim().length,
      comandi: document.querySelectorAll('button,a[href],input,select').length,
      titolo: (document.title || '').slice(0, 40),
    })).catch(() => ({ testo: 0, comandi: 0, titolo: '' }));
    await p.close();
  }

  const vivo = stato === 200 && v.testo > 120 && v.comandi > 3;
  const scusa = SENZA_RETE[m];
  const segno = vivo ? 'ok  ' : (scusa ? 'dich' : 'KO  ');
  if (vivo) ok++; else if (scusa) dichiarati++; else ko++;
  console.log(`  ${segno} ${m.padEnd(28)} HTTP ${String(stato).padStart(3)} · ${String(v.testo).padStart(6)} caratteri · ${String(v.comandi).padStart(3)} comandi · «${v.titolo}»`);
  if (!vivo && scusa) console.log(`         ⚠️  NON MISURATO: ${scusa}.`);
  if (!vivo && !scusa && errori.length) console.log(`         errori: ${[...new Set(errori)].slice(0, 3).join(' | ')}`);
}
if (b) await b.close();
srv?.chiudi();

console.log(`\nRisultato tour aperto: ${ok} app aperte davvero, ${ko} che non si aprono, ${dichiarati} non misurabili in locale (dichiarate)`);
/* ⛔ una destinazione non misurata NON e' una destinazione a posto: se uscisse
   verde, la difesa sarebbe peggiore del difetto. Ma non e' nemmeno un KO —
   sono due esiti diversi e vanno contati a parte. */
if (ko > 0) process.exit(1);

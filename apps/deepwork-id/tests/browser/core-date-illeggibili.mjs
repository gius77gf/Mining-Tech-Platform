/* ⛔ UNA DATA CHE NESSUNO SA LEGGERE NON PUÒ DIVENTARE UN «OK» VERDE.
   Banco nato il 03/08, dal difetto misurato sul core:

     data della scadenza   `daysBetween`   che cosa mostrava
     2026-08-01                     -2     badge rosso «scaduta» — giusto
     2026-02-30                   -154     un giorno CHE NON ESISTE, contato
     null                       -20668     «scaduta da 56 anni» (new Date(null) = 1970)
     "30/02/2026"                  NaN     badge **OK VERDE**

   L'ultima riga è il principio del fondatore violato nel modo più diretto: il
   colore più tranquillo della scala su un dato che non è stato letto. E nei
   promemoria la stessa `NaN` faceva **sparire** la riga da tutte e due gli
   elenchi, perché `NaN<0` e `NaN>=0` sono false tutt'e due.

   ⚠️ PERCHÉ SERVE UN BANCO DEL BROWSER. La regola dei giorni sta in `shared/`
   (`giorniTra`, provata in `run-helpers`), ma quello che `node` non può vedere
   è il **collegamento**: che il core la chiami davvero e che il badge cambi
   colore. È la guardia scollegata di CLAUDE.md.

   ⚠️ E IL DIFETTO SI INIETTA IN MEMORIA, mai sul disco: la pagina la carica il
   browser, e un altro banco che girasse in quel momento misurerebbe una
   falsità. Qui si intercetta la richiesta di `index.html` e si sostituisce UNA
   data dei dati d'esempio — il file vero non viene toccato.

   Si lancia con: node core-date-illeggibili.mjs [porta] [--controprova] */

import { prendiChromium, CHROMIUM } from './giro.mjs';
import { MODULI, montaFintoFirebase } from './finto-firebase.mjs';
const chromium = await prendiChromium();

const PORTA = process.argv.find((a) => /^\d+$/.test(a)) || '8791';
const CONTROPROVA = process.argv.includes('--controprova');
const BASE = `http://127.0.0.1:${PORTA}`;

let passati = 0, falliti = 0;
const ok = (cond, nome, dett = '') => {
  if (cond) { passati++; console.log(`  ✓ ${nome}`); }
  else { falliti++; console.error(`  ✗ ${nome}${dett ? ' — ' + dett : ''}`); }
};

/* la data buona dei dati d'esempio, e quella storta che si mette al suo posto */
const BUONA = "assicurazione:'2026-07-01'";
const STORTA = "assicurazione:'30/02/2026'";
/* ⛔ LE GUARDIE SONO DUE, E VANNO TOLTE TUTT'E DUE. La prima controprova ne
   toglieva una sola — quella dell'elenco — e rispondeva «NON distingue»: non
   perché il banco fosse cieco, ma perché le prove che dovevano cadere guardano
   la SCHEDA del mezzo, che ha una guardia sua. È la quarta delle cinque cause
   di CLAUDE.md (l'iniezione puntata nel posto sbagliato) più la seconda (la
   difesa in profondità): si toglie tutto lo strato, e allora si vede il danno. */
const GUARDIE = [
  "else if(illegg.length){badge=`<span class=\"scad-badge warn\">${illegg[0].k}: data illeggibile</span>`;cls='warn';}",
  "if(!st.leggibile){cls='warn';bg='scad-badge warn';testo='data illeggibile';}else ",
  // la media che non c'è: rimettere il ripiego `: 0` fa tornare «0,0 mc»
  ["const mediaProf=cnt>0?(m/cnt):null;", "const mediaProf=cnt>0?(m/cnt):0;"],
  ["$('tot-mc').textContent=mc===null?'—':mc.toFixed(1);", "$('tot-mc').textContent=(mc||0).toFixed(1);"],
  ["if($('tot-media'))$('tot-media').textContent=mediaProf===null?'—':mediaProf.toFixed(2);",
   "if($('tot-media'))$('tot-media').textContent=(mediaProf||0).toFixed(2);"],
];

const browser = await chromium.launch({ executablePath: CHROMIUM });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await montaFintoFirebase(p);
/* ⚠️ IL FINTO FIRESTORE DEVE **RIFIUTARE**, non rispondere vuoto — e questa
   riga è costata una misura sbagliata. Con un Firestore che risponde «nessun
   documento» il core crede di essere al primo avvio, semina il database e
   ricarica: `DB.users` resta vuoto e l'accesso risponde «Credenziali errate».
   I dati d'esempio — che sono il soggetto di questo banco — si caricano solo
   passando dal ripiego, cioè quando la lettura FALLISCE. È lo stesso percorso
   che oggi prende ogni visitatore del sito, da quando le regole sono chiuse. */
await p.route('https://www.gstatic.com/firebasejs/**firebase-firestore.js', (r) =>
  r.fulfill({ status: 200, contentType: 'text/javascript',
    body: MODULI['firebase-firestore.js'].replace(
      "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
      "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));

let sostituzioni = 0;
await p.route(`${BASE}/index.html`, async (r) => {
  const risp = await r.fetch();
  let corpo = await risp.text();
  const prima = corpo;
  corpo = corpo.replace(BUONA, STORTA);
  if (corpo === prima) throw new Error(`INIEZIONE A VUOTO: «${BUONA}» non si trova più nei dati d'esempio`);
  sostituzioni++;
  if (CONTROPROVA) {
    for (const g of GUARDIE) {
      const [cerca, metti] = Array.isArray(g) ? g : [g, ''];
      const p2 = corpo.replace(cerca, metti);
      if (p2 === corpo) throw new Error(`CONTROPROVA A VUOTO: questa guardia non si trova più nel core → ${cerca.slice(0, 60)}…`);
      corpo = p2;
      sostituzioni++;
    }
  }
  await r.fulfill({ status: 200, contentType: 'text/html', body: corpo });
});

const errori = [];
p.on('pageerror', (e) => errori.push(e.message));
await p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
await p.waitForFunction(() => typeof window.doLogin === 'function', { timeout: 15000 });
await p.fill('#lu', 'admin');
await p.fill('#lp', 'admin');
await p.click('#btn-login');
await p.waitForFunction(() => {
  const h = document.getElementById('screen-home');
  return h && getComputedStyle(h).display !== 'none';
}, { timeout: 10000 });

/* ⚠️ La prova di aver navigato PRIMA di misurare: un banco che non naviga
   fotografa otto volte la stessa schermata e risponde «tutto a posto». */
await p.evaluate(() => window.nav('macchine'));
/* ⚠️ La linguetta si preme, non si chiama: `macTab(tipo, this)` vuole anche
   l'elemento premuto, e chiamandola con un argomento solo muore su
   `undefined.classList`. È la stessa famiglia del `vaiA` chiamato con due
   argomenti invece di tre, scritta in CLAUDE.md. */
await p.click('[onclick*="macTab(\'strada\'"]');
await p.waitForTimeout(400);
const navigato = await p.evaluate(() => {
  const s = document.getElementById('screen-macchine');
  const l = document.getElementById('mac-strada-list');
  return { schermata: !!s && getComputedStyle(s).display !== 'none', righe: l ? l.querySelectorAll('.sitem').length : 0 };
});
ok(navigato.schermata && navigato.righe > 0,
  'si arriva davvero alla schermata dei mezzi da strada',
  `schermata=${navigato.schermata} righe=${navigato.righe}`);

const m = await p.evaluate(() => {
  const l = document.getElementById('mac-strada-list');
  const badge = [...l.querySelectorAll('.scad-badge')].map((b) => ({
    testo: b.textContent.trim(), classi: b.className,
  }));
  return { badge, testo: l.innerText };
});
console.log(`  badge letti: ${JSON.stringify(m.badge)}`);

ok(errori.length === 0, 'nessun errore di pagina', errori.join(' · '));
ok(!m.badge.some((b) => /\bok\b/i.test(b.classi) || /^OK$/i.test(b.testo)),
  '⛔ nessun badge OK verde sul mezzo con la data illeggibile',
  JSON.stringify(m.badge));
/* ⚠️ ORDINE DELLE PRIORITÀ, e la prima versione di questa prova lo aveva
   sbagliato: pretendeva la parola «illeggibile» nell'ELENCO, dove il mezzo del
   campione mostra «TAGLIANDO scaduta» — perché ha anche una scadenza davvero
   passata, e quella viene prima. È la scelta giusta (una scadenza vera è più
   urgente di una data da correggere) e la prova va scritta su quella, non
   allentata: nell'elenco si pretende che il badge non sia OK, la ragione la
   dice la scheda del mezzo, provata più sotto. */
ok(/scaduta/i.test(m.testo),
  'la scadenza davvero passata viene prima di quella illeggibile',
  m.testo.slice(0, 160));
ok(!/NaN/.test(m.testo), 'da nessuna parte compare «NaN»', m.testo.slice(0, 160));

/* la scheda del mezzo: lì il difetto scriveva «NaNg» dentro il badge */
await p.evaluate(() => {
  const r = document.querySelector('#mac-strada-list .sitem');
  if (r) r.click();
});
await p.waitForTimeout(400);
const det = await p.evaluate(() => {
  const b = document.getElementById('mzd-body') || document.getElementById('mezzo-det-body');
  const s = document.getElementById('screen-mezzo-det') || document.getElementById('screen-mzd');
  return { aperta: !!s && getComputedStyle(s).display !== 'none', testo: b ? b.innerText : (document.body.innerText || '') };
});
if (det.aperta) {
  ok(!/NaN/.test(det.testo), 'nella scheda del mezzo non compare «NaN»', det.testo.slice(0, 160));
  ok(/illeggibile/i.test(det.testo), 'e la scheda dice che la data non si legge', det.testo.slice(0, 160));
} else {
  console.log('  · scheda del mezzo non aperta: le due prove sulla scheda restano fuori (dichiarato, non taciuto)');
}

/* ── SECONDA FAMIGLIA, STESSO PRINCIPIO: LA MEDIA CHE NON C'È ──
   Il riquadro dei totali del rapportino calcolava `media = somma / fori` con
   ripiego `: 0`, e da lì i metri cubi (`media × fori × B × S × 0.9`). Un
   rapportino appena aperto, con i fori ancora da misurare, dichiarava di aver
   cavato **0,0 mc**: la cifra più tranquilla della scala su un turno che
   nessuno ha misurato. La stessa espressione è scritta quattro volte nel core,
   e una delle quattro la cosa giusta la faceva già. */
await p.evaluate(() => window.nav('rapp'));
await p.waitForTimeout(500);
const rapp = await p.evaluate(() => {
  const s = document.getElementById('screen-rapp');
  const mc = document.getElementById('tot-mc');
  const media = document.getElementById('tot-media');
  return {
    aperto: !!s && getComputedStyle(s).display !== 'none',
    mc: mc ? mc.textContent.trim() : '(non trovato)',
    media: media ? media.textContent.trim() : '(non trovato)',
  };
});
console.log(`  rapportino vuoto: mc «${rapp.mc}» · media «${rapp.media}»`);
ok(rapp.aperto, 'si arriva davvero al rapportino');
ok(rapp.mc !== '0.0' && rapp.mc !== '0,0',
  '⛔ un rapportino senza fori misurati NON dichiara 0,0 metri cubi', `letto «${rapp.mc}»`);
ok(rapp.media !== '0.00' && rapp.media !== '0,00',
  '⛔ e nemmeno una profondità media di 0,00 m', `letto «${rapp.media}»`);

console.log(`\n${sostituzioni} sostituzioni fatte nella pagina servita (0 = banco che non misura niente)`);
console.log(`\nRisultato date illeggibili nel core: ${passati} passati, ${falliti} falliti`);
await browser.close();
if (CONTROPROVA) {
  console.log(falliti > 0 ? 'controprova: il banco SA fallire' : 'controprova: NON distingue');
  process.exit(falliti > 0 ? 0 : 1);
}
process.exit(falliti > 0 ? 1 : 0);

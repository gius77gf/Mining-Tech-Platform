/* Il CORE e DEEPWORK ID. Il core non si apre in locale senza il finto Firebase
   (il suo programma sta in un modulo che importa da gstatic): si monta quello
   del repository, si entra con la dimostrazione, e si PRETENDE la prova di
   aver navigato prima di ogni scatto. */
/* ⚠️ Playwright si importa in forma DINAMICA, come i 53 banchi del
   repository: `import-esistenti.mjs` risolve gli import statici e un
   percorso assoluto fuori dal repository glielo fa dichiarare inesistente.
   Non e' uno stile: e' la convenzione che tiene verde quel controllo. */
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
import { readFileSync } from 'fs';
const { montaFintoFirebase } = await import('../../deepwork-id/tests/browser/finto-firebase.mjs');
const OUT = process.argv[2], PORTA = process.argv[3] || '8951';
/* ⛔ Il tema si accende dall'INDIRIZZO (`shared/dw-tema.js` legge `?tema=`,
   lo salva e lo toglie): non serve cercare un bottone. */
const CHIARO = process.argv.includes('--chiaro');
const TEMA = CHIARO ? '?tema=chiaro' : '';
const SUF = CHIARO ? 'c' : '';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const esito = [];

const p = await b.newPage({ viewport: { width: 1180, height: 738 } });
await montaFintoFirebase(p);
/* ⛔ Le costanti della dimostrazione vivono DENTRO il `<script type="module">`
   del core: da fuori non si raggiungono (`window.DEFAULT_USERS` e' undefined) e
   il login risponde «Credenziali errate» su credenziali giuste. Si semina come
   fanno i banchi del repository — patchando l'HTML SERVITO, non la pagina — e
   si DICHIARA quante righe sono entrate: una sostituzione che non trova il suo
   pezzo non fallisce, passa muta. */
const ANCORA = 'function doLogin(){';
const SEMINA = `window.__semina=function(){var n=0;
  var M={users:DEFAULT_USERS,cave:DEFAULT_CAVE,mezziLav:DEFAULT_MEZZILAV,mezziStr:DEFAULT_MEZZISTR,
         personale:DEFAULT_PERSONALE,rapportini:DEFAULT_RAPPORTINI,rapportiniFoc:DEFAULT_RAPPORTINI_FOC,
         promemoria:DEFAULT_PROMEMORIA,messaggi:DEFAULT_MESSAGGI,clienti:DEFAULT_CLIENTI,volate:DEFAULT_VOLATE};
  for(var k in M){if(Array.isArray(M[k])){DB[k]=M[k].slice();n+=M[k].length;}}
  try{DB.deposito=DEFAULT_DEPOSITO;}catch(e){}
  state.dbReady=true;return n;};
window.__chiaro=function(){try{DB.settings={...DB.settings,theme:'light',outdoor:false};
  applyTheme();return document.body.classList.contains('light-mode');}catch(e){return 'errore: '+e.message;}};
` + ANCORA;
/* ⛔ Tre stati, non due: «non e' partita», «e' partita e non ha trovato il
   pezzo», «ha sostituito». Con due soli, un glob che non combacia piu'
   (e' successo aggiungendo `?tema=chiaro`) si legge come «il codice e'
   cambiato», e si va a cercare il difetto nel posto sbagliato. */
let toccato = 0, rottaPartita = 0;
const SORG = readFileSync('/home/user/Mining-Tech-Platform/index.html', 'utf8');
await p.route('**/index.html*', async (r) => {
  if (!/127\.0\.0\.1/.test(r.request().url())) return r.continue();
  rottaPartita = 1;
  const t = SORG.split(ANCORA).join(SEMINA);
  toccato = SORG === t ? 0 : 1;
  await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: t });
});
await p.goto(`http://127.0.0.1:${PORTA}/index.html${TEMA}`, { waitUntil: 'load' });
await p.waitForFunction(() => typeof window.doLogin === 'function', { timeout: 25000 });
esito.push('core: rotta di seminatura ' + (rottaPartita ? 'partita' : 'MAI PARTITA (il glob non combacia con l\'indirizzo)')
  + ' · ancora ' + (toccato ? 'trovata' : 'NON trovata'));
const seminato = await p.evaluate(() => (window.__semina ? window.__semina() : -1));
esito.push('core: dimostrazione seminata, ' + seminato + ' righe');
let dentro = false;
for (let g = 0; g < 8 && !dentro; g++) {
  await p.fill('#lu', 'admin'); await p.fill('#lp', 'admin'); await p.click('#btn-login');
  await p.waitForTimeout(900);
  dentro = await p.evaluate(() => { const h = document.getElementById('screen-home');
                                    return !!h && getComputedStyle(h).display !== 'none'; });
}
esito.push('core: si entra = ' + dentro);
if (CHIARO) {
  /* ⛔ IL CORE NON USA `dw-tema.js` PER SE': ha il suo interruttore in
     `DB.settings.theme` e lo applica con `applyTheme()`. `?tema=chiaro`
     sull'indirizzo non lo tocca — misurato, non dedotto: il tema restava scuro
     e il banco stava per fotografare il buio chiamandolo «chiaro». */
  const acceso = await p.evaluate(() => (window.__chiaro ? window.__chiaro() : 'manca __chiaro'));
  esito.push('core: tema chiaro acceso = ' + acceso);
  if (!acceso) { console.log(esito.join('\n')); await b.close(); process.exit(1); }
}
if (dentro) {
  const SEZ = ['home', 'volate', 'rapp', 'macchine', 'deposito', 'ufficio'];
  for (let i = 0; i < SEZ.length; i++) {
    await p.evaluate((s) => window.nav(s), SEZ[i]);
    await p.waitForTimeout(1400);
    const viste = await p.$$eval('[id^=screen-]', (e) =>
      e.filter((x) => getComputedStyle(x).display !== 'none').map((x) => x.id));
    if (!viste.includes('screen-' + SEZ[i])) { esito.push(`core/${SEZ[i]}: NON navigato (${viste})`); continue; }
    const car = await p.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').length);
    await p.screenshot({ path: `${OUT}/deepwork${SUF}-${i}.png` });
    esito.push(`deepwork${SUF}-${i} ok (${SEZ[i]}, ${car} caratteri)`);
  }
}
await p.close();

/* Deepwork ID: l'accesso, il profilo e l'amministrazione — tre pagine vere */
for (const [i, via] of [[0, '/apps/deepwork-id/index.html'], [1, '/apps/deepwork-id/profilo.html'],
                        [2, '/apps/deepwork-id/admin.html']]) {
  const q = await b.newPage({ viewport: { width: 1180, height: 738 } });
  await montaFintoFirebase(q);
  try {
    await q.goto(`http://127.0.0.1:${PORTA}${via}${TEMA}`, { waitUntil: 'load', timeout: 25000 });
    await q.waitForTimeout(2800);
    const car = await q.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').length);
    if (car < 120) { esito.push(`deepworkid${SUF}-${i}: solo ${car} caratteri, NON fotografata`); }
    else { await q.screenshot({ path: `${OUT}/deepworkid${SUF}-${i}.png` }); esito.push(`deepworkid${SUF}-${i} ok (${car} car)`); }
  } catch (e) { esito.push(`deepworkid-${i}: ${e.message.split('\n')[0]}`); }
  await q.close();
}
console.log(esito.join('\n'));
await b.close();

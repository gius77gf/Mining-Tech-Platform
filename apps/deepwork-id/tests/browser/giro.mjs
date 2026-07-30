/* IL GIRO DELLE SUPERFICI, in un posto solo.
   Aprire una pagina e visitarne le sezioni è la stessa cosa per ogni banco che
   guarda l'interfaccia: se ogni banco se la riscrive, la seconda copia nasce
   uguale e diverge al primo cambiamento — è il difetto che nel prodotto è
   costato una giornata e in Terra è costato «1.500» che diventava «500».
   Qui sta una volta sola. */

export async function prendiChromium() {
  /* Playwright non è una dipendenza del repo (nessuno vuole un `npm install`
     per aprire il progetto) ed è installato globalmente. La risoluzione dei
     moduli ES non guarda NODE_PATH: si prova il nome, poi il posto. */
  for (const dove of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs',
                      '/opt/node22/lib/node_modules/playwright/index.js']) {
    try { return (await import(dove)).chromium; } catch (e) { /* si prova il prossimo */ }
  }
  console.error("Playwright non si trova. Installalo, o lancia il banco da una cartella che ce l'ha accanto.");
  process.exit(2);
}

export const CHROMIUM = '/opt/pw-browsers/chromium';

export const SUPERFICI = [
  ['core', '/index.html'],
  ['campo', '/apps/campo/index.html'],
  ['flotta', '/apps/flotta/index.html'],
  ['scudo', '/apps/scudo/index.html'],
  ['sentinella', '/apps/sentinella/index.html'],
  ['terra', '/apps/terra/index.html'],
  ['genesi', '/apps/genesi/genesi.html'],
];

/* Il core è l'unico che non ha la barra delle sezioni delle app: si naviga con
   la sua funzione `nav`, la stessa che chiamano i suoi bottoni. Le sezioni con
   la chiocciola sono queste. */
export const SEZIONI_CORE = ['@home', '@volate', '@cave', '@menu', '@macchine',
  '@deposito', '@personale', '@clienti', '@ufficio', '@admin', '@strumenti-foc',
  '@notifiche', '@messaggi', '@contatti', '@impostazioni', '@utenti', '@dashboard'];

/* L'utente finto per il core: senza, `renderHome` e mezze schermate non partono
   (`state.user` è nullo e le funzioni escono subito). Il ruolo si sceglie:
   moltissimi pezzi dell'interfaccia esistono solo per certi permessi. */
export const UTENTE_PROVA = (ruolo = 'admin') =>
  ({ id: 'u1', user: 'prova', nome: 'Giuseppe', cognome: 'F.', ruolo, cave: [] });

const AGGANCIO = 'window.fabPrimary=fabPrimary;';

/* Apre una superficie pronta all'uso. `trasforma(corpo)` permette a un banco di
   servire una versione modificata della pagina — è così che si fanno le
   controprove: si rimette il difetto e si pretende che il banco fallisca. */
export async function apriSuperficie(browser, { nome, via, porta, larghezza = 430, altezza = 950,
                                                ruolo = 'admin', trasforma = null, montaFintoFirebase = null }) {
  const ctx = await browser.newContext({ viewport: { width: larghezza, height: altezza }, locale: 'it-IT' });
  const p = await ctx.newPage();
  const errori = [];
  p.on('pageerror', (e) => errori.push(e.message));
  if (nome === 'core' && montaFintoFirebase) await montaFintoFirebase(p);
  if (nome === 'core' || trasforma) {
    await p.route('**' + via, async (r) => {
      const res = await r.fetch();
      let corpo = await res.text();
      if (nome === 'core') {
        /* `state` del core è una variabile di modulo, non sta su window: senza
           una porticina non si può dargli un utente, e senza utente metà
           schermate restano vuote. Il file su disco non viene toccato. */
        if (!corpo.includes(AGGANCIO)) { console.error('✗ punto di aggancio non trovato nel core'); process.exit(2); }
        corpo = corpo.replace(AGGANCIO, AGGANCIO + '\nwindow.__provaUtente=(u)=>{state.user=u;};');
      }
      if (trasforma) corpo = trasforma(corpo);
      await r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: corpo });
    });
  }
  await p.goto(`http://127.0.0.1:${porta}${via}`);
  await p.waitForTimeout(nome === 'core' ? 3500 : 2200);
  if (nome === 'core') await p.evaluate((u) => window.__provaUtente(u), UTENTE_PROVA(ruolo));
  return { ctx, p, errori };
}

/* L'elenco delle sezioni da visitare, nella forma che `vaiA` sa usare. */
export async function sezioniDi(p, nome) {
  if (nome === 'core') return SEZIONI_CORE;
  const s = await p.$$eval('.nav button[id^=nav-], #bottomnav button[data-scr]',
    (bs) => bs.map((x) => x.id || `[data-scr="${x.dataset.scr}"]`));
  return s.length ? s : [''];
}

/* Va in una sezione e apre quello che sta chiuso: fisarmoniche, pannelli,
   linguette. È il gesto che farebbe una persona, non un forzare gli stili — che
   non regge, perché la schermata rimette a posto i propri stili appena cambia. */
export async function vaiA(p, nome, sezione) {
  if (sezione && sezione.startsWith('@')) {
    await p.evaluate((x) => { if (typeof nav === 'function') nav(x); }, sezione.slice(1)).catch(() => {});
    await p.waitForTimeout(450);
    /* nell'amministrazione del core i campi stanno in linguette */
    if (sezione === '@admin') {
      for (const l of await p.$$('#screen-admin .atab')) {
        await l.click({ timeout: 2500 }).catch(() => {});
        await p.waitForTimeout(180);
      }
    }
  } else if (sezione) {
    const sel = sezione.startsWith('[') ? `#bottomnav button${sezione}` : `#${sezione}`;
    await p.click(sel, { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(500);
  }
  /* il pannello dei parametri del 3D di Genesi */
  if (nome === 'genesi' && !(await p.evaluate(() => document.body.classList.contains('show-params')))) {
    await p.click('#btnParams', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(400);
  }
  for (const acc of await p.$$('.dc-sec.closed .dc-sec-h, details:not([open]) > summary')) {
    await acc.click({ timeout: 2500 }).catch(() => {});
    await p.waitForTimeout(90);
  }
}

/* ⚠️ NON VA IN npm test: non e' un banco, e' l'ATTREZZO che tutti i banchi
   importano (SUPERFICI, apriSuperficie, sezioniDi). Gira dentro di loro. */
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

/* ⚠️ QUESTO ELENCO È LA COPERTURA DI TUTTI I BANCHI DEL BROWSER: un'app che non
   sta qui non viene guardata da nessuno, e nessuno se ne accorge — i banchi
   dicono «ok» sulle sette che vedono. Conti è rimasta fuori fino al 30/07 e in
   tre banchi diversi non è mai stata aperta. Quando nasce un'app si aggiunge
   qui, subito. */
export const SUPERFICI = [
  ['core', '/index.html'],
  ['vetrina', '/apps/index.html'],
  ['campo', '/apps/campo/index.html'],
  ['conti', '/apps/conti/index.html'],
  ['flotta', '/apps/flotta/index.html'],
  ['scudo', '/apps/scudo/index.html'],
  ['sentinella', '/apps/sentinella/index.html'],
  ['terra', '/apps/terra/index.html'],
  ['genesi', '/apps/genesi/genesi.html'],
  /* ⛔ ENTRATE IL 01/08, e la ragione è che i banchi dicevano «tutte le
     superfici» e ne conoscevano NOVE. `run-stile.mjs` le guardava già da
     giorni; qui no — quindi su queste due pagine nessun banco ha mai misurato
     il contrasto, gli id doppi, il fuori-schermo o i bersagli di tocco.
     Non sono pagine di servizio: la prima è quella in cui finisce chi non ha
     un permesso — cioè un momento in cui l'utente è già in difficoltà — e la
     seconda è il portone di Genesi, la prima cosa che si vede.
     ⚠️ Un elenco tenuto a mano si aggiorna quando qualcuno se ne ricorda: il
     controllo in fondo a questo file pretende che le due liste combacino. */
  ['id · non autorizzato', '/apps/deepwork-id/non-autorizzato.html'],
  ['genesi · accesso', '/apps/genesi/login.html'],
  /* ⛔ ENTRATE il 01/08, e la ragione è che il controllo che le due liste
     combacino era **dichiarato in questo commento e non esisteva**: le regole
     di stile guardavano quindici superfici, il giro undici. Queste tre le apre
     un cliente davvero — è dove si accede, dove si guarda il proprio profilo e
     dove il titolare amministra l'organizzazione — e nessun banco le aveva mai
     misurate. Non hanno barra di navigazione: `sezioniDi` risponde [''] e
     vengono guardate in una passata sola, che è quello che serve. */
  ['id · accesso', '/apps/deepwork-id/index.html'],
  ['id · profilo', '/apps/deepwork-id/profilo.html'],
  ['id · amministrazione', '/apps/deepwork-id/admin.html'],
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
  if (nome === 'core') {
    /* ⛔ FINO AL 03/08 QUI IL CORE RESTAVA SULLA SCHERMATA D'ACCESSO, e ogni
       banco che «guardava il core» guardava un guscio vuoto. Misurato:
       **1.036 elementi, 258 caratteri di testo, UN bottone visibile**, e in
       `@volate` 107 caratteri. `state.user` iniettato non basta: senza dati il
       `DB` è vuoto e le schermate non disegnano niente. Il segno da leggere
       era già stampato dal banco delle modali — «core: nessuna modale aperta —
       il banco NON ha guardato questa superficie (nel suo programma ce ne sono
       68 da aprire)» — cioè il controllo lo DICHIARAVA e nessuno lo leggeva.
       Due cose servono, e sono tutt'e due in CLAUDE.md già pagate a caro
       prezzo:
       1. il finto Firestore deve **RIFIUTARE**. Se risponde «nessun documento»
          il core crede di essere al primo avvio, semina il database e
          l'accesso risponde «Credenziali errate» su credenziali giuste: i dati
          d'esempio si caricano solo passando dal ripiego;
       2. l'accesso va **ritentato**, perché i dati arrivano DOPO che `doLogin`
          esiste. */
    const dentro = await accediAlCore(p);
    /* ⛔ E SE NON CI SI RIESCE, LO SI DICE. Un banco che misura il guscio della
       schermata d'accesso credendo di misurare l'app è la stessa cosa che
       questa correzione è nata per togliere: sotto carico (il giro completo
       più tre cantieri) i tentativi possono esaurirsi, e allora il numero che
       esce è di un'altra pagina. La riga costa niente e si vede nel riepilogo
       del banco che la stampa. */
    if (!dentro) console.warn('  ⚠️  core: non si è riusciti ad ACCEDERE — quello che segue misura la schermata d\'accesso, non l\'app');
    await p.evaluate((u) => window.__provaUtente(u), UTENTE_PROVA(ruolo));
  }
  return { ctx, p, errori };
}

/* Entra nel core coi dati d'esempio. Torna `true` se ci è riuscito: chi la
   chiama può dichiarare di aver guardato un guscio vuoto invece di tacere. */
export async function accediAlCore(p) {
  const { MODULI } = await import('./finto-firebase.mjs');
  await p.route('https://www.gstatic.com/firebasejs/**firebase-firestore.js', (r) =>
    r.fulfill({ status: 200, contentType: 'text/javascript',
      body: MODULI['firebase-firestore.js'].replace(
        "export async function getDoc() { return { exists: () => false, data: () => null, id: 'finto' }; }",
        "export async function getDoc(){ const e=new Error('finto'); e.code='permission-denied'; throw e; }") }));
  await p.reload({ waitUntil: 'load' }).catch(() => {});
  await p.waitForFunction(() => typeof window.doLogin === 'function', { timeout: 30000 }).catch(() => {});
  /* ⚠️ I DATI ARRIVANO DOPO `doLogin`, e sotto carico anche parecchio dopo:
     cliccare troppo presto legge «Credenziali errate» su credenziali giuste.
     Si aspetta il segnale vero — la lista degli utenti nel DB — e solo dopo si
     prova, con dieci tentativi invece di sei. */
  await p.waitForFunction(() => {
    const b = document.getElementById('btn-login');
    return !!b && !b.disabled;
  }, { timeout: 30000 }).catch(() => {});
  for (let giro = 0; giro < 10; giro++) {
    const dentro = await p.evaluate(() => {
      const h = document.getElementById('screen-home');
      return !!h && getComputedStyle(h).display !== 'none';
    }).catch(() => false);
    if (dentro) return true;
    await p.fill('#lu', 'admin').catch(() => {});
    await p.fill('#lp', 'admin').catch(() => {});
    await p.click('#btn-login').catch(() => {});
    await p.waitForFunction(() => {
      const h = document.getElementById('screen-home');
      return !!h && getComputedStyle(h).display !== 'none';
    }, { timeout: 2500 }).catch(() => {});
  }
  return false;
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
  /* ⛔ CHIAMATA CON DUE ARGOMENTI: NON NAVIGA, E NON SE NE ACCORGE NESSUNO.
     Successo il 01/08 scrivendo una sonda: `vaiA(p, sez)` mette la sezione in
     `nome`, lascia `sezione` a `undefined`, e la funzione esce senza cliccare
     niente. La sonda ha girato otto sezioni di Conti misurando **otto volte la
     stessa schermata** — e il risultato non sembrava rotto, sembrava un
     prodotto strano: la stessa riga che compariva in ogni sezione. Da lì una
     conclusione sbagliata sul prodotto, e mezz'ora buttata a cercarla nel posto
     sbagliato.
     Non è la firma a essere sbagliata (i banchi la usano bene da sempre): è che
     l'errore è **silenzioso**, e un banco che non naviga risponde «tutto a
     posto» dopo aver guardato una schermata su otto. Costa una riga impedirlo.
     ⚠️ Il controllo è sul NUMERO di argomenti, non sul valore: `sezione` vuota
     è legittima — è quello che risponde `sezioniDi` per le pagine senza barra
     di navigazione, e vuol dire «guardala tutta in una passata». */
  if (arguments.length < 3) {
    throw new Error('vaiA(p, nome, sezione) vuole TRE argomenti: chiamata con '
      + `${arguments.length} ("${nome}" e' finito in \`nome\`). Senza il terzo non naviga, `
      + 'e il banco misurerebbe la stessa schermata a ogni giro.');
  }
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
